import { useState, useEffect, useContext } from "react"
import { ErrorModalContext } from "../contexts/error"

export function useOrderDetails(orderId: string) {
  const { renderErrorModal } = useContext(ErrorModalContext)

  const [orderDetails, setOrderDetails] = useState<{} | undefined>({})

  const abortController = new AbortController()

  const fetchQuery = async () => {
    try {
      const url = "/api/getOrderDetails"
      const params: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: orderId,
        }),
        signal: abortController.signal,
      }
      console.log("params", params)
      const response = await fetch(url, params)
      console.log("raw response", response)
      const data = await response.json()
      console.log("json response", data)
      return data
    } catch (err: any) {
      console.log("Error while fetching order details", err)
      renderErrorModal()
    }
  }

  const createQuantityData = async () => {
    try {
      const json = await fetchQuery()
      if (json.data.order) {
        const orderDetails = json.data.order
        const filtered = orderDetails.lineItems.edges.filter(el => {
          const lineItem = el.node
          // find Prescription and frame Name custom Attr
          const prescriptionCustomAttr = lineItem.customAttributes.filter(
            el => el.key === "Prescription"
          )
          if (prescriptionCustomAttr.length !== 0) {
            return lineItem
          }
        })
        console.log("filtered", filtered)
        return filtered
      } else {
        console.log(
          `Error while calling quantity fetch, error on order ${orderId}`
        )
        return {}
      }
    } catch (err: any) {
      console.log("Error while calling fetch", err)
      renderErrorModal()
    }
  }

  useEffect(() => {
    const isBrowser = typeof window !== "undefined"
    if (isBrowser) {
      createQuantityData().then(result => setOrderDetails(result))
    }
    return () => {
      abortController.abort()
    }
  }, [])
  return orderDetails
}
