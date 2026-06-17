# Quickstart — Validação do Polimento Visual

**Feature**: `004-ui-visual-polish`

Guia para validar que o polimento elevou a consistência visual **sem regressão funcional**. Não
contém código de implementação; é um roteiro de execução/inspeção.

## Pré-requisitos

- Node + dependências instaladas (`npm ci` na raiz do monorepo).
- Trabalhar dentro de `apps/web`.

## 1. Não-regressão funcional (obrigatória)

```bash
# na raiz do repo (ou apps/web)
npm run -w @vita/web typecheck
npm run -w @vita/web test        # Vitest + vitest-axe — deve passar sem alterar lógica de teste
```

Esperado: **type-check limpo** e **suíte verde**. Nenhum teste alterado por motivo funcional
(SC-001). Se um teste quebrar por seletor de texto/role, corrigir o polimento — não relaxar o teste.

## 2. Auditoria de tokens (SC-002)

```bash
# nenhum resultado esperado (cores/raios cravados fora de token):
rg -n "text-red-|bg-red-|border-gray-|#[0-9a-fA-F]{3,6}|rgb\(" apps/web/src
rg -n "font-black|text-5xl|shadow-2xl|shadow-none" apps/web/src
```

Esperado: 0 ocorrências divergentes (ou todas justificadas como token). Confirma C-TOK-1.

## 3. Inspeção visual por tela e tema

Rodar `npm run -w @vita/web dev` e percorrer, em **tema claro e escuro**:

- **Login**: cartão centralizado, tipografia/espaçamento consistentes; botão Google com
  hover/focus/press padrão.
- **Home**: seletor de métrica (peso/pressão) e filtro de tempo com estados selected/hover
  consistentes; FAB usando `Button` (elevação nível 4, foco visível); cartões com elevação da
  escala; número de destaque no papel "display" (sem `font-black`).
- **History**: lista com ritmo/elevação consistentes; ícone de pressão usando `destructive` (não
  vermelho cravado); estado vazio via `EmptyState`; modais de edição com botões/inputs padrão.
- **AdminAllowlist**: tabela/formulário/estados consistentes.
- **StyleGuide**: reflete tokens/escalas/estados refinados nos dois temas (SC-009/SC-010).
- **Modais de captura**: checkbox via componente `Checkbox` (foco visível, sem `border-gray-300`);
  "hero input" mantém a intenção visual com tokens.

Para cada um: alternar o tema e confirmar coesão (SC-009).

## 4. Estados e microinterações (SC-004/SC-005/SC-008)

- Navegar **somente por teclado** (Tab/Shift+Tab/Enter/Espaço): foco visível e consistente em todos
  os interativos, inclusive nav, FAB, seletor de segmento e checkbox.
- Hover/press discretos e iguais entre componentes equivalentes; transições dentro de ~120–200 ms.
- Disparar toasts (sucesso/erro) e abrir alerts: cores semânticas iguais às de badges/validação
  (toasts refletindo tokens, não `richColors`).
- Com `prefers-reduced-motion` ativo no SO: transições reduzidas/desativadas.

## 5. Responsividade (SC-007)

Inspecionar em ~390px, ~768px, 1920×1080 e 3440×1440 (e usável a 320px):

- 0 quebras de layout e 0 rolagem horizontal indevida.
- Navegação por formato preservada (abas inferiores → rail → sidebar fixa).
- Ultrawide aproveita o espaço sem linhas de texto longas demais nem grandes vazios acidentais.
- Zoom do navegador a 200%: layout utilizável.
- **Conteúdo extremo**: textos/rótulos longos, números grandes, lista vazia e lista muito grande —
  sem quebra, vazamento ou rolagem horizontal (FR-022 / Edge Cases).

## 6. Acessibilidade (SC-005/SC-006)

```bash
npm run -w @vita/web test    # inclui asserções vitest-axe
```

Esperado: 0 novas violações A/AA; contraste AA preservado nos dois temas.

## Critério de aceite

Todos os passos acima atendidos, com a suíte verde e sem nenhuma mudança de comportamento
observável em relação ao estado anterior ao polimento (FR-004 / SC-001 / SC-010).
