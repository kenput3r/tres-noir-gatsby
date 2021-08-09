import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import styled from "styled-components"

import Header from "./header"
import Drawer from "./drawer"
import Footer from "./footer"
import "./layout.css"
import "./fonts.css"

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const data = useStaticQuery(graphql`
    query SiteTitleQueryIndex {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  return (
    <>
      <Header
        siteTitle={data.site.siteMetadata?.title || `Title`}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        isIndex={true}
      />
      <Drawer isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
      <Main>{children}</Main>
      <Footer />
    </>
  )
}

export default Layout

const Main = styled.main`
  max-width: 100%;
  .container {
    max-width: 1440px;
    margin: auto;
  }
`
