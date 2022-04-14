import React, { useEffect, useState, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper"
import { GatsbyImage } from "gatsby-plugin-image"
import { BsChevronLeft as Left, BsChevronRight as Right } from "react-icons/bs"
import styled from "styled-components"
import {
  ContentfulProduct,
  ContentfulProductVariant,
} from "../types/contentful"

import "swiper/css"

const Component = styled.div`
  .navigation {
    display: flex;
    flex-direction: row;
    align-items: center;
    a:hover {
      cursor: pointer;
    }
  }
  .prev {
    flex: 1 15%;
  }
  .next {
    flex: 1 15%;
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
    // console.log(`${uniqueId} SWIPER ===>`, swiperRef.current)
    if (!sliderRef.current) return

    const options: HTMLElement[] = Array.from(
      (sliderRef.current as HTMLDivElement).querySelectorAll(".option")
    )
    options.forEach(option => {
      if (option.getAttribute("data-option")?.includes(color)) {
        const index = Number(option.getAttribute("data-index"))
        clickHandler(variants[index])
        if (swiperRef.current) {
          // console.log(`${uniqueId} SET SLIDE TO`, index)
          swiperRef.current.slideTo(index, 200, false)
          setActiveIndex(index)
        }
      }
    })
  }

  return (
    <Component ref={sliderRef}>
      <div className="navigation">
        {variants.length > 6 && (
          <a className={`${uniqueId}-prev`} role="button">
            <Left />
          </a>
        )}

        <StyledSwiper
          centerInsufficientSlides
          className="options-swiper"
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
          slidesPerView={6}
          slideToClickedSlide={true}
          spaceBetween={3}
          watchOverflow
          watchSlidesProgress
        >
          {variants.map((variant: ContentfulProductVariant, i: number) => (
            <SwiperSlide
              key={i}
              onClick={e => {
                clickHandler(variant)
                setActiveIndex(i)
              }}
              className={`option ${i === activeIndex ? "active-option" : ""}`}
              data-option={variant.frameColor}
              data-index={i}
              virtualIndex={i}
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
        {variants.length > 6 && (
          <a className={`${uniqueId}-next`} role="button">
            <Right />
          </a>
        )}
      </div>
    </Component>
  )
}

export default ProductOptionsCarousel
