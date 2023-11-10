import React from "react"
import styled from "styled-components"
import { FaUserCircle as UserIcon } from "react-icons/fa"
import { Review as ReviewType } from "../../types/yotpo"
import ReviewStars from "./review-stars"
import ReviewVotes from "./review-votes"
import ReviewAuthor from "./review-author"

const Component = styled.section`
  margin-bottom: 16px;
  display: flex;
  .outer {
    flex: 1;
  }
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
  const {
    id,
    content,
    user,
    score,
    created_at,
    title,
    votes_up,
    votes_down,
    verified_buyer,
  } = review
  const date = new Date(created_at).toLocaleDateString("en-US")
  return (
    <Component>
      <div>
        <ReviewAuthor isVerified={verified_buyer} />
      </div>
      <div className="outer">
        <div className="review-name-date">
          <span className="review-author">{user.display_name}</span>
          <span>{date}</span>
        </div>
        <div>
          <ReviewStars score={score} />
        </div>
        <p className="review-title">{title}</p>
        <p className="review-content">{content}</p>
        <ReviewVotes reviewId={id} votesUp={votes_up} votesDown={votes_down} />
      </div>
    </Component>
  )
}

export default ReviewItem
