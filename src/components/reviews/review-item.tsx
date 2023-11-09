import React from "react"
import styled from "styled-components"
import { Review as ReviewType } from "../../types/yotpo"
import { AiFillStar as StarIcon } from "react-icons/ai"

const Component = styled.section``

type Props = { review: ReviewType }

const ReviewItem = ({ review }: Props) => {
  console.log(" single review", review)
  const { content, user, score, created_at } = review
  const date = new Date(created_at).toLocaleDateString("en-US")
  return (
    <Component>
      <div>
        <div>
          <span>{user.display_name}</span>
        </div>
        <div>
          <span>{date}</span>
        </div>
        <div>
          <Stars score={score} />
        </div>
      </div>
      <p>{content}</p>
    </Component>
  )
}

const StarList = styled.div`
  .fill {
    fill: #ffd700;
  }
  svg {
    fill: none;
    stroke: black;
    stroke-width: 6px;
    stroke-linejoin: round;
    paint-order: stroke;
  }
`
const Stars = ({ score }: { score: number }) => {
  console.log("score", score)
  const starArr = Array.from(Array(5), (_, x) => x + 1)

  return (
    <StarList>
      {starArr.map(star => (
        <>
          <StarIcon className={score >= star ? "fill" : ""} />
        </>
      ))}
    </StarList>
  )
}

export default ReviewItem
