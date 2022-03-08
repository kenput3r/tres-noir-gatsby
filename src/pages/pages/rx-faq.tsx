import React from "react"
import styled from "styled-components"
import Layout from "../../components/layout"
import SEO from "../../components/seo"

const Page = styled.div`
  h1,
  p {
    text-align: center;
  }
`

const RxFAQ = () => (
  <Layout>
    <Page>
      <SEO title="Rx FAQ" />
      <h1>Rx FAQ</h1>
      <p>FAQ Here</p>
    </Page>
  </Layout>
)

export default RxFAQ
