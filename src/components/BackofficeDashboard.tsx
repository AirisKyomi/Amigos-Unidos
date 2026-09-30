import React, { useState, useEffect } from 'react';
import { useFamily } from '../context/FamilyContext';
import { useTheme } from '../context/ThemeContext';
import { PlatformRole, SystemUserAccount } from '../types';
import { UnifiedHeader, NavDrawerItem } from './UnifiedHeader';
import {
  BarChart3,
  Users,
  Activity,
  ShieldCheck,
  Stethoscope,
  Volume2,
  FileText,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Code2,
  Clock,
  Database,
  Plus,
  Edit2,
  Trash2,
  X,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  ChevronDown,
  Info,
  Sparkles,
  PieChart,
  Sun,
  Moon,
  Calendar,
  ArrowUpRight,
  HelpCircle,
  HeartHandshake,
  Layers,
  Flame,
  ChevronRight
} from 'lucide-react';

// Polar to cartesian for SVG Donut
const polarToCartesian = (cx: number, cy: number, r: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians)
  };
};

const createDonutSegment = (
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number
) => {
  const safeEndAngle = endAngle - startAngle >= 359.99 ? startAngle + 359.99 : endAngle;
  const startOuter = polarToCartesian(cx, cy, rOuter, safeEndAngle);
  const endOuter = polarToCartesian(cx, cy, rOuter, startAngle);
  const startInner = polarToCartesian(cx, cy, rInner, startAngle);
  const endInner = polarToCartesian(cx, cy, rInner, safeEndAngle);

  const largeArcFlag = safeEndAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', startOuter.x, startOuter.y,
    'A', rOuter, rOuter, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
    'L', startInner.x, startInner.y,
    'A', rInner, rInner, 0, largeArcFlag, 1, endInner.x, endInner.y,
    'Z'
  ].join(' ');
};

interface ClinicalProtocol {
  id: string;
  title: string;
  category: 'fiebre' | 'respiratorio' | 'dermatologia' | 'digestivo' | 'nutricion' | 'urgencias';
  severity: 'normal' | 'moderate' | 'emergency';
  targetAge: string;
  guidelines: string;
  redFlags: string;
  source: string;
  author: string;
  updatedAt: string;
}

interface BackofficeDashboardProps {
  onNavigateToUserView?: () => void;
  onNavigateToDevView?: () => void;
  onLogout: () => void;
}

