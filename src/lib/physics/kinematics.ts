export type KinematicsSimulationId =
  | 'atwood-machine'
  | 'centripetal-force-curve'
  | 'projectile-motion'
  | 'uniform-circular-motion'
  | 'uniform-linear-motion'
  | 'uniformly-accelerated-motion'
  | 'work-energy-track'

export type AtwoodMachineParameters = {
  gravityMetersPerSecondSquared: number
  initialDisplacementMeters: number
  initialVelocityMetersPerSecond: number
  massOneKilograms: number
  massTwoKilograms: number
  travelLimitMeters: number
}

export type CentripetalForceCurveParameters = {
  frictionCoefficient: number
  gravityMetersPerSecondSquared: number
  massKilograms: number
  radiusMeters: number
  speedMetersPerSecond: number
}

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

export type WorkEnergyTrackParameters = {
  appliedForceNewtons: number
  frictionCoefficient: number
  gravityMetersPerSecondSquared: number
  heightDropMeters: number
  initialSpeedMetersPerSecond: number
  massKilograms: number
  trackLengthMeters: number
}

export type KinematicsParameters =
  | AtwoodMachineParameters
  | CentripetalForceCurveParameters
  | ProjectileMotionParameters
  | UniformCircularMotionParameters
  | UniformLinearMotionParameters
  | UniformlyAcceleratedMotionParameters
  | WorkEnergyTrackParameters

export type KinematicsSample = {
  accelerationMetersPerSecondSquared: number
  accelerationXMetersPerSecondSquared: number
  accelerationZMetersPerSecondSquared: number
  angleRadians: number
  angularVelocityRadiansPerSecond: number
  appliedForceNewtons: number
  appliedWorkJoules: number
  centripetalForceNewtons: number
  centripetalAccelerationMetersPerSecondSquared: number
  displacementMeters: number
  frequencyHertz: number
  frictionForceNewtons: number
  gripRatio: number
  isGrounded: boolean
  kineticEnergyJoules: number
  maxStaticFrictionNewtons: number
  netForceNewtons: number
  normalForceNewtons: number
  periodSeconds: number
  positionMeters: number
  potentialEnergyJoules: number
  secondaryXMeters: number
  secondaryZMeters: number
  speedMetersPerSecond: number
  tensionNewtons: number
  thermalEnergyJoules: number
  timeSeconds: number
  totalEnergyJoules: number
  velocityMetersPerSecond: number
  velocityXMetersPerSecond: number
  velocityZMetersPerSecond: number
  weightNewtons: number
  xMeters: number
  zMeters: number
}

export type KinematicsVectorOverlay = {
  id:
    | 'acceleration'
    | 'appliedForce'
    | 'centripetal'
    | 'displacement'
    | 'friction'
    | 'gravity'
    | 'normal'
    | 'tension'
    | 'velocity'
    | 'weight'
  label: string
  magnitude: number
  unit: 'm' | 'm/s' | 'm/s^2' | 'N'
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
  'atwood-machine',
  'centripetal-force-curve',
  'uniform-linear-motion',
  'uniformly-accelerated-motion',
  'projectile-motion',
  'uniform-circular-motion',
  'work-energy-track',
] as const

