import React, { useState } from 'react';
import { CategoryGrid } from './CategoryGrid';
import { Numpad } from './Numpad';
import { useAuthStore } from '../../stores/authStore';
import { useSound } from '../../hooks/useSound';
import './QuickEntryModal.css';

interface QuickEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickEntryModal: React.FC<QuickEntryModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [categories, setCategories] = useState<any>({ income: [], expense: [] });
  const { user } = useAuthStore();
  const { playSuccess, playError } = useSound();

  React.useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const result = await window.api.getCategories();
      setCategories(result);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleNumberInput = (value: string) => {
    if (value === 'C') {
      setAmount('');
    } else if (value === '⏎') {
      handleSaveAndPrint();
    } else {
      setAmount(prev => prev + value);
    }
  };

  const handleSaveAndPrint = async () => {
    if (!selectedCategory || !amount || !user) {
      playError();
      return;
    }

    try {
      const data = {
        category_id: selectedCategory,
        amount: parseFloat(amount),
        payment_method: 'cash',
        user_id: user.id,
      };

      let result;
      if (mode === 'income') {
        result = await window.api.addIncome(data);
      } else {
        result = await window.api.addExpense({ ...data, description: 'Түргэн оруулга' });
      }

      if (result.success) {
        playSuccess();
        await window.api.printReceipt(result.transaction, mode);
        
        // Trigger cash drawer animation
        window.dispatchEvent(new Event('cash-transaction'));
        
        // Reset form
        setAmount('');
        setSelectedCategory(null);
      } else {
        playError();
      }
    } catch (error) {
      console.error('Quick entry error:', error);
      playError();
    }
  };

  if (!isOpen) return null;

  const currentCategories = mode === 'income' ? categories.income : categories.expense;

  return (
    <div className="quick-entry-overlay" onClick={onClose}>
      <div className="quick-entry-modal glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="quick-entry-header">
          <h2>ТҮРГЭН ОРУУЛГА</h2>
          <div className="mode-toggle">
            <button
              className={`mode-btn ${mode === 'income' ? 'active' : ''}`}
              onClick={() => setMode('income')}
            >
              Орлого
            </button>
            <button
              className={`mode-btn ${mode === 'expense' ? 'active' : ''}`}
              onClick={() => setMode('expense')}
            >
              Зарлага
            </button>
          </div>
        </div>

        <div className="quick-entry-content">
          <div className="left-section">
            <CategoryGrid
              categories={currentCategories}
              selectedId={selectedCategory}
              onSelect={setSelectedCategory}
            />
            <button className="save-print-btn glass-button" onClick={handleSaveAndPrint}>
              Хадгалах & Хэвлэх <span className="shortcut-hint">F5</span>
            </button>
          </div>

          <div className="right-section">
            <div className="amount-display glass-card">
              {amount || '0'}₮
            </div>
            <Numpad onInput={handleNumberInput} />
          </div>
        </div>
      </div>
    </div>
  );
};
