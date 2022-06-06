import React, { useContext, useState, useEffect } from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import { GatsbyImage } from "gatsby-plugin-image"
import { SelectedVariantContext } from "../contexts/selectedVariant"
import Product from "../components/product-contentful"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Filters from "../components/filters-contentful"
import { ContentfulCollection, ContentfulProduct } from "../types/contentful"
import FreeShipping from "../components/free-shipping"
import CollectionImage from "../components/collection-image"
import { viewedCollectionGTMEvent } from "../helpers/gtm"

const Page = styled.div`
  .grid {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 15px;
    margin-bottom: 55px;
  }
`

const FeaturedImage = styled.div`
  position: relative;
  /* max-height: 435px; */
  .collection-image {
    margin: 0 -15px;
    height: 435px;
    @media screen and (max-width: 600px) {
      height: 200px;
    }
  }
  .inner-text {
    h1 {
      font-weight: normal;
      text-transform: uppercase;
      font-size: 2rem;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    p {
      font-family: var(--sub-heading-font);
      margin-bottom: 0;
    }
    position: absolute;
    top: 8px;
    left: 15px;
    padding: 10px;
    margin-bottom: 0;
    max-width: 480px;
    @media (max-width: 600px) {
      position: static;
      max-width: unset;
      text-align: center;
      top: unset;
      left: unset;
    }
  }
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
      <Page>
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
        <Filters
          collection={collection}
          filters={filters}
          setFilters={setFilters}
          setProducts={setProducts}
        />
        <div className="grid">
          {products.length ? (
            products
              .slice(0, 6)
              .map((product: ContentfulProduct) => (
                <Product
                  key={product.handle}
                  data={product}
                  color={filters.colorName}
                  collectionHandle={collection.handle}
                />
              ))
          ) : (
            <p>No Products found please remove filters and try again.</p>
          )}
        </div>
        {collection.featuredImage2 && (
          <FeaturedImage>
            <GatsbyImage
              className="collection-image"
              image={collection.featuredImage2.data}
              alt="collection.name"
            />
          </FeaturedImage>
        )}
        <div className="grid">
          {products.length > 6 &&
            products
              .slice(6)
              .map((product: ContentfulProduct) => (
                <Product
                  key={product.handle}
                  data={product}
                  color={filters.colorName}
                  collectionHandle={collection.handle}
                ></Product>
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
      featuredImage {
        data: gatsbyImageData(
          width: 2048
          placeholder: BLURRED
          formats: [AUTO, WEBP]
        )
        description
      }
      featuredImage2 {
        data: gatsbyImageData(
          width: 2048
          placeholder: BLURRED
          formats: [AUTO, WEBP]
        )
      }
      featuredImageTextColor
      featuredImageTextPosition
      products {
        title
        handle
        id
        frameWidth
        newStyles
        collection {
          name
        }
        variants {
          id
          sku
          featuredImage {
            data: gatsbyImageData(width: 600)
          }
          featuredImageClear {
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
