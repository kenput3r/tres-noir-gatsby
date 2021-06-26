import React from "react"
import styled from "styled-components"

interface Props {
  lineId: string
  quantity: number
  updateQuantity: (lineId: string, quantity: number) => void
}

const QuantitySelector = (props: Props) => {
  const { lineId, quantity, updateQuantity } = props
  return (
    <Selector>
      <a
        href="#"
        className="quantity-down"
        onClick={() => updateQuantity(lineId, quantity - 1)}
      >
        -
      </a>
      <input className="quantity" type="text" value={quantity} readOnly />
      <a
        href="#"
        className="quantity-up"
        onClick={() => updateQuantity(lineId, quantity + 1)}
      >
        +
      </a>
    </Selector>
  )
}

export default QuantitySelector

const Selector = styled.div`
  display: flex;
  flex-direction: row;
  line-height: 1.5em;
  border: 1px solid var(--color-grey-dark);
  padding: 7px;
  input {
    border: none;
    text-align: center;
    width: 2em;
  }
  a {
    text-decoration: none;
    font-weight: bold;
    color: #000;
    font-size: 1.5em;
  }
`
