import { IGatsbyImageData } from "gatsby-plugin-image"

export interface ShopifyProduct {
  handle: string
  images: {
    altText: string
    localFile: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
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
