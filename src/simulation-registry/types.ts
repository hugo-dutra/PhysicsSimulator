export type SimulationStatus = 'available' | 'scaffolded' | 'planned'

export type SimulationLevel = 'introductory' | 'intermediate' | 'advanced'

export type SimulationModelKind =
  | 'analytic'
  | 'numerical'
  | 'field-sampling'
  | 'particle-demo'
  | 'hybrid'

export type SimulationRenderer = 'three' | 'pixi' | 'dom'

export type ParameterValue = number | boolean | string

export type SimulationTechnologyPlan = {
  engine: 'custom-analytic' | 'custom-numerical' | 'rapier' | 'matter' | 'precomputed'
  charting: 'plotly' | 'live-canvas'
  content: 'mdx-katex'
  optionalLibraries?: ('pixi' | 'd3' | 'manim' | 'web-audio')[]
  notes?: string
}

export type ChartDefinition = {
  id: string
  title: string
  sampleFields: string[]
}

export type SimulationDefinition = {
  id: string
  areaId: string
  topicPath: string[]
  title: string
  status: SimulationStatus
  level: SimulationLevel
  modelKind: SimulationModelKind
  renderer: SimulationRenderer
  fixturePath?: string
  theoryPath?: string
  description: string
  technologyPlan?: SimulationTechnologyPlan
  charts?: ChartDefinition[]
}

export type KnowledgeArea = {
  id: string
  label: string
  description: string
  simulations: SimulationDefinition[]
}

export type SimulationCatalog = {
  areas: KnowledgeArea[]
}

export type SimulationParameter = {
  id: string
  label: string
  unit?: string
  kind: 'number' | 'boolean' | 'choice'
  min?: number
  max?: number
  step?: number
  defaultValue: ParameterValue
}

export type SimulationPreset = {
  id: string
  label: string
  parameters: Record<string, ParameterValue>
}

export type FormulaVariable = {
  symbol: string
  label: string
  unit?: string
}

export type FormulaReference = {
  id: string
  title: string
  expressionLatex: string
  description: string
  variables: FormulaVariable[]
  usedWhen: string
  notUsedWhen?: string
  parameterIds: string[]
  sampleFields: string[]
  relatedChartIds?: string[]
  relatedVectorIds?: string[]
  example?: string
}

export type SimulationFixture = {
  simulationId: string
  durationSeconds: number
  sampleRateHz: number
  chartWindowSeconds: number
  runtimeParameters: SimulationParameter[]
  defaultParameters: Record<string, ParameterValue>
  parameters: SimulationParameter[]
  presets: SimulationPreset[]
  limits: string[]
  formulas: FormulaReference[]
}
