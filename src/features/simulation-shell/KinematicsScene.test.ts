import { describe, expect, it } from 'vitest'
import {
  computeKinematicsTimeline,
  getKinematicsVectorOverlays,
  type TorqueLeversCenterMassParameters,
  type UniformCircularMotionParameters,
  type UniformlyAcceleratedMotionParameters,
} from '../../lib/physics/kinematics'
import {
  createKinematicsSceneProjection,
  toKinematicsSceneDirection,
  toKinematicsScenePosition,
} from './KinematicsSceneProjection'

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
})
