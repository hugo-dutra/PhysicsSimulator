import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react'
import { Box } from '@mui/material'
import * as THREE from 'three'
import {
  getKinematicsVectorOverlays,
  interpolateKinematicsSample,
  type KinematicsSample,
  type KinematicsSimulationId,
  type KinematicsVectorOverlay,
} from '../../lib/physics/kinematics'
import {
  cancelAnimationFrameSafe,
  createFrameStatsWindow,
  readInterpolatedTimelineFrame,
  requestAnimationFrameSafe,
  updateFrameStatsWindow,
  type FrameStats,
} from '../../lib/rendering/visualRuntime'
import { themeTokens } from '../../theme/appTheme'
import {
  createKinematicsSceneProjection,
  toKinematicsSceneDirection,
  toKinematicsScenePosition,
  type KinematicsSceneProjection,
} from './KinematicsSceneProjection'

export type KinematicsFrameStats = FrameStats

type KinematicsSceneProps = {
  durationSeconds: number
  isPlaying: boolean
  maximized?: boolean
  onSampleChange: (sample: KinematicsSample, stats: KinematicsFrameStats) => void
  playbackRate: number
  resetVersion: number
  samples: KinematicsSample[]
  showTrace: boolean
  showVectors: boolean
  simulationId: KinematicsSimulationId
}

type SceneObjects = {
  arrows: Record<KinematicsVectorOverlay['id'], THREE.ArrowHelper>
  body: THREE.Mesh
  camera: THREE.PerspectiveCamera
  cameraMaxRadius: number
  cameraMinRadius: number
  cameraRadius: number
  cameraTarget: THREE.Vector3
  renderer: THREE.WebGLRenderer
  rope: THREE.Line
  ropePositionAttribute: THREE.BufferAttribute
  ropePositions: Float32Array
  scene: THREE.Scene
  sceneProjection: KinematicsSceneProjection
  secondaryBody: THREE.Mesh
  pulley: THREE.Mesh
  supportBar: THREE.Mesh
  supportStem: THREE.Mesh
  trace: THREE.Line
  traceColorAttribute: THREE.BufferAttribute
  traceColors: Float32Array
  tracePositionAttribute: THREE.BufferAttribute
  tracePositions: Float32Array
  atwoodMassHalfHeight: number
}

type RuntimeProps = {
  durationSeconds: number
  onSampleChange: (sample: KinematicsSample, stats: KinematicsFrameStats) => void
  playbackRate: number
  samples: KinematicsSample[]
  showTrace: boolean
  showVectors: boolean
  simulationId: KinematicsSimulationId
}

type DragState = {
  lastClientX: number
  pointerId: number
}

const vectorColors: Record<KinematicsVectorOverlay['id'], number> = {
  acceleration: 0xf59e0b,
  appliedForce: 0x2dd4bf,
  centripetal: 0xf59e0b,
  displacement: 0xa3e635,
  friction: 0xf59e0b,
  gravity: 0xf43f5e,
  normal: 0xa3e635,
  tension: 0xa3e635,
  velocity: 0x38bdf8,
  weight: 0xf43f5e,
}

const vectorIds = [
  'displacement',
  'velocity',
  'acceleration',
  'gravity',
  'centripetal',
  'tension',
  'weight',
  'friction',
  'normal',
  'appliedForce',
] as const
const bodySize = 0.22
const atwoodPulleyRadius = 0.34
const atwoodRopePointCapacity = 48
const atwoodRopeArcSegments = 28
const maxPathPoints = 360
const maxTracePoints = 120
const traceFadeSeconds = 2.4
const traceMinOpacity = 0.04
const traceMaxOpacity = 0.58
const traceColor = {
  blue: 0xf8 / 255,
  green: 0xbd / 255,
  red: 0x38 / 255,
}
const readoutIntervalMs = 33
const maxFrameDeltaSeconds = 0.12
const initialCameraYawRadians = -0.58
const dragYawRadiansPerPixel = 0.008
const wheelZoomSensitivity = 0.0014
const minCameraRadiusScale = 0.4
const maxCameraRadiusScale = 2.4

