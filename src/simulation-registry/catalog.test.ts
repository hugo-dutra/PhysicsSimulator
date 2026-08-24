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

const runnableSimulationFixtures = [
  ['simple-pendulum', pendulumFixture],
  ['inclined-plane-friction', inclinedPlaneFixture],
  ...Object.entries(kinematicsFixtures),
] satisfies Array<[string, SimulationFixture]>

describe('simulation registry', () => {
  it('registers the simple pendulum as the ready core simulation', () => {
    expect(activeSimulation.id).toBe('simple-pendulum')
    expect(activeSimulation.status).toBe('ready')
    expect(activeSimulation.topicPath).toEqual([
      'Oscilacoes e Ondas',
      'Oscilacoes',
      'Pendulo simples',
    ])
    expect(getAreaForSimulation('simple-pendulum').id).toBe('waves')
  })

  it('keeps planned catalog items separate from runnable simulations', () => {
    const allSimulations = simulationCatalog.areas.flatMap(
      (area) => area.simulations,
    )

    expect(allSimulations).toHaveLength(53)
    expect(
      allSimulations.filter((item) => item.status === 'analysis'),
    ).toHaveLength(5)
    expect(
      allSimulations.filter((item) => item.status === 'ready'),
    ).toHaveLength(26)
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
    expect(simulationsByArea.get('waves')).toHaveLength(14)
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
      expect(simulation.topicPath[0]).toBe(
        simulationId === 'mass-spring' ? 'Oscilacoes e Ondas' : 'Mecanica',
      )
      expect(simulation.technologyPlan?.engine).toBe('custom-analytic')
      expect(simulation.technologyPlan?.charting).toBe('live-canvas')
      expect(fixture.simulationId).toBe(simulationId)
      const expectedRuntimeParameterIds = [
        'durationSeconds',
        'chartWindowSeconds',
      ]

      expect(fixture.runtimeParameters.map((parameter) => parameter.id)).toEqual([
        ...expectedRuntimeParameterIds,
      ])
      expect(fixture.parameters.length).toBeGreaterThan(0)
      expect(fixture.presets.length).toBeGreaterThan(0)
      expect(fixture.limits.length).toBeGreaterThan(0)
      expect(fixture.formulas.length).toBeGreaterThan(0)
    })
  })

  it('keeps the spacetime-fabric gravity simulation ready after visual approval', () => {
    const simulation = findSimulation('gravitational-field-orbits')
    const fixture = kinematicsFixtures['gravitational-field-orbits']

    expect(simulation.status).toBe('ready')
    expect(simulation.topicPath).toEqual([
      'Mecanica',
      'Gravitacao',
      'Campo gravitacional e orbitas',
    ])
    expect(fixture.parameters.map((parameter) => parameter.id)).toContain(
      'fabricDeformationScale',
    )
    const fabricLineOpacity = fixture.parameters.find(
      (parameter) => parameter.id === 'fabricLineOpacity',
    )

    expect(fabricLineOpacity).toMatchObject({
      defaultValue: 0.6,
      max: 1,
      min: 0,
    })
    expect(fixture.parameters.map((parameter) => parameter.id)).toContain(
      'orbitingBodyWellAmplification',
    )
    expect(fixture.runtimeParameters.map((parameter) => parameter.id)).toEqual([
      'durationSeconds',
      'chartWindowSeconds',
      'modelTimeScale',
    ])
    expect(fixture.formulas.map((formula) => formula.id)).toContain(
      'fabric-visual-mapping',
    )
  })

  it('declares the volumetric gravity lattice as a separate analysis simulation', () => {
    const simulation = findSimulation('gravitational-space-lattice')
    const fixture = kinematicsFixtures['gravitational-space-lattice']

    expect(simulation.status).toBe('analysis')
    expect(simulation.topicPath).toEqual([
      'Mecanica',
      'Gravitacao',
      'Curvatura gravitacional em malha 3D',
    ])
    expect(simulation.modelKind).toBe('hybrid')
    expect(fixture.simulationId).toBe('gravitational-space-lattice')
    expect(fixture.parameters.map((parameter) => parameter.id)).toEqual([
      'centralMassEarths',
      'orbitalRadiusKilometers',
      'eccentricity',
      'satelliteMassKilograms',
      'initialAngleDegrees',
      'fabricDeformationScale',
      'fabricLineOpacity',
      'latticeDensityMultiplier',
      'orbitingBodyWellAmplification',
      'orbitingBodyVisible',
      'orbitTrailVisible',
      'lightBeamEnabled',
      'lightBeamPlane',
      'lightBeamOffsetUCells',
      'lightBeamOffsetVCells',
      'lightBeamProgressPercent',
    ])
    expect(fixture.regimes?.map((regime) => regime.warningCode)).toContain(
      'SPACETIME_LATTICE_ANALOGY',
    )
    expect(fixture.formulas.map((formula) => formula.id)).toContain(
      'lattice-volume-mapping',
    )
    expect(
      fixture.parameters.find(
        (parameter) => parameter.id === 'centralMassEarths',
      )?.max,
    ).toBe(20)
    expect(fixture.defaultParameters.fabricLineOpacity).toBe(0.25)
    expect(fixture.defaultParameters.latticeDensityMultiplier).toBe(1)
    expect(
      fixture.parameters.find(
        (parameter) => parameter.id === 'fabricLineOpacity',
      )?.defaultValue,
    ).toBe(0.25)
    expect(
      fixture.parameters.find(
        (parameter) => parameter.id === 'latticeDensityMultiplier',
      ),
    ).toMatchObject({
      defaultValue: 1,
      max: 10,
      min: 1,
      step: 1,
    })
    expect(fixture.defaultParameters.lightBeamEnabled).toBe(false)
    expect(fixture.defaultParameters.lightBeamPlane).toBe('yz')
    expect(fixture.defaultParameters.lightBeamOffsetUCells).toBe(0)
    expect(fixture.defaultParameters.lightBeamOffsetVCells).toBe(2)
    expect(fixture.defaultParameters.lightBeamProgressPercent).toBe(100)
    expect(fixture.defaultParameters.orbitingBodyVisible).toBe(true)
    expect(fixture.defaultParameters.orbitTrailVisible).toBe(true)
    expect(
      fixture.parameters.find(
        (parameter) => parameter.id === 'lightBeamEnabled',
      )?.defaultValue,
    ).toBe(false)
    expect(
      fixture.parameters.find(
        (parameter) => parameter.id === 'lightBeamPlane',
      )?.defaultValue,
    ).toBe('yz')
    expect(
      fixture.parameters.find(
        (parameter) => parameter.id === 'orbitingBodyVisible',
      )?.defaultValue,
    ).toBe(true)
    expect(
      fixture.parameters.find(
        (parameter) => parameter.id === 'orbitTrailVisible',
      )?.defaultValue,
    ).toBe(true)
  })

  it('declares the approved Fase 4 oscillators and mechanical waves as ready', () => {
    const readyWaveIds = [
      'damped-oscillator',
      'forced-oscillator-resonance',
      'coupled-oscillators',
      'wave-on-string',
      'superposition-interference',
      'standing-waves',
    ] as const

    readyWaveIds.forEach((simulationId) => {
      const simulation = findSimulation(simulationId)
      const fixture = kinematicsFixtures[simulationId]

      expect(simulation.status).toBe('ready')
      expect(simulation.topicPath[0]).toBe('Oscilacoes e Ondas')
      expect(simulation.fixturePath).toBeDefined()
      expect(simulation.theoryPath).toBeDefined()
      expect(fixture.simulationId).toBe(simulationId)
      expect(fixture.regimes?.length).toBeGreaterThan(0)
      expect(fixture.formulas.length).toBeGreaterThan(0)
    })
  })

  it('declares the longitudinal spring wave as an analysis simulation', () => {
    const simulation = findSimulation('longitudinal-wave')
    const fixture = kinematicsFixtures['longitudinal-wave']

    expect(simulation.status).toBe('analysis')
    expect(simulation.topicPath).toEqual([
      'Oscilacoes e Ondas',
      'Ondas mecanicas',
      'Onda longitudinal em mola',
    ])
    expect(simulation.renderer).toBe('three')
    expect(simulation.fixturePath).toBeDefined()
    expect(simulation.theoryPath).toBeDefined()
    expect(fixture.simulationId).toBe('longitudinal-wave')
    expect(fixture.regimes?.length).toBeGreaterThan(0)
    expect(fixture.formulas.map((formula) => formula.id)).toContain(
      'compression-force',
    )
    expect(fixture.defaultParameters.springCoilTurns).toBe(54)
    expect(fixture.parameters.map((parameter) => parameter.id)).toContain(
      'springCoilTurns',
    )
  })

  it('declares the approved sound simulations as ready items', () => {
    const readySoundIds = ['beats', 'doppler-effect'] as const

    readySoundIds.forEach((simulationId) => {
      const simulation = findSimulation(simulationId)
      const fixture = kinematicsFixtures[simulationId]

      expect(simulation.status).toBe('ready')
      expect(simulation.topicPath).toEqual([
        'Oscilacoes e Ondas',
        'Som',
        simulationId === 'beats' ? 'Batimentos' : 'Efeito Doppler',
      ])
      expect(simulation.renderer).toBe('three')
      expect(simulation.fixturePath).toBeDefined()
      expect(simulation.theoryPath).toBeDefined()
      expect(fixture.simulationId).toBe(simulationId)
      expect(fixture.regimes?.length).toBeGreaterThan(0)
      expect(fixture.formulas.length).toBeGreaterThan(0)
    })
  })

  it('declares the optics simulations as analysis items', () => {
    const opticsSimulationTitles = {
      'lenses-mirrors': 'Lentes e espelhos',
      'light-diffraction-interference': 'Difracao e interferencia da luz',
      'reflection-refraction': 'Reflexao e refracao',
    } as const

    Object.entries(opticsSimulationTitles).forEach(
      ([simulationId, title]) => {
        const simulation = findSimulation(simulationId)
        const fixture =
          kinematicsFixtures[simulationId as keyof typeof opticsSimulationTitles]

        expect(simulation.status).toBe('analysis')
        expect(simulation.topicPath).toEqual([
          'Oscilacoes e Ondas',
          'Optica',
          title,
        ])
        expect(simulation.renderer).toBe('three')
        expect(simulation.fixturePath).toBeDefined()
        expect(simulation.theoryPath).toBeDefined()
        expect(simulation.technologyPlan?.engine).toBe('custom-analytic')
        expect(simulation.technologyPlan?.charting).toBe('live-canvas')
        expect(fixture.simulationId).toBe(simulationId)
        expect(fixture.regimes?.length).toBeGreaterThan(0)
        expect(fixture.formulas.length).toBeGreaterThan(0)
      },
    )
  })

  it('declares fidelity gate limits and regimes for every runnable fixture', () => {
    runnableSimulationFixtures.forEach(([simulationId, fixture]) => {
      const simulation = findSimulation(simulationId)
      const regimes = fixture.regimes ?? []

      expect(['Mecanica', 'Oscilacoes e Ondas']).toContain(
        simulation.topicPath[0],
      )
      expect(['analysis', 'ready']).toContain(simulation.status)
      expect(
        fixture.limits.length,
        `${simulationId} must declare model limits and approximations`,
      ).toBeGreaterThan(0)
      fixture.limits.forEach((limit) => {
        expect(limit.trim().length).toBeGreaterThan(24)
      })
      expect(
        regimes.length,
        `${simulationId} must declare at least one physical regime`,
      ).toBeGreaterThan(0)

      regimes.forEach((regime) => {
        expect(regime.id.trim().length).toBeGreaterThan(0)
        expect(regime.label.trim().length).toBeGreaterThan(0)
        expect(regime.condition.trim().length).toBeGreaterThan(16)
        expect(regime.sampleFields.length).toBeGreaterThan(0)
        regime.sampleFields.forEach((field) => {
          expect(field.trim().length).toBeGreaterThan(0)
        })

        if (regime.transitionLimit) {
          expect(regime.transitionLimit.trim().length).toBeGreaterThan(8)
        }

        if (regime.warningCode) {
          expect(regime.warningCode.trim().length).toBeGreaterThan(0)
        }
      })
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
    runnableSimulationFixtures.forEach(([simulationId, fixture]) => {
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
