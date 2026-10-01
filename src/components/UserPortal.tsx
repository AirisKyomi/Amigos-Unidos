import React, { useState, Suspense } from 'react';
import { useFamily } from '../context/FamilyContext';
import { useTheme } from '../context/ThemeContext';
import { AgeBracket, PlatformRole } from '../types';
import { FroggiAvatar } from './MascotSVGs';
import { FroggiChat } from './FroggiChat';
import { UnifiedHeader, NavDrawerItem } from './UnifiedHeader';
import {
  Baby,
  Activity,
  Heart,
  Calendar,
  Sparkles,
  BookOpen,
  Clock,
  Settings,
  AlertTriangle,
  ChevronDown,
  User,
  Shield,
  Stethoscope,
  Smile,
  CheckCircle2,
  BarChart3,
  Code2,
  Volume2
} from 'lucide-react';

// Lazy-loaded sub-modules for fast switching
const PregnancyCare = React.lazy(() => import('./PregnancyCare').then(m => ({ default: m.PregnancyCare })));
const DermaTriage = React.lazy(() => import('./DermaTriage').then(m => ({ default: m.DermaTriage })));
const CryAnalyzer = React.lazy(() => import('./CryAnalyzer').then(m => ({ default: m.CryAnalyzer })));
const GrowthTracker = React.lazy(() => import('./GrowthTracker').then(m => ({ default: m.GrowthTracker })));
const PediatricCalendar = React.lazy(() => import('./PediatricCalendar').then(m => ({ default: m.PediatricCalendar })));
const MilestoneExplorer = React.lazy(() => import('./MilestoneExplorer').then(m => ({ default: m.MilestoneExplorer })));
const KidsZone = React.lazy(() => import('./KidsZone').then(m => ({ default: m.KidsZone })));
const HistoryView = React.lazy(() => import('./HistoryView').then(m => ({ default: m.HistoryView })));
const GeneticOptimizer = React.lazy(() => import('./GeneticOptimizer').then(m => ({ default: m.GeneticOptimizer })));
const SettingsModal = React.lazy(() => import('./SettingsModal').then(m => ({ default: m.SettingsModal })));
import {
  subscribeToInAppNotifications,
  checkDueAppointments
} from '../utils/notificationService';
import { playEmergencyAlarmSound } from '../utils/speechSynthesis';

interface UserPortalProps {
  onNavigateToBackoffice?: () => void;
  onNavigateToDev?: () => void;
  onLogout?: () => void;
}

