import React, { useEffect, useState } from "react"
import styled from "styled-components"
import Layout from "../../components/layout"
import SEO from "../../components/seo"
import { useOrderDetails } from "../../hooks/useOrderDetails"
import PrescriptionTable from "../../components/prescription-table"
import Loader from "../../components/loader"

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
  let showContent = false
  let orderDetails
  let globalOrderId
  if (isBrowser) {
    const params = new URLSearchParams(location.search)
    const orderId = params.get("id")
    if (orderId) {
      // setShowContent(true)
      showContent = true
      globalOrderId = orderId
      const fetchedDetails = useOrderDetails(`gid://shopify/Order/${orderId}`)
      orderDetails = fetchedDetails
    }
  }
  return (
    <Layout>
      <Page>
        <SEO title="Prescription Confirmation" />
        {showContent ? (
          <div className="wrapper">
            <h1>Thank you</h1>
            <p className="page-desc">
              Thank you for your purchase! Please confirm your prescription.
              Once you confirm your prescription, your purchase cannot be
              refunded.
            </p>
            <div>
              {orderDetails &&
                orderDetails.prescriptions &&
                orderDetails.prescriptions.length > 0 &&
                orderDetails.prescriptions.map((el, index) => (
                  <PrescriptionTable
                    index={index + 1}
                    lineItem={el}
                    key={`pt-${index}`}
                    orderId={globalOrderId}
                    orderDetails={orderDetails}
                  />
                ))}
            </div>
          </div>
        ) : (
          <>
            <Loader />
          </>
        )}
      </Page>
    </Layout>
  )
}

export default ConfirmPrescription
