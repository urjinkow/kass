import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  onClick 
}) => {
  return (
    <div 
      className={`glass-card ${hover ? 'glass-card-hover cursor-pointer' : ''} p-6 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
