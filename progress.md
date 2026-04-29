# Progress

## 2026-04-28

Criado pacote documental inicial para o PhysicSimulator com estrategia core-first.

Docs criados:

- `guides/00-index.md`
- `guides/01-strategy.md`
- `guides/02-product-spec.md`
- `guides/03-architecture.md`
- `guides/04-rules-and-constraints.md`
- `guides/05-roadmap.md`
- `guides/06-data-and-api.md`
- `guides/07-quality-and-operations.md`
- `guides/08-api-contracts.md`
- `guides/issues.md`
- `AGENTS.md`

Decisao core-first:

- A primeira entrega deve provar `Mecanica > Pendulo simples` com mocks/fixtures locais.
- O core precisa sincronizar parametros, animacao, vetores, graficos, tabela e apendice teorico.
- Catalogo amplo, auth, backend, dashboard e funcoes acessorias ficam para depois.

Primeira fatia recomendada:

1. Inicializar React + TypeScript + Vite.
2. Configurar Material UI com tema dark graphite.
3. Criar shell com sidebar, viewport, controles, graficos, tabela e teoria.
4. Implementar pendulo simples como simulacao modelo.

Validacao:

- Executado `validate_guides.py` da skill `project-strategy-plan`.
- Resultado: `[OK] guides pack looks core-first and complete.`

## 2026-04-28 - Formulas aplicadas

Atualizacao documental para exigir que as simulacoes incluam as formulas envolvidas nos processos analisados, com explicacao de como e quando usa-las.

Docs atualizados:

- `AGENTS.md`
- `guides/00-index.md`
- `guides/01-strategy.md`
- `guides/02-product-spec.md`
- `guides/03-architecture.md`
- `guides/04-rules-and-constraints.md`
- `guides/05-roadmap.md`
- `guides/06-data-and-api.md`
- `guides/07-quality-and-operations.md`
- `guides/08-api-contracts.md`
- `guides/issues.md`

Decisao:

- Cada simulacao funcional deve ter um guia de formulas com expressao, variaveis, unidades, quando usar, quando nao usar, exemplos e relacao com parametros, samples, graficos, vetores e tabela.

Validacao:

- Busca por `formula`, `equacao` e `quando usar` confirma a exigencia refletida nos guides impactados.
- Executado `validate_guides.py` da skill `project-strategy-plan`.
- Resultado: `[OK] guides pack looks core-first and complete.`

## 2026-04-28 - Plano curricular de simulacoes

Atualizacao documental para detalhar o catalogo planejado de fisica basica e transformar as simulacoes em tarefas do roadmap.

Docs atualizados:

- `guides/00-index.md`
- `guides/01-strategy.md`
- `guides/02-product-spec.md`
- `guides/03-architecture.md`
- `guides/04-rules-and-constraints.md`
- `guides/05-roadmap.md`
- `guides/06-data-and-api.md`
- `guides/07-quality-and-operations.md`
- `guides/08-api-contracts.md`
- `guides/09-simulation-catalog-plan.md`
- `guides/issues.md`

Decisoes:

- O catalogo planejado usa quatro areas principais: `Mecanica`, `Termodinamica`, `Oscilacoes e Ondas` e `Eletromagnetismo`.
- A primeira entrega funcional continua sendo `Mecanica > Pendulo simples`.
- As demais simulacoes entram como planejadas ate terem motor, cena, graficos, tabela, formulas, teoria e validacao.
- Tecnologias opcionais como PixiJS, Rapier, Matter.js, D3.js, Web Audio API e Manim so entram quando uma simulacao justificar.

Validacao:

- Busca por `Fluidos`, `Eletricidade`, `Magnetismo`, `Eletromagnetismo`, `Oscilacoes e Ondas` e `topicPath` confirma que a nova taxonomia esta refletida nos guides impactados.
- Executado `validate_guides.py` da skill `project-strategy-plan`.
- Resultado: `[OK] guides pack looks core-first and complete.`

## 2026-04-28 - Frontend inicial e tema

Executadas as proximas 2 tasks da Fase 0:

- Inicializar projeto frontend com React + TypeScript + Vite.
- Configurar Material UI e tema dark graphite.

Arquivos e estruturas criadas:

- `package.json`, `package-lock.json`, `index.html`, configs TypeScript, ESLint, Vite e Vitest.
- `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/theme/appTheme.ts`.
- `src/App.test.tsx` e `src/setupTests.ts`.

Decisao:

- O tema usa `#2DD4BF` como primaria teal e `#38BDF8` como cor informativa/cyan.

Validacao:

- Executado `npm run lint`.
- Executado `npm run test`.
- Executado `npm run build`.

