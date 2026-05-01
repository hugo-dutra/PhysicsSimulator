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
import {
  positionOrbitCamera,
  updateOrbitCameraPose,
  type OrbitCameraPose,
} from '../../lib/rendering/orbitCamera'
import {
  createOriginAxesMarker,
  getGridLowerLeftOrigin,
  getOriginAxesLength,
} from '../../lib/rendering/originAxes'
import { themeTokens } from '../../theme/appTheme'
import {
  createKinematicsSceneProjection,
  toKinematicsSceneDirection,
  toKinematicsScenePosition,
  type KinematicsSceneProjection,
} from './KinematicsSceneProjection'
import { ViewportOriginLegend } from './ViewportOriginLegend'

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
  workEnergyBodyLift: number
  workEnergyMaxThermalEnergyJoules: number
  workEnergyTrackNormal: THREE.Vector3
  workEnergyTrackPitchRadians: number
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
  lastClientY: number
  pointerId: number
}

type WorkEnergyTrackSceneProfile = {
  direction: THREE.Vector3
  end: THREE.Vector3
  length: number
  normal: THREE.Vector3
  pitchRadians: number
  start: THREE.Vector3
}

const vectorColors: Record<KinematicsVectorOverlay['id'], number> = {
  acceleration: 0xf59e0b,
  angularAcceleration: 0xf59e0b,
  angularVelocity: 0x38bdf8,
  appliedForce: 0x2dd4bf,
  centripetal: 0xf59e0b,
  displacement: 0xa3e635,
  forceOne: 0x2dd4bf,
  forceThree: 0xa3e635,
  forceTwo: 0x38bdf8,
  friction: 0xf59e0b,
  gravity: 0xf43f5e,
  impulse: 0xf59e0b,
  momentum: 0xa3e635,
  normal: 0xa3e635,
  resultant: 0xf43f5e,
  secondaryVelocity: 0x818cf8,
  tension: 0xa3e635,
  torque: 0xf59e0b,
  velocity: 0x38bdf8,
  weight: 0xf43f5e,
}

