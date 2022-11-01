import React from "react"
import Modal from "react-modal"
import styled from "styled-components"

Modal.setAppElement(`#___gatsby`)
Modal.defaultStyles.overlay.zIndex = 9999

const StyledModal = styled(Modal)`
  position: fixed;
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  transform: translate(-50%, -50%);
`

const Container = styled.div`
  z-index: 100;
  box-sizing: border-box;
  background-color: #e5e5e5;
`

const PolarizedModal = () => {
  return (
    <>
      <StyledModal>
        <Container></Container>
      </StyledModal>
    </>
  )
}

export default PolarizedModal
