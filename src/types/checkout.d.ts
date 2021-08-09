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
  variant: {
    available: boolean
    compareAtPrice: null | string
    compareAtPriceV2: null | string
    id: string
    image: {
      altText: string
      id: string
      src: string
    }
    price: string
    priceV2: {
      amount: string
      currencyCode: string
    }
    product: {
      handle: string
      id: string
    }
    sku: string
    title: string
  }
}
