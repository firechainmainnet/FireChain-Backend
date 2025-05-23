// src/queue/queue.js
import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';

const queueName = 'firechain-jobs';

export const firechainQueue = new Queue(queueName, {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: {
      age: 30,       // Remove jobs completos após 30s
      count: 1000    // Mantém no máx 1000 registros completos
    },
    removeOnFail: {
      age: 3600,     // Falhas somem após 1h
      count: 500
    },
    attempts: 3,     // 3 tentativas automáticas
    backoff: {
      type: 'exponential',
      delay: 2000    // 2s iniciais com exponencial para retries
    }
  }
});
