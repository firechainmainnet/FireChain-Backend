// src/handlers/wallet/deriveAddress.js
import { db } from '../../lib/firebase.js';
import { runCli } from '../../lib/walletCli.js';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

import { ensureUid, ensurePassword, ensureWalletId, ensureHdIndex } from '../../lib/validator.js';
import { logSuccess, logError } from '../../lib/logger.js';

export async function deriveAddress(uid, walletId, senha, index) {
  ensureUid(uid);
  ensureWalletId(walletId);
  ensurePassword(senha);
  ensureHdIndex(index);

  const walletRef = db.ref(`users/${uid}/wallets/${walletId}`);
  const snap = await walletRef.get();
  if (!snap.exists()) throw new Error('Wallet não encontrada');

  const wallet = snap.val();
  const walletJson = wallet?.json;
  if (!walletJson) throw new Error('Wallet HD sem json base. Derivação não permitida.');

  const derivedRef = db.ref(`users/${uid}/wallets/${walletId}/derived/${index}`);
  const exists = (await derivedRef.get()).exists();
  if (exists) throw new Error(`HD[${index}] já derivado anteriormente.`);

  const tempDir = path.join(os.tmpdir(), 'firechain');
  await fs.mkdir(tempDir, { recursive: true });
  const tempJsonPath = path.join(tempDir, `${walletId}-hd.json`);
  await fs.writeFile(tempJsonPath, JSON.stringify(walletJson, null, 2));

  try {
    const derivado = await runCli({
      action: 'Derive',
      input_wallet: tempJsonPath,
      password: senha,
      index,
      output: null,
      unsafe_dump: true
    });

    await derivedRef.set({
      address: derivado.address,
      public_key: derivado.public_key,
      private_key: derivado.private_key,
      derivadoEm: Date.now()
    });

    logSuccess(`HD[${index}] derivado com sucesso`, uid);

    return {
      status: 'ok',
      hd_index: index,
      address: derivado.address,
      public_key: derivado.public_key
    };
  } catch (err) {
    logError(`Erro ao derivar HD[${index}]: ${err.message}`, uid);
    throw new Error('Erro ao derivar endereço: senha incorreta ou wallet inválida');
  } finally {
    await fs.unlink(tempJsonPath).catch(() => {});
  }
}
