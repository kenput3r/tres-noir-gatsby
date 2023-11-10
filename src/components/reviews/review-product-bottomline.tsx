import React from "react"
import styled from "styled-components"
import useReviews from "../../contexts/reviews/hooks"

const Component = styled.div``

const ReviewProductBottomline = () => {
  const { data, isLoading } = useReviews()
  return <Component></Component>
}

export default ReviewProductBottomline
