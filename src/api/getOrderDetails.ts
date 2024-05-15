import fetch from "node-fetch"
import type { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby"

export default async function getOrderDetails(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  try {
    const orderId = req.body.id
    const url: string = process.env.GATSBY_STORE_MY_SHOPIFY
      ? `https://${process.env.GATSBY_STORE_MY_SHOPIFY}/admin/api/2022-04/graphql.json`
      : ""
    const adminToken: string = process.env.GATSBY_STORE_TOKEN
      ? process.env.GATSBY_STORE_TOKEN
      : ""

    const orderQuery = `
      query getOrderDetails($orderId: ID!){
        order(id: $orderId) {
          name
          id
          note
          lineItems(first: 100) {
            edges {
              node {
                id
                name
                customAttributes {
                  key
                  value
                }
              }
            }
          }
        }
      }
    `
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({
        query: orderQuery,
        variables: {
          orderId: orderId,
        },
      }),
    })
    const responseJson = await response.json()
    if (response.ok) {
      return res.status(200).json(responseJson)
    }

    return res.status(400).json("Error while fetching from admin api")
  } catch (error) {
    console.log("Error on fetching order details", error)
  }
}
