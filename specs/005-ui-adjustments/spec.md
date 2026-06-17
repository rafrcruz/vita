# Feature Specification: Ajustes de UI — Navegação, Perfil, Gráfico e Ícone PWA

**Feature Branch**: `005-ui-adjustments`

**Created**: 2026-06-17

**Status**: Draft

**Input**: User description: "Ajustes de UI: ícone PWA da aplicação; remover textos e elementos desnecessários do cabeçalho (subtítulo, e-mail/ADMIN/allowlist, card de status do backend); melhorar tooltips e eixos do gráfico de série temporal; mover Histórico para o menu; cabeçalho superior só com tema e Sair; criar tela de Perfil (nome completo, data de nascimento, altura); reorganizar menu mobile com 'Início' + menu hambúrguer (Admin, Histórico); corrigir sobreposição do menu mobile sobre os botões de Adicionar; reposicionar modal de captura para o topo quando o teclado numérico estiver aberto."

## Clarifications

### Session 2026-06-17

- Q: Acessibilidade — escopo e nível para esta feature? → A: A11y básica obrigatória (nomes acessíveis nos novos controles; navegação por teclado e gestão de foco em menu/modais/Perfil; alvo de toque mínimo ≥44px na nav e FABs; gráfico não depende só de cor + alternativa textual ao tooltip por hover). Conformidade formal WCAG AA completa fica fora de escopo.
- Q: Gráfico — regra de densidade de rótulos no eixo X? → A: 3–6 marcas adaptativas distribuídas uniformemente no intervalo, com formato de data conforme o período (dia/mês em 7D/30D; incluir mês/ano quando "Tudo" cobrir intervalos longos).

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Ícone da aplicação ao instalar no celular (Priority: P1)

Como usuário que adicionou o VITA à área de trabalho do celular, quero que o atalho exiba um ícone bonito e relacionado a saúde, em vez de um quadrado cinza com a letra "V", para reconhecer o app facilmente entre os demais.

**Why this priority**: É o item mais visível e que afeta a percepção de "app pronto/instalável"; impacta a primeira impressão sempre que o usuário abre o celular. É independente das demais mudanças.

**Independent Test**: Instalar o app (adicionar à tela inicial) em um dispositivo móvel e verificar que o atalho exibe o ícone da aplicação corretamente, sem fundo cinza genérico nem fallback de letra.

**Acceptance Scenarios**:

1. **Given** o app aberto no navegador do celular, **When** o usuário adiciona o VITA à tela inicial, **Then** o atalho criado exibe o ícone personalizado da aplicação.
2. **Given** o app instalado na tela inicial, **When** o usuário toca no atalho, **Then** o app abre exibindo nome e ícone próprios (sem barra de URL típica de site, quando suportado pela plataforma).
3. **Given** plataformas que solicitam ícone em alta resolução (ex.: tela de splash/instalação), **When** o sistema operacional renderiza o ícone, **Then** ele aparece nítido nos tamanhos requeridos, sem distorção.

---

### User Story 2 - Cabeçalho enxuto e menu reorganizado (Priority: P1)

Como usuário, quero um cabeçalho limpo (apenas seleção de tema e botão "Sair") e a navegação organizada em um menu, para focar nos meus dados sem poluição visual e para acessar telas secundárias (Histórico, Admin) de forma previsível.

**Why this priority**: Reduz ruído visual na tela principal e estabelece a estrutura de navegação que as demais telas (Perfil, Histórico) passam a usar. Afeta todas as telas e ambos os dispositivos.

**Independent Test**: Abrir a tela inicial em desktop e em mobile e verificar que o cabeçalho contém somente tema + Sair; que Histórico e Admin estão acessíveis pelo menu; e que os elementos removidos não aparecem mais.

**Acceptance Scenarios**:

1. **Given** a tela inicial em desktop, **When** ela é exibida, **Then** o cabeçalho superior contém apenas a seleção de tema e o botão "Sair" (sem botão "Histórico").
2. **Given** a tela inicial em qualquer dispositivo, **When** ela é exibida, **Then** o subtítulo "Plataforma pessoal de observabilidade de saúde" não aparece.
3. **Given** a tela inicial em qualquer dispositivo, **When** ela é exibida, **Then** a linha com e-mail do usuário, badge "ADMIN" e link "Administrar allowlist" não aparece; a administração da allowlist é acessível somente pela opção "Admin" no menu.
4. **Given** a tela inicial, **When** ela é exibida, **Then** o card "Status do backend" não aparece.
5. **Given** o menu de navegação, **When** o usuário o utiliza, **Then** existe uma opção "Histórico" que leva à tela de histórico.

