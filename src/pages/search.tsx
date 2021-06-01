import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"

interface Location {
  location: {
    state: {
      prevPath: string
      key: string
    }
  }
}

const Search = ({ location: { state } }: Location) => {
  return (
    <Layout>
      <SEO title="Search" />
      <Page>
        <h1>Search</h1>
        <p>
          some search form stuff will go here or{" "}
          <Link to={state.prevPath}>GO BACK</Link>
        </p>
      </Page>
    </Layout>
  )
}

export default Search

const Page = styled.div``
