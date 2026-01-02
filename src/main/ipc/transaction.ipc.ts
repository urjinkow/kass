import { ipcMain } from 'electron';
import { TransactionService } from '../services/transaction.service';

const transactionService = new TransactionService();

export function registerTransactionHandlers() {
  ipcMain.handle('transaction:add-income', async (_, data) => {
    return await transactionService.addIncome(data);
  });

  ipcMain.handle('transaction:add-expense', async (_, data) => {
    return await transactionService.addExpense(data);
  });

  ipcMain.handle('transaction:get-categories', () => {
    return transactionService.getCategories();
  });

  ipcMain.handle('transaction:get-by-receipt', (_, receiptNumber: string) => {
    return transactionService.getTransactionByReceipt(receiptNumber);
  });
}
