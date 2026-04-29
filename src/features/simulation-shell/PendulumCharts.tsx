import { useMemo } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { PendulumSample } from '../../lib/physics/pendulum'
import { themeTokens } from '../../theme/appTheme'
import { PlotlyChart, type PlotlyTrace } from './PlotlyChart'

type PendulumChartsProps = {
  durationSeconds: number
  samples: PendulumSample[]
  showEnergy: boolean
}

const maxChartSamples = 160

export function PendulumCharts({
  durationSeconds,
  samples,
  showEnergy,
}: PendulumChartsProps) {
  const chartSamples = useMemo(
    () => downsampleSamples(samples, maxChartSamples),
    [samples],
  )
  const xAxisRange = useMemo<[number, number]>(
    () => [0, durationSeconds],
    [durationSeconds],
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
      ] satisfies PlotlyTrace[],
      velocity: [
        {
          x: time,
          y: chartSamples.map(
            (sample) => sample.angularVelocityRadiansPerSecond,
          ),
          name: 'omega',
          lineColor: themeTokens.cyan,
        },
      ] satisfies PlotlyTrace[],
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
      ] satisfies PlotlyTrace[],
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
            Series Plotly escritas com as amostras ja percorridas.
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: { xs: '1fr', xl: 'repeat(3, minmax(0, 1fr))' },
          }}
        >
          <PlotlyChart
            title="Angulo por tempo"
            traces={chartData.angle}
            xAxisRange={xAxisRange}
            yAxisTitle="theta (deg)"
          />
          <PlotlyChart
            title="Velocidade angular"
            traces={chartData.velocity}
            xAxisRange={xAxisRange}
            yAxisTitle="omega (rad/s)"
          />
          {showEnergy ? (
            <PlotlyChart
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
}

function radiansToDegrees(value: number) {
  return (value * 180) / Math.PI
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
