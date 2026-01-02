import { getDatabase } from '../connection';

export interface User {
  id: number;
  username: string;
  password_hash: string;
  full_name: string;
  role: 'admin' | 'cashier';
  is_active: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export class UserRepository {
  private db = getDatabase();

  findByUsername(username: string): User | undefined {
    return this.db
      .prepare('SELECT * FROM users WHERE username = ? AND deleted_at IS NULL')
      .get(username) as User | undefined;
  }

  findById(id: number): User | undefined {
    return this.db
      .prepare('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL')
      .get(id) as User | undefined;
  }

  findAll(): User[] {
    return this.db
      .prepare('SELECT * FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC')
      .all() as User[];
  }

  create(data: Omit<User, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): User {
    const stmt = this.db.prepare(`
      INSERT INTO users (username, password_hash, full_name, role, is_active)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      data.username,
      data.password_hash,
      data.full_name,
      data.role,
      data.is_active
    );

    return this.findById(result.lastInsertRowid as number)!;
  }

  update(id: number, data: Partial<Omit<User, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>>): void {
    const fields: string[] = [];
    const values: any[] = [];

    if (data.username !== undefined) {
      fields.push('username = ?');
      values.push(data.username);
    }
    if (data.password_hash !== undefined) {
      fields.push('password_hash = ?');
      values.push(data.password_hash);
    }
    if (data.full_name !== undefined) {
      fields.push('full_name = ?');
      values.push(data.full_name);
    }
    if (data.role !== undefined) {
      fields.push('role = ?');
      values.push(data.role);
    }
    if (data.is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(data.is_active);
    }

    fields.push("updated_at = datetime('now', 'localtime')");
    values.push(id);

    this.db.prepare(`
      UPDATE users SET ${fields.join(', ')} WHERE id = ?
    `).run(...values);
  }

  softDelete(id: number): void {
    this.db.prepare(`
      UPDATE users SET deleted_at = datetime('now', 'localtime') WHERE id = ?
    `).run(id);
  }
}
