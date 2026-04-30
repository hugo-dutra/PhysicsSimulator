import * as THREE from 'three'

export type OrbitCameraPose = {
  pitchRadians: number
  yawRadians: number
}

type OrbitCameraDragConfig = {
  maxPitchRadians: number
  minPitchRadians: number
  pitchRadiansPerPixel: number
  yawRadiansPerPixel: number
}

type OrbitCameraTarget = {
  camera: THREE.PerspectiveCamera
  cameraRadius: number
  cameraTarget: THREE.Vector3
}

export const maxOrbitCameraPitchRadians = Math.PI / 2 - 0.12

export const defaultOrbitCameraDragConfig: OrbitCameraDragConfig = {
  maxPitchRadians: maxOrbitCameraPitchRadians,
  minPitchRadians: -maxOrbitCameraPitchRadians,
  pitchRadiansPerPixel: 0.006,
  yawRadiansPerPixel: 0.008,
}

export function updateOrbitCameraPose(
  pose: OrbitCameraPose,
  delta: { deltaClientX: number; deltaClientY: number },
  config: Partial<OrbitCameraDragConfig> = {},
): OrbitCameraPose {
  const resolvedConfig = {
    ...defaultOrbitCameraDragConfig,
    ...config,
  }

  return {
    pitchRadians: clamp(
      pose.pitchRadians - delta.deltaClientY * resolvedConfig.pitchRadiansPerPixel,
      resolvedConfig.minPitchRadians,
      resolvedConfig.maxPitchRadians,
    ),
    yawRadians:
      pose.yawRadians + delta.deltaClientX * resolvedConfig.yawRadiansPerPixel,
  }
}

export function positionOrbitCamera(
  target: OrbitCameraTarget | null,
  pose: OrbitCameraPose,
  azimuthOffsetRadians = 0,
) {
  if (!target) {
    return
  }

  const pitchRadians = clamp(
    pose.pitchRadians,
    -maxOrbitCameraPitchRadians,
    maxOrbitCameraPitchRadians,
  )
  const yawRadians = pose.yawRadians + azimuthOffsetRadians
  const horizontalRadius = Math.max(
    0.001,
    target.cameraRadius * Math.cos(pitchRadians),
  )
  const verticalOffset = target.cameraRadius * Math.sin(pitchRadians)

  target.camera.position.set(
    target.cameraTarget.x + Math.cos(yawRadians) * horizontalRadius,
    target.cameraTarget.y + Math.sin(yawRadians) * horizontalRadius,
    target.cameraTarget.z + verticalOffset,
  )
  target.camera.lookAt(target.cameraTarget)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
