import React, { useContext, useEffect, useState, useMemo } from "react"
import { CustomizeContext } from "../../contexts/customize"
import { useStaticQuery, graphql } from "gatsby"
import Form from "./form"
import useCollectionDiscountedPricing from "../../hooks/useCollectionDiscountedPricing"

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

  const prices = useMemo(
    () =>
      shopifyCollection.products.map(p => ({
        id: p.variants[0].legacyResourceId,
        price: p.variants[0].price,
        handle: p.handle,
      })),
    [shopifyCollection]
  )

  const { offer, isApplicable, discountedPrices } =
    useCollectionDiscountedPricing({ prices, handle })

  const initialFilteredCollection = useMemo(
    () => ({
      ...shopifyCollection,
      products: shopifyCollection.products.filter(
        product =>
          product.handle !== "non-prescription-polarized-lenses" &&
          product.handle !== "transitions-for-progressive"
      ),
    }),
    [shopifyCollection]
  )

  const [currentCollection, setCurrentCollection] = useState(
    initialFilteredCollection
  )

  const [nonPrescriptionPolarizedLenses, setNonPrescriptionPolarizedLenses] =
    useState(
      shopifyCollection.products.find(
        product => product.handle === "non-prescription-polarized-lenses"
      )
    )

  const [transitionsForProgressiveLenses, setTransitionsForProgressiveLenses] =
    useState(
      shopifyCollection.products.find(
        product => product.handle === "transitions-for-progressive"
      )
    )

  const [filteredCollection, setFilteredCollection] =
    useState(currentCollection)

  useEffect(() => {
    if (isApplicable && discountedPrices) {
      const tempCollection = JSON.parse(
        JSON.stringify(initialFilteredCollection)
      )

      const patchedCollection = tempCollection.products.map(p => {
        const patchedVariants = p.variants.map(v => {
          const patchedPrice = discountedPrices.find(
            el => el.id === v.legacyResourceId
          )
          if (patchedPrice) {
            v.compareAtPrice = v.price
            v.price = patchedPrice.discountedPrice
          }
          return v
        })
        p.variants = patchedVariants
        return p
      })
      // patch non-prescription polarized lenses
      const patchedNonPrescriptionPolarizedLenses = {
        ...nonPrescriptionPolarizedLenses,
        variants: nonPrescriptionPolarizedLenses.variants.map(v => {
          const patchedPrice = discountedPrices.find(
            el => el.id === v.legacyResourceId
          )
          if (patchedPrice) {
            v.compareAtPrice = v.price
            v.price = patchedPrice.discountedPrice
          }
          return v
        }),
      }
      setNonPrescriptionPolarizedLenses(patchedNonPrescriptionPolarizedLenses)
      // patch transitions for progressive lenses
      const patchedTransitionsForProgressiveLenses = {
        ...transitionsForProgressiveLenses,
        variants: transitionsForProgressiveLenses.variants.map(v => {
          const patchedPrice = discountedPrices.find(
            el => el.id === v.legacyResourceId
          )
          if (patchedPrice) {
            v.compareAtPrice = v.price
            v.price = patchedPrice.discountedPrice
          }
          return v
        }),
      }
      setTransitionsForProgressiveLenses(patchedTransitionsForProgressiveLenses)

      if (selectedVariants.step1.product.title === "Non-Prescription Lens") {
        const updatedProducts = patchedCollection.map(product =>
          product.title === "Polarized" || product.handle === "polarized-1"
            ? patchedNonPrescriptionPolarizedLenses
            : product
        )
        setCurrentCollection({
          ...initialFilteredCollection,
          products: updatedProducts,
        })
        setFilteredCollection({
          ...initialFilteredCollection,
          products: updatedProducts,
        })
      } else if (selectedVariants.step1.product.title === "Progressive") {
        const updatedProducts = patchedCollection.map(product =>
          product.title === "Transitions" || product.handle === "transitions-1"
            ? patchedTransitionsForProgressiveLenses
            : product
        )
        setCurrentCollection({
          ...initialFilteredCollection,
          products: updatedProducts,
        })
        setFilteredCollection({
          ...initialFilteredCollection,
          products: updatedProducts,
        })
      }
    }
  }, [shopifyCollection, offer, isApplicable, discountedPrices])

  useEffect(() => {
    if (selectedVariants.step1.product.title === "Non-Prescription Lens") {
      const updatedProducts = currentCollection.products.map(product =>
        product.title === "Polarized" || product.handle === "polarized-1"
          ? nonPrescriptionPolarizedLenses
          : product
      )
      setFilteredCollection({
        ...initialFilteredCollection,
        products: updatedProducts,
      })
    } else if (selectedVariants.step1.product.title === "Progressive") {
      const updatedProducts = currentCollection.products.map(product =>
        product.title === "Transitions" || product.handle === "transitions-1"
          ? transitionsForProgressiveLenses
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
