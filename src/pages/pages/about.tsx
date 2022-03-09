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

const About = () => (
  <Layout>
    <Page>
      <SEO title="Contact Us" />
      <h1>About Us</h1>
      <p>About us page</p>
    </Page>
  </Layout>
)

export default About
