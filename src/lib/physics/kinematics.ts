export type KinematicsSimulationId =
  | 'atwood-machine'
  | 'beats'
  | 'centripetal-force-curve'
  | 'collisions-1d-2d'
  | 'continuity-bernoulli'
  | 'coupled-oscillators'
  | 'damped-oscillator'
  | 'doppler-effect'
  | 'forced-oscillator-resonance'
  | 'gravitational-field-orbits'
  | 'gravitational-space-lattice'
  | 'hydrostatics-buoyancy'
  | 'lenses-mirrors'
  | 'light-diffraction-interference'
  | 'longitudinal-wave'
  | 'mass-spring'
  | 'particle-equilibrium'
  | 'projectile-motion'
  | 'reflection-refraction'
  | 'rigid-body-rotation'
  | 'rolling-without-slipping'
  | 'standing-waves'
  | 'superposition-interference'
  | 'torque-levers-center-mass'
  | 'uniform-circular-motion'
  | 'uniform-linear-motion'
  | 'uniformly-accelerated-motion'
  | 'wave-on-string'
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

export type DampedOscillatorParameters = {
  dampingPerSecond: number
  initialDisplacementMeters: number
  initialVelocityMetersPerSecond: number
  massKilograms: number
  springConstantNewtonsPerMeter: number
}

export type ForcedOscillatorResonanceParameters = {
  dampingPerSecond: number
  driveAngularFrequencyRadiansPerSecond: number
  driveForceNewtons: number
  initialDisplacementMeters: number
  initialVelocityMetersPerSecond: number
  massKilograms: number
  springConstantNewtonsPerMeter: number
}

export type CoupledOscillatorsParameters = {
  couplingSpringConstantNewtonsPerMeter: number
  dampingNewtonSecondsPerMeter: number
  gravityMetersPerSecondSquared: number
  initialDisplacementOneMeters: number
  initialDisplacementTwoMeters: number
  initialVelocityOneMetersPerSecond: number
  initialVelocityTwoMetersPerSecond: number
  massOneKilograms: number
  massTwoKilograms: number
  springConstantOneNewtonsPerMeter: number
  springConstantTwoNewtonsPerMeter: number
}

export type BeatsParameters = {
  amplitudePascals: number
  frequencyOneHertz: number
  frequencyTwoHertz: number
  mediumLengthMeters: number
  mediumSpeedMetersPerSecond: number
  phaseDifferenceDegrees: number
  probePositionMeters: number
}

export type DopplerEffectParameters = {
  amplitudePascals: number
  emittedFrequencyHertz: number
  mediumLengthMeters: number
  mediumSpeedMetersPerSecond: number
  observerPositionMeters: number
  observerSpeedMetersPerSecond: number
  sourceInitialPositionMeters: number
  sourceSpeedMetersPerSecond: number
}

export type ReflectionRefractionParameters = {
  incidentAngleDegrees: number
  incidentMediumIndex: number
  refractedMediumIndex: number
  rayBundleSpreadDegrees: number
}

export type OpticalElementKind =
  | 'concave-mirror'
  | 'converging-lens'
  | 'convex-mirror'
  | 'diverging-lens'

export type LensesMirrorsParameters = {
  elementKind: OpticalElementKind
  focalLengthMeters: number
  objectDistanceMeters: number
  objectHeightMeters: number
  rayApertureMeters: number
}

export type LightDiffractionInterferenceParameters = {
  detectorPositionMillimeters: number
  intensityScale: number
  screenDistanceMeters: number
  slitCount: number
  slitSeparationMicrometers: number
  slitWidthMicrometers: number
  wavelengthNanometers: number
}

export type WaveOnStringParameters = {
  amplitudeMeters: number
  frequencyHertz: number
  linearDensityKilogramsPerMeter: number
  phaseDegrees: number
  probePositionMeters: number
  speedModel: 'string-properties' | 'wavelength-frequency'
  stringLengthMeters: number
  tensionNewtons: number
  wavelengthMeters: number
}

export type LongitudinalWaveParameters = {
  amplitudeMeters: number
  frequencyHertz: number
  linearDensityKilogramsPerMeter: number
  longitudinalStiffnessNewtons: number
  phaseDegrees: number
  probePositionMeters: number
  springCoilTurns: number
  speedModel: 'spring-properties' | 'wavelength-frequency'
  springLengthMeters: number
  wavelengthMeters: number
}

export type SuperpositionInterferenceParameters = {
  amplitudeOneMeters: number
  amplitudeTwoMeters: number
  frequencyHertz: number
  phaseDifferenceDegrees: number
  probePositionMeters: number
  stringLengthMeters: number
  wavelengthMeters: number
}

export type StandingWavesParameters = {
  amplitudeMeters: number
  harmonicMode: number
  linearDensityKilogramsPerMeter: number
  phaseDegrees: number
  probePositionMeters: number
  stringLengthMeters: number
  tensionNewtons: number
}

export type SpacetimeLatticeBeamPlane = 'xy' | 'xz' | 'yz'

