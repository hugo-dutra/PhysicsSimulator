import { describe, expect, it } from 'vitest'
import {
  computeKinematicsSample,
  computeKinematicsTimeline,
  getKinematicsVectorOverlays,
  toKinematicsParameters,
  type AtwoodMachineParameters,
  type CentripetalForceCurveParameters,
  type CollisionsParameters,
  type ContinuityBernoulliParameters,
  type GravitationalFieldOrbitsParameters,
  type HydrostaticsBuoyancyParameters,
  type KinematicsSimulationId,
  type MassSpringParameters,
  type ParticleEquilibriumParameters,
  type ProjectileMotionParameters,
  type RigidBodyRotationParameters,
  type RollingWithoutSlippingParameters,
  type TorqueLeversCenterMassParameters,
  type UniformCircularMotionParameters,
  type UniformLinearMotionParameters,
  type UniformlyAcceleratedMotionParameters,
  type WorkEnergyTrackParameters,
} from './kinematics'

describe('kinematics physics engine', () => {
  it('generates deterministic MRU samples with constant velocity', () => {
    const parameters: UniformLinearMotionParameters = {
      initialPositionMeters: 1,
      massKilograms: 2,
      velocityMetersPerSecond: 1.5,
    }
    const first = computeKinematicsTimeline({
      durationSeconds: 2,
      parameters,
      sampleRateHz: 10,
      simulationId: 'uniform-linear-motion',
    })
    const second = computeKinematicsTimeline({
      durationSeconds: 2,
      parameters,
      sampleRateHz: 10,
      simulationId: 'uniform-linear-motion',
    })

    expect(first).toEqual(second)
    expect(first.samples).toHaveLength(21)
    expect(first.samples.at(-1)?.positionMeters).toBeCloseTo(4)
    expect(first.samples.at(-1)?.velocityMetersPerSecond).toBeCloseTo(1.5)
    expect(first.samples.at(-1)?.accelerationMetersPerSecondSquared)
      .toBeCloseTo(0)
  })

  it('generates MUV and free-fall fields from constant acceleration', () => {
    const parameters: UniformlyAcceleratedMotionParameters = {
      accelerationMetersPerSecondSquared: -9.81,
      initialPositionMeters: 20,
      initialVelocityMetersPerSecond: 4,
      massKilograms: 1,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 2,
      parameters,
      sampleRateHz: 10,
      simulationId: 'uniformly-accelerated-motion',
    })
    const lastSample = result.samples.at(-1)

    expect(lastSample?.positionMeters).toBeCloseTo(20 + 8 - 19.62)
    expect(lastSample?.velocityMetersPerSecond).toBeCloseTo(4 - 19.62)
    expect(lastSample?.accelerationZMetersPerSecondSquared).toBeCloseTo(-9.81)
  })

  it('keeps free fall supported on the ground plane after contact', () => {
    const parameters: UniformlyAcceleratedMotionParameters = {
      accelerationMetersPerSecondSquared: -9.81,
      initialPositionMeters: 16,
      initialVelocityMetersPerSecond: 0,
      massKilograms: 1,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 4,
      parameters,
      sampleRateHz: 120,
      simulationId: 'uniformly-accelerated-motion',
    })
    const lastSample = result.samples.at(-1)

    expect(result.warnings).toContainEqual({
      code: 'MUV_REACHES_GROUND_PLANE',
      message:
        'O corpo alcanca o plano z = 0 durante o ciclo; depois disso o sample fica apoiado no plano de referencia.',
    })
    expect(lastSample?.isGrounded).toBe(true)
    expect(lastSample?.positionMeters).toBeCloseTo(0)
    expect(lastSample?.zMeters).toBeCloseTo(0)
    expect(lastSample?.velocityMetersPerSecond).toBeCloseTo(0)
    expect(lastSample?.accelerationZMetersPerSecondSquared).toBeCloseTo(0)
  })

  it('conserves projectile mechanical energy while the projectile is in flight', () => {
    const parameters: ProjectileMotionParameters = {
      gravityMetersPerSecondSquared: 9.81,
      initialHeightMeters: 0.5,
      launchAngleDegrees: 45,
      launchSpeedMetersPerSecond: 12,
      massKilograms: 0.5,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 1.2,
      parameters,
      sampleRateHz: 120,
      simulationId: 'projectile-motion',
    })
    const initialEnergy = result.samples[0].totalEnergyJoules
    const maxDrift = Math.max(
      ...result.samples.map((sample) =>
        Math.abs(sample.totalEnergyJoules - initialEnergy),
      ),
    )

    expect(maxDrift / initialEnergy).toBeLessThan(0.001)
    expect(result.samples.every((sample) => !sample.isGrounded)).toBe(true)
  })

  it('computes circular speed, period, and centripetal acceleration', () => {
    const parameters: UniformCircularMotionParameters = {
      angularVelocityRadiansPerSecond: 2,
      initialAngleDegrees: 0,
      massKilograms: 1,
      radiusMeters: 1.5,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters,
      sampleRateHz: 20,
      simulationId: 'uniform-circular-motion',
    })
    const sample = result.samples[0]

    expect(sample.speedMetersPerSecond).toBeCloseTo(3)
    expect(sample.periodSeconds).toBeCloseTo(Math.PI)
    expect(sample.frequencyHertz).toBeCloseTo(1 / Math.PI)
    expect(sample.centripetalAccelerationMetersPerSecondSquared).toBeCloseTo(6)
  })

  it('computes Atwood acceleration, tension, and coupled positions', () => {
    const parameters: AtwoodMachineParameters = {
      gravityMetersPerSecondSquared: 9.81,
      initialDisplacementMeters: 1,
      initialVelocityMetersPerSecond: 0,
      massOneKilograms: 1,
      massTwoKilograms: 2,
      travelLimitMeters: 4,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 0.5,
      parameters,
      sampleRateHz: 20,
      simulationId: 'atwood-machine',
    })
    const sample = result.samples[5]

    expect(sample.accelerationMetersPerSecondSquared).toBeCloseTo(3.27)
    expect(sample.tensionNewtons).toBeCloseTo(13.08)
    expect(sample.secondaryZMeters + sample.zMeters).toBeCloseTo(4)
  })

  it('computes vertical mass-spring equilibrium, forces, and energy', () => {
    const parameters: MassSpringParameters = {
      dampingPerSecond: 0,
      gravityMetersPerSecondSquared: 9.81,
      initialDisplacementMeters: 0.25,
      initialVelocityMetersPerSecond: 0,
      massKilograms: 0.6,
      springConstantNewtonsPerMeter: 24,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 2,
      parameters,
      sampleRateHz: 120,
      simulationId: 'mass-spring',
    })
    const firstSample = result.samples[0]
    const initialEnergy = firstSample.totalEnergyJoules
    const maxEnergyDrift = Math.max(
      ...result.samples.map((sample) =>
        Math.abs(sample.totalEnergyJoules - initialEnergy),
      ),
    )

    expect(firstSample.secondaryRadiusMeters).toBeCloseTo(
      (parameters.massKilograms *
        parameters.gravityMetersPerSecondSquared) /
        parameters.springConstantNewtonsPerMeter,
    )
    expect(firstSample.weightNewtons).toBeCloseTo(5.886)
    expect(firstSample.springForceNewtons).toBeCloseTo(11.886)
    expect(firstSample.netForceNewtons).toBeCloseTo(-6)
    expect(maxEnergyDrift / initialEnergy).toBeLessThan(1e-10)
    expect(result.warnings).toHaveLength(0)
  })

  it('warns when mass-spring damping dissipates oscillator energy', () => {
    const parameters: MassSpringParameters = {
      dampingPerSecond: 0.2,
      gravityMetersPerSecondSquared: 9.81,
      initialDisplacementMeters: 0.25,
      initialVelocityMetersPerSecond: 0,
      massKilograms: 0.6,
      springConstantNewtonsPerMeter: 24,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 5,
      parameters,
      sampleRateHz: 120,
      simulationId: 'mass-spring',
    })

    expect(result.samples.at(-1)?.thermalEnergyJoules).toBeGreaterThan(0)
    expect(result.warnings[0]?.code).toBe('SPRING_DAMPING_ACTIVE')
  })

  it('flags centripetal grip demand against available friction', () => {
    const parameters: CentripetalForceCurveParameters = {
      frictionCoefficient: 0.4,
      gravityMetersPerSecondSquared: 9.81,
      massKilograms: 1.5,
      radiusMeters: 2,
      speedMetersPerSecond: 4,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters,
      sampleRateHz: 20,
      simulationId: 'centripetal-force-curve',
    })
    const sample = result.samples[0]

    expect(sample.centripetalForceNewtons).toBeCloseTo(12)
    expect(sample.maxStaticFrictionNewtons).toBeCloseTo(5.886)
    expect(sample.accelerationMetersPerSecondSquared).toBeCloseTo(3.924)
    expect(sample.centripetalAccelerationMetersPerSecondSquared)
      .toBeCloseTo(8)
    expect(sample.gripRatio).toBeGreaterThan(1)
    expect(result.warnings[0]?.code).toBe('CENTRIPETAL_GRIP_LIMIT_EXCEEDED')
  })

  it('lets a curve simulation leave tangentially when friction is zero', () => {
    const parameters: CentripetalForceCurveParameters = {
      frictionCoefficient: 0,
      gravityMetersPerSecondSquared: 9.81,
      massKilograms: 1,
      radiusMeters: 3,
      speedMetersPerSecond: 4,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters,
      sampleRateHz: 20,
      simulationId: 'centripetal-force-curve',
    })
    const sample = result.samples.at(-1)

    expect(sample?.xMeters).toBeCloseTo(3)
    expect(sample?.zMeters).toBeCloseTo(4)
    expect(sample?.accelerationMetersPerSecondSquared).toBeCloseTo(0)
    expect(sample?.maxStaticFrictionNewtons).toBeCloseTo(0)
    expect(sample?.frictionForceNewtons).toBeCloseTo(0)
    expect(sample?.gripRatio).toBeGreaterThan(1)
    expect(result.warnings[0]?.code).toBe('CENTRIPETAL_GRIP_LIMIT_EXCEEDED')
  })

  it('conserves mechanical energy in the ideal U-ramp regime', () => {
    const parameters: WorkEnergyTrackParameters = {
      energyLossPercent: 0,
      gravityMetersPerSecondSquared: 9.81,
      heightDropMeters: 2.4,
      initialHeightOffsetMeters: 0,
      initialPositionMeters: -2.4,
      initialSpeedMetersPerSecond: 0,
      massKilograms: 1,
      trackLengthMeters: 7,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 6,
      parameters,
      sampleRateHz: 120,
      simulationId: 'work-energy-track',
    })
    const initialEnergy = result.samples[0].totalEnergyJoules
    const maxDrift = Math.max(
      ...result.samples.map((sample) =>
        Math.abs(sample.totalEnergyJoules - initialEnergy),
      ),
    )

    expect(result.samples.some((sample) => sample.positionMeters > 0))
      .toBe(true)
    expect(maxDrift / initialEnergy).toBeLessThan(1e-10)
    expect(result.samples.at(-1)?.energyLossPercent).toBeCloseTo(0)
    expect(result.warnings).toHaveLength(0)
  })

  it('dissipates U-ramp mechanical energy and reports accumulated loss percentage', () => {
    const parameters: WorkEnergyTrackParameters = {
      energyLossPercent: 15,
      gravityMetersPerSecondSquared: 9.81,
      heightDropMeters: 2.4,
      initialHeightOffsetMeters: 0.4,
      initialPositionMeters: -2.2,
      initialSpeedMetersPerSecond: 0,
      massKilograms: 1,
      trackLengthMeters: 7,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 8,
      parameters,
      sampleRateHz: 120,
      simulationId: 'work-energy-track',
    })
    const initialEnergy = result.samples[0].totalEnergyJoules
    const lastSample = result.samples.at(-1)

    expect(result.samples[0].isGrounded).toBe(false)
    expect(lastSample?.totalEnergyJoules).toBeLessThan(initialEnergy)
    expect(lastSample?.thermalEnergyJoules).toBeGreaterThan(0)
    expect(lastSample?.energyLossPercent).toBeGreaterThan(0)
    expect(result.warnings.map((warning) => warning.code)).toContain(
      'HALFPIPE_ENERGY_LOSS_ACTIVE',
    )
    expect(result.warnings.map((warning) => warning.code)).toContain(
      'HALFPIPE_VERTICAL_RELEASE',
    )
  })

  it('couples translation, rotation, and friction in rolling motion', () => {
    const parameters: RollingWithoutSlippingParameters = {
      frictionCoefficient: 0.4,
      gravityMetersPerSecondSquared: 9.81,
      inclineAngleDegrees: 18,
      initialSpeedMetersPerSecond: 0,
      massKilograms: 1.2,
      radiusMeters: 0.3,
      trackLengthMeters: 6,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters,
      sampleRateHz: 60,
      simulationId: 'rolling-without-slipping',
    })
    const sample = result.samples.at(-1)

    expect(sample?.speedMetersPerSecond).toBeGreaterThan(0)
    expect(sample?.angularVelocityRadiansPerSecond)
      .toBeCloseTo((sample?.speedMetersPerSecond ?? 0) / parameters.radiusMeters)
    expect(sample?.gripRatio).toBeLessThanOrEqual(1)
    expect(result.warnings).toHaveLength(0)
  })

  it('warns when rolling cannot satisfy the static friction constraint', () => {
    const parameters: RollingWithoutSlippingParameters = {
      frictionCoefficient: 0.03,
      gravityMetersPerSecondSquared: 9.81,
      inclineAngleDegrees: 30,
      initialSpeedMetersPerSecond: 0,
      massKilograms: 1,
      radiusMeters: 0.35,
      trackLengthMeters: 6,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters,
      sampleRateHz: 60,
      simulationId: 'rolling-without-slipping',
    })

    expect(result.samples[0].gripRatio).toBeGreaterThan(1)
    expect(result.samples.at(-1)?.thermalEnergyJoules).toBeGreaterThan(0)
    expect(result.warnings[0]?.code)
      .toBe('ROLLING_STATIC_FRICTION_LIMIT_EXCEEDED')
  })

  it('computes gravitational field, orbital speed, and negative orbital energy', () => {
    const parameters: GravitationalFieldOrbitsParameters = {
      centralMassEarths: 1,
      eccentricity: 0,
      initialAngleDegrees: 0,
      orbitalRadiusKilometers: 7000,
      satelliteMassKilograms: 900,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 60,
      parameters,
      sampleRateHz: 1,
      simulationId: 'gravitational-field-orbits',
    })
    const sample = result.samples[0]

    expect(sample.positionMeters).toBeCloseTo(7_000_000)
    expect(sample.speedMetersPerSecond).toBeGreaterThan(7000)
    expect(sample.gravitationalFieldNewtonsPerKilogram).toBeGreaterThan(7)
    expect(sample.totalEnergyJoules).toBeLessThan(0)
  })

  it('varies elliptical orbital speed while preserving equal areas', () => {
    const parameters: GravitationalFieldOrbitsParameters = {
      centralMassEarths: 1,
      eccentricity: 0.45,
      initialAngleDegrees: 0,
      orbitalRadiusKilometers: 7000,
      satelliteMassKilograms: 900,
    }
    const periapsisSample = computeKinematicsSample(
      'gravitational-field-orbits',
      parameters,
      0,
    )
    const apoapsisSample = computeKinematicsSample(
      'gravitational-field-orbits',
      parameters,
      periapsisSample.periodSeconds / 2,
    )
    const expectedApoapsisRadiusMeters =
      parameters.orbitalRadiusKilometers *
      1000 *
      ((1 + parameters.eccentricity) / (1 - parameters.eccentricity))
    const periapsisSpecificArealRate =
      periapsisSample.xMeters * periapsisSample.velocityZMetersPerSecond -
      periapsisSample.zMeters * periapsisSample.velocityXMetersPerSecond
    const apoapsisSpecificArealRate =
      apoapsisSample.xMeters * apoapsisSample.velocityZMetersPerSecond -
      apoapsisSample.zMeters * apoapsisSample.velocityXMetersPerSecond

    expect(periapsisSample.positionMeters).toBeCloseTo(7_000_000)
    expect(
      Math.abs(apoapsisSample.positionMeters - expectedApoapsisRadiusMeters) /
        expectedApoapsisRadiusMeters,
    ).toBeLessThan(1e-10)
    expect(periapsisSample.speedMetersPerSecond).toBeGreaterThan(
      apoapsisSample.speedMetersPerSecond,
    )
    expect(periapsisSample.angularVelocityRadiansPerSecond).toBeGreaterThan(
      apoapsisSample.angularVelocityRadiansPerSecond,
    )
    expect(
      Math.abs(
        (periapsisSpecificArealRate - apoapsisSpecificArealRate) /
          periapsisSpecificArealRate,
      ),
    ).toBeLessThan(1e-10)
  })

  it('keeps orbital period tied to semi-major axis by Kepler third law', () => {
    const firstParameters: GravitationalFieldOrbitsParameters = {
      centralMassEarths: 1,
      eccentricity: 0.2,
      initialAngleDegrees: 35,
      orbitalRadiusKilometers: 7000,
      satelliteMassKilograms: 900,
    }
    const secondParameters: GravitationalFieldOrbitsParameters = {
      ...firstParameters,
      orbitalRadiusKilometers: 14000,
    }
    const firstSample = computeKinematicsSample(
      'gravitational-field-orbits',
      firstParameters,
      0,
    )
    const secondSample = computeKinematicsSample(
      'gravitational-field-orbits',
      secondParameters,
      0,
    )
    const firstSemiMajorAxisMeters =
      (firstParameters.orbitalRadiusKilometers * 1000) /
      (1 - firstParameters.eccentricity)
    const secondSemiMajorAxisMeters =
      (secondParameters.orbitalRadiusKilometers * 1000) /
      (1 - secondParameters.eccentricity)
    const firstPeriodRatio =
      firstSample.periodSeconds ** 2 / firstSemiMajorAxisMeters ** 3
    const secondPeriodRatio =
      secondSample.periodSeconds ** 2 / secondSemiMajorAxisMeters ** 3

    expect(
      Math.abs((firstPeriodRatio - secondPeriodRatio) / firstPeriodRatio),
    ).toBeLessThan(1e-12)
  })

  it('derives a didactic satellite around the orbiting body from gravitational samples', () => {
    const parameters: GravitationalFieldOrbitsParameters = {
      centralMassEarths: 1,
      eccentricity: 0.08,
      initialAngleDegrees: 0,
      orbitalRadiusKilometers: 7000,
      satelliteMassKilograms: 900,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 60,
      parameters,
      sampleRateHz: 1,
      simulationId: 'gravitational-field-orbits',
    })
    const firstSample = result.samples[0]
    const laterSample = result.samples[30]
    const firstSatelliteDistanceMeters = Math.hypot(
      firstSample.secondaryXMeters - firstSample.xMeters,
      firstSample.secondaryZMeters - firstSample.zMeters,
    )
    const laterSatelliteDistanceMeters = Math.hypot(
      laterSample.secondaryXMeters - laterSample.xMeters,
      laterSample.secondaryZMeters - laterSample.zMeters,
    )

    expect(firstSample.secondaryRadiusMeters).toBeGreaterThan(0)
    expect(firstSatelliteDistanceMeters)
      .toBeCloseTo(firstSample.secondaryRadiusMeters)
    expect(laterSatelliteDistanceMeters)
      .toBeCloseTo(laterSample.secondaryRadiusMeters)
    expect(laterSample.secondaryXMeters).not.toBeCloseTo(
      firstSample.secondaryXMeters,
    )
    expect(laterSample.secondarySpeedMetersPerSecond).toBeGreaterThan(
      laterSample.speedMetersPerSecond,
    )
  })

  it('keeps the didactic moon orbit speed independent of eccentricity-driven planet speed', () => {
    const circularParameters: GravitationalFieldOrbitsParameters = {
      centralMassEarths: 1,
      eccentricity: 0,
      initialAngleDegrees: 0,
      orbitalRadiusKilometers: 7000,
      satelliteMassKilograms: 900,
    }
    const eccentricParameters: GravitationalFieldOrbitsParameters = {
      ...circularParameters,
      eccentricity: 0.45,
    }
    const circularSample = computeKinematicsSample(
      'gravitational-field-orbits',
      circularParameters,
      0,
    )
    const eccentricPeriapsisSample = computeKinematicsSample(
      'gravitational-field-orbits',
      eccentricParameters,
      0,
    )
    const eccentricApoapsisSample = computeKinematicsSample(
      'gravitational-field-orbits',
      eccentricParameters,
      eccentricPeriapsisSample.periodSeconds / 2,
    )

    expect(eccentricPeriapsisSample.speedMetersPerSecond).toBeGreaterThan(
      eccentricApoapsisSample.speedMetersPerSecond,
    )
    expect(
      eccentricPeriapsisSample.angularVelocityRadiansPerSecond,
    ).toBeGreaterThan(eccentricApoapsisSample.angularVelocityRadiansPerSecond)
    expect(eccentricPeriapsisSample.secondarySpeedMetersPerSecond)
      .toBeCloseTo(eccentricApoapsisSample.secondarySpeedMetersPerSecond)
    expect(eccentricPeriapsisSample.secondarySpeedMetersPerSecond)
      .toBeCloseTo(circularSample.secondarySpeedMetersPerSecond)
    expect(eccentricPeriapsisSample.secondaryRadiusMeters)
      .toBeCloseTo(circularSample.secondaryRadiusMeters)
    expect(
      Math.hypot(
        eccentricApoapsisSample.secondaryXMeters - eccentricApoapsisSample.xMeters,
        eccentricApoapsisSample.secondaryZMeters - eccentricApoapsisSample.zMeters,
      ),
    ).toBeCloseTo(circularSample.secondaryRadiusMeters)
  })

  it('computes hydrostatic pressure and buoyancy regimes', () => {
    const floating: HydrostaticsBuoyancyParameters = {
      depthMeters: 2,
      fluidDensityKilogramsPerCubicMeter: 1000,
      gravityMetersPerSecondSquared: 9.81,
      objectDensityKilogramsPerCubicMeter: 600,
      objectVolumeCubicMeters: 0.1,
    }
    const sinking: HydrostaticsBuoyancyParameters = {
      ...floating,
      objectDensityKilogramsPerCubicMeter: 1200,
    }
    const floatingResult = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters: floating,
      sampleRateHz: 20,
      simulationId: 'hydrostatics-buoyancy',
    })
    const sinkingResult = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters: sinking,
      sampleRateHz: 20,
      simulationId: 'hydrostatics-buoyancy',
    })

    expect(floatingResult.samples[0].fluidPressurePascals).toBeCloseTo(19620)
    expect(floatingResult.samples[0].submergedFraction).toBeCloseTo(0.6)
    expect(floatingResult.samples[0].netForceNewtons).toBeCloseTo(0)
    expect(sinkingResult.samples[0].netForceNewtons).toBeLessThan(0)
    expect(sinkingResult.warnings[0]?.code).toBe('OBJECT_SINKS')
  })

  it('computes continuity and Bernoulli pressure between tube sections', () => {
    const parameters: ContinuityBernoulliParameters = {
      flowRateCubicMetersPerSecond: 0.12,
      fluidDensityKilogramsPerCubicMeter: 1000,
      gravityMetersPerSecondSquared: 9.81,
      heightDifferenceMeters: 0,
      inletAreaSquareMeters: 0.08,
      inletPressureKilopascals: 160,
      throatAreaSquareMeters: 0.04,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters,
      sampleRateHz: 20,
      simulationId: 'continuity-bernoulli',
    })
    const sample = result.samples[0]

    expect(sample.speedMetersPerSecond).toBeCloseTo(1.5)
    expect(sample.secondarySpeedMetersPerSecond).toBeCloseTo(3)
    expect(sample.secondaryPressurePascals).toBeLessThan(sample.pressurePascals)
    expect(result.warnings).toHaveLength(0)
  })

  it('conserves total momentum and applies restitution in 1D and 2D collisions', () => {
    const parameters: CollisionsParameters = {
      coefficientOfRestitution: 0.8,
      impactAngleDegrees: 30,
      initialSeparationMeters: 4,
      massOneKilograms: 1,
      massTwoKilograms: 2,
      normalSpeedOneMetersPerSecond: 2,
      normalSpeedTwoMetersPerSecond: 0,
      radiusOneMeters: 0.4,
      radiusTwoMeters: 0.6,
      tangentialSpeedOneMetersPerSecond: 0,
      tangentialSpeedTwoMetersPerSecond: 0,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 4,
      parameters,
      sampleRateHz: 240,
      simulationId: 'collisions-1d-2d',
    })
    const firstSample = result.samples[0]
    const lastSample = result.samples.at(-1)

    expect(lastSample).toBeDefined()

    if (!lastSample) {
      throw new Error('Collision test expected a final sample.')
    }

    const contactDistanceMeters =
      parameters.radiusOneMeters + parameters.radiusTwoMeters
    const closestSample = result.samples.reduce((closest, sample) => {
      const distanceMeters = Math.hypot(
        sample.secondaryXMeters - sample.xMeters,
        sample.secondaryZMeters - sample.zMeters,
      )
      const closestDistanceMeters = Math.hypot(
        closest.secondaryXMeters - closest.xMeters,
        closest.secondaryZMeters - closest.zMeters,
      )

      return distanceMeters < closestDistanceMeters ? sample : closest
    }, firstSample)
    const closestDistanceMeters = Math.hypot(
      closestSample.secondaryXMeters - closestSample.xMeters,
      closestSample.secondaryZMeters - closestSample.zMeters,
    )

    expect(firstSample.secondaryXMeters).toBeCloseTo(0)
    expect(firstSample.secondaryZMeters).toBeCloseTo(0)
    expect(closestDistanceMeters).toBeCloseTo(contactDistanceMeters, 2)
    expect(lastSample.impulseNewtonSeconds).toBeGreaterThan(0)
    expect(
      lastSample.velocityZMetersPerSecond *
        lastSample.secondaryVelocityZMetersPerSecond,
    ).toBeLessThan(0)
    expect(lastSample.momentumXKilogramMetersPerSecond)
      .toBeCloseTo(firstSample.momentumXKilogramMetersPerSecond)
    expect(lastSample.momentumZKilogramMetersPerSecond)
      .toBeCloseTo(firstSample.momentumZKilogramMetersPerSecond)
    expect(lastSample.kineticEnergyJoules)
      .toBeLessThan(firstSample.kineticEnergyJoules)
    expect(result.warnings[0]?.code).toBe('COLLISION_INELASTIC_LOSS')
  })

  it('keeps a particle fixed when vector forces close and accelerates when they do not', () => {
    const balanced: ParticleEquilibriumParameters = {
      forceOneAngleDegrees: 0,
      forceOneNewtons: 6,
      forceThreeAngleDegrees: -120,
      forceThreeNewtons: 6,
      forceTwoAngleDegrees: 120,
      forceTwoNewtons: 6,
      massKilograms: 2,
    }
    const unbalanced: ParticleEquilibriumParameters = {
      ...balanced,
      forceThreeNewtons: 4,
    }
    const balancedResult = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters: balanced,
      sampleRateHz: 20,
      simulationId: 'particle-equilibrium',
    })
    const unbalancedResult = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters: unbalanced,
      sampleRateHz: 20,
      simulationId: 'particle-equilibrium',
    })

    expect(balancedResult.samples.at(-1)?.displacementMeters).toBeCloseTo(0)
    expect(balancedResult.warnings).toHaveLength(0)
    expect(unbalancedResult.samples.at(-1)?.netForceNewtons).toBeGreaterThan(0)
    expect(unbalancedResult.warnings[0]?.code)
      .toBe('PARTICLE_NOT_IN_EQUILIBRIUM')
  })

  it('computes lever torque and center of mass around a fixed support', () => {
    const parameters: TorqueLeversCenterMassParameters = {
      appliedForceArmMeters: 2,
      appliedForceNewtons: 0,
      gravityMetersPerSecondSquared: 10,
      leftArmMeters: 1,
      leftMassKilograms: 2,
      rightArmMeters: 2,
      rightMassKilograms: 1,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters,
      sampleRateHz: 20,
      simulationId: 'torque-levers-center-mass',
    })
    const sample = result.samples[0]

    expect(sample.netTorqueNewtonMeters).toBeCloseTo(0)
    expect(sample.centerOfMassMeters).toBeCloseTo(0)
    expect(sample.leftArmMeters).toBeCloseTo(parameters.leftArmMeters)
    expect(sample.rightArmMeters).toBeCloseTo(parameters.rightArmMeters)
    expect(sample.appliedForceArmMeters).toBeCloseTo(
      parameters.appliedForceArmMeters,
    )
    expect(sample.angleRadians).toBeCloseTo(0)
    expect(sample.leftKineticEnergyJoules).toBeCloseTo(0)
    expect(sample.rightKineticEnergyJoules).toBeCloseTo(0)
    expect(sample.kineticEnergyJoules).toBeCloseTo(0)
    expect(sample.leftGravitationalPotentialEnergyJoules).toBeCloseTo(0)
    expect(sample.rightGravitationalPotentialEnergyJoules).toBeCloseTo(0)
    expect(sample.gravitationalPotentialEnergyJoules).toBeCloseTo(0)
    expect(sample.totalEnergyJoules).toBeCloseTo(0)
    expect(result.warnings).toHaveLength(0)
  })

  it('animates an imbalanced lever from the torque-derived angular acceleration', () => {
    const parameters: TorqueLeversCenterMassParameters = {
      appliedForceArmMeters: 1.5,
      appliedForceNewtons: 0,
      gravityMetersPerSecondSquared: 9.81,
      leftArmMeters: 1.1,
      leftMassKilograms: 1,
      rightArmMeters: 1.5,
      rightMassKilograms: 2.4,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 2,
      parameters,
      sampleRateHz: 20,
      simulationId: 'torque-levers-center-mass',
    })
    const firstSample = result.samples[0]
    const laterSample = result.samples[20]

    expect(firstSample.angleRadians).toBeCloseTo(0)
    expect(laterSample.netTorqueNewtonMeters).toBeLessThan(0)
    expect(laterSample.angularAccelerationRadiansPerSecondSquared)
      .toBeLessThan(0)
    expect(laterSample.angleRadians).toBeLessThan(firstSample.angleRadians)
    expect(laterSample.angularVelocityRadiansPerSecond).toBeLessThan(0)
    expect(laterSample.leftKineticEnergyJoules).toBeGreaterThan(0)
    expect(laterSample.rightKineticEnergyJoules).toBeGreaterThan(0)
    expect(laterSample.kineticEnergyJoules).toBeCloseTo(
      laterSample.leftKineticEnergyJoules +
        laterSample.rightKineticEnergyJoules,
    )
    expect(laterSample.leftGravitationalPotentialEnergyJoules)
      .toBeGreaterThan(0)
    expect(laterSample.rightGravitationalPotentialEnergyJoules)
      .toBeLessThan(0)
    expect(laterSample.gravitationalPotentialEnergyJoules).toBeCloseTo(
      laterSample.leftGravitationalPotentialEnergyJoules +
        laterSample.rightGravitationalPotentialEnergyJoules,
    )
    expect(laterSample.potentialEnergyJoules).toBeCloseTo(
      laterSample.gravitationalPotentialEnergyJoules,
    )
    expect(laterSample.totalEnergyJoules).toBeCloseTo(
      laterSample.kineticEnergyJoules + laterSample.potentialEnergyJoules,
    )
    expect(result.warnings[0]?.code).toBe('LEVER_ROTATIONAL_IMBALANCE')
  })

  it('computes rigid body angular motion and damping losses', () => {
    const parameters: RigidBodyRotationParameters = {
      angularDampingPerSecond: 0.1,
      appliedTorqueNewtonMeters: 0,
      initialAngleDegrees: 0,
      initialAngularVelocityRadiansPerSecond: 2,
      momentOfInertiaKilogramMetersSquared: 1.5,
      slidingMassDistanceMeters: 1,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 2,
      parameters,
      sampleRateHz: 60,
      simulationId: 'rigid-body-rotation',
    })
    const lastSample = result.samples.at(-1)

    expect(lastSample?.angleRadians).toBeGreaterThan(0)
    expect(lastSample?.angularVelocityRadiansPerSecond).toBeLessThan(2)
    expect(lastSample?.thermalEnergyJoules).toBeGreaterThan(0)
    expect(result.warnings[0]?.code).toBe('ROTATION_DAMPING_ACTIVE')
  })

  it('moves the rigid-body mass inward by conserving angular momentum', () => {
    const outerMassParameters: RigidBodyRotationParameters = {
      angularDampingPerSecond: 0,
      appliedTorqueNewtonMeters: 0,
      initialAngleDegrees: 0,
      initialAngularVelocityRadiansPerSecond: 1.2,
      momentOfInertiaKilogramMetersSquared: 0.9,
      slidingMassDistanceMeters: 1.2,
    }
    const innerMassParameters: RigidBodyRotationParameters = {
      ...outerMassParameters,
      slidingMassDistanceMeters: 0.35,
    }
    const outerSample = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters: outerMassParameters,
      sampleRateHz: 20,
      simulationId: 'rigid-body-rotation',
    }).samples[0]
    const innerSample = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters: innerMassParameters,
      sampleRateHz: 20,
      simulationId: 'rigid-body-rotation',
    }).samples[0]
    const outerAngularMomentum =
      outerSample.momentOfInertiaKilogramMetersSquared *
      outerSample.angularVelocityRadiansPerSecond
    const innerAngularMomentum =
      innerSample.momentOfInertiaKilogramMetersSquared *
      innerSample.angularVelocityRadiansPerSecond

    expect(innerSample.primaryRadiusMeters).toBeLessThan(
      outerSample.primaryRadiusMeters,
    )
    expect(innerSample.centerOfMassMeters).toBeLessThan(
      outerSample.centerOfMassMeters,
    )
    expect(innerSample.momentOfInertiaKilogramMetersSquared).toBeLessThan(
      outerSample.momentOfInertiaKilogramMetersSquared,
    )
    expect(innerSample.angularVelocityRadiansPerSecond).toBeGreaterThan(
      outerSample.angularVelocityRadiansPerSecond,
    )
    expect(innerAngularMomentum).toBeCloseTo(outerAngularMomentum)
  })

  it('derives vector overlays from the same kinematics samples', () => {
    const simulationIds: KinematicsSimulationId[] = [
      'atwood-machine',
      'centripetal-force-curve',
      'collisions-1d-2d',
      'continuity-bernoulli',
      'gravitational-field-orbits',
      'hydrostatics-buoyancy',
      'mass-spring',
      'particle-equilibrium',
      'rolling-without-slipping',
      'uniform-linear-motion',
      'uniformly-accelerated-motion',
      'projectile-motion',
      'rigid-body-rotation',
      'torque-levers-center-mass',
      'uniform-circular-motion',
      'work-energy-track',
    ]

    simulationIds.forEach((simulationId) => {
      const parameters = toKinematicsParameters(
        simulationId,
        readFixtureLikeParameters(simulationId),
      )
      const result = computeKinematicsTimeline({
        durationSeconds: 1,
        parameters,
        sampleRateHz: 20,
        simulationId,
      })
      const overlays = getKinematicsVectorOverlays(
        result.samples[10],
        simulationId,
      )

      expect(overlays.length).toBeGreaterThan(0)
      expect(
        overlays.every(
          (overlay) =>
            Number.isFinite(overlay.magnitude) &&
            Number.isFinite(overlay.direction.x) &&
            Number.isFinite(overlay.direction.z),
        ),
      ).toBe(true)
    })
  })

  it('rejects invalid physical parameters', () => {
    expect(() =>
      computeKinematicsTimeline({
        durationSeconds: 1,
        parameters: {
          initialPositionMeters: 0,
          massKilograms: 0,
          velocityMetersPerSecond: 1,
        },
        sampleRateHz: 60,
        simulationId: 'uniform-linear-motion',
      }),
    ).toThrow(/massKilograms/)
    expect(() =>
      computeKinematicsTimeline({
        durationSeconds: 1,
        parameters: {
          angularVelocityRadiansPerSecond: 0,
          initialAngleDegrees: 0,
          massKilograms: 1,
          radiusMeters: 1,
        },
        sampleRateHz: 60,
        simulationId: 'uniform-circular-motion',
      }),
    ).toThrow(/angularVelocityRadiansPerSecond/)
  })
})

