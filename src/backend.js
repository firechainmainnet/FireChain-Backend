import { db } from './lib/firebase.js';
import { logInfo, logError, logWarn } from './lib/logger.js';
import { checkFlood, setAlerted } from './lib/antiflood.js';
import { processRequest } from './handlers/processRequest.js';
import { cleanOrphans } from './cleanup/cleanOrphans.js';
import { isDuplicate } from './lib/requestCache.js';

logInfo('🚀 FireChain Backend inicializando...');
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

  // Proteção antiflood
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

  // Proteção contra duplicadas
  if (isDuplicate(uid, action, data)) {
    await resRef.set({ erro: '⏱️ Requisição duplicada. Aguarde e tente novamente.' });
    await snap.ref.remove();
    logWarn(`Requisição duplicada ignorada: ${uid}/${action}`);
    return;
  }

  try {
    logInfo(`📥 Requisição recebida [${uid}/${reqId}] — Ação: ${action}`);
    const resposta = await processRequest(data, reqId);
    await resRef.set({ ...resposta, criadoEm: Date.now() });

    setTimeout(() => {
      resRef.remove().then(() => {
        logInfo(`🕒 Resposta expirada e removida: ${uid}/${reqId}`);
      });
    }, 15000);
  } catch (err) {
    await resRef.set({ erro: err.message });
    logError(`Erro ao processar [${reqId}]: ${err.message}`, uid);
  } finally {
    await snap.ref.remove();
  }
});

logInfo('✅ Backend pronto e escutando novas requisições...');
