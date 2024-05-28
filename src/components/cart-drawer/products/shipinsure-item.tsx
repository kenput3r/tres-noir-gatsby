import React, { useContext, useRef } from "react"
import { tnItem } from "../../../types/checkout"
import { GatsbyImage } from "gatsby-plugin-image"
import QuantitySelector from "../../quantity-selector"
import { CartContext } from "../../../contexts/cart"
import styled from "styled-components"
import { VscClose } from "react-icons/vsc"
import { Link } from "gatsby"
import { isDiscounted } from "../../../helpers/shopify"

const Component = styled.div`
  .original-price {
    text-decoration-line: line-through;
    color: var(--color-grey-dark);
  }
`
type Props = {
  item: tnItem
}
const ShipInsureItem: React.FC<Props> = ({ item }) => {
  const { setIsCartDrawerOpen, updateShipInsureAttribute } =
    useContext(CartContext)

  const loadingOverlay = useRef<HTMLDivElement>(null)

  const removeSingleProduct = async item => {
    const loadingContainer = loadingOverlay.current?.closest(".cart-products")
    loadingContainer?.classList.add("no-events")
    await updateShipInsureAttribute(false)
    loadingContainer?.classList.remove("no-events")
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
          </div>
          <div className="price-quantity">
            <div className="price-wrapper">
              <p>${item.lineItems[0].shopifyItem.variant.price.amount}</p>
            </div>
          </div>
        </div>
      </div>
    </Component>
  )
}

export default ShipInsureItem
