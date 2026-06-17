# Feature Specification: Rich Charts & Datetime Input Mask Fix

**Feature Branch**: `008-rich-charts-and-datetime-mask-fix`

**Created**: 2026-06-17

**Status**: Draft

**Input**: User description: "Eu acho que deveriamos estudar e considerar uma biblioteca rica de graficos. Eu gosto das cores e estilo dos graficos atuais, eles são bonitos, mas eu acho que ainda estamos tendo ligeiros probleminhas com os graficos, como por exemplo os ticks do eixo x estarem sobrepondo, etc. Eu acho que se escolhermos um biblioteca rica, boa, bem mantida, etc, com estrelas, com atualização, com comunidade, como manda o constitution, teremos graficos ricos com qualidade melhor e com todos esses pequenos probleminhas de visualização já sanados. Então esse seria o ideal. Outra coisa que seria interessante, é nos graficos termos uma feature de um pequeno botão para exibir o grafico em tela cheia. E ai ele ficaria em tela cheia e teria um botaozinha para sair da tela cheia. No celular, quando ele ficar em tela cheia, ele deveria mudar para exibição del celular na horizontal automaticamente, se for possivel, porque assim que ficará melhor para ver em tela cheia. Outro pequeno ajuste que quero fazer é o seguinte, nos botoes de adicionar peso ou pressão, quando seleciono para alterar data, ele abre o campo para eu digitar a data (testei isso pelo computador), e ai se vou digitando, ele vai trocando de acordo com a mascara... se digito 12062026 ele monta 12/06/2026, o que é o comportamento certo, mas tem algum problema na mascara que se continuo digitando ele nao começa a alterar a hora, ele continua no ano... por exemplo, se digito 120620260130 ele ele faz 12/06/202601 03:00, o que é um pequeno bug, que precisa ser testado e corrigido no front."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Visualização de Gráficos de Alta Qualidade e Sem Sobreposições (Priority: P1)

Como um usuário acompanhando minhas métricas de saúde, quero visualizar gráficos de peso e pressão arterial que se adaptem perfeitamente ao tamanho da tela e cujos rótulos e marcadores nos eixos nunca se sobreponham, para que eu possa ler as informações com clareza.

**Why this priority**: A legibilidade dos gráficos é o núcleo da observabilidade de saúde no VITA (Princípio I da Constituição). Rótulos sobrepostos ou ilegíveis prejudicam diretamente essa experiência.

**Independent Test**: Pode ser testado populando o banco com múltiplos registros (ex: 7 a 30 pontos) e redimensionando a janela do navegador em diferentes larguras, confirmando que os ticks do eixo X e Y permanecem legíveis e sem sobreposições.

**Acceptance Scenarios**:

1. **Given** que possuo registros de peso cadastrados no sistema, **When** acesso a tela principal, **Then** o gráfico de evolução de peso renderiza com linhas suaves, exibindo os ticks de data de forma espaçada, dinâmica e perfeitamente legíveis.
2. **Given** que possuo registros de pressão arterial cadastrados no sistema, **When** visualizo o gráfico de pressão, **Then** as curvas sistólica e diastólica são exibidas com cores correspondentes distintas, sem sobreposição dos textos dos eixos.

---

### User Story 2 - Gráfico em Tela Cheia com Orientação Paisagem no Celular (Priority: P2)

Como um usuário analisando tendências de longo prazo ou detalhes minuciosos, quero poder expandir qualquer gráfico para tela cheia e, caso esteja no celular, que a orientação mude automaticamente para horizontal (paisagem) para aproveitar melhor o espaço lateral.

**Why this priority**: Melhora significativamente a experiência de visualização de dados detalhados em dispositivos móveis, onde o espaço vertical é limitado.

**Independent Test**: Clicar no botão de tela cheia no gráfico e verificar que ele ocupa a viewport inteira, exibindo um botão visível de fechar. Em um dispositivo móvel compatível, verificar se a orientação é solicitada para paisagem ao entrar, e restaurada ao sair.

**Acceptance Scenarios**:

1. **Given** que visualizo um gráfico na Home, **When** clico no botão "Tela Cheia", **Then** o gráfico expande ocupando 100% da largura e altura da tela, ocultando a barra de navegação principal e mostrando um botão destacado para fechar.
2. **Given** um celular compatível com a API de Orientação de Tela (Screen Orientation API), **When** o gráfico entra em tela cheia, **Then** a aplicação solicita a mudança da orientação do dispositivo para horizontal (`landscape`).
3. **Given** um gráfico em tela cheia, **When** clico no botão de fechar ou pressiono a tecla `Escape`, **Then** o gráfico retorna ao layout original na página e a orientação original da tela é restaurada.

---

### User Story 3 - Digitação Fluida na Máscara de Entrada Retroativa (Priority: P1)

Como um usuário registrando dados retroativos de peso ou pressão, quero poder digitar uma sequência contínua de números (como `120620260130`) no campo de data/hora e ter a formatação aplicada automaticamente como `12/06/2026 01:30`, sem que o ano estoure ou que eu precise clicar ou usar setas para pular de segmento.

**Why this priority**: Corrige um bug crítico de usabilidade de entrada de dados retroativos no computador e celular, simplificando o processo de cadastro histórico.

