import type {
  KinematicsSample,
  KinematicsSimulationId,
} from '../../lib/physics/kinematics'
import { themeTokens } from '../../theme/appTheme'
import type { ChartTrace, ChartYAxisMode } from './LiveLineChartModel'

export type KinematicsChartId =
  | 'acceleration'
  | 'angle'
  | 'density'
  | 'energy'
  | 'field'
  | 'forces'
  | 'flow'
  | 'frequency'
  | 'kepler'
  | 'momentum'
  | 'position'
  | 'pressure'
  | 'torque'
  | 'velocity'
  | 'work'

export type KinematicsChartConfig = {
  id: KinematicsChartId
  title: string
  traces: ChartTrace[]
  yAxisMode?: ChartYAxisMode
  yAxisTitle: string
}

const maxChartSamples = 480

function isSingleSpringOscillatorSimulation(
  simulationId: KinematicsSimulationId,
) {
  return (
    simulationId === 'damped-oscillator' ||
    simulationId === 'forced-oscillator-resonance' ||
    simulationId === 'mass-spring'
  )
}

function isMechanicalWaveSimulation(simulationId: KinematicsSimulationId) {
  return (
    simulationId === 'standing-waves' ||
    simulationId === 'superposition-interference' ||
    simulationId === 'wave-on-string'
  )
}

function isSoundWaveSimulation(simulationId: KinematicsSimulationId) {
  return simulationId === 'beats' || simulationId === 'doppler-effect'
}

