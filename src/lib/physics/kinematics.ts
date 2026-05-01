export type KinematicsSimulationId =
  | 'atwood-machine'
  | 'centripetal-force-curve'
  | 'collisions-1d-2d'
  | 'continuity-bernoulli'
  | 'gravitational-field-orbits'
  | 'hydrostatics-buoyancy'
  | 'particle-equilibrium'
  | 'projectile-motion'
  | 'rigid-body-rotation'
  | 'rolling-without-slipping'
  | 'torque-levers-center-mass'
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

export type CollisionsParameters = {
  coefficientOfRestitution: number
  impactAngleDegrees: number
  initialSeparationMeters: number
  massOneKilograms: number
  massTwoKilograms: number
  normalSpeedOneMetersPerSecond: number
  normalSpeedTwoMetersPerSecond: number
  radiusOneMeters: number
  radiusTwoMeters: number
  tangentialSpeedOneMetersPerSecond: number
  tangentialSpeedTwoMetersPerSecond: number
}

export type ContinuityBernoulliParameters = {
  flowRateCubicMetersPerSecond: number
  fluidDensityKilogramsPerCubicMeter: number
  gravityMetersPerSecondSquared: number
  heightDifferenceMeters: number
  inletAreaSquareMeters: number
  inletPressureKilopascals: number
  throatAreaSquareMeters: number
}

export type GravitationalFieldOrbitsParameters = {
  centralMassEarths: number
  eccentricity: number
  initialAngleDegrees: number
  orbitalRadiusKilometers: number
  satelliteMassKilograms: number
}

export type HydrostaticsBuoyancyParameters = {
  depthMeters: number
  fluidDensityKilogramsPerCubicMeter: number
  gravityMetersPerSecondSquared: number
  objectDensityKilogramsPerCubicMeter: number
  objectVolumeCubicMeters: number
}

