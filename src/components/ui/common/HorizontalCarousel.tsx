'use client';
import React from 'react';

interface CarouselProps {
  /**
   * Slides to render inside the marquee. Each ReactNode is wrapped in a span so you
   * can pass <img> or any component.
   */
  children: React.ReactNode[];
  /** Total seconds for one full loop */
  speedSeconds?: number;
}

/**
 * Horizontal Carousel implemented with pure CSS keyframe animation.
 * It duplicates the children once, then translates `-50%` to create an infinite loop.
 * Hovering pauses the animation (uses Tailwind arbitrary `animation-play-state`).
 */
const HorizontalCarousel = ({ children, speedSeconds = 35 }: CarouselProps) => {
  // Duplicate the list once so we can scroll continuously
  const duplicated = [...children, ...children];

  return (
    <div className="relative overflow-hidden py-6 group">
      {/* Animation styles */}
      <style jsx global>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
          /* pause on hover handled via .group:hover .marquee */
        }

        .group:hover .marquee {
          animation-play-state: paused;
        }
      `}</style>

      <div
        className="marquee flex w-max whitespace-nowrap gap-10"
        style={{ animation: `slide ${speedSeconds}s linear infinite` }}
      >
        {duplicated.map((child, idx) => (
          <span key={idx} className="inline-block">
            {child}
          </span>
        ))}
      </div>
    </div>
  );
};

export default HorizontalCarousel;
