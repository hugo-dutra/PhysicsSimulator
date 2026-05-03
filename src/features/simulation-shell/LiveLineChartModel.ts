export type ChartTrace = {
  x: number[]
  y: number[]
  name: string
  lineColor: string
}

export type ChartYAxisMode = 'auto' | 'zero-centered'

const nearConstantAbsoluteTolerance = 1e-9
const nearConstantRelativeTolerance = 1e-9

export function deriveYRange(
  traces: ChartTrace[],
  xAxisRange: [number, number],
  yAxisMode: ChartYAxisMode = 'auto',
): [number, number] {
  const values = traces.flatMap((trace) =>
    trace.y.filter((value, index) => {
      const x = trace.x[index]

      return (
        Number.isFinite(value) &&
        x >= xAxisRange[0] &&
        x <= xAxisRange[1]
      )
    }),
  )

  if (values.length === 0) {
    return [-1, 1]
  }

  const min = Math.min(...values)
  const max = Math.max(...values)

  if (yAxisMode === 'zero-centered') {
    const maxMagnitude = Math.max(1, Math.abs(min), Math.abs(max))
    const paddedMagnitude = maxMagnitude * 1.12

    return [-paddedMagnitude, paddedMagnitude]
  }

  const valueMagnitude = Math.max(1, Math.abs(min), Math.abs(max))
  const span = max - min

  if (span <= getNearConstantTolerance(valueMagnitude)) {
    const center = (min + max) / 2
    const padding = valueMagnitude * 0.12

    return [center - padding, center + padding]
  }

  const padding = span * 0.12

  return [min - padding, max + padding]
}

function getNearConstantTolerance(valueMagnitude: number) {
  return Math.max(
    nearConstantAbsoluteTolerance,
    valueMagnitude * nearConstantRelativeTolerance,
  )
}
