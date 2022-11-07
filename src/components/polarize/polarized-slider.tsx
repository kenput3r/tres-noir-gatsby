import React from "react"
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
  ReactCompareSliderHandle,
} from "react-compare-slider"
import styled from "styled-components"

const Component = styled.section`
  margin-bottom: 35px;
  width: 100%;
  display: flex;
`

const PolarizedSlider = () => {
  return (
    <Component>
      <ReactCompareSlider
        handle={
          <ReactCompareSliderHandle
            buttonStyle={{
              width: "40px",
              height: "40px",
            }}
            linesStyle={{ opacity: 0 }}
          />
        }
        itemOne={
          <ReactCompareSliderImage
            src="https://cdn.shopify.com/s/files/1/0053/3299/2100/files/non-polarized.-gray.jpg?v=1620938546"
            alt="Image one"
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src="https://cdn.shopify.com/s/files/1/0053/3299/2100/files/polarized-new-lake-tahoe.jpg?v=1618355696"
            alt="Image two"
          />
        }
      />
    </Component>
  )
}

export default PolarizedSlider
