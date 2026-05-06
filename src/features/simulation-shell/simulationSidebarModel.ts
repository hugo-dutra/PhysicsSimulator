import type { KinematicsSimulationId } from '../../lib/physics/kinematics'
import type {
  SimulationDefinition,
  SimulationModelKind,
  SimulationStatus,
} from '../../simulation-registry/types'

export type RunnableSimulationId =
  | 'inclined-plane-friction'
  | 'simple-pendulum'
  | KinematicsSimulationId

export type SidebarSubarea = {
  label: string
  simulations: SimulationDefinition[]
}

export type StatusChipColor = 'default' | 'primary' | 'warning'

export function groupSimulationsBySubarea(
  simulations: SimulationDefinition[],
): SidebarSubarea[] {
  const subareas = new Map<string, SimulationDefinition[]>()

  simulations.forEach((simulation) => {
    const subarea = getSimulationSubarea(simulation)
    const currentSimulations = subareas.get(subarea) ?? []

    currentSimulations.push(simulation)
    subareas.set(subarea, currentSimulations)
  })

  return Array.from(subareas, ([label, groupedSimulations]) => ({
    label,
    simulations: groupedSimulations,
  }))
}

export function getSimulationSubarea(simulation: SimulationDefinition) {
  return simulation.topicPath[1] ?? 'Geral'
}

export function getSubareaKey(areaId: string, subarea: string) {
  return `${areaId}:${subarea}`
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getStatusLabel(status: SimulationStatus) {
  if (status === 'ready') {
    return 'pronto'
  }

  if (status === 'analysis') {
    return 'analise'
  }

  return 'planejado'
}

export function getStatusChipColor(status: SimulationStatus): StatusChipColor {
  if (status === 'ready') {
    return 'primary'
  }

  if (status === 'analysis') {
    return 'warning'
  }

  return 'default'
}

export function isRunnableSimulation(simulation: SimulationDefinition) {
  return simulation.status === 'analysis' || simulation.status === 'ready'
}

export function shouldStartExpanded(simulation: SimulationDefinition) {
  return simulation.status === 'analysis'
}

export function getModelKindLabel(modelKind: SimulationModelKind) {
  if (modelKind === 'field-sampling') {
    return 'campo'
  }

  if (modelKind === 'particle-demo') {
    return 'particulas'
  }

  if (modelKind === 'analytic') {
    return 'analitico'
  }

  if (modelKind === 'numerical') {
    return 'numerico'
  }

  return 'hibrido'
}
