import { fireEvent, render, screen, within } from '@testing-library/react'
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
    expect(screen.getByText(/3601 amostras/i)).toBeInTheDocument()
    expect(screen.getByText(/Viewport Three\.js/i)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Graficos/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Tabela de amostras/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Tempo e janela/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Guia de formulas/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Apendice teorico/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^Graficos$/i }),
    ).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByRole('button', { name: /Tabela de amostras/i }),
    ).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByRole('button', { name: /Guia de formulas/i }),
    ).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByText(/Comprimento/i).length).toBeGreaterThan(0)

    const sampleTable = screen.getByRole('table', {
      name: /Tabela sincronizada de amostras do pendulo/i,
    })
    expect(within(sampleTable).getAllByRole('row')).toHaveLength(10)
  })

  it('smoke tests playback, parameter, and overlay controls', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <App />
      </ThemeProvider>,
    )

    const energyChart = screen.getByRole('img', { name: /Energia mecanica/i })

    expect(energyChart).toBeInTheDocument()

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
    fireEvent.blur(lengthInput)
    expect(screen.getByRole('img', { name: /Energia mecanica/i })).toBe(
      energyChart,
    )

    const durationInput = screen.getByLabelText(/Tempo do ciclo \(s\)/i)
    const chartWindowInput = screen.getByLabelText(/Janela do grafico \(s\)/i)

    fireEvent.change(durationInput, {
      target: { value: '45' },
    })
    expect(durationInput).toHaveValue(45)
    fireEvent.blur(durationInput)
    expect(screen.getByText(/5401 amostras/i)).toBeInTheDocument()

    fireEvent.change(chartWindowInput, {
      target: { value: '8' },
    })
    expect(chartWindowInput).toHaveValue(8)
    fireEvent.blur(chartWindowInput)
    expect(screen.getAllByText(/janela 8 s/i).length).toBeGreaterThan(0)

    fireEvent.click(screen.getByRole('switch', { name: /^Energia$/i }))
    expect(
      screen.queryByRole('img', { name: /Energia mecanica/i }),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^Graficos$/i }))
    expect(
      screen.getByRole('button', { name: /^Graficos$/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByRole('img', { name: /Angulo por tempo/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('img', { name: /Velocidade angular/i }),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Tabela de amostras/i }))
    expect(
      screen.getByRole('button', { name: /Tabela de amostras/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByRole('table', {
        name: /Tabela sincronizada de amostras do pendulo/i,
      }),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Guia de formulas/i }))
    expect(
      screen.queryByText(/Equacao de movimento angular/i),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Apendice teorico/i }))
    expect(
      screen.queryByText(/Limites declarados no fixture/i),
    ).not.toBeInTheDocument()
    expect(screen.getAllByText(/recolhido/i).length).toBeGreaterThanOrEqual(2)

    fireEvent.click(screen.getByLabelText(/Resetar simulacao/i))
    expect(screen.getByLabelText(/Reproduzir simulacao/i)).toBeInTheDocument()
  }, 20_000)
})
