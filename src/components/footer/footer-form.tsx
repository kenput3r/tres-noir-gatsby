import React, { MouseEvent, useState, useRef } from "react"
import styled from "styled-components"
import { FaChevronRight, FaCheck, FaSpinner } from "react-icons/fa"

const Component = styled.div`
  p {
    margin-bottom: 5px;
    color: black;
    text-transform: uppercase;
    font-family: var(--heading-font);
    text-align: right;
    @media (max-width: 600px) {
      margin-top: 10px;
      text-align: initial;
    }
  }
  .form-group {
    display: flex;
    line-height: 28px;
    margin-bottom: 0;
    @media (max-width: 600px) {
      line-height: 25px;
    }
  }
  button {
    background-color: #000;
    color: #fff;
    border-color: #000;
    border-style: solid;
    width: 40px;
    border-radius: 0;
    display: grid;
    place-items: center;
    cursor: pointer;
    border-width: 4px;
    --webkit-appearance: button-bevel;
    padding: 5px 3px;
    svg {
      font-size: 1rem;
      fill: white;
    }
  }
  input {
    width: 100%;
    border-radius: 0;
    -webkit-appearance: none;
    -moz-appearance: none;
    border: none;
    @media (max-width: 600px) {
      width: 275px;
    }
    padding: 2px 5px;
    :placeholder-shown {
      font-style: italic;
    }
  }
  .email-error {
    font-size: 0.85rem;
    font-style: italic;
    min-height: 29px;
  }
  .outline-red {
    outline: 1.5px solid red;
  }
  .red-text {
    color: darkred;
  }
  .green-text {
    color: lawngreen;
  }
  .hide {
    display: none;
  }
  .disable {
    opacity: 0.5;
    pointer-events: none;
  }
  .spinner {
    animation: spin infinite 5s linear;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const FooterForm = () => {
  const [emailInput, setEmailInput] = useState("")
  const emailMsg = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

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

  const submitNewletter = async evt => {
    evt.preventDefault()
    if (!validEmail(emailInput)) {
      if (emailMsg.current) {
        emailMsg.current.textContent = "Please enter a valid email"
        emailMsg.current.classList.add("red-text")
        if (formRef.current) {
          formRef.current.classList.add("outline-red")
        }
      }
      return
    }
    if (buttonRef.current && formRef.current) {
      formRef.current.classList.remove("outline-red")
      buttonRef.current
        .querySelector(".btn-chevron-right")
        ?.classList.add("hide")
      buttonRef.current.querySelector(".btn-spinner")?.classList.remove("hide")
      formRef.current.classList.add("disable")
    }
    const response = await fetchReq(emailInput)
    console.log(response)
    if (response && response.status === 200) {
      if (emailMsg.current && formRef.current && buttonRef.current) {
        buttonRef.current.querySelector(".btn-spinner")?.classList.add("hide")
        buttonRef.current.querySelector(".btn-check")?.classList.remove("hide")
        formRef.current.classList.remove("disable")
        emailMsg.current.classList.add("green-text")
        emailMsg.current.textContent = "You are now subscribed!"
      }
    } else {
      if (emailMsg.current) {
        emailMsg.current.textContent = "An error has occured, please try again"
        emailMsg.current.classList.add("red-text")
        if (formRef.current) {
          formRef.current.classList.add("outline-red")
        }
      }
    }
  }

  return (
    <Component>
      <p>Sign up for our newsletter</p>
      <form className="form-group" onSubmit={submitNewletter} ref={formRef}>
        <input
          type="email"
          placeholder="Email Address"
          name="emailAddress"
          onChange={evt => setEmailInput(evt.target.value)}
        />
        <button ref={buttonRef} type="submit" onSubmit={submitNewletter}>
          <FaChevronRight className="btn-chevron-right"></FaChevronRight>
          <FaCheck className="hide btn-check"></FaCheck>
          <FaSpinner className="hide btn-spinner spinner"></FaSpinner>
        </button>
      </form>
      <div className="email-error" ref={emailMsg}></div>
    </Component>
  )
}

export default FooterForm
