# VITA

**Plataforma pessoal de observabilidade de saúde** — armazena, acompanha, agrega e
visualiza os dados de saúde do próprio usuário.

> O VITA **não** realiza diagnósticos, prescrições ou decisões médicas. Ele apenas
> ajuda você a observar seus próprios dados.

## Visão geral

O VITA é uma aplicação pessoal, para uso de um único proprietário, projetada para ser
simples, segura e sustentável no longo prazo. A captura de dados é otimizada para
**mobile** e a análise/visualização para **desktop**.

## Stack

| Camada   | Tecnologias                                     |
| -------- | ----------------------------------------------- |
| Frontend | React · TypeScript · Tailwind CSS · PWA         |
| Backend  | Node.js · Express · TypeScript                  |
| Auth     | Login com Google (OAuth) + allowlist de e-mails |

A aplicação opera **prioritariamente online**. Recursos offline são desejáveis, porém
opcionais, e não devem introduzir complexidade significativa.

## Princípios

O desenvolvimento é governado pela [constituição do projeto](.specify/memory/constitution.md).
Em resumo:

1. **Observabilidade, não aconselhamento médico** — sem diagnóstico ou prescrição.
2. **Privacidade e segurança por padrão** — dados de saúde protegidos em trânsito e repouso.
3. **Acesso restrito** — autenticação exclusiva via Google + allowlist administrada.
4. **Stack e arquitetura definidas** — PWA online-first com a stack acima.
5. **Simplicidade deliberada** — YAGNI, sem overengineering.
6. **Dependências e infraestrutura sustentáveis** — maduras, bem mantidas, bom custo-benefício.
7. **Testes orientados a risco** — proteger fluxos críticos, cálculos e agregações.

## Estrutura do repositório

O projeto é estruturado como um monorepo utilizando npm workspaces:

```text
apps/
├── web/                 # Frontend SPA/PWA (React + Vite + Tailwind CSS)
└── api/                 # Backend Express (Serverless na Vercel)
packages/
└── shared/              # Schemas Zod e tipos TypeScript compartilhados
docs/
├── deploy.md            # Guia de deploy na Vercel e branch protection
└── provisioning.md      # Guia de provisionamento de recursos e matriz de segredos
.specify/                # Spec Kit: constituição, templates e especificações
specs/
└── 001-foundation-setup/ # Especificação e plano da fundação técnica
```

## Desenvolvimento

Para rodar o projeto localmente, siga os passos abaixo:

1. **Pré-requisitos**: Certifique-se de ter o Node.js 22.x e o npm instalados.
2. **Instalação**: Instale as dependências de todos os workspaces na raiz:
   ```bash
   npm install
   ```
3. **Configuração de ambiente**: Copie o arquivo de exemplo e preencha as variáveis necessárias:
   ```bash
   cp .env.example .env
   ```
4. **Banco de Dados (Migrations)**: Aplique as migrations no banco Neon:
   ```bash
   npm run db:migrate
   ```
5. **Execução**: Inicie o servidor de desenvolvimento para o frontend e o backend simultaneamente:
   ```bash
   npm run dev
   ```

### Scripts Disponíveis (raiz)

| Script                | Descrição                                                              |
| --------------------- | ---------------------------------------------------------------------- |
| `npm run dev`         | Inicia o frontend (Vite) e backend (Express) localmente com hot-reload |
| `npm run build`       | Compila o frontend e backend para produção                             |
| `npm run lint`        | Executa o ESLint em todo o monorepo                                    |
| `npm run typecheck`   | Executa a checagem de tipos do TypeScript                              |
| `npm run test`        | Executa a suíte de testes com Vitest                                   |
| `npm run db:generate` | Gera novas migrations a partir do schema Drizzle                       |
| `npm run db:migrate`  | Executa as migrations pendentes no banco Neon                          |

Para mais detalhes sobre a validação ponta a ponta e a arquitetura técnica da fundação, consulte o [quickstart.md](file:///c:/projects/vita/specs/001-foundation-setup/quickstart.md).

## Licença

Ver [LICENSE](LICENSE).
