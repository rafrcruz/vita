# Phase 1 — Data Model: Frontend Design System Foundation

Esta feature é de UI; o "modelo de dados" são os **artefatos de design** (tokens, temas,
componentes, breakpoints) e o **único estado persistido** (preferência de tema). Não há entidades
de banco nem dados de saúde.

## 1. Design Token

Unidade nomeada de decisão visual, exposta como CSS custom property e consumida pelo Tailwind.

| Grupo                 | Tokens (exemplos)                                                                                                 | Observações                                                       |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Cor — superfície      | `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`                            | Valor por tema (claro/escuro)                                     |
| Cor — marca/semântica | `primary` (índigo/violeta), `primary-foreground`, `secondary`, `muted`, `muted-foreground`, `accent`              | `primary` é a identidade                                          |
| Cor — estado          | `destructive`, `success`, `warning`, `info` (+ `-foreground`)                                                     | Usadas por feedback/badges                                        |
| Cor — controle        | `border`, `input`, `ring`                                                                                         | `ring` = foco visível                                             |
| Cor — visualização    | `chart-1` … `chart-5`                                                                                             | Reservadas para gráficos futuros (sem implementar gráficos agora) |
| Tipografia            | `font-sans`; escala `xs, sm, base, lg, xl, 2xl, 3xl, 4xl`; pesos `regular/medium/semibold/bold`; alturas de linha | Hierarquia: display, h1–h3, body, caption, label                  |
| Espaçamento           | escala base 4px (`0,1,2,3,4,6,8,12,16,…`)                                                                         | Reutiliza a escala do Tailwind                                    |
| Raio                  | `radius` base (md) + `sm/lg/full` derivados                                                                       | Único token-raiz `--radius`                                       |
| Sombra/elevação       | `shadow-sm/md/lg`                                                                                                 | Sutil; coerente nos dois temas                                    |

**Regras**:

- Todo componente referencia tokens (classes utilitárias mapeadas), **nunca** cores/medidas fixas.
- Cada par texto/fundo MUST satisfazer contraste WCAG 2.1 AA nos dois temas (FR-010, SC-004).
- Tokens são definidos uma vez em `index.css` (`:root` e `.dark`) e mapeados no `tailwind.config.ts`.

## 2. Theme Preference (único estado persistido)

| Campo   | Tipo | Valores                         | Default    | Persistência                 |
| ------- | ---- | ------------------------------- | ---------- | ---------------------------- |
| `theme` | enum | `'light' \| 'dark' \| 'system'` | `'system'` | `localStorage["vita.theme"]` |

**Estado derivado** (não persistido): `resolvedTheme: 'light' | 'dark'` — em `system`, calculado de
`matchMedia('(prefers-color-scheme: dark)')` e atualizado em tempo real.

**Transições de estado**:

- `system → light/dark`: usuário escolhe explicitamente; passa a ignorar o SO.
- `light/dark → system`: volta a acompanhar o SO em tempo real.
- Mudança do SO: afeta `resolvedTheme` **somente** quando `theme === 'system'`.

**Regras**:

- Aplicado **antes** da primeira pintura via script inline (FR-009, SC-003 — sem FOUC).
- Não é dado sensível nem de saúde; armazenamento local; fallback `light` se persistência/`matchMedia`
  indisponíveis.

## 3. Breakpoint / Formato

| Formato     | Faixa (largura)          | Token Tailwind | Navegação primária          | Layout                                           |
| ----------- | ------------------------ | -------------- | --------------------------- | ------------------------------------------------ |
| Smartphone  | ~320–767px (alvo 390px)  | base → `md:`   | **Barra de abas inferior**  | 1 coluna, largura total confortável              |
| Tablet      | 768–1023px               | `md`           | **Rail/sidebar recolhível** | 1–2 colunas                                      |
| Desktop FHD | 1024–1919px (1920×1080)  | `lg`/`3xl`     | **Sidebar fixa**            | Conteúdo com `max-w` de leitura + sidebar        |
| Ultrawide   | ≥1920/2560px (3440×1440) | `3xl`/`4xl`    | **Sidebar fixa**            | Multi-painel deliberado / contenção centralizada |

**Regras**: sem rolagem horizontal de 320px a 3440px (FR-015/SC-005); alvos de toque ≥44×44px
(FR-014/SC-009); largura de leitura limitada em telas largas (FR-016).

## 4. Component (inventário da biblioteca)

Cada componente tem variações e os estados: `default`, `hover/focus` (foco visível), `disabled`,
`loading`, `error` quando aplicável; aparência coerente nos dois temas; documentado no guia.

| Categoria    | Componentes                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| Ação         | `Button` (variantes: primary/secondary/outline/ghost/destructive; tamanhos; estado loading), `IconButton`           |
| Entrada      | `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Label`, `FormField` (RHF+zod, validação inline) |
| Exibição     | `Card`, `Badge`, `Avatar`, `Separator`, `Table`, `List`                                                             |
| Navegação    | `AppShell`, `SidebarNav`, `NavRail`, `BottomNav`, `Tabs`, `Breadcrumb`                                              |
| Sobreposição | `Dialog` (modal), `Sheet` (drawer mobile), `DropdownMenu`, `Tooltip`, `Popover`                                     |
| Feedback     | `Toast` (sonner), `Skeleton`, `Spinner`, `EmptyState`, `ErrorState`, `LoadingState`, `Alert`                        |
| Tema         | `ThemeToggle` (tri-estado), `ThemeProvider`                                                                         |

**Princípio de escopo (V)**: implementar **apenas** os componentes acima (necessários para as 3
telas-vitrine + guia). Evitar componentes genéricos especulativos; novos primitivos só quando uma
tela real exigir.

## 5. Telas-vitrine (validação, sem lógica de negócio nova)

| Tela            | Rota           | Reconstrução                                                            |
| --------------- | -------------- | ----------------------------------------------------------------------- |
| Login           | `/login`       | Card central, botão Google (fluxo inalterado), estados de loading/erro  |
| Home            | `/`            | AppShell + cartão de status de health usando tokens/componentes         |
| Admin allowlist | `/admin`       | AppShell + tabela/lista + formulário (add) + estados vazio/erro/confirm |
| Guia visual     | `/style-guide` | Vitrine viva de tokens, componentes e layouts                           |