**Independent Test**: No modal de captura de peso ou pressão arterial com "registro retroativo" ativo, focar o campo de data e digitar continuamente `120620260130`. Validar se o campo exibe exatamente `12/06/2026 01:30` e se a data enviada no payload é válida.

**Acceptance Scenarios**:

1. **Given** o formulário de registro com data retroativa ativado, **When** eu digito continuamente uma sequência de 12 dígitos, **Then** o valor é formatado automaticamente como `DD/MM/AAAA HH:MM`, impedindo o estouro do ano e direcionando os últimos dígitos ao segmento de hora e minuto.
2. **Given** o campo formatado de data/hora, **When** insiro valores de data inválidos (ex: dia 31 de fevereiro ou hora 25:00), **Then** a interface impede a submissão e exibe um alerta de validação amigável.

---

### Edge Cases

- **Incompatibilidade da API de Orientação**: Em navegadores/dispositivos que não suportam bloqueio de orientação de tela (ex: Safari no iOS), o sistema deve falhar silenciosamente, mantendo o gráfico em tela cheia no modo de orientação retrato atual, mas adaptado de forma responsiva.
- **Poucos dados no Gráfico**: Gráficos com 1 ou nenhum ponto não devem exibir linhas ou quebrar a renderização da biblioteca de gráficos. Devem exibir um estado vazio formatado adequadamente.
- **Teclados mobile no campo de data/hora**: Em telas touch, o campo com máscara deve exibir o teclado numérico adequado (`inputmode="numeric"` ou similar) para facilitar a digitação da data contínua.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O sistema DEVE adotar uma biblioteca rica de gráficos externa que seja amplamente utilizada pela comunidade, compatível com React e TypeScript, e que siga o Princípio VI da Constituição (dependências sustentáveis).
- **FR-002**: A biblioteca de gráficos DEVE se integrar com as cores do tema base do VITA através das variáveis CSS padrão do Tailwind (`--primary`, `--destructive`, `--info`, `--muted-foreground`).
- **FR-003**: Os eixos do gráfico (X e Y) DEVEM calcular de forma dinâmica e automática a distribuição dos ticks para evitar sobreposição textual, limitando o número de labels ou rotacionando-as caso necessário.
- **FR-004**: Cada gráfico DEVE conter um botão/ícone no canto superior direito para alternar para o modo "Tela Cheia" (Fullscreen).
- **FR-005**: O modo "Tela Cheia" DEVE renderizar o gráfico com dimensões de 100vw e 100vh usando uma camada superior (overlay ou API nativa de fullscreen do navegador).
- **FR-006**: Ao entrar em tela cheia em dispositivos móveis compatíveis, o sistema DEVE tentar bloquear a orientação da tela para `landscape` utilizando a Screen Orientation API. Ao sair, deve restaurar a orientação padrão.
- **FR-007**: Os modais de captura de Peso ([WeightCaptureModal.tsx](file:///c:/projects/vita/apps/web/src/components/WeightCaptureModal.tsx)) e Pressão ([BPCaptureModal.tsx](file:///c:/projects/vita/apps/web/src/components/BPCaptureModal.tsx)), assim como a edição no histórico, DEVEM ter o input de data retroativa atualizado para usar uma máscara de formatação de entrada fluida de 12 dígitos.
- **FR-008**: A máscara de data/hora DEVE formatar a digitação contínua de números no padrão `DD/MM/AAAA HH:MM` (ex: `120620260130` vira `12/06/2026 01:30`) e impedir que o segmento do ano cresça além de 4 dígitos.
- **FR-009**: O formulário DEVE validar as datas digitadas no lado do cliente antes do envio, gerando erro em caso de datas inexistentes ou futuras.
- **FR-010**: Todos os gráficos e dados exibidos DEVEM ser representados como observação pessoal, sem emitir diagnósticos clínicos, mantendo conformidade estrita com o Princípio I da Constituição.
- **FR-011**: O código correspondente às lógicas de formatação de máscara, validação de data retroativa e prevenção de sobreposição de eixos DEVE possuir cobertura por testes automatizados (Princípio VII).

### Key Entities _(include if feature involves data)_

Este recurso não altera o esquema do banco de dados, mas manipula diretamente as seguintes entidades de dados existentes:

- **Weight Log**: Contém o peso (kg) e a data de registro (`loggedAt`).
- **Blood Pressure Log**: Contém a pressão sistólica/diastólica (mmHg) e a data de registro (`loggedAt`).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Ocorrência de sobreposição de ticks de eixos nos gráficos reduzida a 0% em resoluções de 320px de largura a 4K.
- **SC-002**: Tempo de transição para o modo tela cheia e rotação de tela inferior a 500ms.
- **SC-003**: 100% de sucesso de digitação contínua de data/hora no formato `120620260130` sem estouro do ano e parseada com precisão.
- **SC-004**: Garantia de 0 diagnósticos clínicos automáticos exibidos em relatórios e telas do sistema.

## Assumptions

- O navegador do usuário oferece suporte à Screen Orientation API para rotação via JS, caso contrário falhará de forma limpa.
- O estilo do gráfico (linhas e gradientes) usará a paleta Tailwind configurada no VITA para consistência visual.
- A máscara de data resolverá os problemas de usabilidade decorrentes do comportamento nativo do navegador para `<input type="datetime-local">` em desktops.
