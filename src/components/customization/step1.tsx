import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Form from "./form"

type Props = {
  handle: string
}
const Step1: React.FC<Props> = ({ handle }) => {
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
  return <Form shopifyCollection={shopifyCollection} handle={handle} />
}

export default Step1
