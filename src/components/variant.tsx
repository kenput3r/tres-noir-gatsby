import React from "react"
import styled from "styled-components"
import { Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import ProductAction from "./collection-product-action"

const Component = styled.div`
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
  .variant-container {
    position: relative;
    &:hover > a > .gatsby-image-wrapper {
      opacity: 0.7;
    }
    @media (hover: hover) {
      &:hover > .collection-product-action {
        max-height: 50px;
      }
    }
  }
`

type Props = { contentfulData: any; shopifyData: any }

const Variant = ({ contentfulData, shopifyData }: Props) => {
  return (
    <Component>
      <article className="variant-container">
        <Link>
          <GatsbyImage
            image={contentfulData.featuredImage.data}
            alt={contentfulData.title}
          />
        </Link>
      </article>
    </Component>
  )
}

export default Variant
