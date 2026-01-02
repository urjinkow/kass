import React from 'react';
import './LotusAnimation.css';

interface LotusAnimationProps {
  onComplete?: () => void;
}

export const LotusAnimation: React.FC<LotusAnimationProps> = ({ onComplete }) => {
  const [isExiting] = React.useState(false);

  React.useEffect(() => {
    if (onComplete && isExiting) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [isExiting, onComplete]);

  return (
    <div className={`lotus-animation-container ${isExiting ? 'exit' : ''}`}>
      <svg
        className="lotus-svg"
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lotusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--lotus-primary)" />
            <stop offset="100%" stopColor="var(--lotus-secondary)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer petals */}
        <g className="lotus-petals outer">
          <ellipse cx="100" cy="120" rx="30" ry="50" fill="url(#lotusGradient)" opacity="0.6" transform="rotate(-30 100 100)"/>
          <ellipse cx="100" cy="120" rx="30" ry="50" fill="url(#lotusGradient)" opacity="0.6" transform="rotate(30 100 100)"/>
          <ellipse cx="100" cy="120" rx="30" ry="50" fill="url(#lotusGradient)" opacity="0.6" transform="rotate(90 100 100)"/>
          <ellipse cx="100" cy="120" rx="30" ry="50" fill="url(#lotusGradient)" opacity="0.6" transform="rotate(150 100 100)"/>
          <ellipse cx="100" cy="120" rx="30" ry="50" fill="url(#lotusGradient)" opacity="0.6" transform="rotate(210 100 100)"/>
          <ellipse cx="100" cy="120" rx="30" ry="50" fill="url(#lotusGradient)" opacity="0.6" transform="rotate(270 100 100)"/>
        </g>
        
        {/* Inner petals */}
        <g className="lotus-petals inner">
          <ellipse cx="100" cy="105" rx="20" ry="35" fill="url(#lotusGradient)" opacity="0.8" transform="rotate(0 100 100)"/>
          <ellipse cx="100" cy="105" rx="20" ry="35" fill="url(#lotusGradient)" opacity="0.8" transform="rotate(60 100 100)"/>
          <ellipse cx="100" cy="105" rx="20" ry="35" fill="url(#lotusGradient)" opacity="0.8" transform="rotate(120 100 100)"/>
          <ellipse cx="100" cy="105" rx="20" ry="35" fill="url(#lotusGradient)" opacity="0.8" transform="rotate(180 100 100)"/>
          <ellipse cx="100" cy="105" rx="20" ry="35" fill="url(#lotusGradient)" opacity="0.8" transform="rotate(240 100 100)"/>
          <ellipse cx="100" cy="105" rx="20" ry="35" fill="url(#lotusGradient)" opacity="0.8" transform="rotate(300 100 100)"/>
        </g>
        
        {/* Center */}
        <circle 
          cx="100" 
          cy="100" 
          r="15" 
          fill="var(--accent-gold)" 
          filter="url(#glow)"
          className="lotus-center"
        />
      </svg>
    </div>
  );
};
