import React from "react"
import styled from "styled-components"
import { BsStarFill as StarIcon } from "react-icons/bs"
import { BsStarHalf as StarHalfIcon } from "react-icons/bs"

const StarList = styled.div`
  display: flex;
  padding-bottom: 6px;
  gap: 2.5px;
  .fill {
    fill: #ffd700;
  }
  svg {
    font-size: 16px;
    fill: none;
    stroke: black;
    stroke-width: 0.4px;
    stroke-linejoin: round;
    paint-order: stroke;
  }
`

type Props = {
  score: number
}

const ReviewBottomlineStars = ({ score }: Props) => {
  const getWholeNumber = (num: number) => {
    return num | 0
  }

  const getStarCount = () => {
    const wholeNumber = getWholeNumber(score)
    const decimal = score - wholeNumber
    if (decimal > 0.25 && decimal < 0.75) {
      return wholeNumber + 0.5
    } else if (decimal >= 0.75) {
      return wholeNumber + 1
    } else {
      return wholeNumber
    }
  }

  const formattedScore = getStarCount()

  const starArr = Array.from(Array(5), (_, x) => x + 1)

  return (
    <StarList>
      {starArr.map(star => {
        const isFill = formattedScore >= star
        const isHalf = formattedScore - star === 0.5
        return isHalf ? (
          <StarHalfIcon key={`review-bottomline-half-star-${star}-${score}`} />
        ) : (
          <StarIcon
            className={isFill ? "fill" : ""}
            key={`review-bottomline-star-${star}-${score}`}
          />
        )
      })}
    </StarList>
  )
}

export default ReviewBottomlineStars
