import React from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Product from "../components/product"
import { ShopifyCollection, ShopifyProduct } from "../types/shopify"

const Page = styled.div`
  .grid {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
  }
`

const Collection = ({
  data,
}: {
  data: { shopifyCollection: ShopifyCollection }
}) => {
  const { shopifyCollection: collection } = data
  return (
    <Layout>
      <SEO title={collection.title} />
      <Page>
        <h1>{collection.title}</h1>
        <div className="grid">
          {collection.products.map((product: ShopifyProduct) => (
            <Product key={product.handle} data={product} />
          ))}
        </div>
      </Page>
    </Layout>
  )
}

export default Collection

export const query = graphql`
  query CollectionQuery($handle: String!) {
    shopifyCollection(handle: { eq: $handle }) {
      handle
      id
      title
      products {
        handle
        featuredImage {
          altText
          localFile {
            childImageSharp {
              gatsbyImageData(
                width: 200
                placeholder: BLURRED
                formats: [AUTO, WEBP, AVIF]
              )
            }
          }
        }
        priceRangeV2 {
          minVariantPrice {
            amount
          }
          maxVariantPrice {
            amount
          }
        }
        productType
        storefrontId
        title
        variants {
          title
        }
      }
    }
  }
`
