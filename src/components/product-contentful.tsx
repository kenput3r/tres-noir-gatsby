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
  text-align: center;
  @media only screen and (max-width: 480px) {
    width: 100%;
  }
  h3 {
    text-align: center;
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

  const productLink = isSunglasses
    ? `/products/${data.handle}?lens_type=sunglasses`
    : `/products/${data.handle}?lens_type=glasses`

  return (
    <Component>
      <Link to={productLink}>
        <Img image={variantImage} alt={data.title} />
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