## 2026-04-28 - Shell e motor inicial do pendulo

Executadas as proximas 5 tasks da Fase 1:

- Criar shell da aplicacao com sidebar, topbar, area central e painel de controles.
- Criar registry local de areas e simulacoes via JSON.
- Implementar `Mecanica > Pendulo simples` no registry.
- Implementar modelo numerico do pendulo com integrador deterministico.
- Gerar samples de tempo, angulo, velocidade, posicao e energia.

Arquivos e estruturas criadas/atualizadas:

- `fixtures/simulations/catalog.json`
- `fixtures/simulations/mechanics-pendulum.json`
- `src/simulation-registry/types.ts`
- `src/simulation-registry/catalog.ts`
- `src/simulation-registry/catalog.test.ts`
- `src/lib/physics/pendulum.ts`
- `src/lib/physics/pendulum.test.ts`
- `src/features/simulation-shell/SimulationShell.tsx`
- `src/App.tsx`
- `src/App.test.tsx`
- `tsconfig.app.json`

Decisoes:

- O pendulo usa integrador RK4 deterministico com seno completo e amortecimento angular linear opcional.
- O registry local vem de JSON e mantem apenas o pendulo como `available`; demais itens aparecem como `planned`.
- Os samples sao gerados em runtime pelo motor numerico e incluem tempo, angulo, velocidade angular, posicao cartesiana e energias cinetica, potencial e total.

Validacao:

- Executado `npm run lint`.
- Executado `npm run test`.
- Executado `npm run build`.

## 2026-04-28 - Visualizacao, graficos, tabela e formulas do pendulo

Executadas as proximas 5 tasks da Fase 1:

- Renderizar cena do pendulo em Three.js.
- Exibir vetores de peso, tensao e velocidade.
- Integrar Plotly.js para graficos de angulo, velocidade e energia.
- Exibir tabela sincronizada de amostras.
- Criar guia de formulas do pendulo com equacoes, variaveis, unidades, condicoes de uso e exemplos.

Arquivos e estruturas criadas/atualizadas:

- `fixtures/simulations/mechanics-pendulum.json`
- `.gitignore`
- `guides/05-roadmap.md`
- `package.json`
- `package-lock.json`
- `src/App.test.tsx`
- `src/features/simulation-shell/FormulaGuide.tsx`
- `src/features/simulation-shell/PendulumCharts.tsx`
- `src/features/simulation-shell/PendulumScene.tsx`
- `src/features/simulation-shell/PlotlyChart.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`
- `src/lib/physics/pendulum.ts`
- `src/lib/physics/pendulum.test.ts`
- `src/types/plotly.js-basic-dist-min.d.ts`

Decisoes:

- A cena usa Three.js com a massa, haste, rastro e vetores derivados do mesmo sample usado pelas metricas.
- Os graficos usam `plotly.js-basic-dist-min` carregado sob demanda para evitar importar o pacote completo de Plotly no bundle inicial.
- O guia de formulas reaproveita metadados locais do fixture e renderiza expressoes com KaTeX.
- A tabela, os graficos, os vetores e o guia de formulas seguem os samples gerados pelo motor numerico do pendulo.

Validacao:

- Executado `npm run lint`.
- Executado `npm run test`.
- Executado `npm run build`.
- Smoke visual headless em desktop `1440x1100` e mobile `390x900`: canvas WebGL presente, pixels nao brancos/coloridos detectados e sem overflow horizontal.
- Capturas geradas em `artifacts/physic-simulator-desktop.png` e `artifacts/physic-simulator-mobile.png`.

## 2026-04-28 - Apendice teorico, controles e smoke tests

Executadas as proximas 3 tasks da Fase 1:

- Criar apendice teorico em MDX/Markdown com KaTeX.
- Adicionar controles: play/pause, reset, comprimento, massa, gravidade, angulo inicial, velocidade angular, amortecimento e toggles.
- Criar testes do motor numerico e smoke test da tela.

Arquivos e estruturas criadas/atualizadas:

- `package.json`
- `package-lock.json`
- `guides/03-architecture.md`
- `guides/05-roadmap.md`
- `guides/issues.md`
- `progress.md`
- `src/App.test.tsx`
- `src/setupTests.ts`
- `src/content/simulations/mechanics/pendulum/theory.md`
- `src/features/simulation-shell/PendulumCharts.tsx`
- `src/features/simulation-shell/PendulumScene.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`
- `src/features/simulation-shell/TheoryAppendix.tsx`
- `src/lib/physics/pendulum.test.ts`

Decisoes:

