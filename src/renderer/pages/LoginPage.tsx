import React, { useState } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { GlassInput } from '../components/ui/GlassInput';
import { GlassButton } from '../components/ui/GlassButton';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuthStore } from '../stores/authStore';
import { mn } from '../i18n/mn';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(username, password);
    
    if (!result.success) {
      setError(result.error || mn.messages.loginError);
    }
    
    setLoading(false);
  };

  return (
    <div className="w-screen h-screen bg-gradient-monastery flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🕉️</div>
          <h1 className="text-3xl font-bold text-gold mb-2">{mn.app.organization}</h1>
          <p className="text-text-secondary text-lg">{mn.app.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <GlassInput
            type="text"
            label={mn.auth.username}
            value={username}
            onChange={setUsername}
            placeholder={mn.auth.username}
            required
          />

          <GlassInput
            type="password"
            label={mn.auth.password}
            value={password}
            onChange={setPassword}
            placeholder={mn.auth.password}
            required
          />

          {error && (
            <div className="p-3 rounded-lg bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <GlassButton
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full"
          >
            {loading ? <LoadingSpinner /> : mn.auth.login}
          </GlassButton>
        </form>

        <div className="mt-6 text-center text-text-muted text-sm">
          <p>Default: admin / admin123</p>
        </div>
      </GlassCard>
    </div>
  );
};
