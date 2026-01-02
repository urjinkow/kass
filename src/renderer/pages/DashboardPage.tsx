import React, { useState, useEffect } from 'react';
import { DailyQuote } from '../components/dashboard/DailyQuote';
import { CashDrawerIndicator } from '../components/ui/CashDrawerIndicator';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodaySummary();
  }, []);

  const loadTodaySummary = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const result = await window.api.getDailySummary(today);
      setSummary(result);
    } catch (error) {
      console.error('Failed to load summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('mn-MN').format(amount) + '₮';
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading">Ачааллаж байна...</div>
      </div>
    );
  }

  const totalIncome = summary?.total_income || 0;
  const totalExpense = summary?.total_expense || 0;
  const balance = totalIncome - totalExpense;

  return (
    <div className="dashboard-page">
      <DailyQuote />

      <div className="dashboard-header">
        <h1>Өнөөдрийн тойм</h1>
        <p className="dashboard-date">{new Date().toLocaleDateString('mn-MN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-card income">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Нийт орлого</div>
            <div className="stat-value text-success">{formatMoney(totalIncome)}</div>
          </div>
        </div>

        <div className="stat-card glass-card expense">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <div className="stat-label">Нийт зарлага</div>
            <div className="stat-value text-error">{formatMoney(totalExpense)}</div>
          </div>
        </div>

        <div className="stat-card glass-card balance">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Үлдэгдэл</div>
            <div className={`stat-value ${balance >= 0 ? 'text-success' : 'text-error'}`}>
              {formatMoney(balance)}
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Түгээмэл үйлдлүүд</h2>
        <div className="action-grid">
          <button className="action-btn glass-button">
            <span className="action-icon">💰</span>
            <span>Орлого нэмэх</span>
            <span className="shortcut-hint">F1</span>
          </button>
          <button className="action-btn glass-button">
            <span className="action-icon">💸</span>
            <span>Зарлага нэмэх</span>
            <span className="shortcut-hint">F2</span>
          </button>
          <button className="action-btn glass-button">
            <span className="action-icon">⚡</span>
            <span>Түргэн оруулга</span>
            <span className="shortcut-hint">F5</span>
          </button>
          <button className="action-btn glass-button">
            <span className="action-icon">🔒</span>
            <span>Өдрийн хаалт</span>
            <span className="shortcut-hint">F4</span>
          </button>
        </div>
      </div>

      <CashDrawerIndicator />
    </div>
  );
};
