import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { describe, expect, it, vi } from 'vitest'
import { appTheme } from '../../theme/appTheme'
import { SimulationShell } from './SimulationShell'

vi.mock('./PendulumScene', async () => {
  const React = await import('react')

  return {
    PendulumScene: ({
      cameraProjectionMode,
      resetVersion,
    }: {
      cameraProjectionMode: string
      resetVersion: number
    }) =>
      React.createElement('div', {
        'aria-label': 'mock pendulum scene',
        'data-camera-projection-mode': cameraProjectionMode,
        'data-reset-version': resetVersion,
      }),
  }
})

vi.mock('./InclinedPlaneScene', async () => {
  const React = await import('react')

  return {
    InclinedPlaneScene: ({
      cameraProjectionMode,
      resetVersion,
    }: {
      cameraProjectionMode: string
      resetVersion: number
    }) =>
      React.createElement('div', {
        'aria-label': 'mock inclined plane scene',
        'data-camera-projection-mode': cameraProjectionMode,
        'data-reset-version': resetVersion,
      }),
  }
})

vi.mock('./KinematicsScene', async () => {
  const React = await import('react')

  return {
    KinematicsScene: ({
      cameraProjectionMode,
      resetVersion,
    }: {
      cameraProjectionMode: string
      resetVersion: number
    }) =>
      React.createElement('div', {
        'aria-label': 'mock kinematics scene',
        'data-camera-projection-mode': cameraProjectionMode,
        'data-reset-version': resetVersion,
      }),
  }
})

describe('SimulationShell playback continuity', () => {
  it('preserves the playback reset version when committing parameter changes', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <SimulationShell />
      </ThemeProvider>,
    )

    expect(readPendulumResetVersion()).toBe('0')

    const lengthInput = screen.getByLabelText(/Comprimento \(m\)/i)

    fireEvent.change(lengthInput, {
      target: { value: '2' },
    })
    fireEvent.blur(lengthInput)

    expect(readPendulumResetVersion()).toBe('0')

    const durationInput = screen.getByLabelText(/Horizonte calculado \(s\)/i)

    fireEvent.change(durationInput, {
      target: { value: '45' },
    })
    fireEvent.blur(durationInput)

    expect(readPendulumResetVersion()).toBe('0')

    fireEvent.click(screen.getByLabelText(/Resetar simulacao/i))

    expect(readPendulumResetVersion()).toBe('1')
  })

  it('switches the viewport camera projection without resetting playback', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <SimulationShell />
      </ThemeProvider>,
    )

    expect(readPendulumProjectionMode()).toBe('perspective')
    expect(readPendulumResetVersion()).toBe('0')
    expect(screen.getByRole('button', { name: /Camera em perspectiva/i }))
      .toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: /Camera ortogonal/i }))

    expect(readPendulumProjectionMode()).toBe('orthographic')
    expect(readPendulumResetVersion()).toBe('0')
    expect(screen.getByRole('button', { name: /Camera ortogonal/i }))
      .toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(
      screen.getByRole('button', { name: /Camera em perspectiva/i }),
    )

    expect(readPendulumProjectionMode()).toBe('perspective')
    expect(readPendulumResetVersion()).toBe('0')
  })

  it('resizes sidebar, viewport, and focused chart panes without resetting playback', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <SimulationShell />
      </ThemeProvider>,
    )

    const sidebarHandle = screen.getByRole('separator', {
      hidden: true,
      name: /Redimensionar sidebar do catalogo/i,
    })
    const viewportHeightHandle = screen.getByRole('separator', {
      hidden: true,
      name: /Redimensionar altura da viewport/i,
    })

    expect(readPendulumResetVersion()).toBe('0')
    expect(sidebarHandle).toHaveAttribute('aria-valuenow', '288')
    expect(viewportHeightHandle).toHaveAttribute('aria-valuenow', '720')

    fireEvent.keyDown(sidebarHandle, { key: 'ArrowRight' })
    fireEvent.keyDown(viewportHeightHandle, { key: 'ArrowDown' })

    expect(sidebarHandle).toHaveAttribute('aria-valuenow', '304')
    expect(viewportHeightHandle).toHaveAttribute('aria-valuenow', '744')
    expect(readPendulumResetVersion()).toBe('0')

    fireEvent.click(screen.getByRole('button', { name: /Abrir Graficos/i }))
    fireEvent.click(
      screen.getByRole('button', {
        name: /Mostrar Angulo do pendulo por tempo ao lado da simulacao/i,
      }),
    )

    const focusedChartWidthHandle = screen.getByRole('separator', {
      hidden: true,
      name: /Redimensionar largura do grafico em foco/i,
    })
    const focusedChartHeightHandle = screen.getByRole('separator', {
      hidden: true,
      name: /Redimensionar altura do grafico em foco/i,
    })

    expect(focusedChartWidthHandle).toHaveAttribute('aria-valuenow', '34')
    expect(focusedChartHeightHandle).toHaveAttribute('aria-valuenow', '260')

    fireEvent.keyDown(focusedChartWidthHandle, { key: 'ArrowRight' })
    fireEvent.keyDown(focusedChartHeightHandle, { key: 'ArrowDown' })

    expect(focusedChartWidthHandle).toHaveAttribute('aria-valuenow', '38')
    expect(focusedChartHeightHandle).toHaveAttribute('aria-valuenow', '276')
    expect(readPendulumResetVersion()).toBe('0')
  })

  it('keeps hydrostatics playback continuity when changing object volume', () => {
    render(
      <ThemeProvider theme={appTheme}>
        <SimulationShell />
      </ThemeProvider>,
    )

    fireEvent.click(
      screen.getByRole('button', { name: /Alternar area Mecanica/i }),
    )
    fireEvent.click(
      screen.getByRole('button', {
        name: /Alternar subarea Fluidos basicos/i,
      }),
    )
    fireEvent.click(
      screen.getByRole('button', { name: /Hidrostatica e empuxo/i }),
    )

    expect(readKinematicsResetVersion()).toBe('1')

    const volumeInput = screen.getByLabelText(/Volume do corpo \(m\^3\)/i)

    fireEvent.change(volumeInput, {
      target: { value: '0.2' },
    })
    fireEvent.blur(volumeInput)

    expect(readKinematicsResetVersion()).toBe('1')
  })
})

function readPendulumResetVersion() {
  return screen
    .getByLabelText(/mock pendulum scene/i)
    .getAttribute('data-reset-version')
}

function readPendulumProjectionMode() {
  return screen
    .getByLabelText(/mock pendulum scene/i)
    .getAttribute('data-camera-projection-mode')
}

function readKinematicsResetVersion() {
  return screen
    .getByLabelText(/mock kinematics scene/i)
    .getAttribute('data-reset-version')
}
