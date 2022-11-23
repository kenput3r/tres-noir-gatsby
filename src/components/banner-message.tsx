import React from "react"
import styled from "styled-components"

const Component = styled.div`
  background-color: #000;
  color: #fff;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  padding: 0.75em;
`

const BannerMessage = () => {
  const message =
    "Buy One Get One 50% OFF All Glasses! ** Excludes Limited, Rx and Custom."
  return <Component>{message}</Component>
}

export default BannerMessage
