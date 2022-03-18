import React, { createContext, ReactChild, useState, useMemo } from "react"

const defaultContext = {
  isRxAble: false,
  setRxAble: (isRxAble: boolean) => {},
}

export const RxInfoContext = createContext(defaultContext)

export const RxInfoContextProvider = ({
  children,
}: {
  children: ReactChild
}) => {
  const [isRxAble, setRxAble] = useState(false)

  const value = useMemo(
    () => ({
      isRxAble,
      setRxAble,
    }),
    [isRxAble]
  )

  return (
    <RxInfoContext.Provider value={value}>{children}</RxInfoContext.Provider>
  )
}
