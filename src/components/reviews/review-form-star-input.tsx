import React, { useEffect } from "react"
import styled from "styled-components"
import { AiFillStar as StarIcon } from "react-icons/ai"

const Component = styled.div`
  .error {
    color: red;
  }
`

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
    cursor: pointer;
  }
`
type ReviewStarsInputProps = {
  rating: number
  setRating: (r: number) => void
  hasError: boolean
}
export const ReviewFormStarInput = ({
  rating,
  setRating,
  hasError,
}: ReviewStarsInputProps) => {
  const starArr = Array.from(Array(5), (_, x) => x + 1)

  const getFillClassName = (star: number) => {
    if (!rating) return ""
    return star <= rating ? "fill" : ""
  }

  useEffect(() => {
    console.log("rating", rating)
  }, [rating])

  return (
    <Component>
      <StarList>
        {starArr.map(star => (
          <StarIcon
            key={`star-${star}`}
            role="button"
            onClick={() => setRating(star)}
            className={getFillClassName(star)}
          />
        ))}
      </StarList>
      {hasError && (
        <div className="error">
          <span>Please add a score.</span>
        </div>
      )}
    </Component>
  )
}
