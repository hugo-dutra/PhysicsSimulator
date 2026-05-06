# Simulation Catalog Plan

## Objetivo

Este guia define o catalogo planejado de simulacoes de fisica basica. Ele nao muda a regra core-first: a primeira entrega funcional continua sendo o pendulo simples, com dados locais, motor proprio e sincronizacao completa entre cena, graficos, tabela, formulas e teoria. No catalogo consolidado, o pendulo fica em `Oscilacoes e Ondas > Oscilacoes > Pendulo simples`, junto de `Massa-mola vertical` e dos osciladores da Fase 4 para evitar uma subarea repetida em Mecanica. Apos teste manual do dono do projeto, o pendulo fica como `ready`. A Fase 2 implementou `Mecanica > Dinamica > Plano inclinado com atrito` como segunda simulacao executavel para validar reuso e, apos aprovacao manual, ela fica como `ready`. A Fase 3 iniciou a expansao de Mecanica implementando quatro simulacoes de Cinematica: MRU, MUV/queda livre, lancamento obliquo e MCU. Apos aprovacao manual, MRU, MUV/queda livre, lancamento obliquo e MCU ficam como `ready`. O segundo lote implementou `Maquina de Atwood`, `Forca centripeta em curva` e `Trabalho e energia em trilho`; apos aprovacao manual, Atwood e forca centripeta ficam como `ready`, enquanto `Trabalho e energia em trilho` volta a `analysis` apos ser reescopada para uma rampa em U com perda percentual. O terceiro lote implementou `Colisoes 1D e 2D`, `Equilibrio de particula`, `Torque, alavancas e centro de massa` e `Rotacao de corpo rigido`; apos aprovacao manual, as quatro ficam como `ready`. O quarto lote implementou `Rolamento sem escorregamento`, `Campo gravitacional e orbitas`, `Hidrostatica e empuxo` e `Continuidade e Bernoulli` como `analysis`, alem de consolidar presets didaticos por subarea mecanica; apos aprovacao manual, `Rolamento sem escorregamento`, `Campo gravitacional e orbitas`, `Hidrostatica e empuxo` e `Continuidade e Bernoulli` ficam como `ready`. A fatia visual de `Massa-mola vertical` tambem fica em `Oscilacoes e Ondas > Oscilacoes` como `ready`, ao lado do pendulo. A Fase 4 iniciou essa mesma subarea com `Oscilador amortecido`, `Oscilador forcado e ressonancia` e `Osciladores acoplados` em `analysis`, mantendo ondas mecanicas, som e optica como proximas fatias planejadas.

O catalogo amplo deve nascer como backlog planejado e virar produto funcional em fatias pequenas, sempre reaproveitando o contrato comum de simulacao. Toda promocao futura para `analysis` ou `ready` precisa aplicar o `Simulation Fidelity Adjustment Guide`, inclusive quando a simulacao parecer simples ou puramente analitica. A promocao de `analysis` para `ready` tambem exige teste manual do dono do projeto.

## Areas principais

A taxonomia inicial do produto deve usar quatro areas de fisica basica:

- `Mecanica`.
- `Termodinamica`.
- `Oscilacoes e Ondas`.
- `Eletromagnetismo`.

Topicos como fluidos basicos entram como subarea de `Mecanica` ou `Termodinamica`, conforme o modelo usado. Eletricidade e magnetismo entram juntos em `Eletromagnetismo`, para evitar duplicar navegacao antes de o catalogo crescer.

## Padrao de entrega por simulacao

Cada simulacao planejada deve virar uma `SimulationDefinition` com:

