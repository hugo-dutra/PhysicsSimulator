# Rules And Constraints

## Regras de produto

- Toda simulacao funcional deve ter visualizacao, parametros, graficos/tabela, formulas aplicadas e teoria.
- Toda simulacao deve declarar area do conhecimento, subarea, caminho de topico, nivel, objetivos didaticos, formulas usadas e limites do modelo.
- Toda task que cria, ajusta, revisa ou promove uma simulacao deve aplicar o `Simulation Fidelity Adjustment Guide` e registrar a verificacao junto da validacao da task.
- Itens planejados podem aparecer na sidebar, mas devem ser claramente marcados como indisponiveis ou planejados.
- A sidebar deve ser hierarquica e navegavel por area e subarea; simulacoes planejadas podem aparecer como folhas marcadas, sem parecerem executaveis.
- O status do catalogo deve usar `planned`, `analysis` e `ready`, exibidos como `planejado`, `analise` e `pronto`.
- Simulacoes em `analysis` sao implementadas e executaveis, mas aguardam teste manual do dono do projeto; por isso suas subareas iniciam abertas na sidebar.
- Simulacoes em `ready` sao implementadas, executaveis e ja aprovadas manualmente; suas subareas nao iniciam abertas automaticamente se nao houver itens em `analysis`.
- A primeira entrega funcional deve continuar sendo o pendulo simples; no menu consolidado atual ele aparece em `Oscilacoes e Ondas > Oscilacoes > Pendulo simples`.
- A segunda simulacao funcional da Fase 2 e `Mecanica > Dinamica > Plano inclinado com atrito`, usada para validar reuso antes de expandir o catalogo e promovida para `ready` apos aprovacao manual.
- O primeiro lote da Fase 3 mantem `Mecanica > Cinematica` com MRU, MUV/queda livre, lancamento obliquo e MCU como simulacoes `ready`. Todas usam motor analitico compartilhado e saidas completas.
- O segundo lote da Fase 3 mantem `Mecanica > Dinamica > Maquina de Atwood`, `Mecanica > Dinamica > Forca centripeta em curva` e `Mecanica > Energia e momento > Trabalho e energia em trilho` como simulacoes `ready`, com a rampa em U de energia aprovada manualmente apos o ajuste de perda percentual. Todas usam fixtures locais, formulas, teoria, graficos, tabela e vetores sincronizados.
- O terceiro lote da Fase 3 mantem `Mecanica > Energia e momento > Colisoes 1D e 2D`, `Mecanica > Estatica > Equilibrio de particula`, `Mecanica > Estatica > Torque, alavancas e centro de massa` e `Mecanica > Rotacao > Rotacao de corpo rigido` como simulacoes `ready`, mantendo motor, cena, graficos, tabela, formulas, teoria, regimes e warnings sincronizados.
- O quarto lote da Fase 3 mantem `Mecanica > Rotacao > Rolamento sem escorregamento`, `Mecanica > Gravitacao > Campo gravitacional e orbitas`, `Mecanica > Fluidos basicos > Hidrostatica e empuxo` e `Mecanica > Fluidos basicos > Continuidade e Bernoulli` como simulacoes `ready` apos aprovacao manual, com fixture, preset por subarea, formulas, teoria, graficos, tabela, vetores, warnings de regime e cena Venturi sincronizados.
- `Oscilacoes e Ondas > Oscilacoes` concentra `Pendulo simples`, `Massa-mola vertical`, `Oscilador amortecido`, `Oscilador forcado e ressonancia` e `Osciladores acoplados`, sem manter uma subarea repetida de oscilacoes dentro de Mecanica.
- `Oscilacoes e Ondas > Oscilacoes > Massa-mola vertical` fica como simulacao `ready` apos aprovacao manual, com suporte fixo, mola helicoidal, massa esferica, equilibrio `mg/k`, vetores, energia e warning de amortecimento sincronizados pelos mesmos samples.
- `Oscilacoes e Ondas > Oscilacoes` mantem `Oscilador amortecido`, `Oscilador forcado e ressonancia` e `Osciladores acoplados` como simulacoes `ready` apos aprovacao manual; cada uma deve manter regimes, warnings, graficos, tabela, formulas, teoria e cena derivados dos samples depois de qualquer mudanca futura.
- `Oscilacoes e Ondas > Ondas mecanicas` mantem `Onda em corda`, `Superposicao e interferencia` e `Ondas estacionarias` como simulacoes `ready` apos aprovacao manual; cada uma deve manter perfil 1D, probe, vetores, graficos, tabela, formulas, teoria, regimes e warnings derivados do motor compartilhado. PixiJS permanece opcional para futuras ondas 2D densas, nao como dependencia obrigatoria dessa fatia.
- `Oscilacoes e Ondas > Som` mantem `Batimentos` e `Efeito Doppler` como simulacoes `analysis` ate teste manual; cada uma deve manter campo volumetrico 3D de pontinhos/marcadores de pressao, graficos, tabela, formulas, teoria, regimes e warnings derivados do motor compartilhado. Web Audio API continua opcional e nao bloqueia a prova visual.
- A taxonomia principal do catalogo deve usar `Mecanica`, `Termodinamica`, `Oscilacoes e Ondas` e `Eletromagnetismo`; fluidos basicos entram como subarea, nao como prioridade separada antes do core.

