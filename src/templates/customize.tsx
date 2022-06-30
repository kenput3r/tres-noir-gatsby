import React, { useContext, useEffect, useState, useRef } from "react"
import { graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import styled from "styled-components"
import Layout from "../components/layout"
import SEO from "../components/seo"
import CustomizationProgress from "../components/customization/progress"
import Step1 from "../components/customization/step1"
import Step2 from "../components/customization/step2"
import Step3 from "../components/customization/step3"
import Step4 from "../components/customization/step4"
import Step5 from "../components/customization/step5"
import { CustomizeContext } from "../contexts/customize"
import { changeImage } from "../components/customization/functions"
import {
  ContentfulProduct,
  ContentfulProductVariant,
  ShopifyProduct,
  ShopifyProductVariant,
} from "../types/customize"
import { ImageStorage } from "../types/checkout"

const Page = styled.div`
  .row {
    display: flex;
    flex-direction: row;
    @media only screen and (max-width: 760px) {
      &.product-customize {
        display: block;
      }
    }
  }
  .col {
    display: flex;
    flex-direction: column;
    &.preview {
      flex: 1.2;
      .gatsby-image-wrapper {
        position: sticky;
        top: 1px;
      }
    }
    &.steps {
      flex: 1;
    }
  }
  .current-price {
    text-align: right;
    span {
      background-color: var(--color-grey-dark);
      color: #fff;
      display: inline-block;
      font-family: var(--sub-heading-font);
      padding: 5px;
    }
  }
  .mobile {
    display: none;
    @media screen and (max-width: 760px) {
      display: block;
    }
  }
  .desktop {
    display: block;
    @media screen and (max-width: 760px) {
      display: none;
    }
  }
  .sticky-mobile {
    @media screen and (max-width: 760px) {
      position: sticky;
      top: 0;
      z-index: 100;
      background: white;
      padding-bottom: 5px;
      display: flex;
    }
  }
  /* .button-row {
    @media screen and (max-width: 760px) {
      position: fixed;
      bottom: 0;
      width: 100vw;
      display: flex;
    }
    background-color: white;
  } */
`

const Customize = ({
  data: { contentfulProduct, shopifyProduct },
}: {
  data: {
    contentfulProduct: ContentfulProduct
    shopifyProduct: ShopifyProduct
  }
}) => {
  const { currentStep, setProductUrl, selectedVariants } =
    useContext(CustomizeContext)
  const [variant, setVariant] = useState({
    contentful: contentfulProduct?.variants && contentfulProduct.variants[0],
    shopify: shopifyProduct.variants[0],
  })
  const [currentPrice, setCurrentPrice] = useState(
    shopifyProduct.variants[0].price
  )
  const [currentImage, setCurrentImage] = useState({
    data: variant?.contentful && variant.contentful.customizations?.clear.data,
    altText:
      variant?.contentful && variant.contentful.customizations?.clear.title,
  })
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isBrowser = typeof window !== "undefined"
    if (!isBrowser) return
    const urlParams = new URLSearchParams(window.location.search)
    const sku = urlParams.get("variant")
    const lensType = urlParams.get("lens_type")
    const contentful = contentfulProduct.variants.find(
      (_variant: ContentfulProductVariant) => _variant.sku === sku
    )
    const shopify = shopifyProduct.variants.find(
      (_variant: ShopifyProductVariant) => _variant.sku === sku
    )
    if (contentful && shopify) {
      const _variant = { contentful, shopify }
      setVariant(_variant)
      let handle = `/products/${contentfulProduct.handle}?variant=${contentful.sku}`
      if (lensType) handle = `${handle}&lens_type=${lensType}`
      setProductUrl(handle)
      // if (previewRef.current) {
      //   const previewImage = previewRef.current.querySelector(
      //     ".gatsby-image-wrapper img[data-main-image]"
      //   )
      //   // previewImage.addEventListener("loadstart", function (e) {
      //   //   console.log("Preview Image Load Started")
      //   // })
      //   // previewImage.addEventListener("loadend", function (e) {
      //   //   console.log("Preview Image Load Ended")
      //   // })
      // }
    }
  }, [
    contentfulProduct?.handle,
    contentfulProduct?.variants,
    // setProductUrl,
    shopifyProduct.variants,
  ])

  /* UPDATE PRICING */
  useEffect(() => {
    let { price } = variant.shopify
    Object.keys(selectedVariants).forEach(key => {
      price = Number(price)
      // step 4 has multiple values
      if (key === "step4") {
        selectedVariants[key].forEach(el => {
          price += Number(el.price)
        })
      } else {
        price += Number(selectedVariants[key].price)
      }
    })
    price = Number(price.toFixed(2))
    setCurrentPrice(price)
    changeImage(
      currentStep,
      selectedVariants,
      // currentImage,
      setCurrentImage,
      variant
    )
  }, [variant, selectedVariants, currentStep])

  useEffect(() => {
    const isBrowser = typeof window !== "undefined"
    if (!isBrowser) return
    const urlParams = new URLSearchParams(window.location.search)
    const customId = urlParams.get("custom_id")
    if (customId) {
      // using customizationId as a url param, this will grab the edited item's image and set it
      const customImageStorage = localStorage.getItem("cart-images")
      if (customImageStorage) {
        const customImageLocal = JSON.parse(customImageStorage) as ImageStorage
        const parsedCustoms = customImageLocal.value
        const correctImage = parsedCustoms.images[customId]
        if (correctImage) {
          setCurrentImage({
            data: correctImage,
            altText: "Customized frames",
          })
        }
      }
    }
  }, [])

  const getResumedItem = () => {
    const isBrowser = typeof window !== "undefined"
    if (!isBrowser) return
    const urlParams = new URLSearchParams(window.location.search)
    const customId = urlParams.get("custom_id")
    return customId
  }

  return (
    <Layout>
      <SEO title="customize" />
      <Page>
        <div className="row product-customize">
          <div className="desktop col preview" ref={previewRef}>
            <GatsbyImage
              image={currentImage.data}
              alt={currentImage.altText}
              loading="eager"
            />
          </div>
          {/* div for sticky mobile */}
          <div className="mobile col sticky-mobile" ref={previewRef}>
            <GatsbyImage
              image={currentImage.data}
              alt={currentImage.altText}
              loading="eager"
            />
            <CustomizationProgress step={currentStep} />
          </div>
          <div className="col steps">
            <div className="desktop">
              <CustomizationProgress step={currentStep} />
            </div>
            <p className="current-price">
              <span>${currentPrice}</span>
            </p>
            <div className="current-step">
              {currentStep === 1 && <Step1 />}
              {currentStep === 2 && <Step2 />}
              {currentStep === 3 && <Step3 />}
              {currentStep === 4 && <Step4 />}
              {currentStep === 5 && (
                <Step5
                  productTitle={shopifyProduct.title}
                  variant={variant.shopify}
                  currentPrice={currentPrice}
                  productImage={currentImage.data}
                  resumedItem={getResumedItem()}
                  completeVariant={variant}
                  casesAvailable={contentfulProduct.casesAvailable}
                />
              )}
            </div>
          </div>
        </div>
      </Page>
    </Layout>
  )
}

