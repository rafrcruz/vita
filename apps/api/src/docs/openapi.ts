import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { allowlistCreateSchema, allowlistEntrySchema, currentUserSchema } from '@vita/shared';

extendZodWithOpenApi(z);

const healthSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  db: z.enum(['up', 'down']).optional(),
  time: z.string(),
});

const errorSchema = z.object({
  error: z.object({ code: z.string(), message: z.string() }),
});

/** Constrói o documento OpenAPI da fundação a partir dos schemas Zod (fonte única). */
export function buildOpenApiDocument() {
  const registry = new OpenAPIRegistry();

  const CurrentUser = registry.register('CurrentUser', currentUserSchema);
  const AllowlistEntry = registry.register('AllowlistEntry', allowlistEntrySchema);
  const AllowlistCreate = registry.register('AllowlistCreate', allowlistCreateSchema);
  const Health = registry.register('Health', healthSchema);
  const ApiError = registry.register('Error', errorSchema);

  registry.registerPath({
    method: 'get',
    path: '/api/health',
    summary: 'Verificação de saúde (inclui estado do banco)',
    responses: {
      200: { description: 'Saudável', content: { 'application/json': { schema: Health } } },
      503: { description: 'Degradado', content: { 'application/json': { schema: Health } } },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/auth/google',
    summary: 'Inicia o fluxo OAuth (redireciona ao Google)',
    responses: { 302: { description: 'Redirecionamento' } },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/auth/google/callback',
    summary: 'Callback OAuth: valida, checa allowlist e emite sessão',
    responses: {
      302: { description: 'Sucesso (cookie de sessão)' },
      403: { description: 'Fora da allowlist / state inválido' },
    },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/auth/me',
    summary: 'Usuário da sessão atual',
    responses: {
      200: { description: 'Autenticado', content: { 'application/json': { schema: CurrentUser } } },
      401: { description: 'Sem sessão', content: { 'application/json': { schema: ApiError } } },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/api/auth/logout',
    summary: 'Encerra a sessão',
    responses: { 204: { description: 'Sessão encerrada' } },
  });

  registry.registerPath({
    method: 'get',
    path: '/api/allowlist',
    summary: 'Lista a allowlist (admin)',
    responses: {
      200: {
        description: 'Lista',
        content: { 'application/json': { schema: z.array(AllowlistEntry) } },
      },
      401: { description: 'Sem sessão' },
      403: { description: 'Não-admin' },
    },
  });

  registry.registerPath({
    method: 'post',
    path: '/api/allowlist',
    summary: 'Adiciona um e-mail (admin)',
    request: {
      body: { content: { 'application/json': { schema: AllowlistCreate } } },
    },
    responses: {
      201: { description: 'Criado', content: { 'application/json': { schema: AllowlistEntry } } },
      400: { description: 'Inválido' },
      409: { description: 'E-mail já existente' },
    },
  });

  registry.registerPath({
    method: 'delete',
    path: '/api/allowlist/{id}',
    summary: 'Remove uma entrada (admin)',
    request: { params: z.object({ id: z.string().uuid() }) },
    responses: {
      204: { description: 'Removido' },
      409: { description: 'Operação proibida (último admin)' },
    },
  });

  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: '3.0.0',
    info: { title: 'VITA Foundation API', version: '0.1.0' },
  });
}