- O apendice teorico do pendulo usa Markdown local com KaTeX, renderizado abaixo do guia de formulas para nao substituir a experiencia principal.
- Os controles de parametros, presets, play/pause, reset e toggles regeneram ou exibem dados a partir da mesma timeline do motor numerico.
- O smoke test da tela fica inicialmente em Testing Library/Vitest; a estrategia e2e final continua pendente.

Validacao:

- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`.

## 2026-04-28 - Pendulo mais leve e mais lento

Ajuste de performance e cadencia padrao apos validacao manual:

- O fixture padrao do pendulo passou de 12 s a 60 Hz para 10 s a 30 Hz, reduzindo a timeline inicial de 721 para 301 samples.
- O preset inicial ficou fisicamente mais calmo: fio mais longo, angulo inicial menor e amortecimento levemente reduzido.
- O playback visual agora roda a `0,6x` e o shell React atualiza a 24 fps.
- Os graficos passam por decimacao visual, atualizam com stride maior, mantem o range de tempo estavel entre renders e o Plotly recebe uma pequena janela de coalescencia antes de redesenhar.
- A cena Three.js deixou de recriar a geometria da haste a cada tick; a trilha passou a ser limitada e decimada, e o renderer usa configuracao mais economica.

Arquivos atualizados:

- `fixtures/simulations/mechanics-pendulum.json`
- `progress.md`
- `src/App.test.tsx`
- `src/features/simulation-shell/PendulumCharts.tsx`
- `src/features/simulation-shell/PendulumScene.tsx`
- `src/features/simulation-shell/PlotlyChart.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`

Validacao:

- Executado `npm install` para restaurar dependencias locais; houve avisos de cleanup em atalhos temporarios de `node_modules/.bin`, sem vulnerabilidades.
- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso existente de chunks acima de 500 kB.
- Executado `validate_guides.py`.
- Executado `validate_guides.py`.
- Smoke visual com Edge headless em `1440x1100`: canvas presente, pixels coloridos detectados na regiao da cena e DOM com 15 elementos Plotly, `301 amostras`, `30 Hz` e `0,6x` confirmados.
- Executado `validate_guides.py`.
- Executado `validate_guides.py`.

## 2026-04-28 - Playback visivel do pendulo

Ajuste de UX apos validacao manual:

- A simulacao do pendulo agora inicia em modo `rodando`, em vez de pausada.
- O viewport exibe um botao textual `Pausar` / `Reproduzir` com icone, alem do controle compacto lateral.
- O painel de controles mostra o status `rodando` ou `pausado`.

Arquivos atualizados:

- `guides/02-product-spec.md`
- `progress.md`
- `src/App.test.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`

Validacao:

- Executado `npm run test -- src/App.test.tsx`.
- Executado `npm run lint`.
- Executado `validate_guides.py`.

## 2026-04-28 - Graficos progressivos

Ajuste de sincronizacao visual:

- Os graficos do pendulo agora iniciam praticamente limpos e recebem apenas as amostras ja percorridas pelo tempo atual.
- O eixo de tempo dos graficos permanece fixo na duracao total da simulacao para evitar reescala visual a cada frame.
- A tabela passou a usar o mesmo recorte temporal dos graficos, evitando mostrar amostras futuras enquanto a simulacao ainda esta em execucao.

Arquivos atualizados:

- `progress.md`
- `src/features/simulation-shell/PendulumCharts.tsx`
- `src/features/simulation-shell/PlotlyChart.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`

Validacao:

- Executado `npm run test -- src/App.test.tsx`.
- Executado `npm run lint`.
- Executado `npm run build`.
- Executado `validate_guides.py`.

## 2026-04-28 - Suavizacao de playback e graficos

Correcao de performance apos validacao visual:

- O loop de playback deixou de atualizar todo o shell React a cada `requestAnimationFrame`; a UI agora recebe ticks em 30 fps, reduzindo custo de renderizacao.
- O tempo interno continua acumulado separadamente para preservar continuidade do playback.
- O Plotly deixou de executar `purge` a cada atualizacao de dados, evitando destruir e recriar os graficos progressivos repetidamente.
- O indice dos graficos passou a ser derivado diretamente do sample atual, removendo estado derivado e render extra.
- O servidor Vite foi reiniciado em porta fixa `5175` e conferido via HTTP para garantir que a versao nova esta sendo servida.

Arquivos atualizados:

- `progress.md`
- `src/features/simulation-shell/PlotlyChart.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`

Validacao:

- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`.

## 2026-04-28 - Toggles de saidas de dados

Ajuste de performance por controle manual:

