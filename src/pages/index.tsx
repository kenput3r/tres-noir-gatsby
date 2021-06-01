import React from "react"
import { StaticImage } from "gatsby-plugin-image"
import Layout from "../components/layout-index"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to Tres Noir.</p>
    <p>We make great eyewear by hand.</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <StaticImage
        src="../images/tres-noir-x.png"
        alt="Tres Noir"
        placeholder="tracedSVG"
        layout="constrained"
      />
    </div>
  </Layout>
)

export default IndexPage
