import { describe, expect, it } from 'vitest'
import {
  computePendulumTimeline,
  getPendulumVectorOverlays,
  toPendulumParameters,
  type PendulumParameters,
} from './pendulum'

const baseParameters: PendulumParameters = {
  lengthMeters: 1.2,
  massKilograms: 0.35,
  gravityMetersPerSecondSquared: 9.81,
  initialAngleRadians: 0.25,
  initialAngularVelocityRadiansPerSecond: 0,
  dampingPerSecond: 0,
}

describe('pendulum physics engine', () => {
  it('generates deterministic samples with position and energy fields', () => {
    const first = computePendulumTimeline({
      parameters: baseParameters,
      durationSeconds: 2,
      sampleRateHz: 10,
    })
    const second = computePendulumTimeline({
      parameters: baseParameters,
      durationSeconds: 2,
      sampleRateHz: 10,
    })

    expect(first).toEqual(second)
    expect(first.samples).toHaveLength(21)
    expect(first.samples[0]).toMatchObject({
      timeSeconds: 0,
      angleRadians: baseParameters.initialAngleRadians,
      angularVelocityRadiansPerSecond:
        baseParameters.initialAngularVelocityRadiansPerSecond,
    })
    expect(first.samples.at(-1)?.timeSeconds).toBeCloseTo(2)
    expect(
      first.samples.every(
        (sample) =>
          Number.isFinite(sample.xMeters) &&
          Number.isFinite(sample.yMeters) &&
          Number.isFinite(sample.angularAccelerationRadiansPerSecondSquared) &&
          Number.isFinite(sample.linearVelocityMetersPerSecond) &&
          Number.isFinite(
            sample.tangentialAccelerationMetersPerSecondSquared,
          ) &&
          Number.isFinite(sample.radialAccelerationMetersPerSecondSquared) &&
          Number.isFinite(sample.totalAccelerationMetersPerSecondSquared) &&
          Number.isFinite(sample.kineticEnergyJoules) &&
          Number.isFinite(sample.potentialEnergyJoules) &&
          Number.isFinite(sample.totalEnergyJoules),
      ),
    ).toBe(true)
  })

  it('keeps mechanical energy nearly constant without damping', () => {
    const result = computePendulumTimeline({
      parameters: baseParameters,
      durationSeconds: 4,
      sampleRateHz: 120,
    })
    const initialEnergy = result.samples[0].totalEnergyJoules
    const maxDrift = Math.max(
      ...result.samples.map((sample) =>
        Math.abs(sample.totalEnergyJoules - initialEnergy),
      ),
    )

    expect(maxDrift / initialEnergy).toBeLessThan(0.001)
  })

  it('dissipates mechanical energy and reports warnings with damping', () => {
    const result = computePendulumTimeline({
      parameters: {
        ...baseParameters,
        dampingPerSecond: 0.12,
        initialAngleRadians: Math.PI / 4,
      },
      durationSeconds: 6,
      sampleRateHz: 120,
    })

    expect(result.warnings.map((warning) => warning.code)).toEqual([
      'SMALL_ANGLE_APPROXIMATION_LIMIT',
      'ENERGY_NOT_CONSERVED_WITH_DAMPING',
    ])
    expect(result.samples.at(-1)?.totalEnergyJoules).toBeLessThan(
      result.samples[0].totalEnergyJoules,
    )
  })

  it('derives linear velocity and acceleration fields from angular motion', () => {
    const parameters: PendulumParameters = {
      ...baseParameters,
      dampingPerSecond: 0.05,
      initialAngleRadians: 0.3,
      initialAngularVelocityRadiansPerSecond: 0.4,
    }
    const sample = computePendulumTimeline({
      parameters,
      durationSeconds: 1,
      sampleRateHz: 60,
    }).samples[0]
    const expectedAngularAcceleration =
      -(parameters.gravityMetersPerSecondSquared / parameters.lengthMeters) *
        Math.sin(parameters.initialAngleRadians) -
      parameters.dampingPerSecond *
        parameters.initialAngularVelocityRadiansPerSecond

    expect(sample.linearVelocityMetersPerSecond).toBeCloseTo(
      parameters.lengthMeters *
        parameters.initialAngularVelocityRadiansPerSecond,
    )
    expect(
      sample.angularAccelerationRadiansPerSecondSquared,
    ).toBeCloseTo(expectedAngularAcceleration)
    expect(
      sample.tangentialAccelerationMetersPerSecondSquared,
    ).toBeCloseTo(parameters.lengthMeters * expectedAngularAcceleration)
    expect(sample.radialAccelerationMetersPerSecondSquared).toBeCloseTo(
      parameters.lengthMeters *
        parameters.initialAngularVelocityRadiansPerSecond *
        parameters.initialAngularVelocityRadiansPerSecond,
    )
    expect(sample.totalAccelerationMetersPerSecondSquared).toBeCloseTo(
      Math.hypot(
        sample.tangentialAccelerationMetersPerSecondSquared,
        sample.radialAccelerationMetersPerSecondSquared,
      ),
    )
  })

  it('normalizes fixture-like values into pendulum parameters', () => {
    expect(
      toPendulumParameters({
        lengthMeters: 1,
        massKilograms: 0.2,
        gravityMetersPerSecondSquared: 9.81,
        initialAngleRadians: 0.1,
        initialAngularVelocityRadiansPerSecond: 0,
        dampingPerSecond: 0,
      }),
    ).toEqual({
      lengthMeters: 1,
      massKilograms: 0.2,
      gravityMetersPerSecondSquared: 9.81,
      initialAngleRadians: 0.1,
      initialAngularVelocityRadiansPerSecond: 0,
      dampingPerSecond: 0,
    })
  })

  it('rejects invalid physical parameters before generating samples', () => {
    expect(() =>
      computePendulumTimeline({
        parameters: {
          ...baseParameters,
          lengthMeters: 0,
        },
        durationSeconds: 1,
        sampleRateHz: 60,
      }),
    ).toThrow(/lengthMeters/)
    expect(() =>
      computePendulumTimeline({
        parameters: {
          ...baseParameters,
          massKilograms: -1,
        },
        durationSeconds: 1,
        sampleRateHz: 60,
      }),
    ).toThrow(/massKilograms/)
  })

  it('derives weight, tension, and velocity vectors from the same sample', () => {
    const result = computePendulumTimeline({
      parameters: baseParameters,
      durationSeconds: 1,
      sampleRateHz: 60,
    })
    const sample = result.samples[20]
    const overlays = getPendulumVectorOverlays(sample, baseParameters)

    expect(overlays.map((overlay) => overlay.id)).toEqual([
      'weight',
      'tension',
      'velocity',
    ])
    expect(
      overlays.every(
        (overlay) =>
          Number.isFinite(overlay.magnitude) &&
          Number.isFinite(overlay.direction.x) &&
          Number.isFinite(overlay.direction.y),
      ),
    ).toBe(true)
    expect(overlays.find((overlay) => overlay.id === 'weight')).toMatchObject({
      unit: 'N',
      direction: {
        x: 0,
        y: -1,
      },
    })
    expect(overlays.find((overlay) => overlay.id === 'velocity')?.magnitude)
      .toBeCloseTo(Math.abs(sample.linearVelocityMetersPerSecond))
  })
})
