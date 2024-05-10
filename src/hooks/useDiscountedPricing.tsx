import { useEffect, useState } from "react"

export const useDiscountedPricing = (productId: string) => {
  const [discountedPrices, setDiscountedPrices] = useState([])
  const [isApplicable, setIsApplicable] = useState(false)

  // on mount
  useEffect(() => {
    const fetchDiscountedPricing = async () => {
      // get URL params
      const isBrowser = typeof window !== "undefined"
      if (!isBrowser) return
      const urlParams = new URLSearchParams(window.location.search)
      const offer = urlParams.get("offer")
      if (!offer || offer === "") return

      const res = await fetch("/api/getDiscountedPricing", {
        method: "POST",
        body: JSON.stringify({ productId, offer }),
      })
      const json = await res.json()
      console.log("client json", json)
    }
    fetchDiscountedPricing()
  }, [])
  return {
    isApplicable,
    prices: discountedPrices,
  }
}

export default useDiscountedPricing
