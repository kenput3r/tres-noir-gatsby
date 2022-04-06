import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { navigate } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { CustomerContext } from "../contexts/customer"

const Page = styled.div`
  max-width: 95%;
  margin: auto;
  .content {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: 1fr 1fr;
  }
  .customer-detail {
    p {
      margin: 0;
    }
    .address {
      margin: 1.75rem 0;
    }
  }
`

const Account = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any>(false)
  const [error, setError] = useState<boolean>(false)
  const { customerAccessToken } = useContext(CustomerContext)
  const isBrowser = typeof window !== "undefined"
  if (!customerAccessToken && isBrowser) {
    navigate("/login")
  }

  useEffect(() => {
    const getCustomer = async () => {
      const query = `
      query customer($customerAccessToken: String!) {
        customer(customerAccessToken: $customerAccessToken) {
          id
          email
          firstName
          lastName
          defaultAddress {
            address1
            address2
            city
            province
            country
            zip
            phone
          }
          orders(first: 10) {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    `
      try {
        const response = await fetch(
          `https://tres-noir.myshopify.com/api/2022-01/graphql.json`,
          {
            method: "POST",
            headers: {
              "X-Shopify-Storefront-Access-Token": process.env
                .GATSBY_STORE_STOREFRONT_TOKEN as string,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query,
              variables: {
                customerAccessToken,
              },
            }),
          }
        )
        console.log("RESPONSE", response)
        const json = await response.json()
        console.log("json", json)
        if (json.data) {
          console.log("SETTING JSON DATA && LOADING TO FALSE")
          setData(json.data)
          setLoading(false)
        }
      } catch (e) {
        console.log("ERROR", error)
        setLoading(false)
        setError(true)
      }
    }
    getCustomer()
  }, [])

  const renderContent = () => {
    if (loading) {
      return <p>LOADING ... Getting Customer Data</p>
    } else if (error) {
      return <p>ERROR ... please try again later...</p>
    } else if (customerAccessToken && data) {
      const address = data.customer.defaultAddress
      const { orders } = data.customer
      return (
        <div className="content">
          <div className="customer-detail">
            <h5 className="name">
              {data.customer.firstName} {data.customer.lastName}
            </h5>
            <p className="email note">{data.customer.email}</p>
            <div className="address note">
              <p>{address.address1}</p>
              {address.address2 && <p>{address.address2}</p>}
              <p>
                {address.city}, {address.country}
              </p>
              <p>{address.zip}</p>
              <p>{address.phone}</p>
            </div>
          </div>
          <div className="orders">
            {orders.edges.length > 0 ? (
              orders.edges.map((order: any) => (
                <p key={order.id} className="order">
                  {order.id}
                  <br />
                  {order.name}
                </p>
              ))
            ) : (
              <p>You haven't placed any orders yet.</p>
            )}
          </div>
        </div>
      )
    }
  }

  return (
    <Layout>
      <SEO title="Account" />
      <Page>
        <h1>Account</h1>
        {renderContent()}
      </Page>
    </Layout>
  )
}

export default Account
