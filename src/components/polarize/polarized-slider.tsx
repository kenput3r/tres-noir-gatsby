import React from "react"
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
  ReactCompareSliderHandle,
} from "react-compare-slider"
import styled from "styled-components"
import { useWindowSize } from "react-use"
import { StaticImage } from "gatsby-plugin-image"

const Component = styled.section`
  margin-bottom: 35px;
  width: 100%;
  object-fit: cover;
  display: flex;
  img {
    object-fit: fill !important;
  }
  .__rcs-handle-button {
    gap: 4px !important;
    div {
      border-top: 3px solid transparent !important;
      border-bottom: 3px solid transparent !important;
      border-right: 5px solid !important;
    }
  }
  @media screen and (max-width: 480px) {
    height: 300px;
    img {
      object-fit: cover !important;
    }
  }
`

const PolarizedSlider = () => {
  const screenWidth = useWindowSize().width
  return (
    <Component>
      <ReactCompareSlider
        portrait={screenWidth < 481 ? true : false}
        handle={
          <ReactCompareSliderHandle
            buttonStyle={{
              width: "25px",
              height: "25px",
            }}
            linesStyle={{ opacity: 0 }}
            portrait={screenWidth < 481 ? true : false}
          />
        }
        itemOne={
          <ReactCompareSliderImage
            src="https://cdn.shopify.com/s/files/1/0140/0012/8057/files/Non_Polarized_Image.jpg?v=1667847223"
            alt="Non-Polarized"
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src="https://cdn.shopify.com/s/files/1/0140/0012/8057/files/Polarized_Image.jpg?v=1667847223"
            alt="Polarized"
          />
        }
      />
    </Component>
  )
}

// const CustomImage = () => {
//   return (
//     <StaticImage
//       src="https://cdn.shopify.com/s/files/1/0140/0012/8057/files/Non_Polarized_Image.jpg?v=1667847223"
//       alt="Non-Polarized"
//     />
//   )
// }

export default PolarizedSlider
