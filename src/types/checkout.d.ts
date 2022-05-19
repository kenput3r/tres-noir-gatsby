import { IGatsbyImageData } from "gatsby-plugin-image"

export interface Checkout {
  appliedGiftCards: string[]
  completedAt: null | string
  createdAt: string
  currencyCode: string
  customAttributes: any[]
  discountApplications: any[]
  email: null | string
  id: string
  lineItems: LineItem[]
  tnLineItems: {
    isCustom: boolean
    image: IGatsbyImageData
    lineItems: LineItem
  }[]
  lineItemsSubtotalPrice: {
    amount: string
    currencyCode: string
  }
  note: null | string
  subtotalPrice: string
  subtotalPriceV2: {
    amount: string
    currencyCode: string
  }
  totalPrice: string
  webUrl: string
}

export interface LineItem {
  customAttributes: any[]
  discountAllocations: any[]
  hasNextPage: boolean
  hasPreviousPage: boolean
  id: string
  quantity: number
  title: string
  type: {
    name: string
    kind: string
  }
  product: {
    id: string
    handle: string
  }
  variant: {
    available: boolean
    compareAtPrice: null | string
    id: string
    image: {
      altText: string
      id: string
      src: string
    }
    price: string
    product: {
      handle: string
      id: string
    }
    sku: string
    title: string
  }
}