export type ParticleEquilibriumParameters = {
  forceOneAngleDegrees: number
  forceOneNewtons: number
  forceThreeAngleDegrees: number
  forceThreeNewtons: number
  forceTwoAngleDegrees: number
  forceTwoNewtons: number
  massKilograms: number
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

export type TorqueLeversCenterMassParameters = {
  appliedForceArmMeters: number
  appliedForceNewtons: number
  gravityMetersPerSecondSquared: number
  leftArmMeters: number
  leftMassKilograms: number
  rightArmMeters: number
  rightMassKilograms: number
}

export type RigidBodyRotationParameters = {
  angularDampingPerSecond: number
  appliedTorqueNewtonMeters: number
  initialAngleDegrees: number
  initialAngularVelocityRadiansPerSecond: number
  momentOfInertiaKilogramMetersSquared: number
}

export type RollingWithoutSlippingParameters = {
  frictionCoefficient: number
  gravityMetersPerSecondSquared: number
  inclineAngleDegrees: number
  initialSpeedMetersPerSecond: number
  massKilograms: number
  radiusMeters: number
  trackLengthMeters: number
}

export type KinematicsParameters =
  | AtwoodMachineParameters
  | CentripetalForceCurveParameters
  | CollisionsParameters
  | ContinuityBernoulliParameters
  | GravitationalFieldOrbitsParameters
  | HydrostaticsBuoyancyParameters
  | ParticleEquilibriumParameters
  | ProjectileMotionParameters
  | RigidBodyRotationParameters
  | RollingWithoutSlippingParameters
  | TorqueLeversCenterMassParameters
  | UniformCircularMotionParameters
  | UniformLinearMotionParameters
  | UniformlyAcceleratedMotionParameters
  | WorkEnergyTrackParameters

export type KinematicsSample = {
  accelerationMetersPerSecondSquared: number
  accelerationXMetersPerSecondSquared: number
  accelerationZMetersPerSecondSquared: number
  angleRadians: number
  angularAccelerationRadiansPerSecondSquared: number
  angularVelocityRadiansPerSecond: number
  appliedForceNewtons: number
  appliedForceXNewtons: number
  appliedForceZNewtons: number
  appliedWorkJoules: number
  buoyantForceNewtons: number
  centerOfMassMeters: number
  centripetalForceNewtons: number
  centripetalAccelerationMetersPerSecondSquared: number
  crossSectionAreaSquareMeters: number
  displacementMeters: number
  frequencyHertz: number
  flowRateCubicMetersPerSecond: number
  forceOneNewtons: number
  forceOneXNewtons: number
  forceOneZNewtons: number
  forceThreeNewtons: number
  forceThreeXNewtons: number
  forceThreeZNewtons: number
  forceTwoNewtons: number
  forceTwoXNewtons: number
  forceTwoZNewtons: number
  frictionForceNewtons: number
  fluidPressurePascals: number
  gravitationalFieldNewtonsPerKilogram: number
  gripRatio: number
  impulseNewtonSeconds: number
  isGrounded: boolean
  kineticEnergyJoules: number
  kineticEnergyLostJoules: number
  maxStaticFrictionNewtons: number
  momentOfInertiaKilogramMetersSquared: number
  momentumKilogramMetersPerSecond: number
  momentumXKilogramMetersPerSecond: number
  momentumZKilogramMetersPerSecond: number
  netForceNewtons: number
  netTorqueNewtonMeters: number
  normalForceNewtons: number
  periodSeconds: number
  positionMeters: number
  potentialEnergyJoules: number
  pressurePascals: number
  primaryRadiusMeters: number
  secondaryPressurePascals: number
  secondaryCrossSectionAreaSquareMeters: number
  secondarySpeedMetersPerSecond: number
  secondaryRadiusMeters: number
  secondaryVelocityMetersPerSecond: number
  secondaryVelocityXMetersPerSecond: number
  secondaryVelocityZMetersPerSecond: number
  secondaryXMeters: number
  secondaryZMeters: number
  speedMetersPerSecond: number
  submergedFraction: number
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
    | 'angularAcceleration'
    | 'angularVelocity'
    | 'appliedForce'
    | 'centripetal'
    | 'displacement'
    | 'forceOne'
    | 'forceThree'
    | 'forceTwo'
    | 'friction'
    | 'gravity'
    | 'impulse'
    | 'momentum'
    | 'normal'
    | 'resultant'
    | 'secondaryVelocity'
    | 'tension'
    | 'torque'
    | 'velocity'
    | 'weight'
  label: string
  magnitude: number
  unit:
    | 'kg m/s'
    | 'm'
    | 'm/s'
    | 'm/s^2'
    | 'N'
    | 'N m'
    | 'N s'
    | 'rad/s'
    | 'rad/s^2'
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
  'collisions-1d-2d',
  'continuity-bernoulli',
  'gravitational-field-orbits',
  'hydrostatics-buoyancy',
  'particle-equilibrium',
  'rigid-body-rotation',
  'rolling-without-slipping',
  'torque-levers-center-mass',
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
  'angularAccelerationRadiansPerSecondSquared',
  'angularVelocityRadiansPerSecond',
  'appliedForceNewtons',
  'appliedForceXNewtons',
  'appliedForceZNewtons',
  'appliedWorkJoules',
  'buoyantForceNewtons',
  'centerOfMassMeters',
  'centripetalForceNewtons',
  'centripetalAccelerationMetersPerSecondSquared',
  'crossSectionAreaSquareMeters',
  'displacementMeters',
  'frequencyHertz',
  'flowRateCubicMetersPerSecond',
  'forceOneNewtons',
  'forceOneXNewtons',
  'forceOneZNewtons',
  'forceThreeNewtons',
  'forceThreeXNewtons',
  'forceThreeZNewtons',
  'forceTwoNewtons',
  'forceTwoXNewtons',
  'forceTwoZNewtons',
  'frictionForceNewtons',
  'fluidPressurePascals',
  'gravitationalFieldNewtonsPerKilogram',
  'gripRatio',
  'impulseNewtonSeconds',
  'kineticEnergyJoules',
  'kineticEnergyLostJoules',
  'maxStaticFrictionNewtons',
  'momentOfInertiaKilogramMetersSquared',
  'momentumKilogramMetersPerSecond',
  'momentumXKilogramMetersPerSecond',
  'momentumZKilogramMetersPerSecond',
  'netForceNewtons',
  'netTorqueNewtonMeters',
  'normalForceNewtons',
  'periodSeconds',
  'positionMeters',
  'potentialEnergyJoules',
  'pressurePascals',
  'primaryRadiusMeters',
  'secondaryCrossSectionAreaSquareMeters',
  'secondaryPressurePascals',
  'secondaryRadiusMeters',
  'secondarySpeedMetersPerSecond',
  'secondaryVelocityMetersPerSecond',
  'secondaryVelocityXMetersPerSecond',
  'secondaryVelocityZMetersPerSecond',
  'secondaryXMeters',
  'secondaryZMeters',
  'speedMetersPerSecond',
  'submergedFraction',
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
const earthMassKilograms = 5.9722e24
const equilibriumForceToleranceNewtons = 0.05
const gravitationalConstant = 6.6743e-11
const highEccentricityWarningThreshold = 0.65
const hydrostaticFloatToleranceNewtons = 1e-6
const rollingInertiaFactor = 0.5
const torqueToleranceNewtonMeters = 0.05

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
    case 'collisions-1d-2d': {
      const parameters: CollisionsParameters = {
        coefficientOfRestitution: readNumber(
          values,
          'coefficientOfRestitution',
        ),
        impactAngleDegrees: readNumber(values, 'impactAngleDegrees'),
        initialSeparationMeters: readNumber(values, 'initialSeparationMeters'),
        massOneKilograms: readNumber(values, 'massOneKilograms'),
        massTwoKilograms: readNumber(values, 'massTwoKilograms'),
        normalSpeedOneMetersPerSecond: readNumber(
          values,
          'normalSpeedOneMetersPerSecond',
        ),
        normalSpeedTwoMetersPerSecond: readNumber(
          values,
          'normalSpeedTwoMetersPerSecond',
        ),
        radiusOneMeters: readNumber(values, 'radiusOneMeters'),
        radiusTwoMeters: readNumber(values, 'radiusTwoMeters'),
        tangentialSpeedOneMetersPerSecond: readNumber(
          values,
          'tangentialSpeedOneMetersPerSecond',
        ),
        tangentialSpeedTwoMetersPerSecond: readNumber(
          values,
          'tangentialSpeedTwoMetersPerSecond',
        ),
      }

      validateCollisionsParameters(parameters)
      return parameters
    }
    case 'continuity-bernoulli': {
      const parameters: ContinuityBernoulliParameters = {
        flowRateCubicMetersPerSecond: readNumber(
          values,
          'flowRateCubicMetersPerSecond',
        ),
        fluidDensityKilogramsPerCubicMeter: readNumber(
          values,
          'fluidDensityKilogramsPerCubicMeter',
        ),
        gravityMetersPerSecondSquared: readNumber(
          values,
          'gravityMetersPerSecondSquared',
        ),
        heightDifferenceMeters: readNumber(values, 'heightDifferenceMeters'),
        inletAreaSquareMeters: readNumber(values, 'inletAreaSquareMeters'),
        inletPressureKilopascals: readNumber(
          values,
          'inletPressureKilopascals',
        ),
        throatAreaSquareMeters: readNumber(values, 'throatAreaSquareMeters'),
      }

      validateContinuityBernoulliParameters(parameters)
      return parameters
    }
    case 'gravitational-field-orbits': {
      const parameters: GravitationalFieldOrbitsParameters = {
        centralMassEarths: readNumber(values, 'centralMassEarths'),
        eccentricity: readNumber(values, 'eccentricity'),
        initialAngleDegrees: readNumber(values, 'initialAngleDegrees'),
        orbitalRadiusKilometers: readNumber(values, 'orbitalRadiusKilometers'),
        satelliteMassKilograms: readNumber(values, 'satelliteMassKilograms'),
      }

      validateGravitationalFieldOrbitsParameters(parameters)
      return parameters
    }
    case 'hydrostatics-buoyancy': {
      const parameters: HydrostaticsBuoyancyParameters = {
        depthMeters: readNumber(values, 'depthMeters'),
        fluidDensityKilogramsPerCubicMeter: readNumber(
          values,
          'fluidDensityKilogramsPerCubicMeter',
        ),
        gravityMetersPerSecondSquared: readNumber(
          values,
          'gravityMetersPerSecondSquared',
        ),
        objectDensityKilogramsPerCubicMeter: readNumber(
          values,
          'objectDensityKilogramsPerCubicMeter',
        ),
        objectVolumeCubicMeters: readNumber(values, 'objectVolumeCubicMeters'),
      }

      validateHydrostaticsBuoyancyParameters(parameters)
      return parameters
    }
    case 'particle-equilibrium': {
      const parameters: ParticleEquilibriumParameters = {
        forceOneAngleDegrees: readNumber(values, 'forceOneAngleDegrees'),
        forceOneNewtons: readNumber(values, 'forceOneNewtons'),
        forceThreeAngleDegrees: readNumber(values, 'forceThreeAngleDegrees'),
        forceThreeNewtons: readNumber(values, 'forceThreeNewtons'),
        forceTwoAngleDegrees: readNumber(values, 'forceTwoAngleDegrees'),
        forceTwoNewtons: readNumber(values, 'forceTwoNewtons'),
        massKilograms: readNumber(values, 'massKilograms'),
      }

      validateParticleEquilibriumParameters(parameters)
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
    case 'rigid-body-rotation': {
      const parameters: RigidBodyRotationParameters = {
        angularDampingPerSecond: readNumber(values, 'angularDampingPerSecond'),
        appliedTorqueNewtonMeters: readNumber(
          values,
          'appliedTorqueNewtonMeters',
        ),
        initialAngleDegrees: readNumber(values, 'initialAngleDegrees'),
        initialAngularVelocityRadiansPerSecond: readNumber(
          values,
          'initialAngularVelocityRadiansPerSecond',
        ),
        momentOfInertiaKilogramMetersSquared: readNumber(
          values,
          'momentOfInertiaKilogramMetersSquared',
        ),
      }

      validateRigidBodyRotationParameters(parameters)
      return parameters
    }
    case 'rolling-without-slipping': {
      const parameters: RollingWithoutSlippingParameters = {
        frictionCoefficient: readNumber(values, 'frictionCoefficient'),
        gravityMetersPerSecondSquared: readNumber(
          values,
          'gravityMetersPerSecondSquared',
        ),
        inclineAngleDegrees: readNumber(values, 'inclineAngleDegrees'),
        initialSpeedMetersPerSecond: readNumber(
          values,
          'initialSpeedMetersPerSecond',
        ),
        massKilograms: readNumber(values, 'massKilograms'),
        radiusMeters: readNumber(values, 'radiusMeters'),
        trackLengthMeters: readNumber(values, 'trackLengthMeters'),
      }

      validateRollingWithoutSlippingParameters(parameters)
      return parameters
    }
    case 'torque-levers-center-mass': {
      const parameters: TorqueLeversCenterMassParameters = {
        appliedForceArmMeters: readNumber(values, 'appliedForceArmMeters'),
        appliedForceNewtons: readNumber(values, 'appliedForceNewtons'),
        gravityMetersPerSecondSquared: readNumber(
          values,
          'gravityMetersPerSecondSquared',
        ),
        leftArmMeters: readNumber(values, 'leftArmMeters'),
        leftMassKilograms: readNumber(values, 'leftMassKilograms'),
        rightArmMeters: readNumber(values, 'rightArmMeters'),
        rightMassKilograms: readNumber(values, 'rightMassKilograms'),
      }

      validateTorqueLeversCenterMassParameters(parameters)
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
    case 'collisions-1d-2d':
      return computeCollisionsSample(
        parameters as CollisionsParameters,
        timeSeconds,
      )
    case 'continuity-bernoulli':
      return computeContinuityBernoulliSample(
        parameters as ContinuityBernoulliParameters,
        timeSeconds,
      )
    case 'gravitational-field-orbits':
      return computeGravitationalFieldOrbitsSample(
        parameters as GravitationalFieldOrbitsParameters,
        timeSeconds,
      )
    case 'hydrostatics-buoyancy':
      return computeHydrostaticsBuoyancySample(
        parameters as HydrostaticsBuoyancyParameters,
        timeSeconds,
      )
    case 'particle-equilibrium':
      return computeParticleEquilibriumSample(
        parameters as ParticleEquilibriumParameters,
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
    case 'rigid-body-rotation':
      return computeRigidBodyRotationSample(
        parameters as RigidBodyRotationParameters,
        timeSeconds,
      )
    case 'rolling-without-slipping':
      return computeRollingWithoutSlippingSample(
        parameters as RollingWithoutSlippingParameters,
        timeSeconds,
      )
    case 'torque-levers-center-mass':
      return computeTorqueLeversCenterMassSample(
        parameters as TorqueLeversCenterMassParameters,
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

  if (simulationId === 'collisions-1d-2d') {
    return [
      {
        direction: normalizeVector({
          x: sample.velocityXMetersPerSecond,
          z: sample.velocityZMetersPerSecond,
        }),
        id: 'velocity',
        label: 'Velocidade do corpo 1',
        magnitude: sample.speedMetersPerSecond,
        unit: 'm/s',
      },
      {
        direction: normalizeVector({
          x: sample.secondaryVelocityXMetersPerSecond,
          z: sample.secondaryVelocityZMetersPerSecond,
        }),
        id: 'secondaryVelocity',
        label: 'Velocidade do corpo 2',
        magnitude: sample.secondarySpeedMetersPerSecond,
        unit: 'm/s',
      },
      {
        direction: normalizeVector({
          x: sample.momentumXKilogramMetersPerSecond,
          z: sample.momentumZKilogramMetersPerSecond,
        }),
        id: 'momentum',
        label: 'Momento total',
        magnitude: sample.momentumKilogramMetersPerSecond,
        unit: 'kg m/s',
      },
      {
        direction: normalizeVector({
          x: sample.secondaryXMeters - sample.xMeters,
          z: sample.secondaryZMeters - sample.zMeters,
        }),
        id: 'impulse',
        label: 'Impulso no contato',
        magnitude: sample.impulseNewtonSeconds,
        unit: 'N s',
      },
    ]
  }

  if (simulationId === 'continuity-bernoulli') {
    return [
      {
        direction: normalizeVector({
          x: sample.velocityXMetersPerSecond,
          z: sample.velocityZMetersPerSecond,
        }),
        id: 'velocity',
        label: 'Velocidade na entrada',
        magnitude: sample.speedMetersPerSecond,
        unit: 'm/s',
      },
      {
        direction: normalizeVector({
          x: sample.secondaryVelocityXMetersPerSecond,
          z: sample.secondaryVelocityZMetersPerSecond,
        }),
        id: 'secondaryVelocity',
        label: 'Velocidade no estrangulamento',
        magnitude: sample.secondarySpeedMetersPerSecond,
        unit: 'm/s',
      },
    ]
  }

  if (simulationId === 'gravitational-field-orbits') {
    return [
      {
        direction: normalizeVector({
          x: sample.velocityXMetersPerSecond,
          z: sample.velocityZMetersPerSecond,
        }),
        id: 'velocity',
        label: 'Velocidade orbital',
        magnitude: sample.speedMetersPerSecond,
        unit: 'm/s',
      },
      {
        direction: normalizeVector({ x: -sample.xMeters, z: -sample.zMeters }),
        id: 'gravity',
        label: 'Campo gravitacional',
        magnitude: sample.gravitationalFieldNewtonsPerKilogram,
        unit: 'm/s^2',
      },
      {
        direction: normalizeVector({ x: -sample.xMeters, z: -sample.zMeters }),
        id: 'centripetal',
        label: 'Forca gravitacional',
        magnitude: sample.centripetalForceNewtons,
        unit: 'N',
      },
    ]
  }

  if (simulationId === 'hydrostatics-buoyancy') {
    return [
      {
        direction: { x: 0, z: 1 },
        id: 'normal',
        label: 'Empuxo',
        magnitude: sample.buoyantForceNewtons,
        unit: 'N',
      },
      {
        direction: { x: 0, z: -1 },
        id: 'weight',
        label: 'Peso',
        magnitude: sample.weightNewtons,
        unit: 'N',
      },
      {
        direction: { x: 0, z: Math.sign(sample.netForceNewtons) || 0 },
        id: 'resultant',
        label: 'Resultante vertical',
        magnitude: Math.abs(sample.netForceNewtons),
        unit: 'N',
      },
    ]
  }

  if (simulationId === 'particle-equilibrium') {
    return [
      {
        direction: normalizeVector({
          x: sample.forceOneXNewtons,
          z: sample.forceOneZNewtons,
        }),
        id: 'forceOne',
        label: 'Forca A',
        magnitude: sample.forceOneNewtons,
        unit: 'N',
      },
      {
        direction: normalizeVector({
          x: sample.forceTwoXNewtons,
          z: sample.forceTwoZNewtons,
        }),
        id: 'forceTwo',
        label: 'Forca B',
        magnitude: sample.forceTwoNewtons,
        unit: 'N',
      },
      {
        direction: normalizeVector({
          x: sample.forceThreeXNewtons,
          z: sample.forceThreeZNewtons,
        }),
        id: 'forceThree',
        label: 'Forca C',
        magnitude: sample.forceThreeNewtons,
        unit: 'N',
      },
      {
        direction: normalizeVector({
          x: sample.accelerationXMetersPerSecondSquared,
          z: sample.accelerationZMetersPerSecondSquared,
        }),
        id: 'resultant',
        label: 'Resultante',
        magnitude: sample.netForceNewtons,
        unit: 'N',
      },
    ]
  }

  if (simulationId === 'rolling-without-slipping') {
    return [
      {
        direction: normalizeVector({
          x: sample.velocityXMetersPerSecond,
          z: sample.velocityZMetersPerSecond,
        }),
        id: 'velocity',
        label: 'Velocidade do centro',
        magnitude: sample.speedMetersPerSecond,
        unit: 'm/s',
      },
      {
        direction: normalizeVector({
          x: sample.accelerationXMetersPerSecondSquared,
          z: sample.accelerationZMetersPerSecondSquared,
        }),
        id: 'acceleration',
        label: 'Aceleracao do centro',
        magnitude: Math.abs(sample.accelerationMetersPerSecondSquared),
        unit: 'm/s^2',
      },
      {
        direction: normalizeVector({
          x: -sample.velocityXMetersPerSecond,
          z: -sample.velocityZMetersPerSecond,
        }),
        id: 'friction',
        label: 'Atrito estatico requerido',
        magnitude: sample.frictionForceNewtons,
        unit: 'N',
      },
      {
        direction: { x: 0, z: 1 },
        id: 'normal',
        label: 'Normal',
        magnitude: sample.normalForceNewtons,
        unit: 'N',
      },
    ]
  }

  if (simulationId === 'torque-levers-center-mass') {
    return [
      {
        direction: { x: 0, z: -1 },
        id: 'forceOne',
        label: 'Peso esquerdo',
        magnitude: sample.forceOneNewtons,
        unit: 'N',
      },
      {
        direction: { x: 0, z: -1 },
        id: 'forceTwo',
        label: 'Peso direito',
        magnitude: sample.forceTwoNewtons,
        unit: 'N',
      },
      {
        direction: { x: 0, z: Math.sign(sample.appliedForceNewtons) || 1 },
        id: 'appliedForce',
        label: 'Forca aplicada',
        magnitude: Math.abs(sample.appliedForceNewtons),
        unit: 'N',
      },
      {
        direction: { x: Math.sign(sample.netTorqueNewtonMeters) || 1, z: 0 },
        id: 'torque',
        label: 'Torque resultante',
        magnitude: Math.abs(sample.netTorqueNewtonMeters),
        unit: 'N m',
      },
    ]
  }

  if (simulationId === 'rigid-body-rotation') {
    return [
      {
        direction: {
          x: Math.cos(sample.angleRadians + Math.PI / 2),
          z: Math.sin(sample.angleRadians + Math.PI / 2),
        },
        id: 'angularVelocity',
        label: 'Velocidade angular',
        magnitude: Math.abs(sample.angularVelocityRadiansPerSecond),
        unit: 'rad/s',
      },
      {
        direction: {
          x: Math.cos(sample.angleRadians),
          z: Math.sin(sample.angleRadians),
        },
        id: 'torque',
        label: 'Torque aplicado',
        magnitude: Math.abs(sample.netTorqueNewtonMeters),
        unit: 'N m',
      },
      {
        direction: {
          x: Math.cos(sample.angleRadians + Math.PI / 2),
          z: Math.sin(sample.angleRadians + Math.PI / 2),
        },
        id: 'angularAcceleration',
        label: 'Aceleracao angular',
        magnitude: Math.abs(sample.angularAccelerationRadiansPerSecondSquared),
        unit: 'rad/s^2',
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

function computeCollisionsSample(
  parameters: CollisionsParameters,
  timeSeconds: number,
): KinematicsSample {
  const collision = resolveCollision(parameters, timeSeconds)
  const primarySpeedMetersPerSecond = Math.hypot(
    collision.primaryVelocity.x,
    collision.primaryVelocity.z,
  )
  const secondarySpeedMetersPerSecond = Math.hypot(
    collision.secondaryVelocity.x,
    collision.secondaryVelocity.z,
  )
  const kineticEnergyJoules =
    0.5 * parameters.massOneKilograms * primarySpeedMetersPerSecond ** 2 +
    0.5 * parameters.massTwoKilograms * secondarySpeedMetersPerSecond ** 2
  const totalMomentum = {
    x:
      parameters.massOneKilograms * collision.primaryVelocity.x +
      parameters.massTwoKilograms * collision.secondaryVelocity.x,
    z:
      parameters.massOneKilograms * collision.primaryVelocity.z +
      parameters.massTwoKilograms * collision.secondaryVelocity.z,
  }

  return buildSample({
    displacementMeters: Math.hypot(
      collision.primaryPosition.x - collision.initialPrimaryPosition.x,
      collision.primaryPosition.z - collision.initialPrimaryPosition.z,
    ),
    impulseNewtonSeconds: collision.impulseNewtonSeconds,
    kineticEnergyJoules,
    kineticEnergyLostJoules:
      collision.initialKineticEnergyJoules - kineticEnergyJoules,
    momentumKilogramMetersPerSecond: Math.hypot(
      totalMomentum.x,
      totalMomentum.z,
    ),
    momentumXKilogramMetersPerSecond: totalMomentum.x,
    momentumZKilogramMetersPerSecond: totalMomentum.z,
    positionMeters: collision.primaryPosition.x,
    primaryRadiusMeters: parameters.radiusOneMeters,
    secondaryRadiusMeters: parameters.radiusTwoMeters,
    secondarySpeedMetersPerSecond,
    secondaryVelocityMetersPerSecond: secondarySpeedMetersPerSecond,
    secondaryVelocityXMetersPerSecond: collision.secondaryVelocity.x,
    secondaryVelocityZMetersPerSecond: collision.secondaryVelocity.z,
    secondaryXMeters: collision.secondaryPosition.x,
    secondaryZMeters: collision.secondaryPosition.z,
    speedMetersPerSecond: primarySpeedMetersPerSecond,
    timeSeconds,
    totalEnergyJoules: kineticEnergyJoules,
    velocityMetersPerSecond: primarySpeedMetersPerSecond,
    velocityXMetersPerSecond: collision.primaryVelocity.x,
    velocityZMetersPerSecond: collision.primaryVelocity.z,
    xMeters: collision.primaryPosition.x,
    zMeters: collision.primaryPosition.z,
  })
}

function computeContinuityBernoulliSample(
  parameters: ContinuityBernoulliParameters,
  timeSeconds: number,
): KinematicsSample {
  const inletVelocityMetersPerSecond =
    parameters.flowRateCubicMetersPerSecond / parameters.inletAreaSquareMeters
  const throatVelocityMetersPerSecond =
    parameters.flowRateCubicMetersPerSecond / parameters.throatAreaSquareMeters
  const inletPressurePascals = parameters.inletPressureKilopascals * 1000
  const throatPressurePascals =
    inletPressurePascals -
    parameters.fluidDensityKilogramsPerCubicMeter *
      parameters.gravityMetersPerSecondSquared *
      parameters.heightDifferenceMeters +
    0.5 *
      parameters.fluidDensityKilogramsPerCubicMeter *
      (inletVelocityMetersPerSecond ** 2 -
        throatVelocityMetersPerSecond ** 2)
  const pressureDropPascals = inletPressurePascals - throatPressurePascals
  const phase = (timeSeconds % 4) / 4
  const xMeters = -3 + phase * 6
  const zMeters =
    phase < 0.5
      ? 2 * phase * parameters.heightDifferenceMeters
      : parameters.heightDifferenceMeters
  const localVelocityMetersPerSecond =
    phase < 0.5 ? inletVelocityMetersPerSecond : throatVelocityMetersPerSecond
  const kineticEnergyJoules =
    0.5 *
    parameters.fluidDensityKilogramsPerCubicMeter *
    localVelocityMetersPerSecond ** 2
  const potentialEnergyJoules =
    parameters.fluidDensityKilogramsPerCubicMeter *
    parameters.gravityMetersPerSecondSquared *
    zMeters

  return buildSample({
    crossSectionAreaSquareMeters: parameters.inletAreaSquareMeters,
    displacementMeters: phase * 6,
    flowRateCubicMetersPerSecond: parameters.flowRateCubicMetersPerSecond,
    forceOneNewtons: inletPressurePascals,
    forceTwoNewtons: throatPressurePascals,
    kineticEnergyJoules,
    positionMeters: phase * 6,
    potentialEnergyJoules,
    pressurePascals: inletPressurePascals,
    secondaryCrossSectionAreaSquareMeters: parameters.throatAreaSquareMeters,
    secondaryPressurePascals: throatPressurePascals,
    secondarySpeedMetersPerSecond: throatVelocityMetersPerSecond,
    secondaryVelocityMetersPerSecond: throatVelocityMetersPerSecond,
    secondaryVelocityXMetersPerSecond: throatVelocityMetersPerSecond,
    speedMetersPerSecond: inletVelocityMetersPerSecond,
    timeSeconds,
    totalEnergyJoules:
      inletPressurePascals +
      kineticEnergyJoules +
      potentialEnergyJoules,
    velocityMetersPerSecond: inletVelocityMetersPerSecond,
    velocityXMetersPerSecond: inletVelocityMetersPerSecond,
    xMeters,
    zMeters,
    netForceNewtons: pressureDropPascals,
  })
}

function computeGravitationalFieldOrbitsSample(
  parameters: GravitationalFieldOrbitsParameters,
  timeSeconds: number,
): KinematicsSample {
  const centralMassKilograms =
    parameters.centralMassEarths * earthMassKilograms
  const gravitationalParameter =
    gravitationalConstant * centralMassKilograms
  const periapsisRadiusMeters = parameters.orbitalRadiusKilometers * 1000
  const semiMajorAxisMeters =
    periapsisRadiusMeters / (1 - parameters.eccentricity)
  const meanMotionRadiansPerSecond = Math.sqrt(
    gravitationalParameter / semiMajorAxisMeters ** 3,
  )
  const angleRadians =
    degreesToRadians(parameters.initialAngleDegrees) +
    meanMotionRadiansPerSecond * timeSeconds
  const orbitalRadiusMeters =
    (semiMajorAxisMeters * (1 - parameters.eccentricity ** 2)) /
    (1 + parameters.eccentricity * Math.cos(angleRadians))
  const xMeters = orbitalRadiusMeters * Math.cos(angleRadians)
  const zMeters = orbitalRadiusMeters * Math.sin(angleRadians)
  const orbitalSpeedMetersPerSecond = Math.sqrt(
    gravitationalParameter *
      (2 / orbitalRadiusMeters - 1 / semiMajorAxisMeters),
  )
  const velocityXMetersPerSecond =
    -orbitalSpeedMetersPerSecond * Math.sin(angleRadians)
  const velocityZMetersPerSecond =
    orbitalSpeedMetersPerSecond * Math.cos(angleRadians)
  const gravitationalFieldNewtonsPerKilogram =
    gravitationalParameter / orbitalRadiusMeters ** 2
  const accelerationXMetersPerSecondSquared =
    -gravitationalFieldNewtonsPerKilogram * Math.cos(angleRadians)
  const accelerationZMetersPerSecondSquared =
    -gravitationalFieldNewtonsPerKilogram * Math.sin(angleRadians)
  const kineticEnergyJoules =
    0.5 *
    parameters.satelliteMassKilograms *
    orbitalSpeedMetersPerSecond ** 2
  const potentialEnergyJoules =
    (-gravitationalParameter * parameters.satelliteMassKilograms) /
    orbitalRadiusMeters
  const periodSeconds =
    (2 * Math.PI) / meanMotionRadiansPerSecond

  return buildSample({
    accelerationMetersPerSecondSquared:
      gravitationalFieldNewtonsPerKilogram,
    accelerationXMetersPerSecondSquared,
    accelerationZMetersPerSecondSquared,
    angleRadians,
    angularVelocityRadiansPerSecond: meanMotionRadiansPerSecond,
    centripetalAccelerationMetersPerSecondSquared:
      gravitationalFieldNewtonsPerKilogram,
    centripetalForceNewtons:
      parameters.satelliteMassKilograms *
      gravitationalFieldNewtonsPerKilogram,
    displacementMeters: orbitalRadiusMeters - periapsisRadiusMeters,
    frequencyHertz: 1 / periodSeconds,
    gravitationalFieldNewtonsPerKilogram,
    kineticEnergyJoules,
    periodSeconds,
    positionMeters: orbitalRadiusMeters,
    potentialEnergyJoules,
    speedMetersPerSecond: orbitalSpeedMetersPerSecond,
    timeSeconds,
    totalEnergyJoules: kineticEnergyJoules + potentialEnergyJoules,
    velocityMetersPerSecond: orbitalSpeedMetersPerSecond,
    velocityXMetersPerSecond,
    velocityZMetersPerSecond,
    xMeters,
    zMeters,
  })
}

function computeHydrostaticsBuoyancySample(
  parameters: HydrostaticsBuoyancyParameters,
  timeSeconds: number,
): KinematicsSample {
  const objectMassKilograms =
    parameters.objectDensityKilogramsPerCubicMeter *
    parameters.objectVolumeCubicMeters
  const weightNewtons =
    objectMassKilograms * parameters.gravityMetersPerSecondSquared
  const fullBuoyantForceNewtons =
    parameters.fluidDensityKilogramsPerCubicMeter *
    parameters.gravityMetersPerSecondSquared *
    parameters.objectVolumeCubicMeters
  const submergedFraction = clamp(
    parameters.objectDensityKilogramsPerCubicMeter /
      parameters.fluidDensityKilogramsPerCubicMeter,
    0,
    1,
  )
  const buoyantForceNewtons =
    parameters.objectDensityKilogramsPerCubicMeter <=
    parameters.fluidDensityKilogramsPerCubicMeter
      ? weightNewtons
      : fullBuoyantForceNewtons
  const netForceNewtons = buoyantForceNewtons - weightNewtons
  const fluidPressurePascals =
    parameters.fluidDensityKilogramsPerCubicMeter *
    parameters.gravityMetersPerSecondSquared *
    parameters.depthMeters
  const bobbingOffsetMeters =
    Math.abs(netForceNewtons) <= hydrostaticFloatToleranceNewtons
      ? Math.sin(timeSeconds * 1.6) * 0.035
      : 0
  const zMeters = -parameters.depthMeters + bobbingOffsetMeters

  return buildSample({
    buoyantForceNewtons,
    displacementMeters: parameters.depthMeters,
    fluidPressurePascals,
    forceOneNewtons: buoyantForceNewtons,
    forceTwoNewtons: weightNewtons,
    netForceNewtons,
    positionMeters: parameters.depthMeters,
    pressurePascals: fluidPressurePascals,
    primaryRadiusMeters: Math.cbrt(parameters.objectVolumeCubicMeters),
    speedMetersPerSecond: 0,
    submergedFraction,
    timeSeconds,
    totalEnergyJoules:
      Math.abs(netForceNewtons) * parameters.depthMeters,
    velocityMetersPerSecond: 0,
    weightNewtons,
    xMeters: 0,
    zMeters,
  })
}

function computeParticleEquilibriumSample(
  parameters: ParticleEquilibriumParameters,
  timeSeconds: number,
): KinematicsSample {
  const forceOne = vectorFromPolar(
    parameters.forceOneNewtons,
    parameters.forceOneAngleDegrees,
  )
  const forceTwo = vectorFromPolar(
    parameters.forceTwoNewtons,
    parameters.forceTwoAngleDegrees,
  )
  const forceThree = vectorFromPolar(
    parameters.forceThreeNewtons,
    parameters.forceThreeAngleDegrees,
  )
  const resultantForce = {
    x: forceOne.x + forceTwo.x + forceThree.x,
    z: forceOne.z + forceTwo.z + forceThree.z,
  }
  const netForceNewtons = Math.hypot(resultantForce.x, resultantForce.z)
  const acceleration = {
    x: resultantForce.x / parameters.massKilograms,
    z: resultantForce.z / parameters.massKilograms,
  }
  const xMeters = 0.5 * acceleration.x * timeSeconds ** 2
  const zMeters = 0.5 * acceleration.z * timeSeconds ** 2
  const velocityXMetersPerSecond = acceleration.x * timeSeconds
  const velocityZMetersPerSecond = acceleration.z * timeSeconds
  const speedMetersPerSecond = Math.hypot(
    velocityXMetersPerSecond,
    velocityZMetersPerSecond,
  )
  const kineticEnergyJoules =
    0.5 * parameters.massKilograms * speedMetersPerSecond ** 2

  return buildSample({
    accelerationMetersPerSecondSquared: Math.hypot(acceleration.x, acceleration.z),
    accelerationXMetersPerSecondSquared: acceleration.x,
    accelerationZMetersPerSecondSquared: acceleration.z,
    displacementMeters: Math.hypot(xMeters, zMeters),
    forceOneNewtons: parameters.forceOneNewtons,
    forceOneXNewtons: forceOne.x,
    forceOneZNewtons: forceOne.z,
    forceThreeNewtons: parameters.forceThreeNewtons,
    forceThreeXNewtons: forceThree.x,
    forceThreeZNewtons: forceThree.z,
    forceTwoNewtons: parameters.forceTwoNewtons,
    forceTwoXNewtons: forceTwo.x,
    forceTwoZNewtons: forceTwo.z,
    kineticEnergyJoules,
    netForceNewtons,
    positionMeters: Math.hypot(xMeters, zMeters),
    speedMetersPerSecond,
    timeSeconds,
    totalEnergyJoules: kineticEnergyJoules,
    velocityMetersPerSecond: speedMetersPerSecond,
    velocityXMetersPerSecond,
    velocityZMetersPerSecond,
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

function computeRigidBodyRotationSample(
  parameters: RigidBodyRotationParameters,
  timeSeconds: number,
): KinematicsSample {
  const initialAngleRadians = degreesToRadians(parameters.initialAngleDegrees)
  const driveAngularAcceleration =
    parameters.appliedTorqueNewtonMeters /
    parameters.momentOfInertiaKilogramMetersSquared
  const angularState = computeDampedAngularMotion({
    angularDampingPerSecond: parameters.angularDampingPerSecond,
    driveAngularAcceleration,
    initialAngleRadians,
    initialAngularVelocityRadiansPerSecond:
      parameters.initialAngularVelocityRadiansPerSecond,
    timeSeconds,
  })
  const kineticEnergyJoules =
    0.5 *
    parameters.momentOfInertiaKilogramMetersSquared *
    angularState.angularVelocityRadiansPerSecond ** 2
  const initialKineticEnergyJoules =
    0.5 *
    parameters.momentOfInertiaKilogramMetersSquared *
    parameters.initialAngularVelocityRadiansPerSecond ** 2
  const angularDisplacementRadians =
    angularState.angleRadians - initialAngleRadians
  const appliedWorkJoules =
    parameters.appliedTorqueNewtonMeters * angularDisplacementRadians
  const thermalEnergyJoules = Math.max(
    0,
    appliedWorkJoules + initialKineticEnergyJoules - kineticEnergyJoules,
  )

  return buildSample({
    angleRadians: angularState.angleRadians,
    angularAccelerationRadiansPerSecondSquared:
      angularState.angularAccelerationRadiansPerSecondSquared,
    angularVelocityRadiansPerSecond:
      angularState.angularVelocityRadiansPerSecond,
    appliedWorkJoules,
    kineticEnergyJoules,
    momentOfInertiaKilogramMetersSquared:
      parameters.momentOfInertiaKilogramMetersSquared,
    netTorqueNewtonMeters: parameters.appliedTorqueNewtonMeters,
    positionMeters: angularDisplacementRadians,
    speedMetersPerSecond: Math.abs(angularState.angularVelocityRadiansPerSecond),
    thermalEnergyJoules,
    timeSeconds,
    totalEnergyJoules: kineticEnergyJoules + thermalEnergyJoules,
    velocityMetersPerSecond: angularState.angularVelocityRadiansPerSecond,
    xMeters: 0,
    zMeters: 0,
  })
}

function computeRollingWithoutSlippingSample(
  parameters: RollingWithoutSlippingParameters,
  timeSeconds: number,
): KinematicsSample {
  const inclineAngleRadians = degreesToRadians(parameters.inclineAngleDegrees)
  const normalForceNewtons =
    parameters.massKilograms *
    parameters.gravityMetersPerSecondSquared *
    Math.cos(inclineAngleRadians)
  const weightNewtons =
    parameters.massKilograms * parameters.gravityMetersPerSecondSquared
  const momentOfInertiaKilogramMetersSquared =
    rollingInertiaFactor *
    parameters.massKilograms *
    parameters.radiusMeters ** 2
  const pureRollingAccelerationMetersPerSecondSquared =
    (parameters.gravityMetersPerSecondSquared *
      Math.sin(inclineAngleRadians)) /
    (1 + rollingInertiaFactor)
  const requiredStaticFrictionNewtons =
    parameters.massKilograms *
    parameters.gravityMetersPerSecondSquared *
    Math.sin(inclineAngleRadians) *
    (rollingInertiaFactor / (1 + rollingInertiaFactor))
  const maxStaticFrictionNewtons =
    parameters.frictionCoefficient * normalForceNewtons
  const canRollWithoutSlipping =
    requiredStaticFrictionNewtons <=
    maxStaticFrictionNewtons + centripetalSlipTolerance
  const accelerationMetersPerSecondSquared = canRollWithoutSlipping
    ? pureRollingAccelerationMetersPerSecondSquared
    : Math.max(
        0,
        parameters.gravityMetersPerSecondSquared *
          (Math.sin(inclineAngleRadians) -
            parameters.frictionCoefficient * Math.cos(inclineAngleRadians)),
      )
  const motion = computeForwardSegmentMotion({
    accelerationMetersPerSecondSquared,
    initialVelocityMetersPerSecond: parameters.initialSpeedMetersPerSecond,
    maxPositionMeters: parameters.trackLengthMeters,
    timeSeconds,
  })
  const speedMetersPerSecond = Math.max(0, motion.velocityMetersPerSecond)
  const frictionForceNewtons = canRollWithoutSlipping
    ? requiredStaticFrictionNewtons
    : maxStaticFrictionNewtons
  const angularAccelerationRadiansPerSecondSquared = canRollWithoutSlipping
    ? motion.accelerationMetersPerSecondSquared / parameters.radiusMeters
    : frictionForceNewtons * parameters.radiusMeters /
      momentOfInertiaKilogramMetersSquared
  const angularVelocityRadiansPerSecond = canRollWithoutSlipping
    ? speedMetersPerSecond / parameters.radiusMeters
    : parameters.initialSpeedMetersPerSecond / parameters.radiusMeters +
      angularAccelerationRadiansPerSecondSquared * timeSeconds
  const angleRadians = canRollWithoutSlipping
    ? motion.positionMeters / parameters.radiusMeters
    : parameters.initialSpeedMetersPerSecond * timeSeconds /
        parameters.radiusMeters +
      0.5 * angularAccelerationRadiansPerSecondSquared * timeSeconds ** 2
  const xMeters = motion.positionMeters * Math.cos(inclineAngleRadians)
  const zMeters =
    parameters.trackLengthMeters * Math.sin(inclineAngleRadians) -
    motion.positionMeters * Math.sin(inclineAngleRadians) +
    parameters.radiusMeters
  const translationalKineticEnergyJoules =
    0.5 * parameters.massKilograms * speedMetersPerSecond ** 2
  const rotationalKineticEnergyJoules =
    0.5 *
    momentOfInertiaKilogramMetersSquared *
    angularVelocityRadiansPerSecond ** 2
  const kineticEnergyJoules =
    translationalKineticEnergyJoules + rotationalKineticEnergyJoules
  const potentialEnergyJoules =
    parameters.massKilograms *
    parameters.gravityMetersPerSecondSquared *
    Math.max(0, zMeters - parameters.radiusMeters)
  const initialKineticEnergyJoules =
    0.5 * parameters.massKilograms * parameters.initialSpeedMetersPerSecond ** 2 +
    0.5 *
      momentOfInertiaKilogramMetersSquared *
      (parameters.initialSpeedMetersPerSecond / parameters.radiusMeters) ** 2
  const initialPotentialEnergyJoules =
    parameters.massKilograms *
    parameters.gravityMetersPerSecondSquared *
    parameters.trackLengthMeters *
    Math.sin(inclineAngleRadians)
  const trackedMechanicalEnergyJoules =
    kineticEnergyJoules + potentialEnergyJoules
  const initialMechanicalEnergyJoules =
    initialKineticEnergyJoules + initialPotentialEnergyJoules
  const thermalEnergyJoules = canRollWithoutSlipping
    ? 0
    : Math.max(0, initialMechanicalEnergyJoules - trackedMechanicalEnergyJoules)
  const gripRatio = computeCentripetalGripRatio(
    requiredStaticFrictionNewtons,
    maxStaticFrictionNewtons,
  )

  return buildSample({
    accelerationMetersPerSecondSquared:
      motion.accelerationMetersPerSecondSquared,
    accelerationXMetersPerSecondSquared:
      motion.accelerationMetersPerSecondSquared *
      Math.cos(inclineAngleRadians),
    accelerationZMetersPerSecondSquared:
      -motion.accelerationMetersPerSecondSquared *
      Math.sin(inclineAngleRadians),
    angleRadians,
    angularAccelerationRadiansPerSecondSquared,
    angularVelocityRadiansPerSecond,
    displacementMeters: motion.positionMeters,
    frictionForceNewtons,
    gripRatio,
    kineticEnergyJoules,
    maxStaticFrictionNewtons,
    momentOfInertiaKilogramMetersSquared,
    netForceNewtons:
      parameters.massKilograms * motion.accelerationMetersPerSecondSquared,
    normalForceNewtons,
    positionMeters: motion.positionMeters,
    potentialEnergyJoules,
    primaryRadiusMeters: parameters.radiusMeters,
    speedMetersPerSecond,
    thermalEnergyJoules,
    timeSeconds,
    totalEnergyJoules:
      kineticEnergyJoules + potentialEnergyJoules + thermalEnergyJoules,
    velocityMetersPerSecond: speedMetersPerSecond,
    velocityXMetersPerSecond:
      speedMetersPerSecond * Math.cos(inclineAngleRadians),
    velocityZMetersPerSecond:
      -speedMetersPerSecond * Math.sin(inclineAngleRadians),
    weightNewtons,
    xMeters,
    zMeters,
  })
}

function computeTorqueLeversCenterMassSample(
  parameters: TorqueLeversCenterMassParameters,
  timeSeconds: number,
): KinematicsSample {
  const leftWeightNewtons =
    parameters.leftMassKilograms * parameters.gravityMetersPerSecondSquared
  const rightWeightNewtons =
    parameters.rightMassKilograms * parameters.gravityMetersPerSecondSquared
  const leftTorqueNewtonMeters = leftWeightNewtons * parameters.leftArmMeters
  const rightTorqueNewtonMeters =
    -rightWeightNewtons * parameters.rightArmMeters
  const appliedTorqueNewtonMeters =
    parameters.appliedForceNewtons * parameters.appliedForceArmMeters
  const netTorqueNewtonMeters =
    leftTorqueNewtonMeters +
    rightTorqueNewtonMeters +
    appliedTorqueNewtonMeters
  const totalMassKilograms =
    parameters.leftMassKilograms + parameters.rightMassKilograms
  const centerOfMassMeters =
    (parameters.rightMassKilograms * parameters.rightArmMeters -
      parameters.leftMassKilograms * parameters.leftArmMeters) /
    totalMassKilograms
  const momentOfInertiaKilogramMetersSquared =
    parameters.leftMassKilograms * parameters.leftArmMeters ** 2 +
    parameters.rightMassKilograms * parameters.rightArmMeters ** 2
  const angularAccelerationRadiansPerSecondSquared =
    netTorqueNewtonMeters / momentOfInertiaKilogramMetersSquared
  const angleRadians =
    clamp(angularAccelerationRadiansPerSecondSquared * 0.08, -0.35, 0.35)
  const angularVelocityRadiansPerSecond =
    angularAccelerationRadiansPerSecondSquared * timeSeconds

  return buildSample({
    angleRadians,
    angularAccelerationRadiansPerSecondSquared,
    angularVelocityRadiansPerSecond,
    appliedForceNewtons: parameters.appliedForceNewtons,
    appliedForceZNewtons: parameters.appliedForceNewtons,
    centerOfMassMeters,
    forceOneNewtons: leftWeightNewtons,
    forceOneXNewtons: 0,
    forceOneZNewtons: -leftWeightNewtons,
    forceTwoNewtons: rightWeightNewtons,
    forceTwoXNewtons: 0,
    forceTwoZNewtons: -rightWeightNewtons,
    momentOfInertiaKilogramMetersSquared,
    netForceNewtons: Math.abs(
      parameters.appliedForceNewtons - leftWeightNewtons - rightWeightNewtons,
    ),
    netTorqueNewtonMeters,
    positionMeters: centerOfMassMeters,
    speedMetersPerSecond: Math.abs(angularVelocityRadiansPerSecond),
    timeSeconds,
    totalEnergyJoules: Math.abs(netTorqueNewtonMeters * angleRadians),
    velocityMetersPerSecond: angularVelocityRadiansPerSecond,
    xMeters: centerOfMassMeters,
    zMeters: 0,
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
    angularAccelerationRadiansPerSecondSquared:
      sample.angularAccelerationRadiansPerSecondSquared ?? 0,
    angularVelocityRadiansPerSecond:
      sample.angularVelocityRadiansPerSecond ?? 0,
    appliedForceNewtons: sample.appliedForceNewtons ?? 0,
    appliedForceXNewtons: sample.appliedForceXNewtons ?? 0,
    appliedForceZNewtons: sample.appliedForceZNewtons ?? 0,
    appliedWorkJoules: sample.appliedWorkJoules ?? 0,
    buoyantForceNewtons: sample.buoyantForceNewtons ?? 0,
    centerOfMassMeters: sample.centerOfMassMeters ?? 0,
    centripetalForceNewtons: sample.centripetalForceNewtons ?? 0,
    centripetalAccelerationMetersPerSecondSquared:
      sample.centripetalAccelerationMetersPerSecondSquared ?? 0,
    crossSectionAreaSquareMeters: sample.crossSectionAreaSquareMeters ?? 0,
    displacementMeters: sample.displacementMeters ?? 0,
    frequencyHertz: sample.frequencyHertz ?? 0,
    flowRateCubicMetersPerSecond:
      sample.flowRateCubicMetersPerSecond ?? 0,
    forceOneNewtons: sample.forceOneNewtons ?? 0,
    forceOneXNewtons: sample.forceOneXNewtons ?? 0,
    forceOneZNewtons: sample.forceOneZNewtons ?? 0,
    forceThreeNewtons: sample.forceThreeNewtons ?? 0,
    forceThreeXNewtons: sample.forceThreeXNewtons ?? 0,
    forceThreeZNewtons: sample.forceThreeZNewtons ?? 0,
    forceTwoNewtons: sample.forceTwoNewtons ?? 0,
    forceTwoXNewtons: sample.forceTwoXNewtons ?? 0,
    forceTwoZNewtons: sample.forceTwoZNewtons ?? 0,
    frictionForceNewtons: sample.frictionForceNewtons ?? 0,
    fluidPressurePascals: sample.fluidPressurePascals ?? 0,
    gravitationalFieldNewtonsPerKilogram:
      sample.gravitationalFieldNewtonsPerKilogram ?? 0,
    gripRatio: sample.gripRatio ?? 0,
    impulseNewtonSeconds: sample.impulseNewtonSeconds ?? 0,
    isGrounded: sample.isGrounded ?? false,
    kineticEnergyJoules,
    kineticEnergyLostJoules: sample.kineticEnergyLostJoules ?? 0,
    maxStaticFrictionNewtons: sample.maxStaticFrictionNewtons ?? 0,
    momentOfInertiaKilogramMetersSquared:
      sample.momentOfInertiaKilogramMetersSquared ?? 0,
    momentumKilogramMetersPerSecond:
      sample.momentumKilogramMetersPerSecond ?? 0,
    momentumXKilogramMetersPerSecond:
      sample.momentumXKilogramMetersPerSecond ?? 0,
    momentumZKilogramMetersPerSecond:
      sample.momentumZKilogramMetersPerSecond ?? 0,
    netForceNewtons: sample.netForceNewtons ?? 0,
    netTorqueNewtonMeters: sample.netTorqueNewtonMeters ?? 0,
    normalForceNewtons: sample.normalForceNewtons ?? 0,
    periodSeconds: sample.periodSeconds ?? 0,
    positionMeters: sample.positionMeters ?? sample.xMeters,
    potentialEnergyJoules,
    pressurePascals: sample.pressurePascals ?? 0,
    primaryRadiusMeters: sample.primaryRadiusMeters ?? 0,
    secondaryCrossSectionAreaSquareMeters:
      sample.secondaryCrossSectionAreaSquareMeters ?? 0,
    secondaryPressurePascals: sample.secondaryPressurePascals ?? 0,
    secondaryRadiusMeters: sample.secondaryRadiusMeters ?? 0,
    secondarySpeedMetersPerSecond: sample.secondarySpeedMetersPerSecond ?? 0,
    secondaryVelocityMetersPerSecond:
      sample.secondaryVelocityMetersPerSecond ?? 0,
    secondaryVelocityXMetersPerSecond:
      sample.secondaryVelocityXMetersPerSecond ?? 0,
    secondaryVelocityZMetersPerSecond:
      sample.secondaryVelocityZMetersPerSecond ?? 0,
    secondaryXMeters: sample.secondaryXMeters ?? 0,
    secondaryZMeters: sample.secondaryZMeters ?? 0,
    speedMetersPerSecond: sample.speedMetersPerSecond ?? 0,
    submergedFraction: sample.submergedFraction ?? 0,
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

  if (simulationId === 'collisions-1d-2d') {
    const collision = getCollisionSetup(parameters as CollisionsParameters)

    if (!Number.isFinite(collision.collisionTimeSeconds)) {
      return [
        {
          code: 'COLLISION_NOT_REACHED',
          message:
            'Os corpos nao chegam ao contato no ciclo com as velocidades atuais.',
        },
      ]
    }

    if (collision.collisionTimeSeconds > durationSeconds) {
      return [
        {
          code: 'COLLISION_AFTER_CYCLE',
          message:
            'O contato ocorreria depois do tempo do ciclo; a timeline mostra apenas a aproximacao.',
        },
      ]
    }

    if ((parameters as CollisionsParameters).coefficientOfRestitution < 1) {
      return [
        {
          code: 'COLLISION_INELASTIC_LOSS',
          message:
            'Coeficiente de restituicao menor que 1 conserva momento, mas dissipa parte da energia cinetica.',
        },
      ]
    }

    return []
  }

  if (simulationId === 'continuity-bernoulli') {
    const sample = computeContinuityBernoulliSample(
      parameters as ContinuityBernoulliParameters,
      0,
    )

    if (sample.secondaryPressurePascals < 0) {
      return [
        {
          code: 'BERNOULLI_NEGATIVE_PRESSURE',
          message:
            'A pressao calculada no estrangulamento fica abaixo de zero; o modelo ideal deixa de representar o escoamento fisico.',
        },
      ]
    }

    return []
  }

  if (simulationId === 'gravitational-field-orbits') {
    const orbitParameters = parameters as GravitationalFieldOrbitsParameters

    if (orbitParameters.eccentricity > highEccentricityWarningThreshold) {
      return [
        {
          code: 'ORBIT_HIGH_ECCENTRICITY',
          message:
            'A excentricidade alta destaca uma orbita didatica eliptica; perturbacoes, atmosfera e precessao nao entram no modelo.',
        },
      ]
    }

    return []
  }

  if (simulationId === 'hydrostatics-buoyancy') {
    const sample = computeHydrostaticsBuoyancySample(
      parameters as HydrostaticsBuoyancyParameters,
      0,
    )

    if (sample.netForceNewtons < -hydrostaticFloatToleranceNewtons) {
      return [
        {
          code: 'OBJECT_SINKS',
          message:
            'O peso supera o empuxo maximo; o corpo fica totalmente submerso e acelera para baixo no modelo ideal.',
        },
      ]
    }

    return []
  }

  if (simulationId === 'particle-equilibrium') {
    const sample = computeParticleEquilibriumSample(
      parameters as ParticleEquilibriumParameters,
      0,
    )

    if (sample.netForceNewtons > equilibriumForceToleranceNewtons) {
      return [
        {
          code: 'PARTICLE_NOT_IN_EQUILIBRIUM',
          message:
            'A soma vetorial das forcas nao e nula; o sample mostra aceleracao na direcao da resultante.',
        },
      ]
    }

    return []
  }

  if (simulationId === 'rolling-without-slipping') {
    const sample = computeRollingWithoutSlippingSample(
      parameters as RollingWithoutSlippingParameters,
      0,
    )

    if (sample.gripRatio > 1) {
      return [
        {
          code: 'ROLLING_STATIC_FRICTION_LIMIT_EXCEEDED',
          message:
            'O atrito estatico requerido para rolamento puro supera o maximo disponivel; o sample passa para regime de escorregamento didatico.',
        },
      ]
    }

    return []
  }

  if (simulationId === 'torque-levers-center-mass') {
    const sample = computeTorqueLeversCenterMassSample(
      parameters as TorqueLeversCenterMassParameters,
      0,
    )

    if (Math.abs(sample.netTorqueNewtonMeters) > torqueToleranceNewtonMeters) {
      return [
        {
          code: 'LEVER_ROTATIONAL_IMBALANCE',
          message:
            'O torque resultante em torno do apoio nao e nulo; o diagrama inclina para indicar desequilibrio rotacional.',
        },
      ]
    }

    return []
  }

  if (simulationId === 'rigid-body-rotation') {
    const rotationParameters = parameters as RigidBodyRotationParameters

    if (rotationParameters.angularDampingPerSecond > 0) {
      return [
        {
          code: 'ROTATION_DAMPING_ACTIVE',
          message:
            'O amortecimento angular transforma parte do trabalho aplicado em dissipacao didatica.',
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
    case 'collisions-1d-2d':
      validateCollisionsParameters(parameters as CollisionsParameters)
      return
    case 'continuity-bernoulli':
      validateContinuityBernoulliParameters(
        parameters as ContinuityBernoulliParameters,
      )
      return
    case 'gravitational-field-orbits':
      validateGravitationalFieldOrbitsParameters(
        parameters as GravitationalFieldOrbitsParameters,
      )
      return
    case 'hydrostatics-buoyancy':
      validateHydrostaticsBuoyancyParameters(
        parameters as HydrostaticsBuoyancyParameters,
      )
      return
    case 'particle-equilibrium':
      validateParticleEquilibriumParameters(
        parameters as ParticleEquilibriumParameters,
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
    case 'rigid-body-rotation':
      validateRigidBodyRotationParameters(
        parameters as RigidBodyRotationParameters,
      )
      return
    case 'rolling-without-slipping':
      validateRollingWithoutSlippingParameters(
        parameters as RollingWithoutSlippingParameters,
      )
      return
    case 'torque-levers-center-mass':
      validateTorqueLeversCenterMassParameters(
        parameters as TorqueLeversCenterMassParameters,
      )
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

function validateCollisionsParameters(parameters: CollisionsParameters) {
  assertFiniteNonNegative(
    'coefficientOfRestitution',
    parameters.coefficientOfRestitution,
  )
  assertFinite('impactAngleDegrees', parameters.impactAngleDegrees)
  assertFinitePositive('initialSeparationMeters', parameters.initialSeparationMeters)
  assertFinitePositive('massOneKilograms', parameters.massOneKilograms)
  assertFinitePositive('massTwoKilograms', parameters.massTwoKilograms)
  assertFiniteNonNegative(
    'normalSpeedOneMetersPerSecond',
    parameters.normalSpeedOneMetersPerSecond,
  )
  assertFiniteNonNegative(
    'normalSpeedTwoMetersPerSecond',
    parameters.normalSpeedTwoMetersPerSecond,
  )
  assertFinitePositive('radiusOneMeters', parameters.radiusOneMeters)
  assertFinitePositive('radiusTwoMeters', parameters.radiusTwoMeters)
  assertFinite(
    'tangentialSpeedOneMetersPerSecond',
    parameters.tangentialSpeedOneMetersPerSecond,
  )
  assertFinite(
    'tangentialSpeedTwoMetersPerSecond',
    parameters.tangentialSpeedTwoMetersPerSecond,
  )

  if (parameters.coefficientOfRestitution > 1) {
    throw new Error('coefficientOfRestitution must be between 0 and 1.')
  }

  if (
    parameters.initialSeparationMeters <=
    parameters.radiusOneMeters + parameters.radiusTwoMeters
  ) {
    throw new Error('initialSeparationMeters must exceed the contact distance.')
  }
}

function validateContinuityBernoulliParameters(
  parameters: ContinuityBernoulliParameters,
) {
  assertFiniteNonNegative(
    'flowRateCubicMetersPerSecond',
    parameters.flowRateCubicMetersPerSecond,
  )
  assertFinitePositive(
    'fluidDensityKilogramsPerCubicMeter',
    parameters.fluidDensityKilogramsPerCubicMeter,
  )
  assertFinitePositive(
    'gravityMetersPerSecondSquared',
    parameters.gravityMetersPerSecondSquared,
  )
  assertFinite('heightDifferenceMeters', parameters.heightDifferenceMeters)
  assertFinitePositive('inletAreaSquareMeters', parameters.inletAreaSquareMeters)
  assertFiniteNonNegative(
    'inletPressureKilopascals',
    parameters.inletPressureKilopascals,
  )
  assertFinitePositive(
    'throatAreaSquareMeters',
    parameters.throatAreaSquareMeters,
  )
}

function validateGravitationalFieldOrbitsParameters(
  parameters: GravitationalFieldOrbitsParameters,
) {
  assertFinitePositive('centralMassEarths', parameters.centralMassEarths)
  assertFinite('eccentricity', parameters.eccentricity)
  assertFinite('initialAngleDegrees', parameters.initialAngleDegrees)
  assertFinitePositive(
    'orbitalRadiusKilometers',
    parameters.orbitalRadiusKilometers,
  )
  assertFinitePositive(
    'satelliteMassKilograms',
    parameters.satelliteMassKilograms,
  )

  if (parameters.eccentricity < 0 || parameters.eccentricity >= 0.85) {
    throw new Error('eccentricity must be between 0 and 0.85.')
  }
}

function validateHydrostaticsBuoyancyParameters(
  parameters: HydrostaticsBuoyancyParameters,
) {
  assertFiniteNonNegative('depthMeters', parameters.depthMeters)
  assertFinitePositive(
    'fluidDensityKilogramsPerCubicMeter',
    parameters.fluidDensityKilogramsPerCubicMeter,
  )
  assertFinitePositive(
    'gravityMetersPerSecondSquared',
    parameters.gravityMetersPerSecondSquared,
  )
  assertFinitePositive(
    'objectDensityKilogramsPerCubicMeter',
    parameters.objectDensityKilogramsPerCubicMeter,
  )
  assertFinitePositive('objectVolumeCubicMeters', parameters.objectVolumeCubicMeters)
}

function validateParticleEquilibriumParameters(
  parameters: ParticleEquilibriumParameters,
) {
  assertFiniteNonNegative('forceOneNewtons', parameters.forceOneNewtons)
  assertFinite('forceOneAngleDegrees', parameters.forceOneAngleDegrees)
  assertFiniteNonNegative('forceTwoNewtons', parameters.forceTwoNewtons)
  assertFinite('forceTwoAngleDegrees', parameters.forceTwoAngleDegrees)
  assertFiniteNonNegative('forceThreeNewtons', parameters.forceThreeNewtons)
  assertFinite('forceThreeAngleDegrees', parameters.forceThreeAngleDegrees)
  assertFinitePositive('massKilograms', parameters.massKilograms)
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

function validateRigidBodyRotationParameters(
  parameters: RigidBodyRotationParameters,
) {
  assertFiniteNonNegative(
    'angularDampingPerSecond',
    parameters.angularDampingPerSecond,
  )
  assertFinite(
    'appliedTorqueNewtonMeters',
    parameters.appliedTorqueNewtonMeters,
  )
  assertFinite('initialAngleDegrees', parameters.initialAngleDegrees)
  assertFinite(
    'initialAngularVelocityRadiansPerSecond',
    parameters.initialAngularVelocityRadiansPerSecond,
  )
  assertFinitePositive(
    'momentOfInertiaKilogramMetersSquared',
    parameters.momentOfInertiaKilogramMetersSquared,
  )
}

function validateRollingWithoutSlippingParameters(
  parameters: RollingWithoutSlippingParameters,
) {
  assertFiniteNonNegative('frictionCoefficient', parameters.frictionCoefficient)
  assertFinitePositive(
    'gravityMetersPerSecondSquared',
    parameters.gravityMetersPerSecondSquared,
  )
  assertFinite('inclineAngleDegrees', parameters.inclineAngleDegrees)
  assertFiniteNonNegative(
    'initialSpeedMetersPerSecond',
    parameters.initialSpeedMetersPerSecond,
  )
  assertFinitePositive('massKilograms', parameters.massKilograms)
  assertFinitePositive('radiusMeters', parameters.radiusMeters)
  assertFinitePositive('trackLengthMeters', parameters.trackLengthMeters)

  if (
    parameters.inclineAngleDegrees < 0 ||
    parameters.inclineAngleDegrees > 50
  ) {
    throw new Error('inclineAngleDegrees must be between 0 and 50 degrees.')
  }
}

function validateTorqueLeversCenterMassParameters(
  parameters: TorqueLeversCenterMassParameters,
) {
  assertFinite('appliedForceNewtons', parameters.appliedForceNewtons)
  assertFiniteNonNegative('appliedForceArmMeters', parameters.appliedForceArmMeters)
  assertFinitePositive(
    'gravityMetersPerSecondSquared',
    parameters.gravityMetersPerSecondSquared,
  )
  assertFinitePositive('leftArmMeters', parameters.leftArmMeters)
  assertFinitePositive('leftMassKilograms', parameters.leftMassKilograms)
  assertFinitePositive('rightArmMeters', parameters.rightArmMeters)
  assertFinitePositive('rightMassKilograms', parameters.rightMassKilograms)
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

function resolveCollision(
  parameters: CollisionsParameters,
  timeSeconds: number,
) {
  const setup = getCollisionSetup(parameters)
  const hasCollided = timeSeconds >= setup.collisionTimeSeconds
  const activeTimeSeconds = hasCollided
    ? timeSeconds - setup.collisionTimeSeconds
    : timeSeconds

  if (!hasCollided) {
    return {
      initialKineticEnergyJoules: setup.initialKineticEnergyJoules,
      initialPrimaryPosition: setup.initialPrimaryPosition,
      impulseNewtonSeconds: 0,
      primaryPosition: addVectors(
        setup.initialPrimaryPosition,
        scaleVector(setup.primaryVelocityBefore, activeTimeSeconds),
      ),
      primaryVelocity: setup.primaryVelocityBefore,
      secondaryPosition: addVectors(
        setup.initialSecondaryPosition,
        scaleVector(setup.secondaryVelocityBefore, activeTimeSeconds),
      ),
      secondaryVelocity: setup.secondaryVelocityBefore,
    }
  }

  const primaryCollisionPosition = addVectors(
    setup.initialPrimaryPosition,
    scaleVector(setup.primaryVelocityBefore, setup.collisionTimeSeconds),
  )
  const secondaryCollisionPosition = addVectors(
    setup.initialSecondaryPosition,
    scaleVector(setup.secondaryVelocityBefore, setup.collisionTimeSeconds),
  )

  return {
    initialKineticEnergyJoules: setup.initialKineticEnergyJoules,
    initialPrimaryPosition: setup.initialPrimaryPosition,
    impulseNewtonSeconds: setup.impulseNewtonSeconds,
    primaryPosition: addVectors(
      primaryCollisionPosition,
      scaleVector(setup.primaryVelocityAfter, activeTimeSeconds),
    ),
    primaryVelocity: setup.primaryVelocityAfter,
    secondaryPosition: addVectors(
      secondaryCollisionPosition,
      scaleVector(setup.secondaryVelocityAfter, activeTimeSeconds),
    ),
    secondaryVelocity: setup.secondaryVelocityAfter,
  }
}

function getCollisionSetup(parameters: CollisionsParameters) {
  const contactDistanceMeters =
    parameters.radiusOneMeters + parameters.radiusTwoMeters
  const impactAngleRadians = degreesToRadians(parameters.impactAngleDegrees)
  const impactOffsetMeters =
    contactDistanceMeters * Math.sin(impactAngleRadians)
  const initialPrimaryXMeters = -Math.sqrt(
    Math.max(
      0,
      parameters.initialSeparationMeters ** 2 - impactOffsetMeters ** 2,
    ),
  )
  const initialPrimaryPosition = {
    x: initialPrimaryXMeters,
    z: impactOffsetMeters,
  }
  const initialSecondaryPosition = {
    x: 0,
    z: 0,
  }
  const primaryVelocityBefore = {
    x: parameters.normalSpeedOneMetersPerSecond,
    z: parameters.tangentialSpeedOneMetersPerSecond,
  }
  const secondaryVelocityBefore = {
    x: -parameters.normalSpeedTwoMetersPerSecond,
    z: parameters.tangentialSpeedTwoMetersPerSecond,
  }
  const relativePosition = {
    x: initialPrimaryPosition.x - initialSecondaryPosition.x,
    z: initialPrimaryPosition.z - initialSecondaryPosition.z,
  }
  const relativeVelocity = {
    x: primaryVelocityBefore.x - secondaryVelocityBefore.x,
    z: primaryVelocityBefore.z - secondaryVelocityBefore.z,
  }
  const collisionTimeSeconds = findCircleContactTime(
    relativePosition,
    relativeVelocity,
    contactDistanceMeters,
  )
  const primaryCollisionPosition = Number.isFinite(collisionTimeSeconds)
    ? addVectors(
        initialPrimaryPosition,
        scaleVector(primaryVelocityBefore, collisionTimeSeconds),
      )
    : initialPrimaryPosition
  const secondaryCollisionPosition = Number.isFinite(collisionTimeSeconds)
    ? addVectors(
        initialSecondaryPosition,
        scaleVector(secondaryVelocityBefore, collisionTimeSeconds),
      )
    : initialSecondaryPosition
  const contactNormal = normalizeVector({
    x: secondaryCollisionPosition.x - primaryCollisionPosition.x,
    z: secondaryCollisionPosition.z - primaryCollisionPosition.z,
  })
  const closingSpeedMetersPerSecond = dotVector(
    relativeVelocity,
    contactNormal,
  )
  const impulseNewtonSeconds =
    Number.isFinite(collisionTimeSeconds) && closingSpeedMetersPerSecond > 0
      ? ((1 + parameters.coefficientOfRestitution) *
          closingSpeedMetersPerSecond) /
        (1 / parameters.massOneKilograms + 1 / parameters.massTwoKilograms)
      : 0
  const primaryVelocityAfter = addVectors(
    primaryVelocityBefore,
    scaleVector(
      contactNormal,
      -impulseNewtonSeconds / parameters.massOneKilograms,
    ),
  )
  const secondaryVelocityAfter = addVectors(
    secondaryVelocityBefore,
    scaleVector(
      contactNormal,
      impulseNewtonSeconds / parameters.massTwoKilograms,
    ),
  )

  return {
    collisionTimeSeconds,
    impulseNewtonSeconds,
    initialKineticEnergyJoules:
      0.5 *
        parameters.massOneKilograms *
        vectorMagnitudeSquared(primaryVelocityBefore) +
      0.5 *
        parameters.massTwoKilograms *
        vectorMagnitudeSquared(secondaryVelocityBefore),
    initialPrimaryPosition,
    initialSecondaryPosition,
    primaryVelocityAfter,
    primaryVelocityBefore,
    secondaryVelocityAfter,
    secondaryVelocityBefore,
  }
}

function findCircleContactTime(
  relativePosition: { x: number; z: number },
  relativeVelocity: { x: number; z: number },
  contactDistanceMeters: number,
) {
  const a = vectorMagnitudeSquared(relativeVelocity)
  const b = 2 * dotVector(relativePosition, relativeVelocity)
  const c = vectorMagnitudeSquared(relativePosition) - contactDistanceMeters ** 2

  if (c <= 0) {
    return 0
  }

  if (a === 0 || b >= 0) {
    return Number.POSITIVE_INFINITY
  }

  const discriminant = b ** 2 - 4 * a * c

  if (discriminant < 0) {
    return Number.POSITIVE_INFINITY
  }

  const firstContactTime = (-b - Math.sqrt(discriminant)) / (2 * a)

  return firstContactTime >= 0
    ? firstContactTime
    : Number.POSITIVE_INFINITY
}

function computeDampedAngularMotion({
  angularDampingPerSecond,
  driveAngularAcceleration,
  initialAngleRadians,
  initialAngularVelocityRadiansPerSecond,
  timeSeconds,
}: {
  angularDampingPerSecond: number
  driveAngularAcceleration: number
  initialAngleRadians: number
  initialAngularVelocityRadiansPerSecond: number
  timeSeconds: number
}) {
  if (angularDampingPerSecond === 0) {
    return {
      angleRadians:
        initialAngleRadians +
        initialAngularVelocityRadiansPerSecond * timeSeconds +
        0.5 * driveAngularAcceleration * timeSeconds ** 2,
      angularAccelerationRadiansPerSecondSquared: driveAngularAcceleration,
      angularVelocityRadiansPerSecond:
        initialAngularVelocityRadiansPerSecond +
        driveAngularAcceleration * timeSeconds,
    }
  }

  const terminalAngularVelocity =
    driveAngularAcceleration / angularDampingPerSecond
  const transientVelocity =
    initialAngularVelocityRadiansPerSecond - terminalAngularVelocity
  const decay = Math.exp(-angularDampingPerSecond * timeSeconds)
  const angularVelocityRadiansPerSecond =
    terminalAngularVelocity + transientVelocity * decay

  return {
    angleRadians:
      initialAngleRadians +
      terminalAngularVelocity * timeSeconds +
      (transientVelocity * (1 - decay)) / angularDampingPerSecond,
    angularAccelerationRadiansPerSecondSquared:
      driveAngularAcceleration -
      angularDampingPerSecond * angularVelocityRadiansPerSecond,
    angularVelocityRadiansPerSecond,
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

function vectorFromPolar(magnitude: number, angleDegrees: number) {
  const angleRadians = degreesToRadians(angleDegrees)

  return {
    x: magnitude * Math.cos(angleRadians),
    z: magnitude * Math.sin(angleRadians),
  }
}

function addVectors(
  first: { x: number; z: number },
  second: { x: number; z: number },
) {
  return {
    x: first.x + second.x,
    z: first.z + second.z,
  }
}

function scaleVector(vector: { x: number; z: number }, scale: number) {
  return {
    x: vector.x * scale,
    z: vector.z * scale,
  }
}

function dotVector(
  first: { x: number; z: number },
  second: { x: number; z: number },
) {
  return first.x * second.x + first.z * second.z
}

function vectorMagnitudeSquared(vector: { x: number; z: number }) {
  return vector.x ** 2 + vector.z ** 2
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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function lerp(start: number, end: number, ratio: number) {
  return start + (end - start) * ratio
}
