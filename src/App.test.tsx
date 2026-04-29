import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ThemeProvider } from '@mui/material/styles'
import App from './App'
import { appTheme } from './theme/appTheme'

describe('App', () => {
  it('renders the pendulum simulation shell', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <App />
      </ThemeProvider>,
    )

    expect(
      screen.getByRole('heading', { name: /PhysicSimulator/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Pendulo simples/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Catalogo local/i)).toBeInTheDocument()
    expect(screen.getByText(/301 amostras/i)).toBeInTheDocument()
    expect(screen.getByText(/Viewport Three\.js/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Graficos/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Tabela de amostras/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Saidas de dados/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Guia de formulas/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Apendice teorico/i }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/Comprimento/i).length).toBeGreaterThan(0)
  })

  it('smoke tests playback, parameter, and overlay controls', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <App />
      </ThemeProvider>,
    )

    expect(
      screen.getByRole('img', { name: /Energia mecanica/i }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /Pausar animacao/i }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/Pausar simulacao/i)).toBeInTheDocument()
    expect(screen.getByText(/rodando/i)).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText(/Pausar simulacao/i))
    expect(screen.getByLabelText(/Reproduzir simulacao/i)).toBeInTheDocument()

    const lengthInput = screen.getByLabelText(/Comprimento \(m\)/i)

    fireEvent.change(lengthInput, {
      target: { value: '2' },
    })
    expect(lengthInput).toHaveValue(2)

    fireEvent.click(screen.getByRole('switch', { name: /^Energia$/i }))
    expect(
      screen.queryByRole('img', { name: /Energia mecanica/i }),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('switch', { name: /^Graficos$/i }))
    expect(
      screen.queryByRole('heading', { name: /^Graficos$/i }),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('switch', { name: /^Tabela$/i }))
    expect(
      screen.queryByRole('heading', { name: /Tabela de amostras/i }),
    ).not.toBeInTheDocument()
    expect(screen.getAllByText(/desligado/i).length).toBeGreaterThanOrEqual(2)

    fireEvent.click(screen.getByLabelText(/Resetar simulacao/i))
    expect(screen.getByLabelText(/Reproduzir simulacao/i)).toBeInTheDocument()
  })
})
