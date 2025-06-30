import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * Secure storage utility for sensitive data
 * Falls back to localStorage on web with encryption
 */
export class SecureStorage {
  private static readonly SECRET_KEY = 'bencao_match_secret_key';
  private static readonly WEB_STORAGE_PREFIX = 'secure_';

  /**
   * Save a value securely
   * @param key Storage key
   * @param value Value to store
   * @returns Promise resolving when storage is complete
   */
  static async saveItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        // For web, encrypt and store in localStorage
        const encryptedValue = this.encrypt(value);
        localStorage.setItem(`${this.WEB_STORAGE_PREFIX}${key}`, encryptedValue);
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      // For native platforms, use SecureStore
      return SecureStore.setItemAsync(key, value);
    }
  }

  /**
   * Get a value from secure storage
   * @param key Storage key
   * @returns Promise resolving to the stored value, or null if not found
   */
  static async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        // For web, retrieve and decrypt from localStorage
        const encryptedValue = localStorage.getItem(`${this.WEB_STORAGE_PREFIX}${key}`);
        if (!encryptedValue) return null;
        return this.decrypt(encryptedValue);
      } catch (error) {
        console.error('Error retrieving from secure storage:', error);
        return null;
      }
    } else {
      // For native platforms, use SecureStore
      return SecureStore.getItemAsync(key);
    }
  }

  /**
   * Delete a value from secure storage
   * @param key Storage key
   * @returns Promise resolving when deletion is complete
   */
  static async deleteItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(`${this.WEB_STORAGE_PREFIX}${key}`);
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      // For native platforms, use SecureStore
      return SecureStore.deleteItemAsync(key);
    }
  }

  /**
   * Check if a key exists in secure storage
   * @param key Storage key
   * @returns Promise resolving to boolean indicating if key exists
   */
  static async hasKey(key: string): Promise<boolean> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(`${this.WEB_STORAGE_PREFIX}${key}`) !== null;
    } else {
      return !!(await SecureStore.getItemAsync(key));
    }
  }

  /**
   * Simple encryption for web storage
   * Note: This is not cryptographically secure, but provides basic obfuscation
   * For production, use a proper encryption library
   */
  private static encrypt(text: string): string {
    // Simple XOR encryption with the secret key
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ this.SECRET_KEY.charCodeAt(i % this.SECRET_KEY.length);
      result += String.fromCharCode(charCode);
    }
    // Convert to base64 for storage
    return btoa(result);
  }

  /**
   * Simple decryption for web storage
   */
  private static decrypt(encryptedText: string): string {
    try {
      // Decode from base64
      const text = atob(encryptedText);
      // XOR decrypt with the secret key
      let result = '';
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ this.SECRET_KEY.charCodeAt(i % this.SECRET_KEY.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (error) {
      console.error('Decryption error:', error);
      return '';
    }
  }
}