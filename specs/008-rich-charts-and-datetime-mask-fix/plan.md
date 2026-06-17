# Plan de Implementação: Rich Charts & Datetime Input Mask Fix

**Branch**: `008-rich-charts-and-datetime-mask-fix` | **Date**: 2026-06-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/008-rich-charts-and-datetime-mask-fix/spec.md`

## Summary

Esta feature contempla o upgrade da exibição de gráficos e a correção do bug de máscara de entrada de datas retroativas no VITA:

1. **Gráficos**: Substituição do gráfico em SVG customizado pela biblioteca **Recharts**, resolvendo os problemas de sobreposição de eixos (ticks) de forma responsiva. Inclusão de um botão de tela cheia que, em dispositivos móveis compatíveis, solicita orientação em modo paisagem (`landscape`).
2. **Máscara de Data**: Substituição do `<input type="datetime-local">` por um campo de texto com `inputMode="numeric"` gerenciado por uma máscara de formatação contínua de 12 dígitos (`DD/MM/AAAA HH:MM`), impedindo o estouro de dígitos no ano e garantindo validação robusta.

## Technical Context

**Language/Version**: TypeScript / Node 22.x / React 18.x

**Primary Dependencies**: `recharts` (versão recente estável), `lucide-react` (ícones de tela cheia)

**Storage**: Local storage e cache do React Query para dados existentes (nenhuma alteração de esquema de banco de dados).

**Testing**: Vitest (`vitest`) + React Testing Library + jsdom para testes de integração do gráfico, máscara e modais.

**Target Platform**: Progressive Web App (PWA) / Desktop & Mobile Browsers.

**Project Type**: Monorepo Web Application.

**Performance Goals**: Transição instantânea para tela cheia (< 100ms no CSS), renderização de gráfico a 60fps sem stuttering de re-layout.

**Constraints**: Compatibilidade de layout responsivo até 320px de largura e degradação suave em navegadores móveis sem suporte ao travamento de tela (ex: Safari no iOS).

**Scale/Scope**: Limitado à interface Web de visualização e cadastro de Peso e Pressão Arterial.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle / Gate                   | Status | Justification / Action                                                                                                                                    |
| ---------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **I. Observabilidade de Saúde**    | Pass   | O gráfico apenas renderiza os registros informados pelo usuário de forma descritiva e limpa. Não há diagnósticos automáticos ou interpretadores clínicos. |
| **II. Privacidade e Segurança**    | Pass   | Nenhum dado de saúde é exposto em logs públicos ou console. Nenhuma chave secreta ou token é adicionado no frontend.                                      |
| **III. Acesso Restrito**           | Pass   | A autenticação existente do VITA via Google Accounts e verificação de allowlist permanece intocada.                                                       |
| **IV. Stack e Arquitetura**        | Pass   | Mantido o uso de React, TypeScript, Tailwind CSS e PWA (sem introduzir frameworks desnecessários).                                                        |
| **V. Simplicidade Deliberada**     | Pass   | Implementação de máscara nativa sem adicionar bibliotecas utilitárias de inputs, seguindo a diretriz anti-overengineering.                                |
| **VI. Dependências Sustentáveis**  | Pass   | A biblioteca **Recharts** é madura, extremamente popular no ecossistema React, ativamente mantida e com comunidade gigante.                               |
| **VII. Testes Orientados a Risco** | Pass   | Serão escritos testes unitários específicos para validar o helper da máscara de entrada de dados e a detecção de datas inválidas.                         |

## Project Structure

### Documentation (this feature)

```text
specs/008-rich-charts-and-datetime-mask-fix/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── checklists/
    └── requirements.md  # Quality checklist
```

### Source Code (repository root)

```text
apps/web/
├── src/
│   ├── components/
│   │   ├── BPCaptureModal.tsx         # Atualizado com a nova máscara de data/hora
│   │   ├── WeightCaptureModal.tsx     # Atualizado com a nova máscara de data/hora
│   │   ├── TrendChart.tsx             # Refatorado para Recharts + Tela Cheia
│   │   └── TrendChart.test.tsx        # Testes de renderização e comportamento do gráfico
│   ├── pages/
│   │   ├── Home.tsx                   # Renderiza TrendChart atualizado
│   │   └── History.tsx                # Modais e inputs atualizados
│   ├── lib/
│   │   └── date.ts                    # Helper utilitário para máscara e validações (novas funções)
│   │   └── date.test.ts               # Testes de unidade da máscara de data
│   └── services/
```

**Structure Decision**: Refatoração interna nos componentes existentes da SPA React (`apps/web`), mantendo a separação limpa de componentes e testes unitários.

## Complexity Tracking

> **Nenhuma violação identificada nos princípios constitucionais. YAGNI respeitado.**
