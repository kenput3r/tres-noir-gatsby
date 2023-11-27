import React, { useRef } from "react"
import styled from "styled-components"
import { useReviews } from "../../contexts/reviews"
import ReviewList from "./review-list"
import ReviewForm from "./review-form"
import ReviewsEmpty from "./reviews-empty"
import ReviewPagination from "./review-pagination"
import Spinner from "../spinner"
const Component = styled.section`
  button {
    padding: 8px 15px;
  }
  p {
    margin: unset;
  }
  p,
  span,
  input,
  label,
  textarea {
    font-family: var(--sub-heading-font);
  }
  h4 {
    font-weight: normal !important;
    font-size: 20px;
    text-transform: uppercase;
  }
`
const SpinContainer = styled.div`
  padding-bottom: 50px;
  padding-top: 20px;
  .icon-spinner {
    height: 50px;
  }
`

const Reviews = () => {
  const { data, isLoading } = useReviews()

  const reviewListRef = useRef<HTMLDivElement>(null)

  const scrollToTop = () => {
    if (reviewListRef.current) {
      reviewListRef.current.scrollIntoView({
        block: "start",
      })
    }
  }

  return (
    <div ref={reviewListRef}>
      {isLoading || !data ? (
        <SpinContainer>
          <Spinner fill="#000000" />
        </SpinContainer>
      ) : (
        <Component>
          <ReviewForm />
          {!data.reviews.length ? (
            <ReviewsEmpty />
          ) : (
            <>
              <ReviewList reviews={data.reviews} />
              <ReviewPagination
                pagination={data.pagination}
                scrollToTop={scrollToTop}
              />
            </>
          )}
        </Component>
      )}
    </div>
  )

  // return isLoading || !data ? (
  //   <SpinContainer>
  //     <Spinner fill="#000000" />
  //   </SpinContainer>
  // ) : (
  //   <Component ref={reviewListRef}>
  //     <ReviewForm />
  //     {!data.reviews.length ? (
  //       <ReviewsEmpty />
  //     ) : (
  //       <>
  //         <ReviewList reviews={data.reviews} />
  //         <ReviewPagination
  //           pagination={data.pagination}
  //           reviewListRef={reviewListRef}
  //         />
  //       </>
  //     )}
  //   </Component>
  // )
}

export default Reviews
