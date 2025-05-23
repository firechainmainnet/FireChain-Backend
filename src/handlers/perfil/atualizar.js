// src/handlers/perfil/atualizar.js
import { db } from '../../config/firebase.js';
import { sanitizeAll } from '../../core/sanitizer.js';
import { ensureUid, ensureLabel } from '../../core/validator.js';
import { logSuccess } from '../../core/logger.js';

export async function atualizar(uid, nome, bio) {
  ensureUid(uid);
  const nomeLimpo = sanitizeAll(nome, 64);
  const bioLimpa = sanitizeAll(bio || '', 200);
  ensureLabel(nomeLimpo);

  const perfilRef = db.ref(`users/${uid}/perfil`);
  const perfilAtual = (await perfilRef.get()).val() || {};

  const atualizado = {
    nome: nomeLimpo,
    bio: bioLimpa,
    emailVerificado: perfilAtual.emailVerificado ?? false,
    criadoEm: perfilAtual.criadoEm || Date.now(),
    atualizadoEm: Date.now()
  };

  await perfilRef.set(atualizado);
  logSuccess('Perfil atualizado', uid);
  return { status: 'atualizado', perfil: atualizado };
}
