'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Room3DProps {
  playcanvasLink: string;
}

const Room3D: React.FC<Room3DProps> = ({ playcanvasLink }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView) {
      const loadTimer = setTimeout(() => {
        setHasLoaded(true);
      }, 6000);

      return () => clearTimeout(loadTimer);
    }
  }, [isInView]);

  useEffect(() => {
    if (hasLoaded) {
      const fadeTimer = setTimeout(() => {
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(fadeTimer);
    }
  }, [hasLoaded]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full relative overflow-hidden rounded-2xl bg-[#203443]/50"
    >
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-[#203443]/50 backdrop-blur-sm"
          >
            <div className="w-16 h-16 border-4 border-[#55f279] border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {hasLoaded && isInView && (
        <div className="w-full h-full overflow-hidden">
          <iframe
            src={playcanvasLink}
            loading="lazy"
            allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; monetization; xr-spatial-tracking; gamepad; gyroscope; accelerometer; xr; cross-origin-isolated"
            className="w-full h-[calc(100%+50px)] -mb-[50px] border-0 scale-[1.01] transform-gpu"
            onLoad={() => setHasLoaded(true)}
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default Room3D;