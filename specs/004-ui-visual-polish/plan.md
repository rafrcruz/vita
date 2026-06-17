# Implementation Plan: Polimento Visual da Aplicação (UI/UX)

**Branch**: `004-ui-visual-polish` | **Date**: 2026-06-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-ui-visual-polish/spec.md`

## Summary

Polir visualmente toda a interface **já existente** do VITA, sem tocar em comportamento. O trabalho
consolida o uso dos design tokens já definidos na feature 002 e elimina o "drift" visual que se
acumulou nas telas de negócio (peso/pressão). A auditoria do código revelou inconsistências
concretas e recorrentes que esta iniciativa corrige:

- **Markup ad hoc duplicado**: o seletor de métrica/abas em segmento é reescrito inline e
  **duplicado** em `Home.tsx` e `History.tsx` (mesmas classes copiadas), sem padrão compartilhado.
- **Componentes da biblioteca ignorados**: `Home` usa `<button>` cru para "Sair"/links e um FAB
  inteiramente manual (`rounded-full`, `shadow-2xl`, `active:scale-95`) em vez de `Button`;
  `WeightCaptureModal` usa `<input type="checkbox">` nativo (com a cor cravada `border-gray-300`)
  em vez do componente `Checkbox`; `History` usa `<div>` solto para estado vazio em vez de
  `EmptyState`.
- **Valores fora dos tokens**: `text-red-500` cravado no ícone de pressão; `border-gray-300`;
  tipografia fora da escala (`text-5xl font-black`, `font-black`) sem papel definido no design
  system; elevação inconsistente (`shadow-sm` vs `shadow-none` vs `shadow-2xl`); raios misturados
  (`rounded`, `rounded-md`, `rounded-lg`, `rounded-full`) sem escala intencional.
- **Estados visuais desuniformes**: hovers ad hoc (`hover:bg-muted/10`, `hover:bg-muted`),
  `active:scale-95` só em alguns lugares, ausência de anel de foco em controles construídos à mão.
- **Aproveitamento de espaço**: `PageContainer` fixa `max-w-4xl` para tudo; em ultrawide sobra
  área vazia e o ritmo de espaçamento entre telas é inconsistente (`mt-2/4/6`, `pb-24` para
  compensar o FAB).

Abordagem técnica: **nenhuma dependência nova, nenhuma mudança de stack, nenhuma mudança de
comportamento**. Refina-se (a) os tokens em `index.css`/`tailwind.config.ts` (escala de elevação,
raios, tipografia, ajustes finos de cor/contraste preservando a identidade índigo/violeta), (b) os
componentes da biblioteca (`src/components/ui`, `feedback`, `layout`) para acabamento e estados
consistentes, e (c) as telas, substituindo markup ad hoc por componentes existentes e por classes
baseadas em tokens. O `StyleGuide` passa a refletir os tokens/estados refinados. A verificação de
não-regressão combina a suíte Vitest existente (sem alterar lógica de teste) com inspeção visual
nas quatro larguras de referência e nos dois temas.

## Technical Context

**Language/Version**: TypeScript 5.7, React 18.3 (inalterados)

**Primary Dependencies**: Tailwind CSS 3.4, `class-variance-authority`, `tailwind-merge`, `clsx`,
`tailwindcss-animate`, Radix UI primitives, `lucide-react`, `sonner` — **todas já presentes**.
Nenhuma dependência nova é adicionada por esta iniciativa.

**Storage**: N/A — nenhuma mudança de dados, `localStorage` (preferência de tema) inalterado.

**Testing**: Vitest 4 + Testing Library + `vitest-axe` (já presentes). Foco em **não-regressão**:
a suíte existente deve continuar passando sem alterações motivadas por mudança funcional; auditoria
`axe` sem novas violações A/AA.

**Target Platform**: PWA (SPA) em navegadores modernos (Chrome, Edge, Safari, Firefox), mobile e
desktop.

**Project Type**: Web — apenas `apps/web`. Backend (`apps/api`) totalmente inalterado.

**Performance Goals**: transições discretas a 60fps; nenhum aumento perceptível de bundle (sem novas
libs); `prefers-reduced-motion` respeitado; troca de tema instantânea preservada.

**Constraints**: preservar 100% do comportamento observável; contraste WCAG 2.1 AA nos dois temas;
alvos de toque ≥ 44×44px; sem rolagem horizontal de ~320px a ~3440px; usabilidade com zoom até 200%;
sem alterar APIs, dados, validações, fluxos, permissões ou arquitetura.

**Scale/Scope**: ~18 componentes de UI + 4 componentes de feedback + 5 de layout + 5 páginas
(Login, Home, History, AdminAllowlist, StyleGuide) + 2 modais de captura + TrendChart + tokens.
Usuário único.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Princípio                                     | Avaliação                                                                                                                                                                          | Status  |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| I. Observabilidade, não aconselhamento médico | Iniciativa puramente visual; não cria cálculos, agregações nem interpretações clínicas (FR-001/FR-003)                                                                             | ✅ Pass |
| II. Privacidade e segurança por padrão        | Nenhuma mudança de dados, logs, segredos, transporte ou persistência; só apresentação client-side                                                                                  | ✅ Pass |
| III. Acesso restrito via Google               | Login apenas refinado visualmente; fluxo Google + allowlist e permissões intactos (FR-003)                                                                                         | ✅ Pass |
| IV. Stack definida (PWA online-first)         | Mantém React+TS+Tailwind+PWA; **zero dependências novas**; nenhuma mudança de arquitetura                                                                                          | ✅ Pass |
| V. Simplicidade deliberada                    | Reduz complexidade: remove markup ad hoc duplicado e o substitui por componentes existentes; não introduz componentes para itens ausentes (accordion, date picker, etc.) — YAGNI   | ✅ Pass |
| VI. Dependências sustentáveis                 | Nenhuma dependência adicionada ou removida                                                                                                                                         | ✅ Pass |
| VII. Testes orientados a risco                | O risco central é **regressão funcional/visual**; mitigado mantendo a suíte existente verde, `axe` sem novas violações e checklist de inspeção visual. Sem testes só por cobertura | ✅ Pass |

**Resultado**: PASS — sem violações. Nenhuma entrada em Complexity Tracking necessária.

## Project Structure

### Documentation (this feature)

```text
specs/004-ui-visual-polish/
├── plan.md              # Este arquivo
├── research.md          # Phase 0 — auditoria de inconsistências e decisões de polimento
├── data-model.md        # Phase 1 — escalas refinadas (cor, tipografia, raio, elevação, espaçamento), matriz de estados, inventário de componentes
├── quickstart.md        # Phase 1 — guia de validação visual e de não-regressão
├── contracts/           # Phase 1 — contratos de UI (apresentação; props/contratos funcionais inalterados)
│   ├── design-tokens.md     # Tokens refinados e regra "sem valores avulsos"
│   ├── visual-states.md     # Contrato de estados (default/hover/focus/active/disabled/loading/...) e microinterações
│   └── component-polish.md  # Inventário componente-a-componente: o que polir, o que NÃO mudar
└── checklists/
    └── requirements.md  # Checklist de qualidade da spec (já existente)
