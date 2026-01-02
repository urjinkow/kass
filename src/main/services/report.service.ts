import { IncomeRepository } from '../database/repositories/income.repository';
import { ExpenseRepository } from '../database/repositories/expense.repository';
import { DailySummaryRepository } from '../database/repositories/daily-summary.repository';

export class ReportService {
  private incomeRepo = new IncomeRepository();
  private expenseRepo = new ExpenseRepository();
  private summaryRepo = new DailySummaryRepository();

  getDailySummary(date: string) {
    const summary = this.summaryRepo.findOrCreateByDate(date);
    const incomeTransactions = this.incomeRepo.findByDate(date);
    const expenseTransactions = this.expenseRepo.findByDate(date);
    const incomeByCat = this.incomeRepo.getCategorySummaryByDate(date);
    const expenseByCat = this.expenseRepo.getCategorySummaryByDate(date);

    return {
      summary,
      income_transactions: incomeTransactions,
      expense_transactions: expenseTransactions,
      income_by_category: incomeByCat,
      expense_by_category: expenseByCat
    };
  }

  getTransactionHistory(startDate: string, endDate: string) {
    const incomeTransactions = this.incomeRepo.findByDateRange(startDate, endDate);
    const expenseTransactions = this.expenseRepo.findByDateRange(startDate, endDate);

    return {
      income: incomeTransactions,
      expense: expenseTransactions
    };
  }

  closeDay(date: string, cashCounted: number, notes: string | null, userId: number) {
    try {
      this.summaryRepo.closeDay(date, cashCounted, notes, userId);
      return { success: true };
    } catch (error) {
      console.error('Close day error:', error);
      return { success: false, error: 'Өдөр хаахад алдаа гарлаа' };
    }
  }
}
