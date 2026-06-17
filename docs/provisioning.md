# VITA Provisioning & Secrets Guide

Este guia documenta o provisionamento de recursos de infraestrutura e gerenciamento de segredos para os provedores externos da aplicação VITA (GitHub, Vercel, Neon e Sentry).

---

## 1. GitHub Setup

### CLI Setup & Repo Creation

Certifique-se de estar logado com a [GitHub CLI (`gh`)](https://cli.github.com/):

```bash
gh auth login
```

Para criar o repositório remoto caso ainda não tenha sido feito:

```bash
gh repo create rafrcruz/vita --public --source=. --remote=origin --push
```

---

## 2. Neon (Postgres) Provisioning

### CLI Setup & Autenticação

Instale a [Neon CLI](https://neon.tech/docs/reference/neon-cli):

```bash
npm install -g neonctl
neonctl auth
```

### Criar Projeto e Banco de Dados

Crie um novo projeto no Neon:

```bash
# Cria um projeto na região US East (N. Virginia)
neonctl projects create --name "vita-db" --region_id "us-east-1"
```

A saída exibirá a string de conexão (`DATABASE_URL`). Guarde este valor para configurar as variáveis de ambiente locais e no ambiente de produção.

---

## 3. Vercel Setup & Provisioning

### CLI Setup & Autenticação

Instale a Vercel CLI globalmente e autentique-se:

```bash
npm install -g vercel
vercel login
```

### Criar os Projetos e Fazer Link

Temos dois projetos Vercel separados na nossa workspace. Configure cada um deles executando:

#### 1. Frontend (`vita-web`)

```bash
cd apps/web
vercel link --yes
# Isso cria o arquivo .vercel/project.json
```

#### 2. Backend (`vita-api`)

```bash
cd apps/api
vercel link --yes
# Isso cria o arquivo .vercel/project.json
```

### Provisionar Variáveis de Ambiente na Vercel

Você pode provisionar as variáveis de ambiente usando a CLI da Vercel para cada um dos ambientes (`production`, `preview` e `development`):

```bash
# Exemplo para adicionar uma variável no backend:
cd apps/api
vercel env add DATABASE_URL production "postgresql://neondb_owner:..."
vercel env add JWT_SECRET production "seu-jwt-secret-seguro"
# ... repita para as outras variáveis obrigatórias listadas em docs/deploy.md
```

---

## 4. Sentry Setup

### CLI Setup & Autenticação

Instale a Sentry CLI:

```bash
npm install -g @sentry/cli
sentry-cli login
```

### Obter DSN e Criar Projeto

Crie um projeto do Sentry para o backend e outro para o frontend no painel do Sentry ou via CLI:

```bash
sentry-cli projects create -o "rafael-cruz-ms" -t "node" "vita-api"
sentry-cli projects create -o "rafael-cruz-ms" -t "javascript-react" "vita-web"
```

Insira os DSNs gerados nas variáveis `SENTRY_DSN` e `VITE_SENTRY_DSN`.

---

## 5. Matriz de Segredos (Secrets)

Configure as seguintes credenciais e segredos em seus respectivos destinos:

| Segredo / Variável     | Destino                              | Descrição                                              |
| ---------------------- | ------------------------------------ | ------------------------------------------------------ |
| `DATABASE_URL`         | Vercel (`vita-api`)                  | String de conexão com o banco Neon                     |
| `JWT_SECRET`           | Vercel (`vita-api`)                  | Chave criptográfica para tokens de sessão              |
| `GOOGLE_CLIENT_SECRET` | Vercel (`vita-api`)                  | Segredo do Google Cloud Console                        |
| `SENTRY_AUTH_TOKEN`    | Vercel (`vita-api`) / GitHub Secrets | Token pessoal do usuário Sentry (acesso admin/release) |
