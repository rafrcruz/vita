# Implementation Plan: Ajustes de UI — Navegação, Perfil, Gráfico e Ícone PWA

**Branch**: `005-ui-adjustments` | **Date**: 2026-06-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-ui-adjustments/spec.md`

## Summary

Conjunto de ajustes de UI/UX sobre a aplicação existente, em sua maioria no frontend, com
uma única adição de backend (entidade **Perfil do Usuário**). Os ajustes:

1. **Ícone PWA**: substituir o ícone genérico por um ícone próprio de temática de saúde,
   declarado no manifesto do `vite-plugin-pwa` (já configurado) e referenciado no `index.html`.
2. **Cabeçalho enxuto**: remover da `Home` o subtítulo, a linha de e-mail/badge/allowlist e o
   card "Status do backend"; manter no topo apenas tema + Sair; mover "Histórico" para o menu.
3. **Perfil**: criar rota/tela `/profile` (hoje link quebrado) com nome completo, data de
   nascimento e altura, persistidos em nova tabela `user_profiles` via novo módulo de API que
   espelha o módulo `health_metrics` (rota + serviço + schema Zod compartilhado).
4. **Gráfico**: aprimorar o `TrendChart` (SVG manual já existente) com tooltip de valor por
   ponto (hover no desktop, toque no mobile) e eixos X/Y mais informativos — eixo X com **3–6
   marcas adaptativas** distribuídas uniformemente (formato de data por período) e unidade no
   eixo Y (FR-016).
5. **Navegação mobile**: `BottomNav` passa a exibir "Início" + botão de menu (três tracinhos)
   que abre um `Sheet`/menu com as demais opções (Admin, Histórico, Perfil), extensível; e a
   barra deixa de sobrepor os botões flutuantes de Adicionar.
6. **Modal de captura no mobile**: ancorar o `DialogContent` ao topo quando o teclado numérico
   estiver aberto, para manter "Alterar data", "Cancelar" e "Salvar" visíveis.
7. **Acessibilidade básica (transversal, FR-027–031)**: nomes acessíveis nos novos controles
   (em especial o botão de menu "três tracinhos" e os controles do gráfico); operação por
   teclado e gestão de foco em menu/modais/Perfil; alvo de toque ≥44×44px na nav e nos FABs;
   gráfico que não depende só de cor nem só de hover. WCAG AA formal completo fica fora de escopo.

**Abordagem técnica**: reutilização máxima do que já existe (componentes `ui/` Radix, padrão
de módulo da API, Zod compartilhado, SVG do gráfico). Nenhuma nova dependência de peso —
em particular, **não** se adota biblioteca de gráficos; o tooltip e os eixos são implementados
sobre o SVG atual (alinhado ao Princípio V — Simplicidade Deliberada).

## Technical Context

**Language/Version**: TypeScript 5.7 (strict) no frontend e backend.

**Primary Dependencies**:

- Web: React 18, React Router 6, TailwindCSS 3, Radix UI (`dialog`, `dropdown-menu`, `sheet`,
  `tooltip` já instalados), TanStack Query 5, React Hook Form 7 + Zod, `vite-plugin-pwa`,
  `lucide-react` (ícones), `sonner` (toasts).
- API: Node + Express 4, Drizzle ORM (Neon serverless Postgres), Zod, esbuild (bundle serverless).
- Shared: pacote `@vita/shared` (schemas Zod como fonte única de verdade).

**Storage**: PostgreSQL (Neon) via Drizzle. Nova tabela `user_profiles`.

**Testing**: Vitest (web e api) + Testing Library (web). Testes orientados a risco (Princípio VII):
validação/serviço de Perfil e lógica de eixos/tooltip do gráfico.

**Target Platform**: PWA — mobile (captura) e desktop (análise). Navegadores modernos.

**Project Type**: Web (monorepo: `apps/web` SPA + `apps/api` Express + `packages/shared`).

**Performance Goals**: Interações de UI a 60 fps; gráfico renderiza suavemente até ~centenas de
pontos (período "Tudo"); resposta da API de perfil < 300 ms p95 (leitura/escrita de 1 linha).

**Constraints**: HTTPS em produção; sem segredos versionados; sem logar dados de saúde; mobile-first
para captura; manter requisitos mínimos de PWA (manifesto + service worker) sem complexidade
offline adicional. **Acessibilidade básica obrigatória** (nomes acessíveis, teclado/foco, alvo de
toque ≥44px, gráfico sem depender só de cor/hover); WCAG AA formal fora de escopo. Backend serverless
exige rebuild+commit do bundle `apps/api/api/index.js`.

**Scale/Scope**: Usuário único proprietário. ~5 telas. 1 nova tabela (1 linha por usuário).

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Princípio                                         | Conformidade | Observação                                                                                                                                           |
| ------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Observabilidade, não aconselhamento médico     | ✅           | Perfil apenas captura nome/nascimento/altura; **nenhum** cálculo de IMC/calorias nesta feature. Eixos do gráfico são visualização de dados próprios. |
| II. Privacidade e segurança por padrão            | ✅           | Perfil exige autenticação; dados acessados só pelo dono (filtro por `userEmail`). Sem novos segredos. Não logar valores de perfil.                   |
| III. Acesso restrito + Google/allowlist           | ✅           | Sem mudança de auth. Novo endpoint sob `requireAuth`. "Admin" no menu mantém gating existente.                                                       |
| IV. Stack/arquitetura PWA online-first            | ✅           | React/TS/Tailwind + Express/TS. PWA reforçada (ícone). Sem recursos offline novos.                                                                   |
| V. Simplicidade deliberada (anti-overengineering) | ✅           | Sem nova lib de gráfico; reutiliza SVG e componentes Radix existentes. Módulo de Perfil espelha padrão já adotado.                                   |
| VI. Dependências e infra sustentáveis             | ✅           | Nenhuma dependência nova significativa; ícone é asset estático.                                                                                      |
| VII. Testes orientados a risco                    | ✅           | Testes para validação/serviço de Perfil e para a lógica de geração de ticks/tooltip do gráfico (transformação de dados).                             |

**Resultado**: PASS (sem violações). Nenhuma entrada necessária em Complexity Tracking.

**Re-avaliação pós-design (Phase 1)**: PASS — o design mantém uma única tabela nova, um módulo
de API no padrão existente, e nenhuma nova dependência de runtime. As clarificações da sessão
2026-06-17 (a11y básica FR-027–031; eixo X com 3–6 marcas adaptativas FR-016) foram incorporadas
sem alterar a stack nem introduzir complexidade — a a11y básica usa primitivos Radix/HTML já
disponíveis. Sem desvios a justificar.

## Project Structure

### Documentation (this feature)

```text
specs/005-ui-adjustments/
├── plan.md              # Este arquivo (/speckit-plan)
├── research.md          # Phase 0 (/speckit-plan)
├── data-model.md        # Phase 1 (/speckit-plan)
├── quickstart.md        # Phase 1 (/speckit-plan)
├── contracts/           # Phase 1 (/speckit-plan)
│   └── profile.api.md
├── checklists/
│   └── requirements.md  # criado em /speckit-specify
└── tasks.md             # Phase 2 (/speckit-tasks — NÃO criado aqui)
```

### Source Code (repository root)

```text
packages/shared/src/
├── profile.ts              # NOVO: profileInputSchema (Zod) + tipos compartilhados
└── index.ts                # exportar ./profile

