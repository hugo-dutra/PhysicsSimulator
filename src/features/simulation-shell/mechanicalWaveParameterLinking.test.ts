import { describe, expect, it } from 'vitest'
import type { SimulationParameter } from '../../simulation-registry/types'
import {
  linkSuperpositionInterferenceParameterValues,
  linkWaveOnStringParameterValues,
} from './mechanicalWaveParameterLinking'

const waveParameters = [
  {
    id: 'wavelengthMeters',
    label: 'Comprimento de onda',
    description: 'lambda',
    kind: 'number',
    min: 0.6,
    max: 6,
    step: 0.05,
    defaultValue: 2.4,
  },
  {
    id: 'frequencyHertz',
    label: 'Frequencia',
    description: 'f',
    kind: 'number',
    min: 0,
    max: 4,
    step: 0.05,
    defaultValue: 0.7,
  },
] satisfies SimulationParameter[]

describe('wave-on-string parameter linking', () => {
  it('keeps wavelength inversely linked when frequency changes in string mode', () => {
    const values = linkWaveOnStringParameterValues({
      changedParameterId: 'frequencyHertz',
      parameterDefinitions: waveParameters,
      values: {
        frequencyHertz: 0.4,
        linearDensityKilogramsPerMeter: 0.025,
        speedModel: 'string-properties',
        tensionNewtons: 0.07056,
        wavelengthMeters: 2.4,
      },
    })

    expect(values.wavelengthMeters).toBeCloseTo(4.2)
  })

  it('keeps frequency inversely linked when wavelength changes in string mode', () => {
    const values = linkWaveOnStringParameterValues({
      changedParameterId: 'wavelengthMeters',
      parameterDefinitions: waveParameters,
      values: {
        frequencyHertz: 0.4,
        linearDensityKilogramsPerMeter: 0.025,
        speedModel: 'string-properties',
        tensionNewtons: 0.07056,
        wavelengthMeters: 2.2,
      },
    })

    expect(values.frequencyHertz).toBeCloseTo(1.68 / 2.2)
  })

  it('keeps a zero-frequency profile static when wavelength changes', () => {
    const values = linkWaveOnStringParameterValues({
      changedParameterId: 'wavelengthMeters',
      parameterDefinitions: waveParameters,
      values: {
        frequencyHertz: 0,
        linearDensityKilogramsPerMeter: 0.025,
        speedModel: 'string-properties',
        tensionNewtons: 0.07056,
        wavelengthMeters: 2.2,
      },
    })

    expect(values.frequencyHertz).toBe(0)
    expect(values.wavelengthMeters).toBe(2.2)
  })
})

describe('superposition-interference parameter linking', () => {
  it('keeps wavelength inversely linked to frequency using the current medium speed', () => {
    const values = linkSuperpositionInterferenceParameterValues({
      changedParameterId: 'frequencyHertz',
      parameterDefinitions: waveParameters,
      previousValues: {
        frequencyHertz: 0.65,
        wavelengthMeters: 2,
      },
      values: {
        frequencyHertz: 1.3,
        wavelengthMeters: 2,
      },
    })

    expect(values.wavelengthMeters).toBeCloseTo(1)
  })

  it('keeps frequency inversely linked to wavelength using the current medium speed', () => {
    const values = linkSuperpositionInterferenceParameterValues({
      changedParameterId: 'wavelengthMeters',
      parameterDefinitions: waveParameters,
      previousValues: {
        frequencyHertz: 0.65,
        wavelengthMeters: 2,
      },
      values: {
        frequencyHertz: 0.65,
        wavelengthMeters: 2.6,
      },
    })

    expect(values.frequencyHertz).toBeCloseTo(0.5)
  })
})
