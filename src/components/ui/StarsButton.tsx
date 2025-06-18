import React from 'react';

interface StarsButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
  bgColor?: string;
  borderColor?: string;
}

const StarsButton: React.FC<StarsButtonProps> = ({
  children,
  fullWidth = false,
  className = '',
  bgColor = '#f59e0b',
  borderColor = '#d97706',
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`relative px-9 py-3 text-neutral-100 text-[17px] font-medium rounded-lg shadow-none transition-all duration-300 ease-in-out
        ${
          disabled
            ? 'opacity-60 cursor-not-allowed hover:shadow-none'
            : 'hover:bg-transparent hover:shadow-[0_0_25px_var(--btn-bg)66] cursor-pointer group'
        }
        ${className} ${fullWidth ? 'w-full' : ''}`}
      style={
        {
          background: bgColor,
          border: `3px solid ${borderColor}`,
          ...(disabled
            ? { color: '#b0b0b0', background: bgColor, borderColor }
            : {}),
          '--btn-bg': bgColor,
        } as React.CSSProperties
      }
    >
      {children}
      {!disabled &&
        [1, 2, 3, 4, 5, 6].map((star) => {
          const starClasses: Record<number, string> = {
            1: 'top-[20%] left-[20%] w-[25px] duration-[1000ms] [transition-timing-function:cubic-bezier(0.05,0.83,0.43,0.96)] group-hover:top-[-80%] group-hover:left-[-30%]',
            2: 'top-[45%] left-[45%] w-[15px] duration-[1000ms] [transition-timing-function:cubic-bezier(0,0.4,0,1.01)] group-hover:top-[-25%] group-hover:left-[10%]',
            3: 'top-[40%] left-[40%] w-[5px] duration-[1000ms] [transition-timing-function:cubic-bezier(0,0.4,0,1.01)] group-hover:top-[55%] group-hover:left-[25%]',
            4: 'top-[20%] left-[40%] w-[8px] duration-[800ms] [transition-timing-function:cubic-bezier(0,0.4,0,1.01)] group-hover:top-[30%] group-hover:left-[80%]',
            5: 'top-[25%] left-[45%] w-[15px] duration-[600ms] [transition-timing-function:cubic-bezier(0,0.4,0,1.01)] group-hover:left-[115%]',
            6: 'top-[5%] left-[50%] w-[5px] duration-[800ms] ease-in-out group-hover:left-[60%]',
          };

          return (
            <div
              key={star}
              className={`absolute h-auto filter drop-shadow-[0_0_0_#fffdef] z-[-5] transition-all ${starClasses[star]} group-hover:drop-shadow-[0_0_10px_#fffdef] group-hover:z-[2]`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 784.11 815.53"
              >
                <path
                  fill="#fffdef"
                  d="M392.05 0c-20.9,210.08-184.06,378.41-392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93-210.06 184.09-378.37 392.05-407.74 -207.98-29.38-371.16-197.69-392.06-407.78z"
                />
              </svg>
            </div>
          );
        })}
    </button>
  );
};

export default StarsButton;
