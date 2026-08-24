export type SpacetimeLatticePoint = {
  x: number
  y: number
  z: number
}

export type SpacetimeLatticeBeamPlane = 'xy' | 'xz' | 'yz'

type SpacetimeLatticeBeamBasePointInput = {
  cellSize: number
  divisions: number
  offsetUCells: number
  offsetVCells: number
  plane: SpacetimeLatticeBeamPlane
  progress: number
}

export type SpacetimeLatticeWell = {
  centerX: number
  centerY: number
  centerZ: number
  coreRadius: number
  influenceRadius: number
  strength: number
}

type SpacetimeLightRayTrajectoryInput = {
  cellSize: number
  divisions: number
  offsetUCells: number
  offsetVCells: number
  plane: SpacetimeLatticeBeamPlane
  segmentCount: number
  wells: readonly SpacetimeLatticeWell[]
}

export type SpacetimeLatticeMassRole = 'central' | 'orbiting'

export const spacetimeLatticeCurveSubdivisions = 2
export const spacetimeLatticeMaximumDensityMultiplier = 10

const coolLatticeColor = [45 / 255, 212 / 255, 191 / 255] as const
const warmLatticeColor = [250 / 255, 204 / 255, 21 / 255] as const
const hotLatticeColor = [239 / 255, 68 / 255, 68 / 255] as const
const latticeHeatMidpoint = 0.34
const latticeHeatHotThreshold = 0.78
const latticeMinimumOpacityFactor = 0.055
const latticeFullOpacityHeat = 0.72
const lightRayVisualCurvatureScale = 0.045
const lightRayFalloffCutoff = 0.0005
const lightRayMaximumTurnPerStep = 0.055

type SpacetimeLatticeVisualProfileInput = {
  bodyRadius: number
  deformation: number
  massInfluenceScale: number
  referenceRadius: number
  role: SpacetimeLatticeMassRole
}

export function computeSpacetimeLatticeDivisions(
  baseDivisions: number,
  densityMultiplier: number,
) {
  const safeBaseDivisions = Math.max(1, Math.floor(baseDivisions))
  const safeDensityMultiplier = clamp(
    Number.isFinite(densityMultiplier) ? densityMultiplier : 1,
    1,
    spacetimeLatticeMaximumDensityMultiplier,
  )

  return Math.max(
    safeBaseDivisions,
    Math.round(safeBaseDivisions * Math.cbrt(safeDensityMultiplier)),
  )
}

export function createSpacetimeLatticeGeometryData(
  size: number,
  divisions: number,
  curveSubdivisions = 1,
) {
  const safeSize = Number.isFinite(size) && size > 0 ? size : 1
  const safeDivisions = Math.max(1, Math.floor(divisions))
  const safeCurveSubdivisions = Math.max(1, Math.floor(curveSubdivisions))
  const pointsPerAxis = safeDivisions + 1
  const baseVertexCount = pointsPerAxis ** 3
  const cubeEdgeCount = safeDivisions * pointsPerAxis ** 2 * 3
  const intermediatePointCount =
    cubeEdgeCount * (safeCurveSubdivisions - 1)
  const positions = new Float32Array(
    (baseVertexCount + intermediatePointCount) * 3,
  )
  const indices: number[] = []
  const halfSize = safeSize / 2
  const step = safeSize / safeDivisions
  let nextVertexIndex = baseVertexCount

  for (let zIndex = 0; zIndex < pointsPerAxis; zIndex += 1) {
    for (let yIndex = 0; yIndex < pointsPerAxis; yIndex += 1) {
      for (let xIndex = 0; xIndex < pointsPerAxis; xIndex += 1) {
        const vertexIndex = getLatticeVertexIndex(
          xIndex,
          yIndex,
          zIndex,
          pointsPerAxis,
        )
        const offset = vertexIndex * 3

        positions[offset] = -halfSize + xIndex * step
        positions[offset + 1] = -halfSize + yIndex * step
        positions[offset + 2] = -halfSize + zIndex * step
      }
    }
  }

  for (let zIndex = 0; zIndex < pointsPerAxis; zIndex += 1) {
    for (let yIndex = 0; yIndex < pointsPerAxis; yIndex += 1) {
      for (let xIndex = 0; xIndex < pointsPerAxis; xIndex += 1) {
        const vertexIndex = getLatticeVertexIndex(
          xIndex,
          yIndex,
          zIndex,
          pointsPerAxis,
        )

        if (xIndex < safeDivisions) {
          nextVertexIndex = addSubdividedLatticeEdge(
            positions,
            indices,
            vertexIndex,
            vertexIndex + 1,
            safeCurveSubdivisions,
            nextVertexIndex,
          )
        }

        if (yIndex < safeDivisions) {
          nextVertexIndex = addSubdividedLatticeEdge(
            positions,
            indices,
            vertexIndex,
            vertexIndex + pointsPerAxis,
            safeCurveSubdivisions,
            nextVertexIndex,
          )
        }

        if (zIndex < safeDivisions) {
          nextVertexIndex = addSubdividedLatticeEdge(
            positions,
            indices,
            vertexIndex,
            vertexIndex + pointsPerAxis ** 2,
            safeCurveSubdivisions,
            nextVertexIndex,
          )
        }
      }
    }
  }

  return {
    cellSize: step,
    cubeCount: safeDivisions ** 3,
    cubeEdgeCount,
    curveSubdivisions: safeCurveSubdivisions,
    indices,
    positions,
  }
}

