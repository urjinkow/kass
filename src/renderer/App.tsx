import React, { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { IncomePage } from './pages/IncomePage';
import { ExpensePage } from './pages/ExpensePage';
import { DailyClosePage } from './pages/DailyClosePage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { MainLayout } from './components/layout/MainLayout';
import { useAuthStore } from './stores/authStore';
import './styles/globals.css';
import './styles/glassmorphism.css';

function App() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [activePage, setActivePage] = useState('dashboard');

  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'income':
        return <IncomePage />;
      case 'expense':
        return <ExpensePage />;
      case 'dailyClose':
        return <DailyClosePage />;
      case 'history':
        return <HistoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <MainLayout
      activeItem={activePage}
      onNavigate={setActivePage}
      userName={user.full_name}
      userRole={user.role}
      onLogout={logout}
    >
      {renderPage()}
    </MainLayout>
  );
}

export default App;
