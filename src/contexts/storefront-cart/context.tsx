import { IGatsbyImageData } from "gatsby-plugin-image"
import { createContext } from "react"
import { CustomLineItem } from "../../types/checkout"
import { SelectedVariants } from "../../types/global"

import type { Cart } from "./types/storefront-cart"

type CartContextType = {
  isDrawerOpen: boolean
  setIsDrawerOpen: (value: boolean) => void
  isCartDrawerOpen: boolean
  setIsCartDrawerOpen: (value: boolean) => void
  isActive: string
  setIsActive: (value: string) => void
  closeDrawer: () => void
  cart: Cart | undefined
  isAddingToCart: boolean
  setIsAddingToCart: (value: boolean) => void
  addProductToCart: (
    variantId: string,
    quantity: number,
    sku: string,
    image: IGatsbyImageData,
    shouldOpenDrawer?: boolean
  ) => void
  addProductsToCart: (
    lineItems: { variantId: string; quantity: number }[]
  ) => void
  addSunglassesToCart: (
    lineItems: CustomLineItem[],
    image: IGatsbyImageData,
    key: string
  ) => void
  addProductCustomToCart: (
    items: CustomLineItem[],
    key: string,
    image: IGatsbyImageData,
    resumeData: SelectedVariants,
    sku: string,
    handle: string,
    activateDrawer: boolean
  ) => void
  removeProductFromCart: (lineItemId: string, imageId: string) => void
  removeProductsFromCart: (
    lineItemIds: string[],
    imageId: string,
    hasDiscount?: boolean
  ) => void
  removeCustomProductWithId: (id: string) => void
  updateProductInCart: (
    lineId: string,
    variantId: string,
    quantity: number,
    imageId: string
  ) => void
  addDiscountCode: (code: string) => void
  removeDiscountCode: () => void
  isRemovingFromCart: boolean
  getAppliedDiscountCode: () => string
  updateShipInsureAttribute: (enableShipInsure: boolean) => void
  isShipInsureEnabled: boolean
}

const defaultContext: CartContextType = {
  isDrawerOpen: false,
  setIsDrawerOpen: (value: boolean) => {},
  isCartDrawerOpen: false,
  setIsCartDrawerOpen: (value: boolean) => {},
  isActive: "",
  setIsActive: (value: string) => {},
  closeDrawer: () => {},
  cart: undefined,
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
    lineId: string,
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

const CartContext = createContext(defaultContext)
export default CartContext