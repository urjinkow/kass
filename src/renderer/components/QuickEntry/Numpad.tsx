import React from 'react';
import './Numpad.css';

interface NumpadProps {
  onInput: (value: string) => void;
}

export const Numpad: React.FC<NumpadProps> = ({ onInput }) => {
  const buttons = [
    '7', '8', '9',
    '4', '5', '6',
    '1', '2', '3',
    'C', '0', '⏎'
  ];

  return (
    <div className="numpad">
      {buttons.map((btn) => (
        <button
          key={btn}
          className={`numpad-btn glass-button ${btn === '⏎' ? 'enter' : ''} ${btn === 'C' ? 'clear' : ''}`}
          onClick={() => onInput(btn)}
        >
          {btn}
        </button>
      ))}
    </div>
  );
};
