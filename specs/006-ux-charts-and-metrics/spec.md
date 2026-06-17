# Feature Specification: UX, Charts, and Metrics Improvements

**Feature Branch**: `006-ux-charts-and-metrics`

**Created**: 2026-06-17

**Status**: Draft

**Input**: User description: "no desktop, ao clicar no adicionar peso ou adicionar pressão, está com um efeito que parece que o modal vem vindo de baixo... na animação... eu acho q poderia trocar por talvez um fade aparecendo ao centro? ao inves de parecer que ta vindo de baixo? nao tenho certeza, mas tente melhorar para ficar mais legal essa animação.

Na tela de perfil, a experiencia ta muito ruim de usar o datepicker para o campo data de nascimento... trocar por outra forma... talvez digitação igual no desktop... pensa por exemplo que minha data de nascimento é 13/02/1988... e estamos em 2026... nao da pra ficar voltando os meses até fevereiro de 88... essa experiencia precisa melhorar.

Os registros que faço no sistema sempre tem dia e hora. E vai ser comum eu fazer varias medidas ao dia. Então o eixo X nao deveria ser uma exibição diaria... hoje, mesmo quando eu coloco a visualização em 7D, no eixo X tá aparecendo só dia... deveria tá considerando horario também.

Eu acho que nos graficos também tanto no tema claro quando no escuro, os valores do eixo Y estão muito apagados, dificeis de ver.

Além disso, eu acho que poderiam aparecer alguns indicadores abaixo do grafico, tipo o que hoje aparece lá ultima medição.

Para peso:
Ultima medição: coforme tá hoje.
Peso atual: o menor peso registrado no ultimo dia onde tem dados.
Média de Perda Semanal (total): média da perda de peso semanal, considerando todo periodo até agora;
Média de Perda Semanal (30d): média da perda de peso semanal, considerando os ultimos 30 dias.
Média de Perda Semanal (7d): média da perda de peso semanal, considerando os ultimos 7 dias.

para calcular a media de perda semanal, penso em ser dessa forma:
pego a data inicio e a data fim do intervalo.
pego o peso na data inicio e o peso na data fim. 
para encontrar o peso na data inicio, eu olharia:
1. se tem registro de peso na data inicio, pegar o menor peso daquele dia;
2. se não tem registro naquele dia, mas tem registro anterior, pegar da data anterior mais proxima, o menor valor daquele dia.
3. se nao tem registro de peso na data inicio, nem anterior a data inicio, pegar o dia mais proximo posterior a data inicio, e pegar o menor peso do dia.

para o peso na data final, eu pego o ultimo dia que teve registro, e pego o menor peso daquele dia.

com os pesos na data inicio e na data fim, eu calculo a média de perda de peso diária. 
para transformar em semanal, eu multiplico a perda de peso diaria por 7.


Para pressão, nós vamos mostrar a ultima mediçaõ, e  a média para o periodo completo, para 30 dias e para 7 dias, da sistolica e da diastolica.
diferente do peso, aqui nao tera uma regra especial, nos vamos fazer uma media considerando todas as medições disponiveis no intervalo.

O botão de Sair também poderia ter um iconezinho de saida."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Birthdate Input Usability (Priority: P1)

As a user updating my profile, I want to type my birthdate directly in a standardized text format (e.g., "DD/MM/YYYY") using the keyboard, so that I can easily enter dates far in the past without scrolling through months on a calendar datepicker.

**Why this priority**: High impact on the profile setup experience, avoiding frustration when dealing with historical dates.

**Independent Test**: Go to the Profile screen, select the birthdate field, and type "13/02/1988". Ensure the field accepts it and validates it correctly.

**Acceptance Scenarios**:

1. **Given** the Profile screen is open, **When** the user clicks on the birthdate input, **Then** they should be able to type the date directly using a numeric mask (DD/MM/YYYY).
2. **Given** the birthdate input contains an invalid date format (e.g. "35/15/1988"), **When** the user tries to save the profile, **Then** the system displays a clear validation error.
3. **Given** a user inputs a birthdate in the future, **When** the user tries to save, **Then** the system displays a validation error.

