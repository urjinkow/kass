import React from 'react';

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'default' | 'primary' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    default: 'glass-button',
    primary: 'glass-button glass-button-primary',
    gold: 'glass-button glass-button-gold',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        font-medium
        text-white
        disabled:opacity-50
        disabled:cursor-not-allowed
        min-h-[44px]
        ${className}
      `}
    >
      {children}
    </button>
  );
};
