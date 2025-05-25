// src/handlers/wallet/view.js
import { db } from '../../config/firebase.js';
import { runCli } from '../../core/walletCli.js';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

import {
  ensureUid,
  ensureWalletId,
  ensurePassword
} from '../../core/validator.js';

import {
  deriveKeyFromPassword,
  decryptWalletBuffer
} from '../../core/cryptoWallet.js';

import { logSuccess, logError } from '../../core/logger.js';

export async function view(uid, walletId, senha) {
  ensureUid(uid);
  ensureWalletId(walletId);
  ensurePassword(senha);

  const walletRef = db.ref(`users/${uid}/wallets/${walletId}`);
  const snap = await walletRef.get();
  if (!snap.exists()) throw new Error('Wallet não encontrada');

  const stored = snap.val();
  const base64 = stored?.data;
  if (!base64) throw new Error('Wallet sem dados criptografados');

  const encryptedBuffer = Buffer.from(base64, 'base64');
  const key = deriveKeyFromPassword(senha, uid);

  let decrypted;
  try {
    decrypted = decryptWalletBuffer(encryptedBuffer, key);
  } catch (err) {
    logError(`Erro ao descriptografar wallet ${walletId}: ${err.message}`, uid);
    throw new Error('Senha incorreta ou dados corrompidos');
  }

  const tempDir = path.join(os.tmpdir(), 'firechain');
  await fs.mkdir(tempDir, { recursive: true });
  const tempPath = path.join(tempDir, `${walletId}.wallet`);
  await fs.writeFile(tempPath, decrypted);

  try {
    const response = await runCli({
      action: 'Import',
      path: tempPath,
      password: senha,
      unsafe_dump: true
    });

    logSuccess(`Wallet ${walletId} descriptografada com sucesso`, uid);

    return {
      status: 'ok',
      walletId,
      wallet: response
    };
  } catch (err) {
    logError(`Erro ao processar CLI da wallet ${walletId}: ${err.message}`, uid);
    throw new Error('Erro interno ao interpretar wallet');
  } finally {
    await fs.unlink(tempPath).catch(() => {});
  }
}
