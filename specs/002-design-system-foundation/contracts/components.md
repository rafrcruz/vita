# Contract — Components & Layout Shell

Contrato de comportamento dos componentes e do app shell. Valida FR-013..FR-024, SC-005..SC-009.

## Regras gerais (todos os componentes)

| #   | Regra                                                                        |
| --- | ---------------------------------------------------------------------------- |
| C1  | Aparência coerente nos temas claro e escuro (usa só tokens)                  |
| C2  | Operável por teclado com foco visível (`--ring`); semântica/ARIA via Radix   |
| C3  | Estados aplicáveis: `default`, `hover/focus`, `disabled`, `loading`, `error` |
| C4  | Alvos de toque ≥ 44×44px em controles primários                              |
| C5  | Variantes expressas via `class-variance-authority`; composição via `cn()`    |

## Contratos específicos

| Componente                          | Contrato essencial                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `Button`                            | Variantes primary/secondary/outline/ghost/destructive; `loading` desabilita e mostra spinner, evitando duplo-clique       |
| `FormField` (RHF+zod)               | Label associada; validação inline com mensagem de erro acessível (`aria-describedby`); `inputMode`/`type` conforme o dado |
| `Dialog`/`Sheet`                    | Foco preso (focus trap), fecha por Esc/overlay, retorna foco ao gatilho; `Sheet` é o padrão mobile                        |
| `Toast` (sonner)                    | Notificações não bloqueantes de sucesso/erro/info; não exige interação                                                    |
| `Skeleton`/`Spinner`/`LoadingState` | Comunicam carregamento (FR-018)                                                                                           |
| `EmptyState`                        | Mensagem + ação sugerida em vez de área em branco (FR-018)                                                                |
| `ErrorState`/`Alert`                | Mensagem compreensível, não técnica, sem detalhes sensíveis; ação "tentar novamente" quando aplicável (FR-019)            |
| `Table`/`List`                      | Cabeçalhos semânticos; estado vazio integrado                                                                             |

## App Shell (navegação responsiva)

| #   | Dado (largura)        | Então                                                                                                         |
| --- | --------------------- | ------------------------------------------------------------------------------------------------------------- |
| N1  | ~390px (mobile)       | `BottomNav` visível; conteúdo 1 coluna; sem rolagem horizontal                                                |
| N2  | 768–1023px (tablet)   | `NavRail` recolhível; sem `BottomNav`                                                                         |
| N3  | 1920×1080 (desktop)   | `SidebarNav` fixa; conteúdo com `max-w` de leitura                                                            |
| N4  | 3440×1440 (ultrawide) | `SidebarNav` fixa; espaço aproveitado (multi-painel/contenção), sem linhas longas nem vazios não intencionais |
| N5  | 320px                 | utilizável, sem corte de conteúdo essencial nem rolagem horizontal                                            |
| N6  | qualquer              | transição entre formatos fluida ao redimensionar; conteúdo essencial sempre acessível                         |

## Acessibilidade (auditável — SC-008)

- `vitest-axe` nas telas-vitrine e no guia: **0 violações** de nível A/AA.
- Navegação completa por teclado; ordem de tabulação lógica; foco visível.
- Respeita `prefers-reduced-motion` em todas as animações/microinterações.
