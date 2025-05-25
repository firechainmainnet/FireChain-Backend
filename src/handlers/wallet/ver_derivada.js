// src/handlers/wallet/ver_derivada.js
import { db } from '../../config/firebase.js';
import {
  ensureUid,
  ensureWalletId,
  ensurePassword,
  ensureHdIndex
} from '../../core/validator.js';

import {
  deriveKeyFromPassword,
  decryptWalletBuffer
} from '../../core/cryptoWallet.js';

import { logSuccess, logError } from '../../core/logger.js';

export async function verDerivada(uid, walletId, index, senha) {
  ensureUid(uid);
  ensureWalletId(walletId);
  ensureHdIndex(index);
  ensurePassword(senha);

  const ref = db.ref(`users/${uid}/wallets/${walletId}/derived/${index}`);
  const snap = await ref.get();

  if (!snap.exists()) {
    logError(`Derivado HD[${index}] não encontrado`, uid);
    throw new Error(`HD[${index}] não encontrado para esta wallet`);
  }

  const dados = snap.val();
  const base64 = dados?.private_key;

  if (!base64 || typeof base64 !== 'string') {
    throw new Error('Chave privada não disponível ou corrompida');
  }

  try {
    const key = deriveKeyFromPassword(senha, uid);
    const decrypted = decryptWalletBuffer(Buffer.from(base64, 'base64'), key);
    const privateKey = decrypted.toString();

    logSuccess(`Private key de HD[${index}] recuperada`, uid);

    return {
      status: 'ok',
      walletId,
      hd_index: index,
      private_key: privateKey
    };
  } catch (err) {
    logError(`Erro ao descriptografar chave derivada: ${err.message}`, uid);
    throw new Error('Senha incorreta ou dados inválidos');
  }
}
