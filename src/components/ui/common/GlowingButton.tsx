import React from 'react';

interface GlowingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const GlowingButton: React.FC<GlowingButtonProps> = ({
  children,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseClasses = `
    px-5 py-2.5 uppercase rounded-lg text-[17px] font-medium text-white/50
    bg-transparent cursor-pointer border border-white/50
    transition-all duration-500 ease-in-out select-none
    focus:outline-none
  `;

  const hoverFocusClasses = `
    hover:text-white hover:bg-[#008cff] hover:border-[#008cff]
    hover:shadow-[0_0_10px_#008cff,0_0_30px_#008cff,0_0_60px_#008cff]
    focus:text-white focus:bg-[#008cff] focus:border-[#008cff]
    focus:shadow-[0_0_10px_#008cff,0_0_30px_#008cff,0_0_60px_#008cff]
  `;

  const widthClass = fullWidth ? 'w-full' : 'inline-block';

  return (
    <button
      className={`${baseClasses} ${hoverFocusClasses} ${widthClass} ${className}`
        .trim()
        .replace(/\s+/g, ' ')}
      {...props}
    >
      {children}
    </button>
  );
};

export default GlowingButton;
