# Feature Specification: Polimento Visual da Aplicação (UI/UX)

**Feature Branch**: `004-ui-visual-polish`

**Created**: 2026-06-17

**Status**: Draft

**Input**: User description: "Iniciativa de polimento visual completo da aplicação — exclusivamente UI/UX. NÃO é feature funcional. Melhorar qualidade visual, consistência e experiência de uso da interface existente, preservando 100% das funcionalidades, regras de negócio, fluxos, APIs, dados, arquitetura, validações, integrações e permissões. Áreas: design system, cores, tipografia, bordas, arredondamentos, sombras/profundidade, layout/espaçamento, responsividade (mobile→ultrawide), componentes, estados visuais, microinterações, animações/transições, efeitos visuais, formulários, placeholders, textos, ícones."

## Visão Geral

Esta iniciativa é um **polimento visual e de experiência de uso (UI/UX)** de toda a interface
**já existente** do VITA. Ela **não entrega nenhuma funcionalidade nova** e **não remove nenhuma
funcionalidade existente**: o objetivo é exclusivamente elevar a qualidade visual, a consistência
e o acabamento da interface que hoje já está construída sobre o design system da feature 002
(`002-design-system-foundation`).

O trabalho consiste em revisar telas e componentes existentes (Login, Home, Histórico,
Administração da allowlist, guia de estilo, modais de captura, shell de navegação e biblioteca de
componentes) e refiná-los para que toda a aplicação pareça coesa, profissional e cuidada — com
tokens visuais uniformizados, estados visuais consistentes, espaçamento ritmado, tipografia
hierarquizada, microinterações discretas e responsividade impecável de smartphones (~390px) a
monitores ultrawide (~3440px).

**Restrição central e inegociável**: nada que altere comportamento funcional pode ser tocado.
Regras de negócio, fluxos de navegação, APIs, banco de dados, arquitetura, estados funcionais,
validações, integrações, permissões e lógica de aplicação permanecem **exatamente como estão**.
A direção de identidade visual estabelecida na 002 (azul-índigo/violeta sobre neutros frios) é
**preservada e refinada**, não substituída — esta iniciativa não é um rebranding.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consistência visual global e tokens uniformizados (Priority: P1) 🎯 MVP

Como usuário-proprietário do VITA, ao percorrer todas as telas eu percebo uma interface
visualmente coesa: cores, raios de borda, espessuras de borda, sombras e tipografia seguem o mesmo
vocabulário em todas as telas e componentes, sem variações arbitrárias, valores "soltos" ou
divergências entre uma tela e outra.

**Why this priority**: A coesão é a base do polimento — se cada tela usa cores, raios ou sombras
ligeiramente diferentes, nenhum refinamento posterior parece profissional. Padronizar o uso dos
tokens visuais entrega o maior salto perceptível de qualidade e é pré-requisito para os demais
refinamentos. Entrega valor sozinha: mesmo só uniformizando o uso de tokens, a aplicação já parece
mais cuidada e confiável.

**Independent Test**: Percorrer todas as telas e o guia de estilo nos temas claro e escuro e
verificar que cores, raios, bordas, sombras e estilos tipográficos provêm do conjunto central de
tokens (sem valores cravados/ad hoc divergentes), que componentes equivalentes têm aparência
idêntica entre telas e que o mesmo papel visual (ex.: superfície de cartão, borda divisória, cor
de destaque) é renderizado de forma idêntica em toda a aplicação.

**Acceptance Scenarios**:

1. **Given** qualquer par de telas, **When** comparadas lado a lado, **Then** componentes do mesmo
   tipo (botões, cartões, inputs, badges, tabelas) apresentam cores, raios, bordas, sombras e
   tipografia idênticos.
2. **Given** a paleta de cores, **When** aplicada na interface, **Then** todas as cores em uso
   derivam dos tokens centrais (incluindo as cores semânticas de sucesso, aviso, erro e
   informação), sem cores avulsas que fujam da paleta.
3. **Given** os raios de borda e as espessuras de borda, **When** observados em todos os
   componentes, **Then** seguem uma escala discreta e consistente (poucos níveis bem definidos),
   sem arredondamentos ou espessuras arbitrários.
