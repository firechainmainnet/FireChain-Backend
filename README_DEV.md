
# 👨‍💻 Guia para Desenvolvedores – FireChain Backend

Este guia fornece tudo o que você precisa para começar a contribuir, entender e executar o FireChain localmente de forma profissional, segura e escalável.

---

## ⚙️ Requisitos Técnicos

- Node.js >= 18
- Redis (via Redis-x64 .zip)
- Firebase Admin SDK (arquivo `AccountService.json`)
- Git

---

## 📦 Instalação e Setup

```bash
git clone https://github.com/firechainmainnet/firechain-backend.git
cd firechain-backend
npm install
```

---

## 🔐 Firebase Admin SDK

Coloque o arquivo `AccountService.json` na raiz do projeto.  
Este arquivo é fornecido pelo Firebase Console (Serviços > Contas de Serviço).

---

## 🌐 Configuração de Ambiente

Crie um arquivo `.env` com o seguinte conteúdo:

```
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

---

## 🔁 Rodando Localmente

### 1. Inicie o Redis Server

Se instalado via `.zip`, execute:

```bash
cd C:\Redis
./redis-server.exe
```

> Deixe essa janela aberta durante a execução.

---

### 2. Inicie o backend (produtor de jobs)

```bash
npm run start:producer
```

---

### 3. Inicie os workers (consumidores)

```bash
npm run start:worker
# ou múltiplos
npm run start:workers
```

Cada worker é independente e pode ser executado em máquinas diferentes.

---

## 🔍 Logs e Debug

Todos os logs são coloridos e padronizados com timestamp + UID:

```
[2025-05-24 14:13:22] ℹ️ INFO [UID:x9AZQ] Ação recebida: criar_perfil
[2025-05-24 14:13:23] ✅ SUCESSO Perfil criado com sucesso
```

---

## 🧪 Testes Locais

- Teste criando requisições no nó `requests/{uid}_req_{timestamp}`
- Observe as respostas chegando em `users/{uid}/responses/{reqId}`
- Use `firebase.database().ref().set()` ou `curl` com RTDB REST API para simular

---


## 📚 Recursos úteis

- [`README.md`](./README.md) — visão geral e marketing
- [`SECURITY.md`](./SECURITY.md) — arquitetura de segurança
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — como contribuir
- [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) — cultura de comunidade

---

**Bem-vindo ao backend da FireChain — onde arquitetura, segurança e modularidade são levadas a sério.**
