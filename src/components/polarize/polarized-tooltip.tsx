import React from "react"
import styled from "styled-components"
import { AiOutlineQuestionCircle } from "react-icons/ai"

const Component = styled.div`
  cursor: pointer;
  svg {
    fill: #b2b2b2;
  }
`

const showModal = () => {
  console.log("show")
}

const PolarizedTooltip = () => {
  return (
    <>
      <Component>
        <AiOutlineQuestionCircle onClick={showModal} />
      </Component>
    </>
  )
}

export default PolarizedTooltip
