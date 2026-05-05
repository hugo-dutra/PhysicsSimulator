import { describe, expect, it } from 'vitest'
import {
  computeGravitationalOrbitPathSamples,
  computeKinematicsSample,
  computeKinematicsTimeline,
  getKinematicsVectorOverlays,
  type GravitationalFieldOrbitsParameters,
  type TorqueLeversCenterMassParameters,
  type UniformCircularMotionParameters,
  type UniformlyAcceleratedMotionParameters,
} from '../../lib/physics/kinematics'
import {
  createKinematicsSceneProjection,
  toKinematicsSceneDirection,
  toKinematicsScenePosition,
  toOrbitSatelliteScenePosition,
} from './KinematicsSceneProjection'
import {
  getRigidBodyRotationBaseRadius,
  getRigidBodyRotationTracePosition,
  getRigidBodyRotorHalfLength,
  getRigidBodySlidingMassRadiusRatio,
  rigidRotationRotorZ,
} from './rigidBodyRotationSceneGeometry'

describe('KinematicsScene projection helpers', () => {
  it('keeps MUV and free-fall trajectories ending on the ground plane', () => {
    const parameters: UniformlyAcceleratedMotionParameters = {
      accelerationMetersPerSecondSquared: -9.81,
      initialPositionMeters: 16,
      initialVelocityMetersPerSecond: 0,
      massKilograms: 1,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 12,
      parameters,
      sampleRateHz: 120,
      simulationId: 'uniformly-accelerated-motion',
    })
    const projection = createKinematicsSceneProjection(
      result.samples,
      'uniformly-accelerated-motion',
    )
    const firstPosition = toKinematicsScenePosition(
      result.samples[0],
      projection,
    )
    const lastSample = result.samples.at(-1)

    if (!lastSample) {
      throw new Error('Expected MUV timeline to have a final sample.')
    }

    const lastPosition = toKinematicsScenePosition(lastSample, projection)

    expect(projection.horizontalPlane).toBe(false)
    expect(projection.positionScale).toBe(1)
    expect(firstPosition.y).toBeCloseTo(0)
    expect(lastPosition.y).toBeCloseTo(0)
    expect(firstPosition.z).toBeGreaterThan(lastPosition.z)
    expect(lastPosition.z).toBeCloseTo(0)
    expect(result.samples.every((sample) => sample.zMeters >= 0)).toBe(true)
  })

  it('projects uniform circular motion onto the horizontal plane', () => {
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
    const sample = result.samples[5]
    const projection = createKinematicsSceneProjection(
      result.samples,
      'uniform-circular-motion',
    )
    const position = toKinematicsScenePosition(sample, projection)
    const velocity = getKinematicsVectorOverlays(
      sample,
      'uniform-circular-motion',
    ).find((vector) => vector.id === 'velocity')

    if (!velocity) {
      throw new Error('Expected MCU velocity vector overlay.')
    }

    const direction = toKinematicsSceneDirection(velocity, projection)

    expect(projection.horizontalPlane).toBe(true)
    expect(position.z).toBeCloseTo(0)
    expect(Math.hypot(position.x, position.y)).toBeCloseTo(
      parameters.radiusMeters * projection.positionScale,
    )
    expect(direction.z).toBeCloseTo(0)
    expect(Math.hypot(direction.x, direction.y)).toBeCloseTo(1)
  })

  it('projects gravitational planet and satellite markers onto the horizontal plane', () => {
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
    const sample = result.samples[10]
    const projection = createKinematicsSceneProjection(
      result.samples,
      'gravitational-field-orbits',
    )
    const planetPosition = toKinematicsScenePosition(sample, projection)
    const satellitePosition = toKinematicsScenePosition(
      {
        ...sample,
        xMeters: sample.secondaryXMeters,
        zMeters: sample.secondaryZMeters,
      },
      projection,
    )

    expect(projection.horizontalPlane).toBe(true)
    expect(planetPosition.z).toBeCloseTo(0)
    expect(satellitePosition.z).toBeCloseTo(0)
    expect(satellitePosition.distanceTo(planetPosition)).toBeCloseTo(
      sample.secondaryRadiusMeters * projection.positionScale,
    )
  })

  it('keeps the didactic moon visually clear of Earth when eccentricity expands the main orbit scale', () => {
    const parameters: GravitationalFieldOrbitsParameters = {
      centralMassEarths: 1,
      eccentricity: 0.84,
      initialAngleDegrees: 0,
      orbitalRadiusKilometers: 7000,
      satelliteMassKilograms: 900,
    }
    const periapsisSample = computeKinematicsSample(
      'gravitational-field-orbits',
      parameters,
      0,
    )
    const result = computeKinematicsTimeline({
      durationSeconds: periapsisSample.periodSeconds / 2,
      parameters,
      sampleRateHz: 1 / 1200,
      simulationId: 'gravitational-field-orbits',
    })
    const sample = result.samples[0]
    const projection = createKinematicsSceneProjection(
      result.samples,
      'gravitational-field-orbits',
    )
    const planetPosition = toKinematicsScenePosition(sample, projection)
    const rawSatellitePosition = toKinematicsScenePosition(
      {
        ...sample,
        xMeters: sample.secondaryXMeters,
        zMeters: sample.secondaryZMeters,
      },
      projection,
    )
    const minimumMoonOrbitRadius = 1.06
    const adjustedSatellitePosition = toOrbitSatelliteScenePosition(
      sample,
      projection,
      minimumMoonOrbitRadius,
    )

    expect(rawSatellitePosition.distanceTo(planetPosition)).toBeLessThan(
      minimumMoonOrbitRadius,
    )
    expect(adjustedSatellitePosition.distanceTo(planetPosition)).toBeCloseTo(
      minimumMoonOrbitRadius,
    )
  })

  it('keeps a full high-eccentricity orbit reference path framed', () => {
    const parameters: GravitationalFieldOrbitsParameters = {
      centralMassEarths: 1,
      eccentricity: 0.84,
      initialAngleDegrees: 0,
      orbitalRadiusKilometers: 7000,
      satelliteMassKilograms: 900,
    }
    const runtimeTimeline = computeKinematicsTimeline({
      durationSeconds: 7200,
      parameters,
      sampleRateHz: 1,
      simulationId: 'gravitational-field-orbits',
    })
    const orbitPathSamples = computeGravitationalOrbitPathSamples(parameters)
    const runtimeLastSample = runtimeTimeline.samples.at(-1)
    const maxReferenceRadiusMeters = Math.max(
      ...orbitPathSamples.map((sample) => sample.positionMeters),
    )

    if (!runtimeLastSample) {
      throw new Error('Expected gravitational timeline to have a final sample.')
    }

    const projection = createKinematicsSceneProjection(
      [...runtimeTimeline.samples, ...orbitPathSamples],
      'gravitational-field-orbits',
    )
    const pathPositions = orbitPathSamples.map((sample) =>
      toKinematicsScenePosition(sample, projection),
    )
    const pathXs = pathPositions.map((position) => position.x)
    const pathYs = pathPositions.map((position) => position.y)
    const pathWidth = Math.max(...pathXs) - Math.min(...pathXs)
    const pathDepth = Math.max(...pathYs) - Math.min(...pathYs)
    const firstPathPosition = pathPositions[0]
    const lastPathPosition = pathPositions.at(-1)

    if (!firstPathPosition || !lastPathPosition) {
      throw new Error('Expected orbit reference path positions.')
    }

    expect(runtimeLastSample.positionMeters).toBeLessThan(
      maxReferenceRadiusMeters * 0.5,
    )
    expect(orbitPathSamples.length).toBeGreaterThan(180)
    expect(pathWidth).toBeLessThanOrEqual(32.01)
    expect(pathDepth).toBeLessThanOrEqual(32.01)
    expect(lastPathPosition.distanceTo(firstPathPosition)).toBeLessThan(0.001)
  })

  it('projects torque levers as a vertical seesaw plane', () => {
    const parameters: TorqueLeversCenterMassParameters = {
      appliedForceArmMeters: 1.6,
      appliedForceNewtons: 3,
      gravityMetersPerSecondSquared: 9.81,
      leftArmMeters: 1.2,
      leftMassKilograms: 2,
      rightArmMeters: 1.8,
      rightMassKilograms: 1,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters,
      sampleRateHz: 20,
      simulationId: 'torque-levers-center-mass',
    })
    const sample = result.samples[0]
    const projection = createKinematicsSceneProjection(
      result.samples,
      'torque-levers-center-mass',
    )
    const position = toKinematicsScenePosition(sample, projection)
    const leftWeight = getKinematicsVectorOverlays(
      sample,
      'torque-levers-center-mass',
    ).find((vector) => vector.id === 'forceOne')

    if (!leftWeight) {
      throw new Error('Expected torque lever weight vector overlay.')
    }

    const direction = toKinematicsSceneDirection(leftWeight, projection)

    expect(projection.horizontalPlane).toBe(false)
    expect(position.y).toBeCloseTo(0)
    expect(position.z).toBeCloseTo(0)
    expect(sample.leftArmMeters).toBeCloseTo(parameters.leftArmMeters)
    expect(sample.rightArmMeters).toBeCloseTo(parameters.rightArmMeters)
    expect(direction.y).toBeCloseTo(0)
    expect(direction.z).toBeLessThan(0)
  })

  it('anchors the rigid body rotation trace to the sliding sphere radius', () => {
    const bodyRadius = 0.22
    const sample = {
      angleRadians: Math.PI / 3,
      primaryRadiusMeters: 1,
      secondaryRadiusMeters: 1.2,
    }
    const tracePosition = getRigidBodyRotationTracePosition(bodyRadius, sample)
    const expectedSphereRadius =
      getRigidBodyRotorHalfLength(bodyRadius) *
      getRigidBodySlidingMassRadiusRatio(sample)
    const oldBaseTraceRadius = getRigidBodyRotationBaseRadius(bodyRadius) * 0.88

    expect(Math.hypot(tracePosition.x, tracePosition.y)).toBeCloseTo(
      expectedSphereRadius,
    )
    expect(tracePosition.z).toBeCloseTo(rigidRotationRotorZ + 0.08)
    expect(expectedSphereRadius).not.toBeCloseTo(oldBaseTraceRadius)
  })
})
