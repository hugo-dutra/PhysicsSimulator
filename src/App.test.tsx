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
    expect(screen.getByText('3601')).toBeInTheDocument()
    expect(screen.getByText(/Viewport Three\.js/i)).toBeInTheDocument()
    const viewport = screen.getByLabelText(/Pendulum numerical viewport/i)
    const angleMetric = within(viewport).getByText(/^Angulo do pendulo$/i)
    const vectorLegend = within(viewport).getByLabelText(/Legenda dos vetores/i)
    const simulationCanvas = within(viewport).getByLabelText(
      /Cena 3D do pendulo simples/i,
    )

    expect(simulationCanvas).toBeInTheDocument()
    expect(simulationCanvas).toHaveAccessibleName(/scroll para zoom/i)
    expect(
      angleMetric.compareDocumentPosition(simulationCanvas) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0)
    expect(
      vectorLegend.compareDocumentPosition(simulationCanvas) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0)
    expect(screen.getByLabelText(/Legenda dos vetores/i)).toBeInTheDocument()
    expect(
      screen.getByText(/tangencial a trajetoria, perpendicular ao fio/i),
    ).toBeInTheDocument()
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
      screen.getByRole('button', { name: /Abrir Graficos/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByRole('button', { name: /Abrir Tabela de amostras/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByRole('button', { name: /Abrir Guia de formulas/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByRole('button', { name: /Maximizar simulacao/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Maximizar Graficos/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Maximizar Tabela de amostras/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Maximizar Guia de formulas/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Maximizar Apendice teorico/i }),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/Comprimento/i).length).toBeGreaterThan(0)
    expect(screen.queryByText(/^30 s$/i)).not.toBeInTheDocument()
    expect(screen.getAllByText(/^12 s$/i)).toHaveLength(1)
    expect(screen.queryByText(/^1,6 m$/i)).not.toBeInTheDocument()
    expect(
      screen.queryByRole('img', { name: /Energia mecanica/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('table', {
        name: /Tabela sincronizada de amostras do pendulo/i,
      }),
    ).not.toBeInTheDocument()
  }, 20_000)

  it('smoke tests playback, parameter, and overlay controls', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <App />
      </ThemeProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: /Abrir Graficos/i }))
    expect(
      screen.getByRole('button', { name: /Recolher Graficos/i }),
    ).toHaveAttribute('aria-expanded', 'true')

    const energyChart = screen.getByRole('img', { name: /Energia mecanica/i })

    expect(
      screen.getByRole('img', { name: /Velocidade linear/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /Aceleracao/i }),
    ).toBeInTheDocument()
    expect(energyChart).toBeInTheDocument()
    expect(
      screen.getByText(/^Angulo do pendulo \(deg\)$/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/^Velocidade angular \(rad\/s\)$/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/^Velocidade linear tangencial \(m\/s\)$/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /^Aceleracao tangencial \(m\/s\^2\)$/i,
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/^Aceleracao radial \(m\/s\^2\)$/i),
    ).toBeInTheDocument()
    expect(
      screen.getAllByText(/^Aceleracao total \(m\/s\^2\)$/i).length,
    ).toBeGreaterThan(0)
    expect(screen.getByText(/^Energia cinetica \(J\)$/i)).toBeInTheDocument()
    expect(screen.getByText(/^Energia potencial \(J\)$/i)).toBeInTheDocument()
    expect(
      screen.getByText(/^Energia mecanica total \(J\)$/i),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', {
        name: /Mostrar Angulo do pendulo por tempo ao lado da simulacao/i,
      }),
    )
    const focusedChartSlot = screen.getByLabelText(
      /Slot de grafico em foco da simulacao/i,
    )

    expect(
      within(focusedChartSlot).getByRole('img', {
        name: /Angulo do pendulo por tempo/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: /Remover Angulo do pendulo por tempo do lado da simulacao/i,
      }),
    ).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(
      screen.getByRole('button', {
        name: /Remover Angulo do pendulo por tempo do lado da simulacao/i,
      }),
    )
    expect(
      screen.queryByLabelText(/Slot de grafico em foco da simulacao/i),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: /Mostrar Angulo do pendulo por tempo ao lado da simulacao/i,
      }),
    ).toHaveAttribute('aria-pressed', 'false')

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
    expect(screen.getByText('5401')).toBeInTheDocument()

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

    fireEvent.click(screen.getByRole('button', { name: /Recolher Graficos/i }))
    expect(
      screen.getByRole('button', { name: /Abrir Graficos/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByRole('img', { name: /Angulo do pendulo por tempo/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('img', { name: /Velocidade angular/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('img', { name: /Velocidade linear/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('img', { name: /Aceleracao/i }),
    ).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Abrir Tabela de amostras/i }),
    )
    expect(
      screen.getByRole('button', { name: /Recolher Tabela de amostras/i }),
    ).toHaveAttribute('aria-expanded', 'true')
    const sampleTable = screen.getByRole('table', {
      name: /Tabela sincronizada de amostras do pendulo/i,
    })
    expect(within(sampleTable).getAllByRole('row')).toHaveLength(10)

    fireEvent.click(
      screen.getByRole('button', { name: /Recolher Tabela de amostras/i }),
    )
    expect(
      screen.getByRole('button', { name: /Abrir Tabela de amostras/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.queryByRole('table', {
        name: /Tabela sincronizada de amostras do pendulo/i,
      }),
    ).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Abrir Guia de formulas/i }),
    )
    expect(screen.getByText(/Equacao de movimento angular/i)).toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('button', { name: /Recolher Guia de formulas/i }),
    )
    expect(
      screen.queryByText(/Equacao de movimento angular/i),
    ).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Abrir Apendice teorico/i }),
    )
    expect(screen.getByText(/Limites declarados no fixture/i)).toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('button', { name: /Recolher Apendice teorico/i }),
    )
    expect(
      screen.queryByText(/Limites declarados no fixture/i),
    ).not.toBeInTheDocument()
    expect(screen.getAllByText(/recolhido/i).length).toBeGreaterThanOrEqual(2)

    fireEvent.click(screen.getByLabelText(/Resetar simulacao/i))
    expect(screen.getByLabelText(/Reproduzir simulacao/i)).toBeInTheDocument()
  }, 20_000)

  it('maximizes simulation, charts, and table panels inside the window', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <App />
      </ThemeProvider>,
    )

    fireEvent.click(
      screen.getByRole('button', { name: /Maximizar simulacao/i }),
    )
    expect(
      screen.getByRole('button', { name: /Minimizar simulacao/i }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.queryByRole('heading', { name: /Graficos/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /Tabela de amostras/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /Controles/i }),
    ).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Minimizar simulacao/i }),
    )
    expect(
      screen.getByRole('heading', { name: /Graficos/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Tabela de amostras/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Controles/i }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Maximizar Graficos/i }))
    expect(
      screen.getByRole('button', { name: /Minimizar Graficos/i }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('img', { name: /Angulo do pendulo por tempo/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /Aceleracao/i }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /Tabela de amostras/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /Controles/i }),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Minimizar Graficos/i }))
    expect(
      screen.getByRole('button', { name: /Abrir Graficos/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByRole('heading', { name: /Tabela de amostras/i }),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Maximizar Tabela de amostras/i }),
    )
    expect(
      screen.getByRole('button', { name: /Minimizar Tabela de amostras/i }),
    ).toHaveAttribute('aria-pressed', 'true')
    const maximizedTable = screen.getByRole('table', {
      name: /Tabela sincronizada de amostras do pendulo/i,
    })

    expect(within(maximizedTable).getAllByRole('row')).toHaveLength(19)
    expect(
      screen.queryByRole('heading', { name: /Graficos/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /Controles/i }),
    ).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Minimizar Tabela de amostras/i }),
    )
    expect(
      screen.getByRole('button', { name: /Abrir Tabela de amostras/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByRole('heading', { name: /Controles/i }),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Maximizar Guia de formulas/i }),
    )
    expect(
      screen.getByRole('button', { name: /Minimizar Guia de formulas/i }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(/Equacao de movimento angular/i)).toBeInTheDocument()
    expect(
      screen.queryByRole('img', { name: /Angulo do pendulo por tempo/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('table', {
        name: /Tabela sincronizada de amostras do pendulo/i,
      }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /Controles/i }),
    ).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Minimizar Guia de formulas/i }),
    )
    expect(
      screen.getByRole('button', { name: /Abrir Guia de formulas/i }),
    ).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(
      screen.getByRole('button', { name: /Maximizar Apendice teorico/i }),
    )
    expect(
      screen.getByRole('button', { name: /Minimizar Apendice teorico/i }),
    ).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText(/Limites declarados no fixture/i)).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /Graficos/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /Controles/i }),
    ).not.toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Minimizar Apendice teorico/i }),
    )
    expect(
      screen.getByRole('button', { name: /Abrir Apendice teorico/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByRole('heading', { name: /Controles/i }),
    ).toBeInTheDocument()
  }, 20_000)

  it('renders the planned simulation catalog as navigable sidebar menus', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <App />
      </ThemeProvider>,
    )

    expect(
      screen.getByRole('navigation', { name: /Catalogo de simulacoes/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Alternar area Mecanica/i }),
    ).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByRole('button', { name: /Alternar subarea Oscilacoes/i }),
    ).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByText(/Pendulo simples/i).length).toBeGreaterThan(0)

    fireEvent.click(
      screen.getByRole('button', { name: /Alternar subarea Cinematica/i }),
    )
    expect(
      screen.getByText(/Movimento retilineo uniforme/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/Lancamento obliquo/i)).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Alternar area Termodinamica/i }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: /Alternar subarea Gases/i }),
    )
    expect(screen.getByText(/^Gas ideal$/i)).toBeInTheDocument()
    expect(screen.getByText(/Transformacoes gasosas/i)).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Alternar area Eletromagnetismo/i }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: /Alternar subarea Circuitos AC/i }),
    )
    expect(screen.getByText(/Circuito RLC/i)).toBeInTheDocument()
    expect(screen.getByText(/Fasores e potencia AC/i)).toBeInTheDocument()
  }, 20_000)

  it('opens the inclined plane simulation through the shared shell', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <App />
      </ThemeProvider>,
    )

    fireEvent.click(
      screen.getByRole('button', { name: /Alternar subarea Dinamica/i }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: /Plano inclinado com atrito/i }),
    )

    expect(
      screen.getByRole('heading', { name: /Plano inclinado com atrito/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Mecanica > Dinamica > Plano inclinado com atrito/i),
    ).toBeInTheDocument()
    expect(
      screen.getByLabelText(/Inclined plane numerical viewport/i),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/Cena 3D do plano inclinado/i))
      .toHaveAccessibleName(/scroll para zoom/i)
    expect(screen.getByLabelText(/Angulo do plano \(deg\)/i))
      .toBeInTheDocument()
    expect(screen.getAllByLabelText(/Coeficiente de atrito/i).length)
      .toBeGreaterThan(0)

    fireEvent.click(screen.getByRole('button', { name: /Abrir Graficos/i }))
    expect(
      screen.getByRole('img', { name: /Posicao no plano por tempo/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /Forcas no plano por tempo/i }),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Abrir Tabela de amostras/i }),
    )
    const sampleTable = screen.getByRole('table', {
      name: /Tabela sincronizada de amostras do plano inclinado/i,
    })
    expect(within(sampleTable).getAllByRole('row')).toHaveLength(10)

    fireEvent.click(
      screen.getByRole('button', { name: /Abrir Guia de formulas/i }),
    )
    expect(screen.getAllByText(/Componentes do peso/i).length)
      .toBeGreaterThan(0)

    fireEvent.click(
      screen.getByRole('button', { name: /Abrir Apendice teorico/i }),
    )
    expect(screen.getAllByText(/Atrito estatico/i).length)
      .toBeGreaterThan(0)
  }, 20_000)
})
