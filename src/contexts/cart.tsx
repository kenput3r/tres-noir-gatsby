import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react"
import { graphql, useStaticQuery } from "gatsby"
import Client, { Cart } from "shopify-buy"
import Cookies, { get } from "js-cookie"
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
} as any)

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
    subtotalPrice: {
      amount: "",
      currencyCode: "",
    },
    subtotalPriceV2: {
      amount: "",
      currencyCode: "",
    },
    totalPrice: {
      amount: "",
      currencyCode: "",
    },
    tnLineItems: [],
    webUrl: "",
  },
  isAddingToCart: false,
  setIsAddingToCart: (value: boolean) => {},
  addProductToCart: (
    variantId: string,
    quantity: number,
    sku: string,
    image: IGatsbyImageData,
    shouldOpenDrawer?: boolean
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
  isRemovingFromCart: false,
  getAppliedDiscountCode: () => "",
  updateShipInsureAttribute: (enableShipInsure: boolean) => {},
  isShipInsureEnabled: false,
}

export const CartContext = createContext(DefaultContext)

export const CartProvider = ({ children }) => {
  const { renderErrorModal } = useContext(ErrorModalContext)

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
  const [isActive, setIsActive] = useState("shop")
  const [checkout, setCheckout] = useState<any>()
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false)
  const [isRemovingFromCart, setIsRemovingFromCart] = useState<boolean>(false)

  const getShipInsureStatus = useCallback(() => {
    // return false if line attribute is found and is false, otherwise true
    try {
      if (!checkout) return false
      const shipInsureAttribute = checkout.customAttributes.find(
        attr => attr.key === "_ShipInsure"
      )
      if (shipInsureAttribute) {
        return shipInsureAttribute.value === "false" ? false : true
      }
      return true
    } catch (e) {
      return true
    }
  }, [checkout])

  const isShipInsureEnabled = getShipInsureStatus()

  const shipInsureData = useStaticQuery(graphql`
    query cartContextSettings {
      contentfulHomepage {
        autoEnableShipInsure
      }
      shopifyProduct(handle: { eq: "shipinsure" }) {
        id
        handle
        legacyResourceId
        variants {
          price
          legacyResourceId
          storefrontId
          sku
          title
        }
        featuredImage {
          altText
          localFile {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    }
  `)

  /**
   * @function getDiscountParams - gets the current non-expired chechout cookie
   */
  const getDiscountParams = () => {
    try {
      const isBrowser = typeof window !== "undefined"
      if (!isBrowser) return ""
      const urlParams = new URLSearchParams(window.location.search)
      const offer = urlParams.get("offer") ?? urlParams.get("discount")
      if (!offer || offer === "") return ""
      return offer
    } catch (error) {
      return ""
    }
  }

  const addDiscountCodeToCheckout = async ({
    code,
    checkoutId,
  }: {
    code: string
    checkoutId: string
  }) => {
    try {
      const updatedCheckout = await client.checkout.addDiscount(
        checkoutId,
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
      rebuildBundles(updatedCheckout)
      setCheckout(updatedCheckout)
    } catch (err: any) {
      console.error(err)
      renderErrorModal()
    }
  }

  /**
   * @function getCheckoutCookie - gets the current non-expired chechout cookie
   */
  const getCheckoutCookie = () => {
    return Cookies.get("shopifyCheckout")
  }

  const checkoutHasDiscountV2 = (code: string, myCheckout: any) => {
    try {
      return myCheckout.discountApplications.some(
        discount => discount.code === code
      )
    } catch (e) {
      return false
    }
  }

  const checkoutIsEmpty = (myCheckout: any) => {
    try {
      return myCheckout.lineItems.length === 0
    } catch (e) {
      return false
    }
  }

  /**
   * @function getNewCheckout - creates a new Shopify checkout
   * and sets the shopifyCheckout cookie (Shopify checkout ID)
   */
  const getNewCheckout = async () => {
    const newCheckout = await client.checkout.create()

    // check for discount code in URL, if present cookie will be set
    const code = getDiscountParams()
    if (code && code !== "") {
      // set discount code cookie
      // this cookie will be used to apply discount code once an item is added to cart
      // buy-sdk does not allow to apply discount code on create checkout with 0 items
      // ignore if discount code is already applied
      if (!checkoutHasDiscountV2(code, newCheckout)) {
        Cookies.set("tnDiscountCode", code, {
          sameSite: "strict",
          expires: 2592000,
        })
      }
    }

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
          Cookies.remove("tnDiscountCode")
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
            checkout = (await getNewCheckout()) as unknown as Checkout
            setCheckout(checkout)
            return
          }
          // Get Local Checkout
          let localCheckout: string | null | LocalCheckout =
            localStorage.getItem("checkout")
          if (localCheckout) {
            localCheckout = JSON.parse(localCheckout as string) as LocalCheckout
            checkout = (await validateLocalCheckout(
              localCheckout
            )) as unknown as Checkout
          } else {
            // create new checkout
            checkout = (await getNewCheckout()) as unknown as Checkout
          }
          if (checkout.completedAt) {
            checkout = (await getNewCheckout()) as unknown as Checkout
          }
          // if no Checkout exists, create a new one
        } else {
          checkout = (await getNewCheckout()) as unknown as Checkout
        }
        setCheckout(checkout)
        // check for params and add discount code
        const code = getDiscountParams()
        if (code && code !== "") {
          if (checkoutIsEmpty(checkout)) {
            Cookies.set("tnDiscountCode", code, {
              sameSite: "strict",
              expires: 2592000,
            })
          } else {
            addDiscountCodeToCheckout({
              checkoutId: checkout.id,
              code: code,
            })
          }
        }
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
      image: IGatsbyImageData,
      shouldOpenDrawer: boolean = true
    ) => {
      try {
        setIsAddingToCart(true)
        const lineItems = [
          {
            variantId,
            quantity,
          },
        ]
        const preShipInsure = await client.checkout.addLineItems(
          checkout.id,
          lineItems
        )
        const updatedCheckout = await addShipInsure(preShipInsure)
        addToImageStorage(sku, image, checkout.id)
        rebuildBundles(updatedCheckout)
        setCheckout(updatedCheckout)
        setIsAddingToCart(false)
        if (shouldOpenDrawer) setIsCartDrawerOpen(true)
        handleDiscountCookie()
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
        const preShipInsure = await client.checkout.addLineItems(
          checkout.id,
          lineItems
        )
        const updatedCheckout = await addShipInsure(preShipInsure)
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
        handleDiscountCookie()
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
        const preShipInsure = await client.checkout.addLineItems(
          checkout.id,
          lineItems
        )
        const updatedCheckout = await addShipInsure(preShipInsure)
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
        handleDiscountCookie()
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
        const preShipInsure = await client.checkout.addLineItems(
          checkout.id,
          lineItems
        )
        const updatedCheckout = await addShipInsure(preShipInsure)
        addToImageStorage(key, image, checkout.id)
        rebuildBundles(updatedCheckout)
        setCheckout(updatedCheckout)
        // add necessary data to localStorage to be able to resume from cart later on
        addCustomToLocalStorage(key, resumeData, sku, handle)
        setIsAddingToCart(false)
        if (activateDrawer) setIsCartDrawerOpen(true)
        handleDiscountCookie()
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
        const preShipInsure = await client.checkout.removeLineItems(
          checkout.id,
          [lineItemId]
        )
        const updatedCheckout = await addShipInsure(preShipInsure)
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
        const preShipInsure = await client.checkout.removeLineItems(
          checkout.id,
          lineItemIds
        )
        const updatedCheckout = await addShipInsure(preShipInsure)
        removeFromImageStorage(imageId)
        removeCustomFromLocalStorage(imageId)
        rebuildBundles(updatedCheckout)
        setCheckout(updatedCheckout)
      } catch (err: any) {
        console.error(err)
        renderErrorModal()
      }
    }

    // removes an item from cart given a customization id, used for editing an item in cart
    const removeCustomProductWithId = async (id: string) => {
      try {
        let hasDiscount = false
        const itemToRemove = checkout.tnLineItems.find(item => item.id === id)
        const lineIds = itemToRemove.lineItems.map(item => {
          if (item.shopifyItem.discountAllocations.length > 0) {
            hasDiscount = true
          }
          return item.shopifyItem.id
        })
        await removeProductsFromCart(lineIds, itemToRemove.id, hasDiscount)
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
        const preShipInsure = await client.checkout.updateLineItems(
          checkout.id,
          lineItems
        )
        const updatedCheckout = await addShipInsure(preShipInsure)
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

    const checkoutHasDiscount = (code: string) => {
      try {
        return checkout.discountApplications.some(
          discount => discount.code === code
        )
      } catch (e) {
        return false
      }
    }

    const handleDiscountCookie = async () => {
      const code = Cookies.get("tnDiscountCode")
      if (code && code !== "") {
        // check if code is already applied
        const isAlreadyApplied = checkoutHasDiscount(code)
        if (!isAlreadyApplied) {
          await addDiscountCode(code)
        }
        Cookies.remove("tnDiscountCode")
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
        rebuildBundles(updatedCheckout)
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
        rebuildBundles(updatedCheckout)
        setCheckout(updatedCheckout)
      } catch (err: any) {
        console.error(err)
        renderErrorModal()
      }
    }

    const getAppliedDiscountCode = (): string => {
      try {
        if (!checkout) return ""
        if (checkoutIsEmpty(checkout)) {
          const cookie = Cookies.get("tnDiscountCode")
          return cookie ? cookie : ""
        }
        if (checkout.discountApplications.length > 0) {
          return checkout.discountApplications[0].code
        }
        return ""
      } catch (err) {
        return ""
      }
    }

    // gets the correct ship insure variant based on subtotal
    const getCorrectShipInsureVariant = (subtotal: number) => {
      try {
        const shipInsureProduct = shipInsureData.shopifyProduct
        const parseRange = (sku: string) => {
          const match = sku.match(/SI_LEVEL_(\d+)-(\d+)/)
          if (match) {
            return {
              min: parseInt(match[1]),
              max: parseInt(match[2]),
            }
          }
          return null
        }
        const correctVariant = shipInsureProduct.variants.find(variant => {
          const range = parseRange(variant.sku)
          return range && subtotal >= range.min && subtotal <= range.max
        })
        return correctVariant
      } catch (e) {
        return undefined
      }
    }

    // adds ship insure to cart and returns new checkout from buy-sdk
    const addShipInsure = async (checkout: any) => {
      try {
        const subtotal = checkout.subtotalPrice.amount
        const correctVariant = getCorrectShipInsureVariant(Number(subtotal))
        const currentShipInsure = checkout.lineItems.find(
          item => item.variant.product.handle === "shipinsure"
        )
        // only add ship insure if it's not already in cart, and is enabled
        const hasShipInsureInCart = currentShipInsure !== undefined

        // check cart attributes for ship insure
        const isShipInsured =
          checkout.customAttributes.find(attr => attr.key === "_ShipInsure")
            ?.value !== "false"

        if (!isShipInsured) return checkout

        if (hasShipInsureInCart) {
          if (correctVariant.storefrontId !== currentShipInsure.variant.id) {
            // UPDATE SHIP INSURE

            // remove current ship insure
            const newCheckout = await client.checkout.removeLineItems(
              checkout.id,
              [currentShipInsure.id]
            )
            // add correct ship insure
            const updatedCheckout = await client.checkout.addLineItems(
              newCheckout.id,
              [
                {
                  variantId: correctVariant.storefrontId,
                  quantity: 1,
                },
              ]
            )
            return updatedCheckout
          }
        }

        if (isShipInsured && !hasShipInsureInCart && correctVariant) {
          const lineItems = [
            {
              variantId: correctVariant.storefrontId,
              quantity: 1,
            },
          ]
          const newCheckout = await client.checkout.addLineItems(
            checkout.id,
            lineItems
          )
          return newCheckout
        }
        return checkout
      } catch (e) {
        console.log("error", e)
        return checkout
      }
    }
    // deletes ship insure from cart and returns new checkout from buy-sdk
    const deleteShipInsure = async (checkout: any) => {
      try {
        const shipInsureItem = checkout.lineItems.find(
          item => item.variant.product.handle === "shipinsure"
        )
        if (shipInsureItem) {
          const newCheckout = await client.checkout.removeLineItems(
            checkout.id,
            [shipInsureItem.id]
          )
          return newCheckout
        }
        return checkout
      } catch (e) {
        console.log("error", e)
        return checkout
      }
    }

    const updateShipInsureAttribute = async (enableShipInsure: boolean) => {
      try {
        setIsRemovingFromCart(true)
        const updatedCheckout = await client.checkout.updateAttributes(
          checkout.id,
          {
            customAttributes: [
              {
                key: "_ShipInsure",
                value: String(enableShipInsure),
              },
            ],
          }
        )
        // if ship insure is enabled, add the correct variant to cart
        if (enableShipInsure) {
          const updatedCheckoutWithShipInsure = await addShipInsure(
            updatedCheckout
          )
          rebuildBundles(updatedCheckoutWithShipInsure)
          setCheckout(updatedCheckoutWithShipInsure)
          setIsRemovingFromCart(false)
        } else {
          // remove ship insure from cart
          const updatedCheckoutWithoutShipInsure = await deleteShipInsure(
            updatedCheckout
          )
          rebuildBundles(updatedCheckoutWithoutShipInsure)
          setCheckout(updatedCheckoutWithoutShipInsure)
          setIsRemovingFromCart(false)
        }
      } catch (e) {
        console.error("error", e)
        setIsRemovingFromCart(false)
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
      isRemovingFromCart,
      getAppliedDiscountCode,
      updateShipInsureAttribute,
      isShipInsureEnabled,
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
    isRemovingFromCart,
  ])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
