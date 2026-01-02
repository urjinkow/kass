import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  // Auth
  login: (username: string, password: string) => 
    ipcRenderer.invoke('auth:login', username, password),
  logout: (userId: number) => 
    ipcRenderer.invoke('auth:logout', userId),

  // Transactions
  addIncome: (data: any) => 
    ipcRenderer.invoke('transaction:add-income', data),
  addExpense: (data: any) => 
    ipcRenderer.invoke('transaction:add-expense', data),
  getCategories: () => 
    ipcRenderer.invoke('transaction:get-categories'),
  getTransactionByReceipt: (receiptNumber: string) => 
    ipcRenderer.invoke('transaction:get-by-receipt', receiptNumber),

  // Reports
  getDailySummary: (date: string) => 
    ipcRenderer.invoke('report:get-daily-summary', date),
  getTransactionHistory: (startDate: string, endDate: string) => 
    ipcRenderer.invoke('report:get-transaction-history', startDate, endDate),
  getMonthlyReport: (year: number, month: number) =>
    ipcRenderer.invoke('report:get-monthly', year, month),
  closeDay: (date: string, cashCounted: number, notes: string | null, userId: number) => 
    ipcRenderer.invoke('report:close-day', date, cashCounted, notes, userId),

  // Printer
  printReceipt: (transaction: any, type: 'income' | 'expense') => 
    ipcRenderer.invoke('printer:print-receipt', transaction, type),
  printDailySummary: (summaryData: any) => 
    ipcRenderer.invoke('printer:print-daily-summary', summaryData),
  testPrint: () => 
    ipcRenderer.invoke('printer:test-print'),
  updatePrinterConfig: (config: any) => 
    ipcRenderer.invoke('printer:update-config', config),
});

// TypeScript declarations
export interface ElectronAPI {
  login: (username: string, password: string) => Promise<any>;
  logout: (userId: number) => Promise<any>;
  addIncome: (data: any) => Promise<any>;
  addExpense: (data: any) => Promise<any>;
  getCategories: () => Promise<any>;
  getTransactionByReceipt: (receiptNumber: string) => Promise<any>;
  getDailySummary: (date: string) => Promise<any>;
  getTransactionHistory: (startDate: string, endDate: string) => Promise<any>;
  getMonthlyReport: (year: number, month: number) => Promise<any>;
  closeDay: (date: string, cashCounted: number, notes: string | null, userId: number) => Promise<any>;
  printReceipt: (transaction: any, type: 'income' | 'expense') => Promise<any>;
  printDailySummary: (summaryData: any) => Promise<any>;
  testPrint: () => Promise<any>;
  updatePrinterConfig: (config: any) => Promise<any>;
}

declare global {
  interface Window {
    api: ElectronAPI;
  }
}
