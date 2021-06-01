import React, { useState, useRef } from "react"
import { Link, graphql } from "gatsby"
import { StaticImage, GatsbyImage as Img } from "gatsby-plugin-image"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"
import ProductCarousel from "../components/product-carousel"

const ProductCustomizable = ({
  data: { contentfulProduct, shopifyProduct },
}: any) => {
  const [selectedVariant, setSelectedVariant] = useState({
    contentful: contentfulProduct.variants[0],
    shopify: shopifyProduct.variants[0],
  })

  const selectVariant = (e: React.MouseEvent, variant: any) => {
    e.currentTarget && e.currentTarget.blur()
    const shopify = shopifyProduct.variants.find(
      (_variant: any) => _variant.sku === variant.sku
    )
    setSelectedVariant({
      contentful: variant,
      shopify,
    })
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
            <ProductCarousel imageSet={selectedVariant.contentful.imageSet} />
          </div>
          <div className="col">
            <div className="heading">
              <h1>{shopifyProduct.title}</h1>
              <p className="fit">
                Size: {contentfulProduct.fitDimensions}{" "}
                <span>
                  {contentfulProduct.fitType === "medium (average)"
                    ? "medium"
                    : contentfulProduct.fitType}{" "}
                  fit
                </span>
              </p>
            </div>
            <form className="options">
              <p className="selected-text-label">
                Color: <span>{selectedVariant.shopify.title}</span>
              </p>
              <div className="buttons">
                {contentfulProduct.variants.map((variant: any) => (
                  <button
                    key={variant.id}
                    type="button"
                    data-active={variant.id === selectedVariant.contentful.id}
                    onClick={e => selectVariant(e, variant)}
                    aria-label={`Color option ${variant.colorImage.title}`}
                    aria-pressed={
                      variant.id === selectedVariant.contentful.id
                        ? "true"
                        : "false"
                    }
                  >
                    <Img
                      image={variant.colorImage.data}
                      alt={variant.colorImage.title}
                    />
                  </button>
                ))}
              </div>
              <div className="price">
                <p className="label">STARTING AT</p>
                <p className="value">
                  ${selectedVariant.shopify.priceV2.amount} USD
                  <span>
                    <Link to={`/${contentfulProduct.handle}`}>
                      Learn More {`>`}
                    </Link>
                  </span>
                </p>
              </div>
              <div className="actions">
                <div>
                  <button type="button">ADD TO CART</button>
                  <p>- OR -</p>
                  <Link
                    to={`/products/${contentfulProduct.handle}/customize?variant=${selectedVariant.shopify.sku}`}
                  >
                    CUSOTMIZE
                  </Link>
                  <p className="small">Click for Polarized, Rx, and more</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Page>
    </Layout>
  )
}

export default ProductCustomizable

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
    align-items: flex-end;
    font-family: var(--sub-heading-font);
    button,
    a {
      background-color: #000;
      color: #fff;
      border-radius: 0;
      font-size: 1.5rem;
      font-weight: normal;
      line-height: 0.7;
      padding: 1rem 2rem;
      width: 100% !important;
      max-width: 100% !important;
      text-decoration: none;
      text-align: center;
      -webkit-appearance: button;
    }
    p {
      color: var(--color-grey-dark);
      font-size: 1.5rem;
      text-align: center;
      margin: 1rem 0;
      &.small {
        font-size: 1rem;
        margin: 0 0;
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

export const query = graphql`
  query ProductQuery($handle: String) {
    contentfulProduct(handle: { eq: $handle }) {
      handle
      fitType
      fitDimensions
      variants {
        colorName
        sku
        colorImage {
          data: gatsbyImageData
          title
        }
        imageSet {
          data: gatsbyImageData(
            layout: CONSTRAINED
            placeholder: BLURRED
            width: 2048
            height: 1365
          )
          title
        }
        id
      }
    }
    shopifyProduct(handle: { eq: $handle }) {
      priceRange {
        minVariantPrice {
          amount
        }
        maxVariantPrice {
          amount
        }
      }
      title
      variants {
        availableForSale
        compareAtPriceV2 {
          amount
        }
        id
        priceV2 {
          amount
        }
        sku
        shopifyId
        title
      }
    }
  }
`
