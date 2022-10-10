import fetch from "node-fetch"
export default async function updateReminderMetafield(req, res) {
  try {
    const parsedBody = JSON.parse(req.body)
    const orderId = parsedBody.id
    const metafieldId = "gid://shopify/Metafield/23035194867942"
    const orderInput = {
      metafields: {
        id: metafieldId,
        value: "true",
      },
      id: `gid://shopify/Order/${orderId}`,
    }
    const url: string = process.env.GATSBY_STORE_MY_SHOPIFY
      ? `https://${process.env.GATSBY_STORE_MY_SHOPIFY}/admin/api/2022-04/graphql.json`
      : ""
    const adminToken: string = process.env.GATSBY_STORE_TOKEN
      ? process.env.GATSBY_STORE_TOKEN
      : ""

    const orderQuery = `
      mutation updateOrderMetafield($input: OrderInput!){
        orderUpdate(input: $input) {
          order {
            id
            metafield(namespace:"tresnoir", key: "has_received_prescription_reminder") {
              value
              id
            }
          }
          userErrors {
            field
            message
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
          input: orderInput,
        },
      }),
    })
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
