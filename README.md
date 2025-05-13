# 🔥 FireChain – Backend + Wallet CLI + Frontend Reativo e Seguro (v2.0.2)

Este repositório entrega **a arquitetura completa da FireChain**, combinando:

- 🔐 Backend seguro com validação, sanitização e execução CLI Rust
- 🔁 Comunicação em tempo real via Firebase RTDB (sem sockets, sem APIs REST)
- 💻 Frontend funcional para gestão de perfis e carteiras HD
- 🔧 Integração direta com o CLI [Fire-Wallet-CLI](https://github.com/firechainmainnet/Fire-Wallet-CLI)

> 🧱 Um case real de backend escalável, CLI-driven, e com foco em segurança real.

---

## 🚀 Visão Geral

✔️ Backend escuta uma única rota global (`requests/{uid_reqId}`)  
✔️ Frontend envia ações com autenticação Firebase  
✔️ CLI Rust executa a segurança real: criação, derivação e criptografia  
✔️ Requisições são validadas, antifloodadas, e protegidas contra duplicatas  
✔️ Respostas expiram após 15 segundos (zero cache)

---

## 📦 O que esse projeto entrega?

### Backend (Node.js + Firebase Admin)

- 🔐 Autenticação por UID com validação forte
- 🧠 Módulos: `validator.js`, `sanitizer.js`, `requestCache.js`, `logger.js`
- 🚫 Antiflood (5 reqs por UID a cada 10s)
- 🔁 Proteção contra requisições duplicadas
- 🧼 Limpeza automática de responses antigos
- 📁 Estrutura modular e pronta para escalar

### CLI (compilado via Rust)

- 🆕 Criação de wallets aleatórias ou HD (12/24 palavras)
- 🔐 Exportação criptografada `.wallet` (AES-256-GCM + Argon2id)
- 🧠 Derivação HD[N] com imutabilidade
- 🔎 Descriptografia segura com senha
- ✅ Modo JSON automatizável

### Frontend (HTML + JS)

- 🔐 Login, criação e atualização de perfil
- 💼 Criação de wallets + visualização e derivação
- ⚡ RTDB em tempo real com resposta exibida via toast
- 📲 Compatível com a nova arquitetura v2.0.2

---

## 🧱 Estrutura do Projeto

```
firechain-backend/
├── src/
│   ├── backend.js
│   ├── cleanup/cleanOrphans.js
│   ├── handlers/
│   │   ├── processRequest.js
│   │   └── wallet/
│   │       ├── createWallet.js
│   │       ├── deriveAddress.js
│   │       ├── listWallets.js
│   │       └── viewWallet.js
│   └── lib/
│       ├── antiflood.js
│       ├── firebase.js
│       ├── logger.js
│       ├── requestCache.js
│       ├── sanitizer.js
│       ├── validator.js
│       └── walletCli.js
│
├── public/index.html
├── public/frontend.js
├── regras_firebase.txt
├── package.json
├── README.md
├── CHANGELOG.md
```

---

## ⚙️ Como Rodar Localmente

### 1. Clonar o projeto e instalar

```bash
git clone https://github.com/firechainmainnet/firechain-backend.git
cd firechain-backend
npm install
```

### 2. Adicionar credencial Firebase

Coloque o arquivo `AccountService.json` na raiz do projeto.

### 3. Compilar o CLI Rust

```bash
git clone https://github.com/firechainmainnet/Fire-Wallet-CLI.git
cd Fire-Wallet-CLI
cargo build --release
```

Atualize o caminho do binário em `src/lib/walletCli.js`:

```js
const CLI_PATH = 'D:/.../firechain_wallet.exe';
```

### 4. Iniciar o backend

```bash
npm start
```

### 5. Abrir o frontend de testes

Abra o arquivo `public/index.html` no navegador.

---

## 🔒 Segurança Embutida

| Recurso                         | Descrição |
|---------------------------------|-----------|
| Antiflood por UID               | 5 requisições por 10 segundos |
| Requisições duplicadas          | Bloqueadas por fingerprint e UID |
| Sanitização multi-camada        | HTML, regex, normalização segura |
| Validações de tipo e estrutura  | UID, senha, índice HD, etc. |
| Criptografia no Rust (CLI)      | AES-256-GCM + Argon2id |
| Expiração automática de resposta| Após 15s por padrão |
| HD[N] imutável e validado       | Derivação única por índice |

---

## 🔧 Ações Suportadas

| Ação                    | Descrição |
|-------------------------|-----------|
| `criar_perfil`          | Criação de nome/bio |
| `ver_perfil`            | Retorna nome e bio |
| `atualizar_perfil`      | Atualiza nome e bio |
| `criar_wallet_random`   | Cria wallet aleatória via CLI |
| `criar_wallet_mnemonic12`| Cria wallet HD (12 palavras) |
| `criar_wallet_mnemonic24`| Cria wallet HD (24 palavras) |
| `ver_wallet`            | Descriptografa `.wallet` com senha |
| `listar_wallets`        | Lista wallets + HDs derivados |
| `derivar_endereco`      | Deriva endereço HD[N] com proteção contra sobrescrita |

---

## 🛠️ Ideal para

- DApps que precisam de segurança real (sem JS-only)
- Wallets com derivação determinística
- Backends reativos para múltiplos usuários
- Bots seguros sem depender de servidores REST

---

## 🛡️ Licença

MIT — Desenvolvido com foco em segurança, arquitetura e escalabilidade por **[Guilherme Lima](https://www.linkedin.com/in/guilhermelimadev-web3/)**

---

**FireChain Backend v2.0.2** — segurança e performance sem atalhos.