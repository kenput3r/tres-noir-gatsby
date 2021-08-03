import React, { useContext } from "react"
import styled from "styled-components"
import { useQuery, gql } from "@apollo/client"
import { navigate } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { CustomerContext } from "../contexts/customer"

const Account = () => {
  const { customerAccessToken } = useContext(CustomerContext)
  if (!customerAccessToken) {
    navigate("/login")
  }
  const { loading, error, data } = useQuery(GET_CUSTOMER, {
    variables: {
      customerAccessToken: `${customerAccessToken}`,
    },
    skip: customerAccessToken ? false : true,
  })

  const renderContent = () => {
    if (loading) {
      return <p>LOADING ... Getting Customer Data</p>
    } else if (error) {
      return <p>ERROR ... please try again later...</p>
    } else if (customerAccessToken && data) {
      const address = data.customer.defaultAddress
      const orders = data.customer.orders
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
    } else {
      navigate("/login")
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

const GET_CUSTOMER = gql`
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
