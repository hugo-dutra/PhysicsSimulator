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
- Graficos, tabela, formulas e teoria devem seguir o padrao de bloco chevron recolhivel: quando recolhidos, desmontam o conteudo e suspendem processamento derivado em vez de apenas esconder a UI.
- Blocos chevron de saida pesada iniciam fechados por padrao e precisam alternar aberto/fechado ao clique no cabecalho.
- Tabelas sincronizadas em playback devem manter quantidade fixa de linhas visiveis para evitar piscadas e deslocamento de layout; slots sem amostra podem aparecer vazios ate haver dados suficientes.
- O pendulo simples deve expor, alem da velocidade angular, velocidade linear tangencial e aceleracoes tangencial/radial/total em graficos e tabela, calculadas no sample do motor.
- Vetores exibidos na cena devem ter legenda visivel com cor, modulo atual e significado fisico.

## Decisoes pendentes

- Definir se a aplicacao deve ser apenas web ou tambem empacotavel como desktop no futuro.
- Definir estrategia final de testes e2e apos inicializar o frontend.
- Definir criterios objetivos para quando PixiJS, Rapier, Matter.js, D3.js ou Manim deixam de ser opcionais e entram no bundle.

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
