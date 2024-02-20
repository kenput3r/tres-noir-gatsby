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
import { ContentfulProductVariant } from "../types/contentful"

const Page = styled.div`
  .desc-container {
    margin-top: 15px;
    margin-bottom: 0;
    display: flex;
    justify-content: center;
    font-family: var(--sub-heading-font);
    .collection-description {
      p {
        margin: 0;
      }
      text-align: center;
      margin: 0 auto;
      max-width: 800px;
    }
  }
  @media only screen and (max-width: 600px) {
    .desc-container {
      margin-top: 0;
    }
  }
`

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
  const [variants, setVariants] = useState<ContentfulProductVariant[]>(
    collection.variants
  )

  useEffect(() => {
    const collectionInfo = {
      handle: collection.handle,
      title: collection.name,
    }
    viewedCollectionGTMEvent(collectionInfo)
  }, [])

  const getShopifyPrice = (
    variant
  ): {
    price: string
    compareAtPrice: string
  } => {
    try {
      const handle = variant.product[0].handle

      const shopifyProduct = shopifyCollection.products.find(
        shopifyProduct =>
          shopifyProduct.handle.toLowerCase() === handle.toLowerCase()
      )

      const shopifyVariant = shopifyProduct.variants.find(
        shopifyVariant => shopifyVariant.sku === variant.sku
      )

      return {
        price: shopifyVariant.price,
        compareAtPrice: shopifyVariant.compareAtPrice ?? "0.00",
      }
    } catch (error) {
      return {
        price: "",
        compareAtPrice: "",
      }
    }
  }

  const geColorOptionName = variant => {
    try {
      const handle = variant.product[0].handle

      if (!shopifyCollection?.products) return null

      const shopifyProduct = shopifyCollection.products.find(
        shopifyProduct =>
          shopifyProduct.handle.toLowerCase() === handle.toLowerCase()
      )

      const shopifyVariant = shopifyProduct.variants.find(
        shopifyVariant => shopifyVariant.sku === variant.sku
      )

      const optionName = shopifyVariant.selectedOptions.find(
        option => option.name === "Color"
      ).value

      const formattedOptionName = optionName.split("-")[0]

      return formattedOptionName.trim()
    } catch (error) {
      return variant.colorName
    }
  }

  return (
    <Layout>
      <SEO
        title={collection.title}
        description={collection.description}
        image={{
          url: collection.image.url,
          alt: collection.title,
        }}
      />
      <Page className="page">
        <FreeShipping />
        {collection.image && (
          <CollectionImage collectionImage={collection.image.data} />
        )}
        <div className="desc-container">
          <p className="collection-description">{collection.description}</p>
        </div>

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
              const { price, compareAtPrice } = getShopifyPrice(variant)
              const productTitle = variant.product[0].title
              const colorName = geColorOptionName(variant)
              const formattedTitle = [productTitle, colorName].join(" - ")
              return (
                <Variant
                  key={variant.id}
                  contentfulData={variant}
                  productHandle={variant.product[0].handle}
                  price={price}
                  name={formattedTitle}
                  compareAtPrice={compareAtPrice}
                />
              )
            })
          ) : (
            <p>No Products found please remove filters and try again.</p>
          )}
        </Grid>
      </Page>
    </Layout>
  )
}

export default VariantCollection

export const query = graphql`
  query VariantCollectionQuery($handle: String!) {
    contentfulVariantCollection(handle: { eq: $handle }) {
      id
      handle
      title
      description
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
        product {
          handle
          title
        }
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
