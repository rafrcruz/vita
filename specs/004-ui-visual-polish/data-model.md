# Phase 1 — Modelo Visual: Tokens, Escalas, Estados e Inventário

**Feature**: `004-ui-visual-polish` | **Date**: 2026-06-17

Esta iniciativa **não introduz dados persistidos** nem entidades de domínio. O "modelo" aqui é o
vocabulário visual: as escalas de tokens refinadas, a matriz de estados e o inventário de
componentes a polir. Tudo deriva do que já existe na feature 002 (`index.css`,
`tailwind.config.ts`); o objetivo é uniformizar uso e fechar lacunas, não recriar.

## 1. Tokens de cor (mantidos; ajustes apenas para coesão/contraste)

A paleta atual (HSL em `index.css`) é preservada. Regra de polimento:

- **Única fonte**: nenhuma cor pode ser cravada em telas/componentes (proibidos `text-red-500`,
  `border-gray-300`, hex/rgb avulsos). Tudo via tokens: `background`, `foreground`, `card`,
  `popover`, `primary`, `secondary`, `muted`, `accent`, `border`, `input`, `ring`, e semânticas
  `destructive`, `success`, `warning`, `info` (cada uma com `-foreground`).
- **Estados semânticos**: ícones/realces de erro usam `destructive`; sucesso/aviso/info usam seus
  tokens. (Corrige A5: `text-red-500` → `text-destructive`.)
- **Ajuste fino permitido**: pequenos ajustes de luminância em `--muted-foreground`,
  `--border` e nas semânticas se a auditoria de contraste acusar < AA em algum tema — preservando a
  identidade índigo/violeta.

## 2. Escala de raios (formalizar uso)

| Token  | Valor                    | Uso                                         |
| ------ | ------------------------ | ------------------------------------------- |
| `sm`   | `calc(--radius - 4px)`   | elementos pequenos (badges internos, chips) |
| `md`   | `calc(--radius - 2px)`   | inputs, botões, itens de menu               |
| `lg`   | `var(--radius)` (0.5rem) | cartões, modais, contêineres                |
| `full` | `9999px`                 | apenas pills/avatars/indicadores circulares |

Regra: nenhum raio numérico ad hoc; `rounded-full` reservado a pills/circulares (corrige A8).

## 3. Escala de elevação (introduzir tokens nomeados)

Hoje só existe `shadow-sm` no Card e usos soltos (`shadow-none`, `shadow-2xl`). Definir uma escala
em `tailwind.config.ts` que comunique camadas:

| Nível | Token (proposto) | Camada                              | Exemplo de uso                       |
| ----- | ---------------- | ----------------------------------- | ------------------------------------ |
| 0     | (sem sombra)     | superfície base                     | fundo de página, linhas de tabela    |
| 1     | `shadow-sm`      | cartão em repouso                   | `Card`                               |
| 2     | `shadow-md`      | cartão elevado / hover              | hover de itens, summary card         |
| 3     | `shadow-lg`      | popover / dropdown / menu / tooltip | `dropdown-menu`, `select`, `tooltip` |
| 4     | `shadow-xl`      | modal / sheet / drawer / FAB        | `dialog`, `sheet`, FAB               |

Regra: cada componente usa o nível coerente com sua camada (corrige A2/A7). Valores discretos,
sutis nos dois temas.

## 4. Escala tipográfica (papéis explícitos)

Hoje `index.css` estiliza só `h1/h2/h3`; telas improvisam (`font-black`, `text-5xl`, `text-2xl`).
Definir papéis consistentes (tamanho / peso / line-height / tracking):

| Papel                        | Uso                               | Diretriz                                                                               |
| ---------------------------- | --------------------------------- | -------------------------------------------------------------------------------------- |
| Display                      | número de destaque (peso/pressão) | grande, `font-semibold`/`bold`, `tracking-tight` — idêntico em Home/History            |
| Título (h1)                  | título de página                  | consistente entre páginas (corrige A14)                                                |
| Subtítulo (h2/h3, CardTitle) | seções/cartões                    | `CardTitle` deixa de ser sempre `text-2xl`; tamanho coerente ao contexto (corrige A13) |
| Corpo                        | texto padrão                      | legível, line-height confortável                                                       |
| Legenda/auxiliar             | metadados, datas                  | `text-xs`/`text-sm` + `text-muted-foreground` consistente                              |
| Rótulo                       | labels de form, uppercase tags    | peso/tracking padronizados                                                             |

Regra: banir `font-black` arbitrário; usar os pesos da escala (corrige A6).

## 5. Escala de espaçamento e ritmo

- Padding/margens/gaps derivam da escala Tailwind padrão (múltiplos de 4px), aplicada com ritmo
  consistente entre telas (corrige A11).
- Espaçamento de página padronizado via `PageContainer`/wrapper de página, evitando ajustes pontuais
  como `pb-24` (que existe só para compensar o FAB — reavaliar junto com o FAB).
- Alinhamento e agrupamento por proximidade coerentes (FR-019).