---

### User Story 2 - Advanced Weight & Blood Pressure Analytics (Priority: P1)

As a health-conscious user, I want to view calculated metrics (such as weekly weight loss averages and blood pressure averages for 7-day, 30-day, and total periods) beneath the charts, so that I can track my health trends accurately.

**Why this priority**: Essential feature requested to gain deeper insights into weight loss trends and blood pressure patterns.

**Independent Test**: Add multiple weight records on different days, then check the calculated indicators displayed underneath the weight chart to ensure they compute correct values following the specified business rules.

**Acceptance Scenarios**:

1. **Given** the weight dashboard is open, **When** metrics are calculated, **Then** the weight metrics cards display:
   - Last measurement (with date/time)
   - Current weight (lowest weight of the last day with records)
   - Weekly Average Loss (Total, Last 30 Days, Last 7 Days) following the fallback logic for Start Weight and End Weight.
2. **Given** the blood pressure dashboard is open, **When** metrics are calculated, **Then** the pressure metrics cards display:
   - Last measurement (systolic / diastolic, with date/time)
   - Arithmetic averages of all available systolic and diastolic measurements within the periods (Total, Last 30 Days, Last 7 Days).

---

### User Story 3 - Detailed Chart Time Resolution & Readability (Priority: P2)

As a user who records multiple measurements on the same day, I want the charts to display specific times on the X-axis (rather than just the date) and have high-contrast Y-axis values, so that I can clearly read my progress.

**Why this priority**: Improves information density and readability of charts under both light and dark themes.

**Independent Test**: Input multiple measurements on the same day, open the dashboard, and verify that the chart X-axis labels distinguish these entries by showing time information, and check that the Y-axis numbers have strong visual contrast.

**Acceptance Scenarios**:

1. **Given** multiple measurements recorded on the same day, **When** viewing the chart (even in 7D view), **Then** the X-axis labels include time information (e.g. "DD/MM HH:MM" or "HH:MM") to resolve daily collisions.
2. **Given** either light or dark theme active, **When** viewing any chart, **Then** the values on the Y-axis have sufficient visual contrast to be easily readable.

---

### User Story 4 - Premium Modal Animations & Exit Button Visuals (Priority: P3)

As a user navigating the interface, I want the modal transitions to feel premium (using a centered fade-in rather than sliding from the bottom) and the logout action to have a clear exit icon, so that the application feels modern and intuitive.

**Why this priority**: Polish/delight features that enhance application aesthetics and navigation cues.

**Independent Test**: Click "Add Weight" or "Add Pressure" and verify the modal fades in centered. Look at the Logout ("Sair") button and verify it displays an exit/sign-out icon.

**Acceptance Scenarios**:

1. **Given** the user triggers the "Add Weight" or "Add Pressure" modal, **When** the modal appears, **Then** it performs a centered fade-in/scale-up animation.
2. **Given** the navigation or profile menu is visible, **When** looking at the "Sair" button, **Then** an exit icon is displayed adjacent to the text.

---

### Edge Cases

