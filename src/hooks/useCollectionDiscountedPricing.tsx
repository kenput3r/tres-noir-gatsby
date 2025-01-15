import { useEffect, useState, useContext } from "react"

import { CartContext } from "../contexts/cart"
import useDiscountIdentifier from "./useDiscountIdentifier"

type Params = {
  prices: { id: string; price: string }[]
  handle: string
}
export const useCollectionDiscountedPricing = ({ prices, handle }: Params) => {
  const [discountedPrices, setDiscountedPrices] = useState<
    {
      id: string
      discountedPrice: string
    }[]
  >([])
  const [isApplicable, setIsApplicable] = useState(false)
  const [offer, setOffer] = useState("")
  // cart
  const { getAppliedDiscountCode } = useContext(CartContext)
  const { discountIdentifier, enableDiscountIdentifier } =
    useDiscountIdentifier()
  const abortController = new AbortController()

  // on mount
  useEffect(() => {
    const fetchDiscountedPricing = async () => {
      try {
        let offer = ""
        if (enableDiscountIdentifier) {
          offer = discountIdentifier
        } else {
          offer = getAppliedDiscountCode()
        }

        // get URL params
        if (!offer || offer === "") return

        const res = await fetch("/api/getCollectionDiscountedPricing", {
          method: "POST",
          body: JSON.stringify({ offer, prices, handle }),
          signal: abortController.signal,
          cache: "force-cache",
        })
        const json = await res.json()
        if (res.ok) {
          setDiscountedPrices(json.prices)
          setIsApplicable(true)
          setOffer(offer)
        }
      } catch (error) {}
    }
    if (!enableDiscountIdentifier) return
    fetchDiscountedPricing()
    return () => {
      abortController.abort()
    }
  }, [getAppliedDiscountCode])

  return {
    isApplicable,
    offer,
    discountedPrices,
  }
}

export default useCollectionDiscountedPricing
