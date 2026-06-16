# Feature Specification: Weight & Blood Pressure Tracking

**Feature Branch**: `003-weight-bp-tracking`

**Created**: 2026-06-16

**Status**: Draft

**Input**: User description: "Criar a especificação da feature \"Weight & Blood Pressure Tracking\". O objetivo desta funcionalidade é permitir acompanhamento contínuo de peso corporal e pressão arterial com foco absoluto em rapidez, simplicidade e excelente experiência de uso em dispositivos móveis. A especificação deve priorizar a captura frequente de dados. Inserir um novo registro de peso ou pressão deve exigir o menor número possível de interações, cliques e navegações, tornando o processo rápido e confortável para uso diário. A aplicação deve oferecer mecanismos de acesso extremamente rápidos para criação de novos registros de peso e pressão diretamente a partir da experiência principal da aplicação. A especificação deve propor a melhor solução de usabilidade para atingir esse objetivo, justificando as decisões adotadas. Para registros de peso, o fluxo deve ser otimizado para entrada rápida de um único valor numérico. A data e hora do registro devem ser preenchidas automaticamente com o momento atual, permitindo edição quando necessário. O campo de peso deve priorizar entrada numérica, abrir automaticamente o teclado apropriado em dispositivos móveis e aceitar tanto ponto quanto vírgula como separador decimal. A interface deve destacar visualmente o valor informado, priorizando foco e simplicidade durante a inserção. Para registros de pressão arterial, o fluxo deve seguir os mesmos princípios de simplicidade e velocidade. A data e hora devem ser preenchidas automaticamente com o momento atual, permitindo edição eventual. O registro deve permitir informar os valores sistólico e diastólico utilizando entrada numérica otimizada para dispositivos móveis. A tela inicial da aplicação deve priorizar visualização dos dados mais relevantes. Ao acessar o sistema, o usuário deve visualizar imediatamente a evolução histórica de seus registros. A especificação deve definir a melhor forma de alternar entre visualizações de peso e pressão arterial, mantendo simplicidade, clareza e excelente experiência de uso. A solução deve incluir visualização gráfica da evolução temporal dos registros, permitindo acompanhamento fácil de tendências e mudanças ao longo do tempo. A especificação deve prever uma área de gerenciamento de registros onde seja possível consultar, editar e excluir medições previamente cadastradas. Esta funcionalidade possui prioridade secundária em relação à experiência de captura e visualização rápida dos dados. A experiência móvel deve ser considerada o principal cenário de uso. O usuário deve ser capaz de registrar peso ou pressão arterial em poucos segundos utilizando apenas uma mão e com mínima necessidade de navegação. A especificação deve definir entidades, regras de negócio, validações, fluxos de usuário, experiência de navegação, comportamento responsivo, estratégias de visualização de dados e critérios de aceitação necessários para implementação completa da funcionalidade."

## Clarifications

### Session 2026-06-16

- **Q**: Como a interface deve se comportar na tela principal quando o usuário ainda não tiver nenhum registro de peso ou pressão arterial? → **A**: Renderizar o gráfico com eixos vazios (sem linhas) e um texto informativo "Sem dados cadastrados".
- **Q**: Como deve ser definido o período de tempo (escala do eixo X) exibido no gráfico da tela principal? → **A**: Disponibilizar botões de seleção rápida ("7D", "30D" e "Tudo"), com "Tudo" selecionado por padrão.
- **Q**: Onde situar a lista de registros antigos e suas ações de edição/exclusão na arquitetura da interface? → **A**: Criar uma página/tela inteiramente separada e dedicada ao histórico de registros, acessada através de um menu de navegação.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Registro Rápido de Peso Corporal (Priority: P1)

Como usuário ativo que acompanha sua saúde, eu quero registrar meu peso corporal atual com o mínimo de cliques e de forma ergonômica usando apenas uma mão no meu dispositivo móvel, para manter meu histórico atualizado sem atrito.

**Why this priority**: A captura frequente de peso com o menor atrito possível é o núcleo de valor deste recurso. Reduzir as interações diárias garante consistência no acompanhamento.

**Independent Test**: Pode ser totalmente testado de forma independente adicionando uma medição de peso (ex: 80,4 ou 80.4) a partir do atalho da tela inicial. O sistema deve salvar o registro com o timestamp correto e exibi-lo no gráfico e na listagem sem necessitar de outros fluxos.

