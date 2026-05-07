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
  computeGravitationalOrbitPathSamples,
  computeMechanicalWaveProfile,
  computeKinematicsSample,
  computeKinematicsTimeline,
  getKinematicsVectorOverlays,
  hydrostaticTankDepthMeters,
  interpolateKinematicsSample,
  type DopplerEffectParameters,
  type GravitationalFieldOrbitsParameters,
  type KinematicsParameters,
  type KinematicsSample,
  type KinematicsSimulationId,
  type KinematicsVectorOverlay,
  type MechanicalWaveProfileDomain,
  type MechanicalWaveProfilePoint,
  type WaveProfileParameters,
  type WaveProfileSimulationId,
  type WaveOnStringParameters,
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
  createOrbitCamera,
  positionOrbitCamera,
  updateOrbitCameraProjection,
  updateOrbitCameraPose,
  type CameraProjectionMode,
  type OrbitCamera,
  type OrbitCameraPose,
} from '../../lib/rendering/orbitCamera'
import {
  createOriginAxesMarker,
  getGridLowerLeftOrigin,
  getOriginAxesLength,
} from '../../lib/rendering/originAxes'
import { themeTokens } from '../../theme/appTheme'
import {
  getRigidBodyRotationBaseRadius,
  getRigidBodyRotationTracePosition,
  getRigidBodyRotorHalfLength,
  getRigidBodyRotorLength,
  getRigidBodySlidingMassRadiusRatio,
  rigidRotationRotorZ,
} from './rigidBodyRotationSceneGeometry'
import {
  createKinematicsSceneProjection,
  getUniformLinearMotionTrackRange,
  getUniformlyAcceleratedMotionTowerRange,
  selectUniformCircularMotionStrobeSamples,
  selectUniformLinearMotionStrobeSamples,
  selectUniformlyAcceleratedMotionStrobeSamples,
  toKinematicsSceneDirection,
  toKinematicsScenePosition,
  toOrbitSatelliteScenePosition,
  type KinematicsSceneProjection,
} from './KinematicsSceneProjection'
import { ViewportOriginLegend } from './ViewportOriginLegend'

export type KinematicsFrameStats = FrameStats
export type KinematicsCameraViewMode =
  | 'cinematic'
  | 'follow'
  | 'side'
  | 'top'

type KinematicsSceneProps = {
  cameraProjectionMode: CameraProjectionMode
  cameraViewMode?: KinematicsCameraViewMode
  durationSeconds: number
  isPlaying: boolean
  modelTimeScale?: number
  onSampleChange: (sample: KinematicsSample, stats: KinematicsFrameStats) => void
  parameters: KinematicsParameters
  playbackRate: number
  resetVersion: number
  samples: KinematicsSample[]
  showEnergy: boolean
  showTrace: boolean
  showVectors: boolean
  simulationId: KinematicsSimulationId
}

type RigidRotationVectorId = Extract<
  KinematicsVectorOverlay['id'],
  'angularAcceleration' | 'angularVelocity' | 'torque'
>

type RigidRotationCurvedArrow = {
  cone: THREE.Mesh
  line: THREE.Line
  positionAttribute: THREE.BufferAttribute
  positions: Float32Array
}

type WaveHistoryLine = {
  line: THREE.Line
  positionAttribute: THREE.BufferAttribute
  positions: Float32Array
}

type WaveLabObjects = {
  amplitudeLabel: THREE.Sprite
  amplitudeMarker: THREE.Line
  amplitudeMarkerPositionAttribute: THREE.BufferAttribute
  amplitudeMarkerPositions: Float32Array
  beads: THREE.InstancedMesh
  bench: THREE.Mesh
  energyPackets: THREE.InstancedMesh
  equilibriumLine: THREE.Line
  equilibriumPositionAttribute: THREE.BufferAttribute
  equilibriumPositions: Float32Array
  group: THREE.Group
  historyLines: WaveHistoryLine[]
  instanceHelper: THREE.Object3D
  leftSupport: THREE.Mesh
  probeGuide: THREE.Line
  probeGuidePositionAttribute: THREE.BufferAttribute
  probeGuidePositions: Float32Array
  probeLabel: THREE.Sprite
  rightSupport: THREE.Mesh
  sourceBase: THREE.Mesh
  sourceLabel: THREE.Sprite
  sourceRod: THREE.Mesh
  wavelengthLabel: THREE.Sprite
  wavelengthMarker: THREE.Line
  wavelengthMarkerPositionAttribute: THREE.BufferAttribute
  wavelengthMarkerPositions: Float32Array
}

type BernoulliFlowLookup = {
  phases: number[]
  volumeCubicMeters: number
  xMeters: number[]
}

type BernoulliSceneObjects = {
  group: THREE.Group
  manometerColumns: THREE.Mesh[]
  particles: THREE.InstancedMesh
  particlePhases: number[]
  flowLookup: BernoulliFlowLookup
}

type HydroPressureArrow = {
  angleRadians: number
  arrow: THREE.ArrowHelper
}

type SceneObjects = {
  arrows: Record<KinematicsVectorOverlay['id'], THREE.ArrowHelper>
  bernoulli: BernoulliSceneObjects
  body: THREE.Mesh
  camera: OrbitCamera
  cameraMaxRadius: number
  cameraMinRadius: number
  cameraRadius: number
  cameraTarget: THREE.Vector3
  coupledCouplingSpring: THREE.Line
  coupledCouplingSpringPositionAttribute: THREE.BufferAttribute
  coupledCouplingSpringPositions: Float32Array
  coupledDisplacementLabelA: THREE.Sprite
  coupledDisplacementLabelB: THREE.Sprite
  coupledEnergyPacketHelper: THREE.Object3D
  coupledEnergyPackets: THREE.InstancedMesh
  coupledEquilibriumLabel: THREE.Sprite
  coupledEquilibriumLineA: THREE.Line
  coupledEquilibriumLineB: THREE.Line
  coupledMassLabelA: THREE.Sprite
  coupledMassLabelB: THREE.Sprite
  coupledRulerA: THREE.LineSegments
  coupledRulerB: THREE.LineSegments
  coupledSecondaryTrace: THREE.Line
  coupledSecondaryTraceColorAttribute: THREE.BufferAttribute
  coupledSecondaryTraceColors: Float32Array
  coupledSecondaryTracePositionAttribute: THREE.BufferAttribute
  coupledSecondaryTracePositions: Float32Array
  hydroDisplacedVolume: THREE.Mesh
  hydroPressureArrows: HydroPressureArrow[]
  hydroPressureField: THREE.Mesh
  hydroPressureBaseRing: THREE.Mesh
  hydroPressureLevelLineAttribute: THREE.BufferAttribute
  hydroPressureLevelLinePositions: Float32Array
  hydroPressureLevelLines: THREE.LineSegments
  hydroPressureShell: THREE.Mesh
  hydroPressureTopRing: THREE.Mesh
  hydroTankEdges: THREE.LineSegments
  hydroTankGlass: THREE.Mesh
  hydroWater: THREE.Mesh
  hydroWaterSurface: THREE.Mesh
  hydroWaterSurfaceBasePositions: Float32Array
  renderer: THREE.WebGLRenderer
  rope: THREE.Line
  ropePositionAttribute: THREE.BufferAttribute
  ropePositions: Float32Array
  rigidRotationBaseRadius: number
  rollingPlane: THREE.Mesh
  rollingPlaneEdges: THREE.LineSegments
  rotationAngleArc: THREE.Line
  rotationAngleArcPositionAttribute: THREE.BufferAttribute
  rotationAngleArcPositions: Float32Array
  rotationAngleMarker: THREE.Mesh
  rotationAxis: THREE.Mesh
  rotationBase: THREE.Mesh
  rotationBrakePad: THREE.Mesh
  rotationCounterMass: THREE.Mesh
  rotationCurvedArrows: Record<RigidRotationVectorId, RigidRotationCurvedArrow>
  rotationHub: THREE.Mesh
  rotationRim: THREE.Mesh
  rotationThermalRing: THREE.Mesh
  rotationTipMass: THREE.Mesh
  rotationZeroLine: THREE.Line
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
  orbitCentralBody: THREE.Mesh
  orbitSatellitePath: THREE.Line
  orbitSatellitePathPositionAttribute: THREE.BufferAttribute
  orbitSatellitePathPositions: Float32Array
  pulley: THREE.Mesh
  supportBar: THREE.Mesh
  supportStem: THREE.Mesh
  trace: THREE.Line
  traceColorAttribute: THREE.BufferAttribute
  traceColors: Float32Array
  tracePositionAttribute: THREE.BufferAttribute
  tracePositions: Float32Array
  waveComponentOne: THREE.Line
  waveComponentOnePositionAttribute: THREE.BufferAttribute
  waveComponentOnePositions: Float32Array
  waveComponentTwo: THREE.Line
  waveComponentTwoPositionAttribute: THREE.BufferAttribute
  waveComponentTwoPositions: Float32Array
  waveEnvelopeLower: THREE.Line
  waveEnvelopeLowerPositionAttribute: THREE.BufferAttribute
  waveEnvelopeLowerPositions: Float32Array
  waveEnvelopeUpper: THREE.Line
  waveEnvelopeUpperPositionAttribute: THREE.BufferAttribute
  waveEnvelopeUpperPositions: Float32Array
  waveLab: WaveLabObjects
  waveProfileDomain: MechanicalWaveProfileDomain | null
  waveString: THREE.Line
  waveStringPositionAttribute: THREE.BufferAttribute
  waveStringPositions: Float32Array
  uniformCircularAngleArc: THREE.Line
  uniformCircularAngleArcPositionAttribute: THREE.BufferAttribute
  uniformCircularAngleArcPositions: Float32Array
  uniformCircularAngleLabel: THREE.Sprite
  uniformCircularLapPulse: THREE.Mesh
  uniformCircularRadiusLabel: THREE.Sprite
  acceleratedMotionAccelerationLabel: THREE.Sprite
  acceleratedMotionBodyShadow: THREE.Mesh
  acceleratedMotionCurrentLabel: THREE.Sprite
  acceleratedMotionHeightBand: THREE.Mesh
  acceleratedMotionHeightLabel: THREE.Sprite
  acceleratedMotionImpactRing: THREE.Mesh
  acceleratedMotionVelocityLabel: THREE.Sprite
  uniformMotionBodyShadow: THREE.Mesh
  uniformMotionCurrentLabel: THREE.Sprite
  uniformMotionCurrentMarker: THREE.Mesh
  uniformMotionDisplacementBand: THREE.Mesh
  uniformMotionDisplacementLabel: THREE.Sprite
  atwoodMassHalfHeight: number
  workEnergyBodyLift: number
  workEnergyMaxThermalEnergyJoules: number
  workEnergyTrackNormal: THREE.Vector3
  workEnergyTrackPitchRadians: number
}

