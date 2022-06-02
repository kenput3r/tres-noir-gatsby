import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { GatsbyImage, StaticImage, IGatsbyImageData } from "gatsby-plugin-image"
import { CustomizeContext } from "../../contexts/customize"
import { CartContext } from "../../contexts/cart"
import { RxInfoContext } from "../../contexts/rxInfo"
import { addedCustomizedToCartGTMEvent } from "../../helpers/gtm"
import { ShopifyProductVariant } from "../../types/customize"

const Component = styled.div`
  padding: 10px;
  .product-option {
    background-color: var(--color-grey-light);
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    margin-bottom: 5px;
    padding: 10px;
    position: relative;
    &.with-variants {
      flex-wrap: wrap;
    }
    > div {
      padding: 0 10px;
    }
    p {
      line-height: 1;
      margin-bottom: 0;
    }
    .gatsby-image-wrapper {
      max-width: 40px;
      max-height: 40px;
    }
    img {
      align-self: center;
    }
    .product-description {
      max-width: calc(100% - 65px);
      min-height: 40px;
    }
    h4,
    h6 {
      font-family: var(--sub-heading-font);
      margin-bottom: 0;
      text-transform: uppercase;
    }
    .edit-btn {
      background-color: transparent;
      color: #000;
      border: none;
      top: 0;
      bottom: 0;
      right: 0;
      position: absolute;
      z-index: 2;
    }
  }
  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  button,
  .button {
    background-color: #000;
    border-radius: 0;
    border: 1px solid #000;
    color: #fff;
    display: block;
    font-family: var(--sub-heading-font);
    padding: 10px 20px;
    text-decoration: none;
    :hover {
      cursor: pointer;
    }
  }
  .summary {
    color: var(--color-grey-dark);
    text-transform: uppercase;
    text-align: right;
    font-size: 1rem;
    line-height: 1.1rem;
    padding: 0.5rem 0;
    p {
      margin-bottom: 0.2rem;
      span {
        margin-left: 0.75rem;
      }
    }
  }
  .edit-btn {
    background-color: transparent;
    color: #000;
    border: none;
  }
`

