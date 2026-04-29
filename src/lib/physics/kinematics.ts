export type KinematicsSimulationId =
  | 'projectile-motion'
  | 'uniform-circular-motion'
  | 'uniform-linear-motion'
  | 'uniformly-accelerated-motion'

export type UniformLinearMotionParameters = {
  initialPositionMeters: number
  massKilograms: number
  velocityMetersPerSecond: number
}

export type UniformlyAcceleratedMotionParameters = {
  accelerationMetersPerSecondSquared: number
  initialPositionMeters: number
  initialVelocityMetersPerSecond: number
  massKilograms: number
}

export type ProjectileMotionParameters = {
  gravityMetersPerSecondSquared: number
  initialHeightMeters: number
  launchAngleDegrees: number
  launchSpeedMetersPerSecond: number
  massKilograms: number
}

export type UniformCircularMotionParameters = {
  angularVelocityRadiansPerSecond: number
  initialAngleDegrees: number
  massKilograms: number
  radiusMeters: number
}

export type KinematicsParameters =
  | ProjectileMotionParameters
  | UniformCircularMotionParameters
  | UniformLinearMotionParameters
  | UniformlyAcceleratedMotionParameters

export type KinematicsSample = {
  accelerationMetersPerSecondSquared: number
  accelerationXMetersPerSecondSquared: number
  accelerationZMetersPerSecondSquared: number
  angleRadians: number
  angularVelocityRadiansPerSecond: number
  centripetalAccelerationMetersPerSecondSquared: number
  displacementMeters: number
  frequencyHertz: number
  isGrounded: boolean
  kineticEnergyJoules: number
  periodSeconds: number
  positionMeters: number
  potentialEnergyJoules: number
  speedMetersPerSecond: number
  timeSeconds: number
  totalEnergyJoules: number
  velocityMetersPerSecond: number
  velocityXMetersPerSecond: number
  velocityZMetersPerSecond: number
  xMeters: number
  zMeters: number
}

export type KinematicsVectorOverlay = {
  id: 'acceleration' | 'centripetal' | 'displacement' | 'gravity' | 'velocity'
  label: string
  magnitude: number
  unit: 'm' | 'm/s' | 'm/s^2'
  direction: {
    x: number
    z: number
  }
}

export type SimulationWarning = {
  code: string
  message: string
}

export type KinematicsTimelineInput = {
  durationSeconds: number
  parameters: KinematicsParameters
  sampleRateHz: number
  simulationId: KinematicsSimulationId
}

export type KinematicsTimelineResult = {
  initialState: KinematicsSample
  samples: KinematicsSample[]
  warnings: SimulationWarning[]
}

const kinematicsSimulationIds = [
  'uniform-linear-motion',
  'uniformly-accelerated-motion',
  'projectile-motion',
  'uniform-circular-motion',
] as const

const sampleNumericKeys = [
  'accelerationMetersPerSecondSquared',
  'accelerationXMetersPerSecondSquared',
  'accelerationZMetersPerSecondSquared',
  'angleRadians',
  'angularVelocityRadiansPerSecond',
  'centripetalAccelerationMetersPerSecondSquared',
  'displacementMeters',
  'frequencyHertz',
  'kineticEnergyJoules',
  'periodSeconds',
  'positionMeters',
  'potentialEnergyJoules',
  'speedMetersPerSecond',
  'timeSeconds',
  'totalEnergyJoules',
  'velocityMetersPerSecond',
  'velocityXMetersPerSecond',
  'velocityZMetersPerSecond',
  'xMeters',
  'zMeters',
] as const

export function isKinematicsSimulationId(
  simulationId: string,
): simulationId is KinematicsSimulationId {
  return kinematicsSimulationIds.includes(
    simulationId as KinematicsSimulationId,
  )
}

