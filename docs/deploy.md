# VITA Deployment & CI/CD Guide

Este documento detalha o processo de deploy da aplicação VITA na Vercel e a configuração de proteção de branch no GitHub.

## 1. Configuração dos Projetos Vercel

O VITA é estruturado como um monorepo e seu deploy é feito em dois projetos separados na Vercel: um para o frontend (`apps/web`) e outro para o backend (`apps/api`).

URLs de produção atuais:

- Frontend: `https://vita-web-rho.vercel.app`
- Backend: `https://vita-api-eight.vercel.app`

O frontend (`apps/web/vercel.json`) reescreve `/api/:path*` para o backend, de modo
que o navegador sempre fala com a mesma origem (`vita-web-rho.vercel.app`) — isso é o
que permite o cookie de sessão `httpOnly` funcionar no fluxo OAuth.

### Projeto 1: Frontend (`vita-web`)

- **Root Directory**: `apps/web`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Variáveis de Ambiente**:
  - `VITE_SENTRY_DSN`: URL do DSN público do Sentry para coleta de erros no client-side.

### Projeto 2: Backend (`vita-api`)

- **Root Directory**: `apps/api`
- **Framework Preset**: `Other`
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Variáveis de Ambiente**:
  - `NODE_ENV`: `production`
  - `WEB_ORIGIN`: URL do frontend (ex: `https://vita-web-rho.vercel.app`)
  - `SESSION_COOKIE_NAME`: `vita_session`
  - `DATABASE_URL`: String de conexão fornecida pelo Neon.
  - `JWT_SECRET`: Segredo de criptografia da sessão.
  - `GOOGLE_CLIENT_ID`: ID de cliente gerado na Google Cloud.
  - `GOOGLE_CLIENT_SECRET`: Segredo de cliente gerado na Google Cloud.
  - `OAUTH_REDIRECT_URI`: Endpoint de callback (ex: `https://vita-web-rho.vercel.app/api/auth/google/callback`)
  - `ADMIN_EMAILS`: Lista de e-mails dos administradores separados por vírgula.
  - `SENTRY_DSN`: DSN do Sentry para o backend.
  - `SENTRY_AUTH_TOKEN`: Token de autenticação/integração do Sentry.

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

- **Authorized JavaScript origins**:
  - `https://vita-web-rho.vercel.app`
  - `http://localhost:5173` (desenvolvimento)
- **Authorized redirect URIs**:
  - `https://vita-web-rho.vercel.app/api/auth/google/callback`
  - `http://localhost:5173/api/auth/google/callback` (desenvolvimento)

Os valores de `OAUTH_REDIRECT_URI` (env do `vita-api`) e a redirect URI autorizada no
Google precisam ser **idênticos**. Divergência resulta em `redirect_uri_mismatch`.
Se o domínio do frontend mudar, atualize os quatro pontos (origins + redirect no Google,
`WEB_ORIGIN` + `OAUTH_REDIRECT_URI` no Vercel).

---

## 3. Configuração de Proteção de Branch (Branch Protection)

A `main` está protegida no GitHub (`rafrcruz/vita`) — **estado real aplicado em 2026-06-16**.
Nenhuma alteração entra na `main` sem passar pelo CI e por um Pull Request. As regras valem
**inclusive para o owner** (`enforce_admins`), então `git push` direto na `main` é rejeitado.

Regras ativas:

| Regra                                        | Valor                                                                                            |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Pull Request obrigatório antes do merge      | sim (`required_pull_request_reviews`, 0 aprovações exigidas)                                     |
| Status checks obrigatórios                   | `Lint, typecheck e testes`, `Secret scan (gitleaks)`, `Analyze (javascript-typescript)` (CodeQL) |
| Branch atualizada antes do merge (`strict`)  | sim                                                                                              |
| Enforce admins (vale para o owner)           | sim                                                                                              |
| Histórico linear (`required_linear_history`) | sim — merge precisa ser **squash** ou **rebase**, não merge-commit                               |
| Force push / deleção da `main`               | bloqueados                                                                                       |

