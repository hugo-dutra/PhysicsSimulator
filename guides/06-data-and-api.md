# Data And API

## Entidades principais

- `KnowledgeArea`: area principal como Mecanica, Termodinamica, Oscilacoes e Ondas ou Eletromagnetismo.
- `SimulationTopicPath`: caminho hierarquico como `Mecanica > Cinematica > Lancamento obliquo`.
- `SimulationDefinition`: metadados, area, status, parametros, renderizador, graficos e teoria.
- `SimulationTechnologyPlan`: motor, renderer, bibliotecas opcionais e estrategia de graficos/conteudo esperados.
- `SimulationParameter`: nome, legenda de ajuda, unidade, tipo, minimo, maximo, passo e valor padrao.
- `SimulationRuntimeParameter`: controle de runtime com o mesmo formato de parametro, para horizonte calculado de samples, janela de grafico, velocidade de passagem do tempo e outros ajustes nao fisicos.
- `SimulationPreset`: conjunto nomeado de parametros para demonstracao.
- `SimulationRegime`: regime fisico declarado, com condicao de validade, limite de transicao, campos de sample afetados e warning associado quando houver troca de regime.
- `SimulationState`: estado instantaneo do sistema fisico.
- `SimulationSample`: amostra derivada para graficos e tabela, incluindo cinematicas calculadas pelo motor quando forem exibidas.
- `VectorOverlay`: vetor exibido na cena, como peso, tensao ou velocidade, acompanhado por cor, rotulo, modulo atual, unidade abreviada quando houver e metadados suficientes para legenda.
- `ChartSeries`: serie derivada dos samples.
- `FormulaReference`: formula usada pela simulacao, com variaveis, unidades, condicoes de uso e relacao com parametros/samples.
- `TheoryAppendix`: conteudo teorico em MDX/Markdown.

## Dados mockados/fixtureados da fase core

Usar JSON local para:

- catalogo de areas;
- subareas e caminhos de topico;
- simulacoes em analise;
- simulacoes prontas;
- simulacoes planejadas;
- status das simulacoes;
- parametros default;
- parametros de runtime, como horizonte calculado de samples, janela temporal dos graficos e velocidade de passagem do tempo;
- descricoes de ajuda para todo parametro fisico e de runtime, usadas nas tooltips de interrogacao do painel de controles;
- presets;
- formulas e metadados de uso;
- textos curtos de descricao.

O fixture `fixtures/simulations/catalog.json` deve listar todo o catalogo curricular planejado em `09-simulation-catalog-plan.md`. A UI deriva dele a sidebar hierarquica por `area > subarea > simulacao`; itens com `status: "analysis"` ou `status: "ready"` podem ser selecionaveis e executaveis, enquanto `planned` fica bloqueado. Subareas com ao menos uma simulacao `analysis` iniciam abertas; subareas apenas `ready` ou `planned` iniciam recolhidas. No estado atual, `simple-pendulum`, `mass-spring`, `uniform-linear-motion`, `uniformly-accelerated-motion`, `projectile-motion`, `uniform-circular-motion`, `inclined-plane-friction`, `atwood-machine`, `centripetal-force-curve`, `work-energy-track`, `collisions-1d-2d`, `particle-equilibrium`, `torque-levers-center-mass`, `rigid-body-rotation`, `rolling-without-slipping`, `gravitational-field-orbits`, `hydrostatics-buoyancy`, `continuity-bernoulli`, `damped-oscillator`, `forced-oscillator-resonance`, `coupled-oscillators`, `wave-on-string`, `superposition-interference`, `standing-waves`, `beats` e `doppler-effect` sao `ready`; os demais permanecem `planned` ate terem motor, cena, graficos, tabela, formulas e teoria. O status `ready` fica reservado para simulacoes aprovadas manualmente pelo dono do projeto.

Usar MDX/Markdown local para:

- apendice teorico;
- formulas com KaTeX;
- explicacao de quando usar cada formula;
- limites do modelo.

