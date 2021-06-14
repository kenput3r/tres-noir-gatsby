import React, { Dispatch, useState } from "react"
import { ContentfulCollection, ContentfulProduct } from "../types/contentful"
import styled from "styled-components"

interface Props {
  collection: ContentfulCollection
  filters: {
    fitType: null | string
    colorName: null | string
  }
  setFilters: Dispatch<{
    fitType: null | string
    colorName: null | string
  }>
  setProducts: Dispatch<ContentfulProduct[]>
  reset: () => void
}

const FiltersContentful = ({
  collection,
  filters,
  setFilters,
  setProducts,
  reset,
}: Props) => {
  const [panel, setPanel] = useState<string>("fitType")
  const frameWidths = ["Small", "Medium (Average)", "Large", "Extra Large"]
  const colors = [
    "Black",
    "Matte Black",
    "Black + Honey Tort",
    "Black + Clear",
    "Grey Tort",
    "Moss + Tort",
    "Amber",
    "Clear",
    "Transparent Blue",
    "Transparent Green",
    "Transparent Brown",
    "Transparent Grey",
    "Blonde Tort",
    "Tobacco Tort",
  ]

  const filter = (type: string, value: string) => {
    let filteredProducts: ContentfulProduct[] = collection.products
    const f = filters
    if (f[type] === value) {
      f[type] = null
    } else {
      f[type] = value
    }
    const keys = Object.keys(f)
    keys.map(filter => {
      if (f[filter]) {
        if (filter === "fitType") {
          filteredProducts = filteredProducts.filter(
            product => product.fitType === f[filter]
          )
        }
        if (filter === "colorName") {
          filteredProducts = filteredProducts.filter(product => {
            let found = false
            product.variants.map(p => {
              if (p.colorName.includes(f[filter] as string)) {
                found = true
              }
            })
            return found
          })
        }
      }
    })

    setProducts(filteredProducts)
    setFilters(f)
  }

  const handlePanel = (panel: string) => {
    setPanel(panel)
  }

  return (
    <Filters>
      <div>
        <ul>
          <li>
            <a href="#" onClick={() => handlePanel("fitType")}>
              Fit Type
            </a>
          </li>
          <li>
            <a href="#" onClick={() => handlePanel("color")}>
              Color
            </a>
          </li>
        </ul>
      </div>
      {panel === "fitType" && (
        <div>
          {frameWidths.map((w: string) => {
            const fitType = w.toLowerCase()
            return (
              <button
                key={fitType}
                type="button"
                data-active={filters.fitType === fitType}
                onClick={() => filter("fitType", fitType)}
              >
                {w}
              </button>
            )
          })}
        </div>
      )}
      {panel === "color" && (
        <div>
          {colors.map((colorName: string) => {
            return (
              <button
                key={colorName}
                type="button"
                data-active={filters.colorName === colorName}
                onClick={() => filter("colorName", colorName)}
              >
                {colorName}
              </button>
            )
          })}
        </div>
      )}
      <button type="button" onClick={reset}>
        RESET
      </button>
    </Filters>
  )
}

export default FiltersContentful

const Filters = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  a {
    text-decoration: none;
    color: var(--color-grey-dark);
    text-transform: uppercase;
  }
  button {
    &[data-active="true"] {
      background-color: #000;
      color: #fff;
    }
    padding: 4px 8px;
    margin: 3px;
    border: none;
    cursor: pointer;
  }
  ul {
    list-style-type: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    margin-left: 0;
    margin-bottom: 0;
    padding: 0 10px;
    position: relative;
    li {
      padding: 0 15px;
    }
  }
`
