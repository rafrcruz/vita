# Implementation Plan: Frontend Design System Foundation

**Branch**: `002-design-system-foundation` | **Date**: 2026-06-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-design-system-foundation/spec.md`

## Summary

Estabelecer a fundação visual e arquitetural do frontend do VITA: design tokens (cores
índigo/violeta sobre neutros frios, tipografia, espaçamento, raios, sombras), tema tri-estado
Claro/Escuro/Sistema persistente e sem flash, layout/navegação responsivos (barra inferior no
mobile → rail no tablet → sidebar fixa no desktop/ultrawide), uma biblioteca de componentes
acessíveis construída no padrão **shadcn/ui** (primitivos Radix headless estilizados com Tailwind,
copiados para o repositório) e um guia visual vivo. As três telas existentes (Login, Home, Admin)
são reconstruídas sobre a fundação como validação, sem adicionar lógica de negócio.

Abordagem técnica: tokens como **CSS custom properties** (variáveis HSL) com troca de tema via
classe `dark` no `<html>`; componentes com `class-variance-authority` + `tailwind-merge`;
formulários eficientes com `react-hook-form` + `zod`; ícones `lucide-react`; toasts `sonner`;
animações via `tailwindcss-animate` + transições CSS (respeitando `prefers-reduced-motion`).
Tudo dentro do `apps/web` existente — nenhuma mudança no backend.

## Technical Context

**Language/Version**: TypeScript 5.7, React 18.3

**Primary Dependencies**: Tailwind CSS 3.4 (existente); a adicionar (padrão shadcn/ui):
Radix UI primitives (por componente), `class-variance-authority`, `tailwind-merge`, `clsx`,
`tailwindcss-animate`, `lucide-react` (ícones), `sonner` (toasts), `react-hook-form` +
`@hookform/resolvers` + `zod` (zod já presente no monorepo)

**Storage**: `localStorage` apenas para a preferência de tema (`vita.theme`). Sem backend novo,
sem dados de saúde, sem cookies novos.

**Testing**: Vitest + Testing Library (existente) + `vitest-axe` (asserções de acessibilidade
automatizadas nas telas-vitrine e no guia)

**Target Platform**: PWA (SPA) em navegadores modernos (Chrome, Edge, Safari, Firefox — últimas
versões), mobile e desktop

**Project Type**: Web — frontend SPA (apenas `apps/web`); backend inalterado

**Performance Goals**: troca de tema aplicada < 1s e sem reload; zero flash de tema (FOUC);
animações a 60fps; auditoria de acessibilidade sem violações A/AA; impacto de bundle controlado
(Radix é tree-shakeable por componente; sem libs pesadas de animação)

**Constraints**: contraste WCAG 2.1 AA nos dois temas; alvos de toque ≥ 44×44px; sem rolagem
horizontal de 320px a 3440px; respeitar `prefers-reduced-motion`; usabilidade com zoom até 200%

**Scale/Scope**: ~15–20 componentes de base + app shell responsivo + provider de tema + 1 guia
visual + reconstrução de 3 telas existentes. Usuário único (single-owner)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Avaliação | Status |
|-----------|-----------|--------|
| I. Observabilidade, não aconselhamento médico | Feature puramente de UI/fundação; nenhuma funcionalidade de saúde, cálculo ou agregação (FR-029) | ✅ Pass |
| II. Privacidade e segurança por padrão | Só persiste preferência de tema (não-sensível) em `localStorage`; sem segredos, sem log de dados de saúde, HTTPS inalterado | ✅ Pass |
| III. Acesso restrito via Google | Login é reskinado mantendo exclusivamente o fluxo Google + allowlist; sem novo mecanismo de identidade | ✅ Pass |
| IV. Stack definida (PWA online-first) | Mantém React+TS+Tailwind+PWA. Bibliotecas adicionadas são **aditivas dentro da stack** (Radix/RHF/etc. são UI sobre React/Tailwind), não substituição de stack base → não requer emenda | ✅ Pass |
| V. Simplicidade deliberada | Componentes copiados para o repo (sem framework de UI opaco); adiciona só primitivos necessários; **adia** Framer Motion e bibliotecas de gráficos (YAGNI) | ✅ Pass |
| VI. Dependências sustentáveis | Radix, RHF, zod, lucide, sonner, CVA, tailwind-merge: modernas, amplamente adotadas, ativamente mantidas, bem documentadas | ✅ Pass |
| VII. Testes orientados a risco | Testes para lógica de tema (persistência, modo Sistema, FOUC), acessibilidade das telas-vitrine/guia e comportamento responsivo do shell; sem testes só por cobertura | ✅ Pass |

**Resultado**: PASS — sem violações. Nenhuma entrada em Complexity Tracking necessária.

## Project Structure

### Documentation (this feature)

```text
specs/002-design-system-foundation/
├── plan.md              # Este arquivo
├── research.md          # Phase 0 — decisões técnicas e alternativas
├── data-model.md        # Phase 1 — tokens, preferência de tema, inventário de componentes, breakpoints
├── quickstart.md        # Phase 1 — guia de validação ponta a ponta
├── contracts/           # Phase 1 — contratos de UI
│   ├── design-tokens.md     # Nomes/estrutura dos tokens e mapeamento por tema
│   ├── theming-contract.md  # Contrato do provider/controle de tema
│   └── components.md        # Inventário e contrato de props dos componentes
└── checklists/
    └── requirements.md  # Checklist de qualidade da spec (já existente)
