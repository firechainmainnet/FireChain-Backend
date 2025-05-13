// src/handlers/wallet/createWallet.js
import { db } from '../../lib/firebase.js';
import { runCli } from '../../lib/walletCli.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

import { sanitizeAll } from '../../lib/sanitizer.js';
import { ensureUid, ensurePassword, ensureLabel } from '../../lib/validator.js';
import { logSuccess } from '../../lib/logger.js';

/**
 * Cria uma nova wallet via CLI e salva no Firebase
 */
export async function createWallet(uid, tipo, senha, label = 'default') {
  ensureUid(uid);
  ensurePassword(senha);
  ensureLabel(label);
  const labelSanitizada = sanitizeAll(label, 32);

  const perfilSnap = await db.ref(`users/${uid}/perfil`).get();
  if (!perfilSnap.exists()) throw new Error('Perfil não encontrado');

  const actionMap = {
    random: { action: 'New', label: labelSanitizada, unsafe_dump: true },
    mnemonic12: { action: 'Mnemonic', words: 12, label: labelSanitizada, unsafe_dump: true },
    mnemonic24: { action: 'Mnemonic', words: 24, label: labelSanitizada, unsafe_dump: true }
  };

  const input = actionMap[tipo];
  if (!input) throw new Error(`Tipo de wallet inválido: ${tipo}`);

  const tempDir = path.join(os.tmpdir(), 'firechain');
  await fs.mkdir(tempDir, { recursive: true });

  const walletId = uuidv4();
  const jsonPath = path.join(tempDir, `${walletId}.json`);
  const walletPath = path.join(tempDir, `${walletId}.wallet`);

  const walletJson = await runCli(input);
  await fs.writeFile(jsonPath, JSON.stringify(walletJson, null, 2));

  await runCli({
    action: 'Export',
    input_json: jsonPath,
    password: senha,
    output: walletPath
  });

  const raw = await fs.readFile(walletPath);
  const base64 = raw.toString('base64');
  const address = walletJson?.addresses?.[0]?.address || '[sem endereço]';

  const meta = {
    label: labelSanitizada,
    tipo,
    address,
    hd_index: walletJson.hd_index ?? null,
    encrypted: true,
    criadoEm: Date.now(),
    data: base64,
    json: walletJson
  };

  await db.ref(`users/${uid}/wallets/${walletId}`).set(meta);

  await fs.unlink(jsonPath).catch(() => {});
  await fs.unlink(walletPath).catch(() => {});

  logSuccess(`Wallet criada com sucesso: ${walletId}`, uid);

  return {
    status: 'criada',
    walletId,
    address,
    tipo,
    label: labelSanitizada
  };
}
