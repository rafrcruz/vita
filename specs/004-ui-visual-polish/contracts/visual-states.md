# Contract — Estados Visuais e Microinterações

**Feature**: `004-ui-visual-polish`

Contrato dos estados e microinterações garantidos após o polimento. Matriz completa em
[`../data-model.md` §7](../data-model.md).

## Garantias

- **C-ST-1**: Todo elemento interativo expõe os estados aplicáveis — default, hover, focus-visible,
  active/press, selected, disabled, loading — com tratamento **consistente entre componentes
  equivalentes**.
- **C-ST-2**: O foco por teclado é sempre visível, usando o token `--ring` com offset, em ambos os
  temas, inclusive nos controles que antes eram construídos com `<button>`/`<input>` cru.
- **C-ST-3**: Hover e press são **discretos** (mudança sutil de cor/elevação; sem `scale` exagerado
  nem sombras fortes) e padronizados.
- **C-ST-4**: Disabled comunica-se por opacidade reduzida + cursor apropriado, sem alterar a regra
  funcional que determina quando o elemento fica desabilitado.
- **C-ST-5**: Loading usa spinner/skeleton consistente e **não** altera o comportamento da operação
  (ex.: bloqueio de duplo envio só onde já existe).
- **C-ST-6**: Estados semânticos (error/success/warning/info) em alerts, toasts, validação de campo
  e badges usam as **cores semânticas do design system** (tokens). Em particular, os toasts
  (`sonner`) refletem esses tokens — não a paleta interna `richColors`.
- **C-ST-7**: Transições usam os tokens de movimento (duração **120–200 ms** e easing padrão único),
  com bom desempenho, e são reduzidas/desativadas sob `prefers-reduced-motion` (regra global já em
  `index.css`).

## Não-objetivos / invariantes

- Não alterar **quando** um estado ocorre (lógica/validação que dispara loading, erro, disabled,
  selected permanece idêntica).
- Não substituir `window.confirm()` por diálogo estilizado (mudaria a interação).
- Não adicionar animações chamativas ou que prejudiquem legibilidade/performance.
