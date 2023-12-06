import React from "react"
import styled from "styled-components"
import { useReviews } from "../contexts/reviews"
import ReviewBottomline from "./reviews/review-bottomline"

const Component = styled.section`
  min-height: 22px;
  margin-top: 1px;
  margin-bottom: 8px;
  span {
    font-family: var(--sub-heading-font);
  }
`

const ProductBottomline = () => {
  const { data, isLoading } = useReviews()

  return (
    <Component>
      {data && !isLoading && <ReviewBottomline bottomline={data.bottomline} />}
    </Component>
  )
}

export default ProductBottomline
