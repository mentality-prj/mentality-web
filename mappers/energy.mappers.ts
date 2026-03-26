export type EnergyKey = 'veryLow' | 'low' | 'middle' | 'high' | 'veryHigh'

const ENERGY_KEY_TO_LEVEL: Record<EnergyKey, number> = {
  veryLow: 1,
  low: 2,
  middle: 3,
  high: 4,
  veryHigh: 5,
}

export const ENERGY_KEYS: EnergyKey[] = Object.keys(ENERGY_KEY_TO_LEVEL) as EnergyKey[]

export function energyKeyToLevel(key?: string | null): number | undefined {
  if (!key) return undefined
  return (ENERGY_KEY_TO_LEVEL as Record<string, number>)[key as string]
}

export function levelToEnergyKey(level: number): EnergyKey | undefined {
  const entry = Object.entries(ENERGY_KEY_TO_LEVEL).find(([, v]) => v === level)
  return entry ? (entry[0] as EnergyKey) : undefined
}
