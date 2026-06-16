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

| Camada    | Tecnologias                                  |
| --------- | -------------------------------------------- |
| Frontend  | React · TypeScript · Tailwind CSS · PWA      |
| Backend   | Node.js · Express · TypeScript               |
| Auth      | Login com Google (OAuth) + allowlist de e-mails |

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

```text
.specify/    # Spec Kit: constituição, templates e specs das features
.claude/     # Configuração do Claude Code
```

> A estrutura de código-fonte (`frontend/`, `backend/`) será adicionada conforme as
> features forem planejadas e implementadas.

## Desenvolvimento

> _A configuração de ambiente, scripts e instruções de execução serão documentados
> conforme o projeto evoluir._

Variáveis de ambiente sensíveis (credenciais, chaves, tokens) **nunca** devem ser
versionadas — use arquivos `.env` locais (ignorados pelo Git) a partir de um
`.env.example`.

## Licença

Ver [LICENSE](LICENSE).