- area, subarea e caminho de topico;
- status `planned`, `analysis` ou `ready`;
- parametros com unidades, minimo, maximo, passo e default;
- presets didaticos;
- modelo fisico declarado, com aproximacoes e limites;
- regimes fisicos declarados, mesmo quando o regime for ideal unico;
- motor numerico ou analitico deterministico;
- cena interativa, vetores ou overlays relevantes;
- graficos Plotly.js ou live-canvas derivados dos mesmos samples da cena;
- tabela sincronizada;
- guia de formulas com quando usar e quando nao usar;
- apendice teorico em MDX/Markdown com KaTeX;
- testes unitarios do modelo e smoke test visual quando a simulacao ficar funcional.
- runtime visual seguindo o padrao de performance: renderer com loop proprio, UI React em cadencia reduzida, buffers reutilizados e FPS/frame time observavel quando houver animacao continua.
- auditoria do `Simulation Fidelity Adjustment Guide`, cobrindo parametros, zeros fisicamente validos, limites, troca de regime, samples, warnings e fidelidade visual.

## Tecnologias por familia de simulacao

Base comum:

- React + TypeScript + Vite para aplicacao.
- Material UI para shell, navegacao, paineis, controles e tabelas.
- Three.js como renderer principal para cenas 3D/2.5D, vetores, orbitas, corpos e campos.
- Plotly.js para graficos cientificos declarativos e live-canvas para series temporais progressivas que precisam ser desenhadas continuamente.
- MDX/Markdown + KaTeX para teoria e formulas.
- JSON local para catalogo, parametros, presets e status enquanto o core e o reuso de simulacoes ainda estiverem em validacao local.
- `physics-core` proprio para modelos analiticos, integradores simples e geracao de samples.

Tecnologias opcionais, introduzidas apenas quando a simulacao exigir:

- Rapier ou Matter.js para colisoes, juntas e corpos rigidos depois da prova do core.
- PixiJS para ondas 2D densas, particulas, mapas de campo e cenas com muitos elementos planos.
- Web Audio API para simulacoes de som, batimentos, frequencia e efeito Doppler.
- D3.js apenas para visualizacoes customizadas que Plotly.js nao resolver bem.
- Manim somente como ferramenta externa para videos ou assets explicativos pre-renderizados.

## Mecanica

Objetivo da area: explicar movimento, forcas, energia, equilibrio, rotacao, gravitacao e fluidos basicos com cenas geometricas claras e graficos sincronizados.

Implementacao preferencial:

- Modelos analiticos para MRU, MUV, queda livre, lancamentos e MCU.
- Integradores deterministico simples, como Euler semi-implicito, Verlet ou RK4, para sistemas com forcas variaveis.
- Three.js para corpo, vetores, trajetorias, planos, eixos, orbitas e diagramas de forcas.
- Plotly.js para posicao, velocidade, aceleracao, energia, momento e forcas no tempo.