type RuntimeProps = {
  cameraViewMode: KinematicsCameraViewMode
  durationSeconds: number
  modelTimeScale: number
  onSampleChange: (sample: KinematicsSample, stats: KinematicsFrameStats) => void
  parameters: KinematicsParameters
  playbackRate: number
  sampleRateHz: number
  samples: KinematicsSample[]
  showEnergy: boolean
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
  angularMomentum: 0xa3e635,
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
  'angularMomentum',
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
const atwoodRopePointCapacity = 192
const atwoodRopeArcSegments = 28
const coupledCouplingSpringPointCapacity = 64
const coupledEnergyPacketCount = 10
const massSpringCoilSegments = 72
const massSpringCoilTurns = 9
const maxPathPoints = 360
const maxTracePoints = 120
const waveEnergyPacketCount = 18
const dopplerWavefrontMarkerCount = 48
const waveEnergyPacketCapacity = Math.max(
  waveEnergyPacketCount,
  dopplerWavefrontMarkerCount,
)
const waveHistoryLineCount = 7
const waveStringPointCapacity = 128
const waveStringBeadCount = waveStringPointCapacity
const soundWaveFieldColumnCount = 72
const soundWaveFieldRingCount = 12
const dopplerSoundWaveFieldColumnCount = 128
const dopplerSoundWaveFieldRingCount = 32
const soundWaveFieldBeadCount =
  soundWaveFieldColumnCount * soundWaveFieldRingCount
const dopplerSoundWaveFieldBeadCount =
  dopplerSoundWaveFieldColumnCount * dopplerSoundWaveFieldRingCount
const waveBeadCapacity = Math.max(
  waveStringBeadCount,
  soundWaveFieldBeadCount,
  dopplerSoundWaveFieldBeadCount,
)
const traceFadeSeconds = 2.4
const uniformLinearTracePointCount = 48
const constantAccelerationTracePointCount = 72
const orbitalTraceFadeSeconds = 900
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
const rollingPlaneMinimumWidth = 0.72
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
const rigidRotationAngleArcSegments = 72
const uniformCircularAngleArcSegments = 96
const rigidRotationBaseThickness = 0.12
const rigidRotationCurvedArrowSegments = 36
const rigidRotationAxisHeight = 0.7
const orbitSatellitePathSegments = 96
const hydroTankWidthMeters = 2.8
const hydroTankHorizontalDepthMeters = 1.8
const hydroPressureFieldSegments = 24
const hydroPressureLevelCount = 7
const hydroPressureLevelSegmentVertices = 8
const hydroPressureArrowAngles = [
  0,
  Math.PI / 6,
  Math.PI / 3,
  Math.PI / 2,
  (Math.PI * 2) / 3,
  (Math.PI * 5) / 6,
  Math.PI,
  (Math.PI * 7) / 6,
  (Math.PI * 4) / 3,
  (Math.PI * 3) / 2,
  (Math.PI * 5) / 3,
  (Math.PI * 11) / 6,
] as const
const hydroSubmergedVolumeRings = 18
const hydroSubmergedVolumeSegments = 44
const bernoulliTubeHalfLengthMeters = 3
const bernoulliTubeSegments = 84
const bernoulliTubeRadialSegments = 28
const bernoulliFlowLookupSegments = 120
const bernoulliParticleCount = 72
const bernoulliParticleRadius = 0.035
const bernoulliManometerMaxHeight = 1.38
const bernoulliManometerMinHeight = 0.12
const bernoulliManometerFrontY = -0.72
const bernoulliManometerXs = [-2.35, 0, 2.35] as const
const bernoulliTubeRadiusVisualScale = 2.65
const bernoulliThroatWidthMeters = 0.95

export function KinematicsScene({
  cameraProjectionMode,
  cameraViewMode = 'cinematic',
  durationSeconds,
  isPlaying,
  modelTimeScale = 1,
  onSampleChange,
  parameters,
  playbackRate,
  resetVersion,
  samples,
  showEnergy,
  showTrace,
  showVectors,
  simulationId,
}: KinematicsSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const objectsRef = useRef<SceneObjects | null>(null)
  const runtimeRef = useRef<RuntimeProps>({
    cameraViewMode,
    durationSeconds,
    modelTimeScale,
    onSampleChange,
    parameters,
    playbackRate,
    sampleRateHz: readSampleRateHz(samples),
    samples,
    showEnergy,
    showTrace,
    showVectors,
    simulationId,
  })
  const elapsedSecondsRef = useRef(0)
  const frameIdRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number | null>(null)
  const lastReadoutTimeRef = useRef(0)
  const cameraPoseRef = useRef<OrbitCameraPose>({
    pitchRadians: getInitialCameraPitchRadians(simulationId, cameraViewMode),
    yawRadians: getInitialCameraYawRadians(simulationId, cameraViewMode),
  })
  const dragStateRef = useRef<DragState | null>(null)
  const statsWindowRef = useRef(createFrameStatsWindow())
  const timelineSamplesRef = useRef<KinematicsSample[]>(samples)
  const traceSamplesRef = useRef<KinematicsSample[]>([readFirstKinematicsSample(samples)])
  const updateCameraProjection = useCallback((objects: SceneObjects | null) => {
    const parent = canvasRef.current?.parentElement

    if (!objects || !parent) {
      return
    }

    updateOrbitCameraProjection(objects.camera, {
      cameraRadius: objects.cameraRadius,
      height: parent.clientHeight,
      width: parent.clientWidth,
    })
  }, [])

  const renderCurrentFrame = useCallback((notify = false) => {
    const objects = objectsRef.current
    const runtime = runtimeRef.current
    const frame = readContinuousKinematicsFrame(
      runtime,
      timelineSamplesRef,
      elapsedSecondsRef.current,
    )
    const sample = frame.sample
    appendTraceSample(
      traceSamplesRef.current,
      sample,
      getTraceFadeSeconds(runtime.simulationId),
    )

    if (!objects || !sample) {
      return
    }

    updateKinematicsObjects({
      objects,
      parameters: runtime.parameters,
      sample,
      sampleIndex: traceSamplesRef.current.length - 1,
      samples: traceSamplesRef.current,
      showEnergy: runtime.showEnergy,
      showTrace: runtime.showTrace,
      showVectors: runtime.showVectors,
      simulationId: runtime.simulationId,
    })
    updateFollowCamera(objects, sample, runtime)
    objects.renderer.render(objects.scene, objects.camera)

    if (notify) {
      runtime.onSampleChange(
        {
          ...sample,
          timeSeconds: sample.timeSeconds,
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
      updateCameraProjection(objects)
      updateOrbitCamera(objects, cameraPoseRef.current)
      renderCurrentFrame()
    },
    [renderCurrentFrame, updateCameraProjection],
  )

  useEffect(() => {
    timelineSamplesRef.current = samples
    runtimeRef.current = {
      cameraViewMode,
      durationSeconds,
      modelTimeScale,
      onSampleChange,
      parameters,
      playbackRate,
      sampleRateHz: readSampleRateHz(samples),
      samples,
      showEnergy,
      showTrace,
      showVectors,
      simulationId,
    }

    renderCurrentFrame()
  }, [
    durationSeconds,
    modelTimeScale,
    onSampleChange,
    parameters,
    playbackRate,
    renderCurrentFrame,
    samples,
    showEnergy,
    showTrace,
    showVectors,
    simulationId,
    cameraViewMode,
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

    const waveProfileDomain = createMechanicalWaveProfileDomain(
      samples,
      simulationId,
      parameters,
    )
    const referencePathSamples = createSceneReferencePathSamples(
      samples,
      simulationId,
      parameters,
      waveProfileDomain,
    )
    const framingSamples = mergeSceneFramingSamples(samples, referencePathSamples)
    const sceneProjection = createKinematicsSceneProjection(
      framingSamples,
      simulationId,
    )
    const workEnergyProfile = createWorkEnergyTrackSceneProfile(
      samples,
      sceneProjection,
    )
    const bounds = estimateSceneBounds(
      framingSamples,
      sceneProjection,
      simulationId,
    )
    const scene = new THREE.Scene()
    const camera = createOrbitCamera('perspective', { far: 160 })
    const cameraTarget = new THREE.Vector3(
      bounds.centerX,
      bounds.centerY,
      bounds.centerZ,
    )
    const cameraRadius =
      simulationId === 'rigid-body-rotation'
        ? Math.max(3.05, bounds.span * 0.84)
        : Math.max(
            4.2,
            bounds.span * (simulationId === 'collisions-1d-2d' ? 0.92 : 1.35),
          )
    const cameraMinRadius = Math.max(1.2, cameraRadius * minCameraRadiusScale)
    const cameraMaxRadius = cameraRadius * maxCameraRadiusScale

    scene.background = new THREE.Color(themeTokens.background)
    scene.add(new THREE.AmbientLight(0xffffff, 0.64))
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.12)

    keyLight.position.set(-2.4, -3.2, 5)
    scene.add(keyLight)

    const gridSize =
      simulationId === 'rigid-body-rotation'
        ? Math.max(4, bounds.span * 0.96)
        : Math.max(5, bounds.span * 1.25)
    const gridBackground = new THREE.Mesh(
      new THREE.PlaneGeometry(gridSize, gridSize),
      new THREE.MeshBasicMaterial({
        color: 0x171a21,
        depthWrite: false,
        opacity: simulationId === 'rigid-body-rotation' ? 0.22 : 0.34,
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
    grid.material.opacity =
      simulationId === 'rigid-body-rotation' ? 0.18 : 0.38
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

    const pathSamples =
      simulationId === 'doppler-effect' ? framingSamples : referencePathSamples

    scene.add(
      createReferencePath(
        pathSamples,
        simulationId,
        sceneProjection,
        workEnergyProfile,
      ),
    )

    const sceneBodySize = getBodyDisplaySize(bounds.span)
    const atwoodMassSize = sceneBodySize * 1.8
    const rigidRotationBaseRadius =
      getRigidBodyRotationBaseRadius(sceneBodySize)
    const rollingWheelDepth = sceneBodySize * 0.72
    const rollingPlane = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({
        color: 0x20242d,
        opacity: 0.84,
        side: THREE.DoubleSide,
        transparent: true,
      }),
    )
    const rollingPlaneEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(rollingPlane.geometry),
      new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.34,
      }),
    )

    configureRollingPlaneReference({
      plane: rollingPlane,
      planeEdges: rollingPlaneEdges,
      samples,
      sceneProjection,
      visible: simulationId === 'rolling-without-slipping',
      wheelRadius: sceneBodySize,
    })
    scene.add(rollingPlane)
    scene.add(rollingPlaneEdges)

    const hydroTankGlass = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        depthWrite: false,
        metalness: 0,
        opacity: 0.105,
        roughness: 0.04,
        side: THREE.DoubleSide,
        transparent: true,
        transmission: 0.24,
      }),
    )
    const hydroTankEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1)),
      new THREE.LineBasicMaterial({
        color: 0x8bd7ff,
        opacity: 0.46,
        transparent: true,
      }),
    )
    const hydroWater = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        depthWrite: false,
        metalness: 0,
        opacity: 0.22,
        roughness: 0.12,
        transparent: true,
        transmission: 0.35,
      }),
    )
    const hydroPressureField = new THREE.Mesh(
      createHydroPressureFieldGeometry(),
      new THREE.MeshBasicMaterial({
        depthWrite: false,
        opacity: 0.42,
        side: THREE.DoubleSide,
        transparent: true,
        vertexColors: true,
      }),
    )
    const hydroPressureLevelLinePositions = new Float32Array(
      hydroPressureLevelCount * hydroPressureLevelSegmentVertices * 3,
    )
    const hydroPressureLevelLineAttribute = new THREE.BufferAttribute(
      hydroPressureLevelLinePositions,
      3,
    )
    const hydroPressureLevelLineGeometry = new THREE.BufferGeometry()
    hydroPressureLevelLineAttribute.setUsage(THREE.DynamicDrawUsage)
    hydroPressureLevelLineGeometry.setAttribute(
      'position',
      hydroPressureLevelLineAttribute,
    )
    hydroPressureLevelLineGeometry.setDrawRange(
      0,
      hydroPressureLevelCount * hydroPressureLevelSegmentVertices,
    )
    const hydroPressureLevelLines = new THREE.LineSegments(
      hydroPressureLevelLineGeometry,
      new THREE.LineBasicMaterial({
        color: 0x8bd7ff,
        depthWrite: false,
        opacity: 0.34,
        transparent: true,
      }),
    )
    const hydroDisplacedVolume = new THREE.Mesh(
      createHydroSubmergedVolumeGeometry(),
      new THREE.MeshBasicMaterial({
        color: 0xa3e635,
        depthWrite: false,
        opacity: 0.28,
        side: THREE.DoubleSide,
        transparent: true,
      }),
    )
    const hydroPressureShell = new THREE.Mesh(
      createHydroPressureShellGeometry(),
      new THREE.MeshBasicMaterial({
        depthWrite: false,
        opacity: 0.5,
        side: THREE.DoubleSide,
        transparent: true,
        vertexColors: true,
      }),
    )
    const hydroPressureTopRing = createHydroPressureRing(0xfbbf24)
    const hydroPressureBaseRing = createHydroPressureRing(0xf43f5e)
    const hydroWaterSurfaceGeometry = new THREE.PlaneGeometry(1, 1, 48, 24)
    const hydroWaterSurfacePositionAttribute =
      hydroWaterSurfaceGeometry.getAttribute('position') as THREE.BufferAttribute
    hydroWaterSurfacePositionAttribute.setUsage(THREE.DynamicDrawUsage)
    const hydroWaterSurfaceBasePositions = Float32Array.from(
      hydroWaterSurfacePositionAttribute.array as ArrayLike<number>,
    )
    const hydroWaterSurface = new THREE.Mesh(
      hydroWaterSurfaceGeometry,
      new THREE.MeshBasicMaterial({
        color: 0x2dd4bf,
        depthWrite: false,
        opacity: 0.48,
        side: THREE.DoubleSide,
        transparent: true,
      }),
    )
    const hydroPressureArrows = hydroPressureArrowAngles.map((angleRadians) => {
      const arrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(0, 0, 0),
        0.26,
        0x8bd7ff,
        0.07,
        0.04,
      )

      configureHydroPressureArrowMaterial(arrow)

      return {
        angleRadians,
        arrow,
      }
    })

    ;[
      hydroTankGlass,
      hydroPressureField,
      hydroWater,
      hydroDisplacedVolume,
      hydroPressureShell,
      hydroPressureTopRing,
      hydroPressureBaseRing,
      hydroPressureLevelLines,
      hydroWaterSurface,
      hydroTankEdges,
    ].forEach((object, index) => {
      object.renderOrder = 2 + index
      object.visible = false
      scene.add(object)
    })

    hydroPressureArrows.forEach(({ arrow }) => {
      arrow.renderOrder = 10
      arrow.visible = false
      scene.add(arrow)
    })

    const bernoulli = createBernoulliVenturiObjects(samples, sceneProjection)

    scene.add(bernoulli.group)

    const body = new THREE.Mesh(
      simulationId === 'atwood-machine'
        ? new THREE.BoxGeometry(atwoodMassSize, atwoodMassSize, atwoodMassSize)
        : simulationId === 'rolling-without-slipping'
          ? new THREE.CylinderGeometry(
              sceneBodySize,
              sceneBodySize,
              rollingWheelDepth,
              32,
            )
        : simulationId === 'rigid-body-rotation' ||
            simulationId === 'torque-levers-center-mass'
          ? simulationId === 'torque-levers-center-mass'
            ? new THREE.BoxGeometry(1, 1, 1)
            : new THREE.BoxGeometry(
                getRigidBodyRotorLength(sceneBodySize),
                sceneBodySize * 0.72,
                sceneBodySize * 0.42,
              )
        : simulationId === 'work-energy-track'
          ? new THREE.BoxGeometry(
              sceneBodySize * 1.9,
              sceneBodySize * 1.08,
              sceneBodySize * 0.72,
            )
        : simulationId === 'hydrostatics-buoyancy'
          ? new THREE.SphereGeometry(1, 32, 20)
        : new THREE.SphereGeometry(
            simulationId === 'collisions-1d-2d' ? 1 : sceneBodySize,
            24,
            16,
          ),
      new THREE.MeshStandardMaterial({
        color:
          simulationId === 'uniformly-accelerated-motion' ||
          simulationId === 'uniform-circular-motion'
            ? 0x67e8f9
            : 0x2dd4bf,
        emissive:
          simulationId === 'uniformly-accelerated-motion' ||
          simulationId === 'uniform-circular-motion'
            ? 0x083344
            : 0x000000,
        emissiveIntensity:
          simulationId === 'uniformly-accelerated-motion' ||
          simulationId === 'uniform-circular-motion'
            ? 0.32
            : 0,
        metalness:
          simulationId === 'uniformly-accelerated-motion' ||
          simulationId === 'uniform-circular-motion'
            ? 0.28
            : 0.08,
        roughness:
          simulationId === 'uniformly-accelerated-motion' ||
          simulationId === 'uniform-circular-motion'
            ? 0.28
            : 0.42,
      }),
    )
    addRollingWheelHoleMarkers({
      body,
      visible: simulationId === 'rolling-without-slipping',
      wheelDepth: rollingWheelDepth,
      wheelRadius: sceneBodySize,
    })
    scene.add(body)

    const rotationBase = new THREE.Mesh(
      new THREE.CylinderGeometry(
        rigidRotationBaseRadius * 1.02,
        rigidRotationBaseRadius * 1.08,
        rigidRotationBaseThickness,
        72,
      ),
      new THREE.MeshStandardMaterial({
        color: 0x20242d,
        metalness: 0.12,
        roughness: 0.54,
      }),
    )
    rotationBase.rotation.x = Math.PI / 2
    rotationBase.position.z = -rigidRotationBaseThickness / 2

    const rotationRim = new THREE.Mesh(
      new THREE.TorusGeometry(rigidRotationBaseRadius, 0.026, 10, 96),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x082433,
        emissiveIntensity: 0.24,
        metalness: 0.14,
        roughness: 0.42,
      }),
    )
    rotationRim.position.z = 0.012

    const rotationAxis = new THREE.Mesh(
      new THREE.CylinderGeometry(0.034, 0.034, rigidRotationAxisHeight, 24),
      new THREE.MeshStandardMaterial({
        color: 0xe6e8ec,
        metalness: 0.32,
        roughness: 0.34,
      }),
    )
    rotationAxis.rotation.x = Math.PI / 2
    rotationAxis.position.z = rigidRotationAxisHeight / 2 - 0.04

    const rotationHub = new THREE.Mesh(
      new THREE.CylinderGeometry(sceneBodySize * 0.72, sceneBodySize * 0.72, 0.14, 40),
      new THREE.MeshStandardMaterial({
        color: 0xe6e8ec,
        metalness: 0.22,
        roughness: 0.4,
      }),
    )
    rotationHub.rotation.x = Math.PI / 2
    rotationHub.position.z = rigidRotationRotorZ

    const rotationTipMass = new THREE.Mesh(
      new THREE.SphereGeometry(1, 24, 16),
      new THREE.MeshStandardMaterial({
        color: 0x2dd4bf,
        emissive: 0x06352e,
        emissiveIntensity: 0.12,
        metalness: 0.06,
        roughness: 0.46,
      }),
    )
    const rotationCounterMass = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({
        color: 0xa3e635,
        emissive: 0x1f3b0a,
        emissiveIntensity: 0.14,
        metalness: 0.04,
        roughness: 0.5,
      }),
    )

    const rotationZeroLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, rigidRotationRotorZ + 0.055),
        new THREE.Vector3(rigidRotationBaseRadius * 0.98, 0, rigidRotationRotorZ + 0.055),
      ]),
      new THREE.LineBasicMaterial({
        color: 0xe6e8ec,
        transparent: true,
        opacity: 0.42,
      }),
    )

    const rotationAngleArcPositions = new Float32Array(
      (rigidRotationAngleArcSegments + 1) * 3,
    )
    const rotationAngleArcGeometry = new THREE.BufferGeometry()
    const rotationAngleArcPositionAttribute = new THREE.BufferAttribute(
      rotationAngleArcPositions,
      3,
    )
    rotationAngleArcPositionAttribute.setUsage(THREE.DynamicDrawUsage)
    rotationAngleArcGeometry.setAttribute(
      'position',
      rotationAngleArcPositionAttribute,
    )
    rotationAngleArcGeometry.setDrawRange(0, 0)
    const rotationAngleArc = new THREE.Line(
      rotationAngleArcGeometry,
      new THREE.LineBasicMaterial({
        color: 0x2dd4bf,
        transparent: true,
        opacity: 0.86,
      }),
    )
    const rotationAngleMarker = new THREE.Mesh(
      new THREE.SphereGeometry(sceneBodySize * 0.2, 18, 10),
      new THREE.MeshBasicMaterial({
        color: 0x2dd4bf,
        transparent: true,
        opacity: 0.92,
      }),
    )

    const rotationBrakePad = new THREE.Mesh(
      new THREE.BoxGeometry(0.34, 0.07, 0.16),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0x3b2504,
        emissiveIntensity: 0.32,
        metalness: 0.08,
        roughness: 0.5,
      }),
    )
    const rotationThermalRing = new THREE.Mesh(
      new THREE.TorusGeometry(rigidRotationBaseRadius * 0.91, 0.018, 8, 96),
      new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        depthWrite: false,
        transparent: true,
        opacity: 0,
      }),
    )
    rotationThermalRing.position.z = 0.05

    const rotationCurvedArrows: Record<
      RigidRotationVectorId,
      RigidRotationCurvedArrow
    > = {
      angularAcceleration: createRigidRotationCurvedArrow(0xf59e0b),
      angularVelocity: createRigidRotationCurvedArrow(0x38bdf8),
      torque: createRigidRotationCurvedArrow(0xa3e635),
    }

    ;[
      rotationBase,
      rotationRim,
      rotationAxis,
      rotationHub,
      rotationTipMass,
      rotationCounterMass,
      rotationZeroLine,
      rotationAngleArc,
      rotationAngleMarker,
      rotationBrakePad,
      rotationThermalRing,
    ].forEach((object) => {
      object.visible = false
      scene.add(object)
    })
    Object.values(rotationCurvedArrows).forEach((arrow) => {
      arrow.line.visible = false
      arrow.cone.visible = false
      scene.add(arrow.line)
      scene.add(arrow.cone)
    })

    const orbitCentralBody = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 20),
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0x3b2504,
        emissiveIntensity: 0.38,
        metalness: 0.02,
        roughness: 0.46,
      }),
    )
    orbitCentralBody.visible = false
    scene.add(orbitCentralBody)

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

    const orbitSatellitePathPositions = new Float32Array(
      (orbitSatellitePathSegments + 1) * 3,
    )
    const orbitSatellitePathGeometry = new THREE.BufferGeometry()
    const orbitSatellitePathPositionAttribute = new THREE.BufferAttribute(
      orbitSatellitePathPositions,
      3,
    )
    orbitSatellitePathPositionAttribute.setUsage(THREE.DynamicDrawUsage)
    orbitSatellitePathGeometry.setAttribute(
      'position',
      orbitSatellitePathPositionAttribute,
    )
    orbitSatellitePathGeometry.setDrawRange(0, 0)
    const orbitSatellitePath = new THREE.Line(
      orbitSatellitePathGeometry,
      new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        opacity: 0.42,
        transparent: true,
      }),
    )
    orbitSatellitePath.visible = false
    scene.add(orbitSatellitePath)

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

    const coupledCouplingSpringPositions = new Float32Array(
      coupledCouplingSpringPointCapacity * 3,
    )
    const coupledCouplingSpringGeometry = new THREE.BufferGeometry()
    const coupledCouplingSpringPositionAttribute = new THREE.BufferAttribute(
      coupledCouplingSpringPositions,
      3,
    )

    coupledCouplingSpringPositionAttribute.setUsage(THREE.DynamicDrawUsage)
    coupledCouplingSpringGeometry.setAttribute(
      'position',
      coupledCouplingSpringPositionAttribute,
    )
    coupledCouplingSpringGeometry.setDrawRange(0, 0)
    const coupledCouplingSpring = new THREE.Line(
      coupledCouplingSpringGeometry,
      new THREE.LineBasicMaterial({
        color: 0xa3e635,
        depthWrite: false,
        opacity: 0.9,
        transparent: true,
      }),
    )
    const coupledEnergyPackets = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.032, 12, 8),
      new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        depthWrite: false,
        opacity: 0.82,
        transparent: true,
      }),
      coupledEnergyPacketCount,
    )
    const coupledEnergyPacketHelper = new THREE.Object3D()
    const coupledMassLabelA = createSceneTextSprite('Massa A', {
      background: 'rgba(15, 17, 21, 0.74)',
      color: '#2DD4BF',
      scale: 0.18,
    })
    const coupledMassLabelB = createSceneTextSprite('Massa B', {
      background: 'rgba(15, 17, 21, 0.74)',
      color: '#38BDF8',
      scale: 0.18,
    })
    const coupledDisplacementLabelA = createSceneTextSprite('xA = 0 m', {
      background: 'rgba(15, 17, 21, 0.7)',
      color: '#2DD4BF',
      scale: 0.155,
    })
    const coupledDisplacementLabelB = createSceneTextSprite('xB = 0 m', {
      background: 'rgba(15, 17, 21, 0.7)',
      color: '#38BDF8',
      scale: 0.155,
    })
    const coupledEquilibriumLabel = createSceneTextSprite(
      'posicao de equilibrio',
      {
        background: 'rgba(15, 17, 21, 0.62)',
        color: '#CBD5E1',
        scale: 0.135,
      },
    )
    const coupledEquilibriumLineA = createSceneLine(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      0xcbd5e1,
      0.38,
    )
    const coupledEquilibriumLineB = createSceneLine(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      0xcbd5e1,
      0.38,
    )
    const coupledRulerA = createCoupledOscillatorRuler()
    const coupledRulerB = createCoupledOscillatorRuler()

    ;[
      coupledCouplingSpring,
      coupledEnergyPackets,
      coupledMassLabelA,
      coupledMassLabelB,
      coupledDisplacementLabelA,
      coupledDisplacementLabelB,
      coupledEquilibriumLabel,
      coupledEquilibriumLineA,
      coupledEquilibriumLineB,
      coupledRulerA,
      coupledRulerB,
    ].forEach((object) => {
      object.renderOrder = 11
      object.visible = false
      scene.add(object)
    })

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

    const coupledSecondaryTracePositions = new Float32Array(maxTracePoints * 3)
    const coupledSecondaryTraceColors = new Float32Array(maxTracePoints * 4)
    const coupledSecondaryTraceGeometry = new THREE.BufferGeometry()
    const coupledSecondaryTracePositionAttribute = new THREE.BufferAttribute(
      coupledSecondaryTracePositions,
      3,
    )
    const coupledSecondaryTraceColorAttribute = new THREE.BufferAttribute(
      coupledSecondaryTraceColors,
      4,
    )

    coupledSecondaryTracePositionAttribute.setUsage(THREE.DynamicDrawUsage)
    coupledSecondaryTraceColorAttribute.setUsage(THREE.DynamicDrawUsage)
    coupledSecondaryTraceGeometry.setAttribute(
      'position',
      coupledSecondaryTracePositionAttribute,
    )
    coupledSecondaryTraceGeometry.setAttribute(
      'color',
      coupledSecondaryTraceColorAttribute,
    )
    coupledSecondaryTraceGeometry.setDrawRange(0, 0)
    const coupledSecondaryTrace = new THREE.Line(
      coupledSecondaryTraceGeometry,
      new THREE.LineBasicMaterial({
        depthWrite: false,
        transparent: true,
        vertexColors: true,
      }),
    )
    coupledSecondaryTrace.visible = false
    scene.add(coupledSecondaryTrace)

    const waveStringPositions = new Float32Array(waveStringPointCapacity * 3)
    const waveComponentOnePositions = new Float32Array(
      waveStringPointCapacity * 3,
    )
    const waveComponentTwoPositions = new Float32Array(
      waveStringPointCapacity * 3,
    )
    const waveEnvelopeUpperPositions = new Float32Array(
      waveStringPointCapacity * 3,
    )
    const waveEnvelopeLowerPositions = new Float32Array(
      waveStringPointCapacity * 3,
    )
    const waveStringPositionAttribute = new THREE.BufferAttribute(
      waveStringPositions,
      3,
    )
    const waveComponentOnePositionAttribute = new THREE.BufferAttribute(
      waveComponentOnePositions,
      3,
    )
    const waveComponentTwoPositionAttribute = new THREE.BufferAttribute(
      waveComponentTwoPositions,
      3,
    )
    const waveEnvelopeUpperPositionAttribute = new THREE.BufferAttribute(
      waveEnvelopeUpperPositions,
      3,
    )
    const waveEnvelopeLowerPositionAttribute = new THREE.BufferAttribute(
      waveEnvelopeLowerPositions,
      3,
    )
    const waveString = createDynamicWaveLine(
      waveStringPositionAttribute,
      0x2dd4bf,
      0.96,
    )
    const waveComponentOne = createDynamicWaveLine(
      waveComponentOnePositionAttribute,
      0x38bdf8,
      0.38,
    )
    const waveComponentTwo = createDynamicWaveLine(
      waveComponentTwoPositionAttribute,
      0x818cf8,
      0.38,
    )
    const waveEnvelopeUpper = createDynamicWaveLine(
      waveEnvelopeUpperPositionAttribute,
      0xf59e0b,
      0.3,
    )
    const waveEnvelopeLower = createDynamicWaveLine(
      waveEnvelopeLowerPositionAttribute,
      0xf59e0b,
      0.3,
    )

    ;[
      waveString,
      waveComponentOne,
      waveComponentTwo,
      waveEnvelopeUpper,
      waveEnvelopeLower,
    ].forEach((line) => {
      line.visible = false
      scene.add(line)
    })

    const waveLab = createWaveLabObjects()

    waveLab.group.visible = false
    scene.add(waveLab.group)

    const acceleratedMotionBodyShadow = new THREE.Mesh(
      new THREE.CircleGeometry(sceneBodySize * 1.22, 36),
      new THREE.MeshBasicMaterial({
        color: 0x020617,
        depthWrite: false,
        transparent: true,
        opacity: 0.52,
      }),
    )
    const acceleratedMotionHeightBand = new THREE.Mesh(
      new THREE.BoxGeometry(0.055, 0.045, 1),
      new THREE.MeshBasicMaterial({
        color: 0xa3e635,
        depthWrite: false,
        transparent: true,
        opacity: 0.52,
      }),
    )
    const acceleratedMotionImpactRing = new THREE.Mesh(
      new THREE.TorusGeometry(sceneBodySize * 1.22, 0.018, 8, 64),
      new THREE.MeshBasicMaterial({
        color: 0x2dd4bf,
        depthWrite: false,
        transparent: true,
        opacity: 0.88,
      }),
    )
    const acceleratedMotionCurrentLabel = createSceneTextSprite('z(t)', {
      background: 'rgba(15, 17, 21, 0.72)',
      color: '#E6E8EC',
      scale: 0.2,
    })
    const acceleratedMotionHeightLabel = createSceneTextSprite(
      'altura restante = 0 m',
      {
        background: 'rgba(15, 17, 21, 0.72)',
        color: '#A3E635',
        scale: 0.18,
      },
    )
    const acceleratedMotionVelocityLabel = createSceneTextSprite('v = 0 m/s', {
      background: 'rgba(15, 17, 21, 0.72)',
      color: '#38BDF8',
      scale: 0.17,
    })
    const acceleratedMotionAccelerationLabel = createSceneTextSprite(
      'a = 0 m/s^2',
      {
        background: 'rgba(15, 17, 21, 0.72)',
        color: '#FDBA74',
        scale: 0.17,
      },
    )

    ;[
      acceleratedMotionBodyShadow,
      acceleratedMotionHeightBand,
      acceleratedMotionImpactRing,
      acceleratedMotionCurrentLabel,
      acceleratedMotionHeightLabel,
      acceleratedMotionVelocityLabel,
      acceleratedMotionAccelerationLabel,
    ].forEach((object) => {
      object.renderOrder = 8
      object.visible = false
      scene.add(object)
    })

    const uniformMotionCurrentMarker = new THREE.Mesh(
      new THREE.TorusGeometry(sceneBodySize * 0.88, 0.012, 8, 48),
      new THREE.MeshBasicMaterial({
        color: 0x2dd4bf,
        depthWrite: false,
        transparent: true,
        opacity: 0.9,
      }),
    )
    const uniformMotionDisplacementBand = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.07, 0.035),
      new THREE.MeshBasicMaterial({
        color: 0xa3e635,
        depthWrite: false,
        transparent: true,
        opacity: 0.58,
      }),
    )
    const uniformMotionBodyShadow = new THREE.Mesh(
      new THREE.CircleGeometry(sceneBodySize * 1.18, 36),
      new THREE.MeshBasicMaterial({
        color: 0x020617,
        depthWrite: false,
        transparent: true,
        opacity: 0.5,
      }),
    )
    const uniformMotionCurrentLabel = createSceneTextSprite('s(t)', {
      background: 'rgba(15, 17, 21, 0.72)',
      color: '#E6E8EC',
      scale: 0.2,
    })
    const uniformMotionDisplacementLabel = createSceneTextSprite('Delta s = 0 m', {
      background: 'rgba(15, 17, 21, 0.72)',
      color: '#A3E635',
      scale: 0.19,
    })

    ;[
      uniformMotionCurrentMarker,
      uniformMotionDisplacementBand,
      uniformMotionBodyShadow,
      uniformMotionCurrentLabel,
      uniformMotionDisplacementLabel,
    ].forEach((object) => {
      object.renderOrder = 8
      object.visible = false
      scene.add(object)
    })

    const uniformCircularAngleArcPositions = new Float32Array(
      (uniformCircularAngleArcSegments + 1) * 3,
    )
    const uniformCircularAngleArcGeometry = new THREE.BufferGeometry()
    const uniformCircularAngleArcPositionAttribute =
      new THREE.BufferAttribute(uniformCircularAngleArcPositions, 3)

    uniformCircularAngleArcPositionAttribute.setUsage(THREE.DynamicDrawUsage)
    uniformCircularAngleArcGeometry.setAttribute(
      'position',
      uniformCircularAngleArcPositionAttribute,
    )
    uniformCircularAngleArcGeometry.setDrawRange(0, 0)
    const uniformCircularAngleArc = new THREE.Line(
      uniformCircularAngleArcGeometry,
      new THREE.LineBasicMaterial({
        color: 0x2dd4bf,
        depthWrite: false,
        opacity: 0.9,
        transparent: true,
      }),
    )
    const uniformCircularAngleLabel = createSceneTextSprite('theta = 0 deg', {
      background: 'rgba(15, 17, 21, 0.74)',
      color: '#2DD4BF',
      scale: 0.17,
    })
    const uniformCircularRadiusLabel = createSceneTextSprite('r = 0 m', {
      background: 'rgba(15, 17, 21, 0.74)',
      color: '#A3E635',
      scale: 0.17,
    })
    const uniformCircularLapPulse = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.025, 8, 72),
      new THREE.MeshBasicMaterial({
        color: 0x2dd4bf,
        depthWrite: false,
        opacity: 0.22,
        transparent: true,
      }),
    )

    ;[
      uniformCircularAngleArc,
      uniformCircularAngleLabel,
      uniformCircularLapPulse,
      uniformCircularRadiusLabel,
    ].forEach((object) => {
      object.renderOrder = 9
      object.visible = false
      scene.add(object)
    })

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
      const objects = objectsRef.current
      const width = parent.clientWidth
      const height = parent.clientHeight

      if (!objects) {
        return
      }

      updateOrbitCameraProjection(objects.camera, {
        cameraRadius: objects.cameraRadius,
        height,
        width,
      })
      renderer.setSize(width, height, false)
      updateOrbitCamera(objects, cameraPoseRef.current)
      renderCurrentFrame()
    }
    const observer = new ResizeObserver(resizeRenderer)

    objectsRef.current = {
      arrows,
      bernoulli,
      body,
      camera,
      cameraMaxRadius,
      cameraMinRadius,
      cameraRadius,
      cameraTarget,
      coupledCouplingSpring,
      coupledCouplingSpringPositionAttribute,
      coupledCouplingSpringPositions,
      coupledDisplacementLabelA,
      coupledDisplacementLabelB,
      coupledEnergyPacketHelper,
      coupledEnergyPackets,
      coupledEquilibriumLabel,
      coupledEquilibriumLineA,
      coupledEquilibriumLineB,
      coupledMassLabelA,
      coupledMassLabelB,
      coupledRulerA,
      coupledRulerB,
      coupledSecondaryTrace,
      coupledSecondaryTraceColorAttribute,
      coupledSecondaryTraceColors,
      coupledSecondaryTracePositionAttribute,
      coupledSecondaryTracePositions,
      hydroDisplacedVolume,
      hydroPressureArrows,
      hydroPressureBaseRing,
      hydroPressureField,
      hydroPressureLevelLineAttribute,
      hydroPressureLevelLinePositions,
      hydroPressureLevelLines,
      hydroPressureShell,
      hydroPressureTopRing,
      hydroTankEdges,
      hydroTankGlass,
      hydroWater,
      hydroWaterSurface,
      hydroWaterSurfaceBasePositions,
      renderer,
      rope,
      ropePositionAttribute,
      ropePositions,
      rigidRotationBaseRadius,
      rollingPlane,
      rollingPlaneEdges,
      rotationAngleArc,
      rotationAngleArcPositionAttribute,
      rotationAngleArcPositions,
      rotationAngleMarker,
      rotationAxis,
      rotationBase,
      rotationBrakePad,
      rotationCounterMass,
      rotationCurvedArrows,
      rotationHub,
      rotationRim,
      rotationThermalRing,
      rotationTipMass,
      rotationZeroLine,
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
      orbitCentralBody,
      orbitSatellitePath,
      orbitSatellitePathPositionAttribute,
      orbitSatellitePathPositions,
      pulley,
      supportBar,
      supportStem,
      trace,
      traceColorAttribute,
      traceColors,
      tracePositionAttribute,
      tracePositions,
      waveComponentOne,
      waveComponentOnePositionAttribute,
      waveComponentOnePositions,
      waveComponentTwo,
      waveComponentTwoPositionAttribute,
      waveComponentTwoPositions,
      waveEnvelopeLower,
      waveEnvelopeLowerPositionAttribute,
      waveEnvelopeLowerPositions,
      waveEnvelopeUpper,
      waveEnvelopeUpperPositionAttribute,
      waveEnvelopeUpperPositions,
      waveLab,
      waveProfileDomain,
      waveString,
      waveStringPositionAttribute,
      waveStringPositions,
      uniformCircularAngleArc,
      uniformCircularAngleArcPositionAttribute,
      uniformCircularAngleArcPositions,
      uniformCircularAngleLabel,
      uniformCircularLapPulse,
      uniformCircularRadiusLabel,
      acceleratedMotionAccelerationLabel,
      acceleratedMotionBodyShadow,
      acceleratedMotionCurrentLabel,
      acceleratedMotionHeightBand,
      acceleratedMotionHeightLabel,
      acceleratedMotionImpactRing,
      acceleratedMotionVelocityLabel,
      uniformMotionBodyShadow,
      uniformMotionCurrentLabel,
      uniformMotionCurrentMarker,
      uniformMotionDisplacementBand,
      uniformMotionDisplacementLabel,
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
      pitchRadians: getInitialCameraPitchRadians(simulationId, cameraViewMode),
      yawRadians: getInitialCameraYawRadians(simulationId, cameraViewMode),
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
  }, [cameraViewMode, parameters, renderCurrentFrame, samples, simulationId])

  useEffect(() => {
    if (import.meta.env.MODE === 'test') {
      return
    }

    const objects = objectsRef.current

    if (!objects) {
      return
    }

    objects.camera = createOrbitCamera(cameraProjectionMode, { far: 160 })
    updateCameraProjection(objects)
    updateOrbitCamera(objects, cameraPoseRef.current)
    renderCurrentFrame()
  }, [
    cameraProjectionMode,
    renderCurrentFrame,
    updateCameraProjection,
  ])

  useEffect(() => {
    const resetSamples = runtimeRef.current.samples

    elapsedSecondsRef.current = 0
    lastFrameTimeRef.current = null
    lastReadoutTimeRef.current = 0
    statsWindowRef.current = createFrameStatsWindow()
    timelineSamplesRef.current = resetSamples
    traceSamplesRef.current = [readFirstKinematicsSample(resetSamples)]
    renderCurrentFrame(true)
  }, [renderCurrentFrame, resetVersion])

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
        elapsedSecondsRef.current +
        playbackDeltaSeconds * normalizeModelTimeScale(runtime.modelTimeScale)

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
        height: '100%',
        minHeight: 0,
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
  parameters,
  sample,
  sampleIndex,
  samples,
  showEnergy,
  showTrace,
  showVectors,
  simulationId,
}: {
  objects: SceneObjects
  parameters: KinematicsParameters
  sample: KinematicsSample
  sampleIndex: number
  samples: KinematicsSample[]
  showEnergy: boolean
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
    objects.body.position.z +=
      objects.bodyRadius -
      sample.primaryRadiusMeters * objects.sceneProjection.positionScale
    objects.body.rotation.y = sample.angleRadians
  }

  updateConstrainedBodyObjects(
    objects,
    parameters,
    sample,
    simulationId,
    showEnergy,
    showTrace,
    showVectors,
  )
  Object.values(objects.arrows).forEach((arrow) => {
    arrow.visible = false
  })

  if (simulationId !== 'rigid-body-rotation') {
    getKinematicsVectorOverlays(sample, simulationId).forEach((vector) => {
      const arrow = objects.arrows[vector.id]
      const direction =
        simulationId === 'doppler-effect'
          ? toDopplerDiagonalSceneDirection(vector)
          : toKinematicsSceneDirection(vector, objects.sceneProjection)

      if (!showVectors || direction.lengthSq() === 0 || vector.magnitude === 0) {
        arrow.visible = false
        return
      }

      arrow.visible = true
      arrow.position.copy(
        getKinematicsVectorOrigin(
          objects,
          sample,
          simulationId,
          vector.id,
          objects.body.position,
        ),
      )
      arrow.setDirection(direction.normalize())
      arrow.setLength(
        getVectorDisplayLength(vector, objects, sample, simulationId),
        0.08,
        0.045,
      )
    })
  }

  updateTrace(objects, samples, sampleIndex, sample, showTrace, simulationId)
}

