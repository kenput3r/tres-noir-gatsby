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

const Switch = styled(animated.div)`
  position: relative;
  width: 50px;
  height: 25px;
  background-color: #ccc;
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

const EnableShipInsure: React.FC = () => {
  const { updateShipInsureAttribute } = useContext(CartContext)

  const handleToggle = () => {
    console.log("update attribute")
    updateShipInsureAttribute(false)
    // setIsShipInsureEnabled(!isShipInsureEnabled)
  }

  // const springProps = useSpring({
  //   transform: isShipInsureEnabled ? "translateX(25px)" : "translateX(0px)",
  //   backgroundColor: isShipInsureEnabled ? "#4caf50" : "#ccc",
  //   config: { duration: 200 },
  // })

  return (
    <SwitchWrapper>
      <Label>Enable ShipInsure shipping insurance</Label>
      <Switch
        role="switch"
        // aria-checked={isShipInsureEnabled}
        tabIndex={0}
        // style={{ backgroundColor: springProps.backgroundColor }}
        onClick={handleToggle}
      >
        {/* <Handle style={{ transform: springProps.transform }} /> */}
      </Switch>
    </SwitchWrapper>
  )
}

export default EnableShipInsure
