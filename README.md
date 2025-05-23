
# 🔥 FireChain v2.0.3 — Backend Modular, CLI-Driven, Reativo e Escalável com Segurança de Produto

**FireChain** é uma arquitetura backend Web3 de última geração.  
Projetada para escalar, proteger e servir aplicações descentralizadas com **resposta em tempo real, segurança cripto nativa e UX moderna**.

---

## 🧠 Sobre o Projeto

A FireChain é construída sobre pilares sólidos:

- **Executável seguro** com um CLI Rust externo para criar e gerenciar carteiras HD com criptografia real
- **Requisições em tempo real** e sem latência via Firebase RTDB
- **Fila distribuída** com BullMQ + Redis para suportar milhares de requisições simultâneas com controle e estabilidade
- **Frontend reativo** compatível com bots, dashboards ou carteiras web
- **Validação, antiflood e proteção contra duplicação** nativos, com log profissional

Este repositório representa o **núcleo de execução da FireChain**, utilizado para produção de carteiras, derivação HD e operação segura.

---

## 🔗 Tecnologias Aplicadas

| Camada         | Tecnologia                | Função Principal |
|----------------|----------------------------|------------------|
| Backend        | Node.js + Firebase RTDB    | Processamento reativo + producer |
| Fila           | BullMQ + Redis             | Job queue robusta com retries, delay e escalabilidade |
| CLI Externo    | Fire-Wallet-CLI (Rust)     | Segurança real, criptografia, derivação |
| Frontend       | HTML + Firebase JS SDK     | Interface reativa e mínima |
| Segurança      | AES-256-GCM, Argon2id      | Criptografia forte via Rust |
| Controle       | Logger customizado         | Log por nível, UID e tempo |
| Proteção       | Antiflood, duplicatas      | Segurança contra abusos e spams |

---

## 🧱 Estrutura Profissional de Projeto

```
firechain-backend/
├── src/
│   ├── backend.js                # 🔁 Producer: escuta RTDB e enfileira jobs
│   ├── worker.js                 # 🧵 Worker: processa jobs com processRequest()
│   ├── cleanup/
│   │   └── cleanOrphans.js       # 🧼 Limpa dados expirados e pendentes
│   ├── handlers/
│   │   ├── index.js              # 🔀 Roteamento de ações recebidas
│   │   ├── perfil/
│   │   │   ├── criar.js
│   │   │   ├── ver.js
│   │   │   └── atualizar.js
│   │   └── wallet/
│   │       ├── create.js
│   │       ├── derive.js
│   │       ├── list.js
│   │       └── view.js
│   ├── queue/
│   │   └── queue.js              # 🔃 Configuração BullMQ
│   └── core/
│       ├── antiflood.js          # Proteção por janela de tempo
│       ├── logger.js             # Logger com UID e timestamps
│       ├── requestCache.js       # Proteção contra duplicatas
│       ├── sanitizer.js          # Sanitização multi-nível
│       ├── validator.js          # Validação por tipo/limite/estrutura
│       └── walletCli.js          # Executa Fire-Wallet-CLI
├── config/
│   ├── firebase.js               # Firebase Admin SDK init
│   └── redis.js                  # Conexão BullMQ
├── public/
│   ├── index.html
│   └── frontend.js
├── package.json
├── .env
├── AccountService.json
```

---

## 🚀 Como Rodar (Windows Local)

### 1. Instale Redis via `.zip`

- Baixe: https://github.com/microsoftarchive/redis/releases
- Extraia para `C:\Redis`
- Execute via PowerShell:

```powershell
cd C:\Redis
.
edis-server.exe
```

### 2. Inicie Backend + Workers

```powershell
cd D:\blockchain\fire-node
npm install
npm run start:producer
npm run start:workers
```

### 3. Integração com Frontends

A FireChain foi projetada para ser consumida facilmente por qualquer tipo de frontend — React, Vue, mobile (Flutter, React Native), bots, ou extensões.

Basta:
1. Autenticar com Firebase (obter o `uid`)
2. Escrever uma requisição em `requests/{uid}_req_{timestamp}` com o payload necessário
3. Observar `users/{uid}/responses/{reqId}` no Firebase RTDB
4. Renderizar a resposta quando ela chegar

➡️ Como o backend responde automaticamente, a integração é 100% reativa e sem REST.

---

## ⚙️ Execução CLI (Fire-Wallet)

- Criação HD random, 12 ou 24 palavras
- Exportação `.wallet` criptografada (AES-256 + Argon2id)
- Derivação HD[N] com controle imutável
- Execução 100% fora do browser
- Dump JSON seguro para análise

---

## 🔐 Segurança Corporativa Nativa

| Recurso                         | Descrição |
|----------------------------------|-----------|
| Antiflood                       | 5 ações/10s por UID |
| Fingerprint anti-duplicação     | TTL 5s por ação/UID |
| Sanitização profunda            | HTML-safe, trim, normalização |
| Validação forte                 | UID, senha, índice, label etc. |
| Expiração de respostas          | Após 15 segundos |
| CLI com criptografia real       | AES-GCM + Argon2id (Rust) |
| Modo JSON                       | CLI legível e automatizável |
| Logging com UID e timestamp     | Para monitoramento em produção |

---

## 📦 Actions Suportadas

| Action                     | Finalidade |
|----------------------------|------------|
| `criar_perfil`             | Criação segura de perfil |
| `ver_perfil`               | Retorno estruturado |
| `atualizar_perfil`         | Edição validada |
| `criar_wallet_random`      | Wallet randômica |
| `criar_wallet_mnemonic12`  | HD wallet (12 palavras) |
| `criar_wallet_mnemonic24`  | HD wallet (24 palavras) |
| `ver_wallet`               | Descriptografa `.wallet` com senha |
| `listar_wallets`           | Mostra todas as wallets ativas |
| `derivar_endereco`         | Deriva HD[N] com verificação única |

---

## 📈 Ideal para...

- Plataformas Web3 com múltiplos usuários simultâneos
- Serviços que requerem criptografia fora do browser
- Interfaces leves com respostas em tempo real
- Bots e scripts sem backend tradicional
- Sistemas de carteira com derivação HD real
- Painéis administrativos ou wallets client-less

---

## 👨‍💻 Autor

**Guilherme Lima**  
Arquiteto Web3, especialista em soluções CLI-driven, criptografia aplicada e infraestrutura descentralizada.  
🔗 [LinkedIn](https://www.linkedin.com/in/guilhermelimadev-web3/)

---

## 📜 Licença

MIT — Seguro, auditável e open-source para escalar com liberdade.

---

**FireChain v2.0.3 — Arquitetura real para carteiras, DApps e produtos Web3.**  
🔥 Escalável, modular, e com foco total em segurança e UX.
