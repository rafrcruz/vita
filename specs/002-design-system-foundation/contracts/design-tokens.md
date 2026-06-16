# Contract — Design Tokens

Contrato da camada de tokens. Valida FR-001..FR-004, FR-010, SC-004.

## Forma

- Tokens definidos como **CSS custom properties** em `src/index.css`:
  - `:root { … }` → tema claro
  - `.dark { … }` → tema escuro (mesmos nomes, valores diferentes)
- Valores em **HSL** (ex.: `--primary: 245 58% 51%;`) referenciados pelo `tailwind.config.ts`
  via `hsl(var(--token))`, de modo que classes como `bg-primary` / `text-foreground` funcionem nos
  dois temas sem variantes `dark:`.

## Tokens obrigatórios (nomes canônicos)

```
--background        --foreground
--card              --card-foreground
--popover           --popover-foreground
--primary           --primary-foreground   (índigo/violeta — identidade)
--secondary         --secondary-foreground
--muted             --muted-foreground
--accent            --accent-foreground
--destructive       --destructive-foreground
--success           --success-foreground
--warning           --warning-foreground
--info              --info-foreground
--border  --input  --ring
--radius                                  (raio base; sm/lg/full derivados)
--chart-1 … --chart-5                     (reservados p/ visualização futura)
```

## Regras de conformidade

| # | Regra |
|---|-------|
| K1 | Componentes referenciam tokens via classes Tailwind mapeadas; sem cores/medidas hardcoded |
| K2 | Todo par texto/superfície atende contraste WCAG 2.1 AA nos dois temas (auditável) |
| K3 | `--ring` provê foco visível em todos os elementos interativos (FR-022) |
| K4 | A escala tipográfica define hierarquia clara: display, h1–h3, body, caption, label |
| K5 | Espaçamento segue a escala base 4px do Tailwind (sem números mágicos) |
| K6 | Tokens de `--chart-*` existem mas nenhum gráfico é implementado nesta feature |