---

### User Story 3 - Tela de Perfil funcional (Priority: P1)

Como usuário, quero uma tela de Perfil onde eu possa informar e salvar meu nome completo, data de nascimento e altura, para que esses dados fiquem registrados e possam fundamentar funcionalidades futuras (ex.: IMC, estimativa de calorias).

**Why this priority**: Hoje o item "Perfil" não leva a lugar nenhum (link quebrado); entregar uma tela funcional corrige um defeito e habilita evoluções futuras. É uma fatia independente e demonstrável.

**Independent Test**: Acessar "Perfil" pelo menu, preencher nome completo, data de nascimento e altura, salvar, recarregar o app e confirmar que os dados persistem.

**Acceptance Scenarios**:

1. **Given** o usuário autenticado, **When** seleciona "Perfil" no menu, **Then** uma tela de perfil é exibida (não um link quebrado / tela em branco).
2. **Given** a tela de Perfil, **When** o usuário preenche nome completo, data de nascimento e altura e confirma o salvamento, **Then** os dados são persistidos e uma confirmação de sucesso é exibida.
3. **Given** dados de perfil previamente salvos, **When** o usuário reabre a tela de Perfil, **Then** os campos vêm preenchidos com os valores salvos.
4. **Given** a tela de Perfil, **When** o usuário informa uma altura fora de faixa plausível ou uma data de nascimento inválida/no futuro, **Then** o sistema impede o salvamento e exibe mensagem de validação clara.
5. **Given** campos de perfil vazios, **When** o usuário acessa a tela pela primeira vez, **Then** ele consegue salvar parcialmente (campos opcionais) ou recebe orientação sobre o que é obrigatório, sem travar a navegação.

---

### User Story 4 - Gráfico de série temporal mais informativo (Priority: P2)

Como usuário acompanhando minha evolução, quero ver o valor de cada ponto ao passar o mouse (desktop) e enxergar claramente as datas (eixo X) e os valores (eixo Y), para interpretar a tendência sem ambiguidade.

**Why this priority**: Melhora a leitura dos dados que são o núcleo do produto, mas não bloqueia o uso básico; por isso vem depois dos itens estruturais.

**Independent Test**: Abrir o gráfico em desktop e mobile com dados de exemplo e verificar tooltip com valor ao passar o mouse, rótulos de data no eixo X e rótulos de valor no eixo Y legíveis em ambos os tamanhos de tela.

**Acceptance Scenarios**:

1. **Given** o gráfico em desktop com pontos, **When** o usuário posiciona o cursor sobre um ponto, **Then** é exibido o valor da medição correspondente (e a data) daquele ponto.
2. **Given** o gráfico em qualquer dispositivo, **When** ele é exibido, **Then** o eixo X mostra rótulos de data legíveis e adequados ao período selecionado (7D / 30D / Tudo), sem sobreposição de texto.
3. **Given** o gráfico em qualquer dispositivo, **When** ele é exibido, **Then** o eixo Y mostra rótulos de valor com a unidade apropriada (kg para peso; mmHg para pressão).
4. **Given** o gráfico em mobile, **When** o usuário interage com um ponto (toque), **Then** o valor correspondente é exibido de forma legível dentro da área visível.
5. **Given** um único ponto ou nenhum ponto no período, **When** o gráfico é exibido, **Then** os eixos e o estado vazio permanecem legíveis e sem erro visual.

---

### User Story 5 - Navegação mobile sem colisão e com menu expansível (Priority: P2)

Como usuário no celular, quero uma barra inferior com "Início" e um botão de menu (três tracinhos) que abre as demais opções (Admin, Histórico), e quero que essa barra não cubra os botões "Adicionar Peso" e "Adicionar Pressão", para conseguir navegar e registrar medições sem dificuldade.

**Why this priority**: Resolve um problema de usabilidade real (botões difíceis de tocar) e prepara a navegação para crescer com novas telas no futuro.

