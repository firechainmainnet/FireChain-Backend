// src/core/cryptoWallet.js
import crypto from 'crypto';

const KEY_SIZE = 32;       // 256 bits
const IV_SIZE = 12;        // AES-GCM padrão
const TAG_SIZE = 16;
const ITERATIONS = 100_000;

/**
 * 🔐 Deriva chave simétrica a partir da senha e uid
 */
export function deriveKeyFromPassword(password, uid) {
  return crypto.pbkdf2Sync(password, uid, ITERATIONS, KEY_SIZE, 'sha256');
}

/**
 * 🔒 Criptografa buffer com AES-256-GCM
 * Formato final: [IV][TAG][ENCRYPTED]
 */
export function encryptWalletBuffer(buffer, key) {
  const iv = crypto.randomBytes(IV_SIZE);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

  const encrypted = Buffer.concat([
    cipher.update(buffer),
    cipher.final()
  ]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]);
}

/**
 * 🔓 Descriptografa buffer com AES-256-GCM
 * Espera formato: [IV][TAG][ENCRYPTED]
 */
export function decryptWalletBuffer(encryptedBuffer, key) {
  const iv = encryptedBuffer.slice(0, IV_SIZE);
  const tag = encryptedBuffer.slice(IV_SIZE, IV_SIZE + TAG_SIZE);
  const data = encryptedBuffer.slice(IV_SIZE + TAG_SIZE);

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([
    decipher.update(data),
    decipher.final()
  ]);
}

/**
 * 📛 Gera fingerprint SHA-256 em hex
 */
export function generateFingerprint(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}
