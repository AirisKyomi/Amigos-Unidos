import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppThemeId, AppFontSizeId, ThemeConfig } from '../types';
import {
  speakHumanizedText,
  singSongWithMusic,
  stopAllAudioAndSinging,
  getAllSpanishVoices,
  setSelectedVoiceURI as setGlobalVoiceURI,
  SongDataToSing,
  SongSingingOptions
} from '../utils/speechSynthesis';

export interface ThemeDefinition {
  id: AppThemeId;
  name: string;
  emoji: string;
  description: string;
  tagline: string;
  previewColors: string[];
  bannerGradient: string;
  primaryColor: string;
  accentBg: string;
  cardBorder: string;
  pillActive: string;
  textAccent: string;
  pageBg: string;
  containerClass: string;
}

export const THEME_DEFINITIONS: Record<AppThemeId, ThemeDefinition> = {
  pastel_yellow: {
    id: 'pastel_yellow',
    name: 'Blanco & Amarillo Claro Infantil',
    emoji: '⭐',
    description: 'Fondo blanco cálido con toques en amarillo pastel y dorados suaves, limpio y tierno.',
    tagline: 'Luz, serenidad y alegría para toda la familia',
    previewColors: ['#f59e0b', '#fbbf24', '#fef08a', '#fffdf5'],
    bannerGradient: 'from-amber-500 via-yellow-400 to-amber-600',
    primaryColor: 'amber',
    accentBg: 'bg-amber-400 hover:bg-amber-500 text-amber-950 font-bold',
    cardBorder: 'border-amber-300',
    pillActive: 'bg-amber-400 text-amber-950 border-amber-400 font-bold shadow-xs',
    textAccent: 'text-amber-950 font-black',
    pageBg: 'bg-[#FEFDF9] text-slate-950',
    containerClass: 'theme-pastel-yellow'
  },
  emerald: {
    id: 'emerald',
    name: 'Esmeralda Clínico & Menta',
    emoji: '🌿',
    description: 'Tonos naturales y frescos ideales para pediatría diurna y consulta médica.',
    tagline: 'Equilibrio, salud y bienestar infantil',
    previewColors: ['#059669', '#10b981', '#a7f3d0', '#ecfdf5'],
    bannerGradient: 'from-emerald-800 via-teal-800 to-cyan-900',
    primaryColor: 'emerald',
    accentBg: 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold',
    cardBorder: 'border-emerald-300',
    pillActive: 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs',
    textAccent: 'text-emerald-950 font-black',
    pageBg: 'bg-slate-50 text-slate-950',
    containerClass: 'theme-emerald'
  },
  ocean: {
    id: 'ocean',
    name: 'Océano Calmo & Cielo',
    emoji: '🌊',
    description: 'Azules suaves y cian sereno que transmiten paz, calma y seguridad.',
    tagline: 'Relajación y serenidad para toda la familia',
    previewColors: ['#0284c7', '#38bdf8', '#bae6fd', '#f0f9ff'],
    bannerGradient: 'from-sky-900 via-blue-900 to-indigo-950',
    primaryColor: 'sky',
    accentBg: 'bg-sky-600 hover:bg-sky-700 text-white font-bold',
    cardBorder: 'border-sky-300',
    pillActive: 'bg-sky-600 text-white border-sky-600 font-bold shadow-xs',
    textAccent: 'text-sky-950 font-black',
    pageBg: 'bg-sky-50/50 text-slate-950',
    containerClass: 'theme-ocean'
  },
  rose: {
    id: 'rose',
    name: 'Rosa Pastel & Cuidado Maternal',
    emoji: '🌸',
    description: 'Tonos dulces y acogedores pensados para la etapa del embarazo y lactancia.',
    tagline: 'Ternura, calidez y vínculo afectivo',
    previewColors: ['#e11d48', '#fb7185', '#fecdd3', '#fff1f2'],
    bannerGradient: 'from-rose-900 via-pink-900 to-rose-950',
    primaryColor: 'rose',
    accentBg: 'bg-rose-600 hover:bg-rose-700 text-white font-bold',
    cardBorder: 'border-rose-300',
    pillActive: 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs',
    textAccent: 'text-rose-950 font-black',
    pageBg: 'bg-rose-50/40 text-slate-950',
    containerClass: 'theme-rose'
  },
  lavender: {
    id: 'lavender',
    name: 'Lavanda Serena & Sueño',
    emoji: '💜',
    description: 'Violetas relajantes que favorecen la conciliación del sueño infantil y descanso.',
    tagline: 'Armonía y tranquilidad nocturna',
    previewColors: ['#7c3aed', '#a78bfa', '#ddd6fe', '#f5f3ff'],
    bannerGradient: 'from-purple-900 via-indigo-950 to-violet-900',
    primaryColor: 'purple',
    accentBg: 'bg-purple-600 hover:bg-purple-700 text-white font-bold',
    cardBorder: 'border-purple-300',
    pillActive: 'bg-purple-600 text-white border-purple-600 font-bold shadow-xs',
    textAccent: 'text-purple-950 font-black',
    pageBg: 'bg-purple-50/40 text-slate-950',
    containerClass: 'theme-lavender'
  },
  sunset: {
    id: 'sunset',
    name: 'Cálido Atardecer & Sol',
    emoji: '🌅',
    description: 'Ámbar y dorados alegres que estimulan la creatividad y juego en niños de todas las edades.',
    tagline: 'Vitalidad, optimismo y alegría',
    previewColors: ['#d97706', '#fbbf24', '#fde68a', '#fffbeb'],
    bannerGradient: 'from-amber-900 via-orange-900 to-amber-950',
    primaryColor: 'amber',
    accentBg: 'bg-amber-600 hover:bg-amber-700 text-white font-bold',
    cardBorder: 'border-amber-300',
    pillActive: 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs',
    textAccent: 'text-amber-950 font-black',
    pageBg: 'bg-amber-50/40 text-slate-950',
    containerClass: 'theme-sunset'
  },
  dark: {
    id: 'dark',
    name: 'Noche Pediátrica / Modo Oscuro',
    emoji: '🌙',
    description: 'Fondo oscuro de bajo brillo para consultas nocturnas sin deslumbrar a tu bebé.',
    tagline: 'Protección visual y descanso nocturno',
    previewColors: ['#0f172a', '#1e293b', '#334155', '#475569'],
    bannerGradient: 'from-slate-950 via-slate-900 to-slate-950',
    primaryColor: 'slate',
    accentBg: 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black',
    cardBorder: 'border-slate-800',
    pillActive: 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-xs',
    textAccent: 'text-emerald-400',
    pageBg: 'bg-slate-950 text-slate-100',
    containerClass: 'theme-dark dark'
  }
};

