import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { GatsbyImage as Image } from "gatsby-plugin-image"
import { ShopifyProduct } from "../types/shopify"

const Product = ({ data }: { data: ShopifyProduct }) => {
  console.log(data)
  return (
    <Component>
      <h3>{data.title}</h3>
      <Image
        image={data.images[0].localFile.childImageSharp.gatsbyImageData}
        alt=""
      />
    </Component>
  )
}

export default Product

const Component = styled.article`
  margin-bottom: 1.45rem;
  width: 30%;
`
