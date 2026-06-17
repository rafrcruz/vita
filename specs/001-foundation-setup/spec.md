# Feature Specification: Foundation / Platform Setup

**Feature Branch**: `001-foundation-setup`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Criar a especificação da feature 'Foundation / Platform Setup' para estabelecer toda a base técnica do projeto VITA antes da implementação de qualquer funcionalidade de negócio."

## Overview

Esta feature estabelece a fundação técnica do VITA: o esqueleto executável de frontend e
backend, o gate de acesso seguro, a camada de persistência, a observabilidade e o pipeline
automatizado de qualidade e entrega. Ela **não** inclui nenhuma funcionalidade de negócio do
domínio de saúde (registros, dashboards, insights, IA, sincronização offline). Seu objetivo é
entregar uma base sólida, segura, observável e pronta para a evolução do produto, totalmente
operável e reproduzível por agentes de IA.

Os "usuários" desta feature são os **desenvolvedores e agentes de IA** que constroem e operam o
VITA, além do **proprietário-administrador** que controla quem tem acesso à aplicação.

## Clarifications

### Session 2026-06-16

- Q: Modelo de runtime/hospedagem do backend? → A: Backend como funções serverless na Vercel
  (Node), em um **projeto Vercel separado** do frontend (Vite). Ambos com deploy automático no push
  para `main` via **GitHub Actions**. (Opção A)
- Q: Estratégia de sessão/autenticação? → A: **Stateless** — token assinado em cookie `httpOnly` e
  `Secure`, sem armazenamento de sessão no servidor. (Opção A)
- Q: Escopo da administração da allowlist nesta fundação? → A: **Tela de administração in-app
  completa (UI)** para gerir a allowlist, além dos endpoints de API admin-only que a suportam; admin
  inicial semeado por variável de ambiente/migration. (Opção C)

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Esqueleto executável da aplicação (Priority: P1)

Um desenvolvedor ou agente de IA clona o repositório, executa um único conjunto de comandos
documentados e obtém o frontend (SPA/PWA) e o backend (API) rodando localmente, com uma rota de
verificação de saúde respondendo e o frontend conseguindo se comunicar com o backend.

**Why this priority**: Sem um esqueleto que instala, builda e roda de forma reproduzível, nenhuma
outra capacidade pode ser desenvolvida ou validada. É o MVP absoluto da fundação.

**Independent Test**: Em uma máquina limpa, seguir o guia de setup do repositório e confirmar que
ambos os serviços sobem, a página inicial do PWA carrega e o endpoint de health retorna status
saudável — sem necessidade de banco, autenticação ou deploy.

**Acceptance Scenarios**:

1. **Given** um clone limpo do repositório, **When** o desenvolvedor executa os comandos de
   instalação e inicialização documentados, **Then** frontend e backend iniciam sem erros.
2. **Given** os serviços rodando localmente, **When** o frontend chama o endpoint de health do
   backend, **Then** recebe uma resposta de status saudável.
3. **Given** o repositório, **When** um agente de IA lê a documentação de setup, **Then** todos os
   comandos necessários estão descritos sem passos manuais ambíguos.

---

### User Story 2 - Persistência com migrations e gestão de ambiente (Priority: P2)

Um desenvolvedor ou agente provisiona o banco de dados gerenciado, aplica as migrations versionadas
e a aplicação conecta-se a ele usando configuração por ambiente, sem segredos versionados.

**Why this priority**: Praticamente toda funcionalidade futura depende de persistência confiável,
de um histórico de schema versionado e de um mecanismo seguro de configuração/segredos.

**Independent Test**: Apontar a aplicação para um banco vazio, rodar o comando de migration e
verificar que o schema é criado; confirmar que a aplicação falha de forma clara quando uma variável
de ambiente obrigatória está ausente, e que nenhum segredo está presente no repositório.

**Acceptance Scenarios**:

1. **Given** um banco vazio, **When** o comando de migration é executado, **Then** o schema é criado
   e o estado de migrations fica registrado.
2. **Given** variáveis de ambiente obrigatórias ausentes, **When** a aplicação inicia, **Then** ela
   falha imediatamente com uma mensagem clara indicando o que está faltando.
3. **Given** o repositório, **When** auditado, **Then** nenhuma credencial ou segredo aparece no
   código versionado e existe um arquivo de exemplo (`.env.example`) documentando as variáveis.
4. **Given** uma migration nova, **When** aplicada, **Then** o estado fica registrado; e o
   procedimento de rollback (restauração/branch do banco ou SQL de reversão manual) está documentado
   e validável.

---

### User Story 3 - Acesso seguro via Google + allowlist (Priority: P3)

