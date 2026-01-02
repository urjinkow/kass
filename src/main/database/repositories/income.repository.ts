import { getDatabase } from '../connection';

export interface IncomeTransaction {
  id: number;
  receipt_number: string;
  category_id: number;
  amount: number;
  donor_name: string | null;
  description: string | null;
  payment_method: 'cash' | 'transfer';
  user_id: number;
  transaction_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface IncomeTransactionWithCategory extends IncomeTransaction {
  category_name: string;
  category_name_mn: string;
}

export class IncomeRepository {
  private db = getDatabase();

  create(data: Omit<IncomeTransaction, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): IncomeTransaction {
    const stmt = this.db.prepare(`
      INSERT INTO income_transactions (
        receipt_number, category_id, amount, donor_name, description,
        payment_method, user_id, transaction_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      data.receipt_number,
      data.category_id,
      data.amount,
      data.donor_name,
      data.description,
      data.payment_method,
      data.user_id,
      data.transaction_date
    );

    return this.findById(result.lastInsertRowid as number)!;
  }

  findById(id: number): IncomeTransaction | undefined {
    return this.db
      .prepare('SELECT * FROM income_transactions WHERE id = ? AND deleted_at IS NULL')
      .get(id) as IncomeTransaction | undefined;
  }

  findByReceiptNumber(receiptNumber: string): IncomeTransactionWithCategory | undefined {
    return this.db.prepare(`
      SELECT i.*, c.name as category_name, c.name_mn as category_name_mn
      FROM income_transactions i
      JOIN income_categories c ON i.category_id = c.id
      WHERE i.receipt_number = ? AND i.deleted_at IS NULL
    `).get(receiptNumber) as IncomeTransactionWithCategory | undefined;
  }

  findByDate(date: string): IncomeTransactionWithCategory[] {
    return this.db.prepare(`
      SELECT i.*, c.name as category_name, c.name_mn as category_name_mn
      FROM income_transactions i
      JOIN income_categories c ON i.category_id = c.id
      WHERE DATE(i.transaction_date) = DATE(?) AND i.deleted_at IS NULL
      ORDER BY i.transaction_date DESC
    `).all(date) as IncomeTransactionWithCategory[];
  }

  findByDateRange(startDate: string, endDate: string): IncomeTransactionWithCategory[] {
    return this.db.prepare(`
      SELECT i.*, c.name as category_name, c.name_mn as category_name_mn
      FROM income_transactions i
      JOIN income_categories c ON i.category_id = c.id
      WHERE DATE(i.transaction_date) BETWEEN DATE(?) AND DATE(?)
        AND i.deleted_at IS NULL
      ORDER BY i.transaction_date DESC
    `).all(startDate, endDate) as IncomeTransactionWithCategory[];
  }

  getTotalByDate(date: string): number {
    const result = this.db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM income_transactions
      WHERE DATE(transaction_date) = DATE(?) AND deleted_at IS NULL
    `).get(date) as { total: number };
    
    return result.total;
  }

  getTotalByDateAndMethod(date: string, method: 'cash' | 'transfer'): number {
    const result = this.db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total
      FROM income_transactions
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
        COALESCE(SUM(i.amount), 0) as total,
        COUNT(i.id) as count
      FROM income_categories c
      LEFT JOIN income_transactions i ON c.id = i.category_id
        AND DATE(i.transaction_date) = DATE(?)
        AND i.deleted_at IS NULL
      WHERE c.is_active = 1
      GROUP BY c.id, c.name_mn
      ORDER BY total DESC
    `).all(date) as Array<{ category_id: number; category_name_mn: string; total: number; count: number }>;
  }

  softDelete(id: number): void {
    this.db.prepare(`
      UPDATE income_transactions
      SET deleted_at = datetime('now', 'localtime')
      WHERE id = ?
    `).run(id);
  }
}
