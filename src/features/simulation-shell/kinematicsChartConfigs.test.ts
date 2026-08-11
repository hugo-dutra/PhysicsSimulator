import { describe, expect, it } from 'vitest'
import {
  computeKinematicsTimeline,
  type BeatsParameters,
  type CoupledOscillatorsParameters,
  type DopplerEffectParameters,
  type ForcedOscillatorResonanceParameters,
  type GravitationalFieldOrbitsParameters,
  type HydrostaticsBuoyancyParameters,
  type LensesMirrorsParameters,
  type LightDiffractionInterferenceParameters,
  type LongitudinalWaveParameters,
  type ReflectionRefractionParameters,
  type TorqueLeversCenterMassParameters,
  type UniformCircularMotionParameters,
} from '../../lib/physics/kinematics'
import { buildKinematicsChartConfigs } from './kinematicsChartConfigs'

describe('kinematics chart configs', () => {
  it('exposes Kepler area-law traces for gravitational orbits', () => {
    const parameters: GravitationalFieldOrbitsParameters = {
      centralMassEarths: 1,
      eccentricity: 0.45,
      fabricDeformationScale: 1,
      fabricLineOpacity: 0.6,
      initialAngleDegrees: 0,
      orbitingBodyWellAmplification: 0.35,
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
    const fabricChart = charts.find((chart) => chart.id === 'fabric')
    const potentialChart = charts.find((chart) => chart.id === 'potential')
    const arealRateTrace = keplerChart?.traces[0]
    const angularVelocityTrace = keplerChart?.traces[1]

    expect(velocityChart?.traces[0]?.y[0]).toBeGreaterThan(
      velocityChart?.traces[0]?.y.at(-1) ?? 0,
    )
    expect(keplerChart?.traces.map((trace) => trace.name)).toEqual([
      'Taxa areolar relativa (adimensional)',
      'Velocidade angular relativa (adimensional)',
    ])
    expect(fabricChart?.traces.map((trace) => trace.name)).toEqual([
      'Poco central (escala visual)',
      'Poco orbital amplificado (escala visual)',
    ])
    expect(potentialChart?.traces[0]?.y.every((value) => value < 0)).toBe(true)
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

  it('shows force and work traces for forced oscillators', () => {
    const parameters: ForcedOscillatorResonanceParameters = {
      dampingPerSecond: 0.35,
      driveAngularFrequencyRadiansPerSecond: 4,
      driveForceNewtons: 1.4,
      initialDisplacementMeters: 0,
      initialVelocityMetersPerSecond: 0,
      massKilograms: 1,
      springConstantNewtonsPerMeter: 16,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 2,
      parameters,
      sampleRateHz: 20,
      simulationId: 'forced-oscillator-resonance',
    })
    const charts = buildKinematicsChartConfigs(
      result.samples,
      'forced-oscillator-resonance',
      true,
    )
    const forceChart = charts.find((chart) => chart.id === 'forces')
    const energyChart = charts.find((chart) => chart.id === 'energy')

    expect(forceChart?.traces.map((trace) => trace.name)).toContain(
      'Forca externa periodica (N)',
    )
    expect(energyChart?.traces.map((trace) => trace.name)).toContain(
      'Trabalho da forca externa (J)',
    )
  })

  it('shows modal traces for coupled oscillators', () => {
    const parameters: CoupledOscillatorsParameters = {
      couplingSpringConstantNewtonsPerMeter: 5,
      dampingNewtonSecondsPerMeter: 0,
      gravityMetersPerSecondSquared: 9.81,
      initialDisplacementOneMeters: 0.28,
      initialDisplacementTwoMeters: 0,
      initialVelocityOneMetersPerSecond: 0,
      initialVelocityTwoMetersPerSecond: 0,
      massOneKilograms: 0.8,
      massTwoKilograms: 0.8,
      springConstantOneNewtonsPerMeter: 18,
      springConstantTwoNewtonsPerMeter: 18,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 2,
      parameters,
      sampleRateHz: 20,
      simulationId: 'coupled-oscillators',
    })
    const charts = buildKinematicsChartConfigs(
      result.samples,
      'coupled-oscillators',
      true,
    )
    const positionChart = charts.find((chart) => chart.id === 'position')
    const energyChart = charts.find((chart) => chart.id === 'energy')

    expect(positionChart?.traces.map((trace) => trace.name)).toEqual([
      'Massa A (m)',
      'Massa B (m)',
      'Modo comum (m)',
      'Modo relativo xA - xB (m)',
    ])
    expect(energyChart?.traces.map((trace) => trace.name)).toContain(
      'Energia na mola de acoplamento (J)',
    )
  })

  it('shows pressure envelope and beat frequency traces for acoustic beats', () => {
    const parameters: BeatsParameters = {
      amplitudePascals: 0.3,
      frequencyOneHertz: 3,
      frequencyTwoHertz: 3.5,
      mediumLengthMeters: 6,
      mediumSpeedMetersPerSecond: 6,
      phaseDifferenceDegrees: 0,
      probePositionMeters: 3,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters,
      sampleRateHz: 20,
      simulationId: 'beats',
    })
    const charts = buildKinematicsChartConfigs(result.samples, 'beats', true)
    const pressureChart = charts.find((chart) => chart.id === 'pressure')
    const frequencyChart = charts.find((chart) => chart.id === 'frequency')

    expect(pressureChart?.traces.map((trace) => trace.name)).toEqual([
      'Pressao resultante (Pa)',
      'Tom A (Pa)',
      'Tom B (Pa)',
      'Envoltoria de batimento (Pa)',
    ])
    expect(frequencyChart?.traces[0]?.name).toBe(
      'Frequencia de batimento (Hz)',
    )
    expect(charts.some((chart) => chart.id === 'energy')).toBe(false)
  })

  it('shows emitted and observed frequency traces for Doppler effect', () => {
    const parameters: DopplerEffectParameters = {
      amplitudePascals: 0.4,
      emittedFrequencyHertz: 2,
      mediumLengthMeters: 8,
      mediumSpeedMetersPerSecond: 6,
      observerPositionMeters: 6,
      observerSpeedMetersPerSecond: 0,
      sourceInitialPositionMeters: 2,
      sourceSpeedMetersPerSecond: 1,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters,
      sampleRateHz: 20,
      simulationId: 'doppler-effect',
    })
    const charts = buildKinematicsChartConfigs(
      result.samples,
      'doppler-effect',
      true,
    )
    const frequencyChart = charts.find((chart) => chart.id === 'frequency')
    const velocityChart = charts.find((chart) => chart.id === 'velocity')

    expect(frequencyChart?.traces.map((trace) => trace.name)).toEqual([
      'Frequencia observada (Hz)',
      'Frequencia emitida (Hz)',
    ])
    expect(velocityChart?.traces.map((trace) => trace.name)).toContain(
      'Velocidade da fonte (m/s)',
    )
    expect(charts.some((chart) => chart.id === 'energy')).toBe(false)
  })

  it('shows longitudinal displacement and elastic force traces for a spring wave', () => {
    const parameters: LongitudinalWaveParameters = {
      amplitudeMeters: 0.18,
      frequencyHertz: 0.8,
      linearDensityKilogramsPerMeter: 0.2,
      longitudinalStiffnessNewtons: 0.72,
      phaseDegrees: 0,
      probePositionMeters: 1.5,
      springCoilTurns: 54,
      speedModel: 'spring-properties',
      springLengthMeters: 4,
      wavelengthMeters: 2,
    }
    const result = computeKinematicsTimeline({
      durationSeconds: 1,
      parameters,
      sampleRateHz: 20,
      simulationId: 'longitudinal-wave',
    })
    const charts = buildKinematicsChartConfigs(
      result.samples,
      'longitudinal-wave',
      true,
    )
    const positionChart = charts.find((chart) => chart.id === 'position')
    const forceChart = charts.find((chart) => chart.id === 'forces')

    expect(positionChart?.title).toBe('Deslocamento longitudinal por tempo')
    expect(positionChart?.traces[0]?.name).toBe(
      'Deslocamento longitudinal no elo (m)',
    )
    expect(forceChart?.traces[0]?.name).toBe(
      'Forca elastica longitudinal (N)',
    )
  })

  it('shows angle, image and intensity chart sets for optics simulations', () => {
    const reflectionParameters: ReflectionRefractionParameters = {
      incidentAngleDegrees: 42,
      incidentMediumIndex: 1,
      rayBundleSpreadDegrees: 3,
      refractedMediumIndex: 1.5,
    }
    const lensesParameters: LensesMirrorsParameters = {
      elementKind: 'converging-lens',
      focalLengthMeters: 1.2,
      objectDistanceMeters: 2.4,
      objectHeightMeters: 0.75,
      rayApertureMeters: 0.85,
    }
    const diffractionParameters: LightDiffractionInterferenceParameters = {
      detectorPositionMillimeters: 4,
      intensityScale: 0.96,
      screenDistanceMeters: 1.8,
      slitCount: 3,
      slitSeparationMicrometers: 120,
      slitWidthMicrometers: 36,
      wavelengthNanometers: 540,
    }
    const reflectionCharts = buildKinematicsChartConfigs(
      computeKinematicsTimeline({
        durationSeconds: 1,
        parameters: reflectionParameters,
        sampleRateHz: 4,
        simulationId: 'reflection-refraction',
      }).samples,
      'reflection-refraction',
      true,
    )
    const lensesCharts = buildKinematicsChartConfigs(
      computeKinematicsTimeline({
        durationSeconds: 1,
        parameters: lensesParameters,
        sampleRateHz: 4,
        simulationId: 'lenses-mirrors',
      }).samples,
      'lenses-mirrors',
      true,
    )
    const diffractionCharts = buildKinematicsChartConfigs(
      computeKinematicsTimeline({
        durationSeconds: 1,
        parameters: diffractionParameters,
        sampleRateHz: 4,
        simulationId: 'light-diffraction-interference',
      }).samples,
      'light-diffraction-interference',
      true,
    )

    expect(reflectionCharts.map((chart) => chart.id)).toEqual([
      'angle',
      'field',
    ])
    expect(reflectionCharts[0].traces.map((trace) => trace.name)).toContain(
      'Angulo refratado (deg)',
    )
    expect(lensesCharts.map((chart) => chart.id)).toEqual([
      'position',
      'field',
    ])
    expect(lensesCharts[1].traces.map((trace) => trace.name)).toContain(
      'Aumento linear',
    )
    expect(diffractionCharts.map((chart) => chart.id)).toEqual([
      'pressure',
      'position',
    ])
    expect(diffractionCharts[0].traces.map((trace) => trace.name)).toEqual([
      'Intensidade normalizada',
      'Envoltoria de difracao',
      'Interferencia entre fendas',
    ])
  })
})

function readRange(values: number[]) {
  return Math.max(...values) - Math.min(...values)
}
