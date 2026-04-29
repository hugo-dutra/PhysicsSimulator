import catalogJson from '../../fixtures/simulations/catalog.json'
import inclinedPlaneFixtureJson from '../../fixtures/simulations/mechanics-inclined-plane-friction.json'
import pendulumFixtureJson from '../../fixtures/simulations/mechanics-pendulum.json'
import projectileMotionFixtureJson from '../../fixtures/simulations/mechanics-projectile-motion.json'
import uniformCircularMotionFixtureJson from '../../fixtures/simulations/mechanics-uniform-circular-motion.json'
import uniformLinearMotionFixtureJson from '../../fixtures/simulations/mechanics-uniform-linear-motion.json'
import uniformlyAcceleratedMotionFixtureJson from '../../fixtures/simulations/mechanics-uniformly-accelerated-motion.json'
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
  'projectile-motion': projectileMotionFixtureJson as SimulationFixture,
  'uniform-circular-motion':
    uniformCircularMotionFixtureJson as SimulationFixture,
  'uniform-linear-motion': uniformLinearMotionFixtureJson as SimulationFixture,
  'uniformly-accelerated-motion':
    uniformlyAcceleratedMotionFixtureJson as SimulationFixture,
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