const vectorIds = [
  'displacement',
  'velocity',
  'acceleration',
  'angularAcceleration',
  'angularVelocity',
  'gravity',
  'centripetal',
  'tension',
  'weight',
  'friction',
  'normal',
  'appliedForce',
  'forceOne',
  'forceTwo',
  'forceThree',
  'resultant',
  'secondaryVelocity',
  'momentum',
  'impulse',
  'torque',
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
const thermalTraceStartColor = {
  blue: 0x0b / 255,
  green: 0x9e / 255,
  red: 0xf5 / 255,
}
const thermalTraceEndColor = {
  blue: 0x5e / 255,
  green: 0x3f / 255,
  red: 0xf4 / 255,
}
const readoutIntervalMs = 33
const maxFrameDeltaSeconds = 0.12
const initialCameraYawRadians = -0.58
const initialCameraPitchRadians = Math.atan2(0.38, 0.88)
const dragYawRadiansPerPixel = 0.008
const dragPitchRadiansPerPixel = 0.006
const wheelZoomSensitivity = 0.0014
const minCameraRadiusScale = 0.4
const maxCameraRadiusScale = 2.4
const workEnergyTrackHalfWidth = 0.28
const workEnergySleeperCount = 15

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
  const cameraPoseRef = useRef<OrbitCameraPose>({
    pitchRadians: initialCameraPitchRadians,
    yawRadians: initialCameraYawRadians,
  })
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
        lastClientY: event.clientY,
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
      const deltaY = event.clientY - dragState.lastClientY

      if (deltaX === 0 && deltaY === 0) {
        return
      }

      dragState.lastClientX = event.clientX
      dragState.lastClientY = event.clientY
      cameraPoseRef.current = updateOrbitCameraPose(
        cameraPoseRef.current,
        {
          deltaClientX: deltaX,
          deltaClientY: deltaY,
        },
        {
          pitchRadiansPerPixel: dragPitchRadiansPerPixel,
          yawRadiansPerPixel: dragYawRadiansPerPixel,
        },
      )

      const objects = objectsRef.current

      if (objects) {
        updateOrbitCamera(objects, cameraPoseRef.current)
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
      updateOrbitCamera(objects, cameraPoseRef.current)
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
    const workEnergyProfile = createWorkEnergyTrackSceneProfile(
      samples,
      sceneProjection,
    )
    const bounds = estimateSceneBounds(samples, sceneProjection, simulationId)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 160)
    const cameraTarget = new THREE.Vector3(
      bounds.centerX,
      bounds.centerY,
      bounds.centerZ,
    )
    const cameraRadius = Math.max(
      4.2,
      bounds.span * (simulationId === 'collisions-1d-2d' ? 0.92 : 1.35),
    )
    const cameraMinRadius = Math.max(1.2, cameraRadius * minCameraRadiusScale)
    const cameraMaxRadius = cameraRadius * maxCameraRadiusScale

    camera.up.set(0, 0, 1)
    scene.background = new THREE.Color(themeTokens.background)
    scene.add(new THREE.AmbientLight(0xffffff, 0.64))
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.12)

    keyLight.position.set(-2.4, -3.2, 5)
    scene.add(keyLight)

    const gridSize = Math.max(5, bounds.span * 1.25)
    const grid = new THREE.GridHelper(gridSize, 10, 0x2a2f3a, 0x20242d)

    grid.rotation.x = Math.PI / 2
    grid.position.set(bounds.centerX, bounds.centerY, 0)
    grid.material.transparent = true
    grid.material.opacity = 0.38
    scene.add(grid)
    scene.add(
      createOriginAxesMarker({
        axisLength: getOriginAxesLength(gridSize),
        origin: getGridLowerLeftOrigin({
          centerX: bounds.centerX,
          centerY: bounds.centerY,
          size: gridSize,
          z: grid.position.z + 0.035,
        }),
      }),
    )

    scene.add(
      createReferencePath(
        samples,
        simulationId,
        sceneProjection,
        workEnergyProfile,
      ),
    )

    const sceneBodySize = getBodyDisplaySize(bounds.span)
    const atwoodMassSize = sceneBodySize * 1.8
    const body = new THREE.Mesh(
      simulationId === 'atwood-machine'
        ? new THREE.BoxGeometry(atwoodMassSize, atwoodMassSize, atwoodMassSize)
        : simulationId === 'rolling-without-slipping'
          ? new THREE.CylinderGeometry(
              sceneBodySize,
              sceneBodySize,
              sceneBodySize * 0.72,
              32,
            )
        : simulationId === 'rigid-body-rotation' ||
            simulationId === 'torque-levers-center-mass'
          ? new THREE.BoxGeometry(
              sceneBodySize * 5.2,
              sceneBodySize * 0.78,
              sceneBodySize * 0.38,
            )
        : simulationId === 'work-energy-track'
          ? new THREE.BoxGeometry(
              sceneBodySize * 1.9,
              sceneBodySize * 1.08,
              sceneBodySize * 0.72,
            )
        : new THREE.SphereGeometry(
            simulationId === 'collisions-1d-2d' ? 1 : sceneBodySize,
            24,
            16,
          ),
      new THREE.MeshStandardMaterial({
        color: 0x2dd4bf,
        metalness: 0.08,
        roughness: 0.42,
      }),
    )
    scene.add(body)

    const secondaryBody = new THREE.Mesh(
      simulationId === 'collisions-1d-2d' ||
        simulationId === 'gravitational-field-orbits'
        ? new THREE.SphereGeometry(1, 24, 16)
        : new THREE.BoxGeometry(atwoodMassSize, atwoodMassSize, atwoodMassSize),
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
      updateOrbitCamera(objectsRef.current, cameraPoseRef.current)
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
      workEnergyBodyLift: sceneBodySize * 0.55,
      workEnergyMaxThermalEnergyJoules: Math.max(
        1,
        ...samples.map((sample) => sample.thermalEnergyJoules),
      ),
      workEnergyTrackNormal: workEnergyProfile.normal.clone(),
      workEnergyTrackPitchRadians: workEnergyProfile.pitchRadians,
    }

    cameraPoseRef.current = {
      pitchRadians: initialCameraPitchRadians,
      yawRadians: getInitialCameraYawRadians(simulationId),
    }
    observer.observe(parent)
    updateOrbitCamera(objectsRef.current, cameraPoseRef.current)
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
        aria-label="Cena 3D de Cinematica com arraste para orbitar em torno, por cima e por baixo, e Shift + scroll para zoom"
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
      <ViewportOriginLegend />
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
  objects.body.rotation.set(0, 0, 0)

  if (
    simulationId === 'rigid-body-rotation' ||
    simulationId === 'torque-levers-center-mass'
  ) {
    objects.body.rotation.z = sample.angleRadians
  } else if (simulationId === 'work-energy-track') {
    objects.body.position.addScaledVector(
      objects.workEnergyTrackNormal,
      objects.workEnergyBodyLift,
    )
    objects.body.rotation.y = objects.workEnergyTrackPitchRadians
  } else if (simulationId === 'rolling-without-slipping') {
    objects.body.rotation.y = -sample.angleRadians
  }

  updateConstrainedBodyObjects(objects, sample, simulationId)
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
    arrow.position.copy(
      simulationId === 'collisions-1d-2d' && vector.id === 'secondaryVelocity'
        ? objects.secondaryBody.position
        : bodyPosition,
    )
    arrow.setDirection(direction.normalize())
    arrow.setLength(getVectorDisplayLength(vector), 0.08, 0.045)
  })

  updateTrace(objects, samples, sampleIndex, sample, showTrace, simulationId)
}

