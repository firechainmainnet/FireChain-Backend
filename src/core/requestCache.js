/**
 * 🔁 FireChain – Proteção contra requisições duplicadas
 * v2.0.2
 * - Armazena fingerprint temporária por UID + ação + hashPayload
 * - TTL padrão: 5 segundos
 */

const cache = new Map();
const TTL = 5000; // 5 segundos

function hashPayload(obj) {
  try {
    return JSON.stringify(obj, Object.keys(obj).sort());
  } catch {
    return null;
  }
}

/**
 * Verifica se a requisição é duplicada em curto prazo
 */
export function isDuplicate(uid, action, payload = {}) {
  const key = `${uid}:${action}`;
  const currentHash = hashPayload(payload);
  if (!currentHash) return false;

  const entry = cache.get(key);

  if (entry && entry.hash === currentHash && Date.now() - entry.ts < TTL) {
    return true; // duplicada
  }

  cache.set(key, { hash: currentHash, ts: Date.now() });
  return false;
}

/**
 * Limpa entradas antigas (opcional se quiser evitar memory leak)
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.ts > TTL) cache.delete(key);
  }
}, TTL);
