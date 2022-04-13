import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { FaFacebookF as F } from "react-icons/fa"
import { TiSocialInstagram as I } from "react-icons/ti"
import FooterLinks from "./footer/footer-links"
import FooterForm from "./footer/footer-form"
import { StaticImage } from "gatsby-plugin-image"

const Component = styled.footer`
  background-color: var(--color-grey-dark);
  color: #fff;
  font-family: var(--sub-heading-font);
  padding: 30px 45px;
  @media (max-width: 600px) {
    padding: 15px 0;
  }
  svg {
    font-size: 1.5rem;
  }
  .flex-child {
    display: flex;
    flex-direction: column;
  }
  nav {
    display: flex;
    align-items: baseline;
    span {
      padding-bottom: 10px;
    }
    ul {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: center;
      margin-left: 0;
      flex: 1;
      li {
        margin-bottom: 0.2rem;
        @media (max-width: 800px) {
          font-size: 0.95rem;
        }
        //font-size: 1rem;
        a {
          padding: 3px;
          text-transform: uppercase;
        }
      }
      :nth-child(2) {
        margin-left: 1.3rem;
      }
    }
  }
  .store-details {
    p,
    a {
      color: black;
    }
  }
  .social-media {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    @media (max-width: 600px) {
      justify-content: flex-start;
      align-items: flex-start;
    }
    ul {
      margin-left: 0;
      margin-bottom: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      @media (max-width: 600px) {
        justify-content: flex-start;
      }
      column-gap: 25px;
      li {
        display: inline;
      }
    }
    p {
      margin-bottom: 0.4rem;
      color: black;
      text-transform: uppercase;
      font-family: var(--heading-font);
    }
  }
  span {
    color: black;
    text-transform: uppercase;
    font-family: var(--heading-font);
  }
  li {
    list-style: none;
  }
  a {
    color: #fff;
    text-decoration: none;
  }
  .newsletter-form {
    p {
      margin-bottom: 5px;
      color: black;
      text-transform: uppercase;
      font-family: var(--heading-font);
      @media (max-width: 600px) {
        margin-top: 10px;
      }
    }
    .form-group {
      display: flex;
    }
    button {
      background-color: #000;
      color: #fff;
      border-color: #000;
      border-style: solid;
      width: 40px;
      border-radius: 0;
    }
    input {
      width: 100%;
      border-radius: 0;
      @media (max-width: 600px) {
        width: 275px;
      }
      padding: 2px 5px;
      :placeholder-shown {
        font-style: italic;
      }
    }
  }
  .row {
    display: flex;
    justify-content: space-between;
    column-gap: 1rem;
    @media (max-width: 600px) {
      flex-direction: column;
    }
    :nth-child(2) {
      margin-top: -1rem;
      @media (max-width: 600px) {
        margin-top: 1rem;
      }
    }
  }
  .page-width {
    max-width: 1200px;
    margin: 0 auto;
    @media (max-width: 749px) {
      padding-left: 22px;
      padding-right: 22px;
    }
    padding-left: 55px;
    padding-right: 55px;
  }
`

const Footer = () => {
  return (
    <Component>
      <div className="page-width">
        <div className="row">
          <div className="flex-child">
            <FooterLinks></FooterLinks>
          </div>
          <div className="flex-child">
            <div className="social-media">
              <p>Follow us on social media</p>
              <ul className="social-media-list">
                <li className="social">
                  <a
                    href="https://instagram.com/tresnoir"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <I />
                  </a>
                </li>
                <li>
                  <a
                    href="https://facebook.com/tresnoir"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <F />
                  </a>
                </li>
              </ul>
            </div>
            <FooterForm></FooterForm>
          </div>
        </div>
        <div className="row">
          <div className="flex-child">
            <div className="store-details">
              <p>
                <a href="tel:1-714-656-4796">714.656.4796</a>
                <br />
                2831 W 1st St, Santa Ana, CA 92703
              </p>
            </div>
          </div>
          <div className="flex-child">
            <figure>
              <picture>
                <StaticImage
                  src="../images/tres-noir-independent-eyewear-co.png"
                  alt="Tres Noir Independent Eyewear Co"
                  height={50}
                ></StaticImage>
              </picture>
            </figure>
          </div>
        </div>
      </div>
    </Component>
  )
}

export default Footer
