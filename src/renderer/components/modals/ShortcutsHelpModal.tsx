import React from 'react';
import './ShortcutsHelpModal.css';

interface ShortcutsHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsHelpModal: React.FC<ShortcutsHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'F1', action: 'Орлого нэмэх' },
    { key: 'F2', action: 'Зарлага нэмэх' },
    { key: 'F3', action: 'Сүүлийн баримт хэвлэх' },
    { key: 'F4', action: 'Өдрийн хаалт' },
    { key: 'F5', action: 'Түргэн оруулга' },
    { key: 'Escape', action: 'Болих / Буцах' },
    { key: 'Ctrl+P', action: 'Хэвлэх' },
    { key: 'Ctrl+S', action: 'Хадгалах' },
    { key: 'F12', action: 'Товчлолын тусламж' },
  ];

  return (
    <div className="shortcuts-modal-overlay" onClick={onClose}>
      <div className="shortcuts-modal glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h2>⌨️ Гарын товчлол</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="shortcuts-list">
          {shortcuts.map((shortcut, idx) => (
            <div key={idx} className="shortcut-row">
              <span className="shortcut-key">{shortcut.key}</span>
              <span className="shortcut-action">{shortcut.action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
