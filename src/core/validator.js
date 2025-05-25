/**
 * ✅ FireChain – Validador Central
 * - Verifica tipo, presença, formato e limites
 * - Ideal para todas as entradas recebidas nas actions
 */

const MAX_LABEL_LENGTH = 32;
const MAX_UID_LENGTH = 128;
const MAX_INDEX = 10000;

/**
 * Garante que o valor é uma string não vazia
 */
export function ensureString(field, value, min = 1, max = 256) {
  if (typeof value !== 'string') {
    throw new Error(`Campo '${field}' deve ser uma string`);
  }
  const trimmed = value.trim();
  if (trimmed.length < min) {
    throw new Error(`Campo '${field}' está vazio ou muito curto`);
  }
  if (trimmed.length > max) {
    throw new Error(`Campo '${field}' excede o tamanho máximo de ${max} caracteres`);
  }
}

/**
 * Garante que o índice HD é um número inteiro válido
 */
export function ensureHdIndex(value) {
  if (!Number.isInteger(value) || value < 0 || value > MAX_INDEX) {
    throw new Error(`Índice HD inválido: ${value}`);
  }
}

/**
 * Garante que um UID válido foi fornecido
 */
export function ensureUid(value) {
  ensureString('uid', value, 6, MAX_UID_LENGTH);
}

/**
 * Garante que uma senha válida foi fornecida
 */
export function ensurePassword(value) {
  ensureString('senha', value, 6, 256);
}

/**
 * Garante que um walletId é string simples (sem espaços, curto)
 */
export function ensureWalletId(value) {
  ensureString('walletId', value, 4, 128);
  if (/\s/.test(value)) {
    throw new Error("walletId não deve conter espaços");
  }
}

/**
 * Garante que um label é válido para salvar
 */
export function ensureLabel(value) {
  ensureString('label', value, 2, MAX_LABEL_LENGTH);
}
