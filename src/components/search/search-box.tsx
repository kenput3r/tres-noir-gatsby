import React, { useState } from "react"
import { navigate } from "gatsby"
import styled from "styled-components"
import { connectSearchBox } from "react-instantsearch-dom"

const Component = styled.div`
  display: block;
  max-width: 480px;
  margin: 0 auto;
  input {
    border: 1px solid #555;
    border-radius: 5px;
    width: 100%;
    padding: 9px 4px 9px 40px;
    outline-offset: 0;
    background: transparent
      url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' class='bi bi-search' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'%3E%3C/path%3E%3C/svg%3E")
      no-repeat 13px center;
  }
`

const Actions = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const BackButton = styled.button`
  background-color: #000;
  color: #fff;
  font-size: 1.5rem;
  padding: 0.75rem 2rem;
  border: none;
  margin: 1rem;
  text-align: center;
  cursor: pointer;
`

const SearchButton = styled.button`
  background-color: #000;
  color: #fff;
  font-size: 1.5rem;
  padding: 0.75rem 2rem;
  border: none;
  margin: 1rem;
  text-align: center;
  cursor: pointer;
`

const SearchBox = ({ currentRefinement, refine, prevPath }) => {
  const [query, setQuery] = useState<string>("")

  const handleSubmit = (evt: { preventDefault: () => void }) => {
    evt.preventDefault()
    refine(query)
  }

  const handleChange = (evt: {
    currentTarget: { value: React.SetStateAction<string> }
  }) => {
    setQuery(evt.currentTarget.value)
  }

  return (
    // <Component>
    //   <input
    //     type="search"
    //     value={currentRefinement}
    //     placeholder="Search..."
    //     onChange={event => refine(event.currentTarget.value)}
    //   />
    // </Component>
    <Component>
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          value={query}
          placeholder="Search..."
          onChange={handleChange}
        />
        <Actions>
          {prevPath && (
            <BackButton type="button" onClick={() => navigate(prevPath)}>
              GO BACK
            </BackButton>
          )}
          <SearchButton type="button" onClick={() => refine(query)}>
            SEARCH
          </SearchButton>
        </Actions>
      </form>
    </Component>
  )
}

export default connectSearchBox(SearchBox)
