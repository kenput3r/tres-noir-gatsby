import React from "react"
import { Link } from "gatsby"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore, { Pagination, Navigation } from "swiper/core"
import { GatsbyImage } from "gatsby-plugin-image"
import { BsChevronLeft as Left, BsChevronRight as Right } from "react-icons/bs"
import styled from "styled-components"

import "swiper/swiper-bundle.min.css"
import "swiper/components/pagination/pagination.min.css"
import "swiper/components/navigation/navigation.min.css"

interface ImageSet {
  data: any
  title: string
}

SwiperCore.use([Navigation])

const Carousel = ({
  imageSet,
  imageLinks,
}: {
  imageSet: [ImageSet]
  imageLinks: string[]
}) => {
  return (
    <Component>
      <div className="navigation">
        <a className="prev" role="button">
          <Left />
        </a>
        <StyledSwiper
          slidesPerView={1}
          spaceBetween={10}
          loop={true}
          navigation={{ nextEl: ".next", prevEl: ".prev" }}
          className="mySwiper"
          breakpoints={{
            "480": {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            "768": {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            "1024": {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
        >
          {imageSet.map((image: ImageSet, i: number) => (
            <SwiperSlide key={`thumb-${i}`}>
              <Link to={imageLinks[i]}>
                <GatsbyImage
                  image={image.data}
                  alt={image.title}
                  loading="eager"
                />
              </Link>
            </SwiperSlide>
          ))}
        </StyledSwiper>
        <a className="next" role="button">
          <Right />
        </a>
      </div>
    </Component>
  )
}

export default Carousel

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
    padding-right: 10px;
  }
  .next {
    padding-left: 10px;
  }
`

const StyledSwiper = styled(Swiper)`
  max-width: 100%;
  .swiper-slide {
    max-width: 100%;
  }
  /* .swiper-slide {
    line-height: 0;
    margin-left: 5px;
    max-width: calc(33.333% - 15px);
    &:hover {
      cursor: pointer;
    }
  } */
`
