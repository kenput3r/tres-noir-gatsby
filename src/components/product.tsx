import React, { useContext } from "react"
import { Link } from "gatsby"
import { GatsbyImage, StaticImage } from "gatsby-plugin-image"
import styled from "styled-components"
import { CartContext } from "../contexts/cart"
import { ShopifyProduct } from "../types/shopify"
import ProductAction from "./collection-product-action"
import Spinner from "../components/spinner"
import { useQuantityQuery } from "../hooks/useQuantityQuery"
import { addedToCartGTMEvent } from "../helpers/gtm"
import { isDiscounted } from "../helpers/shopify"
import Badge from "./badge"

import { useDiscountedPricing } from "../hooks/useDiscountedPricing"

const Component = styled.article`
  h3,
  p,
  span {
    font-family: var(--heading-font);
    text-transform: uppercase;
    font-size: 1.1rem;
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
  .price-container {
    span {
      font-family: var(--sub-heading-font);
      @media screen and (max-width: 600px) {
        font-size: 1.1rem;
      }
      font-size: 1.15rem;
    }
    padding-top: 5px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0 4px;
  }
  .product-price {
    color: black;
  }
  .product-compare-at-price {
    color: var(--color-grey-dark);
    text-decoration: line-through;
  }
  .product-card {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .product-image {
    margin-bottom: 15px;
    text-align: center;
    position: relative;
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
  .badge-container {
    display: flex;
    padding-bottom: 8px;
  }
`

const createDiscountApiPayload = (shopifyProduct): any[] => {
  try {
    return shopifyProduct.variants.map(v => ({
      price: v.price,
      id: v.legacyResourceId,
    }))
  } catch (error) {
    return []
  }
}

const Product = ({
  data,
  collection,
}: {
  data: ShopifyProduct
  collection: string
}) => {
  console.log("DATA", JSON.stringify(data, null, 2))
  const selectedVariant = data.variants[0]
  const { discountedPrice, isApplicable, offer } = useDiscountedPricing({
    productId: data.legacyResourceId,
    prices: createDiscountApiPayload(data),
    selectedVariantId: selectedVariant.legacyResourceId,
    handle: data.handle,
  })

  console.log("DISCOUNTED PRICE", discountedPrice)
  console.log("IS APPLICABLE", isApplicable)
  console.log("OFFER", offer)

  const quantityLevels = useQuantityQuery(data.handle, data.variants.length)

  const { addProductToCart, isAddingToCart } = useContext(CartContext)

  const price: string = parseFloat(
    data.priceRangeV2.minVariantPrice.amount.toString()
  ).toFixed(2)

  const handleAddToCart = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const id = data.variants[0].storefrontId
    const sku = data.variants[0].sku
    const image = data.featuredImage.localFile.childImageSharp.gatsbyImageData
    const qty = 1
    addProductToCart(id, qty, sku, image)

    const productData = {
      title: data.title,
      legacyResourceId: data.variants[0].legacyResourceId,
      sku: data.variants[0].sku,
      productType: data.productType,
      image: data?.featuredImage?.originalSrc
        ? data.featuredImage.originalSrc
        : "",
      url: data.onlineStoreUrl,
      vendor: data.vendor,
      price: String(data.priceRangeV2.minVariantPrice.amount),
      compareAtPrice: "",
      collections: [collection],
      quantity: qty,
    }
    addedToCartGTMEvent(productData)
  }

  const getBadge = (): { label: string; color: string } | null => {
    try {
      const price = data.variants[0].price
      const compareAtPrice = data.variants[0].compareAtPrice
      if (compareAtPrice && isDiscounted(price, compareAtPrice)) {
        return {
          label: "Sale",
          color: "red",
        }
      }
      return null
    } catch (error) {
      return null
    }
  }

  const badge = getBadge()

  return (
    <Component>
      <div className="product-card">
        <div className="product-container">
          <Link to={`/products/${data.handle}`}>
            <>
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
              {badge && <Badge label={badge.label} color={badge.color} />}
              {isApplicable && (
                <div className="badge-container">
                  <Badge
                    label={offer}
                    color={"red"}
                    position="absolute"
                    top={0}
                    left={0}
                  />
                </div>
              )}
            </>
          </Link>
          {data.variants.length > 1 ? (
            <ProductAction>
              <Link to={`/products/${data.handle}`}>View Product</Link>
            </ProductAction>
          ) : (
            <ProductAction>
              {quantityLevels && quantityLevels[data.variants[0].sku] > 0 ? (
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
        {!isApplicable ? (
          <div className="price-container not-discounted">
            <span className="product-price">${price} USD</span>
            {data.variants[0].compareAtPrice &&
              isDiscounted(
                data.variants[0].price,
                data.variants[0].compareAtPrice
              ) && (
                <span className="product-compare-at-price">
                  ${data.variants[0].compareAtPrice} USD
                </span>
              )}
          </div>
        ) : (
          discountedPrice &&
          isDiscounted(discountedPrice, selectedVariant.price) && (
            <div className="price-container discounted">
              <span className="product-price">${discountedPrice} USD</span>
              <span className="product-compare-at-price">
                ${selectedVariant.price} USD
              </span>
            </div>
          )
        )}
      </div>
    </Component>
  )
}

export default Product
