import { describe, expect, it } from 'vitest'
import * as THREE from 'three'
import {
  maxOrbitCameraPitchRadians,
  positionOrbitCamera,
  updateOrbitCameraPose,
  type OrbitCameraPose,
} from './orbitCamera'

describe('orbit camera controls', () => {
  it('updates yaw and pitch from pointer drag while clamping top and bottom views', () => {
    const start: OrbitCameraPose = {
      pitchRadians: 0,
      yawRadians: 0,
    }

    const draggedUp = updateOrbitCameraPose(start, {
      deltaClientX: 25,
      deltaClientY: -40,
    })

    expect(draggedUp.yawRadians).toBeCloseTo(0.2)
    expect(draggedUp.pitchRadians).toBeCloseTo(0.24)

    const clampedBottom = updateOrbitCameraPose(draggedUp, {
      deltaClientX: 0,
      deltaClientY: 1000,
    })

    expect(clampedBottom.pitchRadians).toBeCloseTo(
      -maxOrbitCameraPitchRadians,
    )
  })

  it('positions the camera above or below the target from pitch', () => {
    const camera = new THREE.PerspectiveCamera()
    const cameraTarget = new THREE.Vector3(2, 3, 4)

    positionOrbitCamera(
      {
        camera,
        cameraRadius: 10,
        cameraTarget,
      },
      {
        pitchRadians: Math.PI / 6,
        yawRadians: 0,
      },
    )

    expect(camera.position.x).toBeCloseTo(2 + Math.cos(Math.PI / 6) * 10)
    expect(camera.position.y).toBeCloseTo(3)
    expect(camera.position.z).toBeCloseTo(9)

    positionOrbitCamera(
      {
        camera,
        cameraRadius: 10,
        cameraTarget,
      },
      {
        pitchRadians: -Math.PI / 6,
        yawRadians: 0,
      },
    )

    expect(camera.position.z).toBeCloseTo(-1)
  })
})
