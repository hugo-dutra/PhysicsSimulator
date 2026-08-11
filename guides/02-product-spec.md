# Product Spec

## Objetivo da experiencia

Permitir que o usuario explore um fenomeno fisico mudando parametros e observando simultaneamente:

- animacao do sistema fisico;
- vetores e outras representacoes visuais;
- graficos derivados da simulacao;
- tabela de amostras;
- formulas envolvidas no processo, com indicacao de quando e como usa-las;
- apendice teorico com formulas, interpretacao e limites do modelo.

## Perfis de usuario

- Aluno explorador: quer mexer em valores e entender causa e efeito.
- Professor demonstrador: quer explicar em aula com visual claro e parametros controlaveis.
- Autor tecnico: quer validar se uma simulacao comunica corretamente um conceito.

## Navegacao principal

A aplicacao deve agrupar simulacoes por area do conhecimento em uma sidebar:

- Mecanica, com subareas como Cinematica, Dinamica, Estatica, Energia e momento, Rotacao, Gravitacao e Fluidos basicos.
- Termodinamica, com Temperatura, Calorimetria, Gases, Leis da Termodinamica, Maquinas termicas e Transferencia de calor.
- Oscilacoes e Ondas, com Oscilacoes, Ondas mecanicas, Som e Optica basica.
- Eletromagnetismo, com Eletrostatica, Circuitos, Magnetismo, Inducao e Ondas eletromagneticas.

No core inicial, o `Pendulo simples` provou a experiencia completa e, apos teste manual do dono do projeto, fica como `ready`; no menu consolidado atual ele aparece em `Oscilacoes e Ondas > Oscilacoes > Pendulo simples`. Na Fase 2, `Mecanica > Dinamica > Plano inclinado com atrito` tambem ficou funcional para validar reuso do shell, controles, graficos, tabela, formulas e teoria; apos aprovacao manual, fica como `ready`. Na Fase 3, as primeiras simulacoes de Cinematica (`Movimento retilineo uniforme`, `Movimento uniformemente variado e queda livre`, `Lancamento obliquo` e `Movimento circular uniforme`) foram implementadas usando o mesmo shell e um motor analitico compartilhado. Apos aprovacao manual, MRU, MUV/queda livre, lancamento obliquo e MCU ficam como `ready`. O lote seguinte implementou `Maquina de Atwood`, `Forca centripeta em curva` e `Trabalho e energia em trilho`; apos aprovacao manual, Atwood, forca centripeta e `Trabalho e energia em trilho` ficam como `ready`, com `Trabalho e energia em trilho` validada no cenario de rampa em U com perda percentual. O terceiro lote implementou `Colisoes 1D e 2D`, `Equilibrio de particula`, `Torque, alavancas e centro de massa` e `Rotacao de corpo rigido`, reutilizando a cena 2.5D/3D, graficos live-canvas, tabela, formulas e teoria; apos aprovacao manual, as quatro ficam como `ready`. O quarto lote implementou `Rolamento sem escorregamento`, `Campo gravitacional e orbitas`, `Hidrostatica e empuxo` e `Continuidade e Bernoulli`; apos aprovacao manual, as quatro ficam como `ready`, com `Continuidade e Bernoulli` validada no cenario visual de tubo de Venturi. A simulacao `Massa-mola vertical` tambem fica como `ready` em `Oscilacoes e Ondas > Oscilacoes`, junto do pendulo e dos osciladores mais avancados. Apos aprovacao manual, os tres osciladores da Fase 4 (`Oscilador amortecido`, `Oscilador forcado e ressonancia` e `Osciladores acoplados`) ficam como `ready`, cobrindo regimes de amortecimento, ressonancia, modos normais, trabalho externo e troca de energia. A subarea `Ondas mecanicas` agora tem `Onda em corda`, `Superposicao e interferencia` e `Ondas estacionarias` como `ready` apos aprovacao manual, com perfis 1D, probe sincronizado, vetores, graficos, tabela, formulas, teoria e relacoes de frequencia/periodo/comprimento de onda revisadas; `Onda longitudinal em mola` entra como `analysis`, desenhando uma mola diagonal com compressao/rarefacao paralela ao eixo de propagacao e aguardando teste manual. A subarea `Som` tem `Batimentos` e `Efeito Doppler` como `ready` apos aprovacao manual, usando modelos analiticos 1D e um campo volumetrico 3D de pontinhos no renderer Three.js para mostrar pressao, frentes comprimidas/alongadas e envoltoria. A subarea `Optica` agora tem `Reflexao e refracao`, `Lentes e espelhos` e `Difracao e interferencia da luz` como `analysis`, com modelos geometricos/escalares, cena Three.js de banco optico/tela, graficos, tabela, formulas e teoria aguardando teste manual. As demais areas podem aparecer como itens planejados, desde que nao confundam com simulacoes prontas.
Mesmo quando ainda estiverem planejadas, as simulacoes do catalogo curricular devem aparecer na sidebar em menus navegaveis de area e subarea, com status claro de `planejado`, `analise` ou `pronto`.