function getKinematicsVectorOrigin(
  objects: SceneObjects,
  sample: KinematicsSample,
  simulationId: KinematicsSimulationId,
  vectorId: KinematicsVectorOverlay['id'],
  fallbackPosition: THREE.Vector3,
) {
  if (
    (simulationId === 'collisions-1d-2d' ||
      simulationId === 'coupled-oscillators') &&
    (vectorId === 'secondaryVelocity' ||
      (simulationId === 'coupled-oscillators' &&
        (vectorId === 'forceTwo' || vectorId === 'forceThree')))
  ) {
    return objects.secondaryBody.position.clone()
  }

  if (simulationId === 'coupled-oscillators' && vectorId === 'tension') {
    return objects.body.position
      .clone()
      .lerp(objects.secondaryBody.position, 0.5)
      .add(new THREE.Vector3(0, -objects.bodyRadius * 0.9, 0))
  }

  if (simulationId === 'doppler-effect') {
    if (vectorId === 'forceOne') {
      return objects.secondaryBody.position
        .clone()
        .add(new THREE.Vector3(0, 0, objects.bodyRadius * 0.75))
    }

    if (vectorId === 'secondaryVelocity') {
      return objects.secondaryBody.position
        .clone()
        .lerp(objects.body.position, 0.5)
        .add(new THREE.Vector3(0, 0, objects.bodyRadius * 1.25))
    }
  }

  if (simulationId === 'uniform-linear-motion' && vectorId === 'displacement') {
    const scale = objects.sceneProjection.positionScale
    const startX = (sample.positionMeters - sample.displacementMeters) * scale

    return new THREE.Vector3(startX, 0.22, objects.bodyRadius + 0.12)
  }

  if (simulationId === 'uniform-circular-motion') {
    if (vectorId === 'displacement') {
      return new THREE.Vector3(0, 0, 0.09)
    }

    if (vectorId === 'velocity') {
      return fallbackPosition.clone().add(new THREE.Vector3(0, 0, 0.08))
    }

    if (vectorId === 'centripetal') {
      return fallbackPosition.clone().add(new THREE.Vector3(0, 0, 0.1))
    }
  }

  if (simulationId === 'uniformly-accelerated-motion') {
    const scale = objects.sceneProjection.positionScale
    const initialZ = (sample.zMeters - sample.displacementMeters) * scale

    if (vectorId === 'displacement') {
      return new THREE.Vector3(objects.bodyRadius * 1.35, 0.2, initialZ)
    }

    if (vectorId === 'velocity') {
      return fallbackPosition.clone().add(new THREE.Vector3(-objects.bodyRadius, 0, 0))
    }

    if (vectorId === 'acceleration') {
      return fallbackPosition
        .clone()
        .add(new THREE.Vector3(objects.bodyRadius, 0, 0))
    }
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

function updateUniformCircularMotionObjects(
  objects: SceneObjects,
  sample: KinematicsSample,
  showVectors: boolean,
) {
  const radiusScene = Math.max(
    0.001,
    Math.hypot(sample.xMeters, sample.zMeters) *
      objects.sceneProjection.positionScale,
  )
  const initialAngleRadians =
    sample.angleRadians -
    sample.angularVelocityRadiansPerSecond * sample.timeSeconds
  const cycleSweepRadians = normalizePositiveRadians(
    sample.angleRadians - initialAngleRadians,
  )
  const pointCount = updateArcLineGeometry({
    endAngleRadians: initialAngleRadians + cycleSweepRadians,
    positions: objects.uniformCircularAngleArcPositions,
    radius: radiusScene * 0.44,
    segmentCapacity: uniformCircularAngleArcSegments,
    startAngleRadians: initialAngleRadians,
    z: 0.08,
  })
  const midAngleRadians = initialAngleRadians + cycleSweepRadians / 2
  const currentAngleDegrees = normalizeDegrees(
    radiansToDegrees(sample.angleRadians),
  )
  const currentLaps =
    sample.periodSeconds > 0
      ? Math.floor(Math.max(0, sample.timeSeconds / sample.periodSeconds))
      : 0
  const pulsePhase =
    sample.periodSeconds > 0
      ? (sample.timeSeconds % sample.periodSeconds) / sample.periodSeconds
      : 0
  const pulseIntensity = clamp(1 - Math.min(pulsePhase, 1 - pulsePhase) * 14, 0, 1)
  const pulseMaterial =
    objects.uniformCircularLapPulse.material as THREE.MeshBasicMaterial

  objects.uniformCircularAngleArc.geometry.setDrawRange(0, pointCount)
  objects.uniformCircularAngleArcPositionAttribute.needsUpdate = true
  objects.uniformCircularAngleLabel.position.set(
    Math.cos(midAngleRadians) * radiusScene * 0.58,
    Math.sin(midAngleRadians) * radiusScene * 0.58,
    0.26,
  )
  updateSceneTextSprite(
    objects.uniformCircularAngleLabel,
    `theta = ${formatSceneDynamicNumber(currentAngleDegrees)} deg`,
  )
  objects.uniformCircularRadiusLabel.visible = showVectors
  objects.uniformCircularRadiusLabel.position.set(
    sample.xMeters * objects.sceneProjection.positionScale * 0.5,
    sample.zMeters * objects.sceneProjection.positionScale * 0.5,
    0.24,
  )
  updateSceneTextSprite(
    objects.uniformCircularRadiusLabel,
    `r = ${formatSceneNumber(Math.hypot(sample.xMeters, sample.zMeters))} m`,
  )
  objects.uniformCircularLapPulse.position.set(0, 0, 0.07)
  objects.uniformCircularLapPulse.scale.setScalar(
    radiusScene * (0.19 + pulseIntensity * 0.065),
  )
  pulseMaterial.opacity = 0.16 + pulseIntensity * 0.42
  objects.uniformCircularLapPulse.visible = currentLaps > 0 || pulseIntensity > 0
}

function updateConstrainedBodyObjects(
  objects: SceneObjects,
  parameters: KinematicsParameters,
  sample: KinematicsSample,
  simulationId: KinematicsSimulationId,
  showEnergy: boolean,
  showTrace: boolean,
  showVectors: boolean,
) {
  const isAtwood = simulationId === 'atwood-machine'
  const isBernoulli = simulationId === 'continuity-bernoulli'
  const isCollision = simulationId === 'collisions-1d-2d'
  const isCoupledOscillator = simulationId === 'coupled-oscillators'
  const isHydrostatics = simulationId === 'hydrostatics-buoyancy'
  const isSingleSpringOscillator =
    isSingleSpringOscillatorSimulation(simulationId)
  const isMechanicalWave = isMechanicalWaveSimulation(simulationId)
  const isSoundWave = isSoundWaveSimulation(simulationId)
  const isOrbit = simulationId === 'gravitational-field-orbits'
  const isRigidRotation = simulationId === 'rigid-body-rotation'
  const isRolling = simulationId === 'rolling-without-slipping'
  const isTorqueLever = simulationId === 'torque-levers-center-mass'
  const isUniformCircularMotion = simulationId === 'uniform-circular-motion'
  const isUniformLinearMotion = simulationId === 'uniform-linear-motion'
  const isUniformlyAcceleratedMotion =
    simulationId === 'uniformly-accelerated-motion'

  setRigidBodyRotationObjectsVisible(objects, isRigidRotation)
  objects.secondaryBody.visible =
    isAtwood ||
    isCollision ||
    isCoupledOscillator ||
    isOrbit ||
    simulationId === 'doppler-effect'
  objects.rollingPlane.visible = isRolling
  objects.rollingPlaneEdges.visible = isRolling
  objects.pulley.visible = isAtwood
  objects.rope.visible =
    isAtwood || isCoupledOscillator || isSingleSpringOscillator
  objects.supportBar.visible =
    isAtwood || isCoupledOscillator || isSingleSpringOscillator
  objects.supportStem.visible =
    isAtwood || isCoupledOscillator || isSingleSpringOscillator
  objects.hydroDisplacedVolume.visible = isHydrostatics
  objects.hydroPressureBaseRing.visible = isHydrostatics
  objects.hydroPressureField.visible = isHydrostatics
  objects.hydroPressureLevelLines.visible = isHydrostatics
  objects.hydroPressureShell.visible = isHydrostatics
  objects.hydroPressureTopRing.visible = isHydrostatics
  objects.hydroTankEdges.visible = isHydrostatics
  objects.hydroTankGlass.visible = isHydrostatics
  objects.hydroWater.visible = isHydrostatics
  objects.hydroWaterSurface.visible = isHydrostatics
  objects.hydroPressureArrows.forEach(({ arrow }) => {
    arrow.visible = isHydrostatics && showVectors
  })
  objects.bernoulli.group.visible = isBernoulli
  objects.coupledCouplingSpring.visible = isCoupledOscillator
  objects.coupledDisplacementLabelA.visible = isCoupledOscillator
  objects.coupledDisplacementLabelB.visible = isCoupledOscillator
  objects.coupledEnergyPackets.visible = isCoupledOscillator && showEnergy
  objects.coupledEquilibriumLabel.visible = isCoupledOscillator
  objects.coupledEquilibriumLineA.visible = isCoupledOscillator
  objects.coupledEquilibriumLineB.visible = isCoupledOscillator
  objects.coupledMassLabelA.visible = isCoupledOscillator
  objects.coupledMassLabelB.visible = isCoupledOscillator
  objects.coupledRulerA.visible = isCoupledOscillator
  objects.coupledRulerB.visible = isCoupledOscillator
  objects.leverAppliedForceMarker.visible = isTorqueLever
  objects.leverCenterOfMassMarker.visible = isTorqueLever
  objects.leverLeftMass.visible = isTorqueLever
  objects.leverPivotCapBack.visible = isTorqueLever
  objects.leverPivotCapFront.visible = isTorqueLever
  objects.leverPivotPin.visible = isTorqueLever
  objects.leverRightMass.visible = isTorqueLever
  objects.leverSupportHoleShadow.visible = isTorqueLever
  objects.leverSupport.visible = isTorqueLever
  objects.orbitCentralBody.visible = isOrbit
  objects.orbitSatellitePath.visible = isOrbit
  objects.acceleratedMotionAccelerationLabel.visible =
    isUniformlyAcceleratedMotion && showVectors
  objects.acceleratedMotionBodyShadow.visible = isUniformlyAcceleratedMotion
  objects.acceleratedMotionCurrentLabel.visible = isUniformlyAcceleratedMotion
  objects.acceleratedMotionHeightBand.visible = false
  objects.acceleratedMotionHeightLabel.visible = false
  objects.acceleratedMotionImpactRing.visible = isUniformlyAcceleratedMotion
  objects.acceleratedMotionVelocityLabel.visible =
    isUniformlyAcceleratedMotion && showVectors
  objects.uniformMotionBodyShadow.visible = isUniformLinearMotion
  objects.uniformMotionCurrentLabel.visible = isUniformLinearMotion
  objects.uniformMotionCurrentMarker.visible = isUniformLinearMotion
  objects.uniformMotionDisplacementBand.visible = false
  objects.uniformMotionDisplacementLabel.visible = false
  objects.uniformCircularAngleArc.visible = isUniformCircularMotion
  objects.uniformCircularAngleLabel.visible = isUniformCircularMotion
  objects.uniformCircularLapPulse.visible = isUniformCircularMotion
  objects.uniformCircularRadiusLabel.visible =
    isUniformCircularMotion && showVectors
  objects.waveString.visible =
    isMechanicalWave && !isSoundWave && simulationId !== 'wave-on-string'
  objects.waveComponentOne.visible =
    simulationId === 'superposition-interference' && showTrace
  objects.waveComponentTwo.visible =
    simulationId === 'superposition-interference' && showTrace
  objects.waveEnvelopeUpper.visible =
    simulationId === 'standing-waves' && showTrace
  objects.waveEnvelopeLower.visible =
    simulationId === 'standing-waves' && showTrace
  objects.waveLab.group.visible = isMechanicalWave

  if (isRigidRotation) {
    updateRigidBodyRotationObjects(objects, sample, showVectors)
    return
  }

  if (isUniformCircularMotion) {
    updateUniformCircularMotionObjects(objects, sample, showVectors)
    return
  }

  if (isUniformLinearMotion) {
    updateUniformLinearMotionObjects(objects, sample, showTrace)
    return
  }

  if (isUniformlyAcceleratedMotion) {
    updateUniformlyAcceleratedMotionObjects(
      objects,
      sample,
      showTrace,
      showVectors,
    )
    return
  }

  if (isOrbit) {
    const orbitMoonRadius = getOrbitMoonDisplayRadius(objects)
    const orbitMoonMinimumRadius =
      objects.bodyRadius + orbitMoonRadius + objects.bodyRadius * 0.18

    objects.orbitCentralBody.position.set(0, 0, 0)
    objects.orbitCentralBody.scale.setScalar(
      clamp(objects.bodyRadius * 1.18, 0.48, 0.88),
    )
    objects.secondaryBody.position.copy(
      toOrbitSatelliteScenePosition(
        sample,
        objects.sceneProjection,
        orbitMoonMinimumRadius,
      ),
    )
    objects.secondaryBody.scale.setScalar(orbitMoonRadius)
    updateOrbitSatellitePath(objects, sample, orbitMoonMinimumRadius)
    return
  }

  if (isHydrostatics) {
    updateHydrostaticsObjects(objects, sample, showVectors)
    return
  }

  if (isBernoulli) {
    updateBernoulliObjects(objects, sample)
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

  if (isSingleSpringOscillator) {
    updateMassSpringObjects(objects, sample)
    return
  }

  if (isCoupledOscillator) {
    updateCoupledOscillatorObjects(objects, sample, showEnergy, showTrace)
    return
  }

  if (isMechanicalWave) {
    updateMechanicalWaveObjects(
      objects,
      parameters,
      sample,
      simulationId,
      showEnergy,
      showTrace,
      showVectors,
    )
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

function updateUniformLinearMotionObjects(
  objects: SceneObjects,
  sample: KinematicsSample,
  showTrace: boolean,
) {
  const scale = objects.sceneProjection.positionScale
  const bodyLift = objects.bodyRadius + 0.07
  const currentX = sample.positionMeters * scale
  const startX = (sample.positionMeters - sample.displacementMeters) * scale
  const displacementLength = Math.abs(currentX - startX)
  const displacementCenterX = (currentX + startX) / 2

  objects.body.position.set(currentX, 0, bodyLift)
  objects.body.scale.setScalar(1.08)
  objects.uniformMotionBodyShadow.position.set(currentX, 0, 0.055)
  objects.uniformMotionBodyShadow.scale.set(
    1.12,
    clamp(0.62 + sample.speedMetersPerSecond * 0.08, 0.62, 1.1),
    1,
  )
  objects.uniformMotionCurrentMarker.position.set(currentX, 0, 0.092)
  objects.uniformMotionCurrentLabel.position.set(
    currentX,
    objects.bodyRadius * 2.05,
    bodyLift + objects.bodyRadius * 1.35,
  )
  updateSceneTextSprite(
    objects.uniformMotionCurrentLabel,
    `s(t) = ${formatSceneDynamicNumber(sample.positionMeters)} m`,
  )

  if (showTrace && displacementLength > 0.004) {
    objects.uniformMotionDisplacementBand.visible = true
    objects.uniformMotionDisplacementBand.position.set(
      displacementCenterX,
      -0.26,
      0.082,
    )
    objects.uniformMotionDisplacementBand.scale.set(displacementLength, 1, 1)
    objects.uniformMotionDisplacementLabel.visible = true
    objects.uniformMotionDisplacementLabel.position.set(
      displacementCenterX,
      -0.55,
      0.29,
    )
    updateSceneTextSprite(
      objects.uniformMotionDisplacementLabel,
      `Delta s = ${formatSceneDynamicNumber(sample.displacementMeters)} m`,
    )
  }
}

function updateUniformlyAcceleratedMotionObjects(
  objects: SceneObjects,
  sample: KinematicsSample,
  showTrace: boolean,
  showVectors: boolean,
) {
  const scale = objects.sceneProjection.positionScale
  const currentZ = sample.zMeters * scale
  const initialZ = (sample.zMeters - sample.displacementMeters) * scale
  const displacementLength = Math.abs(currentZ - initialZ)
  const displacementCenterZ = (currentZ + initialZ) / 2
  const bodyLift = objects.bodyRadius
  const bodyX = 0
  const readingX = objects.bodyRadius * 2.65
  const labelY = objects.bodyRadius * 1.42
  const heightLabelZ = Math.max(currentZ * 0.5, 0.26)
  const impactMaterial = objects.acceleratedMotionImpactRing
    .material as THREE.MeshBasicMaterial
  const impactPulse = sample.isGrounded
    ? 1.12 + Math.sin(sample.timeSeconds * 12) * 0.045
    : 0.92

  objects.body.position.set(bodyX, 0, currentZ + bodyLift)
  objects.body.scale.setScalar(1.12)
  objects.acceleratedMotionBodyShadow.position.set(bodyX, 0, 0.046)
  objects.acceleratedMotionBodyShadow.scale.set(
    clamp(1.12 - currentZ * 0.018, 0.62, 1.12),
    clamp(0.54 + sample.speedMetersPerSecond * 0.018, 0.54, 1.2),
    1,
  )
  objects.acceleratedMotionImpactRing.position.set(bodyX, 0, 0.055)
  objects.acceleratedMotionImpactRing.scale.setScalar(impactPulse)
  impactMaterial.opacity = sample.isGrounded ? 0.9 : 0.34

  objects.acceleratedMotionCurrentLabel.position.set(
    readingX,
    labelY,
    currentZ + bodyLift * 1.85,
  )
  updateSceneTextSprite(
    objects.acceleratedMotionCurrentLabel,
    `z(t) = ${formatSceneDynamicNumber(sample.zMeters)} m`,
  )

  if (showTrace && displacementLength > 0.004) {
    objects.acceleratedMotionHeightBand.visible = true
    objects.acceleratedMotionHeightBand.position.set(
      readingX * 0.62,
      0.02,
      displacementCenterZ,
    )
    objects.acceleratedMotionHeightBand.scale.set(1, 1, displacementLength)
    objects.acceleratedMotionHeightLabel.visible = true
    objects.acceleratedMotionHeightLabel.position.set(
      readingX * 1.45,
      labelY,
      heightLabelZ,
    )
    updateSceneTextSprite(
      objects.acceleratedMotionHeightLabel,
      sample.zMeters >= 0
        ? `altura restante = ${formatSceneDynamicNumber(sample.zMeters)} m`
        : `Delta z = ${formatSceneDynamicNumber(sample.displacementMeters)} m`,
    )
  }

  if (showVectors) {
    const velocityLabelZ =
      currentZ +
      bodyLift +
      (sample.velocityZMetersPerSecond < 0 ? -bodyLift * 1.85 : bodyLift * 1.85)
    const accelerationLabelZ =
      currentZ +
      bodyLift +
      (sample.accelerationZMetersPerSecondSquared < 0
        ? -bodyLift * 3.1
        : bodyLift * 3.1)

    objects.acceleratedMotionVelocityLabel.position.set(
      -readingX,
      labelY,
      velocityLabelZ,
    )
    objects.acceleratedMotionAccelerationLabel.position.set(
      -readingX * 1.08,
      labelY,
      accelerationLabelZ,
    )
    updateSceneTextSprite(
      objects.acceleratedMotionVelocityLabel,
      `v = ${formatSceneDynamicNumber(sample.velocityZMetersPerSecond)} m/s`,
    )
    updateSceneTextSprite(
      objects.acceleratedMotionAccelerationLabel,
      `a = ${formatSceneDynamicNumber(
        sample.accelerationZMetersPerSecondSquared,
      )} m/s^2`,
    )
  }
}

function updateOrbitSatellitePath(
  objects: SceneObjects,
  sample: KinematicsSample,
  minimumSceneRadius: number,
) {
  const planetPosition = toKinematicsScenePosition(
    sample,
    objects.sceneProjection,
  )
  const satellitePosition = toOrbitSatelliteScenePosition(
    sample,
    objects.sceneProjection,
    minimumSceneRadius,
  )
  const radius = satellitePosition.distanceTo(planetPosition)

  if (radius <= 0.001) {
    objects.orbitSatellitePath.visible = false
    objects.orbitSatellitePath.geometry.setDrawRange(0, 0)
    return
  }

  for (let index = 0; index <= orbitSatellitePathSegments; index += 1) {
    const angle = (Math.PI * 2 * index) / orbitSatellitePathSegments
    const offset = index * 3

    objects.orbitSatellitePathPositions[offset] =
      planetPosition.x + Math.cos(angle) * radius
    objects.orbitSatellitePathPositions[offset + 1] =
      planetPosition.y + Math.sin(angle) * radius
    objects.orbitSatellitePathPositions[offset + 2] = planetPosition.z + 0.035
  }

  objects.orbitSatellitePath.visible = true
  objects.orbitSatellitePath.geometry.setDrawRange(
    0,
    orbitSatellitePathSegments + 1,
  )
  objects.orbitSatellitePathPositionAttribute.needsUpdate = true
}

function getOrbitMoonDisplayRadius(objects: SceneObjects) {
  return clamp(objects.bodyRadius * 0.32, 0.09, 0.22)
}

function setRigidBodyRotationObjectsVisible(
  objects: SceneObjects,
  visible: boolean,
) {
  ;[
    objects.rotationBase,
    objects.rotationRim,
    objects.rotationAxis,
    objects.rotationHub,
    objects.rotationTipMass,
    objects.rotationCounterMass,
    objects.rotationZeroLine,
  ].forEach((object) => {
    object.visible = visible
  })
  objects.rotationAngleArc.visible = false
  objects.rotationAngleArc.geometry.setDrawRange(0, 0)
  objects.rotationAngleMarker.visible = false

  if (!visible) {
    objects.rotationBrakePad.visible = false
    objects.rotationThermalRing.visible = false
    Object.values(objects.rotationCurvedArrows).forEach((arrow) => {
      arrow.line.visible = false
      arrow.cone.visible = false
    })
  }
}

function updateRigidBodyRotationObjects(
  objects: SceneObjects,
  sample: KinematicsSample,
  showVectors: boolean,
) {
  const angle = sample.angleRadians
  const rotorHalfLength = getRigidBodyRotorHalfLength(objects.bodyRadius)
  const massRadiusRatio = getRigidBodySlidingMassRadiusRatio(sample)
  const slidingMassOffset = rotorHalfLength * massRadiusRatio
  const tipRadius = clamp(objects.bodyRadius * 0.46, 0.09, 0.18)
  const counterSize = clamp(objects.bodyRadius * 0.7, 0.12, 0.22)
  const axis = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0)
  const tangent = new THREE.Vector3(-Math.sin(angle), Math.cos(angle), 0)
  const rotorCenter = new THREE.Vector3(0, 0, rigidRotationRotorZ)

  objects.body.position.copy(rotorCenter)
  objects.body.rotation.set(0, 0, angle)
  objects.body.scale.set(1, 1, 1)

  objects.rotationHub.position.copy(rotorCenter)
  objects.rotationTipMass.position
    .copy(rotorCenter)
    .addScaledVector(axis, slidingMassOffset)
  objects.rotationTipMass.scale.setScalar(tipRadius)
  objects.rotationCounterMass.position
    .copy(rotorCenter)
    .addScaledVector(axis, -rotorHalfLength * 0.72)
    .addScaledVector(tangent, objects.bodyRadius * 0.03)
  objects.rotationCounterMass.rotation.set(0, 0, angle)
  objects.rotationCounterMass.scale.set(
    counterSize * 1.1,
    counterSize * 0.72,
    counterSize * 0.72,
  )

  hideRigidRotationAngleArc(objects)
  updateRigidRotationDampingCue(objects, sample)
  updateRigidRotationCurvedVectorCues(objects, sample, showVectors)
  updateRigidRotationAngularMomentumVector(objects, sample, showVectors)
}

function hideRigidRotationAngleArc(objects: SceneObjects) {
  objects.rotationAngleArc.visible = false
  objects.rotationAngleArc.geometry.setDrawRange(0, 0)
  objects.rotationAngleMarker.visible = false
}

function updateRigidRotationDampingCue(
  objects: SceneObjects,
  sample: KinematicsSample,
) {
  const baseRadius = objects.rigidRotationBaseRadius
  const idealAngularAcceleration =
    sample.momentOfInertiaKilogramMetersSquared > 0
      ? sample.netTorqueNewtonMeters /
        sample.momentOfInertiaKilogramMetersSquared
      : 0
  const dampingAcceleration =
    sample.angularAccelerationRadiansPerSecondSquared -
    idealAngularAcceleration
  const dampingVisible =
    Math.abs(dampingAcceleration) > 0.001 &&
    Math.abs(sample.angularVelocityRadiansPerSecond) > 0.001
  const thermalVisible = dampingVisible || sample.thermalEnergyJoules > 0.001
  const thermalMaterial =
    objects.rotationThermalRing.material as THREE.MeshBasicMaterial

  objects.rotationBrakePad.visible = dampingVisible
  objects.rotationBrakePad.position.set(
    0,
    baseRadius + 0.055,
    rigidRotationRotorZ + 0.015,
  )
  objects.rotationBrakePad.rotation.set(0, 0, 0)
  objects.rotationThermalRing.visible = thermalVisible
  thermalMaterial.opacity = thermalVisible
    ? clamp(0.18 + sample.thermalEnergyJoules * 0.035, 0.18, 0.58)
    : 0
}

function updateRigidRotationCurvedVectorCues(
  objects: SceneObjects,
  sample: KinematicsSample,
  showVectors: boolean,
) {
  const baseRadius = objects.rigidRotationBaseRadius
  const angle = sample.angleRadians

  updateRigidRotationCurvedArrow(objects.rotationCurvedArrows.angularVelocity, {
    radius: baseRadius * 0.82,
    startAngleRadians: angle + 0.24,
    sweepRadians: readVectorCueSweep(
      sample.angularVelocityRadiansPerSecond,
      0.3,
    ),
    visible: showVectors && Math.abs(sample.angularVelocityRadiansPerSecond) > 0.001,
    z: rigidRotationRotorZ + 0.18,
  })
  updateRigidRotationCurvedArrow(
    objects.rotationCurvedArrows.angularAcceleration,
    {
      radius: baseRadius * 1.02,
      startAngleRadians: angle - 0.2,
      sweepRadians: readVectorCueSweep(
        sample.angularAccelerationRadiansPerSecondSquared,
        0.46,
      ),
      visible:
        showVectors &&
        Math.abs(sample.angularAccelerationRadiansPerSecondSquared) > 0.001,
      z: rigidRotationRotorZ + 0.28,
    },
  )
  updateRigidRotationCurvedArrow(objects.rotationCurvedArrows.torque, {
    radius: baseRadius * 1.2,
    startAngleRadians: angle - 0.62,
    sweepRadians: readVectorCueSweep(sample.netTorqueNewtonMeters, 0.42),
    visible: showVectors && Math.abs(sample.netTorqueNewtonMeters) > 0.001,
    z: rigidRotationRotorZ + 0.11,
  })
}

function updateRigidRotationAngularMomentumVector(
  objects: SceneObjects,
  sample: KinematicsSample,
  showVectors: boolean,
) {
  const arrow = objects.arrows.angularMomentum
  const angularMomentumMagnitude =
    sample.momentOfInertiaKilogramMetersSquared *
    Math.abs(sample.angularVelocityRadiansPerSecond)
  const directionSign = Math.sign(sample.angularVelocityRadiansPerSecond) || 1

  if (!showVectors || angularMomentumMagnitude <= 0.001) {
    arrow.visible = false
    return
  }

  arrow.visible = true
  arrow.position.set(0, 0, rigidRotationRotorZ + 0.08)
  arrow.setDirection(new THREE.Vector3(0, 0, directionSign))
  arrow.setLength(
    clamp(0.34 + angularMomentumMagnitude * 0.035, 0.44, 0.86),
    0.08,
    0.045,
  )
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

function updateHydrostaticsObjects(
  objects: SceneObjects,
  sample: KinematicsSample,
  showVectors: boolean,
) {
  const scale = objects.sceneProjection.positionScale
  const sphereRadius = Math.max(0.04, sample.primaryRadiusMeters * scale)
  const tankDepth = hydrostaticTankDepthMeters * scale
  const dimensions = getHydroTankDimensions(scale)
  const tankCenterZ = -tankDepth / 2
  const waterHeight = tankDepth
  const waterWidth = dimensions.width * 0.94
  const waterDepth = dimensions.depth * 0.9
  const centerZ = sample.zMeters * scale
  const capHeight = clamp(sphereRadius - centerZ, 0, sphereRadius * 2)

  objects.body.position.set(0, 0, centerZ)
  objects.body.rotation.set(0, 0, 0)
  objects.body.scale.setScalar(sphereRadius)

  ;[objects.hydroTankGlass, objects.hydroTankEdges].forEach((object) => {
    object.position.set(0, 0, tankCenterZ)
    object.scale.set(dimensions.width, dimensions.depth, tankDepth)
  })

  objects.hydroPressureField.position.set(0, 0, -waterHeight / 2)
  objects.hydroPressureField.scale.set(
    dimensions.width * 0.925,
    dimensions.depth * 0.875,
    waterHeight,
  )

  objects.hydroWater.position.set(0, 0, -waterHeight / 2)
  objects.hydroWater.scale.set(waterWidth, waterDepth, waterHeight)

  updateHydroPressureLevelLines(objects, dimensions, tankDepth)
  updateHydroWaterSurfaceRipples(objects, sample, {
    depth: waterDepth,
    scale,
    width: waterWidth,
  })
  updateHydroSubmergedVolumeGeometry(
    objects.hydroDisplacedVolume.geometry as THREE.BufferGeometry,
    sphereRadius,
    capHeight,
  )
  objects.hydroDisplacedVolume.position.copy(objects.body.position)
  objects.hydroDisplacedVolume.visible = capHeight > sphereRadius * 0.035
  updateHydroPressureShellColors(
    objects.hydroPressureShell.geometry as THREE.BufferGeometry,
    centerZ,
    sphereRadius,
    tankDepth,
  )
  objects.hydroPressureShell.position.copy(objects.body.position)
  objects.hydroPressureShell.scale.setScalar(sphereRadius * 1.018)
  objects.hydroPressureShell.visible = sample.submergedFraction > 0.01
  updateHydroPressureRings(objects, {
    capHeight,
    centerZ,
    sphereRadius,
  })
  updateHydroPressureArrows(objects, {
    centerZ,
    showVectors,
    sphereRadius,
    tankDepth,
  })

  objects.hydroWaterSurface.position.set(0, 0, 0.004)
  objects.hydroWaterSurface.rotation.set(0, 0, 0)
  objects.hydroWaterSurface.scale.set(waterWidth, waterDepth, 1)
}

function getHydroTankDimensions(scale: number) {
  return {
    depth: hydroTankHorizontalDepthMeters * scale,
    width: hydroTankWidthMeters * scale,
  }
}

function createHydroPressureFieldGeometry() {
  const geometry = new THREE.BoxGeometry(
    1,
    1,
    1,
    1,
    1,
    hydroPressureFieldSegments,
  )
  const positions = geometry.getAttribute('position') as THREE.BufferAttribute
  const colors = new Float32Array(positions.count * 3)
  const topColor = new THREE.Color(0x6ee7f9)
  const bottomColor = new THREE.Color(0x0f3f5f)

  for (let index = 0; index < positions.count; index += 1) {
    const depthRatio = clamp(0.5 - positions.getZ(index), 0, 1)
    const color = topColor.clone().lerp(bottomColor, depthRatio)
    const offset = index * 3

    colors[offset] = color.r
    colors[offset + 1] = color.g
    colors[offset + 2] = color.b
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  return geometry
}

function createHydroPressureShellGeometry() {
  const geometry = new THREE.SphereGeometry(1, 36, 22)
  const positions = geometry.getAttribute('position') as THREE.BufferAttribute
  const colors = new Float32Array(positions.count * 3)
  const colorAttribute = new THREE.BufferAttribute(colors, 3)

  colorAttribute.setUsage(THREE.DynamicDrawUsage)
  geometry.setAttribute('color', colorAttribute)

  return geometry
}

function createHydroPressureRing(color: number) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.018, 8, 72),
    new THREE.MeshBasicMaterial({
      color,
      depthTest: false,
      depthWrite: false,
      opacity: 0.92,
      transparent: true,
    }),
  )

  ring.renderOrder = 11

  return ring
}

function createHydroSubmergedVolumeGeometry() {
  const positions = new Float32Array(
    (hydroSubmergedVolumeRings + 1) *
      (hydroSubmergedVolumeSegments + 1) *
      3,
  )
  const indices: number[] = []

  for (let ring = 0; ring < hydroSubmergedVolumeRings; ring += 1) {
    for (let segment = 0; segment < hydroSubmergedVolumeSegments; segment += 1) {
      const current =
        ring * (hydroSubmergedVolumeSegments + 1) + segment
      const next = current + hydroSubmergedVolumeSegments + 1

      indices.push(
        current,
        next,
        current + 1,
        current + 1,
        next,
        next + 1,
      )
    }
  }

  const geometry = new THREE.BufferGeometry()
  const positionAttribute = new THREE.BufferAttribute(positions, 3)

  positionAttribute.setUsage(THREE.DynamicDrawUsage)
  geometry.setAttribute('position', positionAttribute)
  geometry.setIndex(indices)

  return geometry
}

function updateHydroPressureRings(
  objects: SceneObjects,
  {
    capHeight,
    centerZ,
    sphereRadius,
  }: {
    capHeight: number
    centerZ: number
    sphereRadius: number
  },
) {
  const topLocalZ = -sphereRadius + capHeight
  const baseLocalZ = -sphereRadius + capHeight * 0.28
  const topRadius = Math.sqrt(
    Math.max(0, sphereRadius ** 2 - topLocalZ ** 2),
  )
  const baseRadius = Math.sqrt(
    Math.max(0, sphereRadius ** 2 - baseLocalZ ** 2),
  )

  objects.hydroPressureTopRing.position.set(0, 0, centerZ + topLocalZ)
  objects.hydroPressureTopRing.scale.setScalar(Math.max(topRadius, 0.001))
  objects.hydroPressureTopRing.visible =
    capHeight > sphereRadius * 0.08 && topRadius > sphereRadius * 0.08

  objects.hydroPressureBaseRing.position.set(0, 0, centerZ + baseLocalZ)
  objects.hydroPressureBaseRing.scale.setScalar(Math.max(baseRadius, 0.001))
  objects.hydroPressureBaseRing.visible =
    capHeight > sphereRadius * 0.16 && baseRadius > sphereRadius * 0.08
}

function updateHydroPressureLevelLines(
  objects: SceneObjects,
  dimensions: { depth: number; width: number },
  tankDepth: number,
) {
  const halfWidth = (dimensions.width * 0.92) / 2
  const halfDepth = (dimensions.depth * 0.86) / 2
  let cursor = 0

  for (let index = 0; index < hydroPressureLevelCount; index += 1) {
    const depthRatio = (index + 1) / (hydroPressureLevelCount + 1)
    const z = -tankDepth * depthRatio
    const corners = [
      [-halfWidth, -halfDepth, z],
      [halfWidth, -halfDepth, z],
      [halfWidth, halfDepth, z],
      [-halfWidth, halfDepth, z],
    ] as const
    const segments = [
      [corners[0], corners[1]],
      [corners[1], corners[2]],
      [corners[2], corners[3]],
      [corners[3], corners[0]],
    ] as const

    segments.forEach(([from, to]) => {
      ;[from, to].forEach(([x, y, lineZ]) => {
        objects.hydroPressureLevelLinePositions[cursor] = x
        objects.hydroPressureLevelLinePositions[cursor + 1] = y
        objects.hydroPressureLevelLinePositions[cursor + 2] = lineZ
        cursor += 3
      })
    })
  }

  objects.hydroPressureLevelLineAttribute.needsUpdate = true
}

function updateHydroWaterSurfaceRipples(
  objects: SceneObjects,
  sample: KinematicsSample,
  dimensions: { depth: number; scale: number; width: number },
) {
  const geometry = objects.hydroWaterSurface.geometry as THREE.BufferGeometry
  const positionAttribute = geometry.getAttribute(
    'position',
  ) as THREE.BufferAttribute
  const positions = positionAttribute.array as Float32Array
  const basePositions = objects.hydroWaterSurfaceBasePositions
  const motionAmplitude = clamp(
    Math.abs(sample.velocityMetersPerSecond) * dimensions.scale * 0.026,
    0.004 * dimensions.scale,
    0.038 * dimensions.scale,
  )
  const submersionPulse =
    sample.submergedFraction > 0
      ? (0.006 + sample.submergedFraction * 0.012) * dimensions.scale
      : 0
  const amplitude = motionAmplitude + submersionPulse

  for (let index = 0; index < positions.length; index += 3) {
    const localX = basePositions[index]
    const localY = basePositions[index + 1]
    const sceneX = localX * dimensions.width
    const sceneY = localY * dimensions.depth
    const distance = Math.hypot(sceneX, sceneY)
    const radialRipple =
      Math.sin(distance * 9.2 - sample.timeSeconds * 4.4) *
      Math.exp(-distance * 1.45)
    const crossRipple =
      Math.sin(sceneX * 4.2 + sceneY * 2.7 + sample.timeSeconds * 1.25) *
      0.22

    positions[index] = basePositions[index]
    positions[index + 1] = basePositions[index + 1]
    positions[index + 2] =
      basePositions[index + 2] + amplitude * (radialRipple + crossRipple)
  }

  positionAttribute.needsUpdate = true
}

function updateHydroSubmergedVolumeGeometry(
  geometry: THREE.BufferGeometry,
  sphereRadius: number,
  capHeight: number,
) {
  const positionAttribute = geometry.getAttribute(
    'position',
  ) as THREE.BufferAttribute
  const positions = positionAttribute.array as Float32Array
  const topZ = -sphereRadius + capHeight
  let cursor = 0

  for (let ring = 0; ring <= hydroSubmergedVolumeRings; ring += 1) {
    const ringRatio = ring / hydroSubmergedVolumeRings
    const z = -sphereRadius + (topZ + sphereRadius) * ringRatio
    const radiusAtZ = Math.sqrt(Math.max(0, sphereRadius ** 2 - z ** 2))

    for (
      let segment = 0;
      segment <= hydroSubmergedVolumeSegments;
      segment += 1
    ) {
      const angleRadians =
        (segment / hydroSubmergedVolumeSegments) * Math.PI * 2

      positions[cursor] = Math.cos(angleRadians) * radiusAtZ
      positions[cursor + 1] = Math.sin(angleRadians) * radiusAtZ
      positions[cursor + 2] = z
      cursor += 3
    }
  }

  positionAttribute.needsUpdate = true
  geometry.computeBoundingSphere()
}

function updateHydroPressureShellColors(
  geometry: THREE.BufferGeometry,
  centerZ: number,
  sphereRadius: number,
  tankDepth: number,
) {
  const positions = geometry.getAttribute('position') as THREE.BufferAttribute
  const colorAttribute = geometry.getAttribute('color') as THREE.BufferAttribute
  const colors = colorAttribute.array as Float32Array
  const surfaceColor = new THREE.Color(0x6ee7f9)
  const deepColor = new THREE.Color(0xf59e0b)

  for (let index = 0; index < positions.count; index += 1) {
    const worldZ = centerZ + positions.getZ(index) * sphereRadius
    const depthRatio = clamp(-worldZ / Math.max(tankDepth, 0.001), 0, 1)
    const color = surfaceColor.clone().lerp(deepColor, depthRatio)
    const offset = index * 3

    colors[offset] = color.r
    colors[offset + 1] = color.g
    colors[offset + 2] = color.b
  }

  colorAttribute.needsUpdate = true
}

function updateHydroPressureArrows(
  objects: SceneObjects,
  {
    centerZ,
    showVectors,
    sphereRadius,
    tankDepth,
  }: {
    centerZ: number
    showVectors: boolean
    sphereRadius: number
    tankDepth: number
  },
) {
  const center = new THREE.Vector3(0, 0, centerZ)
  const surfaceColor = new THREE.Color(0xfbbf24)
  const deepColor = new THREE.Color(0xf43f5e)

  objects.hydroPressureArrows.forEach(({ angleRadians, arrow }) => {
    const normal = new THREE.Vector3(
      Math.cos(angleRadians),
      0,
      Math.sin(angleRadians),
    ).normalize()
    const surfacePoint = center.clone().addScaledVector(normal, sphereRadius)
    const depth = Math.max(0, -surfacePoint.z)
    const isSubmerged = depth > tankDepth * 0.012

    if (!showVectors || !isSubmerged) {
      arrow.visible = false
      return
    }

    const depthRatio = clamp(depth / Math.max(tankDepth, 0.001), 0, 1)
    const length = sphereRadius * (0.82 + depthRatio * 1.3)
    const origin = surfacePoint
      .clone()
      .addScaledVector(normal, Math.min(sphereRadius * 0.22, 0.11) + length)

    arrow.visible = true
    arrow.position.copy(origin)
    arrow.setDirection(normal.clone().multiplyScalar(-1))
    arrow.setLength(length, length * 0.27, length * 0.14)
    arrow.setColor(surfaceColor.clone().lerp(deepColor, depthRatio))
  })
}

function configureHydroPressureArrowMaterial(arrow: THREE.ArrowHelper) {
  const materials = [
    arrow.line.material,
    arrow.cone.material,
  ] as THREE.Material[]

  materials.forEach((material) => {
    material.depthTest = false
    material.depthWrite = false
    material.transparent = true
    material.opacity = 1
  })
  arrow.line.renderOrder = 12
  arrow.cone.renderOrder = 12
}

function createBernoulliVenturiObjects(
  samples: KinematicsSample[],
  sceneProjection: KinematicsSceneProjection,
): BernoulliSceneObjects {
  const sample = samples[0] ?? readFirstKinematicsSample(samples)
  const group = new THREE.Group()
  const shell = new THREE.Mesh(
    createBernoulliTubeGeometry(sample, sceneProjection, {
      includeColors: false,
      radiusMultiplier: 1,
    }),
    new THREE.MeshPhysicalMaterial({
      color: 0x8bd7ff,
      depthWrite: false,
      metalness: 0.02,
      opacity: 0.2,
      roughness: 0.08,
      side: THREE.DoubleSide,
      transparent: true,
      transmission: 0.28,
    }),
  )
  const fluid = new THREE.Mesh(
    createBernoulliTubeGeometry(sample, sceneProjection, {
      includeColors: true,
      radiusMultiplier: 0.78,
    }),
    new THREE.MeshBasicMaterial({
      depthWrite: false,
      opacity: 0.5,
      side: THREE.DoubleSide,
      transparent: true,
      vertexColors: true,
    }),
  )

  shell.renderOrder = 3
  fluid.renderOrder = 2
  group.add(fluid)
  group.add(shell)
  group.add(createBernoulliSectionRing(sample, sceneProjection, -3, 0x2dd4bf))
  group.add(createBernoulliSectionRing(sample, sceneProjection, 0, 0xf59e0b))
  group.add(createBernoulliSectionRing(sample, sceneProjection, 3, 0x38bdf8))
  group.add(createBernoulliAxisLine(sample, sceneProjection))

  const flowLookup = createBernoulliFlowLookup(sample)
  const particles = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, 10, 6),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.92,
      transparent: true,
      vertexColors: true,
    }),
    bernoulliParticleCount,
  )
  const particlePhases = Array.from({ length: bernoulliParticleCount }, (_, index) =>
    (index / bernoulliParticleCount +
      (((index * 17) % 23) / 23) / bernoulliParticleCount) %
    1,
  )

  particles.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  particles.renderOrder = 4
  group.add(particles)

  const manometerColumns: THREE.Mesh[] = []
  const maxSceneRadius = Math.max(
    ...bernoulliManometerXs.map((xMeters) =>
      getBernoulliSceneRadiusAtX(sample, sceneProjection, xMeters),
    ),
  )
  const manometerBaseZ = maxSceneRadius + 0.16

  bernoulliManometerXs.forEach((xMeters, index) => {
    const x = xMeters * sceneProjection.positionScale
    const pipe = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 1, 18, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0x8bd7ff,
        depthWrite: false,
        opacity: 0.14,
        transparent: true,
      }),
    )
    const column = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 1, 18),
      new THREE.MeshBasicMaterial({
        color: index === 1 ? 0xf59e0b : 0x2dd4bf,
        opacity: 0.76,
        transparent: true,
      }),
    )
    const tubeTop = new THREE.Vector3(
      x,
      0,
      getBernoulliSceneCenterZAtX(sample, sceneProjection, xMeters) +
        getBernoulliSceneRadiusAtX(sample, sceneProjection, xMeters),
    )
    const pipeBottom = new THREE.Vector3(x, bernoulliManometerFrontY, manometerBaseZ)

    pipe.rotation.x = Math.PI / 2
    pipe.position.set(
      x,
      bernoulliManometerFrontY,
      manometerBaseZ + bernoulliManometerMaxHeight / 2,
    )
    pipe.scale.set(0.052, bernoulliManometerMaxHeight, 0.052)
    column.rotation.x = Math.PI / 2
    column.scale.set(0.038, bernoulliManometerMinHeight, 0.038)
    column.position.set(
      x,
      bernoulliManometerFrontY,
      manometerBaseZ + bernoulliManometerMinHeight / 2,
    )
    column.userData.baseZ = manometerBaseZ

    group.add(
      createSceneLine(tubeTop, pipeBottom, index === 1 ? 0xf59e0b : 0x2dd4bf, 0.46),
    )
    group.add(pipe)
    group.add(column)
    manometerColumns.push(column)
  })

  group.visible = false

  return {
    flowLookup,
    group,
    manometerColumns,
    particlePhases,
    particles,
  }
}

