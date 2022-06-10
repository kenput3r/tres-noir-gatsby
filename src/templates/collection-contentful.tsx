import React, { useContext, useState, useEffect } from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import { SelectedVariantContext } from "../contexts/selectedVariant"
import Product from "../components/product-contentful"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Filters from "../components/filters-contentful"
import { ContentfulCollection, ContentfulProduct } from "../types/contentful"
import FreeShipping from "../components/free-shipping"
import CollectionImage from "../components/collection-image"
import { viewedCollectionGTMEvent } from "../helpers/gtm"

const Grid = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 15px;
  margin-bottom: 55px;
`

const CollectionContentful = ({
  data,
}: {
  data: { contentfulCollection: ContentfulCollection }
}) => {
  const { contentfulCollection: collection } = data
  const defaultFilters = { frameWidth: "", colorName: "" }
  const [filters, setFilters] = useState<{
    frameWidth: string
    colorName: string
  }>(defaultFilters)
  const [products, setProducts] = useState<ContentfulProduct[]>(
    collection.products
  )

  const { setSelectedVariantContext } = useContext(SelectedVariantContext)

  useEffect(() => {
    // reset selected variant context
    setSelectedVariantContext("")
    const collectionInfo = {
      handle: collection.handle,
      title: collection.name,
    }
    viewedCollectionGTMEvent(collectionInfo)
  }, [])

  return (
    <Layout>
      <SEO title={collection.name} />
      <div className="page">
        <FreeShipping />
        {collection.featuredImage && (
          <CollectionImage
            collectionImage={collection.featuredImage.data}
            collectionName={collection.name}
            collectionDescription={collection.featuredImage.description}
            textColor={collection.featuredImageTextColor}
            position={collection.featuredImageTextPosition}
          />
        )}

        <div className="filters-container">
          <Filters
            collection={collection}
            filters={filters}
            setFilters={setFilters}
            setProducts={setProducts}
          />
        </div>

        <Grid>
          {products.length ? (
            Array.from(products.slice(0, 6)).map(
              (product: ContentfulProduct) => {
                return (
                  <Product
                    key={product.id}
                    data={product}
                    color={filters.colorName}
                    collectionHandle={collection.handle}
                  />
                )
              }
            )
          ) : (
            <p>No Products found please remove filters and try again.</p>
          )}
        </Grid>

        {collection.featuredImage2 && (
          <CollectionImage
            collectionImage={collection.featuredImage2.data}
            collectionName={collection.name}
          />
        )}

        <Grid>
          {products.length > 6 &&
            Array.from(products.slice(6)).map((product: ContentfulProduct) => (
              <Product
                key={product.id}
                data={product}
                color={filters.colorName}
                collectionHandle={collection.handle}
              />
            ))}
        </Grid>
      </div>
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
        data: gatsbyImageData(width: 2048, formats: [AUTO, WEBP], quality: 50)
        description
      }
      featuredImage2 {
        data: gatsbyImageData(width: 2048, formats: [AUTO, WEBP], quality: 50)
      }
      featuredImageTextColor
      featuredImageTextPosition
      products {
        title
        handle
        id
        frameWidth
        collection {
          name
          handle
        }
        variants {
          id
          sku
          featuredImage {
            data: gatsbyImageData(width: 600, quality: 40)
          }
          featuredImageClear {
            data: gatsbyImageData(width: 600, quality: 40)
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
