import React, { useState, useContext, ChangeEvent, useEffect } from "react"
import { useQuantityQuery } from "../hooks/useQuantityQuery"
import { GatsbyImage } from "gatsby-plugin-image"
import { Link } from "gatsby"
import { CartContext } from "../contexts/cart"
import styled from "styled-components"

const Component = styled.article`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px;
  text-align: center;
  @media (max-width: 600px) {
    margin: 20px 11px 20px 11px;
  }
  a {
    color: black;
    text-decoration: none;
    :visited {
      text-decoration: none;
      color: black;
    }
  }
  .btn {
    @media (max-width: 600px) {
      font-size: 0.9rem;
      padding: 8px 10px;
    }
  }
  p {
    font-family: var(--heading-font);
    text-transform: uppercase;
    margin-bottom: 5px;
  }
  .variant-select {
    font-family: var(--sub-heading-font);
  }
  .select-price {
    display: flex;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 600px) {
      flex-direction: column;
    }
    select {
      border: 1px solid #e1e3e4;
      color: #8a8f93;
      margin-right: 18px;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background: url("data:image/svg+xml;utf8,<svg viewBox='0 0 140 140' width='9' height='9' xmlns='http://www.w3.org/2000/svg'><g><path d='m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z' fill='black'/></g></svg>")
        no-repeat;
      background-position: right 5px center;
      @media screen and (max-width: 600px) {
        font-size: 0.95rem;
        margin: 0 0 8px 0;
      }
    }
    margin-bottom: 8px;
  }
`

const UpsellProduct = (props: { product: any }) => {
  const { product } = props
  const quantityLevels = useQuantityQuery(
    product.handle,
    product.variants.length
  )
  let initialVariant = product.variants[0]
  if (!product.hasOnlyDefaultVariant) {
    for (let i in quantityLevels) {
      if (quantityLevels[i] > 0) {
        initialVariant = quantityLevels[i]
        break
      }
    }
  }

  const [selectedVariant, setSelectedVariant] = useState(initialVariant)
  const { addProductToCart } = useContext(CartContext)
  const handleAddToCart = () => {
    addProductToCart(selectedVariant.storefrontId, 1)
    alert("ADDED TO CART")
  }

  const handleVariant = (evt: ChangeEvent<HTMLSelectElement>) => {
    const sku = evt.target.value
    const newVariant = product.variants.find(
      (_variant: any) => _variant.sku === sku
    )
    setSelectedVariant(newVariant)
  }

  return (
    <Component>
      <div className="upsell-product" key={product.id}>
        <Link to={`/products/${product.handle}`}>
          <div className="upsell-image">
            <GatsbyImage
              image={
                product.featuredImage.localFile.childImageSharp.gatsbyImageData
              }
              alt={product.title}
            ></GatsbyImage>
          </div>
          <div>
            <p>{product.title}</p>
          </div>
        </Link>
        <div className="select-price">
          <div>
            {!product.hasOnlyDefaultVariant && (
              <div className="variant-select">
                <div className="select-dropdown">
                  <select
                    id="product-variants"
                    onChange={evt => handleVariant(evt)}
                  >
                    {product.variants.map(element => {
                      return (
                        <option key={element.sku} value={element.sku}>
                          {element.title}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>
            )}
          </div>
          <p>${selectedVariant.price}</p>
        </div>
        <div>
          {quantityLevels && quantityLevels[selectedVariant.sku] !== 0 ? (
            <button type="button" className="btn" onClick={handleAddToCart}>
              ADD TO CART
            </button>
          ) : (
            <button type="button" className="sold-out btn">
              SOLD OUT
            </button>
          )}
        </div>
      </div>
    </Component>
  )
}

export default UpsellProduct
