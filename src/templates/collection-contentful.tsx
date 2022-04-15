import React, { useState, useEffect } from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import { GatsbyImage } from "gatsby-plugin-image"
import Product from "../components/product-contentful"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Filters from "../components/filters-contentful"
import { ContentfulCollection, ContentfulProduct } from "../types/contentful"

const Page = styled.div`
  .grid {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
`

const FeaturedImage = styled.div`
  position: relative;
  h1 {
    text-transform: uppercase;
    position: absolute;
    bottom: 15px;
    right: 15px;
    margin-bottom: 0;
  }
`

const CollectionContentful = ({
  data,
}: {
  data: { contentfulCollection: ContentfulCollection }
}) => {
  const { contentfulCollection: collection } = data
  const defaultFilters = { fitType: null, colorName: null }
  const [filters, setFilters] = useState<{
    fitType: null | string
    colorName: null | string
  }>(defaultFilters)
  const [products, setProducts] = useState<ContentfulProduct[]>(
    collection.products
  )

  return (
    <Layout>
      <SEO title={collection.name} />
      <Page>
        {collection.featuredImage && (
          <FeaturedImage>
            <GatsbyImage
              image={collection.featuredImage.data}
              alt="collection.name"
            />
            <h1>{collection.name}</h1>
          </FeaturedImage>
        )}
        <Filters
          collection={collection}
          filters={filters}
          setFilters={setFilters}
          setProducts={setProducts}
        />
        <div className="grid">
          {products.length ? (
            products.map((product: ContentfulProduct) => (
              <Product
                key={product.handle}
                data={product}
                color={filters.colorName}
              />
            ))
          ) : (
            <p>No Products found please remove filters and try again.</p>
          )}
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
      featuredImage {
        data: gatsbyImageData(
          aspectRatio: 2.29
          width: 2048
          placeholder: BLURRED
          formats: [AUTO, WEBP]
        )
      }
      products {
        title
        handle
        id
        fitType
        variants {
          id
          sku
          featuredImage {
            data: gatsbyImageData(width: 600)
          }
          colorName
          colorImage {
            data: gatsbyImageData(width: 40)
          }
          frameColor
        }
      }
    }
  }
`
