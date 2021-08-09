import React from "react"
import styled from "styled-components"
import Layout from "../../components/layout"
import SEO from "../../components/seo"

const WarrantyInfo = () => {
  return (
    <Layout>
      <Page>
        <SEO title="Warranty Info" />
        <h1>Warranty Info</h1>
        <p>Warranty Info Here</p>
      </Page>
    </Layout>
  )
}

export default WarrantyInfo

const Page = styled.div`
  h1 {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 8em;
  }
`