4. **Given** as sombras/elevação, **When** observadas, **Then** seguem uma escala de elevação
   coerente que comunica hierarquia de camadas (superfície base, cartão, popover/menu, modal),
   sem sombras inconsistentes entre componentes do mesmo nível.
5. **Given** qualquer tela em tema claro ou escuro, **When** exibida, **Then** a mesma coesão de
   tokens se mantém nos dois temas, preservando contraste WCAG 2.1 AA.

---

### User Story 2 - Estados visuais e microinterações consistentes (Priority: P2)

Como usuário, ao interagir com qualquer elemento da interface eu recebo um feedback visual
discreto, imediato e previsível: passar o mouse, focar por teclado, pressionar, selecionar ou
encontrar um elemento desabilitado produz sempre o mesmo padrão de resposta visual, em qualquer
componente e em qualquer tela.

**Why this priority**: Estados e microinterações consistentes são o que faz a interface parecer
"viva" e profissional. Depende dos tokens uniformizados da US1 (cores de estado, anéis de foco,
sombras de hover). Refina diretamente a percepção de qualidade na interação.

**Independent Test**: Percorrer todos os componentes interativos no guia de estilo e nas telas,
exercitando default, hover, focus, active/press, selected, disabled, loading, e os estados de
erro/sucesso/aviso; verificar que cada estado é visualmente distinto, consistente entre
componentes e que as transições são discretas e suaves, respeitando a preferência de "reduzir
movimento".

**Acceptance Scenarios**:

1. **Given** qualquer elemento interativo (botão, link, input, select, checkbox, radio, switch,
   item de menu, aba, linha de tabela clicável), **When** recebe hover, **Then** apresenta um
   feedback de hover discreto e padronizado (ex.: leve mudança de cor/elevação), igual entre
   componentes equivalentes.
2. **Given** qualquer elemento interativo, **When** focado por teclado, **Then** exibe um anel de
   foco visível, consistente e com contraste adequado, idêntico em estilo em toda a aplicação.
3. **Given** um controle acionável, **When** pressionado (active), **Then** apresenta um feedback
   de pressão discreto e padronizado.
4. **Given** um elemento desabilitado, **When** exibido, **Then** comunica claramente o estado
   desabilitado (opacidade/cor reduzida e cursor apropriado) de forma consistente, sem que o
   significado funcional do desabilitar mude.
5. **Given** uma operação assíncrona já existente, **When** está em andamento, **Then** o
   componente mostra seu estado de carregamento (spinner/skeleton) de forma consistente, sem
   alterar o comportamento da operação.
6. **Given** os estados de feedback (erro, sucesso, aviso, informação), **When** exibidos em
   qualquer componente (alerts, toasts, validação de campo, badges), **Then** usam as mesmas cores
   semânticas e o mesmo tratamento visual.
7. **Given** qualquer transição/animação, **When** ocorre, **Then** é discreta e profissional
   (duração curta, easing consistente) e é reduzida/desativada quando o sistema indica "reduzir
   movimento".

---

### User Story 3 - Layout, espaçamento e responsividade refinados (Priority: P3)

Como usuário que usa o VITA no celular para registrar dados e no desktop/ultrawide para analisar,
eu quero que cada tela tenha espaçamento ritmado, alinhamentos precisos e aproveitamento de espaço
adequado a cada formato, sem áreas vazias desproporcionais, conteúdo espremido, quebras de layout
ou rolagem horizontal indevida.

**Why this priority**: Depois da coesão de tokens e dos estados, o ritmo de layout e a
responsividade são o que elevam o acabamento percebido em cada formato de tela. Depende da escala
de espaçamento uniformizada (US1).

**Independent Test**: Abrir cada tela existente nas larguras de referência (~390px, ~768px,
1920×1080 e 3440×1440, e checar utilizabilidade a 320px) e verificar ritmo vertical consistente,
alinhamentos corretos, gaps/padding/margens padronizados, ausência de quebras e rolagem horizontal
indevida, e aproveitamento de espaço apropriado em telas largas (sem linhas de texto longas demais
nem grandes vazios não intencionais), preservando os mesmos padrões de navegação por formato já
existentes.