**Independent Test**: No celular, verificar que a barra inferior exibe "Início" + ícone de menu; que ao abrir o menu aparecem Admin e Histórico; e que os botões "Adicionar Peso"/"Adicionar Pressão" ficam totalmente clicáveis (não cobertos pela barra).

**Acceptance Scenarios**:

1. **Given** a tela inicial no celular, **When** ela é exibida, **Then** a navegação inferior apresenta "Início" e um controle de menu (três tracinhos), em vez de listar Início/Admin/Perfil fixos.
2. **Given** a navegação inferior, **When** o usuário aciona o menu (três tracinhos), **Then** são exibidas as opções adicionais disponíveis (no momento, Admin e Histórico; Perfil também acessível), de forma extensível para telas futuras.
3. **Given** a tela inicial no celular, **When** ela é exibida, **Then** os botões "Adicionar Peso" e "Adicionar Pressão" estão totalmente visíveis e clicáveis, sem serem sobrepostos pela barra de navegação inferior.
4. **Given** o menu mobile aberto, **When** o usuário seleciona uma opção, **Then** ele é levado à tela correspondente e o menu se fecha.

---

### User Story 6 - Modal de captura visível com teclado numérico aberto (Priority: P3)

Como usuário registrando peso ou pressão no celular, quero que o modal de captura fique posicionado no topo quando o teclado numérico estiver aberto, para conseguir ver o campo, a opção "Alterar data" e os botões "Cancelar"/"Salvar" sem precisar fechar o teclado.

**Why this priority**: É um refinamento de conforto; o fluxo já funciona, apenas exige um passo extra hoje. Melhora a experiência mas tem o menor impacto funcional.

**Independent Test**: No celular, abrir o modal de Adicionar Peso/Pressão, confirmar que o teclado numérico abre automaticamente e que, com o teclado aberto, o conteúdo do modal (campo, "Alterar data", "Cancelar", "Salvar") permanece visível sem fechar o teclado.

**Acceptance Scenarios**:

1. **Given** o usuário no celular, **When** abre o modal de Adicionar Peso ou Adicionar Pressão, **Then** o teclado numérico abre automaticamente (comportamento atual mantido).
2. **Given** o modal aberto com o teclado numérico visível, **When** o usuário olha a tela, **Then** o campo de entrada, a opção "Alterar data" e os botões "Cancelar" e "Salvar" estão visíveis sem necessidade de fechar o teclado.
3. **Given** o teclado numérico fechado, **When** o modal é exibido, **Then** ele permanece utilizável e bem posicionado (sem cortar conteúdo).

---

### Edge Cases

- **Ícone**: plataformas/navegadores que não suportam instalação PWA devem continuar exibindo ao menos um favicon/ícone adequado, sem quebrar.
- **Perfil sem dados**: primeiro acesso com todos os campos vazios não deve travar a navegação nem gerar erro.
- **Altura/data inválidas**: valores fora de faixa plausível ou data de nascimento no futuro devem ser bloqueados com mensagem clara.
- **Gráfico com 0 ou 1 ponto**: eixos e tooltip não devem gerar estado de erro visual.
- **Períodos longos ("Tudo")**: muitos pontos no eixo X não devem causar sobreposição ilegível de rótulos de data.
- **Menu mobile**: abrir o menu de opções não deve cobrir permanentemente os botões de Adicionar nem prender o foco; deve ser fechável.
- **Admin × usuário comum**: a opção "Admin" no menu deve respeitar a permissão atual (visível/acessível apenas a quem é admin), mantendo o comportamento de autorização existente.
- **Teclado em telas pequenas**: o reposicionamento do modal não deve cortar os botões de ação em aparelhos de tela muito baixa.

## Requirements _(mandatory)_

### Functional Requirements

#### Ícone / PWA

- **FR-001**: O sistema MUST fornecer um ícone de aplicação próprio, com temática de saúde (ex.: peso/saúde), exibido ao instalar o app na tela inicial de dispositivos móveis.
- **FR-002**: O sistema MUST disponibilizar o ícone nos tamanhos e formatos necessários para que as plataformas o exibam nítido em atalhos e telas de instalação/splash.
- **FR-003**: O sistema MUST permitir que o app seja reconhecido como instalável (nome e ícone próprios) quando aberto a partir do atalho na tela inicial.

