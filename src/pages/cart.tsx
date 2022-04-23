import React, { useEffect, useContext, useState } from "react"
import { Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Loader from "../components/loader"
import QuantitySelector from "../components/quantity-selector"
import { CartContext } from "../contexts/cart"
import { CustomerContext } from "../contexts/customer"
import { LineItem } from "../types/checkout"
import { startedCheckoutKlaviyoEvent } from "../helpers/klaviyo"
import { VscBeaker, VscClose } from "react-icons/vsc"
import Upsell from "../components/upsell"
import { CustomProductsContext } from "../contexts/customProducts"

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
        .sub-title-customize {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          color: var(--color-grey-dark);
          span {
            font-size: 85%;
            font-family: var(--sub-heading-font);
          }
          .price {
            text-align: right;
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
    hr {
      background-color: black;
      margin-bottom: 0;
      margin: 5px 0 5px 0;
    }
  }
`

const Cart = () => {
  const {
    checkout,
    removeProductFromCart,
    updateProductInCart,
    removeProductsFromCart,
  } = useContext(CartContext)
  const [bundleState, setBundleState] = useState<any>([])
  let bundle: any = []

  const { associateCheckout } = useContext(CustomerContext)

  const stepMap = new Map()
  stepMap.set(1, "RX TYPE")
  stepMap.set(2, "LENS TYPE")
  stepMap.set(3, "LENS MATERIAL")
  stepMap.set(4, "LENS COATING")

  const { bundledCustoms, bundledDispatch } = useContext(CustomProductsContext)

  useEffect(() => {
    if (checkout) {
      if (checkout.lineItems.length > 0) {
        startedCheckoutKlaviyoEvent(checkout)
      }
      associateCheckout(checkout.id)
      // bundle customized frames
      console.log("checkout", checkout.lineItems)

      // checkout.lineItems.forEach(item => {
      //   if (item.customAttributes.length !== 0) {
      //     item.customAttributes.forEach(attr => {
      //       if (attr.key === "customizationId") {
      //         if (bundle.length === 0) {
      //           const mapItem = {
      //             id: attr.value,
      //             values: [item],
      //           }
      //           bundle.push(mapItem)
      //         } else {
      //           addToBundle(attr.value, item)
      //         }
      //       }
      //     })
      //   }
      // })
      // console.log("bundle", bundle)
      // setBundleState(bundle)
      console.log("bundled", bundledCustoms)
    }
  }, [checkout])

  const removeMultipleProducts = async lineItems => {
    const lineIds = lineItems.map(item => {
      return item.id
    })
    removeProductsFromCart(lineIds)
  }

  const updateQuantity = (lineId: string, quantity: number) => {
    updateProductInCart(lineId, quantity)
  }

  // const addToBundle = (key: string, lineItem: any) => {
  //   bundle.forEach(val => {
  //     // check if key exists in bundle
  //     if (val.id === key) {
  //       val.values.push(lineItem)
  //     }
  //     console.log("op", val)
  //   })
  // }

  // const existsInBundle = (key: string) => {
  //   bundle.forEach(item => {
  //     if (item.id === key) {
  //       return item.id
  //     }
  //   })
  //   return ""
  // }

  const totalSum = lineItems => {
    let sum = 0
    lineItems.forEach(item => {
      sum += parseFloat(item.variant.price)
    })
    return sum.toFixed(2)
  }

  const renderContent = () => {
    if (checkout) {
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
                {bundledCustoms.items.length !== 0 &&
                  bundledCustoms.items.map(item => {
                    console.log("item 1", item)
                    return (
                      <li key={item.customizationId}>
                        <div className="close-btn">
                          <a
                            className="remove-item"
                            href="#"
                            onClick={() =>
                              removeMultipleProducts(item.lineItems)
                            }
                          >
                            <VscClose />
                          </a>
                        </div>

                        <div className="card">
                          <div>
                            <GatsbyImage
                              image={item.customImage.data}
                              alt={item.customImage.altText}
                            ></GatsbyImage>
                          </div>
                          <div>
                            <div>
                              <p className="title">
                                <Link
                                  to={`/products/${item.lineItems[0].variant.product.handle}`}
                                >
                                  {item.lineItems[0].title}
                                </Link>
                              </p>
                              <div className="sub-title-customize">
                                {item.lineItems.map((subItem, subIndex) => {
                                  return (
                                    <div className="sub-item" key={subItem.id}>
                                      <div className="step-name">
                                        <p>{stepMap.get(subIndex)}</p>
                                      </div>
                                      <div
                                        className="sub-title"
                                        key={subItem.id}
                                      >
                                        <span key={subItem.id}>
                                          {subItem.title}
                                        </span>
                                        <span className="price">
                                          ${subItem.variant.price}
                                        </span>
                                      </div>
                                    </div>
                                  )
                                })}
                                <hr />
                                <span className="price total-price">
                                  ${totalSum(item.lineItems)}
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
                    )
                  })}
                {checkout?.lineItems &&
                  checkout?.lineItems.map((line: LineItem) => {
                    if (line.customAttributes.length === 0) {
                      return (
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
                      )
                    }
                  })}
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
