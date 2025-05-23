
# 🤝 Guia de Contribuição – FireChain Wallet Backend

Obrigado por seu interesse em contribuir com a FireChain — uma stack backend Web3 projetada para escalar com segurança real, modularidade e performance.

Aqui, acreditamos que cada linha de código representa não apenas uma melhoria funcional, mas uma peça essencial na construção de uma infraestrutura descentralizada, auditável e orientada ao produto.

---

## 🚀 Nossa Visão

FireChain é mais que um repositório: é uma fundação para carteiras Web3 modernas, bots, DApps e orquestração CLI-first.  
Toda contribuição deve refletir os pilares que sustentam este projeto:

- 🛡️ Segurança antes da conveniência
- 🔁 Fluxo assíncrono e reativo
- 🧩 Arquitetura modular e escalável
- 📚 Documentação clara, precisa e dev-friendly
- 💼 Pensamento de produto, não apenas código

---

## 🧱 Como Contribuir

> Siga os passos abaixo para submeter uma melhoria, correção ou funcionalidade nova:

1. 🔀 **Faça um fork** deste repositório
2. 🛠️ Crie uma nova branch baseada na `main`:
   ```bash
   git checkout -b feature/nome-da-feature
   ```
3. 💾 Commit suas alterações de forma descritiva:
   ```bash
   git commit -am "✨ feat: adiciona derivação customizada HD[N]"
   ```
4. 🚀 Envie seu código:
   ```bash
   git push origin feature/nome-da-feature
   ```
5. 📥 Crie um **Pull Request** com:
   - Contexto claro
   - Antes/depois se aplicável
   - Prints, logs ou evidência de testes locais

---

## ✅ Critérios para Aprovação de PR

- ✅ O código deve **compilar com sucesso** (`npm run start:worker`)
- ✅ Nenhum job pode falhar silenciosamente
- ✅ As validações e logs devem estar alinhadas com o padrão existente
- ✅ Seguir padrões de estilo e modularização dos arquivos:
  - Use nomes de arquivos/kebab-case
  - Evite acoplamento entre handlers
  - Reutilize `core/` e `queue/` sempre que possível

### 🛑 Não será aceito:

- Código sem contexto
- Funcionalidades sem documentação no README
- Lógica crítica fora dos workers (ex: CLI direto no backend)

---

## 🧠 Áreas de Contribuição Bem-Vindas

- 🧩 **Novos handlers** para ações blockchain
- 🔐 **Melhorias no antiflood / proteção duplicata**
- 🔁 **Expansão do modo BullMQ (delay, prioridade, repeatable jobs)**
- 📊 **Integração com dashboards externos (ex: Grafana, Prometheus, Datadog)**
- 🧪 **Casos de teste estruturados (Jest ou CLI-mock)**
- 🖥️ **Geradores de carteiras com parâmetros customizados**
- 🔄 **Suporte a outros formatos além de `.wallet`**

---

## 🌍 Comunicação

Preferimos discussões técnicas via Pull Request e issues.  
Para sugestões estratégicas, roadmap ou integração institucional, entre em contato diretamente com o mantenedor:

🔗 [LinkedIn – Guilherme Lima](https://www.linkedin.com/in/guilhermelimadev-web3/)

---

## 🔏 Ética e Boas Práticas

- Comente seu código em português ou inglês
- Use inglês para nomes, commits, variáveis e mensagens
- Prefira funções puras e efeitos isolados (especialmente em CLI e validação)
- Nunca exponha dados reais de usuários ou segredos

---

## 🏁 Nosso Compromisso

Ao contribuir, você se torna parte de uma missão maior:  
**elevar o padrão de segurança, experiência e arquitetura na Web3**.

A FireChain é e sempre será open source, modular, e feita para durar.

---

**Bem-vindo à revolução backend-first da Web3.**  
🔥 Vamos construir juntos.
