
## 🔥 FireChain Backend v2.0.3

A versão 2.0.3 representa uma **transformação estrutural definitiva** na FireChain:  
⏩ saímos de um backend funcional para uma **infraestrutura de produto**, com escalabilidade horizontal real, desacoplamento total de UI, e execução assíncrona via fila profissional (BullMQ + Redis).

---

### ✨ Novidades e Destaques

- 🧵 Processamento 100% assíncrono com BullMQ + Redis
- 🧠 Separação completa entre produtor (`backend.js`) e workers (`worker.js`)
- ⚙️ `queue.js` com instância central configurável via `.env`
- 🔁 Suporte a múltiplos workers para execução concorrente e paralela
- ✅ Reestruturação completa do `README`, `SECURITY`, `CONTRIBUTING` e `CODE_OF_CONDUCT`
- 🔄 Compatibilidade total com Redis no Windows (sem Docker)

---

### 🛡️ Segurança, Escalabilidade e Profissionalismo

- Cada requisição é transformada em job isolado com timeout, retry e proteção contra falha silenciosa
- Criptografia continua no CLI externo (Rust), com Argon2id + AES-GCM
- Mecanismo antiflood e fingerprint duplicado continuam em vigor
- Workers podem ser executados em múltiplas máquinas/localidades

---

### 📂 Nova Estrutura Modular e Headless

```
firechain-backend/
├── src/
│   ├── backend.js          # Escuta RTDB e envia para BullMQ
│   ├── worker.js           # Job handler
│   ├── queue/              # Instância BullMQ isolada
│   ├── core/               # Logger, validator, cache, sanitização, antiflood
│   ├── handlers/           # Lógica modular por action
│   └── cleanup/            # Limpeza de responses órfãos
├── config/                 # Firebase + Redis
├── .env
├── package.json
```

---

### ❌ Frontend Desacoplado

O frontend HTML de testes foi **removido por completo**.

A FireChain agora é **100% integrável** via Firebase RTDB.  
Ideal para uso com:
- React / Next.js / Vue
- Flutter / mobile native
- Extensões, bots, ou ambientes headless

---

### 📎 Como começar?

```bash
git clone https://github.com/firechainmainnet/firechain-backend.git
cd firechain-backend
npm install
```

Configure o Redis (via `.zip`) e Firebase (`AccountService.json`), depois:

```bash
npm run start:producer
npm run start:workers
```

---

📌 Requisitos:
- Node.js 18+
- Redis ativo (porta 6379)
- Firebase RTDB + Service Account
- CLI Rust compilado do projeto [Fire-Wallet-CLI](https://github.com/firechainmainnet/Fire-Wallet-CLI)

---

**MIT License**  
Desenvolvido por [Guilherme Lima](https://www.linkedin.com/in/guilhermelimadev-web3/)  
Com foco em **segurança real**, **arquitetura modular** e **performance descentralizada**.