function updateConstrainedBodyObjects(
  objects: SceneObjects,
  sample: KinematicsSample,
  simulationId: KinematicsSimulationId,
) {
  const isAtwood = simulationId === 'atwood-machine'
  const isCollision = simulationId === 'collisions-1d-2d'
  const isOrbit = simulationId === 'gravitational-field-orbits'

  objects.secondaryBody.visible = isAtwood || isCollision || isOrbit
  objects.pulley.visible = isAtwood
  objects.rope.visible = isAtwood
  objects.supportBar.visible = isAtwood
  objects.supportStem.visible = isAtwood

  if (isOrbit) {
    objects.secondaryBody.position.set(0, 0, 0)
    objects.secondaryBody.scale.setScalar(0.78)
    return
  }

  if (isCollision) {
    const scale = objects.sceneProjection.positionScale

    objects.body.scale.setScalar(
      sample.primaryRadiusMeters > 0
        ? sample.primaryRadiusMeters * scale
        : bodySize,
    )
    objects.secondaryBody.scale.setScalar(
      sample.secondaryRadiusMeters > 0
        ? sample.secondaryRadiusMeters * scale
        : bodySize,
    )
    objects.secondaryBody.position.copy(
      toKinematicsScenePosition(
        {
          ...sample,
          xMeters: sample.secondaryXMeters,
          zMeters: sample.secondaryZMeters,
        },
        objects.sceneProjection,
      ),
    )
    return
  }

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
  simulationId: KinematicsSimulationId,
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
  const usesThermalTrace = simulationId === 'work-energy-track'

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
    const heatRatio = usesThermalTrace
      ? clamp(
          sample.thermalEnergyJoules / objects.workEnergyMaxThermalEnergyJoules,
          0,
          1,
        )
      : 0
    const color = usesThermalTrace
      ? blendRgb(thermalTraceStartColor, thermalTraceEndColor, heatRatio)
      : traceColor
    const positionOffset = traceIndex * 3
    const colorOffset = traceIndex * 4
    const ageRatio = Math.min(
      1,
      Math.max(0, (newestTimeSeconds - sample.timeSeconds) / traceFadeSeconds),
    )
    const opacity = traceMaxOpacity - ageRatio * (traceMaxOpacity - traceMinOpacity)

    if (usesThermalTrace) {
      position.addScaledVector(objects.workEnergyTrackNormal, 0.045)
    }

    objects.tracePositions[positionOffset] = position.x
    objects.tracePositions[positionOffset + 1] = position.y
    objects.tracePositions[positionOffset + 2] = position.z
    objects.traceColors[colorOffset] = color.red
    objects.traceColors[colorOffset + 1] = color.green
    objects.traceColors[colorOffset + 2] = color.blue
    objects.traceColors[colorOffset + 3] = opacity
  })

  objects.trace.visible = true
  objects.trace.geometry.setDrawRange(0, drawCount)
  objects.tracePositionAttribute.needsUpdate = true
  objects.traceColorAttribute.needsUpdate = true
}

