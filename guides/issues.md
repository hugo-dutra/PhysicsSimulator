# Issues, Risks And Open Premises

## Riscos da prova core

- A sincronizacao entre animacao, graficos, tabela e teoria pode ficar complexa se o estado nao tiver uma fonte unica.
- Three.js e Plotly.js juntos podem pesar no bundle se forem importados sem cuidado.
- O pendulo pode parecer simples demais se nao incluir vetores, energia e graficos suficientes para provar a proposta.
- Um tema dark mal calibrado pode prejudicar leitura de formulas e tabelas.
- Formulas podem virar conteudo decorativo se nao forem ligadas aos parametros, samples, graficos e limites do modelo.
- Expandir para fluidos e magnetismo cedo demais pode diluir o foco antes de validar o shell.
- O catalogo curricular amplo pode virar promessa excessiva se simulacoes planejadas nao forem visualmente separadas das simulacoes em analise e prontas.
- Bibliotecas opcionais podem aumentar complexidade se forem adicionadas antes de uma simulacao concreta exigir.

## Premissas nao validadas

- Usuarios preferem uma experiencia integrada a ferramentas separadas.
- MUI entrega densidade e polish suficientes para uma interface cientifica.
- Three.js e suficiente como renderizador principal para as primeiras simulacoes.
- Plotly.js cobre a maior parte dos graficos cientificos declarativos; series progressivas em tempo real podem exigir canvas/SVG com `requestAnimationFrame`.
- MDX/Markdown com KaTeX e suficiente para o apendice teorico inicial.
- Um guia de formulas por simulacao ajuda o usuario a saber como e quando aplicar as equacoes.
- A taxonomia `Mecanica`, `Termodinamica`, `Oscilacoes e Ondas` e `Eletromagnetismo` cobre bem a fisica basica inicial.
- `topicPath` e suficiente para representar subareas como Cinematica, Dinamica, Estatica, Circuitos e Optica sem criar rotas complexas cedo demais.

## Decisoes registradas

