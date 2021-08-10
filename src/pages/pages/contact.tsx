import React from "react"
import styled from "styled-components"
import Layout from "../../components/layout"
import SEO from "../../components/seo"

const Contact = () => {
  return (
    <Layout>
      <Page>
        <SEO title="Contact Us" />
        <h1>Contact Us</h1>
        <p>Contact Form Here</p>
      </Page>
    </Layout>
  )
}

export default Contact

const Page = styled.div`
  h1,
  p {
    text-align: center;
  }
`