Apenas pessoas cujo e-mail consta na allowlist administrada pela aplicação conseguem autenticar-se
via conta Google e acessar áreas protegidas; todas as demais são bloqueadas.

**Why this priority**: O VITA lida com dados de saúde sensíveis; o gate de acesso é um requisito
fundamental da Constitution e precede qualquer exposição de dados.

**Independent Test**: Tentar acessar uma rota protegida sem autenticação (bloqueado); autenticar com
uma conta Google fora da allowlist (bloqueado); autenticar com uma conta na allowlist (permitido).

**Acceptance Scenarios**:

1. **Given** um usuário não autenticado, **When** acessa uma rota protegida, **Then** o acesso é
   negado e ele é direcionado ao login.
2. **Given** um usuário autenticado via Google cujo e-mail **não** está na allowlist, **When** tenta
   acessar a aplicação, **Then** o acesso é negado com mensagem apropriada.
3. **Given** um usuário cujo e-mail **está** na allowlist, **When** autentica via Google, **Then**
   obtém acesso às áreas protegidas e uma sessão válida é estabelecida.
4. **Given** o administrador autenticado, **When** adiciona ou remove um e-mail pela tela de
   administração in-app, **Then** a mudança é persistida e passa a valer para autenticações
   subsequentes.
5. **Given** um usuário comum (não administrador), **When** tenta acessar a tela ou os endpoints de
   administração da allowlist, **Then** o acesso é negado.
6. **Given** uma sessão, **When** ela expira ou o usuário faz logout, **Then** o acesso protegido é
   revogado.

---

### User Story 4 - Observabilidade, tratamento de erros e documentação da API (Priority: P4)

Operadores conseguem entender o comportamento do sistema por meio de logs estruturados, captura
centralizada de erros e respostas de erro consistentes; consumidores da API encontram documentação
atualizada dos endpoints.

**Why this priority**: Diagnóstico e confiabilidade dependem de observabilidade desde o início;
adicioná-la depois é mais caro e arriscado.

**Independent Test**: Provocar um erro tratado e um não tratado e confirmar que ambos geram log
estruturado, são reportados à ferramenta de captura de erros e retornam uma resposta de erro
padronizada (sem vazar dados sensíveis); abrir a documentação da API e validar que reflete os
endpoints existentes.

**Acceptance Scenarios**:

1. **Given** uma requisição que falha, **When** processada, **Then** o sistema retorna um formato de
   erro consistente e registra um log estruturado correlacionável.
2. **Given** um erro não tratado, **When** ocorre, **Then** ele é capturado pela ferramenta de
   monitoramento de erros com contexto suficiente para diagnóstico.
3. **Given** logs gerados, **When** auditados, **Then** não contêm dados de saúde sensíveis nem
   segredos.
4. **Given** a API, **When** um desenvolvedor consulta a documentação, **Then** os endpoints
   disponíveis, formatos de requisição/resposta e erros estão descritos e atualizados.

---

### User Story 5 - Qualidade automatizada e entrega contínua (Priority: P5)

A cada alteração de código, verificações automatizadas (lint, type-check, testes) rodam no CI; ao
integrar na branch principal, a aplicação é implantada automaticamente nas plataformas de hospedagem
sem passos manuais.

**Why this priority**: Garante que a fundação permaneça saudável e reproduzível e que a operação
seja automatizável por agentes de IA, conforme exigido.

**Independent Test**: Abrir um pull request com uma mudança que quebra lint/types/testes e confirmar
que o CI falha e bloqueia; integrar uma mudança válida e confirmar que o deploy automatizado publica
a nova versão.

**Acceptance Scenarios**:

1. **Given** um pull request, **When** o CI executa, **Then** lint, verificação de tipos e testes
   rodam e o resultado é reportado no PR.
2. **Given** um PR que falha em qualquer verificação, **When** avaliado, **Then** a integração é
   bloqueada até a correção.
3. **Given** uma mudança integrada à branch principal, **When** o pipeline conclui, **Then** a
   aplicação é implantada automaticamente sem intervenção manual.
4. **Given** um pull request, **When** aberto, **Then** um ambiente de pré-visualização é
   disponibilizado para validação.

---

### Edge Cases

- O que acontece quando uma variável de ambiente obrigatória está ausente ou inválida na
  inicialização? (Falha rápida e explícita.)
- Como o sistema se comporta quando o banco de dados está indisponível? (Health check reporta
  estado degradado; erros tratados, sem vazamento de stack para o usuário.)
- O que acontece quando o provedor de identidade Google está indisponível? (Login falha com
  mensagem clara; sem acesso concedido.)
- Como a allowlist se comporta quando fica vazia? (Ninguém além do administrador semeado obtém
  acesso; não pode resultar em acesso irrestrito.)
