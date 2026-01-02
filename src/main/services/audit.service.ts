import { AuditRepository } from '../database/repositories/audit.repository';

export class AuditService {
  private auditRepo = new AuditRepository();

  log(data: {
    user_id: number;
    action: string;
    table_name: string;
    record_id?: number;
    old_values?: any;
    new_values?: any;
  }) {
    this.auditRepo.create({
      user_id: data.user_id,
      action: data.action,
      table_name: data.table_name,
      record_id: data.record_id || null,
      old_values: data.old_values ? JSON.stringify(data.old_values) : null,
      new_values: data.new_values ? JSON.stringify(data.new_values) : null
    });
  }

  getRecentLogs(limit: number = 100) {
    return this.auditRepo.findRecent(limit);
  }

  getUserLogs(userId: number, limit: number = 100) {
    return this.auditRepo.findByUser(userId, limit);
  }
}
