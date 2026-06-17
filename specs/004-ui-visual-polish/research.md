# Phase 0 — Research & Auditoria Visual: Polimento UI/UX

**Feature**: `004-ui-visual-polish` | **Date**: 2026-06-17

Esta fase audita o estado visual atual (código real em `apps/web`) e fixa as decisões que guiam o
polimento. Como a iniciativa é de UI/UX sobre uma base existente, não há "NEEDS CLARIFICATION"
técnicos a resolver; o foco é catalogar inconsistências concretas e decidir o tratamento de cada
uma sem alterar comportamento.

## Achados da auditoria (evidências no código)

| #   | Inconsistência                                                                                             | Onde (evidência)                                                      | Categoria                                 |
| --- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------- |
| A1  | Seletor de segmento (abas peso/pressão) reescrito inline e **duplicado**                                   | `Home.tsx:78-101`, `History.tsx:188-211` (classes idênticas copiadas) | Componentes / DRY                         |
| A2  | FAB construído à mão (`rounded-full`, `shadow-2xl`, `backdrop-blur`, `active:scale-95`) em vez de `Button` | `Home.tsx:195-212`                                                    | Componentes / elevação / estados          |
| A3  | `<button>` cru para "Sair" e links de ação no header                                                       | `Home.tsx:52-58, 69-72`                                               | Componentes / estados                     |
| A4  | Checkbox **nativo** com cor cravada `border-gray-300` em vez do componente `Checkbox`                      | `WeightCaptureModal.tsx:105-111` (e BP modal análogo)                 | Componentes / cor fora de token           |
| A5  | Cor cravada `text-red-500` no ícone de pressão (fora da paleta)                                            | `History.tsx:274`                                                     | Cor fora de token                         |
| A6  | Tipografia fora da escala: `text-5xl font-black`, `font-black` sem papel definido                          | `WeightCaptureModal.tsx:96`, `Home.tsx:144`, `History.tsx:231,277`    | Tipografia                                |
| A7  | Elevação inconsistente: `shadow-sm` (Card padrão) vs `shadow-none` vs `shadow-2xl`                         | `card.tsx:9`, `History.tsx:224,270`, `Home.tsx:196`                   | Sombras / elevação                        |
| A8  | Raios misturados sem escala intencional (`rounded`, `rounded-md`, `rounded-lg`, `rounded-full`)            | vários                                                                | Arredondamentos                           |
| A9  | Estado vazio com `<div>` solto em vez do componente `EmptyState` existente                                 | `History.tsx:221,267` (vs `feedback/EmptyState.tsx`)                  | Estados / componentes                     |
| A10 | Hovers/press ad hoc e desuniformes (`hover:bg-muted/10`, `hover:bg-muted`, `active:scale-95` esparso)      | `History.tsx:178,224,270`, `Home.tsx:199,206`                         | Estados visuais / microinterações         |
| A11 | Ritmo de espaçamento ad hoc (`mt-2/4/6`, `pb-24` para compensar o FAB)                                     | `Home.tsx:47,60,63,78,...`                                            | Layout / espaçamento                      |
| A12 | Largura fixa `max-w-4xl` para todas as telas → área vazia em widescreen/ultrawide                          | `PageContainer.tsx:10`                                                | Responsividade / aproveitamento de espaço |
| A13 | Uso inconsistente de `CardTitle` (sempre `text-2xl`) sobrescrito para `text-sm`                            | `Home.tsx:167` (vs `card.tsx:24`)                                     | Tipografia / componentes                  |
| A14 | `<h1>` ora sem classe (base) ora com classes próprias divergentes                                          | `Home.tsx:49` vs `History.tsx:182`                                    | Tipografia / hierarquia                   |
| A15 | Toasts usam `richColors` do `sonner` (paleta própria) em vez das cores semânticas do design system         | `App.tsx:48`                                                          | Cor / estados semânticos                  |
| A16 | Componente `Alert` usado em 3 telas sem revisão de consistência de cores semânticas/ícone                  | `feedback/Alert.tsx` (usado em Login/Admin/StyleGuide)                | Componentes / estados                     |

## Decisões

### D1 — Preservar a identidade visual da 002; refinar, não rebrandizar

- **Decisão**: manter a paleta índigo/violeta sobre neutros frios definida em `index.css`; ajustes
  ficam restritos a afinar shades para coesão e contraste WCAG AA quando necessário.
- **Rationale**: a spec proíbe mudança de identidade (FR-005); a base da 002 já é coerente.
- **Alternativas rejeitadas**: nova paleta/rebranding (fora de escopo); manter cores cravadas
  (`text-red-500`, `border-gray-300`) — substituídas por tokens (`destructive`, `input`/`border`).

### D2 — Tokens como única fonte de verdade visual

- **Decisão**: todo valor visual passa a derivar de tokens; introduzir **escala de elevação**
  nomeada (`boxShadow` em `tailwind.config.ts`: ex. base/sm/md/lg para superfície→cartão→
  popover/menu→modal) e formalizar a **escala de raios** (já há `sm/md/lg` via `--radius`; padronizar
  uso e reservar `rounded-full` apenas para pills/avatars).
- **Rationale**: ataca A5–A8 e satisfaz FR-006/FR-009/FR-010; SC-002.
- **Alternativas rejeitadas**: manter sombras/raios soltos por tela (mantém o drift).

### D3 — Papéis tipográficos explícitos