- Como migrations conflitantes ou aplicadas pela metade são tratadas? (Estado de migrations é
  consistente; aplicação não roda contra schema parcial.)
- O que acontece se uma sessão for adulterada ou expirar durante o uso? (Acesso é revogado.)
- Como segredos são tratados em ambientes de preview/CI? (Injetados via cofre da plataforma, nunca
  versionados.)

## Requirements _(mandatory)_

### Functional Requirements

**Estrutura e execução local**

- **FR-001**: O projeto MUST ser organizado como um monorepo único contendo as aplicações de
  frontend e backend e a configuração compartilhada.
- **FR-002**: O sistema MUST oferecer um conjunto documentado de comandos para instalar dependências
  e iniciar frontend e backend localmente a partir de um clone limpo.
- **FR-003**: O frontend MUST ser entregue como SPA com requisitos mínimos de PWA e o backend MUST
  expor uma API HTTP com uma rota de verificação de saúde.
- **FR-004**: O frontend MUST conseguir se comunicar com o backend em ambiente local através de
  configuração explícita de endpoint.

**Persistência, ambiente e segredos**

- **FR-005**: O sistema MUST persistir dados em um banco de dados gerenciado e conectar-se a ele via
  configuração por ambiente.
- **FR-006**: O sistema MUST gerenciar o schema do banco por meio de migrations versionadas,
  aplicáveis através de comando (modelo forward-only). A reversão de schema MUST ser suportada por
  uma estratégia de rollback documentada (restauração/branch do banco gerenciado para o ambiente
  efêmero de testes; SQL de reversão manual em emergências), não dependendo de um comando automático
  de "down".
- **FR-007**: O sistema MUST carregar toda configuração sensível a ambiente a partir de variáveis de
  ambiente e MUST falhar na inicialização quando variáveis obrigatórias estiverem ausentes ou
  inválidas.
- **FR-008**: O repositório MUST NOT conter credenciais ou segredos versionados e MUST fornecer um
  arquivo de exemplo documentando todas as variáveis necessárias.
- **FR-009**: O sistema MUST validar/parsear a configuração de ambiente de forma centralizada e
  tipada.

**Autenticação e autorização**

- **FR-010**: O sistema MUST autenticar usuários exclusivamente por meio de contas Google.
- **FR-011**: O sistema MUST restringir o acesso a usuários cujo e-mail conste em uma allowlist
  administrada pela aplicação.
- **FR-012**: O sistema MUST permitir que um administrador adicione e remova e-mails da allowlist
  por meio de uma **tela de administração in-app (UI)**, suportada por **endpoints de API
  admin-only**; essas mudanças MUST afetar autenticações subsequentes. Apenas usuários com papel de
  administrador MUST acessar essa tela e esses endpoints.
- **FR-013**: O sistema MUST estabelecer e encerrar sessões de forma segura (login, expiração,
  logout) e MUST negar acesso a rotas protegidas sem sessão válida. A sessão MUST ser **stateless**,
  representada por um token assinado transportado em cookie `httpOnly` e `Secure` (sem armazenamento
  de sessão no servidor).
- **FR-014**: O sistema MUST garantir, por design, que uma allowlist vazia nunca resulte em acesso
  irrestrito, e MUST suportar o bootstrap de um administrador inicial.

**Observabilidade, erros e documentação**

- **FR-015**: O sistema MUST emitir logs estruturados com correlação suficiente para diagnóstico.
- **FR-016**: O sistema MUST reportar erros não tratados a uma ferramenta centralizada de
  monitoramento de erros com contexto adequado.
- **FR-017**: O sistema MUST retornar respostas de erro em formato consistente e padronizado, sem
  vazar detalhes internos, segredos ou dados sensíveis.
- **FR-018**: Logs e relatórios de erro MUST NOT conter dados de saúde sensíveis nem segredos.
- **FR-019**: O sistema MUST fornecer documentação da API que reflita os endpoints existentes e seus
  contratos de requisição/resposta.

**Testes, CI/CD e entrega**

- **FR-020**: O projeto MUST possuir uma base de testes automatizados executável por comando,
  cobrindo os fluxos críticos da fundação (ex.: gate de autenticação/allowlist, health check,
  validação de configuração).
- **FR-021**: O projeto MUST aplicar verificação automatizada de lint e de tipos por comando e no CI.
- **FR-022**: O CI MUST executar lint, verificação de tipos e testes a cada pull request e reportar
  o resultado, bloqueando a integração em caso de falha.
- **FR-023**: O sistema MUST implantar a aplicação automaticamente ao integrar na branch principal,
  sem passos manuais.
- **FR-024**: O sistema MUST disponibilizar ambientes de pré-visualização para pull requests.

