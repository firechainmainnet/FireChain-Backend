# 📦 Changelog – FireChain Wallet Backend

Todas as mudanças significativas neste projeto são documentadas aqui.

---

## 🔖 v2.0.2 – Validação, Segurança e Robustez Total (MAIO/2025)

### ✨ Adicionado

- Módulo `sanitizer.js` com múltiplas camadas: trim, escape HTML, regex seguro
- Módulo `validator.js` com validações robustas de tipo, estrutura e campos
- Módulo `logger.js` com níveis de log padronizados (`info`, `warn`, `error`, `success`, `debug`)
- Módulo `requestCache.js` com prevenção de requisições duplicadas por UID + ação
- Timeout e captura de erro no `walletCli.js`

### 🔐 Segurança e Consistência

- Todas as entradas do backend passam por `sanitizeAll` e validações fortes
- UID validado em todas as ações
- Logs estruturados com UID, timestamp e nível
- Frontend validado e compatível com backend reforçado
- Antiflood e duplicatas funcionando em conjunto

### ♻️ Refatorações

- `utils.js` completamente removido (substituído por módulos especializados)
- Todos os handlers (`createWallet`, `deriveAddress`, `viewWallet`, `listWallets`) atualizados com validação, logs e segurança
- Estrutura modular final consolidada

### 📂 Estrutura final

- `src/lib/`: ferramentas reutilizáveis (validação, CLI, Firebase, logs, etc.)
- `src/handlers/`: ações por tipo
- `src/cleanup/`: manutenção automatizada
- `public/`: frontend de testes validado

---

## 🔖 v2.0.1 – Integração CLI + HD Derivation (MAIO/2025)

### ✨ Adicionado

- Integração completa com o binário Rust `firechain_wallet.exe` via `spawn`
- Criação de wallets `random`, `mnemonic12`, `mnemonic24` com exportação `.wallet`
- Descriptografia via CLI usando senha do usuário
- Suporte a derivação HD[N] com:
  - Armazenamento histórico em `wallets/$walletId/derived/$index`
  - Validação contra sobrescrita de índice HD existente
- Exibição clara de derivadas no frontend HTML
- Armazenamento do JSON base da carteira para uso exclusivo em derivação

### ⚙️ Infraestrutura

- Adicionado antiflood (5 requisições por UID a cada 10 segundos)
- Requisições únicas via `requests/{uid_reqId}` e respostas em `users/{uid}/responses/{uid_reqId}`
- Limpeza periódica de requisições/respostas órfãs
- Suporte a múltiplas wallets por usuário

### 💻 Frontend

- Interface HTML atualizada com:
  - Formulários para criação, listagem, visualização e derivação de wallets
  - Feedback em tempo real via RTDB
  - Listagem de carteiras e seus endereços derivados

### 🔐 Segurança

- `.wallet` criptografada exclusivamente via CLI com senha
- Nenhuma chave privada ou seed é exposta no backend
- Firebase RTDB segmentado por UID + regras seguras

---

## 📁 Histórico anterior (v2.0.0)

Versão baseada em perfil + RTDB reativo com suporte apenas a dados de perfil.
