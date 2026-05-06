import { describe, expect, it } from 'vitest'
import type { SimulationDefinition } from '../../simulation-registry/types'
import {
  getModelKindLabel,
  getSimulationSubarea,
  getStatusChipColor,
  getStatusLabel,
  getSubareaKey,
  groupSimulationsBySubarea,
  isRunnableSimulation,
  shouldStartExpanded,
  slugify,
} from './simulationSidebarModel'

describe('simulation sidebar model', () => {
  it('groups simulations by their second topic path segment in catalog order', () => {
    const pendulum = makeSimulation({
      id: 'simple-pendulum',
      topicPath: ['Mecanica', 'Oscilacoes'],
    })
    const inclinedPlane = makeSimulation({
      id: 'inclined-plane-friction',
      topicPath: ['Mecanica', 'Dinamica'],
    })
    const massSpring = makeSimulation({
      id: 'mass-spring',
      topicPath: ['Mecanica', 'Oscilacoes'],
    })
    const general = makeSimulation({
      id: 'general-demo',
      topicPath: ['Mecanica'],
    })

    const groups = groupSimulationsBySubarea([
      pendulum,
      inclinedPlane,
      massSpring,
      general,
    ])

    expect(
      groups.map((group) => ({
        ids: group.simulations.map((simulation) => simulation.id),
        label: group.label,
      })),
    ).toEqual([
      { ids: ['simple-pendulum', 'mass-spring'], label: 'Oscilacoes' },
      { ids: ['inclined-plane-friction'], label: 'Dinamica' },
      { ids: ['general-demo'], label: 'Geral' },
    ])
  })

  it('keeps sidebar ids and fallback subarea names stable', () => {
    expect(getSimulationSubarea(makeSimulation({ topicPath: ['Mecanica'] })))
      .toBe('Geral')
    expect(getSubareaKey('mechanics', 'Oscilacoes')).toBe(
      'mechanics:Oscilacoes',
    )
    expect(slugify('Fluidos basicos / press\u00e3o')).toBe(
      'fluidos-basicos-pressao',
    )
  })

  it('maps statuses and model kinds to compact Portuguese labels', () => {
    expect(getStatusLabel('ready')).toBe('pronto')
    expect(getStatusLabel('analysis')).toBe('analise')
    expect(getStatusLabel('planned')).toBe('planejado')

    expect(getStatusChipColor('ready')).toBe('primary')
    expect(getStatusChipColor('analysis')).toBe('warning')
    expect(getStatusChipColor('planned')).toBe('default')
    expect(
      new Set([
        getStatusChipColor('ready'),
        getStatusChipColor('analysis'),
        getStatusChipColor('planned'),
      ]).size,
    ).toBe(3)

    expect(getModelKindLabel('analytic')).toBe('analitico')
    expect(getModelKindLabel('field-sampling')).toBe('campo')
    expect(getModelKindLabel('hybrid')).toBe('hibrido')
    expect(getModelKindLabel('numerical')).toBe('numerico')
    expect(getModelKindLabel('particle-demo')).toBe('particulas')
  })

  it('exposes only analysis and ready simulations as runnable', () => {
    const analysis = makeSimulation({ status: 'analysis' })
    const planned = makeSimulation({ status: 'planned' })
    const ready = makeSimulation({ status: 'ready' })

    expect(isRunnableSimulation(analysis)).toBe(true)
    expect(isRunnableSimulation(ready)).toBe(true)
    expect(isRunnableSimulation(planned)).toBe(false)

    expect(shouldStartExpanded(analysis)).toBe(true)
    expect(shouldStartExpanded(ready)).toBe(false)
    expect(shouldStartExpanded(planned)).toBe(false)
  })
})

function makeSimulation(
  overrides: Partial<SimulationDefinition>,
): SimulationDefinition {
  return {
    areaId: 'mechanics',
    description: 'Fixture de teste para o modelo da sidebar.',
    id: 'test-simulation',
    level: 'introductory',
    modelKind: 'analytic',
    renderer: 'three',
    status: 'planned',
    title: 'Simulacao de teste',
    topicPath: ['Mecanica', 'Dinamica'],
    ...overrides,
  }
}
