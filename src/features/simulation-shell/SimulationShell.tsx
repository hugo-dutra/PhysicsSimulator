import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import {
  Box,
  Button,
  ButtonBase,
  Chip,
  Collapse,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Slider,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import {
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react'
import {
  activeSimulationId,
  findSimulation,
  inclinedPlaneFixture,
  kinematicsFixtures,
  pendulumFixture,
  simulationCatalog,
} from '../../simulation-registry/catalog'
import type {
  ParameterValue,
  SimulationDefinition,
  SimulationFixture,
  SimulationParameter,
  SimulationStatus,
} from '../../simulation-registry/types'
import {
  computeInclinedPlaneTimeline,
  getInclinedPlaneVectorOverlays,
  toInclinedPlaneParameters,
  type InclinedPlaneParameters,
  type InclinedPlaneSample,
  type InclinedPlaneVectorOverlay,
} from '../../lib/physics/inclinedPlane'
import {
  computeKinematicsTimeline,
  getKinematicsVectorOverlays,
  isKinematicsSimulationId,
  toKinematicsParameters,
  type HydrostaticsBuoyancyParameters,
  type KinematicsParameters,
  type KinematicsSample,
  type KinematicsSimulationId,
  type KinematicsVectorOverlay,
} from '../../lib/physics/kinematics'
import atwoodMachineTheory from '../../content/simulations/mechanics/atwood-machine/theory.md?raw'
import centripetalForceCurveTheory from '../../content/simulations/mechanics/centripetal-force-curve/theory.md?raw'
import collisionsTheory from '../../content/simulations/mechanics/collisions-1d-2d/theory.md?raw'
import continuityBernoulliTheory from '../../content/simulations/mechanics/continuity-bernoulli/theory.md?raw'
import {
  computePendulumTimeline,
  getPendulumVectorOverlays,
  toPendulumParameters,
  type PendulumParameters,
  type PendulumSample,
  type PendulumVectorOverlay,
} from '../../lib/physics/pendulum'
import gravitationalFieldOrbitsTheory from '../../content/simulations/mechanics/gravitational-field-orbits/theory.md?raw'
import hydrostaticsBuoyancyTheory from '../../content/simulations/mechanics/hydrostatics-buoyancy/theory.md?raw'
import inclinedPlaneTheory from '../../content/simulations/mechanics/inclined-plane-friction/theory.md?raw'
import massSpringTheory from '../../content/simulations/mechanics/mass-spring/theory.md?raw'
import particleEquilibriumTheory from '../../content/simulations/mechanics/particle-equilibrium/theory.md?raw'
import pendulumTheory from '../../content/simulations/mechanics/pendulum/theory.md?raw'
import projectileMotionTheory from '../../content/simulations/mechanics/projectile-motion/theory.md?raw'
import rigidBodyRotationTheory from '../../content/simulations/mechanics/rigid-body-rotation/theory.md?raw'
import rollingWithoutSlippingTheory from '../../content/simulations/mechanics/rolling-without-slipping/theory.md?raw'
import torqueLeversCenterMassTheory from '../../content/simulations/mechanics/torque-levers-center-mass/theory.md?raw'
import uniformCircularMotionTheory from '../../content/simulations/mechanics/uniform-circular-motion/theory.md?raw'
import uniformLinearMotionTheory from '../../content/simulations/mechanics/uniform-linear-motion/theory.md?raw'
import uniformlyAcceleratedMotionTheory from '../../content/simulations/mechanics/uniformly-accelerated-motion/theory.md?raw'
import workEnergyTrackTheory from '../../content/simulations/mechanics/work-energy-track/theory.md?raw'
import { themeTokens } from '../../theme/appTheme'
import { normalizePlaybackRate } from '../../lib/rendering/visualRuntime'
import type { CameraProjectionMode } from '../../lib/rendering/orbitCamera'
import { ChevronSection } from './ChevronSection'
import { FormulaGuide } from './FormulaGuide'
import { InclinedPlaneCharts } from './InclinedPlaneCharts'
import { InclinedPlaneScene, type InclinedPlaneFrameStats } from './InclinedPlaneScene'
import { KinematicsCharts } from './KinematicsCharts'
import { KinematicsScene, type KinematicsFrameStats } from './KinematicsScene'
import { LiveLineChart } from './LiveLineChart'
import { ChartFocusButton, PendulumCharts } from './PendulumCharts'
import {
  buildInclinedPlaneChartConfigs,
  prepareInclinedPlaneChartSamples,
  type InclinedPlaneChartId,
} from './inclinedPlaneChartConfigs'
import {
  buildKinematicsChartConfigs,
  prepareKinematicsChartSamples,
  type KinematicsChartId,
} from './kinematicsChartConfigs'
import {
  buildPendulumChartConfigs,
  preparePendulumChartSamples,
  type PendulumChartId,
} from './pendulumChartConfigs'
import { PendulumScene, type PendulumFrameStats } from './PendulumScene'
import {
  appendLiveSample,
  getMovingWindowRange,
  readFirstSample,
  selectRecentSamplesByTime,
  selectStableRows,
} from './sampleWindow'
import { TheoryAppendix } from './TheoryAppendix'

const compactNumber = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
})

const compactEnergy = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 3,
})

type OverlayState = {
  energy: boolean
  trace: boolean
  vectors: boolean
}

type OutputPanelState = {
  charts: boolean
  formulas: boolean
  table: boolean
  theory: boolean
}

type HydrostaticsContinuitySeed = Required<
  Pick<
    HydrostaticsBuoyancyParameters,
    | 'initialCenterZMeters'
    | 'initialVelocityZMetersPerSecond'
    | 'motionStartTimeSeconds'
  >
>

type MaximizedPanelId = 'charts' | 'formulas' | 'simulation' | 'table' | 'theory'

type RunnableSimulationId =
  | 'inclined-plane-friction'
  | 'simple-pendulum'
  | KinematicsSimulationId

type AnimationVectorLegendItem = {
  color: string
  id: string
  label: string
}

type KinematicsVectorLegendItem = {
  color: string
  description: string
  id: KinematicsVectorOverlay['id']
  label: string
}

const kinematicsTheoryById = {
  'atwood-machine': atwoodMachineTheory,
  'centripetal-force-curve': centripetalForceCurveTheory,
  'collisions-1d-2d': collisionsTheory,
  'continuity-bernoulli': continuityBernoulliTheory,
  'gravitational-field-orbits': gravitationalFieldOrbitsTheory,
  'hydrostatics-buoyancy': hydrostaticsBuoyancyTheory,
  'mass-spring': massSpringTheory,
  'particle-equilibrium': particleEquilibriumTheory,
  'projectile-motion': projectileMotionTheory,
  'rigid-body-rotation': rigidBodyRotationTheory,
  'rolling-without-slipping': rollingWithoutSlippingTheory,
  'torque-levers-center-mass': torqueLeversCenterMassTheory,
  'uniform-circular-motion': uniformCircularMotionTheory,
  'uniform-linear-motion': uniformLinearMotionTheory,
  'uniformly-accelerated-motion': uniformlyAcceleratedMotionTheory,
  'work-energy-track': workEnergyTrackTheory,
} satisfies Record<KinematicsSimulationId, string>

const customPresetId = 'custom'
const defaultPlaybackRate = 1
const playbackRateParameter = {
  id: 'playbackRate',
  label: 'Velocidade do tempo',
  description:
    'Escala o tempo da simulacao sem recalcular a fisica. Em 1x o experimento roda no tempo normal; reduzir desacelera a leitura continua de cena, graficos e tabela; em 0x o relogio fica parado como pausa.',
  unit: 'x',
  kind: 'number',
  min: 0,
  max: 1,
  step: 0.05,
  defaultValue: defaultPlaybackRate,
} satisfies SimulationParameter
const sampleTableRowCount = 9
const maximizedSampleTableRowCount = 18
const floatingControlsPanelWidthPx = 360
const floatingControlsMobileInsetPx = 12
const floatingControlsDesktopInsetPx = 16
const floatingControlsDesktopReservePx =
  floatingControlsPanelWidthPx + floatingControlsDesktopInsetPx * 2
const floatingControlsMobileMaxHeight = 'min(34svh, 300px)'
const floatingControlsMobileBottomReserve = `calc(${floatingControlsMobileMaxHeight} + ${
  floatingControlsMobileInsetPx * 2
}px)`
const sampleTableColumnIds = [
  'time',
  'angle',
  'velocity',
  'linearVelocity',
  'tangentialAcceleration',
  'radialAcceleration',
  'totalAcceleration',
  'x',
  'y',
  'kinetic',
  'potential',
  'total',
] as const
const vectorLegendItems = [
  {
    id: 'weight',
    label: 'Peso',
    color: themeTokens.danger,
    description: 'forca gravitacional vertical para baixo',
  },
  {
    id: 'tension',
    label: 'Tensao',
    color: themeTokens.vector,
    description: 'forca radial apontando para o pivo',
  },
  {
    id: 'velocity',
    label: 'Velocidade linear',
    color: themeTokens.cyan,
    description: 'tangencial a trajetoria, perpendicular ao fio',
  },
] satisfies Array<{
  color: string
  description: string
  id: PendulumVectorOverlay['id']
  label: string
}>
const inclinedPlaneSampleTableColumnIds = [
  'time',
  'position',
  'velocity',
  'acceleration',
  'height',
  'normal',
  'friction',
  'netForce',
  'kinetic',
  'potential',
  'thermal',
  'total',
] as const
const inclinedPlaneVectorLegendItems = [
  {
    id: 'weight',
    label: 'Peso',
    color: themeTokens.danger,
    description: 'forca gravitacional vertical para baixo',
  },
  {
    id: 'normal',
    label: 'Normal',
    color: themeTokens.vector,
    description: 'forca perpendicular da superficie sobre o bloco',
  },
  {
    id: 'friction',
    label: 'Atrito',
    color: themeTokens.warning,
    description: 'forca que se opoe ao deslizamento ou tendencia de movimento',
  },
  {
    id: 'velocity',
    label: 'Velocidade',
    color: themeTokens.cyan,
    description: 'movimento ao longo do plano inclinado',
  },
] satisfies Array<{
  color: string
  description: string
  id: InclinedPlaneVectorOverlay['id']
  label: string
}>
const kinematicsSampleTableColumnIds = [
  'time',
  'position',
  'displacement',
  'x',
  'z',
  'velocity',
  'speed',
  'acceleration',
  'force',
  'tension',
  'kinetic',
  'potential',
  'thermal',
  'work',
  'total',
] as const
const kinematicsVectorLegendItemsById = {
  'atwood-machine': [
    {
      id: 'velocity',
      label: 'Velocidade',
      color: themeTokens.cyan,
      description: 'velocidade comum das massas no fio ideal',
    },
    {
      id: 'acceleration',
      label: 'Aceleracao',
      color: themeTokens.warning,
      description: 'aceleracao comum causada pela diferenca entre os pesos',
    },
    {
      id: 'tension',
      label: 'Tensao',
      color: themeTokens.vector,
      description: 'forca transmitida pelo fio ideal nos dois lados da polia',
    },
    {
      id: 'weight',
      label: 'Peso',
      color: themeTokens.danger,
      description: 'peso da massa 2 no lado direito do sistema',
    },
  ],
  'centripetal-force-curve': [
    {
      id: 'velocity',
      label: 'Velocidade tangencial',
      color: themeTokens.cyan,
      description: 'vetor tangente a curva circular',
    },
    {
      id: 'centripetal',
      label: 'Forca centripeta',
      color: themeTokens.warning,
      description: 'resultante radial requerida para manter a curva',
    },
    {
      id: 'friction',
      label: 'Atrito maximo',
      color: themeTokens.vector,
      description: 'limite de atrito estatico disponivel antes da perda de aderencia',
    },
  ],
  'collisions-1d-2d': [
    {
      id: 'velocity',
      label: 'Corpo 1',
      color: themeTokens.cyan,
      description: 'velocidade atual do primeiro corpo antes ou apos o impacto',
    },
    {
      id: 'secondaryVelocity',
      label: 'Corpo 2',
      color: '#818CF8',
      description: 'velocidade atual do segundo corpo antes ou apos o impacto',
    },
    {
      id: 'momentum',
      label: 'Momento total',
      color: themeTokens.vector,
      description: 'momento linear total conservado no modelo de contato ideal',
    },
    {
      id: 'impulse',
      label: 'Impulso',
      color: themeTokens.warning,
      description: 'impulso normal acumulado quando ocorre a colisao',
    },
  ],
  'continuity-bernoulli': [
    {
      id: 'velocity',
      label: 'Tracador',
      color: themeTokens.teal,
      description: 'velocidade local do fluido ao longo do tubo de Venturi',
    },
    {
      id: 'secondaryVelocity',
      label: 'Garganta',
      color: themeTokens.cyan,
      description: 'velocidade media no estrangulamento pela continuidade',
    },
  ],
  'gravitational-field-orbits': [
    {
      id: 'velocity',
      label: 'Velocidade orbital',
      color: themeTokens.cyan,
      description: 'velocidade tangencial aproximada no ponto da orbita',
    },
    {
      id: 'gravity',
      label: 'Campo gravitacional',
      color: themeTokens.danger,
      description: 'aceleracao gravitacional apontando para o corpo central',
    },
    {
      id: 'centripetal',
      label: 'Forca gravitacional',
      color: themeTokens.warning,
      description: 'forca central que sustenta a curvatura orbital',
    },
  ],
  'hydrostatics-buoyancy': [
    {
      id: 'velocity',
      label: 'Velocidade',
      color: themeTokens.cyan,
      description: 'movimento vertical do centro da esfera dentro do tanque',
    },
    {
      id: 'acceleration',
      label: 'Aceleracao',
      color: themeTokens.warning,
      description: 'aceleracao vertical calculada por resultante dividida pela massa',
    },
    {
      id: 'normal',
      label: 'Empuxo',
      color: themeTokens.vector,
      description: 'forca vertical para cima exercida pelo fluido deslocado',
    },
    {
      id: 'weight',
      label: 'Peso',
      color: themeTokens.danger,
      description: 'forca gravitacional do corpo para baixo',
    },
    {
      id: 'resultant',
      label: 'Resultante',
      color: themeTokens.warning,
      description: 'diferenca vertical entre empuxo e peso',
    },
  ],
  'mass-spring': [
    {
      id: 'velocity',
      label: 'Velocidade',
      color: themeTokens.cyan,
      description: 'velocidade vertical da esfera em torno do equilibrio',
    },
    {
      id: 'acceleration',
      label: 'Aceleracao',
      color: themeTokens.warning,
      description: 'aceleracao vertical gerada pela resultante elastica',
    },
    {
      id: 'tension',
      label: 'Forca elastica',
      color: themeTokens.vector,
      description: 'forca da mola sobre a esfera, oposta a deformacao',
    },
    {
      id: 'weight',
      label: 'Peso',
      color: themeTokens.danger,
      description: 'forca gravitacional constante que desloca o equilibrio',
    },
  ],
  'particle-equilibrium': [
    {
      id: 'forceOne',
      label: 'Forca A',
      color: themeTokens.teal,
      description: 'primeira forca aplicada sobre a particula',
    },
    {
      id: 'forceTwo',
      label: 'Forca B',
      color: themeTokens.cyan,
      description: 'segunda forca aplicada sobre a particula',
    },
    {
      id: 'forceThree',
      label: 'Forca C',
      color: themeTokens.vector,
      description: 'terceira forca aplicada sobre a particula',
    },
    {
      id: 'resultant',
      label: 'Resultante',
      color: themeTokens.danger,
      description: 'soma vetorial; deve zerar para equilibrio translacional',
    },
  ],
  'projectile-motion': [
    {
      id: 'displacement',
      label: 'Deslocamento',
      color: themeTokens.vector,
      description: 'vetor entre a origem do lancamento e a posicao atual',
    },
    {
      id: 'velocity',
      label: 'Velocidade',
      color: themeTokens.cyan,
      description: 'velocidade resultante tangente a trajetoria balistica',
    },
    {
      id: 'gravity',
      label: 'Gravidade',
      color: themeTokens.danger,
      description: 'aceleracao vertical constante para baixo',
    },
  ],
  'uniform-circular-motion': [
    {
      id: 'displacement',
      label: 'Raio',
      color: themeTokens.vector,
      description: 'vetor radial do centro ate o corpo',
    },
    {
      id: 'velocity',
      label: 'Velocidade tangencial',
      color: themeTokens.cyan,
      description: 'vetor perpendicular ao raio, tangente a trajetoria',
    },
    {
      id: 'centripetal',
      label: 'Aceleracao centripeta',
      color: themeTokens.warning,
      description: 'aceleracao radial apontando para o centro',
    },
  ],
  'rigid-body-rotation': [
    {
      id: 'angularMomentum',
      label: 'Momento angular',
      color: themeTokens.vector,
      description:
        'vetor axial L = I omega, perpendicular ao plano de giro pela regra da mao direita',
    },
    {
      id: 'angularVelocity',
      label: 'Vel. angular',
      color: themeTokens.cyan,
      description: 'taxa de giro do corpo rigido em torno do eixo fixo',
    },
    {
      id: 'angularAcceleration',
      label: 'Acel. angular',
      color: themeTokens.warning,
      description: 'variacao de velocidade angular definida por torque e inercia',
    },
    {
      id: 'torque',
      label: 'Torque',
      color: themeTokens.vector,
      description: 'momento de forca externo aplicado ao corpo',
    },
  ],
  'torque-levers-center-mass': [
    {
      id: 'forceOne',
      label: 'Peso esquerdo',
      color: themeTokens.teal,
      description: 'peso aplicado no braco esquerdo da alavanca',
    },
    {
      id: 'forceTwo',
      label: 'Peso direito',
      color: themeTokens.cyan,
      description: 'peso aplicado no braco direito da alavanca',
    },
    {
      id: 'appliedForce',
      label: 'Forca aplicada',
      color: themeTokens.vector,
      description: 'forca externa que tambem produz torque sobre o apoio',
    },
    {
      id: 'torque',
      label: 'Torque',
      color: themeTokens.warning,
      description: 'torque resultante em torno do ponto de apoio',
    },
  ],
  'rolling-without-slipping': [
    {
      id: 'velocity',
      label: 'Centro',
      color: themeTokens.cyan,
      description: 'velocidade translacional do centro da roda no trilho',
    },
    {
      id: 'acceleration',
      label: 'Aceleracao',
      color: themeTokens.warning,
      description: 'aceleracao do centro causada pela componente do peso',
    },
    {
      id: 'friction',
      label: 'Atrito',
      color: themeTokens.danger,
      description: 'atrito requerido para manter ou tentar manter rolamento puro',
    },
    {
      id: 'normal',
      label: 'Normal',
      color: themeTokens.vector,
      description: 'forca de contato perpendicular ao trilho',
    },
  ],
  'uniform-linear-motion': [
    {
      id: 'displacement',
      label: 'Deslocamento',
      color: themeTokens.vector,
      description: 'variacao orientada de posicao no eixo retilineo',
    },
    {
      id: 'velocity',
      label: 'Velocidade',
      color: themeTokens.cyan,
      description: 'vetor constante que define sentido e rapidez',
    },
    {
      id: 'acceleration',
      label: 'Aceleracao',
      color: themeTokens.warning,
      description: 'nula no modelo de movimento retilineo uniforme',
    },
  ],
  'uniformly-accelerated-motion': [
    {
      id: 'displacement',
      label: 'Deslocamento',
      color: themeTokens.vector,
      description: 'variacao orientada de posicao no eixo vertical',
    },
    {
      id: 'velocity',
      label: 'Velocidade',
      color: themeTokens.cyan,
      description: 'vetor que muda linearmente com a aceleracao',
    },
    {
      id: 'acceleration',
      label: 'Aceleracao',
      color: themeTokens.warning,
      description: 'vetor constante que curva x(t) no MUV',
    },
  ],
  'work-energy-track': [
    {
      id: 'velocity',
      label: 'Velocidade',
      color: themeTokens.cyan,
      description: 'velocidade tangente ao U, assinada pelo sentido horizontal',
    },
    {
      id: 'acceleration',
      label: 'Aceleracao',
      color: themeTokens.warning,
      description: 'aceleracao tangencial gerada pela gravidade e pela perda ativa',
    },
    {
      id: 'friction',
      label: 'Perda',
      color: themeTokens.danger,
      description: 'forca dissipativa equivalente quando ha perda de energia',
    },
    {
      id: 'normal',
      label: 'Normal',
      color: themeTokens.vector,
      description: 'forca de contato que mantem o corpo guiado pela rampa em U',
    },
  ],
} satisfies Record<KinematicsSimulationId, KinematicsVectorLegendItem[]>
const initialFrameStats: PendulumFrameStats = {
  fps: 0,
  frameTimeMs: 0,
}
const initialInclinedPlaneFrameStats: InclinedPlaneFrameStats = {
  fps: 0,
  frameTimeMs: 0,
}
const initialKinematicsFrameStats: KinematicsFrameStats = {
  fps: 0,
  frameTimeMs: 0,
}

