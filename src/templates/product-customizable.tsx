import React, { useState, useEffect, useContext } from "react"
import { Link, graphql } from "gatsby"
import {
  StaticImage,
  GatsbyImage as Img,
  IGatsbyImageData,
} from "gatsby-plugin-image"
import styled from "styled-components"
import { useQuantityQuery } from "../hooks/useQuantityQuery"
import ProductCarousel from "../components/product-carousel"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { CartContext } from "../contexts/cart"
import {
  addedToCartGTMEvent,
  addedCustomizedToCartGTMEvent,
  viewedProductGTMEvent,
} from "../helpers/gtm"
import Product from "./product"
import { CustomizeContext } from "../contexts/customize"
import FreeShipping from "../components/free-shipping"
import Spinner from "../components/spinner"
import CaseGridSunglasses from "../components/case-grid-sunglasses"
import ProductDetails from "../components/product-contentful-details"
import { useCaseCollection } from "../hooks/useCaseCollection"
import { useFilterDuplicateFrames } from "../hooks/useFilterDuplicateFrames"

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
    @media only screen and (max-width: 768px) {
      &.mobile-reverse {
        flex-direction: column-reverse;
      }
    }
  }
  .col {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 1.45rem;
    &.images {
      flex: 1.5;
      max-width: 65%;
      @media only screen and (max-width: 1024px) {
        max-width: 50%;
      }
      @media only screen and (max-width: 768px) {
        max-width: 100%;
      }
    }
  }
  .heading {
    align-self: flex-start;
    width: 100%;
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
    width: 100%;
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
    display: flex;
    flex-direction: row;
    span {
      font-weight: normal;
      flex: 1;
      &.left {
        align-self: start;
      }
      &.right {
        align-self: end;
        text-align: right;
      }
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
  @media only screen and (max-width: 500px) {
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
  @media only screen and (max-width: 375px) {
    p.value {
      font-size: 1.75rem;
    }
  }
  @media only screen and (max-width: 320px) {
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
  contentfulProduct.variants = useFilterDuplicateFrames(
    lensType,
    contentfulProduct.variants
  )

  const [imageSet, setImageSet] = useState<any>(
    contentfulProduct.variants[0].imageSet
  )

  const [selectedVariant, setSelectedVariant] = useState({
    contentful: contentfulProduct?.variants && contentfulProduct.variants[0],
    shopify: shopifyProduct.variants.find(
      (variant: any) => variant.sku === contentfulProduct.variants[0].sku
    ),
  })

  const [customizeUrl, setCustomizeUrl] = useState<string>(
    `/products/${contentfulProduct.handle}/customize?variant=${contentfulProduct.variants[0].sku}`
  )

  const caseCollection = useCaseCollection()

  const [selectedCase, setSelectedCase] = useState<any>(
    caseCollection[0].variants[0]
  )

  // return default Product Page if contentful values do not exist
  const quantityLevels = useQuantityQuery(
    shopifyProduct.handle,
    shopifyProduct.variants.length
  )

  const getImageSet = (variant: any) => {
    let defaultImageSet: IGatsbyImageData[]
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
        defaultImageSet = variant.imageSet
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

    const sku = paramSku || null
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
    updateCustomizeUrl()
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
      case: false,
    })
    setSelectedVariantsToDefault()
  }, [])

  // cart
  const { addProductToCart, isAddingToCart, addSunglassesToCart } =
    useContext(CartContext)

  useEffect(() => {
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
    const shopify = shopifyProduct.variants.find(
      (_variant: any) => _variant.sku === variant.sku
    )
    if (shopify) {
      setSelectedVariant({
        contentful: variant,
        shopify,
      })
    }
  }

  useEffect(() => {
    updateImageSet()
    updateCustomizeUrl()
  }, [selectedVariant])

  const handleAddToCart = () => {
    const id = selectedVariant.shopify.storefrontId
    if (lensType !== LensType.GLASSES) {
      const today = new Date()
      const matchingKey: string = today.valueOf().toString()
      addSunglassesToCart(
        [
          {
            variantId: selectedVariant.shopify.storefrontId,
            quantity: 1,
            customAttributes: [
              { key: "customizationId", value: matchingKey },
              { key: "customizationStep", value: "1" },
            ],
          },
          {
            variantId: selectedCase.storefrontId,
            quantity: 1,
            customAttributes: [
              { key: "customizationId", value: matchingKey },
              { key: "customizationStep", value: "2" },
            ],
          },
        ],
        selectedVariant.contentful.imageSet[0].data,
        matchingKey
      )

      // updated to use case
      const productData = {
        main: {
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
        },
        addOns: [
          {
            title: selectedCase.title,
            legacyResourceId: selectedCase.legacyResourceId,
            sku: selectedCase.sku,
            productType: selectedCase.product.productType,
            image: selectedCase?.image?.originalSrc
              ? selectedCase.image?.originalSrc
              : "",
            url: selectedCase.product.onlineStoreUrl,
            vendor: selectedCase.product.vendor,
            price: selectedCase.price,
            compareAtPrice: "",
          },
        ],
      }
      addedCustomizedToCartGTMEvent(productData)

      return
    }
    addProductToCart(
      id,
      1,
      selectedVariant.shopify.sku,
      selectedVariant.contentful.imageSet[0].data
    )
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

  const updateCustomizeUrl = () => {
    let url = `/products/${contentfulProduct.handle}/customize?variant=${selectedVariant.shopify.sku}`
    if (lensType !== LensType.SUNGLASSES) url = `${url}&lens_type=${lensType}`
    setCustomizeUrl(url)
  }

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
                  {contentfulProduct && contentfulProduct.frameWidth.length > 1
                    ? `${contentfulProduct.frameWidth[0]} to ${
                        contentfulProduct.frameWidth[1]
                      }${" "}`
                    : `${contentfulProduct.frameWidth[0]}${" "}`}
                  fit
                </span>
              </p>
            </div>
            <form className="options">
              <p className="selected-text-label">
                Color:{" "}
                <span>
                  {lensType === LensType.GLASSES
                    ? selectedVariant.shopify.title.split(" - ")[0]
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
                  <span className="left">
                    ${selectedVariant.shopify.price} USD
                  </span>
                  <span className="right">
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
        <div className="row mobile-reverse">
          <div
            className={`col ${lensType !== LensType.GLASSES ? "images" : ""}`}
          >
            <ProductDetails
              fitDimensions={contentfulProduct.fitDimensions}
              lensColor={selectedVariant.contentful.lensColor}
              lensType={lensType}
            />
          </div>
          {lensType !== LensType.GLASSES && (
            <div className="col">
              <CaseGridSunglasses
                caseCollection={caseCollection}
                selectedCase={selectedCase}
                setSelectedCase={setSelectedCase}
                casesAvailable={contentfulProduct.casesAvailable}
              />
            </div>
          )}
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
      frameWidth
      fitDimensions
      casesAvailable
      variants {
        colorName
        sku
        colorImage {
          data: gatsbyImageData
          title
        }
        imageSet {
          data: gatsbyImageData(layout: CONSTRAINED, width: 2048, height: 1365)
          title
        }
        imageSetClear {
          data: gatsbyImageData(layout: CONSTRAINED, width: 2048, height: 1365)
          title
        }
        id
        lensColor
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
