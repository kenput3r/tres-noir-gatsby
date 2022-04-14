import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Form from "./form"

const Step3 = () => {
  const { shopifyCollection } = useStaticQuery(graphql`
    query Step3Query {
      shopifyCollection(handle: { eq: "lens-material" }) {
        title
        products {
          ...shopifyProductsFields
        }
      }
    }
  `)
  return <Form shopifyCollection={shopifyCollection} />
}

export default Step3