O estado fisico, samples, graficos e tabela devem ser gerados pelo motor numerico ou analitico em runtime. No pendulo simples, o sample tambem carrega velocidade linear tangencial, aceleracao angular, aceleracao tangencial, aceleracao radial e modulo total de aceleracao para manter graficos, tabela, metricas, formulas e legenda sincronizados. No plano inclinado com atrito, o sample carrega posicao no plano, velocidade, aceleracao, altura, coordenadas da cena, normal, componente paralela do peso, atrito, resultante, energia cinetica, potencial, termica e total. Nas simulacoes analiticas compartilhadas, o sample comum carrega posicao, deslocamento, coordenadas `x/z`, componentes de velocidade/aceleracao, rapidez, energia e campos especificos como angulo, periodo, frequencia, aceleracao centripeta, tensao, forca centripeta, atrito maximo, trabalho aplicado, dissipacao, percentual de perda, velocidades e posicoes secundarias, raios de corpos em contato, momento linear, impulso, forcas componentes, centro de massa, bracos de alavanca, torque, momento de inercia, energias cinetica e potencial gravitacional por corpo quando a simulacao compara massas pontuais em lados distintos, grandezas angulares, campo gravitacional, pressao, vazao, areas de secao, empuxo, fracao submersa, forca elastica, extensao estatica da mola e potenciais elastico/gravitacional quando aplicavel. Em `Campo gravitacional e orbitas`, `xMeters/zMeters` alimentam o planeta em orbita, `secondaryXMeters/secondaryZMeters` alimentam a lua didatica ao redor do planeta, `secondaryRadiusMeters` registra o raio visual dessa orbita secundaria e `secondaryVelocity*` registra a velocidade relativa propria da lua visual, desacoplada da velocidade kepleriana instantanea que varia com a excentricidade, sem alterar energia ou forca do problema principal. Em `Rotacao de corpo rigido`, os parametros `slidingMassDistanceMeters` e `slidingMassKilograms` alimentam `I = I_base + m r^2`; os campos `primaryRadiusMeters`, `centerOfMassMeters`, `momentOfInertiaKilogramMetersSquared`, `angularVelocityRadiansPerSecond` e `angularAccelerationRadiansPerSecondSquared` alimentam a posicao da massa movel, o marcador de centro de massa, graficos, tabela, formulas e vetores de rotacao/momento angular. O parametro booleano `constantRotationalEnergy` troca para o modo de energia constante, que conserva `K_rot` calculada a partir da velocidade angular inicial de referencia; quando a massa movel muda `I` por distancia ou valor de massa, `omega` aumenta ou diminui para manter essa energia, enquanto `L = I omega` varia. Em `Trabalho e energia em trilho`, os mesmos campos `positionMeters`, `xMeters`, `zMeters`, `accelerationMetersPerSecondSquared`, `kineticEnergyJoules`, `potentialEnergyJoules`, `thermalEnergyJoules`, `energyLossPercent` e `totalEnergyJoules` alimentam a posicao do corpo, o rastro de perda, o painel compacto de energia, os graficos, a tabela e as formulas. Em `Massa-mola vertical`, `positionMeters`, `zMeters`, `secondaryRadiusMeters`, `springForceNewtons`, `weightNewtons`, `netForceNewtons`, `elasticPotentialEnergyJoules`, `gravitationalPotentialEnergyJoules`, `thermalEnergyJoules` e `totalEnergyJoules` alimentam esfera, mola, equilibrio, vetores, graficos, tabela e formulas. Em `Oscilador amortecido`, `positionMeters`, `zMeters`, `velocityMetersPerSecond`, `frictionForceNewtons`, `springForceNewtons`, `thermalEnergyJoules` e `totalEnergyJoules` alimentam regimes e saidas. Em `Oscilador forcado e ressonancia`, `appliedForceNewtons`, `appliedWorkJoules`, `frictionForceNewtons`, `springForceNewtons`, `positionMeters` e energias alimentam cena, graficos, tabela, formulas e warning de ressonancia. Em `Osciladores acoplados`, `massOneKilograms`, `massTwoKilograms`, `springConstantOneNewtonsPerMeter`, `springConstantTwoNewtonsPerMeter`, `couplingSpringConstantNewtonsPerMeter`, `dampingNewtonSecondsPerMeter`, `gravityMetersPerSecondSquared` e condicoes iniciais alimentam o RK4; `positionMeters`, `secondaryZMeters`, `velocityMetersPerSecond`, `secondaryVelocityMetersPerSecond`, `centerOfMassMeters`, `displacementMeters`, `tensionNewtons`, `springForceNewtons`, `forceOneNewtons`, `forceThreeNewtons`, `forceTwoNewtons`, `leftKineticEnergyJoules`, `rightKineticEnergyJoules`, `leftElasticPotentialEnergyJoules`, `rightElasticPotentialEnergyJoules`, `couplingPotentialEnergyJoules`, `thermalEnergyJoules` e `totalEnergyJoules` alimentam massas, molas, vetores, trilhas, energia por massa, pulsos de acoplamento, modos e troca de energia. Em `Onda em corda`, `positionMeters/zMeters` representam o deslocamento transversal no probe, `speedMetersPerSecond` representa a velocidade de propagacao escolhida pelo regime (`lambda*f` no modo didatico legado ou `sqrt(T/mu)` no modo corda tensionada), `secondaryRadiusMeters` representa o comprimento de onda efetivo exibido, `tensionNewtons` registra a tensao da corda, `frequencyHertz` representa a frequencia da fonte e `displacementMeters` registra o avanco horizontal da perturbacao para cena, graficos e formulas. Em `Superposicao e interferencia`, `positionMeters/zMeters` representam a soma no probe, `secondaryZMeters` e `displacementMeters` carregam as componentes individuais, `velocityMetersPerSecond` e `accelerationMetersPerSecondSquared` carregam as derivadas da resultante e warnings distinguem fase construtiva ou destrutiva. Em `Ondas estacionarias`, `positionMeters/zMeters` representam o deslocamento modal, `displacementMeters` representa o envelope do modo, `speedMetersPerSecond` vem de `sqrt(T/mu)`, `frequencyHertz` vem de `n v/(2L)` e os campos de velocidade/aceleracao alimentam vetores, graficos, tabela, formulas e teoria. Quando houver perda de restricao, contato, falha de equilibrio, afundamento, pressao ideal negativa, dissipacao ou limite didatico de onda, as coordenadas e campos do sample devem representar o regime real calculado, enquanto campos de demanda ideal permanecem disponiveis para comparacao em graficos e formulas.

