# Issues, Risks And Open Premises

## Riscos da prova core

- A sincronizacao entre animacao, graficos, tabela e teoria pode ficar complexa se o estado nao tiver uma fonte unica.
- Three.js e Plotly.js juntos podem pesar no bundle se forem importados sem cuidado.
- O pendulo pode parecer simples demais se nao incluir vetores, energia e graficos suficientes para provar a proposta.
- Um tema dark mal calibrado pode prejudicar leitura de formulas e tabelas.
- Formulas podem virar conteudo decorativo se nao forem ligadas aos parametros, samples, graficos e limites do modelo.
- Expandir para fluidos e magnetismo cedo demais pode diluir o foco antes de validar o shell.
- O catalogo curricular amplo pode virar promessa excessiva se simulacoes planejadas nao forem visualmente separadas das disponiveis.
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

- O primeiro core sera `Mecanica > Pendulo simples`.
- O catalogo planejado usa quatro areas principais: `Mecanica`, `Termodinamica`, `Oscilacoes e Ondas` e `Eletromagnetismo`.
- `Fluidos basicos` entra como subarea planejada, nao como area principal antes da prova do core.
- Eletricidade e magnetismo ficam agrupados em `Eletromagnetismo`.
- O tema inicial usa `#2DD4BF` como cor primaria teal e `#38BDF8` como cor informativa/cyan.
- O apendice teorico inicial do pendulo e renderizado como Markdown local com KaTeX abaixo do guia de formulas; o guia de formulas permanece como bloco aplicado e ligado a parametros, samples, graficos e vetores.
- O padrao de renderizacao animada passa a ser renderer-first: `requestAnimationFrame` pertence ao renderer visual, o shell React recebe leituras periodicas e componentes pesados como Plotly, tabela, formulas e teoria ficam fora do caminho quente da animacao.
- Viewports Three.js seguem o padrao 3D orbitavel: eixo Z vertical, camera girando por arraste horizontal, zoom por Shift + scroll sobre o canvas em refs do renderer e objetos principais com volume quando isso melhora a leitura espacial.
- Graficos, tabela, formulas e teoria devem seguir o padrao de bloco chevron recolhivel: quando recolhidos, desmontam o conteudo e suspendem processamento derivado em vez de apenas esconder a UI.
- Blocos chevron de saida pesada iniciam fechados por padrao e precisam alternar aberto/fechado ao clique no cabecalho.
- Viewport, graficos, tabela, formulas e apendice teorico seguem o padrao de painel maximizavel: apenas um fica em foco na janela, os demais paineis ficam invisiveis, e minimizar restaura o shell anterior sem perder sincronizacao.
- `fixtures/simulations/catalog.json` deve listar todas as simulacoes planejadas do catalogo curricular; apenas simulacoes com motor, cena, graficos, tabela, formulas, teoria e validacao ficam como `available`.
- Tabelas sincronizadas em playback devem manter quantidade fixa de linhas visiveis para evitar piscadas e deslocamento de layout; slots sem amostra podem aparecer vazios ate haver dados suficientes.
- O pendulo simples deve expor, alem da velocidade angular, velocidade linear tangencial e aceleracoes tangencial/radial/total em graficos e tabela, calculadas no sample do motor.
- Vetores exibidos na cena devem ter legenda visivel com cor, modulo atual e significado fisico.
- Leituras instantaneas e legenda detalhada de vetores ficam no topo do viewport, acima do canvas, para que valores e significados antecedam a observacao da cena.
- A area de animacao tambem deve exibir legenda compacta dos vetores principais no canto superior direito, com traco na cor do vetor, grandeza representada e unidade abreviada quando houver.
- Graficos devem manter escala numerica visivel no eixo Y e legendas com nomes fisicos completos para as grandezas; unidades podem usar abreviacoes fisicas padrao como `rad/s`, `m/s`, `m/s^2` e `J`.
- Graficos temporais devem oferecer acao de olho para mover um unico grafico para um slot lateral direito dentro do viewport, preservando a mesma janela de samples e retornando ao bloco original quando a acao for desligada.
- `Mecanica > Dinamica > Plano inclinado com atrito` e a segunda simulacao `available`, com fixture local, motor deterministico por regimes, cena Three.js, graficos live-canvas, tabela, formulas e teoria no mesmo shell.
- O runtime visual reutilizavel fica em `src/lib/rendering/visualRuntime.ts` e centraliza agendamento de frames, interpolacao de timeline e metricas simples, mantendo cada renderer dono dos seus objetos e buffers.
- `Mecanica > Cinematica` iniciou a Fase 3 com quatro simulacoes `available`: `Movimento retilineo uniforme`, `Movimento uniformemente variado e queda livre`, `Lancamento obliquo` e `Movimento circular uniforme`, todas com motor analitico compartilhado, cena Three.js 2.5D, live-canvas, tabela, formulas, teoria e fixtures locais.

## Decisoes pendentes

- Definir se a aplicacao deve ser apenas web ou tambem empacotavel como desktop no futuro.
- Definir estrategia final de testes e2e apos inicializar o frontend.
- Definir criterios objetivos para quando PixiJS, Rapier, Matter.js, D3.js ou Manim deixam de ser opcionais e entram no bundle.
- Definir qual sera o proximo bloco funcional apos o primeiro lote de Cinematica da Fase 3.

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
- Toda simulacao animada deve seguir o padrao de renderer desacoplado do shell React e revisar FPS/frame time quando houver risco de peso visual.
- O catalogo deve separar simulacoes disponiveis de simulacoes planejadas.
- O catalogo deve manter area, subarea e `topicPath` consistentes com `09-simulation-catalog-plan.md`.
- A documentacao deve ser atualizada quando a stack ou o core mudar.
