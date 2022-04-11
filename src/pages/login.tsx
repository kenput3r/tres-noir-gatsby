import React, { useState, useContext } from "react"
import styled from "styled-components"
import { navigate } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { CustomerContext } from "../contexts/customer"

const Page = styled.div`
  width: 420px;
  max-width: 100;
  margin: auto;
  label {
    display: block;
    font-size: 0.875rem;
    line-height: 1.4em;
    margin-bottom: 4px;
  }
  input {
    font-size: 15px;
    line-height: 15px;
    background: #fff;
    color: #8a8f93;
    border: 1px solid #e1e3e4;
    padding: 11px 15px;
    margin: 0;
    vertical-align: middle;
    max-width: 100%;
    border-radius: 0;
    box-sizing: border-box;
    &.customer-password,
    &.customer-email {
      width: 100%;
    }
  }
  .btn {
    background: #232323;
    border: 1px solid #232323;
    color: #fff;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    height: auto;
    margin: 0;
    text-decoration: none;
    cursor: pointer;
    padding: 11px 25px;
    vertical-align: middle;
    text-align: center;
    box-sizing: content-box;
    transition: background-color 0.1s, color 0.1s, border-color 0.1s;
    display: inline-block;
  }
  .action-bottom {
    margin-top: 20px;
  }
`

const Login = () => {
  const { login } = useContext(CustomerContext)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("MUTATION", { variables: { email, password } })
    const query = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `
    try {
      const response = await fetch(
        `https://tres-noir.myshopify.com/api/2022-01/graphql.json`,
        {
          method: "POST",
          headers: {
            "X-Shopify-Storefront-Access-Token": process.env
              .GATSBY_STORE_STOREFRONT_TOKEN as string,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            variables: { input: { email, password } },
          }),
        }
      )
      console.log("RESPONSE", response)
      const json = await response.json()
      console.log("json", json)
      if (json.data) {
        const { customerAccessToken, customerUserErrors } =
          json.data.customerAccessTokenCreate
        if (customerUserErrors.length) {
          alert(`ERROR: ${customerUserErrors[0].message}`)
        } else {
          login(customerAccessToken)
          navigate("/account")
        }
      } else {
        alert("ERROR: please try again later...")
      }
    } catch (err: any) {
      console.log("ERROR", err.message)
    }
  }

  const handleEmailChange = (e: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setPassword(e.target.value)
  }

  return (
    <Layout>
      <SEO title="Login" />
      <Page>
        <h1>Login</h1>
        <form onSubmit={e => handleSubmit(e)}>
          <div className="login-email">
            <label htmlFor="customer-email">Email</label>
            <input
              className="customer-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="login-password">
            <label htmlFor="customer-password">Password</label>
            <input
              className="customer-password"
              name="password"
              type="password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="action-bottom">
            <p>
              <input className="btn" type="submit" value="Submit" />
            </p>
          </div>
        </form>
      </Page>
    </Layout>
  )
}

export default Login
