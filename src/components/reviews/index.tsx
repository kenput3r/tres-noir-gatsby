import React from "react"
import styled from "styled-components"
import { YotpoRetrieveReviewsResponse } from "../../types/yotpo"
import useReviews from "../../contexts/reviews/hooks"
import { Bottomline } from "../../types/yotpo"
import ReviewList from "./review-list"
import ReviewForm from "./review-form"
import ReviewsEmpty from "./reviews-empty"
const Component = styled.section`
  p {
    margin: unset;
  }
  p,
  span,
  label {
    font-family: var(--sub-heading-font);
  }
  h4 {
    font-weight: normal !important;
    font-size: 20px;
    text-transform: uppercase;
  }
`
type Props = {
  context: YotpoRetrieveReviewsResponse
}
const Reviews = () => {
  const { data, isLoading } = useReviews()

  return isLoading || !data ? (
    <></>
  ) : (
    <Component>
      <ReviewForm />

      <ReviewList reviews={data.reviews} />
      {!data.reviews.length && <ReviewsEmpty />}
    </Component>
  )
}

export default Reviews
