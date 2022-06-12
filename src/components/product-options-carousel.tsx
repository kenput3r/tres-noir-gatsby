import React, { useEffect, useState, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper"
import { GatsbyImage } from "gatsby-plugin-image"
import { BsChevronLeft as Left, BsChevronRight as Right } from "react-icons/bs"
import styled from "styled-components"
import { ContentfulProductVariant } from "../types/contentful"

import "swiper/css"
import NotFoundPage from "../pages/404"

const Component = styled.div`
  .navigation {
    display: flex;
    flex-direction: row;
    align-items: center;
    a:hover {
      cursor: pointer;
    }
  }
  .nav-prev {
    flex: 1 15%;
    line-height: 0;
  }
  .nav-next {
    flex: 1 15%;
    line-height: 0;
  }
  .options-swiper {
    flex: 1 70%;
  }
`

const OptionImage = styled.div`
  background-color: transparent;
  border: 1px solid #fff;
  border-radius: 50%;
  line-height: 0;
  margin-right: 5px;
  padding: 5px;
  max-width: 40px;
  &[data-active="true"] {
    border-color: #000;
  }
  :hover {
    cursor: pointer;
  }
  .gatsby-image-wrapper {
    border-radius: 50%;
  }
`

const StyledSwiper = styled(Swiper)`
  .active-option {
    .option-image {
      border-color: #000;
    }
  }
`

interface Props {
  uniqueId: string
  variants: ContentfulProductVariant[]
  clickHandler: (variant) => void
  color: null | string
}

const ProductOptionsCarousel = ({
  uniqueId,
  variants,
  clickHandler,
  color,
}: Props) => {
  const sliderRef = useRef(null)
  const mounted = useRef(false)
  const swiperRef = useRef(null) as any

  const [activeIndex, setActiveIndex] = useState<number>(0)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    if (color && mounted.current) selectColors(color)
  }, [color])

  const selectColors = (color: string): void => {
    if (!sliderRef.current) return

    const options: HTMLElement[] = Array.from(
      (sliderRef.current as HTMLDivElement).querySelectorAll(".option")
    )
    let found: { index: number; dominantColor: string; frameColors: any }[] = []
    options.forEach(option => {
      let targetIndex: number
      if (option.getAttribute("data-frame-colors")?.includes(color)) {
        const index = Number(option.getAttribute("data-index"))
        const dominantColor = option.getAttribute("data-dominant-color") || ""
        found.push({
          index,
          dominantColor,
          frameColors: option.getAttribute("data-frame-colors"),
        })
      }
    })
    // if multiple options have color use dominant color for match
    if (found.length > 0) {
      let matchedIndex: number = -1
      if (found.length > 1) {
        const dominantMatch = found.find(el => el.dominantColor === color)
        if (dominantMatch) matchedIndex = dominantMatch?.index
      } else {
        matchedIndex = found[0].index
      }
      // if color !== dominant color match to first found
      if (matchedIndex === -1) matchedIndex = found[0].index
      clickHandler(variants[matchedIndex])
      if (swiperRef.current) {
        swiperRef.current.slideTo(matchedIndex, 200, false)
        setActiveIndex(matchedIndex)
      }
    }
  }

  return (
    <Component ref={sliderRef}>
      <div className="navigation">
        {variants.length > 6 ? (
          <div className="nav-prev">
            <a className={`prev ${uniqueId}-prev`} role="button">
              <Left />
            </a>
          </div>
        ) : (
          <div className="nav-prev"></div>
        )}

        <StyledSwiper
          slidesPerView={4}
          spaceBetween={1}
          centerInsufficientSlides
          className="options-swiper"
          breakpoints={{
            "480": {
              slidesPerView: 4,
              spaceBetween: 1,
            },
            "768": {
              slidesPerView: 4,
              spaceBetween: 1,
            },
            "1024": {
              slidesPerView: 5,
              spaceBetween: 1,
            },
            "1200": {
              slidesPerView: 6,
              spaceBetween: 1,
            },
          }}
          grabCursor
          initialSlide={0}
          modules={[Navigation]}
          navigation={
            variants.length > 6
              ? {
                  nextEl: `.${uniqueId}-next`,
                  prevEl: `.${uniqueId}-prev`,
                }
              : false
          }
          onInit={(swiper: any) => {
            swiperRef.current = swiper
          }}
          swipeHandler=".options-swiper"
          touchRatio={1}
          touchReleaseOnEdges={true}
          touchStartForcePreventDefault={true}
          threshold={15}
          watchSlidesProgress
        >
          {variants.map((variant: ContentfulProductVariant, i: number) => (
            <SwiperSlide
              key={`${uniqueId}-${i}`}
              onClick={e => {
                clickHandler(variant)
                setActiveIndex(i)
              }}
              className={`option ${i === activeIndex ? "active-option" : ""}`}
              data-frame-colors={variant.frameColor}
              data-dominant-color={variant.dominantFrameColor}
              data-index={i}
            >
              <OptionImage className="option-image">
                <GatsbyImage
                  image={variant.colorImage.data}
                  alt={variant.colorName}
                  loading="eager"
                />
              </OptionImage>
            </SwiperSlide>
          ))}
        </StyledSwiper>

        {variants.length > 6 ? (
          <div className="nav-next">
            <a className={`next ${uniqueId}-next`} role="button">
              <Right />
            </a>
          </div>
        ) : (
          <div className="nav-next"></div>
        )}
      </div>
    </Component>
  )
}

export default ProductOptionsCarousel
