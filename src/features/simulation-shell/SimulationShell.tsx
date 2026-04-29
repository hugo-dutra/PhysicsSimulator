import {
  useCallback,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react'
import {
  Box,
  Button,
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
  activeSimulation,
  pendulumFixture,
  simulationCatalog,
} from '../../simulation-registry/catalog'
import type {
  ParameterValue,
  SimulationDefinition,
  SimulationParameter,
} from '../../simulation-registry/types'
import {
  computePendulumTimeline,
  getPendulumVectorOverlays,
  toPendulumParameters,
  type PendulumParameters,
  type PendulumSample,
  type PendulumVectorOverlay,
} from '../../lib/physics/pendulum'
import { themeTokens } from '../../theme/appTheme'
import { ChevronSection } from './ChevronSection'
import { FormulaGuide } from './FormulaGuide'
import { LiveLineChart } from './LiveLineChart'
import { ChartFocusButton, PendulumCharts } from './PendulumCharts'
import {
  buildPendulumChartConfigs,
  preparePendulumChartSamples,
  type PendulumChartId,
} from './pendulumChartConfigs'
import { PendulumScene, type PendulumFrameStats } from './PendulumScene'
import { getMovingWindowRange, selectRecentSamples } from './sampleWindow'
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

type MaximizedPanelId = 'charts' | 'formulas' | 'simulation' | 'table' | 'theory'

const customPresetId = 'custom'
const playbackRate = 0.6
const sampleTableRowCount = 9
const maximizedSampleTableRowCount = 18
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
const initialFrameStats: PendulumFrameStats = {
  fps: 0,
  frameTimeMs: 0,
}

export function SimulationShell() {
  const [parameterValues, setParameterValues] = useState<
    Record<string, ParameterValue>
  >(() => ({ ...pendulumFixture.defaultParameters }))
  const [runtimeValues, setRuntimeValues] = useState<
    Record<string, ParameterValue>
  >(() => readDefaultRuntimeValues())
  const [selectedPresetId, setSelectedPresetId] = useState(customPresetId)
  const [isPlaying, setIsPlaying] = useState(true)
  const [playbackResetVersion, setPlaybackResetVersion] = useState(0)
  const [overlays, setOverlays] = useState<OverlayState>({
    energy: true,
    trace: true,
    vectors: true,
  })
  const [outputPanels, setOutputPanels] = useState<OutputPanelState>({
    charts: false,
    formulas: false,
    table: false,
    theory: false,
  })
  const [maximizedPanel, setMaximizedPanel] =
    useState<MaximizedPanelId | null>(null)
  const parameters = useMemo(
    () => toPendulumParameters(parameterValues),
    [parameterValues],
  )
  const durationSeconds = readRuntimeValue(
    runtimeValues,
    'durationSeconds',
    pendulumFixture.durationSeconds,
  )
  const chartWindowSeconds = readRuntimeValue(
    runtimeValues,
    'chartWindowSeconds',
    pendulumFixture.chartWindowSeconds,
  )
  const effectiveChartWindowSeconds = Math.min(
    chartWindowSeconds,
    durationSeconds,
  )
  const timeline = useMemo(
    () =>
      computePendulumTimeline({
        parameters,
        durationSeconds,
        sampleRateHz: pendulumFixture.sampleRateHz,
      }),
    [durationSeconds, parameters],
  )

  const initialEnergy = timeline.samples[0]?.totalEnergyJoules ?? 0
  const finalEnergy = timeline.samples.at(-1)?.totalEnergyJoules ?? 0
  const energyRatio =
    initialEnergy > 0
      ? (finalEnergy / initialEnergy) * 100
      : 0

  const handlePresetChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextPresetId = event.target.value
    const preset = pendulumFixture.presets.find(
      (item) => item.id === nextPresetId,
    )

    setSelectedPresetId(nextPresetId)
    setPlaybackResetVersion((current) => current + 1)

    if (!preset) {
      return
    }

    setParameterValues({
      ...pendulumFixture.defaultParameters,
      ...preset.parameters,
    })
  }

  const handleParameterChange = (
    parameter: SimulationParameter,
    nextValue: number,
  ) => {
    if (!Number.isFinite(nextValue)) {
      return
    }

    const clampedValue = clampToParameterRange(nextValue, parameter)

    if (parameterValues[parameter.id] === clampedValue) {
      return
    }

    setSelectedPresetId(customPresetId)
    setPlaybackResetVersion((current) => current + 1)
    setParameterValues((currentValues) => ({
      ...currentValues,
      [parameter.id]: clampedValue,
    }))
  }

  const handleRuntimeParameterChange = (
    parameter: SimulationParameter,
    nextValue: number,
  ) => {
    if (!Number.isFinite(nextValue)) {
      return
    }

    const clampedValue = clampToParameterRange(nextValue, parameter)

    if (runtimeValues[parameter.id] === clampedValue) {
      return
    }

    setRuntimeValues((currentValues) => ({
      ...currentValues,
      [parameter.id]: clampedValue,
    }))

    if (parameter.id === 'durationSeconds') {
      setPlaybackResetVersion((current) => current + 1)
    }
  }

  const handleReset = () => {
    setPlaybackResetVersion((current) => current + 1)
    setIsPlaying(false)
  }

  const handlePlaybackToggle = () => {
    setIsPlaying((current) => !current)
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

        <SimulationSidebar />
      </Box>

      <Box sx={{ minWidth: 0 }}>
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
              {activeSimulation.topicPath.join(' > ')}
            </Typography>
            <Typography variant="h1">{activeSimulation.title}</Typography>
          </Box>
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Button
              aria-label={
                isPlaying ? 'Pausar animacao' : 'Reproduzir animacao'
              }
              color="primary"
              onClick={handlePlaybackToggle}
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
            <Chip label="custom-numerical" size="small" variant="outlined" />
            <Chip color="primary" label="available" size="small" />
          </Stack>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              xl: isPanelMaximized ? '1fr' : 'minmax(0, 1fr) 340px',
            },
            p: isPanelMaximized ? { xs: 1, md: 1.5 } : { xs: 2, md: 3 },
          }}
        >
          <Stack spacing={2} sx={{ minWidth: 0 }}>
            <PendulumRuntime
              chartWindowSeconds={effectiveChartWindowSeconds}
              durationSeconds={durationSeconds}
              isPlaying={isPlaying}
              maximizedPanel={maximizedPanel}
              onMaximizedPanelToggle={handleMaximizedPanelToggle}
              onPlaybackToggle={handlePlaybackToggle}
              onOutputPanelToggle={handleOutputPanelToggle}
              overlays={overlays}
              outputPanels={outputPanels}
              parameters={parameters}
              resetVersion={playbackResetVersion}
              samples={timeline.samples}
            />

            {shouldShowFormulas || shouldShowTheory ? (
              <>
                {shouldShowFormulas ? (
                  <FormulaGuide
                    expanded={formulasExpanded}
                    formulas={pendulumFixture.formulas}
                    maximized={isFormulasMaximized}
                    onMaximizeToggle={() => {
                      handleMaximizedPanelToggle('formulas')
                    }}
                    onToggle={() => {
                      handleOutputPanelToggle('formulas')
                    }}
                    parameters={pendulumFixture.parameters}
                  />
                ) : null}

                {shouldShowTheory ? (
                  <TheoryAppendix
                    expanded={theoryExpanded}
                    limits={pendulumFixture.limits}
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

          {isPanelMaximized ? null : (
            <Box
              component="section"
              sx={{
                border: `1px solid ${themeTokens.border}`,
                borderRadius: 1,
                bgcolor: alpha(themeTokens.panel, 0.55),
                minWidth: 0,
                p: 1.5,
              }}
            >
              <Stack spacing={2}>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="h2">Controles</Typography>
                  <Typography color="text.secondary" variant="body2">
                    ciclo {formatNumber(durationSeconds, 's')} | janela{' '}
                    {formatNumber(effectiveChartWindowSeconds, 's')}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={0.75}>
                  <Chip
                    color={isPlaying ? 'primary' : 'default'}
                    label={isPlaying ? 'rodando' : 'pausado'}
                    size="small"
                    variant={isPlaying ? 'filled' : 'outlined'}
                  />
                  <Tooltip title={isPlaying ? 'Pausar' : 'Reproduzir'}>
                    <IconButton
                      aria-label="Alternar reproducao da simulacao"
                      color="primary"
                      onClick={handlePlaybackToggle}
                      size="small"
                    >
                      {isPlaying ? (
                        <Pause aria-hidden size={18} />
                      ) : (
                        <Play aria-hidden size={18} />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Resetar">
                    <IconButton
                      aria-label="Resetar simulacao"
                      onClick={handleReset}
                      size="small"
                    >
                      <RotateCcw aria-hidden size={18} />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              <TextField
                fullWidth
                label="Preset"
                onChange={handlePresetChange}
                select
                size="small"
                value={selectedPresetId}
              >
                <MenuItem value={customPresetId}>Personalizado</MenuItem>
                {pendulumFixture.presets.map((preset) => (
                  <MenuItem key={preset.id} value={preset.id}>
                    {preset.label}
                  </MenuItem>
                ))}
              </TextField>

              <Box>
                <Typography sx={{ mb: 0.75 }} variant="h2">
                  Tempo e janela
                </Typography>
                <Stack spacing={1.5}>
                  {pendulumFixture.runtimeParameters.map((parameter) => {
                    const value = readNumericParameter(runtimeValues, parameter)

                    return (
                      <ParameterControl
                        key={`${parameter.id}:${value}`}
                        onChange={(nextValue) => {
                          handleRuntimeParameterChange(parameter, nextValue)
                        }}
                        parameter={parameter}
                        value={value}
                      />
                    )
                  })}
                </Stack>
              </Box>

              <Stack spacing={1.5}>
                {pendulumFixture.parameters.map((parameter) => {
                  const value = readNumericParameter(parameterValues, parameter)

                  return (
                    <ParameterControl
                      key={`${parameter.id}:${value}`}
                      onChange={(nextValue) => {
                        handleParameterChange(parameter, nextValue)
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
                        onChange={handleOverlayChange('vectors')}
                        size="small"
                      />
                    }
                    label="Vetores"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={overlays.trace}
                        onChange={handleOverlayChange('trace')}
                        size="small"
                      />
                    }
                    label="Trilha"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={overlays.energy}
                        onChange={handleOverlayChange('energy')}
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
                  <Metric
                    label="samples"
                    value={String(timeline.samples.length)}
                  />
                  <Metric
                    label="playback"
                    value={`${compactNumber.format(playbackRate)}x`}
                  />
                  <Metric
                    label="sample rate"
                    value={`${pendulumFixture.sampleRateHz} Hz`}
                  />
                  <Metric
                    label="janela"
                    value={formatNumber(effectiveChartWindowSeconds, 's')}
                  />
                  <Metric label="render" value="Three.js rAF" />
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
                  <Metric
                    label="avisos"
                    value={String(timeline.warnings.length)}
                  />
                </Stack>
              </Box>
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

type SidebarSubarea = {
  label: string
  simulations: SimulationDefinition[]
}

function SimulationSidebar() {
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
          area.simulations.some((simulation) => isActiveSimulation(simulation)),
        ]),
      ),
  )
  const [expandedSubareas, setExpandedSubareas] = useState<
    Record<string, boolean>
  >(() => {
    const entries = simulationCatalog.areas.flatMap((area) =>
      groupSimulationsBySubarea(area.simulations).map((subarea) => [
        getSubareaKey(area.id, subarea.label),
        subarea.simulations.some((simulation) => isActiveSimulation(simulation)),
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
                                key={simulation.id}
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
  simulation,
}: {
  simulation: SimulationDefinition
}) {
  const isActive = isActiveSimulation(simulation)
  const isAvailable = simulation.status === 'available'
  const commonSx = {
    bgcolor: isActive
      ? alpha(themeTokens.teal, 0.12)
      : alpha(themeTokens.panel, 0.42),
    border: `1px solid ${isActive ? themeTokens.teal : themeTokens.border}`,
    borderRadius: 1,
    color: isAvailable ? 'text.primary' : 'text.secondary',
    display: 'block',
    minWidth: 0,
    p: 0.875,
    textAlign: 'left',
    width: '100%',
  }

  const content = (
    <Stack spacing={0.75}>
      <Typography
        sx={{ fontWeight: isActive ? 750 : 600, overflowWrap: 'anywhere' }}
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
          color={isAvailable ? 'primary' : 'default'}
          label={getStatusLabel(simulation.status)}
          size="small"
          variant={isAvailable ? 'filled' : 'outlined'}
        />
        <Typography color="text.secondary" variant="body2">
          {getModelKindLabel(simulation.modelKind)}
        </Typography>
      </Stack>
    </Stack>
  )

  if (isAvailable) {
    return (
      <Box
        aria-current={isActive ? 'page' : undefined}
        component="button"
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
  chartWindowSeconds,
  durationSeconds,
  isPlaying,
  maximizedPanel,
  onMaximizedPanelToggle,
  onOutputPanelToggle,
  onPlaybackToggle,
  overlays,
  outputPanels,
  parameters,
  resetVersion,
  samples,
}: {
  chartWindowSeconds: number
  durationSeconds: number
  isPlaying: boolean
  maximizedPanel: MaximizedPanelId | null
  onMaximizedPanelToggle: (panelId: MaximizedPanelId) => void
  onOutputPanelToggle: (panelId: keyof OutputPanelState) => void
  onPlaybackToggle: () => void
  overlays: OverlayState
  outputPanels: OutputPanelState
  parameters: PendulumParameters
  resetVersion: number
  samples: PendulumSample[]
}) {
  const firstSample = useMemo(() => readFirstSample(samples), [samples])
  const [liveSample, setLiveSample] = useState<PendulumSample>(firstSample)
  const [frameStats, setFrameStats] =
    useState<PendulumFrameStats>(initialFrameStats)
  const [focusedChartId, setFocusedChartId] =
    useState<PendulumChartId | null>(null)

  const handleSampleChange = useCallback(
    (sample: PendulumSample, stats: PendulumFrameStats) => {
      setLiveSample(sample)
      setFrameStats(stats)
    },
    [],
  )
  const handleFocusedChartToggle = useCallback((chartId: PendulumChartId) => {
    setFocusedChartId((currentChartId) =>
      currentChartId === chartId ? null : chartId,
    )
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
  const currentSampleIndex = getSampleIndexForTime(
    samples,
    durationSeconds,
    liveSample.timeSeconds,
  )
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

      return selectRecentSamples(
        samples,
        currentSampleIndex,
        chartWindowSeconds,
      )
    },
    [chartWindowSeconds, currentSampleIndex, needsSampleWindow, samples],
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
      overlays.vectors
        ? getPendulumVectorOverlays(liveSample, parameters)
        : [],
    [liveSample, overlays.vectors, parameters],
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

    return selectStableTableRows(visibleWindowSamples, tableRowCount)
  }, [tableExpanded, tableRowCount, visibleWindowSamples])
  const angleDegrees = radiansToDegrees(liveSample.angleRadians)

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
            minHeight: 322,
            overflow: 'hidden',
            position: 'relative',
          },
          isSimulationMaximized
            ? {
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
            gap: 1,
            justifyContent: 'space-between',
            px: 1.5,
            py: 1,
          }}
        >
          <Typography variant="body2">Viewport Three.js</Typography>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            <Chip
              label={formatFps(frameStats.fps)}
              size="small"
              variant="outlined"
            />
            <Typography color="text.secondary" variant="body2">
              t = {formatNumber(liveSample.timeSeconds, 's')}
            </Typography>
            <Button
              aria-label={
                isPlaying
                  ? 'Pausar simulacao no viewport'
                  : 'Reproduzir simulacao no viewport'
              }
              color="primary"
              onClick={onPlaybackToggle}
              size="small"
              startIcon={
                isPlaying ? (
                  <Pause aria-hidden size={16} />
                ) : (
                  <Play aria-hidden size={16} />
                )
              }
              variant="outlined"
            >
              {isPlaying ? 'Pausar' : 'Reproduzir'}
            </Button>
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
          <Metric label="Angulo do pendulo" value={formatDegrees(angleDegrees)} />
          <Metric
            label="Velocidade angular"
            value={formatNumber(
              liveSample.angularVelocityRadiansPerSecond,
              'rad/s',
            )}
          />
          <Metric
            label="Velocidade linear"
            value={formatNumber(liveSample.linearVelocityMetersPerSecond, 'm/s')}
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
        <Box
          sx={{
            display: 'grid',
            gap: focusedChart ? 1.5 : 0,
            gridTemplateColumns: {
              xs: '1fr',
              lg: focusedChart
                ? 'minmax(0, 2fr) minmax(280px, 1fr)'
                : '1fr',
            },
            p: focusedChart ? 1.5 : 0,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <PendulumScene
              durationSeconds={durationSeconds}
              isPlaying={isPlaying}
              maximized={isSimulationMaximized}
              onSampleChange={handleSampleChange}
              parameters={parameters}
              playbackRate={playbackRate}
              resetVersion={resetVersion}
              samples={samples}
              showTrace={overlays.trace}
              showVectors={overlays.vectors}
            />
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
              ? `${samples.length} amostras em ${formatNumber(
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
          label={
            parameter.unit
              ? `${parameter.label} (${parameter.unit})`
              : parameter.label
          }
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

function readDefaultRuntimeValues(): Record<string, ParameterValue> {
  return Object.fromEntries(
    pendulumFixture.runtimeParameters.map((parameter) => [
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

function clampToParameterRange(
  value: number,
  parameter: SimulationParameter,
) {
  const min = parameter.min ?? value
  const max = parameter.max ?? value

  return Math.min(max, Math.max(min, value))
}

function readFirstSample(samples: PendulumSample[]) {
  const sample = samples[0]

  if (!sample) {
    throw new Error('Pendulum timeline must contain at least one sample.')
  }

  return sample
}

function getSampleIndexForTime(
  samples: PendulumSample[],
  durationSeconds: number,
  timeSeconds: number,
) {
  if (samples.length <= 1 || durationSeconds <= 0) {
    return 0
  }

  const progress = Math.min(1, Math.max(0, timeSeconds / durationSeconds))

  return Math.min(
    samples.length - 1,
    Math.floor(progress * (samples.length - 1)),
  )
}

function appendLiveSample(samples: PendulumSample[], liveSample: PendulumSample) {
  const lastSample = samples.at(-1)

  if (!lastSample) {
    return [liveSample]
  }

  if (liveSample.timeSeconds <= lastSample.timeSeconds + 0.0001) {
    return samples
  }

  return [...samples, liveSample]
}

function selectStableTableRows(samples: PendulumSample[], rowCount: number) {
  const rows: Array<PendulumSample | null> = Array.from(
    { length: rowCount },
    () => null,
  )

  if (samples.length === 0) {
    return rows
  }

  if (samples.length <= rowCount) {
    samples.forEach((sample, index) => {
      rows[index] = sample
    })

    return rows
  }

  const lastIndex = samples.length - 1
  const lastRowIndex = Math.max(1, rowCount - 1)

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const sampleIndex = Math.round((rowIndex / lastRowIndex) * lastIndex)
    rows[rowIndex] = samples[sampleIndex]
  }

  return rows
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

function renderEmptyTableCells() {
  return sampleTableColumnIds.map((columnId) => (
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

function isActiveSimulation(simulation: SimulationDefinition) {
  return simulation.id === activeSimulation.id
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
  if (status === 'available') {
    return 'pronto'
  }

  if (status === 'scaffolded') {
    return 'base'
  }

  return 'planejado'
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

function formatNumber(value: number, unit = '') {
  const suffix = unit ? ` ${unit}` : ''

  return `${compactNumber.format(value)}${suffix}`
}
