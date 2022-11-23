import React, { useContext, useRef } from "react"
import { tnItem } from "../../../types/checkout"
import { GatsbyImage } from "gatsby-plugin-image"
import QuantitySelector from "../../quantity-selector"
import { CartContext } from "../../../contexts/cart"
import styled from "styled-components"
import { VscClose } from "react-icons/vsc"
import { Link } from "gatsby"

const Component = styled.div`
  .small {
    p {
      margin: none;
      font-size: 0.8rem;
    }
  }
  .price-quantity {
    justify-content: flex-end !important;
  }
`

const SunglassesItem = (props: { item: tnItem }) => {
  const { item } = props
  const { updateProductInCart, removeProductsFromCart, setIsCartDrawerOpen } =
    useContext(CartContext)

  const loadingOverlay = useRef<HTMLDivElement>(null)

  const removeMultipleProducts = async (item: tnItem) => {
    const loadingContainer = loadingOverlay.current?.closest(".cart-products")
    const lineIds = item.lineItems.map(item => {
      return item.shopifyItem.id
    })

    loadingContainer?.classList.add("no-events")
    await removeProductsFromCart(lineIds, item.id)
    loadingContainer?.classList.remove("no-events")
  }

  const totalSum = lineItems => {
    let sum = 0
    lineItems.forEach(item => {
      // new discounts
      const hasDiscount = item.shopifyItem.discountAllocations.length > 0
      let price = item.shopifyItem.variant.price
      if (hasDiscount) {
        price = (
          Number(price) -
          Number(item.shopifyItem.discountAllocations[0].allocatedAmount.amount)
        ).toFixed(2)
      }
      // new discounts
      sum += parseFloat(price)
    })
    return sum.toFixed(2)
  }

  const formatCaseName = (caseName: string) => {
    let spl = caseName.split("AO")[0]
    return spl.slice(0, -2)
  }

  return (
    <Component className="item-card" ref={loadingOverlay}>
      <div className="close-btn">
        <button
          className="remove-item"
          onClick={() => removeMultipleProducts(item)}
        >
          <VscClose />
        </button>
      </div>
      <div className="product-card">
        {item.image && (
          <div className="product-image">
            <GatsbyImage
              image={item.image}
              alt={item.lineItems[0].shopifyItem.title}
            />
          </div>
        )}

        <div>
          <div className="product-titles">
            <Link
              onClick={evt => setIsCartDrawerOpen(false)}
              to={`/products/${item.lineItems[0].shopifyItem.variant.product.handle}`}
            >
              <p className="title">{item.lineItems[0].shopifyItem.title}</p>
            </Link>
            <p className="subtitle">
              {item.lineItems[0].shopifyItem.variant.title === "Default Title"
                ? ""
                : item.lineItems[0].shopifyItem.variant.title}
            </p>
            <p className="subtitle">
              +{" "}
              {formatCaseName(
                item.lineItems[item.lineItems.length - 1].shopifyItem.title
              )}
            </p>
          </div>
          <div className="price-quantity">
            <p>${totalSum(item.lineItems)} USD</p>
          </div>
        </div>
      </div>
    </Component>
  )
}

export default SunglassesItem
