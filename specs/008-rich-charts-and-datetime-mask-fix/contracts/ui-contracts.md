# Contratos de Interface: Rich Charts & Datetime Input Mask Fix

Este documento descreve os contratos de interface técnica adotados para a comunicação entre componentes e payloads de API de registro histórico.

---

## 1. Contrato do Payload da API de Registro

Ao salvar novos registros de peso ou pressão retroativos, o frontend se comunica com a API REST utilizando os seguintes contratos de payload JSON (sobre HTTPS):

### Registro de Peso (`POST /api/weights`)

```json
{
  "weight": 78.5,
  "loggedAt": "2026-06-12T01:30:00.000Z"
}
```

- **weight**: float positivo de precisão simples entre `20` e `350` (inclusive).
- **loggedAt**: string ISO 8601 correspondente à data e hora retroativa validada. Se omitido, o backend utiliza o horário do servidor.

### Registro de Pressão Arterial (`POST /api/bp`)

```json
{
  "systolic": 120,
  "diastolic": 80,
  "loggedAt": "2026-06-12T01:30:00.000Z"
}
```

- **systolic**: inteiro positivo (SYS) entre `40` e `300`.
- **diastolic**: inteiro positivo (DIA) entre `30` e `200`.
- **loggedAt**: string ISO 8601 correspondente à data e hora retroativa.

---

## 2. Contrato de Estilo do Tema CSS (Tailwind variables)

Para que o Recharts mantenha a identidade visual bonita desejada pelo usuário, a injeção de estilo deve referenciar as variáveis de cor declaradas em `:root` no `index.css`:

```css
:root {
  --primary: 245 58% 51%; /* Cor principal (usado no Peso) */
  --destructive: 0 84.2% 60.2%; /* Cor Destructive (Pressão SYS) */
  --info: 199 89% 48%; /* Cor Info (Pressão DIA) */
  --muted-foreground: 215 16% 47%; /* Ticks e legendas */
  --border: 220 13% 91%; /* Grade interna e divisores */
  --background: 0 0% 100%; /* Fundo da tela cheia */
}
```

No JSX/TSX do Recharts, a injeção será parametrizada como:

```tsx
stroke = 'hsl(var(--primary))';
stroke = 'hsl(var(--destructive))';
stroke = 'hsl(var(--info))';
```

---

## 3. Contratos de Evento da Máscara de Entrada

O manipulador da máscara intercepta os dados digitados através do manipulador React `onChange`.

### Estrutura do Helper de Formatação:

```typescript
/**
 * Formata uma string numérica crua para o formato DD/MM/AAAA HH:MM
 * @param raw - apenas números
 * @returns string mascarada
 */
export function formatDateTimeMask(raw: string): string;

/**
 * Valida a data/hora em formato string mascarada
 * @param formatted - String no formato DD/MM/AAAA HH:MM
 * @returns boolean
 */
export function validateDateTimeString(formatted: string): boolean;
```
