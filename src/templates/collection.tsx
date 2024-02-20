import React, { useEffect } from "react"
import { graphql } from "gatsby"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Product from "../components/product"
import { ShopifyCollection, ShopifyProduct } from "../types/shopify"
import { GatsbyImage } from "gatsby-plugin-image"
import FreeShipping from "../components/free-shipping"
import { viewedCollectionGTMEvent } from "../helpers/gtm"

const Page = styled.section`
  .grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    @media screen and (max-width: 600px) {
      grid-template-columns: repeat(2, 1fr);
      padding: 0;
    }
    @media screen and (min-width: 601px) and (max-width: 1023px) {
      grid-template-columns: repeat(3, 1fr);
      padding: 0 10px;
    }
    grid-template-rows: auto;
    @media screen and (max-width: 600px) {
      gap: 30px 20px;
    }
    gap: 40px 30px;
    margin: 40px 0;
    padding: 0 22px;
    margin-bottom: 55px;
  }
  .image-container {
    position: relative;
    .top-right {
      max-width: 350px;
      padding: 10px;
      position: absolute;
      top: 8px;
      right: 16px;
      color: white;
      @media screen and (max-width: 600px) {
        top: unset;
        right: unset;
        position: static;
        text-align: center;
        max-width: unset;
        h1,
        p {
          color: black;
        }
      }
      h1 {
        font-weight: normal;
        text-transform: uppercase;
        font-size: 2rem;
        margin-bottom: 8px;
      }
      p {
        font-family: var(--sub-heading-font);
        margin-bottom: 0;
      }
    }
  }
  .collection-image {
    margin: 0 -15px;
    height: 435px;
    @media screen and (max-width: 600px) {
      height: 200px;
    }
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    @media screen and (min-width: 600px) {
      background-color: rgba(0, 0, 0, 0.25);
    }

    margin: 0 -15px;
  }
  .overlay-less {
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
    position: static;
    padding: 10px 5px;
    margin-bottom: 0;
    color: black !important;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    .collection-description {
      max-width: 490px;
    }
    @media screen and (min-width: 601px) {
      margin-top: 5px;
      margin-bottom: 5px;
    }
    @media (max-width: 600px) {
      align-items: center;
      max-width: unset;
      justify-content: center;
      flex-direction: column;
      position: static;
      max-width: unset;
      text-align: center;
      top: unset;
      left: unset;
      right: unset;
    }
  }
`

const Collection = ({
  data,
}: {
  data: {
    shopifyCollection: ShopifyCollection
    contentfulShopifyCollectionImages
  }
}) => {
  const {
    shopifyCollection: collection,
    contentfulShopifyCollectionImages: collectionImages,
  } = data
  const collectionSize = collection.products.length

  const showOverlay = collectionImages ? collectionImages.showOverlay : false

  useEffect(() => {
    const collectionInfo = {
      handle: collection.handle,
      title: collection.title,
    }
    viewedCollectionGTMEvent(collectionInfo)
  }, [])

  const seoDescription = collectionImages
    ? collectionImages.description
    : collection.description

  const getCollectionImage = () => {
    if (collectionImages && collectionImages.collectionImageTop) {
      return {
        url: collectionImages.collectionImageTop.url,
        alt: collectionImages.collectionImageTop.title,
      }
    }
    if (collection.image) {
      return {
        url: collection.image.originalSrc,
        alt: collection.image.originalSrc,
      }
    }
    return undefined
  }

  const isEmpty = collection.products.length === 0

  return (
    <Layout>
      <SEO
        title={collection.title}
        description={seoDescription}
        image={getCollectionImage()}
      />
      <FreeShipping />
      <Page>
        {isEmpty ? (
          <div className="container">
            <p>There are no products in this collection</p>
          </div>
        ) : (
          <div className="container">
            {collectionImages ? (
              showOverlay ? (
                <div className="image-container">
                  <div>
                    <GatsbyImage
                      className="collection-image"
                      image={
                        collectionImages.collectionImageTop?.gatsbyImageData
                      }
                      alt={
                        collectionImages.collectionImageTop?.title
                          ? collectionImages.collectionImageTop?.title
                          : collection.title
                      }
                    />
                    <div className="overlay"></div>
                  </div>
                  <div className="top-right">
                    <h1>{collection.title}</h1>
                    <p>{collectionImages.description}</p>
                  </div>
                </div>
              ) : (
                <div className="image-container">
                  <div>
                    <GatsbyImage
                      className="collection-image"
                      image={
                        collectionImages.collectionImageTop?.gatsbyImageData
                      }
                      alt={
                        collectionImages.collectionImageTop?.title
                          ? collectionImages.collectionImageTop?.title
                          : collection.title
                      }
                    />
                  </div>
                  <div className="overlay-less">
                    <h1>{collection.title}</h1>
                    <p>{collectionImages.description}</p>
                  </div>
                </div>
              )
            ) : null}

            <div className="grid">
              {collection.products
                .slice(0, 8)
                .map((product: ShopifyProduct) => (
                  <Product
                    key={product.handle}
                    data={product}
                    collection={collection.title}
                  />
                ))}
            </div>
            {collectionImages &&
              collectionSize >= 8 &&
              collectionImages.collectionImageMiddle?.gatsbyImageData && (
                <div className="image-container">
                  <div>
                    <GatsbyImage
                      className="collection-image"
                      image={
                        collectionImages.collectionImageMiddle?.gatsbyImageData
                      }
                      alt={
                        collectionImages.collectionImageMiddle?.title
                          ? collectionImages.collectionImageMiddle?.title
                          : collection.title
                      }
                    />
                  </div>
                </div>
              )}

            <div className="grid">
              {collectionSize >= 8 &&
                collection.products
                  .slice(8, collectionSize)
                  .map((product: ShopifyProduct) => (
                    <Product
                      key={product.handle}
                      data={product}
                      collection={collection.title}
                    />
                  ))}
            </div>
          </div>
        )}
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
      description
      image {
        altText
        originalSrc
      }
      products {
        handle
        featuredImage {
          altText
          localFile {
            childImageSharp {
              gatsbyImageData(width: 275, formats: [AUTO, WEBP], quality: 50)
            }
          }
          originalSrc
        }
        onlineStoreUrl
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
          price
          compareAtPrice
          legacyResourceId
          title
          sku
          storefrontId
        }
        vendor
      }
    }
    contentfulShopifyCollectionImages(handle: { eq: $handle }) {
      showOverlay
      description
      collectionImageTop {
        url
        gatsbyImageData
        title
      }
      collectionImageMiddle {
        gatsbyImageData
        title
      }
      name
    }
  }
`
