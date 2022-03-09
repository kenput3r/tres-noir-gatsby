import { graphql } from "gatsby"

export const shopifyProductsFields = graphql`
  fragment shopifyProductsFields on ShopifyProduct {
    handle
    description
    id
    images {
      altText
      localFile {
        id
        childImageSharp {
          gatsbyImageData(width: 100)
        }
      }
    }
    title
    variants {
      sku
      storefrontId
      title
      image {
        altText
        localFile {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      price
      product {
        title
        description
      }
      selectedOptions {
        name
        value
      }
    }
  }
`