const sampleNumericKeys = [
  'accelerationMetersPerSecondSquared',
  'accelerationXMetersPerSecondSquared',
  'accelerationZMetersPerSecondSquared',
  'angleRadians',
  'angularVelocityRadiansPerSecond',
  'appliedForceNewtons',
  'appliedWorkJoules',
  'centripetalForceNewtons',
  'centripetalAccelerationMetersPerSecondSquared',
  'displacementMeters',
  'frequencyHertz',
  'frictionForceNewtons',
  'gripRatio',
  'kineticEnergyJoules',
  'maxStaticFrictionNewtons',
  'netForceNewtons',
  'normalForceNewtons',
  'periodSeconds',
  'positionMeters',
  'potentialEnergyJoules',
  'secondaryXMeters',
  'secondaryZMeters',
  'speedMetersPerSecond',
  'tensionNewtons',
  'thermalEnergyJoules',
  'timeSeconds',
  'totalEnergyJoules',
  'velocityMetersPerSecond',
  'velocityXMetersPerSecond',
  'velocityZMetersPerSecond',
  'weightNewtons',
  'xMeters',
  'zMeters',
] as const
const atwoodHorizontalOffsetMeters = 0.48
const centripetalGripRatioDisplayCap = 99
const centripetalSlipTolerance = 1e-9

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
    case 'atwood-machine': {
      const parameters: AtwoodMachineParameters = {
        gravityMetersPerSecondSquared: readNumber(
          values,
          'gravityMetersPerSecondSquared',
        ),
        initialDisplacementMeters: readNumber(
          values,
          'initialDisplacementMeters',
        ),
        initialVelocityMetersPerSecond: readNumber(
          values,
          'initialVelocityMetersPerSecond',
        ),
        massOneKilograms: readNumber(values, 'massOneKilograms'),
        massTwoKilograms: readNumber(values, 'massTwoKilograms'),
        travelLimitMeters: readNumber(values, 'travelLimitMeters'),
      }

      validateAtwoodMachineParameters(parameters)
      return parameters
    }
    case 'centripetal-force-curve': {
      const parameters: CentripetalForceCurveParameters = {
        frictionCoefficient: readNumber(values, 'frictionCoefficient'),
        gravityMetersPerSecondSquared: readNumber(
          values,
          'gravityMetersPerSecondSquared',
        ),
        massKilograms: readNumber(values, 'massKilograms'),
        radiusMeters: readNumber(values, 'radiusMeters'),
        speedMetersPerSecond: readNumber(values, 'speedMetersPerSecond'),
      }

      validateCentripetalForceCurveParameters(parameters)
      return parameters
    }
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
    case 'work-energy-track': {
      const parameters: WorkEnergyTrackParameters = {
        appliedForceNewtons: readNumber(values, 'appliedForceNewtons'),
        frictionCoefficient: readNumber(values, 'frictionCoefficient'),
        gravityMetersPerSecondSquared: readNumber(
          values,
          'gravityMetersPerSecondSquared',
        ),
        heightDropMeters: readNumber(values, 'heightDropMeters'),
        initialSpeedMetersPerSecond: readNumber(
          values,
          'initialSpeedMetersPerSecond',
        ),
        massKilograms: readNumber(values, 'massKilograms'),
        trackLengthMeters: readNumber(values, 'trackLengthMeters'),
      }

      validateWorkEnergyTrackParameters(parameters)
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
    case 'atwood-machine':
      return computeAtwoodMachineSample(
        parameters as AtwoodMachineParameters,
        timeSeconds,
      )
    case 'centripetal-force-curve':
      return computeCentripetalForceCurveSample(
        parameters as CentripetalForceCurveParameters,
        timeSeconds,
      )
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
    case 'work-energy-track':
      return computeWorkEnergyTrackSample(
        parameters as WorkEnergyTrackParameters,
        timeSeconds,
      )
  }
}

