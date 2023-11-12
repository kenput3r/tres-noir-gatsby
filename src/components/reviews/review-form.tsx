import React, { useEffect, useState } from "react"
import { useSpring, animated, config, useTransition } from "react-spring"
import styled from "styled-components"
import { IoCreateOutline as CreateIcon } from "react-icons/io5"
import { useForm, SubmitHandler } from "react-hook-form"
import { ReviewFormStarInput } from "./review-form-star-input"
import { siteMetadata } from "../../../gatsby-config"

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
type Inputs = {
  reviewTitle: string
  reviewContent: string
  reviewerName: string
  reviewerEmail: string
  reviewScore: number
}
const ReviewForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm<Inputs>()
  register("reviewScore", { required: true })
  const starRating = watch("reviewScore")
  const setRating = (input: number) => setValue("reviewScore", input)
  const submitForm: SubmitHandler<Inputs> = data => {
    console.log(data)
    const payload = {
      productUrl: `${siteMetadata.siteUrl}/products/`,
    }
  }
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (starRating) {
      clearErrors("reviewScore")
    }
  }, [starRating])

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
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="input-wrapper">
              <label htmlFor="reviewScore">Score: </label>
              {/* <input type="text" name="yotpo-input-score" /> */}
              <ReviewFormStarInput
                setRating={setRating}
                rating={starRating}
                hasError={errors.reviewScore ? true : false}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="reviewTitle">Title: </label>
              <input
                type="text"
                {...register("reviewTitle", { required: true })}
              />
              {errors.reviewTitle && (
                <div>
                  <span>Please add a title.</span>
                </div>
              )}
            </div>
            <div>
              <div className="input-wrapper">
                <label htmlFor="reviewContent">Review: </label>
                <textarea {...register("reviewContent", { required: true })} />
              </div>
            </div>
            <div className="input-wrapper">
              <label htmlFor="reviewerName">Name: </label>
              <input
                type="text"
                {...register("reviewerName", { required: true })}
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="reviewerEmail">Email: </label>
              <input
                type="email"
                {...register("reviewerEmail", { required: true })}
              />
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
