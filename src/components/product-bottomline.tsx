import React from "react"
import styled from "styled-components"
import { useReviews } from "../contexts/reviews"
import ReviewBottomline from "./reviews/review-bottomline"

const Component = styled.section`
  margin-top: 1px;
  margin-bottom: 8px;
  span {
    font-family: var(--sub-heading-font);
  }
`

const ProductBottomline = () => {
  const { data, isLoading } = useReviews()

  return data && !isLoading ? (
    <Component>
      <ReviewBottomline bottomline={data.bottomline} />
    </Component>
  ) : null
}

export default ProductBottomline
