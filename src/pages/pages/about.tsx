import React from "react"
import styled from "styled-components"
import Layout from "../../components/layout"
import SEO from "../../components/seo"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage, StaticImage } from "gatsby-plugin-image"

const Page = styled.div`
  h1,
  h2 {
    text-transform: uppercase;
    font-weight: normal;
  }
  h1 {
    padding-top: 10px;
    text-align: center;
  }
  h2 {
    font-size: 115%;
    text-align: justify;
  }
  .page-width {
    max-width: 1200px;
    padding-left: 55px;
    padding-right: 55px;
    margin: 0 auto;
    @media (max-width: 749px) {
      padding-left: 22px;
      padding-right: 22px;
    }
  }
  .row {
    display: flex;
    flex-direction: row;
    .col {
      flex: 1;
      padding: 30px;
      @media (max-width: 899px) {
        padding: 0 15px;
      }
    }
    @media (max-width: 899px) {
      flex-direction: column-reverse;
    }
  }
  article {
    ul {
      margin-left: 0;
      li {
        list-style-position: inside;
        display: flex;
        align-items: center;
        column-gap: 10px;
      }
    }
  }
  p,
  li,
  h2 {
    font-family: var(--sub-heading-font);
  }
  p {
    text-align: justify;
  }
`

const About = () => {
  const aboutImage = useStaticQuery(graphql`
    query AboutImageQuery {
      contentfulMenuItem(name: { eq: "About" }) {
        image {
          gatsbyImageData
          url
        }
      }
    }
  `)
  return (
    <Layout>
      <Page>
        <SEO title="About Us" />
        <h1>About Us</h1>
        <div className="page-width">
          <div className="row">
            <div className="col">
              <h2>
                TRES NOIR EYEWEAR CO. IS A CALIFORNIA BASED, INDEPENDENT, SMALL
                BUSINESS.
              </h2>
              <article>
                <p>
                  Tres Noir is built around making quality product and selling
                  it at a fair price. We believe no one should ever overpay for
                  a pair of sunglasses. We are the anti-luxoticca, anti-big
                  business, eyewear company. We've built the brand around our
                  style and our interests. We believe the customer is above all
                  else and pride ourselves on exceptional service - the result
                  is a loyal and satisfied customer base. We hope that you
                  invest in a pair of Tres Noir Eyewear and find out for
                  yourself.
                </p>
                <ul>
                  <p>PRODUCT FEATURES:</p>

                  <li>
                    <StaticImage
                      alt=""
                      src="../../images/diamond.png"
                      height={13}
                    ></StaticImage>
                    <span>EVERY FRAME IS HAND MADE - NEVER INJECTED</span>
                  </li>
                  <li>
                    <StaticImage
                      alt=""
                      src="../../images/diamond.png"
                      height={13}
                    ></StaticImage>
                    <span>CR-39 SHATTERPROOF LENSES</span>
                  </li>
                  <li>
                    <StaticImage
                      alt=""
                      src="../../images/diamond.png"
                      height={13}
                    ></StaticImage>
                    <span>100% UVA and UVB PROTECTIVE</span>
                  </li>
                  <li>
                    <StaticImage
                      alt=""
                      src="../../images/diamond.png"
                      height={13}
                    ></StaticImage>
                    <span>MOST ARE Rx-ABLE and FEATURE A U BEVEL</span>
                  </li>
                  <li>
                    <StaticImage
                      alt=""
                      src="../../images/diamond.png"
                      height={13}
                    ></StaticImage>
                    <span>ALL TEMPLES CONSTRUCTED AROUND A WIRE CORE</span>
                  </li>
                  <li>
                    <StaticImage
                      alt=""
                      src="../../images/diamond.png"
                      height={13}
                    ></StaticImage>
                    <span>1 YEAR MANUFACTURERS WARRANTY</span>
                  </li>
                </ul>
              </article>
            </div>
            <div className="col">
              <aside>
                <figure>
                  <picture>
                    <GatsbyImage
                      image={
                        aboutImage.contentfulMenuItem.image.gatsbyImageData
                      }
                      alt="Tres Noir Glasses Showcase"
                    ></GatsbyImage>
                  </picture>
                </figure>
              </aside>
            </div>
          </div>
        </div>
      </Page>
    </Layout>
  )
}

export default About
