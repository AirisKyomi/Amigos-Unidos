import React, { useState, useRef, useEffect } from 'react';
import { AgeBracket, ChatMessage } from '../types';
import { useFamily } from '../context/FamilyContext';
import { useTheme } from '../context/ThemeContext';
import { FroggiAvatar, PanditaAvatar, MonitoAvatar, CaracolitoAvatar } from './MascotSVGs';
import { findPediatricKnowledge } from '../data/pediatricKnowledgeBase';
import { speakText, stopSpeech, isSpeechSupported, playEmergencyAlarmSound } from '../utils/speechSynthesis';
import {
  orchestratePediatricPrompt,
  stripMarkdownAndAsterisks,
  PEDIATRIC_AGE_CONTEXTS,
} from '../utils/promptOrchestrator';
import { isEmergencyMessage, checkUrgencyKeywords } from '../utils/emergencyDetection';

/**
 * Procesa la respuesta de la IA en el chat para priorizar la respuesta directa al usuario,
 * eliminando resúmenes de fuentes, bibliografía y metadatos técnicos.
 */
export function extractDirectUserResponse(rawText: string): string {
  if (!rawText) return '';

  let cleaned = stripMarkdownAndAsterisks(rawText);

  // 1. Eliminar bloques finales o intermedios de resumen de fuentes o bibliografía
  // (e.g., "Fuentes:", "Resumen de fuentes:", "Referencias:", "Bibliografía:", "Sources:", etc.)
  cleaned = cleaned.replace(
    /(?:\n\s*|\r\n\s*|^)(?:#{1,6}\s*)?(?:Fuentes(?:\s+consultadas|\s+bibliográficas|\s+médicas|\s+oficiales)?|Resumen\s+de\s+fuentes|Referencias(?:\s+bibliográficas|\s+médicas|\s+consultadas)?|Bibliografía|Sources|References)\s*:[^]*$/i,
    ''
  );

  // 2. Eliminar secciones de metadatos técnicos, algoritmos o telemetría
  // (e.g., "Metadatos técnicos:", "Telemetría:", "Algoritmo genético:", "Modelo:", "Fitness score:", etc.)
  cleaned = cleaned.replace(
    /(?:\n\s*|\r\n\s*|^)(?:#{1,6}\s*)?(?:Metadatos(?:\s+técnicos)?|Technical\s+metadata|Telemetría|Algoritmo\s+genético|Fitness\s+score|Modelo\s+usado|Latency)\s*:[^]*$/i,
    ''
  );

  // 3. Eliminar etiquetas o citas entre corchetes o paréntesis con fuentes o metadatos
  // (e.g., [Fuente: OMS], (Fuentes: AAP), [Modelo: gemini-3.1-flash-lite], (Metadatos: ...))
  cleaned = cleaned.replace(/\[(?:Fuentes?|Referencias?|Source|Metadata|Metadatos|Modelo)[^\]]*\]/gi, '');
  cleaned = cleaned.replace(/\((?:Fuentes?|Referencias?|Source|Metadata|Metadatos|Modelo):[^\)]*\)/gi, '');

  // 4. Eliminar líneas de atribuciones genéricas al final si quedaron huérfanas
  cleaned = cleaned.replace(/\n\s*•?\s*(?:Organización Mundial de la Salud|American Academy of Pediatrics|UNICEF ECDI|AIEPI|CDC Guidelines)[^\n]*/gi, '');

  // 5. Normalizar espaciado y saltos de línea para lectura fluida
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

  return cleaned;
}
import {
  Send,
  Sparkles,
  AlertCircle,
  AlertTriangle,
  Volume2,
  VolumeX,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  Info,
  HeartHandshake,
  UserCheck,
  Play,
  Square,
  Settings2,
  Sliders,
  Palette,
  CheckCircle2
} from 'lucide-react';

interface FroggiChatProps {
  selectedAge: AgeBracket;
  onOpenSettingsModal?: () => void;
  onOpenEmergencyModal?: () => void;
}

