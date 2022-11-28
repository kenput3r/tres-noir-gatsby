import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react"
import Client, { Cart } from "shopify-buy"
import {
  Checkout,
  tnItem,
  CustomLineItem,
  ImageHashTable,
  ImageStorage,
} from "../types/checkout"
import { SelectedVariants, SelectedVariantStorage } from "../types/global"
import { IGatsbyImageData } from "gatsby-plugin-image"
import { ErrorModalContext } from "../contexts/error"

const client = Client.buildClient({
  domain: process.env.GATSBY_STORE_MY_SHOPIFY as string,
  storefrontAccessToken: process.env.GATSBY_STORE_STOREFRONT_TOKEN as string,
})

import Cookies from "js-cookie"

const isBrowser = typeof window !== "undefined"

const DefaultContext = {
  isDrawerOpen: false,
  setIsDrawerOpen: (value: boolean) => {},
  isCartDrawerOpen: false,
  setIsCartDrawerOpen: (value: boolean) => {},
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
  isAddingToCart: false,
  setIsAddingToCart: (value: boolean) => {},
  addProductToCart: (
    variantId: string,
    quantity: number,
    sku: string,
    image: IGatsbyImageData
  ) => {},
  addProductsToCart: (
    lineItems: { variantId: string; quantity: number }[]
  ) => {},
  addSunglassesToCart: (
    lineItems: CustomLineItem[],
    image: IGatsbyImageData,
    key: string
  ) => {},
  addProductCustomToCart: (
    items: CustomLineItem[],
    key: string,
    image: IGatsbyImageData,
    resumeData: SelectedVariants,
    sku: string,
    handle: string,
    activateDrawer: boolean
  ) => {},
  removeProductFromCart: (lineItemId: string, imageId: string) => {},
  removeProductsFromCart: (
    lineItemIds: string[],
    imageId: string,
    hasDiscount?: boolean
  ) => {},
  removeCustomProductWithId: (id: string) => {},
  updateProductInCart: (
    variantId: string,
    quantity: number,
    imageId: string
  ) => {},
  addDiscountCode: (code: string) => {},
  removeDiscountCode: () => {},
  isLoading: false,
}

export const CartContext = createContext(DefaultContext)

