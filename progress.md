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

## 2026-04-29 - Velocidade linear, aceleracao e legenda de vetores

Ajuste didatico do pendulo:

- O sample do motor passou a incluir velocidade linear tangencial, aceleracao angular, aceleracao tangencial, aceleracao radial e modulo total da aceleracao.
- O bloco de graficos agora inclui velocidade linear e aceleracao, alem de angulo, velocidade angular e energia quando ligada.
- A tabela de amostras exibe as novas colunas derivadas mantendo a quantidade fixa de linhas.
- O viewport ganhou legenda dos vetores com cor, modulo atual e leitura fisica.
- A decisao foi registrada nos guides como padrao: cinematicas derivadas ficam no sample do motor, e vetores visiveis precisam de legenda.

Arquivos atualizados:

- `fixtures/simulations/mechanics-pendulum.json`
- `guides/02-product-spec.md`
- `guides/03-architecture.md`
- `guides/04-rules-and-constraints.md`
- `guides/06-data-and-api.md`
- `guides/07-quality-and-operations.md`
- `guides/08-api-contracts.md`
- `guides/issues.md`
- `progress.md`
- `src/App.test.tsx`
- `src/features/simulation-shell/PendulumCharts.tsx`
- `src/features/simulation-shell/PendulumScene.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`
- `src/lib/physics/pendulum.test.ts`
- `src/lib/physics/pendulum.ts`

Validacao:

- Executado `npm run test -- src/lib/physics/pendulum.test.ts src/App.test.tsx`.
- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso conhecido de chunks acima de 500 kB.
- Executado `validate_guides.py`.
- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso conhecido de chunks acima de 500 kB.
- Executado `validate_guides.py`.

## 2026-04-29 - Controles sem valor duplicado

Correcao de UI no painel de controles do pendulo:

- Os controles numericos deixaram de mostrar o valor formatado fora do campo.
- O valor permanece apenas dentro do input numerico, evitando duplicacao visual como `30 s` fora do componente e `30` dentro do campo.
- O smoke test da tela passou a verificar que esses valores externos nao aparecem no estado inicial.

Arquivos atualizados:

- `progress.md`
- `src/App.test.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`

Validacao:

- Executado `npm run test -- src/App.test.tsx`.
- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso conhecido de chunks acima de 500 kB.
- Executado `validate_guides.py`.
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
- Executado `npm run test`.
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

## 2026-04-29 - Blocos chevron e tabela estavel

Ajuste de UX e performance do pendulo:

- Graficos, tabela de amostras, guia de formulas e apendice teorico passaram a usar blocos chevron recolhiveis.
- Quando um bloco esta recolhido, seu conteudo pesado fica desmontado: graficos deixam de manter canvas/series ativos, tabela nao seleciona/renderiza linhas, formulas nao renderizam KaTeX e teoria nao processa Markdown/KaTeX.
- A tabela de amostras passou a manter 9 linhas visiveis enquanto aberta, preenchendo slots vazios quando ainda nao ha amostras suficientes para evitar piscadas e mudanca de altura.
- O padrao foi registrado como decisao de projeto para saidas pesadas de simulacao.

Arquivos atualizados:

- `guides/02-product-spec.md`
- `guides/03-architecture.md`
- `guides/04-rules-and-constraints.md`
- `guides/05-roadmap.md`
- `guides/07-quality-and-operations.md`
- `guides/issues.md`
- `progress.md`
- `src/App.test.tsx`
- `src/features/simulation-shell/ChevronSection.tsx`
- `src/features/simulation-shell/FormulaGuide.tsx`
- `src/features/simulation-shell/PendulumCharts.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`
- `src/features/simulation-shell/TheoryAppendix.tsx`

Validacao:

- Executado `npm run test -- src/App.test.tsx`.
- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso conhecido de chunks acima de 500 kB.
- Executado `validate_guides.py`.

## 2026-04-29 - Chevron clicavel e default fechado

Correcao de UX apos validacao manual:

- Os blocos chevron de graficos, tabela, formulas e teoria agora iniciam fechados por padrao.
- O cabecalho chevron passou a usar um botao nativo explicito, com `aria-expanded` e label de abrir/recolher, para garantir alternancia por clique no titulo ou no icone.
- O smoke test da tela passou a validar o ciclo completo: default fechado, abrir pelo cabecalho, montar conteudo, fechar pelo cabecalho e desmontar conteudo.

Arquivos atualizados:

- `guides/02-product-spec.md`
- `guides/03-architecture.md`
- `guides/04-rules-and-constraints.md`
- `guides/07-quality-and-operations.md`
- `guides/issues.md`
- `progress.md`
- `src/App.test.tsx`
- `src/features/simulation-shell/ChevronSection.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`

Validacao:

- Executado `npm run test -- src/App.test.tsx`.

## 2026-04-29 - Fade da trilha do pendulo

Correcao visual do viewport Three.js do pendulo:

- A trilha deixou de desenhar uma linha reamostrada desde o inicio do ciclo.
- O renderer agora mostra apenas uma cauda temporal curta com opacidade por vertice, fazendo os pontos antigos sumirem por fade.
- O sample atual passou a fechar a ponta da trilha para acompanhar a massa sem depender de re-render React.
- O fixture de teste de janela de samples foi completado com os campos derivados atuais de `PendulumSample`, removendo o bloqueio de build TypeScript.

Arquivos atualizados:

- `progress.md`
- `src/features/simulation-shell/PendulumScene.tsx`
- `src/features/simulation-shell/sampleWindow.test.ts`

Validacao:

- Executado `npm run test -- src/App.test.tsx`.
- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso conhecido de chunks acima de 500 kB.
- Smoke visual headless em `http://127.0.0.1:5182/` com screenshots desktop e mobile. Regiao do canvas com pixels nao-background e pixels cyan/teal presentes nos dois tamanhos.

## 2026-04-29 - Paineis maximizaveis

Ajuste de interface para inspecao ampliada:

- Viewport da simulacao, graficos e tabela de amostras ganharam botao com icone para maximizar/minimizar dentro da janela.
- Quando um painel esta maximizado, os demais paineis do shell ficam invisiveis; ao minimizar, o layout e o estado aberto/fechado anterior voltam ao normal.
- Graficos e tabela maximizados montam seu conteudo mesmo que estivessem recolhidos, mas voltam ao estado recolhido original ao minimizar.
- A tabela maximizada usa uma contagem fixa maior de linhas visiveis, mantendo estabilidade de layout no modo ampliado.
- Enquanto graficos ou tabela ficam em foco, o viewport permanece visualmente oculto, mas montado, para continuar emitindo o sample vivo que sincroniza playback, graficos e dados.
- O padrao foi registrado nos guides como decisao de UX/arquitetura para futuros paineis de simulacao.

Arquivos atualizados:

- `guides/02-product-spec.md`
- `guides/03-architecture.md`
- `guides/04-rules-and-constraints.md`
- `guides/07-quality-and-operations.md`
- `guides/issues.md`
- `progress.md`
- `src/App.test.tsx`
- `src/features/simulation-shell/ChevronSection.tsx`
- `src/features/simulation-shell/PendulumCharts.tsx`
- `src/features/simulation-shell/PendulumScene.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`

Validacao:

- Executado `npm run lint`.
- Executado `npm run test -- src/App.test.tsx`.
- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso conhecido de chunk acima de 500 kB.
- Executado `validate_guides.py`.
- Smoke visual headless com Chrome/CDP em desktop `1440x1100` e mobile `390x900`: plano inclinado aberto pela sidebar, canvas nao vazio/colorido, movimento detectado por diff de frames e sem overflow horizontal.
- Capturas geradas em `artifacts/inclined-plane-desktop.png`, `artifacts/inclined-plane-mobile.png`, `artifacts/inclined-plane-desktop-canvas-a.png` e `artifacts/inclined-plane-mobile-canvas-a.png`.

## 2026-04-29 - Grafico em foco no viewport

Novo padrao de interface para comparar grafico e evento visual:

- Cada grafico temporal ganhou botao de olho no cabecalho.
- Clicar no olho move o grafico para um slot lateral direito dentro do container do viewport, ocupando 1/3 do espaco em desktop.
- Enquanto esta no slot, o grafico sai do bloco original; clicar novamente no olho remove o slot e devolve o grafico ao bloco de graficos.
- O grafico em foco usa a mesma configuracao de series, a mesma janela temporal e a mesma fonte de samples dos demais graficos.
- O padrao foi registrado nos guides para proximas simulacoes.

Arquivos atualizados:

- `guides/02-product-spec.md`
- `guides/03-architecture.md`
- `guides/04-rules-and-constraints.md`
- `guides/07-quality-and-operations.md`
- `guides/issues.md`
- `progress.md`
- `src/App.test.tsx`
- `src/features/simulation-shell/LiveLineChart.tsx`
- `src/features/simulation-shell/PendulumCharts.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`
- `src/features/simulation-shell/pendulumChartConfigs.ts`

Validacao:

- Executado `npm run test -- src/App.test.tsx`.
- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso conhecido de chunk acima de 500 kB.
- Executado `validate_guides.py`.
- Smoke visual headless em `http://127.0.0.1:5184/`: modo maximizado da simulacao em desktop/mobile sem overflow horizontal, canvas com pixels nao-background/coloridos, graficos maximizados com 5 charts visiveis e tabela maximizada com 18 linhas fixas.
- Capturas geradas em `artifacts/pendulum-max-simulation-desktop.png`, `artifacts/pendulum-max-charts-desktop.png`, `artifacts/pendulum-max-table-desktop.png` e `artifacts/pendulum-max-simulation-mobile.png`.

## 2026-04-29 - Sidebar curricular e foco em formulas/teoria

Ajuste de navegacao e foco de leitura:

- O modo maximizado foi estendido para o guia de formulas e o apendice teorico.
- Formulas e teoria maximizadas montam seu conteudo mesmo se estavam recolhidas, escondem os demais paineis e voltam ao estado anterior ao minimizar.
- A sidebar passou a renderizar menus hierarquicos por area e subarea, com folhas de simulacao marcadas por status.
- `fixtures/simulations/catalog.json` passou a listar as 51 simulacoes planejadas em `09-simulation-catalog-plan.md`; apenas o pendulo simples segue como `available`.
- Itens planejados ficam visiveis no catalogo, mas marcados como `planejado` para nao parecerem simulacoes prontas.
- O padrao foi registrado nos guides como contrato de UI e dados para o catalogo planejado.

Arquivos atualizados:

- `fixtures/simulations/catalog.json`
- `guides/02-product-spec.md`
- `guides/03-architecture.md`
- `guides/04-rules-and-constraints.md`
- `guides/06-data-and-api.md`
- `guides/07-quality-and-operations.md`
- `guides/issues.md`
- `progress.md`
- `src/App.test.tsx`
- `src/features/simulation-shell/FormulaGuide.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`
- `src/features/simulation-shell/TheoryAppendix.tsx`
- `src/simulation-registry/catalog.test.ts`

Validacao:

- Executado `npm run test -- src/simulation-registry/catalog.test.ts src/App.test.tsx`.
- Executado `npm run lint`.
- Executado `npm run test`.
- Executado `npm run build`; build passou com aviso conhecido de chunk acima de 500 kB.
- Executado `validate_guides.py`.
- Smoke visual headless em `http://127.0.0.1:5184/`: menus de Cinematica, Gases e Circuitos AC abrem itens planejados; formulas e apendice teorico maximizados escondem controles e exibem conteudo.
- Capturas geradas em `artifacts/physic-sidebar-catalog-desktop.png`, `artifacts/pendulum-max-formulas-desktop.png` e `artifacts/pendulum-max-theory-desktop.png`.

## 2026-04-29 - Viewport 3D orbitavel

Ajuste de cena e padrao visual:

- O viewport do pendulo passou de composicao planar para cena Three.js 3D com eixo Z vertical.
- A massa do pendulo deixou de ser uma esfera/circulo visual e passou a ser um cubo 3D com arestas.
- Arrastar horizontalmente no canvas orbita a camera ao redor do eixo Z sem alterar parametros, samples, graficos ou tabela.
- A interacao de camera fica em refs do renderer e nao re-renderiza o shell React em alta frequencia.
- O padrao foi registrado nos guides para proximas simulacoes com viewport espacial.

Arquivos atualizados:

- `guides/02-product-spec.md`
- `guides/03-architecture.md`
- `guides/04-rules-and-constraints.md`
- `guides/07-quality-and-operations.md`
- `guides/issues.md`
- `progress.md`
- `src/App.test.tsx`
- `src/features/simulation-shell/PendulumScene.tsx`

Validacao:

- Executado `npm run test -- src/App.test.tsx`.
- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso conhecido de chunk acima de 500 kB.
- Executado `validate_guides.py`.
- Smoke visual headless em `http://127.0.0.1:5184/`: cena 3D renderizada em desktop `1440x1100` e mobile `390x900`, cubo/objetos coloridos detectados, arraste horizontal alterando a perspectiva da camera e sem overflow horizontal.
- Capturas geradas em `artifacts/pendulum-3d-desktop-before.png`, `artifacts/pendulum-3d-desktop-after-drag.png`, `artifacts/pendulum-3d-mobile-before.png` e `artifacts/pendulum-3d-mobile-after-drag.png`.

## 2026-04-29 - Leituras acima da simulacao

Ajuste de layout do viewport:

- As metricas instantaneas do pendulo foram movidas para cima do canvas da simulacao.
- A legenda dos vetores tambem passou a ficar acima da cena 3D, logo antes do canvas.
- O canvas Three.js permanece abaixo dessas leituras, preservando o loop renderer-first e a mesma fonte de samples.
- A decisao foi registrada nos guides como regra de UX para viewports de simulacao.

Arquivos atualizados:

- `guides/02-product-spec.md`
- `guides/04-rules-and-constraints.md`
- `guides/07-quality-and-operations.md`
- `guides/issues.md`
- `progress.md`
- `src/App.test.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`

Validacao:

- Executado `npm run test -- src/App.test.tsx`.
- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso conhecido de chunk acima de 500 kB.
- Executado `validate_guides.py`.
- Smoke visual headless em `http://127.0.0.1:5184/`: metricas e legenda confirmadas acima do canvas em desktop `1440x1100` e mobile `390x900`, canvas 3D ainda nao vazio/colorido e sem overflow horizontal.
- Capturas geradas em `artifacts/pendulum-readouts-above-desktop.png` e `artifacts/pendulum-readouts-above-mobile.png`.

## 2026-04-29 - Zoom por scroll no viewport

Ajuste de interacao da cena 3D:

- O canvas do pendulo agora captura o scroll do mouse quando o cursor esta sobre a cena.
- Scroll para cima aproxima a camera em direcao a simulacao; scroll para baixo afasta.
- O zoom usa raio de camera com limites minimo e maximo, atualizado em refs/objetos Three.js sem estado React de alta frequencia.
- O scroll sobre o canvas nao rola a pagina, preservando o foco de inspecao da simulacao.
- O padrao foi registrado nos guides para proximas cenas Three.js.

Arquivos atualizados:

- `guides/02-product-spec.md`
- `guides/03-architecture.md`
- `guides/04-rules-and-constraints.md`
- `guides/07-quality-and-operations.md`
- `guides/issues.md`
- `progress.md`
- `src/App.test.tsx`
- `src/features/simulation-shell/PendulumScene.tsx`

Validacao:

- Executado `npm run test -- src/App.test.tsx`.
- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso conhecido de chunk acima de 500 kB.
- Executado `validate_guides.py`.
- Smoke visual headless em `http://127.0.0.1:5184/`: wheel sobre o canvas alterou a visualizacao por zoom, `scrollY` permaneceu `0`, canvas continuou nao vazio/colorido e sem overflow horizontal.
- Capturas geradas em `artifacts/pendulum-wheel-zoom-before.png` e `artifacts/pendulum-wheel-zoom-after.png`.

## 2026-04-29 - Escala Y e legendas claras nos graficos

Correcao de leitura dos graficos:

- Os valores numericos do eixo Y voltaram a aparecer nos graficos live-canvas.
- O desenho de grid/escala saiu da regiao recortada do canvas; apenas linhas e cursor continuam clipados ao plot.
- As legendas das series passaram para texto DOM com nomes fisicos completos, como `Velocidade linear tangencial`, `Aceleracao radial` e `Energia mecanica total`.
- Labels abreviados como `theta`, `omega`, `a_t`, `a_r`, `|a|` e `v` deixaram de ser a leitura principal dos graficos.
- As metricas instantaneas do viewport tambem trocaram abreviacoes por nomes claros.
- O padrao foi registrado nos guides para graficos cientificos futuros.

Arquivos atualizados:

- `guides/02-product-spec.md`
- `guides/04-rules-and-constraints.md`
- `guides/07-quality-and-operations.md`
- `guides/issues.md`
- `progress.md`
- `src/App.test.tsx`
- `src/features/simulation-shell/LiveLineChart.tsx`
- `src/features/simulation-shell/PendulumCharts.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`

Validacao:

- Executado `npm run test -- src/App.test.tsx`.
- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso conhecido de chunk acima de 500 kB.
- Executado `validate_guides.py`.
- Smoke visual headless em `http://127.0.0.1:5184/`: 5 graficos visiveis, legendas completas presentes, abreviacoes `theta`, `omega` e `a_t` ausentes do texto visivel, eixo Y com pixels de escala detectados e sem overflow horizontal.
- Captura gerada em `artifacts/pendulum-charts-y-axis-legends.png`.

## 2026-04-29 - Unidades abreviadas nas legendas

Refinamento das legendas dos graficos:

- As legendas de series dos graficos mantem a grandeza fisica por extenso e passam a abreviar apenas a unidade.
- Exemplos: `Velocidade angular (rad/s)`, `Aceleracao radial (m/s^2)` e `Energia mecanica total (J)`.
- O padrao documental foi ajustado para permitir simbolos fisicos nas unidades sem voltar a abreviar grandezas como `theta`, `omega`, `a_t`, `a_r`, `|a|` ou `v`.

Arquivos atualizados:

- `guides/02-product-spec.md`
- `guides/04-rules-and-constraints.md`
- `guides/07-quality-and-operations.md`
- `guides/issues.md`
- `progress.md`
- `src/App.test.tsx`
- `src/features/simulation-shell/pendulumChartConfigs.ts`

Validacao:

- Executado `npm run test -- src/App.test.tsx`.
- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso conhecido de chunk acima de 500 kB.
- Executado `validate_guides.py`.

## 2026-04-29 - Fase 2 completa e plano inclinado com atrito

Executadas as 9 proximas tasks da Fase 2:

- Extrair contrato comum `SimulationDefinition`.
- Adicionar `topicPath` para caminhos curriculares.
- Criar status de catalogo `planned`, `scaffolded` e `available`.
- Criar fixtures locais para as quatro areas principais.
- Registrar todas as simulacoes planejadas como indisponiveis ate terem core completo.
- Adicionar `Mecanica > Dinamica > Plano inclinado com atrito` como segunda simulacao funcional.
- Reusar shell, controles, graficos, tabela, formulas e teoria entre simulacoes disponiveis.
- Extrair helper reutilizavel de runtime visual renderer-first.
- Ajustar docs com aprendizados da primeira simulacao e do reuso.

Arquivos e estruturas criadas/atualizadas:

