import React, { useState } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { GatsbyImage as Image } from "gatsby-plugin-image"
import { ContentfulProduct } from "../types/contentful-products"

interface Props {
  data: ContentfulProduct
}

const ProductContentful = ({ data }: Props) => {
  console.log(data)
  const defaultImage = data.variants[0].featuredImage.gatsbyImageData
  const [variantImage, setVariantImage] = useState<any>(defaultImage)
  const [selected, setSelected] = useState<string>(data.variants[0].colorName)

  const handleClick = (name: any) => {
    const variant = data.variants.find(({ colorName }) => colorName === name)
    if (variant) {
      setVariantImage(variant.featuredImage.gatsbyImageData)
      setSelected(name)
    }
  }

  return (
    <Component>
      <Image image={variantImage} alt={data.title} />
      <h3>{data.title}</h3>
      <div className="variants">
        <div className="grid">
          {data.variants.map((variant: any) => (
            <Image
              className={selected === variant.colorName ? "active" : ""}
              key={variant.colorName}
              image={variant.colorImage.gatsbyImageData}
              alt={variant.colorName}
              onClick={() => handleClick(variant.colorName)}
              title={variant.colorName}
            />
          ))}
        </div>
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
  .variants {
    width: 80%;
    margin: auto;
    .grid {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-evenly;
      align-items: center;
      .gatsby-image-wrapper {
        cursor: pointer;
        width: 40px;
        &.active {
          border-radius: 25px;
          border: 3px solid #000;
        }
      }
    }
  }
`
