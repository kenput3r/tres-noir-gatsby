import { CartFragmentFragment as CartFragment } from "./storefront.generated"
import { IGatsbyImageData } from "gatsby-plugin-image"

export interface LineItem {
  attributes: {
    key: string
    value: string
  }[]
  discountAllocations: {
    discountedAmount: {
      amount: string
      currencyCode: string
    }
  }[]
  cost: {
    amountPerQuantity: {
      amount: string
      currencyCode: string
    }
    compareAtAmountPerQuantity: {
      amount: string
      currencyCode: string
    }
    totalAmount: {
      amount: string
      currencyCode: string
    }
    subtotalAmount: {
      amount: string
      currencyCode: string
    }
  }
  id: string
  merchandise: {
    id: string
    title: string
    product: {
      handle: string
      title: string
    }
    sku: string
    price: {
      amount: string
      currencyCode: string
    }
    compareAtPrice: {
      amount: string
      currencyCode: string
    }
  }
  quantity: number
}

export interface tnSubItem {
  stepNumber?: string
  shopifyItem: LineItem
}

export interface tnItem {
  id: string
  lineItems: tnSubItem[]
  image: IGatsbyImageData | null | undefined
  isCustom: boolean
}

export interface ImageHashTable {
  cartId: string
  images: {
    [key: string]: IGatsbyImageData
  }
}

export interface ImageStorage {
  value: ImageHashTable
  expiry: string
}

export interface CustomLineItem {
  variantId: string
  quantity: number
  attributes: { key: string; value: string }[]
}

export interface rxDetails {
  sph: string
  cyl: string
  axis: string
  add: string
  pd: string
}
export interface rxType {
  right: rxDetails
  left: rxDetails
}

export interface Cart extends CartFragment {
  tnLineItems?: tnItem[]
}
