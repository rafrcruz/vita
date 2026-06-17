# Feature Specification: Frontend Design System Foundation

**Feature Branch**: `002-design-system-foundation`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Criar a especificação da feature 'Frontend Design System Foundation' — estabelecer uma base visual, arquitetural e de experiência consistente para todo o frontend do VITA antes das funcionalidades de negócio, incluindo identidade visual, temas claro/escuro, responsividade mobile-first até ultrawide, componentes reutilizáveis, acessibilidade, microinterações e um guia visual."

## Visão Geral

Esta feature estabelece a **fundação de design e experiência** do frontend do VITA. Ela não
entrega nenhuma funcionalidade do domínio de saúde; entrega o vocabulário visual, os
componentes, os padrões de layout/navegação e as diretrizes que todas as telas futuras
reutilizarão. O resultado é uma interface moderna, profissional, limpa e confiável — coerente
com uma plataforma premium de observabilidade de saúde — usável de smartphones (≈390px) a
monitores ultrawide (3440px), com tema claro/escuro persistente e acessível.

As telas que já existem (Login, Home/health shell, Administração da allowlist) servem como
**vitrine de validação** da fundação: ao final, elas devem estar reconstruídas sobre o novo
design system, provando que a base funciona sem introduzir lógica de negócio nova.

## Clarifications

### Session 2026-06-16

- Q: Como a biblioteca de componentes deve ser construída? → A: Primitivos headless acessíveis (Radix) estilizados com Tailwind, com os componentes copiados para dentro do repositório (padrão shadcn/ui) — o projeto é dono do código, sem dependência de UI pesada nem lock-in.
- Q: Qual o modelo do controle de tema exposto ao usuário? → A: Tri-estado **Claro / Escuro / Sistema**, com "Sistema" como padrão; em modo "Sistema", a interface acompanha a preferência do SO em tempo real.
- Q: Qual a direção da cor de destaque/identidade visual? → A: **Azul-índigo/violeta** como cor de destaque sobre neutros frios (cinza-ardósia) — estética moderna "tech/premium", confiável.
- Q: Qual o padrão de navegação primária por formato? → A: **Mobile: barra de abas inferior · Tablet: rail/sidebar recolhível · Desktop/ultrawide: sidebar fixa.**

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Fundação visual com tema claro/escuro persistente (Priority: P1) 🎯 MVP

Como usuário-proprietário do VITA, ao abrir a aplicação eu encontro uma interface visualmente
coesa, moderna e legível, e posso alternar instantaneamente entre tema claro e escuro; minha
preferência é lembrada nas próximas visitas e reinicializações, sem "piscar" o tema errado ao
carregar.

**Why this priority**: É o núcleo do design system — os tokens visuais (cores, tipografia,
espaçamento, raios, sombras, elevação) e o mecanismo de tema sustentam todo o resto. Sem isso,
nenhum componente ou tela pode ser construído de forma consistente. Entrega valor sozinho:
mesmo só com as telas atuais reskinadas, a aplicação já parece profissional e confiável.

**Independent Test**: Abrir a aplicação, percorrer as telas existentes (Login, Home, Admin),
alternar o tema pelo controle dedicado e recarregar/reabrir a aplicação; verificar que o visual
é coeso, o contraste é adequado nos dois temas e a preferência persiste sem flash de tema.

**Acceptance Scenarios**:

1. **Given** um usuário que nunca definiu preferência de tema, **When** abre a aplicação, **Then** o tema inicial segue a preferência do sistema operacional (claro/escuro) e a interface aparece já no tema correto, sem flash do tema oposto.
2. **Given** a aplicação aberta, **When** o usuário aciona o controle de tema, **Then** toda a interface alterna entre claro e escuro instantaneamente (sem recarregar a página).
3. **Given** um usuário que escolheu um tema explicitamente, **When** fecha e reabre a aplicação (ou reinicia o dispositivo), **Then** a aplicação reabre no tema previamente escolhido.
4. **Given** qualquer tela no tema claro ou escuro, **When** o conteúdo é exibido, **Then** texto, ícones e elementos interativos atendem a contraste mínimo de acessibilidade (WCAG 2.1 AA).
5. **Given** um usuário com preferência de "reduzir movimento" no sistema, **When** navega pela aplicação, **Then** transições e microinterações são reduzidas ou desativadas conforme essa preferência.

---

### User Story 2 - Layout e navegação responsivos (mobile-first → ultrawide) (Priority: P2)

Como usuário que registra dados de saúde com frequência no celular e também analisa informações
no desktop, eu quero que cada formato de tela ofereça um layout e uma navegação pensados para
aquele tamanho — não apenas a mesma interface esticada — aproveitando bem o espaço disponível.

