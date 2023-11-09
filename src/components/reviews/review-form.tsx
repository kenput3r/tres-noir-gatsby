import React, { useState } from "react"
import { useSpring, animated, config } from "react-spring"
import styled from "styled-components"
import { IoCreateOutline as CreateIcon } from "react-icons/io5"

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
        font-size: 18px;
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
  const [showForm, setShowForm] = useState(false)
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
          <form onSubmit={evt => evt.preventDefault()}>
            <div className="input-wrapper">
              <label htmlFor="yotpo-input-title">Title: </label>
              <input type="text" name="yotpo-input-title" />
            </div>
            <div>
              <div className="input-wrapper">
                <label htmlFor="yotpo-input-review">Review: </label>
                <textarea name="yotpo-input-review" />
              </div>
            </div>
            <div className="input-wrapper">
              <label htmlFor="yotpo-input-name">Name: </label>
              <input type="text" name="yotpo-input-name" />
            </div>
            <div className="input-wrapper">
              <label htmlFor="yotpo-input-email">Email: </label>
              <input type="text" name="yotpo-input-email" />
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
