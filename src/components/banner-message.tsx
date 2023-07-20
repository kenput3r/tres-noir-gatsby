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
    "ALL ORDERS PLACED NOW WILL NOT START SHIPPING UNTIL AUGUST 1ST. CUSTOM & RX ORDERS WILL START SHIPPING AUGUST 8TH."
  return <Component>{message}</Component>
}

export default BannerMessage
