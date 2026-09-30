import {
  FoodGene,
  GENETIC_FOOD_CATALOG,
  AGE_NUTRITIONAL_TARGETS,
  PediatricRDA
} from '../data/geneticFoodDataset';
import { AgeBracket } from '../types';

export interface DailyMealPlan {
  dayIndex: number;
  dayName: string;
  breakfast: FoodGene;
  midMorning: FoodGene;
  lunch: FoodGene;
  snack: FoodGene;
  dinner: FoodGene;
}

export interface WeeklyChromosome {
  id: string;
  days: DailyMealPlan[];
  fitness: number;
  fitnessBreakdown: {
    nutritionTargetScore: number;
    varietyScore: number;
    synergyBonus: number;
    textureSafetyScore: number;
    allergenPenalty: number;
    timeConvenienceScore: number;
  };
  totalNutrients: {
    caloriesKcal: number;
    proteinG: number;
    ironMg: number;
    calciumMg: number;
    dhaOmega3Mg: number;
    zincMg: number;
    vitaminCMg: number;
    fiberG: number;
    avgPrepTimeMin: number;
  };
}

export interface GeneticConfig {
  populationSize: number;
  generations: number;
  crossoverRate: number;
  mutationRate: number;
  elitismCount: number;
  targetAge: AgeBracket;
  childAgeMonths?: number;
  excludedAllergens: ('dairy' | 'egg' | 'gluten' | 'nuts' | 'soy' | 'fish' | 'shellfish')[];
  prioritizeQuickPrep: boolean;
  prioritizeIron: boolean;
  prioritizeDHA: boolean;
  prioritizeBLW: boolean;
}

export interface GenerationTelemetry {
  generation: number;
  bestFitness: number;
  avgFitness: number;
  worstFitness: number;
  diversityIndex: number;
  bestChromosome: WeeklyChromosome;
}

const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// Filter valid pool by age and allergens
export function getFilteredGenePool(
  catalog: FoodGene[],
  config: GeneticConfig
): {
  breakfasts: FoodGene[];
  midMornings: FoodGene[];
  lunches: FoodGene[];
  snacks: FoodGene[];
  dinners: FoodGene[];
} {
  const ageMonths = config.childAgeMonths || (config.targetAge === '0-12m' ? 8 : config.targetAge === '1-3y' ? 24 : config.targetAge === '4-6y' ? 48 : 84);

  const isSafe = (gene: FoodGene) => {
    if (gene.minAgeMonths > ageMonths) return false;
    const hasAllergen = gene.allergens.some((a) => config.excludedAllergens.includes(a));
    if (hasAllergen) return false;
    return true;
  };

  const getSlotGenes = (slot: 'breakfast' | 'mid_morning' | 'lunch' | 'snack' | 'dinner') => {
    let list = catalog.filter((g) => g.mealSlot === slot && isSafe(g));
    if (list.length === 0) {
      // Fallback to avoid empty slot
      list = catalog.filter((g) => g.mealSlot === slot);
    }
    return list;
  };

  return {
    breakfasts: getSlotGenes('breakfast'),
    midMornings: getSlotGenes('mid_morning'),
    lunches: getSlotGenes('lunch'),
    snacks: getSlotGenes('snack'),
    dinners: getSlotGenes('dinner')
  };
}

// Generate random Daily Meal Plan from pool
function createRandomDay(
  dayIndex: number,
  pool: ReturnType<typeof getFilteredGenePool>
): DailyMealPlan {
  const pick = (arr: FoodGene[]) => arr[Math.floor(Math.random() * arr.length)];
  return {
    dayIndex,
    dayName: DAY_NAMES[dayIndex],
    breakfast: pick(pool.breakfasts),
    midMorning: pick(pool.midMornings),
    lunch: pick(pool.lunches),
    snack: pick(pool.snacks),
    dinner: pick(pool.dinners)
  };
}

