import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import {
  Box,
  Button,
  Chip,
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
import { Pause, Play, RotateCcw } from 'lucide-react'
import {
  activeSimulation,
  pendulumFixture,
  simulationCatalog,
} from '../../simulation-registry/catalog'
import type {
  ParameterValue,
  SimulationParameter,
} from '../../simulation-registry/types'
import {
  computePendulumTimeline,
  getPendulumVectorOverlays,
  toPendulumParameters,
  type PendulumSample,
} from '../../lib/physics/pendulum'
import { themeTokens } from '../../theme/appTheme'
import { FormulaGuide } from './FormulaGuide'
import { PendulumCharts } from './PendulumCharts'
import { PendulumScene } from './PendulumScene'
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

type SampleOutputState = {
  charts: boolean
  table: boolean
}

const customPresetId = 'custom'
const chartUpdateStride = 8
const playbackRate = 0.6
const uiFrameIntervalMs = 1000 / 24

export function SimulationShell() {
  const [parameterValues, setParameterValues] = useState<
    Record<string, ParameterValue>
  >(() => ({ ...pendulumFixture.defaultParameters }))
  const [selectedPresetId, setSelectedPresetId] = useState(customPresetId)
  const [isPlaying, setIsPlaying] = useState(true)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [overlays, setOverlays] = useState<OverlayState>({
    energy: true,
    trace: true,
    vectors: true,
  })
  const [sampleOutputs, setSampleOutputs] = useState<SampleOutputState>({
    charts: true,
    table: true,
  })
  const elapsedSecondsRef = useRef(0)
  const frameIdRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number | null>(null)
  const lastUiFrameTimeRef = useRef(0)
  const parameters = useMemo(
    () => toPendulumParameters(parameterValues),
    [parameterValues],
  )
  const timeline = useMemo(
    () =>
      computePendulumTimeline({
        parameters,
        durationSeconds: pendulumFixture.durationSeconds,
        sampleRateHz: pendulumFixture.sampleRateHz,
      }),
    [parameters],
  )
  const durationSeconds = pendulumFixture.durationSeconds

  useEffect(() => {
    if (!isPlaying) {
      lastFrameTimeRef.current = null
      return undefined
    }

    const tick = (timestamp: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp
      }

      const deltaSeconds = Math.max(
        0,
        (timestamp - lastFrameTimeRef.current) / 1000,
      )
      const nextElapsedSeconds =
        elapsedSecondsRef.current + deltaSeconds * playbackRate

      lastFrameTimeRef.current = timestamp
      elapsedSecondsRef.current =
        nextElapsedSeconds >= durationSeconds
          ? nextElapsedSeconds % durationSeconds
          : nextElapsedSeconds

      if (timestamp - lastUiFrameTimeRef.current >= uiFrameIntervalMs) {
        lastUiFrameTimeRef.current = timestamp
        setElapsedSeconds(elapsedSecondsRef.current)
      }

      frameIdRef.current = requestAnimationFrameSafe(tick)
    }

    frameIdRef.current = requestAnimationFrameSafe(tick)

    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrameSafe(frameIdRef.current)
        frameIdRef.current = null
      }

      lastFrameTimeRef.current = null
    }
  }, [durationSeconds, isPlaying])

  const currentSampleIndex = Math.min(
    Math.round(pendulumFixture.sampleRateHz * elapsedSeconds),
    timeline.samples.length - 1,
  )

  const progressiveSampleIndex =
    currentSampleIndex === timeline.samples.length - 1
      ? currentSampleIndex
      : Math.floor(currentSampleIndex / chartUpdateStride) * chartUpdateStride

  const currentSample = timeline.samples[currentSampleIndex]
  const vectors = useMemo(
    () => getPendulumVectorOverlays(currentSample, parameters),
    [currentSample, parameters],
  )
  const traceSamples = useMemo(
    () =>
      overlays.trace
        ? timeline.samples.slice(0, progressiveSampleIndex + 1)
        : [],
    [overlays.trace, progressiveSampleIndex, timeline.samples],
  )
  const chartSamples = useMemo(
    () =>
      sampleOutputs.charts
        ? timeline.samples.slice(0, progressiveSampleIndex + 1)
        : [],
    [progressiveSampleIndex, sampleOutputs.charts, timeline.samples],
  )
  const tableSamples = useMemo(() => {
    if (!sampleOutputs.table) {
      return []
    }

    const visibleSampleCount = progressiveSampleIndex + 1
    const stride = Math.max(1, Math.floor(visibleSampleCount / 8))
    const samples: PendulumSample[] = []

    for (
      let index = 0;
      index <= progressiveSampleIndex && samples.length < 9;
      index += stride
    ) {
      samples.push(timeline.samples[index])
    }

    return samples
  }, [progressiveSampleIndex, sampleOutputs.table, timeline.samples])
  const angleDegrees = radiansToDegrees(currentSample.angleRadians)
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
    elapsedSecondsRef.current = 0
    lastUiFrameTimeRef.current = 0
    setElapsedSeconds(0)

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

    setSelectedPresetId(customPresetId)
    elapsedSecondsRef.current = 0
    lastUiFrameTimeRef.current = 0
    setElapsedSeconds(0)
    setParameterValues((currentValues) => ({
      ...currentValues,
      [parameter.id]: clampToParameterRange(nextValue, parameter),
    }))
  }

  const handleReset = () => {
    elapsedSecondsRef.current = 0
    lastUiFrameTimeRef.current = 0
    setElapsedSeconds(0)
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

  const handleSampleOutputChange =
    (outputId: keyof SampleOutputState) =>
    (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
      setSampleOutputs((current) => ({
        ...current,
        [outputId]: checked,
      }))
    }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '288px minmax(0, 1fr)' },
      }}
    >
      <Box
        component="aside"
        sx={{
          borderRight: { lg: `1px solid ${themeTokens.border}` },
          borderBottom: { xs: `1px solid ${themeTokens.border}`, lg: 0 },
          bgcolor: themeTokens.surface,
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

        <Stack spacing={1.5} sx={{ p: 1.5 }}>
          {simulationCatalog.areas.map((area) => (
            <Box key={area.id}>
              <Typography
                color="text.secondary"
                sx={{ mb: 0.75, px: 0.5 }}
                variant="body2"
              >
                {area.label}
              </Typography>
              <Stack spacing={0.75}>
                {area.simulations.map((simulation) => {
                  const isActive = simulation.id === activeSimulation.id

                  return (
                    <Box
                      aria-current={isActive ? 'page' : undefined}
                      key={simulation.id}
                      sx={{
                        border: `1px solid ${
                          isActive ? themeTokens.teal : themeTokens.border
                        }`,
                        borderRadius: 1,
                        bgcolor: isActive
                          ? alpha(themeTokens.teal, 0.12)
                          : alpha(themeTokens.panel, 0.58),
                        p: 1,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="body2">
                          {simulation.title}
                        </Typography>
                        <Chip
                          color={
                            simulation.status === 'available'
                              ? 'primary'
                              : 'default'
                          }
                          label={getStatusLabel(simulation.status)}
                          size="small"
                          variant={
                            simulation.status === 'available'
                              ? 'filled'
                              : 'outlined'
                          }
                        />
                      </Stack>
                    </Box>
                  )
                })}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Box
          component="header"
          sx={{
            alignItems: { xs: 'flex-start', md: 'center' },
            borderBottom: `1px solid ${themeTokens.border}`,
            display: 'flex',
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
            gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1fr) 340px' },
            p: { xs: 2, md: 3 },
          }}
        >
          <Stack spacing={2} sx={{ minWidth: 0 }}>
            <Box
              aria-label="Pendulum numerical viewport"
              sx={{
                border: `1px solid ${themeTokens.border}`,
                borderRadius: 1,
                bgcolor: alpha(themeTokens.panel, 0.58),
                minHeight: 322,
                overflow: 'hidden',
                position: 'relative',
              }}
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
                  sx={{ alignItems: 'center' }}
                >
                  <Typography color="text.secondary" variant="body2">
                    t = {formatNumber(currentSample.timeSeconds, 's')}
                  </Typography>
                  <Button
                    aria-label={
                      isPlaying
                        ? 'Pausar simulacao no viewport'
                        : 'Reproduzir simulacao no viewport'
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
                    variant="outlined"
                  >
                    {isPlaying ? 'Pausar' : 'Reproduzir'}
                  </Button>
                </Stack>
              </Box>

              <PendulumScene
                sample={currentSample}
                samples={timeline.samples}
                showTrace={overlays.trace}
                showVectors={overlays.vectors}
                traceSamples={traceSamples}
                vectors={vectors}
              />
              <Box
                sx={{
                  borderTop: `1px solid ${themeTokens.border}`,
                  display: 'grid',
                  gap: 1,
                  gridTemplateColumns: {
                    xs: '1fr 1fr',
                    md: 'repeat(4, minmax(0, 1fr))',
                  },
                  p: 1.5,
                }}
              >
                <Metric label="theta" value={formatDegrees(angleDegrees)} />
                <Metric
                  label="omega"
                  value={formatNumber(
                    currentSample.angularVelocityRadiansPerSecond,
                    'rad/s',
                  )}
                />
                <Metric
                  label="x"
                  value={formatNumber(currentSample.xMeters, 'm')}
                />
                {overlays.energy ? (
                  <Metric
                    label="energia"
                    value={formatNumber(currentSample.totalEnergyJoules, 'J')}
                  />
                ) : null}
              </Box>
              {overlays.vectors ? (
                <Box
                  sx={{
                    borderTop: `1px solid ${themeTokens.border}`,
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
                  {vectors.map((vector) => (
                    <Metric
                      key={vector.id}
                      label={vector.label}
                      value={formatNumber(vector.magnitude, vector.unit)}
                    />
                  ))}
                </Box>
              ) : null}
            </Box>

            {sampleOutputs.charts ? (
              <PendulumCharts
                durationSeconds={durationSeconds}
                samples={chartSamples}
                showEnergy={overlays.energy}
              />
            ) : null}

            {sampleOutputs.table ? (
              <Box
                sx={{
                  border: `1px solid ${themeTokens.border}`,
                  borderRadius: 1,
                  bgcolor: alpha(themeTokens.panel, 0.42),
                  p: 1.5,
                }}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={1}
                  sx={{
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                    mb: 1.5,
                  }}
                >
                  <Box>
                    <Typography variant="h2">Tabela de amostras</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {timeline.samples.length} amostras em{' '}
                      {formatNumber(pendulumFixture.durationSeconds, 's')}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${pendulumFixture.sampleRateHz} Hz`}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
                <TableContainer
                  sx={{
                    border: `1px solid ${themeTokens.border}`,
                    borderRadius: 1,
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
                        <TableCell>x</TableCell>
                        <TableCell>y</TableCell>
                        <TableCell>K</TableCell>
                        <TableCell>U</TableCell>
                        <TableCell>E</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableSamples.map((sample) => (
                        <TableRow key={sample.timeSeconds}>
                          <TableCell>
                            {formatNumber(sample.timeSeconds, 's')}
                          </TableCell>
                          <TableCell>
                            {formatDegrees(
                              radiansToDegrees(sample.angleRadians),
                            )}
                          </TableCell>
                          <TableCell>
                            {formatNumber(
                              sample.angularVelocityRadiansPerSecond,
                              'rad/s',
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ) : null}

            <FormulaGuide
              formulas={pendulumFixture.formulas}
              parameters={pendulumFixture.parameters}
            />

            <TheoryAppendix limits={pendulumFixture.limits} />
          </Stack>

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
                    {formatNumber(currentSample.timeSeconds, 's')} de{' '}
                    {formatNumber(durationSeconds, 's')}
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

              <Stack spacing={1.5}>
                {pendulumFixture.parameters.map((parameter) => (
                  <ParameterControl
                    key={parameter.id}
                    onChange={(nextValue) => {
                      handleParameterChange(parameter, nextValue)
                    }}
                    parameter={parameter}
                    value={readNumericParameter(parameterValues, parameter)}
                  />
                ))}
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

              <Box>
                <Typography sx={{ mb: 0.75 }} variant="h2">
                  Saidas de dados
                </Typography>
                <Stack spacing={0.5}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={sampleOutputs.charts}
                        onChange={handleSampleOutputChange('charts')}
                        size="small"
                      />
                    }
                    label="Graficos"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={sampleOutputs.table}
                        onChange={handleSampleOutputChange('table')}
                        size="small"
                      />
                    }
                    label="Tabela"
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
                    label="graficos"
                    value={sampleOutputs.charts ? 'ligado' : 'desligado'}
                  />
                  <Metric
                    label="tabela"
                    value={sampleOutputs.table ? 'ligado' : 'desligado'}
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
        </Box>
      </Box>
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
  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body2">{parameter.label}</Typography>
        <Typography color="text.secondary" variant="body2">
          {formatNumber(value, parameter.unit)}
        </Typography>
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
            onChange(Array.isArray(nextValue) ? nextValue[0] : nextValue)
          }}
          size="small"
          step={parameter.step}
          sx={{ flex: 1 }}
          value={value}
        />
        <TextField
          label={
            parameter.unit
              ? `${parameter.label} (${parameter.unit})`
              : parameter.label
          }
          onChange={(event) => {
            onChange(Number(event.target.value))
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
          value={value}
        />
      </Stack>
    </Box>
  )
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

function requestAnimationFrameSafe(callback: FrameRequestCallback) {
  if (typeof window.requestAnimationFrame === 'function') {
    return window.requestAnimationFrame(callback)
  }

  return window.setTimeout(() => {
    callback(window.performance.now())
  }, 16)
}

function cancelAnimationFrameSafe(frameId: number) {
  if (typeof window.cancelAnimationFrame === 'function') {
    window.cancelAnimationFrame(frameId)
    return
  }

  window.clearTimeout(frameId)
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

function getStatusLabel(status: string) {
  if (status === 'available') {
    return 'pronto'
  }

  if (status === 'scaffolded') {
    return 'base'
  }

  return 'planejado'
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

function formatNumber(value: number, unit = '') {
  const suffix = unit ? ` ${unit}` : ''

  return `${compactNumber.format(value)}${suffix}`
}
