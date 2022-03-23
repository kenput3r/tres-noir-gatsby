import React, { useContext } from "react"
import { Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import styled from "styled-components"
import { FaQuestionCircle } from "react-icons/fa"

import {
  ShopifyCollection,
  ShopifyProduct,
  ShopifyVariant,
} from "../../types/global"
import { CustomizeContext } from "../../contexts/customize"
import { RxInfoContext } from "../../contexts/rxInfo"

const Component = styled.form`
  padding: 10px;
  .step-header {
    font-family: var(--heading-font);
    text-transform: uppercase;
  }
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
    margin-top: 25px;
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
  .rx-info {
    font-family: var(--sub-heading-font);
    .rx-box {
      display: flex;
      justify-content: space-between;
      margin: 25px 0;
      .rx-col {
        :nth-of-type(odd) {
          margin-right: 25px;
          @media only screen and (max-width: 480px) {
            margin-right: 10px;
          }
        }
        flex: 1;
        p {
          text-align: center;
          margin-bottom: 5px;
        }
        .rx-select {
          border-bottom: 1px solid #808080;
          display: flex;
          label {
            color: #808080;
          }
          select {
            margin-left: 15px;
            border: none;
            width: 100%;
            background: none;
          }
        }
      }
    }
    .rx-box:nth-of-type(2) {
      .rx-col {
        .rx-select {
          .pd-box {
            display: flex;
            column-gap: 12px;
            align-items: center;
            @media screen and (max-width: 480px) {
              column-gap: 5px;
            }
            div {
              display: flex;
              position: relative;
              .tooltip-text {
                visibility: hidden;
                width: 100px;
                background-color: #555;
                color: #fff;
                text-align: center;
                border-radius: 6px;
                padding: 5px 3px;
                position: absolute;
                z-index: 1;
                bottom: 125%;
                left: 50%;
                margin-left: -50px;
                opacity: 0;
                transition: opacity 0.3s;
                a {
                  color: inherit;
                  text-decoration: inherit;
                }
                ::after {
                  content: "";
                  position: absolute;
                  top: 100%;
                  left: 50%;
                  margin-left: -5px;
                  border-width: 5px;
                  border-style: solid;
                  border-color: #555 transparent transparent transparent;
                }
              }
              :hover .tooltip-text {
                visibility: visible;
                opacity: 1;
              }
            }
          }
          flex-direction: column;
          select {
            margin: 0;
          }
        }
        :nth-child(2) {
          .rx-select {
            .pd-box {
              div {
                .tooltip-text {
                  margin-left: -80px;
                  left: unset;
                  ::after {
                    left: 90%;
                  }
                }
              }
            }
          }
        }
      }
    }
    .rx-prism {
      p {
        color: #808080;
        margin: 0;
        span {
          color: initial;
        }
      }
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
  const stepMap = new Map()
  stepMap.set(1, "RX TYPE")
  stepMap.set(2, "LENS TYPE")
  stepMap.set(3, "LENS MATERIAL")
  stepMap.set(4, "LENS COATING")
  const { isRxAble, setRxAble, rxInfo, dispatch } = useContext(RxInfoContext)
  const handleChange = (variant: ShopifyVariant) => {
    setRxAble(variant.product?.title !== "Non-Prescription Lens")
    setSelectedVariants({
      ...selectedVariants,
      [`step${currentStep}`]: variant,
    })
  }
  const handleRx = evt => {
    dispatch({ type: evt.target.id, payload: evt.target.value })
  }
  const range = (start: number, end: number, step: number): string[] => {
    const arr: string[] = []
    const format: number = step % 1 === 0 ? 0 : 2
    for (let i = start; i < end + step; i += step) {
      arr.push(i.toFixed(format))
    }
    return arr
  }
  return (
    <Component>
      <div className="step-header">
        <p>Choose your {stepMap.get(currentStep)}</p>
      </div>
      {shopifyCollection.products.map((product: ShopifyProduct) => (
        <React.Fragment key={product.id}>
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
                    {` + $${product.variants[0].price}`}
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
                          {` + $${product.variants[0].price}`}
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
      {currentStep === 1 && isRxAble ? (
        <div className="rx-info">
          <div className="rx-box">
            <div className="rx-col">
              <p>Right Eye (OD)</p>
              <div className="rx-select">
                <label htmlFor="right-sph">SPH</label>
                <select
                  id="right-sph"
                  defaultValue={rxInfo.right.sph}
                  onChange={evt => handleRx(evt)}
                >
                  {range(-20, 19.75, 0.25).map(el => {
                    return (
                      <React.Fragment key={`right-sph-${el}`}>
                        <option value={el}>{el}</option>
                      </React.Fragment>
                    )
                  })}
                </select>
              </div>
              <div className="rx-select">
                <label htmlFor="right-cyl">CYL</label>
                <select
                  id="right-cyl"
                  defaultValue={rxInfo.right.cyl}
                  onChange={evt => handleRx(evt)}
                >
                  {range(-20, 19.75, 0.25).map(el => {
                    return (
                      <React.Fragment key={`right-cyl-${el}`}>
                        <option value={el}>{el}</option>
                      </React.Fragment>
                    )
                  })}
                </select>
              </div>
              <div className="rx-select">
                <label htmlFor="right-axis">Axis</label>
                <select
                  id="right-axis"
                  defaultValue={rxInfo.right.axis}
                  onChange={evt => handleRx(evt)}
                >
                  <option>{""}</option>
                  {range(1, 180, 1).map(el => {
                    return (
                      <React.Fragment key={`right-axis-${el}`}>
                        <option value={el}>{el}</option>
                      </React.Fragment>
                    )
                  })}
                </select>
              </div>
              <div className="rx-select">
                <label htmlFor="right-add">Add</label>
                <select
                  id="right-add"
                  defaultValue={rxInfo.right.add}
                  onChange={evt => handleRx(evt)}
                >
                  <option>{""}</option>
                  {range(0, 3.5, 0.25).map(el => {
                    return (
                      <React.Fragment key={`right-add-${el}`}>
                        <option value={el}>{el}</option>
                      </React.Fragment>
                    )
                  })}
                </select>
              </div>
            </div>
            <div className="rx-col">
              <p>Left Eye (OS)</p>
              <div className="rx-select">
                <label htmlFor="left-sph">SPH</label>
                <select
                  id="left-sph"
                  defaultValue={rxInfo.left.sph}
                  onChange={evt => handleRx(evt)}
                >
                  {range(-20, 19.75, 0.25).map(el => {
                    return (
                      <React.Fragment key={`left-sph-${el}`}>
                        <option value={el}>{el}</option>
                      </React.Fragment>
                    )
                  })}
                </select>
              </div>
              <div className="rx-select">
                <label htmlFor="left-cyl">CYL</label>
                <select
                  id="left-cyl"
                  defaultValue={rxInfo.left.cyl}
                  onChange={evt => handleRx(evt)}
                >
                  {range(-20, 19.75, 0.25).map(el => {
                    return (
                      <React.Fragment key={`left-sph-${el}`}>
                        <option value={el}>{el}</option>
                      </React.Fragment>
                    )
                  })}
                </select>
              </div>
              <div className="rx-select">
                <label htmlFor="left-axis">Axis</label>
                <select
                  id="left-axis"
                  defaultValue={rxInfo.left.axis}
                  onChange={evt => handleRx(evt)}
                >
                  <option>{""}</option>
                  {range(1, 180, 1).map(el => (
                    <React.Fragment key={`left-axis-${el}`}>
                      <option value={el}>{el}</option>
                    </React.Fragment>
                  ))}
                </select>
              </div>
              <div className="rx-select">
                <label htmlFor="left-add">Add</label>
                <select
                  id="left-add"
                  defaultValue={rxInfo.left.add}
                  onChange={evt => handleRx(evt)}
                >
                  <option>{""}</option>
                  {range(0, 3.5, 0.25).map(el => (
                    <React.Fragment key={`left-add-${el}`}>
                      <option value={el}>{el}</option>
                    </React.Fragment>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="rx-box">
            <div className="rx-col">
              <div className="rx-select">
                <div className="pd-box">
                  <label htmlFor="right-pd">Pupillary Distance Right</label>
                  <div>
                    <FaQuestionCircle />
                    <span className="tooltip-text">
                      <a href="https://www.youtube.com/watch?v=OBuX8QEabZc">
                        Need help measuring your pd? Click here!
                      </a>
                    </span>
                  </div>
                </div>
                <select
                  id="right-pd"
                  defaultValue={rxInfo.right.pd}
                  onChange={evt => handleRx(evt)}
                >
                  <option>{""}</option>
                  {range(46, 80, 1).map(el => {
                    return (
                      <React.Fragment key={`right-pd-${el}`}>
                        <option value={el}>{el}</option>
                      </React.Fragment>
                    )
                  })}
                </select>
              </div>
            </div>
            <div className="rx-col">
              <div className="rx-select">
                <div className="pd-box">
                  <label htmlFor="left-pd">Pupillary Distance Left</label>
                  <div>
                    <FaQuestionCircle />
                    <span className="tooltip-text">
                      <a href="https://www.youtube.com/watch?v=OBuX8QEabZc">
                        Need help measuring your pd? Click here!
                      </a>
                    </span>
                  </div>
                </div>
                <select
                  id="left-pd"
                  defaultValue={rxInfo.left.pd}
                  onChange={evt => handleRx(evt)}
                >
                  {range(46, 80, 1).map(el => {
                    return (
                      <React.Fragment key={`left-pd-${el}`}>
                        <option value={el}>{el}</option>
                      </React.Fragment>
                    )
                  })}
                </select>
              </div>
            </div>
          </div>
          <div className="rx-prism">
            <p>
              Need prism corection? Email <span>info@tresnoir.com</span> or call{" "}
              <span>714-656-4796</span>
            </p>
          </div>
        </div>
      ) : null}
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