export function KinematicsScene({
  durationSeconds,
  isPlaying,
  maximized = false,
  onSampleChange,
  playbackRate,
  resetVersion,
  samples,
  showTrace,
  showVectors,
  simulationId,
}: KinematicsSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const objectsRef = useRef<SceneObjects | null>(null)
  const runtimeRef = useRef<RuntimeProps>({
    durationSeconds,
    onSampleChange,
    playbackRate,
    samples,
    showTrace,
    showVectors,
    simulationId,
  })
  const elapsedSecondsRef = useRef(0)
  const frameIdRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number | null>(null)
  const lastReadoutTimeRef = useRef(0)
  const cameraYawRadiansRef = useRef(initialCameraYawRadians)
  const dragStateRef = useRef<DragState | null>(null)
  const statsWindowRef = useRef(createFrameStatsWindow())

  const renderCurrentFrame = useCallback((notify = false) => {
    const objects = objectsRef.current
    const runtime = runtimeRef.current
    const frame = readInterpolatedTimelineFrame(
      runtime.samples,
      runtime.durationSeconds,
      elapsedSecondsRef.current,
      interpolateKinematicsSample,
    )
    const sample = frame.sample

    if (!objects || !sample) {
      return
    }

    updateKinematicsObjects({
      objects,
      sample,
      sampleIndex: frame.sampleIndex,
      samples: runtime.samples,
      showTrace: runtime.showTrace,
      showVectors: runtime.showVectors,
      simulationId: runtime.simulationId,
    })
    objects.renderer.render(objects.scene, objects.camera)

    if (notify) {
      runtime.onSampleChange(sample, statsWindowRef.current.stats)
    }
  }, [])

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      dragStateRef.current = {
        lastClientX: event.clientX,
        pointerId: event.pointerId,
      }
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [],
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      const dragState = dragStateRef.current

      if (!dragState || dragState.pointerId !== event.pointerId) {
        return
      }

      const deltaX = event.clientX - dragState.lastClientX

      if (deltaX === 0) {
        return
      }

      dragState.lastClientX = event.clientX
      cameraYawRadiansRef.current += deltaX * dragYawRadiansPerPixel

      const objects = objectsRef.current

      if (objects) {
        updateOrbitCamera(objects, cameraYawRadiansRef.current)
        renderCurrentFrame()
      }
    },
    [renderCurrentFrame],
  )

  const handlePointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLCanvasElement>) => {
      const dragState = dragStateRef.current

      if (dragState?.pointerId === event.pointerId) {
        dragStateRef.current = null
      }

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    },
    [],
  )

  const handleWheel = useCallback(
    (event: ReactWheelEvent<HTMLCanvasElement>) => {
      if (!event.shiftKey) {
        return
      }

      const objects = objectsRef.current

      if (!objects) {
        return
      }

      event.preventDefault()

      const zoomFactor = Math.exp(
        normalizeWheelDeltaY(event) * wheelZoomSensitivity,
      )
      const nextCameraRadius = clamp(
        objects.cameraRadius * zoomFactor,
        objects.cameraMinRadius,
        objects.cameraMaxRadius,
      )

      if (Math.abs(nextCameraRadius - objects.cameraRadius) < 0.001) {
        return
      }

      objects.cameraRadius = nextCameraRadius
      updateOrbitCamera(objects, cameraYawRadiansRef.current)
      renderCurrentFrame()
    },
    [renderCurrentFrame],
  )

  useEffect(() => {
    runtimeRef.current = {
      durationSeconds,
      onSampleChange,
      playbackRate,
      samples,
      showTrace,
      showVectors,
      simulationId,
    }

    renderCurrentFrame()
  }, [
    durationSeconds,
    onSampleChange,
    playbackRate,
    renderCurrentFrame,
    samples,
    showTrace,
    showVectors,
    simulationId,
  ])

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
        antialias: false,
        canvas,
        powerPreference: 'high-performance',
      })
    } catch {
      return
    }

    const sceneProjection = createKinematicsSceneProjection(
      samples,
      simulationId,
    )
    const bounds = estimateSceneBounds(samples, sceneProjection, simulationId)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 160)
    const cameraTarget = new THREE.Vector3(
      bounds.centerX,
      bounds.centerY,
      bounds.centerZ,
    )
    const cameraRadius = Math.max(4.2, bounds.span * 1.35)
    const cameraMinRadius = Math.max(1.2, cameraRadius * minCameraRadiusScale)
    const cameraMaxRadius = cameraRadius * maxCameraRadiusScale

    camera.up.set(0, 0, 1)
    scene.background = new THREE.Color(themeTokens.background)
    scene.add(new THREE.AmbientLight(0xffffff, 0.64))
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.12)

    keyLight.position.set(-2.4, -3.2, 5)
    scene.add(keyLight)

    const grid = new THREE.GridHelper(
      Math.max(5, bounds.span * 1.25),
      10,
      0x2a2f3a,
      0x20242d,
    )

    grid.rotation.x = Math.PI / 2
    grid.position.set(bounds.centerX, bounds.centerY, 0)
    grid.material.transparent = true
    grid.material.opacity = 0.38
    scene.add(grid)

    scene.add(createReferencePath(samples, simulationId, sceneProjection))

    const sceneBodySize = getBodyDisplaySize(bounds.span)
    const atwoodMassSize = sceneBodySize * 1.8
    const body = new THREE.Mesh(
      simulationId === 'atwood-machine'
        ? new THREE.BoxGeometry(atwoodMassSize, atwoodMassSize, atwoodMassSize)
        : new THREE.SphereGeometry(sceneBodySize, 24, 16),
      new THREE.MeshStandardMaterial({
        color: 0x2dd4bf,
        metalness: 0.08,
        roughness: 0.42,
      }),
    )
    scene.add(body)

    const secondaryBody = new THREE.Mesh(
      new THREE.BoxGeometry(atwoodMassSize, atwoodMassSize, atwoodMassSize),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.05,
        roughness: 0.5,
      }),
    )
    scene.add(secondaryBody)

    const pulley = new THREE.Mesh(
      new THREE.TorusGeometry(atwoodPulleyRadius, 0.035, 10, 36),
      new THREE.MeshStandardMaterial({
        color: 0xe6e8ec,
        metalness: 0.2,
        roughness: 0.44,
      }),
    )
    pulley.rotation.x = Math.PI / 2
    scene.add(pulley)

    const supportBar = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({
        color: 0xe6e8ec,
        metalness: 0.18,
        roughness: 0.48,
      }),
    )
    const supportStem = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({
        color: 0xe6e8ec,
        metalness: 0.18,
        roughness: 0.48,
      }),
    )

    scene.add(supportBar)
    scene.add(supportStem)

    const ropePositions = new Float32Array(atwoodRopePointCapacity * 3)
    const ropeGeometry = new THREE.BufferGeometry()
    const ropePositionAttribute = new THREE.BufferAttribute(ropePositions, 3)

    ropePositionAttribute.setUsage(THREE.DynamicDrawUsage)
    ropeGeometry.setAttribute('position', ropePositionAttribute)
    ropeGeometry.setDrawRange(0, 4)
    const rope = new THREE.Line(
      ropeGeometry,
      new THREE.LineBasicMaterial({
        color: 0xe6e8ec,
        transparent: true,
        opacity: 0.88,
      }),
    )
    scene.add(rope)

    const tracePositions = new Float32Array(maxTracePoints * 3)
    const traceColors = new Float32Array(maxTracePoints * 4)
    const traceGeometry = new THREE.BufferGeometry()
    const tracePositionAttribute = new THREE.BufferAttribute(tracePositions, 3)
    const traceColorAttribute = new THREE.BufferAttribute(traceColors, 4)

    tracePositionAttribute.setUsage(THREE.DynamicDrawUsage)
    traceColorAttribute.setUsage(THREE.DynamicDrawUsage)
    traceGeometry.setAttribute('position', tracePositionAttribute)
    traceGeometry.setAttribute('color', traceColorAttribute)
    traceGeometry.setDrawRange(0, 0)

    const trace = new THREE.Line(
      traceGeometry,
      new THREE.LineBasicMaterial({
        depthWrite: false,
        transparent: true,
        vertexColors: true,
      }),
    )
    scene.add(trace)

    const arrows = Object.fromEntries(
      vectorIds.map((vectorId) => [
        vectorId,
        new THREE.ArrowHelper(
          new THREE.Vector3(1, 0, 0),
          new THREE.Vector3(0, 0, 0),
          0.35,
          vectorColors[vectorId],
          0.08,
          0.045,
        ),
      ]),
    ) as Record<KinematicsVectorOverlay['id'], THREE.ArrowHelper>

    Object.values(arrows).forEach((arrow) => {
      scene.add(arrow)
    })

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25))

    const resizeRenderer = () => {
      const width = parent.clientWidth
      const height = parent.clientHeight

      camera.aspect = width / Math.max(1, height)
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
      updateOrbitCamera(objectsRef.current, cameraYawRadiansRef.current)
      renderCurrentFrame()
    }
    const observer = new ResizeObserver(resizeRenderer)

    objectsRef.current = {
      arrows,
      body,
      camera,
      cameraMaxRadius,
      cameraMinRadius,
      cameraRadius,
      cameraTarget,
      renderer,
      rope,
      ropePositionAttribute,
      ropePositions,
      scene,
      sceneProjection,
      secondaryBody,
      pulley,
      supportBar,
      supportStem,
      trace,
      traceColorAttribute,
      traceColors,
      tracePositionAttribute,
      tracePositions,
      atwoodMassHalfHeight: atwoodMassSize / 2,
    }

    cameraYawRadiansRef.current = getInitialCameraYawRadians(simulationId)
    observer.observe(parent)
    updateOrbitCamera(objectsRef.current, cameraYawRadiansRef.current)
    resizeRenderer()

    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrameSafe(frameIdRef.current)
        frameIdRef.current = null
      }

      observer.disconnect()
      disposeScene(scene)
      renderer.dispose()
      objectsRef.current = null
    }
  }, [renderCurrentFrame, samples, simulationId])

  useEffect(() => {
    elapsedSecondsRef.current = 0
    lastFrameTimeRef.current = null
    lastReadoutTimeRef.current = 0
    statsWindowRef.current = createFrameStatsWindow()
    renderCurrentFrame(true)
  }, [renderCurrentFrame, resetVersion, samples])

  useEffect(() => {
    if (import.meta.env.MODE === 'test') {
      return
    }

    if (!isPlaying) {
      if (frameIdRef.current !== null) {
        cancelAnimationFrameSafe(frameIdRef.current)
        frameIdRef.current = null
      }

      lastFrameTimeRef.current = null
      renderCurrentFrame(true)
      return
    }

    const tick = (timestamp: number) => {
      const runtime = runtimeRef.current
      const lastFrameTime = lastFrameTimeRef.current ?? timestamp
      const deltaSeconds = Math.min(
        maxFrameDeltaSeconds,
        Math.max(0, (timestamp - lastFrameTime) / 1000),
      )
      const nextElapsedSeconds =
        elapsedSecondsRef.current + deltaSeconds * runtime.playbackRate

      lastFrameTimeRef.current = timestamp
      elapsedSecondsRef.current =
        nextElapsedSeconds >= runtime.durationSeconds
          ? nextElapsedSeconds % runtime.durationSeconds
          : nextElapsedSeconds

      updateFrameStatsWindow(statsWindowRef.current, timestamp, deltaSeconds)
      renderCurrentFrame(timestamp - lastReadoutTimeRef.current >= readoutIntervalMs)

      if (timestamp - lastReadoutTimeRef.current >= readoutIntervalMs) {
        lastReadoutTimeRef.current = timestamp
      }

      frameIdRef.current = requestAnimationFrameSafe(tick)
    }

    frameIdRef.current = requestAnimationFrameSafe(tick)

    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrameSafe(frameIdRef.current)
        frameIdRef.current = null
      }

      lastFrameTimeRef.current = null
    }
  }, [isPlaying, renderCurrentFrame, samples])

  return (
    <Box
      sx={{
        height: maximized
          ? {
              xs: '52svh',
              md: 'calc(100svh - 256px)',
            }
          : { xs: 326, md: 382 },
        minHeight: maximized ? { xs: 320, md: 430 } : undefined,
        position: 'relative',
      }}
    >
      <Box
        aria-label="Cena 3D de Cinematica com arraste horizontal para orbitar o eixo Z e Shift + scroll para zoom"
        component="canvas"
        onPointerCancel={handlePointerEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onWheel={handleWheel}
        ref={canvasRef}
        sx={{
          cursor: 'grab',
          display: 'block',
          height: '100%',
          touchAction: 'none',
          width: '100%',
          '&:active': {
            cursor: 'grabbing',
          },
        }}
      />
    </Box>
  )
}

