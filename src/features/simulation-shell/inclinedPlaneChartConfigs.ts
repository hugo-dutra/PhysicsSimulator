import type { InclinedPlaneSample } from '../../lib/physics/inclinedPlane'
import { themeTokens } from '../../theme/appTheme'
import type { ChartTrace } from './LiveLineChart'

export type InclinedPlaneChartId =
  | 'acceleration'
  | 'energy'
  | 'forces'
  | 'position'
  | 'velocity'

export type InclinedPlaneChartConfig = {
  id: InclinedPlaneChartId
  title: string
  traces: ChartTrace[]
  yAxisTitle: string
}

const maxChartSamples = 480

export function prepareInclinedPlaneChartSamples(
  samples: InclinedPlaneSample[],
) {
  return downsampleSamples(samples, maxChartSamples)
}

export function buildInclinedPlaneChartConfigs(
  samples: InclinedPlaneSample[],
) {
  const time = samples.map((sample) => sample.timeSeconds)
  const charts: InclinedPlaneChartConfig[] = [
    {
      id: 'position',
      title: 'Posicao no plano por tempo',
      traces: [
        {
          lineColor: themeTokens.teal,
          name: 'Posicao ao longo do plano (m)',
          x: time,
          y: samples.map((sample) => sample.positionMeters),
        },
        {
          lineColor: themeTokens.cyan,
          name: 'Altura vertical (m)',
          x: time,
          y: samples.map((sample) => sample.heightMeters),
        },
      ],
      yAxisTitle: 'Posicao e altura (metros)',
    },
    {
      id: 'velocity',
      title: 'Velocidade no plano por tempo',
      traces: [
        {
          lineColor: themeTokens.cyan,
          name: 'Velocidade ao longo do plano (m/s)',
          x: time,
          y: samples.map((sample) => sample.velocityMetersPerSecond),
        },
      ],
      yAxisTitle: 'Velocidade (metros por segundo)',
    },
    {
      id: 'acceleration',
      title: 'Aceleracao no plano por tempo',
      traces: [
        {
          lineColor: themeTokens.warning,
          name: 'Aceleracao ao longo do plano (m/s^2)',
          x: time,
          y: samples.map(
            (sample) => sample.accelerationMetersPerSecondSquared,
          ),
        },
      ],
      yAxisTitle: 'Aceleracao (metros por segundo ao quadrado)',
    },
    {
      id: 'forces',
      title: 'Forcas no plano por tempo',
      traces: [
        {
          lineColor: themeTokens.danger,
          name: 'Componente do peso no plano (N)',
          x: time,
          y: samples.map((sample) => sample.weightParallelNewtons),
        },
        {
          lineColor: themeTokens.vector,
          name: 'Forca normal (N)',
          x: time,
          y: samples.map((sample) => sample.normalForceNewtons),
        },
        {
          lineColor: themeTokens.warning,
          name: 'Modulo do atrito (N)',
          x: time,
          y: samples.map((sample) => sample.frictionMagnitudeNewtons),
        },
        {
          lineColor: themeTokens.cyan,
          name: 'Forca resultante no plano (N)',
          x: time,
          y: samples.map((sample) => sample.netForceNewtons),
        },
      ],
      yAxisTitle: 'Forca (newtons)',
    },
    {
      id: 'energy',
      title: 'Energia por tempo',
      traces: [
        {
          lineColor: themeTokens.vector,
          name: 'Energia cinetica (J)',
          x: time,
          y: samples.map((sample) => sample.kineticEnergyJoules),
        },
        {
          lineColor: themeTokens.warning,
          name: 'Energia potencial (J)',
          x: time,
          y: samples.map((sample) => sample.potentialEnergyJoules),
        },
        {
          lineColor: themeTokens.danger,
          name: 'Energia termica acumulada (J)',
          x: time,
          y: samples.map((sample) => sample.thermalEnergyJoules),
        },
        {
          lineColor: themeTokens.cyan,
          name: 'Energia total do modelo (J)',
          x: time,
          y: samples.map((sample) => sample.totalEnergyJoules),
        },
      ],
      yAxisTitle: 'Energia (joules)',
    },
  ]

  return charts
}

function downsampleSamples(
  samples: InclinedPlaneSample[],
  maxSampleCount: number,
) {
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
