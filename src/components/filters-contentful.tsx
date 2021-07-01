import React, { Dispatch, useState, useEffect, useRef } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { ContentfulCollection, ContentfulProduct } from "../types/contentful"
import styled from "styled-components"
import { StaticImage, GatsbyImage } from "gatsby-plugin-image"
import { useSpring, animated, config } from "react-spring"
import { useHeight } from "../hooks/useHeight"

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

enum FilterTypes {
  FitType = "fitType",
  ColorName = "colorName",
}

const FiltersContentful = ({
  collection,
  filters,
  setFilters,
  setProducts,
}: Props) => {
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [panel, setPanel] = useState<string>(FilterTypes.FitType)
  const [fitTypes, setFitTypes] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])

  const staticColorImages = useStaticQuery(
    graphql`
      query {
        amber: file(relativePath: { eq: "amber.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30)
          }
        }
        black: file(relativePath: { eq: "black.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30)
          }
        }
        blue: file(relativePath: { eq: "blue.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30)
          }
        }
        brown: file(relativePath: { eq: "brown.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30)
          }
        }
        clear: file(relativePath: { eq: "clear.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30)
          }
        }
        green: file(relativePath: { eq: "green.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30)
          }
        }
        grey: file(relativePath: { eq: "grey.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30)
          }
        }
        tortoise: file(relativePath: { eq: "tortoise.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30)
          }
        }
        two_toned: file(relativePath: { eq: "two-toned.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30)
          }
        }
      }
    `
  )

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
        if (filter === FilterTypes.FitType) {
          filteredProducts = filteredProducts.filter(
            product => product.fitType === f[filter]
          )
        }
        if (filter === FilterTypes.ColorName) {
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
    console.log("PRODUCTS", products)
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

  const handleShowFilters = () => {
    console.log("SETTING SHOW FILTERS", !showFilters)
    setShowFilters(!showFilters)
  }

  const handlePanel = (panel: string): void => {
    setPanel(panel)
  }

  // React Spring
  const [heightRef, height] = useHeight()
  const slideInStyles = useSpring({
    config: { ...config.stiff },
    from: { opacity: 0, height: 0 },
    to: {
      opacity: showFilters ? 1 : 0,
      height: showFilters ? height : 0,
    },
  })

  return (
    <>
      <DisplayFilters>
        <button onClick={handleShowFilters}>Filters +</button>
      </DisplayFilters>

      <animated.div style={{ ...slideInStyles, overflow: "hidden" }}>
        <Filters ref={heightRef}>
          <div className="filter-header">
            <ul>
              <li>
                <button
                  className="filter-type"
                  type="button"
                  onClick={() => handlePanel(FilterTypes.FitType)}
                  data-active={panel === FilterTypes.FitType}
                  aria-pressed={
                    panel === FilterTypes.FitType ? "true" : "false"
                  }
                >
                  FRAME WIDTH
                </button>
              </li>
              <li>
                <button
                  className="filter-type"
                  type="button"
                  onClick={() => handlePanel(FilterTypes.ColorName)}
                  data-active={panel === FilterTypes.ColorName}
                  aria-pressed={
                    panel === FilterTypes.ColorName ? "true" : "false"
                  }
                >
                  COLOR
                </button>
              </li>
            </ul>
          </div>
          {panel === FilterTypes.FitType && (
            <div>
              {fitTypes.length &&
                fitTypes.map((fitType: string) => {
                  return (
                    <button
                      className="filter"
                      key={fitType}
                      type="button"
                      data-active={filters.fitType === fitType}
                      onClick={() => filter(FilterTypes.FitType, fitType)}
                      aria-pressed={
                        filters.fitType === fitType ? "true" : "false"
                      }
                    >
                      <StaticImage
                        src="../images/glasses-icon.png"
                        alt={fitType}
                        placeholder="tracedSVG"
                        style={{ marginBottom: 0 }}
                        width={75}
                      />
                      <br />
                      <span>{fitType}</span>
                    </button>
                  )
                })}
            </div>
          )}
          {panel === FilterTypes.ColorName && (
            <div>
              {colors.length &&
                colors.map((colorName: string) => {
                  const image = staticColorImages[colorName.replace("-", "_")]
                  return (
                    <button
                      className="filter"
                      key={colorName}
                      type="button"
                      data-active={filters.colorName === colorName}
                      onClick={() => filter(FilterTypes.ColorName, colorName)}
                      aria-pressed={
                        filters.colorName === colorName ? "true" : "false"
                      }
                    >
                      <GatsbyImage
                        image={image.childImageSharp.gatsbyImageData}
                        alt={colorName}
                        style={{ marginBottom: 0, marginRight: 10 }}
                      />
                      <span>{colorName}</span>
                    </button>
                  )
                })}
            </div>
          )}
          <button className="reset" type="button" onClick={reset}>
            RESET
          </button>
        </Filters>
      </animated.div>
    </>
  )
}

export default FiltersContentful

const DisplayFilters = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  button {
    border: none;
    background-color: transparent;
    color: #000;
    text-transform: uppercase;
    font-size: 1.2em;
    cursor: pointer;
    &:hover {
      color: var(--color-grey-dark);
    }
  }
`

const Filters = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: rgb(239, 239, 239);
  padding: 25px;
  margin-bottom: 25px;
  a {
    text-decoration: none;
    color: var(--color-grey-dark);
    text-transform: uppercase;
  }
  button {
    margin: 3px;
    border: none;
    cursor: pointer;
    text-transform: capitalize;
    color: var(--color-grey-dark);
    &:hover {
      border-radius: 15px;
      color: #000;
    }
    &.filter-type {
      &[data-active="true"] {
        color: #000;
      }
    }
    &.filter {
      &[data-active="true"] {
        background-color: #fff;
      }
      padding: 8px 12px;
      margin: 3px;
      border-radius: 15px;
      color: #000;
    }
    &.filter:hover {
      background-color: #fff;
    }
  }
  ul {
    border-top: 3px solid #000;
    border-bottom: 3px solid #000;
    list-style-type: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    margin-left: 0;
    margin-bottom: 15px;
    padding: 0 10px;
    position: relative;
    li {
      margin-bottom: 0;
      padding: 10px 25px;
    }
  }
`
