# Architecture

## Stack recomendada

- React + TypeScript + Vite para o app.
- Material UI para layout, controles, tabelas e tema dark moderno.
- Three.js para viewport 3D/2.5D, objetos, vetores, camera, helpers e animacao.
- Plotly.js para graficos cientificos interativos.
- MDX/Markdown + KaTeX para apendice teorico, formulas e orientacao de uso das equacoes.
- `react-markdown`, `remark-math` e `rehype-katex` para renderizar Markdown local com formulas KaTeX no core.
- `lucide-react` para icones compactos de comandos conhecidos como play, pause e reset.
- JSON local para catalogo, parametros, presets e fixtures do core.

Dependencias opcionais por fase:

- Rapier para corpos rigidos 2D/3D quando houver colisoes, juntas e cenas mecanicas mais complexas.
- Matter.js para mecanica 2D simples se Rapier for pesado para uma simulacao especifica.
- PixiJS para cenas 2D com muitos sprites, particulas, ondas, mapas de campo ou efeitos fluidos.
- Web Audio API para simulacoes sonoras quando frequencia, batimentos ou efeito Doppler precisarem de audio controlado.
- Manim como ferramenta externa para videos ou assets explicativos pre-renderizados, nao como motor interativo do MVP.

## Principios arquiteturais

- Core-first: provar uma simulacao completa antes de expandir catalogo.
- Separar motor numerico, estado da UI, renderizacao, catalogo de formulas e conteudo teorico.
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
- `content`: MDX/Markdown, formulas, exemplos e metadados teoricos das simulacoes.
- `formula-guide`: metadados que conectam formulas a parametros, samples, vetores, graficos e limites de uso.
- `fixtures`: JSON local para presets e exemplos.

## Estrategia tecnica por area

- Mecanica: comecar com solucoes analiticas e integradores proprios simples. Usar Three.js para corpos, vetores, trajetorias, planos inclinados, orbitas e diagramas de forcas. Avaliar Rapier ou Matter.js apenas para colisoes e corpos rigidos que nao compensem motor proprio.
- Termodinamica: priorizar modelos analiticos, diagramas de estado e processos por trechos. Usar Plotly.js para `P-V`, `T-V`, curvas de aquecimento e energia; usar Three.js ou PixiJS apenas quando particulas ou mapas termicos melhorarem a explicacao.
- Oscilacoes e Ondas: usar solucoes analiticas para osciladores simples e ondas senoidais; usar integradores ou malhas discretas para acoplamentos, amortecimento, forca externa e propagacao. Avaliar PixiJS para ondas 2D densas e Web Audio API para som.
- Eletromagnetismo: usar superposicao vetorial, circuitos analiticos simples e integradores leves para transientes. Usar Three.js para vetores, cargas, bobinas e trajetorias; PixiJS pode entrar para mapas 2D de campo e equipotenciais.

## Fluxo do core

```text
Usuario altera parametro
  -> SimulationShell valida e normaliza unidades
  -> physics-core recalcula estado inicial e/ou timeline
  -> renderer recebe frame atual
  -> charts recebem series derivadas quando a saida de graficos esta ligada
  -> table recebe samples quando a saida de tabela esta ligada
  -> formula-guide destaca equacoes aplicaveis e variaveis usadas
  -> theory recebe parametros, equacoes, exemplos e notas do modelo
```

## Fronteiras entre core e acessorios

Core:

- uma simulacao funcional;
- parametros controlaveis;
- motor numerico testavel;
- visualizacao animada;
- graficos/tabela sincronizados;
- formulas aplicadas com quando e como usar;
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
primary:    #2DD4BF
info:       #38BDF8
warning:    #F59E0B
danger:     #F43F5E
vector:     #A3E635
```

O tema inicial usa `#2DD4BF` como acento principal teal e reserva `#38BDF8` para informacao/cyan. Deve parecer ferramenta cientifica: compacto, legivel, com controles claros e sem composicao de landing page.

## Estrategia de mocks e fixtures

Na Fase 1, usar:

- `fixtures/simulations/catalog.json` para areas e simulacoes.
- `fixtures/simulations/mechanics-pendulum.json` para parametros, presets e defaults.
- MDX local para teoria do pendulo e guia de formulas.
- Metadados locais para mapear formulas a parametros, samples, vetores e graficos.
- Dados gerados pelo motor numerico em runtime para graficos e tabela.

## Caminho de evolucao

1. Validar o pendulo simples com motor proprio.
2. Extrair contrato comum para simulacoes.
3. Adicionar `topicPath` e catalogo planejado para fisica basica.
4. Adicionar segunda simulacao mecanica para testar reuso.
5. Expandir por `Mecanica`, `Oscilacoes e Ondas`, `Termodinamica` e `Eletromagnetismo` em fatias pequenas.
6. Avaliar engines especializadas somente quando a simulacao exigir.
7. Persistencia, usuarios e backend entram depois do core comprovado.

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
- Web Audio API: https://developer.mozilla.org/docs/Web/API/Web_Audio_API
