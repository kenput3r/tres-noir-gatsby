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
    cursor: pointer;
    // on hover, fill in the svgs and siblings before it with gold
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
  const handleHoverIn = (
    evt: React.MouseEvent<SVGElement, MouseEvent>,
    star: number
  ) => {
    const target = evt.target as SVGElement
    const siblings = target.parentNode?.childNodes as NodeListOf<SVGElement>
    if (siblings) {
      const starsToFill = Array.from(siblings).slice(0, star)
      starsToFill.forEach((sibling: SVGElement) => {
        if (sibling.nodeName === "svg") {
          sibling.classList.add("fill")
        }
      })
    }
  }

  const handleHoverOut = (
    evt: React.MouseEvent<SVGElement, MouseEvent>,
    star: number
  ) => {
    const target = evt.target as SVGElement
    const siblings = target.parentNode?.childNodes as NodeListOf<SVGElement>
    if (siblings) {
      const starsToFill = Array.from(siblings).slice(0, star)
      starsToFill.forEach((sibling: SVGElement) => {
        if (sibling.nodeName === "svg") {
          if (sibling.classList.contains("active")) return
          sibling.classList.remove("fill")
        }
      })
    }
  }

  return (
    <StarList>
      {starArr.map(star => (
        <StarIcon
          key={`star-${star}`}
          role="button"
          onClick={() => handleChange(star)}
          className={star <= rating ? "fill active" : ""}
          onMouseEnter={evt => handleHoverIn(evt, star)}
          onMouseLeave={evt => handleHoverOut(evt, star)}
        />
      ))}
    </StarList>
  )
}

export default ReviewFormStarInput
