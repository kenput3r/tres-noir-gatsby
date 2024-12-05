import fetch from "node-fetch"
import type { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby"

type Body = {
  birthDate: string
  email: string
  firstName: string
  lastName: string
  phone: string
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
  console.log("responseJson", JSON.stringify(responseJson, null, 2))

  if (response.ok) {
    return responseJson.data as T
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
            birthDate: metafield(namespace: "tresnoir", key: "birth_date") {
              value
            }
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
          birthDate: {
            value: string
          }
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
      return {
        id: customer.id,
        birthDate: customer.birthDate?.value,
      }
    }
    return null
  }

  return null
}

async function createCustomer(customer: {
  email: string
  phone: string
  firstName: string
  lastName: string
}) {
  const customerCreateMutation = `#graphql
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        userErrors {
          field
          message
        }
        customer {
          id
          email
          phone
          taxExempt
          firstName
          lastName
          amountSpent {
            amount
            currencyCode
          }
          smsMarketingConsent {
            marketingState
            marketingOptInLevel
            consentUpdatedAt
          }
          emailMarketingConsent {
            marketingState
            marketingOptInLevel
            consentUpdatedAt
          }
        }
      }
    }
  `

  type CustomerCreate = {
    customerCreate: {
      userErrors: {
        field: string
        message: string
      }[]
      customer: {
        id: string
        email: string
        phone: string
        taxExempt: boolean
        firstName: string
        lastName: string
        amountSpent: {
          amount: string
          currencyCode: string
        }
        smsMarketingConsent: {
          marketingState: string
          marketingOptInLevel: string
          consentUpdatedAt: string
        }
      }
    }
  }

  const response = await shopifyAdmin<CustomerCreate>(customerCreateMutation, {
    input: {
      email: customer.email,
      phone: customer.phone,
      firstName: customer.firstName,
      lastName: customer.lastName,
      emailMarketingConsent: {
        marketingState: "SUBSCRIBED",
        marketingOptInLevel: "SINGLE_OPT_IN",
      },
      smsMarketingConsent: {
        marketingState: "SUBSCRIBED",
        marketingOptInLevel: "SINGLE_OPT_IN",
      },
    },
  })

  if (response && response.customerCreate.userErrors.length) {
    throw new Error(response.customerCreate.userErrors[0].message)
  }

  if (response && response.customerCreate.customer.id) {
    return {
      id: response.customerCreate.customer.id,
      birthDate: null,
    }
  }
  return null
}

type Customer = {
  id: string | null
  birthDate: string | null
} | null

export default async function rewards(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  try {
    const parsedBody: Body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body

    const { birthDate, email, firstName, lastName, phone } = parsedBody

    // get customer id
    let customer: Customer = await getCustomerId(email)
    console.log("customerId", customer?.id)
    if (!customer || !customer.id) {
      console.log("Customer not found")
      console.log("Creating customer", {
        email,
        phone,
        firstName,
        lastName,
      })
      // create customer
      customer = await createCustomer({
        email,
        phone,
        firstName,
        lastName,
      })
    }

    if (!customer || !customer.id) {
      console.log("Failed to create customer")
      return res.status(400).json({
        success: false,
        message: null,
        error: "Failed to create customer",
      })
    }

    if (customer?.birthDate) {
      console.log("Customer birth date already exists")
      return res.status(400).json({
        success: false,
        message: "Customer birth date already set",
        error: "Customer birth date already set",
      })
    }

    const input = {
      metafields: [
        {
          key: "birth_date",
          namespace: "tresnoir",
          ownerId: customer.id,
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
    console.log("response", JSON.stringify(response, null, 2))

    if (response && response.metafieldsSet.metafields.length) {
      console.log("Birth date updated successfully")
      return res.status(200).json({
        success: true,
        message: "Birth date updated successfully",
        error: null,
      })
    }

    console.log("Failed to update birth date")

    return res.status(400).json({
      success: false,
      message: null,
      error: "Failed to update birth date",
    })
  } catch (error: any) {
    console.log("Error on customer details", error)
    return res.status(500).json({
      success: false,
      message: null,
      error: error.message,
    })
  }
}
