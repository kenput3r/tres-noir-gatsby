import fetch from "node-fetch"

export default async function klaviyoFormHandler(req, res) {
  console.log('TRY POSTING TO KLAVIYO')
  try {
    const reqEmail = req.body.inEmail
    const url: string = `https://a.klaviyo.com/api/v2/list/R4y2R5/subscribe?api_key=${process.env.KLAVIYO_PRIVATE_KEY}`
    console.log('URL', url)
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        profiles: [
          {
            email: reqEmail,
          },
        ],
      }),
    }
    const response = await fetch(url, options)
    if (response.ok) {
      return res.status(200).json("success")
    }
    return res.status(400).json("Error while posting to klaviyo")
  } catch (error) {
    console.log("Error on klaviyo form request", error)
    return res.status(400).json("Error on klaviyo form request", JSON.stringify(error));
  }
}
