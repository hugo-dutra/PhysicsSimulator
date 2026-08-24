# API Contracts

## Postura inicial

Nao ha API remota no MVP. Os contratos iniciais sao funcoes TypeScript, JSON local e objetos de dados entre shell, motor numerico, renderizador, graficos, tabela, formulas e teoria.

## Contrato `SimulationDefinition`

```ts
type SimulationDefinition = {
  id: string;
  areaId: string;
  topicPath: string[];
  title: string;
  status: "analysis" | "planned" | "ready";
  level: "introductory" | "intermediate" | "advanced";
  modelKind: "analytic" | "numerical" | "field-sampling" | "particle-demo" | "hybrid";
  defaultParameters: Record<string, number | boolean | string>;
  runtimeParameters?: SimulationParameter[];
  parameters: SimulationParameter[];
  presets: SimulationPreset[];
  theoryPath: string;
  formulas: FormulaReference[];
  renderer: "three" | "pixi" | "dom";
  technologyPlan: SimulationTechnologyPlan;
  charts: ChartDefinition[];
};
```

Semantica do status:

- `planned`: item planejado, visivel no catalogo, mas bloqueado para execucao.
- `analysis`: item implementado e executavel, aguardando teste manual do dono do projeto; subareas com este status iniciam abertas na sidebar.
- `ready`: item implementado, executavel e aprovado manualmente; permanece fechado por padrao quando nao houver simulacoes em `analysis` na mesma subarea.

## Contrato `SimulationTechnologyPlan`

```ts
type SimulationTechnologyPlan = {
  engine: "custom-analytic" | "custom-numerical" | "rapier" | "matter" | "precomputed";
  charting: "plotly" | "live-canvas";
  content: "mdx-katex";
  optionalLibraries?: ("pixi" | "d3" | "manim" | "web-audio")[];
  notes?: string;
};
```

## Contrato `SimulationParameter`

```ts
type SimulationParameter = {
  id: string;
  label: string;
  description: string;
  unit?: string;
  kind: "number" | "boolean" | "choice";
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | boolean | string;
};
```

`description` e obrigatoria para todo parametro fisico e para todo `runtimeParameter`. Ela alimenta a tooltip com icone de interrogacao no painel de controles e deve explicar o que a variavel representa, como ela participa do modelo e qual efeito esperado ao aumentar, diminuir ou zerar o valor quando isso for valido. Controles globais de runtime, como velocidade de passagem do tempo `0..1`, seguem o mesmo formato de ajuda mesmo quando nao pertencem a uma fixture especifica. O shell oferece os atalhos compartilhados `0,1x`, `0,25x`, `0,5x`, `0,75x` e `1x`, todos dentro desse contrato.

## Contrato `FormulaReference`

```ts
type FormulaReference = {
  id: string;
  title: string;
  expressionLatex: string;
  description: string;
  variables: FormulaVariable[];
  usedWhen: string;
  notUsedWhen?: string;
  parameterIds: string[];
  sampleFields: string[];
  relatedChartIds?: string[];
  relatedVectorIds?: string[];
  example?: string;
};

type FormulaVariable = {
  symbol: string;
  label: string;
  unit?: string;
};
```

## Contrato `SimulationRegime`

```ts
type SimulationRegime = {
  id: string;
  label: string;
  condition: string;
  transitionLimit?: string;
  sampleFields: string[];
  warningCode?: string;
  idealReferenceFields?: string[];
};

type SimulationWarning = {
  code: string;
  message: string;
  regimeId?: string;
  sampleFields?: string[];
};
```

Simulacoes sem troca de regime ainda devem declarar, no fixture, na teoria ou no guia de formulas, que operam em um regime ideal unico e quais limites ficam fora do modelo.

## Contrato do motor numerico

```ts
type SimulationInput<TParams> = {
  parameters: TParams;
  durationSeconds: number;
  sampleRateHz: number;
};

type SimulationResult<TState, TSample> = {
  initialState: TState;
  samples: TSample[];
  warnings: SimulationWarning[];
};

type SimulationEngine<TParams, TState, TSample> = {
  compute(input: SimulationInput<TParams>): SimulationResult<TState, TSample>;
  step(state: TState, deltaTimeSeconds: number, parameters: TParams): TState;
};
```

`durationSeconds` representa o horizonte calculado inicial de samples entregue ao renderer, graficos e tabela. O playback visual deve manter um contador continuo enquanto estiver em play, estender ou calcular samples futuros quando necessario e so voltar o relogio da interface para zero quando o usuario acionar reset. A escala visual de tempo e aplicada sobre o delta do runtime: `1` e tempo normal, valores intermediarios desaceleram a leitura continua, e `0` pausa sem alterar os samples calculados.

