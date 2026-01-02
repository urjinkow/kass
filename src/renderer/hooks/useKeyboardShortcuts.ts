import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface KeyboardShortcutHandlers {
  onQuickEntry?: () => void;
  onCancel?: () => void;
}

export const useKeyboardShortcuts = (handlers?: KeyboardShortcutHandlers) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case 'F1':
          e.preventDefault();
          navigate('/income');
          break;
        case 'F2':
          e.preventDefault();
          navigate('/expense');
          break;
        case 'F3':
          e.preventDefault();
          // Print last receipt - will implement in component
          break;
        case 'F4':
          e.preventDefault();
          navigate('/daily-close');
          break;
        case 'F5':
          e.preventDefault();
          handlers?.onQuickEntry?.();
          break;
        case 'Escape':
          e.preventDefault();
          handlers?.onCancel?.();
          break;
      }

      // Ctrl key combinations
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'p':
            e.preventDefault();
            // Print functionality
            break;
          case 's':
            e.preventDefault();
            // Save functionality
            break;
          case 'b':
            e.preventDefault();
            // Backup functionality
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, handlers]);
};
