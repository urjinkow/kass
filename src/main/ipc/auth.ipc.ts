import { ipcMain } from 'electron';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export function registerAuthHandlers() {
  ipcMain.handle('auth:login', async (_, username: string, password: string) => {
    return await authService.login(username, password);
  });

  ipcMain.handle('auth:logout', (_, userId: number) => {
    authService.logout(userId);
    return { success: true };
  });
}
