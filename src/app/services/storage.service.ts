import { Injectable } from '@angular/core';
import { EncryptionService } from './encryption.service';
import { MessageService } from 'primeng/api';
import {
  CONST_ALERTA_CORRECTO,
  PERMISSIONS_KEY,
  THEME_APPEARANCE_KEY,
} from '../global.constants';
import { GrantedPermissionInterface } from '../interfaces/granted-permission-interface';
import { themeConfigInterface } from './theme.service';

const USER_KEY = 'access';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private key: CryptoKey | null = null;
  private keyInitialized: Promise<void>;

  constructor(
    private cryptoService: EncryptionService,
    private message: MessageService,
  ) {
    this.keyInitialized = this.initializeKey();
  }

  private async initializeKey(): Promise<void> {
    const storedKey = window.localStorage.getItem('encryptionKey');
    if (storedKey) {
      const keyData = new Uint8Array(
        atob(storedKey)
          .split('')
          .map((c) => c.charCodeAt(0)),
      );
      this.key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt'],
      );
    } else {
      this.key = await this.cryptoService.generateKey();
      const exportedKey = await crypto.subtle.exportKey('raw', this.key);
      window.localStorage.setItem(
        'encryptionKey',
        btoa(String.fromCharCode(...new Uint8Array(exportedKey))),
      );
    }
  }

  async storeData<T>(key: string, data: T): Promise<void> {
    await this.keyInitialized;
    if (!this.key) throw new Error('Encryption key not initialized');
    const jsonString = JSON.stringify(data);
    const encryptedData = await this.cryptoService.encryptData(
      jsonString,
      this.key,
    );
    window.localStorage.setItem(key, encryptedData);
  }

  async retrieveData<T>(key: string): Promise<T | null> {
    await this.keyInitialized;
    if (!this.key) throw new Error('Encryption key not initialized');
    const encryptedData = window.localStorage.getItem(key);
    if (!encryptedData) return null;
    const decryptedData = await this.cryptoService.decryptData(
      encryptedData,
      this.key,
    );
    return JSON.parse(decryptedData) as T;
  }

  async validatePermission(name: string): Promise<boolean> {
    await this.keyInitialized;
    if (!this.key) throw new Error('Encryption key not initialized');
    const encryptedData = window.localStorage.getItem(PERMISSIONS_KEY);
    if (!encryptedData) return false;
    const permissions = JSON.parse(
      await this.cryptoService.decryptData(encryptedData, this.key),
    ) as GrantedPermissionInterface[];
    return permissions.some(
      (p) => p.permission_name === name && p.granted === 1,
    );
  }

  cleanStorage(): void {
    window.localStorage.clear();
  }

  logOut(hideMessage?: boolean): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(PERMISSIONS_KEY);
    if (!hideMessage) {
      this.message.add({
        ...CONST_ALERTA_CORRECTO,
        detail: 'Se ha cerrado la sesión correctamente',
      });
    }
  }

  public isLoggedIn(): boolean {
    return !!window.localStorage.getItem(USER_KEY);
  }

  getThemeConfig(): themeConfigInterface {
    const theme = window.localStorage.getItem(THEME_APPEARANCE_KEY);
    if (theme) {
      return JSON.parse(theme);
    }
    return {
      preset: 'Aura',
      primary: 'emerald',
      surface: null,
      darkTheme: false,
    };
  }
  setThemeConfig(config: themeConfigInterface): void {
    window.localStorage.setItem(THEME_APPEARANCE_KEY, JSON.stringify(config));
  }
}