export function computeSpacetimeLatticeVisualProfile({
  bodyRadius,
  deformation,
  massInfluenceScale,
  referenceRadius,
  role,
}: SpacetimeLatticeVisualProfileInput) {
  const safeBodyRadius = Math.max(0.001, bodyRadius)
  const safeDeformation = Math.max(0, deformation)
  const safeMassScale = Math.max(0, massInfluenceScale)
  const safeReferenceRadius = Math.max(safeBodyRadius, referenceRadius)
  const isCentral = role === 'central'
  const baseReach = isCentral ? 0.28 : 0.065
  const massReach = isCentral ? 0.13 : 0.07
  const maxReach = isCentral ? 0.62 : 0.24

  return {
    coreRadius: safeBodyRadius * (0.58 + safeMassScale * 0.68),
    influenceRadius:
      safeReferenceRadius *
      clamp(baseReach + safeMassScale * massReach, baseReach, maxReach),
    strength: safeDeformation * (isCentral ? 1.45 : 1.85),
  }
}

export function computeSpacetimeLatticeBeamBasePoint({
  cellSize,
  divisions,
  offsetUCells,
  offsetVCells,
  plane,
  progress,
}: SpacetimeLatticeBeamBasePointInput): SpacetimeLatticePoint {
  const safeCellSize = Math.max(1e-6, Math.abs(cellSize))
  const safeDivisions = Math.max(1, Math.floor(divisions))
  const halfExtent = (safeCellSize * safeDivisions) / 2
  const halfCellCount = safeDivisions / 2
  const offsetU =
    clamp(Math.round(offsetUCells), -halfCellCount, halfCellCount) *
    safeCellSize
  const offsetV =
    clamp(Math.round(offsetVCells), -halfCellCount, halfCellCount) *
    safeCellSize
  const propagationCoordinate = lerp(
    -halfExtent,
    halfExtent,
    clamp(progress, 0, 1),
  )

  if (plane === 'yz') {
    return {
      x: propagationCoordinate,
      y: offsetU,
      z: offsetV,
    }
  }

  if (plane === 'xz') {
    return {
      x: offsetU,
      y: propagationCoordinate,
      z: offsetV,
    }
  }

  return {
    x: offsetU,
    y: offsetV,
    z: propagationCoordinate,
  }
}

