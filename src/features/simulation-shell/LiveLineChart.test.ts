import { describe, expect, it } from 'vitest'
import { deriveYRange, type ChartTrace } from './LiveLineChartModel'

const trace = {
  lineColor: '#38BDF8',
  name: 'Energia cinetica (J)',
  x: [0, 1, 2],
  y: [0, 4, 6],
} satisfies ChartTrace

describe('LiveLineChart axis helpers', () => {
  it('keeps the automatic y axis tight around visible values', () => {
    const range = deriveYRange([trace], [0, 2])

    expect(range[0]).toBeCloseTo(-0.72)
    expect(range[1]).toBeCloseTo(6.72)
  })

  it('does not amplify floating point noise in constant traces', () => {
    const range = deriveYRange(
      [
        {
          lineColor: '#38BDF8',
          name: 'Velocidade tangencial (m/s)',
          x: [0, 1, 2, 3],
          y: [2.52, 2.520000000000001, 2.519999999999999, 2.52],
        },
      ],
      [0, 3],
    )

    expect(range[0]).toBeCloseTo(2.2176)
    expect(range[1]).toBeCloseTo(2.8224)
  })

  it('centers zero in energy-like charts when requested', () => {
    const range = deriveYRange([trace], [0, 2], 'zero-centered')

    expect(range[0]).toBeCloseTo(-6.72)
    expect(range[1]).toBeCloseTo(6.72)
    expect(Math.abs(range[0])).toBeCloseTo(range[1])
  })
})
