# 🔐 Política de Segurança – FireChain Wallet Backend

Na FireChain, segurança não é um recurso. É um pré-requisito.

Este backend foi projetado para **não armazenar segredos criptográficos em memória persistente**, utilizar derivação segura via binário Rust, e operar exclusivamente com carteiras protegidas por senha.

---

## 🛡️ Relatar Vulnerabilidades

Se você encontrou alguma vulnerabilidade ou comportamento inesperado que possa comprometer a segurança:

- Não abra uma issue pública.
- Envie uma mensagem para: Perfil do linkedin (https://www.linkedin.com/in/guilhermelimadev-web3/)
- Forneça:
  - Descrição técnica
  - Passos para reproduzir
  - Impacto estimado

Responderemos em até **72 horas** com confirmação, possível mitigação e agradecimento público (caso autorizado).

---

## 🔄 Responsabilidade

Por favor, **não realize testes destrutivos** em produção.

Este projeto está em evolução e segue os princípios de disclosure responsável.

---

## 🔐 Pilares da Arquitetura Segura

- As carteiras são criptografadas exclusivamente no **CLI Rust**
- Nenhuma chave privada é mantida no backend em tempo de vida longo
- A derivação HD é protegida contra sobrescrita
- O backend utiliza Firebase Auth + antiflood individual

---

Agradecemos pela colaboração com uma Web3 mais segura.  
Você é parte da revolução.