interface ThemeContextType {
  config: ThemeConfig;
  currentTheme: ThemeDefinition;
  setTheme: (theme: AppThemeId) => void;
  setFontSize: (fontSize: AppFontSizeId) => void;
  setAutoReadVoice: (autoRead: boolean) => void;
  setSpeechRate: (rate: number) => void;
  setVoicePitch: (pitch: number) => void;
  setVoiceMascot: (mascot: 'froggi' | 'pandita' | 'monito' | 'caracolito') => void;
  setPreferredVoiceURI: (uri: string | null) => void;
  setSingingMelodyEnabled: (enabled: boolean) => void;
  setSoundEffects: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
  setColorBlindMode: (mode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia') => void;
  updateConfig: (updates: Partial<ThemeConfig>) => void;
  isSpeaking: boolean;
  isSinging: boolean;
  currentSingingLine: string | null;
  currentSingingSection: string | null;
  availableVoices: SpeechSynthesisVoice[];
  speakText: (text: string, onEnd?: () => void, customMascot?: 'froggi' | 'pandita' | 'monito' | 'caracolito') => void;
  singSong: (song: SongDataToSing, options?: SongSingingOptions) => void;
  stopSpeaking: () => void;
  stopSinging: () => void;
  playUiSound: (type?: 'click' | 'success' | 'alert' | 'pop') => void;
}

const STORAGE_KEY = 'amigos_unidos_theme_config_v4';

const DEFAULT_CONFIG: ThemeConfig = {
  theme: 'pastel_yellow',
  fontSize: 'normal',
  autoReadVoice: false,
  speechRate: 1.0,
  voicePitch: 1.05,
  voiceMascot: 'froggi',
  preferredVoiceURI: undefined,
  singingMelodyEnabled: true,
  soundEffects: true,
  highContrast: false,
  colorBlindMode: 'none'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Error reading theme config:', e);
    }
    return DEFAULT_CONFIG;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSinging, setIsSinging] = useState(false);
  const [currentSingingLine, setCurrentSingingLine] = useState<string | null>(null);
  const [currentSingingSection, setCurrentSingingSection] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load available system voices on mount and voice change events
  useEffect(() => {
    const updateVoices = () => {
      const voices = getAllSpanishVoices();
      setAvailableVoices(voices);
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Save config to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Error saving theme config:', e);
    }

    if (config.preferredVoiceURI) {
      setGlobalVoiceURI(config.preferredVoiceURI);
    }

    // Apply document level classes if needed
    const allThemeClasses = [
      'theme-pastel-yellow',
      'theme-emerald',
      'theme-ocean',
      'theme-rose',
      'theme-lavender',
      'theme-sunset',
      'theme-dark',
      'dark',
      'theme-light-mode'
    ];
    allThemeClasses.forEach((c) => document.documentElement.classList.remove(c));

    const activeThemeDef = THEME_DEFINITIONS[config.theme] || THEME_DEFINITIONS.pastel_yellow;
    if (activeThemeDef.containerClass) {
      activeThemeDef.containerClass.split(' ').forEach((c) => {
        if (c) document.documentElement.classList.add(c);
      });
    }

    if (config.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.add('theme-light-mode');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [config]);

  const updateConfig = useCallback((updates: Partial<ThemeConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const setTheme = useCallback((theme: AppThemeId) => {
    updateConfig({ theme });
  }, [updateConfig]);

  const setFontSize = useCallback((fontSize: AppFontSizeId) => {
    updateConfig({ fontSize });
  }, [updateConfig]);

  const setAutoReadVoice = useCallback((autoReadVoice: boolean) => {
    updateConfig({ autoReadVoice });
  }, [updateConfig]);

  const setSpeechRate = useCallback((speechRate: number) => {
    updateConfig({ speechRate });
  }, [updateConfig]);

  const setVoicePitch = useCallback((voicePitch: number) => {
    updateConfig({ voicePitch });
  }, [updateConfig]);

  const setVoiceMascot = useCallback((voiceMascot: 'froggi' | 'pandita' | 'monito' | 'caracolito') => {
    updateConfig({ voiceMascot });
  }, [updateConfig]);

  const setPreferredVoiceURI = useCallback((preferredVoiceURI: string | null) => {
    setGlobalVoiceURI(preferredVoiceURI);
    updateConfig({ preferredVoiceURI: preferredVoiceURI || undefined });
  }, [updateConfig]);

  const setSingingMelodyEnabled = useCallback((singingMelodyEnabled: boolean) => {
    updateConfig({ singingMelodyEnabled });
  }, [updateConfig]);

  const setSoundEffects = useCallback((soundEffects: boolean) => {
    updateConfig({ soundEffects });
  }, [updateConfig]);

  const setHighContrast = useCallback((highContrast: boolean) => {
    updateConfig({ highContrast });
  }, [updateConfig]);

  const setColorBlindMode = useCallback((colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia') => {
    updateConfig({ colorBlindMode });
  }, [updateConfig]);

  // Speech synthesis stop
  const stopSpeaking = useCallback(() => {
    stopAllAudioAndSinging();
    setIsSpeaking(false);
    setIsSinging(false);
    setCurrentSingingLine(null);
    setCurrentSingingSection(null);
  }, []);

  const stopSinging = useCallback(() => {
    stopAllAudioAndSinging();
    setIsSinging(false);
    setCurrentSingingLine(null);
    setCurrentSingingSection(null);
  }, []);

  // Humanized Speech Engine
  const speakText = useCallback(
    (
      text: string,
      onEnd?: () => void,
      customMascot?: 'froggi' | 'pandita' | 'monito' | 'caracolito'
    ) => {
      speakHumanizedText(text, {
        rate: config.speechRate || 1.0,
        pitch: config.voicePitch || 1.05,
        mascot: customMascot || config.voiceMascot || 'froggi',
        voiceURI: config.preferredVoiceURI,
        onStart: () => {
          setIsSpeaking(true);
          setIsSinging(false);
        },
        onEnd: () => {
          setIsSpeaking(false);
          if (onEnd) onEnd();
        },
        onError: () => {
          setIsSpeaking(false);
        }
      });
    },
    [config.speechRate, config.voicePitch, config.voiceMascot, config.preferredVoiceURI]
  );

  // Suno-Style Singing Engine
  const singSong = useCallback(
    (song: SongDataToSing, options: SongSingingOptions = {}) => {
      setIsSinging(true);
      setIsSpeaking(false);

      singSongWithMusic(song, {
        ...options,
        singerMascot: options.singerMascot || config.voiceMascot || 'froggi',
        tempoBpm: options.tempoBpm || song.tempoBpm || 76,
        style: options.style || song.style || 'cancion_cuna',
        onSectionChange: (sec, lineIdx, lineText) => {
          setCurrentSingingSection(sec);
          setCurrentSingingLine(lineText);
          options.onSectionChange?.(sec, lineIdx, lineText);
        },
        onStart: () => {
          setIsSinging(true);
          options.onStart?.();
        },
        onEnd: () => {
          setIsSinging(false);
          setCurrentSingingLine(null);
          setCurrentSingingSection(null);
          options.onEnd?.();
        },
        onError: (err) => {
          setIsSinging(false);
          setCurrentSingingLine(null);
          setCurrentSingingSection(null);
          options.onError?.(err);
        }
      });
    },
    [config.voiceMascot]
  );

  // Web Audio UI Sound generator
  const playUiSound = useCallback((type: 'click' | 'success' | 'alert' | 'pop' = 'click') => {
    if (!config.soundEffects || typeof window === 'undefined') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } else if (type === 'success') {
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.2);
        });
      } else if (type === 'alert') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.setValueAtTime(240, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch (e) {
      // Audio context might be restricted before user interaction
    }
  }, [config.soundEffects]);

  const currentTheme = THEME_DEFINITIONS[config.theme] || THEME_DEFINITIONS.emerald;

  return (
    <ThemeContext.Provider
      value={{
        config,
        currentTheme,
        setTheme,
        setFontSize,
        setAutoReadVoice,
        setSpeechRate,
        setVoicePitch,
        setVoiceMascot,
        setPreferredVoiceURI,
        setSingingMelodyEnabled,
        setSoundEffects,
        setHighContrast,
        setColorBlindMode,
        updateConfig,
        isSpeaking,
        isSinging,
        currentSingingLine,
        currentSingingSection,
        availableVoices,
        speakText,
        singSong,
        stopSpeaking,
        stopSinging,
        playUiSound
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

