import React from "react"
import styled from "styled-components"
import { StaticImage } from "gatsby-plugin-image"

const Component = styled.div`
  text-align: center;
  .top-msg {
    font-family: var(--heading-font);
    font-weight: normal;
    margin-top: 0.5rem;
    margin-bottom: 0.2rem;
    font-size: 1.5rem;
    @media screen and (max-width: 480px) {
      font-size: 1.3rem;
    }
  }
  .bottom-msg {
    color: var(--color-grey-dark);
    font-family: var(--sub-heading-font);
    font-weight: normal;
    font-size: 1.25rem;
    @media screen and (max-width: 480px) {
      font-size: 1rem;
    }
  }
`

const FreeShipping = () => {
  return (
    <Component>
      <div className="shipping-message">
        <StaticImage
          src="../images/double-diamonds.png"
          alt="double diamonds"
          width={38}
        />
        <p className="top-msg">FREE SHIPPING IN USA</p>
        <p className="bottom-msg">ALL ORDERS SHIP SAME OR NEXT BUSINESS DAY</p>
      </div>
    </Component>
  )
}

export default FreeShipping
