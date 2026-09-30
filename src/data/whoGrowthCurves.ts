import {
  WHO_STANDARDS_BOYS,
  WHO_STANDARDS_GIRLS,
  calculateWHOZScore,
  zScoreToPercentile,
  WHOLMSData
} from './pediatricDatasets';
import { WHOGrowthEvaluation } from '../types';

export type GrowthMetric = 'weight' | 'height' | 'bmi';
export type AgeRangeOption = '0-24m' | '0-60m' | '0-144m';

export interface ChildGrowthPoint {
  id: string;
  ageMonths: number;
  date: string;
  weightKg: number;
  heightCm: number;
  bmi: number;
  notes?: string;
}

export interface WHORechartDataPoint {
  ageMonths: number;
  ageLabel: string;
  p3: number;
  p15: number;
  p50: number; // Median
  p85: number;
  p97: number;
  sdNeg2: number;
  sdPos2: number;
  childValue?: number | null;
  childWeight?: number | null;
  childHeight?: number | null;
  childBmi?: number | null;
}

// Convert LMS parameters into exact value for a given Z-score
export function lmsToValue(L: number, M: number, S: number, z: number): number {
  if (Math.abs(L) < 0.0001) {
    return M * Math.exp(S * z);
  }
  const base = 1 + L * S * z;
  if (base <= 0) return M * Math.exp(S * z);
  return M * Math.pow(base, 1 / L);
}

// Linearly interpolate LMS parameters for any arbitrary age in months
export function getInterpolatedLMS(ageMonths: number, gender: 'boy' | 'girl'): WHOLMSData {
  const standards = gender === 'boy' ? WHO_STANDARDS_BOYS : WHO_STANDARDS_GIRLS;
  const clampedAge = Math.max(0, Math.min(144, ageMonths));

  if (clampedAge <= standards[0].ageMonths) return standards[0];
  if (clampedAge >= standards[standards.length - 1].ageMonths) return standards[standards.length - 1];

  for (let i = 0; i < standards.length - 1; i++) {
    const p1 = standards[i];
    const p2 = standards[i + 1];
    if (clampedAge >= p1.ageMonths && clampedAge <= p2.ageMonths) {
      const span = p2.ageMonths - p1.ageMonths;
      const ratio = span === 0 ? 0 : (clampedAge - p1.ageMonths) / span;

      return {
        ageMonths: clampedAge,
        weightL: p1.weightL + ratio * (p2.weightL - p1.weightL),
        weightM: p1.weightM + ratio * (p2.weightM - p1.weightM),
        weightS: p1.weightS + ratio * (p2.weightS - p1.weightS),
        heightL: 1,
        heightM: p1.heightM + ratio * (p2.heightM - p1.heightM),
        heightS: p1.heightS + ratio * (p2.heightS - p1.heightS),
      };
    }
  }

  return standards[0];
}

