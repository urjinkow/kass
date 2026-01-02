import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { ThemeToggle } from '../ui/ThemeToggle';
import './Sidebar.css';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    if (user) {
      await window.api.logout(user.id);
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="sidebar glass-card">
      <div className="sidebar-header">
        <h2 className="app-title">Кассын Систем</h2>
        <p className="app-subtitle">☸️ {user?.full_name}</p>
      </div>

      <nav className="sidebar-nav">
        <button className="nav-btn glass-button" onClick={() => navigate('/dashboard')}>
          <span>📊</span> Хянах самбар
        </button>
        <button className="nav-btn glass-button" onClick={() => navigate('/income')}>
          <span>💰</span> Орлого <span className="shortcut-hint">F1</span>
        </button>
        <button className="nav-btn glass-button" onClick={() => navigate('/expense')}>
          <span>💸</span> Зарлага <span className="shortcut-hint">F2</span>
        </button>
        <button className="nav-btn glass-button" onClick={() => navigate('/history')}>
          <span>📜</span> Түүх
        </button>
        <button className="nav-btn glass-button" onClick={() => navigate('/monthly-report')}>
          <span>📊</span> Сарын тайлан
        </button>
        <button className="nav-btn glass-button" onClick={() => navigate('/daily-close')}>
          <span>🔒</span> Өдрийн хаалт <span className="shortcut-hint">F4</span>
        </button>
        {user?.role === 'admin' && (
          <button className="nav-btn glass-button" onClick={() => navigate('/settings')}>
            <span>⚙️</span> Тохиргоо
          </button>
        )}
      </nav>

      <div className="sidebar-footer">
        <ThemeToggle />
        <button className="logout-btn glass-button" onClick={handleLogout}>
          <span>🚪</span> Гарах
        </button>
      </div>
    </div>
  );
};
