import catalogJson from '../../fixtures/simulations/catalog.json'
import atwoodMachineFixtureJson from '../../fixtures/simulations/mechanics-atwood-machine.json'
import centripetalForceCurveFixtureJson from '../../fixtures/simulations/mechanics-centripetal-force-curve.json'
import collisionsFixtureJson from '../../fixtures/simulations/mechanics-collisions-1d-2d.json'
import continuityBernoulliFixtureJson from '../../fixtures/simulations/mechanics-continuity-bernoulli.json'
import coupledOscillatorsFixtureJson from '../../fixtures/simulations/waves-coupled-oscillators.json'
import dampedOscillatorFixtureJson from '../../fixtures/simulations/waves-damped-oscillator.json'
import forcedOscillatorResonanceFixtureJson from '../../fixtures/simulations/waves-forced-oscillator-resonance.json'
import gravitationalFieldOrbitsFixtureJson from '../../fixtures/simulations/mechanics-gravitational-field-orbits.json'
import hydrostaticsBuoyancyFixtureJson from '../../fixtures/simulations/mechanics-hydrostatics-buoyancy.json'
import inclinedPlaneFixtureJson from '../../fixtures/simulations/mechanics-inclined-plane-friction.json'
import massSpringFixtureJson from '../../fixtures/simulations/mechanics-mass-spring.json'
import particleEquilibriumFixtureJson from '../../fixtures/simulations/mechanics-particle-equilibrium.json'
import pendulumFixtureJson from '../../fixtures/simulations/mechanics-pendulum.json'
import projectileMotionFixtureJson from '../../fixtures/simulations/mechanics-projectile-motion.json'
import rigidBodyRotationFixtureJson from '../../fixtures/simulations/mechanics-rigid-body-rotation.json'
import rollingWithoutSlippingFixtureJson from '../../fixtures/simulations/mechanics-rolling-without-slipping.json'
import torqueLeversCenterMassFixtureJson from '../../fixtures/simulations/mechanics-torque-levers-center-mass.json'
import uniformCircularMotionFixtureJson from '../../fixtures/simulations/mechanics-uniform-circular-motion.json'
import uniformLinearMotionFixtureJson from '../../fixtures/simulations/mechanics-uniform-linear-motion.json'
import uniformlyAcceleratedMotionFixtureJson from '../../fixtures/simulations/mechanics-uniformly-accelerated-motion.json'
import workEnergyTrackFixtureJson from '../../fixtures/simulations/mechanics-work-energy-track.json'
import type { KinematicsSimulationId } from '../lib/physics/kinematics'
import type {
  KnowledgeArea,
  SimulationCatalog,
  SimulationDefinition,
  SimulationFixture,
} from './types'

export const simulationCatalog = catalogJson as SimulationCatalog

export const pendulumFixture = pendulumFixtureJson as SimulationFixture

export const inclinedPlaneFixture =
  inclinedPlaneFixtureJson as SimulationFixture

export const kinematicsFixtures = {
  'atwood-machine': atwoodMachineFixtureJson as SimulationFixture,
  'centripetal-force-curve':
    centripetalForceCurveFixtureJson as SimulationFixture,
  'collisions-1d-2d': collisionsFixtureJson as SimulationFixture,
  'continuity-bernoulli': continuityBernoulliFixtureJson as SimulationFixture,
  'coupled-oscillators': coupledOscillatorsFixtureJson as SimulationFixture,
  'damped-oscillator': dampedOscillatorFixtureJson as SimulationFixture,
  'forced-oscillator-resonance':
    forcedOscillatorResonanceFixtureJson as SimulationFixture,
  'gravitational-field-orbits':
    gravitationalFieldOrbitsFixtureJson as SimulationFixture,
  'hydrostatics-buoyancy':
    hydrostaticsBuoyancyFixtureJson as SimulationFixture,
  'mass-spring': massSpringFixtureJson as SimulationFixture,
  'particle-equilibrium': particleEquilibriumFixtureJson as SimulationFixture,
  'projectile-motion': projectileMotionFixtureJson as SimulationFixture,
  'rigid-body-rotation': rigidBodyRotationFixtureJson as SimulationFixture,
  'rolling-without-slipping':
    rollingWithoutSlippingFixtureJson as SimulationFixture,
  'torque-levers-center-mass':
    torqueLeversCenterMassFixtureJson as SimulationFixture,
  'uniform-circular-motion':
    uniformCircularMotionFixtureJson as SimulationFixture,
  'uniform-linear-motion': uniformLinearMotionFixtureJson as SimulationFixture,
  'uniformly-accelerated-motion':
    uniformlyAcceleratedMotionFixtureJson as SimulationFixture,
  'work-energy-track': workEnergyTrackFixtureJson as SimulationFixture,
} satisfies Record<KinematicsSimulationId, SimulationFixture>

export const activeSimulationId = 'simple-pendulum'

export const activeSimulation = findSimulation(activeSimulationId)

export function findSimulation(
  simulationId: string,
  catalog: SimulationCatalog = simulationCatalog,
): SimulationDefinition {
  for (const area of catalog.areas) {
    const simulation = area.simulations.find((item) => item.id === simulationId)

    if (simulation) {
      return simulation
    }
  }

  throw new Error(`Simulation not found: ${simulationId}`)
}

export function getAreaForSimulation(
  simulationId: string,
  catalog: SimulationCatalog = simulationCatalog,
): KnowledgeArea {
  for (const area of catalog.areas) {
    if (area.simulations.some((simulation) => simulation.id === simulationId)) {
      return area
    }
  }

  throw new Error(`Area not found for simulation: ${simulationId}`)
}
