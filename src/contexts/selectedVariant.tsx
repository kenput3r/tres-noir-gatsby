import React, { createContext, ReactChild, useState, useMemo } from "react"

const defaultContext = {
  selectedVariantContext: "",
  setSelectedVariantContext: (variant: string) => {},
}

export const SelectedVariantContext = createContext(defaultContext)

export const SelectedVariantProvider = ({
  children,
}: {
  children: ReactChild
}) => {
  const [selectedVariantContext, setSelectedVariantContext] = useState("")

  const value = useMemo(
    () => ({
      selectedVariantContext,
      setSelectedVariantContext,
    }),
    [selectedVariantContext]
  )

  return (
    <SelectedVariantContext.Provider value={value}>
      {children}
    </SelectedVariantContext.Provider>
  )
}
