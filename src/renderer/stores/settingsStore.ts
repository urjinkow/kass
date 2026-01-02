import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  soundEnabled: boolean;
  soundVolume: number;
  toggleSound: () => void;
  setSoundVolume: (volume: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      soundVolume: 0.5,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      setSoundVolume: (volume: number) => set({ soundVolume: volume }),
    }),
    {
      name: 'settings-storage',
    }
  )
);
