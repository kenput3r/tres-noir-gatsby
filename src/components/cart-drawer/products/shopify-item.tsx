import React, { useContext, useRef } from "react"
import { tnItem } from "../../../types/checkout"
import { GatsbyImage } from "gatsby-plugin-image"
import QuantitySelector from "../../quantity-selector"
import { CartContext } from "../../../contexts/cart"
import styled from "styled-components"
import { VscClose } from "react-icons/vsc"
import { Link } from "gatsby"

const Component = styled.div``

const ShopifyItem = (props: { item: tnItem }) => {
  const { item } = props
  const { updateProductInCart, removeProductFromCart, setIsCartDrawerOpen } =
    useContext(CartContext)

  const loadingOverlay = useRef<HTMLDivElement>(null)

  const removeSingleProduct = async item => {
    const loadingContainer = loadingOverlay.current?.closest(".cart-products")
    loadingContainer?.classList.add("no-events")
    await removeProductFromCart(item.lineItems[0].shopifyItem.id, item.id)
    loadingContainer?.classList.remove("no-events")
  }

  const updateQuantity = async (
    lineId: string,
    quantity: number,
    imageId: string
  ) => {
    const loadingContainer = loadingOverlay.current?.closest(".cart-products")
    loadingContainer?.classList.add("no-events")
    await updateProductInCart(lineId, quantity, imageId)
    loadingContainer?.classList.remove("no-events")
  }

  const discountAllocation =
    item.lineItems[0].shopifyItem.discountAllocations.length > 0
      ? item.lineItems[0].shopifyItem.discountAllocations[0].allocatedAmount
          .amount
      : 0

  const priceTimesQuantity = (price: string, quantity: number) => {
    return (Number(price) * quantity - discountAllocation).toFixed(2)
  }

  return (
    <Component className="item-card" ref={loadingOverlay}>
      <div className="close-btn">
        <button
          className="remove-item"
          onClick={() => removeSingleProduct(item)}
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
          </div>
          <div className="price-quantity">
            <QuantitySelector
              lineId={item.lineItems[0].shopifyItem.id}
              quantity={item.lineItems[0].shopifyItem.quantity}
              imageId={item.lineItems[0].shopifyItem.id}
              updateQuantity={updateQuantity}
            />
            <p>
              $
              {priceTimesQuantity(
                item.lineItems[0].shopifyItem.variant.price,
                item.lineItems[0].shopifyItem.quantity
              )}{" "}
              USD
            </p>
          </div>
        </div>
      </div>
    </Component>
  )
}

export default ShopifyItem
