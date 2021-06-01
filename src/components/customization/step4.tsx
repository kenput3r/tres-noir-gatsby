import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Form from "./form"

const Step4 = () => {
  const { shopifyCollection } = useStaticQuery(graphql`
    query Step4Query {
      shopifyCollection(handle: { eq: "lens-coating" }) {
        title
        products {
          ...shopifyProductsFields
        }
      }
    }
  `)
  return <Form shopifyCollection={shopifyCollection} />
}

export default Step4