**Why this priority**: A constituição exige captura otimizada no mobile e análise otimizada no
desktop. Definir breakpoints, grids e padrões de navegação adaptativos é pré-requisito para
qualquer tela de negócio futura. Depende dos tokens da US1 para espaçamento/tipografia.

**Independent Test**: Abrir as telas-vitrine em larguras representativas (≈390px, ≈768px,
1920×1080 e 3440×1440) e verificar que o layout se reorganiza adequadamente, que o padrão de
navegação muda conforme o formato e que não há quebra, rolagem horizontal indevida ou
desperdício/excesso de espaço.

**Acceptance Scenarios**:

1. **Given** um smartphone com largura efetiva ≈390px, **When** o usuário usa a aplicação, **Then** o conteúdo ocupa a largura de forma confortável, alvos de toque têm tamanho adequado (≥44×44px) e a navegação primária fica acessível ao polegar via **barra de abas inferior**.
2. **Given** um tablet (largura ≈768–1024px), **When** o usuário usa a aplicação, **Then** o layout aproveita a largura extra com um **rail/sidebar recolhível** (e conteúdo em duas colunas quando aplicável), sem parecer um celular ampliado.
3. **Given** um desktop Full HD (1920×1080), **When** o usuário visualiza uma tela, **Then** o conteúdo respeita uma largura de leitura confortável (não se estica indefinidamente) e uma **sidebar fixa** de navegação está disponível.
4. **Given** um monitor ultrawide (3440×1440), **When** o usuário visualiza uma tela, **Then** o espaço horizontal é aproveitado de forma útil (ex.: múltiplas colunas/painéis ou contenção centralizada deliberada), sem linhas de texto excessivamente longas nem grandes áreas vazias não intencionais.
5. **Given** qualquer breakpoint, **When** a orientação ou o tamanho da janela muda, **Then** a transição entre layouts é fluida e nenhum conteúdo essencial fica inacessível.

---

### User Story 3 - Biblioteca de componentes, estados e padrões de entrada (Priority: P3)

Como desenvolvedor (humano ou agente de IA) construindo telas futuras, eu quero um conjunto
consistente de componentes e padrões prontos — incluindo estados de carregamento, vazio, erro e
sucesso, e formulários otimizados para entrada rápida e recorrente — para montar telas sem
reinventar elementos básicos nem criar inconsistências.

**Why this priority**: São os blocos de construção reutilizáveis. Por serem usados por todas as
telas, vêm logo após tokens e layout. Foca em equilíbrio entre reutilização e simplicidade
(evitar componentes genéricos demais), conforme a constituição.

**Independent Test**: Montar uma tela de demonstração combinando apenas componentes da
biblioteca (navegação, botões, campos de formulário, cartões, listas, tabela, modal/sheet,
notificações, estados de loading/vazio/erro) e verificar que cobrem os casos comuns, são
acessíveis por teclado e leitor de tela, e que um formulário de exemplo permite entrada rápida.

**Acceptance Scenarios**:

1. **Given** a biblioteca de componentes, **When** uma tela precisa de ação, entrada, exibição de dados e navegação, **Then** existem componentes correspondentes (botões, campos/labels/validação, cartões, listas, tabela, navegação, diálogos/sheets, notificações/toasts, badges, skeletons) com aparência coerente nos dois temas.
2. **Given** uma operação assíncrona, **When** ela está em andamento, **Then** o componente exibe um estado de carregamento claro (ex.: skeleton ou indicador) e impede ações duplicadas quando apropriado.
3. **Given** uma lista ou área de conteúdo sem dados, **When** é exibida, **Then** apresenta um estado vazio informativo (mensagem + ação sugerida) em vez de uma área em branco.
4. **Given** uma falha de operação ou de carregamento, **When** ocorre, **Then** o usuário vê uma mensagem de erro compreensível, não técnica, com opção de repetir quando aplicável — sem expor detalhes sensíveis.
5. **Given** um formulário em um smartphone, **When** o usuário preenche dados, **Then** o padrão minimiza cliques/toques (teclados/controles adequados ao tipo de dado, valores padrão sensatos, foco e ordem de tabulação corretos, validação inline) para suportar registro rápido e recorrente.
6. **Given** qualquer componente interativo, **When** navegado por teclado ou leitor de tela, **Then** tem foco visível, rótulos/acessibilidade adequados e segue padrões de acessibilidade (WCAG 2.1 AA).

---

### User Story 4 - Guia visual vivo do design system (Priority: P4)

