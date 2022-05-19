import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useReducer,
} from "react"
import Client, { Cart } from "shopify-buy"
import { Checkout } from "../types/checkout"
import { IGatsbyImageData } from "gatsby-plugin-image"
import { dispatch } from "gatsby-cli/lib/reporter/redux"
import { parse } from "path"

interface BundleCustomsItemType {
  id: string
  lineItems: {
    [x: string]: any
    stepNumber?: string
    shopifyItem: Checkout
  }
  image: IGatsbyImageData
  isCustom: boolean
}

interface BundleCustomsType {
  checkoutId: string
  items: BundleCustomsItemType[]
}

const bundleInit: BundleCustomsType = {
  checkoutId: "",
  items: [],
}

interface BundleLocalStorageType {
  expiry: number
  value: BundleCustomsType
}

interface ImageHashTable {
  checkoutId: string
  images: {
    [key: string]: IGatsbyImageData
  }
}

interface ImageStorage {
  value: ImageHashTable
  expiry: string
}

interface CustomLineItem {
  variantId: string
  quantity: number
  customAttributes: { key: string; value: string }[]
}

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
  removeProductFromCart: (lineItemId: string) => {},
  removeProductsFromCart: (lineItemIds: []) => {},
  updateProductInCart: (variantId: string, quantity: number) => {},
  addDiscountCode: (code: string) => {},
  removeDiscountCode: () => {},
  // Customized Product functions
  bundledCustoms: bundleInit,
  bundledDispatch: Dispatch => {},
  addCustomsToLocalStorage: (bundle: BundleCustomsType) => {},
  removeCustomProduct: (customizationId: string) => {},
}

const addCustomsToLocalStorage = (currentBundle: BundleCustomsType) => {
  if (isBrowser) {
    const now = new Date()
    localStorage.setItem(
      "customs",
      JSON.stringify({
        value: currentBundle,
        expiry: now.getTime() + 2592000,
      })
    )
  }
}

const setNewCustomLocalStorage = newCheckoutId => {
  if (isBrowser) {
    const now = new Date()
    localStorage.setItem(
      "customs",
      JSON.stringify({
        value: newCheckoutId,
        expiry: now.getTime() + 2592000,
      })
    )
  }
}

const customLensesReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      const findId = state.items.findIndex(
        srch => srch.id === action.payload.id
      )
      if (findId === -1) {
        //create new item
        // addCustomsToLocalStorage({
        //   ...state,
        //   items: [
        //     ...state.items,
        //     {
        //       id: action.payload.id,
        //       lineItems: action.payload.value,
        //       customImage: action.payload.image,
        //     },
        //   ],
        // })
        return {
          ...state,
          items: [
            ...state.items,
            {
              id: action.payload.id,
              lineItems: action.payload.value,
              image: action.payload.image,
              isCustom: action.payload.isCustom,
            },
          ],
        }
      } else {
        // addCustomsToLocalStorage({
        //   ...state,
        //   items: [
        //     ...state.items.slice(0, findId),
        //     (state.items[findId] = {
        //       customizationId: action.payload.id,
        //       lineItems: action.payload.value,
        //       customImage: action.payload.image,
        //     }),
        //     ...state.items.slice(findId),
        //   ],
        // })
        // return {
        //   ...state,
        //   items: [
        //     ...state.items.slice(0, findId),
        //     (state.items[findId] = {
        //       customizationId: action.payload.id,
        //       lineItems: action.payload.value,
        //       customImage: action.payload.image,
        //     }),
        //     ...state.items.slice(findId),
        //   ],
        // }
        return state
      }
    case "DELETE":
      const filteredDelete = state.items.filter(
        item => item.id !== action.payload.id
      )
      if (state.items.length === 1) {
        addCustomsToLocalStorage({
          ...state,
          items: [],
        })
        return {
          ...state,
          items: [],
        }
      } else {
        addCustomsToLocalStorage({
          ...state,
          items: filteredDelete,
        })
        return {
          ...state,
          items: filteredDelete,
        }
      }

    case "SET_CHECKOUT":
      setNewCustomLocalStorage({ ...state, checkoutId: action.payload })
      return { ...state, checkoutId: action.payload }
    case "UPDATE":
      return state
    case "DELETE_ALL":
      return { ...state, items: [] }
    case "RESET":
      setNewCustomLocalStorage({
        ...state,
        items: [],
        checkoutId: action.payload.id,
      })
      return { ...state, items: [], checkoutId: action.payload.id }
    default:
      return state
  }
}

export const CartContext = createContext(DefaultContext)

