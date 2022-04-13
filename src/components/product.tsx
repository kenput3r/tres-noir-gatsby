import React from "react"
import styled from "styled-components"
// import { GatsbyImage as Image } from "gatsby-plugin-image"
import { ShopifyProduct } from "../types/shopify"

const Component = styled.article`
  margin-bottom: 1.45rem;
  width: 30%;
`

const Product = ({ data }: { data: ShopifyProduct }) => {
  return (
    <Component>
      <h3>{data.title}</h3>
      {/* <Image
        image={data.images[0].localFile.childImageSharp.gatsbyImageData}
        alt=""
      /> */}
    </Component>
  )
}

export default Product
