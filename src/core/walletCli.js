// src/lib/walletCli.js
import { spawn } from 'child_process';
import { logInfo, logError, logWarn } from '../core/logger.js';
import path from 'path';

const CLI_PATH = 'D:/blockchain/fire-wallet/target/debug/firechain_wallet.exe'; // ajuste conforme necessário
const TIMEOUT_MS = 10000;

/**
 * Executa o binário CLI passando JSON via stdin
 * @param {object} payload - Objeto com a ação e parâmetros
 * @returns {Promise<object>} - Resultado parseado do CLI
 */
export function runCli(payload) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const cli = spawn(CLI_PATH, ['--json'], {
      cwd: path.dirname(CLI_PATH),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    const inputStr = JSON.stringify(payload);
    const chunks = [];
    const errors = [];

    const timer = setTimeout(() => {
      cli.kill();
      logError('⏱️ CLI timeout excedido');
      reject(new Error('Tempo limite excedido ao executar CLI'));
    }, TIMEOUT_MS);

    cli.stdout.on('data', (data) => {
      chunks.push(data);
    });

    cli.stderr.on('data', (data) => {
      errors.push(data);
    });

    cli.on('error', (err) => {
      clearTimeout(timer);
      logError(`❌ Falha ao executar CLI: ${err.message}`);
      reject(new Error('Erro ao iniciar CLI'));
    });

    cli.on('close', (code) => {
      clearTimeout(timer);
      const output = Buffer.concat(chunks).toString();
      const errMsg = Buffer.concat(errors).toString().trim();

      if (code !== 0 || errMsg) {
        logWarn(`⚠️ CLI retornou erro (exit ${code}): ${errMsg || 'sem detalhes'}`);
        return reject(new Error(errMsg || `CLI falhou com código ${code}`));
      }

      try {
        const parsed = JSON.parse(output);
        const dur = Date.now() - start;
        logInfo(`✅ CLI executado com sucesso em ${dur}ms — Ação: ${payload.action}`);
        resolve(parsed);
      } catch (parseErr) {
        logError('❌ Erro ao parsear resposta da CLI');
        reject(new Error('Resposta da CLI inválida'));
      }
    });

    // Envia input para CLI
    cli.stdin.write(inputStr);
    cli.stdin.end();
  });
}
