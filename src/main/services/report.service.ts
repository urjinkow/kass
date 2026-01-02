import { IncomeRepository } from '../database/repositories/income.repository';
import { ExpenseRepository } from '../database/repositories/expense.repository';
import { DailySummaryRepository } from '../database/repositories/daily-summary.repository';
import { getDatabase } from '../database/connection';

export class ReportService {
  private incomeRepo = new IncomeRepository();
  private expenseRepo = new ExpenseRepository();
  private summaryRepo = new DailySummaryRepository();
  private db = getDatabase();

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

  getMonthlyReport(year: number, month: number) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const incomeTransactions = this.incomeRepo.findByDateRange(startDate, endDate);
    const expenseTransactions = this.expenseRepo.findByDateRange(startDate, endDate);

    const totalIncome = incomeTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
    const totalExpense = expenseTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);

    // Income by category
    const incomeByCat = this.db.prepare(`
      SELECT 
        ic.name_mn as category_name,
        SUM(it.amount) as total,
        COUNT(*) as count
      FROM income_transactions it
      JOIN income_categories ic ON it.category_id = ic.id
      WHERE DATE(it.transaction_date) BETWEEN ? AND ?
        AND it.deleted_at IS NULL
      GROUP BY it.category_id
      ORDER BY total DESC
    `).all(startDate, endDate);

    // Expense by category
    const expenseByCat = this.db.prepare(`
      SELECT 
        ec.name_mn as category_name,
        SUM(et.amount) as total,
        COUNT(*) as count
      FROM expense_transactions et
      JOIN expense_categories ec ON et.category_id = ec.id
      WHERE DATE(et.transaction_date) BETWEEN ? AND ?
        AND et.deleted_at IS NULL
      GROUP BY et.category_id
      ORDER BY total DESC
    `).all(startDate, endDate);

    // Calculate percentages
    const incomeByCategory = (incomeByCat as any[]).map(cat => ({
      ...cat,
      percentage: totalIncome > 0 ? (cat.total / totalIncome) * 100 : 0
    }));

    const expenseByCategory = (expenseByCat as any[]).map(cat => ({
      ...cat,
      percentage: totalExpense > 0 ? (cat.total / totalExpense) * 100 : 0
    }));

    return {
      year,
      month,
      summary: {
        totalIncome,
        totalExpense,
        closingBalance: totalIncome - totalExpense,
        transactionCount: incomeTransactions.length + expenseTransactions.length
      },
      incomeByCategory,
      expenseByCategory
    };
  }
}
