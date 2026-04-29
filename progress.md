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
- Dev server aberto em `http://127.0.0.1:5192/`.
- Smoke visual headless com Chrome/CDP: Atwood renderizou canvas nao vazio com 12176 pixels nao-background e 3960 pixels diferentes entre frames; curva com `mu = 0` exibiu status `saiu da curva`, canvas nao vazio com 78893 pixels nao-background e 1006 pixels diferentes entre frames.
- Capturas geradas em `artifacts/atwood-format-fixed-canvas-a.png`, `artifacts/atwood-format-fixed-canvas-b.png`, `artifacts/centripetal-zero-friction-visible-canvas-a.png` e `artifacts/centripetal-zero-friction-visible-canvas-b.png`.