## Catalogo curricular planejado

O catalogo detalhado de simulacoes fica em `09-simulation-catalog-plan.md`. A experiencia de produto deve suportar:

- area principal;
- subarea;
- caminho de topico, como `Mecanica > Cinematica > Lancamento obliquo`;
- status claro entre `planned`/planejado, `analysis`/analise e `ready`/pronto;
- filtros ou agrupamentos por area, nivel e tipo de modelo quando o catalogo crescer.

Itens planejados podem aparecer na sidebar como bloqueados, desabilitados ou marcados como `planejado`. Eles nao devem parecer clicaveis como simulacoes completas enquanto nao tiverem motor, visualizacao, graficos, tabela, formulas e teoria.
A sidebar deve ser organizada como arvore compacta: area principal expansivel, subarea expansivel e simulacoes como folhas marcadas por status. Subareas que contenham ao menos uma simulacao `analysis` iniciam abertas para destacar o que precisa de teste; subareas que contenham apenas simulacoes `ready` ou `planned` iniciam recolhidas. O fixture local de catalogo deve conter todas as simulacoes planejadas em `09-simulation-catalog-plan.md`. No estado atual, `Campo gravitacional e orbitas` voltou para `ready` depois da aprovacao manual da malha deformavel com dois pocos; `Onda longitudinal em mola`, `Reflexao e refracao`, `Lentes e espelhos` e `Difracao e interferencia da luz` permanecem em `analysis`. As demais simulacoes funcionais previamente aprovadas permanecem `ready`.
Antes de uma simulacao aparecer como `analysis`, virar `ready` ou continuar em um desses estados depois de uma mudanca, ela precisa passar pelo `Simulation Fidelity Adjustment Guide`: o modelo declarado deve gerar os samples, os regimes fisicos precisam mudar o estado real quando um limite for atingido, e cena, graficos, tabela, formulas, teoria e warnings devem refletir essa mesma fonte. A promocao de `analysis` para `ready` fica reservada ao teste manual do dono do projeto.

## Tela da simulacao

Layout recomendado:

- Sidebar fixa ou recolhivel com areas e simulacoes.
- Topbar compacta com nome da area, nome da simulacao e acoes globais.
- Area central com viewport/canvas da simulacao.
- Card flutuante de parametros no canto inferior direito, fixo durante a rolagem, com sliders, inputs numericos, toggles, presets, play/pause, reset, velocidade de passagem do tempo e status da simulacao.
- Todo controle de variavel fisica ou de runtime deve exibir um icone de interrogacao junto ao rotulo. Ao passar o mouse ou focar o icone, a tooltip deve explicar o que a variavel representa, como ela entra no modelo e o que acontece quando o valor aumenta, diminui ou zera quando isso for fisicamente valido.
- Bloco chevron de graficos sincronizados, recolhivel pelo proprio cabecalho.
- Bloco chevron de tabela de amostras, recolhivel pelo proprio cabecalho.
- Bloco chevron de formulas aplicadas, conectado aos parametros e dados exibidos.
- Bloco chevron de apendice teorico.
- Blocos chevron de saida pesada devem iniciar recolhidos por padrao, para o usuario abrir apenas o que quer observar.
- Viewport de simulacao, graficos, tabela, formulas e apendice teorico devem expor acao compacta de maximizar/minimizar no proprio card ou cabecalho chevron.
- Ao maximizar um desses paineis, os demais paineis do shell ficam invisiveis dentro da janela; ao minimizar, o layout e os estados anteriores voltam ao normal.
- Viewports Three.js devem ser 3D por padrao quando a simulacao tiver cena espacial. Arrastar com o botao pressionado deve orbitar a camera em yaw e pitch, permitindo ver a cena pelos lados, por cima e por baixo sem alterar samples; usar Shift + scroll sobre o canvas deve aproximar ou afastar a camera na direcao da simulacao.
- Viewports Three.js com grade devem manter uma referencia de origem sempre visivel: eixos X, Y e Z translucidos no canto inferior esquerdo da grade, com legenda fixa no canto superior esquerdo do canvas para preservar nocao espacial durante a orbitacao.
- Leituras instantaneas e legenda detalhada de vetores pertencem a um bloco retratil no topo do viewport, acima do canvas. Esse bloco inicia fechado por padrao para preservar espaco visual; ao abrir, monta as metricas e a legenda detalhada com valores derivados do sample vivo. Quando fechado, esses componentes de valores devem ser desmontados. A area de animacao tambem deve exibir uma legenda compacta no canto superior direito, com traco na cor do vetor, grandeza representada e unidade abreviada quando houver.
- O viewport pode abrir um slot lateral direito para grafico em foco, ocupando 1/3 do container em desktop. Esse slot aparece ao clicar no icone de olho de um grafico e desaparece ao clicar novamente, devolvendo o grafico ao bloco de graficos.

