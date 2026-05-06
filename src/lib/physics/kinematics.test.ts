import { describe, expect, it } from 'vitest'
import {
  computeKinematicsSample,
  computeKinematicsTimeline,
  getKinematicsVectorOverlays,
  hydrostaticTankDepthMeters,
  toKinematicsParameters,
  type AtwoodMachineParameters,
  type CentripetalForceCurveParameters,
  type CollisionsParameters,
  type ContinuityBernoulliParameters,
  type CoupledOscillatorsParameters,
  type DampedOscillatorParameters,
  type ForcedOscillatorResonanceParameters,
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

  it('classifies damped oscillator regimes against critical damping', () => {
    const parameters: DampedOscillatorParameters = {
      dampingPerSecond: 8,
      initialDisplacementMeters: 0.25,
      initialVelocityMetersPerSecond: 0,
      massKilograms: 1,
      springConstantNewtonsPerMeter: 16,
    }
    const criticalResult = computeKinematicsTimeline({
      durationSeconds: 3,
      parameters,
      sampleRateHz: 120,
      simulationId: 'damped-oscillator',
    })
    const overDampedResult = computeKinematicsTimeline({
      durationSeconds: 3,
      parameters: {
        ...parameters,
        dampingPerSecond: 12,
      },
      sampleRateHz: 120,
      simulationId: 'damped-oscillator',
    })

    expect(criticalResult.warnings[0]?.code).toBe(
      'OSCILLATOR_CRITICAL_DAMPING',
    )
    expect(overDampedResult.warnings[0]?.code).toBe('OSCILLATOR_OVERDAMPED')
    expect(criticalResult.samples.at(-1)?.thermalEnergyJoules)
      .toBeGreaterThan(0)
  })

  it('amplifies forced oscillator response near resonance', () => {
    const parameters: ForcedOscillatorResonanceParameters = {
      dampingPerSecond: 0.35,
      driveAngularFrequencyRadiansPerSecond: 4,
      driveForceNewtons: 1.4,
      initialDisplacementMeters: 0,
      initialVelocityMetersPerSecond: 0,
      massKilograms: 1,
      springConstantNewtonsPerMeter: 16,
    }
    const resonantResult = computeKinematicsTimeline({
      durationSeconds: 18,
      parameters,
      sampleRateHz: 120,
      simulationId: 'forced-oscillator-resonance',
    })
    const offResonantResult = computeKinematicsTimeline({
      durationSeconds: 18,
      parameters: {
        ...parameters,
        driveAngularFrequencyRadiansPerSecond: 2.2,
      },
      sampleRateHz: 120,
      simulationId: 'forced-oscillator-resonance',
    })
    const readAmplitude = (samples: typeof resonantResult.samples) =>
      Math.max(...samples.slice(samples.length / 2).map((sample) => Math.abs(sample.positionMeters)))

    expect(resonantResult.warnings[0]?.code).toBe(
      'FORCED_OSCILLATOR_NEAR_RESONANCE',
    )
    expect(readAmplitude(resonantResult.samples)).toBeGreaterThan(
      readAmplitude(offResonantResult.samples) * 1.5,
    )
    expect(resonantResult.samples.at(-1)?.appliedWorkJoules)
      .toBeGreaterThan(0)
  })

  it('conserves total energy while coupled oscillators exchange kinetic energy', () => {
    const parameters: CoupledOscillatorsParameters = {
      couplingSpringConstantNewtonsPerMeter: 5,
      initialDisplacementOneMeters: 0.28,
      initialDisplacementTwoMeters: 0,
      initialVelocityOneMetersPerSecond: 0,
      initialVelocityTwoMetersPerSecond: 0,
      massKilograms: 0.8,
      springConstantNewtonsPerMeter: 18,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 12,
      parameters,
      sampleRateHz: 120,
      simulationId: 'coupled-oscillators',
    })
    const initialEnergy = result.samples[0].totalEnergyJoules
    const maxEnergyDrift = Math.max(
      ...result.samples.map((sample) =>
        Math.abs(sample.totalEnergyJoules - initialEnergy),
      ),
    )
    const maxSecondaryKineticEnergy = Math.max(
      ...result.samples.map((sample) => sample.rightKineticEnergyJoules),
    )

    expect(maxEnergyDrift / initialEnergy).toBeLessThan(1e-6)
    expect(maxSecondaryKineticEnergy).toBeGreaterThan(0.01)
    expect(result.samples[0].displacementMeters).toBeCloseTo(0.28)
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
      objectMassKilograms: 60,
      objectVolumeCubicMeters: 0.1,
    }
    const sinking: HydrostaticsBuoyancyParameters = {
      ...floating,
      objectMassKilograms: 120,
    }
    const largerVolume: HydrostaticsBuoyancyParameters = {
      ...floating,
      objectVolumeCubicMeters: 0.2,
    }
    const floatingResult = computeKinematicsTimeline({
      durationSeconds: 12,
      parameters: floating,
      sampleRateHz: 20,
      simulationId: 'hydrostatics-buoyancy',
    })
    const sinkingResult = computeKinematicsTimeline({
      durationSeconds: 4,
      parameters: sinking,
      sampleRateHz: 20,
      simulationId: 'hydrostatics-buoyancy',
    })
    const floatingAtOneSecond = computeKinematicsSample(
      'hydrostatics-buoyancy',
      floating,
      1,
    )
    const initialSphereRadiusMeters = Math.cbrt(
      (3 * floating.objectVolumeCubicMeters) / (4 * Math.PI),
    )
    const largerVolumeSample = computeKinematicsSample(
      'hydrostatics-buoyancy',
      largerVolume,
      1,
    )
    const sinkingAtOneSecond = computeKinematicsSample(
      'hydrostatics-buoyancy',
      sinking,
      1,
    )

    expect(floatingResult.samples[0].fluidPressurePascals).toBeCloseTo(19620)
    expect(floatingResult.samples[0].pressurePascals).toBeCloseTo(
      floating.fluidDensityKilogramsPerCubicMeter *
        floating.gravityMetersPerSecondSquared *
        (floating.depthMeters - initialSphereRadiusMeters),
    )
    expect(floatingResult.samples[0].secondaryPressurePascals).toBeCloseTo(
      floating.fluidDensityKilogramsPerCubicMeter *
        floating.gravityMetersPerSecondSquared *
        (floating.depthMeters + initialSphereRadiusMeters),
    )
    expect(floatingResult.samples[0].pressurePascals).toBeLessThan(
      floatingResult.samples[0].fluidPressurePascals,
    )
    expect(floatingResult.samples[0].secondaryPressurePascals).toBeGreaterThan(
      floatingResult.samples[0].fluidPressurePascals,
    )
    expect(floatingResult.samples[0].objectDensityKilogramsPerCubicMeter)
      .toBeCloseTo(600)
    expect(floatingResult.samples[0].primaryRadiusMeters).toBeCloseTo(
      initialSphereRadiusMeters,
    )
    expect(floatingResult.samples.at(-1)?.submergedFraction)
      .toBeCloseTo(0.6, 1)
    expect(floatingResult.samples.at(-1)?.netForceNewtons).toBeCloseTo(0, 0)
    expect(largerVolumeSample.primaryRadiusMeters).toBeGreaterThan(
      floatingAtOneSecond.primaryRadiusMeters,
    )
    expect(largerVolumeSample.secondaryRadiusMeters).toBeCloseTo(
      hydrostaticTankDepthMeters,
    )
    expect(largerVolumeSample.secondaryRadiusMeters).toBeCloseTo(
      floatingAtOneSecond.secondaryRadiusMeters,
    )
    expect(largerVolumeSample.objectDensityKilogramsPerCubicMeter)
      .toBeLessThan(floatingAtOneSecond.objectDensityKilogramsPerCubicMeter)
    expect(largerVolumeSample.zMeters).toBeGreaterThan(
      floatingAtOneSecond.zMeters,
    )
    expect(sinkingAtOneSecond.zMeters).toBeLessThan(
      floatingAtOneSecond.zMeters,
    )
    expect(sinkingResult.samples[0].netForceNewtons).toBeLessThan(0)
    expect(sinkingResult.warnings[0]?.code).toBe('OBJECT_SINKS')
  })

  it('rebases hydrostatic motion from the live body state after parameter changes', () => {
    const sinking: HydrostaticsBuoyancyParameters = {
      depthMeters: 2,
      fluidDensityKilogramsPerCubicMeter: 1000,
      gravityMetersPerSecondSquared: 9.81,
      objectMassKilograms: 120,
      objectVolumeCubicMeters: 0.08,
    }
    const grounded = computeKinematicsSample(
      'hydrostatics-buoyancy',
      sinking,
      4,
    )
    const expandedVolume: HydrostaticsBuoyancyParameters = {
      ...sinking,
      initialCenterZMeters: grounded.zMeters,
      initialVelocityZMetersPerSecond: grounded.velocityZMetersPerSecond,
      motionStartTimeSeconds: grounded.timeSeconds,
      objectVolumeCubicMeters: 0.25,
    }
    const atChange = computeKinematicsSample(
      'hydrostatics-buoyancy',
      expandedVolume,
      grounded.timeSeconds,
    )
    const afterChange = computeKinematicsSample(
      'hydrostatics-buoyancy',
      expandedVolume,
      grounded.timeSeconds + 0.5,
    )

    expect(grounded.isGrounded).toBe(true)
    expect(atChange.primaryRadiusMeters).toBeGreaterThan(
      grounded.primaryRadiusMeters,
    )
    expect(atChange.zMeters - atChange.primaryRadiusMeters).toBeCloseTo(
      -hydrostaticTankDepthMeters,
    )
    expect(afterChange.zMeters).toBeGreaterThan(atChange.zMeters)
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
    expect(sample.primaryRadiusMeters).toBeCloseTo(
      Math.sqrt(parameters.inletAreaSquareMeters / Math.PI),
    )
    expect(sample.secondaryRadiusMeters).toBeCloseTo(
      Math.sqrt(parameters.throatAreaSquareMeters / Math.PI),
    )
    expect(result.warnings).toHaveLength(0)
  })

  it('samples the local Venturi tracer at the throat for visual flow cues', () => {
    const parameters: ContinuityBernoulliParameters = {
      flowRateCubicMetersPerSecond: 0.12,
      fluidDensityKilogramsPerCubicMeter: 1000,
      gravityMetersPerSecondSquared: 9.81,
      heightDifferenceMeters: 1.2,
      inletAreaSquareMeters: 0.08,
      inletPressureKilopascals: 160,
      throatAreaSquareMeters: 0.04,
    }
    const throatSample = computeKinematicsSample(
      'continuity-bernoulli',
      parameters,
      2,
    )

    expect(throatSample.xMeters).toBeCloseTo(0)
    expect(throatSample.zMeters).toBeCloseTo(parameters.heightDifferenceMeters)
    expect(throatSample.secondaryZMeters).toBeCloseTo(
      parameters.heightDifferenceMeters,
    )
    expect(throatSample.velocityMetersPerSecond).toBeCloseTo(
      throatSample.secondarySpeedMetersPerSecond,
    )
    expect(throatSample.fluidPressurePascals).toBeCloseTo(
      throatSample.secondaryPressurePascals,
    )
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
      constantRotationalEnergy: false,
      initialAngleDegrees: 0,
      initialAngularVelocityRadiansPerSecond: 2,
      momentOfInertiaKilogramMetersSquared: 1.5,
      slidingMassDistanceMeters: 1,
      slidingMassKilograms: 0.72,
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
      constantRotationalEnergy: false,
      initialAngleDegrees: 0,
      initialAngularVelocityRadiansPerSecond: 1.2,
      momentOfInertiaKilogramMetersSquared: 0.9,
      slidingMassDistanceMeters: 1.2,
      slidingMassKilograms: 0.72,
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

  it('uses movable mass value in rigid-body inertia, center of mass, and omega', () => {
    const lightMassParameters: RigidBodyRotationParameters = {
      angularDampingPerSecond: 0,
      appliedTorqueNewtonMeters: 0,
      constantRotationalEnergy: false,
      initialAngleDegrees: 0,
      initialAngularVelocityRadiansPerSecond: 1.2,
      momentOfInertiaKilogramMetersSquared: 0.9,
      slidingMassDistanceMeters: 0.35,
      slidingMassKilograms: 0.2,
    }
    const heavyMassParameters: RigidBodyRotationParameters = {
      ...lightMassParameters,
      slidingMassKilograms: 1.4,
    }
    const noMovableMassParameters: RigidBodyRotationParameters = {
      ...lightMassParameters,
      slidingMassKilograms: 0,
    }
    const lightSample = computeKinematicsSample(
      'rigid-body-rotation',
      lightMassParameters,
      0,
    )
    const heavySample = computeKinematicsSample(
      'rigid-body-rotation',
      heavyMassParameters,
      0,
    )
    const noMovableMassSample = computeKinematicsSample(
      'rigid-body-rotation',
      noMovableMassParameters,
      0,
    )
    const lightEnergySample = computeKinematicsSample(
      'rigid-body-rotation',
      { ...lightMassParameters, constantRotationalEnergy: true },
      0,
    )
    const heavyEnergySample = computeKinematicsSample(
      'rigid-body-rotation',
      { ...heavyMassParameters, constantRotationalEnergy: true },
      0,
    )

    expect(heavySample.momentOfInertiaKilogramMetersSquared).toBeGreaterThan(
      lightSample.momentOfInertiaKilogramMetersSquared,
    )
    expect(heavySample.centerOfMassMeters).toBeGreaterThan(
      lightSample.centerOfMassMeters,
    )
    expect(heavySample.angularVelocityRadiansPerSecond).toBeGreaterThan(
      lightSample.angularVelocityRadiansPerSecond,
    )
    expect(heavyEnergySample.angularVelocityRadiansPerSecond).toBeGreaterThan(
      lightEnergySample.angularVelocityRadiansPerSecond,
    )
    expect(noMovableMassSample.momentOfInertiaKilogramMetersSquared)
      .toBeCloseTo(noMovableMassParameters.momentOfInertiaKilogramMetersSquared)
    expect(noMovableMassSample.centerOfMassMeters).toBeCloseTo(0)
  })

  it('keeps rotational energy fixed while omega changes with sliding mass position', () => {
    const outerMassParameters: RigidBodyRotationParameters = {
      angularDampingPerSecond: 0.25,
      appliedTorqueNewtonMeters: 1.4,
      constantRotationalEnergy: true,
      initialAngleDegrees: 0,
      initialAngularVelocityRadiansPerSecond: 1.2,
      momentOfInertiaKilogramMetersSquared: 0.9,
      slidingMassDistanceMeters: 1.2,
      slidingMassKilograms: 0.72,
    }
    const innerMassParameters: RigidBodyRotationParameters = {
      ...outerMassParameters,
      slidingMassDistanceMeters: 0.35,
    }
    const outerResult = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters: outerMassParameters,
      sampleRateHz: 20,
      simulationId: 'rigid-body-rotation',
    })
    const innerResult = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters: innerMassParameters,
      sampleRateHz: 20,
      simulationId: 'rigid-body-rotation',
    })
    const outerSample = outerResult.samples.at(-1)
    const innerSample = innerResult.samples.at(-1)
    const outerAngularMomentum =
      (outerSample?.momentOfInertiaKilogramMetersSquared ?? 0) *
      (outerSample?.angularVelocityRadiansPerSecond ?? 0)
    const innerAngularMomentum =
      (innerSample?.momentOfInertiaKilogramMetersSquared ?? 0) *
      (innerSample?.angularVelocityRadiansPerSecond ?? 0)

    expect(innerSample?.angularVelocityRadiansPerSecond).toBeGreaterThan(
      outerSample?.angularVelocityRadiansPerSecond ?? 0,
    )
    expect(innerSample?.kineticEnergyJoules).toBeCloseTo(
      outerSample?.kineticEnergyJoules ?? 0,
    )
    expect(innerSample?.totalEnergyJoules).toBeCloseTo(
      outerSample?.totalEnergyJoules ?? 0,
    )
    expect(outerSample?.angularAccelerationRadiansPerSecondSquared)
      .toBeCloseTo(0)
    expect(innerSample?.angularAccelerationRadiansPerSecondSquared)
      .toBeCloseTo(0)
    expect(innerAngularMomentum).toBeLessThan(outerAngularMomentum)
    expect(outerSample?.netTorqueNewtonMeters).toBeCloseTo(0)
    expect(outerResult.warnings.map((warning) => warning.code)).toContain(
      'ROTATION_CONSTANT_ENERGY_ACTIVE',
    )
  })

  it('derives vector overlays from the same kinematics samples', () => {
    const simulationIds: KinematicsSimulationId[] = [
      'atwood-machine',
      'centripetal-force-curve',
      'collisions-1d-2d',
      'continuity-bernoulli',
      'coupled-oscillators',
      'damped-oscillator',
      'forced-oscillator-resonance',
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
    expect(() =>
      computeKinematicsTimeline({
        durationSeconds: 1,
        parameters: {
          angularDampingPerSecond: 0,
          appliedTorqueNewtonMeters: 0,
          constantRotationalEnergy: false,
          initialAngleDegrees: 0,
          initialAngularVelocityRadiansPerSecond: 1,
          momentOfInertiaKilogramMetersSquared: 0.9,
          slidingMassDistanceMeters: 1,
          slidingMassKilograms: -0.1,
        },
        sampleRateHz: 60,
        simulationId: 'rigid-body-rotation',
      }),
    ).toThrow(/slidingMassKilograms/)
  })
})

