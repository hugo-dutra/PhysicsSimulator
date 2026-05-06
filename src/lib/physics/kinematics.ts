export type KinematicsSimulationId =
  | 'atwood-machine'
  | 'centripetal-force-curve'
  | 'collisions-1d-2d'
  | 'continuity-bernoulli'
  | 'gravitational-field-orbits'
  | 'hydrostatics-buoyancy'
  | 'mass-spring'
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

export type MassSpringParameters = {
  dampingPerSecond: number
  gravityMetersPerSecondSquared: number
  initialDisplacementMeters: number
  initialVelocityMetersPerSecond: number
  massKilograms: number
  springConstantNewtonsPerMeter: number
}

export type HydrostaticsBuoyancyParameters = {
  depthMeters: number
  fluidDensityKilogramsPerCubicMeter: number
  gravityMetersPerSecondSquared: number
  initialCenterZMeters?: number
  initialVelocityZMetersPerSecond?: number
  motionStartTimeSeconds?: number
  objectMassKilograms: number
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
  energyLossPercent: number
  gravityMetersPerSecondSquared: number
  heightDropMeters: number
  initialHeightOffsetMeters: number
  initialPositionMeters: number
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
  constantRotationalEnergy: boolean
  initialAngleDegrees: number
  initialAngularVelocityRadiansPerSecond: number
  momentOfInertiaKilogramMetersSquared: number
  slidingMassDistanceMeters: number
  slidingMassKilograms: number
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
  | MassSpringParameters
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
  appliedForceArmMeters: number
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
  energyLossPercent: number
  elasticPotentialEnergyJoules: number
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
  gravitationalPotentialEnergyJoules: number
  gripRatio: number
  impulseNewtonSeconds: number
  isGrounded: boolean
  kineticEnergyJoules: number
  kineticEnergyLostJoules: number
  leftArmMeters: number
  leftGravitationalPotentialEnergyJoules: number
  leftKineticEnergyJoules: number
  maxStaticFrictionNewtons: number
  momentOfInertiaKilogramMetersSquared: number
  momentumKilogramMetersPerSecond: number
  momentumXKilogramMetersPerSecond: number
  momentumZKilogramMetersPerSecond: number
  netForceNewtons: number
  netTorqueNewtonMeters: number
  normalForceNewtons: number
  objectDensityKilogramsPerCubicMeter: number
  objectMassKilograms: number
  periodSeconds: number
  positionMeters: number
  potentialEnergyJoules: number
  pressurePascals: number
  primaryRadiusMeters: number
  rightArmMeters: number
  rightGravitationalPotentialEnergyJoules: number
  rightKineticEnergyJoules: number
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
  springForceNewtons: number
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
    | 'angularMomentum'
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
    | 'kg m^2/s'
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
  'mass-spring',
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
  'energyLossPercent',
  'elasticPotentialEnergyJoules',
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
  'gravitationalPotentialEnergyJoules',
  'gripRatio',
  'impulseNewtonSeconds',
  'kineticEnergyJoules',
  'kineticEnergyLostJoules',
  'leftGravitationalPotentialEnergyJoules',
  'leftKineticEnergyJoules',
  'maxStaticFrictionNewtons',
  'momentOfInertiaKilogramMetersSquared',
  'momentumKilogramMetersPerSecond',
  'momentumXKilogramMetersPerSecond',
  'momentumZKilogramMetersPerSecond',
  'netForceNewtons',
  'netTorqueNewtonMeters',
  'normalForceNewtons',
  'objectDensityKilogramsPerCubicMeter',
  'objectMassKilograms',
  'periodSeconds',
  'positionMeters',
  'potentialEnergyJoules',
  'pressurePascals',
  'primaryRadiusMeters',
  'rightGravitationalPotentialEnergyJoules',
  'rightKineticEnergyJoules',
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
  'springForceNewtons',
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
const orbitalSatelliteRadiusRatio = 0.16
const orbitalSatelliteSpeedRatio = 12
const bernoulliTubeHalfLengthMeters = 3
const bernoulliThroatWidthMeters = 0.95
const hydrostaticFloatToleranceNewtons = 1e-6
const hydrostaticFloatAngularFrequencyRadiansPerSecond = 2.2
const hydrostaticFloatDampingPerSecond = 0.82
const hydrostaticNeutralDensityRatioTolerance = 0.015
export const hydrostaticTankDepthMeters = 3.6
const massSpringDampingTolerance = 1e-9
const massSpringVisualNaturalLengthMeters = 1.15
const uniformlyAcceleratedGroundTolerance = 1e-9
const rollingInertiaFactor = 0.5
const rigidBodyCentralMassKilograms = 2.4
const rigidBodyMaxSlidingMassDistanceMeters = 1.2
const rigidBodyReferenceMassDistanceMeters = 1.0
const torqueToleranceNewtonMeters = 0.05
const torqueLeverMaxDisplayAngleRadians = 0.35
const torqueLeverVisualTimeScale = 0.28

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
      const objectVolumeCubicMeters = readNumber(
        values,
        'objectVolumeCubicMeters',
      )
      const legacyObjectDensityKilogramsPerCubicMeter = readOptionalNumber(
        values,
        'objectDensityKilogramsPerCubicMeter',
      )
      const objectMassKilograms =
        readOptionalNumber(values, 'objectMassKilograms') ??
        (typeof legacyObjectDensityKilogramsPerCubicMeter === 'number'
          ? legacyObjectDensityKilogramsPerCubicMeter * objectVolumeCubicMeters
          : readNumber(values, 'objectMassKilograms'))
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
        objectMassKilograms,
        objectVolumeCubicMeters,
      }

      validateHydrostaticsBuoyancyParameters(parameters)
      return parameters
    }
    case 'mass-spring': {
      const parameters: MassSpringParameters = {
        dampingPerSecond: readNumber(values, 'dampingPerSecond'),
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
        massKilograms: readNumber(values, 'massKilograms'),
        springConstantNewtonsPerMeter: readNumber(
          values,
          'springConstantNewtonsPerMeter',
        ),
      }

      validateMassSpringParameters(parameters)
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
        constantRotationalEnergy: readBoolean(
          values,
          'constantRotationalEnergy',
          readBoolean(values, 'constantAngularVelocity', false),
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
        slidingMassDistanceMeters: readNumber(
          values,
          'slidingMassDistanceMeters',
        ),
        slidingMassKilograms: readNumber(values, 'slidingMassKilograms'),
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
        energyLossPercent: readNumber(values, 'energyLossPercent'),
        gravityMetersPerSecondSquared: readNumber(
          values,
          'gravityMetersPerSecondSquared',
        ),
        heightDropMeters: readNumber(values, 'heightDropMeters'),
        initialHeightOffsetMeters: readNumber(
          values,
          'initialHeightOffsetMeters',
        ),
        initialPositionMeters: readNumber(values, 'initialPositionMeters'),
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

  if (simulationId === 'work-energy-track') {
    const result = computeWorkEnergyTrackSamples({
      durationSeconds,
      parameters: parameters as WorkEnergyTrackParameters,
      sampleRateHz,
    })
    const initialState = result.samples[0]

    if (!initialState) {
      throw new Error('Kinematics timeline must contain at least one sample.')
    }

    return {
      initialState,
      samples: result.samples,
      warnings: getKinematicsWarnings(simulationId, parameters, durationSeconds),
    }
  }

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
    case 'mass-spring':
      return computeMassSpringSample(
        parameters as MassSpringParameters,
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

export function computeGravitationalOrbitPathSamples(
  parameters: GravitationalFieldOrbitsParameters,
  segmentCount = 240,
): KinematicsSample[] {
  validateGravitationalFieldOrbitsParameters(parameters)

  const safeSegmentCount = Math.max(4, Math.floor(segmentCount))
  const firstSample = computeGravitationalFieldOrbitsSample(parameters, 0)

  return Array.from({ length: safeSegmentCount + 1 }, (_, index) =>
    computeGravitationalFieldOrbitsSample(
      parameters,
      (firstSample.periodSeconds * index) / safeSegmentCount,
    ),
  )
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
        label: 'Velocidade local do tracador',
        magnitude: sample.velocityMetersPerSecond,
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
        direction: { x: 0, z: Math.sign(sample.velocityMetersPerSecond) || 0 },
        id: 'velocity',
        label: 'Velocidade vertical',
        magnitude: Math.abs(sample.velocityMetersPerSecond),
        unit: 'm/s',
      },
      {
        direction: {
          x: 0,
          z: Math.sign(sample.accelerationMetersPerSecondSquared) || 0,
        },
        id: 'acceleration',
        label: 'Aceleracao vertical',
        magnitude: Math.abs(sample.accelerationMetersPerSecondSquared),
        unit: 'm/s^2',
      },
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

  if (simulationId === 'mass-spring') {
    const velocityDirection = Math.sign(sample.velocityMetersPerSecond)
    const accelerationDirection = Math.sign(
      sample.accelerationMetersPerSecondSquared,
    )
    const springDirection = sample.springForceNewtons >= 0 ? 1 : -1

    return [
      {
        direction: {
          x: 0,
          z: -velocityDirection,
        },
        id: 'velocity',
        label: 'Velocidade da esfera',
        magnitude: sample.speedMetersPerSecond,
        unit: 'm/s',
      },
      {
        direction: {
          x: 0,
          z: -accelerationDirection,
        },
        id: 'acceleration',
        label: 'Aceleracao da esfera',
        magnitude: Math.abs(sample.accelerationMetersPerSecondSquared),
        unit: 'm/s^2',
      },
      {
        direction: {
          x: 0,
          z: springDirection,
        },
        id: 'tension',
        label: 'Forca elastica',
        magnitude: Math.abs(sample.springForceNewtons),
        unit: 'N',
      },
      {
        direction: {
          x: 0,
          z: -1,
        },
        id: 'weight',
        label: 'Peso',
        magnitude: sample.weightNewtons,
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
          x: 0,
          z: Math.sign(sample.angularVelocityRadiansPerSecond) || 1,
        },
        id: 'angularMomentum',
        label: 'Momento angular',
        magnitude: Math.abs(
          sample.momentOfInertiaKilogramMetersSquared *
            sample.angularVelocityRadiansPerSecond,
        ),
        unit: 'kg m^2/s',
      },
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
        label: 'Perda dissipativa',
        magnitude: sample.frictionForceNewtons,
        unit: 'N',
      },
      {
        direction: normalizeVector({
          x: -sample.xMeters,
          z: sample.primaryRadiusMeters,
        }),
        id: 'normal',
        label: 'Normal da rampa',
        magnitude: sample.normalForceNewtons,
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

  if (simulationId === 'uniform-linear-motion') {
    return [
      {
        direction: {
          x: Math.sign(sample.displacementMeters),
          z: 0,
        },
        id: 'displacement',
        label: 'Deslocamento',
        magnitude: Math.abs(sample.displacementMeters),
        unit: 'm',
      },
      {
        direction: normalizeVector({
          x: sample.velocityXMetersPerSecond,
          z: sample.velocityZMetersPerSecond,
        }),
        id: 'velocity',
        label: 'Velocidade',
        magnitude: sample.speedMetersPerSecond,
        unit: 'm/s',
      },
      {
        direction: {
          x: 0,
          z: 0,
        },
        id: 'acceleration',
        label: 'Aceleracao',
        magnitude: 0,
        unit: 'm/s^2',
      },
    ]
  }

  if (simulationId === 'uniformly-accelerated-motion') {
    return [
      {
        direction: {
          x: 0,
          z: Math.sign(sample.displacementMeters) || 0,
        },
        id: 'displacement',
        label: 'Deslocamento vertical',
        magnitude: Math.abs(sample.displacementMeters),
        unit: 'm',
      },
      {
        direction: {
          x: 0,
          z: Math.sign(sample.velocityZMetersPerSecond) || 0,
        },
        id: 'velocity',
        label: 'Velocidade vertical',
        magnitude: sample.speedMetersPerSecond,
        unit: 'm/s',
      },
      {
        direction: {
          x: 0,
          z: Math.sign(sample.accelerationZMetersPerSecondSquared) || 0,
        },
        id: 'acceleration',
        label: 'Aceleracao constante',
        magnitude: Math.abs(sample.accelerationZMetersPerSecondSquared),
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
  const xMeters =
    -bernoulliTubeHalfLengthMeters + phase * bernoulliTubeHalfLengthMeters * 2
  const throatInfluence = getBernoulliThroatInfluence(xMeters)
  const zMeters = parameters.heightDifferenceMeters * throatInfluence
  const localAreaSquareMeters = getBernoulliAreaAtX(parameters, xMeters)
  const localVelocityMetersPerSecond =
    localAreaSquareMeters > 0
      ? parameters.flowRateCubicMetersPerSecond / localAreaSquareMeters
      : 0
  const localPressurePascals =
    inletPressurePascals -
    parameters.fluidDensityKilogramsPerCubicMeter *
      parameters.gravityMetersPerSecondSquared *
      zMeters +
    0.5 *
      parameters.fluidDensityKilogramsPerCubicMeter *
      (inletVelocityMetersPerSecond ** 2 - localVelocityMetersPerSecond ** 2)
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
    fluidPressurePascals: localPressurePascals,
    flowRateCubicMetersPerSecond: parameters.flowRateCubicMetersPerSecond,
    forceOneNewtons: inletPressurePascals,
    forceTwoNewtons: throatPressurePascals,
    kineticEnergyJoules,
    positionMeters: phase * 6,
    potentialEnergyJoules,
    pressurePascals: inletPressurePascals,
    primaryRadiusMeters: Math.sqrt(parameters.inletAreaSquareMeters / Math.PI),
    secondaryCrossSectionAreaSquareMeters: parameters.throatAreaSquareMeters,
    secondaryPressurePascals: throatPressurePascals,
    secondaryRadiusMeters: Math.sqrt(parameters.throatAreaSquareMeters / Math.PI),
    secondarySpeedMetersPerSecond: throatVelocityMetersPerSecond,
    secondaryVelocityMetersPerSecond: throatVelocityMetersPerSecond,
    secondaryVelocityXMetersPerSecond: throatVelocityMetersPerSecond,
    secondaryXMeters: 0,
    secondaryZMeters: parameters.heightDifferenceMeters,
    speedMetersPerSecond: inletVelocityMetersPerSecond,
    timeSeconds,
    totalEnergyJoules: localPressurePascals + kineticEnergyJoules + potentialEnergyJoules,
    velocityMetersPerSecond: localVelocityMetersPerSecond,
    velocityXMetersPerSecond: localVelocityMetersPerSecond,
    xMeters,
    zMeters,
    netForceNewtons: pressureDropPascals,
  })
}

function getBernoulliAreaAtX(
  parameters: ContinuityBernoulliParameters,
  xMeters: number,
) {
  return (
    parameters.inletAreaSquareMeters +
    (parameters.throatAreaSquareMeters - parameters.inletAreaSquareMeters) *
      getBernoulliThroatInfluence(xMeters)
  )
}

function getBernoulliThroatInfluence(xMeters: number) {
  const normalized = xMeters / bernoulliThroatWidthMeters

  return Math.exp(-(normalized * normalized))
}

function computeGravitationalFieldOrbitsSample(
  parameters: GravitationalFieldOrbitsParameters,
  timeSeconds: number,
): KinematicsSample {
  const centralMassKilograms =
    parameters.centralMassEarths * earthMassKilograms
  const gravitationalParameter =
    gravitationalConstant * centralMassKilograms
  const eccentricity = parameters.eccentricity
  const periapsisRadiusMeters = parameters.orbitalRadiusKilometers * 1000
  const semiMajorAxisMeters =
    periapsisRadiusMeters / (1 - eccentricity)
  const meanMotionRadiansPerSecond = Math.sqrt(
    gravitationalParameter / semiMajorAxisMeters ** 3,
  )
  const initialTrueAnomalyRadians = normalizePositiveAngleRadians(
    degreesToRadians(parameters.initialAngleDegrees),
  )
  const initialEccentricAnomalyRadians = trueAnomalyToEccentricAnomaly(
    initialTrueAnomalyRadians,
    eccentricity,
  )
  const initialMeanAnomalyRadians = eccentricAnomalyToMeanAnomaly(
    initialEccentricAnomalyRadians,
    eccentricity,
  )
  const meanAnomalyRadians =
    initialMeanAnomalyRadians + meanMotionRadiansPerSecond * timeSeconds
  const eccentricAnomalyRadians = solveKeplerEccentricAnomaly(
    meanAnomalyRadians,
    eccentricity,
  )
  const angleRadians = normalizePositiveAngleRadians(
    eccentricAnomalyToTrueAnomaly(eccentricAnomalyRadians, eccentricity),
  )
  const orbitalRadiusMeters =
    semiMajorAxisMeters * (1 - eccentricity * Math.cos(eccentricAnomalyRadians))
  const xMeters = orbitalRadiusMeters * Math.cos(angleRadians)
  const zMeters = orbitalRadiusMeters * Math.sin(angleRadians)
  const specificAngularMomentumMetersSquaredPerSecond = Math.sqrt(
    gravitationalParameter * semiMajorAxisMeters * (1 - eccentricity ** 2),
  )
  const radialVelocityMetersPerSecond =
    (gravitationalParameter /
      specificAngularMomentumMetersSquaredPerSecond) *
    eccentricity *
    Math.sin(angleRadians)
  const transverseVelocityMetersPerSecond =
    specificAngularMomentumMetersSquaredPerSecond / orbitalRadiusMeters
  const velocityXMetersPerSecond =
    radialVelocityMetersPerSecond * Math.cos(angleRadians) -
    transverseVelocityMetersPerSecond * Math.sin(angleRadians)
  const velocityZMetersPerSecond =
    radialVelocityMetersPerSecond * Math.sin(angleRadians) +
    transverseVelocityMetersPerSecond * Math.cos(angleRadians)
  const orbitalSpeedMetersPerSecond = Math.hypot(
    velocityXMetersPerSecond,
    velocityZMetersPerSecond,
  )
  const angularVelocityRadiansPerSecond =
    specificAngularMomentumMetersSquaredPerSecond / orbitalRadiusMeters ** 2
  const satelliteOrbitRadiusMeters =
    periapsisRadiusMeters * orbitalSatelliteRadiusRatio
  const satelliteReferenceAngularVelocityRadiansPerSecond =
    Math.sqrt(gravitationalParameter / periapsisRadiusMeters ** 3) *
    orbitalSatelliteSpeedRatio
  const satelliteAngleRadians =
    initialTrueAnomalyRadians * orbitalSatelliteSpeedRatio +
    satelliteReferenceAngularVelocityRadiansPerSecond * timeSeconds +
    Math.PI * 0.35
  const secondaryXMeters =
    xMeters + satelliteOrbitRadiusMeters * Math.cos(satelliteAngleRadians)
  const secondaryZMeters =
    zMeters + satelliteOrbitRadiusMeters * Math.sin(satelliteAngleRadians)
  const secondaryVelocityXMetersPerSecond =
    -satelliteOrbitRadiusMeters *
    satelliteReferenceAngularVelocityRadiansPerSecond *
    Math.sin(satelliteAngleRadians)
  const secondaryVelocityZMetersPerSecond =
    satelliteOrbitRadiusMeters *
      satelliteReferenceAngularVelocityRadiansPerSecond *
      Math.cos(satelliteAngleRadians)
  const secondarySpeedMetersPerSecond = Math.hypot(
    secondaryVelocityXMetersPerSecond,
    secondaryVelocityZMetersPerSecond,
  )
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
    angularVelocityRadiansPerSecond,
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
    secondaryRadiusMeters: satelliteOrbitRadiusMeters,
    secondarySpeedMetersPerSecond,
    secondaryVelocityMetersPerSecond: secondarySpeedMetersPerSecond,
    secondaryVelocityXMetersPerSecond,
    secondaryVelocityZMetersPerSecond,
    secondaryXMeters,
    secondaryZMeters,
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

function trueAnomalyToEccentricAnomaly(
  trueAnomalyRadians: number,
  eccentricity: number,
) {
  if (eccentricity === 0) {
    return normalizePositiveAngleRadians(trueAnomalyRadians)
  }

  return normalizePositiveAngleRadians(
    Math.atan2(
      Math.sqrt(1 - eccentricity ** 2) * Math.sin(trueAnomalyRadians),
      eccentricity + Math.cos(trueAnomalyRadians),
    ),
  )
}

function eccentricAnomalyToMeanAnomaly(
  eccentricAnomalyRadians: number,
  eccentricity: number,
) {
  return (
    eccentricAnomalyRadians -
    eccentricity * Math.sin(eccentricAnomalyRadians)
  )
}

function solveKeplerEccentricAnomaly(
  meanAnomalyRadians: number,
  eccentricity: number,
) {
  const normalizedMeanAnomaly = normalizeSignedAngleRadians(meanAnomalyRadians)

  if (eccentricity === 0) {
    return normalizedMeanAnomaly
  }

  let eccentricAnomalyRadians =
    eccentricity < 0.8
      ? normalizedMeanAnomaly
      : Math.PI * (Math.sign(normalizedMeanAnomaly) || 1)

  for (let iteration = 0; iteration < 12; iteration += 1) {
    const residual =
      eccentricAnomalyRadians -
      eccentricity * Math.sin(eccentricAnomalyRadians) -
      normalizedMeanAnomaly
    const derivative =
      1 - eccentricity * Math.cos(eccentricAnomalyRadians)
    const correction = residual / derivative

    eccentricAnomalyRadians -= correction

    if (Math.abs(correction) < 1e-12) {
      break
    }
  }

  return eccentricAnomalyRadians
}

function eccentricAnomalyToTrueAnomaly(
  eccentricAnomalyRadians: number,
  eccentricity: number,
) {
  if (eccentricity === 0) {
    return eccentricAnomalyRadians
  }

  return Math.atan2(
    Math.sqrt(1 - eccentricity ** 2) * Math.sin(eccentricAnomalyRadians),
    Math.cos(eccentricAnomalyRadians) - eccentricity,
  )
}

function normalizePositiveAngleRadians(angleRadians: number) {
  const fullTurnRadians = Math.PI * 2

  return (
    ((angleRadians % fullTurnRadians) + fullTurnRadians) %
    fullTurnRadians
  )
}

function normalizeSignedAngleRadians(angleRadians: number) {
  return normalizePositiveAngleRadians(angleRadians + Math.PI) - Math.PI
}

function computeHydrostaticsBuoyancySample(
  parameters: HydrostaticsBuoyancyParameters,
  timeSeconds: number,
): KinematicsSample {
  const objectMassKilograms = parameters.objectMassKilograms
  const objectDensityKilogramsPerCubicMeter =
    objectMassKilograms / parameters.objectVolumeCubicMeters
  const sphereRadiusMeters = sphereRadiusFromVolume(
    parameters.objectVolumeCubicMeters,
  )
  const tankDepthMeters = hydrostaticTankDepthMeters
  const bottomCenterZ = -tankDepthMeters + sphereRadiusMeters
  const initialCenterZ = computeHydrostaticInitialCenterZ(
    parameters,
    sphereRadiusMeters,
    tankDepthMeters,
  )
  const initialVelocityMetersPerSecond =
    parameters.initialVelocityZMetersPerSecond ?? 0
  const motionTimeSeconds = Math.max(
    0,
    timeSeconds - (parameters.motionStartTimeSeconds ?? 0),
  )
  const densityRatio =
    objectDensityKilogramsPerCubicMeter /
    parameters.fluidDensityKilogramsPerCubicMeter
  const submergedFractionAtEquilibrium = clamp(densityRatio, 0, 1)
  const equilibriumCapHeightMeters =
    sphereCapHeightForSubmergedFraction(
      sphereRadiusMeters,
      submergedFractionAtEquilibrium,
    )
  const equilibriumCenterZ = clamp(
    sphereRadiusMeters - equilibriumCapHeightMeters,
    bottomCenterZ,
    sphereRadiusMeters,
  )
  const weightNewtons =
    objectMassKilograms * parameters.gravityMetersPerSecondSquared
  const fullBuoyantForceNewtons =
    parameters.fluidDensityKilogramsPerCubicMeter *
    parameters.gravityMetersPerSecondSquared *
    parameters.objectVolumeCubicMeters
  let zMeters = initialCenterZ
  let velocityMetersPerSecond = 0
  const isFloating =
    densityRatio < 1 - hydrostaticNeutralDensityRatioTolerance
  const isNeutral =
    Math.abs(densityRatio - 1) <= hydrostaticNeutralDensityRatioTolerance

  if (isFloating) {
    const motion = solveDampedHydrostaticApproach({
      equilibriumCenterZ,
      initialCenterZ,
      initialVelocityMetersPerSecond:
        parameters.initialVelocityZMetersPerSecond,
      timeSeconds: motionTimeSeconds,
    })

    zMeters = clamp(motion.zMeters, bottomCenterZ, sphereRadiusMeters)
    velocityMetersPerSecond = motion.velocityMetersPerSecond
  } else if (!isNeutral) {
    const sinkingAccelerationMetersPerSecondSquared =
      (fullBuoyantForceNewtons - weightNewtons) / objectMassKilograms
    const unclampedZ =
      initialCenterZ +
      initialVelocityMetersPerSecond * motionTimeSeconds +
      0.5 * sinkingAccelerationMetersPerSecondSquared * motionTimeSeconds ** 2

    zMeters = Math.max(bottomCenterZ, unclampedZ)
    velocityMetersPerSecond =
      zMeters <= bottomCenterZ + hydrostaticFloatToleranceNewtons
        ? 0
        : initialVelocityMetersPerSecond +
          sinkingAccelerationMetersPerSecondSquared * motionTimeSeconds
  }

  const submergedVolumeCubicMeters =
    sphereSubmergedVolumeCubicMeters(sphereRadiusMeters, zMeters)
  const submergedFraction = clamp(
    submergedVolumeCubicMeters / parameters.objectVolumeCubicMeters,
    0,
    1,
  )
  const buoyantForceNewtons =
    parameters.fluidDensityKilogramsPerCubicMeter *
    parameters.gravityMetersPerSecondSquared *
    submergedVolumeCubicMeters
  const freeNetForceNewtons = buoyantForceNewtons - weightNewtons
  const isGrounded =
    zMeters <= bottomCenterZ + hydrostaticFloatToleranceNewtons &&
    freeNetForceNewtons < 0
  const bottomNormalForceNewtons = isGrounded ? -freeNetForceNewtons : 0
  const netForceNewtons = freeNetForceNewtons + bottomNormalForceNewtons
  const accelerationMetersPerSecondSquared =
    netForceNewtons / objectMassKilograms
  const centerDepthMeters = Math.max(0, -zMeters)
  const topDepthMeters = Math.max(0, -(zMeters + sphereRadiusMeters))
  const bottomDepthMeters = Math.max(0, -(zMeters - sphereRadiusMeters))
  const fluidPressurePascals =
    parameters.fluidDensityKilogramsPerCubicMeter *
    parameters.gravityMetersPerSecondSquared *
    centerDepthMeters
  const topPressurePascals =
    parameters.fluidDensityKilogramsPerCubicMeter *
    parameters.gravityMetersPerSecondSquared *
    topDepthMeters
  const bottomPressurePascals =
    parameters.fluidDensityKilogramsPerCubicMeter *
    parameters.gravityMetersPerSecondSquared *
    bottomDepthMeters
  const kineticEnergyJoules =
    0.5 * objectMassKilograms * velocityMetersPerSecond ** 2
  const potentialEnergyJoules =
    objectMassKilograms *
    parameters.gravityMetersPerSecondSquared *
    Math.max(0, zMeters - bottomCenterZ)

  return buildSample({
    accelerationMetersPerSecondSquared,
    accelerationZMetersPerSecondSquared: accelerationMetersPerSecondSquared,
    buoyantForceNewtons,
    crossSectionAreaSquareMeters: Math.PI * sphereRadiusMeters ** 2,
    displacementMeters: zMeters - initialCenterZ,
    fluidPressurePascals,
    forceOneNewtons: buoyantForceNewtons,
    forceTwoNewtons: weightNewtons,
    forceThreeNewtons: bottomNormalForceNewtons,
    gripRatio: densityRatio,
    isGrounded,
    kineticEnergyJoules,
    netForceNewtons,
    normalForceNewtons: bottomNormalForceNewtons,
    objectDensityKilogramsPerCubicMeter,
    objectMassKilograms,
    positionMeters: centerDepthMeters,
    potentialEnergyJoules,
    pressurePascals: topPressurePascals,
    primaryRadiusMeters: sphereRadiusMeters,
    secondaryPressurePascals: bottomPressurePascals,
    secondaryRadiusMeters: tankDepthMeters,
    speedMetersPerSecond: Math.abs(velocityMetersPerSecond),
    submergedFraction,
    timeSeconds,
    totalEnergyJoules: kineticEnergyJoules + potentialEnergyJoules,
    velocityMetersPerSecond,
    velocityZMetersPerSecond: velocityMetersPerSecond,
    weightNewtons,
    xMeters: 0,
    zMeters,
  })
}

function sphereRadiusFromVolume(volumeCubicMeters: number) {
  return Math.cbrt((3 * volumeCubicMeters) / (4 * Math.PI))
}

function computeHydrostaticInitialCenterZ(
  parameters: HydrostaticsBuoyancyParameters,
  sphereRadiusMeters: number,
  tankDepthMeters: number,
) {
  const bottomCenterZ = -tankDepthMeters + sphereRadiusMeters
  const initialCenterZ =
    parameters.initialCenterZMeters ?? -parameters.depthMeters

  return clamp(initialCenterZ, bottomCenterZ, sphereRadiusMeters)
}

function sphereSubmergedVolumeCubicMeters(
  sphereRadiusMeters: number,
  centerZMeters: number,
) {
  const capHeightMeters = clamp(
    sphereRadiusMeters - centerZMeters,
    0,
    sphereRadiusMeters * 2,
  )

  return (
    (Math.PI * capHeightMeters ** 2 * (3 * sphereRadiusMeters - capHeightMeters)) /
    3
  )
}

function sphereCapHeightForSubmergedFraction(
  sphereRadiusMeters: number,
  submergedFraction: number,
) {
  if (submergedFraction <= 0) {
    return 0
  }

  if (submergedFraction >= 1) {
    return sphereRadiusMeters * 2
  }

  const targetVolume =
    (4 * Math.PI * sphereRadiusMeters ** 3 * submergedFraction) / 3
  let low = 0
  let high = sphereRadiusMeters * 2

  for (let index = 0; index < 42; index += 1) {
    const mid = (low + high) / 2
    const volume =
      (Math.PI * mid ** 2 * (3 * sphereRadiusMeters - mid)) / 3

    if (volume < targetVolume) {
      low = mid
    } else {
      high = mid
    }
  }

  return (low + high) / 2
}

function solveDampedHydrostaticApproach({
  equilibriumCenterZ,
  initialCenterZ,
  initialVelocityMetersPerSecond,
  timeSeconds,
}: {
  equilibriumCenterZ: number
  initialCenterZ: number
  initialVelocityMetersPerSecond?: number
  timeSeconds: number
}) {
  const delta = initialCenterZ - equilibriumCenterZ
  const damping = hydrostaticFloatDampingPerSecond
  const angularFrequency = hydrostaticFloatAngularFrequencyRadiansPerSecond
  const sineCoefficient =
    initialVelocityMetersPerSecond === undefined
      ? 0
      : (initialVelocityMetersPerSecond + damping * delta) / angularFrequency
  const decay = Math.exp(-damping * timeSeconds)
  const cos = Math.cos(angularFrequency * timeSeconds)
  const sin = Math.sin(angularFrequency * timeSeconds)
  const carrier = delta * cos + sineCoefficient * sin
  const carrierDerivative =
    -delta * angularFrequency * sin + sineCoefficient * angularFrequency * cos

  return {
    velocityMetersPerSecond:
      decay * (carrierDerivative - damping * carrier),
    zMeters: equilibriumCenterZ + decay * carrier,
  }
}

function computeMassSpringSample(
  parameters: MassSpringParameters,
  timeSeconds: number,
): KinematicsSample {
  const naturalAngularFrequency =
    Math.sqrt(parameters.springConstantNewtonsPerMeter / parameters.massKilograms)
  const motion = solveDampedHarmonicMotion({
    dampingPerSecond: parameters.dampingPerSecond,
    initialDisplacementMeters: parameters.initialDisplacementMeters,
    initialVelocityMetersPerSecond: parameters.initialVelocityMetersPerSecond,
    naturalAngularFrequency,
    timeSeconds,
  })
  const equilibriumExtensionMeters =
    (parameters.massKilograms *
      parameters.gravityMetersPerSecondSquared) /
    parameters.springConstantNewtonsPerMeter
  const totalSpringExtensionMeters =
    equilibriumExtensionMeters + motion.displacementMeters
  const springForceNewtons =
    parameters.springConstantNewtonsPerMeter * totalSpringExtensionMeters
  const weightNewtons =
    parameters.massKilograms * parameters.gravityMetersPerSecondSquared
  const kineticEnergyJoules =
    0.5 *
    parameters.massKilograms *
    motion.velocityMetersPerSecond ** 2
  const oscillatorPotentialEnergyJoules =
    0.5 *
    parameters.springConstantNewtonsPerMeter *
    motion.displacementMeters ** 2
  const initialOscillatorEnergyJoules =
    0.5 *
      parameters.massKilograms *
      parameters.initialVelocityMetersPerSecond ** 2 +
    0.5 *
      parameters.springConstantNewtonsPerMeter *
      parameters.initialDisplacementMeters ** 2
  const mechanicalEnergyJoules =
    kineticEnergyJoules + oscillatorPotentialEnergyJoules
  const thermalEnergyJoules =
    parameters.dampingPerSecond > 0
      ? Math.max(0, initialOscillatorEnergyJoules - mechanicalEnergyJoules)
      : 0
  const periodSeconds = (2 * Math.PI) / naturalAngularFrequency

  return buildSample({
    accelerationMetersPerSecondSquared:
      motion.accelerationMetersPerSecondSquared,
    accelerationZMetersPerSecondSquared:
      -motion.accelerationMetersPerSecondSquared,
    displacementMeters: motion.displacementMeters,
    elasticPotentialEnergyJoules:
      0.5 *
      parameters.springConstantNewtonsPerMeter *
      totalSpringExtensionMeters ** 2,
    frequencyHertz: 1 / periodSeconds,
    gravitationalPotentialEnergyJoules:
      -weightNewtons * totalSpringExtensionMeters,
    kineticEnergyJoules,
    netForceNewtons:
      parameters.massKilograms * motion.accelerationMetersPerSecondSquared,
    periodSeconds,
    positionMeters: motion.displacementMeters,
    potentialEnergyJoules: oscillatorPotentialEnergyJoules,
    primaryRadiusMeters:
      massSpringVisualNaturalLengthMeters + equilibriumExtensionMeters,
    secondaryRadiusMeters: equilibriumExtensionMeters,
    speedMetersPerSecond: Math.abs(motion.velocityMetersPerSecond),
    springForceNewtons,
    tensionNewtons: Math.abs(springForceNewtons),
    thermalEnergyJoules,
    timeSeconds,
    totalEnergyJoules:
      mechanicalEnergyJoules + thermalEnergyJoules,
    velocityMetersPerSecond: motion.velocityMetersPerSecond,
    velocityZMetersPerSecond: -motion.velocityMetersPerSecond,
    weightNewtons,
    xMeters: 0,
    zMeters: -motion.displacementMeters,
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

function solveDampedHarmonicMotion({
  dampingPerSecond,
  initialDisplacementMeters,
  initialVelocityMetersPerSecond,
  naturalAngularFrequency,
  timeSeconds,
}: {
  dampingPerSecond: number
  initialDisplacementMeters: number
  initialVelocityMetersPerSecond: number
  naturalAngularFrequency: number
  timeSeconds: number
}) {
  const omega0Squared = naturalAngularFrequency ** 2

  if (dampingPerSecond <= massSpringDampingTolerance) {
    const cosine = Math.cos(naturalAngularFrequency * timeSeconds)
    const sine = Math.sin(naturalAngularFrequency * timeSeconds)
    const displacementMeters =
      initialDisplacementMeters * cosine +
      (initialVelocityMetersPerSecond / naturalAngularFrequency) * sine
    const velocityMetersPerSecond =
      -initialDisplacementMeters * naturalAngularFrequency * sine +
      initialVelocityMetersPerSecond * cosine

    return {
      accelerationMetersPerSecondSquared:
        -omega0Squared * displacementMeters,
      displacementMeters,
      velocityMetersPerSecond,
    }
  }

  const criticalDampingPerSecond = 2 * naturalAngularFrequency

  if (
    dampingPerSecond <
    criticalDampingPerSecond - massSpringDampingTolerance
  ) {
    const decayRate = dampingPerSecond / 2
    const dampedAngularFrequency = Math.sqrt(
      omega0Squared - decayRate ** 2,
    )
    const coefficientA = initialDisplacementMeters
    const coefficientB =
      (initialVelocityMetersPerSecond +
        decayRate * initialDisplacementMeters) /
      dampedAngularFrequency
    const decay = Math.exp(-decayRate * timeSeconds)
    const cosine = Math.cos(dampedAngularFrequency * timeSeconds)
    const sine = Math.sin(dampedAngularFrequency * timeSeconds)
    const carrier = coefficientA * cosine + coefficientB * sine
    const carrierDerivative =
      -coefficientA * dampedAngularFrequency * sine +
      coefficientB * dampedAngularFrequency * cosine
    const displacementMeters = decay * carrier
    const velocityMetersPerSecond =
      decay * (carrierDerivative - decayRate * carrier)

    return {
      accelerationMetersPerSecondSquared:
        -dampingPerSecond * velocityMetersPerSecond -
        omega0Squared * displacementMeters,
      displacementMeters,
      velocityMetersPerSecond,
    }
  }

  if (
    Math.abs(dampingPerSecond - criticalDampingPerSecond) <=
    massSpringDampingTolerance
  ) {
    const coefficientA = initialDisplacementMeters
    const coefficientB =
      initialVelocityMetersPerSecond +
      naturalAngularFrequency * initialDisplacementMeters
    const decay = Math.exp(-naturalAngularFrequency * timeSeconds)
    const carrier = coefficientA + coefficientB * timeSeconds
    const displacementMeters = decay * carrier
    const velocityMetersPerSecond =
      decay *
      (coefficientB - naturalAngularFrequency * carrier)

    return {
      accelerationMetersPerSecondSquared:
        -dampingPerSecond * velocityMetersPerSecond -
        omega0Squared * displacementMeters,
      displacementMeters,
      velocityMetersPerSecond,
    }
  }

  const root = Math.sqrt(dampingPerSecond ** 2 - 4 * omega0Squared)
  const rateOne = (-dampingPerSecond + root) / 2
  const rateTwo = (-dampingPerSecond - root) / 2
  const coefficientOne =
    (initialVelocityMetersPerSecond -
      rateTwo * initialDisplacementMeters) /
    (rateOne - rateTwo)
  const coefficientTwo = initialDisplacementMeters - coefficientOne
  const displacementMeters =
    coefficientOne * Math.exp(rateOne * timeSeconds) +
    coefficientTwo * Math.exp(rateTwo * timeSeconds)
  const velocityMetersPerSecond =
    coefficientOne * rateOne * Math.exp(rateOne * timeSeconds) +
    coefficientTwo * rateTwo * Math.exp(rateTwo * timeSeconds)

  return {
    accelerationMetersPerSecondSquared:
      -dampingPerSecond * velocityMetersPerSecond -
      omega0Squared * displacementMeters,
    displacementMeters,
    velocityMetersPerSecond,
  }
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
  const result = computeWorkEnergyTrackSamples({
    durationSeconds: timeSeconds,
    parameters,
    sampleRateHz: 240,
  })
  const sample = result.samples.at(-1)

  if (!sample) {
    throw new Error('Work-energy half-pipe sample could not be computed.')
  }

  return sample
}

type WorkEnergyTrackSetup = {
  contactTimeSeconds: number
  dampingPerSecond: number
  halfWidthMeters: number
  initialEnergyJoules: number
  initialReferenceXMeters: number
  initialTrackXMeters: number
  initialTrackVelocityXMetersPerSecond: number
  rimHeightMeters: number
}

type WorkEnergyTrackState = {
  thermalEnergyJoules: number
  velocityXMetersPerSecond: number
  xMeters: number
}

function computeWorkEnergyTrackSamples({
  durationSeconds,
  parameters,
  sampleRateHz,
}: {
  durationSeconds: number
  parameters: WorkEnergyTrackParameters
  sampleRateHz: number
}) {
  const setup = createWorkEnergyTrackSetup(parameters)
  const sampleIntervalSeconds = 1 / sampleRateHz
  const sampleCount = Math.floor(durationSeconds * sampleRateHz) + 1
  const samples: KinematicsSample[] = []
  const state: WorkEnergyTrackState = {
    thermalEnergyJoules: 0,
    velocityXMetersPerSecond: setup.initialTrackVelocityXMetersPerSecond,
    xMeters: setup.initialTrackXMeters,
  }
  let integratedTrackTimeSeconds = 0

  for (let index = 0; index < sampleCount; index += 1) {
    const timeSeconds = index * sampleIntervalSeconds

    if (timeSeconds < setup.contactTimeSeconds) {
      samples.push(buildWorkEnergyFreeFallSample(parameters, setup, timeSeconds))
      continue
    }

    const targetTrackTimeSeconds = timeSeconds - setup.contactTimeSeconds

    integrateWorkEnergyTrackState({
      parameters,
      setup,
      state,
      targetTrackTimeSeconds,
      trackTimeSeconds: integratedTrackTimeSeconds,
    })
    integratedTrackTimeSeconds = targetTrackTimeSeconds
    samples.push(
      buildWorkEnergyTrackConstrainedSample({
        parameters,
        setup,
        state,
        timeSeconds,
      }),
    )
  }

  return { samples }
}

function createWorkEnergyTrackSetup(
  parameters: WorkEnergyTrackParameters,
): WorkEnergyTrackSetup {
  const halfWidthMeters = parameters.trackLengthMeters / 2
  const initialReferenceXMeters = clamp(
    parameters.initialPositionMeters,
    -halfWidthMeters,
    halfWidthMeters,
  )
  const referenceHeightMeters = computeWorkEnergyTrackHeightMeters(
    initialReferenceXMeters,
    halfWidthMeters,
    parameters.heightDropMeters,
  )
  const startsAboveTrack = parameters.initialHeightOffsetMeters > 0
  const contactTimeSeconds = startsAboveTrack
    ? Math.sqrt(
        (2 * parameters.initialHeightOffsetMeters) /
          parameters.gravityMetersPerSecondSquared,
      )
    : 0
  const effectiveReleaseHeightMeters = startsAboveTrack
    ? referenceHeightMeters
    : clamp(
        referenceHeightMeters + parameters.initialHeightOffsetMeters,
        0,
        parameters.heightDropMeters,
      )
  const initialTrackXMeters = startsAboveTrack
    ? initialReferenceXMeters
    : getWorkEnergyTrackXForHeight({
        fallbackSign: initialReferenceXMeters < 0 ? -1 : 1,
        halfWidthMeters,
        heightMeters: effectiveReleaseHeightMeters,
        rimHeightMeters: parameters.heightDropMeters,
      })
  const contactSlope = computeWorkEnergyTrackSlope(
    initialTrackXMeters,
    halfWidthMeters,
    parameters.heightDropMeters,
  )
  const inwardDirection =
    initialTrackXMeters > 0 ? -1 : initialTrackXMeters < 0 ? 1 : 1
  const releaseSpeedMetersPerSecond = startsAboveTrack
    ? Math.sqrt(
        parameters.initialSpeedMetersPerSecond ** 2 +
          2 *
            parameters.gravityMetersPerSecondSquared *
            parameters.initialHeightOffsetMeters,
      )
    : parameters.initialSpeedMetersPerSecond
  const metric = 1 + contactSlope ** 2
  const initialTrackVelocityXMetersPerSecond =
    (inwardDirection * releaseSpeedMetersPerSecond) / Math.sqrt(metric)
  const initialEnergyJoules =
    0.5 * parameters.massKilograms * releaseSpeedMetersPerSecond ** 2 +
    parameters.massKilograms *
      parameters.gravityMetersPerSecondSquared *
      effectiveReleaseHeightMeters
  const naturalPeriodSeconds =
    (2 * Math.PI) /
    Math.sqrt(
      (2 *
        parameters.gravityMetersPerSecondSquared *
        parameters.heightDropMeters) /
        halfWidthMeters ** 2,
    )
  const retainedEnergyRatio = 1 - parameters.energyLossPercent / 100
  const dampingPerSecond =
    parameters.energyLossPercent <= 0
      ? 0
      : -Math.log(Math.max(0.01, retainedEnergyRatio)) / naturalPeriodSeconds

  return {
    contactTimeSeconds,
    dampingPerSecond,
    halfWidthMeters,
    initialEnergyJoules,
    initialReferenceXMeters,
    initialTrackXMeters,
    initialTrackVelocityXMetersPerSecond,
    rimHeightMeters: parameters.heightDropMeters,
  }
}

function buildWorkEnergyFreeFallSample(
  parameters: WorkEnergyTrackParameters,
  setup: WorkEnergyTrackSetup,
  timeSeconds: number,
) {
  const referenceHeightMeters = computeWorkEnergyTrackHeightMeters(
    setup.initialReferenceXMeters,
    setup.halfWidthMeters,
    setup.rimHeightMeters,
  )
  const zMeters =
    referenceHeightMeters +
    parameters.initialHeightOffsetMeters -
    0.5 * parameters.gravityMetersPerSecondSquared * timeSeconds ** 2
  const velocityZMetersPerSecond =
    -parameters.gravityMetersPerSecondSquared * timeSeconds
  const speedMetersPerSecond = Math.hypot(
    parameters.initialSpeedMetersPerSecond,
    velocityZMetersPerSecond,
  )
  const kineticEnergyJoules =
    0.5 * parameters.massKilograms * speedMetersPerSecond ** 2
  const potentialEnergyJoules =
    parameters.massKilograms *
    parameters.gravityMetersPerSecondSquared *
    Math.max(0, zMeters)

  return buildSample({
    accelerationMetersPerSecondSquared:
      -parameters.gravityMetersPerSecondSquared,
    accelerationZMetersPerSecondSquared:
      -parameters.gravityMetersPerSecondSquared,
    displacementMeters: 0,
    energyLossPercent: 0,
    isGrounded: false,
    kineticEnergyJoules,
    kineticEnergyLostJoules: 0,
    positionMeters: setup.initialReferenceXMeters,
    potentialEnergyJoules,
    primaryRadiusMeters: setup.halfWidthMeters,
    secondaryRadiusMeters: setup.rimHeightMeters,
    speedMetersPerSecond,
    thermalEnergyJoules: 0,
    timeSeconds,
    totalEnergyJoules: kineticEnergyJoules + potentialEnergyJoules,
    velocityMetersPerSecond: velocityZMetersPerSecond,
    velocityZMetersPerSecond,
    weightNewtons:
      parameters.massKilograms *
      parameters.gravityMetersPerSecondSquared,
    xMeters: setup.initialReferenceXMeters,
    zMeters,
  })
}

function integrateWorkEnergyTrackState({
  parameters,
  setup,
  state,
  targetTrackTimeSeconds,
  trackTimeSeconds,
}: {
  parameters: WorkEnergyTrackParameters
  setup: WorkEnergyTrackSetup
  state: WorkEnergyTrackState
  targetTrackTimeSeconds: number
  trackTimeSeconds: number
}) {
  const maxStepSeconds = 1 / 720
  let currentTimeSeconds = trackTimeSeconds

  while (currentTimeSeconds < targetTrackTimeSeconds - 1e-12) {
    const deltaTimeSeconds = Math.min(
      maxStepSeconds,
      targetTrackTimeSeconds - currentTimeSeconds,
    )
    const accelerationXMetersPerSecondSquared =
      computeWorkEnergyTrackAccelerationX(parameters, setup, state)

    state.velocityXMetersPerSecond +=
      accelerationXMetersPerSecondSquared * deltaTimeSeconds
    state.xMeters += state.velocityXMetersPerSecond * deltaTimeSeconds

    const slope = computeWorkEnergyTrackSlope(
      state.xMeters,
      setup.halfWidthMeters,
      setup.rimHeightMeters,
    )
    const speedMetersPerSecond =
      Math.abs(state.velocityXMetersPerSecond) * Math.sqrt(1 + slope ** 2)

    state.thermalEnergyJoules +=
      parameters.massKilograms *
      setup.dampingPerSecond *
      speedMetersPerSecond ** 2 *
      deltaTimeSeconds

    if (setup.dampingPerSecond === 0) {
      correctConservativeWorkEnergyState(parameters, setup, state)
    }

    currentTimeSeconds += deltaTimeSeconds
  }
}

function buildWorkEnergyTrackConstrainedSample({
  parameters,
  setup,
  state,
  timeSeconds,
}: {
  parameters: WorkEnergyTrackParameters
  setup: WorkEnergyTrackSetup
  state: WorkEnergyTrackState
  timeSeconds: number
}) {
  const slope = computeWorkEnergyTrackSlope(
    state.xMeters,
    setup.halfWidthMeters,
    setup.rimHeightMeters,
  )
  const curvature = computeWorkEnergyTrackCurvature(
    setup.halfWidthMeters,
    setup.rimHeightMeters,
  )
  const heightMeters = computeWorkEnergyTrackHeightMeters(
    state.xMeters,
    setup.halfWidthMeters,
    setup.rimHeightMeters,
  )
  const accelerationXMetersPerSecondSquared =
    computeWorkEnergyTrackAccelerationX(parameters, setup, state)
  const velocityZMetersPerSecond = slope * state.velocityXMetersPerSecond
  const accelerationZMetersPerSecondSquared =
    curvature * state.velocityXMetersPerSecond ** 2 +
    slope * accelerationXMetersPerSecondSquared
  const speedMetersPerSecond =
    Math.abs(state.velocityXMetersPerSecond) * Math.sqrt(1 + slope ** 2)
  const kineticEnergyJoules =
    0.5 * parameters.massKilograms * speedMetersPerSecond ** 2
  const potentialEnergyJoules =
    parameters.massKilograms *
    parameters.gravityMetersPerSecondSquared *
    heightMeters
  const totalEnergyJoules =
    setup.dampingPerSecond === 0
      ? setup.initialEnergyJoules
      : kineticEnergyJoules + potentialEnergyJoules
  const energyLossJoules = Math.max(
    0,
    Math.min(setup.initialEnergyJoules, state.thermalEnergyJoules),
  )
  const energyLossPercent =
    setup.initialEnergyJoules > 0
      ? (energyLossJoules / setup.initialEnergyJoules) * 100
      : 0
  const metric = Math.sqrt(1 + slope ** 2)
  const tangentialAccelerationMetersPerSecondSquared =
    (accelerationXMetersPerSecondSquared +
      slope * accelerationZMetersPerSecondSquared) /
    metric
  const dampingForceNewtons =
    parameters.massKilograms * setup.dampingPerSecond * speedMetersPerSecond
  const normalForceNewtons =
    parameters.massKilograms *
    Math.max(
      0,
      parameters.gravityMetersPerSecondSquared / metric +
        (speedMetersPerSecond ** 2 *
          Math.abs(curvature / (1 + slope ** 2) ** 1.5)),
    )

  return buildSample({
    accelerationMetersPerSecondSquared:
      tangentialAccelerationMetersPerSecondSquared,
    accelerationXMetersPerSecondSquared,
    accelerationZMetersPerSecondSquared,
    displacementMeters: state.xMeters - setup.initialTrackXMeters,
    energyLossPercent,
    frictionForceNewtons: dampingForceNewtons,
    isGrounded: true,
    kineticEnergyJoules,
    kineticEnergyLostJoules: energyLossJoules,
    netForceNewtons:
      parameters.massKilograms *
      tangentialAccelerationMetersPerSecondSquared,
    normalForceNewtons,
    positionMeters: state.xMeters,
    potentialEnergyJoules,
    primaryRadiusMeters: setup.halfWidthMeters,
    secondaryRadiusMeters: setup.rimHeightMeters,
    speedMetersPerSecond,
    thermalEnergyJoules: energyLossJoules,
    timeSeconds,
    totalEnergyJoules,
    velocityMetersPerSecond:
      Math.sign(state.velocityXMetersPerSecond) * speedMetersPerSecond,
    velocityXMetersPerSecond: state.velocityXMetersPerSecond,
    velocityZMetersPerSecond,
    weightNewtons:
      parameters.massKilograms *
      parameters.gravityMetersPerSecondSquared,
    xMeters: state.xMeters,
    zMeters: heightMeters,
  })
}

function computeWorkEnergyTrackAccelerationX(
  parameters: WorkEnergyTrackParameters,
  setup: WorkEnergyTrackSetup,
  state: WorkEnergyTrackState,
) {
  const slope = computeWorkEnergyTrackSlope(
    state.xMeters,
    setup.halfWidthMeters,
    setup.rimHeightMeters,
  )
  const curvature = computeWorkEnergyTrackCurvature(
    setup.halfWidthMeters,
    setup.rimHeightMeters,
  )
  const metric = 1 + slope ** 2

  return (
    -slope * curvature * state.velocityXMetersPerSecond ** 2 -
    parameters.gravityMetersPerSecondSquared * slope -
    setup.dampingPerSecond * state.velocityXMetersPerSecond * metric
  ) / metric
}

function correctConservativeWorkEnergyState(
  parameters: WorkEnergyTrackParameters,
  setup: WorkEnergyTrackSetup,
  state: WorkEnergyTrackState,
) {
  const slope = computeWorkEnergyTrackSlope(
    state.xMeters,
    setup.halfWidthMeters,
    setup.rimHeightMeters,
  )
  const heightMeters = computeWorkEnergyTrackHeightMeters(
    state.xMeters,
    setup.halfWidthMeters,
    setup.rimHeightMeters,
  )
  const potentialEnergyJoules =
    parameters.massKilograms *
    parameters.gravityMetersPerSecondSquared *
    heightMeters
  const targetKineticEnergyJoules = setup.initialEnergyJoules - potentialEnergyJoules

  if (targetKineticEnergyJoules <= 0) {
    state.xMeters = getWorkEnergyTrackXForHeight({
      fallbackSign: state.xMeters < 0 ? -1 : 1,
      halfWidthMeters: setup.halfWidthMeters,
      heightMeters:
        setup.initialEnergyJoules /
        (parameters.massKilograms * parameters.gravityMetersPerSecondSquared),
      rimHeightMeters: setup.rimHeightMeters,
    })
    state.velocityXMetersPerSecond = 0
    return
  }

  const speedMetersPerSecond = Math.sqrt(
    (2 * targetKineticEnergyJoules) / parameters.massKilograms,
  )
  const direction = Math.sign(state.velocityXMetersPerSecond) || -Math.sign(state.xMeters) || 1

  state.velocityXMetersPerSecond =
    (direction * speedMetersPerSecond) / Math.sqrt(1 + slope ** 2)
}

function computeWorkEnergyTrackHeightMeters(
  xMeters: number,
  halfWidthMeters: number,
  rimHeightMeters: number,
) {
  if (halfWidthMeters === 0) {
    return 0
  }

  return rimHeightMeters * (xMeters / halfWidthMeters) ** 2
}

function computeWorkEnergyTrackSlope(
  xMeters: number,
  halfWidthMeters: number,
  rimHeightMeters: number,
) {
  if (halfWidthMeters === 0) {
    return 0
  }

  return (2 * rimHeightMeters * xMeters) / halfWidthMeters ** 2
}

function computeWorkEnergyTrackCurvature(
  halfWidthMeters: number,
  rimHeightMeters: number,
) {
  if (halfWidthMeters === 0) {
    return 0
  }

  return (2 * rimHeightMeters) / halfWidthMeters ** 2
}

function getWorkEnergyTrackXForHeight({
  fallbackSign,
  halfWidthMeters,
  heightMeters,
  rimHeightMeters,
}: {
  fallbackSign: number
  halfWidthMeters: number
  heightMeters: number
  rimHeightMeters: number
}) {
  if (rimHeightMeters <= 0) {
    return 0
  }

  return (
    (fallbackSign < 0 ? -1 : 1) *
    halfWidthMeters *
    Math.sqrt(clamp(heightMeters / rimHeightMeters, 0, 1))
  )
}

function computeUniformlyAcceleratedMotionSample(
  parameters: UniformlyAcceleratedMotionParameters,
  timeSeconds: number,
): KinematicsSample {
  const groundContactTimeSeconds =
    getUniformlyAcceleratedGroundContactTime(parameters)
  const isGrounded =
    groundContactTimeSeconds !== null &&
    timeSeconds > groundContactTimeSeconds
  const activeTimeSeconds = isGrounded
    ? groundContactTimeSeconds
    : timeSeconds
  const zMeters =
    parameters.initialPositionMeters +
    parameters.initialVelocityMetersPerSecond * activeTimeSeconds +
    0.5 *
      parameters.accelerationMetersPerSecondSquared *
      activeTimeSeconds ** 2
  const velocityZMetersPerSecond =
    isGrounded
      ? 0
      : parameters.initialVelocityMetersPerSecond +
        parameters.accelerationMetersPerSecondSquared * activeTimeSeconds
  const displayZMeters =
    groundContactTimeSeconds !== null ? Math.max(0, zMeters) : zMeters
  const displacementMeters = displayZMeters - parameters.initialPositionMeters
  const speedMetersPerSecond = Math.abs(velocityZMetersPerSecond)
  const kineticEnergyJoules =
    0.5 *
    parameters.massKilograms *
    speedMetersPerSecond *
    speedMetersPerSecond

  return buildSample({
    accelerationMetersPerSecondSquared: isGrounded
      ? 0
      : Math.abs(parameters.accelerationMetersPerSecondSquared),
    accelerationZMetersPerSecondSquared: isGrounded
      ? 0
      : parameters.accelerationMetersPerSecondSquared,
    displacementMeters,
    isGrounded,
    kineticEnergyJoules,
    positionMeters: displayZMeters,
    speedMetersPerSecond,
    timeSeconds,
    velocityMetersPerSecond: velocityZMetersPerSecond,
    velocityZMetersPerSecond,
    xMeters: 0,
    zMeters: displayZMeters,
  })
}

function getUniformlyAcceleratedGroundContactTime(
  parameters: UniformlyAcceleratedMotionParameters,
) {
  const initialPositionMeters = parameters.initialPositionMeters
  const initialVelocityMetersPerSecond =
    parameters.initialVelocityMetersPerSecond
  const accelerationMetersPerSecondSquared =
    parameters.accelerationMetersPerSecondSquared

  if (initialPositionMeters <= 0) {
    return null
  }

  if (
    Math.abs(accelerationMetersPerSecondSquared) <=
    uniformlyAcceleratedGroundTolerance
  ) {
    return initialVelocityMetersPerSecond < 0
      ? initialPositionMeters / -initialVelocityMetersPerSecond
      : null
  }

  const discriminant =
    initialVelocityMetersPerSecond ** 2 -
    2 * accelerationMetersPerSecondSquared * initialPositionMeters

  if (discriminant < 0) {
    return null
  }

  const squareRootDiscriminant = Math.sqrt(discriminant)
  const roots = [
    (-initialVelocityMetersPerSecond - squareRootDiscriminant) /
      accelerationMetersPerSecondSquared,
    (-initialVelocityMetersPerSecond + squareRootDiscriminant) /
      accelerationMetersPerSecondSquared,
  ]

  return (
    roots
      .filter((root) => root >= 0)
      .filter((root) => {
        const velocityAtRoot =
          initialVelocityMetersPerSecond +
          accelerationMetersPerSecondSquared * root

        return velocityAtRoot <= uniformlyAcceleratedGroundTolerance
      })
      .sort((left, right) => left - right)[0] ?? null
  )
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
  const momentOfInertiaKilogramMetersSquared =
    computeRigidBodyRotationMomentOfInertia(parameters)
  const referenceMomentOfInertiaKilogramMetersSquared =
    parameters.momentOfInertiaKilogramMetersSquared +
    parameters.slidingMassKilograms *
      rigidBodyReferenceMassDistanceMeters ** 2
  const initialAngularMomentumKilogramMetersSquaredPerSecond =
    referenceMomentOfInertiaKilogramMetersSquared *
    parameters.initialAngularVelocityRadiansPerSecond
  const referenceKineticEnergyJoules =
    0.5 *
    referenceMomentOfInertiaKilogramMetersSquared *
    parameters.initialAngularVelocityRadiansPerSecond ** 2
  const effectiveInitialAngularVelocityRadiansPerSecond =
    parameters.constantRotationalEnergy
      ? restoreAngularVelocityFromEnergy(
          referenceKineticEnergyJoules,
          momentOfInertiaKilogramMetersSquared,
          parameters.initialAngularVelocityRadiansPerSecond,
        )
      : initialAngularMomentumKilogramMetersSquaredPerSecond /
        momentOfInertiaKilogramMetersSquared
  const driveAngularAcceleration = parameters.constantRotationalEnergy
    ? 0
    : parameters.appliedTorqueNewtonMeters /
      momentOfInertiaKilogramMetersSquared
  const angularState = parameters.constantRotationalEnergy
    ? {
        angleRadians:
          initialAngleRadians +
          effectiveInitialAngularVelocityRadiansPerSecond * timeSeconds,
        angularAccelerationRadiansPerSecondSquared: 0,
        angularVelocityRadiansPerSecond:
          effectiveInitialAngularVelocityRadiansPerSecond,
      }
    : computeDampedAngularMotion({
        angularDampingPerSecond: parameters.angularDampingPerSecond,
        driveAngularAcceleration,
        initialAngleRadians,
        initialAngularVelocityRadiansPerSecond:
          effectiveInitialAngularVelocityRadiansPerSecond,
        timeSeconds,
      })
  const kineticEnergyJoules =
    0.5 *
    momentOfInertiaKilogramMetersSquared *
    angularState.angularVelocityRadiansPerSecond ** 2
  const initialKineticEnergyJoules =
    0.5 *
    momentOfInertiaKilogramMetersSquared *
    effectiveInitialAngularVelocityRadiansPerSecond ** 2
  const angularDisplacementRadians =
    angularState.angleRadians - initialAngleRadians
  const netTorqueNewtonMeters = parameters.constantRotationalEnergy
    ? 0
    : parameters.appliedTorqueNewtonMeters
  const appliedWorkJoules = netTorqueNewtonMeters * angularDisplacementRadians
  const thermalEnergyJoules = Math.max(
    0,
    appliedWorkJoules + initialKineticEnergyJoules - kineticEnergyJoules,
  )
  const centerOfMassMeters =
    (parameters.slidingMassKilograms * parameters.slidingMassDistanceMeters) /
    (rigidBodyCentralMassKilograms + parameters.slidingMassKilograms)

  return buildSample({
    angleRadians: angularState.angleRadians,
    angularAccelerationRadiansPerSecondSquared:
      angularState.angularAccelerationRadiansPerSecondSquared,
    angularVelocityRadiansPerSecond:
      angularState.angularVelocityRadiansPerSecond,
    appliedWorkJoules,
    centerOfMassMeters,
    kineticEnergyJoules,
    momentOfInertiaKilogramMetersSquared:
      momentOfInertiaKilogramMetersSquared,
    netTorqueNewtonMeters,
    positionMeters: angularDisplacementRadians,
    primaryRadiusMeters: parameters.slidingMassDistanceMeters,
    secondaryRadiusMeters: rigidBodyMaxSlidingMassDistanceMeters,
    speedMetersPerSecond: Math.abs(angularState.angularVelocityRadiansPerSecond),
    thermalEnergyJoules,
    timeSeconds,
    totalEnergyJoules: kineticEnergyJoules + thermalEnergyJoules,
    velocityMetersPerSecond: angularState.angularVelocityRadiansPerSecond,
    xMeters: 0,
    zMeters: 0,
  })
}

function computeRigidBodyRotationMomentOfInertia(
  parameters: RigidBodyRotationParameters,
) {
  return (
    parameters.momentOfInertiaKilogramMetersSquared +
    parameters.slidingMassKilograms * parameters.slidingMassDistanceMeters ** 2
  )
}

function restoreAngularVelocityFromEnergy(
  kineticEnergyJoules: number,
  momentOfInertiaKilogramMetersSquared: number,
  referenceAngularVelocityRadiansPerSecond: number,
) {
  if (kineticEnergyJoules === 0) {
    return 0
  }

  return (
    (Math.sign(referenceAngularVelocityRadiansPerSecond) || 1) *
    Math.sqrt(
      (2 * kineticEnergyJoules) / momentOfInertiaKilogramMetersSquared,
    )
  )
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
  const visualTimeSeconds = Math.max(0, timeSeconds) * torqueLeverVisualTimeScale
  const rawAngleRadians =
    0.5 * angularAccelerationRadiansPerSecondSquared * visualTimeSeconds ** 2
  const angleRadians = clamp(
    rawAngleRadians,
    -torqueLeverMaxDisplayAngleRadians,
    torqueLeverMaxDisplayAngleRadians,
  )
  const hasReachedDisplayLimit =
    Math.abs(rawAngleRadians) >= torqueLeverMaxDisplayAngleRadians
  const angularVelocityRadiansPerSecond =
    hasReachedDisplayLimit
      ? 0
      : angularAccelerationRadiansPerSecondSquared *
        visualTimeSeconds *
        torqueLeverVisualTimeScale
  const leftHeightMeters = -parameters.leftArmMeters * Math.sin(angleRadians)
  const rightHeightMeters = parameters.rightArmMeters * Math.sin(angleRadians)
  const leftSpeedMetersPerSecond =
    Math.abs(angularVelocityRadiansPerSecond) * parameters.leftArmMeters
  const rightSpeedMetersPerSecond =
    Math.abs(angularVelocityRadiansPerSecond) * parameters.rightArmMeters
  const leftKineticEnergyJoules =
    0.5 * parameters.leftMassKilograms * leftSpeedMetersPerSecond ** 2
  const rightKineticEnergyJoules =
    0.5 * parameters.rightMassKilograms * rightSpeedMetersPerSecond ** 2
  const kineticEnergyJoules =
    leftKineticEnergyJoules + rightKineticEnergyJoules
  const leftGravitationalPotentialEnergyJoules =
    parameters.leftMassKilograms *
    parameters.gravityMetersPerSecondSquared *
    leftHeightMeters
  const rightGravitationalPotentialEnergyJoules =
    parameters.rightMassKilograms *
    parameters.gravityMetersPerSecondSquared *
    rightHeightMeters
  const gravitationalPotentialEnergyJoules =
    leftGravitationalPotentialEnergyJoules +
    rightGravitationalPotentialEnergyJoules

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
    gravitationalPotentialEnergyJoules,
    kineticEnergyJoules,
    leftGravitationalPotentialEnergyJoules,
    leftKineticEnergyJoules,
    momentOfInertiaKilogramMetersSquared,
    netForceNewtons: Math.abs(
      parameters.appliedForceNewtons - leftWeightNewtons - rightWeightNewtons,
    ),
    netTorqueNewtonMeters,
    positionMeters: centerOfMassMeters,
    potentialEnergyJoules: gravitationalPotentialEnergyJoules,
    appliedForceArmMeters: parameters.appliedForceArmMeters,
    leftArmMeters: parameters.leftArmMeters,
    rightGravitationalPotentialEnergyJoules,
    rightArmMeters: parameters.rightArmMeters,
    rightKineticEnergyJoules,
    speedMetersPerSecond: Math.abs(angularVelocityRadiansPerSecond),
    timeSeconds,
    totalEnergyJoules: kineticEnergyJoules + gravitationalPotentialEnergyJoules,
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
    appliedForceArmMeters: sample.appliedForceArmMeters ?? 0,
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
    energyLossPercent: sample.energyLossPercent ?? 0,
    elasticPotentialEnergyJoules: sample.elasticPotentialEnergyJoules ?? 0,
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
    gravitationalPotentialEnergyJoules:
      sample.gravitationalPotentialEnergyJoules ?? 0,
    gripRatio: sample.gripRatio ?? 0,
    impulseNewtonSeconds: sample.impulseNewtonSeconds ?? 0,
    isGrounded: sample.isGrounded ?? false,
    kineticEnergyJoules,
    kineticEnergyLostJoules: sample.kineticEnergyLostJoules ?? 0,
    leftArmMeters: sample.leftArmMeters ?? 0,
    leftGravitationalPotentialEnergyJoules:
      sample.leftGravitationalPotentialEnergyJoules ?? 0,
    leftKineticEnergyJoules: sample.leftKineticEnergyJoules ?? 0,
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
    objectDensityKilogramsPerCubicMeter:
      sample.objectDensityKilogramsPerCubicMeter ?? 0,
    objectMassKilograms: sample.objectMassKilograms ?? 0,
    periodSeconds: sample.periodSeconds ?? 0,
    positionMeters: sample.positionMeters ?? sample.xMeters,
    potentialEnergyJoules,
    pressurePascals: sample.pressurePascals ?? 0,
    primaryRadiusMeters: sample.primaryRadiusMeters ?? 0,
    rightArmMeters: sample.rightArmMeters ?? 0,
    rightGravitationalPotentialEnergyJoules:
      sample.rightGravitationalPotentialEnergyJoules ?? 0,
    rightKineticEnergyJoules: sample.rightKineticEnergyJoules ?? 0,
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
    springForceNewtons: sample.springForceNewtons ?? 0,
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
            'O contato ocorreria depois do horizonte calculado; a timeline mostra apenas a aproximacao.',
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
    const hydroParameters = parameters as HydrostaticsBuoyancyParameters
    const objectDensityKilogramsPerCubicMeter =
      hydroParameters.objectMassKilograms /
      hydroParameters.objectVolumeCubicMeters

    if (
      objectDensityKilogramsPerCubicMeter >
      hydroParameters.fluidDensityKilogramsPerCubicMeter
    ) {
      return [
        {
          code: 'OBJECT_SINKS',
          message:
            'A densidade derivada de massa/volume supera a densidade do fluido; o corpo submerge, acelera para baixo e pode tocar o fundo transparente.',
        },
      ]
    }

    return []
  }

  if (simulationId === 'mass-spring') {
    const springParameters = parameters as MassSpringParameters

    if (springParameters.dampingPerSecond > 0) {
      return [
        {
          code: 'SPRING_DAMPING_ACTIVE',
          message:
            'O amortecimento linear esta ativo; a amplitude diminui e a energia dissipada aparece nos samples.',
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
    const warnings: SimulationWarning[] = []

    if (
      rotationParameters.angularDampingPerSecond > 0 &&
      !rotationParameters.constantRotationalEnergy
    ) {
      warnings.push({
        code: 'ROTATION_DAMPING_ACTIVE',
        message:
          'O amortecimento angular transforma parte do trabalho aplicado em dissipacao didatica.',
      })
    }

    if (rotationParameters.constantRotationalEnergy) {
      warnings.push({
        code: 'ROTATION_CONSTANT_ENERGY_ACTIVE',
        message:
          'O modo de energia constante conserva K_rot da velocidade angular de referencia; ao mudar I, omega muda para manter a energia.',
      })
    }

    return warnings
  }

  if (simulationId === 'work-energy-track') {
    const trackParameters = parameters as WorkEnergyTrackParameters
    const warnings: SimulationWarning[] = []

    if (trackParameters.initialHeightOffsetMeters > 0) {
      warnings.push({
        code: 'HALFPIPE_VERTICAL_RELEASE',
        message:
          'O corpo inicia acima da linha da rampa; o sample mostra queda vertical ate o contato com a guia em U.',
      })
    }

    if (trackParameters.initialHeightOffsetMeters < 0) {
      warnings.push({
        code: 'HALFPIPE_BELOW_REFERENCE_RELEASE',
        message:
          'A altura inicial fica abaixo do ponto de referencia; o motor projeta a energia inicial para um ponto fisicamente possivel mais baixo na rampa em U.',
      })
    }

    if (trackParameters.energyLossPercent > 0) {
      warnings.push({
        code: 'HALFPIPE_ENERGY_LOSS_ACTIVE',
        message:
          'A perda percentual por ciclo esta ativa; a energia mecanica total diminui e o percentual acumulado aparece no sample.',
      })
    }

    return warnings
  }

  if (simulationId === 'uniformly-accelerated-motion') {
    const groundContactTimeSeconds = getUniformlyAcceleratedGroundContactTime(
      parameters as UniformlyAcceleratedMotionParameters,
    )

    if (
      groundContactTimeSeconds !== null &&
      durationSeconds > groundContactTimeSeconds
    ) {
      return [
        {
          code: 'MUV_REACHES_GROUND_PLANE',
          message:
            'O corpo alcanca o plano z = 0 durante o ciclo; depois disso o sample fica apoiado no plano de referencia.',
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
    case 'mass-spring':
      validateMassSpringParameters(parameters as MassSpringParameters)
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
  assertFinitePositive('objectMassKilograms', parameters.objectMassKilograms)
  assertFinitePositive('objectVolumeCubicMeters', parameters.objectVolumeCubicMeters)

  if (parameters.initialCenterZMeters !== undefined) {
    assertFinite('initialCenterZMeters', parameters.initialCenterZMeters)
  }

  if (parameters.initialVelocityZMetersPerSecond !== undefined) {
    assertFinite(
      'initialVelocityZMetersPerSecond',
      parameters.initialVelocityZMetersPerSecond,
    )
  }

  if (parameters.motionStartTimeSeconds !== undefined) {
    assertFiniteNonNegative(
      'motionStartTimeSeconds',
      parameters.motionStartTimeSeconds,
    )
  }
}

function validateMassSpringParameters(parameters: MassSpringParameters) {
  assertFiniteNonNegative('dampingPerSecond', parameters.dampingPerSecond)
  assertFinitePositive(
    'gravityMetersPerSecondSquared',
    parameters.gravityMetersPerSecondSquared,
  )
  assertFinite(
    'initialDisplacementMeters',
    parameters.initialDisplacementMeters,
  )
  assertFinite(
    'initialVelocityMetersPerSecond',
    parameters.initialVelocityMetersPerSecond,
  )
  assertFinitePositive('massKilograms', parameters.massKilograms)
  assertFinitePositive(
    'springConstantNewtonsPerMeter',
    parameters.springConstantNewtonsPerMeter,
  )
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
  if (typeof parameters.constantRotationalEnergy !== 'boolean') {
    throw new Error('constantRotationalEnergy must be a boolean.')
  }
  assertFinitePositive(
    'momentOfInertiaKilogramMetersSquared',
    parameters.momentOfInertiaKilogramMetersSquared,
  )
  assertFiniteNonNegative(
    'slidingMassDistanceMeters',
    parameters.slidingMassDistanceMeters,
  )
  assertFiniteNonNegative(
    'slidingMassKilograms',
    parameters.slidingMassKilograms,
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
  assertFinite('energyLossPercent', parameters.energyLossPercent)
  assertFinitePositive(
    'gravityMetersPerSecondSquared',
    parameters.gravityMetersPerSecondSquared,
  )
  assertFinitePositive('heightDropMeters', parameters.heightDropMeters)
  assertFinite('initialHeightOffsetMeters', parameters.initialHeightOffsetMeters)
  assertFinite('initialPositionMeters', parameters.initialPositionMeters)
  assertFinite('initialSpeedMetersPerSecond', parameters.initialSpeedMetersPerSecond)
  assertFinitePositive('massKilograms', parameters.massKilograms)
  assertFinitePositive('trackLengthMeters', parameters.trackLengthMeters)

  if (parameters.energyLossPercent < 0 || parameters.energyLossPercent > 40) {
    throw new Error('energyLossPercent must be between 0 and 40.')
  }

  if (parameters.initialSpeedMetersPerSecond < 0) {
    throw new Error('initialSpeedMetersPerSecond must be non-negative.')
  }

  if (
    Math.abs(parameters.initialPositionMeters) >
    parameters.trackLengthMeters / 2
  ) {
    throw new Error(
      'initialPositionMeters must stay inside the half-pipe width.',
    )
  }

  if (
    parameters.initialHeightOffsetMeters < -parameters.heightDropMeters ||
    parameters.initialHeightOffsetMeters > parameters.heightDropMeters
  ) {
    throw new Error(
      'initialHeightOffsetMeters must stay within one rim height above or below the reference point.',
    )
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

function readOptionalNumber(values: Record<string, unknown>, key: string) {
  const value = values[key]

  if (typeof value === 'undefined') {
    return undefined
  }

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${key} must be a finite number.`)
  }

  return value
}

function readBoolean(
  values: Record<string, unknown>,
  key: string,
  fallback: boolean,
) {
  const value = values[key]

  if (typeof value === 'undefined') {
    return fallback
  }

  if (typeof value !== 'boolean') {
    throw new Error(`${key} must be a boolean.`)
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
