import * as THREE from 'three'
import {
  hydrostaticTankDepthMeters,
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
    simulationId === 'gravitational-field-orbits' ||
    simulationId === 'particle-equilibrium' ||
    simulationId === 'rigid-body-rotation' ||
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

export function toOrbitSatelliteScenePosition(
  sample: KinematicsSample,
  sceneProjection: KinematicsSceneProjection,
  minimumSceneRadius = 0,
) {
  const planetPosition = toKinematicsScenePosition(sample, sceneProjection)
  const satellitePosition = toKinematicsScenePosition(
    {
      ...sample,
      xMeters: sample.secondaryXMeters,
      zMeters: sample.secondaryZMeters,
    },
    sceneProjection,
  )

  if (minimumSceneRadius <= 0) {
    return satellitePosition
  }

  const satelliteOffset = satellitePosition.clone().sub(planetPosition)
  const currentSceneRadius = satelliteOffset.length()

  if (currentSceneRadius >= minimumSceneRadius) {
    return satellitePosition
  }

  if (currentSceneRadius <= 1e-9) {
    return planetPosition.clone().add(new THREE.Vector3(minimumSceneRadius, 0, 0))
  }

  return planetPosition
    .clone()
    .add(satelliteOffset.multiplyScalar(minimumSceneRadius / currentSceneRadius))
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

export type UniformLinearMotionTrackRange = {
  maxMeters: number
  minMeters: number
  tickStepMeters: number
}

export type UniformlyAcceleratedMotionTowerRange = {
  maxMeters: number
  minMeters: number
  tickStepMeters: number
}

export function getUniformLinearMotionTrackRange(
  samples: KinematicsSample[],
): UniformLinearMotionTrackRange {
  const positions = samples.flatMap((sample) => [
    sample.positionMeters,
    sample.positionMeters - sample.displacementMeters,
  ])
  const minPositionMeters = Math.min(0, ...positions)
  const maxPositionMeters = Math.max(0, ...positions)
  const paddedMinMeters = Math.floor(minPositionMeters - 1)
  const paddedMaxMeters = Math.ceil(maxPositionMeters + 1)
  const spanMeters = Math.max(1, paddedMaxMeters - paddedMinMeters)

  return {
    maxMeters: paddedMaxMeters,
    minMeters: paddedMinMeters,
    tickStepMeters: spanMeters > 40 ? 5 : spanMeters > 24 ? 2 : 1,
  }
}

export function getUniformlyAcceleratedMotionTowerRange(
  samples: KinematicsSample[],
): UniformlyAcceleratedMotionTowerRange {
  const positions = samples.flatMap((sample) => [
    sample.zMeters,
    sample.positionMeters,
    sample.positionMeters - sample.displacementMeters,
  ])
  const minPositionMeters = Math.min(0, ...positions)
  const maxPositionMeters = Math.max(0, ...positions)
  const rawSpanMeters = Math.max(1, maxPositionMeters - minPositionMeters)
  const paddingMeters = Math.max(0.6, rawSpanMeters * 0.08)
  const paddedMinMeters = Math.floor(minPositionMeters - paddingMeters)
  const paddedMaxMeters = Math.ceil(maxPositionMeters + paddingMeters)
  const spanMeters = Math.max(1, paddedMaxMeters - paddedMinMeters)

  return {
    maxMeters: paddedMaxMeters,
    minMeters: paddedMinMeters,
    tickStepMeters: spanMeters > 48 ? 10 : spanMeters > 24 ? 5 : spanMeters > 10 ? 2 : 1,
  }
}

export function selectUniformLinearMotionStrobeSamples(
  samples: KinematicsSample[],
  maxMarkers = 20,
) {
  const firstSample = samples[0]
  const lastSample = samples.at(-1)

  if (!firstSample || !lastSample) {
    return []
  }

  const finalSecond = Math.max(0, Math.floor(lastSample.timeSeconds))
  const markerStepSeconds = Math.max(
    1,
    Math.ceil(finalSecond / Math.max(1, maxMarkers)),
  )

  return Array.from(
    { length: Math.floor(finalSecond / markerStepSeconds) + 1 },
    (_, index) =>
      findNearestSampleByTime(samples, index * markerStepSeconds) ??
      firstSample,
  )
}

export function selectUniformlyAcceleratedMotionStrobeSamples(
  samples: KinematicsSample[],
  maxMarkers = 12,
) {
  const firstSample = samples[0]
  const lastSample = samples.at(-1)

  if (!firstSample || !lastSample) {
    return []
  }

  const firstGroundedSample = samples.find((sample) => sample.isGrounded)
  const finalActiveTimeSeconds =
    firstGroundedSample?.timeSeconds ?? lastSample.timeSeconds
  const markerStepSeconds = Math.max(
    1,
    Math.ceil(finalActiveTimeSeconds / Math.max(1, maxMarkers)),
  )
  const markerTimes: number[] = []

  for (
    let timeSeconds = 0;
    timeSeconds < finalActiveTimeSeconds - 1e-9;
    timeSeconds += markerStepSeconds
  ) {
    markerTimes.push(timeSeconds)
  }

  if (
    markerTimes.length === 0 ||
    Math.abs(markerTimes[markerTimes.length - 1] - finalActiveTimeSeconds) >
      1e-6
  ) {
    markerTimes.push(finalActiveTimeSeconds)
  }

  return markerTimes
    .slice(0, maxMarkers + 1)
    .map((timeSeconds) => findNearestSampleByTime(samples, timeSeconds) ?? firstSample)
}

export function selectUniformCircularMotionStrobeSamples(
  samples: KinematicsSample[],
  maxMarkers = 12,
) {
  const firstSample = samples[0]
  const lastSample = samples.at(-1)

  if (!firstSample || !lastSample) {
    return []
  }

  const availableDurationSeconds = Math.max(
    0,
    lastSample.timeSeconds - firstSample.timeSeconds,
  )
  const periodSeconds = firstSample.periodSeconds
  const hasFullPeriod =
    Number.isFinite(periodSeconds) &&
    periodSeconds > 0 &&
    availableDurationSeconds + 1e-6 >= periodSeconds
  const markerCount = hasFullPeriod
    ? Math.max(4, maxMarkers)
    : Math.max(
        2,
        Math.min(maxMarkers, Math.floor(availableDurationSeconds) + 1),
      )
  const markerStepSeconds = hasFullPeriod
    ? periodSeconds / markerCount
    : markerCount > 1
      ? availableDurationSeconds / (markerCount - 1)
      : 0

  return Array.from({ length: markerCount }, (_, index) => {
    const targetTimeSeconds =
      firstSample.timeSeconds + markerStepSeconds * index

    return findNearestSampleByTime(samples, targetTimeSeconds) ?? firstSample
  })
}

function findNearestSampleByTime(
  samples: KinematicsSample[],
  targetTimeSeconds: number,
) {
  let nearestSample = samples[0]
  let nearestDistance = Number.POSITIVE_INFINITY

  for (const sample of samples) {
    const distance = Math.abs(sample.timeSeconds - targetTimeSeconds)

    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestSample = sample
    }
  }

  return nearestSample
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

  if (simulationId === 'work-energy-track') {
    const firstSample = samples[0]
    const halfWidthMeters = firstSample?.primaryRadiusMeters ?? 1
    const rimHeightMeters = firstSample?.secondaryRadiusMeters ?? 1

    return {
      span: Math.max(1, halfWidthMeters * 2.35, rimHeightMeters * 1.35),
    }
  }

  if (simulationId === 'mass-spring') {
    const firstSample = samples[0]
    const springTopMeters = firstSample?.primaryRadiusMeters ?? 1
    const minZ = Math.min(0, ...samples.map((sample) => sample.zMeters))
    const maxZ = Math.max(
      springTopMeters,
      ...samples.map((sample) => sample.zMeters),
    )

    return {
      span: Math.max(1, maxZ - minZ, springTopMeters),
    }
  }

  if (simulationId === 'hydrostatics-buoyancy') {
    const firstSample = samples[0]
    const sphereRadiusMeters = firstSample?.primaryRadiusMeters ?? 0.3

    return {
      span: Math.max(
        1,
        hydrostaticTankDepthMeters + sphereRadiusMeters,
        sphereRadiusMeters * 6,
      ),
    }
  }

  if (simulationId === 'torque-levers-center-mass') {
    const firstSample = samples[0]
    const leftArmMeters = firstSample?.leftArmMeters ?? 1
    const rightArmMeters = firstSample?.rightArmMeters ?? 1
    const appliedForceArmMeters = firstSample?.appliedForceArmMeters ?? 0
    const leverHalfSpanMeters = Math.max(
      leftArmMeters,
      rightArmMeters,
      appliedForceArmMeters,
    )

    return {
      span: Math.max(1, leverHalfSpanMeters * 2.25, leftArmMeters + rightArmMeters),
    }
  }

  const xs = samples.flatMap((sample) => [
    sample.xMeters,
    sample.secondaryXMeters,
  ])
  const ys = horizontalPlane
    ? samples.flatMap((sample) => [sample.zMeters, sample.secondaryZMeters])
    : [0]
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
