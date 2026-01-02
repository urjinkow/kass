import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { LotusAnimation } from '../components/ui/LotusAnimation';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      const result = await window.api.login(username, password);
      
      if (result.success) {
        login(result.user);
        // Wait for lotus animation to complete
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        setError(result.error || 'Нэвтрэх нэр эсвэл нууц үг буруу байна');
        setIsLoggingIn(false);
      }
    } catch (err) {
      setError('Нэвтрэхэд алдаа гарлаа');
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="login-page">
      <LotusAnimation />
      
      <div className="login-container">
        <div className="login-card glass-card">
          <div className="login-header">
            <h1 className="login-title">Кассын Систем</h1>
            <p className="login-subtitle">Гандантэгчинлэн Хийд</p>
            <div className="om-mani">ОМ МАНИ БАДМЭ ХУМ</div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Нэвтрэх нэр</label>
              <input
                id="username"
                type="text"
                className="glass-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                disabled={isLoggingIn}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Нууц үг</label>
              <input
                id="password"
                type="password"
                className="glass-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoggingIn}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="login-btn glass-button"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Нэвтэрч байна...' : 'Нэвтрэх'}
            </button>
          </form>

          <div className="login-footer">
            <p>Анхдагч нэр: admin</p>
            <p>Нууц үг: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
