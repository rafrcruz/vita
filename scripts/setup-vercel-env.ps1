# Script para provisionar variáveis de ambiente na Vercel (Produção e Preview)
# Carrega os valores dinamicamente a partir do arquivo .env (que é gitignorado).
# Certifique-se de estar autenticado com `vercel login` antes de rodar.

$envFile = Join-Path $PSScriptRoot "../.env"
if (-not (Test-Path $envFile)) {
  Write-Error "Arquivo .env não encontrado na raiz do projeto."
  exit 1
}

# Carrega e faz o parse do arquivo .env
$envs = @{}
Get-Content $envFile | ForEach-Object {
  $line = $_.Trim()
  if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
    $parts = $line.Split("=", 2)
    $key = $parts[0].Trim()
    $val = $parts[1].Trim()
    if (($val.StartsWith('"') -and $val.EndsWith('"')) -or ($val.StartsWith("'") -and $val.EndsWith("'"))) {
      $val = $val.Substring(1, $val.Length - 2)
    }
    $envs[$key] = $val
  }
}

# Lista de variáveis necessárias para o backend (vita-api)
$api_keys = @(
  "NODE_ENV",
  "WEB_ORIGIN",
  "JWT_SECRET",
  "SESSION_COOKIE_NAME",
  "DATABASE_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "OAUTH_REDIRECT_URI",
  "ADMIN_EMAILS",
  "SENTRY_DSN",
  "SENTRY_AUTH_TOKEN",
  "SENTRY_PERSONAL_TOKEN"
)

Write-Host "Configurando variáveis para o backend (vita-api)..."
cd "$PSScriptRoot/../apps/api"

foreach ($key in $api_keys) {
  if ($envs.Contains($key)) {
    $val = $envs[$key]
    Write-Host "Definindo $key..."
    vercel env add $key production --value "$val" --force --yes
    vercel env add $key preview --value "$val" --force --yes
  } else {
    Write-Warning "A variável $key não foi encontrada no arquivo .env local."
  }
}

# Lista de variáveis necessárias para o frontend (vita-web)
$web_keys = @(
  "VITE_SENTRY_DSN"
)

Write-Host "`nConfigurando variáveis para o frontend (vita-web)..."
cd "$PSScriptRoot/../apps/web"

foreach ($key in $web_keys) {
  if ($envs.Contains($key)) {
    $val = $envs[$key]
    Write-Host "Definindo $key..."
    vercel env add $key production --value "$val" --force --yes
    vercel env add $key preview --value "$val" --force --yes
  } else {
    Write-Warning "A variável $key não foi encontrada no arquivo .env local."
  }
}

cd $PSScriptRoot
Write-Host "`nConfiguração de variáveis concluída com sucesso!"
