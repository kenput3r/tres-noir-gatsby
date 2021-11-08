import { IGatsbyImageData } from "gatsby-plugin-image"

declare module "*.svg"
declare module "*.png"
declare module "*.json"

interface ShopifyVariant {
  sku: string
  storefrontId: string
  title: string
  image: {
    altText: string
    localFile: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
    }
  }
  price: number
  product?: {
    title: string
  }
  selectedOptions?: {
    name?: string
    value?: string
  }
}

interface ShopifyProduct {
  handle: string
  description: string
  id: string
  images: [
    {
      altText: string
      localFile: {
        id: string
        childImageSharp: {
          gatsbyImageData: IGatsbyImageData
        }
      }
    }
  ]
  title: string
  variants: [ShopifyVariant]
}

interface ShopifyCollection {
  title: string
  products: [ShopifyProduct]
}

interface SelectedVariants {
  step1: any
  step2: any
  step3: any
  step4: any
}
