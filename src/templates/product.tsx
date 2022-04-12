import React, { useState, useContext, useEffect, ChangeEvent } from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import {
  StaticImage,
  GatsbyImage as Img,
  GatsbyImage,
} from "gatsby-plugin-image"
import { CustomerContext } from "../contexts/customer"
import { CartContext } from "../contexts/cart"
import styled from "styled-components"
import ProductCarousel from "../components/product-carousel"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { useQuantityQuery } from "../hooks/useQuantityQuery"
import {
  addedToCartKlaviyoEvent,
  viewedProductKlaviyoEvent,
} from "../helpers/klaviyo"

const Page = styled.div`
  .shipping-message {
    text-align: center;
    .h2 {
      font-family: var(--sub-heading-font);
      font-weight: normal;
      margin-top: 0.5rem;
      margin-bottom: 0.2rem;
    }
    .h3 {
      color: var(--color-grey-dark);
      font-family: var(--sub-heading-font);
      font-weight: normal;
    }
  }
  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 1280px;
    max-width: 100%;
    margin: 0 auto;
  }
  .col {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 1.45rem;
    &.images {
      flex: 1.5;
      max-width: 65%;
    }
  }
  .heading {
    align-self: flex-start;
  }
  .product-dropdown {
    font-family: var(--sub-heading-font);
    p {
      margin-bottom: 0;
      font-size: 0.875rem;
      color: var(--color-grey-dark);
    }
    select {
      width: 210px;
      height: 40px;
      border: 1px solid #e1e3e4;
      color: #8a8f93;
    }
  }
  h1 {
    font-weight: normal;
    font-size: 3rem;
    text-transform: uppercase;
    margin-bottom: 0;
  }
  .fit {
    color: var(--color-grey-dark);
    font-size: 1.5rem;
    text-transform: capitalize;
    span {
      float: right;
    }
  }
  .options {
    button {
      background-color: transparent;
      border: 1px solid #fff;
      border-radius: 50%;
      line-height: 0;
      margin-right: 5px;
      padding: 5px;
      max-width: 50px;
      &[data-active="true"] {
        border-color: #000;
      }
      :hover {
        cursor: pointer;
      }
      .gatsby-image-wrapper {
        border-radius: 50%;
      }
    }
  }
  .selected-text-label {
    font-size: 1.5rem;
    span {
      color: var(--color-grey-dark);
      text-transform: uppercase;
    }
  }
  .price {
    font-family: var(--sub-heading-font);
    margin-top: 1.45rem;
  }
  p.label {
    color: var(--color-grey-dark);
    margin-bottom: 0;
    line-height: 1.5;
  }
  p.value {
    font-size: 2rem;
    span {
      float: right;
      font-weight: normal;
      a {
        color: var(--color-grey-dark);
        text-decoration: none;
      }
    }
  }
  .actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-family: var(--sub-heading-font);
    .sold-out {
      opacity: 0.5;
      pointer-events: none;
    }
    div {
      display: flex;
      flex-direction: column;
    }
    button,
    a {
      background-color: #000;
      color: #fff;
      border-radius: 0%;
      font-size: 1.5rem;
      font-weight: normal;
      line-height: 0.7;
      padding: 1rem 2rem;
      width: 100% !important;
      max-width: 100% !important;
      text-decoration: none;
      text-align: center;
      -webkit-appearance: button-bevel;
      cursor: pointer;
    }
    p {
      color: var(--color-grey-dark);
      font-size: 1.5rem;
      text-align: center;
      margin: 12px 0;
      &.small {
        font-size: 1rem;
      }
    }
  }
  @media (max-width: 500px) {
    .shipping-message {
      .h3 {
        font-size: 1rem;
        margin-bottom: 0;
      }
    }
    .col {
      flex: none;
      width: 100%;
      &.images {
        width: 100%;
        max-width: 100%;
      }
    }
    .options {
      button {
        max-width: 45px;
      }
    }
  }
  @media (max-width: 375px) {
    p.value {
      font-size: 1.75rem;
    }
  }
  @media (max-width: 320px) {
    h1 {
      font-size: 2.25rem;
    }
    .options {
      button {
        max-width: 40px;
      }
    }
    p.value {
      font-size: 1.5rem;
    }
  }
`
const Product = ({ data: { shopifyProduct } }: any) => {
  const [selectedVariant, setSelectedVariant] = useState(
    shopifyProduct.variants[0]
  )
  console.log("SELECTED VARIANT", selectedVariant)
  const hasSingleVariant: boolean =
    shopifyProduct.variants.length === 1 ? true : false
  const useVariantSwiper: boolean = false
  const quantityLevels = useQuantityQuery(
    shopifyProduct.handle,
    shopifyProduct.variants.length
  )

  const createImageSet = () => {
    interface ImageSet {
      data: any
      title: string
    }
    let imageSet: ImageSet[] = []
    // single Product with images
    if (shopifyProduct.images && hasSingleVariant) {
      shopifyProduct.images.forEach(element => {
        const img = {
          data: element.localFile.childImageSharp.gatsbyImageData,
          title: element.altText,
        }
        imageSet.unshift(img)
      })
    }
    // variant with images
    else {
      shopifyProduct.variants.forEach(element => {
        if (element.image) {
          const img = {
            data: element.image.localFile.childImageSharp.gatsbyImageData,
            title: element.image.altText,
          }
          imageSet.push(img)
        }
      })
      // variant with product images, not attached to variant
      if (shopifyProduct.images && imageSet.length === 0) {
        shopifyProduct.images.forEach(element => {
          const img = {
            data: element.localFile.childImageSharp.gatsbyImageData,
            title: element.altText,
          }
          imageSet.push(img)
        })
      }
    }
    return imageSet
  }
  const imageSetArr = createImageSet()

  const { addProductToCart, checkout } = useContext(CartContext)
  const { customerEmail } = useContext(CustomerContext)

  const handleVariant = (evt: ChangeEvent<HTMLSelectElement>) => {
    const sku = evt.target.value
    const newVariant = shopifyProduct.variants.find(
      (_variant: any) => _variant.sku === sku
    )
    setSelectedVariant(newVariant)
  }

  const handleAddToCart = () => {
    const id = selectedVariant.storefrontId
    addProductToCart(id, 1)
    alert("ADDED TO CART")
    // klaviyo
    if (customerEmail) {
      const productData = {
        title: shopifyProduct.title,
        legacyResourceId: shopifyProduct.legacyResourceId,
        sku: selectedVariant.sku,
        productType: shopifyProduct.productType,
        image: selectedVariant?.image?.originalSrc
          ? selectedVariant.image?.originalSrc
          : shopifyProduct.featuredImage.originalSrc,
        url: shopifyProduct.onlineStoreUrl,
        vendor: shopifyProduct.vendor,
        price: selectedVariant.price,
        compareAtPrice: selectedVariant.compareAtPrice,
        collections: shopifyProduct.collections.map(
          (collection: { title: string }) => collection.title
        ),
      }
      addedToCartKlaviyoEvent(productData, checkout)
    }
  }

  return (
    <Layout>
      <SEO title={shopifyProduct.title} />
      <Page>
        <div className="shipping-message">
          <StaticImage
            src="../images/double-diamonds.png"
            alt="double diamonds"
            width={40}
          />
          <p className="h2">FREE SHIPPING IN USA</p>
          <p className="h3">ALL ORDERS SHIP SAME OR NEXT BUSINESS DAY</p>
        </div>
        <div className="row">
          <div className="col images">
            {imageSetArr.length !== 0 ? (
              <ProductCarousel imageSet={imageSetArr} />
            ) : (
              <p>Add placeholder, no image</p>
            )}
          </div>
          <div className="col">
            <div className="heading">
              <h1>{shopifyProduct.title}</h1>
              <form>
                <div className="product-dropdown">
                  {!hasSingleVariant ? (
                    <div>
                      <p>{selectedVariant.selectedOptions[0].name}</p>
                      <div className="select-dropdown">
                        <select
                          id="product-variants"
                          onChange={evt => handleVariant(evt)}
                        >
                          {shopifyProduct.variants.map(element => {
                            return (
                              <option key={element.sku} value={element.sku}>
                                {element.title}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                <div className="price">
                  <p className="label">STARTING AT</p>
                  <p className="value">{selectedVariant.price} USD</p>
                </div>
              </form>
              <div className="actions">
                <div>
                  {quantityLevels &&
                  quantityLevels[selectedVariant.sku] !== 0 ? (
                    <button type="button" onClick={handleAddToCart}>
                      ADD TO CART
                    </button>
                  ) : (
                    <button type="button" className="sold-out">
                      SOLD OUT
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Page>
    </Layout>
  )
}

export default Product

export const query = graphql`
  query ProductQueryShopify($handle: String) {
    shopifyProduct(handle: { eq: $handle }) {
      collections {
        title
      }
      featuredImage {
        originalSrc
      }
      id
      handle
      legacyResourceId
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
      title
      vendor
      images {
        altText
        localFile {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      variants {
        availableForSale
        compareAtPrice
        id
        image {
          originalSrc
          altText
          localFile {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
        selectedOptions {
          name
        }
        legacyResourceId
        price
        sku
        storefrontId
        title
      }
    }
  }
`