- O painel de controles ganhou a secao `Saidas de dados`, com toggles para `Graficos` e `Tabela`.
- Quando `Graficos` esta desligado, o shell deixa de montar `PendulumCharts` e nao gera o recorte de samples usado pelas series Plotly.
- Quando `Tabela` esta desligada, o shell deixa de montar a tabela e nao calcula o recorte/stride das linhas tabulares.
- A trilha da cena foi desacoplada dos graficos e da tabela, mantendo o overlay visual independente das saidas de dados.
- O integrador mostra os estados `graficos` e `tabela` como ligado/desligado.

Arquivos atualizados:

- `guides/02-product-spec.md`
- `guides/03-architecture.md`
- `progress.md`
- `src/App.test.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`

Validacao:

- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso existente de chunks acima de 500 kB.
- Executado `validate_guides.py`.

## 2026-04-28 - Loop visual desacoplado do shell React

Correcao de performance da animacao:

- O `requestAnimationFrame` principal foi movido para `PendulumScene`, mantendo a atualizacao visual do Three.js fora do re-render completo do `SimulationShell`.
- A cena passou a ler a mesma timeline de samples por refs e renderizar o pendulo, vetores e trilha de forma imperativa a cada frame.
- O shell React agora recebe apenas leituras periodicas do sample atual, reduzindo trabalho de MUI, tabela, graficos, formulas e teoria durante o playback.
- A trilha do pendulo deixou de recriar `BufferGeometry` a cada atualizacao e passou a reutilizar um buffer dinamico com `setDrawRange`.
- O renderer WebGL passou de `low-power` para `high-performance`, com `devicePixelRatio` limitado a `1.25` para reduzir custo de preenchimento.
- O viewport ganhou indicadores visiveis de FPS e tempo de frame para acompanhar a fluidez local.
- `PendulumCharts` e `PlotlyChart` foram memoizados para evitar renders quando os recortes de dados ainda nao mudaram.
- O smoke test de UI teve timeout ampliado para 10 s porque o teste completo do shell com MUI, KaTeX e queries acessiveis estava ultrapassando o limite padrao por pequena margem.

Arquivos atualizados:

- `progress.md`
- `src/App.test.tsx`
- `src/features/simulation-shell/PendulumCharts.tsx`
- `src/features/simulation-shell/PendulumScene.tsx`
- `src/features/simulation-shell/PlotlyChart.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`

Validacao:

- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso existente de chunks acima de 500 kB.
- Executado `validate_guides.py`.
- Capturadas screenshots desktop e mobile em `artifacts/pendulum-desktop.png` e `artifacts/pendulum-mobile.png`; canvas confirmado como nao branco por amostragem de pixels.

## 2026-04-28 - Padrao de renderizacao performatica

Decisao documentada:

- O ajuste de performance do pendulo foi promovido a padrao do projeto.
- Simulacoes animadas devem usar renderer-first: o `requestAnimationFrame` pertence ao renderer visual, enquanto o shell React orquestra parametros, graficos, tabela, formulas e teoria sem re-renderizar tudo a cada frame.
- O padrao exige fonte fisica unica, snapshots periodicos para UI, buffers/geometrias reutilizados, limites de custo visual e medicao simples de FPS/frame time quando houver animacao continua.
- O roadmap agora inclui extrair esse runtime visual como parte do reuso da Fase 2.

Arquivos atualizados:

- `guides/00-index.md`
- `AGENTS.md`
- `guides/03-architecture.md`
- `guides/04-rules-and-constraints.md`
- `guides/05-roadmap.md`
- `guides/07-quality-and-operations.md`
- `guides/09-simulation-catalog-plan.md`
- `guides/issues.md`
- `progress.md`

Validacao:

- Executado `validate_guides.py`.

## 2026-04-29 - Ciclo ajustavel e janela movel dos graficos

Ajuste de UX e fluidez do pendulo:

- O tempo do ciclo da simulacao passou a ser um controle de runtime, com default de 30 s e limite local de 10 s a 120 s.
- A taxa de amostragem do pendulo passou de 30 Hz para 120 Hz para reduzir saltos visuais e melhorar a qualidade das series.
- Os graficos agora usam janela movel configuravel, com default de 12 s, mostrando os ultimos N segundos depois que o plot enche.
- A tabela segue o mesmo recorte temporal dos graficos para manter as amostras sincronizadas.
- A cena Three.js interpola entre samples da timeline durante o `requestAnimationFrame`, preservando a fonte fisica unica e suavizando o playback.

Arquivos atualizados:

