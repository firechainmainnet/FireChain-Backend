// src/backend.js — FireChain Backend com escuta única, antiflood e modularização 🔥

import { db } from './lib/firebase.js';
import { logInfo, logError } from './lib/utils.js';
import { checkFlood, setAlerted } from './lib/antiflood.js';
import { processRequest } from './handlers/processRequest.js';
import { cleanOrphans } from './cleanup/cleanOrphans.js';

// ------------------------------------------------------------------
// INICIALIZAÇÃO DO SISTEMA
// ------------------------------------------------------------------
logInfo('🚀 FireChain Backend inicializando...');
await cleanOrphans();

const requestsRef = db.ref('requests');

requestsRef.on('child_added', async (snap) => {
  const reqId = snap.key;
  const data = snap.val();

  if (!data || typeof data !== 'object') {
    logError(`Requisição malformada: ${reqId}`);
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
      await resRef.set({ erro: '⚠️ Limite de requisições excedido. Tente novamente em alguns segundos.' });
      setTimeout(() => resRef.remove(), 15_000);
      setAlerted(uid);
    }
    await snap.ref.remove();
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
    }, 15_000);
  } catch (err) {
    await resRef.set({ erro: err.message });
    logError(`Erro ao processar [${reqId}]: ${err.message}`);
  } finally {
    await snap.ref.remove();
  }
});

logInfo('✅ Backend pronto e escutando novas requisições...');
