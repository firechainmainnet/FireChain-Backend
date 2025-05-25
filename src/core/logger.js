// src/core/logger.js
import chalk from 'chalk';

// Gera timestamp formatado (UTC local simplificado)
function timestamp() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

// Formata mensagens com tipo + UID (opcional)
export function format(tipo, message, uid = null) {
  const tag = uid ? `[UID:${uid}]` : '';
  return `[${timestamp()}] ${tipo} ${tag} ${message}`;
}

// Logs informativos
export function logInfo(message, uid = null) {
  console.log(format(chalk.blue('ℹ️ INFO'), message, uid));
}

export function logSuccess(message, uid = null) {
  console.log(format(chalk.green('✅ SUCESSO'), message, uid));
}

export function logWarn(message, uid = null) {
  console.warn(format(chalk.yellow('⚠️ AVISO'), message, uid));
}

export function logError(message, uid = null) {
  console.error(format(chalk.red('❌ ERRO'), message, uid));
}

export function logDebug(message, uid = null) {
  console.debug(format(chalk.cyan('🐞 DEBUG'), message, uid));
}
