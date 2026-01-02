import { create } from 'zustand';

interface SettingsState {
  printerPaperWidth: '58' | '80';
  printerPort: string;
  setPrinterConfig: (config: { width?: '58' | '80'; port?: string }) => Promise<void>;
  testPrint: () => Promise<{ success: boolean; error?: string }>;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  printerPaperWidth: '80',
  printerPort: 'USB',

  setPrinterConfig: async (config) => {
    try {
      const updateData: any = {};
      
      if (config.width) {
        updateData.width = config.width === '58' ? 32 : 48;
        set({ printerPaperWidth: config.width });
      }
      
      if (config.port) {
        updateData.interface = config.port;
        set({ printerPort: config.port });
      }

      await window.api.updatePrinterConfig(updateData);
    } catch (error) {
      console.error('Update printer config error:', error);
    }
  },

  testPrint: async () => {
    try {
      return await window.api.testPrint();
    } catch (error) {
      console.error('Test print error:', error);
      return { success: false, error: 'Тест хэвлэхэд алдаа гарлаа' };
    }
  },
}));
