import React, { useState, useEffect } from "react"
import { Link, graphql } from "gatsby"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Product from "../components/product-contentful"
import Filters from "../components/filters-contentful"
import { ContentfulCollection, ContentfulProduct } from "../types/contentful"

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

  const reset = () => {
    setFilters(defaultFilters)
    setProducts(collection.products)
  }

  const selectColors = (color: string) => {
    const options: HTMLElement[] = Array.from(
      document.querySelectorAll(".color-option")
    )
    options.map(option => {
      if (option.getAttribute("title")?.includes(color)) {
        option.click()
      }
    })
  }

  useEffect(() => {
    if (filters.colorName) {
      selectColors(filters.colorName)
    }
  }, [filters.fitType, filters.colorName])

  return (
    <Layout>
      <SEO title={collection.name} />
      <Page>
        <Filters
          collection={collection}
          filters={filters}
          setFilters={setFilters}
          setProducts={setProducts}
          reset={reset}
        />
        <h1>{collection.name}</h1>
        <div className="grid">
          {products.length ? (
            products.map((product: ContentfulProduct) => (
              <Product key={product.handle} data={product} />
            ))
          ) : (
            <p>No Products found please remove filters.</p>
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
