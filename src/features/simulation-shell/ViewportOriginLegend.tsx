import { Box, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { originAxisLegendItems } from '../../lib/rendering/originAxes'
import { themeTokens } from '../../theme/appTheme'

export function ViewportOriginLegend() {
  return (
    <Box
      aria-label="Referencia de origem dos eixos da grade"
      sx={{
        bgcolor: alpha(themeTokens.background, 0.68),
        border: `1px solid ${alpha(themeTokens.text, 0.14)}`,
        borderRadius: 1,
        boxShadow: `0 10px 24px ${alpha(themeTokens.background, 0.28)}`,
        display: 'grid',
        gap: 0.45,
        left: { xs: 8, sm: 10 },
        maxWidth: 190,
        opacity: 0.86,
        p: 0.85,
        pointerEvents: 'none',
        position: 'absolute',
        top: { xs: 8, sm: 10 },
        zIndex: 2,
      }}
    >
      <Typography
        sx={{
          color: alpha(themeTokens.text, 0.82),
          fontSize: '0.66rem',
          fontWeight: 800,
          lineHeight: 1,
          textTransform: 'uppercase',
        }}
      >
        Origem da grade
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 0.35,
        }}
      >
        {originAxisLegendItems.map((axis) => (
          <Box
            key={axis.id}
            sx={{
              alignItems: 'center',
              display: 'grid',
              gap: 0.6,
              gridTemplateColumns: '10px 14px minmax(0, 1fr)',
              minWidth: 0,
            }}
          >
            <Box
              aria-hidden
              sx={{
                bgcolor: axis.color,
                borderRadius: 999,
                height: 8,
                opacity: 0.76,
                width: 8,
              }}
            />
            <Typography
              sx={{
                color: axis.color,
                fontSize: '0.68rem',
                fontWeight: 900,
                lineHeight: 1,
                opacity: 0.9,
              }}
            >
              {axis.id}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ fontSize: '0.66rem', lineHeight: 1.05, minWidth: 0 }}
            >
              {axis.label}
            </Typography>
          </Box>
        ))}
      </Box>
      <Typography
        color="text.secondary"
        sx={{ fontSize: '0.62rem', lineHeight: 1.1, opacity: 0.72 }}
      >
        canto inferior esquerdo
      </Typography>
    </Box>
  )
}
