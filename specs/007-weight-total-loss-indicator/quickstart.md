# Quickstart: Weight Total Loss Indicator

This guide outlines how to configure, run, and validate the Weight Total Loss Indicator feature.

## Prerequisites

- Node.js (v22.x or later)
- npm

## Running the Application

1. Install dependencies from the project root:

   ```bash
   npm install
   ```

2. Start both backend and frontend development servers concurrently:

   ```bash
   npm run dev
   ```

3. Open the web interface at the address printed in the console (usually `http://localhost:5173`).

## Running Tests

To execute the unit tests and verify the mathematical and formatting logic:

```bash
npm run test
```

## Manual Verification Steps

1. Navigate to the Weight Dashboard page.
2. Verify that the weight metrics display 6 cards in this order:
   - **Última medição** (e.g. `80.0 kg - 17/06 15:00`)
   - **Peso atual** (e.g. `75.0 kg`)
   - **Perda total** (e.g. `-5.0 kg`)
   - **Perda semanal (7d)** (e.g. `-0.5 kg/sem`)
   - **Perda semanal (30d)** (e.g. `-0.2 kg/sem`)
   - **Perda semanal (Total)** (e.g. `-0.1 kg/sem`)
3. Verify responsiveness:
   - View the dashboard on a desktop (should display full row or grid).
   - Toggle browser developer tools to mobile view (e.g., iPhone SE/12 width) and verify that the layout wraps nicely and is fully readable.
