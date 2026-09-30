import React, { useState } from 'react';
import { useTheme, THEME_DEFINITIONS } from '../context/ThemeContext';
import { AppThemeId, AppFontSizeId } from '../types';
import { useFamily } from '../context/FamilyContext';
import { FroggiAvatar, PanditaAvatar, MonitoAvatar, CaracolitoAvatar } from './MascotSVGs';
import {
  Palette,
  Volume2,
  VolumeX,
  Type,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  Eye,
  Sliders,
  Play,
  Square,
  RotateCcw,
  Zap,
  Info,
  Layers,
  Heart,
  Baby,
  Cpu,
  BookmarkCheck,
  Music,
  Radio,
  Mic
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
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
    isSpeaking,
    isSinging,
    availableVoices,
    speakText,
    singSong,
    stopSpeaking,
    stopSinging,
    playUiSound
  } = useTheme();

  const { activeChild, historyRecords } = useFamily();
  const [activeTab, setActiveTab] = useState<'themes' | 'audio' | 'text' | 'ai'>('themes');
  const [testVoiceText, setTestVoiceText] = useState('¡Hola! Soy Froggi. Estoy aquí para acompañarte con amor y ciencia en cada paso del crecimiento de tu familia.');
  const [saveToast, setSaveToast] = useState(false);

  if (!isOpen) return null;

  const handleSelectTheme = (themeId: AppThemeId) => {
    setTheme(themeId);
    playUiSound('pop');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleTestVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(testVoiceText);
    }
  };

  const handleTestSinging = () => {
    if (isSinging) {
      stopSinging();
    } else {
      playUiSound('success');
      singSong({
        title: 'Canción de Cuna Suno Froggi',
        style: 'cancion_cuna',
        tempoBpm: 76,
        lyrics: {
          verse1: 'Duérmete mi niño, duérmete mi amor.\nLas estrellitas brillan con su gran fulgor.',
          chorus: 'Cierra los ojitos, sueña con el sol.\nFroggi te acompaña con todo su corazón.',
          outro: 'Que descanses bien, hasta el amanecer.'
        }
      });
    }
  };

  const themeList = Object.values(THEME_DEFINITIONS);

  return (
    <div
      id="settings-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
    >
      <div
        id="settings-modal-container"
        className={`w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border transition-colors duration-200 flex flex-col max-h-[92vh] ${
          config.theme === 'dark'
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header with Dynamic Theme Banner */}
        <div className={`p-5 sm:p-6 text-white bg-gradient-to-r ${currentTheme.bannerGradient} flex items-center justify-between`}>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 shrink-0 shadow-sm">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                  Configuración & Personalización
                </span>
                <span className="text-xs bg-emerald-400/30 text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                  {currentTheme.emoji} {currentTheme.name}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-1">
                Ajustes de Interfaz & Temas
              </h2>
              <p className="text-xs text-white/80">
                Personaliza la estética visual, la lectura por voz y la accesibilidad de Amigos Unidos.
              </p>
            </div>
          </div>

          <button
            id="close-settings-modal-btn"
            onClick={() => {
              playUiSound('click');
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer border border-white/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={`flex border-b px-4 sm:px-6 gap-2 sm:gap-4 overflow-x-auto text-xs font-bold shrink-0 ${
          config.theme === 'dark' ? 'border-slate-800 bg-slate-950/60' : 'border-slate-100 bg-slate-50/80'
        }`}>
          {[
            { id: 'themes', label: '🎨 Temas & Colores', desc: '6 Paletas visuales' },
            { id: 'audio', label: '🔊 Audio & Voz IA', desc: 'TTS y velocidad' },
            { id: 'text', label: '🔤 Texto & Accesibilidad', desc: 'Tamaño y contraste' },
            { id: 'ai', label: '⚡ Motor IA & Datos', desc: 'Gemini & Visión' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playUiSound('click');
                setActiveTab(tab.id as any);
              }}
              className={`py-3.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? config.theme === 'dark'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-emerald-600 text-emerald-800'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* ======================================================== */}
          {/* TAB 1: THEMES & COLOR PALETTES */}
          {/* ======================================================== */}
          {activeTab === 'themes' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold flex items-center gap-2">
                  <Palette className="w-4 h-4 text-emerald-600" />
                  <span>Selecciona la Paleta Visual de la Plataforma:</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  El tema seleccionado cambiará instantáneamente los colores de la navegación, botones, tarjetas e identidad visual.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {themeList.map((t) => {
                  const isSelected = config.theme === t.id;
                  return (
                    <button
                      key={t.id}
                      id={`theme-btn-${t.id}`}
                      onClick={() => handleSelectTheme(t.id)}
                      className={`p-4 rounded-3xl text-left border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                        isSelected
                          ? config.theme === 'dark'
                            ? 'bg-slate-800 border-emerald-400 ring-2 ring-emerald-400/30 shadow-lg'
                            : 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                          : config.theme === 'dark'
                          ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {/* Top Header of Card */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{t.emoji}</span>
                          {isSelected && (
                            <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                              <Check className="w-3 h-3" />
                              <span>Activo</span>
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="font-black text-sm">{t.name}</h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                            {t.description}
                          </p>
                        </div>
                      </div>

                      {/* Color Swatch Bars */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                          <span>Muestra de Color:</span>
                          <span className="text-[10px] uppercase font-mono">{t.id}</span>
                        </div>
                        <div className="flex gap-1 h-3 rounded-full overflow-hidden p-0.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          {t.previewColors.map((color, idx) => (
                            <div
                              key={idx}
                              className="flex-1 h-full rounded-full transition-transform group-hover:scale-105"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Live Preview Showcase Box */}
              <div className={`p-4 rounded-3xl border space-y-3 ${
                config.theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">
                    Vista Previa del Tema Actual:
                  </span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {currentTheme.name}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button className={`px-4 py-2 rounded-2xl text-xs font-black shadow-sm ${currentTheme.accentBg}`}>
                    Botón Primario
                  </button>
                  <button className={`px-4 py-2 rounded-2xl text-xs font-bold border ${currentTheme.cardBorder} ${
                    config.theme === 'dark' ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-700'
                  }`}>
                    Botón Secundario
                  </button>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentTheme.pillActive}`}>
                    Insignia Activa
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: AUDIO, VOICE & SUNO-STYLE SINGING */}
          {/* ======================================================== */}
          {activeTab === 'audio' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>Configuración de Lectura por Voz (TTS) & Canto IA:</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Personaliza cómo Froggi y sus amigos leen las respuestas médicas en voz alta y cantan canciones infantiles al estilo Suno.
                </p>
              </div>

              {/* Auto Read Toggle */}
              <div className={`p-4 rounded-3xl border flex items-center justify-between gap-4 ${
                config.theme === 'dark' ? 'bg-slate-800/60 border-slate-700' : 'bg-emerald-50/60 border-emerald-200'
              }`}>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-sm">Lectura Automática de Respuestas (Web Speech API)</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Al recibir una respuesta médica o consejo de Froggi, la IA leerá el texto en voz alta de manera humanizada.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={config.autoReadVoice}
                    onChange={(e) => {
                      setAutoReadVoice(e.target.checked);
                      playUiSound('click');
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Suno-Style Singing Toggle */}
              <div className={`p-4 rounded-3xl border flex items-center justify-between gap-4 ${
                config.theme === 'dark' ? 'bg-purple-950/40 border-purple-800/60' : 'bg-purple-50/70 border-purple-200'
              }`}>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-purple-600" />
                    <span className="font-bold text-sm">Canto Melódico Infantil Estilo Suno</span>
                    <span className="text-[10px] bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full font-extrabold">
                      🎵 Suno-Style
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Genera acompañamiento instrumental con arpegios, campanas y voz cantada ritmada para canciones de cuna y rutinas.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={config.singingMelodyEnabled ?? true}
                    onChange={(e) => {
                      setSingingMelodyEnabled(e.target.checked);
                      playUiSound('click');
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {/* Mascot Voice Personality Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Personalidad & Tono de Voz:</span>
                  </span>
                  <span className="text-[11px] text-slate-400 capitalize">
                    {config.voiceMascot || 'froggi'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'froggi' as const, name: 'Froggi', role: 'Voz Cálida y Pediátrica', avatar: <FroggiAvatar size={28} /> },
                    { id: 'pandita' as const, name: 'Pandita', role: 'Voz Suave de Cuna', avatar: <PanditaAvatar size={28} /> },
                    { id: 'monito' as const, name: 'Monito', role: 'Voz Alegre y Rítmica', avatar: <MonitoAvatar size={28} /> },
                    { id: 'caracolito' as const, name: 'Caracolito', role: 'Voz Zen y Relajante', avatar: <CaracolitoAvatar size={28} /> },
                  ].map((m) => {
                    const isSelected = (config.voiceMascot || 'froggi') === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setVoiceMascot(m.id);
                          playUiSound('click');
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-md font-bold'
                            : config.theme === 'dark'
                            ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-700 text-slate-200'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          {m.avatar}
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div>
                          <div className="font-black text-xs">{m.name}</div>
                          <div className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                            {m.role}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* System Spanish Voices Selector (if multiple available) */}
              {availableVoices.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Motor de Voz en Español del Dispositivo:</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {availableVoices.length} voces detectadas
                    </span>
                  </label>
                  <select
                    value={config.preferredVoiceURI || ''}
                    onChange={(e) => {
                      setPreferredVoiceURI(e.target.value || null);
                      playUiSound('click');
                    }}
                    className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-hidden"
                  >
                    <option value="">✨ Selección Automática Óptima (Neural / Natural Spanish)</option>
                    {availableVoices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Speech Rate Controls */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    Velocidad de Lectura por Voz:
                  </span>
                  <span className="font-mono font-black text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full text-xs">
                    {config.speechRate}x
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[
                    { rate: 0.8, label: '0.8x Lento', desc: 'Calmado' },
                    { rate: 1.0, label: '1.0x Normal', desc: 'Recomendado' },
                    { rate: 1.2, label: '1.2x Ágil', desc: 'Dinámico' },
                    { rate: 1.5, label: '1.5x Rápido', desc: 'Eficiente' },
                  ].map((item) => (
                    <button
                      key={item.rate}
                      onClick={() => {
                        setSpeechRate(item.rate);
                        playUiSound('click');
                      }}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        config.speechRate === item.rate
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                          : config.theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold">{item.label}</div>
                      <div className="text-[10px] opacity-75">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sound Effects Toggle */}
              <div className={`p-4 rounded-3xl border flex items-center justify-between gap-4 ${
                config.theme === 'dark' ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="space-y-0.5">
                  <span className="font-bold text-sm">Efectos de Sonido e Interfaz</span>
                  <p className="text-xs text-slate-500">
                    Sonidos agradables de confirmación al presionar botones y registrar datos.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={config.soundEffects}
                    onChange={(e) => {
                      setSoundEffects(e.target.checked);
                      if (e.target.checked) playUiSound('success');
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Interactive Dual Tester (Spoken Voice + Suno Singing) */}
              <div className={`p-4 rounded-3xl border space-y-3.5 ${
                config.theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-3">
                  <FroggiAvatar size={38} />
                  <div className="flex-1">
                    <span className="font-bold text-xs block">Probar Voz de Froggi & Suno Melodía:</span>
                    <input
                      type="text"
                      value={testVoiceText}
                      onChange={(e) => setTestVoiceText(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 mt-1 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                  {(isSpeaking || isSinging) && (
                    <button
                      onClick={() => {
                        stopSpeaking();
                        stopSinging();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Detener Audio</span>
                    </button>
                  )}

                  {/* Spoken Voice Test */}
                  <button
                    id="test-froggi-voice-btn"
                    onClick={handleTestVoice}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isSpeaking
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSpeaking ? 'Leyendo en Voz Alta...' : '🗣️ Probar Voz Hablada'}</span>
                  </button>

                  {/* Suno Singing Test */}
                  <button
                    id="test-suno-singing-btn"
                    onClick={handleTestSinging}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      isSinging
                        ? 'bg-purple-600 text-white animate-pulse'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xs'
                    }`}
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>{isSinging ? '🎵 Cantando Melodía Suno...' : '🎵 Probar Canto Infantil (Suno)'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: TEXT & ACCESSIBILITY */}
          {/* ======================================================== */}
          {activeTab === 'text' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold flex items-center gap-2">
                  <Type className="w-4 h-4 text-emerald-600" />
                  <span>Tamaño de Texto & Accesibilidad Visual:</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Ajusta la escala tipográfica para facilitar la lectura de indicaciones clínicas y dosis médicas.
                </p>
              </div>

              {/* Font Size Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'normal' as AppFontSizeId, label: 'Normal (100%)', sample: 'Texto estándar para dispositivos móviles y monitores.' },
                  { id: 'comfortable' as AppFontSizeId, label: 'Cómodo (110%)', sample: 'Ideal para lectura relajada sin cansar la vista.' },
                  { id: 'large' as AppFontSizeId, label: 'Grande (125%)', sample: 'Máxima legibilidad para consulta rápida de signos de alerta.' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setFontSize(item.id);
                      playUiSound('click');
                    }}
                    className={`p-4 rounded-3xl border text-left transition-all cursor-pointer ${
                      config.fontSize === item.id
                        ? 'bg-emerald-50/80 dark:bg-slate-800 border-emerald-500 ring-2 ring-emerald-500/20 font-bold shadow-xs'
                        : config.theme === 'dark'
                        ? 'bg-slate-900 border-slate-800 hover:bg-slate-800'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-extrabold text-sm">{item.label}</span>
                      {config.fontSize === item.id && <Check className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className={`text-slate-500 leading-snug ${
                      item.id === 'large' ? 'text-sm' : item.id === 'comfortable' ? 'text-xs' : 'text-[11px]'
                    }`}>
                      {item.sample}
                    </p>
                  </button>
                ))}
              </div>

              {/* High Contrast Toggle */}
              <div className={`p-4 rounded-3xl border flex items-center justify-between gap-4 ${
                config.theme === 'dark' ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="space-y-0.5">
                  <span className="font-bold text-sm">Modo de Alto Contraste</span>
                  <p className="text-xs text-slate-500">
                    Acentúa los bordes, divisores y sombras para mejorar la visibilidad con luz solar directa.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={config.highContrast}
                    onChange={(e) => {
                      setHighContrast(e.target.checked);
                      playUiSound('click');
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Color Blindness Filters */}
              <div className="space-y-2">
                <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
                  Filtro de Asistencia para Daltonismo:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'none', label: 'Estándar', desc: 'Colores regulares' },
                    { id: 'protanopia', label: 'Protanopia', desc: 'Rojo-Verde' },
                    { id: 'deuteranopia', label: 'Deuteranopia', desc: 'Verde débil' },
                    { id: 'tritanopia', label: 'Tritanopia', desc: 'Azul-Amarillo' },
                  ].map((cb) => (
                    <button
                      key={cb.id}
                      onClick={() => {
                        setColorBlindMode(cb.id as any);
                        playUiSound('click');
                      }}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        config.colorBlindMode === cb.id
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                          : config.theme === 'dark'
                          ? 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold">{cb.label}</div>
                      <div className="text-[10px] opacity-75">{cb.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: AI ENGINE & DATA STATUS */}
          {/* ======================================================== */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  <span>Estado del Motor de Inteligencia Artificial:</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Información sobre la integración con Gemini, modelos de visión médica y datasets clínicos.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className={`p-4 rounded-3xl border space-y-2 ${
                  config.theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2 text-emerald-600 font-black">
                    <Zap className="w-4 h-4" />
                    <span>Gemini 3.7 Flash Integrado</span>
                  </div>
                  <p className="text-slate-500">
                    Procesa consultas clínicas, generación de cuentos interactivos, síntesis de canciones y cartas mágicas en servidor seguro.
                  </p>
                </div>

                <div className={`p-4 rounded-3xl border space-y-2 ${
                  config.theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2 text-teal-600 font-black">
                    <Eye className="w-4 h-4" />
                    <span>Visión Multimodal de Triaje</span>
                  </div>
                  <p className="text-slate-500">
                    Inspección visual directa de fotos de piel capturadas con cámara o subidas como archivo, identificando partes anatómicas y morfología.
                  </p>
                </div>
              </div>

              {/* Data & History Records */}
              <div className={`p-4 rounded-3xl border space-y-3 ${
                config.theme === 'dark' ? 'bg-slate-800/30 border-slate-700' : 'bg-emerald-50/50 border-emerald-200'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center gap-1.5">
                    <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                    <span>Expediente Clínico Familiar</span>
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full text-[11px]">
                    {historyRecords.length} registros guardados
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Tus datos se almacenan de forma segura y privada para el seguimiento médico continuo de {activeChild?.name || 'tu peque'}.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Confirmation Toast */}
        <div className={`p-4 sm:p-5 border-t flex items-center justify-between gap-3 shrink-0 ${
          config.theme === 'dark' ? 'border-slate-800 bg-slate-950' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            {saveToast && (
              <span className="inline-flex items-center gap-1 bg-emerald-500 text-white font-bold px-3 py-1 rounded-full text-xs animate-in fade-in duration-150">
                <Check className="w-3.5 h-3.5" />
                ¡Tema aplicado con éxito!
              </span>
            )}
          </div>

          <button
            onClick={() => {
              playUiSound('click');
              onClose();
            }}
            className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm transition-all shadow-sm cursor-pointer active:scale-95"
          >
            Guardar & Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