function updateKinematicsObjects({
  objects,
  sample,
  sampleIndex,
  samples,
  showTrace,
  showVectors,
  simulationId,
}: {
  objects: SceneObjects
  sample: KinematicsSample
  sampleIndex: number
  samples: KinematicsSample[]
  showTrace: boolean
  showVectors: boolean
  simulationId: KinematicsSimulationId
}) {
  const bodyPosition = toKinematicsScenePosition(
    sample,
    objects.sceneProjection,
  )

  objects.body.position.copy(bodyPosition)
  updateAtwoodObjects(objects, sample, simulationId)
  Object.values(objects.arrows).forEach((arrow) => {
    arrow.visible = false
  })

  getKinematicsVectorOverlays(sample, simulationId).forEach((vector) => {
    const arrow = objects.arrows[vector.id]
    const direction = toKinematicsSceneDirection(
      vector,
      objects.sceneProjection,
    )

    if (!showVectors || direction.lengthSq() === 0 || vector.magnitude === 0) {
      arrow.visible = false
      return
    }

    arrow.visible = true
    arrow.position.copy(bodyPosition)
    arrow.setDirection(direction.normalize())
    arrow.setLength(getVectorDisplayLength(vector), 0.08, 0.045)
  })

  updateTrace(objects, samples, sampleIndex, sample, showTrace)
}

