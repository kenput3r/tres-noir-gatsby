import React, { createContext, ReactChild, useState } from "react"

const defaultContext = {
  selectedVariantContext: "",
  setSelectedVariantContext: (variant: any) => {},
}

export const SelectedVariantContext = createContext(defaultContext)

export const SelectedVariantProvider = ({
  children,
}: {
  children: ReactChild
}) => {
  const [selectedVariantContext, setSelectedVariantContext] = useState("")

  return (
    <SelectedVariantContext.Provider
      value={{ selectedVariantContext, setSelectedVariantContext }}
    >
      {children}
    </SelectedVariantContext.Provider>
  )
}
