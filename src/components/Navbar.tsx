import React from 'react';
import { AgeBracket } from '../types';
import { useFamily } from '../context/FamilyContext';
import { useTheme } from '../context/ThemeContext';
import { FroggiAvatar } from './MascotSVGs';
import {
  MessageSquareHeart,
  Heart,
  Volume2,
  ScanEye,
  TrendingUp,
  Award,
  Sparkles,
  CreditCard,
  FileCode2,
  AlertTriangle,
  History,
  User,
  LogIn,
  UserPlus,
  Baby,
  ChevronDown,
  Palette,
  Sliders,
  Dna
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedAge: AgeBracket;
  setSelectedAge: (age: AgeBracket) => void;
  onEmergencyClick: () => void;
  onOpenAuthModal: (mode?: 'login' | 'register' | 'addChild' | 'profile') => void;
  onOpenSettingsModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedAge,
  setSelectedAge,
  onEmergencyClick,
  onOpenAuthModal,
  onOpenSettingsModal
}) => {
  const { user, isLoggedIn, activeChild, setActiveChildId } = useFamily();
  const { config, currentTheme, playUiSound } = useTheme();

  const navItems = [
    { id: 'chat', label: 'Froggi IA Pediátrica', icon: MessageSquareHeart, badge: 'Transformer' },
    { id: 'genetic', label: 'Optimizador Genético', icon: Dna, badge: 'Heurística AG' },
    { id: 'pregnancy', label: 'Embarazo & Maternidad', icon: Heart, badge: 'Obstetricia & Audio' },
    { id: 'cry', label: 'Detector de Llanto', icon: Volume2, badge: 'LSTM / Bioacústica' },
    { id: 'derma', label: 'Triaje de Piel AAP', icon: ScanEye, badge: 'CNN Visión' },
    { id: 'growth', label: 'Percentiles OMS', icon: TrendingUp, badge: 'LMS / Regresión' },
    { id: 'milestones', label: 'Hitos UNICEF', icon: Award, badge: 'ECDI2030' },
    { id: 'history', label: 'Historial & Registros', icon: History, badge: 'Expediente' },
    { id: 'kids_zone', label: 'Zona Recreativa', icon: Sparkles, badge: 'Estimulación' },
    { id: 'pricing', label: 'Planes', icon: CreditCard, badge: 'Monetización' },
    { id: 'technical', label: 'Sustentación IA', icon: FileCode2, badge: 'Dossier' },
  ];

  const ageOptions: { value: AgeBracket; label: string; stage: string }[] = [
    { value: '0-12m', label: '0 a 12 meses', stage: 'Recién Nacido / Lactante' },
    { value: '1-3y', label: '1 a 3 años', stage: 'Primera Infancia' },
    { value: '4-6y', label: '4 a 6 años', stage: 'Etapa Preescolar' },
    { value: '7-10y+', label: '7 a 10+ años', stage: 'Infancia Escolar' },
  ];

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-xs transition-colors duration-200 ${
      config.theme === 'dark'
        ? 'bg-slate-900/95 border-slate-800 text-slate-100'
        : 'bg-white/95 border-slate-200 text-slate-900'
    }`}>
      {/* Top Banner with Mascots & Safety Alert */}
      <div className={`text-white px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r ${currentTheme.bannerGradient}`}>
        <div className="flex items-center gap-2 font-medium">
          <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[11px] font-black tracking-wide uppercase backdrop-blur-xs">
            Plataforma Médica Avalada
          </span>
          <span className="hidden sm:inline text-white/90">Directrices Pediátricas: OMS (WHO), UNICEF ECDI2030, AAP & ACOG</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Theme Switcher Pill */}
          <button
            id="header-theme-settings-pill"
            onClick={() => {
              playUiSound('click');
              onOpenSettingsModal();
            }}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-full font-bold transition-all cursor-pointer text-[11px] border border-white/25"
            title="Personalizar tema, audio y accesibilidad"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Tema: {currentTheme.name.split(' ')[0]} {currentTheme.emoji}</span>
          </button>

          <button
            id="emergency-alert-btn"
            onClick={onEmergencyClick}
            className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-0.5 rounded-full font-bold transition-colors cursor-pointer text-[11px] shadow-xs"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Signos de Alarma</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Mascots */}
        <div
          onClick={() => setActiveTab('chat')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <FroggiAvatar size={46} className="transform group-hover:scale-105 transition-transform" />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight">
                Amigos <span className={currentTheme.textAccent}>Unidos</span>
              </span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${currentTheme.pillActive}`}>
                IA Pediátrica & Maternidad
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Acompañamiento pediátrico de 0 a 10+ años y embarazo con Froggi
            </p>
          </div>
        </div>

        {/* User Auth & Child Selector Section */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Child Age Selector */}
          <div className={`flex items-center gap-1 p-1 rounded-2xl border ${
            config.theme === 'dark' ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[11px] font-semibold text-slate-500 pl-2 hidden lg:inline">
              Etapa:
            </span>
            <div className="flex gap-1 overflow-x-auto">
              {ageOptions.map((opt) => (
                <button
                  key={opt.value}
                  id={`age-filter-${opt.value}`}
                  onClick={() => {
                    playUiSound('click');
                    setSelectedAge(opt.value);
                  }}
                  className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    selectedAge === opt.value
                      ? `${currentTheme.accentBg} shadow-xs`
                      : config.theme === 'dark'
                      ? 'text-slate-400 hover:bg-slate-800'
                      : 'text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Trigger Icon Button */}
          <button
            id="nav-open-settings-btn"
            onClick={() => {
              playUiSound('click');
              onOpenSettingsModal();
            }}
            className={`p-2 rounded-2xl border transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
              config.theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="Ajustes de tema, voz y accesibilidad"
          >
            <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">Temas</span>
          </button>

          {/* Login / Profile Button */}
          {isLoggedIn && user ? (
            <div className={`flex items-center gap-2 border rounded-2xl p-1 pl-2.5 ${
              config.theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-emerald-50 border-emerald-200'
            }`}>
              <div
                onClick={() => onOpenAuthModal('profile')}
                className="flex items-center gap-2 cursor-pointer pr-1"
                title="Ver perfil de familia y cambiar hijo"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-[11px] font-bold leading-tight">
                    {user.name.split(' ')[0]} ({user.role})
                  </div>
                  {activeChild && (
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Baby className="w-2.5 h-2.5" />
                      {activeChild.name} ({activeChild.ageMonths}m)
                    </div>
                  )}
                </div>
              </div>

              <button
                id="header-profile-btn"
                onClick={() => onOpenAuthModal('profile')}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition-colors cursor-pointer ${currentTheme.accentBg}`}
              >
                Mi Familia
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                id="header-login-btn"
                onClick={() => onOpenAuthModal('login')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold transition-all shadow-xs cursor-pointer text-xs ${currentTheme.accentBg}`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Iniciar Sesión</span>
              </button>
              <button
                id="header-register-btn"
                onClick={() => onOpenAuthModal('register')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer text-xs hidden sm:flex ${
                  config.theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Registrarse</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 pb-2 overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => {
                  playUiSound('click');
                  setActiveTab(item.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? config.theme === 'dark'
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-xs'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs'
                    : config.theme === 'dark'
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-semibold ${
                    isActive
                      ? config.theme === 'dark'
                        ? 'bg-slate-700 text-emerald-300'
                        : 'bg-emerald-200 text-emerald-900'
                      : config.theme === 'dark'
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};


