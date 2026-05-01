import { describe, expect, it } from 'vitest'
import {
  activeSimulation,
  findSimulation,
  getAreaForSimulation,
  inclinedPlaneFixture,
  kinematicsFixtures,
  pendulumFixture,
  simulationCatalog,
} from './catalog'
import type { SimulationFixture } from './types'

describe('simulation registry', () => {
  it('registers the simple pendulum as the ready core simulation', () => {
    expect(activeSimulation.id).toBe('simple-pendulum')
    expect(activeSimulation.status).toBe('ready')
    expect(activeSimulation.topicPath).toEqual([
      'Mecanica',
      'Oscilacoes',
      'Pendulo simples',
    ])
    expect(getAreaForSimulation('simple-pendulum').id).toBe('mechanics')
  })

  it('keeps planned catalog items separate from runnable simulations', () => {
    const allSimulations = simulationCatalog.areas.flatMap(
      (area) => area.simulations,
    )

    expect(allSimulations).toHaveLength(51)
    expect(
      allSimulations.filter((item) => item.status === 'analysis'),
    ).toHaveLength(8)
    expect(
      allSimulations.filter((item) => item.status === 'ready'),
    ).toHaveLength(9)
    expect(allSimulations.some((item) => item.status === 'planned')).toBe(true)
    expect(findSimulation('inclined-plane-friction').status).toBe('ready')
    expect(findSimulation('projectile-motion').status).toBe('ready')
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

  it('declares the inclined plane as the second mechanics simulation ready', () => {
    const inclinedPlane = findSimulation('inclined-plane-friction')

    expect(inclinedPlane.status).toBe('ready')
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

  it('declares the approved kinematics simulations as ready', () => {
    const readyKinematicsSimulationIds = [
      'uniform-linear-motion',
      'uniformly-accelerated-motion',
      'projectile-motion',
      'atwood-machine',
      'centripetal-force-curve',
      'work-energy-track',
      'collisions-1d-2d',
    ] as const

    readyKinematicsSimulationIds.forEach((simulationId) => {
      const simulation = findSimulation(simulationId)
      const fixture = kinematicsFixtures[simulationId]

      expect(simulation.status).toBe('ready')
      expect(simulation.topicPath[0]).toBe('Mecanica')
      expect(simulation.technologyPlan?.engine).toBe('custom-analytic')
      expect(simulation.technologyPlan?.charting).toBe('live-canvas')
      expect(fixture.simulationId).toBe(simulationId)
      expect(fixture.runtimeParameters.map((parameter) => parameter.id)).toEqual([
        'durationSeconds',
        'chartWindowSeconds',
      ])
      expect(fixture.parameters.length).toBeGreaterThan(0)
      expect(fixture.presets.length).toBeGreaterThan(0)
      expect(fixture.limits.length).toBeGreaterThan(0)
      expect(fixture.formulas.length).toBeGreaterThan(0)
    })
  })

  it('declares the remaining shared analytic mechanics simulations as in analysis', () => {
    const kinematicsSimulationIds = [
      'continuity-bernoulli',
      'gravitational-field-orbits',
      'hydrostatics-buoyancy',
      'particle-equilibrium',
      'rigid-body-rotation',
      'rolling-without-slipping',
      'torque-levers-center-mass',
      'uniform-circular-motion',
    ] as const

    kinematicsSimulationIds.forEach((simulationId) => {
      const simulation = findSimulation(simulationId)
      const fixture = kinematicsFixtures[simulationId]

      expect(simulation.status).toBe('analysis')
      expect(simulation.topicPath[0]).toBe('Mecanica')
      expect(simulation.technologyPlan?.engine).toBe('custom-analytic')
      expect(simulation.technologyPlan?.charting).toBe('live-canvas')
      expect(fixture.simulationId).toBe(simulationId)
      expect(fixture.runtimeParameters.map((parameter) => parameter.id)).toEqual([
        'durationSeconds',
        'chartWindowSeconds',
      ])
      expect(fixture.parameters.length).toBeGreaterThan(0)
      expect(fixture.presets.length).toBeGreaterThan(0)
      expect(fixture.limits.length).toBeGreaterThan(0)
      expect(fixture.formulas.length).toBeGreaterThan(0)
    })
  })

  it('requires help descriptions for every runnable simulation parameter', () => {
    const fixtureEntries = [
      ['simple-pendulum', pendulumFixture],
      ['inclined-plane-friction', inclinedPlaneFixture],
      ...Object.entries(kinematicsFixtures),
    ] satisfies Array<[string, SimulationFixture]>

    fixtureEntries.forEach(([simulationId, fixture]) => {
      const controls = [
        ...fixture.runtimeParameters,
        ...fixture.parameters,
      ]

      controls.forEach((parameter) => {
        expect(
          parameter.description,
          `${simulationId}.${parameter.id} must declare tooltip help`,
        ).toEqual(expect.any(String))
        expect(parameter.description.trim().length).toBeGreaterThan(40)
      })
    })
  })
})
