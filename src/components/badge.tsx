import React from "react"
import styled from "styled-components"

const Component = styled.div`
  position: absolute;
  top: 13px;
  left: 0;
  font-size: 1.15rem;
  color: white;
  padding: 0 10px;
  border-radius: 6px;
  font-family: var(--sub-heading-font);
  text-transform: uppercase;
`

type Props = {
  color: string
  label: string
}

const Badge = ({ color, label }: Props) => {
  return <Component style={{ backgroundColor: color }}>{label}</Component>
}

export default Badge
