// src/cleanup/cleanOrphans.js
import { db } from '../lib/firebase.js';
import { logInfo, logSuccess } from '../lib/utils.js';

/**
 * Remove requests antigos e responses expiradas.
 * Ideal para executar uma vez na inicialização.
 */
export async function cleanOrphans() {
  logInfo('🧼 Iniciando limpeza de dados órfãos...');

  const [reqSnap, usersSnap] = await Promise.all([
    db.ref('requests').get(),
    db.ref('users').get()
  ]);

  // Limpar todas as requisições pendentes
  if (reqSnap.exists()) {
    const allReqs = reqSnap.val();
    for (const reqId of Object.keys(allReqs)) {
      await db.ref(`requests/${reqId}`).remove();
      logInfo(`🗑️ Request removida: ${reqId}`);
    }
  }

  // Limpar responses com mais de 15 segundos
  if (usersSnap.exists()) {
    for (const uid of Object.keys(usersSnap.val())) {
      const respSnap = await db.ref(`users/${uid}/responses`).get();
      if (respSnap.exists()) {
        const all = respSnap.val();
        for (const resId of Object.keys(all)) {
          const createdAgo = Date.now() - (all[resId]?.criadoEm || 0);
          if (createdAgo > 15_000) {
            await db.ref(`users/${uid}/responses/${resId}`).remove();
            logInfo(`🗑️ Response expirada removida: ${uid}/${resId}`);
          }
        }
      }
    }
  }

  logSuccess('✅ Limpeza inicial concluída.');
}
