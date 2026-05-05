import { describe, expect, it } from 'vitest'
import {
  computeKinematicsSample,
  toKinematicsParameters,
} from '../lib/physics/kinematics'
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
    ).toHaveLength(0)
    expect(
      allSimulations.filter((item) => item.status === 'ready'),
    ).toHaveLength(18)
    expect(allSimulations.some((item) => item.status === 'planned')).toBe(true)
    expect(findSimulation('inclined-plane-friction').status).toBe('ready')
    expect(findSimulation('projectile-motion').status).toBe('ready')
  })

  it('exposes the planned curriculum by area and subarea', () => {
    const simulationsByArea = new Map(
      simulationCatalog.areas.map((area) => [area.id, area.simulations]),
    )

    expect(simulationsByArea.get('mechanics')).toHaveLength(18)
    expect(simulationsByArea.get('thermodynamics')).toHaveLength(10)
    expect(simulationsByArea.get('waves')).toHaveLength(11)
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
      'continuity-bernoulli',
      'gravitational-field-orbits',
      'hydrostatics-buoyancy',
      'mass-spring',
      'particle-equilibrium',
      'rigid-body-rotation',
      'rolling-without-slipping',
      'torque-levers-center-mass',
      'uniform-circular-motion',
    ] as const

    readyKinematicsSimulationIds.forEach((simulationId) => {
      const simulation = findSimulation(simulationId)
      const fixture = kinematicsFixtures[simulationId]

      expect(simulation.status).toBe('ready')
      expect(simulation.topicPath[0]).toBe('Mecanica')
      expect(simulation.technologyPlan?.engine).toBe('custom-analytic')
      expect(simulation.technologyPlan?.charting).toBe('live-canvas')
      expect(fixture.simulationId).toBe(simulationId)
      const expectedRuntimeParameterIds =
        simulationId === 'gravitational-field-orbits'
          ? ['durationSeconds', 'chartWindowSeconds', 'modelTimeScale']
          : ['durationSeconds', 'chartWindowSeconds']

      expect(fixture.runtimeParameters.map((parameter) => parameter.id)).toEqual([
        ...expectedRuntimeParameterIds,
      ])
      expect(fixture.parameters.length).toBeGreaterThan(0)
      expect(fixture.presets.length).toBeGreaterThan(0)
      expect(fixture.limits.length).toBeGreaterThan(0)
      expect(fixture.formulas.length).toBeGreaterThan(0)
    })
  })

  it('declares rigid-body rotation movable mass and constant energy controls', () => {
    const fixture = kinematicsFixtures['rigid-body-rotation']
    const parameterIds = fixture.parameters.map((parameter) => parameter.id)

    expect(fixture.defaultParameters.constantRotationalEnergy).toBe(false)
    expect(fixture.defaultParameters.slidingMassKilograms).toBe(2.4)
    expect(parameterIds).toContain('constantRotationalEnergy')
    expect(parameterIds).toContain('slidingMassKilograms')
    expect(parameterIds.indexOf('slidingMassKilograms')).toBe(
      parameterIds.indexOf('slidingMassDistanceMeters') + 1,
    )
    expect(
      fixture.parameters.find(
        (parameter) => parameter.id === 'constantRotationalEnergy',
      )?.kind,
    ).toBe('boolean')
    const movableMassParameter = fixture.parameters.find(
      (parameter) => parameter.id === 'slidingMassKilograms',
    )

    expect(movableMassParameter?.kind).toBe('number')
    expect(movableMassParameter?.min).toBe(0)
    expect(movableMassParameter?.max).toBe(50)
    expect(movableMassParameter?.unit).toBe('kg')
    expect(
      fixture.presets.every(
        (preset) => typeof preset.parameters.slidingMassKilograms === 'number',
      ),
    ).toBe(true)
    expect(
      fixture.presets.find((preset) => preset.id === 'constant-energy')
        ?.parameters.constantRotationalEnergy,
    ).toBe(true)
    expect(fixture.formulas.map((formula) => formula.id)).toContain(
      'constant-rotational-energy',
    )
    expect(
      fixture.formulas.find((formula) => formula.id === 'sliding-mass-inertia')
        ?.parameterIds,
    ).toContain('slidingMassKilograms')
    expect(
      fixture.formulas.find(
        (formula) => formula.id === 'constant-rotational-energy',
      )?.parameterIds,
    ).toContain('slidingMassKilograms')
  })

  it('starts torque levers balanced with equal default masses and arms', () => {
    const fixture = kinematicsFixtures['torque-levers-center-mass']
    const defaultParameters = fixture.defaultParameters
    const parameters = toKinematicsParameters(
      'torque-levers-center-mass',
      defaultParameters,
    )
    const sample = computeKinematicsSample(
      'torque-levers-center-mass',
      parameters,
      0,
    )

    expect(defaultParameters.leftMassKilograms).toBe(
      defaultParameters.rightMassKilograms,
    )
    expect(defaultParameters.leftArmMeters).toBe(
      defaultParameters.rightArmMeters,
    )
    expect(defaultParameters.appliedForceNewtons).toBe(0)
    expect(sample.netTorqueNewtonMeters).toBeCloseTo(0)
    expect(sample.centerOfMassMeters).toBeCloseTo(0)
    expect(sample.angleRadians).toBeCloseTo(0)
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