- O primeiro core sera o pendulo simples; no menu atual, fica em `Oscilacoes e Ondas > Oscilacoes > Pendulo simples`.
- O catalogo planejado usa quatro areas principais: `Mecanica`, `Termodinamica`, `Oscilacoes e Ondas` e `Eletromagnetismo`.
- `Fluidos basicos` entra como subarea planejada, nao como area principal antes da prova do core.
- Eletricidade e magnetismo ficam agrupados em `Eletromagnetismo`.
- O tema inicial usa `#2DD4BF` como cor primaria teal e `#38BDF8` como cor informativa/cyan.
- O apendice teorico inicial do pendulo e renderizado como Markdown local com KaTeX abaixo do guia de formulas; o guia de formulas permanece como bloco aplicado e ligado a parametros, samples, graficos e vetores.
- O padrao de renderizacao animada passa a ser renderer-first: `requestAnimationFrame` pertence ao renderer visual, o shell React recebe leituras periodicas e componentes pesados como Plotly, tabela, formulas e teoria ficam fora do caminho quente da animacao.
- Viewports Three.js seguem o padrao 3D orbitavel: eixo Z vertical, camera girando por arraste horizontal e vertical para yaw/pitch, zoom por Shift + scroll sobre o canvas em refs do renderer e objetos principais com volume quando isso melhora a leitura espacial.
- Viewports Three.js com grade mantem uma referencia visual de origem: eixos X/Y/Z coloridos e translucidos no canto inferior esquerdo do plano, com legenda fixa no canto superior esquerdo do canvas.
- Graficos, tabela, formulas e teoria devem seguir o padrao de bloco chevron recolhivel: quando recolhidos, desmontam o conteudo e suspendem processamento derivado em vez de apenas esconder a UI.
- Blocos chevron de saida pesada iniciam fechados por padrao e precisam alternar aberto/fechado ao clique no cabecalho.
- Viewport, graficos, tabela, formulas e apendice teorico seguem o padrao de painel maximizavel: apenas um fica em foco na janela, os demais paineis ficam invisiveis, e minimizar restaura o shell anterior sem perder sincronizacao.
- `fixtures/simulations/catalog.json` deve listar todas as simulacoes planejadas do catalogo curricular; simulacoes com motor, cena, graficos, tabela, formulas, teoria e validacao ficam como `analysis` ate teste manual, e so depois podem virar `ready`.
- A sidebar inicia abertas apenas as subareas com simulacoes em `analysis`; subareas apenas `ready` ou `planned` iniciam fechadas.
- `Oscilacoes e Ondas > Oscilacoes > Pendulo simples` fica como `ready` apos teste manual do dono do projeto.
- A fatia de `Massa-mola vertical` foi antecipada e marcada como `ready` apos aprovacao manual: suporte superior fixo, mola helicoidal, massa esferica e oscilacao vertical em torno do equilibrio. No menu atual, ela fica em `Oscilacoes e Ondas > Oscilacoes`, junto do pendulo e dos osciladores mais avancados.
- Tabelas sincronizadas em playback devem manter quantidade fixa de linhas visiveis para evitar piscadas e deslocamento de layout; slots sem amostra podem aparecer vazios ate haver dados suficientes.
- O pendulo simples deve expor, alem da velocidade angular, velocidade linear tangencial e aceleracoes tangencial/radial/total em graficos e tabela, calculadas no sample do motor.
- Vetores exibidos na cena devem ter legenda visivel com cor, modulo atual e significado fisico.
- Leituras instantaneas e legenda detalhada de vetores ficam no topo do viewport, acima do canvas, para que valores e significados antecedam a observacao da cena.
- A area de animacao tambem deve exibir legenda compacta dos vetores principais no canto superior direito, com traco na cor do vetor, grandeza representada e unidade abreviada quando houver.
- Graficos devem manter escala numerica visivel no eixo Y e legendas com nomes fisicos completos para as grandezas; unidades podem usar abreviacoes fisicas padrao como `rad/s`, `m/s`, `m/s^2` e `J`.
- Graficos temporais devem oferecer acao de olho para mover um unico grafico para um slot lateral direito dentro do viewport, preservando a mesma janela de samples e retornando ao bloco original quando a acao for desligada.
- `Mecanica > Dinamica > Plano inclinado com atrito` e a segunda simulacao `ready`, com fixture local, motor deterministico por regimes, cena Three.js, graficos live-canvas, tabela, formulas e teoria no mesmo shell.
- O runtime visual reutilizavel fica em `src/lib/rendering/visualRuntime.ts` e centraliza agendamento de frames, interpolacao de timeline e metricas simples, mantendo cada renderer dono dos seus objetos e buffers.
- `Mecanica > Cinematica` iniciou a Fase 3 com quatro simulacoes executaveis. Apos aprovacao manual, `Movimento retilineo uniforme`, `Movimento uniformemente variado e queda livre`, `Lancamento obliquo` e `Movimento circular uniforme` ficam como `ready`. Todas usam motor analitico compartilhado, cena Three.js 2.5D, live-canvas, tabela, formulas, teoria e fixtures locais.
- O segundo lote da Fase 3 mantem `Maquina de Atwood`, `Forca centripeta em curva` e `Trabalho e energia em trilho` como `ready`; `Trabalho e energia em trilho` foi aprovada manualmente apos ser alterada para rampa em U com perda percentual. Todas reutilizam o motor analitico compartilhado com campos extras de forca, tensao, atrito, trabalho, dissipacao, percentual de perda e limites de modelo.
- O terceiro lote da Fase 3 mantem `Colisoes 1D e 2D`, `Equilibrio de particula`, `Torque, alavancas e centro de massa` e `Rotacao de corpo rigido` como `ready`, ampliando o motor compartilhado com momento linear, impulso, componentes de forca, centro de massa, torque, momento de inercia e grandezas angulares.
- O quarto lote da Fase 3 mantem `Rolamento sem escorregamento`, `Campo gravitacional e orbitas`, `Hidrostatica e empuxo` e `Continuidade e Bernoulli` como `ready` apos aprovacao manual, ampliando o motor compartilhado com aderencia/escorregamento, campo gravitacional, pressao, vazao, empuxo, fracao submersa, visual Venturi e warnings de limite de modelo.
- `Oscilacoes e Ondas > Oscilacoes > Massa-mola vertical` fica como `ready`, ampliando o motor compartilhado com equilibrio estatico `mg/k`, forca elastica, energia elastica/gravitacional, mola helicoidal sincronizada e warning de amortecimento.
- `Oscilacoes e Ondas > Oscilacoes` concentra `Pendulo simples`, `Massa-mola vertical`, `Oscilador amortecido`, `Oscilador forcado e ressonancia` e `Osciladores acoplados`, usando fixtures locais, live-canvas, cenas Three.js de osciladores, regimes de amortecimento/ressonancia/acoplamento e teoria Markdown com KaTeX.
- Simulacoes `analysis` ou `ready` devem ser auditadas pelo guia `10-simulation-fidelity-adjustment-guide.md`: parametros fisicamente validos em zero nao devem ser bloqueados por conveniencia visual, falhas de restricao devem trocar o regime no motor, e toda task futura de simulacao deve registrar essa auditoria antes de ser considerada pronta.
- Em `Forca centripeta em curva`, atrito zero e valido. Quando `v^2/r > mu g`, o corpo deixa a curva ideal; com `mu = 0`, sai pela tangente em linha reta.
- Em `Maquina de Atwood`, a representacao visual deve seguir o formato didatico de suporte fixo, polia fixa, fio passando pelo arco superior e massas em blocos alinhadas aos trechos verticais.
- Em `Trabalho e energia em trilho`, a representacao visual deve seguir o formato de bancada de energia: rampa em U fixa, corpo alinhado a tangente local, rastro de perda e painel compacto de energia/perda derivados de `KinematicsSample`, sem inventar energia fora do motor.