export const BackofficeDashboard: React.FC<BackofficeDashboardProps> = ({
  onNavigateToUserView,
  onNavigateToDevView,
  onLogout,
}) => {
  const { user } = useFamily();
  const { currentTheme } = useTheme();

  // Active section: always opens on the first option (overview)
  const [activeSection, setActiveSection] = useState<'overview' | 'users' | 'protocols' | 'audit'>('overview');

  useEffect(() => {
    setActiveSection('overview');
  }, [user?.id]);

  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<SystemUserAccount[]>([]);
  const [protocolsList, setProtocolsList] = useState<ClinicalProtocol[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationMsg, setNotificationMsg] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');

  // Search & Filter states
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | PlatformRole>('all');
  const [protocolSearchTerm, setProtocolSearchTerm] = useState('');
  const [protocolCategoryFilter, setProtocolCategoryFilter] = useState<string>('all');

  // Modals for CRUD: Users
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<SystemUserAccount | null>(null);
  const [userFormName, setUserFormName] = useState('');
  const [userFormEmail, setUserFormEmail] = useState('');
  const [userFormPassword, setUserFormPassword] = useState('');
  const [userFormRole, setUserFormRole] = useState<PlatformRole>('user');
  const [showPassword, setShowPassword] = useState(false);

  // Modals for CRUD: Protocols
  const [isCreateProtocolModalOpen, setIsCreateProtocolModalOpen] = useState(false);
  const [isEditProtocolModalOpen, setIsEditProtocolModalOpen] = useState(false);
  const [selectedProtocolForEdit, setSelectedProtocolForEdit] = useState<ClinicalProtocol | null>(null);
  const [protFormTitle, setProtFormTitle] = useState('');
  const [protFormCategory, setProtFormCategory] = useState<ClinicalProtocol['category']>('fiebre');
  const [protFormSeverity, setProtFormSeverity] = useState<ClinicalProtocol['severity']>('normal');
  const [protFormTargetAge, setProtFormTargetAge] = useState('0 a 10 años');
  const [protFormGuidelines, setProtFormGuidelines] = useState('');
  const [protFormRedFlags, setProtFormRedFlags] = useState('');
  const [protFormSource, setProtFormSource] = useState('American Academy of Pediatrics (AAP)');

  // Confirm delete modal
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'user' | 'protocol'; idOrEmail: string; label: string } | null>(null);

  // Interactive Didactic Chart States
  const [didacticFilter, setDidacticFilter] = useState<'all' | 'donut' | 'cry' | 'heatmap' | 'derma'>('all');
  const [selectedDonutIndex, setSelectedDonutIndex] = useState<number>(0);
  const [selectedBioacousticIndex, setSelectedBioacousticIndex] = useState<number>(7);
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{ day: string; slot: string; value: number; explanation: string } | null>({
    day: 'Miércoles',
    slot: 'Madrugada (00:00 - 06:00)',
    value: 68,
    explanation: 'Pico semanal de 68 alertas febriles. Entre 02:00 y 05:00 ocurre el valle fisiológico de cortisol circadiano en lactantes, intensificando los episodios de fiebre nocturna.'
  });
  const [selectedDermaAgeIndex, setSelectedDermaAgeIndex] = useState<number>(0);
  const [isSimulatingAudio, setIsSimulatingAudio] = useState(false);
  const [bioacousticData, setBioacousticData] = useState([
    { id: 1, time: '08:00', f0: 412, cause: 'Hambre temprana', severity: 'normal', decibels: '58 dB', notes: 'Curva periódica y armónicos estables con pausas regulares de respiración.' },
    { id: 2, time: '09:15', f0: 428, cause: 'Hambre / Reflejo succión', severity: 'normal', decibels: '62 dB', notes: 'Frecuencia fundamental típica de lactante sano. Se resuelve tras toma de leche.' },
    { id: 3, time: '10:45', f0: 395, cause: 'Fatiga & Somnolencia', severity: 'normal', decibels: '54 dB', notes: 'F0 baja con bostezos audibles y descenso de intensidad vocal.' },
    { id: 4, time: '12:30', f0: 440, cause: 'Incomodidad por pañal', severity: 'normal', decibels: '60 dB', notes: 'Llanto intermitente con tono medio. Pausa inmediata al retirar pañal húmedo.' },
    { id: 5, time: '14:20', f0: 485, cause: 'Gases / Meteorismo', severity: 'moderate', decibels: '68 dB', notes: 'Variabilidad de pitch moderada y flexión de extremidades hacia el abdomen.' },
    { id: 6, time: '16:00', f0: 510, cause: 'Cólico del lactante', severity: 'moderate', decibels: '72 dB', notes: 'Patrón ondulante vespertino (regla de Wessel). Mejora con porteo y ruido blanco.' },
    { id: 7, time: '17:40', f0: 455, cause: 'Sobreestimulación ambiental', severity: 'normal', decibels: '64 dB', notes: 'Llanto por sobrecarga de estímulos luminosos o ruidos familiares continuos.' },
    { id: 8, time: '19:10', f0: 620, cause: 'Dolor agudo / Alarma', severity: 'emergency', decibels: '84 dB', notes: 'F0 superior a 600 Hz. Llanto álgico continuo y tenso. Requiere descartar otitis o invaginación.' },
    { id: 9, time: '20:30', f0: 570, cause: 'Malestar post-fiebre', severity: 'moderate', decibels: '70 dB', notes: 'Quejido leve coincidente con temperatura de 38.3°C. Descenso progresivo tras antitérmico.' },
    { id: 10, time: '22:15', f0: 460, cause: 'Búsqueda de contención', severity: 'normal', decibels: '59 dB', notes: 'Cesa al contacto piel con piel (método canguro) y balanceo rítmico.' },
    { id: 11, time: '00:40', f0: 430, cause: 'Hambre nocturna', severity: 'normal', decibels: '61 dB', notes: 'Lactancia materna a demanda durante la noche.' },
    { id: 12, time: '03:10', f0: 445, cause: 'Microdespertar fisiológico', severity: 'normal', decibels: '56 dB', notes: 'Autocalma tras 4 minutos sin intervención farmacológica.' }
  ]);

  const handleSimulateCrySample = () => {
    setIsSimulatingAudio(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const randomF0 = Math.floor(400 + Math.random() * 240);
      let cause = 'Hambre y reflejo';
      let severity: 'normal' | 'moderate' | 'emergency' = 'normal';
      let notes = 'Frecuencia en rango fisiológico estándar.';

      if (randomF0 > 600) {
        cause = 'Llanto Álgico (Dolor Agudo)';
        severity = 'emergency';
        notes = 'F0 crítica (>600 Hz): requiere evaluación de dolor abdominal, otitis o signo de irritabilidad.';
      } else if (randomF0 > 500) {
        cause = 'Cólico / Molestia abdominal';
        severity = 'moderate';
        notes = 'F0 elevada por tensión abdominal. Aplicar técnica 5 S de Karp y masajes circulares.';
      } else if (randomF0 < 415) {
        cause = 'Fatiga y sobreestimulación';
        severity = 'normal';
        notes = 'F0 baja con pausas vocales largas indicando necesidad de descanso y penumbra.';
      }

      const newSample = {
        id: Date.now(),
        time: timeStr,
        f0: randomF0,
        cause,
        severity,
        decibels: `${Math.floor(58 + Math.random() * 22)} dB`,
        notes
      };

      setBioacousticData((prev) => [...prev.slice(1), newSample]);
      setSelectedBioacousticIndex(11);
      setIsSimulatingAudio(false);
      showNotification(`Muestra bioacústica procesada: ${randomF0} Hz (${cause})`, severity === 'emergency' ? 'error' : 'success');
    }, 450);
  };

  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotificationMsg(msg);
    setNotificationType(type);
    setTimeout(() => setNotificationMsg(''), 3500);
  };

  // Fetch stats, users & protocols from backend
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, usersRes, protRes] = await Promise.all([
        fetch('/api/backoffice/dashboard-stats'),
        fetch('/api/auth/users'),
        fetch('/api/admin/protocols')
      ]);

      if (statsRes.ok) {
        const data = await statsRes.json();
        if (data.success) setStats(data.stats);
      }

      if (usersRes.ok) {
        const data = await usersRes.json();
        if (data.success) setUsersList(data.users);
      }

      if (protRes.ok) {
        const data = await protRes.json();
        if (data.success) setProtocolsList(data.protocols);
      }
    } catch (err) {
      console.warn('Error fetching backoffice data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // -------------------------------------------------------------
  // USER CRUD OPERATIONS
  // -------------------------------------------------------------
  const handleOpenCreateUser = () => {
    setUserFormName('');
    setUserFormEmail('');
    setUserFormPassword('');
    setUserFormRole('user');
    setShowPassword(false);
    setIsCreateUserModalOpen(true);
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormName || !userFormEmail || !userFormPassword) {
      showNotification('Todos los campos son requeridos.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userFormName,
          email: userFormEmail,
          password: userFormPassword,
          role: userFormRole
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Usuario ${userFormName} creado exitosamente.`);
        setIsCreateUserModalOpen(false);
        loadDashboardData();
      } else {
        showNotification(data.error || 'Error al crear usuario.', 'error');
      }
    } catch (e: any) {
      showNotification('Error de conexión con el servidor.', 'error');
    }
  };

  const handleOpenEditUser = (targetUser: SystemUserAccount) => {
    setSelectedUserForEdit(targetUser);
    setUserFormName(targetUser.name);
    setUserFormEmail(targetUser.email);
    setUserFormPassword('');
    setUserFormRole(targetUser.role);
    setShowPassword(false);
    setIsEditUserModalOpen(true);
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForEdit) return;
    try {
      const payload: any = {
        email: selectedUserForEdit.email,
        name: userFormName,
        role: userFormRole
      };
      if (userFormPassword.trim()) {
        payload.newPassword = userFormPassword.trim();
      }
      const res = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Cuenta de ${userFormName} actualizada.`);
        setIsEditUserModalOpen(false);
        loadDashboardData();
      } else {
        showNotification(data.error || 'Error al actualizar usuario.', 'error');
      }
    } catch (e: any) {
      showNotification('Error de conexión.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'user') {
        const res = await fetch('/api/admin/users/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: deleteTarget.idOrEmail })
        });
        const data = await res.json();
        if (data.success) {
          showNotification(`Usuario ${deleteTarget.label} eliminado.`);
          loadDashboardData();
        } else {
          showNotification(data.error || 'Error al eliminar usuario.', 'error');
        }
      } else if (deleteTarget.type === 'protocol') {
        const res = await fetch('/api/admin/protocols/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: deleteTarget.idOrEmail })
        });
        const data = await res.json();
        if (data.success) {
          showNotification(`Protocolo "${deleteTarget.label}" eliminado.`);
          loadDashboardData();
        } else {
          showNotification(data.error || 'Error al eliminar protocolo.', 'error');
        }
      }
    } catch (e: any) {
      showNotification('Error de conexión.', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  // -------------------------------------------------------------
  // PROTOCOL CRUD OPERATIONS
  // -------------------------------------------------------------
  const handleOpenCreateProtocol = () => {
    setProtFormTitle('');
    setProtFormCategory('fiebre');
    setProtFormSeverity('normal');
    setProtFormTargetAge('0 a 10 años');
    setProtFormGuidelines('');
    setProtFormRedFlags('');
    setProtFormSource('American Academy of Pediatrics (AAP)');
    setIsCreateProtocolModalOpen(true);
  };

  const handleCreateProtocolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!protFormTitle || !protFormGuidelines) {
      showNotification('Título e indicaciones clínicas son requeridos.', 'error');
      return;
    }
    try {
      const res = await fetch('/api/admin/protocols/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: protFormTitle,
          category: protFormCategory,
          severity: protFormSeverity,
          targetAge: protFormTargetAge,
          guidelines: protFormGuidelines,
          redFlags: protFormRedFlags,
          source: protFormSource,
          author: user?.name || 'Administrador Clínico'
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Protocolo "${protFormTitle}" creado exitosamente.`);
        setIsCreateProtocolModalOpen(false);
        loadDashboardData();
      } else {
        showNotification(data.error || 'Error al crear protocolo.', 'error');
      }
    } catch (e: any) {
      showNotification('Error de conexión.', 'error');
    }
  };

  const handleOpenEditProtocol = (prot: ClinicalProtocol) => {
    setSelectedProtocolForEdit(prot);
    setProtFormTitle(prot.title);
    setProtFormCategory(prot.category);
    setProtFormSeverity(prot.severity);
    setProtFormTargetAge(prot.targetAge);
    setProtFormGuidelines(prot.guidelines);
    setProtFormRedFlags(prot.redFlags);
    setProtFormSource(prot.source);
    setIsEditProtocolModalOpen(true);
  };

  const handleEditProtocolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProtocolForEdit) return;
    try {
      const res = await fetch('/api/admin/protocols/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedProtocolForEdit.id,
          title: protFormTitle,
          category: protFormCategory,
          severity: protFormSeverity,
          targetAge: protFormTargetAge,
          guidelines: protFormGuidelines,
          redFlags: protFormRedFlags,
          source: protFormSource
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Protocolo "${protFormTitle}" actualizado.`);
        setIsEditProtocolModalOpen(false);
        loadDashboardData();
      } else {
        showNotification(data.error || 'Error al actualizar protocolo.', 'error');
      }
    } catch (e: any) {
      showNotification('Error de conexión.', 'error');
    }
  };

  // Filtered lists
  const filteredUsers = usersList.filter((u) => {
    if (userRoleFilter !== 'all' && u.role !== userRoleFilter) return false;
    if (userSearchTerm) {
      const term = userSearchTerm.toLowerCase();
      return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
    }
    return true;
  });

  const filteredProtocols = protocolsList.filter((p) => {
    if (protocolCategoryFilter !== 'all' && p.category !== protocolCategoryFilter) return false;
    if (protocolSearchTerm) {
      const term = protocolSearchTerm.toLowerCase();
      return (
        p.title.toLowerCase().includes(term) ||
        p.guidelines.toLowerCase().includes(term) ||
        p.source.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const backofficeItems: NavDrawerItem[] = [
    { id: 'overview', label: 'Resumen Clínico & KPIs', description: 'Consultas médicas, bioacústica y triajes', icon: BarChart3 },
    { id: 'users', label: 'Gestión CRUD de Usuarios', description: 'Crear, consultar, editar y eliminar cuentas', icon: Users, badge: `${usersList.length}` },
    { id: 'protocols', label: 'Protocolos Clínicos (CRUD)', description: 'Directrices OMS/AAP y banderas rojas', icon: Stethoscope, badge: `${protocolsList.length}` },
    { id: 'audit', label: 'Auditoría & Logs de Seguridad', description: 'Registro inmutable y trazabilidad médica', icon: ShieldCheck },
  ];

  return (
    <div className={`min-h-screen ${currentTheme.pageBg} text-slate-800 transition-colors duration-200 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950`}>
      {/* Header */}
      <UnifiedHeader
        interfaceTitle="Panel de Administración"
        activeItemId={activeSection}
        items={backofficeItems}
        onSelectItem={(id) => setActiveSection(id as any)}
        onNavigateToUser={onNavigateToUserView}
        onNavigateToDev={onNavigateToDevView}
        onLogout={onLogout}
        extraHeaderActions={
          <button
            type="button"
            onClick={loadDashboardData}
            className="p-2 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 transition-all cursor-pointer shadow-2xs"
            title="Refrescar Datos"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        }
      />

      {/* Notification Toast */}
      {notificationMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 w-full">
          <div
            className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2.5 shadow-sm transition-all ${
              notificationType === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            {notificationType === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notificationMsg}</span>
          </div>
        </div>
      )}

      {/* Main Content Area (las opciones se seleccionan exclusivamente desde las 3 rayitas) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ========================================================= */}
        {/* 1. SECCIÓN: GESTIÓN CRUD DE USUARIOS                      */}
        {/* ========================================================= */}
        {activeSection === 'users' && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-amber-200 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-rounded font-bold text-lg text-amber-950">
                        Gestión CRUD de Usuarios & Cuentas
                      </h2>
                      <p className="text-xs text-slate-500">
                        Crear nuevas cuentas, modificar datos, cambiar roles y rehashear claves en PBKDF2/SHA-512 ($0 Costo).
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenCreateUser}
                  className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-98 text-amber-950 font-bold text-xs shadow-2xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto border border-amber-500/50"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Nuevo Usuario</span>
                </button>
              </div>

              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre o correo electrónico..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-amber-50/30 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value as any)}
                    className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="all">Todos los roles ({usersList.length})</option>
                    <option value="user">Solo Familias (User)</option>
                    <option value="admin">Solo Administradores (Admin)</option>
                    <option value="developer">Solo Desarrolladores (Dev)</option>
                  </select>
                </div>
              </div>

              {/* Interactive Users Table (Read, Update, Delete) */}
              <div className="overflow-x-auto rounded-2xl border border-amber-100">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FFFDF7] text-slate-500 uppercase font-bold border-b border-amber-100">
                    <tr>
                      <th className="py-3.5 px-4">Usuario</th>
                      <th className="py-3.5 px-4">Correo Electrónico</th>
                      <th className="py-3.5 px-4">Método Criptográfico</th>
                      <th className="py-3.5 px-4">Rol del Sistema</th>
                      <th className="py-3.5 px-4">Registro / Acceso</th>
                      <th className="py-3.5 px-4 text-right">Acciones CRUD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100/60 bg-white">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                          No se encontraron usuarios que coincidan con la búsqueda.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-amber-50/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xs font-bold text-amber-900 shrink-0">
                                {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <span className="font-semibold text-amber-950">{u.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{u.email}</td>
                          <td className="py-3.5 px-4">
                            {u.isGoogleAuth ? (
                              <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold inline-flex items-center gap-1">
                                Google (1-Click)
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-[10px] font-bold inline-flex items-center gap-1">
                                PBKDF2 / SHA-512
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                u.role === 'developer'
                                  ? 'bg-amber-200 text-amber-950 border border-amber-300'
                                  : u.role === 'admin'
                                  ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                                  : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                              }`}
                            >
                              {u.role === 'user' ? 'Familia' : u.role}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                            {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Reciente'}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* UPDATE Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenEditUser(u)}
                                className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all cursor-pointer"
                                title="Editar Usuario & Contraseña"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* DELETE Button */}
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteTarget({
                                    type: 'user',
                                    idOrEmail: u.email,
                                    label: u.name || u.email
                                  })
                                }
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
                                title="Eliminar Usuario"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. SECCIÓN: GESTIÓN CRUD DE PROTOCOLOS CLÍNICOS           */}
        {/* ========================================================= */}
        {activeSection === 'protocols' && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-amber-200 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-rounded font-bold text-lg text-amber-950">
                        Protocolos Pediátricos & Guías de Triaje (CRUD)
                      </h2>
                      <p className="text-xs text-slate-500">
                        Crear, auditar y actualizar normas de actuación clínica basadas en lineamientos OMS, AAP y UNICEF.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOpenCreateProtocol}
                  className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-98 text-amber-950 font-bold text-xs shadow-2xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto border border-amber-500/50"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Nuevo Protocolo</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={protocolSearchTerm}
                    onChange={(e) => setProtocolSearchTerm(e.target.value)}
                    placeholder="Buscar por patología, fármaco o recomendación..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-amber-50/30 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                  <select
                    value={protocolCategoryFilter}
                    onChange={(e) => setProtocolCategoryFilter(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    <option value="all">Todas las categorías ({protocolsList.length})</option>
                    <option value="fiebre">Fiebre & Manejo Antitérmico</option>
                    <option value="respiratorio">Dificultad Respiratoria</option>
                    <option value="dermatologia">Dermatología Infantil</option>
                    <option value="digestivo">Digestivo & Deshidratación</option>
                    <option value="urgencias">Emergencias Críticas</option>
                  </select>
                </div>
              </div>

              {/* Protocols List */}
              <div className="grid grid-cols-1 gap-4">
                {filteredProtocols.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs bg-amber-50/30 rounded-2xl border border-amber-100">
                    No se encontraron protocolos con los criterios seleccionados.
                  </div>
                ) : (
                  filteredProtocols.map((prot) => (
                    <div
                      key={prot.id}
                      className="p-5 rounded-2xl border border-amber-200/80 bg-[#FFFDF9] hover:bg-white transition-all shadow-2xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              prot.severity === 'emergency'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : prot.severity === 'moderate'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            }`}
                          >
                            {prot.severity === 'emergency'
                              ? 'Urgencia Roja'
                              : prot.severity === 'moderate'
                              ? 'Alerta Amarilla'
                              : 'Normal / Preventivo'}
                          </span>
                          <h3 className="font-rounded font-bold text-sm sm:text-base text-amber-950">
                            {prot.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-slate-400">
                            Rango: {prot.targetAge}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenEditProtocol(prot)}
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all cursor-pointer"
                            title="Editar Protocolo"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteTarget({
                                type: 'protocol',
                                idOrEmail: prot.id,
                                label: prot.title
                              })
                            }
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
                            title="Eliminar Protocolo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-slate-700">
                        <div>
                          <strong className="text-amber-950 font-bold">Pautas de Actuación: </strong>
                          <span>{prot.guidelines}</span>
                        </div>

                        {prot.redFlags && (
                          <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-900 flex items-start gap-2 text-[11px]">
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-bold">Signos de Alarma / Derivación: </strong>
                              <span>{prot.redFlags}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-100 text-[11px] text-slate-400">
                        <span>Fuente Oficial: <strong>{prot.source}</strong></span>
                        <span>Auditor: {prot.author}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. SECCIÓN: RESUMEN CLÍNICO & KPIS                        */}
        {/* ========================================================= */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards Top */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-amber-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>Consultas Pediátricas</span>
                  <Activity className="w-4 h-4 text-amber-700" />
                </div>
                <div className="text-2xl sm:text-3xl font-rounded font-bold text-amber-950">
                  {stats?.consultationMetrics?.totalConsultations ?? 1248}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+43 consultas hoy</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-amber-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>Triajes de Piel AAP</span>
                  <Stethoscope className="w-4 h-4 text-amber-700" />
                </div>
                <div className="text-2xl sm:text-3xl font-rounded font-bold text-amber-950">
                  {stats?.dermaMetrics?.totalScans ?? 412}
                </div>
                <span className="text-[11px] text-slate-500 font-semibold">
                  Gemini 3.6 Flash Visión
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-amber-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>Bioacústica del Llanto</span>
                  <Volume2 className="w-4 h-4 text-amber-700" />
                </div>
                <div className="text-2xl sm:text-3xl font-rounded font-bold text-amber-950">
                  {stats?.cryMetrics?.totalAnalyses ?? 389}
                </div>
                <span className="text-[11px] text-indigo-700 font-semibold">
                  F0 Promedio: 442 Hz
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-amber-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>Cuentas Registradas</span>
                  <Users className="w-4 h-4 text-amber-700" />
                </div>
                <div className="text-2xl sm:text-3xl font-rounded font-bold text-amber-950">
                  {usersList.length}
                </div>
                <span className="text-[11px] text-amber-900 font-bold">
                  Cifrado PBKDF2/SHA-512 ($0)
                </span>
              </div>
            </div>

            {/* Clinical Analytics Breakdown */}
            {/* ---------------------------------------------------- */}
            {/* SUB-NAV DE FILTROS DIDÁCTICOS                        */}
            {/* ---------------------------------------------------- */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-amber-200 rounded-2xl shadow-2xs">
              <span className="text-xs font-bold text-amber-950 px-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Vistas Didácticas:</span>
              </span>
              {[
                { id: 'all', label: 'Todas las Gráficas', icon: Layers },
                { id: 'donut', label: '🍩 Distribución Epidemiológica (AAP)', icon: PieChart },
                { id: 'cry', label: '📈 Curva Espectral F0 (Bioacústica)', icon: Volume2 },
                { id: 'heatmap', label: '🕒 Cronobiología 24/7 (Heatmap)', icon: Calendar },
                { id: 'derma', label: '🔬 Triaje Cutáneo por Edad', icon: Stethoscope }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDidacticFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    didacticFilter === tab.id
                      ? 'bg-amber-400 text-amber-950 shadow-2xs border border-amber-500/50'
                      : 'text-slate-600 hover:bg-amber-50 hover:text-amber-950'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* ========================================================= */}
            {/* GRÁFICA 1: DONUT CHART DIDÁCTICO DE DISTRIBUCIÓN AAP      */}
            {/* ========================================================= */}
            {(didacticFilter === 'all' || didacticFilter === 'donut') && (() => {
              const topics = [
                {
                  topic: 'Fiebre y Antitérmicos (AAP)',
                  percentage: 32,
                  cases: 399,
                  color: '#F59E0B',
                  badge: 'Urgencias Frecuentes',
                  icon: Flame,
                  guideline: 'Guía AAP 2024: Manejo del lactante con fiebre sin foco',
                  explanation: 'El 85% de las fiebres infantiles corresponden a infecciones virales autolimitadas. Se prioriza el confort del niño y cálculo exacto de antitérmicos por peso real (Paracetamol 15 mg/kg cada 6h; Ibuprofeno 10 mg/kg cada 8h en mayores de 6 meses).',
                  redFlag: 'Fiebre >38°C en menores de 3 meses, petequias, rigidez nucal o decaimiento severo.'
                },
                {
                  topic: 'Alimentación Complementaria & BLW',
                  percentage: 22,
                  cases: 274,
                  color: '#10B981',
                  badge: 'Nutrición Infantil',
                  icon: HeartHandshake,
                  guideline: 'Directrices OMS / ESPGHAN sobre Alimentación Complementaria',
                  explanation: 'Inicio a los 6 meses cumplidos evaluando maduración psicomotriz (sedestación estable, pérdida de reflejo de extrusión). Priorizar alimentos ricos en hierro y cortes seguros en forma de bastón (regla del pulgar).',
                  redFlag: 'Frutos secos enteros, uvas sin cortar o salchichas en rodajas por alto riesgo de atragantamiento.'
                },
                {
                  topic: 'Bronquiolitis y Dificultad Respiratoria',
                  percentage: 18,
                  cases: 224,
                  color: '#6366F1',
                  badge: 'Patología Respiratoria',
                  icon: Activity,
                  guideline: 'Protocolo AAP / AEP de Bronquiolitis Aguda',
                  explanation: 'Mayor incidencia en menores de 2 años por Virus Respiratorio Sincitial (VRS). Tratamiento de soporte: lavados nasales frecuentes con suero salino y tomas fraccionadas para evitar agotamiento respiratorio.',
                  redFlag: 'Tiraje subcostal/intercostal, aleteo nasal, quejido espiratorio o frecuencia >50 rpm.'
                },
                {
                  topic: 'Dermatitis del Pañal y Cutáneas',
                  percentage: 14,
                  cases: 175,
                  color: '#EC4899',
                  badge: 'Dermatología Pediátrica',
                  icon: Stethoscope,
                  guideline: 'Algoritmo de Eritemas en Área del Pañal',
                  explanation: 'Eritema por humedad prolongada y fricción ácida. Manejo con cambios inmediatos de pañal, higiene con agua templada sin frotar y pomadas barrera con pasta al agua (óxido de zinc).',
                  redFlag: 'Lesiones satélite con pústulas periféricas (sugiere sobreinfección fúngica por Candida).'
                },
                {
                  topic: 'Sueño Infantil & Llanto Inconsolable',
                  percentage: 10,
                  cases: 125,
                  color: '#8B5CF6',
                  badge: 'Neurodesarrollo & Sueño',
                  icon: Moon,
                  guideline: 'Higiene del Sueño y Prevención de SMSL (AAP)',
                  explanation: 'Respeto a las ventanas de vigilia (60-90 min en recién nacidos, 2-3h en 6 meses). Sueño seguro boca arriba en cuna despejada sin almohadas ni protectores acolchados.',
                  redFlag: 'Llanto monótono de tono agudo continuo no consolable asociado a hipotonía o vómitos biliosos.'
                },
                {
                  topic: 'Hitos Neurocognitivos UNICEF',
                  percentage: 4,
                  cases: 51,
                  color: '#06B6D4',
                  badge: 'Desarrollo Psicomotor',
                  icon: Sparkles,
                  guideline: 'Escala Haizea-Llevant & Hitos UNICEF',
                  explanation: 'Seguimiento de hitos: fijación ocular y sonrisa social (6 sem), sostén cefálico (3-4m), volteo activo (4-5m), pinza digital (9-10m). Promover juego libre en suelo.',
                  redFlag: 'Pérdida de hitos previamente adquiridos o asimetría persistente en extremidades.'
                }
              ];

              let currentAngle = 0;
              const donutSegments = topics.map((item, idx) => {
                const startAngle = currentAngle;
                const sweep = (item.percentage / 100) * 360;
                const endAngle = startAngle + sweep;
                currentAngle = endAngle;
                const isSelected = selectedDonutIndex === idx;
                const path = createDonutSegment(100, 100, isSelected ? 86 : 78, 50, startAngle, endAngle);
                return { ...item, path, isSelected, idx };
              });

              const activeTopic = topics[selectedDonutIndex] || topics[0];
              const ActiveIcon = activeTopic.icon;

              return (
                <div className="p-6 rounded-3xl bg-white border border-amber-200 shadow-2xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                          <PieChart className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-rounded font-bold text-base sm:text-lg text-amber-950">
                            Distribución Epidemiológica de Triajes (Donut Interactivo)
                          </h3>
                          <p className="text-xs text-slate-500">
                            Haz clic o pasa el cursor sobre cada segmento para desplegar la pauta médica oficial según la AAP y OMS.
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-bold self-start sm:self-auto">
                      1,248 Consultas Auditadas
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* SVG Donut Visualizer */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                      <div className="relative w-64 h-64 sm:w-72 sm:h-72">
                        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
                          {donutSegments.map((seg) => (
                            <path
                              key={seg.topic}
                              d={seg.path}
                              fill={seg.color}
                              stroke="#ffffff"
                              strokeWidth={seg.isSelected ? '2.5' : '1.5'}
                              className="transition-all duration-200 cursor-pointer hover:opacity-90"
                              onClick={() => setSelectedDonutIndex(seg.idx)}
                              onMouseEnter={() => setSelectedDonutIndex(seg.idx)}
                            />
                          ))}
                        </svg>

                        {/* Donut Center Display */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
                          <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white mb-1 shadow-2xs"
                            style={{ backgroundColor: activeTopic.color }}
                          >
                            <ActiveIcon className="w-5 h-5" />
                          </div>
                          <span className="text-3xl font-rounded font-extrabold text-amber-950 tracking-tight">
                            {activeTopic.percentage}%
                          </span>
                          <span className="text-[11px] font-bold text-slate-600 max-w-[120px] truncate">
                            {activeTopic.topic.split(' ')[0]}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {activeTopic.cases} casos
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 text-center mt-1">
                        Interactúa con los segmentos para ver guías clínicas
                      </p>
                    </div>

                    {/* Interactive Legend List */}
                    <div className="lg:col-span-7 space-y-2.5">
                      {topics.map((item, idx) => {
                        const isSelected = selectedDonutIndex === idx;
                        return (
                          <div
                            key={item.topic}
                            onClick={() => setSelectedDonutIndex(idx)}
                            onMouseEnter={() => setSelectedDonutIndex(idx)}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-amber-50/80 border-amber-300 shadow-2xs'
                                : 'bg-slate-50/60 hover:bg-amber-50/40 border-slate-200/80'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                                style={{ backgroundColor: item.color }}
                              />
                              <div className="min-w-0">
                                <p className={`text-xs font-bold truncate ${isSelected ? 'text-amber-950' : 'text-slate-700'}`}>
                                  {item.topic}
                                </p>
                                <p className="text-[10px] text-slate-500 font-medium">
                                  {item.badge} • {item.cases} casos
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <div className="w-20 sm:w-28 h-2 rounded-full bg-slate-200 overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-300"
                                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                                />
                              </div>
                              <span className="text-xs font-extrabold text-amber-950 w-9 text-right">
                                {item.percentage}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Didactic Clinical Card (Deep Dive for Selected Topic) */}
                  <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/60 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: activeTopic.color }}
                        />
                        <h4 className="font-rounded font-bold text-sm text-amber-950">
                          {activeTopic.topic} — {activeTopic.guideline}
                        </h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-200/70 text-[11px] font-bold text-amber-900">
                        {activeTopic.cases} familias asesoradas ({activeTopic.percentage}% del total)
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 leading-relaxed">
                      <strong className="text-amber-950 font-bold">Pauta Clínica Pediatra: </strong>
                      <span>{activeTopic.explanation}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-900 flex items-start gap-2.5 text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Signo de Alarma Hospitalario (Bandera Roja): </strong>
                        <span>{activeTopic.redFlag}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ========================================================= */}
            {/* GRÁFICA 2: CURVA BIOACÚSTICA ESPECTRAL F0 DEL LLANTO      */}
            {/* ========================================================= */}
            {(didacticFilter === 'all' || didacticFilter === 'cry') && (() => {
              const svgW = 560;
              const svgH = 180;
              const padL = 40;
              const padR = 25;
              const padT = 20;
              const padB = 30;
              const plotW = svgW - padL - padR;
              const plotH = svgH - padT - padB;

              const minF0 = 300;
              const maxF0 = 700;

              const getY = (val: number) => {
                const ratio = (val - minF0) / (maxF0 - minF0);
                return padT + (1 - ratio) * plotH;
              };

              const getX = (idx: number) => {
                return padL + (idx / (bioacousticData.length - 1)) * plotW;
              };

              // Normal physiologic band: 400Hz to 550Hz
              const yNormalTop = getY(550);
              const yNormalBottom = getY(400);
              const normalBandHeight = yNormalBottom - yNormalTop;

              // Emergency threshold line: 600Hz
              const yEmergency = getY(600);

              // Build smooth spline path for samples
              const points = bioacousticData.map((d, i) => ({ x: getX(i), y: getY(d.f0), ...d }));
              const linePath = points.reduce((acc, pt, i, arr) => {
                if (i === 0) return `M ${pt.x} ${pt.y}`;
                const prev = arr[i - 1];
                const cx1 = prev.x + (pt.x - prev.x) / 2;
                const cy1 = prev.y;
                const cx2 = prev.x + (pt.x - prev.x) / 2;
                const cy2 = pt.y;
                return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
              }, '');

              // Area fill under spline
              const firstPt = points[0];
              const lastPt = points[points.length - 1];
              const areaPath = `${linePath} L ${lastPt.x} ${padT + plotH} L ${firstPt.x} ${padT + plotH} Z`;

              const selectedPoint = bioacousticData[selectedBioacousticIndex] || bioacousticData[7];

              return (
                <div className="p-6 rounded-3xl bg-white border border-amber-200 shadow-2xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-indigo-100 text-indigo-900">
                        <Volume2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-rounded font-bold text-base sm:text-lg text-amber-950">
                          Bioacústica Espectral del Llanto Infantil (F0 en Hertz vs Tiempo)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Curva espectrográfica interactiva con umbrales clínicos de alerta para detección precoz de dolor agudo.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSimulateCrySample}
                      disabled={isSimulatingAudio}
                      className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-2 cursor-pointer border border-indigo-700 self-start sm:self-auto disabled:opacity-50"
                    >
                      <Sparkles className={`w-4 h-4 ${isSimulatingAudio ? 'animate-spin' : ''}`} />
                      <span>{isSimulatingAudio ? 'Analizando audio...' : 'Simular Muestra Acústica'}</span>
                    </button>
                  </div>

                  {/* Chart Visualizer */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white overflow-hidden relative shadow-inner">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 text-[11px] text-slate-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          <span>Zona Normal (400 - 550 Hz)</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                          <span>Umbral Llanto Álgico (&gt;600 Hz)</span>
                        </span>
                      </div>
                      <span className="font-mono text-indigo-300">
                        F0 Seleccionada: <strong className="text-white">{selectedPoint.f0} Hz</strong> ({selectedPoint.cause})
                      </span>
                    </div>

                    <div className="w-full overflow-x-auto">
                      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full min-w-[500px] h-48 sm:h-56">
                        <defs>
                          <linearGradient id="cryAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Normal physiologic band (400 - 550 Hz) */}
                        <rect
                          x={padL}
                          y={yNormalTop}
                          width={plotW}
                          height={normalBandHeight}
                          fill="rgba(16, 185, 129, 0.12)"
                        />
                        <text
                          x={padL + 6}
                          y={yNormalTop + 14}
                          fill="#34D399"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          Rango Fisiológico Normal Lactante (400 - 550 Hz)
                        </text>

                        {/* Emergency threshold line (600 Hz) */}
                        <line
                          x1={padL}
                          y1={yEmergency}
                          x2={padL + plotW}
                          y2={yEmergency}
                          stroke="#F43F5E"
                          strokeWidth="1.5"
                          strokeDasharray="4 3"
                        />
                        <text
                          x={padL + plotW - 140}
                          y={yEmergency - 4}
                          fill="#FB7185"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          Límite Dolor Álgico (600 Hz)
                        </text>

                        {/* Horizontal Grid lines */}
                        {[300, 400, 500, 600, 700].map((val) => (
                          <g key={val}>
                            <line
                              x1={padL}
                              y1={getY(val)}
                              x2={padL + plotW}
                              y2={getY(val)}
                              stroke="rgba(255, 255, 255, 0.1)"
                              strokeWidth="1"
                            />
                            <text
                              x={padL - 6}
                              y={getY(val) + 3}
                              fill="rgba(255, 255, 255, 0.4)"
                              fontSize="9"
                              textAnchor="end"
                              fontFamily="monospace"
                            >
                              {val}
                            </text>
                          </g>
                        ))}

                        {/* Area and Line */}
                        <path d={areaPath} fill="url(#cryAreaGrad)" />
                        <path d={linePath} fill="none" stroke="#818CF8" strokeWidth="2.5" />

                        {/* Interactive Data Points */}
                        {points.map((pt, i) => {
                          const isSel = selectedBioacousticIndex === i;
                          const isAlert = pt.f0 > 600;
                          return (
                            <g
                              key={pt.id}
                              className="cursor-pointer"
                              onClick={() => setSelectedBioacousticIndex(i)}
                            >
                              {isSel && (
                                <circle
                                  cx={pt.x}
                                  cy={pt.y}
                                  r="10"
                                  fill="none"
                                  stroke={isAlert ? '#F43F5E' : '#818CF8'}
                                  strokeWidth="2"
                                  className="animate-ping"
                                />
                              )}
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r={isSel ? '6' : '4'}
                                fill={isAlert ? '#F43F5E' : isSel ? '#FBBF24' : '#6366F1'}
                                stroke="#ffffff"
                                strokeWidth="1.5"
                              />
                              <text
                                x={pt.x}
                                y={padT + plotH + 16}
                                fill={isSel ? '#FBBF24' : 'rgba(255, 255, 255, 0.5)'}
                                fontSize="8"
                                textAnchor="middle"
                                fontFamily="monospace"
                                fontWeight={isSel ? 'bold' : 'normal'}
                              >
                                {pt.time}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>

                  {/* Didactic Clinical Card for Selected Point */}
                  <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-200/60 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            selectedPoint.severity === 'emergency'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : selectedPoint.severity === 'moderate'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}
                        >
                          {selectedPoint.severity === 'emergency'
                            ? 'Alerta Clínica: Llanto Álgico'
                            : selectedPoint.severity === 'moderate'
                            ? 'Malestar Fisiológico Moderado'
                            : 'Llanto Funcional / Normal'}
                        </span>
                        <h4 className="font-rounded font-bold text-sm text-indigo-950">
                          {selectedPoint.time} hrs — {selectedPoint.cause} ({selectedPoint.f0} Hz)
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-indigo-900 font-bold">
                        Intensidad: {selectedPoint.decibels}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 leading-relaxed">
                      <strong className="text-indigo-950 font-bold">Lectura Bioacústica: </strong>
                      <span>{selectedPoint.notes}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-indigo-200 text-xs text-slate-700 flex items-start gap-2">
                      <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-indigo-950 font-bold">Consejo de Calma Didáctico (Regla de las 5 S del Dr. Karp): </strong>
                        <span>
                          {selectedPoint.f0 > 600
                            ? 'Descartar primero causas físicas agudas: revisar cuerpo del bebé, dedos por síndrome del torniquete del cabello, fiebre y rigidez abdominal antes de maniobras de calma.'
                            : 'Envolver al bebé con brazos recogidos (Swaddle), posición de lado/estómago en brazos del cuidador (Side/Stomach), sonido blanco continuo (Shush), balanceo suave y rítmico (Swing) y ofrecer succión nutritiva o chupete (Suck).'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ========================================================= */}
            {/* GRÁFICA 3: MAPA CRONOBIOLÓGICO 24/7 (HEATMAP INTERACTIVO)  */}
            {/* ========================================================= */}
            {(didacticFilter === 'all' || didacticFilter === 'heatmap') && (() => {
              const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
              const slots = [
                { key: 'madrugada', label: 'Madrugada', hours: '00:00 - 06:00', icon: Moon },
                { key: 'manana', label: 'Mañana', hours: '06:00 - 12:00', icon: Sun },
                { key: 'tarde', label: 'Tarde', hours: '12:00 - 18:00', icon: Sun },
                { key: 'noche', label: 'Noche', hours: '18:00 - 24:00', icon: Moon },
              ];

              const matrix: Record<string, Record<string, { value: number; explanation: string }>> = {
                'Lunes': {
                  madrugada: { value: 34, explanation: 'Consultas por picos de fiebre posfin de semana y dudas de dosificación nocturna de jarabes.' },
                  manana: { value: 62, explanation: 'Inicio de semana laboral: evaluación de síntomas respiratorios y dudas para guardería.' },
                  tarde: { value: 45, explanation: 'Preguntas sobre pauta de alimentación complementaria y calendario de vacunas.' },
                  noche: { value: 58, explanation: 'Pico de cólicos nocturnos, reflujo y dificultad de inducción al sueño.' }
                },
                'Martes': {
                  madrugada: { value: 28, explanation: 'Fiebre persistente en lactantes menores de 6 meses.' },
                  manana: { value: 48, explanation: 'Triajes cutáneos de dermatitis del pañal y erupciones benignas.' },
                  tarde: { value: 42, explanation: 'Dudas sobre dentición primaria y rechazo de cuchara.' },
                  noche: { value: 51, explanation: 'Tos nocturna espasmódica y congestión nasal.' }
                },
                'Miércoles': {
                  madrugada: { value: 68, explanation: 'Pico semanal de 68 alertas febriles. Entre 02:00 y 05:00 ocurre el valle natural de cortisol circadiano en lactantes, intensificando los episodios febriles y la ansiedad familiar.' },
                  manana: { value: 52, explanation: 'Revisión de eritemas y evolución tras antitérmico administrado en la madrugada.' },
                  tarde: { value: 40, explanation: 'Consultas sobre hitos psicomotores y curvas de peso/talla.' },
                  noche: { value: 60, explanation: 'Episodios de llanto inconsolable y gases vespertinos.' }
                },
                'Jueves': {
                  madrugada: { value: 31, explanation: 'Alertas de dificultad respiratoria leve y ruidos catarrales.' },
                  manana: { value: 46, explanation: 'Evaluación fotográfica de erupciones virales exantemáticas.' },
                  tarde: { value: 39, explanation: 'Dudas sobre hidratación oral tras deposiciones blandas.' },
                  noche: { value: 54, explanation: 'Dificultad para conciliar el sueño y despertares múltiples.' }
                },
                'Viernes': {
                  madrugada: { value: 42, explanation: 'Consultas de última hora antes del fin de semana sobre fiebre en bebés.' },
                  manana: { value: 59, explanation: 'Preparación de botiquín de viaje y pautas de fotoprotección.' },
                  tarde: { value: 65, explanation: 'Pico vespertino: familias consultando síntomas antes del cierre de centros de salud.' },
                  noche: { value: 72, explanation: 'Urgencias leves: golpes accidentales por juegos y llanto tras caídas.' }
                },
                'Sábado': {
                  madrugada: { value: 55, explanation: 'Fiebres repentinas durante la noche sin pediatra habitual disponible.' },
                  manana: { value: 64, explanation: 'Triajes dermatológicos por picaduras o alergias alimentarias tras comidas nuevas.' },
                  tarde: { value: 58, explanation: 'Dudas sobre contusiones leves y raspaduras en parques.' },
                  noche: { value: 76, explanation: 'Pico máximo de fin de semana (76 consultas): dudas sobre dosis de antitérmicos y si acudir al hospital.' }
                },
                'Domingo': {
                  madrugada: { value: 61, explanation: 'Tos persistente nocturna y congestión que interrumpe el descanso.' },
                  manana: { value: 56, explanation: 'Consultas de tranquilidad antes de la reapertura de escuelas y guarderías.' },
                  tarde: { value: 50, explanation: 'Revisión de eritemas solares y pañales húmedos tras salidas al aire libre.' },
                  noche: { value: 70, explanation: 'Preparación de la semana escolar y consultas de rutinas de sueño.' }
                }
              };

              const getCellColor = (val: number) => {
                if (val >= 70) return 'bg-amber-600 text-white font-extrabold shadow-xs';
                if (val >= 55) return 'bg-amber-400 text-amber-950 font-bold';
                if (val >= 40) return 'bg-amber-200 text-amber-900 font-semibold';
                return 'bg-amber-100/70 text-amber-800';
              };

              return (
                <div className="p-6 rounded-3xl bg-white border border-amber-200 shadow-2xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-rounded font-bold text-base sm:text-lg text-amber-950">
                          Mapa Cronobiológico de Consultas 24/7 (Heatmap Didáctico)
                        </h3>
                        <p className="text-xs text-slate-500">
                          Patrón circadiano pediátrico: descubre cuándo y por qué ocurren las mayores alertas médicas en el hogar.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Heatmap Grid */}
                  <div className="overflow-x-auto pb-2">
                    <div className="min-w-[620px] space-y-2">
                      {/* Column Headers */}
                      <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold text-slate-600 pb-1">
                        <div className="text-left pl-3 text-amber-950 font-extrabold">Día / Franja</div>
                        {slots.map((s) => (
                          <div key={s.key} className="p-2 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-center gap-1.5">
                            <s.icon className="w-3.5 h-3.5 text-amber-800" />
                            <span>{s.label}</span>
                            <span className="text-[10px] text-slate-400 block sm:inline font-normal">({s.hours.split(' ')[0]})</span>
                          </div>
                        ))}
                      </div>

                      {/* Day Rows */}
                      {days.map((day) => (
                        <div key={day} className="grid grid-cols-5 gap-2 items-center">
                          <div className="font-rounded font-bold text-xs text-slate-800 pl-3">
                            {day}
                          </div>
                          {slots.map((s) => {
                            const cell = matrix[day]?.[s.key] || { value: 30, explanation: '' };
                            const isSelected = selectedHeatmapCell?.day === day && selectedHeatmapCell?.slot.includes(s.label);
                            return (
                              <button
                                key={s.key}
                                type="button"
                                onClick={() =>
                                  setSelectedHeatmapCell({
                                    day,
                                    slot: `${s.label} (${s.hours})`,
                                    value: cell.value,
                                    explanation: cell.explanation
                                  })
                                }
                                className={`p-3 rounded-2xl text-xs transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 border ${
                                  isSelected
                                    ? 'ring-2 ring-amber-600 scale-102 border-amber-600 z-10'
                                    : 'border-transparent hover:scale-102'
                                } ${getCellColor(cell.value)}`}
                              >
                                <span className="text-sm font-extrabold">{cell.value}</span>
                                <span className="text-[9px] opacity-80 uppercase tracking-wider">triajes</span>
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Heatmap Legend */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-amber-100 text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-500">Intensidad de Consultas:</span>
                      <span className="px-2 py-0.5 rounded-lg bg-amber-100/70 text-amber-800 text-[10px] font-bold">&lt;40</span>
                      <span className="px-2 py-0.5 rounded-lg bg-amber-200 text-amber-900 text-[10px] font-bold">40-54</span>
                      <span className="px-2 py-0.5 rounded-lg bg-amber-400 text-amber-950 text-[10px] font-bold">55-69</span>
                      <span className="px-2 py-0.5 rounded-lg bg-amber-600 text-white text-[10px] font-bold">&gt;70 (Pico Crítico)</span>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      Haz clic en cualquier celda para leer la causa fisiológica
                    </span>
                  </div>

                  {/* Didactic Heatmap Detail Card */}
                  {selectedHeatmapCell && (
                    <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-300/90 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-2">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4 text-amber-800" />
                          <h4 className="font-rounded font-bold text-sm text-amber-950">
                            {selectedHeatmapCell.day} • {selectedHeatmapCell.slot}
                          </h4>
                        </div>
                        <span className="px-3 py-0.5 rounded-full bg-amber-200 text-amber-950 text-xs font-extrabold">
                          {selectedHeatmapCell.value} consultas registradas
                        </span>
                      </div>
                      <div className="text-xs text-slate-700 leading-relaxed">
                        <strong className="text-amber-950 font-bold">Causa Biológica Pediátrica: </strong>
                        <span>{selectedHeatmapCell.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ========================================================= */}
            {/* GRÁFICA 4: HISTOGRAMA DE TRIAJES CUTÁNEOS POR EDAD        */}
            {/* ========================================================= */}
            {(didacticFilter === 'all' || didacticFilter === 'derma') && (() => {
              const dermaAgeData = [
                {
                  bracket: '0 a 12 meses',
                  name: 'Lactantes',
                  totalScans: 168,
                  mild: 114,
                  moderate: 44,
                  emergency: 10,
                  topCondition: 'Dermatitis del pañal por fricción y eritema tóxico neonatal',
                  recommendation: 'Pasta al agua con óxido de zinc al 25%, pañales transpirables y cambios inmediatos tras cada micción.',
                  redFlag: 'Petequias (manchas rojas o violáceas que no palidecen al presionar con un vaso transparente).'
                },
                {
                  bracket: '1 a 3 años',
                  name: 'Deambuladores',
                  totalScans: 122,
                  mild: 78,
                  moderate: 34,
                  emergency: 10,
                  topCondition: 'Exantema súbito (roséola), dermatitis atópica y picaduras de insecto',
                  recommendation: 'Emolientes sin perfume aplicados sobre piel húmeda tras baño corto con agua tibia y jabón syndet.',
                  redFlag: 'Exantema purpúrico palpable o lesiones con afectación de mucosas orales u oculares.'
                },
                {
                  bracket: '3 a 6 años',
                  name: 'Preescolares',
                  totalScans: 82,
                  mild: 56,
                  moderate: 20,
                  emergency: 6,
                  topCondition: 'Impétigo contagioso (costras melicéricas), varicela y molluscum contagiosum',
                  recommendation: 'Higiene rigurosa de manos, uñas recortadas y pomada antibiótica tópica en impétigo leve bajo supervisión.',
                  redFlag: 'Lesiones ampollosas extensas o placas con calor intenso y enrojecimiento en rápida expansión.'
                },
                {
                  bracket: '6 a 10 años',
                  name: 'Escolares',
                  totalScans: 40,
                  mild: 29,
                  moderate: 9,
                  emergency: 2,
                  topCondition: 'Pitiriasis alba (manchas solares blanquecinas), urticaria de contacto y tiña',
                  recommendation: 'Fotoprotección pediátrica FPS 50+ de amplio espectro e hidratación profunda con ceramidas.',
                  redFlag: 'Urticaria generalizada acompañada de edema de labios/párpados o estridor inspiratorio (alerta de anafilaxia).'
                }
              ];

              const currentAge = dermaAgeData[selectedDermaAgeIndex] || dermaAgeData[0];

              return (
                <div className="p-6 rounded-3xl bg-white border border-amber-200 shadow-2xs space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-pink-100 text-pink-900">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-rounded font-bold text-base sm:text-lg text-amber-950">
                          Triajes Dermatológicos Gemini Visión por Rango de Edad
                        </h3>
                        <p className="text-xs text-slate-500">
                          Histograma interactivo con desglose de severidad: Leve (domiciliario), Moderado y Derivación Urgente.
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-900 text-xs font-bold self-start sm:self-auto">
                      412 Escaneos de Piel AAP
                    </span>
                  </div>

                  {/* Age Brackets Comparison Bars */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {dermaAgeData.map((d, idx) => {
                      const isSel = selectedDermaAgeIndex === idx;
                      const mildPct = Math.round((d.mild / d.totalScans) * 100);
                      const modPct = Math.round((d.moderate / d.totalScans) * 100);
                      const emergPct = Math.round((d.emergency / d.totalScans) * 100);

                      return (
                        <div
                          key={d.bracket}
                          onClick={() => setSelectedDermaAgeIndex(idx)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                            isSel
                              ? 'bg-pink-50/70 border-pink-400 ring-2 ring-pink-300 shadow-2xs'
                              : 'bg-slate-50/70 hover:bg-pink-50/30 border-slate-200'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="font-rounded font-bold text-sm text-amber-950">
                                {d.name}
                              </h4>
                              <span className="text-[11px] font-mono font-bold text-slate-500">
                                {d.bracket}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 font-semibold">
                              {d.totalScans} triajes realizados
                            </p>
                          </div>

                          {/* Stacked Bar */}
                          <div className="space-y-1.5">
                            <div className="h-3.5 rounded-full overflow-hidden flex bg-slate-200">
                              <div
                                style={{ width: `${mildPct}%` }}
                                className="bg-emerald-500 hover:opacity-90 transition-all"
                                title={`Leve: ${d.mild} (${mildPct}%)`}
                              />
                              <div
                                style={{ width: `${modPct}%` }}
                                className="bg-amber-400 hover:opacity-90 transition-all"
                                title={`Moderado: ${d.moderate} (${modPct}%)`}
                              />
                              <div
                                style={{ width: `${emergPct}%` }}
                                className="bg-rose-500 hover:opacity-90 transition-all"
                                title={`Urgente: ${d.emergency} (${emergPct}%)`}
                              />
                            </div>

                            <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                              <span className="text-emerald-700">{mildPct}% Leve</span>
                              <span className="text-amber-700">{modPct}% Mod</span>
                              <span className="text-rose-700">{emergPct}% Urg</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Didactic Clinical Card for Selected Age Bracket */}
                  <div className="p-5 rounded-2xl bg-pink-50/60 border border-pink-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-200/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-pink-500" />
                        <h4 className="font-rounded font-bold text-sm text-pink-950">
                          {currentAge.name} ({currentAge.bracket}) — Patología Más Frecuente
                        </h4>
                      </div>
                      <span className="text-xs font-bold text-pink-900">
                        Total {currentAge.totalScans} casos analizados por Visión
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 leading-relaxed">
                      <strong className="text-pink-950 font-bold">Diagnóstico Prevalente: </strong>
                      <span>{currentAge.topCondition}. </span>
                      <strong className="text-pink-950 font-bold">Pauta de Manejo: </strong>
                      <span>{currentAge.recommendation}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2.5 text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Bandera Roja Dermatológica (Acudir a Urgencias): </strong>
                        <span>{currentAge.redFlag}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ========================================================= */}
            {/* TARJETAS DIDÁCTICAS: ALGORITMOS CLÍNICOS PEDIÁTRICOS      */}
            {/* ========================================================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-amber-950 font-rounded font-bold text-sm">
                  <div className="p-1.5 rounded-xl bg-amber-200 text-amber-900">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <span>Triángulo de Evaluación Pediátrica (TEP)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Herramienta de triaje visual rápida en menos de 30 segundos sin tocar al paciente:
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs font-bold">
                  <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-amber-950">
                    <p className="text-[11px] text-amber-800">1. Apariencia</p>
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">Tono, reactividad y mirada</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-amber-950">
                    <p className="text-[11px] text-amber-800">2. Respiración</p>
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">Tiraje, aleteo y ruidos</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-amber-200 text-amber-950">
                    <p className="text-[11px] text-amber-800">3. Circulación</p>
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">Palidez, livedo o cianosis</p>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-indigo-50/60 border border-indigo-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-indigo-950 font-rounded font-bold text-sm">
                  <div className="p-1.5 rounded-xl bg-indigo-200 text-indigo-900">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>Escudo Antitérmico & Dosificación Segura (AAP)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cálculo automático de dosis pediátricas por kilogramo de peso corporal exacto:
                </p>
                <div className="space-y-1.5 text-xs text-slate-700 pt-1">
                  <div className="flex justify-between p-2 rounded-xl bg-white border border-indigo-100">
                    <span className="font-bold text-indigo-950">Paracetamol:</span>
                    <span>15 mg/kg por toma (cada 6 horas, máx 60 mg/kg/día)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-xl bg-white border border-indigo-100">
                    <span className="font-bold text-indigo-950">Ibuprofeno:</span>
                    <span>10 mg/kg por toma (cada 8 horas, solo en &gt;6 meses)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. SECCIÓN: AUDITORÍA & LOGS DE SEGURIDAD                 */}
        {/* ========================================================= */}
        {activeSection === 'audit' && (
          <div className="p-6 rounded-3xl bg-white border border-amber-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-rounded font-bold text-base text-amber-950">
                  Registro Inmutable de Auditoría Médica
                </h3>
                <p className="text-xs text-slate-500">
                  Trazabilidad de accesos clínicos, triajes ejecutados y alertas de emergencia médica.
                </p>
              </div>
            </div>

            <div className="divide-y divide-amber-100/80 border border-amber-100 rounded-2xl overflow-hidden">
              {[
                { id: 'log-1', time: 'Hace 3 minutos', action: 'Triaje de Piel ejecutado', user: 'valecruz20008@gmail.com', status: 'success', flag: 'Dermatitis del Pañal (Leve)' },
                { id: 'log-2', time: 'Hace 11 minutos', action: 'Consulta: Fiebre 38.5°C lactante', user: 'camila.santos@gmail.com', status: 'alert', flag: 'Escudo AAP activado: cálculo dosis paracetamol' },
                { id: 'log-3', time: 'Hace 24 minutos', action: 'Acceso a Panel de Administración', user: 'admin@amigosunidos.com', status: 'info', flag: 'Auditoría clínica iniciada' },
                { id: 'log-4', time: 'Hace 45 minutos', action: 'Análisis Bioacústico de Llanto', user: 'valecruz20008@gmail.com', status: 'success', flag: 'Hambre / Reflejo F0=438Hz' },
                { id: 'log-5', time: 'Hace 1 hora', action: 'Nuevo usuario registrado', user: 'diego.morales@gmail.com', status: 'info', flag: 'PBKDF2 SHA-512 hasheado' }
              ].map((log) => (
                <div key={log.id} className="p-4 hover:bg-amber-50/30 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        log.status === 'alert'
                          ? 'bg-rose-500'
                          : log.status === 'success'
                          ? 'bg-emerald-500'
                          : 'bg-indigo-500'
                      }`}
                    />
                    <div>
                      <p className="font-bold text-amber-950">{log.action}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{log.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-semibold text-slate-700">{log.flag}</p>
                    <p className="text-[10px] text-slate-400">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODALES CRUD DE USUARIOS (CREATE / UPDATE)                */}
      {/* ========================================================= */}
      {isCreateUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsCreateUserModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-amber-200 shadow-2xl p-6 space-y-4 z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <h3 className="font-rounded font-bold text-base text-amber-950">+ Crear Nuevo Usuario</h3>
              <button onClick={() => setIsCreateUserModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre completo</label>
                <input
                  type="text"
                  required
                  value={userFormName}
                  onChange={(e) => setUserFormName(e.target.value)}
                  placeholder="Ej: Dra. Sofía Ramírez"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-amber-50/20 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Correo electrónico</label>
                <input
                  type="email"
                  required
                  value={userFormEmail}
                  onChange={(e) => setUserFormEmail(e.target.value)}
                  placeholder="sofia@amigosunidos.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-amber-50/20 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-bold text-slate-700">Contraseña</label>
                  <span className="text-[10px] text-amber-800 font-mono">PBKDF2/SHA-512</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={userFormPassword}
                    onChange={(e) => setUserFormPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 pr-9 rounded-xl border border-slate-300 bg-amber-50/20 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rol en el sistema</label>
                <select
                  value={userFormRole}
                  onChange={(e) => setUserFormRole(e.target.value as PlatformRole)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 cursor-pointer"
                >
                  <option value="user">Usuario (Familia / Portal)</option>
                  <option value="admin">Administrador (Backoffice Clínico)</option>
                  <option value="developer">Desarrollador (God Mode)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 font-bold text-amber-950 cursor-pointer shadow-xs"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit User */}
      {isEditUserModalOpen && selectedUserForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setIsEditUserModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl border border-amber-200 shadow-2xl p-6 space-y-4 z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <div>
                <h3 className="font-rounded font-bold text-base text-amber-950">Editar Usuario</h3>
                <p className="text-[11px] text-slate-500 font-mono">{selectedUserForEdit.email}</p>
              </div>
              <button onClick={() => setIsEditUserModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={userFormName}
                  onChange={(e) => setUserFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-amber-50/20 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rol asignado</label>
                <select
                  value={userFormRole}
                  onChange={(e) => setUserFormRole(e.target.value as PlatformRole)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 cursor-pointer"
                >
                  <option value="user">Usuario (Familia / Portal)</option>
                  <option value="admin">Administrador (Backoffice)</option>
                  <option value="developer">Desarrollador (God Mode)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="font-bold text-slate-700">Rehashear Contraseña (Opcional)</label>
                  <span className="text-[10px] text-amber-800 font-mono">Dejar vacío si no cambia</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={userFormPassword}
                    onChange={(e) => setUserFormPassword(e.target.value)}
                    placeholder="Escribe nueva clave si deseas cambiarla..."
                    className="w-full px-3 py-2 pr-9 rounded-xl border border-slate-300 bg-amber-50/20 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 font-bold text-amber-950 cursor-pointer shadow-xs"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALES CRUD DE PROTOCOLOS (CREATE / UPDATE)             */}
      {/* ========================================================= */}
      {(isCreateProtocolModalOpen || isEditProtocolModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => {
              setIsCreateProtocolModalOpen(false);
              setIsEditProtocolModalOpen(false);
            }}
          />
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-amber-200 shadow-2xl p-6 space-y-4 z-10 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-amber-100 pb-3">
              <h3 className="font-rounded font-bold text-base text-amber-950">
                {isCreateProtocolModalOpen ? '+ Nuevo Protocolo Clínico' : 'Editar Protocolo Clínico'}
              </h3>
              <button
                onClick={() => {
                  setIsCreateProtocolModalOpen(false);
                  setIsEditProtocolModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={isCreateProtocolModalOpen ? handleCreateProtocolSubmit : handleEditProtocolSubmit}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título del Protocolo / Patología</label>
                <input
                  type="text"
                  required
                  value={protFormTitle}
                  onChange={(e) => setProtFormTitle(e.target.value)}
                  placeholder="Ej: Manejo de Fiebre y Antitérmicos según Peso"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-amber-50/20 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={protFormCategory}
                    onChange={(e) => setProtFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 cursor-pointer"
                  >
                    <option value="fiebre">Fiebre & Antitérmicos</option>
                    <option value="respiratorio">Dificultad Respiratoria</option>
                    <option value="dermatologia">Dermatología Infantil</option>
                    <option value="digestivo">Digestivo & Deshidratación</option>
                    <option value="nutricion">Nutrición & BLW</option>
                    <option value="urgencias">Emergencias Críticas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nivel de Gravedad / Riesgo</label>
                  <select
                    value={protFormSeverity}
                    onChange={(e) => setProtFormSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-800 cursor-pointer"
                  >
                    <option value="normal">Normal / Preventivo</option>
                    <option value="moderate">Alerta Moderada (Precaución)</option>
                    <option value="emergency">Urgencia Inmediata (Bandera Roja)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rango de Edad Aplicable</label>
                <input
                  type="text"
                  value={protFormTargetAge}
                  onChange={(e) => setProtFormTargetAge(e.target.value)}
                  placeholder="Ej: 0 a 10 años, o 0 a 6 meses"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-amber-50/20 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pautas e Indicaciones Clínicas</label>
                <textarea
                  required
                  rows={3}
                  value={protFormGuidelines}
                  onChange={(e) => setProtFormGuidelines(e.target.value)}
                  placeholder="Dosificación por kg de peso, medidas físicas, reposo e hidratación..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-amber-50/20 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-rose-700 mb-1">Signos de Alarma / Banderas Rojas</label>
                <textarea
                  rows={2}
                  value={protFormRedFlags}
                  onChange={(e) => setProtFormRedFlags(e.target.value)}
                  placeholder="Fiebre persistente >38°C en <3m, quejido, petequias..."
                  className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/30 text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Fuente Oficial Acreditada</label>
                <input
                  type="text"
                  value={protFormSource}
                  onChange={(e) => setProtFormSource(e.target.value)}
                  placeholder="Ej: American Academy of Pediatrics (AAP) - Febrile Infant Guidelines"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-amber-50/20 text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-amber-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateProtocolModalOpen(false);
                    setIsEditProtocolModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 font-bold text-amber-950 cursor-pointer shadow-xs"
                >
                  {isCreateProtocolModalOpen ? 'Crear Protocolo' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CONFIRMACIÓN DE BORRADO (DELETE)                         */}
      {/* ========================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl border border-rose-200 shadow-2xl p-6 space-y-4 z-10 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-rounded font-bold text-base text-slate-900">¿Confirmas la eliminación?</h3>
              <p className="text-xs text-slate-600 mt-1">
                Estás a punto de eliminar el {deleteTarget.type === 'user' ? 'usuario' : 'protocolo'}:{' '}
                <strong className="text-rose-700">{deleteTarget.label}</strong>. Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
