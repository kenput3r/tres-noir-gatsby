import fetch from "node-fetch"
import type { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby"

export default async function authenticateYotpo(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  try {
    const YOTPO_CLIENT_ID = process.env.GATSBY_YOTPO_APP_KEY as string
    const YOTPO_CLIENT_SECRET = process.env.YOTPO_SECRET as string

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
    if (response.ok) {
      const json = await response.json()
      console.log("JSON", JSON)
      res.send(json)
    } else {
      return res.status(400).json("Error while authenticating yotpo")
    }
  } catch (error) {
    console.log("Error on fetching order details", error)
  }
}