function createBernoulliTubeGeometry(
  sample: KinematicsSample,
  sceneProjection: KinematicsSceneProjection,
  {
    includeColors,
    radiusMultiplier,
  }: {
    includeColors: boolean
    radiusMultiplier: number
  },
) {
  const positions: number[] = []
  const colors: number[] = []
  const indices: number[] = []

  for (let axialIndex = 0; axialIndex <= bernoulliTubeSegments; axialIndex += 1) {
    const ratio = axialIndex / bernoulliTubeSegments
    const xMeters = lerp(
      -bernoulliTubeHalfLengthMeters,
      bernoulliTubeHalfLengthMeters,
      ratio,
    )
    const x = xMeters * sceneProjection.positionScale
    const centerZ = getBernoulliSceneCenterZAtX(sample, sceneProjection, xMeters)
    const radius =
      getBernoulliSceneRadiusAtX(sample, sceneProjection, xMeters) * radiusMultiplier
    const color = getBernoulliColorAtX(sample, xMeters)

    for (let radialIndex = 0; radialIndex <= bernoulliTubeRadialSegments; radialIndex += 1) {
      const angle = (Math.PI * 2 * radialIndex) / bernoulliTubeRadialSegments

      positions.push(
        x,
        Math.cos(angle) * radius,
        centerZ + Math.sin(angle) * radius,
      )

      if (includeColors) {
        colors.push(color.r, color.g, color.b)
      }
    }
  }

  const ringStride = bernoulliTubeRadialSegments + 1

  for (let axialIndex = 0; axialIndex < bernoulliTubeSegments; axialIndex += 1) {
    for (let radialIndex = 0; radialIndex < bernoulliTubeRadialSegments; radialIndex += 1) {
      const a = axialIndex * ringStride + radialIndex
      const b = a + ringStride
      const c = b + 1
      const d = a + 1

      indices.push(a, b, d, b, c, d)
    }
  }

  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3),
  )
  geometry.setIndex(indices)

  if (includeColors) {
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  }

  geometry.computeVertexNormals()

  return geometry
}

function createBernoulliSectionRing(
  sample: KinematicsSample,
  sceneProjection: KinematicsSceneProjection,
  xMeters: number,
  color: number,
) {
  const positions: number[] = []
  const radius = getBernoulliSceneRadiusAtX(sample, sceneProjection, xMeters)
  const centerZ = getBernoulliSceneCenterZAtX(sample, sceneProjection, xMeters)
  const x = xMeters * sceneProjection.positionScale

  for (let index = 0; index <= bernoulliTubeRadialSegments; index += 1) {
    const angle = (Math.PI * 2 * index) / bernoulliTubeRadialSegments

    positions.push(x, Math.cos(angle) * radius, centerZ + Math.sin(angle) * radius)
  }

  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

  return new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({
      color,
      opacity: 0.92,
      transparent: true,
    }),
  )
}

function createBernoulliAxisLine(
  sample: KinematicsSample,
  sceneProjection: KinematicsSceneProjection,
) {
  const positions: THREE.Vector3[] = []

  for (let index = 0; index <= 48; index += 1) {
    const ratio = index / 48
    const xMeters = lerp(
      -bernoulliTubeHalfLengthMeters,
      bernoulliTubeHalfLengthMeters,
      ratio,
    )

    positions.push(
      new THREE.Vector3(
        xMeters * sceneProjection.positionScale,
        0,
        getBernoulliSceneCenterZAtX(sample, sceneProjection, xMeters),
      ),
    )
  }

  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(positions),
    new THREE.LineBasicMaterial({
      color: 0xe6e8ec,
      opacity: 0.28,
      transparent: true,
    }),
  )
}

function createBernoulliFlowLookup(sample: KinematicsSample): BernoulliFlowLookup {
  const xMeters: number[] = []
  const cumulativeVolumes: number[] = []
  let volumeCubicMeters = 0

  for (let index = 0; index <= bernoulliFlowLookupSegments; index += 1) {
    const ratio = index / bernoulliFlowLookupSegments
    const x = lerp(
      -bernoulliTubeHalfLengthMeters,
      bernoulliTubeHalfLengthMeters,
      ratio,
    )

    xMeters.push(x)

    if (index > 0) {
      const previousX = xMeters[index - 1]
      const dx = x - previousX
      const averageArea =
        (getBernoulliAreaAtX(sample, previousX) + getBernoulliAreaAtX(sample, x)) /
        2

      volumeCubicMeters += averageArea * dx
    }

    cumulativeVolumes.push(volumeCubicMeters)
  }

  return {
    phases: cumulativeVolumes.map((value) =>
      volumeCubicMeters > 0 ? value / volumeCubicMeters : 0,
    ),
    volumeCubicMeters,
    xMeters,
  }
}

function updateBernoulliObjects(
  objects: SceneObjects,
  sample: KinematicsSample,
) {
  objects.body.visible = false
  objects.secondaryBody.visible = false
  updateBernoulliParticles(objects.bernoulli, sample, objects.sceneProjection)
  updateBernoulliManometers(objects.bernoulli, sample)
}

function updateBernoulliParticles(
  bernoulli: BernoulliSceneObjects,
  sample: KinematicsSample,
  sceneProjection: KinematicsSceneProjection,
) {
  const cycleRate =
    bernoulli.flowLookup.volumeCubicMeters > 0
      ? sample.flowRateCubicMetersPerSecond / bernoulli.flowLookup.volumeCubicMeters
      : 0
  const object = new THREE.Object3D()

  bernoulli.particlePhases.forEach((phase, index) => {
    const travelPhase = positiveModulo(phase + sample.timeSeconds * cycleRate, 1)
    const xMeters = readBernoulliXFromTravelPhase(
      bernoulli.flowLookup,
      travelPhase,
    )
    const radius = getBernoulliSceneRadiusAtX(sample, sceneProjection, xMeters)
    const shellRatio =
      0.18 + 0.62 * (((index * 11) % bernoulliParticleCount) / bernoulliParticleCount)
    const angle = ((index * 137.5) % 360) * (Math.PI / 180)
    const localArea = getBernoulliAreaAtX(sample, xMeters)
    const localSpeed =
      localArea > 0 ? sample.flowRateCubicMetersPerSecond / localArea : 0
    const speedRatio = readBernoulliSpeedRatio(sample, localSpeed)
    const particleRadius =
      bernoulliParticleRadius * (0.72 + speedRatio * 0.58)
    const color = getBernoulliSpeedColor(speedRatio)

    object.position.set(
      xMeters * sceneProjection.positionScale,
      Math.cos(angle) * radius * shellRatio,
      getBernoulliSceneCenterZAtX(sample, sceneProjection, xMeters) +
        Math.sin(angle) * radius * shellRatio,
    )
    object.scale.setScalar(particleRadius)
    object.updateMatrix()
    bernoulli.particles.setMatrixAt(index, object.matrix)
    bernoulli.particles.setColorAt(index, color)
  })

  bernoulli.particles.instanceMatrix.needsUpdate = true
  if (bernoulli.particles.instanceColor) {
    bernoulli.particles.instanceColor.needsUpdate = true
  }
}

function updateBernoulliManometers(
  bernoulli: BernoulliSceneObjects,
  sample: KinematicsSample,
) {
  const pressureValues = [
    sample.pressurePascals,
    sample.secondaryPressurePascals,
    sample.pressurePascals,
  ]
  const positivePressures = pressureValues.map((value) => Math.max(0, value))
  const maxPressure = Math.max(1, ...positivePressures)

  bernoulli.manometerColumns.forEach((column, index) => {
    const pressureRatio = clamp(positivePressures[index] / maxPressure, 0, 1)
    const height = lerp(
      bernoulliManometerMinHeight,
      bernoulliManometerMaxHeight,
      pressureRatio,
    )
    const baseZ =
      typeof column.userData.baseZ === 'number'
        ? column.userData.baseZ
        : bernoulliManometerMinHeight

    column.scale.set(0.038, height, 0.038)
    column.position.z = baseZ + height / 2
  })
}

function readBernoulliXFromTravelPhase(
  lookup: BernoulliFlowLookup,
  phase: number,
) {
  const phases = lookup.phases

  for (let index = 1; index < phases.length; index += 1) {
    if (phase <= phases[index]) {
      const startPhase = phases[index - 1]
      const endPhase = phases[index]
      const ratio =
        endPhase > startPhase ? (phase - startPhase) / (endPhase - startPhase) : 0

      return lerp(lookup.xMeters[index - 1], lookup.xMeters[index], ratio)
    }
  }

  return lookup.xMeters.at(-1) ?? bernoulliTubeHalfLengthMeters
}

function getBernoulliSceneCenterZAtX(
  sample: KinematicsSample,
  sceneProjection: KinematicsSceneProjection,
  xMeters: number,
) {
  return getBernoulliThroatInfluence(xMeters) *
    sample.secondaryZMeters *
    sceneProjection.positionScale
}

function getBernoulliSceneRadiusAtX(
  sample: KinematicsSample,
  sceneProjection: KinematicsSceneProjection,
  xMeters: number,
) {
  const physicalRadiusMeters = Math.sqrt(
    getBernoulliAreaAtX(sample, xMeters) / Math.PI,
  )

  return clamp(
    physicalRadiusMeters *
      sceneProjection.positionScale *
      bernoulliTubeRadiusVisualScale,
    0.13,
    0.62,
  )
}

function getBernoulliAreaAtX(sample: KinematicsSample, xMeters: number) {
  const throatInfluence = getBernoulliThroatInfluence(xMeters)

  return lerp(
    sample.crossSectionAreaSquareMeters,
    sample.secondaryCrossSectionAreaSquareMeters,
    throatInfluence,
  )
}

function getBernoulliThroatInfluence(xMeters: number) {
  const normalized = xMeters / bernoulliThroatWidthMeters

  return Math.exp(-(normalized * normalized))
}

function getBernoulliColorAtX(sample: KinematicsSample, xMeters: number) {
  const area = getBernoulliAreaAtX(sample, xMeters)
  const localSpeed =
    area > 0 ? sample.flowRateCubicMetersPerSecond / area : 0

  return getBernoulliSpeedColor(readBernoulliSpeedRatio(sample, localSpeed))
}

function readBernoulliSpeedRatio(sample: KinematicsSample, localSpeed: number) {
  const minSpeed = Math.min(
    sample.speedMetersPerSecond,
    sample.secondarySpeedMetersPerSecond,
  )
  const maxSpeed = Math.max(
    sample.speedMetersPerSecond,
    sample.secondarySpeedMetersPerSecond,
  )

  if (maxSpeed - minSpeed <= 1e-9) {
    return 0
  }

  return clamp((localSpeed - minSpeed) / (maxSpeed - minSpeed), 0, 1)
}

function getBernoulliSpeedColor(ratio: number) {
  const low = new THREE.Color(0x38bdf8)
  const mid = new THREE.Color(0xa3e635)
  const high = new THREE.Color(0xf59e0b)

  return ratio < 0.5
    ? low.lerp(mid, ratio / 0.5)
    : mid.lerp(high, (ratio - 0.5) / 0.5)
}

function positiveModulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor
}

function isSingleSpringOscillatorSimulation(
  simulationId: KinematicsSimulationId,
) {
  return (
    simulationId === 'damped-oscillator' ||
    simulationId === 'forced-oscillator-resonance' ||
    simulationId === 'mass-spring'
  )
}

function isMechanicalWaveSimulation(
  simulationId: KinematicsSimulationId,
): simulationId is WaveProfileSimulationId {
  return (
    simulationId === 'beats' ||
    simulationId === 'doppler-effect' ||
    simulationId === 'standing-waves' ||
    simulationId === 'superposition-interference' ||
    simulationId === 'wave-on-string'
  )
}

