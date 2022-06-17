import React, { useEffect, useContext, useRef } from "react"
import { Link, navigate } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Loader from "../components/loader"
import { CartContext } from "../contexts/cart"
import { CustomerContext } from "../contexts/customer"
import { tnItem } from "../types/checkout"
import { startedCheckoutGTMEvent } from "../helpers/gtm"
import UpsellCart from "../components/upsell-cart"
import { SelectedVariantStorage } from "../types/global"
import { CustomizeContext } from "../contexts/customize"

import { Page } from "../components/cart/styles"
import StandardProduct from "../components/cart/standard-product"
import GlassesProduct from "../components/cart/glasses-product"
import CustomProduct from "../components/cart/custom-product"

const Cart = () => {
  const {
    checkout,
    removeProductFromCart,
    updateProductInCart,
    removeProductsFromCart,
  } = useContext(CartContext)

  const { associateCheckout } = useContext(CustomerContext)

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
    const lineIds = item.lineItems.map(item => {
      return item.shopifyItem.id
    })

    loadingOverlay.current?.classList.add("no-events")
    await removeProductsFromCart(lineIds, item.id)
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
                  <span className="total">${checkout.subtotalPrice}</span>
                </h2>
                <ul>
                  {checkout &&
                    checkout.tnLineItems &&
                    checkout.tnLineItems.map((item: tnItem, index) => {
                      if (item) {
                        if (item.isCustom) {
                          return (
                            <CustomProduct
                              key={`cart-item-${index}`}
                              stepMap={stepMap}
                              item={item}
                              removeMultipleProducts={removeMultipleProducts}
                              editGlasses={editGlasses}
                            />
                          )
                        } else if (item.lineItems.length === 2) {
                          return (
                            <GlassesProduct
                              key={`cart-item-${index}`}
                              item={item}
                              removeMultipleProducts={removeMultipleProducts}
                            />
                          )
                        }
                        return (
                          <StandardProduct
                            key={`cart-item-${index}`}
                            item={item}
                            removeSingleProduct={removeSingleProduct}
                            updateQuantity={updateQuantity}
                          />
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
            </div>
            <section className="cart-wrapper wrapper">
              <UpsellCart />
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
