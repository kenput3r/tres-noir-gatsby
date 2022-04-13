import React from "react"
import styled from "styled-components"
import { GatsbyImage as Image } from "gatsby-plugin-image"
import { ShopifyProduct } from "../types/shopify"
import { Link } from "gatsby"
//import { useQuantityQuery } from "../hooks/useQuantityQuery"

const Component = styled.article`
  margin-bottom: 1.45rem;
  width: 30%;
`

const Product = ({ data }: { data: ShopifyProduct }) => {
<<<<<<< HEAD
  console.log(data)
  //const productQuantities = useQuantityQuery(data.handle, data.variants.length)
=======
>>>>>>> f77eba1706b620527d5708150f30c5a8778fc1e7
  return (
    <Component>
      <h3>{data.title}</h3>
      <p>
        from {parseFloat(data.priceRangeV2.minVariantPrice.amount).toFixed(2)}
      </p>
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
