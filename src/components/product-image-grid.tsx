import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { GatsbyImage, StaticImage } from "gatsby-plugin-image"

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

const ProductImageGrid = (props: { product: any; selectedVariant: any }) => {
  const { product, selectedVariant } = props

  interface ImageSet {
    data: any
    title: string
    id: string
  }

  const createImageSet = () => {
    let imageSet: ImageSet[] = []
    // single Product with images
    if (product.featuredImage && product.featuredImage.localFile) {
      imageSet.push({
        data: product.featuredImage?.localFile?.childImageSharp
          ?.gatsbyImageData,
        title: product.featuredImage.altText,
        id: product.featuredImage.localFile.id,
      })
    }
    if (product.images) {
      product.images.forEach(element => {
        if (element.localFile.id !== product.featuredImage.localFile.id)
          imageSet.push({
            data: element.localFile.childImageSharp.gatsbyImageData,
            title: element.altText,
            id: element.localFile.id,
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
  const [featuredImage, setFeaturedImage] = useState<ImageSet | undefined>(
    imageSetArr[0]
  )

  useEffect(() => {
    if (
      selectedVariant &&
      selectedVariant.selectedOptions.some(e => e.name !== "Size")
    ) {
      if (selectedVariant.image) {
        const toSwap = imageSetArr.find(
          el => el.id === selectedVariant.image.localFile.id
        )
        setFeaturedImage(toSwap)
      }
    }
  }, [selectedVariant])

  return (
    <Component>
      <div className="featured-image">
        {featuredImage && featuredImage.data ? (
          <GatsbyImage
            image={featuredImage.data}
            alt={featuredImage.title}
          ></GatsbyImage>
        ) : (
          <StaticImage
            src="../images/product-no-image.jpg"
            alt="No image available"
          ></StaticImage>
        )}
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
