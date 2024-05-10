import fetch from "node-fetch"
import type { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby"
import { flattenConnection } from "../utils/flattenConnection"

export default async function getDiscountedPricing(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  try {
    const { offer, handle, productId, prices } = JSON.parse(req.body)

    console.log("productId", productId)
    console.log("offer", offer)

    const adminToken: string = process.env.GATSBY_STORE_TOKEN ?? ""
    const storeName = process.env.GATSBY_STORE_MY_SHOPIFY ?? ""
    const url = `https://${storeName}/admin/api/2022-04/graphql.json`

    const variables = {
      productId: `gid://shopify/Product/${productId}`,
      code: offer,
    }

    const query = `#graphql
      query codeDiscountNodeByCode($productId: ID!, $code: String!) {
        codeDiscountNodeByCode(code: $code) {
          codeDiscount {
            __typename
            ... on DiscountCodeBasic {
              status
              title
              customerSelection {
                __typename
                ... on DiscountCustomerAll {
                  allCustomers
                }
              }
              customerGets {
                value {
                  __typename
                  ... on DiscountAmount {
                    amount {
                      amount
                      currencyCode
                    }
                  }
                  ... on DiscountPercentage {
                    percentage
                  }
                }
                items {
                  __typename
                  ... on DiscountProducts {
                    productVariants(first: 250) {
                      nodes {
                        id
                        product {
                          handle
                        }
                      }
                    }
                    products(first: 250) {
                      nodes {
                        handle
                      }
                    }
                  }
                  ... on DiscountCollections {
                    collections(first: 100) {
                      nodes {
                        id
                        handle
                        hasProduct(id: $productId)
                      }
                    }
                  }
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
        query,
        variables,
      }),
    })
    const responseJson = await response.json()
    console.log("responseJson", responseJson)
    if (responseJson.errors) {
      return res
        .status(400)
        .json(
          responseJson.errors[0].message ??
            "Error while fetching from admin api"
        )
    }
    const { data } = responseJson

    const { codeDiscountNodes } = data
    const discounts = flattenConnection(codeDiscountNodes)

    console.log("filteredDiscounts", discounts)

    return res.status(400).json("Error while fetching from admin api")
  } catch (error) {
    console.log("Error on getDiscountedPricing:", error)
  }
}

type ShopifyApplicableVariant = {
  id: string
  product: {
    handle: string
  }
}

type ShopifyDiscount = {
  __typename: string
  customerSelection?: {
    __typename: string
    allCustomers: boolean
  }
  customerGets: {
    value: {
      __typename: string
      amount: {
        amount: number
        currencyCode: string
      }
      percentage: number
    }
    items: {
      __typename: string
      productVariants: {
        nodes: {
          id: string
          product: {
            handle: string
          }
        }[]
      }
      products: {
        nodes: {
          handle: string
        }[]
      }
    }
  }
}
