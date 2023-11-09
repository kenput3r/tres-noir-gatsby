import fetch from "node-fetch"
import type { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby"

export default async function authenticateYotpo(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  try {
    const YOTPO_CLIENT_ID = process.env.TZ
    const YOTPO_CLIENT_SECRET = process.env.TZ

    const response = await fetch("https://api.yotpo.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: YOTPO_CLIENT_ID,
        client_secret: YOTPO_CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    })
  } catch (error) {
    console.log("Error on fetching order details", error)
  }
}
