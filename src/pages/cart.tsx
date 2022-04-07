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

const Page = styled.div`
  margin: 0 1.45rem;
  ul {
    margin: 0;
    li {
      display: grid;
      grid-gap: 1em;
      grid-template-columns: repeat(5, 1fr);
      justify-content: space-between;
      align-items: center;
      align-content: center;
      border-bottom: 1px solid var(--color-grey-dark);
      @media only screen and (max-width: 480px) {
        grid-template-columns: 1fr 1fr;
        grid-gap: 1em;
      }
      .title {
        font-weight: bold;
        margin-bottom: 5px;
        a {
          color: #000;
          text-decoration: none;
        }
      }
      .sub-title {
        color: var(--color-grey-dark);
      }
      img {
        width: 100px;
        height: auto;
      }
      .remove-item {
        text-decoration: none;
        font-weight: bold;
        color: #000;
      }
    }
  }
  .subtotal {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    align-content: center;
  }
  .checkout-container {
    text-align: right;
    padding: 15px 0;
    .button {
      display: block;
      border-radius: 0;
      background-color: #000;
      color: #fff;
      font-size: 1.5rem;
      line-height: 0.7;
      padding: 1rem 2rem;
      text-align: center;
      text-transform: uppercase;
      text-decoration: none;
    }
    a {
      text-decoration: none;
      color: #000;
    }
  }
`

const Cart = () => {
  const { checkout, removeProductFromCart, updateProductInCart } =
    useContext(CartContext)

  const { associateCheckout } = useContext(CustomerContext)

  useEffect(() => {
    if (checkout) {
      console.log("CHECKOUT EXISTS", checkout)
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
      if (checkout?.lineItems.length === 0) {
        return <p className="text-center">Your cart is currently empty.</p>
      } else {
        return (
          <>
            <ul>
              {checkout?.lineItems &&
                checkout?.lineItems.map((line: LineItem) => (
                  <li key={line.id}>
                    <div>
                      <img
                        src={line.variant.image.src}
                        alt={line.variant.image.altText}
                      />
                    </div>
                    <div>
                      <p className="title">
                        <Link to={`/products/${line.variant.product.handle}`}>
                          {line.title}
                        </Link>
                      </p>
                      <span className="sub-title">{line.variant.title}</span>
                    </div>
                    <QuantitySelector
                      lineId={line.id}
                      quantity={line.quantity}
                      updateQuantity={updateQuantity}
                    />
                    <div>
                      <p className="price">${line.variant.price}</p>
                    </div>
                    <div>
                      <a
                        className="remove-item"
                        href="#"
                        onClick={() => removeProductFromCart(line.id)}
                      >
                        X Remove
                      </a>
                    </div>
                  </li>
                ))}
            </ul>
            <div className="subtotal">
              <div>
                <h2>Subtotal</h2>
                <span>Delivery & Taxes are calculated at checkout.</span>
              </div>
              <div>
                <h2 className="total">${checkout.subtotalPrice}</h2>
              </div>
            </div>
            <div className="checkout-container">
              <a href={checkout.webUrl} className="button">
                Checkout
              </a>
              <Link to="/">Continue Shopping</Link>
            </div>
          </>
        )
      }
    } else {
      return <Loader />
    }
  }

  return (
    <Layout>
      <SEO title="Cart" />
      <Page>
        <h1>Cart</h1>
        {renderContent()}
      </Page>
    </Layout>
  )
}

export default Cart
