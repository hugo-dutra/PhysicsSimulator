import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { describe, expect, it, vi } from 'vitest'
import { appTheme } from '../../theme/appTheme'
import { SimulationShell } from './SimulationShell'

vi.mock('./PendulumScene', async () => {
  const React = await import('react')

  return {
    PendulumScene: ({ resetVersion }: { resetVersion: number }) =>
      React.createElement('div', {
        'aria-label': 'mock pendulum scene',
        'data-reset-version': resetVersion,
      }),
  }
})

vi.mock('./InclinedPlaneScene', async () => {
  const React = await import('react')

  return {
    InclinedPlaneScene: ({ resetVersion }: { resetVersion: number }) =>
      React.createElement('div', {
        'aria-label': 'mock inclined plane scene',
        'data-reset-version': resetVersion,
      }),
  }
})

vi.mock('./KinematicsScene', async () => {
  const React = await import('react')

  return {
    KinematicsScene: ({ resetVersion }: { resetVersion: number }) =>
      React.createElement('div', {
        'aria-label': 'mock kinematics scene',
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
})

function readPendulumResetVersion() {
  return screen
    .getByLabelText(/mock pendulum scene/i)
    .getAttribute('data-reset-version')
}
