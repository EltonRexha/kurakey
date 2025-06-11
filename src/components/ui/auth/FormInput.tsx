'use client';
import React, { useState } from 'react';
import {
  motion,
  Variants,
  Transition,
  Target,
  TargetAndTransition,
} from 'framer-motion';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  icon?: React.ReactElement<{ size?: string | number }>;

  // Props for the motion.div wrapper
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  initial?: Target | boolean;
  animate?: TargetAndTransition;
  variants?: Variants;
  transition?: Transition;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  icon,
  wrapperClassName,
  wrapperStyle,
  initial,
  animate,
  variants,
  transition,
  type,
  ...inputElementProps
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === 'password';

  return (
    <motion.div
      className={`${wrapperClassName || ''}`.trim()}
      style={wrapperStyle}
      initial={initial}
      animate={animate}
      variants={variants}
      transition={transition}
    >
      <label
        htmlFor={id}
        className="block text-xs font-medium text-neutral-400 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div
            className={`absolute inset-y-0 left-0 pl-3.5 flex items-center ${
              isPassword ? 'cursor-pointer' : 'pointer-events-none'
            } text-neutral-500`}
            onMouseDown={
              isPassword ? () => setIsPasswordVisible(true) : undefined
            }
            onMouseUp={
              isPassword ? () => setIsPasswordVisible(false) : undefined
            }
            onMouseLeave={
              isPassword ? () => setIsPasswordVisible(false) : undefined
            }
          >
            {icon && React.cloneElement(icon, { size: 20 })}
          </div>
        )}
        <input
          id={id}
          type={isPassword && isPasswordVisible ? 'text' : type}
          className={`
            block w-full px-4 py-3 
            ${icon ? 'pl-11' : 'pl-4'}
            text-neutral-100
            bg-[#11142d]
            border border-[#080c1c]
            rounded-lg 
            focus:ring-1 focus:ring-[#008cff]
            focus:border-[#008cff]
            focus:outline-none 
            placeholder-neutral-500
            transition-colors duration-150 ease-in-out
            text-sm
          `}
          {...inputElementProps}
        />
      </div>
    </motion.div>
  );
};

export default FormInput;