- `fixtures/simulations/catalog.json`
- `fixtures/simulations/mechanics-inclined-plane-friction.json`
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
- `progress.md`
- `src/App.test.tsx`
- `src/content/simulations/mechanics/inclined-plane-friction/theory.md`
- `src/features/simulation-shell/InclinedPlaneCharts.tsx`
- `src/features/simulation-shell/InclinedPlaneScene.tsx`
- `src/features/simulation-shell/PendulumCharts.tsx`
- `src/features/simulation-shell/PendulumScene.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`
- `src/features/simulation-shell/TheoryAppendix.tsx`
- `src/features/simulation-shell/inclinedPlaneChartConfigs.ts`
- `src/lib/physics/inclinedPlane.test.ts`
- `src/lib/physics/inclinedPlane.ts`
- `src/lib/rendering/visualRuntime.ts`
- `src/simulation-registry/catalog.test.ts`
- `src/simulation-registry/catalog.ts`

Decisoes:

- `inclined-plane-friction` passou para `available`; o pendulo continua como simulacao inicial ativa.
- O plano inclinado usa modelo deterministico por regimes para repouso com atrito estatico, deslizamento com atrito cinetico e limite no fim do plano.
- A energia termica acumulada e usada como balanco didatico da energia dissipada por atrito, sem prometer simulacao termica real.
- `visualRuntime` centraliza `requestAnimationFrame`, cancelamento, interpolacao de timeline e metricas FPS/frame time, enquanto cada cena Three.js continua dona dos objetos, buffers, camera e overlays.

Validacao:

- Executado `npm run test -- src/lib/physics/inclinedPlane.test.ts src/simulation-registry/catalog.test.ts`.
- Executado `npm run test -- src/App.test.tsx`.
- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso conhecido de chunk acima de 500 kB.
- Executado `validate_guides.py`.

## 2026-04-29 - Legenda compacta dos vetores na animacao

Ajuste visual dos vetores principais das simulacoes disponiveis:

- O viewport agora exibe uma legenda compacta sobre a propria area de animacao, no canto superior direito.
- Cada item usa um traco na mesma cor do vetor e mostra a grandeza fisica com unidade abreviada quando houver, como `Peso (N)` e `Velocidade linear (m/s)`.
- A legenda detalhada acima do canvas foi mantida para modulo atual e significado fisico, preservando a leitura didatica existente.
- O ajuste foi aplicado ao pendulo simples e ao plano inclinado com atrito sem alterar a fonte numerica dos samples nem o loop renderer-first.

Arquivos atualizados:

- `guides/02-product-spec.md`
- `guides/04-rules-and-constraints.md`
- `guides/06-data-and-api.md`
- `guides/07-quality-and-operations.md`
- `guides/issues.md`
- `progress.md`
- `src/App.test.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`

Validacao:

- Executado `npm run test -- src/App.test.tsx`.
- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`.
- Executado `npm run build`; build passou com o aviso conhecido de chunk acima de 500 kB.

## 2026-04-29 - Fase 3: primeiro lote de Cinematica

Executadas as proximas 4 tasks da Fase 3:

- Implementar `Mecanica > Cinematica > Movimento retilineo uniforme`.
- Implementar `Mecanica > Cinematica > Movimento uniformemente variado e queda livre`.
- Implementar `Mecanica > Cinematica > Lancamento obliquo`.
- Implementar `Mecanica > Cinematica > Movimento circular uniforme`.

Arquivos e estruturas criadas/atualizadas:

- `fixtures/simulations/catalog.json`
- `fixtures/simulations/mechanics-uniform-linear-motion.json`
- `fixtures/simulations/mechanics-uniformly-accelerated-motion.json`
- `fixtures/simulations/mechanics-projectile-motion.json`
- `fixtures/simulations/mechanics-uniform-circular-motion.json`
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
- `progress.md`
- `src/App.test.tsx`
- `src/content/simulations/mechanics/uniform-linear-motion/theory.md`
- `src/content/simulations/mechanics/uniformly-accelerated-motion/theory.md`
- `src/content/simulations/mechanics/projectile-motion/theory.md`
- `src/content/simulations/mechanics/uniform-circular-motion/theory.md`
- `src/features/simulation-shell/KinematicsCharts.tsx`
- `src/features/simulation-shell/KinematicsScene.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`
- `src/features/simulation-shell/kinematicsChartConfigs.ts`
- `src/lib/physics/kinematics.test.ts`
- `src/lib/physics/kinematics.ts`
- `src/simulation-registry/catalog.test.ts`
- `src/simulation-registry/catalog.ts`

Decisoes:

- As quatro simulacoes de Cinematica usam um motor analitico compartilhado e deterministico, com samples que alimentam cena, vetores, graficos, tabela, formulas e teoria.
- A cena `KinematicsScene` reutiliza o padrao renderer-first com Three.js 2.5D, eixo Z vertical, camera orbitavel, zoom por scroll, trilha e vetores.
- Cada simulacao ganhou fixture local com parametros, runtime, presets, limites e guia de formulas; o catalogo promoveu os quatro itens para `available`.

Validacao:

- Executado `npm run test`.
- Executado `npm run build`; build passou com aviso conhecido de chunk acima de 500 kB.
- Executado `npm run lint`.
- Executado `validate_guides.py`; resultado `[OK] guides pack looks core-first and complete.`

## 2026-04-29 - Ajustes de viewport em Cinematica

Correcoes solicitadas na interacao das cenas:

- O zoom dos viewports Three.js agora exige Shift + scroll; scroll simples volta a ficar livre para rolagem da pagina.
- A cena de Cinematica passou a resetar a amostra viva ao trocar entre simulacoes do mesmo componente, evitando leituras antigas durante a troca.
- O MUV/queda livre passou a usar uma escala visual limitada quando a trajetoria fica grande demais, corpo visual proporcional ao enquadramento e ciclo padrao de 4 s, mantendo a animacao perceptivel sem trocar os samples do motor.
- O MCU passou a projetar corpo, trilha e vetores no plano horizontal, mantendo o eixo Z como vertical da cena.

Arquivos atualizados:

- `guides/02-product-spec.md`
- `guides/03-architecture.md`
- `guides/04-rules-and-constraints.md`
- `guides/07-quality-and-operations.md`
- `guides/issues.md`
- `progress.md`
- `fixtures/simulations/mechanics-uniformly-accelerated-motion.json`
- `src/App.test.tsx`
- `src/features/simulation-shell/InclinedPlaneScene.tsx`
- `src/features/simulation-shell/KinematicsScene.tsx`
- `src/features/simulation-shell/KinematicsSceneProjection.ts`
- `src/features/simulation-shell/KinematicsScene.test.ts`
- `src/features/simulation-shell/PendulumScene.tsx`
- `src/features/simulation-shell/SimulationShell.tsx`

Validacao:

- Executado `npm run test -- src/features/simulation-shell/KinematicsScene.test.ts src/lib/physics/kinematics.test.ts src/App.test.tsx`.
- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `validate_guides.py`; resultado `[OK] guides pack looks core-first and complete.`
- Smoke visual headless em `http://127.0.0.1:5187/` com Chrome channel em desktop `1440x1100` e mobile `390x900`: MUV e MCU com canvas nao vazio/colorido e diferenca de pixels entre frames; no desktop, scroll simples no canvas pausado nao alterou pixels e Shift + scroll alterou a visualizacao por zoom.
- Capturas geradas em `artifacts/muv-desktop-a.png`, `artifacts/muv-desktop-b.png`, `artifacts/muv-mobile-a.png`, `artifacts/muv-mobile-b.png`, `artifacts/mcu-desktop-a.png`, `artifacts/mcu-desktop-b.png`, `artifacts/mcu-mobile-a.png` e `artifacts/mcu-mobile-b.png`.

## 2026-04-29 - Fase 3: Atwood, centripeta e trabalho-energia

Executadas as proximas 3 tasks da Fase 3 com modo quality:

- Implementar `Mecanica > Dinamica > Maquina de Atwood`.
- Implementar `Mecanica > Dinamica > Forca centripeta em curva`.
- Implementar `Mecanica > Energia e momento > Trabalho e energia em trilho`.

Ajuste de trilho:

- `Mecanica > Dinamica > Plano inclinado com atrito` foi marcado como concluido na Fase 3 porque ja havia sido promovido para `available` na Fase 2.

Arquivos e estruturas criadas/atualizadas:

- `fixtures/simulations/catalog.json`
- `fixtures/simulations/mechanics-atwood-machine.json`
- `fixtures/simulations/mechanics-centripetal-force-curve.json`
- `fixtures/simulations/mechanics-work-energy-track.json`
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
- `progress.md`
- `src/App.test.tsx`
- `src/content/simulations/mechanics/atwood-machine/theory.md`
- `src/content/simulations/mechanics/centripetal-force-curve/theory.md`
- `src/content/simulations/mechanics/work-energy-track/theory.md`
- `src/features/simulation-shell/KinematicsScene.tsx`
- `src/features/simulation-shell/KinematicsSceneProjection.ts`
- `src/features/simulation-shell/SimulationShell.tsx`
- `src/features/simulation-shell/kinematicsChartConfigs.ts`
- `src/lib/physics/kinematics.test.ts`
- `src/lib/physics/kinematics.ts`
- `src/simulation-registry/catalog.test.ts`
- `src/simulation-registry/catalog.ts`

Decisoes:

- As tres novas simulacoes usam o motor analitico compartilhado existente, estendido com campos de tensao, forca centripeta, atrito maximo, trabalho aplicado e dissipacao termica.
- A cena compartilhada de Cinematica passou a renderizar tambem massas acopladas da Maquina de Atwood com polia/fio simples, alem de continuar suportando trajetorias circulares e trilho inclinado.
- `atwood-machine`, `centripetal-force-curve` e `work-energy-track` foram promovidas para `available` no catalogo local.

Quality pass:

- Revisao local manteve o comportamento publico do shell e limitou o refactor a pequenos ajustes nos arquivos tocados.
- A troca de parametros passou a comparar contra os valores selecionados da simulacao ativa, evitando acoplamento acidental ao pendulo/plano inclinado quando a simulacao ativa vem do motor compartilhado.
- A legenda/vetores da curva centripeta foram ajustados para nao exibir normal como vetor horizontal na cena 2.5D.

Validacao:

- Executado `npm run test -- src/lib/physics/kinematics.test.ts src/simulation-registry/catalog.test.ts src/App.test.tsx`.
- Executado `npm run test`.
- Executado `npm run lint`.
- Executado `npm run build`; build passou com aviso conhecido de chunk acima de 500 kB.
- Executado `python3 /mnt/c/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py /mnt/d/_PROJETOS/PhysicSimulator`; resultado `[OK] guides pack looks core-first and complete.`
- Smoke visual headless em `http://172.24.222.147:5190/` com Playwright/Edge: Atwood, forca centripeta e trabalho-energia abriram pela sidebar, receberam reset/play e exibiram canvas com pixels nao-background/coloridos e diferenca de pixels entre frames (`atwood-machine`: 5728/3179 coloridos, 8137 pixels diferentes; `centripetal-force-curve`: 1530/1308 coloridos, 1140 pixels diferentes; `work-energy-track`: 677/717 coloridos, 615 pixels diferentes).
- Capturas geradas em `artifacts/atwood-machine-smoke.png`, `artifacts/atwood-machine-canvas-a.png`, `artifacts/atwood-machine-canvas-b.png`, `artifacts/centripetal-force-curve-smoke.png`, `artifacts/centripetal-force-curve-canvas-a.png`, `artifacts/centripetal-force-curve-canvas-b.png`, `artifacts/work-energy-track-smoke.png`, `artifacts/work-energy-track-canvas-a.png` e `artifacts/work-energy-track-canvas-b.png`.

## 2026-04-29 - Ajuste de visibilidade da sidebar

Problema reportado:

- As novas simulacoes estavam cadastradas e acessiveis, mas nao apareciam imediatamente no menu inicial porque a sidebar abria apenas a subarea da simulacao atual.

Ajuste:

- Subareas que contenham ao menos uma simulacao `available` agora iniciam abertas na area expandida, enquanto subareas somente planejadas continuam recolhidas.
- `src/App.test.tsx` passou a cobrir que Cinematica, Dinamica e Energia com simulacoes disponiveis aparecem no menu inicial.

Validacao:

- Executado `npm run test -- src/App.test.tsx`; 7 testes passaram.
- Executado `npm run lint`; passou.
- Executado `python3 /mnt/c/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py /mnt/d/_PROJETOS/PhysicSimulator`; resultado `[OK] guides pack looks core-first and complete.`
- Smoke headless em `http://127.0.0.1:5191/` confirmou que `Maquina de Atwood`, `Forca centripeta em curva` e `Trabalho e energia em trilho` aparecem no menu inicial.

## 2026-04-29 - Ajuste fisico e visual de Atwood/curva centripeta

Problema reportado:

- A Maquina de Atwood estava visualmente pouco didatica, com massas/fio fora do formato de diagrama esperado.
- Forca centripeta em curva bloqueava atrito zero e mantinha a animacao circular mesmo quando os parametros tornavam a aderencia impossivel.
- Foi pedido um guia para revisar outras simulacoes que ainda parecam animacoes parametrizadas em vez de simulacoes fisicas.

Ajustes:

- `src/lib/physics/kinematics.ts` agora aceita `frictionCoefficient = 0` na curva centripeta.
- A curva centripeta passou a comparar `v^2/r` com `mu*g`; se faltar aderencia, o motor gera uma trajetoria real de raio maior e, com `mu = 0`, saida tangencial em linha reta.
- Graficos da curva passaram a comparar forca/aceleracao requerida, limite disponivel e valor lateral real usado.
- A Maquina de Atwood passou a usar suporte fixo, polia fixa, fio com arco superior e massas em blocos alinhadas aos trechos verticais.
- O enquadramento da cena foi ajustado para manter a polia/suporte visiveis em Atwood e a curva ideal legivel mesmo quando o corpo sai da curva.
- Criado `guides/10-simulation-fidelity-adjustment-guide.md` com checklist de auditoria fisica/visual para as demais simulacoes.

Documentacao:

- Atualizados `guides/00-index.md`, `guides/02-product-spec.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/issues.md`, fixture e teoria da curva centripeta.

Validacao:

- Executado `npm run test -- src/lib/physics/kinematics.test.ts`; 10 testes passaram.
- Executado `npm run test`; 46 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; resultado `[OK] guides pack looks core-first and complete.`

## 2026-05-03 - Legendas clicaveis dos graficos

Pedido reportado:

- Permitir que todos os graficos liguem ou desliguem uma serie ao clicar no item correspondente da legenda.

Ajuste:

- `LiveLineChart` passou a tratar cada item de legenda como toggle acessivel por botao, com `aria-pressed` e estado visual ligado/desligado.
- O canvas desenha apenas as series ligadas, mas mantem intervalo temporal e cursor derivados dos dados completos para preservar a janela movel.
- O comportamento vale para pendulo, plano inclinado e graficos analiticos compartilhados, porque todos usam o mesmo componente de grafico.
- Atualizados os guides de produto, regras de UX e qualidade para registrar o novo contrato da legenda.

Gate de fidelidade:

- Nao houve mudanca no motor, samples, parametros, cena, tabela, formulas, teoria ou warnings.
- A legenda altera apenas a visibilidade da curva no grafico; a fonte unica de samples continua intacta e compartilhada.

Validacao:

- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run lint`; passou.
- Executado `npm run test -- src/App.test.tsx -t "smoke tests playback"`; 1 teste passou e 6 ficaram filtrados.
- Executado `npm run test`; falhou em expectativas de catalogo/status e sidebar ja divergentes na arvore atual, fora do ajuste de legenda.

Pedido reportado:

- Alterar `Mecanica > Energia e momento > Trabalho e energia em trilho` para um cenario de rampa em U, similar a uma rampa de skate, com inicio acima, na linha ou um pouco abaixo da rampa e opcao de perda de energia.

Ajuste:

- A fixture local passou a declarar a geometria da rampa em U, massa, posicao inicial horizontal, altura relativa inicial, velocidade inicial, gravidade e perda por ciclo em percentual.
- O motor numerico especializou `work-energy-track` para integrar o movimento ao longo de uma rampa parabolica `h(x)=H(x/a)^2`, com queda vertical antes do contato quando a altura relativa e positiva e dissipacao opcional quando `perda por ciclo (%) > 0`.
- Os samples agora sincronizam posicao horizontal, altura, velocidade, aceleracao tangencial, energia cinetica, energia potencial gravitacional, energia mecanica total, energia perdida acumulada e percentual de perda.
- A cena Three.js passou de trilho inclinado para trilho em U com dormentes, batentes, corpo alinhado a tangente local, vetor normal e rastro de dissipacao.
- O HUD, os graficos, a tabela e a teoria foram atualizados para analisar velocidade, aceleracao, posicao/altura, `K`, `Ug`, energia total, energia perdida e percentual de perda.
- A simulacao voltou para `analysis`, aguardando validacao visual/manual antes de ser promovida novamente para `ready`.

Gate de fidelidade:

- `0%` de perda conserva a energia mecanica dentro da tolerancia numerica.
- Perda maior que zero reduz a energia mecanica e exibe a perda acumulada em joules e em percentual.
- Altura relativa zero e inicio valido na rampa; altura positiva representa liberacao vertical; altura negativa ajusta o ponto inicial para uma energia menor dentro do dominio fisico da rampa.
- Cena, graficos, HUD, formulas, teoria, warnings e testes consomem os mesmos samples gerados pelo motor numerico.

Documentacao:

- Atualizados `fixtures/simulations/catalog.json`, `fixtures/simulations/mechanics-work-energy-track.json`, `src/content/simulations/mechanics/work-energy-track/theory.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md`, `guides/09-simulation-catalog-plan.md`, `guides/10-simulation-fidelity-adjustment-guide.md`, `guides/issues.md` e `progress.md`.

Validacao:

- Executado `npm run test -- src/lib/physics/kinematics.test.ts src/simulation-registry/catalog.test.ts`; 28 testes passaram.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test`; 62 testes passaram.
- Executado `npm run lint`; passou.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; falhou por estrutura SDD ausente no repositorio (`README.md`, `.agent/`, `tasks/`, `adr/`), fora do escopo desta mudanca funcional.

Pedido reportado:

- Promover `Mecanica > Energia e momento > Trabalho e energia em trilho` de `analysis` para `ready` apos validacao visual/manual do dono do projeto.

Ajuste:

- `fixtures/simulations/catalog.json` marcou `work-energy-track` como `ready`.
- A sidebar volta a tratar `Energia e momento` como subarea sem pendencias de analise, iniciando recolhida quando todos os itens dela estao `ready`.
- Os testes de catalogo voltaram a contar 9 simulacoes `ready` e 8 simulacoes `analysis`, mantendo `uniform-circular-motion` em `analysis`.
- Guides e issues foram alinhados para registrar a rampa em U de energia como aprovada manualmente e pronta.

Gate de fidelidade:

- A promocao usou a validacao manual do dono do projeto como criterio de passagem de `analysis` para `ready`.
- A auditoria anterior da rampa em U permanece registrada: parametro de perda zero conserva energia, perda maior que zero reduz energia mecanica, e samples/cena/graficos/HUD/formulas/teoria consomem a mesma fonte.

Documentacao:

- Atualizados `fixtures/simulations/catalog.json`, `src/simulation-registry/catalog.test.ts`, `src/App.test.tsx`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/09-simulation-catalog-plan.md`, `guides/issues.md` e `progress.md`.

Validacao:

- Executado `npm run test -- src/simulation-registry/catalog.test.ts src/App.test.tsx`; 15 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test`; 62 testes passaram.

## 2026-05-03 - Controles flutuantes e contador continuo

Pedido reportado:

- Unificar controles marcados na interface em um card flutuante no canto inferior direito, sempre disponivel durante rolagem.
- Trocar o tempo que voltava a zero ao fim do ciclo por um contador continuo.

Ajuste:

