# Phase 0 — Research: Ajustes de UI

Decisões de pesquisa para resolver pontos técnicos da feature. Nenhum item ficou como
"NEEDS CLARIFICATION" após esta fase.

## 1. Ícone PWA (temática de saúde)

- **Decision**: Gerar um conjunto de ícones estáticos (`favicon.ico`, `icon-192.png`,
  `icon-512.png`, `icon-512-maskable.png`, `apple-touch-icon.png` 180×180) em
  `apps/web/public/`, com um símbolo simples de saúde (ex.: coração/pulso ou balança
  estilizada) usando a cor primária do design system sobre fundo definido. Declarar `icons`
  no `manifest` do `VitePWA` (vite.config.ts) e adicionar `<link rel="icon">` +
  `<link rel="apple-touch-icon">` no `index.html`.
- **Rationale**: O `vite-plugin-pwa` já está configurado e gera o service worker/manifest;
  faltam apenas os assets e a declaração `icons`. iOS não usa o manifest para o ícone da
  tela inicial — exige `apple-touch-icon` no HTML; por isso ambos são necessários. Versão
  `maskable` garante recorte correto no Android.
- **Alternatives considered**:
  - `@vite-pwa/assets-generator` para gerar todos os tamanhos a partir de um SVG — bom, mas
    adiciona dependência/ferramenta de build; para um único ícone, geração manual é suficiente
    (Princípio V). Pode ser adotado depois se o conjunto crescer.
  - Apenas favicon — insuficiente: não resolve o ícone da tela inicial no celular (objetivo P1).

## 2. Tooltip e eixos no gráfico (sem nova biblioteca)

- **Decision**: Manter o `TrendChart` como SVG manual. Adicionar:
  - **Tooltip**: estado de "ponto ativo" (índice) atualizado por `onMouseEnter`/`onMouseLeave`
    nos círculos (desktop) e por `onClick`/`onTouchStart` (mobile); renderizar um pequeno
    rótulo SVG/HTML posicionado próximo ao ponto, exibindo valor + data, com clamp para
    permanecer dentro da área visível.
  - **Eixo X** (decidido em clarificação): gerar entre **3 e 6 ticks de data** distribuídos
    uniformemente no intervalo, **independentemente da quantidade de pontos**, com `textAnchor`
    ajustado nas bordas para evitar corte; formato de data conforme o período (dia/mês para
    7D/30D; incluir mês/ano quando "Tudo" cobrir intervalos longos). Critério objetivo e
    testável (FR-016), evitando sobreposição em qualquer período.
  - **Eixo Y**: manter linhas de grade, acrescentar unidade (kg/mmHg) ao rótulo do topo ou
    como rótulo de eixo.
- **Rationale**: Evita dependência nova (Princípio V/VI); o SVG atual já calcula coordenadas,
  então tooltip e ticks são incrementos pequenos. Mantém controle total sobre estilo/tema.
- **Alternatives considered**:
  - `recharts`/`visx`/`chart.js` — entregam tooltip/eixos prontos, mas adicionam dependência
    significativa e reescrita do componente; desproporcional para um gráfico simples já
    funcional. Rejeitado por anti-overengineering.

## 3. Posicionamento do modal com teclado numérico aberto (mobile)

- **Decision**: No mobile, ancorar o `DialogContent` ao topo (ex.: `top-4`/alinhamento ao
  topo via classes responsivas) em vez de centralizado, mantendo o centramento no desktop
  (`sm:` reposiciona ao centro). Implementar como ajuste de classes no `ui/dialog.tsx`
  (ou via `className` nos modais de captura) — sem depender de detecção de teclado.
- **Rationale**: Detectar a abertura do teclado de forma confiável entre navegadores é frágil
  (sem API padrão estável; `visualViewport` ajuda mas varia). Ancorar ao topo no mobile
  resolve o problema de visibilidade de "Alterar data"/Cancelar/Salvar de forma simples e
  determinística, já que o teclado ocupa a parte inferior. Opcionalmente, `interactive-widget=
resizes-content` no viewport e/ou ajuste com `visualViewport` podem refinar, mas não são
  obrigatórios.
- **Alternatives considered**:
  - Detectar altura do teclado via `visualViewport` e reposicionar dinamicamente — mais
    complexo e sujeito a inconsistências; mantido como refinamento opcional, não como base.
  - Reduzir a altura do modal/scroll interno — não garante que os botões fiquem acima do
    teclado. Rejeitado.

## 4. Menu mobile expansível (três tracinhos)

- **Decision**: `BottomNav` exibe "Início" + um botão "Menu" (ícone `Menu` do lucide) que abre
  um `Sheet` (Radix, já instalado) ancorado na base, listando as opções secundárias (Admin —
  condicional ao papel admin —, Histórico, Perfil), estrutura iterável a partir de uma lista de
  itens para acomodar telas futuras. Selecionar um item navega e fecha o sheet.
