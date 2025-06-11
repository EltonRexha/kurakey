'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

interface CarouselProps {
  children: React.ReactNode[];
}

const HorizontalCarousel = ({ children }: CarouselProps) => {
  // Duplicate the items 3 times for continuous scrolling
  const duplicatedChildren = [...children, ...children, ...children];

  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={16}
      slidesPerView="auto"
      loop={true}
      speed={1000}
      autoplay={{
        delay: 0, // No delay for continuous scrolling
        disableOnInteraction: false,
      }}
      className="w-full select-none"
    >
      {duplicatedChildren.map((child, index) => (
        <SwiperSlide key={index} className="!w-auto" style={{ opacity: 1 }}>
          {child}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HorizontalCarousel;
