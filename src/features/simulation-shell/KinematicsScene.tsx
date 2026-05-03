import {
  useCallback,
  useEffect,
  useRef,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react'
import { Box } from '@mui/material'
import * as THREE from 'three'
import {
  computeKinematicsSample,
  computeKinematicsTimeline,
  getKinematicsVectorOverlays,
  interpolateKinematicsSample,
  type KinematicsParameters,
  type KinematicsSample,
  type KinematicsSimulationId,
  type KinematicsVectorOverlay,
} from '../../lib/physics/kinematics'
import {
  cancelAnimationFrameSafe,
  createFrameStatsWindow,
  readInterpolatedTimelineFrame,
  requestAnimationFrameSafe,
  scalePlaybackDelta,
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
  parameters: KinematicsParameters
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
  bodyRadius: number
  leverAppliedForceMarker: THREE.Mesh
  leverCenterOfMassMarker: THREE.Mesh
  leverLeftMass: THREE.Mesh
  leverPivotCapBack: THREE.Mesh
  leverPivotCapFront: THREE.Mesh
  leverPivotPin: THREE.Mesh
  leverRightMass: THREE.Mesh
  leverSupportHoleShadow: THREE.Mesh
  leverSupport: THREE.Mesh
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
  parameters: KinematicsParameters
  playbackRate: number
  sampleRateHz: number
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
  halfWidthMeters: number
  positionScale: number
  rimHeightMeters: number
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
const atwoodRopePointCapacity = 96
const atwoodRopeArcSegments = 28
const massSpringCoilSegments = 72
const massSpringCoilTurns = 9
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
const leverPivotHeight = 0.78
const leverSupportHeight = 0.74
const leverSupportBaseWidth = 1.05
const leverSupportDepth = 0.52
const leverSupportPivotCapDepth = 0.05
const leverSupportPivotCapRadius = 0.115
const leverSupportPivotHoleRadius = 0.055
const leverSupportPivotPinRadius = 0.055
const leverSupportPivotPinInsetFromTop = 0.12
const leverSupportPivotHoleX = 0
const leverBoardDepth = 0.16
const leverBoardThickness = 0.085

export function KinematicsScene({
  durationSeconds,
  isPlaying,
  maximized = false,
  onSampleChange,
  parameters,
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
    parameters,
    playbackRate,
    sampleRateHz: readSampleRateHz(samples),
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
  const timelineSamplesRef = useRef<KinematicsSample[]>(samples)
  const traceSamplesRef = useRef<KinematicsSample[]>([readFirstKinematicsSample(samples)])

  const renderCurrentFrame = useCallback((notify = false) => {
    const objects = objectsRef.current
    const runtime = runtimeRef.current
    const frame = readContinuousKinematicsFrame(
      runtime,
      timelineSamplesRef,
      elapsedSecondsRef.current,
    )
    const sample = frame.sample
    appendTraceSample(traceSamplesRef.current, sample, traceFadeSeconds)

    if (!objects || !sample) {
      return
    }

    updateKinematicsObjects({
      objects,
      sample,
      sampleIndex: traceSamplesRef.current.length - 1,
      samples: traceSamplesRef.current,
      showTrace: runtime.showTrace,
      showVectors: runtime.showVectors,
      simulationId: runtime.simulationId,
    })
    objects.renderer.render(objects.scene, objects.camera)

    if (notify) {
      runtime.onSampleChange(
        {
          ...sample,
          timeSeconds: elapsedSecondsRef.current,
        },
        statsWindowRef.current.stats,
      )
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
      parameters,
      playbackRate,
      sampleRateHz: readSampleRateHz(samples),
      samples,
      showTrace,
      showVectors,
      simulationId,
    }

    renderCurrentFrame()
  }, [
    durationSeconds,
    onSampleChange,
    parameters,
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
    const gridBackground = new THREE.Mesh(
      new THREE.PlaneGeometry(gridSize, gridSize),
      new THREE.MeshBasicMaterial({
        color: 0x171a21,
        depthWrite: false,
        opacity: 0.34,
        side: THREE.DoubleSide,
        transparent: true,
      }),
    )
    const grid = new THREE.GridHelper(gridSize, 10, 0x2a2f3a, 0x20242d)

    gridBackground.position.set(bounds.centerX, bounds.centerY, -0.018)
    gridBackground.renderOrder = 0
    scene.add(gridBackground)

    grid.rotation.x = Math.PI / 2
    grid.position.set(bounds.centerX, bounds.centerY, 0)
    grid.material.transparent = true
    grid.material.opacity = 0.38
    grid.material.depthWrite = false
    grid.renderOrder = 1
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
          ? simulationId === 'torque-levers-center-mass'
            ? new THREE.BoxGeometry(1, 1, 1)
            : new THREE.BoxGeometry(
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

    const leverLeftMass = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({
        color: 0x2dd4bf,
        metalness: 0.06,
        roughness: 0.5,
      }),
    )
    const leverRightMass = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.06,
        roughness: 0.5,
      }),
    )
    const leverAppliedForceMarker = new THREE.Mesh(
      new THREE.SphereGeometry(1, 18, 12),
      new THREE.MeshStandardMaterial({
        color: 0xa3e635,
        emissive: 0x1f3b0a,
        emissiveIntensity: 0.22,
        metalness: 0.04,
        roughness: 0.45,
      }),
    )
    const leverCenterOfMassMarker = new THREE.Mesh(
      new THREE.SphereGeometry(1, 18, 12),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0x3b2504,
        emissiveIntensity: 0.24,
        metalness: 0.04,
        roughness: 0.45,
      }),
    )
    const leverPivotPin = new THREE.Mesh(
      new THREE.CylinderGeometry(
        leverSupportPivotPinRadius,
        leverSupportPivotPinRadius,
        leverSupportDepth + leverSupportPivotCapDepth * 2,
        24,
      ),
      new THREE.MeshStandardMaterial({
        color: 0xd7d9dd,
        metalness: 0.24,
        roughness: 0.38,
      }),
    )
    const leverPivotCapGeometry = new THREE.CylinderGeometry(
      leverSupportPivotCapRadius,
      leverSupportPivotCapRadius,
      leverSupportPivotCapDepth,
      32,
    )
    const leverPivotCapMaterial = new THREE.MeshStandardMaterial({
      color: 0xbfc3c9,
      metalness: 0.28,
      roughness: 0.36,
    })
    const leverPivotCapFront = new THREE.Mesh(
      leverPivotCapGeometry,
      leverPivotCapMaterial,
    )
    const leverPivotCapBack = new THREE.Mesh(
      leverPivotCapGeometry.clone(),
      leverPivotCapMaterial.clone(),
    )
    const leverSupportHoleShadow = new THREE.Mesh(
      new THREE.CircleGeometry(leverSupportPivotHoleRadius * 0.72, 28),
      new THREE.MeshBasicMaterial({
        color: 0x0f1115,
        depthWrite: false,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.92,
      }),
    )
    const leverSupport = new THREE.Mesh(
      createLeverSupportGeometry(),
      new THREE.MeshStandardMaterial({
        color: 0xcfd3d8,
        metalness: 0.16,
        roughness: 0.5,
      }),
    )

    scene.add(leverLeftMass)
    scene.add(leverRightMass)
    scene.add(leverAppliedForceMarker)
    scene.add(leverCenterOfMassMarker)
    scene.add(leverPivotPin)
    scene.add(leverPivotCapFront)
    scene.add(leverPivotCapBack)
    scene.add(leverSupportHoleShadow)
    scene.add(leverSupport)

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
      bodyRadius: sceneBodySize,
      leverAppliedForceMarker,
      leverCenterOfMassMarker,
      leverLeftMass,
      leverPivotCapBack,
      leverPivotCapFront,
      leverPivotPin,
      leverRightMass,
      leverSupportHoleShadow,
      leverSupport,
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
      workEnergyTrackNormal: new THREE.Vector3(0, 0, 1),
      workEnergyTrackPitchRadians: 0,
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
    timelineSamplesRef.current = samples
    traceSamplesRef.current = [readFirstKinematicsSample(samples)]
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
      const playbackDeltaSeconds = scalePlaybackDelta(
        deltaSeconds,
        runtime.playbackRate,
      )
      const nextElapsedSeconds =
        elapsedSecondsRef.current + playbackDeltaSeconds

      lastFrameTimeRef.current = timestamp
      elapsedSecondsRef.current = nextElapsedSeconds

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
        aria-label={getKinematicsCanvasAriaLabel(simulationId)}
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

  if (simulationId === 'rigid-body-rotation') {
    objects.body.rotation.z = sample.angleRadians
  } else if (simulationId === 'work-energy-track') {
    const trackNormal = getWorkEnergyTrackNormal(sample)

    objects.body.position.addScaledVector(
      trackNormal,
      objects.workEnergyBodyLift,
    )
    objects.body.rotation.y = getWorkEnergyTrackPitchRadians(sample)
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
      getKinematicsVectorOrigin(objects, sample, simulationId, vector.id, bodyPosition),
    )
    arrow.setDirection(direction.normalize())
    arrow.setLength(getVectorDisplayLength(vector), 0.08, 0.045)
  })

  updateTrace(objects, samples, sampleIndex, sample, showTrace, simulationId)
}

