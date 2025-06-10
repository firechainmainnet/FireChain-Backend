/**
 * ✅ FireChain – Validador Central
 * - Verifica tipo, presença, formato e limites
 * - Ideal para todas as entradas recebidas nas actions
 */

const MAX_LABEL_LENGTH = 32;
const MAX_UID_LENGTH = 128;

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
 * Garante que um label é válido para salvar
 */
export function ensureLabel(value) {
  ensureString('label', value, 2, MAX_LABEL_LENGTH);
}
