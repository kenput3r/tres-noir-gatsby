import React, { createContext, ReactChild, useState, useMemo } from "react"
import Cookies from "js-cookie"

const customerAccessTokenCookie = "_tn_cat"
const customerEmailCookie = "_tn_customer_email"

interface DefaultContext {
  customerAccessToken: null | string
  setCustomerAccessToken: (value: null | string) => void
  customerEmail: null | string
  login: (
    email: string,
    password: string
  ) => Promise<{ loggedIn: boolean; message?: string }>
  logout: () => void
  associateCheckout: (checkoutId: string) => Promise<void>
}

const defaultContext: DefaultContext = {
  customerAccessToken: null,
  setCustomerAccessToken: (customerAccessToken: string | null) => {},
  customerEmail: null,
  login: async (email: string, password: string) => {
    return { loggedIn: false, message: "" }
  },
  logout: () => {},
  associateCheckout: async (checkoutId: string) => {},
}

export const CustomerContext = createContext(defaultContext)

export const CustomerProvider = ({ children }: { children: ReactChild }) => {
  const accessToken = Cookies.get(customerAccessTokenCookie)
  const email = Cookies.get(customerEmailCookie)
  const [customerAccessToken, setCustomerAccessToken] = useState<null | string>(
    accessToken || null
  )
  const [customerEmail, setCustomerEmail] = useState<null | string>(
    email || null
  )

  const logout = () => {
    Cookies.remove(customerAccessTokenCookie)
    Cookies.remove(customerEmailCookie)
    setCustomerAccessToken(null)
  }

  const login = async (email: string, password: string) => {
    const query = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `
    try {
      const response = await fetch(
        `${process.env.GATSBY_STORE_ENDPOINT}.json`,
        {
          method: "POST",
          headers: {
            "X-Shopify-Storefront-Access-Token": process.env
              .GATSBY_STORE_STOREFRONT_TOKEN as string,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            variables: { input: { email, password } },
          }),
        }
      )
      const json = await response.json()
      let loggedIn = false
      if (json.data) {
        const { customerAccessToken, customerUserErrors } =
          json.data.customerAccessTokenCreate
        if (customerUserErrors.length > 0) {
          throw new Error(customerUserErrors[0].message)
        } else {
          Cookies.set(
            customerAccessTokenCookie,
            customerAccessToken.accessToken,
            {
              expires: new Date(customerAccessToken.expiresAt),
            }
          )
          Cookies.set(customerEmailCookie, email, {
            expires: new Date(customerAccessToken.expiresAt),
          })
          setCustomerAccessToken(customerAccessToken.accessToken)
          setCustomerEmail(email)
          loggedIn = true
        }
      } else {
        alert("ERROR: please try again later...")
      }
      return { loggedIn }
    } catch (err: any) {
      console.log("ERROR", err.message)
      return {
        loggedIn: false,
        message: err.message,
      }
    }
  }

  const associateCheckout = async (checkoutId: string) => {
    if (!customerAccessToken) return
    const query = `
      mutation associateCustomerWithCheckout($checkoutId: ID!, $customerAccessToken: String!) {
        checkoutCustomerAssociateV2(checkoutId: $checkoutId, customerAccessToken: $customerAccessToken) {
          checkout {
            id
          }
          checkoutUserErrors {
            code
            field
            message
          }
          customer {
            id
          }
        }
      }
    `
    try {
      const response = await fetch(
        `${process.env.GATSBY_STORE_ENDPOINT}.json`,
        {
          method: "POST",
          headers: {
            "X-Shopify-Storefront-Access-Token": process.env
              .GATSBY_STORE_STOREFRONT_TOKEN as string,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            variables: { checkoutId, customerAccessToken },
          }),
        }
      )
      const json = await response.json()
      if (json.data) {
        const { checkout, checkoutUserErrors, customer } =
          json.data.checkoutCustomerAssociateV2
        if (checkoutUserErrors.lengh > 0) {
          alert(`ERRROR: ${checkoutUserErrors[0].message}`)
          throw new Error(checkoutUserErrors[0].message)
        }
      }
    } catch (err: any) {
      console.log("ERROR", err.message)
    }
  }

  const value = useMemo(
    () => ({
      customerAccessToken,
      setCustomerAccessToken,
      customerEmail,
      login,
      logout,
      associateCheckout,
    }),
    [customerAccessToken]
  )

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  )
}
