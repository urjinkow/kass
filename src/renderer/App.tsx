import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { useTheme } from './hooks/useTheme';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { IncomePage } from './pages/IncomePage';
import { ExpensePage } from './pages/ExpensePage';
import { HistoryPage } from './pages/HistoryPage';
import { DailyClosePage } from './pages/DailyClosePage';
import { SettingsPage } from './pages/SettingsPage';
import { MonthlyReportPage } from './pages/MonthlyReportPage';
import { QuickEntryModal } from './components/QuickEntry/QuickEntryModal';
import { ShortcutsHelpModal } from './components/modals/ShortcutsHelpModal';
import './styles/globals.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: 'auto' }}>{children}</div>
    </div>
  );
};

function App() {
  useTheme();
  const [quickEntryOpen, setQuickEntryOpen] = useState(false);
  const [shortcutsHelpOpen, setShortcutsHelpOpen] = useState(false);

  useKeyboardShortcuts({
    onQuickEntry: () => setQuickEntryOpen(true),
    onCancel: () => {
      setQuickEntryOpen(false);
      setShortcutsHelpOpen(false);
    },
  });

  // F12 for shortcuts help
  React.useEffect(() => {
    const handleF12 = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault();
        setShortcutsHelpOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleF12);
    return () => window.removeEventListener('keydown', handleF12);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/income"
          element={
            <ProtectedRoute>
              <AppLayout>
                <IncomePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/expense"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ExpensePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <AppLayout>
                <HistoryPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/monthly-report"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MonthlyReportPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/daily-close"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DailyClosePage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout>
                <SettingsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>

      <QuickEntryModal isOpen={quickEntryOpen} onClose={() => setQuickEntryOpen(false)} />
      <ShortcutsHelpModal isOpen={shortcutsHelpOpen} onClose={() => setShortcutsHelpOpen(false)} />
    </Router>
  );
}

export default App;
