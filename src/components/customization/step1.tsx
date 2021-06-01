import React, { useContext } from "react"
import { useStaticQuery, graphql } from "gatsby"
import Form from "./form"

const Step1 = () => {
  const { shopifyCollection } = useStaticQuery(graphql`
    query Step1Query {
      shopifyCollection(handle: { eq: "rx-type" }) {
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

export default Step1
