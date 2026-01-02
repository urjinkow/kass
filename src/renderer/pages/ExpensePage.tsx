import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSound } from '../hooks/useSound';
import './IncomePage.css';

export const ExpensePage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash');
  const { user } = useAuthStore();
  const { playSuccess, playError } = useSound();
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const result = await window.api.getCategories();
    setCategories(result.expense || []);
    if (result.expense?.length > 0) {
      setCategoryId(result.expense[0].id.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const result = await window.api.addExpense({
        category_id: parseInt(categoryId),
        amount: parseFloat(amount),
        vendor_name: vendorName || null,
        description: description || 'Зарлага',
        payment_method: paymentMethod,
        user_id: user.id,
      });

      if (result.success) {
        playSuccess();
        await window.api.printReceipt(result.transaction, 'expense');
        
        if (paymentMethod === 'cash') {
          window.dispatchEvent(new Event('cash-transaction'));
        }

        // Reset form
        setAmount('');
        setVendorName('');
        setDescription('');
      } else {
        playError();
        console.error('Expense error:', result.error);
      }
    } catch (error) {
      playError();
      console.error('Expense error:', error);
    }
  };

  return (
    <div className="expense-page">
      <div className="page-header">
        <h1>💸 Зарлага нэмэх</h1>
        <button className="back-btn glass-button" onClick={() => navigate(-1)}>
          Буцах <span className="shortcut-hint">Esc</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="transaction-form glass-card">
        <div className="form-group">
          <label>Төрөл</label>
          <select
            className="glass-input"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name_mn}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Дүн *</label>
          <input
            type="number"
            className="glass-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
            step="any"
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label>Нийлүүлэгч/Хүлээн авагч</label>
          <input
            type="text"
            className="glass-input"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Тайлбар *</label>
          <textarea
            className="glass-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label>Төлбөрийн хэлбэр</label>
          <div className="payment-toggle">
            <button
              type="button"
              className={`toggle-btn ${paymentMethod === 'cash' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('cash')}
            >
              💵 Бэлэн
            </button>
            <button
              type="button"
              className={`toggle-btn ${paymentMethod === 'transfer' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('transfer')}
            >
              💳 Шилжүүлэг
            </button>
          </div>
        </div>

        <button type="submit" className="submit-btn glass-button">
          Хадгалах & Хэвлэх <span className="shortcut-hint">Ctrl+S</span>
        </button>
      </form>
    </div>
  );
};
