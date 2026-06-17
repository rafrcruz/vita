# Contract — Design Tokens (refino)

**Feature**: `004-ui-visual-polish`

Contrato dos tokens visuais após o polimento. Define o que é garantido, não a implementação exata.
Detalhes das escalas em [`../data-model.md`](../data-model.md).

## Garantias

- **C-TOK-1**: Todo valor de cor, raio, borda, sombra, tamanho/peso de fonte e espaçamento aplicado
  na interface deriva de um token (CSS var / classe utilitária mapeada). **Nenhum** valor cravado
  divergente (hex/rgb avulso, `text-red-500`, `border-gray-300`, raio numérico ad hoc).
- **C-TOK-2**: Os nomes de tokens existentes da 002 são **preservados** (sem renomear/remover
  variáveis CSS nem chaves de cor no Tailwind), garantindo que componentes atuais continuem válidos.
  Adições permitidas: escala de elevação nomeada (`boxShadow`) e tokens tipográficos auxiliares.
- **C-TOK-3**: Cada token de cor com par claro/escuro mantém valor coerente nos dois temas e
  preserva contraste WCAG 2.1 AA para seu uso previsto.
- **C-TOK-4**: As cores semânticas (`destructive`, `success`, `warning`, `info`) são as **únicas**
  fontes para comunicar esses estados em qualquer componente.
- **C-TOK-5**: A escala de raios expõe `sm`/`md`/`lg`/`full`; a de elevação expõe níveis 0–4
  (superfície → cartão → cartão elevado → popover/menu → modal/sheet). Componentes usam o nível
  coerente com sua camada.
- **C-TOK-6**: Existem tokens de movimento — `transitionDuration` (rápida ~120 ms, padrão ~160 ms,
  teto ~200 ms) e um `transitionTimingFunction` (easing padrão único). Microinterações usam esses
  tokens; nenhuma transição de microinteração excede ~200 ms. Sob `prefers-reduced-motion`, tudo é
  reduzido/desativado.

## Não-objetivos

- Trocar o espaço de cor (HSL) ou a identidade índigo/violeta.
- Renomear/remover tokens existentes.
- Introduzir tokens para componentes inexistentes.
