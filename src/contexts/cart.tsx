import React, { createContext, useState, useEffect } from "react"
import Client, { Cart } from "shopify-buy"

const client = Client.buildClient({
  domain: process.env.GATSBY_STORE_MY_SHOPIFY as string,
  storefrontAccessToken: process.env.GATSBY_STORE_TOKEN as string,
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
  removeProductFromCart: (lineItemId: string) => {},
  addDiscountCode: (code: string) => {},
  removeDiscountCode: () => {},
})

export const CartProvider = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isActive, setIsActive] = useState("shop")
  const [checkout, setCheckout] = useState<any>()
  const closeDrawer = () => {
    setIsDrawerOpen(false)
  }

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
      document.cookie = `shopifyCheckout=${newCheckout.id};max-age=2592000`
      localStorage.setItem("checkout", JSON.stringify(newCheckout))
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

  /**
   * @function addProductToCart - Adds product to the current checkout
   * @param {String} variantId - shopifyId
   * @param {Int} quantity - quantity
   */
  const addProductToCart = async (variantId: string, quantity: number) => {
    try {
      const line_items = [
        {
          variantId,
          quantity,
        },
      ]
      const updatedCheckout = await client.checkout.addLineItems(
        checkout.id,
        line_items
      )
      console.log("ADDED PRODUCT TO CART", updatedCheckout)
      if (isBrowser)
        localStorage.setItem("checkout", JSON.stringify(updatedCheckout))
      setCheckout(updatedCheckout)
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * @function removeProductFromCart - removes a line item from the current checkout
   * @param {String} lineItemId the ID of the line item to remove
   */
  const removeProductFromCart = async (lineItemId: string) => {
    try {
      const updatedCheckout = await client.checkout.removeLineItems(
        checkout.id,
        [lineItemId]
      )
      console.log("REMOVED PRODUCT FROM CART", updatedCheckout)
      if (isBrowser)
        localStorage.setItem("checkout", JSON.stringify(updatedCheckout))
      setCheckout(updatedCheckout)
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * @function addDiscountCode - adds a discount code the the current checkout
   * @param {String} code - the code to add
   */
  const addDiscountCode = async (code: string) => {
    try {
      const updatedCheckout = await client.checkout.addDiscount(
        checkout.id,
        code
      )
      console.log("ADDED DISCOUNT TO CART", updatedCheckout)
      if (isBrowser)
        localStorage.setItem("checkout", JSON.stringify(updatedCheckout))
      setCheckout(updatedCheckout)
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * @function removeDiscountCode - removes a discount code from the current checkout
   * @param {String} code - the code to remove
   */
  const removeDiscountCode = async () => {
    try {
      const updatedCheckout = await client.checkout.removeDiscount(
        checkout.id
        // code
      )
      console.log("REMOVED DISCOUNT FROM CART", updatedCheckout)
      if (isBrowser)
        localStorage.setItem("checkout", JSON.stringify(updatedCheckout))
      setCheckout(updatedCheckout)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    /**
     * @function initializeCheckout - fetches current or creates new Shopify checkout
     * sets checkout [setCheckout]
     */
    const initializeCheckout = async () => {
      try {
        //Check if checkout exists
        const checkoutId = isBrowser ? getCheckoutCookie() : null
        let checkout: Cart
        //if Checkout exists, fetch it from Shopify
        if (checkoutId) {
          //Get Local Checkout
          const localCheckout = localStorage.getItem("checkout")
          if (localCheckout) {
            checkout = JSON.parse(localCheckout)
          } else {
            checkout = await client.checkout.fetch(checkoutId)
            if (isBrowser)
              localStorage.setItem("checkout", JSON.stringify(checkout))
          }
          console.log("CHECKOUT EXISTS, FETCH IT FROM SHOPIFY", checkout)
          if (checkout.completedAt) {
            checkout = await getNewCheckout()
            console.log("CHECKOUT EXPIRED, LETS CREATE A NEW ONE", checkout)
          }
          //if no Checkout exists, create a new one
        } else {
          checkout = await getNewCheckout()
          console.log("NO CHECKOUT EXISTS, LETS CREATE ONE", checkout)
        }
        setCheckout(checkout)
      } catch (e) {
        console.error(e)
      }
    }
    initializeCheckout()
  }, [])

  return (
    <CartContext.Provider
      value={{
        isDrawerOpen,
        setIsDrawerOpen,
        isActive,
        setIsActive,
        closeDrawer,
        checkout,
        addProductToCart,
        removeProductFromCart,
        addDiscountCode,
        removeDiscountCode,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
