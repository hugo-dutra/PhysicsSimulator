# Architecture

## Stack recomendada

- React + TypeScript + Vite para o app.
- Material UI para layout, controles, tabelas e tema dark moderno.
- Three.js para viewport 3D/2.5D, objetos, vetores, camera, helpers e animacao.
- Plotly.js para graficos cientificos interativos e canvas/SVG renderer-first para graficos progressivos de alta frequencia.
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
- Declarar a ajuda de cada parametro no contrato/fixture da simulacao, para que a UI gere tooltips de interrogacao sem texto solto por componente.
- Tratar o `Simulation Fidelity Adjustment Guide` como gate arquitetural para qualquer simulacao nova ou alterada: o motor decide regimes e samples; renderers, graficos, tabela e formulas apenas consomem esse estado.
- Separar loop visual de alta frequencia do shell React; animacao em `requestAnimationFrame` deve pertencer ao renderer, nao ao layout completo da UI.

## Modulos principais

- `simulation-shell`: orquestra layout, playback, parametros, graficos, tabela e teoria.
- `simulation-registry`: lista areas, simulacoes, status e metadados.
- `physics-core`: funcoes numericas puras, integradores e calculos derivados.
- `rendering`: adaptadores Three.js/PixiJS para desenhar o estado fisico.
- `rendering/visualRuntime`: utilitarios compartilhados de renderer-first para `requestAnimationFrame`, leitura interpolada da timeline, escala de tempo de playback e metricas de FPS/frame time sem mover o loop para o shell React.
- `charts`: adaptadores Plotly.js, canvas ou SVG para series de dados, escolhidos pela cadencia visual necessaria.
- `theme`: tokens MUI, dark mode, paleta, componentes e densidade.
- `content`: MDX/Markdown, formulas, exemplos e metadados teoricos das simulacoes.
- `formula-guide`: metadados que conectam formulas a parametros, samples, vetores, graficos e limites de uso.
- `fixtures`: JSON local para presets e exemplos.
- `SidebarCatalog`: read model derivado do catalogo local, agrupando `SimulationDefinition` por area e subarea para menus expansiveis.

## Estrategia tecnica por area

- Mecanica: comecar com solucoes analiticas e integradores proprios simples. Usar Three.js para corpos, vetores, trajetorias, planos inclinados, orbitas e diagramas de forcas. Avaliar Rapier ou Matter.js apenas para colisoes e corpos rigidos que nao compensem motor proprio.
- Termodinamica: priorizar modelos analiticos, diagramas de estado e processos por trechos. Usar Plotly.js para `P-V`, `T-V`, curvas de aquecimento e energia; usar Three.js ou PixiJS apenas quando particulas ou mapas termicos melhorarem a explicacao.
- Oscilacoes e Ondas: usar solucoes analiticas para osciladores simples e ondas senoidais; usar integradores ou malhas discretas para acoplamentos, amortecimento, forca externa e propagacao. A subarea `Oscilacoes e Ondas > Oscilacoes` concentra o pendulo simples, a massa-mola vertical e os osciladores amortecido/forcado/acoplados, evitando uma subarea repetida dentro de Mecanica. A massa-mola vertical mantem suporte superior fixo, mola helicoidal, massa esferica, eixo Z vertical em Three.js e samples compartilhados para deformacao da mola, vetores, graficos, tabela e formulas. Apos aprovacao manual, oscilador amortecido analitico, oscilador forcado RK4 e osciladores acoplados RK4 ficam como `ready`, reutilizando o shell, a cena de molas e live-canvas; osciladores acoplados agora tambem usam cena didatica dedicada com duas massas, mola central destacada, energia por massa, dissipacao opcional, pulsos de acoplamento e presets de modos normais. `Ondas mecanicas` mantem `Onda em corda`, `Superposicao e interferencia` e `Ondas estacionarias` como `ready` apos aprovacao manual, com solucao senoidal viajante, superposicao de ondas contrapropagantes e modos estacionarios de corda fixa derivados do motor compartilhado e renderizados em Three.js. `Onda longitudinal em mola` entra como `analysis` no mesmo motor compartilhado, usando deslocamento material paralelo a uma mola diagonal, velocidade por rigidez/densidade linear ou `lambda f`, e renderer Three.js com espiras comprimindo/expandindo. `Som` reaproveita o perfil 1D do motor para `Batimentos` e `Efeito Doppler` como `ready` apos aprovacao manual, materializando esse perfil em um campo volumetrico 3D de pontinhos/marcadores de pressao no renderer Three.js. `Optica` entra como `analysis` com modelos analiticos/geometricos para Snell, pontos conjugados e Fraunhofer, usando Three.js para banco optico, raios, fendas e tela de intensidade; PixiJS permanece opcional para ondas 2D densas e Web Audio API para som audivel posterior.
- Eletromagnetismo: usar superposicao vetorial, circuitos analiticos simples e integradores leves para transientes. Usar Three.js para vetores, cargas, bobinas e trajetorias; PixiJS pode entrar para mapas 2D de campo e equipotenciais.