Como mantenedor e como agente de IA construindo telas futuras, eu quero uma página/guia que
documente e demonstre os elementos do design system — tokens, temas, componentes, layouts e
diretrizes de uso — para que novas telas sejam consistentes e produzidas rapidamente.

**Why this priority**: Multiplica o valor da fundação ao torná-la descobrível e padronizada.
Vem por último porque depende dos artefatos das US1–US3, mas é essencial para a produtividade de
desenvolvimento assistido por IA exigida pelo escopo.

**Independent Test**: Acessar o guia e verificar que ele exibe, ao vivo e nos dois temas, a
paleta/tokens, a escala tipográfica, os espaçamentos, os componentes em seus vários estados e
exemplos de layout por breakpoint, com diretrizes de quando usar cada um.

**Acceptance Scenarios**:

1. **Given** o guia visual, **When** acessado, **Then** apresenta as cores/tokens, a tipografia, os espaçamentos, raios, sombras e a iconografia em uso.
2. **Given** o guia, **When** o usuário alterna o tema, **Then** todos os exemplos refletem o tema selecionado.
3. **Given** o guia, **When** um componente é exibido, **Then** mostra suas variações e estados principais (normal, hover/focus, desabilitado, carregando, erro) com uma diretriz curta de uso.
4. **Given** o guia, **When** exibe layouts, **Then** demonstra os padrões por formato (mobile, tablet, desktop, ultrawide).

---

### Edge Cases

- **Flash de tema (FOUC)**: como evitar que o tema oposto apareça por um instante no primeiro carregamento, inclusive em conexões lentas.
- **Preferência de sistema alterada em tempo de execução**: em modo "Sistema", a interface acompanha a troca do SO (claro↔escuro) em tempo real com a aplicação aberta; em modo "Claro"/"Escuro" explícito, ignora a mudança do SO.
- **Armazenamento de preferência indisponível**: comportamento quando a persistência local está bloqueada/cheia (ex.: modo privado) — deve haver fallback sem quebrar.
- **Largura mínima**: comportamento em telas muito estreitas (≈320px) — sem rolagem horizontal nem corte de conteúdo essencial.
- **Conteúdo extremo**: textos muito longos, nomes/rótulos extensos, listas vazias e listas muito grandes não devem quebrar o layout.
- **Reduzir movimento / alto contraste**: respeitar preferências de acessibilidade do sistema.
- **Zoom e tamanho de fonte do sistema aumentados**: layout permanece utilizável (sem sobreposição/corte) com zoom até 200%.
- **Offline/erro de rede**: estados de erro/carregamento dos componentes se comportam de forma previsível (a fundação não exige offline, mas não deve quebrar).
- **Internacionalização de texto**: a fundação assume Português (pt-BR); rótulos não devem estar estruturados de forma a impedir ajustes, mas i18n completa está fora de escopo.

## Requirements _(mandatory)_

### Functional Requirements

**Identidade visual e tokens**

- **FR-001**: O sistema MUST definir um conjunto central de design tokens — paleta de cores (incluindo cores semânticas de sucesso, aviso, erro e informação), escala tipográfica, escala de espaçamento, raios de borda, sombras/elevação e larguras de borda — usados de forma consistente em toda a aplicação.
- **FR-002**: O sistema MUST aplicar uma identidade visual moderna, limpa, profissional e confiável, adequada a uma plataforma premium de observabilidade de saúde, priorizando legibilidade e clareza. A direção visual é **azul-índigo/violeta como cor de destaque sobre neutros frios (cinza-ardósia)**, estética "tech/premium"; tonalidades exatas e ajustes finos são definidos no planejamento, preservando o contraste WCAG AA (FR-010).
- **FR-003**: O sistema MUST definir uma hierarquia tipográfica clara (títulos, subtítulos, corpo, legenda, rótulos) com tamanhos, pesos e alturas de linha legíveis em mobile e desktop.
- **FR-004**: O sistema MUST definir uma iconografia consistente (estilo, tamanho e uso) aplicável em toda a interface.

**Temas claro/escuro**

- **FR-005**: O sistema MUST oferecer tema claro e tema escuro disponíveis em toda a aplicação.
- **FR-006**: Users MUST be able to escolher o tema por meio de um controle dedicado tri-estado — **Claro / Escuro / Sistema** — com aplicação instantânea, sem recarregar a aplicação.
- **FR-007**: O sistema MUST persistir a preferência de tema do usuário (incluindo a opção "Sistema") entre sessões e reinicializações.
- **FR-008**: O sistema MUST adotar **"Sistema"** como padrão inicial (na ausência de escolha do usuário) e, enquanto nesse modo, MUST acompanhar em tempo real as mudanças de tema do sistema operacional.
- **FR-009**: O sistema MUST evitar o flash de tema incorreto no carregamento inicial.
- **FR-010**: O sistema MUST garantir contraste mínimo WCAG 2.1 AA em ambos os temas.

