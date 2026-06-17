# Contract — Polimento por Componente / Tela

**Feature**: `004-ui-visual-polish`

O que cada componente/tela deve receber de polimento e o que **não** pode mudar. Em todos os casos,
o contrato funcional (props, eventos, comportamento, ARIA) é **preservado** — apenas reforçado.

## Componentes de UI (`src/components/ui`)

| Componente | Polir | NÃO mudar |
|-----------|-------|-----------|
| `button` / `IconButton` | press/hover/focus consistentes; tokens de elevação onde aplicável; alvo ≥44px mantido | variantes/props, `loading`/`asChild`, semântica |
| `input` / `textarea` | placeholder com contraste legível; foco e disabled consistentes | tipo/atributos/validação |
| `select` / `dropdown-menu` / `tooltip` | elevação nível 3; hover de itens; raio/borda consistentes | comportamento Radix |
| `checkbox` / `radio-group` / `switch` | foco/checked/disabled consistentes via tokens | estado controlado |
| `card` | usar escala de elevação; raio `lg`; padding consistente | composição/exports |
| `table` | ritmo de linhas, divisórias por token, hover de linha consistente | estrutura/dados |
| `dialog` / `sheet` | elevação nível 4; raio; espaçamento interno; foco-trap mantido | comportamento/foco programático |
| `badge` / `skeleton` / `spinner` / `label` / `form` | cores semânticas via token; tamanhos consistentes | já tokenizados — ajustes mínimos |

## Feedback (`src/components/feedback`)

| Componente | Polir | NÃO mudar |
|-----------|-------|-----------|
| `Alert` | cores semânticas via token; ícone/tipografia consistentes (usado em Login/Admin/StyleGuide) | variantes |
| `EmptyState` | **passar a ser usado** onde hoje há `<div>` solto (History) | API |
| `ErrorState` / `LoadingState` | acabamento consistente (mensagem/ícone/skeleton) | mensagens funcionais/retry |
| Toasts (`sonner`) | alinhar cores de sucesso/erro/info aos tokens semânticos (rever `richColors` do `<Toaster>` em `App.tsx`) | biblioteca `sonner` e API de `lib/toast.ts` |

## Layout (`src/components/layout`)

| Componente | Polir | NÃO mudar |
|-----------|-------|-----------|
| `PageContainer` | largura/aproveitamento por formato (widescreen/ultrawide) preservando leitura | — |
| `AppShell` | ritmo/espaçamento; consistência do `pb` com o FAB revisado | estrutura de navegação por formato |
| `SidebarNav`/`NavRail`/`BottomNav` | estados selected/hover/focus consistentes | itens, rotas, comportamento ativo |

## Telas / domínio

| Arquivo | Polir | NÃO mudar |
|---------|-------|-----------|
| `Login.tsx` | espaçamento/tipografia (baixo esforço; já usa componentes) | fluxo Google, mensagens |
| `Home.tsx` | FAB manual → `Button`; `<button>` crus → `Button`/link estilizado; seletor de segmento padronizado; remover `font-black`/`shadow-2xl`; ritmo de espaçamento; `CardTitle` coerente | métricas, queries, timeframe, modais, navegação |
| `History.tsx` | usar `EmptyState`; `text-red-500` → `destructive`; seletor de segmento padronizado; tipografia/elevação dos cartões; ícones de ação consistentes | edição/exclusão (incl. `window.confirm`), ordenação, validações |
| `AdminAllowlist.tsx` | consistência de tabela/form/estados | regras de allowlist/permissões |
| `StyleGuide.tsx` | **atualizar** para refletir tokens/escalas/estados refinados | rota |
| `WeightCaptureModal.tsx` | checkbox nativo (`border-gray-300`) → `Checkbox`; unificar tokens do "hero input" preservando intenção visual | parsing/validação/foco/submit |
| `BPCaptureModal.tsx` | idem, consistente com Weight | parsing/validação/submit |
| `TrendChart.tsx` | usar tokens `chart-*`/semânticos; consistência nos 2 temas | dados/eixos/comportamento |

## Invariante global

Nenhuma alteração de API, dados, validações, rotas, permissões, integrações ou arquitetura. Toda a
mudança é de apresentação. Ver [`design-tokens.md`](./design-tokens.md) e
[`visual-states.md`](./visual-states.md).
