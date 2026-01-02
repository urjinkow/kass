import { create } from 'zustand';

interface User {
  id: number;
  username: string;
  full_name: string;
  role: 'admin' | 'cashier';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  login: async (username: string, password: string) => {
    try {
      const result = await window.api.login(username, password);
      
      if (result.success && result.user) {
        set({ user: result.user, isAuthenticated: true });
        return { success: true };
      }
      
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Нэвтрэхэд алдаа гарлаа' };
    }
  },

  logout: async () => {
    const user = get().user;
    if (user) {
      await window.api.logout(user.id);
    }
    set({ user: null, isAuthenticated: false });
  },
}));
