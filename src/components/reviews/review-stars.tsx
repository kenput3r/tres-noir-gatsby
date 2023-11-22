import React from "react"
import styled from "styled-components"
import { AiFillStar as StarIcon } from "react-icons/ai"

const StarList = styled.div`
  .fill {
    fill: #ffd700;
  }
  svg {
    fill: none;
    stroke: black;
    stroke-width: 10px;
    stroke-linejoin: round;
    paint-order: stroke;
  }
`
export const ReviewStars = ({ score }: { score: number }) => {
  const starArr = Array.from(Array(5), (_, x) => x + 1)

  return (
    <StarList>
      {starArr.map(star => (
        <StarIcon
          className={score >= star ? "fill" : ""}
          key={`star-${star}`}
        />
      ))}
    </StarList>
  )
}
export default ReviewStars