const Step5 = (props: {
  productTitle: string
  currentPrice: any
  variant: ShopifyProductVariant
  productImage: any
  resumedItem: any
  completeVariant: any
}) => {
  const {
    productTitle,
    currentPrice,
    variant,
    productImage,
    resumedItem,
    completeVariant,
  } = props
  const {
    currentStep,
    setCurrentStep,
    productUrl,
    selectedVariants,
    setSelectedVariants,
    setSelectedVariantsToDefault,
  } = useContext(CustomizeContext)

  // const { bundledCustoms, bundledDispatch } = useContext(CustomProductsContext)
  const { addProductCustomToCart, removeCustomProductWithId } =
    useContext(CartContext)
  const { isRxAble, setRxAble, rxInfo, rxInfoDispatch } =
    useContext(RxInfoContext)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    return () => {
      if (addedToCart) {
        setCurrentStep(1)
        setSelectedVariantsToDefault()
      }
    }
  }, [addedToCart])

  const handleAddToCart = async () => {
    const { step1, step2, step3, step4 } = selectedVariants

    const today = new Date()
    const matchingKey: string = today.valueOf().toString()
    const stepItems = [
      {
        variantId: step1.storefrontId,
        quantity: 1,
        customAttributes: [
          {
            key: "customizationId",
            value: matchingKey,
          },
          {
            key: "customizationStep",
            value: "1",
          },
          {
            key: "Prescription",
            value:
              step1.product.title !== "Non-Prescription Lens"
                ? JSON.stringify(rxInfo)
                : "Non-Prescription",
          },
        ],
      },
      {
        variantId: step2.storefrontId,
        quantity: 1,
        customAttributes: [
          {
            key: "customizationId",
            value: matchingKey,
          },
          {
            key: "customizationStep",
            value: "2",
          },
        ],
      },
      {
        variantId: step3.storefrontId,
        quantity: 1,
        customAttributes: [
          {
            key: "customizationId",
            value: matchingKey,
          },
          {
            key: "customizationStep",
            value: "3",
          },
        ],
      },
      {
        variantId: step4.storefrontId,
        quantity: 1,
        customAttributes: [
          {
            key: "customizationId",
            value: matchingKey,
          },
          {
            key: "customizationStep",
            value: "4",
          },
        ],
      },
    ]
    const frameVariant = {
      variantId: variant.storefrontId,
      quantity: 1,
      customAttributes: [
        {
          key: "customizationId",
          value: matchingKey,
        },
        {
          key: "customizationStep",
          value: "0",
        },
      ],
    }
    stepItems.unshift(frameVariant)
    if (resumedItem) {
      await removeCustomProductWithId(resumedItem)
    }
    addProductCustomToCart(
      stepItems,
      matchingKey,
      productImage,
      selectedVariants,
      variant.sku,
      variant.product.handle
    )
    setAddedToCart(true)

    // GTM Event
    const productData = {
      main: {
        collections: variant.product.collections.map(
          (collection: { title: string }) => collection.title
        ),
        compareAtPrice: "",
        image: variant?.image?.originalSrc ? variant.image?.originalSrc : "",
        legacyResourceId: variant.legacyResourceId,
        price: variant.price,
        productType: variant.product.productType,
        sku: variant.sku,
        title: variant.title,
        url: variant.product.onlineStoreUrl,
        vendor: variant.product.vendor,
      },
      addOns: [
        {
          title: step1.title,
          legacyResourceId: step1.legacyResourceId,
          sku: step1.sku,
          productType: step1.product.productType,
          image: step1?.image?.originalSrc ? step1.image?.originalSrc : "",
          url: step1.product.onlineStoreUrl,
          vendor: step1.product.vendor,
          price: step1.price,
          compareAtPrice: "",
        },
        {
          title: step2.title,
          legacyResourceId: step2.legacyResourceId,
          sku: step2.sku,
          productType: step2.product.productType,
          image: step1?.image?.originalSrc ? step2.image?.originalSrc : "",
          url: step2.product.onlineStoreUrl,
          vendor: step2.product.vendor,
          price: step2.price,
          compareAtPrice: "",
        },
        {
          title: step3.title,
          legacyResourceId: step3.legacyResourceId,
          sku: step3.sku,
          productType: step3.product.productType,
          image: step3?.image?.originalSrc ? step3.image?.originalSrc : "",
          url: step3.product.onlineStoreUrl,
          vendor: step3.product.vendor,
          price: step3.price,
          compareAtPrice: "",
        },
        {
          title: step4.title,
          legacyResourceId: step4.legacyResourceId,
          sku: step4.sku,
          productType: step4.product.productType,
          image: step4?.image?.originalSrc ? step4.image?.originalSrc : "",
          url: step4.product.onlineStoreUrl,
          vendor: step4.product.vendor,
          price: step4.price,
          compareAtPrice: "",
        },
      ],
    }
    addedCustomizedToCartGTMEvent(productData)
  }

  return (
    <Component>
      <p>REVIEW YOUR CUSTOM GLASSES</p>

      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="product-option">
          <GatsbyImage
            image={
              selectedVariants[`step${i + 1}`].image.localFile.childImageSharp
                .gatsbyImageData as IGatsbyImageData
            }
            alt={
              selectedVariants[`step${i + 1}`].image.altText || "Placeholder"
            }
          />
          <div className="product-description">
            <h4>
              {selectedVariants[`step${i + 1}`].product.title}{" "}
              <span className="price">+ ${selectedVariants.step4.price}</span>
            </h4>
            <p>{selectedVariants[`step${i + 1}`].product.description}</p>
          </div>

          <button
            className="edit-btn"
            type="button"
            onClick={() => setCurrentStep(i + 1)}
          >
            <StaticImage
              src="../../images/edit.png"
              alt="Edit Line Item"
              placeholder="tracedSVG"
              style={{ marginBottom: 0, maxWidth: 26 }}
            />
          </button>
        </div>
      ))}

      <div className="summary">
        <p className="title">
          <span>Customized: </span>{" "}
          <span>
            {productTitle} - {variant.title}
          </span>
        </p>
        <p className="substotal">
          <span>Sub-Total: </span> <span>${currentPrice}</span>
        </p>
      </div>
      <div className="row">
        <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
          GO BACK
        </button>
        <button type="button" onClick={handleAddToCart} className="add-to-cart">
          ADD TO CART
        </button>
      </div>
    </Component>
  )
}

export default Step5
