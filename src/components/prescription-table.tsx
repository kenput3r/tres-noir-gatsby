import React, { useRef } from "react"
import styled from "styled-components"

const Component = styled.div`
  margin: 20px 0;
  p {
    font-family: var(--sub-heading-font);
    margin: 0;
    margin-bottom: 8px;
  }
  table {
    border: 1px solid black;
    tr {
      th {
        font-family: var(--heading-font);
        font-weight: normal;
      }
      td {
        font-family: var(--sub-heading-font);
        font-weight: normal;
      }
      th,
      td {
        border: 1px solid black;
        text-align: center;
        vertical-align: middle;
        padding: 10px 0;
      }
    }
  }
  .button-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .btn {
      text-transform: uppercase;
      font-family: var(--heading-font);
    }
    p {
      font-family: var(--sub-heading-font);
      margin: 0;
      text-align: center;
    }
  }
`

interface rxDetails {
  sph: string
  cyl: string
  axis: string
  add: string
  pd: string
}
interface rxType {
  right: rxDetails
  left: rxDetails
}

const PrescriptionTable = ({ order }) => {
  const optionsRef = useRef<HTMLDivElement>(null)
  const formatMeasurement = (msmt: string) => {
    if (msmt === "0.00" || msmt === "00.00" || msmt === "0") {
      return ""
    }
    return msmt
  }
  const confirmClicked = () => {
    console.log("confirm this order")
  }
  console.log("PrescriptionTable order", order)
  const orderName = "sample"
  const customAttr = order.node.customAttributes.filter(
    el => el.key === "Prescription"
  )
  const prescription = JSON.parse(customAttr[0].value) as rxType
  console.log("prescription", prescription)

  return (
    <Component>
      <p>OrderName</p>
      <div>
        <table>
          <tr>
            <td></td>
            <th>SPH</th>
            <th>CYL</th>
            <th>AXIS</th>
            <th>ADD</th>
            <th>PD</th>
          </tr>
          <tr>
            <th>OD</th>
            <td>{formatMeasurement(prescription.right.sph)}</td>
            <td>{formatMeasurement(prescription.right.cyl)}</td>
            <td>{formatMeasurement(prescription.right.axis)}</td>
            <td>{formatMeasurement(prescription.right.add)}</td>
            <td>{formatMeasurement(prescription.right.pd)}</td>
          </tr>
          <tr>
            <th>OS</th>
            <td>{formatMeasurement(prescription.left.sph)}</td>
            <td>{formatMeasurement(prescription.left.cyl)}</td>
            <td>{formatMeasurement(prescription.left.axis)}</td>
            <td>{formatMeasurement(prescription.left.add)}</td>
            <td>{formatMeasurement(prescription.left.pd)}</td>
          </tr>
        </table>
      </div>
      <div className="button-flex" ref={optionsRef}>
        <button className="btn" onClick={evt => confirmClicked()}>
          Confirm
        </button>
        <div>
          <p>- OR -</p>
          <p>Let us confirm for you</p>
        </div>
        <button className="btn">Upload Rx</button>
      </div>
    </Component>
  )
}

export default PrescriptionTable
