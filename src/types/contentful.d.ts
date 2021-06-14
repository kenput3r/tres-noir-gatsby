import { IGatsbyImageData } from "gatsby-plugin-image"

export interface ContentfulProductVariant {
  id: string
  sku: string
  featuredImage: {
    data: IGatsbyImageData
  }
  colorName: string
  colorImage: {
    data: IGatsbyImageData
  }
}

export interface ContentfulProduct {
  handle: string
  id: string
  title: string
  fitType: string
  variants: ContentfulProductVariant[]
}

export interface ContentfulCollection {
  handle: string
  name: string
  products: ContentfulProduct[]
}