const AGE_PROMPTS: Record<AgeBracket, string[]> = {
  '0-12m': [
    '¿Cómo calmar el cólico del lactante con las 5S de la AAP?',
    'Mi bebé tiene 6 meses: ¿Cómo iniciar Alimentación Complementaria / BLW seguro?',
    '¿Cuántas horas debe dormir un recién nacido según la OMS?',
    '¿Cuáles son las vacunas obligatorias de los 2 y 4 meses?'
  ],
  '1-3y': [
    'Mi hijo de 2 años tiene berrinches intensos: ¿Cómo gestionarlos con Pandita?',
    '¿Cuándo y cómo iniciar la retirada respetuosa del pañal?',
    'Juegos de psicomotricidad de Monito para caminar y saltar con seguridad',
    'Apenas dice 10 palabras a los 20 meses: ¿Es normal según UNICEF?'
  ],
  '4-6y': [
    'Actividades de SmartLearn Preschool para aprender a contar y trazar',
    'Pesadillas nocturnas o miedos a la oscuridad: Rutinas de Caracolito',
    'Nutrición y loncheras saludables recomendadas por la OMS para preescolar',
    '¿Cómo fomentar la autonomía y el vestido independiente?'
  ],
  '7-10y+': [
    'Mi hijo tiene 10 años y le duelen las piernas de noche: ¿Son dolores de crecimiento?',
    'Pubertad a los 10-12 años: ¿Cómo hablar sobre los cambios corporales?',
    'Acné y primeros granitos a los 10+ años: ¿Qué rutina facial seguir?',
    'Manejo del tiempo de pantallas (AAP) y rendimiento escolar en niños de 10 años'
  ]
};

