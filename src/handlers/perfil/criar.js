// src/handlers/perfil/criar.js
import { db } from '../../config/firebase.js';
import { sanitizeAll } from '../../core/sanitizer.js';
import { ensureUid, ensureLabel } from '../../core/validator.js';
import { logSuccess } from '../../core/logger.js';

export async function criar(uid, nome) {
  ensureUid(uid);
  const nomeLimpo = sanitizeAll(nome, 64);
  ensureLabel(nomeLimpo);

  const perfilRef = db.ref(`users/${uid}/perfil`);
  const snap = await perfilRef.get();
  if (snap.exists()) throw new Error('Perfil já existe');

  const perfil = {
    nome: nomeLimpo,
    bio: '',
    emailVerificado: false,
    criadoEm: Date.now(),
    atualizadoEm: Date.now()
  };

  await perfilRef.set(perfil);
  logSuccess('Perfil criado', uid);
  return { status: 'criado', nome: nomeLimpo };
}