**Acceptance Scenarios**:

1. **Given** qualquer tela, **When** inspecionada, **Then** padding, margens e gaps derivam da
   escala de espaçamento central e produzem um ritmo vertical e horizontal consistente.
2. **Given** elementos relacionados em uma tela, **When** exibidos, **Then** estão alinhados de
   forma precisa e agrupados de modo a comunicar sua relação (proximidade e alinhamento coerentes).
3. **Given** as larguras de referência (~390px, ~768px, 1920×1080, 3440×1440), **When** a tela é
   exibida, **Then** não há quebra de layout, sobreposição nem rolagem horizontal indevida, e a
   mesma navegação por formato definida na 002 é mantida (abas inferiores no mobile, rail no
   tablet, sidebar fixa no desktop/ultrawide).
4. **Given** um monitor widescreen/ultrawide, **When** uma tela é exibida, **Then** o espaço é
   aproveitado de forma intencional (largura de leitura confortável e/ou colunas/painéis), sem
   conteúdo esticado indefinidamente nem grandes áreas vazias acidentais.
5. **Given** conteúdo extremo (textos longos, rótulos extensos, listas vazias ou muito grandes),
   **When** renderizado, **Then** o layout permanece íntegro (sem cortes, vazamentos ou quebras).
6. **Given** zoom do navegador até 200%, **When** aplicado, **Then** a tela permanece utilizável
   sem sobreposição ou corte de conteúdo essencial.

---

### User Story 4 - Acabamento de conteúdo: tipografia, formulários, textos, placeholders e ícones (Priority: P4)

Como usuário, eu quero ler e preencher a interface com conforto: hierarquia tipográfica clara,
textos escaneáveis e bem alinhados, formulários com rótulos/placeholders/textos de ajuda/mensagens
de erro consistentes e legíveis, e ícones de tamanho, peso e alinhamento uniformes.

**Why this priority**: É o refinamento fino de legibilidade e acabamento de conteúdo. Vem por
último porque depende dos tokens (US1), dos estados (US2) e do layout (US3) já refinados, mas
fecha a percepção de qualidade no nível de detalhe.

**Independent Test**: Revisar todas as telas e formulários existentes verificando hierarquia
tipográfica (títulos, subtítulos, corpo, legenda, rótulos) com escala/peso/altura de linha
consistentes; alinhamento e escaneabilidade dos textos; consistência visual de
rótulos, placeholders, textos de ajuda e mensagens de erro nos formulários (sem alterar as
validações); e uniformidade de tamanho, peso e alinhamento dos ícones.

**Acceptance Scenarios**:

1. **Given** qualquer tela, **When** exibida, **Then** os textos seguem uma hierarquia tipográfica
   clara e consistente (papéis bem definidos para título, subtítulo, corpo, legenda e rótulo) com
   tamanhos, pesos, alturas de linha e espaçamento entre letras padronizados e legíveis.
2. **Given** blocos de texto, **When** exibidos, **Then** têm alinhamento apropriado e
   escaneável (alinhamento consistente, comprimento de linha confortável, quebras adequadas), sem
   centralizações ou alinhamentos arbitrários.
3. **Given** qualquer formulário existente, **When** exibido, **Then** rótulos, placeholders,
   textos de ajuda e mensagens de erro têm tratamento visual consistente entre todos os campos e
   formulários, **sem alterar quais validações ocorrem nem suas regras**.
4. **Given** os placeholders dos campos, **When** exibidos, **Then** têm cor/contraste suficiente
   para legibilidade, claramente distinguíveis de valores preenchidos, e consistentes em todos os
   campos e nos dois temas.
5. **Given** os ícones da interface, **When** exibidos, **Then** têm tamanho, peso visual e
   alinhamento consistentes entre si e em relação ao texto/controles adjacentes.
6. **Given** os estados de conteúdo já existentes (vazio, carregando, erro), **When** exibidos,
   **Then** têm tratamento visual consistente e acabado (mensagens, ícones e skeletons coerentes),
   sem alterar quando ou por que esses estados ocorrem.

---

### Edge Cases

- **Conteúdo extremo**: textos muito longos, rótulos/nomes extensos, números grandes, listas
  vazias e listas muito grandes não devem quebrar o layout nem vazar de seus contêineres.
