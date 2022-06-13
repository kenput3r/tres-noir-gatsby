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
import ProductAction from "./collection-product-action"

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

  const [productLink, setProductLink] = useState(
    isSunglasses
      ? `/products/${data.handle}?lens_type=sunglasses`
      : `/products/${data.handle}?lens_type=glasses`
  )

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
    setProductLink(productLink => `${productLink}&variant=${variant.sku}`)
  }

  let hasNewStyles: boolean = false
  if (data.collection.length > 0)
    hasNewStyles = data.collection.some(col => col.handle === "new")

  return (
    <Component>
      <article className="product-container">
        <Link to={productLink}>
          <Img image={variantImage} alt={data.title} />
          {hasNewStyles && <div className="new-styles">New!</div>}
        </Link>
        <ProductAction>
          <Link to={productLink}>View Product</Link>
        </ProductAction>
      </article>
      <h3>
        <Link to={productLink}>{data.title}</Link>
      </h3>

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
