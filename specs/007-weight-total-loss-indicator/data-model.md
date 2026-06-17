# Data Model: Weight Total Loss Indicator

This document describes the existing entities and fields utilized by the Weight Total Loss Indicator. There are no database schema changes required for this feature.

## Entities

### `WeightRecord` (Existing Entity)

Represents a single weight log recorded by the user.

| Field Name | Type | Description | Constraints |
|------------|------|-------------|-------------|
| `id` | String | Unique identifier | Primary Key (UUID) |
| `weight` | Number | Recorded weight in kg | Greater than 0 |
| `loggedAt` | Date/String | Timestamp of the measurement | Date in ISO format or Date object |

### Metric Calculations Payload

The calculations are performed in-memory on the client-side. The computed metrics object contains:

* `lastEntry`: The chronologically latest `WeightRecord`.
* `currentWeight`: The lowest weight recorded on the latest day containing data.
* `totalLoss`: The total weight change between the chronologically earliest weight record and the current weight.
* `weeklyLossTotal`: The weekly rate of weight change over the entire history.
* `weeklyLoss30d`: The weekly rate of weight change over the last 30 days.
* `weeklyLoss7d`: The weekly rate of weight change over the last 7 days.
