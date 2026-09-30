import React, { useState, useEffect, useRef } from 'react';
import { useFamily } from '../context/FamilyContext';
import { useTheme } from '../context/ThemeContext';
import { AgeBracket } from '../types';
import {
  FoodGene,
  GENETIC_FOOD_CATALOG,
  AGE_NUTRITIONAL_TARGETS,
  PediatricRDA
} from '../data/geneticFoodDataset';
import {
  WeeklyChromosome,
  GeneticConfig,
  GenerationTelemetry,
  getFilteredGenePool,
  createRandomChromosome,
  evolveGeneration,
  runGeneticOptimization,
  optimizeCircadianSleepSchedule,
  CircadianRoutineResult
} from '../utils/geneticAlgorithm';
import { FroggiAvatar, PanditaAvatar, MonitoAvatar, CaracolitoAvatar } from './MascotSVGs';
import {
  Dna,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  Apple,
  Moon,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  ShoppingCart,
  BookOpen,
  Sliders,
  Flame,
  Info,
  Calendar,
  Layers,
  Save,
  Share2,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface GeneticOptimizerProps {
  selectedAge: AgeBracket;
  setSelectedAge: (age: AgeBracket) => void;
}

export const GeneticOptimizer: React.FC<GeneticOptimizerProps> = ({
  selectedAge,
  setSelectedAge
}) => {
  const { activeChild, addHistoryRecord } = useFamily();
  const { currentTheme, playUiSound, config } = useTheme();

  // Active Tab Mode
  const [activeMode, setActiveMode] = useState<'meal_plan' | 'sleep_circadian' | 'telemetry_lab'>('meal_plan');

  // GA Hyperparameters & Constraints
  const [populationSize, setPopulationSize] = useState<number>(40);
  const [generationsCount, setGenerationsCount] = useState<number>(40);
  const [mutationRate, setMutationRate] = useState<number>(0.08);
  const [crossoverRate, setCrossoverRate] = useState<number>(0.85);

  // Health and Lifestyle Goals
  const [excludedAllergens, setExcludedAllergens] = useState<('dairy' | 'egg' | 'gluten' | 'nuts' | 'soy' | 'fish' | 'shellfish')[]>([]);
  const [prioritizeQuickPrep, setPrioritizeQuickPrep] = useState<boolean>(false);
  const [prioritizeIron, setPrioritizeIron] = useState<boolean>(true);
  const [prioritizeDHA, setPrioritizeDHA] = useState<boolean>(true);
  const [prioritizeBLW, setPrioritizeBLW] = useState<boolean>(selectedAge === '0-12m');

  // Population & Evolution State
  const [population, setPopulation] = useState<WeeklyChromosome[]>([]);
  const [currentGeneration, setCurrentGeneration] = useState<number>(0);
  const [bestChromosome, setBestChromosome] = useState<WeeklyChromosome | null>(null);
  const [telemetryHistory, setTelemetryHistory] = useState<GenerationTelemetry[]>([]);
  const [isEvolving, setIsEvolving] = useState<boolean>(false);
  const [evolutionSpeedMs, setEvolutionSpeedMs] = useState<number>(100);

  // Selected Day in Weekly Chromosome
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Gemini 3.7 Clinical Oracle State
  const [isOracleLoading, setIsOracleLoading] = useState<boolean>(false);
  const [oracleReport, setOracleReport] = useState<any | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Circadian Sleep State
  const [targetWakeTime, setTargetWakeTime] = useState<string>('07:00');
  const [sleepRoutineResult, setSleepRoutineResult] = useState<CircadianRoutineResult | null>(null);

  const animationTimerRef = useRef<any>(null);

  // Helper config object
  const getGAConfig = (): GeneticConfig => ({
    populationSize,
    generations: generationsCount,
    crossoverRate,
    mutationRate,
    elitismCount: 2,
    targetAge: selectedAge,
    childAgeMonths: activeChild?.ageMonths,
    excludedAllergens,
    prioritizeQuickPrep,
    prioritizeIron,
    prioritizeDHA,
    prioritizeBLW
  });

  // Initialize or Reset Population
  const handleResetPopulation = () => {
    playUiSound('click');
    setIsEvolving(false);
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);

    const cfg = getGAConfig();
    const pool = getFilteredGenePool(GENETIC_FOOD_CATALOG, cfg);
    const initialPop: WeeklyChromosome[] = [];
    for (let i = 0; i < populationSize; i++) {
      initialPop.push(createRandomChromosome(pool, cfg));
    }
    initialPop.sort((a, b) => b.fitness - a.fitness);

    setPopulation(initialPop);
    setCurrentGeneration(0);
    setBestChromosome(initialPop[0]);

    const initialTelemetry: GenerationTelemetry = {
      generation: 0,
      bestFitness: initialPop[0].fitness,
      avgFitness: Number((initialPop.reduce((acc, c) => acc + c.fitness, 0) / initialPop.length).toFixed(2)),
      worstFitness: initialPop[initialPop.length - 1].fitness,
      diversityIndex: 1.0,
      bestChromosome: initialPop[0]
    };
    setTelemetryHistory([initialTelemetry]);
    setOracleReport(null);
  };

  // Run full evolution batch instantly
  const handleRunFullBatch = () => {
    playUiSound('success');
    setIsEvolving(false);
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);

    const cfg = getGAConfig();
    const { bestChromosome: best, telemetryHistory: history } = runGeneticOptimization(cfg);
    setBestChromosome(best);
    setTelemetryHistory(history);
    setCurrentGeneration(cfg.generations);
  };

  // Step 1 Generation
  const handleStepOneGeneration = () => {
    playUiSound('click');
    const cfg = getGAConfig();
    const pool = getFilteredGenePool(GENETIC_FOOD_CATALOG, cfg);
    const currPop = population.length > 0 ? population : [createRandomChromosome(pool, cfg)];

    const { nextPopulation, stats } = evolveGeneration(currPop, pool, cfg);
    const newGen = currentGeneration + 1;
    stats.generation = newGen;

    setPopulation(nextPopulation);
    setCurrentGeneration(newGen);
    setBestChromosome(nextPopulation[0]);
    setTelemetryHistory((prev) => [...prev, stats]);
  };

  // Toggle Live Animated Evolution
  const handleToggleEvolution = () => {
    playUiSound('click');
    if (isEvolving) {
      setIsEvolving(false);
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    } else {
      setIsEvolving(true);
    }
  };

  // Evolution timer effect
  useEffect(() => {
    if (isEvolving) {
      animationTimerRef.current = setInterval(() => {
        setPopulation((prevPop) => {
          const cfg = getGAConfig();
          const pool = getFilteredGenePool(GENETIC_FOOD_CATALOG, cfg);
          const curr = prevPop.length > 0 ? prevPop : [createRandomChromosome(pool, cfg)];
          const { nextPopulation, stats } = evolveGeneration(curr, pool, cfg);

          setCurrentGeneration((prevGen) => {
            const nextGen = prevGen + 1;
            stats.generation = nextGen;
            setTelemetryHistory((hist) => [...hist.slice(-80), stats]);
            setBestChromosome(nextPopulation[0]);

            if (nextGen >= generationsCount) {
              setIsEvolving(false);
              clearInterval(animationTimerRef.current);
            }
            return nextGen;
          });

          return nextPopulation;
        });
      }, evolutionSpeedMs);
    } else {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    }
    return () => {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    };
  }, [isEvolving, evolutionSpeedMs, populationSize, generationsCount, mutationRate, crossoverRate, selectedAge, excludedAllergens, prioritizeQuickPrep, prioritizeIron, prioritizeDHA, prioritizeBLW]);

  // Initial Population Setup on mount or age change
  useEffect(() => {
    handleResetPopulation();
  }, [selectedAge]);

  // Circadian Sleep Schedule calculation on age change
  useEffect(() => {
    const ageMonths = activeChild?.ageMonths || (selectedAge === '0-12m' ? 8 : selectedAge === '1-3y' ? 24 : selectedAge === '4-6y' ? 48 : 84);
    const res = optimizeCircadianSleepSchedule(ageMonths, targetWakeTime);
    setSleepRoutineResult(res);
  }, [selectedAge, activeChild, targetWakeTime]);

  // Call Gemini 3.7 Flash Clinical Oracle
  const handleConsultOracle = async () => {
    if (!bestChromosome) return;
    playUiSound('success');
    setIsOracleLoading(true);
    try {
      const response = await fetch('/api/genetic-optimizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chromosome: bestChromosome,
          targetAge: selectedAge,
          childName: activeChild?.name || 'mi peque',
          excludedAllergens,
          specialGoal: `Hierro: ${prioritizeIron ? 'Alto' : 'Normal'}, DHA: ${prioritizeDHA ? 'Alto' : 'Normal'}, BLW: ${prioritizeBLW ? 'Sí' : 'No'}, Rápido: ${prioritizeQuickPrep ? 'Sí' : 'No'}`
        })
      });

      if (!response.ok) throw new Error('Error al consultar el oráculo');
      const data = await response.json();
      setOracleReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOracleLoading(false);
    }
  };

  // Save to Family Records
  const handleSaveToRecords = () => {
    if (!bestChromosome) return;
    playUiSound('success');
    addHistoryRecord({
      type: 'genetic',
      title: `Plan Nutricional Genético Evolucionado (${selectedAge})`,
      summary: `Fitness ${bestChromosome.fitness} pts. Calorías: ${bestChromosome.totalNutrients.caloriesKcal} kcal, Hierro: ${bestChromosome.totalNutrients.ironMg}mg, Calcio: ${bestChromosome.totalNutrients.calciumMg}mg, DHA: ${bestChromosome.totalNutrients.dhaOmega3Mg}mg. Alérgenos excluidos: ${excludedAllergens.length > 0 ? excludedAllergens.join(', ') : 'Ninguno'}.`,
      data: {
        chromosome: bestChromosome,
        oracleReport,
        targetAge: selectedAge,
        allergens: excludedAllergens
      }
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const toggleAllergen = (allergen: 'dairy' | 'egg' | 'gluten' | 'nuts' | 'soy' | 'fish' | 'shellfish') => {
    playUiSound('click');
    setExcludedAllergens((prev) =>
      prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
    );
  };

  const currentRDA = AGE_NUTRITIONAL_TARGETS[selectedAge] || AGE_NUTRITIONAL_TARGETS['1-3y'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border shadow-sm transition-colors ${
        config.theme === 'dark'
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
              <Dna className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight">
                  Optimizador Genético & Heurístico Pediátrico
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                  Algoritmo Evolutivo Multi-Objetivo
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Evoluciona planes nutricionales óptimos, dietas BLW sin alérgenos y cronogramas circadianos de sueño con algoritmos genéticos y evaluación clínica de <strong>Gemini 3.7 Flash</strong>.
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 self-stretch md:self-auto">
            <button
              id="mode-tab-meal-plan"
              onClick={() => {
                playUiSound('click');
                setActiveMode('meal_plan');
              }}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'meal_plan'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Apple className="w-4 h-4" />
              <span>Menú BLW Evolutivo</span>
            </button>

            <button
              id="mode-tab-sleep-circadian"
              onClick={() => {
                playUiSound('click');
                setActiveMode('sleep_circadian');
              }}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'sleep_circadian'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Sueño Circadiano Heurístico</span>
            </button>

            <button
              id="mode-tab-telemetry-lab"
              onClick={() => {
                playUiSound('click');
                setActiveMode('telemetry_lab');
              }}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'telemetry_lab'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Laboratorio Genético</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: NUTRITIONAL GENETIC ALGORITHM & BLW PLANNER */}
      {/* ========================================================================= */}
      {activeMode === 'meal_plan' && (
        <div className="space-y-6">
          {/* Controls & Configuration Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Genetic Parameters & Child Profile */}
            <div className={`p-5 rounded-2xl border ${
              config.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            } space-y-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Sliders className="w-4 h-4 text-emerald-500" />
                  <span>Configuración del Algoritmo</span>
                </div>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-mono text-slate-500">
                  Gen: {currentGeneration}/{generationsCount}
                </span>
              </div>

              {/* Age Bracket Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                  Etapa de Desarrollo Pediátrico
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['0-12m', '1-3y', '4-6y', '7-10y+'] as AgeBracket[]).map((age) => (
                    <button
                      key={age}
                      onClick={() => {
                        playUiSound('click');
                        setSelectedAge(age);
                        if (age === '0-12m') setPrioritizeBLW(true);
                      }}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        selectedAge === age
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-300'
                      }`}
                    >
                      {age === '0-12m' ? '0 a 12m (BLW)' : age === '1-3y' ? '1 a 3 años' : age === '4-6y' ? '4 a 6 años' : '7 a 10+ años'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Allergen Barrier Filters */}
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 flex items-center justify-between">
                  <span>Barrera de Alérgenos (Penalización ∞)</span>
                  <span className="text-[10px] text-rose-500 font-bold">
                    {excludedAllergens.length > 0 ? `${excludedAllergens.length} activos` : 'Sin exclusión'}
                  </span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'dairy', label: 'Lácteos / APLV' },
                    { id: 'egg', label: 'Huevo' },
                    { id: 'gluten', label: 'Gluten' },
                    { id: 'nuts', label: 'Frutos Secos' },
                    { id: 'fish', label: 'Pescado' },
                    { id: 'soy', label: 'Soya' }
                  ].map((all) => {
                    const isSelected = excludedAllergens.includes(all.id as any);
                    return (
                      <button
                        key={all.id}
                        onClick={() => toggleAllergen(all.id as any)}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        {isSelected ? `✕ Sin ${all.label}` : all.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Strategic Heuristics */}
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">
                  Pesos Heurísticos de Aptitud (Fitness)
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prioritizeIron}
                      onChange={(e) => setPrioritizeIron(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-0"
                    />
                    <span className="font-medium">Hierro + Vitamina C</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prioritizeDHA}
                      onChange={(e) => setPrioritizeDHA(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-0"
                    />
                    <span className="font-medium">DHA Omega-3</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prioritizeBLW}
                      onChange={(e) => setPrioritizeBLW(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-0"
                    />
                    <span className="font-medium">Textura BLW Segura</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prioritizeQuickPrep}
                      onChange={(e) => setPrioritizeQuickPrep(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-0"
                    />
                    <span className="font-medium">Rápido (&lt;15 min)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Column 2: Evolutionary Live Simulation & Action Controls */}
            <div className={`p-5 rounded-2xl border ${
              config.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            } flex flex-col justify-between space-y-4`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Control de Evolución en Vivo</span>
                  </div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Fitness: {bestChromosome?.fitness || 0} pts
                  </span>
                </div>

                {/* Progress Bar & Generational Telemetry */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Progreso de Generaciones</span>
                    <span className="font-mono">{Math.round((currentGeneration / generationsCount) * 100)}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-150"
                      style={{ width: `${Math.min(100, (currentGeneration / generationsCount) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Mini Telemetry Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Población</div>
                    <div className="text-base font-black text-slate-800 dark:text-slate-100">{populationSize} cromosomas</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Mutación (μ)</div>
                    <div className="text-base font-black text-amber-600 dark:text-amber-400">{Math.round(mutationRate * 100)}%</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">Cruce (Pc)</div>
                    <div className="text-base font-black text-teal-600 dark:text-teal-400">{Math.round(crossoverRate * 100)}%</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    id="ga-toggle-btn"
                    onClick={handleToggleEvolution}
                    className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 text-white transition-all cursor-pointer shadow-sm ${
                      isEvolving
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {isEvolving ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isEvolving ? 'Pausar Simulación' : 'Evolucionar en Vivo'}</span>
                  </button>

                  <button
                    id="ga-step-btn"
                    onClick={handleStepOneGeneration}
                    disabled={isEvolving}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
                    title="Avanzar 1 generación"
                  >
                    +1 Gen
                  </button>

                  <button
                    id="ga-batch-btn"
                    onClick={handleRunFullBatch}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-colors cursor-pointer"
                    title="Ejecutar todas las generaciones instantáneamente"
                  >
                    Auto-Optimizar
                  </button>

                  <button
                    id="ga-reset-btn"
                    onClick={handleResetPopulation}
                    className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    title="Reiniciar población inicial"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Column 3: Nutritional Fitness Breakdown vs OMS / AAP RDA */}
            <div className={`p-5 rounded-2xl border ${
              config.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            } space-y-3`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Promedios Diarios vs RDA OMS/AAP</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500">
                  {selectedAge}
                </span>
              </div>

              {bestChromosome && (
                <div className="space-y-2.5 text-xs">
                  {/* Iron */}
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="flex items-center gap-1">🩸 Hierro Total</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {bestChromosome.totalNutrients.ironMg} / {currentRDA.ironMg} mg
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(100, (bestChromosome.totalNutrients.ironMg / currentRDA.ironMg) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* DHA Omega 3 */}
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="flex items-center gap-1">🧠 DHA Omega-3</span>
                      <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                        {bestChromosome.totalNutrients.dhaOmega3Mg} / {currentRDA.dhaOmega3Mg} mg
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${Math.min(100, (bestChromosome.totalNutrients.dhaOmega3Mg / currentRDA.dhaOmega3Mg) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Calcium */}
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="flex items-center gap-1">🦴 Calcio Óseo</span>
                      <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                        {bestChromosome.totalNutrients.calciumMg} / {currentRDA.calciumMg} mg
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full"
                        style={{ width: `${Math.min(100, (bestChromosome.totalNutrients.calciumMg / currentRDA.calciumMg) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Calories & Protein */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">Calorías Diarias</span>
                      <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                        {bestChromosome.totalNutrients.caloriesKcal} kcal
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">Proteínas</span>
                      <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                        {bestChromosome.totalNutrients.proteinG} g
                      </span>
                    </div>
                  </div>

                  <div className="pt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Variedad alimentaria: <strong>{bestChromosome.fitnessBreakdown.varietyScore}/25</strong> pts</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* WEEKLY CHROMOSOME INSPECTOR (7 DAYS MATRIX) */}
          {/* ===================================================================== */}
          {bestChromosome && (
            <div className={`p-6 rounded-2xl border ${
              config.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            } space-y-4`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-lg font-bold">
                    Cromosoma Semanal Óptimo (7 Días × 5 Comidas)
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="consult-oracle-btn"
                    onClick={handleConsultOracle}
                    disabled={isOracleLoading}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isOracleLoading ? 'Consultando Gemini 3.7...' : 'Oráculo Clínico Gemini 3.7'}</span>
                  </button>

                  <button
                    id="save-plan-btn"
                    onClick={handleSaveToRecords}
                    className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-emerald-500" />
                    <span>{saveSuccess ? '¡Guardado!' : 'Guardar en Expediente'}</span>
                  </button>
                </div>
              </div>

              {/* Day Selector Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {bestChromosome.days.map((day, idx) => (
                  <button
                    key={day.dayIndex}
                    onClick={() => {
                      playUiSound('click');
                      setSelectedDayIndex(idx);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                      selectedDayIndex === idx
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-300'
                    }`}
                  >
                    {day.dayName}
                  </button>
                ))}
              </div>

              {/* 5 Meal Slots for the Selected Day */}
              {bestChromosome.days[selectedDayIndex] && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
                  {[
                    { label: 'Desayuno', key: 'breakfast', color: 'border-amber-400/40 bg-amber-50/40 dark:bg-amber-950/10' },
                    { label: 'Media Mañana', key: 'midMorning', color: 'border-teal-400/40 bg-teal-50/40 dark:bg-teal-950/10' },
                    { label: 'Almuerzo / Comida', key: 'lunch', color: 'border-emerald-400/40 bg-emerald-50/40 dark:bg-emerald-950/10' },
                    { label: 'Merienda', key: 'snack', color: 'border-sky-400/40 bg-sky-50/40 dark:bg-sky-950/10' },
                    { label: 'Cena Suave', key: 'dinner', color: 'border-indigo-400/40 bg-indigo-50/40 dark:bg-indigo-950/10' }
                  ].map((slot) => {
                    const food: FoodGene = (bestChromosome.days[selectedDayIndex] as any)[slot.key];
                    if (!food) return null;
                    return (
                      <div
                        key={slot.key}
                        className={`p-4 rounded-xl border ${slot.color} flex flex-col justify-between space-y-3 transition-all hover:shadow-xs`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              {slot.label}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                              {food.prepTimeMinutes} min
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                            {food.name}
                          </h4>

                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                            {food.pediatricHighlight}
                          </p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                          <div className="grid grid-cols-2 gap-1 font-mono text-slate-600 dark:text-slate-400">
                            <span>🔥 {food.caloriesKcal} kcal</span>
                            <span>🥩 {food.proteinG}g prot</span>
                            <span>🩸 {food.ironMg}mg Fe</span>
                            <span>🦴 {food.calciumMg}mg Ca</span>
                          </div>

                          {food.blwSafetyTip && (
                            <div className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded-md leading-tight">
                              💡 {food.blwSafetyTip}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ===================================================================== */}
          {/* GEMINI 3.7 FLASH ORACLE REPORT & RECIPES */}
          {/* ===================================================================== */}
          {oracleReport && (
            <div className={`p-6 rounded-2xl border shadow-sm ${
              config.theme === 'dark' ? 'bg-slate-900 border-emerald-900/60' : 'bg-white border-emerald-200'
            } space-y-6 animate-fadeIn`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <FroggiAvatar size={36} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    Dictamen Pediátrico del Oráculo IA (Gemini 3.7 Flash)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Evaluación clínica, recetas maestras con cortes BLW y lista de compra semanal.
                  </p>
                </div>
              </div>

              {/* Assessment Text */}
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-sm text-slate-800 dark:text-slate-200 space-y-2 whitespace-pre-line leading-relaxed">
                {oracleReport.clinicalAssessment}
              </div>

              {/* Safety Guidelines */}
              {oracleReport.pediatricSafetyGuidelines && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Directrices de Seguridad contra Atragantamiento (AAP)</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {oracleReport.pediatricSafetyGuidelines.map((guideline: string, i: number) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed"
                      >
                        {guideline}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured Recipes */}
              {oracleReport.featuredRecipes && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <ChefHat className="w-4 h-4 text-amber-500" />
                    <span>Recetas Maestras del Menú Evolucionado</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {oracleReport.featuredRecipes.map((rec: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                            {rec.recipeName}
                          </h5>
                          <span className="text-xs text-slate-500 font-mono">⏱️ {rec.prepTime}</span>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Ingredientes</span>
                          <ul className="text-xs text-slate-700 dark:text-slate-300 list-disc list-inside space-y-0.5">
                            {rec.ingredients?.map((ing: string, i: number) => (
                              <li key={i}>{ing}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Paso a Paso</span>
                          <ol className="text-xs text-slate-700 dark:text-slate-300 list-decimal list-inside space-y-1">
                            {rec.stepByStep?.map((st: string, i: number) => (
                              <li key={i}>{st}</li>
                            ))}
                          </ol>
                        </div>

                        <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300">
                          <strong>Textura según edad:</strong> {rec.textureAdjustmentForAge}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organized Shopping List */}
              {oracleReport.organizedShoppingList && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <ShoppingCart className="w-4 h-4 text-teal-500" />
                    <span>Lista de la Compra Semanal Organizada por Pasillos</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    {Object.entries(oracleReport.organizedShoppingList).map(([category, items]: [string, any]) => (
                      <div
                        key={category}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      >
                        <h6 className="font-bold text-slate-800 dark:text-slate-200 capitalize mb-2 border-b border-slate-200 dark:border-slate-700 pb-1">
                          {category.replace(/([A-Z])/g, ' $1')}
                        </h6>
                        <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                          {Array.isArray(items) && items.map((item: string, i: number) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Froggi Tip */}
              {oracleReport.froggiParentingTip && (
                <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-3">
                  <span className="text-xl shrink-0">🐸</span>
                  <p className="leading-relaxed">{oracleReport.froggiParentingTip}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: CIRCADIAN SLEEP & NAP HEURISTIC OPTIMIZER */}
      {/* ========================================================================= */}
      {activeMode === 'sleep_circadian' && sleepRoutineResult && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${
            config.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          } space-y-6`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Moon className="w-5 h-5 text-indigo-500" />
                  <span>Optimizador de Cronobiología Circadiana & Ventanas de Sueño</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Modelo Heurístico Borbély (Presión Homeostática S + Reloj Biológico C) adaptado a directrices AAP y NSF.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">
                    Hora habitual de despertar:
                  </label>
                  <input
                    type="time"
                    value={targetWakeTime}
                    onChange={(e) => setTargetWakeTime(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold font-mono"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-200/60 dark:border-indigo-800/40 text-center">
                  <span>Sueño Óptimo 24h:</span>
                  <div className="text-base font-black font-mono">{sleepRoutineResult.totalSleepTargetHours} Horas</div>
                </div>
              </div>
            </div>

            {/* Biological Highlights Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                  🌙 Ventana de Melatonina
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  {sleepRoutineResult.biologicalHighlights.melatoninDimWindow}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                  ⚠️ Control de Cortisol
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  {sleepRoutineResult.biologicalHighlights.cortisolPeakAvoidance}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
                  🧠 Consolidación REM
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  {sleepRoutineResult.biologicalHighlights.remConsolidationNotes}
                </p>
              </div>
            </div>

            {/* Timeline Schedule */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Cronograma Circadiano Recomendado ({sleepRoutineResult.ageGroup})
              </h3>

              <div className="relative border-l-2 border-indigo-200 dark:border-indigo-800 ml-4 space-y-4 py-2">
                {sleepRoutineResult.scheduleTimeline.map((item, index) => (
                  <div key={index} className="relative pl-6">
                    {/* Circle Node */}
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-500 flex items-center justify-center text-[8px]">
                      {item.icon}
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md">
                            {item.time}
                          </span>
                          <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                            {item.event}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {item.clinicalReason}
                        </p>
                      </div>

                      <span className="text-[10px] uppercase font-bold text-slate-500 px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0">
                        {item.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: TELEMETRY LAB & GENETIC VISUALIZER */}
      {/* ========================================================================= */}
      {activeMode === 'telemetry_lab' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${
            config.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          } space-y-6`}>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span>Laboratorio de Convergencia Genética & Curva de Aptitud</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Visualización de la evolución generacional del fitness máximo (F-máx), promedio poblacional (F-promedio) y entropía de diversidad génica.
              </p>
            </div>

            {/* SVG Convergence Graph */}
            <div className="p-4 rounded-xl bg-slate-950 text-white border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    Mejor Fitness (F-máx)
                  </span>
                  <span className="flex items-center gap-1.5 text-teal-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                    Fitness Promedio (F-promedio)
                  </span>
                </div>
                <span className="font-mono text-slate-400">Generaciones: {telemetryHistory.length}</span>
              </div>

              {telemetryHistory.length > 1 ? (
                <div className="w-full h-48 relative">
                  <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="30" x2="500" y2="30" stroke="#334155" strokeDasharray="4 4" />
                    <line x1="0" y1="75" x2="500" y2="75" stroke="#334155" strokeDasharray="4 4" />
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#334155" strokeDasharray="4 4" />

                    {/* Best Fitness Path */}
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      points={telemetryHistory.map((t, idx) => {
                        const x = (idx / (telemetryHistory.length - 1)) * 500;
                        const y = Math.max(10, Math.min(140, 140 - (t.bestFitness / 110) * 130));
                        return `${x},${y}`;
                      }).join(' ')}
                    />

                    {/* Avg Fitness Path */}
                    <polyline
                      fill="none"
                      stroke="#2dd4bf"
                      strokeWidth="2"
                      strokeDasharray="2 2"
                      points={telemetryHistory.map((t, idx) => {
                        const x = (idx / (telemetryHistory.length - 1)) * 500;
                        const y = Math.max(10, Math.min(140, 140 - (t.avgFitness / 110) * 130));
                        return `${x},${y}`;
                      }).join(' ')}
                    />
                  </svg>
                </div>
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-500 text-xs">
                  Inicia la simulación para trazar la curva de convergencia genética en tiempo real.
                </div>
              )}
            </div>

            {/* Genetic Operators & Mathematical Foundations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-500" />
                  <span>1. Selección por Torneo ($k=3$)</span>
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Se eligen 3 individuos aleatorios y el de mayor aptitud pasa al cruzamiento, manteniendo presión selectiva sin perder diversidad rápidamente.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Dna className="w-4 h-4 text-teal-500" />
                  <span>2. Cruce en 2 Puntos (Crossover)</span>
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Recombina matrices semanales completas entre progenitores para heredar patrones sinérgicos (ej. almuerzos ricos en hierro con cenas digestivas).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>3. Mutación Heurística Reparadora</span>
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Sustituye genes con probabilidad $\mu$ y aplica operadores de intercambio y co-activación de Vitamina C cuando el hierro es insuficiente.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
