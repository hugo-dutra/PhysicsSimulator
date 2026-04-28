# Agent Instructions

## Objetivo do repositorio

PhysicSimulator e uma aplicacao educacional para simulacoes de fisica. O objetivo e unir simulacao interativa, graficos, tabelas, vetores e apendice teorico em uma interface moderna.

## Antes de agir

Leia `guides/00-index.md` primeiro. Para qualquer mudanca de produto, arquitetura, dados, roadmap ou validacao, leia tambem os guides relacionados.

## Regra core-first

A primeira entrega funcional deve provar `Mecanica > Pendulo simples` com mocks/fixtures locais. Nao priorize login, auth, cadastros, dashboard administrativo, backend, billing ou catalogo amplo antes da prova do core.

## Stack planejada

- React + TypeScript + Vite.
- Material UI com tema dark graphite e acento cyan/teal.
- Three.js para cena principal.
- Plotly.js para graficos.
- MDX/Markdown + KaTeX para teoria.
- JSON local para catalogo, parametros e presets na fase core.

## Hard rules

- Nao quebrar a sincronizacao entre motor numerico, cena, graficos e tabela.
- Toda simulacao deve declarar parametros, unidades e limites do modelo.
- Use dados locais enquanto o core nao estiver validado.
- Mantenha UI compacta, cientifica e orientada a ferramenta.
- Atualize os guides quando decisoes estruturais mudarem.

## Validacao

Quando o frontend existir, rode checks proporcionais:

```bash
npm run build
npm run test
npm run lint
```

Enquanto o projeto estiver apenas documental, valide com:

```bash
python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator
```