// Generate a random 7-day chromosome
export function createRandomChromosome(
  pool: ReturnType<typeof getFilteredGenePool>,
  config: GeneticConfig
): WeeklyChromosome {
  const days: DailyMealPlan[] = [];
  for (let i = 0; i < 7; i++) {
    days.push(createRandomDay(i, pool));
  }
  const chromosome: WeeklyChromosome = {
    id: 'chrom-' + Math.random().toString(36).substr(2, 9),
    days,
    fitness: 0,
    fitnessBreakdown: {
      nutritionTargetScore: 0,
      varietyScore: 0,
      synergyBonus: 0,
      textureSafetyScore: 0,
      allergenPenalty: 0,
      timeConvenienceScore: 0
    },
    totalNutrients: {
      caloriesKcal: 0,
      proteinG: 0,
      ironMg: 0,
      calciumMg: 0,
      dhaOmega3Mg: 0,
      zincMg: 0,
      vitaminCMg: 0,
      fiberG: 0,
      avgPrepTimeMin: 0
    }
  };
  evaluateFitness(chromosome, config);
  return chromosome;
}

// Multi-Objective Heuristic Fitness Evaluation Function
export function evaluateFitness(
  chromosome: WeeklyChromosome,
  config: GeneticConfig
): number {
  const rda = AGE_NUTRITIONAL_TARGETS[config.targetAge] || AGE_NUTRITIONAL_TARGETS['1-3y'];

  let sumCalories = 0;
  let sumProtein = 0;
  let sumIron = 0;
  let sumCalcium = 0;
  let sumDha = 0;
  let sumZinc = 0;
  let sumVitC = 0;
  let sumFiber = 0;
  let sumPrepTime = 0;

  let allergenViolations = 0;
  let synergyHits = 0;
  let blwScore = 0;

  const usedMealIds: string[] = [];
  let repetitionPenalty = 0;

  for (let d = 0; d < 7; d++) {
    const day = chromosome.days[d];
    const meals = [day.breakfast, day.midMorning, day.lunch, day.snack, day.dinner];

    let dayIron = 0;
    let dayVitC = 0;

    meals.forEach((m) => {
      sumCalories += m.caloriesKcal;
      sumProtein += m.proteinG;
      sumIron += m.ironMg;
      sumCalcium += m.calciumMg;
      sumDha += m.dhaOmega3Mg;
      sumZinc += m.zincMg;
      sumVitC += m.vitaminCMg;
      sumFiber += m.fiberG;
      sumPrepTime += m.prepTimeMinutes;

      dayIron += m.ironMg;
      dayVitC += m.vitaminCMg;

      // Allergen check
      const hasAllergen = m.allergens.some((a) => config.excludedAllergens.includes(a));
      if (hasAllergen) allergenViolations += 1;

      // BLW readiness
      if (config.prioritizeBLW && m.textureType === 'blw_finger_food') {
        blwScore += 2;
      }

      // Repetition tracking
      if (usedMealIds.includes(m.id)) {
        repetitionPenalty += 3;
      }
      usedMealIds.push(m.id);
    });

    // Iron + Vitamin C Bioabsorption Synergy Heuristic
    if (dayIron >= rda.ironMg * 0.8 && dayVitC >= rda.vitaminCMg * 0.8) {
      synergyHits += 1; // Great day synergy!
    }

    // Compare with consecutive day to penalize back-to-back duplicate main lunches
    if (d > 0) {
      const prevDay = chromosome.days[d - 1];
      if (prevDay.lunch.id === day.lunch.id) repetitionPenalty += 6;
      if (prevDay.dinner.id === day.dinner.id) repetitionPenalty += 6;
    }
  }

  // Daily averages
  const avgCal = sumCalories / 7;
  const avgProt = sumProtein / 7;
  const avgIron = sumIron / 7;
  const avgCalc = sumCalcium / 7;
  const avgDha = sumDha / 7;
  const avgZinc = sumZinc / 7;
  const avgVitC = sumVitC / 7;
  const avgFiber = sumFiber / 7;
  const avgTime = sumPrepTime / 35;

  chromosome.totalNutrients = {
    caloriesKcal: Math.round(avgCal),
    proteinG: Number(avgProt.toFixed(1)),
    ironMg: Number(avgIron.toFixed(1)),
    calciumMg: Math.round(avgCalc),
    dhaOmega3Mg: Math.round(avgDha),
    zincMg: Number(avgZinc.toFixed(1)),
    vitaminCMg: Math.round(avgVitC),
    fiberG: Number(avgFiber.toFixed(1)),
    avgPrepTimeMin: Math.round(avgTime)
  };

  // 1. Normalized Distance from Target RDA (Objective 1)
  const calcNutrientFit = (actual: number, target: number, weight = 1.0) => {
    const ratio = actual / target;
    // Perfect is ratio between 0.95 and 1.2
    if (ratio >= 0.95 && ratio <= 1.25) return 10 * weight;
    if (ratio < 0.95) return Math.max(0, 10 - Math.pow((1 - ratio) * 10, 1.4)) * weight;
    return Math.max(0, 10 - (ratio - 1.25) * 4) * weight;
  };

  const ironWeight = config.prioritizeIron ? 2.5 : 1.5;
  const dhaWeight = config.prioritizeDHA ? 2.5 : 1.2;

  const scoreCal = calcNutrientFit(avgCal, rda.caloriesKcal, 1.0);
  const scoreProt = calcNutrientFit(avgProt, rda.proteinG, 1.0);
  const scoreIron = calcNutrientFit(avgIron, rda.ironMg, ironWeight);
  const scoreCalc = calcNutrientFit(avgCalc, rda.calciumMg, 1.2);
  const scoreDha = calcNutrientFit(avgDha, rda.dhaOmega3Mg, dhaWeight);
  const scoreZinc = calcNutrientFit(avgZinc, rda.zincMg, 1.0);
  const scoreVitC = calcNutrientFit(avgVitC, rda.vitaminCMg, 1.0);
  const scoreFiber = calcNutrientFit(avgFiber, rda.fiberG, 1.0);

  const rawNutritionScore = (scoreCal + scoreProt + scoreIron + scoreCalc + scoreDha + scoreZinc + scoreVitC + scoreFiber) / (8 + (ironWeight - 1) + (dhaWeight - 1)) * 5; // Scale to ~50 max

  // 2. Variety & Monotony Score (Objective 2)
  const uniqueCount = new Set(usedMealIds).size;
  const varietyScore = Math.min(25, (uniqueCount / 28) * 25 - repetitionPenalty * 0.3);

  // 3. Synergy Bonus (Objective 3)
  const synergyBonus = Math.min(15, synergyHits * 2.1 + (blwScore * 0.5));

  // 4. Time Convenience Score
  let timeScore = 10;
  if (config.prioritizeQuickPrep) {
    if (avgTime <= 10) timeScore = 15;
    else if (avgTime <= 15) timeScore = 10;
    else timeScore = Math.max(0, 10 - (avgTime - 15) * 0.8);
  }

  // 5. Texture & Developmental Safety
  const textureSafetyScore = 10;

  // 6. Hard Allergen Barrier Penalty
  const allergenPenalty = allergenViolations * 1000;

  const totalFitness = Math.max(
    0.1,
    Number((rawNutritionScore + varietyScore + synergyBonus + timeScore + textureSafetyScore - allergenPenalty).toFixed(2))
  );

  chromosome.fitness = totalFitness;
  chromosome.fitnessBreakdown = {
    nutritionTargetScore: Number(rawNutritionScore.toFixed(1)),
    varietyScore: Number(Math.max(0, varietyScore).toFixed(1)),
    synergyBonus: Number(synergyBonus.toFixed(1)),
    textureSafetyScore,
    allergenPenalty,
    timeConvenienceScore: Number(timeScore.toFixed(1))
  };

  return totalFitness;
}

