# Checklist de Qualidade de Requisitos: UX / Interface & Acessibilidade

**Purpose**: Validar a qualidade, clareza e completude dos requisitos de UX/Interface e
Acessibilidade desta feature **antes da implementação** (uso em revisão de PR).
**Created**: 2026-06-17
**Feature**: [spec.md](../spec.md) · [plan.md](../plan.md)
**Focus**: UX/Interface + Acessibilidade · **Depth**: Gate de revisão (PR) · **Audience**: Revisor

> Cada item testa **o requisito escrito** (completude/clareza/consistência/mensurabilidade/cobertura),
> não a implementação. Marque ✅ quando o requisito estiver adequado; deixe aberto quando faltar
> definição, houver ambiguidade ## Ícone / PWA (US1, FR-001–003, SC-001)

- [x] CHK001 - O conjunto de tamanhos/formatos de ícone exigidos está especificado de forma mensurável (não apenas "nítido")? [Clarity, Spec §FR-002]
- [x] CHK002 - "Temática de saúde (ex.: peso/saúde)" está definido com critérios objetivos suficientes para aprovar/reprovar uma arte? [Ambiguity, Spec §FR-001]
- [x] CHK003 - O comportamento de fallback de ícone em plataformas que não suportam instalação PWA está definido? [Edge Case, Spec §Edge Cases]
- [x] CHK004 - O requisito distingue o ícone de tela inicial em diferentes SOs (ex.: necessidade específica do iOS) ou trata "celular" genericamente? [Completeness, Gap]
- [x] CHK005 - O critério de "reconhecido como instalável (nome e ícone próprios)" é objetivamente verificável? [Measurability, Spec §FR-003]

## Cabeçalho e elementos removidos (US2, FR-004–008, SC-002)

- [x] CHK006 - A lista de elementos a remover está completa e sem ambiguidade (subtítulo, linha e-mail/ADMIN/allowlist, card de status, botão Histórico do topo)? [Completeness, Spec §FR-004–008]
- [x] CHK007 - O conteúdo final exato do cabeçalho superior está especificado (apenas tema + Sair) sem deixar dúvida sobre ordem/posição? [Clarity, Spec §FR-007]
- [x] CHK008 - Há consistência entre "remover botão Histórico do topo" (FR-008) e "Histórico acessível pelo menu" quanto ao único ponto de acesso? [Consistency, Spec §FR-008]
- [x] CHK009 - O requisito define o que substitui o título/identidade visual da Home após a remoção do subtítulo (ex.: permanece "VITA")? [Gap]
- [x] CHK010 - A remoção da linha de e-mail/papel deixa claro onde o usuário passa a ver seu papel/identidade, se necessário? [Coverage, Gap]

## Perfil — aspectos de interface (US3, FR-009–014)

- [x] CHK011 - Os rótulos, formatos de entrada e unidades dos campos (nome completo, data de nascimento, altura em cm) estão especificados para a tela? [Completeness, Spec §FR-010]
- [x] CHK012 - O estado de "primeiro acesso / campos vazios" tem requisitos de UI definidos (orientação ao usuário, sem travar navegação)? [Coverage, Spec §FR-014]
- [x] CHK013 - As mensagens de validação (data futura/inválida, altura fora de faixa) estão especificados de forma clara e mensurável quanto a quando aparecem? [Clarity, Spec §FR-012]
- [x] CHK014 - O requisito define o feedback de sucesso ao salvar (ex.: confirmação) e o comportamento pós-salvamento (permanece na tela / navega)? [Completeness, Spec §FR-009, §US3]
- [x] CHK015 - Há definição de estados de carregamento/erro ao buscar e salvar o perfil na UI? [Gap]
- [x] CHK016 - O critério "salvar parcialmente" vs "campos obrigatórios" está consistente e sem conflito entre FR-014 e os cenários de aceitação? [Consistency, Spec §FR-014, §US3]

## Gráfico — série temporal (US4, FR-015–019, SC-005)

