import { memo, useMemo } from 'react'
import { Box } from '@mui/material'
import type {
  KinematicsSample,
  KinematicsSimulationId,
} from '../../lib/physics/kinematics'
import { ChevronSection } from './ChevronSection'
import { ChartFocusButton } from './PendulumCharts'
import { LiveLineChart } from './LiveLineChart'
import {
  buildKinematicsChartConfigs,
  prepareKinematicsChartSamples,
  type KinematicsChartId,
} from './kinematicsChartConfigs'

type KinematicsChartsProps = {
  chartWindowSeconds: number
  expanded: boolean
  focusedChartId?: KinematicsChartId | null
  maximized?: boolean
  onFocusedChartToggle?: (chartId: KinematicsChartId) => void
  onMaximizeToggle?: () => void
  onToggle: () => void
  samples: KinematicsSample[]
  showEnergy: boolean
  simulationId: KinematicsSimulationId
  xAxisRange: [number, number]
}

const compactSeconds = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
})

export const KinematicsCharts = memo(function KinematicsCharts({
  chartWindowSeconds,
  expanded,
  focusedChartId = null,
  maximized = false,
  onFocusedChartToggle,
  onMaximizeToggle,
  onToggle,
  samples,
  showEnergy,
  simulationId,
  xAxisRange,
}: KinematicsChartsProps) {
  const chartSamples = useMemo(
    () => (expanded ? prepareKinematicsChartSamples(samples) : []),
    [expanded, samples],
  )
  const chartConfigs = useMemo(
    () =>
      expanded
        ? buildKinematicsChartConfigs(chartSamples, simulationId, showEnergy)
        : [],
    [chartSamples, expanded, showEnergy, simulationId],
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

function formatSeconds(value: number) {
  return `${compactSeconds.format(value)} s`
}
