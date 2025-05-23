// src/worker.js
import 'dotenv/config';
import { Worker } from 'bullmq';
import { redisConnection } from './config/redis.js';
import { processRequest } from './handlers/index.js';
import { db } from './config/firebase.js';
import { logInfo, logSuccess, logError } from './core/logger.js';

const queueName = 'firechain-jobs';

const worker = new Worker(queueName, async job => {
  const { reqId, data } = job.data;
  const { uid, action } = data;

  if (!uid || !action) {
    logError('Job inválido recebido, faltando uid ou action');
    return;
  }

  const resRef = db.ref(`users/${uid}/responses/${reqId}`);

  try {
    logInfo(`🎯 Processando job [${uid}/${reqId}] — Ação: ${action}`);
    const resposta = await processRequest(data, reqId);

    await resRef.set({ ...resposta, criadoEm: Date.now() });

    setTimeout(() => {
      resRef.remove().then(() => {
        logInfo(`🕒 Resposta expirada removida: ${uid}/${reqId}`);
      });
    }, 15000);

    logSuccess(`✅ Job concluído com sucesso: ${uid}/${reqId}`);
  } catch (err) {
    await resRef.set({ erro: err.message });
    logError(`❌ Erro no job [${reqId}]: ${err.message}`, uid);
    throw err;
  }
}, {
  connection: redisConnection,
  concurrency: 4 // controla quantos jobs simultâneos o worker processa
});

worker.on('failed', (job, err) => {
  logError(`💥 Job falhou após tentativas: ${job.id} — ${err.message}`);
});

worker.on('completed', (job) => {
  logInfo(`🎉 Job finalizado: ${job.id}`);
});
