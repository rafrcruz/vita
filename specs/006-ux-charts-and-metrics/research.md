# Research: UX, Charts, and Metrics Improvements

## 1. Modal Animations
### Investigation
The modals for weight and blood pressure use `@radix-ui/react-dialog` inside `apps/web/src/components/ui/dialog.tsx`. 
The `DialogContent` has the class:
`fixed left-[50%] top-4 z-50 ... duration-200 ... sm:top-[50%] sm:translate-y-[-50%] sm:rounded-lg`

When the modal opens on desktop, it transitions from `top-4 translate-y-0` (the default mobile positioning) to `sm:top-[50%] sm:translate-y-[-50%]`. Because the class `duration-200` is present, the browser animates this change in the layout properties (`top` and `transform`), making the modal look like it's sliding from the top/bottom into the center.

### Selected Solution
* **Decision**: Separate the transition classes so they do not animate layout coordinates (`top` / `translate`).
* **Implementation details**: 
  - Ensure that layout properties do not transition by restricting the transition style.
  - Or, set `data-[state=open]:animate-in` with `data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95` and `data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0` specifically targeting opacity and scale.
  - On desktop, we can prevent position interpolation by applying a clean translation starting state, or by avoiding `duration-200` transitions on positional classes.

---

## 2. Profile Date of Birth Picker UX
### Investigation
The current Profile date field uses a native browser date picker (`<Input type="date" />`). On mobile, this pops up a calendar or scroll wheel, which is extremely frustrating when navigating decades into the past (e.g., from 2026 to 1988).

### Selected Solution
* **Decision**: Replace the date picker with a keyboard-based text input featuring a client-side layout mask (`DD/MM/YYYY`).
* **Format Conversion**:
  - **Read (from database/API)**: Converts `YYYY-MM-DD` string into display format `DD/MM/YYYY`.
  - **Write (to database/API)**: Converts typed `DD/MM/YYYY` back to `YYYY-MM-DD` before validating and sending to the API.
* **Typing Mask**: 
  - Use a text pattern filter that allows only numbers, limits input to 8 digits, and inserts `/` automatically after the 2nd and 5th digits.

---

## 3. Chart Axis Polish
### Investigation
1. **X-Axis**: The chart is an inline SVG, rendering X labels based on `formatTick`. Currently, `formatTick` only displays `day/month` for all views other than long-term "Tudo". For users registering multiple entries on the same day, this produces duplicate X-axis labels (e.g., multiple "17/06" labels), causing visual confusion.
2. **Y-Axis**: The chart Y-axis labels are grouped with the horizontal dashed grid lines inside a `<g className="opacity-20">`. Because of this, the text labels inherit `opacity: 0.20`, making them extremely faint and illegible in both themes.

### Selected Solution
* **X-Axis Time Display**: Format ticks to include time (e.g. `DD/MM HH:MM`) if there are duplicate calendar days in the dataset or if the active timeframe is 7 days or shorter.
* **Y-Axis Contrast**: Remove the `<text>` elements from the `opacity-20` group, or apply opacity purely to the `<line>` elements, keeping the `<text>` values at full contrast using the text styling classes.
