// tests/setup/firebaseUtils.js
import { db, app } from '../../src/config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

let lastTestUid = null;

/**
 * 🧼 Armazena o UID do teste atual (para limpeza global)
 */
export function setTestUid(uid) {
  lastTestUid = uid;
}

/**
 * ✉️ Envia uma requisição real para o backend
 */
export async function sendRequest(uid, action, payload = {}) {
  const reqId = uuidv4();
  const requestData = { uid, action, ...payload };
  await db.ref(`requests/${reqId}`).set(requestData);
  return { reqId, uid };
}

/**
 * ⏳ Aguarda resposta do backend via RTDB
 */
export async function waitForResponse(uid, reqId, timeoutMs = 10000) {
  const start = Date.now();
  const resRef = db.ref(`users/${uid}/responses/${reqId}`);

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`⏱️ Timeout ao aguardar resposta de ${reqId}`)), timeoutMs);

    const interval = setInterval(async () => {
      const snap = await resRef.get();
      if (snap.exists()) {
        clearTimeout(timeout);
        clearInterval(interval);
        resolve(snap.val());
      } else if (Date.now() - start > timeoutMs) {
        clearTimeout(timeout);
        clearInterval(interval);
        reject(new Error(`❌ Resposta não encontrada dentro de ${timeoutMs}ms`));
      }
    }, 150);
  });
}

/**
 * 🧽 Limpa dados específicos de um UID de teste
 */
export async function clearAllFor(uid = lastTestUid) {
  if (!uid) return;

  await db.ref(`users/${uid}/responses`).remove();
  await db.ref(`users/${uid}/perfil`).remove();
  await db.ref(`users/${uid}/wallets`).remove();
}

/**
 * 🔒 Encerra corretamente todas as conexões e limpa dados finais
 */
export async function closeFirebase() {
  try {
    if (lastTestUid) {
      await clearAllFor(lastTestUid);
    }

    const reqSnap = await db.ref('requests').get();
    if (reqSnap.exists()) {
      const all = reqSnap.val();
      for (const reqId of Object.keys(all)) {
        await db.ref(`requests/${reqId}`).remove();
      }
    }

    await new Promise((r) => setTimeout(r, 500));
    await app.delete(); // 🔚 Encerra Admin SDK por último
  } catch (err) {
    console.warn('⚠️ Erro ao encerrar Firebase:', err.message);
  }
}
