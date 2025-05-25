# ✅ FireChain — Testes E2E Profissionais (v2.0.3a)

Este documento descreve toda a estrutura, fluxo e arquitetura da suíte **E2E** da **FireChain**, idealizada para garantir **coerência, segurança e cobertura total** dos fluxos críticos da plataforma Web3.

---

## 🧪 Objetivo da Suíte E2E

A suíte de testes **End-to-End (E2E)** simula a jornada real de um usuário, interagindo com o sistema **de ponta a ponta** para validar:
- Integração entre as camadas (CLI → Backend → RTDB → Firebase → Workers)
- Estrutura e coerência das respostas
- Persistência, segurança e saneamento dos dados
- Fluxos esperados (inclusive cenários de falha)

---

## 🧱 Estrutura Atual de Testes

```bash
tests/e2e/
├── perfil/
│   ├── criar_e_ver_perfil.test.js
│   ├── ver_perfil.test.js
│   └── atualizar_perfil.test.js
├── wallet/
│   ├── criar_wallet_mnemonic24.test.js
│   ├── ver_wallet.test.js
│   ├── derivar_endereco.test.js
│   └── listar_wallets.test.js
```

---

## 🔄 Ordem de Execução (com dependência entre testes)

1. **criar_e_ver_perfil.test.js** → Cria perfil e valida integridade
2. **atualizar_perfil.test.js** → Edita o perfil e verifica consistência
3. **criar_wallet_mnemonic24.test.js** → Cria wallet HD de 24 palavras com senha
4. **ver_wallet.test.js** → Descriptografa a wallet via senha
5. **derivar_endereco.test.js** → Deriva endereço HD[1] e garante unicidade
6. **listar_wallets.test.js** → Valida a listagem geral (vazia e com 1 wallet)

---

## 🔍 Cobertura Validada

| Fluxo                       | Cenários Testados                                                   |
|----------------------------|----------------------------------------------------------------------|
| `criar_perfil`             | Criação com nome válido, erro por nome vazio                        |
| `ver_perfil`               | UID inexistente (erro), UID válido (dados completos)                |
| `atualizar_perfil`         | Alteração e validação refletida                                     |
| `criar_wallet_mnemonic24`  | Sucesso com label + senha, falha sem perfil                         |
| `ver_wallet`               | Descriptografar com senha, validar estrutura interna (mnemonic)     |
| `derivar_endereco`         | Derivação HD[1], falha por índice já usado, erro sem senha          |
| `listar_wallets`           | Lista vazia, lista com 1 wallet (validando campos e label)          |

---

## 🛡️ Validações de Segurança Ativadas

- Sanitização de entradas (`label`, `nome`, `senha`)
- Verificação de duplicatas via fingerprint (RTDB)
- Antiflood por UID e ação
- Rejeição de índices HD já derivados

---

## 📊 Feedback Estruturado dos Testes

Todos os testes utilizam `console.log()` para evidenciar os resultados, facilitando depuração e auditoria contínua dos fluxos principais.

---

## 🧼 Ambiente de Teste

- Todos os testes executam sobre `NODE_ENV=test`
- UIDs gerados dinamicamente via `generateTestUid()`
- Dados do Firebase são limpos com `closeFirebase()`
- Logs, delays e respostas são capturados e validados em tempo real

---

## 💡 Benefícios do E2E FireChain

- Simula comportamento real dos usuários
- Detecta regressões e falhas ocultas
- Garante coerência com o backend CLI-driven
- Facilita manutenção contínua e segura da stack

---

## 📦 Versão

Este documento se aplica à versão:
**FireChain v2.0.3a** — 24/05/2025

---

## 👨‍💻 Autor

**Guilherme Lima** — Arquiteto Web3 e idealizador da FireChain  
🔗 [linkedin.com/in/guilhermelimadev-web3](https://linkedin.com/in/guilhermelimadev-web3)

---

🔥 *FireChain: confiabilidade de produção com segurança de criptografia real.*
