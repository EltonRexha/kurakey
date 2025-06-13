import React from 'react';

const ShineButton = ({ children = 'Hover me', ...props }) => {
  return (
    <button
      className="group cursor-pointer w-full relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border-2 border-amber-400 bg-transparent px-6 font-medium text-amber-300 shadow-lg transition hover:scale-105 focus:outline-none"
      {...props}
    >
      <span className="relative z-10 drop-shadow">{children}</span>
      <div className="absolute inset-0 flex h-full w-full justify-center pointer-events-none [transform:skew(-12deg)_translateX(-100%)] group-hover:bg-gradient-to-r group-hover:from-amber-300/80 group-hover:to-yellow-400/80 group-hover:[transform:skew(-12deg)_translateX(100%)] group-hover:duration-1000">
        <div className="relative h-full w-8 bg-white/40 blur-sm"></div>
      </div>
    </button>
  );
};

export default ShineButton;
