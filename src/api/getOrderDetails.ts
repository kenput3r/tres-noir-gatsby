import fetch from "node-fetch"
export default async function uploadPrescription(req, res) {
  try {
    const orderId = req.body.id
    console.log("orderId payload", orderId)
    const url: string = process.env.GATSBY_STORE_MY_SHOPIFY
      ? `https://${process.env.GATSBY_STORE_MY_SHOPIFY}/admin/api/2022-04/graphql.json`
      : ""
    console.log("url", url)
    const adminToken: string = process.env.GATSBY_STORE_TOKEN
      ? process.env.GATSBY_STORE_TOKEN
      : ""

    const orderQuery = `
      query getOrderDetails($orderId: ID!){
        order(id: $orderId) {
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
    console.log("backend raw response", response)
    const responseJson = await response.json()
    console.log("backend json response", responseJson)
    if (response.ok) {
      return res.status(200).json(responseJson)
    }

    return res.status(400).json("Error while accessing shopify admin")
  } catch (error) {
    console.log("Error on fetching order details", error)
  }
}
