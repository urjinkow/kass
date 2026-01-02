import { ipcMain } from 'electron';
import { ReportService } from '../services/report.service';

const reportService = new ReportService();

export function registerReportHandlers() {
  ipcMain.handle('report:get-daily-summary', (_, date: string) => {
    return reportService.getDailySummary(date);
  });

  ipcMain.handle('report:get-transaction-history', (_, startDate: string, endDate: string) => {
    return reportService.getTransactionHistory(startDate, endDate);
  });

  ipcMain.handle('report:close-day', (_, date: string, cashCounted: number, notes: string | null, userId: number) => {
    return reportService.closeDay(date, cashCounted, notes, userId);
  });

  ipcMain.handle('report:get-monthly', (_, year: number, month: number) => {
    return reportService.getMonthlyReport(year, month);
  });
}
