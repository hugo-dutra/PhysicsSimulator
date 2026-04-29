import { describe, expect, it } from 'vitest'
import {
  activeSimulation,
  findSimulation,
  getAreaForSimulation,
  pendulumFixture,
  simulationCatalog,
} from './catalog'

describe('simulation registry', () => {
  it('registers the simple pendulum as the available core simulation', () => {
    expect(activeSimulation.id).toBe('simple-pendulum')
    expect(activeSimulation.status).toBe('available')
    expect(activeSimulation.topicPath).toEqual([
      'Mecanica',
      'Oscilacoes',
      'Pendulo simples',
    ])
    expect(getAreaForSimulation('simple-pendulum').id).toBe('mechanics')
  })

  it('keeps planned catalog items separate from the available simulation', () => {
    const allSimulations = simulationCatalog.areas.flatMap(
      (area) => area.simulations,
    )

    expect(allSimulations.filter((item) => item.status === 'available')).toHaveLength(
      1,
    )
    expect(allSimulations.some((item) => item.status === 'planned')).toBe(true)
    expect(findSimulation('projectile-motion').status).toBe('planned')
  })

  it('declares pendulum parameters, presets, limits, and formulas', () => {
    expect(pendulumFixture.parameters.map((parameter) => parameter.id)).toEqual([
      'lengthMeters',
      'massKilograms',
      'gravityMetersPerSecondSquared',
      'initialAngleRadians',
      'initialAngularVelocityRadiansPerSecond',
      'dampingPerSecond',
    ])
    expect(pendulumFixture.presets.length).toBeGreaterThan(0)
    expect(pendulumFixture.limits.length).toBeGreaterThan(0)
    expect(pendulumFixture.formulas.length).toBeGreaterThan(0)
  })
})
