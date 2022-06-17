import React from "react"
import { Link } from "gatsby"
import { StaticImage, GatsbyImage } from "gatsby-plugin-image"
import { VscClose } from "react-icons/vsc"
import { tnItem } from "../../types/checkout"
import { formatItemTitle, totalSum } from "./functions"

interface Props {
  stepMap: Map<any, any>
  item: tnItem
  removeMultipleProducts: (item: tnItem) => void
  editGlasses: (item: tnItem) => void
}

const CustomProduct: React.FC<Props> = ({
  stepMap,
  item,
  removeMultipleProducts,
  editGlasses,
}) => {
  const sunglassesStepMap = new Map()
  sunglassesStepMap.set(1, "CASE")
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
                    <React.Fragment key={subIndex}>
                      {subItems.map((subItem, i) => (
                        <div className="sub-item" key={subItem.shopifyItem.id}>
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
                            <span className="price">
                              {subItem.shopifyItem.variant.price === "0.00"
                                ? "Free"
                                : `$${subItem.shopifyItem.variant.price}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </React.Fragment>
                  )
                } else {
                  return null
                }
              })}
              <hr />
              <span className="price total-price">
                ${totalSum(item.lineItems)}
              </span>
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

export default CustomProduct