| Subarea | Simulacao planejada | Conteudo e saidas esperadas | Modelo e tecnologia |
| --- | --- | --- | --- |
| Cinematica | Movimento retilineo uniforme | Posicao, deslocamento, velocidade constante, grafico `x(t)` e `v(t)`. | Fase 3 `ready`; solucao analitica em `physics-core`; cena 1D/2.5D em Three.js. |
| Cinematica | Movimento uniformemente variado e queda livre | Aceleracao constante, lancamento vertical, queda livre, graficos `x(t)`, `v(t)` e `a(t)`. | Fase 3 `ready`; solucao analitica; preset com gravidade terrestre e gravidade customizada. |
| Cinematica | Lancamento obliquo | Alcance, altura maxima, tempo de voo, decomposicao vetorial e trajetoria. | Fase 3 `ready`; solucao analitica sem arrasto no primeiro passo; arrasto como extensao numerica posterior. |
| Cinematica | Movimento circular uniforme | Velocidade angular, periodo, frequencia, aceleracao centripeta e vetores tangencial/radial. | Fase 3 `ready`; solucao analitica; cena circular com vetores em Three.js. |
| Dinamica | Plano inclinado com atrito | Forcas normal, peso, atrito, aceleracao, energia e condicoes de repouso/deslizamento. | Fase 2 `ready`; modelo analitico por regimes, Three.js, live-canvas e KaTeX. |
| Dinamica | Maquina de Atwood | Tensao, aceleracao, massas acopladas, energia e comparacao de massas. | Fase 3 `ready`; equacoes de Newton em modelo analitico ideal; cena Three.js compartilhada. |
| Dinamica | Forca centripeta em curva | Atrito lateral, raio, velocidade critica e perda de aderencia. | Fase 3 `ready`; modelo analitico com alertas de limite; cena em Three.js. |
| Energia e momento | Trabalho e energia em trilho | Energia cinetica/potencial, conservacao e dissipacao percentual em rampa de skate em U, com regua de altura, rastro de perda e painel compacto de energia derivado dos samples. | Fase 3 `ready`; modelo analitico/numerico de rampa em U com grafico de posicao, velocidade, aceleracao, energias e perda. |
| Energia e momento | Colisoes 1D e 2D | Momento linear, impulso, coeficiente de restituicao, colisao elastica/inelastica. | Fase 3 `ready`; motor proprio para duas particulas com impulso normal e componentes 2D; Rapier/Matter.js apenas se a cena crescer. |
| Estatica | Equilibrio de particula | Soma vetorial de forcas, cabos, tracao e resultante nula. | Fase 3 `ready`; algebra vetorial simples com regime de equilibrio ou aceleracao por resultante. |
| Estatica | Torque, alavancas e centro de massa | Momento de forca, equilibrio rotacional, ponto de apoio e distribuicao de massa. | Fase 3 `ready`; modelo analitico de alavanca com pesos pontuais, forca externa, centro de massa, torque resultante e energia por corpo. |
| Rotacao | Rotacao de corpo rigido | Momento de inercia, torque, aceleracao angular, energia rotacional. | Fase 3 `ready`; solucao angular deterministica com torque constante, amortecimento linear opcional, massa movel radial e modo de energia constante aprovado manualmente. |
| Rotacao | Rolamento sem escorregamento | Relacao translacao/rotacao, energia e condicao de escorregamento. | Fase 3 `ready`; modelo analitico de cilindro solido com limite de atrito estatico, roda Three.js e warning de escorregamento aprovado manualmente. |
| Gravitacao | Campo gravitacional e orbitas | Lei da gravitacao, campo, velocidade orbital, orbitas circulares/elipticas didaticas. | Fase 3 `ready`; campo central de dois corpos com amostragem eliptica didatica, orbitas e vetores em Three.js, aprovado manualmente. |
| Fluidos basicos | Hidrostatica e empuxo | Pressao, massa/volume, densidade derivada, Arquimedes, tanque transparente e flutuacao. | Fase 3 `ready`; modelo analitico `rho*g*h`, `rho=m/V`, movimento vertical, fracao submersa e warning de afundamento, aprovado manualmente. |
| Fluidos basicos | Continuidade e Bernoulli | Vazao, velocidade, pressao, tubo de Venturi translucido, particulas acelerando na garganta, mapa de cor e manometros. | Fase 3 `ready`; modelo ideal de continuidade/Bernoulli com warning para pressao negativa, aprovado manualmente apos revisao visual do Venturi. |

### Presets didaticos por subarea mecanica

Cada subarea mecanica funcional deve ter presets que cubram pelo menos um caso nominal e um limite didatico:

- Cinematica: velocidade constante, aceleracao/gravity customizada, voo balistico e movimento circular.
- Dinamica: equilibrio/deslizamento no plano, massas quase equilibradas em Atwood e perda de aderencia em curva.
- Energia e momento: trilho conservativo/dissipativo, trabalho externo e colisoes elasticas/inelasticas.
- Estatica: equilibrio vetorial, resultante nao nula, alavanca balanceada e torque resultante.
- Rotacao: torque/amortecimento em corpo rigido, rolamento puro e escorregamento.
- Gravitacao: orbita baixa, elipse didatica e planeta massivo.
- Fluidos basicos: flutuacao, afundamento, fluido denso, Venturi moderado, alta vazao e garganta elevada.

## Termodinamica

Objetivo da area: conectar temperatura, calor, trabalho, energia interna, gases e maquinas termicas com diagramas de estado e modelos didaticos.

