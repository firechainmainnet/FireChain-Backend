import { db } from '../../lib/firebase.js';
import { runCli } from '../../lib/walletCli.js';
import { v4 as uuidv4 } from 'uuid';
import { sanitizeString, logSuccess } from '../../lib/utils.js';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

/**
 * Cria uma nova wallet via CLI e salva no Firebase
 */
export async function createWallet(uid, tipo, senha, label = 'default') {
  const perfilSnap = await db.ref(`users/${uid}/perfil`).get();
  if (!perfilSnap.exists()) throw new Error('Perfil não encontrado');

  const actionMap = {
    random: { action: 'New', label, unsafe_dump: true },
    mnemonic12: { action: 'Mnemonic', words: 12, label, unsafe_dump: true },
    mnemonic24: { action: 'Mnemonic', words: 24, label, unsafe_dump: true }
  };

  const input = actionMap[tipo];
  if (!input) throw new Error(`Tipo de wallet inválido: ${tipo}`);

  const tempDir = path.join(os.tmpdir(), 'firechain');
  await fs.mkdir(tempDir, { recursive: true });

  const walletId = uuidv4();
  const jsonPath = path.join(tempDir, `${walletId}.json`);
  const walletPath = path.join(tempDir, `${walletId}.wallet`);

  const walletJson = await runCli(input); // 1️⃣ Gera wallet JSON
  await fs.writeFile(jsonPath, JSON.stringify(walletJson, null, 2));

  await runCli({                    // 2️⃣ Exporta .wallet com senha
    action: 'Export',
    input_json: jsonPath,
    password: senha,
    output: walletPath
  });

  const raw = await fs.readFile(walletPath);
  const base64 = raw.toString('base64');

  const address = walletJson?.addresses?.[0]?.address || '[sem endereço]';

  const meta = {
    label: sanitizeString(label, 32),
    tipo,
    address,
    hd_index: walletJson.hd_index ?? null,
    encrypted: true,
    criadoEm: Date.now(),
    data: base64,
    json: walletJson // ✅ salva JSON puro para futura derivação
  };

  await db.ref(`users/${uid}/wallets/${walletId}`).set(meta);
  logSuccess(`Wallet ${walletId} criada para ${uid}`, address);

  await fs.unlink(jsonPath).catch(() => {});
  await fs.unlink(walletPath).catch(() => {});

  return {
    status: 'criada',
    walletId,
    address,
    tipo,
    label
  };
}