export function SimulationShell() {
  const [selectedSimulationId, setSelectedSimulationId] =
    useState<RunnableSimulationId>(activeSimulationId as RunnableSimulationId)
  const selectedSimulation = useMemo(
    () => findSimulation(selectedSimulationId),
    [selectedSimulationId],
  )
  const isInclinedPlaneSelected =
    selectedSimulationId === 'inclined-plane-friction'
  const isKinematicsSelected = isKinematicsSimulationId(selectedSimulationId)
  const selectedKinematicsSimulationId = isKinematicsSelected
    ? selectedSimulationId
    : 'uniform-linear-motion'
  const [pendulumParameterValues, setPendulumParameterValues] = useState<
    Record<string, ParameterValue>
  >(() => ({ ...pendulumFixture.defaultParameters }))
  const [pendulumRuntimeValues, setPendulumRuntimeValues] = useState<
    Record<string, ParameterValue>
  >(() => readDefaultRuntimeValues(pendulumFixture))
  const [pendulumSelectedPresetId, setPendulumSelectedPresetId] =
    useState(customPresetId)
  const [inclinedPlaneParameterValues, setInclinedPlaneParameterValues] =
    useState<Record<string, ParameterValue>>(() => ({
      ...inclinedPlaneFixture.defaultParameters,
    }))
  const [inclinedPlaneRuntimeValues, setInclinedPlaneRuntimeValues] = useState<
    Record<string, ParameterValue>
  >(() => readDefaultRuntimeValues(inclinedPlaneFixture))
  const [inclinedPlaneSelectedPresetId, setInclinedPlaneSelectedPresetId] =
    useState(customPresetId)
  const [kinematicsParameterValuesById, setKinematicsParameterValuesById] =
    useState<Record<KinematicsSimulationId, Record<string, ParameterValue>>>(
      () =>
        Object.fromEntries(
          Object.entries(kinematicsFixtures).map(([simulationId, fixture]) => [
            simulationId,
            { ...fixture.defaultParameters },
          ]),
        ) as Record<
          KinematicsSimulationId,
          Record<string, ParameterValue>
        >,
    )
  const [kinematicsRuntimeValuesById, setKinematicsRuntimeValuesById] =
    useState<Record<KinematicsSimulationId, Record<string, ParameterValue>>>(
      () =>
        Object.fromEntries(
          Object.entries(kinematicsFixtures).map(([simulationId, fixture]) => [
            simulationId,
            readDefaultRuntimeValues(fixture),
          ]),
        ) as Record<
          KinematicsSimulationId,
          Record<string, ParameterValue>
        >,
    )
  const [kinematicsSelectedPresetIdsById, setKinematicsSelectedPresetIdsById] =
    useState<Record<KinematicsSimulationId, string>>(() =>
      Object.fromEntries(
        Object.keys(kinematicsFixtures).map((simulationId) => [
          simulationId,
          customPresetId,
        ]),
      ) as Record<KinematicsSimulationId, string>,
    )
  const [isPlaying, setIsPlaying] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(defaultPlaybackRate)
  const [playbackResetVersion, setPlaybackResetVersion] = useState(0)
  const latestKinematicsSamplesRef = useRef<
    Partial<Record<KinematicsSimulationId, KinematicsSample>>
  >({})
  const [hydrostaticsContinuitySeed, setHydrostaticsContinuitySeed] =
    useState<HydrostaticsContinuitySeed | null>(null)
  const [overlays, setOverlays] = useState<OverlayState>({
    energy: true,
    trace: true,
    vectors: true,
  })
  const [cameraProjectionMode, setCameraProjectionMode] =
    useState<CameraProjectionMode>('perspective')
  const [outputPanels, setOutputPanels] = useState<OutputPanelState>({
    charts: false,
    formulas: false,
    table: false,
    theory: false,
  })
  const [maximizedPanel, setMaximizedPanel] =
    useState<MaximizedPanelId | null>(null)
  const pendulumParameters = useMemo(
    () => toPendulumParameters(pendulumParameterValues),
    [pendulumParameterValues],
  )
  const pendulumDurationSeconds = readRuntimeValue(
    pendulumRuntimeValues,
    'durationSeconds',
    pendulumFixture.durationSeconds,
  )
  const pendulumChartWindowSeconds = readRuntimeValue(
    pendulumRuntimeValues,
    'chartWindowSeconds',
    pendulumFixture.chartWindowSeconds,
  )
  const pendulumEffectiveChartWindowSeconds = pendulumChartWindowSeconds
  const pendulumTimeline = useMemo(
    () =>
      computePendulumTimeline({
        parameters: pendulumParameters,
        durationSeconds: pendulumDurationSeconds,
        sampleRateHz: pendulumFixture.sampleRateHz,
      }),
    [pendulumDurationSeconds, pendulumParameters],
  )
  const inclinedPlaneParameters = useMemo(
    () => toInclinedPlaneParameters(inclinedPlaneParameterValues),
    [inclinedPlaneParameterValues],
  )
  const inclinedPlaneDurationSeconds = readRuntimeValue(
    inclinedPlaneRuntimeValues,
    'durationSeconds',
    inclinedPlaneFixture.durationSeconds,
  )
  const inclinedPlaneChartWindowSeconds = readRuntimeValue(
    inclinedPlaneRuntimeValues,
    'chartWindowSeconds',
    inclinedPlaneFixture.chartWindowSeconds,
  )
  const inclinedPlaneEffectiveChartWindowSeconds =
    inclinedPlaneChartWindowSeconds
  const inclinedPlaneTimeline = useMemo(
    () =>
      computeInclinedPlaneTimeline({
        durationSeconds: inclinedPlaneDurationSeconds,
        parameters: inclinedPlaneParameters,
        sampleRateHz: inclinedPlaneFixture.sampleRateHz,
      }),
    [inclinedPlaneDurationSeconds, inclinedPlaneParameters],
  )
  const selectedKinematicsFixture =
    kinematicsFixtures[selectedKinematicsSimulationId]
  const selectedKinematicsParameterValues =
    kinematicsParameterValuesById[selectedKinematicsSimulationId]
  const selectedKinematicsRuntimeValues =
    kinematicsRuntimeValuesById[selectedKinematicsSimulationId]
  const selectedKinematicsPresetId =
    kinematicsSelectedPresetIdsById[selectedKinematicsSimulationId]
  const selectedKinematicsBaseParameters = useMemo(
    () =>
      toKinematicsParameters(
        selectedKinematicsSimulationId,
        selectedKinematicsParameterValues,
      ),
    [selectedKinematicsParameterValues, selectedKinematicsSimulationId],
  )
  const selectedKinematicsParameters = useMemo<KinematicsParameters>(() => {
    if (
      selectedKinematicsSimulationId !== 'hydrostatics-buoyancy' ||
      !hydrostaticsContinuitySeed
    ) {
      return selectedKinematicsBaseParameters
    }

    return {
      ...(selectedKinematicsBaseParameters as HydrostaticsBuoyancyParameters),
      ...hydrostaticsContinuitySeed,
    }
  }, [
    hydrostaticsContinuitySeed,
    selectedKinematicsBaseParameters,
    selectedKinematicsSimulationId,
  ])
  const selectedKinematicsDurationSeconds = readRuntimeValue(
    selectedKinematicsRuntimeValues,
    'durationSeconds',
    selectedKinematicsFixture.durationSeconds,
  )
  const selectedKinematicsChartWindowSeconds = readRuntimeValue(
    selectedKinematicsRuntimeValues,
    'chartWindowSeconds',
    selectedKinematicsFixture.chartWindowSeconds,
  )
  const selectedKinematicsModelTimeScale = readRuntimeValue(
    selectedKinematicsRuntimeValues,
    'modelTimeScale',
    1,
  )
  const selectedKinematicsEffectiveChartWindowSeconds =
    selectedKinematicsChartWindowSeconds
  const selectedKinematicsTimeline = useMemo(
    () =>
      computeKinematicsTimeline({
        durationSeconds: selectedKinematicsDurationSeconds,
        parameters: selectedKinematicsParameters,
        sampleRateHz: selectedKinematicsFixture.sampleRateHz,
        simulationId: selectedKinematicsSimulationId,
      }),
    [
      selectedKinematicsDurationSeconds,
      selectedKinematicsFixture.sampleRateHz,
      selectedKinematicsParameters,
      selectedKinematicsSimulationId,
    ],
  )

  const selectedFixture = isKinematicsSelected
    ? selectedKinematicsFixture
    : isInclinedPlaneSelected
      ? inclinedPlaneFixture
      : pendulumFixture
  const selectedRuntimeValues = isInclinedPlaneSelected
    ? inclinedPlaneRuntimeValues
    : isKinematicsSelected
      ? selectedKinematicsRuntimeValues
      : pendulumRuntimeValues
  const selectedParameterValues = isInclinedPlaneSelected
    ? inclinedPlaneParameterValues
    : isKinematicsSelected
      ? selectedKinematicsParameterValues
      : pendulumParameterValues
  const selectedPresetId = isInclinedPlaneSelected
    ? inclinedPlaneSelectedPresetId
    : isKinematicsSelected
      ? selectedKinematicsPresetId
      : pendulumSelectedPresetId
  const selectedDurationSeconds = isInclinedPlaneSelected
    ? inclinedPlaneDurationSeconds
    : isKinematicsSelected
      ? selectedKinematicsDurationSeconds
      : pendulumDurationSeconds
  const selectedEffectiveChartWindowSeconds = isInclinedPlaneSelected
    ? inclinedPlaneEffectiveChartWindowSeconds
    : isKinematicsSelected
      ? selectedKinematicsEffectiveChartWindowSeconds
      : pendulumEffectiveChartWindowSeconds
  const selectedTimeline = isInclinedPlaneSelected
    ? inclinedPlaneTimeline
    : isKinematicsSelected
      ? selectedKinematicsTimeline
      : pendulumTimeline
  const energyRatio = readEnergyRatio(selectedTimeline.samples)
  const isPlaybackAdvancing = isPlaying && playbackRate > 0
  const handleKinematicsLiveSampleChange = useCallback(
    (simulationId: KinematicsSimulationId, sample: KinematicsSample) => {
      latestKinematicsSamplesRef.current[simulationId] = sample
    },
    [],
  )
  const clearHydrostaticsContinuity = () => {
    delete latestKinematicsSamplesRef.current['hydrostatics-buoyancy']
    setHydrostaticsContinuitySeed(null)
  }

  const handleSimulationSelect = (simulationId: RunnableSimulationId) => {
    setSelectedSimulationId(simulationId)
    setMaximizedPanel(null)
    clearHydrostaticsContinuity()
    setPlaybackResetVersion((current) => current + 1)
  }

  const handlePresetChange = (nextPresetId: string) => {
    const preset = selectedFixture.presets.find(
      (item) => item.id === nextPresetId,
    )

    if (isInclinedPlaneSelected) {
      setInclinedPlaneSelectedPresetId(nextPresetId)
    } else if (isKinematicsSelected) {
      setKinematicsSelectedPresetIdsById((currentValues) => ({
        ...currentValues,
        [selectedKinematicsSimulationId]: nextPresetId,
      }))

      if (selectedKinematicsSimulationId === 'hydrostatics-buoyancy') {
        clearHydrostaticsContinuity()
      }
    } else {
      setPendulumSelectedPresetId(nextPresetId)
    }
    setPlaybackResetVersion((current) => current + 1)

    if (!preset) {
      return
    }

    if (isInclinedPlaneSelected) {
      setInclinedPlaneParameterValues({
        ...inclinedPlaneFixture.defaultParameters,
        ...preset.parameters,
      })
    } else if (isKinematicsSelected) {
      setKinematicsParameterValuesById((currentValues) => ({
        ...currentValues,
        [selectedKinematicsSimulationId]: {
          ...selectedKinematicsFixture.defaultParameters,
          ...preset.parameters,
        },
      }))
    } else {
      setPendulumParameterValues({
        ...pendulumFixture.defaultParameters,
        ...preset.parameters,
      })
    }
  }

  const handleParameterChange = (
    parameter: SimulationParameter,
    nextValue: ParameterValue,
  ) => {
    if (typeof nextValue === 'number' && !Number.isFinite(nextValue)) {
      return
    }

    const clampedValue =
      typeof nextValue === 'number'
        ? clampToParameterRange(nextValue, parameter)
        : nextValue
    const currentValues = selectedParameterValues

    if (currentValues[parameter.id] === clampedValue) {
      return
    }

    if (isInclinedPlaneSelected) {
      setInclinedPlaneSelectedPresetId(customPresetId)
      setInclinedPlaneParameterValues((currentValues) => ({
        ...currentValues,
        [parameter.id]: clampedValue,
      }))
    } else if (isKinematicsSelected) {
      setKinematicsSelectedPresetIdsById((currentValues) => ({
        ...currentValues,
        [selectedKinematicsSimulationId]: customPresetId,
      }))
      if (selectedKinematicsSimulationId === 'hydrostatics-buoyancy') {
        const latestSample =
          latestKinematicsSamplesRef.current[selectedKinematicsSimulationId] ??
          selectedKinematicsTimeline.samples[0]

        if (latestSample) {
          setHydrostaticsContinuitySeed({
            initialCenterZMeters: latestSample.zMeters,
            initialVelocityZMetersPerSecond:
              latestSample.velocityZMetersPerSecond,
            motionStartTimeSeconds: latestSample.timeSeconds,
          })
        }
      }
      setKinematicsParameterValuesById((currentValues) => ({
        ...currentValues,
        [selectedKinematicsSimulationId]: {
          ...currentValues[selectedKinematicsSimulationId],
          [parameter.id]: clampedValue,
        },
      }))
    } else {
      setPendulumSelectedPresetId(customPresetId)
      setPendulumParameterValues((currentValues) => ({
        ...currentValues,
        [parameter.id]: clampedValue,
      }))
    }
  }

  const handleRuntimeParameterChange = (
    parameter: SimulationParameter,
    nextValue: number,
  ) => {
    if (!Number.isFinite(nextValue)) {
      return
    }

    const clampedValue = clampToParameterRange(nextValue, parameter)
    const currentValues = selectedRuntimeValues

    if (currentValues[parameter.id] === clampedValue) {
      return
    }

    if (isInclinedPlaneSelected) {
      setInclinedPlaneRuntimeValues((currentValues) => ({
        ...currentValues,
        [parameter.id]: clampedValue,
      }))
    } else if (isKinematicsSelected) {
      setKinematicsRuntimeValuesById((currentValues) => ({
        ...currentValues,
        [selectedKinematicsSimulationId]: {
          ...currentValues[selectedKinematicsSimulationId],
          [parameter.id]: clampedValue,
        },
      }))
    } else {
      setPendulumRuntimeValues((currentValues) => ({
        ...currentValues,
        [parameter.id]: clampedValue,
      }))
    }
  }

  const handleReset = () => {
    clearHydrostaticsContinuity()
    setPlaybackResetVersion((current) => current + 1)
    setIsPlaying(false)
  }

  const handlePlaybackToggle = () => {
    setIsPlaying((current) => !current)
  }

  const handlePlaybackRateChange = (nextValue: number) => {
    setPlaybackRate(normalizePlaybackRate(nextValue))
  }

  const handleOverlayChange =
    (overlayId: keyof OverlayState) =>
    (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setOverlays((current) => ({
        ...current,
        [overlayId]: checked,
      }))
    }

  const handleOutputPanelToggle = (panelId: keyof OutputPanelState) => {
    setOutputPanels((current) => ({
      ...current,
      [panelId]: !current[panelId],
    }))
  }

  const handleMaximizedPanelToggle = (panelId: MaximizedPanelId) => {
    setMaximizedPanel((currentPanelId) =>
      currentPanelId === panelId ? null : panelId,
    )
  }

  const isPanelMaximized = maximizedPanel !== null
  const isFormulasMaximized = maximizedPanel === 'formulas'
  const isTheoryMaximized = maximizedPanel === 'theory'
  const formulasExpanded = outputPanels.formulas || isFormulasMaximized
  const theoryExpanded = outputPanels.theory || isTheoryMaximized
  const shouldShowFormulas = !isPanelMaximized || isFormulasMaximized
  const shouldShowTheory = !isPanelMaximized || isTheoryMaximized

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          lg: isPanelMaximized ? '1fr' : '288px minmax(0, 1fr)',
        },
      }}
    >
      <Box
        component="aside"
        sx={{
          borderRight: { lg: `1px solid ${themeTokens.border}` },
          borderBottom: { xs: `1px solid ${themeTokens.border}`, lg: 0 },
          bgcolor: themeTokens.surface,
          display: isPanelMaximized ? 'none' : 'block',
          minWidth: 0,
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h2">PhysicSimulator</Typography>
          <Typography color="text.secondary" variant="body2">
            Catalogo local
          </Typography>
        </Box>
        <Divider />

        <SimulationSidebar
          onSelectSimulation={handleSimulationSelect}
          selectedSimulationId={selectedSimulationId}
        />
      </Box>

      <Box
        sx={{
          minWidth: 0,
          pb: {
            xs: floatingControlsMobileBottomReserve,
            md: 0,
          },
          pr: {
            xs: 0,
            md: `${floatingControlsDesktopReservePx}px`,
          },
        }}
      >
        <Box
          component="header"
          sx={{
            alignItems: { xs: 'flex-start', md: 'center' },
            borderBottom: `1px solid ${themeTokens.border}`,
            display: isPanelMaximized ? 'none' : 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 1.5,
            justifyContent: 'space-between',
            px: { xs: 2, md: 3 },
            py: 1.5,
          }}
        >
          <Box>
            <Typography color="primary.main" variant="body2">
              {selectedSimulation.topicPath.join(' > ')}
            </Typography>
            <Typography variant="h1">{selectedSimulation.title}</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              xl: '1fr',
            },
            p: isPanelMaximized ? { xs: 1, md: 1.5 } : { xs: 2, md: 3 },
          }}
        >
          <Stack spacing={2} sx={{ minWidth: 0 }}>
            {isInclinedPlaneSelected ? (
              <InclinedPlaneRuntime
                cameraProjectionMode={cameraProjectionMode}
                chartWindowSeconds={inclinedPlaneEffectiveChartWindowSeconds}
                durationSeconds={inclinedPlaneDurationSeconds}
                isPlaying={isPlaybackAdvancing}
                maximizedPanel={maximizedPanel}
                onCameraProjectionModeChange={setCameraProjectionMode}
                onMaximizedPanelToggle={handleMaximizedPanelToggle}
                onOutputPanelToggle={handleOutputPanelToggle}
                outputPanels={outputPanels}
                overlays={overlays}
                parameters={inclinedPlaneParameters}
                playbackRate={playbackRate}
                resetVersion={playbackResetVersion}
                samples={inclinedPlaneTimeline.samples}
              />
            ) : isKinematicsSelected ? (
              <KinematicsRuntime
                cameraProjectionMode={cameraProjectionMode}
                chartWindowSeconds={
                  selectedKinematicsEffectiveChartWindowSeconds
                }
                durationSeconds={selectedKinematicsDurationSeconds}
                isPlaying={isPlaybackAdvancing}
                key={selectedKinematicsSimulationId}
                maximizedPanel={maximizedPanel}
                modelTimeScale={selectedKinematicsModelTimeScale}
                onCameraProjectionModeChange={setCameraProjectionMode}
                onLiveSampleChange={handleKinematicsLiveSampleChange}
                onMaximizedPanelToggle={handleMaximizedPanelToggle}
                onOutputPanelToggle={handleOutputPanelToggle}
                outputPanels={outputPanels}
                overlays={overlays}
                parameters={selectedKinematicsParameters}
                playbackRate={playbackRate}
                resetVersion={playbackResetVersion}
                samples={selectedKinematicsTimeline.samples}
                simulationId={selectedKinematicsSimulationId}
              />
            ) : (
              <PendulumRuntime
                cameraProjectionMode={cameraProjectionMode}
                chartWindowSeconds={pendulumEffectiveChartWindowSeconds}
                durationSeconds={pendulumDurationSeconds}
                isPlaying={isPlaybackAdvancing}
                maximizedPanel={maximizedPanel}
                onCameraProjectionModeChange={setCameraProjectionMode}
                onMaximizedPanelToggle={handleMaximizedPanelToggle}
                onOutputPanelToggle={handleOutputPanelToggle}
                overlays={overlays}
                outputPanels={outputPanels}
                parameters={pendulumParameters}
                playbackRate={playbackRate}
                resetVersion={playbackResetVersion}
                samples={pendulumTimeline.samples}
              />
            )}

            {shouldShowFormulas || shouldShowTheory ? (
              <>
                {shouldShowFormulas ? (
                  <FormulaGuide
                    expanded={formulasExpanded}
                    formulas={selectedFixture.formulas}
                    maximized={isFormulasMaximized}
                    onMaximizeToggle={() => {
                      handleMaximizedPanelToggle('formulas')
                    }}
                    onToggle={() => {
                      handleOutputPanelToggle('formulas')
                    }}
                    parameters={selectedFixture.parameters}
                  />
                ) : null}

                {shouldShowTheory ? (
                  <TheoryAppendix
                    content={
                      isInclinedPlaneSelected
                        ? inclinedPlaneTheory
                        : isKinematicsSelected
                          ? kinematicsTheoryById[selectedKinematicsSimulationId]
                          : pendulumTheory
                    }
                    expanded={theoryExpanded}
                    limits={selectedFixture.limits}
                    maximized={isTheoryMaximized}
                    onMaximizeToggle={() => {
                      handleMaximizedPanelToggle('theory')
                    }}
                    onToggle={() => {
                      handleOutputPanelToggle('theory')
                    }}
                  />
                ) : null}
              </>
            ) : null}
          </Stack>

          <SimulationControlsPanel
            durationSeconds={selectedDurationSeconds}
            effectiveChartWindowSeconds={selectedEffectiveChartWindowSeconds}
            energyRatio={energyRatio}
            engineLabel={selectedSimulation.technologyPlan?.engine ?? 'custom'}
            fixture={selectedFixture}
            isPlaying={isPlaying}
            isPlaybackAdvancing={isPlaybackAdvancing}
            onOverlayChange={handleOverlayChange}
            onParameterChange={handleParameterChange}
            onPlaybackRateChange={handlePlaybackRateChange}
            onPlaybackToggle={handlePlaybackToggle}
            onPresetChange={handlePresetChange}
            onReset={handleReset}
            onRuntimeParameterChange={handleRuntimeParameterChange}
            outputPanels={outputPanels}
            overlays={overlays}
            parameterValues={selectedParameterValues}
            playbackRate={playbackRate}
            renderLabel="Three.js rAF"
            runtimeValues={selectedRuntimeValues}
            sampleCount={selectedTimeline.samples.length}
            sampleRateHz={selectedFixture.sampleRateHz}
            selectedPresetId={selectedPresetId}
            simulationStatus={selectedSimulation.status}
            warningsCount={selectedTimeline.warnings.length}
          />
        </Box>
      </Box>
    </Box>
  )
}

