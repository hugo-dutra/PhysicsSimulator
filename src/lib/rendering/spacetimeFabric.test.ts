import { describe, expect, it } from 'vitest'
import {
  computeSpacetimeFabricHeight,
  createSpacetimeFabricGridIndices,
} from './spacetimeFabric'

describe('spacetime fabric visual mapping', () => {
  it('builds a sparse orthogonal grid without triangle diagonals', () => {
    const segments = 4
    const rowSize = segments + 1
    const indices = createSpacetimeFabricGridIndices(segments, 2)
    const segmentDeltas = Array.from(
      { length: indices.length / 2 },
      (_, index) => Math.abs(indices[index * 2 + 1] - indices[index * 2]),
    )

    expect(indices).toHaveLength(48)
    expect(new Set(segmentDeltas)).toEqual(new Set([1, rowSize]))
  })

  it('creates the deepest point at the center of a mass well', () => {
    const well = { centerX: 0, centerY: 0, depth: 1.2, width: 0.8 }

    expect(computeSpacetimeFabricHeight(0, 0, [well])).toBeCloseTo(-1.2)
    expect(computeSpacetimeFabricHeight(2, 0, [well])).toBeGreaterThan(-1.2)
  })

  it('superposes a smaller well that follows the orbiting body', () => {
    const centralWell = { centerX: 0, centerY: 0, depth: 1, width: 1 }
    const orbitingWell = { centerX: 3, centerY: 0, depth: 0.35, width: 0.45 }
    const heightAtOrbitingBody = computeSpacetimeFabricHeight(3, 0, [
      centralWell,
      orbitingWell,
    ])
    const heightWithoutOrbitingWell = computeSpacetimeFabricHeight(3, 0, [
      centralWell,
    ])

    expect(heightAtOrbitingBody).toBeLessThan(heightWithoutOrbitingWell)
    expect(
      computeSpacetimeFabricHeight(-3, 0, [centralWell, orbitingWell]),
    ).toBeGreaterThan(heightAtOrbitingBody)
  })
})
