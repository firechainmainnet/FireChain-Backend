# 📦 Changelog – FireChain Wallet Backend

Todas as mudanças significativas neste projeto são documentadas aqui.

---

## 🔖 v2.0.3a – Cobertura E2E Completa, Segurança Enterprise + Turbo-Escalabilidade (MAIO/2025)

A release **2.0.3a** consolida o ciclo BullMQ + Redis introduzido na 2.0.3 com uma camada profissional de QA automatizado, hardening de segurança de nível corporativo e novos _tunings_ de performance que permitem subir o FireChain instantaneamente para milhares de jobs por minuto.

### ✨ Adicionado
- 🧪 **Testes End-to-End (Jest + Firebase RTDB em tempo real)**
  - **14 cenários críticos cobertos**: criação/atualização de perfil, criação HD (12 e 24 palavras), derivação HD, listagem, view/descriptografia, antiflood e duplicatas.
  - `tests/setup/` com _helpers_ de requisição (`sendRequest`, `waitForResponse`) e _teardown_ que apaga resíduos no Firebase e encerra o Admin SDK sem vazamento.
  - Script npm `test:e2e` padronizado para **execução headless** com flag `--experimental-vm-modules`, pronto para CI.

- 📝 **README_TESTES_E2E.md**  
  Guia passo-a-passo de 3 minutos para rodar a suíte localmente ou via GitHub Actions, incluindo variáveis de ambiente, requisitos de Redis em memória e dicas de debug.

- 🔐 **Segurança Enterprise**
  - **Sanitização HTML ampliada** → agora bloqueia back-ticks e entidades raras.
  - **Validator.hd_index** reforçado (`0 – 10000`) + checagem explícita de número inteiro.
  - **Logs redigidos**: prints de chaves privadas ofuscados quando `NODE_ENV=production`.
  - **db.goOffline() seguro** dentro do teardown dos testes, evitando _fatal errors_ nos CI runners.

- 🚀 **Escalabilidade Turbo**
  - `worker.js` aceita `process.env.WORKER_CONCURRENCY` (default `4`) – basta escalar horizontal **ou** vertical alterando a env var.
  - Config BullMQ `removeOnComplete`/`removeOnFail` afinado (30 s / 1 h) e `attempts: 3` com _exponential backoff_ de 2 s.
  - **Métricas prontas para dashboards**: cada job loga `dur` (duração em ms), facilitando Prometheus/Grafana.

- 📈 **Dev Workflow**
  - Script `start:dev` atualizado → inicia producer + 2 workers + Redis local (_concurrently_) em um único comando.
  - `package.json` vers. **2.0.3a**; descrição enfatiza “Web3 backend tested E2E”.

### ♻️ Alterado
- 📜 **README principal** 
  Agora traz manifesto de marca, fluxos visuais, _copy_ de marketing, casos de uso (exchange, game Fi, bots, wallets white-label) e badges de status CI.
- 🔄 `list.js` retorna `{ status: 'vazio', wallets: [] }` quando não existirem carteiras – testes ajustados para aceitar “ok” _ou_ “vazio”.
- 🧼 `cleanOrphans.js` roda a cada boot e, durante testes, garante base limpa em < 500 ms.

### 🛠️ Corrigido
- Fix **`closeFirebase()`** que tentava `db.goOffline()` após `app.delete()`.
- Mensagens de erro padronizadas (`Wallet não encontrada`, `HD[x] já derivado`) → cobertura 100 % nos asserts de teste.
- Tratamento de `senha` undefined no handler `derive.js`.

### 🔐 Impacto de Segurança
- **Cobertura de testes** garante que *cada nova PR* precise passar por cenários críticos – reduzindo regressões de segurança.
- Logs de debug exigem opt-in (`DEBUG=true`), atendendo GDPR/PII.

### 🚦 Pronto para CI/CD
- Suíte E2E executa em ~40 s num runner padrão, emitindo métricas de cobertura.
- Passos Docker descritos no novo README_TESTES_E2E.md.

> **FireChain 2.0.3a** conclui a fundação QA + Security e posiciona o projeto para produção real em larga escala, mantendo a experiência reativa que fez a FireChain se destacar.

---

## 🔖 v2.0.3 – Arquitetura Assíncrona Escalável com BullMQ + Redis (MAIO/2025)

FireChain v2.0.3 marca uma **virada de chave arquitetural**, trazendo a fundação necessária para suportar uso intensivo, múltiplos usuários simultâneos e integração real com DApps, bots e plataformas Web3 corporativas.

### ✨ Adicionado

- 🔁 Integração completa com **BullMQ + Redis**: requisições agora são tratadas como jobs em fila, permitindo isolamento, paralelismo e balanceamento
- 🧵 Introduzido `worker.js`: múltiplos workers paralelos processam ações em background de forma segura, escalável e resiliente
- ⚙️ Novo `queue.js`: encapsulamento da instância Redis + BullMQ com suporte total a `.env`
- 🔄 Sistema 100% compatível com Redis nativo no Windows (via `.zip`), com guia de instalação oficial
- 🧪 Scripts `start:worker`, `start:workers`, `start:dev` otimizados para ambientes locais, cloud e automação
- 📘 Documentação totalmente reformulada:
  - `README.md` com branding técnico e comercial
  - `SECURITY.md` com política profissional de disclosure
  - `README_full.md` com estrutura completa e onboarding técnico
- 📦 Preparação para DevOps: logs por instância, UID e estado; pronto para Datadog, Stackdriver ou self-hosted

### ♻️ Refatorações

- 🔄 O backend foi **modularizado em produtor e consumidores** — separação total entre escuta e execução
- 🧠 `processRequest()` agora isolado para execução segura dentro de cada worker
- 🔐 Lógica de antiflood, validação e logs encapsulada e mantida centralmente no núcleo
- 🚀 Melhorias de boot: tempo de inicialização otimizado, handlers assíncronos mais leves
- 🧼 `cleanOrphans.js` agora faz varredura contínua de dados residuais por UID

### ❌ Removido

- 🗑️ O **frontend HTML de demonstração foi oficialmente descontinuado**
  - A arquitetura agora é **headless e desacoplada**, 100% agnóstica de tecnologia de frontend
  - Ideal para consumo via **React, Vue, Flutter, CLI, bots, APIs externas ou scripts**
  - Reforça o posicionamento do projeto como **infraestrutura de carteira e orquestração backend**, e não como um exemplo visual estático

### 🔐 Segurança e Resiliência

- ✅ Execução totalmente isolada por job (sem vazamento de estado entre workers)
- 🧯 Workers podem falhar individualmente sem impactar o sistema (auto-retry)
- 🧬 Criptografia e derivação continuam 100% delegadas ao CLI Rust externo
- 📡 RTDB continua sendo o barramento de comunicação reativo, com zero polling

### 🧩 Pronto para Produção

- Escalável horizontalmente via workers ilimitados
- Processamento assíncrono com proteção nativa contra flood, duplicações e inconsistências
- Backend CLI-driven, validado, observável e pronto para ser plugado em produtos reais

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