// Pre-configured checkup records for demonstration children
export const DEFAULT_CHILD_GROWTH_RECORDS: Record<string, ChildGrowthPoint[]> = {
  'child-1': [ // Mateo (12m boy)
    { id: 'm-0', ageMonths: 0, date: '2025-08-16', weightKg: 3.4, heightCm: 50.0, bmi: 13.6, notes: 'Nacimiento a término (39.2 sem)' },
    { id: 'm-2', ageMonths: 2, date: '2025-10-16', weightKg: 5.6, heightCm: 58.5, bmi: 16.4, notes: 'Control 2 meses. Lactancia materna exclusiva' },
    { id: 'm-4', ageMonths: 4, date: '2025-12-16', weightKg: 7.0, heightCm: 64.0, bmi: 17.1, notes: 'Vacunas 4m. Buen sostén cefálico' },
    { id: 'm-6', ageMonths: 6, date: '2026-02-16', weightKg: 8.0, heightCm: 67.8, bmi: 17.4, notes: 'Inicio de alimentación complementaria BLW' },
    { id: 'm-9', ageMonths: 9, date: '2026-05-16', weightKg: 8.9, heightCm: 72.0, bmi: 17.2, notes: 'Control 9 meses. Gateo activo' },
    { id: 'm-12', ageMonths: 12, date: '2026-08-16', weightKg: 9.6, heightCm: 75.5, bmi: 16.8, notes: 'Control del año. Primeros pasos con apoyo' },
  ],
  'child-2': [ // Sofía (42m girl)
    { id: 's-0', ageMonths: 0, date: '2023-02-10', weightKg: 3.1, heightCm: 49.0, bmi: 12.9, notes: 'Nacimiento' },
    { id: 's-6', ageMonths: 6, date: '2023-08-10', weightKg: 7.3, heightCm: 65.5, bmi: 17.0, notes: 'Control 6 meses' },
    { id: 's-12', ageMonths: 12, date: '2024-02-10', weightKg: 8.9, heightCm: 74.0, bmi: 16.2, notes: 'Control 1 año' },
    { id: 's-24', ageMonths: 24, date: '2025-02-10', weightKg: 11.5, heightCm: 85.5, bmi: 15.7, notes: 'Control 2 años' },
    { id: 's-36', ageMonths: 36, date: '2026-02-10', weightKg: 13.9, heightCm: 95.0, bmi: 15.4, notes: 'Control 3 años. Dentición completa' },
    { id: 's-42', ageMonths: 42, date: '2026-08-10', weightKg: 15.2, heightCm: 99.0, bmi: 15.5, notes: 'Control 3 años y medio' },
  ],
  'child-camila-1': [ // Lucas (6m boy)
    { id: 'l-0', ageMonths: 0, date: '2026-03-15', weightKg: 3.2, heightCm: 49.5, bmi: 13.1, notes: 'Nacimiento a término' },
    { id: 'l-2', ageMonths: 2, date: '2026-05-15', weightKg: 5.3, heightCm: 57.5, bmi: 16.0, notes: 'Control 2 meses' },
    { id: 'l-4', ageMonths: 4, date: '2026-07-15', weightKg: 6.8, heightCm: 63.2, bmi: 17.0, notes: 'Control 4 meses' },
    { id: 'l-6', ageMonths: 6, date: '2026-09-15', weightKg: 7.8, heightCm: 67.0, bmi: 17.4, notes: 'Control 6 meses' },
  ]
};