function isOpticsSimulation(simulationId: KinematicsSimulationId) {
  return (
    simulationId === 'reflection-refraction' ||
    simulationId === 'lenses-mirrors' ||
    simulationId === 'light-diffraction-interference'
  )
}

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
  } else if (simulationId === 'continuity-bernoulli') {
    charts.push(
      {
        id: 'flow',
        title: 'Vazao e areas por tempo',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Vazao (m^3/s)',
            x: time,
            y: samples.map((sample) => sample.flowRateCubicMetersPerSecond),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Area de entrada (m^2)',
            x: time,
            y: samples.map((sample) => sample.crossSectionAreaSquareMeters),
          },
          {
            lineColor: themeTokens.vector,
            name: 'Area do estrangulamento (m^2)',
            x: time,
            y: samples.map(
              (sample) => sample.secondaryCrossSectionAreaSquareMeters,
            ),
          },
        ],
        yAxisTitle: 'Vazao e area',
      },
      {
        id: 'velocity',
        title: 'Velocidades por continuidade',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Velocidade na entrada (m/s)',
            x: time,
            y: samples.map((sample) => sample.speedMetersPerSecond),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Velocidade no estrangulamento (m/s)',
            x: time,
            y: samples.map((sample) => sample.secondarySpeedMetersPerSecond),
          },
          {
            lineColor: themeTokens.warning,
            name: 'Velocidade local do tracador (m/s)',
            x: time,
            y: samples.map((sample) => sample.velocityMetersPerSecond),
          },
        ],
        yAxisTitle: 'Velocidade (metros por segundo)',
      },
      {
        id: 'pressure',
        title: 'Pressao por Bernoulli',
        traces: [
          {
            lineColor: themeTokens.vector,
            name: 'Pressao na entrada (Pa)',
            x: time,
            y: samples.map((sample) => sample.pressurePascals),
          },
          {
            lineColor: themeTokens.warning,
            name: 'Pressao no estrangulamento (Pa)',
            x: time,
            y: samples.map((sample) => sample.secondaryPressurePascals),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Pressao local do tracador (Pa)',
            x: time,
            y: samples.map((sample) => sample.fluidPressurePascals),
          },
        ],
        yAxisTitle: 'Pressao (pascals)',
      },
    )
  } else if (simulationId === 'gravitational-field-orbits') {
    const referenceSample = samples[0]
    const referenceSpecificArealRate = referenceSample
      ? readSpecificArealRate(referenceSample)
      : 0
    const referenceAngularVelocity =
      referenceSample?.angularVelocityRadiansPerSecond ?? 0

    charts.push(
      {
        id: 'position',
        title: 'Raio orbital por tempo',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Raio orbital (m)',
            x: time,
            y: samples.map((sample) => sample.positionMeters),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Posicao x (m)',
            x: time,
            y: samples.map((sample) => sample.xMeters),
          },
        ],
        yAxisTitle: 'Distancia (metros)',
      },
      {
        id: 'velocity',
        title: 'Velocidade orbital por tempo',
        traces: [
          {
            lineColor: themeTokens.cyan,
            name: 'Rapidez orbital (m/s)',
            x: time,
            y: samples.map((sample) => sample.speedMetersPerSecond),
          },
        ],
        yAxisTitle: 'Velocidade (metros por segundo)',
      },
      {
        id: 'kepler',
        title: 'Leis de Kepler: areas e periodos',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Taxa areolar relativa (adimensional)',
            x: time,
            y: samples.map((sample) =>
              normalizeToReference(
                readSpecificArealRate(sample),
                referenceSpecificArealRate,
              ),
            ),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Velocidade angular relativa (adimensional)',
            x: time,
            y: samples.map((sample) =>
              normalizeToReference(
                sample.angularVelocityRadiansPerSecond,
                referenceAngularVelocity,
              ),
            ),
          },
        ],
        yAxisTitle: 'Razao relativa',
      },
      {
        id: 'field',
        title: 'Campo gravitacional por tempo',
        traces: [
          {
            lineColor: themeTokens.warning,
            name: 'Campo gravitacional (N/kg)',
            x: time,
            y: samples.map(
              (sample) => sample.gravitationalFieldNewtonsPerKilogram,
            ),
          },
          {
            lineColor: themeTokens.vector,
            name: 'Forca gravitacional (N)',
            x: time,
            y: samples.map((sample) => sample.centripetalForceNewtons),
          },
        ],
        yAxisTitle: 'Campo e forca',
      },
    )
  } else if (simulationId === 'hydrostatics-buoyancy') {
    charts.push(
      {
        id: 'position',
        title: 'Movimento vertical da esfera',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Altura do centro (m)',
            x: time,
            y: samples.map((sample) => sample.zMeters),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Velocidade vertical (m/s)',
            x: time,
            y: samples.map((sample) => sample.velocityMetersPerSecond),
          },
          {
            lineColor: themeTokens.warning,
            name: 'Aceleracao vertical (m/s^2)',
            x: time,
            y: samples.map(
              (sample) => sample.accelerationMetersPerSecondSquared,
            ),
          },
        ],
        yAxisTitle: 'Movimento vertical',
      },
      {
        id: 'pressure',
        title: 'Pressao hidrostatica por tempo',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Pressao no topo do corpo (Pa)',
            x: time,
            y: samples.map((sample) => sample.pressurePascals),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Pressao no centro do corpo (Pa)',
            x: time,
            y: samples.map((sample) => sample.fluidPressurePascals),
          },
          {
            lineColor: themeTokens.warning,
            name: 'Pressao na base do corpo (Pa)',
            x: time,
            y: samples.map((sample) => sample.secondaryPressurePascals),
          },
          {
            lineColor: themeTokens.vector,
            name: 'Profundidade (m)',
            x: time,
            y: samples.map((sample) => sample.positionMeters),
          },
        ],
        yAxisTitle: 'Pressao e profundidade',
      },
      {
        id: 'forces',
        title: 'Empuxo, peso e resultante',
        traces: [
          {
            lineColor: themeTokens.vector,
            name: 'Empuxo (N)',
            x: time,
            y: samples.map((sample) => sample.buoyantForceNewtons),
          },
          {
            lineColor: themeTokens.danger,
            name: 'Peso (N)',
            x: time,
            y: samples.map((sample) => sample.weightNewtons),
          },
          {
            lineColor: themeTokens.warning,
            name: 'Resultante vertical (N)',
            x: time,
            y: samples.map((sample) => sample.netForceNewtons),
          },
        ],
        yAxisTitle: 'Forca (newtons)',
      },
      {
        id: 'density',
        title: 'Densidade e submersao',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Densidade do corpo (kg/m^3)',
            x: time,
            y: samples.map(
              (sample) => sample.objectDensityKilogramsPerCubicMeter,
            ),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Razao densidade corpo/fluido',
            x: time,
            y: samples.map((sample) => sample.gripRatio),
          },
          {
            lineColor: themeTokens.vector,
            name: 'Fracao submersa',
            x: time,
            y: samples.map((sample) => sample.submergedFraction),
          },
        ],
        yAxisTitle: 'Densidade relativa',
      },
    )
  } else if (isSingleSpringOscillatorSimulation(simulationId)) {
    charts.push(
      {
        id: 'position',
        title: 'Deslocamento por tempo',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Deslocamento relativo ao equilibrio (m)',
            x: time,
            y: samples.map((sample) => sample.positionMeters),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Altura da esfera na cena (m)',
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
            name: 'Velocidade vertical (m/s)',
            x: time,
            y: samples.map((sample) => sample.velocityMetersPerSecond),
          },
        ],
        yAxisTitle: 'Velocidade (metros por segundo)',
      },
      {
        id: 'acceleration',
        title: 'Aceleracao por tempo',
        traces: [
          {
            lineColor: themeTokens.warning,
            name: 'Aceleracao vertical (m/s^2)',
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
        title:
          simulationId === 'mass-spring'
            ? 'Forca elastica, peso e resultante'
            : simulationId === 'forced-oscillator-resonance'
              ? 'Forcas do oscilador forcado'
              : 'Forcas do oscilador amortecido',
        traces:
          simulationId === 'mass-spring'
            ? [
                {
                  lineColor: themeTokens.vector,
                  name: 'Forca elastica da mola (N)',
                  x: time,
                  y: samples.map((sample) => sample.springForceNewtons),
                },
                {
                  lineColor: themeTokens.danger,
                  name: 'Peso da esfera (N)',
                  x: time,
                  y: samples.map((sample) => sample.weightNewtons),
                },
                {
                  lineColor: themeTokens.warning,
                  name: 'Forca resultante vertical (N)',
                  x: time,
                  y: samples.map((sample) => sample.netForceNewtons),
                },
              ]
            : [
                {
                  lineColor: themeTokens.vector,
                  name: 'Forca elastica restauradora (N)',
                  x: time,
                  y: samples.map((sample) => sample.springForceNewtons),
                },
                {
                  lineColor: themeTokens.danger,
                  name: 'Forca de amortecimento (N)',
                  x: time,
                  y: samples.map((sample) => sample.frictionForceNewtons),
                },
                ...(simulationId === 'forced-oscillator-resonance'
                  ? [
                      {
                        lineColor: themeTokens.cyan,
                        name: 'Forca externa periodica (N)',
                        x: time,
                        y: samples.map((sample) => sample.appliedForceNewtons),
                      },
                    ]
                  : []),
                {
                  lineColor: themeTokens.warning,
                  name: 'Forca resultante (N)',
                  x: time,
                  y: samples.map((sample) => sample.netForceNewtons),
                },
              ],
        yAxisTitle: 'Forca (newtons)',
      },
    )
  } else if (simulationId === 'coupled-oscillators') {
    charts.push(
      {
        id: 'position',
        title: 'Deslocamentos acoplados por tempo',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Massa A (m)',
            x: time,
            y: samples.map((sample) => sample.positionMeters),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Massa B (m)',
            x: time,
            y: samples.map((sample) => -sample.secondaryZMeters),
          },
          {
            lineColor: '#818CF8',
            name: 'Modo comum (m)',
            x: time,
            y: samples.map((sample) => sample.centerOfMassMeters),
          },
          {
            lineColor: themeTokens.warning,
            name: 'Modo relativo xA - xB (m)',
            x: time,
            y: samples.map((sample) => sample.displacementMeters),
          },
        ],
        yAxisTitle: 'Deslocamento (metros)',
      },
      {
        id: 'velocity',
        title: 'Velocidades por tempo',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Velocidade A (m/s)',
            x: time,
            y: samples.map((sample) => sample.velocityMetersPerSecond),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Velocidade B (m/s)',
            x: time,
            y: samples.map((sample) => sample.secondaryVelocityMetersPerSecond),
          },
        ],
        yAxisTitle: 'Velocidade (metros por segundo)',
      },
      {
        id: 'forces',
        title: 'Forcas das molas e resultantes',
        traces: [
          {
            lineColor: themeTokens.warning,
            name: 'Resultante em A (N)',
            x: time,
            y: samples.map((sample) => sample.netForceNewtons),
          },
          {
            lineColor: themeTokens.danger,
            name: 'Resultante em B (N)',
            x: time,
            y: samples.map((sample) => sample.forceTwoNewtons),
          },
          {
            lineColor: themeTokens.vector,
            name: 'Forca de acoplamento (N)',
            x: time,
            y: samples.map((sample) => sample.tensionNewtons),
          },
          {
            lineColor: themeTokens.teal,
            name: 'Forca da mola A (N)',
            x: time,
            y: samples.map((sample) => sample.springForceNewtons),
          },
          {
            lineColor: '#818CF8',
            name: 'Forca da mola B (N)',
            x: time,
            y: samples.map((sample) => sample.forceThreeZNewtons),
          },
        ],
        yAxisTitle: 'Forca (newtons)',
      },
    )
  } else if (isSoundWaveSimulation(simulationId)) {
    charts.push(
      {
        id: 'pressure',
        title:
          simulationId === 'beats'
            ? 'Pressao e envoltoria no probe'
            : 'Pressao recebida pelo observador',
        traces:
          simulationId === 'beats'
            ? [
                {
                  lineColor: themeTokens.teal,
                  name: 'Pressao resultante (Pa)',
                  x: time,
                  y: samples.map((sample) => sample.pressurePascals),
                },
                {
                  lineColor: themeTokens.cyan,
                  name: 'Tom A (Pa)',
                  x: time,
                  y: samples.map((sample) => sample.secondaryZMeters),
                },
                {
                  lineColor: '#818CF8',
                  name: 'Tom B (Pa)',
                  x: time,
                  y: samples.map((sample) => sample.displacementMeters),
                },
                {
                  lineColor: themeTokens.warning,
                  name: 'Envoltoria de batimento (Pa)',
                  x: time,
                  y: samples.map((sample) => sample.secondaryPressurePascals),
                },
              ]
            : [
                {
                  lineColor: themeTokens.teal,
                  name: 'Pressao no observador (Pa)',
                  x: time,
                  y: samples.map((sample) => sample.pressurePascals),
                },
              ],
        yAxisMode: 'zero-centered',
        yAxisTitle: 'Pressao (pascals)',
      },
      {
        id: 'frequency',
        title:
          simulationId === 'beats'
            ? 'Frequencia dos tons e batimento'
            : 'Frequencia emitida e observada',
        traces:
          simulationId === 'beats'
            ? [
                {
                  lineColor: themeTokens.warning,
                  name: 'Frequencia de batimento (Hz)',
                  x: time,
                  y: samples.map((sample) => sample.frequencyHertz),
                },
                {
                  lineColor: themeTokens.cyan,
                  name: 'Frequencia media dos tons (Hz)',
                  x: time,
                  y: samples.map(
                    (sample) => sample.secondarySpeedMetersPerSecond,
                  ),
                },
              ]
            : [
                {
                  lineColor: themeTokens.teal,
                  name: 'Frequencia observada (Hz)',
                  x: time,
                  y: samples.map((sample) => sample.frequencyHertz),
                },
                {
                  lineColor: themeTokens.cyan,
                  name: 'Frequencia emitida (Hz)',
                  x: time,
                  y: samples.map(
                    (sample) => sample.secondarySpeedMetersPerSecond,
                  ),
                },
              ],
        yAxisTitle: 'Frequencia (hertz)',
      },
      {
        id: 'velocity',
        title:
          simulationId === 'beats'
            ? 'Velocidade de propagacao'
            : 'Velocidades no eixo fonte-observador',
        traces:
          simulationId === 'beats'
            ? [
                {
                  lineColor: themeTokens.vector,
                  name: 'Velocidade do som no meio (m/s)',
                  x: time,
                  y: samples.map((sample) => sample.speedMetersPerSecond),
                },
              ]
            : [
                {
                  lineColor: themeTokens.vector,
                  name: 'Velocidade do som no meio (m/s)',
                  x: time,
                  y: samples.map((sample) => sample.speedMetersPerSecond),
                },
                {
                  lineColor: themeTokens.cyan,
                  name: 'Velocidade da fonte (m/s)',
                  x: time,
                  y: samples.map(
                    (sample) => sample.secondaryVelocityXMetersPerSecond,
                  ),
                },
                {
                  lineColor: '#818CF8',
                  name: 'Velocidade do observador (m/s)',
                  x: time,
                  y: samples.map((sample) => sample.velocityXMetersPerSecond),
                },
              ],
        yAxisTitle: 'Velocidade (metros por segundo)',
      },
    )
  } else if (isOpticsSimulation(simulationId)) {
    if (simulationId === 'reflection-refraction') {
      charts.push(
        {
          id: 'angle',
          title: 'Angulos dos raios e limite critico',
          traces: [
            {
              lineColor: themeTokens.cyan,
              name: 'Angulo incidente (deg)',
              x: time,
              y: samples.map((sample) => sample.positionMeters),
            },
            {
              lineColor: themeTokens.teal,
              name: 'Angulo refratado (deg)',
              x: time,
              y: samples.map((sample) => sample.displacementMeters),
            },
            {
              lineColor: themeTokens.warning,
              name: 'Angulo critico (deg)',
              x: time,
              y: samples.map((sample) => sample.forceOneNewtons),
            },
          ],
          yAxisTitle: 'Angulo (graus)',
        },
        {
          id: 'field',
          title: 'Indices, reflexao e transmissao',
          traces: [
            {
              lineColor: themeTokens.cyan,
              name: 'Indice do meio incidente',
              x: time,
              y: samples.map((sample) => sample.primaryRadiusMeters),
            },
            {
              lineColor: themeTokens.teal,
              name: 'Indice do meio refratado',
              x: time,
              y: samples.map((sample) => sample.secondaryRadiusMeters),
            },
            {
              lineColor: themeTokens.warning,
              name: 'Reflexao estimada (%)',
              x: time,
              y: samples.map((sample) => sample.forceTwoNewtons),
            },
            {
              lineColor: themeTokens.vector,
              name: 'Transmissao estimada (%)',
              x: time,
              y: samples.map((sample) => sample.pressurePascals),
            },
          ],
          yAxisTitle: 'Indice e percentual',
        },
      )
    } else if (simulationId === 'lenses-mirrors') {
      charts.push(
        {
          id: 'position',
          title: 'Objeto, foco e imagem',
          traces: [
            {
              lineColor: themeTokens.cyan,
              name: 'Distancia do objeto (m)',
              x: time,
              y: samples.map((sample) => sample.positionMeters),
            },
            {
              lineColor: themeTokens.teal,
              name: 'Distancia da imagem (m)',
              x: time,
              y: samples.map((sample) => sample.displacementMeters),
            },
            {
              lineColor: themeTokens.warning,
              name: 'Foco assinado (m)',
              x: time,
              y: samples.map((sample) => sample.forceOneNewtons),
            },
          ],
          yAxisMode: 'zero-centered',
          yAxisTitle: 'Distancia (metros)',
        },
        {
          id: 'field',
          title: 'Altura e aumento da imagem',
          traces: [
            {
              lineColor: themeTokens.cyan,
              name: 'Altura do objeto (m)',
              x: time,
              y: samples.map((sample) => sample.zMeters),
            },
            {
              lineColor: themeTokens.teal,
              name: 'Altura da imagem (m)',
              x: time,
              y: samples.map((sample) => sample.secondaryZMeters),
            },
            {
              lineColor: themeTokens.warning,
              name: 'Aumento linear',
              x: time,
              y: samples.map((sample) => sample.secondaryRadiusMeters),
            },
          ],
          yAxisMode: 'zero-centered',
          yAxisTitle: 'Altura e aumento',
        },
      )
    } else {
      charts.push(
        {
          id: 'pressure',
          title: 'Intensidade no detector',
          traces: [
            {
              lineColor: themeTokens.teal,
              name: 'Intensidade normalizada',
              x: time,
              y: samples.map((sample) => sample.pressurePascals),
            },
            {
              lineColor: themeTokens.warning,
              name: 'Envoltoria de difracao',
              x: time,
              y: samples.map((sample) => sample.displacementMeters),
            },
            {
              lineColor: themeTokens.cyan,
              name: 'Interferencia entre fendas',
              x: time,
              y: samples.map((sample) => sample.secondaryPressurePascals),
            },
          ],
          yAxisTitle: 'Intensidade relativa',
        },
        {
          id: 'position',
          title: 'Varredura na tela e espacamento de franjas',
          traces: [
            {
              lineColor: themeTokens.cyan,
              name: 'Posicao do detector (m)',
              x: time,
              y: samples.map((sample) => sample.positionMeters),
            },
            {
              lineColor: themeTokens.warning,
              name: 'Espacamento aproximado entre franjas (m)',
              x: time,
              y: samples.map((sample) => sample.secondaryRadiusMeters),
            },
          ],
          yAxisMode: 'zero-centered',
          yAxisTitle: 'Comprimento (metros)',
        },
      )
    }
  } else if (isMechanicalWaveSimulation(simulationId)) {
    charts.push(
      {
        id: 'position',
        title:
          simulationId === 'superposition-interference'
            ? 'Superposicao no probe por tempo'
            : simulationId === 'standing-waves'
              ? 'Deslocamento estacionario por tempo'
              : 'Deslocamento da corda por tempo',
        traces:
          simulationId === 'superposition-interference'
            ? [
                {
                  lineColor: themeTokens.teal,
                  name: 'Soma y1 + y2 no probe (m)',
                  x: time,
                  y: samples.map((sample) => sample.positionMeters),
                },
                {
                  lineColor: themeTokens.cyan,
                  name: 'Onda A no probe (m)',
                  x: time,
                  y: samples.map((sample) => sample.secondaryZMeters),
                },
                {
                  lineColor: '#818CF8',
                  name: 'Onda B no probe (m)',
                  x: time,
                  y: samples.map((sample) => sample.displacementMeters),
                },
              ]
            : [
                {
                  lineColor: themeTokens.teal,
                  name: 'Deslocamento transversal no probe (m)',
                  x: time,
                  y: samples.map((sample) => sample.positionMeters),
                },
                ...(simulationId === 'standing-waves'
                  ? [
                      {
                        lineColor: themeTokens.warning,
                        name: 'Envelope modal local (m)',
                        x: time,
                        y: samples.map((sample) => sample.secondaryZMeters),
                      },
                    ]
                  : []),
              ],
        yAxisMode: 'zero-centered',
        yAxisTitle: 'Deslocamento (metros)',
      },
      {
        id: 'velocity',
        title: 'Velocidade transversal e propagacao',
        traces: [
          {
            lineColor: themeTokens.cyan,
            name: 'Velocidade transversal no probe (m/s)',
            x: time,
            y: samples.map((sample) => sample.velocityMetersPerSecond),
          },
          {
            lineColor: themeTokens.vector,
            name:
              simulationId === 'standing-waves'
                ? 'Velocidade de onda na corda (m/s)'
                : simulationId === 'wave-on-string'
                  ? 'Velocidade de propagacao do meio (m/s)'
                : 'Velocidade de propagacao (m/s)',
            x: time,
            y: samples.map((sample) => sample.speedMetersPerSecond),
          },
        ],
        yAxisTitle: 'Velocidade (metros por segundo)',
      },
      {
        id: 'acceleration',
        title: 'Aceleracao transversal',
        traces: [
          {
            lineColor: themeTokens.warning,
            name: 'Aceleracao transversal no probe (m/s^2)',
            x: time,
            y: samples.map(
              (sample) => sample.accelerationMetersPerSecondSquared,
            ),
          },
        ],
        yAxisTitle: 'Aceleracao (metros por segundo ao quadrado)',
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
  } else if (simulationId === 'rolling-without-slipping') {
    charts.push(
      {
        id: 'position',
        title: 'Rolamento no trilho por tempo',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Posicao no trilho (m)',
            x: time,
            y: samples.map((sample) => sample.positionMeters),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Angulo da roda (rad)',
            x: time,
            y: samples.map((sample) => sample.angleRadians),
          },
        ],
        yAxisTitle: 'Posicao e angulo',
      },
      {
        id: 'velocity',
        title: 'Velocidade linear e angular',
        traces: [
          {
            lineColor: themeTokens.cyan,
            name: 'Velocidade do centro (m/s)',
            x: time,
            y: samples.map((sample) => sample.speedMetersPerSecond),
          },
          {
            lineColor: themeTokens.vector,
            name: 'Velocidade angular (rad/s)',
            x: time,
            y: samples.map(
              (sample) => sample.angularVelocityRadiansPerSecond,
            ),
          },
        ],
        yAxisTitle: 'Velocidade',
      },
      {
        id: 'forces',
        title: 'Atrito estatico e aderencia',
        traces: [
          {
            lineColor: themeTokens.warning,
            name: 'Atrito requerido/usado (N)',
            x: time,
            y: samples.map((sample) => sample.frictionForceNewtons),
          },
          {
            lineColor: themeTokens.vector,
            name: 'Atrito estatico maximo (N)',
            x: time,
            y: samples.map((sample) => sample.maxStaticFrictionNewtons),
          },
          {
            lineColor: themeTokens.danger,
            name: 'Uso do atrito disponivel',
            x: time,
            y: samples.map((sample) => sample.gripRatio),
          },
        ],
        yAxisTitle: 'Forca e razao',
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
      {
        id: 'momentum',
        title: 'Inercia, centro de massa e momento angular',
        traces: [
          {
            lineColor: themeTokens.vector,
            name: 'Momento angular (kg m^2/s)',
            x: time,
            y: samples.map(
              (sample) =>
                sample.momentOfInertiaKilogramMetersSquared *
                sample.angularVelocityRadiansPerSecond,
            ),
          },
          {
            lineColor: themeTokens.teal,
            name: 'Momento de inercia total (kg m^2)',
            x: time,
            y: samples.map(
              (sample) => sample.momentOfInertiaKilogramMetersSquared,
            ),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Centro de massa (m)',
            x: time,
            y: samples.map((sample) => sample.centerOfMassMeters),
          },
        ],
        yAxisTitle: 'Grandezas angulares',
      },
    )
  } else if (simulationId === 'uniform-circular-motion') {
    charts.push(
      {
        id: 'angle',
        title: 'Angulo e arco por tempo',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Angulo atual (rad)',
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
        title: 'Velocidades constantes por tempo',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Velocidade angular (rad/s)',
            x: time,
            y: samples.map((sample) => sample.angularVelocityRadiansPerSecond),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Velocidade tangencial (m/s)',
            x: time,
            y: samples.map((sample) => sample.speedMetersPerSecond),
          },
        ],
        yAxisTitle: 'Velocidade angular e tangencial',
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
        yAxisTitle: 'Aceleracao (metros por segundo ao quadrado)',
      },
      {
        id: 'position',
        title: 'Projecoes cartesianas por tempo',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Posicao x(t) (m)',
            x: time,
            y: samples.map((sample) => sample.xMeters),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Posicao y(t) no plano (m)',
            x: time,
            y: samples.map((sample) => sample.zMeters),
          },
        ],
        yAxisTitle: 'Posicao (metros)',
      },
    )
  } else if (simulationId === 'work-energy-track') {
    charts.push(
      {
        id: 'position',
        title: 'Posicao horizontal e altura na rampa em U',
        traces: [
          {
            lineColor: themeTokens.teal,
            name: 'Posicao horizontal na rampa (m)',
            x: time,
            y: samples.map((sample) => sample.positionMeters),
          },
          {
            lineColor: themeTokens.cyan,
            name: 'Altura gravitacional (m)',
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
            name: 'Velocidade assinada na rampa (m/s)',
            x: time,
            y: samples.map((sample) => sample.velocityMetersPerSecond),
          },
          {
            lineColor: themeTokens.teal,
            name: 'Rapidez na rampa (m/s)',
            x: time,
            y: samples.map((sample) => sample.speedMetersPerSecond),
          },
        ],
        yAxisTitle: 'Velocidade (metros por segundo)',
      },
      {
        id: 'acceleration',
        title: 'Aceleracao tangencial por tempo',
        traces: [
          {
            lineColor: themeTokens.warning,
            name: 'Aceleracao tangencial (m/s^2)',
            x: time,
            y: samples.map(
              (sample) => sample.accelerationMetersPerSecondSquared,
            ),
          },
        ],
        yAxisTitle: 'Aceleracao (metros por segundo ao quadrado)',
      },
      {
        id: 'work',
        title: 'Dissipacao e perda acumulada',
        traces: [
          {
            lineColor: themeTokens.danger,
            name: 'Energia perdida acumulada (J)',
            x: time,
            y: samples.map((sample) => sample.thermalEnergyJoules),
          },
          {
            lineColor: themeTokens.warning,
            name: 'Perda acumulada (%)',
            x: time,
            y: samples.map((sample) => sample.energyLossPercent),
          },
        ],
        yAxisTitle: 'Dissipacao e percentual',
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

  const supportsEnergyChart =
    simulationId !== 'beats' &&
    simulationId !== 'continuity-bernoulli' &&
    simulationId !== 'doppler-effect' &&
    simulationId !== 'hydrostatics-buoyancy' &&
    !isOpticsSimulation(simulationId)

  if (showEnergy && supportsEnergyChart) {
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
          : simulationId === 'mass-spring'
            ? [
                {
                  lineColor: themeTokens.vector,
                  name: 'Energia cinetica (J)',
                  x: time,
                  y: samples.map((sample) => sample.kineticEnergyJoules),
                },
                {
                  lineColor: themeTokens.warning,
                  name: 'Potencial do oscilador (J)',
                  x: time,
                  y: samples.map((sample) => sample.potentialEnergyJoules),
                },
                {
                  lineColor: themeTokens.teal,
                  name: 'Potencial elastica total (J)',
                  x: time,
                  y: samples.map(
                    (sample) => sample.elasticPotentialEnergyJoules,
                  ),
                },
                {
                  lineColor: themeTokens.danger,
                  name: 'Potencial gravitacional (J)',
                  x: time,
                  y: samples.map(
                    (sample) => sample.gravitationalPotentialEnergyJoules,
                  ),
                },
                {
                  lineColor: '#818CF8',
                  name: 'Energia dissipada (J)',
                  x: time,
                  y: samples.map((sample) => sample.thermalEnergyJoules),
                },
                {
                  lineColor: themeTokens.cyan,
                  name: 'Energia mecanica rastreada (J)',
                  x: time,
                  y: samples.map((sample) => sample.totalEnergyJoules),
                },
              ]
          : simulationId === 'damped-oscillator' ||
              simulationId === 'forced-oscillator-resonance'
            ? [
                {
                  lineColor: themeTokens.vector,
                  name: 'Energia cinetica (J)',
                  x: time,
                  y: samples.map((sample) => sample.kineticEnergyJoules),
                },
                {
                  lineColor: themeTokens.warning,
                  name: 'Energia potencial elastica (J)',
                  x: time,
                  y: samples.map((sample) => sample.potentialEnergyJoules),
                },
                {
                  lineColor: themeTokens.danger,
                  name: 'Energia dissipada (J)',
                  x: time,
                  y: samples.map((sample) => sample.thermalEnergyJoules),
                },
                ...(simulationId === 'forced-oscillator-resonance'
                  ? [
                      {
                        lineColor: '#818CF8',
                        name: 'Trabalho da forca externa (J)',
                        x: time,
                        y: samples.map((sample) => sample.appliedWorkJoules),
                      },
                    ]
                  : []),
                {
                  lineColor: themeTokens.cyan,
                  name: 'Energia rastreada (J)',
                  x: time,
                  y: samples.map((sample) => sample.totalEnergyJoules),
                },
              ]
          : simulationId === 'coupled-oscillators'
            ? [
                {
                  lineColor: themeTokens.vector,
                  name: 'Energia cinetica total (J)',
                  x: time,
                  y: samples.map((sample) => sample.kineticEnergyJoules),
                },
                {
                  lineColor: themeTokens.teal,
                  name: 'Energia cinetica A (J)',
                  x: time,
                  y: samples.map((sample) => sample.leftKineticEnergyJoules),
                },
                {
                  lineColor: '#818CF8',
                  name: 'Energia cinetica B (J)',
                  x: time,
                  y: samples.map((sample) => sample.rightKineticEnergyJoules),
                },
                {
                  lineColor: themeTokens.warning,
                  name: 'Energia potencial mola A (J)',
                  x: time,
                  y: samples.map(
                    (sample) => sample.leftElasticPotentialEnergyJoules,
                  ),
                },
                {
                  lineColor: themeTokens.danger,
                  name: 'Energia potencial mola B (J)',
                  x: time,
                  y: samples.map(
                    (sample) => sample.rightElasticPotentialEnergyJoules,
                  ),
                },
                {
                  lineColor: themeTokens.warning,
                  name: 'Energia na mola de acoplamento (J)',
                  x: time,
                  y: samples.map(
                    (sample) => sample.couplingPotentialEnergyJoules,
                  ),
                },
                {
                  lineColor: '#FBBF24',
                  name: 'Energia potencial elastica total (J)',
                  x: time,
                  y: samples.map((sample) => sample.potentialEnergyJoules),
                },
                {
                  lineColor: '#F43F5E',
                  name: 'Energia dissipada (J)',
                  x: time,
                  y: samples.map((sample) => sample.thermalEnergyJoules),
                },
                {
                  lineColor: themeTokens.cyan,
                  name: 'Energia mecanica total (J)',
                  x: time,
                  y: samples.map((sample) => sample.totalEnergyJoules),
                },
              ]
          : simulationId === 'torque-levers-center-mass'
            ? [
                {
                  lineColor: themeTokens.vector,
                  name: 'Energia cinetica do corpo esquerdo (J)',
                  x: time,
                  y: samples.map((sample) => sample.leftKineticEnergyJoules),
                },
                {
                  lineColor: themeTokens.teal,
                  name: 'Energia cinetica do corpo direito (J)',
                  x: time,
                  y: samples.map((sample) => sample.rightKineticEnergyJoules),
                },
                {
                  lineColor: themeTokens.warning,
                  name: 'Potencial gravitacional do corpo esquerdo (J)',
                  x: time,
                  y: samples.map(
                    (sample) =>
                      sample.leftGravitationalPotentialEnergyJoules,
                  ),
                },
                {
                  lineColor: themeTokens.danger,
                  name: 'Potencial gravitacional do corpo direito (J)',
                  x: time,
                  y: samples.map(
                    (sample) =>
                      sample.rightGravitationalPotentialEnergyJoules,
                  ),
                },
                {
                  lineColor: themeTokens.cyan,
                  name: 'Energia mecanica das massas (J)',
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
        simulationId === 'gravitational-field-orbits' ||
        simulationId === 'projectile-motion' ||
        simulationId === 'rolling-without-slipping' ||
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
              ...(simulationId === 'work-energy-track' ||
              simulationId === 'rolling-without-slipping'
                ? [
                    {
                      lineColor: themeTokens.danger,
                      name:
                        simulationId === 'rolling-without-slipping'
                          ? 'Energia dissipada no escorregamento (J)'
                          : 'Energia termica acumulada (J)',
                      x: time,
                      y: samples.map((sample) => sample.thermalEnergyJoules),
                    },
                  ]
                : []),
              {
                lineColor: themeTokens.cyan,
                name:
                  simulationId === 'work-energy-track'
                    ? 'Energia mecanica total (J)'
                    : simulationId === 'rolling-without-slipping'
                      ? 'Energia rastreada total (J)'
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
      yAxisMode: 'zero-centered',
      yAxisTitle: 'Energia (joules)',
    })
  }

  return charts
}

function readSpecificArealRate(sample: KinematicsSample) {
  return (
    Math.abs(
      sample.xMeters * sample.velocityZMetersPerSecond -
        sample.zMeters * sample.velocityXMetersPerSecond,
    ) / 2
  )
}

function normalizeToReference(value: number, reference: number) {
  if (!Number.isFinite(value) || !Number.isFinite(reference)) {
    return 0
  }

  if (Math.abs(reference) < 1e-12) {
    return 0
  }

  return value / reference
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
