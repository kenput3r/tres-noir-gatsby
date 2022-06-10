import { IGatsbyImageData } from "gatsby-plugin-image"

export interface UpsellItems {
  products: UpsellItem[]
}

export interface UpsellItem {
  featuredImage: {
    localFile: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
    }
  }
  handle: string
  hasOnlyDefaultVariant: boolean
  id: string
  storefrontId: string
  title: string
  variants: UpsellItemVariant[]
}

export interface UpsellItemVariant {
  price: string
  sku: string
  storefrontId: string
  selectedOptions: {
    name
  }[]
  image?: {
    localFile: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
    }
  }
}
