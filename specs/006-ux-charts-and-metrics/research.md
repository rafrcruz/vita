# Research: UX, Charts, and Metrics Improvements

## 1. Modal Animations

### Investigation

The modals for weight and blood pressure use `@radix-ui/react-dialog` inside `apps/web/src/components/ui/dialog.tsx`.
The `DialogContent` has the class:
`fixed left-[50%] top-4 z-50 ... duration-200 ... sm:top-[50%] sm:translate-y-[-50%] sm:rounded-lg`

When the modal opens on desktop, it transitions from `top-4 translate-y-0` (the default mobile positioning) to `sm:top-[50%] sm:translate-y-[-50%]`. Because the class `duration-200` is present, the browser animates this change in the layout properties (`top` and `transform`), making the modal look like it's sliding from the top/bottom into the center.

### Selected Solution

- **Decision**: Separate the transition classes so they do not animate layout coordinates (`top` / `translate`).
- **Implementation details**:
  - Ensure that layout properties do not transition by restricting the transition style.
  - Or, set `data-[state=open]:animate-in` with `data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95` and `data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0` specifically targeting opacity and scale.
  - On desktop, we can prevent position interpolation by applying a clean translation starting state, or by avoiding `duration-200` transitions on positional classes.

---

## 2. Profile Date of Birth Picker UX

### Investigation

The current Profile date field uses a native browser date picker (`<Input type="date" />`). On mobile, this pops up a calendar or scroll wheel, which is extremely frustrating when navigating decades into the past (e.g., from 2026 to 1988).

### Selected Solution

- **Decision**: Replace the date picker with a keyboard-based text input featuring a client-side layout mask (`DD/MM/YYYY`).
- **Format Conversion**:
  - **Read (from database/API)**: Converts `YYYY-MM-DD` string into display format `DD/MM/YYYY`.
  - **Write (to database/API)**: Converts typed `DD/MM/YYYY` back to `YYYY-MM-DD` before validating and sending to the API.
- **Typing Mask**:
  - Use a text pattern filter that allows only numbers, limits input to 8 digits, and inserts `/` automatically after the 2nd and 5th digits.

---

## 3. Chart Axis Polish

### Investigation

1. **X-Axis**: The chart is an inline SVG, rendering X labels based on `formatTick`. For users registering multiple entries on the same day, this produces duplicate X-axis labels (e.g., multiple "17/06" labels), causing visual confusion.
2. **Y-Axis**: The text labels were grouped with horizontal lines, inheriting `opacity-20` and reducing readability.

### Selected Solution

- **X-Axis Representation**:
  - **Weight Chart**: Displays daily dates (no times) on `Tudo`/`30D` views, showing only the lowest logged weight of the day for same-day duplicates. Displays date and time (`DD/MM HH:MM`) on `7D` view for all points.
  - **Blood Pressure Chart**: Always displays all measurements across all timeframes (`7D`, `30D`, and `Tudo`) with date and time (`DD/MM HH:MM`).
- **Y-Axis Contrast**: Position Y-axis `<text>` labels as sibling elements outside of the `opacity-20` `<line>` elements to ensure high contrast.

---

## 4. Revised Weight Loss Calculation

### Investigation

The old fallback date lookup logic was complex and didn't represent steady weight progression. A daily linear interpolation method creates a continuous timeline of daily weights between the first and last logged dates, permitting a mathematically robust average rate calculation for any query sub-interval.

### Selected Solution

- **Daily Timeline Construction**: For days containing weight records, select the lowest recorded weight of that day. For intermediate days with no logs, linearly interpolate their weight using the closest preceding and succeeding logged days.
- **Period Averages**: For a query interval $[D_{start}, D_{end}]$, intersect it with the active bounds $[D_{min}, D_{max}]$. If the intersection span is at least 1 day, the weekly rate is $\frac{W(D'_2) - W(D'_1)}{\text{Days}(D'_2 - D'_1)} \times 7$. If there's no intersection or less than 1 day difference, the rate is `0.0 kg/sem`.

---

## 5. Weekly Weight Change Formatting Sign

### Investigation

Displaying weight loss rates as positive numbers prefixed with `+` (e.g., `+0.6 kg/sem`) is confusing because users interpret `+` as gaining weight.

### Selected Solution

- **Formatting Signs**: Display weight changes using standard arithmetic signs: a decrease in weight (negative difference) displays with a minus (`-`) sign (e.g., `-0.6 kg/sem`), and an increase in weight displays with a plus (`+`) sign (e.g., `+0.3 kg/sem`). A zero difference displays as `0.0 kg/sem`.
