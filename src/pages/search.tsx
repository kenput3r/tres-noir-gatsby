import React from "react"
import { navigate } from "gatsby"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"
// search
import "instantsearch.css/themes/satellite.css"
import algoliasearch from "algoliasearch/lite"
import {
  Configure,
  InstantSearch,
  RefinementList,
  Pagination,
  connectStateResults,
} from "react-instantsearch-dom"
import SearchBox from "../components/search/search-box"
import Hits from "../components/search/hits"
import CustomPagination from "../components/search/pagination"

const searchClient = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID as string,
  process.env.GATSBY_ALGOLIA_SEARCH_KEY as string
)

interface Location {
  location: {
    state: {
      prevPath: string
      key: string
    }
  }
}

const hitsPerPage = 15

const Page = styled.div``

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  .ais-Pagination-link {
    border-radius: 0;
    background-image: unset;
    border-color: #000;
    box-shadow: none;
  }
  .ais-Pagination-item--selected .ais-Pagination-link {
    border-color: #000;
    box-shadow: none;
    background-image: unset;
  }
  .ais-Pagination-item--disabled .ais-Pagination-link {
    border-color: #000;
    box-shadow: none;
    background-image: unset;
  }
`

const Search = ({ location: { state } }: Location) => {
  const Results = connectStateResults(({ searchState, searchResults }) => {
    return searchState && searchState.query ? (
      searchResults && searchResults.nbHits !== 0 ? (
        <>
          <RefinementList attribute="product_type" />
          <Hits />
          {searchResults.nbHits > hitsPerPage && (
            <PaginationContainer>
              {/* <Pagination /> */}
              <CustomPagination />
            </PaginationContainer>
          )}
        </>
      ) : (
        <div className="text-center">No Results</div>
      )
    ) : null
  })

  return (
    <Layout>
      <InstantSearch searchClient={searchClient} indexName="Products">
        <Configure hitsPerPage={hitsPerPage} />
        <SEO title="Search" />
        <Page>
          <h1 className="text-center">SEARCH</h1>
          <div className="text-center">
            <SearchBox prevPath={state?.prevPath} />
          </div>
          <Results />
        </Page>
      </InstantSearch>
    </Layout>
  )
}

export default Search
