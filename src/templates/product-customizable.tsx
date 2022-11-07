import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  ChangeEvent,
} from "react"
import { Link, graphql } from "gatsby"
import { StaticImage, GatsbyImage as Img } from "gatsby-plugin-image"
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
import PolarizedTooltip from "../components/polarize/polarized-tooltip"
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
    @media screen and (max-width: 480px) {
      font-size: 2.25rem;
    }
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
        @media screen and (max-width: 480px) {
          font-size: 1.5rem;
        }
      }
      &.right {
        align-self: end;
        text-align: right;
        a {
          @media screen and (max-width: 480px) {
            font-size: 1.5rem;
          }
        }
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
    div:not(.polarized-actions) {
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
      border-radius: 0%;
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
  .polarized-actions {
    display: flex;
    align-items: center;
    column-gap: 10px;
    margin-bottom: 15px;
    span {
      font-size: 1.8rem;
      font-family: var(--sub-heading-font);
    }
    .polarized-switch {
      display: flex;
      input[type="checkbox"] {
        height: 0;
        width: 0;
        visibility: hidden;
      }

      label {
        cursor: pointer;
        text-indent: -9999px;
        width: 70px;
        height: 35px;
        background: grey;
        display: block;
        border-radius: 100px;
        position: relative;
      }

      label:after {
        content: "";
        position: absolute;
        top: 3px;
        left: 5px;
        width: 30px;
        height: 30px;
        background: #fff;
        border-radius: 90px;
        transition: 0.3s;
      }

      input:checked + label {
        background: #22b473;
      }

      input:checked + label:after {
        left: calc(100% - 5px);
        transform: translateX(-100%);
      }

      label:active:after {
        width: 20px;
      }
    }
  }
  .disable {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.2;
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

  const [selectedVariant, setSelectedVariant] = useState({
    contentful: contentfulProduct?.variants && contentfulProduct.variants[0],
    shopify: shopifyProduct.variants.find(
      (variant: any) => variant.sku === contentfulProduct.variants[0].sku
    ),
  })

  const [polarizedVariant, setPolarizedVariant] = useState({
    contentful: contentfulProduct?.variants && contentfulProduct.variants[0],
    shopify: shopifyProduct.variants.find(
      (variant: any) => variant.sku === contentfulProduct.variants[0].sku
    ),
  })
  const caseCollection = useCaseCollection()

  const [selectedCase, setSelectedCase] = useState<any>(
    caseCollection[0].variants[0]
  )

  const [showPolarizedModal, setShowPolarizedModal] = useState<boolean>(false)

  // return default Product Page if contentful values do not exist
  const quantityLevels = useQuantityQuery(
    shopifyProduct.handle,
    shopifyProduct.variants.length
  )

  // ref to toggle disable classes on buttons
  const actionsRef = useRef<HTMLDivElement>(null)

  // switch selected variant to its polarized counterpart, toggled from switch
  // grey out customize option
  const switchToPolarized = (evt: ChangeEvent<HTMLInputElement>) => {
    const customizeBtn = actionsRef.current?.querySelector("#customize-btn")
    // if switch is toggled
    if (evt.target.checked) {
      if (polarizedVariant) {
        // disable customize
        customizeBtn?.classList.add("disable")
        // set polarized variant to non polarized version
        setPolarizedVariant({
          contentful: selectedVariant.contentful,
          shopify: selectedVariant.shopify,
        })
        // set selected variant to polarized version
        setSelectedVariant({
          contentful: selectedVariant.contentful,
          shopify: polarizedVariant.shopify,
        })
      } else {
      }
    }
    // if switch is untoggled
    else {
      if (polarizedVariant) {
        // enable customize
        customizeBtn?.classList.remove("disable")
        // set polarized variant to non polarized version
        setPolarizedVariant({
          contentful: selectedVariant.contentful,
          shopify: selectedVariant.shopify,
        })
        // set selected variant to polarized version
        setSelectedVariant({
          contentful: selectedVariant.contentful,
          shopify: polarizedVariant.shopify,
        })
      }
    }
  }

  // sets polarizedVariant to the correct polarized variant for corresponding frame
  useEffect(() => {
    if (lensType === LensType.GLASSES) return
    const contentfulData = selectedVariant.contentful
    const sku = selectedVariant.shopify.sku
    const polVar = shopifyProduct.variants.find(
      _variant => _variant.sku === `${sku}PZ` || _variant.sku === `${sku}-PZ`
    )
    const polarizedToggle =
      actionsRef.current?.querySelector("#polarized-toggle")
    const customizeBtn = actionsRef.current?.querySelector("#customize-btn")
    // if current Variant is polarized
    if (selectedVariant.shopify.sku.includes("PZ")) {
    }
    // if current variant is not polarized, but has a polarized option
    else if (polVar) {
      customizeBtn?.classList.remove("disable")
      polarizedToggle?.classList.remove("disable")
      const polarizedSwitch: HTMLInputElement | null | undefined =
        polarizedToggle?.querySelector("#switch")
      if (polarizedSwitch) polarizedSwitch.checked = false
      setPolarizedVariant({
        contentful: contentfulData,
        shopify: polVar,
      })
    }
    // if current variant is not polarized and has no polarized options
    else {
      customizeBtn?.classList.remove("disable")
      polarizedToggle?.classList.add("disable")
      const polarizedSwitch: HTMLInputElement | null | undefined =
        polarizedToggle?.querySelector("#switch")
      if (polarizedSwitch) polarizedSwitch.checked = false
    }
  }, [selectedVariant])

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

  const {
    setSelectedVariantsToDefault,
    setCurrentStep,
    setHasSavedCustomized,
    setProductUrl,
  } = useContext(CustomizeContext)

  useEffect(() => {
    setProductUrl(
      `/products/${contentfulProduct.handle}/?variant=${contentfulProduct.sku}`
    )
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

  // will swap to the first available variant if selected is sold out
  useEffect(() => {
    let paramSku: null | string = null
    const isBrowser = typeof window !== "undefined"
    if (isBrowser) {
      const params = new URLSearchParams(location.search)
      if (params.get("lens_type"))
        setLensType(params.get("lens_type") || "glasses")
      if (params.get("variant")) paramSku = params.get("variant")
    }
    // if variant not supplied select first available
    if (
      !paramSku &&
      quantityLevels &&
      Object.keys(quantityLevels).length !== 0
    ) {
      const current = selectedVariant
      if (quantityLevels[current.shopify.sku] <= 0) {
        for (let key in quantityLevels) {
          if (quantityLevels[key] > 0) {
            const shopify = shopifyProduct.variants.find(
              (_variant: any) => _variant.sku === key
            )
            const contentful = contentfulProduct.variants.find(
              (_variant: any) => _variant.sku === key
            )
            if (shopify && contentful) {
              setSelectedVariant({
                contentful: contentful,
                shopify: shopify,
              })
            }
            break
          }
        }
      }
    }
  }, [quantityLevels])

  // cart
  const { addProductToCart, isAddingToCart, addSunglassesToCart } =
    useContext(CartContext)

  useEffect(() => {
    const productData = {
      title: shopifyProduct.title,
      legacyResourceId: selectedVariant.shopify.legacyResourceId,
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
  }, [])

  // click event handler for variant options
  const selectVariant = (e: React.MouseEvent, variant: any) => {
    const shopify = shopifyProduct.variants.find(
      (_variant: any) => _variant.sku === variant.sku
    )
    if (shopify) {
      setSelectedVariant({
        contentful: variant,
        shopify,
      })
      // update url
      setProductUrl(
        `/products/${contentfulProduct.handle}/?variant=${contentfulProduct.sku}`
      )
    }
  }

  const handleAddToCart = (e: { preventDefault: () => void }) => {
    e.preventDefault()
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
          legacyResourceId: selectedVariant.shopify.legacyResourceId,
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
      legacyResourceId: selectedVariant.shopify.legacyResourceId,
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

  return (
    <Layout>
      <SEO title={shopifyProduct.title} />
      <Page>
        <FreeShipping />
        <div className="row">
          <div className="col images">
            <ProductCarousel
              imageSet={
                selectedVariant?.contentful &&
                lensType === LensType.GLASSES &&
                selectedVariant.contentful.imageSetClear
                  ? selectedVariant.contentful.imageSetClear
                  : selectedVariant.contentful.imageSet
              }
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
              {selectedVariant.shopify.title !== "Default Title" && (
                <p className="selected-text-label">
                  Color:{" "}
                  <span>
                    {lensType === LensType.GLASSES
                      ? selectedVariant.shopify.title.split(" - ")[0]
                      : selectedVariant.shopify.title}
                  </span>
                </p>
              )}

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
              <div className="actions" ref={actionsRef}>
                {lensType === LensType.SUNGLASSES && (
                  <>
                    <div className="polarized-actions" id="polarized-toggle">
                      <div className="polarized-switch">
                        <input
                          type="checkbox"
                          id="switch"
                          onChange={evt => switchToPolarized(evt)}
                        />
                        <label htmlFor="switch">Toggle</label>
                      </div>
                      <span>Polarized</span>
                      <PolarizedTooltip
                        showPolarizedModal={showPolarizedModal}
                        setShowPolarizedModal={setShowPolarizedModal}
                      />
                    </div>
                  </>
                )}
                {quantityLevels &&
                quantityLevels[selectedVariant.shopify.sku] <= 0 ? (
                  <div>
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
                          id="add-to-cart-btn"
                        >
                          {isAddingToCart ? <Spinner /> : `ADD TO CART`}
                        </button>
                        <p>- OR -</p>
                      </>
                    )}

                    <Link
                      className="btn"
                      // to={contentfulProduct && customizeUrl}
                      id="customize-btn"
                      to={`/products/${
                        contentfulProduct.handle
                      }/customize?variant=${selectedVariant.shopify.sku}${
                        lensType !== LensType.SUNGLASSES
                          ? `&lens_type=${lensType}`
                          : ""
                      }`}
                    >
                      CUSTOMIZE
                    </Link>
                    <p className="small">
                      Customize for Polarized, Rx, and more
                    </p>
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