```

### Source Code (repository root)

```text
apps/web/
├── index.html                      # + script inline anti-FOUC (define classe de tema antes da hidratação)
├── tailwind.config.ts              # + darkMode: 'class', tokens mapeados para CSS vars, plugin tailwindcss-animate
├── src/
│   ├── index.css                   # + definição das CSS custom properties (tokens) :root e .dark
│   ├── lib/
│   │   └── utils.ts                # helper cn() (clsx + tailwind-merge)
│   ├── theme/
│   │   ├── ThemeProvider.tsx       # estado tri-estado (claro/escuro/sistema) + matchMedia + persistência
│   │   ├── useTheme.ts             # hook de acesso/troca de tema
│   │   └── ThemeToggle.tsx         # controle de UI tri-estado
│   ├── components/
│   │   ├── ui/                     # primitivos do design system (padrão shadcn/ui)
│   │   │   ├── button.tsx, input.tsx, label.tsx, card.tsx, dialog.tsx,
│   │   │   ├── sheet.tsx, dropdown-menu.tsx, table.tsx, badge.tsx,
│   │   │   ├── skeleton.tsx, toast (sonner), tabs.tsx, tooltip.tsx, ...
│   │   ├── feedback/               # EmptyState, ErrorState, LoadingState (padrões compostos)
│   │   ├── layout/                 # AppShell, BottomNav, SidebarNav, NavRail, PageContainer
│   │   └── ProtectedRoute.tsx      # (existente)
│   ├── pages/
│   │   ├── Login.tsx               # reconstruída sobre o design system (Google-only mantido)
│   │   ├── Home.tsx                # reconstruída
│   │   ├── AdminAllowlist.tsx      # reconstruída
│   │   └── StyleGuide.tsx          # guia visual vivo (rota /style-guide)
│   └── App.tsx                     # + ThemeProvider, + Toaster, + rota /style-guide
└── (vitest configs existentes)     # + vitest-axe nos testes de a11y
```

**Structure Decision**: Web app — alterações restritas ao workspace `apps/web` existente. Sem
novos workspaces nem mudanças no `apps/api`. Os componentes de UI vivem em `src/components/ui`
(primitivos copiados, estilo shadcn/ui), com padrões compostos em `feedback/` e `layout/`, e o
provider de tema isolado em `src/theme/`. As telas existentes são migradas in-place.

## Complexity Tracking

> Sem violações de Constituição — nenhuma justificativa de complexidade necessária.

*(Decisão consciente de NÃO adotar agora: Framer Motion para animações e qualquer biblioteca de
gráficos/charts — ambas adiadas para quando uma feature de negócio exigir, conforme Princípio V.)*
