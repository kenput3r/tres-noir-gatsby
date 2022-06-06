import { IGatsbyImageData } from "gatsby-plugin-image"

export interface ContentfulProductVariant {
  id: string
  sku: string
  featuredImage: {
    data: IGatsbyImageData
  }
  featuredImageClear: {
    data: IGatsbyImageData
  }
  colorName: string
  colorImage: {
    data: IGatsbyImageData
  }
  frameColor: string
}

export interface ContentfulProduct {
  handle: string
  id: string
  title: string
  fitType: string
  frameWidth: string[]
  collection: {
    name: string
    handle: string
  }[]
  variants: ContentfulProductVariant[]
}

export interface ContentfulCollection {
  handle: string
  name: string
  featuredImage: {
    data: IGatsbyImageData
    description: string
  }
  featuredImage2: {
    data: IGatsbyImageData
  }
  featuredImageTextColor: string
  featuredImageTextPosition: string
  featuredImageClear: {
    data: IGatsbyImageData
  }
  products: ContentfulProduct[]
}