## Controles esperados no pendulo simples

- Play/pause.
- Reset.
- Presets de demonstracao.
- Comprimento do fio.
- Massa.
- Gravidade.
- Angulo inicial.
- Velocidade angular inicial.
- Amortecimento.
- Horizonte calculado de samples, com contador de playback continuo.
- Janela temporal dos graficos em segundos, exibindo as amostras recentes.
- Toggle de vetores.
- Toggle de trilha.
- Toggle de energia.
- Blocos chevron para graficos, tabela, formulas e teoria, iniciando fechados e permitindo abrir/minimizar saidas pesadas quando for preciso aliviar a UI.
- Botao de maximizar/minimizar no viewport da simulacao, graficos, tabela, formulas e apendice teorico para inspecao ampliada durante aula ou demonstracao.
- Botao com icone de olho em cada grafico para mover temporariamente uma unica serie de graficos para o slot lateral do viewport.

## Controles esperados no massa-mola vertical

- Play/pause.
- Reset.
- Presets de demonstracao.
- Massa da esfera.
- Constante elastica da mola.
- Gravidade.
- Deslocamento inicial em relacao ao equilibrio.
- Velocidade inicial.
- Amortecimento opcional, mantendo o caso ideal sem amortecimento como regime base.
- Horizonte calculado de samples, com contador de playback continuo.
- Janela temporal dos graficos.
- Toggles de vetores, trilha e energia.
- Blocos chevron, grafico em foco e maximizacao com o mesmo comportamento do pendulo.

## Controles esperados no plano inclinado com atrito

- Play/pause.
- Reset.
- Presets de demonstracao.
- Angulo do plano.
- Massa do bloco.
- Gravidade.
- Coeficiente de atrito.
- Posicao inicial.
- Velocidade inicial.
- Comprimento do plano.
- Horizonte calculado de samples, com contador de playback continuo.
- Janela temporal dos graficos.
- Toggles de vetores, trilha e energia.
- Blocos chevron e maximizacao com o mesmo comportamento do pendulo.

## Controles esperados nas simulacoes de Cinematica

- Play/pause.
- Reset.
- Presets de demonstracao.
- Horizonte calculado de samples, com contador de playback continuo.
- Janela temporal dos graficos.
- Toggles de vetores, trilha e energia.
- MRU: posicao inicial, velocidade e massa.
- MUV/queda livre: posicao inicial, velocidade inicial, aceleracao e massa.
- Lancamento obliquo: velocidade inicial, angulo de lancamento, altura inicial, gravidade e massa.
- MCU: raio, velocidade angular, angulo inicial e massa.
- Blocos chevron, grafico em foco e maximizacao com o mesmo comportamento do pendulo.

## Controles esperados no segundo lote de Mecanica

