type TimedSample = {
  timeSeconds: number
}

export function selectRecentSamples<TSample extends TimedSample>(
  samples: TSample[],
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

export function readFirstSample<TSample>(
  samples: readonly TSample[],
  timelineLabel: string,
) {
  const sample = samples[0]

  if (!sample) {
    throw new Error(`${timelineLabel} timeline must contain at least one sample.`)
  }

  return sample
}

export function getSampleIndexForTime(
  samples: readonly TimedSample[],
  durationSeconds: number,
  timeSeconds: number,
) {
  if (samples.length <= 1 || durationSeconds <= 0) {
    return 0
  }

  const progress = Math.min(1, Math.max(0, timeSeconds / durationSeconds))

  return Math.min(
    samples.length - 1,
    Math.floor(progress * (samples.length - 1)),
  )
}

export function appendLiveSample<TSample extends TimedSample>(
  samples: TSample[],
  liveSample: TSample,
) {
  const lastSample = samples.at(-1)

  if (!lastSample) {
    return [liveSample]
  }

  if (liveSample.timeSeconds <= lastSample.timeSeconds + 0.0001) {
    return samples
  }

  return [...samples, liveSample]
}

export function selectStableRows<TSample>(
  samples: readonly TSample[],
  rowCount: number,
) {
  const rows: Array<TSample | null> = Array.from(
    { length: rowCount },
    () => null,
  )

  if (samples.length === 0) {
    return rows
  }

  if (samples.length <= rowCount) {
    samples.forEach((sample, index) => {
      rows[index] = sample
    })

    return rows
  }

  const lastIndex = samples.length - 1
  const lastRowIndex = Math.max(1, rowCount - 1)

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const sampleIndex = Math.round((rowIndex / lastRowIndex) * lastIndex)
    rows[rowIndex] = samples[sampleIndex]
  }

  return rows
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
  samples: TimedSample[],
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
