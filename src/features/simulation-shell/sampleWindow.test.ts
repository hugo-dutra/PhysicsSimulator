import { describe, expect, it } from 'vitest'
import type { PendulumSample } from '../../lib/physics/pendulum'
import { getMovingWindowRange, selectRecentSamples } from './sampleWindow'

describe('sample window helpers', () => {
  it('selects only the recent samples inside the requested time window', () => {
    const samples = createSamples(0, 10)

    expect(selectRecentSamples(samples, 7, 3).map((sample) => sample.timeSeconds))
      .toEqual([4, 5, 6, 7])
  })

  it('keeps the window anchored at zero before the plot is full', () => {
    expect(getMovingWindowRange(3, 8, 30)).toEqual([0, 8])
  })

  it('moves the range once the current time passes the visible window', () => {
    expect(getMovingWindowRange(18, 8, 30)).toEqual([10, 18])
  })
})

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
