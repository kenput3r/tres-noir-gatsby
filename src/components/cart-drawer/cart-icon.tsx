import React, { useContext } from "react"
import { Link } from "gatsby"
import { CartContext } from "../../contexts/cart"
import { StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"
import { tnItem } from "../../types/checkout"

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
    height: 22px;
    width: 22px;
    display: grid;
    place-items: center;
    .cart-number {
      text-align: center;
      color: white;
      font-size: 0.7rem;
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
      checkout.tnLineItems.forEach((item: tnItem) => {
        if (!item.isCustom) {
          cartCount += item.lineItems[0].shopifyItem.quantity
        } else {
          cartCount += 1
        }
      })
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
              className="img-btn"
              src="../../images/cart.png"
              alt="Shopping Cart"
              placeholder="dominantColor"
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
