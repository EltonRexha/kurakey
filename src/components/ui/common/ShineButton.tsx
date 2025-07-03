import React from 'react';

interface ShineButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const ShineButton = ({ children = 'Hover me', ...props }: ShineButtonProps) => {
  const isDisabled = props.disabled;
  return (
    <button
      className={`group/btn w-full relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border-2 border-amber-400 bg-transparent px-6 font-medium text-amber-300 shadow-lg transition hover:scale-105 focus:outline-none
        ${
          isDisabled
            ? 'opacity-60 cursor-not-allowed pointer-events-none hover:scale-100'
            : 'cursor-pointer'
        }`}
      disabled={isDisabled}
      {...props}
    >
      <span className="relative z-10 drop-shadow">{children}</span>
      {!isDisabled && (
        <div className="absolute inset-0 flex h-full w-full justify-center pointer-events-none [transform:skew(-12deg)_translateX(-100%)] group-hover/btn:bg-gradient-to-r group-hover/btn:from-amber-300/80 group-hover/btn:to-yellow-400/80 group-hover/btn:[transform:skew(-12deg)_translateX(100%)] group-hover/btn:duration-1000">
          <div className="relative h-full w-8 bg-white/40 blur-sm"></div>
        </div>
      )}
    </button>
  );
};

export default ShineButton;