Implementacao preferencial:

- Modelos analiticos e por etapas para calorimetria, gases e ciclos.
- Three.js ou PixiJS para demonstracoes de particulas quando o objetivo for visual.
- Plotly.js para diagramas `P-V`, `T-V`, curvas de aquecimento e energia no tempo.
- Avisos claros quando o modelo usar gas ideal, equilibrio termico ou processo reversivel.

| Subarea | Simulacao planejada | Conteudo e saidas esperadas | Modelo e tecnologia |
| --- | --- | --- | --- |
| Temperatura | Escalas termometricas e equilibrio | Conversao Celsius/Kelvin/Fahrenheit, equilibrio termico e interpretacao de temperatura. | Algebra direta; UI compacta com tabela e formulas KaTeX. |
| Temperatura | Dilatacao termica | Dilatacao linear, superficial e volumetrica, coeficientes e variacao de comprimento/volume. | Modelo analitico; cena 2.5D simples em Three.js. |
| Calorimetria | Mistura termica | Calor sensivel, massa, calor especifico, temperatura de equilibrio e perdas opcionais. | Conservacao de energia; Plotly para evolucao ate equilibrio. |
| Calorimetria | Mudancas de fase | Calor latente, curva de aquecimento, patamares de fase e energia acumulada. | Modelo por trechos; grafico temperatura por energia/tempo. |
| Gases | Gas ideal | Relacao `P V = n R T`, variaveis de estado, particulas ilustrativas e limites do modelo. | Modelo analitico; Three.js/PixiJS para particulas didaticas. |
| Gases | Transformacoes gasosas | Isotermica, isobarica, isocorica e adiabatica, com diagramas `P-V`. | Solucoes analiticas por processo; Plotly com area de trabalho. |
| Primeira lei | Trabalho, calor e energia interna | Sinais de calor/trabalho, variacao de energia interna e trajetorias no diagrama. | Modelo por processo; grafico `P-V` e tabela de energia. |
| Maquinas termicas | Ciclos termicos e rendimento | Ciclo simples, trabalho liquido, calor absorvido/rejeitado e eficiencia. | Modelo por segmentos; Plotly para ciclo fechado. |
| Segunda lei | Ciclo de Carnot | Reservatorios quente/frio, rendimento maximo e comparacao com maquinas reais. | Modelo analitico; visual de reservatorios e fluxo de energia. |
| Transferencia de calor | Conducao, conveccao e radiacao basicas | Fluxo de calor, gradiente de temperatura, lei de Fourier e Stefan-Boltzmann em modo didatico. | Modelos 1D simples; PixiJS opcional para mapa termico. |

## Oscilacoes e Ondas

Objetivo da area: mostrar sistemas periodicos, ressonancia, propagacao, superposicao, ondas sonoras e optica basica.

Implementacao preferencial:

- Solucoes analiticas para oscilador harmonico simples e ondas senoidais.
- Integradores numericos para amortecimento, forca externa, acoplamentos e ondas em malha.
- PixiJS para campos 2D densos, interferencia e frentes de onda.
- Three.js para cordas 3D/2.5D, modos normais, vetores e superficies.
- Web Audio API quando a simulacao tiver som audivel controlado por frequencia.

A subarea `Oscilacoes e Ondas > Oscilacoes` concentra todos os osciladores: pendulo simples, massa-mola vertical, oscilador amortecido, oscilador forcado com ressonancia e osciladores acoplados. As demais ondas mecanicas, som e optica continuam planejadas, reaproveitando shell, blocos de graficos/tabela/formulas/teoria e padrao renderer-first.

