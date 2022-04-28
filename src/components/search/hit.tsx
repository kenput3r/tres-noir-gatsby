import React from "react"
import { Link } from "gatsby"
import { Highlight } from "react-instantsearch-dom"
import styled from "styled-components"

interface Props {
  handle: string
  image: string
  max_variant_price: string
  min_variant_price: string
  objectID: string
  option_names: string[]
  price: string
  product_type: string
  style_description: string
  tags: string[]
  title: string
  vendor: string
}

const Component = styled.article`
  padding: 15px;
  .product-title {
    font-weight: bold;
    text-transform: uppercase;
    font-size: 32px;
    line-height: 35px;
    margin-bottom: 5px;
    a {
      color: #000;
      text-decoration: none;
    }
  }
  .product-price {
    text-transform: uppercase;
    color: #808080;
    font-size: 32px;
    line-height: 35px;
  }
`

const StyledHighlight = styled(Highlight)`
  .ais-Highlight-highlighted,
  .ais-Snippet-highlighted {
    background-color: rgba(253, 218, 13, 0.1);
    color: #fdda0d;
    font-style: normal;
  }
`

const Hit = ({ hit }: { hit: Props }) => {
  const pricing =
    hit.price !== "" ? `$${hit.price}` : `From $${hit.min_variant_price}`

  return (
    <Component>
      <Link to={`/products/${hit.handle}`}>
        <img src={hit.image} alt={hit.title} />
      </Link>
      <h3 className="product-title">
        <Link to={`/products/${hit.handle}`}>
          <StyledHighlight attribute="title" hit={hit} />
        </Link>
      </h3>
      <p className="product-price">{pricing}</p>
    </Component>
  )
}

export default Hit
