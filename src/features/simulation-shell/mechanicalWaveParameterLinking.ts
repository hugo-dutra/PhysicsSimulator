import type {
  ParameterValue,
  SimulationParameter,
} from '../../simulation-registry/types'

const stringSpeedModel = 'string-properties'
const springSpeedModel = 'spring-properties'

export function linkWaveOnStringParameterValues({
  changedParameterId,
  parameterDefinitions,
  values,
}: {
  changedParameterId: string
  parameterDefinitions: SimulationParameter[]
  values: Record<string, ParameterValue>
}) {
  const speedModel = values.speedModel

  if (
    speedModel !== stringSpeedModel ||
    !isWaveOnStringLinkingParameter(changedParameterId)
  ) {
    return values
  }

  const tensionNewtons = readPositiveNumber(values.tensionNewtons)
  const linearDensityKilogramsPerMeter = readPositiveNumber(
    values.linearDensityKilogramsPerMeter,
  )

  if (
    tensionNewtons === null ||
    linearDensityKilogramsPerMeter === null
  ) {
    return values
  }

  const waveSpeedMetersPerSecond = Math.sqrt(
    tensionNewtons / linearDensityKilogramsPerMeter,
  )

  if (
    changedParameterId === 'frequencyHertz' ||
    changedParameterId === 'tensionNewtons' ||
    changedParameterId === 'linearDensityKilogramsPerMeter' ||
    changedParameterId === 'speedModel'
  ) {
    const frequencyHertz = readPositiveNumber(values.frequencyHertz)

    if (frequencyHertz === null) {
      return values
    }

    return {
      ...values,
      wavelengthMeters: clampParameterValue(
        waveSpeedMetersPerSecond / frequencyHertz,
        findParameter(parameterDefinitions, 'wavelengthMeters'),
      ),
    }
  }

  if (changedParameterId === 'wavelengthMeters') {
    const currentFrequencyHertz = readNumber(values.frequencyHertz)
    const wavelengthMeters = readPositiveNumber(values.wavelengthMeters)

    if (currentFrequencyHertz === 0 || wavelengthMeters === null) {
      return values
    }

    return {
      ...values,
      frequencyHertz: clampParameterValue(
        waveSpeedMetersPerSecond / wavelengthMeters,
        findParameter(parameterDefinitions, 'frequencyHertz'),
      ),
    }
  }

  return values
}

export function linkLongitudinalWaveParameterValues({
  changedParameterId,
  parameterDefinitions,
  values,
}: {
  changedParameterId: string
  parameterDefinitions: SimulationParameter[]
  values: Record<string, ParameterValue>
}) {
  const speedModel = values.speedModel

  if (
    speedModel !== springSpeedModel ||
    !isLongitudinalWaveLinkingParameter(changedParameterId)
  ) {
    return values
  }

  const longitudinalStiffnessNewtons = readPositiveNumber(
    values.longitudinalStiffnessNewtons,
  )
  const linearDensityKilogramsPerMeter = readPositiveNumber(
    values.linearDensityKilogramsPerMeter,
  )

  if (
    longitudinalStiffnessNewtons === null ||
    linearDensityKilogramsPerMeter === null
  ) {
    return values
  }

  const waveSpeedMetersPerSecond = Math.sqrt(
    longitudinalStiffnessNewtons / linearDensityKilogramsPerMeter,
  )

  if (
    changedParameterId === 'frequencyHertz' ||
    changedParameterId === 'linearDensityKilogramsPerMeter' ||
    changedParameterId === 'longitudinalStiffnessNewtons' ||
    changedParameterId === 'speedModel'
  ) {
    const frequencyHertz = readPositiveNumber(values.frequencyHertz)

    if (frequencyHertz === null) {
      return values
    }

    return {
      ...values,
      wavelengthMeters: clampParameterValue(
        waveSpeedMetersPerSecond / frequencyHertz,
        findParameter(parameterDefinitions, 'wavelengthMeters'),
      ),
    }
  }

  if (changedParameterId === 'wavelengthMeters') {
    const currentFrequencyHertz = readNumber(values.frequencyHertz)
    const wavelengthMeters = readPositiveNumber(values.wavelengthMeters)

    if (currentFrequencyHertz === 0 || wavelengthMeters === null) {
      return values
    }

    return {
      ...values,
      frequencyHertz: clampParameterValue(
        waveSpeedMetersPerSecond / wavelengthMeters,
        findParameter(parameterDefinitions, 'frequencyHertz'),
      ),
    }
  }

  return values
}

export function linkSuperpositionInterferenceParameterValues({
  changedParameterId,
  parameterDefinitions,
  previousValues,
  values,
}: {
  changedParameterId: string
  parameterDefinitions: SimulationParameter[]
  previousValues: Record<string, ParameterValue>
  values: Record<string, ParameterValue>
}) {
  if (
    changedParameterId !== 'frequencyHertz' &&
    changedParameterId !== 'wavelengthMeters'
  ) {
    return values
  }

  const previousFrequencyHertz = readPositiveNumber(
    previousValues.frequencyHertz,
  )
  const previousWavelengthMeters = readPositiveNumber(
    previousValues.wavelengthMeters,
  )

  if (previousFrequencyHertz === null || previousWavelengthMeters === null) {
    return values
  }

  const waveSpeedMetersPerSecond =
    previousFrequencyHertz * previousWavelengthMeters

  if (changedParameterId === 'frequencyHertz') {
    const frequencyHertz = readPositiveNumber(values.frequencyHertz)

    if (frequencyHertz === null) {
      return values
    }

    return {
      ...values,
      wavelengthMeters: clampParameterValue(
        waveSpeedMetersPerSecond / frequencyHertz,
        findParameter(parameterDefinitions, 'wavelengthMeters'),
      ),
    }
  }

  const wavelengthMeters = readPositiveNumber(values.wavelengthMeters)

  if (wavelengthMeters === null) {
    return values
  }

  return {
    ...values,
    frequencyHertz: clampParameterValue(
      waveSpeedMetersPerSecond / wavelengthMeters,
      findParameter(parameterDefinitions, 'frequencyHertz'),
    ),
  }
}

function isWaveOnStringLinkingParameter(parameterId: string) {
  return (
    parameterId === 'frequencyHertz' ||
    parameterId === 'linearDensityKilogramsPerMeter' ||
    parameterId === 'speedModel' ||
    parameterId === 'tensionNewtons' ||
    parameterId === 'wavelengthMeters'
  )
}

function isLongitudinalWaveLinkingParameter(parameterId: string) {
  return (
    parameterId === 'frequencyHertz' ||
    parameterId === 'linearDensityKilogramsPerMeter' ||
    parameterId === 'longitudinalStiffnessNewtons' ||
    parameterId === 'speedModel' ||
    parameterId === 'wavelengthMeters'
  )
}

function findParameter(
  parameters: SimulationParameter[],
  parameterId: string,
) {
  return parameters.find((parameter) => parameter.id === parameterId)
}

function clampParameterValue(
  value: number,
  parameter: SimulationParameter | undefined,
) {
  if (!parameter) {
    return value
  }

  return Math.min(parameter.max ?? value, Math.max(parameter.min ?? value, value))
}

function readNumber(value: ParameterValue | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function readPositiveNumber(value: ParameterValue | undefined) {
  const numberValue = readNumber(value)

  return numberValue !== null && numberValue > 0 ? numberValue : null
}