function readFixtureLikeParameters(
  simulationId: KinematicsSimulationId,
): Record<string, boolean | number> {
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
    case 'coupled-oscillators':
      return {
        couplingSpringConstantNewtonsPerMeter: 5,
        initialDisplacementOneMeters: 0.28,
        initialDisplacementTwoMeters: 0,
        initialVelocityOneMetersPerSecond: 0,
        initialVelocityTwoMetersPerSecond: 0,
        massKilograms: 0.8,
        springConstantNewtonsPerMeter: 18,
      }
    case 'damped-oscillator':
      return {
        dampingPerSecond: 0.6,
        initialDisplacementMeters: 0.28,
        initialVelocityMetersPerSecond: 0,
        massKilograms: 1,
        springConstantNewtonsPerMeter: 16,
      }
    case 'forced-oscillator-resonance':
      return {
        dampingPerSecond: 0.35,
        driveAngularFrequencyRadiansPerSecond: 4,
        driveForceNewtons: 1.4,
        initialDisplacementMeters: 0,
        initialVelocityMetersPerSecond: 0,
        massKilograms: 1,
        springConstantNewtonsPerMeter: 16,
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
        objectMassKilograms: 52,
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
        constantRotationalEnergy: false,
        initialAngleDegrees: 0,
        initialAngularVelocityRadiansPerSecond: 0.5,
        momentOfInertiaKilogramMetersSquared: 0.9,
        slidingMassDistanceMeters: 1,
        slidingMassKilograms: 2.4,
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
