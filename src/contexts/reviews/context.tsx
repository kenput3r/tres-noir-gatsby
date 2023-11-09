import { createContext } from "react"
import { ReviewContextType } from "./types"
import { YotpoRetrieveReviewsData } from "../../types/yotpo"

const defaultContext: ReviewContextType = {
  isLoading: true,
  data: null,
  mutateReviewThumbVote: (props: {
    vote: "up" | "down"
    reviewId: number
  }) => {},
}

export const ReviewsContext = createContext(defaultContext)

export default ReviewsContext
