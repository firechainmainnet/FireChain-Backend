
# 🔐 FireChain Security & Commercial Use Policy — Backend v2.0.3a

FireChain foi construída sob o princípio **“Secure‑by‑Default”**: cada linha de código, cada dependência
e cada componente de infraestrutura passaram por threat‑modeling, análise estática
(SAST) e varredura de dependências (SCA) antes de chegar a esta release.

> **Última revisão:** 24 mai 2025  
> **Contato direto:** [LinkedIn – Guilherme Lima](https://www.linkedin.com/in/guilhermelimadev-web3/)

---

## 1 · Visão‑geral de Segurança

| Camada | Controles Aplicados | Ferramentas / Padrões |
|--------|--------------------|-----------------------|
| Criptografia | AES‑256‑GCM + Argon2id | Executado 100 % fora do Node.js via *firechain‑cli* (Rust) |
| Execução | _Privilege separation_ | **AppArmor** profile + usuário sem privilégios |
| Fila & Mensageria | Proteção contra *flood* (5 req / 10 s), fingerprint anti‑replay (TTL 5 s) | BullMQ + Redis |
| Dados em repouso | Respostas expiram em 15 s | Firebase RTDB ruleset |
| Código | CI com **ESLint**, **npm‑audit**, **dependency‑check** e **Semgrep** | GitHub Actions |
| Observabilidade | Logs imutáveis (hash‑encadeados) | SHA‑256 chain + log‑router |
| Infra | Hardening CIS 1.4 (Linux) | Ansible baseline |

---

## 2 · Fluxo de Divulgação de Vulnerabilidade

1. **Não** abra uma _issue_ pública.  
2. Envie *inbox* no LinkedIn contendo:  
   - Descrição técnica e *proof‑of‑concept*  
   - Impacto estimado e classificação CVSS (se possível)  
3. SLA de resposta inicial: **≤ 72 h úteis**.  
4. Prazo máximo para _patch_ público: **≤ 14 dias corridos** após confirmação.  
5. Reconhecimento na _Hall of Fame_ (ou anonimato a pedido).

> **Recompensas** – falhas críticas (CVSS ≥ 8.8) elegíveis a recompensa _bug‑bounty_ a partir de **US$ 200**.

---

## 3 · Compromissos de Patch Management

| Severidade | Exemplo | SLA de Mitigação | SLA de Patch |
|------------|---------|------------------|--------------|
| Crítica (CVSS ≥ 9) | Execução remota sem auth | 24 h | 72 h |
| Alta (7 ≤ CVSS \< 9) | Leakage de seed criptografada | 72 h | 7 dias |
| Média (4 ≤ CVSS \< 7) | Bypass parcial de antiflood | 7 dias | 21 dias |
| Baixa | Log info‑leak | Best effort | Próxima release |

---

## 4 · Uso Open Source vs Licença Comercial

### 4.1 Licença OSS (MIT)

O código neste repositório é liberado sob **MIT** para fins:

* Pesquisa & educação  
* Prova de conceito interna  
* Projetos pessoais *non‑profit*

> **Limitações:** sem garantias de suporte, SLA ou atualizações de segurança expeditas.

### 4.2 Licença Comercial (*FireChain CLI + Backend*)

| Plano | Ideal para | Inclui | Preço¹ |
|-------|------------|--------|--------|
| **Starter** | Startups & MVP | Chave de ativação CLI, uso comercial ≤ 50 k carteiras/ano, 1 ambiente prod | **US$ 990 / ano** |
| **Scale** | Fintechs & Games | Starter + 72 h support, 3 ambientes, logo “Powered by FireChain” removido | **US$ 2 900 / ano** |
| **Enterprise** | Exchanges & Bancos | Scale + SLA 99.99 %, suporte 24×7, consultoria DevSecOps, cláusulas DPA/GDPR | *sob consulta* |

¹ Preço em dólar; impostos locais não inclusos.

**Processo de compra**

1. Solicite contrato via LinkedIn.
2. Receba link Docusign + fatura.  
3. Após pagamento, execute:  
   ```bash
   firechain-cli license activate <token>
   ```  
4. Receba acesso ao canal Slack privado & boletins de segurança antecipados.

---

## 5 · Termos Legais Importantes

- **Isenção de Responsabilidade:** o software é fornecido _“as‑is”_. Não nos responsabilizamos por perdas diretas ou indiretas decorrentes do uso.
- **Limitação de Responsabilidade:** em nenhuma hipótese a FireChain será responsável por quantia superior ao valor pago em licença nos últimos 12 meses.
- **Indenização:** uso inadequado ou em desacordo com esta política isenta a FireChain de qualquer pleito de terceiros.
- **Export Compliance:** o usuário declara estar em conformidade com regulamentos de controle de exportação de software criptográfico dos EUA e UE.
- **Proibições:** é vedado o uso em atividades ilícitas, _scams_ ou violações a sanções internacionais. Licenças suspeitas podem ser revogadas.

---

## 6 · Conformidade & Privacidade

- **GDPR / LGPD ready** – todos os dados pessoais limitados a UID Firebase, pseudonimizados.  
- **KMS externo** – chaves de configuração (.env) recomendadas no AWS KMS ou GCP KMS.  
- **Data Residency** – suporte a shards RTDB em regiões `eu‑central1`, `us‑central1`, `asia‑southeast1`.

---

## 7 · Contato urgente

* LinkedIn: [Guilherme Lima](https://www.linkedin.com/in/guilhermelimadev-web3/)  
* Chave PGP (SHA‑256 fingerprint): `3D5E 2B8C 9F12 D7A1 E43B  8C97 C2F4 81AB 795C DA67`

> **Nota:** chamadas comerciais devem usar o Linkedin.

---

**FireChain Security & Legal** – projetado para proteger, licenciado para escalar.