Nas ondas mecanicas, `periodSeconds` deve sempre representar `1/f` quando `frequencyHertz > 0`. Em `Superposicao e interferencia`, ajustes de frequencia e comprimento de onda mantem a velocidade atual do meio, preservando `v = lambda f` e `lambda = v/f`; `secondaryRadiusMeters` registra esse comprimento de onda. Em `Ondas estacionarias`, `secondaryRadiusMeters` registra `lambda_n = 2L/n`, enquanto `frequencyHertz` e `periodSeconds` registram `f_n = v/lambda_n` e `1/f_n`.

Nas simulacoes de som, `pressurePascals`/`positionMeters` representam a pressao acustica no probe para compatibilidade com cena e graficos, `secondaryPressurePascals` carrega a envoltoria em `Batimentos`, `frequencyHertz` representa frequencia de batimento ou frequencia observada, `secondarySpeedMetersPerSecond` representa frequencia media/emissora quando aplicavel, `speedMetersPerSecond` representa a velocidade do meio, `secondaryRadiusMeters` representa comprimento de onda efetivo e `secondaryXMeters` posiciona a fonte movel em loop dentro do meio em `Efeito Doppler`, mantendo a fase de emissao em tempo absoluto. Os pontinhos do renderer leem esses campos como marcadores de pressao e podem extrudar o perfil 1D em um volume 3D didatico; nao sao particulas materiais independentes do motor nem adicionam novos campos de propagacao 3D ao sample.

Em `Hidrostatica e empuxo`, `objectMassKilograms` e `objectVolumeCubicMeters` definem `objectDensityKilogramsPerCubicMeter = m/V`; `primaryRadiusMeters` define o raio visual da esfera, `secondaryRadiusMeters` define a profundidade fixa do tanque, `zMeters`, `velocityZMetersPerSecond` e `accelerationZMetersPerSecondSquared` alimentam o movimento vertical, e `buoyantForceNewtons`, `weightNewtons`, `netForceNewtons`, `normalForceNewtons`, `submergedFraction`, `fluidPressurePascals` e `gripRatio` alimentam cena, graficos, tabela, formulas e warnings.

