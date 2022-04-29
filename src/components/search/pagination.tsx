import React from "react"
import { connectPagination } from "react-instantsearch-dom"
import styled from "styled-components"

const Component = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  li {
    list-style: none;
    display: inline;
    flex: 1;
  }
`

const Pagination = ({ currentRefinement, nbPages, refine, createURL }) => (
  <Component>
    {currentRefinement === 0 && (
      <li>
        <a
          href={createURL(currentRefinement - 1)}
          onClick={event => {
            event.preventDefault()
            refine(currentRefinement - 1)
          }}
        >
          Prev
        </a>
      </li>
    )}

    {new Array(nbPages).fill(null).map((_, index) => {
      const page = index + 1
      const style = {
        fontWeight: currentRefinement === page ? "bold" : "",
      }

      return (
        <li key={index}>
          <a
            href={createURL(page)}
            style={style}
            onClick={event => {
              event.preventDefault()
              refine(page)
            }}
          >
            {page}
          </a>
        </li>
      )
    })}

    {currentRefinement !== nbPages && (
      <li>
        <a
          href={createURL(currentRefinement + 1)}
          onClick={event => {
            event.preventDefault()
            refine(currentRefinement + 1)
          }}
        >
          Next
        </a>
      </li>
    )}
  </Component>
)

export default connectPagination(Pagination)