| Subarea | Simulacao planejada | Conteudo e saidas esperadas | Modelo e tecnologia |
| --- | --- | --- | --- |
| Oscilacoes | Pendulo simples | Angulo, velocidade angular, energia, vetores de peso/tensao/velocidade, periodo aproximado e limites de pequeno angulo. | Core da Fase 1 `ready`; motor proprio deterministico, Three.js, live-canvas, KaTeX. |
| Oscilacoes | Massa-mola vertical | Suporte fixo, mola helicoidal pendurada, massa esferica, equilibrio `mg/k`, deslocamento, velocidade, aceleracao, forca elastica, peso e energias. | Fase 4 antecipada como `ready`; solucao analitica em torno do equilibrio, Three.js com eixo Z vertical e live-canvas. |
| Oscilacoes | Oscilador amortecido | Subamortecido, criticamente amortecido, superamortecido, energia dissipada e warnings de regime. | Fase 4 `analysis`; solucao analitica por regimes, Three.js e live-canvas. |
| Oscilacoes | Oscilador forcado e ressonancia | Frequencia externa, amplitude de resposta, fase, trabalho externo, dissipacao e ressonancia. | Fase 4 `analysis`; integracao RK4 deterministica, Three.js e live-canvas. |
| Oscilacoes | Osciladores acoplados | Modos normais, batimentos, troca de energia, modo comum e fase relativa. | Fase 4 `analysis`; integrador RK4 para duas massas acopladas, Three.js e live-canvas. |
| Ondas mecanicas | Onda em corda | Comprimento de onda, frequencia, velocidade, amplitude e pulso viajante. | Solucao de onda 1D; Three.js ou PixiJS. |
| Ondas mecanicas | Superposicao e interferencia | Soma de ondas, interferencia construtiva/destrutiva e principio de superposicao. | Modelo analitico; PixiJS para mapa 2D quando necessario. |
| Ondas mecanicas | Ondas estacionarias | Nos, ventres, harmonicos, frequencia fundamental e modos em corda/tubo. | Solucao analitica; controles de modo e frequencia. |
| Som | Batimentos | Diferenca de frequencias, envoltoria, grafico de pressao e audio opcional. | Modelo analitico; Plotly e Web Audio API opcional. |
| Som | Efeito Doppler | Fonte/observador em movimento, frequencia percebida e limites classicos. | Modelo analitico; cena 2D com frentes de onda. |
| Optica | Reflexao e refracao | Lei de Snell, angulo critico, reflexao interna total e raios. | Ray tracing didatico simples; Three.js ou PixiJS. |
| Optica | Lentes e espelhos | Foco, imagem real/virtual, aumento e equacao dos espelhos/lentes. | Modelo geometrico de raios; cena interativa 2D. |
| Optica | Difracao e interferencia da luz | Fendas, padrao de intensidade, comprimento de onda e distancia. | Modelo analitico de intensidade; Plotly/PixiJS para padrao. |

## Eletromagnetismo

Objetivo da area: cobrir cargas, campos, potencial, circuitos, magnetismo, inducao e ondas eletromagneticas com modelos didaticos leves.

Implementacao preferencial:

- Superposicao vetorial para cargas e campos estaticos.
- Solucoes analiticas para circuitos DC simples, RC, RL e RLC introdutorio.
- Integradores simples para circuitos transientes e cargas em campos.
- Three.js para linhas de campo, vetores, cargas, bobinas e trajetorias.
- PixiJS opcional para mapas 2D densos de campo/potencial.
- Plotly.js para tensao, corrente, carga, energia e resposta em frequencia.