## Fluxo do core

```text
Usuario altera parametro
  -> SimulationShell valida e normaliza unidades
  -> physics-core recalcula estado inicial, regimes, timeline e campos derivados
  -> renderer recebe timeline/samples e controla o playback visual em loop proprio
  -> SimulationShell recebe leituras periodicas do sample atual para UI
  -> readouts detalhados e legenda numerica de vetores montam apenas quando o bloco retratil de leituras esta aberto
  -> charts recebem a janela movel dos ultimos N segundos quando o bloco chevron esta aberto
  -> table recebe o mesmo recorte temporal quando o bloco chevron esta aberto
  -> formula-guide renderiza equacoes aplicaveis quando o bloco chevron esta aberto
  -> theory renderiza parametros, equacoes, exemplos e notas do modelo quando o bloco chevron esta aberto
```

## Padrao de renderizacao e performance

Toda simulacao animada deve seguir o padrao adotado no pendulo:

- O renderer visual (`Three.js`, `PixiJS` ou equivalente) deve possuir o loop de `requestAnimationFrame` e atualizar objetos de cena de forma imperativa.
- O loop visual reutilizavel deve usar helpers comuns para agendar/cancelar frames, ler samples interpolados e atualizar metricas simples. Cada cena ainda mantem seus objetos, buffers e controles de camera locais.
- A velocidade de passagem do tempo e um fator de runtime de `0` a `1` aplicado ao delta do relogio visual. `1` preserva tempo normal, valores intermediarios geram camera lenta continua, e `0` equivale a pausa sem resetar estado, samples ou graficos.
- Simulacoes com periodos fisicos muito longos podem declarar um runtime adicional de compactacao de tempo do modelo, como `modelTimeScale`, desde que o controle seja visivel, documentado e aplicado antes da leitura do mesmo sample fisico usado por cena, graficos, tabela e formulas.
- Cenas Three.js devem usar espaco 3D com eixo Z vertical quando houver viewport espacial; o movimento fisico pode continuar planar, mas deve ser projetado para objetos 3D e camera orbitavel.
- Cenas Three.js com plano de grade devem incluir um marcador de origem compartilhado, desenhado como eixos X, Y e Z translucidos no canto inferior esquerdo da grade, alem de uma legenda DOM fixa no canto superior esquerdo do canvas. Essa referencia e visual e nao altera samples, camera ou fisica.
- O padrao de camera inicial e orbitavel por drag bidimensional no canvas: movimento horizontal altera yaw ao redor do eixo Z e movimento vertical altera pitch para inspecao por cima ou por baixo, com Shift + scroll fazendo zoom em direcao a cena. Esses controles pertencem ao renderer e devem atualizar camera/refs imperativamente, sem re-renderizar o shell React.
- O shell React deve orquestrar parametros, toggles, layout, graficos, tabela, formulas e teoria, mas nao deve re-renderizar a arvore inteira a cada frame.
- A fonte fisica continua unica: motor numerico, cena, graficos, tabela e formulas derivam dos mesmos parametros e samples.
- O bloco de leituras instantaneas e legenda detalhada de vetores deve iniciar fechado por padrao para preservar area de simulacao. Quando fechado, componentes que formatam metricas ou calculam valores de legenda detalhada devem permanecer desmontados; quando aberto, eles consomem o sample vivo sem criar nova fonte numerica.
- Campos derivados como velocidade linear tangencial, aceleracao angular, aceleracao tangencial, aceleracao radial e modulo total de aceleracao pertencem ao sample do motor, nao a calculos soltos de UI.
- O renderer pode manter refs para timeline, parametros e flags visuais; a UI recebe snapshots periodicos do sample atual apenas na cadencia necessaria para leitura humana.
- Buffers e geometrias dinamicas devem ser reutilizados quando possivel; evitar recriar `BufferGeometry`, materiais, renderers ou series pesadas dentro do frame loop.
- `devicePixelRatio`, quantidade de pontos de trilha, densidade de particulas e amostragem visual devem ter limites explicitos para proteger maquinas boas e medianas.
- Graficos Plotly, tabelas e conteudo KaTeX/Markdown nao entram no caminho quente da animacao; atualizar por recorte, decimacao, memoizacao ou toggle quando necessario.
- Saidas pesadas de simulacao, como graficos, tabela, formulas e teoria, devem usar blocos chevron recolhiveis. Recolher um bloco deve desmontar o conteudo e suspender processamento derivado, nao apenas ocultar via CSS.
- Esses blocos de saida pesada devem iniciar fechados por padrao; o clique no cabecalho precisa alternar montagem e desmontagem do conteudo.
- Viewport, graficos, tabela, formulas e apendice teorico devem seguir o padrao de painel maximizavel: um unico painel pode ocupar a area util da janela, os demais paineis ficam invisiveis, e a acao de minimizar restaura o layout e o estado aberto/fechado anterior.
- Quando graficos ou tabela estiverem maximizados, a fonte de tempo e samples da simulacao deve continuar ativa para preservar sincronizacao. No pendulo, enquanto o runtime visual ainda e a fonte do sample vivo, o viewport pode ficar visualmente oculto, mas nao deve ser desmontado durante esse foco.
- Graficos podem ser movidos para um slot lateral dentro do viewport por acao de olho. O slot usa a mesma configuracao de series, janela temporal e samples ja calculados para graficos; selecionar um grafico nao cria uma segunda fonte numerica nem altera o loop Three.js.
- Graficos progressivos em tempo real nao devem depender de redraw completo em blocos. Use adapter imperativo com `requestAnimationFrame` (canvas/SVG), ponta/cursor interpolado, densidade suficiente de pontos e recorte movel suave.
- Controles numericos podem manter valor local de edicao e confirmar recalculos caros apenas ao soltar o slider, pressionar Enter ou sair do input.
- Simulacoes com timeline longa devem separar horizonte calculado de samples, taxa de amostragem, contador continuo de playback e janela visivel de graficos para preservar fluidez sem perder contexto historico.
- Tabelas sincronizadas devem manter quantidade estavel de linhas visiveis durante playback, preenchendo slots vazios ou decimando amostras sem mudar a altura do bloco.
- Viewports devem expor medicao simples de FPS ou frame time durante desenvolvimento ou quando houver risco de peso visual.
- Objetos principais de cena devem usar volume 3D quando isso ajuda a leitura espacial. No pendulo simples, a massa e um cubo 3D e nao um circulo 2D.
- A segunda simulacao funcional, `Mecanica > Dinamica > Plano inclinado com atrito`, usa o mesmo padrao: bloco 3D, plano inclinado Three.js, vetores, trilha, graficos live-canvas, tabela, formulas e teoria sincronizados pela mesma timeline.
- As primeiras simulacoes de `Mecanica > Cinematica` reutilizam um motor analitico comum e uma cena Three.js 2.5D compartilhada para MRU, MUV/queda livre, lancamento obliquo e MCU. O mesmo modulo analitico tambem atende `Massa-mola vertical`, `Maquina de Atwood`, `Forca centripeta em curva`, `Trabalho e energia em trilho`, `Colisoes 1D e 2D`, `Equilibrio de particula`, `Torque, alavancas e centro de massa`, `Rotacao de corpo rigido`, `Rolamento sem escorregamento`, `Campo gravitacional e orbitas`, `Hidrostatica e empuxo` e `Continuidade e Bernoulli`, com campos extras de forca, tensao, atrito, trabalho, dissipacao, percentual de perda, momento linear, impulso, torque, centro de massa, bracos de alavanca, momento de inercia, grandezas angulares, campo gravitacional, pressao, vazao, empuxo, massa, densidade derivada, fracao submersa, deformacao estatica da mola e energia elastica/gravitacional quando o modelo exige. O renderer compartilhado pode especializar a cena quando o fenomeno exigir uma leitura didatica propria, como a mola vertical, a rampa em U de energia, a gangorra de torque/alavancas, a roda de rolamento, o corpo central orbital ou o tanque transparente de hidrostatica, desde que a especializacao continue usando `KinematicsSample` como unica fonte para corpo, rastro, vetores e paineis. Cada simulacao ainda declara seus proprios parametros, formulas, teoria, limites e graficos.

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
- O catalogo local deve incluir todas as simulacoes planejadas em `09-simulation-catalog-plan.md`, agrupadas por `topicPath`. Depois da validacao manual, `simple-pendulum`, `mass-spring`, `uniform-linear-motion`, `uniformly-accelerated-motion`, `projectile-motion`, `inclined-plane-friction`, `atwood-machine`, `centripetal-force-curve`, `work-energy-track`, `collisions-1d-2d`, `uniform-circular-motion`, `particle-equilibrium`, `torque-levers-center-mass`, `rigid-body-rotation`, `rolling-without-slipping`, `gravitational-field-orbits`, `hydrostatics-buoyancy`, `continuity-bernoulli`, `damped-oscillator`, `forced-oscillator-resonance`, `coupled-oscillators`, `wave-on-string`, `superposition-interference`, `standing-waves`, `beats` e `doppler-effect` ficam como `ready`; `longitudinal-wave`, `reflection-refraction`, `lenses-mirrors` e `light-diffraction-interference` ficam como `analysis` ate teste manual; demais itens permanecem `planned` ate terem motor, cena, graficos, tabela, formulas e teoria. Uma simulacao so deve virar `ready` depois da validacao manual do dono do projeto.
- `fixtures/simulations/mechanics-pendulum.json` para parametros, presets e defaults.
- `fixtures/simulations/mechanics-inclined-plane-friction.json` para parametros, presets e defaults do plano inclinado.
- `fixtures/simulations/mechanics-uniform-linear-motion.json`, `mechanics-uniformly-accelerated-motion.json`, `mechanics-projectile-motion.json`, `mechanics-uniform-circular-motion.json`, `mechanics-mass-spring.json`, `mechanics-atwood-machine.json`, `mechanics-centripetal-force-curve.json`, `mechanics-work-energy-track.json`, `mechanics-collisions-1d-2d.json`, `mechanics-particle-equilibrium.json`, `mechanics-torque-levers-center-mass.json`, `mechanics-rigid-body-rotation.json`, `mechanics-rolling-without-slipping.json`, `mechanics-gravitational-field-orbits.json`, `mechanics-hydrostatics-buoyancy.json`, `mechanics-continuity-bernoulli.json`, `waves-damped-oscillator.json`, `waves-forced-oscillator-resonance.json`, `waves-coupled-oscillators.json`, `waves-longitudinal-wave.json`, `waves-beats.json`, `waves-doppler-effect.json`, `waves-reflection-refraction.json`, `waves-lenses-mirrors.json` e `waves-light-diffraction-interference.json` para parametros, presets, formulas e limites das simulacoes compartilhadas.
- MDX local para teoria do pendulo e guia de formulas.
- Metadados locais para mapear formulas a parametros, samples, vetores e graficos.
- Metadados locais de ajuda para cada parametro fisico e de runtime, renderizados como tooltip de interrogacao no painel de controles.
- Dados gerados pelo motor numerico em runtime para graficos e tabela, incluindo cinematicas derivadas usadas por legendas e formulas.

