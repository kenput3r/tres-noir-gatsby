export interface ContentfulProductVariant {
  id: string
  sku: string
  featuredImage: {
    data: any
  }
  colorName: string
  colorImage: {
    data: any
  }
}

export interface ContentfulProduct {
  handle: string
  id: string
  title: string
  variants: ContentfulProductVariant[]
}

export interface ContentfulCollection {
  handle: string
  name: string
  products: ContentfulProduct[]
}

export interface Data {
  data: {
    contentfulCollection: ContentfulCollection
  }
}