function createWorkEnergyTrackSceneProfile(
  samples: KinematicsSample[],
  sceneProjection: KinematicsSceneProjection,
): WorkEnergyTrackSceneProfile {
  const firstSample = samples[0]
  const farthestSample =
    samples.reduce<KinematicsSample | null>((currentFarthest, sample) => {
      if (!currentFarthest || sample.positionMeters > currentFarthest.positionMeters) {
        return sample
      }

      return currentFarthest
    }, null) ?? firstSample
  const start = firstSample
    ? toKinematicsScenePosition(firstSample, sceneProjection)
    : new THREE.Vector3(0, 0, 0)
  const end = farthestSample
    ? toKinematicsScenePosition(farthestSample, sceneProjection)
    : new THREE.Vector3(1, 0, 0)
  const direction = end.clone().sub(start)
  const length = Math.max(1, direction.length())

  if (direction.lengthSq() < 1e-8) {
    direction.set(1, 0, 0)
  } else {
    direction.normalize()
  }

  const normal = new THREE.Vector3(-direction.z, 0, direction.x)

  if (normal.z < 0) {
    normal.multiplyScalar(-1)
  }

  return {
    direction,
    end,
    length,
    normal,
    pitchRadians: -Math.atan2(direction.z, direction.x),
    start,
  }
}

function createWorkEnergyTrackReference(profile: WorkEnergyTrackSceneProfile) {
  const group = new THREE.Group()
  const railLift = profile.normal.clone().multiplyScalar(0.045)
  const deckLift = profile.normal.clone().multiplyScalar(-0.035)
  const start = profile.start.clone()
  const end = profile.end.clone()
  const center = start.clone().add(end).multiplyScalar(0.5)
  const leftOffset = new THREE.Vector3(0, workEnergyTrackHalfWidth, 0)
  const rightOffset = new THREE.Vector3(0, -workEnergyTrackHalfWidth, 0)
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(
      profile.length + 0.32,
      workEnergyTrackHalfWidth * 2.42,
      0.045,
    ),
    new THREE.MeshStandardMaterial({
      color: 0x20242d,
      metalness: 0.04,
      opacity: 0.68,
      roughness: 0.62,
      transparent: true,
    }),
  )

  deck.position.copy(center).add(deckLift)
  deck.rotation.y = profile.pitchRadians
  group.add(deck)
  group.add(
    createSceneLine(
      start.clone().add(leftOffset).add(railLift),
      end.clone().add(leftOffset).add(railLift),
      0x38bdf8,
      0.78,
    ),
  )
  group.add(
    createSceneLine(
      start.clone().add(rightOffset).add(railLift),
      end.clone().add(rightOffset).add(railLift),
      0x2dd4bf,
      0.82,
    ),
  )

  const sleeperGeometry = new THREE.BoxGeometry(
    0.055,
    workEnergyTrackHalfWidth * 2.72,
    0.04,
  )
  const sleeperMaterial = new THREE.MeshStandardMaterial({
    color: 0xe6e8ec,
    metalness: 0.12,
    opacity: 0.42,
    roughness: 0.54,
    transparent: true,
  })

  for (let index = 0; index < workEnergySleeperCount; index += 1) {
    const ratio = index / (workEnergySleeperCount - 1)
    const sleeper = new THREE.Mesh(sleeperGeometry, sleeperMaterial)

    sleeper.position
      .copy(start)
      .lerp(end, ratio)
      .add(profile.normal.clone().multiplyScalar(0.018))
    sleeper.rotation.y = profile.pitchRadians
    group.add(sleeper)
  }

  const baseZ = Math.min(start.z, end.z)
  const rulerY = -workEnergyTrackHalfWidth - 0.42
  const rulerBottom = new THREE.Vector3(start.x, rulerY, baseZ)
  const rulerTop = new THREE.Vector3(start.x, rulerY, start.z)

  group.add(createSceneLine(rulerBottom, rulerTop, 0xa3e635, 0.44))

  for (let index = 0; index <= 4; index += 1) {
    const ratio = index / 4
    const z = lerp(baseZ, start.z, ratio)

    group.add(
      createSceneLine(
        new THREE.Vector3(start.x - 0.1, rulerY, z),
        new THREE.Vector3(start.x + 0.1, rulerY, z),
        0xa3e635,
        0.34,
      ),
    )
  }

  const endStop = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, workEnergyTrackHalfWidth * 2.58, 0.36),
    new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      metalness: 0.06,
      opacity: 0.72,
      roughness: 0.48,
      transparent: true,
    }),
  )

  endStop.position.copy(end).add(profile.normal.clone().multiplyScalar(0.17))
  endStop.rotation.y = profile.pitchRadians
  group.add(endStop)

  return group
}

