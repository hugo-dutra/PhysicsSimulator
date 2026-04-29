import type { PendulumSample } from '../../lib/physics/pendulum'
import { themeTokens } from '../../theme/appTheme'
import type { ChartTrace } from './LiveLineChart'

export type PendulumChartId =
  | 'acceleration'
  | 'angle'
  | 'energy'
  | 'linearVelocity'
  | 'velocity'

export type PendulumChartConfig = {
  id: PendulumChartId
  title: string
  traces: ChartTrace[]
  yAxisTitle: string
}

const maxChartSamples = 480

export function preparePendulumChartSamples(samples: PendulumSample[]) {
  return downsampleSamples(samples, maxChartSamples)
}

export function buildPendulumChartConfigs(
  samples: PendulumSample[],
  showEnergy: boolean,
) {
  const time = samples.map((sample) => sample.timeSeconds)
  const charts: PendulumChartConfig[] = [
    {
      id: 'angle',
      title: 'Angulo do pendulo por tempo',
      traces: [
        {
          x: time,
          y: samples.map((sample) => radiansToDegrees(sample.angleRadians)),
          name: 'Angulo do pendulo (deg)',
          lineColor: themeTokens.teal,
        },
      ],
      yAxisTitle: 'Angulo do pendulo (graus)',
    },
    {
      id: 'velocity',
      title: 'Velocidade angular por tempo',
      traces: [
        {
          x: time,
          y: samples.map(
            (sample) => sample.angularVelocityRadiansPerSecond,
          ),
          name: 'Velocidade angular (rad/s)',
          lineColor: themeTokens.cyan,
        },
      ],
      yAxisTitle: 'Velocidade angular (radianos por segundo)',
    },
    {
      id: 'linearVelocity',
      title: 'Velocidade linear tangencial por tempo',
      traces: [
        {
          x: time,
          y: samples.map((sample) => sample.linearVelocityMetersPerSecond),
          name: 'Velocidade linear tangencial (m/s)',
          lineColor: themeTokens.vector,
        },
      ],
      yAxisTitle: 'Velocidade linear tangencial (metros por segundo)',
    },
    {
      id: 'acceleration',
      title: 'Aceleracao por tempo',
      traces: [
        {
          x: time,
          y: samples.map(
            (sample) => sample.tangentialAccelerationMetersPerSecondSquared,
          ),
          name: 'Aceleracao tangencial (m/s^2)',
          lineColor: themeTokens.warning,
        },
        {
          x: time,
          y: samples.map(
            (sample) => sample.radialAccelerationMetersPerSecondSquared,
          ),
          name: 'Aceleracao radial (m/s^2)',
          lineColor: themeTokens.vector,
        },
        {
          x: time,
          y: samples.map(
            (sample) => sample.totalAccelerationMetersPerSecondSquared,
          ),
          name: 'Aceleracao total (m/s^2)',
          lineColor: themeTokens.cyan,
        },
      ],
      yAxisTitle: 'Aceleracao (metros por segundo ao quadrado)',
    },
  ]

  if (showEnergy) {
    charts.push({
      id: 'energy',
      title: 'Energia mecanica por tempo',
      traces: [
        {
          x: time,
          y: samples.map((sample) => sample.kineticEnergyJoules),
          name: 'Energia cinetica (J)',
          lineColor: themeTokens.vector,
        },
        {
          x: time,
          y: samples.map((sample) => sample.potentialEnergyJoules),
          name: 'Energia potencial (J)',
          lineColor: themeTokens.warning,
        },
        {
          x: time,
          y: samples.map((sample) => sample.totalEnergyJoules),
          name: 'Energia mecanica total (J)',
          lineColor: themeTokens.cyan,
        },
      ],
      yAxisTitle: 'Energia mecanica (joules)',
    })
  }

  return charts
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
