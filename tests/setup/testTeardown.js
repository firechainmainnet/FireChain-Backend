// tests/setup/testTeardown.js
import { closeFirebase } from './firebaseUtils.js';

/**
 * 🧹 Executado automaticamente após todos os testes.
 * Fecha todas as conexões persistentes com o Firebase (WebSocket, RTDB, etc).
 */
afterAll(async () => {
  await closeFirebase();
});
