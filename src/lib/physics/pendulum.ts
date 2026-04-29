export type PendulumParameters = {
  lengthMeters: number
  massKilograms: number
  gravityMetersPerSecondSquared: number
  initialAngleRadians: number
  initialAngularVelocityRadiansPerSecond: number
  dampingPerSecond: number
}

export type PendulumState = {
  timeSeconds: number
  angleRadians: number
  angularVelocityRadiansPerSecond: number
}

export type PendulumSample = PendulumState & {
  angularAccelerationRadiansPerSecondSquared: number
  linearVelocityMetersPerSecond: number
  tangentialAccelerationMetersPerSecondSquared: number
  radialAccelerationMetersPerSecondSquared: number
  totalAccelerationMetersPerSecondSquared: number
  xMeters: number
  yMeters: number
  kineticEnergyJoules: number
  potentialEnergyJoules: number
  totalEnergyJoules: number
}

export type PendulumVectorOverlay = {
  id: 'weight' | 'tension' | 'velocity'
  label: string
  unit: 'N' | 'm/s'
  magnitude: number
  direction: {
    x: number
    y: number
  }
}

export type SimulationWarning = {
  code: string
  message: string
}

export type SimulationInput<TParams> = {
  parameters: TParams
  durationSeconds: number
  sampleRateHz: number
}

export type SimulationResult<TState, TSample> = {
  initialState: TState
  samples: TSample[]
  warnings: SimulationWarning[]
}

export type SimulationEngine<TParams, TState, TSample> = {
  compute: (
    input: SimulationInput<TParams>,
  ) => SimulationResult<TState, TSample>
  step: (
    state: TState,
    deltaTimeSeconds: number,
    parameters: TParams,
  ) => TState
}

type Derivative = {
  angleRadians: number
  angularVelocityRadiansPerSecond: number
}

const pendulumParameterKeys = [
  'lengthMeters',
  'massKilograms',
  'gravityMetersPerSecondSquared',
  'initialAngleRadians',
  'initialAngularVelocityRadiansPerSecond',
  'dampingPerSecond',
] as const

export const pendulumEngine: SimulationEngine<
  PendulumParameters,
  PendulumState,
  PendulumSample
> = {
  compute: computePendulumTimeline,
  step: stepPendulum,
}

export function toPendulumParameters(
  values: Record<string, unknown>,
): PendulumParameters {
  const parameters = Object.fromEntries(
    pendulumParameterKeys.map((key) => [key, readNumber(values, key)]),
  ) as PendulumParameters

  validatePendulumParameters(parameters)

  return parameters
}

export function computePendulumTimeline({
  parameters,
  durationSeconds,
  sampleRateHz,
}: SimulationInput<PendulumParameters>): SimulationResult<
  PendulumState,
  PendulumSample
> {
  validatePendulumParameters(parameters)
  validateTimelineInput(durationSeconds, sampleRateHz)

  const sampleIntervalSeconds = 1 / sampleRateHz
  const sampleCount = Math.floor(durationSeconds * sampleRateHz) + 1
  const warnings = getPendulumWarnings(parameters)
  const initialState: PendulumState = {
    timeSeconds: 0,
    angleRadians: parameters.initialAngleRadians,
    angularVelocityRadiansPerSecond:
      parameters.initialAngularVelocityRadiansPerSecond,
  }
  const samples: PendulumSample[] = []
  let state = initialState

  for (let index = 0; index < sampleCount; index += 1) {
    samples.push(toPendulumSample(state, parameters))

    if (index < sampleCount - 1) {
      state = stepPendulum(state, sampleIntervalSeconds, parameters)
    }
  }

  return {
    initialState,
    samples,
    warnings,
  }
}

