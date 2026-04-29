import { describe, expect, it } from 'vitest'
import {
  computeInclinedPlaneTimeline,
  getInclinedPlaneVectorOverlays,
  toInclinedPlaneParameters,
  type InclinedPlaneParameters,
} from './inclinedPlane'

const baseParameters: InclinedPlaneParameters = {
  blockMassKilograms: 2,
  frictionCoefficient: 0.18,
  gravityMetersPerSecondSquared: 9.81,
  initialPositionMeters: 0,
  initialVelocityMetersPerSecond: 0,
  planeAngleDegrees: 28,
  planeLengthMeters: 6,
}

describe('inclined plane physics engine', () => {
  it('generates deterministic samples with force and energy fields', () => {
    const first = computeInclinedPlaneTimeline({
      parameters: baseParameters,
      durationSeconds: 2,
      sampleRateHz: 20,
    })
    const second = computeInclinedPlaneTimeline({
      parameters: baseParameters,
      durationSeconds: 2,
      sampleRateHz: 20,
    })

    expect(first).toEqual(second)
    expect(first.samples).toHaveLength(41)
    expect(first.samples[0]).toMatchObject({
      positionMeters: baseParameters.initialPositionMeters,
      timeSeconds: 0,
      velocityMetersPerSecond:
        baseParameters.initialVelocityMetersPerSecond,
    })
    expect(
      first.samples.every(
        (sample) =>
          Number.isFinite(sample.accelerationMetersPerSecondSquared) &&
          Number.isFinite(sample.heightMeters) &&
          Number.isFinite(sample.xMeters) &&
          Number.isFinite(sample.zMeters) &&
          Number.isFinite(sample.normalForceNewtons) &&
          Number.isFinite(sample.weightParallelNewtons) &&
          Number.isFinite(sample.frictionMagnitudeNewtons) &&
          Number.isFinite(sample.netForceNewtons) &&
          Number.isFinite(sample.kineticEnergyJoules) &&
          Number.isFinite(sample.potentialEnergyJoules) &&
          Number.isFinite(sample.thermalEnergyJoules) &&
          Number.isFinite(sample.totalEnergyJoules),
      ),
    ).toBe(true)
  })

  it('uses static friction when the weight component cannot overcome it', () => {
    const result = computeInclinedPlaneTimeline({
      parameters: {
        ...baseParameters,
        frictionCoefficient: 0.8,
        planeAngleDegrees: 20,
      },
      durationSeconds: 2,
      sampleRateHz: 20,
    })

    expect(result.warnings.map((warning) => warning.code)).toContain(
      'STATIC_FRICTION_HOLDS',
    )
    expect(result.samples.at(-1)?.positionMeters).toBeCloseTo(0)
    expect(result.samples.at(-1)?.velocityMetersPerSecond).toBeCloseTo(0)
  })

  it('slides down with acceleration from gravity minus kinetic friction', () => {
    const result = computeInclinedPlaneTimeline({
      parameters: baseParameters,
      durationSeconds: 0.5,
      sampleRateHz: 120,
    })
    const theta = (baseParameters.planeAngleDegrees * Math.PI) / 180
    const expectedAcceleration =
      baseParameters.gravityMetersPerSecondSquared *
      (Math.sin(theta) - baseParameters.frictionCoefficient * Math.cos(theta))

    expect(result.samples[0].accelerationMetersPerSecondSquared).toBeCloseTo(
      expectedAcceleration,
    )
    expect(result.samples.at(-1)?.positionMeters).toBeGreaterThan(0)
    expect(result.samples.at(-1)?.velocityMetersPerSecond).toBeGreaterThan(0)
  })

  it('tracks dissipated energy as thermal energy before the block reaches the end', () => {
    const result = computeInclinedPlaneTimeline({
      parameters: {
        ...baseParameters,
        planeLengthMeters: 20,
      },
      durationSeconds: 1,
      sampleRateHz: 120,
    })
    const initialTotalEnergy = result.samples[0].totalEnergyJoules
    const maxDrift = Math.max(
      ...result.samples.map((sample) =>
        Math.abs(sample.totalEnergyJoules - initialTotalEnergy),
      ),
    )

    expect(maxDrift / initialTotalEnergy).toBeLessThan(0.002)
    expect(result.samples.at(-1)?.thermalEnergyJoules).toBeGreaterThan(0)
  })

  it('normalizes fixture-like values into inclined-plane parameters', () => {
    expect(toInclinedPlaneParameters(baseParameters)).toEqual(baseParameters)
  })

  it('rejects invalid physical parameters before generating samples', () => {
    expect(() =>
      computeInclinedPlaneTimeline({
        parameters: {
          ...baseParameters,
          frictionCoefficient: -0.1,
        },
        durationSeconds: 1,
        sampleRateHz: 60,
      }),
    ).toThrow(/frictionCoefficient/)
    expect(() =>
      computeInclinedPlaneTimeline({
        parameters: {
          ...baseParameters,
          initialPositionMeters: 8,
        },
        durationSeconds: 1,
        sampleRateHz: 60,
      }),
    ).toThrow(/initialPositionMeters/)
  })

  it('derives weight, normal, friction, and velocity vectors from the same sample', () => {
    const result = computeInclinedPlaneTimeline({
      parameters: baseParameters,
      durationSeconds: 1,
      sampleRateHz: 60,
    })
    const sample = result.samples[20]
    const overlays = getInclinedPlaneVectorOverlays(sample, baseParameters)

    expect(overlays.map((overlay) => overlay.id)).toEqual([
      'weight',
      'normal',
      'friction',
      'velocity',
    ])
    expect(
      overlays.every(
        (overlay) =>
          Number.isFinite(overlay.magnitude) &&
          Number.isFinite(overlay.direction.x) &&
          Number.isFinite(overlay.direction.z),
      ),
    ).toBe(true)
    expect(overlays.find((overlay) => overlay.id === 'weight')).toMatchObject({
      direction: {
        x: 0,
        z: -1,
      },
      unit: 'N',
    })
  })
})