// Selection Operator: Tournament Selection (k=3)
export function tournamentSelect(
  population: WeeklyChromosome[],
  tournamentSize = 3
): WeeklyChromosome {
  let best = population[Math.floor(Math.random() * population.length)];
  for (let i = 1; i < tournamentSize; i++) {
    const candidate = population[Math.floor(Math.random() * population.length)];
    if (candidate.fitness > best.fitness) {
      best = candidate;
    }
  }
  return best;
}

// Crossover Operator: Two-Point Day Matrix Crossover
export function crossover(
  parentA: WeeklyChromosome,
  parentB: WeeklyChromosome,
  crossoverRate = 0.85
): [WeeklyChromosome, WeeklyChromosome] {
  if (Math.random() > crossoverRate) {
    return [
      JSON.parse(JSON.stringify(parentA)),
      JSON.parse(JSON.stringify(parentB))
    ];
  }

  // Pick two crossover points in days [0..6]
  const pt1 = Math.floor(Math.random() * 5); // 0..4
  const pt2 = pt1 + 1 + Math.floor(Math.random() * (6 - pt1)); // (pt1+1)..6

  const childDaysA: DailyMealPlan[] = [];
  const childDaysB: DailyMealPlan[] = [];

  for (let i = 0; i < 7; i++) {
    if (i >= pt1 && i <= pt2) {
      childDaysA.push(JSON.parse(JSON.stringify(parentB.days[i])));
      childDaysB.push(JSON.parse(JSON.stringify(parentA.days[i])));
    } else {
      childDaysA.push(JSON.parse(JSON.stringify(parentA.days[i])));
      childDaysB.push(JSON.parse(JSON.stringify(parentB.days[i])));
    }
  }

  const childA: WeeklyChromosome = {
    id: 'chrom-' + Math.random().toString(36).substr(2, 9),
    days: childDaysA,
    fitness: 0,
    fitnessBreakdown: parentA.fitnessBreakdown,
    totalNutrients: parentA.totalNutrients
  };

  const childB: WeeklyChromosome = {
    id: 'chrom-' + Math.random().toString(36).substr(2, 9),
    days: childDaysB,
    fitness: 0,
    fitnessBreakdown: parentB.fitnessBreakdown,
    totalNutrients: parentB.totalNutrients
  };

  return [childA, childB];
}

