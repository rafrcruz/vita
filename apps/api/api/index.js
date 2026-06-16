var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/observability/sentry.ts
import * as Sentry from "@sentry/node";

// src/config/env.ts
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { config as loadDotenv } from "dotenv";
import { z } from "zod";
var rootEnv = resolve(process.cwd(), "../../.env");
if (existsSync(rootEnv)) {
  loadDotenv({ path: rootEnv });
} else {
  loadDotenv();
}
var EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  WEB_ORIGIN: z.string().url().default("http://localhost:5173"),
  // Obrigatório desde o MVP — usado para assinar o JWT de sessão.
  JWT_SECRET: z.string().min(32, "JWT_SECRET deve ter ao menos 32 caracteres"),
  SESSION_COOKIE_NAME: z.string().min(1).default("vita_session"),
  // Opcionais agora; tornam-se necessários nas suas respectivas user stories.
  DATABASE_URL: z.string().url().optional(),
  // US2 (Neon)
  GOOGLE_CLIENT_ID: z.string().optional(),
  // US3
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  // US3
  OAUTH_REDIRECT_URI: z.string().url().optional(),
  // US3
  ADMIN_EMAILS: z.string().optional(),
  // US3
  SENTRY_DSN: z.string().optional()
  // US4
});
function parseEnv(source) {
  const cleaned = Object.fromEntries(
    Object.entries(source).map(([key, value]) => [key, value === "" ? void 0 : value])
  );
  return EnvSchema.safeParse(cleaned);
}
function loadEnv() {
  const parsed = parseEnv(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
    console.error(`
[config] Vari\xE1veis de ambiente inv\xE1lidas:
${issues}
`);
    process.exit(1);
  }
  return parsed.data;
}
var env = loadEnv();
var isProduction = env.NODE_ENV === "production";

// src/observability/sentry.ts
var initialized = false;
function initSentry() {
  if (initialized || !env.SENTRY_DSN) return false;
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: 0.1,
    sendDefaultPii: false,
    beforeSend(event) {
      if (event.request?.cookies) delete event.request.cookies;
      if (event.request?.headers) {
        delete event.request.headers["authorization"];
        delete event.request.headers["cookie"];
      }
      return event;
    }
  });
  initialized = true;
  return true;
}
function captureException2(err) {
  if (initialized) Sentry.captureException(err);
}

// src/app.ts
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

// src/middleware/logging.ts
import { pinoHttp } from "pino-http";
import pino from "pino";
var REDACT_PATHS = [
  "req.headers.authorization",
  "req.headers.cookie",
  'res.headers["set-cookie"]',
  "req.body.password",
  "req.body.token",
  "*.password",
  "*.secret",
  "*.token"
];
var logger = pino({
  level: env.NODE_ENV === "test" ? "silent" : isProduction ? "info" : "debug",
  redact: { paths: REDACT_PATHS, remove: true }
});
var httpLogger = pinoHttp({ logger });

// src/middleware/error.ts
var AppError = class extends Error {
  status;
  code;
  constructor(status, code, message) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
};
var notFoundHandler = (_req, res) => {
  const body = { error: { code: "not_found", message: "Recurso n\xE3o encontrado" } };
  res.status(404).json(body);
};
var errorHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    logger.warn({ code: err.code, status: err.status }, err.message);
    const body2 = { error: { code: err.code, message: err.message } };
    res.status(err.status).json(body2);
    return;
  }
  logger.error({ err }, "Erro n\xE3o tratado");
  captureException2(err);
  const body = {
    error: {
      code: "internal_error",
      message: isProduction ? "Erro interno" : err instanceof Error ? err.message : "Erro interno"
    }
  };
  res.status(500).json(body);
};

// src/health/health.route.ts
import { Router } from "express";

// src/db/client.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql as sql2 } from "drizzle-orm";

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  allowlist: () => allowlist
});
import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
var allowlist = pgTable(
  "allowlist",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    role: text("role", { enum: ["admin", "member"] }).notNull().default("member"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    createdBy: text("created_by")
  },
  (table) => [
    // Unicidade case-insensitive por e-mail.
    uniqueIndex("allowlist_email_lower_unique").on(sql`lower(${table.email})`)
  ]
);

// src/db/client.ts
function requireDatabaseUrl() {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL n\xE3o configurada (necess\xE1ria a partir da US2).");
  }
  return env.DATABASE_URL;
}
var client = neon(requireDatabaseUrl());
var db = drizzle(client, { schema: schema_exports });
async function checkDatabase() {
  try {
    await db.execute(sql2`select 1`);
    return true;
  } catch {
    return false;
  }
}