- **Zero records in interval**: When calculating weight loss or pressure averages for a period (e.g., last 7 days) and there are no records at all in the system, how does it render? (Should display "N/A" or "0.0 kg" with a safe fallback).
- **Single record in system**: When only one weight record exists, the Start Weight and End Weight will resolve to the same record. The daily weight loss should calculate to 0.0 kg/week without throwing division-by-zero or negative interval errors.
- **Interval has 0 days difference**: If Start Date matches End Date, the difference in days is 0. Division by zero must be prevented.
- **Incomplete date typing**: If the user leaves the birthdate field half-filled (e.g., "13/02/19__"), saving should be blocked by validation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001 (Centered Modal Animation)**: The modal component for adding weight and blood pressure measurements MUST fade/scale in from the center of the viewport instead of sliding up from the bottom.
- **FR-002 (Keyboard Date Birth Input)**: The birthdate field in the user profile MUST be a keyboard-based text input using a format mask (DD/MM/YYYY), eliminating the calendar datepicker.
- **FR-003 (Chart X-Axis Granularity)**: The X-axis of both Weight and Blood Pressure charts MUST display time indicators (e.g. HH:MM) when multiple measurements occur on the same day, preventing overlap or single-point aggregation.
- **FR-004 (Chart Y-Axis Contrast)**: Chart Y-axis labels and scales MUST use high-contrast color values in both light and dark modes to ensure readability.
- **FR-005 (Logout Button Exit Icon)**: The logout button ("Sair") MUST display a standard exit/sign-out icon next to the label.
- **FR-006 (Weight Analytics Metrics)**: The weight details section MUST display:
  - **Last Measurement**: Date, time, and weight of the latest entry.
  - **Current Weight**: The lowest weight recorded on the most recent day containing data.
  - **Weekly Average Loss (Total, 30d, 7d)**: Calculated according to the specific start/end weight retrieval rules.
- **FR-007 (Weight Loss Start/End Weight Selection Logic)**:
  - **Start Date** is defined as today minus N days (where N is 7 or 30), or the date of the first record for "Total".
  - **End Date** is defined as the date of the latest weight record in the database.
  - **Start Weight** is retrieved using the following ordered priority:
    1. The lowest weight recorded on the exact Start Date.
    2. If no record exists on the Start Date, search backwards to find the closest calendar date before the Start Date that has records, and use the lowest weight of that day.
    3. If no record exists on or before the Start Date, search forwards to find the closest calendar date after the Start Date that has records, and use the lowest weight of that day.
  - **End Weight** is defined as the lowest weight recorded on the End Date.
- **FR-008 (Weight Loss Calculation Formula)**:
  - `Daily Loss Rate = (Start Weight - End Weight) / (End Date - Start Date in days)`
  - If `End Date - Start Date` is 0 or negative, `Daily Loss Rate` MUST be 0.
  - `Weekly Loss Rate = Daily Loss Rate * 7`.
- **FR-009 (Blood Pressure Analytics Averages)**: The blood pressure details section MUST display:
  - **Last Measurement**: Systolic, diastolic, date, and time of the latest entry.
  - **Arithmetic Averages (Total, 30d, 7d)**: The standard arithmetic mean of all systolic and diastolic measurements recorded strictly within each period. No closest-date fallbacks are applied.
- **FR-010 (Test Coverage for Calculations)**: The calculation logic for weight loss and blood pressure averages MUST be covered by unit tests (as per Principle VII - Testes Orientados a Risco) to guarantee correct behavior under all boundary conditions.

### Key Entities *(include if feature involves data)*

- **UserProfile**: Represents user preferences, including the `birthdate` attribute.
- **WeightRecord**: Represents a single weight measurement, containing `weight` (numeric value), `date` (date/time of recording).
- **BloodPressureRecord**: Represents a blood pressure measurement, containing `systolic` (numeric), `diastolic` (numeric), `date` (date/time of recording).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can enter and save their birthdate in under 5 seconds, compared to the previous calendar datepicker which took over 30 seconds for historical dates.
- **SC-002**: Y-axis labels on all charts achieve a WCAG AA contrast ratio of at least 4.5:1 against the dashboard background in both light and dark modes.
- **SC-003**: 100% of the unit tests for weight loss and blood pressure calculations pass, validating correct outputs for edge cases (zero records, single record, multiple records on start/end dates).
- **SC-004**: Loading of calculated metrics below the charts takes less than 150ms on dashboard render.

## Assumptions

- We assume standard JavaScript Date operations or libraries (like date-fns, dayjs, etc.) are available or can be configured to manage date comparisons.
- The charts are rendered using a charting library (like Recharts, Chart.js, etc.) that allows custom formatting of X-axis labels and styling of Y-axis ticks.
- Date input field masking will support common browser keyboard events and standard paste operations.
