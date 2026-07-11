export const CONVERSION_FACTORS: Record<string, Record<string, number>> = {
  "Utilities": { "kWh": 0.475 },     // kg CO2e per kWh (grid average)
  "Travel": { "miles": 0.254 },      // kg CO2e per mile (flight avg)
  "Supply Chain": { "kg": 2.1 },     // kg CO2e per kg of goods
  "Other": { "unit": 1 }
};

export function calculateCarbonEquivalent(activityType: string, unit: string, rawAmount: number): number {
  const factors = CONVERSION_FACTORS[activityType];
  const factor = factors && factors[unit] ? factors[unit] : 1;
  return (rawAmount * factor) / 1000; // convert kg -> tonnes
}
