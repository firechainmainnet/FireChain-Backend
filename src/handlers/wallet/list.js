// src/handlers/wallet/list.js
import { db } from '../../config/firebase.js';
import { ensureUid } from '../../core/validator.js';
import { logSuccess } from '../../core/logger.js';

export async function list(uid) {
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

    // ✅ Mantém tudo (inclusive private_key criptografada)
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
