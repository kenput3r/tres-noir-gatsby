import React from "react"
import styled from "styled-components"
import { useStaticQuery, graphql } from "gatsby"

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
  const data = useStaticQuery(graphql`
    query getBannerMessage {
      contentfulHomepage {
        bannerMessage
        bannerMessageToggle
      }
    }
  `)
  const { bannerMessage, bannerMessageToggle } = data.contentfulHomepage
  return bannerMessageToggle && <Component>{bannerMessage}</Component>
}

export default BannerMessage