## Regras de fisica

- Unidades devem ser explicitas.
- Parametros devem ter minimo, maximo, passo e valor padrao.
- Parametros fisicos e controles de runtime devem ter `description` obrigatoria para a tooltip de interrogacao, explicando o que a variavel e, como afeta o modelo e o que muda ao aumentar, diminuir ou zerar quando aplicavel.
- Parametros fisicamente validos em zero, como coeficiente de atrito zero ou forca aplicada zero, nao devem ser bloqueados apenas para manter uma animacao ideal.
- Controles de runtime, como horizonte calculado de samples, janela do grafico e velocidade de passagem do tempo, tambem devem declarar minimo, maximo, passo e valor padrao.
- O controle de velocidade de passagem do tempo deve ir de `1x` a `0x`; `0x` pausa o relogio visual e valores intermediarios desaceleram cena, graficos e tabela sem trocar a fonte de samples nem criar avancos em blocos.
- Quando uma simulacao didatica precisar compactar periodos fisicos longos, o fator adicional deve ser um runtime declarado, com tooltip, e deve apenas avancar mais rapido pelo mesmo tempo de modelo e pelos mesmos samples.
- Formulas devem declarar variaveis, unidades, significado fisico, quando usar e quando nao usar.
- Formulas exibidas devem corresponder ao modelo numerico ou analitico implementado.
- O modelo numerico ou analitico deve ser deterministico para os mesmos parametros.
- Tabela, graficos e animacao devem ser derivados da mesma fonte de dados.
- Cada simulacao `analysis` ou `ready` deve ter uma unica fonte de samples para cena, graficos, tabela, metricas, formulas e legenda.
- Toda simulacao `analysis` ou `ready` deve declarar seus regimes fisicos, mesmo quando houver apenas o regime ideal declarado. Se houver transicao de regime, o sample deve carregar os campos necessarios para cena, graficos, tabela, formulas e warnings descreverem o estado real.
- Velocidades e aceleracoes derivadas exibidas em graficos, tabela, metricas ou formulas devem ser calculadas no motor/sample e manter unidades explicitas.
- Quando houver aproximacao, a teoria e o guia de formulas devem explicar a aproximacao e seus limites.
- Quando uma restricao fisica deixa de ser satisfeita, a simulacao deve trocar de regime no motor e expor esse efeito nos samples, cena, graficos e avisos. Exemplo: se a forca centripeta requerida supera o atrito disponivel, o corpo deve sair da curva ideal em vez de continuar preso nela.
- Renderers, graficos e formulas nao podem inventar fisica, recalcular grandezas divergentes ou esconder uma saturacao fisica apenas com decoracao visual; eles devem representar os samples do motor.
- O produto educacional nao deve sugerir precisao de simulador profissional quando o modelo for didatico.

## Regras de UX

