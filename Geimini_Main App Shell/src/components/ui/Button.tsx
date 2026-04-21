import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: any;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  icon,
  children, 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: "bg-brand-orange text-white hover:bg-orange-600",
    secondary: "bg-white border border-brand-border text-brand-gray-dark hover:border-brand-orange hover:text-brand-orange",
    ghost: "bg-transparent text-brand-gray-light hover:bg-orange-50 hover:text-brand-orange",
    success: "bg-brand-orange text-white hover:bg-orange-600"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-xl"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