#### Cabeçalho e elementos removidos

- **FR-004**: O sistema MUST remover o subtítulo "Plataforma pessoal de observabilidade de saúde" de todas as telas (desktop e mobile).
- **FR-005**: O sistema MUST remover do corpo da tela inicial a linha que exibe e-mail do usuário, badge de papel ("ADMIN") e o link "Administrar allowlist".
- **FR-006**: O sistema MUST remover o card "Status do backend" da tela inicial.
- **FR-007**: O cabeçalho superior MUST conter apenas a seleção de tema e o botão "Sair".
- **FR-008**: O sistema MUST mover o acesso ao "Histórico" do cabeçalho para o menu de navegação (não mais como botão no topo), em desktop e mobile.

#### Perfil

- **FR-009**: O sistema MUST disponibilizar uma tela de Perfil acessível pelo menu, corrigindo o estado atual em que o item "Perfil" não leva a nenhuma tela.
- **FR-010**: A tela de Perfil MUST permitir que o usuário informe e salve nome completo, data de nascimento e altura.
- **FR-011**: O sistema MUST persistir os dados de perfil de forma que permaneçam disponíveis entre sessões e recarregamentos do app.
- **FR-012**: O sistema MUST validar os dados de perfil (data de nascimento válida e não futura; altura dentro de faixa plausível) e impedir salvamento inválido com mensagem clara.
- **FR-013**: A tela de Perfil MUST pré-carregar os valores já salvos quando reaberta.
- **FR-014**: O sistema SHOULD permitir salvar o perfil mesmo com parte dos campos ainda não preenchidos, sem bloquear a navegação no primeiro acesso. _(Assumption: os três campos são opcionais nesta etapa, pois servem a usos futuros.)_

#### Gráfico (série temporal)

- **FR-015**: No desktop, o gráfico MUST exibir, ao passar o cursor sobre um ponto, o valor da medição correspondente (e a respectiva data).
- **FR-016**: O gráfico MUST exibir entre 3 e 6 marcas de data no eixo X, distribuídas uniformemente ao longo do intervalo (independentemente da quantidade de pontos), evitando sobreposição. O formato da data MUST se adequar ao período: dia/mês para 7D e 30D; incluir mês/ano quando o período "Tudo" cobrir intervalos longos.
- **FR-017**: O gráfico MUST exibir rótulos de valor no eixo Y com a unidade apropriada (kg para peso; mmHg para pressão).
- **FR-018**: As melhorias de eixos e de exibição de valor MUST se aplicar tanto a desktop quanto a mobile.
- **FR-019**: No mobile, o usuário SHOULD conseguir visualizar o valor de um ponto por interação de toque, dentro da área visível.

#### Navegação mobile

- **FR-020**: A navegação inferior no mobile MUST apresentar "Início" e um controle de menu (três tracinhos) que abre as demais opções, em vez de listar opções fixas.
- **FR-021**: O menu mobile expansível MUST conter, no mínimo, "Admin", "Histórico" e acesso a "Perfil", e MUST ser estruturado para acomodar novas telas no futuro.
- **FR-022**: A barra de navegação inferior MUST NOT sobrepor os botões "Adicionar Peso" e "Adicionar Pressão"; ambos MUST permanecer totalmente visíveis e clicáveis no mobile.
- **FR-023**: A opção "Admin" no menu MUST respeitar as permissões de autorização atuais (acessível conforme o papel do usuário).

#### Modal de captura

- **FR-024**: Ao abrir o modal de Adicionar Peso/Pressão no mobile, o sistema MUST manter o comportamento atual de abrir o teclado numérico automaticamente.
- **FR-025**: Com o teclado numérico aberto, o modal MUST permanecer posicionado de forma que campo de entrada, opção "Alterar data" e botões "Cancelar"/"Salvar" fiquem visíveis sem fechar o teclado (ex.: ancorado ao topo em vez de centralizado).
- **FR-026**: Com o teclado fechado, o modal MUST permanecer utilizável e sem cortar conteúdo.

#### Acessibilidade (a11y básica — transversal)

