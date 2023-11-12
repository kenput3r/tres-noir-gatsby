import React from "react"
import styled from "styled-components"
import { AiFillStar as StarIcon } from "react-icons/ai"

const StarList = styled.div`
  margin-top: 8px;
  .fill {
    fill: #ffd700;
  }
  svg {
    margin: 0 1px;
    fill: none;
    stroke: black;
    stroke-width: 10px;
    stroke-linejoin: round;
    font-size: 22px;
    paint-order: stroke;
    /* :hover {
      fill: red;
    } */
    cursor: pointer;
    :hover ~ svg {
      fill: #ffd700;
    }
  }
`
type Props = {
  rating: number
  setRating: (_rating: number) => void
  clearError: () => void
}
export const ReviewFormStarInput = ({
  rating,
  setRating,
  clearError,
}: Props) => {
  const starArr = Array.from(Array(5), (_, x) => x + 1)

  const handleChange = (star: number) => {
    if (!rating) clearError()
    setRating(star)
  }

  return (
    <StarList>
      {starArr.map(star => (
        <StarIcon
          key={`star-${star}`}
          role="button"
          onClick={() => handleChange(star)}
          className={star <= rating ? "fill" : ""}
        />
      ))}
    </StarList>
  )
}

export default ReviewFormStarInput
