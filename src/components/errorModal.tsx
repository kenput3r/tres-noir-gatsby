import React, { useContext } from "react"
import Modal from "react-modal"
import styled from "styled-components"
import { RiErrorWarningFill } from "react-icons/ri"
import { IoMdClose } from "react-icons/io"

import { ErrorModalContext } from "../contexts/error"

Modal.setAppElement(`#___gatsby`)

const StyledModal = styled(Modal)`
  position: fixed;
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  transform: translate(-50%, -50%);
`

const Container = styled.div`
  box-sizing: border-box;
  background-color: #ff0000;
  color: #fff;
  width: 600px;
  max-width: 100%;
  padding: 3rem 2rem;
  border-radius: 0.5rem;
  position: relative;
  .close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    left: auto;
    bottom: auto;
    font-size: 2rem;
    cursor: pointer;
  }
  .content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 1rem;
    svg {
      height: 4rem;
      width: auto;
    }
    .error-title {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }
    .error-message {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
  }
`

Container.displayName = "Container"

const ErrorModal = () => {
  const { errorModalIsOpen, closeErrorModal, afterOpenErrorModal, errorMsg } =
    useContext(ErrorModalContext)

  return (
    <StyledModal
      isOpen={errorModalIsOpen}
      onAfterOpen={afterOpenErrorModal}
      onRequestClose={closeErrorModal}
      contentLabel="Error"
    >
      <Container>
        <IoMdClose className="close" onClick={closeErrorModal} />
        <div className="content">
          <div className="icon">
            <RiErrorWarningFill className="icon-error" />
          </div>
          <div className="error-content">
            <p className="error-title">Error</p>
            <p className="error-message">{errorMsg}</p>
          </div>
        </div>
      </Container>
    </StyledModal>
  )
}

export default ErrorModal
