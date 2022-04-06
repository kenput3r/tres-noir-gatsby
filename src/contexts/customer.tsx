import React, { createContext, ReactChild, useState, useMemo } from "react"
import Cookies from "js-cookie"

const customerAccessTokenCookie = "tn_g_auth"
const customerEmailCookie = "tn_g_customer"

interface DefaultContext {
  customerAccessToken: null | string
  setCustomerAccessToken: (value: null | string) => void
  customerEmail: null | string
  // login: (
  //   data: { accessToken: string; expiresAt: string },
  //   email: string
  // ) => void
  login: any
  logout: () => void
}

const defaultContext: DefaultContext = {
  customerAccessToken: null,
  setCustomerAccessToken: (customerAccessToken: string | null) => {},
  customerEmail: null,
  // login: (data, email) => {},
  login: (email: string, password: string) => {},
  logout: () => {},
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
    setCustomerAccessToken(null)
  }

  // const login = (
  //   data: { accessToken: string; expiresAt: string },
  //   email: string
  // ) => {
  //   Cookies.set("tn-login", data.accessToken, {
  //     expires: new Date(data.expiresAt),
  //   })
  //   setCustomerAccessToken(data.accessToken)
  //   // setEmail(email)
  // }

  const login = async (email: string, password: string) => {
    console.log("LOGGING IN")
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
        console.log("JSON DATA", json.data)
        const { customerAccessToken, customerUserErrors } =
          json.data.customerAccessTokenCreate
        if (customerUserErrors.length > 0) {
          alert(`ERROR: ${customerUserErrors[0].message}`)
        } else {
          console.log("TOKEN", customerAccessToken)
          console.log("CREATING AUTH COOKIE")
          Cookies.set(
            customerAccessTokenCookie,
            customerAccessToken.accessToken,
            {
              expires: new Date(customerAccessToken.expiresAt),
            }
          )
          console.log("CREATING EMAIL COOKIE")
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
      return loggedIn
    } catch (err: any) {
      console.log("ERROR", err.message)
      return false
    }
  }

  const value = useMemo(
    () => ({
      customerAccessToken,
      setCustomerAccessToken,
      customerEmail,
      login,
      logout,
    }),
    [customerAccessToken]
  )

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  )
}