- Play/pause.
- Reset.
- Presets de demonstracao.
- Horizonte calculado de samples, com contador de playback continuo.
- Janela temporal dos graficos.
- Toggles de vetores, trilha e energia.
- Maquina de Atwood: massa 1, massa 2, gravidade, deslocamento inicial, velocidade inicial e curso vertical.
- Forca centripeta em curva: massa, raio da curva, velocidade tangencial, coeficiente de atrito e gravidade.
- Trabalho e energia em trilho: massa, largura da rampa em U, altura das bordas, posicao inicial, altura relativa inicial, velocidade inicial, perda percentual por ciclo e gravidade.
- Blocos chevron, grafico em foco e maximizacao com o mesmo comportamento das simulacoes anteriores.

## Controles esperados no terceiro lote de Mecanica

- Play/pause.
- Reset.
- Presets de demonstracao.
- Horizonte calculado de samples, com contador de playback continuo.
- Janela temporal dos graficos.
- Toggles de vetores, trilha e energia.
- Colisoes 1D e 2D: massas, raios das esferas, velocidades normal e tangencial dos corpos, angulo de impacto obliquo, coeficiente de restituicao e separacao inicial.
- Equilibrio de particula: tres modulos de forca, tres angulos de aplicacao e massa didatica para mostrar aceleracao quando a resultante nao fecha.
- Torque, alavancas e centro de massa: massas esquerda/direita, bracos de alavanca, forca aplicada, braco da forca aplicada e gravidade.
- Rotacao de corpo rigido: inercia base do rotor, distancia radial e valor da massa movel, torque aplicado, velocidade angular inicial de referencia, modo de energia constante que altera omega quando a massa movel muda I, angulo inicial e amortecimento angular.
- Rolamento sem escorregamento: restricao `v = omega R`, aceleracao no plano, atrito requerido/disponivel e energia translacional/rotacional.
- Campo gravitacional e orbitas: campo `GM/r^2`, potencial especifico `-GM/r`, equacao vis-viva, forca central, energia orbital e escalas visuais dos dois pocos da malha.
- Hidrostatica e empuxo: pressao `rho g h`, densidade derivada `rho = m/V`, principio de Arquimedes e criterio de flutuacao por densidades.
- Continuidade e Bernoulli: vazao `Q = Av`, Bernoulli ideal e queda de pressao entre secoes.
- Blocos chevron, grafico em foco e maximizacao com o mesmo comportamento das simulacoes anteriores.

## Controles esperados no quarto lote de Mecanica

- Play/pause.
- Reset.
- Presets de demonstracao por subarea.
- Horizonte calculado de samples, com contador de playback continuo.
- Janela temporal dos graficos.
- Toggles de vetores, trilha e energia quando o modelo tiver energia mecanica relevante.
- Rolamento sem escorregamento: massa, raio, comprimento do trilho, angulo do plano, velocidade inicial, coeficiente de atrito e gravidade.
- Campo gravitacional e orbitas: massa central, raio de periastro, excentricidade, massa do satelite, angulo inicial, profundidade visual do tecido, alfa das linhas com padrao 60% e amplificacao didatica do poco orbital.
- Hidrostatica e empuxo: densidade do fluido, massa do corpo, volume do corpo, profundidade inicial e gravidade, com densidade do corpo derivada de `m/V`.
- Continuidade e Bernoulli: area de entrada, area da garganta, vazao, densidade do fluido, pressao de entrada, desnivel da garganta e gravidade.
- Blocos chevron, grafico em foco e maximizacao com o mesmo comportamento das simulacoes anteriores.

## Representacoes esperadas

