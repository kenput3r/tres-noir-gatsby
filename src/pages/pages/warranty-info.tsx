import React from "react"
import styled from "styled-components"
import Layout from "../../components/layout"
import SEO from "../../components/seo"

const Page = styled.div`
  h1 {
    text-align: center;
    padding-top: 10px;
  }
  h1,
  h2 {
    text-transform: uppercase;
    font-weight: normal;
  }
  h2 {
    padding-top: 10px;
    font-size: 1.4em;
    margin-bottom: 15px;
  }
  a {
    color: black;
    text-decoration: none;
  }
  p {
    font-family: var(--sub-heading-font);
    color: var(--color-grey-dark);
    margin-bottom: 16px;
  }
`

const WarrantyInfo = () => (
  <Layout>
    <SEO title="Warranty Info" />
    <Page className="wrapper">
      <h1>Warranty Info</h1>
      <article>
        <h2>Warranty</h2>
        <p>
          All Tres Noir glasses come with a 1 year manufacturers warranty. This
          protects against any manufacturer defects. This does not include lens
          scratches, accidents, normal wear & tear or theft.
        </p>
        <p>
          If it is determined a product has a defect we will repair or replace.
        </p>
        <p>
          To make a warranty claim please email-{" "}
          <a
            href="mailto:info@tresnoir.com"
            aria-describedby="a11y-external-message"
          >
            info@tresnoir.com
          </a>
          .
        </p>
        <p>
          We will not accept a warranty return without a return authorization
          number.
        </p>
        <p>
          NOTE: If your glasses are damaged from an accident or wear & tear,
          many times we can help, email us for more info:{" "}
          <a
            href="mailto:info@tresnoir.com"
            aria-describedby="a11y-external-message"
          >
            info@tresnoir.com
          </a>{" "}
        </p>
        <p>
          We also stock replacement lenses for many of our frames. Replacement
          lenses can be purchased for $46.00.
        </p>
      </article>
    </Page>
  </Layout>
)

export default WarrantyInfo
