import React from 'react';
import { mn } from '../../i18n/mn';

interface SidebarProps {
  activeItem: string;
  onNavigate: (item: string) => void;
  userRole: 'admin' | 'cashier';
}

export const Sidebar: React.FC<SidebarProps> = ({ activeItem, onNavigate, userRole }) => {
  const menuItems = [
    { id: 'dashboard', label: mn.nav.dashboard, icon: '📊' },
    { id: 'income', label: mn.nav.income, icon: '💰' },
    { id: 'expense', label: mn.nav.expense, icon: '💸' },
    { id: 'dailyClose', label: mn.nav.dailyClose, icon: '📋' },
    { id: 'history', label: mn.nav.history, icon: '📜' },
  ];

  if (userRole === 'admin') {
    menuItems.push({ id: 'settings', label: mn.nav.settings, icon: '⚙️' });
  }

  return (
    <div className="w-64 h-full glass-card rounded-none rounded-r-2xl p-6 flex flex-col">
      <div className="mb-8">
        <div className="text-center">
          <div className="text-4xl mb-2">🕉️</div>
          <h1 className="text-xl font-bold text-gold">{mn.app.organization}</h1>
          <p className="text-sm text-text-secondary mt-1">{mn.app.name}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-lg
              transition-all duration-200
              ${activeItem === item.id
                ? 'glass-button-primary text-white'
                : 'glass-button text-text-secondary hover:text-white'
              }
            `}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-base font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
