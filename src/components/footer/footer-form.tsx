import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"

const FooterForm = () => {
  const submitNewletter = evt => {
    console.log("button clicked")
  }

  return (
    <div className="newsletter-form">
      <p>Sign up for our newsletter</p>
      <div className="form-group">
        <input type="email" placeholder="Email Address" />
        <button onClick={evt => submitNewletter(evt)}>&rarr;</button>
      </div>
    </div>
  )
}

export default FooterForm
