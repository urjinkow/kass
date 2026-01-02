import { useSettingsStore } from '../stores/settingsStore';

// Placeholder URLs for sound files - we'll create simple data URLs
const SOUNDS = {
  success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAo=',
  error: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAo=',
  print: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAoUXrTp66hVFApGn+DyvmwhBjiP1/PMeSwFJHfH8N2RQAo=',
};

export const useSound = () => {
  const { soundEnabled, soundVolume } = useSettingsStore();

  const playSound = (sound: keyof typeof SOUNDS) => {
    if (!soundEnabled) return;

    const audio = new Audio(SOUNDS[sound]);
    audio.volume = soundVolume;
    audio.play().catch(err => console.warn('Sound play failed:', err));
  };

  return {
    playSuccess: () => playSound('success'),
    playError: () => playSound('error'),
    playPrint: () => playSound('print'),
  };
};
