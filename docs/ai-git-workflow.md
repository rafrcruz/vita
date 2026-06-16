# Fluxo Git/GitHub assistido por IA (VITA)

> Documento para **qualquer IA** (Claude Code ou outra) que opere este repositório, e para o
> usuário entender o que pedir. A `main` está protegida e **ninguém faz `push` direto nela** —
> nem o owner. Todo trabalho sobe por _branch → Pull Request → checks verdes → merge_.

## Contexto do ambiente

- Repo: `https://github.com/rafrcruz/vita` (owner `rafrcruz`, dev solo).
- GitHub CLI: **portátil** em `%LOCALAPPDATA%\gh-portable\bin\gh.exe`, já autenticado (keyring
  do Windows, conta `rafrcruz`, escopos `repo, read:org, workflow, gist`). _Não_ existe no `PATH`;
  invoque pelo caminho completo. (winget é bloqueado por política da org — ver `docs/deploy.md` §3.)
- Shell: PowerShell 5.1 como primário. **Pegadinha**: `Out-File -Encoding utf8` adiciona BOM e
  quebra o parse de JSON pela API do GitHub — gere arquivos JSON com um editor, não com `Out-File`.
- Proteção da `main` (detalhe completo em `docs/deploy.md` §3): PR obrigatório, checks obrigatórios
  `Lint, typecheck e testes` + `Secret scan (gitleaks)` + `Analyze (javascript-typescript)` (CodeQL),
  `strict`, enforce admins, histórico linear, sem force-push/deleção. Aprovações exigidas = **0**.
  Checks **não** obrigatórios (informativos): `Auditoria de dependências (npm audit)` e o relatório
  de cobertura — não bloqueiam o merge. Ferramentas de qualidade/segurança detalhadas em `docs/deploy.md` §4.

## O que o usuário pede vs. o que a IA faz

O usuário **não roda comandos git**. Ele descreve a intenção; a IA executa o ciclo inteiro.

| O usuário diz algo como… | A IA faz |
| --- | --- |
| "sobe isso pro GitHub" / "manda pra main" / "atualiza o repo" | branch → commit → push → PR → espera CI → merge (squash) → apaga a branch |
| "abre um PR mas não mergeia ainda" | branch → commit → push → PR, e **para** (deixa para revisão) |
| "mergeia o PR #N" | confirma checks verdes → `gh pr merge --squash --delete-branch` |
| "limpa as branches velhas" | apaga branches já mergeadas (local e remota) |
| "desfaz / reverte o que subiu" | `git revert` num novo PR (nunca force-push na main) |

Como aprovações exigidas = 0, **não há etapa de "aprovar PR"** no caminho normal — a IA cria e
mergeia o próprio PR. (O GitHub proíbe o autor de _aprovar_ o próprio PR, mas isso não trava o
merge porque 0 aprovações são exigidas.) Se algum dia o usuário quiser exigir revisão humana, é
só pedir para subir `required_approving_review_count` — aí ele aprova pela UI antes do merge.

## Ciclo completo de "subir tudo" (caminho padrão)

Substitua `gh` por `& "$env:LOCALAPPDATA\gh-portable\bin\gh.exe"` em PowerShell.

```powershell
$gh = "$env:LOCALAPPDATA\gh-portable\bin\gh.exe"

# 1. Branch a partir da main atualizada
git checkout main
git pull --ff-only
git checkout -b feat/descricao-curta

# 2. Commit (mensagem em PT; ver convenção abaixo)
git add -A
git commit -m "feat: descreve a mudança"

# 3. Push da branch
git push -u origin feat/descricao-curta

# 4. Abrir o PR
& $gh pr create --base main --head feat/descricao-curta --title "feat: descreve a mudança" --body "Resumo do que muda e por quê."

# 5. Esperar o CI e mergear quando verde (squash mantém histórico linear) + apagar a branch
& $gh pr checks --watch
& $gh pr merge --squash --delete-branch

# 6. Voltar a main local sincronizada
git checkout main
git pull --ff-only
```

`--delete-branch` no merge já remove a branch remota e a local. Para varrer branches locais órfãs
de PRs antigos:

```powershell
git fetch --prune
git branch --merged main | Select-String -NotMatch '\bmain\b' | ForEach-Object { git branch -d $_.ToString().Trim() }
```

## Convenções

- **Commits**: Conventional Commits em português — `feat:`, `fix:`, `chore:`, `docs:`, `build:`,
  `refactor:`, `test:`. Imperativo, minúsculo. (Coincide com o histórico atual do repo.)
- **Branches**: `tipo/descricao-curta-em-kebab` (ex.: `fix/oauth-redirect`).
- **Merge**: sempre **squash** (ou rebase). Merge-commit é bloqueado pelo histórico linear.
- **Segredos**: nunca commitar. `.env` é gitignored; o `secret-scan` (gitleaks) roda no CI e
  bloqueia o merge se vazar credencial.

## Pré-checagem local (recomendada antes do PR)

Os mesmos comandos que o CI roda — adianta falha sem esperar o GitHub:

```powershell
npm run lint
npm run typecheck
npm run test
```

## Se um check ficar vermelho

1. `& $gh pr checks` para ver qual job falhou; `& $gh run view --log-failed` para o log.
2. Corrigir, novo commit, `git push` (o PR atualiza sozinho e o CI roda de novo).
3. Mergear quando voltar verde. **Nunca** contornar com force-push na main (é bloqueado de
   qualquer forma) nem desabilitar a proteção para "passar reto".