- **Rationale**: `Sheet` já existe no projeto; padrão mobile consagrado; lista orientada a dados
  facilita extensão futura (FR-021).
- **Alternatives considered**:
  - `dropdown-menu` ancorado no botão — funciona, mas `Sheet` na base é mais ergonômico no
    mobile e comporta mais itens. Ambos aceitáveis; `Sheet` preferido.

## 5. Sobreposição da barra inferior sobre os botões de Adicionar

- **Decision**: Ajustar z-index/empilhamento e espaçamento: os botões flutuantes de Adicionar
  ficam acima da `BottomNav` (ex.: posicioná-los imediatamente acima da barra com
  `bottom`/padding considerando a altura da nav, e garantir `z-index` superior ao da barra),
  e adicionar padding inferior ao conteúdo para que nada fique sob a barra.
- **Rationale**: Resolve FR-022 (toque sem sobreposição) com CSS/layout, sem novos componentes.
- **Alternatives considered**: mover os botões para dentro do fluxo (não flutuante) — mudaria o
  padrão de ação principal; rejeitado para preservar a UX de captura rápida.

## 6. Persistência e modelo de Perfil

- **Decision**: Nova tabela `user_profiles` (1 linha por `user_email`, único), com `full_name`
  (text, nullable), `birth_date` (date, nullable), `height_cm` (real/integer, nullable). Módulo
  `apps/api/src/profile/` espelhando `health_metrics`: `GET /api/profile` (retorna o perfil do
  usuário autenticado ou vazio) e `PUT /api/profile` (upsert). Schema Zod `profileInputSchema`
  em `@vita/shared`. Endpoints sob `requireAuth`, filtrando por `req.user.email`.
- **Rationale**: Consistente com o padrão existente e com a constituição (dados do dono, sob
  auth). `PUT` idempotente com upsert simplifica o cliente (sem distinção create/update).
- **Alternatives considered**:
  - Persistência só no `localStorage` — não atende "persistir entre sessões/dispositivos" de
    forma confiável e foge do modelo de dados do produto. Rejeitado (ver Assumptions da spec).
  - `POST` + `PUT` separados — desnecessário para um recurso singleton por usuário.

## 7. Validação de Perfil

- **Decision**: No `profileInputSchema` (Zod): `fullName` string opcional (trim, máx. ~120),
  `birthDate` opcional como `YYYY-MM-DD`, não no futuro e dentro de faixa plausível (ex.: ano
  > = 1900); `heightCm` opcional, número plausível (ex.: 50–250 cm). Todos opcionais (FR-014).
  > Mensagens em português, no padrão dos schemas existentes.
- **Rationale**: Reflete FR-012/FR-014; reaproveita o estilo de validação de `health.ts`.
- **Alternatives considered**: tornar campos obrigatórios — contraria a decisão de permitir
  salvamento parcial no primeiro acesso. Rejeitado.

## 8. Acessibilidade básica (FR-027–031, decidido em clarificação)

- **Decision**: Adotar um conjunto **básico e pragmático** de a11y sobre os novos elementos,
  usando primitivos já disponíveis:
  - **Nomes acessíveis**: `aria-label` no botão de menu mobile (três tracinhos) e nos controles
    de interação do gráfico; `Sheet`/`Dialog` do Radix já fornecem semântica de diálogo/rótulo.
  - **Teclado e foco**: `Sheet` e `Dialog` (Radix) já implementam focus trap, foco inicial,
    retorno de foco ao fechar e `Esc`; a tela de Perfil usa `<form>` com inputs/labels nativos
    navegáveis por teclado. Garantir ordem de foco lógica nos itens do menu.
  - **Alvo de toque ≥44×44px**: aplicar nas áreas clicáveis da `BottomNav` e dos FABs de
    Adicionar (já existe `min-h-[44px]`/`min-w-[44px]` em parte da nav — estender aos FABs).
  - **Não depender só de cor / só de hover**: o gráfico mantém legenda textual (sistólica/
    diastólica) além da cor; o valor do ponto fica acessível por toque/teclado (não apenas
    hover), com texto associado para leitura.
- **Rationale**: Para uma plataforma pessoal de usuário único, a a11y básica entrega o maior
  valor com custo mínimo, reaproveitando comportamento dos componentes Radix (Princípio V).
- **Alternatives considered**:
  - **WCAG 2.1 AA formal completo** (auditoria de contraste, testes com leitores de tela) —
    fora de escopo nesta feature (FR-031); maior custo sem benefício proporcional para um único
    usuário. Pode ser adotado depois.
  - **Nenhuma a11y** — rejeitado: o menu/modais/gráfico novos ficariam difíceis de operar por
    teclado e ambíguos para nomes acessíveis.

## Itens fora de escopo (confirmados)

- Cálculo de IMC, calorias ou qualquer derivação — fora desta feature (Princípio I).
- Recursos offline/sincronização além do já existente — fora de escopo (Princípio IV).
- Edição de avatar/foto de perfil — não solicitado.