export function getKinematicsVectorOverlays(
  sample: KinematicsSample,
  simulationId: KinematicsSimulationId,
): KinematicsVectorOverlay[] {
  if (simulationId === 'atwood-machine') {
    const verticalMotionDirection =
      sample.velocityMetersPerSecond === 0
        ? Math.sign(sample.accelerationMetersPerSecondSquared)
        : Math.sign(sample.velocityMetersPerSecond)

    return [
      {
        direction: {
          x: 0,
          z: -Math.sign(verticalMotionDirection),
        },
        id: 'velocity',
        label: 'Velocidade da massa 2',
        magnitude: sample.speedMetersPerSecond,
        unit: 'm/s',
      },
      {
        direction: {
          x: 0,
          z: -Math.sign(sample.accelerationMetersPerSecondSquared),
        },
        id: 'acceleration',
        label: 'Aceleracao do sistema',
        magnitude: Math.abs(sample.accelerationMetersPerSecondSquared),
        unit: 'm/s^2',
      },
      {
        direction: {
          x: 0,
          z: 1,
        },
        id: 'tension',
        label: 'Tensao',
        magnitude: sample.tensionNewtons,
        unit: 'N',
      },
      {
        direction: {
          x: 0,
          z: -1,
        },
        id: 'weight',
        label: 'Peso da massa 2',
        magnitude: sample.weightNewtons,
        unit: 'N',
      },
    ]
  }

  if (simulationId === 'centripetal-force-curve') {
    return [
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
        direction: normalizeVector({ x: -sample.xMeters, z: -sample.zMeters }),
        id: 'centripetal',
        label: 'Forca centripeta requerida',
        magnitude: sample.centripetalForceNewtons,
        unit: 'N',
      },
      {
        direction: normalizeVector({ x: -sample.xMeters, z: -sample.zMeters }),
        id: 'friction',
        label: 'Atrito lateral maximo',
        magnitude: sample.maxStaticFrictionNewtons,
        unit: 'N',
      },
    ]
  }

  if (simulationId === 'work-energy-track') {
    return [
      {
        direction: normalizeVector({
          x: sample.velocityXMetersPerSecond,
          z: sample.velocityZMetersPerSecond,
        }),
        id: 'velocity',
        label: 'Velocidade no trilho',
        magnitude: sample.speedMetersPerSecond,
        unit: 'm/s',
      },
      {
        direction: normalizeVector({
          x: sample.accelerationXMetersPerSecondSquared,
          z: sample.accelerationZMetersPerSecondSquared,
        }),
        id: 'acceleration',
        label: 'Aceleracao no trilho',
        magnitude: Math.abs(sample.accelerationMetersPerSecondSquared),
        unit: 'm/s^2',
      },
      {
        direction: normalizeVector({
          x: -sample.velocityXMetersPerSecond,
          z: -sample.velocityZMetersPerSecond,
        }),
        id: 'friction',
        label: 'Atrito',
        magnitude: sample.frictionForceNewtons,
        unit: 'N',
      },
      {
        direction: normalizeVector({
          x: sample.velocityXMetersPerSecond,
          z: sample.velocityZMetersPerSecond,
        }),
        id: 'appliedForce',
        label: 'Forca aplicada',
        magnitude: Math.abs(sample.appliedForceNewtons),
        unit: 'N',
      },
    ]
  }

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

function computeAtwoodMachineSample(
  parameters: AtwoodMachineParameters,
  timeSeconds: number,
): KinematicsSample {
  const accelerationMetersPerSecondSquared =
    ((parameters.massTwoKilograms - parameters.massOneKilograms) *
      parameters.gravityMetersPerSecondSquared) /
    (parameters.massOneKilograms + parameters.massTwoKilograms)
  const motion = computeClampedConstantAccelerationMotion({
    accelerationMetersPerSecondSquared,
    initialPositionMeters: parameters.initialDisplacementMeters,
    initialVelocityMetersPerSecond: parameters.initialVelocityMetersPerSecond,
    maxPositionMeters: parameters.travelLimitMeters,
    minPositionMeters: 0,
    timeSeconds,
  })
  const massOneHeightMeters = motion.positionMeters
  const massTwoHeightMeters = parameters.travelLimitMeters - motion.positionMeters
  const speedMetersPerSecond = Math.abs(motion.velocityMetersPerSecond)
  const kineticEnergyJoules =
    0.5 *
    (parameters.massOneKilograms + parameters.massTwoKilograms) *
    speedMetersPerSecond ** 2
  const potentialEnergyJoules =
    parameters.massOneKilograms *
      parameters.gravityMetersPerSecondSquared *
      massOneHeightMeters +
    parameters.massTwoKilograms *
      parameters.gravityMetersPerSecondSquared *
      massTwoHeightMeters
  const tensionNewtons =
    parameters.massOneKilograms *
    (parameters.gravityMetersPerSecondSquared +
      motion.accelerationMetersPerSecondSquared)

  return buildSample({
    accelerationMetersPerSecondSquared:
      motion.accelerationMetersPerSecondSquared,
    accelerationZMetersPerSecondSquared:
      -motion.accelerationMetersPerSecondSquared,
    displacementMeters:
      motion.positionMeters - parameters.initialDisplacementMeters,
    kineticEnergyJoules,
    netForceNewtons:
      (parameters.massOneKilograms + parameters.massTwoKilograms) *
      motion.accelerationMetersPerSecondSquared,
    positionMeters: motion.positionMeters,
    potentialEnergyJoules,
    secondaryXMeters: -atwoodHorizontalOffsetMeters,
    secondaryZMeters: massOneHeightMeters,
    speedMetersPerSecond,
    tensionNewtons,
    timeSeconds,
    totalEnergyJoules: kineticEnergyJoules + potentialEnergyJoules,
    velocityMetersPerSecond: motion.velocityMetersPerSecond,
    velocityZMetersPerSecond: -motion.velocityMetersPerSecond,
    weightNewtons:
      parameters.massTwoKilograms *
      parameters.gravityMetersPerSecondSquared,
    xMeters: atwoodHorizontalOffsetMeters,
    zMeters: massTwoHeightMeters,
  })
}

