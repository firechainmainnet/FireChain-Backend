// src/handlers/index.js
import { sanitizeAll } from '../core/sanitizer.js';
import {
  ensureUid,
  ensureLabel
} from '../core/validator.js';

import { logInfo, logSuccess, logWarn, logError } from '../core/logger.js';

/**
 * Roteador central de ações da FireChain (substitui processRequest.js)
 */
export async function processRequest(data, reqId) {
  const { uid, action } = data;

  ensureUid(uid);
  if (typeof action !== 'string' || action.length < 3 || action.length > 32) {
    throw new Error('Ação inválida');
  }

  logInfo(`📥 Ação recebida: ${action}`, uid);

  switch (action) {
    case 'criar_perfil': {
      const nome = sanitizeAll(data.nome, 64);
      ensureLabel(nome);
      const { criar } = await import('./perfil/criar.js');
      return await criar(uid, nome);
    }

    case 'ver_perfil': {
      const { ver } = await import('./perfil/ver.js');
      return await ver(uid);
    }

    case 'atualizar_perfil': {
      const nome = sanitizeAll(data.nome, 64);
      const bio = sanitizeAll(data.bio || '', 200);
      ensureLabel(nome);
      const { atualizar } = await import('./perfil/atualizar.js');
      return await atualizar(uid, nome, bio);
    }


    default:
      logWarn(`Ação desconhecida: ${action}`, uid);
      return { erro: 'Ação desconhecida' };
  }
}