## Caminho de evolucao

1. Validar o pendulo simples com motor proprio.
2. Extrair contrato comum para simulacoes.
3. Adicionar `topicPath` e catalogo planejado para fisica basica.
4. Adicionar segunda simulacao mecanica para testar reuso.
5. Adicionar o primeiro lote de Cinematica analitica para testar velocidade de producao.
6. Adicionar Atwood, forca centripeta em curva e trabalho/energia em trilho para validar reuso em Dinamica e Energia.
7. Adicionar colisoes, equilibrio, torque/alavancas e rotacao para cobrir momento, estatica e primeiros conceitos angulares no mesmo shell.
8. Adicionar rolamento, gravitacao e fluidos basicos para fechar a cobertura mecanica introdutoria funcional, incluindo `Continuidade e Bernoulli` pronta apos aprovacao manual e revisao visual do Venturi.
9. Expandir `Oscilacoes e Ondas` a partir dos tres osciladores e das tres primeiras ondas mecanicas aprovadas como `ready`, adicionar a onda longitudinal em mola como `analysis`, manter `Batimentos` e `Efeito Doppler` aprovados como `ready` e a primeira fatia de Optica em `analysis`, depois seguir para `Termodinamica` e `Eletromagnetismo` em fatias pequenas, sempre aplicando o gate de fidelidade antes de promover ou manter simulacoes como `analysis` ou `ready`.
10. Avaliar engines especializadas somente quando a simulacao exigir.
11. Persistencia, usuarios e backend entram depois do core comprovado.

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
