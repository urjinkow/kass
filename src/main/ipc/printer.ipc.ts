import { ipcMain } from 'electron';
import { PrinterService } from '../services/printer.service';

const printerService = new PrinterService();

export function registerPrinterHandlers() {
  ipcMain.handle('printer:print-receipt', async (_, transaction, type: 'income' | 'expense') => {
    return await printerService.printReceipt(transaction, type);
  });

  ipcMain.handle('printer:print-daily-summary', async (_, summaryData) => {
    return await printerService.printDailySummary(summaryData);
  });

  ipcMain.handle('printer:test-print', async () => {
    return await printerService.testPrint();
  });

  ipcMain.handle('printer:update-config', (_, config) => {
    printerService.updateConfig(config);
    return { success: true };
  });
}
