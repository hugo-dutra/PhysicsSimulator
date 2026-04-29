import { describe, expect, it } from 'vitest'
import {
  activeSimulation,
  findSimulation,
  getAreaForSimulation,
  inclinedPlaneFixture,
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

    expect(allSimulations).toHaveLength(51)
    expect(
      allSimulations.filter((item) => item.status === 'available'),
    ).toHaveLength(2)
    expect(allSimulations.some((item) => item.status === 'planned')).toBe(true)
    expect(findSimulation('inclined-plane-friction').status).toBe('available')
    expect(findSimulation('projectile-motion').status).toBe('planned')
  })

  it('exposes the planned curriculum by area and subarea', () => {
    const simulationsByArea = new Map(
      simulationCatalog.areas.map((area) => [area.id, area.simulations]),
    )

    expect(simulationsByArea.get('mechanics')).toHaveLength(17)
    expect(simulationsByArea.get('thermodynamics')).toHaveLength(10)
    expect(simulationsByArea.get('waves')).toHaveLength(12)
    expect(simulationsByArea.get('electromagnetism')).toHaveLength(12)
    expect(findSimulation('continuity-bernoulli').topicPath).toEqual([
      'Mecanica',
      'Fluidos basicos',
      'Continuidade e Bernoulli',
    ])
    expect(findSimulation('carnot-cycle').topicPath).toEqual([
      'Termodinamica',
      'Segunda lei',
      'Ciclo de Carnot',
    ])
    expect(findSimulation('standing-waves').topicPath).toEqual([
      'Oscilacoes e Ondas',
      'Ondas mecanicas',
      'Ondas estacionarias',
    ])
    expect(findSimulation('phasors-ac-power').topicPath).toEqual([
      'Eletromagnetismo',
      'Circuitos AC',
      'Fasores e potencia AC',
    ])
  })

  it('declares pendulum parameters, presets, limits, and formulas', () => {
    expect(pendulumFixture.runtimeParameters.map((parameter) => parameter.id)).toEqual([
      'durationSeconds',
      'chartWindowSeconds',
    ])
    expect(pendulumFixture.durationSeconds).toBe(30)
    expect(pendulumFixture.sampleRateHz).toBe(120)
    expect(pendulumFixture.chartWindowSeconds).toBe(12)
    expect(activeSimulation.technologyPlan?.charting).toBe('live-canvas')
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

  it('declares the inclined plane as the second available mechanics simulation', () => {
    const inclinedPlane = findSimulation('inclined-plane-friction')

    expect(inclinedPlane.topicPath).toEqual([
      'Mecanica',
      'Dinamica',
      'Plano inclinado com atrito',
    ])
    expect(inclinedPlane.technologyPlan?.engine).toBe('custom-analytic')
    expect(inclinedPlane.technologyPlan?.charting).toBe('live-canvas')
    expect(inclinedPlaneFixture.simulationId).toBe('inclined-plane-friction')
    expect(inclinedPlaneFixture.runtimeParameters.map((parameter) => parameter.id)).toEqual([
      'durationSeconds',
      'chartWindowSeconds',
    ])
    expect(inclinedPlaneFixture.parameters.map((parameter) => parameter.id)).toEqual([
      'planeAngleDegrees',
      'blockMassKilograms',
      'gravityMetersPerSecondSquared',
      'frictionCoefficient',
      'initialPositionMeters',
      'initialVelocityMetersPerSecond',
      'planeLengthMeters',
    ])
    expect(inclinedPlaneFixture.presets.length).toBeGreaterThan(0)
    expect(inclinedPlaneFixture.limits.length).toBeGreaterThan(0)
    expect(inclinedPlaneFixture.formulas.length).toBeGreaterThan(0)
  })
})
