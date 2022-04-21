import React, { useContext } from "react"
import styled from "styled-components"
import { useStaticQuery, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { CartContext } from "../contexts/cart"
import { CustomerContext } from "../contexts/customer"

const Component = styled.section`
  background: white;
  .upsell-cards {
    display: flex;
    > div {
      flex: 1;
    }
  }
  h6 {
    text-align: center;
    font-size: 1.6rem;
    font-weight: normal;
    text-transform: uppercase;
  }
`

const getUpsellItems = () => {
  const { shopifyCollection } = useStaticQuery(graphql`
    query GetUpsellProducts {
      shopifyCollection(handle: { eq: "upsell" }) {
        products {
          id
          featuredImage {
            localFile {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
          title
          handle
          variants {
            storefrontId
            price
          }
          storefrontId
        }
      }
    }
  `)
  return shopifyCollection
}

const Upsell = () => {
  const { addProductToCart, checkout } = useContext(CartContext)
  const { customerEmail } = useContext(CustomerContext)

  const handleAddToCart = product => {
    addProductToCart(product.variants[0].storefrontId, 1)
  }

  const upsellItems = getUpsellItems()
  return (
    <Component>
      <h6>Suggested Addons</h6>
      <div className="row">
        <div className="upsell-cards">
          {upsellItems.products.map(product => {
            console.log(product)
            return (
              <div className="upsell-product" key={product.id}>
                <div>
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
                <div>
                  <p>${product.variants[0].price}</p>
                </div>
                <button
                  className="btn"
                  type="button"
                  onClick={evt => handleAddToCart(product)}
                >
                  ADD TO CART
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </Component>
  )
}

export default Upsell
