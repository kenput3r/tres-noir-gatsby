export interface ContentfulProductVariant {
  featuredImage: {
    gatsbyImageData: any
  }
  colorName: string
  colorImage: {
    gatsbyImageData: any
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
