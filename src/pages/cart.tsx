import React, { useEffect, useContext, useRef, useState } from "react"
import { Link, navigate } from "gatsby"
import { GatsbyImage, StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Loader from "../components/loader"
import QuantitySelector from "../components/quantity-selector"
import { CartContext } from "../contexts/cart"
import { CustomerContext } from "../contexts/customer"
import { tnItem, tnSubItem, rxType } from "../types/checkout"
import { startedCheckoutGTMEvent } from "../helpers/gtm"
import { VscClose } from "react-icons/vsc"
import UpsellCart from "../components/upsell-cart"
import { SelectedVariants, SelectedVariantStorage } from "../types/global"
import { CustomizeContext } from "../contexts/customize"
import { RxInfoContext } from "../contexts/rxInfo"

import { CART_MESSAGE } from "../utils/consts"

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(204, 204, 204, 0.6);
`

const Page = styled.div`
  .cart-message {
    border: 1px solid;
    background: white;
    text-decoration: underline;
    padding: 6px;
    text-align: center;
  }
  .cart-wrapper {
    max-width: 860px;
    width: 100%;
    padding-left: 22px;
    padding-right: 22px;
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
        padding: 5px;
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
          padding: 0 10px 20px 10px;
          > div {
            flex: 1;
            padding: 0 10px;
          }
          @media (max-width: 600px) {
            flex-direction: column;
            .card-image {
              max-width: 280px;
              align-self: center;
            }
          }
        }
        .card-items {
          .quantity-selector {
            margin-top: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .price {
              color: var(--color-grey-dark);
              font-size: 100%;
              font-family: var(--sub-heading-font);
            }
          }
        }
        .title {
          /* font-weight: bold; */
          :hover {
            text-decoration: underline;
          }
          margin-bottom: 0;
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
  .customized {
    .step-name {
      color: black;
    }
  }
  .grey-background {
    background: #e0e0e0;
  }
  .empty-cart {
    p {
      font-family: var(--heading-font);
      color: var(--color-grey-dark);
      font-size: 130%;
    }
    h1 {
      text-transform: uppercase;
      font-weight: normal;
      text-align: center;
    }
    .empty-flex {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 40px 0;
    }
  }
  .no-events {
    pointer-events: none;
    opacity: 0.5;
  }
  .checkout-loading {
    min-height: 42px;
    min-width: 165px;
    position: relative;
    @media only screen and (max-width: 468px) {
      min-height: 39px;
      min-width: 152px;
    }
    div {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .price-group {
    display: flex;
    column-gap: 10px;
    justify-content: end;
  }
  .original-price {
    text-decoration-line: line-through;
  }
`

const Cart = () => {
  const {
    checkout,
    removeProductFromCart,
    updateProductInCart,
    removeProductsFromCart,
    isRemovingFromCart,
  } = useContext(CartContext)

  const { associateCheckout } = useContext(CustomerContext)

  const { rxInfo, rxInfoDispatch } = useContext(RxInfoContext)

  const { setSelectedVariants, setCurrentStep, setHasSavedCustomized } =
    useContext(CustomizeContext)

  const stepMap = new Map()
  stepMap.set(1, "RX TYPE")
  stepMap.set(2, "LENS TYPE")
  stepMap.set(3, "LENS MATERIAL")
  stepMap.set(4, "LENS COATING")
  stepMap.set(5, "CASE")
  const loadingOverlay = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (checkout) {
      if (checkout.lineItems.length > 0) {
        startedCheckoutGTMEvent(checkout)
      }
      associateCheckout(checkout.id)
    }
  }, [checkout])

  const editGlasses = (item: tnItem) => {
    const isBrowser: boolean = typeof window !== "undefined"
    if (isBrowser) {
      const customsResume = localStorage.getItem("customs-resume")
      if (customsResume) {
        const customsStorage = JSON.parse(
          customsResume
        ) as SelectedVariantStorage
        const parsedCustoms = customsStorage.value.customs
        const resumedSelectedVariants = parsedCustoms[item.id].selectedVariants
        const handle = parsedCustoms[item.id].handle
        const sku = parsedCustoms[item.id].sku

        // grab prescription and set context
        const rxAttr = item.lineItems[1].shopifyItem.customAttributes.find(
          el => el.key === "Prescription"
        ).value
        if (rxAttr !== "Non-Prescription") {
          const prescription = JSON.parse(rxAttr) as rxType
          rxInfoDispatch({
            type: `full`,
            payload: prescription,
          })
        }
        // prepare context for editing
        // setting context
        setSelectedVariants(resumedSelectedVariants)
        // setting savedCustomized context so radio won't default to top option
        setHasSavedCustomized({
          step1: true,
          step2: true,
          step3: true,
          step4: true,
          case: true,
        })
        setCurrentStep(5)
        // navigate to step 5 of customize page
        navigate(
          `/products/${handle}/customize?variant=${sku}&custom_id=${item.id}`
        )
      }
    }
  }

  const removeMultipleProducts = async (item: tnItem) => {
    let hasDiscount = false
    const lineIds = item.lineItems.map(item => {
      if (item.shopifyItem.discountAllocations.length > 0) {
        hasDiscount = true
      }
      return item.shopifyItem.id
    })

    loadingOverlay.current?.classList.add("no-events")
    await removeProductsFromCart(lineIds, item.id, hasDiscount)
    loadingOverlay.current?.classList.remove("no-events")
  }

  const removeSingleProduct = async item => {
    loadingOverlay.current?.classList.add("no-events")
    await removeProductFromCart(item.lineItems[0].shopifyItem.id, item.id)
    loadingOverlay.current?.classList.remove("no-events")
  }

  const updateQuantity = async (
    lineId: string,
    quantity: number,
    imageId: string
  ) => {
    loadingOverlay.current?.classList.add("no-events")
    await updateProductInCart(lineId, quantity, imageId)
    loadingOverlay.current?.classList.remove("no-events")
  }

  const totalSum = lineItems => {
    let sum = 0
    lineItems.forEach(item => {
      const hasDiscount = item.shopifyItem.discountAllocations.length > 0
      let price = item.shopifyItem.variant.price.amount
      if (hasDiscount) {
        price =
          Number(price) -
          Number(item.shopifyItem.discountAllocations[0].allocatedAmount.amount)
      }
      sum += parseFloat(price)
    })
    return sum.toFixed(2)
  }

  const totalOriginalSum = lineItems => {
    let sum = 0
    lineItems.forEach(item => {
      let price = item.shopifyItem.variant.price.amount
      sum += parseFloat(price)
    })
    return sum.toFixed(2)
  }

  const checkForDiscountInBundle = (lineItems: any): boolean => {
    return lineItems.some(
      item => item.shopifyItem.discountAllocations.length > 0
    )
  }

  const priceTimesQuantity = (price: string, quantity: number) => {
    return (Number(price) * quantity).toFixed(2)
  }

  const formatItemTitle = (
    subItem: tnSubItem,
    stepName: string,
    isCustom: boolean
  ) => {
    if (subItem.stepNumber === "0" && isCustom) {
      return subItem.shopifyItem.variant.title.split("-")[0]
    }
    if (stepName === "CASE") {
      let spl = subItem.shopifyItem.title.split("AO")[0]
      return spl.slice(0, -2)
    }
    if (subItem.shopifyItem.variant.title === "Default Title") {
      return subItem.shopifyItem.title
    } else {
      return `${subItem.shopifyItem.title} - ${subItem.shopifyItem.variant.title}`
    }
  }

  const renderStandardProduct = (item: tnItem) => {
    const line = item.lineItems[0].shopifyItem
    const hasDiscount = line.discountAllocations.length > 0
    const originalPrice = line.variant.price.amount

    let price: string | number = line.variant.price.amount
    if (hasDiscount) {
      price = (
        Number(price) -
        Number(line.discountAllocations[0].allocatedAmount.amount) /
          line.quantity
      ).toString()
    }
    const discountAllocation =
      item.lineItems[0].shopifyItem.discountAllocations.length > 0
        ? item.lineItems[0].shopifyItem.discountAllocations[0].allocatedAmount
            .amount
        : 0
    const totalOriginalPrice = (
      Number(line.variant.price.amount) * line.quantity
    ).toFixed(2)
    return (
      <li key={line.id}>
        <div className="close-btn">
          <a
            className="remove-item"
            href="#"
            onClick={() => removeSingleProduct(item)}
          >
            <VscClose className="text-btn" />
          </a>
        </div>
        <div className="card">
          <div className="card-image">
            {item.image ? (
              <GatsbyImage
                image={item.image}
                alt={line.variant.title}
              ></GatsbyImage>
            ) : (
              <StaticImage
                src="../images/product-no-image.jpg"
                alt="No image"
              ></StaticImage>
            )}
          </div>
          <div className="card-items">
            <div>
              <p className="title">
                <Link to={`/products/${line.variant.product.handle}`}>
                  {line.title}
                </Link>
              </p>
              <div className="sub-title">
                <span>
                  {line.variant.title !== "Default Title"
                    ? line.variant.title
                    : ""}
                </span>
                <div className="price-group">
                  <span className="price">${Number(price).toFixed(2)}</span>
                  {hasDiscount && (
                    <span className="original-price">
                      ${Number(originalPrice).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <hr />
            <div className="quantity-selector">
              <QuantitySelector
                lineId={line.id}
                quantity={line.quantity}
                imageId={item.id}
                updateQuantity={updateQuantity}
              />
              <div className="price-group">
                <span className="price">
                  $
                  {(
                    Number(line.variant.price.amount) * line.quantity -
                    discountAllocation
                  ).toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="price original-price">
                    ${totalOriginalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </li>
    )
  }

  const renderSunglasses = (item: tnItem) => {
    const sunglassesStepMap = new Map()
    sunglassesStepMap.set(1, "CASE")
    const hasDiscount = checkForDiscountInBundle(item.lineItems)

    return (
      <li key={item.id} className="customized">
        <div className="close-btn">
          <a
            className="remove-item"
            href="#"
            onClick={() => removeMultipleProducts(item)}
          >
            <VscClose />
          </a>
        </div>
        <div className="card">
          <div className="card-image">
            {item.image ? (
              <GatsbyImage
                image={item.image}
                alt={item.lineItems[0].shopifyItem.variant.title}
              ></GatsbyImage>
            ) : (
              <StaticImage
                src="../images/product-no-image.jpg"
                alt="no-image"
              ></StaticImage>
            )}
          </div>
          <div>
            <div>
              <p className="title">
                <Link
                  to={`/products/${item.lineItems[0].shopifyItem.variant.product.handle}`}
                >
                  {item.lineItems[0].shopifyItem.title}
                </Link>
              </p>
              <div className="sub-title-customize">
                {item.lineItems.map((subItem, subIndex) => {
                  // new discounts
                  const hasDiscount =
                    subItem.shopifyItem.discountAllocations.length > 0
                  let price = subItem.shopifyItem.variant.price.amount
                  const originalPrice = subItem.shopifyItem.variant.price.amount
                  if (hasDiscount) {
                    price = (
                      Number(price) -
                      Number(
                        subItem.shopifyItem.discountAllocations[0]
                          .allocatedAmount.amount
                      )
                    ).toFixed(2)
                  }
                  // new discounts
                  return (
                    <div className="sub-item" key={subItem.shopifyItem.id}>
                      <div className="step-name">
                        <p>{sunglassesStepMap.get(subIndex)}</p>
                      </div>
                      <div className="sub-title" key={subItem.shopifyItem.id}>
                        <span key={subItem.shopifyItem.id}>
                          {formatItemTitle(
                            subItem,
                            sunglassesStepMap.get(subIndex),
                            item.isCustom
                          )}
                        </span>
                        <div className="price-group">
                          <span className="price">
                            {price === "0.00" || price === "0.0"
                              ? "Free"
                              : "$" + Number(price).toFixed(2)}
                          </span>
                          {hasDiscount && (
                            <span className="original-price">
                              ${Number(originalPrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <hr />
                <div className="price-group">
                  <span className="price total-price">
                    ${totalSum(item.lineItems)}
                  </span>
                  {hasDiscount && (
                    <span className="price original-price">
                      ${totalOriginalSum(item.lineItems)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    )
  }

  const renderCustomProduct = (item: tnItem) => {
    const hasDiscount = checkForDiscountInBundle(item.lineItems)
    return (
      <li key={item.id} className="customized">
        <div className="close-btn">
          <a
            className="remove-item"
            href="#"
            onClick={() => removeMultipleProducts(item)}
          >
            <VscClose />
          </a>
        </div>
        <div className="card">
          <div className="card-image">
            {item.image ? (
              <GatsbyImage
                image={item.image}
                alt={item.lineItems[0].shopifyItem.variant.title}
              ></GatsbyImage>
            ) : (
              <StaticImage
                src="../images/product-no-image.jpg"
                alt="no-image"
              ></StaticImage>
            )}
          </div>
          <div>
            <div>
              <p className="title">
                <Link
                  to={`/products/${item.lineItems[0].shopifyItem.variant.product.handle}`}
                >
                  {item.lineItems[0].shopifyItem.title}
                </Link>
              </p>
              <div className="sub-title-customize">
                {Array.from({ length: 6 }, (v, i) => i).map(subIndex => {
                  const subItems = item.lineItems.filter(
                    el => Number(el.stepNumber) === subIndex
                  )
                  if (subItems) {
                    return (
                      <div key={subIndex}>
                        {subItems.map((subItem, i) => {
                          // new discounts
                          const hasDiscount =
                            subItem.shopifyItem.discountAllocations.length > 0
                          let price = subItem.shopifyItem.variant.price.amount
                          const originalPrice =
                            subItem.shopifyItem.variant.price.amount
                          if (hasDiscount) {
                            price = (
                              Number(price) -
                              Number(
                                subItem.shopifyItem.discountAllocations[0]
                                  .allocatedAmount.amount
                              )
                            ).toFixed(2)
                          }
                          // new discounts
                          return (
                            <div
                              className="sub-item"
                              key={subItem.shopifyItem.id}
                            >
                              {i === 0 && (
                                <div className="step-name">
                                  <p>{stepMap.get(subIndex)}</p>
                                </div>
                              )}

                              <div
                                className="sub-title"
                                key={subItem.shopifyItem.id}
                              >
                                <span key={subItem.shopifyItem.id}>
                                  {formatItemTitle(
                                    subItem,
                                    stepMap.get(subIndex),
                                    item.isCustom
                                  )}
                                </span>
                                <div className="price-group">
                                  <span className="price">
                                    {price === "0.00" || price === "0.0"
                                      ? "Free"
                                      : "$" + Number(price).toFixed(2)}
                                  </span>
                                  {hasDiscount && (
                                    <span className="original-price">
                                      ${Number(originalPrice).toFixed(2)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  } else {
                    return null
                  }
                })}
                <hr />
                <div className="price-group">
                  <span className="price total-price">
                    ${totalSum(item.lineItems)}
                  </span>
                  {hasDiscount && (
                    <span className="price original-price">
                      ${totalOriginalSum(item.lineItems)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="edit-product">
              <button className="btn" onClick={evt => editGlasses(item)}>
                EDIT
              </button>
            </div>
          </div>
        </div>
      </li>
    )
  }

  const renderContent = () => {
    if (checkout) {
      if (checkout?.lineItems.length === 0) {
        return (
          <section className="empty-cart">
            <h1>Cart</h1>
            <div className="grey-background">
              <div className="empty-flex">
                <figure>
                  <picture>
                    <StaticImage
                      src="../images/empty-cart.png"
                      alt="Empty cart icon."
                      height={225}
                    ></StaticImage>
                  </picture>
                </figure>
                <p>Your cart is empty.</p>
                <Link to={"/"} className="btn">
                  CONTINUE SHOPPING
                </Link>
              </div>
            </div>
          </section>
        )
      } else {
        return (
          <section>
            <div className="grey-background" ref={loadingOverlay}>
              <section className="cart-items cart-wrapper wrapper">
                <h2>
                  Your cart:{" "}
                  <span className="total">
                    ${Number(checkout.subtotalPrice.amount).toFixed(2)}
                  </span>
                </h2>
                <ul>
                  {checkout &&
                    checkout.tnLineItems &&
                    checkout.tnLineItems.map((item: tnItem) => {
                      if (item) {
                        if (item.isCustom) {
                          return renderCustomProduct(item)
                        } else if (item.lineItems.length === 2) {
                          return renderSunglasses(item)
                        }
                        return renderStandardProduct(item)
                      }
                    })}
                </ul>
                <div className="subtotal">
                  <p>
                    Subtotal:{" "}
                    <span className="total">
                      ${Number(checkout.subtotalPrice.amount).toFixed(2)}
                    </span>
                  </p>
                  <p>Delivery & Taxes are calculated at checkout.</p>
                  {CART_MESSAGE && CART_MESSAGE !== "" && (
                    <p className="cart-message">{CART_MESSAGE}</p>
                  )}
                </div>
                <div className="btn-container">
                  <a href={checkout.webUrl} className="btn checkout">
                    Check Out
                  </a>
                </div>
              </section>
            </div>
            <section className="cart-wrapper wrapper">
              <UpsellCart />
            </section>
            {isRemovingFromCart && (
              <LoaderContainer>
                <Loader />
              </LoaderContainer>
            )}
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

const ItemPrice = ({
  currentPrice,
  originalPrice,
  hasDiscount,
}: {
  currentPrice: string
  originalPrice: string
  hasDiscount: boolean
}) => {
  const price =
    currentPrice === "0.0" ? "Free" : Number(currentPrice).toFixed(2)
  const ogPrice = Number(originalPrice).toFixed(2)
  return (
    <div className="price-group">
      <span className="price">${price}</span>
      {hasDiscount && <span className="original-price">${ogPrice}</span>}
    </div>
  )
}

export default Cart