- **Largura mínima (~320px)**: nenhuma rolagem horizontal indevida nem corte de conteúdo essencial.
- **Reduzir movimento / alto contraste**: microinterações e transições respeitam as preferências
  de acessibilidade do sistema.
- **Zoom e fonte do sistema aumentados**: layout permanece utilizável até 200% de zoom.
- **Troca de tema com a aplicação aberta**: todos os refinamentos visuais (cores, sombras, estados)
  respondem corretamente à alternância claro/escuro/sistema sem inconsistências.
- **Estados simultâneos**: combinações como "foco + hover", "selecionado + desabilitado" ou
  "carregando + erro" produzem um resultado visual previsível e legível.
- **Densidade de dados**: tabelas e listas com muitas linhas mantêm ritmo, alinhamento e
  legibilidade sem alterar paginação, ordenação ou qualquer comportamento existente.
- **Regressão funcional**: nenhum ajuste visual pode quebrar testes existentes nem alterar o
  comportamento observável de qualquer fluxo.

## Requirements *(mandatory)*

### Functional Requirements

**Escopo e preservação (restrições inegociáveis)**

- **FR-001**: A iniciativa MUST se restringir exclusivamente a mudanças de apresentação visual e de
  experiência de uso (UI/UX) sobre a interface já existente.
- **FR-002**: A iniciativa MUST NOT criar novas funcionalidades nem remover funcionalidades
  existentes.
- **FR-003**: A iniciativa MUST NOT alterar regras de negócio, fluxos de navegação, APIs, banco de
  dados, arquitetura, estados/comportamentos funcionais, validações (quais ocorrem e suas regras),
  integrações, permissões nem lógica de aplicação.
- **FR-004**: Após o polimento, o comportamento observável de todos os fluxos existentes MUST
  permanecer idêntico, e a suíte de testes automatizados existente MUST continuar passando sem
  alterações de lógica de teste motivadas por mudança funcional.
- **FR-005**: A direção de identidade visual estabelecida na feature 002 (azul-índigo/violeta sobre
  neutros frios) MUST ser preservada e refinada, não substituída; esta iniciativa MUST NOT
  constituir um rebranding.

**Consistência de tokens e design system**

- **FR-006**: Todos os valores visuais em uso (cores, tipografia, espaçamento, raios de borda,
  espessuras de borda, sombras/elevação) MUST derivar do conjunto central de design tokens, sem
  valores avulsos/cravados que divirjam dos tokens.
- **FR-007**: Componentes do mesmo tipo MUST ter aparência idêntica em todas as telas (mesma cor,
  raio, borda, sombra, tipografia e espaçamento interno).
- **FR-008**: A paleta de cores MUST ser coesa e incluir as cores semânticas de estado (sucesso,
  aviso, erro, informação) aplicadas de forma consistente em todos os componentes que comunicam
  esses estados.
- **FR-009**: Os raios de borda e as espessuras de borda MUST seguir uma escala discreta e
  uniformizada (poucos níveis bem definidos).
- **FR-010**: As sombras/elevação MUST seguir uma escala de elevação coerente que comunique a
  hierarquia de camadas (superfície base → cartão → popover/menu → modal/drawer).
- **FR-011**: As bordas e divisórias MUST separar áreas visualmente de forma consistente, com cor e
  espessura padronizadas por tema.

**Tipografia**

- **FR-012**: A interface MUST apresentar uma hierarquia tipográfica clara e consistente (papéis
  definidos para título, subtítulo, corpo, legenda e rótulo) com tamanhos, pesos, alturas de linha
  e espaçamento entre letras padronizados.
- **FR-013**: O texto MUST priorizar legibilidade e escaneabilidade: alinhamento consistente,
  comprimento de linha confortável e quebras adequadas, sem centralizações/alinhamentos
  arbitrários.

**Estados visuais e microinterações**

- **FR-014**: Todos os elementos interativos MUST apresentar estados visuais consistentes e
  distintos para default, hover, focus, active/press, selected, disabled, loading, e os estados de
  erro/sucesso/aviso aplicáveis — sem que o significado funcional desses estados mude.
