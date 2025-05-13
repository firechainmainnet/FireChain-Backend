// src/cleanup/cleanOrphans.js
import { db } from '../lib/firebase.js';
import { logInfo, logSuccess, logWarn } from '../lib/logger.js';

/**
 * 🧼 Limpa requisições e respostas órfãs do Firebase RTDB
 * - Remove todas as entradas em /requests/
 * - Remove responses com mais de 15s em /users/{uid}/responses
 */
export async function cleanOrphans() {
  logInfo('🧼 Iniciando limpeza de dados órfãos...');

  try {
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
    } else {
      logInfo('✅ Nenhuma requisição pendente encontrada');
    }

    // Limpar responses expiradas
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

    logSuccess('✅ Limpeza inicial concluída');
  } catch (err) {
    logWarn(`Erro durante limpeza: ${err.message}`);
  }
}