export function toKinematicsParameters(
  simulationId: KinematicsSimulationId,
  values: Record<string, unknown>,
): KinematicsParameters {
  switch (simulationId) {
    case 'uniform-linear-motion': {
      const parameters: UniformLinearMotionParameters = {
        initialPositionMeters: readNumber(values, 'initialPositionMeters'),
        massKilograms: readNumber(values, 'massKilograms'),
        velocityMetersPerSecond: readNumber(values, 'velocityMetersPerSecond'),
      }

      validateUniformLinearMotionParameters(parameters)
      return parameters
    }
    case 'uniformly-accelerated-motion': {
      const parameters: UniformlyAcceleratedMotionParameters = {
        accelerationMetersPerSecondSquared: readNumber(
          values,
          'accelerationMetersPerSecondSquared',
        ),
        initialPositionMeters: readNumber(values, 'initialPositionMeters'),
        initialVelocityMetersPerSecond: readNumber(
          values,
          'initialVelocityMetersPerSecond',
        ),
        massKilograms: readNumber(values, 'massKilograms'),
      }

      validateUniformlyAcceleratedMotionParameters(parameters)
      return parameters
    }
    case 'projectile-motion': {
      const parameters: ProjectileMotionParameters = {
        gravityMetersPerSecondSquared: readNumber(
          values,
          'gravityMetersPerSecondSquared',
        ),
        initialHeightMeters: readNumber(values, 'initialHeightMeters'),
        launchAngleDegrees: readNumber(values, 'launchAngleDegrees'),
        launchSpeedMetersPerSecond: readNumber(
          values,
          'launchSpeedMetersPerSecond',
        ),
        massKilograms: readNumber(values, 'massKilograms'),
      }

      validateProjectileMotionParameters(parameters)
      return parameters
    }
    case 'uniform-circular-motion': {
      const parameters: UniformCircularMotionParameters = {
        angularVelocityRadiansPerSecond: readNumber(
          values,
          'angularVelocityRadiansPerSecond',
        ),
        initialAngleDegrees: readNumber(values, 'initialAngleDegrees'),
        massKilograms: readNumber(values, 'massKilograms'),
        radiusMeters: readNumber(values, 'radiusMeters'),
      }

      validateUniformCircularMotionParameters(parameters)
      return parameters
    }
  }
}

export function computeKinematicsTimeline({
  durationSeconds,
  parameters,
  sampleRateHz,
  simulationId,
}: KinematicsTimelineInput): KinematicsTimelineResult {
  validateTimelineInput(durationSeconds, sampleRateHz)
  validateKinematicsParameters(simulationId, parameters)

  const sampleIntervalSeconds = 1 / sampleRateHz
  const sampleCount = Math.floor(durationSeconds * sampleRateHz) + 1
  const samples: KinematicsSample[] = []

  for (let index = 0; index < sampleCount; index += 1) {
    samples.push(
      computeKinematicsSample(
        simulationId,
        parameters,
        index * sampleIntervalSeconds,
      ),
    )
  }

  const initialState = samples[0]

  if (!initialState) {
    throw new Error('Kinematics timeline must contain at least one sample.')
  }

  return {
    initialState,
    samples,
    warnings: getKinematicsWarnings(simulationId, parameters, durationSeconds),
  }
}

export function computeKinematicsSample(
  simulationId: KinematicsSimulationId,
  parameters: KinematicsParameters,
  timeSeconds: number,
): KinematicsSample {
  if (!Number.isFinite(timeSeconds) || timeSeconds < 0) {
    throw new Error('timeSeconds must be a finite non-negative number.')
  }

  switch (simulationId) {
    case 'uniform-linear-motion':
      return computeUniformLinearMotionSample(
        parameters as UniformLinearMotionParameters,
        timeSeconds,
      )
    case 'uniformly-accelerated-motion':
      return computeUniformlyAcceleratedMotionSample(
        parameters as UniformlyAcceleratedMotionParameters,
        timeSeconds,
      )
    case 'projectile-motion':
      return computeProjectileMotionSample(
        parameters as ProjectileMotionParameters,
        timeSeconds,
      )
    case 'uniform-circular-motion':
      return computeUniformCircularMotionSample(
        parameters as UniformCircularMotionParameters,
        timeSeconds,
      )
  }
}

