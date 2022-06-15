import React, { createContext, ReactChild, useState, useMemo } from "react"
import {
  SelectedVariants,
  ShopifyVariant,
  SavedCustomizeContexts,
} from "../types/global"

const defaultContext = {
  currentStep: 1,
  setCurrentStep: (currentStep: number) => {},
  productUrl: "/",
  setProductUrl: (productUrl: string) => {},
  selectedVariants: {
    step1: {
      image: {
        originalSrc: "",
        altText: "",
        localFile: {
          childImageSharp: {
            gatsbyImageData: {},
          },
        },
      },
      legacyResourceId: "",
      price: 0,
      product: {
        title: "",
        description: "",
        onlineStoreUrl: "",
        productType: "",
        collections: {
          handle: "",
          title: "",
        },
        vendor: "",
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
        originalSrc: "",
        altText: "",
        localFile: {
          childImageSharp: {
            gatsbyImageData: {},
          },
        },
      },
      legacyResourceId: "",
      price: 0,
      product: {
        title: "",
        description: "",
        onlineStoreUrl: "",
        productType: "",
        collections: {
          handle: "",
          title: "",
        },
        vendor: "",
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
        originalSrc: "",
        altText: "",
        localFile: {
          childImageSharp: {
            gatsbyImageData: {},
          },
        },
      },
      legacyResourceId: "",
      price: 0,
      product: {
        title: "",
        description: "",
        onlineStoreUrl: "",
        productType: "",
        collections: {
          handle: "",
          title: "",
        },
        vendor: "",
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
        originalSrc: "",
        altText: "",
        localFile: {
          childImageSharp: {
            gatsbyImageData: {},
          },
        },
      },
      legacyResourceId: "",
      price: 0,
      product: {
        title: "",
        description: "",
        onlineStoreUrl: "",
        productType: "",
        collections: {
          handle: "",
          title: "",
        },
        vendor: "",
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
    case: {
      image: {
        originalSrc: "",
        altText: "",
        localFile: {
          childImageSharp: {
            gatsbyImageData: {},
          },
        },
      },
      legacyResourceId: "",
      price: 0,
      product: {
        title: "",
        description: "",
        onlineStoreUrl: "",
        productType: "",
        collections: {
          handle: "",
          title: "",
        },
        vendor: "",
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
  setSelectedVariantsToDefault: () => {},
  hasSavedCustomized: {
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    case: false,
  },
  setHasSavedCustomized: (hasSavedCustomized: SavedCustomizeContexts) => {},
}

export const CustomizeContext = createContext(defaultContext)

export const CustomizeProvider = ({ children }: { children: ReactChild }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [productUrl, setProductUrl] = useState("/")
  const [hasSavedCustomized, setHasSavedCustomized] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    case: false,
  })
  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>({
    step1: {
      image: {
        originalSrc: "",
        altText: "",
        localFile: {
          childImageSharp: {
            gatsbyImageData: {},
          },
        },
      },
      legacyResourceId: "",
      price: 0,
      product: {
        title: "",
        description: "",
        onlineStoreUrl: "",
        productType: "",
        collections: {
          handle: "",
          title: "",
        },
        vendor: "",
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
        originalSrc: "",
        altText: "",
        localFile: {
          childImageSharp: {
            gatsbyImageData: {},
          },
        },
      },
      legacyResourceId: "",
      price: 0,
      product: {
        title: "",
        description: "",
        onlineStoreUrl: "",
        productType: "",
        collections: {
          handle: "",
          title: "",
        },
        vendor: "",
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
        originalSrc: "",
        altText: "",
        localFile: {
          childImageSharp: {
            gatsbyImageData: {},
          },
        },
      },
      legacyResourceId: "",
      price: 0,
      product: {
        title: "",
        description: "",
        onlineStoreUrl: "",
        productType: "",
        collections: {
          handle: "",
          title: "",
        },
        vendor: "",
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
        originalSrc: "",
        altText: "",
        localFile: {
          childImageSharp: {
            gatsbyImageData: {},
          },
        },
      },
      legacyResourceId: "",
      price: 0,
      product: {
        title: "",
        description: "",
        onlineStoreUrl: "",
        productType: "",
        collections: {
          handle: "",
          title: "",
        },
        vendor: "",
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
    case: {
      image: {
        originalSrc: "",
        altText: "",
        localFile: {
          childImageSharp: {
            gatsbyImageData: {},
          },
        },
      },
      legacyResourceId: "",
      price: 0,
      product: {
        title: "",
        description: "",
        onlineStoreUrl: "",
        productType: "",
        collections: {
          handle: "",
          title: "",
        },
        vendor: "",
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

  const setSelectedVariantsToDefault = () => {
    setSelectedVariants({
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
      case: {
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
  }

  const value = useMemo(
    () => ({
      currentStep,
      setCurrentStep,
      productUrl,
      setProductUrl,
      selectedVariants,
      setSelectedVariants,
      setSelectedVariantsToDefault,
      hasSavedCustomized,
      setHasSavedCustomized,
    }),
    [
      currentStep,
      setCurrentStep,
      productUrl,
      setProductUrl,
      selectedVariants,
      setSelectedVariants,
      hasSavedCustomized,
      setHasSavedCustomized,
    ]
  )

  return (
    <CustomizeContext.Provider value={value}>
      {children}
    </CustomizeContext.Provider>
  )
}
