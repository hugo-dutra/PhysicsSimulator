import { useMemo } from 'react'
import { Box, Chip, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { renderToString } from 'katex'
import 'katex/dist/katex.min.css'
import type { FormulaReference, SimulationParameter } from '../../simulation-registry/types'
import { themeTokens } from '../../theme/appTheme'

type FormulaGuideProps = {
  formulas: FormulaReference[]
  parameters: SimulationParameter[]
}

export function FormulaGuide({ formulas, parameters }: FormulaGuideProps) {
  const parameterLabels = useMemo(
    () =>
      new Map(
        parameters.map((parameter) => [parameter.id, parameter.label]),
      ),
    [parameters],
  )

  return (
    <Box
      component="section"
      sx={{
        bgcolor: alpha(themeTokens.panel, 0.42),
        border: `1px solid ${themeTokens.border}`,
        borderRadius: 1,
        p: 1.5,
      }}
    >
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="h2">Guia de formulas</Typography>
          <Typography color="text.secondary" variant="body2">
            Equacoes ligadas aos parametros, samples, graficos e vetores.
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, minmax(0, 1fr))' },
          }}
        >
          {formulas.map((formula) => (
            <FormulaCard
              formula={formula}
              key={formula.id}
              parameterLabels={parameterLabels}
            />
          ))}
        </Box>
      </Stack>
    </Box>
  )
}

function FormulaCard({
  formula,
  parameterLabels,
}: {
  formula: FormulaReference
  parameterLabels: Map<string, string>
}) {
  return (
    <Box
      sx={{
        bgcolor: alpha(themeTokens.background, 0.64),
        border: `1px solid ${themeTokens.border}`,
        borderRadius: 1,
        minWidth: 0,
        p: 1.25,
      }}
    >
      <Stack spacing={1}>
        <Typography variant="body2">{formula.title}</Typography>
        <Box
          dangerouslySetInnerHTML={{
            __html: renderLatex(formula.expressionLatex),
          }}
          sx={{
            bgcolor: alpha(themeTokens.panel, 0.8),
            border: `1px solid ${themeTokens.border}`,
            borderRadius: 1,
            minHeight: 52,
            overflowX: 'auto',
            p: 1,
            '& .katex-display': {
              margin: 0,
            },
          }}
        />
        <Typography color="text.secondary" variant="body2">
          {formula.description}
        </Typography>
        <GuideBlock label="Quando usar" value={formula.usedWhen} />
        {formula.notUsedWhen ? (
          <GuideBlock label="Quando nao usar" value={formula.notUsedWhen} />
        ) : null}
        <FormulaVariables formula={formula} />
        <ChipRow
          items={formula.parameterIds.map(
            (parameterId) => parameterLabels.get(parameterId) ?? parameterId,
          )}
          label="Parametros"
        />
        <ChipRow items={formula.sampleFields} label="Dados" />
        <ChipRow items={formula.relatedChartIds ?? []} label="Graficos" />
        <ChipRow items={formula.relatedVectorIds ?? []} label="Vetores" />
        {formula.example ? <GuideBlock label="Exemplo" value={formula.example} /> : null}
      </Stack>
    </Box>
  )
}

function FormulaVariables({ formula }: { formula: FormulaReference }) {
  if (formula.variables.length === 0) {
    return null
  }

  return (
    <Box>
      <Typography color="text.secondary" sx={{ mb: 0.5 }} variant="body2">
        Variaveis
      </Typography>
      <Stack spacing={0.5}>
        {formula.variables.map((variable) => (
          <Typography
            color="text.secondary"
            key={`${formula.id}-${variable.symbol}`}
            variant="body2"
          >
            {variable.symbol}: {variable.label}
            {variable.unit ? ` (${variable.unit})` : ''}
          </Typography>
        ))}
      </Stack>
    </Box>
  )
}

function GuideBlock({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography color="text.secondary" variant="body2">
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  )
}

function ChipRow({ items, label }: { items: string[]; label: string }) {
  if (items.length === 0) {
    return null
  }

  return (
    <Box>
      <Typography color="text.secondary" sx={{ mb: 0.5 }} variant="body2">
        {label}
      </Typography>
      <Stack
        direction="row"
        sx={{
          flexWrap: 'wrap',
          gap: 0.75,
        }}
      >
        {items.map((item) => (
          <Chip key={item} label={item} size="small" variant="outlined" />
        ))}
      </Stack>
    </Box>
  )
}

function renderLatex(expression: string) {
  return renderToString(expression, {
    displayMode: true,
    output: 'htmlAndMathml',
    strict: false,
    throwOnError: false,
  })
}
