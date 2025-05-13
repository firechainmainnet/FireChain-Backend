/**
 * 📋 FireChain Logger — v2.0.2
 * - Logs padronizados com níveis, timestamps e UID opcional
 * - Fácil integração com logs locais, Firebase ou serviços externos (Datadog, Logtail etc.)
 */

const now = () => new Date().toISOString().replace('T', ' ').split('.')[0];

function format(label, message, uid = null) {
  const prefix = uid ? `[UID:${uid}]` : '';
  return `[${now()}] ${label} ${prefix} ${message}`;
}

export function logInfo(message, uid = null) {
  console.log(format('ℹ️ INFO', message, uid));
}

export function logSuccess(message, uid = null) {
  console.log(format('✅ SUCESSO', message, uid));
}

export function logWarn(message, uid = null) {
  console.warn(format('⚠️ AVISO', message, uid));
}

export function logError(message, uid = null) {
  console.error(format('❌ ERRO', message, uid));
}

export function logDebug(message, uid = null) {
  if (process.env.NODE_ENV !== 'production') {
    console.debug(format('🐞 DEBUG', message, uid));
  }
}
