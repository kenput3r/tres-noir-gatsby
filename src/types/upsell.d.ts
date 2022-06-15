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
  hasOutofStockVariants: boolean
  id: string
  onlineStoreUrl: string
  productType: string
  storefrontId: string
  tags: string[]
  title: string
  variants: UpsellItemVariant[]
}

export interface UpsellItemVariant {
  image?: {
    localFile: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
    }
  }
  inventoryQuantity: number
  position: number
  price: string
  selectedOptions: {
    name: string
  }[]
  sku: string
  storefrontId: string
  title: string
}
