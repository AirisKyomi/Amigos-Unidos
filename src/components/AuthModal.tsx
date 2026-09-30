import React, { useState } from 'react';
import { useFamily } from '../context/FamilyContext';
import { FroggiAvatar, PanditaAvatar, MonitoAvatar, CaracolitoAvatar } from './MascotSVGs';
import {
  User,
  Mail,
  Lock,
  Heart,
  Plus,
  Baby,
  Calendar,
  Scale,
  Ruler,
  AlertCircle,
  CheckCircle2,
  X,
  Sparkles,
  ShieldCheck,
  Edit3,
  LogOut,
  LogIn,
  UserPlus
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'addChild' | 'profile';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login'
}) => {
  const { user, isLoggedIn, login, register, logout, addChild, updateChild, activeChild, setActiveChildId } = useFamily();

  const [mode, setMode] = useState<'login' | 'register' | 'addChild' | 'profile'>(initialMode);
  
  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginRole, setLoginRole] = useState<'mamá' | 'papá' | 'tutor' | 'familiar'>('mamá');

  // Register / Add Child Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState<'mamá' | 'papá' | 'tutor' | 'familiar'>('mamá');
  
  // Child Survey Data
  const [childName, setChildName] = useState('');
  const [childGender, setChildGender] = useState<'boy' | 'girl'>('boy');
  const [childBirthDate, setChildBirthDate] = useState('2025-08-01');
  const [childAgeMonths, setChildAgeMonths] = useState<number>(12);
  const [childWeightKg, setChildWeightKg] = useState<number>(9.5);
  const [childHeightCm, setChildHeightCm] = useState<number>(75);
  const [childFeeding, setChildFeeding] = useState<'breastfeeding' | 'formula' | 'mixed' | 'solids'>('solids');
  const [childAllergies, setChildAllergies] = useState('');
  const [childConditions, setChildConditions] = useState('');
  const [childInterests, setChildInterests] = useState('');

  // Step tracker for registration
  const [regStep, setRegStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;
    login(loginEmail, loginName || 'Padre de Familia', loginRole);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;
    
    register(regName, regEmail, regRole, {
      name: childName.trim() || 'Mi Peque',
      gender: childGender,
      birthDate: childBirthDate,
      ageMonths: childAgeMonths,
      currentWeightKg: childWeightKg,
      currentHeightCm: childHeightCm,
      feedingType: childFeeding,
      allergiesKnown: childAllergies.trim() || 'Ninguna conocida',
      medicalConditions: childConditions.trim() || 'Sano/a, controles al día',
      favoriteInterests: childInterests.trim() || 'Juegos con música, cuentos y exploración'
    });
    onClose();
  };

  const handleAddChildSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) return;
    
    addChild({
      name: childName.trim(),
      gender: childGender,
      birthDate: childBirthDate,
      ageMonths: childAgeMonths,
      currentWeightKg: childWeightKg,
      currentHeightCm: childHeightCm,
      feedingType: childFeeding,
      allergiesKnown: childAllergies.trim() || 'Ninguna',
      medicalConditions: childConditions.trim() || 'Sano/a',
      favoriteInterests: childInterests.trim() || 'Música y juegos',
      specialNotes: ''
    });
    setMode('profile');
  };

  const quickDemoLogin = () => {
    login('valecruz20008@gmail.com', 'Valentina Cruz', 'mamá');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-xs">
              <FroggiAvatar size={46} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-900/60 text-emerald-200 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                <ShieldCheck className="w-3 h-3" />
                Perfil Familiar Seguro
              </div>
              <h3 className="text-lg sm:text-xl font-black">
                {isLoggedIn && mode === 'profile'
                  ? 'Mi Familia & Hijos Registrados'
                  : mode === 'addChild'
                  ? 'Registrar Nuevo Hijo/a'
                  : mode === 'register'
                  ? 'Registro de Padres & Encuesta'
                  : 'Iniciar Sesión'}
              </h3>
              <p className="text-xs text-emerald-100">
                Atención médica pediátrica 100% personalizada con Froggi y sus amigos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers if not logged in or in modal */}
        {!isLoggedIn && (
          <div className="flex border-b border-slate-100 bg-slate-50 text-xs font-bold">
            <button
              onClick={() => { setMode('login'); setRegStep(1); }}
              className={`flex-1 py-3 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-white text-emerald-700 border-b-2 border-emerald-600 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </button>
            <button
              onClick={() => { setMode('register'); setRegStep(1); }}
              className={`flex-1 py-3 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-white text-emerald-700 border-b-2 border-emerald-600 font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Registrarme con mi Hijo/a</span>
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {/* ========================================== */}
          {/* 1. LOGIN MODE */}
          {/* ========================================== */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-xs">Acceso a tu Expediente Pediátrico</span>
                  <p className="text-[11px] text-emerald-800">
                    Ingresa tus credenciales o utiliza los accesos rápidos de demostración para explorar la plataforma.
                  </p>
                </div>
              </div>

              {/* Demo Quick Pickers */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Cuentas de Acceso Rápido con 1 Clic:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      login('valecruz20008@gmail.com', '123', 'Valentina Cruz', 'mamá');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                        V
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs group-hover:text-emerald-800">
                          Valentina Cruz
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Mateo (12m) & Sofía (3.5y)
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      login('carlos@familia.com', '123', 'Carlos Mendoza', 'papá');
                      onClose();
                    }}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        C
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs group-hover:text-blue-800">
                          Carlos Mendoza
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Lucas (6m) • Lactante
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-slate-400 text-[10px] font-bold uppercase">o ingresa con tu correo</span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Correo Electrónico:</label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus-within:border-emerald-500 focus-within:bg-white">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="ejemplo: mama@familia.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-transparent outline-hidden font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre Completo:</label>
                  <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus-within:border-emerald-500 focus-within:bg-white">
                    <User className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Tu nombre completo"
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      className="w-full bg-transparent outline-hidden font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Parentesco en la Crianza:</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['mamá', 'papá', 'tutor', 'familiar'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setLoginRole(r)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold capitalize transition-all border cursor-pointer ${
                          loginRole === r
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-extrabold'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-2xl shadow-xs transition-colors cursor-pointer text-xs flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Iniciar Sesión en Mi Cuenta</span>
                </button>

                <p className="text-center text-[11px] text-slate-500 pt-1">
                  ¿No tienes una cuenta aún?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setRegStep(1);
                    }}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Regístrate con la encuesta de tu hijo/a
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ========================================== */}
          {/* 2. REGISTER MODE (Step 1: Parent, Step 2: Child Survey) */}
          {/* ========================================== */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Stepper Pill */}
              <div className="flex items-center justify-center gap-3 pb-2 border-b border-slate-100 text-xs">
                <div
                  onClick={() => setRegStep(1)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold cursor-pointer ${
                    regStep === 1
                      ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-400'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">1</span>
                  <span>Datos del Adulto</span>
                </div>
                <span className="text-slate-300">→</span>
                <div
                  onClick={() => { if (regName && regEmail) setRegStep(2); }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold cursor-pointer ${
                    regStep === 2
                      ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-400'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">2</span>
                  <span>Encuesta del Hijo/a</span>
                </div>
              </div>

              {/* Step 1: Parent Info */}
              {regStep === 1 && (
                <div className="space-y-3 text-xs animate-in fade-in">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nombre Completo del Padre/Madre:</label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus-within:border-emerald-500 focus-within:bg-white">
                      <User className="w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Ejemplo: Laura Méndez"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full bg-transparent outline-hidden font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Correo Electrónico:</label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus-within:border-emerald-500 focus-within:bg-white">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="mama@ejemplo.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full bg-transparent outline-hidden font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tu rol en la crianza:</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['mamá', 'papá', 'tutor', 'familiar'] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRegRole(r)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold capitalize transition-all border cursor-pointer ${
                            regRole === r
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!regName.trim() || !regEmail.trim()}
                    onClick={() => setRegStep(2)}
                    className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-2xl transition-colors cursor-pointer text-xs flex items-center justify-center gap-2"
                  >
                    <span>Continuar a Encuesta del Hijo/a</span>
                    <span>→</span>
                  </button>
                </div>
              )}

              {/* Step 2: Child Comprehensive Survey */}
              {regStep === 2 && (
                <div className="space-y-3 text-xs animate-in fade-in">
                  <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
                    <Baby className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-xs">Encuesta Médica y de Crecimiento</span>
                      <p className="text-[11px] text-emerald-800">
                        Estos datos alimentarán automáticamente los percentiles OMS, el triaje dermatológico, el detector de llanto y los cuentos interactivos.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Nombre o Apodo de tu Peque:</label>
                      <input
                        type="text"
                        required
                        placeholder="Ejemplo: Lucas"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Sexo Biológico:</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setChildGender('boy')}
                          className={`py-2 rounded-xl font-bold transition-all border cursor-pointer ${
                            childGender === 'boy'
                              ? 'bg-blue-50 border-blue-500 text-blue-800'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          Niño (Varón)
                        </button>
                        <button
                          type="button"
                          onClick={() => setChildGender('girl')}
                          className={`py-2 rounded-xl font-bold transition-all border cursor-pointer ${
                            childGender === 'girl'
                              ? 'bg-pink-50 border-pink-500 text-pink-800'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          Niña (Mujer)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Edad (Meses):</label>
                      <input
                        type="number"
                        min="0"
                        max="144"
                        value={childAgeMonths}
                        onChange={(e) => setChildAgeMonths(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                      />
                      <span className="text-[10px] text-slate-400">{(childAgeMonths / 12).toFixed(1)} años</span>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Peso Actual (Kg):</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="70"
                        value={childWeightKg}
                        onChange={(e) => setChildWeightKg(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Talla / Altura (cm):</label>
                      <input
                        type="number"
                        step="0.5"
                        min="30"
                        max="180"
                        value={childHeightCm}
                        onChange={(e) => setChildHeightCm(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Tipo de Alimentación:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {[
                        { id: 'breastfeeding', label: 'Lactancia Materna' },
                        { id: 'formula', label: 'Fórmula' },
                        { id: 'mixed', label: 'Mixta' },
                        { id: 'solids', label: 'Sólidos / Familiar' }
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setChildFeeding(f.id as any)}
                          className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
                            childFeeding === f.id
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Alergias Conocidas o Intolerancias:</label>
                    <input
                      type="text"
                      placeholder="Ej: Ninguna, Alergia al huevo, APLV, etc."
                      value={childAllergies}
                      onChange={(e) => setChildAllergies(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Gustos, Juegos o Intereses Favoritos:</label>
                    <input
                      type="text"
                      placeholder="Ej: Dinosaurios, música rítmica, pintar con crayones, animales del bosque"
                      value={childInterests}
                      onChange={(e) => setChildInterests(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-800"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setRegStep(1)}
                      className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-2xl transition-colors cursor-pointer text-xs"
                    >
                      ← Atrás
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-2xl shadow-xs transition-colors cursor-pointer text-xs flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Guardar Perfil & Comenzar</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* ========================================== */}
          {/* 3. PROFILE & MULTI-CHILD MANAGEMENT */}
          {/* ========================================== */}
          {(mode === 'profile' || isLoggedIn) && mode !== 'addChild' && mode !== 'login' && mode !== 'register' && (
            <div className="space-y-4 text-xs">
              {/* User Greeting Bar */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                    {user?.name.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{user?.name}</h4>
                    <span className="text-slate-500 font-medium capitalize">
                      {user?.role} • {user?.email}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Salir</span>
                </button>
              </div>

              {/* Children List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                    <Baby className="w-4 h-4 text-emerald-600" />
                    <span>Hijos Registrados ({user?.children.length || 0})</span>
                  </span>

                  <button
                    onClick={() => {
                      setChildName('');
                      setChildAgeMonths(12);
                      setChildWeightKg(9.5);
                      setChildHeightCm(75);
                      setChildAllergies('');
                      setChildInterests('');
                      setMode('addChild');
                    }}
                    className="flex items-center gap-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold px-3 py-1 rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar Hijo/a</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {user?.children.map((child) => {
                    const isActive = child.id === user.activeChildId;
                    return (
                      <div
                        key={child.id}
                        onClick={() => setActiveChildId(child.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isActive
                            ? 'bg-emerald-50/70 border-emerald-400 shadow-xs ring-2 ring-emerald-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-sm ${
                              child.gender === 'boy'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-pink-100 text-pink-700'
                            }`}
                          >
                            {child.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900 text-sm">{child.name}</span>
                              {isActive && (
                                <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  Hijo Activo
                                </span>
                              )}
                            </div>
                            <p className="text-slate-500 text-[11px] mt-0.5">
                              {child.ageMonths} meses ({(child.ageMonths / 12).toFixed(1)} años) • {child.currentWeightKg || 9.5} kg • {child.currentHeightCm || 75} cm
                            </p>
                          </div>
                        </div>

                        <div className="text-right text-[11px] text-slate-400 font-medium">
                          <span>{child.allergiesKnown ? `Alergias: ${child.allergiesKnown}` : 'Sin alergias'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Child Overview Details */}
              {activeChild && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Ficha Médica de {activeChild.name}:</span>
                    <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
                      Sincronizado con IA
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block">Alimentación:</span>
                      <span className="font-bold text-slate-800 capitalize">{activeChild.feedingType || 'Sólidos'}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <span className="text-slate-400 block">Condición:</span>
                      <span className="font-bold text-slate-800">{activeChild.medicalConditions || 'Sano'}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200 sm:col-span-2">
                      <span className="text-slate-400 block">Intereses favoritos:</span>
                      <span className="font-bold text-slate-800 line-clamp-1">{activeChild.favoriteInterests || 'Música y juegos'}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-2xl transition-colors cursor-pointer text-xs"
              >
                Volver a la Plataforma
              </button>
            </div>
          )}

          {/* ========================================== */}
          {/* 4. ADD NEW CHILD FORM */}
          {/* ========================================== */}
          {mode === 'addChild' && (
            <form onSubmit={handleAddChildSubmit} className="space-y-3 text-xs">
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-emerald-950 flex items-center gap-2">
                <Baby className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-bold">Encuesta para nuevo hijo/a</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nombre o Apodo:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ejemplo: Camila"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sexo Biológico:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setChildGender('boy')}
                      className={`py-2 rounded-xl font-bold border cursor-pointer ${
                        childGender === 'boy' ? 'bg-blue-50 border-blue-500 text-blue-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      Niño
                    </button>
                    <button
                      type="button"
                      onClick={() => setChildGender('girl')}
                      className={`py-2 rounded-xl font-bold border cursor-pointer ${
                        childGender === 'girl' ? 'bg-pink-50 border-pink-500 text-pink-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      Niña
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Edad (Meses):</label>
                  <input
                    type="number"
                    min="0"
                    max="144"
                    value={childAgeMonths}
                    onChange={(e) => setChildAgeMonths(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Peso (Kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="70"
                    value={childWeightKg}
                    onChange={(e) => setChildWeightKg(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Talla (cm):</label>
                  <input
                    type="number"
                    step="0.5"
                    min="30"
                    max="180"
                    value={childHeightCm}
                    onChange={(e) => setChildHeightCm(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 font-bold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alergias:</label>
                <input
                  type="text"
                  placeholder="Ninguna conocida"
                  value={childAllergies}
                  onChange={(e) => setChildAllergies(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Intereses y Juegos:</label>
                <input
                  type="text"
                  placeholder="Ej: Pintar, cuentos, bailar"
                  value={childInterests}
                  onChange={(e) => setChildInterests(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 rounded-xl px-3 py-2 text-slate-800"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMode('profile')}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-2xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-2xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Guardar Hijo/a</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
