/**
 * 🔐 FireChain v2.0.2 — Sanitização multi-camada profissional
 * - Aplica trim, limite de tamanho, escape HTML e filtros personalizados
 * - Evita XSS, inputs maliciosos e formatos inválidos
 */

const DEFAULT_MAX_LENGTH = 256;

/**
 * 🔹 Trim + limite de tamanho + normalize whitespace
 */
export function sanitizeString(value = '', maxLength = DEFAULT_MAX_LENGTH) {
  return String(value)
    .replace(/\s+/g, ' ')     // reduz múltiplos espaços
    .trim()
    .slice(0, maxLength);
}

/**
 * 🔹 Escapa tags HTML e entidades perigosas (anti-XSS)
 */
export function sanitizeHtml(value = '', maxLength = DEFAULT_MAX_LENGTH) {
  return String(value)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/`/g, '&#096;')
    .slice(0, maxLength)
    .trim();
}

/**
 * 🔹 Permite apenas caracteres alfanuméricos, espaços e separadores seguros
 * Ideal para campos como nome, label ou bio leve
 */
export function sanitizeStrict(value = '', maxLength = DEFAULT_MAX_LENGTH) {
  return String(value)
    .normalize('NFKD')                           // remove acentos compostos
    .replace(/[^\w\s\-.,!?@#()/[\]{}]/g, '')     // remove símbolos incomuns
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/**
 * 🔹 Combinação recomendada para campos de texto com risco: 
 * bio, label, nome etc.
 */
export function sanitizeAll(value, maxLength = DEFAULT_MAX_LENGTH) {
  return sanitizeStrict(
    sanitizeHtml(
      sanitizeString(value, maxLength)
    ), maxLength
  );
}
