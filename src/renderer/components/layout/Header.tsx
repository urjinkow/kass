import React from 'react';
import { GlassButton } from '../ui/GlassButton';
import { mn } from '../../i18n/mn';

interface HeaderProps {
  userName: string;
  userRole: 'admin' | 'cashier';
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userName, userRole, onLogout }) => {
  const currentDate = new Date().toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const currentTime = new Date().toLocaleTimeString('mn-MN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="glass-card rounded-none rounded-b-2xl p-4 flex items-center justify-between">
      <div>
        <p className="text-text-secondary text-sm">{currentDate}</p>
        <p className="text-white text-2xl font-bold">{currentTime}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-white text-lg font-medium">{userName}</p>
          <p className="text-text-secondary text-sm capitalize">{userRole}</p>
        </div>
        <GlassButton onClick={onLogout} variant="default" size="sm">
          {mn.auth.logout}
        </GlassButton>
      </div>
    </header>
  );
};
