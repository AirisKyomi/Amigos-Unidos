import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceDot,
  ReferenceLine
} from 'recharts';
import {
  TrendingUp,
  Scale,
  Ruler,
  Calculator,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  LineChart as LineChartIcon,
  User,
  Baby,
  RefreshCw,
  PlusCircle,
  Calendar,
  FileText,
  Copy,
  Check,
  ChevronRight,
  ShieldAlert,
  Sliders,
  History,
  Trash2
} from 'lucide-react';
import { useFamily } from '../context/FamilyContext';
import { FroggiAvatar, MonitoAvatar, PanditaAvatar } from './MascotSVGs';
import {
  GrowthMetric,
  AgeRangeOption,
  ChildGrowthPoint,
  DEFAULT_CHILD_GROWTH_RECORDS,
  generateWHORechartsData,
  evaluateAnthropometrics,
  getInterpolatedLMS
} from '../data/whoGrowthCurves';
import {
  sendLocalNotification,
  saveAppointments,
  loadAppointments,
  PediatricAppointment
} from '../utils/notificationService';

export const GrowthTracker: React.FC = () => {
  const { user, activeChild, setActiveChildId, addHistoryRecord } = useFamily();

  // Child selection & baseline state
  const [selectedChildId, setSelectedChildId] = useState<string>(activeChild?.id || 'child-1');
  const [gender, setGender] = useState<'boy' | 'girl'>(activeChild?.gender || 'boy');
  const [childName, setChildName] = useState<string>(activeChild?.name || 'Mateo');
  const [ageMonths, setAgeMonths] = useState<number>(activeChild?.ageMonths ?? 12);
  const [weightKg, setWeightKg] = useState<number>(activeChild?.currentWeightKg ?? 9.6);
  const [heightCm, setHeightCm] = useState<number>(activeChild?.currentHeightCm ?? 75.5);

  // Visualization settings
  const [chartMetric, setChartMetric] = useState<GrowthMetric>('weight');
  const [ageRange, setAgeRange] = useState<AgeRangeOption>('0-24m');
  const [visibleLines, setVisibleLines] = useState({
    p97: true,
    p85: true,
    p50: true,
    p15: true,
    p3: true,
    child: true
  });

  // Checkup records log for the current child
  const [childRecords, setChildRecords] = useState<ChildGrowthPoint[]>(() => {
    return DEFAULT_CHILD_GROWTH_RECORDS[activeChild?.id || 'child-1'] || DEFAULT_CHILD_GROWTH_RECORDS['child-1'] || [];
  });

  // New checkup form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCheckupAge, setNewCheckupAge] = useState<number>(ageMonths);
  const [newCheckupWeight, setNewCheckupWeight] = useState<number>(weightKg);
  const [newCheckupHeight, setNewCheckupHeight] = useState<number>(heightCm);
  const [newCheckupDate, setNewCheckupDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newCheckupNotes, setNewCheckupNotes] = useState<string>('');

  // Schedule Next Percentile Reminder Modal state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [scheduleTime, setScheduleTime] = useState<string>('09:30');
  const [scheduleNotes, setScheduleNotes] = useState<string>(
    `Control de percentiles mensual para ${activeChild?.name || 'Mateo'}. Medir peso y talla en ayunas.`
  );
  const [scheduleSuccess, setScheduleSuccess] = useState<string | null>(null);

  // Copy feedback state
  const [copiedReport, setCopiedReport] = useState(false);

  // Handle schedule next percentile reminder
  const handleScheduleNextCheckup = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: PediatricAppointment = {
      id: `apt-${Date.now()}`,
      childId: selectedChildId,
      childName,
      title: `Toma Mensual de Percentiles OMS: ${childName}`,
      type: 'percentiles',
      date: scheduleDate,
      time: scheduleTime,
      doctorOrCenter: 'Monitoreo en Casa (Dashboard Recharts)',
      notes: scheduleNotes,
      reminderAdvanceMinutes: 60,
      isCompleted: false,
      notified: false,
      repeatMonthly: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const currentList = loadAppointments();
    saveAppointments([newApt, ...currentList]);

    sendLocalNotification(`Recordatorio Guardado: Percentiles OMS 📊`, {
      body: `Programado para ${childName} el ${scheduleDate} a las ${scheduleTime} hrs. Se te notificará automáticamente.`,
      type: 'percentiles'
    });

    setScheduleSuccess(`¡Recordatorio programado para el ${scheduleDate}! Recibirás una notificación.`);
    setTimeout(() => {
      setScheduleSuccess(null);
      setShowScheduleModal(false);
    }, 2200);
  };

  // Synchronize when activeChild changes from outside (e.g. Header dropdown)
  useEffect(() => {
    if (activeChild) {
      setSelectedChildId(activeChild.id);
      setGender(activeChild.gender);
      setChildName(activeChild.name);
      setAgeMonths(activeChild.ageMonths || 12);
      if (activeChild.currentWeightKg) setWeightKg(activeChild.currentWeightKg);
      if (activeChild.currentHeightCm) setHeightCm(activeChild.currentHeightCm);

      // Load records for active child if available
      const initial = DEFAULT_CHILD_GROWTH_RECORDS[activeChild.id] || [];
      setChildRecords(initial);

      // Choose an appropriate initial age range
      if (activeChild.ageMonths <= 24) setAgeRange('0-24m');
      else if (activeChild.ageMonths <= 60) setAgeRange('0-60m');
      else setAgeRange('0-144m');
    }
  }, [activeChild]);

  // Handle switching child within the dashboard
  const handleSelectChild = (cId: string) => {
    setSelectedChildId(cId);
    if (cId === 'custom') {
      setChildName('Simulación Libre');
      return;
    }

    const matched = user?.children.find(c => c.id === cId);
    if (matched) {
      setActiveChildId(matched.id);
      setGender(matched.gender);
      setChildName(matched.name);
      setAgeMonths(matched.ageMonths || 12);
      if (matched.currentWeightKg) setWeightKg(matched.currentWeightKg);
      if (matched.currentHeightCm) setHeightCm(matched.currentHeightCm);

      const recs = DEFAULT_CHILD_GROWTH_RECORDS[matched.id] || [];
      setChildRecords(recs);

      if (matched.ageMonths <= 24) setAgeRange('0-24m');
      else if (matched.ageMonths <= 60) setAgeRange('0-60m');
      else setAgeRange('0-144m');
    }
  };

  // Merge the child's recorded points with current interactive point
  const allChildPoints = useMemo(() => {
    // Check if the current age is already in records
    const existingIndex = childRecords.findIndex(r => r.ageMonths === ageMonths);
    const heightInM = Math.max(0.3, heightCm / 100);
    const currentBmi = Math.round((weightKg / (heightInM * heightInM)) * 10) / 10;

    const currentPoint: ChildGrowthPoint = {
      id: 'current-simulated',
      ageMonths,
      date: 'Medición Actual',
      weightKg,
      heightCm,
      bmi: currentBmi,
      notes: 'Punto actual seleccionado'
    };

    if (existingIndex >= 0) {
      const copy = [...childRecords];
      copy[existingIndex] = { ...copy[existingIndex], weightKg, heightCm, bmi: currentBmi };
      return copy;
    } else {
      return [...childRecords, currentPoint].sort((a, b) => a.ageMonths - b.ageMonths);
    }
  }, [childRecords, ageMonths, weightKg, heightCm]);

  // Generate dataset for Recharts
  const chartData = useMemo(() => {
    return generateWHORechartsData(gender, chartMetric, ageRange, allChildPoints);
  }, [gender, chartMetric, ageRange, allChildPoints]);

  // Anthropometric clinical evaluation
  const evaluation = useMemo(() => {
    return evaluateAnthropometrics(ageMonths, gender, weightKg, heightCm);
  }, [ageMonths, gender, weightKg, heightCm]);

  // Current metric value
  const currentMetricValue = useMemo(() => {
    if (chartMetric === 'weight') return weightKg;
    if (chartMetric === 'height') return heightCm;
    return evaluation.bmi;
  }, [chartMetric, weightKg, heightCm, evaluation.bmi]);

  // Units
  const metricUnit = chartMetric === 'weight' ? 'kg' : chartMetric === 'height' ? 'cm' : 'kg/m²';
  const metricTitle =
    chartMetric === 'weight'
      ? 'Peso para la Edad'
      : chartMetric === 'height'
      ? 'Talla / Longitud para la Edad'
      : 'Índice de Masa Corporal (IMC) para la Edad';

  // Toggle visible curves
  const toggleLine = (lineKey: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({ ...prev, [lineKey]: !prev[lineKey] }));
  };

  // Add new checkup point
  const handleAddCheckupPoint = (e: React.FormEvent) => {
    e.preventDefault();
    const heightInM = Math.max(0.3, newCheckupHeight / 100);
    const calculatedBmi = Math.round((newCheckupWeight / (heightInM * heightInM)) * 10) / 10;

    const newPt: ChildGrowthPoint = {
      id: `pt-${Date.now()}`,
      ageMonths: newCheckupAge,
      date: newCheckupDate,
      weightKg: Number(newCheckupWeight),
      heightCm: Number(newCheckupHeight),
      bmi: calculatedBmi,
      notes: newCheckupNotes.trim() || `Control de los ${newCheckupAge} meses`
    };

    setChildRecords(prev => [...prev.filter(p => p.ageMonths !== newCheckupAge), newPt].sort((a, b) => a.ageMonths - b.ageMonths));
    setAgeMonths(newCheckupAge);
    setWeightKg(newCheckupWeight);
    setHeightCm(newCheckupHeight);

    // Save to global history
    addHistoryRecord({
      type: 'growth',
      childId: selectedChildId,
      childName: childName,
      title: `Control Pediátrico Antropométrico (${newCheckupAge} meses)`,
      summary: `Peso: ${newCheckupWeight} kg (P${evaluation.weightPercentile}), Talla: ${newCheckupHeight} cm (P${evaluation.heightPercentile}), IMC: ${calculatedBmi}. ${evaluation.status === 'normal' ? 'Curva de crecimiento armónica y eutrófica.' : 'En seguimiento pediátrico.'}`,
      details: {
        ageMonths: newCheckupAge,
        weightKg: newCheckupWeight,
        heightCm: newCheckupHeight,
        bmi: calculatedBmi,
        weightPercentile: evaluation.weightPercentile,
        heightPercentile: evaluation.heightPercentile,
        status: evaluation.status,
        notes: newCheckupNotes
      }
    });

    setShowAddForm(false);
    setNewCheckupNotes('');
  };

  // Delete checkup record
  const handleDeleteRecord = (id: string) => {
    setChildRecords(prev => prev.filter(r => r.id !== id));
  };

  // Copy clinical report
  const handleCopyReport = () => {
    const reportText = `INFORME ANTROPOMÉTRICO PEDIÁTRICO (ESTÁNDARES OMS)
==================================================
Paciente: ${childName}
Sexo: ${gender === 'boy' ? 'Varón (Niño)' : 'Mujer (Niña)'}
Edad evaluada: ${ageMonths} meses (${(ageMonths / 12).toFixed(1)} años)
Fecha de evaluación: ${new Date().toLocaleDateString('es-ES')}

MEDICIONES ACTUALES:
- Peso: ${weightKg} kg | Percentil: P${evaluation.weightPercentile} | Z-Score: ${evaluation.weightZScore > 0 ? '+' : ''}${evaluation.weightZScore} SD
- Talla: ${heightCm} cm | Percentil: P${evaluation.heightPercentile} | Z-Score: ${evaluation.heightZScore > 0 ? '+' : ''}${evaluation.heightZScore} SD
- IMC: ${evaluation.bmi} kg/m² | Z-Score IMC: ${evaluation.bmiZScore > 0 ? '+' : ''}${evaluation.bmiZScore} SD

CLASIFICACIÓN CLÍNICA OMS:
- Estado Global: ${evaluation.status.toUpperCase()}
- Interpretación: ${evaluation.interpretation}

RECOMENDACIONES PEDIÁTRICAS:
${evaluation.recommendations.map(r => `• ${r}`).join('\n')}

GENERADO EN: Amigos Unidos - Dashboard Antropométrico Pediátrico OMS`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* 1. Dashboard Centralized Header */}
      <div className="bg-gradient-to-r from-teal-800 via-emerald-800 to-cyan-900 rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-56 h-56 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-white/15 p-2.5 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
              <MonitoAvatar size={64} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 text-xs font-bold mb-1 border border-emerald-500/30">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Dashboard Antropométrico Centralizado OMS & Recharts</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                Curvas de Crecimiento & Percentiles de {childName}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
                Visualización de percentiles (P3, P15, P50 Mediana, P85, P97) y Z-scores mediante gráficos interactivos basados en el Estudio Multicéntrico de Crecimiento de la OMS (0 a 12 años).
              </p>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto justify-end">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-extrabold px-3.5 py-2.5 rounded-2xl border border-white/30 transition-all cursor-pointer text-xs"
              title="Programar recordatorio local para la próxima toma de percentiles"
            >
              <Calendar className="w-4 h-4 text-emerald-300" />
              <span>Agendar Próxima Toma 📅</span>
            </button>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-3.5 py-2.5 rounded-2xl shadow-sm transition-all cursor-pointer text-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Registrar Control</span>
            </button>

            <button
              onClick={handleCopyReport}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold px-3.5 py-2.5 rounded-2xl border border-white/25 transition-all cursor-pointer text-xs"
              title="Copiar reporte pediátrico en formato texto"
            >
              {copiedReport ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copiedReport ? '¡Copiado!' : 'Copiar Informe'}</span>
            </button>
          </div>
        </div>

        {/* Child Selector & Gender Quick Switch Bar */}
        <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-emerald-200">Perfil en Pantalla:</span>
            {user?.children && user.children.length > 0 ? (
              user.children.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleSelectChild(c.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedChildId === c.id
                      ? 'bg-white text-emerald-900 shadow-sm font-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <Baby className="w-3.5 h-3.5" />
                  <span>{c.name} ({c.ageMonths}m)</span>
                </button>
              ))
            ) : null}
            <button
              onClick={() => handleSelectChild('custom')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                selectedChildId === 'custom'
                  ? 'bg-white text-emerald-900 shadow-sm font-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              ⚙️ Simulación Libre
            </button>
          </div>

          {/* Biological Sex Toggle */}
          <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-2xl border border-white/10">
            <span className="text-[11px] text-emerald-200 font-bold px-1.5">Estándar OMS:</span>
            <button
              onClick={() => setGender('boy')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                gender === 'boy' ? 'bg-blue-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>👦 Varón (Niño)</span>
            </button>
            <button
              onClick={() => setGender('girl')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1 ${
                gender === 'girl' ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>👧 Mujer (Niña)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal / Inline Drawer for Adding a New Checkup */}
      {showAddForm && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-500 shadow-md animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Registrar Nuevo Control Pediátrico</h3>
                <p className="text-xs text-slate-500">Agrega un nuevo punto a la curva longitudinal de {childName}</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer p-1"
            >
              ✕ Cerrar
            </button>
          </div>

          <form onSubmit={handleAddCheckupPoint} className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fecha del Control:</label>
              <input
                type="date"
                value={newCheckupDate}
                onChange={e => setNewCheckupDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Edad (en Meses, 0-144):</label>
              <input
                type="number"
                min="0"
                max="144"
                value={newCheckupAge}
                onChange={e => setNewCheckupAge(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Peso Medido (kg):</label>
              <input
                type="number"
                step="0.05"
                min="1.5"
                max="80"
                value={newCheckupWeight}
                onChange={e => setNewCheckupWeight(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Talla Medida (cm):</label>
              <input
                type="number"
                step="0.1"
                min="40"
                max="180"
                value={newCheckupHeight}
                onChange={e => setNewCheckupHeight(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                required
              />
            </div>

            <div className="sm:col-span-2 md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Observaciones Pediátricas (Opcional):</label>
              <input
                type="text"
                placeholder="Ej. Control 12 meses, vacunas puestas, inicio de marcha independiente..."
                value={newCheckupNotes}
                onChange={e => setNewCheckupNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Control</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Schedule Next Percentile Reminder Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Recordatorio de Próxima Toma OMS
                  </h3>
                  <p className="text-xs text-slate-500">Servicio de Notificaciones Locales (Notification API)</p>
                </div>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {scheduleSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{scheduleSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleScheduleNextCheckup} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha de la Próxima Medición:</label>
                  <input
                    type="date"
                    required
                    value={scheduleDate}
                    onChange={e => setScheduleDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hora de Notificación:</label>
                  <input
                    type="time"
                    required
                    value={scheduleTime}
                    onChange={e => setScheduleTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Indicación o Nota:</label>
                  <textarea
                    rows={2}
                    value={scheduleNotes}
                    onChange={e => setScheduleNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 resize-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-600" />
                    <span>Notification API Activa</span>
                  </div>
                  <p>
                    Recibirás una notificación en tu dispositivo para recordarte pesar y medir a {childName} y comparar sus percentiles en el dashboard de Recharts.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar Recordatorio</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. Top Anthropometric Scorecards (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Peso para la Edad */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Peso para la Edad</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              P{evaluation.weightPercentile}
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{weightKg}</span>
              <span className="text-sm font-bold text-slate-500">kg</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span>Z-Score: <strong className="text-slate-800">{evaluation.weightZScore > 0 ? `+${evaluation.weightZScore}` : evaluation.weightZScore} SD</strong></span>
              <span className="font-semibold text-emerald-600">
                {evaluation.weightPercentile >= 15 && evaluation.weightPercentile <= 85 ? 'Rango Eutrófico' : evaluation.weightPercentile < 15 ? 'Bajo Percentil' : 'Percentil Elevado'}
              </span>
            </div>
          </div>

          {/* Visual bar range */}
          <div className="space-y-1">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-rose-400" style={{ width: '15%' }} title="Bajo peso (<P3)" />
              <div className="h-full bg-amber-400" style={{ width: '15%' }} title="Riesgo bajo (P3-P15)" />
              <div className="h-full bg-emerald-500" style={{ width: '40%' }} title="Eutrófico (P15-P85)" />
              <div className="h-full bg-amber-400" style={{ width: '15%' }} title="Riesgo alto (P85-P97)" />
              <div className="h-full bg-rose-400" style={{ width: '15%' }} title="Sobrepeso (>P97)" />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>P3</span>
              <span>P15</span>
              <span className="font-bold text-emerald-600">P50 (Mediana)</span>
              <span>P85</span>
              <span>P97</span>
            </div>
          </div>
        </div>

        {/* Card 2: Talla para la Edad */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-sky-600" />
              <span>Talla / Longitud</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
              P{evaluation.heightPercentile}
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{heightCm}</span>
              <span className="text-sm font-bold text-slate-500">cm</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span>Z-Score: <strong className="text-slate-800">{evaluation.heightZScore > 0 ? `+${evaluation.heightZScore}` : evaluation.heightZScore} SD</strong></span>
              <span className="font-semibold text-sky-600">
                {evaluation.heightPercentile >= 15 && evaluation.heightPercentile <= 85 ? 'Estatura Adecuada' : evaluation.heightPercentile < 15 ? 'Talla Baja' : 'Talla Alta'}
              </span>
            </div>
          </div>

          {/* Visual bar range */}
          <div className="space-y-1">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-rose-400" style={{ width: '15%' }} />
              <div className="h-full bg-amber-400" style={{ width: '15%' }} />
              <div className="h-full bg-sky-500" style={{ width: '40%' }} />
              <div className="h-full bg-amber-400" style={{ width: '15%' }} />
              <div className="h-full bg-rose-400" style={{ width: '15%' }} />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>P3</span>
              <span>P15</span>
              <span className="font-bold text-sky-600">P50 (Mediana)</span>
              <span>P85</span>
              <span>P97</span>
            </div>
          </div>
        </div>

        {/* Card 3: Índice de Masa Corporal (IMC) */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <span>Índice IMC</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Z: {evaluation.bmiZScore > 0 ? `+${evaluation.bmiZScore}` : evaluation.bmiZScore}
            </span>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{evaluation.bmi}</span>
              <span className="text-sm font-bold text-slate-500">kg/m²</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
              <span>Relación P/T: <strong className="text-slate-800">Armónica</strong></span>
              <span className="font-semibold text-teal-600">
                {evaluation.bmiZScore >= -1 && evaluation.bmiZScore <= 1 ? 'Eutrófico OMS' : 'Vigilancia'}
              </span>
            </div>
          </div>

          {/* Visual bar range */}
          <div className="space-y-1">
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-amber-400" style={{ width: '20%' }} />
              <div className="h-full bg-teal-500" style={{ width: '60%' }} />
              <div className="h-full bg-rose-400" style={{ width: '20%' }} />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>Bajo IMC</span>
              <span className="font-bold text-teal-600">Rango Saludable</span>
              <span>Sobrepeso</span>
            </div>
          </div>
        </div>

        {/* Card 4: Estado Clínico Global & Semáforo */}
        <div className={`rounded-3xl p-5 border shadow-xs flex flex-col justify-between space-y-3 ${
          evaluation.status === 'normal'
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
            : evaluation.status === 'vigilancia'
            ? 'bg-amber-50/70 border-amber-200 text-amber-950'
            : 'bg-rose-50/70 border-rose-200 text-rose-950'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className={`w-4 h-4 ${
                evaluation.status === 'normal' ? 'text-emerald-600' : evaluation.status === 'vigilancia' ? 'text-amber-600' : 'text-rose-600'
              }`} />
              <span>Dictamen OMS</span>
            </span>
            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
              evaluation.status === 'normal'
                ? 'bg-emerald-200 text-emerald-900'
                : evaluation.status === 'vigilancia'
                ? 'bg-amber-200 text-amber-900'
                : 'bg-rose-200 text-rose-900'
            }`}>
              {evaluation.status === 'normal' ? 'Eutrófico' : evaluation.status}
            </span>
          </div>

          <div>
            <span className="text-lg font-black leading-tight block">
              {evaluation.status === 'normal' ? 'Crecimiento Óptimo' : evaluation.status === 'vigilancia' ? 'Seguimiento Preventivo' : 'Atención Pediátrica'}
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-700 mt-1 line-clamp-2">
              {evaluation.interpretation}
            </p>
          </div>

          <div className="pt-1 text-[11px] font-bold text-slate-500 flex items-center gap-1">
            <span>Controles registrados: <strong>{childRecords.length} evaluaciones</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Central Recharts Line Graph Panel */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
        {/* Controls bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setChartMetric('weight')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                chartMetric === 'weight'
                  ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Peso (kg)</span>
            </button>
            <button
              onClick={() => setChartMetric('height')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                chartMetric === 'height'
                  ? 'bg-sky-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Talla (cm)</span>
            </button>
            <button
              onClick={() => setChartMetric('bmi')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                chartMetric === 'bmi'
                  ? 'bg-teal-700 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Índice IMC (kg/m²)</span>
            </button>
          </div>

          {/* Age Window Range Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Rango de Edad:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setAgeRange('0-24m')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  ageRange === '0-24m' ? 'bg-white text-emerald-800 shadow-xs font-black' : 'text-slate-600'
                }`}
              >
                0 - 24 meses
              </button>
              <button
                onClick={() => setAgeRange('0-60m')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  ageRange === '0-60m' ? 'bg-white text-emerald-800 shadow-xs font-black' : 'text-slate-600'
                }`}
              >
                0 - 5 años
              </button>
              <button
                onClick={() => setAgeRange('0-144m')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  ageRange === '0-144m' ? 'bg-white text-emerald-800 shadow-xs font-black' : 'text-slate-600'
                }`}
              >
                0 - 12 años
              </button>
            </div>
          </div>
        </div>

        {/* Legend & Line Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-extrabold text-slate-600">Curvas Percentiles:</span>
            <button
              onClick={() => toggleLine('p97')}
              className={`px-2 py-0.5 rounded-lg border font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all ${
                visibleLines.p97 ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
              }`}
            >
              <span className="w-2.5 h-0.5 bg-rose-500 inline-block border-b border-dashed" />
              <span>P97 (+2 SD)</span>
            </button>
            <button
              onClick={() => toggleLine('p85')}
              className={`px-2 py-0.5 rounded-lg border font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all ${
                visibleLines.p85 ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
              }`}
            >
              <span className="w-2.5 h-0.5 bg-amber-500 inline-block border-b border-dashed" />
              <span>P85 (+1 SD)</span>
            </button>
            <button
              onClick={() => toggleLine('p50')}
              className={`px-2.5 py-0.5 rounded-lg border font-black text-[11px] flex items-center gap-1 cursor-pointer transition-all ${
                visibleLines.p50 ? 'bg-emerald-100 text-emerald-800 border-emerald-400' : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
              }`}
            >
              <span className="w-3 h-1 bg-emerald-600 rounded-xs inline-block" />
              <span>P50 (Mediana OMS)</span>
            </button>
            <button
              onClick={() => toggleLine('p15')}
              className={`px-2 py-0.5 rounded-lg border font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all ${
                visibleLines.p15 ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
              }`}
            >
              <span className="w-2.5 h-0.5 bg-amber-500 inline-block border-b border-dashed" />
              <span>P15 (-1 SD)</span>
            </button>
            <button
              onClick={() => toggleLine('p3')}
              className={`px-2 py-0.5 rounded-lg border font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all ${
                visibleLines.p3 ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
              }`}
            >
              <span className="w-2.5 h-0.5 bg-rose-500 inline-block border-b border-dashed" />
              <span>P3 (-2 SD)</span>
            </button>
          </div>

          {/* Child line highlight indicator */}
          <button
            onClick={() => toggleLine('child')}
            className={`px-3 py-1 rounded-xl font-black text-xs flex items-center gap-2 border cursor-pointer transition-all ${
              visibleLines.child ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            <span>Curva de {childName}</span>
          </button>
        </div>

        {/* Recharts Container */}
        <div className="w-full h-80 sm:h-96 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 15, right: 25, left: 10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              
              <XAxis
                dataKey="ageMonths"
                name="Edad"
                unit="m"
                stroke="#64748b"
                fontSize={11}
                tickFormatter={(val: number) => {
                  if (val === 0) return 'RN';
                  if (val >= 12 && val % 12 === 0) return `${val / 12}a`;
                  return `${val}m`;
                }}
                label={{ value: 'Edad en Meses / Años', position: 'insideBottom', offset: -15, fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
              />

              <YAxis
                stroke="#64748b"
                fontSize={11}
                domain={['auto', 'auto']}
                label={{ value: `${metricTitle} (${metricUnit})`, angle: -90, position: 'insideLeft', offset: 0, fill: '#64748b', fontSize: 11, fontWeight: 'bold' }}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as any;
                    const childVal = data.childValue;
                    return (
                      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs space-y-2 min-w-[210px]">
                        <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                          <span className="font-extrabold text-emerald-400">
                            Edad: {label} meses {label >= 12 ? `(${(label / 12).toFixed(1)} años)` : ''}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">OMS {gender === 'boy' ? 'Varón' : 'Niña'}</span>
                        </div>

                        {childVal !== null && childVal !== undefined ? (
                          <div className="bg-indigo-950/80 p-2 rounded-xl border border-indigo-700/60 flex items-center justify-between">
                            <span className="font-bold text-indigo-200">Medición de {childName}:</span>
                            <span className="font-black text-sm text-indigo-300">{childVal} {metricUnit}</span>
                          </div>
                        ) : null}

                        <div className="space-y-1 font-mono text-[11px]">
                          <div className="flex justify-between text-rose-400">
                            <span>P97 (+2 SD):</span>
                            <span>{data.p97} {metricUnit}</span>
                          </div>
                          <div className="flex justify-between text-amber-300">
                            <span>P85 (+1 SD):</span>
                            <span>{data.p85} {metricUnit}</span>
                          </div>
                          <div className="flex justify-between text-emerald-400 font-bold bg-emerald-950/40 px-1 py-0.5 rounded-sm">
                            <span>P50 (Mediana OMS):</span>
                            <span>{data.p50} {metricUnit}</span>
                          </div>
                          <div className="flex justify-between text-amber-300">
                            <span>P15 (-1 SD):</span>
                            <span>{data.p15} {metricUnit}</span>
                          </div>
                          <div className="flex justify-between text-rose-400">
                            <span>P3 (-2 SD):</span>
                            <span>{data.p3} {metricUnit}</span>
                          </div>
                        </div>

                        {childVal !== null && childVal !== undefined ? (
                          <div className="pt-1 text-[10px] text-slate-300 border-t border-slate-700">
                            Diferencia con mediana: {((childVal - data.p50) > 0 ? '+' : '') + (childVal - data.p50).toFixed(1)} {metricUnit}
                          </div>
                        ) : null}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* WHO Standard Lines */}
              {visibleLines.p97 && (
                <Line
                  type="monotone"
                  dataKey="p97"
                  name="P97 (+2 SD)"
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              )}

              {visibleLines.p85 && (
                <Line
                  type="monotone"
                  dataKey="p85"
                  name="P85 (+1 SD)"
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              )}

              {visibleLines.p50 && (
                <Line
                  type="monotone"
                  dataKey="p50"
                  name="P50 Mediana OMS"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={false}
                />
              )}

              {visibleLines.p15 && (
                <Line
                  type="monotone"
                  dataKey="p15"
                  name="P15 (-1 SD)"
                  stroke="#f59e0b"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              )}

              {visibleLines.p3 && (
                <Line
                  type="monotone"
                  dataKey="p3"
                  name="P3 (-2 SD)"
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              )}

              {/* Child's Growth Trajectory Line */}
              {visibleLines.child && (
                <Line
                  type="monotone"
                  dataKey="childValue"
                  name={`Mediciones de ${childName}`}
                  stroke="#6366f1"
                  strokeWidth={3.5}
                  connectNulls={true}
                  dot={{ r: 5, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: '#4338ca', stroke: '#ffffff', strokeWidth: 2 }}
                  isAnimationActive={true}
                />
              )}

              {/* Reference indicator dot for active simulated point */}
              <ReferenceDot
                x={ageMonths}
                y={currentMetricValue}
                r={8}
                fill="#ec4899"
                stroke="#ffffff"
                strokeWidth={3}
                isFront={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend notes */}
        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span>Verde: Mediana poblacional de referencia (P50 OMS)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
              <span>Púrpura: Mediciones registradas en controles</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-pink-500 inline-block" />
              <span>Rosa: Posición de la medición seleccionada</span>
            </span>
          </div>
          <span className="font-semibold text-slate-400">Patrones de Crecimiento OMS (WHO MGRS)</span>
        </div>
      </div>

      {/* 4. Interactive Simulation & History Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Real-Time Calibrator (Sliders) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
                <Sliders className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Simulador de Medición en Tiempo Real</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-bold">Rango: 0 a 144 meses</span>
          </div>

          {/* Age Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>Edad en Meses:</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded-lg border border-teal-200">
                  {ageMonths} meses {ageMonths >= 12 ? `(${(ageMonths / 12).toFixed(1)} años)` : ''}
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="144"
              value={ageMonths}
              onChange={e => setAgeMonths(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1 pt-1">
              {[0, 3, 6, 9, 12, 18, 24, 36, 48, 60, 84, 120, 144].map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setAgeMonths(m)}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                    ageMonths === m
                      ? 'bg-teal-600 text-white font-black'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {m === 0 ? 'RN' : m >= 12 && m % 12 === 0 ? `${m / 12}a` : `${m}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Weight Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-emerald-600" />
                <span>Peso Corporal (kg):</span>
              </label>
              <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                {weightKg} kg
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="65"
              step="0.1"
              value={weightKg}
              onChange={e => setWeightKg(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Height Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-sky-600" />
                <span>Talla / Longitud (cm):</span>
              </label>
              <span className="font-mono font-bold text-xs bg-sky-50 text-sky-800 px-2.5 py-0.5 rounded-lg border border-sky-200">
                {heightCm} cm
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="170"
              step="0.5"
              value={heightCm}
              onChange={e => setHeightCm(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>

          {/* Quick save button */}
          <button
            onClick={() => {
              setNewCheckupAge(ageMonths);
              setNewCheckupWeight(weightKg);
              setNewCheckupHeight(heightCm);
              setShowAddForm(true);
            }}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-200"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>Fijar estos valores como Control Pediátrico</span>
          </button>
        </div>

        {/* Right: Checkups History Table */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Controles Antropométricos de {childName}</h3>
                  <p className="text-[11px] text-slate-400">Puntos graficados en la curva de Recharts</p>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                {childRecords.length} Controles
              </span>
            </div>

            {/* List of checkups */}
            <div className="overflow-y-auto max-h-64 space-y-2 pr-1">
              {childRecords.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No hay controles registrados aún. Utiliza el botón "Registrar Control" para comenzar la curva.
                </div>
              ) : (
                childRecords.map(rec => (
                  <div
                    key={rec.id}
                    className="p-3 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl border border-slate-200/80 transition-all flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">{rec.ageMonths} meses</span>
                        <span className="text-[10px] text-slate-400 font-mono">({rec.date})</span>
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-3">
                        <span>Peso: <strong className="text-emerald-700">{rec.weightKg} kg</strong></span>
                        <span>Talla: <strong className="text-sky-700">{rec.heightCm} cm</strong></span>
                        <span>IMC: <strong className="text-teal-700">{rec.bmi}</strong></span>
                      </div>
                      {rec.notes && (
                        <p className="text-[10px] text-slate-400 italic line-clamp-1">"{rec.notes}"</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setAgeMonths(rec.ageMonths);
                          setWeightKg(rec.weightKg);
                          setHeightCm(rec.heightCm);
                        }}
                        className="px-2.5 py-1 rounded-xl bg-white text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-[10px] font-bold cursor-pointer"
                        title="Ver en simulador y destacar en gráfico"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => handleDeleteRecord(rec.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 cursor-pointer"
                        title="Eliminar este control"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>¿Deseas agregar el control de este mes?</span>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Registrar ahora</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Clinical Guidelines & Pediatric Takeaways */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-100 rounded-2xl text-emerald-800">
            <FroggiAvatar size={36} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              Orientación Clínica Pediátrica & Directrices OMS / AAP
            </h3>
            <p className="text-xs text-slate-500">
              Criterios de evaluación antropométrica aplicables para {gender === 'boy' ? 'niños' : 'niñas'} en etapa de {ageMonths <= 12 ? 'lactante' : ageMonths <= 36 ? 'maternal' : ageMonths <= 72 ? 'preescolar' : 'escolar'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Box 1: Interpretación del Carril */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>Interpretación de Percentiles</span>
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Un percentil indica la posición del niño respecto a 100 niños sanos de su misma edad y sexo. Estar en P{evaluation.weightPercentile} significa que el {evaluation.weightPercentile}% de los niños sanos pesan igual o menos. El rango entre P15 y P85 es considerado estándar eutrófico óptimo.
            </p>
          </div>

          {/* Box 2: Recomendaciones Específicas */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>Recomendaciones Actuales</span>
            </span>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {evaluation.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-teal-600 font-bold shrink-0">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Box 3: Banderas Rojas Pediátricas */}
          <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200/80 space-y-2">
            <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Criterios de Derivación Pediátrica</span>
            </span>
            <ul className="space-y-1 text-xs text-rose-800">
              <li>• Caída de más de dos canales de percentil entre dos controles sucesivos.</li>
              <li>• Pérdida de peso no intencionada o estancamiento ponderal por más de 2 meses.</li>
              <li>• Aplanamiento o desaceleración marcada en la curva de talla.</li>
              <li>• Rechazo alimentario sistemático con decaimiento o vómitos frecuentes.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