**Acceptance Scenarios**:

1. **Given** que o usuário está na tela inicial da aplicação, **When** ele clica no botão de ação rápida "Adicionar Peso" posicionado de forma acessível para o polegar, **Then** um formulário em tela cheia simplificada (ou bottom sheet) é aberto imediatamente focando o campo de entrada numérica de peso e acionando o teclado numérico com separador decimal.
2. **Given** o formulário de entrada de peso aberto, **When** o usuário digita "78,5" ou "78.5" (aceitando tanto ponto quanto vírgula) e clica no botão "Salvar" (ou pressiona Enter no teclado), **Then** o sistema valida o valor, salva-o internamente convertido em ponto flutuante (`78.5`), preenche a data e hora com o momento atual, fecha o formulário e exibe uma notificação rápida de sucesso.
3. **Given** o formulário de entrada de peso aberto, **When** o usuário clica no campo de data/hora (que está preenchido com a data/hora atual), **Then** o sistema abre o seletor nativo de data e hora para permitir retroagir ou alterar o momento do registro.

---

### User Story 2 - Registro Rápido de Pressão Arterial (Priority: P1)

Como usuário hipertenso ou em acompanhamento preventivo, eu quero registrar minhas pressões sistólica e diastólica rapidamente a partir da tela principal, para monitorar minhas variações cardiovasculares diárias com facilidade.

**Why this priority**: O monitoramento de pressão arterial exige inserções frequentes (geralmente pela manhã e noite). A simplicidade e velocidade na digitação desses dois valores correlacionados são cruciais para a usabilidade.

**Independent Test**: Pode ser testado registrando uma leitura de pressão arterial (ex: 120 por 80 mmHg) através do atalho rápido, assegurando que o par de valores seja salvo com o timestamp atual e renderizado no gráfico correspondente.

**Acceptance Scenarios**:

1. **Given** que o usuário está na tela principal, **When** ele clica no botão de ação rápida "Adicionar Pressão", **Then** abre-se o formulário focado no campo de pressão Sistólica (SYS) com o teclado numérico ativado.
2. **Given** o campo Sistólica preenchido, **When** o usuário pressiona "Avançar" ou clica no campo Diastólica (DIA), **Then** o foco vai imediatamente para o campo Diastólica com o teclado numérico mantido ativo.
3. **Given** os campos de pressão preenchidos com "128" (Sistólica) e "84" (Diastólica), **When** o usuário clica em "Salvar", **Then** os dados são registrados no momento atual, o formulário fecha e a listagem histórica reflete o novo registro.

---

### User Story 3 - Visualização Histórica e Tendências Visuais (Priority: P1)

Como usuário em processo de melhoria de hábitos, eu quero visualizar imediatamente a evolução e as tendências de peso e pressão arterial por meio de um gráfico intuitivo e de um seletor simples na tela principal, para entender meu progresso de saúde num piscar de olhos.

**Why this priority**: A visualização de dados imediata ao abrir o aplicativo fornece feedback visual motivador e contexto clínico rápido, completando o ciclo de captura e análise.

**Independent Test**: Carregar a aplicação com um conjunto pré-existente de registros históricos e alternar entre as visualizações de peso e pressão arterial, verificando que o gráfico e as estatísticas básicas (ex: média, máximo, mínimo) atualizam-se instantaneamente.

**Acceptance Scenarios**:

1. **Given** que o usuário acessa o VITA, **When** a tela principal é carregada, **Then** ele visualiza imediatamente o painel com o gráfico de linha temporal e o resumo da última medição da métrica selecionada por padrão (Peso).
2. **Given** o painel de visualização principal, **When** o usuário clica no controle de alternância (segment control/tabs) de "Peso" para "Pressão Arterial", **Then** a interface atualiza de forma fluida sem recarregar a página, renderizando o gráfico temporal da pressão arterial (mostrando linhas de pressão sistólica e diastólica simultâneas) e os dados da última aferição de pressão.

---

### User Story 4 - Gerenciamento de Histórico (Priority: P2)

Como usuário cuidadoso, eu quero ver meus registros antigos organizados em uma lista cronológica, podendo editar valores ou excluir medições erradas, para manter a precisão do meu histórico de saúde.

