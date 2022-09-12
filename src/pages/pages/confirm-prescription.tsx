import React, { useEffect, useState } from "react"
import styled from "styled-components"
import Layout from "../../components/layout"
import SEO from "../../components/seo"
import { useOrderDetails } from "../../hooks/useOrderDetails"
import PrescriptionTable from "../../components/prescription-table"

const Page = styled.div`
  h1 {
    text-align: center;
    text-transform: uppercase;
    font-weight: normal;
  }
  .page-desc {
    width: 100%;
    max-width: 550px;
    margin: 0 auto;
    text-align: center;
    font-family: var(--sub-heading-font);
    color: var(--color-grey-dark);
  }
`

const ConfirmPrescription = () => {
  // get URL PARAMS and call hook
  // useEffect(() => {
  const isBrowser = typeof window !== "undefined"
  let odCopy = []
  if (isBrowser) {
    const params = new URLSearchParams(location.search)
    const orderId = params.get("id")
    console.log("order id is", orderId)
    const od = useOrderDetails(`gid://shopify/Order/${orderId}`)
    odCopy = od
    console.log("od", od)
  }
  return (
    <Layout>
      <Page>
        <div className="wrapper">
          <h1>Thank you</h1>
          <p className="page-desc">
            Thank you for your purchase! Please confirm your prescription. Once
            you confirm your prescription, your purchase cannot be refunded.
          </p>
          <div>
            {odCopy.length > 0 &&
              odCopy.map(el => <PrescriptionTable order={el} />)}
          </div>
        </div>
      </Page>
    </Layout>
  )
}

const NoURLParam = () => {
  return <p>NoUrlParam</p>
}

export default ConfirmPrescription