## 6. Largura/aproveitamento por formato

| Formato   | Largura de referência     | Diretriz                                                                                                                    |
| --------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Mobile    | ~390px (e usável a 320px) | conteúdo full-width confortável; navegação por abas inferior (mantida)                                                      |
| Tablet    | ~768px                    | rail (mantido); conteúdo aproveita a largura                                                                                |
| Desktop   | 1920×1080                 | sidebar fixa (mantida); largura de leitura confortável                                                                      |
| Ultrawide | 3440×1440                 | aproveitar espaço (largura maior e/ou colunas em `3xl`/`4xl`), sem linhas longas demais nem vazios acidentais (corrige A12) |

Breakpoints já definidos: Tailwind padrão + `3xl: 1920px`, `4xl: 2560px`.

## 7. Matriz de estados visuais (aplicável a todo componente interativo)

| Estado                     | Tratamento padronizado                                                                                                       |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| default                    | tokens de superfície/texto do componente                                                                                     |
| hover                      | mudança discreta de cor/elevação, igual entre equivalentes                                                                   |
| focus(-visible)            | anel `ring` (token `--ring`) com offset, consistente; presente em **todos** os interativos (inclusive os antes feitos à mão) |
| active/press               | feedback sutil único (ex. leve escurecimento/translado), sem `scale` exagerado                                               |
| selected                   | destaque consistente (ex. `bg-primary`/realce) — ver nav e segment control                                                   |
| disabled                   | `opacity` reduzida + `cursor-not-allowed` + sem pointer events                                                               |
| loading                    | spinner/skeleton consistente; impede ação duplicada quando já é o comportamento atual                                        |
| error/success/warning/info | cores semânticas correspondentes em alerts/toasts/validação/badges                                                           |

Combinações (focus+hover, selected+disabled, loading+error) devem permanecer legíveis.

### §7.1 Tokens de movimento (transições/microinterações)

Para tornar FR-017/SC-008 verificáveis e padronizar a "suavidade discreta", definir tokens de
movimento em `tailwind.config.ts`:

| Token (proposto) | Valor                                | Uso                                                      |
| ---------------- | ------------------------------------ | -------------------------------------------------------- |
| duração rápida   | ~120 ms                              | hover/realce de cor, mudanças pequenas                   |
| duração padrão   | ~160 ms                              | transições gerais de estado                              |
| duração máxima   | ~200 ms                              | aberturas de popover/menu; **teto** para microinterações |
| easing padrão    | uma curva única (ex. ease-out suave) | todas as transições                                      |

Regra: microinterações ficam **dentro de 120–200 ms** com o easing padrão; nada de transições
longas/chamativas. Tudo é reduzido/desativado sob `prefers-reduced-motion` (regra global já em
`index.css`). As animações de entrada/saída do Radix (`tailwindcss-animate`) seguem o mesmo teto.

## 8. Inventário de componentes

### Presentes — a polir (sem mudar props/contratos)

- **UI** (`src/components/ui`): `button`, `input`, `textarea`, `select`, `checkbox`,
  `radio-group`, `switch`, `card`, `table`, `dialog`, `sheet`, `dropdown-menu`, `tooltip`,
  `badge`, `skeleton`, `spinner`, `label`, `form`.
- **Feedback** (`src/components/feedback`): `Alert`, `EmptyState`, `ErrorState`, `LoadingState`.
- **Layout** (`src/components/layout`): `AppShell`, `PageContainer`, `SidebarNav`, `NavRail`,
  `BottomNav`.
- **Domínio/telas**: `WeightCaptureModal`, `BPCaptureModal`, `TrendChart`, páginas `Login`, `Home`,
  `History`, `AdminAllowlist`, `StyleGuide`.

### Toasts (presente via `sonner`) — polir, não recriar

- O `<Toaster>` (`sonner`) vive em `src/App.tsx` (hoje com `richColors`, que usa a paleta própria do
  `sonner`). Polimento: alinhar sucesso/erro/info às **cores semânticas do design system** (tokens),
  sem trocar a biblioteca nem a API de `src/lib/toast.ts`. (Corrige o gap G1 da análise.)

### Ausentes — NÃO criar (fora de escopo)

- `Tabs`/segmented control público, `Drawer` separado (há `Sheet`), `Accordion`, `DatePicker`,
  `Calendar`, `AutoComplete`, `SearchField`, componente de `Toast` próprio (usa-se `sonner`).
- Onde a UI usa `datetime-local` nativo, mantém-se o controle nativo (apenas acabamento ao redor).

## 9. Invariantes (o que NÃO muda)

- Props, contratos e comportamento de todos os componentes; ordem de tabulação e semântica ARIA
  (apenas reforçadas, nunca reduzidas).
- Validações (faixas de peso 20–350 kg; sistólica 40–300; diastólica 30–200), parsing, timezone,
  ordenação, queries, mutations e `window.confirm()` de exclusão.
- Rotas, navegação, permissões (admin/allowlist), APIs, dados e `localStorage` de tema.