apps/api/src/
├── db/
│   ├── schema.ts           # + tabela userProfiles
│   └── migrations/         # + migração gerada (drizzle-kit generate)
├── profile/                # NOVO módulo (espelha health_metrics/)
│   ├── profile.route.ts    # GET /api/profile, PUT /api/profile
│   ├── profile.service.ts  # getProfile / upsertProfile (filtro por userEmail)
│   └── profile.test.ts     # testes de validação/serviço
├── app.ts                  # montar profileRouter sob requireAuth
└── api/index.ts → index.js # rebuild do bundle serverless (esbuild) e commit

apps/web/
├── index.html              # + <link rel="icon"/apple-touch-icon> e theme-color
├── public/                 # NOVO: ícones (favicon, 192/512, maskable, apple-touch)
├── vite.config.ts          # manifest.icons no VitePWA
└── src/
    ├── App.tsx             # + <Route path="/profile">
    ├── pages/
    │   ├── Home.tsx        # remover subtítulo/linha de usuário/card backend; tirar Histórico do topo
    │   └── Profile.tsx     # NOVO: formulário (RHF + Zod) nome/nascimento/altura
    ├── services/api.ts     # + useProfile / useUpdateProfile (TanStack Query)
    ├── components/
    │   ├── TrendChart.tsx  # tooltip por ponto + eixos X/Y aprimorados
    │   ├── WeightCaptureModal.tsx / BPCaptureModal.tsx  # ancoragem ao topo no mobile
    │   └── layout/
    │       ├── BottomNav.tsx  # "Início" + botão menu (Sheet) com itens extras
    │       ├── SidebarNav.tsx # incluir "Histórico"; manter Admin/Perfil
    │       └── NavRail.tsx    # incluir "Histórico"
    └── components/ui/dialog.tsx  # variante/prop de alinhamento ao topo (se necessário)
```

**Structure Decision**: Monorepo web existente (Opção "Web application"). A feature adiciona um
módulo de API (`apps/api/src/profile/`) no mesmo padrão de `health_metrics`, um schema no pacote
`@vita/shared`, e mudanças localizadas no `apps/web`. Assets de ícone vão em `apps/web/public/`.

## Complexity Tracking

> Sem violações de constituição. Nenhuma justificativa de complexidade necessária.
