import React, { useContext, useState } from "react"
import styled from "styled-components"
import { CartContext } from "../contexts/cart"
import { useQuantityQuery } from "../hooks/useQuantityQuery"
import UpsellProduct from "./upsell-product"
import { useRandomizeCollection } from "../hooks/useRandomizeCollection"

const Component = styled.section`
  margin-bottom: 40px;
  background: white;
  .hr-wrapper {
    margin-right: 15px;
    margin-right: 15px;
    hr {
      padding: 0;
      background-color: black;
      margin: 30px auto;
      max-width: 960px;
      width: 100%;
    }
  }
  .upsell-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr;
    @media (max-width: 600px) {
      grid-auto-flow: column;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
    }
  }
  .upsell-image {
    max-width: 280px;
    margin-bottom: 10px;
  }
  h6 {
    text-align: center;
    font-size: 1.6rem;
    font-weight: normal;
    text-transform: uppercase;
  }
`

const YouMayAlsoLike = (props: { shopifyProduct: any }) => {
  const { shopifyProduct } = props

  const collectionItems = useRandomizeCollection(shopifyProduct)
  const { addProductToCart } = useContext(CartContext)

  const handleAddToCart = product => {
    addProductToCart(product.variants[0].storefrontId, 1)
    alert("ADDED TO CART")
  }

  const quantityLevelsAll = collectionItems.map(element => {
    return useQuantityQuery(element.handle, element.variants.length)
  })

  return (
    <Component>
      <div className="hr-wrapper">
        <hr />
      </div>
      <h6>You May Also Like</h6>
      <div className="row">
        <div className="upsell-cards">
          {collectionItems.map(product => {
            return <UpsellProduct key={product.id} product={product} />
          })}
        </div>
      </div>
    </Component>
  )
}

export default YouMayAlsoLike
