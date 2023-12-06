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
    color: var(--color-grey-dark);
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
