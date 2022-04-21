import React, { useEffect, useContext } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Loader from "../components/loader"
import QuantitySelector from "../components/quantity-selector"
import { CartContext } from "../contexts/cart"
import { CustomerContext } from "../contexts/customer"
import { LineItem } from "../types/checkout"
import { startedCheckoutKlaviyoEvent } from "../helpers/klaviyo"
import { VscClose } from "react-icons/vsc"
import Upsell from "../components/upsell"

const Page = styled.div`
  .cart-wrapper {
    max-width: 860px;
    h2 {
      font-weight: normal;
    }
    padding-top: 30px;
    ul {
      .wrapper {
        padding: 0;
      }
      margin: 0;
      li {
        border-radius: 10px;
        /* display: grid;
        grid-gap: 1em;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        justify-content: space-between;
        align-items: center;
        align-content: center;
        border-bottom: 1px solid var(--color-grey-dark);
        @media only screen and (max-width: 480px) {
          grid-template-columns: 1fr 1fr;
          grid-gap: 1em;
        } */
        .close-btn {
          text-align: right;
          padding: 0px 3px 3px 3px;
          a {
            text-align: right;
            svg {
              font-size: 1.65rem;
            }
          }
        }
        list-style: none;
        background: white;
        margin: 30px 0;
        .card {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          > div {
            flex: 1;
            padding: 0 10px;
          }
        }
        .title {
          /* font-weight: bold; */
          margin-bottom: 5px;
          a {
            color: #000;
            text-decoration: none;
          }
        }
        .sub-title {
          display: flex;
          justify-content: space-between;
          color: var(--color-grey-dark);
          span {
            font-family: var(--sub-heading-font);
          }
        }
        /* img {
          width: 100px;
          height: auto;
        } */
        .remove-item {
          text-decoration: none;
          /* font-weight: bold; */
          color: #000;
        }
      }
    }
    .subtotal {
      text-align: right;
      p {
        :first-child {
          font-size: 1.75rem;
        }
        :not(:first-child) {
          color: var(--color-grey-dark);
          font-family: var(--sub-heading-font);
        }
        margin-bottom: 10px;
      }
    }
    .btn-container {
      text-align: right;
      padding: 15px 0;
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
      /* a {
        text-decoration: none;
        color: #000;
      } */
    }
    p,
    span,
    a,
    h2 {
      font-family: var(--heading-font);
      text-transform: uppercase;
    }
    :nth-child(1) {
      background: #e0e0e0;
    }
    :nth-child(2) {
      background: white;
    }
  }
`

const Cart = () => {
  const {
    checkout,
    removeProductFromCart,
    updateProductInCart,
    bundledVariants,
  } = useContext(CartContext)

  const { associateCheckout } = useContext(CustomerContext)

  useEffect(() => {
    if (checkout) {
      if (checkout.lineItems.length > 0) {
        startedCheckoutKlaviyoEvent(checkout)
      }
      associateCheckout(checkout.id)
    }
  }, [checkout])

  const updateQuantity = (lineId: string, quantity: number) => {
    updateProductInCart(lineId, quantity)
  }

  const renderContent = () => {
    if (checkout) {
      console.log(bundledVariants)
      const glassesItems = checkout.lineItems.forEach(el => {
        console.log(el.variant.id)
      })
      if (checkout?.lineItems.length === 0) {
        return <p className="text-center">Your cart is currently empty.</p>
      } else {
        console.log(checkout)
        return (
          <section>
            <section className="cart-items cart-wrapper wrapper">
              <h2>
                Your cart:{" "}
                <span className="total">${checkout.subtotalPrice}</span>
              </h2>
              <ul>
                {checkout?.lineItems &&
                  checkout?.lineItems.map((line: LineItem) => (
                    <li key={line.id}>
                      <div className="close-btn">
                        <a
                          className="remove-item"
                          href="#"
                          onClick={() => removeProductFromCart(line.id)}
                        >
                          <VscClose />
                        </a>
                      </div>

                      <div className="card">
                        <div>
                          <img
                            src={line.variant.image.src}
                            alt={line.variant.image.altText}
                          />
                        </div>
                        <div>
                          <div>
                            <p className="title">
                              <Link
                                to={`/products/${line.variant.product.handle}`}
                              >
                                {line.title}
                              </Link>
                            </p>
                            <div className="sub-title">
                              <span>
                                {line.variant.title !== "Default Title"
                                  ? line.variant.title
                                  : ""}
                              </span>

                              <span className="price">
                                ${line.variant.price}
                              </span>
                            </div>
                          </div>
                          {/* <QuantitySelector
                          lineId={line.id}
                          quantity={line.quantity}
                          updateQuantity={updateQuantity}
                        /> */}
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
              <div className="subtotal">
                <p>
                  Subtotal:{" "}
                  <span className="total">${checkout.subtotalPrice}</span>
                </p>
                <p>Delivery & Taxes are calculated at checkout.</p>
              </div>
              <div className="btn-container">
                <a href={checkout.webUrl} className="btn checkout">
                  Check Out
                </a>
              </div>
            </section>
            <section className="cart-wrapper wrapper">
              <Upsell></Upsell>
            </section>
          </section>
        )
      }
    } else {
      return <Loader />
    }
  }

  return (
    <Layout>
      <SEO title="Cart" />
      <Page>{renderContent()}</Page>
    </Layout>
  )
}

export default Cart
