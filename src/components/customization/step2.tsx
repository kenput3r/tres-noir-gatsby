import React, { useContext, useEffect, useState } from "react"
import { CustomizeContext } from "../../contexts/customize"
import { useStaticQuery, graphql } from "gatsby"
import Form from "./form"

type Props = {
  handle: string
}

const Step2: React.FC<Props> = ({ handle }) => {
  const { selectedVariants } = useContext(CustomizeContext)
  const { shopifyCollection } = useStaticQuery(graphql`
    query Step2Query {
      shopifyCollection(handle: { eq: "lens-type" }) {
        title
        products {
          ...shopifyProductsFields
        }
      }
    }
  `)

  const nonPrescriptionPolarizedLenses = shopifyCollection.products.find(
    product => product.handle === "non-prescription-polarized-lenses"
  )

  const initialFilteredCollection = {
    ...shopifyCollection,
    products: shopifyCollection.products.filter(
      product => product.handle !== "non-prescription-polarized-lenses"
    ),
  }

  const [filteredCollection, setFilteredCollection] = useState(
    initialFilteredCollection
  )

  useEffect(() => {
    if (selectedVariants.step1.product.title === "Non-Prescription Lens") {
      const updatedProducts = initialFilteredCollection.products.map(product =>
        product.title === "Polarized" || product.handle === "polarized-1"
          ? nonPrescriptionPolarizedLenses
          : product
      )

      setFilteredCollection({
        ...initialFilteredCollection,
        products: updatedProducts,
      })
    }
  }, [selectedVariants])

  return <Form shopifyCollection={filteredCollection} handle={handle} />
}

export default Step2