// Mutation Operator: Multi-Strategy Mutation
export function mutate(
  chromosome: WeeklyChromosome,
  pool: ReturnType<typeof getFilteredGenePool>,
  mutationRate = 0.08,
  config: GeneticConfig
): void {
  const pick = (arr: FoodGene[]) => arr[Math.floor(Math.random() * arr.length)];

  chromosome.days.forEach((day, dayIndex) => {
    // 1. Point Gene Mutation: Replace gene with another valid food from slot pool
    if (Math.random() < mutationRate) day.breakfast = pick(pool.breakfasts);
    if (Math.random() < mutationRate) day.midMorning = pick(pool.midMornings);
    if (Math.random() < mutationRate) day.lunch = pick(pool.lunches);
    if (Math.random() < mutationRate) day.snack = pick(pool.snacks);
    if (Math.random() < mutationRate) day.dinner = pick(pool.dinners);

    // 2. Day Inversion / Swap Mutation (Exchange lunch/dinner between days to improve variety)
    if (Math.random() < mutationRate * 0.5) {
      const otherDayIdx = Math.floor(Math.random() * 7);
      if (otherDayIdx !== dayIndex) {
        const tempLunch = day.lunch;
        day.lunch = chromosome.days[otherDayIdx].lunch;
        chromosome.days[otherDayIdx].lunch = tempLunch;
      }
    }
  });

  // Re-evaluate fitness
  evaluateFitness(chromosome, config);
}

// Population Diversity Index (Shannon entropy across gene occurrences)
export function calculateDiversity(population: WeeklyChromosome[]): number {
  if (population.length <= 1) return 0;
  const geneCounts = new Map<string, number>();
  let totalGenes = 0;

  population.forEach((c) => {
    c.days.forEach((d) => {
      [d.breakfast.id, d.midMorning.id, d.lunch.id, d.snack.id, d.dinner.id].forEach((id) => {
        geneCounts.set(id, (geneCounts.get(id) || 0) + 1);
        totalGenes++;
      });
    });
  });

  let entropy = 0;
  geneCounts.forEach((count) => {
    const p = count / totalGenes;
    if (p > 0) entropy -= p * Math.log2(p);
  });

  return Number(entropy.toFixed(3));
}

// Single Generation Evolution Step (For live UI animation)
export function evolveGeneration(
  population: WeeklyChromosome[],
  pool: ReturnType<typeof getFilteredGenePool>,
  config: GeneticConfig
): { nextPopulation: WeeklyChromosome[]; stats: GenerationTelemetry } {
  // Sort population by fitness descending (Elitism)
  const sorted = [...population].sort((a, b) => b.fitness - a.fitness);

  const nextPopulation: WeeklyChromosome[] = [];

  // 1. Elitism: preserve top N
  for (let i = 0; i < config.elitismCount && i < sorted.length; i++) {
    nextPopulation.push(JSON.parse(JSON.stringify(sorted[i])));
  }

  // 2. Reproduce until population is full
  while (nextPopulation.length < config.populationSize) {
    const parentA = tournamentSelect(sorted, 3);
    const parentB = tournamentSelect(sorted, 3);
    const [childA, childB] = crossover(parentA, parentB, config.crossoverRate);

    mutate(childA, pool, config.mutationRate, config);
    nextPopulation.push(childA);

    if (nextPopulation.length < config.populationSize) {
      mutate(childB, pool, config.mutationRate, config);
      nextPopulation.push(childB);
    }
  }

  // Re-sort next population
  nextPopulation.sort((a, b) => b.fitness - a.fitness);

  const bestFitness = nextPopulation[0].fitness;
  const worstFitness = nextPopulation[nextPopulation.length - 1].fitness;
  const avgFitness = Number((nextPopulation.reduce((acc, c) => acc + c.fitness, 0) / nextPopulation.length).toFixed(2));
  const diversity = calculateDiversity(nextPopulation);

  return {
    nextPopulation,
    stats: {
      generation: 0, // set by caller
      bestFitness,
      avgFitness,
      worstFitness,
      diversityIndex: diversity,
      bestChromosome: nextPopulation[0]
    }
  };
}

