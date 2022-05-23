import React, { useContext } from "react"
import { Link } from "gatsby"
import { CartContext } from "../contexts/cart"
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"

const Component = styled.div`
  .cart-icon-container {
    position: relative;
  }
  .cart-badge {
    position: absolute;
    bottom: 15px;
    left: 16px;
    border-radius: 50%;
    background: black;
    height: 20px;
    width: 20px;
    display: grid;
    place-items: center;
    .cart-number {
      text-align: center;
      color: white;
      font-size: 0.75rem;
      vertical-align: middle;
      margin-top: -2px;
      @media screen and (max-width: 480px) {
        margin-top: -1px;
      }
    }
  }
`

const CartIcon = () => {
  let cartCount = 0
  const { checkout } = useContext(CartContext)
  if (checkout) {
    if (checkout.tnLineItems) {
      cartCount = checkout.tnLineItems.length
    } else {
      cartCount = checkout.lineItems.length
    }
  }
  return (
    <Component>
      <Link to="/cart">
        <div className="cart-icon-container">
          <div className="cart-icon">
            <StaticImage
              src="../images/cart.png"
              alt="Shopping Cart"
              placeholder="tracedSVG"
              style={{ marginBottom: 0, maxWidth: 26 }}
            />
          </div>
          {cartCount > 0 && (
            <span className="cart-badge">
              <span className="cart-number">{cartCount}</span>
            </span>
          )}
        </div>
      </Link>
    </Component>
  )
}

export default CartIcon
