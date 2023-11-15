import React from "react"
import styled from "styled-components"
import { useReviews } from "../../contexts/reviews"
import ReviewList from "./review-list"
import ReviewForm from "./review-form"
import ReviewsEmpty from "./reviews-empty"
import ReviewPagination from "./review-pagination"
const Component = styled.section`
  button {
    padding: 8px 15px;
  }
  p {
    margin: unset;
  }
  p,
  span,
  input,
  label,
  textarea {
    font-family: var(--sub-heading-font);
  }
  h4 {
    font-weight: normal !important;
    font-size: 20px;
    text-transform: uppercase;
  }
`

const Reviews = () => {
  const { data, isLoading } = useReviews()

  return isLoading || !data ? (
    <></>
  ) : (
    <Component>
      <ReviewForm />

      <ReviewList reviews={data.reviews} />
      {!data.reviews.length && <ReviewsEmpty />}
      <ReviewPagination pagination={data.pagination} />
    </Component>
  )
}

export default Reviews