## Contrato temporario de fixture de simulacao

```ts
type SimulationFixture = {
  simulationId: string;
  durationSeconds: number;
  sampleRateHz: number;
  chartWindowSeconds: number;
  runtimeParameters: SimulationParameter[];
  defaultParameters: Record<string, number | boolean | string>;
  parameters: SimulationParameter[];
  presets: SimulationPreset[];
  regimes?: SimulationRegime[];
  formulas: FormulaReference[];
};
```

Quando `regimes` existir, o resultado do motor deve usar warnings e campos de sample suficientes para que cena, graficos, tabela, formulas e teoria descrevam o mesmo regime aplicado. Uma mudanca de regime nao pode existir apenas como texto de UI.
Toda entrada em `runtimeParameters` e `parameters` deve declarar `description`; fixtures sem essa legenda nao passam no contrato local de catalogo.

## Exemplo de sample do pendulo

```ts
type PendulumSample = {
  timeSeconds: number;
  angleRadians: number;
  angularVelocityRadiansPerSecond: number;
  angularAccelerationRadiansPerSecondSquared: number;
  linearVelocityMetersPerSecond: number;
  tangentialAccelerationMetersPerSecondSquared: number;
  radialAccelerationMetersPerSecondSquared: number;
  totalAccelerationMetersPerSecondSquared: number;
  xMeters: number;
  yMeters: number;
  kineticEnergyJoules: number;
  potentialEnergyJoules: number;
  totalEnergyJoules: number;
};
```

## Exemplo de sample do plano inclinado

```ts
type InclinedPlaneSample = {
  timeSeconds: number;
  positionMeters: number;
  velocityMetersPerSecond: number;
  accelerationMetersPerSecondSquared: number;
  heightMeters: number;
  xMeters: number;
  zMeters: number;
  normalForceNewtons: number;
  weightParallelNewtons: number;
  frictionMagnitudeNewtons: number;
  frictionForceNewtons: number;
  netForceNewtons: number;
  kineticEnergyJoules: number;
  potentialEnergyJoules: number;
  thermalEnergyJoules: number;
  totalEnergyJoules: number;
  isMoving: boolean;
};
```

## Exemplo de sample de Cinematica

O nome historico `KinematicsSample` cobre hoje o motor analitico/numerico compartilhado de Cinematica, Dinamica, Energia/momento, Estatica, Rotacao, Gravitacao, Fluidos basicos, massa-mola vertical, os tres primeiros osciladores de `Oscilacoes e Ondas`, as ondas mecanicas funcionais, as primeiras simulacoes de som e a primeira fatia de Optica. Nas ondas, `positionMeters/zMeters` representam o deslocamento transversal no probe quando a onda for transversal, `speedMetersPerSecond` representa a velocidade de propagacao, `frequencyHertz` representa a frequencia aplicada ou modal, `periodSeconds` representa `1/f` quando houver oscilacao, `secondaryRadiusMeters` representa comprimento de onda efetivo ou modal conforme a simulacao, `secondaryZMeters` e `displacementMeters` carregam componentes/envelope quando a simulacao precisar, e as derivadas de velocidade/aceleracao continuam no mesmo sample. Em `Onda em corda`, `tensionNewtons` tambem pode carregar a tensao que alimenta `v = sqrt(T/mu)`. Em `Onda longitudinal em mola`, `positionMeters/zMeters` representam o deslocamento longitudinal do elo no probe, `xMeters` e a posicao de equilibrio do elo, `velocityXMetersPerSecond` e `accelerationXMetersPerSecondSquared` sao as derivadas materiais paralelas ao eixo da mola, `forceOneNewtons` registra a compressao local adimensional, `springForceNewtons` a forca elastica longitudinal e `secondaryRadiusMeters` o comprimento de onda efetivo ligado por `sqrt(C/mu)` ou `lambda f`. Em `Superposicao e interferencia`, `secondaryRadiusMeters` acompanha a relacao inversa `lambda = v/f`; em `Ondas estacionarias`, registra `lambda_n = 2L/n`. Em `Batimentos`, `pressurePascals`/`positionMeters` representam a pressao resultante no probe, `secondaryPressurePascals` representa a envoltoria e `secondarySpeedMetersPerSecond` representa a frequencia media. Em `Efeito Doppler`, `frequencyHertz` representa a frequencia observada, `secondarySpeedMetersPerSecond` a frequencia emitida, `secondaryRadiusMeters` o comprimento de onda efetivo na direcao do observador e `secondaryXMeters` a posicao da fonte movel. Em `Reflexao e refracao`, `positionMeters` carrega o angulo incidente em graus, `displacementMeters` o angulo refratado, `forceOneNewtons` o angulo critico, `forceTwoNewtons` a reflexao percentual e `pressurePascals` a transmissao percentual. Em `Lentes e espelhos`, `positionMeters` e `displacementMeters` carregam distancias de objeto/imagem, `forceOneNewtons` o foco assinado, `secondaryRadiusMeters` o aumento e `secondaryZMeters` a altura de imagem. Em `Difracao e interferencia da luz`, `pressurePascals`/`totalEnergyJoules` representam intensidade normalizada, `displacementMeters` a envoltoria, `secondaryPressurePascals` o termo de interferencia e `secondaryRadiusMeters` o espacamento aproximado entre franjas. O volume 3D de pontinhos sonoros e uma extrusao visual do renderer sobre esse perfil 1D, sem novos campos contratuais. Campos sem uso em uma simulacao ficam zerados, mas toda grandeza exibida em cena, grafico, tabela ou formula deve vir do sample.

