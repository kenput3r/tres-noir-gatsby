import React, { useState } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { GatsbyImage as Img } from "gatsby-plugin-image"
import { ContentfulProduct } from "../types/contentful-products"

interface Props {
  data: ContentfulProduct
}

const ProductContentful = ({ data }: Props) => {
  console.log(data)
  const defaultImage = data.variants[0].featuredImage.data
  const [variantImage, setVariantImage] = useState<any>(defaultImage)

  const [selectedVariant, setSelectedVariant] = useState({
    contentful: data.variants[0],
  })

  const selectVariant = (e: React.MouseEvent, variant: any) => {
    e.currentTarget && (e.currentTarget as HTMLElement).blur()
    setVariantImage(variant.featuredImage.data)
    setSelectedVariant({
      contentful: variant,
    })
  }

  return (
    <Component>
      <Link
        to={`/products/${data.handle}?variant=${selectedVariant.contentful.sku}`}
      >
        <Img image={variantImage} alt={data.title} />
      </Link>
      <h3>{data.title}</h3>
      <div className="options">
        {data.variants.map((variant: any) => (
          <button
            key={variant.id}
            type="button"
            data-active={variant.id === selectedVariant.contentful.id}
            onClick={e => selectVariant(e, variant)}
            aria-label={`Color option ${variant.colorName}`}
            aria-pressed={
              variant.id === selectedVariant.contentful.id ? "true" : "false"
            }
            title={variant.colorName}
          >
            <Img image={variant.colorImage.data} alt={variant.colorName} />
          </button>
        ))}
      </div>
    </Component>
  )
}

export default ProductContentful

const Component = styled.article`
  margin-bottom: 1.45rem;
  width: 33.33%;
  text-align: center;
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
