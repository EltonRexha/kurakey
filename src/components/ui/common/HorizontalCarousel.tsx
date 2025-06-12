import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { ClipLoader } from 'react-spinners';
import 'swiper/css';

interface CarouselProps {
  children: React.ReactNode[];
}

const HorizontalCarousel = ({ children }: CarouselProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [opacity, setOpacity] = useState(0);
  // Duplicate the items 3 times for continuous scrolling
  const duplicatedChildren = [...children, ...children, ...children];

  useEffect(() => {
    setOpacity(1);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        className="w-full flex justify-center items-center py-10"
        style={{
          opacity: opacity,
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        <ClipLoader color="#008cff" speedMultiplier={0.7} size={130} />
      </div>
    );
  }

  return (
    <div
      style={{
        opacity: isLoading ? 0 : 1,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      <Swiper
        modules={[Autoplay]}
        spaceBetween={16}
        slidesPerView="auto"
        loop={true}
        speed={1000}
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