Para `Campo gravitacional e orbitas` e `Curvatura gravitacional em malha 3D`, `specificGravitationalPotentialJoulesPerKilogram` e a grandeza fisica `-GM/r`. `spacetimeCentralDeformation`, `spacetimeOrbitingDeformation` e `spacetimeMoonDeformation` sao escalas visuais adimensionais materializadas pelo motor para as analogias de malha; os dois pocos menores podem ser amplificados didaticamente e nenhum desses campos participa da dinamica orbital. `spacetimeCentralInfluenceScale`, `spacetimeOrbitingInfluenceScale` e `spacetimeMoonInfluenceScale` sao escalas adimensionais derivadas da raiz cubica das massas de referencia e sincronizam graficos, tabela e o alcance visual do renderer volumetrico. A escala lunar parte da razao didatica `0,0123` sobre a massa orbital e a intensidade recebe ganho visual fixo de `3x`; a separacao minima de `1,55` celula-base e apenas uma projecao do renderer. Na fixture volumetrica, o contrato de `centralMassEarths` e `0,05..20 M_terra`; `latticeDensityMultiplier` aceita `1..10`, inicia em `1` e controla apenas o alvo aproximado de cubos/vertices renderizados; `orbitingBodyVisible`, `orbitTrailVisible` e `moonEnabled` sao booleanos com padrao `true`. Os dois primeiros controlam a mesh orbital e suas linhas de referencia/rastro; `moonEnabled` controla Lua, guia local e inclusao do terceiro poco no renderer, preservando seus campos no sample. `lightBeamEnabled` e booleano e usa `false` por padrao, `lightBeamPlane` aceita `xy|yz|xz` e inicia em `yz`, os offsets U/V aceitam celulas inteiras de `-6..6` e iniciam em `0/2`, e `lightBeamProgressPercent` aceita `0..100` com padrao `100`. Esses campos pertencem ao renderer e nao modificam o `KinematicsSample`. Na malha volumetrica, `fabricLineOpacity` aceita `0..1`, usa `0.25` por padrao e nao participa da dinamica nem das series fisicas; o tecido 2D preserva seu proprio padrao `0.6`.

