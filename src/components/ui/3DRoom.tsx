'use client';
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize } from 'lucide-react';

interface Room3DProps {
  playcanvasLink: string;
}

const Room3D: React.FC<Room3DProps> = ({ playcanvasLink }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleIframeLoad = () => {
    // Give PlayCanvas a moment to initialize after iframe loads
    setTimeout(() => {
      setIsLoading(false);
    }, 2200);
  };
  const handleMaximize = () => {
    setIsFullscreen((prev) => !prev);
  };

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
            className="absolute inset-0 z-10 flex items-center justify-center bg-[#191838]"
          >
            <div className="w-16 h-16 border-4 border-[#008cff] border-t-transparent rounded-full animate-spin shadow-[0_0_15px_#008cff50]" />
          </motion.div>
        )}
      </AnimatePresence>{' '}
        <div className="w-full h-full overflow-hidden relative">
          <iframe
            ref={iframeRef}
            src={playcanvasLink}
            loading="lazy"
            allow="autoplay; fullscreen *; geolocation; microphone; camera; midi; monetization; xr-spatial-tracking; gamepad; gyroscope; accelerometer; xr; cross-origin-isolated"
            className={`border-0 scale-[1.01] transform-gpu [&_canvas]:rounded-xl transition-all duration-300 ${
              isFullscreen
                ? 'fixed inset-0 w-screen h-[calc(100vh+100px)] -mb-[100px] z-50'
                : 'w-full h-[calc(100%+50px)] -mb-[50px]'
            }`}
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden',
            }}
            onLoad={handleIframeLoad}
          />{' '}
          {!isLoading && (
            <button
              onClick={handleMaximize}
              className={`${
                isFullscreen ? 'fixed' : 'absolute'
              } p-2 rounded-lg bg-[#18173a]/80 border border-[#23224a] text-sky-400 transition-all duration-300 hover:scale-110 hover:bg-[#18173a] hover:shadow-[0_0_15px_#008cff33] group bottom-4 right-4 ${
                isFullscreen ? 'z-[60]' : 'z-10'
              }`}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <Maximize
                className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 ${
                  isFullscreen ? 'rotate-45' : ''
                }`}
              />
            </button>
          )}
        </div>
    </motion.div>
  );
};

export default Room3D;
