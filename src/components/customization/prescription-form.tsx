import React, { RefObject } from "react"
import { FaQuestionCircle } from "react-icons/fa"
import { rxType } from "../../types/customize"
import { SelectedVariants } from "../../types/global"

interface Props {
  errorRefs: RefObject<any>
  rxInfo: rxType
  handleRx: (evt: any) => void
  range: (start: number, end: number, step: number, id: string) => string[]
  selectedVariants: SelectedVariants
}

const PrescriptionForm: React.FC<Props> = ({
  errorRefs,
  rxInfo,
  handleRx,
  range,
  selectedVariants,
}) => {
  return (
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
              rxInfo.right.cyl === "0.00" ? "rx-select disable" : "rx-select"
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
  )
}

export default PrescriptionForm
