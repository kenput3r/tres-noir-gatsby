import React from "react"
import styled from "styled-components"
import useReviews from "../../contexts/reviews/hooks"
import {
  IoMdThumbsDown as ThumbsDownIcon,
  IoMdThumbsUp as ThumbsUpIcon,
} from "react-icons/io"

const VotesContainer = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: end;
  gap: 10px;
  @media screen and (min-width: 768px) {
    gap: 15px;
  }
  .thumbs-wrapper {
    display: flex;
    gap: 10px;
  }
  .thumbs {
    display: flex;
    align-items: center;
    gap: 3px;
  }
  span {
    color: var(--color-grey-dark);
    font-size: 14px;
  }
  svg {
    fill: var(--color-grey-dark);
    :hover {
      fill: #666666;
      cursor: pointer;
    }
  }
`
const ReviewVotes = ({
  reviewId,
  votesUp,
  votesDown,
}: {
  reviewId: number
  votesUp: number
  votesDown: number
}) => {
  const { mutateReviewThumbVote } = useReviews()
  const handleClick = (vote: "up" | "down") => {
    console.log("thumbs", vote)
    mutateReviewThumbVote({ vote, reviewId })
  }

  return (
    <VotesContainer>
      <span>Was this review helpful?</span>
      <div className="thumbs-wrapper">
        <div className="thumbs">
          <span>{votesUp}</span>
          <ThumbsUpIcon role="button" onClick={() => handleClick("up")} />
        </div>
        <div className="thumbs">
          <ThumbsDownIcon role="button" onClick={() => handleClick("down")} />
          <span>{votesDown}</span>
        </div>
      </div>
    </VotesContainer>
  )
}

export default ReviewVotes
