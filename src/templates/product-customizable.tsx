import React, { useState, useEffect, useContext } from "react"
import { Link, graphql } from "gatsby"
import { StaticImage, GatsbyImage as Img } from "gatsby-plugin-image"
import styled from "styled-components"
import { useQuantityQuery } from "../hooks/useQuantityQuery"
import ProductCarousel from "../components/product-carousel"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { CartContext } from "../contexts/cart"
import { SelectedVariantContext } from "../contexts/selectedVariant"
import { addedToCartGTMEvent, viewedProductGTMEvent } from "../helpers/gtm"
import Product from "./product"
import { CustomizeContext } from "../contexts/customize"
import FreeShipping from "../components/free-shipping"
import Spinner from "../components/spinner"

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
    flex-wrap: wrap;
    width: 1280px;
    max-width: 100%;
    margin: 0 auto;
  }
  .col {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 1.45rem;
    &.images {
      flex: 1.5;
      max-width: 65%;
    }
  }
  .heading {
    align-self: flex-start;
  }
  h1 {
    font-weight: normal;
    font-size: 3rem;
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
    button {
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
    }
  }
  .selected-text-label {
    font-size: 1.5rem;
    span {
      color: var(--color-grey-dark);
      text-transform: uppercase;
    }
  }
  .price {
    font-family: var(--sub-heading-font);
    margin-top: 1.45rem;
  }
  p.label {
    color: var(--color-grey-dark);
    margin-bottom: 0;
    line-height: 1.5;
  }
  p.value {
    font-size: 2rem;
    span {
      float: right;
      font-weight: normal;
      a {
        color: var(--color-grey-dark);
        text-decoration: none;
      }
    }
  }
  .actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-family: var(--sub-heading-font);
    div {
      display: flex;
      flex-direction: column;
    }
    button,
    a {
      background-color: #000;
      color: #fff;
      border-radius: 0%;
      font-size: 1.5rem;
      font-weight: normal;
      line-height: 0.7;
      padding: 1rem 2rem;
      width: 100% !important;
      max-width: 100% !important;
      text-decoration: none;
      text-align: center;
      -webkit-appearance: button-bevel;
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
  .align-start {
    align-self: start;
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
    p.value {
      font-size: 1.5rem;
    }
  }
`

const ProductCustomizable = ({
  data: { contentfulProduct, shopifyProduct },
  location: any,
}: any) => {
  if (!contentfulProduct) {
    return Product({ data: { shopifyProduct } })
  }

  // check if lens type is set
  enum LensType {
    GLASSES = "glasses",
    SUNGLASSES = "sunglasses",
  }

  const [lensType, setLensType] = useState<string>("sunglasses")
  const [imageSet, setImageSet] = useState<any>(
    contentfulProduct.variants[0].imageSet
  )

  const getImageSet = (variant: any) => {
    let defaultImageSet
    switch (lensType) {
      case LensType.GLASSES:
        defaultImageSet = variant.imageSetClear
          ? variant.imageSetClear
          : variant.imageSet
        break
      case LensType.SUNGLASSES:
        defaultImageSet = variant.imageSet
        break
      case null:
        defaultImageSet = variant.imageSet
        break
      default:
        variant.imageSet
    }
    return defaultImageSet
  }

  useEffect(() => {
    let paramSku: null | string = null
    const isBrowser = typeof window !== "undefined"
    if (isBrowser) {
      const params = new URLSearchParams(location.search)
      if (params.get("lens_type"))
        setLensType(params.get("lens_type") || "glasses")
      if (params.get("variant")) paramSku = params.get("variant")
    }

    const sku = paramSku || selectedVariantContext
    if (sku) {
      const contentful = contentfulProduct.variants.find(
        (_variant: any) => _variant.sku === sku
      )
      const shopify = shopifyProduct.variants.find(
        (_variant: any) => _variant.sku === sku
      )
      if (contentful && shopify) {
        const variant = contentful
        setSelectedVariant({
          contentful: variant,
          shopify,
        })
      }
    }
  }, [])

  useEffect(() => {
    const defaultImageSet = getImageSet(contentfulProduct.variants[0])
    setImageSet(defaultImageSet)
  }, [lensType])

  const {
    setSelectedVariantsToDefault,
    setCurrentStep,
    setHasSavedCustomized,
    setProductUrl,
  } = useContext(CustomizeContext)

  useEffect(() => {
    setProductUrl(`/products/${contentfulProduct.handle}`)
    setCurrentStep(1)
    setHasSavedCustomized({
      step1: false,
      step2: false,
      step3: false,
      step4: false,
    })
    setSelectedVariantsToDefault()
  }, [])

  // return default Product Page if contentful values do not exist
  const quantityLevels = useQuantityQuery(
    shopifyProduct.handle,
    shopifyProduct.variants.length
  )
  const { selectedVariantContext, setSelectedVariantContext } = useContext(
    SelectedVariantContext
  )

  const [selectedVariant, setSelectedVariant] = useState({
    contentful: contentfulProduct?.variants && contentfulProduct.variants[0],
    shopify: shopifyProduct.variants.find(
      (variant: any) => variant.sku === contentfulProduct.variants[0].sku
    ),
  })

  // cart
  const { addProductToCart, isAddingToCart } = useContext(CartContext)

  useEffect(() => {
    console.log("SELECTED VARIANT CHANGED", selectedVariant)
    const productData = {
      title: shopifyProduct.title,
      legacyResourceId: shopifyProduct.legacyResourceId,
      sku: selectedVariant.shopify.sku,
      productType: shopifyProduct.productType,
      image: selectedVariant?.shopify?.image?.originalSrc
        ? selectedVariant.shopify.image?.originalSrc
        : shopifyProduct.featuredImage.originalSrc,
      url: shopifyProduct.onlineStoreUrl,
      vendor: shopifyProduct.vendor,
      price: selectedVariant.shopify.price,
      compareAtPrice: selectedVariant.shopify.compareAtPrice,
      collections: shopifyProduct.collections.map(
        (collection: { title: string }) => collection.title
      ),
    }
    viewedProductGTMEvent(productData)
  }, [selectedVariant])

  const selectVariant = (e: React.MouseEvent, variant: any) => {
    console.log("RUNNING SELECT VARIANT", variant)
    // e.currentTarget && (e.currentTarget as HTMLElement).blur()
    const shopify = shopifyProduct.variants.find(
      (_variant: any) => _variant.sku === variant.sku
    )
    if (shopify) {
      setSelectedVariant({
        contentful: variant,
        shopify,
      })
      setSelectedVariantContext(variant.sku)
    }
  }

  useEffect(() => {
    updateImageSet()
  }, [selectedVariant])

  const handleAddToCart = () => {
    const id = selectedVariant.shopify.storefrontId
    addProductToCart(
      id,
      1,
      selectedVariant.shopify.sku,
      selectedVariant.contentful.imageSet[0].data
    )
    // alert("ADDED TO CART")
    const productData = {
      title: shopifyProduct.title,
      legacyResourceId: shopifyProduct.legacyResourceId,
      sku: selectedVariant.shopify.sku,
      productType: shopifyProduct.productType,
      image: selectedVariant?.shopify?.image?.originalSrc
        ? selectedVariant.shopify.image?.originalSrc
        : shopifyProduct.featuredImage.originalSrc,
      url: shopifyProduct.onlineStoreUrl,
      vendor: shopifyProduct.vendor,
      price: selectedVariant.shopify.price,
      compareAtPrice: selectedVariant.shopify.compareAtPrice,
      collections: shopifyProduct.collections.map(
        (collection: { title: string }) => collection.title
      ),
      quantity: 1,
    }
    addedToCartGTMEvent(productData)
  }

  const updateImageSet = () => {
    const defaultImageSet = getImageSet(selectedVariant.contentful)
    setImageSet(defaultImageSet)
  }

  let customizeUrl = `/products/${contentfulProduct.handle}/customize?variant=${selectedVariant.shopify.sku}`
  if (lensType !== LensType.SUNGLASSES)
    customizeUrl = `${customizeUrl}&lens_type=${lensType}`

  console.log("CUSTOMIZE URL", customizeUrl)

  return (
    <Layout>
      <SEO title={shopifyProduct.title} />
      <Page>
        <FreeShipping />
        <div className="row">
          <div className="col images">
            <ProductCarousel
              imageSet={selectedVariant?.contentful && imageSet}
            />
          </div>
          <div className="col">
            <div className="heading">
              <h1>{shopifyProduct.title}</h1>
              <p className="fit">
                Size: {contentfulProduct && contentfulProduct.fitDimensions}{" "}
                <span>
                  {contentfulProduct &&
                  contentfulProduct.fitType === "medium (average)"
                    ? "medium"
                    : contentfulProduct && contentfulProduct.fitType}{" "}
                  fit
                </span>
              </p>
            </div>
            <form className="options">
              <p className="selected-text-label">
                Color:{" "}
                <span>
                  {lensType === LensType.GLASSES
                    ? selectedVariant.shopify.title.replace("- Smoke Lens", "")
                    : selectedVariant.shopify.title}
                </span>
              </p>
              <div className="buttons">
                {contentfulProduct &&
                  contentfulProduct.variants.map((variant: any) => (
                    <button
                      key={variant.id}
                      type="button"
                      data-active={variant.id === selectedVariant.contentful.id}
                      onClick={e => selectVariant(e, variant)}
                      aria-label={`Color option ${variant.colorImage.title}`}
                      aria-pressed={
                        variant.id === selectedVariant.contentful.id
                          ? "true"
                          : "false"
                      }
                    >
                      {variant.colorImage ? (
                        <Img
                          image={variant.colorImage.data}
                          alt={variant.colorImage.title}
                        />
                      ) : (
                        <StaticImage
                          src="../images/empty-color.png"
                          alt="Tres Noir"
                          placeholder="tracedSVG"
                          layout="constrained"
                        />
                      )}
                    </button>
                  ))}
              </div>
              <div className="price">
                <p className="label">STARTING AT</p>
                <p className="value">
                  ${selectedVariant.shopify.price} USD
                  <span>
                    <Link
                      to={contentfulProduct && `/${contentfulProduct.handle}`}
                    >
                      Learn More {`>`}
                    </Link>
                  </span>
                </p>
              </div>
              <div className="actions">
                {quantityLevels &&
                quantityLevels[selectedVariant.shopify.sku] === 0 ? (
                  <div className="align-start">
                    <button type="button" className="sold-out">
                      SOLD OUT
                    </button>
                  </div>
                ) : (
                  <div>
                    {lensType !== LensType.GLASSES && (
                      <>
                        {" "}
                        <button
                          type="button"
                          onClick={handleAddToCart}
                          className="add-to-cart btn"
                          disabled={isAddingToCart}
                        >
                          {isAddingToCart ? <Spinner /> : `ADD TO CART`}
                        </button>
                        <p>- OR -</p>
                      </>
                    )}

                    <Link
                      className="btn"
                      to={contentfulProduct && customizeUrl}
                    >
                      CUSTOMIZE
                    </Link>
                    <p className="small">Click for Polarized, Rx, and more</p>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </Page>
    </Layout>
  )
}

export default ProductCustomizable

export const query = graphql`
  query ProductQuery($handle: String) {
    contentfulProduct(handle: { eq: $handle }) {
      handle
      fitType
      fitDimensions
      variants {
        colorName
        sku
        colorImage {
          data: gatsbyImageData
          title
        }
        imageSet {
          data: gatsbyImageData(
            layout: CONSTRAINED
            placeholder: BLURRED
            width: 2048
            height: 1365
          )
          title
        }
        imageSetClear {
          data: gatsbyImageData(
            layout: CONSTRAINED
            placeholder: BLURRED
            width: 2048
            height: 1365
          )
          title
        }
        id
      }
    }
    shopifyProduct(handle: { eq: $handle }) {
      collections {
        handle
        title
      }
      featuredImage {
        originalSrc
        altText
        localFile {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
      id
      handle
      legacyResourceId
      onlineStoreUrl
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
      variants {
        availableForSale
        compareAtPrice
        id
        image {
          originalSrc
          altText
          localFile {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
        legacyResourceId
        price
        sku
        storefrontId
        title
        selectedOptions {
          name
        }
      }
    }
  }
`
