import { describe, expect, it } from 'vitest'
import type { PendulumSample } from '../../lib/physics/pendulum'
import {
  appendLiveSample,
  getMovingWindowRange,
  getSampleIndexForTime,
  readFirstSample,
  selectContinuousRecentSamples,
  selectRecentSamples,
  selectStableRows,
} from './sampleWindow'

describe('sample window helpers', () => {
  it('selects only the recent samples inside the requested time window', () => {
    const samples = createSamples(0, 10)

    expect(selectRecentSamples(samples, 7, 3).map((sample) => sample.timeSeconds))
      .toEqual([4, 5, 6, 7])
  })

  it('selects recent samples from the continuous playback history', () => {
    const samples = createSamples(0, 12)

    expect(
      selectContinuousRecentSamples(samples, 12, 4, 10).map(
        (sample) => sample.timeSeconds,
      ),
    ).toEqual([8, 9, 10, 11, 12])
  })

  it('keeps the window anchored at zero before the plot is full', () => {
    expect(getMovingWindowRange(3, 8, 30)).toEqual([0, 8])
  })

  it('moves the range once the current time passes the visible window', () => {
    expect(getMovingWindowRange(18, 8, 30)).toEqual([10, 18])
  })

  it('keeps the chart window independent from the calculated horizon', () => {
    expect(getMovingWindowRange(25, 12, 6)).toEqual([13, 25])
  })

  it('reads the first sample or fails with the timeline label', () => {
    const samples = createSamples(0, 2)

    expect(readFirstSample(samples, 'Pendulum')).toBe(samples[0])
    expect(() => readFirstSample([], 'Demo')).toThrow(
      'Demo timeline must contain at least one sample.',
    )
  })

  it('maps playback time to a bounded sample index', () => {
    const samples = createSamples(0, 10)

    expect(getSampleIndexForTime(samples, 10, 4.9)).toBe(4)
    expect(getSampleIndexForTime(samples, 10, -1)).toBe(0)
    expect(getSampleIndexForTime(samples, 10, 99)).toBe(10)
    expect(getSampleIndexForTime(samples, 0, 4)).toBe(0)
  })

  it('appends the live sample only when it advances time', () => {
    const samples = createSamples(0, 2)

    expect(
      appendLiveSample(samples, { ...samples[2], timeSeconds: 2.00005 }),
    ).toEqual([{ ...samples[0] }, { ...samples[1] }, {
      ...samples[2],
      timeSeconds: 2.00005,
    }])
    expect(appendLiveSample(samples, { ...samples[2], timeSeconds: 3 })).toEqual([
      ...samples,
      { ...samples[2], timeSeconds: 3 },
    ])
  })

  it('starts a new live history when playback time rolls back to reset', () => {
    const samples = createSamples(0, 3)

    expect(appendLiveSample(samples, { ...samples[0], timeSeconds: 0 })).toEqual([
      { ...samples[0], timeSeconds: 0 },
    ])
  })

  it('keeps table rows stable and evenly sampled', () => {
    expect(selectStableRows(createSamples(0, 2), 5).map(readRowTime)).toEqual([
      0,
      1,
      2,
      null,
      null,
    ])
    expect(selectStableRows(createSamples(0, 10), 5).map(readRowTime)).toEqual([
      0,
      3,
      5,
      8,
      10,
    ])
    expect(selectStableRows([], 3)).toEqual([null, null, null])
  })
})

function readRowTime(sample: PendulumSample | null) {
  return sample?.timeSeconds ?? null
}

function createSamples(startSeconds: number, endSeconds: number) {
  const samples: PendulumSample[] = []

  for (let timeSeconds = startSeconds; timeSeconds <= endSeconds; timeSeconds += 1) {
    samples.push({
      timeSeconds,
      angleRadians: timeSeconds,
      angularVelocityRadiansPerSecond: 0,
      angularAccelerationRadiansPerSecondSquared: 0,
      linearVelocityMetersPerSecond: 0,
      tangentialAccelerationMetersPerSecondSquared: 0,
      radialAccelerationMetersPerSecondSquared: 0,
      totalAccelerationMetersPerSecondSquared: 0,
      xMeters: 0,
      yMeters: 0,
      kineticEnergyJoules: 0,
      potentialEnergyJoules: 0,
      totalEnergyJoules: 0,
    })
  }

  return samples
}
