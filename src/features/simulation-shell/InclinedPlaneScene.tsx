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
  getInclinedPlaneVectorOverlays,
  type InclinedPlaneParameters,
  type InclinedPlaneSample,
  type InclinedPlaneVectorOverlay,
} from '../../lib/physics/inclinedPlane'
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
import { ViewportOriginLegend } from './ViewportOriginLegend'

export type InclinedPlaneFrameStats = FrameStats

type InclinedPlaneSceneProps = {
  durationSeconds: number
  isPlaying: boolean
  maximized?: boolean
  onSampleChange: (
    sample: InclinedPlaneSample,
    stats: InclinedPlaneFrameStats,
  ) => void
  parameters: InclinedPlaneParameters
  playbackRate: number
  resetVersion: number
  samples: InclinedPlaneSample[]
  showTrace: boolean
  showVectors: boolean
}

type SceneObjects = {
  arrows: Record<InclinedPlaneVectorOverlay['id'], THREE.ArrowHelper>
  block: THREE.Mesh
  camera: THREE.PerspectiveCamera
  cameraMaxRadius: number
  cameraMinRadius: number
  cameraRadius: number
  cameraTarget: THREE.Vector3
  planeLengthMeters: number
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  trace: THREE.Line
  traceColorAttribute: THREE.BufferAttribute
  traceColors: Float32Array
  tracePositionAttribute: THREE.BufferAttribute
  tracePositions: Float32Array
}

type RuntimeProps = {
  durationSeconds: number
  onSampleChange: (
    sample: InclinedPlaneSample,
    stats: InclinedPlaneFrameStats,
  ) => void
  parameters: InclinedPlaneParameters
  playbackRate: number
  samples: InclinedPlaneSample[]
  showTrace: boolean
  showVectors: boolean
}

type DragState = {
  lastClientX: number
  lastClientY: number
  pointerId: number
}

const vectorColors: Record<InclinedPlaneVectorOverlay['id'], number> = {
  friction: 0xf59e0b,
  normal: 0xa3e635,
  velocity: 0x38bdf8,
  weight: 0xf43f5e,
}

const vectorIds = ['weight', 'normal', 'friction', 'velocity'] as const
const blockSize = 0.28
const maxTracePoints = 120
const traceFadeSeconds = 2.2
const traceMinOpacity = 0.04
const traceMaxOpacity = 0.58
const traceColor = {
  blue: 0xf8 / 255,
  green: 0xbd / 255,
  red: 0x38 / 255,
}
const readoutIntervalMs = 33
const maxFrameDeltaSeconds = 0.12
const initialCameraYawRadians = -0.62
const initialCameraPitchRadians = Math.atan(0.38)
const dragYawRadiansPerPixel = 0.008
const dragPitchRadiansPerPixel = 0.006
const cameraAzimuthOffsetRadians = -Math.PI / 2
const wheelZoomSensitivity = 0.0014
const minCameraRadiusScale = 0.42
const maxCameraRadiusScale = 2.35

