# Modelo de Dados do Cliente e Validações: Rich Charts & Datetime Input Mask Fix

Este documento descreve as estruturas de dados e regras de validação client-side aplicadas nesta feature, sem alteração de tabelas no banco de dados.

---

## 1. Estrutura dos Dados do Gráfico

Os componentes de gráficos (`TrendChart`) consomem os dados agregados da API do VITA. As estruturas consumidas seguem os tipos definidos no TypeScript:

### Tipo: `ChartPoint`

Representa um ponto individual a ser renderizado na linha do gráfico.

```typescript
interface ChartPoint {
  date: Date;
  val1: number; // Peso (kg) ou Pressão Sistólica (mmHg)
  val2?: number; // Pressão Diastólica (mmHg) - opcional, usado apenas para pressão
}
```

### Propriedades do Componente (`TrendChartProps`)

```typescript
interface TrendChartProps {
  data: {
    loggedAt: string; // Timestamp em formato ISO 8601
    weight?: number; // Peso em kg (opcional)
    systolic?: number; // Pressão Sistólica em mmHg (opcional)
    diastolic?: number; // Pressão Diastólica em mmHg (opcional)
  }[];
  type: 'weight' | 'bp'; // Métrica do gráfico
  timeframe?: '7d' | '30d' | 'all';
}
```

---

## 2. Máscara de Entrada de Data/Hora (Retroativo)

Para contornar os problemas do input nativo `<input type="datetime-local">`, o VITA utilizará uma máscara personalizada que manipula strings brutas antes de convertê-las para o payload da API.

### Estado Local do Form (Captura)

```typescript
// Armazena a string formatada em tempo real com a máscara (ex: "12/06/2026 01:30")
const [maskedDateTime, setMaskedDateTime] = React.useState<string>('');
```

### Regras de Mapeamento da Máscara:

A entrada aceita apenas números de `0-9`. À medida que os dígitos são digitados, as pontuações são inseridas nas posições correspondentes:

1. `D` (Dígito)
2. `DD` $\rightarrow$ adiciona `/` (ex: `12/`)
3. `DD/MM` $\rightarrow$ adiciona `/` (ex: `12/06/`)
4. `DD/MM/AAAA` $\rightarrow$ adiciona ` ` (espaço) (ex: `12/06/2026 `)
5. `DD/MM/AAAA HH` $\rightarrow$ adiciona `:` (ex: `12/06/2026 01:`)
6. `DD/MM/AAAA HH:MM` $\rightarrow$ Limite máximo de 12 dígitos.

---

## 3. Regras de Validação Client-Side (Data Retroativa)

Antes de realizar a submissão à API (que exige um formato ISO `YYYY-MM-DDTHH:mm:ss.sssZ`), o sistema valida a string digitada segundo as regras a seguir:

| Campo           | Padrão Regex                 | Regra de Negócio / Validação                                                                                                                     |
| --------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Dia (DD)**    | `^0[1-9]\|[12][0-9]\|3[01]$` | Deve ser entre `01` e `31`. O mês correspondente deve aceitar o dia (ex: Fevereiro não pode ter dia 30 ou 31, e dia 29 depende de ano bissexto). |
| **Mês (MM)**    | `^0[1-9]\|1[0-2]$`           | Deve ser entre `01` e `12`.                                                                                                                      |
| **Ano (AAAA)**  | `^[0-9]{4}$`                 | Deve ter exatamente 4 dígitos. Não pode ser no futuro (ex: maior que o ano atual).                                                               |
| **Hora (HH)**   | `^[01][0-9]\|2[0-3]$`        | Deve ser entre `00` e `23`.                                                                                                                      |
| **Minuto (MM)** | `^[0-5][0-9]$`               | Deve ser entre `00` e `59`.                                                                                                                      |

### Fluxo de Conversão:

1. Entrada do Usuário: `120620260130`
2. String na Interface (Máscara): `12/06/2026 01:30`
3. Parsing & Validação: Verifica integridade física da data (ex: `new Date(2026, 5, 12, 1, 30)` $\rightarrow$ mês 5 é Junho no construtor de JS).
4. Payload de Envio: `2026-06-12T01:30:00.000Z` (em UTC ou fuso horário local).
