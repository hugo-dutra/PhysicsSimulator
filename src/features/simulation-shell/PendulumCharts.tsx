import { memo, useMemo } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { PendulumSample } from '../../lib/physics/pendulum'
import { themeTokens } from '../../theme/appTheme'
import { LiveLineChart, type ChartTrace } from './LiveLineChart'

type PendulumChartsProps = {
  chartWindowSeconds: number
  samples: PendulumSample[]
  showEnergy: boolean
  xAxisRange: [number, number]
}

const maxChartSamples = 480
const compactSeconds = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
})

export const PendulumCharts = memo(function PendulumCharts({
  chartWindowSeconds,
  samples,
  showEnergy,
  xAxisRange,
}: PendulumChartsProps) {
  const chartSamples = useMemo(
    () => downsampleSamples(samples, maxChartSamples),
    [samples],
  )
  const chartData = useMemo(() => {
    const time = chartSamples.map((sample) => sample.timeSeconds)

    return {
      angle: [
        {
          x: time,
          y: chartSamples.map((sample) =>
            radiansToDegrees(sample.angleRadians),
          ),
          name: 'theta',
          lineColor: themeTokens.teal,
        },
      ] satisfies ChartTrace[],
      velocity: [
        {
          x: time,
          y: chartSamples.map(
            (sample) => sample.angularVelocityRadiansPerSecond,
          ),
          name: 'omega',
          lineColor: themeTokens.cyan,
        },
      ] satisfies ChartTrace[],
      energy: [
        {
          x: time,
          y: chartSamples.map((sample) => sample.kineticEnergyJoules),
          name: 'cinetica',
          lineColor: themeTokens.vector,
        },
        {
          x: time,
          y: chartSamples.map((sample) => sample.potentialEnergyJoules),
          name: 'potencial',
          lineColor: themeTokens.warning,
        },
        {
          x: time,
          y: chartSamples.map((sample) => sample.totalEnergyJoules),
          name: 'total',
          lineColor: themeTokens.cyan,
        },
      ] satisfies ChartTrace[],
    }
  }, [chartSamples])

  return (
    <Box
      component="section"
      sx={{
        bgcolor: alpha(themeTokens.panel, 0.42),
        border: `1px solid ${themeTokens.border}`,
        borderRadius: 1,
        p: 1.5,
      }}
    >
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="h2">Graficos</Typography>
          <Typography color="text.secondary" variant="body2">
            Janela movel de {formatSeconds(chartWindowSeconds)} com{' '}
            {chartSamples.length} pontos visiveis.
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: { xs: '1fr', xl: 'repeat(3, minmax(0, 1fr))' },
          }}
        >
          <LiveLineChart
            title="Angulo por tempo"
            traces={chartData.angle}
            xAxisRange={xAxisRange}
            yAxisTitle="theta (deg)"
          />
          <LiveLineChart
            title="Velocidade angular"
            traces={chartData.velocity}
            xAxisRange={xAxisRange}
            yAxisTitle="omega (rad/s)"
          />
          {showEnergy ? (
            <LiveLineChart
              title="Energia mecanica"
              traces={chartData.energy}
              xAxisRange={xAxisRange}
              yAxisTitle="energia (J)"
            />
          ) : null}
        </Box>
      </Stack>
    </Box>
  )
})

function radiansToDegrees(value: number) {
  return (value * 180) / Math.PI
}

function formatSeconds(value: number) {
  return `${compactSeconds.format(value)} s`
}

function downsampleSamples(samples: PendulumSample[], maxSampleCount: number) {
  if (samples.length <= maxSampleCount) {
    return samples
  }

  const stride = Math.ceil(samples.length / maxSampleCount)
  const decimatedSamples = samples.filter((_, index) => index % stride === 0)
  const lastSample = samples.at(-1)

  if (lastSample && decimatedSamples.at(-1) !== lastSample) {
    decimatedSamples.push(lastSample)
  }

  return decimatedSamples
}