## Decisoes pendentes

- Definir se a aplicacao deve ser apenas web ou tambem empacotavel como desktop no futuro.
- Definir estrategia final de testes e2e apos inicializar o frontend.
- Definir criterios objetivos para quando PixiJS, Rapier, Matter.js, D3.js ou Manim deixam de ser opcionais e entram no bundle.
- Definir se a proxima fatia deve seguir para ondas mecanicas/som/optica ou se vale fazer uma rodada de polimento visual nas simulacoes prontas.

## Gaps deixados para depois

- Login/auth.
- Persistencia de parametros do usuario.
- Exportacao de graficos/tabelas.
- Compartilhamento de simulacoes por link.
- Editor de conteudo teorico.
- Dashboard de professor.
- Observabilidade de producao.

## Itens para nao esquecer

- Toda nova simulacao deve declarar limites do modelo fisico.
- Toda nova simulacao deve declarar formulas envolvidas, quando usa-las e quais parametros/dados as alimentam.
- Toda simulacao deve compartilhar dados entre graficos, tabela e cena.
- Toda simulacao deve ser revisada pelo `Simulation Fidelity Adjustment Guide` para garantir que limites fisicos mudam samples e trajetoria, nao apenas avisos ou decoracao visual.
- Toda task futura de simulacao deve registrar parametros-limite, regimes, warnings e testes proporcionais antes de promover ou manter status `analysis` ou `ready`.
- Toda simulacao animada deve seguir o padrao de renderer desacoplado do shell React e revisar FPS/frame time quando houver risco de peso visual.
- O catalogo deve separar simulacoes planejadas, em analise e prontas.
- O catalogo deve manter area, subarea e `topicPath` consistentes com `09-simulation-catalog-plan.md`.
- A documentacao deve ser atualizada quando a stack ou o core mudar.
