import React, { useContext, useEffect } from "react"
import styled from "styled-components"
import { useStaticQuery, graphql, Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { CartContext } from "../contexts/cart"
import { CustomerContext } from "../contexts/customer"
import { useQuantityQuery } from "../hooks/useQuantityQuery"

const Component = styled.section`
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
    place-items: center;
    > div {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 15px;
      text-align: center;
      @media (max-width: 600px) {
        margin: 20px 11px 20px 11px;
      }
      a {
        color: black;
        text-decoration: none;
        :visited {
          text-decoration: none;
          color: black;
        }
      }
      p {
        margin-bottom: 5px;
      }
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
  .btn {
    @media (max-width: 600px) {
      font-size: 0.9rem;
      padding: 8px 10px;
    }
  }
  p {
    font-family: var(--heading-font);
    text-transform: uppercase;
  }
`

const YouMayAlsoLike = (props: { collectionItems: any }) => {
  const { collectionItems } = props
  const { addProductToCart, checkout } = useContext(CartContext)
  const { customerEmail } = useContext(CustomerContext)

  const handleAddToCart = product => {
    addProductToCart(product.variants[0].storefrontId, 1)
    alert("ADDED TO CART")
  }

  const quantityLevelsAll = collectionItems.map(element => {
    console.log("element", element)
    return useQuantityQuery(element.handle, element.variants.length)
  })
  console.log("qu", quantityLevelsAll)

  return (
    <Component>
      <div className="hr-wrapper">
        <hr />
      </div>
      <h6>You May Also Like</h6>
      <div className="row">
        <div className="upsell-cards">
          {collectionItems.map((product, index) => {
            return (
              <div className="upsell-product" key={product.id}>
                <Link to={`/products/${product.handle}`}>
                  <div className="upsell-image">
                    <GatsbyImage
                      image={
                        product.featuredImage.localFile.childImageSharp
                          .gatsbyImageData
                      }
                      alt={product.title}
                    ></GatsbyImage>
                  </div>
                  <div>
                    <p>{product.title}</p>
                  </div>
                </Link>
                <div>
                  <p>${product.variants[0].price}</p>
                </div>
                <div>
                  {quantityLevelsAll &&
                  quantityLevelsAll[index] &&
                  quantityLevelsAll[index][product.variants[0].sku] !== 0 ? (
                    <button
                      type="button"
                      className="btn"
                      onClick={evt => handleAddToCart(product)}
                    >
                      ADD TO CART
                    </button>
                  ) : (
                    <button type="button" className="sold-out btn">
                      SOLD OUT
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Component>
  )
}

export default YouMayAlsoLike
