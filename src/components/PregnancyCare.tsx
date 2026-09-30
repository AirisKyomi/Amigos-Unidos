/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Baby,
  Heart,
  Calendar,
  Sparkles,
  Volume2,
  VolumeX,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Apple,
  ShieldCheck,
  Stethoscope,
  BookOpen,
  Plus,
  Play,
  Pause,
  RotateCcw,
  ShoppingBag,
  Info,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Flame,
  Send,
  Loader2,
  Trash2
} from 'lucide-react';
import {
  PREGNANCY_WEEKS_DATASET,
  PREGNANCY_TRIMESTER_GUIDES,
  OBSTETRIC_RED_FLAGS,
  COMMON_PREGNANCY_SYMPTOMS,
  INITIAL_HOSPITAL_BAG_CHECKLIST
} from '../data/pregnancyDatasets';
import {
  PregnancyWeekInfo,
  HospitalBagItem,
  FetalKickRecord,
  ContractionRecord
} from '../types';
import { speakText, stopSpeech, isSpeechSupported } from '../utils/speechSynthesis';

interface PregnancyCareProps {
  onAddHistoryRecord?: (record: any) => void;
}

export const PregnancyCare: React.FC<PregnancyCareProps> = ({ onAddHistoryRecord }) => {
  // Navigation & Sub-views
  const [activeTab, setActiveTab] = useState<'semanas' | 'trimestres' | 'herramientas' | 'molestias' | 'alarmas' | 'froggi_embarazo'>('semanas');

  // Selected Pregnancy Week (default week 20)
  const [selectedWeek, setSelectedWeek] = useState<number>(20);
  const [lmpDate, setLmpDate] = useState<string>('');
  const [calculatedFPP, setCalculatedFPP] = useState<string | null>(null);

  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingTextId, setSpeakingTextId] = useState<string | null>(null);

  // Tools: Fetal Kick Counter
  const [kicksCount, setKicksCount] = useState<number>(0);
  const [kickTimerSeconds, setKickTimerSeconds] = useState<number>(0);
  const [isKickTimerRunning, setIsKickTimerRunning] = useState<boolean>(false);
  const [kickHistory, setKickHistory] = useState<FetalKickRecord[]>(() => {
    try {
      const saved = localStorage.getItem('froggi_kick_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Tools: Contraction Timer
  const [isContractionActive, setIsContractionActive] = useState<boolean>(false);
  const [currentContractionSeconds, setCurrentContractionSeconds] = useState<number>(0);
  const [contractionStartTime, setContractionStartTime] = useState<number | null>(null);
  const [contractionsList, setContractionsList] = useState<ContractionRecord[]>(() => {
    try {
      const saved = localStorage.getItem('froggi_contractions_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Tools: Hospital Bag Checklist
  const [bagItems, setBagItems] = useState<HospitalBagItem[]>(() => {
    try {
      const saved = localStorage.getItem('froggi_hospital_bag');
      return saved ? JSON.parse(saved) : INITIAL_HOSPITAL_BAG_CHECKLIST;
    } catch {
      return INITIAL_HOSPITAL_BAG_CHECKLIST;
    }
  });
  const [selectedBagCategory, setSelectedBagCategory] = useState<'todas' | 'mama' | 'bebe' | 'documentos' | 'acompanante'>('todas');
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'mama' | 'bebe' | 'documentos' | 'acompanante'>('mama');

  // AI Chat for Pregnancy
  const [pregnancyPrompt, setPregnancyPrompt] = useState('');
  const [pregnancyChatHistory, setPregnancyChatHistory] = useState<{ sender: 'user' | 'froggi'; text: string; time: string }[]>([
    {
      sender: 'froggi',
      text: '¡Hola, futura mamá o papá! 🐸🤰 Soy Froggi, tu acompañante de obstetricia y salud prenatal en Amigos Unidos. Puedo responder tus dudas sobre nutrición gestacional, síntomas por trimestre, preparación al parto o cuándo acudir a urgencias. ¡Pregúntame lo que necesites y también puedo leértelo con voz!',
      time: 'Ahora'
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Selected trimester for Guide
  const [selectedTrimester, setSelectedTrimester] = useState<1 | 2 | 3>(2);

  // Expandable symptom state
  const [expandedSymptomId, setExpandedSymptomId] = useState<string | null>(null);

  // Kick Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isKickTimerRunning) {
      interval = setInterval(() => {
        setKickTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isKickTimerRunning]);

  // Contraction Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isContractionActive) {
      interval = setInterval(() => {
        setCurrentContractionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isContractionActive]);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('froggi_hospital_bag', JSON.stringify(bagItems));
    } catch (e) {
      console.warn(e);
    }
  }, [bagItems]);

  useEffect(() => {
    try {
      localStorage.setItem('froggi_kick_history', JSON.stringify(kickHistory));
    } catch (e) {
      console.warn(e);
    }
  }, [kickHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('froggi_contractions_history', JSON.stringify(contractionsList));
    } catch (e) {
      console.warn(e);
    }
  }, [contractionsList]);

  // Stop speech when component unmounts
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Calculate Gestational Age & Due Date (Naegele Rule: LMP + 280 days / + 7 days - 3 months + 1 year)
  const handleCalculateFromLMP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lmpDate) return;

    const lmp = new Date(lmpDate);
    if (isNaN(lmp.getTime())) return;

    // FPP = LMP + 280 days (40 weeks)
    const fppDate = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    setCalculatedFPP(fppDate.toLocaleDateString('es-ES', options));

    // Calculate current weeks
    const today = new Date();
    const diffMs = today.getTime() - lmp.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const currentWeek = Math.max(1, Math.min(42, Math.floor(diffDays / 7) + 1));
    setSelectedWeek(currentWeek);

    // Find matching dataset week or closest
    handleReadText(
      `Con tu última fecha de regla, estás cursando aproximadamente la semana ${currentWeek} de embarazo. Tu Fecha Probable de Parto estimada es el ${fppDate.toLocaleDateString('es-ES', options)}.`,
      'calc_fpp'
    );
  };

  // Find current week dataset (find exact or closest)
  const currentWeekData: PregnancyWeekInfo =
    PREGNANCY_WEEKS_DATASET.find((w) => w.week === selectedWeek) ||
    PREGNANCY_WEEKS_DATASET.reduce((prev, curr) =>
      Math.abs(curr.week - selectedWeek) < Math.abs(prev.week - selectedWeek) ? curr : prev
    );

  // Audio Speech Handler
  const handleReadText = (text: string, id: string) => {
    if (isSpeaking && speakingTextId === id) {
      stopSpeech();
      setIsSpeaking(false);
      setSpeakingTextId(null);
      return;
    }

    stopSpeech();
    setIsSpeaking(true);
    setSpeakingTextId(id);

    speakText(text, {
      rate: 1.0,
      pitch: 1.05,
      onStart: () => {
        setIsSpeaking(true);
        setSpeakingTextId(id);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setSpeakingTextId(null);
      },
      onError: () => {
        setIsSpeaking(false);
        setSpeakingTextId(null);
      }
    });
  };

  // Kick Counter Actions
  const handleAddKick = () => {
    if (!isKickTimerRunning) {
      setIsKickTimerRunning(true);
    }
    const nextCount = kicksCount + 1;
    setKicksCount(nextCount);

    if (nextCount === 10) {
      // Goal reached
      setIsKickTimerRunning(false);
      const minutes = Math.ceil(kickTimerSeconds / 60) || 1;
      const newRecord: FetalKickRecord = {
        id: 'kick_' + Date.now(),
        timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        durationMinutes: minutes,
        kicksCount: 10,
        targetKicks: 10,
        status: 'completado_optimo',
        notes: `10 movimientos completados en ${minutes} minutos. Excelente reactividad fetal.`
      };
      setKickHistory([newRecord, ...kickHistory.slice(0, 9)]);

      if (onAddHistoryRecord) {
        onAddHistoryRecord({
          id: newRecord.id,
          type: 'pregnancy',
          timestamp: new Date().toISOString(),
          title: 'Sesión de Movimientos Fetales',
          summary: `10 movimientos en ${minutes} min (Semana ${selectedWeek})`,
          details: newRecord
        });
      }

      handleReadText(
        `¡Excelente noticia! Has alcanzado los 10 movimientos fetales en ${minutes} minutos. Tu bebé muestra un patrón de vitalidad óptimo según las directrices obstétricas.`,
        'kick_goal'
      );
    }
  };

  const handleResetKicks = () => {
    setIsKickTimerRunning(false);
    setKicksCount(0);
    setKickTimerSeconds(0);
  };

  // Contraction Timer Actions
  const handleToggleContraction = () => {
    const now = Date.now();

    if (!isContractionActive) {
      // Start new contraction
      setIsContractionActive(true);
      setCurrentContractionSeconds(0);
      setContractionStartTime(now);
    } else {
      // End current contraction
      setIsContractionActive(false);
      const durationSec = currentContractionSeconds;
      let intervalMin = 0;

      if (contractionsList.length > 0 && contractionStartTime) {
        const lastStartTime = new Date(contractionsList[0].startTime).getTime();
        intervalMin = Math.round((contractionStartTime - lastStartTime) / (1000 * 60));
      }

      const intensity: 'leve' | 'moderada' | 'fuerte' =
        durationSec > 55 ? 'fuerte' : durationSec > 35 ? 'moderada' : 'leve';

      const newContraction: ContractionRecord = {
        id: 'c_' + Date.now(),
        startTime: new Date(contractionStartTime || now).toISOString(),
        durationSeconds: durationSec,
        intervalMinutes: intervalMin > 0 ? intervalMin : 0,
        intensity
      };

      const updated = [newContraction, ...contractionsList.slice(0, 19)];
      setContractionsList(updated);
      setCurrentContractionSeconds(0);
      setContractionStartTime(null);

      // Check 5-1-1 Rule (contracciones rítmicas cada 5 min durante 1 hora)
      if (updated.length >= 4) {
        const recent4 = updated.slice(0, 4);
        const avgInterval = recent4.reduce((acc, c) => acc + (c.intervalMinutes || 5), 0) / 4;
        const avgDuration = recent4.reduce((acc, c) => acc + c.durationSeconds, 0) / 4;

        if (avgInterval <= 5 && avgDuration >= 50) {
          handleReadText(
            '¡Atención! Tus contracciones cumplen con el patrón 5-1-1: están ocurriendo cada 5 minutos o menos y duran cerca de 1 minuto. Te sugerimos contactar a tu matrona o acudir al hospital de maternidad.',
            'alert_511'
          );
        }
      }
    }
  };

  const handleClearContractions = () => {
    setContractionsList([]);
    setIsContractionActive(false);
    setCurrentContractionSeconds(0);
  };

  // Hospital Bag Toggle & Add
  const handleToggleBagItem = (id: string) => {
    setBagItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleAddCustomBagItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemLabel.trim()) return;

    const newItem: HospitalBagItem = {
      id: 'bag_' + Date.now(),
      category: newItemCategory,
      label: newItemLabel.trim(),
      description: 'Elemento añadido a tu lista personalizada.',
      checked: false,
      essential: false
    };

    setBagItems((prev) => [newItem, ...prev]);
    setNewItemLabel('');
  };

  const handleDeleteBagItem = (id: string) => {
    setBagItems((prev) => prev.filter((item) => item.id !== id));
  };

  // AI Chat Submission
  const handleSendPregnancyChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pregnancyPrompt.trim() || isChatLoading) return;

    const userText = pregnancyPrompt.trim();
    const nowTime = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    setPregnancyChatHistory((prev) => [...prev, { sender: 'user', text: userText, time: nowTime }]);
    setPregnancyPrompt('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/pediatric-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `[CONSULTA DE EMBARAZO Y SALUD MATERNA - Semana ${selectedWeek} de gestación]: ${userText}`,
          childAge: `Embarazo Semana ${selectedWeek}`,
          context: `Etapa de embarazo semana ${selectedWeek}, trimestre ${selectedWeek <= 13 ? 1 : selectedWeek <= 27 ? 2 : 3}. El usuario busca orientación obstétrica, bienestar materno y cuidados prenatales basados en directrices de ACOG, OMS y SEGO.`,
          history: pregnancyChatHistory
        })
      });

      const data = await response.json();
      const reply = data.reply || 'Estoy aquí para acompañarte en cada semana de tu embarazo.';

      const froggiReply = {
        sender: 'froggi' as const,
        text: reply,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };

      setPregnancyChatHistory((prev) => [...prev, froggiReply]);

      // Automatically speak Froggi's answer
      handleReadText(reply, 'chat_last_' + Date.now());
    } catch (err) {
      console.error(err);
      const fallbackReply = {
        sender: 'froggi' as const,
        text: `Para la semana ${selectedWeek} de embarazo: Mantén una hidratación óptima (2 a 2.5 litros de agua al día), continúa con tu suplemento de ácido fólico o multivitamínico prenatal y consulta a tu matrona o ginecólogo si presentas dolor punzante, sangrado o disminución de movimientos.`,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      setPregnancyChatHistory((prev) => [...prev, fallbackReply]);
      handleReadText(fallbackReply.text, 'chat_fallback');
    } finally {
      setIsChatLoading(false);
    }
  };

  // Filter bag items
  const filteredBagItems =
    selectedBagCategory === 'todas'
      ? bagItems
      : bagItems.filter((item) => item.category === selectedBagCategory);

  const checkedCount = bagItems.filter((i) => i.checked).length;
  const bagProgressPct = Math.round((checkedCount / Math.max(1, bagItems.length)) * 100);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner & Audio Status */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-rose-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Módulo de Embarazo & Salud Materna IA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Acompañamiento Gestacional & Prenatal con Froggi
            </h1>
            <p className="text-rose-100 text-sm max-w-2xl">
              Datasets clínicos semana a semana basados en ACOG, OMS y SEGO, herramientas obstétricas de precisión (pataditas, contracciones, maleta) y lectura con voz en audio de todas las recomendaciones.
            </p>
          </div>

          {/* Global Voice Status Control */}
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/20 p-3 rounded-2xl self-start md:self-auto">
            <div className={`p-2 rounded-xl ${isSpeaking ? 'bg-amber-400 text-slate-900 animate-pulse' : 'bg-white/20 text-white'}`}>
              {isSpeaking ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs font-bold">Voz de Froggi</div>
              <div className="text-[11px] text-rose-100">
                {isSpeaking ? 'Leyendo respuesta con audio...' : 'Pulsa los botones 🔊 para escuchar'}
              </div>
            </div>
            {isSpeaking && (
              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  setIsSpeaking(false);
                  setSpeakingTextId(null);
                }}
                className="px-2.5 py-1 bg-white text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Detener
              </button>
            )}
          </div>
        </div>

        {/* Gestational Age Quick Selector & LMP Calculator Bar */}
        <div className="mt-6 pt-5 border-t border-white/20 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Week Slider */}
          <div className="lg:col-span-7 bg-black/20 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-pink-200">
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>Semana de Gestación Seleccionada:</span>
              </span>
              <span className="bg-white text-rose-700 px-3 py-0.5 rounded-full text-xs font-black shadow-xs">
                Semana {selectedWeek} ({selectedWeek <= 13 ? '1° Trimestre' : selectedWeek <= 27 ? '2° Trimestre' : '3° Trimestre'})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedWeek((w) => Math.max(4, w - 1))}
                disabled={selectedWeek <= 4}
                className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <input
                type="range"
                min="4"
                max="40"
                step="1"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer accent-amber-300"
              />
              <button
                type="button"
                onClick={() => setSelectedWeek((w) => Math.min(40, w + 1))}
                disabled={selectedWeek >= 40}
                className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* LMP / FPP Quick Calculator */}
          <div className="lg:col-span-5 bg-black/20 backdrop-blur-xs p-3.5 rounded-2xl border border-white/15">
            <form onSubmit={handleCalculateFromLMP} className="flex flex-wrap items-center gap-2">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-[11px] font-bold text-pink-200 mb-1">
                  Última Regla (FUM / LMP):
                </label>
                <input
                  type="date"
                  value={lmpDate}
                  onChange={(e) => setLmpDate(e.target.value)}
                  className="w-full bg-white/90 text-slate-900 px-2.5 py-1.5 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-300"
                />
              </div>
              <button
                type="submit"
                className="mt-4 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
              >
                Calcular FPP
              </button>
            </form>
            {calculatedFPP && (
              <div className="mt-2 text-[11px] text-amber-200 font-semibold flex items-center gap-1">
                <span>🗓️ FPP Estimada:</span>
                <strong className="text-white font-bold">{calculatedFPP}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
        {[
          { id: 'semanas', label: '📅 Semana a Semana', desc: 'Desarrollo y cambios' },
          { id: 'trimestres', label: '🥗 Guía por Trimestres', desc: 'Nutrición y citas' },
          { id: 'herramientas', label: '⏱️ Herramientas Obstétricas', desc: 'Pataditas, contracciones y maleta' },
          { id: 'molestias', label: '🌿 Molestias Comunes', desc: 'Alivio seguro' },
          { id: 'alarmas', label: '🚨 Signos de Alarma', desc: 'Triaje ACOG / OMS' },
          { id: 'froggi_embarazo', label: '🐸 Chat Obstétrico IA', desc: 'Preguntas con audio' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[140px] px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer text-center ${
              activeTab === tab.id
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <div>{tab.label}</div>
            <div className="text-[10px] opacity-75 font-normal">{tab.desc}</div>
          </button>
        ))}
      </div>

      {/* ======================================================== */}
      {/* 1. SEMANA A SEMANA VIEW */}
      {/* ======================================================== */}
      {activeTab === 'semanas' && (
        <div className="space-y-6">
          {/* Week Overview Hero Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-rose-100 dark:border-rose-950/50 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-900/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-3xl shadow-inner">
                  {currentWeekData.babyFruitComparison.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300">
                      Semana {currentWeekData.week} de 40
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      Trimestre {currentWeekData.trimester}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                    Tu bebé tiene el tamaño de: {currentWeekData.babyFruitComparison.fruit}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    {currentWeekData.babyFruitComparison.comparisonText}
                  </p>
                </div>
              </div>

              {/* Audio Listen Button for this Week */}
              <button
                type="button"
                onClick={() =>
                  handleReadText(
                    `Semana ${currentWeekData.week} de embarazo. Tu bebé tiene el tamaño aproximado de ${currentWeekData.babyFruitComparison.fruit}, midiendo alrededor de ${currentWeekData.babyLengthCm} centímetros y pesando ${currentWeekData.babyWeightGrams} gramos. ${currentWeekData.babyFruitComparison.comparisonText}. En el desarrollo fetal: ${currentWeekData.fetalDevelopmentHighlights.join('. ')}. En los cambios maternos: ${currentWeekData.maternalBodyChanges.join('. ')}. Consejos recomendados: ${currentWeekData.recommendedCareAndNutrition.join('. ')}.`,
                    `week_${currentWeekData.week}`
                  )
                }
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-sm cursor-pointer ${
                  speakingTextId === `week_${currentWeekData.week}`
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>
                  {speakingTextId === `week_${currentWeekData.week}`
                    ? 'Pausar Lectura de Semana'
                    : '🔊 Escuchar Resumen con Voz'}
                </span>
              </button>
            </div>

            {/* Metric Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                  Longitud Fetal Aprox.
                </span>
                <span className="text-lg font-black text-rose-600 dark:text-rose-400">
                  {currentWeekData.babyLengthCm} cm
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                  Peso Fetal Estimado
                </span>
                <span className="text-lg font-black text-purple-600 dark:text-purple-400">
                  {currentWeekData.babyWeightGrams >= 1000
                    ? `${(currentWeekData.babyWeightGrams / 1000).toFixed(2)} kg`
                    : `${currentWeekData.babyWeightGrams} g`}
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                  Días Transcurridos
                </span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  ~{currentWeekData.week * 7} días
                </span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                  Progreso Gestacional
                </span>
                <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                  {Math.round((currentWeekData.week / 40) * 100)}%
                </span>
              </div>
            </div>

            {/* Detailed Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* Fetal Development */}
              <div className="bg-gradient-to-br from-pink-50/50 to-rose-50/50 dark:from-slate-800/80 dark:to-slate-800/40 p-5 rounded-2xl border border-pink-100 dark:border-slate-700 space-y-3">
                <h3 className="text-sm font-black text-pink-900 dark:text-pink-200 flex items-center gap-2">
                  <Baby className="w-4 h-4 text-pink-600" />
                  <span>Desarrollo del Bebé esta Semana</span>
                </h3>
                <ul className="space-y-2">
                  {currentWeekData.fetalDevelopmentHighlights.map((point, idx) => (
                    <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Maternal Body Changes */}
              <div className="bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-slate-800/80 dark:to-slate-800/40 p-5 rounded-2xl border border-purple-100 dark:border-slate-700 space-y-3">
                <h3 className="text-sm font-black text-purple-900 dark:text-purple-200 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-purple-600" />
                  <span>Tu Cuerpo & Cambios Maternos</span>
                </h3>
                <ul className="space-y-2">
                  {currentWeekData.maternalBodyChanges.map((point, idx) => (
                    <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nutrition & Care */}
              <div className="bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-slate-800/80 dark:to-slate-800/40 p-5 rounded-2xl border border-emerald-100 dark:border-slate-700 space-y-3">
                <h3 className="text-sm font-black text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  <Apple className="w-4 h-4 text-emerald-600" />
                  <span>Cuidados & Nutrición Recomendada</span>
                </h3>
                <ul className="space-y-2">
                  {currentWeekData.recommendedCareAndNutrition.map((point, idx) => (
                    <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tests & Warning signs */}
              <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-slate-800/80 dark:to-slate-800/40 p-5 rounded-2xl border border-amber-100 dark:border-slate-700 space-y-3">
                <h3 className="text-sm font-black text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-amber-600" />
                  <span>Pruebas Médicas & Alertas Clave</span>
                </h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                      Citas o Pruebas Habituales:
                    </span>
                    {currentWeekData.keyMedicalTests.map((t, idx) => (
                      <p key={idx} className="text-slate-600 dark:text-slate-400 pl-2 border-l-2 border-amber-300">
                        {t}
                      </p>
                    ))}
                  </div>
                  <div className="pt-2">
                    <span className="font-bold text-rose-700 dark:text-rose-300 block mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      <span>Cuándo consultar de inmediato:</span>
                    </span>
                    {currentWeekData.warningSignsToCheck.map((w, idx) => (
                      <p key={idx} className="text-rose-900 dark:text-rose-200 pl-2 border-l-2 border-rose-400">
                        {w}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. GUÍA POR TRIMESTRES */}
      {/* ======================================================== */}
      {activeTab === 'trimestres' && (
        <div className="space-y-6">
          {/* Trimester Tabs */}
          <div className="flex gap-2">
            {[1, 2, 3].map((tri) => (
              <button
                key={tri}
                type="button"
                onClick={() => setSelectedTrimester(tri as 1 | 2 | 3)}
                className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer border ${
                  selectedTrimester === tri
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {tri}° Trimestre ({tri === 1 ? 'Semanas 1-13' : tri === 2 ? 'Semanas 14-27' : 'Semanas 28-40+'})
              </button>
            ))}
          </div>

          {(() => {
            const guide = PREGNANCY_TRIMESTER_GUIDES.find((g) => g.trimester === selectedTrimester)!;
            return (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white">
                      {guide.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                      {guide.fetalHighlightsSummary}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleReadText(
                        `Guía del Trimestre ${guide.trimester}. ${guide.title}. ${guide.fetalHighlightsSummary}. Nutrientes esenciales: ${guide.essentialNutrients.map((n) => `${n.name}, dosis recomendada ${n.recommendedDaily}, fuentes: ${n.foodSources.join(', ')}`).join('. ')}. Alimentos a evitar: ${guide.foodsToAvoidOrLimit.map((f) => `${f.food}, motivo: ${f.reason}, alternativa segura: ${f.safeAlternative}`).join('. ')}.`,
                        `trim_${guide.trimester}`
                      )
                    }
                    className="flex items-center gap-2 px-3 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer shrink-0"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Escuchar Trimestre con Audio</span>
                  </button>
                </div>

                {/* Nutrients Table */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Apple className="w-4 h-4 text-emerald-600" />
                    <span>Nutrientes Esenciales para este Trimestre</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {guide.essentialNutrients.map((nut, idx) => (
                      <div
                        key={idx}
                        className="bg-emerald-50/50 dark:bg-slate-800/70 p-4 rounded-2xl border border-emerald-100 dark:border-slate-700 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-emerald-950 dark:text-emerald-300">
                            {nut.name}
                          </span>
                          <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-200 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 rounded-full">
                            {nut.recommendedDaily}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">
                          {nut.importance}
                        </p>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          <strong>Fuentes:</strong> {nut.foodSources.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Foods to Avoid / Limit */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-rose-600" />
                    <span>Alimentos a Evitar & Alternativas Seguras (Listeria / Toxoplasmosis / Mercurio)</span>
                  </h3>
                  <div className="space-y-2.5">
                    {guide.foodsToAvoidOrLimit.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-rose-50/40 dark:bg-slate-800/50 rounded-2xl border border-rose-100 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs items-center"
                      >
                        <div className="sm:col-span-4 font-bold text-rose-950 dark:text-rose-300 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                          <span>{item.food}</span>
                        </div>
                        <div className="sm:col-span-4 text-slate-600 dark:text-slate-400 text-[11px]">
                          <strong>Riesgo:</strong> {item.reason}
                        </div>
                        <div className="sm:col-span-4 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold">
                          <strong>Alternativa:</strong> {item.safeAlternative}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medical Scans & Appointments */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-cyan-600" />
                    <span>Calendario de Visitas Médicas y Ecografías</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {guide.medicalAppointmentsAndScans.map((app, idx) => (
                      <div
                        key={idx}
                        className="bg-cyan-50/50 dark:bg-slate-800/70 p-4 rounded-2xl border border-cyan-100 dark:border-slate-700 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between font-bold text-cyan-950 dark:text-cyan-200">
                          <span>{app.name}</span>
                          <span className="text-[10px] bg-cyan-200 dark:bg-cyan-900/60 text-cyan-900 dark:text-cyan-200 px-2 py-0.5 rounded-full">
                            {app.timeframe}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                          {app.purpose}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Maternal wellbeing tips */}
                <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-900/50 space-y-2">
                  <h4 className="text-xs font-black text-purple-950 dark:text-purple-200 uppercase tracking-wider">
                    ✨ Consejos de Bienestar Materno:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-purple-900 dark:text-purple-300">
                    {guide.maternalWellbeingTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span>•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. HERRAMIENTAS OBSTÉTRICAS (KICK COUNTER, CONTRACCIONES, MALETA) */}
      {/* ======================================================== */}
      {activeTab === 'herramientas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tool 1: Fetal Kick Counter */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-pink-100 dark:border-slate-800 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-pink-100 dark:bg-pink-950/50 text-pink-800 dark:text-pink-300 rounded-full text-xs font-bold">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Contador de Pataditas (Kick Counter)</span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Meta: 10 movimientos</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Registro de Vitalidad Fetal
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Recomendado a partir de la semana 28. Túmbate de lado izquierdo tras comer y cuenta 10 movimientos (patadas, giros o roces).
                </p>
              </div>

              {/* Big Counter Button */}
              <div className="flex flex-col items-center justify-center py-4 space-y-3">
                <button
                  type="button"
                  onClick={handleAddKick}
                  className="w-36 h-36 rounded-full bg-gradient-to-tr from-pink-600 to-rose-400 hover:from-pink-500 hover:to-rose-300 text-white shadow-xl hover:shadow-2xl transition-all transform active:scale-95 flex flex-col items-center justify-center cursor-pointer border-4 border-pink-200 dark:border-pink-900"
                >
                  <span className="text-3xl font-black">{kicksCount}</span>
                  <span className="text-xs font-bold uppercase tracking-wider">¡Patadita!</span>
                </button>

                <div className="text-center">
                  <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    ⏱️ Tiempo transcurrido: {Math.floor(kickTimerSeconds / 60)}m {kickTimerSeconds % 60}s
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {kicksCount >= 10
                      ? '🎉 ¡Meta alcanzada! 10 movimientos completados.'
                      : `${10 - kicksCount} movimientos restantes para completar la sesión.`}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetKicks}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 underline cursor-pointer"
                >
                  Reiniciar Contador
                </button>
              </div>

              {/* History of kicks */}
              {kickHistory.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Sesiones Recientes:
                  </span>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {kickHistory.slice(0, 3).map((k) => (
                      <div
                        key={k.id}
                        className="flex items-center justify-between text-xs p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl"
                      >
                        <span className="text-slate-600 dark:text-slate-300">
                          {k.timestamp} - {k.kicksCount} movs en {k.durationMinutes} min
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Óptimo
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tool 2: Contraction Timer */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-purple-100 dark:border-slate-800 shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 rounded-full text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Temporizador de Contracciones</span>
                  </div>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">Regla 5-1-1</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Monitor de Dinámica Uterina
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Presiona al empezar la contracción y vuelve a presionar cuando termine el dolor. Calcularemos la duración y el intervalo entre olas.
                </p>
              </div>

              {/* Big Contraction Button */}
              <div className="flex flex-col items-center justify-center py-4 space-y-3">
                <button
                  type="button"
                  onClick={handleToggleContraction}
                  className={`w-36 h-36 rounded-full text-white shadow-xl transition-all transform active:scale-95 flex flex-col items-center justify-center cursor-pointer border-4 ${
                    isContractionActive
                      ? 'bg-rose-600 hover:bg-rose-700 animate-pulse border-rose-300'
                      : 'bg-gradient-to-tr from-purple-600 to-indigo-500 hover:from-purple-500 hover:to-indigo-400 border-purple-200 dark:border-purple-900'
                  }`}
                >
                  <span className="text-3xl font-black">
                    {isContractionActive ? `${currentContractionSeconds}s` : 'Iniciar'}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {isContractionActive ? 'Terminar' : 'Contracción'}
                  </span>
                </button>

                <div className="text-center text-xs text-slate-600 dark:text-slate-400">
                  {isContractionActive ? (
                    <span className="text-rose-600 dark:text-rose-400 font-bold animate-pulse">
                      ¡Contracción en curso! Respira hondo y exhala despacio...
                    </span>
                  ) : contractionsList.length > 0 ? (
                    <span>
                      Última contracción: {contractionsList[0].durationSeconds}s (hace{' '}
                      {contractionsList[0].intervalMinutes} min)
                    </span>
                  ) : (
                    <span>Pulsa al sentir que la barriga se pone dura y empieza el dolor.</span>
                  )}
                </div>

                {contractionsList.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearContractions}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 underline cursor-pointer"
                  >
                    Borrar Registro
                  </button>
                )}
              </div>

              {/* Contractions Table */}
              {contractionsList.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Últimas Contracciones Registradas:
                  </span>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {contractionsList.slice(0, 4).map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between text-xs p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl"
                      >
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          Duración: <strong>{c.durationSeconds}s</strong>
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          Intervalo: {c.intervalMinutes > 0 ? `${c.intervalMinutes} min` : 'Primer registro'}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            c.intensity === 'fuerte'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {c.intensity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tool 3: Hospital Bag Checklist */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 rounded-full text-xs font-bold mb-1">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Checklist Interactivo</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Maleta para el Hospital y Nacimiento
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Prepárala entre las semanas 34 y 36. Marca los elementos listos para no olvidar nada esencial.
                </p>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {checkedCount} de {bagItems.length} listos
                  </span>
                  <span className="text-[11px] text-slate-500">Progreso de la maleta</span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-amber-400 flex items-center justify-center text-xs font-black text-amber-700 dark:text-amber-300">
                  {bagProgressPct}%
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'todas', label: '🎒 Todas' },
                { id: 'documentos', label: '📄 Documentos' },
                { id: 'mama', label: '🤰 Para Mamá' },
                { id: 'bebe', label: '👶 Para el Bebé' },
                { id: 'acompanante', label: '👥 Acompañante' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedBagCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    selectedBagCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {filteredBagItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleBagItem(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                    item.checked
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => {}} // handled by parent div
                      className="mt-1 rounded-md text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-bold ${
                            item.checked
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {item.label}
                        </span>
                        {item.essential && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded">
                            Esencial
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBagItem(item.id);
                    }}
                    className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Item Form */}
            <form
              onSubmit={handleAddCustomBagItem}
              className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800"
            >
              <input
                type="text"
                placeholder="Añadir otro artículo personal a la maleta..."
                value={newItemLabel}
                onChange={(e) => setNewItemLabel(e.target.value)}
                className="flex-1 min-w-[200px] px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as any)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 font-semibold"
              >
                <option value="mama">Para Mamá</option>
                <option value="bebe">Para Bebé</option>
                <option value="documentos">Documentos</option>
                <option value="acompanante">Acompañante</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MOLESTIAS COMUNES Y ALIVIO SEGURO */}
      {/* ======================================================== */}
      {activeTab === 'molestias' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Guía de Alivio Seguro para Molestias Gestacionales
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Estrategias avaladas por evidencia médica para náuseas, acidez, lumbalgia, contracciones de Braxton Hicks y retención de líquidos.
              </p>
            </div>

            <div className="space-y-3">
              {COMMON_PREGNANCY_SYMPTOMS.map((symptom) => {
                const isExpanded = expandedSymptomId === symptom.id;
                return (
                  <div
                    key={symptom.id}
                    className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/40"
                  >
                    <div
                      onClick={() => setExpandedSymptomId(isExpanded ? null : symptom.id)}
                      className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-900 dark:text-white">
                            {symptom.symptomName}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/60 text-pink-800 dark:text-pink-200">
                            Trimestres: {symptom.trimesters.join(', ')}°
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {symptom.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReadText(
                              `${symptom.symptomName}. ${symptom.description}. Alivio seguro en casa: ${symptom.safeHomeRelief.join('. ')}. Signos de alarma médica: ${symptom.medicalRedFlags.join('. ')}.`,
                              `symp_${symptom.id}`
                            );
                          }}
                          className="p-2 rounded-xl bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-300 hover:bg-rose-50 shadow-xs cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 space-y-4 text-xs">
                        <div className="space-y-2">
                          <span className="font-bold text-emerald-800 dark:text-emerald-300 block flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Medidas de Alivio y Cuidados en Casa:</span>
                          </span>
                          <ul className="space-y-1.5 pl-2">
                            {symptom.safeHomeRelief.map((relief, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                <span>{relief}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-100 dark:border-rose-900/50 space-y-1">
                          <span className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1 text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Cuándo no es normal y debes consultar:</span>
                          </span>
                          {symptom.medicalRedFlags.map((flag, idx) => (
                            <p key={idx} className="text-rose-800 dark:text-rose-300 text-[11px] pl-4">
                              • {flag}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. SIGNOS DE ALARMA OBSTÉTRICA */}
      {/* ======================================================== */}
      {activeTab === 'alarmas' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-rose-900 to-red-900 text-white rounded-3xl p-6 shadow-md space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              <span>Protocolo de Triaje Obstétrico de Emergencia (ACOG / OMS)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Signos que Requieren Evaluación Médica Inmediata
            </h2>
            <p className="text-rose-100 text-xs sm:text-sm max-w-2xl">
              Si experimentas cualquiera de estos síntomas, no esperes a tu próxima cita. Acude al servicio de urgencias obstétricas o maternidad más cercano.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OBSTETRIC_RED_FLAGS.map((flag) => (
              <div
                key={flag.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-2 border-rose-200 dark:border-rose-900/60 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        flag.severity === 'urgente'
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {flag.severity === 'urgente' ? '🚨 Urgencia Inmediata' : '⚠️ Precaución'}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleReadText(
                          `Alerta Obstétrica: ${flag.symptom}. Motivo clínico: ${flag.medicalReason}. Qué debes hacer de inmediato: ${flag.recommendedAction}.`,
                          `flag_${flag.id}`
                        )
                      }
                      className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {flag.symptom}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Motivo Médico:</strong> {flag.medicalReason}
                  </p>
                </div>

                <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/50 space-y-1">
                  <span className="text-xs font-bold text-red-900 dark:text-red-200 block">
                    Acción Recomendada:
                  </span>
                  <p className="text-xs font-semibold text-red-800 dark:text-red-300">
                    {flag.recommendedAction}
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-1 font-mono">
                    Fuente: {flag.sourceGuideline}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. FROGGI CHAT OBSTÉTRICO CON LECTURA POR VOZ */}
      {/* ======================================================== */}
      {activeTab === 'froggi_embarazo' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-xl shadow-md">
                🐸
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Consultorio Obstétrico con Froggi
                </h3>
                <p className="text-xs text-slate-500">
                  Orientación con lectura de respuestas por audio en voz natural
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {pregnancyChatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'froggi' && (
                  <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center text-sm shrink-0 mt-1">
                    🐸
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1.5 ${
                    msg.sender === 'user'
                      ? 'bg-rose-600 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <div className="flex items-center justify-between text-[10px] opacity-75 pt-1">
                    <span>{msg.time}</span>
                    {msg.sender === 'froggi' && (
                      <button
                        type="button"
                        onClick={() => handleReadText(msg.text, `chat_msg_${idx}`)}
                        className="flex items-center gap-1 font-bold text-rose-600 dark:text-rose-300 hover:underline cursor-pointer ml-2"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Escuchar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
                <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                <span>Froggi está consultando los datasets obstétricos...</span>
              </div>
            )}
          </div>

          {/* Input form */}
          <form onSubmit={handleSendPregnancyChat} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <input
              type="text"
              placeholder={`Pregúntale a Froggi sobre tu semana ${selectedWeek}, nutrición, síntomas...`}
              value={pregnancyPrompt}
              onChange={(e) => setPregnancyPrompt(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
            <button
              type="submit"
              disabled={!pregnancyPrompt.trim() || isChatLoading}
              className="px-5 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
