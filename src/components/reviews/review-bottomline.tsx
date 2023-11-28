import React from "react"
import styled from "styled-components"
import ReviewBottomlineStars from "./review-bottomline-stars"
import { Bottomline } from "../../types/yotpo"

type Props = {
  bottomline: Bottomline
}

const Component = styled.section``

const ReviewBottomline = ({ bottomline }: Props) => {
  const { total_review, average_score } = bottomline

  return (
    <Component>
      <div>
        <ReviewBottomlineStars score={average_score} />
        <span>{average_score.toFixed(2)}</span>
      </div>
      <div>
        <span>{total_review} reviews</span>
      </div>
    </Component>
  )
}

export default ReviewBottomline
