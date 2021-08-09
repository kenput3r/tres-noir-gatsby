import React from "react"
import styled from "styled-components"
import Layout from "../../components/layout"
import SEO from "../../components/seo"

const ReturnPolicy = () => {
  return (
    <Layout>
      <Page>
        <SEO title="Return Policy" />
        <h1>Return Policy</h1>
        <p>Return Policy Here</p>
      </Page>
    </Layout>
  )
}

export default ReturnPolicy

const Page = styled.div`
  h1 {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 8em;
  }
`