- [x] CHK017 - O conteúdo do tooltip está especificado (valor e data) e o requisito é mensurável quanto a "todos os pontos"? [Clarity, Spec §FR-015]
- [x] CHK018 - "Rótulos de data legíveis e adequados ao período" tem critério objetivo (densidade de ticks, formato por período) que evite sobreposição? [Ambiguity, Spec §FR-016]
- [x] CHK019 - A unidade do eixo Y (kg/mmHg) e a apresentação para a série de pressão (sistólica+diastólica) estão definidas sem ambiguidade? [Completeness, Spec §FR-017]
- [x] CHK020 - Os requisitos de interação no desktop (hover) e no mobile (toque) estão consistentes e ambos cobertos? [Consistency, Spec §FR-015, §FR-019]
- [x] CHK021 - Os estados-limite do gráfico (0 ponto, 1 ponto, período "Tudo" com muitos pontos) têm requisitos definidos para eixos e tooltip? [Edge Case, Spec §Edge Cases]
- [x] CHK022 - O requisito de "dentro da área visível" para o valor no mobile é objetivamente verificável? [Measurability, Spec §FR-019]

## Navegação mobile e colisão de botões (US5, FR-020–023, SC-006)

- [x] CHK023 - O conteúdo da barra inferior mobile (item "Início" + controle de menu) está especificado de forma não ambígua? [Clarity, Spec §FR-020]
- [x] CHK024 - O conjunto de itens do menu expansível e a regra de extensibilidade futura estão definidos (Admin condicional, Histórico, Perfil)? [Completeness, Spec §FR-021]
- [x] CHK025 - "Não sobrepor os botões de Adicionar" tem critério mensurável (visibilidade total / alvo clicável) e não apenas descritivo? [Measurability, Spec §FR-022]
- [x] CHK026 - O requisito de gating do item "Admin" no menu está consistente com as regras de autorização existentes? [Consistency, Spec §FR-023]
- [x] CHK027 - O comportamento de abrir/fechar o menu (incluindo fechar ao selecionar) está completamente especificado? [Completeness, Spec §US5]
- [x] CHK028 - Há definição consistente da navegação entre breakpoints (mobile vs tablet/desktop) para Histórico/Admin/Perfil? [Consistency, Gap]

## Modal de captura com teclado (US6, FR-024–026, SC-007)

- [x] CHK029 - A condição que dispara o reposicionamento (teclado aberto / contexto mobile) está definida de forma não ambígua? [Ambiguity, Spec §FR-025]
- [x] CHK030 - O conjunto de elements que DEVE permanecer visível (campo, "Alterar data", Cancelar, Salvar) está completo e explícito? [Completeness, Spec §FR-025]
- [x] CHK031 - O comportamento no desktop (sem reposicionar) está consistente e separado do mobile? [Consistency, Spec §Assumptions]
- [x] CHK032 - O caso de telas muito baixas (botões não cortados) tem requisito definido? [Edge Case, Spec §Edge Cases]

## Acessibilidade (transversal — em grande parte [Gap])

- [x] CHK033 - Requisitos de navegação por teclado e ordem de foco estão definidos para o novo menu mobile, tela de Perfil e modais? [Coverage, Gap]
- [x] CHK034 - Requisitos de rótulos acessíveis (aria-label/nome acessível) estão definidos para o botão de menu (três tracinhos) e controles do gráfico? [Completeness, Gap]
- [x] CHK035 - O tooltip do gráfico tem requisito de acessibilidade (alternativa para leitor de tela / não depender só de hover)? [Coverage, Gap]
- [x] CHK036 - Requisitos de tamanho mínimo de alvo de toque estão definidos para la barra inferior e os botões de Adicionar (relacionado à colisão)? [Measurability, Gap, Spec §FR-022]
- [x] CHK037 - Requisitos de contraste/cor para os novos elementos (ícones de eixo, tooltip, menu) estão definidos e consistentes com o design system? [Consistency, Gap]
- [x] CHK038 - A gestão de foco ao abrir/fechar o modal e o menu (foco inicial e retorno) está especificada? [Completeness, Gap]
- [x] CHK039 - Há requisito para não transmitir informação apenas por cor no gráfico (ex.: distinção sistólica/diastólica)? [Coverage, Gap]

## Critérios de aceite, consistência geral e suposições

- [x] CHK040 - Cada FR de UX possui um critério de aceite correspondente, mensurável e rastreável nos cenários/Success Criteria? [Traceability, Spec §Success Criteria]
- [x] CHK041 - As suposições de UX (altura em cm, reposicionamento só no mobile, campos opcionais) estão explícitas e não conflitam com os FRs? [Assumption, Spec §Assumptions]
- [x] CHK042 - Os requisitos de paridade desktop/mobile estão claros para cada ajuste (o que muda em cada breakpoint)? [Consistency, Spec §US2, §US4]