export function getKinematicsVectorOverlays(
  sample: KinematicsSample,
  simulationId: KinematicsSimulationId,
): KinematicsVectorOverlay[] {
  if (simulationId === 'uniform-circular-motion') {
    return [
      {
        direction: normalizeVector({
          x: sample.xMeters,
          z: sample.zMeters,
        }),
        id: 'displacement',
        label: 'Raio',
        magnitude: Math.hypot(sample.xMeters, sample.zMeters),
        unit: 'm',
      },
      {
        direction: normalizeVector({
          x: sample.velocityXMetersPerSecond,
          z: sample.velocityZMetersPerSecond,
        }),
        id: 'velocity',
        label: 'Velocidade tangencial',
        magnitude: sample.speedMetersPerSecond,
        unit: 'm/s',
      },
      {
        direction: normalizeVector({
          x: sample.accelerationXMetersPerSecondSquared,
          z: sample.accelerationZMetersPerSecondSquared,
        }),
        id: 'centripetal',
        label: 'Aceleracao centripeta',
        magnitude: sample.centripetalAccelerationMetersPerSecondSquared,
        unit: 'm/s^2',
      },
    ]
  }

  const displacementDirection = normalizeVector({
    x: sample.xMeters,
    z: sample.zMeters,
  })
  const velocityDirection = normalizeVector({
    x: sample.velocityXMetersPerSecond,
    z: sample.velocityZMetersPerSecond,
  })
  const accelerationDirection = normalizeVector({
    x: sample.accelerationXMetersPerSecondSquared,
    z: sample.accelerationZMetersPerSecondSquared,
  })
  const accelerationVectorId =
    simulationId === 'projectile-motion' ? 'gravity' : 'acceleration'

  return [
    {
      direction: displacementDirection,
      id: 'displacement',
      label: 'Deslocamento',
      magnitude: sample.displacementMeters,
      unit: 'm',
    },
    {
      direction: velocityDirection,
      id: 'velocity',
      label: 'Velocidade',
      magnitude: sample.speedMetersPerSecond,
      unit: 'm/s',
    },
    {
      direction: accelerationDirection,
      id: accelerationVectorId,
      label:
        simulationId === 'projectile-motion'
          ? 'Gravidade'
          : 'Aceleracao',
      magnitude: sample.accelerationMetersPerSecondSquared,
      unit: 'm/s^2',
    },
  ]
}

export function interpolateKinematicsSample(
  start: KinematicsSample,
  end: KinematicsSample,
  ratio: number,
): KinematicsSample {
  const sample = {
    isGrounded: ratio < 0.5 ? start.isGrounded : end.isGrounded,
  } as KinematicsSample

  sampleNumericKeys.forEach((key) => {
    sample[key] = lerp(start[key], end[key], ratio)
  })

  return sample
}

function computeUniformLinearMotionSample(
  parameters: UniformLinearMotionParameters,
  timeSeconds: number,
): KinematicsSample {
  const xMeters =
    parameters.initialPositionMeters +
    parameters.velocityMetersPerSecond * timeSeconds
  const displacementMeters = xMeters - parameters.initialPositionMeters
  const speedMetersPerSecond = Math.abs(parameters.velocityMetersPerSecond)
  const kineticEnergyJoules =
    0.5 *
    parameters.massKilograms *
    speedMetersPerSecond *
    speedMetersPerSecond

  return buildSample({
    displacementMeters,
    kineticEnergyJoules,
    positionMeters: xMeters,
    speedMetersPerSecond,
    timeSeconds,
    velocityMetersPerSecond: parameters.velocityMetersPerSecond,
    velocityXMetersPerSecond: parameters.velocityMetersPerSecond,
    xMeters,
    zMeters: 0,
  })
}

function computeUniformlyAcceleratedMotionSample(
  parameters: UniformlyAcceleratedMotionParameters,
  timeSeconds: number,
): KinematicsSample {
  const zMeters =
    parameters.initialPositionMeters +
    parameters.initialVelocityMetersPerSecond * timeSeconds +
    0.5 * parameters.accelerationMetersPerSecondSquared * timeSeconds ** 2
  const velocityZMetersPerSecond =
    parameters.initialVelocityMetersPerSecond +
    parameters.accelerationMetersPerSecondSquared * timeSeconds
  const displacementMeters = zMeters - parameters.initialPositionMeters
  const speedMetersPerSecond = Math.abs(velocityZMetersPerSecond)
  const kineticEnergyJoules =
    0.5 *
    parameters.massKilograms *
    speedMetersPerSecond *
    speedMetersPerSecond

  return buildSample({
    accelerationMetersPerSecondSquared: Math.abs(
      parameters.accelerationMetersPerSecondSquared,
    ),
    accelerationZMetersPerSecondSquared:
      parameters.accelerationMetersPerSecondSquared,
    displacementMeters,
    kineticEnergyJoules,
    positionMeters: zMeters,
    speedMetersPerSecond,
    timeSeconds,
    velocityMetersPerSecond: velocityZMetersPerSecond,
    velocityZMetersPerSecond,
    xMeters: 0,
    zMeters,
  })
}

