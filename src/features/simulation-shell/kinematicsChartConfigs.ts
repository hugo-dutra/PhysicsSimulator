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
  | 'forces'
  | 'momentum'
  | 'position'
  | 'torque'
  | 'velocity'
  | 'work'

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

  if (simulationId === 'atwood-machine') {
    charts.push(
      {
        id: 'position',
        title: 'Deslocamento das massas por tempo',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Deslocamento da massa 2 (m)',
            x: time,
            y: samples.map((sample) => sample.positionMeters),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Altura da massa 1 (m)',
            x: time,
            y: samples.map((sample) => sample.secondaryZMeters),
          },
        ],
        yAxisTitle: 'Posicao (metros)',
      },
      {
        id: 'velocity',
        title: 'Velocidade por tempo',
        traces: [
          {
            lineColor: themeTokens.cyan,
            name: 'Velocidade das massas (m/s)',
            x: time,
            y: samples.map((sample) => sample.velocityMetersPerSecond),
          },
        ],
        yAxisTitle: 'Velocidade (metros por segundo)',
      },
      {
        id: 'forces',
        title: 'Tensao e resultante por tempo',
        traces: [
          {
            lineColor: themeTokens.vector,
            name: 'Tensao no fio (N)',
            x: time,
            y: samples.map((sample) => sample.tensionNewtons),
          },
          {
            lineColor: themeTokens.warning,
            name: 'Forca resultante do sistema (N)',
            x: time,
            y: samples.map((sample) => sample.netForceNewtons),
          },
        ],
        yAxisTitle: 'Forca (newtons)',
      },
    )
  } else if (simulationId === 'centripetal-force-curve') {
    charts.push(
      {
        id: 'angle',
        title: 'Angulo e arco por tempo',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Angulo na curva (rad)',
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
        id: 'forces',
        title: 'Forca centripeta e atrito por tempo',
        traces: [
          {
            lineColor: themeTokens.warning,
            name: 'Forca centripeta requerida (N)',
            x: time,
            y: samples.map((sample) => sample.centripetalForceNewtons),
          },
          {
            lineColor: themeTokens.vector,
            name: 'Atrito estatico maximo (N)',
            x: time,
            y: samples.map((sample) => sample.maxStaticFrictionNewtons),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Atrito lateral usado (N)',
            x: time,
            y: samples.map((sample) => sample.frictionForceNewtons),
          },
        ],
        yAxisTitle: 'Forca (newtons)',
      },
      {
        id: 'acceleration',
        title: 'Aceleracao centripeta por tempo',
        traces: [
          {
            lineColor: themeTokens.warning,
            name: 'Aceleracao requerida pela curva (m/s^2)',
            x: time,
            y: samples.map(
              (sample) =>
                sample.centripetalAccelerationMetersPerSecondSquared,
            ),
          },
          {
            lineColor: themeTokens.vector,
            name: 'Aceleracao lateral real (m/s^2)',
            x: time,
            y: samples.map(
              (sample) => sample.accelerationMetersPerSecondSquared,
            ),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Uso do atrito disponivel',
            x: time,
            y: samples.map((sample) => sample.gripRatio),
          },
        ],
        yAxisTitle: 'Aceleracao e razao',
      },
    )
  } else if (simulationId === 'collisions-1d-2d') {
    charts.push(
      {
        id: 'position',
        title: 'Posicoes dos corpos por tempo',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Corpo 1 x (m)',
            x: time,
            y: samples.map((sample) => sample.xMeters),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Corpo 2 x (m)',
            x: time,
            y: samples.map((sample) => sample.secondaryXMeters),
          },
        ],
        yAxisTitle: 'Posicao (metros)',
      },
      {
        id: 'velocity',
        title: 'Velocidades dos corpos por tempo',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Rapidez do corpo 1 (m/s)',
            x: time,
            y: samples.map((sample) => sample.speedMetersPerSecond),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Rapidez do corpo 2 (m/s)',
            x: time,
            y: samples.map((sample) => sample.secondarySpeedMetersPerSecond),
          },
        ],
        yAxisTitle: 'Velocidade (metros por segundo)',
      },
      {
        id: 'momentum',
        title: 'Momento e impulso por tempo',
        traces: [
          {
            lineColor: themeTokens.vector,
            name: 'Momento linear total (kg m/s)',
            x: time,
            y: samples.map(
              (sample) => sample.momentumKilogramMetersPerSecond,
            ),
          },
          {
            lineColor: themeTokens.warning,
            name: 'Impulso acumulado no contato (N s)',
            x: time,
            y: samples.map((sample) => sample.impulseNewtonSeconds),
          },
        ],
        yAxisTitle: 'Momento e impulso',
      },
    )
  } else if (simulationId === 'particle-equilibrium') {
    charts.push(
      {
        id: 'forces',
        title: 'Forcas e resultante por tempo',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Forca A (N)',
            x: time,
            y: samples.map((sample) => sample.forceOneNewtons),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Forca B (N)',
            x: time,
            y: samples.map((sample) => sample.forceTwoNewtons),
          },
          {
            lineColor: themeTokens.vector,
            name: 'Forca C (N)',
            x: time,
            y: samples.map((sample) => sample.forceThreeNewtons),
          },
          {
            lineColor: themeTokens.danger,
            name: 'Resultante (N)',
            x: time,
            y: samples.map((sample) => sample.netForceNewtons),
          },
        ],
        yAxisTitle: 'Forca (newtons)',
      },
      {
        id: 'acceleration',
        title: 'Aceleracao por resultante',
        traces: [
          {
            lineColor: themeTokens.warning,
            name: 'Aceleracao da particula (m/s^2)',
            x: time,
            y: samples.map(
              (sample) => sample.accelerationMetersPerSecondSquared,
            ),
          },
        ],
        yAxisTitle: 'Aceleracao (metros por segundo ao quadrado)',
      },
    )
  } else if (simulationId === 'torque-levers-center-mass') {
    charts.push(
      {
        id: 'torque',
        title: 'Torque e centro de massa',
        traces: [
          {
            lineColor: themeTokens.warning,
            name: 'Torque resultante (N m)',
            x: time,
            y: samples.map((sample) => sample.netTorqueNewtonMeters),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Centro de massa relativo ao apoio (m)',
            x: time,
            y: samples.map((sample) => sample.centerOfMassMeters),
          },
        ],
        yAxisTitle: 'Torque e posicao',
      },
      {
        id: 'forces',
        title: 'Pesos e forca aplicada',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Peso esquerdo (N)',
            x: time,
            y: samples.map((sample) => sample.forceOneNewtons),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Peso direito (N)',
            x: time,
            y: samples.map((sample) => sample.forceTwoNewtons),
          },
          {
            lineColor: themeTokens.vector,
            name: 'Forca aplicada (N)',
            x: time,
            y: samples.map((sample) => sample.appliedForceNewtons),
          },
        ],
        yAxisTitle: 'Forca (newtons)',
      },
    )
  } else if (simulationId === 'rigid-body-rotation') {
    charts.push(
      {
        id: 'angle',
        title: 'Angulo e velocidade angular por tempo',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Angulo acumulado (rad)',
            x: time,
            y: samples.map((sample) => sample.angleRadians),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Velocidade angular (rad/s)',
            x: time,
            y: samples.map(
              (sample) => sample.angularVelocityRadiansPerSecond,
            ),
          },
        ],
        yAxisTitle: 'Rotacao',
      },
      {
        id: 'torque',
        title: 'Torque e aceleracao angular',
        traces: [
          {
            lineColor: themeTokens.warning,
            name: 'Torque aplicado (N m)',
            x: time,
            y: samples.map((sample) => sample.netTorqueNewtonMeters),
          },
          {
            lineColor: themeTokens.vector,
            name: 'Aceleracao angular (rad/s^2)',
            x: time,
            y: samples.map(
              (sample) =>
                sample.angularAccelerationRadiansPerSecondSquared,
            ),
          },
        ],
        yAxisTitle: 'Torque e aceleracao',
      },
    )
  } else if (simulationId === 'uniform-circular-motion') {
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
  } else if (simulationId === 'work-energy-track') {
    charts.push(
      {
        id: 'position',
        title: 'Posicao e altura no trilho por tempo',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Posicao no trilho (m)',
            x: time,
            y: samples.map((sample) => sample.positionMeters),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Altura no trilho (m)',
            x: time,
            y: samples.map((sample) => sample.zMeters),
          },
        ],
        yAxisTitle: 'Posicao (metros)',
      },
      {
        id: 'velocity',
        title: 'Velocidade por tempo',
        traces: [
          {
            lineColor: themeTokens.cyan,
            name: 'Velocidade no trilho (m/s)',
            x: time,
            y: samples.map((sample) => sample.speedMetersPerSecond),
          },
        ],
        yAxisTitle: 'Velocidade (metros por segundo)',
      },
      {
        id: 'work',
        title: 'Trabalho e dissipacao por tempo',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Trabalho aplicado (J)',
            x: time,
            y: samples.map((sample) => sample.appliedWorkJoules),
          },
          {
            lineColor: themeTokens.warning,
            name: 'Energia dissipada por atrito (J)',
            x: time,
            y: samples.map((sample) => sample.thermalEnergyJoules),
          },
        ],
        yAxisTitle: 'Trabalho e energia (joules)',
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
        simulationId === 'collisions-1d-2d'
          ? [
              {
                lineColor: themeTokens.vector,
                name: 'Energia cinetica total (J)',
                x: time,
                y: samples.map((sample) => sample.kineticEnergyJoules),
              },
              {
                lineColor: themeTokens.warning,
                name: 'Energia cinetica dissipada (J)',
                x: time,
                y: samples.map((sample) => sample.kineticEnergyLostJoules),
              },
              {
                lineColor: themeTokens.cyan,
                name: 'Energia total rastreada (J)',
                x: time,
                y: samples.map((sample) => sample.totalEnergyJoules),
              },
            ]
          : simulationId === 'rigid-body-rotation'
            ? [
                {
                  lineColor: themeTokens.vector,
                  name: 'Energia cinetica rotacional (J)',
                  x: time,
                  y: samples.map((sample) => sample.kineticEnergyJoules),
                },
                {
                  lineColor: themeTokens.warning,
                  name: 'Energia dissipada por amortecimento (J)',
                  x: time,
                  y: samples.map((sample) => sample.thermalEnergyJoules),
                },
                {
                  lineColor: themeTokens.cyan,
                  name: 'Energia rastreada (J)',
                  x: time,
                  y: samples.map((sample) => sample.totalEnergyJoules),
                },
              ]
            :
        simulationId === 'atwood-machine' ||
        simulationId === 'projectile-motion' ||
        simulationId === 'work-energy-track'
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
              ...(simulationId === 'work-energy-track'
                ? [
                    {
                      lineColor: themeTokens.danger,
                      name: 'Energia termica acumulada (J)',
                      x: time,
                      y: samples.map((sample) => sample.thermalEnergyJoules),
                    },
                  ]
                : []),
              {
                lineColor: themeTokens.cyan,
                name:
                  simulationId === 'work-energy-track'
                    ? 'Balanco energetico total (J)'
                    : 'Energia mecanica total (J)',
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
