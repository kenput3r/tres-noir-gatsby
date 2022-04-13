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
import "swiper/css/navigation"

const Component = styled.div``

const OptionImage = styled(GatsbyImage)`
  cursor: pointer;
`

const StyledSwiper = styled(Swiper)`
  .swiper-slide-active {
    border: 1px solid #000;
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
        }

        // option.click()
        // swiperRef.current.update()
      }
    })
  }

  return (
    <Component ref={sliderRef}>
      <StyledSwiper
        centerInsufficientSlides
        className="options-swiper"
        grabCursor
        initialSlide={0}
        modules={[Navigation]}
        navigation
        onInit={(swiper: any) => {
          swiperRef.current = swiper
        }}
        slidesPerView={6}
        slideToClickedSlide={true}
        spaceBetween={3}
        // watchOverflow
        watchSlidesProgress
      >
        {variants.map((variant: ContentfulProductVariant, i: number) => (
          <SwiperSlide
            key={i}
            onClick={e => {
              clickHandler(variant)
              swiperRef.current.slideTo(i, 200, true)
            }}
            className="option"
            data-option={variant.frameColor}
            data-index={i}
            virtualIndex={i}
          >
            <OptionImage
              image={variant.colorImage.data}
              alt={variant.colorName}
              loading="eager"
            />
          </SwiperSlide>
        ))}
      </StyledSwiper>
    </Component>
  )
}

export default ProductOptionsCarousel