export type GravitationalFieldOrbitsParameters = {
  centralMassEarths: number
  eccentricity: number
  fabricDeformationScale: number
  fabricLineOpacity: number
  initialAngleDegrees: number
  lightBeamEnabled?: boolean
  lightBeamOffsetUCells?: number
  lightBeamOffsetVCells?: number
  lightBeamPlane?: SpacetimeLatticeBeamPlane
  lightBeamProgressPercent?: number
  orbitingBodyWellAmplification: number
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
  | BeatsParameters
  | CentripetalForceCurveParameters
  | CollisionsParameters
  | ContinuityBernoulliParameters
  | CoupledOscillatorsParameters
  | DampedOscillatorParameters
  | DopplerEffectParameters
  | ForcedOscillatorResonanceParameters
  | GravitationalFieldOrbitsParameters
  | HydrostaticsBuoyancyParameters
  | LensesMirrorsParameters
  | LightDiffractionInterferenceParameters
  | LongitudinalWaveParameters
  | MassSpringParameters
  | ParticleEquilibriumParameters
  | ProjectileMotionParameters
  | ReflectionRefractionParameters
  | RigidBodyRotationParameters
  | RollingWithoutSlippingParameters
  | StandingWavesParameters
  | SuperpositionInterferenceParameters
  | TorqueLeversCenterMassParameters
  | UniformCircularMotionParameters
  | UniformLinearMotionParameters
  | UniformlyAcceleratedMotionParameters
  | WaveOnStringParameters
  | WorkEnergyTrackParameters

export type WaveProfileSimulationId = Extract<
  KinematicsSimulationId,
  | 'beats'
  | 'doppler-effect'
  | 'longitudinal-wave'
  | 'standing-waves'
  | 'superposition-interference'
  | 'wave-on-string'
>

export type WaveProfileParameters =
  | BeatsParameters
  | DopplerEffectParameters
  | LongitudinalWaveParameters
  | StandingWavesParameters
  | SuperpositionInterferenceParameters
  | WaveOnStringParameters

export type MechanicalWaveProfilePoint = {
  componentOneMeters: number
  componentTwoMeters: number
  envelopeMeters: number
  xMeters: number
  zMeters: number
}

export type MechanicalWaveProfileDomain = {
  endMeters: number
  startMeters: number
}

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
  couplingPotentialEnergyJoules: number
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
  leftElasticPotentialEnergyJoules: number
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
  rightElasticPotentialEnergyJoules: number
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
  spacetimeCentralDeformation: number
  spacetimeCentralInfluenceScale: number
  spacetimeOrbitingDeformation: number
  spacetimeOrbitingInfluenceScale: number
  specificGravitationalPotentialJoulesPerKilogram: number
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
    | 'Hz'
    | '%'
    | 'deg'
    | 'kg m/s'
    | 'kg m^2/s'
    | 'm'
    | 'm/s'
    | 'm/s^2'
    | 'N'
    | 'N m'
    | 'N s'
    | 'Pa'
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
  'beats',
  'centripetal-force-curve',
  'collisions-1d-2d',
  'continuity-bernoulli',
  'coupled-oscillators',
  'damped-oscillator',
  'doppler-effect',
  'forced-oscillator-resonance',
  'gravitational-field-orbits',
  'gravitational-space-lattice',
  'hydrostatics-buoyancy',
  'lenses-mirrors',
  'light-diffraction-interference',
  'longitudinal-wave',
  'mass-spring',
  'particle-equilibrium',
  'rigid-body-rotation',
  'reflection-refraction',
  'rolling-without-slipping',
  'standing-waves',
  'superposition-interference',
  'torque-levers-center-mass',
  'uniform-linear-motion',
  'uniformly-accelerated-motion',
  'projectile-motion',
  'uniform-circular-motion',
  'wave-on-string',
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
  'couplingPotentialEnergyJoules',
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
  'leftElasticPotentialEnergyJoules',
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
  'rightElasticPotentialEnergyJoules',
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
  'spacetimeCentralDeformation',
  'spacetimeCentralInfluenceScale',
  'spacetimeOrbitingDeformation',
  'spacetimeOrbitingInfluenceScale',
  'specificGravitationalPotentialJoulesPerKilogram',
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

export function isGravitationalFieldSimulationId(
  simulationId: KinematicsSimulationId,
) {
  return (
    simulationId === 'gravitational-field-orbits' ||
    simulationId === 'gravitational-space-lattice'
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
    case 'coupled-oscillators': {
      const parameters: CoupledOscillatorsParameters = {
        couplingSpringConstantNewtonsPerMeter: readNumber(
          values,
          'couplingSpringConstantNewtonsPerMeter',
        ),
        dampingNewtonSecondsPerMeter: readNumberWithFallback(
          values,
          'dampingNewtonSecondsPerMeter',
          'dampingPerSecond',
          0,
        ),
        gravityMetersPerSecondSquared: readNumberWithFallback(
          values,
          'gravityMetersPerSecondSquared',
          undefined,
          9.81,
        ),
        initialDisplacementOneMeters: readNumber(
          values,
          'initialDisplacementOneMeters',
        ),
        initialDisplacementTwoMeters: readNumber(
          values,
          'initialDisplacementTwoMeters',
        ),
        initialVelocityOneMetersPerSecond: readNumber(
          values,
          'initialVelocityOneMetersPerSecond',
        ),
        initialVelocityTwoMetersPerSecond: readNumber(
          values,
          'initialVelocityTwoMetersPerSecond',
        ),
        massOneKilograms: readNumberWithFallback(
          values,
          'massOneKilograms',
          'massKilograms',
        ),
        massTwoKilograms: readNumberWithFallback(
          values,
          'massTwoKilograms',
          'massKilograms',
        ),
        springConstantOneNewtonsPerMeter: readNumberWithFallback(
          values,
          'springConstantOneNewtonsPerMeter',
          'springConstantNewtonsPerMeter',
        ),
        springConstantTwoNewtonsPerMeter: readNumberWithFallback(
          values,
          'springConstantTwoNewtonsPerMeter',
          'springConstantNewtonsPerMeter',
        ),
      }

      validateCoupledOscillatorsParameters(parameters)
      return parameters
    }
    case 'beats': {
      const parameters: BeatsParameters = {
        amplitudePascals: readNumber(values, 'amplitudePascals'),
        frequencyOneHertz: readNumber(values, 'frequencyOneHertz'),
        frequencyTwoHertz: readNumber(values, 'frequencyTwoHertz'),
        mediumLengthMeters: readNumber(values, 'mediumLengthMeters'),
        mediumSpeedMetersPerSecond: readNumber(
          values,
          'mediumSpeedMetersPerSecond',
        ),
        phaseDifferenceDegrees: readNumber(values, 'phaseDifferenceDegrees'),
        probePositionMeters: readNumber(values, 'probePositionMeters'),
      }

      validateBeatsParameters(parameters)
      return parameters
    }
    case 'doppler-effect': {
      const parameters: DopplerEffectParameters = {
        amplitudePascals: readNumber(values, 'amplitudePascals'),
        emittedFrequencyHertz: readNumber(values, 'emittedFrequencyHertz'),
        mediumLengthMeters: readNumber(values, 'mediumLengthMeters'),
        mediumSpeedMetersPerSecond: readNumber(
          values,
          'mediumSpeedMetersPerSecond',
        ),
        observerPositionMeters: readNumber(values, 'observerPositionMeters'),
        observerSpeedMetersPerSecond: readNumber(
          values,
          'observerSpeedMetersPerSecond',
        ),
        sourceInitialPositionMeters: readNumber(
          values,
          'sourceInitialPositionMeters',
        ),
        sourceSpeedMetersPerSecond: readNumber(
          values,
          'sourceSpeedMetersPerSecond',
        ),
      }

      validateDopplerEffectParameters(parameters)
      return parameters
    }
    case 'reflection-refraction': {
      const parameters: ReflectionRefractionParameters = {
        incidentAngleDegrees: readNumber(values, 'incidentAngleDegrees'),
        incidentMediumIndex: readNumber(values, 'incidentMediumIndex'),
        rayBundleSpreadDegrees: readNumber(values, 'rayBundleSpreadDegrees'),
        refractedMediumIndex: readNumber(values, 'refractedMediumIndex'),
      }

      validateReflectionRefractionParameters(parameters)
      return parameters
    }
    case 'lenses-mirrors': {
      const parameters: LensesMirrorsParameters = {
        elementKind: readOpticalElementKind(values),
        focalLengthMeters: readNumber(values, 'focalLengthMeters'),
        objectDistanceMeters: readNumber(values, 'objectDistanceMeters'),
        objectHeightMeters: readNumber(values, 'objectHeightMeters'),
        rayApertureMeters: readNumber(values, 'rayApertureMeters'),
      }

      validateLensesMirrorsParameters(parameters)
      return parameters
    }
    case 'light-diffraction-interference': {
      const parameters: LightDiffractionInterferenceParameters = {
        detectorPositionMillimeters: readNumber(
          values,
          'detectorPositionMillimeters',
        ),
        intensityScale: readNumber(values, 'intensityScale'),
        screenDistanceMeters: readNumber(values, 'screenDistanceMeters'),
        slitCount: readNumber(values, 'slitCount'),
        slitSeparationMicrometers: readNumber(
          values,
          'slitSeparationMicrometers',
        ),
        slitWidthMicrometers: readNumber(values, 'slitWidthMicrometers'),
        wavelengthNanometers: readNumber(values, 'wavelengthNanometers'),
      }

      validateLightDiffractionInterferenceParameters(parameters)
      return parameters
    }
    case 'wave-on-string': {
      const parameters: WaveOnStringParameters = {
        amplitudeMeters: readNumber(values, 'amplitudeMeters'),
        frequencyHertz: readNumber(values, 'frequencyHertz'),
        linearDensityKilogramsPerMeter: readNumber(
          values,
          'linearDensityKilogramsPerMeter',
        ),
        phaseDegrees: readNumber(values, 'phaseDegrees'),
        probePositionMeters: readNumber(values, 'probePositionMeters'),
        speedModel: readWaveOnStringSpeedModel(values),
        stringLengthMeters: readNumber(values, 'stringLengthMeters'),
        tensionNewtons: readNumber(values, 'tensionNewtons'),
        wavelengthMeters: readNumber(values, 'wavelengthMeters'),
      }

      validateWaveOnStringParameters(parameters)
      return parameters
    }
    case 'longitudinal-wave': {
      const parameters: LongitudinalWaveParameters = {
        amplitudeMeters: readNumber(values, 'amplitudeMeters'),
        frequencyHertz: readNumber(values, 'frequencyHertz'),
        linearDensityKilogramsPerMeter: readNumber(
          values,
          'linearDensityKilogramsPerMeter',
        ),
        longitudinalStiffnessNewtons: readNumber(
          values,
          'longitudinalStiffnessNewtons',
        ),
        phaseDegrees: readNumber(values, 'phaseDegrees'),
        probePositionMeters: readNumber(values, 'probePositionMeters'),
        springCoilTurns: readNumber(values, 'springCoilTurns'),
        speedModel: readLongitudinalWaveSpeedModel(values),
        springLengthMeters: readNumber(values, 'springLengthMeters'),
        wavelengthMeters: readNumber(values, 'wavelengthMeters'),
      }

      validateLongitudinalWaveParameters(parameters)
      return parameters
    }
    case 'superposition-interference': {
      const parameters: SuperpositionInterferenceParameters = {
        amplitudeOneMeters: readNumber(values, 'amplitudeOneMeters'),
        amplitudeTwoMeters: readNumber(values, 'amplitudeTwoMeters'),
        frequencyHertz: readNumber(values, 'frequencyHertz'),
        phaseDifferenceDegrees: readNumber(values, 'phaseDifferenceDegrees'),
        probePositionMeters: readNumber(values, 'probePositionMeters'),
        stringLengthMeters: readNumber(values, 'stringLengthMeters'),
        wavelengthMeters: readNumber(values, 'wavelengthMeters'),
      }

      validateSuperpositionInterferenceParameters(parameters)
      return parameters
    }
    case 'standing-waves': {
      const parameters: StandingWavesParameters = {
        amplitudeMeters: readNumber(values, 'amplitudeMeters'),
        harmonicMode: readNumber(values, 'harmonicMode'),
        linearDensityKilogramsPerMeter: readNumber(
          values,
          'linearDensityKilogramsPerMeter',
        ),
        phaseDegrees: readNumber(values, 'phaseDegrees'),
        probePositionMeters: readNumber(values, 'probePositionMeters'),
        stringLengthMeters: readNumber(values, 'stringLengthMeters'),
        tensionNewtons: readNumber(values, 'tensionNewtons'),
      }

      validateStandingWavesParameters(parameters)
      return parameters
    }
    case 'damped-oscillator': {
      const parameters: DampedOscillatorParameters = {
        dampingPerSecond: readNumber(values, 'dampingPerSecond'),
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

      validateDampedOscillatorParameters(parameters)
      return parameters
    }
    case 'forced-oscillator-resonance': {
      const parameters: ForcedOscillatorResonanceParameters = {
        dampingPerSecond: readNumber(values, 'dampingPerSecond'),
        driveAngularFrequencyRadiansPerSecond: readNumber(
          values,
          'driveAngularFrequencyRadiansPerSecond',
        ),
        driveForceNewtons: readNumber(values, 'driveForceNewtons'),
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

      validateForcedOscillatorResonanceParameters(parameters)
      return parameters
    }
    case 'gravitational-field-orbits':
    case 'gravitational-space-lattice': {
      const parameters: GravitationalFieldOrbitsParameters = {
        centralMassEarths: readNumber(values, 'centralMassEarths'),
        eccentricity: readNumber(values, 'eccentricity'),
        fabricDeformationScale: readNumber(
          values,
          'fabricDeformationScale',
        ),
        fabricLineOpacity: readNumber(values, 'fabricLineOpacity'),
        initialAngleDegrees: readNumber(values, 'initialAngleDegrees'),
        lightBeamEnabled: readBoolean(values, 'lightBeamEnabled', false),
        lightBeamOffsetUCells:
          readOptionalNumber(values, 'lightBeamOffsetUCells') ?? 0,
        lightBeamOffsetVCells:
          readOptionalNumber(values, 'lightBeamOffsetVCells') ?? 0,
        lightBeamPlane: readSpacetimeLatticeBeamPlane(values),
        lightBeamProgressPercent:
          readOptionalNumber(values, 'lightBeamProgressPercent') ?? 100,
        orbitingBodyWellAmplification: readNumber(
          values,
          'orbitingBodyWellAmplification',
        ),
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

  if (simulationId === 'forced-oscillator-resonance') {
    const result = computeForcedOscillatorSamples({
      durationSeconds,
      parameters: parameters as ForcedOscillatorResonanceParameters,
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

  if (simulationId === 'coupled-oscillators') {
    const result = computeCoupledOscillatorSamples({
      durationSeconds,
      parameters: parameters as CoupledOscillatorsParameters,
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
    case 'coupled-oscillators':
      return computeCoupledOscillatorSample(
        parameters as CoupledOscillatorsParameters,
        timeSeconds,
      )
    case 'beats':
      return computeBeatsSample(parameters as BeatsParameters, timeSeconds)
    case 'doppler-effect':
      return computeDopplerEffectSample(
        parameters as DopplerEffectParameters,
        timeSeconds,
      )
    case 'reflection-refraction':
      return computeReflectionRefractionSample(
        parameters as ReflectionRefractionParameters,
        timeSeconds,
      )
    case 'lenses-mirrors':
      return computeLensesMirrorsSample(
        parameters as LensesMirrorsParameters,
        timeSeconds,
      )
    case 'light-diffraction-interference':
      return computeLightDiffractionInterferenceSample(
        parameters as LightDiffractionInterferenceParameters,
        timeSeconds,
      )
    case 'longitudinal-wave':
      return computeLongitudinalWaveSample(
        parameters as LongitudinalWaveParameters,
        timeSeconds,
      )
    case 'wave-on-string':
      return computeWaveOnStringSample(
        parameters as WaveOnStringParameters,
        timeSeconds,
      )
    case 'superposition-interference':
      return computeSuperpositionInterferenceSample(
        parameters as SuperpositionInterferenceParameters,
        timeSeconds,
      )
    case 'standing-waves':
      return computeStandingWavesSample(
        parameters as StandingWavesParameters,
        timeSeconds,
      )
    case 'damped-oscillator':
      return computeDampedOscillatorSample(
        parameters as DampedOscillatorParameters,
        timeSeconds,
      )
    case 'forced-oscillator-resonance':
      return computeForcedOscillatorSample(
        parameters as ForcedOscillatorResonanceParameters,
        timeSeconds,
      )
    case 'gravitational-field-orbits':
    case 'gravitational-space-lattice':
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

  if (isGravitationalFieldSimulationId(simulationId)) {
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

  if (
    simulationId === 'damped-oscillator' ||
    simulationId === 'forced-oscillator-resonance'
  ) {
    const velocityDirection = Math.sign(sample.velocityMetersPerSecond)
    const accelerationDirection = Math.sign(
      sample.accelerationMetersPerSecondSquared,
    )
    const springDirection = Math.sign(sample.springForceNewtons)
    const dampingDirection = Math.sign(sample.frictionForceNewtons)
    const driveDirection = Math.sign(sample.appliedForceNewtons)
    const overlays: KinematicsVectorOverlay[] = [
      {
        direction: {
          x: 0,
          z: -velocityDirection,
        },
        id: 'velocity',
        label: 'Velocidade da massa',
        magnitude: sample.speedMetersPerSecond,
        unit: 'm/s',
      },
      {
        direction: {
          x: 0,
          z: -accelerationDirection,
        },
        id: 'acceleration',
        label: 'Aceleracao da massa',
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
          z: dampingDirection,
        },
        id: 'friction',
        label: 'Amortecimento',
        magnitude: Math.abs(sample.frictionForceNewtons),
        unit: 'N',
      },
    ]

    if (simulationId === 'forced-oscillator-resonance') {
      overlays.push({
        direction: {
          x: 0,
          z: -driveDirection,
        },
        id: 'appliedForce',
        label: 'Forca externa',
        magnitude: Math.abs(sample.appliedForceNewtons),
        unit: 'N',
      })
    }

    return overlays
  }

  if (simulationId === 'coupled-oscillators') {
    const primaryVelocityDirection = Math.sign(sample.velocityMetersPerSecond)
    const secondaryVelocityDirection = Math.sign(
      sample.secondaryVelocityMetersPerSecond,
    )
    const primaryForceDirection = Math.sign(sample.netForceNewtons)
    const secondaryForceDirection = Math.sign(sample.forceTwoNewtons)
    const primarySpringDirection = Math.sign(sample.springForceNewtons)
    const secondarySpringDirection = Math.sign(sample.forceThreeZNewtons)
    const couplingForceDirection = Math.sign(sample.tensionNewtons)

    return [
      {
        direction: {
          x: 0,
          z: -primaryVelocityDirection,
        },
        id: 'velocity',
        label: 'Velocidade da massa A',
        magnitude: sample.speedMetersPerSecond,
        unit: 'm/s',
      },
      {
        direction: {
          x: 0,
          z: -secondaryVelocityDirection,
        },
        id: 'secondaryVelocity',
        label: 'Velocidade da massa B',
        magnitude: Math.abs(sample.secondaryVelocityMetersPerSecond),
        unit: 'm/s',
      },
      {
        direction: {
          x: 0,
          z: primarySpringDirection,
        },
        id: 'forceOne',
        label: 'F mola A',
        magnitude: Math.abs(sample.springForceNewtons),
        unit: 'N',
      },
      {
        direction: {
          x: 0,
          z: secondarySpringDirection,
        },
        id: 'forceThree',
        label: 'F mola B',
        magnitude: Math.abs(sample.forceThreeZNewtons),
        unit: 'N',
      },
      {
        direction: {
          x: 0,
          z: couplingForceDirection,
        },
        id: 'tension',
        label: 'F acoplamento em A',
        magnitude: Math.abs(sample.tensionNewtons),
        unit: 'N',
      },
      {
        direction: {
          x: 0,
          z: -primaryForceDirection,
        },
        id: 'resultant',
        label: 'F resultante A',
        magnitude: Math.abs(sample.netForceNewtons),
        unit: 'N',
      },
      {
        direction: {
          x: 0,
          z: -secondaryForceDirection,
        },
        id: 'forceTwo',
        label: 'F resultante B',
        magnitude: Math.abs(sample.forceTwoNewtons),
        unit: 'N',
      },
    ]
  }

  if (simulationId === 'beats') {
    return [
      {
        direction: { x: 0, z: Math.sign(sample.pressurePascals) || 0 },
        id: 'displacement',
        label: 'Pressao resultante',
        magnitude: Math.abs(sample.pressurePascals),
        unit: 'Pa',
      },
      {
        direction: { x: 0, z: Math.sign(sample.secondaryZMeters) || 0 },
        id: 'forceOne',
        label: 'Tom A',
        magnitude: Math.abs(sample.secondaryZMeters),
        unit: 'Pa',
      },
      {
        direction: { x: 0, z: Math.sign(sample.displacementMeters) || 0 },
        id: 'forceTwo',
        label: 'Tom B',
        magnitude: Math.abs(sample.displacementMeters),
        unit: 'Pa',
      },
      {
        direction: { x: 1, z: 0 },
        id: 'secondaryVelocity',
        label: 'Velocidade do som',
        magnitude: sample.speedMetersPerSecond,
        unit: 'm/s',
      },
    ]
  }

  if (simulationId === 'doppler-effect') {
    return [
      {
        direction: { x: 0, z: Math.sign(sample.pressurePascals) || 0 },
        id: 'displacement',
        label: 'Pressao no observador',
        magnitude: Math.abs(sample.pressurePascals),
        unit: 'Pa',
      },
      {
        direction: {
          x: Math.sign(sample.secondaryVelocityXMetersPerSecond) || 0,
          z: 0,
        },
        id: 'forceOne',
        label: 'Velocidade da fonte',
        magnitude: Math.abs(sample.secondaryVelocityXMetersPerSecond),
        unit: 'm/s',
      },
      {
        direction: {
          x: Math.sign(sample.velocityXMetersPerSecond) || 0,
          z: 0,
        },
        id: 'forceTwo',
        label: 'Velocidade do observador',
        magnitude: Math.abs(sample.velocityXMetersPerSecond),
        unit: 'm/s',
      },
      {
        direction: { x: 1, z: 0 },
        id: 'secondaryVelocity',
        label: 'Velocidade do som',
        magnitude: sample.speedMetersPerSecond,
        unit: 'm/s',
      },
    ]
  }

  if (simulationId === 'reflection-refraction') {
    return [
      {
        direction: normalizeVector({
          x: sample.velocityXMetersPerSecond,
          z: sample.velocityZMetersPerSecond,
        }),
        id: 'velocity',
        label: 'Raio incidente',
        magnitude: Math.abs(sample.positionMeters),
        unit: 'deg',
      },
      {
        direction: normalizeVector({
          x: -sample.velocityXMetersPerSecond,
          z: sample.velocityZMetersPerSecond,
        }),
        id: 'forceOne',
        label: 'Raio refletido',
        magnitude: sample.forceTwoNewtons,
        unit: '%',
      },
      {
        direction: normalizeVector({
          x: sample.secondaryVelocityXMetersPerSecond,
          z: sample.secondaryVelocityZMetersPerSecond,
        }),
        id: 'forceTwo',
        label: 'Raio refratado',
        magnitude: sample.pressurePascals,
        unit: '%',
      },
    ]
  }

  if (simulationId === 'lenses-mirrors') {
    return [
      {
        direction: { x: 1, z: 0 },
        id: 'forceOne',
        label: 'Foco',
        magnitude: Math.abs(sample.primaryRadiusMeters),
        unit: 'm',
      },
      {
        direction: normalizeVector({
          x: sample.secondaryXMeters + sample.positionMeters,
          z: sample.secondaryZMeters - sample.zMeters,
        }),
        id: 'velocity',
        label: 'Raio principal',
        magnitude: Math.abs(sample.displacementMeters),
        unit: 'm',
      },
      {
        direction: { x: Math.sign(sample.secondaryXMeters) || 0, z: 0 },
        id: 'displacement',
        label: sample.isGrounded ? 'Imagem virtual' : 'Imagem real',
        magnitude: Math.abs(sample.secondaryXMeters),
        unit: 'm',
      },
    ]
  }

  if (simulationId === 'light-diffraction-interference') {
    return [
      {
        direction: { x: 1, z: 0 },
        id: 'secondaryVelocity',
        label: 'Distancia ate a tela',
        magnitude: sample.speedMetersPerSecond,
        unit: 'm',
      },
      {
        direction: { x: 0, z: Math.sign(sample.zMeters) || 0 },
        id: 'displacement',
        label: 'Detector',
        magnitude: Math.abs(sample.positionMeters),
        unit: 'm',
      },
      {
        direction: { x: 0, z: 1 },
        id: 'forceOne',
        label: 'Intensidade',
        magnitude: sample.pressurePascals * 100,
        unit: '%',
      },
    ]
  }

  if (simulationId === 'wave-on-string') {
    return [
      {
        direction: { x: 0, z: Math.sign(sample.positionMeters) || 0 },
        id: 'displacement',
        label: 'Deslocamento transversal',
        magnitude: Math.abs(sample.positionMeters),
        unit: 'm',
      },
      {
        direction: {
          x: 0,
          z: Math.sign(sample.velocityMetersPerSecond) || 0,
        },
        id: 'velocity',
        label: 'Velocidade transversal',
        magnitude: Math.abs(sample.velocityMetersPerSecond),
        unit: 'm/s',
      },
      {
        direction: {
          x: 0,
          z: Math.sign(sample.accelerationMetersPerSecondSquared) || 0,
        },
        id: 'acceleration',
        label: 'Aceleracao transversal',
        magnitude: Math.abs(sample.accelerationMetersPerSecondSquared),
        unit: 'm/s^2',
      },
      {
        direction: { x: Math.sign(sample.velocityXMetersPerSecond) || 1, z: 0 },
        id: 'secondaryVelocity',
        label: 'Velocidade de propagacao',
        magnitude: sample.speedMetersPerSecond,
        unit: 'm/s',
      },
    ]
  }

  if (simulationId === 'longitudinal-wave') {
    return [
      {
        direction: { x: Math.sign(sample.positionMeters) || 0, z: 0 },
        id: 'displacement',
        label: 'Deslocamento longitudinal',
        magnitude: Math.abs(sample.positionMeters),
        unit: 'm',
      },
      {
        direction: {
          x: Math.sign(sample.velocityMetersPerSecond) || 0,
          z: 0,
        },
        id: 'velocity',
        label: 'Velocidade do elo',
        magnitude: Math.abs(sample.velocityMetersPerSecond),
        unit: 'm/s',
      },
      {
        direction: {
          x: Math.sign(sample.accelerationMetersPerSecondSquared) || 0,
          z: 0,
        },
        id: 'acceleration',
        label: 'Aceleracao do elo',
        magnitude: Math.abs(sample.accelerationMetersPerSecondSquared),
        unit: 'm/s^2',
      },
      {
        direction: {
          x: Math.sign(sample.springForceNewtons) || 0,
          z: 0,
        },
        id: 'forceOne',
        label: 'Forca elastica local',
        magnitude: Math.abs(sample.springForceNewtons),
        unit: 'N',
      },
      {
        direction: { x: 1, z: 0 },
        id: 'secondaryVelocity',
        label: 'Velocidade de propagacao',
        magnitude: sample.speedMetersPerSecond,
        unit: 'm/s',
      },
    ]
  }

  if (simulationId === 'superposition-interference') {
    return [
      {
        direction: { x: 0, z: Math.sign(sample.positionMeters) || 0 },
        id: 'displacement',
        label: 'Soma das ondas',
        magnitude: Math.abs(sample.positionMeters),
        unit: 'm',
      },
      {
        direction: { x: 0, z: Math.sign(sample.secondaryZMeters) || 0 },
        id: 'forceOne',
        label: 'Onda A',
        magnitude: Math.abs(sample.secondaryZMeters),
        unit: 'm',
      },
      {
        direction: { x: 0, z: Math.sign(sample.displacementMeters) || 0 },
        id: 'forceTwo',
        label: 'Onda B',
        magnitude: Math.abs(sample.displacementMeters),
        unit: 'm',
      },
      {
        direction: {
          x: 0,
          z: Math.sign(sample.velocityMetersPerSecond) || 0,
        },
        id: 'velocity',
        label: 'Velocidade da soma',
        magnitude: Math.abs(sample.velocityMetersPerSecond),
        unit: 'm/s',
      },
    ]
  }

  if (simulationId === 'standing-waves') {
    return [
      {
        direction: { x: 0, z: Math.sign(sample.positionMeters) || 0 },
        id: 'displacement',
        label: 'Deslocamento no ventre/probe',
        magnitude: Math.abs(sample.positionMeters),
        unit: 'm',
      },
      {
        direction: {
          x: 0,
          z: Math.sign(sample.velocityMetersPerSecond) || 0,
        },
        id: 'velocity',
        label: 'Velocidade transversal',
        magnitude: Math.abs(sample.velocityMetersPerSecond),
        unit: 'm/s',
      },
      {
        direction: {
          x: 0,
          z: Math.sign(sample.accelerationMetersPerSecondSquared) || 0,
        },
        id: 'acceleration',
        label: 'Aceleracao transversal',
        magnitude: Math.abs(sample.accelerationMetersPerSecondSquared),
        unit: 'm/s^2',
      },
      {
        direction: { x: 0, z: Math.sign(sample.secondaryZMeters) || 1 },
        id: 'tension',
        label: 'Envelope modal',
        magnitude: Math.abs(sample.secondaryZMeters),
        unit: 'm',
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
  const specificGravitationalPotentialJoulesPerKilogram =
    -gravitationalParameter / orbitalRadiusMeters
  const spacetimeCentralDeformation =
    parameters.fabricDeformationScale *
    Math.cbrt(parameters.centralMassEarths)
  const spacetimeCentralInfluenceScale = Math.cbrt(
    parameters.centralMassEarths,
  )
  const spacetimeOrbitingDeformation =
    parameters.fabricDeformationScale *
    parameters.orbitingBodyWellAmplification *
    Math.cbrt(parameters.satelliteMassKilograms / 900)
  const spacetimeOrbitingInfluenceScale = Math.cbrt(
    parameters.satelliteMassKilograms / 900,
  )
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
    gravitationalPotentialEnergyJoules: potentialEnergyJoules,
    kineticEnergyJoules,
    netForceNewtons:
      parameters.satelliteMassKilograms *
      gravitationalFieldNewtonsPerKilogram,
    objectMassKilograms: parameters.satelliteMassKilograms,
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
    spacetimeCentralDeformation,
    spacetimeCentralInfluenceScale,
    spacetimeOrbitingDeformation,
    spacetimeOrbitingInfluenceScale,
    specificGravitationalPotentialJoulesPerKilogram,
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

function computeDampedOscillatorSample(
  parameters: DampedOscillatorParameters,
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
  const initialMechanicalEnergyJoules =
    0.5 *
      parameters.massKilograms *
      parameters.initialVelocityMetersPerSecond ** 2 +
    0.5 *
      parameters.springConstantNewtonsPerMeter *
      parameters.initialDisplacementMeters ** 2

  return buildSingleOscillatorSample({
    appliedWorkJoules: 0,
    dampingPerSecond: parameters.dampingPerSecond,
    displacementMeters: motion.displacementMeters,
    driveForceNewtons: 0,
    massKilograms: parameters.massKilograms,
    naturalAngularFrequency,
    springConstantNewtonsPerMeter: parameters.springConstantNewtonsPerMeter,
    thermalEnergyJoules: Math.max(
      0,
      initialMechanicalEnergyJoules -
        readSingleOscillatorMechanicalEnergy({
          displacementMeters: motion.displacementMeters,
          massKilograms: parameters.massKilograms,
          springConstantNewtonsPerMeter:
            parameters.springConstantNewtonsPerMeter,
          velocityMetersPerSecond: motion.velocityMetersPerSecond,
        }),
    ),
    timeSeconds,
    velocityMetersPerSecond: motion.velocityMetersPerSecond,
  })
}

function computeForcedOscillatorSample(
  parameters: ForcedOscillatorResonanceParameters,
  timeSeconds: number,
): KinematicsSample {
  const result = computeForcedOscillatorSamples({
    durationSeconds: timeSeconds,
    parameters,
    sampleRateHz: 240,
  })
  const sample = result.samples.at(-1)

  if (!sample) {
    throw new Error('Forced oscillator sample could not be computed.')
  }

  return sample
}

function computeCoupledOscillatorSample(
  parameters: CoupledOscillatorsParameters,
  timeSeconds: number,
): KinematicsSample {
  const result = computeCoupledOscillatorSamples({
    durationSeconds: timeSeconds,
    parameters,
    sampleRateHz: 240,
  })
  const sample = result.samples.at(-1)

  if (!sample) {
    throw new Error('Coupled oscillator sample could not be computed.')
  }

  return sample
}

type ForcedOscillatorState = {
  displacementMeters: number
  thermalEnergyJoules: number
  velocityMetersPerSecond: number
  workJoules: number
}

function computeForcedOscillatorSamples({
  durationSeconds,
  parameters,
  sampleRateHz,
}: {
  durationSeconds: number
  parameters: ForcedOscillatorResonanceParameters
  sampleRateHz: number
}) {
  const sampleIntervalSeconds = 1 / sampleRateHz
  const sampleCount = Math.floor(durationSeconds * sampleRateHz) + 1
  const naturalAngularFrequency =
    Math.sqrt(parameters.springConstantNewtonsPerMeter / parameters.massKilograms)
  const samples: KinematicsSample[] = []
  let state: ForcedOscillatorState = {
    displacementMeters: parameters.initialDisplacementMeters,
    thermalEnergyJoules: 0,
    velocityMetersPerSecond: parameters.initialVelocityMetersPerSecond,
    workJoules: 0,
  }
  let timeSeconds = 0

  for (let index = 0; index < sampleCount; index += 1) {
    samples.push(
      buildSingleOscillatorSample({
        appliedWorkJoules: state.workJoules,
        dampingPerSecond: parameters.dampingPerSecond,
        displacementMeters: state.displacementMeters,
        driveForceNewtons: readForcedOscillatorDriveForce(
          parameters,
          timeSeconds,
        ),
        massKilograms: parameters.massKilograms,
        naturalAngularFrequency,
        springConstantNewtonsPerMeter:
          parameters.springConstantNewtonsPerMeter,
        thermalEnergyJoules: state.thermalEnergyJoules,
        timeSeconds,
        velocityMetersPerSecond: state.velocityMetersPerSecond,
      }),
    )

    if (index < sampleCount - 1) {
      state = advanceForcedOscillatorState(
        state,
        timeSeconds,
        sampleIntervalSeconds,
        parameters,
      )
      timeSeconds += sampleIntervalSeconds
    }
  }

  return { samples }
}

function advanceForcedOscillatorState(
  state: ForcedOscillatorState,
  timeSeconds: number,
  stepSeconds: number,
  parameters: ForcedOscillatorResonanceParameters,
): ForcedOscillatorState {
  const derivative = (
    localState: ForcedOscillatorState,
    localTimeSeconds: number,
  ) => {
    const driveForceNewtons = readForcedOscillatorDriveForce(
      parameters,
      localTimeSeconds,
    )
    const accelerationMetersPerSecondSquared =
      (driveForceNewtons -
        parameters.springConstantNewtonsPerMeter *
          localState.displacementMeters -
        parameters.massKilograms *
          parameters.dampingPerSecond *
          localState.velocityMetersPerSecond) /
      parameters.massKilograms

    return {
      displacementMeters: localState.velocityMetersPerSecond,
      thermalEnergyJoules:
        parameters.massKilograms *
        parameters.dampingPerSecond *
        localState.velocityMetersPerSecond ** 2,
      velocityMetersPerSecond: accelerationMetersPerSecondSquared,
      workJoules: driveForceNewtons * localState.velocityMetersPerSecond,
    }
  }
  const addScaled = (
    localState: ForcedOscillatorState,
    delta: ForcedOscillatorState,
    scale: number,
  ): ForcedOscillatorState => ({
    displacementMeters:
      localState.displacementMeters + delta.displacementMeters * scale,
    thermalEnergyJoules:
      localState.thermalEnergyJoules + delta.thermalEnergyJoules * scale,
    velocityMetersPerSecond:
      localState.velocityMetersPerSecond +
      delta.velocityMetersPerSecond * scale,
    workJoules: localState.workJoules + delta.workJoules * scale,
  })
  const k1 = derivative(state, timeSeconds)
  const k2 = derivative(addScaled(state, k1, stepSeconds / 2), timeSeconds + stepSeconds / 2)
  const k3 = derivative(addScaled(state, k2, stepSeconds / 2), timeSeconds + stepSeconds / 2)
  const k4 = derivative(addScaled(state, k3, stepSeconds), timeSeconds + stepSeconds)

  return {
    displacementMeters:
      state.displacementMeters +
      (stepSeconds / 6) *
        (k1.displacementMeters +
          2 * k2.displacementMeters +
          2 * k3.displacementMeters +
          k4.displacementMeters),
    thermalEnergyJoules:
      state.thermalEnergyJoules +
      (stepSeconds / 6) *
        (k1.thermalEnergyJoules +
          2 * k2.thermalEnergyJoules +
          2 * k3.thermalEnergyJoules +
          k4.thermalEnergyJoules),
    velocityMetersPerSecond:
      state.velocityMetersPerSecond +
      (stepSeconds / 6) *
        (k1.velocityMetersPerSecond +
          2 * k2.velocityMetersPerSecond +
          2 * k3.velocityMetersPerSecond +
          k4.velocityMetersPerSecond),
    workJoules:
      state.workJoules +
      (stepSeconds / 6) *
        (k1.workJoules + 2 * k2.workJoules + 2 * k3.workJoules + k4.workJoules),
  }
}

function readForcedOscillatorDriveForce(
  parameters: ForcedOscillatorResonanceParameters,
  timeSeconds: number,
) {
  return (
    parameters.driveForceNewtons *
    Math.cos(parameters.driveAngularFrequencyRadiansPerSecond * timeSeconds)
  )
}

function buildSingleOscillatorSample({
  appliedWorkJoules,
  dampingPerSecond,
  displacementMeters,
  driveForceNewtons,
  massKilograms,
  naturalAngularFrequency,
  springConstantNewtonsPerMeter,
  thermalEnergyJoules,
  timeSeconds,
  velocityMetersPerSecond,
}: {
  appliedWorkJoules: number
  dampingPerSecond: number
  displacementMeters: number
  driveForceNewtons: number
  massKilograms: number
  naturalAngularFrequency: number
  springConstantNewtonsPerMeter: number
  thermalEnergyJoules: number
  timeSeconds: number
  velocityMetersPerSecond: number
}) {
  const springForceNewtons =
    springConstantNewtonsPerMeter * displacementMeters
  const frictionForceNewtons =
    massKilograms * dampingPerSecond * velocityMetersPerSecond
  const netForceNewtons =
    driveForceNewtons - springForceNewtons - frictionForceNewtons
  const accelerationMetersPerSecondSquared = netForceNewtons / massKilograms
  const kineticEnergyJoules =
    0.5 * massKilograms * velocityMetersPerSecond ** 2
  const potentialEnergyJoules =
    0.5 * springConstantNewtonsPerMeter * displacementMeters ** 2
  const mechanicalEnergyJoules = kineticEnergyJoules + potentialEnergyJoules
  const criticalDampingPerSecond = 2 * naturalAngularFrequency
  const dampedFrequency =
    dampingPerSecond < criticalDampingPerSecond
      ? Math.sqrt(
          naturalAngularFrequency ** 2 - (dampingPerSecond / 2) ** 2,
        )
      : 0
  const periodSeconds =
    dampedFrequency > 0 ? (2 * Math.PI) / dampedFrequency : 0

  return buildSample({
    accelerationMetersPerSecondSquared,
    accelerationZMetersPerSecondSquared:
      -accelerationMetersPerSecondSquared,
    appliedForceNewtons: driveForceNewtons,
    appliedForceZNewtons: -driveForceNewtons,
    appliedWorkJoules,
    displacementMeters,
    elasticPotentialEnergyJoules: potentialEnergyJoules,
    frequencyHertz: periodSeconds > 0 ? 1 / periodSeconds : 0,
    frictionForceNewtons,
    kineticEnergyJoules,
    netForceNewtons,
    periodSeconds,
    positionMeters: displacementMeters,
    potentialEnergyJoules,
    primaryRadiusMeters: massSpringVisualNaturalLengthMeters,
    speedMetersPerSecond: Math.abs(velocityMetersPerSecond),
    springForceNewtons,
    tensionNewtons: Math.abs(springForceNewtons),
    thermalEnergyJoules,
    timeSeconds,
    totalEnergyJoules: mechanicalEnergyJoules + thermalEnergyJoules,
    velocityMetersPerSecond,
    velocityZMetersPerSecond: -velocityMetersPerSecond,
    xMeters: 0,
    zMeters: -displacementMeters,
  })
}

function readSingleOscillatorMechanicalEnergy({
  displacementMeters,
  massKilograms,
  springConstantNewtonsPerMeter,
  velocityMetersPerSecond,
}: {
  displacementMeters: number
  massKilograms: number
  springConstantNewtonsPerMeter: number
  velocityMetersPerSecond: number
}) {
  return (
    0.5 * massKilograms * velocityMetersPerSecond ** 2 +
    0.5 * springConstantNewtonsPerMeter * displacementMeters ** 2
  )
}

type CoupledOscillatorState = {
  displacementOneMeters: number
  displacementTwoMeters: number
  thermalEnergyJoules: number
  velocityOneMetersPerSecond: number
  velocityTwoMetersPerSecond: number
}

function computeCoupledOscillatorSamples({
  durationSeconds,
  parameters,
  sampleRateHz,
}: {
  durationSeconds: number
  parameters: CoupledOscillatorsParameters
  sampleRateHz: number
}) {
  const sampleIntervalSeconds = 1 / sampleRateHz
  const sampleCount = Math.floor(durationSeconds * sampleRateHz) + 1
  const samples: KinematicsSample[] = []
  let state: CoupledOscillatorState = {
    displacementOneMeters: parameters.initialDisplacementOneMeters,
    displacementTwoMeters: parameters.initialDisplacementTwoMeters,
    thermalEnergyJoules: 0,
    velocityOneMetersPerSecond: parameters.initialVelocityOneMetersPerSecond,
    velocityTwoMetersPerSecond: parameters.initialVelocityTwoMetersPerSecond,
  }
  let timeSeconds = 0

  for (let index = 0; index < sampleCount; index += 1) {
    samples.push(buildCoupledOscillatorSample(parameters, state, timeSeconds))

    if (index < sampleCount - 1) {
      state = advanceCoupledOscillatorState(
        state,
        sampleIntervalSeconds,
        parameters,
      )
      timeSeconds += sampleIntervalSeconds
    }
  }

  return { samples }
}

function advanceCoupledOscillatorState(
  state: CoupledOscillatorState,
  stepSeconds: number,
  parameters: CoupledOscillatorsParameters,
): CoupledOscillatorState {
  const derivative = (localState: CoupledOscillatorState) => {
    const dampingForceOneNewtons =
      -parameters.dampingNewtonSecondsPerMeter *
      localState.velocityOneMetersPerSecond
    const dampingForceTwoNewtons =
      -parameters.dampingNewtonSecondsPerMeter *
      localState.velocityTwoMetersPerSecond
    const forceOneNewtons =
      -parameters.springConstantOneNewtonsPerMeter *
        localState.displacementOneMeters -
      parameters.couplingSpringConstantNewtonsPerMeter *
        (localState.displacementOneMeters - localState.displacementTwoMeters) +
      dampingForceOneNewtons
    const forceTwoNewtons =
      -parameters.springConstantTwoNewtonsPerMeter *
        localState.displacementTwoMeters -
      parameters.couplingSpringConstantNewtonsPerMeter *
        (localState.displacementTwoMeters - localState.displacementOneMeters) +
      dampingForceTwoNewtons

    return {
      displacementOneMeters: localState.velocityOneMetersPerSecond,
      displacementTwoMeters: localState.velocityTwoMetersPerSecond,
      thermalEnergyJoules:
        parameters.dampingNewtonSecondsPerMeter *
        (localState.velocityOneMetersPerSecond ** 2 +
          localState.velocityTwoMetersPerSecond ** 2),
      velocityOneMetersPerSecond: forceOneNewtons / parameters.massOneKilograms,
      velocityTwoMetersPerSecond: forceTwoNewtons / parameters.massTwoKilograms,
    }
  }
  const addScaled = (
    localState: CoupledOscillatorState,
    delta: CoupledOscillatorState,
    scale: number,
  ): CoupledOscillatorState => ({
    displacementOneMeters:
      localState.displacementOneMeters + delta.displacementOneMeters * scale,
    displacementTwoMeters:
      localState.displacementTwoMeters + delta.displacementTwoMeters * scale,
    thermalEnergyJoules:
      localState.thermalEnergyJoules + delta.thermalEnergyJoules * scale,
    velocityOneMetersPerSecond:
      localState.velocityOneMetersPerSecond +
      delta.velocityOneMetersPerSecond * scale,
    velocityTwoMetersPerSecond:
      localState.velocityTwoMetersPerSecond +
      delta.velocityTwoMetersPerSecond * scale,
  })
  const k1 = derivative(state)
  const k2 = derivative(addScaled(state, k1, stepSeconds / 2))
  const k3 = derivative(addScaled(state, k2, stepSeconds / 2))
  const k4 = derivative(addScaled(state, k3, stepSeconds))

  return {
    displacementOneMeters:
      state.displacementOneMeters +
      (stepSeconds / 6) *
        (k1.displacementOneMeters +
          2 * k2.displacementOneMeters +
          2 * k3.displacementOneMeters +
          k4.displacementOneMeters),
    displacementTwoMeters:
      state.displacementTwoMeters +
      (stepSeconds / 6) *
        (k1.displacementTwoMeters +
          2 * k2.displacementTwoMeters +
          2 * k3.displacementTwoMeters +
          k4.displacementTwoMeters),
    thermalEnergyJoules:
      state.thermalEnergyJoules +
      (stepSeconds / 6) *
        (k1.thermalEnergyJoules +
          2 * k2.thermalEnergyJoules +
          2 * k3.thermalEnergyJoules +
          k4.thermalEnergyJoules),
    velocityOneMetersPerSecond:
      state.velocityOneMetersPerSecond +
      (stepSeconds / 6) *
        (k1.velocityOneMetersPerSecond +
          2 * k2.velocityOneMetersPerSecond +
          2 * k3.velocityOneMetersPerSecond +
          k4.velocityOneMetersPerSecond),
    velocityTwoMetersPerSecond:
      state.velocityTwoMetersPerSecond +
      (stepSeconds / 6) *
        (k1.velocityTwoMetersPerSecond +
          2 * k2.velocityTwoMetersPerSecond +
          2 * k3.velocityTwoMetersPerSecond +
          k4.velocityTwoMetersPerSecond),
  }
}

function buildCoupledOscillatorSample(
  parameters: CoupledOscillatorsParameters,
  state: CoupledOscillatorState,
  timeSeconds: number,
) {
  const couplingStretchMeters =
    state.displacementOneMeters - state.displacementTwoMeters
  const primarySpringForceNewtons =
    -parameters.springConstantOneNewtonsPerMeter *
    state.displacementOneMeters
  const primaryDampingForceNewtons =
    -parameters.dampingNewtonSecondsPerMeter *
    state.velocityOneMetersPerSecond
  const couplingForceOnPrimaryNewtons =
    -parameters.couplingSpringConstantNewtonsPerMeter * couplingStretchMeters
  const primaryNetForceNewtons =
    primarySpringForceNewtons +
    couplingForceOnPrimaryNewtons +
    primaryDampingForceNewtons
  const secondarySpringForceNewtons =
    -parameters.springConstantTwoNewtonsPerMeter *
    state.displacementTwoMeters
  const secondaryDampingForceNewtons =
    -parameters.dampingNewtonSecondsPerMeter *
    state.velocityTwoMetersPerSecond
  const couplingForceOnSecondaryNewtons =
    parameters.couplingSpringConstantNewtonsPerMeter * couplingStretchMeters
  const secondaryNetForceNewtons =
    secondarySpringForceNewtons +
    couplingForceOnSecondaryNewtons +
    secondaryDampingForceNewtons
  const leftKineticEnergyJoules =
    0.5 *
    parameters.massOneKilograms *
    state.velocityOneMetersPerSecond ** 2
  const rightKineticEnergyJoules =
    0.5 *
    parameters.massTwoKilograms *
    state.velocityTwoMetersPerSecond ** 2
  const kineticEnergyJoules = leftKineticEnergyJoules + rightKineticEnergyJoules
  const leftElasticPotentialEnergyJoules =
    0.5 *
    parameters.springConstantOneNewtonsPerMeter *
    state.displacementOneMeters ** 2
  const rightElasticPotentialEnergyJoules =
    0.5 *
    parameters.springConstantTwoNewtonsPerMeter *
    state.displacementTwoMeters ** 2
  const couplingPotentialEnergyJoules =
    0.5 *
    parameters.couplingSpringConstantNewtonsPerMeter *
    couplingStretchMeters ** 2
  const potentialEnergyJoules =
    leftElasticPotentialEnergyJoules +
    rightElasticPotentialEnergyJoules +
    couplingPotentialEnergyJoules
  const inPhaseAngularFrequency = Math.sqrt(
    ((parameters.springConstantOneNewtonsPerMeter /
      parameters.massOneKilograms) +
      (parameters.springConstantTwoNewtonsPerMeter /
        parameters.massTwoKilograms)) /
      2,
  )
  const outOfPhaseAngularFrequency = Math.sqrt(
    (((parameters.springConstantOneNewtonsPerMeter +
      2 * parameters.couplingSpringConstantNewtonsPerMeter) /
      parameters.massOneKilograms) +
      ((parameters.springConstantTwoNewtonsPerMeter +
        2 * parameters.couplingSpringConstantNewtonsPerMeter) /
        parameters.massTwoKilograms)) /
      2,
  )
  const weightOneNewtons =
    parameters.massOneKilograms * parameters.gravityMetersPerSecondSquared
  const mechanicalEnergyJoules = kineticEnergyJoules + potentialEnergyJoules

  return buildSample({
    accelerationMetersPerSecondSquared:
      primaryNetForceNewtons / parameters.massOneKilograms,
    accelerationZMetersPerSecondSquared:
      -primaryNetForceNewtons / parameters.massOneKilograms,
    couplingPotentialEnergyJoules,
    centerOfMassMeters:
      (parameters.massOneKilograms * state.displacementOneMeters +
        parameters.massTwoKilograms * state.displacementTwoMeters) /
      (parameters.massOneKilograms + parameters.massTwoKilograms),
    displacementMeters: couplingStretchMeters,
    elasticPotentialEnergyJoules: potentialEnergyJoules,
    forceOneNewtons: Math.abs(primarySpringForceNewtons),
    forceOneZNewtons: -primarySpringForceNewtons,
    forceThreeNewtons: Math.abs(secondarySpringForceNewtons),
    forceThreeZNewtons: -secondarySpringForceNewtons,
    forceTwoNewtons: secondaryNetForceNewtons,
    forceTwoZNewtons: -secondaryNetForceNewtons,
    frictionForceNewtons: -primaryDampingForceNewtons,
    frequencyHertz: outOfPhaseAngularFrequency / (2 * Math.PI),
    kineticEnergyJoules,
    leftElasticPotentialEnergyJoules,
    leftKineticEnergyJoules,
    netForceNewtons: primaryNetForceNewtons,
    periodSeconds: (2 * Math.PI) / inPhaseAngularFrequency,
    positionMeters: state.displacementOneMeters,
    potentialEnergyJoules,
    primaryRadiusMeters: massSpringVisualNaturalLengthMeters,
    rightElasticPotentialEnergyJoules,
    rightKineticEnergyJoules,
    secondarySpeedMetersPerSecond: Math.abs(
      state.velocityTwoMetersPerSecond,
    ),
    secondaryVelocityMetersPerSecond: state.velocityTwoMetersPerSecond,
    secondaryVelocityZMetersPerSecond:
      -state.velocityTwoMetersPerSecond,
    secondaryXMeters: 1.45,
    secondaryZMeters: -state.displacementTwoMeters,
    speedMetersPerSecond: Math.abs(state.velocityOneMetersPerSecond),
    springForceNewtons: -primarySpringForceNewtons,
    tensionNewtons: -couplingForceOnPrimaryNewtons,
    thermalEnergyJoules: state.thermalEnergyJoules,
    timeSeconds,
    totalEnergyJoules: mechanicalEnergyJoules,
    velocityMetersPerSecond: state.velocityOneMetersPerSecond,
    velocityZMetersPerSecond: -state.velocityOneMetersPerSecond,
    weightNewtons: weightOneNewtons,
    xMeters: -1.45,
    zMeters: -state.displacementOneMeters,
  })
}

export function computeMechanicalWaveProfile(
  simulationId: WaveProfileSimulationId,
  parameters: WaveProfileParameters,
  timeSeconds: number,
  pointCount = 128,
  profileDomain?: MechanicalWaveProfileDomain,
): MechanicalWaveProfilePoint[] {
  if (!Number.isFinite(timeSeconds) || timeSeconds < 0) {
    throw new Error('timeSeconds must be a finite non-negative number.')
  }

  const resolvedProfileDomain = resolveMechanicalWaveProfileDomain(
    parameters,
    profileDomain,
  )
  const safePointCount = Math.max(2, Math.floor(pointCount))

  return Array.from({ length: safePointCount }, (_, index) => {
    const ratio = index / (safePointCount - 1)
    const xOnStringMeters =
      resolvedProfileDomain.startMeters +
      (resolvedProfileDomain.endMeters - resolvedProfileDomain.startMeters) *
        ratio

    return computeMechanicalWavePoint(
      simulationId,
      parameters,
      xOnStringMeters,
      timeSeconds,
    )
  })
}

function computeBeatsSample(
  parameters: BeatsParameters,
  timeSeconds: number,
): KinematicsSample {
  const point = computeMechanicalWavePoint(
    'beats',
    parameters,
    parameters.probePositionMeters,
    timeSeconds,
  )
  const angularFrequencyOne = 2 * Math.PI * parameters.frequencyOneHertz
  const angularFrequencyTwo = 2 * Math.PI * parameters.frequencyTwoHertz
  const componentVelocities = computeBeatsComponentPressureRates(
    parameters,
    parameters.probePositionMeters,
    timeSeconds,
  )
  const pressureRatePascalsPerSecond =
    componentVelocities.componentOnePressureRate +
    componentVelocities.componentTwoPressureRate
  const beatFrequencyHertz = Math.abs(
    parameters.frequencyTwoHertz - parameters.frequencyOneHertz,
  )
  const carrierFrequencyHertz =
    (parameters.frequencyOneHertz + parameters.frequencyTwoHertz) / 2
  const carrierWavelengthMeters =
    carrierFrequencyHertz > 0
      ? parameters.mediumSpeedMetersPerSecond / carrierFrequencyHertz
      : 0

  return buildSample({
    accelerationMetersPerSecondSquared:
      -(Math.max(angularFrequencyOne, angularFrequencyTwo) ** 2) *
      point.zMeters,
    accelerationZMetersPerSecondSquared:
      -(Math.max(angularFrequencyOne, angularFrequencyTwo) ** 2) *
      point.zMeters,
    angleRadians:
      angularFrequencyOne * timeSeconds +
      degreesToRadians(parameters.phaseDifferenceDegrees),
    angularVelocityRadiansPerSecond:
      2 * Math.PI * carrierFrequencyHertz,
    centerOfMassMeters: point.envelopeMeters,
    displacementMeters: point.componentTwoMeters,
    frequencyHertz: beatFrequencyHertz,
    periodSeconds: beatFrequencyHertz > 0 ? 1 / beatFrequencyHertz : 0,
    positionMeters: point.zMeters,
    pressurePascals: point.zMeters,
    primaryRadiusMeters: parameters.amplitudePascals,
    secondaryPressurePascals: point.envelopeMeters,
    secondaryRadiusMeters: carrierWavelengthMeters,
    secondarySpeedMetersPerSecond: carrierFrequencyHertz,
    secondaryVelocityMetersPerSecond:
      componentVelocities.componentTwoPressureRate,
    secondaryVelocityZMetersPerSecond:
      componentVelocities.componentTwoPressureRate,
    secondaryZMeters: point.componentOneMeters,
    speedMetersPerSecond: parameters.mediumSpeedMetersPerSecond,
    timeSeconds,
    velocityMetersPerSecond: pressureRatePascalsPerSecond,
    velocityXMetersPerSecond: parameters.mediumSpeedMetersPerSecond,
    velocityZMetersPerSecond: pressureRatePascalsPerSecond,
    xMeters: point.xMeters,
    zMeters: point.zMeters,
  })
}

function computeDopplerEffectSample(
  parameters: DopplerEffectParameters,
  timeSeconds: number,
): KinematicsSample {
  const sourcePositionMeters = readDopplerSourcePositionMeters(
    parameters,
    timeSeconds,
  )
  const sourceCenteredMeters =
    sourcePositionMeters - parameters.mediumLengthMeters / 2
  const observerPositionMeters =
    parameters.observerPositionMeters +
    parameters.observerSpeedMetersPerSecond * timeSeconds
  const observerCenteredMeters =
    observerPositionMeters - parameters.mediumLengthMeters / 2
  const point = computeMechanicalWavePoint(
    'doppler-effect',
    parameters,
    clamp(observerPositionMeters, 0, parameters.mediumLengthMeters),
    timeSeconds,
  )
  const observedFrequencyHertz = computeDopplerObservedFrequency(
    parameters,
    sourcePositionMeters,
    observerPositionMeters,
  )
  const emittedWavelengthMeters =
    parameters.emittedFrequencyHertz > 0
      ? parameters.mediumSpeedMetersPerSecond / parameters.emittedFrequencyHertz
      : 0
  const wavelengthTowardObserverMeters =
    computeDopplerWavelengthForPoint(
      parameters,
      observerPositionMeters,
      sourcePositionMeters,
    )

  return buildSample({
    angleRadians: 2 * Math.PI * observedFrequencyHertz * timeSeconds,
    angularVelocityRadiansPerSecond: 2 * Math.PI * observedFrequencyHertz,
    displacementMeters: observerPositionMeters - sourcePositionMeters,
    frequencyHertz: observedFrequencyHertz,
    gripRatio:
      Math.abs(parameters.sourceSpeedMetersPerSecond) /
      parameters.mediumSpeedMetersPerSecond,
    periodSeconds:
      observedFrequencyHertz > 0 ? 1 / observedFrequencyHertz : 0,
    positionMeters: point.zMeters,
    pressurePascals: point.zMeters,
    primaryRadiusMeters: parameters.amplitudePascals,
    secondaryRadiusMeters: wavelengthTowardObserverMeters,
    secondarySpeedMetersPerSecond: parameters.emittedFrequencyHertz,
    secondaryVelocityMetersPerSecond:
      parameters.sourceSpeedMetersPerSecond,
    secondaryVelocityXMetersPerSecond:
      parameters.sourceSpeedMetersPerSecond,
    secondaryXMeters: sourceCenteredMeters,
    secondaryZMeters: 0,
    speedMetersPerSecond: parameters.mediumSpeedMetersPerSecond,
    timeSeconds,
    velocityMetersPerSecond: parameters.observerSpeedMetersPerSecond,
    velocityXMetersPerSecond: parameters.observerSpeedMetersPerSecond,
    xMeters: observerCenteredMeters,
    zMeters: point.zMeters,
    forceOneNewtons: emittedWavelengthMeters,
  })
}

function computeReflectionRefractionSample(
  parameters: ReflectionRefractionParameters,
  timeSeconds: number,
): KinematicsSample {
  const incidentAngleRadians = degreesToRadians(parameters.incidentAngleDegrees)
  const snellRatio =
    parameters.incidentMediumIndex / parameters.refractedMediumIndex
  const refractedSine = snellRatio * Math.sin(incidentAngleRadians)
  const totalInternalReflection =
    parameters.incidentMediumIndex > parameters.refractedMediumIndex &&
    Math.abs(refractedSine) > 1
  const refractedAngleRadians = totalInternalReflection
    ? Math.PI / 2
    : Math.asin(clamp(refractedSine, -1, 1))
  const criticalAngleRadians =
    parameters.incidentMediumIndex > parameters.refractedMediumIndex
      ? Math.asin(
          clamp(
            parameters.refractedMediumIndex / parameters.incidentMediumIndex,
            -1,
            1,
          ),
        )
      : 0
  const reflectance = computeSchlickReflectance(
    parameters.incidentMediumIndex,
    parameters.refractedMediumIndex,
    incidentAngleRadians,
    refractedAngleRadians,
    totalInternalReflection,
  )
  const rayPhase = positiveModulo(timeSeconds * 0.46, 1)
  const incidentPulse = readReflectionRayPulse(
    incidentAngleRadians,
    rayPhase,
    'incident',
  )
  const refractedPulse = readReflectionRayPulse(
    totalInternalReflection ? -incidentAngleRadians : refractedAngleRadians,
    rayPhase,
    totalInternalReflection ? 'reflected' : 'refracted',
  )

  return buildSample({
    angleRadians: incidentAngleRadians,
    angularAccelerationRadiansPerSecondSquared: criticalAngleRadians,
    angularVelocityRadiansPerSecond: incidentAngleRadians,
    displacementMeters: radiansToDegrees(refractedAngleRadians),
    forceOneNewtons: radiansToDegrees(criticalAngleRadians),
    forceTwoNewtons: reflectance * 100,
    gripRatio: reflectance,
    isGrounded: totalInternalReflection,
    positionMeters: parameters.incidentAngleDegrees,
    pressurePascals: (1 - reflectance) * 100,
    primaryRadiusMeters: parameters.incidentMediumIndex,
    secondaryRadiusMeters: parameters.refractedMediumIndex,
    secondarySpeedMetersPerSecond:
      parameters.refractedMediumIndex > 0
        ? 1 / parameters.refractedMediumIndex
        : 0,
    secondaryVelocityMetersPerSecond: refractedAngleRadians,
    secondaryVelocityXMetersPerSecond: Math.cos(refractedAngleRadians),
    secondaryVelocityZMetersPerSecond: -Math.sin(refractedAngleRadians),
    secondaryXMeters: refractedPulse.x,
    secondaryZMeters: refractedPulse.z,
    speedMetersPerSecond:
      parameters.incidentMediumIndex > 0 ? 1 / parameters.incidentMediumIndex : 0,
    timeSeconds,
    velocityMetersPerSecond: incidentAngleRadians,
    velocityXMetersPerSecond: Math.cos(incidentAngleRadians),
    velocityZMetersPerSecond: -Math.sin(incidentAngleRadians),
    xMeters: incidentPulse.x,
    zMeters: incidentPulse.z,
  })
}

function computeLensesMirrorsSample(
  parameters: LensesMirrorsParameters,
  timeSeconds: number,
): KinematicsSample {
  const signedFocalLengthMeters = getSignedOpticalFocalLength(parameters)
  const imageDistanceMeters = computeThinElementImageDistance(
    signedFocalLengthMeters,
    parameters.objectDistanceMeters,
  )
  const boundedImageDistanceMeters = clamp(imageDistanceMeters, -18, 18)
  const magnification =
    parameters.objectDistanceMeters > 0
      ? -boundedImageDistanceMeters / parameters.objectDistanceMeters
      : 0
  const imageHeightMeters = magnification * parameters.objectHeightMeters
  const realImage = boundedImageDistanceMeters > 0
  const rayPhase = positiveModulo(timeSeconds * 0.34, 1)
  const rayX = lerp(
    -parameters.objectDistanceMeters,
    boundedImageDistanceMeters,
    rayPhase,
  )
  const rayZ = lerp(parameters.objectHeightMeters, imageHeightMeters, rayPhase)

  return buildSample({
    angleRadians: Math.atan2(
      parameters.objectHeightMeters,
      parameters.objectDistanceMeters,
    ),
    displacementMeters: boundedImageDistanceMeters,
    forceOneNewtons: signedFocalLengthMeters,
    forceTwoNewtons: magnification,
    gripRatio: realImage ? 1 : 0,
    isGrounded: !realImage,
    positionMeters: parameters.objectDistanceMeters,
    pressurePascals: imageHeightMeters,
    primaryRadiusMeters: signedFocalLengthMeters,
    secondaryRadiusMeters: magnification,
    secondarySpeedMetersPerSecond: realImage ? 1 : -1,
    secondaryVelocityMetersPerSecond: imageHeightMeters,
    secondaryXMeters: boundedImageDistanceMeters,
    secondaryZMeters: imageHeightMeters,
    speedMetersPerSecond: parameters.rayApertureMeters,
    timeSeconds,
    velocityMetersPerSecond: boundedImageDistanceMeters,
    xMeters: rayX,
    zMeters: rayZ,
  })
}

function computeLightDiffractionInterferenceSample(
  parameters: LightDiffractionInterferenceParameters,
  timeSeconds: number,
): KinematicsSample {
  const scanAmplitudeMeters = Math.min(
    0.034,
    Math.max(0.012, parameters.screenDistanceMeters * 0.018),
  )
  const detectorCenterMeters = parameters.detectorPositionMillimeters / 1000
  const detectorPositionMeters =
    detectorCenterMeters +
    scanAmplitudeMeters * Math.sin((2 * Math.PI * timeSeconds) / 6)
  const intensity = computeLightDiffractionIntensity(
    parameters,
    detectorPositionMeters,
  )
  const thetaRadians = Math.atan2(
    detectorPositionMeters,
    parameters.screenDistanceMeters,
  )
  const wavelengthMeters = parameters.wavelengthNanometers * 1e-9
  const slitSeparationMeters = parameters.slitSeparationMicrometers * 1e-6
  const slitWidthMeters = parameters.slitWidthMicrometers * 1e-6
  const fringeSpacingMeters =
    slitSeparationMeters > 0
      ? (parameters.screenDistanceMeters * wavelengthMeters) /
        slitSeparationMeters
      : 0
  const envelope = computeSingleSlitEnvelope(
    wavelengthMeters,
    slitWidthMeters,
    thetaRadians,
  )
  const interference = computeMultiSlitInterference(
    wavelengthMeters,
    slitSeparationMeters,
    parameters.slitCount,
    thetaRadians,
  )

  return buildSample({
    angleRadians: thetaRadians,
    displacementMeters: envelope,
    forceOneNewtons: parameters.slitWidthMicrometers,
    forceTwoNewtons: parameters.slitSeparationMicrometers,
    frequencyHertz: parameters.slitCount,
    gripRatio: intensity,
    positionMeters: detectorPositionMeters,
    pressurePascals: intensity,
    primaryRadiusMeters: wavelengthMeters,
    secondaryPressurePascals: interference,
    secondaryRadiusMeters: fringeSpacingMeters,
    secondarySpeedMetersPerSecond: parameters.wavelengthNanometers,
    secondaryXMeters: parameters.screenDistanceMeters,
    secondaryZMeters: detectorCenterMeters,
    speedMetersPerSecond: parameters.screenDistanceMeters,
    timeSeconds,
    totalEnergyJoules: intensity,
    velocityMetersPerSecond: intensity,
    xMeters: parameters.screenDistanceMeters,
    zMeters: detectorPositionMeters,
  })
}

function readReflectionRayPulse(
  angleRadians: number,
  ratio: number,
  segment: 'incident' | 'reflected' | 'refracted',
) {
  const lengthMeters = 3.6

  if (segment === 'incident') {
    return {
      x: lerp(-Math.cos(angleRadians) * lengthMeters, 0, ratio),
      z: lerp(Math.sin(angleRadians) * lengthMeters, 0, ratio),
    }
  }

  if (segment === 'reflected') {
    return {
      x: -Math.cos(angleRadians) * lengthMeters * ratio,
      z: -Math.sin(angleRadians) * lengthMeters * ratio,
    }
  }

  return {
    x: Math.cos(angleRadians) * lengthMeters * ratio,
    z: -Math.sin(angleRadians) * lengthMeters * ratio,
  }
}

function computeSchlickReflectance(
  incidentMediumIndex: number,
  refractedMediumIndex: number,
  incidentAngleRadians: number,
  refractedAngleRadians: number,
  totalInternalReflection: boolean,
) {
  if (totalInternalReflection) {
    return 1
  }

  const r0 =
    ((incidentMediumIndex - refractedMediumIndex) /
      (incidentMediumIndex + refractedMediumIndex)) **
    2
  const cosine = Math.cos(
    incidentMediumIndex <= refractedMediumIndex
      ? incidentAngleRadians
      : refractedAngleRadians,
  )

  return clamp(r0 + (1 - r0) * (1 - cosine) ** 5, 0, 1)
}

function getSignedOpticalFocalLength(parameters: LensesMirrorsParameters) {
  return parameters.elementKind === 'converging-lens' ||
    parameters.elementKind === 'concave-mirror'
    ? parameters.focalLengthMeters
    : -parameters.focalLengthMeters
}

function computeThinElementImageDistance(
  focalLengthMeters: number,
  objectDistanceMeters: number,
) {
  const inverseImageDistance = 1 / focalLengthMeters - 1 / objectDistanceMeters

  if (Math.abs(inverseImageDistance) < 1e-6) {
    return Math.sign(focalLengthMeters) * 18
  }

  return 1 / inverseImageDistance
}

export function computeLightDiffractionIntensity(
  parameters: LightDiffractionInterferenceParameters,
  detectorPositionMeters: number,
) {
  const thetaRadians = Math.atan2(
    detectorPositionMeters,
    parameters.screenDistanceMeters,
  )
  const wavelengthMeters = parameters.wavelengthNanometers * 1e-9
  const slitWidthMeters = parameters.slitWidthMicrometers * 1e-6
  const slitSeparationMeters = parameters.slitSeparationMicrometers * 1e-6
  const envelope = computeSingleSlitEnvelope(
    wavelengthMeters,
    slitWidthMeters,
    thetaRadians,
  )
  const interference = computeMultiSlitInterference(
    wavelengthMeters,
    slitSeparationMeters,
    parameters.slitCount,
    thetaRadians,
  )

  return clamp(parameters.intensityScale * envelope * interference, 0, 1)
}

function computeSingleSlitEnvelope(
  wavelengthMeters: number,
  slitWidthMeters: number,
  thetaRadians: number,
) {
  const beta =
    (Math.PI * slitWidthMeters * Math.sin(thetaRadians)) / wavelengthMeters

  return sincSquared(beta)
}

function computeMultiSlitInterference(
  wavelengthMeters: number,
  slitSeparationMeters: number,
  slitCount: number,
  thetaRadians: number,
) {
  const safeSlitCount = Math.max(1, Math.round(slitCount))

  if (safeSlitCount === 1) {
    return 1
  }

  const alpha =
    (Math.PI * slitSeparationMeters * Math.sin(thetaRadians)) /
    wavelengthMeters
  const denominator = Math.sin(alpha)

  if (Math.abs(denominator) < 1e-7) {
    return 1
  }

  return clamp(
    (Math.sin(safeSlitCount * alpha) /
      (safeSlitCount * denominator)) **
      2,
    0,
    1,
  )
}

function sincSquared(value: number) {
  if (Math.abs(value) < 1e-7) {
    return 1
  }

  return (Math.sin(value) / value) ** 2
}

function computeWaveOnStringSample(
  parameters: WaveOnStringParameters,
  timeSeconds: number,
): KinematicsSample {
  const point = computeMechanicalWavePoint(
    'wave-on-string',
    parameters,
    parameters.probePositionMeters,
    timeSeconds,
  )
  const waveSpeedMetersPerSecond = computeWaveOnStringSpeed(parameters)
  const effectiveWavelengthMeters =
    computeWaveOnStringEffectiveWavelength(parameters)
  const angularFrequencyRadiansPerSecond =
    2 * Math.PI * parameters.frequencyHertz

  return buildSample({
    accelerationMetersPerSecondSquared: pointEnvelopeAcceleration(
      point.zMeters,
      angularFrequencyRadiansPerSecond,
    ),
    accelerationZMetersPerSecondSquared: pointEnvelopeAcceleration(
      point.zMeters,
      angularFrequencyRadiansPerSecond,
    ),
    angleRadians: computeTravelingWavePhase(
      parameters,
      parameters.probePositionMeters,
      timeSeconds,
    ),
    angularVelocityRadiansPerSecond: angularFrequencyRadiansPerSecond,
    displacementMeters:
      parameters.frequencyHertz > 0 ? waveSpeedMetersPerSecond * timeSeconds : 0,
    frequencyHertz: parameters.frequencyHertz,
    periodSeconds:
      parameters.frequencyHertz > 0 ? 1 / parameters.frequencyHertz : 0,
    positionMeters: point.zMeters,
    primaryRadiusMeters: parameters.amplitudeMeters,
    secondaryRadiusMeters: effectiveWavelengthMeters,
    secondaryVelocityMetersPerSecond: waveSpeedMetersPerSecond,
    secondaryVelocityXMetersPerSecond: waveSpeedMetersPerSecond,
    speedMetersPerSecond: waveSpeedMetersPerSecond,
    tensionNewtons: parameters.tensionNewtons,
    timeSeconds,
    velocityMetersPerSecond: computeTravelingWaveTransverseVelocity(
      parameters,
      parameters.probePositionMeters,
      timeSeconds,
    ),
    velocityXMetersPerSecond: waveSpeedMetersPerSecond,
    velocityZMetersPerSecond: computeTravelingWaveTransverseVelocity(
      parameters,
      parameters.probePositionMeters,
      timeSeconds,
    ),
    xMeters: point.xMeters,
    zMeters: point.zMeters,
  })
}

function computeLongitudinalWaveSample(
  parameters: LongitudinalWaveParameters,
  timeSeconds: number,
): KinematicsSample {
  const point = computeMechanicalWavePoint(
    'longitudinal-wave',
    parameters,
    parameters.probePositionMeters,
    timeSeconds,
  )
  const waveSpeedMetersPerSecond = computeLongitudinalWaveSpeed(parameters)
  const effectiveWavelengthMeters =
    computeLongitudinalWaveEffectiveWavelength(parameters)
  const angularFrequencyRadiansPerSecond =
    2 * Math.PI * parameters.frequencyHertz
  const phaseRadians = computeLongitudinalWavePhase(
    parameters,
    parameters.probePositionMeters,
    timeSeconds,
  )
  const particleVelocityMetersPerSecond =
    -parameters.amplitudeMeters *
    angularFrequencyRadiansPerSecond *
    Math.cos(phaseRadians)
  const particleAccelerationMetersPerSecondSquared =
    pointEnvelopeAcceleration(
      point.zMeters,
      angularFrequencyRadiansPerSecond,
    )
  const compressionRatio = point.componentTwoMeters
  const springForceNewtons =
    parameters.longitudinalStiffnessNewtons * compressionRatio
  const effectiveMassKilograms =
    parameters.linearDensityKilogramsPerMeter *
    Math.max(effectiveWavelengthMeters, 1e-9)
  const kineticEnergyJoules =
    0.5 * effectiveMassKilograms * particleVelocityMetersPerSecond ** 2
  const elasticPotentialEnergyJoules =
    0.5 *
    parameters.longitudinalStiffnessNewtons *
    compressionRatio ** 2 *
    Math.max(effectiveWavelengthMeters, 1e-9)

  return buildSample({
    accelerationMetersPerSecondSquared:
      particleAccelerationMetersPerSecondSquared,
    accelerationXMetersPerSecondSquared:
      particleAccelerationMetersPerSecondSquared,
    angleRadians: phaseRadians,
    angularVelocityRadiansPerSecond: angularFrequencyRadiansPerSecond,
    centerOfMassMeters: compressionRatio,
    displacementMeters:
      parameters.frequencyHertz > 0 ? waveSpeedMetersPerSecond * timeSeconds : 0,
    elasticPotentialEnergyJoules,
    forceOneNewtons: Math.abs(compressionRatio),
    frequencyHertz: parameters.frequencyHertz,
    kineticEnergyJoules,
    netForceNewtons: springForceNewtons,
    periodSeconds:
      parameters.frequencyHertz > 0 ? 1 / parameters.frequencyHertz : 0,
    positionMeters: point.zMeters,
    potentialEnergyJoules: elasticPotentialEnergyJoules,
    primaryRadiusMeters: parameters.amplitudeMeters,
    secondaryRadiusMeters: effectiveWavelengthMeters,
    secondarySpeedMetersPerSecond: waveSpeedMetersPerSecond,
    secondaryVelocityMetersPerSecond: waveSpeedMetersPerSecond,
    secondaryVelocityXMetersPerSecond: waveSpeedMetersPerSecond,
    speedMetersPerSecond: waveSpeedMetersPerSecond,
    springForceNewtons,
    timeSeconds,
    totalEnergyJoules: kineticEnergyJoules + elasticPotentialEnergyJoules,
    velocityMetersPerSecond: particleVelocityMetersPerSecond,
    velocityXMetersPerSecond: particleVelocityMetersPerSecond,
    xMeters: point.xMeters,
    zMeters: point.zMeters,
  })
}

function computeSuperpositionInterferenceSample(
  parameters: SuperpositionInterferenceParameters,
  timeSeconds: number,
): KinematicsSample {
  const point = computeMechanicalWavePoint(
    'superposition-interference',
    parameters,
    parameters.probePositionMeters,
    timeSeconds,
  )
  const angularFrequencyRadiansPerSecond =
    2 * Math.PI * parameters.frequencyHertz
  const componentVelocities = computeSuperpositionComponentVelocities(
    parameters,
    parameters.probePositionMeters,
    timeSeconds,
  )
  const totalVelocityMetersPerSecond =
    componentVelocities.componentOneVelocityMetersPerSecond +
    componentVelocities.componentTwoVelocityMetersPerSecond
  const waveSpeedMetersPerSecond =
    parameters.frequencyHertz * parameters.wavelengthMeters

  return buildSample({
    accelerationMetersPerSecondSquared:
      -(angularFrequencyRadiansPerSecond ** 2) * point.zMeters,
    accelerationZMetersPerSecondSquared:
      -(angularFrequencyRadiansPerSecond ** 2) * point.zMeters,
    angleRadians: computeTravelingWavePhase(
      {
        amplitudeMeters: parameters.amplitudeOneMeters,
        frequencyHertz: parameters.frequencyHertz,
        linearDensityKilogramsPerMeter: 1,
        phaseDegrees: 0,
        probePositionMeters: parameters.probePositionMeters,
        speedModel: 'wavelength-frequency',
        stringLengthMeters: parameters.stringLengthMeters,
        tensionNewtons:
          (parameters.frequencyHertz * parameters.wavelengthMeters) ** 2,
        wavelengthMeters: parameters.wavelengthMeters,
      },
      parameters.probePositionMeters,
      timeSeconds,
    ),
    angularVelocityRadiansPerSecond: angularFrequencyRadiansPerSecond,
    centerOfMassMeters: point.envelopeMeters,
    displacementMeters: point.componentTwoMeters,
    frequencyHertz: parameters.frequencyHertz,
    periodSeconds:
      parameters.frequencyHertz > 0 ? 1 / parameters.frequencyHertz : 0,
    positionMeters: point.zMeters,
    primaryRadiusMeters: Math.max(
      parameters.amplitudeOneMeters,
      parameters.amplitudeTwoMeters,
    ),
    secondaryRadiusMeters: parameters.wavelengthMeters,
    secondarySpeedMetersPerSecond: Math.abs(
      componentVelocities.componentTwoVelocityMetersPerSecond,
    ),
    secondaryVelocityMetersPerSecond:
      componentVelocities.componentTwoVelocityMetersPerSecond,
    secondaryVelocityZMetersPerSecond:
      componentVelocities.componentTwoVelocityMetersPerSecond,
    secondaryXMeters: point.xMeters,
    secondaryZMeters: point.componentOneMeters,
    speedMetersPerSecond: waveSpeedMetersPerSecond,
    timeSeconds,
    velocityMetersPerSecond: totalVelocityMetersPerSecond,
    velocityXMetersPerSecond: waveSpeedMetersPerSecond,
    velocityZMetersPerSecond: totalVelocityMetersPerSecond,
    xMeters: point.xMeters,
    zMeters: point.zMeters,
  })
}

function computeStandingWavesSample(
  parameters: StandingWavesParameters,
  timeSeconds: number,
): KinematicsSample {
  const point = computeMechanicalWavePoint(
    'standing-waves',
    parameters,
    parameters.probePositionMeters,
    timeSeconds,
  )
  const waveSpeedMetersPerSecond = computeStandingWaveSpeed(parameters)
  const harmonicMode = readStandingWaveHarmonicMode(parameters)
  const frequencyHertz =
    (harmonicMode * waveSpeedMetersPerSecond) /
    (2 * parameters.stringLengthMeters)
  const modalWavelengthMeters =
    (2 * parameters.stringLengthMeters) / harmonicMode
  const angularFrequencyRadiansPerSecond = 2 * Math.PI * frequencyHertz
  const modalShape = Math.sin(
    (harmonicMode * Math.PI * parameters.probePositionMeters) /
      parameters.stringLengthMeters,
  )
  const phaseRadians =
    angularFrequencyRadiansPerSecond * timeSeconds +
    degreesToRadians(parameters.phaseDegrees)
  const velocityMetersPerSecond =
    -parameters.amplitudeMeters *
    modalShape *
    angularFrequencyRadiansPerSecond *
    Math.sin(phaseRadians)
  const accelerationMetersPerSecondSquared =
    -(angularFrequencyRadiansPerSecond ** 2) * point.zMeters

  return buildSample({
    accelerationMetersPerSecondSquared,
    accelerationZMetersPerSecondSquared: accelerationMetersPerSecondSquared,
    angleRadians: phaseRadians,
    angularVelocityRadiansPerSecond: angularFrequencyRadiansPerSecond,
    centerOfMassMeters: point.envelopeMeters,
    displacementMeters: point.envelopeMeters,
    frequencyHertz,
    periodSeconds: frequencyHertz > 0 ? 1 / frequencyHertz : 0,
    positionMeters: point.zMeters,
    primaryRadiusMeters: parameters.amplitudeMeters,
    secondaryRadiusMeters: modalWavelengthMeters,
    secondarySpeedMetersPerSecond: waveSpeedMetersPerSecond,
    secondaryVelocityMetersPerSecond: waveSpeedMetersPerSecond,
    speedMetersPerSecond: waveSpeedMetersPerSecond,
    timeSeconds,
    velocityMetersPerSecond,
    velocityXMetersPerSecond: waveSpeedMetersPerSecond,
    velocityZMetersPerSecond: velocityMetersPerSecond,
    xMeters: point.xMeters,
    zMeters: point.zMeters,
    secondaryZMeters: point.envelopeMeters,
  })
}

function computeMechanicalWavePoint(
  simulationId: WaveProfileSimulationId,
  parameters: WaveProfileParameters,
  xOnStringMeters: number,
  timeSeconds: number,
): MechanicalWaveProfilePoint {
  const stringLengthMeters = readMechanicalWaveStringLength(parameters)
  const centeredXMeters = xOnStringMeters - stringLengthMeters / 2

  if (simulationId === 'beats') {
    const beatsParameters = parameters as BeatsParameters
    const kOne =
      (2 * Math.PI * beatsParameters.frequencyOneHertz) /
      beatsParameters.mediumSpeedMetersPerSecond
    const kTwo =
      (2 * Math.PI * beatsParameters.frequencyTwoHertz) /
      beatsParameters.mediumSpeedMetersPerSecond
    const omegaOne = 2 * Math.PI * beatsParameters.frequencyOneHertz
    const omegaTwo = 2 * Math.PI * beatsParameters.frequencyTwoHertz
    const phaseDifferenceRadians = degreesToRadians(
      beatsParameters.phaseDifferenceDegrees,
    )
    const componentOneMeters =
      beatsParameters.amplitudePascals *
      Math.sin(kOne * xOnStringMeters - omegaOne * timeSeconds)
    const componentTwoMeters =
      beatsParameters.amplitudePascals *
      Math.sin(
        kTwo * xOnStringMeters -
          omegaTwo * timeSeconds +
          phaseDifferenceRadians,
      )
    const zMeters = componentOneMeters + componentTwoMeters
    const envelopeMeters =
      2 *
      beatsParameters.amplitudePascals *
      Math.abs(
        Math.cos(
          ((kTwo - kOne) * xOnStringMeters -
            (omegaTwo - omegaOne) * timeSeconds +
            phaseDifferenceRadians) /
            2,
        ),
      )

    return {
      componentOneMeters,
      componentTwoMeters,
      envelopeMeters,
      xMeters: centeredXMeters,
      zMeters,
    }
  }

  if (simulationId === 'doppler-effect') {
    const dopplerParameters = parameters as DopplerEffectParameters
    const sourcePositionMeters = readDopplerSourcePositionMeters(
      dopplerParameters,
      timeSeconds,
    )
    const distanceFromSourceMeters = xOnStringMeters - sourcePositionMeters
    const wavelengthMeters = computeDopplerWavelengthForPoint(
      dopplerParameters,
      xOnStringMeters,
      sourcePositionMeters,
    )
    const distanceMagnitudeMeters = Math.abs(distanceFromSourceMeters)
    const attenuation = 1 / Math.sqrt(1 + distanceMagnitudeMeters * 0.22)
    const phase =
      wavelengthMeters > 0
        ? (2 * Math.PI * distanceMagnitudeMeters) / wavelengthMeters -
          2 * Math.PI * dopplerParameters.emittedFrequencyHertz * timeSeconds
        : 0
    const zMeters =
      dopplerParameters.amplitudePascals * attenuation * Math.sin(phase)

    return {
      componentOneMeters: zMeters,
      componentTwoMeters: 0,
      envelopeMeters: Math.abs(dopplerParameters.amplitudePascals * attenuation),
      xMeters: centeredXMeters,
      zMeters,
    }
  }

  if (simulationId === 'longitudinal-wave') {
    const longitudinalParameters = parameters as LongitudinalWaveParameters
    const phaseRadians = computeLongitudinalWavePhase(
      longitudinalParameters,
      xOnStringMeters,
      timeSeconds,
    )
    const displacementMeters =
      longitudinalParameters.amplitudeMeters * Math.sin(phaseRadians)
    const effectiveWavelengthMeters =
      computeLongitudinalWaveEffectiveWavelength(longitudinalParameters)
    const waveNumberRadiansPerMeter =
      effectiveWavelengthMeters > 0
        ? (2 * Math.PI) / effectiveWavelengthMeters
        : 0
    const compressionRatio =
      -longitudinalParameters.amplitudeMeters *
      waveNumberRadiansPerMeter *
      Math.cos(phaseRadians)

    return {
      componentOneMeters: displacementMeters,
      componentTwoMeters: compressionRatio,
      envelopeMeters: Math.abs(longitudinalParameters.amplitudeMeters),
      xMeters: centeredXMeters,
      zMeters: displacementMeters,
    }
  }

  if (simulationId === 'standing-waves') {
    const standingParameters = parameters as StandingWavesParameters
    const harmonicMode = readStandingWaveHarmonicMode(standingParameters)
    const waveSpeedMetersPerSecond =
      computeStandingWaveSpeed(standingParameters)
    const frequencyHertz =
      (harmonicMode * waveSpeedMetersPerSecond) /
      (2 * standingParameters.stringLengthMeters)
    const omega = 2 * Math.PI * frequencyHertz
    const modalShape = Math.sin(
      (harmonicMode * Math.PI * xOnStringMeters) /
        standingParameters.stringLengthMeters,
    )
    const displacementMeters =
      standingParameters.amplitudeMeters *
      modalShape *
      Math.cos(omega * timeSeconds + degreesToRadians(standingParameters.phaseDegrees))
    const envelopeMeters = Math.abs(
      standingParameters.amplitudeMeters * modalShape,
    )

    return {
      componentOneMeters: displacementMeters,
      componentTwoMeters: 0,
      envelopeMeters,
      xMeters: centeredXMeters,
      zMeters: displacementMeters,
    }
  }

  if (simulationId === 'superposition-interference') {
    const superpositionParameters =
      parameters as SuperpositionInterferenceParameters
    const k = (2 * Math.PI) / superpositionParameters.wavelengthMeters
    const omega = 2 * Math.PI * superpositionParameters.frequencyHertz
    const phaseDifferenceRadians = degreesToRadians(
      superpositionParameters.phaseDifferenceDegrees,
    )
    const componentOneMeters =
      superpositionParameters.amplitudeOneMeters *
      Math.sin(k * xOnStringMeters - omega * timeSeconds)
    const componentTwoMeters =
      superpositionParameters.amplitudeTwoMeters *
      Math.sin(k * xOnStringMeters + omega * timeSeconds + phaseDifferenceRadians)
    const zMeters = componentOneMeters + componentTwoMeters

    return {
      componentOneMeters,
      componentTwoMeters,
      envelopeMeters: Math.abs(zMeters),
      xMeters: centeredXMeters,
      zMeters,
    }
  }

  const waveParameters = parameters as WaveOnStringParameters
  const zMeters =
    waveParameters.amplitudeMeters *
    Math.sin(
      computeTravelingWavePhase(waveParameters, xOnStringMeters, timeSeconds),
    )

  return {
    componentOneMeters: zMeters,
    componentTwoMeters: 0,
    envelopeMeters: Math.abs(waveParameters.amplitudeMeters),
    xMeters: centeredXMeters,
    zMeters,
  }
}

function computeTravelingWavePhase(
  parameters: WaveOnStringParameters,
  xOnStringMeters: number,
  timeSeconds: number,
) {
  const effectiveWavelengthMeters =
    computeWaveOnStringEffectiveWavelength(parameters)

  return (
    ((2 * Math.PI) / effectiveWavelengthMeters) * xOnStringMeters -
    2 * Math.PI * parameters.frequencyHertz * timeSeconds +
    degreesToRadians(parameters.phaseDegrees)
  )
}

function computeTravelingWaveTransverseVelocity(
  parameters: WaveOnStringParameters,
  xOnStringMeters: number,
  timeSeconds: number,
) {
  return (
    -parameters.amplitudeMeters *
    2 *
    Math.PI *
    parameters.frequencyHertz *
    Math.cos(computeTravelingWavePhase(parameters, xOnStringMeters, timeSeconds))
  )
}

function computeWaveOnStringSpeed(parameters: WaveOnStringParameters) {
  if (parameters.speedModel === 'string-properties') {
    return Math.sqrt(
      parameters.tensionNewtons / parameters.linearDensityKilogramsPerMeter,
    )
  }

  return parameters.frequencyHertz * parameters.wavelengthMeters
}

function computeWaveOnStringEffectiveWavelength(
  parameters: WaveOnStringParameters,
) {
  if (
    parameters.speedModel === 'string-properties' &&
    parameters.frequencyHertz > 0
  ) {
    return computeWaveOnStringSpeed(parameters) / parameters.frequencyHertz
  }

  return parameters.wavelengthMeters
}

function computeLongitudinalWavePhase(
  parameters: LongitudinalWaveParameters,
  xOnSpringMeters: number,
  timeSeconds: number,
) {
  const effectiveWavelengthMeters =
    computeLongitudinalWaveEffectiveWavelength(parameters)

  return (
    ((2 * Math.PI) / effectiveWavelengthMeters) * xOnSpringMeters -
    2 * Math.PI * parameters.frequencyHertz * timeSeconds +
    degreesToRadians(parameters.phaseDegrees)
  )
}

function computeLongitudinalWaveSpeed(
  parameters: LongitudinalWaveParameters,
) {
  if (parameters.speedModel === 'spring-properties') {
    return Math.sqrt(
      parameters.longitudinalStiffnessNewtons /
        parameters.linearDensityKilogramsPerMeter,
    )
  }

  return parameters.frequencyHertz * parameters.wavelengthMeters
}

function computeLongitudinalWaveEffectiveWavelength(
  parameters: LongitudinalWaveParameters,
) {
  if (
    parameters.speedModel === 'spring-properties' &&
    parameters.frequencyHertz > 0
  ) {
    return computeLongitudinalWaveSpeed(parameters) / parameters.frequencyHertz
  }

  return parameters.wavelengthMeters
}

function computeSuperpositionComponentVelocities(
  parameters: SuperpositionInterferenceParameters,
  xOnStringMeters: number,
  timeSeconds: number,
) {
  const k = (2 * Math.PI) / parameters.wavelengthMeters
  const omega = 2 * Math.PI * parameters.frequencyHertz
  const phaseDifferenceRadians = degreesToRadians(
    parameters.phaseDifferenceDegrees,
  )

  return {
    componentOneVelocityMetersPerSecond:
      -parameters.amplitudeOneMeters *
      omega *
      Math.cos(k * xOnStringMeters - omega * timeSeconds),
    componentTwoVelocityMetersPerSecond:
      parameters.amplitudeTwoMeters *
      omega *
      Math.cos(k * xOnStringMeters + omega * timeSeconds + phaseDifferenceRadians),
  }
}

function computeBeatsComponentPressureRates(
  parameters: BeatsParameters,
  xOnMediumMeters: number,
  timeSeconds: number,
) {
  const kOne =
    (2 * Math.PI * parameters.frequencyOneHertz) /
    parameters.mediumSpeedMetersPerSecond
  const kTwo =
    (2 * Math.PI * parameters.frequencyTwoHertz) /
    parameters.mediumSpeedMetersPerSecond
  const omegaOne = 2 * Math.PI * parameters.frequencyOneHertz
  const omegaTwo = 2 * Math.PI * parameters.frequencyTwoHertz
  const phaseDifferenceRadians = degreesToRadians(
    parameters.phaseDifferenceDegrees,
  )

  return {
    componentOnePressureRate:
      -parameters.amplitudePascals *
      omegaOne *
      Math.cos(kOne * xOnMediumMeters - omegaOne * timeSeconds),
    componentTwoPressureRate:
      -parameters.amplitudePascals *
      omegaTwo *
      Math.cos(
        kTwo * xOnMediumMeters -
          omegaTwo * timeSeconds +
          phaseDifferenceRadians,
      ),
  }
}

function computeDopplerObservedFrequency(
  parameters: DopplerEffectParameters,
  sourcePositionMeters: number,
  observerPositionMeters: number,
) {
  const directionFromSourceToObserver =
    Math.sign(observerPositionMeters - sourcePositionMeters) || 1
  const sourceTowardObserver =
    parameters.sourceSpeedMetersPerSecond * directionFromSourceToObserver
  const observerTowardSource =
    -parameters.observerSpeedMetersPerSecond * directionFromSourceToObserver
  const numerator =
    parameters.mediumSpeedMetersPerSecond + observerTowardSource
  const denominator =
    parameters.mediumSpeedMetersPerSecond - sourceTowardObserver

  if (denominator <= 1e-9 || numerator <= 0) {
    return 0
  }

  return parameters.emittedFrequencyHertz * (numerator / denominator)
}

function readDopplerSourceInitialPositionMeters(
  parameters: DopplerEffectParameters,
) {
  if (parameters.sourceSpeedMetersPerSecond > 0) {
    return 0
  }

  if (parameters.sourceSpeedMetersPerSecond < 0) {
    return parameters.mediumLengthMeters
  }

  return parameters.sourceInitialPositionMeters
}

function readDopplerSourcePositionMeters(
  parameters: DopplerEffectParameters,
  timeSeconds: number,
) {
  if (parameters.sourceSpeedMetersPerSecond === 0) {
    return readDopplerSourceInitialPositionMeters(parameters)
  }

  const travelMeters =
    Math.abs(parameters.sourceSpeedMetersPerSecond) * timeSeconds
  const wrappedTravelMeters = positiveModulo(
    travelMeters,
    parameters.mediumLengthMeters,
  )

  return parameters.sourceSpeedMetersPerSecond > 0
    ? wrappedTravelMeters
    : parameters.mediumLengthMeters - wrappedTravelMeters
}

function computeDopplerWavelengthForPoint(
  parameters: DopplerEffectParameters,
  pointPositionMeters: number,
  sourcePositionMeters: number,
) {
  const sideSign = Math.sign(pointPositionMeters - sourcePositionMeters) || 1
  const apparentWaveSpeed =
    parameters.mediumSpeedMetersPerSecond -
    parameters.sourceSpeedMetersPerSecond * sideSign

  return parameters.emittedFrequencyHertz > 0
    ? Math.max(0.01, apparentWaveSpeed / parameters.emittedFrequencyHertz)
    : 0
}

function pointEnvelopeAcceleration(
  displacementMeters: number,
  angularFrequencyRadiansPerSecond: number,
) {
  return -(angularFrequencyRadiansPerSecond ** 2) * displacementMeters
}

function computeStandingWaveSpeed(parameters: StandingWavesParameters) {
  return Math.sqrt(parameters.tensionNewtons / parameters.linearDensityKilogramsPerMeter)
}

function readStandingWaveHarmonicMode(parameters: StandingWavesParameters) {
  return Math.max(1, Math.round(parameters.harmonicMode))
}

function readMechanicalWaveStringLength(
  parameters: WaveProfileParameters,
) {
  if ('mediumLengthMeters' in parameters) {
    return parameters.mediumLengthMeters
  }

  if ('springLengthMeters' in parameters) {
    return parameters.springLengthMeters
  }

  return parameters.stringLengthMeters
}

function resolveMechanicalWaveProfileDomain(
  parameters: WaveProfileParameters,
  profileDomain?: MechanicalWaveProfileDomain,
) {
  const stringLengthMeters = readMechanicalWaveStringLength(parameters)

  if (!profileDomain) {
    return {
      endMeters: stringLengthMeters,
      startMeters: 0,
    }
  }

  const { endMeters, startMeters } = profileDomain

  if (
    !Number.isFinite(startMeters) ||
    !Number.isFinite(endMeters) ||
    endMeters <= startMeters
  ) {
    throw new Error(
      'profileDomain must have finite startMeters and endMeters with endMeters greater than startMeters.',
    )
  }

  return {
    endMeters,
    startMeters,
  }
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
    couplingPotentialEnergyJoules: sample.couplingPotentialEnergyJoules ?? 0,
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
    leftElasticPotentialEnergyJoules:
      sample.leftElasticPotentialEnergyJoules ?? 0,
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
    rightElasticPotentialEnergyJoules:
      sample.rightElasticPotentialEnergyJoules ?? 0,
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
    spacetimeCentralDeformation:
      sample.spacetimeCentralDeformation ?? 0,
    spacetimeCentralInfluenceScale:
      sample.spacetimeCentralInfluenceScale ?? 0,
    spacetimeOrbitingDeformation:
      sample.spacetimeOrbitingDeformation ?? 0,
    spacetimeOrbitingInfluenceScale:
      sample.spacetimeOrbitingInfluenceScale ?? 0,
    specificGravitationalPotentialJoulesPerKilogram:
      sample.specificGravitationalPotentialJoulesPerKilogram ?? 0,
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

  if (isGravitationalFieldSimulationId(simulationId)) {
    const orbitParameters = parameters as GravitationalFieldOrbitsParameters
    const isVolumetricLattice =
      simulationId === 'gravitational-space-lattice'
    const warnings: SimulationWarning[] = [
      {
        code: isVolumetricLattice
          ? 'SPACETIME_LATTICE_ANALOGY'
          : 'SPACETIME_FABRIC_ANALOGY',
        message:
          isVolumetricLattice
            ? 'A malha cubica deformada e uma analogia visual amplificada do potencial gravitacional: as linhas e a convergencia dos vertices nao sao estruturas materiais nem uma metrica relativistica em escala.'
            : 'A malha deformada e uma analogia visual amplificada do potencial gravitacional, nao um tecido fisico nem uma representacao em escala da relatividade geral.',
      },
    ]

    if (orbitParameters.eccentricity > highEccentricityWarningThreshold) {
      warnings.push({
        code: 'ORBIT_HIGH_ECCENTRICITY',
        message:
          'A excentricidade alta destaca uma orbita didatica eliptica; perturbacoes, atmosfera e precessao nao entram no modelo.',
      })
    }

    return warnings
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

  if (simulationId === 'damped-oscillator') {
    const oscillatorParameters = parameters as DampedOscillatorParameters
    const naturalAngularFrequency = Math.sqrt(
      oscillatorParameters.springConstantNewtonsPerMeter /
        oscillatorParameters.massKilograms,
    )
    const criticalDampingPerSecond = 2 * naturalAngularFrequency

    if (
      oscillatorParameters.dampingPerSecond >
      criticalDampingPerSecond + massSpringDampingTolerance
    ) {
      return [
        {
          code: 'OSCILLATOR_OVERDAMPED',
          message:
            'O amortecimento supera o valor critico; o corpo retorna ao equilibrio sem cruzar repetidamente a origem.',
        },
      ]
    }

    if (
      Math.abs(
        oscillatorParameters.dampingPerSecond - criticalDampingPerSecond,
      ) <= massSpringDampingTolerance
    ) {
      return [
        {
          code: 'OSCILLATOR_CRITICAL_DAMPING',
          message:
            'O amortecimento esta no limite critico; o retorno ao equilibrio e o mais rapido sem oscilacao.',
        },
      ]
    }

    if (oscillatorParameters.dampingPerSecond > 0) {
      return [
        {
          code: 'OSCILLATOR_UNDERDAMPED',
          message:
            'O amortecimento linear esta ativo abaixo do critico; a amplitude decai e a energia dissipada aparece nos samples.',
        },
      ]
    }

    return []
  }

  if (simulationId === 'forced-oscillator-resonance') {
    const forcedParameters =
      parameters as ForcedOscillatorResonanceParameters
    const naturalAngularFrequency = Math.sqrt(
      forcedParameters.springConstantNewtonsPerMeter /
        forcedParameters.massKilograms,
    )
    const relativeDetuning = Math.abs(
      forcedParameters.driveAngularFrequencyRadiansPerSecond -
        naturalAngularFrequency,
    ) / naturalAngularFrequency

    if (relativeDetuning < 0.08) {
      return [
        {
          code: 'FORCED_OSCILLATOR_NEAR_RESONANCE',
          message:
            'A frequencia externa esta perto da frequencia natural; a amplitude cresce ate o amortecimento equilibrar a energia injetada.',
        },
      ]
    }

    return []
  }

  if (simulationId === 'coupled-oscillators') {
    const coupledParameters = parameters as CoupledOscillatorsParameters

    if (coupledParameters.dampingNewtonSecondsPerMeter > 0) {
      return [
        {
          code: 'COUPLED_DAMPED_SYSTEM',
          message:
            'O amortecimento linear esta ativo; a energia mecanica diminui enquanto a dissipacao acumulada aparece nos samples.',
        },
      ]
    }

    if (coupledParameters.couplingSpringConstantNewtonsPerMeter === 0) {
      return [
        {
          code: 'COUPLED_UNCOUPLED_REFERENCE',
          message:
            'A mola de acoplamento esta zerada; as massas oscilam independentemente e nao trocam energia entre si.',
        },
      ]
    }

    if (
      Math.abs(coupledParameters.initialDisplacementOneMeters) > 0 &&
      Math.abs(coupledParameters.initialDisplacementTwoMeters) > 0 &&
      Math.sign(coupledParameters.initialDisplacementOneMeters) !==
        Math.sign(coupledParameters.initialDisplacementTwoMeters)
    ) {
      return [
        {
          code: 'COUPLED_OUT_OF_PHASE_MODE',
          message:
            'As massas partem em sentidos opostos; o modo fora de fase destaca a mola de acoplamento e a frequencia maior.',
        },
      ]
    }

    return []
  }

  if (simulationId === 'beats') {
    const beatsParameters = parameters as BeatsParameters
    const beatFrequencyHertz = Math.abs(
      beatsParameters.frequencyTwoHertz - beatsParameters.frequencyOneHertz,
    )

    if (beatsParameters.amplitudePascals === 0) {
      return [
        {
          code: 'BEATS_ZERO_AMPLITUDE',
          message:
            'A amplitude esta zerada; os pontos permanecem na linha de equilibrio e a pressao resultante fica nula.',
        },
      ]
    }

    if (beatFrequencyHertz < 1e-9) {
      return [
        {
          code: 'BEATS_EQUAL_FREQUENCIES',
          message:
            'As duas frequencias sao iguais; a envoltoria de batimentos deixa de pulsar e resta uma soma senoidal comum.',
        },
      ]
    }

    return [
      {
        code: 'BEATS_ENVELOPE_ACTIVE',
        message:
          'A diferenca entre as frequencias produz uma envoltoria lenta; os pontinhos desenham a pressao resultante e os graficos usam o mesmo probe.',
      },
    ]
  }

  if (simulationId === 'doppler-effect') {
    const dopplerParameters = parameters as DopplerEffectParameters
    const sourceMachRatio =
      Math.abs(dopplerParameters.sourceSpeedMetersPerSecond) /
      dopplerParameters.mediumSpeedMetersPerSecond
    const observerMachRatio =
      Math.abs(dopplerParameters.observerSpeedMetersPerSecond) /
      dopplerParameters.mediumSpeedMetersPerSecond

    if (
      dopplerParameters.sourceSpeedMetersPerSecond === 0 &&
      dopplerParameters.observerSpeedMetersPerSecond === 0
    ) {
      return [
        {
          code: 'DOPPLER_NO_RELATIVE_MOTION',
          message:
            'Fonte e observador estao parados no meio; a frequencia observada permanece igual a frequencia emitida.',
        },
      ]
    }

    if (sourceMachRatio > 0.72 || observerMachRatio > 0.72) {
      return [
        {
          code: 'DOPPLER_HIGH_SOURCE_SPEED',
          message:
            'Fonte ou observador esta proximo da velocidade do meio didatico; as frentes ficam muito comprimidas e o modelo continua classico/subsonico.',
        },
      ]
    }

    return [
      {
        code: 'DOPPLER_SHIFT_ACTIVE',
        message:
          'O movimento relativo altera a frequencia observada; os pontinhos mostram frentes comprimidas a frente da fonte e alongadas atras.',
      },
    ]
  }

  if (simulationId === 'reflection-refraction') {
    const opticsParameters = parameters as ReflectionRefractionParameters
    const sample = computeReflectionRefractionSample(opticsParameters, 0)

    if (sample.isGrounded) {
      return [
        {
          code: 'OPTICS_TOTAL_INTERNAL_REFLECTION',
          message:
            'O angulo incidente supera o angulo critico; o motor remove o raio refratado e mantem apenas a reflexao interna total.',
        },
      ]
    }

    if (
      Math.abs(
        opticsParameters.incidentMediumIndex -
          opticsParameters.refractedMediumIndex,
      ) < 1e-6
    ) {
      return [
        {
          code: 'OPTICS_MATCHED_MEDIA',
          message:
            'Os indices sao praticamente iguais; o raio segue quase reto e a reflexao de Fresnel fica minima.',
        },
      ]
    }

    return [
      {
        code: 'OPTICS_SNELL_REFRACTION_ACTIVE',
        message:
          'A Lei de Snell calcula o raio refratado; alterar angulo ou indices move os raios, o angulo critico e a fracao refletida.',
      },
    ]
  }

  if (simulationId === 'lenses-mirrors') {
    const opticsParameters = parameters as LensesMirrorsParameters
    const sample = computeLensesMirrorsSample(opticsParameters, 0)
    const focalGap = Math.abs(
      opticsParameters.objectDistanceMeters -
        Math.abs(sample.primaryRadiusMeters),
    )

    if (focalGap < 0.08) {
      return [
        {
          code: 'OPTICS_OBJECT_NEAR_FOCUS',
          message:
            'O objeto esta muito perto do foco; a distancia de imagem cresce e foi limitada visualmente no sample.',
        },
      ]
    }

    if (sample.isGrounded) {
      return [
        {
          code: 'OPTICS_VIRTUAL_IMAGE',
          message:
            'A imagem calculada e virtual; a cena usa prolongamentos tracejados e a tabela mostra distancia de imagem negativa.',
        },
      ]
    }

    return [
      {
        code: 'OPTICS_REAL_IMAGE',
        message:
          'A imagem e real no modelo geometrico; raios principais se cruzam no lado de saida do elemento optico.',
      },
    ]
  }

  if (simulationId === 'light-diffraction-interference') {
    const opticsParameters =
      parameters as LightDiffractionInterferenceParameters

    if (opticsParameters.intensityScale === 0) {
      return [
        {
          code: 'OPTICS_ZERO_INTENSITY_SCALE',
          message:
            'A escala de intensidade esta zerada; o padrao permanece geometricamente definido, mas a tela fica escura.',
        },
      ]
    }

    if (opticsParameters.slitCount === 1) {
      return [
        {
          code: 'OPTICS_SINGLE_SLIT_DIFFRACTION',
          message:
            'Com uma unica fenda, o motor mostra apenas a envoltoria de difracao; maximos de interferencia entre fendas nao aparecem.',
        },
      ]
    }

    return [
      {
        code: 'OPTICS_MULTI_SLIT_INTERFERENCE',
        message:
          'As fendas produzem maximos de interferencia modulados pela envoltoria de difracao; comprimento de onda, separacao e largura redesenham a tela.',
      },
    ]
  }

  if (simulationId === 'wave-on-string') {
    const waveParameters = parameters as WaveOnStringParameters

    if (waveParameters.amplitudeMeters === 0) {
      return [
        {
          code: 'WAVE_ZERO_AMPLITUDE',
          message:
            'A amplitude esta zerada; a corda permanece na linha de equilibrio enquanto velocidade, periodo e comprimento de onda continuam declarados.',
        },
      ]
    }

    if (waveParameters.frequencyHertz === 0) {
      return [
        {
          code: 'WAVE_STATIC_PROFILE',
          message:
            waveParameters.speedModel === 'string-properties'
              ? 'A frequencia esta zerada; a fonte nao injeta ciclos, o perfil fica congelado, mas a velocidade do meio ainda vem de sqrt(T/mu).'
              : 'A frequencia esta zerada; o perfil fica congelado e a velocidade de propagacao v = lambda f tambem zera.',
        },
      ]
    }

    if (waveParameters.speedModel === 'string-properties') {
      return [
        {
          code: 'WAVE_SPEED_FROM_STRING',
          message:
            'A velocidade da onda esta sendo calculada por v = sqrt(T/mu); o comprimento de onda efetivo exibido vem de lambda = v/f.',
        },
      ]
    }

    return []
  }

  if (simulationId === 'longitudinal-wave') {
    const longitudinalParameters = parameters as LongitudinalWaveParameters

    if (longitudinalParameters.amplitudeMeters === 0) {
      return [
        {
          code: 'LONGITUDINAL_ZERO_AMPLITUDE',
          message:
            'A amplitude esta zerada; a mola fica igualmente espacada, enquanto velocidade e comprimento de onda continuam declarados.',
        },
      ]
    }

    if (longitudinalParameters.frequencyHertz === 0) {
      return [
        {
          code: 'LONGITUDINAL_STATIC_PROFILE',
          message:
            longitudinalParameters.speedModel === 'spring-properties'
              ? 'A frequencia esta zerada; a fonte nao injeta ciclos, o perfil fica congelado, mas a velocidade da mola ainda vem de sqrt(C/mu).'
              : 'A frequencia esta zerada; o perfil fica congelado e a velocidade de propagacao v = lambda f tambem zera.',
        },
      ]
    }

    const effectiveWavelengthMeters =
      computeLongitudinalWaveEffectiveWavelength(longitudinalParameters)
    const strainAmplitude =
      effectiveWavelengthMeters > 0
        ? (2 * Math.PI * longitudinalParameters.amplitudeMeters) /
          effectiveWavelengthMeters
        : 0

    if (strainAmplitude > 0.72) {
      return [
        {
          code: 'LONGITUDINAL_LARGE_STRAIN',
          message:
            'A compressao relativa fica grande para o modelo linear; a cena ainda mostra a propagacao ideal, mas a teoria marca esse limite didatico.',
        },
      ]
    }

    if (longitudinalParameters.speedModel === 'spring-properties') {
      return [
        {
          code: 'LONGITUDINAL_SPEED_FROM_SPRING',
          message:
            'A velocidade longitudinal esta sendo calculada por v = sqrt(C/mu); o comprimento de onda efetivo exibido vem de lambda = v/f.',
        },
      ]
    }

    return []
  }

  if (simulationId === 'superposition-interference') {
    const superpositionParameters =
      parameters as SuperpositionInterferenceParameters
    const normalizedPhase = normalizeDegrees(
      superpositionParameters.phaseDifferenceDegrees,
    )
    const equalAmplitudes =
      Math.abs(
        superpositionParameters.amplitudeOneMeters -
          superpositionParameters.amplitudeTwoMeters,
      ) < 1e-9

    if (equalAmplitudes && Math.abs(normalizedPhase - 180) < 3) {
      return [
        {
          code: 'INTERFERENCE_DESTRUCTIVE_PHASE',
          message:
            'As amplitudes sao iguais e a fase relativa esta proxima de 180 graus; o probe evidencia cancelamento local quando as ondas se encontram em oposicao.',
        },
      ]
    }

    if (Math.abs(normalizedPhase) < 3 || Math.abs(normalizedPhase - 360) < 3) {
      return [
        {
          code: 'INTERFERENCE_CONSTRUCTIVE_PHASE',
          message:
            'A fase relativa esta proxima de zero; os deslocamentos somam em fase nos encontros construtivos.',
        },
      ]
    }

    return []
  }

  if (simulationId === 'standing-waves') {
    const standingParameters = parameters as StandingWavesParameters

    if (readStandingWaveHarmonicMode(standingParameters) >= 5) {
      return [
        {
          code: 'STANDING_WAVE_HIGH_HARMONIC',
          message:
            'Harmonicos altos aumentam a densidade de nos e ventres; o modelo continua ideal e nao inclui perdas ou rigidez real da corda.',
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
    case 'beats':
      validateBeatsParameters(parameters as BeatsParameters)
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
    case 'coupled-oscillators':
      validateCoupledOscillatorsParameters(
        parameters as CoupledOscillatorsParameters,
      )
      return
    case 'damped-oscillator':
      validateDampedOscillatorParameters(
        parameters as DampedOscillatorParameters,
      )
      return
    case 'doppler-effect':
      validateDopplerEffectParameters(parameters as DopplerEffectParameters)
      return
    case 'reflection-refraction':
      validateReflectionRefractionParameters(
        parameters as ReflectionRefractionParameters,
      )
      return
    case 'lenses-mirrors':
      validateLensesMirrorsParameters(parameters as LensesMirrorsParameters)
      return
    case 'light-diffraction-interference':
      validateLightDiffractionInterferenceParameters(
        parameters as LightDiffractionInterferenceParameters,
      )
      return
    case 'longitudinal-wave':
      validateLongitudinalWaveParameters(
        parameters as LongitudinalWaveParameters,
      )
      return
    case 'forced-oscillator-resonance':
      validateForcedOscillatorResonanceParameters(
        parameters as ForcedOscillatorResonanceParameters,
      )
      return
    case 'gravitational-field-orbits':
    case 'gravitational-space-lattice':
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
    case 'standing-waves':
      validateStandingWavesParameters(parameters as StandingWavesParameters)
      return
    case 'superposition-interference':
      validateSuperpositionInterferenceParameters(
        parameters as SuperpositionInterferenceParameters,
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
    case 'wave-on-string':
      validateWaveOnStringParameters(parameters as WaveOnStringParameters)
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

function validateDampedOscillatorParameters(
  parameters: DampedOscillatorParameters,
) {
  assertFiniteNonNegative('dampingPerSecond', parameters.dampingPerSecond)
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

function validateForcedOscillatorResonanceParameters(
  parameters: ForcedOscillatorResonanceParameters,
) {
  validateDampedOscillatorParameters(parameters)
  assertFinitePositive(
    'driveAngularFrequencyRadiansPerSecond',
    parameters.driveAngularFrequencyRadiansPerSecond,
  )
  assertFiniteNonNegative('driveForceNewtons', parameters.driveForceNewtons)
}

function validateCoupledOscillatorsParameters(
  parameters: CoupledOscillatorsParameters,
) {
  assertFiniteNonNegative(
    'couplingSpringConstantNewtonsPerMeter',
    parameters.couplingSpringConstantNewtonsPerMeter,
  )
  assertFinite(
    'initialDisplacementOneMeters',
    parameters.initialDisplacementOneMeters,
  )
  assertFinite(
    'initialDisplacementTwoMeters',
    parameters.initialDisplacementTwoMeters,
  )
  assertFinite(
    'initialVelocityOneMetersPerSecond',
    parameters.initialVelocityOneMetersPerSecond,
  )
  assertFinite(
    'initialVelocityTwoMetersPerSecond',
    parameters.initialVelocityTwoMetersPerSecond,
  )
  assertFiniteNonNegative(
    'dampingNewtonSecondsPerMeter',
    parameters.dampingNewtonSecondsPerMeter,
  )
  assertFinitePositive(
    'gravityMetersPerSecondSquared',
    parameters.gravityMetersPerSecondSquared,
  )
  assertFinitePositive('massOneKilograms', parameters.massOneKilograms)
  assertFinitePositive('massTwoKilograms', parameters.massTwoKilograms)
  assertFinitePositive(
    'springConstantOneNewtonsPerMeter',
    parameters.springConstantOneNewtonsPerMeter,
  )
  assertFinitePositive(
    'springConstantTwoNewtonsPerMeter',
    parameters.springConstantTwoNewtonsPerMeter,
  )
}

function validateBeatsParameters(parameters: BeatsParameters) {
  assertFiniteNonNegative('amplitudePascals', parameters.amplitudePascals)
  assertFiniteNonNegative('frequencyOneHertz', parameters.frequencyOneHertz)
  assertFiniteNonNegative('frequencyTwoHertz', parameters.frequencyTwoHertz)
  assertFinitePositive('mediumLengthMeters', parameters.mediumLengthMeters)
  assertFinitePositive(
    'mediumSpeedMetersPerSecond',
    parameters.mediumSpeedMetersPerSecond,
  )
  assertFinite('phaseDifferenceDegrees', parameters.phaseDifferenceDegrees)
  assertProbeInsideString(
    parameters.probePositionMeters,
    parameters.mediumLengthMeters,
  )
}

function validateDopplerEffectParameters(parameters: DopplerEffectParameters) {
  assertFiniteNonNegative('amplitudePascals', parameters.amplitudePascals)
  assertFiniteNonNegative(
    'emittedFrequencyHertz',
    parameters.emittedFrequencyHertz,
  )
  assertFinitePositive('mediumLengthMeters', parameters.mediumLengthMeters)
  assertFinitePositive(
    'mediumSpeedMetersPerSecond',
    parameters.mediumSpeedMetersPerSecond,
  )
  assertFinite('observerSpeedMetersPerSecond', parameters.observerSpeedMetersPerSecond)
  assertFinite('sourceSpeedMetersPerSecond', parameters.sourceSpeedMetersPerSecond)
  assertProbeInsideString(
    parameters.sourceInitialPositionMeters,
    parameters.mediumLengthMeters,
  )
  assertProbeInsideString(
    parameters.observerPositionMeters,
    parameters.mediumLengthMeters,
  )
}

function validateReflectionRefractionParameters(
  parameters: ReflectionRefractionParameters,
) {
  assertFinite('incidentAngleDegrees', parameters.incidentAngleDegrees)
  assertFinitePositive('incidentMediumIndex', parameters.incidentMediumIndex)
  assertFinitePositive('refractedMediumIndex', parameters.refractedMediumIndex)
  assertFiniteNonNegative(
    'rayBundleSpreadDegrees',
    parameters.rayBundleSpreadDegrees,
  )

  if (
    parameters.incidentAngleDegrees < -85 ||
    parameters.incidentAngleDegrees > 85
  ) {
    throw new Error('incidentAngleDegrees must stay between -85 and 85.')
  }

  if (parameters.rayBundleSpreadDegrees > 18) {
    throw new Error('rayBundleSpreadDegrees must be at most 18 degrees.')
  }
}

function validateLensesMirrorsParameters(parameters: LensesMirrorsParameters) {
  assertFinitePositive('focalLengthMeters', parameters.focalLengthMeters)
  assertFinitePositive('objectDistanceMeters', parameters.objectDistanceMeters)
  assertFinite('objectHeightMeters', parameters.objectHeightMeters)
  assertFiniteNonNegative('rayApertureMeters', parameters.rayApertureMeters)

  if (parameters.rayApertureMeters > 4) {
    throw new Error('rayApertureMeters must be at most 4 meters.')
  }
}

function validateLightDiffractionInterferenceParameters(
  parameters: LightDiffractionInterferenceParameters,
) {
  assertFinite('detectorPositionMillimeters', parameters.detectorPositionMillimeters)
  assertFiniteNonNegative('intensityScale', parameters.intensityScale)
  assertFinitePositive('screenDistanceMeters', parameters.screenDistanceMeters)
  assertFinitePositive('slitSeparationMicrometers', parameters.slitSeparationMicrometers)
  assertFinitePositive('slitWidthMicrometers', parameters.slitWidthMicrometers)
  assertFinitePositive('wavelengthNanometers', parameters.wavelengthNanometers)

  if (parameters.slitCount < 1 || parameters.slitCount > 6) {
    throw new Error('slitCount must stay between 1 and 6.')
  }

  if (Math.abs(parameters.detectorPositionMillimeters) > 40) {
    throw new Error('detectorPositionMillimeters must stay inside +/- 40 mm.')
  }
}

function validateWaveOnStringParameters(parameters: WaveOnStringParameters) {
  assertFiniteNonNegative('amplitudeMeters', parameters.amplitudeMeters)
  assertFiniteNonNegative('frequencyHertz', parameters.frequencyHertz)
  assertFinitePositive(
    'linearDensityKilogramsPerMeter',
    parameters.linearDensityKilogramsPerMeter,
  )
  assertFinite('phaseDegrees', parameters.phaseDegrees)
  assertFinitePositive('stringLengthMeters', parameters.stringLengthMeters)
  assertFinitePositive('tensionNewtons', parameters.tensionNewtons)
  assertFinitePositive('wavelengthMeters', parameters.wavelengthMeters)
  if (
    parameters.speedModel !== 'string-properties' &&
    parameters.speedModel !== 'wavelength-frequency'
  ) {
    throw new Error(
      'speedModel must be string-properties or wavelength-frequency.',
    )
  }
  assertProbeInsideString(
    parameters.probePositionMeters,
    parameters.stringLengthMeters,
  )
}

function validateLongitudinalWaveParameters(
  parameters: LongitudinalWaveParameters,
) {
  assertFiniteNonNegative('amplitudeMeters', parameters.amplitudeMeters)
  assertFiniteNonNegative('frequencyHertz', parameters.frequencyHertz)
  assertFinitePositive(
    'linearDensityKilogramsPerMeter',
    parameters.linearDensityKilogramsPerMeter,
  )
  assertFinitePositive(
    'longitudinalStiffnessNewtons',
    parameters.longitudinalStiffnessNewtons,
  )
  assertFinite('phaseDegrees', parameters.phaseDegrees)
  assertFinitePositive('springCoilTurns', parameters.springCoilTurns)
  assertFinitePositive('springLengthMeters', parameters.springLengthMeters)
  assertFinitePositive('wavelengthMeters', parameters.wavelengthMeters)

  if (
    parameters.speedModel !== 'spring-properties' &&
    parameters.speedModel !== 'wavelength-frequency'
  ) {
    throw new Error(
      'speedModel must be spring-properties or wavelength-frequency.',
    )
  }

  assertProbeInsideString(
    parameters.probePositionMeters,
    parameters.springLengthMeters,
  )
}

function validateSuperpositionInterferenceParameters(
  parameters: SuperpositionInterferenceParameters,
) {
  assertFiniteNonNegative('amplitudeOneMeters', parameters.amplitudeOneMeters)
  assertFiniteNonNegative('amplitudeTwoMeters', parameters.amplitudeTwoMeters)
  assertFiniteNonNegative('frequencyHertz', parameters.frequencyHertz)
  assertFinite('phaseDifferenceDegrees', parameters.phaseDifferenceDegrees)
  assertFinitePositive('stringLengthMeters', parameters.stringLengthMeters)
  assertFinitePositive('wavelengthMeters', parameters.wavelengthMeters)
  assertProbeInsideString(
    parameters.probePositionMeters,
    parameters.stringLengthMeters,
  )
}

function validateStandingWavesParameters(parameters: StandingWavesParameters) {
  assertFiniteNonNegative('amplitudeMeters', parameters.amplitudeMeters)
  assertFinitePositive('harmonicMode', parameters.harmonicMode)
  assertFinitePositive(
    'linearDensityKilogramsPerMeter',
    parameters.linearDensityKilogramsPerMeter,
  )
  assertFinite('phaseDegrees', parameters.phaseDegrees)
  assertFinitePositive('stringLengthMeters', parameters.stringLengthMeters)
  assertFinitePositive('tensionNewtons', parameters.tensionNewtons)
  assertProbeInsideString(
    parameters.probePositionMeters,
    parameters.stringLengthMeters,
  )

  if (parameters.harmonicMode > 8) {
    throw new Error('harmonicMode must stay between 1 and 8 for this view.')
  }
}

function validateGravitationalFieldOrbitsParameters(
  parameters: GravitationalFieldOrbitsParameters,
) {
  assertFinitePositive('centralMassEarths', parameters.centralMassEarths)
  assertFinite('eccentricity', parameters.eccentricity)
  assertFiniteNonNegative(
    'fabricDeformationScale',
    parameters.fabricDeformationScale,
  )
  assertFiniteNonNegative('fabricLineOpacity', parameters.fabricLineOpacity)
  assertFinite('initialAngleDegrees', parameters.initialAngleDegrees)
  if (parameters.lightBeamOffsetUCells !== undefined) {
    assertFinite('lightBeamOffsetUCells', parameters.lightBeamOffsetUCells)
  }
  if (parameters.lightBeamOffsetVCells !== undefined) {
    assertFinite('lightBeamOffsetVCells', parameters.lightBeamOffsetVCells)
  }
  if (parameters.lightBeamProgressPercent !== undefined) {
    assertFinite(
      'lightBeamProgressPercent',
      parameters.lightBeamProgressPercent,
    )
  }
  assertFiniteNonNegative(
    'orbitingBodyWellAmplification',
    parameters.orbitingBodyWellAmplification,
  )
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

  if (parameters.fabricLineOpacity > 1) {
    throw new Error('fabricLineOpacity must be between 0 and 1.')
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

function readNumberWithFallback(
  values: Record<string, unknown>,
  key: string,
  fallbackKey?: string,
  defaultValue?: number,
) {
  const value = values[key]

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value !== 'undefined') {
    throw new Error(`${key} must be a finite number.`)
  }

  if (fallbackKey) {
    const fallbackValue = values[fallbackKey]

    if (typeof fallbackValue === 'number' && Number.isFinite(fallbackValue)) {
      return fallbackValue
    }

    if (typeof fallbackValue !== 'undefined') {
      throw new Error(`${fallbackKey} must be a finite number.`)
    }
  }

  if (typeof defaultValue === 'number' && Number.isFinite(defaultValue)) {
    return defaultValue
  }

  throw new Error(`${key} must be a finite number.`)
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

function readWaveOnStringSpeedModel(
  values: Record<string, unknown>,
): WaveOnStringParameters['speedModel'] {
  const value = values.speedModel

  if (
    value === 'string-properties' ||
    value === 'wavelength-frequency'
  ) {
    return value
  }

  return 'wavelength-frequency'
}

function readLongitudinalWaveSpeedModel(
  values: Record<string, unknown>,
): LongitudinalWaveParameters['speedModel'] {
  const value = values.speedModel

  if (
    value === 'spring-properties' ||
    value === 'wavelength-frequency'
  ) {
    return value
  }

  return 'wavelength-frequency'
}

function readOpticalElementKind(
  values: Record<string, unknown>,
): OpticalElementKind {
  const value = values.elementKind

  if (
    value === 'concave-mirror' ||
    value === 'converging-lens' ||
    value === 'convex-mirror' ||
    value === 'diverging-lens'
  ) {
    return value
  }

  return 'converging-lens'
}

function readSpacetimeLatticeBeamPlane(
  values: Record<string, unknown>,
): SpacetimeLatticeBeamPlane {
  const value = values.lightBeamPlane

  if (value === 'xy' || value === 'xz' || value === 'yz') {
    return value
  }

  return 'xy'
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

function assertProbeInsideString(probePositionMeters: number, stringLengthMeters: number) {
  assertFinite('probePositionMeters', probePositionMeters)

  if (probePositionMeters < 0 || probePositionMeters > stringLengthMeters) {
    throw new Error('probePositionMeters must stay inside the string length.')
  }
}

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180
}

function radiansToDegrees(value: number) {
  return (value * 180) / Math.PI
}

function normalizeDegrees(value: number) {
  const normalized = value % 360

  return normalized < 0 ? normalized + 360 : normalized
}

function positiveModulo(value: number, modulus: number) {
  const result = value % modulus

  return result < 0 ? result + modulus : result
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function lerp(start: number, end: number, ratio: number) {
  return start + (end - start) * ratio
}
