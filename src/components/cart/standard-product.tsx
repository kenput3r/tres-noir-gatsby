import React from "react"
import { Link } from "gatsby"
import { StaticImage, GatsbyImage } from "gatsby-plugin-image"
import { VscClose } from "react-icons/vsc"
import { tnItem } from "../../types/checkout"
import QuantitySelector from "../quantity-selector"
import { priceTimesQuantity } from "./functions"

interface Props {
  item: tnItem
  removeSingleProduct: (item: tnItem) => void
  updateQuantity: (lineId: string, quantity: number, imageId: string) => void
}

const StandardProduct: React.FC<Props> = ({
  item,
  removeSingleProduct,
  updateQuantity,
}) => {
  const line = item.lineItems[0].shopifyItem
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

              <span className="price">${line.variant.price}</span>
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
            <span className="price total-price">
              ${priceTimesQuantity(line.variant.price, line.quantity)}
            </span>
          </div>
        </div>
      </div>
    </li>
  )
}

export default StandardProduct
