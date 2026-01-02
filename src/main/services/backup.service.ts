import fs from 'fs';
import path from 'path';
import { getDatabasePath, getBackupPath } from '../utils/paths';

export class BackupService {
  async createBackup(): Promise<{ success: boolean; path?: string; error?: string }> {
    try {
      const backupDir = getBackupPath();
      
      // Ensure backup directory exists
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFileName = `kassa-backup-${timestamp}.db`;
      const backupFilePath = path.join(backupDir, backupFileName);

      const dbPath = getDatabasePath();
      
      // Copy database file
      fs.copyFileSync(dbPath, backupFilePath);

      // Keep only last 30 backups
      const backupFiles = fs.readdirSync(backupDir)
        .filter(f => f.startsWith('kassa-backup-') && f.endsWith('.db'))
        .sort()
        .reverse();

      if (backupFiles.length > 30) {
        for (let i = 30; i < backupFiles.length; i++) {
          fs.unlinkSync(path.join(backupDir, backupFiles[i]));
        }
      }

      return { success: true, path: backupFilePath };
    } catch (error) {
      console.error('Backup error:', error);
      return { success: false, error: 'Нөөцлөлт хийхэд алдаа гарлаа' };
    }
  }

  async restoreBackup(backupFilePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!fs.existsSync(backupFilePath)) {
        return { success: false, error: 'Нөөцлөлтийн файл олдсонгүй' };
      }

      const dbPath = getDatabasePath();
      
      // Create a backup of current database before restore
      await this.createBackup();

      // Restore from backup
      fs.copyFileSync(backupFilePath, dbPath);

      return { success: true };
    } catch (error) {
      console.error('Restore error:', error);
      return { success: false, error: 'Сэргээхэд алдаа гарлаа' };
    }
  }

  listBackups(): string[] {
    try {
      const backupDir = getBackupPath();
      
      if (!fs.existsSync(backupDir)) {
        return [];
      }

      return fs.readdirSync(backupDir)
        .filter(f => f.startsWith('kassa-backup-') && f.endsWith('.db'))
        .sort()
        .reverse()
        .map(f => path.join(backupDir, f));
    } catch (error) {
      console.error('List backups error:', error);
      return [];
    }
  }
}