function readFixtureLikeParameters(
  simulationId: KinematicsSimulationId,
): Record<string, number> {
  switch (simulationId) {
    case 'uniform-linear-motion':
      return {
        initialPositionMeters: 0,
        massKilograms: 1,
        velocityMetersPerSecond: 1,
      }
    case 'atwood-machine':
      return {
        gravityMetersPerSecondSquared: 9.81,
        initialDisplacementMeters: 1.4,
        initialVelocityMetersPerSecond: 0,
        massOneKilograms: 1,
        massTwoKilograms: 1.5,
        travelLimitMeters: 3,
      }
    case 'centripetal-force-curve':
      return {
        frictionCoefficient: 0.5,
        gravityMetersPerSecondSquared: 9.81,
        massKilograms: 1,
        radiusMeters: 3,
        speedMetersPerSecond: 2,
      }
    case 'collisions-1d-2d':
      return {
        coefficientOfRestitution: 0.8,
        impactAngleDegrees: 20,
        initialSeparationMeters: 4,
        massOneKilograms: 1,
        massTwoKilograms: 1.4,
        normalSpeedOneMetersPerSecond: 1.6,
        normalSpeedTwoMetersPerSecond: 0,
        radiusOneMeters: 0.42,
        radiusTwoMeters: 0.42,
        tangentialSpeedOneMetersPerSecond: 0.2,
        tangentialSpeedTwoMetersPerSecond: -0.1,
      }
    case 'continuity-bernoulli':
      return {
        flowRateCubicMetersPerSecond: 0.12,
        fluidDensityKilogramsPerCubicMeter: 1000,
        gravityMetersPerSecondSquared: 9.81,
        heightDifferenceMeters: 0,
        inletAreaSquareMeters: 0.08,
        inletPressureKilopascals: 160,
        throatAreaSquareMeters: 0.04,
      }
    case 'gravitational-field-orbits':
      return {
        centralMassEarths: 1,
        eccentricity: 0.08,
        initialAngleDegrees: 0,
        orbitalRadiusKilometers: 7000,
        satelliteMassKilograms: 900,
      }
    case 'hydrostatics-buoyancy':
      return {
        depthMeters: 1.5,
        fluidDensityKilogramsPerCubicMeter: 1000,
        gravityMetersPerSecondSquared: 9.81,
        objectDensityKilogramsPerCubicMeter: 650,
        objectVolumeCubicMeters: 0.08,
      }
    case 'mass-spring':
      return {
        dampingPerSecond: 0,
        gravityMetersPerSecondSquared: 9.81,
        initialDisplacementMeters: 0.2,
        initialVelocityMetersPerSecond: 0,
        massKilograms: 0.6,
        springConstantNewtonsPerMeter: 24,
      }
    case 'particle-equilibrium':
      return {
        forceOneAngleDegrees: 0,
        forceOneNewtons: 6,
        forceThreeAngleDegrees: -120,
        forceThreeNewtons: 6,
        forceTwoAngleDegrees: 120,
        forceTwoNewtons: 6,
        massKilograms: 1.5,
      }
    case 'uniformly-accelerated-motion':
      return {
        accelerationMetersPerSecondSquared: -9.81,
        initialPositionMeters: 10,
        initialVelocityMetersPerSecond: 0,
        massKilograms: 1,
      }
    case 'projectile-motion':
      return {
        gravityMetersPerSecondSquared: 9.81,
        initialHeightMeters: 0.5,
        launchAngleDegrees: 40,
        launchSpeedMetersPerSecond: 10,
        massKilograms: 1,
      }
    case 'uniform-circular-motion':
      return {
        angularVelocityRadiansPerSecond: 2,
        initialAngleDegrees: 0,
        massKilograms: 1,
        radiusMeters: 1,
      }
    case 'rigid-body-rotation':
      return {
        angularDampingPerSecond: 0.05,
        appliedTorqueNewtonMeters: 0.8,
        initialAngleDegrees: 0,
        initialAngularVelocityRadiansPerSecond: 0.5,
        momentOfInertiaKilogramMetersSquared: 0.9,
        slidingMassDistanceMeters: 1,
      }
    case 'rolling-without-slipping':
      return {
        frictionCoefficient: 0.35,
        gravityMetersPerSecondSquared: 9.81,
        inclineAngleDegrees: 18,
        initialSpeedMetersPerSecond: 0.1,
        massKilograms: 1.2,
        radiusMeters: 0.35,
        trackLengthMeters: 6,
      }
    case 'torque-levers-center-mass':
      return {
        appliedForceArmMeters: 2,
        appliedForceNewtons: 0,
        gravityMetersPerSecondSquared: 9.81,
        leftArmMeters: 1,
        leftMassKilograms: 2,
        rightArmMeters: 2,
        rightMassKilograms: 1,
      }
    case 'work-energy-track':
      return {
        energyLossPercent: 8,
        gravityMetersPerSecondSquared: 9.81,
        heightDropMeters: 2.4,
        initialHeightOffsetMeters: 0,
        initialPositionMeters: -2.4,
        initialSpeedMetersPerSecond: 0.2,
        massKilograms: 1,
        trackLengthMeters: 7,
      }
  }
}
