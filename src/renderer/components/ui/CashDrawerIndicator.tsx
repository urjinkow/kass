import React, { useEffect, useState } from 'react';
import './CashDrawerIndicator.css';

export const CashDrawerIndicator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const triggerAnimation = () => {
    setIsOpen(true);
    setTimeout(() => setIsOpen(false), 1500);
  };

  // This will be called when a cash transaction is made
  useEffect(() => {
    const handleCashTransaction = () => {
      triggerAnimation();
    };

    window.addEventListener('cash-transaction', handleCashTransaction);
    return () => window.removeEventListener('cash-transaction', handleCashTransaction);
  }, []);

  return (
    <div className="cash-drawer-indicator">
      <svg
        className={`cash-drawer ${isOpen ? 'open' : ''}`}
        width="80"
        height="60"
        viewBox="0 0 80 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Register body */}
        <rect x="10" y="10" width="60" height="40" fill="var(--accent-jade)" rx="4" />
        <rect x="12" y="12" width="56" height="8" fill="var(--bg-secondary)" rx="2" />
        
        {/* Drawer */}
        <g className="drawer">
          <rect x="15" y="25" width="50" height="20" fill="var(--accent-gold)" rx="2" />
          <rect x="20" y="30" width="10" height="8" fill="var(--success)" opacity="0.7" />
          <rect x="32" y="30" width="10" height="8" fill="var(--success)" opacity="0.7" />
          <rect x="44" y="30" width="10" height="8" fill="var(--success)" opacity="0.7" />
          {/* Handle */}
          <rect x="35" y="40" width="10" height="3" fill="var(--bg-primary)" rx="1" />
        </g>
      </svg>
    </div>
  );
};
