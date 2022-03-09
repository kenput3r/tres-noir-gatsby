import React, { createContext, useState, useEffect, useMemo } from "react"
import Client, { Cart } from "shopify-buy"
import { Checkout } from "../types/checkout"

const client = Client.buildClient({
  domain: process.env.GATSBY_STORE_MY_SHOPIFY as string,
  storefrontAccessToken: process.env.GATSBY_STORE_STOREFRONT_TOKEN as string,
})

const isBrowser = typeof window !== "undefined"

export const CartContext = createContext({
  isDrawerOpen: false,
  setIsDrawerOpen: (value: boolean) => {},
  isActive: "",
  setIsActive: (value: string) => {},
  closeDrawer: () => {},
  checkout: {},
  addProductToCart: (variantId: string, quantity: number) => {},
  addProductsToCart: (
    lineItems: { variantId: string; quantity: number }[]
  ) => {},
  removeProductFromCart: (lineItemId: string) => {},
  updateProductInCart: (variantId: string, quantity: number) => {},
  addDiscountCode: (code: string) => {},
  removeDiscountCode: () => {},
})

export const CartProvider = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isActive, setIsActive] = useState("shop")
  const [checkout, setCheckout] = useState<any>()

  /**
   * @function getCheckoutCookie - gets the current non-expired chechout cookie
   */
  const getCheckoutCookie = () => {
    const name = "shopifyCheckout="
    const decodedDocumentCookie = decodeURIComponent(document.cookie)
    const cookies = decodedDocumentCookie.split(";")
    for (let cookie of cookies) {
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1)
      }
      if (cookie.indexOf(name) === 0) {
        cookie = cookie.substring(name.length, cookie.length)
        return cookie
      }
    }
    return null
  }

  /**
   * @function getNewCheckout - creates a new Shopify checkout
   * and sets the shopifyCheckout cookie (Shopify checkout ID)
   */
  const getNewCheckout = async () => {
    const newCheckout = await client.checkout.create()
    if (isBrowser) {
      document.cookie = `shopifyCheckout=${newCheckout.id};max-age=2592000;SameSite=Strict;`
      const now = new Date()
      localStorage.setItem(
        "checkout",
        JSON.stringify({ value: newCheckout, expiry: now.getTime() + 2592000 })
      )
    }
    console.log("NEW CHECKOUT", newCheckout)
    return newCheckout
    // try {
    //   const newCheckout = await client.checkout.create()
    //   if (isBrowser) {
    //     document.cookie = `shopifyCheckout=${newCheckout.id};max-age=2592000`
    //   }
    //   return newCheckout
    // } catch (e) {
    //   console.error(e)
    // }
  }

  // Shopify Buy Cart types outdated
  interface LocalCheckout {
    value: Checkout
    expiry: number
  }

  useEffect(() => {
    /**
     * @function initializeCheckout - fetches current or creates new Shopify checkout
     * sets checkout [setCheckout]
     */
    const initializeCheckout = async () => {
      const validateLocalCheckout = async (localCheckout: LocalCheckout) => {
        const now = new Date()
        if (now.getTime() > localCheckout.expiry) {
          console.log("LOCAL STORAGE CHECKOUT EXPIRED")
          localStorage.removeItem("checkout")
          // eslint-disable-next-line no-return-await
          return await getNewCheckout()
        }
        console.log("LOCAL STORAGE CHECKOUT NOT EXPIRED")
        return localCheckout.value
      }
      try {
        // Check if checkout exists
        const checkoutId = isBrowser ? getCheckoutCookie() : null
        let _checkout: Cart | Checkout
        // if Checkout exists, fetch it from Shopify
        if (checkoutId) {
          // Get Local Checkout
          let localCheckout: string | null | LocalCheckout =
            localStorage.getItem("checkout")
          console.log("CHECK IF LOCAL CHECKOUT EXISTS")
          if (localCheckout) {
            console.log("LOCAL CHECKOUT EXISTS")
            localCheckout = JSON.parse(localCheckout as string) as LocalCheckout
            console.log("VALIDATING EXPIRY")
            _checkout = await validateLocalCheckout(localCheckout)
          } else {
            _checkout = await client.checkout.fetch(checkoutId)
            console.log(
              "LOCAL CHECKOUT DOESN'T EXIST, FETCH IT FROM SHOPIFY",
              _checkout
            )
            if (isBrowser) {
              const now = new Date()
              localStorage.setItem(
                "checkout",
                JSON.stringify({
                  value: _checkout,
                  expiry: now.getTime() + 259200,
                })
              )
            }
          }
          if (_checkout.completedAt) {
            _checkout = await getNewCheckout()
            console.log("CHECKOUT EXPIRED, LETS CREATE A NEW ONE", _checkout)
          }
          // if no Checkout exists, create a new one
        } else {
          _checkout = await getNewCheckout()
          console.log("NO CHECKOUT EXISTS, LETS CREATE ONE", _checkout)
        }
        setCheckout(_checkout)
      } catch (err: any) {
        console.error("ERROR", err.message)
      }
    }
    initializeCheckout()
  }, [])

  const value = useMemo(() => {
    const closeDrawer = () => {
      setIsDrawerOpen(false)
    }

    const addProductToCart = async (variantId: string, quantity: number) => {
      try {
        const lineItems = [
          {
            variantId,
            quantity,
          },
        ]
        const updatedCheckout = await client.checkout.addLineItems(
          checkout.id,
          lineItems
        )
        console.log("ADDED PRODUCT TO CART", updatedCheckout)
        if (isBrowser) {
          const now = new Date()
          localStorage.setItem(
            "checkout",
            JSON.stringify({
              value: updatedCheckout,
              expiry: now.getTime() + 259200,
            })
          )
        }
        setCheckout(updatedCheckout)
      } catch (e) {
        console.error(e)
      }
    }

    const addProductsToCart = async (
      lineItems: { variantId: string; quantity: number }[]
    ) => {
      try {
        const updatedCheckout = await client.checkout.addLineItems(
          checkout.id,
          lineItems
        )
        console.log("ADDED PRODUCT TO CART", updatedCheckout)
        if (isBrowser) {
          const now = new Date()
          localStorage.setItem(
            "checkout",
            JSON.stringify({
              value: updatedCheckout,
              expiry: now.getTime() + 259200,
            })
          )
        }
        setCheckout(updatedCheckout)
      } catch (e) {
        console.error(e)
      }
    }

    const removeProductFromCart = async (lineItemId: string) => {
      try {
        const updatedCheckout = await client.checkout.removeLineItems(
          checkout.id,
          [lineItemId]
        )
        console.log("REMOVED PRODUCT FROM CART", updatedCheckout)
        if (isBrowser) {
          const now = new Date()
          localStorage.setItem(
            "checkout",
            JSON.stringify({
              value: updatedCheckout,
              expiry: now.getTime() + 259200,
            })
          )
        }
        setCheckout(updatedCheckout)
      } catch (e) {
        console.error(e)
      }
    }

    const updateProductInCart = async (id: string, quantity: number) => {
      try {
        const lineItems = [
          {
            id,
            quantity,
          },
        ]
        const updatedCheckout = await client.checkout.updateLineItems(
          checkout.id,
          lineItems
        )
        console.log("ADDED PRODUCT TO CART", updatedCheckout)
        if (isBrowser) {
          const now = new Date()
          localStorage.setItem(
            "checkout",
            JSON.stringify({
              value: updatedCheckout,
              expiry: now.getTime() + 259200,
            })
          )
        }
        setCheckout(updatedCheckout)
      } catch (e) {
        console.error(e)
      }
    }

    const addDiscountCode = async (code: string) => {
      try {
        const updatedCheckout = await client.checkout.addDiscount(
          checkout.id,
          code
        )
        console.log("ADDED DISCOUNT TO CART", updatedCheckout)
        if (isBrowser) {
          const now = new Date()
          localStorage.setItem(
            "checkout",
            JSON.stringify({
              value: updatedCheckout,
              expiry: now.getTime() + 259200,
            })
          )
        }
        setCheckout(updatedCheckout)
      } catch (e) {
        console.error(e)
      }
    }

    const removeDiscountCode = async () => {
      try {
        const updatedCheckout = await client.checkout.removeDiscount(
          checkout.id
          // code
        )
        console.log("REMOVED DISCOUNT FROM CART", updatedCheckout)
        if (isBrowser) {
          const now = new Date()
          localStorage.setItem(
            "checkout",
            JSON.stringify({
              value: updatedCheckout,
              expiry: now.getTime() + 259200,
            })
          )
        }
        setCheckout(updatedCheckout)
      } catch (e) {
        console.error(e)
      }
    }
    return {
      isDrawerOpen,
      setIsDrawerOpen,
      isActive,
      setIsActive,
      closeDrawer,
      checkout,
      addProductToCart,
      addProductsToCart,
      removeProductFromCart,
      updateProductInCart,
      addDiscountCode,
      removeDiscountCode,
    }
  }, [isDrawerOpen, setIsDrawerOpen, isActive, setIsActive, checkout])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