export const UserPortal: React.FC<UserPortalProps> = ({
  onNavigateToBackoffice,
  onNavigateToDev,
  onLogout
}) => {
  const { user, activeChild, logout, addHistoryRecord, isBackofficeAuthorized, isDeveloperAuthorized } = useFamily();
  const { currentTheme, config } = useTheme();

  const [activeTab, setActiveTab] = useState<
    'chat' | 'pregnancy' | 'derma' | 'cry' | 'growth' | 'calendar' | 'milestones' | 'genetic' | 'kids_zone' | 'history'
  >('chat');
  const [selectedAge, setSelectedAge] = useState<AgeBracket>('0-12m');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // Active in-app notification popup state
  const [activeNotification, setActiveNotification] = useState<{
    id: string;
    title: string;
    body: string;
    type: string;
    timestamp: string;
  } | null>(null);

  // Always start on the first option (chat) when entering or switching profile
  React.useEffect(() => {
    setActiveTab('chat');
  }, [user?.id]);

  // Background reminder scheduler & in-app listener
  React.useEffect(() => {
    // Check due appointments on load
    checkDueAppointments();

    // Periodic check every 30 seconds
    const interval = setInterval(() => {
      checkDueAppointments();
    }, 30000);

    // Subscribe to in-app notifications
    const unsubscribe = subscribeToInAppNotifications(notif => {
      setActiveNotification(notif);
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    logout();
    if (onLogout) onLogout();
  };

  const navItems: NavDrawerItem[] = [
    { id: 'chat', label: 'Froggi Consulta Pediátrica', description: 'Chat clínico con síntesis de voz natural y directa', icon: Stethoscope, badge: 'Voz' },
    { id: 'growth', label: 'Dashboard Antropométrico OMS', description: 'Curvas de percentiles P3-P97 y comparativa con Recharts', icon: BarChart3, badge: 'Recharts' },
    { id: 'calendar', label: 'Calendario & Citas Pediátricas', description: 'Agenda de citas y recordatorios con Notification API', icon: Calendar, badge: 'Notificaciones' },
    { id: 'derma', label: 'Triaje de Piel con Visión IA', description: 'Análisis asistencial de sarpullidos y dermatitis', icon: Activity, badge: 'Cámara' },
    { id: 'cry', label: 'Detector Acústico de Llanto', description: 'Análisis espectral de frecuencia F0 en vivo', icon: Volume2, badge: 'F0 Audio' },
    { id: 'milestones', label: 'Hitos del Desarrollo UNICEF', description: 'Monitoreo de hitos cognitivos y motores', icon: Smile },
    { id: 'pregnancy', label: 'Acompañamiento Embarazo ACOG', description: 'Contador de pataditas, contracciones y síntomas', icon: Heart },
    { id: 'genetic', label: 'Menú BLW & Optimizador GA', description: 'Planes nutricionales adaptativos con algoritmo genético', icon: Sparkles },
    { id: 'kids_zone', label: 'Zona Niños & Cuentos', description: 'Cuentos interactivos, canciones y estimulación', icon: BookOpen }
  ];

  return (
    <div className={`min-h-screen flex flex-col ${currentTheme.pageBg} ${currentTheme.id === 'dark' ? 'text-slate-100' : 'text-slate-800'} transition-colors duration-200`}>
      {/* Unified Header: 3 stripes on the left (Options) + Profile on the right */}
      <UnifiedHeader
        interfaceTitle="Portal Familiar"
        activeItemId={activeTab}
        items={navItems}
        onSelectItem={(id) => setActiveTab(id as any)}
        onNavigateToBackoffice={onNavigateToBackoffice}
        onNavigateToDev={onNavigateToDev}
        onLogout={handleLogout}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenEmergency={() => setShowEmergencyModal(true)}
        onNavigateToHistory={() => setActiveTab('history')}
        selectedAge={selectedAge}
        onSelectAge={setSelectedAge}
      />

      <nav
        aria-label="Apartados del perfil familiar"
        role="tablist"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-3"
      >
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const shortLabels: Record<string, string> = {
              chat: 'IA principal',
              growth: 'Crecimiento',
              calendar: 'Calendario',
              derma: 'Piel',
              cry: 'Llanto',
              milestones: 'Desarrollo',
              pregnancy: 'Embarazo',
              genetic: 'Menú BLW',
              kids_zone: 'Zona Niños',
            };

            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                title={item.label}
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                className={`min-h-14 px-2 py-2 rounded-xl border flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700 ${
                  isActive
                    ? currentTheme.id === 'dark'
                      ? 'bg-cyan-900/70 text-cyan-100 border-cyan-700'
                      : 'bg-cyan-50 text-cyan-950 border-cyan-300'
                    : currentTheme.id === 'dark'
                      ? 'bg-slate-900/60 text-slate-200 border-slate-700 hover:bg-slate-800'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-cyan-50 hover:border-cyan-200'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="text-center leading-tight">{shortLabels[item.id]}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-5">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center min-h-[360px] p-8 text-center animate-pulse">
              <div className="w-10 h-10 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-3" />
              <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Cargando función de usuario...</p>
            </div>
          }
        >
          {activeTab === 'chat' && (
            <FroggiChat
              selectedAge={selectedAge}
              onOpenSettingsModal={() => setShowSettingsModal(true)}
              onOpenEmergencyModal={() => {
                playEmergencyAlarmSound();
                setShowEmergencyModal(true);
              }}
            />
          )}
          {activeTab === 'derma' && <DermaTriage />}
          {activeTab === 'cry' && <CryAnalyzer />}
          {activeTab === 'growth' && <GrowthTracker />}
          {activeTab === 'calendar' && (
            <PediatricCalendar onSchedulePercentileCheckup={() => setActiveTab('growth')} />
          )}
          {activeTab === 'milestones' && <MilestoneExplorer selectedAge={selectedAge} />}
          {activeTab === 'pregnancy' && <PregnancyCare onAddHistoryRecord={addHistoryRecord} />}
          {activeTab === 'genetic' && (
            <GeneticOptimizer selectedAge={selectedAge} setSelectedAge={setSelectedAge} />
          )}
          {activeTab === 'kids_zone' && <KidsZone />}
          {activeTab === 'history' && (
            <HistoryView onNavigateToTab={(tab) => setActiveTab(tab as any)} />
          )}
        </Suspense>

        {/* Global Medical Disclaimer Note Required for Patient Safety */}
        <footer className="pt-4 pb-2 border-t border-slate-200/70 dark:border-slate-800/80">
          <div className="p-4 rounded-2xl bg-amber-100/90 dark:bg-amber-950/50 border-2 border-amber-400 dark:border-amber-800 text-xs sm:text-sm text-amber-950 dark:text-amber-100 font-medium leading-relaxed space-y-2 shadow-xs">
            <div className="flex items-center gap-2 font-black text-amber-950 dark:text-amber-200 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-700 dark:text-amber-400" />
              <span>* AVISO MÉDICO IMPORTANTE & DESLINDE DE RESPONSABILIDAD:</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-100 font-medium leading-relaxed">
              * Esta aplicación y todas sus herramientas (triaje de piel, análisis acústico del llanto, percentiles y cálculos de dosis) son recursos de orientación pedagógica y asistencial. <strong>NO reemplazan en ninguna circunstancia el criterio, diagnóstico presencial, receta ni intervención de un médico pediatra u profesional de la salud certificado.</strong> Mantenga esto siempre muy en cuenta; la salud y el bienestar de su hijo o hija <strong>NO quedan bajo responsabilidad legal ni médica de esta plataforma ni de sus creadores</strong>. Ante cualquier signo de alarma, dificultad respiratoria o sospecha de urgencia, acuda de inmediato a un centro hospitalario o llame al <strong>123 (Colombia)</strong> o número de emergencias local.
            </p>
          </div>
        </footer>
      </main>

      {/* Floating Active In-App Notification Toast */}
      {activeNotification && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-3xl border border-blue-500/50 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-blue-600 text-white shadow-xs animate-bounce">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                  Recordatorio Pediátrico Activo
                </span>
                <h4 className="font-extrabold text-sm text-white">{activeNotification.title}</h4>
              </div>
            </div>
            <button
              onClick={() => setActiveNotification(null)}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-2 pl-1 leading-relaxed">
            {activeNotification.body}
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{activeNotification.timestamp}</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveNotification(null);
                  setActiveTab('calendar');
                }}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer"
              >
                Ver en Calendario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <Suspense fallback={null}>
        {showSettingsModal && (
          <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
        )}
      </Suspense>

      {/* Floating Emergency Protocol Modal with Sound & Direct Guidance */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border-2 border-rose-600 shadow-2xl p-5 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto text-slate-950 dark:text-slate-100">
            {/* Modal Header with Emergency Sound Trigger */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-rose-200 dark:border-rose-900/80">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-md animate-pulse">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-950 dark:text-rose-200 border border-rose-300 dark:border-rose-800">
                      ALERTA DE GRAVEDAD INMEDIATA
                    </span>
                    <button
                      type="button"
                      onClick={() => playEmergencyAlarmSound()}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 dark:text-amber-200 bg-amber-200 dark:bg-amber-950 px-2.5 py-0.5 rounded-full hover:bg-amber-300 transition-colors cursor-pointer border border-amber-300 dark:border-amber-800"
                      title="Reproducir sonido de alarma de urgencia"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Sonar Alarma</span>
                    </button>
                  </div>
                  <h3 className="font-black text-lg sm:text-xl text-slate-950 dark:text-white mt-1">
                    Protocolo de Urgencias Médicas Pediátricas
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold">
                    Guías Oficiales OMS, AAP y AHA PALS • Orientación Inmediata
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer font-black text-lg"
                title="Cerrar ventana de emergencia"
              >
                ✕
              </button>
            </div>

            {/* Direct Calling Buttons: COLOMBIA & International */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-rose-950 dark:text-rose-200 flex items-center gap-1.5">
                  <span>🇨🇴 LÍNEAS DE EMERGENCIA EN COLOMBIA (GRATIS 24/7):</span>
                </span>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  Pulsa para llamar de inmediato
                </span>
              </div>

              {/* Botón Principal Colombia 123 */}
              <a
                href="tel:123"
                className="flex items-center justify-center gap-2.5 p-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-base shadow-md transition-all active:scale-98 border-2 border-rose-700"
              >
                <AlertTriangle className="w-5 h-5 animate-bounce" />
                <span>🚨 LLAMAR AL 123 (Emergencias Nacional Colombia - Policía, Bomberos y Salud)</span>
              </a>

              {/* Botones Secundarios Colombia y Otros Países */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
                <a
                  href="tel:125"
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-extrabold text-xs shadow-xs transition-all text-center"
                  title="Centro Regulador de Urgencias y Emergencias Colombia"
                >
                  <span>🚑 125 (CRUE Ambulancias)</span>
                </a>
                <a
                  href="tel:132"
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-extrabold text-xs shadow-xs transition-all text-center"
                  title="Cruz Roja Colombiana"
                >
                  <span>🏥 132 (Cruz Roja Col)</span>
                </a>
                <a
                  href="tel:911"
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition-all text-center"
                >
                  <span>🌎 911 (América / Intl)</span>
                </a>
                <a
                  href="tel:112"
                  className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition-all text-center"
                >
                  <span>🌍 112 (Europa)</span>
                </a>
              </div>
            </div>

            {/* Section 1: Triángulo de Evaluación Pediátrica (TEP) con LETRAS OSCURAS Y LEGIBLES */}
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-300 dark:border-rose-800 space-y-2.5">
              <h4 className="font-black text-xs sm:text-sm text-rose-950 dark:text-rose-100 uppercase tracking-wider flex items-center gap-2">
                <span>🔺 1. Triángulo de Evaluación Pediátrica (TEP en 30 segundos)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-rose-200 dark:border-rose-900 shadow-xs">
                  <span className="font-black text-xs sm:text-sm text-rose-950 dark:text-rose-200 block mb-1">
                    1. Apariencia
                  </span>
                  <p className="text-xs text-slate-950 dark:text-slate-100 font-medium leading-relaxed">
                    Tono flácido, somnolencia profunda, no fija la mirada o llanto débil e inconsolable.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-rose-200 dark:border-rose-900 shadow-xs">
                  <span className="font-black text-xs sm:text-sm text-rose-950 dark:text-rose-200 block mb-1">
                    2. Respiración
                  </span>
                  <p className="text-xs text-slate-950 dark:text-slate-100 font-medium leading-relaxed">
                    Hundimiento de costillas (tiraje), aleteo de nariz, quejido al botar el aire o estridor.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-rose-200 dark:border-rose-900 shadow-xs">
                  <span className="font-black text-xs sm:text-sm text-rose-950 dark:text-rose-200 block mb-1">
                    3. Circulación
                  </span>
                  <p className="text-xs text-slate-950 dark:text-slate-100 font-medium leading-relaxed">
                    Piel muy pálida, aspecto marmóreo o labios azulados (cianosis). Relleno capilar mayor a 2 segundos.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Protocolos Específicos de Primeros Auxilios con LETRAS OSCURAS */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border-2 border-slate-300 dark:border-slate-700 space-y-1.5 shadow-xs">
                <h5 className="font-black text-slate-950 dark:text-white flex items-center gap-2 text-xs sm:text-sm">
                  <span>✋ Atragantamiento / Obstrucción de Vía Aérea (OVACE):</span>
                </h5>
                <p className="text-xs sm:text-sm text-slate-950 dark:text-slate-100 font-medium leading-relaxed">
                  • <strong>Si tose con fuerza:</strong> Déjale toser, nunca metas los dedos a ciegas.<br />
                  • <strong>Lactantes (menores de 1 año):</strong> 5 golpes firmes en la espalda entre los omóplatos boca abajo sobre el antebrazo + 5 compresiones en el pecho con dos dedos boca arriba.<br />
                  • <strong>Niños (mayores de 1 año):</strong> Maniobra de Heimlich colocándote detrás con el puño cerrado entre el ombligo y el pecho presionando hacia adentro y arriba.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border-2 border-slate-300 dark:border-slate-700 space-y-1.5 shadow-xs">
                <h5 className="font-black text-slate-950 dark:text-white flex items-center gap-2 text-xs sm:text-sm">
                  <span>⚡ Convulsiones o Desmayo:</span>
                </h5>
                <p className="text-xs sm:text-sm text-slate-950 dark:text-slate-100 font-medium leading-relaxed">
                  • Túmbalo de lado en el suelo (Posición Lateral de Seguridad) para que no aspire saliva.<br />
                  • <strong>PROHIBIDO:</strong> No metas nada en la boca, no introduzcas dedos ni cucharas, y no lo sujetes a la fuerza.<br />
                  • Cronometra la duración. Si dura más de 3 minutos, llama al <strong>123 (Colombia)</strong> o 911 de inmediato.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-100/90 dark:bg-amber-950/60 border-2 border-amber-400 dark:border-amber-800 space-y-1.5 shadow-xs">
                <h5 className="font-black text-amber-950 dark:text-amber-200 flex items-center gap-2 text-xs sm:text-sm">
                  <span>🌡️ Fiebre en Bebés Menores de 3 Meses & Petequias:</span>
                </h5>
                <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-100 font-medium leading-relaxed">
                  • Toda temperatura mayor o igual a 38.0°C en menores de 90 días requiere traslado hospitalario presencial de urgencia.<br />
                  • <strong>Prueba del vaso:</strong> Si aparecen manchitas rojas o moradas que NO desaparecen al presionar con un vaso de vidrio transparente, acude de inmediato a urgencias.
                </p>
              </div>
            </div>

            {/* Close action button */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setShowEmergencyModal(false)}
                className="w-full py-3.5 bg-slate-950 hover:bg-black text-white font-black rounded-2xl text-xs sm:text-sm transition-colors cursor-pointer shadow-md"
              >
                Entendido y Cerrar Protocolo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
