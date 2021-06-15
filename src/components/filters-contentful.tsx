import React, { Dispatch, useState, useEffect } from "react"
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
}

const FiltersContentful = ({
  collection,
  filters,
  setFilters,
  setProducts,
}: Props) => {
  const [panel, setPanel] = useState<string>("fitType")
  const [fitTypes, setFitTypes] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])

  useEffect(() => {
    generateFilters(collection.products)
  }, [])

  const filter = (type: string, value: string): void => {
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
              if (p.frameColor === f[filter]) {
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
    generateFilters(filteredProducts)
  }

  const generateFilters = (products: ContentfulProduct[]) => {
    // get fit type
    let fitTypesList = products.map(product => product.fitType)
    fitTypesList = fitTypesList.filter((v, i) => fitTypesList.indexOf(v) === i)
    // get colors
    let colorsList: string[] = []
    products.forEach(product =>
      product.variants.forEach(variant => colorsList.push(variant.frameColor))
    )
    colorsList = colorsList.filter((v, i) => colorsList.indexOf(v) === i)
    // set values
    setFitTypes(fitTypesList)
    setColors(colorsList.sort())
  }

  const reset = (): void => {
    setFilters({ fitType: null, colorName: null })
    setProducts(collection.products)
    generateFilters(collection.products)
  }

  const handlePanel = (panel: string): void => {
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
          {fitTypes.length &&
            fitTypes.map((fitType: string) => {
              return (
                <button
                  key={fitType}
                  type="button"
                  data-active={filters.fitType === fitType}
                  onClick={() => filter("fitType", fitType)}
                  aria-pressed={filters.fitType === fitType ? "true" : "false"}
                >
                  {fitType}
                </button>
              )
            })}
        </div>
      )}
      {panel === "color" && (
        <div>
          {colors.length &&
            colors.map((colorName: string) => {
              return (
                <button
                  key={colorName}
                  type="button"
                  data-active={filters.colorName === colorName}
                  onClick={() => filter("colorName", colorName)}
                  aria-pressed={
                    filters.colorName === colorName ? "true" : "false"
                  }
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
  text-align: center;
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
    text-transform: capitalize;
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