function computeCentripetalForceCurveSample(
  parameters: CentripetalForceCurveParameters,
  timeSeconds: number,
): KinematicsSample {
  const requiredCentripetalAccelerationMetersPerSecondSquared =
    parameters.speedMetersPerSecond ** 2 / parameters.radiusMeters
  const normalForceNewtons =
    parameters.massKilograms * parameters.gravityMetersPerSecondSquared
  const centripetalForceNewtons =
    parameters.massKilograms *
    requiredCentripetalAccelerationMetersPerSecondSquared
  const maxStaticFrictionNewtons =
    parameters.frictionCoefficient * normalForceNewtons
  const availableLateralAccelerationMetersPerSecondSquared =
    parameters.frictionCoefficient * parameters.gravityMetersPerSecondSquared
  const hasGrip =
    requiredCentripetalAccelerationMetersPerSecondSquared <=
    availableLateralAccelerationMetersPerSecondSquared +
      centripetalSlipTolerance
  const actualLateralAccelerationMetersPerSecondSquared = hasGrip
    ? requiredCentripetalAccelerationMetersPerSecondSquared
    : availableLateralAccelerationMetersPerSecondSquared
  const actualCurveRadiusMeters =
    actualLateralAccelerationMetersPerSecondSquared > centripetalSlipTolerance
      ? parameters.speedMetersPerSecond ** 2 /
        actualLateralAccelerationMetersPerSecondSquared
      : Number.POSITIVE_INFINITY
  const angularVelocityRadiansPerSecond = Number.isFinite(
    actualCurveRadiusMeters,
  )
    ? parameters.speedMetersPerSecond / actualCurveRadiusMeters
    : 0
  const angleRadians = angularVelocityRadiansPerSecond * timeSeconds
  const centerXMeters = hasGrip || !Number.isFinite(actualCurveRadiusMeters)
    ? 0
    : parameters.radiusMeters - actualCurveRadiusMeters
  const xMeters = Number.isFinite(actualCurveRadiusMeters)
    ? centerXMeters + actualCurveRadiusMeters * Math.cos(angleRadians)
    : parameters.radiusMeters
  const zMeters = Number.isFinite(actualCurveRadiusMeters)
    ? actualCurveRadiusMeters * Math.sin(angleRadians)
    : parameters.speedMetersPerSecond * timeSeconds
  const velocityXMetersPerSecond =
    -parameters.speedMetersPerSecond * Math.sin(angleRadians)
  const velocityZMetersPerSecond =
    parameters.speedMetersPerSecond * Math.cos(angleRadians)
  const accelerationXMetersPerSecondSquared =
    -actualLateralAccelerationMetersPerSecondSquared * Math.cos(angleRadians)
  const accelerationZMetersPerSecondSquared =
    -actualLateralAccelerationMetersPerSecondSquared * Math.sin(angleRadians)
  const kineticEnergyJoules =
    0.5 * parameters.massKilograms * parameters.speedMetersPerSecond ** 2
  const gripRatio = computeCentripetalGripRatio(
    centripetalForceNewtons,
    maxStaticFrictionNewtons,
  )

  return buildSample({
    accelerationMetersPerSecondSquared:
      actualLateralAccelerationMetersPerSecondSquared,
    accelerationXMetersPerSecondSquared,
    accelerationZMetersPerSecondSquared,
    angleRadians,
    angularVelocityRadiansPerSecond,
    centripetalAccelerationMetersPerSecondSquared:
      requiredCentripetalAccelerationMetersPerSecondSquared,
    centripetalForceNewtons,
    displacementMeters: Math.hypot(xMeters - parameters.radiusMeters, zMeters),
    frictionForceNewtons: Math.min(centripetalForceNewtons, maxStaticFrictionNewtons),
    frequencyHertz: angularVelocityRadiansPerSecond / (2 * Math.PI),
    gripRatio,
    kineticEnergyJoules,
    maxStaticFrictionNewtons,
    netForceNewtons:
      parameters.massKilograms * actualLateralAccelerationMetersPerSecondSquared,
    normalForceNewtons,
    periodSeconds:
      angularVelocityRadiansPerSecond > 0
        ? (2 * Math.PI) / angularVelocityRadiansPerSecond
        : 0,
    positionMeters: parameters.speedMetersPerSecond * timeSeconds,
    speedMetersPerSecond: parameters.speedMetersPerSecond,
    timeSeconds,
    totalEnergyJoules: kineticEnergyJoules,
    velocityMetersPerSecond: parameters.speedMetersPerSecond,
    velocityXMetersPerSecond,
    velocityZMetersPerSecond,
    weightNewtons: normalForceNewtons,
    xMeters,
    zMeters,
  })
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

function computeWorkEnergyTrackSample(
  parameters: WorkEnergyTrackParameters,
  timeSeconds: number,
): KinematicsSample {
  const trackAngleRadians = Math.asin(
    parameters.heightDropMeters / parameters.trackLengthMeters,
  )
  const normalForceNewtons =
    parameters.massKilograms *
    parameters.gravityMetersPerSecondSquared *
    Math.cos(trackAngleRadians)
  const frictionForceNewtons = parameters.frictionCoefficient * normalForceNewtons
  const accelerationMetersPerSecondSquared =
    parameters.gravityMetersPerSecondSquared * Math.sin(trackAngleRadians) +
    parameters.appliedForceNewtons / parameters.massKilograms -
    parameters.frictionCoefficient *
      parameters.gravityMetersPerSecondSquared *
      Math.cos(trackAngleRadians)
  const motion = computeForwardSegmentMotion({
    accelerationMetersPerSecondSquared,
    initialVelocityMetersPerSecond: parameters.initialSpeedMetersPerSecond,
    maxPositionMeters: parameters.trackLengthMeters,
    timeSeconds,
  })
  const xMeters = motion.positionMeters * Math.cos(trackAngleRadians)
  const zMeters =
    parameters.heightDropMeters -
    motion.positionMeters * Math.sin(trackAngleRadians)
  const speedMetersPerSecond = Math.max(0, motion.velocityMetersPerSecond)
  const kineticEnergyJoules =
    0.5 * parameters.massKilograms * speedMetersPerSecond ** 2
  const potentialEnergyJoules =
    parameters.massKilograms *
    parameters.gravityMetersPerSecondSquared *
    Math.max(0, zMeters)
  const thermalEnergyJoules = frictionForceNewtons * motion.positionMeters
  const appliedWorkJoules =
    parameters.appliedForceNewtons * motion.positionMeters
  const balanceEnergyJoules =
    kineticEnergyJoules +
    potentialEnergyJoules +
    thermalEnergyJoules -
    appliedWorkJoules
  const directionScale = speedMetersPerSecond > 0 ? 1 : 0

  return buildSample({
    accelerationMetersPerSecondSquared:
      motion.accelerationMetersPerSecondSquared,
    accelerationXMetersPerSecondSquared:
      motion.accelerationMetersPerSecondSquared *
      Math.cos(trackAngleRadians),
    accelerationZMetersPerSecondSquared:
      -motion.accelerationMetersPerSecondSquared *
      Math.sin(trackAngleRadians),
    appliedForceNewtons: parameters.appliedForceNewtons,
    appliedWorkJoules,
    displacementMeters: motion.positionMeters,
    frictionForceNewtons,
    kineticEnergyJoules,
    netForceNewtons:
      parameters.massKilograms * motion.accelerationMetersPerSecondSquared,
    normalForceNewtons,
    positionMeters: motion.positionMeters,
    potentialEnergyJoules,
    speedMetersPerSecond,
    thermalEnergyJoules,
    timeSeconds,
    totalEnergyJoules: balanceEnergyJoules,
    velocityMetersPerSecond: speedMetersPerSecond,
    velocityXMetersPerSecond:
      speedMetersPerSecond * Math.cos(trackAngleRadians) * directionScale,
    velocityZMetersPerSecond:
      -speedMetersPerSecond * Math.sin(trackAngleRadians) * directionScale,
    weightNewtons:
      parameters.massKilograms *
      parameters.gravityMetersPerSecondSquared,
    xMeters,
    zMeters: Math.max(0, zMeters),
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
    appliedForceNewtons: sample.appliedForceNewtons ?? 0,
    appliedWorkJoules: sample.appliedWorkJoules ?? 0,
    centripetalForceNewtons: sample.centripetalForceNewtons ?? 0,
    centripetalAccelerationMetersPerSecondSquared:
      sample.centripetalAccelerationMetersPerSecondSquared ?? 0,
    displacementMeters: sample.displacementMeters ?? 0,
    frequencyHertz: sample.frequencyHertz ?? 0,
    frictionForceNewtons: sample.frictionForceNewtons ?? 0,
    gripRatio: sample.gripRatio ?? 0,
    isGrounded: sample.isGrounded ?? false,
    kineticEnergyJoules,
    maxStaticFrictionNewtons: sample.maxStaticFrictionNewtons ?? 0,
    netForceNewtons: sample.netForceNewtons ?? 0,
    normalForceNewtons: sample.normalForceNewtons ?? 0,
    periodSeconds: sample.periodSeconds ?? 0,
    positionMeters: sample.positionMeters ?? sample.xMeters,
    potentialEnergyJoules,
    secondaryXMeters: sample.secondaryXMeters ?? 0,
    secondaryZMeters: sample.secondaryZMeters ?? 0,
    speedMetersPerSecond: sample.speedMetersPerSecond ?? 0,
    tensionNewtons: sample.tensionNewtons ?? 0,
    thermalEnergyJoules: sample.thermalEnergyJoules ?? 0,
    timeSeconds: sample.timeSeconds,
    totalEnergyJoules:
      sample.totalEnergyJoules ?? kineticEnergyJoules + potentialEnergyJoules,
    velocityMetersPerSecond: sample.velocityMetersPerSecond ?? 0,
    velocityXMetersPerSecond: sample.velocityXMetersPerSecond ?? 0,
    velocityZMetersPerSecond: sample.velocityZMetersPerSecond ?? 0,
    weightNewtons: sample.weightNewtons ?? 0,
    xMeters: sample.xMeters,
    zMeters: sample.zMeters,
  }
}

function getKinematicsWarnings(
  simulationId: KinematicsSimulationId,
  parameters: KinematicsParameters,
  durationSeconds: number,
): SimulationWarning[] {
  if (simulationId === 'atwood-machine') {
    const atwoodParameters = parameters as AtwoodMachineParameters
    const lastSample = computeAtwoodMachineSample(
      atwoodParameters,
      durationSeconds,
    )

    if (
      lastSample.positionMeters === 0 ||
      lastSample.positionMeters === atwoodParameters.travelLimitMeters
    ) {
      return [
        {
          code: 'ATWOOD_TRAVEL_LIMIT_REACHED',
          message:
            'Uma das massas alcanca o limite visual do curso durante o ciclo.',
        },
      ]
    }

    return []
  }

  if (simulationId === 'centripetal-force-curve') {
    const sample = computeCentripetalForceCurveSample(
      parameters as CentripetalForceCurveParameters,
      0,
    )

    if (sample.gripRatio > 1) {
      return [
        {
          code: 'CENTRIPETAL_GRIP_LIMIT_EXCEEDED',
          message:
            'A forca centripeta requerida supera o atrito estatico maximo; o modelo indica perda de aderencia.',
        },
      ]
    }

    return []
  }

  if (simulationId === 'work-energy-track') {
    const trackParameters = parameters as WorkEnergyTrackParameters
    const lastSample = computeWorkEnergyTrackSample(trackParameters, durationSeconds)

    if (lastSample.positionMeters >= trackParameters.trackLengthMeters) {
      return [
        {
          code: 'TRACK_END_REACHED',
          message:
            'O corpo chega ao fim do trilho durante o ciclo e permanece no limite visual.',
        },
      ]
    }

    return []
  }

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
    case 'atwood-machine':
      validateAtwoodMachineParameters(parameters as AtwoodMachineParameters)
      return
    case 'centripetal-force-curve':
      validateCentripetalForceCurveParameters(
        parameters as CentripetalForceCurveParameters,
      )
      return
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
    case 'work-energy-track':
      validateWorkEnergyTrackParameters(parameters as WorkEnergyTrackParameters)
      return
  }
}

function validateAtwoodMachineParameters(parameters: AtwoodMachineParameters) {
  assertFinitePositive(
    'gravityMetersPerSecondSquared',
    parameters.gravityMetersPerSecondSquared,
  )
  assertFinite('initialDisplacementMeters', parameters.initialDisplacementMeters)
  assertFinite(
    'initialVelocityMetersPerSecond',
    parameters.initialVelocityMetersPerSecond,
  )
  assertFinitePositive('massOneKilograms', parameters.massOneKilograms)
  assertFinitePositive('massTwoKilograms', parameters.massTwoKilograms)
  assertFinitePositive('travelLimitMeters', parameters.travelLimitMeters)

  if (
    parameters.initialDisplacementMeters < 0 ||
    parameters.initialDisplacementMeters > parameters.travelLimitMeters
  ) {
    throw new Error(
      'initialDisplacementMeters must be inside the travel limits.',
    )
  }
}

function validateCentripetalForceCurveParameters(
  parameters: CentripetalForceCurveParameters,
) {
  assertFiniteNonNegative('frictionCoefficient', parameters.frictionCoefficient)
  assertFinitePositive(
    'gravityMetersPerSecondSquared',
    parameters.gravityMetersPerSecondSquared,
  )
  assertFinitePositive('massKilograms', parameters.massKilograms)
  assertFinitePositive('radiusMeters', parameters.radiusMeters)
  assertFinitePositive('speedMetersPerSecond', parameters.speedMetersPerSecond)
}

function computeCentripetalGripRatio(
  requiredForceNewtons: number,
  availableForceNewtons: number,
) {
  if (requiredForceNewtons <= 0) {
    return 0
  }

  if (availableForceNewtons <= 0) {
    return centripetalGripRatioDisplayCap
  }

  return Math.min(
    requiredForceNewtons / availableForceNewtons,
    centripetalGripRatioDisplayCap,
  )
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

function validateWorkEnergyTrackParameters(parameters: WorkEnergyTrackParameters) {
  assertFinite('appliedForceNewtons', parameters.appliedForceNewtons)
  assertFinite('frictionCoefficient', parameters.frictionCoefficient)
  assertFinitePositive(
    'gravityMetersPerSecondSquared',
    parameters.gravityMetersPerSecondSquared,
  )
  assertFinitePositive('heightDropMeters', parameters.heightDropMeters)
  assertFinite('initialSpeedMetersPerSecond', parameters.initialSpeedMetersPerSecond)
  assertFinitePositive('massKilograms', parameters.massKilograms)
  assertFinitePositive('trackLengthMeters', parameters.trackLengthMeters)

  if (parameters.frictionCoefficient < 0) {
    throw new Error('frictionCoefficient must be non-negative.')
  }

  if (parameters.initialSpeedMetersPerSecond < 0) {
    throw new Error('initialSpeedMetersPerSecond must be non-negative.')
  }

  if (parameters.heightDropMeters > parameters.trackLengthMeters) {
    throw new Error('heightDropMeters must not exceed trackLengthMeters.')
  }
}

function computeClampedConstantAccelerationMotion({
  accelerationMetersPerSecondSquared,
  initialPositionMeters,
  initialVelocityMetersPerSecond,
  maxPositionMeters,
  minPositionMeters,
  timeSeconds,
}: {
  accelerationMetersPerSecondSquared: number
  initialPositionMeters: number
  initialVelocityMetersPerSecond: number
  maxPositionMeters: number
  minPositionMeters: number
  timeSeconds: number
}) {
  const rawPositionMeters =
    initialPositionMeters +
    initialVelocityMetersPerSecond * timeSeconds +
    0.5 * accelerationMetersPerSecondSquared * timeSeconds ** 2
  const rawVelocityMetersPerSecond =
    initialVelocityMetersPerSecond +
    accelerationMetersPerSecondSquared * timeSeconds

  if (rawPositionMeters <= minPositionMeters) {
    return {
      accelerationMetersPerSecondSquared: 0,
      positionMeters: minPositionMeters,
      velocityMetersPerSecond: 0,
    }
  }

  if (rawPositionMeters >= maxPositionMeters) {
    return {
      accelerationMetersPerSecondSquared: 0,
      positionMeters: maxPositionMeters,
      velocityMetersPerSecond: 0,
    }
  }

  return {
    accelerationMetersPerSecondSquared,
    positionMeters: rawPositionMeters,
    velocityMetersPerSecond: rawVelocityMetersPerSecond,
  }
}

function computeForwardSegmentMotion({
  accelerationMetersPerSecondSquared,
  initialVelocityMetersPerSecond,
  maxPositionMeters,
  timeSeconds,
}: {
  accelerationMetersPerSecondSquared: number
  initialVelocityMetersPerSecond: number
  maxPositionMeters: number
  timeSeconds: number
}) {
  const stopTimeSeconds =
    accelerationMetersPerSecondSquared < 0 && initialVelocityMetersPerSecond > 0
      ? -initialVelocityMetersPerSecond / accelerationMetersPerSecondSquared
      : Number.POSITIVE_INFINITY
  const effectiveTimeSeconds = Math.min(timeSeconds, stopTimeSeconds)
  const rawPositionMeters =
    initialVelocityMetersPerSecond * effectiveTimeSeconds +
    0.5 * accelerationMetersPerSecondSquared * effectiveTimeSeconds ** 2
  const rawVelocityMetersPerSecond =
    timeSeconds >= stopTimeSeconds
      ? 0
      : initialVelocityMetersPerSecond +
        accelerationMetersPerSecondSquared * timeSeconds

  if (rawPositionMeters >= maxPositionMeters) {
    return {
      accelerationMetersPerSecondSquared: 0,
      positionMeters: maxPositionMeters,
      velocityMetersPerSecond: 0,
    }
  }

  if (rawPositionMeters <= 0 && rawVelocityMetersPerSecond <= 0) {
    return {
      accelerationMetersPerSecondSquared: 0,
      positionMeters: 0,
      velocityMetersPerSecond: 0,
    }
  }

  return {
    accelerationMetersPerSecondSquared:
      rawVelocityMetersPerSecond === 0 ? 0 : accelerationMetersPerSecondSquared,
    positionMeters: Math.max(0, rawPositionMeters),
    velocityMetersPerSecond: Math.max(0, rawVelocityMetersPerSecond),
  }
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

function assertFiniteNonNegative(key: string, value: number) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${key} must be a finite non-negative number.`)
  }
}

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180
}

function lerp(start: number, end: number, ratio: number) {
  return start + (end - start) * ratio
}