// src/health/health.route.ts
var healthRouter = Router();
healthRouter.get("/", async (_req, res) => {
  const dbUp = await checkDatabase();
  const body = {
    status: dbUp ? "ok" : "degraded",
    db: dbUp ? "up" : "down",
    time: (/* @__PURE__ */ new Date()).toISOString()
  };
  res.status(dbUp ? 200 : 503).json(body);
});

// src/auth/auth.route.ts
import { randomBytes } from "node:crypto";
import { Router as Router2 } from "express";

// src/middleware/async.ts
var asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// src/allowlist/allowlist.service.ts
import { eq, sql as sql3 } from "drizzle-orm";
function normalizeEmail(email) {
  return email.trim().toLowerCase();
}
function assertCanRemove(entry, adminCount) {
  if (entry.role === "admin" && adminCount <= 1) {
    throw new AppError(409, "last_admin", "N\xE3o \xE9 poss\xEDvel remover o \xFAltimo administrador.");
  }
}
async function listEntries() {
  return db.select().from(allowlist).orderBy(allowlist.createdAt);
}
async function getRole(email) {
  const rows = await db.select({ role: allowlist.role }).from(allowlist).where(sql3`lower(${allowlist.email}) = ${normalizeEmail(email)}`).limit(1);
  return rows[0]?.role ?? null;
}
async function addEntry(input, createdBy) {
  try {
    const [row] = await db.insert(allowlist).values({ email: normalizeEmail(input.email), role: input.role, createdBy }).returning();
    return row;
  } catch (err) {
    if (err && typeof err === "object" && "code" in err && err.code === "23505") {
      throw new AppError(409, "email_exists", "Este e-mail j\xE1 est\xE1 na allowlist.");
    }
    throw err;
  }
}
async function countAdmins() {
  const rows = await db.select({ n: sql3`count(*)::int` }).from(allowlist).where(eq(allowlist.role, "admin"));
  return rows[0]?.n ?? 0;
}
async function removeEntry(id) {
  const [entry] = await db.select().from(allowlist).where(eq(allowlist.id, id)).limit(1);
  if (!entry) {
    throw new AppError(404, "not_found", "Entrada n\xE3o encontrada.");
  }
  assertCanRemove(entry, await countAdmins());
  await db.delete(allowlist).where(eq(allowlist.id, id));
}

// src/auth/google.ts
import { OAuth2Client } from "google-auth-library";
function oauthConfig() {
  const clientId = env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;
  const redirectUri = env.OAUTH_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    throw new AppError(500, "oauth_not_configured", "Autentica\xE7\xE3o Google n\xE3o configurada.");
  }
  return { clientId, clientSecret, redirectUri };
}
function createOAuthClient() {
  const { clientId, clientSecret, redirectUri } = oauthConfig();
  return new OAuth2Client({ clientId, clientSecret, redirectUri });
}
function buildAuthUrl(state) {
  return createOAuthClient().generateAuthUrl({
    access_type: "online",
    scope: ["openid", "email", "profile"],
    state,
    prompt: "select_account"
  });
}
async function exchangeCodeForEmail(code) {
  const { clientId } = oauthConfig();
  const client2 = createOAuthClient();
  const { tokens } = await client2.getToken(code);
  if (!tokens.id_token) {
    throw new AppError(401, "oauth_error", "Token de identidade ausente.");
  }
  const ticket = await client2.verifyIdToken({ idToken: tokens.id_token, audience: clientId });
  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw new AppError(401, "oauth_error", "E-mail n\xE3o retornado pelo Google.");
  }
  return { email: payload.email, emailVerified: payload.email_verified ?? false };
}

// src/auth/session.ts
import { SignJWT, jwtVerify } from "jose";
var secret = new TextEncoder().encode(env.JWT_SECRET);
var SESSION_TTL_SECONDS = 60 * 60 * 12;
var SESSION_COOKIE_NAME = env.SESSION_COOKIE_NAME;
async function issueSessionToken(claims) {
  return new SignJWT({ role: claims.role }).setProtectedHeader({ alg: "HS256" }).setSubject(claims.sub).setIssuedAt().setExpirationTime(`${SESSION_TTL_SECONDS}s`).sign(secret);
}
async function verifySessionToken(token) {
  const { payload } = await jwtVerify(token, secret);
  return { sub: String(payload.sub), role: payload.role };
}
function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS * 1e3
  };
}

