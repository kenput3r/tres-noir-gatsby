export interface ShopifyProduct {
  handle: string
  images: {
    altText: string
    localFile: {
      childImageSharp: {
        gatsbyImageData: {
          width: number
          placeholder: any
          formats: any[]
        }
      }
    }
  }
  priceRange: {
    minVariantPrice: {
      amount: number
    }
    maxVariantPrice: {
      amount: number
    }
  }
  productType: string
  shopifyId: string
  title: string
}

export interface ShopifyCollection {
  handle: string
  id: string
  title: string
  products: ShopifyProduct[]
}

export interface Data {
  data: {
    shopifyCollection: ShopifyCollection
  }
}
