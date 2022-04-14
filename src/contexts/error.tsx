import React, { createContext, ReactChild, useState, useMemo } from "react"

interface DefaultContext {
  errorModalIsOpen: boolean
  renderErrorModal: (error?: string) => void
  closeErrorModal: () => void
  afterOpenErrorModal: (cb: any) => void
  errorMsg: string
}

const defaultContext: DefaultContext = {
  errorModalIsOpen: false,
  renderErrorModal: error => {},
  closeErrorModal: () => {},
  afterOpenErrorModal: cb => cb,
  errorMsg: "",
}

export const ErrorModalContext = createContext(defaultContext)

export const ErrorModalProvider = ({ children }: { children: ReactChild }) => {
  const [errorModalIsOpen, setErrorModalIsOpen] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string>("")

  const renderErrorModal = (error?: string) => {
    if (error === undefined)
      error = "There's been a problem, please try again later."
    setErrorMsg(error)
    setErrorModalIsOpen(true)
    afterOpenErrorModal(console.log("Modal is Open"))
  }

  const closeErrorModal = () => setErrorModalIsOpen(false)

  const afterOpenErrorModal = (cb: any) => cb

  const value = useMemo(
    () => ({
      errorModalIsOpen,
      renderErrorModal,
      closeErrorModal,
      afterOpenErrorModal,
      errorMsg,
    }),
    [errorModalIsOpen, errorMsg]
  )

  return (
    <ErrorModalContext.Provider value={value}>
      {children}
    </ErrorModalContext.Provider>
  )
}
