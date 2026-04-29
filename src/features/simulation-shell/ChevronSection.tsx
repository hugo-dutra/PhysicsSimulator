import { useId, type ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { themeTokens } from '../../theme/appTheme'

type ChevronSectionProps = {
  action?: ReactNode
  children: ReactNode
  expanded: boolean
  onToggle: () => void
  subtitle?: ReactNode
  title: string
}

export function ChevronSection({
  action,
  children,
  expanded,
  onToggle,
  subtitle,
  title,
}: ChevronSectionProps) {
  const titleId = useId()
  const contentId = useId()

  return (
    <Box
      aria-labelledby={titleId}
      component="section"
      sx={{
        bgcolor: alpha(themeTokens.panel, 0.42),
        border: `1px solid ${themeTokens.border}`,
        borderRadius: 1,
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      <Box
        aria-controls={contentId}
        aria-expanded={expanded}
        aria-label={`${expanded ? 'Recolher' : 'Abrir'} ${title}`}
        component="button"
        onClick={onToggle}
        sx={{
          alignItems: { xs: 'flex-start', md: 'center' },
          background: 'transparent',
          border: 0,
          color: 'inherit',
          cursor: 'pointer',
          display: 'flex',
          font: 'inherit',
          gap: 1.5,
          justifyContent: 'space-between',
          p: 1.5,
          textAlign: 'left',
          width: '100%',
          '&:focus-visible': {
            outline: `2px solid ${themeTokens.teal}`,
            outlineOffset: -2,
          },
          '&:hover': {
            bgcolor: alpha(themeTokens.teal, 0.06),
          },
        }}
        type="button"
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography id={titleId} variant="h2">
            {title}
          </Typography>
          {subtitle ? (
            <Typography color="text.secondary" variant="body2">
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            flex: '0 0 auto',
            justifyContent: 'flex-end',
          }}
        >
          {action}
          <Box
            aria-hidden
            sx={{
              color: expanded ? 'primary.main' : 'text.secondary',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </Box>
        </Stack>
      </Box>

      {expanded ? (
        <Box id={contentId} sx={{ px: 1.5, pb: 1.5 }}>
          {children}
        </Box>
      ) : null}
    </Box>
  )
}
