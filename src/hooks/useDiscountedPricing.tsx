import { useEffect, useState } from "react"

type Params = {
  productId: string
  prices: { id: string; price: string }[]
  selectedVariantId: string
  handle: string
}
export const useDiscountedPricing = ({
  productId,
  prices,
  selectedVariantId,
  handle,
}: Params) => {
  const [discountedPrices, setDiscountedPrices] = useState<
    {
      id: string
      discountedPrice: string
    }[]
  >([])
  const [isApplicable, setIsApplicable] = useState(false)
  const [offer, setOffer] = useState("")

  // on mount
  useEffect(() => {
    const fetchDiscountedPricing = async () => {
      try {
        // get URL params
        const isBrowser = typeof window !== "undefined"
        if (!isBrowser) return
        const urlParams = new URLSearchParams(window.location.search)
        const offer = urlParams.get("offer")
        if (!offer || offer === "") return

        const res = await fetch("/api/getDiscountedPricing", {
          method: "POST",
          body: JSON.stringify({ productId, offer, prices, handle }),
        })
        const json = await res.json()
        if (res.ok) {
          setDiscountedPrices(json.prices)
          setIsApplicable(true)
          setOffer(offer)
        }
      } catch (error) {}
    }
    fetchDiscountedPricing()
  }, [])

  return {
    isApplicable:
      isApplicable && discountedPrices.some(p => p.id === selectedVariantId),
    offer,
    discountedPrice:
      discountedPrices.find(p => p.id === selectedVariantId)?.discountedPrice ??
      null,
  }
}

export default useDiscountedPricing
