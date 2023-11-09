import React from "react"
import styled from "styled-components"

const ReviewsEmpty = () => {
  const Component = styled.div`
    margin-bottom: 30px;
  `
  return (
    <Component>
      <span>Be the first to write a review!</span>
    </Component>
  )
}

export default ReviewsEmpty