export function stepPendulum(
  state: PendulumState,
  deltaTimeSeconds: number,
  parameters: PendulumParameters,
): PendulumState {
  if (deltaTimeSeconds <= 0 || !Number.isFinite(deltaTimeSeconds)) {
    throw new Error('deltaTimeSeconds must be a finite positive number.')
  }

  validatePendulumParameters(parameters)

  const k1 = pendulumDerivative(state, parameters)
  const k2 = pendulumDerivative(
    applyDerivative(state, k1, deltaTimeSeconds / 2),
    parameters,
  )
  const k3 = pendulumDerivative(
    applyDerivative(state, k2, deltaTimeSeconds / 2),
    parameters,
  )
  const k4 = pendulumDerivative(
    applyDerivative(state, k3, deltaTimeSeconds),
    parameters,
  )

  return {
    timeSeconds: state.timeSeconds + deltaTimeSeconds,
    angleRadians:
      state.angleRadians +
      (deltaTimeSeconds / 6) *
        (k1.angleRadians +
          2 * k2.angleRadians +
          2 * k3.angleRadians +
          k4.angleRadians),
    angularVelocityRadiansPerSecond:
      state.angularVelocityRadiansPerSecond +
      (deltaTimeSeconds / 6) *
        (k1.angularVelocityRadiansPerSecond +
          2 * k2.angularVelocityRadiansPerSecond +
          2 * k3.angularVelocityRadiansPerSecond +
          k4.angularVelocityRadiansPerSecond),
  }
}

export function toPendulumSample(
  state: PendulumState,
  parameters: PendulumParameters,
): PendulumSample {
  const xMeters = parameters.lengthMeters * Math.sin(state.angleRadians)
  const yMeters = -parameters.lengthMeters * Math.cos(state.angleRadians)
  const angularAccelerationRadiansPerSecondSquared = getAngularAcceleration(
    state,
    parameters,
  )
  const linearVelocityMetersPerSecond =
    parameters.lengthMeters * state.angularVelocityRadiansPerSecond
  const tangentialAccelerationMetersPerSecondSquared =
    parameters.lengthMeters * angularAccelerationRadiansPerSecondSquared
  const radialAccelerationMetersPerSecondSquared =
    parameters.lengthMeters *
    state.angularVelocityRadiansPerSecond *
    state.angularVelocityRadiansPerSecond
  const totalAccelerationMetersPerSecondSquared = Math.hypot(
    tangentialAccelerationMetersPerSecondSquared,
    radialAccelerationMetersPerSecondSquared,
  )
  const kineticEnergyJoules =
    0.5 *
    parameters.massKilograms *
    linearVelocityMetersPerSecond *
    linearVelocityMetersPerSecond
  const potentialEnergyJoules =
    parameters.massKilograms *
    parameters.gravityMetersPerSecondSquared *
    parameters.lengthMeters *
    (1 - Math.cos(state.angleRadians))

  return {
    ...state,
    angularAccelerationRadiansPerSecondSquared,
    linearVelocityMetersPerSecond,
    tangentialAccelerationMetersPerSecondSquared,
    radialAccelerationMetersPerSecondSquared,
    totalAccelerationMetersPerSecondSquared,
    xMeters,
    yMeters,
    kineticEnergyJoules,
    potentialEnergyJoules,
    totalEnergyJoules: kineticEnergyJoules + potentialEnergyJoules,
  }
}

export function getPendulumVectorOverlays(
  sample: PendulumSample,
  parameters: PendulumParameters,
): PendulumVectorOverlay[] {
  const radialDirectionToPivot = normalizeVector({
    x: -sample.xMeters,
    y: -sample.yMeters,
  })
  const velocityX =
    parameters.lengthMeters *
    Math.cos(sample.angleRadians) *
    sample.angularVelocityRadiansPerSecond
  const velocityY =
    parameters.lengthMeters *
    Math.sin(sample.angleRadians) *
    sample.angularVelocityRadiansPerSecond
  const tensionNewtons = Math.max(
    0,
    parameters.massKilograms *
      (parameters.gravityMetersPerSecondSquared *
        Math.cos(sample.angleRadians) +
        parameters.lengthMeters *
          sample.angularVelocityRadiansPerSecond *
          sample.angularVelocityRadiansPerSecond),
  )

  return [
    {
      id: 'weight',
      label: 'Peso',
      unit: 'N',
      magnitude:
        parameters.massKilograms *
        parameters.gravityMetersPerSecondSquared,
      direction: {
        x: 0,
        y: -1,
      },
    },
    {
      id: 'tension',
      label: 'Tensao',
      unit: 'N',
      magnitude: tensionNewtons,
      direction: radialDirectionToPivot,
    },
    {
      id: 'velocity',
      label: 'Velocidade',
      unit: 'm/s',
      magnitude: Math.abs(sample.linearVelocityMetersPerSecond),
      direction: normalizeVector({
        x: velocityX,
        y: velocityY,
      }),
    },
  ]
}

