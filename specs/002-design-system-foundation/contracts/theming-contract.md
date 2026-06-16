# Contract — Theming (ThemeProvider / useTheme / ThemeToggle)

Contrato de comportamento do subsistema de tema. Valida FR-005..FR-010, SC-002, SC-003, SC-011.

## API

```ts
type Theme = 'light' | 'dark' | 'system';

interface ThemeContext {
  theme: Theme;                 // preferência escolhida (persistida)
  resolvedTheme: 'light' | 'dark'; // tema efetivo aplicado (derivado)
  setTheme(theme: Theme): void; // troca + persiste + aplica imediatamente
}

function useTheme(): ThemeContext;
```

- `<ThemeProvider>` envolve a aplicação (em `App.tsx`), acima do roteador.
- `<ThemeToggle>` é um controle tri-estado (Claro / Escuro / Sistema) que chama `setTheme`.

## Contrato comportamental

| # | Dado | Quando | Então |
|---|------|--------|-------|
| T1 | Sem valor em `localStorage` | app inicializa | `theme === 'system'`; `resolvedTheme` = preferência do SO |
| T2 | `theme === 'system'` | SO muda claro↔escuro | `resolvedTheme` acompanha em tempo real; classe `dark` do `<html>` alterna |
| T3 | usuário chama `setTheme('dark')` | — | classe `dark` aplicada < 1s, sem reload; `localStorage["vita.theme"] === 'dark'` |
| T4 | `theme` explícito (`light`/`dark`) | SO muda | `resolvedTheme` **não** muda (ignora o SO) |
| T5 | preferência salva | app reabre/reinicia | reabre no `theme` salvo, sem flash do tema oposto |
| T6 | `localStorage`/`matchMedia` indisponível | inicializa | fallback `light`, sem erro |
| T7 | `prefers-reduced-motion` ativo | troca de tema/animações | transições reduzidas/desativadas |

## Anti-FOUC

Script inline síncrono em `index.html` (no `<head>`, antes do bundle) que:
1. lê `localStorage["vita.theme"]` (default `system`);
2. resolve para `light`/`dark` (usando `matchMedia` quando `system`);
3. adiciona/remove a classe `dark` no `<html>` **antes** da primeira pintura.

Critério: nenhum flash de tema observável em carregamentos de teste (SC-003).
