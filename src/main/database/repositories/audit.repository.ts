import { getDatabase } from '../connection';

export interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  table_name: string;
  record_id: number | null;
  old_values: string | null;
  new_values: string | null;
  created_at: string;
}

export class AuditRepository {
  private db = getDatabase();

  create(data: Omit<AuditLog, 'id' | 'created_at'>): void {
    this.db.prepare(`
      INSERT INTO audit_logs (user_id, action, table_name, record_id, old_values, new_values)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      data.user_id,
      data.action,
      data.table_name,
      data.record_id,
      data.old_values,
      data.new_values
    );
  }

  findByUser(userId: number, limit: number = 100): AuditLog[] {
    return this.db.prepare(`
      SELECT * FROM audit_logs
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `).all(userId, limit) as AuditLog[];
  }

  findByTable(tableName: string, limit: number = 100): AuditLog[] {
    return this.db.prepare(`
      SELECT * FROM audit_logs
      WHERE table_name = ?
      ORDER BY created_at DESC
      LIMIT ?
    `).all(tableName, limit) as AuditLog[];
  }

  findByRecord(tableName: string, recordId: number): AuditLog[] {
    return this.db.prepare(`
      SELECT * FROM audit_logs
      WHERE table_name = ? AND record_id = ?
      ORDER BY created_at DESC
    `).all(tableName, recordId) as AuditLog[];
  }

  findRecent(limit: number = 100): AuditLog[] {
    return this.db.prepare(`
      SELECT a.*, u.username, u.full_name
      FROM audit_logs a
      JOIN users u ON a.user_id = u.id
      ORDER BY a.created_at DESC
      LIMIT ?
    `).all(limit) as AuditLog[];
  }
}
