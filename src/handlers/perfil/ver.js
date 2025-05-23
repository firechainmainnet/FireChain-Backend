// src/handlers/perfil/ver.js
import { db } from '../../config/firebase.js';
import { ensureUid } from '../../core/validator.js';
import { logSuccess, logWarn } from '../../core/logger.js';

export async function ver(uid) {
  ensureUid(uid);

  const ref = db.ref(`users/${uid}/perfil`);
  const snap = await ref.get();

  if (!snap.exists()) {
    logWarn('Perfil não encontrado', uid);
    return { status: 'nao_encontrado' };
  }

  logSuccess('Perfil retornado', uid);
  return { perfil: snap.val() };
}