// src/auth/middleware.ts
var requireAuth = async (req, _res, next) => {
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  if (!token) {
    next(new AppError(401, "unauthenticated", "Autentica\xE7\xE3o necess\xE1ria."));
    return;
  }
  try {
    const claims = await verifySessionToken(token);
    req.user = { email: claims.sub, role: claims.role };
    next();
  } catch {
    next(new AppError(401, "unauthenticated", "Sess\xE3o inv\xE1lida ou expirada."));
  }
};
var requireAdmin = (req, res, next) => {
  requireAuth(req, res, (err) => {
    if (err) {
      next(err);
      return;
    }
    if (req.user?.role !== "admin") {
      next(new AppError(403, "forbidden", "Acesso restrito a administradores."));
      return;
    }
    next();
  });
};

// src/auth/auth.route.ts
var authRouter = Router2();
var OAUTH_STATE_COOKIE = "vita_oauth_state";
var stateCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
  maxAge: 10 * 60 * 1e3
  // 10 min
};
authRouter.get(
  "/google",
  asyncHandler(async (_req, res) => {
    const state = randomBytes(16).toString("hex");
    res.cookie(OAUTH_STATE_COOKIE, state, stateCookieOptions);
    res.redirect(buildAuthUrl(state));
  })
);
authRouter.get(
  "/google/callback",
  asyncHandler(async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    const cookieState = req.cookies?.[OAUTH_STATE_COOKIE];
    if (!code || !state || !cookieState || state !== cookieState) {
      throw new AppError(403, "invalid_state", "Estado OAuth inv\xE1lido.");
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/" });
    const { email, emailVerified } = await exchangeCodeForEmail(code);
    if (!emailVerified) {
      throw new AppError(403, "email_unverified", "E-mail do Google n\xE3o verificado.");
    }
    const role = await getRole(email);
    if (!role) {
      res.status(403).type("html").send(
        '<!doctype html><meta charset="utf-8"><p>Acesso n\xE3o autorizado para este e-mail.</p><a href="/login">Voltar</a>'
      );
      return;
    }
    const token = await issueSessionToken({ sub: email.toLowerCase(), role });
    res.cookie(SESSION_COOKIE_NAME, token, sessionCookieOptions());
    res.redirect("/");
  })
);
authRouter.get("/me", requireAuth, (req, res) => {
  const user = req.user;
  res.json(user);
});
authRouter.post("/logout", (_req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME, { path: "/" });
  res.status(204).end();
});

// src/allowlist/allowlist.route.ts
import { Router as Router3 } from "express";

// ../../packages/shared/src/auth.ts
import { z as z2 } from "zod";
var roleSchema = z2.enum(["admin", "member"]);
var currentUserSchema = z2.object({
  email: z2.string().email(),
  role: roleSchema
});
var allowlistEntrySchema = z2.object({
  id: z2.string().uuid(),
  email: z2.string().email(),
  role: roleSchema,
  createdAt: z2.string(),
  createdBy: z2.string().nullable()
});
var allowlistCreateSchema = z2.object({
  email: z2.string().email(),
  role: roleSchema.default("member")
});

// src/allowlist/allowlist.route.ts
var allowlistRouter = Router3();
function toDto(row) {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    createdAt: row.createdAt.toISOString(),
    createdBy: row.createdBy
  };
}
allowlistRouter.use(requireAdmin);
allowlistRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const rows = await listEntries();
    res.json(rows.map(toDto));
  })
);
allowlistRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const parsed = allowlistCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, "invalid_body", "Dados inv\xE1lidos.");
    }
    const row = await addEntry(parsed.data, req.user?.email ?? null);
    res.status(201).json(toDto(row));
  })
);
allowlistRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (typeof id !== "string" || id.length === 0) {
      throw new AppError(400, "invalid_id", "Identificador inv\xE1lido.");
    }
    await removeEntry(id);
    res.status(204).end();
  })
);

// src/docs/docs.route.ts
import { Router as Router4 } from "express";
import swaggerUi from "swagger-ui-express";