function updateAtwoodObjects(
  objects: SceneObjects,
  sample: KinematicsSample,
  simulationId: KinematicsSimulationId,
) {
  const isAtwood = simulationId === 'atwood-machine'

  objects.secondaryBody.visible = isAtwood
  objects.pulley.visible = isAtwood
  objects.rope.visible = isAtwood
  objects.supportBar.visible = isAtwood
  objects.supportStem.visible = isAtwood

  if (!isAtwood) {
    return
  }

  const primaryPosition = toKinematicsScenePosition(
    sample,
    objects.sceneProjection,
  )
  const secondaryPosition = toKinematicsScenePosition(
    {
      ...sample,
      xMeters: sample.secondaryXMeters,
      zMeters: sample.secondaryZMeters,
    },
    objects.sceneProjection,
  )
  const pulleyRadius = Math.max(
    atwoodPulleyRadius,
    Math.abs(primaryPosition.x - secondaryPosition.x) / 2,
  )
  const pulleyX = (primaryPosition.x + secondaryPosition.x) / 2
  const travelTopZ =
    (sample.zMeters + sample.secondaryZMeters) *
    objects.sceneProjection.positionScale
  const pulleyZ = travelTopZ + pulleyRadius + 0.42
  const supportZ = pulleyZ + pulleyRadius + 0.34
  const supportHeight = Math.max(0.2, supportZ - pulleyZ)
  const leftRopeX = pulleyX - pulleyRadius
  const rightRopeX = pulleyX + pulleyRadius
  const leftMassTop = new THREE.Vector3(
    leftRopeX,
    0,
    secondaryPosition.z + objects.atwoodMassHalfHeight,
  )
  const rightMassTop = new THREE.Vector3(
    rightRopeX,
    0,
    primaryPosition.z + objects.atwoodMassHalfHeight,
  )

  objects.secondaryBody.position.set(leftRopeX, 0, secondaryPosition.z)
  objects.body.position.set(rightRopeX, 0, primaryPosition.z)
  objects.pulley.position.set(pulleyX, 0, pulleyZ)
  objects.pulley.scale.setScalar(pulleyRadius / atwoodPulleyRadius)
  objects.supportBar.position.set(pulleyX, 0, supportZ)
  objects.supportBar.scale.set(
    Math.abs(rightRopeX - leftRopeX) + pulleyRadius * 1.15,
    0.075,
    0.075,
  )
  objects.supportStem.position.set(pulleyX, 0, pulleyZ + supportHeight / 2)
  objects.supportStem.scale.set(0.075, 0.075, supportHeight)

  const ropePoints = createAtwoodRopePoints({
    leftMassTop,
    pulleyRadius,
    pulleyX,
    pulleyZ,
    rightMassTop,
  })

  ropePoints.forEach((point, index) => {
    const offset = index * 3

    objects.ropePositions[offset] = point.x
    objects.ropePositions[offset + 1] = point.y
    objects.ropePositions[offset + 2] = point.z
  })
  objects.rope.geometry.setDrawRange(0, ropePoints.length)
  objects.ropePositionAttribute.needsUpdate = true
}

