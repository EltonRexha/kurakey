import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface FillButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    backgroundColor?: string;
    children: React.ReactNode;
    fullWidth?: boolean;
}

const FillButton: React.FC<FillButtonProps> = ({
    backgroundColor = 'bg-blue-500',
    children,
    disabled,
    className = '',
    fullWidth = false,
    ...props
}) => {
    const baseClasses = `group relative h-12 overflow-hidden rounded-md px-6 text-neutral-50 transition ${backgroundColor}`;
    const widthClass = fullWidth ? 'w-full' : 'inline-flex';
    const disabledClasses = disabled
        ? 'opacity-60 cursor-not-allowed hover:scale-100'
        : 'cursor-pointer hover:scale-105';

    return (
        <button
            className={twMerge(baseClasses, widthClass, disabledClasses, className)}
            disabled={disabled}
            {...props}
        >
            <span className="relative z-10 drop-shadow">{children}</span>
            {!disabled && (
                <div className="absolute inset-0 h-full w-0 bg-white/30 transition-[width] duration-300 group-hover:w-full" />
            )}
        </button>
    );
};

export default FillButton; 