**Why this priority**: Embora secundário em relação à captura diária rápida, o gerenciamento de dados é essencial para permitir correções de erros de digitação e auditoria de registros passados.

**Independent Test**: A partir da área de gerenciamento, selecionar um registro de peso ou pressão específico, atualizar seu valor e salvar, depois selecionar outro registro e excluí-lo, garantindo que o banco de dados e os gráficos reflitam essas modificações.

**Acceptance Scenarios**:

1. **Given** que o usuário acessa a área de gerenciamento de registros, **When** a lista é exibida, **Then** as medições são mostradas em ordem cronológica decrescente (mais recentes primeiro), separadas por abas ou agrupadas de forma clara por Peso e Pressão.
2. **Given** a lista de registros de peso, **When** o usuário clica em "Editar" em um item, **Then** ele é direcionado a um formulário contendo o valor e a data do registro preenchidos, permitindo alteração e salvamento.
3. **Given** um item da lista, **When** o usuário clica em "Excluir", **Then** o sistema solicita uma confirmação simples de exclusão antes de remover o registro permanentemente.

### Edge Cases

- **Entradas com múltiplos separadores ou caracteres inválidos**: Se o usuário colar ou digitar entradas malformadas (ex: `82.,5` ou `12O` usando a letra O no lugar de zero), o validador de input do frontend deve limpar caracteres não numéricos dinamicamente e impedir o envio, marcando o campo com feedback visual de erro.
- **Valores biologicamente implausíveis ou extremos**: Caso o usuário insira pesos extremos (ex: `< 20 kg` ou `> 350 kg`) ou pressões arteriais implausíveis (ex: sistólica `< 40` ou `> 300`), o sistema deve exibir um aviso de confirmação na tela ("Este valor está fora dos limites normais. Tem certeza de que deseja salvar?"), prevenindo erros grosseiros de digitação sem bloquear dados médicos atípicos reais.
- **Falta de conexão no envio**: Como a aplicação opera online-first (Princípio IV), se houver falha de rede ao tentar registrar uma medição, o sistema deve exibir um alerta amigável de erro informando a falha de conexão e manter o formulário preenchido para que o usuário tente novamente, em vez de descartar os dados inseridos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST disponibilizar dois botões de ação rápida de destaque na tela principal (dashboard) estrategicamente posicionados na área inferior de fácil alcance do polegar ("Adicionar Peso" e "Adicionar Pressão") para início imediato dos fluxos de captura.
- **FR-002**: O formulário de registro de peso MUST conter um único campo numérico de texto configurado com `inputmode="decimal"` e `pattern="[0-9.,]*"`, forçando a abertura do teclado numérico com ponto/vírgula em dispositivos iOS e Android.
- **FR-003**: O sistema MUST aceitar ponto (`.`) ou vírgula (`,`) como separador decimal no registro de peso, convertendo internamente a entrada em tipo float antes de salvar.
- **FR-004**: O formulário de registro de pressão arterial MUST conter dois campos de entrada separados por rótulos claros para Sistólica (SYS) e Diastólica (DIA) configurados com `inputmode="numeric"`, permitindo navegação direta ("Avançar" ou "Tab") do campo SYS para o DIA.
- **FR-005**: Ao abrir qualquer formulário de registro (peso ou pressão), o campo de data e hora MUST ser automaticamente preenchido com a data/hora local atual, exibindo o valor em formato amigável mas permitindo que o usuário clique para editar usando o date-time picker nativo.
- **FR-006**: A tela inicial MUST exibir um controle de alternância simples e de alta visibilidade (segment control ou abas lado a lado) para selecionar a métrica ativa (Peso ou Pressão Arterial).
- **FR-007**: A tela inicial MUST exibir um gráfico de linha temporal para a métrica selecionada, acompanhado de botões de seleção rápida para o período ("7D", "30D" e "Tudo"), com a opção "Tudo" ativa por padrão. O eixo X do gráfico MUST ajustar-se de acordo com o filtro selecionado. O gráfico de pressão arterial deve exibir as duas linhas (sistólica e diastólica) no mesmo plano temporal. Caso não haja dados cadastrados para a métrica ativa, o gráfico MUST ser renderizado com eixos vazios (sem linhas) e exibir um texto informativo centralizado: "Sem dados cadastrados".
- **FR-008**: O sistema MUST disponibilizar uma tela dedicada separada de histórico (gerenciamento), acessada por meio de um menu de navegação principal da aplicação, contendo a listagem cronológica decrescente de todos os registros e opções para editar e excluir individualmente cada item.
- **FR-009**: O backend MUST validar rigorosamente os dados recebidos: o peso deve ser um número positivo entre 20 e 350; a pressão sistólica deve ser um inteiro entre 40 e 300, e a diastólica um inteiro entre 30 e 200.
- **FR-010**: Em conformidade com o **Princípio VII (Testes Orientados a Risco)** da Constituição do VITA, o sistema MUST possuir testes unitários e de integração cobrindo:
  - O algoritmo de parsing de decimal (ponto vs vírgula) para peso.
  - As regras de validação de limites saudáveis/biológicos dos inputs de peso e pressão no backend.
  - A lógica de ordenação cronológica e agregação de dados utilizada para plotagem do gráfico temporal.

