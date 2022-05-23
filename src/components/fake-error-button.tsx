import React, { useContext } from "react"
import { ErrorModalContext } from "../contexts/error"
import { navigate } from "gatsby"

const FakeErrorButton: React.FC = () => {
  const { renderErrorModal } = useContext(ErrorModalContext)
  return (
    <>
      <button
        type="button"
        onClick={() =>
          renderErrorModal(
            "There's been a problem, please try again later.",
            () => navigate("/collections/glasses-for-men")
          )
        }
      >
        Trigger Error With Callback | Navigate To
      </button>
      <button type="button" onClick={() => renderErrorModal()}>
        Trigger Error
      </button>
    </>
  )
}

export default FakeErrorButton
