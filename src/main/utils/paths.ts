import { app } from 'electron';
import path from 'path';

export function getUserDataPath(): string {
  return app.getPath('userData');
}

export function getDataPath(): string {
  return path.join(getUserDataPath(), 'data');
}

export function getBackupPath(): string {
  return path.join(getDataPath(), 'backups');
}

export function getDatabasePath(): string {
  return path.join(getDataPath(), 'kassa.db');
}