function pendulumDerivative(
  state: PendulumState,
  parameters: PendulumParameters,
): Derivative {
  return {
    angleRadians: state.angularVelocityRadiansPerSecond,
    angularVelocityRadiansPerSecond: getAngularAcceleration(state, parameters),
  }
}

function getAngularAcceleration(
  state: Pick<
    PendulumState,
    'angleRadians' | 'angularVelocityRadiansPerSecond'
  >,
  parameters: PendulumParameters,
) {
  return (
    -(parameters.gravityMetersPerSecondSquared / parameters.lengthMeters) *
      Math.sin(state.angleRadians) -
    parameters.dampingPerSecond * state.angularVelocityRadiansPerSecond
  )
}

function applyDerivative(
  state: PendulumState,
  derivative: Derivative,
  deltaTimeSeconds: number,
): PendulumState {
  return {
    timeSeconds: state.timeSeconds + deltaTimeSeconds,
    angleRadians: state.angleRadians + derivative.angleRadians * deltaTimeSeconds,
    angularVelocityRadiansPerSecond:
      state.angularVelocityRadiansPerSecond +
      derivative.angularVelocityRadiansPerSecond * deltaTimeSeconds,
  }
}

function getPendulumWarnings(
  parameters: PendulumParameters,
): SimulationWarning[] {
  const warnings: SimulationWarning[] = []
  const absoluteInitialAngle = Math.abs(parameters.initialAngleRadians)

  if (absoluteInitialAngle > Math.PI / 6) {
    warnings.push({
      code: 'SMALL_ANGLE_APPROXIMATION_LIMIT',
      message:
        'Angulo inicial acima de 30 graus: use o modelo numerico completo, nao a aproximacao de pequeno angulo.',
    })
  }

  if (parameters.dampingPerSecond > 0) {
    warnings.push({
      code: 'ENERGY_NOT_CONSERVED_WITH_DAMPING',
      message:
        'Amortecimento diferente de zero dissipa energia mecanica no modelo.',
    })
  }

  return warnings
}

function validatePendulumParameters(parameters: PendulumParameters) {
  if (parameters.lengthMeters <= 0) {
    throw new Error('lengthMeters must be greater than zero.')
  }

  if (parameters.massKilograms <= 0) {
    throw new Error('massKilograms must be greater than zero.')
  }

  if (parameters.gravityMetersPerSecondSquared <= 0) {
    throw new Error('gravityMetersPerSecondSquared must be greater than zero.')
  }

  if (parameters.dampingPerSecond < 0) {
    throw new Error('dampingPerSecond must be zero or greater.')
  }
}

function validateTimelineInput(durationSeconds: number, sampleRateHz: number) {
  if (durationSeconds <= 0 || !Number.isFinite(durationSeconds)) {
    throw new Error('durationSeconds must be a finite positive number.')
  }

  if (sampleRateHz <= 0 || !Number.isFinite(sampleRateHz)) {
    throw new Error('sampleRateHz must be a finite positive number.')
  }
}

function normalizeVector(vector: { x: number; y: number }) {
  const magnitude = Math.hypot(vector.x, vector.y)

  if (magnitude === 0 || !Number.isFinite(magnitude)) {
    return {
      x: 0,
      y: 0,
    }
  }

  return {
    x: vector.x / magnitude,
    y: vector.y / magnitude,
  }
}

function readNumber(values: Record<string, unknown>, key: string) {
  const value = values[key]

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${key} must be a finite number.`)
  }

  return value
}
