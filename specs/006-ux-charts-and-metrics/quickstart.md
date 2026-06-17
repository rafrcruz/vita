# Quickstart & Validation Guide: UX, Charts, and Metrics Improvements

This guide outlines runnable scenarios to validate the implementation of the UI animations, date-of-birth input text masking, chart granularity adjustments, high-contrast axes, and analytical metrics.

---

## Prerequisites

1. **Development Server Running**:
   - Backend API: `npm run dev` in `apps/api/` (running on `http://localhost:3001` or Vercel local proxy).
   - Frontend Web: `npm run dev` in `apps/web/` (running on `http://localhost:5173`).
2. **User Authentication**:
   - The user must be authenticated via Google OAuth.

---

## Validation Scenarios

### Scenario 1: Modal Transition Animation

Validate that the modal animate transition has been polished to fade in centered on desktop.

1. Navigate to the main dashboard (`/`).
2. On a desktop browser (screen width >= 640px), click the "Adicionar Peso" or "Adicionar Pressão" floating buttons.
3. **Expected Outcome**:
   - The modal appears in the exact center of the screen.
   - The transition is a smooth centered fade-in + slight scale-up (`scale(0.95)` to `scale(1.0)`).
   - The modal does NOT jump or slide up from the bottom of the viewport.

---

### Scenario 2: Birthdate Keyboard Text Masking

Validate that the birthdate field in Profile screen supports typing with text mask.

1. Navigate to the Profile screen (`/profile`).
2. Click inside the "Data de nascimento" input field.
3. Verify that the input is a text/masked input and allows typing directly from the keyboard.
4. Type `13021988`.
5. **Expected Outcome**:
   - The field automatically formats the typed numbers as `13/02/1988` (inserting slashes at indexes 2 and 5).
   - The field does not allow entering letters or special characters.
   - The field limits input to 10 characters (`DD/MM/YYYY`).
6. Try saving. Verify profile saves successfully.
7. Try typing an invalid date like `31/02/2026` or a future date. Press Save.
8. **Expected Outcome**: A clear error validation message is shown below the input, and saving is blocked.

---

### Scenario 3: Chart Granularity and High Contrast

Validate that the charts display time markers on duplicate days and the Y-axis labels have sufficient contrast.

1. Navigate to the dashboard.
2. Click "Adicionar Peso" and register `80 kg` with retroactivity: select custom date as `Today, 10:00 AM`.
3. Click "Adicionar Peso" again and register `79.5 kg` with custom date as `Today, 02:00 PM`.
4. Select the `7D` timeframe.
5. **Expected Outcome**:
   - The X-axis displays separate ticks showing the time (e.g. `17/06 10:00` and `17/06 14:00`).
   - The Y-axis numbers/labels are clearly readable and high contrast in both light and dark themes (not faded with 0.20 opacity).

---

### Scenario 4: Analytical Health Indicators

Validate that weight loss average calculations and blood pressure averages calculate correctly following specific formula priorities.

1. Navigate to the weight dashboard.
2. Verify the indicators block below the chart displays:
   - **Última medição**: Weight value, date, and time of the latest log.
   - **Peso atual**: The lowest weight logged on the most recent day containing weight data.
   - **Média de Perda Semanal (Total / 30D / 7D)**: Computes the loss rate by querying historical weights, finding the start weight (exact match, closest earlier date fallback, or closest later date fallback), subtracting the end weight (lowest weight of latest day), dividing by days, and multiplying by 7.
3. Switch to the pressure dashboard.
4. Verify the indicators block below the chart displays:
   - **Última medição**: Systolic and diastolic values, date, and time of the latest BP log.
   - **Médias (Total / 30D / 7D)**: Arithmetic mean of all systolic and diastolic measurements in the selected timeframe.

---

## Running Automated Tests

Run the following command to test the mathematical helper functions for weight loss formula selection and blood pressure calculations:

```bash
# Run frontend unit tests (which should include tests for calculation formulas)
npm run test --prefix apps/web
```
