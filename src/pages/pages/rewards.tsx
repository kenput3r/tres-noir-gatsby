import React, { useState } from "react"
import styled from "styled-components"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Layout from "../../components/layout"
import SEO from "../../components/seo"
import Spinner from "../../components/spinner"

const Page = styled.div`
  .flex-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    gap: 20px;
    div {
      width: 100%;
    }
  }
  h1 {
    text-align: center;
  }
  h1,
  h3 {
    text-transform: uppercase;
    font-weight: normal;
  }
  h3 {
    margin-bottom: 16px;
    font-size: 1.45em;
  }
  p,
  span,
  label,
  input,
  textarea {
    font-family: var(--sub-heading-font);
  }
  p {
    margin-bottom: 5px;
  }
  section {
    :not(.grid-top-form) {
      margin-bottom: 20px;
    }
  }
  input {
    width: 100%;
    max-width: 325px;
    line-height: 35px;
    padding: 3px 5px;
  }
  textarea {
    width: 100%;
    height: 200px;
    padding: 5px 8px;
    resize: vertical;
  }
  input,
  textarea {
    border-radius: 0;
    border-width: 1px;
    -webkit-appearance: none;
    -moz-appearance: none;
    border-style: solid;
  }
  label {
    display: block;
    color: var(--color-grey-dark);
    text-transform: uppercase;
    margin-bottom: 5px;
  }
  .grid-top-form,
  .grid-bottom-form {
    display: contents;
  }
  button,
  .button {
    background-color: #000;
    border-radius: 0;
    border: 1px solid #000;
    color: #fff;
    display: block;
    font-family: var(--sub-heading-font);
    padding: 10px 20px;
    text-decoration: none;
    text-transform: uppercase;
    font-family: var(--heading-font);
    -webkit-appearance: button-bevel;
    :hover {
      cursor: pointer;
    }
    @media only screen and (max-width: 480px) {
      display: inline-block;
    }
  }
  .grid-top-form,
  .grid-bottom-form {
    div {
      margin: 12px 0;
    }
  }
  .grid-form {
    display: contents;
    .grid-top-form,
    .grid-bottom-form {
      display: block;
    }
  }
  .grid-top-form {
    grid-area: grid-top-form;
  }
  .grid-bottom-form {
    grid-area: grid-bottom-form;
  }
  .disclaimer {
    margin-bottom: 20px;
  }
  @media only screen and (max-width: 480px) {
    .flex-container {
      flex-direction: column;
    }
    .grid-top-form,
    .grid-bottom-form {
      div {
        margin: 6px 0;
      }
    }
    .disclaimer {
      margin-bottom: 10px;
    }
  }
`

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const schema = yup
  .object({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    email: yup.string().email().required("Email is required"),
    birthDate: yup.date().required("Birth Date is required"),
    phone: yup
      .string()
      .required("required")
      .matches(phoneRegExp, "Phone number is not valid")
      .min(10, "too short")
      .max(10, "too long"),
  })
  .required()
type FormData = yup.InferType<typeof schema>

const Rewards = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })
  const clear = () => {
    setSuccess(false)
    setError(null)
  }
  const onSubmit = async (data: FormData) => {
    console.log(data)
    try {
      reset()
      setLoading(true)
      const { birthDate, email, firstName, lastName, phone } = data
      // convert data to string MM/DD/YYYY
      const dateString = birthDate.toLocaleDateString()
      const dateArray = dateString.split("/")
      const year = dateArray[2]
      const month =
        dateArray[0].length === 1 ? `0${dateArray[0]}` : dateArray[0]
      const day = dateArray[1].length === 1 ? `0${dateArray[1]}` : dateArray[1]
      const birthDateString = `${year}-${month}-${day}`

      console.log("birthDateString", birthDateString)
      const response = await fetch("/api/rewards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          birthDate: birthDateString,
          email,
          firstName,
          lastName,
          phone,
        }),
      })
      const responseJson = await response.json()
      let wasSuccessful = false
      if (response.ok) {
        console.log("Form submitted successfully")
        wasSuccessful = true
      } else {
        console.error("Form submission failed")
        setError(responseJson?.error ?? "An error occurred")
      }
      setSuccess(wasSuccessful)
      setLoading(false)
      reset()
      setTimeout(() => clear(), 3000)
    } catch (err: any) {
      console.error("Error submitting form", err)
      setLoading(false)
    }
  }

  return (
    <Layout>
      <SEO title="Rewards" />
      <Page className="wrapper">
        <h1>Rewards</h1>
        <form className="grid-form" onSubmit={handleSubmit(onSubmit)}>
          <section className="grid-top-form">
            <h3>Birthday Offers</h3>
            <p>
              We'd love to celebrate your birthday with you. Let us know when
              your special day is to get a special offer during your birth
              month.
            </p>
            <div className="flex-container">
              <div>
                <label htmlFor="firstname">First Name</label>
                <input type="text" id="firstname" {...register("firstName")} />
                <p>{errors.firstName?.message}</p>
              </div>
              <div>
                <label htmlFor="lastname">Last Name</label>
                <input type="text" id="lastname" {...register("lastName")} />
                <p>{errors.lastName?.message}</p>
              </div>
            </div>
            <div className="flex-container">
              <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" {...register("email")} />
                <p>{errors.email?.message}</p>
              </div>
              <div>
                <label htmlFor="birthdate">Birth Date</label>
                <input type="date" id="birthdate" {...register("birthDate")} />
                <p>{errors.birthDate?.message}</p>
              </div>
            </div>
            <div className="flex-container">
              <div>
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="+17146564796"
                  {...register("phone")}
                />
              </div>
            </div>
          </section>
          <section className="grid-bottom-form">
            <p className="disclaimer">
              By submitting this form, you agree to receive marketing emails
              from Tres Noir about our products and services. You can
              unsubscribe at any time by clicking the link at the bottom of our
              emails.
            </p>
            <button type="submit" className="button btn" disabled={loading}>
              {loading ? <Spinner /> : "Submit"}
            </button>
            {success && <p>Form submitted successfully</p>}
            {error && <p>{error}</p>}
          </section>
        </form>
      </Page>
    </Layout>
  )
}

export default Rewards
