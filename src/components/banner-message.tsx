import React from "react"
import styled from "styled-components"
import { BANNER_MESSAGE } from "../utils/consts"

const Component = styled.div`
  background-color: #a30000;
  color: #fff;
  font-weight: bold;
  text-align: center;
  text-transform: uppercase;
  padding: 0.75em;
  @media screen and (max-width: 414px) {
    font-weight: normal;
    font-size: 11px;
    line-height: 12px;
    padding: 8px;
  }
`

const BannerMessage = () => {
  return BANNER_MESSAGE && BANNER_MESSAGE !== "" ? (
    <Component>{BANNER_MESSAGE}</Component>
  ) : null
}

export default BannerMessage
