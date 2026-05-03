import { describe, expect, it } from 'vitest'
import {
  getLoopedTimelineTime,
  normalizePlaybackRate,
  scalePlaybackDelta,
} from './visualRuntime'

describe('visual runtime timing', () => {
  it('keeps the displayed counter continuous while looping timeline reads', () => {
    expect(getLoopedTimelineTime(12, 30)).toBe(12)
    expect(getLoopedTimelineTime(30, 30)).toBe(30)
    expect(getLoopedTimelineTime(37, 30)).toBe(7)
    expect(getLoopedTimelineTime(60, 30)).toBe(30)
  })

  it('clamps playback speed to the supported slow-motion range', () => {
    expect(normalizePlaybackRate(1.2)).toBe(1)
    expect(normalizePlaybackRate(0.4)).toBe(0.4)
    expect(normalizePlaybackRate(-0.2)).toBe(0)
    expect(normalizePlaybackRate(Number.NaN)).toBe(0)
  })

  it('scales simulation time without changing the visual frame cadence', () => {
    expect(scalePlaybackDelta(0.016, 1)).toBeCloseTo(0.016)
    expect(scalePlaybackDelta(0.016, 0.25)).toBeCloseTo(0.004)
    expect(scalePlaybackDelta(0.016, 0)).toBe(0)
    expect(scalePlaybackDelta(-0.016, 1)).toBe(0)
  })
})
