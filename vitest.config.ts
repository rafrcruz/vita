import { defineConfig } from 'vitest/config';

// Config raiz só para opções globais (coverage). Os "projects" de teste continuam
// definidos em vitest.workspace.ts (apps/api e apps/web).
//
// Cobertura é INFORMATIVA, não um gate: alinhado à constituição do projeto
// (testes orientados a risco, não por percentual). Por isso não há `thresholds`.
export default defineConfig({
  test: {
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
