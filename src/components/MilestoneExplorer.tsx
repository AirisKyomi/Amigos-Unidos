import React, { useState } from 'react';
import {
  UNICEF_MILESTONES,
  COGNITIVE_ACTIVITIES,
  DEVELOPMENTAL_SURVEYS
} from '../data/pediatricDatasets';
import {
  AgeBracket,
  DevelopmentalMilestone,
  MilestoneSurveyQuestion,
  MilestoneSurveyReport
} from '../types';
import { useFamily } from '../context/FamilyContext';
import { FroggiAvatar, PanditaAvatar, MonitoAvatar, CaracolitoAvatar } from './MascotSVGs';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  Sparkles,
  ClipboardList,
  Heart,
  Activity,
  Layers,
  HelpCircle,
  RotateCcw,
  Baby,
  ArrowRight,
  ShieldCheck,
  Smile,
  Zap,
  BookOpen
} from 'lucide-react';

interface MilestoneExplorerProps {
  selectedAge: AgeBracket;
}

export const MilestoneExplorer: React.FC<MilestoneExplorerProps> = ({ selectedAge }) => {
  const { activeChild } = useFamily();

  const [viewMode, setViewMode] = useState<'survey' | 'checklist'>('survey');
  const [currentAgeBracket, setCurrentAgeBracket] = useState<AgeBracket>(selectedAge);
  const [completedIds, setCompletedIds] = useState<string[]>(['m1']);
  const [activeDomain, setActiveDomain] = useState<string>('all');

  // Survey state
  const questions: MilestoneSurveyQuestion[] = DEVELOPMENTAL_SURVEYS[currentAgeBracket] || DEVELOPMENTAL_SURVEYS['0-12m'];
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [surveyReport, setSurveyReport] = useState<MilestoneSurveyReport | null>(null);

  const handleOptionSelect = (questionId: string, points: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: points
    }));
  };

  const calculateSurveyReport = () => {
    let totalPoints = 0;
    const maxPoints = questions.length * 2;

    const strengths: string[] = [];
    const opportunities: string[] = [];

    questions.forEach((q) => {
      const pts = answers[q.id] ?? 1;
      totalPoints += pts;
      if (pts === 2) {
        strengths.push(`${q.domainLabel}: Hito consolidado con gran soltura.`);
      } else if (pts === 1) {
        opportunities.push(`${q.domainLabel}: En proceso evolutivo normal, se recomienda estimulación lúdica regular.`);
      } else {
        opportunities.push(`${q.domainLabel}: Área de oportunidad para acompañamiento afectivo y consulta pediátrica.`);
      }
    });

    const scorePct = Math.round((totalPoints / maxPoints) * 100);

    let status: 'Óptimo y Estimulado' | 'En Proceso Evolutivo Normal' | 'Oportunidad de Estimulación Focalizada' = 'En Proceso Evolutivo Normal';
    if (scorePct >= 80) {
      status = 'Óptimo y Estimulado';
    } else if (scorePct < 50) {
      status = 'Oportunidad de Estimulación Focalizada';
    }

    const childName = activeChild?.name || 'tu peque';

    const report: MilestoneSurveyReport = {
      scorePercentage: scorePct,
      overallStatus: status,
      summary: `${childName} presenta un neurodesarrollo armónico en esta etapa. Se identifican múltiples fortalezas en sus habilidades tempranas y caminos de estimulación afectiva.`,
      childName,
      ageText: currentAgeBracket,
      strengths: strengths.length > 0 ? strengths : ['Curiosidad natural e interés por su entorno.'],
      stimulationOptions: [
        'Propiciar tiempo de juego libre en el suelo sin distracciones de pantallas.',
        'Leer cuentos ilustrados diariamente comentando las emociones de los personajes con Froggi.',
        'Estimular el lenguaje nombrando cada objeto y acción cotidiana con frases rítmicas.',
        'Validar sus intentos y esfuerzos cotidianos para construir seguridad y apego seguro.'
      ],
      pediatricAdvice: [
        'Comentar en el próximo control de niño sano el ritmo de adquisición de palabras y motricidad.',
        'Asegurar un descanso nocturno suficiente respetando horarios de sueño.',
        'Mantener una nutrición equilibrada y rica en hierro y ácidos grasos esenciales.'
      ],
      funActivities: [
        {
          title: 'El Espejo de las Risas con Pandita',
          description: 'Hacer muecas, sonrisas y gestos frente al espejo para reforzar el reconocimiento socioemocional.',
          mascot: 'Pandita'
        },
        {
          title: 'El Circuito de Ranitas con Froggi',
          description: 'Saltar sobre pequeños cojines en el suelo nombrando colores y contando en voz alta.',
          mascot: 'Froggi'
        },
        {
          title: 'La Respiración de la Calma con Caracolito',
          description: 'Inhalar profundo inflando la pancita y soltar el aire despacio antes de dormir.',
          mascot: 'Caracolito'
        }
      ]
    };

    setSurveyReport(report);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const resetSurvey = () => {
    setAnswers({});
    setSurveyReport(null);
  };

  const toggleMilestone = (id: string) => {
    setCompletedIds((prev) => {
      const exists = prev.includes(id);
      if (!exists) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
        return [...prev, id];
      } else {
        return prev.filter((item) => item !== id);
      }
    });
  };

  const filteredMilestones = UNICEF_MILESTONES.filter((m) => {
    const matchesAge = m.ageRange === currentAgeBracket;
    const matchesDomain = activeDomain === 'all' || m.domain === activeDomain;
    return matchesAge && matchesDomain;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-700 via-rose-700 to-amber-700 rounded-3xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-xs border border-white/30">
              <PanditaAvatar size={60} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-900/80 text-pink-200 text-xs font-bold mb-1">
                <ClipboardList className="w-3.5 h-3.5" />
                Evaluación del Desarrollo & Opciones de Estimulación
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                {activeChild ? `Hitos y Encuesta para ${activeChild.name}` : 'Encuesta y Explorador de Hitos del Desarrollo'}
              </h2>
              <p className="text-xs sm:text-sm text-pink-100 mt-1 max-w-xl">
                Realiza la encuesta adaptativa sobre tu hijo/a para recibir un informe con opciones válidas de estimulación, actividades recomendadas y preguntas para el pediatra.
              </p>
            </div>
          </div>

          {/* Navigation Toggle */}
          <div className="flex bg-white/20 p-1 rounded-2xl backdrop-blur-xs border border-white/30 text-xs font-bold">
            <button
              onClick={() => setViewMode('survey')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'survey' ? 'bg-white text-pink-900 shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>Encuesta Adaptativa</span>
            </button>
            <button
              onClick={() => setViewMode('checklist')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'checklist' ? 'bg-white text-pink-900 shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Catálogo de Hitos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Age Stage Selector Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Baby className="w-5 h-5 text-pink-600" />
          <span className="font-extrabold text-slate-800 text-xs sm:text-sm">Rango de Edad a Evaluar:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: '0-12m', label: '0 a 12 meses (Lactantes)' },
            { id: '1-3y', label: '1 a 3 años (Primeros Pasos)' },
            { id: '4-6y', label: '4 a 6 años (Preescolar)' },
            { id: '7-10y+', label: '7 a 12 años (Escolar)' }
          ].map((stage) => (
            <button
              key={stage.id}
              onClick={() => {
                setCurrentAgeBracket(stage.id as AgeBracket);
                resetSurvey();
              }}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                currentAgeBracket === stage.id
                  ? 'bg-pink-600 text-white border-pink-600 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. INTERACTIVE SURVEY MODE */}
      {/* ========================================== */}
      {viewMode === 'survey' && (
        <div className="space-y-6">
          {!surveyReport ? (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-pink-600" />
                    <span>Cuestionario de Hitos para {activeChild?.name || 'tu hijo/a'} ({currentAgeBracket})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Selecciona la opción que mejor describe el comportamiento habitual de tu peque.
                  </p>
                </div>
                <span className="text-xs font-bold text-pink-700 bg-pink-50 px-3 py-1 rounded-xl">
                  {Object.keys(answers).length} de {questions.length} respondidas
                </span>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const currentAnswer = answers[q.id];
                  return (
                    <div key={q.id} className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-pink-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 bg-pink-100 px-2 py-0.5 rounded-md">
                            {q.domainLabel}
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-sm mt-1">
                            {q.question}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {q.description}
                          </p>
                        </div>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                        {q.options.map((opt, oIdx) => {
                          const isChosen = currentAnswer === opt.points;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => handleOptionSelect(q.id, opt.points)}
                              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                                isChosen
                                  ? 'bg-pink-50 border-pink-500 shadow-xs ring-2 ring-pink-500/20'
                                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs font-black ${isChosen ? 'text-pink-900' : 'text-slate-800'}`}>
                                  {opt.label}
                                </span>
                                {isChosen && <CheckCircle2 className="w-4 h-4 text-pink-600 shrink-0" />}
                              </div>
                              <span className="text-[11px] text-slate-500 font-medium">
                                {opt.explanation}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={calculateSurveyReport}
                  disabled={Object.keys(answers).length === 0}
                  className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-black px-6 py-3 rounded-2xl shadow-md transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generar Informe de Desarrollo & Opciones Válidas</span>
                </button>
              </div>
            </div>
          ) : (
            /* Survey Result Report */
            <div className="bg-white rounded-3xl p-6 border-2 border-pink-300 shadow-lg space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-pink-100 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-pink-600 text-white flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 bg-pink-100 px-2 py-0.5 rounded-md">
                      Informe Pedagógico de Desarrollo
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-0.5">
                      Evaluación de {surveyReport.childName} ({surveyReport.ageText})
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-pink-50 border border-pink-200 px-4 py-2 rounded-2xl text-center">
                    <span className="text-[10px] uppercase font-bold text-pink-700 block">Consolidación</span>
                    <span className="text-xl font-black text-pink-900">{surveyReport.scorePercentage}%</span>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl text-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">Diagnóstico</span>
                    <span className="text-xs font-black text-emerald-950">{surveyReport.overallStatus}</span>
                  </div>
                </div>
              </div>

              {/* Summary Text */}
              <p className="text-xs sm:text-sm text-slate-700 bg-pink-50/50 p-4 rounded-2xl border border-pink-200 leading-relaxed font-medium">
                {surveyReport.summary}
              </p>

              {/* Strengths & Stimulation Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Fortalezas Observadas:</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {surveyReport.strengths.map((st, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-pink-600" />
                    <span>Opciones Válidas de Estimulación:</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {surveyReport.stimulationOptions.map((opt, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="text-pink-600 font-bold">•</span>
                        <span className="font-medium">{opt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Fun Recommended Activities with Mascots */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                  <Smile className="w-4 h-4 text-pink-600" />
                  <span>Misiones Lúdicas Personalizadas con los 4 Amigos:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {surveyReport.funActivities.map((act, i) => (
                    <div key={i} className="bg-gradient-to-br from-pink-50 to-white p-3.5 rounded-2xl border border-pink-200 space-y-1.5">
                      <div className="flex items-center gap-2">
                        {act.mascot === 'Pandita' ? (
                          <PanditaAvatar size={28} />
                        ) : act.mascot === 'Froggi' ? (
                          <FroggiAvatar size={28} />
                        ) : (
                          <CaracolitoAvatar size={28} />
                        )}
                        <span className="font-extrabold text-slate-900 text-xs">{act.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                        {act.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions for next Pediatrician visit */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>Guía para tu próxima consulta con el Pediatra:</span>
                </h4>
                <ul className="space-y-1">
                  {surveyReport.pediatricAdvice.map((adv, i) => (
                    <li key={i} className="text-[11px] text-emerald-900 flex items-start gap-2 font-medium">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reset / Re-take button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={resetSurvey}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Realizar Nueva Encuesta</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* 2. CATALOG CHECKLIST MODE */}
      {/* ========================================== */}
      {viewMode === 'checklist' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMilestones.map((m) => {
              const isDone = completedIds.includes(m.id);
              return (
                <div
                  key={m.id}
                  onClick={() => toggleMilestone(m.id)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                    isDone
                      ? 'bg-pink-50/80 border-pink-400 shadow-xs ring-1 ring-pink-400/30'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800">
                      {m.domainLabel}
                    </span>
                    <button
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isDone ? 'bg-pink-600 text-white' : 'border border-slate-300 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-800 font-bold leading-snug">
                    {m.milestone}
                  </p>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                    <span className="text-pink-700 font-bold block">Juego sugerido:</span>
                    <span>{m.suggestedActivity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
