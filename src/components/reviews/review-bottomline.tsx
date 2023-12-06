import React from "react"
import styled from "styled-components"
import ReviewBottomlineStars from "./review-bottomline-stars"
import { Bottomline } from "../../types/yotpo"

type Props = {
  bottomline: Bottomline
}

const Component = styled.section`
  display: flex;
  align-items: center;
  gap: 5px;
  span {
    padding-top: 2px;
    color: var(--color-grey-dark);
    font-family: var(--sub-heading-font);
    font-size: 15px;
  }
`

const ReviewBottomline = ({ bottomline }: Props) => {
  const { total_review, average_score } = bottomline

  return (
    <Component>
      <ReviewBottomlineStars score={average_score} />
      <span>{`(${total_review})`}</span>
    </Component>
  )
}

export default ReviewBottomline
