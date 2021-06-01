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
      shopifyId
      title
      image {
        altText
        localFile {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      priceNumber
      product {
        title
      }
      selectedOptions {
        name
        value
      }
    }
  }
`
