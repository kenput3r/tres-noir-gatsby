import React from "react"
import styled from "styled-components"

const Component = styled.div`
  background-color: #a30000;
  color: #fff;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  padding: 0.75em;
`

const BannerMessage = () => {
  const message = "20% OFF Rx & Custom Lenses"
  return <Component>{message}</Component>
}

export default BannerMessage
