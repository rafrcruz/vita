# Quickstart & Validation Guide: Weight & Blood Pressure Tracking

This guide outlines runnable scenarios to validate the implementation of weight and blood pressure tracking.

---

## Prerequisites

1. **Development Server Running**:
   - Backend API: `npm run dev` in `apps/api/` (running on `http://localhost:3001` or Vercel local proxy).
   - Frontend Web: `npm run dev` in `apps/web/` (running on `http://localhost:5173`).
2. **User Authentication**:
   - The user must be authenticated via Google OAuth and listed in the database `allowlist` table.

---

## Validation Scenarios

### Scenario 1: Quick Weight Entry (One-handed flow & parsing)
Validate that a user can quickly register a weight, and that the decimal parser correctly handles Portuguese formatting.

1. Navigate to the main dashboard (`/`).
2. Verify that the quick action buttons "Adicionar Peso" and "Adicionar Pressão" are visible in the thumb zone.
3. Click "Adicionar Peso". A capture overlay/modal should open.
4. Verify that the weight field is focused automatically and that mobile browsers prompt a decimal numeric keyboard (thanks to `inputmode="decimal"`).
5. Type `82,4` (Portuguese comma notation) and press Save.
6. **Expected Outcome**:
   - The modal closes.
   - A success notification (toast) is shown.
   - The backend parses the value to float `82.4` and saves it with the current date/time.
   - The chart immediately redraws to show the new data point.
7. Repeat the test typing `80.8` (standard dot notation) and verify success.

---

### Scenario 2: Quick Blood Pressure Entry
Validate logging of paired systolic and diastolic pressure values.

1. Click the "Adicionar Pressão" button on the dashboard.
2. The capture modal should open, focusing the "Sistólica (SYS)" input.
3. Type `120`, press Tab or click Next, type `80` in the "Diastólica (DIA)" input, and press Save.
4. **Expected Outcome**:
   - The modal closes.
   - A success toast is displayed.
   - The record is stored with `systolic=120`, `diastolic=80`, and the current timestamp.

---

### Scenario 3: Chart Filtering & Empty States
Validate correct visualization of charts, including empty states and timeframe controls.

1. **No Data State**:
   - Log in with a clean test user who has no entries.
   - The dashboard charts should show empty axes with the text: `"Sem dados cadastrados"`.
2. **Timeframe Toggling**:
   - Log several weight entries over a simulated multi-month period (or mock them in database).
   - Tap the timeframe filter buttons above the chart: "7D", "30D", "Tudo".
   - **Expected Outcome**:
     - Selecting "7D" shows only entries from the last 7 days.
     - Selecting "30D" shows entries from the last 30 days.
     - Selecting "Tudo" (default) shows the entire historical trend.
     - Graph updating occurs smoothly in less than 150ms.

---

### Scenario 4: Log Management (Edit / Delete)
Validate auditing and cleanup of past entries.

1. Click on the navigation menu and select "Histórico" to open the dedicated history page `/history`.
2. Verify that Weight and Blood Pressure logs are shown in chronological decrescente order (newest first).
3. Click the "Editar" icon next to a weight entry. Update the value (e.g. from `82.4` to `81.9`) and press Save.
   - **Expected Outcome**: The value updates in the list and database.
4. Click the "Excluir" icon on any record. Confirm the action in the prompt.
   - **Expected Outcome**: The record is removed from the database and disappears from the history list and dashboard charts.

---

## Running Automated Tests

Run the following command in the repository root to validate backend validation, decimal parsing, and query filters:

```bash
# Run backend tests for the health metrics package
npm run test --prefix apps/api health_metrics

# Run frontend tests for modal inputs and charts
npm run test --prefix apps/web
```
