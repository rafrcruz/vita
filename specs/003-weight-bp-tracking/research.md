# Research Notes: Weight & Blood Pressure Tracking

This document details the architectural decisions, rationale, and alternatives considered for implementing weight and blood pressure tracking.

---

## 1. Decimal Separator Parsing (Weight Input)

### Decision
A utility function will parse input strings on the fly. It replaces commas (`,`) with dots (`.`), removes non-numeric/non-separator characters, and validates that it represents a valid positive number.

```typescript
export function parseDecimalInput(value: string): number | null {
  const normalized = value.trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    return null;
  }
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? null : parsed;
}
```

### Rationale
- **Simplicity**: No external dependencies.
- **Robustness**: Handles common typos like trailing commas, trailing dots, or multiple separators during typing.
- **Testability**: Extremely easy to cover with unit tests.

### Alternatives Considered
- **Direct `parseFloat`**: Fails or returns incorrect integers for strings like `78,5` (returns `78` on many JS engines).
- **Internationalization API (`Intl.NumberFormat`)**: Too complex for a simple single-value weight input and increases bundle size.

---

## 2. Mobile Keyboard Configuration for Decimal Inputs

### Decision
Use standard HTML input attributes in React:
```tsx
<input
  type="text"
  inputMode="decimal"
  pattern="[0-9.,]*"
  placeholder="0.0"
/>
```

### Rationale
- **Cross-Platform Compatibility**: Forces Android and iOS to open a numeric keypad with both the dot (`.`) and comma (`,`) keys present.
- **Tailwind Friendly**: Standard text input is easy to style, highlight, and focus automatically.

### Alternatives Considered
- **`type="number"`**: Restricts entry of commas on iOS, preventing Portuguese-locale users from entering their weight naturally. Also has browser-specific spinner controls.
- **`type="tel"`**: Shows a numeric keypad but doesn't include decimal separators on all platforms.

---

## 3. Data Visualization (Trend Charts)

### Decision
Create a custom, lightweight SVG-based line chart component in React (`TrendChart.tsx`).

```tsx
// Abstract concept:
// Calculate min/max of values, map date to X, value to Y, and render:
<svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
  <path d={linePath} fill="none" stroke="currentColor" strokeWidth="3" />
  {/* Data points, labels, and grid lines */}
</svg>
```

### Rationale
- **Zero Dependencies**: Fits **Principle V** (Simplicidade Deliberada) and **Principle VI** (Dependências Sustentáveis) by not introducing massive packages (like Chart.js or Recharts).
- **Performance**: Loads instantly (< 5ms rendering time), completely responsive, and styled directly via Tailwind.
- **Lightweight**: Zero impact on bundler size.

### Alternatives Considered
- **Recharts**: Adds ~300KB to the frontend bundle and introduces multiple sub-dependencies.
- **Chart.js**: Requires external library initialization and custom canvas configurations, which are harder to style responsively with Tailwind.

---

## 4. Database Schema Types

### Decision
In the PostgreSQL (Neon) Drizzle schema:
- **`weight`**: Stored as a `real` (single-precision floating-point) or `numeric(4, 1)`. We choose `real` for simplicity and compatibility with standard JS `number` types.
- **`systolic` / `diastolic`**: Stored as `integer`.
- **`loggedAt`**: Stored as `timestamp(3) with time zone` to support correct timezone adjustments if logged retroactively.

### Rationale
- **Precision**: Weight entries are recorded with at most 1 decimal place (e.g. `82.4 kg`), which easily fits in a `real` column.
- **Standards**: Blood pressure values are always integers in mmHg.
- **Timezones**: Standard health observability requires storing exact fuso horário to distinguish morning vs evening measurements.

### Alternatives Considered
- **`doublePrecision`**: Unnecessary scale for a single-digit decimal value (weight).
- **`numeric(5, 2)`**: Adds serialization overhead and requires string-to-number casting in Drizzle.
