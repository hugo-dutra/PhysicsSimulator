import * as THREE from 'three'

export type OrbitCameraPose = {
  pitchRadians: number
  yawRadians: number
}

export type CameraProjectionMode = 'orthographic' | 'perspective'

export type OrbitCamera = THREE.OrthographicCamera | THREE.PerspectiveCamera

type OrbitCameraDragConfig = {
  maxPitchRadians: number
  minPitchRadians: number
  pitchRadiansPerPixel: number
  yawRadiansPerPixel: number
}

type OrbitCameraTarget = {
  camera: OrbitCamera
  cameraRadius: number
  cameraTarget: THREE.Vector3
}

type OrbitCameraProjectionConfig = {
  cameraRadius: number
  fovDegrees?: number
  height: number
  width: number
}

type OrbitCameraCreateConfig = {
  far?: number
  fovDegrees?: number
  near?: number
}

export const maxOrbitCameraPitchRadians = Math.PI / 2 - 0.12
export const defaultOrbitCameraFovDegrees = 42

export const defaultOrbitCameraDragConfig: OrbitCameraDragConfig = {
  maxPitchRadians: maxOrbitCameraPitchRadians,
  minPitchRadians: -maxOrbitCameraPitchRadians,
  pitchRadiansPerPixel: 0.006,
  yawRadiansPerPixel: 0.008,
}

export function createOrbitCamera(
  mode: CameraProjectionMode,
  {
    far = 100,
    fovDegrees = defaultOrbitCameraFovDegrees,
    near = 0.1,
  }: OrbitCameraCreateConfig = {},
): OrbitCamera {
  const camera =
    mode === 'orthographic'
      ? new THREE.OrthographicCamera(-1, 1, 1, -1, near, far)
      : new THREE.PerspectiveCamera(fovDegrees, 1, near, far)

  camera.up.set(0, 0, 1)

  return camera
}

export function updateOrbitCameraProjection(
  camera: OrbitCamera,
  {
    cameraRadius,
    fovDegrees = defaultOrbitCameraFovDegrees,
    height,
    width,
  }: OrbitCameraProjectionConfig,
) {
  const safeHeight = Math.max(1, height)
  const aspect = Math.max(0.001, width / safeHeight)

  if (camera instanceof THREE.PerspectiveCamera) {
    camera.aspect = aspect
    camera.fov = fovDegrees
    camera.updateProjectionMatrix()
    return
  }

  const halfHeight = Math.max(
    0.05,
    cameraRadius * Math.tan((fovDegrees * Math.PI) / 360),
  )

  camera.left = -halfHeight * aspect
  camera.right = halfHeight * aspect
  camera.top = halfHeight
  camera.bottom = -halfHeight
  camera.updateProjectionMatrix()
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
