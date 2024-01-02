import React, { useContext, useState, useEffect } from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import Product from "../components/product-contentful"
import Variant from "../components/variant"
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

const VariantCollection = ({
  data,
}: {
  data: {
    contentfulVariantCollection: any
    shopifyCollection: { products: any[] }
  }
}) => {
  const { contentfulVariantCollection: collection, shopifyCollection } = data

  const defaultFilters = { frameWidth: "", colorName: "" }
  const [filters, setFilters] = useState<{
    frameWidth: string
    colorName: string
  }>(defaultFilters)
  const [variants, setVariants] = useState<ContentfulProduct[]>(
    collection.variants
  )

  useEffect(() => {
    const collectionInfo = {
      handle: collection.handle,
      title: collection.name,
    }
    viewedCollectionGTMEvent(collectionInfo)
  }, [])

  const getShopifyVariant = product => {
    if (!shopifyCollection?.products) return null

    const shopifyProduct = shopifyCollection.products.find(
      shopifyProduct =>
        shopifyProduct.handle.toLowerCase() === product.handle.toLowerCase() ||
        shopifyProduct.title === product.title
    )

    return shopifyProduct
  }

  console.log("VariantCollection", collection)

  return (
    <Layout>
      <SEO
        title={collection.name}
        description={collection.description}
        image={{
          url: collection.image.url,
          alt: collection.image.description,
        }}
      />
      <div className="page">
        <FreeShipping />
        {collection.image && (
          <CollectionImage
            collectionImage={collection.image.data}
            collectionName={collection.title}
            collectionDescription={collection.description}
          />
        )}

        {/* <div className="filters-container">
          <Filters
            collection={collection}
            filters={filters}
            setFilters={setFilters}
            setProducts={setVariants}
          />
        </div> */}

        <Grid>
          {variants.length ? (
            variants.map(variant => {
              const shopifyVariant = getShopifyVariant(variant)

              return (
                <Variant
                  key={variant.id}
                  contentfulData={variant}
                  shopifyData={shopifyVariant}
                />
              )
            })
          ) : (
            <p>No Products found please remove filters and try again.</p>
          )}
        </Grid>
      </div>
    </Layout>
  )
}

export default VariantCollection

export const query = graphql`
  query VariantCollectionQuery($handle: String!) {
    contentfulVariantCollection(handle: { eq: $handle }) {
      id
      handle
      image {
        data: gatsbyImageData(width: 2048, formats: [AUTO, WEBP], quality: 50)
        description
        url
      }
      variants {
        id
        sku
        featuredImage {
          data: gatsbyImageData(
            width: 600
            quality: 40
            aspectRatio: 1.5
            cropFocus: CENTER
          )
        }
        featuredImageClear {
          data: gatsbyImageData(
            width: 600
            quality: 40
            aspectRatio: 1.5
            cropFocus: CENTER
          )
        }
        colorName
        colorImage {
          data: gatsbyImageData(width: 40)
        }
        frameColor
        dominantFrameColor
      }
    }
    shopifyCollection(handle: { eq: $handle }) {
      products {
        title
        handle
        createdAt
        tags
        variants {
          price
          compareAtPrice
          sku
          metafields {
            key
            namespace
            value
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`