function getKinematicsVectorOrigin(
  objects: SceneObjects,
  sample: KinematicsSample,
  simulationId: KinematicsSimulationId,
  vectorId: KinematicsVectorOverlay['id'],
  fallbackPosition: THREE.Vector3,
) {
  if (simulationId === 'collisions-1d-2d' && vectorId === 'secondaryVelocity') {
    return objects.secondaryBody.position.clone()
  }

  if (simulationId === 'torque-levers-center-mass') {
    if (vectorId === 'forceOne') {
      return objects.leverLeftMass.position.clone()
    }

    if (vectorId === 'forceTwo') {
      return objects.leverRightMass.position.clone()
    }

    if (vectorId === 'appliedForce') {
      return objects.leverAppliedForceMarker.position.clone()
    }

    if (vectorId === 'torque') {
      const { pivot, normal } = getTorqueLeverBasis(sample)

      return pivot.clone().addScaledVector(normal, 0.34)
    }
  }

  return fallbackPosition.clone()
}

function updateConstrainedBodyObjects(
  objects: SceneObjects,
  sample: KinematicsSample,
  simulationId: KinematicsSimulationId,
) {
  const isAtwood = simulationId === 'atwood-machine'
  const isCollision = simulationId === 'collisions-1d-2d'
  const isMassSpring = simulationId === 'mass-spring'
  const isOrbit = simulationId === 'gravitational-field-orbits'
  const isTorqueLever = simulationId === 'torque-levers-center-mass'

  objects.secondaryBody.visible = isAtwood || isCollision || isOrbit
  objects.pulley.visible = isAtwood
  objects.rope.visible = isAtwood || isMassSpring
  objects.supportBar.visible = isAtwood || isMassSpring
  objects.supportStem.visible = isAtwood || isMassSpring
  objects.leverAppliedForceMarker.visible = isTorqueLever
  objects.leverCenterOfMassMarker.visible = isTorqueLever
  objects.leverLeftMass.visible = isTorqueLever
  objects.leverPivotCapBack.visible = isTorqueLever
  objects.leverPivotCapFront.visible = isTorqueLever
  objects.leverPivotPin.visible = isTorqueLever
  objects.leverRightMass.visible = isTorqueLever
  objects.leverSupportHoleShadow.visible = isTorqueLever
  objects.leverSupport.visible = isTorqueLever

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

  if (isMassSpring) {
    updateMassSpringObjects(objects, sample)
    return
  }

  if (isTorqueLever) {
    updateTorqueLeverObjects(objects, sample)
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

function updateTorqueLeverObjects(
  objects: SceneObjects,
  sample: KinematicsSample,
) {
  const scale = objects.sceneProjection.positionScale
  const { axis, normal, pivot } = getTorqueLeverBasis(sample)
  const leftArm = Math.max(0.08, sample.leftArmMeters * scale)
  const rightArm = Math.max(0.08, sample.rightArmMeters * scale)
  const appliedArm = Math.max(0, sample.appliedForceArmMeters * scale)
  const leftSpan = Math.max(leftArm, 0.28)
  const rightSpan = Math.max(rightArm, appliedArm, 0.28)
  const boardLength = leftSpan + rightSpan + 0.16
  const boardCenterOffset = (rightSpan - leftSpan) / 2
  const boardCenter = pivot.clone().addScaledVector(axis, boardCenterOffset)
  const leftMassSize = getLeverMassDisplaySize(objects, sample.forceOneNewtons)
  const rightMassSize = getLeverMassDisplaySize(objects, sample.forceTwoNewtons)
  const markerRadius = clamp(objects.bodyRadius * 0.34, 0.055, 0.12)

  objects.body.position.copy(boardCenter)
  objects.body.rotation.set(0, -sample.angleRadians, 0)
  objects.body.scale.set(boardLength, leverBoardDepth, leverBoardThickness)

  updateLeverMassObject({
    axis,
    distance: -leftArm,
    massSize: leftMassSize,
    mesh: objects.leverLeftMass,
    normal,
    pivot,
    sample,
  })
  updateLeverMassObject({
    axis,
    distance: rightArm,
    massSize: rightMassSize,
    mesh: objects.leverRightMass,
    normal,
    pivot,
    sample,
  })

  objects.leverAppliedForceMarker.position
    .copy(pivot)
    .addScaledVector(axis, appliedArm)
    .addScaledVector(normal, leverBoardThickness * 0.5 + markerRadius + 0.018)
  objects.leverAppliedForceMarker.scale.setScalar(markerRadius)

  objects.leverCenterOfMassMarker.position
    .copy(pivot)
    .addScaledVector(axis, sample.centerOfMassMeters * scale)
    .addScaledVector(normal, leverBoardThickness * 0.5 + markerRadius + 0.022)
  objects.leverCenterOfMassMarker.scale.setScalar(markerRadius)

  const supportTopZ = pivot.z + leverSupportPivotPinInsetFromTop
  const pivotAxleZ = supportTopZ - leverSupportPivotPinInsetFromTop

  objects.leverSupport.position.set(
    pivot.x,
    pivot.y,
    supportTopZ - leverSupportHeight,
  )
  objects.leverSupport.rotation.set(0, 0, 0)

  objects.leverPivotPin.position.set(
    pivot.x,
    pivot.y,
    pivotAxleZ,
  )
  objects.leverPivotPin.rotation.set(0, 0, 0)

  objects.leverPivotCapFront.position.set(
    pivot.x,
    pivot.y - leverSupportDepth / 2 - leverSupportPivotCapDepth / 2,
    pivotAxleZ,
  )
  objects.leverPivotCapFront.rotation.set(0, 0, 0)

  objects.leverPivotCapBack.position.set(
    pivot.x,
    pivot.y + leverSupportDepth / 2 + leverSupportPivotCapDepth / 2,
    pivotAxleZ,
  )
  objects.leverPivotCapBack.rotation.set(0, 0, 0)

  objects.leverSupportHoleShadow.position.set(
    pivot.x + leverSupportPivotHoleX,
    pivot.y - leverSupportDepth / 2 - 0.002,
    pivotAxleZ,
  )
  objects.leverSupportHoleShadow.rotation.set(Math.PI / 2, 0, 0)
}

function createLeverSupportGeometry() {
  const shape = new THREE.Shape([
    new THREE.Vector2(-leverSupportBaseWidth / 2, 0),
    new THREE.Vector2(leverSupportBaseWidth / 2, 0),
    new THREE.Vector2(0, leverSupportHeight),
  ])

  const openingBaseWidth = leverSupportBaseWidth * 0.52
  const openingBaseZ = leverSupportHeight * 0.11
  const openingApexZ = leverSupportHeight * 0.63
  const triangularOpening = new THREE.Path()

  triangularOpening.moveTo(-openingBaseWidth / 2, openingBaseZ)
  triangularOpening.lineTo(0, openingApexZ)
  triangularOpening.lineTo(openingBaseWidth / 2, openingBaseZ)
  triangularOpening.lineTo(-openingBaseWidth / 2, openingBaseZ)
  shape.holes.push(triangularOpening)

  const pivotHole = new THREE.Path()
  pivotHole.absellipse(
    leverSupportPivotHoleX,
    leverSupportHeight - leverSupportPivotPinInsetFromTop,
    leverSupportPivotHoleRadius,
    leverSupportPivotHoleRadius,
    0,
    Math.PI * 2,
    true,
  )
  shape.holes.push(pivotHole)

  const geometry = new THREE.ExtrudeGeometry(shape, {
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.018,
    bevelThickness: 0.02,
    curveSegments: 24,
    depth: leverSupportDepth,
  })

  geometry.rotateX(Math.PI / 2)
  geometry.translate(0, leverSupportDepth / 2, 0)
  geometry.computeVertexNormals()

  return geometry
}

function updateLeverMassObject({
  axis,
  distance,
  massSize,
  mesh,
  normal,
  pivot,
  sample,
}: {
  axis: THREE.Vector3
  distance: number
  massSize: number
  mesh: THREE.Mesh
  normal: THREE.Vector3
  pivot: THREE.Vector3
  sample: KinematicsSample
}) {
  mesh.position
    .copy(pivot)
    .addScaledVector(axis, distance)
    .addScaledVector(normal, leverBoardThickness * 0.5 + massSize * 0.42)
  mesh.rotation.set(0, -sample.angleRadians, 0)
  mesh.scale.set(massSize * 0.92, massSize * 0.72, massSize * 0.82)
}

function getTorqueLeverBasis(sample: KinematicsSample) {
  const angleRadians = sample.angleRadians

  return {
    axis: new THREE.Vector3(Math.cos(angleRadians), 0, Math.sin(angleRadians)),
    normal: new THREE.Vector3(-Math.sin(angleRadians), 0, Math.cos(angleRadians)),
    pivot: new THREE.Vector3(0, 0, leverPivotHeight),
  }
}

function getLeverMassDisplaySize(objects: SceneObjects, forceNewtons: number) {
  return clamp(
    objects.bodyRadius * (1.25 + Math.sqrt(Math.max(0, forceNewtons)) * 0.12),
    0.2,
    0.62,
  )
}

function updateMassSpringObjects(
  objects: SceneObjects,
  sample: KinematicsSample,
) {
  const scale = objects.sceneProjection.positionScale
  const massPosition = toKinematicsScenePosition(sample, objects.sceneProjection)
  const bodyRadius = objects.bodyRadius
  const springTopZ = sample.primaryRadiusMeters * scale
  const supportZ = springTopZ + Math.max(0.18, bodyRadius * 0.9)
  const supportWidth = Math.max(1.25, bodyRadius * 5.4)
  const springBottomZ = Math.min(
    springTopZ - 0.12,
    massPosition.z + bodyRadius * 0.82,
  )
  const coilRadius = clamp(bodyRadius * 0.66, 0.08, 0.2)
  const ropePoints = createMassSpringCoilPoints({
    bottom: new THREE.Vector3(0, 0, springBottomZ),
    radius: coilRadius,
    top: new THREE.Vector3(0, 0, springTopZ),
  })

  objects.body.position.copy(massPosition)
  objects.body.scale.setScalar(1)
  objects.supportBar.position.set(0, 0, supportZ)
  objects.supportBar.scale.set(supportWidth, 0.075, 0.075)
  objects.supportStem.position.set(0, 0, (springTopZ + supportZ) / 2)
  objects.supportStem.scale.set(0.075, 0.075, Math.max(0.12, supportZ - springTopZ))

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

function createMassSpringCoilPoints({
  bottom,
  radius,
  top,
}: {
  bottom: THREE.Vector3
  radius: number
  top: THREE.Vector3
}) {
  const points: THREE.Vector3[] = []

  for (let index = 0; index <= massSpringCoilSegments; index += 1) {
    const ratio = index / massSpringCoilSegments
    const angle = ratio * Math.PI * 2 * massSpringCoilTurns
    const endRadius =
      index === 0 || index === massSpringCoilSegments ? 0 : radius

    points.push(
      new THREE.Vector3(
        endRadius * Math.cos(angle),
        endRadius * Math.sin(angle),
        lerp(top.z, bottom.z, ratio),
      ),
    )
  }

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
      position.addScaledVector(getWorkEnergyTrackNormal(sample), 0.045)
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

function readContinuousKinematicsFrame(
  runtime: RuntimeProps,
  timelineSamplesRef: MutableRefObject<KinematicsSample[]>,
  elapsedSeconds: number,
) {
  const currentTimeSeconds = Math.max(0, elapsedSeconds)

  if (runtime.simulationId !== 'work-energy-track') {
    return {
      sample: computeKinematicsSample(
        runtime.simulationId,
        runtime.parameters,
        currentTimeSeconds,
      ),
      sampleIndex: 0,
    }
  }

  ensureWorkEnergyTimelineCovers(
    runtime,
    timelineSamplesRef,
    currentTimeSeconds,
  )

  const timelineSamples = timelineSamplesRef.current
  const timelineDurationSeconds =
    timelineSamples.at(-1)?.timeSeconds ?? runtime.durationSeconds

  return readInterpolatedTimelineFrame(
    timelineSamples,
    timelineDurationSeconds,
    currentTimeSeconds,
    interpolateKinematicsSample,
  )
}

function ensureWorkEnergyTimelineCovers(
  runtime: RuntimeProps,
  timelineSamplesRef: MutableRefObject<KinematicsSample[]>,
  currentTimeSeconds: number,
) {
  const currentSamples = timelineSamplesRef.current
  const currentTimelineEndSeconds =
    currentSamples.at(-1)?.timeSeconds ?? runtime.durationSeconds

  if (currentTimeSeconds <= currentTimelineEndSeconds) {
    return
  }

  const extensionSeconds = Math.max(4, runtime.durationSeconds)
  const nextDurationSeconds = Math.max(
    currentTimeSeconds + extensionSeconds,
    currentTimelineEndSeconds + extensionSeconds,
  )

  timelineSamplesRef.current = computeKinematicsTimeline({
    durationSeconds: nextDurationSeconds,
    parameters: runtime.parameters,
    sampleRateHz: runtime.sampleRateHz,
    simulationId: runtime.simulationId,
  }).samples
}

function readFirstKinematicsSample(samples: KinematicsSample[]) {
  const firstSample = samples[0]

  if (!firstSample) {
    throw new Error('Kinematics timeline must contain at least one sample.')
  }

  return firstSample
}

function appendTraceSample(
  samples: KinematicsSample[],
  sample: KinematicsSample,
  historySeconds: number,
) {
  const lastSample = samples.at(-1)

  if (!lastSample || sample.timeSeconds > lastSample.timeSeconds + 0.0001) {
    samples.push(sample)
  } else if (lastSample) {
    samples[samples.length - 1] = sample
  }

  const oldestVisibleTimeSeconds = Math.max(0, sample.timeSeconds - historySeconds)

  while (
    samples.length > 1 &&
    samples[1].timeSeconds < oldestVisibleTimeSeconds
  ) {
    samples.shift()
  }
}

function readSampleRateHz(samples: KinematicsSample[]) {
  const firstSample = samples[0]
  const secondSample = samples[1]

  if (!firstSample || !secondSample) {
    return 60
  }

  const intervalSeconds = secondSample.timeSeconds - firstSample.timeSeconds

  return intervalSeconds > 0 ? 1 / intervalSeconds : 60
}

function createWorkEnergyTrackSceneProfile(
  samples: KinematicsSample[],
  sceneProjection: KinematicsSceneProjection,
): WorkEnergyTrackSceneProfile {
  const firstSample = samples[0]

  return {
    halfWidthMeters: firstSample?.primaryRadiusMeters ?? 1,
    positionScale: sceneProjection.positionScale,
    rimHeightMeters: firstSample?.secondaryRadiusMeters ?? 1,
  }
}

function createWorkEnergyTrackReference(profile: WorkEnergyTrackSceneProfile) {
  const group = new THREE.Group()
  const leftOffset = new THREE.Vector3(0, workEnergyTrackHalfWidth, 0)
  const rightOffset = new THREE.Vector3(0, -workEnergyTrackHalfWidth, 0)
  group.add(
    createWorkEnergyTrackRail({
      color: 0x38bdf8,
      offset: leftOffset,
      opacity: 0.78,
      profile,
    }),
  )
  group.add(
    createWorkEnergyTrackRail({
      color: 0x2dd4bf,
      offset: rightOffset,
      opacity: 0.82,
      profile,
    }),
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
    const xMeters = lerp(-profile.halfWidthMeters, profile.halfWidthMeters, ratio)
    const sleeper = new THREE.Mesh(sleeperGeometry, sleeperMaterial)
    const point = createWorkEnergyTrackPoint(profile, xMeters)

    sleeper.position
      .copy(point)
      .add(getWorkEnergyNormalForX(profile, xMeters).multiplyScalar(0.018))
    sleeper.rotation.y = getWorkEnergyPitchForX(profile, xMeters)
    group.add(sleeper)
  }

  const rulerY = -workEnergyTrackHalfWidth - 0.42
  const rulerX = (-profile.halfWidthMeters - 0.28) * profile.positionScale
  const rulerBottom = new THREE.Vector3(rulerX, rulerY, 0)
  const rulerTop = new THREE.Vector3(
    rulerX,
    rulerY,
    profile.rimHeightMeters * profile.positionScale,
  )

  group.add(createSceneLine(rulerBottom, rulerTop, 0xa3e635, 0.44))

  for (let index = 0; index <= 4; index += 1) {
    const ratio = index / 4
    const z = profile.rimHeightMeters * profile.positionScale * ratio

    group.add(
      createSceneLine(
        new THREE.Vector3(rulerX - 0.1, rulerY, z),
        new THREE.Vector3(rulerX + 0.1, rulerY, z),
        0xa3e635,
        0.34,
      ),
    )
  }

  const stopXMeters = [-profile.halfWidthMeters, profile.halfWidthMeters]

  stopXMeters.forEach((xMeters) => {
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

    endStop.position
      .copy(createWorkEnergyTrackPoint(profile, xMeters))
      .add(getWorkEnergyNormalForX(profile, xMeters).multiplyScalar(0.17))
    endStop.rotation.y = getWorkEnergyPitchForX(profile, xMeters)
    group.add(endStop)
  })

  return group
}

function createWorkEnergyTrackRail({
  color,
  offset,
  opacity,
  profile,
}: {
  color: number
  offset: THREE.Vector3
  opacity: number
  profile: WorkEnergyTrackSceneProfile
}) {
  const segments = 96
  const positions = new Float32Array((segments + 1) * 3)

  for (let index = 0; index <= segments; index += 1) {
    const ratio = index / segments
    const xMeters = lerp(-profile.halfWidthMeters, profile.halfWidthMeters, ratio)
    const point = createWorkEnergyTrackPoint(profile, xMeters)
      .add(offset)
      .add(getWorkEnergyNormalForX(profile, xMeters).multiplyScalar(0.045))
    const positionOffset = index * 3

    positions[positionOffset] = point.x
    positions[positionOffset + 1] = point.y
    positions[positionOffset + 2] = point.z
  }

  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  return new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({
      color,
      opacity,
      transparent: true,
    }),
  )
}

function createWorkEnergyTrackPoint(
  profile: WorkEnergyTrackSceneProfile,
  xMeters: number,
) {
  return new THREE.Vector3(
    xMeters * profile.positionScale,
    0,
    getWorkEnergyHeightForX(profile, xMeters) * profile.positionScale,
  )
}

function getWorkEnergyHeightForX(
  profile: WorkEnergyTrackSceneProfile,
  xMeters: number,
) {
  if (profile.halfWidthMeters === 0) {
    return 0
  }

  return profile.rimHeightMeters * (xMeters / profile.halfWidthMeters) ** 2
}

function getWorkEnergySlopeForX(
  profile: WorkEnergyTrackSceneProfile,
  xMeters: number,
) {
  if (profile.halfWidthMeters === 0) {
    return 0
  }

  return (2 * profile.rimHeightMeters * xMeters) / profile.halfWidthMeters ** 2
}

function getWorkEnergyNormalForX(
  profile: WorkEnergyTrackSceneProfile,
  xMeters: number,
) {
  return new THREE.Vector3(
    -getWorkEnergySlopeForX(profile, xMeters),
    0,
    1,
  ).normalize()
}

function getWorkEnergyPitchForX(
  profile: WorkEnergyTrackSceneProfile,
  xMeters: number,
) {
  return -Math.atan(getWorkEnergySlopeForX(profile, xMeters))
}

function getWorkEnergyTrackNormal(sample: KinematicsSample) {
  const slope = getWorkEnergySampleSlope(sample)

  return new THREE.Vector3(-slope, 0, 1).normalize()
}

function getWorkEnergyTrackPitchRadians(sample: KinematicsSample) {
  return -Math.atan(getWorkEnergySampleSlope(sample))
}

function getWorkEnergySampleSlope(sample: KinematicsSample) {
  if (sample.primaryRadiusMeters === 0) {
    return 0
  }

  return (
    (2 * sample.secondaryRadiusMeters * sample.xMeters) /
    sample.primaryRadiusMeters ** 2
  )
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

  if (simulationId === 'mass-spring') {
    return createMassSpringReferencePath(samples, sceneProjection)
  }

  if (simulationId === 'collisions-1d-2d') {
    return createCollisionReferencePath(samples, sceneProjection)
  }

  if (simulationId === 'torque-levers-center-mass') {
    return createTorqueLeverReferencePath(samples, sceneProjection)
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

function createMassSpringReferencePath(
  samples: KinematicsSample[],
  sceneProjection: KinematicsSceneProjection,
) {
  const firstSample = samples[0]
  const group = new THREE.Group()
  const scale = sceneProjection.positionScale
  const springTopZ = (firstSample?.primaryRadiusMeters ?? 1) * scale
  const equilibriumExtensionZ = (firstSample?.secondaryRadiusMeters ?? 0) * scale
  const naturalReferenceZ = springTopZ - equilibriumExtensionZ
  const halfWidth = Math.max(
    0.55,
    Math.min(
      1.25,
      Math.max(...samples.map((sample) => Math.abs(sample.zMeters * scale))) *
        1.25,
    ),
  )

  group.add(
    createSceneLine(
      new THREE.Vector3(-halfWidth, -0.08, 0),
      new THREE.Vector3(halfWidth, -0.08, 0),
      0x2dd4bf,
      0.54,
    ),
  )
  group.add(
    createSceneLine(
      new THREE.Vector3(-halfWidth * 0.68, -0.08, naturalReferenceZ),
      new THREE.Vector3(halfWidth * 0.68, -0.08, naturalReferenceZ),
      0x818cf8,
      0.34,
    ),
  )
  group.add(
    createSceneLine(
      new THREE.Vector3(0, -0.16, Math.min(0, ...samples.map((sample) => sample.zMeters * scale))),
      new THREE.Vector3(0, -0.16, springTopZ),
      0xe6e8ec,
      0.18,
    ),
  )

  return group
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

function createTorqueLeverReferencePath(
  samples: KinematicsSample[],
  sceneProjection: KinematicsSceneProjection,
) {
  const firstSample = samples[0]
  const group = new THREE.Group()

  if (!firstSample) {
    return group
  }

  const scale = sceneProjection.positionScale
  const leftArm = firstSample.leftArmMeters * scale
  const rightArm = firstSample.rightArmMeters * scale
  const appliedArm = firstSample.appliedForceArmMeters * scale
  const leftSpan = Math.max(leftArm, 0.28)
  const rightSpan = Math.max(rightArm, appliedArm, 0.28)
  const pivot = new THREE.Vector3(0, 0, leverPivotHeight)

  group.add(
    createSceneLine(
      pivot.clone().add(new THREE.Vector3(-leftSpan, 0, 0)),
      pivot.clone().add(new THREE.Vector3(rightSpan, 0, 0)),
      0xe6e8ec,
      0.22,
    ),
  )
  group.add(
    createSceneLine(
      new THREE.Vector3(0, -0.26, 0),
      new THREE.Vector3(0, -0.26, leverPivotHeight),
      0xe6e8ec,
      0.18,
    ),
  )
  group.add(
    createSceneLine(
      new THREE.Vector3(firstSample.centerOfMassMeters * scale, -0.18, 0),
      new THREE.Vector3(
        firstSample.centerOfMassMeters * scale,
        -0.18,
        leverPivotHeight + 0.22,
      ),
      0xf59e0b,
      0.28,
    ),
  )

  return group
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

  if (simulationId === 'mass-spring') {
    const firstSample = samples[0]

    if (firstSample) {
      const scale = sceneProjection.positionScale
      const topZ = firstSample.primaryRadiusMeters * scale
      const minZ = Math.min(0, ...samples.map((sample) => sample.zMeters * scale))

      positions.push(
        new THREE.Vector3(-0.9, -0.55, minZ - 0.35),
        new THREE.Vector3(0.9, 0.55, topZ + 0.55),
      )
    }
  }

  if (simulationId === 'torque-levers-center-mass') {
    const firstSample = samples[0]

    if (firstSample) {
      const scale = sceneProjection.positionScale
      const leftSpan = Math.max(firstSample.leftArmMeters * scale, 0.42)
      const rightSpan = Math.max(
        firstSample.rightArmMeters * scale,
        firstSample.appliedForceArmMeters * scale,
        0.42,
      )

      positions.push(
        new THREE.Vector3(-leftSpan - 0.5, -0.62, 0),
        new THREE.Vector3(rightSpan + 0.5, 0.62, leverPivotHeight + 0.9),
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

  if (simulationId === 'work-energy-track') {
    const firstSample = samples[0]

    if (firstSample) {
      const scale = sceneProjection.positionScale
      const halfWidth = firstSample.primaryRadiusMeters * scale
      const rimHeight = firstSample.secondaryRadiusMeters * scale

      positions.push(
        new THREE.Vector3(-halfWidth * 1.18, -0.9, 0),
        new THREE.Vector3(halfWidth * 1.18, 0.9, rimHeight * 1.18),
      )
    }
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
  return simulationId === 'atwood-machine' || simulationId === 'mass-spring'
    ? -Math.PI / 2
    : initialCameraYawRadians
}

function getKinematicsCanvasAriaLabel(simulationId: KinematicsSimulationId) {
  if (simulationId === 'mass-spring') {
    return 'Cena 3D do massa-mola vertical com arraste para orbitar em torno, por cima e por baixo, e Shift + scroll para zoom'
  }

  if (simulationId === 'torque-levers-center-mass') {
    return 'Cena 3D da gangorra com massas, apoio fixo, centro de massa e vetores com arraste para orbitar, e Shift + scroll para zoom'
  }

  return 'Cena 3D de Cinematica com arraste para orbitar em torno, por cima e por baixo, e Shift + scroll para zoom'
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
