import { defineConfig } from 'vitest/config';

// Config raiz: agrega os projetos de teste (api e web) e define opções globais
// (coverage). A partir do Vitest 4 o arquivo vitest.workspace.ts foi removido —
// os projetos agora ficam em `test.projects`.
//
// Cobertura é INFORMATIVA, não um gate: alinhado à constituição do projeto
// (testes orientados a risco, não por percentual). Por isso não há `thresholds`.
export default defineConfig({
  test: {
    projects: ['apps/api/vitest.config.ts', 'apps/web/vitest.config.ts'],
    coverage: {
      provider: 'v8',
      // json-summary + json são consumidos pela action que comenta o resumo no PR;
      // text/text-summary aparecem no log do CI.
      reporter: ['text', 'text-summary', 'json-summary', 'json'],
      reportOnFailure: true,
      include: ['apps/*/src/**', 'packages/*/src/**'],
      exclude: ['**/*.test.{ts,tsx}', '**/test/**', '**/migrations/**'],
    },
  },
});