```ts
type KinematicsSample = {
  timeSeconds: number;
  positionMeters: number;
  displacementMeters: number;
  energyLossPercent: number;
  xMeters: number;
  zMeters: number;
  primaryRadiusMeters: number;
  secondaryXMeters: number;
  secondaryZMeters: number;
  secondaryRadiusMeters: number;
  leftArmMeters: number;
  rightArmMeters: number;
  appliedForceArmMeters: number;
  secondaryVelocityMetersPerSecond: number;
  secondaryVelocityXMetersPerSecond: number;
  secondaryVelocityZMetersPerSecond: number;
  secondarySpeedMetersPerSecond: number;
  velocityMetersPerSecond: number;
  velocityXMetersPerSecond: number;
  velocityZMetersPerSecond: number;
  speedMetersPerSecond: number;
  accelerationMetersPerSecondSquared: number;
  accelerationXMetersPerSecondSquared: number;
  accelerationZMetersPerSecondSquared: number;
  angleRadians: number;
  angularVelocityRadiansPerSecond: number;
  angularAccelerationRadiansPerSecondSquared: number;
  periodSeconds: number;
  frequencyHertz: number;
  centripetalAccelerationMetersPerSecondSquared: number;
  centripetalForceNewtons: number;
  couplingPotentialEnergyJoules: number;
  gravitationalFieldNewtonsPerKilogram: number;
  spacetimeCentralDeformation: number;
  spacetimeOrbitingDeformation: number;
  spacetimeCentralInfluenceScale: number;
  spacetimeOrbitingInfluenceScale: number;
  spacetimeMoonDeformation: number;
  spacetimeMoonInfluenceScale: number;
  specificGravitationalPotentialJoulesPerKilogram: number;
  maxStaticFrictionNewtons: number;
  frictionForceNewtons: number;
  elasticPotentialEnergyJoules: number;
  fluidPressurePascals: number;
  gravitationalPotentialEnergyJoules: number;
  leftGravitationalPotentialEnergyJoules: number;
  rightGravitationalPotentialEnergyJoules: number;
  pressurePascals: number;
  springForceNewtons: number;
  secondaryPressurePascals: number;
  flowRateCubicMetersPerSecond: number;
  crossSectionAreaSquareMeters: number;
  secondaryCrossSectionAreaSquareMeters: number;
  buoyantForceNewtons: number;
  submergedFraction: number;
  objectMassKilograms: number;
  objectDensityKilogramsPerCubicMeter: number;
  forceOneNewtons: number;
  forceOneXNewtons: number;
  forceOneZNewtons: number;
  forceTwoNewtons: number;
  forceTwoXNewtons: number;
  forceTwoZNewtons: number;
  forceThreeNewtons: number;
  forceThreeXNewtons: number;
  forceThreeZNewtons: number;
  normalForceNewtons: number;
  tensionNewtons: number;
  netForceNewtons: number;
  netTorqueNewtonMeters: number;
  weightNewtons: number;
  appliedForceNewtons: number;
  appliedForceXNewtons: number;
  appliedForceZNewtons: number;
  appliedWorkJoules: number;
  thermalEnergyJoules: number;
  gripRatio: number;
  impulseNewtonSeconds: number;
  momentumKilogramMetersPerSecond: number;
  momentumXKilogramMetersPerSecond: number;
  momentumZKilogramMetersPerSecond: number;
  kineticEnergyLostJoules: number;
  leftElasticPotentialEnergyJoules: number;
  leftKineticEnergyJoules: number;
  rightElasticPotentialEnergyJoules: number;
  rightKineticEnergyJoules: number;
  centerOfMassMeters: number;
  momentOfInertiaKilogramMetersSquared: number;
  kineticEnergyJoules: number;
  potentialEnergyJoules: number;
  totalEnergyJoules: number;
  isGrounded: boolean;
};
```

Em `Osciladores acoplados`, os parametros especificos sao `massOneKilograms`, `massTwoKilograms`, `springConstantOneNewtonsPerMeter`, `springConstantTwoNewtonsPerMeter`, `couplingSpringConstantNewtonsPerMeter`, `dampingNewtonSecondsPerMeter`, `gravityMetersPerSecondSquared` e condicoes iniciais por massa. O sample deve usar `positionMeters/secondaryZMeters` para deslocamentos, `velocityMetersPerSecond/secondaryVelocityMetersPerSecond` para velocidades, `displacementMeters` para deslocamento relativo, `centerOfMassMeters` para modo comum, `tensionNewtons` para acoplamento, `forceOne*`, `forceTwo*`, `forceThree*`, `springForceNewtons` e `weightNewtons` para vetores didaticos, e `leftKineticEnergyJoules`, `rightKineticEnergyJoules`, `leftElasticPotentialEnergyJoules`, `rightElasticPotentialEnergyJoules`, `couplingPotentialEnergyJoules`, `thermalEnergyJoules` e `totalEnergyJoules` para barras, graficos e formulas de energia.

Em `Hidrostatica e empuxo`, `objectMassKilograms` vem do controle de massa, `objectDensityKilogramsPerCubicMeter` e derivada de `m/V`, `primaryRadiusMeters` e o raio fisico/visual da esfera e `secondaryRadiusMeters` e a profundidade fixa do tanque transparente. Esses campos precisam concordar com pressao, empuxo, resultante, aceleracao, fracao submersa, graficos e warnings; mudar volume nao deve redimensionar o tanque.

## Erros esperados

- `INVALID_PARAMETER_RANGE`: parametro fora de minimo/maximo.
- `INVALID_UNIT`: unidade nao suportada.
- `SIMULATION_NOT_RUNNABLE`: simulacao planejada, mas ainda nao implementada.
- `RENDERER_INIT_FAILED`: canvas ou renderer nao inicializou.
- `THEORY_CONTENT_MISSING`: apendice teorico nao encontrado.

## Contratos temporarios de mock

- Catalogo em `fixtures/simulations/catalog.json`.
- Presets em JSON por simulacao.
- Formulas e metadados de uso em JSON ou frontmatter MDX por simulacao.
- Conteudo teorico em MDX/Markdown local.

## Evolucao prevista

Quando houver backend, manter o formato de `SimulationDefinition` como base para endpoint de catalogo. Ate la, evitar congelar rotas HTTP.
