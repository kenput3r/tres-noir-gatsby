import React from "react"
import styled from "styled-components"
import { YotpoRetrieveReviewsResponse } from "../../types/yotpo"
import useReviews from "../../contexts/reviews/hooks"
import { Bottomline } from "../../types/yotpo"
import ReviewList from "./review-list"
import ReviewForm from "./review-form"
const Component = styled.section`
  p,
  span,
  label {
    font-family: var(--sub-heading-font);
  }
  h4 {
    font-weight: normal;
    font-size: 16px;
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
    </Component>
  )
}

export default Reviews