export function computeSpacetimeLightRayTrajectory({
  cellSize,
  divisions,
  offsetUCells,
  offsetVCells,
  plane,
  segmentCount,
  wells,
}: SpacetimeLightRayTrajectoryInput): SpacetimeLatticePoint[] {
  const safeSegmentCount = Math.max(1, Math.floor(segmentCount))
  const startPoint = computeSpacetimeLatticeBeamBasePoint({
    cellSize,
    divisions,
    offsetUCells,
    offsetVCells,
    plane,
    progress: 0,
  })
  const baseEndPoint = computeSpacetimeLatticeBeamBasePoint({
    cellSize,
    divisions,
    offsetUCells,
    offsetVCells,
    plane,
    progress: 1,
  })
  let directionX = baseEndPoint.x - startPoint.x
  let directionY = baseEndPoint.y - startPoint.y
  let directionZ = baseEndPoint.z - startPoint.z
  const basePathLength = Math.max(
    1e-6,
    Math.hypot(directionX, directionY, directionZ),
  )
  const stepLength = basePathLength / safeSegmentCount

  directionX /= basePathLength
  directionY /= basePathLength
  directionZ /= basePathLength

  const points: SpacetimeLatticePoint[] = [{ ...startPoint }]
  let currentX = startPoint.x
  let currentY = startPoint.y
  let currentZ = startPoint.z

  for (let index = 0; index < safeSegmentCount; index += 1) {
    let turnX = 0
    let turnY = 0
    let turnZ = 0

    wells.forEach((well) => {
      if (
        well.strength <= 0 ||
        well.influenceRadius <= 0 ||
        well.coreRadius < 0
      ) {
        return
      }

      const toMassX = well.centerX - currentX
      const toMassY = well.centerY - currentY
      const toMassZ = well.centerZ - currentZ
      const distance = Math.hypot(toMassX, toMassY, toMassZ)

      if (distance <= 1e-9) {
        return
      }

      const longitudinalProjection =
        toMassX * directionX +
        toMassY * directionY +
        toMassZ * directionZ
      const transverseX =
        toMassX - directionX * longitudinalProjection
      const transverseY =
        toMassY - directionY * longitudinalProjection
      const transverseZ =
        toMassZ - directionZ * longitudinalProjection
      const transverseDistance = Math.hypot(
        transverseX,
        transverseY,
        transverseZ,
      )

      if (transverseDistance <= 1e-9) {
        return
      }

      const transitionDistance = Math.max(0, distance - well.coreRadius)
      const normalizedDistance =
        transitionDistance / well.influenceRadius
      const falloff = Math.exp(-1.7 * normalizedDistance ** 2)

      if (falloff < lightRayFalloffCutoff) {
        return
      }

      const turnMagnitude =
        lightRayVisualCurvatureScale *
        well.strength *
        falloff *
        (stepLength / Math.max(well.influenceRadius, stepLength))

      turnX += (transverseX / transverseDistance) * turnMagnitude
      turnY += (transverseY / transverseDistance) * turnMagnitude
      turnZ += (transverseZ / transverseDistance) * turnMagnitude
    })

    const turnLength = Math.hypot(turnX, turnY, turnZ)
    const turnScale =
      turnLength > lightRayMaximumTurnPerStep
        ? lightRayMaximumTurnPerStep / turnLength
        : 1

    directionX += turnX * turnScale
    directionY += turnY * turnScale
    directionZ += turnZ * turnScale

    const directionLength = Math.max(
      1e-9,
      Math.hypot(directionX, directionY, directionZ),
    )

    directionX /= directionLength
    directionY /= directionLength
    directionZ /= directionLength
    currentX += directionX * stepLength
    currentY += directionY * stepLength
    currentZ += directionZ * stepLength
    points.push({ x: currentX, y: currentY, z: currentZ })
  }

  return points
}

export function computeSpacetimeLightRayReveal(
  segmentCount: number,
  progressPercent: number,
) {
  const safeSegmentCount = Math.max(1, Math.floor(segmentCount))
  const progress = clamp(progressPercent / 100, 0, 1)
  const exactRenderedSegmentCount = progress * safeSegmentCount
  const completeSegmentCount = Math.floor(exactRenderedSegmentCount)
  const partialSegmentProgress =
    exactRenderedSegmentCount - completeSegmentCount
  const renderedSegmentCount = Math.min(
    safeSegmentCount,
    completeSegmentCount + (partialSegmentProgress > 1e-6 ? 1 : 0),
  )

  return {
    completeSegmentCount,
    partialSegmentProgress,
    renderedSegmentCount,
  }
}

export function computeSpacetimeLatticePoint(
  point: SpacetimeLatticePoint,
  wells: readonly SpacetimeLatticeWell[],
): SpacetimeLatticePoint {
  let coreWell: SpacetimeLatticeWell | undefined
  let coreWellRatio = Number.POSITIVE_INFINITY
  let nearestMassDistance = Number.POSITIVE_INFINITY

  wells.forEach((well) => {
    if (
      well.strength <= 0 ||
      well.influenceRadius <= 0 ||
      well.coreRadius < 0
    ) {
      return
    }

    const distance = getDistanceToWell(point, well)
    nearestMassDistance = Math.min(nearestMassDistance, distance)

    if (distance <= well.coreRadius) {
      const coreRatio = distance / Math.max(well.coreRadius, 1e-9)

      if (coreRatio < coreWellRatio) {
        coreWell = well
        coreWellRatio = coreRatio
      }
    }
  })

  if (coreWell) {
    return {
      x: coreWell.centerX,
      y: coreWell.centerY,
      z: coreWell.centerZ,
    }
  }

  let displacementX = 0
  let displacementY = 0
  let displacementZ = 0

  wells.forEach((well) => {
    if (
      well.strength <= 0 ||
      well.influenceRadius <= 0 ||
      well.coreRadius < 0
    ) {
      return
    }

    const distance = getDistanceToWell(point, well)

    if (distance <= 1e-9) {
      return
    }

    const transitionDistance = Math.max(0, distance - well.coreRadius)
    const normalizedDistance = transitionDistance / well.influenceRadius
    const falloff = Math.exp(-1.7 * normalizedDistance ** 2)
    const pullRatio = clamp(
      (1 - Math.exp(-well.strength)) * falloff,
      0,
      0.94,
    )

    displacementX += (well.centerX - point.x) * pullRatio
    displacementY += (well.centerY - point.y) * pullRatio
    displacementZ += (well.centerZ - point.z) * pullRatio
  })

  const displacementLength = Math.hypot(
    displacementX,
    displacementY,
    displacementZ,
  )
  const maxDisplacement = nearestMassDistance * 0.94
  const displacementScale =
    displacementLength > maxDisplacement && displacementLength > 0
      ? maxDisplacement / displacementLength
      : 1

  return {
    x: point.x + displacementX * displacementScale,
    y: point.y + displacementY * displacementScale,
    z: point.z + displacementZ * displacementScale,
  }
}

