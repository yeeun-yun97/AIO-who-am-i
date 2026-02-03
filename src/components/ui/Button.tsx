'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'large';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'font-semibold transition-all duration-200 ease-out rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          variant === 'primary' && [
            'bg-[#3182F6] text-white',
            'hover:bg-[#1B64DA]',
            'active:scale-[0.98]',
            'focus-visible:ring-[#3182F6]',
            'disabled:bg-[#B0B8C1] disabled:cursor-not-allowed disabled:active:scale-100',
          ],
          variant === 'secondary' && [
            'bg-[#F4F4F4] text-[#191F28]',
            'hover:bg-[#E5E8EB]',
            'active:scale-[0.98]',
            'focus-visible:ring-[#8B95A1]',
            'disabled:text-[#B0B8C1] disabled:cursor-not-allowed disabled:active:scale-100',
          ],
          size === 'default' && 'px-6 py-4 text-base',
          size === 'large' && 'px-8 py-5 text-lg w-full',
          className
        )}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
