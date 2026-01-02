import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  activeItem: string;
  onNavigate: (item: string) => void;
  userName: string;
  userRole: 'admin' | 'cashier';
  onLogout: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeItem,
  onNavigate,
  userName,
  userRole,
  onLogout,
}) => {
  return (
    <div className="w-screen h-screen bg-gradient-monastery flex overflow-hidden">
      <Sidebar activeItem={activeItem} onNavigate={onNavigate} userRole={userRole} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName={userName} userRole={userRole} onLogout={onLogout} />
        
        <main className="flex-1 overflow-y-auto scrollbar-thin p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