export function computeSpacetimeLatticeHeat(
  basePoint: SpacetimeLatticePoint,
  deformedPoint: SpacetimeLatticePoint,
  wells: readonly SpacetimeLatticeWell[],
  cellSize: number,
) {
  const safeCellSize = Math.max(1e-6, Math.abs(cellSize))
  const deviation = Math.hypot(
    deformedPoint.x - basePoint.x,
    deformedPoint.y - basePoint.y,
    deformedPoint.z - basePoint.z,
  )
  const deviationHeat = 1 - Math.exp((-1.25 * deviation) / safeCellSize)
  let influenceHeat = 0

  wells.forEach((well) => {
    if (
      well.strength <= 0 ||
      well.influenceRadius <= 0 ||
      well.coreRadius < 0
    ) {
      return
    }

    const distance = getDistanceToWell(basePoint, well)

    if (distance <= well.coreRadius) {
      influenceHeat = 1
      return
    }

    const normalizedDistance =
      (distance - well.coreRadius) / well.influenceRadius
    const falloff = Math.exp(-1.7 * normalizedDistance ** 2)
    const strengthHeat = 1 - Math.exp(-well.strength)

    influenceHeat = Math.max(influenceHeat, strengthHeat * falloff)
  })

  return clamp(Math.max(deviationHeat, influenceHeat), 0, 1)
}

export function writeSpacetimeLatticeHeatColor(
  target: Float32Array,
  offset: number,
  heat: number,
) {
  const safeHeat = clamp(heat, 0, 1)
  const from =
    safeHeat <= latticeHeatMidpoint ? coolLatticeColor : warmLatticeColor
  const to =
    safeHeat <= latticeHeatMidpoint ? warmLatticeColor : hotLatticeColor
  const rangeProgress =
    safeHeat <= latticeHeatMidpoint
      ? safeHeat / latticeHeatMidpoint
      : (safeHeat - latticeHeatMidpoint) /
        (latticeHeatHotThreshold - latticeHeatMidpoint)
  const smoothProgress = smoothstep(rangeProgress)

  target[offset] = lerp(from[0], to[0], smoothProgress)
  target[offset + 1] = lerp(from[1], to[1], smoothProgress)
  target[offset + 2] = lerp(from[2], to[2], smoothProgress)
}

export function computeSpacetimeLatticeOpacityFactor(heat: number) {
  const safeHeat = clamp(Number.isFinite(heat) ? heat : 0, 0, 1)
  const proximityProgress = smoothstep(safeHeat / latticeFullOpacityHeat)

  return lerp(latticeMinimumOpacityFactor, 1, proximityProgress)
}

function addSubdividedLatticeEdge(
  positions: Float32Array,
  indices: number[],
  startVertexIndex: number,
  endVertexIndex: number,
  curveSubdivisions: number,
  nextVertexIndex: number,
) {
  const startOffset = startVertexIndex * 3
  const endOffset = endVertexIndex * 3
  let previousVertexIndex = startVertexIndex
  let nextIndex = nextVertexIndex

  for (
    let subdivisionIndex = 1;
    subdivisionIndex < curveSubdivisions;
    subdivisionIndex += 1
  ) {
    const progress = subdivisionIndex / curveSubdivisions
    const offset = nextIndex * 3

    positions[offset] = lerp(
      positions[startOffset],
      positions[endOffset],
      progress,
    )
    positions[offset + 1] = lerp(
      positions[startOffset + 1],
      positions[endOffset + 1],
      progress,
    )
    positions[offset + 2] = lerp(
      positions[startOffset + 2],
      positions[endOffset + 2],
      progress,
    )
    indices.push(previousVertexIndex, nextIndex)
    previousVertexIndex = nextIndex
    nextIndex += 1
  }

  indices.push(previousVertexIndex, endVertexIndex)

  return nextIndex
}

function getLatticeVertexIndex(
  xIndex: number,
  yIndex: number,
  zIndex: number,
  pointsPerAxis: number,
) {
  return zIndex * pointsPerAxis ** 2 + yIndex * pointsPerAxis + xIndex
}

function getDistanceToWell(
  point: SpacetimeLatticePoint,
  well: SpacetimeLatticeWell,
) {
  return Math.hypot(
    well.centerX - point.x,
    well.centerY - point.y,
    well.centerZ - point.z,
  )
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress
}

function smoothstep(progress: number) {
  const safeProgress = clamp(progress, 0, 1)

  return safeProgress ** 2 * (3 - 2 * safeProgress)
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value))
}