function createAtwoodRopePoints({
  leftMassTop,
  pulleyRadius,
  pulleyX,
  pulleyZ,
  rightMassTop,
}: {
  leftMassTop: THREE.Vector3
  pulleyRadius: number
  pulleyX: number
  pulleyZ: number
  rightMassTop: THREE.Vector3
}) {
  const points = [leftMassTop]

  for (let index = 0; index <= atwoodRopeArcSegments; index += 1) {
    const theta = Math.PI - (Math.PI * index) / atwoodRopeArcSegments

    points.push(
      new THREE.Vector3(
        pulleyX + pulleyRadius * Math.cos(theta),
        0,
        pulleyZ + pulleyRadius * Math.sin(theta),
      ),
    )
  }

  points.push(rightMassTop)

  return points.slice(0, atwoodRopePointCapacity)
}

function updateTrace(
  objects: SceneObjects,
  samples: KinematicsSample[],
  sampleIndex: number,
  currentSample: KinematicsSample,
  showTrace: boolean,
) {
  if (!showTrace || sampleIndex < 1) {
    objects.trace.visible = false
    objects.trace.geometry.setDrawRange(0, 0)
    return
  }

  const newestTimeSeconds = currentSample.timeSeconds
  const oldestVisibleTimeSeconds = Math.max(
    0,
    newestTimeSeconds - traceFadeSeconds,
  )
  const firstTraceSampleIndex = findTraceStartIndex(
    samples,
    sampleIndex,
    oldestVisibleTimeSeconds,
  )
  const traceSamples = samples
    .slice(firstTraceSampleIndex, sampleIndex + 1)
    .slice(-maxTracePoints)
  const drawCount = traceSamples.length

  if (drawCount < 2) {
    objects.trace.visible = false
    objects.trace.geometry.setDrawRange(0, 0)
    return
  }

  traceSamples.forEach((sample, traceIndex) => {
    const position = toKinematicsScenePosition(
      sample,
      objects.sceneProjection,
    )
    const positionOffset = traceIndex * 3
    const colorOffset = traceIndex * 4
    const ageRatio = Math.min(
      1,
      Math.max(0, (newestTimeSeconds - sample.timeSeconds) / traceFadeSeconds),
    )
    const opacity = traceMaxOpacity - ageRatio * (traceMaxOpacity - traceMinOpacity)

    objects.tracePositions[positionOffset] = position.x
    objects.tracePositions[positionOffset + 1] = position.y
    objects.tracePositions[positionOffset + 2] = position.z
    objects.traceColors[colorOffset] = traceColor.red
    objects.traceColors[colorOffset + 1] = traceColor.green
    objects.traceColors[colorOffset + 2] = traceColor.blue
    objects.traceColors[colorOffset + 3] = opacity
  })

  objects.trace.visible = true
  objects.trace.geometry.setDrawRange(0, drawCount)
  objects.tracePositionAttribute.needsUpdate = true
  objects.traceColorAttribute.needsUpdate = true
}

