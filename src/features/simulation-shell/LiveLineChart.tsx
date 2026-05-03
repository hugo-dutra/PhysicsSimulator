import {
  memo,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { themeTokens } from '../../theme/appTheme'
import {
  deriveYRange,
  type ChartTrace,
  type ChartYAxisMode,
} from './LiveLineChartModel'

type LiveLineChartProps = {
  action?: ReactNode
  title: string
  xAxisRange?: [number, number]
  yAxisMode?: ChartYAxisMode
  yAxisTitle: string
  traces: ChartTrace[]
}

type RenderInput = {
  allTraces: ChartTrace[]
  traces: ChartTrace[]
  xAxisRange?: [number, number]
  yAxisMode: ChartYAxisMode
  yAxisTitle: string
}

type CanvasSize = {
  height: number
  pixelRatio: number
  width: number
}

type Point = {
  x: number
  y: number
}

const chartHeight = 228
const plotPadding = {
  bottom: 34,
  left: 72,
  right: 18,
  top: 20,
}
const chartNumber = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
})

export const LiveLineChart = memo(function LiveLineChart({
  action,
  title,
  traces,
  xAxisRange,
  yAxisMode = 'auto',
  yAxisTitle,
}: LiveLineChartProps) {
  const chartId = useId()
  const [hiddenTraceNames, setHiddenTraceNames] = useState<Set<string>>(
    () => new Set(),
  )
  const activeHiddenTraceNames = useMemo(() => {
    const traceNames = new Set(traces.map((trace) => trace.name))

    return new Set([...hiddenTraceNames].filter((name) => traceNames.has(name)))
  }, [hiddenTraceNames, traces])
  const visibleTraces = useMemo(
    () => traces.filter((trace) => !activeHiddenTraceNames.has(trace.name)),
    [activeHiddenTraceNames, traces],
  )
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<RenderInput>({
    allTraces: traces,
    traces: visibleTraces,
    xAxisRange,
    yAxisMode,
    yAxisTitle,
  })
  const canvasSizeRef = useRef<CanvasSize>({
    height: chartHeight,
    pixelRatio: 1,
    width: 0,
  })

  useEffect(() => {
    inputRef.current = {
      allTraces: traces,
      traces: visibleTraces,
      xAxisRange,
      yAxisMode,
      yAxisTitle,
    }
  }, [traces, visibleTraces, xAxisRange, yAxisMode, yAxisTitle])

  const handleTraceToggle = (traceName: string) => {
    setHiddenTraceNames((current) => {
      const next = new Set(current)

      if (next.has(traceName)) {
        next.delete(traceName)
      } else {
        next.add(traceName)
      }

      return next
    })
  }

  useEffect(() => {
    if (import.meta.env.MODE === 'test') {
      return
    }

    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')

    if (!canvas || !context) {
      return
    }

    let frameId = 0
    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect()
      const pixelRatio = Math.min(2, window.devicePixelRatio || 1)
      const width = Math.max(1, bounds.width)
      const height = Math.max(1, bounds.height)

      canvasSizeRef.current = {
        height,
        pixelRatio,
        width,
      }
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
    }

    resizeCanvas()

    const observer =
      typeof ResizeObserver === 'function'
        ? new ResizeObserver(resizeCanvas)
        : null

    observer?.observe(canvas)

    const renderFrame = () => {
      const input = inputRef.current
      const xAxisRange = normalizeRange(
        input.xAxisRange ?? deriveXRange(input.allTraces),
      )
      const headTime = readLatestTime(input.allTraces)

      drawChart(context, canvasSizeRef.current, {
        headTime,
        traces: input.traces,
        xAxisRange,
        yAxisMode: input.yAxisMode,
        yAxisTitle: input.yAxisTitle,
      })

      frameId = window.requestAnimationFrame(renderFrame)
    }

    frameId = window.requestAnimationFrame(renderFrame)

    return () => {
      observer?.disconnect()
      window.cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <Box
      sx={{
        bgcolor: alpha(themeTokens.panel, 0.62),
        border: `1px solid ${themeTokens.border}`,
        borderRadius: 1,
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          borderBottom: `1px solid ${themeTokens.border}`,
          gap: 1,
          justifyContent: 'space-between',
          px: 1.25,
          py: 0.875,
        }}
      >
        <Typography id={chartId} sx={{ minWidth: 0 }} variant="body2">
          {title}
        </Typography>
        {action}
      </Stack>
      {traces.length > 0 ? (
        <ChartLegend
          chartTitle={title}
          hiddenTraceNames={activeHiddenTraceNames}
          onTraceToggle={handleTraceToggle}
          traces={traces}
        />
      ) : null}
      <Box aria-labelledby={chartId} role="img">
        <Box sx={{ height: chartHeight, minWidth: 0 }}>
          <canvas
            ref={canvasRef}
            style={{
              display: 'block',
              height: '100%',
              width: '100%',
            }}
          />
        </Box>
      </Box>
    </Box>
  )
})

function drawChart(
  context: CanvasRenderingContext2D,
  size: CanvasSize,
  input: {
    headTime: number
    traces: ChartTrace[]
    xAxisRange: [number, number]
    yAxisMode: ChartYAxisMode
    yAxisTitle: string
  },
) {
  context.setTransform(size.pixelRatio, 0, 0, size.pixelRatio, 0, 0)
  context.clearRect(0, 0, size.width, size.height)
  context.fillStyle = themeTokens.background
  context.fillRect(0, 0, size.width, size.height)

  const plot = {
    height: size.height - plotPadding.top - plotPadding.bottom,
    width: size.width - plotPadding.left - plotPadding.right,
    x: plotPadding.left,
    y: plotPadding.top,
  }
  const yRange = deriveYRange(
    input.traces,
    input.xAxisRange,
    input.yAxisMode,
  )
  const scale = createScale(plot, input.xAxisRange, yRange)

  context.fillStyle = themeTokens.background
  context.fillRect(plot.x, plot.y, plot.width, plot.height)
  drawGrid(context, plot, input.xAxisRange, yRange)
  drawZeroAxis(context, plot, yRange, scale.y)

  context.save()
  context.beginPath()
  context.rect(plot.x, plot.y, plot.width, plot.height)
  context.clip()
  drawTimeCursor(context, plot, input.headTime, scale.x)
  drawTraces(context, input.traces, input.xAxisRange, input.headTime, scale)
  context.restore()

  drawAxes(context, plot, input.yAxisTitle)
  context.setTransform(1, 0, 0, 1, 0, 0)
}

function drawGrid(
  context: CanvasRenderingContext2D,
  plot: { height: number; width: number; x: number; y: number },
  xRange: [number, number],
  yRange: [number, number],
) {
  context.strokeStyle = alpha(themeTokens.border, 0.72)
  context.lineWidth = 1
  context.font = '10px Inter, Segoe UI, Arial, sans-serif'
  context.fillStyle = themeTokens.muted
  context.textBaseline = 'middle'

  for (let index = 0; index <= 4; index += 1) {
    const ratio = index / 4
    const y = plot.y + plot.height * ratio
    const yValue = yRange[1] - (yRange[1] - yRange[0]) * ratio

    context.beginPath()
    context.moveTo(plot.x, y)
    context.lineTo(plot.x + plot.width, y)
    context.stroke()
    context.textAlign = 'right'
    context.fillText(chartNumber.format(yValue), plot.x - 8, y)
  }

  context.textBaseline = 'top'
  for (let index = 0; index <= 4; index += 1) {
    const ratio = index / 4
    const x = plot.x + plot.width * ratio
    const xValue = xRange[0] + (xRange[1] - xRange[0]) * ratio

    context.beginPath()
    context.moveTo(x, plot.y)
    context.lineTo(x, plot.y + plot.height)
    context.stroke()
    context.textAlign = 'center'
    context.fillText(chartNumber.format(xValue), x, plot.y + plot.height + 8)
  }

  context.fillStyle = themeTokens.muted
  context.textAlign = 'center'
  context.fillText('tempo (s)', plot.x + plot.width / 2, plot.y + plot.height + 22)
}

function drawAxes(
  context: CanvasRenderingContext2D,
  plot: { height: number; width: number; x: number; y: number },
  yAxisTitle: string,
) {
  context.strokeStyle = themeTokens.border
  context.lineWidth = 1
  context.beginPath()
  context.rect(plot.x, plot.y, plot.width, plot.height)
  context.stroke()

  context.fillStyle = themeTokens.muted
  context.font = '10px Inter, Segoe UI, Arial, sans-serif'
  context.textAlign = 'left'
  context.textBaseline = 'top'
  context.fillText(yAxisTitle, plot.x, 6)
}

function drawTimeCursor(
  context: CanvasRenderingContext2D,
  plot: { height: number; width: number; x: number; y: number },
  headTime: number,
  xScale: (value: number) => number,
) {
  const x = xScale(headTime)

  if (x < plot.x || x > plot.x + plot.width) {
    return
  }

  context.strokeStyle = alpha(themeTokens.teal, 0.26)
  context.lineWidth = 1
  context.beginPath()
  context.moveTo(x, plot.y)
  context.lineTo(x, plot.y + plot.height)
  context.stroke()
}

function drawTraces(
  context: CanvasRenderingContext2D,
  traces: ChartTrace[],
  xAxisRange: [number, number],
  headTime: number,
  scale: ReturnType<typeof createScale>,
) {
  const maxX = Math.min(headTime, xAxisRange[1])

  traces.forEach((trace) => {
    const points = readVisiblePoints(trace, xAxisRange[0], maxX)

    if (points.length < 2) {
      return
    }

    context.strokeStyle = trace.lineColor
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.lineWidth = 2
    context.beginPath()
    context.moveTo(scale.x(points[0].x), scale.y(points[0].y))

    for (let index = 1; index < points.length; index += 1) {
      const point = points[index]
      context.lineTo(scale.x(point.x), scale.y(point.y))
    }

    const lastPoint = points.at(-1)

    if (lastPoint) {
      context.lineTo(scale.x(lastPoint.x), scale.y(lastPoint.y))
      context.stroke()
      context.fillStyle = trace.lineColor
      context.beginPath()
      context.arc(scale.x(lastPoint.x), scale.y(lastPoint.y), 3, 0, Math.PI * 2)
      context.fill()
    }
  })
}

function drawZeroAxis(
  context: CanvasRenderingContext2D,
  plot: { height: number; width: number; x: number; y: number },
  yRange: [number, number],
  yScale: (value: number) => number,
) {
  if (yRange[0] > 0 || yRange[1] < 0) {
    return
  }

  const y = yScale(0)

  context.strokeStyle = alpha(themeTokens.text, 0.22)
  context.lineWidth = 1
  context.beginPath()
  context.moveTo(plot.x, y)
  context.lineTo(plot.x + plot.width, y)
  context.stroke()
}

function createScale(
  plot: { height: number; width: number; x: number; y: number },
  xRange: [number, number],
  yRange: [number, number],
) {
  return {
    x: (value: number) =>
      plot.x + ((value - xRange[0]) / (xRange[1] - xRange[0])) * plot.width,
    y: (value: number) =>
      plot.y +
      plot.height -
      ((value - yRange[0]) / (yRange[1] - yRange[0])) * plot.height,
  }
}

function readVisiblePoints(trace: ChartTrace, minX: number, maxX: number) {
  const points: Point[] = []

  if (maxX <= minX || trace.x.length === 0) {
    return points
  }

  for (let index = 0; index < trace.x.length; index += 1) {
    const x = trace.x[index]
    const y = trace.y[index]
    const previousX = trace.x[index - 1]
    const previousY = trace.y[index - 1]

    if (index > 0 && previousX < minX && x >= minX) {
      points.push({
        x: minX,
        y: interpolateAtX(previousX, previousY, x, y, minX),
      })
    }

    if (x >= minX && x <= maxX) {
      points.push({ x, y })
    }

    if (index > 0 && previousX <= maxX && x > maxX) {
      points.push({
        x: maxX,
        y: interpolateAtX(previousX, previousY, x, y, maxX),
      })
      break
    }
  }

  return points
}

function deriveXRange(traces: ChartTrace[]): [number, number] {
  const values = traces.flatMap((trace) => trace.x)

  if (values.length === 0) {
    return [0, 1]
  }

  return [Math.min(...values), Math.max(...values)]
}

function normalizeRange(range: [number, number]): [number, number] {
  if (range[1] - range[0] > 0.001) {
    return range
  }

  return [range[0], range[0] + 1]
}

function readLatestTime(traces: ChartTrace[]) {
  return traces.reduce((latest, trace) => {
    const time = trace.x.at(-1)

    return typeof time === 'number' && Number.isFinite(time)
      ? Math.max(latest, time)
      : latest
  }, 0)
}

function interpolateAtX(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  targetX: number,
) {
  if (endX === startX) {
    return endY
  }

  const ratio = (targetX - startX) / (endX - startX)

  return startY + (endY - startY) * ratio
}

function ChartLegend({
  chartTitle,
  hiddenTraceNames,
  onTraceToggle,
  traces,
}: {
  chartTitle: string
  hiddenTraceNames: Set<string>
  onTraceToggle: (traceName: string) => void
  traces: ChartTrace[]
}) {
  return (
    <Box
      sx={{
        borderBottom: `1px solid ${themeTokens.border}`,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.75,
        px: 1.25,
        py: 0.875,
      }}
    >
      {traces.map((trace) => (
        <Box
          aria-label={`${
            hiddenTraceNames.has(trace.name) ? 'Ligar' : 'Desligar'
          } serie ${trace.name} no grafico ${chartTitle}`}
          aria-pressed={!hiddenTraceNames.has(trace.name)}
          component="button"
          key={trace.name}
          onClick={() => {
            onTraceToggle(trace.name)
          }}
          sx={{
            alignItems: 'center',
            bgcolor: 'transparent',
            border: `1px solid ${
              hiddenTraceNames.has(trace.name)
                ? alpha(themeTokens.border, 0.72)
                : 'transparent'
            }`,
            borderRadius: 1,
            color: 'inherit',
            cursor: 'pointer',
            display: 'inline-flex',
            font: 'inherit',
            gap: 0.75,
            minWidth: 0,
            opacity: hiddenTraceNames.has(trace.name) ? 0.52 : 1,
            px: 0.5,
            py: 0.25,
            textAlign: 'left',
            transition: 'border-color 120ms ease, opacity 120ms ease',
            '&:focus-visible': {
              outline: `2px solid ${alpha(themeTokens.teal, 0.72)}`,
              outlineOffset: 2,
            },
            '&:hover': {
              borderColor: alpha(themeTokens.teal, 0.5),
              opacity: 1,
            },
          }}
          type="button"
        >
          <Box
            aria-hidden
            sx={{
              bgcolor: hiddenTraceNames.has(trace.name)
                ? 'transparent'
                : trace.lineColor,
              border: `1px solid ${trace.lineColor}`,
              borderRadius: 999,
              flex: '0 0 auto',
              height: 3,
              width: 18,
            }}
          />
          <Typography
            color="text.secondary"
            sx={{ overflowWrap: 'anywhere' }}
            variant="caption"
          >
            {trace.name}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}
