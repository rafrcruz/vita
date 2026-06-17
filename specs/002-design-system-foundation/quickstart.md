# Quickstart — Validação: Frontend Design System Foundation

Guia para validar, ponta a ponta, que a fundação do design system funciona. Não contém código de
implementação — apenas como rodar e o que esperar. Detalhes de tokens/componentes estão em
`data-model.md` e `contracts/`.

## Pré-requisitos

- Dependências instaladas: `npm install` na raiz (monorepo).
- Frontend em execução: `npm run dev:web` (ou `npm run dev` para api+web).
- App aberto no navegador (Vite imprime a URL local).

## Cenários de validação

### V1 — Tema tri-estado e ausência de FOUC (US1)

1. Abra a aplicação sem preferência salva → deve iniciar no tema do SO (modo "Sistema").
2. Abra o `ThemeToggle` e selecione **Escuro** → toda a UI muda em < 1s, sem reload.
3. Recarregue a página → reabre em **Escuro**, **sem flash** do tema claro.
4. Volte para **Sistema** e troque o tema do SO → a UI acompanha em tempo real.
5. (Acessibilidade) Verifique contraste nos dois temas (auditoria axe/Lighthouse) → 0 violações AA.

- **Espera-se**: comportamento conforme `contracts/theming-contract.md` (T1–T7).

### V2 — Responsividade e navegação por formato (US2)

1. Nas DevTools, teste larguras **390px, 768px, 1920px e 3440px** (e 320px).
2. Confirme a navegação por formato: **barra inferior** (390) → **rail recolhível** (768) →
   **sidebar fixa** (1920/3440).
3. Verifique ausência de rolagem horizontal e de quebras; em ultrawide, espaço aproveitado sem
   linhas de texto longas demais.

- **Espera-se**: regras N1–N6 de `contracts/components.md`; SC-005/SC-006.

### V3 — Biblioteca de componentes e estados (US3)

1. Acesse `/style-guide`.
2. Verifique componentes de ação, entrada, exibição, navegação, sobreposição e **feedback**
   (loading, vazio, erro, sucesso) nos dois temas.
3. Num formulário de exemplo, dispare validação inline e um estado de erro com "tentar novamente".
4. Navegue tudo **apenas pelo teclado** → foco visível e ordem lógica.

- **Espera-se**: contratos C1–C5 e específicos; SC-007 (montar tela só com componentes existentes).

### V4 — Telas-vitrine reconstruídas (US1–US3)

1. Visite `/login`, `/` (Home) e `/admin` nos dois temas e em mobile/desktop.
2. Confirme que usam os novos tokens/componentes e que o fluxo Google do login permanece intacto.

- **Espera-se**: SC-001 (3 telas reconstruídas, sem lógica de negócio nova).

### V5 — Guia visual vivo (US4)

1. Em `/style-guide`, alterne o tema → todos os exemplos refletem o tema.
2. Confirme presença de tokens (cores/tipografia/espaçamentos/raios/sombras), componentes com
   estados e exemplos de layout por formato, com diretrizes de uso.

- **Espera-se**: SC-010 (cobertura de 100% de tokens e componentes entregues).

## Verificações automatizadas

```bash
npm run lint
npm run typecheck
npm run test          # inclui testes de tema (ThemeProvider) e a11y (vitest-axe)
```

- **Espera-se**: tudo verde; testes de acessibilidade sem violações A/AA (SC-008); testes de tema
  cobrindo resolução `system`, persistência, reação ao SO e fallback.

## Critérios de pronto (resumo)

Todos os SC-001..SC-011 da `spec.md` verificáveis pelos cenários acima + verificações
automatizadas. Reduzir movimento respeitado (SC-011) e alvos de toque ≥44px (SC-009) checados
manualmente nas telas-vitrine.
