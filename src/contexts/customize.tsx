import React, { createContext, ReactChild, useState } from "react"
import { SelectedVariants, ShopifyVariant } from "../types/global"

const defaultContext = {
  currentStep: 1,
  setCurrentStep: (currentStep: number) => {},
  productUrl: "/",
  setProductUrl: (productUrl: string) => {},
  selectedVariants: {
    step1: {
      image: {
        altText: "",
        localFile: {
          childImageSharp: {
            gatsbyImageData: {},
          },
        },
      },
      price: 0,
      product: {
        title: "",
        description: "",
      },
      selectedOptions: [
        {
          name: "",
          value: "",
        },
      ],
      storefrontId: "",
      sku: "",
      title: "",
    },
    step2: {
      image: {
        altText: "",
        localFile: {
          childImageSharp: {
            gatsbyImageData: {},
          },
        },
      },
      price: 0,
      product: {
        title: "",
        description: "",
      },
      selectedOptions: [
        {
          name: "",
          value: "",
        },
      ],
      storefrontId: "",
      sku: "",
      title: "",
    },
    step3: {
      image: {
        altText: "",
        localFile: {
          childImageSharp: {
            gatsbyImageData: {},
          },
        },
      },
      price: 0,
      product: {
        title: "",
        description: "",
      },
      selectedOptions: [
        {
          name: "",
          value: "",
        },
      ],
      storefrontId: "",
      sku: "",
      title: "",
    },
    step4: {
      image: {
        altText: "",
        localFile: {
          childImageSharp: {
            gatsbyImageData: {},
          },
        },
      },
      price: 0,
      product: {
        title: "",
        description: "",
      },
      selectedOptions: [
        {
          name: "",
          value: "",
        },
      ],
      storefrontId: "",
      sku: "",
      title: "",
    },
  },
  setSelectedVariants: (selectedVariants: SelectedVariants) => {},
}

export const CustomizeContext = createContext(defaultContext)

export const CustomizeProvider = ({ children }: { children: ReactChild }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [productUrl, setProductUrl] = useState("/")
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>({
    step1: {
      image: {
        altText: "",
        localFile: {
          childImageSharp: {
            gatsbyImageData: {},
          },
        },
      },
      price: 0,
      product: {
        title: "",
        description: "",
      },
      selectedOptions: [
        {
          name: "",
          value: "",
        },
      ],
      storefrontId: "",
      sku: "",
      title: "",
    },
    step2: {
      image: {
        altText: "",
        localFile: {
          childImageSharp: {
            gatsbyImageData: {},
          },
        },
      },
      price: 0,
      product: {
        title: "",
        description: "",
      },
      selectedOptions: [
        {
          name: "",
          value: "",
        },
      ],
      storefrontId: "",
      sku: "",
      title: "",
    },
    step3: {
      image: {
        altText: "",
        localFile: {
          childImageSharp: {
            gatsbyImageData: {},
          },
        },
      },
      price: 0,
      product: {
        title: "",
        description: "",
      },
      selectedOptions: [
        {
          name: "",
          value: "",
        },
      ],
      storefrontId: "",
      sku: "",
      title: "",
    },
    step4: {
      image: {
        altText: "",
        localFile: {
          childImageSharp: {
            gatsbyImageData: {},
          },
        },
      },
      price: 0,
      product: {
        title: "",
        description: "",
      },
      selectedOptions: [
        {
          name: "",
          value: "",
        },
      ],
      storefrontId: "",
      sku: "",
      title: "",
    },
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
