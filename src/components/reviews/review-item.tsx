import React from "react"
import styled from "styled-components"
import { Review as ReviewType } from "../../types/yotpo"
import ReviewStars from "./review-stars"
import ReviewVotes from "./review-votes"

const Component = styled.section`
  margin-bottom: 16px;
  .review-author {
    font-weight: bold;
  }
  .review-name-date {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
  }
  .review-title {
    margin-bottom: 6px;
    font-family: var(--heading-font);
  }
  .review-content {
    font-size: 16px;
    line-height: 19px;
  }
`

type Props = { review: ReviewType }

const ReviewItem = ({ review }: Props) => {
  console.log("single review", review)
  const { id, content, user, score, created_at, title, votes_up, votes_down } =
    review
  const date = new Date(created_at).toLocaleDateString("en-US")
  return (
    <Component>
      <div>
        <div className="review-name-date">
          <span className="review-author">{user.display_name}</span>
          <span>{date}</span>
        </div>
        <div>
          <ReviewStars score={score} />
        </div>
      </div>
      <p className="review-title">{title}</p>
      <p className="review-content">{content}</p>
      <ReviewVotes reviewId={id} votesUp={votes_up} votesDown={votes_down} />
    </Component>
  )
}
export default ReviewItem
