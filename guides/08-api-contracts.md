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
  status: "available" | "scaffolded" | "planned";
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
  unit?: string;
  kind: "number" | "boolean" | "choice";
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | boolean | string;
};
```

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

```ts
type KinematicsSample = {
  timeSeconds: number;
  positionMeters: number;
  displacementMeters: number;
  xMeters: number;
  zMeters: number;
  secondaryXMeters: number;
  secondaryZMeters: number;
  velocityMetersPerSecond: number;
  velocityXMetersPerSecond: number;
  velocityZMetersPerSecond: number;
  speedMetersPerSecond: number;
  accelerationMetersPerSecondSquared: number;
  accelerationXMetersPerSecondSquared: number;
  accelerationZMetersPerSecondSquared: number;
  angleRadians: number;
  angularVelocityRadiansPerSecond: number;
  periodSeconds: number;
  frequencyHertz: number;
  centripetalAccelerationMetersPerSecondSquared: number;
  centripetalForceNewtons: number;
  maxStaticFrictionNewtons: number;
  frictionForceNewtons: number;
  normalForceNewtons: number;
  tensionNewtons: number;
  netForceNewtons: number;
  weightNewtons: number;
  appliedForceNewtons: number;
  appliedWorkJoules: number;
  thermalEnergyJoules: number;
  gripRatio: number;
  kineticEnergyJoules: number;
  potentialEnergyJoules: number;
  totalEnergyJoules: number;
  isGrounded: boolean;
};
```

## Erros esperados

- `INVALID_PARAMETER_RANGE`: parametro fora de minimo/maximo.
- `INVALID_UNIT`: unidade nao suportada.
- `SIMULATION_NOT_AVAILABLE`: simulacao planejada, mas ainda nao implementada.
- `RENDERER_INIT_FAILED`: canvas ou renderer nao inicializou.
- `THEORY_CONTENT_MISSING`: apendice teorico nao encontrado.

## Contratos temporarios de mock

- Catalogo em `fixtures/simulations/catalog.json`.
- Presets em JSON por simulacao.
- Formulas e metadados de uso em JSON ou frontmatter MDX por simulacao.
- Conteudo teorico em MDX/Markdown local.

## Evolucao prevista

Quando houver backend, manter o formato de `SimulationDefinition` como base para endpoint de catalogo. Ate la, evitar congelar rotas HTTP.