export const CartProvider = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isActive, setIsActive] = useState("shop")
  const [checkout, setCheckout] = useState<any>()
  const [bundledCustoms, bundledDispatch] = useReducer(
    customLensesReducer,
    bundleInit
  )

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
      bundledDispatch({
        type: "RESET",
        payload: {
          id: newCheckout.id,
        },
      })
      newCheckout["tnLineItems"] = []
      localStorage.setItem(
        "checkout",
        JSON.stringify({ value: newCheckout, expiry: now.getTime() + 2592000 })
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
        console.log("get")
        const localImages = JSON.parse(cartImages) as ImageStorage
        parsedImages = localImages.value
      }
      parsedImages.images[id] = image
      console.log("parsed", parsedImages.images)
      localStorage.setItem(
        "cart-images",
        JSON.stringify({
          value: parsedImages,
          expiry: now.getTime() + 2592000,
        })
      )
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

  const getCustomLineItem = (key: string, newCheckout) => {
    let tempItems: any[] = []
    newCheckout.lineItems.forEach(item => {
      if (item.customAttributes.length !== 0) {
        let found = false
        item.customAttributes.forEach(attr => {
          if (attr.key === "customizationId" && attr.value === key) {
            found = true
          }
          if (attr.key === "customizationStep" && found) {
            tempItems.push({
              stepNumber: attr.value,
              shopifyItem: item,
            })
          }
        })
      }
    })
    // sort tempItems by stepNumber
    tempItems.sort((a, b) => {
      return a.stepNumber - b.stepNumber
    })
    if (tempItems.length > 0) {
      return tempItems
    }
  }

  const rebuildBundles = checkout => {}

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
          bundledDispatch({ type: "DELETE_ALL" })
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
            // initialize context
            const customs = localStorage.getItem("customs")
            if (customs) {
              const parsedCustoms = JSON.parse(
                customs
              ) as BundleLocalStorageType
              if (parsedCustoms.value.checkoutId === checkoutId) {
                bundledDispatch({
                  type: "SET_CHECKOUT",
                  payload: checkout.id,
                })
                parsedCustoms.value.items.forEach(item => {
                  bundledDispatch({
                    type: "ADD",
                    payload: {
                      id: item.id,
                      value: item.lineItems,
                      image: item.image,
                    },
                  })
                })
              }
            }
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
        // rebuild tnLineItems
        const bundledCheckout = rebuildBundles(updatedCheckout)
        setCheckout(bundledCheckout)
        console.log("updated", bundledCheckout)
        const addedItem = updatedCheckout.lineItems.find(
          el => el.variant.sku === sku
        )
        // add item to context
        bundledDispatch({
          type: "ADD",
          payload: {
            id: sku,
            image: image,
            value: {
              shopifyProduct: addedItem,
            },
            isCustom: false,
          },
        })
      } catch (e) {
        console.error(e)
      }
    }

    const addProductsToCart = async (variantId: string, quantity: number) => {
      try {
        const lineItems = [
          {
            variantId,
            quantity,
          },
        ]
        console.log("lineItems", lineItems)
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
        const customItem = getCustomLineItem(key, updatedCheckout)
        // add item to context
        bundledDispatch({
          type: "ADD",
          payload: {
            id: key,
            value: customItem,
            image: image,
          },
        })
        // add image to localStorage
        addToImageStorage(key, image, checkout.id)
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

    const removeProductsFromCart = async lineItemIds => {
      try {
        const updatedCheckout = await client.checkout.removeLineItems(
          checkout.id,
          lineItemIds
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

    const removeCustomProduct = async (customizationId: string) => {
      let lineIds: string[] = []
      checkout.lineItems.forEach(item => {
        if (item.customAttributes.length !== 0) {
          item.customAttributes.forEach(attr => {
            if (
              attr.key === "customizationId" &&
              attr.value === customizationId
            ) {
              lineIds.push(item.id)
            }
          })
        }
      })
      if (lineIds.length !== 0) {
        await removeProductsFromCart(lineIds)
        bundledDispatch({
          type: "DELETE",
          payload: { id: customizationId },
        })
      }
      return lineIds
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
      addProductCustomToCart,
      removeProductFromCart,
      removeProductsFromCart,
      updateProductInCart,
      addDiscountCode,
      removeDiscountCode,
      // customized products
      bundledCustoms,
      bundledDispatch,
      addCustomsToLocalStorage,
      removeCustomProduct,
    }
  }, [
    isDrawerOpen,
    setIsDrawerOpen,
    isActive,
    setIsActive,
    checkout,
    bundledCustoms,
  ])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
