import React, { forwardRef } from 'react'
import { twMerge } from 'tailwind-merge';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, Props>(({
    children, 
    className,
    disabled,
    type = 'button',
    ...props
}, ref) => {
    return (
        <button
            className={twMerge(`w-full rounded-full bg-green-500 border border-transparent p-3 disabled:cursor-not-allowed disabled:opacity-50 text-black font-bold hover:opacity-75 transition`, className)}
            type={type}
            ref={ref}
            disabled={disabled}
            {...props}
        >
            { children }
        </button>
    );
});

Button.displayName = 'Button';

export default Button;