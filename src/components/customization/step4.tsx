import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Form from "./form"

type Props = {
  handle: string
}

const Step4: React.FC<Props> = ({ handle }) => {
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
  return <Form shopifyCollection={shopifyCollection} handle={handle} />
}

export default Step4
