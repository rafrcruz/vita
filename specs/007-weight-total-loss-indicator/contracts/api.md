# API Contract: Weight Total Loss Indicator

No API changes or database schema migrations are required for this feature. All computations are handled on the frontend client using the existing weight history dataset fetched via:

- **Endpoint**: `GET /api/weight?timeframe=all`
- **Response format**: Array of `WeightLog` elements.
