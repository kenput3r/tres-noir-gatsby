import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react"
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
// import Product from "../components/product"

const Page = styled.div`
  .row {
    display: flex;
    flex-direction: row;
    @media only screen and (max-width: 750px) {
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
    const contentful = contentfulProduct.variants.find(
      (_variant: ContentfulProductVariant) => _variant.sku === sku
    )
    const shopify = shopifyProduct.variants.find(
      (_variant: ShopifyProductVariant) => _variant.sku === sku
    )
    if (contentful && shopify) {
      const _variant = { contentful, shopify }
      setVariant(_variant)
      setProductUrl(`/products/${contentfulProduct.handle}`)
      if (previewRef.current) {
        const previewImage = previewRef.current.querySelector(
          ".gatsby-image-wrapper img[data-main-image]"
        )
        // previewImage.addEventListener("loadstart", function (e) {
        //   console.log("Preview Image Load Started")
        // })
        // previewImage.addEventListener("loadend", function (e) {
        //   console.log("Preview Image Load Ended")
        // })
      }
    }
  }, [
    contentfulProduct?.handle,
    contentfulProduct?.variants,
    setProductUrl,
    shopifyProduct.variants,
  ])

  /* UPDATE PRICING */
  useEffect(() => {
    let { price } = variant.shopify
    Object.keys(selectedVariants).forEach(key => {
      // @ts-ignore
      // price += selectedVariants[key].price
      // convert everything to int and divide by 100 at the end
      // price = Number(price.toFixed(2)) * 100
      // price += selectedVariants[key].price * 100
      // price /= 100
      price = Number(price)
      price += Number(selectedVariants[key].price)
    })
    setCurrentPrice(price)
    changeImage(
      currentStep,
      selectedVariants,
      // currentImage,
      setCurrentImage,
      variant
    )
  }, [variant, selectedVariants, currentStep])

  return (
    <Layout>
      <SEO title="customize" />
      <Page>
        <div className="row product-customize">
          <div className="col preview" ref={previewRef}>
            <GatsbyImage
              image={currentImage.data}
              alt={currentImage.altText}
              loading="eager"
            />
          </div>
          <div className="col steps">
            <CustomizationProgress step={currentStep} />
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
      fitType
      fitDimensions
      variants {
        colorName
        sku
        colorImage {
          data: gatsbyImageData
          title
        }
        customizations {
          bifocal {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          bifocalGradientTintSmokeLenses {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          bifocalGradientTintBrownLenses {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          bifocalGradientTintG15Lenses {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          clear {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          gradientTintSmokeLenses {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          gradientTintBrownLenses {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          gradientTintG15Lenses {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          sunGlassesSmokeLenses {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          sunGlassesBrownLenses {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          sunGlassesGreenLenses {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          sunGlassesOrangeLenses {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          sunGlassesYellowLenses {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          sunGlassesBlueLenses {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          sunGlassesG15Lenses {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          sunGlassesSmokeLensesBifocal {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          sunGlassesBrownLensesBifocal {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          sunGlassesGreenLensesBifocal {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          sunGlassesOrangeLensesBifocal {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          sunGlassesYellowLensesBifocal {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          sunGlassesBlueLensesBifocal {
            data: gatsbyImageData(placeholder: TRACED_SVG)
            title
          }
          sunGlassesG15LensesBifocal {
            data: gatsbyImageData(placeholder: TRACED_SVG)
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
        price
        sku
        storefrontId
        title
      }
    }
  }
`