- `fixtures/simulations/mechanics-pendulum.json`
- `guides/02-product-spec.md`
- `guides/03-architecture.md`
- `guides/04-rules-and-constraints.md`
- `guides/06-data-and-api.md`
- `guides/07-quality-and-operations.md`
- `guides/08-api-contracts.md`
- `progress.md`
- `src/App.test.tsx`
- `src/features/simulation-shell/PendulumCharts.tsx`
- `src/features/simulation-shell/PendulumScene.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`
- `src/features/simulation-shell/sampleWindow.ts`
- `src/features/simulation-shell/sampleWindow.test.ts`
- `src/simulation-registry/catalog.test.ts`
- `src/simulation-registry/types.ts`

Validacao:

- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso conhecido de chunks acima de 500 kB.
- Executado `validate_guides.py`.
- Smoke visual headless com Chrome/Playwright em desktop `1440x1100` e mobile `390x900`: canvas nao branco, pixels coloridos detectados, movimento detectado por diff de frames e sem overflow horizontal.
- Capturas geradas em `artifacts/pendulum-window-desktop.png`, `artifacts/pendulum-window-mobile.png`, `artifacts/pendulum-window-desktop-canvas.png` e `artifacts/pendulum-window-mobile-canvas.png`.

## 2026-04-29 - Controles sem remount dos graficos

Correcao de acoplamento e peso nos controles:

- `PendulumRuntime` deixou de usar `key` baseada no reset de playback, evitando desmontar viewport, tabela e graficos a cada alteracao de parametro.
- O reset agora atualiza o sample vivo e os stats via callback do renderer, preservando os componentes Plotly montados.
- Os controles numericos passaram a manter valor local durante edicao; sliders confirmam recalculo ao soltar, e inputs confirmam com Enter ou ao perder foco.
- Commits com o mesmo valor atual nao disparam novo reset nem recomputam a timeline.
- O smoke test da UI passou a verificar que o grafico de energia permanece o mesmo node DOM apos alterar um parametro fisico.

Arquivos atualizados:

- `guides/03-architecture.md`
- `guides/04-rules-and-constraints.md`
- `guides/07-quality-and-operations.md`
- `progress.md`
- `src/App.test.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`

Validacao:

- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso conhecido de chunks acima de 500 kB.
- Executado `validate_guides.py`.
- Smoke visual headless em `http://127.0.0.1:5181/`: alterar `Comprimento` manteve o mesmo node do grafico de energia e o mesmo node `.js-plotly-plot`, com `0` remocoes de graficos/Plotly observadas.
- Smoke de arraste do slider `Comprimento`: durante o drag e apos o commit, os 3 graficos Plotly permaneceram montados e nenhum node Plotly foi removido.

## 2026-04-29 - Graficos progressivos mais suaves

Correcao de cadencia visual dos graficos:

- O recorte progressivo dos graficos deixou de avancar em blocos de 8 samples e agora acompanha o sample atual sem stride adicional.
- O renderer passa leituras para a UI a cada 33 ms, em vez de 100 ms, reduzindo o tamanho visual de cada trecho novo do grafico.
- A decimacao visual dos graficos passou de 160 para 480 pontos maximos por serie visivel, mantendo mais detalhe na janela temporal.
- O grafico progressivo deixou de depender de redraw completo via `Plotly.react`; agora usa `LiveLineChart` em canvas com `requestAnimationFrame`, cursor de tempo e ponta interpolada.
- A amostra viva interpolada entra como ponto final da serie para que o desenho acompanhe o playback, sem parecer sequencia de screenshots.
- O contrato `SimulationTechnologyPlan.charting` passou a aceitar `live-canvas` para graficos temporais que precisam ser desenhados continuamente.

Arquivos atualizados:

- `fixtures/simulations/catalog.json`
- `guides/00-index.md`
- `guides/01-strategy.md`
- `guides/03-architecture.md`
- `guides/04-rules-and-constraints.md`
- `guides/05-roadmap.md`
- `guides/06-data-and-api.md`
- `guides/07-quality-and-operations.md`
- `guides/08-api-contracts.md`
- `guides/09-simulation-catalog-plan.md`
- `guides/issues.md`
- `progress.md`
- `src/features/simulation-shell/LiveLineChart.tsx`
- `src/features/simulation-shell/PendulumCharts.tsx`
- `src/features/simulation-shell/PendulumScene.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`
- `src/simulation-registry/catalog.test.ts`
- `src/simulation-registry/types.ts`

Validacao:

- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso conhecido de chunks acima de 500 kB.
- Executado `validate_guides.py`.
- Smoke visual headless em `http://127.0.0.1:5181/`: 3 canvases de grafico vivos, sem erro de console, pixels coloridos presentes e mudanca visual detectada em 11 de 11 intervalos de 80 ms.
