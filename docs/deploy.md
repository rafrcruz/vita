# VITA Deployment & CI/CD Guide

Este documento detalha o processo de deploy da aplicação VITA na Vercel e a configuração de proteção de branch no GitHub.

## 1. Configuração dos Projetos Vercel

O VITA é estruturado como um monorepo e seu deploy é feito em dois projetos separados na Vercel: um para o frontend (`apps/web`) e outro para o backend (`apps/api`).

URLs de produção atuais:
* Frontend: `https://vita-web-rho.vercel.app`
* Backend: `https://vita-api-eight.vercel.app`

O frontend (`apps/web/vercel.json`) reescreve `/api/:path*` para o backend, de modo
que o navegador sempre fala com a mesma origem (`vita-web-rho.vercel.app`) — isso é o
que permite o cookie de sessão `httpOnly` funcionar no fluxo OAuth.

### Projeto 1: Frontend (`vita-web`)
* **Root Directory**: `apps/web`
* **Framework Preset**: `Vite`
* **Build Command**: `npm run build`
* **Install Command**: `npm install`
* **Variáveis de Ambiente**:
  * `VITE_SENTRY_DSN`: URL do DSN público do Sentry para coleta de erros no client-side.

### Projeto 2: Backend (`vita-api`)
* **Root Directory**: `apps/api`
* **Framework Preset**: `Other`
* **Build Command**: `npm run build`
* **Install Command**: `npm install`
* **Variáveis de Ambiente**:
  * `NODE_ENV`: `production`
  * `WEB_ORIGIN`: URL do frontend (ex: `https://vita-web-rho.vercel.app`)
  * `SESSION_COOKIE_NAME`: `vita_session`
  * `DATABASE_URL`: String de conexão fornecida pelo Neon.
  * `JWT_SECRET`: Segredo de criptografia da sessão.
  * `GOOGLE_CLIENT_ID`: ID de cliente gerado na Google Cloud.
  * `GOOGLE_CLIENT_SECRET`: Segredo de cliente gerado na Google Cloud.
  * `OAUTH_REDIRECT_URI`: Endpoint de callback (ex: `https://vita-web-rho.vercel.app/api/auth/google/callback`)
  * `ADMIN_EMAILS`: Lista de e-mails dos administradores separados por vírgula.
  * `SENTRY_DSN`: DSN do Sentry para o backend.
  * `SENTRY_AUTH_TOKEN`: Token de autenticação/integração do Sentry.

> **Provisionamento das env vars:** o script `scripts/setup-vercel-env.ps1` lê o `.env`
> local e popula Production/Preview em ambos os projetos de uma vez.

> **Função serverless (`api/index.js`):** o Vercel detecta funções pela presença de
> arquivos na pasta `api/`. Por isso o bundle `apps/api/api/index.js` (gerado pelo
> esbuild a partir de `api/index.ts` via `npm run build`) é **versionado no git**.
> Ao alterar o backend, rode `npm -w @vita/api run build` e commite o `api/index.js`
> atualizado, senão a produção continuará rodando o bundle antigo.

---

## 2. Configuração do Google OAuth (Login com Google)

O login depende de o OAuth Client (tipo "Web application") no Google Cloud ter as URLs
de produção autorizadas. Esses campos **só são editáveis pelo console** — não há
CLI/API pública para clients web (a API de IAP exige organização). Acesse
[APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials)
(projeto `vita-499615`), abra o OAuth Client e configure:

* **Authorized JavaScript origins**:
  * `https://vita-web-rho.vercel.app`
  * `http://localhost:5173` (desenvolvimento)
* **Authorized redirect URIs**:
  * `https://vita-web-rho.vercel.app/api/auth/google/callback`
  * `http://localhost:5173/api/auth/google/callback` (desenvolvimento)

Os valores de `OAUTH_REDIRECT_URI` (env do `vita-api`) e a redirect URI autorizada no
Google precisam ser **idênticos**. Divergência resulta em `redirect_uri_mismatch`.
Se o domínio do frontend mudar, atualize os quatro pontos (origins + redirect no Google,
`WEB_ORIGIN` + `OAUTH_REDIRECT_URI` no Vercel).

---

## 3. Configuração de Proteção de Branch (Branch Protection)

Para garantir que nenhuma alteração seja integrada à `main` sem passar pelos testes e validações de segurança automatizadas, é obrigatório habilitar regras de branch protection no GitHub.

### Configuração Automática via GitHub CLI (`gh`)

Execute o seguinte comando para ativar as verificações de status obrigatórias para a branch `main`:

```bash
gh api -X PUT /repos/:owner/:repo/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  --input - <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Lint, typecheck e testes",
      "Secret scan (gitleaks)"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": null,
  "restrictions": null
}
EOF
```

### Configuração Manual via Interface do GitHub
1. Vá até as configurações do repositório (`Settings`).
2. Clique em `Branches` no menu lateral.
3. Clique em `Add branch protection rule` ou edite a regra para `main`.
4. Defina o padrão de branch para `main`.
5. Marque **"Require status checks to pass before merging"**.
6. Ative **"Require branches to be up to date before merging"** (strict checking).
7. Adicione os seguintes status checks como obrigatórios:
   * `Lint, typecheck e testes`
   * `Secret scan (gitleaks)`
8. Clique em `Save changes`.
