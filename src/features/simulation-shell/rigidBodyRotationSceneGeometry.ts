import * as THREE from 'three'
import type { KinematicsSample } from '../../lib/physics/kinematics'

type RigidRotationRadiusSample = Pick<
  KinematicsSample,
  'primaryRadiusMeters' | 'secondaryRadiusMeters'
>

type RigidRotationTraceSample = RigidRotationRadiusSample &
  Pick<KinematicsSample, 'angleRadians'>

export const rigidRotationRotorZ = 0.22

const rigidRotationMinMassRadiusRatio = 0.14
const rigidRotationTraceZOffset = 0.08

export function getRigidBodyRotationBaseRadius(bodyRadius: number) {
  return clamp(bodyRadius * 4.8, 1.04, 1.48)
}

export function getRigidBodyRotorLength(bodyRadius: number) {
  return getRigidBodyRotationBaseRadius(bodyRadius) * 1.48
}

export function getRigidBodyRotorHalfLength(bodyRadius: number) {
  return getRigidBodyRotorLength(bodyRadius) / 2
}

export function getRigidBodySlidingMassRadiusRatio(
  sample: RigidRotationRadiusSample,
) {
  const maxDistanceMeters =
    sample.secondaryRadiusMeters > 0 ? sample.secondaryRadiusMeters : 1

  return clamp(
    sample.primaryRadiusMeters / maxDistanceMeters,
    rigidRotationMinMassRadiusRatio,
    1,
  )
}

export function getRigidBodySlidingMassSceneOffset(
  bodyRadius: number,
  sample: RigidRotationRadiusSample,
) {
  return (
    getRigidBodyRotorHalfLength(bodyRadius) *
    getRigidBodySlidingMassRadiusRatio(sample)
  )
}

export function getRigidBodyRotationTracePosition(
  bodyRadius: number,
  sample: RigidRotationTraceSample,
) {
  const radius = getRigidBodySlidingMassSceneOffset(bodyRadius, sample)

  return new THREE.Vector3(
    Math.cos(sample.angleRadians) * radius,
    Math.sin(sample.angleRadians) * radius,
    rigidRotationRotorZ + rigidRotationTraceZOffset,
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
