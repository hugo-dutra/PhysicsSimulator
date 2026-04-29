import { createTheme } from '@mui/material/styles'

const graphite = {
  background: '#0F1115',
  surface: '#171A21',
  panel: '#20242D',
  border: '#2A2F3A',
  text: '#E6E8EC',
  muted: '#9AA4B2',
  teal: '#2DD4BF',
  cyan: '#38BDF8',
  warning: '#F59E0B',
  danger: '#F43F5E',
  vector: '#A3E635',
}

export const appTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: graphite.teal,
      contrastText: '#041311',
    },
    info: {
      main: graphite.cyan,
    },
    warning: {
      main: graphite.warning,
    },
    error: {
      main: graphite.danger,
    },
    success: {
      main: graphite.vector,
      contrastText: '#111509',
    },
    background: {
      default: graphite.background,
      paper: graphite.surface,
    },
    text: {
      primary: graphite.text,
      secondary: graphite.muted,
    },
    divider: graphite.border,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',
    allVariants: {
      letterSpacing: 0,
    },
    h1: {
      fontSize: '1.75rem',
      lineHeight: 1.15,
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.125rem',
      lineHeight: 1.25,
      fontWeight: 650,
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.55,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.8125rem',
      fontWeight: 700,
      letterSpacing: 0,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: graphite.background,
          color: graphite.text,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 36,
          borderRadius: 6,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: `1px solid ${graphite.border}`,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: graphite.teal,
        },
        rail: {
          color: graphite.panel,
          opacity: 1,
        },
      },
    },
  },
})

export const themeTokens = graphite
