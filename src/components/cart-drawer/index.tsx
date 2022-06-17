import React, { useContext, useEffect, useRef } from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import { CartContext } from "../../contexts/cart"
import { tnItem } from "../../types/checkout"
import CartIcon from "./cart-icon"
import { GatsbyImage } from "gatsby-plugin-image"
import { FaChevronRight } from "react-icons/fa"
import QuantitySelector from "../quantity-selector"
import { useClickAway } from "react-use"
import { useSpring, animated, config } from "react-spring"
import { useHeight } from "../../hooks/useHeight"
import ShopifyItem from "./products/shopify-item"
import SunglassesItem from "./products/sunglasses-item"
import CustomItem from "./products/custom-item"
import { useWindowSize } from "react-use"

const Component = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  background-color: white;
  z-index: 100000;
  max-height: 100vh;
  height: 100vh;
  /* max-width: 100%; */
  width: 400px;
  /* @media screen and (max-width: 400px) {
    width: 100%;
  } */
  overflow-y: auto;
  border: 0.5px solid #c5c5c5;
  border-top: none;
  font-family: var(--sub-heading-font);
  .header {
    position: sticky;
    top: 0;
    z-index: 100002;
    button {
      margin-left: 19px;
      @media screen and (max-width: 400px) {
        margin-left: 30px;
      }
      padding: 0;
      color: white;
      background: none;
      outline: none;
      border: none;
      cursor: pointer;
    }
    background-color: black;
    display: flex;
    color: white;
    justify-content: space-between;
    align-items: center;
    font-family: var(--heading-font);
    text-transform: uppercase;
    .sub-flex {
      display: flex;
      margin-right: 15px;
      > span {
        :first-of-type {
          margin-right: 18px;
        }
      }
    }
    padding: 25px 10px 25px 0px;
    font-size: 1.5rem;
  }
  .cart-products {
    overflow-y: auto;
    z-index: 100001;
    //height: 100vh;
  }
  .item-card {
    border: 0.5px solid #c5c5c5;
    padding: 5px 2px;
    .close-btn {
      text-align: right;
      button {
        appearance: none;
        background: none;
        outline: none;
        border: none;
        padding: 0;
      }
    }
    svg {
      cursor: pointer;
      font-size: 1.6rem;
      color: var(--color-grey-dark);
    }
    .product-card {
      display: flex;
      justify-content: space-between;
      > div {
        :first-of-type {
          flex: 0.7;
        }
        :last-of-type {
          flex: 1;
        }
      }
      padding: 10px;
      padding-top: 0;
      p {
        text-transform: uppercase;
      }
      .product-titles {
        text-align: left;
        p {
          margin: 0;
        }
        a {
          text-decoration: none;
          color: black;
          :hover,
          :focus {
            text-decoration: underline;
          }
        }
        .title {
          font-family: var(--heading-font);
        }
        .subtitle {
          font-size: 0.85rem;
          color: var(--color-grey-dark);
        }
      }
      .product-image {
        padding-left: 5px;
        padding-right: 15px;
        .gatsby-image-wrapper {
          max-width: 128px;
        }
      }
    }
  }
  .cart-icon {
    filter: invert(1);
  }
  .cart-badge {
    background: white;
    .cart-number {
      color: black;
    }
  }
  .sticky-bottom {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 0 20px;
    padding-top: 25px;
    border: 0.5px solid #c5c5c5;
    .button-flex {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      a {
        color: white;
        padding: 12px 16px;
        font-size: 1.1rem;
      }
    }
    p {
      text-transform: uppercase;
      margin: 0;
      text-align: right;
      margin-bottom: 20px;
      :first-of-type {
        font-size: 1.3rem;
      }
      :last-of-type {
        color: var(--color-grey-dark);
        text-align: center;
      }
    }
  }
  .price-quantity {
    margin-top: 20px;
    > div {
      flex: 1;
    }
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      margin: 0;
    }
  }
  .no-events {
    pointer-events: none;
    opacity: 0.5;
  }
`

const CartDrawer = () => {
  const { checkout, isCartDrawerOpen, setIsCartDrawerOpen } =
    useContext(CartContext)
  const clickRef = useRef(null)

  useClickAway(clickRef, () => {
    setIsCartDrawerOpen(false)
  })

  // React Spring
  const isBrowser = typeof window !== "undefined"
  if (!isBrowser) return null
  const { width } = useWindowSize()
  const [heightRef, height] = useHeight()
  const slideInStyles = useSpring({
    config: { ...config.default },
    from: {
      opacity: 0,
      height: 0,
      position: "fixed",
      top: 0,
      right: 0,
      transform: "translateX(0)",
      zIndex: 100000,
    },
    to: {
      position: "fixed",
      top: 0,
      right: 0,
      opacity: isCartDrawerOpen ? 1 : 0,
      height: isCartDrawerOpen ? height : 0,
      transform: isCartDrawerOpen ? "translateX(0px)" : "translateX(1000px)",
      zIndex: 100000,
    },
  })

  return (
    <animated.div style={{ ...slideInStyles }} className="animated">
      {checkout && checkout.tnLineItems.length !== 0 && (
        <Component
          style={width < 400 ? { width: `${width}px` } : {}}
          ref={clickRef}
        >
          <div className="header">
            <button onClick={evt => setIsCartDrawerOpen(false)}>
              <FaChevronRight />
            </button>
            <div className="sub-flex">
              <span>Cart</span>
              <span onClick={evt => setIsCartDrawerOpen(false)}>
                <CartIcon />
              </span>
            </div>
          </div>
          <div className="cart-products">
            {checkout &&
              checkout.tnLineItems.map((item: tnItem) => {
                if (!item.isCustom && item.lineItems.length === 1) {
                  return <ShopifyItem item={item} key={item.id} />
                } else if (!item.isCustom && item.lineItems.length === 2) {
                  return <SunglassesItem item={item} key={item.id} />
                } else {
                  return <CustomItem item={item} key={item.id} />
                }
              })}
          </div>
          <div className="sticky-bottom">
            <p>
              Subtotal: <span>${checkout.subtotalPrice} USD</span>
            </p>

            <div className="button-flex">
              <Link
                className="btn"
                to={"/"}
                onClick={evt => setIsCartDrawerOpen(false)}
              >
                CONTINUE SHOPPING
              </Link>
              <a
                className="btn"
                href={checkout.webUrl}
                onClick={evt => setIsCartDrawerOpen(false)}
              >
                CHECKOUT
              </a>
            </div>
            <p>TAXES AND SHIPPING WILL BE CALCULATED AT CHECKOUT</p>
          </div>
        </Component>
      )}
    </animated.div>
  )
}

export default CartDrawer
