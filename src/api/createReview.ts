import fetch from "node-fetch"
import crypto from "crypto"
import type { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby"
import { YotpoCreateFormData } from "../types/yotpo"

type PayloadType = YotpoCreateFormData & {
  productId: string
  productTitle: string
  submissionTimeStamp: string
}

export default async function createReview(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  try {
    const body = req.body as PayloadType
    console.log("payload", req.body)
    console.log("here")
    // const token = await authenticateYotpo()
    const YOTPO_CLIENT_ID = process.env.GATSBY_YOTPO_APP_KEY as string
    const reviewerType = "verified_reviewer"
    const timeStamp = new Date()
    const signature = crypto.createHash("sha1").update("").digest("hex")
    const payload = {
      appKey: YOTPO_CLIENT_ID,
      sku: body.productId,
      product_title: body.productTitle,
      product_url: "",
      display_name: body.reviewerName,
      email: body.reviewerEmail,
      review_score: body.reviewScore,
      signature,
      time_stamp: timeStamp,
      submission_time_stamp: body.submissionTimeStamp,
    }
  } catch (error) {
    console.log("Error on fetching order details", error)
  }
}