**Responsividade, layout e navegação**

- **FR-011**: O sistema MUST adotar abordagem mobile-first, tratando smartphones de largura efetiva ≈390px como cenário primário de uso.
- **FR-012**: O sistema MUST definir um conjunto explícito de breakpoints cobrindo smartphone, tablet, desktop (Full HD 1920×1080) e ultrawide (3440×1440).
- **FR-013**: O sistema MUST definir layouts e padrões de navegação distintos por formato, de modo que cada tamanho aproveite o espaço de forma eficiente — não apenas amplie a mesma interface. O padrão de navegação primária é: **smartphone → barra de abas inferior; tablet → rail/sidebar recolhível; desktop e ultrawide → sidebar fixa.**
- **FR-014**: O sistema MUST garantir que alvos de toque tenham tamanho mínimo adequado (≥44×44px) e espaçamento confortável em telas de toque.
- **FR-015**: O sistema MUST evitar rolagem horizontal indevida e quebras de layout em todos os breakpoints suportados, inclusive em ≈320px.
- **FR-016**: O sistema MUST limitar a largura de leitura de blocos de texto/conteúdo em telas largas para preservar legibilidade, aproveitando o espaço restante de forma intencional.

**Componentes, estados e entrada de dados**

- **FR-017**: O sistema MUST fornecer uma biblioteca de componentes reutilizáveis cobrindo, no mínimo: navegação (primária e contextual), botões e ações, campos de formulário com rótulos e validação, cartões, listas, tabela, diálogos/sheets, notificações/toasts, badges/etiquetas e indicadores de carregamento (skeletons/spinners).
- **FR-018**: O sistema MUST padronizar estados de feedback visual: carregamento, vazio, erro e sucesso, aplicáveis de forma consistente.
- **FR-019**: O sistema MUST apresentar mensagens de erro compreensíveis e não técnicas, sem expor detalhes sensíveis ou de implementação, com opção de repetir quando aplicável.
- **FR-020**: O sistema MUST definir padrões de formulário otimizados para entrada rápida e recorrente em mobile: tipos de entrada/teclado adequados ao dado, valores padrão sensatos, validação inline, foco e ordem de tabulação corretos e redução do número de toques/cliques.
- **FR-021**: O sistema MUST manter equilíbrio entre reutilização e simplicidade, evitando componentes excessivamente genéricos, abstrações prematuras e complexidade desnecessária (alinhado ao Princípio V da Constituição).

**Acessibilidade e movimento**

- **FR-022**: O sistema MUST garantir navegação completa por teclado com foco visível em todos os elementos interativos.
- **FR-023**: O sistema MUST fornecer rótulos/semântica de acessibilidade adequados para uso com leitores de tela.
- **FR-024**: O sistema MUST definir animações e microinterações sutis que reforcem a usabilidade, e MUST respeitar a preferência de "reduzir movimento" do sistema.

**Arquitetura de frontend e documentação**

- **FR-025**: O sistema MUST organizar o frontend de forma a favorecer consistência visual entre telas, manutenção de longo prazo, evolução incremental e produtividade para desenvolvimento assistido por agentes de IA.
- **FR-026**: O sistema MUST construir os componentes a partir de **primitivos headless acessíveis (Radix) estilizados com Tailwind, copiados para dentro do repositório (padrão shadcn/ui)**, mantendo o projeto dono do código-fonte dos componentes. Demais recursos visuais (ícones, animações, gráficos) MUST ser justificados pelos princípios da Constituição — modernos, amplamente adotados, acessíveis, bem documentados e ativamente mantidos (seleção concreta decidida no planejamento).
- **FR-027**: O sistema MUST incluir um guia visual vivo que documente e demonstre tokens, temas, tipografia, componentes (com seus estados) e padrões de layout por formato, com diretrizes de uso.
- **FR-028**: O sistema MUST reconstruir as telas existentes (Login, Home/health shell, Administração da allowlist) sobre o novo design system, como validação da fundação, sem adicionar lógica de negócio nova.
- **FR-029**: O sistema MUST NOT implementar funcionalidades do domínio de saúde do VITA; o escopo é exclusivamente a fundação visual e arquitetural.

### Key Entities

