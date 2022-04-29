import React, { useState } from "react"
import styled from "styled-components"
import { GatsbyImage } from "gatsby-plugin-image"

const Component = styled.section`
  .image-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    div {
      cursor: pointer;
    }
    margin-top: 15px;
  }
`

const ProductImageGrid = (props: {
  product: any
  hasSingleVariant: boolean
}) => {
  const { product, hasSingleVariant } = props

  interface ImageSet {
    data: any
    title: string
  }

  const createImageSet = () => {
    let imageSet: ImageSet[] = []
    // single Product with images
    if (product.featuredImage) {
      imageSet.push({
        data: product.featuredImage.localFile.childImageSharp.gatsbyImageData,
        title: product.featuredImage.altText,
      })
    }
    if (product.images) {
      product.images.forEach(element => {
        const img = {
          data: element.localFile.childImageSharp.gatsbyImageData,
          title: element.altText,
        }
        if (element.localFile.id !== product.featuredImage.localFile.id)
          imageSet.push({
            data: element.localFile.childImageSharp.gatsbyImageData,
            title: element.altText,
          })
      })
    }
    // variant with images
    // else {
    //   product.variants.forEach(element => {
    //     if (element.image) {
    //       const img = {
    //         data: element.image.localFile.childImageSharp.gatsbyImageData,
    //         title: element.image.altText,
    //       }
    //       imageSet.push(img)
    //     }
    //   })
    //   // variant with product images, not attached to variant
    //   if (product.images && imageSet.length === 0) {
    //     product.images.forEach(element => {
    //       const img = {
    //         data: element.localFile.childImageSharp.gatsbyImageData,
    //         title: element.altText,
    //       }
    //       imageSet.push(img)
    //     })
    //   }
    // }
    // imageSet.unshift({
    //   data: product.featuredImage.localFile.childImageSharp.gatsbyImageData,
    //   title: product.featuredImage.altText,
    // })
    return imageSet
  }
  const imageSetArr = createImageSet()
  const [featuredImage, setFeaturedImage] = useState<ImageSet>(imageSetArr[0])

  return (
    <Component>
      <div className="featured-image">
        <GatsbyImage
          image={featuredImage.data}
          alt={featuredImage.title}
        ></GatsbyImage>
      </div>
      <div className="image-grid">
        {imageSetArr.length !== 0 &&
          imageSetArr.map((image, index) => {
            return (
              <div
                onClick={() => setFeaturedImage(image)}
                key={index}
                className="product-image"
              >
                <GatsbyImage image={image.data} alt={image.title}></GatsbyImage>
              </div>
            )
          })}
      </div>
    </Component>
  )
}

export default ProductImageGrid
