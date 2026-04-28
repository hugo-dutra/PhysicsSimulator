# PhysicSimulator Guides Index

## Objetivo

Este diretorio orienta a criacao do PhysicSimulator: uma aplicacao educacional para simular, explicar e ilustrar conceitos de fisica no mesmo lugar.

Leia este arquivo primeiro antes de alterar produto, arquitetura, roadmap ou implementacao. Qualquer tarefa que mude escopo, comportamento, stack, dados ou validacao deve atualizar os guides impactados no mesmo ciclo.

## Mapa dos documentos

- `01-strategy.md`: visao, tese, core de viabilidade e o que fica fora do MVP.
- `02-product-spec.md`: experiencia do usuario, jornadas, telas e criterios de aceite.
- `03-architecture.md`: stack recomendada, modulos, fluxo do core e evolucao tecnica.
- `04-rules-and-constraints.md`: regras de produto, UX, fisica, dados e restricoes tecnicas.
- `05-roadmap.md`: fases de execucao em ordem core-first.
- `06-data-and-api.md`: entidades, fixtures, read models e contratos de dados.
- `07-quality-and-operations.md`: estrategia de validacao, smoke tests e operacao inicial.
- `08-api-contracts.md`: contratos conceituais para simulacoes e integracao de UI.
- `issues.md`: riscos, premissas abertas, decisoes pendentes e gaps.

## Como escolher o que ler

- Para decidir prioridade: leia `01-strategy.md`, `05-roadmap.md` e `issues.md`.
- Para implementar uma simulacao: leia `02-product-spec.md`, `03-architecture.md`, `06-data-and-api.md`, `08-api-contracts.md` e `07-quality-and-operations.md`.
- Para mexer na UI, tema ou layout: leia `02-product-spec.md`, `03-architecture.md` e `04-rules-and-constraints.md`.
- Para alterar dados, fixtures ou contratos: leia `06-data-and-api.md` e `08-api-contracts.md`.

## Ambiente padrao

O repositorio ainda esta em fase documental. A recomendacao inicial e:

- Frontend: React + TypeScript + Vite.
- UI: Material UI com tema dark em tons de cinza grafite e acento cyan/teal.
- Renderizacao de simulacao: Three.js como motor visual principal.
- Graficos: Plotly.js para graficos cientificos declarativos.
- Conteudo teorico: MDX/Markdown com KaTeX para formulas.
- Fisica externa: comecar com motor proprio simples para o pendulo; considerar Rapier, Matter.js ou PixiJS apenas quando a simulacao exigir.

## Estrutura sugerida

```text
src/
  app/
  components/
    layout/
    controls/
    charts/
  content/
    simulations/
  features/
    simulation-shell/
  lib/
    physics/
    rendering/
    charts/
    units/
  simulations/
    mechanics/
      pendulum/
  theme/
fixtures/
  simulations/
tests/
```

## Regra de documentacao

O projeto deve evoluir core-first. Antes de adicionar catalogo amplo, login, cadastros, dashboard administrativo, backend completo ou polish avancado, a primeira simulacao precisa provar que parametros, animacao, graficos, tabela, vetores e teoria permanecem sincronizados em uma experiencia educacional convincente.