function isSoundWaveSimulation(
  simulationId: KinematicsSimulationId,
): simulationId is 'beats' | 'doppler-effect' {
  return simulationId === 'beats' || simulationId === 'doppler-effect'
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

function updateCoupledOscillatorObjects(
  objects: SceneObjects,
  sample: KinematicsSample,
  showEnergy: boolean,
  showTrace: boolean,
) {
  const scale = objects.sceneProjection.positionScale
  const primaryPosition = toKinematicsScenePosition(sample, objects.sceneProjection)
  const secondaryPosition = toKinematicsScenePosition(
    {
      ...sample,
      xMeters: sample.secondaryXMeters,
      zMeters: sample.secondaryZMeters,
    },
    objects.sceneProjection,
  )
  const bodyRadius = objects.bodyRadius
  const springTopZ = sample.primaryRadiusMeters * scale
  const supportZ = springTopZ + Math.max(0.18, bodyRadius * 0.9)
  const supportWidth =
    Math.abs(primaryPosition.x - secondaryPosition.x) + bodyRadius * 5.4
  const rulerHalfSpan = Math.max(0.65, bodyRadius * 3.1)
  const primarySpringBottomZ = Math.min(
    springTopZ - 0.12,
    primaryPosition.z + bodyRadius * 0.82,
  )
  const secondarySpringBottomZ = Math.min(
    springTopZ - 0.12,
    secondaryPosition.z + bodyRadius * 0.82,
  )
  const coilRadius = clamp(bodyRadius * 0.58, 0.07, 0.18)
  const ropePoints = createCoupledOscillatorSpringPoints({
    coilRadius,
    primaryBottom: new THREE.Vector3(
      primaryPosition.x,
      0,
      primarySpringBottomZ,
    ),
    primaryMass: primaryPosition,
    primaryTop: new THREE.Vector3(primaryPosition.x, 0, springTopZ),
    secondaryBottom: new THREE.Vector3(
      secondaryPosition.x,
      0,
      secondarySpringBottomZ,
    ),
    secondaryMass: secondaryPosition,
    secondaryTop: new THREE.Vector3(secondaryPosition.x, 0, springTopZ),
  })

  objects.body.position.copy(primaryPosition)
  objects.body.scale.setScalar(1)
  configureCoupledOscillatorMassMaterial(
    objects.body,
    0x2dd4bf,
    sample.speedMetersPerSecond,
  )
  objects.secondaryBody.position.copy(secondaryPosition)
  objects.secondaryBody.scale.setScalar(1)
  configureCoupledOscillatorMassMaterial(
    objects.secondaryBody,
    0x38bdf8,
    sample.secondarySpeedMetersPerSecond,
  )
  objects.supportBar.position.set(0, 0, supportZ)
  objects.supportBar.scale.set(supportWidth, 0.11, 0.09)
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
  updateCoupledOscillatorDidacticObjects({
    bodyRadius,
    objects,
    primaryPosition,
    rulerHalfSpan,
    sample,
    scale,
    secondaryPosition,
    showEnergy,
    showTrace,
  })
}

function configureCoupledOscillatorMassMaterial(
  body: THREE.Mesh,
  color: number,
  speedMetersPerSecond: number,
) {
  const material = body.material as THREE.MeshStandardMaterial
  const speedGlow = clamp(speedMetersPerSecond / 1.8, 0, 1)

  material.color.setHex(color)
  material.emissive.setHex(color)
  material.emissiveIntensity = 0.1 + speedGlow * 0.36
  material.metalness = 0.1 + speedGlow * 0.08
  material.opacity = body.geometry.type === 'SphereGeometry' ? 0.86 : 0.96
  material.roughness = body.geometry.type === 'SphereGeometry' ? 0.26 : 0.38
  material.transparent = true
}

function updateCoupledOscillatorDidacticObjects({
  bodyRadius,
  objects,
  primaryPosition,
  rulerHalfSpan,
  sample,
  scale,
  secondaryPosition,
  showEnergy,
  showTrace,
}: {
  bodyRadius: number
  objects: SceneObjects
  primaryPosition: THREE.Vector3
  rulerHalfSpan: number
  sample: KinematicsSample
  scale: number
  secondaryPosition: THREE.Vector3
  showEnergy: boolean
  showTrace: boolean
}) {
  const couplingStart = primaryPosition
    .clone()
    .add(new THREE.Vector3(Math.max(0.12, bodyRadius * 0.8), 0, 0))
  const couplingEnd = secondaryPosition
    .clone()
    .add(new THREE.Vector3(-Math.max(0.12, bodyRadius * 0.8), 0, 0))
  const couplingPoints = createHorizontalCoilPoints({
    end: couplingEnd,
    radius: clamp(bodyRadius * 0.42, 0.055, 0.13),
    start: couplingStart,
  }).slice(0, coupledCouplingSpringPointCapacity)
  const deformationRatio = clamp(Math.abs(sample.displacementMeters) / 0.45, 0, 1)
  const couplingMaterial =
    objects.coupledCouplingSpring.material as THREE.LineBasicMaterial
  const ropeMaterial = objects.rope.material as THREE.LineBasicMaterial

  couplingMaterial.color.set(deformationRatio > 0.35 ? 0xfbbf24 : 0xa3e635)
  couplingMaterial.opacity = 0.5 + deformationRatio * 0.46
  ropeMaterial.color.set(
    sample.displacementMeters > 0.05
      ? 0xfbbf24
      : sample.displacementMeters < -0.05
        ? 0x7dd3fc
        : 0xe6e8ec,
  )
  ropeMaterial.opacity = 0.72 + deformationRatio * 0.2

  couplingPoints.forEach((point, index) => {
    const offset = index * 3

    objects.coupledCouplingSpringPositions[offset] = point.x
    objects.coupledCouplingSpringPositions[offset + 1] = point.y
    objects.coupledCouplingSpringPositions[offset + 2] = point.z
  })
  objects.coupledCouplingSpring.geometry.setDrawRange(0, couplingPoints.length)
  objects.coupledCouplingSpringPositionAttribute.needsUpdate = true

  updateCoupledEquilibriumLine(
    objects.coupledEquilibriumLineA,
    primaryPosition.x,
    bodyRadius,
  )
  updateCoupledEquilibriumLine(
    objects.coupledEquilibriumLineB,
    secondaryPosition.x,
    bodyRadius,
  )
  objects.coupledEquilibriumLabel.position.set(
    (primaryPosition.x + secondaryPosition.x) / 2,
    -0.34,
    bodyRadius * 0.55,
  )
  objects.coupledMassLabelA.position.copy(
    primaryPosition.clone().add(new THREE.Vector3(0, -0.24, bodyRadius * 1.75)),
  )
  objects.coupledMassLabelB.position.copy(
    secondaryPosition.clone().add(new THREE.Vector3(0, -0.24, bodyRadius * 1.75)),
  )
  objects.coupledDisplacementLabelA.position.copy(
    primaryPosition.clone().add(new THREE.Vector3(-bodyRadius * 1.8, -0.2, 0.02)),
  )
  objects.coupledDisplacementLabelB.position.copy(
    secondaryPosition.clone().add(new THREE.Vector3(bodyRadius * 1.8, -0.2, 0.02)),
  )
  updateSceneTextSprite(
    objects.coupledDisplacementLabelA,
    `xA = ${formatSceneDynamicNumber(sample.positionMeters)} m`,
  )
  updateSceneTextSprite(
    objects.coupledDisplacementLabelB,
    `xB = ${formatSceneDynamicNumber(-sample.secondaryZMeters)} m`,
  )

  updateCoupledRuler(objects.coupledRulerA, {
    halfSpan: rulerHalfSpan,
    position: new THREE.Vector3(primaryPosition.x - bodyRadius * 1.75, -0.34, 0),
  })
  updateCoupledRuler(objects.coupledRulerB, {
    halfSpan: rulerHalfSpan,
    position: new THREE.Vector3(secondaryPosition.x + bodyRadius * 1.75, -0.34, 0),
  })
  updateCoupledEnergyPackets({
    couplingEnd,
    couplingStart,
    deformationRatio,
    objects,
    sample,
    scale,
    showEnergy,
    showTrace,
  })
}

function updateCoupledEnergyPackets({
  couplingEnd,
  couplingStart,
  deformationRatio,
  objects,
  sample,
  scale,
  showEnergy,
  showTrace,
}: {
  couplingEnd: THREE.Vector3
  couplingStart: THREE.Vector3
  deformationRatio: number
  objects: SceneObjects
  sample: KinematicsSample
  scale: number
  showEnergy: boolean
  showTrace: boolean
}) {
  const material = objects.coupledEnergyPackets.material as THREE.MeshBasicMaterial
  const transferDirection =
    sample.leftKineticEnergyJoules >= sample.rightKineticEnergyJoules ? 1 : -1
  const pulseOpacity = showEnergy ? 0.16 + deformationRatio * 0.72 : 0
  const span = couplingEnd.clone().sub(couplingStart)
  const normalOffset = new THREE.Vector3(0, -0.055, 0)

  material.opacity = pulseOpacity
  objects.coupledEnergyPackets.visible = showEnergy

  for (let index = 0; index < coupledEnergyPacketCount; index += 1) {
    const phase =
      (sample.timeSeconds * (0.42 + deformationRatio) + index / coupledEnergyPacketCount) %
      1
    const ratio = transferDirection > 0 ? phase : 1 - phase
    const bob = Math.sin((phase + index * 0.13) * Math.PI * 2) * 0.025
    const packetScale =
      (showTrace ? 0.82 : 0.64) * (0.55 + deformationRatio * 0.78) * scale

    objects.coupledEnergyPacketHelper.position
      .copy(couplingStart)
      .addScaledVector(span, ratio)
      .add(normalOffset)
    objects.coupledEnergyPacketHelper.position.z += bob
    objects.coupledEnergyPacketHelper.scale.setScalar(packetScale)
    objects.coupledEnergyPacketHelper.updateMatrix()
    objects.coupledEnergyPackets.setMatrixAt(
      index,
      objects.coupledEnergyPacketHelper.matrix,
    )
  }
  objects.coupledEnergyPackets.instanceMatrix.needsUpdate = true
}

function updateMechanicalWaveObjects(
  objects: SceneObjects,
  parameters: KinematicsParameters,
  sample: KinematicsSample,
  simulationId: KinematicsSimulationId,
  showEnergy: boolean,
  showTrace: boolean,
  showVectors: boolean,
) {
  if (!isMechanicalWaveSimulation(simulationId)) {
    return
  }

  const profile = computeMechanicalWaveProfile(
    simulationId,
    parameters as WaveProfileParameters,
    sample.timeSeconds,
    waveStringPointCapacity,
    objects.waveProfileDomain ?? undefined,
  )

  profile.forEach((point, index) => {
    writeWavePoint(objects.waveStringPositions, index, objects, {
      xMeters: point.xMeters,
      zMeters: point.zMeters,
    })
    writeWavePoint(objects.waveComponentOnePositions, index, objects, {
      xMeters: point.xMeters,
      zMeters: point.componentOneMeters,
    })
    writeWavePoint(objects.waveComponentTwoPositions, index, objects, {
      xMeters: point.xMeters,
      zMeters: point.componentTwoMeters,
    })
    writeWavePoint(objects.waveEnvelopeUpperPositions, index, objects, {
      xMeters: point.xMeters,
      zMeters: point.envelopeMeters,
    })
    writeWavePoint(objects.waveEnvelopeLowerPositions, index, objects, {
      xMeters: point.xMeters,
      zMeters: -point.envelopeMeters,
    })
  })

  ;[
    objects.waveString,
    objects.waveComponentOne,
    objects.waveComponentTwo,
    objects.waveEnvelopeUpper,
    objects.waveEnvelopeLower,
  ].forEach((line) => {
    line.geometry.setDrawRange(0, profile.length)
  })
  objects.waveStringPositionAttribute.needsUpdate = true
  objects.waveComponentOnePositionAttribute.needsUpdate = true
  objects.waveComponentTwoPositionAttribute.needsUpdate = true
  objects.waveEnvelopeUpperPositionAttribute.needsUpdate = true
  objects.waveEnvelopeLowerPositionAttribute.needsUpdate = true

  const waveStringMaterial = objects.waveString.material as THREE.LineBasicMaterial
  const waveStringOpacity =
    simulationId === 'wave-on-string'
      ? 0.38
      : isSoundWaveSimulation(simulationId)
        ? 0.74
        : 0.96

  if (
    waveStringMaterial.opacity !== waveStringOpacity ||
    !waveStringMaterial.transparent
  ) {
    waveStringMaterial.opacity = waveStringOpacity
    waveStringMaterial.transparent = true
    waveStringMaterial.needsUpdate = true
  }

  const soundWave = isSoundWaveSimulation(simulationId)

  objects.body.position.copy(
    simulationId === 'doppler-effect'
      ? toSoundWaveFieldScenePointForSimulation(
          simulationId,
          objects,
          sample.xMeters,
          0,
          0,
        )
      : soundWave
        ? toWaveScenePoint(objects, sample.xMeters, 0, 0)
        : toKinematicsScenePosition(sample, objects.sceneProjection),
  )
  objects.body.scale.setScalar(
    soundWave ? 0.3 : simulationId === 'wave-on-string' ? 0.34 : 0.72,
  )
  configureWaveProbeMarker(objects.body, simulationId)
  if (simulationId === 'doppler-effect') {
    objects.secondaryBody.position.copy(
      toSoundWaveFieldScenePointForSimulation(
        simulationId,
        objects,
        sample.secondaryXMeters,
        0,
        0,
      ),
    )
    objects.secondaryBody.scale.setScalar(0.42)
  }
  updateWaveLabObjects({
    objects,
    parameters,
    profile,
    sample,
    showEnergy,
    showTrace,
    showVectors,
    simulationId,
  })
}

function writeWavePoint(
  positions: Float32Array,
  index: number,
  objects: SceneObjects,
  point: { xMeters: number; zMeters: number },
) {
  const scale = objects.sceneProjection.positionScale
  const offset = index * 3

  if (objects.sceneProjection.horizontalPlane) {
    positions[offset] = point.xMeters * scale
    positions[offset + 1] = point.zMeters * scale
    positions[offset + 2] = 0
    return
  }

  positions[offset] = point.xMeters * scale
  positions[offset + 1] = 0
  positions[offset + 2] = point.zMeters * scale
}

function configureWaveProbeMarker(
  body: THREE.Mesh,
  simulationId: KinematicsSimulationId,
) {
  const material = body.material as THREE.MeshStandardMaterial
  const isTravelingWave =
    simulationId === 'wave-on-string' || isSoundWaveSimulation(simulationId)

  material.depthWrite = !isTravelingWave
  material.opacity = isSoundWaveSimulation(simulationId)
    ? 0.84
    : isTravelingWave
      ? 0.58
      : 1
  material.transparent = isTravelingWave
  body.renderOrder = isTravelingWave ? 12 : 0
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

function createCoupledOscillatorSpringPoints({
  coilRadius,
  primaryBottom,
  primaryMass,
  primaryTop,
  secondaryBottom,
  secondaryMass,
  secondaryTop,
}: {
  coilRadius: number
  primaryBottom: THREE.Vector3
  primaryMass: THREE.Vector3
  primaryTop: THREE.Vector3
  secondaryBottom: THREE.Vector3
  secondaryMass: THREE.Vector3
  secondaryTop: THREE.Vector3
}) {
  const primaryCoil = createMassSpringCoilPoints({
    bottom: primaryBottom,
    radius: coilRadius,
    top: primaryTop,
  }).map((point) => point.add(new THREE.Vector3(primaryTop.x, 0, 0)))
  const secondaryCoil = createMassSpringCoilPoints({
    bottom: secondaryBottom,
    radius: coilRadius,
    top: secondaryTop,
  }).map((point) => point.add(new THREE.Vector3(secondaryTop.x, 0, 0)))
  const couplingStart = primaryMass
    .clone()
    .add(new THREE.Vector3(Math.max(0.11, coilRadius), 0, 0))
  const couplingEnd = secondaryMass
    .clone()
    .add(new THREE.Vector3(-Math.max(0.11, coilRadius), 0, 0))
  const couplingPoints = createHorizontalCoilPoints({
    end: couplingEnd,
    radius: coilRadius * 0.72,
    start: couplingStart,
  })

  return [
    ...primaryCoil,
    ...couplingPoints,
    ...secondaryCoil.reverse(),
  ].slice(0, atwoodRopePointCapacity)
}

function createHorizontalCoilPoints({
  end,
  radius,
  start,
}: {
  end: THREE.Vector3
  radius: number
  start: THREE.Vector3
}) {
  const points: THREE.Vector3[] = []
  const segments = 36
  const turns = 6

  for (let index = 0; index <= segments; index += 1) {
    const ratio = index / segments
    const angle = ratio * Math.PI * 2 * turns
    const endRadius = index === 0 || index === segments ? 0 : radius

    points.push(
      new THREE.Vector3(
        lerp(start.x, end.x, ratio),
        endRadius * Math.sin(angle),
        lerp(start.z, end.z, ratio),
      ),
    )
  }

  return points
}

function updateTrace(
  objects: SceneObjects,
  samples: KinematicsSample[],
  sampleIndex: number,
  currentSample: KinematicsSample,
  showTrace: boolean,
  simulationId: KinematicsSimulationId,
) {
  if (simulationId === 'rigid-body-rotation') {
    updateRigidBodyRotationTrace(objects, samples, sampleIndex, showTrace)
    return
  }

  if (simulationId === 'uniform-linear-motion') {
    updateUniformLinearMotionTrace(
      objects,
      samples[0] ?? currentSample,
      currentSample,
      showTrace,
    )
    return
  }

  if (simulationId === 'uniformly-accelerated-motion') {
    updateUniformlyAcceleratedMotionTrace(objects, currentSample, showTrace)
    return
  }

  if (simulationId === 'coupled-oscillators') {
    updateCoupledOscillatorTrace(
      objects,
      samples,
      sampleIndex,
      currentSample,
      showTrace,
    )
    return
  }

  if (simulationId === 'doppler-effect') {
    updateDopplerSourceTrace(objects, samples, sampleIndex, showTrace)
    return
  }

  if (!showTrace || sampleIndex < 1) {
    objects.trace.visible = false
    objects.trace.geometry.setDrawRange(0, 0)
    return
  }

  const newestTimeSeconds = currentSample.timeSeconds
  const traceHistorySeconds = getTraceFadeSeconds(simulationId)
  const oldestVisibleTimeSeconds = Math.max(
    0,
    newestTimeSeconds - traceHistorySeconds,
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
      Math.max(0, (newestTimeSeconds - sample.timeSeconds) / traceHistorySeconds),
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

function updateDopplerSourceTrace(
  objects: SceneObjects,
  samples: KinematicsSample[],
  sampleIndex: number,
  showTrace: boolean,
) {
  if (!showTrace || sampleIndex < 1) {
    objects.trace.visible = false
    objects.trace.geometry.setDrawRange(0, 0)
    return
  }

  const currentSample = samples[sampleIndex]
  const newestTimeSeconds = currentSample.timeSeconds
  const traceHistorySeconds = getTraceFadeSeconds('doppler-effect')
  const oldestVisibleTimeSeconds = Math.max(
    0,
    newestTimeSeconds - traceHistorySeconds,
  )
  const firstTraceSampleIndex = findTraceStartIndex(
    samples,
    sampleIndex,
    oldestVisibleTimeSeconds,
  )
  const traceSamples = samples
    .slice(firstTraceSampleIndex, sampleIndex + 1)
    .slice(-maxTracePoints)

  if (traceSamples.length < 2) {
    objects.trace.visible = false
    objects.trace.geometry.setDrawRange(0, 0)
    return
  }

  traceSamples.forEach((sample, traceIndex) => {
    const position = toDopplerDiagonalScenePoint(
      objects.sceneProjection,
      sample.secondaryXMeters,
      0,
      0.09,
    )
    const positionOffset = traceIndex * 3
    const colorOffset = traceIndex * 4
    const ageRatio = Math.min(
      1,
      Math.max(0, (newestTimeSeconds - sample.timeSeconds) / traceHistorySeconds),
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
  objects.trace.geometry.setDrawRange(0, traceSamples.length)
  objects.tracePositionAttribute.needsUpdate = true
  objects.traceColorAttribute.needsUpdate = true
}

function updateCoupledOscillatorTrace(
  objects: SceneObjects,
  samples: KinematicsSample[],
  sampleIndex: number,
  currentSample: KinematicsSample,
  showTrace: boolean,
) {
  if (!showTrace || sampleIndex < 1) {
    objects.trace.visible = false
    objects.coupledSecondaryTrace.visible = false
    objects.trace.geometry.setDrawRange(0, 0)
    objects.coupledSecondaryTrace.geometry.setDrawRange(0, 0)
    return
  }

  const traceHistorySeconds = getTraceFadeSeconds('coupled-oscillators')
  const oldestVisibleTimeSeconds = Math.max(
    0,
    currentSample.timeSeconds - traceHistorySeconds,
  )
  const firstTraceSampleIndex = findTraceStartIndex(
    samples,
    sampleIndex,
    oldestVisibleTimeSeconds,
  )
  const traceSamples = samples
    .slice(firstTraceSampleIndex, sampleIndex + 1)
    .slice(-maxTracePoints)

  if (traceSamples.length < 2) {
    objects.trace.visible = false
    objects.coupledSecondaryTrace.visible = false
    return
  }

  writeCoupledTraceLine({
    color: { blue: 0xbf / 255, green: 0xd4 / 255, red: 0x2d / 255 },
    colorAttribute: objects.traceColorAttribute,
    colors: objects.traceColors,
    line: objects.trace,
    objects,
    positionAttribute: objects.tracePositionAttribute,
    positions: objects.tracePositions,
    samples: traceSamples,
    selectSample: (sample) => sample,
    traceHistorySeconds,
  })
  writeCoupledTraceLine({
    color: { blue: 0xf8 / 255, green: 0xbd / 255, red: 0x38 / 255 },
    colorAttribute: objects.coupledSecondaryTraceColorAttribute,
    colors: objects.coupledSecondaryTraceColors,
    line: objects.coupledSecondaryTrace,
    objects,
    positionAttribute: objects.coupledSecondaryTracePositionAttribute,
    positions: objects.coupledSecondaryTracePositions,
    samples: traceSamples,
    selectSample: (sample) => ({
      ...sample,
      xMeters: sample.secondaryXMeters,
      zMeters: sample.secondaryZMeters,
    }),
    traceHistorySeconds,
  })
}

function writeCoupledTraceLine({
  color,
  colorAttribute,
  colors,
  line,
  objects,
  positionAttribute,
  positions,
  samples,
  selectSample,
  traceHistorySeconds,
}: {
  color: { blue: number; green: number; red: number }
  colorAttribute: THREE.BufferAttribute
  colors: Float32Array
  line: THREE.Line
  objects: SceneObjects
  positionAttribute: THREE.BufferAttribute
  positions: Float32Array
  samples: KinematicsSample[]
  selectSample: (sample: KinematicsSample) => KinematicsSample
  traceHistorySeconds: number
}) {
  const newestSample = samples.at(-1)

  if (!newestSample) {
    line.visible = false
    return
  }

  samples.forEach((sample, traceIndex) => {
    const position = toKinematicsScenePosition(
      selectSample(sample),
      objects.sceneProjection,
    )
    const positionOffset = traceIndex * 3
    const colorOffset = traceIndex * 4
    const ageRatio = Math.min(
      1,
      Math.max(
        0,
        (newestSample.timeSeconds - sample.timeSeconds) / traceHistorySeconds,
      ),
    )
    const opacity = traceMaxOpacity - ageRatio * (traceMaxOpacity - traceMinOpacity)

    positions[positionOffset] = position.x
    positions[positionOffset + 1] = position.y
    positions[positionOffset + 2] = position.z
    colors[colorOffset] = color.red
    colors[colorOffset + 1] = color.green
    colors[colorOffset + 2] = color.blue
    colors[colorOffset + 3] = opacity
  })

  line.visible = true
  line.geometry.setDrawRange(0, samples.length)
  positionAttribute.needsUpdate = true
  colorAttribute.needsUpdate = true
}

function updateUniformLinearMotionTrace(
  objects: SceneObjects,
  startSample: KinematicsSample,
  currentSample: KinematicsSample,
  showTrace: boolean,
) {
  const displacementMeters =
    currentSample.positionMeters -
    (startSample.positionMeters - startSample.displacementMeters)

  if (!showTrace || Math.abs(displacementMeters) < 0.004) {
    objects.trace.visible = false
    objects.trace.geometry.setDrawRange(0, 0)
    return
  }

  const scale = objects.sceneProjection.positionScale
  const startX =
    (startSample.positionMeters - startSample.displacementMeters) * scale
  const endX = currentSample.positionMeters * scale
  const drawCount = Math.min(uniformLinearTracePointCount, maxTracePoints)

  for (let index = 0; index < drawCount; index += 1) {
    const ratio = drawCount <= 1 ? 1 : index / (drawCount - 1)
    const positionOffset = index * 3
    const colorOffset = index * 4
    const opacity =
      traceMinOpacity + ratio * (traceMaxOpacity - traceMinOpacity)

    objects.tracePositions[positionOffset] = lerp(startX, endX, ratio)
    objects.tracePositions[positionOffset + 1] = 0.02
    objects.tracePositions[positionOffset + 2] = 0.128
    objects.traceColors[colorOffset] = traceColor.red
    objects.traceColors[colorOffset + 1] = traceColor.green
    objects.traceColors[colorOffset + 2] = traceColor.blue
    objects.traceColors[colorOffset + 3] = opacity
  }

  objects.trace.visible = true
  objects.trace.geometry.setDrawRange(0, drawCount)
  objects.tracePositionAttribute.needsUpdate = true
  objects.traceColorAttribute.needsUpdate = true
}

function updateUniformlyAcceleratedMotionTrace(
  objects: SceneObjects,
  currentSample: KinematicsSample,
  showTrace: boolean,
) {
  if (!showTrace || Math.abs(currentSample.displacementMeters) < 0.004) {
    objects.trace.visible = false
    objects.trace.geometry.setDrawRange(0, 0)
    return
  }

  const scale = objects.sceneProjection.positionScale
  const startZ =
    (currentSample.zMeters - currentSample.displacementMeters) * scale
  const endZ = currentSample.zMeters * scale
  const drawCount = Math.min(constantAccelerationTracePointCount, maxTracePoints)

  for (let index = 0; index < drawCount; index += 1) {
    const ratio = drawCount <= 1 ? 1 : index / (drawCount - 1)
    const speedRatio = clamp(
      currentSample.speedMetersPerSecond / 24,
      0,
      1,
    )
    const color = blendRgb(traceColor, thermalTraceStartColor, ratio * speedRatio)
    const positionOffset = index * 3
    const colorOffset = index * 4
    const opacity =
      traceMinOpacity + ratio * (traceMaxOpacity - traceMinOpacity)

    objects.tracePositions[positionOffset] = 0
    objects.tracePositions[positionOffset + 1] = 0.018
    objects.tracePositions[positionOffset + 2] = lerp(startZ, endZ, ratio)
    objects.traceColors[colorOffset] = color.red
    objects.traceColors[colorOffset + 1] = color.green
    objects.traceColors[colorOffset + 2] = color.blue
    objects.traceColors[colorOffset + 3] = opacity
  }

  objects.trace.visible = true
  objects.trace.geometry.setDrawRange(0, drawCount)
  objects.tracePositionAttribute.needsUpdate = true
  objects.traceColorAttribute.needsUpdate = true
}

function updateRigidBodyRotationTrace(
  objects: SceneObjects,
  samples: KinematicsSample[],
  sampleIndex: number,
  showTrace: boolean,
) {
  if (!showTrace || sampleIndex < 1) {
    objects.trace.visible = false
    objects.trace.geometry.setDrawRange(0, 0)
    return
  }

  const currentSample = samples[sampleIndex]
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
    const tracePosition = getRigidBodyRotationTracePosition(
      objects.bodyRadius,
      sample,
    )
    const positionOffset = traceIndex * 3
    const colorOffset = traceIndex * 4
    const ageRatio = Math.min(
      1,
      Math.max(0, (newestTimeSeconds - sample.timeSeconds) / traceFadeSeconds),
    )
    const heatRatio = clamp(sample.thermalEnergyJoules * 0.035, 0, 1)
    const color = blendRgb(traceColor, thermalTraceEndColor, heatRatio)
    const opacity = traceMaxOpacity - ageRatio * (traceMaxOpacity - traceMinOpacity)

    objects.tracePositions[positionOffset] = tracePosition.x
    objects.tracePositions[positionOffset + 1] = tracePosition.y
    objects.tracePositions[positionOffset + 2] = tracePosition.z
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

function createSceneReferencePathSamples(
  samples: KinematicsSample[],
  simulationId: KinematicsSimulationId,
  parameters: KinematicsParameters,
  waveProfileDomain: MechanicalWaveProfileDomain | null,
) {
  if (simulationId === 'gravitational-field-orbits') {
    return computeGravitationalOrbitPathSamples(
      parameters as GravitationalFieldOrbitsParameters,
    )
  }

  if (isMechanicalWaveSimulation(simulationId)) {
    const firstSample =
      samples[0] ?? computeKinematicsSample(simulationId, parameters, 0)
    const profile = computeMechanicalWaveProfile(
      simulationId,
      parameters as WaveProfileParameters,
      firstSample?.timeSeconds ?? 0,
      waveStringPointCapacity,
      waveProfileDomain ?? undefined,
    )

    return profile.map((point) => ({
      ...firstSample,
      xMeters: point.xMeters,
      zMeters: point.zMeters,
      secondaryXMeters: point.xMeters,
      secondaryZMeters: point.envelopeMeters,
    })) as KinematicsSample[]
  }

  return samples
}

function createMechanicalWaveProfileDomain(
  samples: KinematicsSample[],
  simulationId: KinematicsSimulationId,
  parameters: KinematicsParameters,
): MechanicalWaveProfileDomain | null {
  if (simulationId !== 'doppler-effect') {
    return null
  }

  const { mediumLengthMeters } = parameters as DopplerEffectParameters
  const absolutePositions = [0, mediumLengthMeters]

  samples.forEach((sample) => {
    absolutePositions.push(
      sample.xMeters + mediumLengthMeters / 2,
      sample.secondaryXMeters + mediumLengthMeters / 2,
    )
  })

  const finitePositions = absolutePositions.filter(Number.isFinite)
  const startMeters = Math.min(...finitePositions)
  const endMeters = Math.max(...finitePositions)

  return {
    endMeters: Math.max(endMeters, startMeters + 1e-6),
    startMeters,
  }
}

function mergeSceneFramingSamples(
  samples: KinematicsSample[],
  referencePathSamples: KinematicsSample[],
) {
  return referencePathSamples === samples
    ? samples
    : [...samples, ...referencePathSamples]
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

function createCoupledOscillatorRuler() {
  const vertices: number[] = [0, 0, -1, 0, 0, 1]

  ;[-1, -0.5, 0, 0.5, 1].forEach((z) => {
    vertices.push(-0.055, 0, z, 0.055, 0, z)
  })

  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array(vertices), 3),
  )

  return new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({
      color: 0xcbd5e1,
      depthWrite: false,
      opacity: 0.38,
      transparent: true,
    }),
  )
}

function updateCoupledRuler(
  ruler: THREE.LineSegments,
  {
    halfSpan,
    position,
  }: {
    halfSpan: number
    position: THREE.Vector3
  },
) {
  ruler.position.copy(position)
  ruler.scale.set(1, 1, halfSpan)
}

function updateCoupledEquilibriumLine(
  line: THREE.Line,
  x: number,
  bodyRadius: number,
) {
  const positionAttribute = line.geometry.getAttribute(
    'position',
  ) as THREE.BufferAttribute
  const positions = positionAttribute.array as Float32Array
  const halfWidth = bodyRadius * 1.35

  positions[0] = x - halfWidth
  positions[1] = -0.28
  positions[2] = 0
  positions[3] = x + halfWidth
  positions[4] = -0.28
  positions[5] = 0
  positionAttribute.needsUpdate = true
}

function createDynamicWaveLine(
  positionAttribute: THREE.BufferAttribute,
  color: number,
  opacity: number,
) {
  positionAttribute.setUsage(THREE.DynamicDrawUsage)
  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute('position', positionAttribute)
  geometry.setDrawRange(0, 0)

  return new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({
      color,
      linewidth: 2,
      opacity,
      transparent: opacity < 1,
    }),
  )
}

function createWaveLabObjects(): WaveLabObjects {
  const group = new THREE.Group()
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0x9ca3af,
    metalness: 0.42,
    roughness: 0.38,
  })
  const sourceMaterial = new THREE.MeshStandardMaterial({
    color: 0x20242d,
    emissive: 0x06352e,
    emissiveIntensity: 0.18,
    metalness: 0.2,
    roughness: 0.44,
  })
  const tealMaterial = new THREE.MeshStandardMaterial({
    color: 0x5eead4,
    depthTest: false,
    depthWrite: false,
    emissive: 0x14b8a6,
    emissiveIntensity: 0.58,
    metalness: 0.08,
    opacity: 1,
    roughness: 0.34,
    transparent: true,
  })
  const energyMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    depthWrite: false,
    transparent: true,
    opacity: 0.6,
    vertexColors: true,
  })
  const bench = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), sourceMaterial)
  const sourceBase = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), sourceMaterial)
  const sourceRod = new THREE.Mesh(
    new THREE.CylinderGeometry(0.026, 0.026, 1, 16),
    metalMaterial,
  )
  const leftSupport = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), metalMaterial)
  const rightSupport = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), metalMaterial)
  const beads = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, 12, 8),
    tealMaterial,
    waveBeadCapacity,
  )
  const energyPackets = new THREE.InstancedMesh(
    new THREE.SphereGeometry(1, 10, 6),
    energyMaterial,
    waveEnergyPacketCapacity,
  )
  const equilibrium = createDynamicTwoPointLine(0xe6e8ec, 0.34)
  const amplitude = createDynamicTwoPointLine(0xa3e635, 0.9)
  const wavelength = createDynamicTwoPointLine(0x818cf8, 0.86)
  const probeGuide = createDynamicTwoPointLine(0xe6e8ec, 0.34)
  const historyLines = Array.from({ length: waveHistoryLineCount }, (_, index) => {
    const positions = new Float32Array(waveStringPointCapacity * 3)
    const positionAttribute = new THREE.BufferAttribute(positions, 3)
    const line = createDynamicWaveLine(
      positionAttribute,
      0x2dd4bf,
      clamp(0.28 - index * 0.032, 0.06, 0.24),
    )

    line.visible = false

    return {
      line,
      positionAttribute,
      positions,
    }
  })
  const sourceLabel = createSceneTextSprite('Fonte oscilante', {
    background: 'rgba(15, 17, 21, 0.76)',
    color: '#2DD4BF',
    fontSize: 34,
    minWidthPx: 380,
    scale: 0.16,
  })
  const probeLabel = createSceneTextSprite('Ponto da corda', {
    background: 'rgba(15, 17, 21, 0.76)',
    color: '#E6E8EC',
    fontSize: 32,
    minWidthPx: 420,
    scale: 0.15,
  })
  const amplitudeLabel = createSceneTextSprite('A', {
    background: 'rgba(15, 17, 21, 0.72)',
    color: '#A3E635',
    fontSize: 32,
    minWidthPx: 180,
    scale: 0.13,
  })
  const wavelengthLabel = createSceneTextSprite('lambda', {
    background: 'rgba(15, 17, 21, 0.72)',
    color: '#A5B4FC',
    fontSize: 32,
    minWidthPx: 280,
    scale: 0.13,
  })

  sourceRod.rotation.x = Math.PI / 2
  beads.frustumCulled = false
  beads.renderOrder = 20
  energyPackets.frustumCulled = false
  energyPackets.renderOrder = 18
  ;[
    bench,
    sourceBase,
    sourceRod,
    leftSupport,
    rightSupport,
    beads,
    energyPackets,
    equilibrium.line,
    amplitude.line,
    wavelength.line,
    probeGuide.line,
    sourceLabel,
    probeLabel,
    amplitudeLabel,
    wavelengthLabel,
    ...historyLines.map((historyLine) => historyLine.line),
  ].forEach((object) => {
    object.visible = false
    group.add(object)
  })

  return {
    amplitudeLabel,
    amplitudeMarker: amplitude.line,
    amplitudeMarkerPositionAttribute: amplitude.positionAttribute,
    amplitudeMarkerPositions: amplitude.positions,
    beads,
    bench,
    energyPackets,
    equilibriumLine: equilibrium.line,
    equilibriumPositionAttribute: equilibrium.positionAttribute,
    equilibriumPositions: equilibrium.positions,
    group,
    historyLines,
    instanceHelper: new THREE.Object3D(),
    leftSupport,
    probeGuide: probeGuide.line,
    probeGuidePositionAttribute: probeGuide.positionAttribute,
    probeGuidePositions: probeGuide.positions,
    probeLabel,
    rightSupport,
    sourceBase,
    sourceLabel,
    sourceRod,
    wavelengthLabel,
    wavelengthMarker: wavelength.line,
    wavelengthMarkerPositionAttribute: wavelength.positionAttribute,
    wavelengthMarkerPositions: wavelength.positions,
  }
}

