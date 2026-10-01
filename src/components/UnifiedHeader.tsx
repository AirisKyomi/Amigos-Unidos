import React, { useState } from 'react';
import { useFamily } from '../context/FamilyContext';
import { useTheme } from '../context/ThemeContext';
import { PlatformRole, AgeBracket } from '../types';
import { FroggiAvatar } from './MascotSVGs';
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  AlertTriangle,
  ChevronRight,
  Shield,
  BarChart3,
  Code2,
  Sparkles,
  Baby,
  Check,
  Clock
} from 'lucide-react';

export interface NavDrawerItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  category?: string;
}

interface UnifiedHeaderProps {
  interfaceTitle?: string;
  activeItemId?: string;
  items?: NavDrawerItem[];
  onSelectItem?: (id: string) => void;
  onNavigateToBackoffice?: () => void;
  onNavigateToDev?: () => void;
  onNavigateToUser?: () => void;
  onLogout?: () => void;
  onOpenSettings?: () => void;
  onOpenEmergency?: () => void;
  onNavigateToHistory?: () => void;
  selectedAge?: AgeBracket;
  onSelectAge?: (age: AgeBracket) => void;
  extraHeaderActions?: React.ReactNode;
}

export const UnifiedHeader: React.FC<UnifiedHeaderProps> = ({
  interfaceTitle = 'Portal Familiar',
  activeItemId,
  items = [],
  onSelectItem,
  onNavigateToBackoffice,
  onNavigateToDev,
  onNavigateToUser,
  onLogout,
  onOpenSettings,
  onOpenEmergency,
  onNavigateToHistory,
  selectedAge,
  onSelectAge,
  extraHeaderActions
}) => {
  const { user, activeChild, logout, isBackofficeAuthorized, isDeveloperAuthorized } = useFamily();
  const { currentTheme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const activeItem = items.find((i) => i.id === activeItemId);

  const handleSelect = (id: string) => {
    if (onSelectItem) {
      onSelectItem(id);
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    logout();
    if (onLogout) onLogout();
  };

  return (
    <>
      {/* Main Top Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* LEFT: 3 Stripes (Menu) + Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* 3 Stripes Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/90 transition-all cursor-pointer shadow-2xs flex items-center justify-center group"
              aria-label="Abrir opciones de navegación"
              title="Menú de opciones"
            >
              <Menu className="w-5 h-5 group-hover:scale-105 transition-transform" />
            </button>

            {/* Mascot Avatar & Brand Name */}
            <a href="/" aria-label="Volver a la web principal de Amigos Unidos" title="Volver a la web principal" className="flex items-center gap-2.5 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-600">
              <div className="w-10 h-10 rounded-2xl bg-amber-100/90 border border-amber-300/80 flex items-center justify-center p-1 shadow-2xs">
                <FroggiAvatar size="sm" expression="happy" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-rounded font-bold text-lg sm:text-xl tracking-tight text-amber-950 max-[380px]:hidden">
                    Amigos Unidos
                  </span>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-100 text-amber-900 border border-amber-300">
                    {interfaceTitle}
                  </span>
                </div>
                {activeItem && (
                  <span className="text-xs text-amber-950 font-bold flex items-center gap-1">
                    <span>•</span>
                    <span className="truncate max-w-[180px] sm:max-w-none">{activeItem.label}</span>
                  </span>
                )}
              </div>
              </a>
          </div>

          {/* RIGHT: Profile Button & Quick Tools */}
          <div className="flex items-center gap-2">
            {extraHeaderActions}

            {/* Emergency Shortcut (if provided) */}
            {onOpenEmergency && (
              <button
                type="button"
                onClick={onOpenEmergency}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Líneas y protocolo de urgencias pediátricas"
              >
                <AlertTriangle className="w-4 h-4 text-rose-700" />
                <span>Urgencias</span>
              </button>
            )}

            {/* Profile Button (La opción del perfil) */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 transition-all cursor-pointer shadow-2xs group"
              aria-label="Ver perfil y configuración"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-xl object-cover border border-amber-300"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-amber-200 flex items-center justify-center text-amber-950 font-bold text-xs">
                  {user?.name?.charAt(0) || <User className="w-4 h-4" />}
                </div>
              )}
              <div className="hidden sm:block text-left pr-1">
                <p className="text-xs font-bold text-amber-950 truncate max-w-[110px]">
                  {user?.name || 'Mi Perfil'}
                </p>
                <p className="text-[10px] text-amber-900 font-bold capitalize">
                  {user?.systemRole === 'admin'
                    ? 'Admin Clínico'
                    : user?.systemRole === 'developer'
                    ? 'Desarrollador'
                    : user?.role || 'Familia'}
                </p>
              </div>
            </button>

          </div>
        </div>
      </header>

      {/* 1. DRAWER DE LAS 3 RAYITAS (Opciones de cada interfaz) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer Content on Left */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-white border-r border-amber-200 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-amber-100 bg-[#FFFDF5] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center p-1 border border-amber-300">
                  <FroggiAvatar size="sm" expression="happy" />
                </div>
                <div>
                  <h3 className="font-rounded font-bold text-base text-amber-950">
                    Opciones de {interfaceTitle}
                  </h3>
                  <p className="text-xs text-amber-800/80">Selecciona la función que deseas explorar</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all cursor-pointer"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#FFFDF9]">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeItemId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center justify-between gap-3 cursor-pointer border ${
                      isActive
                        ? 'bg-amber-100/90 border-amber-400 text-amber-950 font-bold shadow-xs'
                        : 'bg-white hover:bg-amber-50/70 border-amber-100 text-slate-800 hover:text-amber-950'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          isActive
                            ? 'bg-amber-200/90 text-amber-900 border-amber-400'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-bold truncate">{item.label}</p>
                        {item.description && (
                          <p className="text-[11px] text-slate-500 truncate">{item.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                          {item.badge}
                        </span>
                      )}
                      {isActive ? (
                        <Check className="w-4 h-4 text-amber-800" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Elevated Role Switches inside Drawer */}
              {(isBackofficeAuthorized || isDeveloperAuthorized) && (
                <div className="pt-4 mt-4 border-t border-amber-200 space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 px-1">
                    Cambio de Entorno (Privilegios):
                  </p>
                  {onNavigateToUser && interfaceTitle !== 'Portal Familiar' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onNavigateToUser();
                      }}
                      className="w-full p-2.5 rounded-xl bg-white hover:bg-amber-50 border border-amber-200 text-xs font-bold text-amber-950 flex items-center gap-2 cursor-pointer"
                    >
                      <Baby className="w-4 h-4 text-amber-700" />
                      <span>Ir al Portal Familiar</span>
                    </button>
                  )}
                  {isBackofficeAuthorized && onNavigateToBackoffice && interfaceTitle !== 'Backoffice' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onNavigateToBackoffice();
                      }}
                      className="w-full p-2.5 rounded-xl bg-white hover:bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-950 flex items-center gap-2 cursor-pointer"
                    >
                      <BarChart3 className="w-4 h-4 text-indigo-600" />
                      <span>Ir a Backoffice Administrativo</span>
                    </button>
                  )}
                  {isDeveloperAuthorized && onNavigateToDev && interfaceTitle !== 'Sustentación Técnica' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onNavigateToDev();
                      }}
                      className="w-full p-2.5 rounded-xl bg-white hover:bg-amber-50 border border-amber-300 text-xs font-bold text-amber-950 flex items-center gap-2 cursor-pointer"
                    >
                      <Code2 className="w-4 h-4 text-amber-600" />
                      <span>Ir a Sustentación Técnica</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-amber-100 bg-[#FFFDF5] text-center text-xs text-amber-800">
              <p className="font-rounded font-semibold">Amigos Unidos con Froggi</p>
              <p className="text-[11px] text-slate-500">Pediatría basada en OMS, AAP, UNICEF y ACOG</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. DRAWER DE PERFIL (La opción del perfil) */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsProfileOpen(false)}
          />

          {/* Profile Drawer Content on Right */}
          <div className="relative w-full max-w-sm sm:max-w-md bg-white border-l border-amber-200 shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-5 border-b border-amber-100 bg-[#FFFDF5] flex items-center justify-between">
              <h3 className="font-rounded font-bold text-base text-amber-950">
                Mi Perfil & Preferencias
              </h3>
              <button
                type="button"
                onClick={() => setIsProfileOpen(false)}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all cursor-pointer"
                aria-label="Cerrar perfil"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#FFFDF9]">
              {/* User Card */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-center gap-3.5">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-300 shadow-xs"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-amber-200 border-2 border-amber-300 flex items-center justify-center text-amber-900 font-bold text-lg shadow-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h4 className="font-rounded font-bold text-base text-amber-950 truncate">
                    {user?.name || 'Usuario'}
                  </h4>
                  <p className="text-xs text-slate-800 font-medium truncate">{user?.email}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 border border-amber-300">
                      Rol: {user?.systemRole === 'admin' ? 'Administrador' : user?.systemRole === 'developer' ? 'Desarrollador' : 'Usuario'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Child & Age Bracket */}
              {activeChild && onSelectAge && (
                <div className="p-4 rounded-2xl bg-white border border-amber-200/80 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-amber-950">Hijo(a) Activo(a)</p>
                      <p className="text-sm font-rounded font-bold text-amber-900">
                        {activeChild.name} ({activeChild.ageMonths} meses)
                      </p>
                    </div>
                    <span className="text-xl">👶</span>
                  </div>

                  <div>
                    <p className="text-[11px] font-extrabold text-slate-900 mb-1.5">Etapa de edad pediátrica:</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['0-12m', '1-3y', '4-6y', '7-10y+'] as AgeBracket[]).map((bracket) => (
                        <button
                          key={bracket}
                          type="button"
                          onClick={() => onSelectAge(bracket)}
                          className={`py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            selectedAge === bracket
                              ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-xs'
                              : 'bg-amber-50/50 hover:bg-amber-100 text-slate-900 border-amber-200'
                          }`}
                        >
                          {bracket}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Acceso Directo al Historial Pediátrico en el Apartado de Perfil */}
              {onNavigateToHistory && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-amber-100/40 to-orange-50/70 border border-amber-300 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                      Historial del Paciente
                    </span>
                    <span className="text-[11px] font-bold text-amber-800">
                      Acceso Directo
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onNavigateToHistory();
                    }}
                    className="w-full p-3 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-950 text-xs font-bold flex items-center justify-between cursor-pointer transition-all shadow-2xs group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-rounded font-extrabold text-sm text-amber-950 flex items-center gap-1.5">
                          <span>Mi Historial Pediátrico</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </p>
                        <p className="text-[11px] text-amber-800/80 font-normal">
                          Registro de consultas, triajes de piel, llanto y dosificaciones
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              )}

              {/* Quick Preferences & Settings */}
              <div className="space-y-2">
                {onOpenSettings && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full p-3 rounded-2xl bg-white hover:bg-amber-50/70 border border-amber-200 text-amber-950 text-xs font-bold flex items-center justify-between cursor-pointer transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                        <Settings className="w-4 h-4" />
                      </div>
                      <span>Voz, Accesibilidad y Configuración</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                )}

                {onOpenEmergency && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenEmergency();
                    }}
                    className="w-full p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-between cursor-pointer transition-all shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <span>Protocolo y Líneas de Urgencias</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-rose-400" />
                  </button>
                )}
              </div>

              {/* Elevated Role Jump Shortcuts */}
              {(isBackofficeAuthorized || isDeveloperAuthorized) && (
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2">
                  <p className="text-xs font-bold text-amber-950">Acceso rápido a otros paneles:</p>
                  {onNavigateToUser && interfaceTitle !== 'Portal Familiar' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        onNavigateToUser();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-white hover:bg-amber-100 border border-amber-200 text-xs font-bold text-amber-900 transition-all cursor-pointer text-left flex items-center gap-2"
                    >
                      <Baby className="w-4 h-4 text-amber-600" />
                      <span>Ir al Portal Familiar</span>
                    </button>
                  )}
                  {isBackofficeAuthorized && onNavigateToBackoffice && interfaceTitle !== 'Backoffice' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        onNavigateToBackoffice();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-white hover:bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-900 transition-all cursor-pointer text-left flex items-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4 text-indigo-600" />
                      <span>Ir a Backoffice Administrativo</span>
                    </button>
                  )}
                  {isDeveloperAuthorized && onNavigateToDev && interfaceTitle !== 'Sustentación Técnica' && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        onNavigateToDev();
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-white hover:bg-amber-100 border border-amber-300 text-xs font-bold text-amber-900 transition-all cursor-pointer text-left flex items-center gap-2"
                    >
                      <Code2 className="w-4 h-4 text-amber-600" />
                      <span>Ir a Sustentación Técnica</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Logout Button */}
            <div className="p-4 border-t border-amber-100 bg-[#FFFDF5]">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
