import { useCallback, useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import * as THREE from 'three'
import {
  getPendulumVectorOverlays,
  type PendulumParameters,
  type PendulumSample,
  type PendulumVectorOverlay,
} from '../../lib/physics/pendulum'
import { themeTokens } from '../../theme/appTheme'

export type PendulumFrameStats = {
  fps: number
  frameTimeMs: number
}

type PendulumSceneProps = {
  durationSeconds: number
  isPlaying: boolean
  onSampleChange: (sample: PendulumSample, stats: PendulumFrameStats) => void
  parameters: PendulumParameters
  playbackRate: number
  resetVersion: number
  samples: PendulumSample[]
  showTrace: boolean
  showVectors: boolean
}

type SceneObjects = {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.OrthographicCamera
  rod: THREE.Line
  rodPositions: Float32Array
  bob: THREE.Mesh
  trace: THREE.Line
  tracePositions: Float32Array
  tracePositionAttribute: THREE.BufferAttribute
  arrows: Record<PendulumVectorOverlay['id'], THREE.ArrowHelper>
}

type RuntimeProps = {
  durationSeconds: number
  onSampleChange: (sample: PendulumSample, stats: PendulumFrameStats) => void
  parameters: PendulumParameters
  playbackRate: number
  samples: PendulumSample[]
  showTrace: boolean
  showVectors: boolean
}

const vectorColors: Record<PendulumVectorOverlay['id'], number> = {
  weight: 0xf43f5e,
  tension: 0xa3e635,
  velocity: 0x38bdf8,
}

const vectorIds = ['weight', 'tension', 'velocity'] as const
const maxTracePoints = 96
const readoutIntervalMs = 33
const maxFrameDeltaSeconds = 0.12

export function PendulumScene({
  durationSeconds,
  isPlaying,
  onSampleChange,
  parameters,
  playbackRate,
  resetVersion,
  samples,
  showTrace,
  showVectors,
}: PendulumSceneProps) {
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
  const fpsWindowStartRef = useRef(0)
  const fpsFrameCountRef = useRef(0)
  const statsRef = useRef<PendulumFrameStats>({
    fps: 0,
    frameTimeMs: 0,
  })

  const renderCurrentFrame = useCallback((notify = false) => {
    const objects = objectsRef.current
    const runtime = runtimeRef.current
    const frame = getTimelineFrame(
      runtime.samples,
      runtime.durationSeconds,
      elapsedSecondsRef.current,
    )
    const sample = frame.sample

    if (!objects || !sample) {
      return
    }

    updatePendulumObjects({
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
      runtime.onSampleChange(sample, statsRef.current)
    }
  }, [])

  const updateFrameStats = useCallback(
    (timestamp: number, deltaSeconds: number) => {
      statsRef.current = {
        ...statsRef.current,
        frameTimeMs: deltaSeconds * 1000,
      }

      if (fpsWindowStartRef.current === 0) {
        fpsWindowStartRef.current = timestamp
      }

      fpsFrameCountRef.current += 1

      const fpsWindowMs = timestamp - fpsWindowStartRef.current

      if (fpsWindowMs >= 500) {
        statsRef.current = {
          fps: Math.round((fpsFrameCountRef.current * 1000) / fpsWindowMs),
          frameTimeMs: statsRef.current.frameTimeMs,
        }
        fpsWindowStartRef.current = timestamp
        fpsFrameCountRef.current = 0
      }
    },
    [],
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
        canvas,
        antialias: false,
        powerPreference: 'high-performance',
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

    const tracePositions = new Float32Array(maxTracePoints * 3)
    const traceGeometry = new THREE.BufferGeometry()
    const tracePositionAttribute = new THREE.BufferAttribute(tracePositions, 3)

    tracePositionAttribute.setUsage(THREE.DynamicDrawUsage)
    traceGeometry.setAttribute('position', tracePositionAttribute)
    traceGeometry.setDrawRange(0, 0)

    const trace = new THREE.Line(
      traceGeometry,
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

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25))

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
      renderCurrentFrame()
    }
    const observer = new ResizeObserver(resizeRenderer)

    objectsRef.current = {
      renderer,
      scene,
      camera,
      rod,
      rodPositions,
      bob,
      trace,
      tracePositions,
      tracePositionAttribute,
      arrows,
    }

    observer.observe(parent)
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
  }, [renderCurrentFrame, samples])

  useEffect(() => {
    elapsedSecondsRef.current = 0
    lastFrameTimeRef.current = null
    lastReadoutTimeRef.current = 0
    statsRef.current = {
      fps: 0,
      frameTimeMs: 0,
    }
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

      updateFrameStats(timestamp, deltaSeconds)
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
  }, [isPlaying, renderCurrentFrame, samples, updateFrameStats])

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