export const FroggiChat: React.FC<FroggiChatProps> = ({ selectedAge, onOpenSettingsModal, onOpenEmergencyModal }) => {
  const { activeChild } = useFamily();
  const { config, currentTheme, setAutoReadVoice, playUiSound } = useTheme();
  const childAgeYears = activeChild ? (activeChild.ageMonths / 12).toFixed(1) : null;
  const childDisplayAge = activeChild 
    ? (activeChild.ageMonths >= 24 ? `${Math.floor(activeChild.ageMonths / 12)} años` : `${activeChild.ageMonths} meses`)
    : null;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'froggi',
      text: `¡Hola familia! 🐸 Soy Froggi, la ranita pediatra de Amigos Unidos.\n\nEstoy aquí para responder de forma directa y clara a tus dudas de salud y crianza para todas las etapas, desde recién nacidos hasta niños de 10 años o más.\n\n${
        activeChild
          ? `Consulta activa para ${activeChild.name} (${childDisplayAge}). Pregúntame lo que necesites y te daré orientación médica inmediata.`
          : `Actualmente tienes seleccionada la etapa de ${
              selectedAge === '0-12m'
                ? '0 a 12 meses (Lactantes y Recién Nacidos)'
                : selectedAge === '1-3y'
                ? '1 a 3 años (Primera Infancia)'
                : selectedAge === '4-6y'
                ? '4 a 6 años (Etapa Preescolar)'
                : '7 a 10+ años (Escolares Mayores y Preadolescentes)'
            }.`
      }\n\n¿En qué puedo ayudarte hoy? Escríbeme tu pregunta y te daré una respuesta directa. ¡Si es una urgencia o caso grave, puedes consultar los protocolos de inmediato!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      alertLevel: 'normal'
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const cleanAsterisks = (text: string) => {
    if (!text) return '';
    return text.replace(/\*\*/g, '').replace(/\*/g, '');
  };

  const handleReadAloud = (text: string, msgId: string) => {
    if (isSpeaking && currentSpeakingId === msgId) {
      stopSpeech();
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
      return;
    }

    stopSpeech();
    setIsSpeaking(true);
    setCurrentSpeakingId(msgId);

    speakText(stripMarkdownAndAsterisks(text), {
      rate: config.speechRate || 1.0,
      pitch: config.voicePitch || 1.05,
      mascot: config.voiceMascot || 'froggi',
      voiceURI: config.preferredVoiceURI,
      onStart: () => {
        setIsSpeaking(true);
        setCurrentSpeakingId(msgId);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setCurrentSpeakingId(null);
      },
      onError: () => {
        setIsSpeaking(false);
        setCurrentSpeakingId(null);
      }
    });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    playUiSound('click');

    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      setCurrentSpeakingId(null);
    }

    const cleanedUserQuery = stripMarkdownAndAsterisks(query.trim());
    // Filtro lógico que detecta palabras clave de urgencia (urgente, dolor, emergencia) y signos clínicos
    const isEmergencyQuery = checkUrgencyKeywords(cleanedUserQuery) || isEmergencyMessage(cleanedUserQuery);

    if (isEmergencyQuery) {
      playEmergencyAlarmSound();
      onOpenEmergencyModal?.();
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: cleanedUserQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    const effectiveAgeParam = activeChild
      ? `${activeChild.name} (${childDisplayAge}, ${activeChild.ageMonths} meses)`
      : selectedAge;

    // Orchestrate prompt explicitly with clinical context
    const orchestrated = orchestratePediatricPrompt({
      userQuery: cleanedUserQuery,
      ageBracket: selectedAge,
      childName: activeChild?.name,
      exactAgeText: activeChild ? `${childDisplayAge} (${activeChild.ageMonths} meses)` : undefined,
      conversationHistory: messages.slice(-4),
    });

    try {
      const response = await fetch('/api/pediatric-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanedUserQuery,
          childAge: effectiveAgeParam,
          model: 'gemini-3.6-flash',
          orchestratedPrompt: orchestrated.structuredPrompt,
          context: `Consulta pediátrica para ${effectiveAgeParam}. Responde directo a la pregunta planteada sin rodeos ni asteriscos. Recuerda que la familia puede estar en Colombia (Emergencias: Línea 123).`,
          history: messages.slice(-4),
        }),
      });

      if (!response.ok) {
        throw new Error('Respuesta inválida del servidor');
      }

      const data = await response.json();
      const botMsgId = `froggi-${Date.now()}`;
      
      // Priorizar respuesta directa al usuario eliminando resumen de fuentes o metadatos técnicos
      const pristineReply = extractDirectUserResponse(data.reply || '');

      // Filtro lógico de urgencia evaluando la consulta y la respuesta generada
      const isUrgent = isEmergencyQuery || data.isEmergencyQuery === true || checkUrgencyKeywords(pristineReply) || isEmergencyMessage(pristineReply);

      // Desplegar modal de triaje y activar alerta sonora si se detecta urgencia
      if (isUrgent && !isEmergencyQuery) {
        playEmergencyAlarmSound();
        onOpenEmergencyModal?.();
      }

      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: 'froggi',
        text: pristineReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        alertLevel: isUrgent ? 'urgent' : 'normal',
      };

      setMessages((prev) => [...prev, botMsg]);

      // Auto-read response with natural voice if enabled in ThemeConfig
      if (config.autoReadVoice) {
        setTimeout(() => {
          handleReadAloud(botMsg.text, botMsgId);
        }, 150);
      }
    } catch (err: any) {
      console.error('Error al consultar a Froggi:', err);
      const effectiveAgeLabel = activeChild ? `${activeChild.name} (${childDisplayAge})` : (selectedAge === '7-10y+' ? 'niños de 7 a 10+ años' : selectedAge);
      const matchedKnowledge = findPediatricKnowledge(query, selectedAge);

      // Priorizar respuesta directa al usuario sin resúmenes de fuentes ni metadatos técnicos
      let directReply = '';
      if (matchedKnowledge) {
        directReply = `${matchedKnowledge.clinicalSummary}\n\n`;
        if (matchedKnowledge.actionSteps && matchedKnowledge.actionSteps.length > 0) {
          directReply += `Pasos recomendados:\n${matchedKnowledge.actionSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n`;
        }
        if (matchedKnowledge.alarmSigns && matchedKnowledge.alarmSigns.length > 0) {
          directReply += `Signos de alarma:\n${matchedKnowledge.alarmSigns.map(a => `• ${a}`).join('\n')}`;
        }
      } else {
        directReply = `Para ${effectiveAgeLabel}:\n\n1. Evaluación: Monitorea el estado general, hidratación y ánimo acordes a la edad.\n2. Cuidados: Mantén rutinas consistentes de alimentación y descanso.\n3. Acompañamiento: Brinda contención afectiva y consulta a tu pediatra de cabecera ante cualquier síntoma persistente.`;
      }

      const pristineFallback = extractDirectUserResponse(directReply);
      const fallbackMsgId = `froggi-fallback-${Date.now()}`;
      const isUrgentFallback = isEmergencyQuery || checkUrgencyKeywords(pristineFallback) || isEmergencyMessage(pristineFallback);

      if (isUrgentFallback && !isEmergencyQuery) {
        playEmergencyAlarmSound();
        onOpenEmergencyModal?.();
      }

      const fallbackMsg: ChatMessage = {
        id: fallbackMsgId,
        sender: 'froggi',
        text: pristineFallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        alertLevel: isUrgentFallback ? 'urgent' : 'normal',
      };
      setMessages((prev) => [...prev, fallbackMsg]);

      if (config.autoReadVoice) {
        setTimeout(() => {
          handleReadAloud(fallbackMsg.text, fallbackMsgId);
        }, 150);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    stopSpeech();
    setIsSpeaking(false);
    setCurrentSpeakingId(null);
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'froggi',
        text: `¡Chat reiniciado! 🐸 Estoy listo para responder tus dudas sobre tu peque en etapa ${selectedAge}. Escribe lo que necesites.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        alertLevel: 'normal'
      }
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Welcome Mascot Banner */}
      <div className={`rounded-3xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden bg-gradient-to-r ${currentTheme.bannerGradient}`}>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-2 rounded-2xl backdrop-blur-xs border border-white/30">
              <FroggiAvatar size={68} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/25 text-emerald-200 text-xs font-bold mb-1 backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Consulta Médica Infantil Oficial • Amigos Unidos
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                Consulta Pediátrica Inteligente con Froggi
              </h2>
              <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-xl">
                Respuestas inmediatas sobre lactancia, fiebres, nutrición, hitos motores y crianza, con lectura por voz en audio natural de todas las pautas de OMS, AAP y UNICEF.
              </p>
            </div>
          </div>

          {/* Voice Settings & Quick Customizer */}
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20">
            <button
              type="button"
              onClick={() => {
                setAutoReadVoice(!config.autoReadVoice);
                playUiSound('click');
              }}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                config.autoReadVoice ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-white/20 text-white'
              }`}
              title="Activar/Desactivar lectura automática de respuestas"
            >
              {config.autoReadVoice ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            
            <div className="text-left text-xs">
              <span className="text-[11px] font-bold block text-white/90">
                Lectura {config.autoReadVoice ? 'Automática' : 'Manual'}
              </span>
              <span className="text-[10px] text-white/70">
                Velocidad: {config.speechRate}x
              </span>
            </div>

            {onOpenSettingsModal && (
              <button
                type="button"
                onClick={() => {
                  playUiSound('click');
                  onOpenSettingsModal();
                }}
                className="ml-1 p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
                title="Ajustar tema visual, audio y accesibilidad"
              >
                <Palette className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className={`rounded-3xl border shadow-sm overflow-hidden flex flex-col h-[640px] ${
        config.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* Chat Header Actions */}
        <div className={`px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b ${
          config.theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Orientación Médica Infantil</span>
            </div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Etapa: <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{PEDIATRIC_AGE_CONTEXTS[selectedAge]?.ageSpan || '0-10+ años'}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={config.autoReadVoice}
                onChange={(e) => setAutoReadVoice(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
              />
              <span className="hidden sm:inline">Leer respuestas automáticamente</span>
            </label>

            <button
              id="reset-chat-btn"
              onClick={resetChat}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar Chat</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 ${
          config.theme === 'dark' ? 'bg-slate-950/50' : 'bg-slate-50/50'
        }`}>
          {messages.map((msg) => {
            const isFroggi = msg.sender === 'froggi';
            const isCurrentlySpeakingThis = isSpeaking && currentSpeakingId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isFroggi ? 'justify-start' : 'justify-end'}`}
              >
                {isFroggi && (
                  <div className="shrink-0 mt-1">
                    <FroggiAvatar size={38} />
                  </div>
                )}

                <div
                  className={`max-w-[88%] sm:max-w-[82%] rounded-3xl p-4 sm:p-5 shadow-xs ${
                    isFroggi
                      ? msg.alertLevel === 'urgent'
                        ? 'bg-rose-50 text-slate-900 border-2 border-rose-400 shadow-md'
                        : msg.alertLevel === 'caution'
                        ? 'bg-amber-50 text-slate-800 border-2 border-amber-300'
                        : config.theme === 'dark'
                        ? 'bg-slate-800 text-slate-100 border border-slate-700'
                        : 'bg-white text-slate-800 border border-emerald-100'
                      : `${currentTheme.accentBg} rounded-br-none`
                  }`}
                >
                  {/* Froggi badge & Audio button */}
                  {isFroggi && (
                    <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">Froggi Pediatra</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                          Evidencia Médica
                        </span>
                      </div>

                      <button
                        onClick={() => handleReadAloud(msg.text, msg.id)}
                        title={isCurrentlySpeakingThis ? 'Detener lectura de audio' : 'Escuchar respuesta con voz de Froggi'}
                        className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                          isCurrentlySpeakingThis
                            ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 animate-pulse'
                            : config.theme === 'dark'
                            ? 'bg-slate-700 text-emerald-300 hover:bg-slate-600'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {isCurrentlySpeakingThis ? (
                          <>
                            <Square className="w-3.5 h-3.5 fill-current" />
                            <span>Pausar Voz</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>🔊 Escuchar</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Message body with clear typography */}
                  <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans text-slate-900 dark:text-slate-100">
                    {msg.text}
                  </div>

                  {/* Acceso Directo de Urgencias si el caso es grave o de urgencia */}
                  {isFroggi && msg.alertLevel === 'urgent' && (
                    <div className="mt-3.5 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/90 border-2 border-rose-500 shadow-md">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-rose-950 dark:text-rose-200 font-black text-xs sm:text-sm">
                            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 animate-bounce shrink-0" />
                            <span>ALERTA DE URGENCIA ACTIVADA</span>
                          </div>
                          <p className="text-xs text-rose-950 dark:text-rose-100 font-semibold leading-relaxed">
                            🇨🇴 En Colombia marca de inmediato al <span className="font-black underline text-rose-950 dark:text-white">123</span> (Emergencias Nacional) o al <span className="font-black underline text-rose-950 dark:text-white">125</span> (CRUE Ambulancias).
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            playEmergencyAlarmSound();
                            onOpenEmergencyModal?.();
                          }}
                          className="shrink-0 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          <span>Ver Protocolo de Urgencias</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <div
                    className={`text-[10px] mt-2 font-medium ${
                      isFroggi ? 'text-slate-400' : 'text-white/80 text-right'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center">
              <FroggiAvatar size={34} />
              <div className={`rounded-2xl px-4 py-3 border flex items-center gap-2 text-xs font-bold text-emerald-700 ${
                config.theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-emerald-100'
              }`}>
                <Sparkles className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Froggi está analizando directrices clínicas de OMS y AAP para responderte...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Quick Question Prompts */}
        <div className={`p-3 border-t overflow-x-auto no-scrollbar flex items-center gap-2 ${
          config.theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50/80 border-slate-200'
        }`}>
          <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap pl-1">
            Preguntas frecuentes:
          </span>
          {AGE_PROMPTS[selectedAge]?.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                config.theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                  : 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-700 hover:border-emerald-300'
              }`}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className={`p-3 sm:p-4 border-t flex items-center gap-2 sm:gap-3 ${
            config.theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <input
            id="chat-user-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Pregunta a Froggi sobre ${
              activeChild ? `${activeChild.name} (${childDisplayAge})` : `etapa ${selectedAge}`
            } (lactancia, fiebres, nutrición, sueño, vacunas)...`}
            className={`flex-1 rounded-2xl px-4 py-3 text-xs sm:text-sm border focus:outline-hidden transition-colors ${
              config.theme === 'dark'
                ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-emerald-400'
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500 focus:bg-white'
            }`}
          />

          <button
            id="chat-send-btn"
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${currentTheme.accentBg}`}
          >
            <span>Enviar</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Pediatric Disclaimer Banner */}
      <div className="bg-amber-100/90 dark:bg-amber-950/60 border-2 border-amber-400 dark:border-amber-900 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-amber-950 dark:text-amber-100 font-medium leading-relaxed shadow-xs">
        <Info className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-black text-amber-950 dark:text-amber-200">Aviso médico pediátrico:</span> Froggi y Amigos Unidos proporcionan orientación basada en literatura y protocolos de la OMS, AAP, UNICEF y el Ministerio de Salud con fines educativos y de apoyo a la crianza. No reemplaza el diagnóstico o tratamiento presencial de un médico pediatra. Ante signos de alarma (dificultad respiratoria, convulsiones, letargo, fiebre en neonatos), acude inmediatamente a un centro de urgencias o marca al <strong>123 (Colombia)</strong> / 911.
        </div>
      </div>
    </div>
  );
};

