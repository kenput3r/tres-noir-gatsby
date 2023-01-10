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
  const message =
    "25% OFF Entire Website. *Excludes Rx, custom lenses and Mooneyes"
  return <Component>{message}</Component>
}

export default BannerMessage
