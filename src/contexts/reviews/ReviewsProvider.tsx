import React, {
  useState,
  useMemo,
  ReactNode,
  useCallback,
  useEffect,
} from "react"
import { ReviewsContext } from "./context"
import {
  YotpoRetrieveReviewsData,
  YotpoRetrieveReviewsResponse,
} from "../../types/yotpo"

type Props = {
  productId: number
  productHandle: string
  children: ReactNode | ReactNode[]
}

export function ReviewsProvider({ productId, productHandle, children }: Props) {
  const [data, setData] = useState<YotpoRetrieveReviewsResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefetching, setIsRefetching] = useState(false)

  useEffect(() => {
    const getReviewsForProduct = async () => {
      try {
        setIsLoading(true)
        const YOTPO_APP_KEY = process.env.GATSBY_YOTPO_APP_KEY as string
        const url = `https://api-cdn.yotpo.com/v1/widget/${YOTPO_APP_KEY}/products/${productId}/reviews.json?per_page=1`
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })
        const json = (await response.json()) as YotpoRetrieveReviewsData
        if (json.status.code !== 200) {
          throw Error(JSON.stringify(json.status))
        }
        console.log("json", json)
        setData(json.response)
        setIsLoading(false)
        return json
      } catch (error) {
        console.error("Error fetching reviews for product", error)
      }
    }
    getReviewsForProduct()
  }, [])

  const refreshToPage = async (pageNumber: number) => {
    try {
      setIsRefetching(true)
      const YOTPO_APP_KEY = process.env.GATSBY_YOTPO_APP_KEY as string
      const url = `https://api-cdn.yotpo.com/v1/widget/${YOTPO_APP_KEY}/products/${productId}/reviews.json?per_page=1&page=${pageNumber}`
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      const json = (await response.json()) as YotpoRetrieveReviewsData
      if (json.status.code !== 200) {
        throw Error(JSON.stringify(json.status))
      }
      setData(json.response)
      setIsRefetching(false)
      return json
    } catch (error) {
      console.error("Error fetching reviews for product", error)
    }
  }

  const mutateReviewThumbVote = async ({
    vote,
    reviewId,
    undo = false,
  }: {
    vote: "up" | "down"
    reviewId: number
    undo?: boolean
  }) => {
    try {
      const url = !undo
        ? `https://api.yotpo.com/reviews/${reviewId}/vote/${vote}`
        : `https://api.yotpo.com/reviews/${reviewId}/vote/${vote}/true`
      console.log("ENDPOINT IS", url)
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          review_id: reviewId,
          vote_type: vote,
        }),
      })
      const json = await response.json()
      console.log("RESOINSE", json)
    } catch (error) {
      console.error("Error", error)
    }
  }

  const reviewsContextValue = useMemo(
    () => ({
      data,
      productHandle,
      isLoading,
      mutateReviewThumbVote,
      refreshToPage,
      isRefetching,
    }),
    [data, isLoading, isRefetching]
  )

  return (
    <ReviewsContext.Provider value={reviewsContextValue}>
      {children}
    </ReviewsContext.Provider>
  )
}

export default ReviewsProvider