export default Customize

export const query = graphql`
  query CustomizeQuery($handle: String) {
    contentfulProduct(handle: { eq: $handle }) {
      handle
      fitDimensions
      casesAvailable
      variants {
        colorName
        sku
        colorImage {
          data: gatsbyImageData
          title
        }
        customizations {
          bifocal {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          bifocalGradientTintSmokeLenses {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          bifocalGradientTintBrownLenses {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          bifocalGradientTintG15Lenses {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          clear {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          gradientTintSmokeLenses {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          gradientTintBrownLenses {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          gradientTintG15Lenses {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          sunGlassesSmokeLenses {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          sunGlassesBrownLenses {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          sunGlassesGreenLenses {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          sunGlassesOrangeLenses {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          sunGlassesYellowLenses {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          sunGlassesBlueLenses {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          sunGlassesG15Lenses {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          sunGlassesSmokeLensesBifocal {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          sunGlassesBrownLensesBifocal {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          sunGlassesGreenLensesBifocal {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          sunGlassesOrangeLensesBifocal {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          sunGlassesYellowLensesBifocal {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          sunGlassesBlueLensesBifocal {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
          sunGlassesG15LensesBifocal {
            data: gatsbyImageData(
              placeholder: TRACED_SVG
              quality: 60
              width: 800
            )
            title
          }
        }
        featuredImage {
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
        id
      }
    }
    shopifyProduct(handle: { eq: $handle }) {
      priceRangeV2 {
        minVariantPrice {
          amount
        }
        maxVariantPrice {
          amount
        }
      }
      title
      variants {
        availableForSale
        compareAtPrice
        id
        legacyResourceId
        price
        sku
        storefrontId
        title
        product {
          handle
          onlineStoreUrl
          productType
          collections {
            handle
            title
          }
        }
      }
    }
  }
`
