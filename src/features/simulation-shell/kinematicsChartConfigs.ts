import type {
  KinematicsSample,
  KinematicsSimulationId,
} from '../../lib/physics/kinematics'
import { themeTokens } from '../../theme/appTheme'
import type { ChartTrace } from './LiveLineChart'

export type KinematicsChartId =
  | 'acceleration'
  | 'angle'
  | 'energy'
  | 'position'
  | 'velocity'

export type KinematicsChartConfig = {
  id: KinematicsChartId
  title: string
  traces: ChartTrace[]
  yAxisTitle: string
}

const maxChartSamples = 480

export function prepareKinematicsChartSamples(samples: KinematicsSample[]) {
  return downsampleSamples(samples, maxChartSamples)
}

export function buildKinematicsChartConfigs(
  samples: KinematicsSample[],
  simulationId: KinematicsSimulationId,
  showEnergy: boolean,
) {
  const time = samples.map((sample) => sample.timeSeconds)
  const charts: KinematicsChartConfig[] = []

  if (simulationId === 'uniform-circular-motion') {
    charts.push(
      {
        id: 'angle',
        title: 'Angulo por tempo',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Angulo angular (rad)',
            x: time,
            y: samples.map((sample) => sample.angleRadians),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Arco percorrido (m)',
            x: time,
            y: samples.map((sample) => sample.positionMeters),
          },
        ],
        yAxisTitle: 'Angulo e arco',
      },
      {
        id: 'velocity',
        title: 'Velocidade tangencial por tempo',
        traces: [
          {
            lineColor: themeTokens.cyan,
            name: 'Velocidade tangencial (m/s)',
            x: time,
            y: samples.map((sample) => sample.speedMetersPerSecond),
          },
        ],
        yAxisTitle: 'Velocidade (metros por segundo)',
      },
      {
        id: 'acceleration',
        title: 'Aceleracao centripeta por tempo',
        traces: [
          {
            lineColor: themeTokens.warning,
            name: 'Aceleracao centripeta (m/s^2)',
            x: time,
            y: samples.map(
              (sample) =>
                sample.centripetalAccelerationMetersPerSecondSquared,
            ),
          },
        ],
        yAxisTitle: 'Aceleracao centripeta (m/s^2)',
      },
    )
  } else {
    charts.push(
      {
        id: 'position',
        title:
          simulationId === 'projectile-motion'
            ? 'Posicao e altura por tempo'
            : 'Posicao por tempo',
        traces:
          simulationId === 'projectile-motion'
            ? [
                {
                  lineColor: themeTokens.teal,
                  name: 'Posicao horizontal (m)',
                  x: time,
                  y: samples.map((sample) => sample.xMeters),
                },
                {
                  lineColor: themeTokens.cyan,
                  name: 'Altura vertical (m)',
                  x: time,
                  y: samples.map((sample) => sample.zMeters),
                },
              ]
            : [
                {
                  lineColor: themeTokens.teal,
                  name: 'Posicao (m)',
                  x: time,
                  y: samples.map((sample) => sample.positionMeters),
                },
                {
                  lineColor: themeTokens.cyan,
                  name: 'Deslocamento (m)',
                  x: time,
                  y: samples.map((sample) => sample.displacementMeters),
                },
              ],
        yAxisTitle:
          simulationId === 'projectile-motion'
            ? 'Posicao e altura (metros)'
            : 'Posicao (metros)',
      },
      {
        id: 'velocity',
        title:
          simulationId === 'projectile-motion'
            ? 'Velocidades por tempo'
            : 'Velocidade por tempo',
        traces:
          simulationId === 'projectile-motion'
            ? [
                {
                  lineColor: themeTokens.teal,
                  name: 'Velocidade horizontal (m/s)',
                  x: time,
                  y: samples.map((sample) => sample.velocityXMetersPerSecond),
                },
                {
                  lineColor: themeTokens.warning,
                  name: 'Velocidade vertical (m/s)',
                  x: time,
                  y: samples.map((sample) => sample.velocityZMetersPerSecond),
                },
                {
                  lineColor: themeTokens.cyan,
                  name: 'Modulo da velocidade (m/s)',
                  x: time,
                  y: samples.map((sample) => sample.speedMetersPerSecond),
                },
              ]
            : [
                {
                  lineColor: themeTokens.cyan,
                  name: 'Velocidade (m/s)',
                  x: time,
                  y: samples.map((sample) => sample.velocityMetersPerSecond),
                },
              ],
        yAxisTitle: 'Velocidade (metros por segundo)',
      },
    )

    if (simulationId !== 'uniform-linear-motion') {
      charts.push({
        id: 'acceleration',
        title: 'Aceleracao por tempo',
        traces: [
          {
            lineColor: themeTokens.warning,
            name:
              simulationId === 'projectile-motion'
                ? 'Aceleracao gravitacional (m/s^2)'
                : 'Aceleracao (m/s^2)',
            x: time,
            y: samples.map(
              (sample) => sample.accelerationMetersPerSecondSquared,
            ),
          },
        ],
        yAxisTitle: 'Aceleracao (metros por segundo ao quadrado)',
      })
    }
  }

  if (showEnergy) {
    charts.push({
      id: 'energy',
      title: 'Energia por tempo',
      traces:
        simulationId === 'projectile-motion'
          ? [
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
                lineColor: themeTokens.cyan,
                name: 'Energia mecanica total (J)',
                x: time,
                y: samples.map((sample) => sample.totalEnergyJoules),
              },
            ]
          : [
              {
                lineColor: themeTokens.vector,
                name: 'Energia cinetica (J)',
                x: time,
                y: samples.map((sample) => sample.kineticEnergyJoules),
              },
              {
                lineColor: themeTokens.cyan,
                name: 'Energia total do modelo (J)',
                x: time,
                y: samples.map((sample) => sample.totalEnergyJoules),
              },
            ],
      yAxisTitle: 'Energia (joules)',
    })
  }

  return charts
}

function downsampleSamples(samples: KinematicsSample[], maxSampleCount: number) {
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
