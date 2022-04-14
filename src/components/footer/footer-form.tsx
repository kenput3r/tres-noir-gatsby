import React, { MouseEvent, useState, useRef } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { FaChevronRight } from "react-icons/fa"

const FooterForm = () => {
  const [emailInput, setEmailInput] = useState("")
  const emailMsg = useRef<HTMLDivElement>(null)

  const fetchReq = async (inEmail: string) => {
    try {
      const headers: HeadersInit = new Headers({
        "Content-Type": "application/json",
      })
      const params: RequestInit = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ inEmail }),
      }
      const response = await fetch("api/newsletter", params)
      return response
    } catch (error) {
      console.log("Error while fetching klaviyo request", error)
    }
  }

  const validEmail = (email: string) => {
    var regex = new RegExp(
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
    )
    if (regex.test(email)) {
      return true
    }
    return false
  }

  const submitNewletter = async () => {
    if (!validEmail(emailInput)) {
      if (emailMsg.current)
        emailMsg.current.textContent = "Please enter a valid email"
      return
    }
    const response = await fetchReq(emailInput)
    console.log(response)
    if (response && response.status === 200) {
      if (emailMsg.current) emailMsg.current.textContent = "Sent"
    } else {
      if (emailMsg.current)
        emailMsg.current.textContent = "An error has occured, please try again"
    }
  }

  return (
    <div className="newsletter-form">
      <p>Sign up for our newsletter</p>
      <div className="form-group">
        <input
          type="email"
          placeholder="Email Address"
          name="emailAddress"
          onChange={evt => setEmailInput(evt.target.value)}
        />
        <button onClick={submitNewletter}>
          <FaChevronRight />
        </button>
      </div>
      <div className="email-error" ref={emailMsg}></div>
    </div>
  )
}

export default FooterForm