### Key Entities

- **WeightLog** (Registro de Peso):
  - Representa uma medição de peso feita pelo usuário.
  - Atributos obrigatórios:
    - `id` (UUIDv4): Identificador único do registro.
    - `userId` (String): Identificador do usuário proprietário dos dados (obtido via autenticação).
    - `weight` (Decimal com precisão de 1 casa decimal): O peso medido em kg.
    - `loggedAt` (DateTime com fuso horário): O momento em que o registro foi realizado ou definido pelo usuário.
    - `createdAt` (DateTime): Timestamp de auditoria interna da inserção física no banco de dados.

- **BloodPressureLog** (Registro de Pressão Arterial):
  - Representa uma aferição de pressão sistólica e diastólica.
  - Atributos obrigatórios:
    - `id` (UUIDv4): Identificador único do registro.
    - `userId` (String): Identificador do usuário associado.
    - `systolic` (Integer): Pressão sistólica medida em mmHg.
    - `diastolic` (Integer): Pressão diastólica medida em mmHg.
    - `loggedAt` (DateTime com fuso horário): O momento do registro ou definido pelo usuário.
    - `createdAt` (DateTime): Timestamp interno de criação.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O tempo necessário para um usuário registrar uma nova medição de peso (desde o clique no atalho da home até a exibição da mensagem de sucesso) não deve exceder 5 segundos em uso contínuo de uma única mão em dispositivo móvel.
- **SC-002**: O sistema deve aceitar e salvar corretamente entradas de peso digitadas tanto no formato com ponto (ex: `80.5`) quanto com vírgula (ex: `80,5`) em 100% das inserções válidas, sem gerar discrepâncias no banco de dados.
- **SC-003**: A alternância entre a visualização de gráficos de Peso e Pressão Arterial na tela principal deve ser renderizada na tela em menos de 150ms a partir do clique no controle de abas.
- **SC-004**: O gráfico de tendência temporal deve se ajustar de forma totalmente responsiva, apresentando legibilidade e área de toque adequadas em resoluções de tela a partir de 320px de largura física até monitores desktop.

## Assumptions

- A plataforma segue a arquitetura estabelecida no **Princípio IV**: Frontend SPA React com TypeScript e Tailwind CSS empacotado como PWA, e Backend Node.js/Express.
- Os dados serão armazenados de forma segura e restrita no banco de dados existente do VITA, atrelados ao usuário autenticado pelo Google OAuth (**Princípio III**).
- A unidade padrão de medida de peso adotada será o Quilograma (kg) e para pressão arterial será o milímetro de mercúrio (mmHg), sem necessidade de conversão de unidades nesta versão da funcionalidade.
- A aplicação possui conexão de rede ativa no momento da inserção (online-first), não sendo necessário implementar complexidade de sincronização robusta offline-first nesta especificação.
- Conforme o **Princípio I (Observabilidade de Saúde, Não Aconselhamento Médico)**, o gráfico e os sumários estatísticos mostram apenas as informações brutas inseridas e médias históricas, sem emitir mensagens como "Sua pressão está alta, consulte um médico" ou "Classificação: Hipertensão Estágio 1". O sistema se limita a plotar e agrupar os números de forma descritiva.
