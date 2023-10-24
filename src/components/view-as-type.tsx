import React from "react"
import styled from "styled-components"
import { BsSunglasses, BsEyeglasses } from "react-icons/bs"

const Component = styled.div`
  margin-bottom: 15px;
  button {
    border-radius: 10px !important;
    text-transform: none !important;
    background: white !important;
    color: black !important;
    border-color: var(--color-grey-dark) !important;
    padding: 6px 8px !important;
    color: var(--color-grey-dark) !important;
  }
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
  }
  span {
    color: var(--color-grey-dark) !important;
  }
  :hover {
    span {
      color: #bfbfbf !important;
    }
    button {
      color: #bfbfbf !important;
      border-color: #bfbfbf !important;
    }
  }
`

enum LensType {
  GLASSES = "glasses",
  SUNGLASSES = "sunglasses",
}

type ViewAsTypeProps = {
  lensType: string
  swapGlassesType: (state: "glasses" | "sunglasses") => void
}

const ViewAsType = ({ lensType, swapGlassesType }: ViewAsTypeProps) => {
  return (
    <Component className="view-as-lens-type">
      <button
        onClick={() =>
          swapGlassesType(
            lensType === LensType.GLASSES ? "sunglasses" : "glasses"
          )
        }
      >
        <section className="flex">
          {lensType === LensType.GLASSES ? <BsSunglasses /> : <BsEyeglasses />}
          <span>
            View as{" "}
            {lensType === LensType.GLASSES ? "Sunglasses" : "Eyeglasses"}
          </span>
        </section>
      </button>
    </Component>
  )
}

export default ViewAsType