function createDynamicTwoPointLine(color: number, opacity: number) {
  const positions = new Float32Array(6)
  const positionAttribute = new THREE.BufferAttribute(positions, 3)
  const line = createDynamicWaveLine(positionAttribute, color, opacity)

  line.geometry.setDrawRange(0, 2)

  return {
    line,
    positionAttribute,
    positions,
  }
}

function updateWaveLabObjects({
  objects,
  parameters,
  profile,
  sample,
  showEnergy,
  showTrace,
  showVectors,
  simulationId,
}: {
  objects: SceneObjects
  parameters: KinematicsParameters
  profile: MechanicalWaveProfilePoint[]
  sample: KinematicsSample
  showEnergy: boolean
  showTrace: boolean
  showVectors: boolean
  simulationId: WaveProfileSimulationId
}) {
  const lab = objects.waveLab
  const firstPoint = profile[0]
  const lastPoint = profile.at(-1)
  const isSoundWave = isSoundWaveSimulation(simulationId)

  if (!firstPoint || !lastPoint) {
    return
  }

  const waveParameters =
    simulationId === 'wave-on-string'
      ? (parameters as WaveOnStringParameters)
      : null
  const scale = objects.sceneProjection.positionScale
  const stringLengthScene = Math.max(1, lastPoint.xMeters - firstPoint.xMeters) * scale
  const amplitudeScene = isSoundWave
    ? getSoundWaveFieldBaseRadiusScene(simulationId)
    : Math.max(0.18, Math.abs(sample.primaryRadiusMeters) * scale)
  const supportHeight = isSoundWave
    ? 1.04
    : Math.max(0.74, amplitudeScene * 2.25 + 0.38)
  const leftX = firstPoint.xMeters * scale
  const rightX = lastPoint.xMeters * scale
  const soundAxisStart = toSoundWaveFieldScenePointForSimulation(
    simulationId,
    objects,
    firstPoint.xMeters,
    0,
    0,
  )
  const soundAxisEnd = toSoundWaveFieldScenePointForSimulation(
    simulationId,
    objects,
    lastPoint.xMeters,
    0,
    0,
  )
  const sourceBasePosition = toSoundWaveFieldScenePointForSimulation(
    simulationId,
    objects,
    sample.secondaryXMeters,
    -0.3,
    -0.2,
  )

  lab.bench.visible = false
  lab.bench.position.set(0, 0.18, -0.18)
  lab.bench.scale.set(stringLengthScene + 1.25, 0.52, 0.055)
  lab.leftSupport.visible = !isSoundWave
  lab.leftSupport.position.set(leftX, 0, supportHeight / 2 - 0.2)
  lab.leftSupport.scale.set(0.075, 0.075, supportHeight)
  lab.rightSupport.visible = !isSoundWave
  lab.rightSupport.position.set(rightX, 0, supportHeight / 2 - 0.2)
  lab.rightSupport.scale.set(0.075, 0.075, supportHeight)
  lab.sourceBase.visible = simulationId === 'doppler-effect'
  lab.sourceBase.position.copy(sourceBasePosition)
  lab.sourceBase.scale.set(0.5, 0.28, 0.22)

  lab.sourceRod.visible = false
  lab.sourceRod.position.set(leftX, -0.18, 0)
  lab.sourceRod.scale.set(1, 0.08, 1)

  updateTwoPointLine(
    lab.equilibriumPositions,
    lab.equilibriumPositionAttribute,
    lab.equilibriumLine,
    isSoundWave
      ? soundAxisStart.clone().add(new THREE.Vector3(0, 0, 0.015))
      : new THREE.Vector3(leftX, 0.015, 0),
    isSoundWave
      ? soundAxisEnd.clone().add(new THREE.Vector3(0, 0, 0.015))
      : new THREE.Vector3(rightX, 0.015, 0),
    true,
  )
  updateWaveBeads(lab, profile, objects, simulationId, waveParameters, sample)
  if (simulationId === 'doppler-effect') {
    updateDopplerWavefrontMarkers({ lab, objects, profile, sample })
  } else {
    updateWaveEnergyPackets({
      lab,
      objects,
      profile,
      sample,
      showEnergy: showEnergy && simulationId === 'wave-on-string',
    })
  }
  updateWaveHistory({
    lab,
    objects,
    parameters,
    sample,
    showTrace: showTrace && simulationId === 'wave-on-string',
    simulationId,
  })
  updateWaveMeasurements({
    lab,
    objects,
    profile,
    sample,
    showVectors,
    simulationId,
  })
  updateWaveProbeGuide({
    lab,
    objects,
    sample,
    showVectors,
    simulationId,
  })

  lab.sourceLabel.visible =
    simulationId === 'beats' ||
    simulationId === 'doppler-effect' ||
    simulationId === 'wave-on-string'
  lab.sourceLabel.position.copy(
    simulationId === 'doppler-effect'
      ? toSoundWaveFieldScenePointForSimulation(
          simulationId,
          objects,
          sample.secondaryXMeters,
          -0.34,
          supportHeight + 0.18,
        )
      : new THREE.Vector3(leftX - 0.22, -0.34, supportHeight + 0.18),
  )
  updateSceneTextSprite(lab.sourceLabel, buildWaveSourceLabel(simulationId, sample))
  lab.probeLabel.visible = showVectors || simulationId === 'doppler-effect'
  const probeLabelBase = isSoundWave
    ? toSoundWaveFieldScenePointForSimulation(
        simulationId,
        objects,
        sample.xMeters,
        0,
        0,
      )
    : toWaveScenePoint(objects, sample.xMeters, sample.zMeters, 0.16)
  lab.probeLabel.position.copy(
    probeLabelBase.add(new THREE.Vector3(0.15, 0, 0.24)),
  )
  updateSceneTextSprite(
    lab.probeLabel,
    buildWaveProbeLabel(
      simulationId,
      sample,
      lastPoint.xMeters - firstPoint.xMeters,
    ),
  )
}

function buildWaveSourceLabel(
  simulationId: WaveProfileSimulationId,
  sample: KinematicsSample,
) {
  if (simulationId === 'beats') {
    return `Batimento df=${formatSceneNumber(sample.frequencyHertz)} Hz`
  }

  if (simulationId === 'doppler-effect') {
    return `Fonte f=${formatSceneNumber(sample.secondarySpeedMetersPerSecond)} Hz`
  }

  return `Fonte f=${formatSceneNumber(sample.frequencyHertz)} Hz A=${formatSceneNumber(
    sample.primaryRadiusMeters,
  )} m`
}

function buildWaveProbeLabel(
  simulationId: WaveProfileSimulationId,
  sample: KinematicsSample,
  profileLengthMeters: number,
) {
  const probePositionMeters = sample.xMeters + profileLengthMeters / 2

  if (simulationId === 'beats') {
    return `Probe x=${formatSceneNumber(probePositionMeters)} m p=${formatSceneNumber(
      sample.pressurePascals,
    )} Pa`
  }

  if (simulationId === 'doppler-effect') {
    return `Observador f'=${formatSceneNumber(sample.frequencyHertz)} Hz p=${formatSceneNumber(
      sample.pressurePascals,
    )} Pa`
  }

  return `Ponto x=${formatSceneNumber(probePositionMeters)} m y=${formatSceneNumber(
    sample.positionMeters,
  )} m`
}

function updateWaveBeads(
  lab: WaveLabObjects,
  profile: MechanicalWaveProfilePoint[],
  objects: SceneObjects,
  simulationId: KinematicsSimulationId,
  waveParameters: WaveOnStringParameters | null,
  sample: KinematicsSample,
) {
  const material = lab.beads.material as THREE.MeshStandardMaterial
  const isSoundWave = isSoundWaveSimulation(simulationId)

  material.color.setHex(isSoundWave ? 0xffffff : 0x5eead4)
  material.depthTest = isSoundWave
  material.depthWrite = false
  material.emissive.setHex(isSoundWave ? 0x0b3a43 : 0x14b8a6)
  material.emissiveIntensity =
    simulationId === 'doppler-effect' ? 0.62 : isSoundWave ? 0.46 : 0.58
  material.opacity =
    simulationId === 'doppler-effect' ? 0.94 : isSoundWave ? 0.82 : 1
  material.transparent = true
  material.needsUpdate = true

  if (isSoundWave) {
    updateSoundWaveFieldBeads(lab, profile, objects, simulationId, sample)
    return
  }

  const helper = lab.instanceHelper
  const densityScale = waveParameters
    ? clamp(waveParameters.linearDensityKilogramsPerMeter / 0.025, 0.72, 1.7)
    : 1
  const beadRadius = clamp(0.018 * Math.sqrt(densityScale), 0.014, 0.03)
  const beadColor = new THREE.Color(0x5eead4)

  lab.beads.visible = true
  lab.beads.count = waveStringBeadCount

  for (let index = 0; index < waveStringBeadCount; index += 1) {
    const ratio = index / (waveStringBeadCount - 1)
    const point = readProfilePointAtRatio(profile, ratio)

    helper.position.copy(toWaveScenePoint(objects, point.xMeters, point.zMeters, 0))
    helper.scale.setScalar(beadRadius)
    helper.updateMatrix()
    lab.beads.setMatrixAt(index, helper.matrix)
    lab.beads.setColorAt(index, beadColor)
  }

  lab.beads.instanceMatrix.needsUpdate = true

  if (lab.beads.instanceColor) {
    lab.beads.instanceColor.needsUpdate = true
  }
}

function updateSoundWaveFieldBeads(
  lab: WaveLabObjects,
  profile: MechanicalWaveProfilePoint[],
  objects: SceneObjects,
  simulationId: KinematicsSimulationId,
  sample: KinematicsSample,
) {
  const helper = lab.instanceHelper
  const maxPressure = findSoundProfileMaxPressure(profile)
  const baseRadius = getSoundWaveFieldBaseRadiusScene(simulationId)
  const isDoppler = simulationId === 'doppler-effect'
  const radialPressureScale = isDoppler ? 0.34 : 0.18
  const neutralColor = new THREE.Color(0xa7fff3)
  const compressionColor = new THREE.Color(0x22d3ee)
  const rarefactionColor = new THREE.Color(0xfacc15)
  const beadColor = new THREE.Color()
  const sceneScale = Math.max(objects.sceneProjection.positionScale, 1e-6)
  const columnCount = isDoppler
    ? dopplerSoundWaveFieldColumnCount
    : soundWaveFieldColumnCount
  const ringCount = isDoppler
    ? dopplerSoundWaveFieldRingCount
    : soundWaveFieldRingCount

  lab.beads.visible = true
  lab.beads.count = columnCount * ringCount

  for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
    const profileRatio = columnIndex / (columnCount - 1)
    const point = readProfilePointAtRatio(profile, profileRatio)
    const pressureRatio =
      maxPressure > 1e-9 ? clamp(point.zMeters / maxPressure, -1, 1) : 0
    const envelopeRatio =
      maxPressure > 1e-9
        ? clamp(Math.abs(point.envelopeMeters) / maxPressure, 0, 1)
        : 0
    const absolutePressureRatio = Math.abs(pressureRatio)
    const localDoppler = isDoppler
      ? readDopplerLocalWavefront({
          pointXMeters: point.xMeters,
          sample,
        })
      : null
    const compressionGain = localDoppler
      ? lerp(0.78, 1.38, localDoppler.compressionVisualRatio)
      : 1
    const fieldRadius = clamp(
      baseRadius +
        pressureRatio * radialPressureScale * compressionGain +
        envelopeRatio * (isDoppler ? 0.096 : 0.045) +
        (localDoppler ? (compressionGain - 1) * 0.07 : 0),
      baseRadius * 0.58,
      baseRadius * (isDoppler ? 2.05 : 1.62),
    )

    for (let ringIndex = 0; ringIndex < ringCount; ringIndex += 1) {
      const instanceIndex =
        columnIndex * ringCount + ringIndex
      const ringRatio = ringIndex / ringCount
      const angle =
        ringRatio * Math.PI * 2 +
        columnIndex * 0.24 +
        pressureRatio * 0.22
      const ringWobble =
        1 + Math.sin(columnIndex * 0.41 + ringIndex * 1.7) * 0.045
      const radialYScene = Math.cos(angle) * fieldRadius * ringWobble
      const radialZScene =
        Math.sin(angle) * fieldRadius * (isDoppler ? 0.92 : 0.68) * ringWobble
      const xJitterMeters =
        (Math.sin(angle * 2.4 + columnIndex * 0.31) *
          (isDoppler ? 0.012 : 0.018)) /
        sceneScale
      const compressionBias = localDoppler
        ? localDoppler.compressionVisualRatio
        : clamp((pressureRatio + 1) / 2, 0, 1)
      const beadRadius = clamp(
        (isDoppler ? 0.013 : 0.012) +
          absolutePressureRatio * (isDoppler ? 0.014 : 0.01) +
          compressionBias * (isDoppler ? 0.011 : 0.004),
        isDoppler ? 0.012 : 0.011,
        isDoppler ? 0.038 : 0.028,
      )

      helper.position.copy(
        toSoundWaveFieldScenePointForSimulation(
          simulationId,
          objects,
          point.xMeters + xJitterMeters,
          radialYScene,
          radialZScene,
        ),
      )
      helper.scale.setScalar(beadRadius)
      helper.updateMatrix()
      lab.beads.setMatrixAt(instanceIndex, helper.matrix)

      if (pressureRatio >= 0) {
        beadColor
          .copy(neutralColor)
          .lerp(
            compressionColor,
            clamp(
              pressureRatio + (localDoppler?.compressionVisualRatio ?? 0) * 0.18,
              0,
              1,
            ),
          )
      } else {
        beadColor
          .copy(neutralColor)
          .lerp(rarefactionColor, clamp(-pressureRatio * 0.86, 0, 1))
      }

      lab.beads.setColorAt(instanceIndex, beadColor)
    }
  }

  lab.beads.instanceMatrix.needsUpdate = true

  if (lab.beads.instanceColor) {
    lab.beads.instanceColor.needsUpdate = true
  }
}

function findSoundProfileMaxPressure(profile: MechanicalWaveProfilePoint[]) {
  return profile.reduce(
    (maxPressure, point) =>
      Math.max(
        maxPressure,
        Math.abs(point.componentOneMeters),
        Math.abs(point.componentTwoMeters),
        Math.abs(point.envelopeMeters),
        Math.abs(point.zMeters),
      ),
    0,
  )
}

function getSoundWaveFieldBaseRadiusScene(
  simulationId: KinematicsSimulationId,
) {
  return simulationId === 'doppler-effect' ? 0.56 : 0.32
}

function readDopplerLocalWavefront({
  pointXMeters,
  sample,
}: {
  pointXMeters: number
  sample: KinematicsSample
}) {
  const emittedFrequencyHertz = sample.secondarySpeedMetersPerSecond
  const mediumSpeedMetersPerSecond = sample.speedMetersPerSecond
  const sourceSpeedMetersPerSecond =
    sample.secondaryVelocityXMetersPerSecond

  if (
    emittedFrequencyHertz <= 0 ||
    mediumSpeedMetersPerSecond <= 0 ||
    !Number.isFinite(sourceSpeedMetersPerSecond)
  ) {
    return {
      compressionVisualRatio: 0,
      wavelengthMeters: 0,
    }
  }

  const sideSign =
    Math.sign(pointXMeters - sample.secondaryXMeters) ||
    Math.sign(sample.xMeters - sample.secondaryXMeters) ||
    1
  const emittedWavelengthMeters =
    sample.forceOneNewtons > 0
      ? sample.forceOneNewtons
      : mediumSpeedMetersPerSecond / emittedFrequencyHertz
  const apparentWaveSpeedMetersPerSecond =
    mediumSpeedMetersPerSecond - sourceSpeedMetersPerSecond * sideSign
  const wavelengthMeters = Math.max(
    0.01,
    apparentWaveSpeedMetersPerSecond / emittedFrequencyHertz,
  )
  const compressionRatio = clamp(
    emittedWavelengthMeters / wavelengthMeters,
    0.58,
    1.95,
  )

  return {
    compressionVisualRatio: clamp((compressionRatio - 0.58) / 1.37, 0, 1),
    wavelengthMeters,
  }
}

function updateDopplerWavefrontMarkers({
  lab,
  objects,
  profile,
  sample,
}: {
  lab: WaveLabObjects
  objects: SceneObjects
  profile: MechanicalWaveProfilePoint[]
  sample: KinematicsSample
}) {
  const firstPoint = profile[0]
  const lastPoint = profile.at(-1)
  const emittedFrequencyHertz = sample.secondarySpeedMetersPerSecond

  if (
    !firstPoint ||
    !lastPoint ||
    emittedFrequencyHertz <= 0 ||
    sample.primaryRadiusMeters <= 0
  ) {
    lab.energyPackets.visible = false
    lab.energyPackets.count = 0
    return
  }

  const helper = lab.instanceHelper
  const material = lab.energyPackets.material as THREE.MeshBasicMaterial
  const baseRadius = getSoundWaveFieldBaseRadiusScene('doppler-effect')
  const crestColor = new THREE.Color()
  const compressionColor = new THREE.Color(0x22d3ee)
  const stretchColor = new THREE.Color(0xfacc15)
  const neutralColor = new THREE.Color(0xa7fff3)
  const ringsPerFront = 3

  material.color.setHex(0xffffff)
  material.opacity = 0.68
  material.needsUpdate = true
  lab.energyPackets.visible = true
  lab.energyPackets.count = dopplerWavefrontMarkerCount

  for (let index = 0; index < dopplerWavefrontMarkerCount; index += 1) {
    const sideSlot = Math.floor(index / ringsPerFront)
    const sideSign = sideSlot % 2 === 0 ? 1 : -1
    const crestIndex = Math.floor(sideSlot / 2) + 1
    const wavefront = readDopplerLocalWavefront({
      pointXMeters: sample.secondaryXMeters + sideSign,
      sample,
    })
    const xMeters =
      sample.secondaryXMeters + sideSign * wavefront.wavelengthMeters * crestIndex
    const isInsideMedium =
      xMeters >= firstPoint.xMeters - 1e-6 && xMeters <= lastPoint.xMeters + 1e-6

    if (!isInsideMedium || wavefront.wavelengthMeters <= 0) {
      helper.position.set(0, 0, 0)
      helper.scale.setScalar(0.0001)
      helper.updateMatrix()
      lab.energyPackets.setMatrixAt(index, helper.matrix)
      lab.energyPackets.setColorAt(index, neutralColor)
      continue
    }

    const ringIndex = index % ringsPerFront
    const angle =
      (ringIndex / ringsPerFront) * Math.PI * 2 +
      crestIndex * 0.52 +
      sample.timeSeconds * 0.42
    const radial = baseRadius * (0.48 + ringIndex * 0.23)
    const compressionVisualRatio = wavefront.compressionVisualRatio
    const markerRadius = clamp(
      0.03 + compressionVisualRatio * 0.035,
      0.028,
      0.07,
    )

    helper.position.copy(
      toSoundWaveFieldScenePointForSimulation(
        'doppler-effect',
        objects,
        xMeters,
        Math.cos(angle) * radial,
        Math.sin(angle) * radial * 0.7,
      ),
    )
    helper.scale.setScalar(markerRadius)
    helper.updateMatrix()
    lab.energyPackets.setMatrixAt(index, helper.matrix)

    crestColor
      .copy(neutralColor)
      .lerp(
        compressionVisualRatio > 0.5 ? compressionColor : stretchColor,
        compressionVisualRatio > 0.5
          ? clamp((compressionVisualRatio - 0.5) * 1.8, 0, 1)
          : clamp((0.5 - compressionVisualRatio) * 1.4, 0, 1),
      )
    lab.energyPackets.setColorAt(index, crestColor)
  }

  lab.energyPackets.instanceMatrix.needsUpdate = true

  if (lab.energyPackets.instanceColor) {
    lab.energyPackets.instanceColor.needsUpdate = true
  }
}

