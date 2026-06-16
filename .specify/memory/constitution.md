<!--
SYNC IMPACT REPORT
==================
Version change: (template / não ratificada) → 1.0.0
Bump rationale: MAJOR (1.0.0) — primeira ratificação formal da constituição a partir do
  template; estabelece o conjunto inicial de princípios e governança.

Modified principles:
  - [PRINCIPLE_1_NAME] → I. Observabilidade de Saúde, Não Aconselhamento Médico
  - [PRINCIPLE_2_NAME] → II. Privacidade e Segurança de Dados de Saúde por Padrão
  - [PRINCIPLE_3_NAME] → III. Acesso Restrito e Autenticação via Google
  - [PRINCIPLE_4_NAME] → IV. Stack e Arquitetura Definidas (PWA Online-First)
  - [PRINCIPLE_5_NAME] → V. Simplicidade Deliberada (Anti-Overengineering)
  - (novo)            → VI. Dependências e Infraestrutura Sustentáveis
  - (novo)            → VII. Testes Orientados a Risco

Added sections:
  - Restrições Técnicas Adicionais (antes SECTION_2)
  - Workflow de Desenvolvimento e Qualidade (antes SECTION_3)

Removed sections: nenhuma (todos os placeholders preenchidos).

Templates requiring updates:
  - .specify/templates/plan-template.md ✅ alinhado (Constitution Check é derivado dinamicamente)
  - .specify/templates/spec-template.md ✅ alinhado (sem conflitos de seções obrigatórias)
  - .specify/templates/tasks-template.md ⚠ atenção: o template trata testes como OPTIONAL;
      o Princípio VII exige testes para fluxos críticos. A spec de cada feature DEVE solicitar
      explicitamente testes para regras de negócio, cálculos, importações e agregações para que
      as tasks de teste sejam geradas. Nenhuma edição estrutural necessária no template.
  - .specify/templates/checklist-template.md ✅ alinhado (genérico)

Deferred TODOs: nenhum. RATIFICATION_DATE definida como a data desta ratificação inicial.
-->

# Constituição do VITA

O VITA é uma plataforma pessoal de observabilidade de saúde, focada no armazenamento,
acompanhamento e análise de dados de saúde de um único usuário-proprietário. Esta
constituição define os princípios inegociáveis que governam o desenvolvimento, a
arquitetura e a operação de longo prazo do sistema.

## Princípios Fundamentais

### I. Observabilidade de Saúde, Não Aconselhamento Médico

O VITA armazena, organiza, acompanha, agrega e visualiza dados de saúde. O sistema NÃO
realiza diagnósticos, NÃO emite prescrições e NÃO toma decisões médicas. Qualquer
funcionalidade que apresente cálculos, tendências ou agregações DEVE ser enquadrada como
observação de dados do próprio usuário, nunca como recomendação clínica. Interpretações
que possam ser confundidas com aconselhamento médico DEVEM ser evitadas ou explicitamente
qualificadas.

**Rationale**: Define a fronteira de responsabilidade do produto, evita risco regulatório
e mantém o escopo focado e sustentável para operação pessoal.

### II. Privacidade e Segurança de Dados de Saúde por Padrão

Dados de saúde são sensíveis e seu tratamento seguro é requisito fundamental, não opcional.
O sistema DEVE proteger esses dados em trânsito (HTTPS/TLS obrigatório) e em repouso conforme
os recursos da infraestrutura adotada. Segredos (credenciais, chaves, tokens) NUNCA DEVEM ser
versionados no repositório; DEVEM residir em variáveis de ambiente ou cofres equivalentes.
O sistema DEVE coletar e expor apenas os dados estritamente necessários (minimização) e NÃO
DEVE registrar dados de saúde sensíveis em logs. Decisões de design que afetem segurança ou
privacidade DEVEM ser justificadas explicitamente.

**Rationale**: A confiança no produto depende inteiramente da proteção dos dados; uma falha
de segurança compromete todo o propósito da plataforma.

### III. Acesso Restrito e Autenticação via Google

A autenticação DEVE utilizar exclusivamente contas Google (OAuth/OpenID Connect). NÃO DEVE
existir cadastro com senha própria nem provedores alternativos de identidade. O acesso DEVE
ser restrito a usuários explicitamente autorizados por meio de uma lista de e-mails permitidos
(allowlist) administrada pela própria aplicação. Toda requisição autenticada DEVE validar a
identidade contra a allowlist antes de conceder acesso a qualquer dado.

**Rationale**: Um único mecanismo de identidade confiável reduz a superfície de ataque e a
complexidade; a allowlist garante que apenas pessoas autorizadas acessem dados de saúde.

### IV. Stack e Arquitetura Definidas (PWA Online-First)

O frontend DEVE ser uma SPA construída com React, TypeScript e Tailwind CSS, entregue como
Progressive Web App (PWA). O backend DEVE usar Node.js, Express e TypeScript. A experiência
DEVE priorizar o mobile para captura de dados e o desktop para análise e visualização. A
aplicação opera prioritariamente online; recursos offline e sincronização são desejáveis,
porém SÃO opcionais e NÃO DEVEM introduzir complexidade significativa nem comprometer a
entrega das funcionalidades principais. Mudanças nessa stack base DEVEM passar pelo processo
de emenda desta constituição.

