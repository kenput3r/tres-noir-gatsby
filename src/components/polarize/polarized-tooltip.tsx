import React, { useEffect } from "react"
import styled from "styled-components"
import { AiOutlineQuestionCircle } from "react-icons/ai"

const Component = styled.div`
  cursor: pointer;
  svg {
    fill: #b2b2b2;
  }
`

const PolarizedTooltip = ({
  showPolarizedModal,
  setShowPolarizedModal,
}: {
  showPolarizedModal: boolean
  setShowPolarizedModal: (value: boolean) => void
}) => {
  useEffect(() => {
    console.log("showPolarizedModal state is now", showPolarizedModal)
  }, [showPolarizedModal])
  return (
    <>
      <Component>
        <AiOutlineQuestionCircle
          onClick={evt => setShowPolarizedModal(!showPolarizedModal)}
        />
      </Component>
    </>
  )
}

export default PolarizedTooltip
