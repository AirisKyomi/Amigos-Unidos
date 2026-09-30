import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Bell,
  BellRing,
  Plus,
  Clock,
  MapPin,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Download,
  Send,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  Baby,
  Scale,
  Stethoscope,
  Syringe,
  Pill,
  Sparkles,
  Info
} from 'lucide-react';
import { useFamily } from '../context/FamilyContext';
import { FroggiAvatar, MonitoAvatar } from './MascotSVGs';
import {
  PediatricAppointment,
  AppointmentType,
  loadAppointments,
  saveAppointments,
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendLocalNotification,
  downloadICS
} from '../utils/notificationService';

interface PediatricCalendarProps {
  onSchedulePercentileCheckup?: () => void;
}

export const PediatricCalendar: React.FC<PediatricCalendarProps> = ({
  onSchedulePercentileCheckup
}) => {
  const { user, activeChild, addHistoryRecord } = useFamily();

  const [appointments, setAppointments] = useState<PediatricAppointment[]>(() => loadAppointments());
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const [selectedChildFilter, setSelectedChildFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');

  // Calendar navigation state
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Form modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [formChildId, setFormChildId] = useState<string>(activeChild?.id || 'child-1');
  const [formTitle, setFormTitle] = useState<string>('Toma Mensual de Percentiles y Curvas OMS');
  const [formType, setFormType] = useState<AppointmentType>('percentiles');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formTime, setFormTime] = useState<string>('10:00');
  const [formDoctor, setFormDoctor] = useState<string>('Monitoreo en Casa / Báscula y Tallímetro');
  const [formNotes, setFormNotes] = useState<string>('Medición de peso y talla para registrar en el dashboard de percentiles.');
  const [formAdvanceMinutes, setFormAdvanceMinutes] = useState<number>(60);
  const [formRepeatMonthly, setFormRepeatMonthly] = useState<boolean>(true);

  // Toast / feedback message
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Check notification permission on mount
  useEffect(() => {
    setPermissionStatus(getNotificationPermission());
  }, []);

  // Save changes to localStorage
  const handleUpdateAppointments = (updated: PediatricAppointment[]) => {
    setAppointments(updated);
    saveAppointments(updated);
  };

  const showFeedback = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Request browser permission
  const handleRequestPermission = async () => {
    const result = await requestNotificationPermission();
    setPermissionStatus(result);
    if (result === 'granted') {
      showFeedback('¡Permiso concedido! Recibirás notificaciones locales y recordatorios.', 'success');
      sendLocalNotification('Notificaciones Pediátricas Activadas 🎉', {
        body: 'El servicio de recordatorios locales de Amigos Unidos está listo para avisarte de citas y percentiles.',
        type: 'pediatric_checkup'
      });
    } else if (result === 'denied') {
      showFeedback('Las notificaciones nativas fueron denegadas en el navegador. Se usarán alertas sonoras en pantalla.', 'info');
    }
  };

  // Send an immediate test notification
  const handleSendTestNotification = () => {
    const sent = sendLocalNotification('Prueba de Notificación Local 🔔', {
      body: `Recordatorio para ${activeChild?.name || 'Mateo'}: Hora de registrar percentiles antropométricos en el dashboard.`,
      type: 'percentiles'
    });

    showFeedback(
      sent
        ? 'Notificación del sistema enviada con éxito.'
        : 'Alerta generada con sonido y notificación en pantalla.',
      'success'
    );
  };

  // Add new appointment
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const targetChild = user?.children.find(c => c.id === formChildId) || activeChild;
    const childName = targetChild?.name || 'Niño';

    const newApt: PediatricAppointment = {
      id: `apt-${Date.now()}`,
      childId: formChildId,
      childName,
      title: formTitle.trim(),
      type: formType,
      date: formDate,
      time: formTime,
      doctorOrCenter: formDoctor.trim() || 'Centro de Salud',
      notes: formNotes.trim(),
      reminderAdvanceMinutes: Number(formAdvanceMinutes),
      isCompleted: false,
      notified: false,
      repeatMonthly: formRepeatMonthly,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [newApt, ...appointments].sort((a, b) => a.date.localeCompare(b.date));
    handleUpdateAppointments(updated);

    // Save into history
    addHistoryRecord({
      type: 'appointment' as any,
      childId: formChildId,
      childName,
      title: `Cita Programada: ${formTitle}`,
      summary: `${formDate} a las ${formTime} hrs en ${formDoctor}. Recordatorio ${formAdvanceMinutes}m antes.`,
      details: {
        appointmentId: newApt.id,
        type: formType,
        date: formDate,
        time: formTime,
        doctor: formDoctor
      }
    });

    // Send confirmation notification
    sendLocalNotification(`Cita Agendada: ${formTitle}`, {
      body: `Programada para ${childName} el ${formDate} a las ${formTime} hrs. Te avisaremos con anticipación.`,
      type: formType
    });

    setShowAddModal(false);
    showFeedback(`Cita guardada para ${childName}. Recordatorio programado.`, 'success');
  };

  // Trigger manual reminder
  const handleTriggerNow = (apt: PediatricAppointment) => {
    sendLocalNotification(`Recordatorio: ${apt.title}`, {
      body: `Para ${apt.childName}. Cita programada para el ${apt.date} a las ${apt.time} hrs (${apt.doctorOrCenter}).`,
      type: apt.type
    });
    showFeedback(`Recordatorio enviado inmediatamente para ${apt.childName}.`, 'success');
  };

  // Toggle completion
  const handleToggleComplete = (id: string) => {
    const updated = appointments.map(a => (a.id === id ? { ...a, isCompleted: !a.isCompleted } : a));
    handleUpdateAppointments(updated);
  };

  // Delete appointment
  const handleDeleteAppointment = (id: string) => {
    const updated = appointments.filter(a => a.id !== id);
    handleUpdateAppointments(updated);
    showFeedback('Cita eliminada.', 'info');
  };

  // Quick preset button for percentiles
  const handleQuickPercentilesPreset = () => {
    setFormTitle('Toma Mensual de Percentiles y Curvas OMS');
    setFormType('percentiles');
    setFormDoctor('Monitoreo en Casa (Báscula y Tallímetro)');
    setFormNotes('Medir peso en ayunas y longitud para registrar en el dashboard de Recharts.');
    setFormAdvanceMinutes(60);
    setFormRepeatMonthly(true);
    setShowAddModal(true);
  };

  // Filtered appointments
  const filteredAppointments = appointments.filter(apt => {
    if (selectedChildFilter !== 'all' && apt.childId !== selectedChildFilter) return false;
    if (selectedTypeFilter !== 'all' && apt.type !== selectedTypeFilter) return false;
    return true;
  });

  // Calendar math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedCalendarDate(now.toISOString().split('T')[0]);
  };

  const getAppointmentsForDate = (dateStr: string) => {
    return appointments.filter(a => a.date === dateStr);
  };

  const getTypeIcon = (type: AppointmentType) => {
    switch (type) {
      case 'percentiles':
        return <Scale className="w-4 h-4 text-emerald-600" />;
      case 'pediatric_checkup':
        return <Stethoscope className="w-4 h-4 text-blue-600" />;
      case 'vaccination':
        return <Syringe className="w-4 h-4 text-purple-600" />;
      case 'medication':
        return <Pill className="w-4 h-4 text-amber-600" />;
      default:
        return <CalendarCheck className="w-4 h-4 text-sky-600" />;
    }
  };

  const getTypeBadgeClass = (type: AppointmentType) => {
    switch (type) {
      case 'percentiles':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pediatric_checkup':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'vaccination':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'medication':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getTypeLabel = (type: AppointmentType) => {
    switch (type) {
      case 'percentiles':
        return 'Toma de Percentiles OMS';
      case 'pediatric_checkup':
        return 'Control Pediátrico';
      case 'vaccination':
        return 'Vacunación';
      case 'medication':
        return 'Medicación / Cuidado';
      default:
        return 'Cita Médica';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Toast Feedback */}
      {feedbackMsg && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2.5 transition-all animate-in slide-in-from-bottom duration-200 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : feedbackMsg.type === 'error'
              ? 'bg-rose-900 text-white border-rose-700'
              : 'bg-slate-900 text-white border-slate-700'
          }`}
        >
          <BellRing className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-800 via-indigo-800 to-sky-900 rounded-3xl p-5 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-56 h-56 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-white/15 p-2.5 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
              <MonitoAvatar size={64} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-950/80 text-blue-200 text-xs font-bold mb-1 border border-blue-400/30">
                <BellRing className="w-3.5 h-3.5 text-blue-300" />
                <span>Servicio de Notificaciones Locales (Notification API) & Agenda</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                Calendario Pediátrico & Recordatorios
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-2xl leading-relaxed">
                Programa recordatorios locales automáticos para la toma de percentiles OMS, consultas con el pediatra, vacunación y controles periódicos para tus hijos.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 self-stretch lg:self-auto justify-end">
            <button
              onClick={handleSendTestNotification}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold px-3.5 py-2.5 rounded-2xl border border-white/25 transition-all cursor-pointer text-xs"
              title="Probar sonido y notificación local inmediata"
            >
              <Bell className="w-4 h-4 text-amber-300" />
              <span>Probar Notificación</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2.5 rounded-2xl shadow-sm transition-all cursor-pointer text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Cita o Toma</span>
            </button>
          </div>
        </div>

        {/* Notification Permission Status Bar */}
        <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-200">Estado de Notificaciones:</span>
            {permissionStatus === 'granted' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Activadas (Notification API Lista)</span>
              </span>
            ) : permissionStatus === 'denied' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/30 font-bold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Bloqueadas en navegador (Alertas en pantalla y sonido activas)</span>
              </span>
            ) : (
              <button
                onClick={handleRequestPermission}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black transition-all cursor-pointer shadow-xs"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Habilitar Notificaciones del Sistema</span>
              </button>
            )}
          </div>

          {/* Quick preset for percentiles */}
          <button
            onClick={handleQuickPercentilesPreset}
            className="flex items-center gap-1.5 text-xs text-blue-100 hover:text-white underline font-bold cursor-pointer"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-300" />
            <span>+ Agendar recordatorio mensual de percentiles</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar on Left (7 cols), Agenda list on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Interactive Monthly Calendar Grid */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {monthNames[month]} {year}
                </h2>
                <p className="text-[11px] text-slate-400">Selecciona un día para ver o programar citas</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToday}
                className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl cursor-pointer transition-colors"
              >
                Hoy
              </button>
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 cursor-pointer"
                title="Mes anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 cursor-pointer"
                title="Mes siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-slate-400 uppercase tracking-wider py-1">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mié</span>
            <span>Jue</span>
            <span>Vie</span>
            <span className="text-amber-600">Sáb</span>
            <span className="text-rose-600">Dom</span>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Blank offset days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`blank-${i}`} className="min-h-[64px] sm:min-h-[76px] p-1 rounded-2xl bg-slate-50/40 opacity-40" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const padMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
              const padDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
              const dateStr = `${year}-${padMonth}-${padDay}`;

              const dayAppointments = getAppointmentsForDate(dateStr);
              const isSelected = selectedCalendarDate === dateStr;
              const isToday =
                new Date().toISOString().split('T')[0] === dateStr;

              return (
                <div
                  key={dateStr}
                  onClick={() => {
                    setSelectedCalendarDate(dateStr);
                    setFormDate(dateStr);
                  }}
                  className={`min-h-[64px] sm:min-h-[76px] p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 shadow-xs ring-2 ring-blue-400/40'
                      : isToday
                      ? 'border-emerald-400 bg-emerald-50/30'
                      : 'border-slate-200/80 bg-white hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black rounded-lg w-5 h-5 flex items-center justify-center ${
                        isToday
                          ? 'bg-emerald-600 text-white'
                          : isSelected
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-800'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayAppointments.length > 0 && (
                      <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-blue-600 text-white">
                        {dayAppointments.length}
                      </span>
                    )}
                  </div>

                  {/* Day Appointment Previews / Badges */}
                  <div className="space-y-0.5 mt-1 overflow-hidden">
                    {dayAppointments.slice(0, 2).map(apt => (
                      <div
                        key={apt.id}
                        className={`text-[9px] font-bold px-1 py-0.5 rounded-md truncate flex items-center gap-1 ${getTypeBadgeClass(apt.type)}`}
                        title={`${apt.title} (${apt.childName})`}
                      >
                        <span className="shrink-0">{apt.type === 'percentiles' ? '📊' : '🩺'}</span>
                        <span className="truncate">{apt.title}</span>
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <span className="text-[8px] font-bold text-slate-400 block text-right">
                        +{dayAppointments.length - 2} más
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Schedule button for selected date */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Día seleccionado: <strong className="text-slate-800">{selectedCalendarDate}</strong>
            </span>
            <button
              onClick={() => {
                setFormDate(selectedCalendarDate);
                setShowAddModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Programar en esta fecha</span>
            </button>
          </div>
        </div>

        {/* RIGHT: Agenda, Upcoming Reminders & Active Notifications */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                <span>Filtrar Recordatorios:</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {filteredAppointments.length} de {appointments.length} citas
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Filter by Child */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Por Niño:</label>
                <select
                  value={selectedChildFilter}
                  onChange={e => setSelectedChildFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800"
                >
                  <option value="all">Todos los Niños</option>
                  {user?.children.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Type */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">Por Tipo:</label>
                <select
                  value={selectedTypeFilter}
                  onChange={e => setSelectedTypeFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800"
                >
                  <option value="all">Todos los Tipos</option>
                  <option value="percentiles">📊 Toma de Percentiles</option>
                  <option value="pediatric_checkup">🩺 Control Pediátrico</option>
                  <option value="vaccination">💉 Vacunación</option>
                  <option value="medication">💊 Medicación</option>
                </select>
              </div>
            </div>
          </div>

          {/* List of Scheduled Reminders */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3 max-h-[560px] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Próximas Citas & Recordatorios</span>
              </h3>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                Notification API
              </span>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400 space-y-2">
                <CalendarIcon className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No hay citas programadas con los filtros seleccionados.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  + Programar una cita ahora
                </button>
              </div>
            ) : (
              filteredAppointments.map(apt => (
                <div
                  key={apt.id}
                  className={`p-4 rounded-2xl border transition-all space-y-2.5 relative ${
                    apt.isCompleted
                      ? 'bg-slate-50/70 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200/90 hover:border-blue-300 shadow-2xs'
                  }`}
                >
                  {/* Top Bar of Card */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-slate-100">{getTypeIcon(apt.type)}</div>
                      <div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${getTypeBadgeClass(apt.type)}`}>
                          {getTypeLabel(apt.type)}
                        </span>
                        <h4 className="font-black text-slate-900 text-xs sm:text-sm mt-0.5">
                          {apt.title}
                        </h4>
                      </div>
                    </div>

                    <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg shrink-0">
                      {apt.childName}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="text-xs text-slate-600 space-y-1 font-medium">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-slate-800 font-bold">
                        <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span>{apt.date}</span>
                      </span>
                      <span className="flex items-center gap-1 text-slate-800 font-bold">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{apt.time} hrs</span>
                      </span>
                    </div>

                    {apt.doctorOrCenter && (
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{apt.doctorOrCenter}</span>
                      </div>
                    )}

                    {apt.notes && (
                      <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-xl border border-slate-100">
                        "{apt.notes}"
                      </p>
                    )}
                  </div>

                  {/* Notification & Actions Footer */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <BellRing className="w-3 h-3 text-emerald-500" />
                      <span>
                        Aviso: {apt.reminderAdvanceMinutes === 0 ? 'Al momento' : apt.reminderAdvanceMinutes === 1440 ? '1 día antes' : `${apt.reminderAdvanceMinutes} min antes`}
                      </span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Manual trigger now */}
                      <button
                        onClick={() => handleTriggerNow(apt)}
                        className="p-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1"
                        title="Enviar recordatorio local ahora (Notification API)"
                      >
                        <Send className="w-3 h-3" />
                        <span>Notificar Ya</span>
                      </button>

                      {/* Download .ics */}
                      <button
                        onClick={() => downloadICS(apt)}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1"
                        title="Exportar a Google / Apple Calendar (.ics)"
                      >
                        <Download className="w-3 h-3" />
                        <span>.ics</span>
                      </button>

                      {/* Mark Completed */}
                      <button
                        onClick={() => handleToggleComplete(apt.id)}
                        className={`p-1.5 rounded-xl font-bold text-[10px] transition-all cursor-pointer ${
                          apt.isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500 hover:text-emerald-700'
                        }`}
                        title={apt.isCompleted ? 'Desmarcar realizada' : 'Marcar como realizada'}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteAppointment(apt.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                        title="Eliminar cita"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL: Add New Appointment / Percentile Measurement */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Agendar Cita & Recordatorio Local</h3>
                  <p className="text-xs text-slate-500">Notificación automática mediante Notification API</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs">
              {/* Child selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Para el Niño/a:</label>
                <select
                  value={formChildId}
                  onChange={e => setFormChildId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                >
                  {user?.children.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.ageMonths} meses)
                    </option>
                  ))}
                </select>
              </div>

              {/* Title & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Motivo o Título de la Cita:</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="Ej. Toma Mensual de Percentiles OMS, Control 12 meses..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Evento:</label>
                  <select
                    value={formType}
                    onChange={e => setFormType(e.target.value as AppointmentType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    <option value="percentiles">📊 Toma de Percentiles OMS</option>
                    <option value="pediatric_checkup">🩺 Control Pediátrico</option>
                    <option value="vaccination">💉 Vacunación</option>
                    <option value="specialist">🩺 Especialista Pediátrico</option>
                    <option value="medication">💊 Medicación / Cuidados</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Anticipación del Recordatorio:</label>
                  <select
                    value={formAdvanceMinutes}
                    onChange={e => setFormAdvanceMinutes(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    <option value={0}>Al momento exacto</option>
                    <option value={15}>15 minutos antes</option>
                    <option value={60}>1 hora antes</option>
                    <option value={1440}>1 día antes (24 hrs)</option>
                  </select>
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha:</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hora:</label>
                  <input
                    type="time"
                    required
                    value={formTime}
                    onChange={e => setFormTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* Location or Center */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Lugar, Pediatra o Centro Médico:</label>
                <input
                  type="text"
                  value={formDoctor}
                  onChange={e => setFormDoctor(e.target.value)}
                  placeholder="Ej. Dr. Carlos Silva / Clínica San Rafael / En Casa"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Notas o Preparativos:</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="Ej. Llevar cartilla de vacunación, pesar en ayunas antes del desayuno..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 resize-none"
                />
              </div>

              {/* Monthly repeat toggle for percentiles */}
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formRepeatMonthly}
                  onChange={e => setFormRepeatMonthly(e.target.checked)}
                  className="rounded-sm accent-emerald-600 cursor-pointer"
                />
                <span className="font-bold">Repetir recordatorio mensualmente (recomendado para percentiles OMS)</span>
              </label>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black cursor-pointer shadow-xs transition-all flex items-center gap-1.5"
                >
                  <BellRing className="w-4 h-4" />
                  <span>Guardar y Programar Recordatorio</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