**Automação por agentes de IA**

- **FR-025**: As integrações com serviços externos (controle de versão/CI, hospedagem, banco,
  monitoramento de erros) MUST ser realizáveis por automação, CLI ou APIs oficiais, minimizando
  passos manuais, e os passos manuais residuais MUST estar documentados.
- **FR-026**: Toda comunicação cliente-servidor em ambientes implantados MUST ocorrer sobre HTTPS.

### Key Entities

- **Usuário Autorizado (Allowlist Entry)**: representa um e-mail com permissão de acesso; atributos
  conceituais incluem e-mail, papel (administrador ou comum) e data de inclusão.
- **Sessão**: representa uma autenticação ativa de um usuário, materializada como token assinado
  stateless (cookie `httpOnly`/`Secure`), **não persistida** no banco; atributos conceituais incluem
  identidade do usuário e validade/expiração.
- **Registro de Migration**: representa o histórico de versões de schema aplicadas ao banco.
- **Configuração de Ambiente**: conjunto nomeado de variáveis necessárias para operar a aplicação em
  cada ambiente (local, preview, produção).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A partir de um clone limpo, um desenvolvedor ou agente coloca frontend e backend
  rodando localmente em menos de 15 minutos seguindo apenas a documentação.
- **SC-002**: 100% das variáveis de ambiente obrigatórias estão documentadas em um arquivo de
  exemplo, e a aplicação se recusa a iniciar quando alguma está ausente.
- **SC-003**: Nenhum segredo ou credencial está presente no histórico versionado do repositório
  (verificável por varredura).
- **SC-004**: 100% das tentativas de acesso de usuários fora da allowlist são bloqueadas; 100% das
  tentativas de usuários na allowlist são permitidas.
- **SC-005**: 100% dos erros não tratados resultam em um relatório na ferramenta de monitoramento e
  em uma resposta de erro padronizada ao cliente.
- **SC-006**: Nenhum log de produção contém dados de saúde sensíveis ou segredos (verificável por
  inspeção de amostra).
- **SC-007**: 100% dos pull requests executam lint, verificação de tipos e testes automaticamente, e
  PRs que falham são bloqueados.
- **SC-008**: 100% das integrações na branch principal resultam em deploy automático sem intervenção
  manual.
- **SC-009**: Todos os fluxos críticos da fundação listados possuem ao menos um teste automatizado
  associado.

## Assumptions

- A stack base é a definida na Constitution (frontend React/TypeScript/Tailwind como PWA; backend
  Node.js/Express/TypeScript). A justificativa detalhada de bibliotecas específicas (ORM, validação,
  gerenciamento de estado, logging, framework de testes) será produzida na fase de planejamento,
  guiada pelos princípios de maturidade, adoção e sustentabilidade.
- Os serviços externos preferidos são os indicados pelo usuário e pela Constitution, priorizando
  planos gratuitos/baixo custo: hospedagem e previews em **Vercel**, banco PostgreSQL gerenciado em
  **Neon**, controle de versão e CI em **GitHub**, e monitoramento de erros em **Sentry**.
- Frontend (Vite) e backend (Node) são implantados como **dois projetos Vercel separados**, com o
  backend operando em modelo serverless. O deploy de ambos é automático no push para `main`,
  orquestrado por **GitHub Actions**. Caso restrições técnicas do modelo serverless tornem alguma
  capacidade inadequada (ex.: conexões persistentes), a decisão será revisitada no planejamento.
- O administrador inicial (primeiro e-mail da allowlist) é semeado via configuração de ambiente ou
  migration durante o provisionamento.
- Existe um único ambiente de produção, além de ambientes efêmeros de pré-visualização por pull
  request; um ambiente de staging dedicado é opcional e fora do escopo desta feature.
- Esta é uma aplicação de proprietário único com baixo volume; metas de performance e escala seguem
  expectativas padrão de aplicações web, sem requisitos de alta escala.

## Out of Scope

- Qualquer funcionalidade de negócio do domínio VITA: registro/captura de dados de saúde, métricas,
  dashboards, insights, recursos de IA, importações de dados de saúde, agregações de domínio.
- Sincronização offline e capacidades offline-first além dos requisitos mínimos de PWA.
- Internacionalização, temas avançados e personalização de UI além do shell mínimo e da tela de
  administração da allowlist (esta última está **em escopo**).
- Backup/restore avançado, multi-tenancy e qualquer suporte a múltiplos usuários simultâneos além do
  modelo de proprietário único com allowlist.

## Dependencies

- Contas/projetos nos serviços externos preferidos (GitHub, Vercel, Neon, Sentry) e credenciais de
  OAuth do Google para autenticação, todas geridas como segredos fora do repositório.
