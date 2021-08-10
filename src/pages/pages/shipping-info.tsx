import React from "react"
import styled from "styled-components"
import Layout from "../../components/layout"
import SEO from "../../components/seo"

const ShippingInfo = () => {
  return (
    <Layout>
      <Page>
        <SEO title="Shipping Info" />
        <h1>Shipping Info</h1>
        <p>Shipping Info Here</p>
      </Page>
    </Layout>
  )
}

export default ShippingInfo

const Page = styled.div`
  h1 {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  p {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`
