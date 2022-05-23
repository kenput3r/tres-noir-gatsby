import React, { createContext, useState, useEffect, useMemo } from "react"
import Client, { Cart } from "shopify-buy"
import {
  Checkout,
  tnItem,
  CustomLineItem,
  ImageHashTable,
  ImageStorage,
} from "../types/checkout"
import { IGatsbyImageData } from "gatsby-plugin-image"

const client = Client.buildClient({
  domain: process.env.GATSBY_STORE_MY_SHOPIFY as string,
  storefrontAccessToken: process.env.GATSBY_STORE_STOREFRONT_TOKEN as string,
})

const isBrowser = typeof window !== "undefined"

const DefaultContext = {
  isDrawerOpen: false,
  setIsDrawerOpen: (value: boolean) => {},
  isActive: "",
  setIsActive: (value: string) => {},
  closeDrawer: () => {},
  checkout: {
    appliedGiftCards: [],
    completedAt: null,
    createdAt: "",
    currencyCode: "",
    customAttributes: [],
    discountApplications: [],
    email: null,
    id: "",
    lineItems: [],
    lineItemsSubtotalPrice: {
      amount: "",
      currencyCode: "",
    },
    note: null,
    subtotalPrice: "",
    subtotalPriceV2: {
      amount: "",
      currencyCode: "",
    },
    totalPrice: "",
    tnLineItems: [],
    webUrl: "",
  },
  addProductToCart: (
    variantId: string,
    quantity: number,
    sku: string,
    image: IGatsbyImageData
  ) => {},
  addProductsToCart: (
    lineItems: { variantId: string; quantity: number }[]
  ) => {},
  addProductCustomToCart: (
    items: CustomLineItem[],
    key: string,
    image: IGatsbyImageData
  ) => {},
  removeProductFromCart: (lineItemId: string, imageId: string) => {},
  removeProductsFromCart: (lineItemIds: [], imageId: string) => {},
  updateProductInCart: (
    variantId: string,
    quantity: number,
    imageId: string
  ) => {},
  addDiscountCode: (code: string) => {},
  removeDiscountCode: () => {},
}

