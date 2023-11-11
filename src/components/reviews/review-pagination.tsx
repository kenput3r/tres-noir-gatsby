import React from "react"
import styled from "styled-components"
import {
  BsChevronLeft as LeftIcon,
  BsChevronRight as RightIcon,
} from "react-icons/bs"
import type { Pagination } from "../../types/yotpo"
import useReviews from "../../contexts/reviews/hooks"

const Component = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  .page-number {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    border: 1px solid black;
    cursor: pointer;
  }
  .active {
    background: var(--color-grey-dark);
  }
  .icon {
    margin: 15px;
  }
  .no-styles {
    background: unset;
    padding: unset !important;
    margin: unset !important;
    display: grid;
    place-items: center;
    border: none;
    cursor: pointer;
    :disabled {
      cursor: default;
    }
  }
`
type Props = {
  pagination: Pagination
}
const ReviewPagination = ({ pagination }: Props) => {
  const { refreshToPage } = useReviews()
  const { page, total } = pagination
  const showPagination = total > 0
  const range = total <= 5 ? total : 5
  const pages = Array.from(Array(range), (_, x) => x + 1)
  const disableBack = page === pages[0]
  const disableForward = page === pages[pages.length - 1]
  const goToPage = (pageNumber: number) => {
    refreshToPage(pageNumber)
  }
  return (
    <Component>
      {showPagination && (
        <>
          <button
            className="no-styles"
            disabled={disableBack}
            onClick={() => goToPage(page - 1)}
          >
            <LeftIcon className="icon" role="button" />
          </button>
          {pages.map(pageNumber => (
            <div
              className={`page-number ${page === pageNumber ? "active" : ""}`}
              key={`review-pagination-page-number-${pageNumber}`}
              role="button"
              onClick={() => goToPage(pageNumber)}
            >
              <span>{pageNumber}</span>
            </div>
          ))}
          <button
            className="no-styles"
            disabled={disableForward}
            onClick={() => goToPage(page + 1)}
          >
            <RightIcon className="icon" role="button" />
          </button>
        </>
      )}
    </Component>
  )
}

export default ReviewPagination
