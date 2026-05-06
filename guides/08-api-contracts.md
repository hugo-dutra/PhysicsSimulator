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

`description` e obrigatoria para todo parametro fisico e para todo `runtimeParameter`. Ela alimenta a tooltip com icone de interrogacao no painel de controles e deve explicar o que a variavel representa, como ela participa do modelo e qual efeito esperado ao aumentar, diminuir ou zerar o valor quando isso for valido. Controles globais de runtime, como velocidade de passagem do tempo `0..1`, seguem o mesmo formato de ajuda mesmo quando nao pertencem a uma fixture especifica.

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

O nome historico `KinematicsSample` cobre hoje o motor analitico/numerico compartilhado de Cinematica, Dinamica, Energia/momento, Estatica, Rotacao, Gravitacao, Fluidos basicos, massa-mola vertical, os tres primeiros osciladores de `Oscilacoes e Ondas` e as tres primeiras ondas mecanicas. Nas ondas, `positionMeters/zMeters` representam o deslocamento transversal no probe, `speedMetersPerSecond` representa a velocidade de propagacao, `frequencyHertz` representa a frequencia aplicada ou modal, `secondaryZMeters` e `displacementMeters` carregam componentes/envelope quando a simulacao precisar, e as derivadas de velocidade/aceleracao continuam no mesmo sample. Campos sem uso em uma simulacao ficam zerados, mas toda grandeza exibida em cena, grafico, tabela ou formula deve vir do sample.

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
  gravitationalFieldNewtonsPerKilogram: number;
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
  leftKineticEnergyJoules: number;
  rightKineticEnergyJoules: number;
  centerOfMassMeters: number;
  momentOfInertiaKilogramMetersSquared: number;
  kineticEnergyJoules: number;
  potentialEnergyJoules: number;
  totalEnergyJoules: number;
  isGrounded: boolean;
};
```

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