- Cena 3D animada do pendulo, com massa renderizada como cubo didatico em vez de circulo plano.
- Vetores de peso, tensao e velocidade linear com legenda detalhada de cor, modulo e significado acima da cena, alem de legenda compacta dentro da animacao com traco colorido, grandeza e unidade abreviada.
- Cena 3D animada do massa-mola vertical, com suporte superior fixo, mola helicoidal deformando no eixo vertical, massa esferica presa a extremidade inferior, referencia de equilibrio e vetores de peso, forca elastica, velocidade e aceleracao derivados do mesmo sample.
- Grafico de angulo por tempo com janela movel dos ultimos N segundos.
- Grafico de velocidade angular por tempo com a mesma janela movel.
- Grafico de velocidade linear tangencial por tempo com a mesma janela movel.
- Grafico de aceleracao por tempo, exibindo componentes tangencial, radial e modulo total.
- Grafico de energia cinetica, potencial e total com a mesma janela movel.
- Graficos devem mostrar valores numericos na escala do eixo Y e legendas de series com nomes fisicos claros. A grandeza fisica nao deve ser abreviada, mas a unidade pode usar simbolo padrao entre parenteses, como `rad/s`, `m/s`, `m/s^2` ou `J`.
- Cada item da legenda de serie do grafico deve ser clicavel para ligar ou desligar aquela serie sem recalcular samples nem alterar a cena, tabela ou formulas.
- Um grafico por vez pode ser destacado no slot direito do viewport para comparar a curva com o evento visual da simulacao, sempre usando a mesma janela temporal e a mesma fonte de samples do bloco de graficos.
- Tabela com tempo, angulo, velocidade angular, velocidade linear, aceleracoes, posicao e energia, mantendo quantidade fixa de linhas visiveis para evitar oscilacao de layout durante o playback.
- No plano inclinado, graficos e tabela devem expor posicao no plano, altura, velocidade, aceleracao, normal, atrito, resultante, energia cinetica, potencial, termica e total.
- Nas simulacoes de Cinematica, a cena Three.js reutilizavel deve expor corpo, trajetoria, vetores principais e tabela/graficos derivados do mesmo sample analitico. MRU mostra posicao/deslocamento/velocidade; MUV mostra posicao/velocidade/aceleracao; lancamento obliquo mostra posicao horizontal, altura, componentes de velocidade, gravidade e energia em voo; MCU mostra angulo, arco, velocidade tangencial, aceleracao centripeta, periodo, frequencia e energia cinetica.
- Nas simulacoes seguintes de Mecanica, a cena compartilhada deve expor corpo principal, trajetoria e vetores derivados do mesmo sample. Atwood mostra massas acopladas, tensao, peso, aceleracao e energia; forca centripeta em curva mostra velocidade tangencial, resultante centripeta, atrito maximo, limite de aderencia e saida da curva quando os parametros tornam a aderencia impossivel; trabalho e energia em trilho usa uma rampa de skate em U parabolica, corpo didatico alinhado a tangente local, rastro de perda derivado de `thermalEnergyJoules` e painel compacto com `K`, `U_g`, `E_perdida`, energia total mecanica e percentual de perda, todos alimentados pelo mesmo sample de posicao, aceleracao, dissipacao e energia; colisoes mostram dois corpos, velocidades, momento total, impulso e perda de energia quando `e < 1`; equilibrio de particula mostra forcas aplicadas, resultante e aceleracao quando o equilibrio falha; torque/alavancas mostra uma gangorra com apoio fixo, blocos de massa sobre a barra, ponto de forca aplicada, centro de massa, pesos, torque resultante e energias cinetica/potencial gravitacional de cada corpo derivados do sample; rotacao de corpo rigido mostra angulo, velocidade angular, aceleracao angular, torque, distancia e valor da massa movel radial, centro de massa, inercia total, vetor axial de momento angular e energia rotacional; rolamento mostra roda, velocidade linear/angular, atrito requerido, aderencia e escorregamento; gravitacao mostra corpo central, planeta em orbita, satelite didatico derivado do sample, campo, forca e energia orbital; hidrostatica mostra tanque transparente fixo, esfera com raio derivado do volume, nivel do fluido, pressao no centro, empuxo, peso, resultante, aceleracao, densidade derivada, fracao submersa, subida/flutuacao ou afundamento; Bernoulli mostra tubo de Venturi translucido, garganta estreita, particulas de fluxo acelerando, mapa de cor de velocidade, manometros de pressao e leituras de vazao, areas, velocidades e pressoes de entrada/garganta.
- Em `Campo gravitacional e orbitas`, uma malha wireframe densamente subdividida deve formar um poco fixo, profundo e amplo sob a massa central, com curvatura perceptivel ja nas proximidades da orbita, alem de um poco menor que acompanha o planeta. Posicao, potencial especifico e intensidades visuais dos pocos vem do `KinematicsSample`; a UI precisa avisar que a malha e uma analogia amplificada, nao um tecido fisico nem uma metrica relativistica em escala.
- Em `Som`, `Batimentos` deve mostrar dois tons sobrepostos, envoltoria e um volume 3D de pontinhos ao redor do eixo de propagacao, variando raio/cor/densidade visual conforme a pressao resultante; `Efeito Doppler` deve mostrar fonte e observador no eixo 1D, com o mesmo volume 3D exibindo frentes comprimidas a frente da fonte e alongadas atras. Esses pontinhos sao marcadores didaticos do campo de pressao, nao moleculas individuais rastreadas por dinamica molecular nem propagacao acustica 3D real.
- Em `Optica`, `Reflexao e refracao` deve mostrar interface, normal, raios e pulsos sincronizados com Snell/angulo critico; `Lentes e espelhos` deve mostrar banco optico, focos, objeto, imagem real/virtual, raios principais e prolongamentos; `Difracao e interferencia da luz` deve mostrar fendas, tela de intensidade, cor por comprimento de onda e detector lateral, todos derivados do mesmo sample usado por graficos, tabela e formulas.
- Formulas do processo analisado, com variaveis, unidades, condicoes de uso e exemplo curto.
- Apendice teorico com equacoes, unidades, contexto de uso e limites da aproximacao.

