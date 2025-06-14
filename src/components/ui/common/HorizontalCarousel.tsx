'use client';
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
    <div
      style={{
        opacity: 1,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView="auto"
        loop={true}
        speed={1500}
        autoplay={{
          delay: 0,
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
    </div>
  );
};

export default HorizontalCarousel;
