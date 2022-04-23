import React, { useContext } from "react"
import styled from "styled-components"
import { GatsbyImage, StaticImage, IGatsbyImageData } from "gatsby-plugin-image"
import { CustomizeContext } from "../../contexts/customize"
import { CartContext } from "../../contexts/cart"
import { RxInfoContext } from "../../contexts/rxInfo"
import { CustomProductsContext } from "../../contexts/customProducts"

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
  currentPrice: number
  variant: any
  productImage: any
}) => {
  const { productTitle, currentPrice, variant, productImage } = props
  console.log(props)
  const {
    currentStep,
    setCurrentStep,
    productUrl,
    selectedVariants,
    setSelectedVariants,
  } = useContext(CustomizeContext)

  const { bundledCustoms, bundledDispatch } = useContext(CustomProductsContext)
  const {
    addProductToCart,
    addProductsToCart,
    addProductPrescription,
    addProductCustomToCart,
  } = useContext(CartContext)
  const { isRxAble, setRxAble, rxInfo, dispatch } = useContext(RxInfoContext)

  const addToBundle = (newCheckout, key: string, customImage) => {
    console.log("in function", newCheckout)

    console.log("image", customImage)

    bundledDispatch({ type: "SET_CHECKOUT", payload: newCheckout.id })

    let tempItems: any[] = []
    newCheckout.lineItems.forEach(item => {
      if (item.customAttributes.length !== 0) {
        item.customAttributes.forEach(attr => {
          if (attr.key === "customizationId" && attr.value === key) {
            tempItems.push(item)
          }
        })
      }
    })
    if (tempItems.length > 0) {
      console.log("here")
      bundledDispatch({
        type: "ADD",
        payload: {
          id: key,
          value: tempItems,
          image: customImage,
        },
      })
    }

    console.log("temp items", tempItems)
    console.log("current bundle context", bundledCustoms)
  }
  const handleAddToCart = () => {
    console.log("var", variant)
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
      ],
    }
    stepItems.unshift(frameVariant)

    const newCheckout = addProductCustomToCart(stepItems).then(result =>
      addToBundle(result, matchingKey, productImage)
    )
    alert("ADDED TO CART")
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
