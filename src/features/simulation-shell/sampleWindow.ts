import type { PendulumSample } from '../../lib/physics/pendulum'

export function selectRecentSamples(
  samples: PendulumSample[],
  currentSampleIndex: number,
  windowSeconds: number,
) {
  if (samples.length === 0 || windowSeconds <= 0) {
    return []
  }

  const boundedCurrentIndex = Math.min(
    samples.length - 1,
    Math.max(0, currentSampleIndex),
  )
  const currentSample = samples[boundedCurrentIndex]
  const windowStartSeconds = Math.max(
    0,
    currentSample.timeSeconds - windowSeconds,
  )
  const startIndex = findFirstSampleAtOrAfter(samples, windowStartSeconds)

  return samples.slice(startIndex, boundedCurrentIndex + 1)
}

export function getMovingWindowRange(
  currentTimeSeconds: number,
  windowSeconds: number,
  durationSeconds: number,
): [number, number] {
  const effectiveWindowSeconds = Math.max(
    0,
    Math.min(windowSeconds, durationSeconds),
  )

  if (effectiveWindowSeconds === 0) {
    return [0, 0]
  }

  if (currentTimeSeconds <= effectiveWindowSeconds) {
    return [0, effectiveWindowSeconds]
  }

  return [
    currentTimeSeconds - effectiveWindowSeconds,
    currentTimeSeconds,
  ]
}

function findFirstSampleAtOrAfter(
  samples: PendulumSample[],
  timeSeconds: number,
) {
  let low = 0
  let high = samples.length - 1
  let result = 0

  while (low <= high) {
    const middle = Math.floor((low + high) / 2)

    if (samples[middle].timeSeconds >= timeSeconds) {
      result = middle
      high = middle - 1
    } else {
      low = middle + 1
    }
  }

  return result
}
