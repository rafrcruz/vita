import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { buildOpenApiDocument } from './openapi';

// Documentação interativa da API em /api/docs (Swagger UI), gerada dos schemas Zod.
export const docsRouter: Router = Router();

const document = buildOpenApiDocument();

docsRouter.get('/openapi.json', (_req, res) => {
  res.json(document);
});

docsRouter.use('/', swaggerUi.serve);
docsRouter.get('/', swaggerUi.setup(document));
