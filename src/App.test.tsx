import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ThemeProvider } from '@mui/material/styles'
import App from './App'
import { appTheme } from './theme/appTheme'

describe('App', () => {
  const openMechanicsArea = () => {
    const mechanicsButton = screen.getByRole('button', {
      name: /Alternar area Mecanica/i,
    })

    if (mechanicsButton.getAttribute('aria-expanded') !== 'true') {
      fireEvent.click(mechanicsButton)
    }
  }
  const openWavesArea = () => {
    const wavesButton = screen.getByRole('button', {
      name: /Alternar area Oscilacoes e Ondas/i,
    })

    if (wavesButton.getAttribute('aria-expanded') !== 'true') {
      fireEvent.click(wavesButton)
    }
  }
  const getToggleByControls = (controlsId: string) => {
    const toggle = document.querySelector(`[aria-controls="${controlsId}"]`)

    if (!(toggle instanceof HTMLElement)) {
      throw new Error(`Toggle not found for ${controlsId}`)
    }

    return toggle
  }
  const getWavesOscillationsToggle = () =>
    getToggleByControls('subarea-waves-oscilacoes')

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
    openWavesArea()
    if (getWavesOscillationsToggle().getAttribute('aria-expanded') !== 'true') {
      fireEvent.click(getWavesOscillationsToggle())
    }
    expect(
      screen.getByRole('button', { name: /Massa-mola vertical/i }),
    ).toBeInTheDocument()
    openMechanicsArea()
    fireEvent.click(
      screen.getByRole('button', { name: /Alternar subarea Cinematica/i }),
    )
    expect(
      screen.getByRole('button', { name: /Movimento retilineo uniforme/i }),
    ).toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('button', { name: /Alternar subarea Dinamica/i }),
    )
    expect(
      screen.getByRole('button', { name: /Maquina de Atwood/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Forca centripeta em curva/i }),
    ).toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('button', {
        name: /Alternar subarea Energia e momento/i,
      }),
    )
    expect(
      screen.getByRole('button', { name: /Trabalho e energia em trilho/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Colisoes 1D e 2D/i }),
    ).toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('button', { name: /Alternar subarea Estatica/i }),
    )
    expect(
      screen.getByRole('button', { name: /Equilibrio de particula/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: /Torque, alavancas e centro de massa/i,
      }),
    ).toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('button', { name: /Alternar subarea Rotacao/i }),
    )
    expect(
      screen.getByRole('button', { name: /Rotacao de corpo rigido/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Rolamento sem escorregamento/i }),
    ).toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('button', { name: /Alternar subarea Gravitacao/i }),
    )
    expect(
      screen.getByRole('button', { name: /Campo gravitacional e orbitas/i }),
    ).toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('button', { name: /Alternar subarea Fluidos basicos/i }),
    )
    expect(
      screen.getByRole('button', { name: /Hidrostatica e empuxo/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Continuidade e Bernoulli/i }),
    ).toBeInTheDocument()
    expect(screen.getByText('3601')).toBeInTheDocument()
    expect(screen.queryByText(/Viewport Three\.js/i)).not.toBeInTheDocument()
    const viewport = screen.getByLabelText(/Pendulum numerical viewport/i)
    const originLegend = within(viewport).getByLabelText(
      /Referencia de origem dos eixos da grade/i,
    )
    const animationVectorLegend = within(viewport).getByLabelText(
      /Legenda compacta dos vetores na animacao/i,
    )
    const simulationCanvas = within(viewport).getByLabelText(
      /Cena 3D do pendulo simples/i,
    )
    const readoutToggle = within(viewport).getByRole('button', {
      name: /Abrir leituras e vetores/i,
    })

    expect(simulationCanvas).toBeInTheDocument()
    expect(simulationCanvas).toHaveAccessibleName(
      /por cima e por baixo.*Shift \+ scroll para zoom/i,
    )
    expect(readoutToggle).toHaveAttribute('aria-expanded', 'false')
    expect(within(viewport).queryByText(/^Angulo do pendulo$/i)).toBeNull()
    expect(
      within(viewport).queryByLabelText(/^Legenda dos vetores$/i),
    ).toBeNull()
    expect(within(originLegend).getByText(/^Origem da grade$/i))
      .toBeInTheDocument()
    expect(within(originLegend).getByText(/^X$/i)).toBeInTheDocument()
    expect(within(originLegend).getByText(/^Y$/i)).toBeInTheDocument()
    expect(within(originLegend).getByText(/^Z$/i)).toBeInTheDocument()
    expect(within(originLegend).getByText(/canto inferior esquerdo/i))
      .toBeInTheDocument()
    expect(within(animationVectorLegend).getByText(/^Peso \(N\)$/i))
      .toBeInTheDocument()
    expect(within(animationVectorLegend).getByText(/^Tensao \(N\)$/i))
      .toBeInTheDocument()
    expect(
      within(animationVectorLegend).getByText(/^Velocidade linear \(m\/s\)$/i),
    ).toBeInTheDocument()

    fireEvent.click(readoutToggle)

    const angleMetric = within(viewport).getByText(/^Angulo do pendulo$/i)
    const vectorLegend = within(viewport).getByLabelText(/^Legenda dos vetores$/i)

    expect(
      within(viewport).getByRole('button', {
        name: /Fechar leituras e vetores/i,
      }),
    ).toHaveAttribute('aria-expanded', 'true')
    expect(
      angleMetric.compareDocumentPosition(simulationCanvas) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0)
    expect(
      vectorLegend.compareDocumentPosition(simulationCanvas) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).not.toBe(0)
    expect(screen.getByLabelText(/^Legenda dos vetores$/i)).toBeInTheDocument()
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
      screen.getByRole('heading', { name: /Tempo continuo e janela/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Ajuda: Horizonte calculado/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Ajuda: Comprimento/i }),
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
  }, 60_000)

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
    const kineticEnergyLegendToggle = screen.getByRole('button', {
      name: /Desligar serie Energia cinetica \(J\) no grafico Energia mecanica/i,
    })

    expect(kineticEnergyLegendToggle).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(kineticEnergyLegendToggle)
    expect(
      screen.getByRole('button', {
        name: /Ligar serie Energia cinetica \(J\) no grafico Energia mecanica/i,
      }),
    ).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(
      screen.getByRole('button', {
        name: /Ligar serie Energia cinetica \(J\) no grafico Energia mecanica/i,
      }),
    )
    expect(
      screen.getByRole('button', {
        name: /Desligar serie Energia cinetica \(J\) no grafico Energia mecanica/i,
      }),
    ).toHaveAttribute('aria-pressed', 'true')

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
      screen.getByRole('button', { name: /Pausar simulacao/i }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/Pausar simulacao/i)).toBeInTheDocument()
    expect(screen.getByText(/rodando/i)).toBeInTheDocument()

    const playbackSpeedInput = screen.getByLabelText(
      /Velocidade do tempo \(x\)/i,
    )

    expect(playbackSpeedInput).toHaveValue(1)
    fireEvent.change(playbackSpeedInput, {
      target: { value: '0.25' },
    })
    expect(playbackSpeedInput).toHaveValue(0.25)
    fireEvent.blur(playbackSpeedInput)
    expect(screen.getAllByText(/0,25x/i).length).toBeGreaterThan(0)

    fireEvent.change(playbackSpeedInput, {
      target: { value: '0' },
    })
    expect(playbackSpeedInput).toHaveValue(0)
    fireEvent.blur(playbackSpeedInput)
    expect(screen.getByText(/pausado \(0x\)/i)).toBeInTheDocument()

    fireEvent.change(playbackSpeedInput, {
      target: { value: '1' },
    })
    expect(playbackSpeedInput).toHaveValue(1)
    fireEvent.blur(playbackSpeedInput)
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

    const durationInput = screen.getByLabelText(/Horizonte calculado \(s\)/i)
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
  }, 45_000)

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
      screen.getByRole('heading', { name: /Controles/i }),
    ).toBeInTheDocument()

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
      screen.getByRole('heading', { name: /Controles/i }),
    ).toBeInTheDocument()

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
      screen.getByRole('heading', { name: /Controles/i }),
    ).toBeInTheDocument()

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
      screen.getByRole('heading', { name: /Controles/i }),
    ).toBeInTheDocument()

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
      screen.getByRole('heading', { name: /Controles/i }),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Minimizar Apendice teorico/i }),
    )
    expect(
      screen.getByRole('button', { name: /Abrir Apendice teorico/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByRole('heading', { name: /Controles/i }),
    ).toBeInTheDocument()
  }, 45_000)

  it('renders the simulation catalog with ready subareas collapsed', () => {
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
    ).toHaveAttribute('aria-expanded', 'false')
    openMechanicsArea()
    expect(
      screen.getByRole('button', { name: /Alternar area Mecanica/i }),
    ).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByRole('heading', { name: /Pendulo simples/i }),
    ).toBeInTheDocument()
    expect(
      document.querySelector('[aria-controls="subarea-mechanics-oscilacoes"]'),
    ).toBeNull()
    expect(getWavesOscillationsToggle()).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(
      screen.getByRole('button', { name: /Massa-mola vertical/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Alternar subarea Cinematica/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByRole('button', { name: /Alternar subarea Dinamica/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByRole('button', {
        name: /Alternar subarea Energia e momento/i,
      }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByRole('button', { name: /Alternar subarea Estatica/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByRole('button', { name: /Alternar subarea Rotacao/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByRole('button', { name: /Alternar subarea Gravitacao/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(
      screen.getByRole('button', { name: /Alternar subarea Fluidos basicos/i }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryAllByText(/^analise$/i)).toHaveLength(6)
    expect(screen.getAllByText(/^pronto$/i).length).toBeGreaterThan(0)
    fireEvent.click(
      screen.getByRole('button', { name: /Alternar subarea Cinematica/i }),
    )
    expect(
      screen.getByRole('button', { name: /Movimento retilineo uniforme/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Lancamento obliquo/i }),
    ).toBeInTheDocument()
    fireEvent.click(
      screen.getByRole('button', { name: /Alternar subarea Rotacao/i }),
    )
    expect(
      screen.getByRole('button', { name: /Rotacao de corpo rigido/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Rolamento sem escorregamento/i }),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Alternar area Termodinamica/i }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: /Alternar subarea Gases/i }),
    )
    expect(screen.getAllByText(/^planejado$/i).length).toBeGreaterThan(0)
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

  it('opens the vertical mass-spring simulation in oscillations and waves', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <App />
      </ThemeProvider>,
    )

    openWavesArea()
    if (getWavesOscillationsToggle().getAttribute('aria-expanded') !== 'true') {
      fireEvent.click(getWavesOscillationsToggle())
    }
    fireEvent.click(
      screen.getByRole('button', { name: /Massa-mola vertical/i }),
    )

    expect(
      screen.getByRole('heading', { name: /Massa-mola vertical/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /Oscilacoes e Ondas > Oscilacoes > Massa-mola vertical/i,
      ),
    ).toBeInTheDocument()
    const viewport = screen.getByLabelText(/Kinematics numerical viewport/i)
    const animationVectorLegend = within(viewport).getByLabelText(
      /Legenda compacta dos vetores na animacao/i,
    )

    expect(viewport).toBeInTheDocument()
    expect(screen.getByLabelText(/Cena 3D do massa-mola vertical/i))
      .toHaveAccessibleName(/por cima e por baixo.*Shift \+ scroll para zoom/i)
    expect(within(animationVectorLegend).getByText(/^Forca elastica \(N\)$/i))
      .toBeInTheDocument()
    expect(within(animationVectorLegend).getByText(/^Peso \(N\)$/i))
      .toBeInTheDocument()
    expect(screen.getAllByLabelText(/Constante elastica \(N\/m\)/i).length)
      .toBeGreaterThan(0)
    expect(
      screen.getByRole('button', { name: /Ajuda: Constante elastica/i }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Abrir Graficos/i }))
    expect(
      screen.getByRole('img', {
        name: /Forca elastica, peso e resultante/i,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /Energia por tempo/i }),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Abrir Guia de formulas/i }),
    )
    expect(screen.getByText(/Lei de Hooke e forca elastica/i))
      .toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Abrir Apendice teorico/i }),
    )
    expect(screen.getByText(/SPRING_DAMPING_ACTIVE/i)).toBeInTheDocument()
  }, 20_000)

  it('opens the Fase 4 oscillators through the shared shell', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <App />
      </ThemeProvider>,
    )

    openWavesArea()
    const oscillationsButton = getWavesOscillationsToggle()

    if (oscillationsButton.getAttribute('aria-expanded') !== 'true') {
      fireEvent.click(oscillationsButton)
    }

    fireEvent.click(
      screen.getByRole('button', { name: /Oscilador amortecido/i }),
    )
    expect(
      screen.getByRole('heading', { name: /Oscilador amortecido/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /Oscilacoes e Ondas > Oscilacoes > Oscilador amortecido/i,
      ),
    ).toBeInTheDocument()
    expect(screen.getAllByLabelText(/Amortecimento \(s\^-1\)/i).length)
      .toBeGreaterThan(0)

    fireEvent.click(
      screen.getByRole('button', {
        name: /Oscilador forcado e ressonancia/i,
      }),
    )
    expect(
      screen.getByRole('heading', {
        name: /Oscilador forcado e ressonancia/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getAllByLabelText(/Frequencia externa \(rad\/s\)/i).length)
      .toBeGreaterThan(0)
    fireEvent.click(screen.getByRole('button', { name: /Abrir Graficos/i }))
    expect(
      screen.getByRole('img', { name: /Forcas do oscilador forcado/i }),
    ).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: /Osciladores acoplados/i }),
    )
    expect(
      screen.getByRole('heading', { name: /Osciladores acoplados/i }),
    ).toBeInTheDocument()
    expect(screen.getAllByLabelText(/Mola de acoplamento \(N\/m\)/i).length)
      .toBeGreaterThan(0)
    expect(screen.getByLabelText(/Cena 3D dos osciladores acoplados/i))
      .toHaveAccessibleName(/duas massas.*modo comum.*Shift \+ scroll/i)
  }, 30_000)

  it('opens the mechanical waves through the shared shell', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <App />
      </ThemeProvider>,
    )

    openWavesArea()
    fireEvent.click(
      screen.getByRole('button', {
        name: /Alternar subarea Ondas mecanicas/i,
      }),
    )

    const waveCases = [
      {
        title: /Onda em corda/i,
        chart: /Deslocamento da corda por tempo/i,
        control: /Comprimento de onda \(m\)/i,
        canvas: /Cena 3D de onda em corda/i,
      },
      {
        title: /Superposicao e interferencia/i,
        chart: /Superposicao no probe por tempo/i,
        control: /Fase relativa \(deg\)/i,
        canvas: /Cena 3D de superposicao e interferencia/i,
      },
      {
        title: /Ondas estacionarias/i,
        chart: /Deslocamento estacionario por tempo/i,
        control: /Harmonico/i,
        canvas: /Cena 3D de ondas estacionarias/i,
      },
    ]

    waveCases.forEach(({ title, chart, control, canvas }) => {
      fireEvent.click(screen.getByRole('button', { name: title }))

      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
      expect(screen.getByLabelText(canvas)).toHaveAccessibleName(
        /Shift \+ scroll para zoom/i,
      )
      expect(screen.getAllByLabelText(control).length).toBeGreaterThan(0)
      expect(
        screen.getAllByRole('button', { name: /Ajuda:/i }).length,
      ).toBeGreaterThan(0)

      fireEvent.click(screen.getByRole('button', { name: /Abrir Graficos/i }))
      expect(screen.getByRole('img', { name: chart })).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: /Recolher Graficos/i }))
    })
  }, 30_000)

  it('opens the inclined plane simulation through the shared shell', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <App />
      </ThemeProvider>,
    )

    openMechanicsArea()
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
    const viewport = screen.getByLabelText(/Inclined plane numerical viewport/i)
    const animationVectorLegend = within(viewport).getByLabelText(
      /Legenda compacta dos vetores na animacao/i,
    )

    expect(viewport).toBeInTheDocument()
    expect(
      within(viewport).getByLabelText(/Referencia de origem dos eixos da grade/i),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/Cena 3D do plano inclinado/i))
      .toHaveAccessibleName(/por cima e por baixo.*Shift \+ scroll para zoom/i)
    expect(within(animationVectorLegend).getByText(/^Peso \(N\)$/i))
      .toBeInTheDocument()
    expect(within(animationVectorLegend).getByText(/^Normal \(N\)$/i))
      .toBeInTheDocument()
    expect(within(animationVectorLegend).getByText(/^Atrito \(N\)$/i))
      .toBeInTheDocument()
    expect(within(animationVectorLegend).getByText(/^Velocidade \(m\/s\)$/i))
      .toBeInTheDocument()
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

  it('opens the first kinematics simulations through the shared shell', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <App />
      </ThemeProvider>,
    )

    const kinematicsCases = [
      {
        title: /Movimento retilineo uniforme/i,
        chart: /Posicao por tempo/i,
        control: /Velocidade \(m\/s\)/i,
      },
      {
        title: /Movimento uniformemente variado e queda livre/i,
        chart: /Aceleracao por tempo/i,
        control: /Aceleracao \(m\/s\^2\)/i,
      },
      {
        title: /Lancamento obliquo/i,
        chart: /Velocidades por tempo/i,
        control: /Angulo de lancamento \(deg\)/i,
      },
      {
        title: /Movimento circular uniforme/i,
        chart: /Aceleracao centripeta por tempo/i,
        control: /Raio \(m\)/i,
      },
    ]

    openMechanicsArea()
    fireEvent.click(
      screen.getByRole('button', { name: /Alternar subarea Cinematica/i }),
    )

    kinematicsCases.forEach(({ title, chart, control }) => {
      fireEvent.click(screen.getByRole('button', { name: title }))

      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
      const viewport = screen.getByLabelText(/Kinematics numerical viewport/i)

      expect(viewport).toBeInTheDocument()
      expect(
        within(viewport).getByLabelText(
          /Referencia de origem dos eixos da grade/i,
        ),
      ).toBeInTheDocument()
      expect(screen.getByLabelText(/Cena 3D de Cinematica/i))
        .toHaveAccessibleName(/por cima e por baixo.*Shift \+ scroll para zoom/i)
      expect(screen.getAllByLabelText(control).length).toBeGreaterThan(0)

      fireEvent.click(screen.getByRole('button', { name: /Abrir Graficos/i }))
      expect(screen.getByRole('img', { name: chart })).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: /Recolher Graficos/i }))
    })
  }, 45_000)

  it('opens the next mechanics simulations through the shared shell', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <App />
      </ThemeProvider>,
    )

    const dynamicsCases = [
      {
        title: /Maquina de Atwood/i,
        chart: /Tensao e resultante por tempo/i,
        control: /Massa 1 \(kg\)/i,
      },
      {
        title: /Forca centripeta em curva/i,
        chart: /Forca centripeta e atrito por tempo/i,
        control: /Raio da curva \(m\)/i,
      },
    ]

    openMechanicsArea()
    fireEvent.click(
      screen.getByRole('button', { name: /Alternar subarea Dinamica/i }),
    )

    dynamicsCases.forEach(({ title, chart, control }) => {
      fireEvent.click(screen.getByRole('button', { name: title }))

      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
      expect(screen.getByLabelText(/Kinematics numerical viewport/i))
        .toBeInTheDocument()
      expect(screen.getByLabelText(/Cena 3D de Cinematica/i))
        .toHaveAccessibleName(/por cima e por baixo.*Shift \+ scroll para zoom/i)
      expect(screen.getAllByLabelText(control).length).toBeGreaterThan(0)

      fireEvent.click(screen.getByRole('button', { name: /Abrir Graficos/i }))
      expect(screen.getByRole('img', { name: chart })).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: /Recolher Graficos/i }))
    })

    fireEvent.click(
      screen.getByRole('button', {
        name: /Alternar subarea Energia e momento/i,
      }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: /Trabalho e energia em trilho/i }),
    )

    expect(
      screen.getByRole('heading', { name: /Trabalho e energia em trilho/i }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/Perda por ciclo \(%\)/i)).toBeInTheDocument()
    const workEnergyViewport = screen.getByLabelText(
      /Kinematics numerical viewport/i,
    )
    const energyBalanceHud = within(workEnergyViewport).getByLabelText(
      /Balanco energetico do trilho/i,
    )

    expect(within(energyBalanceHud).getByText(/^K$/i)).toBeInTheDocument()
    expect(within(energyBalanceHud).getByText(/^Ug$/i)).toBeInTheDocument()
    expect(within(energyBalanceHud).getByText(/^Eperd$/i)).toBeInTheDocument()
    expect(within(energyBalanceHud).getByText(/^E total$/i)).toBeInTheDocument()
    expect(within(energyBalanceHud).getByText(/^perda$/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Abrir Graficos/i }))
    expect(
      screen.getByRole('img', { name: /Dissipacao e perda acumulada/i }),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Recolher Graficos/i }))

    const nextMechanicsCases = [
      {
        title: /Colisoes 1D e 2D/i,
        subarea: /Alternar subarea Energia e momento/i,
        chart: /Momento e impulso por tempo/i,
        control: /Coeficiente de restituicao/i,
      },
      {
        title: /Equilibrio de particula/i,
        subarea: /Alternar subarea Estatica/i,
        chart: /Forcas e resultante por tempo/i,
        control: /Forca A \(N\)/i,
      },
      {
        title: /Torque, alavancas e centro de massa/i,
        subarea: /Alternar subarea Estatica/i,
        chart: /Torque e centro de massa/i,
        control: /Braco esquerdo \(m\)/i,
      },
      {
        title: /Rotacao de corpo rigido/i,
        subarea: /Alternar subarea Rotacao/i,
        chart: /Inercia, centro de massa e momento angular/i,
        control: /Distancia da massa movel \(m\)/i,
        extraControls: [/Massa movel \(kg\)/i, /Energia constante/i],
      },
      {
        title: /Rolamento sem escorregamento/i,
        subarea: /Alternar subarea Rotacao/i,
        chart: /Atrito estatico e aderencia/i,
        control: /Raio \(m\)/i,
      },
      {
        title: /Campo gravitacional e orbitas/i,
        subarea: /Alternar subarea Gravitacao/i,
        chart: /Campo gravitacional por tempo/i,
        control: /Massa central \(M_terra\)/i,
      },
      {
        title: /Hidrostatica e empuxo/i,
        subarea: /Alternar subarea Fluidos basicos/i,
        chart: /Empuxo, peso e resultante/i,
        control: /Densidade do fluido \(kg\/m\^3\)/i,
      },
      {
        title: /Continuidade e Bernoulli/i,
        subarea: /Alternar subarea Fluidos basicos/i,
        chart: /Pressao por Bernoulli/i,
        control: /Vazao \(m\^3\/s\)/i,
      },
    ]

    const ensureSubareaOpen = (name: RegExp) => {
      const subareaButton = screen.getByRole('button', { name })

      if (subareaButton.getAttribute('aria-expanded') !== 'true') {
        fireEvent.click(subareaButton)
      }
    }

    nextMechanicsCases.forEach(({
      title,
      subarea,
      chart,
      control,
      extraControls,
    }) => {
      ensureSubareaOpen(subarea)
      fireEvent.click(screen.getByRole('button', { name: title }))

      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
      expect(screen.getByLabelText(/Kinematics numerical viewport/i))
        .toBeInTheDocument()
      expect(screen.getAllByLabelText(control).length).toBeGreaterThan(0)
      extraControls?.forEach((extraControl) => {
        expect(screen.getAllByLabelText(extraControl).length)
          .toBeGreaterThan(0)
      })

      fireEvent.click(screen.getByRole('button', { name: /Abrir Graficos/i }))
      expect(screen.getByRole('img', { name: chart })).toBeInTheDocument()
      fireEvent.click(screen.getByRole('button', { name: /Recolher Graficos/i }))
    })
  }, 120_000)
})
