import React from "react"
import styled from "styled-components"

const Selector = styled.div`
  div {
    display: inline-block;
    line-height: 1.5em;
    padding: 3px 7px;
    font-family: var(--sub-heading-font);
    input {
      border: none;
      text-align: center;
      width: 2em;
      vertical-align: top;
    }
    .qty {
      cursor: pointer;
      text-decoration: none;
      font-weight: bold;
      color: #000;
      font-size: 1.5em;
    }
  }
`

interface Props {
  lineId: string
  quantity: number
  imageId: string
  updateQuantity: (lineId: string, quantity: number, imageId: string) => void
}

const QuantitySelector = (props: Props) => {
  const { lineId, quantity, imageId, updateQuantity } = props
  return (
    <Selector>
      <div>
        <span
          className="quantity-down qty text-btn"
          onClick={() => updateQuantity(lineId, quantity - 1, imageId)}
        >
          -
        </span>
        <input className="quantity" type="text" value={quantity} readOnly />
        <span
          className="quantity-up qty text-btn"
          onClick={() => updateQuantity(lineId, quantity + 1, imageId)}
        >
          +
        </span>
      </div>
    </Selector>
  )
}

export default QuantitySelector
