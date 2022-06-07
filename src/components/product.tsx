import React from "react"
import { Link } from "gatsby"
import { GatsbyImage, StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"
import { ShopifyProduct } from "../types/shopify"

const Component = styled.article`
  h3,
  p {
    font-family: var(--heading-font);
    text-transform: uppercase;
    font-size: 1.09rem;
    @media screen and (max-width: 600px) {
      font-size: 0.98rem;
    }
    margin-bottom: 0;
  }
  h3 {
    font-weight: normal;
    a {
      color: #000;
      text-decoration: none;
      &:visited {
        color: #000;
      }
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .product-price {
    color: var(--color-grey-dark);
  }
  .product-card {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .product-image {
    margin-bottom: 15px;
    &:hover {
      opacity: 0.7;
    }
  }
`

const Product = ({ data }: { data: ShopifyProduct }) => {
  let price: any = data.priceRangeV2.minVariantPrice.amount
  price = parseFloat(price).toFixed(2)
  return (
    <Component>
      <div className="product-card">
        <Link to={`/products/${data.handle}`}>
          {data.featuredImage ? (
            <GatsbyImage
              className="product-image"
              image={
                data.featuredImage.localFile.childImageSharp.gatsbyImageData
              }
              alt={
                data.featuredImage.altText
                  ? data.featuredImage.altText
                  : data.title
              }
            />
          ) : (
            <StaticImage
              src="../images/no-image-placeholder.jpg"
              alt="Empty product image"
              className="product-image"
              layout="constrained"
              width={275}
              height={183}
            />
          )}
        </Link>
        <h3 className="product-title">
          {" "}
          <Link to={`/products/${data.handle}`}>{data.title}</Link>
        </h3>
        <p className="product-price">${price} USD</p>
      </div>
    </Component>
  )
}

export default Product