- Interface dark graphite com uma cor principal cyan/teal.
- Controles numericos usam slider e input quando precisao importar.
- Rotulos de variaveis nos controles exibem icone de interrogacao com tooltip compacta; a legenda vem do fixture/contrato, nao de texto solto duplicado no componente.
- Toggles para exibir vetores, trilha, energia e overlays.
- Vetores exibidos precisam de legenda visivel com cor, modulo atual e significado fisico, especialmente quando a direcao nao e obvia no movimento.
- Leituras instantaneas e legenda detalhada de vetores devem ficar em um bloco retratil acima do canvas da simulacao, nao abaixo. O bloco inicia fechado por padrao para preservar area visual; quando fechado, metricas e legenda numerica detalhada ficam desmontadas e so voltam a calcular/exibir valores ao abrir.
- A area de animacao deve incluir legenda compacta dos vetores principais no canto superior direito, com traco na cor do vetor, grandeza representada e unidade abreviada quando houver.
- Viewports Three.js devem ser cenas 3D orbitaveis: arraste com o botao pressionado no canvas gira a visualizacao em yaw e pitch para ver lados, topo e base da cena, e Shift + scroll sobre o canvas aproxima ou afasta a camera em direcao a simulacao, sem alterar parametros fisicos ou samples.
- O eixo Z deve ser tratado como vertical nas cenas Three.js padrao, para manter consistencia entre simulacoes.
- Cenas Three.js com grade devem exibir eixos de origem X, Y e Z sempre presentes, coloridos e translucidos, posicionados no canto inferior esquerdo da grade, com legenda fixa no canto superior esquerdo do canvas.
- Sistemas com mola vertical devem mostrar suporte superior fixo, mola deformando a partir do sample fisico e massa esferica presa na extremidade inferior; a mola nao pode oscilar como decoracao independente da posicao calculada.
- Sistemas de trabalho e energia em trilhos devem comunicar a restricao fisica como bancada didatica: trilho/guia fixo e coerente com a geometria declarada, corpo alinhado ao trilho ou a tangente local da rampa em U, rastro termico derivado de dissipacao real e leitura compacta de balanco energetico derivada do sample; a cena nao deve reduzir energia a uma esfera solta em linha abstrata.
- Sistemas de hidrostatica e empuxo devem mostrar tanque transparente fixo, fluido visivel e esfera imersa com raio derivado do volume; mudar massa ou volume deve alterar densidade, empuxo, resultante, aceleracao, movimento vertical e warnings pelos samples do motor, sem redimensionar a caixa ou criar decoracao visual solta.
- Sistemas de som podem usar pontinhos como marcadores discretos do campo de pressao para desenhar a onda em 3D. Esses marcadores devem ler o perfil calculado pelo motor 1D e podem ser extrudados apenas no renderer para formar um volume didatico; nao podem sugerir dinamica molecular individual, audio real obrigatorio, propagacao acustica 3D real ou frentes de onda independentes dos samples.
- Blocos de saida pesada, como graficos, tabela, formulas e teoria, devem ser recolhiveis por chevron no proprio cabecalho.
- Blocos chevron de saida pesada iniciam fechados por padrao e devem abrir/fechar ao clique no cabecalho.
- Quando um bloco chevron estiver recolhido, a aplicacao deve desmontar o conteudo e suspender calculos/renderizacao derivados daquele bloco.
- O bloco de leituras e vetores do viewport tambem deve iniciar recolhido por padrao. Mesmo sendo leve, ele deve desmontar os componentes de valores enquanto estiver fechado para deixar mais espaco para a cena.
- Viewport, graficos, tabela, formulas e apendice teorico devem oferecer botao com icone para maximizar/minimizar o painel dentro da janela.
- Enquanto um painel estiver maximizado, os demais paineis do shell devem ficar invisiveis; minimizar deve restaurar o layout anterior e manter a fonte unica de samples.
- Cada grafico temporal deve oferecer acao de olho para entrar no slot lateral direito do viewport, com apenas um grafico em foco por vez. Acionar novamente deve remover o slot e recolocar o grafico no bloco original.
- Icones em botoes sempre que houver comando conhecido como play, pause, reset, zoom ou download.
- Texto dentro de paineis deve ser compacto; evitar hero, landing page e blocos promocionais.
- UI deve evitar cards dentro de cards.
- O canvas e os graficos devem ter dimensoes estaveis para nao causar layout shift.
- Tabelas em playback devem manter quantidade fixa de linhas visiveis para evitar piscadas e deslocamento do layout.
- A animacao deve parecer leve: updates de alta frequencia ficam no renderer, e a UI React recebe apenas leituras periodicas.
- Ajustar a velocidade de passagem do tempo nao deve transferir o loop para o shell React nem causar recalculo pesado por frame; o renderer continua dono do `requestAnimationFrame` e apenas aplica a escala ao delta de tempo.
- Sliders e inputs que disparam timeline, graficos ou tabela pesados devem evitar recalculo a cada pixel de arraste; confirmar no commit do controle quando necessario.
- Graficos de series temporais longas devem usar janela temporal configuravel para evitar reescala ou crescimento indefinido de pontos visiveis.
- Graficos progressivos devem declarar cadencia de update, stride maximo, densidade minima de pontos visiveis e estrategia de desenho continuo para evitar redraw em blocos grandes.
- Graficos cientificos devem mostrar valores numericos legiveis na escala do eixo Y e nomes completos das grandezas nas legendas das series. Unidades fisicas podem ser abreviadas por simbolo padrao, mas a grandeza nao deve depender de abreviacoes tecnicas como leitura primaria.
- Itens de legenda dos graficos devem funcionar como toggles de serie: clicar liga ou desliga apenas aquela curva, mantendo eixo temporal, janela movel e samples compartilhados intactos.

## Restricoes tecnicas

- Nao depender de backend na Fase 1.
- Nao introduzir auth, cadastro ou persistencia antes da prova core.
- Nao misturar muitos motores visuais no MVP.
- Nao introduzir Rapier, Matter.js, PixiJS, D3.js ou Manim sem uma simulacao concreta que justifique a dependencia.
- Nao usar WebGPU como requisito de producao inicial; WebGL deve ser o baseline.
- Nao travar contratos de API remota cedo demais.
- Nao colocar `requestAnimationFrame` de playback no `SimulationShell` quando isso causar re-render de layout, graficos, tabela, formulas ou teoria a cada frame.
- Nao recriar renderers, materiais, geometrias, buffers ou series Plotly no caminho quente da animacao sem justificativa medida.
- Nao implementar orbitacao yaw/pitch ou zoom da camera via estado React de alta frequencia; interacao de camera deve ficar em refs e atualizar o renderer diretamente.
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
