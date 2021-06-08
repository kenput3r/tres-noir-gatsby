import React from "react"
import { Link, graphql } from "gatsby"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Product from "../components/product-contentful"
import { Data, ContentfulProduct } from "../types/contentful-products"

const CollectionContentful = ({ data }: Data) => {
  const { contentfulCollection: collection } = data
  return (
    <Layout>
      <SEO title={collection.name} />
      <Page>
        <h1>{collection.name}</h1>
        <div className="grid">
          {collection.products.map((product: ContentfulProduct) => (
            <Product key={product.handle} data={product} />
          ))}
        </div>
      </Page>
    </Layout>
  )
}

export default CollectionContentful

export const query = graphql`
  query ContentfulCollectionQuery($handle: String!) {
    contentfulCollection(handle: { eq: $handle }) {
      handle
      name
      products {
        title
        handle
        id
        variants {
          id
          featuredImage {
            data: gatsbyImageData(width: 600)
          }
          colorName
          colorImage {
            data: gatsbyImageData(width: 40)
          }
        }
      }
    }
  }
`

const Page = styled.div`
  .grid {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
`
