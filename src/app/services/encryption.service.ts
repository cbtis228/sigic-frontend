import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor(
  ) { }
  

  async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM', 
        length: 256, 
      },
      true, 
      ['encrypt', 'decrypt']
    );
  }

  async encryptData(data: string, key: CryptoKey): Promise<string> {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    const iv = crypto.getRandomValues(new Uint8Array(12)); 

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encodedData
    );

    const encryptedArray = Array.from(new Uint8Array(encrypted));
    const ivAndEncrypted = Array.from(iv).concat(encryptedArray);
    return btoa(String.fromCharCode(...ivAndEncrypted)); 
  }

  async decryptData(encryptedData: string, key: CryptoKey): Promise<string> {
    const ivAndEncrypted = new Uint8Array(atob(encryptedData).split('').map(char => char.charCodeAt(0)));

    const iv = ivAndEncrypted.slice(0, 12);
    const encrypted = ivAndEncrypted.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

}