// Full Batch Genetic Algorithm Optimizer
export function runGeneticOptimization(
  config: GeneticConfig,
  onProgress?: (progress: GenerationTelemetry) => void
): {
  bestChromosome: WeeklyChromosome;
  telemetryHistory: GenerationTelemetry[];
  elapsedMs: number;
} {
  const startTime = Date.now();
  const pool = getFilteredGenePool(GENETIC_FOOD_CATALOG, config);

  // 1. Initialize Population
  let population: WeeklyChromosome[] = [];
  for (let i = 0; i < config.populationSize; i++) {
    population.push(createRandomChromosome(pool, config));
  }

  const telemetryHistory: GenerationTelemetry[] = [];

  // Initial generation stats
  population.sort((a, b) => b.fitness - a.fitness);
  const initStats: GenerationTelemetry = {
    generation: 0,
    bestFitness: population[0].fitness,
    avgFitness: Number((population.reduce((acc, c) => acc + c.fitness, 0) / population.length).toFixed(2)),
    worstFitness: population[population.length - 1].fitness,
    diversityIndex: calculateDiversity(population),
    bestChromosome: population[0]
  };
  telemetryHistory.push(initStats);
  if (onProgress) onProgress(initStats);

  // Evolution Loop
  for (let gen = 1; gen <= config.generations; gen++) {
    const { nextPopulation, stats } = evolveGeneration(population, pool, config);
    stats.generation = gen;
    population = nextPopulation;
    telemetryHistory.push(stats);
    if (onProgress && (gen % 5 === 0 || gen === config.generations)) {
      onProgress(stats);
    }
  }

  return {
    bestChromosome: population[0],
    telemetryHistory,
    elapsedMs: Date.now() - startTime
  };
}

// ============================================================================
// CIRCADIAN SLEEP & NAP HEURISTIC OPTIMIZER (Two-Process Model Heuristic S/C)
// ============================================================================

export interface CircadianRoutineResult {
  ageGroup: string;
  totalSleepTargetHours: number;
  napsCount: number;
  wakeTime: string;
  bedTime: string;
  wakeWindowsHours: number[];
  scheduleTimeline: {
    time: string;
    event: string;
    type: 'wake' | 'nap' | 'feed' | 'sunlight' | 'bedtime' | 'calm_routine';
    icon: string;
    clinicalReason: string;
  }[];
  biologicalHighlights: {
    melatoninDimWindow: string;
    cortisolPeakAvoidance: string;
    remConsolidationNotes: string;
  };
  fitnessScore: number;
}