**Rationale**: Uma stack fixa, moderna e coesa elimina decisões repetidas, garante
consistência e mantém o sistema sustentável para um único mantenedor.

### V. Simplicidade Deliberada (Anti-Overengineering)

Implementar apenas o necessário para atender aos requisitos atuais. Complexidade desnecessária,
abstrações prematuras e overengineering DEVEM ser evitados. Toda abstração, camada ou padrão
adicional DEVE ser justificado por uma necessidade concreta e presente — YAGNI é a regra. A
capacidade de evolução futura DEVE ser preservada por meio de código simples e claro, não por
generalizações especulativas. Violações de simplicidade DEVEM ser registradas e justificadas
na seção de Complexity Tracking do plano da feature.

**Rationale**: Para uma plataforma pessoal de longo prazo, a simplicidade é o que torna o
sistema manutenível por uma única pessoa ao longo do tempo.

### VI. Dependências e Infraestrutura Sustentáveis

Dependências DEVEM ser simples, modernas, amplamente adotadas, bem documentadas, ativamente
mantidas e com comunidade relevante. Dependências obsoletas, abandonadas ou de baixa adoção
DEVEM ser evitadas. Antes de adotar uma dependência importante, DEVEM ser avaliados: atividade
recente do projeto, qualidade da documentação, maturidade e sustentabilidade de longo prazo.
Serviços e infraestrutura DEVEM ser escolhidos por excelente custo-benefício, preferindo planos
gratuitos quando atenderem adequadamente aos requisitos. A arquitetura DEVE permanecer simples e
adequada para operação pessoal de longo prazo.

**Rationale**: Escolhas sustentáveis de dependências e infraestrutura minimizam custo,
manutenção e risco de descontinuação para um projeto pessoal sem equipe dedicada.

### VII. Testes Orientados a Risco

Testes automatizados DEVEM proteger funcionalidades críticas, regras de negócio, processamento
de dados de saúde, cálculos, importações, agregações e fluxos principais do sistema. A decisão
de testar DEVE ser orientada por risco e impacto, não por métricas de cobertura. Testes criados
apenas para aumentar percentual de cobertura DEVEM ser evitados. Toda lógica que transforma ou
agrega dados de saúde DEVE possuir testes que validem sua correção.

**Rationale**: Em uma plataforma de dados de saúde, a correção de cálculos e agregações é o que
garante a confiança no produto; testes focados em risco entregam essa proteção sem custo
de manutenção desperdiçado.

## Restrições Técnicas Adicionais

- **Linguagem única**: TypeScript DEVE ser usado tanto no frontend quanto no backend; novo
  código JavaScript não tipado DEVE ser evitado.
- **Configuração por ambiente**: toda configuração sensível a ambiente DEVE vir de variáveis
  de ambiente; valores padrão versionados NÃO DEVEM conter segredos.
- **Transporte seguro**: toda comunicação cliente-servidor em produção DEVE ocorrer sobre HTTPS.
- **PWA**: o frontend DEVE manter os requisitos mínimos de PWA (manifesto e service worker)
  sem que isso introduza complexidade de offline além da necessária.
- **Compatibilidade mobile/desktop**: telas de captura DEVEM ser usáveis em mobile; telas de
  análise e visualização DEVEM aproveitar o espaço de desktop.

## Workflow de Desenvolvimento e Qualidade

- **Constitution Check**: todo plano de implementação (plan.md) DEVE validar conformidade com
  estes princípios antes da fase de design e novamente após o design.
- **Justificativa de complexidade**: qualquer violação dos Princípios IV, V ou VI DEVE ser
  registrada na tabela de Complexity Tracking com a alternativa mais simples rejeitada e o motivo.
- **Solicitação de testes**: as especificações de features DEVEM solicitar explicitamente testes
  para fluxos críticos, cálculos, importações e agregações, de modo que as tasks de teste
  correspondentes sejam geradas (ver Princípio VII).
- **Revisão**: alterações DEVEM ser revisadas quanto à conformidade com esta constituição,
  especialmente segurança/privacidade de dados e simplicidade.

## Governança

Esta constituição supersede quaisquer outras práticas ou convenções de desenvolvimento do VITA.

- **Emendas**: alterações a esta constituição DEVEM ser propostas por escrito, justificadas e
  documentadas neste arquivo, com atualização do número de versão e da data de última emenda.
- **Versionamento**: o versionamento segue Semantic Versioning. MAJOR para remoções ou
  redefinições incompatíveis de princípios/governança; MINOR para adição ou expansão material de
  princípios ou seções; PATCH para esclarecimentos e refinamentos não semânticos.
- **Propagação**: toda emenda DEVE verificar e, quando necessário, atualizar os templates
  dependentes em `.specify/templates/` para manter a consistência.
- **Conformidade**: revisões de pull request e de planos DEVEM verificar conformidade com estes
  princípios. Desvios DEVEM ser justificados explicitamente ou corrigidos antes da integração.

**Version**: 1.0.0 | **Ratified**: 2026-06-16 | **Last Amended**: 2026-06-16
