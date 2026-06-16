import { createApp } from './app';
import { env } from './config/env';
import { logger } from './middleware/logging';

// Entry point para desenvolvimento local (servidor Express sempre ativo).
const app = createApp();

app.listen(env.PORT, () => {
  logger.info(`API ouvindo em http://localhost:${env.PORT} (health: /api/health)`);
});