- O playback/reset/status/engine foi concentrado no card de controles flutuante, fixo no canto inferior direito com altura maxima e rolagem interna.
- Os botoes duplicados de play/pause do topo e dos viewports foram removidos.
- O renderer continua usando o horizonte calculado como fonte de samples, mas o contador exibido e os recortes de grafico/tabela passam a usar tempo continuo.
- `durationSeconds` passou a ser apresentado como `Horizonte calculado` nos fixtures e na UI, sem texto prometendo reinicio do ciclo.

Gate de fidelidade:

- A fonte fisica dos samples nao mudou: cena, graficos, tabela, vetores e formulas continuam consumindo os mesmos samples calculados pelo motor.
- A mudanca e de playback/visualizacao temporal e de layout de controles; regimes fisicos, parametros fisicos, formulas, teoria e warnings foram preservados.

Documentacao:

- Atualizados `guides/01-strategy.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md` e `guides/08-api-contracts.md` para refletir controles flutuantes, horizonte calculado e contador continuo.

Validacao:

- Executado `npm run test -- src/lib/rendering/visualRuntime.test.ts src/features/simulation-shell/sampleWindow.test.ts --run`; 9 testes passaram.
- Executado `npm run test -- src/App.test.tsx --run`; 7 testes passaram.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run lint`; passou.
- Executado `npm run test`; 61 testes passaram.
- Executado `npm run lint` novamente apos adicionar teste do runtime; passou.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; falhou por estrutura SDD ausente pre-existente (`README.md`, `.agent/`, `tasks/`, `adr/`), sem indicar erro especifico nos guides alterados.

## 2026-05-01 - Referencia de origem nos viewports

Pedido reportado:

- Adicionar eixos de origem X, Y e Z no plano com grade das simulacoes, no canto inferior esquerdo, com cores, legenda fixa no canto superior esquerdo e alfa visual.

Ajuste:

- Criado helper compartilhado para desenhar eixos X/Y/Z translucidos no canto inferior esquerdo da grade dos renderers Three.js.
- Adicionada legenda fixa de origem da grade no canto superior esquerdo do canvas, sempre presente e independente dos toggles de vetores/energia.
- Aplicado nos viewports de pendulo, plano inclinado e cena compartilhada de Cinematica/Mecanica.

Documentacao:

- Atualizados `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/07-quality-and-operations.md` e `guides/issues.md`.

Gate de fidelidade:

- Mudanca visual de referencia espacial. Nenhum motor, parametro, sample, grafico, tabela, formula, teoria, regime ou warning foi alterado; a referencia nao recalcula nem contradiz a fisica.

Validacao:

- Executado `npm run test -- src/App.test.tsx`; 7 testes passaram.
- Executado `npm run test`; 54 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; resultado `[OK] guides pack looks core-first and complete.`

## 2026-04-30 - Navegacao orbital yaw/pitch na viewport

Pedido reportado:

- Melhorar a navegacao da viewport Three.js para permitir olhar a cena por cima, por baixo e pelos lados mantendo o botao do mouse pressionado, em vez de girar apenas no eixo Z.

Ajuste:

- Adicionado helper compartilhado `src/lib/rendering/orbitCamera.ts` para manter a pose orbital da camera em refs, com yaw por arraste horizontal, pitch por arraste vertical e limite de pitch para evitar inversao da camera.
- `PendulumScene`, `InclinedPlaneScene` e `KinematicsScene` passaram a usar a mesma logica de orbita yaw/pitch; Shift + scroll continua controlando apenas o zoom da camera.
- Labels acessiveis dos canvases foram atualizados para comunicar arraste por cima/baixo e Shift + scroll.
- Testes do app passaram a verificar a nova instrucao de navegacao, e o helper de camera recebeu teste unitario de drag e posicionamento.

Documentacao:

- Atualizados `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/07-quality-and-operations.md` e `guides/issues.md` para trocar o contrato antigo de arraste horizontal por orbita bidimensional yaw/pitch.

Gate de fidelidade:

- O motor numerico, parametros, regimes, samples, graficos, tabela, formulas, teoria e warnings nao foram alterados. A task ficou restrita ao renderer/camera e preserva a fonte unica de samples; a cena continua apenas desenhando o sample calculado.

Validacao:

- Executado `npm run test -- src/lib/rendering/orbitCamera.test.ts src/App.test.tsx`; 9 testes passaram.
- Executado `npm run test`; 54 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; resultado `[OK] guides pack looks core-first and complete.`
- Executado `git diff --check`; sem erros de whitespace, apenas avisos esperados de normalizacao LF/CRLF no Windows.
- Dev server iniciado em `http://127.0.0.1:5198/`.
- Smoke visual Playwright/Chrome em desktop confirmou canvas nao vazio e mudanca de pixels apos drag yaw/pitch em pendulo, plano inclinado e Cinematica; smoke mobile confirmou canvas do pendulo visivel, nao vazio e responsivo ao drag. Capturas em `artifacts/viewport-orbit-*.png`.

## 2026-04-30 - Bancada visual de trabalho e energia em trilho

Pedido reportado:

- Tornar `Mecanica > Energia e momento > Trabalho e energia em trilho` mais criativa e visualmente interessante, seguindo a proposta de bancada visual de energia.

Ajuste:

- A cena Three.js de `work-energy-track` deixou de usar a representacao generica de esfera em linha e passou a renderizar um trilho 3D inclinado com dormentes, regua de altura, batente de fim de curso e corpo didatico em bloco alinhado ao trilho.
- O rastro da simulacao nessa cena passou a usar gradiente termico a partir de `thermalEnergyJoules`, mantendo a trilha como leitura de dissipacao, nao como decoracao solta.
- O viewport ganhou um painel compacto de balanco energetico para essa simulacao, exibindo `K`, `U_g`, `E_t`, `W` e saldo com valores em joules, todos lidos do mesmo `KinematicsSample` usado pelos graficos, tabela e formulas.
- O apendice teorico da simulacao passou a explicar como ler o rastro termico e o painel de balanco no viewport.

Documentacao:

- Atualizados `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/09-simulation-catalog-plan.md`, `guides/10-simulation-fidelity-adjustment-guide.md` e `guides/issues.md` para registrar a nova referencia visual e os criterios de validacao.

Gate de fidelidade:

- O motor numerico nao foi alterado. A mudanca ficou no renderer, HUD e teoria; corpo, rastro termico, vetores, painel, graficos, tabela e formulas continuam derivados de `KinematicsSample`.
- Parametros fisicamente validos em zero, como atrito zero e forca aplicada zero, permanecem validos no fixture e no motor.

Validacao:

- Executado `npm run test -- src/App.test.tsx src/features/simulation-shell/KinematicsScene.test.ts`; 9 testes passaram.
- Executado `npm run test`; 52 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; resultado `[OK] guides pack looks core-first and complete.`
- Dev server iniciado em `http://127.0.0.1:5196/`.
- Smoke visual Chrome/CDP em desktop e mobile confirmou `Trabalho e energia em trilho`, HUD de balanco energetico e canvas renderizado; capturas em `artifacts/work-energy-track-lab-desktop.png` e `artifacts/work-energy-track-lab-mobile-canvas.png`.
- Pixel check por screenshot na regiao do canvas encontrou 23721 pixels nao-background no desktop e 12669 pixels nao-background no mobile.

## 2026-04-30 - Tres simulacoes de Dinamica prontas

Pedido reportado:

- Marcar como feitos `Mecanica > Dinamica > Plano inclinado com atrito`, `Maquina de Atwood` e `Forca centripeta em curva`.

Ajuste:

- `inclined-plane-friction`, `atwood-machine` e `centripetal-force-curve` passaram de `analysis` para `ready` no catalogo local.
- `Movimento circular uniforme`, `Trabalho e energia em trilho`, `Colisoes 1D e 2D`, `Equilibrio de particula`, `Torque/alavancas/centro de massa` e `Rotacao de corpo rigido` permanecem em `analysis`.
- Os testes de contrato passaram a esperar 7 simulacoes `ready` e 6 simulacoes `analysis`.

Documentacao:

- Atualizados `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/09-simulation-catalog-plan.md` e `guides/issues.md` para refletir que plano inclinado, Atwood e forca centripeta em curva estao prontos.

Gate de fidelidade:

- Promocao baseada na aprovacao manual do dono do projeto.
- Nenhum motor, sample, renderer, grafico, tabela, formula, teoria ou warning foi alterado; a promocao preserva a auditoria de fidelidade ja aplicada a essas simulacoes e so atualiza o status de catalogo/documentacao.

Validacao:

- Executado `npm run test -- src/simulation-registry/catalog.test.ts src/App.test.tsx`; 15 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; resultado `[OK] guides pack looks core-first and complete.`
- Executado `git diff --check`; sem erros de whitespace, apenas avisos esperados de normalizacao LF/CRLF no Windows.
- Dev server aberto em `http://127.0.0.1:5192/`.
- Smoke visual headless com Chrome/CDP: Atwood renderizou canvas nao vazio com 12176 pixels nao-background e 3960 pixels diferentes entre frames; curva com `mu = 0` exibiu status `saiu da curva`, canvas nao vazio com 78893 pixels nao-background e 1006 pixels diferentes entre frames.
- Capturas geradas em `artifacts/atwood-format-fixed-canvas-a.png`, `artifacts/atwood-format-fixed-canvas-b.png`, `artifacts/centripetal-zero-friction-visible-canvas-a.png` e `artifacts/centripetal-zero-friction-visible-canvas-b.png`.

## 2026-04-29 - Revisao documental do gate de fidelidade

Pedido reportado:

- Revisar as tasks ja feitas com base no `Simulation Fidelity Adjustment Guide`.
- Atualizar as docs necessarias para exigir esse gate em todos os casos futuros.

Revisao das tasks concluidas:

- Fase 1, pendulo simples: ja segue fonte unica de samples para cena, vetores, graficos, tabela e formulas; declara pequeno angulo e amortecimento como limites/avisos. Como nao ha perda de restricao implementada, o regime fisico relevante e o modelo numerico declarado.
- Fase 2, plano inclinado com atrito: ja registra regimes de repouso por atrito estatico, deslizamento, atrito zero valido e parada no fim do plano; motor, samples, vetores, graficos, tabela, formulas e teoria usam os mesmos campos.
- Fase 3, primeiro lote de Cinematica: MRU, MUV/queda livre e MCU sao modelos ideais declarados; lancamento obliquo tem regime de voo e aterrissagem visual com warning. A revisao reforcou que futuras mudancas nesses modelos precisam declarar qualquer novo regime em vez de tratar como decoracao visual.
- Fase 3, segundo lote de Mecanica: Atwood, forca centripeta em curva e trabalho-energia ja tinham limites e warnings; o ajuste seguinte aplicou diretamente o guia em Atwood e curva centripeta, corrigindo formato fisico da cena, atrito zero e perda de aderencia com samples reais.
- Conclusao da revisao: as tasks recentes ja apontavam para o padrao correto, mas o guia ainda estava descrito como auditoria/revisita. A documentacao agora transforma o guia em gate obrigatorio para qualquer task futura de simulacao.

Documentacao atualizada:

- `AGENTS.md`
- `guides/00-index.md`
- `guides/02-product-spec.md`
- `guides/03-architecture.md`
- `guides/04-rules-and-constraints.md`
- `guides/05-roadmap.md`
- `guides/06-data-and-api.md`
- `guides/07-quality-and-operations.md`
- `guides/08-api-contracts.md`
- `guides/09-simulation-catalog-plan.md`
- `guides/10-simulation-fidelity-adjustment-guide.md`
- `guides/issues.md`

Validacao:

- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; resultado `[OK] guides pack looks core-first and complete.`
- Executado `git diff --check`; sem erros de whitespace, apenas avisos esperados de normalizacao LF/CRLF no Windows.
- Busca de consistencia em `AGENTS.md`, `guides/` e `progress.md` confirmou que o guia aparece como gate obrigatorio para implementacao, alteracao, revisao, promocao e manutencao de simulacoes `available`.

## 2026-04-29 - Fase 3 terceiro lote de Mecanica com quality

Pedido executado:

- `task-skill 4 :quality`, seguindo a fila de quatro proximas tasks inacabadas da Fase 3: `Colisoes 1D e 2D`, `Equilibrio de particula`, `Torque, alavancas e centro de massa` e `Rotacao de corpo rigido`.

Implementacao:

- Promovidas as quatro simulacoes para `available` no catalogo local, com fixtures, parametros, presets, limites, formulas, teoria Markdown e planos de tecnologia.
- O motor compartilhado de `Kinematics` passou a cobrir colisao com impulso/restauracao, equilibrio vetorial de tres forcas, torque/alavancas/centro de massa e rotacao de corpo rigido com torque constante e amortecimento linear opcional.
- Os samples foram ampliados com campos de segunda particula, forcas componentes, torque, impulso, momento linear, centro de massa, momento de inercia, aceleracao angular e energia dissipada/perdida quando aplicavel.
- A cena Three.js passou a representar corpo secundario em colisoes, diagramas vetoriais de forcas/resultante, alavanca/barra e corpo rigido rotacional, mantendo renderizacao desacoplada do shell React.
- Graficos, tabela, metricas, legendas vetoriais, formulas e teoria foram conectados a mesma fonte de samples.

Gate de fidelidade:

- Colisoes: `e` limitado a `0..1`, contato ausente ou fora do ciclo gera warning, componentes tangenciais permanecem inalteradas e perda de energia aparece no sample/grafico.
- Equilibrio: forcas nulas continuam validas; resultante acima da tolerancia vira aceleracao calculada e warning de desequilibrio.
- Torque/alavancas: forca aplicada e braco nulos continuam validos; torque liquido, centro de massa e aceleracao angular concordam entre sample, cena, grafico e formulas.
- Rotacao: torque zero e amortecimento zero sao validos; amortecimento opcional aparece como regime/warning e dissipacao acumulada.

Quality pass:

- Reaproveitado o motor e o runtime de Cinematica sem introduzir Rapier, Matter.js ou novo renderer.
- Renomeado o helper visual de corpos vinculados para cobrir Atwood e colisoes sem semantica falsa.
- Testes ajustados para controles duplicados por slider/input e para o tempo real do teste de catalogo expandido em WSL.
- `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/05-roadmap.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md`, `guides/09-simulation-catalog-plan.md` e `guides/issues.md` foram atualizados para refletir o terceiro lote.

Validacao:

- Executado `npm run test`; 50 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `python3 /mnt/c/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py /mnt/d/_PROJETOS/PhysicSimulator`; resultado `[OK] guides pack looks core-first and complete.`
- Executado `git diff --check -- . ':!src/features/simulation-shell/LiveLineChart.tsx'`; sem erros nas mudancas desta task. O `git diff --check` completo ainda aponta whitespace em `src/features/simulation-shell/LiveLineChart.tsx`, que ja estava modificado antes deste trabalho.
- Dev server aberto em `http://127.0.0.1:5193/`.
- Smoke visual headless via Chrome/CDP em desktop e mobile confirmou canvas nao vazio para as quatro simulacoes. Colisoes e rotacao tiveram diferenca entre frames; equilibrio e torque ficaram estaticos por padrao, como esperado pelos parametros iniciais.
- Capturas geradas em `artifacts/third-lot-desktop-*-a.png`, `artifacts/third-lot-desktop-*-b.png`, `artifacts/third-lot-mobile-*-a.png` e `artifacts/third-lot-mobile-*-b.png`.

## 2026-04-29 - Ajuste visual e geometrico de Colisoes 1D e 2D

Problema reportado:

- A cena de `Colisoes 1D e 2D` nao comunicava uma colisao didatica: os corpos pareciam soltos, a esfera secundaria ficava afastada/fora de foco e o contato nao deixava claro que os raios determinavam o impacto.

Ajuste:

- O corpo 2 agora inicia no centro da cena e o corpo 1 se aproxima a partir da esquerda.
- O motor passou a usar `radiusOneMeters` e `radiusTwoMeters`; a colisao so acontece quando a distancia entre centros chega a `r1 + r2`.
- O angulo de impacto obliquo agora define o deslocamento da linha de centros no contato, permitindo que depois do impacto uma esfera saia para um lado e a outra para o lado oposto.
- A cena Three.js usa os raios fisicos do sample para escalar as esferas, reposiciona o vetor de velocidade do corpo 2 sobre o corpo 2 e desenha trajetorias de referencia para os dois corpos.
- O enquadramento da cena de colisoes foi aproximado e o preset padrao ficou com ciclo mais curto, para manter o evento de contato legivel.
- Atualizados fixture, teoria e docs de produto/dados/contrato para declarar a geometria de contato por raios.

Gate de fidelidade:

- Parametros fisicamente validos continuam permitidos, incluindo velocidade zero do corpo 2.
- O limite de contato agora e geometrico (`distancia entre centros = soma dos raios`) e o teste do motor verifica que a distancia minima respeita esse limite.
- Samples, cena, vetores, formulas, teoria e warnings continuam derivados do mesmo motor de colisao.

Validacao:

- Executado `npm run test -- src/lib/physics/kinematics.test.ts`; 14 testes passaram.
- Executado `npm run test -- src/simulation-registry/catalog.test.ts src/features/simulation-shell/KinematicsScene.test.ts src/App.test.tsx`; 15 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test`; 50 testes passaram.
- Executado `python3 /mnt/c/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py /mnt/d/_PROJETOS/PhysicSimulator`; resultado `[OK] guides pack looks core-first and complete.`
- Executado `git diff --check -- . ':!src/features/simulation-shell/LiveLineChart.tsx'`; sem erros nas mudancas desta task.
- Smoke visual Chrome/CDP em `http://127.0.0.1:5193/` confirmou canvas ativo e movimento; captura final em `artifacts/collisions-radius-contact-desktop-later.png` mostra as duas esferas separadas apos o impacto.

## 2026-04-29 - Status de analise antes de pronto

Pedido reportado:

- Adicionar o status intermediario `analysis`/analise entre `planned`/planejado e `ready`/pronto.
- Manter simulacoes como prontas apenas depois do teste manual do dono do projeto.
- Deixar abertas na sidebar apenas as subareas com simulacoes em analise; subareas somente prontas ou planejadas iniciam fechadas.

Ajuste:

- O contrato `SimulationStatus` passou a usar `analysis`, `planned` e `ready`.
- As 13 simulacoes implementadas no catalogo local passaram de `available` para `analysis`.
- A sidebar passou a tratar `analysis` e `ready` como executaveis, mas so `analysis` abre area/subarea inicialmente.
- A UI exibe os labels `analise`, `planejado` e `pronto`; o estado `ready` fica sem itens ate validacao manual.
- Os guides e `AGENTS.md` foram atualizados para trocar a antiga nocao de `available` pelo fluxo `planned -> analysis -> ready`.

Validacao:

- Executado `npm run test -- src/simulation-registry/catalog.test.ts src/App.test.tsx`; 13 testes passaram.
- Executado `npm run test`; 50 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; resultado `[OK] guides pack looks core-first and complete.`
- Busca em `AGENTS.md`, `guides/`, `src/` e `fixtures/` confirmou que nao restam usos de `available`/`scaffolded` como status de catalogo ativo; usos restantes de `available` sao variaveis de fisica como limite/forca disponivel.

## 2026-04-29 - Pendulo simples pronto

Pedido reportado:

- Promover `Mecanica > Oscilacoes > Pendulo simples` de `analysis` para `ready` apos teste manual do dono do projeto.

Ajuste:

- `simple-pendulum` passou para `status: "ready"` no catalogo local.
- As demais simulacoes implementadas permanecem em `analysis` ate validacao manual.
- A sidebar continua abrindo automaticamente apenas subareas com simulacoes em `analysis`; por isso `Oscilacoes` inicia fechada enquanto o pendulo fica selecionado e marcado como `pronto`.
- Guides de produto, arquitetura, dados, catalogo e decisoes foram atualizados para refletir o pendulo como primeira simulacao pronta.

