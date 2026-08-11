export type SpacetimeFabricWell = {
  centerX: number
  centerY: number
  depth: number
  width: number
}

export function createSpacetimeFabricGridIndices(
  segments: number,
  lineStep = 2,
) {
  const safeSegments = Math.max(1, Math.floor(segments))
  const safeLineStep = Math.max(1, Math.floor(lineStep))
  const rowSize = safeSegments + 1
  const indices: number[] = []
  const visibleLines = new Set<number>()

  for (let line = 0; line <= safeSegments; line += safeLineStep) {
    visibleLines.add(line)
  }
  visibleLines.add(safeSegments)

  visibleLines.forEach((row) => {
    for (let column = 0; column < safeSegments; column += 1) {
      const start = row * rowSize + column

      indices.push(start, start + 1)
    }
  })

  visibleLines.forEach((column) => {
    for (let row = 0; row < safeSegments; row += 1) {
      const start = row * rowSize + column

      indices.push(start, start + rowSize)
    }
  })

  return indices
}

export function computeSpacetimeFabricHeight(
  x: number,
  y: number,
  wells: readonly SpacetimeFabricWell[],
) {
  return wells.reduce((height, well) => {
    if (well.depth <= 0 || well.width <= 0) {
      return height
    }

    const deltaX = x - well.centerX
    const deltaY = y - well.centerY
    const normalizedDistanceSquared =
      (deltaX * deltaX + deltaY * deltaY) / (well.width * well.width)

    return height - well.depth / (1 + normalizedDistanceSquared)
  }, 0)
}