function SimulationControlsPanel({
  durationSeconds,
  effectiveChartWindowSeconds,
  energyRatio,
  engineLabel,
  fixture,
  isPlaying,
  isPlaybackAdvancing,
  onOverlayChange,
  onParameterChange,
  onPlaybackRateChange,
  onPlaybackToggle,
  onPresetChange,
  onReset,
  onRuntimeParameterChange,
  outputPanels,
  overlays,
  parameterValues,
  playbackRate,
  renderLabel,
  runtimeValues,
  sampleCount,
  sampleRateHz,
  selectedPresetId,
  simulationStatus,
  warningsCount,
}: {
  durationSeconds: number
  effectiveChartWindowSeconds: number
  energyRatio: number
  engineLabel: string
  fixture: SimulationFixture
  isPlaying: boolean
  isPlaybackAdvancing: boolean
  onOverlayChange: (
    overlayId: keyof OverlayState,
  ) => (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => void
  onParameterChange: (
    parameter: SimulationParameter,
    nextValue: ParameterValue,
  ) => void
  onPlaybackRateChange: (nextValue: number) => void
  onPlaybackToggle: () => void
  onPresetChange: (presetId: string) => void
  onReset: () => void
  onRuntimeParameterChange: (
    parameter: SimulationParameter,
    nextValue: number,
  ) => void
  outputPanels: OutputPanelState
  overlays: OverlayState
  parameterValues: Record<string, ParameterValue>
  playbackRate: number
  renderLabel: string
  runtimeValues: Record<string, ParameterValue>
  sampleCount: number
  sampleRateHz: number
  selectedPresetId: string
  simulationStatus: SimulationStatus
  warningsCount: number
}) {
  const playbackStatusLabel = isPlaybackAdvancing
    ? 'rodando'
    : playbackRate === 0 && isPlaying
      ? 'pausado (0x)'
      : 'pausado'

  return (
    <Box
      aria-label="Controles flutuantes da simulacao"
      component="section"
      sx={{
        border: `1px solid ${themeTokens.border}`,
        borderRadius: 1,
        bgcolor: alpha(themeTokens.panel, 0.88),
        backdropFilter: 'blur(16px)',
        bottom: {
          xs: floatingControlsMobileInsetPx,
          md: floatingControlsDesktopInsetPx,
        },
        boxShadow: `0 18px 42px ${alpha('#000000', 0.46)}`,
        maxHeight: {
          xs: floatingControlsMobileMaxHeight,
          md: 'calc(100svh - 32px)',
        },
        minWidth: 0,
        overflowY: 'auto',
        p: 1.5,
        position: 'fixed',
        right: {
          xs: floatingControlsMobileInsetPx,
          md: floatingControlsDesktopInsetPx,
        },
        width: {
          xs: `calc(100vw - ${floatingControlsMobileInsetPx * 2}px)`,
          sm: floatingControlsPanelWidthPx,
        },
        zIndex: 1200,
      }}
    >
      <Stack spacing={2}>
        <Stack
          sx={{
            gap: 1,
          }}
        >
          <Stack
            direction="row"
            sx={{
              alignItems: 'flex-start',
              gap: 1,
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography variant="h2">Controles</Typography>
              <Typography color="text.secondary" variant="body2">
                contador continuo | janela{' '}
                {formatNumber(effectiveChartWindowSeconds, 's')}
              </Typography>
            </Box>
            <Stack
              direction="row"
              sx={{
                flexWrap: 'wrap',
                gap: 0.75,
                justifyContent: 'flex-end',
              }}
            >
              <Chip
                color={isPlaybackAdvancing ? 'primary' : 'default'}
                label={playbackStatusLabel}
                size="small"
                variant={isPlaybackAdvancing ? 'filled' : 'outlined'}
              />
              <Chip label={engineLabel} size="small" variant="outlined" />
              <Chip
                color={getStatusChipColor(simulationStatus)}
                label={getStatusLabel(simulationStatus)}
                size="small"
              />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              aria-label={
                isPlaying ? 'Pausar simulacao' : 'Reproduzir simulacao'
              }
              color="primary"
              fullWidth
              onClick={onPlaybackToggle}
              size="small"
              startIcon={
                isPlaying ? (
                  <Pause aria-hidden size={16} />
                ) : (
                  <Play aria-hidden size={16} />
                )
              }
              variant="contained"
            >
              {isPlaying ? 'Pausar animacao' : 'Reproduzir animacao'}
            </Button>
            <Tooltip title="Resetar">
              <IconButton
                aria-label="Resetar simulacao"
                onClick={onReset}
                size="small"
                sx={{
                  border: `1px solid ${themeTokens.border}`,
                  flex: '0 0 auto',
                }}
              >
                <RotateCcw aria-hidden size={18} />
              </IconButton>
            </Tooltip>
          </Stack>

          <Box>
            <Typography color="text.secondary" variant="body2">
              horizonte calculado {formatNumber(durationSeconds, 's')}
            </Typography>
          </Box>
        </Stack>

        <TextField
          fullWidth
          label="Preset"
          onChange={(event) => {
            onPresetChange(event.target.value)
          }}
          select
          size="small"
          value={selectedPresetId}
        >
          <MenuItem value={customPresetId}>Personalizado</MenuItem>
          {fixture.presets.map((preset) => (
            <MenuItem key={preset.id} value={preset.id}>
              {preset.label}
            </MenuItem>
          ))}
        </TextField>

        <Box>
          <Typography sx={{ mb: 0.75 }} variant="h2">
            Tempo continuo e janela
          </Typography>
          <Stack spacing={1.5}>
            <PlaybackSpeedControl
              onChange={onPlaybackRateChange}
              parameter={playbackRateParameter}
              value={playbackRate}
            />
            {fixture.runtimeParameters.map((parameter) => {
              const value = readNumericParameter(runtimeValues, parameter)
              const renderedParameter = formatRuntimeParameter(parameter)

              return (
                <ParameterControl
                  key={`${parameter.id}:${value}`}
                  onChange={(nextValue) => {
                    onRuntimeParameterChange(parameter, nextValue)
                  }}
                  parameter={renderedParameter}
                  value={value}
                />
              )
            })}
          </Stack>
        </Box>

        <Stack spacing={1.5}>
          {fixture.parameters.map((parameter) => {
            if (parameter.kind === 'boolean') {
              const value = readBooleanParameter(parameterValues, parameter)

              return (
                <BooleanParameterControl
                  key={`${parameter.id}:${value}`}
                  onChange={(nextValue) => {
                    onParameterChange(parameter, nextValue)
                  }}
                  parameter={parameter}
                  value={value}
                />
              )
            }

            const value = readNumericParameter(parameterValues, parameter)

            return (
              <ParameterControl
                key={`${parameter.id}:${value}`}
                onChange={(nextValue) => {
                  onParameterChange(parameter, nextValue)
                }}
                parameter={parameter}
                value={value}
              />
            )
          })}
        </Stack>

        <Box>
          <Typography sx={{ mb: 0.75 }} variant="h2">
            Overlays
          </Typography>
          <Stack spacing={0.5}>
            <FormControlLabel
              control={
                <Switch
                  checked={overlays.vectors}
                  onChange={onOverlayChange('vectors')}
                  size="small"
                />
              }
              label="Vetores"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={overlays.trace}
                  onChange={onOverlayChange('trace')}
                  size="small"
                />
              }
              label="Trilha"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={overlays.energy}
                  onChange={onOverlayChange('energy')}
                  size="small"
                />
              }
              label="Energia"
            />
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography sx={{ mb: 1 }} variant="h2">
            Integrador
          </Typography>
          <Stack spacing={1}>
            <Metric label="samples" value={String(sampleCount)} />
            <Metric
              label="playback"
              value={formatPlaybackRate(playbackRate)}
            />
            <Metric label="sample rate" value={`${sampleRateHz} Hz`} />
            <Metric
              label="janela"
              value={formatNumber(effectiveChartWindowSeconds, 's')}
            />
            <Metric label="render" value={renderLabel} />
            <Metric
              label="graficos"
              value={outputPanels.charts ? 'aberto' : 'recolhido'}
            />
            <Metric
              label="tabela"
              value={outputPanels.table ? 'aberto' : 'recolhido'}
            />
            <Metric
              label="formulas"
              value={outputPanels.formulas ? 'aberto' : 'recolhido'}
            />
            <Metric
              label="teoria"
              value={outputPanels.theory ? 'aberto' : 'recolhido'}
            />
            <Metric
              label="energia final"
              value={`${compactNumber.format(energyRatio)}%`}
            />
            <Metric label="avisos" value={String(warningsCount)} />
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

type SidebarSubarea = {
  label: string
  simulations: SimulationDefinition[]
}

function SimulationSidebar({
  onSelectSimulation,
  selectedSimulationId,
}: {
  onSelectSimulation: (simulationId: RunnableSimulationId) => void
  selectedSimulationId: string
}) {
  const areaGroups = useMemo(
    () =>
      simulationCatalog.areas.map((area) => ({
        area,
        subareas: groupSimulationsBySubarea(area.simulations),
      })),
    [],
  )
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        simulationCatalog.areas.map((area) => [
          area.id,
          area.simulations.some((simulation) =>
            shouldStartExpanded(simulation),
          ),
        ]),
      ),
  )
  const [expandedSubareas, setExpandedSubareas] = useState<
    Record<string, boolean>
  >(() => {
    const entries = simulationCatalog.areas.flatMap((area) =>
      groupSimulationsBySubarea(area.simulations).map((subarea) => [
        getSubareaKey(area.id, subarea.label),
        subarea.simulations.some(
          (simulation) =>
            shouldStartExpanded(simulation),
        ),
      ]),
    )

    return Object.fromEntries(entries)
  })

  const toggleArea = (areaId: string) => {
    setExpandedAreas((current) => ({
      ...current,
      [areaId]: !current[areaId],
    }))
  }

  const toggleSubarea = (subareaKey: string) => {
    setExpandedSubareas((current) => ({
      ...current,
      [subareaKey]: !current[subareaKey],
    }))
  }

  return (
    <Box
      aria-label="Catalogo de simulacoes"
      component="nav"
      sx={{ p: 1.25 }}
    >
      <Stack spacing={0.75}>
        {areaGroups.map(({ area, subareas }) => {
          const isAreaExpanded = Boolean(expandedAreas[area.id])
          const areaContentId = `area-${area.id}`

          return (
            <Box key={area.id}>
              <SidebarToggle
                ariaControls={areaContentId}
                expanded={isAreaExpanded}
                label={area.label}
                onClick={() => {
                  toggleArea(area.id)
                }}
                prefix="area"
                trailing={`${area.simulations.length}`}
              />
              <Collapse in={isAreaExpanded} timeout="auto" unmountOnExit>
                <Stack
                  id={areaContentId}
                  spacing={0.5}
                  sx={{
                    borderLeft: `1px solid ${themeTokens.border}`,
                    ml: 1,
                    mt: 0.5,
                    pl: 1,
                  }}
                >
                  {subareas.map((subarea) => {
                    const subareaKey = getSubareaKey(area.id, subarea.label)
                    const isSubareaExpanded = Boolean(
                      expandedSubareas[subareaKey],
                    )
                    const subareaContentId = `subarea-${area.id}-${slugify(
                      subarea.label,
                    )}`

                    return (
                      <Box key={subareaKey}>
                        <SidebarToggle
                          ariaControls={subareaContentId}
                          expanded={isSubareaExpanded}
                          label={subarea.label}
                          onClick={() => {
                            toggleSubarea(subareaKey)
                          }}
                          prefix="subarea"
                          trailing={`${subarea.simulations.length}`}
                        />
                        <Collapse
                          in={isSubareaExpanded}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Stack
                            id={subareaContentId}
                            spacing={0.5}
                            sx={{ mt: 0.5, pl: 1.25 }}
                          >
                            {subarea.simulations.map((simulation) => (
                              <SidebarSimulationItem
                                active={simulation.id === selectedSimulationId}
                                key={simulation.id}
                                onSelectSimulation={onSelectSimulation}
                                simulation={simulation}
                              />
                            ))}
                          </Stack>
                        </Collapse>
                      </Box>
                    )
                  })}
                </Stack>
              </Collapse>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}

function SidebarToggle({
  ariaControls,
  expanded,
  label,
  onClick,
  prefix,
  trailing,
}: {
  ariaControls: string
  expanded: boolean
  label: string
  onClick: () => void
  prefix: 'area' | 'subarea'
  trailing: string
}) {
  return (
    <Box
      aria-controls={ariaControls}
      aria-expanded={expanded}
      aria-label={`Alternar ${prefix} ${label}`}
      component="button"
      onClick={onClick}
      sx={{
        alignItems: 'center',
        background: 'transparent',
        border: 0,
        borderRadius: 1,
        color: 'inherit',
        cursor: 'pointer',
        display: 'grid',
        font: 'inherit',
        gap: 0.75,
        gridTemplateColumns: '18px minmax(0, 1fr) auto',
        p: prefix === 'area' ? 0.875 : 0.75,
        textAlign: 'left',
        width: '100%',
        '&:focus-visible': {
          outline: `2px solid ${themeTokens.teal}`,
          outlineOffset: -2,
        },
        '&:hover': {
          bgcolor: alpha(themeTokens.teal, 0.08),
        },
      }}
      type="button"
    >
      <Box
        aria-hidden
        sx={{
          color: expanded ? 'primary.main' : 'text.secondary',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </Box>
      <Typography
        sx={{
          fontWeight: prefix === 'area' ? 750 : 650,
          overflowWrap: 'anywhere',
        }}
        variant="body2"
      >
        {label}
      </Typography>
      <Chip label={trailing} size="small" variant="outlined" />
    </Box>
  )
}

function SidebarSimulationItem({
  active,
  onSelectSimulation,
  simulation,
}: {
  active: boolean
  onSelectSimulation: (simulationId: RunnableSimulationId) => void
  simulation: SimulationDefinition
}) {
  const isRunnable = isRunnableSimulation(simulation)
  const commonSx = {
    bgcolor: active
      ? alpha(themeTokens.teal, 0.12)
      : alpha(themeTokens.panel, 0.42),
    border: `1px solid ${active ? themeTokens.teal : themeTokens.border}`,
    borderRadius: 1,
    color: isRunnable ? 'text.primary' : 'text.secondary',
    display: 'block',
    minWidth: 0,
    p: 0.875,
    textAlign: 'left',
    width: '100%',
  }

  const content = (
    <Stack spacing={0.75}>
      <Typography
        sx={{ fontWeight: active ? 750 : 600, overflowWrap: 'anywhere' }}
        variant="body2"
      >
        {simulation.title}
      </Typography>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 0.75,
          justifyContent: 'space-between',
        }}
      >
        <Chip
          color={getStatusChipColor(simulation.status)}
          label={getStatusLabel(simulation.status)}
          size="small"
          variant={isRunnable ? 'filled' : 'outlined'}
        />
        <Typography color="text.secondary" variant="body2">
          {getModelKindLabel(simulation.modelKind)}
        </Typography>
      </Stack>
    </Stack>
  )

  if (isRunnable) {
    return (
      <Box
        aria-current={active ? 'page' : undefined}
        component="button"
        onClick={() => {
          onSelectSimulation(simulation.id as RunnableSimulationId)
        }}
        sx={{
          ...commonSx,
          cursor: 'pointer',
          font: 'inherit',
          '&:focus-visible': {
            outline: `2px solid ${themeTokens.teal}`,
            outlineOffset: -2,
          },
          '&:hover': {
            bgcolor: alpha(themeTokens.teal, 0.1),
          },
        }}
        type="button"
      >
        {content}
      </Box>
    )
  }

  return (
    <Box aria-disabled="true" role="listitem" sx={commonSx}>
      {content}
    </Box>
  )
}

function PendulumRuntime({
  cameraProjectionMode,
  chartWindowSeconds,
  durationSeconds,
  isPlaying,
  maximizedPanel,
  onCameraProjectionModeChange,
  onMaximizedPanelToggle,
  onOutputPanelToggle,
  overlays,
  outputPanels,
  parameters,
  playbackRate,
  resetVersion,
  samples,
}: {
  cameraProjectionMode: CameraProjectionMode
  chartWindowSeconds: number
  durationSeconds: number
  isPlaying: boolean
  maximizedPanel: MaximizedPanelId | null
  onCameraProjectionModeChange: (mode: CameraProjectionMode) => void
  onMaximizedPanelToggle: (panelId: MaximizedPanelId) => void
  onOutputPanelToggle: (panelId: keyof OutputPanelState) => void
  overlays: OverlayState
  outputPanels: OutputPanelState
  parameters: PendulumParameters
  playbackRate: number
  resetVersion: number
  samples: PendulumSample[]
}) {
  const firstSample = useMemo(
    () => readFirstSample(samples, 'Pendulum'),
    [samples],
  )
  const [liveSample, setLiveSample] = useState<PendulumSample>(firstSample)
  const [liveSamples, setLiveSamples] = useState<PendulumSample[]>([
    firstSample,
  ])
  const [frameStats, setFrameStats] =
    useState<PendulumFrameStats>(initialFrameStats)
  const [focusedChartId, setFocusedChartId] =
    useState<PendulumChartId | null>(null)
  const [readoutsExpanded, setReadoutsExpanded] = useState(false)

  const handleSampleChange = useCallback(
    (sample: PendulumSample, stats: PendulumFrameStats) => {
      setLiveSample(sample)
      setLiveSamples((currentSamples) =>
        appendLiveSample(currentSamples, sample),
      )
      setFrameStats(stats)
    },
    [],
  )
  const handleFocusedChartToggle = useCallback((chartId: PendulumChartId) => {
    setFocusedChartId((currentChartId) =>
      currentChartId === chartId ? null : chartId,
    )
  }, [])
  const handleReadoutsToggle = useCallback(() => {
    setReadoutsExpanded((expanded) => !expanded)
  }, [])

  const isSimulationMaximized = maximizedPanel === 'simulation'
  const isChartsMaximized = maximizedPanel === 'charts'
  const isTableMaximized = maximizedPanel === 'table'
  const hasMaximizedPanel = maximizedPanel !== null
  const chartsExpanded = outputPanels.charts || isChartsMaximized
  const tableExpanded = outputPanels.table || isTableMaximized
  const tableRowCount = isTableMaximized
    ? maximizedSampleTableRowCount
    : sampleTableRowCount
  const shouldShowCharts = !hasMaximizedPanel || isChartsMaximized
  const shouldShowTable = !hasMaximizedPanel || isTableMaximized
  const shouldHideSimulationCard = hasMaximizedPanel && !isSimulationMaximized
  const canFocusChartInSimulation = !shouldHideSimulationCard
  const activeFocusedChartId =
    focusedChartId === 'energy' && !overlays.energy ? null : focusedChartId
  const hasFocusedChart = activeFocusedChartId !== null
  const needsChartRange = chartsExpanded || hasFocusedChart
  const needsSampleWindow = needsChartRange || tableExpanded
  const visibleWindowSamples = useMemo(
    () => {
      if (!needsSampleWindow) {
        return []
      }

      return selectRecentSamplesByTime(
        liveSamples,
        liveSample.timeSeconds,
        chartWindowSeconds,
      )
    },
    [
      chartWindowSeconds,
      liveSamples,
      liveSample.timeSeconds,
      needsSampleWindow,
    ],
  )
  const xAxisRange = useMemo<[number, number]>(
    () => {
      if (!needsChartRange) {
        return [0, chartWindowSeconds]
      }

      return getMovingWindowRange(
        liveSample.timeSeconds,
        chartWindowSeconds,
        durationSeconds,
      )
    },
    [
      chartWindowSeconds,
      durationSeconds,
      liveSample.timeSeconds,
      needsChartRange,
    ],
  )
  const vectors = useMemo(
    () =>
      readoutsExpanded && overlays.vectors
        ? getPendulumVectorOverlays(liveSample, parameters)
        : [],
    [liveSample, overlays.vectors, parameters, readoutsExpanded],
  )
  const chartSamples = useMemo(
    () =>
      needsChartRange
        ? appendLiveSample(visibleWindowSamples, liveSample)
        : [],
    [liveSample, needsChartRange, visibleWindowSamples],
  )
  const focusedChart = useMemo(
    () => {
      if (!activeFocusedChartId) {
        return null
      }

      const focusedChartSamples = preparePendulumChartSamples(chartSamples)

      return (
        buildPendulumChartConfigs(focusedChartSamples, overlays.energy).find(
          (chart) => chart.id === activeFocusedChartId,
        ) ?? null
      )
    },
    [activeFocusedChartId, chartSamples, overlays.energy],
  )
  const tableRows = useMemo(() => {
    if (!tableExpanded) {
      return []
    }

    return selectStableRows(visibleWindowSamples, tableRowCount)
  }, [tableExpanded, tableRowCount, visibleWindowSamples])
  return (
    <>
      <Box
        aria-hidden={shouldHideSimulationCard ? true : undefined}
        aria-label="Pendulum numerical viewport"
        sx={[
          {
            border: `1px solid ${themeTokens.border}`,
            borderRadius: 1,
            bgcolor: alpha(themeTokens.panel, 0.58),
            display: 'flex',
            flexDirection: 'column',
            height: '90svh',
            minHeight: 322,
            overflow: 'hidden',
            position: 'relative',
          },
          isSimulationMaximized
            ? {
                height: 'calc(100svh - 24px)',
                minHeight: 'calc(100svh - 24px)',
              }
            : null,
          shouldHideSimulationCard
            ? {
                border: 0,
                height: 1,
                left: -10000,
                minHeight: 1,
                opacity: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                position: 'fixed',
                top: 0,
                visibility: 'hidden',
                width: 1,
              }
            : null,
        ]}
      >
        <Box
          sx={{
            alignItems: 'center',
            borderBottom: `1px solid ${themeTokens.border}`,
            display: 'flex',
            flex: '0 0 auto',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            gap: 1,
            justifyContent: 'space-between',
            px: 1.5,
            py: 1,
          }}
        >
          <Typography
            color="text.secondary"
            sx={{ flex: '0 0 auto', whiteSpace: 'nowrap' }}
            variant="body2"
          >
            t = {formatNumber(liveSample.timeSeconds, 's')}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              ml: 'auto',
            }}
          >
            <Chip
              label={formatFps(frameStats.fps)}
              size="small"
              variant="outlined"
            />
            <CameraProjectionSwitch
              onChange={onCameraProjectionModeChange}
              value={cameraProjectionMode}
            />
            <ReadoutToggleButton
              expanded={readoutsExpanded}
              onToggle={handleReadoutsToggle}
            />
            <Tooltip
              title={isSimulationMaximized ? 'Minimizar' : 'Maximizar'}
            >
              <IconButton
                aria-label={
                  isSimulationMaximized
                    ? 'Minimizar simulacao'
                    : 'Maximizar simulacao'
                }
                aria-pressed={isSimulationMaximized}
                color={isSimulationMaximized ? 'primary' : 'default'}
                onClick={() => {
                  onMaximizedPanelToggle('simulation')
                }}
                size="small"
              >
                {isSimulationMaximized ? (
                  <Minimize2 aria-hidden size={17} />
                ) : (
                  <Maximize2 aria-hidden size={17} />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {readoutsExpanded ? (
          <>
            <Box
              sx={{
                borderBottom: `1px solid ${themeTokens.border}`,
                display: 'grid',
                gap: 1,
                gridTemplateColumns: {
                  xs: '1fr 1fr',
                  md: 'repeat(7, minmax(0, 1fr))',
                },
                p: 1.5,
              }}
            >
              <Metric
                label="Angulo do pendulo"
                value={formatDegrees(radiansToDegrees(liveSample.angleRadians))}
              />
              <Metric
                label="Velocidade angular"
                value={formatNumber(
                  liveSample.angularVelocityRadiansPerSecond,
                  'rad/s',
                )}
              />
              <Metric
                label="Velocidade linear"
                value={formatNumber(
                  liveSample.linearVelocityMetersPerSecond,
                  'm/s',
                )}
              />
              <Metric
                label="Aceleracao total"
                value={formatNumber(
                  liveSample.totalAccelerationMetersPerSecondSquared,
                  'm/s^2',
                )}
              />
              <Metric
                label="Posicao horizontal"
                value={formatNumber(liveSample.xMeters, 'm')}
              />
              {overlays.energy ? (
                <Metric
                  label="Energia mecanica"
                  value={formatNumber(liveSample.totalEnergyJoules, 'J')}
                />
              ) : null}
              <Metric
                label="Tempo do frame"
                value={
                  frameStats.frameTimeMs > 0
                    ? formatNumber(frameStats.frameTimeMs, 'ms')
                    : '-- ms'
                }
              />
            </Box>
            {overlays.vectors ? <VectorLegend vectors={vectors} /> : null}
          </>
        ) : null}
        <Box
          sx={{
            display: 'grid',
            flex: '1 1 auto',
            gap: focusedChart ? 1.5 : 0,
            gridTemplateColumns: {
              xs: '1fr',
              lg: focusedChart
                ? 'minmax(0, 2fr) minmax(280px, 1fr)'
                : '1fr',
            },
            minHeight: 0,
            p: focusedChart ? 1.5 : 0,
          }}
        >
          <Box sx={{ minHeight: 0, minWidth: 0, position: 'relative' }}>
            <PendulumScene
              cameraProjectionMode={cameraProjectionMode}
              durationSeconds={durationSeconds}
              isPlaying={isPlaying}
              onSampleChange={handleSampleChange}
              parameters={parameters}
              playbackRate={playbackRate}
              resetVersion={resetVersion}
              samples={samples}
              showTrace={overlays.trace}
              showVectors={overlays.vectors}
            />
            {overlays.vectors ? (
              <AnimationVectorLegend items={vectorLegendItems} />
            ) : null}
          </Box>
          {focusedChart ? (
            <Box
              aria-label="Slot de grafico em foco da simulacao"
              sx={{ minWidth: 0 }}
            >
              <LiveLineChart
                action={
                  <ChartFocusButton
                    chart={focusedChart}
                    focused
                    onToggle={handleFocusedChartToggle}
                  />
                }
                title={focusedChart.title}
                traces={focusedChart.traces}
                xAxisRange={xAxisRange}
                yAxisMode={focusedChart.yAxisMode}
                yAxisTitle={focusedChart.yAxisTitle}
              />
            </Box>
          ) : null}
        </Box>
      </Box>

      {shouldShowCharts ? (
        <PendulumCharts
          chartWindowSeconds={chartWindowSeconds}
          expanded={chartsExpanded}
          focusedChartId={
            canFocusChartInSimulation ? activeFocusedChartId : null
          }
          maximized={isChartsMaximized}
          onFocusedChartToggle={
            canFocusChartInSimulation ? handleFocusedChartToggle : undefined
          }
          onMaximizeToggle={() => {
            onMaximizedPanelToggle('charts')
          }}
          onToggle={() => {
            onOutputPanelToggle('charts')
          }}
          samples={chartSamples}
          showEnergy={overlays.energy}
          xAxisRange={xAxisRange}
        />
      ) : null}

      {shouldShowTable ? (
        <ChevronSection
          action={
            <Chip
              label={tableExpanded ? `${tableRowCount} linhas` : 'recolhido'}
              size="small"
              variant="outlined"
            />
          }
          expanded={tableExpanded}
          maximized={isTableMaximized}
          onMaximizeToggle={() => {
            onMaximizedPanelToggle('table')
          }}
          onToggle={() => {
            onOutputPanelToggle('table')
          }}
          subtitle={
            tableExpanded
              ? `${samples.length} amostras no horizonte ${formatNumber(
                  durationSeconds,
                  's',
                )} | janela ${formatNumber(chartWindowSeconds, 's')}`
              : 'Recolhida; selecao e renderizacao de linhas suspensas.'
          }
          title="Tabela de amostras"
        >
          {tableExpanded ? (
          <TableContainer
            sx={{
              border: `1px solid ${themeTokens.border}`,
              borderRadius: 1,
              maxHeight: isTableMaximized ? 'calc(100svh - 128px)' : 'none',
            }}
          >
            <Table
              aria-label="Tabela sincronizada de amostras do pendulo"
              size="small"
            >
              <TableHead>
                <TableRow>
                  <TableCell>t</TableCell>
                  <TableCell>theta</TableCell>
                  <TableCell>omega</TableCell>
                  <TableCell>v</TableCell>
                  <TableCell>a_t</TableCell>
                  <TableCell>a_r</TableCell>
                  <TableCell>|a|</TableCell>
                  <TableCell>x</TableCell>
                  <TableCell>y</TableCell>
                  <TableCell>K</TableCell>
                  <TableCell>U</TableCell>
                  <TableCell>E</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((sample, rowIndex) => (
                  <TableRow
                    key={
                      sample ? `${sample.timeSeconds}-${rowIndex}` : rowIndex
                    }
                    sx={{ height: 34 }}
                  >
                    {sample ? (
                      <>
                        <TableCell>
                          {formatNumber(sample.timeSeconds, 's')}
                        </TableCell>
                        <TableCell>
                          {formatDegrees(radiansToDegrees(sample.angleRadians))}
                        </TableCell>
                        <TableCell>
                          {formatNumber(
                            sample.angularVelocityRadiansPerSecond,
                            'rad/s',
                          )}
                        </TableCell>
                        <TableCell>
                          {formatNumber(
                            sample.linearVelocityMetersPerSecond,
                            'm/s',
                          )}
                        </TableCell>
                        <TableCell>
                          {formatNumber(
                            sample.tangentialAccelerationMetersPerSecondSquared,
                            'm/s^2',
                          )}
                        </TableCell>
                        <TableCell>
                          {formatNumber(
                            sample.radialAccelerationMetersPerSecondSquared,
                            'm/s^2',
                          )}
                        </TableCell>
                        <TableCell>
                          {formatNumber(
                            sample.totalAccelerationMetersPerSecondSquared,
                            'm/s^2',
                          )}
                        </TableCell>
                        <TableCell>
                          {formatNumber(sample.xMeters, 'm')}
                        </TableCell>
                        <TableCell>
                          {formatNumber(sample.yMeters, 'm')}
                        </TableCell>
                        <TableCell>
                          {formatEnergy(sample.kineticEnergyJoules)}
                        </TableCell>
                        <TableCell>
                          {formatEnergy(sample.potentialEnergyJoules)}
                        </TableCell>
                        <TableCell>
                          {formatEnergy(sample.totalEnergyJoules)}
                        </TableCell>
                      </>
                    ) : (
                      renderEmptyTableCells()
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          ) : null}
        </ChevronSection>
      ) : null}
    </>
  )
}

function InclinedPlaneRuntime({
  cameraProjectionMode,
  chartWindowSeconds,
  durationSeconds,
  isPlaying,
  maximizedPanel,
  onCameraProjectionModeChange,
  onMaximizedPanelToggle,
  onOutputPanelToggle,
  outputPanels,
  overlays,
  parameters,
  playbackRate,
  resetVersion,
  samples,
}: {
  cameraProjectionMode: CameraProjectionMode
  chartWindowSeconds: number
  durationSeconds: number
  isPlaying: boolean
  maximizedPanel: MaximizedPanelId | null
  onCameraProjectionModeChange: (mode: CameraProjectionMode) => void
  onMaximizedPanelToggle: (panelId: MaximizedPanelId) => void
  onOutputPanelToggle: (panelId: keyof OutputPanelState) => void
  outputPanels: OutputPanelState
  overlays: OverlayState
  parameters: InclinedPlaneParameters
  playbackRate: number
  resetVersion: number
  samples: InclinedPlaneSample[]
}) {
  const firstSample = useMemo(
    () => readFirstSample(samples, 'Inclined plane'),
    [samples],
  )
  const [liveSample, setLiveSample] =
    useState<InclinedPlaneSample>(firstSample)
  const [liveSamples, setLiveSamples] = useState<InclinedPlaneSample[]>([
    firstSample,
  ])
  const [frameStats, setFrameStats] =
    useState<InclinedPlaneFrameStats>(initialInclinedPlaneFrameStats)
  const [focusedChartId, setFocusedChartId] =
    useState<InclinedPlaneChartId | null>(null)
  const [readoutsExpanded, setReadoutsExpanded] = useState(false)

  const handleSampleChange = useCallback(
    (sample: InclinedPlaneSample, stats: InclinedPlaneFrameStats) => {
      setLiveSample(sample)
      setLiveSamples((currentSamples) =>
        appendLiveSample(currentSamples, sample),
      )
      setFrameStats(stats)
    },
    [],
  )
  const handleFocusedChartToggle = useCallback(
    (chartId: InclinedPlaneChartId) => {
      setFocusedChartId((currentChartId) =>
        currentChartId === chartId ? null : chartId,
      )
    },
    [],
  )
  const handleReadoutsToggle = useCallback(() => {
    setReadoutsExpanded((expanded) => !expanded)
  }, [])

  const isSimulationMaximized = maximizedPanel === 'simulation'
  const isChartsMaximized = maximizedPanel === 'charts'
  const isTableMaximized = maximizedPanel === 'table'
  const hasMaximizedPanel = maximizedPanel !== null
  const chartsExpanded = outputPanels.charts || isChartsMaximized
  const tableExpanded = outputPanels.table || isTableMaximized
  const tableRowCount = isTableMaximized
    ? maximizedSampleTableRowCount
    : sampleTableRowCount
  const shouldShowCharts = !hasMaximizedPanel || isChartsMaximized
  const shouldShowTable = !hasMaximizedPanel || isTableMaximized
  const shouldHideSimulationCard = hasMaximizedPanel && !isSimulationMaximized
  const canFocusChartInSimulation = !shouldHideSimulationCard
  const activeFocusedChartId =
    focusedChartId === 'energy' && !overlays.energy ? null : focusedChartId
  const hasFocusedChart = activeFocusedChartId !== null
  const needsChartRange = chartsExpanded || hasFocusedChart
  const needsSampleWindow = needsChartRange || tableExpanded
  const visibleWindowSamples = useMemo(
    () => {
      if (!needsSampleWindow) {
        return []
      }

      return selectRecentSamplesByTime(
        liveSamples,
        liveSample.timeSeconds,
        chartWindowSeconds,
      )
    },
    [
      chartWindowSeconds,
      liveSamples,
      liveSample.timeSeconds,
      needsSampleWindow,
    ],
  )
  const xAxisRange = useMemo<[number, number]>(
    () => {
      if (!needsChartRange) {
        return [0, chartWindowSeconds]
      }

      return getMovingWindowRange(
        liveSample.timeSeconds,
        chartWindowSeconds,
        durationSeconds,
      )
    },
    [
      chartWindowSeconds,
      durationSeconds,
      liveSample.timeSeconds,
      needsChartRange,
    ],
  )
  const vectors = useMemo(
    () =>
      readoutsExpanded && overlays.vectors
        ? getInclinedPlaneVectorOverlays(liveSample, parameters)
        : [],
    [liveSample, overlays.vectors, parameters, readoutsExpanded],
  )
  const chartSamples = useMemo(
    () =>
      needsChartRange
        ? appendLiveSample(visibleWindowSamples, liveSample)
        : [],
    [liveSample, needsChartRange, visibleWindowSamples],
  )
  const focusedChart = useMemo(
    () => {
      if (!activeFocusedChartId) {
        return null
      }

      const focusedChartSamples = prepareInclinedPlaneChartSamples(chartSamples)

      return (
        buildInclinedPlaneChartConfigs(focusedChartSamples)
          .filter((chart) => overlays.energy || chart.id !== 'energy')
          .find((chart) => chart.id === activeFocusedChartId) ?? null
      )
    },
    [activeFocusedChartId, chartSamples, overlays.energy],
  )
  const tableRows = useMemo(() => {
    if (!tableExpanded) {
      return []
    }

    return selectStableRows(visibleWindowSamples, tableRowCount)
  }, [tableExpanded, tableRowCount, visibleWindowSamples])

  return (
    <>
      <Box
        aria-hidden={shouldHideSimulationCard ? true : undefined}
        aria-label="Inclined plane numerical viewport"
        sx={[
          {
            border: `1px solid ${themeTokens.border}`,
            borderRadius: 1,
            bgcolor: alpha(themeTokens.panel, 0.58),
            display: 'flex',
            flexDirection: 'column',
            height: '90svh',
            minHeight: 322,
            overflow: 'hidden',
            position: 'relative',
          },
          isSimulationMaximized
            ? {
                height: 'calc(100svh - 24px)',
                minHeight: 'calc(100svh - 24px)',
              }
            : null,
          shouldHideSimulationCard
            ? {
                border: 0,
                height: 1,
                left: -10000,
                minHeight: 1,
                opacity: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                position: 'fixed',
                top: 0,
                visibility: 'hidden',
                width: 1,
              }
            : null,
        ]}
      >
        <Box
          sx={{
            alignItems: 'center',
            borderBottom: `1px solid ${themeTokens.border}`,
            display: 'flex',
            flex: '0 0 auto',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            gap: 1,
            justifyContent: 'space-between',
            px: 1.5,
            py: 1,
          }}
        >
          <Typography
            color="text.secondary"
            sx={{ flex: '0 0 auto', whiteSpace: 'nowrap' }}
            variant="body2"
          >
            t = {formatNumber(liveSample.timeSeconds, 's')}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              ml: 'auto',
            }}
          >
            <Chip
              label={formatFps(frameStats.fps)}
              size="small"
              variant="outlined"
            />
            <CameraProjectionSwitch
              onChange={onCameraProjectionModeChange}
              value={cameraProjectionMode}
            />
            <ReadoutToggleButton
              expanded={readoutsExpanded}
              onToggle={handleReadoutsToggle}
            />
            <Tooltip
              title={isSimulationMaximized ? 'Minimizar' : 'Maximizar'}
            >
              <IconButton
                aria-label={
                  isSimulationMaximized
                    ? 'Minimizar simulacao'
                    : 'Maximizar simulacao'
                }
                aria-pressed={isSimulationMaximized}
                color={isSimulationMaximized ? 'primary' : 'default'}
                onClick={() => {
                  onMaximizedPanelToggle('simulation')
                }}
                size="small"
              >
                {isSimulationMaximized ? (
                  <Minimize2 aria-hidden size={17} />
                ) : (
                  <Maximize2 aria-hidden size={17} />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {readoutsExpanded ? (
          <>
            <Box
              sx={{
                borderBottom: `1px solid ${themeTokens.border}`,
                display: 'grid',
                gap: 1,
                gridTemplateColumns: {
                  xs: '1fr 1fr',
                  md: 'repeat(7, minmax(0, 1fr))',
                },
                p: 1.5,
              }}
            >
              <Metric
                label="Posicao no plano"
                value={formatNumber(liveSample.positionMeters, 'm')}
              />
              <Metric
                label="Velocidade no plano"
                value={formatNumber(liveSample.velocityMetersPerSecond, 'm/s')}
              />
              <Metric
                label="Aceleracao no plano"
                value={formatNumber(
                  liveSample.accelerationMetersPerSecondSquared,
                  'm/s^2',
                )}
              />
              <Metric
                label="Forca resultante"
                value={formatNumber(liveSample.netForceNewtons, 'N')}
              />
              <Metric
                label="Forca normal"
                value={formatNumber(liveSample.normalForceNewtons, 'N')}
              />
              {overlays.energy ? (
                <Metric
                  label="Energia total"
                  value={formatNumber(liveSample.totalEnergyJoules, 'J')}
                />
              ) : null}
              <Metric
                label="Tempo do frame"
                value={
                  frameStats.frameTimeMs > 0
                    ? formatNumber(frameStats.frameTimeMs, 'ms')
                    : '-- ms'
                }
              />
            </Box>
            {overlays.vectors ? (
              <InclinedPlaneVectorLegend vectors={vectors} />
            ) : null}
          </>
        ) : null}
        <Box
          sx={{
            display: 'grid',
            flex: '1 1 auto',
            gap: focusedChart ? 1.5 : 0,
            gridTemplateColumns: {
              xs: '1fr',
              lg: focusedChart
                ? 'minmax(0, 2fr) minmax(280px, 1fr)'
                : '1fr',
            },
            minHeight: 0,
            p: focusedChart ? 1.5 : 0,
          }}
        >
          <Box sx={{ minHeight: 0, minWidth: 0, position: 'relative' }}>
            <InclinedPlaneScene
              cameraProjectionMode={cameraProjectionMode}
              durationSeconds={durationSeconds}
              isPlaying={isPlaying}
              onSampleChange={handleSampleChange}
              parameters={parameters}
              playbackRate={playbackRate}
              resetVersion={resetVersion}
              samples={samples}
              showTrace={overlays.trace}
              showVectors={overlays.vectors}
            />
            {overlays.vectors ? (
              <AnimationVectorLegend
                items={inclinedPlaneVectorLegendItems}
              />
            ) : null}
          </Box>
          {focusedChart ? (
            <Box
              aria-label="Slot de grafico em foco da simulacao"
              sx={{ minWidth: 0 }}
            >
              <LiveLineChart
                action={
                  <ChartFocusButton
                    chart={focusedChart}
                    focused
                    onToggle={handleFocusedChartToggle}
                  />
                }
                title={focusedChart.title}
                traces={focusedChart.traces}
                xAxisRange={xAxisRange}
                yAxisMode={focusedChart.yAxisMode}
                yAxisTitle={focusedChart.yAxisTitle}
              />
            </Box>
          ) : null}
        </Box>
      </Box>

      {shouldShowCharts ? (
        <InclinedPlaneCharts
          chartWindowSeconds={chartWindowSeconds}
          expanded={chartsExpanded}
          focusedChartId={
            canFocusChartInSimulation ? activeFocusedChartId : null
          }
          maximized={isChartsMaximized}
          onFocusedChartToggle={
            canFocusChartInSimulation ? handleFocusedChartToggle : undefined
          }
          onMaximizeToggle={() => {
            onMaximizedPanelToggle('charts')
          }}
          onToggle={() => {
            onOutputPanelToggle('charts')
          }}
          samples={chartSamples}
          showEnergy={overlays.energy}
          xAxisRange={xAxisRange}
        />
      ) : null}

      {shouldShowTable ? (
        <ChevronSection
          action={
            <Chip
              label={tableExpanded ? `${tableRowCount} linhas` : 'recolhido'}
              size="small"
              variant="outlined"
            />
          }
          expanded={tableExpanded}
          maximized={isTableMaximized}
          onMaximizeToggle={() => {
            onMaximizedPanelToggle('table')
          }}
          onToggle={() => {
            onOutputPanelToggle('table')
          }}
          subtitle={
            tableExpanded
              ? `${samples.length} amostras no horizonte ${formatNumber(
                  durationSeconds,
                  's',
                )} | janela ${formatNumber(chartWindowSeconds, 's')}`
              : 'Recolhida; selecao e renderizacao de linhas suspensas.'
          }
          title="Tabela de amostras"
        >
          {tableExpanded ? (
            <TableContainer
              sx={{
                border: `1px solid ${themeTokens.border}`,
                borderRadius: 1,
                maxHeight: isTableMaximized ? 'calc(100svh - 128px)' : 'none',
              }}
            >
              <Table
                aria-label="Tabela sincronizada de amostras do plano inclinado"
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>t</TableCell>
                    <TableCell>s</TableCell>
                    <TableCell>v</TableCell>
                    <TableCell>a</TableCell>
                    <TableCell>h</TableCell>
                    <TableCell>N</TableCell>
                    <TableCell>F_at</TableCell>
                    <TableCell>F_res</TableCell>
                    <TableCell>K</TableCell>
                    <TableCell>U</TableCell>
                    <TableCell>E_t</TableCell>
                    <TableCell>E</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableRows.map((sample, rowIndex) => (
                    <TableRow
                      key={
                        sample ? `${sample.timeSeconds}-${rowIndex}` : rowIndex
                      }
                      sx={{ height: 34 }}
                    >
                      {sample ? (
                        <>
                          <TableCell>
                            {formatNumber(sample.timeSeconds, 's')}
                          </TableCell>
                          <TableCell>
                            {formatNumber(sample.positionMeters, 'm')}
                          </TableCell>
                          <TableCell>
                            {formatNumber(
                              sample.velocityMetersPerSecond,
                              'm/s',
                            )}
                          </TableCell>
                          <TableCell>
                            {formatNumber(
                              sample.accelerationMetersPerSecondSquared,
                              'm/s^2',
                            )}
                          </TableCell>
                          <TableCell>
                            {formatNumber(sample.heightMeters, 'm')}
                          </TableCell>
                          <TableCell>
                            {formatNumber(sample.normalForceNewtons, 'N')}
                          </TableCell>
                          <TableCell>
                            {formatNumber(sample.frictionMagnitudeNewtons, 'N')}
                          </TableCell>
                          <TableCell>
                            {formatNumber(sample.netForceNewtons, 'N')}
                          </TableCell>
                          <TableCell>
                            {formatEnergy(sample.kineticEnergyJoules)}
                          </TableCell>
                          <TableCell>
                            {formatEnergy(sample.potentialEnergyJoules)}
                          </TableCell>
                          <TableCell>
                            {formatEnergy(sample.thermalEnergyJoules)}
                          </TableCell>
                          <TableCell>
                            {formatEnergy(sample.totalEnergyJoules)}
                          </TableCell>
                        </>
                      ) : (
                        renderEmptyInclinedPlaneTableCells()
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </ChevronSection>
      ) : null}
    </>
  )
}

function KinematicsRuntime({
  cameraProjectionMode,
  chartWindowSeconds,
  durationSeconds,
  isPlaying,
  maximizedPanel,
  modelTimeScale,
  onCameraProjectionModeChange,
  onLiveSampleChange,
  onMaximizedPanelToggle,
  onOutputPanelToggle,
  outputPanels,
  overlays,
  parameters,
  playbackRate,
  resetVersion,
  samples,
  simulationId,
}: {
  cameraProjectionMode: CameraProjectionMode
  chartWindowSeconds: number
  durationSeconds: number
  isPlaying: boolean
  maximizedPanel: MaximizedPanelId | null
  modelTimeScale: number
  onCameraProjectionModeChange: (mode: CameraProjectionMode) => void
  onLiveSampleChange: (
    simulationId: KinematicsSimulationId,
    sample: KinematicsSample,
  ) => void
  onMaximizedPanelToggle: (panelId: MaximizedPanelId) => void
  onOutputPanelToggle: (panelId: keyof OutputPanelState) => void
  outputPanels: OutputPanelState
  overlays: OverlayState
  parameters: KinematicsParameters
  playbackRate: number
  resetVersion: number
  samples: KinematicsSample[]
  simulationId: KinematicsSimulationId
}) {
  const firstSample = useMemo(
    () => readFirstSample(samples, 'Kinematics'),
    [samples],
  )
  const [liveSample, setLiveSample] =
    useState<KinematicsSample>(firstSample)
  const [liveSamples, setLiveSamples] = useState<KinematicsSample[]>([
    firstSample,
  ])
  const [frameStats, setFrameStats] =
    useState<KinematicsFrameStats>(initialKinematicsFrameStats)
  const [focusedChartId, setFocusedChartId] =
    useState<KinematicsChartId | null>(null)
  const [readoutsExpanded, setReadoutsExpanded] = useState(false)

  const handleSampleChange = useCallback(
    (sample: KinematicsSample, stats: KinematicsFrameStats) => {
      onLiveSampleChange(simulationId, sample)
      setLiveSample(sample)
      setLiveSamples((currentSamples) =>
        appendLiveSample(currentSamples, sample),
      )
      setFrameStats(stats)
    },
    [onLiveSampleChange, simulationId],
  )
  const handleFocusedChartToggle = useCallback(
    (chartId: KinematicsChartId) => {
      setFocusedChartId((currentChartId) =>
        currentChartId === chartId ? null : chartId,
      )
    },
    [],
  )
  const handleReadoutsToggle = useCallback(() => {
    setReadoutsExpanded((expanded) => !expanded)
  }, [])

  const isSimulationMaximized = maximizedPanel === 'simulation'
  const isChartsMaximized = maximizedPanel === 'charts'
  const isTableMaximized = maximizedPanel === 'table'
  const hasMaximizedPanel = maximizedPanel !== null
  const chartsExpanded = outputPanels.charts || isChartsMaximized
  const tableExpanded = outputPanels.table || isTableMaximized
  const tableRowCount = isTableMaximized
    ? maximizedSampleTableRowCount
    : sampleTableRowCount
  const shouldShowCharts = !hasMaximizedPanel || isChartsMaximized
  const shouldShowTable = !hasMaximizedPanel || isTableMaximized
  const shouldHideSimulationCard = hasMaximizedPanel && !isSimulationMaximized
  const canFocusChartInSimulation = !shouldHideSimulationCard
  const activeFocusedChartId =
    focusedChartId === 'energy' && !overlays.energy ? null : focusedChartId
  const hasFocusedChart = activeFocusedChartId !== null
  const needsChartRange = chartsExpanded || hasFocusedChart
  const needsSampleWindow = needsChartRange || tableExpanded
  const visibleWindowSamples = useMemo(
    () => {
      if (!needsSampleWindow) {
        return []
      }

      return selectRecentSamplesByTime(
        liveSamples,
        liveSample.timeSeconds,
        chartWindowSeconds,
      )
    },
    [
      chartWindowSeconds,
      liveSamples,
      liveSample.timeSeconds,
      needsSampleWindow,
    ],
  )
  const xAxisRange = useMemo<[number, number]>(
    () => {
      if (!needsChartRange) {
        return [0, chartWindowSeconds]
      }

      return getMovingWindowRange(
        liveSample.timeSeconds,
        chartWindowSeconds,
        durationSeconds,
      )
    },
    [
      chartWindowSeconds,
      durationSeconds,
      liveSample.timeSeconds,
      needsChartRange,
    ],
  )
  const vectors = useMemo(
    () =>
      readoutsExpanded && overlays.vectors
        ? getKinematicsVectorOverlays(liveSample, simulationId)
        : [],
    [liveSample, overlays.vectors, readoutsExpanded, simulationId],
  )
  const chartSamples = useMemo(
    () =>
      needsChartRange
        ? appendLiveSample(visibleWindowSamples, liveSample)
        : [],
    [liveSample, needsChartRange, visibleWindowSamples],
  )
  const focusedChart = useMemo(
    () => {
      if (!activeFocusedChartId) {
        return null
      }

      const focusedChartSamples = prepareKinematicsChartSamples(chartSamples)

      return (
        buildKinematicsChartConfigs(
          focusedChartSamples,
          simulationId,
          overlays.energy,
        ).find((chart) => chart.id === activeFocusedChartId) ?? null
      )
    },
    [activeFocusedChartId, chartSamples, overlays.energy, simulationId],
  )
  const tableRows = useMemo(() => {
    if (!tableExpanded) {
      return []
    }

    return selectStableRows(visibleWindowSamples, tableRowCount)
  }, [tableExpanded, tableRowCount, visibleWindowSamples])
  const vectorLegendItems = kinematicsVectorLegendItemsById[simulationId]
  const readoutMetrics = useMemo(
    () =>
      readoutsExpanded
        ? buildKinematicsReadoutMetrics({
            frameStats,
            sample: liveSample,
            showEnergy: overlays.energy,
            simulationId,
          })
        : [],
    [frameStats, liveSample, overlays.energy, readoutsExpanded, simulationId],
  )

  return (
    <>
      <Box
        aria-hidden={shouldHideSimulationCard ? true : undefined}
        aria-label="Kinematics numerical viewport"
        sx={[
          {
            border: `1px solid ${themeTokens.border}`,
            borderRadius: 1,
            bgcolor: alpha(themeTokens.panel, 0.58),
            display: 'flex',
            flexDirection: 'column',
            height: '90svh',
            minHeight: 322,
            overflow: 'hidden',
            position: 'relative',
          },
          isSimulationMaximized
            ? {
                height: 'calc(100svh - 24px)',
                minHeight: 'calc(100svh - 24px)',
              }
            : null,
          shouldHideSimulationCard
            ? {
                border: 0,
                height: 1,
                left: -10000,
                minHeight: 1,
                opacity: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                position: 'fixed',
                top: 0,
                visibility: 'hidden',
                width: 1,
              }
            : null,
        ]}
      >
        <Box
          sx={{
            alignItems: 'center',
            borderBottom: `1px solid ${themeTokens.border}`,
            display: 'flex',
            flex: '0 0 auto',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            gap: 1,
            justifyContent: 'space-between',
            px: 1.5,
            py: 1,
          }}
        >
          <Typography
            color="text.secondary"
            sx={{ flex: '0 0 auto', whiteSpace: 'nowrap' }}
            variant="body2"
          >
            t = {formatNumber(liveSample.timeSeconds, 's')}
          </Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
              ml: 'auto',
            }}
          >
            <Chip
              label={formatFps(frameStats.fps)}
              size="small"
              variant="outlined"
            />
            <CameraProjectionSwitch
              onChange={onCameraProjectionModeChange}
              value={cameraProjectionMode}
            />
            <ReadoutToggleButton
              expanded={readoutsExpanded}
              onToggle={handleReadoutsToggle}
            />
            <Tooltip
              title={isSimulationMaximized ? 'Minimizar' : 'Maximizar'}
            >
              <IconButton
                aria-label={
                  isSimulationMaximized
                    ? 'Minimizar simulacao'
                    : 'Maximizar simulacao'
                }
                aria-pressed={isSimulationMaximized}
                color={isSimulationMaximized ? 'primary' : 'default'}
                onClick={() => {
                  onMaximizedPanelToggle('simulation')
                }}
                size="small"
              >
                {isSimulationMaximized ? (
                  <Minimize2 aria-hidden size={17} />
                ) : (
                  <Maximize2 aria-hidden size={17} />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {readoutsExpanded ? (
          <>
            <Box
              sx={{
                borderBottom: `1px solid ${themeTokens.border}`,
                display: 'grid',
                gap: 1,
                gridTemplateColumns: {
                  xs: '1fr 1fr',
                  md: 'repeat(7, minmax(0, 1fr))',
                },
                p: 1.5,
              }}
            >
              {readoutMetrics.map((metric) => (
                <Metric
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                />
              ))}
            </Box>
            {overlays.vectors ? (
              <KinematicsVectorLegend
                items={vectorLegendItems}
                vectors={vectors}
              />
            ) : null}
          </>
        ) : null}
        <Box
          sx={{
            display: 'grid',
            flex: '1 1 auto',
            gap: focusedChart ? 1.5 : 0,
            gridTemplateColumns: {
              xs: '1fr',
              lg: focusedChart
                ? 'minmax(0, 2fr) minmax(280px, 1fr)'
                : '1fr',
            },
            minHeight: 0,
            p: focusedChart ? 1.5 : 0,
          }}
        >
          <Box sx={{ minHeight: 0, minWidth: 0, position: 'relative' }}>
            <KinematicsScene
              cameraProjectionMode={cameraProjectionMode}
              durationSeconds={durationSeconds}
              isPlaying={isPlaying}
              modelTimeScale={modelTimeScale}
              onSampleChange={handleSampleChange}
              parameters={parameters}
              playbackRate={playbackRate}
              resetVersion={resetVersion}
              samples={samples}
              showTrace={overlays.trace}
              showVectors={overlays.vectors}
              simulationId={simulationId}
            />
            {overlays.vectors ? (
              <AnimationVectorLegend items={vectorLegendItems} />
            ) : null}
            {simulationId === 'work-energy-track' && overlays.energy ? (
              <WorkEnergyTrackHud sample={liveSample} />
            ) : null}
          </Box>
          {focusedChart ? (
            <Box
              aria-label="Slot de grafico em foco da simulacao"
              sx={{ minWidth: 0 }}
            >
              <LiveLineChart
                action={
                  <ChartFocusButton
                    chart={focusedChart}
                    focused
                    onToggle={handleFocusedChartToggle}
                  />
                }
                title={focusedChart.title}
                traces={focusedChart.traces}
                xAxisRange={xAxisRange}
                yAxisMode={focusedChart.yAxisMode}
                yAxisTitle={focusedChart.yAxisTitle}
              />
            </Box>
          ) : null}
        </Box>
      </Box>

      {shouldShowCharts ? (
        <KinematicsCharts
          chartWindowSeconds={chartWindowSeconds}
          expanded={chartsExpanded}
          focusedChartId={
            canFocusChartInSimulation ? activeFocusedChartId : null
          }
          maximized={isChartsMaximized}
          onFocusedChartToggle={
            canFocusChartInSimulation ? handleFocusedChartToggle : undefined
          }
          onMaximizeToggle={() => {
            onMaximizedPanelToggle('charts')
          }}
          onToggle={() => {
            onOutputPanelToggle('charts')
          }}
          samples={chartSamples}
          showEnergy={overlays.energy}
          simulationId={simulationId}
          xAxisRange={xAxisRange}
        />
      ) : null}

      {shouldShowTable ? (
        <ChevronSection
          action={
            <Chip
              label={tableExpanded ? `${tableRowCount} linhas` : 'recolhido'}
              size="small"
              variant="outlined"
            />
          }
          expanded={tableExpanded}
          maximized={isTableMaximized}
          onMaximizeToggle={() => {
            onMaximizedPanelToggle('table')
          }}
          onToggle={() => {
            onOutputPanelToggle('table')
          }}
          subtitle={
            tableExpanded
              ? `${samples.length} amostras no horizonte ${formatNumber(
                  durationSeconds,
                  's',
                )} | janela ${formatNumber(chartWindowSeconds, 's')}`
              : 'Recolhida; selecao e renderizacao de linhas suspensas.'
          }
          title="Tabela de amostras"
        >
          {tableExpanded ? (
            <TableContainer
              sx={{
                border: `1px solid ${themeTokens.border}`,
                borderRadius: 1,
                maxHeight: isTableMaximized ? 'calc(100svh - 128px)' : 'none',
              }}
            >
              <Table
                aria-label="Tabela sincronizada de amostras de Cinematica"
                size="small"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>t</TableCell>
                    <TableCell>s</TableCell>
                    <TableCell>Delta s</TableCell>
                    <TableCell>x</TableCell>
                    <TableCell>z</TableCell>
                    <TableCell>v</TableCell>
                    <TableCell>|v|</TableCell>
                    <TableCell>a</TableCell>
                    <TableCell>F</TableCell>
                    <TableCell>T</TableCell>
                    <TableCell>K</TableCell>
                    <TableCell>U</TableCell>
                    <TableCell>E_t</TableCell>
                    <TableCell>W</TableCell>
                    <TableCell>E</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableRows.map((sample, rowIndex) => (
                    <TableRow
                      key={
                        sample ? `${sample.timeSeconds}-${rowIndex}` : rowIndex
                      }
                      sx={{ height: 34 }}
                    >
                      {sample ? (
                        <>
                          <TableCell>
                            {formatNumber(sample.timeSeconds, 's')}
                          </TableCell>
                          <TableCell>
                            {formatNumber(sample.positionMeters, 'm')}
                          </TableCell>
                          <TableCell>
                            {formatNumber(sample.displacementMeters, 'm')}
                          </TableCell>
                          <TableCell>
                            {formatNumber(sample.xMeters, 'm')}
                          </TableCell>
                          <TableCell>
                            {formatNumber(sample.zMeters, 'm')}
                          </TableCell>
                          <TableCell>
                            {formatNumber(
                              sample.velocityMetersPerSecond,
                              'm/s',
                            )}
                          </TableCell>
                          <TableCell>
                            {formatNumber(sample.speedMetersPerSecond, 'm/s')}
                          </TableCell>
                          <TableCell>
                          {formatNumber(
                              sample.accelerationMetersPerSecondSquared,
                              'm/s^2',
                            )}
                          </TableCell>
                          <TableCell>
                            {formatNumber(sample.netForceNewtons, 'N')}
                          </TableCell>
                          <TableCell>
                            {formatNumber(sample.tensionNewtons, 'N')}
                          </TableCell>
                          <TableCell>
                            {formatEnergy(sample.kineticEnergyJoules)}
                          </TableCell>
                          <TableCell>
                            {formatEnergy(sample.potentialEnergyJoules)}
                          </TableCell>
                          <TableCell>
                            {formatEnergy(sample.thermalEnergyJoules)}
                          </TableCell>
                          <TableCell>
                            {formatEnergy(sample.appliedWorkJoules)}
                          </TableCell>
                          <TableCell>
                            {formatEnergy(sample.totalEnergyJoules)}
                          </TableCell>
                        </>
                      ) : (
                        renderEmptyKinematicsTableCells()
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </ChevronSection>
      ) : null}
    </>
  )
}

function buildKinematicsReadoutMetrics({
  frameStats,
  sample,
  showEnergy,
  simulationId,
}: {
  frameStats: KinematicsFrameStats
  sample: KinematicsSample
  showEnergy: boolean
  simulationId: KinematicsSimulationId
}) {
  const frameMetric = {
    label: 'Tempo do frame',
    value:
      frameStats.frameTimeMs > 0
        ? formatNumber(frameStats.frameTimeMs, 'ms')
        : '-- ms',
  }
  const energyMetric = showEnergy
    ? [
        {
          label: 'Energia total',
          value: formatNumber(sample.totalEnergyJoules, 'J'),
        },
      ]
    : []

  if (simulationId === 'collisions-1d-2d') {
    return [
      { label: 'Corpo 1', value: formatNumber(sample.speedMetersPerSecond, 'm/s') },
      {
        label: 'Corpo 2',
        value: formatNumber(sample.secondarySpeedMetersPerSecond, 'm/s'),
      },
      {
        label: 'Momento total',
        value: formatNumber(sample.momentumKilogramMetersPerSecond, 'kg m/s'),
      },
      {
        label: 'Impulso',
        value: formatNumber(sample.impulseNewtonSeconds, 'N s'),
      },
      ...energyMetric,
      frameMetric,
    ]
  }

  if (simulationId === 'continuity-bernoulli') {
    return [
      {
        label: 'Vazao',
        value: formatNumber(sample.flowRateCubicMetersPerSecond, 'm^3/s'),
      },
      {
        label: 'Area entrada',
        value: formatNumber(sample.crossSectionAreaSquareMeters, 'm^2'),
      },
      {
        label: 'Area garganta',
        value: formatNumber(sample.secondaryCrossSectionAreaSquareMeters, 'm^2'),
      },
      {
        label: 'Vel. entrada',
        value: formatNumber(sample.speedMetersPerSecond, 'm/s'),
      },
      {
        label: 'Vel. garganta',
        value: formatNumber(sample.secondarySpeedMetersPerSecond, 'm/s'),
      },
      {
        label: 'Pressao entrada',
        value: formatNumber(sample.pressurePascals, 'Pa'),
      },
      {
        label: 'Pressao garganta',
        value: formatNumber(sample.secondaryPressurePascals, 'Pa'),
      },
      {
        label: 'Queda',
        value: formatNumber(sample.netForceNewtons, 'Pa'),
      },
      frameMetric,
    ]
  }

  if (simulationId === 'gravitational-field-orbits') {
    return [
      {
        label: 'Raio orbital',
        value: formatNumber(sample.positionMeters, 'm'),
      },
      {
        label: 'Velocidade',
        value: formatNumber(sample.speedMetersPerSecond, 'm/s'),
      },
      {
        label: 'Campo g',
        value: formatNumber(sample.gravitationalFieldNewtonsPerKilogram, 'N/kg'),
      },
      ...energyMetric,
      frameMetric,
    ]
  }

  if (simulationId === 'hydrostatics-buoyancy') {
    return [
      {
        label: 'Massa',
        value: formatNumber(sample.objectMassKilograms, 'kg'),
      },
      {
        label: 'Densidade corpo',
        value: formatNumber(
          sample.objectDensityKilogramsPerCubicMeter,
          'kg/m^3',
        ),
      },
      {
        label: 'Pressao centro',
        value: formatNumber(sample.fluidPressurePascals, 'Pa'),
      },
      {
        label: 'Pressao topo',
        value: formatNumber(sample.pressurePascals, 'Pa'),
      },
      {
        label: 'Pressao base',
        value: formatNumber(sample.secondaryPressurePascals, 'Pa'),
      },
      {
        label: 'Aceleracao',
        value: formatNumber(
          sample.accelerationMetersPerSecondSquared,
          'm/s^2',
        ),
      },
      {
        label: 'Empuxo',
        value: formatNumber(sample.buoyantForceNewtons, 'N'),
      },
      {
        label: 'Submersao',
        value: `${compactNumber.format(sample.submergedFraction * 100)}%`,
      },
      {
        label: 'Resultante',
        value: formatNumber(sample.netForceNewtons, 'N'),
      },
      frameMetric,
    ]
  }

  if (simulationId === 'mass-spring') {
    return [
      {
        label: 'Deslocamento',
        value: formatNumber(sample.positionMeters, 'm'),
      },
      {
        label: 'Velocidade',
        value: formatNumber(sample.velocityMetersPerSecond, 'm/s'),
      },
      {
        label: 'Aceleracao',
        value: formatNumber(sample.accelerationMetersPerSecondSquared, 'm/s^2'),
      },
      {
        label: 'Forca elastica',
        value: formatNumber(sample.springForceNewtons, 'N'),
      },
      ...energyMetric,
      frameMetric,
    ]
  }

  if (simulationId === 'particle-equilibrium') {
    return [
      {
        label: 'Resultante',
        value: formatNumber(sample.netForceNewtons, 'N'),
      },
      {
        label: 'Aceleracao',
        value: formatNumber(sample.accelerationMetersPerSecondSquared, 'm/s^2'),
      },
      { label: 'Deslocamento', value: formatNumber(sample.displacementMeters, 'm') },
      ...energyMetric,
      frameMetric,
    ]
  }

  if (simulationId === 'work-energy-track') {
    return [
      {
        label: 'Posicao horizontal',
        value: formatNumber(sample.positionMeters, 'm'),
      },
      {
        label: 'Altura',
        value: formatNumber(sample.zMeters, 'm'),
      },
      {
        label: 'Velocidade',
        value: formatNumber(sample.velocityMetersPerSecond, 'm/s'),
      },
      {
        label: 'Aceleracao',
        value: formatNumber(sample.accelerationMetersPerSecondSquared, 'm/s^2'),
      },
      {
        label: 'Perda',
        value: `${compactNumber.format(sample.energyLossPercent)}%`,
      },
      ...energyMetric,
      frameMetric,
    ]
  }

  if (simulationId === 'rolling-without-slipping') {
    return [
      {
        label: 'Posicao',
        value: formatNumber(sample.positionMeters, 'm'),
      },
      {
        label: 'Velocidade',
        value: formatNumber(sample.speedMetersPerSecond, 'm/s'),
      },
      {
        label: 'Vel. angular',
        value: formatNumber(sample.angularVelocityRadiansPerSecond, 'rad/s'),
      },
      {
        label: 'Aderencia',
        value: sample.gripRatio > 1 ? 'escorrega' : 'rolamento puro',
      },
      ...energyMetric,
      frameMetric,
    ]
  }

  if (simulationId === 'torque-levers-center-mass') {
    return [
      {
        label: 'Torque resultante',
        value: formatNumber(sample.netTorqueNewtonMeters, 'N m'),
      },
      {
        label: 'Centro de massa',
        value: formatNumber(sample.centerOfMassMeters, 'm'),
      },
      {
        label: 'Aceleracao angular',
        value: formatNumber(
          sample.angularAccelerationRadiansPerSecondSquared,
          'rad/s^2',
        ),
      },
      ...energyMetric,
      frameMetric,
    ]
  }

  if (simulationId === 'rigid-body-rotation') {
    return [
      { label: 'Angulo', value: formatNumber(sample.angleRadians, 'rad') },
      {
        label: 'Velocidade angular',
        value: formatNumber(sample.angularVelocityRadiansPerSecond, 'rad/s'),
      },
      {
        label: 'Aceleracao angular',
        value: formatNumber(
          sample.angularAccelerationRadiansPerSecondSquared,
          'rad/s^2',
        ),
      },
      {
        label: 'Torque',
        value: formatNumber(sample.netTorqueNewtonMeters, 'N m'),
      },
      {
        label: 'Momento de inercia',
        value: formatNumber(sample.momentOfInertiaKilogramMetersSquared, 'kg m^2'),
      },
      {
        label: 'Centro de massa',
        value: formatNumber(sample.centerOfMassMeters, 'm'),
      },
      ...energyMetric,
      frameMetric,
    ]
  }

  return [
    { label: 'Posicao', value: formatNumber(sample.positionMeters, 'm') },
    { label: 'Deslocamento', value: formatNumber(sample.displacementMeters, 'm') },
    {
      label: 'Velocidade',
      value: formatNumber(sample.velocityMetersPerSecond, 'm/s'),
    },
    { label: 'Rapidez', value: formatNumber(sample.speedMetersPerSecond, 'm/s') },
    {
      label: 'Aceleracao',
      value: formatNumber(sample.accelerationMetersPerSecondSquared, 'm/s^2'),
    },
    ...(simulationId === 'centripetal-force-curve'
      ? [
          {
            label: 'Aderencia',
            value: sample.gripRatio > 1 ? 'saiu da curva' : 'aderiu',
          },
        ]
      : []),
    ...energyMetric,
    frameMetric,
  ]
}

function formatRuntimeParameter(parameter: SimulationParameter) {
  if (parameter.id !== 'durationSeconds') {
    return parameter
  }

  return {
    ...parameter,
    label: 'Horizonte calculado',
    description:
      'Quantidade de segundos pre-calculada pelo motor para samples, graficos e tabela. O contador da interface avanca continuamente; aumentar este horizonte oferece mais amostras por volta visual, e diminuir concentra a leitura em menos segundos.',
  }
}

function PlaybackSpeedControl({
  onChange,
  parameter,
  value,
}: {
  onChange: (value: number) => void
  parameter: SimulationParameter
  value: number
}) {
  const [draftValue, setDraftValue] = useState(value)
  const parameterLabel = parameter.unit
    ? `${parameter.label} (${parameter.unit})`
    : parameter.label

  const applyValue = (nextValue: number) => {
    if (!Number.isFinite(nextValue)) {
      setDraftValue(value)
      return
    }

    const clampedValue = clampToParameterRange(nextValue, parameter)

    setDraftValue(clampedValue)
    onChange(clampedValue)
  }

  const sliderValue = Number.isFinite(draftValue) ? draftValue : value

  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          mb: 0.5,
        }}
      >
        <Typography variant="body2">{parameter.label}</Typography>
        <Tooltip
          arrow
          placement="top"
          title={
            <Box sx={{ maxWidth: 280 }}>
              <Typography sx={{ fontWeight: 700 }} variant="body2">
                {parameterLabel}
              </Typography>
              <Typography sx={{ mt: 0.5 }} variant="body2">
                {parameter.description}
              </Typography>
              <Typography
                color="text.secondary"
                component="p"
                sx={{ mt: 0.75 }}
                variant="caption"
              >
                {formatParameterRange(parameter)}
              </Typography>
            </Box>
          }
        >
          <IconButton
            aria-label={`Ajuda: ${parameter.label}`}
            size="small"
            sx={{
              bgcolor: alpha(themeTokens.teal, 0.12),
              border: `1px solid ${alpha(themeTokens.teal, 0.75)}`,
              color: 'primary.main',
              fontSize: '0.75rem',
              fontWeight: 800,
              height: 22,
              lineHeight: 1,
              width: 22,
              '&:hover': {
                bgcolor: alpha(themeTokens.teal, 0.22),
                borderColor: themeTokens.teal,
              },
            }}
          >
            ?
          </IconButton>
        </Tooltip>
        <Chip label={formatPlaybackRate(value)} size="small" variant="outlined" />
      </Stack>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
      >
        <Slider
          aria-label={parameter.label}
          max={parameter.max}
          min={parameter.min}
          onChange={(_event, nextValue) => {
            applyValue(Array.isArray(nextValue) ? nextValue[0] : nextValue)
          }}
          onChangeCommitted={(_event, nextValue) => {
            applyValue(Array.isArray(nextValue) ? nextValue[0] : nextValue)
          }}
          size="small"
          step={parameter.step}
          sx={{ flex: 1 }}
          value={sliderValue}
        />
        <TextField
          label={parameterLabel}
          onBlur={() => {
            applyValue(draftValue)
          }}
          onChange={(event) => {
            setDraftValue(Number(event.target.value))
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              applyValue(draftValue)
            }
          }}
          size="small"
          slotProps={{
            htmlInput: {
              max: parameter.max,
              min: parameter.min,
              step: parameter.step,
            },
          }}
          sx={{ width: { xs: '100%', sm: 132 } }}
          type="number"
          value={draftValue}
        />
      </Stack>
    </Box>
  )
}

function ParameterControl({
  onChange,
  parameter,
  value,
}: {
  onChange: (value: number) => void
  parameter: SimulationParameter
  value: number
}) {
  const [draftValue, setDraftValue] = useState(value)
  const parameterLabel = parameter.unit
    ? `${parameter.label} (${parameter.unit})`
    : parameter.label

  const commitValue = (nextValue: number) => {
    if (!Number.isFinite(nextValue)) {
      setDraftValue(value)
      return
    }

    const clampedValue = clampToParameterRange(nextValue, parameter)

    setDraftValue(clampedValue)
    onChange(clampedValue)
  }

  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          mb: 0.5,
        }}
      >
        <Typography variant="body2">{parameter.label}</Typography>
        <Tooltip
          arrow
          placement="top"
          title={
            <Box sx={{ maxWidth: 280 }}>
              <Typography sx={{ fontWeight: 700 }} variant="body2">
                {parameterLabel}
              </Typography>
              <Typography sx={{ mt: 0.5 }} variant="body2">
                {parameter.description}
              </Typography>
              <Typography
                color="text.secondary"
                component="p"
                sx={{ mt: 0.75 }}
                variant="caption"
              >
                {formatParameterRange(parameter)}
              </Typography>
            </Box>
          }
        >
          <IconButton
            aria-label={`Ajuda: ${parameter.label}`}
            size="small"
            sx={{
              bgcolor: alpha(themeTokens.teal, 0.12),
              border: `1px solid ${alpha(themeTokens.teal, 0.75)}`,
              color: 'primary.main',
              fontSize: '0.75rem',
              fontWeight: 800,
              height: 22,
              lineHeight: 1,
              width: 22,
              '&:hover': {
                bgcolor: alpha(themeTokens.teal, 0.22),
                borderColor: themeTokens.teal,
              },
            }}
          >
            ?
          </IconButton>
        </Tooltip>
      </Stack>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
      >
        <Slider
          aria-label={parameter.label}
          max={parameter.max}
          min={parameter.min}
          onChange={(_event, nextValue) => {
            setDraftValue(Array.isArray(nextValue) ? nextValue[0] : nextValue)
          }}
          onChangeCommitted={(_event, nextValue) => {
            commitValue(Array.isArray(nextValue) ? nextValue[0] : nextValue)
          }}
          size="small"
          step={parameter.step}
          sx={{ flex: 1 }}
          value={draftValue}
        />
        <TextField
          label={parameterLabel}
          onChange={(event) => {
            setDraftValue(Number(event.target.value))
          }}
          onBlur={() => {
            commitValue(draftValue)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              commitValue(draftValue)
            }
          }}
          size="small"
          slotProps={{
            htmlInput: {
              max: parameter.max,
              min: parameter.min,
              step: parameter.step,
            },
          }}
          sx={{ width: { xs: '100%', sm: 132 } }}
          type="number"
          value={draftValue}
        />
      </Stack>
    </Box>
  )
}

function BooleanParameterControl({
  onChange,
  parameter,
  value,
}: {
  onChange: (value: boolean) => void
  parameter: SimulationParameter
  value: boolean
}) {
  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          mb: 0.5,
        }}
      >
        <Typography variant="body2">{parameter.label}</Typography>
        <Tooltip
          arrow
          placement="top"
          title={
            <Box sx={{ maxWidth: 280 }}>
              <Typography sx={{ fontWeight: 700 }} variant="body2">
                {parameter.label}
              </Typography>
              <Typography sx={{ mt: 0.5 }} variant="body2">
                {parameter.description}
              </Typography>
              <Typography
                color="text.secondary"
                component="p"
                sx={{ mt: 0.75 }}
                variant="caption"
              >
                Controle liga/desliga do modelo declarado.
              </Typography>
            </Box>
          }
        >
          <IconButton
            aria-label={`Ajuda: ${parameter.label}`}
            size="small"
            sx={{
              bgcolor: alpha(themeTokens.teal, 0.12),
              border: `1px solid ${alpha(themeTokens.teal, 0.75)}`,
              color: 'primary.main',
              fontSize: '0.75rem',
              fontWeight: 800,
              height: 22,
              lineHeight: 1,
              width: 22,
              '&:hover': {
                bgcolor: alpha(themeTokens.teal, 0.22),
                borderColor: themeTokens.teal,
              },
            }}
          >
            ?
          </IconButton>
        </Tooltip>
      </Stack>
      <FormControlLabel
        control={
          <Switch
            checked={value}
            onChange={(_event, checked) => {
              onChange(checked)
            }}
            size="small"
            slotProps={{
              input: {
                'aria-label': parameter.label,
              },
            }}
          />
        }
        label={value ? 'Ligado' : 'Desligado'}
        sx={{
          bgcolor: alpha(themeTokens.background, 0.36),
          border: `1px solid ${themeTokens.border}`,
          borderRadius: 1,
          justifyContent: 'space-between',
          m: 0,
          px: 1,
          py: 0.5,
          width: '100%',
        }}
      />
    </Box>
  )
}

function formatParameterRange(parameter: SimulationParameter) {
  if (
    typeof parameter.min !== 'number' ||
    typeof parameter.max !== 'number'
  ) {
    return 'Faixa livre dentro do modelo declarado.'
  }

  const unit = parameter.unit ? ` ${parameter.unit}` : ''
  const step =
    typeof parameter.step === 'number'
      ? `; passo ${compactNumber.format(parameter.step)}${unit}`
      : ''

  return `Faixa: ${compactNumber.format(parameter.min)}${unit} a ${compactNumber.format(
    parameter.max,
  )}${unit}${step}.`
}

function readDefaultRuntimeValues(
  fixture: SimulationFixture,
): Record<string, ParameterValue> {
  return Object.fromEntries(
    fixture.runtimeParameters.map((parameter) => [
      parameter.id,
      parameter.defaultValue,
    ]),
  )
}

function readRuntimeValue(
  values: Record<string, ParameterValue>,
  key: string,
  fallback: number,
) {
  const value = values[key]

  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : fallback
}

function readNumericParameter(
  values: Record<string, ParameterValue>,
  parameter: SimulationParameter,
) {
  const value = values[parameter.id]

  return typeof value === 'number' ? value : Number(parameter.defaultValue)
}

function readBooleanParameter(
  values: Record<string, ParameterValue>,
  parameter: SimulationParameter,
) {
  const value = values[parameter.id]

  return typeof value === 'boolean'
    ? value
    : parameter.defaultValue === true
}

function clampToParameterRange(
  value: number,
  parameter: SimulationParameter,
) {
  const min = parameter.min ?? value
  const max = parameter.max ?? value

  return Math.min(max, Math.max(min, value))
}

function AnimationVectorLegend({
  items,
}: {
  items: readonly AnimationVectorLegendItem[]
}) {
  return (
    <Box
      aria-label="Legenda compacta dos vetores na animacao"
      sx={{
        bgcolor: alpha(themeTokens.background, 0.78),
        border: `1px solid ${alpha(themeTokens.text, 0.16)}`,
        borderRadius: 1,
        display: 'grid',
        gap: 0.5,
        maxWidth: 'calc(100% - 16px)',
        minWidth: { xs: 132, sm: 158 },
        p: 0.75,
        pointerEvents: 'none',
        position: 'absolute',
        right: { xs: 8, sm: 10 },
        top: { xs: 8, sm: 10 },
        zIndex: 1,
      }}
    >
      {items.map((item) => (
        <Stack
          direction="row"
          key={item.id}
          spacing={0.75}
          sx={{
            alignItems: 'center',
            minWidth: 0,
          }}
        >
          <Box
            aria-hidden
            sx={{
              bgcolor: item.color,
              borderRadius: 0.5,
              flex: '0 0 auto',
              height: 2,
              width: 24,
            }}
          />
          <Typography
            sx={{
              fontWeight: 700,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            variant="caption"
          >
            {formatVectorLegendLabel(
              item.label,
              getAnimationVectorLegendUnit(item),
            )}
          </Typography>
        </Stack>
      ))}
    </Box>
  )
}

function VectorLegend({ vectors }: { vectors: PendulumVectorOverlay[] }) {
  const vectorsById = new Map(vectors.map((vector) => [vector.id, vector]))

  return (
    <Box
      aria-label="Legenda dos vetores"
      sx={{
        borderBottom: `1px solid ${themeTokens.border}`,
        display: 'grid',
        gap: 1,
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(3, minmax(0, 1fr))',
        },
        p: 1.5,
        pt: 1,
      }}
    >
      {vectorLegendItems.map((item) => {
        const vector = vectorsById.get(item.id)

        return (
          <Box
            key={item.id}
            sx={{
              bgcolor: alpha(themeTokens.background, 0.7),
              border: `1px solid ${themeTokens.border}`,
              borderRadius: 1,
              minWidth: 0,
              p: 1,
            }}
          >
            <Stack
              direction="row"
              spacing={0.75}
              sx={{ alignItems: 'center', minWidth: 0 }}
            >
              <Box
                aria-hidden
                sx={{
                  bgcolor: item.color,
                  borderRadius: '50%',
                  flex: '0 0 auto',
                  height: 9,
                  width: 9,
                }}
              />
              <Typography
                sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}
                variant="body2"
              >
                {item.label}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ ml: 'auto', overflowWrap: 'anywhere' }}
                variant="body2"
              >
                {vector ? formatNumber(vector.magnitude, vector.unit) : '--'}
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="body2">
              {item.description}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}

function InclinedPlaneVectorLegend({
  vectors,
}: {
  vectors: InclinedPlaneVectorOverlay[]
}) {
  const vectorsById = new Map(vectors.map((vector) => [vector.id, vector]))

  return (
    <Box
      aria-label="Legenda dos vetores"
      sx={{
        borderBottom: `1px solid ${themeTokens.border}`,
        display: 'grid',
        gap: 1,
        gridTemplateColumns: {
          xs: '1fr',
          md: 'repeat(4, minmax(0, 1fr))',
        },
        p: 1.5,
        pt: 1,
      }}
    >
      {inclinedPlaneVectorLegendItems.map((item) => {
        const vector = vectorsById.get(item.id)

        return (
          <Box
            key={item.id}
            sx={{
              bgcolor: alpha(themeTokens.background, 0.7),
              border: `1px solid ${themeTokens.border}`,
              borderRadius: 1,
              minWidth: 0,
              p: 1,
            }}
          >
            <Stack
              direction="row"
              spacing={0.75}
              sx={{ alignItems: 'center', minWidth: 0 }}
            >
              <Box
                aria-hidden
                sx={{
                  bgcolor: item.color,
                  borderRadius: '50%',
                  flex: '0 0 auto',
                  height: 9,
                  width: 9,
                }}
              />
              <Typography
                sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}
                variant="body2"
              >
                {item.label}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ ml: 'auto', overflowWrap: 'anywhere' }}
                variant="body2"
              >
                {vector ? formatNumber(vector.magnitude, vector.unit) : '--'}
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="body2">
              {item.description}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}

function KinematicsVectorLegend({
  items,
  vectors,
}: {
  items: readonly KinematicsVectorLegendItem[]
  vectors: KinematicsVectorOverlay[]
}) {
  const vectorsById = new Map(vectors.map((vector) => [vector.id, vector]))

  return (
    <Box
      aria-label="Legenda dos vetores"
      sx={{
        borderBottom: `1px solid ${themeTokens.border}`,
        display: 'grid',
        gap: 1,
        gridTemplateColumns: {
          xs: '1fr',
          md: `repeat(${items.length}, minmax(0, 1fr))`,
        },
        p: 1.5,
        pt: 1,
      }}
    >
      {items.map((item) => {
        const vector = vectorsById.get(item.id)

        return (
          <Box
            key={item.id}
            sx={{
              bgcolor: alpha(themeTokens.background, 0.7),
              border: `1px solid ${themeTokens.border}`,
              borderRadius: 1,
              minWidth: 0,
              p: 1,
            }}
          >
            <Stack
              direction="row"
              spacing={0.75}
              sx={{ alignItems: 'center', minWidth: 0 }}
            >
              <Box
                aria-hidden
                sx={{
                  bgcolor: item.color,
                  borderRadius: '50%',
                  flex: '0 0 auto',
                  height: 9,
                  width: 9,
                }}
              />
              <Typography
                sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}
                variant="body2"
              >
                {item.label}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ ml: 'auto', overflowWrap: 'anywhere' }}
                variant="body2"
              >
                {vector ? formatNumber(vector.magnitude, vector.unit) : '--'}
              </Typography>
            </Stack>
            <Typography color="text.secondary" variant="body2">
              {item.description}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}

function WorkEnergyTrackHud({ sample }: { sample: KinematicsSample }) {
  const terms = [
    {
      color: themeTokens.vector,
      label: 'K',
      value: sample.kineticEnergyJoules,
    },
    {
      color: themeTokens.warning,
      label: 'Ug',
      value: sample.potentialEnergyJoules,
    },
    {
      color: themeTokens.danger,
      label: 'Eperd',
      value: sample.thermalEnergyJoules,
    },
  ]
  const maxMagnitude = Math.max(
    1,
    Math.abs(sample.totalEnergyJoules),
    ...terms.map((term) => Math.abs(term.value)),
  )

  return (
    <Box
      aria-label="Balanco energetico do trilho"
      sx={{
        bgcolor: alpha(themeTokens.background, 0.82),
        border: `1px solid ${alpha(themeTokens.text, 0.16)}`,
        borderRadius: 1,
        bottom: { xs: 8, sm: 10 },
        display: 'grid',
        gap: 0.65,
        left: { xs: 8, sm: 10 },
        maxWidth: { xs: 'calc(100% - 16px)', sm: 268 },
        minWidth: { xs: 176, sm: 236 },
        p: 1,
        pointerEvents: 'none',
        position: 'absolute',
        zIndex: 1,
      }}
    >
      {terms.map((term) => {
        const barWidth = `${Math.max(
          4,
          (Math.abs(term.value) / maxMagnitude) * 100,
        )}%`

        return (
          <Box
            key={term.label}
            sx={{
              columnGap: 0.75,
              display: 'grid',
              gridTemplateColumns: '42px minmax(0, 1fr) 72px',
              minWidth: 0,
              rowGap: 0.25,
            }}
          >
            <Typography
              sx={{ color: term.color, fontWeight: 800 }}
              variant="caption"
            >
              {term.label}
            </Typography>
            <Box
              sx={{
                alignSelf: 'center',
                bgcolor: alpha(themeTokens.text, 0.1),
                borderRadius: 0.5,
                height: 5,
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  bgcolor: term.color,
                  height: '100%',
                  opacity: 0.88,
                  width: barWidth,
                }}
              />
            </Box>
            <Typography
              color="text.secondary"
              sx={{ textAlign: 'right' }}
              variant="caption"
            >
              {formatNumber(term.value, 'J')}
            </Typography>
          </Box>
        )
      })}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          borderTop: `1px solid ${alpha(themeTokens.text, 0.12)}`,
          justifyContent: 'space-between',
          minWidth: 0,
          pt: 0.6,
        }}
      >
        <Typography color="text.secondary" variant="caption">
          E total
        </Typography>
        <Typography sx={{ fontWeight: 800 }} variant="caption">
          {formatNumber(sample.totalEnergyJoules, 'J')}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          minWidth: 0,
        }}
      >
        <Typography color="text.secondary" variant="caption">
          perda
        </Typography>
        <Typography sx={{ fontWeight: 800 }} variant="caption">
          {compactNumber.format(sample.energyLossPercent)}%
        </Typography>
      </Stack>
    </Box>
  )
}

function renderEmptyTableCells() {
  return sampleTableColumnIds.map((columnId) => (
    <TableCell key={columnId} sx={{ color: 'text.disabled' }}>
      --
    </TableCell>
  ))
}

function renderEmptyInclinedPlaneTableCells() {
  return inclinedPlaneSampleTableColumnIds.map((columnId) => (
    <TableCell key={columnId} sx={{ color: 'text.disabled' }}>
      --
    </TableCell>
  ))
}

function renderEmptyKinematicsTableCells() {
  return kinematicsSampleTableColumnIds.map((columnId) => (
    <TableCell key={columnId} sx={{ color: 'text.disabled' }}>
      --
    </TableCell>
  ))
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Box
      sx={{
        bgcolor: alpha(themeTokens.background, 0.7),
        border: `1px solid ${themeTokens.border}`,
        borderRadius: 1,
        minWidth: 0,
        p: 1,
      }}
    >
      <Typography color="text.secondary" variant="body2">
        {label}
      </Typography>
      <Typography
        sx={{ overflowWrap: 'anywhere' }}
        variant="body2"
      >
        {value}
      </Typography>
    </Box>
  )
}

function ReadoutToggleButton({
  expanded,
  onToggle,
}: {
  expanded: boolean
  onToggle: () => void
}) {
  const label = expanded ? 'Fechar leituras e vetores' : 'Abrir leituras e vetores'

  return (
    <Tooltip title={label}>
      <IconButton
        aria-expanded={expanded}
        aria-label={label}
        color={expanded ? 'primary' : 'default'}
        onClick={onToggle}
        size="small"
      >
        {expanded ? (
          <ChevronDown aria-hidden size={17} />
        ) : (
          <ChevronRight aria-hidden size={17} />
        )}
      </IconButton>
    </Tooltip>
  )
}

function CameraProjectionSwitch({
  onChange,
  value,
}: {
  onChange: (mode: CameraProjectionMode) => void
  value: CameraProjectionMode
}) {
  const isOrthographic = value === 'orthographic'
  const modes = [
    {
      ariaLabel: 'Camera em perspectiva',
      label: 'Persp.',
      value: 'perspective',
    },
    {
      ariaLabel: 'Camera ortogonal',
      label: 'Orto',
      value: 'orthographic',
    },
  ] satisfies Array<{
    ariaLabel: string
    label: string
    value: CameraProjectionMode
  }>

  return (
    <Tooltip
      title={
        isOrthographic
          ? 'Ortogonal: escala constante, sem fuga visual'
          : 'Perspectiva: profundidade com fuga visual'
      }
    >
      <Box
        aria-label="Modo da camera da viewport"
        role="group"
        sx={{
          bgcolor: alpha(themeTokens.background, 0.82),
          border: `1px solid ${alpha(themeTokens.text, 0.16)}`,
          borderRadius: 999,
          display: 'flex',
          flex: '0 0 auto',
          height: 30,
          overflow: 'hidden',
          p: '2px',
          position: 'relative',
          width: { xs: 132, sm: 148 },
        }}
      >
        <Box
          aria-hidden
          sx={{
            bgcolor: alpha(themeTokens.teal, 0.22),
            border: `1px solid ${alpha(themeTokens.teal, 0.68)}`,
            borderRadius: 999,
            bottom: 2,
            boxShadow: `0 0 0 1px ${alpha(themeTokens.teal, 0.1)}`,
            left: 2,
            position: 'absolute',
            top: 2,
            transform: isOrthographic ? 'translateX(100%)' : 'translateX(0)',
            transition: 'transform 160ms ease',
            width: 'calc(50% - 2px)',
            zIndex: 0,
          }}
        />
        {modes.map((mode) => {
          const active = mode.value === value

          return (
            <ButtonBase
              aria-label={mode.ariaLabel}
              aria-pressed={active}
              key={mode.value}
              onClick={() => {
                onChange(mode.value)
              }}
              sx={{
                borderRadius: 999,
                color: active ? 'primary.main' : 'text.secondary',
                flex: '1 1 0',
                fontSize: '0.72rem',
                fontWeight: 800,
                minWidth: 0,
                position: 'relative',
                textTransform: 'uppercase',
                zIndex: 1,
                '&:focus-visible': {
                  outline: `2px solid ${themeTokens.teal}`,
                  outlineOffset: 1,
                },
              }}
              type="button"
            >
              {mode.label}
            </ButtonBase>
          )
        })}
      </Box>
    </Tooltip>
  )
}

function groupSimulationsBySubarea(simulations: SimulationDefinition[]) {
  const subareas = new Map<string, SimulationDefinition[]>()

  simulations.forEach((simulation) => {
    const subarea = getSimulationSubarea(simulation)
    const currentSimulations = subareas.get(subarea) ?? []

    currentSimulations.push(simulation)
    subareas.set(subarea, currentSimulations)
  })

  return Array.from(subareas, ([label, groupedSimulations]) => ({
    label,
    simulations: groupedSimulations,
  })) satisfies SidebarSubarea[]
}

function getSimulationSubarea(simulation: SimulationDefinition) {
  return simulation.topicPath[1] ?? 'Geral'
}

function getSubareaKey(areaId: string, subarea: string) {
  return `${areaId}:${subarea}`
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function getStatusLabel(status: string) {
  if (status === 'ready') {
    return 'pronto'
  }

  if (status === 'analysis') {
    return 'analise'
  }

  return 'planejado'
}

function getStatusChipColor(status: SimulationStatus) {
  if (status === 'ready') {
    return 'primary'
  }

  if (status === 'analysis') {
    return 'info'
  }

  return 'default'
}

function isRunnableSimulation(simulation: SimulationDefinition) {
  return simulation.status === 'analysis' || simulation.status === 'ready'
}

function shouldStartExpanded(simulation: SimulationDefinition) {
  return simulation.status === 'analysis'
}

function getModelKindLabel(modelKind: SimulationDefinition['modelKind']) {
  if (modelKind === 'field-sampling') {
    return 'campo'
  }

  if (modelKind === 'particle-demo') {
    return 'particulas'
  }

  if (modelKind === 'analytic') {
    return 'analitico'
  }

  if (modelKind === 'numerical') {
    return 'numerico'
  }

  return 'hibrido'
}

function radiansToDegrees(value: number) {
  return (value * 180) / Math.PI
}

function formatDegrees(value: number) {
  return `${compactNumber.format(value)} deg`
}

function formatEnergy(value: number) {
  return `${compactEnergy.format(value)} J`
}

function formatFps(value: number) {
  return value > 0 ? `${value} FPS` : 'medindo FPS'
}

function getAnimationVectorLegendUnit(item: AnimationVectorLegendItem) {
  if (item.id === 'displacement') {
    return 'm'
  }

  if (item.id === 'velocity' || item.id === 'secondaryVelocity') {
    return 'm/s'
  }

  if (
    item.id === 'acceleration' ||
    item.id === 'gravity' ||
    (item.id === 'centripetal' && item.label.includes('Aceleracao'))
  ) {
    return 'm/s^2'
  }

  if (item.id === 'angularVelocity') {
    return 'rad/s'
  }

  if (item.id === 'angularAcceleration') {
    return 'rad/s^2'
  }

  if (item.id === 'angularMomentum') {
    return 'kg m^2/s'
  }

  if (item.id === 'momentum') {
    return 'kg m/s'
  }

  if (item.id === 'impulse') {
    return 'N s'
  }

  if (item.id === 'torque') {
    return 'N m'
  }

  return 'N'
}

function formatVectorLegendLabel(label: string, unit?: string) {
  return unit ? `${label} (${unit})` : label
}

function readEnergyRatio(samples: Array<{ totalEnergyJoules: number }>) {
  const initialEnergy = samples[0]?.totalEnergyJoules ?? 0
  const finalEnergy = samples.at(-1)?.totalEnergyJoules ?? 0

  return initialEnergy > 0 ? (finalEnergy / initialEnergy) * 100 : 0
}

function formatNumber(value: number, unit = '') {
  const suffix = unit ? ` ${unit}` : ''

  return `${compactNumber.format(value)}${suffix}`
}

function formatPlaybackRate(value: number) {
  return `${compactNumber.format(normalizePlaybackRate(value))}x`
}
