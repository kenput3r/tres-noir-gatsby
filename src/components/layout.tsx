import React, { useState, useEffect, useContext } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { CustomerContext } from "../contexts/customer"
import { identifyCustomer } from "../helpers/klaviyo"

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
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const { customerEmail } = useContext(CustomerContext)

  useEffect(() => {
    if (customerEmail) identifyCustomer(customerEmail)
  }, [customerEmail])

  return (
    <>
      <Header
        siteTitle={data.site.siteMetadata?.title || `Title`}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />
      <Drawer isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default Layout
