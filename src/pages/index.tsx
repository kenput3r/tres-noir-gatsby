import React from "react"
import { StaticImage, GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"
import styled from "styled-components"
import Layout from "../components/layout-index"
import SEO from "../components/seo"
import { Link, graphql } from "gatsby"
import Carousel from "../components/carousel"

const IndexPage = ({
  data: { contentfulHomepage },
}: {
  data: HomePageQuery
}) => {
  return (
    <>
      <Layout>
        <SEO title="Home" />
        <Page>
          <div className="shipping-message container">
            <StaticImage
              src="../images/double-diamonds.png"
              alt="double diamonds"
              width={40}
            />
            <p className="h2">FREE SHIPPING IN USA</p>
            <p className="h3">ALL ORDERS SHIP SAME OR NEXT BUSINESS DAY</p>
          </div>
          <div className="featured container">
            <GatsbyImage
              image={contentfulHomepage.hero.gatsbyImageData}
              alt="Hero"
            />
            <div className="featured-actions">
              <Link className="button" to="/collections/glasses-for-men">
                SHOP MEN'S
              </Link>
              <Link className="button" to="/collections/glasses-for-women">
                SHOP WOMEN'S
              </Link>
            </div>
          </div>
          <h3 className="sub-title">{contentfulHomepage.tagline.tagline}</h3>
          <div className="diamond-divider">
            <StaticImage
              src="../images/double-diamonds.png"
              alt="double diamonds"
              width={40}
            />
          </div>
          <div className="featured-styles container">
            <h2>FEATURED STYLES</h2>
            <Carousel
              imageSet={contentfulHomepage && contentfulHomepage.featuredStyles}
              imageLinks={
                contentfulHomepage && contentfulHomepage.featuredStylesLinks
              }
            />
          </div>
          <div className="about">
            <div className="about-content container">
              <GatsbyImage
                image={contentfulHomepage.aboutTresNoir1.gatsbyImageData}
                alt="About Tres Noir 1"
              />
              <GatsbyImage
                image={contentfulHomepage.aboutTresNoir2.gatsbyImageData}
                alt="About Tres Noir 2"
              />
            </div>
          </div>
        </Page>
      </Layout>
    </>
  )
}

export default IndexPage

const Page = styled.div`
  margin: auto;
  .shipping-message {
    text-align: center;
    .h2 {
      font-family: var(--sub-heading-font);
      font-weight: normal;
      margin-top: 0.5rem;
      margin-bottom: 0.2rem;
    }
    .h3 {
      color: var(--color-grey-dark);
      font-family: var(--sub-heading-font);
      font-weight: normal;
    }
  }
  .featured {
    position: relative;
    display: block;
    .featured-actions {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      text-align: right;
      button,
      .button {
        display: inline-block;
        margin: 10px;
      }
    }
  }
  .featured-styles {
    max-width: 80%;
    @media only screen and (max-width: 480px) {
      max-width: 100%;
    }
  }
  button,
  .button {
    background-color: #fff;
    border-radius: 0;
    border: 1px solid #fff;
    color: #000;
    display: block;
    font-family: var(--sub-heading-font);
    padding: 10px 20px;
    text-decoration: none;
    :hover {
      cursor: pointer;
    }
  }
  .diamond-divider {
    text-align: center;
  }
  .sub-title {
    max-width: 60%;
    text-align: center;
    display: block;
    margin: 1.45rem auto;
    padding: 10px 20px;
  }
  h2 {
    text-align: center;
    margin: 1.45rem auto;
  }
  .about {
    background: #000;
    margin-top: -100px;
    @media only screen and (max-width: 480px) {
      margin-top: -25px;
    }
    .about-content {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      @media only screen and (max-width: 480px) {
        display: block;
      }
      .gatsby-image-wrapper {
        margin: 200px 20px 100px 20px;
        padding: 20px;
        @media only screen and (max-width: 480px) {
          margin: 0 15px;
          padding: 0;
          &:nth-child(1) {
            margin-top: 50px;
          }
          &:nth-child(2) {
            margin-bottom: 25px;
          }
        }
      }
    }
  }
`

interface HomePageQuery {
  contentfulHomepage: {
    hero: {
      gatsbyImageData: IGatsbyImageData
    }
    tagline: {
      tagline: string
    }
    featuredStyles: [
      {
        data: IGatsbyImageData
        title: string
      }
    ]
    featuredStylesLinks: string[]
    aboutTresNoir1: {
      gatsbyImageData: IGatsbyImageData
    }
    aboutTresNoir2: {
      gatsbyImageData: IGatsbyImageData
    }
  }
}

export const query = graphql`
  query HomepageQuery {
    contentfulHomepage {
      hero {
        gatsbyImageData
      }
      tagline {
        tagline
      }
      featuredStyles {
        data: gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED)
        title
      }
      featuredStylesLinks
      aboutTresNoir1 {
        gatsbyImageData
      }
      aboutTresNoir2 {
        gatsbyImageData
      }
    }
  }
`