// src/docs/openapi.ts
import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  extendZodWithOpenApi
} from "@asteasolutions/zod-to-openapi";
import { z as z3 } from "zod";
extendZodWithOpenApi(z3);
var healthSchema = z3.object({
  status: z3.enum(["ok", "degraded"]),
  db: z3.enum(["up", "down"]).optional(),
  time: z3.string()
});
var errorSchema = z3.object({
  error: z3.object({ code: z3.string(), message: z3.string() })
});
function buildOpenApiDocument() {
  const registry = new OpenAPIRegistry();
  const CurrentUser = registry.register("CurrentUser", currentUserSchema);
  const AllowlistEntry = registry.register("AllowlistEntry", allowlistEntrySchema);
  const AllowlistCreate = registry.register("AllowlistCreate", allowlistCreateSchema);
  const Health = registry.register("Health", healthSchema);
  const ApiError = registry.register("Error", errorSchema);
  registry.registerPath({
    method: "get",
    path: "/api/health",
    summary: "Verifica\xE7\xE3o de sa\xFAde (inclui estado do banco)",
    responses: {
      200: { description: "Saud\xE1vel", content: { "application/json": { schema: Health } } },
      503: { description: "Degradado", content: { "application/json": { schema: Health } } }
    }
  });
  registry.registerPath({
    method: "get",
    path: "/api/auth/google",
    summary: "Inicia o fluxo OAuth (redireciona ao Google)",
    responses: { 302: { description: "Redirecionamento" } }
  });
  registry.registerPath({
    method: "get",
    path: "/api/auth/google/callback",
    summary: "Callback OAuth: valida, checa allowlist e emite sess\xE3o",
    responses: {
      302: { description: "Sucesso (cookie de sess\xE3o)" },
      403: { description: "Fora da allowlist / state inv\xE1lido" }
    }
  });
  registry.registerPath({
    method: "get",
    path: "/api/auth/me",
    summary: "Usu\xE1rio da sess\xE3o atual",
    responses: {
      200: { description: "Autenticado", content: { "application/json": { schema: CurrentUser } } },
      401: { description: "Sem sess\xE3o", content: { "application/json": { schema: ApiError } } }
    }
  });
  registry.registerPath({
    method: "post",
    path: "/api/auth/logout",
    summary: "Encerra a sess\xE3o",
    responses: { 204: { description: "Sess\xE3o encerrada" } }
  });
  registry.registerPath({
    method: "get",
    path: "/api/allowlist",
    summary: "Lista a allowlist (admin)",
    responses: {
      200: {
        description: "Lista",
        content: { "application/json": { schema: z3.array(AllowlistEntry) } }
      },
      401: { description: "Sem sess\xE3o" },
      403: { description: "N\xE3o-admin" }
    }
  });
  registry.registerPath({
    method: "post",
    path: "/api/allowlist",
    summary: "Adiciona um e-mail (admin)",
    request: {
      body: { content: { "application/json": { schema: AllowlistCreate } } }
    },
    responses: {
      201: { description: "Criado", content: { "application/json": { schema: AllowlistEntry } } },
      400: { description: "Inv\xE1lido" },
      409: { description: "E-mail j\xE1 existente" }
    }
  });
  registry.registerPath({
    method: "delete",
    path: "/api/allowlist/{id}",
    summary: "Remove uma entrada (admin)",
    request: { params: z3.object({ id: z3.string().uuid() }) },
    responses: {
      204: { description: "Removido" },
      409: { description: "Opera\xE7\xE3o proibida (\xFAltimo admin)" }
    }
  });
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.0.0",
    info: { title: "VITA Foundation API", version: "0.1.0" }
  });
}

// src/docs/docs.route.ts
var docsRouter = Router4();
var document = buildOpenApiDocument();
docsRouter.get("/openapi.json", (_req, res) => {
  res.json(document);
});
docsRouter.use("/", swaggerUi.serve);
docsRouter.get("/", swaggerUi.setup(document));

// src/app.ts
function createApp() {
  const app = express();
  app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    const forwardedProto = req.header("x-forwarded-proto");
    if (isProduction && forwardedProto === "http") {
      res.redirect(308, `https://${req.header("host") ?? env.WEB_ORIGIN}${req.originalUrl}`);
      return;
    }
    next();
  });
  app.use(
    helmet({
      contentSecurityPolicy: false,
      hsts: isProduction ? {
        maxAge: 15552e3,
        includeSubDomains: true
      } : false
    })
  );
  app.use(
    cors({
      origin(origin, callback) {
        const isAllowed = !origin || origin === env.WEB_ORIGIN || origin === "http://localhost:5173" || /^https:\/\/vita-web.*\.vercel\.app$/.test(origin);
        callback(null, isAllowed);
      },
      credentials: true
    })
  );
  app.use(express.json());
  app.use(cookieParser());
  app.use(httpLogger);
  app.use("/api/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/allowlist", allowlistRouter);
  app.use("/api/docs", docsRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}

// api/index.ts
initSentry();
var index_default = createApp();
export {
  index_default as default
};