- **FR-015**: O estado de foco MUST exibir um anel de foco visível, consistente e com contraste
  adequado em todos os elementos interativos, em ambos os temas.
- **FR-016**: As microinterações (hover, foco, clique/press) MUST fornecer feedback visual discreto,
  imediato e padronizado entre componentes equivalentes.
- **FR-017**: Animações e transições MUST ser discretas e profissionais (durações curtas, easing
  consistente, sem excessos), com bom desempenho, e MUST ser reduzidas/desativadas quando o sistema
  indicar "reduzir movimento".
- **FR-018**: Efeitos visuais de interação (elevação/sombra no hover, leve mudança de
  cor/escala, estado de pressão) MUST ser sutis e consistentes, sem comprometer legibilidade ou
  desempenho.

**Layout, espaçamento e responsividade**

- **FR-019**: Padding, margens e gaps MUST derivar da escala de espaçamento central e produzir um
  ritmo visual consistente, com alinhamentos precisos e agrupamento coerente dos elementos.
- **FR-020**: O layout MUST permanecer íntegro (sem quebras, sobreposições nem rolagem horizontal
  indevida) nas larguras de referência (~390px, ~768px, 1920×1080, 3440×1440) e utilizável a
  ~320px, mantendo os padrões de navegação por formato já definidos na 002.
- **FR-021**: Em telas largas (widescreen/ultrawide), o espaço MUST ser aproveitado de forma
  intencional (largura de leitura confortável e/ou colunas/painéis), sem esticar conteúdo
  indefinidamente nem deixar grandes vazios acidentais.
- **FR-022**: O layout MUST permanecer utilizável com zoom do navegador até 200% e MUST acomodar
  conteúdo extremo sem cortes ou vazamentos.

**Componentes, formulários e ícones**

- **FR-023**: Todos os componentes da biblioteca existente (botões, inputs, textareas, selects,
  checkboxes, radios, switches, cartões, tabelas, modais/dialogs, drawers/sheets, dropdowns,
  tooltips, abas, badges, alerts, toasts, e os existentes de busca/autocomplete/date pickers se
  presentes) e os estados de empty/loading/error/skeleton MUST ser revisados para acabamento e
  consistência visual, sem alterar suas props/contratos funcionais nem seu comportamento.
- **FR-024**: Nos formulários, rótulos, placeholders, textos de ajuda e mensagens de erro MUST ter
  tratamento visual consistente entre todos os campos e formulários, **sem alterar quais validações
  ocorrem nem suas regras**.
- **FR-025**: Placeholders MUST ter cor/contraste legível, ser claramente distinguíveis de valores
  preenchidos e consistentes em todos os campos e nos dois temas.
- **FR-026**: Os ícones MUST ter tamanho, peso visual e alinhamento consistentes entre si e em
  relação ao texto/controles adjacentes.

**Acessibilidade visual e abrangência**

- **FR-027**: Todas as combinações texto/fundo e elementos interativos MUST atender ao contraste
  WCAG 2.1 AA em ambos os temas após o polimento.
- **FR-028**: O polimento MUST abranger todas as telas existentes (Login, Home, Histórico,
  Administração da allowlist, guia de estilo, modais de captura e shell de navegação) e o guia de
  estilo MUST refletir os tokens e estados refinados.

### Key Entities

- **Design Token**: unidade nomeada de decisão visual (cor, tipografia, espaçamento, raio, borda,
  sombra) com valor por tema quando aplicável; após o polimento, é a **única** origem dos valores
  visuais aplicados na interface. Esta iniciativa não introduz novos dados persistidos.
- **Componente (existente)**: elemento de interface já implementado, cujo **acabamento visual e
  estados** são refinados sem alterar suas props, contrato funcional ou comportamento.
- **Estado Visual**: representação visual de uma condição de um componente (default, hover, focus,
  active, selected, disabled, loading, error, success, warning), padronizada entre todos os
  componentes — sem alterar o significado funcional do estado.
