import { describe, expect, it } from 'vitest'
import {
  computeKinematicsTimeline,
  type TorqueLeversCenterMassParameters,
} from '../../lib/physics/kinematics'
import { buildKinematicsChartConfigs } from './kinematicsChartConfigs'

describe('kinematics chart configs', () => {
  it('shows per-body energy traces for torque levers', () => {
    const parameters: TorqueLeversCenterMassParameters = {
      appliedForceArmMeters: 1.5,
      appliedForceNewtons: 0,
      gravityMetersPerSecondSquared: 9.81,
      leftArmMeters: 1.1,
      leftMassKilograms: 1,
      rightArmMeters: 1.5,
      rightMassKilograms: 2.4,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters,
      sampleRateHz: 20,
      simulationId: 'torque-levers-center-mass',
    })
    const charts = buildKinematicsChartConfigs(
      result.samples,
      'torque-levers-center-mass',
      true,
    )
    const energyChart = charts.find((chart) => chart.id === 'energy')

    expect(energyChart?.traces.map((trace) => trace.name)).toEqual([
      'Energia cinetica do corpo esquerdo (J)',
      'Energia cinetica do corpo direito (J)',
      'Potencial gravitacional do corpo esquerdo (J)',
      'Potencial gravitacional do corpo direito (J)',
      'Energia mecanica das massas (J)',
    ])
    expect(energyChart?.traces[0]?.y[20]).toBeCloseTo(
      result.samples[20].leftKineticEnergyJoules,
    )
    expect(energyChart?.traces[1]?.y[20]).toBeCloseTo(
      result.samples[20].rightKineticEnergyJoules,
    )
    expect(energyChart?.traces[2]?.y[20]).toBeCloseTo(
      result.samples[20].leftGravitationalPotentialEnergyJoules,
    )
    expect(energyChart?.traces[3]?.y[20]).toBeCloseTo(
      result.samples[20].rightGravitationalPotentialEnergyJoules,
    )
  })
})
