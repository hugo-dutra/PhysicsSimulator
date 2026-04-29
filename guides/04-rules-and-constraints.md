# Rules And Constraints

## Regras de produto

- Toda simulacao funcional deve ter visualizacao, parametros, graficos/tabela, formulas aplicadas e teoria.
- Toda simulacao deve declarar area do conhecimento, subarea, caminho de topico, nivel, objetivos didaticos, formulas usadas e limites do modelo.
- Itens planejados podem aparecer na sidebar, mas devem ser claramente marcados como indisponiveis ou planejados.
- A sidebar deve ser hierarquica e navegavel por area e subarea; simulacoes planejadas podem aparecer como folhas marcadas, sem parecerem disponiveis.
- A primeira entrega funcional deve ser `Mecanica > Pendulo simples`.
- A segunda simulacao funcional da Fase 2 e `Mecanica > Dinamica > Plano inclinado com atrito`, usada para validar reuso antes de expandir o catalogo.
- O primeiro lote da Fase 3 promove `Mecanica > Cinematica` com MRU, MUV/queda livre, lancamento obliquo e MCU como simulacoes `available`, todas com motor analitico compartilhado e saidas completas.
- A taxonomia principal do catalogo deve usar `Mecanica`, `Termodinamica`, `Oscilacoes e Ondas` e `Eletromagnetismo`; fluidos basicos entram como subarea, nao como prioridade separada antes do core.

## Regras de fisica

- Unidades devem ser explicitas.
- Parametros devem ter minimo, maximo, passo e valor padrao.
- Controles de runtime, como duracao do ciclo e janela do grafico, tambem devem declarar minimo, maximo, passo e valor padrao.
- Formulas devem declarar variaveis, unidades, significado fisico, quando usar e quando nao usar.
- Formulas exibidas devem corresponder ao modelo numerico ou analitico implementado.
- O modelo numerico ou analitico deve ser deterministico para os mesmos parametros.
- Tabela, graficos e animacao devem ser derivados da mesma fonte de dados.
- Cada simulacao `available` deve ter uma unica fonte de samples para cena, graficos, tabela, metricas, formulas e legenda.
- Velocidades e aceleracoes derivadas exibidas em graficos, tabela, metricas ou formulas devem ser calculadas no motor/sample e manter unidades explicitas.
- Quando houver aproximacao, a teoria e o guia de formulas devem explicar a aproximacao e seus limites.
- O produto educacional nao deve sugerir precisao de simulador profissional quando o modelo for didatico.

## Regras de UX

