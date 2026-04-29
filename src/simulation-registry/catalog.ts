import catalogJson from '../../fixtures/simulations/catalog.json'
import inclinedPlaneFixtureJson from '../../fixtures/simulations/mechanics-inclined-plane-friction.json'
import pendulumFixtureJson from '../../fixtures/simulations/mechanics-pendulum.json'
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
