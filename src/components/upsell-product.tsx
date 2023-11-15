import React, { useState, useContext, ChangeEvent, useEffect } from "react"
import { useQuantityQuery } from "../hooks/useQuantityQuery"
import { GatsbyImage, StaticImage } from "gatsby-plugin-image"
import { Link } from "gatsby"
import { CartContext } from "../contexts/cart"
import styled from "styled-components"
import { addedToCartGTMEvent } from "../helpers/gtm"
import { UpsellItem, UpsellItemVariant } from "../types/upsell"
import AddToCartButton from "./add-to-cart-button"

const Component = styled.article`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px;
  text-align: center;
  @media (max-width: 600px) {
    margin: 15px 10px;
  }
  a {
    color: black;
    text-decoration: none;
    :visited {
      text-decoration: none;
      color: black;
    }
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
    margin-bottom: 5px;
  }
  .variant-select {
    font-family: var(--sub-heading-font);
  }
  .select-price {
    display: flex;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 600px) {
      flex-direction: column;
    }
    select {
      margin-right: 18px;
      @media screen and (max-width: 600px) {
        font-size: 0.95rem;
        margin: 0 0 8px 0;
      }
    }
    margin-bottom: 8px;
  }
  .upsell-image {
    max-width: 280px;
    :hover {
      opacity: 0.7;
    }
  }
  .product-title {
    :hover {
      text-decoration: underline;
    }
  }
`

const UpsellProduct = (props: { upsellProduct: UpsellItem }) => {
  const { upsellProduct } = props

  const quantityLevels = useQuantityQuery(
    upsellProduct.handle,
    upsellProduct.variants.length
  )

  const [selectedVariant, setSelectedVariant] = useState(
    upsellProduct.variants[0]
  )

  const [featuredImage, setFeaturedImage] = useState(
    upsellProduct.featuredImage.localFile.childImageSharp.gatsbyImageData
  )

  useEffect(() => {
    let firstVariant: UpsellItemVariant = upsellProduct.variants[0]
    for (let key in quantityLevels) {
      if (quantityLevels[key] > 0) {
        firstVariant = upsellProduct.variants.find(
          (_variant: UpsellItemVariant) => _variant.sku === key
        ) as UpsellItemVariant
        break
      }
    }

    if (firstVariant) setSelectedVariant(firstVariant)
  }, [quantityLevels])

  const { addProductToCart, isAddingToCart } = useContext(CartContext)

  const handleAddToCart = () => {
    const id = selectedVariant.storefrontId
    const sku = selectedVariant.sku
    const image = selectedVariant.image
      ? selectedVariant.image.localFile.childImageSharp.gatsbyImageData
      : upsellProduct.featuredImage.localFile.childImageSharp.gatsbyImageData

    addProductToCart(id, 1, sku, image)
    // gtm event
    const productData = {
      title: selectedVariant.product.title,
      legacyResourceId: selectedVariant.legacyResourceId,
      sku: selectedVariant.sku,
      productType: selectedVariant.product.productType,
      image: selectedVariant?.image?.originalSrc
        ? selectedVariant.image?.originalSrc
        : selectedVariant.product.featuredImage.originalSrc,
      url: selectedVariant.product.onlineStoreUrl,
      vendor: selectedVariant.product.vendor,
      price: selectedVariant.price,
      compareAtPrice: selectedVariant.compareAtPrice,
      collections: selectedVariant.product.collections.map(
        (collection: { title: string }) => collection.title
      ),
      quantity: 1,
    }
    addedToCartGTMEvent(productData)
  }

  const handleVariant = (evt: ChangeEvent<HTMLSelectElement>) => {
    const sku = evt.target.value
    const newVariant = upsellProduct.variants.find(
      (_variant: UpsellItemVariant) => _variant.sku === sku
    ) as UpsellItemVariant

    if (
      newVariant &&
      newVariant.image &&
      newVariant.image.localFile &&
      newVariant.selectedOptions.some(e => e.name !== "Size")
    ) {
      setFeaturedImage(
        newVariant.image.localFile.childImageSharp.gatsbyImageData
      )
    }
    setSelectedVariant(newVariant)
  }

  const sortVariants = (variants: UpsellItemVariant[]) => {
    return variants.sort((a, b) => a.position - b.position)
  }

  return (
    <Component>
      <div className="upsell-product">
        <div className="upsell-image">
          <Link to={`/products/${upsellProduct.handle}`}>
            {upsellProduct.featuredImage?.localFile ? (
              <GatsbyImage
                image={featuredImage}
                alt={upsellProduct.title}
              ></GatsbyImage>
            ) : (
              <StaticImage
                src="../images/product-no-image.jpg"
                alt={upsellProduct.title}
              ></StaticImage>
            )}
          </Link>
        </div>
        <div className="product-title">
          <Link to={`/products/${upsellProduct.handle}`}>
            <p>{upsellProduct.title}</p>
          </Link>
        </div>
        <div className="select-price">
          <div>
            {!upsellProduct.hasOnlyDefaultVariant && (
              <div className="variant-select">
                <div className="select-dropdown">
                  <select
                    id="product-variants"
                    onChange={evt => handleVariant(evt)}
                    value={selectedVariant.sku}
                  >
                    {sortVariants(upsellProduct.variants).map(element => {
                      return (
                        <option key={element.sku} value={element.sku}>
                          {element.title}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>
            )}
          </div>
          <p>${selectedVariant.price}</p>
        </div>
        <div>
          {quantityLevels && quantityLevels[selectedVariant.sku] > 0 ? (
            <AddToCartButton
              handler={handleAddToCart}
              loading={isAddingToCart}
              soldOut={false}
            />
          ) : (
            <AddToCartButton soldOut={true} />
          )}
        </div>
      </div>
    </Component>
  )
}

export default UpsellProduct
