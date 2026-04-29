export type FrameStats = {
  fps: number
  frameTimeMs: number
}

export type FrameStatsWindow = {
  frameCount: number
  stats: FrameStats
  windowStartMs: number
}

export type TimelineFrame<TSample> = {
  sample: TSample
  sampleIndex: number
}

export function createFrameStatsWindow(): FrameStatsWindow {
  return {
    frameCount: 0,
    stats: {
      fps: 0,
      frameTimeMs: 0,
    },
    windowStartMs: 0,
  }
}

export function updateFrameStatsWindow(
  windowState: FrameStatsWindow,
  timestamp: number,
  deltaSeconds: number,
): FrameStats {
  windowState.stats = {
    ...windowState.stats,
    frameTimeMs: deltaSeconds * 1000,
  }

  if (windowState.windowStartMs === 0) {
    windowState.windowStartMs = timestamp
  }

  windowState.frameCount += 1

  const windowMs = timestamp - windowState.windowStartMs

  if (windowMs >= 500) {
    windowState.stats = {
      fps: Math.round((windowState.frameCount * 1000) / windowMs),
      frameTimeMs: windowState.stats.frameTimeMs,
    }
    windowState.windowStartMs = timestamp
    windowState.frameCount = 0
  }

  return windowState.stats
}

export function readInterpolatedTimelineFrame<TSample>(
  samples: TSample[],
  durationSeconds: number,
  elapsedSeconds: number,
  interpolateSample: (start: TSample, end: TSample, ratio: number) => TSample,
): TimelineFrame<TSample> {
  if (samples.length === 0) {
    throw new Error('Timeline must contain at least one sample.')
  }

  if (samples.length === 1 || durationSeconds <= 0) {
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
    sampleIndex: lowerIndex,
  }
}

export function requestAnimationFrameSafe(callback: FrameRequestCallback) {
  if (typeof window.requestAnimationFrame === 'function') {
    return window.requestAnimationFrame(callback)
  }

  return window.setTimeout(() => {
    callback(window.performance.now())
  }, 16)
}

export function cancelAnimationFrameSafe(frameId: number) {
  if (typeof window.cancelAnimationFrame === 'function') {
    window.cancelAnimationFrame(frameId)
    return
  }

  window.clearTimeout(frameId)
}
