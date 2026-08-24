import type { KinematicsSimulationId } from '../../lib/physics/kinematics'

export const waveStringPointCapacity = 128
export const longitudinalWaveStringBasePointCapacity = 384
export const longitudinalWaveStringPointCapacity =
  longitudinalWaveStringBasePointCapacity * 4

export function getWaveProfilePointCount(
  simulationId: KinematicsSimulationId,
) {
  return simulationId === 'longitudinal-wave'
    ? longitudinalWaveStringPointCapacity
    : waveStringPointCapacity
}
