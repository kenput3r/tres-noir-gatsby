import React, { createContext, ReactChild, useState } from "react"
import { SelectedVariants, ShopifyVariant } from "../types/global"

const defaultContext = {
  currentStep: 1,
  setCurrentStep: (currentStep: number) => {},
  productUrl: "/",
  setProductUrl: (productUrl: string) => {},
  selectedVariants: {
    step1: { priceNumber: 0, product: null },
    step2: { priceNumber: 0, product: null },
    step3: { priceNumber: 0, product: null },
    step4: { priceNumber: 0, product: null },
  },
  setSelectedVariants: (selectedVariants: SelectedVariants) => {},
}

export const CustomizeContext = createContext(defaultContext)

export const CustomizeProvider = ({ children }: { children: ReactChild }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [productUrl, setProductUrl] = useState("/")
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>({
    step1: { priceNumber: 0, product: null },
    step2: { priceNumber: 0, product: null },
    step3: { priceNumber: 0, product: null },
    step4: { priceNumber: 0, product: null },
  })

  return (
    <CustomizeContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        productUrl,
        setProductUrl,
        selectedVariants,
        setSelectedVariants,
      }}
    >
      {children}
    </CustomizeContext.Provider>
  )
}
