import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Form from "./form"

const Step2 = () => {
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
  console.log(shopifyCollection)
  return <Form shopifyCollection={shopifyCollection} />
}

export default Step2
