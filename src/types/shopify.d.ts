import { IGatsbyImageData } from "gatsby-plugin-image"

export interface ShopifyProduct {
  handle: string
  featuredImage: {
    altText: string
    localFile: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
    }
  }
  priceRangeV2: {
    minVariantPrice: {
      amount: number
    }
    maxVariantPrice: {
      amount: number
    }
  }
  productType: string
  storefrontId: string
  title: string
}

export interface ShopifyCollection {
  handle: string
  id: string
  title: string
  products: ShopifyProduct[]
}
