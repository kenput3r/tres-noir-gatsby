import React, { useContext, useEffect } from "react"
import { Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import styled from "styled-components"
import {
  ShopifyCollection,
  ShopifyProduct,
  ShopifyVariant,
} from "../../types/global"
import { CustomizeContext } from "../../contexts/customize"

const Form = ({
  shopifyCollection,
}: {
  shopifyCollection: ShopifyCollection
}) => {
  const {
    currentStep,
    setCurrentStep,
    productUrl,
    selectedVariants,
    setSelectedVariants,
  } = useContext(CustomizeContext)
  const handleChange = (variant: ShopifyVariant) => {
    setSelectedVariants({
      ...selectedVariants,
      [`step${currentStep}`]: variant,
    })
  }
  /* tests */
  // useEffect(() => {
  //   console.log(selectedVariants)
  // }, [selectedVariants])
  return (
    <Component>
      {shopifyCollection.products.map((product: ShopifyProduct) => (
        <React.Fragment key={product.id}>
          {console.log("PRODUCT", product)}
          {product.variants.length === 1 ? (
            <div className="product-option">
              <GatsbyImage
                image={
                  product.images[0].localFile.childImageSharp.gatsbyImageData
                }
                alt={product.images[0].altText || product.title}
              />
              <div className="product-description">
                <h4>
                  {product.title}{" "}
                  <span className="price">
                    {` + $${product.variants[0].price.toFixed(2)}`}
                  </span>
                </h4>
                <p>{product.description}</p>
              </div>
              <input
                type="radio"
                name={`step${currentStep}`}
                id={product.id}
                aria-label={product.title}
                onChange={() => handleChange(product.variants[0])}
                checked={
                  product.variants[0].storefrontId ===
                  selectedVariants[`step${currentStep}`].storefrontId
                }
              />
              <div className="checkmark" />
            </div>
          ) : (
            <div className="product-option with-variants">
              <GatsbyImage
                image={
                  product.images[0].localFile.childImageSharp.gatsbyImageData
                }
                alt={product.images[0].altText || product.title}
              />
              <div className="product-description">
                <h4>{product.title}</h4>
                <p>{product.description}</p>
              </div>
              <ul className="variants">
                {product.variants.map((variant: ShopifyVariant) => (
                  <li key={variant.storefrontId}>
                    <GatsbyImage
                      image={
                        variant.image.localFile.childImageSharp.gatsbyImageData
                      }
                      alt={variant.title}
                      className="variant-image"
                    />
                    <div className="variant-description">
                      <h6>
                        {variant.title}
                        <span className="price">
                          {` + $${product.variants[0].price.toFixed(2)}`}
                        </span>
                      </h6>
                    </div>
                    <input
                      type="radio"
                      name={`step${currentStep}`}
                      id={product.id}
                      aria-label={product.title}
                      onChange={() => handleChange(variant)}
                      checked={
                        variant.storefrontId ===
                        selectedVariants[`step${currentStep}`].storefrontId
                      }
                    />
                    <div className="checkmark" />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </React.Fragment>
      ))}
      <div className="row">
        {currentStep === 1 ? (
          <Link className="button" to={productUrl}>
            GO BACK
          </Link>
        ) : (
          <button type="button" onClick={() => setCurrentStep(currentStep - 1)}>
            GO BACK
          </button>
        )}
        <button type="button" onClick={() => setCurrentStep(currentStep + 1)}>
          CONTINUE
        </button>
      </div>
    </Component>
  )
}

export default Form

const Component = styled.form`
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
    input[type="radio"] {
      height: calc(100% - 10px);
      opacity: 0;
      position: absolute;
      width: calc(100% - 10px);
      z-index: 2;
      :hover {
        cursor: pointer;
      }
      :checked ~ .checkmark:after {
        display: block;
      }
    }
    .checkmark {
      border: 1px solid #000;
      border-radius: 50%;
      height: 25px;
      position: relative;
      width: 25px;
      align-self: center;
      margin-left: auto;
      padding-left: 0;
      :after {
        content: "";
        position: absolute;
        display: none;
        left: 7px;
        top: 2px;
        width: 8px;
        height: 16px;
        border: solid #000;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
      }
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
    @media only screen and (max-width: 480px) {
      display: inline-block;
    }
  }
  ul.variants {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    flex-basis: 100%;
    margin: 0 auto;
    padding: 10px 10%;
    li {
      display: flex;
      flex-direction: row;
      height: 30px;
      margin-bottom: 5px;
      padding-right: 10px;
      position: relative;
      width: 50%;
      @media only screen and (max-width: 768px) {
        width: 100%;
      }
      .variant-image {
        max-height: 30px;
        max-width: 30px;
      }
      .variant-description {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
      div {
        padding-left: 5px;
      }
      p {
        line-height: 0.5;
      }
      .checkmark {
        @media only screen and (min-width: 1024px) {
          margin-right: 40px;
        }
        @media only screen and (min-width: 1200px) {
          margin-right: 25%;
        }
      }
    }
  }
`
