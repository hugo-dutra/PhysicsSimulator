# Strategy

## Visao

Criar uma plataforma educacional de fisica em que o aluno ou professor consiga simular um fenomeno, alterar parametros, ver animacoes mecanicas/fluido/eletromagneticas, acompanhar graficos e tabelas, observar vetores, estudar as formulas envolvidas e ler a teoria no mesmo ambiente.

## Tese central

O valor do produto esta na uniao entre simulacao interativa, representacao visual, formulas aplicadas e explicacao teorica. A aplicacao deve reduzir a distancia entre "ver a formula", "saber quando usa-la", "ver o objeto se movendo" e "ver os dados mudando".

## Usuario-alvo

- Estudantes de ensino medio, tecnico e inicio de graduacao.
- Professores que querem demonstrar conceitos em aula.
- Criadores de conteudo educacional que precisam de visualizacoes fisicas reutilizaveis.

## Problema prioritario

Materiais de fisica costumam separar teoria, grafico, tabela e animacao em ferramentas diferentes. Isso dificulta comparar causa e efeito quando uma variavel fisica muda.

## Proposta de valor

Uma interface moderna, escura e cientifica, com sidebar por areas do conhecimento, simulacoes interativas e um painel lateral de parametros que atualiza visualizacao, graficos, tabelas, vetores e texto teorico de forma coordenada.

## Core de viabilidade

O core e uma simulacao completa e local que prove a experiencia principal:

> Alterar parametros fisicos em uma simulacao de Mecanica deve atualizar, de forma sincronizada, a animacao, os vetores, os graficos, a tabela de amostras, as formulas aplicadas e o apendice teorico.

Se essa parte falhar, o produto inteiro perde sentido. Por isso, o MVP deve comecar por uma simulacao exemplar de `Mecanica > Pendulo simples`. Depois da prova inicial, a Fase 2 adiciona `Mecanica > Dinamica > Plano inclinado com atrito` para validar que o contrato, o shell e o runtime visual suportam mais de uma simulacao funcional.

## Escopo curricular planejado

Depois da prova do core, o catalogo deve evoluir pelas quatro areas principais de fisica basica:

- `Mecanica`.
- `Termodinamica`.
- `Oscilacoes e Ondas`.
- `Eletromagnetismo`.

Esse escopo deve ser tratado como roadmap planejado, nao como promessa da primeira versao. O detalhamento de simulacoes, subareas, tecnologias e ordem de implementacao fica em `09-simulation-catalog-plan.md` e no roadmap.

## Nao objetivos da primeira versao

- Catalogo completo de todas as areas da fisica.
- Login, auth, perfis, turmas ou cadastro de usuarios.
- Backend persistente.
- Admin, dashboard gerencial, billing ou pagamentos.
- Simuladores numericos de alta fidelidade para CFD, eletromagnetismo avancado ou engenharia profissional.
- Pipeline de renderizacao Manim dentro do app.
- Aplicativo nativo desktop/mobile.

## Metricas de sucesso do MVP

- A simulacao do pendulo roda localmente sem backend.
- Controles mudam parametros e atualizam a cena sem recarregar a pagina.
- Graficos e tabela usam os mesmos dados numericos da simulacao.
- Vetores e energia exibidos na cena batem com os dados calculados.
- O apendice teorico explica as formulas usadas, quando aplica-las, como interpretar cada variavel e quais sao os limites do modelo.
- A UI dark com MUI parece uma ferramenta cientifica moderna, nao uma landing page.

## Hipoteses a validar

- React + MUI + Three.js + adaptadores de grafico entregam uma experiencia rica sem complexidade excessiva; Plotly.js fica para graficos declarativos e canvas/SVG para series progressivas que precisam parecer desenhadas continuamente.
- Um layout com sidebar, canvas central, controles laterais, graficos, tabela e teoria cabe bem em desktop e permanece usavel em telas menores.
- A primeira simulacao pode definir um contrato reutilizavel para as proximas.
- A segunda simulacao mecanica valida se o mesmo shell, os mesmos blocos de dados e o helper renderer-first reduzem o custo de adicionar novos modelos.
- Conteudo teorico em MDX/Markdown com KaTeX e suficiente para explicar a fisica, as formulas e seus contextos de uso sem criar um CMS cedo demais.