function updateWaveEnergyPackets({
  lab,
  objects,
  profile,
  sample,
  showEnergy,
}: {
  lab: WaveLabObjects
  objects: SceneObjects
  profile: MechanicalWaveProfilePoint[]
  sample: KinematicsSample
  showEnergy: boolean
}) {
  lab.energyPackets.visible = showEnergy

  if (!showEnergy) {
    return
  }

  const helper = lab.instanceHelper
  const material = lab.energyPackets.material as THREE.MeshBasicMaterial
  const stringLengthMeters =
    profile.length > 1
      ? Math.max(0.1, profile[profile.length - 1].xMeters - profile[0].xMeters)
      : 1
  const speedRatio = stringLengthMeters > 0
    ? (sample.timeSeconds * Math.max(0, sample.speedMetersPerSecond)) /
      stringLengthMeters
    : 0
  const pulseRadius = clamp(
    0.012 + Math.abs(sample.primaryRadiusMeters) * 0.018,
    0.014,
    0.032,
  )

  material.opacity = clamp(0.12 + Math.abs(sample.primaryRadiusMeters) * 0.42, 0.12, 0.36)
  lab.energyPackets.count = waveEnergyPacketCount

  const packetColor = new THREE.Color(0xf59e0b)

  for (let index = 0; index < waveEnergyPacketCount; index += 1) {
    const ratio = positiveModulo(speedRatio + index / waveEnergyPacketCount, 1)
    const point = readProfilePointAtRatio(profile, ratio)

    helper.position.copy(
      toWaveScenePoint(objects, point.xMeters, point.zMeters, -0.12),
    )
    helper.scale.setScalar(pulseRadius)
    helper.updateMatrix()
    lab.energyPackets.setMatrixAt(index, helper.matrix)
    lab.energyPackets.setColorAt(index, packetColor)
  }

  lab.energyPackets.instanceMatrix.needsUpdate = true

  if (lab.energyPackets.instanceColor) {
    lab.energyPackets.instanceColor.needsUpdate = true
  }
}

function updateWaveHistory({
  lab,
  objects,
  parameters,
  sample,
  showTrace,
  simulationId,
}: {
  lab: WaveLabObjects
  objects: SceneObjects
  parameters: KinematicsParameters
  sample: KinematicsSample
  showTrace: boolean
  simulationId: WaveProfileSimulationId
}) {
  lab.historyLines.forEach((historyLine, index) => {
    const visible = showTrace && index > 0

    historyLine.line.visible = visible

    if (!visible) {
      historyLine.line.geometry.setDrawRange(0, 0)
      return
    }

    const lagSeconds = index * 0.14
    const profile = computeMechanicalWaveProfile(
      simulationId,
      parameters as WaveProfileParameters,
      Math.max(0, sample.timeSeconds - lagSeconds),
      waveStringPointCapacity,
    )

    profile.forEach((point, pointIndex) => {
      writeWavePoint(historyLine.positions, pointIndex, objects, {
        xMeters: point.xMeters,
        zMeters: point.zMeters,
      })
    })
    historyLine.line.geometry.setDrawRange(0, profile.length)
    historyLine.positionAttribute.needsUpdate = true
  })
}

function updateWaveMeasurements({
  lab,
  objects,
  profile,
  sample,
  showVectors,
  simulationId,
}: {
  lab: WaveLabObjects
  objects: SceneObjects
  profile: MechanicalWaveProfilePoint[]
  sample: KinematicsSample
  showVectors: boolean
  simulationId: KinematicsSimulationId
}) {
  const shouldShow = showVectors && simulationId === 'wave-on-string'
  const crest = findHighestWavePoint(profile)
  const amplitudeVisible = shouldShow && Math.abs(crest.zMeters) > 1e-4

  updateTwoPointLine(
    lab.amplitudeMarkerPositions,
    lab.amplitudeMarkerPositionAttribute,
    lab.amplitudeMarker,
    toWaveScenePoint(objects, crest.xMeters, 0, 0.06),
    toWaveScenePoint(objects, crest.xMeters, crest.zMeters, 0.06),
    amplitudeVisible,
  )
  lab.amplitudeLabel.visible = amplitudeVisible
  lab.amplitudeLabel.position.copy(
    toWaveScenePoint(objects, crest.xMeters, crest.zMeters / 2, 0.12),
  )
  updateSceneTextSprite(
    lab.amplitudeLabel,
    `A=${formatSceneNumber(sample.primaryRadiusMeters)} m`,
  )

  const wavelengthVisible =
    shouldShow && sample.secondaryRadiusMeters > 0 && profile.length > 1
  const wavelengthMeasure = wavelengthVisible
    ? findWavelengthMeasure(profile, sample.secondaryRadiusMeters)
    : null

  if (!wavelengthMeasure) {
    updateTwoPointLine(
      lab.wavelengthMarkerPositions,
      lab.wavelengthMarkerPositionAttribute,
      lab.wavelengthMarker,
      new THREE.Vector3(),
      new THREE.Vector3(),
      false,
    )
    lab.wavelengthLabel.visible = false
    return
  }

  const markerZ =
    Math.max(
      Math.abs(crest.zMeters),
      Math.abs(sample.primaryRadiusMeters),
      0.18,
    ) + 0.26 / Math.max(objects.sceneProjection.positionScale, 0.2)

  updateTwoPointLine(
    lab.wavelengthMarkerPositions,
    lab.wavelengthMarkerPositionAttribute,
    lab.wavelengthMarker,
    toWaveScenePoint(objects, wavelengthMeasure.startXMeters, markerZ, 0.08),
    toWaveScenePoint(objects, wavelengthMeasure.endXMeters, markerZ, 0.08),
    true,
  )
  lab.wavelengthLabel.visible = true
  lab.wavelengthLabel.position.copy(
    toWaveScenePoint(
      objects,
      (wavelengthMeasure.startXMeters + wavelengthMeasure.endXMeters) / 2,
      markerZ,
      0.12,
    ),
  )
  updateSceneTextSprite(
    lab.wavelengthLabel,
    `lambda=${formatSceneNumber(sample.secondaryRadiusMeters)} m`,
  )
}

function updateWaveProbeGuide({
  lab,
  objects,
  sample,
  showVectors,
  simulationId,
}: {
  lab: WaveLabObjects
  objects: SceneObjects
  sample: KinematicsSample
  showVectors: boolean
  simulationId: KinematicsSimulationId
}) {
  if (isSoundWaveSimulation(simulationId)) {
    const guideRadius = getSoundWaveFieldBaseRadiusScene(simulationId) * 1.35

    updateTwoPointLine(
      lab.probeGuidePositions,
      lab.probeGuidePositionAttribute,
      lab.probeGuide,
      toSoundWaveFieldScenePointForSimulation(
        simulationId,
        objects,
        sample.xMeters,
        0,
        -guideRadius,
      ),
      toSoundWaveFieldScenePointForSimulation(
        simulationId,
        objects,
        sample.xMeters,
        0,
        guideRadius,
      ),
      showVectors,
    )
    return
  }

  updateTwoPointLine(
    lab.probeGuidePositions,
    lab.probeGuidePositionAttribute,
    lab.probeGuide,
    toWaveScenePoint(objects, sample.xMeters, -sample.primaryRadiusMeters, 0.05),
    toWaveScenePoint(objects, sample.xMeters, sample.primaryRadiusMeters, 0.05),
    showVectors,
  )
}

function updateTwoPointLine(
  positions: Float32Array,
  positionAttribute: THREE.BufferAttribute,
  line: THREE.Line,
  start: THREE.Vector3,
  end: THREE.Vector3,
  visible: boolean,
) {
  line.visible = visible
  line.geometry.setDrawRange(0, visible ? 2 : 0)

  if (!visible) {
    return
  }

  writeVectorToPositions(positions, 0, start)
  writeVectorToPositions(positions, 1, end)
  positionAttribute.needsUpdate = true
}

function writeVectorToPositions(
  positions: Float32Array,
  index: number,
  point: THREE.Vector3,
) {
  const offset = index * 3

  positions[offset] = point.x
  positions[offset + 1] = point.y
  positions[offset + 2] = point.z
}

function toWaveScenePoint(
  objects: SceneObjects,
  xMeters: number,
  zMeters: number,
  depthMeters = 0,
) {
  const scale = objects.sceneProjection.positionScale

  if (objects.sceneProjection.horizontalPlane) {
    return new THREE.Vector3(xMeters * scale, zMeters * scale, depthMeters)
  }

  return new THREE.Vector3(xMeters * scale, depthMeters, zMeters * scale)
}

function toSoundWaveFieldScenePoint(
  objects: SceneObjects,
  xMeters: number,
  radialYScene: number,
  radialZScene: number,
) {
  const xScene = xMeters * objects.sceneProjection.positionScale

  if (objects.sceneProjection.horizontalPlane) {
    return new THREE.Vector3(xScene, radialZScene, radialYScene)
  }

  return new THREE.Vector3(xScene, radialYScene, radialZScene)
}

function toSoundWaveFieldScenePointForSimulation(
  simulationId: KinematicsSimulationId,
  objects: SceneObjects,
  xMeters: number,
  radialYScene: number,
  radialZScene: number,
) {
  if (simulationId === 'doppler-effect') {
    return toDopplerDiagonalScenePoint(
      objects.sceneProjection,
      xMeters,
      radialYScene,
      radialZScene,
    )
  }

  return toSoundWaveFieldScenePoint(
    objects,
    xMeters,
    radialYScene,
    radialZScene,
  )
}

function toDopplerDiagonalScenePoint(
  sceneProjection: KinematicsSceneProjection,
  xMeters: number,
  lateralScene = 0,
  verticalScene = 0,
) {
  const axisScene = xMeters * sceneProjection.positionScale
  const lateralOffset = lateralScene / Math.SQRT2

  return new THREE.Vector3(
    axisScene + lateralOffset,
    -axisScene + lateralOffset,
    verticalScene,
  )
}

function toDopplerDiagonalSceneDirection(vector: KinematicsVectorOverlay) {
  return new THREE.Vector3(
    vector.direction.x,
    -vector.direction.x,
    vector.direction.z,
  )
}

function readProfilePointAtRatio(
  profile: MechanicalWaveProfilePoint[],
  ratio: number,
) {
  const position = clamp(ratio, 0, 1) * (profile.length - 1)
  const leftIndex = Math.floor(position)
  const rightIndex = Math.min(profile.length - 1, leftIndex + 1)
  const blend = position - leftIndex
  const left = profile[leftIndex]
  const right = profile[rightIndex]

  if (!left || !right || left === right) {
    return left ?? profile[0]
  }

  return {
    componentOneMeters: lerp(
      left.componentOneMeters,
      right.componentOneMeters,
      blend,
    ),
    componentTwoMeters: lerp(
      left.componentTwoMeters,
      right.componentTwoMeters,
      blend,
    ),
    envelopeMeters: lerp(left.envelopeMeters, right.envelopeMeters, blend),
    xMeters: lerp(left.xMeters, right.xMeters, blend),
    zMeters: lerp(left.zMeters, right.zMeters, blend),
  }
}

function findHighestWavePoint(profile: MechanicalWaveProfilePoint[]) {
  return profile.reduce((highest, point) =>
    point.zMeters > highest.zMeters ? point : highest,
  )
}

function findWavelengthMeasure(
  profile: MechanicalWaveProfilePoint[],
  wavelengthMeters: number,
) {
  const firstPoint = profile[0]
  const lastPoint = profile.at(-1)

  if (!firstPoint || !lastPoint || wavelengthMeters <= 0) {
    return null
  }

  const crest = findHighestWavePoint(profile)
  const rightCandidate = crest.xMeters + wavelengthMeters

  if (rightCandidate <= lastPoint.xMeters) {
    return {
      endXMeters: rightCandidate,
      startXMeters: crest.xMeters,
    }
  }

  const leftCandidate = crest.xMeters - wavelengthMeters

  if (leftCandidate >= firstPoint.xMeters) {
    return {
      endXMeters: crest.xMeters,
      startXMeters: leftCandidate,
    }
  }

  return null
}

function createReferencePath(
  samples: KinematicsSample[],
  simulationId: KinematicsSimulationId,
  sceneProjection: KinematicsSceneProjection,
  workEnergyProfile: WorkEnergyTrackSceneProfile,
) {
  if (simulationId === 'rolling-without-slipping') {
    return new THREE.Group()
  }

  if (simulationId === 'atwood-machine') {
    return new THREE.Group()
  }

  if (simulationId === 'work-energy-track') {
    return createWorkEnergyTrackReference(workEnergyProfile)
  }

  if (simulationId === 'uniform-linear-motion') {
    return createUniformLinearMotionReferencePath(samples, sceneProjection)
  }

  if (simulationId === 'uniformly-accelerated-motion') {
    return createUniformlyAcceleratedMotionReferencePath(samples, sceneProjection)
  }

  if (isSingleSpringOscillatorSimulation(simulationId)) {
    return createMassSpringReferencePath(samples, sceneProjection)
  }

  if (simulationId === 'coupled-oscillators') {
    return createCoupledOscillatorReferencePath(samples, sceneProjection)
  }

  if (simulationId === 'hydrostatics-buoyancy') {
    return new THREE.Group()
  }

  if (simulationId === 'continuity-bernoulli') {
    return new THREE.Group()
  }

  if (simulationId === 'doppler-effect') {
    return createDopplerDiagonalReferencePath(samples, sceneProjection)
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

function createDopplerDiagonalReferencePath(
  samples: KinematicsSample[],
  sceneProjection: KinematicsSceneProjection,
) {
  const group = new THREE.Group()
  const pathMeters = samples.flatMap((sample) => [
    sample.xMeters,
    sample.secondaryXMeters,
  ]).filter(Number.isFinite)

  if (pathMeters.length === 0) {
    return group
  }

  const startMeters = Math.min(...pathMeters)
  const endMeters = Math.max(...pathMeters)
  const start = toDopplerDiagonalScenePoint(
    sceneProjection,
    startMeters,
    0,
    0.05,
  )
  const end = toDopplerDiagonalScenePoint(
    sceneProjection,
    endMeters,
    0,
    0.05,
  )
  const railOffset = 0.08

  group.add(createSceneLine(start, end, 0x2dd4bf, 0.48))
  group.add(
    createSceneLine(
      toDopplerDiagonalScenePoint(
        sceneProjection,
        startMeters,
        railOffset,
        0.065,
      ),
      toDopplerDiagonalScenePoint(
        sceneProjection,
        endMeters,
        railOffset,
        0.065,
      ),
      0x38bdf8,
      0.34,
    ),
  )
  group.add(
    createSceneLine(
      toDopplerDiagonalScenePoint(
        sceneProjection,
        startMeters,
        -railOffset,
        0.065,
      ),
      toDopplerDiagonalScenePoint(
        sceneProjection,
        endMeters,
        -railOffset,
        0.065,
      ),
      0x38bdf8,
      0.34,
    ),
  )

  return group
}

function createUniformLinearMotionReferencePath(
  samples: KinematicsSample[],
  sceneProjection: KinematicsSceneProjection,
) {
  const group = new THREE.Group()
  const firstSample = samples[0]

  if (!firstSample) {
    return group
  }

  const scale = sceneProjection.positionScale
  const range = getUniformLinearMotionTrackRange(samples)
  const minX = range.minMeters * scale
  const maxX = range.maxMeters * scale
  const trackLength = Math.max(0.1, maxX - minX)
  const trackCenterX = (minX + maxX) / 2
  const trackMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f766e,
    emissive: 0x0f766e,
    emissiveIntensity: 0.48,
    metalness: 0.18,
    roughness: 0.36,
  })
  const track = new THREE.Mesh(
    new THREE.BoxGeometry(trackLength, 0.26, 0.04),
    trackMaterial,
  )

  track.position.set(trackCenterX, 0, 0.028)
  group.add(track)
  group.add(
    createSceneLine(
      new THREE.Vector3(minX, -0.19, 0.075),
      new THREE.Vector3(maxX, -0.19, 0.075),
      0x38bdf8,
      0.48,
    ),
  )
  group.add(
    createSceneLine(
      new THREE.Vector3(minX, 0.19, 0.075),
      new THREE.Vector3(maxX, 0.19, 0.075),
      0x2dd4bf,
      0.58,
    ),
  )

  const tickMaterial = new THREE.MeshBasicMaterial({
    color: 0xe6e8ec,
    transparent: true,
    opacity: 0.72,
  })
  const firstTickMeters =
    Math.ceil(range.minMeters / range.tickStepMeters) * range.tickStepMeters

  for (
    let meters = firstTickMeters;
    meters <= range.maxMeters + 1e-9;
    meters += range.tickStepMeters
  ) {
    const isOrigin = Math.abs(meters) < 1e-9
    const tick = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, isOrigin ? 0.62 : 0.42, 0.026),
      tickMaterial,
    )

    tick.position.set(meters * scale, 0, 0.09)
    group.add(tick)

    const label = createSceneTextSprite(`${formatSceneNumber(meters)} m`, {
      background: 'rgba(15, 17, 21, 0.58)',
      color: isOrigin ? '#2DD4BF' : '#CBD5E1',
      scale: 0.14,
    })

    label.position.set(meters * scale, -0.48, 0.21)
    group.add(label)
  }

  const startX = firstSample.positionMeters * scale
  const startMarker = new THREE.Mesh(
    new THREE.TorusGeometry(0.17, 0.012, 8, 48),
    new THREE.MeshBasicMaterial({
      color: 0xa3e635,
      depthWrite: false,
      transparent: true,
      opacity: 0.94,
    }),
  )
  const startPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 0.42, 10),
    new THREE.MeshBasicMaterial({
      color: 0xa3e635,
      transparent: true,
      opacity: 0.8,
    }),
  )
  const startLabel = createSceneTextSprite('s0', {
    background: 'rgba(15, 17, 21, 0.68)',
    color: '#A3E635',
    scale: 0.18,
  })

  startMarker.position.set(startX, 0, 0.098)
  startPole.rotation.x = Math.PI / 2
  startPole.position.set(startX, 0.28, 0.31)
  startLabel.position.set(startX, 0.44, 0.58)
  group.add(startMarker)
  group.add(startPole)
  group.add(startLabel)

  const ghostMaterial = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    depthWrite: false,
    emissive: 0x083344,
    emissiveIntensity: 0.36,
    metalness: 0.04,
    opacity: 0.24,
    roughness: 0.48,
    transparent: true,
  })

  selectUniformLinearMotionStrobeSamples(samples, 20).forEach(
    (sample, index) => {
      if (sample.timeSeconds < 0.5) {
        return
      }

      const ghost = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 18, 12),
        ghostMaterial,
      )
      const label = createSceneTextSprite(
        `t=${formatSceneNumber(sample.timeSeconds)}s`,
        {
          background: 'rgba(15, 17, 21, 0.62)',
          color: '#93C5FD',
          scale: 0.135,
        },
      )
      const labelYOffset = index % 2 === 0 ? 0.34 : 0.58

      ghost.position.set(sample.positionMeters * scale, 0, 0.22)
      label.position.set(sample.positionMeters * scale, labelYOffset, 0.44)
      group.add(ghost)
      group.add(label)
    },
  )

  const accelerationLabel = createSceneTextSprite('a = 0 m/s^2', {
    background: 'rgba(15, 17, 21, 0.68)',
    color: '#FDBA74',
    scale: 0.16,
  })

  accelerationLabel.position.set(maxX, 0.56, 0.38)
  group.add(accelerationLabel)

  return group
}

function createUniformlyAcceleratedMotionReferencePath(
  samples: KinematicsSample[],
  sceneProjection: KinematicsSceneProjection,
) {
  const group = new THREE.Group()
  const firstSample = samples[0]

  if (!firstSample) {
    return group
  }

  const scale = sceneProjection.positionScale
  const range = getUniformlyAcceleratedMotionTowerRange(samples)
  const minZ = range.minMeters * scale
  const maxZ = range.maxMeters * scale
  const towerHeight = Math.max(0.1, maxZ - minZ)
  const rulerX = -0.72
  const rulerY = -0.36
  const tickStartMeters =
    Math.ceil(range.minMeters / range.tickStepMeters) *
    range.tickStepMeters
  const platformSize = clamp(towerHeight * 0.26, 1.7, 4.2)
  const platform = new THREE.Mesh(
    new THREE.BoxGeometry(platformSize, platformSize, 0.055),
    new THREE.MeshStandardMaterial({
      color: 0x20242d,
      emissive: 0x071016,
      emissiveIntensity: 0.18,
      metalness: 0.16,
      roughness: 0.52,
    }),
  )

  platform.position.set(0, 0, -0.028)
  group.add(platform)

  const impactZone = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.018, 8, 72),
    new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      depthWrite: false,
      opacity: 0.62,
      transparent: true,
    }),
  )

  impactZone.position.set(0, 0, 0.048)
  group.add(impactZone)

  const towerMaterial = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    emissive: 0x0f172a,
    emissiveIntensity: 0.24,
    metalness: 0.18,
    opacity: 0.82,
    roughness: 0.42,
    transparent: true,
  })
  const tower = new THREE.Mesh(
    new THREE.BoxGeometry(0.035, 0.05, towerHeight),
    towerMaterial,
  )

  tower.position.set(rulerX, rulerY, (minZ + maxZ) / 2)
  group.add(tower)
  group.add(
    createSceneLine(
      new THREE.Vector3(0, 0, Math.max(0, minZ)),
      new THREE.Vector3(0, 0, maxZ),
      0x2dd4bf,
      0.52,
    ),
  )

  const tickMaterial = new THREE.MeshBasicMaterial({
    color: 0xe6e8ec,
    opacity: 0.76,
    transparent: true,
  })

  for (
    let meters = tickStartMeters;
    meters <= range.maxMeters + 1e-9;
    meters += range.tickStepMeters
  ) {
    const isGround = Math.abs(meters) < 1e-9
    const tickZ = meters * scale
    const tick = new THREE.Mesh(
      new THREE.BoxGeometry(isGround ? 0.34 : 0.24, 0.026, 0.018),
      tickMaterial,
    )
    const label = createSceneTextSprite(`${formatSceneNumber(meters)} m`, {
      background: 'rgba(15, 17, 21, 0.58)',
      color: isGround ? '#2DD4BF' : '#CBD5E1',
      scale: 0.135,
    })

    tick.position.set(rulerX + 0.1, rulerY, tickZ)
    label.position.set(rulerX - 0.32, rulerY, tickZ)
    group.add(tick)
    group.add(label)
  }

  const towerLabel = createSceneTextSprite('torre z (m)', {
    background: 'rgba(15, 17, 21, 0.68)',
    color: '#E6E8EC',
    scale: 0.15,
  })

  towerLabel.position.set(rulerX, rulerY, maxZ + 0.34)
  group.add(towerLabel)

  const initialMarker = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.012, 8, 48),
    new THREE.MeshBasicMaterial({
      color: 0xa3e635,
      depthWrite: false,
      opacity: 0.92,
      transparent: true,
    }),
  )
  const initialZ = firstSample.zMeters * scale
  const initialLabel = createSceneTextSprite('z0', {
    background: 'rgba(15, 17, 21, 0.68)',
    color: '#A3E635',
    scale: 0.17,
  })

  initialMarker.position.set(0, 0, initialZ + 0.02)
  initialLabel.position.set(0.42, -0.24, initialZ + 0.28)
  group.add(initialMarker)
  group.add(initialLabel)

  selectUniformlyAcceleratedMotionStrobeSamples(samples, 12).forEach(
    (sample, index, strobeSamples) => {
      const ratio =
        strobeSamples.length <= 1 ? 0 : index / (strobeSamples.length - 1)
      const ghost = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 20, 14),
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          depthWrite: false,
          emissive: 0x082f49,
          emissiveIntensity: 0.32 + ratio * 0.24,
          metalness: 0.08,
          opacity: 0.22 + ratio * 0.34,
          roughness: 0.42,
          transparent: true,
        }),
      )
      const label = createSceneTextSprite(
        `t=${formatSceneNumber(sample.timeSeconds)}s`,
        {
          background: 'rgba(15, 17, 21, 0.62)',
          color: sample.isGrounded ? '#2DD4BF' : '#93C5FD',
          scale: 0.13,
        },
      )
      const labelX = index % 2 === 0 ? 0.56 : -0.44
      const labelY = index % 2 === 0 ? 0.26 : 0.36

      ghost.position.set(0, 0, sample.zMeters * scale + 0.12)
      label.position.set(labelX, labelY, sample.zMeters * scale + 0.28)
      group.add(ghost)
      group.add(label)
    },
  )

  const accelerationCue = createSceneTextSprite(
    `a constante = ${formatSceneDynamicNumber(
      firstSample.accelerationZMetersPerSecondSquared,
    )} m/s^2`,
    {
      background: 'rgba(15, 17, 21, 0.68)',
      color: '#FDBA74',
      scale: 0.15,
    },
  )

  accelerationCue.position.set(0.68, -0.34, Math.max(0.34, maxZ * 0.38))
  group.add(accelerationCue)

  return group
}

function addRollingWheelHoleMarkers({
  body,
  visible,
  wheelDepth,
  wheelRadius,
}: {
  body: THREE.Mesh
  visible: boolean
  wheelDepth: number
  wheelRadius: number
}) {
  const holeRadius = clamp(wheelRadius * 0.26, 0.055, 0.16)
  const radialOffset = wheelRadius * 0.58
  const hole = new THREE.Mesh(
    new THREE.CylinderGeometry(
      holeRadius,
      holeRadius,
      wheelDepth + 0.018,
      28,
    ),
    new THREE.MeshStandardMaterial({
      color: 0x05070a,
      metalness: 0.02,
      roughness: 0.82,
    }),
  )

  hole.position.set(radialOffset, 0, 0)
  hole.renderOrder = 3
  hole.visible = visible
  body.add(hole)
}

function configureRollingPlaneReference({
  plane,
  planeEdges,
  samples,
  sceneProjection,
  visible,
  wheelRadius,
}: {
  plane: THREE.Mesh
  planeEdges: THREE.LineSegments
  samples: KinematicsSample[]
  sceneProjection: KinematicsSceneProjection
  visible: boolean
  wheelRadius: number
}) {
  const firstSample = samples[0]
  const lastSample = samples.at(-1)

  plane.visible = visible
  planeEdges.visible = visible

  if (!visible || !firstSample || !lastSample) {
    return
  }

  const startSurface = getRollingTrackSurfacePosition(
    firstSample,
    sceneProjection,
  )
  const endSurface = getRollingTrackSurfacePosition(lastSample, sceneProjection)
  const trackDelta = endSurface.clone().sub(startSurface)
  const trackLength = Math.max(0.1, trackDelta.length())
  const trackPitchRadians =
    trackDelta.lengthSq() > 0.000001
      ? Math.atan2(-trackDelta.z, trackDelta.x)
      : 0
  const trackNormal = new THREE.Vector3(
    Math.sin(trackPitchRadians),
    0,
    Math.cos(trackPitchRadians),
  )
  const thickness = clamp(wheelRadius * 0.2, 0.045, 0.14)
  const width = Math.max(rollingPlaneMinimumWidth, wheelRadius * 3.25)
  const surfaceCenter = startSurface.clone().add(endSurface).multiplyScalar(0.5)
  const planeCenter = surfaceCenter.addScaledVector(trackNormal, -thickness / 2)

  plane.position.copy(planeCenter)
  plane.rotation.set(0, trackPitchRadians, 0)
  plane.scale.set(trackLength + wheelRadius * 1.2, width, thickness)

  planeEdges.position.copy(plane.position)
  planeEdges.rotation.copy(plane.rotation)
  planeEdges.scale.copy(plane.scale)
}