- **Design Token**: unidade nomeada de decisão visual (ex.: cor primária, espaçamento-2, raio-md, tipo-corpo). Possui um valor por tema quando aplicável (claro/escuro) e é referenciado por componentes e layouts em vez de valores fixos.
- **Preferência de Tema**: escolha do usuário (claro, escuro ou "seguir o sistema"), persistida localmente e aplicada na inicialização. Único dado de estado persistido por esta feature; não é dado de saúde.
- **Componente**: elemento de interface reutilizável com variações e estados definidos (normal, foco/hover, desabilitado, carregando, erro), aparência coerente nos dois temas e contrato de uso documentado no guia.
- **Breakpoint / Formato**: faixa de largura de tela (smartphone, tablet, desktop, ultrawide) associada a um padrão de layout e navegação.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% das telas existentes (Login, Home, Administração) são reconstruídas sobre o design system e renderizam corretamente nos temas claro e escuro.
- **SC-002**: A alternância de tema reflete em toda a interface em menos de 1 segundo e sem recarregar a página; a preferência persiste corretamente em 100% das reaberturas da aplicação.
- **SC-003**: Não há flash de tema incorreto no carregamento inicial em conexões típicas (perceptível em 0% dos carregamentos observados em teste).
- **SC-004**: Todas as combinações de texto/fundo e elementos interativos atendem ao contraste WCAG 2.1 AA nos dois temas (0 violações de contraste em auditoria).
- **SC-005**: As telas-vitrine funcionam sem quebra de layout nem rolagem horizontal indevida em quatro larguras de referência: ≈390px, ≈768px, 1920×1080 e 3440×1440 (e permanecem utilizáveis a 320px).
- **SC-006**: Em cada formato (mobile, tablet, desktop, ultrawide) o padrão de navegação e o aproveitamento de espaço são distintos e apropriados, validados por inspeção nas quatro larguras de referência.
- **SC-007**: Uma tela de demonstração é montada usando apenas componentes existentes da biblioteca, sem necessidade de criar novos primitivos visuais.
- **SC-008**: 100% dos elementos interativos são operáveis por teclado, com foco visível, e a auditoria automatizada de acessibilidade não acusa violações de nível A/AA nas telas-vitrine e no guia.
- **SC-009**: Alvos de toque em telas de captura têm no mínimo 44×44px em 100% dos controles primários.
- **SC-010**: O guia visual cobre 100% dos tokens e dos componentes entregues, exibindo seus estados principais e diretrizes de uso, e reflete corretamente o tema selecionado.
- **SC-011**: A preferência de "reduzir movimento" do sistema é respeitada em 100% das animações/microinterações.

## Assumptions

- **Usuário-alvo**: a aplicação atende a um único usuário-proprietário (conforme a Constituição); não há necessidade de temas/marcas por múltiplos tenants.
- **Idioma**: a interface assume Português (pt-BR) como idioma único; internacionalização completa (múltiplos idiomas/RTL) está fora de escopo, mas rótulos não devem ser estruturados de forma a impedir ajustes futuros.
- **Identidade de marca**: não há um guia de marca pré-existente; a direção foi definida (ver Clarifications) como **azul-índigo/violeta sobre neutros frios**, estética moderna "tech/premium". As tonalidades exatas, a escala de cores e os tokens derivados são propostos no planejamento, preservando contraste WCAG AA.
- **Tema padrão**: o controle é tri-estado (Claro/Escuro/Sistema) com "Sistema" como padrão; quando a preferência do SO é indisponível, o fallback efetivo é o tema claro.
- **Persistência de preferência**: a preferência de tema é armazenada localmente no dispositivo/navegador do usuário; não é sincronizada entre dispositivos nesta feature.
- **Stack base**: reutiliza a stack já definida na Constituição e na feature 001 (SPA React + TypeScript + Tailwind, PWA). Os componentes seguem o padrão headless (Radix) + Tailwind copiados para o repo (shadcn/ui) — ver Clarifications. A seleção de ícones, animação e gráficos é decidida no planejamento, justificada pelos princípios da Constituição.
- **Sem backend novo**: esta feature não requer novos endpoints nem alterações de dados no backend; consome apenas o que já existe nas telas-vitrine.
- **Gráficos/visualização de dados**: define-se a abordagem e os tokens para visualização (cores de série, estados), mas não se implementam gráficos de domínio — isso ocorrerá nas features de negócio.
- **Escopo de offline**: mantém os requisitos mínimos de PWA já existentes; recursos offline avançados estão fora de escopo.
- **Navegadores-alvo**: navegadores modernos e atuais (últimas versões de Chrome, Edge, Safari e Firefox), em desktop e mobile.
