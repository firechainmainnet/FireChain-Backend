// src/handlers/wallet/ver_fingerprint.js
import { db } from '../../config/firebase.js';
import {
  ensureUid,
  ensureWalletId
} from '../../core/validator.js';

import { logSuccess, logError } from '../../core/logger.js';

export async function verFingerprint(uid, walletId) {
  ensureUid(uid);
  ensureWalletId(walletId);

  const walletRef = db.ref(`users/${uid}/wallets/${walletId}`);
  const snap = await walletRef.get();

  if (!snap.exists()) {
    logError(`Wallet não encontrada para ver fingerprint`, uid);
    throw new Error('Wallet não encontrada');
  }

  const data = snap.val();
  const fingerprint = data?.fingerprint;

  if (!fingerprint || typeof fingerprint !== 'string') {
    logError(`Fingerprint ausente ou inválido para wallet ${walletId}`, uid);
    throw new Error('Fingerprint não disponível');
  }

  logSuccess(`Fingerprint da wallet retornado: ${walletId}`, uid);

  return {
    status: 'ok',
    walletId,
    fingerprint
  };
}