export const CartContext = createContext(DefaultContext)

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
      newCheckout["tnLineItems"] = []
      localStorage.setItem(
        "checkout",
        JSON.stringify({ value: newCheckout, expiry: now.getTime() + 2592000 })
      )
      // reset image storage if new checkout
      localStorage.setItem(
        "cart-images",
        JSON.stringify({
          value: {
            checkoutId: newCheckout.id,
            images: {},
          },
          expiry: now.getTime() + 2592000,
        })
      )
    }
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

  const addToImageStorage = (
    id: string,
    image: IGatsbyImageData,
    checkoutId: string
  ) => {
    if (isBrowser) {
      const now = new Date()
      let cartImages = localStorage.getItem("cart-images")
      let parsedImages: ImageHashTable = {
        checkoutId: checkoutId,
        images: {},
      }
      if (cartImages) {
        const localImages = JSON.parse(cartImages) as ImageStorage
        parsedImages = localImages.value
      }
      parsedImages.images[id] = image
      localStorage.setItem(
        "cart-images",
        JSON.stringify({
          value: parsedImages,
          expiry: now.getTime() + 2592000,
        })
      )
    }
  }

  const removeFromImageStorage = (id: string) => {
    if (isBrowser) {
      const now = new Date()
      let cartImages = localStorage.getItem("cart-images")
      if (cartImages) {
        const localImages = JSON.parse(cartImages) as ImageStorage
        const parsedImages = localImages.value
        delete parsedImages.images[id]
        localStorage.setItem(
          "cart-images",
          JSON.stringify({
            value: parsedImages,
            expiry: now.getTime() + 2592000,
          })
        )
      }
    }
  }

  const getImageFromLocalStorage = (id: string) => {
    if (isBrowser) {
      let cartImages = localStorage.getItem("cart-images")
      if (!cartImages) {
        return null
      }
      const parsedImages = JSON.parse(cartImages) as ImageStorage
      return parsedImages.value.images[id]
    }
  }

  const rebuildBundles = checkout => {
    let itemsToAdd: tnItem[] = []
    let itemsMap = new Map()
    checkout.lineItems.forEach(item => {
      // non-custom item
      if (item.customAttributes.length === 0) {
        itemsMap.set(item.variant.sku, [{ shopifyItem: item }])
      } else {
        // custom item
        const foundProperties = item.customAttributes
          .filter(
            el => el.key === "customizationId" || el.key === "customizationStep"
          )
          .map(el => el.value)
        if (foundProperties.length === 2) {
          const key = foundProperties[0]
          const step = foundProperties[1]
          if (itemsMap.has(key)) {
            let currentArr = itemsMap.get(key)
            currentArr.push({
              stepNumber: step,
              shopifyItem: item,
            })
            itemsMap.set(key, currentArr)
          } else {
            itemsMap.set(key, [
              {
                stepNumber: step,
                shopifyItem: item,
              },
            ])
          }
        }
      }
    })
    itemsMap.forEach((value, key) => {
      if (value.length === 1) {
        itemsToAdd.push({
          id: key,
          lineItems: value,
          image: getImageFromLocalStorage(key),
          isCustom: false,
        })
      } else {
        itemsToAdd.push({
          id: key,
          lineItems: value.sort((a, b) => {
            return a.stepNumber - b.stepNumber
          }),
          image: getImageFromLocalStorage(key),
          isCustom: true,
        })
      }
    })
    checkout["tnLineItems"] = itemsToAdd
    // add to localStorage
    if (isBrowser) {
      const now = new Date()
      localStorage.setItem(
        "checkout",
        JSON.stringify({
          value: checkout,
          expiry: now.getTime() + 2592000,
        })
      )
    }
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
          localStorage.removeItem("checkout")
          localStorage.removeItem("cart-images")
          // eslint-disable-next-line no-return-await
          return await getNewCheckout()
        }
        return localCheckout.value
      }
      try {
        // Check if checkout exists
        const checkoutId = isBrowser ? getCheckoutCookie() : null
        let checkout: Cart | Checkout
        // if Checkout exists, fetch it from Shopify
        if (checkoutId) {
          // Get Local Checkout
          let localCheckout: string | null | LocalCheckout =
            localStorage.getItem("checkout")
          if (localCheckout) {
            localCheckout = JSON.parse(localCheckout as string) as LocalCheckout
            checkout = await validateLocalCheckout(localCheckout)
          } else {
            // local checkout doesn't exist, get checkout and create local
            checkout = await client.checkout.fetch(checkoutId)
            if (isBrowser) {
              const now = new Date()
              localStorage.setItem(
                "checkout",
                JSON.stringify({
                  value: checkout,
                  expiry: now.getTime() + 2592000,
                })
              )
            }
          }
          if (checkout.completedAt) {
            checkout = await getNewCheckout()
          }
          // if no Checkout exists, create a new one
        } else {
          checkout = await getNewCheckout()
        }
        setCheckout(checkout)
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

    const addProductToCart = async (
      variantId: string,
      quantity: number,
      sku: string,
      image: IGatsbyImageData
    ) => {
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
        addToImageStorage(sku, image, checkout.id)
        rebuildBundles(updatedCheckout)
        setCheckout(updatedCheckout)
        console.log("updated", updatedCheckout)
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
        if (isBrowser) {
          const now = new Date()
          localStorage.setItem(
            "checkout",
            JSON.stringify({
              value: updatedCheckout,
              expiry: now.getTime() + 2592000,
            })
          )
        }
        setCheckout(updatedCheckout)
      } catch (e) {
        console.error(e)
      }
    }

    const addProductCustomToCart = async (
      lineItems: CustomLineItem[],
      key: string,
      image: IGatsbyImageData
    ) => {
      try {
        const updatedCheckout = await client.checkout.addLineItems(
          checkout.id,
          lineItems
        )
        addToImageStorage(key, image, checkout.id)
        rebuildBundles(updatedCheckout)
        setCheckout(updatedCheckout)
        console.log("updated", updatedCheckout)
      } catch (e) {
        console.error(e)
      }
    }

    const removeProductFromCart = async (
      lineItemId: string,
      imageId: string
    ) => {
      try {
        const updatedCheckout = await client.checkout.removeLineItems(
          checkout.id,
          [lineItemId]
        )
        removeFromImageStorage(imageId)
        rebuildBundles(updatedCheckout)
        setCheckout(updatedCheckout)
      } catch (e) {
        console.error(e)
      }
    }

    const removeProductsFromCart = async (lineItemIds, imageId: string) => {
      try {
        const updatedCheckout = await client.checkout.removeLineItems(
          checkout.id,
          lineItemIds
        )
        removeFromImageStorage(imageId)
        rebuildBundles(updatedCheckout)
        setCheckout(updatedCheckout)
      } catch (e) {
        console.error(e)
      }
    }

    const updateProductInCart = async (
      id: string,
      quantity: number,
      imageId: string
    ) => {
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
        if (quantity === 0) {
          removeFromImageStorage(imageId)
        }
        rebuildBundles(updatedCheckout)
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
        if (isBrowser) {
          const now = new Date()
          localStorage.setItem(
            "checkout",
            JSON.stringify({
              value: updatedCheckout,
              expiry: now.getTime() + 2592000,
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
        if (isBrowser) {
          const now = new Date()
          localStorage.setItem(
            "checkout",
            JSON.stringify({
              value: updatedCheckout,
              expiry: now.getTime() + 2592000,
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
      removeProductsFromCart,
      updateProductInCart,
      addDiscountCode,
      removeDiscountCode,
      // customized products
      addProductCustomToCart,
    }
  }, [isDrawerOpen, setIsDrawerOpen, isActive, setIsActive, checkout])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
