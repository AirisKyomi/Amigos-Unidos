/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useFamily } from './context/FamilyContext';
import { useTheme } from './context/ThemeContext';
import { LandingHome } from './components/LandingHome';
import { UserPortal } from './components/UserPortal';
import { BackofficeDashboard } from './components/BackofficeDashboard';
import { DeveloperTechnicalView } from './components/DeveloperTechnicalView';
import { PlatformRole } from './types';
import { ShieldAlert, ArrowLeft, LogOut, Lock } from 'lucide-react';

export default function App() {
  const { user, isLoggedIn, logout, isBackofficeAuthorized, isDeveloperAuthorized } = useFamily();
  const { config, currentTheme } = useTheme();

  // Active view state: 'landing' | 'user' | 'backoffice' | 'developer'
  const [currentView, setCurrentView] = useState<'user' | 'backoffice' | 'developer'>('user');

  // Synchronize view when session changes
  useEffect(() => {
    if (user) {
      if (user.systemRole === 'admin') {
        setCurrentView('backoffice');
      } else if (user.systemRole === 'developer') {
        setCurrentView('developer');
      } else {
        setCurrentView('user');
      }
    }
  }, [user?.id, user?.systemRole]);

  // 1. If not logged in, show Landing Page / Home
  if (!isLoggedIn || !user) {
    return (
      <LandingHome
        onNavigateToRoleView={(role: PlatformRole) => {
          if (role === 'admin') {
            setCurrentView('backoffice');
          } else if (role === 'developer') {
            setCurrentView('developer');
          } else {
            setCurrentView('user');
          }
        }}
      />
    );
  }

  // 2. Role-based view routing
  const fontSizeClass =
    config.fontSize === 'large'
      ? 'text-lg leading-relaxed'
      : config.fontSize === 'comfortable'
      ? 'text-base leading-normal'
      : 'text-sm';

  return (
    <div
      className={`min-h-screen transition-colors duration-200 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900 ${currentTheme.pageBg} ${fontSizeClass} ${
        config.highContrast ? 'contrast-125' : ''
      }`}
    >
      {/* 2.1 View: Backoffice */}
      {currentView === 'backoffice' && (
        <>
          {isBackofficeAuthorized ? (
            <BackofficeDashboard
              onLogout={() => logout()}
            />
          ) : (
            <div className="min-h-screen flex items-center justify-center p-6 text-center">
              <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-3xl border border-rose-200 dark:border-rose-900 shadow-xl space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Acceso Restringido al Backoffice
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Tu cuenta ({user.email}) tiene el rol de <strong>{user.systemRole}</strong>. El módulo de administración requiere rol de Administrador o Desarrollador.
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => setCurrentView('user')}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Volver al Portal de Usuario
                  </button>
                  <button
                    onClick={() => logout()}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* 2.2 View: Developer (God Mode) */}
      {currentView === 'developer' && (
        <>
          {isDeveloperAuthorized ? (
            <DeveloperTechnicalView
              onLogout={() => logout()}
            />
          ) : (
            <div className="min-h-screen flex items-center justify-center p-6 text-center">
              <div className="max-w-md w-full bg-white dark:bg-slate-800 p-8 rounded-3xl border border-amber-200 dark:border-amber-900 shadow-xl space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 mx-auto">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Permiso God Mode Requerido
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Esta vista contiene la sustentación técnica de arquitectura y modelos de IA reservada para el Desarrollador.
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => setCurrentView('user')}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Volver al Portal de Usuario
                  </button>
                  <button
                    onClick={() => logout()}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* 2.3 View: User Portal */}
      {currentView === 'user' && (
        <UserPortal
          onNavigateToBackoffice={() => setCurrentView('backoffice')}
          onNavigateToDev={() => setCurrentView('developer')}
          onLogout={() => logout()}
        />
      )}
    </div>
  );
}
