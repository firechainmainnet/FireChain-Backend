import { db } from '../lib/firebase.js';
import { sanitizeAll } from '../lib/sanitizer.js';
import {
  ensureUid,
  ensurePassword,
  ensureLabel,
  ensureWalletId,
  ensureHdIndex
} from '../lib/validator.js';
import { logInfo, logSuccess, logWarn, logError } from '../lib/logger.js';

/**
 * Processa uma requisição baseada na ação.
 */
export async function processRequest(data, reqId) {
  const { uid, action } = data;

  ensureUid(uid);
  if (typeof action !== 'string' || action.length < 3 || action.length > 32) {
    throw new Error('Ação inválida');
  }

  logInfo(`📥 Ação recebida: ${action}`, uid);
  const perfilRef = db.ref(`users/${uid}/perfil`);

  switch (action) {
    case 'criar_perfil': {
      const nome = sanitizeAll(data.nome, 64);
      ensureLabel(nome);

      const snap = await perfilRef.get();
      if (snap.exists()) throw new Error('Perfil já existe');

      const perfil = {
        nome,
        bio: '',
        emailVerificado: false,
        criadoEm: Date.now(),
        atualizadoEm: Date.now()
      };

      await perfilRef.set(perfil);
      logSuccess('Perfil criado', uid);
      return { status: 'criado', nome };
    }

    case 'ver_perfil': {
      const snap = await perfilRef.get();
      if (!snap.exists()) {
        logWarn('Perfil não encontrado', uid);
        return { status: 'nao_encontrado' };
      }

      logSuccess('Perfil retornado', uid);
      return { perfil: snap.val() };
    }

    case 'atualizar_perfil': {
      const nome = sanitizeAll(data.nome, 64);
      const bio = sanitizeAll(data.bio || '', 200);
      ensureLabel(nome);

      const perfilAtual = (await perfilRef.get()).val() || {};
      const atualizado = {
        nome,
        bio,
        emailVerificado: perfilAtual.emailVerificado ?? false,
        criadoEm: perfilAtual.criadoEm || Date.now(),
        atualizadoEm: Date.now()
      };

      await perfilRef.set(atualizado);
      logSuccess('Perfil atualizado', uid);
      return { status: 'atualizado', perfil: atualizado };
    }

    case 'criar_wallet_random':
    case 'criar_wallet_mnemonic12':
    case 'criar_wallet_mnemonic24': {
      const senha = data.senha;
      const label = sanitizeAll(data.label || 'default', 32);
      ensurePassword(senha);
      ensureLabel(label);
      const tipo = action.replace('criar_wallet_', '');

      const result = await import('./wallet/createWallet.js').then(mod =>
        mod.createWallet(uid, tipo, senha, label)
      );
      logSuccess(`Wallet criada (${tipo})`, uid);
      return result;
    }

    case 'ver_wallet': {
      const { walletId, senha } = data;
      ensureWalletId(walletId);
      ensurePassword(senha);

      const result = await import('./wallet/viewWallet.js').then(mod =>
        mod.viewWallet(uid, walletId, senha)
      );
      logSuccess(`Wallet visualizada: ${walletId}`, uid);
      return result;
    }

    case 'listar_wallets': {
      const result = await import('./wallet/listWallets.js').then(mod =>
        mod.listWallets(uid)
      );
      logSuccess(`Listagem de wallets`, uid);
      return result;
    }

    case 'derivar_endereco': {
      const { walletId, senha, index } = data;
      ensureWalletId(walletId);
      ensurePassword(senha);
      ensureHdIndex(index);

      const result = await import('./wallet/deriveAddress.js').then(mod =>
        mod.deriveAddress(uid, walletId, senha, index)
      );
      logSuccess(`HD[${index}] derivado`, uid);
      return result;
    }

    default:
      logWarn(`Ação desconhecida: ${action}`, uid);
      return { erro: 'Ação desconhecida' };
  }
}
