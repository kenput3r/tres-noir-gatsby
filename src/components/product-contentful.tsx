import React, { useState } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { GatsbyImage as Img } from "gatsby-plugin-image"
import {
  ContentfulProduct,
  ContentfulProductVariant,
} from "../types/contentful"
import ProductOptionsCarousel from "../components/product-options-carousel"
import ProductAction from "./collection-product-action"
import { useFilterHiddenCustomizableVariants } from "../hooks/useFilterHiddenCustomizableVariants"
import { useFilterDuplicateFrames } from "../hooks/useFilterDuplicateFrames"

const Component = styled.article`
  margin-bottom: 1.45rem;
  width: 33.33%;
  @media screen and (min-width: 601px) and (max-width: 1023px) {
    width: 50%;
  }
  padding: 0 15px;
  text-align: center;
  font-family: var(--heading-font);
  text-transform: uppercase;
  @media only screen and (max-width: 600px) {
    width: 100%;
  }
  h3 a {
    color: #000;
    text-decoration: none;
    text-align: center;
    font-weight: 400;
    &:visited {
      color: #000;
    }
    &:hover {
      text-decoration: underline;
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
  .product-container {
    position: relative;
    &:hover > a > .gatsby-image-wrapper {
      opacity: 0.7;
    }
    @media (hover: hover) {
      &:hover > .collection-product-action {
        max-height: 50px;
      }
    }
    .new-styles {
      position: absolute;
      top: 13px;
      left: 0;
      font-size: 1.15rem;
      background: #ff051d;
      color: white;
      padding: 0 10px;
      border-radius: 6px;
      font-family: var(--sub-heading-font);
    }
  }
`

interface Props {
  data: ContentfulProduct
  color: null | string
  collectionHandle: string
  shopifyProduct: {
    handle: string
    variants: {
      sku: string
      metafields: {
        key: string
        value: string
      }[]
    }[]
  }
}

const ProductContentful = ({
  data,
  color,
  collectionHandle,
  shopifyProduct,
}: Props) => {
  const isSunglasses =
    collectionHandle.includes("sunglasses") || collectionHandle.includes("new")
  const lensType = isSunglasses ? "sunglasses" : "glasses"
  const hasNewStyles = data.collection.some(col => col.handle === "new")

  // remove variants marked as 'hidden' in shopify
  if (shopifyProduct) {
    data.variants = useFilterHiddenCustomizableVariants(data, shopifyProduct)
  }
  data.variants = useFilterDuplicateFrames(lensType, data.variants)

  const [selectedVariant, setSelectedVariant] =
    useState<ContentfulProductVariant>(data.variants[0])

  const productLink = isSunglasses
    ? `/products/${data.handle}?lens_type=sunglasses`
    : `/products/${data.handle}?lens_type=glasses`

  const selectVariant = (variant: ContentfulProductVariant) => {
    setSelectedVariant(variant)
  }

  return (
    <Component>
      <article className="product-container">
        <Link to={`${productLink}&variant=${selectedVariant.sku}`}>
          <Img
            image={
              !isSunglasses && selectedVariant.featuredImageClear?.data
                ? selectedVariant.featuredImageClear.data
                : selectedVariant.featuredImage.data
            }
            alt={data.title}
          />
          {hasNewStyles && <div className="new-styles">New!</div>}
        </Link>
        <ProductAction>
          <Link to={`${productLink}&variant=${selectedVariant.sku}`}>
            View Product
          </Link>
        </ProductAction>
      </article>
      <h3>
        <Link to={`${productLink}&variant=${selectedVariant.sku}`}>
          {data.title}
        </Link>
      </h3>

      <ProductOptionsCarousel
        uniqueId={`product-${data.id}`}
        variants={data.variants}
        clickHandler={selectVariant}
        color={color}
      />
    </Component>
  )
}

export default ProductContentful
