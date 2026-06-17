# Guia de Validação Rápida (Quickstart): Rich Charts & Datetime Input Mask Fix

Este guia orienta na execução e teste de validação fim a fim da implementação do Recharts e da máscara de data/hora no VITA.

---

## 1. Pré-requisitos

- Node.js v22.x e npm instalados.
- Dependências do projeto instaladas (executar `npm install` no diretório raiz).

---

## 2. Configuração e Instalação da Biblioteca de Gráficos

Antes de iniciar o desenvolvimento, instale a biblioteca Recharts na aplicação web:

```bash
# Navegar até o pacote da web e instalar recharts
npm install recharts --workspace=@vita/web
```

---

## 3. Comandos de Validação e Testes

Para garantir que os comportamentos críticos da máscara e dos componentes não quebrem, execute os testes unitários configurados:

```bash
# Executa todos os testes do workspace do frontend
npm -w @vita/web run test
```

Os testes devem cobrir os seguintes fluxos (com 100% de sucesso):

- `date.test.ts`: Valida que o helper de máscara gera `12/06/2026 01:30` a partir de `120620260130`, e valida adequadamente datas corretas e incorretas.
- `TrendChart.test.tsx`: Garante que o Recharts renderiza corretamente os dados de peso e pressão, não joga erros ao receber arrays de dados vazios e responde de forma limpa ao redimensionamento.

---

## 4. Roteiro de Teste Manual na Interface

### Cenário A: Máscara e Validação de Entrada

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
2. Abra `http://localhost:5173` (ou a URL exibida no console).
3. Clique em **Registrar Peso** ou **Registrar Pressão**.
4. Marque a caixa **Alterar data/hora (registro retroativo)**.
5. Selecione o campo e digite continuamente: `120620260130`.
   - **Resultado Esperado**: O campo deve exibir exatamente `12/06/2026 01:30`. Nenhuma tecla adicional deve ser necessária para pular a barra `/`, o espaço ou os dois pontos `:`. O ano deve parar de aceitar novos caracteres após 4 dígitos (`2026`), encaminhando os dígitos `0130` para o tempo.
6. Altere para uma data inválida, ex: `31/02/2026 12:00` ou `12/06/2026 25:00`. Cliquem em **Salvar**.
   - **Resultado Esperado**: O formulário deve exibir um alerta de validação de formato e impedir o envio.

### Cenário B: Gráficos, Tela Cheia e Rotação

1. Com dados cadastrados, verifique os gráficos de Peso e Pressão na Home.
   - **Resultado Esperado**: Os ticks nos eixos X e Y devem estar espaçados e legíveis, sem nenhuma sobreposição textual de datas ou números.
2. Clique no ícone de **Tela Cheia** no canto superior direito de qualquer gráfico.
   - **Resultado Esperado**: O gráfico deve expandir e cobrir toda a tela do navegador.
3. Se estiver testando pelo celular (Google Chrome):
   - **Resultado Esperado**: Ao acionar a tela cheia, a interface do navegador rotacionará o gráfico automaticamente para o formato paisagem (horizontal). Ao fechar (clicando no botão `X`), retornará ao modo retrato vertical original.
