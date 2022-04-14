import React from "react"
import { Link } from "gatsby"
import { GatsbyImage as Image } from "gatsby-plugin-image"
import styled from "styled-components"
import { ShopifyProduct } from "../types/shopify"
//import { useQuantityQuery } from "../hooks/useQuantityQuery"

const Component = styled.article`
  margin-bottom: 1.45rem;
  width: 30%;
`

const Product = ({ data }: { data: ShopifyProduct }) => {
  return (
    <Component>
      <h3>{data.title}</h3>
      <p>from {data.priceRangeV2.minVariantPrice.amount}</p>
      <Link to={`../../products/${data.handle}`}>
        {data.featuredImage ? (
          <Image
            image={data.featuredImage.localFile.childImageSharp.gatsbyImageData}
            alt=""
          />
        ) : (
          <p>no image</p>
        )}
      </Link>
    </Component>
  )
}

export default Product
