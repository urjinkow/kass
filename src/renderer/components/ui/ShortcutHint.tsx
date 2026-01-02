import React from 'react';

interface ShortcutHintProps {
  keys: string;
}

export const ShortcutHint: React.FC<ShortcutHintProps> = ({ keys }) => {
  return <span className="shortcut-hint">{keys}</span>;
};
