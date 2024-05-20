import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Form from "./form"

type Props = {
  handle: string
}

const Step3: React.FC<Props> = ({ handle }) => {
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
  return <Form shopifyCollection={shopifyCollection} handle={handle} />
}

export default Step3
