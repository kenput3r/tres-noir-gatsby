import { useEffect, useState } from "react"

export function useQuantityQuery(handle: string, size: number) {
  const [productQuantities, setProductQuantities] = useState({})

  const fetchQuery = async () => {
    try {
      const inventoryQuery = `
        query variantInStock($handle:String!, $size: Int!) {
          product(handle: $handle) {
            variants(first: $size) {
              edges {
                node {
                  quantityAvailable
                  sku
                }
              }
            }
          }
        }
      `
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Shopify-Storefront-Access-Token":
            process.env.GATSBY_STORE_STOREFRONT_TOKEN,
        },
        body: JSON.stringify({
          query: inventoryQuery,
          variables: {
            handle: handle,
            size: size,
          },
        }),
      }
      const response = await fetch(
        process.env.GATSBY_STORE_STOREFRONT_ENDPOINT,
        options
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.log(
        "Error while fetching product inventory productQuantities",
        error
      )
    }
  }

  const createQuantityData = async () => {
    try {
      const data = await fetchQuery()
      const variants = data.data.product.variants.edges
      const quantities = {}
      variants.forEach(element => {
        quantities[element.node.sku] = element.node.quantityAvailable
      })
      return quantities
    } catch (error) {
      console.log("Error while calling fetch", error)
    }
  }

  useEffect(() => {
    const isBrowser = typeof window !== "undefined"
    if (isBrowser) {
      createQuantityData().then(result => setProductQuantities(result))
    }
  }, [])
  return productQuantities
}