function computeProjectileMotionSample(
  parameters: ProjectileMotionParameters,
  timeSeconds: number,
): KinematicsSample {
  const launchAngleRadians = degreesToRadians(parameters.launchAngleDegrees)
  const initialVelocityX =
    parameters.launchSpeedMetersPerSecond * Math.cos(launchAngleRadians)
  const initialVelocityZ =
    parameters.launchSpeedMetersPerSecond * Math.sin(launchAngleRadians)
  const flightTimeSeconds = getProjectileFlightTime(parameters)
  const activeTimeSeconds = Math.min(timeSeconds, flightTimeSeconds)
  const isGrounded = timeSeconds > flightTimeSeconds
  const xMeters = initialVelocityX * activeTimeSeconds
  const rawZMeters =
    parameters.initialHeightMeters +
    initialVelocityZ * activeTimeSeconds -
    0.5 *
      parameters.gravityMetersPerSecondSquared *
      activeTimeSeconds ** 2
  const zMeters = Math.max(0, rawZMeters)
  const velocityXMetersPerSecond = isGrounded ? 0 : initialVelocityX
  const velocityZMetersPerSecond = isGrounded
    ? 0
    : initialVelocityZ -
      parameters.gravityMetersPerSecondSquared * activeTimeSeconds
  const speedMetersPerSecond = Math.hypot(
    velocityXMetersPerSecond,
    velocityZMetersPerSecond,
  )
  const kineticEnergyJoules =
    0.5 *
    parameters.massKilograms *
    speedMetersPerSecond *
    speedMetersPerSecond
  const potentialEnergyJoules =
    parameters.massKilograms *
    parameters.gravityMetersPerSecondSquared *
    zMeters

  return buildSample({
    accelerationMetersPerSecondSquared: isGrounded
      ? 0
      : parameters.gravityMetersPerSecondSquared,
    accelerationZMetersPerSecondSquared: isGrounded
      ? 0
      : -parameters.gravityMetersPerSecondSquared,
    displacementMeters: Math.hypot(
      xMeters,
      zMeters - parameters.initialHeightMeters,
    ),
    isGrounded,
    kineticEnergyJoules,
    positionMeters: xMeters,
    potentialEnergyJoules,
    speedMetersPerSecond,
    timeSeconds,
    velocityMetersPerSecond: speedMetersPerSecond,
    velocityXMetersPerSecond,
    velocityZMetersPerSecond,
    xMeters,
    zMeters,
  })
}

function computeUniformCircularMotionSample(
  parameters: UniformCircularMotionParameters,
  timeSeconds: number,
): KinematicsSample {
  const initialAngleRadians = degreesToRadians(parameters.initialAngleDegrees)
  const angleRadians =
    initialAngleRadians +
    parameters.angularVelocityRadiansPerSecond * timeSeconds
  const xMeters = parameters.radiusMeters * Math.cos(angleRadians)
  const zMeters = parameters.radiusMeters * Math.sin(angleRadians)
  const velocityXMetersPerSecond =
    -parameters.radiusMeters *
    parameters.angularVelocityRadiansPerSecond *
    Math.sin(angleRadians)
  const velocityZMetersPerSecond =
    parameters.radiusMeters *
    parameters.angularVelocityRadiansPerSecond *
    Math.cos(angleRadians)
  const accelerationXMetersPerSecondSquared =
    -parameters.radiusMeters *
    parameters.angularVelocityRadiansPerSecond ** 2 *
    Math.cos(angleRadians)
  const accelerationZMetersPerSecondSquared =
    -parameters.radiusMeters *
    parameters.angularVelocityRadiansPerSecond ** 2 *
    Math.sin(angleRadians)
  const speedMetersPerSecond = Math.hypot(
    velocityXMetersPerSecond,
    velocityZMetersPerSecond,
  )
  const centripetalAccelerationMetersPerSecondSquared =
    parameters.radiusMeters * parameters.angularVelocityRadiansPerSecond ** 2
  const kineticEnergyJoules =
    0.5 *
    parameters.massKilograms *
    speedMetersPerSecond *
    speedMetersPerSecond
  const initialX = parameters.radiusMeters * Math.cos(initialAngleRadians)
  const initialZ = parameters.radiusMeters * Math.sin(initialAngleRadians)

  return buildSample({
    accelerationMetersPerSecondSquared:
      centripetalAccelerationMetersPerSecondSquared,
    accelerationXMetersPerSecondSquared,
    accelerationZMetersPerSecondSquared,
    angleRadians,
    angularVelocityRadiansPerSecond:
      parameters.angularVelocityRadiansPerSecond,
    centripetalAccelerationMetersPerSecondSquared,
    displacementMeters: Math.hypot(xMeters - initialX, zMeters - initialZ),
    frequencyHertz:
      Math.abs(parameters.angularVelocityRadiansPerSecond) / (2 * Math.PI),
    kineticEnergyJoules,
    periodSeconds:
      (2 * Math.PI) / Math.abs(parameters.angularVelocityRadiansPerSecond),
    positionMeters:
      parameters.radiusMeters * (angleRadians - initialAngleRadians),
    speedMetersPerSecond,
    timeSeconds,
    velocityMetersPerSecond: speedMetersPerSecond,
    velocityXMetersPerSecond,
    velocityZMetersPerSecond,
    xMeters,
    zMeters,
  })
}