// Generate chart data array for Recharts
export function generateWHORechartsData(
  gender: 'boy' | 'girl',
  metric: GrowthMetric,
  ageRange: AgeRangeOption,
  childPoints: ChildGrowthPoint[] = []
): WHORechartDataPoint[] {
  let maxAge = 144;
  let samplingSteps: number[] = [];

  if (ageRange === '0-24m') {
    maxAge = 24;
    // Granular sampling: every month from 0 to 24
    for (let m = 0; m <= 24; m++) {
      samplingSteps.push(m);
    }
  } else if (ageRange === '0-60m') {
    maxAge = 60;
    // Monthly for 0-24, every 3 months for 24-60
    for (let m = 0; m <= 24; m += 2) samplingSteps.push(m);
    for (let m = 27; m <= 60; m += 3) samplingSteps.push(m);
  } else {
    maxAge = 144;
    // 0 to 144 months
    for (let m = 0; m <= 24; m += 3) samplingSteps.push(m);
    for (let m = 30; m <= 60; m += 6) samplingSteps.push(m);
    for (let m = 72; m <= 144; m += 12) samplingSteps.push(m);
  }

  // Ensure any age where child has a measurement is included
  childPoints.forEach(pt => {
    if (pt.ageMonths <= maxAge && !samplingSteps.includes(pt.ageMonths)) {
      samplingSteps.push(pt.ageMonths);
    }
  });

  samplingSteps.sort((a, b) => a - b);
  // Deduplicate
  samplingSteps = Array.from(new Set(samplingSteps));

  // Build points
  return samplingSteps.map(age => {
    const lms = getInterpolatedLMS(age, gender);

    // Formatted label for X-Axis
    let ageLabel = `${age}m`;
    if (age === 0) ageLabel = 'RN';
    else if (age >= 12 && age % 12 === 0) ageLabel = `${age / 12}a`;
    else if (age > 24) ageLabel = `${Math.floor(age / 12)}a ${age % 12}m`;

    let p3 = 0, p15 = 0, p50 = 0, p85 = 0, p97 = 0;
    let sdNeg2 = 0, sdPos2 = 0;

    if (metric === 'weight') {
      p3 = lmsToValue(lms.weightL, lms.weightM, lms.weightS, -1.88079);
      p15 = lmsToValue(lms.weightL, lms.weightM, lms.weightS, -1.03643);
      p50 = lms.weightM;
      p85 = lmsToValue(lms.weightL, lms.weightM, lms.weightS, 1.03643);
      p97 = lmsToValue(lms.weightL, lms.weightM, lms.weightS, 1.88079);
      sdNeg2 = lmsToValue(lms.weightL, lms.weightM, lms.weightS, -2.0);
      sdPos2 = lmsToValue(lms.weightL, lms.weightM, lms.weightS, 2.0);
    } else if (metric === 'height') {
      p3 = lmsToValue(lms.heightL, lms.heightM, lms.heightS, -1.88079);
      p15 = lmsToValue(lms.heightL, lms.heightM, lms.heightS, -1.03643);
      p50 = lms.heightM;
      p85 = lmsToValue(lms.heightL, lms.heightM, lms.heightS, 1.03643);
      p97 = lmsToValue(lms.heightL, lms.heightM, lms.heightS, 1.88079);
      sdNeg2 = lmsToValue(lms.heightL, lms.heightM, lms.heightS, -2.0);
      sdPos2 = lmsToValue(lms.heightL, lms.heightM, lms.heightS, 2.0);
    } else {
      // BMI: Weight median / (Height median in meters)^2, with standard WHO LMS dispersion
      const medianHInM = lms.heightM / 100;
      const medianBMI = lms.weightM / (medianHInM * medianHInM);
      const bmiS = 0.088; // Dispersion coefficient for BMI standard
      const bmiL = -0.35; // Skewness coefficient for BMI standard

      p3 = lmsToValue(bmiL, medianBMI, bmiS, -1.88079);
      p15 = lmsToValue(bmiL, medianBMI, bmiS, -1.03643);
      p50 = medianBMI;
      p85 = lmsToValue(bmiL, medianBMI, bmiS, 1.03643);
      p97 = lmsToValue(bmiL, medianBMI, bmiS, 1.88079);
      sdNeg2 = lmsToValue(bmiL, medianBMI, bmiS, -2.0);
      sdPos2 = lmsToValue(bmiL, medianBMI, bmiS, 2.0);
    }

    // Match child point if available
    const childMatch = childPoints.find(pt => pt.ageMonths === age);
    let childValue: number | null = null;
    let childWeight: number | null = null;
    let childHeight: number | null = null;
    let childBmi: number | null = null;

    if (childMatch) {
      childWeight = childMatch.weightKg;
      childHeight = childMatch.heightCm;
      childBmi = childMatch.bmi;

      if (metric === 'weight') childValue = childMatch.weightKg;
      else if (metric === 'height') childValue = childMatch.heightCm;
      else childValue = childMatch.bmi;
    }

    return {
      ageMonths: age,
      ageLabel,
      p3: Math.round(p3 * 100) / 100,
      p15: Math.round(p15 * 100) / 100,
      p50: Math.round(p50 * 100) / 100,
      p85: Math.round(p85 * 100) / 100,
      p97: Math.round(p97 * 100) / 100,
      sdNeg2: Math.round(sdNeg2 * 100) / 100,
      sdPos2: Math.round(sdPos2 * 100) / 100,
      childValue,
      childWeight,
      childHeight,
      childBmi
    };
  });
}

