import { getDatabase } from '../connection';

export interface DailySummary {
  id: number;
  summary_date: string;
  opening_balance: number;
  total_income: number;
  total_expense: number;
  closing_balance: number;
  cash_counted: number | null;
  difference: number | null;
  notes: string | null;
  status: 'open' | 'closed';
  closed_by: number | null;
  created_at: string;
  closed_at: string | null;
}

export class DailySummaryRepository {
  private db = getDatabase();

  findByDate(date: string): DailySummary | undefined {
    return this.db
      .prepare('SELECT * FROM daily_summaries WHERE summary_date = DATE(?)')
      .get(date) as DailySummary | undefined;
  }

  findOrCreateByDate(date: string): DailySummary {
    let summary = this.findByDate(date);
    
    if (!summary) {
      // Get previous day's closing balance
      const previousSummary = this.db.prepare(`
        SELECT closing_balance
        FROM daily_summaries
        WHERE summary_date < DATE(?)
        ORDER BY summary_date DESC
        LIMIT 1
      `).get(date) as { closing_balance: number } | undefined;

      const openingBalance = previousSummary?.closing_balance || 0;

      this.db.prepare(`
        INSERT INTO daily_summaries (summary_date, opening_balance, status)
        VALUES (DATE(?), ?, 'open')
      `).run(date, openingBalance);

      summary = this.findByDate(date)!;
    }

    return summary;
  }

  updateTotals(date: string, totalIncome: number, totalExpense: number): void {
    const summary = this.findOrCreateByDate(date);
    const closingBalance = summary.opening_balance + totalIncome - totalExpense;

    this.db.prepare(`
      UPDATE daily_summaries
      SET total_income = ?,
          total_expense = ?,
          closing_balance = ?
      WHERE summary_date = DATE(?)
    `).run(totalIncome, totalExpense, closingBalance, date);
  }

  closeDay(date: string, cashCounted: number, notes: string | null, userId: number): void {
    const summary = this.findOrCreateByDate(date);
    const difference = cashCounted - summary.closing_balance;

    this.db.prepare(`
      UPDATE daily_summaries
      SET cash_counted = ?,
          difference = ?,
          notes = ?,
          status = 'closed',
          closed_by = ?,
          closed_at = datetime('now', 'localtime')
      WHERE summary_date = DATE(?)
    `).run(cashCounted, difference, notes, userId, date);
  }

  findRecent(limit: number = 30): DailySummary[] {
    return this.db.prepare(`
      SELECT * FROM daily_summaries
      ORDER BY summary_date DESC
      LIMIT ?
    `).all(limit) as DailySummary[];
  }

  findByDateRange(startDate: string, endDate: string): DailySummary[] {
    return this.db.prepare(`
      SELECT * FROM daily_summaries
      WHERE summary_date BETWEEN DATE(?) AND DATE(?)
      ORDER BY summary_date DESC
    `).all(startDate, endDate) as DailySummary[];
  }
}
