import React from "react"
import styled from "styled-components"
import { GatsbyImage as Image } from "gatsby-plugin-image"
import { ShopifyProduct } from "../types/shopify"
import { Link } from "gatsby"

const Component = styled.article`
  margin-bottom: 1.45rem;
  width: 30%;
`

const Product = ({ data }: { data: ShopifyProduct }) => {
  console.log(data.handle)
  return (
    <Component>
      <h3>{data.title}</h3>
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
