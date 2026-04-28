# Architecture

## Stack recomendada

- React + TypeScript + Vite para o app.
- Material UI para layout, controles, tabelas e tema dark moderno.
- Three.js para viewport 3D/2.5D, objetos, vetores, camera, helpers e animacao.
- Plotly.js para graficos cientificos interativos.
- MDX/Markdown + KaTeX para apendice teorico e formulas.
- JSON local para catalogo, parametros, presets e fixtures do core.

Dependencias opcionais por fase:

- Rapier para corpos rigidos 2D/3D quando houver colisoes, juntas e cenas mecanicas mais complexas.
- Matter.js para mecanica 2D simples se Rapier for pesado para uma simulacao especifica.
- PixiJS para cenas 2D com muitos sprites, particulas ou efeitos fluidos.
- Manim como ferramenta externa para videos ou assets explicativos pre-renderizados, nao como motor interativo do MVP.

## Principios arquiteturais

- Core-first: provar uma simulacao completa antes de expandir catalogo.
- Separar motor numerico, estado da UI, renderizacao e conteudo teorico.
- Usar contratos de simulacao reutilizaveis entre areas.
- Usar fixtures locais ate haver evidencia de que a experiencia central funciona.
- Evitar backend ate existir necessidade real de persistencia ou colaboracao.
- Declarar limites fisicos do modelo dentro da propria simulacao.

## Modulos principais

- `simulation-shell`: orquestra layout, playback, parametros, graficos, tabela e teoria.
- `simulation-registry`: lista areas, simulacoes, status e metadados.
- `physics-core`: funcoes numericas puras, integradores e calculos derivados.
- `rendering`: adaptadores Three.js/PixiJS para desenhar o estado fisico.
- `charts`: adaptadores Plotly.js para series de dados.
- `theme`: tokens MUI, dark mode, paleta, componentes e densidade.
- `content`: MDX/Markdown e metadados teoricos das simulacoes.
- `fixtures`: JSON local para presets e exemplos.

## Fluxo do core

```text
Usuario altera parametro
  -> SimulationShell valida e normaliza unidades
  -> physics-core recalcula estado inicial e/ou timeline
  -> renderer recebe frame atual
  -> charts recebem series derivadas
  -> table recebe samples
  -> theory recebe parametros, equacoes e notas do modelo
```

## Fronteiras entre core e acessorios

Core:

- uma simulacao funcional;
- parametros controlaveis;
- motor numerico testavel;
- visualizacao animada;
- graficos/tabela sincronizados;
- apendice teorico.

Acessorios:

- login/auth;
- cadastro de turmas;
- salvar historico;
- painel administrativo;
- analytics avancado;
- marketplace de simulacoes;
- exportacao sofisticada.

## Tema visual

A UI deve usar MUI com dark graphite:

```text
background: #0F1115
surface:    #171A21
panel:      #20242D
border:     #2A2F3A
text:       #E6E8EC
primary:    #2DD4BF ou #38BDF8
warning:    #F59E0B
danger:     #F43F5E
vector:     #A3E635
```

O tema deve parecer ferramenta cientifica: compacto, legivel, com controles claros e sem composicao de landing page.

## Estrategia de mocks e fixtures

Na Fase 1, usar:

- `fixtures/simulations/catalog.json` para areas e simulacoes.
- `fixtures/simulations/mechanics-pendulum.json` para parametros, presets e defaults.
- MDX local para teoria do pendulo.
- Dados gerados pelo motor numerico em runtime para graficos e tabela.

## Caminho de evolucao

1. Validar o pendulo simples com motor proprio.
2. Extrair contrato comum para simulacoes.
3. Adicionar segunda simulacao mecanica para testar reuso.
4. Introduzir outras areas com simulacoes de baixa complexidade.
5. Avaliar engines especializadas somente quando a simulacao exigir.
6. Persistencia, usuarios e backend entram depois do core comprovado.

## Referencias tecnicas

- Three.js: https://threejs.org/docs/
- Material UI dark mode: https://mui.com/material-ui/customization/dark-mode/
- Material UI palette: https://mui.com/material-ui/customization/palette/
- Plotly.js: https://plotly.com/javascript/
- D3.js: https://d3js.org/
- KaTeX: https://katex.org/
- Rapier JS: https://rapier.rs/docs/user_guides/javascript/getting_started_js/
- Matter.js: https://brm.io/matter-js/docs/
- PixiJS renderers: https://pixijs.com/8.x/guides/components/renderers
- Manim Community: https://docs.manim.community/en/stable/
