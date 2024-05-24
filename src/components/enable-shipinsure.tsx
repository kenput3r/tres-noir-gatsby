import React, { useContext } from "react"
import styled from "styled-components"
import { useSpring, animated } from "react-spring"
import { CartContext } from "../contexts/cart"

const SwitchWrapper = styled.div`
  margin-top: -10px;
  display: flex;
  justify-content: end;
  margin-bottom: 15px;
  flex-wrap: wrap;
`

const Label = styled.span`
  font-family: var(--sub-heading-font) !important;
  margin-right: 1rem;
`

interface SwitchProps {
  checked: boolean
}

const Switch = styled(animated.label)<SwitchProps>`
  position: relative;
  width: 50px;
  height: 25px;
  background-color: ${props => (props.checked ? "#4caf50" : "#ccc")};
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px;
`

const Handle = styled(animated.div)`
  position: absolute;
  width: 21px;
  height: 21px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
`

const Checkbox = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`

const EnableShipInsure: React.FC = () => {
  const { updateShipInsureAttribute, isShipInsureEnabled } =
    useContext(CartContext)

  const handleToggle = () => {
    updateShipInsureAttribute(!isShipInsureEnabled)
  }

  const springProps = useSpring({
    transform: isShipInsureEnabled ? "translateX(25px)" : "translateX(0px)",
    config: { duration: 200 },
  })

  return (
    <SwitchWrapper>
      <Label>Enable ShipInsure shipping insurance</Label>
      {isShipInsureEnabled ? <span>Enabled</span> : <span>Disabled</span>}
      <Switch checked={isShipInsureEnabled}>
        <Checkbox
          type="checkbox"
          checked={isShipInsureEnabled}
          onChange={handleToggle}
        />
        <Handle style={springProps} />
      </Switch>
    </SwitchWrapper>
  )
}

export default EnableShipInsure