export const CartProvider = ({ children }) => {
  const { renderErrorModal } = useContext(ErrorModalContext)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
  const [isActive, setIsActive] = useState("shop")
  const [checkout, setCheckout] = useState<any>()
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  /**
   * @function getCheckoutCookie - gets the current non-expired chechout cookie
   */
  const getCheckoutCookie = () => {
    return Cookies.get("shopifyCheckout")
  }

  /**
   * @function getNewCheckout - creates a new Shopify checkout
   * and sets the shopifyCheckout cookie (Shopify checkout ID)
   */
  const getNewCheckout = async () => {
    const newCheckout = await client.checkout.create()
    if (isBrowser) {
      Cookies.set("shopifyCheckout", String(newCheckout.id), {
        sameSite: "strict",
        expires: 2592000,
      })
      const now = new Date()
      // removing local storage objects
      localStorage.removeItem("checkout")
      localStorage.removeItem("cart-images")
      localStorage.removeItem("customs-resume")
      newCheckout["tnLineItems"] = []
      createBadgeCount(newCheckout)
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
      // reset custom product storage if new checkout
      localStorage.setItem(
        "customs-resume",
        JSON.stringify({
          value: {
            checkoutId: newCheckout.id,
            customs: {},
          },
          expiry: now.getTime() + 2592000,
        })
      )
    }
    return newCheckout
  }

  // creates cookie with cart item total for shopify site to use

  const createBadgeCount = checkout => {
    if (isBrowser) {
      let cartCount = 0
      if (checkout.tnLineItems) {
        checkout.tnLineItems.forEach((item: tnItem) => {
          if (!item.isCustom) {
            cartCount += item.lineItems[0].shopifyItem.quantity
          } else {
            cartCount += 1
          }
        })
        Cookies.set("tnCartCounter", String(cartCount), {
          expires: 2592000,
          domain: ".tresnoir.com",
        })
      }
    }
  }

  // adds a product from custom products local storage
  const addCustomToLocalStorage = (
    id: string,
    resumeData: SelectedVariants,
    sku: string,
    handle: string
  ) => {
    if (isBrowser) {
      const now = new Date()
      let currentData = localStorage.getItem("customs-resume")
      let parsedCustoms = {
        checkoutId: checkout.id,
        customs: {},
      }
      if (currentData) {
        const localCustoms = JSON.parse(currentData) as SelectedVariantStorage
        parsedCustoms = localCustoms.value
      }
      parsedCustoms.customs[id] = {
        selectedVariants: resumeData,
        sku: sku,
        handle: handle,
      }
      localStorage.setItem(
        "customs-resume",
        JSON.stringify({
          value: parsedCustoms,
          expiry: now.getTime() + 2592000,
        })
      )
    }
  }

  // removes a product from custom products local storage
  const removeCustomFromLocalStorage = (id: string) => {
    if (isBrowser) {
      const now = new Date()
      let storageCustoms = localStorage.getItem("customs-resume")
      if (storageCustoms) {
        const localCustoms = JSON.parse(
          storageCustoms
        ) as SelectedVariantStorage
        const parsedCustoms = localCustoms.value
        delete parsedCustoms.customs[id]
        localStorage.setItem(
          "customs-resume",
          JSON.stringify({
            value: parsedCustoms,
            expiry: now.getTime() + 2592000,
          })
        )
      }
    }
  }

  // adds a product to image local storage
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

  // removes a product from image local storage
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

  // gets a product image from local storage
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

  // rebuild tnLineItems
  const rebuildBundles = checkout => {
    let itemsToAdd: tnItem[] = []
    let itemsMap = new Map()
    checkout.lineItems.forEach(item => {
      // non-custom item
      if (item.customAttributes.length === 0) {
        // gift card does not have a sku, using id instead
        if (item.variant.product.handle === "gift-card") {
          itemsMap.set(item.variant.id, [{ shopifyItem: item }])
        } else {
          itemsMap.set(item.variant.sku, [{ shopifyItem: item }])
        }
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
      // normal item
      if (value.length === 1) {
        itemsToAdd.push({
          id: key,
          lineItems: value,
          image: getImageFromLocalStorage(key),
          isCustom: false,
        })
      }
      // sunglasses + case
      else if (value.length === 2) {
        itemsToAdd.push({
          id: key,
          lineItems: value.sort((a, b) => {
            return a.stepNumber - b.stepNumber
          }),
          image: getImageFromLocalStorage(key),
          isCustom: false,
        })
      }
      // customized lenses
      else {
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
    createBadgeCount(checkout)
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
          localStorage.removeItem("customs-resume")
          Cookies.remove("tnCartCounter")
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
          // fetch cart and check if completedAt
          const tempCheckout = await client.checkout.fetch(checkoutId)
          if (tempCheckout && tempCheckout.completedAt) {
            checkout = await getNewCheckout()
            setCheckout(checkout)
            return
          }
          // Get Local Checkout
          let localCheckout: string | null | LocalCheckout =
            localStorage.getItem("checkout")
          if (localCheckout) {
            localCheckout = JSON.parse(localCheckout as string) as LocalCheckout
            checkout = await validateLocalCheckout(localCheckout)
          } else {
            // create new checkout
            checkout = await getNewCheckout()
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
        renderErrorModal()
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
        setIsAddingToCart(true)
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
        setIsAddingToCart(false)
        setIsCartDrawerOpen(true)
      } catch (err: any) {
        console.error(err)
        setIsAddingToCart(false)
        renderErrorModal()
      }
    }

    const addProductsToCart = async (
      lineItems: { variantId: string; quantity: number }[]
    ) => {
      try {
        setIsAddingToCart(true)
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
        setIsAddingToCart(false)
        setIsCartDrawerOpen(true)
      } catch (err: any) {
        console.error(err)
        setIsAddingToCart(false)
        renderErrorModal()
      }
    }

    const addSunglassesToCart = async (
      lineItems: CustomLineItem[],
      image: IGatsbyImageData,
      key: string
    ) => {
      try {
        setIsAddingToCart(true)
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
        addToImageStorage(key, image, checkout.id)
        rebuildBundles(updatedCheckout)
        setCheckout(updatedCheckout)
        setIsAddingToCart(false)
        setIsCartDrawerOpen(true)
      } catch (err: any) {
        console.error(err)
        setIsAddingToCart(false)
        renderErrorModal()
      }
    }

    const addProductCustomToCart = async (
      lineItems: CustomLineItem[],
      key: string,
      image: IGatsbyImageData,
      resumeData: SelectedVariants,
      sku: string,
      handle: string,
      activateDrawer: boolean
    ) => {
      try {
        setIsAddingToCart(true)
        const updatedCheckout = await client.checkout.addLineItems(
          checkout.id,
          lineItems
        )
        addToImageStorage(key, image, checkout.id)
        rebuildBundles(updatedCheckout)
        setCheckout(updatedCheckout)
        // add necessary data to localStorage to be able to resume from cart later on
        addCustomToLocalStorage(key, resumeData, sku, handle)
        setIsAddingToCart(false)
        if (activateDrawer) setIsCartDrawerOpen(true)
      } catch (err: any) {
        console.error(err)
        setIsAddingToCart(false)
        renderErrorModal()
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
      } catch (err: any) {
        console.error(err)
        renderErrorModal()
      }
    }

    const removeProductsFromCart = async (
      lineItemIds: string[],
      imageId: string,
      hasDiscount: boolean = false
    ) => {
      try {
        setIsLoading(true)
        if (hasDiscount) {
          console.log("HAS DISCOUNT", hasDiscount)
          // check if cart contains only 2 items

          if (checkout) {
            if (
              checkout.discountApplications.length > 0 &&
              checkout.lineItems.length === 2
            ) {
              const newCheckout = await getNewCheckout()
              setCheckout(newCheckout)
              return
            }
          }

          for (const lineItemId of lineItemIds) {
            const updatedCheckout = await client.checkout.removeLineItems(
              checkout.id,
              [lineItemId]
            )
            rebuildBundles(updatedCheckout)
            setCheckout(updatedCheckout)
          }
          removeFromImageStorage(imageId)
          removeCustomFromLocalStorage(imageId)
          setIsLoading(false)
        } else {
          console.log("DOES NOT HAVE DISCOUNT", hasDiscount)
          const updatedCheckout = await client.checkout.removeLineItems(
            checkout.id,
            lineItemIds
          )
          removeFromImageStorage(imageId)
          removeCustomFromLocalStorage(imageId)
          rebuildBundles(updatedCheckout)
          setCheckout(updatedCheckout)
        }
      } catch (err: any) {
        console.error(err)
        setIsLoading(false)
        renderErrorModal()
      }
    }

    // const removeProductsFromCart = async (
    //   lineItemIds: string[],
    //   imageId: string
    // ) => {
    //   try {
    //     // const updatedCheckout = await client.checkout.removeLineItems(
    //     //   checkout.id,
    //     //   lineItemIds
    //     // )
    //     // removeFromImageStorage(imageId)
    //     // removeCustomFromLocalStorage(imageId)
    //     // rebuildBundles(updatedCheckout)
    //     // setCheckout(updatedCheckout)

    //     // fix for removing discounted item
    //     for (const lineItemId of lineItemIds) {
    //       const updatedCheckout = await client.checkout.removeLineItems(
    //         checkout.id,
    //         [lineItemId]
    //       )

    //       removeFromImageStorage(imageId)
    //       removeCustomFromLocalStorage(imageId)
    //       rebuildBundles(updatedCheckout)
    //       setCheckout(updatedCheckout)
    //     }
    //   } catch (err: any) {
    //     console.error(err)
    //     renderErrorModal()
    //   }
    // }

    // removes an item from cart given a customization id, used for editing an item in cart
    const removeCustomProductWithId = async (id: string) => {
      try {
        const itemToRemove = checkout.tnLineItems.find(item => item.id === id)
        const lineIds = itemToRemove.lineItems.map(item => {
          return item.shopifyItem.id
        })
        await removeProductsFromCart(lineIds, itemToRemove.id)
      } catch (err: any) {
        console.error(err)
        renderErrorModal()
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
      } catch (err: any) {
        console.error(err)
        renderErrorModal()
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
      } catch (err: any) {
        console.error(err)
        renderErrorModal()
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
      } catch (err: any) {
        console.error(err)
        renderErrorModal()
      }
    }
    return {
      isDrawerOpen,
      setIsDrawerOpen,
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      isActive,
      setIsActive,
      closeDrawer,
      checkout,
      isAddingToCart,
      setIsAddingToCart,
      addProductToCart,
      addProductsToCart,
      removeProductFromCart,
      removeProductsFromCart,
      updateProductInCart,
      addDiscountCode,
      removeDiscountCode,
      removeCustomProductWithId,
      // customized products
      addProductCustomToCart,
      // for sunglasses
      addSunglassesToCart,
      isLoading,
    }
  }, [
    isDrawerOpen,
    setIsDrawerOpen,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    isActive,
    setIsActive,
    checkout,
    isAddingToCart,
    setIsAddingToCart,
    isLoading,
  ])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
