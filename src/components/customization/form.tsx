import React, {
  useContext,
  useRef,
  ChangeEvent,
  useState,
  useEffect,
} from "react"
import { Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { FaQuestionCircle } from "react-icons/fa"
import { Component } from "./styles"
import {
  ShopifyCollection,
  ShopifyProduct,
  ShopifyVariant,
} from "../../types/global"
import { CustomizeContext } from "../../contexts/customize"
import { RxInfoContext } from "../../contexts/rxInfo"

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
    hasSavedCustomized,
    setHasSavedCustomized,
  } = useContext(CustomizeContext)
  const stepMap = new Map()
  stepMap.set(1, "RX TYPE")
  stepMap.set(2, "LENS TYPE")
  stepMap.set(3, "LENS MATERIAL")
  stepMap.set(4, "LENS COATING")
  const { isRxAble, setRxAble, rxInfo, rxInfoDispatch } =
    useContext(RxInfoContext)
  const messageRef = useRef<any>()
  const [isFormValid, setIsFormValid] = useState(true)
  const errorRefs = useRef({})
  const continueBtn = useRef<HTMLButtonElement>(null)
  const [filteredCollection, setFilteredCollection] = useState<string[]>([])

  const handleChange = (
    variant: ShopifyVariant,
    isSetFromEvent: boolean = true
  ) => {
    setRxAble(variant.product?.title !== "Non-Prescription Lens")
    if (variant.product?.title === "Non-Prescription Lens") {
      if (messageRef.current) {
        removeChildNodes(messageRef.current)
        continueBtn.current?.classList.remove("disable")
      }
    } else if (variant.product?.title === "Single Vision") {
      rxInfoDispatch({ type: `right-add`, payload: "" })
      rxInfoDispatch({ type: `left-add`, payload: "" })
      if (errorRefs.current[`select-right-add`])
        errorRefs.current[`select-right-add`].classList.add("disable")
      if (errorRefs.current[`select-right-add`])
        errorRefs.current[`select-right-add`].querySelector("select").value = ""
      if (errorRefs.current[`select-left-add`])
        errorRefs.current[`select-left-add`].classList.add("disable")
      if (errorRefs.current[`select-left-add`])
        errorRefs.current[`select-left-add`].querySelector("select").value = ""
    }
    setHasSavedCustomized({
      ...hasSavedCustomized,
      [`step${currentStep}`]: isSetFromEvent,
    })
    setSelectedVariants({
      ...selectedVariants,
      [`step${currentStep}`]: variant,
    })
  }
  const handleRx = (evt: ChangeEvent<HTMLSelectElement>) => {
    clearErrors(evt)
    rxInfoDispatch({ type: evt.target.id, payload: evt.target.value })
    isNowValid()
  }
  const clearErrors = (evt: ChangeEvent<HTMLSelectElement>) => {
    let id: string = evt.target.id
    // disable axis whether a cyl value is present or not
    if (id.includes("cyl")) {
      let subId = id.split("-")[0]
      console.log(subId)
      if (evt.target.value !== "0.00") {
        errorRefs.current[`select-${subId}-axis`].classList.remove("disable")
        return
      }
      errorRefs.current[`select-${subId}-axis`].classList.add("disable")
      errorRefs.current[`select-${subId}-axis`].querySelector("select").value =
        ""
      rxInfoDispatch({ type: `${subId}-axis`, payload: "" })
    }
    const generalErrors: string[] = [
      "right-sph",
      "right-cyl",
      "left-sph",
      "left-cyl",
    ]

    if (id.includes("axis")) {
      evt.target.closest(".rx-select")?.classList.remove("select-error")
    }
    if (id.includes("cyl") && evt.target.value === "0.00") {
      let subId = id.split("-")[0]
      errorRefs.current[`select-${subId}-axis`].classList.remove("select-error")
      let msg = messageRef.current.querySelector(`#error-${subId}-axis`)
      if (msg) msg.remove()
    }
    if (generalErrors.indexOf(id) > -1) {
      let msg = messageRef.current.querySelector("#error-general")
      if (msg) msg.remove()
    }
    let msg = messageRef.current.querySelector(`#error-${id}`)
    if (msg) msg.remove()
  }
  const range = (
    start: number,
    end: number,
    step: number,
    id: string
  ): string[] => {
    const arr: string[] = []
    const format: number = step % 1 === 0 ? 0 : 2
    for (let i = start; i < end + step; i += step) {
      arr.push(i.toFixed(format))
      if (i === 0 && id.includes("sph")) arr.push("Plano")
    }
    return arr
  }
  const removeChildNodes = (parent: HTMLElement) => {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild)
    }
  }
  const verifyForm = () => {
    let isValid = true
    let messages: HTMLElement[] = []
    if (messageRef.current) removeChildNodes(messageRef.current)
    if (
      rxInfo.right.sph === "0.00" &&
      rxInfo.left.sph === "0.00" &&
      rxInfo.right.cyl === "0.00" &&
      rxInfo.left.cyl === "0.00"
    ) {
      let node = document.createElement("li")
      node.textContent =
        "Please add prescription information or choose non-prescription"
      node.setAttribute("id", "error-general")
      messages.push(node)
      isValid = false
    }
    if (rxInfo.right.cyl !== "0.00" && rxInfo.right.axis === "") {
      let node = document.createElement("li")
      node.textContent = "Please add an axis value for right eye"
      node.setAttribute("id", "error-right-axis")
      messages.push(node)
      errorRefs.current["select-right-axis"].classList.add("select-error")
      isValid = false
    }
    if (rxInfo.left.cyl !== "0.00" && rxInfo.left.axis === "") {
      let node = document.createElement("li")
      node.textContent = "Please add an axis value for left eye"
      node.setAttribute("id", "error-left-axis")
      messages.push(node)
      errorRefs.current["select-left-axis"].classList.add("select-error")
      isValid = false
    }
    if (!isValid && messageRef.current) {
      for (let i = 0; i < messages.length; ++i) {
        messageRef.current?.appendChild(messages[i])
      }
    }
    if (!isValid) {
      continueBtn.current?.classList.add("disable")
    }
    setIsFormValid(isValid)
    return isValid
  }
  const isNowValid = () => {
    // will re enable the button once all form errors are cleared
    if (isFormValid) return
    if (!messageRef.current.hasChildNodes()) {
      continueBtn.current?.classList.remove("disable")
    }
  }
  const handleSteps = (num: number) => {
    if (currentStep !== 1 || !isRxAble) {
      setCurrentStep(currentStep + num)
      return
    }
    if (verifyForm()) {
      setCurrentStep(currentStep + num)
      return
    }
  }

  useEffect(() => {
    // console.log("hasSaved", hasSavedCustomized[`step${currentStep}`])
    if (hasSavedCustomized[`step${currentStep}`] === false) {
      handleChange(shopifyCollection.products[0].variants[0], false)
    }
  }, [])

  // useEffect with steps to filter collection
  useEffect(() => {
    // temp array to store blocked selections
    let blockedSelections: any[] = []
    switch (currentStep) {
      case 2:
        if (selectedVariants.step1.product.title === "Bifocal") {
          blockedSelections.push(
            "Blue Light Blocking",
            "Polarized-G15",
            "XTRActive Polarized",
            "Transitions - For Progressive"
          )
        }
        // XTractive Polarized is only for Progressive and Single Vision
        if (
          selectedVariants.step1.product.title !== "Progressive" &&
          selectedVariants.step1.product.title !== "Single Vision"
        ) {
          blockedSelections.push("XTRActive Polarized")
        }
        break
      case 3:
        // if Bifocal and Polarized or Gradient Tint or Transitions, disable Hi-Index
        if (
          (selectedVariants.step1.product.title === "Bifocal" &&
            (selectedVariants.step2.product.title === "Polarized" ||
              selectedVariants.step2.product.title === "Gradient Tint")) ||
          selectedVariants.step2.product.title === "Transitions"
        ) {
          blockedSelections.push("Hi-Index")
        }
        // if Polarized G15 option, disabled Hi-Index
        else if (
          selectedVariants.step2.product.title === "Polarized" &&
          selectedVariants.step2.title === "G15"
        ) {
          blockedSelections.push("Hi-Index")
        }
        break
      case 4:
        // if poly carbonate or hi index, disable scratch coat and uv coat
        if (
          selectedVariants.step3.product.title === "Poly Carbonate" ||
          selectedVariants.step3.product.title === "Hi-Index"
        ) {
          blockedSelections.push("Scratch Coat", "UV Coat")
        }
        break
      // if currentStep is 1 or 5, do nothing
      default:
        break
    }
    setFilteredCollection([...new Set(blockedSelections)])
  }, [currentStep])

  return (
    <Component>
      <div className="step-header">
        <p>Choose your {stepMap.get(currentStep)}</p>
      </div>
      {shopifyCollection.products.map((product: ShopifyProduct, index) => (
        <React.Fragment key={product.id}>
          {product.variants.length === 1 ? (
            <div
              className={`product-option ${
                filteredCollection.includes(product.title) ? "inactive" : ""
              }`}
            >
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
              {!filteredCollection.includes(product.title) ? (
                <div className="checkmark" />
              ) : (
                <div className="checkmark disabled" />
              )}
            </div>
          ) : (
            <div className={`product-option with-variants`}>
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
                  <li
                    key={variant.storefrontId}
                    className={`${
                      filteredCollection.includes(
                        `${product.title}-${variant.title}`
                      )
                        ? "inactive"
                        : ""
                    }`}
                  >
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
                    {!filteredCollection.includes(
                      `${product.title}-${variant.title}`
                    ) ? (
                      <div className="checkmark" />
                    ) : (
                      <div className="checkmark disabled" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </React.Fragment>
      ))}
      {(currentStep === 1 &&
        selectedVariants.step1.product.title !== "Non-Prescription Lens") ||
      selectedVariants.step1.product.title === "" ? (
        <div className="rx-info">
          <div className="rx-box">
            <div className="rx-col">
              <p>Right Eye (OD)</p>
              <div
                className="rx-select"
                ref={el => {
                  errorRefs.current["select-right-sph"] = el
                }}
              >
                <label htmlFor="right-sph">SPH</label>
                <select
                  id="right-sph"
                  defaultValue={rxInfo.right.sph}
                  onChange={evt => handleRx(evt)}
                >
                  {range(-20, 20, 0.25, "right-sph").map(el => {
                    return (
                      <React.Fragment key={`right-sph-${el}`}>
                        <option value={el}>{el}</option>
                      </React.Fragment>
                    )
                  })}
                </select>
              </div>
              <div
                className="rx-select"
                ref={el => {
                  errorRefs.current["select-right-cyl"] = el
                }}
              >
                <label htmlFor="right-cyl">CYL</label>
                <select
                  id="right-cyl"
                  defaultValue={rxInfo.right.cyl}
                  onChange={evt => handleRx(evt)}
                >
                  {range(-20, 20, 0.25, "right-cyl").map(el => {
                    return (
                      <React.Fragment key={`right-cyl-${el}`}>
                        <option value={el}>{el}</option>
                      </React.Fragment>
                    )
                  })}
                </select>
              </div>
              <div
                className={
                  rxInfo.right.cyl === "0.00"
                    ? "rx-select disable"
                    : "rx-select"
                }
                ref={el => {
                  errorRefs.current["select-right-axis"] = el
                }}
              >
                <label htmlFor="right-axis">Axis</label>
                <select
                  id="right-axis"
                  defaultValue={rxInfo.right.axis}
                  onChange={evt => handleRx(evt)}
                >
                  <option>{""}</option>
                  {range(1, 180, 1, "right-axis").map(el => {
                    return (
                      <React.Fragment key={`right-axis-${el}`}>
                        <option value={el}>{el}</option>
                      </React.Fragment>
                    )
                  })}
                </select>
              </div>
              <div
                className={
                  selectedVariants.step1.product.title === "Single Vision"
                    ? "rx-select disable"
                    : "rx-select"
                }
                ref={el => {
                  errorRefs.current["select-right-add"] = el
                }}
              >
                <label htmlFor="right-add">Add</label>
                <select
                  id="right-add"
                  defaultValue={rxInfo.right.add}
                  onChange={evt => handleRx(evt)}
                >
                  <option>{""}</option>
                  {range(0, 3.5, 0.25, "right-add").map(el => {
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
              <div
                className="rx-select"
                ref={el => {
                  errorRefs.current["select-left-sph"] = el
                }}
              >
                <label htmlFor="left-sph">SPH</label>
                <select
                  id="left-sph"
                  defaultValue={rxInfo.left.sph}
                  onChange={evt => handleRx(evt)}
                >
                  {range(-20, 20, 0.25, "left-sph").map(el => {
                    return (
                      <React.Fragment key={`left-sph-${el}`}>
                        <option value={el}>{el}</option>
                      </React.Fragment>
                    )
                  })}
                </select>
              </div>
              <div
                className="rx-select"
                ref={el => {
                  errorRefs.current["select-left-cyl"] = el
                }}
              >
                <label htmlFor="left-cyl">CYL</label>
                <select
                  id="left-cyl"
                  defaultValue={rxInfo.left.cyl}
                  onChange={evt => handleRx(evt)}
                >
                  {range(-20, 20, 0.25, "left-cyl").map(el => {
                    return (
                      <React.Fragment key={`left-cyl-${el}`}>
                        <option value={el}>{el}</option>
                      </React.Fragment>
                    )
                  })}
                </select>
              </div>
              <div
                className={
                  rxInfo.left.cyl === "0.00" ? "rx-select disable" : "rx-select"
                }
                ref={el => {
                  errorRefs.current["select-left-axis"] = el
                }}
              >
                <label htmlFor="left-axis">Axis</label>
                <select
                  id="left-axis"
                  defaultValue={rxInfo.left.axis}
                  onChange={evt => handleRx(evt)}
                >
                  <option>{""}</option>
                  {range(1, 180, 1, "left-axis").map(el => (
                    <React.Fragment key={`left-axis-${el}`}>
                      <option value={el}>{el}</option>
                    </React.Fragment>
                  ))}
                </select>
              </div>
              <div
                className={
                  selectedVariants.step1.product.title === "Single Vision"
                    ? "rx-select disable"
                    : "rx-select"
                }
                ref={el => {
                  errorRefs.current["select-left-add"] = el
                }}
              >
                <label htmlFor="left-add">Add</label>
                <select
                  id="left-add"
                  defaultValue={rxInfo.left.add}
                  onChange={evt => handleRx(evt)}
                >
                  <option>{""}</option>
                  {range(0, 3.5, 0.25, "left-add").map(el => (
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
                  {range(46, 80, 1, "right-pd").map(el => {
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
                  {range(46, 80, 1, "left-pd").map(el => {
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
          <button type="button" onClick={() => handleSteps(-1)}>
            GO BACK
          </button>
        )}
        <button type="button" onClick={() => handleSteps(1)} ref={continueBtn}>
          CONTINUE
        </button>
      </div>
      <ul className="form-error" ref={messageRef}></ul>
    </Component>
  )
}

export default Form
