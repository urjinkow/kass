import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="history-page" style={{ padding: '24px' }}>
      <div className="page-header">
        <h1>📜 Гүйлгээний түүх</h1>
        <button className="back-btn glass-button" onClick={() => navigate(-1)}>
          Буцах
        </button>
      </div>
      <div className="glass-card" style={{ padding: '32px', marginTop: '24px', textAlign: 'center' }}>
        <p>Гүйлгээний түүх харуулах хэсэг</p>
      </div>
    </div>
  );
};