function createReferencePath(
  samples: KinematicsSample[],
  simulationId: KinematicsSimulationId,
  sceneProjection: KinematicsSceneProjection,
) {
  if (simulationId === 'atwood-machine') {
    return new THREE.Group()
  }

  if (
    simulationId === 'uniform-circular-motion' ||
    simulationId === 'centripetal-force-curve'
  ) {
    return createCircularReferencePath(samples, simulationId, sceneProjection)
  }

  const pathSamples = downsamplePath(samples)
  const positions = new Float32Array(Math.max(2, pathSamples.length) * 3)

  pathSamples.forEach((sample, index) => {
    const position = toKinematicsScenePosition(sample, sceneProjection)
    const offset = index * 3

    positions[offset] = position.x
    positions[offset + 1] = position.y
    positions[offset + 2] = position.z
  })

  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setDrawRange(0, pathSamples.length)

  const material = new THREE.LineBasicMaterial({
    color: 0x2dd4bf,
    transparent: true,
    opacity: 0.42,
  })

  return new THREE.Line(geometry, material)
}

function createCircularReferencePath(
  samples: KinematicsSample[],
  simulationId: KinematicsSimulationId,
  sceneProjection: KinematicsSceneProjection,
) {
  const firstSample = samples[0]

  if (!firstSample) {
    return new THREE.Group()
  }

  const radiusMeters = firstSample
    ? Math.hypot(firstSample.xMeters, firstSample.zMeters)
    : 1
  const segments = 180
  const positions = new Float32Array((segments + 1) * 3)

  for (let index = 0; index <= segments; index += 1) {
    const angle = (Math.PI * 2 * index) / segments
    const position = toKinematicsScenePosition(
      {
        ...firstSample,
        xMeters: radiusMeters * Math.cos(angle),
        zMeters: radiusMeters * Math.sin(angle),
      } as KinematicsSample,
      sceneProjection,
    )
    const offset = index * 3

    positions[offset] = position.x
    positions[offset + 1] = position.y
    positions[offset + 2] = position.z
  }

  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.LineBasicMaterial({
    color:
      simulationId === 'centripetal-force-curve' ? 0xf59e0b : 0xa3e635,
    transparent: true,
    opacity: simulationId === 'centripetal-force-curve' ? 0.54 : 0.5,
  })

  return new THREE.Line(geometry, material)
}

