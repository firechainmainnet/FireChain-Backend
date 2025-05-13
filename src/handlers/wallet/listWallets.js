// src/handlers/wallet/listWallets.js
import { db } from '../../lib/firebase.js';
import { ensureUid } from '../../lib/validator.js';
import { logSuccess } from '../../lib/logger.js';

/**
 * Lista todas as wallets públicas + derivadas do usuário
 */
export async function listWallets(uid) {
  ensureUid(uid);

  const ref = db.ref(`users/${uid}/wallets`);
  const snap = await ref.get();

  if (!snap.exists()) {
    return { status: 'vazio', wallets: [] };
  }

  const raw = snap.val();
  const wallets = [];

  for (const [walletId, data] of Object.entries(raw)) {
    const derivedSnap = await db.ref(`users/${uid}/wallets/${walletId}/derived`).get();
    const derived = derivedSnap.exists() ? derivedSnap.val() : {};

    wallets.push({
      walletId,
      label: data.label,
      tipo: data.tipo,
      address: data.address,
      hd_index: data.hd_index ?? null,
      criadoEm: data.criadoEm ?? null,
      derived
    });
  }

  logSuccess(`Listagem de ${wallets.length} wallet(s) retornada`, uid);

  return {
    status: 'ok',
    count: wallets.length,
    wallets
  };
}