## Formulas e uso orientado

Cada simulacao funcional deve apresentar um guia de formulas, nao apenas uma lista de equacoes. Para cada formula, informar:

- expressao matematica renderizada com KaTeX;
- nome e significado fisico;
- variaveis e unidades;
- quando usar;
- quando nao usar ou quando a aproximacao deixa de ser valida;
- quais parametros da UI alimentam a formula;
- quais graficos, vetores ou colunas de tabela derivam dela;
- exemplo numerico curto quando fizer sentido.

No pendulo simples, o guia deve cobrir pelo menos:

- equacao de movimento angular;
- aproximacao de pequeno angulo, quando usada;
- periodo aproximado;
- energia potencial, cinetica e total;
- posicao cartesiana da massa;
- velocidade linear tangencial e aceleracoes tangencial/radial/total;
- vetores principais, como peso, tensao e velocidade.

No massa-mola vertical, o guia deve cobrir pelo menos:

- lei de Hooke e sentido da forca elastica;
- equilibrio estatico com gravidade, deixando claro que `mg/k` desloca a posicao de repouso;
- equacao do oscilador em torno do equilibrio;
- periodo ideal `T = 2 pi sqrt(m/k)`;
- energia cinetica, potencial elastica, potencial gravitacional e energia mecanica total;
- relacao entre deslocamento, velocidade, aceleracao, forca elastica, peso, graficos, tabela e vetores.

No plano inclinado com atrito, o guia deve cobrir pelo menos:

- componentes do peso;
- forca normal;
- atrito estatico e cinetico no modelo didatico;
- aceleracao ao longo do plano quando ha deslizamento;
- energia mecanica e energia termica acumulada pelo atrito.

Nas simulacoes de Cinematica, o guia deve cobrir pelo menos:

- MRU: funcao horaria da posicao, deslocamento, velocidade constante e energia cinetica;
- MUV/queda livre: posicao, velocidade, aceleracao constante e energia cinetica;
- Lancamento obliquo: decomposicao da velocidade inicial, trajetoria, aceleracao gravitacional e energia mecanica em voo;
- MCU: posicao angular, velocidade tangencial, periodo/frequencia, aceleracao centripeta e energia cinetica.

No segundo lote de Mecanica, o guia deve cobrir pelo menos:

- Maquina de Atwood: aceleracao do sistema, tensao no fio, posicao com aceleracao constante e energia mecanica ideal.
- Forca centripeta em curva: aceleracao centripeta, forca centripeta requerida, limite de atrito estatico e velocidade critica.
- Trabalho e energia em trilho: geometria da rampa em U, energia cinetica, energia potencial gravitacional, energia mecanica total e percentual de perda acumulada.

No terceiro lote de Mecanica, o guia deve cobrir pelo menos:

- Colisoes 1D e 2D: geometria de contato por `r1 + r2`, momento linear total, coeficiente de restituicao, impulso normal e energia cinetica antes/depois do contato.
- Equilibrio de particula: decomposicao de forcas, condicao `sum F = 0` e aceleracao quando a resultante e diferente de zero.
- Torque, alavancas e centro de massa: definicao de torque, equilibrio rotacional, centro de massa em linha e energia mecanica por massa pontual.
- Rotacao de corpo rigido: `I = I_base + m r^2`, `L = I omega`, modo isolado com conservacao de momento angular, modo de energia constante com `K_rot` fixa e `omega = sqrt(2K/I)`, `tau = I alpha`, cinamatica angular, amortecimento angular e energia rotacional.

