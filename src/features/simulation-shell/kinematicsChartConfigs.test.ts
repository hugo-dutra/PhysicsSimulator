import { describe, expect, it } from 'vitest'
import {
  computeKinematicsTimeline,
  type GravitationalFieldOrbitsParameters,
  type HydrostaticsBuoyancyParameters,
  type TorqueLeversCenterMassParameters,
  type UniformCircularMotionParameters,
} from '../../lib/physics/kinematics'
import { buildKinematicsChartConfigs } from './kinematicsChartConfigs'

describe('kinematics chart configs', () => {
  it('exposes Kepler area-law traces for gravitational orbits', () => {
    const parameters: GravitationalFieldOrbitsParameters = {
      centralMassEarths: 1,
      eccentricity: 0.45,
      initialAngleDegrees: 0,
      orbitalRadiusKilometers: 7000,
      satelliteMassKilograms: 900,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 3600,
      parameters,
      sampleRateHz: 2,
      simulationId: 'gravitational-field-orbits',
    })
    const charts = buildKinematicsChartConfigs(
      result.samples,
      'gravitational-field-orbits',
      true,
    )
    const keplerChart = charts.find((chart) => chart.id === 'kepler')
    const velocityChart = charts.find((chart) => chart.id === 'velocity')
    const arealRateTrace = keplerChart?.traces[0]
    const angularVelocityTrace = keplerChart?.traces[1]

    expect(velocityChart?.traces[0]?.y[0]).toBeGreaterThan(
      velocityChart?.traces[0]?.y.at(-1) ?? 0,
    )
    expect(keplerChart?.traces.map((trace) => trace.name)).toEqual([
      'Taxa areolar relativa (adimensional)',
      'Velocidade angular relativa (adimensional)',
    ])
    expect(
      Math.max(...(arealRateTrace?.y ?? [])) -
        Math.min(...(arealRateTrace?.y ?? [])),
    ).toBeLessThan(1e-9)
    expect(
      Math.max(...(angularVelocityTrace?.y ?? [])) -
        Math.min(...(angularVelocityTrace?.y ?? [])),
    ).toBeGreaterThan(0.1)
  })

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

  it('shows top, center and base pressure traces for hydrostatics', () => {
    const parameters: HydrostaticsBuoyancyParameters = {
      depthMeters: 1.6,
      fluidDensityKilogramsPerCubicMeter: 1000,
      gravityMetersPerSecondSquared: 9.81,
      objectMassKilograms: 60,
      objectVolumeCubicMeters: 0.1,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters,
      sampleRateHz: 20,
      simulationId: 'hydrostatics-buoyancy',
    })
    const charts = buildKinematicsChartConfigs(
      result.samples,
      'hydrostatics-buoyancy',
      true,
    )
    const pressureChart = charts.find((chart) => chart.id === 'pressure')
    const firstSample = result.samples[0]

    expect(pressureChart?.traces.map((trace) => trace.name)).toEqual([
      'Pressao no topo do corpo (Pa)',
      'Pressao no centro do corpo (Pa)',
      'Pressao na base do corpo (Pa)',
      'Profundidade (m)',
    ])
    expect(pressureChart?.traces[0]?.y[0]).toBeCloseTo(firstSample.pressurePascals)
    expect(pressureChart?.traces[1]?.y[0]).toBeCloseTo(firstSample.fluidPressurePascals)
    expect(pressureChart?.traces[2]?.y[0]).toBeCloseTo(
      firstSample.secondaryPressurePascals,
    )
  })

  it('shows MCU angle, constant rates, centripetal acceleration and projections', () => {
    const parameters: UniformCircularMotionParameters = {
      angularVelocityRadiansPerSecond: 1.8,
      initialAngleDegrees: 0,
      massKilograms: 0.5,
      radiusMeters: 1.4,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 2,
      parameters,
      sampleRateHz: 20,
      simulationId: 'uniform-circular-motion',
    })
    const charts = buildKinematicsChartConfigs(
      result.samples,
      'uniform-circular-motion',
      true,
    )
    const angleChart = charts.find((chart) => chart.id === 'angle')
    const velocityChart = charts.find((chart) => chart.id === 'velocity')
    const accelerationChart = charts.find((chart) => chart.id === 'acceleration')
    const positionChart = charts.find((chart) => chart.id === 'position')

    expect(angleChart?.traces.map((trace) => trace.name)).toEqual([
      'Angulo atual (rad)',
      'Arco percorrido (m)',
    ])
    expect(velocityChart?.traces.map((trace) => trace.name)).toEqual([
      'Velocidade angular (rad/s)',
      'Velocidade tangencial (m/s)',
    ])
    expect(accelerationChart?.traces[0]?.name).toBe(
      'Aceleracao centripeta (m/s^2)',
    )
    expect(positionChart?.traces.map((trace) => trace.name)).toEqual([
      'Posicao x(t) (m)',
      'Posicao y(t) no plano (m)',
    ])
    expect(readRange(velocityChart?.traces[0]?.y ?? [])).toBeLessThan(1e-12)
    expect(readRange(velocityChart?.traces[1]?.y ?? [])).toBeLessThan(1e-12)
    expect(readRange(accelerationChart?.traces[0]?.y ?? [])).toBeLessThan(
      1e-12,
    )
  })
})

function readRange(values: number[]) {
  return Math.max(...values) - Math.min(...values)
}