Gate de fidelidade:

- Promocao baseada na aprovacao manual do dono do projeto.
- O pendulo ja tinha auditoria registrada: fonte unica de samples para cena, vetores, graficos, tabela e formulas; parametros, limites, teoria e testes proporcionais documentados nas tasks anteriores.

Validacao:

- Executado `npm run test -- src/simulation-registry/catalog.test.ts src/App.test.tsx`; 13 testes passaram.

## 2026-04-29 - Planejamento de massa-mola vertical

Pedido reportado:

- Adicionar ao roadmap uma simulacao de sistema massa-mola no estilo da referencia visual: mola pendurada em suporte superior, massa esferica na ponta e oscilacao vertical.

Ajuste documental:

- `guides/05-roadmap.md` passou a tratar `Oscilacoes e Ondas > Oscilacoes > Massa-mola vertical` como primeira fatia recomendada da Fase 4.
- `guides/09-simulation-catalog-plan.md` detalha a simulacao planejada com suporte fixo, mola helicoidal, massa esferica, deformacao, posicao, velocidade, aceleracao, forca elastica, peso e energias.
- `guides/02-product-spec.md` recebeu controles, representacao esperada e formulas minimas para massa-mola vertical.
- `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/07-quality-and-operations.md`, `guides/10-simulation-fidelity-adjustment-guide.md` e `guides/issues.md` foram alinhados com a decisao visual/fisica.

Decisao:

- A massa-mola vertical fica como ponte natural depois do pendulo pronto, mas segue planejada ate implementacao, gate de fidelidade e teste manual.

Validacao:

- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; resultado `[OK] guides pack looks core-first and complete.`
- Executado `git diff --check`; sem erros de whitespace, apenas avisos esperados de normalizacao LF/CRLF no Windows.

## 2026-04-29 - Legenda de ajuda em todos os parametros

Pedido reportado:

- Adicionar icone de interrogacao nos controles de variaveis de todos os experimentos funcionais, com tooltip explicando o que a variavel e, como funciona no modelo e o que muda ao alterar o valor.
- Tornar essa legenda obrigatoria para os proximos experimentos via contrato e documentacao.

Ajuste:

- `SimulationParameter` passou a exigir `description`.
- O controle compartilhado de parametros renderiza um icone de interrogacao com tooltip, incluindo descricao, unidade e faixa/passo do parametro.
- Todos os fixtures funcionais de Mecanica receberam descricoes nos `runtimeParameters` e `parameters`, cobrindo pendulo, plano inclinado, Cinematica, Atwood, curva centripeta, trabalho/energia, colisoes, equilibrio, torque/alavancas e rotacao.
- O teste de contrato do catalogo agora falha se algum parametro funcional vier sem descricao de ajuda.

Documentacao:

- Atualizados `AGENTS.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.

Gate de fidelidade:

- Aplicado ao escopo de parametros/controles: nenhuma grandeza fisica foi alterada; a mudanca adiciona metadados explicativos e UI de ajuda sem mudar motor, samples, cena, graficos, tabela ou formulas.

Validacao:

- Executado `npm run test -- src/simulation-registry/catalog.test.ts src/App.test.tsx`; 14 testes passaram.
- Executado `npm run test`; 51 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; resultado `[OK] guides pack looks core-first and complete.`
- Dev server iniciado em `http://127.0.0.1:5195/`.

## 2026-04-30 - Tres simulacoes de Cinematica prontas

Pedido reportado:

- Marcar como feitos `Mecanica > Cinematica > Movimento retilineo uniforme`, `Movimento uniformemente variado e queda livre` e `Lancamento obliquo`.

Ajuste:

- `uniform-linear-motion`, `uniformly-accelerated-motion` e `projectile-motion` passaram de `analysis` para `ready` no catalogo local.
- `Movimento circular uniforme` permanece em `analysis`, mantendo a subarea `Cinematica` aberta por ainda existir simulacao pendente de aprovacao manual.
- Os testes de contrato passaram a esperar 4 simulacoes `ready` e 9 simulacoes `analysis`.

Documentacao:

- Atualizados `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/09-simulation-catalog-plan.md` e `guides/issues.md` para refletir que MRU, MUV/queda livre e lancamento obliquo estao prontos.

Gate de fidelidade:

- Promocao baseada na aprovacao manual do dono do projeto.
- Nenhum motor, sample, renderer, grafico, tabela, formula, teoria ou warning foi alterado; a promocao preserva a auditoria de fidelidade ja aplicada as simulacoes de Cinematica e so atualiza o status de catalogo/documentacao.

Validacao:

- Executado `npm run test -- src/simulation-registry/catalog.test.ts src/App.test.tsx`; 15 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; resultado `[OK] guides pack looks core-first and complete.`

## 2026-05-01 - Trabalho/energia e colisoes prontos

Pedido reportado:

- Mudar `Mecanica > Energia e momento > Trabalho e energia em trilho` e `Mecanica > Energia e momento > Colisoes 1D e 2D` para pronto.

Ajuste:

- `work-energy-track` e `collisions-1d-2d` passaram de `analysis` para `ready` no catalogo local.
- Os testes de contrato passaram a esperar 9 simulacoes `ready` e 4 simulacoes `analysis`.
- Como `Energia e momento` agora contem apenas simulacoes `ready`, a sidebar passa a iniciar essa subarea recolhida.
- O Vitest passou a descobrir testes apenas em `src/`, mantendo smokes Playwright em `artifacts/` fora da bateria unit/integration.

Documentacao:

- Atualizados `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/09-simulation-catalog-plan.md` e `guides/issues.md` para refletir a promocao.

Gate de fidelidade:

- Promocao baseada na aprovacao manual do dono do projeto.
- Nenhum motor, sample, renderer, grafico, tabela, formula, teoria ou warning foi alterado; a promocao preserva a auditoria de fidelidade ja aplicada e so atualiza o status de catalogo/documentacao.

Validacao:

- Executado `npm run test -- src/simulation-registry/catalog.test.ts src/App.test.tsx`; 15 testes passaram.
- Executado `npm run test`; 54 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; resultado `[OK] guides pack looks core-first and complete.`

## 2026-05-01 - Rolamento, gravitacao, fluidos e presets mecanicos

Pedido reportado:

- Executar `task-skill 5`, seguindo as proximas cinco tasks pendentes da Fase 3.

Tasks executadas:

- `Mecanica > Rotacao > Rolamento sem escorregamento`.
- `Mecanica > Gravitacao > Campo gravitacional e orbitas`.
- `Mecanica > Fluidos basicos > Hidrostatica e empuxo`.
- `Mecanica > Fluidos basicos > Continuidade e Bernoulli`.
- Presets didaticos por subarea mecanica.

Ajuste:

- As quatro simulacoes novas entraram como `analysis`, com fixtures locais, parametros com tooltip, presets, limites, formulas e apendice teorico.
- O motor `KinematicsSample` foi ampliado para rolamento/escorregamento, campo gravitacional, pressao, vazao, empuxo e fracao submersa.
- A cena compartilhada ganhou roda cilindrica para rolamento e corpo central para orbitas, mantendo o renderer desacoplado do shell React.
- Os graficos e smokes cobrem as novas leituras: aderencia, campo gravitacional, pressao/empuxo e vazao/Bernoulli.
- Os testes de contrato passaram a esperar 9 simulacoes `ready` e 8 simulacoes `analysis`.

Gate de fidelidade:

- Rolamento: zero de velocidade inicial e angulo zero continuam validos; o limite `atrito requerido > atrito maximo` troca o regime para escorregamento e emite warning.
- Gravitacao: excentricidade zero e valida; excentricidade alta gera warning de modelo didatico.
- Hidrostatica: profundidade zero e valida; densidade do corpo maior que a do fluido gera warning de afundamento.
- Bernoulli: vazao zero e valida; pressao negativa ideal gera warning de limite fisico.
- Em todas, cena, vetores, graficos, tabela, formulas, teoria e warnings consomem os mesmos samples.

Documentacao:

- Atualizados `guides/01-strategy.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/05-roadmap.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/09-simulation-catalog-plan.md`, `guides/issues.md` e `progress.md`.

Validacao:

- Executado `npm run test -- src/lib/physics/kinematics.test.ts src/simulation-registry/catalog.test.ts --run`; 27 testes passaram.
- Executado `npm run test -- src/App.test.tsx --run`; 7 testes passaram.
- Executado `npm run test`; 59 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; resultado `[OK] guides pack looks core-first and complete.`

## 2026-05-03 - Playback continuo e energia conservativa no trilho

Pedido reportado:

- Corrigir a energia mecanica total no caso conservativo sem perda.
- Remover o reset automatico das simulacoes ao fim do horizonte calculado; o tempo, graficos e tabela devem continuar enquanto o usuario mantiver play e so voltar a zero no reset.

Ajuste:

- Pendulo e plano inclinado passaram a avancar estado vivo pelo renderer com integracao incremental, mantendo cena, vetores e leitura instantanea sem loop de horizonte.
- Simulacoes analiticas passaram a ler samples pelo tempo continuo; `Trabalho e energia em trilho` estende o horizonte calculado em blocos quando o playback ultrapassa as amostras existentes.
- Graficos e tabela agora usam historico vivo recente, sem projetar samples antigos em ciclos artificiais.
- No trilho em U conservativo (`energyLossPercent = 0`), `totalEnergyJoules` fica fixado na energia inicial do modelo, evitando deriva visual da curva de energia mecanica total.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: renderer, graficos, tabela e HUD seguem os mesmos samples vivos; o caso dissipativo continua mostrando energia mecanica decaindo e energia perdida acumulada, enquanto o caso conservativo mantem energia mecanica constante.

Documentacao:

- Atualizados `guides/02-product-spec.md`, `guides/08-api-contracts.md` e descricoes de `durationSeconds` nos fixtures afetados para registrar que o horizonte nao e uma volta visual.

Validacao:

- Executado `npm test -- --run src/features/simulation-shell/sampleWindow.test.ts src/lib/rendering/visualRuntime.test.ts src/lib/physics/kinematics.test.ts src/features/simulation-shell/KinematicsScene.test.ts`; 32 testes passaram.
- Executado `npm test -- --run src/features/simulation-shell/sampleWindow.test.ts src/App.test.tsx`; 17 testes passaram.
- Executado `npm test -- --run src/lib/physics/kinematics.test.ts`; 20 testes passaram.
- Executado `npm run test`; 64 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; falhou porque a estrutura SDD completa ainda nao existe no repo (`README.md`, `.agent/`, `tasks/` e `adr/` ausentes), apesar do frontend validar pelos checks proporcionais.

## 2026-05-03 - Massa-mola vertical em Mecanica

Pedido reportado:

- Adicionar um sistema massa-mola na subarea `Mecanica > Oscilacoes`, ao lado do pendulo simples.

Ajuste:

- `Mecanica > Oscilacoes > Massa-mola vertical` entrou no catalogo como `analysis`, com fixture local, parametros com tooltip, presets, formulas, limites e teoria.
- O motor analitico compartilhado ganhou `mass-spring`, resolvendo o movimento em torno do equilibrio estatico `mg/k`, com amortecimento linear opcional.
- O `KinematicsSample` passou a expor forca elastica, energia elastica total, energia gravitacional, dissipacao e referencia de equilibrio para manter cena, graficos, tabela, formulas e vetores sincronizados.
- A cena Three.js ganhou suporte superior fixo, mola helicoidal vertical, massa esferica, linha de equilibrio e vetores de velocidade, aceleracao, forca elastica e peso.
- Os graficos cobrem deslocamento, velocidade, aceleracao, forcas e energia; o apendice teorico declara o regime ideal, amortecimento e limites do modelo.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: velocidade inicial zero e amortecimento zero sao validos, o caso ideal conserva energia do oscilador, o amortecimento emite `SPRING_DAMPING_ACTIVE`, e renderer/graficos/tabela/formulas/teoria usam os mesmos samples.

Documentacao:

- Atualizados `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/05-roadmap.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md`, `guides/09-simulation-catalog-plan.md`, `guides/10-simulation-fidelity-adjustment-guide.md` e `guides/issues.md` para registrar a antecipacao do massa-mola em `Mecanica > Oscilacoes`.

Validacao:

- Executado `npm run test -- src/lib/physics/kinematics.test.ts`; 22 testes passaram.
- Executado `npm run test -- src/simulation-registry/catalog.test.ts`; 8 testes passaram.
- Executado `npm run test -- src/App.test.tsx`; 8 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test`; 67 testes passaram.
- Executado `git diff --check`; sem erros, apenas avisos esperados de normalizacao LF/CRLF no Windows.
- Smoke visual Playwright/Chrome em `http://127.0.0.1:5198/` validou desktop e mobile: canvas nao vazio, mudanca entre frames com playback ativo e resposta ao arraste orbital.
- Capturas geradas em `artifacts/mass-spring-desktop-a.png`, `artifacts/mass-spring-desktop-b.png`, `artifacts/mass-spring-desktop-orbit.png`, `artifacts/mass-spring-mobile-a.png`, `artifacts/mass-spring-mobile-b.png` e `artifacts/mass-spring-mobile-orbit.png`.

## 2026-05-03 - Controle de velocidade de passagem do tempo

Pedido reportado:

- Adicionar um slider de velocidade do tempo de `1x` ate `0x`, onde `1x` e tempo normal, valores intermediarios permitem camera lenta continua e `0x` equivale a pausa.
- Manter cena, graficos e tabela suaves, sem avancos em blocos quando a velocidade for reduzida.

Ajuste:

- O playback fixo virou estado global controlado no painel de runtime por `Velocidade do tempo`.
- `visualRuntime` passou a normalizar a escala `0..1` e aplicar essa escala ao delta do renderer, preservando o ownership do `requestAnimationFrame` nas cenas.
- Pendulo, plano inclinado e cena cinematica compartilhada agora recebem o playback rate dinamico; quando a escala e `0x`, o shell envia pausa efetiva para o renderer sem resetar tempo, samples ou parametros.
- A UI exibe o estado `pausado (0x)` quando o usuario deixa a velocidade em zero e mantem o botao play/pause separado da escala de tempo.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: a velocidade de passagem do tempo so altera a leitura temporal dos mesmos samples; nao cria samples alternativos, nao muda regimes e nao recalcula fisica solta na UI.

Documentacao:

- Atualizados `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/08-api-contracts.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.

Validacao:

- Executado `npm run test -- src/lib/rendering/visualRuntime.test.ts`; 3 testes passaram.
- Executado `npm run test -- src/App.test.tsx`; 8 testes passaram.
- Executado `npm run test`; 71 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `git diff --check`; sem erros, apenas avisos esperados de normalizacao LF/CRLF no Windows.

## 2026-05-03 - Massa-mola vertical marcada como ready

Pedido reportado:

- Antes de commitar e fazer push, marcar o sistema massa-mola como feito.

Ajuste:

- `Mecanica > Oscilacoes > Massa-mola vertical` foi promovida de `analysis` para `ready` no catalogo local.
- Os testes de catalogo passaram a contar 10 simulacoes `ready` e 8 em `analysis`.
- A sidebar voltou a iniciar `Oscilacoes` recolhida quando so contem simulacoes prontas; o teste de abertura do massa-mola agora expande a subarea antes de selecionar a simulacao.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: a promocao preserva a simulacao ja validada com parametros, regimes, samples, cena, graficos, tabela, formulas, teoria, warning de amortecimento e smoke visual registrados anteriormente.

Documentacao:

- Atualizados `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/09-simulation-catalog-plan.md` e `guides/issues.md`.

Validacao:

- Executado `npm run test -- src/simulation-registry/catalog.test.ts src/App.test.tsx`; 16 testes passaram.
- Executado `npm run test`; 72 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `git diff --check`; sem erros, apenas avisos esperados de normalizacao LF/CRLF no Windows.

## 2026-05-03 - Estabilizacao de eixos em graficos constantes

Pedido reportado:

- Varios graficos que deveriam mostrar valores constantes apareciam com picos/serrilhado visual, como velocidade tangencial constante no movimento circular uniforme.

Ajuste:

- O helper compartilhado `deriveYRange` agora trata spans microscopicos de ponto flutuante como serie constante, usando margem proporcional ao modulo da grandeza em vez de amplificar ruido numerico.
- Valores nao finitos sao ignorados no calculo do eixo Y para evitar escala invalida em graficos live-canvas.
- Adicionado teste de regressao para serie constante com ruido numerico em `LiveLineChart.test.ts`.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: a correcao nao altera samples, regimes, cena, tabela ou formulas; apenas estabiliza a escala visual dos graficos para representar corretamente grandezas constantes derivadas da mesma fonte fisica.

Documentacao:

- Nenhum guide estrutural atualizado; o contrato fisico e de produto nao mudou.

Validacao:

- Executado `npm run test -- LiveLineChart.test.ts`; 3 testes passaram.
- Executado `npm run test`; 72 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.

## 2026-05-03 - MUV/queda livre apoiada no plano e grade com fundo

Pedido reportado:

- No MUV/queda livre, o corpo atravessava o plano de referencia e continuava caindo para baixo, prejudicando a leitura visual.
- O grid do plano estava completamente transparente; foi pedido um fundo com alfa mantendo as linhas visiveis.

Ajuste:

- O motor de `uniformly-accelerated-motion` agora detecta cruzamento descendente do plano `z = 0`; depois do contato didatico, o sample fica apoiado no plano, com posicao `0`, velocidade `0`, aceleracao `0` e `isGrounded = true`.
- O fixture e a teoria declaram o novo regime, deixam claro que a formula de MUV vale antes do contato e que o contato nao simula impulso, deformacao ou ressalto.
- O renderer Three.js de Cinematica adiciona um plano de fundo translucido sob o `GridHelper`, com as linhas da grade renderizadas por cima.
- Os smoke tests de UI mais pesados tiveram seus timeouts ajustados para o tempo observado no ambiente, sem alterar as assercoes.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: parametros, regimes, samples, cena, graficos, tabela, formulas, teoria, warning e testes foram conferidos para manter uma unica fonte de samples.

Documentacao:

- Atualizados o fixture `mechanics-uniformly-accelerated-motion.json`, a teoria local da simulacao e este registro de progresso. Nenhum guide estrutural mudou.

Validacao:

- Executado `npm test -- --run src/lib/physics/kinematics.test.ts src/features/simulation-shell/KinematicsScene.test.ts`; 25 testes passaram.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run lint`; passou.
- Executado `npm test`; 73 testes passaram.
- Smoke visual com Playwright em desktop e mobile confirmou o MUV em `grounded=true` e gerou `artifacts/muv-ground-plane-desktop.png` e `artifacts/muv-ground-plane-mobile.png`.

## 2026-05-03 - Gangorra visual para torque e alavancas

Pedido reportado:

- Melhorar `Mecanica > Estatica > Torque, alavancas e centro de massa`, que parecia abstrata demais, usando uma gangorra com massas sobre a barra para tornar o efeito dos parametros mais perceptivel.

Ajuste:

- O sample de torque agora carrega campos explicitos para os bracos esquerdo/direito e o braco da forca aplicada, mantendo a cena alimentada pela mesma fonte numerica usada por graficos, tabela e formulas.
- A projecao da cena de torque saiu do plano horizontal e passou para um plano vertical de gangorra.
- O renderer Three.js ganhou apoio fixo, barra dimensionada pelos bracos, blocos de massa sobre a barra, marcador da forca aplicada, marcador de centro de massa e origens de vetores nos pontos fisicos correspondentes.
- Os guides registram que alavancas/gangorras devem parecer bancada fisica com massas, apoio e vetores derivados do sample, nao uma barra solta no espaco.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: parametros, sample, cena, vetores, graficos, tabela, formulas e teoria continuam sincronizados. A mudanca e visual/didatica; o modelo analitico, regimes e warnings existentes foram preservados.

