// src/handlers/index.js
import { sanitizeAll } from '../core/sanitizer.js';
import {
  ensureUid,
  ensurePassword,
  ensureLabel,
  ensureWalletId,
  ensureHdIndex
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

    case 'criar_wallet_random':
    case 'criar_wallet_mnemonic12':
    case 'criar_wallet_mnemonic24': {
      const tipo = action.replace('criar_wallet_', '');
      const senha = data.senha;
      const label = sanitizeAll(data.label || 'default', 32);
      ensurePassword(senha);
      ensureLabel(label);
      const { create } = await import('./wallet/create.js');
      return await create(uid, tipo, senha, label);
    }

    case 'ver_wallet': {
      const { walletId, senha } = data;
      ensureWalletId(walletId);
      ensurePassword(senha);
      const { view } = await import('./wallet/view.js');
      return await view(uid, walletId, senha);
    }

    case 'listar_wallets': {
      const { list } = await import('./wallet/list.js');
      return await list(uid);
    }

    case 'derivar_endereco': {
      const { walletId, senha, index } = data;
      ensureWalletId(walletId);
      ensurePassword(senha);
      ensureHdIndex(index);
      const { derive } = await import('./wallet/derive.js');
      return await derive(uid, walletId, senha, index);
    }

    default:
      logWarn(`Ação desconhecida: ${action}`, uid);
      return { erro: 'Ação desconhecida' };
  }
}