function buildSample(
  sample: Partial<KinematicsSample> &
    Pick<KinematicsSample, 'timeSeconds' | 'xMeters' | 'zMeters'>,
): KinematicsSample {
  const potentialEnergyJoules = sample.potentialEnergyJoules ?? 0
  const kineticEnergyJoules = sample.kineticEnergyJoules ?? 0

  return {
    accelerationMetersPerSecondSquared:
      sample.accelerationMetersPerSecondSquared ?? 0,
    accelerationXMetersPerSecondSquared:
      sample.accelerationXMetersPerSecondSquared ?? 0,
    accelerationZMetersPerSecondSquared:
      sample.accelerationZMetersPerSecondSquared ?? 0,
    angleRadians: sample.angleRadians ?? 0,
    angularVelocityRadiansPerSecond:
      sample.angularVelocityRadiansPerSecond ?? 0,
    centripetalAccelerationMetersPerSecondSquared:
      sample.centripetalAccelerationMetersPerSecondSquared ?? 0,
    displacementMeters: sample.displacementMeters ?? 0,
    frequencyHertz: sample.frequencyHertz ?? 0,
    isGrounded: sample.isGrounded ?? false,
    kineticEnergyJoules,
    periodSeconds: sample.periodSeconds ?? 0,
    positionMeters: sample.positionMeters ?? sample.xMeters,
    potentialEnergyJoules,
    speedMetersPerSecond: sample.speedMetersPerSecond ?? 0,
    timeSeconds: sample.timeSeconds,
    totalEnergyJoules: kineticEnergyJoules + potentialEnergyJoules,
    velocityMetersPerSecond: sample.velocityMetersPerSecond ?? 0,
    velocityXMetersPerSecond: sample.velocityXMetersPerSecond ?? 0,
    velocityZMetersPerSecond: sample.velocityZMetersPerSecond ?? 0,
    xMeters: sample.xMeters,
    zMeters: sample.zMeters,
  }
}

function getKinematicsWarnings(
  simulationId: KinematicsSimulationId,
  parameters: KinematicsParameters,
  durationSeconds: number,
): SimulationWarning[] {
  if (simulationId !== 'projectile-motion') {
    return []
  }

  const flightTimeSeconds = getProjectileFlightTime(
    parameters as ProjectileMotionParameters,
  )

  if (durationSeconds <= flightTimeSeconds) {
    return []
  }

  return [
    {
      code: 'PROJECTILE_REACHES_GROUND',
      message:
        'O projetil alcanca o solo durante o ciclo; depois disso o corpo fica fixo no nivel z = 0.',
    },
  ]
}

