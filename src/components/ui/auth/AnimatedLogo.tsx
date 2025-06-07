"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  width?: number;
  height?: number;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ width = 150, height = 50 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} // y: -20
      animate={{ opacity: 1, scale: 1 }} // y: 0
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-8 flex justify-center"
    >
      <Image src="/logo.png" alt="Kurakey Logo" width={width} height={height} priority />
    </motion.div>
  );
};

export default AnimatedLogo;
