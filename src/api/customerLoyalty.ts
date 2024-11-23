import fetch from "node-fetch"
import type { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby"

type Body = {
  birthDate: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  smsConsent: boolean
}

async function shopifyAdmin<T>(query: string, variables: any) {
  const url: string = process.env.GATSBY_STORE_MY_SHOPIFY
    ? `https://${process.env.GATSBY_STORE_MY_SHOPIFY}/admin/api/2022-04/graphql.json`
    : ""

  const adminToken: string = process.env.GATSBY_STORE_TOKEN
    ? process.env.GATSBY_STORE_TOKEN
    : ""

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Shopify-Access-Token": adminToken,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const responseJson = await response.json()

  if (response.ok) {
    return responseJson.data as T
  }

  if (responseJson.errors) {
    console.error(responseJson.errors)
    throw new Error("Failed to fetch data")
  }

  return null
}

async function getCustomerId(email: string) {
  const customerQuery = `#graphql
    query GetCustomer($query: String!) {
      customers(first:1, query: $query) {
        edges {
          node {
            id
            email
          }
        }
      }
    }
  `

  type GetCustomer = {
    customers: {
      edges: {
        node: {
          id: string
          email: string
        }
      }[]
    }
  }

  const response = await shopifyAdmin<GetCustomer>(customerQuery, {
    query: email,
  })

  if (response && response?.customers?.edges?.length) {
    const customer = response.customers.edges[0].node
    if (customer.email.toLowerCase() === email.toLowerCase()) {
      return customer.id
    }
    return null
  }

  return null
}

export default async function customerLoyalty(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  try {
    const parsedBody: Body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body

    const { birthDate, email } = parsedBody

    // get customer id
    const customerId = await getCustomerId(email)
    if (!customerId) {
      return res.status(400).json("Customer not found")
    }

    const input = {
      metafields: [
        {
          key: "birth_date",
          namespace: "tresnoir",
          ownerId: customerId,
          type: "date",
          value: birthDate,
        },
      ],
    }

    type UpdateBirthDate = {
      metafieldsSet: {
        metafields: {
          key: string
          namespace: string
          value: string
          createdAt: string
          updatedAt: string
        }[]
        userErrors: {
          field: string
          message: string
          code: string
        }[]
      }
    }

    const mutation = `#graphql
      mutation UpdateBirthDate($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            key
            namespace
            value
            createdAt
            updatedAt
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `

    const response = await shopifyAdmin<UpdateBirthDate>(mutation, input)

    if (response && response.metafieldsSet.metafields.length) {
      return res.status(200).json(response.metafieldsSet.metafields)
    }

    return res.status(400).json("Error while accessing shopify admin")
  } catch (error) {
    console.log("Error on customer details", error)
    return res.status(500).json("Internal server error")
  }
}