export function InclinedPlaneScene({
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
}: InclinedPlaneSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const objectsRef = useRef<SceneObjects | null>(null)
  const runtimeRef = useRef<RuntimeProps>({
    durationSeconds,
    onSampleChange,
    parameters,
    playbackRate,
    samples,
    showTrace,
    showVectors,
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
      interpolateSample,
    )
    const sample = frame.sample

    if (!objects || !sample) {
      return
    }

    updateInclinedPlaneObjects({
      objects,
      parameters: runtime.parameters,
      sample,
      sampleIndex: frame.sampleIndex,
      samples: runtime.samples,
      showTrace: runtime.showTrace,
      showVectors: runtime.showVectors,
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
      parameters,
      playbackRate,
      samples,
      showTrace,
      showVectors,
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

    const theta = degreesToRadians(parameters.planeAngleDegrees)
    const planeLengthMeters = parameters.planeLengthMeters
    const planeHorizontalMeters = planeLengthMeters * Math.cos(theta)
    const planeHeightMeters = planeLengthMeters * Math.sin(theta)
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    const cameraTarget = new THREE.Vector3(
      planeHorizontalMeters * 0.52,
      0,
      planeHeightMeters * 0.46,
    )
    const cameraRadius = Math.max(4.4, planeLengthMeters * 1.15)
    const cameraMinRadius = Math.max(1.8, cameraRadius * minCameraRadiusScale)
    const cameraMaxRadius = cameraRadius * maxCameraRadiusScale

    camera.up.set(0, 0, 1)
    scene.background = new THREE.Color(themeTokens.background)
    scene.add(new THREE.AmbientLight(0xffffff, 0.62))
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.08)

    keyLight.position.set(-2.4, -3.2, 5)
    scene.add(keyLight)

    const gridSize = Math.max(5, planeLengthMeters * 1.35)
    const grid = new THREE.GridHelper(gridSize, 8, 0x2a2f3a, 0x20242d)

    grid.rotation.x = Math.PI / 2
    grid.position.set(planeHorizontalMeters * 0.5, 0, -0.02)
    grid.material.transparent = true
    grid.material.opacity = 0.38
    scene.add(grid)
    scene.add(
      createOriginAxesMarker({
        axisLength: getOriginAxesLength(gridSize),
        origin: getGridLowerLeftOrigin({
          centerX: planeHorizontalMeters * 0.5,
          centerY: 0,
          size: gridSize,
          z: grid.position.z + 0.035,
        }),
      }),
    )

    const plane = new THREE.Mesh(
      new THREE.BoxGeometry(planeLengthMeters, 0.72, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0x20242d,
        metalness: 0.04,
        roughness: 0.72,
      }),
    )

    plane.position.set(planeHorizontalMeters / 2, 0, planeHeightMeters / 2)
    plane.rotation.y = theta
    scene.add(plane)

    const planeEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(plane.geometry),
      new THREE.LineBasicMaterial({
        color: 0x2dd4bf,
        transparent: true,
        opacity: 0.5,
      }),
    )

    plane.add(planeEdges)

    const block = new THREE.Mesh(
      new THREE.BoxGeometry(blockSize, blockSize, blockSize),
      new THREE.MeshStandardMaterial({
        color: 0x2dd4bf,
        metalness: 0.08,
        roughness: 0.44,
      }),
    )
    const blockEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(block.geometry),
      new THREE.LineBasicMaterial({
        color: 0xe6e8ec,
        transparent: true,
        opacity: 0.5,
      }),
    )

    block.add(blockEdges)
    scene.add(block)

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
          new THREE.Vector3(0, 0, -1),
          new THREE.Vector3(0, 0, 0),
          0.35,
          vectorColors[vectorId],
          0.08,
          0.045,
        ),
      ]),
    ) as Record<InclinedPlaneVectorOverlay['id'], THREE.ArrowHelper>

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
      block,
      camera,
      cameraMaxRadius,
      cameraMinRadius,
      cameraRadius,
      cameraTarget,
      planeLengthMeters,
      renderer,
      scene,
      trace,
      traceColorAttribute,
      traceColors,
      tracePositionAttribute,
      tracePositions,
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
  }, [parameters, renderCurrentFrame, samples])

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
        aria-label="Cena 3D do plano inclinado com arraste para orbitar em torno, por cima e por baixo, e Shift + scroll para zoom"
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