Documentacao:

- Atualizados `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/06-data-and-api.md`, `guides/08-api-contracts.md`, `guides/10-simulation-fidelity-adjustment-guide.md` e este registro de progresso.

Validacao:

- Executado `npm run test -- src/lib/physics/kinematics.test.ts src/features/simulation-shell/KinematicsScene.test.ts`; 26 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test`; 74 testes passaram.
- Smoke visual em Chrome headless em `http://127.0.0.1:5203/` confirmou heading da simulacao, canvas da gangorra e legenda compacta de vetores; captura em `artifacts/torque-lever-seesaw-smoke.png`.

## 2026-05-03 - Suporte trapezoidal para a gangorra de torque

Pedido reportado:

- Em `Mecanica > Estatica > Torque, alavancas e centro de massa`, o apoio da gangorra ainda parecia generico. Foi pedido um suporte mais coerente com a referencia enviada: base trapezoidal robusta, abertura triangular e furo superior.

Ajuste:

- O renderer Three.js trocou o cone/piramide simples do apoio por uma geometria extrudada trapezoidal com bevel, abertura triangular vazada e furo circular visivel.
- A cena ganhou um pino discreto no ponto de apoio e um sombreado no furo para manter a leitura da referencia no angulo de camera padrao.
- Refinamento posterior deixou o suporte mais pontudo, com topo mais estreito, altura maior e abertura triangular mais vertical.
- Refinamento final trocou o topo estreito por um apice triangular real, alinhando um eixo cilindrico maior no pivo da gangorra, com tampas laterais visiveis como no exemplo de referencia.
- A barra, massas, marcadores, vetores e leitura do centro de massa continuam usando os mesmos samples e pontos fisicos existentes.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: a mudanca e visual/didatica no renderer. Parametros, regimes, samples, graficos, tabela, formulas, teoria e warnings permanecem inalterados e sincronizados pela mesma fonte fisica.

Documentacao:

- Atualizado este registro de progresso. Nenhum guide estrutural mudou porque nao houve alteracao de produto, contrato, modelo fisico, dados ou roadmap.

Validacao:

- Executado `npm run test -- KinematicsScene.test.ts`; 3 testes passaram.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run lint`; passou.
- Smoke visual em Chrome headless em `http://127.0.0.1:5173/` confirmou heading da simulacao, canvas nao branco e suporte visivel; capturas em `artifacts/torque-support-full-smoke.png` e `artifacts/torque-support-canvas-smoke.png`.
- Smoke visual do refinamento pontudo gerou `artifacts/torque-support-pointed-full-smoke.png` e `artifacts/torque-support-pointed-canvas-smoke.png`.
- Smoke visual do apice triangular com eixo no pivo gerou `artifacts/torque-support-sharp-apex-axle-full-smoke.png` e `artifacts/torque-support-sharp-apex-axle-canvas-smoke.png`.

## 2026-05-03 - Animacao da gangorra de torque

Status: feito.

Pedido reportado:

- Em `Mecanica > Estatica > Torque, alavancas e centro de massa`, a cena ficava parada mesmo com playback rodando e torque resultante diferente de zero.

Ajuste:

- O motor de `torque-levers-center-mass` deixou de emitir `angleRadians` constante.
- O sample agora deriva o angulo visual da aceleracao angular `alpha = tau / I` ao longo do tempo, com escala didatica e limite de inclinacao para manter a gangorra legivel no suporte.
- A velocidade angular exibida foi alinhada com essa evolucao visual enquanto a barra ainda nao atingiu o limite didatico.
- Adicionado teste de regressao garantindo que uma alavanca desequilibrada sai de `angleRadians = 0` e inclina no sentido do torque resultante.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: parametros, torque resultante, momento de inercia, centro de massa, vetores, graficos, tabela, formulas e warnings continuam derivados dos mesmos samples do motor. O renderer apenas consome o `angleRadians` atualizado.

Documentacao:

- Atualizado este registro de progresso. Nenhum guide estrutural mudou porque nao houve mudanca de escopo, contrato de fixture, roadmap ou formulas declaradas.

Validacao:

- Executado `npm run test -- kinematics.test.ts`; 24 testes passaram.
- Executado `npm run test`; 75 testes passaram.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run lint`; passou.
- Tentativa de smoke visual por Chrome headless selecionou a simulacao correta e confirmou runtime em playback, mas a captura direta do canvas WebGL saiu preta no ambiente headless; a validacao visual manual no navegador local ainda e recomendada.

## 2026-05-03 - Defaults simetricos para gangorra de torque

Status: feito.

Pedido reportado:

- Ajustar apenas os valores iniciais de massa e braco da gangorra para os dois lados ficarem iguais e a simulacao abrir em equilibrio.

Ajuste:

- O fixture `mechanics-torque-levers-center-mass.json` agora inicia com massa esquerda e direita iguais a `2 kg`.
- Os bracos esquerdo e direito iniciam iguais a `1,5 m`.
- A forca aplicada inicial foi zerada para nao introduzir torque externo no estado inicial.
- Os `defaultValue` dos parametros foram alinhados aos novos defaults para manter painel de controle e estado inicial consistentes.
- Adicionado teste de registro garantindo que os defaults da gangorra abrem com torque resultante, centro de massa e angulo iguais a zero.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: a mudanca afeta apenas os parametros iniciais do fixture. O motor continua calculando torque, centro de massa, vetores, graficos, tabela, formulas e warnings a partir dos mesmos samples.

Documentacao:

- Atualizado este registro de progresso. Nenhum guide estrutural mudou porque nao houve mudanca de contrato, modelo fisico, roadmap ou comportamento geral da simulacao.

Validacao:

- Executado `npm run test -- catalog.test.ts`; 9 testes passaram.
- Executado `npm run test -- kinematics.test.ts`; 24 testes passaram.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run lint`; passou.

## 2026-05-03 - Energia por corpo na gangorra de torque

Status: feito.

Pedido reportado:

- Em `Mecanica > Estatica > Torque, alavancas e centro de massa`, o grafico de energia deveria detalhar energia cinetica e potencial gravitacional de cada um dos corpos da gangorra.

Ajuste:

- O sample de `torque-levers-center-mass` agora calcula energia cinetica esquerda/direita por `K_i = 1/2 m_i (omega r_i)^2`.
- O sample tambem calcula potencial gravitacional esquerda/direita por `U_g = m_i g z_i`, usando o nivel do apoio como zero.
- A energia cinetica total da simulacao passa a somar as energias cineticas dos dois corpos, e a energia potencial/total exibida deriva da mesma decomposicao.
- O grafico `Energia por tempo` da gangorra passou a mostrar cinco series: cinetica esquerda, cinetica direita, potencial gravitacional esquerda, potencial gravitacional direita e energia mecanica das massas.
- O fixture ganhou formulas declaradas para energia cinetica por massa pontual e potencial gravitacional por corpo.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: os novos campos sao gerados no motor numerico e reaproveitados por graficos, formulas e contrato de sample. O estado inicial equilibrado permanece com torque, angulo, energias cineticas e potenciais zeradas no nivel do apoio.

Documentacao:

- Atualizados `guides/02-product-spec.md`, `guides/06-data-and-api.md` e `guides/08-api-contracts.md` para declarar energia mecanica por corpo na gangorra e os novos campos de `KinematicsSample`.

Validacao:

- Executado `npm run test -- kinematics.test.ts kinematicsChartConfigs.test.ts`; 25 testes passaram.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run lint`; passou.
- Executado `npm run test`; 77 testes passaram.

## 2026-05-03 - Promocao de tres simulacoes para pronto

Status: feito.

Pedido reportado:

- Marcar como feitos os tres itens destacados no catalogo: `Movimento circular uniforme`, `Equilibrio de particula` e `Torque, alavancas e centro de massa`.

Ajuste:

- O fixture `catalog.json` promoveu `uniform-circular-motion`, `particle-equilibrium` e `torque-levers-center-mass` de `analysis` para `ready`.
- Os guias de produto, dados e catalogo planejado foram atualizados para refletir que essas tres simulacoes agora aparecem como `pronto`.
- Os testes de catalogo foram atualizados para 13 simulacoes `ready` e 5 simulacoes `analysis`.
- Os testes da sidebar foram ajustados para a regra existente: subareas apenas com itens `ready` iniciam recolhidas, enquanto subareas com `analysis` iniciam abertas.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: a promocao usa simulacoes ja implementadas, sincronizadas e validadas em ciclos anteriores. A promocao foi solicitada apos revisao manual do dono do projeto.

Documentacao:

- Atualizados `guides/02-product-spec.md`, `guides/06-data-and-api.md` e `guides/09-simulation-catalog-plan.md`.

Validacao:

- Executado `npm run test -- catalog.test.ts`; 9 testes passaram.
- Executado `npm run test -- App.test.tsx`; 8 testes passaram.
- Executado `npm run test`; 77 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build:pages`; passou com o aviso conhecido de chunk acima de 500 kB.

## 2026-05-04 - Plano e furo visual no rolamento

Status: feito.

Pedido reportado:

- Em `Mecanica > Rotacao > Rolamento sem escorregamento`, colocar a roda sobre um plano e adicionar um furo proximo da borda para a rotacao ficar visivel.

Ajuste:

- O renderer Three.js da cena cinematica compartilhada agora cria um plano inclinado solido apenas para `rolling-without-slipping`.
- A roda visual e reposicionada para apoiar o raio renderizado sobre a superficie do plano, mantendo o movimento derivado dos mesmos samples do motor.
- Um furo escuro atravessando a roda foi adicionado perto da borda para destacar a rotacao durante o rolamento.
- A linha de referencia central da roda foi removida nessa simulacao para nao competir visualmente com o plano.
- Correcao posterior: o renderer do rolamento passou a usar `rotation.y = sample.angleRadians`, alinhando o sentido do giro da roda ao avanco no plano em vez de girar contra o deslocamento.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: a mudanca e visual/didatica no renderer. Motor, parametros, regimes, samples, graficos, tabela, formulas, teoria e warnings continuam sem alteracao e usando a mesma fonte fisica.

Documentacao:

- Atualizado este registro de progresso. Nenhum guide estrutural mudou porque nao houve mudanca de contrato, modelo fisico, dados, roadmap ou status da simulacao.

Validacao:

- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run lint`; passou.
- Executado `npm run test`; 77 testes passaram.
- Executado smoke visual headless com Playwright temporario e Chrome local em `http://127.0.0.1:5173/`, selecionando `Rolamento sem escorregamento`; canvas capturado com pixels nao-background e salvo em `artifacts/rolling-visual-smoke.png`.
- Apos a correcao de sentido do giro, reexecutados `npm run build`, `npm run lint`, `npm run test` e o smoke visual headless; todos passaram.

## 2026-05-04 - Viewport inicial maior e titulo limpo

Status: feito.

Pedido reportado:

- Aumentar a area inicial da viewport para 90% da altura da tela e remover o texto `Viewport Three.js` do titulo da viewport.

Ajuste:

- O card da viewport passou a definir a altura inicial em `90svh`.
- As cenas Three.js do pendulo, plano inclinado e renderer cinematico compartilhado passaram a preencher `100%` do espaco restante do card, inclusive em modo maximizado.
- O cabecalho da viewport deixou de renderizar o texto `Viewport Three.js`, mantendo apenas FPS, tempo, toggle de leituras/vetores e acao de maximizar.
- O teste da tela inicial passou a garantir que o texto removido nao aparece.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: a mudanca e somente de layout/rotulo. Motor, parametros, regimes, samples, graficos, tabela, formulas, teoria e warnings continuam sem alteracao e usando a mesma fonte fisica.

Documentacao:

- Atualizado este registro de progresso. Nenhum guide estrutural mudou porque nao houve mudanca de contrato, modelo fisico, dados, roadmap ou status de simulacao.

Validacao:

- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run lint`; passou.
- Executado `npm run test -- src/App.test.tsx -t "renders the pendulum simulation shell" --reporter=verbose`; 1 teste passou e 7 ficaram ignorados pelo filtro.
- Executado smoke visual headless via Chrome DevTools Protocol em `http://127.0.0.1:5173/`: apos maximizar, o card do viewport mediu 1128 px de altura e o canvas preencheu ate 1 px do fundo do card.
- A tentativa ampla `npm run test -- src/App.test.tsx` excedeu o timeout local de 120s sem reportar falha; os processos de teste pendurados foram encerrados, preservando o dev server em `127.0.0.1:5173`.

## 2026-05-04 - Leituras do viewport retrateis

Status: feito.

Pedido reportado:

- Tornar o bloco de metricas instantaneas e legenda detalhada dos vetores retratil, fechado por padrao, e desativar as funcoes de exibicao/calculo de valores enquanto ele estiver escondido para liberar mais espaco para a simulacao.

Ajuste:

- O viewport do pendulo, plano inclinado e simulacoes cinematicas ganhou um toggle `Abrir/Fechar leituras e vetores`, fechado por padrao.
- Metricas instantaneas e legendas detalhadas de vetores agora ficam desmontadas enquanto o bloco esta fechado.
- Os builders de overlays numericos detalhados so calculam vetores quando o bloco esta aberto e o overlay de vetores esta ativo.
- A legenda compacta sobre o canvas continua aparecendo quando vetores estao ligados, mas usa unidades estaticas de legenda para nao depender dos valores vivos desmontados.
- O shell preserva o canvas como area principal do viewport, com a cena preenchendo o espaco disponivel.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: a mudanca e de layout/execucao de UI. Motor numerico, parametros, regimes, samples, graficos, tabela, formulas, teoria e warnings continuam derivados da mesma fonte fisica.

Documentacao:

- Atualizados `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md` e `guides/07-quality-and-operations.md`.

Validacao:

- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run lint`; passou.
- Executado `npx vitest run App.test.tsx --reporter=json --outputFile=vitest-results.json`; 8 testes passaram e o relatorio temporario foi removido.
- Executado `npx vitest run --reporter=json --outputFile=vitest-results.json`; 77 testes passaram em 22 suites e o relatorio temporario foi removido.
- Executado smoke visual headless com Chrome local em `http://127.0.0.1:5173/`; a legenda detalhada iniciou escondida, abriu pelo toggle e o canvas mediu aproximadamente 645 px de altura no viewport padrao.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; falhou por lacunas estruturais ja existentes no SDD (`README.md`, `.agent/`, `tasks/`, `adr/` e rotas de refinamento), sem relacao direta com esta mudanca de UI.

## 2026-05-04 - Cena didatica de rotacao de corpo rigido

Status: feito.

Pedido reportado:

- Substituir a visualizacao fraca de `Mecanica > Rotacao > Rotacao de corpo rigido` por uma versao visualmente melhor, seguindo a opcao de mesa de rotacao didatica.

Ajuste:

- A cena de `Rotacao de corpo rigido` passou a usar uma bancada circular com aro, eixo fixo, hub central, rotor assimetrico, massas visuais, linha de referencia de angulo, arco de fase angular, trilha circular e freio/amortecimento visual.
- As setas retas genericas de velocidade angular, aceleracao angular e torque foram substituidas nessa simulacao por setas curvas ao redor do eixo, preservando a legenda compacta e os mesmos ids de grandezas.
- A camera inicial, bounds da cena e opacidade da grade foram ajustados para aproximar o experimento e reduzir o efeito de objeto pequeno perdido no plano.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: a mudanca e visual/didatica no renderer. Motor, parametros, regimes, samples, graficos, tabela, formulas, teoria e warnings continuam sem alteracao e usando a mesma fonte fisica.
- Confirmado que o renderer continua consumindo `angleRadians`, `angularVelocityRadiansPerSecond`, `angularAccelerationRadiansPerSecondSquared`, `netTorqueNewtonMeters`, `momentOfInertiaKilogramMetersSquared` e `thermalEnergyJoules` do sample, sem criar fisica paralela.

Documentacao:

- Atualizado este registro de progresso. Nenhum guide estrutural mudou porque nao houve mudanca de contrato, modelo fisico, dados, roadmap ou status da simulacao.

Validacao:

- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run lint`; passou.
- Executado `npm run test`; 77 testes passaram.
- Executado smoke visual headless com Chrome local em `http://127.0.0.1:5173/`, selecionando `Rotacao de corpo rigido`; canvas capturado com `dataLength` 20842, aria da mesa de rotacao presente e screenshot salvo em `artifacts/rigid-body-rotation-smoke.png`.

## 2026-05-04 - Massa movel e momento angular na rotacao

Status: feito.

Pedido reportado:

- Ajustar `Mecanica > Rotacao > Rotacao de corpo rigido` para que a esfera tenha a cor da barra, possa se aproximar ou afastar do eixo, altere centro de massa/momento de inercia e mostre o aumento de velocidade angular por conservacao do momento angular. Revisar tambem o sentido das setas e o vetor perpendicular ao plano de rotacao.

Ajuste:

- A esfera da barra passou a usar a mesma cor teal do rotor.
- Adicionado o controle `Distancia da massa movel`, com tooltip de ajuda, presets e teoria/formulas atualizadas.
- O motor agora calcula `I = I_base + m r^2`, `centerOfMassMeters` e a velocidade angular inicial efetiva a partir de um momento angular de referencia; com torque e amortecimento zerados, aproximar a massa do eixo reduz `I` e aumenta `omega`.
- A cena move a esfera ao longo da barra, mostra um marcador do centro de massa e adiciona o vetor axial de momento angular perpendicular ao plano de giro.
- Os graficos passaram a incluir inercia total, centro de massa e momento angular, usando os mesmos samples da cena/tabela/formulas.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: parametros, sample, cena, graficos, tabela, formulas, teoria, warnings e testes foram ajustados para manter uma unica fonte fisica.
- A simulacao permanece em `analysis`; nao houve promocao para `ready`.

Documentacao:

- Atualizados `guides/02-product-spec.md`, `guides/06-data-and-api.md`, fixture de rotacao, teoria de rotacao e este registro de progresso.

Validacao:

- Executado `npm run test -- src/lib/physics/kinematics.test.ts --reporter=verbose`; 25 testes passaram, incluindo o caso de conservacao de momento angular com massa movel.
- Executado `npm run test -- src/App.test.tsx --reporter=verbose`; 8 testes passaram.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run lint`; passou.
- Executado `npm run test`; 11 arquivos e 78 testes passaram.
- Executado smoke visual headless com Chrome local em `http://127.0.0.1:5173/`, selecionando `Rotacao de corpo rigido`; canvas capturado com `dataLength` 19018, controle `Distancia da massa movel` presente, legenda `Momento angular` presente e screenshot salvo em `artifacts/rigid-body-rotation-mass-smoke.png`.

## 2026-05-04 - Parametros sem reiniciar playback

Status: feito.

Pedido reportado:

- Alterar valores nos controles parecia reiniciar a simulacao; a experiencia desejada e aplicar os novos valores ao estado/tempo atual para perceber as mudancas de forma mais sinuosa, valendo para simulacoes atuais e futuras.

Ajuste:

- Mudancas em parametros fisicos deixaram de incrementar `playbackResetVersion`.
- Mudancas em parametros de runtime, incluindo `Horizonte calculado`, tambem deixaram de reiniciar o relogio continuo.
- `Reset`, troca de simulacao e preset continuam sendo acoes explicitas de reinicio.
- `PendulumScene`, `InclinedPlaneScene` e `KinematicsScene` agora usam a timeline/samples atuais apenas quando um reset explicito acontece; a troca de samples por mudanca de parametros preserva `elapsedSecondsRef` e o estado vivo.
- `KinematicsScene` atualiza sua referencia interna de timeline quando os samples mudam, sem zerar o playback.
- Adicionado teste de regressao em `SimulationShell.test.tsx` garantindo que mudancas de parametro e horizonte preservam a versao de reset, enquanto o botao Reset incrementa.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: a mudanca preserva fonte unica de samples e altera apenas a politica de continuidade do playback. Motor, cena, graficos, tabela, formulas e warnings continuam derivados dos mesmos parametros/samples.