Em `Som`, o guia deve cobrir pelo menos:

- Batimentos: superposicao de dois tons, frequencia media, frequencia de batimento, envoltoria de pressao, grafico de pressao e limites de amplitude pequena.
- Efeito Doppler: frequencia emitida, frequencia observada, velocidades da fonte/observador relativas ao meio, comprimento de onda a frente/atras da fonte e validade classica/subsonica.

Em `Optica`, o guia deve cobrir pelo menos:

- Reflexao e refracao: Lei de Snell, angulo critico, reflexao interna total, indices de refracao e estimativa didatica de refletancia.
- Lentes e espelhos: equacao dos pontos conjugados, foco assinado, imagem real/virtual, aumento linear e limites do regime paraxial.
- Difracao e interferencia da luz: espacamento de franjas, envoltoria de fenda unica, interferencia de multiplas fendas, comprimento de onda, largura/separacao de fendas e validade de Fraunhofer.

## Estados de tela

- Inicial: carrega preset padrao do pendulo ja em modo rodando, com acao visivel para pausar/reproduzir.
- Rodando: integrador avanca no tempo e UI mostra estado atual.
- Pausado: usuario pode ajustar parametros e inspecionar dados.
- Resetado: volta aos parametros atuais com tempo zero.
- Erro de parametro: indica valor invalido sem quebrar a cena.
- Recurso planejado: areas futuras aparecem desabilitadas ou marcadas como planejadas.

## Comportamento com mocks/fixtures

Na fase core, dados de catalogo, parametros, presets e texto teorico podem vir de JSON/MDX locais. Nao deve haver dependencia de backend.

## Criterios de aceite do MVP

