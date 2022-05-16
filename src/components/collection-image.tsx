import React from "react"
import styled from "styled-components"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

const Component = styled.section`
  .image-container {
    position: relative;
    /* max-height: 435px; */
    .collection-image {
      margin: 0 -15px;
      height: 435px;
      @media screen and (max-width: 600px) {
        height: 200px;
        filter: unset !important;
      }
    }
    .inner-text {
      h1 {
        font-weight: normal;
        text-transform: uppercase;
        font-size: 2rem;
        margin-bottom: 8px;
        text-transform: uppercase;
      }
      p {
        font-family: var(--sub-heading-font);
        margin-bottom: 0;
      }
      position: absolute;
      top: 8px;
      padding: 10px 5px;
      margin-bottom: 0;
      max-width: 490px;
      @media (max-width: 600px) {
        position: static;
        max-width: unset;
        text-align: center;
        top: unset;
        left: unset;
        right: unset;
        color: black !important;
      }
    }
  }
`

const CollectionImage = (props: {
  collectionImage: IGatsbyImageData
  collectionName: string
  collectionDescription: string
  textColor: string
  position: string
}) => {
  const {
    collectionImage,
    collectionName,
    collectionDescription,
    textColor,
    position,
  } = props
  const inlineStyleText = {
    color: textColor,
    right: position === "right" ? "0" : "unset",
    left: position === "left" ? "15px" : "unset",
  }
  // const inlineStyleImage = {
  //   filter: textColor === "white" ? "brightness(0.8)" : "unset",
  // }
  return (
    <Component>
      <div className="image-container">
        <GatsbyImage
          className="collection-image"
          image={collectionImage}
          alt={collectionName}
          // style={inlineStyleImage}
        ></GatsbyImage>
        <div className="inner-text" style={inlineStyleText}>
          <h1>{collectionName}</h1>
          <p>{collectionDescription}</p>
        </div>
      </div>
    </Component>
  )
}
export default CollectionImage
