import { getDatabase } from '../connection';

export interface ExpenseTransaction {
  id: number;
  receipt_number: string;
  category_id: number;
  amount: number;
  vendor_name: string | null;
  description: string;
  payment_method: 'cash' | 'transfer';
  user_id: number;
  transaction_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ExpenseTransactionWithCategory extends ExpenseTransaction {
  category_name: string;
  category_name_mn: string;
}

export class ExpenseRepository {
  private db = getDatabase();

  create(data: Omit<ExpenseTransaction, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): ExpenseTransaction {
    const stmt = this.db.prepare(`
      INSERT INTO expense_transactions (
        receipt_number, category_id, amount, vendor_name, description,
        payment_method, user_id, transaction_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.receipt_number,
      data.category_id,
      data.amount,
      data.vendor_name,
      data.description,
      data.payment_method,
      data.user_id,
      data.transaction_date
    );

    return this.findById(result.lastInsertRowid as number)!;
  }

  findById(id: number): ExpenseTransaction | undefined {
    return this.db
      .prepare('SELECT * FROM expense_transactions WHERE id = ? AND deleted_at IS NULL')
      .get(id) as ExpenseTransaction | undefined;
  }

  findByReceiptNumber(receiptNumber: string): ExpenseTransactionWithCategory | undefined {
    return this.db.prepare(`
      SELECT e.*, c.name as category_name, c.name_mn as category_name_mn
      FROM expense_transactions e
      JOIN expense_categories c ON e.category_id = c.id
      WHERE e.receipt_number = ? AND e.deleted_at IS NULL
    `).get(receiptNumber) as ExpenseTransactionWithCategory | undefined;
  }

  findByDate(date: string): ExpenseTransactionWithCategory[] {
    return this.db.prepare(`
      SELECT e.*, c.name as category_name, c.name_mn as category_name_mn
      FROM expense_transactions e
      JOIN expense_categories c ON e.category_id = c.id
      WHERE DATE(e.transaction_date) = DATE(?) AND e.deleted_at IS NULL
      ORDER BY e.transaction_date DESC
    `).all(date) as ExpenseTransactionWithCategory[];
  }

  findByDateRange(startDate: string, endDate: string): ExpenseTransactionWithCategory[] {
    return this.db.prepare(`
      SELECT e.*, c.name as category_name, c.name_mn as category_name_mn
      FROM expense_transactions e
      JOIN expense_categories c ON e.category_id = c.id
      WHERE DATE(e.transaction_date) BETWEEN DATE(?) AND DATE(?)
        AND e.deleted_at IS NULL
      ORDER BY e.transaction_date DESC
    `).all(startDate, endDate) as ExpenseTransactionWithCategory[];
  }

  getTotalByDate(date: string): number {
    const result = this.db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM expense_transactions
      WHERE DATE(transaction_date) = DATE(?) AND deleted_at IS NULL
    `).get(date) as { total: number };
    
    return result.total;
  }

  getTotalByDateAndMethod(date: string, method: 'cash' | 'transfer'): number {
    const result = this.db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM expense_transactions
      WHERE DATE(transaction_date) = DATE(?)
        AND payment_method = ?
        AND deleted_at IS NULL
    `).get(date, method) as { total: number };
    
    return result.total;
  }

  getCategorySummaryByDate(date: string): Array<{ category_id: number; category_name_mn: string; total: number; count: number }> {
    return this.db.prepare(`
      SELECT
        c.id as category_id,
        c.name_mn as category_name_mn,
        COALESCE(SUM(e.amount), 0) as total,
        COUNT(e.id) as count
      FROM expense_categories c
      LEFT JOIN expense_transactions e ON c.id = e.category_id
        AND DATE(e.transaction_date) = DATE(?)
        AND e.deleted_at IS NULL
      WHERE c.is_active = 1
      GROUP BY c.id, c.name_mn
      ORDER BY total DESC
    `).all(date) as Array<{ category_id: number; category_name_mn: string; total: number; count: number }>;
  }

  softDelete(id: number): void {
    this.db.prepare(`
      UPDATE expense_transactions
      SET deleted_at = datetime('now', 'localtime')
      WHERE id = ?
    `).run(id);
  }
}