- **Decisão**: definir papéis (display/título/subtítulo/corpo/legenda/rótulo) com
  tamanho/peso/line-height/letter-spacing consistentes; o "valor em destaque" (peso/pressão) recebe
  um papel próprio (ex. número grande **semibold/bold**, não `font-black` arbitrário) aplicado de
  forma idêntica em Home e History.
- **Rationale**: ataca A6/A13/A14; FR-012/FR-013.
- **Alternativas rejeitadas**: manter `font-black`/`text-5xl` inline.

### D4 — Reuso de componentes existentes em vez de markup ad hoc

- **Decisão**: substituir `<button>` crus e o FAB manual por `Button`/`IconButton`; o checkbox
  nativo por `Checkbox`; o estado vazio por `EmptyState`. Para o seletor de segmento duplicado
  (A1), padronizar as classes via tokens e, se trivial, extrair um **helper interno** ao próprio
  app (não um novo primitivo público) para eliminar a duplicação — decisão final nas tasks,
  preferindo a opção mais simples.
- **Rationale**: reduz complexidade (Princípio V), uniformiza estados (FR-007/FR-014); SC-003/SC-004.
- **Alternativas rejeitadas**: criar novos componentes públicos para itens ausentes
  (accordion/date picker/etc.) — proibido pela spec; manter duplicação.

### D5 — Estados e microinterações padronizados via tokens

- **Decisão**: padronizar hover (mudança discreta de cor/elevação), foco (anel `ring` consistente
  já presente em `button`/`input` — estender aos controles feitos à mão), active/press (efeito
  sutil único), disabled (`opacity` + cursor) e loading (spinner/skeleton). Transições com **tokens
  de movimento**: duração no intervalo **120–200 ms** (rápida ~120, padrão ~160, teto ~200) e um
  **easing padrão único**, definidos em `tailwind.config.ts`; tudo já coberto por
  `prefers-reduced-motion` no `index.css:98-108`. (O limiar numérico resolve a ambiguidade A1 da
  análise e torna FR-017/SC-008 verificáveis — ver data-model.md §7.1.)
- **Rationale**: FR-014–FR-018; SC-004/SC-005/SC-008.
- **Alternativas rejeitadas**: efeitos chamativos (escala grande, sombras fortes) — contrariam
  "discreto e profissional"; durações longas (> 200 ms) — parecem lentas/chamativas.

### D9 — Toasts alinhados aos tokens semânticos (sem trocar de biblioteca)

- **Decisão**: manter o `sonner` como mecanismo de toast e a API de `src/lib/toast.ts`, mas alinhar
  as cores de sucesso/erro/info do `<Toaster>` (`src/App.tsx`) às **cores semânticas do design
  system** em vez de depender do `richColors` (paleta interna do `sonner`), garantindo coerência com
  alerts/badges/validação (FR-008; US2 AS6). (Corrige o gap G1 da análise.)
- **Rationale**: toasts estão no escopo (FR-023) e devem usar as mesmas cores semânticas; trocar a
  lib seria mudança desnecessária (Princípio V/VI).
- **Alternativas rejeitadas**: criar um componente de toast próprio (YAGNI; lib já adotada na 002);
  manter `richColors` (mantém a inconsistência cromática com o resto do design system).

### D6 — Aproveitamento de espaço por formato

- **Decisão**: rever `PageContainer`/`AppShell` para que telas de análise (Home/History) aproveitem
  melhor larguras grandes (ex. largura de conteúdo maior e/ou colunas em ≥ `3xl`/`4xl`), mantendo
  largura de leitura confortável para texto e **sem** alterar a navegação por formato da 002.
- **Rationale**: A12; FR-020/FR-021; SC-007.
- **Alternativas rejeitadas**: esticar tudo (linhas longas demais) ou manter `max-w-4xl` único.

### D7 — Itens deliberadamente fora de escopo (preservar comportamento)

- **`window.confirm()` de exclusão** (`History.tsx:74,84`): **não** será trocado por diálogo
  estilizado — alteraria a mecânica de interação/fluxo (FR-003). Mantido como está.
- **Componentes inexistentes** (accordion, date picker, calendário, autocomplete, search field):
  **não** serão criados (spec FR-002 + Assumptions). Onde a interface usa `datetime-local` nativo,
  permanece com o controle nativo (apenas acabamento ao redor).
- **Lógica/validações** (faixas de peso/pressão, parsing, timezone, ordenação, queries): intocadas.

### D8 — Verificação de não-regressão

- **Decisão**: manter a suíte Vitest existente verde sem editar lógica de teste por motivo
  funcional; rodar `vitest-axe` nas telas/guia; checklist manual de inspeção visual nas quatro
  larguras (~390/768/1920/3440) e nos dois temas. Baselines de snapshot visual automatizado: **não**
  adotadas agora (sem infra de visual regression no projeto; YAGNI) — decisão revisável.
- **Rationale**: FR-004; SC-001/SC-005/SC-006; Princípio VII.
- **Alternativas rejeitadas**: adicionar ferramenta de visual regression (nova dependência/infra)
  só para esta iniciativa.

## Conclusão

Nenhum bloqueio. O escopo é determinístico: refinar tokens, polir componentes existentes e
substituir markup ad hoc por componentes/classes baseados em token, sem mudar comportamento,
dependências ou arquitetura. Pronto para Phase 1.
