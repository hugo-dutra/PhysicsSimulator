import { memo, useMemo } from 'react'
import { Box, IconButton, Tooltip } from '@mui/material'
import { Eye, EyeOff } from 'lucide-react'
import type { PendulumSample } from '../../lib/physics/pendulum'
import { ChevronSection } from './ChevronSection'
import { LiveLineChart } from './LiveLineChart'
import {
  buildPendulumChartConfigs,
  preparePendulumChartSamples,
  type PendulumChartId,
} from './pendulumChartConfigs'

type PendulumChartsProps = {
  chartWindowSeconds: number
  expanded: boolean
  focusedChartId?: PendulumChartId | null
  maximized?: boolean
  onMaximizeToggle?: () => void
  onFocusedChartToggle?: (chartId: PendulumChartId) => void
  onToggle: () => void
  samples: PendulumSample[]
  showEnergy: boolean
  xAxisRange: [number, number]
}

const compactSeconds = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
})

export const PendulumCharts = memo(function PendulumCharts({
  chartWindowSeconds,
  expanded,
  focusedChartId = null,
  maximized = false,
  onMaximizeToggle,
  onFocusedChartToggle,
  onToggle,
  samples,
  showEnergy,
  xAxisRange,
}: PendulumChartsProps) {
  const chartSamples = useMemo(
    () => (expanded ? preparePendulumChartSamples(samples) : []),
    [expanded, samples],
  )
  const chartConfigs = useMemo(
    () =>
      expanded ? buildPendulumChartConfigs(chartSamples, showEnergy) : [],
    [chartSamples, expanded, showEnergy],
  )
  const visibleChartConfigs = useMemo(
    () => chartConfigs.filter((chart) => chart.id !== focusedChartId),
    [chartConfigs, focusedChartId],
  )

  return (
    <ChevronSection
      expanded={expanded}
      maximized={maximized}
      onMaximizeToggle={onMaximizeToggle}
      onToggle={onToggle}
      subtitle={
        expanded
          ? (
              <>
                Janela movel de {formatSeconds(chartWindowSeconds)} com{' '}
                {chartSamples.length} pontos visiveis.
              </>
            )
          : 'Recolhido; canvas e series suspensos.'
      }
      title="Graficos"
    >
      {expanded ? (
        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: {
              xs: '1fr',
              lg: maximized ? 'repeat(2, minmax(0, 1fr))' : '1fr',
              xl: maximized
                ? 'repeat(3, minmax(0, 1fr))'
                : 'repeat(2, minmax(0, 1fr))',
            },
          }}
        >
          {visibleChartConfigs.map((chart) => (
            <LiveLineChart
              action={
                onFocusedChartToggle ? (
                  <ChartFocusButton
                    chart={chart}
                    focused={focusedChartId === chart.id}
                    onToggle={onFocusedChartToggle}
                  />
                ) : undefined
              }
              key={chart.id}
              title={chart.title}
              traces={chart.traces}
              xAxisRange={xAxisRange}
              yAxisMode={chart.yAxisMode}
              yAxisTitle={chart.yAxisTitle}
            />
          ))}
        </Box>
      ) : null}
    </ChevronSection>
  )
})

type FocusableChart<TChartId extends string> = {
  id: TChartId
  title: string
}

export function ChartFocusButton<TChartId extends string>({
  chart,
  focused,
  onToggle,
}: {
  chart: FocusableChart<TChartId>
  focused: boolean
  onToggle: (chartId: TChartId) => void
}) {
  return (
    <Tooltip
      title={
        focused
          ? 'Remover grafico do lado da simulacao'
          : 'Mostrar grafico ao lado da simulacao'
      }
    >
      <IconButton
        aria-label={
          focused
            ? `Remover ${chart.title} do lado da simulacao`
            : `Mostrar ${chart.title} ao lado da simulacao`
        }
        aria-pressed={focused}
        color={focused ? 'primary' : 'default'}
        onClick={() => {
          onToggle(chart.id)
        }}
        size="small"
      >
        {focused ? (
          <EyeOff aria-hidden size={17} />
        ) : (
          <Eye aria-hidden size={17} />
        )}
      </IconButton>
    </Tooltip>
  )
}

function formatSeconds(value: number) {
  return `${compactSeconds.format(value)} s`
}