function validateKinematicsParameters(
  simulationId: KinematicsSimulationId,
  parameters: KinematicsParameters,
) {
  switch (simulationId) {
    case 'uniform-linear-motion':
      validateUniformLinearMotionParameters(
        parameters as UniformLinearMotionParameters,
      )
      return
    case 'uniformly-accelerated-motion':
      validateUniformlyAcceleratedMotionParameters(
        parameters as UniformlyAcceleratedMotionParameters,
      )
      return
    case 'projectile-motion':
      validateProjectileMotionParameters(parameters as ProjectileMotionParameters)
      return
    case 'uniform-circular-motion':
      validateUniformCircularMotionParameters(
        parameters as UniformCircularMotionParameters,
      )
      return
  }
}

function validateUniformLinearMotionParameters(
  parameters: UniformLinearMotionParameters,
) {
  assertFinite('initialPositionMeters', parameters.initialPositionMeters)
  assertFinite('velocityMetersPerSecond', parameters.velocityMetersPerSecond)
  assertFinitePositive('massKilograms', parameters.massKilograms)
}

function validateUniformlyAcceleratedMotionParameters(
  parameters: UniformlyAcceleratedMotionParameters,
) {
  assertFinite(
    'accelerationMetersPerSecondSquared',
    parameters.accelerationMetersPerSecondSquared,
  )
  assertFinite('initialPositionMeters', parameters.initialPositionMeters)
  assertFinite(
    'initialVelocityMetersPerSecond',
    parameters.initialVelocityMetersPerSecond,
  )
  assertFinitePositive('massKilograms', parameters.massKilograms)
}

function validateProjectileMotionParameters(
  parameters: ProjectileMotionParameters,
) {
  assertFinitePositive(
    'gravityMetersPerSecondSquared',
    parameters.gravityMetersPerSecondSquared,
  )
  assertFinitePositive(
    'launchSpeedMetersPerSecond',
    parameters.launchSpeedMetersPerSecond,
  )
  assertFinitePositive('massKilograms', parameters.massKilograms)

  if (
    !Number.isFinite(parameters.initialHeightMeters) ||
    parameters.initialHeightMeters < 0
  ) {
    throw new Error(
      'initialHeightMeters must be a finite non-negative number.',
    )
  }

  if (
    !Number.isFinite(parameters.launchAngleDegrees) ||
    parameters.launchAngleDegrees < 0 ||
    parameters.launchAngleDegrees > 85
  ) {
    throw new Error('launchAngleDegrees must be between 0 and 85 degrees.')
  }
}

function validateUniformCircularMotionParameters(
  parameters: UniformCircularMotionParameters,
) {
  assertFinitePositive(
    'angularVelocityRadiansPerSecond',
    parameters.angularVelocityRadiansPerSecond,
  )
  assertFinite('initialAngleDegrees', parameters.initialAngleDegrees)
  assertFinitePositive('massKilograms', parameters.massKilograms)
  assertFinitePositive('radiusMeters', parameters.radiusMeters)
}

function validateTimelineInput(durationSeconds: number, sampleRateHz: number) {
  assertFinitePositive('durationSeconds', durationSeconds)
  assertFinitePositive('sampleRateHz', sampleRateHz)
}

function getProjectileFlightTime(parameters: ProjectileMotionParameters) {
  const launchAngleRadians = degreesToRadians(parameters.launchAngleDegrees)
  const initialVelocityZ =
    parameters.launchSpeedMetersPerSecond * Math.sin(launchAngleRadians)
  const discriminant =
    initialVelocityZ ** 2 +
    2 * parameters.gravityMetersPerSecondSquared * parameters.initialHeightMeters

  return (
    (initialVelocityZ + Math.sqrt(Math.max(0, discriminant))) /
    parameters.gravityMetersPerSecondSquared
  )
}

function normalizeVector(vector: { x: number; z: number }) {
  const magnitude = Math.hypot(vector.x, vector.z)

  if (magnitude === 0 || !Number.isFinite(magnitude)) {
    return {
      x: 0,
      z: 0,
    }
  }

  return {
    x: vector.x / magnitude,
    z: vector.z / magnitude,
  }
}

function readNumber(values: Record<string, unknown>, key: string) {
  const value = values[key]

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${key} must be a finite number.`)
  }

  return value
}

function assertFinite(key: string, value: number) {
  if (!Number.isFinite(value)) {
    throw new Error(`${key} must be a finite number.`)
  }
}

function assertFinitePositive(key: string, value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${key} must be a finite positive number.`)
  }
}

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180
}

function lerp(start: number, end: number, ratio: number) {
  return start + (end - start) * ratio
}
