// src/handlers/processRequest.js
import { db } from '../lib/firebase.js';
import { sanitizeString, logSuccess, logInfo, logWarn } from '../lib/utils.js';

/**
 * Processa uma requisição baseada na ação.
 * @param {object} data - Payload completo do request.
 * @param {string} reqId - ID da requisição (chave do RTDB).
 * @returns {Promise<object>} - Resposta a ser enviada ao RTDB.
 */
export async function processRequest(data, reqId) {
  const { uid, action } = data;
  const perfilRef = db.ref(`users/${uid}/perfil`);

  switch (action) {
    // 🔹 Criar perfil
    case 'criar_perfil': {
      const nome = sanitizeString(data.nome, 32);
      if (nome.length < 2) throw new Error('Nome inválido');

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
      logSuccess(`Perfil criado para ${uid}`, nome);
      return { status: 'criado', nome };
    }

    // 🔹 Ver perfil
    case 'ver_perfil': {
      const snap = await perfilRef.get();
      if (!snap.exists()) {
        logInfo(`Perfil não encontrado para ${uid}`);
        return { status: 'nao_encontrado' };
      }

      const perfil = snap.val();
      logSuccess(`Perfil retornado`, JSON.stringify(perfil));
      return { perfil };
    }

    // 🔹 Atualizar perfil
    case 'atualizar_perfil': {
      const nome = sanitizeString(data.nome, 32);
      const bio = sanitizeString(data.bio || '', 200);
      if (nome.length < 2) throw new Error('Nome inválido');

      const perfilAtual = (await perfilRef.get()).val() || {};
      const atualizado = {
        nome,
        bio,
        emailVerificado: perfilAtual.emailVerificado ?? false,
        criadoEm: perfilAtual.criadoEm || Date.now(),
        atualizadoEm: Date.now()
      };

      await perfilRef.set(atualizado);
      logSuccess(`Perfil atualizado para ${uid}`, nome);
      return { status: 'atualizado', perfil: atualizado };
    }

    // 🔐 Criar wallet via CLI
    case 'criar_wallet_random':
    case 'criar_wallet_mnemonic12':
    case 'criar_wallet_mnemonic24': {
      const senha = data.senha;
      const label = data.label || 'default';
      if (!senha || senha.length < 6) throw new Error('Senha inválida');

      const tipo = action.replace('criar_wallet_', '');
      const result = await import('./wallet/createWallet.js').then(mod =>
        mod.createWallet(uid, tipo, senha, label)
      );
      return result;
    }

    // 🔍 Ver wallet (descriptografar via CLI)
    case 'ver_wallet': {
      const { walletId, senha } = data;
      if (!walletId || !senha) throw new Error('walletId e senha são obrigatórios');

      const result = await import('./wallet/viewWallet.js').then(mod =>
        mod.viewWallet(uid, walletId, senha)
      );
      return result;
    }

    // 📂 Listar metadados das wallets
    case 'listar_wallets': {
      const result = await import('./wallet/listWallets.js').then(mod =>
        mod.listWallets(uid)
      );
      return result;
    }

    // ➕ Derivar HD[N] via CLI
    case 'derivar_endereco': {
      const { walletId, senha, index } = data;
      if (!walletId || !senha || typeof index !== 'number') {
        throw new Error('walletId, senha e index são obrigatórios');
      }

      const result = await import('./wallet/deriveAddress.js').then(mod =>
        mod.deriveAddress(uid, walletId, senha, index)
      );
      return result;
    }

    // 🚫 Ação desconhecida
    default:
      logWarn(`Ação desconhecida: ${action}`);
      return { erro: 'Ação desconhecida' };
  }
}
