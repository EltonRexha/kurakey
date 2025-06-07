import React from 'react';
import { motion, Variants, Transition, Target, TargetAndTransition } from 'framer-motion';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string; // For the input element
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
  id, // for input
  icon,
  wrapperClassName,
  wrapperStyle,
  initial,
  animate,
  variants,
  transition,
  ...inputElementProps // These are purely for the <input> element
}) => {
  return (
    <motion.div
      className={`mb-5 last:mb-0 ${wrapperClassName || ''}`.trim()}
      style={wrapperStyle}
      initial={initial}
      animate={animate}
      variants={variants}
      transition={transition}
    >
      <label htmlFor={id} className="block text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500 dark:text-neutral-600">
            {icon && React.cloneElement(icon, { size: 20 })}
          </div>
        )}
        <input
          id={id}
          className={`
            block w-full px-4 py-3 
            ${icon ? 'pl-11' : 'pl-4'}
            text-neutral-100 dark:text-neutral-200 
            bg-[#203443] dark:bg-[#203443] 
            border border-[#2c3e50] dark:border-[#2c3e50] 
            rounded-lg 
            focus:ring-1 focus:ring-[#55f279] dark:focus:ring-[#55f279] 
            focus:border-[#55f279] dark:focus:border-[#55f279] 
            focus:outline-none 
            placeholder-neutral-500 dark:placeholder-neutral-400 
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
