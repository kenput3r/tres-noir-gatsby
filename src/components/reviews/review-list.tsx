import React from "react"
import styled from "styled-components"
import { Review as ReviewType } from "../../types/yotpo"
import ReviewItem from "./review-item"

const Component = styled.section``

type Props = { reviews: ReviewType[] }

const ReviewList = ({ reviews }: Props) => {
  return (
    <Component>
      {reviews.map(review => (
        <ReviewItem review={review} />
      ))}
    </Component>
  )
}

export default ReviewList
