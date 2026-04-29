import { useEffect, useId, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { themeTokens } from '../../theme/appTheme'

export type PlotlyTrace = {
  x: number[]
  y: number[]
  name: string
  lineColor: string
}

type PlotlyChartProps = {
  title: string
  xAxisRange?: [number, number]
  yAxisTitle: string
  traces: PlotlyTrace[]
}

type PlotlyModule = {
  react: (
    element: HTMLDivElement,
    data: unknown[],
    layout: Record<string, unknown>,
    config: Record<string, unknown>,
  ) => Promise<unknown>
  purge: (element: HTMLDivElement) => void
}

const plotRenderDelayMs = 80

export function PlotlyChart({
  title,
  traces,
  xAxisRange,
  yAxisTitle,
}: PlotlyChartProps) {
  const chartId = useId()
  const chartRef = useRef<HTMLDivElement>(null)
  const plotlyRef = useRef<PlotlyModule | null>(null)
  const renderVersionRef = useRef(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const element = chartRef.current

    if (!element || import.meta.env.MODE === 'test') {
      return
    }

    const chartElement = element
    let cancelled = false
    const renderVersion = renderVersionRef.current + 1

    renderVersionRef.current = renderVersion

    async function renderChart() {
      try {
        let plotly = plotlyRef.current

        if (!plotly) {
          const module = await import('plotly.js-basic-dist-min')

          plotly = (module.default ?? module) as PlotlyModule
          plotlyRef.current = plotly

          if (cancelled) {
            return
          }
        }

        await plotly.react(
          chartElement,
          traces.map((trace) => ({
            x: trace.x,
            y: trace.y,
            name: trace.name,
            type: 'scatter',
            mode: 'lines',
            line: {
              color: trace.lineColor,
              width: 2,
            },
          })),
          {
            autosize: true,
            height: 228,
            margin: {
              b: 42,
              l: 54,
              r: 18,
              t: 8,
            },
            paper_bgcolor: themeTokens.panel,
            plot_bgcolor: themeTokens.background,
            font: {
              color: themeTokens.text,
              family: 'Inter, Segoe UI, Arial, sans-serif',
              size: 11,
            },
            legend: {
              orientation: 'h',
              y: 1.18,
            },
            xaxis: {
              color: themeTokens.muted,
              gridcolor: themeTokens.border,
              range: xAxisRange,
              title: {
                text: 'tempo (s)',
              },
              zerolinecolor: themeTokens.border,
            },
            yaxis: {
              color: themeTokens.muted,
              gridcolor: themeTokens.border,
              title: {
                text: yAxisTitle,
              },
              zerolinecolor: themeTokens.border,
            },
          },
          {
            displayModeBar: false,
            responsive: true,
          },
        )

        if (!cancelled && renderVersion === renderVersionRef.current) {
          setError(null)
        }
      } catch {
        if (!cancelled && renderVersion === renderVersionRef.current) {
          setError('Grafico Plotly indisponivel.')
        }
      }
    }

    const renderTimeoutId = window.setTimeout(() => {
      void renderChart()
    }, plotRenderDelayMs)

    return () => {
      cancelled = true
      window.clearTimeout(renderTimeoutId)
    }
  }, [traces, xAxisRange, yAxisTitle])

  useEffect(
    () => () => {
      const element = chartRef.current

      if (element && plotlyRef.current) {
        plotlyRef.current.purge(element)
      }
    },
    [],
  )

  return (
    <Box
      aria-labelledby={chartId}
      role="img"
      sx={{
        bgcolor: alpha(themeTokens.panel, 0.62),
        border: `1px solid ${themeTokens.border}`,
        borderRadius: 1,
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      <Typography
        id={chartId}
        sx={{
          borderBottom: `1px solid ${themeTokens.border}`,
          px: 1.25,
          py: 0.875,
        }}
        variant="body2"
      >
        {title}
      </Typography>
      <Box
        ref={chartRef}
        sx={{
          height: 228,
          minWidth: 0,
        }}
      />
      {error ? (
        <Typography color="text.secondary" sx={{ px: 1.25, pb: 1 }} variant="body2">
          {error}
        </Typography>
      ) : null}
    </Box>
  )
}
