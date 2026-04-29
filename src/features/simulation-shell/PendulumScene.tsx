import { useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import * as THREE from 'three'
import type {
  PendulumSample,
  PendulumVectorOverlay,
} from '../../lib/physics/pendulum'
import { themeTokens } from '../../theme/appTheme'

type PendulumSceneProps = {
  sample: PendulumSample
  samples: PendulumSample[]
  showTrace: boolean
  showVectors: boolean
  traceSamples: PendulumSample[]
  vectors: PendulumVectorOverlay[]
}

type SceneObjects = {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.OrthographicCamera
  rod: THREE.Line
  rodPositions: Float32Array
  bob: THREE.Mesh
  trace: THREE.Line
  arrows: Record<PendulumVectorOverlay['id'], THREE.ArrowHelper>
}

const vectorColors: Record<PendulumVectorOverlay['id'], number> = {
  weight: 0xf43f5e,
  tension: 0xa3e635,
  velocity: 0x38bdf8,
}

const vectorIds = ['weight', 'tension', 'velocity'] as const
const maxTracePoints = 96

export function PendulumScene({
  sample,
  samples,
  showTrace,
  showVectors,
  traceSamples,
  vectors,
}: PendulumSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const objectsRef = useRef<SceneObjects | null>(null)

  useEffect(() => {
    if (import.meta.env.MODE === 'test') {
      return
    }

    const canvas = canvasRef.current
    const parent = canvas?.parentElement

    if (!canvas || !parent) {
      return
    }

    let renderer: THREE.WebGLRenderer

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        powerPreference: 'low-power',
      })
    } catch {
      return
    }

    const maxLength = Math.max(
      1,
      ...samples.map((item) => Math.hypot(item.xMeters, item.yMeters)),
    )
    const camera = new THREE.OrthographicCamera(-2, 2, 2, -2, 0.1, 20)
    const scene = new THREE.Scene()
    const centerY = -maxLength * 0.52

    camera.position.set(0, centerY, 6)
    camera.lookAt(0, centerY, 0)
    scene.background = new THREE.Color(themeTokens.background)

    const grid = new THREE.GridHelper(maxLength * 2.6, 8, 0x2a2f3a, 0x20242d)
    grid.rotation.x = Math.PI / 2
    grid.position.y = centerY
    grid.material.transparent = true
    grid.material.opacity = 0.42
    scene.add(grid)

    const pivot = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
    )
    scene.add(pivot)

    const rodPositions = new Float32Array(6)
    const rodGeometry = new THREE.BufferGeometry()
    const rodPositionAttribute = new THREE.BufferAttribute(rodPositions, 3)

    rodPositionAttribute.setUsage(THREE.DynamicDrawUsage)
    rodGeometry.setAttribute('position', rodPositionAttribute)

    const rod = new THREE.Line(
      rodGeometry,
      new THREE.LineBasicMaterial({ color: 0x2dd4bf }),
    )
    scene.add(rod)

    const bob = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 24, 16),
      new THREE.MeshBasicMaterial({ color: 0x2dd4bf }),
    )
    scene.add(bob)

    const trace = new THREE.Line(
      new THREE.BufferGeometry(),
      new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        opacity: 0.35,
        transparent: true,
      }),
    )
    scene.add(trace)

    const arrows = Object.fromEntries(
      vectorIds.map((vectorId) => [
        vectorId,
        new THREE.ArrowHelper(
          new THREE.Vector3(0, -1, 0),
          new THREE.Vector3(0, 0, 0),
          0.25,
          vectorColors[vectorId],
          0.08,
          0.045,
        ),
      ]),
    ) as Record<PendulumVectorOverlay['id'], THREE.ArrowHelper>

    Object.values(arrows).forEach((arrow) => {
      scene.add(arrow)
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

    const resizeRenderer = () => {
      const width = parent.clientWidth
      const height = parent.clientHeight
      const viewHeight = Math.max(3, maxLength * 2.35)
      const viewWidth = viewHeight * (width / Math.max(1, height))

      camera.left = -viewWidth / 2
      camera.right = viewWidth / 2
      camera.top = viewHeight / 2
      camera.bottom = -viewHeight / 2
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
      renderer.render(scene, camera)
    }
    const observer = new ResizeObserver(resizeRenderer)

    observer.observe(parent)
    resizeRenderer()

    objectsRef.current = {
      renderer,
      scene,
      camera,
      rod,
      rodPositions,
      bob,
      trace,
      arrows,
    }

    return () => {
      observer.disconnect()
      disposeScene(scene)
      renderer.dispose()
      objectsRef.current = null
    }
  }, [samples])

  useEffect(() => {
    const objects = objectsRef.current

    if (!objects) {
      return
    }

    const bobPosition = new THREE.Vector3(sample.xMeters, sample.yMeters, 0)
    const rodPositionAttribute = objects.rod.geometry.getAttribute(
      'position',
    ) as THREE.BufferAttribute

    objects.rodPositions[0] = 0
    objects.rodPositions[1] = 0
    objects.rodPositions[2] = 0
    objects.rodPositions[3] = bobPosition.x
    objects.rodPositions[4] = bobPosition.y
    objects.rodPositions[5] = bobPosition.z
    rodPositionAttribute.needsUpdate = true
    objects.bob.position.copy(bobPosition)

    vectors.forEach((vector) => {
      const arrow = objects.arrows[vector.id]
      const direction = new THREE.Vector3(
        vector.direction.x,
        vector.direction.y,
        0,
      )

      if (
        !showVectors ||
        direction.lengthSq() === 0 ||
        vector.magnitude === 0
      ) {
        arrow.visible = false
        return
      }

      arrow.visible = true
      arrow.position.copy(bobPosition)
      arrow.setDirection(direction.normalize())
      arrow.setLength(getVectorDisplayLength(vector), 0.08, 0.045)
    })

    objects.renderer.render(objects.scene, objects.camera)
  }, [sample, showVectors, vectors])

  useEffect(() => {
    const objects = objectsRef.current

    if (!objects) {
      return
    }

    if (!showTrace || traceSamples.length < 2) {
      objects.trace.visible = false
      objects.renderer.render(objects.scene, objects.camera)
      return
    }

    const stride = Math.max(
      1,
      Math.ceil(traceSamples.length / maxTracePoints),
    )
    const pointCount = Math.ceil(traceSamples.length / stride)
    const positions = new Float32Array(pointCount * 3)
    let positionIndex = 0

    for (
      let sampleIndex = 0;
      sampleIndex < traceSamples.length;
      sampleIndex += stride
    ) {
      const traceSample = traceSamples[sampleIndex]

      positions[positionIndex] = traceSample.xMeters
      positions[positionIndex + 1] = traceSample.yMeters
      positions[positionIndex + 2] = -0.04
      positionIndex += 3
    }

    objects.trace.visible = true
    objects.trace.geometry.dispose()
    objects.trace.geometry = new THREE.BufferGeometry()
    objects.trace.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    )
    objects.renderer.render(objects.scene, objects.camera)
  }, [showTrace, traceSamples])

  return (
    <Box
      sx={{
        height: { xs: 326, md: 382 },
        position: 'relative',
      }}
    >
      <Box
        component="canvas"
        ref={canvasRef}
        sx={{
          display: 'block',
          height: '100%',
          width: '100%',
        }}
      />
    </Box>
  )
}

function getVectorDisplayLength(vector: PendulumVectorOverlay) {
  const scale = vector.id === 'velocity' ? 0.34 : 0.11

  return Math.min(0.82, Math.max(0.16, vector.magnitude * scale))
}

function disposeScene(scene: THREE.Scene) {
  scene.traverse((object) => {
    const mesh = object as THREE.Mesh

    mesh.geometry?.dispose()

    if (Array.isArray(mesh.material)) {
      mesh.material.forEach((material) => {
        material.dispose()
      })
    } else {
      mesh.material?.dispose()
    }
  })
}
