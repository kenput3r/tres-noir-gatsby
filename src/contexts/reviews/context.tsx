import { createContext } from "react"
import { ReviewContextType } from "./types"
import { YotpoRetrieveReviewsData } from "../../types/yotpo"

const defaultContext: ReviewContextType = {
  isLoading: true,
  isRefetching: false,
  data: null,
  productHandle: "",
  mutateReviewThumbVote: (props: {
    vote: "up" | "down"
    reviewId: number
    undo?: boolean
  }) => {},
  refreshToPage: (pageNumber: number) => {},
}

export const ReviewsContext = createContext(defaultContext)

export default ReviewsContext
