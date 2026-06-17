# Pesquisa Técnica: Upgrade de Gráficos e Máscara de Entrada de Data/Hora

Este documento analisa as opções e consolida as decisões técnicas necessárias para a implementação do upgrade de gráficos e da máscara de entrada de dados retroativos no VITA.

---

## 1. Escolha da Biblioteca de Gráficos

### Requisitos:

- Compatibilidade com React (v18.3+) e TypeScript.
- Suporte a layouts responsivos integrados com o sistema Tailwind CSS (usando CSS variables).
- Resolução automática de sobreposição de eixos (ex: ticks do eixo X em diferentes resoluções).
- Comunidade ativa, manutenção contínua e maturidade (Princípio VI da Constituição).

### Alternativas Consideradas:

1. **Recharts**:
   - _Prós_: Biblioteca de gráficos mais popular do ecossistema React. Baseada em SVG, muito fácil de customizar através de componentes React. Suporte nativo a containers responsivos (`<ResponsiveContainer>`). Permite customização direta de cores injetando variáveis CSS (`stroke="var(--primary)"`).
   - _Contras_: Tamanho de pacote razoável (porém aceitável em SPAs modernas).
2. **Chart.js (com react-chartjs-2)**:
   - _Prós_: Extremamente rápido (baseado em Canvas 2D), amplamente utilizado.
   - _Contras_: Renderização em Canvas dificulta a estilização declarativa usando classes CSS/Tailwind diretamente; configuração no React é feita via objetos JSON imperativos.
3. **Visx (Airbnb)**:
   - _Prós_: Altamente performático e modular.
   - _Contras_: Fornece primitivos de baixo nível. Exige escrever o SVG inteiro manualmente, violando o princípio de Simplicidade Deliberada (YAGNI/Overengineering) para esta feature.

### Decisão:

**Recharts** foi a biblioteca escolhida. Ela atende a todos os critérios de maturidade e manutenção ativa do Princípio VI, facilitando a estilização responsiva integrada ao Tailwind CSS e a adaptação automática dos ticks para evitar sobreposição de rótulos.

---

## 2. Abordagem para o Gráfico em Tela Cheia (Fullscreen) e Rotação

### Requisitos:

- Botão para alternar exibição em tela cheia.
- No celular, forçar a orientação horizontal (`landscape`) para facilitar a visualização de tendências detalhadas.

### Análise da API de Orientação (`Screen Orientation API`):

A API nativa `screen.orientation.lock('landscape')` é amplamente suportada em navegadores móveis baseados em Chromium (Chrome, Edge, Opera, Samsung Internet) e Firefox. No entanto, ela possui as seguintes restrições:

1. **iOS Safari**: Não suporta o travamento de orientação programático nativo diretamente (está atrás de flags experimentais ou restrito).
2. **Requisito de Interação**: O bloqueio de tela só pode ser invocado em resposta a uma interação do usuário (como um clique num botão), o que encaixa perfeitamente no fluxo de clique para tela cheia.

### Solução de Fullscreen (API vs CSS):

- **API de Fullscreen Nativa (`Element.requestFullscreen()`)**: Pode ser complexa para gerenciar em ambientes SPA devido a bugs de renderização de modais/popovers e diferenças de navegadores.
- **Fullscreen via Estado React (CSS-based overlay)**: Criar uma classe CSS de overlay fixo (`fixed inset-0 z-50 bg-background flex flex-col p-6`) acionada por estado React (`isFullscreen: boolean`). Esta abordagem é simples, 100% customizável, fácil de testar com Vitest e totalmente integrada ao fluxo de renderização do React.

### Decisão:

- **Layout**: O modo tela cheia será implementado via CSS utilizando um portal ou overlay fixo que ocupa `100vw` e `100vh`.
- **Rotação**: Ao acionar a tela cheia, o código verificará a presença de `screen.orientation.lock`. Se disponível, solicitará o travamento em `landscape`. Se falhar ou não estiver disponível (como no iOS Safari), o sistema falhará silenciosamente e exibirá o gráfico em tela cheia verticalmente com uma mensagem de dica amigável sugerindo que o usuário vire o celular.

---

## 3. Implementação da Máscara de Entrada de Data/Hora

### Requisitos:

- Substituir o comportamento nativo ineficiente do `<input type="datetime-local">` em desktops.
- Formatar a digitação sequencial de números de 12 dígitos no formato `DD/MM/AAAA HH:MM`.
- Bloquear o ano em 4 dígitos e transicionar a escrita fluentemente para horas e minutos.
- Validar a veracidade da data informada antes de salvar.

### Alternativas Consideradas:

1. **Biblioteca de Máscara Externa (`react-imask` ou `inputmask`)**:
   - _Prós_: Gerencia casos de seleção parcial e deleção.
   - _Contras_: Introduz nova dependência, complexidade de integração com TypeScript e possíveis conflitos com os estilos Tailwind.
2. **Função de Formatação Manual e Customizada**:
   - _Prós_: Zero dependências (Princípio V e VI), peso nulo no bundle, lógica totalmente controlada e 100% testável com testes unitários em Vitest.
   - _Contras_: Exige cuidado para tratar deleções (backspace) e caracteres não numéricos.

### Decisão:

**Função de Formatação Manual**. Implementaremos um helper utilitário de formatação de string puro:

1. O input passará a ser do tipo `text` com `inputMode="numeric"` (para abrir o teclado numérico em celulares).
2. No evento `onChange`, filtramos caracteres não-dígitos (`\D`), limitamos a 12 caracteres e aplicamos a pontuação espacial: `DD/MM/AAAA HH:MM`.
3. Trataremos o comportamento de backspace para que o usuário consiga apagar caracteres de forma fluida sem que o cursor fique preso nos delimitadores (`/`, `:` ou espaço).
4. Uma validação robusta baseada em Regex e parsing da data (usando as regras de ano bissexto e limites de horas/minutos) será acionada no `onBlur` e no `onSubmit`.
