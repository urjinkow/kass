import { IncomeRepository } from '../database/repositories/income.repository';
import { ExpenseRepository } from '../database/repositories/expense.repository';
import { DailySummaryRepository } from '../database/repositories/daily-summary.repository';
import { AuditRepository } from '../database/repositories/audit.repository';
import { getDatabase } from '../database/connection';

export class TransactionService {
  private incomeRepo = new IncomeRepository();
  private expenseRepo = new ExpenseRepository();
  private summaryRepo = new DailySummaryRepository();
  private auditRepo = new AuditRepository();
  private db = getDatabase();

  generateReceiptNumber(type: 'income' | 'expense', date: string): string {
    const dateStr = date.split(' ')[0].replace(/-/g, '');
    
    // Get or create sequence for today
    let sequence = this.db.prepare(`
      SELECT * FROM receipt_sequences WHERE sequence_date = DATE(?)
    `).get(date);

    if (!sequence) {
      this.db.prepare(`
        INSERT INTO receipt_sequences (sequence_date, income_sequence, expense_sequence)
        VALUES (DATE(?), 0, 0)
      `).run(date);
      sequence = this.db.prepare(`
        SELECT * FROM receipt_sequences WHERE sequence_date = DATE(?)
      `).get(date);
    }

    const nextSeq = type === 'income'
      ? (sequence as any).income_sequence + 1
      : (sequence as any).expense_sequence + 1;

    // Update sequence
    this.db.prepare(`
      UPDATE receipt_sequences
      SET ${type}_sequence = ?
      WHERE sequence_date = DATE(?)
    `).run(nextSeq, date);

    const prefix = type === 'income' ? 'INC' : 'EXP';
    return `${prefix}-${dateStr}-${String(nextSeq).padStart(4, '0')}`;
  }

  async addIncome(data: {
    category_id: number;
    amount: number;
    donor_name?: string;
    description?: string;
    payment_method: 'cash' | 'transfer';
    user_id: number;
  }) {
    try {
      const transactionDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const receiptNumber = this.generateReceiptNumber('income', transactionDate);

      const income = this.incomeRepo.create({
        receipt_number: receiptNumber,
        category_id: data.category_id,
        amount: data.amount,
        donor_name: data.donor_name || null,
        description: data.description || null,
        payment_method: data.payment_method,
        user_id: data.user_id,
        transaction_date: transactionDate
      });

      // Update daily summary
      const date = transactionDate.split(' ')[0];
      const totalIncome = this.incomeRepo.getTotalByDate(date);
      const totalExpense = this.expenseRepo.getTotalByDate(date);
      this.summaryRepo.updateTotals(date, totalIncome, totalExpense);

      // Audit log
      this.auditRepo.create({
        user_id: data.user_id,
        action: 'CREATE',
        table_name: 'income_transactions',
        record_id: income.id,
        old_values: null,
        new_values: JSON.stringify(income)
      });

      return { success: true, transaction: income };
    } catch (error) {
      console.error('Add income error:', error);
      return { success: false, error: 'Орлого нэмэхэд алдаа гарлаа' };
    }
  }

  async addExpense(data: {
    category_id: number;
    amount: number;
    vendor_name?: string;
    description: string;
    payment_method: 'cash' | 'transfer';
    user_id: number;
  }) {
    try {
      const transactionDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const receiptNumber = this.generateReceiptNumber('expense', transactionDate);

      const expense = this.expenseRepo.create({
        receipt_number: receiptNumber,
        category_id: data.category_id,
        amount: data.amount,
        vendor_name: data.vendor_name || null,
        description: data.description,
        payment_method: data.payment_method,
        user_id: data.user_id,
        transaction_date: transactionDate
      });

      // Update daily summary
      const date = transactionDate.split(' ')[0];
      const totalIncome = this.incomeRepo.getTotalByDate(date);
      const totalExpense = this.expenseRepo.getTotalByDate(date);
      this.summaryRepo.updateTotals(date, totalIncome, totalExpense);

      // Audit log
      this.auditRepo.create({
        user_id: data.user_id,
        action: 'CREATE',
        table_name: 'expense_transactions',
        record_id: expense.id,
        old_values: null,
        new_values: JSON.stringify(expense)
      });

      return { success: true, transaction: expense };
    } catch (error) {
      console.error('Add expense error:', error);
      return { success: false, error: 'Зарлага нэмэхэд алдаа гарлаа' };
    }
  }

  getCategories() {
    const incomeCategories = this.db.prepare('SELECT * FROM income_categories WHERE is_active = 1').all();
    const expenseCategories = this.db.prepare('SELECT * FROM expense_categories WHERE is_active = 1').all();
    
    return {
      income: incomeCategories,
      expense: expenseCategories
    };
  }

  getTransactionByReceipt(receiptNumber: string) {
    if (receiptNumber.startsWith('INC')) {
      return this.incomeRepo.findByReceiptNumber(receiptNumber);
    } else {
      return this.expenseRepo.findByReceiptNumber(receiptNumber);
    }
  }
}