```

### Source Code (repository root)

```text
apps/web/
├── tailwind.config.ts              # AJUSTE: escala de elevação (boxShadow), escala de raio, tokens de tipografia/letter-spacing/line-height; sem novas cores fora da paleta
├── src/
│   ├── index.css                   # AJUSTE: ajustes finos de tokens (HSL) p/ contraste/coesão nos 2 temas; papéis tipográficos; foco/seleção globais
│   ├── components/
│   │   ├── ui/                     # POLIR: button, input, textarea, select, checkbox, radio-group, switch, card, table, dialog, sheet, dropdown-menu, tooltip, badge, skeleton, spinner, label, form — estados e tokens consistentes (props/contratos INALTERADOS)
│   │   ├── feedback/               # POLIR: Alert, EmptyState, ErrorState, LoadingState — acabamento e uso consistente
│   │   └── layout/                 # POLIR: AppShell, PageContainer (largura/ritmo p/ widescreen/ultrawide), SidebarNav, NavRail, BottomNav — estados de nav consistentes
│   ├── pages/
│   │   ├── Login.tsx               # POLIR: espaçamento/tipografia (já usa componentes — baixo esforço)
│   │   ├── Home.tsx                # POLIR (alto): substituir FAB manual e <button> crus por Button; unificar seletor de segmento; remover font-black/shadow-2xl ad hoc; ritmo de espaçamento
│   │   ├── History.tsx             # POLIR (alto): usar EmptyState; remover text-red-500; unificar seletor de segmento; tipografia/elevação dos cartões
│   │   ├── AdminAllowlist.tsx      # POLIR: consistência de tabela/form/estados
│   │   └── StyleGuide.tsx          # ATUALIZAR: refletir tokens/escala/estados refinados
│   ├── components/WeightCaptureModal.tsx  # POLIR: trocar checkbox nativo (border-gray-300) por Checkbox; unificar tokens do "hero input" preservando intenção visual
│   ├── components/BPCaptureModal.tsx      # POLIR: idem, consistência com WeightCaptureModal
│   └── components/TrendChart.tsx          # POLIR: usar tokens chart-* e cores semânticas; sem mudar dados/comportamento
└── (configs Vitest/axe existentes)        # SEM mudança estrutural; testes de não-regressão
```

**Structure Decision**: Web app — alterações restritas ao workspace `apps/web`. Nenhum arquivo novo
de componente público é criado (Princípio V); o trabalho é refinar tokens, polir componentes
existentes in-place e substituir markup ad hoc das telas por componentes/classes já existentes.
Onde houver markup duplicado idêntico entre telas (seletor de segmento), a decisão de extrair um
helper interno compartilhado vs. apenas padronizar as classes é resolvida nas tasks, preferindo a
opção mais simples que elimine a duplicação sem criar uma nova abstração pública.

## Complexity Tracking

> Sem violações de Constituição — nenhuma justificativa de complexidade necessária.

_(Itens deliberadamente FORA de escopo para preservar comportamento: substituir os `window.confirm()`
de exclusão em `History.tsx` por um diálogo estilizado — alteraria a mecânica de interação; e
introduzir componentes inexistentes hoje — accordion, date picker, calendário, autocomplete, search
field — que a spec proíbe criar. Ambos registrados em research.md.)_
