import { Box, Chip, Stack, Typography } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'
import pendulumTheory from '../../content/simulations/mechanics/pendulum/theory.md?raw'
import { themeTokens } from '../../theme/appTheme'
import { ChevronSection } from './ChevronSection'

type TheoryAppendixProps = {
  expanded: boolean
  limits: string[]
  onToggle: () => void
}

export function TheoryAppendix({
  expanded,
  limits,
  onToggle,
}: TheoryAppendixProps) {
  return (
    <ChevronSection
      expanded={expanded}
      onToggle={onToggle}
      subtitle={
        expanded
          ? 'Markdown local com formulas KaTeX e limites do modelo didatico.'
          : 'Recolhido; Markdown e KaTeX desmontados.'
      }
      title="Apendice teorico"
    >
      {expanded ? (
        <Stack spacing={1.5}>
          <Box
            sx={{
              '& h1': {
                display: 'none',
              },
              '& h2': {
                color: themeTokens.text,
                fontSize: '1rem',
                lineHeight: 1.3,
                margin: '20px 0 8px',
              },
              '& h2:first-of-type': {
                marginTop: 0,
              },
              '& p, & li': {
                color: themeTokens.muted,
                fontSize: '0.8125rem',
                lineHeight: 1.62,
              },
              '& p': {
                margin: '0 0 10px',
              },
              '& ul': {
                margin: '0 0 12px',
                paddingLeft: 2.5,
              },
              '& .katex-display': {
                margin: '8px 0 12px',
                overflowX: 'auto',
                overflowY: 'hidden',
                paddingBottom: 0.5,
              },
              '& .katex': {
                color: themeTokens.text,
                fontSize: '0.98em',
              },
            }}
          >
            <ReactMarkdown
              rehypePlugins={[rehypeKatex]}
              remarkPlugins={[remarkMath]}
            >
              {pendulumTheory}
            </ReactMarkdown>
          </Box>

          <Box>
            <Typography
              color="text.secondary"
              sx={{ mb: 0.75 }}
              variant="body2"
            >
              Limites declarados no fixture
            </Typography>
            <Stack
              direction="row"
              sx={{
                flexWrap: 'wrap',
                gap: 0.75,
              }}
            >
              {limits.map((limit) => (
                <Chip
                  key={limit}
                  label={limit}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      ) : null}
    </ChevronSection>
  )
}
