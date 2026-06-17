# Quickstart — Validação da feature "Ajustes de UI"

Guia de validação end-to-end. Detalhes de modelo e contrato estão em
[data-model.md](./data-model.md) e [contracts/profile.api.md](./contracts/profile.api.md).

## Pré-requisitos

- Monorepo instalado (`npm install` na raiz). Não regenerar o lockfile no Windows sem
  necessidade (ver memória de lockfile cross-platform).
- `.env` na raiz com `DATABASE_URL` (Neon) e variáveis de auth Google já configuradas.
- Migração da tabela `user_profiles` aplicada (`npm run db:migrate` em `apps/api`).

## Subir o ambiente

```bash
# Terminal 1 — API (porta 3001)
cd apps/api && npm run dev

# Terminal 2 — Web (porta 5173, proxy /api → 3001)
cd apps/web && npm run dev
```

Autenticar com uma conta Google que esteja na allowlist.

## Cenários de validação

### 1. Ícone PWA (P1)
- Build de produção (`cd apps/web && npm run build && npm run preview`) e abrir no celular
  (ou DevTools → Application → Manifest).
- **Esperado**: manifest lista os ícones (192/512/maskable); "Adicionar à tela inicial" cria
  atalho com o ícone próprio; em iOS, `apple-touch-icon` é usado. Sem quadrado cinza com "V".

### 2. Cabeçalho enxuto + Histórico no menu (P1)
- Abrir `/` em desktop e mobile.
- **Esperado**: topo só com seleção de tema e "Sair"; **sem** subtítulo "Plataforma pessoal…";
  **sem** linha de e-mail/ADMIN/"Administrar allowlist"; **sem** card "Status do backend";
  "Histórico" acessível pelo menu (não como botão no topo).

### 3. Perfil funcional (P1)
- Acessar "Perfil" pelo menu → preencher nome completo, data de nascimento e altura → Salvar.
- Recarregar a página e reabrir "Perfil".
- **Esperado**: navega para uma tela real (não link quebrado); salvar mostra toast de sucesso;
  ao reabrir, campos vêm preenchidos. Data futura / altura fora de 50–250 são bloqueadas com
  mensagem em pt-BR. Primeiro acesso com campos vazios não trava.
- Verificação de API (opcional): `GET /api/profile` retorna o registro; `PUT /api/profile` com
  `birthDate` futura retorna 400 (ver contrato).

### 4. Gráfico mais informativo (P2)
- Em desktop, passar o mouse sobre pontos do gráfico (Peso e Pressão).
- **Esperado**: tooltip mostra valor (+ data) do ponto; eixo X com **3–6 marcas de data**
  distribuídas uniformemente e sem sobreposição nos três períodos (7D/30D/Tudo), com formato
  por período (dia/mês em 7D/30D; mês/ano em intervalos longos de "Tudo"); eixo Y com unidade
  (kg/mmHg).
- Em mobile, tocar num ponto exibe o valor dentro da área visível. Com 0 ou 1 ponto, não há
  erro visual.

### 5. Navegação mobile sem colisão (P2)
- Em viewport mobile, observar a barra inferior.
- **Esperado**: barra com "Início" + botão de menu (três tracinhos) que abre Admin/Histórico/
  Perfil; os botões "Adicionar Peso"/"Adicionar Pressão" ficam totalmente clicáveis (não cobertos
  pela barra). "Admin" respeita o papel do usuário.

### 6. Modal de captura com teclado aberto (P3)
- Em mobile (ou DevTools device mode), abrir "Adicionar Peso"/"Adicionar Pressão".
- **Esperado**: teclado numérico abre automaticamente; com o teclado aberto, campo, "Alterar
  data", "Cancelar" e "Salvar" permanecem visíveis (modal ancorado ao topo no mobile). Em
  desktop, o modal continua centralizado.

### 7. Acessibilidade básica (transversal, FR-027–031, SC-008)
- Navegar pela aplicação **somente com teclado** (Tab/Shift+Tab/Enter/Esc): abrir o menu mobile
  (botão "três tracinhos"), a tela de Perfil e os modais de captura.
- Inspecionar nomes acessíveis (DevTools → Accessibility) do botão de menu e dos controles do
  gráfico.
- **Esperado**: botão de menu e controles do gráfico têm nome acessível; menu/modais/Perfil são
  operáveis por teclado, com foco inicial ao abrir, `Esc` para fechar e retorno de foco ao
  fechar; alvos de toque da nav e dos botões de Adicionar medem ≥44×44px; a distinção
  sistólica/diastólica no gráfico não depende só de cor (há legenda/rótulo) e o valor do ponto
  é acessível sem depender exclusivamente de hover.

## Testes automatizados

```bash
# API: validação/serviço de Perfil
cd apps/api && npm test

# Web: navegação, Home sem elementos removidos, lógica do gráfico
cd apps/web && npm test
```

- **Esperado**: testes de `profile.service`/validação passam (casos do contrato); testes de UI
  cobrem ausência dos elementos removidos na Home e presença de "Histórico" no menu; lógica de
  ticks/tooltip do gráfico validada.

## Pós-mudança no backend

Após alterar a API, rebuildar e commitar o bundle serverless:

```bash
cd apps/api && npm run build   # gera apps/api/api/index.js
```

Commitar `apps/api/api/index.js` junto com as mudanças (mecânica de deploy do VITA).
