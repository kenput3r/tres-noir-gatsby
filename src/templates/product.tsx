import React, { useState, useContext, ChangeEvent } from "react"
import { graphql } from "gatsby"
import { GatsbyImage, StaticImage } from "gatsby-plugin-image"
import { CustomerContext } from "../contexts/customer"
import { CartContext } from "../contexts/cart"
import styled from "styled-components"
import ProductCarousel from "../components/product-carousel"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { useQuantityQuery } from "../hooks/useQuantityQuery"
import { addedToCartGTMEvent } from "../helpers/gtm"
import YouMayAlsoLike from "../components/you-may-also-like"
import ProductImageGrid from "../components/product-image-grid"

const Page = styled.div`
  .shipping-message {
    text-align: center;
    .h2 {
      font-family: var(--sub-heading-font);
      font-weight: normal;
      margin-top: 0.5rem;
      margin-bottom: 0.2rem;
    }
    .h3 {
      color: var(--color-grey-dark);
      font-family: var(--sub-heading-font);
      font-weight: normal;
    }
  }
  .row {
    display: flex;
    flex-direction: row;
    width: 1280px;
    max-width: 100%;
    margin: 0 auto;
    @media (max-width: 600px) {
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
  .col {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 1.45rem;
  }
  .heading {
    align-self: flex-start;
  }
  .product-description {
    max-width: 500px;
    font-family: var(--sub-heading-font);
    color: var(--color-grey-dark);
    margin-top: 15px;
  }
  .product-dropdown {
    margin-top: 10px;
    font-family: var(--sub-heading-font);
    p {
      margin-bottom: 0;
      font-size: 0.92rem;
      color: var(--color-grey-dark);
    }
    select {
      width: 210px;
      height: 40px;
    }
  }
  h1 {
    font-weight: normal;
    font-size: 2rem;
    text-transform: uppercase;
    margin-bottom: 0;
  }
  .fit {
    color: var(--color-grey-dark);
    font-size: 1.5rem;
    text-transform: capitalize;
    span {
      float: right;
    }
  }
  .options {
    /* button {
      background-color: transparent;
      border: 1px solid #fff;
      border-radius: 50%;
      line-height: 0;
      margin-right: 5px;
      padding: 5px;
      max-width: 50px;
      &[data-active="true"] {
        border-color: #000;
      }
      :hover {
        cursor: pointer;
      }
      .gatsby-image-wrapper {
        border-radius: 50%;
      }
    } */
  }
  .selected-text-label {
    font-size: 1.5rem;
    span {
      color: var(--color-grey-dark);
      text-transform: uppercase;
    }
  }
  .price {
    font-family: var(--heading-font);
    p.value {
      font-size: 1.5rem;
    }

    margin-top: 1.45rem;
  }
  p.label {
    color: var(--color-grey-dark);
    margin-bottom: 0;
    line-height: 1.5;
  }
  .actions {
    display: flex;
    //flex-direction: column;
    //align-items: flex-start;
    column-gap: 20px;
    align-items: center;
    font-family: var(--sub-heading-font);
    div {
      display: flex;
      flex-direction: column;
    }
    .select-wrapper {
      position: relative;
      select {
        font-family: var(--sub-heading-font);
      }
    }
    p {
      color: var(--color-grey-dark);
      font-size: 1.5rem;
      text-align: center;
      margin: 12px 0;
      &.small {
        font-size: 1rem;
      }
    }
  }
  @media (max-width: 500px) {
    .shipping-message {
      .h3 {
        font-size: 1rem;
        margin-bottom: 0;
      }
    }
    .col {
      flex: none;
      width: 100%;
      &.images {
        width: 100%;
        max-width: 100%;
      }
    }
    .options {
      button {
        max-width: 45px;
      }
    }
  }
  @media (max-width: 375px) {
    p.value {
      font-size: 1.75rem;
    }
  }
  @media (max-width: 320px) {
    h1 {
      font-size: 2.25rem;
    }
    .options {
      button {
        max-width: 40px;
      }
    }
  }
  .image-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
`
const Product = ({ data: { shopifyProduct } }: any) => {
  const [selectedVariant, setSelectedVariant] = useState(
    shopifyProduct.variants[0]
  )

  const [selectedVariantQuantity, setSelectedVariantQuantity] =
    useState<string>("1")

  const quantityLevels = useQuantityQuery(
    shopifyProduct.handle,
    shopifyProduct.variants.length
  )

  const { addProductToCart, checkout } = useContext(CartContext)
  const { customerEmail } = useContext(CustomerContext)

  const handleVariant = (evt: ChangeEvent<HTMLSelectElement>) => {
    const sku = evt.target.value
    const newVariant = shopifyProduct.variants.find(
      (_variant: any) => _variant.sku === sku
    )
    setSelectedVariant(newVariant)
  }

  // const randomCollection = useMemo(
  //   () => useRandomizeCollection(shopifyProduct),
  //   []
  // )
  // const randomCollection = useRandomizeCollection(shopifyProduct)

  const quantityRange = () => {
    let minRange = 0
    if (quantityLevels) {
      minRange = quantityLevels[selectedVariant.sku]
    }
    if (minRange === 0) {
      return [0]
    }
    const range = minRange >= 10 ? 10 : minRange
    return Array.from(Array(range), (_, index) => index + 1)
  }

  const handleAddToCart = () => {
    const id = selectedVariant.storefrontId
    const qty: number = +selectedVariantQuantity
    addProductToCart(id, qty)
    alert("ADDED TO CART")

    const productData = {
      title: shopifyProduct.title,
      legacyResourceId: shopifyProduct.legacyResourceId,
      sku: selectedVariant.sku,
      productType: shopifyProduct.productType,
      image: selectedVariant?.image?.originalSrc
        ? selectedVariant.image?.originalSrc
        : shopifyProduct.featuredImage.originalSrc,
      url: shopifyProduct.onlineStoreUrl,
      vendor: shopifyProduct.vendor,
      price: selectedVariant.price,
      compareAtPrice: selectedVariant.compareAtPrice,
      collections: shopifyProduct.collections.map(
        (collection: { title: string }) => collection.title
      ),
    }
    addedToCartGTMEvent(productData)
  }

  return (
    <Layout>
      <SEO title={shopifyProduct.title} />
      <Page>
        <div className="row">
          <div className="col images">
            <ProductImageGrid product={shopifyProduct}></ProductImageGrid>
          </div>
          <div className="col">
            <div className="heading">
              <h1>{shopifyProduct.title}</h1>
              <form>
                <div className="product-dropdown">
                  {!shopifyProduct.hasOnlyDefaultVariant ? (
                    <div>
                      <p>{selectedVariant.selectedOptions[0].name}</p>
                      <div className="select-dropdown">
                        <select
                          id="product-variants"
                          onChange={evt => handleVariant(evt)}
                        >
                          {shopifyProduct.variants.map(element => {
                            return (
                              <option key={element.sku} value={element.sku}>
                                {element.title}
                              </option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                <div className="price">
                  <p className="value">${selectedVariant.price} USD</p>
                </div>
              </form>
              <div className="actions">
                <div className="select-wrapper">
                  <select
                    name="quantity"
                    id="quantity"
                    disabled={
                      quantityLevels &&
                      quantityLevels[selectedVariant.sku] === 0
                        ? true
                        : false
                    }
                    onChange={evt =>
                      setSelectedVariantQuantity(evt.target.value)
                    }
                  >
                    {quantityRange().map(el => {
                      return <option key={`quantity-${el}`}>{el}</option>
                    })}
                  </select>
                </div>
                <div>
                  {quantityLevels &&
                  quantityLevels[selectedVariant.sku] !== 0 ? (
                    <button
                      type="button"
                      className="btn"
                      onClick={handleAddToCart}
                    >
                      ADD TO CART
                    </button>
                  ) : (
                    <button type="button" className="sold-out btn">
                      SOLD OUT
                    </button>
                  )}
                </div>
              </div>
              <p className="product-description">
                {shopifyProduct.description}
              </p>
            </div>
          </div>
        </div>
        <YouMayAlsoLike shopifyProduct={shopifyProduct}></YouMayAlsoLike>
      </Page>
    </Layout>
  )
}

export default Product

export const query = graphql`
  query ProductQueryShopify($handle: String) {
    shopifyProduct(handle: { eq: $handle }) {
      collections {
        handle
        title
      }
      featuredImage {
        originalSrc
        altText
        localFile {
          id
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      description
      id
      handle
      legacyResourceId
      onlineStoreUrl
      hasOnlyDefaultVariant
      priceRangeV2 {
        minVariantPrice {
          amount
        }
        maxVariantPrice {
          amount
        }
      }
      productType
      title
      vendor
      images {
        altText
        localFile {
          id
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      variants {
        availableForSale
        compareAtPrice
        id
        image {
          originalSrc
          altText
          localFile {
            id
            childImageSharp {
              gatsbyImageData
            }
          }
        }
        selectedOptions {
          name
        }
        legacyResourceId
        price
        sku
        storefrontId
        title
      }
    }
  }
`