> `required_approving_review_count = 0` permite que o autor faça o merge do próprio PR
> (o GitHub não deixa o autor _aprovar_ o próprio PR, mas com 0 aprovações isso não trava o merge).

### Como o `gh` está instalado neste ambiente

A instalação via `winget` é bloqueada por política da organização (máquina Enterprise gerenciada).
Por isso o GitHub CLI roda em modo **portátil** (sem MSI/admin):

- Binário: `%LOCALAPPDATA%\gh-portable\bin\gh.exe`
- Já autenticado (token no keyring do Windows), conta `rafrcruz`, escopos `repo, read:org, workflow, gist`.

Para reinstalar/atualizar o portátil:

```powershell
$ver='2.94.0'
$dest="$env:LOCALAPPDATA\gh-portable"
Invoke-WebRequest "https://github.com/cli/cli/releases/download/v$ver/gh_${ver}_windows_amd64.zip" -OutFile "$env:TEMP\gh.zip"
Expand-Archive "$env:TEMP\gh.zip" -DestinationPath $dest -Force
& "$dest\bin\gh.exe" auth login --hostname github.com --git-protocol https --web
```

### Reaplicar/auditar a proteção via `gh`

```powershell
$gh="$env:LOCALAPPDATA\gh-portable\bin\gh.exe"
# JSON sem BOM (PowerShell 5.1 Out-File -utf8 quebra o parse da API). Gere o arquivo com um editor.
& $gh api -X PUT repos/rafrcruz/vita/branches/main/protection -H "Accept: application/vnd.github+json" --input bp.json
# auditar:
& $gh api repos/rafrcruz/vita/branches/main/protection
```

`bp.json` (payload exato aplicado):

```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Lint, typecheck e testes",
      "Secret scan (gitleaks)",
      "Analyze (javascript-typescript)"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false
}
```

Para **remover** toda a proteção: `gh api -X DELETE repos/rafrcruz/vita/branches/main/protection`.

> O fluxo de commit/push/PR/merge assistido por IA (o caminho normal de subir mudanças, já que
> ninguém mais faz push direto na `main`) está documentado em [`docs/ai-git-workflow.md`](./ai-git-workflow.md).

## 4. Qualidade e Segurança automatizadas (gratuito)

Ferramentas grátis incorporadas para reduzir risco sem reforçar padrões estilísticos
voltados a humanos (decisão consciente de **não** adotar SonarCloud por gerar ruído de
"code smell"/complexidade com pouco ganho num projeto TS estrito guiado por IA).

| Ferramenta           | Arquivo                        | Papel                                                                                      | Required na `main`?                                                          |
| -------------------- | ------------------------------ | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| **Dependabot**       | `.github/dependabot.yml`       | PRs semanais de updates (npm + github-actions), agrupando minor/patch; alerta de CVE       | n/a (abre PRs)                                                               |
| **CodeQL**           | `.github/workflows/codeql.yml` | SAST com queries `security-extended` (só segurança); por PR + semanal                      | **Sim** — `Analyze (javascript-typescript)`                                  |
| **npm audit**        | job `audit` em `ci.yml`        | `--omit=dev --audit-level=high`: vulnerabilidades high/critical só em deps de **produção** | **Não** (informativo; evita travar merge por CVE de tooling/transitiva)      |
| **Cobertura Vitest** | `vitest.config.ts` (raiz)      | Relatório v8 comentado no PR (`vitest-coverage-report-action`)                             | **Não** — sem gate de %, alinhado à constituição (testes orientados a risco) |

Notas:

- O `npm audit` roda só em produção de propósito: vulns de build (esbuild/vite/vitest) não
  chegam ao runtime serverless. O Dependabot ainda assim abre PRs para corrigi-las.
- A cobertura é **informativa**, não um portão. Não há `thresholds` em `vitest.config.ts`.
