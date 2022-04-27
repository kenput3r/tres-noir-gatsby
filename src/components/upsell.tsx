import React, { useContext } from "react"
import styled from "styled-components"
import { useStaticQuery, graphql, Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { CartContext } from "../contexts/cart"
import { CustomerContext } from "../contexts/customer"

const Component = styled.section`
  background: white;
  .upsell-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
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
                  <button
                    className="btn"
                    type="button"
                    onClick={evt => handleAddToCart(product)}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Component>
  )
}

export default Upsell
