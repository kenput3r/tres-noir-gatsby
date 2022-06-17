import React, {
  createContext,
  ReactChild,
  useState,
  useMemo,
  useEffect,
} from "react"
import {
  SelectedVariants,
  ShopifyVariant,
  SavedCustomizeContexts,
  SelectedVariantStorage,
} from "../types/global"

const defaultSelectedVariants = {
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
    price: "0.00",
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
    price: "0.00",
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
    price: "0.00",
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
  step4: [
    {
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
      price: "0.00",
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
  ],
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
    price: "0.00",
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
}

const defaultContext = {
  currentStep: 1,
  setCurrentStep: (currentStep: number) => {},
  productUrl: "/",
  setProductUrl: (productUrl: string) => {},
  selectedVariants: defaultSelectedVariants,
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

  const [selectedVariants, setSelectedVariants] = useState<SelectedVariants>(
    defaultSelectedVariants
  )

  const setSelectedVariantsToDefault = () => {
    setSelectedVariants(defaultSelectedVariants)
  }

  useEffect(() => {
    const isBrowser: boolean = typeof window !== "undefined"
    if (isBrowser) {
      const urlParams = new URLSearchParams(window.location.search)
      const custom_id = urlParams.get("custom_id")
      const customsResume = localStorage.getItem("customs-resume")
      if (customsResume && custom_id) {
        const customsStorage = JSON.parse(
          customsResume
        ) as SelectedVariantStorage
        const parsedCustoms = customsStorage.value.customs
        const resumedSelectedVariants =
          parsedCustoms[Number(custom_id)].selectedVariants
        const handle = parsedCustoms[Number(custom_id)].handle
        const sku = parsedCustoms[Number(custom_id)].sku
        // prepare context for editing
        // setting context
        setSelectedVariants(resumedSelectedVariants)
        // setting savedCustomized context so radio won't default to top option
        setHasSavedCustomized({
          step1: true,
          step2: true,
          step3: true,
          step4: true,
          case: true,
        })
        setCurrentStep(5)
      }
    }
  }, [])

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