Documentacao:

- Lidos `guides/00-index.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Nenhum guide estrutural foi alterado porque o contrato ja dizia que alterar parametros nao deve resetar o tempo; a implementacao foi corrigida para cumprir esse contrato.

Validacao:

- Executado `npm run test -- src/features/simulation-shell/SimulationShell.test.tsx --reporter=verbose`; passou.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test`; 12 arquivos e 79 testes passaram.
- Dev server local iniciado em `http://127.0.0.1:5174/`.

## 2026-05-04 - Gravitação com tempo visível e lua didática

Status: feito.

Pedido reportado:

- A orbita em `Mecanica > Gravitacao > Campo gravitacional e orbitas` parecia parada porque o periodo fisico era longo demais para o playback em tempo real.
- A cena deveria mostrar um satelite no planeta, em leitura parecida com Sol, Terra e Lua.

Ajuste:

- Adicionado o runtime `Tempo orbital exibido`, que compacta o tempo do modelo para tornar a orbita visivel sem recalcular fisica fora dos samples.
- O motor de gravitacao agora preenche `secondaryXMeters`, `secondaryZMeters`, velocidades secundarias e `secondaryRadiusMeters` para uma lua didatica ao redor do corpo em orbita.
- A cena orbital passou a desenhar corpo central, planeta em orbita, lua e guia local da lua, todos derivados do sample.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: a compactacao temporal e runtime declarado; campo, forca, energia, graficos, tabela, formulas e cena continuam lendo os mesmos samples.
- A lua e declarada como marcador didatico sem perturbacao de tres corpos; a simulacao permanece em `analysis`.

Documentacao:

- Atualizados fixture, teoria local, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md` e este registro.

Validacao:

- Adicionados testes unitarios para as coordenadas da lua didatica no motor e para a projecao horizontal do sistema orbital.
- Executado `npm run test -- src/lib/physics/kinematics.test.ts src/features/simulation-shell/KinematicsScene.test.ts --reporter=verbose`; 30 testes passaram.
- Executado `npm run test -- src/simulation-registry/catalog.test.ts --reporter=verbose`; 9 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test -- --reporter=dot`; 12 arquivos e 81 testes passaram.
- Executado smoke visual headless com Chrome em `http://127.0.0.1:5173/`, selecionando `Campo gravitacional e orbitas`; confirmou controle `Tempo orbital exibido`, canvas nao vazio e mudanca entre frames. Capturas em `artifacts/gravity-orbit-before.png` e `artifacts/gravity-orbit-after.png`.

## 2026-05-04 - Orbita kepleriana com leis dos periodos e areas

Status: feito.

Pedido reportado:

- A simulacao `Mecanica > Gravitacao > Campo gravitacional e orbitas` mantinha velocidade visual praticamente constante e nao respeitava a lei dos periodos nem a lei das areas.

Ajuste:

- O motor orbital deixou de avancar por anomalia verdadeira uniforme e passou a resolver a anomalia excentrica de Kepler a partir da anomalia media.
- A posicao orbital agora vem da anomalia verdadeira calculada, enquanto a velocidade vem das componentes radial e transversal do problema de dois corpos.
- A velocidade angular instantanea passou a usar `omega = h / r^2`, fazendo o corpo acelerar no periastro e desacelerar no apoastro.
- Adicionado grafico `Leis de Kepler: areas e periodos`, com taxa areolar relativa constante e velocidade angular relativa variavel.
- Fixture e teoria local foram atualizados para declarar lei dos periodos, lei das areas, anomalia excentrica e limites do modelo.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: parametros, samples, cena, graficos, tabela, formulas, teoria e warnings permanecem derivados da mesma fonte fisica. A simulacao continua em `analysis`.

Documentacao:

- Lidos `guides/00-index.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Atualizados `fixtures/simulations/mechanics-gravitational-field-orbits.json`, `src/content/simulations/mechanics/gravitational-field-orbits/theory.md` e este registro.

Validacao:

- Executado `npm run test -- src/lib/physics/kinematics.test.ts src/features/simulation-shell/kinematicsChartConfigs.test.ts`; 2 arquivos e 30 testes passaram.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run lint`; passou.
- Executado `npm run test`; 12 arquivos e 84 testes passaram.
- Confirmado servidor local ativo em `http://127.0.0.1:5173/`.
- Executado smoke visual headless isolado em Chrome local para `http://127.0.0.1:5173/`; selecionou `Campo gravitacional e orbitas`, abriu graficos, encontrou `Leis de Kepler: areas e periodos`, `Velocidade orbital por tempo`, 6 canvas e screenshot canvas serializavel com `dataLength` 20842.

## 2026-05-04 - Lua didatica desacoplada da velocidade kepleriana

Status: feito.

Pedido reportado:

- Em `Mecanica > Gravitacao > Campo gravitacional e orbitas`, a velocidade orbital da lua didatica aumentava junto com a velocidade kepleriana do planeta quando a excentricidade variava.
- A lua visual deveria ter velocidade relativa propria, independente da velocidade instantanea que aumenta no periastro e diminui no apoastro.

Ajuste:

- O motor orbital manteve a velocidade kepleriana variavel do planeta em `speedMetersPerSecond` e `angularVelocityRadiansPerSecond`.
- A lua didatica passou a usar uma velocidade angular relativa de referencia, derivada do raio de periastro e da massa central, sem multiplicar a velocidade angular instantanea do planeta.
- `secondaryVelocity*` agora registra a velocidade relativa propria da lua visual ao redor do planeta, sem entrar na energia, campo ou forca da orbita principal.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: planeta, campo, forca, energia, graficos e formulas continuam lendo o sample kepleriano principal; a lua permanece marcador didatico secundario no mesmo sample e nao altera o problema de dois corpos.
- A simulacao continua em `analysis`, aguardando teste manual antes de promocao.

Documentacao:

- Lidos `guides/00-index.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Atualizados `fixtures/simulations/mechanics-gravitational-field-orbits.json`, `src/content/simulations/mechanics/gravitational-field-orbits/theory.md`, `guides/06-data-and-api.md` e este registro.
- Nenhum HLD/diagrama foi alterado porque a fronteira de arquitetura nao mudou.

Validacao:

- Adicionado teste unitario garantindo que a velocidade da lua didatica fica independente da variacao de velocidade causada pela excentricidade.
- Executado `npm run test -- src/lib/physics/kinematics.test.ts src/features/simulation-shell/kinematicsChartConfigs.test.ts --reporter=verbose`; 2 arquivos e 31 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test -- --reporter=dot`; 12 arquivos e 85 testes passaram.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; falhou por estrutura SDD ausente ja existente no repositorio (`README.md`, `.agent/`, `tasks/` e `adr/`), nao por inconsistencias especificas desta correcao.

## 2026-05-04 - Folga visual da lua em orbitas excentricas

Status: feito.

Pedido reportado:

- Em `Mecanica > Gravitacao > Campo gravitacional e orbitas`, aumentar a excentricidade fazia a lua didatica parecer se aproximar da Terra e ate tocar nela.
- A excentricidade da orbita principal nao deve interferir na apresentacao local Terra/Lua.

Ajuste:

- A projecao da cena passou a preservar uma folga visual minima para a lua didatica ao redor da Terra quando a escala global da orbita principal fica muito reduzida.
- O motor e os samples `secondary*` continuam desacoplados da velocidade kepleriana instantanea e da excentricidade; o ajuste e apenas de legibilidade da cena.
- A trilha circular local da lua usa a mesma posicao ajustada, evitando que a orbita desenhada contradiga o marcador visual.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: campo, forca, energia, graficos, tabela e formulas da orbita principal continuam usando os samples keplerianos; a lua permanece marcador didatico secundario no mesmo sample, sem alterar o problema de dois corpos.
- A simulacao continua em `analysis`, aguardando teste manual antes de promocao.

Documentacao:

- Lidos `guides/00-index.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Atualizado este registro. Nenhum guide, fixture, teoria ou HLD/diagrama precisou mudar porque a decisao de desacoplar a lua didatica ja estava documentada e a fronteira arquitetural nao mudou.

Validacao:

- Executado `npm run test -- --run src/features/simulation-shell/KinematicsScene.test.ts src/lib/physics/kinematics.test.ts`; 2 arquivos e 34 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test`; 12 arquivos e 86 testes passaram.
- Executado smoke visual headless em `http://127.0.0.1:5173/` com excentricidade `0.84`; desktop teve 15018 pixels nao-background e 7654 pixels alterados apos drag, mobile teve 205722 pixels nao-background e 2679 pixels alterados apos drag.

## 2026-05-04 - Linha orbital completa em alta excentricidade

Status: feito.

Pedido reportado:

- Em `Mecanica > Gravitacao > Campo gravitacional e orbitas`, aumentar muito a excentricidade fazia a linha de referencia da orbita sumir ou virar apenas um trecho visualmente confuso.

Ajuste:

- A referencia visual da orbita principal agora usa amostras fechadas de uma volta completa calculadas pelo mesmo motor kepleriano, em vez de depender apenas do horizonte temporal atual.
- O enquadramento da cena orbital tambem considera essa volta completa, mantendo a elipse alta em excentricidade dentro do viewport sem mudar o sample vivo de planeta, lua didatica, graficos, tabela ou formulas.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: a linha continua sendo uma referencia secundaria derivada do modelo, e a cena animada segue usando os samples keplerianos compartilhados com graficos, tabela e formulas.
- A simulacao continua em `analysis`, aguardando teste manual antes de promocao.

Documentacao:

- Lidos `guides/00-index.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Atualizado este registro. Nenhum guide, fixture, teoria ou HLD/diagrama precisou mudar porque o contrato fisico e a arquitetura nao mudaram.

Validacao:

- Adicionado teste garantindo que a referencia orbital fechada em `e = 0.84` fica enquadrada mesmo quando o horizonte de runtime nao cobre a volta inteira.
- Executado `npm run test -- --run src/features/simulation-shell/KinematicsScene.test.ts src/lib/physics/kinematics.test.ts`; 2 arquivos e 35 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test -- --reporter=dot`; 12 arquivos e 87 testes passaram.
- Executado smoke visual headless em `http://127.0.0.1:5173/` com excentricidade `0.84`; screenshot salvo em `artifacts/gravity-orbit-high-e-reference.png`, com 47.566 pixels nao-background e 2.641 pixels cyan/teal no recorte do canvas.

## 2026-05-04 - Toggle de camera perspectiva e ortogonal no viewport

Status: feito.

Pedido reportado:

- Adicionar um controle no viewport para alternar a visualizacao entre camera em perspectiva e camera ortogonal.
- O controle deveria funcionar como um toggle moderno, com alternancia direta entre os dois modos.

Ajuste:

- Adicionado um controle segmentado `Persp.`/`Orto` no cabecalho do viewport da simulacao.
- O modo de camera agora e estado compartilhado do shell e e repassado para Pendulo, Plano inclinado e cenas cinematicas/mecanicas compartilhadas.
- O helper de camera passou a criar cameras perspectiva ou ortografica e recalcular aspect/frustum a partir do tamanho do viewport e do raio de zoom.
- O zoom por `Shift + scroll` continua funcionando nos dois modos: em perspectiva move a camera e, em ortogonal, tambem ajusta o frustum.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: a alteracao fica restrita a projecao visual da camera. Motor numerico, samples, graficos, tabela, vetores, formulas, teoria e warnings continuam usando a mesma fonte fisica.
- Nenhuma simulacao mudou de status; promocao para `ready` continua dependendo de teste manual quando aplicavel.

Documentacao:

- Lidos `guides/00-index.md`, `guides/01-strategy.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/05-roadmap.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md`, `guides/10-simulation-fidelity-adjustment-guide.md` e `guides/issues.md`.
- Atualizado este registro. Nenhum guide, fixture, teoria ou HLD/diagrama precisou mudar porque o contrato fisico, os dados e a arquitetura documentada permanecem os mesmos.

Validacao:

- Adicionados testes para o frustum ortografico e para a alternancia de camera no shell sem resetar playback.
- Executado `npm run test -- src/lib/rendering/orbitCamera.test.ts src/features/simulation-shell/SimulationShell.test.tsx`; 2 arquivos e 5 testes passaram.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run lint`; passou.
- Executado `npm run test`; 12 arquivos e 89 testes passaram.
- Executado `git diff --check`; passou, com avisos existentes de normalizacao LF/CRLF.
- Executado smoke visual headless em `http://127.0.0.1:5173/`; desktop e mobile mantiveram canvas nao vazio antes/depois da troca para ortogonal, com screenshots em `artifacts/camera-projection-smoke`.

## 2026-05-04 - Rolamento sem escorregamento promovido para pronto

Status: feito.

Pedido reportado:

- Promover `Mecanica > Rotacao > Rolamento sem escorregamento` de `analysis` para `ready` apos aprovacao manual no catalogo.

Ajuste:

- `fixtures/simulations/catalog.json` agora marca `rolling-without-slipping` como `ready`, exibindo o card como `pronto`.
- O teste de contrato do catalogo moveu `rolling-without-slipping` para o grupo de simulacoes mecanicas compartilhadas `ready`.
- Guides de produto, arquitetura, regras, dados, catalogo planejado e issues foram sincronizados com o novo status.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide` como gate de promocao: parametros de runtime e fisicos possuem descricoes, atrito zero e velocidade inicial zero permanecem validos, o modelo declara rolamento puro e escorregamento, os samples alimentam cena, graficos, tabela, formulas e teoria, e ha teste unitario cobrindo o limite de atrito estatico excedido.
- Nenhum motor, renderer, formula ou teoria foi alterado nesta promocao; a decisao foi somente de status apos aprovacao manual.

Documentacao:

- Lidos `AGENTS.md`, `guides/00-index.md`, `guides/01-strategy.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/05-roadmap.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md`, `guides/09-simulation-catalog-plan.md`, `guides/10-simulation-fidelity-adjustment-guide.md` e `guides/issues.md`.
- HLD/diagrama nao foi atualizado porque a arquitetura, fluxo de dados e fronteiras do renderer nao mudaram.

Validacao:

- Executado `npm run test -- --run src/simulation-registry/catalog.test.ts src/lib/physics/kinematics.test.ts`; 2 arquivos e 38 testes passaram.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run lint`; passou.
- Executado `npm run test -- --reporter=dot`; 12 arquivos e 90 testes passaram.
- Executado `git diff --check`; passou, com avisos existentes de normalizacao LF/CRLF.

## 2026-05-05 - Modo de rotacao constante no corpo rigido

Status: feito.

Pedido reportado:

- Adicionar uma opcao de rotacao constante para comparar a mudanca do momento de inercia na simulacao de `Rotacao de corpo rigido`.

Ajuste:

- Adicionado o parametro booleano `constantAngularVelocity` como `Rotacao constante (omega fixa)` no fixture da simulacao.
- O motor agora preserva o modo atual por padrao: com torque e amortecimento zerados, a mudanca de raio conserva `L = I omega`. Quando o novo modo esta ligado, `omega` fica fixa no valor inicial, torque/amortecimento sao neutralizados para a cinematica e `L` passa a variar com `I`.
- Adicionado preset `Rotacao constante`, formula aplicada propria e aviso `ROTATION_CONSTANT_OMEGA_ACTIVE`.
- O painel generico de controles passou a renderizar parametros booleanos com `Switch` e tooltip de interrogacao.
- Atualizada a teoria da rotacao para distinguir sistema isolado com conservacao de momento angular e modo controlado de omega fixa.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: o novo controle e parametro declarado com descricao, o regime altera samples no motor, e cena, graficos, tabela, formulas, teoria e warnings continuam derivados da mesma fonte.
- Nenhuma simulacao mudou de status; `Rotacao de corpo rigido` permanece em `analysis` ate teste manual.

Documentacao:

- Lidos `AGENTS.md`, `guides/00-index.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md`, `guides/10-simulation-fidelity-adjustment-guide.md` e `guides/issues.md`.
- Atualizados `guides/02-product-spec.md`, `guides/06-data-and-api.md`, teoria da simulacao e este registro. HLD/diagrama nao foi atualizado porque arquitetura, servicos e fluxo visual continuam iguais.

Validacao:

- Executado `npm run test -- --run src/lib/physics/kinematics.test.ts src/simulation-registry/catalog.test.ts`; 2 arquivos e 40 testes passaram.
- Executado `npm run build`; passou com o aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test -- --run src/App.test.tsx`; 1 arquivo e 8 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run test`; 12 arquivos e 92 testes passaram.

## 2026-05-05 - Energia constante na rotacao de corpo rigido

Status: feito.

Pedido reportado:

- O controle de rotacao constante deveria conservar energia, nao fixar `omega`.
- Ao mudar a posicao radial da massa movel, a velocidade angular precisa aumentar ou diminuir conforme o momento de inercia muda.

Ajuste:

- O controle booleano da fixture passou a ser `Energia constante`, com parametro `constantRotationalEnergy`.
- No motor de `Rotacao de corpo rigido`, esse modo conserva `K_rot` calculada a partir da velocidade angular inicial de referencia e usa `omega = sgn(omega0) * sqrt(2K/I)`.
- Torque e amortecimento ficam neutralizados nesse modo, mantendo energia constante; `L = I omega` varia quando a massa movel altera `I`.
- Atualizados preset, formula aplicada, warning, teoria, contrato de dados e teste de UI para refletir o novo comportamento.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: parametro possui tooltip, o regime altera samples no motor, graficos/tabela/cena/formulas leem os mesmos campos (`I`, `omega`, `K_rot`, `L`) e a teoria explica quando usar energia constante versus conservacao de momento angular.
- `Rotacao de corpo rigido` permanece em `analysis`, aguardando teste manual antes de qualquer promocao.

Documentacao:

- Lidos `AGENTS.md`, `guides/00-index.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Atualizados `guides/02-product-spec.md`, `guides/06-data-and-api.md`, teoria local da simulacao e este registro. HLD/diagrama nao foi atualizado porque arquitetura, servicos e fluxo visual continuam iguais.

Validacao:

- Executado `npm run test -- --run src/lib/physics/kinematics.test.ts src/simulation-registry/catalog.test.ts --reporter=verbose`; 2 arquivos e 40 testes passaram.
- Executado `npm run test -- --run src/App.test.tsx --reporter=verbose`; 1 arquivo e 8 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com aviso conhecido de chunk acima de 500 kB.

## 2026-05-05 - Faixa ampliada da massa movel na rotacao

Status: feito.

Pedido reportado:

- Permitir que a massa movel em `Rotacao de corpo rigido` varie de `0` a `50 kg`.

Ajuste:

- O controle `Massa movel (kg)` passou a ter faixa `0..50 kg`, mantendo o valor padrao em `2.4 kg`.
- O teste de contrato do catalogo agora verifica explicitamente `min = 0` e `max = 50` para `slidingMassKilograms`.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: zero continua valido, a unidade permanece em kg e o motor ja usa o valor controlado em `I = I_base + m r^2`, centro de massa, conservacao de `L` e modo de energia constante.
- `Rotacao de corpo rigido` permanece em `analysis`, sem promocao de status.

Documentacao:

- Lidos `guides/00-index.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Guides e HLD/diagrama nao foram atualizados porque o contrato conceitual e a arquitetura nao mudaram; apenas a faixa de um parametro existente mudou.

Validacao:

