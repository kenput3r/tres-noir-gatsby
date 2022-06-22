import React, {
  useContext,
  useRef,
  ChangeEvent,
  useState,
  useEffect,
} from "react"
import { Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { Component } from "./styles"
import {
  SelectedVariantStorage,
  ShopifyCollection,
  ShopifyProduct,
  ShopifyVariant,
} from "../../types/global"
import { CustomizeContext } from "../../contexts/customize"
import { RxInfoContext } from "../../contexts/rxInfo"
import { FaQuestionCircle } from "react-icons/fa"
import { LocalCheckout } from "../../types/checkout"
import { rxType } from "../../types/checkout"

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
    defaultVariant,
  } = useContext(CustomizeContext)
  // const { checkout } = useContext(CartContext)
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
  const [editHasError, setEditHasError] = useState(false)

  const handleChange = (
    evt: React.ChangeEvent<HTMLInputElement> | null,
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

    if (editHasError) {
      enableContinue()
    }

    if (currentStep === 4) {
      const blockedSelections: string[] = []
      if (
        selectedVariants.step3.product.title === "Poly Carbonate" ||
        selectedVariants.step3.product.title === "Hi-Index"
      ) {
        blockedSelections.push("Scratch Coat", "UV Coat")
      }
      const checked =
        isSetFromEvent === false
          ? true
          : evt !== null
          ? evt.target.checked
          : false
      const name = evt?.target.getAttribute("name") as string
      if (checked) {
        toggleAntiReflective(blockedSelections, name, checked)

        // no coating
        if (name === "No Coating") {
          setSelectedVariants({
            ...selectedVariants,
            [`step${currentStep}`]: [variant],
          })
        } else {
          const found = selectedVariants.step4.find(
            el => variant.sku === el.sku
          )
          if (!found) {
            if (
              selectedVariants.step4.length === 1 &&
              selectedVariants.step4[0].price === "0.00"
            ) {
              setSelectedVariants({
                ...selectedVariants,
                [`step${currentStep}`]: [variant],
              })
            } else {
              // remove no coating
              setSelectedVariants({
                ...selectedVariants,
                [`step${currentStep}`]: [...selectedVariants.step4, variant],
              })
            }
          }
        }
      } else {
        // remove
        toggleAntiReflective(blockedSelections, name, checked)
        // do not let removal of one
        if (selectedVariants.step4.length === 1) {
          // setSelectedVariants({
          //   ...selectedVariants,
          //   [`step${currentStep}`]: [shopifyCollection.products[0].variants[0]],
          // })
          disableContinue(4)
        } else {
          const arr = selectedVariants.step4
          const index = arr.findIndex(el => variant.sku === el.sku)
          if (index !== -1) arr.splice(index, 1)
          setSelectedVariants({
            ...selectedVariants,
            [`step${currentStep}`]: arr,
          })
        }
      }
    } else {
      setSelectedVariants({
        ...selectedVariants,
        [`step${currentStep}`]: variant,
      })
    }
  }

  const toggleAntiReflective = (
    blockedSelections: string[],
    name: string | null,
    checked: boolean
  ) => {
    if (checked) {
      if (name && name.includes("Anti-Reflective")) {
        if (name === "Anti-Reflective - Standard") {
          blockedSelections.push("Anti-Reflective Coat - Premium")
        } else {
          blockedSelections.push("Anti-Reflective - Standard")
        }
      } else if (
        name &&
        !name.includes("Anti-Reflective") &&
        name !== "No Coating"
      ) {
        blockedSelections = [...filteredCollection]
      }
    }
    setFilteredCollection([...new Set(blockedSelections)])
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
    // remove lens coatings that are no longer eligible if step3 changes
    if (
      (currentStep === 4 &&
        selectedVariants.step3.product.title === "Poly Carbonate") ||
      selectedVariants.step3.product.title === "Hi-Index"
    ) {
      const coatings: string[] = ["Scratch Coat", "UV Coat"]
      setSelectedVariants({
        ...selectedVariants,
        ["step4"]: [
          ...selectedVariants.step4.filter(
            el => !coatings.includes(el.product.title)
          ),
        ],
      })
    }
  }, [])

  useEffect(() => {
    if (hasSavedCustomized[`step${currentStep}`] === false) {
      handleChange(null, shopifyCollection.products[0].variants[0], false)
    }
  }, [])

  // useEffect to fix bug where Non Precription Lens selection will still error out
  useEffect(() => {
    if (
      currentStep === 1 &&
      selectedVariants.step1.product.title === "Non-Prescription Lens"
    ) {
      enableContinue()
    }
  }, [currentStep, selectedVariants])

  // will disable continue button if none are selected
  useEffect(() => {
    if (
      currentStep === 4 &&
      hasSavedCustomized.step4 &&
      selectedVariants.step4[0].product.title === ""
    ) {
      disableContinue(4)
      // setSelectedVariants({
      //   ...selectedVariants,
      //   [`step${currentStep}`]: [shopifyCollection.products[0].variants[0]],
      // })
    }
  }, [currentStep])

  // restore on refresh
  useEffect(() => {
    if (!hasSavedCustomized.step1) {
      const isBrowser: boolean = typeof window !== "undefined"
      if (isBrowser) {
        const urlParams = new URLSearchParams(window.location.search)
        const custom_id = urlParams.get("custom_id")
        if (!custom_id) return
        const customsResume = localStorage.getItem("customs-resume")
        const checkoutString = localStorage.getItem("checkout")
        if (customsResume && custom_id && checkoutString) {
          const customsStorage = JSON.parse(
            customsResume
          ) as SelectedVariantStorage
          const checkoutStorage = JSON.parse(checkoutString) as LocalCheckout
          const customInCheckout = checkoutStorage.value?.tnLineItems?.find(
            el => el.id === custom_id
          )
          const rxAttr =
            customInCheckout?.lineItems[1].shopifyItem.customAttributes.find(
              el => el.key === "Prescription"
            ).value
          if (rxAttr !== "Non-Prescription") {
            // set Rx
            const prescription = JSON.parse(rxAttr) as rxType
            rxInfoDispatch({
              type: `full`,
              payload: prescription,
            })
          }
          const parsedCustoms = customsStorage.value.customs
          const resumedSelectedVariants =
            parsedCustoms[Number(custom_id)].selectedVariants
          // prepare context for editing
          // setting context
          setSelectedVariants(resumedSelectedVariants)
          // set rx context
          // setting savedCustomized context so radio won't default to top option
          setHasSavedCustomized({
            step1: true,
            step2: true,
            step3: true,
            step4: true,
            case: true,
          })
          setCurrentStep(5)
        }
      }
    }
  }, [])

  // disables the Continue step for customers that edit a frame and edit an invalid option
  const disableContinue = (currentStep: number) => {
    setEditHasError(true)
    removeChildNodes(messageRef.current)
    let node = document.createElement("li")
    node.textContent = "Please make a valid selection"
    messageRef.current?.appendChild(node)
    continueBtn.current?.classList.add("disable")
    // clear context for step 4 edit
    if (currentStep === 4) {
      setSelectedVariants({
        ...selectedVariants,
        ["step4"]: [defaultVariant],
      })
      //selectedVariants.step4 =
    }
  }
  // enables the Continue step once a customer selects a new option when selecting an invalid option on the previous
  // step after editing
  const enableContinue = () => {
    continueBtn.current?.classList.remove("disable")
    removeChildNodes(messageRef.current)
    setEditHasError(false)
  }

  // useEffect with steps to filter collection
  useEffect(() => {
    // temp array to store blocked selections
    let blockedSelections: any[] = []
    switch (currentStep) {
      case 2:
        if (selectedVariants.step1.product.title === "Bifocal") {
          const validationArr = [
            "Blue Light Blocking",
            "Polarized-G15",
            "XTRActive Polarized",
            "Transitions - For Progressive",
          ]
          blockedSelections.push(
            "Blue Light Blocking",
            "Polarized-G15",
            "XTRActive Polarized",
            "Transitions - For Progressive"
          )
          if (
            validationArr.includes(
              selectedVariants[`step${currentStep}`].product.title
            )
          ) {
            disableContinue(currentStep)
          }
        }
        // XTractive Polarized is only for Progressive and Single Vision
        if (
          selectedVariants.step1.product.title !== "Progressive" &&
          selectedVariants.step1.product.title !== "Single Vision"
        ) {
          blockedSelections.push("XTRActive Polarized")
          if (
            selectedVariants[`step${currentStep}`].product.title ===
            "XTRActive Polarized"
          ) {
            disableContinue(currentStep)
          }
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
          //
          if (
            selectedVariants[`step${currentStep}`].product.title === "Hi-Index"
          ) {
            disableContinue(currentStep)
          }
        }
        // if Polarized G15 option, disabled Hi-Index
        else if (
          selectedVariants.step2.product.title === "Polarized" &&
          selectedVariants.step2.title === "G15"
        ) {
          blockedSelections.push("Hi-Index")
          if (
            selectedVariants[`step${currentStep}`].product.title === "Hi-Index"
          ) {
            disableContinue(currentStep)
          }
        }
        break
      case 4:
        // if poly carbonate or hi index, disable scratch coat and uv coat
        const selectedCoatings = selectedVariants.step4.map(
          el => el.product.title
        )
        if (
          selectedVariants.step3.product.title === "Poly Carbonate" ||
          selectedVariants.step3.product.title === "Hi-Index"
        ) {
          blockedSelections.push("Scratch Coat", "UV Coat")
          //
          if (
            selectedCoatings.some(v => ["Scratch Coat", "UV Coat"].includes(v))
          ) {
            disableContinue(currentStep)
          }
        }

        if (
          selectedCoatings.includes("Anti-Reflective - Standard") ||
          selectedCoatings.includes("Anti-Reflective Coat - Premium")
        ) {
          if (selectedCoatings.includes("Anti-Reflective - Standard")) {
            blockedSelections.push("Anti-Reflective Coat - Premium")
            //
            if (
              ["Anti-Reflective Coat - Premium"].some(v =>
                selectedCoatings.includes(v)
              )
            ) {
              disableContinue(currentStep)
            }
          } else {
            blockedSelections.push("Anti-Reflective - Standard")
            //
            if (
              ["Anti-Reflective - Standard"].some(v =>
                selectedCoatings.includes(v)
              )
            ) {
              disableContinue(currentStep)
            }
          }
        }
        break
      // if currentStep is 1 or 5, do nothing
      default:
        break
    }
    setFilteredCollection([...new Set(blockedSelections)])
  }, [currentStep])

  const findStep4Selections = (id: string) => {
    const find = selectedVariants.step4.find(el => {
      return el.storefrontId === id
    })
    let found: boolean = false
    if (find) found = true
    return found
  }

  return (
    <Component>
      <div className="step-header">
        <p>Choose your {stepMap.get(currentStep)}</p>
      </div>
      {shopifyCollection.products.map((product: ShopifyProduct, index) => {
        // fix variant.image is null
        if (product.variants[0].image === null) {
          product.variants[0].image = product.images[0]
        }
        return (
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
                {currentStep === 4 ? (
                  <input
                    type="checkbox"
                    name={product.title}
                    id={product.id}
                    aria-label={product.title}
                    onChange={evt => handleChange(evt, product.variants[0])}
                    checked={findStep4Selections(
                      product.variants[0].storefrontId
                    )}
                  />
                ) : (
                  <input
                    type="radio"
                    name={`step${currentStep}`}
                    id={product.id}
                    aria-label={product.title}
                    onChange={evt => handleChange(evt, product.variants[0])}
                    checked={
                      product.variants[0].storefrontId ===
                      selectedVariants[`step${currentStep}`].storefrontId
                    }
                  />
                )}
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
                          variant.image.localFile.childImageSharp
                            .gatsbyImageData
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
                        onChange={evt => handleChange(evt, variant)}
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
        )
      })}
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