function downsamplePath(samples: KinematicsSample[]) {
  if (samples.length <= maxPathPoints) {
    return samples
  }

  const stride = Math.ceil(samples.length / maxPathPoints)
  const decimatedSamples = samples.filter((_, index) => index % stride === 0)
  const lastSample = samples.at(-1)

  if (lastSample && decimatedSamples.at(-1) !== lastSample) {
    decimatedSamples.push(lastSample)
  }

  return decimatedSamples
}

function estimateSceneBounds(
  samples: KinematicsSample[],
  sceneProjection: KinematicsSceneProjection,
  simulationId: KinematicsSimulationId,
) {
  const positions = samples.map((sample) =>
    toKinematicsScenePosition(sample, sceneProjection),
  )

  if (simulationId === 'atwood-machine') {
    const firstSample = samples[0]

    if (firstSample) {
      const scale = sceneProjection.positionScale
      const courseMeters = firstSample.zMeters + firstSample.secondaryZMeters
      const topZ = courseMeters * scale + atwoodPulleyRadius * 2.2 + 0.88

      positions.push(
        new THREE.Vector3(-1.15, 0, 0),
        new THREE.Vector3(1.15, 0, 0),
        new THREE.Vector3(-1.15, 0, topZ),
        new THREE.Vector3(1.15, 0, topZ),
      )
    }
  }

  if (simulationId === 'centripetal-force-curve') {
    const firstSample = samples[0]
    const scale = sceneProjection.positionScale
    const radiusMeters = firstSample
      ? Math.hypot(firstSample.xMeters, firstSample.zMeters)
      : 1
    const visibleRadius = Math.max(1, radiusMeters * scale)

    positions.length = 0
    positions.push(
      new THREE.Vector3(-visibleRadius * 1.35, -visibleRadius * 1.35, 0),
      new THREE.Vector3(visibleRadius * 1.35, visibleRadius * 1.75, 0),
    )
  }

  const xs = positions.map((position) => position.x)
  const ys = positions.map((position) => position.y)
  const zs = positions.map((position) => position.z)
  const minX = Math.min(0, ...xs)
  const maxX = Math.max(0, ...xs)
  const minY = Math.min(0, ...ys)
  const maxY = Math.max(0, ...ys)
  const minZ = Math.min(0, ...zs)
  const maxZ = Math.max(0, ...zs)
  const width = Math.max(1, maxX - minX)
  const depth = Math.max(1, maxY - minY)
  const height = Math.max(1, maxZ - minZ)

  return {
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
    centerZ: (minZ + maxZ) / 2,
    span: Math.max(width, depth, height) + 1,
  }
}