| Subarea | Simulacao planejada | Conteudo e saidas esperadas | Modelo e tecnologia |
| --- | --- | --- | --- |
| Eletrostatica | Lei de Coulomb e campo eletrico | Cargas pontuais, forca, campo resultante, vetores e linhas de campo. | Superposicao vetorial; Three.js/PixiJS para campos. |
| Eletrostatica | Potencial eletrico e equipotenciais | Potencial, energia potencial, linhas equipotenciais e relacao com campo. | Amostragem de campo em grade; Plotly/PixiJS. |
| Eletrostatica | Capacitor de placas paralelas | Campo uniforme aproximado, capacitancia, carga, tensao e energia armazenada. | Modelo analitico; cena com placas e vetores. |
| Circuitos DC | Lei de Ohm e associacao de resistores | Tensao, corrente, resistencia equivalente, potencia e leitura de instrumentos. | Algebra de circuitos simples; UI de componentes discretos. |
| Circuitos DC | Circuito RC transiente | Carga/descarga do capacitor, constante de tempo, tensao e corrente. | Solucao analitica; Plotly para curvas exponenciais. |
| Circuitos AC | Circuito RLC | Oscilacao eletrica, amortecimento, ressonancia e energia em capacitor/indutor. | ODE deterministica; Plotly para transiente e frequencia. |
| Magnetismo | Campo magnetico por corrente | Fio retilineo, espira, solenoide, regra da mao direita e intensidade do campo. | Modelos analiticos locais; Three.js para vetores e linhas. |
| Magnetismo | Forca magnetica | Carga em campo, fio com corrente, trajetoria circular/helicoidal e seletor de velocidades. | Integrador de particula; Three.js para trajetoria. |
| Inducao | Lei de Faraday-Lenz | Fluxo magnetico, fem induzida, sentido da corrente e variacao temporal. | Modelo analitico por cenarios; graficos de fluxo/fem. |
| Inducao | Motor e gerador didatico | Torque em espira, comutacao conceitual, fem alternada e transferencia de energia. | Modelo simplificado; Three.js para bobina e campo. |
| Ondas EM | Onda eletromagnetica plana | Campos `E` e `B`, propagacao, energia e polarizacao basica. | Modelo analitico; Three.js para vetores propagantes. |
| Circuitos AC | Fasores e potencia AC | Fasores, impedancia, fase, potencia media e fator de potencia. | Algebra complexa simples; Plotly para senoidais e fasores. |

## Ordem de evolucao recomendada

1. Validar o pendulo simples como simulacao modelo.
2. Extrair `SimulationDefinition`, `topicPath` e padrao de renderer/graficos/formulas, incluindo runtime visual desacoplado do shell React.
3. Adicionar simulacoes mecanicas analiticas para testar velocidade de producao. Concluido inicialmente com quatro simulacoes de Cinematica, expandido com Atwood, forca centripeta em curva e trabalho/energia em trilho, e depois ampliado com colisoes, equilibrio de particula, torque/alavancas e rotacao de corpo rigido.
4. Concluido: consolidar `Pendulo simples` e `Massa-mola vertical` em `Oscilacoes e Ondas > Oscilacoes`, reutilizando o shell do pendulo para outro oscilador harmonico simples com mola presa ao topo e massa esferica oscilante.
5. Adicionar uma simulacao de `Termodinamica` baseada em diagramas de estado.
6. Adicionar uma simulacao de `Eletromagnetismo` baseada em campo eletrico ou circuito RC.
7. So depois avaliar bibliotecas especializadas por demanda real.

## Criterio para promover uma simulacao para `analysis` ou `ready`

Uma simulacao planejada so deve passar para `analysis` quando:

- passar pelo `Simulation Fidelity Adjustment Guide` e registrar essa auditoria na task;
- o motor fisico passa nos testes definidos;
- parametros invalidos sao tratados sem quebrar a tela;
- parametros fisicamente validos em zero nao sao bloqueados por conveniencia visual;
- regimes e limites de transicao sao declarados; se o modelo for ideal unico, a teoria explica essa restricao;
- cena, graficos, tabela e formulas usam a mesma fonte de dados;
- warnings explicam saturacao, perda de restricao, parada em limite visual ou fim de curso quando esses eventos existirem;
- formulas declaram variaveis, unidades, quando usar e limites;
- o apendice teorico existe e corresponde ao modelo;
- a UI esta legivel no tema dark graphite;
- o smoke test confirma que a simulacao abre pelo catalogo.
- a animacao, quando existir, nao re-renderiza o shell completo em alta frequencia e possui limites de custo visual.

Uma simulacao em `analysis` so deve virar `ready` depois de teste manual do dono do projeto. O teste manual nao substitui o gate de fidelidade; ele confirma que a experiencia esta aprovada como pronta.
