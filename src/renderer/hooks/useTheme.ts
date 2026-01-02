import { useThemeStore } from '../stores/themeStore';
import { useEffect } from 'react';

export const useTheme = () => {
  const { theme, toggleTheme, setTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return { theme, toggleTheme, setTheme };
};