- O usuario consegue abrir `Oscilacoes e Ondas > Oscilacoes > Pendulo simples` e `Oscilacoes e Ondas > Oscilacoes > Massa-mola vertical` pela sidebar.
- O usuario consegue abrir `Oscilacoes e Ondas > Ondas mecanicas > Onda em corda`, `Superposicao e interferencia` e `Ondas estacionarias` pela sidebar como simulacoes prontas, com cena, controles, graficos, tabela, formulas e teoria sincronizados.
- O usuario consegue abrir `Oscilacoes e Ondas > Ondas mecanicas > Onda longitudinal em mola` pela sidebar como simulacao em analise, com mola diagonal, espiras comprimindo/expandindo paralelamente a propagacao, controles, graficos, tabela, formulas, teoria e warnings sincronizados.
- O usuario consegue abrir `Oscilacoes e Ondas > Som > Batimentos` e `Efeito Doppler` pela sidebar como simulacoes prontas, com campo volumetrico 3D de pontinhos de pressao, fonte/probe ou fonte/observador, graficos, tabela, formulas e teoria sincronizados.
- O usuario consegue abrir `Oscilacoes e Ondas > Optica > Reflexao e refracao`, `Lentes e espelhos` e `Difracao e interferencia da luz` pela sidebar como simulacoes em analise, com banco optico/tela 3D, controles perceptiveis, graficos, tabela, formulas, teoria e warnings sincronizados.
- O usuario consegue abrir `Mecanica > Dinamica > Plano inclinado com atrito` pela sidebar como segunda simulacao pronta.
- O usuario consegue abrir as quatro primeiras simulacoes de `Mecanica > Cinematica` pela sidebar e ver cena, vetores, graficos, tabela, formulas e teoria sincronizados.
- O usuario consegue abrir `Mecanica > Dinamica > Maquina de Atwood`, `Mecanica > Dinamica > Forca centripeta em curva` e `Mecanica > Energia e momento > Trabalho e energia em trilho` pela sidebar com a mesma sincronizacao.
- O usuario consegue abrir `Mecanica > Energia e momento > Colisoes 1D e 2D`, `Mecanica > Estatica > Equilibrio de particula`, `Mecanica > Estatica > Torque, alavancas e centro de massa`, `Mecanica > Rotacao > Rotacao de corpo rigido`, `Mecanica > Rotacao > Rolamento sem escorregamento`, `Mecanica > Gravitacao > Campo gravitacional e orbitas`, `Mecanica > Fluidos basicos > Hidrostatica e empuxo` e `Mecanica > Fluidos basicos > Continuidade e Bernoulli` pela sidebar com a mesma sincronizacao.
- Toda simulacao `analysis`, `ready` ou alterada em uma task futura tem a auditoria do `Simulation Fidelity Adjustment Guide` satisfeita e registrada: parametros fisicos validos, regimes, samples, renderer, graficos, tabela, formulas, teoria, warnings e testes proporcionais concordam.
- O canvas mostra a animacao do pendulo.
- As metricas instantaneas e a legenda detalhada dos vetores ficam em um bloco retratil acima do canvas da simulacao, fechado por padrao e montado apenas quando o usuario abre; a legenda compacta dos vetores aparece no canto superior direito da animacao.
- O canvas do pendulo e uma cena 3D; arrastar com o botao pressionado orbita a visualizacao em torno, por cima e por baixo da cena, e usar Shift + scroll sobre o canvas controla o zoom da camera sem alterar a fonte numerica da simulacao.
- O canvas exibe referencia de origem da grade com eixos X, Y e Z coloridos/translucidos no canto inferior esquerdo do plano e legenda fixa no canto superior esquerdo.
- Alterar controles muda a simulacao e regenera dados derivados.
- Todo parametro visivel em controles, inclusive tempo de ciclo e janela de grafico, possui legenda via tooltip de interrogacao derivada do contrato `SimulationParameter.description`.
- Alterar o horizonte calculado muda quantos segundos de samples ficam pre-calculados ou estendidos em blocos; o playback continua avancando enquanto estiver em play e so volta a `t = 0` quando o usuario aciona reset.
- Alterar a velocidade de passagem do tempo entre `1x` e `0x` desacelera cena, leituras, graficos e tabela pela mesma fonte de samples; em `0x`, o runtime fica pausado sem resetar o tempo nem trocar de regime fisico.
- Alterar a janela dos graficos muda quantos segundos recentes ficam visiveis.
- Graficos e tabela refletem os mesmos samples quando suas saidas estao ligadas.
- Graficos exibem escala numerica no eixo Y e legendas textuais completas para a grandeza de cada serie; apenas as unidades podem aparecer abreviadas por simbolo fisico padrao.
- Clicar em um item da legenda de serie liga ou desliga apenas aquela curva no grafico, preservando a mesma fonte de samples e a sincronizacao com cena, tabela e formulas.
- O clique no olho de um grafico move esse grafico para um slot lateral no viewport; clicar novamente no olho do grafico em foco remove o slot e restaura o grafico no bloco original.
- Graficos, tabela, formulas e teoria podem ser recolhidos por chevron; quando um bloco pesado esta recolhido, seu conteudo deve ser desmontado e seu processamento suspenso.
- Esses blocos chevron iniciam fechados por padrao e precisam alternar aberto/fechado ao clicar no cabecalho.
- Viewport, graficos, tabela, formulas e apendice teorico podem ser maximizados dentro da janela. Apenas um painel fica maximizado por vez, os demais ficam invisiveis, e minimizar restaura o shell anterior sem perder o playback nem a sincronizacao de samples.
- A tabela de amostras mantem uma quantidade constante de linhas enquanto esta aberta, preenchendo slots vazios quando ainda nao ha amostras suficientes.
- Vetores podem ser ligados e desligados.
- Vetores exibidos devem ter legenda junto ao viewport, incluindo cor, modulo atual e leitura fisica, e tambem legenda compacta dentro da animacao com traco na cor do vetor, grandeza e unidade abreviada quando houver.
- Formulas exibidas explicam quando usar cada equacao e quais dados da simulacao a alimentam.
- O apendice teorico aparece ao lado ou abaixo da simulacao sem substituir a experiencia principal.
- A interface usa Material UI em dark graphite com acento cyan/teal e leitura confortavel.

## Limites do MVP

- Nao precisa salvar simulacoes do usuario.
- Nao precisa compartilhar links configurados.
- Nao precisa autenticar usuarios.
- O core inicial nao precisava ter mais de uma simulacao funcional; apos a Fase 3 e a antecipacao do massa-mola, o shell mantem pendulo, plano inclinado, quatro simulacoes analiticas de Cinematica e doze simulacoes mecanicas adicionais como funcionais.
- Nao precisa de simulacao fisica de alta fidelidade alem do modelo declarado.
