import React, { useContext } from "react"
import { Link } from "gatsby"
import { GatsbyImage, StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"
import { CartContext } from "../contexts/cart"
import { ShopifyProduct } from "../types/shopify"
import ProductAction from "./collection-product-action"
import Spinner from "../components/spinner"
import { useQuantityQuery } from "../hooks/useQuantityQuery"

const Component = styled.article`
  h3,
  p {
    font-family: var(--heading-font);
    text-transform: uppercase;
    font-size: 1.09rem;
    @media screen and (max-width: 600px) {
      font-size: 0.98rem;
    }
    margin-bottom: 0;
  }
  h3 {
    font-weight: normal;
    a {
      color: #000;
      text-decoration: none;
      &:visited {
        color: #000;
      }
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .product-price {
    color: var(--color-grey-dark);
  }
  .product-card {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .product-image {
    margin-bottom: 15px;
    text-align: center;
  }
  .product-container {
    position: relative;
    text-align: center;
    &:hover > a > .gatsby-image-wrapper {
      opacity: 0.7;
    }
    @media (hover: hover) {
      &:hover > .collection-product-action {
        max-height: 50px;
        height: 44px;
      }
    }
  }
`

const Product = ({ data }: { data: ShopifyProduct }) => {
  const quantityLevels = useQuantityQuery(data.handle, data.variants.length)

  const { addProductToCart, isAddingToCart } = useContext(CartContext)

  let price: any = data.priceRangeV2.minVariantPrice.amount
  price = parseFloat(price).toFixed(2)

  const handleAddToCart = () => {
    const id = data.variants[0].storefrontId
    const sku = data.variants[0].sku
    const image = data.featuredImage.localFile.childImageSharp.gatsbyImageData
    const qty = 1
    console.log("ADDING TO CART", { id, qty, sku, image })
    addProductToCart(id, qty, sku, image)
  }

  return (
    <Component>
      <div className="product-card">
        <div className="product-container">
          <Link to={`/products/${data.handle}`}>
            {data.featuredImage ? (
              <GatsbyImage
                className="product-image"
                image={
                  data.featuredImage.localFile.childImageSharp.gatsbyImageData
                }
                alt={
                  data.featuredImage.altText
                    ? data.featuredImage.altText
                    : data.title
                }
              />
            ) : (
              <StaticImage
                src="../images/no-image-placeholder.jpg"
                alt="Empty product image"
                className="product-image"
                layout="constrained"
                width={275}
                height={183}
              />
            )}
          </Link>
          {data.variants.length > 1 ? (
            <ProductAction>
              <Link to={`/products/${data.handle}`}>View Product</Link>
            </ProductAction>
          ) : (
            <ProductAction>
              {quantityLevels && quantityLevels[data.variants[0].sku] !== 0 ? (
                <button type="button" onClick={handleAddToCart}>
                  {isAddingToCart ? <Spinner /> : `Add To Cart`}
                </button>
              ) : (
                <Link to={`/products/${data.handle}`}>View Product</Link>
              )}
            </ProductAction>
          )}
        </div>
        <h3 className="product-title">
          {" "}
          <Link to={`/products/${data.handle}`}>{data.title}</Link>
        </h3>
        <p className="product-price">${price} USD</p>
      </div>
    </Component>
  )
}

export default Product
