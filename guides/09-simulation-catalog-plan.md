# Simulation Catalog Plan

## Objetivo

Este guia define o catalogo planejado de simulacoes de fisica basica. Ele nao muda a regra core-first: a primeira entrega funcional continua sendo `Mecanica > Pendulo simples`, com dados locais, motor proprio e sincronizacao completa entre cena, graficos, tabela, formulas e teoria. No catalogo expandido, essa simulacao tambem pode receber o caminho de topico `Mecanica > Oscilacoes > Pendulo simples`.

O catalogo amplo deve nascer como backlog planejado e virar produto funcional em fatias pequenas, sempre reaproveitando o contrato comum de simulacao.

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
- status `planned`, `scaffolded` ou `available`;
- parametros com unidades, minimo, maximo, passo e default;
- presets didaticos;
- modelo fisico declarado, com aproximacoes e limites;
- motor numerico ou analitico deterministico;
- cena interativa, vetores ou overlays relevantes;
- graficos Plotly.js derivados dos mesmos samples da cena;
- tabela sincronizada;
- guia de formulas com quando usar e quando nao usar;
- apendice teorico em MDX/Markdown com KaTeX;
- testes unitarios do modelo e smoke test visual quando a simulacao ficar funcional.

## Tecnologias por familia de simulacao

Base comum:

- React + TypeScript + Vite para aplicacao.
- Material UI para shell, navegacao, paineis, controles e tabelas.
- Three.js como renderer principal para cenas 3D/2.5D, vetores, orbitas, corpos e campos.
- Plotly.js para graficos cientificos.
- MDX/Markdown + KaTeX para teoria e formulas.
- JSON local para catalogo, parametros, presets e status enquanto o core nao estiver validado.
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
| Oscilacoes | Pendulo simples | Angulo, velocidade angular, energia, vetores de peso/tensao/velocidade, periodo aproximado e limites de pequeno angulo. | Core da Fase 1; motor proprio deterministico, Three.js, Plotly.js, KaTeX. |
| Cinematica | Movimento retilineo uniforme | Posicao, deslocamento, velocidade constante, grafico `x(t)` e `v(t)`. | Solucao analitica em `physics-core`; cena 1D/2.5D em Three.js. |
| Cinematica | Movimento uniformemente variado e queda livre | Aceleracao constante, lancamento vertical, queda livre, graficos `x(t)`, `v(t)` e `a(t)`. | Solucao analitica; preset com gravidade terrestre e gravidade customizada. |
| Cinematica | Lancamento obliquo | Alcance, altura maxima, tempo de voo, decomposicao vetorial e trajetoria. | Solucao analitica sem arrasto no primeiro passo; arrasto como extensao numerica posterior. |
| Cinematica | Movimento circular uniforme | Velocidade angular, periodo, frequencia, aceleracao centripeta e vetores tangencial/radial. | Solucao analitica; cena circular com vetores em Three.js. |
| Dinamica | Plano inclinado com atrito | Forcas normal, peso, atrito, aceleracao, energia e condicoes de repouso/deslizamento. | Modelo analitico por regimes; diagrama de corpo livre em Three.js. |
| Dinamica | Maquina de Atwood | Tensao, aceleracao, massas acopladas, energia e comparacao de massas. | Equacoes de Newton; integracao deterministica simples para playback. |
| Dinamica | Forca centripeta em curva | Atrito lateral, raio, velocidade critica e perda de aderencia. | Modelo analitico com alertas de limite; cena em Three.js. |
| Energia e momento | Trabalho e energia em trilho | Trabalho de forcas, energia cinetica/potencial, conservacao e dissipacao. | Integrador simples; grafico de energia e marcadores de trabalho. |
| Energia e momento | Colisoes 1D e 2D | Momento linear, impulso, coeficiente de restituicao, colisao elastica/inelastica. | Motor proprio para poucas particulas; Rapier/Matter.js apenas se a cena crescer. |
| Estatica | Equilibrio de particula | Soma vetorial de forcas, cabos, tracao e resultante nula. | Algebra vetorial simples; manipuladores de vetores em Three.js. |
| Estatica | Torque, alavancas e centro de massa | Momento de forca, equilibrio rotacional, ponto de apoio e distribuicao de massa. | Modelo analitico; cena 2.5D com vetores e eixos. |
| Rotacao | Rotacao de corpo rigido | Momento de inercia, torque, aceleracao angular, energia rotacional. | Equacoes diferenciais simples; Three.js para corpos e eixos. |
| Rotacao | Rolamento sem escorregamento | Relacao translacao/rotacao, energia e condicao de escorregamento. | Modelo analitico com limites; Three.js para roda e trilho. |
| Gravitacao | Campo gravitacional e orbitas | Lei da gravitacao, campo, velocidade orbital, orbitas circulares/elipticas didaticas. | Integrador Verlet/RK4; Three.js para orbitas e vetores. |
| Fluidos basicos | Hidrostatica e empuxo | Pressao, profundidade, principio de Pascal, Arquimedes e flutuacao. | Modelo analitico; cena com corpo submerso e graficos de pressao. |
| Fluidos basicos | Continuidade e Bernoulli | Vazao, velocidade, pressao, tubo de Venturi e limites do fluido ideal. | Modelo analitico; Three.js ou PixiJS se houver particulas 2D densas. |

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

| Subarea | Simulacao planejada | Conteudo e saidas esperadas | Modelo e tecnologia |
| --- | --- | --- | --- |
| Oscilacoes | Massa-mola | Lei de Hooke, periodo, energia, fase, amplitude e grafico posicao/velocidade. | Solucao analitica e integrador comparativo; Three.js. |
| Oscilacoes | Oscilador amortecido | Subamortecido, criticamente amortecido, superamortecido, energia dissipada. | Solucao analitica por regimes; Plotly para envelope. |
| Oscilacoes | Oscilador forcado e ressonancia | Frequencia externa, amplitude de resposta, fase e curva de ressonancia. | Integracao numerica deterministica; grafico amplitude x frequencia. |
| Oscilacoes | Osciladores acoplados | Modos normais, batimentos, troca de energia e fase relativa. | Integrador simples para dois ou poucos osciladores; Three.js. |
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
2. Extrair `SimulationDefinition`, `topicPath` e padrao de renderer/graficos/formulas.
3. Adicionar duas ou tres simulacoes mecanicas analiticas para testar velocidade de producao.
4. Adicionar uma simulacao de `Oscilacoes e Ondas` que reutilize o pendulo ou massa-mola.
5. Adicionar uma simulacao de `Termodinamica` baseada em diagramas de estado.
6. Adicionar uma simulacao de `Eletromagnetismo` baseada em campo eletrico ou circuito RC.
7. So depois avaliar bibliotecas especializadas por demanda real.

## Criterio para promover uma simulacao para `available`

Uma simulacao planejada so deve aparecer como disponivel quando:

- o motor fisico passa nos testes definidos;
- parametros invalidos sao tratados sem quebrar a tela;
- cena, graficos, tabela e formulas usam a mesma fonte de dados;
- formulas declaram variaveis, unidades, quando usar e limites;
- o apendice teorico existe e corresponde ao modelo;
- a UI esta legivel no tema dark graphite;
- o smoke test confirma que a simulacao abre pelo catalogo.
