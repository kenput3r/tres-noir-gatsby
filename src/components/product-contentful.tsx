import React, { useState, useContext } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { GatsbyImage as Img, IGatsbyImageData } from "gatsby-plugin-image"
import {
  ContentfulProduct,
  ContentfulProductVariant,
} from "../types/contentful"
import { SelectedVariantContext } from "../contexts/selectedVariant"

import ProductOptionsCarousel from "../components/product-options-carousel"

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
  h3 {
    text-align: center;
    font-weight: 400;
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
    .new-styles {
      position: absolute;
      top: 0;
      left: 0;
      font-size: 0.8rem;
      background: red;
      color: white;
      padding: 0 5px;
      border-radius: 6px;
    }
  }
`

interface Props {
  data: ContentfulProduct
  color: null | string
  collectionHandle: string
}

const ProductContentful = ({ data, color, collectionHandle }: Props) => {
  const { setSelectedVariantContext } = useContext(SelectedVariantContext)

  const isSunglasses = collectionHandle.includes("sunglasses")

  const defaultImage = isSunglasses
    ? data.variants[0].featuredImage.data
    : data.variants[0].featuredImageClear?.data
    ? data.variants[0].featuredImageClear.data
    : data.variants[0].featuredImage.data

  // const defaultImage = data.variants[0].featuredImage.data
  const [variantImage, setVariantImage] =
    useState<IGatsbyImageData>(defaultImage)

  const [selectedVariant, setSelectedVariant] = useState({
    contentful: data.variants[0],
  })

  const selectVariant = (
    // e: React.MouseEvent,
    variant: ContentfulProductVariant
  ) => {
    // e.currentTarget && (e.currentTarget as HTMLElement).blur()
    const defaultImage = isSunglasses
      ? variant.featuredImage.data
      : variant.featuredImageClear?.data
      ? variant.featuredImageClear.data
      : variant.featuredImage.data
    setVariantImage(defaultImage)
    // setVariantImage(variant.featuredImage.data)
    setSelectedVariant({
      contentful: variant,
    })
    setSelectedVariantContext(variant.sku)
  }

  const hasNewStyles = data.collection.some(col => col.name === "New")

  const productLink = isSunglasses
    ? `/products/${data.handle}?lens_type=sunglasses`
    : `/products/${data.handle}?lens_type=glasses`
  return (
    <Component>
      <Link to={productLink}>
        <article className="product-container">
          <Img image={variantImage} alt={data.title} />
          {data.newStyles && <div className="new-styles">New Styles</div>}
        </article>
      </Link>
      <h3>{data.title}</h3>

      <ProductOptionsCarousel
        uniqueId={`Product-${data.title
          .toLowerCase()
          .replace(" ", "-")
          .replace(/[^a-z0-9]/gi, "")}`}
        variants={data.variants}
        clickHandler={selectVariant}
        color={color}
      />
    </Component>
  )
}

export default ProductContentful
