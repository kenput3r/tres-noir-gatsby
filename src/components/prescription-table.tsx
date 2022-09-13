import React, { useRef, useState } from "react"
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
    tbody {
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
  }
  .button-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    input[type="file"] {
      ::file-selector-button {
        text-transform: uppercase;
        font-family: var(--heading-font);
        background-color: #000;
        /* box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.6); */
        color: #fff;
        display: inline-block;
        font-size: 1rem;
        padding: 8px 25px;
        text-decoration: none;
        cursor: pointer;
        -webkit-appearance: button-bevel;
        border: none;
        border-radius: 0%;
      }
    }
    .btn {
      text-transform: uppercase;
      font-family: var(--heading-font);
    }
    p {
      font-family: var(--sub-heading-font);
      margin: 0;
      text-align: center;
    }
    .middle {
      p {
        margin: 6px 0;
      }
    }
  }
  .hide {
    display: none;
  }
  .show {
    display: block;
  }
  .confirmed {
    p {
      color: green;
      text-align: center;
    }
  }
  .button-flex-row {
    display: flex;
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

const PrescriptionTable = ({ lineItem }) => {
  const optionsRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showUpload, setShowUpload] = useState<boolean>(false)

  const formatMeasurement = (msmt: string) => {
    if (msmt === "0.00" || msmt === "00.00" || msmt === "0") {
      return ""
    }
    return msmt
  }
  const confirmClicked = () => {
    optionsRef.current?.classList.add("hide")
    messageRef.current?.classList.remove("hide")
  }
  const orderName = "sample"
  const customAttr = lineItem.node.customAttributes.filter(
    el => el.key === "Prescription"
  )
  const prescription = JSON.parse(customAttr[0].value) as rxType

  return (
    <Component>
      <p>OrderName</p>
      <div>
        <table>
          <tbody>
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
          </tbody>
        </table>
      </div>
      {!showUpload ? (
        <div>
          <div className="confirmed hide" ref={messageRef}>
            <p>This prescription has been confirmed.</p>
          </div>
          <div className="button-flex" ref={optionsRef}>
            <button className="btn" onClick={evt => confirmClicked()}>
              Confirm
            </button>
            <div className="middle">
              <p>- OR -</p>
              <p>Let us confirm for you</p>
            </div>
            <button className="btn" onClick={evt => setShowUpload(true)}>
              Upload
            </button>
          </div>
        </div>
      ) : (
        <ImageUpload
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          setShowUpload={setShowUpload}
        />
      )}
    </Component>
  )
}

const ImageUpload = ({ selectedFile, setSelectedFile, setShowUpload }) => {
  const getBase64Image = async file => {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        const base64data = reader.result
        resolve(base64data)
      }
    })
  }

  const uploadPrescriptionImage = async () => {
    try {
      if (!selectedFile) {
        console.log("No image added")
        return
      }
      const endpoint = "/api/uploadPrescription"
      const results = await getBase64Image(selectedFile)
      const res = await fetch(endpoint, {
        method: "POST",
        body: results,
      })
      const resJson = await res.json()
      console.log("res", resJson)
    } catch (error) {
      console.log("Error", error)
    }
  }

  const handleUpload = async () => {
    const res = await uploadPrescriptionImage()
    console.log("upload res", res)
    console.log("image upload")
  }

  return (
    <div className="button-flex">
      <div>
        <input
          type="file"
          name="prescriptionImage"
          id="prescriptionImage"
          accept="image/*"
          onChange={evt => setSelectedFile(evt.target.files[0])}
        />
      </div>
      <div className="button-flex-row">
        <button className="btn" onClick={evt => setShowUpload(false)}>
          Back
        </button>
        <button className="btn" onClick={evt => handleUpload()}>
          Upload
        </button>
      </div>
    </div>
  )
}

const SuccessMessage = () => {}

export default PrescriptionTable
