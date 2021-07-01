import React, { useState, useEffect, useContext } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Loader from "../components/loader"
import QuantitySelector from "../components/quantity-selector"
import { CartContext } from "../contexts/cart"
import { Checkout, LineItem } from "../types/checkout"

const Cart = () => {
  const { checkout, removeProductFromCart, updateProductInCart } =
    useContext(CartContext)
  const [cart, setCart] = useState<Checkout>()

  useEffect(() => {
    console.log("CHECKOUT", checkout)
    setCart(checkout as Checkout)
  }, [checkout])

  const updateQuantity = (lineId: string, quantity: number) => {
    updateProductInCart(lineId, quantity)
  }

  return (
    <Layout>
      <SEO title="Cart" />
      <Page>
        <h1>Cart</h1>
        {cart ? (
          cart?.lineItems.length === 0 ? (
            <p className="text-center">Your cart is currently empty.</p>
          ) : (
            <>
              <ul>
                {cart?.lineItems &&
                  cart?.lineItems.map((line: LineItem) => {
                    return (
                      <li key={line.id}>
                        <div>
                          <img
                            src={line.variant.image.src}
                            alt={line.variant.image.altText}
                          />
                        </div>
                        <div>
                          <p className="title">
                            <Link
                              to={`/products/${line.variant.product.handle}`}
                            >
                              {line.title}
                            </Link>
                          </p>
                          <span className="sub-title">
                            {line.variant.title}
                          </span>
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
                    )
                  })}
              </ul>
              <div className="subtotal">
                <div>
                  <h2>Subtotal</h2>
                  <span>Delivery & Taxes are calculated at checkout.</span>
                </div>
                <div>
                  <h2 className="total">${cart.subtotalPrice}</h2>
                </div>
              </div>
              <div className="checkout-container">
                <a href={cart.webUrl} className="button">
                  Checkout
                </a>
                <Link to="/">Continue Shopping</Link>
              </div>
            </>
          )
        ) : (
          <Loader />
        )}
      </Page>
    </Layout>
  )
}

export default Cart

const Page = styled.div`
  ul {
    margin: 0;
    li {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      align-content: center;
      border-bottom: 1px solid var(--color-grey-dark);
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