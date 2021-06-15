import { Link } from "gatsby"
import React, { useState, useEffect, SetStateAction, Dispatch } from "react"
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"
import { FaSearch, FaFacebookF, FaBars } from "react-icons/fa"
import { TiSocialInstagram } from "react-icons/ti"
import DesktopNavigation from "./desktopNavigation"

interface HeaderProps {
  siteTitle: string
  isDrawerOpen: boolean
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>
  isIndex?: boolean
}

const Header = ({
  siteTitle,
  isDrawerOpen,
  setIsDrawerOpen,
  isIndex,
}: HeaderProps) => {
  const [currentPath, setCurrentPath] = useState("/")
  if (typeof window !== `undefined`) {
    useEffect(() => {
      setCurrentPath(location.pathname)
    }, [location])
  }
  return (
    <Component>
      <div className="top-wrapper">
        {isIndex ? (
          <h1 className="h1">
            <Link to="/" className="logo-link">
              <StaticImage
                src="../images/tres-noir-independent-eyewear-co-24.png"
                alt={siteTitle}
                placeholder="tracedSVG"
                style={{ marginBottom: 0 }}
              />
            </Link>
          </h1>
        ) : (
          <div className="h1">
            <Link to="/" className="logo-link">
              <StaticImage
                src="../images/tres-noir-independent-eyewear-co-24.png"
                alt={siteTitle}
                placeholder="tracedSVG"
                style={{ marginBottom: 0 }}
              />
            </Link>
          </div>
        )}
        <div className="icons">
          <div className="social">
            <a
              href="https://www.instagram.com/tresnoir/"
              target="_blank"
              rel="noreferrer"
            >
              <TiSocialInstagram className="instagram" />
            </a>
            <a
              href="https://www.facebook.com/tresnoir"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebookF />
            </a>
          </div>
          <div className="search">
            <Link to="/search" state={{ prevPath: currentPath }}>
              <FaSearch />
            </Link>
            <a href="#" className="login-text">
              LOG IN
            </a>
            <a href="#">
              <StaticImage
                src="../images/cart.png"
                alt="Shopping Cart"
                placeholder="tracedSVG"
                style={{ marginBottom: 0, maxWidth: 26 }}
              />
            </a>
            <a
              href="#"
              className="hide-large"
              role="button"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            >
              <FaBars />
            </a>
          </div>
        </div>
      </div>
      <div className="wrapper hide-small">
        <DesktopNavigation />
      </div>
    </Component>
  )
}

export default Header

const Component = styled.header`
  font-family: var(--sub-heading-font);
  margin-bottom: 1.45rem;
  .top-wrapper {
    text-align: center;
    margin-bottom: 2.5rem;
  }
  .h1 {
    margin: 0 auto;
    max-width: 50vw;
    padding-top: 20px;
    width: 400px;
  }
  .logo-link {
    display: flex;
    padding: 5px;
    .gatsby-image-wrapper {
      margin: 0 auto;
    }
  }
  .icons {
    display: flex;
    flex-direction: row;
    width: 1280px;
    max-width: 100%;
    padding: 0 5px;
    margin: -42px auto 0;
  }
  .social {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex: 1;
    a {
      color: #000;
      padding: 0 5px;
    }
    svg {
      font-size: 26px;
      &.instagram {
        font-size: 32px;
        margin-top: 3px;
      }
    }
  }
  .search {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    flex: 1;
    a {
      color: #000;
      display: flex;
      padding: 0 10px;
    }
  }
  .login-text {
    border-left: 1px solid var(--color-grey-dark);
    text-decoration: none;
  }
  .wrapper {
    display: flex;
    flex-direction: row;
    margin: 0 auto;
    padding-bottom: 0;
  }
  .hide-large {
    display: none !important;
  }
  @media (max-width: 959px) {
    .top-wrapper {
      margin-bottom: 1.45rem;
    }
    .icons {
      margin: 1.45rem auto 0;
    }
  }
  @media (max-width: 767px) {
    .hide-large {
      display: flex !important;
    }
    .hide-small {
      display: none;
    }
  }
  @media (max-width: 500px) {
    .search {
      flex: 1.5;
    }
  }
`
