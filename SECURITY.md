
# 🔐 FireChain Security Policy – Backend v2.0.3

Na FireChain, **segurança não é uma funcionalidade** — é a base da arquitetura.

Nosso backend foi construído sob os princípios de **segurança por design**, utilizando técnicas avançadas de criptografia, segregação de responsabilidades, controle de entrada/saída e observabilidade contínua. A execução crítica é feita externamente via binário Rust, garantindo que nenhuma informação sensível circule ou permaneça em ambientes inseguros.

---

## 📣 Comunicação de Vulnerabilidades

Valorizamos e recompensamos a descoberta responsável de vulnerabilidades.

Se você identificou uma possível falha de segurança, siga este fluxo:

- ❌ **Não crie uma issue pública no GitHub.**
- ✅ Envie uma mensagem privada diretamente para o autor:
  - 🔗 [Perfil no LinkedIn](https://www.linkedin.com/in/guilhermelimadev-web3/)
  - Inclua obrigatoriamente:
    - Relato técnico detalhado
    - Evidência ou passo a passo para reprodução
    - Avaliação do impacto (estimado)

🔁 Retornaremos em até **72 horas úteis**, com:
- Confirmação do recebimento
- Investigação e plano de mitigação (se aplicável)
- Reconhecimento público ou privado (se autorizado)

---

## 🔄 Política de Disclosure

Adotamos o modelo de **responsible disclosure**, conforme melhores práticas de segurança da indústria.

Pedimos a todos os pesquisadores e colaboradores:
- **Não executar testes destrutivos** ou de negação de serviço em ambientes públicos
- Utilizar ambientes locais para exploração de comportamentos
- Evitar engenharia reversa fora dos limites éticos do open source

---

## 🧱 Fundamentos da Arquitetura Segura

### 🔐 Criptografia Externa via CLI
- Todas as carteiras são criadas e criptografadas com **CLI Rust externo**
- Utilizamos **AES-256-GCM + Argon2id**, executado fora do ambiente Node.js
- O CLI funciona em modo `--json`, 100% auditável e automatizável

### 🧬 Proteção HD Imutável
- Cada derivação HD[N] é única e protegida contra sobrescrita
- Armazenamento em árvore `/wallets/{id}/derived/{index}` com verificação prévia

### 🧼 Retenção Segura de Dados
- Respostas a requisições expiram automaticamente após 15 segundos
- Nenhuma chave privada, senha ou dump permanece ativo após execução

### 🛡️ Camadas Defensivas
- **Antiflood:** máximo de 5 requisições a cada 10 segundos por UID
- **Proteção contra duplicatas:** fingerprint hash com TTL (5s)
- **Validações fortes:** UID, label, índice HD, senha — todas verificadas
- **Sanitização profunda:** HTML-safe, normalização unicode e limite de tamanho
- **Execução isolada:** processamentos críticos são feitos via child process

---

## 🧩 Monitoramento e Logging

- Cada requisição é logada com:
  - UID, timestamp e tipo de ação
  - Resultado (sucesso ou erro)
- Suporte à integração com Datadog, Logtail ou Stackdriver (via abstração de logger)

---

## ⚖️ Conformidade e Ética

- Utilizamos apenas dependências auditáveis
- Nenhum dado sensível é vendido, compartilhado ou usado para análise
- Firebase Auth segue regras da [GDPR](https://gdpr.eu) e [LGPD](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)

---

## 🛡️ Nosso Compromisso

Estamos comprometidos com a construção de soluções Web3 seguras, auditáveis e livres.

Contribuir para a FireChain é também ajudar a moldar a próxima geração de segurança blockchain.

---

**FireChain Security – Pensado desde a linha 0 para resistir, escalar e proteger.**

_Agradecemos sua colaboração em tornar o ecossistema Web3 mais seguro._
