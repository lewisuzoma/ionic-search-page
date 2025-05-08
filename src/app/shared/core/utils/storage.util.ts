import * as CryptoJS from 'crypto-js';

const secretKey = 'MIICXAIBAAK'; // 🔐 Keep this key secure or obfuscated

export function encrypt(data: any): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}

export function decrypt(data: string): any {
  try {
    // If it's already a valid JSON, skip decryption
    JSON.parse(data); // will throw if it's encrypted text
    return JSON.parse(data);
  } catch (err) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, secretKey);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (innerErr) {
      console.error('Decrypt error:', innerErr);
      return {}; // fallback
    }
  }
}

