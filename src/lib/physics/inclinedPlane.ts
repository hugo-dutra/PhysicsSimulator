export type InclinedPlaneParameters = {
  planeAngleDegrees: number
  blockMassKilograms: number
  gravityMetersPerSecondSquared: number
  frictionCoefficient: number
  initialPositionMeters: number
  initialVelocityMetersPerSecond: number
  planeLengthMeters: number
}

export type InclinedPlaneState = {
  timeSeconds: number
  positionMeters: number
  velocityMetersPerSecond: number
}

export type InclinedPlaneSample = InclinedPlaneState & {
  accelerationMetersPerSecondSquared: number
  heightMeters: number
  xMeters: number
  zMeters: number
  normalForceNewtons: number
  weightParallelNewtons: number
  frictionMagnitudeNewtons: number
  frictionForceNewtons: number
  netForceNewtons: number
  kineticEnergyJoules: number
  potentialEnergyJoules: number
  thermalEnergyJoules: number
  totalEnergyJoules: number
  isMoving: boolean
}

export type InclinedPlaneVectorOverlay = {
  id: 'weight' | 'normal' | 'friction' | 'velocity'
  label: string
  unit: 'N' | 'm/s'
  magnitude: number
  direction: {
    x: number
    z: number
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

const inclinedPlaneParameterKeys = [
  'planeAngleDegrees',
  'blockMassKilograms',
  'gravityMetersPerSecondSquared',
  'frictionCoefficient',
  'initialPositionMeters',
  'initialVelocityMetersPerSecond',
  'planeLengthMeters',
] as const

const velocityEpsilon = 0.0001

export const inclinedPlaneEngine: SimulationEngine<
  InclinedPlaneParameters,
  InclinedPlaneState,
  InclinedPlaneSample
> = {
  compute: computeInclinedPlaneTimeline,
  step: stepInclinedPlane,
}

export function toInclinedPlaneParameters(
  values: Record<string, unknown>,
): InclinedPlaneParameters {
  const parameters = Object.fromEntries(
    inclinedPlaneParameterKeys.map((key) => [key, readNumber(values, key)]),
  ) as InclinedPlaneParameters

  validateInclinedPlaneParameters(parameters)

  return parameters
}

export function computeInclinedPlaneTimeline({
  parameters,
  durationSeconds,
  sampleRateHz,
}: SimulationInput<InclinedPlaneParameters>): SimulationResult<
  InclinedPlaneState,
  InclinedPlaneSample
> {
  validateInclinedPlaneParameters(parameters)
  validateTimelineInput(durationSeconds, sampleRateHz)

  const sampleIntervalSeconds = 1 / sampleRateHz
  const sampleCount = Math.floor(durationSeconds * sampleRateHz) + 1
  const initialState: InclinedPlaneState = {
    positionMeters: parameters.initialPositionMeters,
    timeSeconds: 0,
    velocityMetersPerSecond: parameters.initialVelocityMetersPerSecond,
  }
  const initialMechanicalEnergy = getMechanicalEnergy(initialState, parameters)
  const samples: InclinedPlaneSample[] = []
  let state = initialState

  for (let index = 0; index < sampleCount; index += 1) {
    samples.push(
      toInclinedPlaneSample(state, parameters, initialMechanicalEnergy),
    )

    if (index < sampleCount - 1) {
      state = stepInclinedPlane(state, sampleIntervalSeconds, parameters)
    }
  }

  return {
    initialState,
    samples,
    warnings: getInclinedPlaneWarnings(samples, parameters),
  }
}

export function stepInclinedPlane(
  state: InclinedPlaneState,
  deltaTimeSeconds: number,
  parameters: InclinedPlaneParameters,
): InclinedPlaneState {
  if (deltaTimeSeconds <= 0 || !Number.isFinite(deltaTimeSeconds)) {
    throw new Error('deltaTimeSeconds must be a finite positive number.')
  }

  validateInclinedPlaneParameters(parameters)

  const acceleration = getAlongPlaneAcceleration(state, parameters)
  let velocityMetersPerSecond =
    state.velocityMetersPerSecond + acceleration * deltaTimeSeconds
  let positionMeters =
    state.positionMeters +
    state.velocityMetersPerSecond * deltaTimeSeconds +
    0.5 * acceleration * deltaTimeSeconds * deltaTimeSeconds

  if (
    Math.sign(state.velocityMetersPerSecond) < 0 &&
    Math.sign(velocityMetersPerSecond) >= 0 &&
    canStaticFrictionHold(parameters)
  ) {
    velocityMetersPerSecond = 0
    positionMeters = state.positionMeters
  }

  if (positionMeters <= 0) {
    return {
      positionMeters: 0,
      timeSeconds: state.timeSeconds + deltaTimeSeconds,
      velocityMetersPerSecond: Math.max(0, velocityMetersPerSecond),
    }
  }

  if (positionMeters >= parameters.planeLengthMeters) {
    return {
      positionMeters: parameters.planeLengthMeters,
      timeSeconds: state.timeSeconds + deltaTimeSeconds,
      velocityMetersPerSecond: 0,
    }
  }

  return {
    positionMeters,
    timeSeconds: state.timeSeconds + deltaTimeSeconds,
    velocityMetersPerSecond,
  }
}

export function toInclinedPlaneSample(
  state: InclinedPlaneState,
  parameters: InclinedPlaneParameters,
  initialMechanicalEnergy = getMechanicalEnergy(state, parameters),
): InclinedPlaneSample {
  const theta = degreesToRadians(parameters.planeAngleDegrees)
  const accelerationMetersPerSecondSquared = getAlongPlaneAcceleration(
    state,
    parameters,
  )
  const heightMeters =
    (parameters.planeLengthMeters - state.positionMeters) * Math.sin(theta)
  const xMeters = state.positionMeters * Math.cos(theta)
  const zMeters = heightMeters
  const normalForceNewtons =
    parameters.blockMassKilograms *
    parameters.gravityMetersPerSecondSquared *
    Math.cos(theta)
  const weightParallelNewtons =
    parameters.blockMassKilograms *
    parameters.gravityMetersPerSecondSquared *
    Math.sin(theta)
  const frictionForceNewtons = getFrictionForce(state, parameters)
  const frictionMagnitudeNewtons = Math.abs(frictionForceNewtons)
  const netForceNewtons =
    parameters.blockMassKilograms * accelerationMetersPerSecondSquared
  const kineticEnergyJoules =
    0.5 *
    parameters.blockMassKilograms *
    state.velocityMetersPerSecond *
    state.velocityMetersPerSecond
  const potentialEnergyJoules =
    parameters.blockMassKilograms *
    parameters.gravityMetersPerSecondSquared *
    heightMeters
  const mechanicalEnergy = kineticEnergyJoules + potentialEnergyJoules
  const thermalEnergyJoules = Math.max(
    0,
    initialMechanicalEnergy - mechanicalEnergy,
  )

  return {
    ...state,
    accelerationMetersPerSecondSquared,
    frictionForceNewtons,
    frictionMagnitudeNewtons,
    heightMeters,
    isMoving: Math.abs(state.velocityMetersPerSecond) > velocityEpsilon,
    kineticEnergyJoules,
    netForceNewtons,
    normalForceNewtons,
    potentialEnergyJoules,
    thermalEnergyJoules,
    totalEnergyJoules: mechanicalEnergy + thermalEnergyJoules,
    weightParallelNewtons,
    xMeters,
    zMeters,
  }
}

export function getInclinedPlaneVectorOverlays(
  sample: InclinedPlaneSample,
  parameters: InclinedPlaneParameters,
): InclinedPlaneVectorOverlay[] {
  const theta = degreesToRadians(parameters.planeAngleDegrees)
  const downSlope = {
    x: Math.cos(theta),
    z: -Math.sin(theta),
  }
  const upSlope = {
    x: -downSlope.x,
    z: -downSlope.z,
  }
  const normal = {
    x: Math.sin(theta),
    z: Math.cos(theta),
  }
  const frictionDirection =
    sample.frictionForceNewtons >= 0 ? downSlope : upSlope
  const velocityDirection =
    sample.velocityMetersPerSecond >= 0 ? downSlope : upSlope

  return [
    {
      direction: { x: 0, z: -1 },
      id: 'weight',
      label: 'Peso',
      magnitude:
        parameters.blockMassKilograms *
        parameters.gravityMetersPerSecondSquared,
      unit: 'N',
    },
    {
      direction: normal,
      id: 'normal',
      label: 'Normal',
      magnitude: sample.normalForceNewtons,
      unit: 'N',
    },
    {
      direction: frictionDirection,
      id: 'friction',
      label: 'Atrito',
      magnitude: sample.frictionMagnitudeNewtons,
      unit: 'N',
    },
    {
      direction: velocityDirection,
      id: 'velocity',
      label: 'Velocidade',
      magnitude: Math.abs(sample.velocityMetersPerSecond),
      unit: 'm/s',
    },
  ]
}

function getInclinedPlaneWarnings(
  samples: InclinedPlaneSample[],
  parameters: InclinedPlaneParameters,
): SimulationWarning[] {
  const warnings: SimulationWarning[] = []
  const firstSample = samples[0]
  const lastSample = samples.at(-1)

  if (
    firstSample &&
    !firstSample.isMoving &&
    firstSample.accelerationMetersPerSecondSquared === 0 &&
    canStaticFrictionHold(parameters)
  ) {
    warnings.push({
      code: 'STATIC_FRICTION_HOLDS',
      message:
        'O atrito estatico consegue equilibrar a componente do peso no plano.',
    })
  }

  if (lastSample?.positionMeters === parameters.planeLengthMeters) {
    warnings.push({
      code: 'BLOCK_REACHED_END',
      message: 'O bloco chegou ao fim do plano e foi mantido no limite visual.',
    })
  }

  return warnings
}

function getAlongPlaneAcceleration(
  state: InclinedPlaneState,
  parameters: InclinedPlaneParameters,
) {
  if (
    state.positionMeters >= parameters.planeLengthMeters &&
    state.velocityMetersPerSecond >= 0
  ) {
    return 0
  }

  if (state.positionMeters <= 0 && state.velocityMetersPerSecond <= 0) {
    return Math.max(0, getSlidingDownAcceleration(parameters))
  }

  if (Math.abs(state.velocityMetersPerSecond) <= velocityEpsilon) {
    return canStaticFrictionHold(parameters)
      ? 0
      : getSlidingDownAcceleration(parameters)
  }

  if (state.velocityMetersPerSecond > 0) {
    return getSlidingDownAcceleration(parameters)
  }

  return getGravityComponent(parameters) + getFrictionLimitAcceleration(parameters)
}

function getFrictionForce(
  state: InclinedPlaneState,
  parameters: InclinedPlaneParameters,
) {
  const mass = parameters.blockMassKilograms
  const gravityComponentForce = mass * getGravityComponent(parameters)
  const kineticFrictionForce = mass * getFrictionLimitAcceleration(parameters)

  if (Math.abs(state.velocityMetersPerSecond) <= velocityEpsilon) {
    return canStaticFrictionHold(parameters)
      ? -gravityComponentForce
      : -kineticFrictionForce
  }

  return state.velocityMetersPerSecond > 0
    ? -kineticFrictionForce
    : kineticFrictionForce
}

function canStaticFrictionHold(parameters: InclinedPlaneParameters) {
  return getGravityComponent(parameters) <= getFrictionLimitAcceleration(parameters)
}

function getSlidingDownAcceleration(parameters: InclinedPlaneParameters) {
  return getGravityComponent(parameters) - getFrictionLimitAcceleration(parameters)
}

function getGravityComponent(parameters: InclinedPlaneParameters) {
  return (
    parameters.gravityMetersPerSecondSquared *
    Math.sin(degreesToRadians(parameters.planeAngleDegrees))
  )
}

function getFrictionLimitAcceleration(parameters: InclinedPlaneParameters) {
  return (
    parameters.frictionCoefficient *
    parameters.gravityMetersPerSecondSquared *
    Math.cos(degreesToRadians(parameters.planeAngleDegrees))
  )
}

function getMechanicalEnergy(
  state: InclinedPlaneState,
  parameters: InclinedPlaneParameters,
) {
  const theta = degreesToRadians(parameters.planeAngleDegrees)
  const heightMeters =
    (parameters.planeLengthMeters - state.positionMeters) * Math.sin(theta)

  return (
    0.5 *
      parameters.blockMassKilograms *
      state.velocityMetersPerSecond *
      state.velocityMetersPerSecond +
    parameters.blockMassKilograms *
      parameters.gravityMetersPerSecondSquared *
      heightMeters
  )
}

function validateInclinedPlaneParameters(
  parameters: InclinedPlaneParameters,
) {
  assertFinitePositive('planeAngleDegrees', parameters.planeAngleDegrees)
  assertFinitePositive('blockMassKilograms', parameters.blockMassKilograms)
  assertFinitePositive(
    'gravityMetersPerSecondSquared',
    parameters.gravityMetersPerSecondSquared,
  )
  assertFinitePositive('planeLengthMeters', parameters.planeLengthMeters)

  if (parameters.planeAngleDegrees >= 80) {
    throw new Error('planeAngleDegrees must be lower than 80 degrees.')
  }

  if (
    !Number.isFinite(parameters.frictionCoefficient) ||
    parameters.frictionCoefficient < 0
  ) {
    throw new Error('frictionCoefficient must be a finite non-negative number.')
  }

  if (
    !Number.isFinite(parameters.initialPositionMeters) ||
    parameters.initialPositionMeters < 0 ||
    parameters.initialPositionMeters > parameters.planeLengthMeters
  ) {
    throw new Error(
      'initialPositionMeters must be finite and inside the plane length.',
    )
  }

  if (!Number.isFinite(parameters.initialVelocityMetersPerSecond)) {
    throw new Error(
      'initialVelocityMetersPerSecond must be a finite number.',
    )
  }
}

function validateTimelineInput(durationSeconds: number, sampleRateHz: number) {
  assertFinitePositive('durationSeconds', durationSeconds)
  assertFinitePositive('sampleRateHz', sampleRateHz)
}

function assertFinitePositive(key: string, value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${key} must be a finite positive number.`)
  }
}

function readNumber(values: Record<string, unknown>, key: string) {
  const value = values[key]

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${key} must be a finite number.`)
  }

  return value
}

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180
}
