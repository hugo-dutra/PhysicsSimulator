import * as THREE from 'three'
import {
  type KinematicsSample,
  type KinematicsSimulationId,
  type KinematicsVectorOverlay,
} from '../../lib/physics/kinematics'

export type KinematicsSceneProjection = {
  horizontalPlane: boolean
  positionScale: number
}

const maxUnscaledSceneSpanMeters = 32

export function createKinematicsSceneProjection(
  samples: KinematicsSample[],
  simulationId: KinematicsSimulationId,
): KinematicsSceneProjection {
  const horizontalPlane =
    simulationId === 'collisions-1d-2d' ||
    simulationId === 'particle-equilibrium' ||
    simulationId === 'rigid-body-rotation' ||
    simulationId === 'torque-levers-center-mass' ||
    simulationId === 'uniform-circular-motion' ||
    simulationId === 'centripetal-force-curve'
  const rawBounds = estimateRawSceneBounds(
    samples,
    horizontalPlane,
    simulationId,
  )

  return {
    horizontalPlane,
    positionScale: Math.min(1, maxUnscaledSceneSpanMeters / rawBounds.span),
  }
}

export function toKinematicsScenePosition(
  sample: KinematicsSample,
  sceneProjection: KinematicsSceneProjection,
) {
  const scale = sceneProjection.positionScale

  if (sceneProjection.horizontalPlane) {
    return new THREE.Vector3(sample.xMeters * scale, sample.zMeters * scale, 0)
  }

  return new THREE.Vector3(sample.xMeters * scale, 0, sample.zMeters * scale)
}

export function toKinematicsSceneDirection(
  vector: KinematicsVectorOverlay,
  sceneProjection: KinematicsSceneProjection,
) {
  if (sceneProjection.horizontalPlane) {
    return new THREE.Vector3(vector.direction.x, vector.direction.z, 0)
  }

  return new THREE.Vector3(vector.direction.x, 0, vector.direction.z)
}

function estimateRawSceneBounds(
  samples: KinematicsSample[],
  horizontalPlane: boolean,
  simulationId: KinematicsSimulationId,
) {
  if (simulationId === 'centripetal-force-curve') {
    const firstSample = samples[0]
    const radiusMeters = firstSample
      ? Math.hypot(firstSample.xMeters, firstSample.zMeters)
      : 1

    return {
      span: Math.max(1, radiusMeters * 2.8),
    }
  }

  const xs = samples.flatMap((sample) => [
    sample.xMeters,
    sample.secondaryXMeters,
  ])
  const ys = horizontalPlane ? samples.map((sample) => sample.zMeters) : [0]
  const zs = horizontalPlane
    ? [0]
    : samples.flatMap((sample) => [sample.zMeters, sample.secondaryZMeters])
  const minX = Math.min(0, ...xs)
  const maxX = Math.max(0, ...xs)
  const minY = Math.min(0, ...ys)
  const maxY = Math.max(0, ...ys)
  const minZ = Math.min(0, ...zs)
  const maxZ = Math.max(0, ...zs)

  return {
    span: Math.max(1, maxX - minX, maxY - minY, maxZ - minZ),
  }
}
