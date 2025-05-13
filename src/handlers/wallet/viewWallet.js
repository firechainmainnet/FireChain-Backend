// src/handlers/wallet/viewWallet.js
import { db } from '../../lib/firebase.js';
import { runCli } from '../../lib/walletCli.js';
import { logSuccess, logError } from '../../lib/utils.js';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

/**
 * Descriptografa uma wallet salva em base64 (via CLI)
 * @param {string} uid
 * @param {string} walletId
 * @param {string} senha
 */
export async function viewWallet(uid, walletId, senha) {
  const walletRef = db.ref(`users/${uid}/wallets/${walletId}`);
  const snap = await walletRef.get();

  if (!snap.exists()) throw new Error('Wallet não encontrada');

  const stored = snap.val();
  const base64 = stored?.data;
  if (!base64) throw new Error('Wallet sem dados criptografados');

  // Preparar arquivo temporário `.wallet`
  const tempDir = path.join(os.tmpdir(), 'firechain');
  await fs.mkdir(tempDir, { recursive: true });
  const tempPath = path.join(tempDir, `${walletId}.wallet`);

  await fs.writeFile(tempPath, Buffer.from(base64, 'base64'));

  try {
    const response = await runCli({
      action: 'Import',
      path: tempPath,
      password: senha,
      unsafe_dump: true
    });

    logSuccess(`Wallet descriptografada com sucesso`, response?.addresses?.[0]?.address);
    return {
      status: 'ok',
      walletId,
      wallet: response
    };
  } catch (err) {
    logError(`Erro ao descriptografar wallet ${walletId}: ${err.message}`);
    throw new Error('Senha incorreta ou dados corrompidos');
  } finally {
    await fs.unlink(tempPath).catch(() => {});
  }
}
