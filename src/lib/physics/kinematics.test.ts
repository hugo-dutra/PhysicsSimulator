import { describe, expect, it } from 'vitest'
import {
  computeKinematicsTimeline,
  getKinematicsVectorOverlays,
  toKinematicsParameters,
  type AtwoodMachineParameters,
  type CentripetalForceCurveParameters,
  type CollisionsParameters,
  type KinematicsSimulationId,
  type ParticleEquilibriumParameters,
  type ProjectileMotionParameters,
  type RigidBodyRotationParameters,
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

  it('balances work, potential energy, kinetic energy, and dissipation on a track', () => {
    const parameters: WorkEnergyTrackParameters = {
      appliedForceNewtons: 2,
      frictionCoefficient: 0.1,
      gravityMetersPerSecondSquared: 9.81,
      heightDropMeters: 2,
      initialSpeedMetersPerSecond: 0.5,
      massKilograms: 1,
      trackLengthMeters: 8,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters,
      sampleRateHz: 20,
      simulationId: 'work-energy-track',
    })
    const initialEnergy = result.samples[0].totalEnergyJoules
    const lastSample = result.samples.at(-1)

    expect(lastSample?.positionMeters).toBeGreaterThan(0)
    expect(lastSample?.appliedWorkJoules).toBeGreaterThan(0)
    expect(lastSample?.thermalEnergyJoules).toBeGreaterThan(0)
    expect(lastSample?.totalEnergyJoules).toBeCloseTo(initialEnergy, 4)
  })

  it('conserves total momentum and applies restitution in 1D and 2D collisions', () => {
    const parameters: CollisionsParameters = {
      coefficientOfRestitution: 0.8,
      impactAngleDegrees: 30,
      initialSeparationMeters: 4,
      massOneKilograms: 1,
      massTwoKilograms: 2,
      normalSpeedOneMetersPerSecond: 2,
      normalSpeedTwoMetersPerSecond: 1,
      tangentialSpeedOneMetersPerSecond: 0.4,
      tangentialSpeedTwoMetersPerSecond: -0.2,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 3,
      parameters,
      sampleRateHz: 60,
      simulationId: 'collisions-1d-2d',
    })
    const firstSample = result.samples[0]
    const lastSample = result.samples.at(-1)

    expect(lastSample?.impulseNewtonSeconds).toBeGreaterThan(0)
    expect(lastSample?.momentumXKilogramMetersPerSecond)
      .toBeCloseTo(firstSample.momentumXKilogramMetersPerSecond)
    expect(lastSample?.momentumZKilogramMetersPerSecond)
      .toBeCloseTo(firstSample.momentumZKilogramMetersPerSecond)
    expect(lastSample?.kineticEnergyJoules)
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
    expect(result.warnings).toHaveLength(0)
  })

  it('computes rigid body angular motion and damping losses', () => {
    const parameters: RigidBodyRotationParameters = {
      angularDampingPerSecond: 0.1,
      appliedTorqueNewtonMeters: 0,
      initialAngleDegrees: 0,
      initialAngularVelocityRadiansPerSecond: 2,
      momentOfInertiaKilogramMetersSquared: 1.5,
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

  it('derives vector overlays from the same kinematics samples', () => {
    const simulationIds: KinematicsSimulationId[] = [
      'atwood-machine',
      'centripetal-force-curve',
      'collisions-1d-2d',
      'particle-equilibrium',
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
        normalSpeedTwoMetersPerSecond: 0.7,
        tangentialSpeedOneMetersPerSecond: 0.2,
        tangentialSpeedTwoMetersPerSecond: -0.1,
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
        momentOfInertiaKilogramMetersSquared: 1.6,
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
        appliedForceNewtons: 0,
        frictionCoefficient: 0.08,
        gravityMetersPerSecondSquared: 9.81,
        heightDropMeters: 1.5,
        initialSpeedMetersPerSecond: 0.2,
        massKilograms: 1,
        trackLengthMeters: 6,
      }
  }
}
