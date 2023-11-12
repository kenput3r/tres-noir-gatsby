import React, { useEffect, useState } from "react"
import { useSpring, animated, config } from "react-spring"
import styled from "styled-components"
import { IoCreateOutline as CreateIcon } from "react-icons/io5"
import { useForm } from "react-hook-form"
import ReviewFormStarInput from "./review-form-star-input"
import ReviewFormError from "./review-form-error"
import type { YotpoCreateFormData } from "../../types/yotpo"
import { useReviews } from "../../contexts/reviews"

const Component = styled.div`
  h4 {
    margin: 0;
  }
  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    button {
      div {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      svg {
        font-size: 20px;
      }
    }
  }
  form {
    margin: unset;
    padding-top: 20px;
    .input-wrapper {
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
      @media screen and (min-width: 768px) {
        margin-bottom: 15px;
      }
    }
    .button-wrapper {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
    }
  }
  textarea {
    resize: vertical;
  }
`
const ReviewForm = () => {
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<YotpoCreateFormData>()
  register("reviewScore", { required: true })
  const onSubmit = (data: YotpoCreateFormData) => {
    createReview(data)
  }
  const starScore = watch("reviewScore")
  const setStarScore = (_score: number) => setValue("reviewScore", _score)
  const [showForm, setShowForm] = useState(false)
  const { createReview } = useReviews()
  // React Spring
  const isBrowser = typeof window !== "undefined"
  if (!isBrowser) return null
  const slideInStyles = useSpring({
    config: { ...config.default },
    from: {
      opacity: 0,
    },
    to: {
      opacity: showForm ? 1 : 0,
    },
  })
  return (
    <Component>
      <div className="title-row">
        <h4>Reviews</h4>
        <button className="btn" onClick={() => setShowForm(true)}>
          <div>
            <span>WRITE A REVIEW</span>
            <CreateIcon />
          </div>
        </button>
      </div>
      <animated.div style={{ ...slideInStyles }}>
        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input-wrapper">
              <label htmlFor="reviewScore">Score: </label>
              <ReviewFormStarInput
                rating={starScore}
                setRating={setStarScore}
                clearError={() => clearErrors("reviewScore")}
              />
              {errors.reviewScore && (
                <ReviewFormError error="Please add your review score" />
              )}
            </div>
            <div className="input-wrapper">
              <label htmlFor="reviewTitle">Title: </label>
              <input
                type="text"
                {...register("reviewTitle", { required: true })}
              />
              {errors.reviewTitle && (
                <ReviewFormError error="Please add your review title" />
              )}
            </div>
            <div>
              <div className="input-wrapper">
                <label htmlFor="reviewContent">Review: </label>
                <textarea {...register("reviewContent", { required: true })} />
                {errors.reviewContent && (
                  <ReviewFormError error="Please add your review" />
                )}
              </div>
            </div>
            <div className="input-wrapper">
              <label htmlFor="reviewerName">Name: </label>
              <input
                type="text"
                {...register("reviewerName", { required: true })}
              />
              {errors.reviewerName && (
                <ReviewFormError error="Please add your name" />
              )}
            </div>
            <div className="input-wrapper">
              <label htmlFor="reviewerEmail">Email: </label>
              <input
                type="email"
                {...register("reviewerEmail", { required: true })}
              />
              {errors.reviewerEmail && (
                <ReviewFormError error="Please add your email" />
              )}
            </div>
            <div className="button-wrapper">
              <button className="btn">SUBMIT</button>
              <button className="btn" onClick={() => setShowForm(false)}>
                CLOSE
              </button>
            </div>
          </form>
        )}
      </animated.div>
    </Component>
  )
}

export default ReviewForm
