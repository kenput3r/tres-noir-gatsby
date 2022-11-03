import React from "react"
import Modal from "react-modal"
import styled from "styled-components"
import PolarizedSlider from "./polarized-slider"

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
  background-color: #d9d9d9;
  color: #000;
  width: 750px;
  max-width: 100%;
  padding: 2rem 1rem;
  position: relative;
  @media only screen and (max-width: 1024px) {
    width: 768px;
    padding: 2rem 4rem;
  }
  @media only screen and (max-width: 768px) {
    width: 500px;
  }
  @media only screen and (max-width: 468px) {
    width: 100%;
  }
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h3 {
      font-size: 51px;
      margin-top: 2rem;
      text-transform: uppercase;
    }
    .error-message {
      font-size: 26px;
      text-transform: uppercase;
      text-align: center;
    }
    .btn {
      font-size: 32px;
      padding: 15px 30px;
    }
  }
  .error-icon {
    transform: translateX(15%);
  }
`

const PolarizedModal = ({
  showPolarizedModal,
  setShowPolarizedModal,
}: {
  showPolarizedModal: boolean
  setShowPolarizedModal: (value: boolean) => void
}) => {
  return (
    <>
      <StyledModal isOpen={showPolarizedModal}>
        <Container>
          <p>Polarized Lenses</p>
          <p>
            Polarized lenses reduce flare across surfaces deflecting the sun's
            rays. They can help reduce eyestrain, especially for those who spend
            a lot f time outdoors, around water, or in snow.
          </p>
          <PolarizedSlider />
        </Container>
      </StyledModal>
    </>
  )
}

export default PolarizedModal