function updatePendulumObjects({
  objects,
  parameters,
  sample,
  sampleIndex,
  samples,
  showTrace,
  showVectors,
}: {
  objects: SceneObjects
  parameters: PendulumParameters
  sample: PendulumSample
  sampleIndex: number
  samples: PendulumSample[]
  showTrace: boolean
  showVectors: boolean
}) {
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

  getPendulumVectorOverlays(sample, parameters).forEach((vector) => {
    const arrow = objects.arrows[vector.id]
    const direction = new THREE.Vector3(
      vector.direction.x,
      vector.direction.y,
      0,
    )

    if (!showVectors || direction.lengthSq() === 0 || vector.magnitude === 0) {
      arrow.visible = false
      return
    }

    arrow.visible = true
    arrow.position.copy(bobPosition)
    arrow.setDirection(direction.normalize())
    arrow.setLength(getVectorDisplayLength(vector), 0.08, 0.045)
  })

  updateTrace(objects, samples, sampleIndex, showTrace)
}

function updateTrace(
  objects: SceneObjects,
  samples: PendulumSample[],
  sampleIndex: number,
  showTrace: boolean,
) {
  if (!showTrace || sampleIndex < 1) {
    objects.trace.visible = false
    objects.trace.geometry.setDrawRange(0, 0)
    return
  }

  const traceSampleCount = sampleIndex + 1
  const stride = Math.max(1, Math.ceil(traceSampleCount / maxTracePoints))
  const pointCount = Math.min(
    maxTracePoints,
    Math.ceil(traceSampleCount / stride),
  )
  let positionIndex = 0

  for (
    let sampleIndexForTrace = 0;
    sampleIndexForTrace <= sampleIndex && positionIndex < pointCount * 3;
    sampleIndexForTrace += stride
  ) {
    const traceSample = samples[sampleIndexForTrace]

    objects.tracePositions[positionIndex] = traceSample.xMeters
    objects.tracePositions[positionIndex + 1] = traceSample.yMeters
    objects.tracePositions[positionIndex + 2] = -0.04
    positionIndex += 3
  }

  objects.trace.visible = true
  objects.trace.geometry.setDrawRange(0, positionIndex / 3)
  objects.tracePositionAttribute.needsUpdate = true
}

function getTimelineFrame(
  samples: PendulumSample[],
  durationSeconds: number,
  elapsedSeconds: number,
) {
  if (samples.length <= 1 || durationSeconds <= 0) {
    return {
      sample: samples[0],
      sampleIndex: 0,
    }
  }

  const progress = Math.min(1, Math.max(0, elapsedSeconds / durationSeconds))
  const exactIndex = progress * (samples.length - 1)
  const lowerIndex = Math.floor(exactIndex)
  const upperIndex = Math.min(samples.length - 1, lowerIndex + 1)
  const ratio = exactIndex - lowerIndex

  return {
    sample: interpolateSample(samples[lowerIndex], samples[upperIndex], ratio),
    sampleIndex: Math.min(samples.length - 1, Math.round(exactIndex)),
  }
}

function interpolateSample(
  start: PendulumSample,
  end: PendulumSample,
  ratio: number,
): PendulumSample {
  return {
    timeSeconds: interpolate(start.timeSeconds, end.timeSeconds, ratio),
    angleRadians: interpolate(start.angleRadians, end.angleRadians, ratio),
    angularVelocityRadiansPerSecond: interpolate(
      start.angularVelocityRadiansPerSecond,
      end.angularVelocityRadiansPerSecond,
      ratio,
    ),
    xMeters: interpolate(start.xMeters, end.xMeters, ratio),
    yMeters: interpolate(start.yMeters, end.yMeters, ratio),
    kineticEnergyJoules: interpolate(
      start.kineticEnergyJoules,
      end.kineticEnergyJoules,
      ratio,
    ),
    potentialEnergyJoules: interpolate(
      start.potentialEnergyJoules,
      end.potentialEnergyJoules,
      ratio,
    ),
    totalEnergyJoules: interpolate(
      start.totalEnergyJoules,
      end.totalEnergyJoules,
      ratio,
    ),
  }
}

function interpolate(start: number, end: number, ratio: number) {
  return start + (end - start) * ratio
}

function getVectorDisplayLength(vector: PendulumVectorOverlay) {
  const scale = vector.id === 'velocity' ? 0.34 : 0.11

  return Math.min(0.82, Math.max(0.16, vector.magnitude * scale))
}

function requestAnimationFrameSafe(callback: FrameRequestCallback) {
  if (typeof window.requestAnimationFrame === 'function') {
    return window.requestAnimationFrame(callback)
  }

  return window.setTimeout(() => {
    callback(window.performance.now())
  }, 16)
}

function cancelAnimationFrameSafe(frameId: number) {
  if (typeof window.cancelAnimationFrame === 'function') {
    window.cancelAnimationFrame(frameId)
    return
  }

  window.clearTimeout(frameId)
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