function updateInclinedPlaneObjects({
  objects,
  parameters,
  sample,
  sampleIndex,
  samples,
  showTrace,
  showVectors,
}: {
  objects: SceneObjects
  parameters: InclinedPlaneParameters
  sample: InclinedPlaneSample
  sampleIndex: number
  samples: InclinedPlaneSample[]
  showTrace: boolean
  showVectors: boolean
}) {
  const blockPosition = toScenePosition(sample, parameters)

  objects.block.position.copy(blockPosition)
  objects.block.rotation.y = degreesToRadians(parameters.planeAngleDegrees)

  getInclinedPlaneVectorOverlays(sample, parameters).forEach((vector) => {
    const arrow = objects.arrows[vector.id]
    const direction = new THREE.Vector3(vector.direction.x, 0, vector.direction.z)

    if (!showVectors || direction.lengthSq() === 0 || vector.magnitude === 0) {
      arrow.visible = false
      return
    }

    arrow.visible = true
    arrow.position.copy(blockPosition)
    arrow.setDirection(direction.normalize())
    arrow.setLength(getVectorDisplayLength(vector), 0.08, 0.045)
  })

  updateTrace(objects, samples, sampleIndex, sample, parameters, showTrace)
}

function updateTrace(
  objects: SceneObjects,
  samples: InclinedPlaneSample[],
  sampleIndex: number,
  currentSample: InclinedPlaneSample,
  parameters: InclinedPlaneParameters,
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
  const traceSampleCount = sampleIndex - firstTraceSampleIndex + 1
  const stride = Math.max(1, Math.ceil(traceSampleCount / maxTracePoints))
  let pointIndex = 0
  let lastWrittenSampleIndex = -1

  for (
    let sampleIndexForTrace = firstTraceSampleIndex;
    sampleIndexForTrace <= sampleIndex && pointIndex < maxTracePoints;
    sampleIndexForTrace += stride
  ) {
    const traceSample = samples[sampleIndexForTrace]

    writeTracePoint(
      objects,
      pointIndex,
      traceSample,
      parameters,
      newestTimeSeconds,
    )
    pointIndex += 1
    lastWrittenSampleIndex = sampleIndexForTrace
  }

  if (lastWrittenSampleIndex === sampleIndex) {
    writeTracePoint(
      objects,
      pointIndex - 1,
      currentSample,
      parameters,
      newestTimeSeconds,
    )
  } else if (pointIndex < maxTracePoints) {
    writeTracePoint(
      objects,
      pointIndex,
      currentSample,
      parameters,
      newestTimeSeconds,
    )
    pointIndex += 1
  }

  if (pointIndex < 2) {
    objects.trace.visible = false
    objects.trace.geometry.setDrawRange(0, 0)
    return
  }

  objects.trace.visible = true
  objects.trace.geometry.setDrawRange(0, pointIndex)
  objects.tracePositionAttribute.needsUpdate = true
  objects.traceColorAttribute.needsUpdate = true
}

function findTraceStartIndex(
  samples: InclinedPlaneSample[],
  sampleIndex: number,
  oldestVisibleTimeSeconds: number,
) {
  let firstTraceSampleIndex = sampleIndex

  while (
    firstTraceSampleIndex > 0 &&
    samples[firstTraceSampleIndex - 1].timeSeconds >= oldestVisibleTimeSeconds
  ) {
    firstTraceSampleIndex -= 1
  }

  return firstTraceSampleIndex
}

function writeTracePoint(
  objects: SceneObjects,
  pointIndex: number,
  sample: InclinedPlaneSample,
  parameters: InclinedPlaneParameters,
  newestTimeSeconds: number,
) {
  const position = toScenePosition(sample, parameters, blockSize * 0.3)
  const positionIndex = pointIndex * 3
  const colorIndex = pointIndex * 4
  const ageSeconds = Math.max(0, newestTimeSeconds - sample.timeSeconds)
  const fadeProgress = Math.min(1, ageSeconds / traceFadeSeconds)
  const opacity =
    traceMinOpacity +
    (1 - fadeProgress) * (traceMaxOpacity - traceMinOpacity)

  objects.tracePositions[positionIndex] = position.x
  objects.tracePositions[positionIndex + 1] = position.y
  objects.tracePositions[positionIndex + 2] = position.z
  objects.traceColors[colorIndex] = traceColor.red
  objects.traceColors[colorIndex + 1] = traceColor.green
  objects.traceColors[colorIndex + 2] = traceColor.blue
  objects.traceColors[colorIndex + 3] = opacity
}