Toda simulacao nova ou alterada deve passar pelo `Simulation Fidelity Adjustment Guide` antes de mudar status para `analysis` ou `ready`. Se o modelo tiver regimes, o contrato local precisa declarar como reconhecer o regime nominal, os limites de transicao, quais campos do `SimulationSample` mudam, quais graficos comparam demanda/limite/valor real e qual `SimulationWarning` explica o regime aplicado. Se o modelo for ideal e sem troca de regime, essa ausencia tambem deve aparecer nos limites do fixture e no apendice teorico. A passagem de `analysis` para `ready` depende de teste manual.

## Exemplo conceitual de catalogo

```json
{
  "areas": [
    {
      "id": "waves",
      "label": "Oscilacoes e Ondas",
      "simulations": [
        {
          "id": "simple-pendulum",
          "label": "Pendulo simples",
          "topicPath": ["Oscilacoes e Ondas", "Oscilacoes", "Pendulo simples"],
          "status": "ready",
          "level": "introductory",
          "modelKind": "numerical",
          "renderer": "three"
        }
      ]
    },
    {
      "id": "mechanics",
      "label": "Mecanica",
      "simulations": [
        {
          "id": "projectile-motion",
          "label": "Lancamento obliquo",
          "topicPath": ["Mecanica", "Cinematica", "Lancamento obliquo"],
          "status": "ready",
          "level": "introductory",
          "modelKind": "analytic",
          "renderer": "three"
        }
      ]
    }
  ]
}
```

## Dados persistidos depois da prova core

Persistencia so deve entrar depois da Fase 1. Possiveis dados futuros:

- parametros favoritos;
- snapshots de simulacao;
- configuracoes de UI;
- progresso de aula;
- conteudo de professor;
- colecoes de simulacoes.

## Read models

- `SidebarCatalog`: areas, subareas, simulacoes e status, derivado de `topicPath` para alimentar menus expansiveis.
- `SimulationViewModel`: parametros, valores atuais, playback, layout e escala de tempo visual `0..1`; a escala altera apenas o avanco do relogio de playback e nao muda parametros fisicos, samples calculados ou formulas.
- `ParameterHelpViewModel`: rotulo, unidade, descricao e faixa/passo do parametro para alimentar a tooltip de interrogacao de cada controle.
- `ChartViewModel`: series prontas para o adapter de grafico escolhido (Plotly.js, canvas ou SVG), com recorte movel dos ultimos N segundos quando configurado.
- `TableViewModel`: amostras paginadas ou recortadas pela mesma janela temporal visivel.
- `VectorLegendViewModel`: cor, rotulo, unidade abreviada quando houver, modulo atual e leitura fisica dos vetores ativos na cena; a legenda detalhada monta apenas quando o bloco de leituras do viewport esta aberto. A legenda compacta sobreposta a area de animacao permanece independente e visual.
- `FormulaGuideViewModel`: formulas renderizaveis, variaveis, unidades, uso indicado e links para parametros/samples.
- `TheoryViewModel`: conteudo teorico associado a simulacao.

## Fronteiras de dados

- Dados de produto: catalogo, simulacoes, presets, formulas e teoria.
- Dados de runtime: estado atual, timeline, samples e overlays.
- Dados de usuario: configuracoes e favoritos futuros.
- Dados de analytics: eventos futuros, fora do MVP.
- Dados operacionais: erros e performance, minimo na fase core.

## Migracao de mock para dados reais

1. Manter o contrato JSON local durante o core.
2. Quando houver multiplas simulacoes, estabilizar `SimulationDefinition`.
3. Quando o catalogo planejado crescer, manter `planned`, `analysis` e `ready` separados.
4. Se conteudo crescer, considerar carregamento estatico ou CMS simples.
5. So introduzir API remota quando houver necessidade de edicao, colaboracao ou persistencia multi-dispositivo.