function getRollingTrackSurfacePosition(
  sample: KinematicsSample,
  sceneProjection: KinematicsSceneProjection,
) {
  const position = toKinematicsScenePosition(sample, sceneProjection)

  position.z -= sample.primaryRadiusMeters * sceneProjection.positionScale

  return position
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

function createCoupledOscillatorReferencePath(
  samples: KinematicsSample[],
  sceneProjection: KinematicsSceneProjection,
) {
  const firstSample = samples[0]
  const group = new THREE.Group()
  const scale = sceneProjection.positionScale
  const springTopZ = (firstSample?.primaryRadiusMeters ?? 1) * scale
  const minZ = Math.min(
    0,
    ...samples.map((sample) =>
      Math.min(sample.zMeters * scale, sample.secondaryZMeters * scale),
    ),
  )
  const maxZ = Math.max(
    springTopZ,
    ...samples.map((sample) =>
      Math.max(sample.zMeters * scale, sample.secondaryZMeters * scale),
    ),
  )
  const leftX = (firstSample?.xMeters ?? -1.45) * scale
  const rightX = (firstSample?.secondaryXMeters ?? 1.45) * scale

  group.add(
    createSceneLine(
      new THREE.Vector3(leftX, -0.1, 0),
      new THREE.Vector3(leftX, -0.1, springTopZ),
      0xe6e8ec,
      0.16,
    ),
  )
  group.add(
    createSceneLine(
      new THREE.Vector3(rightX, -0.1, 0),
      new THREE.Vector3(rightX, -0.1, springTopZ),
      0xe6e8ec,
      0.16,
    ),
  )
  group.add(
    createSceneLine(
      new THREE.Vector3(leftX, -0.18, 0),
      new THREE.Vector3(rightX, -0.18, 0),
      0x2dd4bf,
      0.46,
    ),
  )
  group.add(
    createSceneLine(
      new THREE.Vector3(0, -0.22, minZ),
      new THREE.Vector3(0, -0.22, maxZ),
      0x818cf8,
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

  if (simulationId === 'uniform-circular-motion') {
    return createUniformCircularMotionReferencePath(samples, sceneProjection)
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

function createUniformCircularMotionReferencePath(
  samples: KinematicsSample[],
  sceneProjection: KinematicsSceneProjection,
) {
  const firstSample = samples[0]
  const group = new THREE.Group()

  if (!firstSample) {
    return group
  }

  const scale = sceneProjection.positionScale
  const radiusMeters = Math.hypot(firstSample.xMeters, firstSample.zMeters)
  const radiusScene = Math.max(0.1, radiusMeters * scale)
  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusScene * 1.16, radiusScene * 1.16, 0.035, 96),
    new THREE.MeshStandardMaterial({
      color: 0x17202a,
      emissive: 0x06141a,
      emissiveIntensity: 0.28,
      metalness: 0.12,
      opacity: 0.62,
      roughness: 0.52,
      transparent: true,
    }),
  )

  platform.rotation.x = Math.PI / 2
  platform.position.z = -0.035
  group.add(platform)

  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(radiusScene * 1.01, 0.028, 10, 160),
    new THREE.MeshStandardMaterial({
      color: 0xa3e635,
      emissive: 0x365314,
      emissiveIntensity: 0.46,
      metalness: 0.04,
      opacity: 0.82,
      roughness: 0.34,
      transparent: true,
    }),
  )
  const innerGuide = new THREE.Mesh(
    new THREE.TorusGeometry(radiusScene * 0.86, 0.009, 8, 128),
    new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      depthWrite: false,
      opacity: 0.28,
      transparent: true,
    }),
  )
  const outerGuide = new THREE.Mesh(
    new THREE.TorusGeometry(radiusScene * 1.16, 0.012, 8, 128),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      depthWrite: false,
      opacity: 0.24,
      transparent: true,
    }),
  )

  halo.position.z = 0.035
  innerGuide.position.z = 0.041
  outerGuide.position.z = 0.039
  group.add(halo)
  group.add(innerGuide)
  group.add(outerGuide)

  const centerCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.085, 24, 14),
    new THREE.MeshStandardMaterial({
      color: 0xe6e8ec,
      emissive: 0x2dd4bf,
      emissiveIntensity: 0.42,
      metalness: 0.22,
      roughness: 0.28,
    }),
  )
  const centerAxis = new THREE.Mesh(
    new THREE.CylinderGeometry(0.014, 0.014, 0.58, 14),
    new THREE.MeshBasicMaterial({
      color: 0xe6e8ec,
      opacity: 0.58,
      transparent: true,
    }),
  )

  centerCore.position.z = 0.09
  centerAxis.rotation.x = Math.PI / 2
  centerAxis.position.z = 0.29
  group.add(centerCore)
  group.add(centerAxis)

  for (let degrees = 0; degrees < 360; degrees += 30) {
    const angle = (degrees * Math.PI) / 180
    const major = degrees % 90 === 0
    const startRadius = radiusScene * (major ? 0.76 : 0.88)
    const endRadius = radiusScene * 1.12
    const color = major ? 0x38bdf8 : 0x64748b
    const opacity = major ? 0.46 : 0.22

    group.add(
      createSceneLine(
        new THREE.Vector3(
          Math.cos(angle) * startRadius,
          Math.sin(angle) * startRadius,
          0.06,
        ),
        new THREE.Vector3(
          Math.cos(angle) * endRadius,
          Math.sin(angle) * endRadius,
          0.06,
        ),
        color,
        opacity,
      ),
    )

    if (major) {
      const label = createSceneTextSprite(`${degrees} deg`, {
        background: 'rgba(15, 17, 21, 0.62)',
        color: degrees === 0 ? '#2DD4BF' : '#CBD5E1',
        scale: 0.13,
      })

      label.position.set(
        Math.cos(angle) * radiusScene * 1.32,
        Math.sin(angle) * radiusScene * 1.32,
        0.18,
      )
      group.add(label)
    }
  }

  group.add(
    createSceneLine(
      new THREE.Vector3(0, 0, 0.07),
      new THREE.Vector3(radiusScene, 0, 0.07),
      0xa3e635,
      0.32,
    ),
  )

  const strobeSamples = selectUniformCircularMotionStrobeSamples(samples, 12)
  const ghostMaterial = new THREE.MeshStandardMaterial({
    color: 0x67e8f9,
    depthWrite: false,
    emissive: 0x083344,
    emissiveIntensity: 0.36,
    metalness: 0.12,
    opacity: 0.24,
    roughness: 0.34,
    transparent: true,
  })

  strobeSamples.forEach((sample, index) => {
    const position = toKinematicsScenePosition(sample, sceneProjection)
    const ratio =
      strobeSamples.length <= 1 ? 0 : index / (strobeSamples.length - 1)
    const ghost = new THREE.Mesh(
      new THREE.SphereGeometry(0.07 + ratio * 0.025, 18, 12),
      ghostMaterial,
    )
    const tangentDirection = new THREE.Vector3(
      -Math.sin(sample.angleRadians),
      Math.cos(sample.angleRadians),
      0,
    )
    const tangentLength = radiusScene * 0.23
    const tangentStart = position
      .clone()
      .addScaledVector(tangentDirection, tangentLength * 0.12)
    const tangentEnd = position
      .clone()
      .addScaledVector(tangentDirection, tangentLength)

    tangentStart.z = 0.16
    tangentEnd.z = 0.16
    ghost.position.copy(position)
    ghost.position.z = 0.14
    group.add(ghost)
    group.add(createSceneLine(tangentStart, tangentEnd, 0x38bdf8, 0.2))

    if (index % 3 === 0) {
      const label = createSceneTextSprite(
        index === 0
          ? 't=0'
          : `t=${formatSceneNumber(sample.timeSeconds)}s`,
        {
          background: 'rgba(15, 17, 21, 0.62)',
          color: '#93C5FD',
          scale: 0.12,
        },
      )

      label.position.set(
        position.x * 1.08,
        position.y * 1.08,
        0.3 + (index % 2) * 0.05,
      )
      group.add(label)
    }
  })

  const periodLabel = createSceneTextSprite(
    `T = ${formatSceneNumber(firstSample.periodSeconds)} s`,
    {
      background: 'rgba(15, 17, 21, 0.68)',
      color: '#2DD4BF',
      scale: 0.15,
    },
  )

  periodLabel.position.set(0, -radiusScene * 1.34, 0.22)
  group.add(periodLabel)

  return group
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

  if (simulationId === 'doppler-effect') {
    const fieldRadius = getSoundWaveFieldBaseRadiusScene('doppler-effect') * 2.1

    positions.length = 0
    samples.forEach((sample) => {
      positions.push(
        toDopplerDiagonalScenePoint(sceneProjection, sample.xMeters),
        toDopplerDiagonalScenePoint(sceneProjection, sample.secondaryXMeters),
        toDopplerDiagonalScenePoint(
          sceneProjection,
          sample.xMeters,
          fieldRadius,
          fieldRadius,
        ),
        toDopplerDiagonalScenePoint(
          sceneProjection,
          sample.xMeters,
          -fieldRadius,
          -fieldRadius,
        ),
      )
    })
  }

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

  if (isSingleSpringOscillatorSimulation(simulationId)) {
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

  if (simulationId === 'coupled-oscillators') {
    const firstSample = samples[0]

    if (firstSample) {
      const scale = sceneProjection.positionScale
      const topZ = firstSample.primaryRadiusMeters * scale
      const minZ = Math.min(
        0,
        ...samples.map((sample) =>
          Math.min(sample.zMeters * scale, sample.secondaryZMeters * scale),
        ),
      )
      const leftX = firstSample.xMeters * scale
      const rightX = firstSample.secondaryXMeters * scale

      positions.push(
        new THREE.Vector3(leftX - 0.5, -0.55, minZ - 0.35),
        new THREE.Vector3(rightX + 0.5, 0.55, topZ + 0.55),
      )
    }
  }

  if (simulationId === 'hydrostatics-buoyancy') {
    const firstSample = samples[0]

    if (firstSample) {
      const scale = sceneProjection.positionScale
      const tankDepth = hydrostaticTankDepthMeters * scale
      const dimensions = getHydroTankDimensions(scale)
      const sphereRadius = Math.max(0.04, firstSample.primaryRadiusMeters * scale)

      positions.length = 0
      positions.push(
        new THREE.Vector3(-dimensions.width / 2, -dimensions.depth / 2, -tankDepth),
        new THREE.Vector3(dimensions.width / 2, dimensions.depth / 2, sphereRadius),
      )
    }
  }

  if (simulationId === 'continuity-bernoulli') {
    const firstSample = samples[0]

    if (firstSample) {
      const scale = sceneProjection.positionScale
      const heightOffset = Math.abs(firstSample.secondaryZMeters * scale)

      positions.length = 0
      positions.push(
        new THREE.Vector3(
          -bernoulliTubeHalfLengthMeters * scale - 0.55,
          bernoulliManometerFrontY - 0.2,
          -0.45 - heightOffset,
        ),
        new THREE.Vector3(
          bernoulliTubeHalfLengthMeters * scale + 0.55,
          0.78,
          bernoulliManometerMaxHeight + heightOffset + 0.72,
        ),
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

  if (simulationId === 'rigid-body-rotation') {
    positions.length = 0
    positions.push(
      new THREE.Vector3(-1.35, -1.35, -rigidRotationBaseThickness),
      new THREE.Vector3(1.35, 1.35, rigidRotationAxisHeight + 0.12),
    )
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
function getVectorDisplayLength(
  vector: KinematicsVectorOverlay,
  objects?: SceneObjects,
  sample?: KinematicsSample,
  simulationId?: KinematicsSimulationId,
) {
  if (
    objects &&
    sample &&
    simulationId === 'uniform-circular-motion'
  ) {
    const radiusScene =
      Math.hypot(sample.xMeters, sample.zMeters) *
      objects.sceneProjection.positionScale

    if (vector.id === 'displacement') {
      return Math.max(0.16, radiusScene)
    }

    if (vector.id === 'velocity') {
      return clamp(vector.magnitude * 0.18, 0.28, radiusScene * 0.74)
    }

    if (vector.id === 'centripetal') {
      return clamp(vector.magnitude * 0.12, 0.3, radiusScene * 0.7)
    }
  }

  const scale = vector.unit === 'm' ? 0.32 : vector.unit === 'm/s' ? 0.18 : 0.14

  return clamp(vector.magnitude * scale, 0.18, 1.35)
}

function getBodyDisplaySize(sceneSpan: number) {
  return clamp(sceneSpan * 0.022, bodySize, 0.72)
}

function createRigidRotationCurvedArrow(
  color: number,
): RigidRotationCurvedArrow {
  const positions = new Float32Array((rigidRotationCurvedArrowSegments + 1) * 3)
  const geometry = new THREE.BufferGeometry()
  const positionAttribute = new THREE.BufferAttribute(positions, 3)

  positionAttribute.setUsage(THREE.DynamicDrawUsage)
  geometry.setAttribute('position', positionAttribute)
  geometry.setDrawRange(0, 0)

  return {
    cone: new THREE.Mesh(
      new THREE.ConeGeometry(0.055, 0.16, 18),
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.12,
        metalness: 0.04,
        roughness: 0.44,
      }),
    ),
    line: new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.9,
      }),
    ),
    positionAttribute,
    positions,
  }
}

function updateRigidRotationCurvedArrow(
  arrow: RigidRotationCurvedArrow,
  {
    radius,
    startAngleRadians,
    sweepRadians,
    visible,
    z,
  }: {
    radius: number
    startAngleRadians: number
    sweepRadians: number
    visible: boolean
    z: number
  },
) {
  if (!visible || Math.abs(sweepRadians) < 0.001) {
    arrow.line.visible = false
    arrow.cone.visible = false
    arrow.line.geometry.setDrawRange(0, 0)
    return
  }

  const endAngleRadians = startAngleRadians + sweepRadians
  const pointCount = updateArcLineGeometry({
    endAngleRadians,
    positions: arrow.positions,
    radius,
    segmentCapacity: rigidRotationCurvedArrowSegments,
    startAngleRadians,
    z,
  })
  const directionSign = Math.sign(sweepRadians) || 1
  const tangent = new THREE.Vector3(
    -Math.sin(endAngleRadians) * directionSign,
    Math.cos(endAngleRadians) * directionSign,
    0,
  ).normalize()

  arrow.line.geometry.setDrawRange(0, pointCount)
  arrow.positionAttribute.needsUpdate = true
  arrow.line.visible = true
  arrow.cone.visible = true
  arrow.cone.position.set(
    Math.cos(endAngleRadians) * radius,
    Math.sin(endAngleRadians) * radius,
    z,
  )
  arrow.cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent)
}

function updateArcLineGeometry({
  endAngleRadians,
  positions,
  radius,
  segmentCapacity,
  startAngleRadians,
  z,
}: {
  endAngleRadians: number
  positions: Float32Array
  radius: number
  segmentCapacity: number
  startAngleRadians: number
  z: number
}) {
  const sweepRadians = endAngleRadians - startAngleRadians
  const pointCount = Math.max(
    2,
    Math.min(
      segmentCapacity + 1,
      Math.ceil((Math.abs(sweepRadians) / (Math.PI * 2)) * segmentCapacity) + 1,
    ),
  )

  for (let index = 0; index < pointCount; index += 1) {
    const ratio = pointCount === 1 ? 0 : index / (pointCount - 1)
    const angle = startAngleRadians + sweepRadians * ratio
    const offset = index * 3

    positions[offset] = Math.cos(angle) * radius
    positions[offset + 1] = Math.sin(angle) * radius
    positions[offset + 2] = z
  }

  return pointCount
}

function readVectorCueSweep(value: number, magnitudeScale: number) {
  const sign = Math.sign(value) || 1

  return sign * clamp(Math.abs(value) * magnitudeScale, 0.42, 1.42)
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

function updateFollowCamera(
  objects: SceneObjects,
  sample: KinematicsSample,
  runtime: RuntimeProps,
) {
  if (
    runtime.simulationId !== 'uniform-circular-motion' ||
    runtime.cameraViewMode !== 'follow'
  ) {
    return
  }

  updateOrbitCamera(objects, {
    pitchRadians: Math.atan2(0.42, 0.9),
    yawRadians: sample.angleRadians - 0.86,
  })
}

function getInitialCameraYawRadians(
  simulationId: KinematicsSimulationId,
  cameraViewMode: KinematicsCameraViewMode,
) {
  if (simulationId === 'uniformly-accelerated-motion') {
    if (cameraViewMode === 'side') {
      return 0
    }

    return cameraViewMode === 'top' ? -Math.PI / 2 : -0.42
  }

  if (simulationId === 'uniform-linear-motion') {
    return cameraViewMode === 'cinematic' ? -0.42 : -Math.PI / 2
  }

  if (simulationId === 'uniform-circular-motion') {
    if (cameraViewMode === 'top') {
      return -Math.PI / 2
    }

    if (cameraViewMode === 'follow') {
      return -0.78
    }

    return -0.52
  }

  if (isMechanicalWaveSimulation(simulationId)) {
    return cameraViewMode === 'cinematic' ? -0.72 : -Math.PI / 2
  }

  if (simulationId === 'coupled-oscillators') {
    if (cameraViewMode === 'side') {
      return -Math.PI / 2
    }

    return cameraViewMode === 'top' ? -Math.PI / 2 : -0.68
  }

  return simulationId === 'atwood-machine' ||
    simulationId === 'hydrostatics-buoyancy' ||
    isMechanicalWaveSimulation(simulationId) ||
    isSingleSpringOscillatorSimulation(simulationId)
    ? -Math.PI / 2
    : initialCameraYawRadians
}

function getInitialCameraPitchRadians(
  simulationId: KinematicsSimulationId,
  cameraViewMode: KinematicsCameraViewMode,
) {
  if (simulationId === 'uniformly-accelerated-motion') {
    return cameraViewMode === 'cinematic'
      ? Math.atan2(0.42, 0.9)
      : Math.atan2(0.12, 0.99)
  }

  if (simulationId === 'uniform-linear-motion') {
    if (cameraViewMode === 'top') {
      return Math.PI / 2 - 0.14
    }

    return cameraViewMode === 'side'
      ? Math.atan2(0.14, 0.99)
      : Math.atan2(0.32, 0.95)
  }

  if (simulationId === 'uniform-circular-motion') {
    if (cameraViewMode === 'top') {
      return Math.PI / 2 - 0.1
    }

    return cameraViewMode === 'follow'
      ? Math.atan2(0.42, 0.9)
      : Math.atan2(0.56, 0.82)
  }

  if (isMechanicalWaveSimulation(simulationId)) {
    if (cameraViewMode === 'top') {
      return Math.PI / 2 - 0.12
    }

    return cameraViewMode === 'side'
      ? Math.atan2(0.1, 0.99)
      : Math.atan2(0.42, 0.9)
  }

  if (simulationId === 'coupled-oscillators') {
    if (cameraViewMode === 'top') {
      return Math.PI / 2 - 0.12
    }

    return cameraViewMode === 'side'
      ? Math.atan2(0.12, 0.99)
      : Math.atan2(0.42, 0.9)
  }

  return simulationId === 'rigid-body-rotation'
    ? Math.atan2(0.68, 0.74)
    : initialCameraPitchRadians
}

function getKinematicsCanvasAriaLabel(simulationId: KinematicsSimulationId) {
  if (simulationId === 'uniformly-accelerated-motion') {
    return 'Cena 3D de Cinematica para MUV e queda livre com torre graduada, solo, marcas estroboscopicas, vetores de velocidade e aceleracao, arraste para orbitar em torno, por cima e por baixo, e Shift + scroll para zoom'
  }

  if (simulationId === 'uniform-linear-motion') {
    return 'Cena 3D de Cinematica do MRU com pista retilinea, regua, marcas estroboscopicas, vetor velocidade, arraste para orbitar em torno, por cima e por baixo, e Shift + scroll para zoom'
  }

  if (simulationId === 'uniform-circular-motion') {
    return 'Cena 3D de Cinematica do MCU com plataforma circular, centro fixo, raio, angulo, marcas temporais, vetores tangencial e centripeto, arraste para orbitar em torno, por cima e por baixo, e Shift + scroll para zoom'
  }

  if (simulationId === 'mass-spring') {
    return 'Cena 3D do massa-mola vertical com arraste para orbitar em torno, por cima e por baixo, e Shift + scroll para zoom'
  }

  if (simulationId === 'damped-oscillator') {
    return 'Cena 3D do oscilador amortecido com mola, massa, vetores de amortecimento e energia dissipada, arraste para orbitar, e Shift + scroll para zoom'
  }

  if (simulationId === 'forced-oscillator-resonance') {
    return 'Cena 3D do oscilador forcado com mola, massa, forca externa periodica, amortecimento e ressonancia, arraste para orbitar, e Shift + scroll para zoom'
  }

  if (simulationId === 'coupled-oscillators') {
    return 'Cena 3D dos osciladores acoplados com duas massas, molas, modo comum, modo relativo, arraste para orbitar, e Shift + scroll para zoom'
  }

  if (simulationId === 'wave-on-string') {
    return 'Cena 3D de onda em corda com perfil senoidal viajante, probe sincronizado, componentes de velocidade transversal e arraste para orbitar, e Shift + scroll para zoom'
  }

  if (simulationId === 'beats') {
    return 'Cena 3D de batimentos sonoros com campo volumetrico de pontinhos de pressao, envoltoria sincronizada, probe e arraste para orbitar, e Shift + scroll para zoom'
  }

  if (simulationId === 'doppler-effect') {
    return 'Cena 3D do efeito Doppler com fonte movel, observador, campo volumetrico de pontinhos de pressao e arraste para orbitar, e Shift + scroll para zoom'
  }

  if (simulationId === 'superposition-interference') {
    return 'Cena 3D de superposicao e interferencia com duas ondas componentes, soma resultante na corda, probe sincronizado, arraste para orbitar e Shift + scroll para zoom'
  }

  if (simulationId === 'standing-waves') {
    return 'Cena 3D de ondas estacionarias com nos, ventres, envelope modal, probe sincronizado, arraste para orbitar e Shift + scroll para zoom'
  }

  if (simulationId === 'torque-levers-center-mass') {
    return 'Cena 3D da gangorra com massas, apoio fixo, centro de massa e vetores com arraste para orbitar, e Shift + scroll para zoom'
  }

  if (simulationId === 'rigid-body-rotation') {
    return 'Cena 3D da mesa de rotacao com eixo fixo, rotor, torque e setas angulares com arraste para orbitar, e Shift + scroll para zoom'
  }

  if (simulationId === 'gravitational-field-orbits') {
    return 'Cena 3D orbital com corpo central, planeta, lua didatica e arraste para orbitar, e Shift + scroll para zoom'
  }

  if (simulationId === 'hydrostatics-buoyancy') {
    return 'Cena 3D de hidrostatica com tanque transparente, esfera no fluido, vetores de empuxo e peso, arraste para orbitar e Shift + scroll para zoom'
  }

  if (simulationId === 'continuity-bernoulli') {
    return 'Cena 3D de um tubo de Venturi transparente com tracadores de fluido, cores de velocidade, manometros de pressao, arraste para orbitar e Shift + scroll para zoom'
  }

  return 'Cena 3D de Cinematica com arraste para orbitar em torno, por cima e por baixo, e Shift + scroll para zoom'
}

function normalizeModelTimeScale(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return 1
  }

  return value
}

function getTraceFadeSeconds(simulationId: KinematicsSimulationId) {
  return simulationId === 'gravitational-field-orbits'
    ? orbitalTraceFadeSeconds
    : traceFadeSeconds
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

type SceneTextSpriteOptions = {
  background: string
  color: string
  fontSize?: number
  minWidthPx?: number
  paddingX?: number
  paddingY?: number
  scale?: number
}

type SceneTextSpriteState = {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  height: number
  options: Required<SceneTextSpriteOptions>
  text: string
  texture: THREE.CanvasTexture
  width: number
}

function createSceneTextSprite(
  text: string,
  options: SceneTextSpriteOptions,
) {
  const resolvedOptions = resolveSceneTextSpriteOptions(options)
  const textureData = createSceneTextTexture(text, resolvedOptions)
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      depthTest: false,
      depthWrite: false,
      map: textureData.texture,
      transparent: true,
    }),
  )

  sprite.userData.sceneText = {
    canvas: textureData.canvas,
    context: textureData.context,
    height: textureData.height,
    options: resolvedOptions,
    text,
    texture: textureData.texture,
    width: textureData.width,
  } satisfies SceneTextSpriteState
  sprite.scale.set(
    resolvedOptions.scale * textureData.aspectRatio,
    resolvedOptions.scale,
    1,
  )
  sprite.frustumCulled = false
  sprite.renderOrder = 50

  return sprite
}

function updateSceneTextSprite(sprite: THREE.Sprite, text: string) {
  const sceneText = sprite.userData.sceneText as
    | SceneTextSpriteState
    | undefined

  if (!sceneText || sceneText.text === text) {
    return
  }

  const nextSize = measureSceneTextCanvasSize(text, sceneText.options)
  const nextWidth = Math.max(sceneText.width, nextSize.width)
  const nextHeight = Math.max(sceneText.height, nextSize.height)

  if (nextWidth !== sceneText.width || nextHeight !== sceneText.height) {
    sceneText.canvas.width = nextWidth
    sceneText.canvas.height = nextHeight
    sceneText.width = nextWidth
    sceneText.height = nextHeight
    sprite.scale.set(
      sceneText.options.scale * (nextWidth / nextHeight),
      sceneText.options.scale,
      1,
    )
  }

  drawSceneTextCanvas(
    sceneText.canvas,
    sceneText.context,
    text,
    sceneText.options,
  )
  sceneText.texture.needsUpdate = true
  sceneText.text = text
}

function resolveSceneTextSpriteOptions(options: SceneTextSpriteOptions) {
  return {
    fontSize: 42,
    minWidthPx: 0,
    paddingX: 18,
    paddingY: 10,
    scale: 0.18,
    ...options,
  }
}

function createSceneTextTexture(
  text: string,
  options: Required<SceneTextSpriteOptions>,
) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas 2D context is required for scene labels.')
  }

  const { height, width } = measureSceneTextCanvasSize(text, options, context)

  canvas.width = width
  canvas.height = height
  drawSceneTextCanvas(canvas, context, text, options)

  const texture = new THREE.CanvasTexture(canvas)

  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true

  return {
    aspectRatio: width / height,
    canvas,
    context,
    height,
    texture,
    width,
  }
}

function measureSceneTextCanvasSize(
  text: string,
  options: Required<SceneTextSpriteOptions>,
  context?: CanvasRenderingContext2D,
) {
  const measurementCanvas = context ? null : document.createElement('canvas')
  const measurementContext =
    context ?? measurementCanvas?.getContext('2d')

  if (!measurementContext) {
    throw new Error('Canvas 2D context is required for scene labels.')
  }

  measurementContext.font = createSceneTextFont(options)
  const metrics = measurementContext.measureText(text)
  const width = Math.max(
    options.minWidthPx,
    Math.ceil(metrics.width + options.paddingX * 2),
  )
  const height = Math.ceil(options.fontSize + options.paddingY * 2)

  return { height, width }
}

function drawSceneTextCanvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  text: string,
  options: Required<SceneTextSpriteOptions>,
) {
  const { height, width } = canvas

  context.clearRect(0, 0, width, height)
  context.font = createSceneTextFont(options)
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillStyle = options.background
  roundRect(context, 0, 0, width, height, height * 0.24)
  context.fill()
  context.fillStyle = options.color
  context.fillText(text, width / 2, height / 2)
}

function createSceneTextFont(options: Required<SceneTextSpriteOptions>) {
  return `700 ${options.fontSize}px Inter, Segoe UI, Arial, sans-serif`
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath()
  context.moveTo(x + radius, y)
  context.arcTo(x + width, y, x + width, y + height, radius)
  context.arcTo(x + width, y + height, x, y + height, radius)
  context.arcTo(x, y + height, x, y, radius)
  context.arcTo(x, y, x + width, y, radius)
  context.closePath()
}

function formatSceneNumber(value: number) {
  if (!Number.isFinite(value)) {
    return '0'
  }

  const absoluteValue = Math.abs(value)

  if (absoluteValue >= 100) {
    return value.toFixed(0)
  }

  if (absoluteValue >= 10) {
    return value.toFixed(1).replace(/\.0$/, '')
  }

  return value.toFixed(2).replace(/\.?0+$/, '')
}

function formatSceneDynamicNumber(value: number) {
  if (!Number.isFinite(value)) {
    return '0'
  }

  return value.toFixed(1).replace(/\.0$/, '')
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
          disposeMaterialTextures(item)
          item.dispose()
        })
      } else {
        if (material) {
          disposeMaterialTextures(material)
        }
        material?.dispose()
      }
    }
  })
}

function disposeMaterialTextures(material: THREE.Material) {
  const materialWithMap = material as THREE.Material & {
    map?: THREE.Texture | null
  }

  materialWithMap.map?.dispose()
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

function radiansToDegrees(value: number) {
  return (value * 180) / Math.PI
}

function normalizeDegrees(value: number) {
  const normalized = value % 360

  return normalized < 0 ? normalized + 360 : normalized
}

function normalizePositiveRadians(value: number) {
  const normalized = value % (Math.PI * 2)

  return normalized < 0 ? normalized + Math.PI * 2 : normalized
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