- Interface dark graphite com uma cor principal cyan/teal.
- Controles numericos usam slider e input quando precisao importar.
- Toggles para exibir vetores, trilha, energia e overlays.
- Vetores exibidos precisam de legenda visivel com cor, modulo atual e significado fisico, especialmente quando a direcao nao e obvia no movimento.
- Leituras instantaneas e legenda detalhada de vetores devem ficar acima do canvas da simulacao, nao abaixo, para preservar a leitura antes da observacao visual.
- A area de animacao deve incluir legenda compacta dos vetores principais no canto superior direito, com traco na cor do vetor, grandeza representada e unidade abreviada quando houver.
- Viewports Three.js devem ser cenas 3D orbitaveis: arraste horizontal no canvas gira a visualizacao ao redor do eixo Z, e scroll sobre o canvas aproxima ou afasta a camera em direcao a simulacao, sem alterar parametros fisicos ou samples.
- O eixo Z deve ser tratado como vertical nas cenas Three.js padrao, para manter consistencia entre simulacoes.
- Blocos de saida pesada, como graficos, tabela, formulas e teoria, devem ser recolhiveis por chevron no proprio cabecalho.
- Blocos chevron de saida pesada iniciam fechados por padrao e devem abrir/fechar ao clique no cabecalho.
- Quando um bloco chevron estiver recolhido, a aplicacao deve desmontar o conteudo e suspender calculos/renderizacao derivados daquele bloco.
- Viewport, graficos, tabela, formulas e apendice teorico devem oferecer botao com icone para maximizar/minimizar o painel dentro da janela.
- Enquanto um painel estiver maximizado, os demais paineis do shell devem ficar invisiveis; minimizar deve restaurar o layout anterior e manter a fonte unica de samples.
- Cada grafico temporal deve oferecer acao de olho para entrar no slot lateral direito do viewport, com apenas um grafico em foco por vez. Acionar novamente deve remover o slot e recolocar o grafico no bloco original.
- Icones em botoes sempre que houver comando conhecido como play, pause, reset, zoom ou download.
- Texto dentro de paineis deve ser compacto; evitar hero, landing page e blocos promocionais.
- UI deve evitar cards dentro de cards.
- O canvas e os graficos devem ter dimensoes estaveis para nao causar layout shift.
- Tabelas em playback devem manter quantidade fixa de linhas visiveis para evitar piscadas e deslocamento do layout.
- A animacao deve parecer leve: updates de alta frequencia ficam no renderer, e a UI React recebe apenas leituras periodicas.
- Sliders e inputs que disparam timeline, graficos ou tabela pesados devem evitar recalculo a cada pixel de arraste; confirmar no commit do controle quando necessario.
- Graficos de series temporais longas devem usar janela temporal configuravel para evitar reescala ou crescimento indefinido de pontos visiveis.
- Graficos progressivos devem declarar cadencia de update, stride maximo, densidade minima de pontos visiveis e estrategia de desenho continuo para evitar redraw em blocos grandes.
- Graficos cientificos devem mostrar valores numericos legiveis na escala do eixo Y e nomes completos das grandezas nas legendas das series. Unidades fisicas podem ser abreviadas por simbolo padrao, mas a grandeza nao deve depender de abreviacoes tecnicas como leitura primaria.

## Restricoes tecnicas

- Nao depender de backend na Fase 1.
- Nao introduzir auth, cadastro ou persistencia antes da prova core.
- Nao misturar muitos motores visuais no MVP.
- Nao introduzir Rapier, Matter.js, PixiJS, D3.js ou Manim sem uma simulacao concreta que justifique a dependencia.
- Nao usar WebGPU como requisito de producao inicial; WebGL deve ser o baseline.
- Nao travar contratos de API remota cedo demais.
- Nao colocar `requestAnimationFrame` de playback no `SimulationShell` quando isso causar re-render de layout, graficos, tabela, formulas ou teoria a cada frame.
- Nao recriar renderers, materiais, geometrias, buffers ou series Plotly no caminho quente da animacao sem justificativa medida.
- Nao implementar orbitacao ou zoom da camera via estado React de alta frequencia; interacao de camera deve ficar em refs e atualizar o renderer diretamente.
- Nao desmontar/remontar graficos ou viewport como mecanismo padrao de reset de parametro; preferir atualizar dados e refs preservando os componentes pesados montados.
- O helper compartilhado de runtime visual pode ser usado para agendar frames, interpolar samples e medir FPS/frame time, mas nao deve substituir o ownership local dos objetos e buffers de cada renderer.
- Nao manter canvas de grafico, tabela tabular, KaTeX ou Markdown processando quando o bloco chevron correspondente estiver recolhido.
- Nao congelar graficos ou tabela ao maximizar um painel: se a cena for a fonte atual do sample vivo, ela pode ficar invisivel, mas precisa continuar alimentando o runtime ate esse relogio ser extraido.
- Renderers interativos devem limitar custo de preenchimento e densidade visual, por exemplo com `devicePixelRatio` maximo, downsampling, trilhas limitadas e toggles de saidas pesadas.

## Dados mockados

Na fase core, catalogo, presets, parametros, formulas e conteudo teorico podem ser mockados com JSON/MDX locais. Isso e permitido e desejado para reduzir atrito.

## Fora de escopo inicial

- CFD realista.
- Eletromagnetismo numerico pesado.
- Simulacao profissional de engenharia.
- Colaboracao em tempo real.
- Avaliacoes, notas e turmas.
- Biblioteca completa de aulas.
