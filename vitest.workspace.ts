import { defineWorkspace } from 'vitest/config';

// Aggregates the per-workspace Vitest configs so `npm run test` runs everything.
export default defineWorkspace(['apps/api/vitest.config.ts', 'apps/web/vitest.config.ts']);
