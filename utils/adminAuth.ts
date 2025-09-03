import { SecureStorage } from './secureStorage';

interface AdminCredentials {
  email: string;
  password: string;
}

export class AdminAuth {
  private static readonly ADMIN_CREDENTIALS_KEY = 'admin_credentials';
  private static readonly DEFAULT_ADMIN: AdminCredentials = {
    email: 'aguiar.neves@hotmail.com',
    password: '12345678'
  };

  /**
   * Initialize admin credentials if they don't exist
   */
  static async initializeAdminCredentials(): Promise<void> {
    try {
      const existingCredentials = await SecureStorage.getItem(this.ADMIN_CREDENTIALS_KEY);
      if (!existingCredentials) {
        await SecureStorage.saveItem(
          this.ADMIN_CREDENTIALS_KEY, 
          JSON.stringify(this.DEFAULT_ADMIN)
        );
        console.log('Admin credentials initialized');
      }
    } catch (error) {
      console.error('Error initializing admin credentials:', error);
    }
  }

  /**
   * Verify admin credentials
   * @param email Admin email
   * @param password Admin password
   * @returns Promise resolving to boolean indicating if credentials are valid
   */
  static async verifyAdminCredentials(email: string, password: string): Promise<boolean> {
    try {
      const credentialsJson = await SecureStorage.getItem(this.ADMIN_CREDENTIALS_KEY);
      if (!credentialsJson) {
        await this.initializeAdminCredentials();
        return email === this.DEFAULT_ADMIN.email && password === this.DEFAULT_ADMIN.password;
      }

      const credentials: AdminCredentials = JSON.parse(credentialsJson);
      return email === credentials.email && password === credentials.password;
    } catch (error) {
      console.error('Error verifying admin credentials:', error);
      return false;
    }
  }

  /**
   * Change admin password
   * @param currentPassword Current admin password
   * @param newPassword New admin password
   * @returns Promise resolving to boolean indicating if password was changed successfully
   */
  static async changeAdminPassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const credentialsJson = await SecureStorage.getItem(this.ADMIN_CREDENTIALS_KEY);
      if (!credentialsJson) {
        await this.initializeAdminCredentials();
        return false;
      }

      const credentials: AdminCredentials = JSON.parse(credentialsJson);
      if (currentPassword !== credentials.password) {
        return false;
      }

      const updatedCredentials: AdminCredentials = {
        ...credentials,
        password: newPassword
      };

      await SecureStorage.saveItem(
        this.ADMIN_CREDENTIALS_KEY,
        JSON.stringify(updatedCredentials)
      );

      return true;
    } catch (error) {
      console.error('Error changing admin password:', error);
      return false;
    }
  }
}