import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useSound } from '../hooks/useSound';
import './IncomePage.css';

export const IncomePage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [donorName, setDonorName] = useState('');
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
    setCategories(result.income || []);
    if (result.income?.length > 0) {
      setCategoryId(result.income[0].id.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const result = await window.api.addIncome({
        category_id: parseInt(categoryId),
        amount: parseFloat(amount),
        donor_name: donorName || null,
        description: description || null,
        payment_method: paymentMethod,
        user_id: user.id,
      });

      if (result.success) {
        playSuccess();
        await window.api.printReceipt(result.transaction, 'income');
        
        if (paymentMethod === 'cash') {
          window.dispatchEvent(new Event('cash-transaction'));
        }

        // Reset form
        setAmount('');
        setDonorName('');
        setDescription('');
      } else {
        playError();
        console.error('Income error:', result.error);
      }
    } catch (error) {
      playError();
      console.error('Income error:', error);
    }
  };

  return (
    <div className="income-page">
      <div className="page-header">
        <h1>💰 Орлого нэмэх</h1>
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
          <label>Өргөдөг хүний нэр</label>
          <input
            type="text"
            className="glass-input"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Тэмдэглэл</label>
          <textarea
            className="glass-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
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
