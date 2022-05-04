import React from "react"
import { Link } from "gatsby"
import { GatsbyImage, StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"
import { ShopifyProduct } from "../types/shopify"

const Component = styled.article`
  p {
    font-family: var(--heading-font);
    text-transform: uppercase;
    font-size: 1.09rem;
    @media screen and (max-width: 600px) {
      font-size: 0.98rem;
    }
    margin-bottom: 0;
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
              alt={data.featuredImage.altText}
            />
          ) : (
            <StaticImage
              src="../images/edit.png"
              alt="Empty product image"
              className="product-image"
            />
          )}
        </Link>
        <p className="product-title">{data.title}</p>
        <p className="product-price">${price} USD</p>
      </div>
    </Component>
  )
}

export default Product