- **FR-027**: Todos os novos controles interativos MUST ter nome acessível (ex.: `aria-label`), em especial o botão de menu mobile (três tracinhos) e os controles de interação do gráfico.
- **FR-028**: O novo menu mobile, a tela de Perfil e os modais de captura MUST ser operáveis por teclado, com ordem de foco lógica e gestão de foco ao abrir/fechar (foco inicial ao abrir e retorno ao elemento de origem ao fechar).
- **FR-029**: Os alvos de toque da navegação inferior e dos botões "Adicionar Peso"/"Adicionar Pressão" MUST ter tamanho mínimo de 44×44px.
- **FR-030**: O gráfico MUST NOT transmitir informação apenas por cor (ex.: distinção sistólica/diastólica deve ter outro indicador além da cor, como rótulo/legenda) e MUST oferecer uma alternativa de leitura do valor que não dependa exclusivamente de hover (ex.: acessível por toque/teclado ou texto associado).
- **FR-031**: Conformidade formal WCAG 2.1 AA completa (auditoria de contraste, testes com leitores de tela) está FORA do escopo desta feature; apenas a a11y básica acima é obrigatória.

### Key Entities _(include if feature involves data)_

- **Perfil do Usuário**: representa dados pessoais do único usuário-proprietário associados à sua conta. Atributos: nome completo (texto), data de nascimento (data), altura (medida de comprimento, ex.: cm ou m). Relaciona-se 1:1 com o usuário autenticado. Destinado a fundamentar cálculos futuros (ex.: IMC, estimativa calórica), sem realizar tais cálculos nesta feature.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% das instalações na tela inicial (em plataformas que suportam) exibem o ícone personalizado, sem fallback de letra/quadrado cinza.
- **SC-002**: A tela inicial não exibe nenhum dos elementos removidos (subtítulo, linha de e-mail/ADMIN/allowlist, card de status do backend, botão Histórico no topo) em desktop nem mobile.
- **SC-003**: O usuário consegue acessar Histórico, Admin e Perfil exclusivamente pelo menu, e todos levam à tela correta (zero links que não levam a lugar nenhum).
- **SC-004**: O usuário consegue preencher e salvar nome completo, data de nascimento e altura, e os valores persistem após recarregar o app (verificável em até 1 minuto).
- **SC-005**: Em desktop, 100% dos pontos do gráfico exibem o valor ao passar o cursor; os eixos X (datas) e Y (valores com unidade) são legíveis em desktop e mobile para os três períodos (7D/30D/Tudo).
- **SC-006**: No mobile, os botões "Adicionar Peso" e "Adicionar Pressão" são acionáveis em uma única tentativa, sem sobreposição da barra de navegação (taxa de toque bem-sucedido ≈ 100%).
- **SC-007**: No mobile, com o teclado numérico aberto, o usuário consegue ver e acionar "Alterar data", "Cancelar" e "Salvar" sem precisar fechar o teclado antes.
- **SC-008**: 100% dos novos controles interativos têm nome acessível; o menu mobile, a tela de Perfil e os modais são totalmente operáveis por teclado; os alvos de toque da nav e dos botões de Adicionar medem ≥44×44px; e o gráfico não depende exclusivamente de cor nem de hover para comunicar valor.

## Assumptions

- O ícone será criado especificamente para esta feature, com temática de saúde/peso; a identidade visual exata (cor/símbolo) seguirá o design system existente e poderá ser detalhada na fase de plano.
- Os dados de Perfil serão persistidos no backend, associados ao usuário autenticado (coerente com a plataforma ser um sistema com armazenamento de dados do usuário), em vez de apenas localmente no dispositivo.
- Os campos de Perfil (nome completo, data de nascimento, altura) são opcionais nesta etapa, pois destinam-se a usos futuros; o usuário pode salvar parcialmente.
- Altura será informada em unidade métrica (cm), coerente com o uso de kg para peso.
- A administração da allowlist permanece restrita a usuários admin; apenas o ponto de acesso muda (passa a ser somente via "Admin" no menu).
- As melhorias de gráfico reutilizam a biblioteca de gráficos já adotada no app; nenhuma troca de tecnologia é assumida.
- O comportamento de abertura automática do teclado numérico nos modais é desejado e deve ser mantido.
- Esta feature não introduz cálculos de IMC/calorias; apenas captura os dados que poderão fundamentá-los no futuro.
- O reposicionamento do modal com teclado aberto aplica-se ao contexto mobile; em desktop o posicionamento atual é mantido.
