import { app, BrowserWindow } from 'electron';
import { getDatabase, closeDatabase } from './database/connection';
import { registerAllHandlers } from './ipc';
import { createMainWindow } from './window';
import { BackupService } from './services/backup.service';

let mainWindow: BrowserWindow | null = null;
const backupService = new BackupService();

// Handle app startup
app.whenReady().then(() => {
  // Initialize database
  getDatabase();

  // Register IPC handlers
  registerAllHandlers();

  // Create main window
  mainWindow = createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createMainWindow();
    }
  });
});

// Handle window close
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle app quit
app.on('before-quit', async () => {
  // Create backup before closing
  try {
    await backupService.createBackup();
  } catch (error) {
    console.error('Failed to create backup on quit:', error);
  }

  // Close database connection
  closeDatabase();
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