- **Breakpoint / Formato**: faixa de largura de tela (smartphone, tablet, desktop, ultrawide) já
  definida na 002, cujo aproveitamento de espaço e ritmo visual são refinados, preservando o padrão
  de navegação por formato.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 0 regressões funcionais — 100% da suíte de testes automatizados existente continua
  passando e o comportamento observável de todos os fluxos permanece idêntico ao anterior ao
  polimento.
- **SC-002**: 100% dos valores visuais aplicados (cores, raios, bordas, sombras, espaçamento,
  estilos tipográficos) derivam dos tokens centrais — 0 valores avulsos divergentes encontrados em
  auditoria visual das telas.
- **SC-003**: Componentes do mesmo tipo são visualmente idênticos entre telas em 100% dos casos
  inspecionados (botões, inputs, cartões, badges, tabelas, modais).
- **SC-004**: 100% dos elementos interativos apresentam todos os estados visuais aplicáveis
  (default, hover, focus, active, selected, disabled, loading, e erro/sucesso/aviso quando
  pertinente), consistentes entre componentes equivalentes.
- **SC-005**: 100% dos elementos interativos exibem foco visível e consistente por teclado, e a
  auditoria automatizada de acessibilidade não acusa novas violações de nível A/AA.
- **SC-006**: 0 violações de contraste WCAG 2.1 AA em ambos os temas após o polimento.
- **SC-007**: 0 quebras de layout e 0 ocorrências de rolagem horizontal indevida nas quatro larguras
  de referência (~390px, ~768px, 1920×1080, 3440×1440), permanecendo utilizável a ~320px.
- **SC-008**: 100% das animações/microinterações são reduzidas ou desativadas quando a preferência
  de "reduzir movimento" está ativa, e nenhuma transição excede uma duração discreta perceptível
  como profissional.
- **SC-009**: 100% das telas existentes e o guia de estilo refletem corretamente os tokens e
  estados refinados nos temas claro e escuro.
- **SC-010**: Em uma revisão visual comparativa antes/depois, cada área avaliada (cores, tipografia,
  bordas, raios, sombras, espaçamento, responsividade, componentes, estados, microinterações,
  formulários, placeholders, textos, ícones) apresenta consistência igual ou superior, sem nenhuma
  regressão visual.

## Assumptions

- **Base preservada**: a iniciativa parte do design system e das telas entregues na feature 002
  (`002-design-system-foundation`) e das features de captura já existentes (peso e pressão
  arterial); refina o que existe, sem reescrever a fundação nem mudar a stack.
- **Identidade mantida**: a direção visual azul-índigo/violeta sobre neutros frios é preservada e
  apenas refinada (tonalidades/escala podem ser ajustadas para coesão e contraste); não há
  rebranding nem mudança de paleta de marca.
- **Reposicionamento visual permitido**: ajustes de espaçamento, alinhamento, agrupamento e
  aproveitamento de espaço que reorganizam visualmente os elementos são permitidos desde que **não**
  alterem o fluxo de navegação, a ordem lógica de tarefas nem o comportamento — mover não é mudar
  fluxo.
- **Sem backend nem dados**: nenhuma alteração de endpoints, contratos de API, banco de dados,
  variáveis de ambiente ou integrações; o polimento é inteiramente client-side de apresentação.
- **Sem novas dependências pesadas**: o polimento usa os recursos visuais já adotados (Tailwind +
  componentes headless copiados ao repositório, ícones e animação já presentes); qualquer nova
  dependência seria justificada pelos princípios da Constituição, mas a expectativa é não precisar.
- **Componentes ausentes não são criados**: itens listados na solicitação que não existem hoje na
  aplicação (ex.: accordions, calendários/date pickers, autocomplete, se não estiverem presentes)
  **não** são introduzidos por esta iniciativa — ela polui apenas o que já existe.
- **Idioma**: a interface permanece em Português (pt-BR); textos podem ter ajustes de
  acabamento/tom, mas sem mudança de significado funcional, rótulos de ação ou validações.
- **Validação visual**: a verificação de "não regressão" combina a suíte de testes existente com
  inspeção visual manual nas larguras de referência e nos dois temas; baselines visuais detalhadas
  (snapshots) são decididas no planejamento.
- **Navegadores-alvo**: navegadores modernos atuais (últimas versões de Chrome, Edge, Safari e
  Firefox), em desktop e mobile.
