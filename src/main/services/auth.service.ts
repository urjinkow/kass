import { UserRepository } from '../database/repositories/user.repository';
import { comparePassword } from '../utils/hash';
import { AuditRepository } from '../database/repositories/audit.repository';

export interface AuthResult {
  success: boolean;
  user?: {
    id: number;
    username: string;
    full_name: string;
    role: 'admin' | 'cashier';
  };
  error?: string;
}

export class AuthService {
  private userRepo = new UserRepository();
  private auditRepo = new AuditRepository();

  async login(username: string, password: string): Promise<AuthResult> {
    try {
      const user = this.userRepo.findByUsername(username);

      if (!user) {
        return {
          success: false,
          error: 'Нэвтрэх нэр эсвэл нууц үг буруу байна'
        };
      }

      if (!user.is_active) {
        return {
          success: false,
          error: 'Таны эрх идэвхгүй байна'
        };
      }

      const passwordMatch = await comparePassword(password, user.password_hash);

      if (!passwordMatch) {
        return {
          success: false,
          error: 'Нэвтрэх нэр эсвэл нууц үг буруу байна'
        };
      }

      // Log successful login
      this.auditRepo.create({
        user_id: user.id,
        action: 'LOGIN',
        table_name: 'users',
        record_id: user.id,
        old_values: null,
        new_values: JSON.stringify({ timestamp: new Date().toISOString() })
      });

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Нэвтрэхэд алдаа гарлаа'
      };
    }
  }

  logout(userId: number): void {
    this.auditRepo.create({
      user_id: userId,
      action: 'LOGOUT',
      table_name: 'users',
      record_id: userId,
      old_values: null,
      new_values: JSON.stringify({ timestamp: new Date().toISOString() })
    });
  }
}