function createSceneLine(
  start: THREE.Vector3,
  end: THREE.Vector3,
  color: number,
  opacity: number,
) {
  const geometry = new THREE.BufferGeometry().setFromPoints([start, end])

  return new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({
      color,
      opacity,
      transparent: opacity < 1,
    }),
  )
}

function createReferencePath(
  samples: KinematicsSample[],
  simulationId: KinematicsSimulationId,
  sceneProjection: KinematicsSceneProjection,
  workEnergyProfile: WorkEnergyTrackSceneProfile,
) {
  if (simulationId === 'atwood-machine') {
    return new THREE.Group()
  }

  if (simulationId === 'work-energy-track') {
    return createWorkEnergyTrackReference(workEnergyProfile)
  }

  if (simulationId === 'collisions-1d-2d') {
    return createCollisionReferencePath(samples, sceneProjection)
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

function createCollisionReferencePath(
  samples: KinematicsSample[],
  sceneProjection: KinematicsSceneProjection,
) {
  const group = new THREE.Group()

  group.add(
    createPathLine({
      color: 0x2dd4bf,
      opacity: 0.44,
      samples,
      sceneProjection,
      selectSample: (sample) => sample,
    }),
  )
  group.add(
    createPathLine({
      color: 0x38bdf8,
      opacity: 0.4,
      samples,
      sceneProjection,
      selectSample: (sample) => ({
        ...sample,
        xMeters: sample.secondaryXMeters,
        zMeters: sample.secondaryZMeters,
      }),
    }),
  )

  return group
}

function createPathLine({
  color,
  opacity,
  samples,
  sceneProjection,
  selectSample,
}: {
  color: number
  opacity: number
  samples: KinematicsSample[]
  sceneProjection: KinematicsSceneProjection
  selectSample: (sample: KinematicsSample) => KinematicsSample
}) {
  const pathSamples = downsamplePath(samples)
  const positions = new Float32Array(Math.max(2, pathSamples.length) * 3)

  pathSamples.forEach((sample, index) => {
    const position = toKinematicsScenePosition(
      selectSample(sample),
      sceneProjection,
    )
    const offset = index * 3

    positions[offset] = position.x
    positions[offset + 1] = position.y
    positions[offset + 2] = position.z
  })

  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setDrawRange(0, pathSamples.length)

  return new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({
      color,
      opacity,
      transparent: true,
    }),
  )
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

  if (simulationId === 'collisions-1d-2d') {
    samples.forEach((sample) => {
      positions.push(
        toKinematicsScenePosition(
          {
            ...sample,
            xMeters: sample.secondaryXMeters,
            zMeters: sample.secondaryZMeters,
          },
          sceneProjection,
        ),
      )
    })
  }

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
  pose: OrbitCameraPose,
) {
  positionOrbitCamera(objects, pose)
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

function blendRgb(
  start: { blue: number; green: number; red: number },
  end: { blue: number; green: number; red: number },
  ratio: number,
) {
  return {
    blue: lerp(start.blue, end.blue, ratio),
    green: lerp(start.green, end.green, ratio),
    red: lerp(start.red, end.red, ratio),
  }
}

function lerp(start: number, end: number, ratio: number) {
  return start + (end - start) * ratio
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