function findTraceStartIndex(
  samples: KinematicsSample[],
  currentIndex: number,
  oldestVisibleTimeSeconds: number,
) {
  for (let index = currentIndex; index >= 0; index -= 1) {
    if (samples[index].timeSeconds <= oldestVisibleTimeSeconds) {
      return index
    }
  }

  return 0
}
function getVectorDisplayLength(vector: KinematicsVectorOverlay) {
  const scale = vector.unit === 'm' ? 0.32 : vector.unit === 'm/s' ? 0.18 : 0.14

  return clamp(vector.magnitude * scale, 0.18, 1.35)
}

function getBodyDisplaySize(sceneSpan: number) {
  return clamp(sceneSpan * 0.022, bodySize, 0.72)
}

function updateOrbitCamera(
  objects: Pick<
    SceneObjects,
    'camera' | 'cameraRadius' | 'cameraTarget'
  > | null,
  yawRadians: number,
) {
  if (!objects) {
    return
  }

  const horizontalRadius = objects.cameraRadius * 0.88
  const verticalOffset = objects.cameraRadius * 0.38

  objects.camera.position.set(
    objects.cameraTarget.x + Math.cos(yawRadians) * horizontalRadius,
    objects.cameraTarget.y + Math.sin(yawRadians) * horizontalRadius,
    objects.cameraTarget.z + verticalOffset,
  )
  objects.camera.lookAt(objects.cameraTarget)
}

function getInitialCameraYawRadians(simulationId: KinematicsSimulationId) {
  return simulationId === 'atwood-machine'
    ? -Math.PI / 2
    : initialCameraYawRadians
}

function normalizeWheelDeltaY(event: ReactWheelEvent<HTMLCanvasElement>) {
  if (event.deltaMode === 1) {
    return event.deltaY * 16
  }

  if (event.deltaMode === 2) {
    return event.deltaY * 100
  }

  return event.deltaY
}

function disposeScene(scene: THREE.Scene) {
  scene.traverse((object) => {
    if ('geometry' in object) {
      const geometry = object.geometry as THREE.BufferGeometry | undefined

      geometry?.dispose()
    }

    if ('material' in object) {
      const material = object.material as
        | THREE.Material
        | THREE.Material[]
        | undefined

      if (Array.isArray(material)) {
        material.forEach((item) => {
          item.dispose()
        })
      } else {
        material?.dispose()
      }
    }
  })
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
