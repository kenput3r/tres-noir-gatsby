import React, { useEffect } from "react"
import styled from "styled-components"
import { AiOutlineQuestionCircle } from "react-icons/ai"
import PolarizedModal from "./polarized-modal"

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
  useEffect(() => {}, [showPolarizedModal])
  return (
    <>
      <PolarizedModal
        showPolarizedModal={showPolarizedModal}
        setShowPolarizedModal={setShowPolarizedModal}
      />
      <Component>
        <AiOutlineQuestionCircle
          onClick={evt => setShowPolarizedModal(!showPolarizedModal)}
        />
      </Component>
    </>
  )
}

export default PolarizedTooltip