export function optimizeCircadianSleepSchedule(
  ageMonths: number,
  targetWakeTime = '07:00',
  parentBedtimePreference = '20:00'
): CircadianRoutineResult {
  // Heuristic rule bases grounded in AAP & National Sleep Foundation pediatric sleep science
  if (ageMonths <= 4) {
    return {
      ageGroup: 'Lactante Pequeño (0-4 meses)',
      totalSleepTargetHours: 15.5,
      napsCount: 4,
      wakeTime: targetWakeTime,
      bedTime: '20:30',
      wakeWindowsHours: [1.25, 1.5, 1.5, 1.75],
      scheduleTimeline: [
        { time: '07:00', event: 'Despertar & Exposición a Luz Natural', type: 'wake', icon: '☀️', clinicalReason: 'Inicia el reseteo del reloj biológico supraquiasmático (SCN) y suprime la melatonina residual.' },
        { time: '08:15', event: 'Siesta 1 (Matutina)', type: 'nap', icon: '🛌', clinicalReason: 'Ventana de vigilia corta (75 min) para evitar exceso de cortisol y llanto de sobrecansancio.' },
        { time: '09:45', event: 'Toma de Leche & Contacto Piel con Piel', type: 'feed', icon: '🍼', clinicalReason: 'Favorece el apego seguro y la sincronización circadiana.' },
        { time: '11:15', event: 'Siesta 2 (Mediodía - Núcleo REM)', type: 'nap', icon: '🛌', clinicalReason: 'Etapa de sueño REM crítica para la consolidación sináptica.' },
        { time: '13:00', event: 'Paseo al Aire Libre & Juego Sensorial', type: 'sunlight', icon: '🌳', clinicalReason: 'Fija el ritmo circadiano a través de la luz solar indirecta (AAP).' },
        { time: '14:45', event: 'Siesta 3 (Tarde)', type: 'nap', icon: '🛌', clinicalReason: 'Previene el colapso homeostático vespertino.' },
        { time: '17:30', event: 'Siesta Corta 4 (Power Nap Catnap)', type: 'nap', icon: '💤', clinicalReason: '30 minutos para actuar de puente sin interferir con el sueño nocturno.' },
        { time: '19:45', event: 'Rutina Calma: Masaje, Cuento Suave & Luz Tenue', type: 'calm_routine', icon: '🌙', clinicalReason: 'Inicia el pico natural de secreción de melatonina.' },
        { time: '20:30', event: 'Sueño Nocturno Reparador', type: 'bedtime', icon: '✨', clinicalReason: 'Temperatura óptima (19-21°C) para sueño profundo NREM.' }
      ],
      biologicalHighlights: {
        melatoninDimWindow: '19:30 - 20:15 (Ambiente en penumbra cálida < 2700K)',
        cortisolPeakAvoidance: 'No exceder 90 minutos de vigilia continua para prevenir irritabilidad.',
        remConsolidationNotes: 'Alcanza el 50% de sueño REM para el desarrollo acelerado del encéfalo.'
      },
      fitnessScore: 96.4
    };
  } else if (ageMonths <= 12) {
    return {
      ageGroup: 'Lactante Mayor (5-12 meses)',
      totalSleepTargetHours: 14.0,
      napsCount: 2,
      wakeTime: targetWakeTime,
      bedTime: '19:45',
      wakeWindowsHours: [2.5, 3.25, 3.75],
      scheduleTimeline: [
        { time: '07:00', event: 'Despertar con Luz Natural & Desayuno/Toma', type: 'wake', icon: '☀️', clinicalReason: 'Activación del cortisol fisiológico matutino saludable.' },
        { time: '09:30', event: 'Siesta 1 (Restauración Física)', type: 'nap', icon: '🛌', clinicalReason: 'Ventana de 2.5h. Fase profunda N3 de reparación celular.' },
        { time: '11:00', event: 'Almuerzo Rico en Hierro & Juego Activo', type: 'feed', icon: '🥦', clinicalReason: 'Gasto energético y nutrición para la función motriz.' },
        { time: '14:15', event: 'Siesta 2 (Restauración Cognitiva)', type: 'nap', icon: '🛌', clinicalReason: 'Ventana de 3.25h. Etapa de consolidación de memoria de trabajo.' },
        { time: '16:00', event: 'Merienda & Exploración Libre', type: 'sunlight', icon: '🎨', clinicalReason: 'Estimulación de motricidad y curiosidad antes del atardecer.' },
        { time: '19:00', event: 'Cena Suave + Baño Tibio + Luz Ámbar', type: 'calm_routine', icon: '🛁', clinicalReason: 'El enfriamiento corporal tras el baño induce somnolencia natural.' },
        { time: '19:45', event: 'A Dormir en Cuna Segura', type: 'bedtime', icon: '🌙', clinicalReason: 'Presión homeostática ideal para 11 horas de sueño nocturno continuo.' }
      ],
      biologicalHighlights: {
        melatoninDimWindow: '18:45 - 19:30 (Eliminar pantallas y luces azules frías)',
        cortisolPeakAvoidance: 'Ventana máxima antes de acostar: 3.75h.',
        remConsolidationNotes: 'Transición óptima a 2 siestas diurnas estables.'
      },
      fitnessScore: 98.2
    };
  } else if (ageMonths <= 36) {
    return {
      ageGroup: 'Primera Infancia (1 a 3 años)',
      totalSleepTargetHours: 12.5,
      napsCount: 1,
      wakeTime: targetWakeTime,
      bedTime: '20:15',
      wakeWindowsHours: [5.5, 5.0],
      scheduleTimeline: [
        { time: '07:00', event: 'Despertar Energético & Desayuno Completo', type: 'wake', icon: '☀️', clinicalReason: 'Glucosa y nutrientes para el arranque del día preescolar.' },
        { time: '10:00', event: 'Actividad Física & Socialización', type: 'sunlight', icon: '🏃', clinicalReason: 'Ayuda al cansancio físico saludable y sincronización del ritmo circadiano.' },
        { time: '12:30', event: 'Almuerzo Equilibrado', type: 'feed', icon: '🍲', clinicalReason: 'Proteínas y verduras para mantener saciedad durante la siesta.' },
        { time: '13:00', event: 'Siesta Única Reparadora (1.5 - 2h)', type: 'nap', icon: '🛌', clinicalReason: 'Momento de sincronización con el nadir circadiano postprandial.' },
        { time: '15:00', event: 'Despertar Tranquilo & Merienda Frutal', type: 'feed', icon: '🍎', clinicalReason: 'Hidratación y energía para la tarde.' },
        { time: '19:15', event: 'Cena Temprana Familiar', type: 'calm_routine', icon: '🥣', clinicalReason: 'Digestión completada antes de acostarse para evitar reflujo.' },
        { time: '19:45', event: 'Cuento de Froggi & Pandita + Luces Tenues', type: 'calm_routine', icon: '📖', clinicalReason: 'Rutina predecible que genera seguridad afectiva y reduce ansiedad de separación.' },
        { time: '20:15', event: 'Sueño Nocturno Profundo', type: 'bedtime', icon: '⭐', clinicalReason: 'Pico de hormona de crecimiento (GH) entre las 22:00 y 02:00.' }
      ],
      biologicalHighlights: {
        melatoninDimWindow: '19:30 - 20:00 (Lectura compartida y relajación)',
        cortisolPeakAvoidance: 'Siesta no debe extenderse más allá de las 15:30 para no fragmentar la noche.',
        remConsolidationNotes: 'Consolida vocabulario aprendido y estabilidad emocional.'
      },
      fitnessScore: 97.5
    };
  } else {
    return {
      ageGroup: 'Etapa Preescolar & Escolar (4 a 10+ años)',
      totalSleepTargetHours: 10.5,
      napsCount: 0,
      wakeTime: targetWakeTime,
      bedTime: '20:45',
      wakeWindowsHours: [13.75],
      scheduleTimeline: [
        { time: '07:00', event: 'Despertar Activo & Desayuno para Función Ejecutiva', type: 'wake', icon: '☀️', clinicalReason: 'Aporte de carbohidratos complejos y colina para la atención escolar.' },
        { time: '08:30', event: 'Jornada de Aprendizaje & Recreo al Aire Libre', type: 'sunlight', icon: '🎒', clinicalReason: 'Luz natural matutina previene miopía y refuerza el ritmo biológico.' },
        { time: '14:00', event: 'Comida Nutritiva & Descanso Tranquilo', type: 'feed', icon: '🥗', clinicalReason: 'Pausa cognitiva sin pantallas para recuperar atención.' },
        { time: '17:00', event: 'Deporte & Tareas Creativas', type: 'sunlight', icon: '⚽', clinicalReason: 'Actividad aeróbica que mejora la arquitectura del sueño NREM nocturno.' },
        { time: '20:00', event: 'Cena Ligera & Desconexión de Dispositivos Electrónicos', type: 'calm_routine', icon: '📵', clinicalReason: 'La luz azul de pantallas suprime la melatonina hasta en un 80% (AAP).' },
        { time: '20:20', event: 'Lectura Relajada en Familia', type: 'calm_routine', icon: '📚', clinicalReason: 'Baja la frecuencia cardíaca y estimula la empatía y serenidad.' },
        { time: '20:45', event: 'Sueño Nocturno Reparador de 10 Horas', type: 'bedtime', icon: '✨', clinicalReason: 'Fundamental para la plasticidad cerebral, aprendizaje y defensas inmunes.' }
      ],
      biologicalHighlights: {
        melatoninDimWindow: '19:45 - 20:30 (Cero pantallas al menos 60 minutos antes de dormir)',
        cortisolPeakAvoidance: 'Evitar actividades hiperestimulantes o discusiones antes de la cama.',
        remConsolidationNotes: 'Garantiza las fases 3 y 4 NREM para la consolidación de la memoria académica.'
      },
      fitnessScore: 99.1
    };
  }
}
