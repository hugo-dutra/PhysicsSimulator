import { useId, type ReactNode } from 'react'
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { ChevronDown, ChevronRight, Maximize2, Minimize2 } from 'lucide-react'
import { themeTokens } from '../../theme/appTheme'

type ChevronSectionProps = {
  action?: ReactNode
  children: ReactNode
  expanded: boolean
  maximized?: boolean
  onMaximizeToggle?: () => void
  onToggle: () => void
  subtitle?: ReactNode
  title: string
}

export function ChevronSection({
  action,
  children,
  expanded,
  maximized = false,
  onMaximizeToggle,
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
        sx={{
          alignItems: { xs: 'flex-start', md: 'center' },
          display: 'flex',
          gap: 1.5,
          justifyContent: 'space-between',
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
            flex: '1 1 auto',
            font: 'inherit',
            gap: 1.5,
            justifyContent: 'space-between',
            minWidth: 0,
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
          <Box
            aria-hidden
            sx={{
              color: expanded ? 'primary.main' : 'text.secondary',
              display: 'grid',
              flex: '0 0 auto',
              placeItems: 'center',
            }}
          >
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </Box>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            flex: '0 0 auto',
            justifyContent: 'flex-end',
            pr: 1.25,
            pt: 1.125,
          }}
        >
          {action}
          {onMaximizeToggle ? (
            <Tooltip title={maximized ? 'Minimizar' : 'Maximizar'}>
              <IconButton
                aria-label={`${maximized ? 'Minimizar' : 'Maximizar'} ${title}`}
                aria-pressed={maximized}
                color={maximized ? 'primary' : 'default'}
                onClick={onMaximizeToggle}
                size="small"
              >
                {maximized ? (
                  <Minimize2 aria-hidden size={17} />
                ) : (
                  <Maximize2 aria-hidden size={17} />
                )}
              </IconButton>
            </Tooltip>
          ) : null}
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
