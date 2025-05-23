// src/lib/antiflood.js

const MAX_REQ_PER_WINDOW = 5;
const WINDOW_MS = 10_000; // 10 segundos

const rateMap = new Map(); // uid => { count, tsStart, lastAlerted }

/**
 * Verifica se o usuário excedeu o limite de requisições.
 * @param {string} uid - UID do usuário.
 * @returns {{ allowed: boolean, alert: boolean }}
 */
export function checkFlood(uid) {
  const now = Date.now();
  const rate = rateMap.get(uid) || {
    count: 0,
    tsStart: now,
    lastAlerted: false
  };

  if (now - rate.tsStart > WINDOW_MS) {
    // Nova janela
    rate.count = 1;
    rate.tsStart = now;
    rate.lastAlerted = false;
  } else {
    rate.count++;
  }

  rateMap.set(uid, rate);

  if (rate.count > MAX_REQ_PER_WINDOW) {
    return {
      allowed: false,
      alert: !rate.lastAlerted
    };
  }

  return {
    allowed: true,
    alert: false
  };
}

/**
 * Marca que o usuário já recebeu alerta de flood nesta janela
 * @param {string} uid
 */
export function setAlerted(uid) {
  const rate = rateMap.get(uid);
  if (rate) {
    rate.lastAlerted = true;
    rateMap.set(uid, rate);
  }
}