function interpolateSample(
  start: InclinedPlaneSample,
  end: InclinedPlaneSample,
  ratio: number,
): InclinedPlaneSample {
  return {
    accelerationMetersPerSecondSquared: interpolate(
      start.accelerationMetersPerSecondSquared,
      end.accelerationMetersPerSecondSquared,
      ratio,
    ),
    frictionForceNewtons: interpolate(
      start.frictionForceNewtons,
      end.frictionForceNewtons,
      ratio,
    ),
    frictionMagnitudeNewtons: interpolate(
      start.frictionMagnitudeNewtons,
      end.frictionMagnitudeNewtons,
      ratio,
    ),
    heightMeters: interpolate(start.heightMeters, end.heightMeters, ratio),
    isMoving: start.isMoving || end.isMoving,
    kineticEnergyJoules: interpolate(
      start.kineticEnergyJoules,
      end.kineticEnergyJoules,
      ratio,
    ),
    netForceNewtons: interpolate(start.netForceNewtons, end.netForceNewtons, ratio),
    normalForceNewtons: interpolate(
      start.normalForceNewtons,
      end.normalForceNewtons,
      ratio,
    ),
    positionMeters: interpolate(start.positionMeters, end.positionMeters, ratio),
    potentialEnergyJoules: interpolate(
      start.potentialEnergyJoules,
      end.potentialEnergyJoules,
      ratio,
    ),
    thermalEnergyJoules: interpolate(
      start.thermalEnergyJoules,
      end.thermalEnergyJoules,
      ratio,
    ),
    timeSeconds: interpolate(start.timeSeconds, end.timeSeconds, ratio),
    totalEnergyJoules: interpolate(
      start.totalEnergyJoules,
      end.totalEnergyJoules,
      ratio,
    ),
    velocityMetersPerSecond: interpolate(
      start.velocityMetersPerSecond,
      end.velocityMetersPerSecond,
      ratio,
    ),
    weightParallelNewtons: interpolate(
      start.weightParallelNewtons,
      end.weightParallelNewtons,
      ratio,
    ),
    xMeters: interpolate(start.xMeters, end.xMeters, ratio),
    zMeters: interpolate(start.zMeters, end.zMeters, ratio),
  }
}

function interpolate(start: number, end: number, ratio: number) {
  return start + (end - start) * ratio
}

function getVectorDisplayLength(vector: InclinedPlaneVectorOverlay) {
  const scale = vector.id === 'velocity' ? 0.28 : 0.055

  return Math.min(0.92, Math.max(0.16, vector.magnitude * scale))
}

function toScenePosition(
  sample: Pick<InclinedPlaneSample, 'positionMeters'>,
  parameters: InclinedPlaneParameters,
  lift = blockSize * 0.58,
) {
  const theta = degreesToRadians(parameters.planeAngleDegrees)
  const normal = new THREE.Vector3(Math.sin(theta), 0, Math.cos(theta))
  const planePosition = new THREE.Vector3(
    sample.positionMeters * Math.cos(theta),
    0,
    (parameters.planeLengthMeters - sample.positionMeters) * Math.sin(theta),
  )

  return planePosition.add(normal.multiplyScalar(lift))
}

function updateOrbitCamera(
  objects: Pick<SceneObjects, 'camera' | 'cameraRadius' | 'cameraTarget'> | null,
  pose: OrbitCameraPose,
) {
  positionOrbitCamera(objects, pose, cameraAzimuthOffsetRadians)
}

function normalizeWheelDeltaY(event: ReactWheelEvent<HTMLCanvasElement>) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return event.deltaY * 16
  }

  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * 120
  }

  return event.deltaY
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
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

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180
}
