// src/backend.js
import 'dotenv/config';
import { db } from './config/firebase.js';
import { logInfo, logError, logWarn } from './core/logger.js';
import { checkFlood, setAlerted } from './core/antiflood.js';
import { isDuplicate } from './core/requestCache.js';
import { firechainQueue } from './queue/queue.js';
import { cleanOrphans } from './cleanup/cleanOrphans.js';

logInfo('🚀 FireChain Producer inicializando...');
await cleanOrphans();

const requestsRef = db.ref('requests');

requestsRef.on('child_added', async (snap) => {
  const reqId = snap.key;
  const data = snap.val();

  if (!data || typeof data !== 'object') {
    logWarn(`Requisição malformada: ${reqId}`);
    await snap.ref.remove();
    return;
  }

  const { uid, action } = data;
  const resRef = db.ref(`users/${uid}/responses/${reqId}`);

  if (!uid || !action) {
    await resRef.set({ erro: 'Requisição inválida' });
    await snap.ref.remove();
    return;
  }

  const flood = checkFlood(uid);
  if (!flood.allowed) {
    if (flood.alert) {
      await resRef.set({ erro: '⚠️ Limite de requisições excedido. Aguarde.' });
      setTimeout(() => resRef.remove(), 15000);
      setAlerted(uid);
    }
    await snap.ref.remove();
    return;
  }

  if (isDuplicate(uid, action, data)) {
    await resRef.set({ erro: '⏱️ Requisição duplicada. Aguarde e tente novamente.' });
    await snap.ref.remove();
    logWarn(`Requisição duplicada ignorada: ${uid}/${action}`);
    return;
  }

  try {
    logInfo(`📥 Enfileirando job para [${uid}/${reqId}] — Ação: ${action}`);
    await firechainQueue.add('processar', { reqId, data });
  } catch (err) {
    logError(`Erro ao enfileirar job: ${err.message}`, uid);
    await resRef.set({ erro: 'Erro interno ao tentar processar. Tente novamente.' });
  } finally {
    await snap.ref.remove();
  }
});

logInfo('✅ Producer pronto e escutando novas requisições...');
