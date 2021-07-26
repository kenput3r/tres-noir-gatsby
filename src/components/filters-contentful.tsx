import React, { Dispatch, useState, useEffect } from "react"
import { ContentfulCollection, ContentfulProduct } from "../types/contentful"
import styled from "styled-components"
import { StaticImage, GatsbyImage } from "gatsby-plugin-image"
import { useSpring, useTransition, animated, config } from "react-spring"
import { useHeight } from "../hooks/useHeight"
import { useFrameColors } from "../hooks/useFrameColors"
import { getFilters } from "../utils/getContentfulCollectionFilters"

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

  const frameColors = useFrameColors()

  useEffect(() => {
    generateFilters(collection.products)
  }, [])

  const filter = (type: string, value: string): void => {
    let filteredProducts: ContentfulProduct[] = collection.products
    if (filters[type] === value) {
      filters[type] = null
    } else {
      filters[type] = value
    }
    const keys = Object.keys(filters)
    keys.map(filter => {
      if (filters[filter]) {
        if (filter === FilterTypes.FitType) {
          filteredProducts = filteredProducts.filter(
            product => product.fitType === filters[filter]
          )
        }
        if (filter === FilterTypes.ColorName) {
          filteredProducts = filteredProducts.filter(product => {
            let found = false
            product.variants.map(p => {
              if (p.frameColor === filters[filter]) {
                found = true
              }
            })
            return found
          })
        }
      }
    })

    setProducts(filteredProducts)
    setFilters(filters)
    generateFilters(filteredProducts)
  }

  const generateFilters = (products: ContentfulProduct[]) => {
    const { fitTypesList, colorsList } = getFilters(products)
    // set values
    setFitTypes(fitTypesList)
    setColors(colorsList)
  }

  const reset = (): void => {
    setFilters({ fitType: null, colorName: null })
    setProducts(collection.products)
    generateFilters(collection.products)
  }

  const handleShowFilters = () => {
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
      marginBottom: 25,
    },
  })

  return (
    <>
      <DisplayFilters>
        <button onClick={handleShowFilters}>Filter +</button>
      </DisplayFilters>

      <animated.div style={{ ...slideInStyles, overflow: "hidden" }}>
        <div ref={heightRef}>
          <Triangle>
            <div className="triangle" />
          </Triangle>
          <Filters>
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
                        className="filter frame-filter"
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
                          width={150}
                        />
                        <p>{fitType}</p>
                      </button>
                    )
                  })}
              </div>
            )}
            {panel === FilterTypes.ColorName && (
              <div>
                {colors.length &&
                  colors.map((colorName: string) => {
                    const image = frameColors[colorName.replace("-", "_")]
                    return (
                      <button
                        className="filter color-filter"
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
        </div>
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
  margin-top: 20px;
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

const Triangle = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  .triangle {
    width: 0px;
    height: 0px;
    background: black;
    border: 20px solid;
    border-top-color: #fff;
    border-left-color: #fff;
    border-right-color: #fff;
    border-bottom-color: rgb(239, 239, 239);
    margin-top: -20px;
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
    text-transform: uppercase;
    color: var(--color-grey-dark);
    font-size: 1.2em;
    &:hover {
      border-radius: 15px;
      color: #000;
    }
    &.filter-type {
      /* font-size: 1.2em; */
      &[data-active="true"] {
        color: #000;
      }
    }
    &.filter {
      padding: 8px 12px;
      margin: 20px;
      border-radius: 15px;
      color: #000;
      &[data-active="true"] {
        background-color: #fff;
      }
    }
    &.filter:hover {
      background-color: #fff;
    }
    &.frame-filter {
      p {
        margin: 0.65rem 0.65rem;
      }
    }
    &.color-filter {
      line-height: 50px;
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
