import { describe, expect, it } from 'vitest'
import {
  computeSpacetimeLatticeBeamBasePoint,
  computeSpacetimeLatticeHeat,
  computeSpacetimeLatticePoint,
  computeSpacetimeLatticeVisualProfile,
  computeSpacetimeLightRayReveal,
  computeSpacetimeLightRayTrajectory,
  createSpacetimeLatticeGeometryData,
  spacetimeLatticeCurveSubdivisions,
  writeSpacetimeLatticeHeatColor,
} from './spacetimeLattice'

describe('volumetric spacetime lattice visual mapping', () => {
  it('creates only orthogonal cube edges across three spatial axes', () => {
    const lattice = createSpacetimeLatticeGeometryData(2, 2)
    const vertexCount = lattice.positions.length / 3
    const edgeCount = lattice.indices.length / 2

    expect(vertexCount).toBe(27)
    expect(edgeCount).toBe(54)
    expect(lattice.cellSize).toBe(1)
    expect(lattice.cubeCount).toBe(8)
    expect(lattice.cubeEdgeCount).toBe(54)
    expect(lattice.curveSubdivisions).toBe(1)

    for (let offset = 0; offset < lattice.indices.length; offset += 2) {
      const start = lattice.indices[offset] * 3
      const end = lattice.indices[offset + 1] * 3
      const changedAxes = [0, 1, 2].filter(
        (axis) => lattice.positions[start + axis] !== lattice.positions[end + axis],
      )

      expect(changedAxes).toHaveLength(1)
    }
  })

  it('smooths each edge without changing the number of cubes', () => {
    const lattice = createSpacetimeLatticeGeometryData(
      2,
      2,
      spacetimeLatticeCurveSubdivisions,
    )

    expect(lattice.cubeCount).toBe(8)
    expect(lattice.cubeEdgeCount).toBe(54)
    expect(lattice.curveSubdivisions).toBe(2)
    expect(lattice.positions.length / 3).toBe(27 + 54)
    expect(lattice.indices.length / 2).toBe(54 * 2)

    for (let offset = 0; offset < lattice.indices.length; offset += 2) {
      const start = lattice.indices[offset] * 3
      const end = lattice.indices[offset + 1] * 3
      const changedAxes = [0, 1, 2].filter(
        (axis) =>
          lattice.positions[start + axis] !== lattice.positions[end + axis],
      )

      expect(changedAxes).toHaveLength(1)
    }
  })

  it('places the beam on lattice lines across the selected coordinate plane', () => {
    const input = {
      cellSize: 1,
      divisions: 12,
      offsetUCells: 2,
      offsetVCells: -1,
    }

    expect(
      computeSpacetimeLatticeBeamBasePoint({
        ...input,
        plane: 'xy',
        progress: 0,
      }),
    ).toEqual({ x: 2, y: -1, z: -6 })
    expect(
      computeSpacetimeLatticeBeamBasePoint({
        ...input,
        plane: 'xy',
        progress: 1,
      }),
    ).toEqual({ x: 2, y: -1, z: 6 })
    expect(
      computeSpacetimeLatticeBeamBasePoint({
        ...input,
        plane: 'yz',
        progress: 0,
      }),
    ).toEqual({ x: -6, y: 2, z: -1 })
    expect(
      computeSpacetimeLatticeBeamBasePoint({
        ...input,
        plane: 'xz',
        progress: 1,
      }),
    ).toEqual({ x: 2, y: 6, z: -1 })
  })

  it('bends a near beam more than a far beam through the same visual wells', () => {
    const well = {
      centerX: 0,
      centerY: 0,
      centerZ: 0,
      coreRadius: 0.35,
      influenceRadius: 2.8,
      strength: 1.3,
    }
    const nearTrajectory = computeSpacetimeLightRayTrajectory({
      cellSize: 1,
      divisions: 12,
      offsetUCells: 1,
      offsetVCells: 0,
      plane: 'xy',
      segmentCount: 72,
      wells: [well],
    })
    const farTrajectory = computeSpacetimeLightRayTrajectory({
      cellSize: 1,
      divisions: 12,
      offsetUCells: 6,
      offsetVCells: 0,
      plane: 'xy',
      segmentCount: 72,
      wells: [well],
    })
    const nearEnd = nearTrajectory.at(-1)!
    const farEnd = farTrajectory.at(-1)!
    const nearDeviation = Math.hypot(nearEnd.x - 1, nearEnd.y)
    const farDeviation = Math.hypot(farEnd.x - 6, farEnd.y)

    expect(nearDeviation).toBeGreaterThan(farDeviation)
    expect(nearDeviation).toBeGreaterThan(0.05)
  })

  it('keeps the acquired light-ray direction after leaving the well', () => {
    const trajectory = computeSpacetimeLightRayTrajectory({
      cellSize: 1,
      divisions: 20,
      offsetUCells: 0,
      offsetVCells: 2,
      plane: 'yz',
      segmentCount: 120,
      wells: [
        {
          centerX: 0,
          centerY: 0,
          centerZ: 0,
          coreRadius: 0.3,
          influenceRadius: 2.2,
          strength: 1.8,
        },
      ],
    })
    const exitStart = trajectory.at(-3)!
    const exitMiddle = trajectory.at(-2)!
    const exitEnd = trajectory.at(-1)!
    const previousDirection = {
      x: exitMiddle.x - exitStart.x,
      y: exitMiddle.y - exitStart.y,
      z: exitMiddle.z - exitStart.z,
    }
    const outgoingDirection = {
      x: exitEnd.x - exitMiddle.x,
      y: exitEnd.y - exitMiddle.y,
      z: exitEnd.z - exitMiddle.z,
    }

    expect(outgoingDirection.z).toBeLessThan(-0.001)
    expect(exitEnd.z).toBeLessThan(exitMiddle.z)
    expect(outgoingDirection.x).toBeCloseTo(previousDirection.x, 8)
    expect(outgoingDirection.y).toBeCloseTo(previousDirection.y, 8)
    expect(outgoingDirection.z).toBeCloseTo(previousDirection.z, 8)
  })

  it('keeps a light ray straight when every visual well is inactive', () => {
    const trajectory = computeSpacetimeLightRayTrajectory({
      cellSize: 1,
      divisions: 12,
      offsetUCells: 0,
      offsetVCells: 2,
      plane: 'yz',
      segmentCount: 12,
      wells: [
        {
          centerX: 0,
          centerY: 0,
          centerZ: 0,
          coreRadius: 0.3,
          influenceRadius: 3,
          strength: 0,
        },
      ],
    })

    expect(trajectory).toHaveLength(13)
    trajectory.forEach((point, index) => {
      expect(point).toEqual({ x: -6 + index, y: 0, z: 2 })
    })
  })

  it('reveals the light-ray trajectory continuously from zero to one hundred percent', () => {
    expect(computeSpacetimeLightRayReveal(72, 0)).toEqual({
      completeSegmentCount: 0,
      partialSegmentProgress: 0,
      renderedSegmentCount: 0,
    })
    expect(computeSpacetimeLightRayReveal(72, 50)).toEqual({
      completeSegmentCount: 36,
      partialSegmentProgress: 0,
      renderedSegmentCount: 36,
    })

    const partialReveal = computeSpacetimeLightRayReveal(72, 50.5)

    expect(partialReveal.completeSegmentCount).toBe(36)
    expect(partialReveal.partialSegmentProgress).toBeCloseTo(0.36)
    expect(partialReveal.renderedSegmentCount).toBe(37)
    expect(computeSpacetimeLightRayReveal(72, 100).renderedSegmentCount)
      .toBe(72)
  })

  it('makes neighboring cube vertices meet at the center of a mass', () => {
    const well = {
      centerX: 0,
      centerY: 0,
      centerZ: 0,
      coreRadius: 0.4,
      influenceRadius: 2,
      strength: 1.4,
    }

    expect(computeSpacetimeLatticePoint({ x: 0.25, y: 0, z: 0 }, [well]))
      .toEqual({ x: 0, y: 0, z: 0 })
    expect(computeSpacetimeLatticePoint({ x: 0, y: -0.3, z: 0.1 }, [well]))
      .toEqual({ x: 0, y: 0, z: 0 })
  })

  it('increases curvature strength, core size, and influence reach with mass', () => {
    const lighter = computeSpacetimeLatticeVisualProfile({
      bodyRadius: 0.2,
      deformation: 0.5,
      massInfluenceScale: 0.5,
      referenceRadius: 8,
      role: 'central',
    })
    const heavier = computeSpacetimeLatticeVisualProfile({
      bodyRadius: 0.2,
      deformation: 1.5,
      massInfluenceScale: 1.5,
      referenceRadius: 8,
      role: 'central',
    })
    const distantPoint = { x: 3.6, y: 0, z: 0 }
    const lightPoint = computeSpacetimeLatticePoint(distantPoint, [
      { centerX: 0, centerY: 0, centerZ: 0, ...lighter },
    ])
    const heavyPoint = computeSpacetimeLatticePoint(distantPoint, [
      { centerX: 0, centerY: 0, centerZ: 0, ...heavier },
    ])

    expect(heavier.strength).toBeGreaterThan(lighter.strength)
    expect(heavier.coreRadius).toBeGreaterThan(lighter.coreRadius)
    expect(heavier.influenceRadius).toBeGreaterThan(lighter.influenceRadius)
    expect(distantPoint.x - heavyPoint.x).toBeGreaterThan(
      distantPoint.x - lightPoint.x,
    )
  })

  it('leaves the lattice undeformed when the visual scale is zero', () => {
    const point = { x: 0.2, y: 0.1, z: -0.3 }
    const profile = computeSpacetimeLatticeVisualProfile({
      bodyRadius: 0.2,
      deformation: 0,
      massInfluenceScale: 2,
      referenceRadius: 8,
      role: 'central',
    })

    expect(
      computeSpacetimeLatticePoint(point, [
        { centerX: 0, centerY: 0, centerZ: 0, ...profile },
      ]),
    ).toEqual(point)
  })

  it('maps stronger influence and line deviation toward red', () => {
    const basePoint = { x: 0.6, y: 0, z: 0 }
    const well = {
      centerX: 0,
      centerY: 0,
      centerZ: 0,
      coreRadius: 0.25,
      influenceRadius: 2,
      strength: 1.8,
    }
    const deformedPoint = computeSpacetimeLatticePoint(basePoint, [well])
    const heat = computeSpacetimeLatticeHeat(
      basePoint,
      deformedPoint,
      [well],
      1,
    )
    const coldColor = new Float32Array(3)
    const hotColor = new Float32Array(3)

    writeSpacetimeLatticeHeatColor(coldColor, 0, 0)
    writeSpacetimeLatticeHeatColor(hotColor, 0, heat)

    expect(heat).toBeGreaterThan(0.5)
    expect(hotColor[0]).toBeGreaterThan(coldColor[0])
    expect(hotColor[1]).toBeLessThan(coldColor[1])
    expect(hotColor[0]).toBeGreaterThan(hotColor[1])
    expect(hotColor[0]).toBeGreaterThan(hotColor[2])
  })

  it('keeps the undeformed zero-intensity lattice teal', () => {
    const point = { x: 0.6, y: 0, z: 0 }
    const inactiveWell = {
      centerX: 0,
      centerY: 0,
      centerZ: 0,
      coreRadius: 1,
      influenceRadius: 3,
      strength: 0,
    }
    const heat = computeSpacetimeLatticeHeat(
      point,
      point,
      [inactiveWell],
      1,
    )
    const color = new Float32Array(3)

    writeSpacetimeLatticeHeatColor(color, 0, heat)

    expect(heat).toBe(0)
    expect([...color]).toEqual([
      expect.closeTo(45 / 255, 5),
      expect.closeTo(212 / 255, 5),
      expect.closeTo(191 / 255, 5),
    ])
  })
})