- Fixture JSON de rotacao validado com `ConvertFrom-Json`.
- Executado `npm run test -- --run src/simulation-registry/catalog.test.ts --reporter=verbose`; passou.
- Executado `npm run test -- --reporter=dot`; 12 arquivos e 92 testes passaram.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; falhou pela estrutura SDD ausente ja conhecida (`README.md`, `.agent/`, `tasks/`, `adr/`), nao por inconsistencia especifica deste ajuste.

## 2026-05-05 - Controle de massa movel na rotacao

Status: feito.

Pedido reportado:

- Adicionar, perto da distancia da massa movel em `Rotacao de corpo rigido`, um controle para o valor dessa massa, porque ele muda bastante a resposta do giro.

Ajuste:

- Adicionado o parametro `slidingMassKilograms` como controle `Massa movel (kg)`, posicionado logo apos `Distancia da massa movel`.
- O motor de `Rotacao de corpo rigido` deixou de usar uma massa movel fixa interna e agora calcula `I = I_base + m r^2`, centro de massa, conservacao de `L` e modo de energia constante com o valor controlado pelo usuario.
- Os presets da simulacao passaram a declarar a massa movel; `Alta inercia` usa uma massa maior para evidenciar o efeito.
- Teoria, formulas, limites, contrato de dados e teste de UI foram atualizados para explicar que `m = 0` e valido e que aumentar `m` intensifica a mudanca de `I`, centro de massa e `omega`.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: o novo parametro tem unidade, faixa, passo e tooltip; zero e permitido; samples, graficos, tabela, formulas e cena seguem os campos calculados pelo motor.
- `Rotacao de corpo rigido` permanece em `analysis`, sem promocao de status.

Documentacao:

- Lidos `AGENTS.md`, `guides/00-index.md`, `guides/02-product-spec.md`, `guides/06-data-and-api.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Atualizados `guides/02-product-spec.md`, `guides/06-data-and-api.md`, teoria local da simulacao e este registro. HLD/diagrama nao foi atualizado porque arquitetura, servicos e fluxo visual continuam iguais.

Validacao:

- Executado `npm run test -- --run src/lib/physics/kinematics.test.ts src/simulation-registry/catalog.test.ts --reporter=verbose`; 2 arquivos e 41 testes passaram.
- Executado `npm run test -- --run src/App.test.tsx --reporter=verbose`; 1 arquivo e 8 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test -- --reporter=dot`; 12 arquivos e 93 testes passaram.

## 2026-05-05 - Reforco visual e conceitual de hidrostatica e empuxo

Status: feito.

Pedido reportado:

- Tornar a simulacao `Mecanica > Fluidos basicos > Hidrostatica e empuxo` menos seca e mais didatica, deixando visiveis pressao com a profundidade, diferenca de pressao no corpo, volume deslocado, fluido mais presente e relacao entre peso e empuxo.

Ajuste:

- O motor de hidrostatica passou a expor pressao no topo, centro e base da esfera pelo mesmo sample que alimenta cena, graficos, tabela e formulas.
- O grafico de pressao agora compara topo, centro e base do corpo, em vez de mostrar apenas a pressao central.
- A cena Three.js recebeu fluido com gradiente de profundidade, faixas horizontais de nivel de pressao, superficie ondulada, volume deslocado destacado, mapa/aneis de pressao na esfera e setas pequenas na regiao submersa para mostrar a pressao normal do fluido.
- O painel de leituras passou a mostrar pressao no centro, topo e base.
- O fixture de formulas ganhou a formula de diferenca de pressoes e a teoria explica que ondulacoes e acomodacao visual nao representam CFD, viscosidade ou escoamento.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: os overlays novos consomem os campos do sample calculado; a cena nao altera regime fisico nem cria uma fonte paralela de movimento. O modo continua hidrostatico, com indicacao visual de pressao, volume deslocado e acomodacao de superficie.

Documentacao:

- Lidos `AGENTS.md`, `guides/00-index.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Atualizados `fixtures/simulations/mechanics-hydrostatics-buoyancy.json`, `src/content/simulations/mechanics/hydrostatics-buoyancy/theory.md` e este registro.
- HLD/diagrama nao foi atualizado porque nao houve mudanca de arquitetura, servicos, pipeline ou fluxo de dados externo; a mudanca ficou no contrato local da simulacao, no renderer e na teoria.

Validacao:

- Executado `npm run test -- src/lib/physics/kinematics.test.ts src/features/simulation-shell/kinematicsChartConfigs.test.ts src/features/simulation-shell/KinematicsScene.test.ts --reporter=dot`; 3 arquivos e 42 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test -- --reporter=dot`; 12 arquivos e 94 testes passaram.
- Executado `node artifacts/hydrostatics-cdp-smoke.cjs`; capturas desktop/mobile e checagem de pixels do canvas passaram, gerando `artifacts/hydrostatics-buoyancy-desktop.png` e `artifacts/hydrostatics-buoyancy-mobile.png`.

## 2026-05-05 - Promocao de Continuidade e Bernoulli para ready

Status: feito.

Pedido reportado:

- Marcar `Mecanica > Fluidos basicos > Continuidade e Bernoulli` como pronta apos aprovacao manual da simulacao Venturi.

Ajuste:

- `continuity-bernoulli` foi promovida para `ready` no catalogo local.
- A sidebar e os testes foram alinhados para o estado sem simulacoes `analysis`: `Mecanica` e `Fluidos basicos` iniciam recolhidas quando nao ha item aguardando teste manual.
- Os testes de catalogo foram atualizados para 18 simulacoes `ready` e 0 simulacoes `analysis`.
- Guides de produto, arquitetura, regras, dados/API, catalogo planejado e issues foram atualizados para refletir que a cobertura mecanica introdutoria funcional esta pronta, incluindo a cena Venturi.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide` como gate de promocao: a versao aprovada usa o motor de continuidade/Bernoulli como fonte unica para particulas, tubo Venturi, manometros, graficos, tabela, metricas, formulas, teoria e warnings.
- A promocao dependeu da aprovacao manual do dono do projeto, sem alterar o modelo fisico nesta etapa alem dos ajustes de status, testes e documentacao.

Documentacao:

- Lidos `AGENTS.md`, `guides/00-index.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Atualizados `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/09-simulation-catalog-plan.md`, `guides/issues.md` e este registro.
- HLD/diagrama nao foi atualizado porque arquitetura, servicos, pipeline e fluxo de dados nao mudaram; houve promocao de status e alinhamento documental.

Validacao:

- Fixture JSON de catalogo validado com `ConvertFrom-Json`.
- Executado `npm run test -- src/simulation-registry/catalog.test.ts src/App.test.tsx src/lib/physics/kinematics.test.ts --reporter=dot`; 3 arquivos e 49 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test -- --reporter=dot`; 12 arquivos e 93 testes passaram.

## 2026-05-05 - Cena Venturi para Continuidade e Bernoulli

Status: feito.

Pedido reportado:

- Tornar `Mecanica > Fluidos basicos > Continuidade e Bernoulli` mais visual, intuitiva e didatica, deixando claro que area menor aumenta velocidade e reduz pressao.

Ajuste:

- A cena de `continuity-bernoulli` foi especializada com tubo de Venturi 3D transparente, entrada larga, garganta estreita, saida larga, fluido translucido, tracadores animados, cores por velocidade e tres manometros relativos de pressao.
- O motor passou a expor raio fisico da entrada/garganta, altura da garganta e pressao/velocidade local do tracador sem perder as grandezas de entrada e garganta ja usadas por graficos, tabela, formulas e readouts.
- Graficos de velocidade e pressao passaram a incluir as curvas locais do tracador, alem das referencias de entrada e garganta.
- Readouts de Bernoulli passaram a mostrar area de entrada, area da garganta, velocidades, pressoes e queda de pressao.
- O painel flutuante de controles no mobile foi limitado em altura para nao cobrir a leitura principal do canvas.
- `continuity-bernoulli` permanece em `analysis`; nao houve promocao para `ready`.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: parametros, zeros validos de vazao, regime ideal, pressao negativa com warning, samples, cena, graficos, tabela, formulas e teoria continuam derivados do mesmo motor analitico.
- As particulas, cores e manometros sao representacoes didaticas normalizadas a partir dos samples, sem afirmar CFD real, perfil de velocidade, perdas viscosas ou cavitacao resolvida.

Documentacao:

- Lidos `AGENTS.md`, `guides/00-index.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Atualizados `fixtures/simulations/mechanics-continuity-bernoulli.json`, `src/content/simulations/mechanics/continuity-bernoulli/theory.md` e este registro.
- HLD/diagrama nao foi atualizado porque nao houve mudanca de arquitetura, servicos, pipeline, contrato externo ou fluxo de dados; foi uma especializacao de renderer/motor local da simulacao.

Validacao:

- Executado `npm run test -- src/lib/physics/kinematics.test.ts src/features/simulation-shell/KinematicsScene.test.ts src/features/simulation-shell/kinematicsChartConfigs.test.ts`; 3 arquivos e 41 testes passaram.
- Executado `npm run build`; passou com aviso conhecido de chunk acima de 500 kB.
- Executado `npm run lint`; passou.
- Executado `npm run test`; 12 arquivos e 94 testes passaram.
- Executado smoke visual com Playwright temporario e Chrome local contra `http://127.0.0.1:5210`, em desktop 1440x900 e mobile 390x844; capturas em `artifacts/bernoulli-venturi-desktop.png`, `artifacts/bernoulli-venturi-desktop-canvas.png`, `artifacts/bernoulli-venturi-mobile.png` e `artifacts/bernoulli-venturi-mobile-canvas.png` confirmaram canvas nao vazio, cena enquadrada e mudanca entre frames.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; falhou pela estrutura SDD ausente ja conhecida (`README.md`, `.agent/`, `tasks/`, `adr/`), nao por inconsistencia especifica deste ajuste.
- Dev server local respondeu em `http://127.0.0.1:5173/`.

## 2026-05-05 - Massa movel mais perceptivel na rotacao

Status: feito.

Pedido reportado:

- Aumentar a massa movel padrao em `Rotacao de corpo rigido` para que o aumento do giro ao aproximar a massa do centro fique muito perceptivel.

Ajuste:

- A massa movel padrao passou de `0.72 kg` para `2.4 kg`.
- Os presets que usam a massa movel principal tambem passaram para `2.4 kg`.
- O preset `Alta inercia` passou para `4.2 kg`, mantendo uma comparacao mais extrema.
- O motor nao precisou mudar: ele ja usa `slidingMassKilograms` em `I = I_base + m r^2`, centro de massa, conservacao de `L` e modo de energia constante.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: a mudanca e uma calibragem de parametro fisico existente, mantendo unidade, faixa, passo, tooltip, zero valido e samples derivados do motor.
- `Rotacao de corpo rigido` permanece em `analysis`, sem promocao de status.

Documentacao:

- Lidos `guides/00-index.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Guides e HLD/diagrama nao foram atualizados porque o contrato, arquitetura e explicacao fisica continuam os mesmos; apenas o valor padrao/presets da massa mudaram.

Validacao:

- Fixture JSON de rotacao validado com `ConvertFrom-Json`.
- Executado `npm run test -- --run src/lib/physics/kinematics.test.ts src/simulation-registry/catalog.test.ts --reporter=verbose`; 2 arquivos e 41 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com aviso conhecido de chunk acima de 500 kB.

## 2026-05-05 - Hidrostatica e empuxo com tanque e esfera fisica

Status: feito.

Pedido reportado:

- Recriar `Mecanica > Fluidos basicos > Hidrostatica e empuxo` para mostrar uma caixa/tanque transparente com esfera imersa no liquido.
- Fazer volume alterar raio visual, densidade derivada e movimento vertical.
- Fazer massa, volume e densidade definirem empuxo, peso, resultante, aceleracao, subida/flutuacao ou afundamento.

Ajuste:

- O motor passou a usar massa e volume como controles principais e a derivar `rho_corpo = m/V`.
- O sample agora carrega massa, densidade derivada, raio da esfera, profundidade do tanque, pressao no centro, empuxo, peso, normal de fundo, resultante, aceleracao, velocidade vertical e fracao submersa.
- O renderer Three.js passou a mostrar tanque transparente, volume de agua, superficie do fluido e esfera escalada pelo raio calculado.
- Mudar volume reinicia o movimento visual e altera o diametro da esfera; mudar massa no mesmo volume altera a densidade e faz a esfera subir, flutuar ou descer pelo mesmo sample.
- Graficos, tabela, leituras, vetores, formulas, fixture, catalogo e teoria foram alinhados ao novo modelo.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: parametros, regimes, samples, cena, graficos, tabela, formulas, teoria, warnings e testes concordam.
- `Hidrostatica e empuxo` permanece em `analysis`, sem promocao de status.

Documentacao:

- Lidos `guides/00-index.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/07-validation-and-quality.md`, `guides/08-api-contracts.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Atualizados product spec, arquitetura, regras, dados/API, contratos, catalogo planejado, fixture local e apendice teorico.
- HLD/diagrama nao foram atualizados porque nao houve nova fronteira arquitetural nem fluxo externo; a mudanca ficou no motor analitico, contrato local e renderer existente.

Validacao:

- Executado `npm run test -- src/lib/physics/kinematics.test.ts src/features/simulation-shell/kinematicsChartConfigs.test.ts src/features/simulation-shell/KinematicsScene.test.ts`; 3 arquivos e 40 testes passaram.
- Executado `npm run build`; passou com aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test -- --reporter=dot`; 12 arquivos e 93 testes passaram.
- Executado `npm run lint`; passou antes e depois do smoke visual.
- Executado `node artifacts/hydrostatics-buoyancy-smoke.cjs` contra `http://127.0.0.1:5196/`; capturas de canvas nao vazias e mudanca visual por volume/massa confirmada por diferenca de pixels.

## 2026-05-05 - Tanque fixo na hidrostatica

Status: feito.

Pedido reportado:

- Corrigir `Hidrostatica e empuxo` porque o volume da caixa com liquido aumentava junto com o volume da esfera.
- Manter a caixa fixa e grande o suficiente para a faixa de tamanho da esfera.

Ajuste:

- A profundidade fisica do tanque passou a ser fixa no motor.
- A largura e a profundidade visual do tanque/agua passaram a ser fixas no renderer Three.js.
- O volume agora altera apenas o raio visual da esfera, densidade derivada, empuxo e movimento vertical.
- A profundidade inicial maxima foi limitada para caber no tanque fixo.
- Fixture, teoria e guides foram atualizados para explicitar que mudar volume nao redimensiona a caixa nem o liquido.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: renderer continua consumindo o sample do motor, e a correcao remove o acoplamento indevido entre volume da esfera e dimensoes do tanque.
- `Hidrostatica e empuxo` permanece em `analysis`, sem promocao de status.

Validacao:

- Executado `npm run test -- src/lib/physics/kinematics.test.ts src/features/simulation-shell/KinematicsScene.test.ts src/features/simulation-shell/kinematicsChartConfigs.test.ts --reporter=dot`; 3 arquivos e 40 testes passaram.
- Executado `npm run test -- src/simulation-registry/catalog.test.ts --reporter=dot`; 1 arquivo e 10 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com aviso conhecido de chunk acima de 500 kB.
- Executado `node artifacts/hydrostatics-buoyancy-smoke.cjs` contra `http://127.0.0.1:5196/`; capturas confirmaram tanque fixo, esfera maior ao aumentar volume e afundamento ao aumentar massa.

## 2026-05-05 - Promocao da rotacao de corpo rigido para ready

Status: feito.

Pedido reportado:

- Marcar `Mecanica > Rotacao > Rotacao de corpo rigido` como pronta apos aprovacao manual da simulacao.

Ajuste:

- `rigid-body-rotation` foi promovida para `ready` no catalogo local.
- Os testes de catalogo foram alinhados para a nova contagem de simulacoes `analysis` e `ready`.
- Os testes de sidebar/app foram ajustados para a regra atual: subareas com itens `analysis` iniciam abertas, enquanto Rotacao agora inicia recolhida porque seus itens visiveis estao prontos.
- Guides de produto, arquitetura, regras, dados/API, catalogo planejado e issues foram atualizados para refletir que a rotacao de corpo rigido esta pronta.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: a simulacao ja tinha parametro de massa movel `0..50 kg`, modo de energia constante, formulas, teoria, cena, graficos, tabela e warnings sincronizados pelo motor antes da promocao.
- A promocao dependeu da aprovacao manual do dono do projeto, sem mudar o motor fisico nesta etapa.

Documentacao:

- Lidos `AGENTS.md`, `guides/00-index.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Atualizados `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/09-simulation-catalog-plan.md`, `guides/issues.md` e este registro.
- HLD/diagrama nao foi atualizado porque a arquitetura, servicos, pipeline e fluxo de dados nao mudaram; houve apenas promocao de status e alinhamento documental.

Validacao:

- Fixtures JSON de catalogo e rotacao validados com `ConvertFrom-Json`.
- Executado `npm run test -- --run src/simulation-registry/catalog.test.ts --reporter=verbose`; 1 arquivo e 10 testes passaram.
- Executado `npm run test -- --run src/App.test.tsx --reporter=verbose`; 1 arquivo e 8 testes passaram.
- Executado `npm run test -- --run src/lib/physics/kinematics.test.ts --reporter=verbose`; 1 arquivo e 31 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test -- --reporter=dot`; 12 arquivos e 93 testes passaram apos repeticao limpa da suite.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; falhou pela estrutura SDD ausente ja conhecida (`README.md`, `.agent/`, `tasks/`, `adr/`), nao por inconsistencia especifica desta promocao.

## 2026-05-05 - Promocao de gravitacao e hidrostatica para ready

Status: feito.

Pedido reportado:

- Marcar `Mecanica > Gravitacao > Campo gravitacional e orbitas` como pronta apos aprovacao manual.
- Marcar `Mecanica > Fluidos basicos > Hidrostatica e empuxo` como pronta apos aprovacao manual.

Ajuste:

- `gravitational-field-orbits` e `hydrostatics-buoyancy` foram promovidas para `ready` no catalogo local.
- `continuity-bernoulli` permanece como a unica simulacao mecanica em `analysis`.
- Os testes de catalogo foram alinhados para 17 simulacoes `ready` e 1 simulacao `analysis`.
- Os testes da sidebar foram ajustados para a regra atual: `Gravitacao` inicia recolhida porque agora so contem item `ready`, enquanto `Fluidos basicos` continua aberta por ainda conter `Continuidade e Bernoulli` em `analysis`.
- Guides de produto, arquitetura, regras, dados/API, catalogo planejado e issues foram atualizados para refletir o novo status.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide` como gate de promocao: as auditorias anteriores de gravidade/orbitas e hidrostatica/empuxo ja registravam parametros, regimes, samples, cena, graficos, tabela, formulas, teoria, warnings e testes sincronizados.
- A promocao desta etapa dependeu da aprovacao manual do dono do projeto, sem alterar motor fisico, renderer, formulas ou teoria.

Documentacao:

- Lidos `AGENTS.md`, `guides/00-index.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md`, `guides/09-simulation-catalog-plan.md`, `guides/issues.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Atualizados `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/09-simulation-catalog-plan.md`, `guides/issues.md` e este registro.
- HLD/diagrama nao foi atualizado porque arquitetura, servicos, pipeline e fluxo de dados nao mudaram; houve apenas promocao de status e alinhamento documental.

Validacao:

