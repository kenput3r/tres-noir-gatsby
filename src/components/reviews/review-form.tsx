import React, { useState } from "react"
import styled from "styled-components"

const Component = styled.div`
  .form {
    margin: unset;
    padding-top: 20px;
    .input-wrapper {
      display: flex;
      flex-direction: column;
    }
    .button-wrapper {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
    }
  }
`
const ReviewForm = () => {
  const [showForm, setShowForm] = useState(false)
  return (
    <Component>
      <div>
        <h4>Reviews</h4>
        <button className="btn" onClick={() => setShowForm(true)}>
          WRITE A REVIEW
        </button>
      </div>
      {showForm && (
        <div className="form">
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
        </div>
      )}
    </Component>
  )
}

export default ReviewForm
