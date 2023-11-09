import { YotpoRetrieveReviewsResponse } from "../../types/yotpo"

export type ReviewContextType = {
  isLoading: boolean
  data: YotpoRetrieveReviewsResponse | null
  mutateReviewThumbVote: (props: {
    vote: "up" | "down"
    reviewId: number
  }) => void
}