// Compute comprehensive anthropometric evaluation for a given measurement
export function evaluateAnthropometrics(
  ageMonths: number,
  gender: 'boy' | 'girl',
  weightKg: number,
  heightCm: number
): WHOGrowthEvaluation {
  const lms = getInterpolatedLMS(ageMonths, gender);

  const weightZ = calculateWHOZScore(weightKg, lms.weightL, lms.weightM, lms.weightS);
  const weightPercentile = zScoreToPercentile(weightZ);

  const heightZ = calculateWHOZScore(heightCm, lms.heightL, lms.heightM, lms.heightS);
  const heightPercentile = zScoreToPercentile(heightZ);

  const heightM = Math.max(0.3, heightCm / 100);
  const bmi = weightKg / (heightM * heightM);

  // Approximate BMI Z-score via median and standard variance
  const medianHInM = lms.heightM / 100;
  const medianBMI = lms.weightM / (medianHInM * medianHInM);
  const bmiZ = calculateWHOZScore(bmi, -0.35, medianBMI, 0.088);

  let status: 'normal' | 'vigilancia' | 'alerta' = 'normal';
  let interpretation = '';
  const recommendations: string[] = [];

  const roundedWeightP = Math.round(weightPercentile * 10) / 10;
  const roundedHeightP = Math.round(heightPercentile * 10) / 10;
  const roundedWeightZ = Math.round(weightZ * 100) / 100;
  const roundedHeightZ = Math.round(heightZ * 100) / 100;
  const roundedBmiZ = Math.round(bmiZ * 100) / 100;
  const roundedBmi = Math.round(bmi * 10) / 10;

  // Weight-for-age classification
  if (weightZ < -3) {
    status = 'alerta';
    interpretation = `Alerta Pediátrica: Desnutrición o bajo peso severo (Percentil < P1, Z-Score ${roundedWeightZ} SD).`;
    recommendations.push('Consulta pediátrica presencial prioritaria para valoración nutricional exhaustiva.');
    recommendations.push('Descartar procesos malabsortivos, intolerancias digestivas o ingesta calórica insuficiente.');
  } else if (weightZ < -2) {
    status = 'alerta';
    interpretation = `Bajo peso para la edad (Percentil P${roundedWeightP}, Z-Score ${roundedWeightZ} SD). Indicador de alerta según directrices OMS.`;
    recommendations.push('Revisar la densidad calórica y el volumen de las tomas con el pediatra.');
    recommendations.push('Mantener tomas de lactancia materna o fórmula según indicación y monitorizar ganancia quincenal.');
  } else if (weightZ > 2) {
    status = 'vigilancia';
    interpretation = `Peso elevado para la edad (Percentil P${roundedWeightP}, Z-Score +${roundedWeightZ} SD). En lactantes puede ser fisiológico por lactancia materna exclusiva.`;
    recommendations.push('Favorecer el movimiento libre y juego motriz activo diario.');
    recommendations.push('En niños mayores de 6 meses, asegurar que la alimentación complementaria priorice verduras, frutas y proteínas magras sin azúcares añadidos.');
  } else {
    status = 'normal';
    interpretation = `Crecimiento armónico y saludable (Percentil Peso P${roundedWeightP}, Percentil Talla P${roundedHeightP}). Sus valores se sitúan en el rango eutrófico óptimo de la OMS.`;
    recommendations.push('Mantener el calendario regular de controles pediátricos y vacunación.');
    recommendations.push('Continuar con una alimentación nutritiva, balanceada y rica en alimentos frescos.');
    recommendations.push('Estimular el desarrollo psicomotor mediante juegos al aire libre.');
  }

  // Height-for-age nuance
  if (heightZ < -2) {
    if (status !== 'alerta') status = 'vigilancia';
    recommendations.push('Talla baja para la edad: se aconseja medir la talla diana parental y vigilar la velocidad de crecimiento.');
  } else if (heightZ > 2) {
    recommendations.push('Talla alta para la edad: desarrollo longitudinal por encima del promedio poblacional.');
  }

  return {
    weightPercentile: roundedWeightP,
    weightZScore: roundedWeightZ,
    heightPercentile: roundedHeightP,
    heightZScore: roundedHeightZ,
    bmi: roundedBmi,
    bmiZScore: roundedBmiZ,
    interpretation,
    recommendations,
    status
  };
}
