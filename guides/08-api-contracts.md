# API Contracts

## Postura inicial

Nao ha API remota no MVP. Os contratos iniciais sao funcoes TypeScript, JSON local e objetos de dados entre shell, motor numerico, renderizador, graficos e tabela.

## Contrato `SimulationDefinition`

```ts
type SimulationDefinition = {
  id: string;
  areaId: string;
  title: string;
  status: "available" | "planned";
  level: "introductory" | "intermediate" | "advanced";
  defaultParameters: Record<string, number | boolean | string>;
  parameters: SimulationParameter[];
  presets: SimulationPreset[];
  theoryPath: string;
  renderer: "three" | "pixi" | "dom";
  charts: ChartDefinition[];
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

## Exemplo de sample do pendulo

```ts
type PendulumSample = {
  timeSeconds: number;
  angleRadians: number;
  angularVelocityRadiansPerSecond: number;
  xMeters: number;
  yMeters: number;
  kineticEnergyJoules: number;
  potentialEnergyJoules: number;
  totalEnergyJoules: number;
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
- Conteudo teorico em MDX/Markdown local.

## Evolucao prevista

Quando houver backend, manter o formato de `SimulationDefinition` como base para endpoint de catalogo. Ate la, evitar congelar rotas HTTP.