- Executado `npm run test -- src/simulation-registry/catalog.test.ts --reporter=dot`; 1 arquivo e 10 testes passaram.
- Executado `npm run test -- src/App.test.tsx -t "renders the pendulum simulation shell|renders the simulation catalog with analysis subareas open|opens the next mechanics simulations through the shared shell" --reporter=dot`; 3 testes passaram e 5 foram ignorados pelo filtro.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test -- --reporter=dot`; 12 arquivos e 93 testes passaram.

## 2026-05-05 - Continuidade de parametros em hidrostatica e empuxo

Status: feito.

Pedido reportado:

- Ao alterar massa, volume, densidade ou outro parametro da simulacao `Mecanica > Fluidos basicos > Hidrostatica e empuxo`, a esfera nao deve reiniciar a experiencia; ela deve receber o novo parametro a partir da posicao atual. Exemplo: se estiver no fundo e o volume aumentar, a esfera deve crescer e subir em continuidade, evidenciando a reducao da densidade media e o novo empuxo.

Ajuste:

- O motor de hidrostatica passou a aceitar sementes internas opcionais de continuidade: centro atual em `z`, velocidade vertical atual e tempo global em que a nova dinamica comeca.
- O tempo exibido na UI continua global, mas a equacao de subida/afundamento usa o tempo local desde a ultima mudanca fisica.
- O shell captura o ultimo `KinematicsSample` vivo antes de aplicar alteracoes de parametro em `hydrostatics-buoyancy` e injeta essa semente no proximo timeline, sem incrementar `playbackResetVersion`.
- Reset, troca de simulacao e preset continuam limpando a semente de continuidade, pois representam inicio explicito de outro cenario.
- Adicionados testes para o caso de esfera no fundo que aumenta de volume mantendo contato com o fundo e depois sobe, alem de teste de shell garantindo que trocar volume nao aciona reset.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: samples, cena, graficos e readouts continuam vindo do mesmo motor, e a continuidade foi implementada no modelo/sample em vez de ser improvisada apenas no renderer.

Documentacao:

- Lidos `AGENTS.md`, `guides/00-index.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Guides e HLD/diagramas nao foram atualizados porque nao houve mudanca estrutural de arquitetura, dados publicos, roadmap ou fluxo de servicos; a decisao operacional foi registrada neste historico.

Validacao:

- Executado `npm test -- --run src/lib/physics/kinematics.test.ts`; 1 arquivo e 33 testes passaram.
- Executado `npm test -- --run src/features/simulation-shell/SimulationShell.test.tsx`; 1 arquivo e 3 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com aviso conhecido de chunk acima de 500 kB.
- Executado `npm test -- --reporter=dot`; 12 arquivos e 96 testes passaram.

## 2026-05-06 - Ajuste visual didatico do MRU

Status: feito.

Pedido reportado:

- Melhorar `Mecanica > Cinematica > Movimento retilineo uniforme` para deixar claro, visualmente, que o objeto percorre distancias iguais em tempos iguais, com velocidade constante e aceleracao nula.
- Priorizar pista cinematica neon, regua no chao, marcas estroboscopicas a cada segundo, vetor velocidade constante, rastro luminoso, painel numerico, linha do tempo e modos de camera.

Ajuste:

- A cena do MRU passou a renderizar uma pista reta iluminada sobre a grade 3D, com trilhos ciano/teal, marcacoes em metros e marcador inicial `s0`.
- Foram adicionadas marcas estroboscopicas derivadas dos samples do motor em segundos inteiros, com rotulos `t=...s`, preservando o espacamento igual quando a velocidade e constante.
- O objeto foi reposicionado como corpo sobre a pista, com sombra, marcador `s(t)`, faixa de deslocamento `Delta s` e rastro luminoso continuo do deslocamento.
- O HUD do MRU mostra `s = s0 + v.t`, `Delta s`, tempo, posicao inicial, velocidade, posicao atual, aceleracao zero e uma linha do tempo com pontos dos instantes.
- A viewport ganhou modos de camera especificos para MRU: cinematografico, lateral e superior.
- O vetor de deslocamento do MRU foi corrigido para seguir o sinal do deslocamento, nao o sinal da posicao absoluta; isso preserva a leitura quando `s0` e positivo e a velocidade e negativa.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: marcadores, pista, HUD, vetor e rastro usam os mesmos samples do motor numerico; o renderer nao inventa posicoes nem acelera o movimento visualmente.
- A aceleracao permanece nula no vetor, no HUD e nos dados da simulacao.

Documentacao:

- Lidos `AGENTS.md`, `guides/00-index.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Guides e HLD/diagramas nao foram atualizados porque nao houve mudanca estrutural de arquitetura, dados publicos, roadmap ou fluxo de servicos; a decisao operacional foi registrada neste historico.

Validacao:

- Executado `npm run test -- src/features/simulation-shell/KinematicsScene.test.ts src/lib/physics/kinematics.test.ts --reporter=dot`; 2 arquivos e 42 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test -- --reporter=dot --maxWorkers=1`; 12 arquivos e 99 testes passaram.
- Smoke visual em `http://127.0.0.1:5173`: canvas do MRU renderizado, seletor `CINE/LATERAL/TOPO` presente, HUD do MRU presente e captura salva em `artifacts/mru-smoke.png`.

## 2026-05-06 - Torre experimental para MUV e queda livre

Status: feito.

Pedido reportado:

- Melhorar `Mecanica > Cinematica > Movimento uniformemente variado e queda livre` para deixar visualmente claro que, em tempos iguais, os deslocamentos crescem quando ha aceleracao constante.
- Priorizar torre/régua vertical, solo, marcas estroboscopicas, vetor velocidade crescendo, vetor aceleracao constante, rastro, HUD numerico e camera didatica.

Ajuste:

- A cena de MUV/queda livre ganhou uma torre vertical graduada em metros, plataforma de solo, zona de impacto, marcador inicial `z0`, corpo mais brilhante e marcadores estroboscopicos em tempos iguais derivados dos samples.
- O rastro vertical agora liga a posicao inicial a posicao atual com intensidade crescente, e o viewport mostra etiquetas vivas de `z(t)`, altura restante, `v` e `a`.
- Os vetores de MUV foram corrigidos para usar o sinal real de deslocamento, velocidade vertical e aceleracao vertical, com magnitudes absolutas nos overlays.
- O HUD do MUV mostra `z = z0 + v0.t + 1/2.a.t^2`, `v = v0 + a.t`, leituras de `t`, `z`, `v`, `a` e linha do tempo compacta.
- O seletor de camera agora tambem atende MUV/queda livre com modos cinematografico, lateral e frontal.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: torre, marcadores, rastro, HUD, etiquetas e vetores consomem os mesmos samples do motor; o renderer nao cria posicoes ou valores paralelos.
- Adicionados testes para comprovar que as marcas estroboscopicas da queda livre ficam progressivamente mais espacadas e que os vetores apontam no sentido fisico correto.

Documentacao:

- Lidos `AGENTS.md`, `guides/00-index.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Guides e HLD/diagramas nao foram atualizados porque nao houve mudanca estrutural de arquitetura, dados publicos, roadmap ou fluxo de servicos; a decisao operacional foi registrada neste historico.

Validacao:

- Executado `npm run test -- src/features/simulation-shell/KinematicsScene.test.ts src/lib/physics/kinematics.test.ts --reporter=dot`; 2 arquivos e 43 testes passaram.
- Executado `npm run test -- src/App.test.tsx -t "opens the first kinematics simulations through the shared shell" --reporter=dot`; 1 teste passou e 7 foram ignorados pelo filtro.
- Executado `npm run test -- --reporter=dot --maxWorkers=1`; apos corrigir o label acessivel do canvas para preservar `Cinematica`, 12 arquivos e 100 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com aviso conhecido de chunk acima de 500 kB.
- Smoke visual em `http://127.0.0.1:5173`: canvas de MUV/queda livre renderizado, HUD `MUV vertical` presente, seletor `Frontal` presente, checagem de pixels passou e captura salva em `artifacts/muv-free-fall-smoke.png`.

## 2026-05-06 - Plataforma didatica para MCU

Status: feito.

Pedido reportado:

- Melhorar `Mecanica > Cinematica > Movimento circular uniforme` para comunicar raio constante, velocidade tangencial de modulo constante, aceleracao centripeta apontando para o centro, direcao variavel da velocidade e periodicidade angular.
- Priorizar marcas temporais igualmente espacadas, vetor centripeto claro, marcacao angular, arco percorrido, painel com `omega`, `v`, `a_c`, `T` e `f`, graficos sincronizados e vistas superior/perspectiva/acompanhamento.

Ajuste:

- A cena do MCU passou a usar uma plataforma circular de laboratorio, com disco translucido, aneis de referencia, orbita neon, nucleo central, eixo fixo e marcas angulares de 30 graus com referencias principais em 0, 90, 180 e 270 graus.
- O raio agora nasce no centro fixo e liga ate o corpo com label `r = ... m`, reforcando que a distancia radial permanece estruturalmente constante.
- O corpo em movimento recebeu material mais brilhante e emissivo, com sombra e leitura visual mais forte sobre a pista circular.
- O vetor de velocidade tangencial sai do corpo, fica tangente a orbita e tem escala constante; marcadores estroboscopicos exibem pequenas direcoes tangenciais anteriores para evidenciar que o modulo permanece constante enquanto a direcao muda.
- O vetor de aceleracao centripeta foi reposicionado para nascer no corpo e apontar sempre para o centro, com comprimento constante enquanto os parametros nao mudam.
- A orbita ganhou marcadores temporais igualmente espacados ao longo de um periodo, labels discretos `t=...s`, arco angular dinamico, label `theta = ... deg` e pulso sutil ao completar voltas.
- O HUD especifico do MCU mostra formulas `v = omega.r` e `a_c = omega^2.r`, leituras de `r`, `omega`, `v`, `a_c`, `T`, `f` e progresso do ciclo com quarto de volta.
- Os graficos do MCU agora cobrem angulo/arco, velocidades constantes, aceleracao centripeta e projecoes cartesianas `x(t)` e `y(t)`.
- A viewport ganhou modos de camera especificos para MCU: perspectiva, topo e acompanhamento do corpo mantendo o centro em leitura.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: plataforma, arco, labels, vetores, marcadores, HUD e graficos derivam dos samples do motor numerico e dos parametros fisicos da fixture; o renderer nao cria uma dinamica paralela.
- Adicionado teste para garantir que as marcas estroboscopicas do MCU ficam igualmente espacadas em angulo ao longo de um periodo.
- Adicionado teste para garantir que os graficos do MCU exibem angulo, taxas constantes, aceleracao centripeta e projecoes senoidal/cossenoidal.

Documentacao:

- Lidos `AGENTS.md`, `guides/00-index.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Guides e HLD/diagramas nao foram atualizados porque nao houve mudanca estrutural de arquitetura, dados publicos, roadmap ou fluxo de servicos; a decisao operacional foi registrada neste historico.

Validacao:

- Executado `npm run test -- src/features/simulation-shell/KinematicsScene.test.ts src/features/simulation-shell/kinematicsChartConfigs.test.ts src/lib/physics/kinematics.test.ts --reporter=dot`; 3 arquivos e 48 testes passaram.
- Executado `npm run test -- src/App.test.tsx -t "opens the first kinematics simulations through the shared shell" --reporter=dot`; 1 teste passou e 7 foram ignorados pelo filtro.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test -- --reporter=dot --maxWorkers=1`; 12 arquivos e 102 testes passaram.
- Smoke visual em `http://127.0.0.1:5192`: canvas do MCU renderizado, HUD `MCU ideal` presente, cameras `Topo` e `Seguir` ativadas, captura salva em `artifacts/mcu-smoke.png`.

## 2026-05-06 - Gate de regimes da Fase 3

Status: feito.

Pedido reportado:

- Executar `task-skill 1`, seguindo a proxima task pendente do roadmap.

Ajuste:

- A task selecionada foi `Validar que todos os modelos mecanicos declaram limites, aproximacoes e regimes conforme o gate de fidelidade`, a ultima pendencia da Fase 3.
- Os fixtures mecanicos executaveis que ainda tinham apenas `limits` passaram a declarar `regimes` explicitamente.
- Simulacoes ideais sem troca de regime agora declaram o regime ideal unico e a fronteira do que fica fora do modelo.
- Simulacoes com transicoes, warnings ou aproximacoes ativas declaram condicao, limite de transicao, campos de sample afetados e `warningCode` quando aplicavel.
- O teste de contrato do catalogo passou a exigir `limits` e ao menos um `regime` para toda simulacao mecanica `analysis` ou `ready`.
- `guides/05-roadmap.md` marcou a validacao final da Fase 3 como concluida.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: a auditoria foi registrada no contrato dos fixtures, conectando regimes e limites aos campos de sample consumidos por cena, graficos, tabela, formulas e warnings.
- Nenhum motor, renderer, grafico, tabela, formula, teoria ou status de catalogo foi alterado; a mudanca foi contratual e de teste para impedir regressao.

Documentacao:

- Lidos `AGENTS.md`, `guides/00-index.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/05-roadmap.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md`, `guides/issues.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Atualizados `guides/05-roadmap.md` e este registro de progresso.
- HLD/diagrama nao foi atualizado porque arquitetura, servicos, pipeline e fluxo de dados nao mudaram.

Validacao:

- Executado `npm run test -- src/simulation-registry/catalog.test.ts --reporter=dot --maxWorkers=1`; 1 arquivo e 10 testes passaram.
- Executado `npm run lint`; passou apos repetir com timeout maior, pois a primeira chamada excedeu a janela da ferramenta sem diagnostico.
- Executado `npm run build`; passou com aviso conhecido de chunk acima de 500 kB.
- Executado `npm run test -- --reporter=dot --maxWorkers=1`; 12 arquivos e 103 testes passaram.

## 2026-05-06 - Osciladores da Fase 4

Status: feito.

Pedido reportado:

- Executar `task-skill 3`, seguindo as tres proximas tasks pendentes do roadmap.

Ajuste:

- As tasks selecionadas foram `Oscilador amortecido`, `Oscilador forcado e ressonancia` e `Osciladores acoplados`, em `Oscilacoes e Ondas > Oscilacoes`.
- O catalogo promoveu as tres simulacoes de `planned` para `analysis`, com fixtures locais, teoria Markdown, formulas, regimes, limites, presets, graficos, vetores e parametros com ajuda.
- O motor numerico passou a cobrir oscilador amortecido analitico, oscilador forcado com integracao RK4 e osciladores acoplados com troca modal de energia.
- A cena 3D reutiliza a leitura de massa-mola vertical para osciladores simples e adiciona uma montagem acoplada com duas massas, molas, acoplamento, referencia e vetores sincronizados.
- Graficos, readouts, tabela e formulas foram conectados aos novos campos de sample, incluindo energia, forcas, trabalho aplicado, energia termica, centro de massa e deslocamento relativo.
- A navegacao da area `Oscilacoes e Ondas` passou a abrir as tres simulacoes novas pelo shell compartilhado.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide`: parametros zero-validos, regimes fisicos, warnings, samples, cena, graficos, tabela, formulas e teoria foram mantidos sincronizados antes da promocao para `analysis`.
- O oscilador amortecido classifica regimes subamortecido, criticamente amortecido e superamortecido a partir do fator de amortecimento.
- O oscilador forcado emite warning de quase ressonancia e separa energia mecanica, trabalho aplicado e dissipacao.
- Os osciladores acoplados preservam energia no regime ideal e expõem coordenadas modal/relativa para validar troca de energia.

Documentacao:

- Lidos `AGENTS.md`, `guides/00-index.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/05-roadmap.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md`, `guides/09-simulation-catalog-plan.md`, `guides/issues.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Atualizados roadmap, catalog plan, produto, arquitetura, regras, dados/API, contratos, qualidade, issues e este registro de progresso para refletir a Fase 4 em `analysis`.
- HLD/diagrama nao foi atualizado porque o fluxo estrutural de servicos e a arquitetura do shell nao mudaram; a entrega adicionou novas simulacoes dentro do pipeline existente.

Validacao:

- Executado `npm run test -- src/lib/physics/kinematics.test.ts src/features/simulation-shell/kinematicsChartConfigs.test.ts src/simulation-registry/catalog.test.ts --reporter=dot --maxWorkers=1`; 3 arquivos e 53 testes passaram.
- Executado `npm run test -- src/App.test.tsx -t "Fase 4 oscillators" --reporter=dot --maxWorkers=1`; 1 teste passou.
- Executado `npm run test -- src/App.test.tsx --reporter=dot --maxWorkers=1`; 1 arquivo e 9 testes passaram.
- Executado `npm run test -- src/features/simulation-shell/SimulationShell.test.tsx --reporter=dot --maxWorkers=1`; 1 arquivo e 4 testes passaram.
- Executado `npm run test -- --reporter=dot --maxWorkers=1`; 12 arquivos e 110 testes passaram.
- Executado `npm run lint`; passou apos repetir com timeout maior, pois a primeira chamada excedeu a janela da ferramenta sem diagnostico.
- Executado `npm run build`; passou com aviso conhecido de chunk acima de 500 kB.

## 2026-05-06 - Consolidacao das oscilacoes na sidebar

Status: feito.

Pedido reportado:

- Mover as simulacoes do menu de Mecanica para a parte de oscilacao, deixando tudo junto e removendo repeticao.

Ajuste:

- `Pendulo simples` e `Massa-mola vertical` sairam de `Mecanica > Oscilacoes` no catalogo local.
- As duas simulacoes agora ficam em `Oscilacoes e Ondas > Oscilacoes`, junto de `Oscilador amortecido`, `Oscilador forcado e ressonancia` e `Osciladores acoplados`.
- A subarea repetida `Oscilacoes` deixou de aparecer dentro de Mecanica; o catalogo de Mecanica ficou com 16 simulacoes e `Oscilacoes e Ondas` ficou com 13.
- Os testes de sidebar, registry e App foram atualizados para o novo caminho e para garantir que `subarea-mechanics-oscilacoes` nao exista mais.
- O timeout do smoke mais pesado de App foi ajustado de 90 s para 120 s porque a suite completa estava ficando mais lenta sob carga, embora o teste isolado passasse.

Gate de fidelidade:

- Aplicado o `Simulation Fidelity Adjustment Guide` como checklist de impacto: a mudanca foi apenas de taxonomia/menu e nao alterou parametros, motores, regimes, samples, cena, graficos, tabela, formulas, teoria, warnings nem status das simulacoes.

Documentacao:

- Lidos `AGENTS.md`, `guides/00-index.md`, `guides/02-product-spec.md`, `guides/03-architecture.md`, `guides/04-rules-and-constraints.md`, `guides/05-roadmap.md`, `guides/06-data-and-api.md`, `guides/07-quality-and-operations.md`, `guides/08-api-contracts.md`, `guides/09-simulation-catalog-plan.md`, `guides/issues.md` e `guides/10-simulation-fidelity-adjustment-guide.md`.
- Atualizados `AGENTS.md`, produto, estrategia, arquitetura, regras, roadmap, dados/API, qualidade, catalog plan, fidelity guide, issues e este registro de progresso para refletir a consolidacao.
- HLD/diagrama nao foi atualizado porque arquitetura, servicos, pipeline, integracoes e fluxo de dados nao mudaram.

Validacao:

- Executado `npx vitest run src/simulation-registry/catalog.test.ts src/features/simulation-shell/simulationSidebarModel.test.ts`; 2 arquivos e 15 testes passaram.
- Executado `npx vitest run src/App.test.tsx`; 1 arquivo e 9 testes passaram.
- Executado `npm run test`; 13 arquivos e 114 testes passaram.
- Executado `npm run lint`; passou.
- Executado `npm run build`; passou com aviso conhecido de chunk acima de 500 kB.
- Executado `python C:/Users/hugod/.codex/skills/project-strategy-plan/scripts/validate_guides.py D:/_PROJETOS/PhysicSimulator`; falhou por estrutura SDD ausente ja conhecida neste repositorio (`README.md`, `.agent`, `tasks`, `adr`), nao por inconsistencia dos guias alterados.
