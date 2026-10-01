import React, { useState } from 'react';
import { useFamily } from '../context/FamilyContext';
import { useTheme } from '../context/ThemeContext';
import { FroggiAvatar } from './MascotSVGs';
import { PlatformRole } from '../types';
import { AnimatedRainbowCloud } from './AnimatedRainbowCloud';
import {
  Stethoscope,
  Sparkles,
  Baby,
  Activity,
  Lock,
  ArrowRight,
  UserCheck,
  Server,
  Code2,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  Cpu,
  Database,
  BarChart3,
  ChevronRight,
  Menu,
  X,
  User,
  ShieldCheck,
  HeartHandshake,
  FileCheck2,
  HelpCircle,
  Clock,
  Check,
  Shield,
  BookOpen,
  Home
} from 'lucide-react';

interface LandingHomeProps {
  onNavigateToRoleView?: (role: PlatformRole) => void;
}

export const LandingHome: React.FC<LandingHomeProps> = ({ onNavigateToRoleView }) => {
  const { login, register, loginWithGoogle } = useFamily();
  const { currentTheme } = useTheme();

  // Navigation and Modal states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'register' | 'login'>('register');
  const [showDemoAccordion, setShowDemoAccordion] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [parentRole, setParentRole] = useState<'mamá' | 'papá' | 'tutor' | 'familiar'>('mamá');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Open auth modal with a specific tab
  const handleOpenAuth = (tab: 'register' | 'login') => {
    setAuthTab(tab);
    setErrorMessage('');
    setSuccessMessage('');
    setIsAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  // Google 1-Click Authentication
  const handleGoogleAuth = async (targetRole: PlatformRole = 'user') => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const gEmail = 'valecruz20008@gmail.com';
      const gName = 'Valentina Cruz';
      const gAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

      const res = await loginWithGoogle(gEmail, gName, gAvatar, targetRole);
      if (res.success) {
        setIsAuthModalOpen(false);
        if (onNavigateToRoleView) {
          onNavigateToRoleView(targetRole);
        }
      } else {
        setErrorMessage(res.message || 'Error al autenticar con Google.');
      }
    } catch (e: any) {
      setErrorMessage('Error al conectar con el servicio de autenticación.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick login for demo / evaluation accounts
  const handleDemoLogin = async (demoEmail: string, demoPass: string, role: PlatformRole) => {
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await login(demoEmail, demoPass);
      if (res.success) {
        setIsAuthModalOpen(false);
        if (onNavigateToRoleView) {
          onNavigateToRoleView(role);
        }
      } else {
        setErrorMessage(res.message || 'Error al acceder a la cuenta de prueba.');
      }
    } catch (e: any) {
      setErrorMessage(e?.message || 'Error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  // Standard Form Submit (Login or Register)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (authTab === 'login') {
        const res = await login(email, password);
        if (res.success) {
          setSuccessMessage('Inicio de sesión exitoso.');
          const target = res.user?.systemRole || 'user';
          setTimeout(() => {
            setIsAuthModalOpen(false);
            if (onNavigateToRoleView) {
              onNavigateToRoleView(target);
            }
          }, 350);
        } else {
          setErrorMessage(res.message || 'Credenciales inválidas. Verifica tu correo y contraseña.');
        }
      } else {
        // Register new parent user
        const res = await register(name, email, password, parentRole, undefined, 'user');
        if (res.success) {
          setSuccessMessage('¡Cuenta creada exitosamente! Ingresando al portal pediátrico...');
          setTimeout(() => {
            setIsAuthModalOpen(false);
            if (onNavigateToRoleView) {
              onNavigateToRoleView('user');
            }
          }, 450);
        } else {
          setErrorMessage(res.message || 'Error al registrar la cuenta.');
        }
      }
    } catch (err: any) {
      setErrorMessage('Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${currentTheme.pageBg} ${currentTheme.id === 'dark' ? 'text-slate-100' : 'text-slate-950'} transition-colors duration-200 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950`}>
      {/* ---------------------------------------------------- */}
      {/* TOP CLEAN NAVBAR: SOLO 3 RAYITAS Y LOGO              */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left: Botón de las 3 rayitas (Menu) */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all cursor-pointer shadow-2xs flex items-center justify-center group"
            aria-label="Abrir menú de 3 rayitas"
            title="Menú"
          >
            <Menu className="w-6 h-6 text-amber-900 group-hover:scale-105 transition-transform" />
          </button>

          {/* Center: Logo Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center p-1 shadow-2xs">
              <FroggiAvatar size="sm" expression="happy" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-rounded font-bold text-lg sm:text-xl tracking-tight text-amber-950">
                  Amigos Unidos
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-[10px] font-bold text-amber-900 hidden sm:inline">
                  Salud Pediátrica
                </span>
              </div>
            </div>
          </div>

          <a
            href="/"
            className="w-11 h-11 inline-flex items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-900 transition-colors hover:bg-amber-100"
            aria-label="Volver al inicio de Amigos Unidos"
            title="Volver al inicio"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      </header>

      {/* ---------------------------------------------------- */}
      {/* DRAWER DE OPCIONES (DENTRO DE LAS 3 RAYITAS)         */}
      {/* ---------------------------------------------------- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="relative w-full max-w-sm bg-white border-r border-amber-200 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-amber-100 bg-[#FFFDF5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center p-1">
                  <FroggiAvatar size="sm" expression="happy" />
                </div>
                <div>
                  <h3 className="font-rounded font-bold text-base text-amber-950">Amigos Unidos</h3>
                  <p className="text-[11px] text-slate-500">Salud Pediátrica con Froggi</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all cursor-pointer"
                title="Cerrar opciones"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content: ALL OPTIONS */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-[#FFFDF9]">
              {/* Opciones de Entrada: Empieza aquí + Iniciar sesión */}
              <div className="space-y-2.5">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 px-1">
                  Acceso a la Plataforma
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleOpenAuth('register');
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-rounded font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 border border-amber-500/50"
                >
                  <Sparkles className="w-4 h-4 text-amber-900" />
                  <span>Empieza aquí (Registro Gratis)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleOpenAuth('login');
                  }}
                  className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-amber-50 border border-amber-200 text-amber-950 text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-amber-800" />
                  <span>Iniciar sesión</span>
                </button>
              </div>

              {/* Opciones de Navegación: Módulos Clínicos */}
              <div className="space-y-1.5 text-xs font-semibold text-slate-700 pt-2 border-t border-amber-100">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 px-1">
                  Módulos y Servicios
                </p>

                <a
                  href="#modulos"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-3 rounded-2xl hover:bg-amber-50 flex items-center gap-3 text-slate-800 transition-colors border border-transparent hover:border-amber-200/60"
                >
                  <Baby className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <p className="font-bold text-amber-950">Asistente Pediátrico Froggi</p>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Consultas clínicas y dosis de antitérmicos
                    </p>
                  </div>
                </a>

                <a
                  href="#modulos"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-3 rounded-2xl hover:bg-amber-50 flex items-center gap-3 text-slate-800 transition-colors border border-transparent hover:border-amber-200/60"
                >
                  <Activity className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <p className="font-bold text-amber-950">Bioacústica del Llanto</p>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Detección de Frecuencia Fundamental F0
                    </p>
                  </div>
                </a>

                <a
                  href="#modulos"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-3 rounded-2xl hover:bg-amber-50 flex items-center gap-3 text-slate-800 transition-colors border border-transparent hover:border-amber-200/60"
                >
                  <Stethoscope className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <p className="font-bold text-amber-950">Triaje de Piel AAP</p>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Evaluación fotográfica de afecciones cutáneas
                    </p>
                  </div>
                </a>
              </div>

              {/* Opciones Informativas */}
              <div className="space-y-1.5 text-xs font-semibold text-slate-700 pt-2 border-t border-amber-100">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 px-1">
                  Información Institucional
                </p>

                <a
                  href="#guias"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-3 rounded-2xl hover:bg-amber-50 flex items-center gap-3 text-slate-800 transition-colors border border-transparent hover:border-amber-200/60"
                >
                  <BookOpen className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <p className="font-bold text-amber-950">Guías OMS & AAP</p>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Lineamientos pediátricos internacionales
                    </p>
                  </div>
                </a>

                <a
                  href="#seguridad"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-3 rounded-2xl hover:bg-amber-50 flex items-center gap-3 text-slate-800 transition-colors border border-transparent hover:border-amber-200/60"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <p className="font-bold text-amber-950">Seguridad & Privacidad</p>
                    <p className="text-[11px] text-slate-500 font-normal">
                      Cifrado PBKDF2/SHA-512 sin coste
                    </p>
                  </div>
                </a>
              </div>

              {/* Opciones de Acceso Rápido a Perfiles */}
              <div className="space-y-2 pt-2 border-t border-amber-100">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 px-1">
                  Acceso Rápido (Perfiles Demo)
                </p>

                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleDemoLogin('valecruz20008@gmail.com', 'usuario123', 'user');
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200/70 text-slate-800 text-xs transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-amber-950">👨‍👩‍👧 Familia (Usuario)</p>
                      <p className="text-[10px] text-slate-500 font-mono">valecruz20008@gmail.com</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleDemoLogin('admin@amigosunidos.com', 'admin123', 'admin');
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200/70 text-slate-800 text-xs transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-amber-950">🩺 Administrador Clínico</p>
                      <p className="text-[10px] text-slate-500 font-mono">admin@amigosunidos.com</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleDemoLogin('dev@amigosunidos.ai', 'dev123', 'developer');
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200/70 text-slate-800 text-xs transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-amber-950">💻 Desarrollador (God Mode)</p>
                      <p className="text-[10px] text-slate-500 font-mono">dev@amigosunidos.ai</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3.5 border-t border-amber-100 bg-[#FFFDF5] text-center text-xs text-amber-900">
              <p className="font-rounded font-semibold text-[11px]">Amigos Unidos • Salud Pediátrica</p>
              <p className="text-[10px] text-slate-500">OMS • AAP • UNICEF</p>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* HERO SECTION ELEGANTE, MINIMALISTA Y PROFESIONAL     */}
      {/* ---------------------------------------------------- */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Arcoíris animado cruzando con una nube al inicio de la web */}
        <AnimatedRainbowCloud />

        {/* Subtle decorative glow circles */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/2 right-10 w-72 h-72 bg-amber-100/40 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Refined Clinical Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Sistema Pediátrico Inteligente & Seguro • Basado en Evidencia OMS / AAP</span>
          </div>

          {/* Main Title con letras oscuras de alto contraste */}
          <h1 className="font-rounded text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-amber-950 leading-[1.15]">
            Cuidado pediátrico confiable, al alcance de tu familia.
          </h1>

          {/* High-Impact Subtitle con letras oscuras legibles */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-800 font-medium leading-relaxed max-w-2xl mx-auto">
            Acompañamiento médico integral con <strong className="text-amber-950 font-extrabold">Froggi</strong>. Triaje dermatológico con visión por IA, análisis acústico de llanto infantil y respuestas clínicas al instante, con total privacidad.
          </p>

          {/* Primary Action Button: Abre DIRECTAMENTE la ventana flotante de registro (sin abrir la barra lateral) */}
          <div className="flex items-center justify-center pt-4">
            <button
              type="button"
              onClick={() => handleOpenAuth('register')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-98 text-amber-950 font-rounded font-extrabold text-base sm:text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-amber-500/60 group"
            >
              <Sparkles className="w-5 h-5 text-amber-950 group-hover:scale-110 transition-transform" />
              <span>Empezar (Registro Gratis)</span>
              <ArrowRight className="w-5 h-5 text-amber-950 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trust points con letras oscuras */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto text-[11px] sm:text-xs font-bold text-slate-900">
            <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-white/90 border border-amber-300/80 shadow-2xs">
              <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 font-bold" />
              <span>100% Gratuito y Libre</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-white/90 border border-amber-300/80 shadow-2xs">
              <Shield className="w-3.5 h-3.5 text-amber-800 shrink-0 font-bold" />
              <span>Cifrado PBKDF2/SHA-512</span>
            </div>
            <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-1.5 p-2 rounded-xl bg-white/90 border border-amber-300/80 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-indigo-700 shrink-0 font-bold" />
              <span>Atención Inmediata 24/7</span>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* 3 MÓDULOS CLÍNICOS DESTACADOS (LETRAS OSCURAS)       */}
        {/* ---------------------------------------------------- */}
        <div id="modulos" className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Feature 1: Asistente Froggi */}
          <div className="p-6 rounded-3xl bg-white border border-amber-200/90 shadow-2xs hover:shadow-sm transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-rounded font-bold text-lg text-amber-950">Pediatría Asistida con Froggi</h3>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              Consultas en lenguaje claro y empático. Respuestas calibradas sobre fiebre, dosificación de paracetamol o ibuprofeno según el peso exacto del lactante, y pautas de alimentación.
            </p>
            <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-amber-900">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini 3.1 Flash Lite (<span className="text-emerald-800 font-mono font-bold">410 ms</span>)</span>
            </div>
          </div>

          {/* Feature 2: Bioacústica */}
          <div className="p-6 rounded-3xl bg-white border border-amber-200/90 shadow-2xs hover:shadow-sm transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-rounded font-bold text-lg text-amber-950">Bioacústica del Llanto Infantil</h3>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              Procesamiento de señal en tiempo real. Análisis de la Frecuencia Fundamental F0 (300-800 Hz) y envolvente acústica para orientar entre hambre, dolor o cólico del lactante.
            </p>
            <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-amber-900">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 font-bold" />
              <span>Motor DSP Acústico en el navegador</span>
            </div>
          </div>

          {/* Feature 3: Triaje de Piel */}
          <div className="p-6 rounded-3xl bg-white border border-amber-200/90 shadow-2xs hover:shadow-sm transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800">
              <Stethoscope className="w-6 h-6" />
            </div>
            <h3 className="font-rounded font-bold text-lg text-amber-950">Triaje Dermatológico AAP</h3>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              Visión computacional multimodal para clasificar eritemas comunes de la infancia: dermatitis del pañal, sudamina, eccema o alertas de emergencia médica como petequias.
            </p>
            <div className="pt-2 flex items-center gap-1 text-[11px] font-bold text-amber-900">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 font-bold" />
              <span>Gemini 3.6 Flash Multimodal</span>
            </div>
          </div>
        </div>

        {/* Clinical Evidence Banner */}
        <div id="guias" className="mt-10 p-6 rounded-3xl bg-amber-50/80 border border-amber-200/80 text-center space-y-2">
          <p className="text-xs font-bold text-amber-950 uppercase tracking-wider">
            Validación y Rigor Clínico
          </p>
          <p className="text-xs sm:text-sm text-slate-900 font-medium max-w-2xl mx-auto leading-relaxed">
            Nuestros árboles de decisión y algoritmos están fundamentados en los manuales pediátricos oficiales de la <strong>Organización Mundial de la Salud (OMS)</strong>, la <strong>Academia Americana de Pediatría (AAP)</strong> y <strong>UNICEF</strong>.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------- */}
      {/* MODAL PROFESIONAL: REGISTRO & INICIO DE SESIÓN       */}
      {/* ---------------------------------------------------- */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAuthModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl border border-amber-200 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header del Modal */}
            <div className="p-5 border-b border-amber-100 bg-[#FFFDF7] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center p-1">
                  <FroggiAvatar size="sm" expression="happy" />
                </div>
                <div>
                  <h3 className="font-rounded font-bold text-base text-amber-950">
                    {authTab === 'register' ? 'Crear tu Cuenta Pediátrica' : 'Iniciar Sesión'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Acceso seguro con cifrado PBKDF2</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pestañas: Registrarse vs Iniciar Sesión */}
            <div className="p-5 space-y-4">
              <div className="flex items-center p-1 bg-amber-50/80 rounded-2xl border border-amber-200">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('register');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    authTab === 'register'
                      ? 'bg-white text-amber-950 shadow-xs'
                      : 'text-slate-600 hover:text-amber-950'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Registrarse</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    authTab === 'login'
                      ? 'bg-white text-amber-950 shadow-xs'
                      : 'text-slate-600 hover:text-amber-950'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-amber-700" />
                  <span>Iniciar Sesión</span>
                </button>
              </div>

              {/* Google 1-Click Button */}
              <button
                type="button"
                onClick={() => handleGoogleAuth('user')}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-2xl border border-slate-300 hover:border-amber-400 bg-white hover:bg-amber-50/50 text-slate-800 text-xs font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continuar con Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 shrink-0">
                  o con tu correo
                </span>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-3">
                {authTab === 'register' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nombre completo</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej: Valentina Cruz"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-amber-50/30 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Parentesco</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {(['mamá', 'papá', 'tutor', 'familiar'] as const).map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setParentRole(r)}
                            className={`py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer capitalize ${
                              parentRole === r
                                ? 'bg-amber-400 text-amber-950 border-amber-500'
                                : 'bg-white hover:bg-amber-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="valecruz20008@gmail.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-amber-50/30 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Contraseña</label>
                    <span className="text-[10px] text-amber-800 font-mono">PBKDF2/SHA-512</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2 pr-10 rounded-xl border border-slate-300 bg-amber-50/30 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm bg-amber-400 hover:bg-amber-500 active:scale-98 text-amber-950 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-amber-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{authTab === 'register' ? 'Crear Cuenta Pediátrica' : 'Iniciar Sesión'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Botón discreto para Cuentas Demo de prueba / evaluación */}
              <div className="pt-2 border-t border-amber-100">
                <button
                  type="button"
                  onClick={() => setShowDemoAccordion(!showDemoAccordion)}
                  className="w-full text-center text-[11px] font-semibold text-amber-900/80 hover:text-amber-950 cursor-pointer flex items-center justify-center gap-1 py-1"
                >
                  <span>Cuentas de demostración rápida</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showDemoAccordion ? 'rotate-90' : ''}`} />
                </button>

                {showDemoAccordion && (
                  <div className="mt-2.5 p-3 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-2 max-h-48 overflow-y-auto">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Haz clic en cualquier cuenta para acceder de inmediato:
                    </p>

                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-amber-900">Familias:</p>
                      <button
                        type="button"
                        onClick={() => handleDemoLogin('valecruz20008@gmail.com', 'usuario123', 'user')}
                        className="w-full text-left p-1.5 rounded-lg hover:bg-amber-100/70 text-[11px] text-slate-700 flex items-center justify-between"
                      >
                        <span>👶 Valentina Cruz (Mateo 12m)</span>
                        <span className="text-[10px] font-mono text-slate-400">valecruz20008@gmail.com</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDemoLogin('camila.santos@gmail.com', 'usuario123', 'user')}
                        className="w-full text-left p-1.5 rounded-lg hover:bg-amber-100/70 text-[11px] text-slate-700 flex items-center justify-between"
                      >
                        <span>👶 Camila Santos (Lucas 6m)</span>
                        <span className="text-[10px] font-mono text-slate-400">camila.santos@gmail.com</span>
                      </button>
                    </div>

                    <div className="space-y-1 pt-1 border-t border-amber-200/60">
                      <p className="text-[10px] font-bold text-indigo-900">Administrador Clínico:</p>
                      <button
                        type="button"
                        onClick={() => handleDemoLogin('admin@amigosunidos.com', 'admin123', 'admin')}
                        className="w-full text-left p-1.5 rounded-lg hover:bg-indigo-50 text-[11px] text-slate-700 flex items-center justify-between"
                      >
                        <span>👩‍⚕️ Dra. Elena Ramos (Jefa Pediatría)</span>
                        <span className="text-[10px] font-mono text-slate-400">admin@amigosunidos.com</span>
                      </button>
                    </div>

                    <div className="space-y-1 pt-1 border-t border-amber-200/60">
                      <p className="text-[10px] font-bold text-amber-950">Desarrollador (God Mode):</p>
                      <button
                        type="button"
                        onClick={() => handleDemoLogin('dev@amigosunidos.ai', 'dev123', 'developer')}
                        className="w-full text-left p-1.5 rounded-lg hover:bg-amber-200/50 text-[11px] text-slate-700 flex items-center justify-between"
                      >
                        <span>💻 Ing. Alex Valdés (AI Architect)</span>
                        <span className="text-[10px] font-mono text-slate-400">dev@amigosunidos.ai</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* FOOTER PROFESIONAL                                   */}
      {/* ---------------------------------------------------- */}
      <footer id="seguridad" className="mt-auto py-8 border-t border-amber-200/80 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="font-rounded font-bold text-sm text-amber-950">Amigos Unidos</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-[10px] font-bold text-amber-900">
              Salud Pediátrica
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Acompañamiento pediátrico asistido por inteligencia artificial clínica bajo lineamientos de OMS, AAP y UNICEF.
          </p>
          <p className="text-[11px] text-slate-400">
            Cifrado con PBKDF2/SHA-512 • Privacidad de datos protegida • Libre de costo
          </p>
        </div>
      </footer>
    </div>
  );
};
