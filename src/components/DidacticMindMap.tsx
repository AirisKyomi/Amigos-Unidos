import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ClinicalChainMap } from './ClinicalChainMap';
import {
  Brain,
  Network,
  Workflow,
  GitBranch,
  Layers,
  Activity,
  ShieldCheck,
  Cpu,
  Database,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Baby,
  Stethoscope,
  Bell,
  Calendar,
  Volume2,
  Lock,
  Sliders,
  Eye,
  BookOpen,
  ArrowRight,
  FileText,
  HardDrive,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';

export const DidacticMindMap: React.FC = () => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.id === 'dark';

  const [activeMindTab, setActiveMindTab] = useState<'chain_map' | 'mindmap' | 'seven_dimensions' | 'inputs_outputs' | 'architecture'>('chain_map');
  const [selectedNode, setSelectedNode] = useState<string | null>('tep');

  // Node details dictionary for didactic interactive inspection
  const nodeDetails: Record<string, {
    title: string;
    branch: string;
    description: string;
    clinicalUtility: string;
    pediatricImpact: string;
    inOutFlow: string;
    badge: string;
  }> = {
    age: {
      title: '1. Identificador & Maduración Etaria Precisa',
      branch: 'Dimensión Clínica (Registro)',
      description: 'Aísla la maduración cronológica del paciente en meses exactos (0 a 120 meses). Permite discriminar de inmediato al neonato (<28 días), lactante (1-12m), deambulador (1-3a), preescolar (3-6a) y escolar/preadolescente (7-12+a).',
      clinicalUtility: 'La fisiología pediátrica cambia drásticamente con la edad. Un recién nacido con 38°C es una urgencia séptica por barrera hematoencefálica inmadura, mientras que en un escolar de 8 años suele ser un cuadro viral benigno.',
      pediatricImpact: 'Elimina diagnósticos erróneos por generalización de edad y adapta los hitos motores y cognitivos con precisión micrométrica.',
      inOutFlow: 'Entrada: Fecha de nacimiento / Meses → Procesamiento: Filtrado etario en GA-RAG → Salida: Guías adaptadas y curvas percentiles correctas.',
      badge: '0 a 120 Meses'
    },
    biometry: {
      title: '2. Biometría & Termometría Calibrada',
      branch: 'Dimensión Clínica (Registro)',
      description: 'Captura el peso exacto en kilogramos (kg), talla (cm), perímetro cefálico y temperatura corporal calibrada en grados Celsius (°C) tomada por termometría axilar, timpánica o rectal.',
      clinicalUtility: 'Es la base matemática para la dosificación farmacológica miligramo/kilo. En pediatría no existen "cucharadas" ni dosis fijas de adulto; un error de 1 kg en un lactante de 5 kg representa un 20% de sobredosis.',
      pediatricImpact: 'Previene la intoxicación hepática por paracetamol y la insuficiencia renal por sobredosis empírica de ibuprofeno.',
      inOutFlow: 'Entrada: Peso (kg) y Temperatura (°C) → Procesamiento: Ecuación mg/kg determinista → Salida: Mililitros exactos según concentración comercial.',
      badge: 'Dosificación mg/kg'
    },
    tep: {
      title: '3. Triángulo de Evaluación Pediátrica (TEP)',
      branch: 'Dimensión Clínica (Registro)',
      description: 'Herramienta visual rápida de triaje recomendada por la AAP y OMS basada en 3 lados: 1) Apariencia (tono muscular, reactividad, mirada, llanto), 2) Trabajo Respiratorio (aleteo, tiraje, quejido), 3) Circulación Cutánea (palidez, cianosis, piel moteada).',
      clinicalUtility: 'Permite estratificar el riesgo en los primeros 30 segundos sin necesidad de tocar al niño ni colocar estetoscopios, detectando shock descompensado o fallo respiratorio inminente.',
      pediatricImpact: 'Salva vidas al alertar a cuidadores de signos sutiles de hipoxia antes de que se altere la frecuencia cardíaca.',
      inOutFlow: 'Entrada: Evaluación de apariencia y signos visuales → Procesamiento: Matriz TEP determinista → Salida: Código de Riesgo Inmediato.',
      badge: 'Triaje Rápido 30s'
    },
    action_rule: {
      title: '4. Regla de Acción Determinista Semafórica',
      branch: 'Dimensión Clínica (Registro)',
      description: 'Algoritmo de decisión cerrado que traduce los hallazgos en un semáforo universal: Verde (Manejo de confort en casa), Amarillo (Consulta pediátrica programada en 24h), Rojo (Derivación hospitalaria urgente sin demora).',
      clinicalUtility: 'Desacopla la seguridad del paciente de los modelos probabilísticos de lenguaje. Si hay una bandera roja (neonato con fiebre, manchas que no palidecen, quejido), el sistema emite Código Rojo de forma obligatoria.',
      pediatricImpact: 'Evita demoras fatales en sepsis meningocócica, bronquiolitis grave o deshidratación severa.',
      inOutFlow: 'Entrada: Banderas rojas del paciente → Procesamiento: Guardrail de seguridad AAP → Salida: Protocolo de derivación hospitalaria.',
      badge: 'Semáforo de Seguridad'
    },
    symptoms: {
      title: '5. Sintomatología & Fenotipos Clínicos',
      branch: 'Dimensión Clínica (Registro)',
      description: 'Vector estructurado de síntomas en lenguaje natural ("no quiere comer", "llora sin parar", "manchas rojas", "pecho le suena") mapeados a tokens ontológicos médicos calibrados con AIEPI.',
      clinicalUtility: 'Normaliza la descripción subjetiva de los padres a signos clínicos comparables con la base de conocimiento médico internacional.',
      pediatricImpact: 'Facilita la identificación de patrones de bronquiolitis, laringitis estridulosa, gastroenteritis aguda o cólicos.',
      inOutFlow: 'Entrada: Consulta de la familia en lenguaje coloquial → Procesamiento: Tokenizador NLP y búsqueda semántica → Salida: Síntomas normalizados.',
      badge: 'Ontología AIEPI'
    },
    immunology: {
      title: '6. Historial Inmunológico & Alergias',
      branch: 'Dimensión Clínica (Registro)',
      description: 'Registro de vacunas aplicadas según el calendario oficial, reacciones anafilácticas previas y alergias alimentarias diagnosticadas (APLV, huevo, frutos secos, gluten).',
      clinicalUtility: 'Filtra de inmediato recomendaciones dietéticas en el módulo BLW e identifica si una fiebre ocurre tras una inmunización reciente (fiebre posvacunal común).',
      pediatricImpact: 'Previene exposición accidental a alérgenos letales y brinda tranquilidad tras las vacunaciones.',
      inOutFlow: 'Entrada: Perfil del niño con vacunas y alergias → Procesamiento: Máscara booleana de exclusión de alimentos → Salida: Menús 100% hipoalergénicos.',
      badge: 'Alergias & Vacunas'
    },
    safety_limits: {
      title: '7. Guardrail Farmacológico & Límites Duros',
      branch: 'Dimensión Clínica (Registro)',
      description: 'Límites inviolables de seguridad que impiden cualquier recomendación médica peligrosa: prohibición estricta de aspirina (riesgo de Síndrome de Reye), ibuprofeno vetado en menores de 6 meses o deshidratados, y dosis tope máximas de 24 horas.',
      clinicalUtility: 'Actúa como escudo protector que ninguna alucinación de IA puede vulnerar.',
      pediatricImpact: 'Cero margen de error en toxicología farmacológica domiciliaria.',
      inOutFlow: 'Entrada: Fármaco consultado → Procesamiento: Validación cruzada contra Vademécum AAP → Salida: Aprobación o bloqueo con alerta roja.',
      badge: 'Escudo Anti-Reye'
    },
    input_audio: {
      title: 'Entrada: Señal Bioacústica PCM (Micrófono)',
      branch: 'Componente que Entra (Input)',
      description: 'Captura de audio continuo a 44,100 Hz cuantizado a 16-bit Float32 mediante la Web Audio API. Ventana Hamming de 2,048 muestras.',
      clinicalUtility: 'Permite captar las micro-variaciones de la frecuencia fundamental laríngea en el llanto del bebé sin equipo hospitalario invasivo.',
      pediatricImpact: 'Diferencia el dolor visceral agudo (>600 Hz) del hambre rítmica (~440 Hz) o la somnolencia (~395 Hz).',
      inOutFlow: 'Micrófono físico → Web Audio API (FFT 2048) → Extractor de Pitch F0 → Diagnóstico Diferencial.',
      badge: 'Audio 44.1 kHz'
    },
    input_prompts: {
      title: 'Entrada: Consultas Clínicas en Lenguaje Natural',
      branch: 'Componente que Entra (Input)',
      description: 'Dudas y preguntas formuladas por los padres ("tiene 38.5 de fiebre y le cuesta respirar", "receta BLW con lentejas para 8 meses").',
      clinicalUtility: 'Canaliza la ansiedad familiar en una interfaz conversacional empática y directa guiada por Froggi.',
      pediatricImpact: 'Proporciona respuestas clínicas validadas en menos de 1.5 segundos reduciendo la incertidumbre parental.',
      inOutFlow: 'Teclado/Voz del usuario → Sanitizador XSS y filtro de tokens → Orquestador Multimodal Gemini.',
      badge: 'NLP Directo'
    },
    input_vision: {
      title: 'Entrada: Captura Óptica Dérmica (Cámara / Galería)',
      branch: 'Componente que Entra (Input)',
      description: 'Fotografía en primer plano de sarpullidos, eritemas, dermatitis o ronchas, comprimida en cliente a menos de 150 KB para no consumir ancho de banda.',
      clinicalUtility: 'Permite evaluar bordes, distribución corporal, relieve y la prueba de vitropresión (blanqueamiento con vaso).',
      pediatricImpact: 'Detecta tempranamente petequias hemorrágicas que alertan de posible sepsis o meningococcemia.',
      inOutFlow: 'Sensor de cámara móvil → Canvas de compresión <150 KB → Gemini 3.6 Flash Visión → Triaje de Piel.',
      badge: 'Visión Dérmica'
    },
    core_ga_rag: {
      title: 'Motor: Algoritmo Genético GA-RAG (6 Genes)',
      branch: 'Núcleo de Razonamiento & Optimización',
      description: 'Evoluciona en memoria RAM una población de 30 cromosomas a lo largo de 15 generaciones con selección por ruleta, cruce uniforme y mutación adaptativa del 8%.',
      clinicalUtility: 'Optimiza la selección del contexto médico más relevante para la edad exacta del paciente en ~38 ms, sin pagar bases vectoriales Cloud.',
      pediatricImpact: 'Garantiza respuestas médicas contextualmente exactas con costo cero de infraestructura ($0.00).',
      inOutFlow: 'Entrada: Edad y Síntoma → Motor GA-RAG en RAM → Salida: Contexto clínico ultra-específico.',
      badge: 'GA-RAG en RAM'
    },
    core_dsp: {
      title: 'Motor: Algoritmo DSP de Pitch y Armónicos F0',
      branch: 'Núcleo de Razonamiento & Optimización',
      description: 'Calcula la autocorrelación de la onda sonora y la Transformada Rápida de Fourier (FFT) para aislar la frecuencia fundamental laríngea en el rango de 300 a 850 Hz.',
      clinicalUtility: 'Clasifica el llanto infantil con rigor acústico objetivo en lugar de conjeturas subjetivas.',
      pediatricImpact: 'Brinda tranquilidad a los padres al confirmar la causa exacta del llanto y el protocolo de alivio a seguir.',
      inOutFlow: 'Buffer de Audio PCM → Autocorrelación de retardos → F0 exacta en Hertz → Clasificador Multiclase.',
      badge: 'DSP Espectral'
    },
    core_gemini: {
      title: 'Motor: Orquestador Dual Gemini Flash (3.1 Lite & 3.6 Flash)',
      branch: 'Núcleo de Razonamiento & Optimización',
      description: 'Inferencia híbrida de bajísima latencia (~410 ms) con control estricto de temperatura clínica (0.3), timeout de 7 segundos y failover resiliente sin riesgo de caída.',
      clinicalUtility: 'Genera explicaciones cálidas, empáticas y pedagógicas estructuradas en español neutro libre de asteriscos.',
      pediatricImpact: 'Humaniza la atención asistencial convirtiendo guías frías en orientación tierna con Froggi.',
      inOutFlow: 'Prompt Orquestado + Contexto GA-RAG → Gemini API → Sanitizador de Texto → Presentación.',
      badge: 'Gemini Dual'
    },
    output_triage: {
      title: 'Salida: Triaje Clínico & Semáforo de Riesgo TEP',
      branch: 'Componente que Sale (Output)',
      description: 'Dictamen de riesgo con código Verde, Amarillo o Rojo, protocolo paso a paso de alivio en el hogar o indicación formal de traslado inmediato a urgencias.',
      clinicalUtility: 'Proporciona una ruta de acción inmediata y sin ambigüedades a los cuidadores.',
      pediatricImpact: 'Disminuye la saturación innecesaria en guardias hospitalarias y previene muertes evitables.',
      inOutFlow: 'Motor Clínico → Algoritmo de Triage → Pantalla de Semáforo TEP con deslinde de responsabilidad (*).',
      badge: 'Semáforo TEP'
    },
    output_growth: {
      title: 'Salida: Curvas Antropométricas Recharts (OMS LMS)',
      branch: 'Componente que Sale (Output)',
      description: 'Gráfico interactivo con curvas de percentiles P3, P15, P50, P85 y P97 según los estándares multicéntricos de crecimiento de la OMS.',
      clinicalUtility: 'Estratifica el estado nutricional: peso para la edad, talla para la edad y percentil IMC para detectar fallo de medro o sobrepeso.',
      pediatricImpact: 'Monitorea la velocidad de crecimiento continuo del niño a lo largo de los meses.',
      inOutFlow: 'Mediciones del niño → Ecuación LMS OMS → Renderizado vectorial SVG Recharts.',
      badge: 'Curvas OMS'
    },
    output_voice: {
      title: 'Salida: Síntesis de Voz Humanizada (Web Speech API)',
      branch: 'Componente que Sale (Output)',
      description: 'Lectura en voz alta con acento cálido y cadencia pausada de las recomendaciones pediátricas y de los cuentos interactivos de la Zona Niños.',
      clinicalUtility: 'Permite a madres y padres escuchar las pautas mientras sostienen al bebé en brazos o durante la noche con luz tenue.',
      pediatricImpact: 'Estimulación del neurodesarrollo y apego seguro a través de cuentos con moraleja pediátrica.',
      inOutFlow: 'Texto de Froggi → Web Speech API (Voces en Español) → Altavoz del dispositivo.',
      badge: 'Voz Accesible'
    },
    output_notifications: {
      title: 'Salida: Recordatorios Locales (Notification API & ICS)',
      branch: 'Componente que Sale (Output)',
      description: 'Alertas locales del navegador para control de percentiles y citas pediátricas, junto a la generación de archivos descargables .ICS para calendarios móviles.',
      clinicalUtility: 'Evita el olvido de controles de salud infantil y esquemas de vacunación obligatorios.',
      pediatricImpact: 'Mejora la adherencia al control del niño sano y la medicina preventiva.',
      inOutFlow: 'Agenda de Cita → Notification API / Blob ICS → Alerta en Pantalla y Google/Apple Calendar.',
      badge: 'Notificaciones & ICS'
    }
  };

  const selectedData = selectedNode && nodeDetails[selectedNode] ? nodeDetails[selectedNode] : nodeDetails['tep'];

  return (
    <div className="space-y-6">
      {/* Mind Map Header Banner */}
      <div className={`p-6 rounded-3xl ${isDark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white'} shadow-md`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-white/20 text-white'} flex items-center justify-center shrink-0 shadow-inner`}>
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-extrabold text-[10px] uppercase tracking-wider">
                  Mapa Mental Didáctico &amp; Arquitectura
                </span>
                <span className={`px-2 py-0.5 rounded-full ${isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-400 text-slate-900'} text-[10px] font-extrabold`}>
                  7 Dimensiones Médicas
                </span>
              </div>
              <h2 className="font-rounded font-extrabold text-xl sm:text-2xl tracking-tight mt-1">
                Estructura Holística, Registro Clínico y Flujo de Datos
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-amber-100/90'} max-w-3xl leading-relaxed mt-0.5`}>
                Representación didáctica integral: qué entra a la app, cómo el núcleo híbrido procesa y optimiza sin costos de servidor, qué sale hacia la familia y cómo se articula la arquitectura de software.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className={`px-3 py-1.5 rounded-xl ${isDark ? 'bg-slate-800 border border-slate-700 text-amber-300' : 'bg-black/30 text-amber-200 border border-white/20'} font-mono text-xs font-bold`}>
              Clean Arch + SaMD Clase I
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className={`flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-2xs`}>
        {[
          { id: 'chain_map', label: '⚡ 1. Cadena de Bloques D3 & Estructura (7 Dimensiones)', icon: Workflow },
          { id: 'mindmap', label: '🧠 2. Mapa Mental Interactivo Completo', icon: Network },
          { id: 'seven_dimensions', label: '📋 3. Las 7 Dimensiones del Registro Clínico', icon: FileText },
          { id: 'inputs_outputs', label: '🔄 4. ¿Qué Entra y Qué Sale de la App?', icon: GitBranch },
          { id: 'architecture', label: '🏛️ 5. Arquitectura del Proyecto (Capas)', icon: Layers }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveMindTab(tab.id as any)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeMindTab === tab.id
                ? isDark
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'bg-amber-400 text-amber-950 font-black shadow-xs border border-amber-500/50'
                : isDark
                ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'text-slate-600 hover:bg-amber-50 hover:text-amber-950'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* VISTA 0: CADENA DE MAPA (IMAGEN Y ESTRUCTURA DEL REGISTRO CLÍNICO)        */}
      {/* ========================================================================= */}
      {activeMindTab === 'chain_map' && (
        <ClinicalChainMap compact={false} />
      )}

      {/* ========================================================================= */}
      {/* VISTA 1: MAPA MENTAL INTERACTIVO COMPLETO                                */}
      {/* ========================================================================= */}
      {activeMindTab === 'mindmap' && (
        <div className="space-y-6">
          {/* Main Visual Topology Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Interactive Mind Map Canvas / Node Grid */}
            <div className="lg:col-span-8 space-y-4">
              {/* Central Hub */}
              <div className={`p-4 rounded-3xl text-center border ${isDark ? 'bg-slate-900 border-amber-500/40 text-white' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300 text-amber-950'} shadow-sm`}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-extrabold uppercase mb-2">
                  <Brain className="w-3.5 h-3.5" />
                  <span>Nodo Central del Sistema</span>
                </div>
                <h3 className="font-rounded font-extrabold text-lg sm:text-xl">
                  Plataforma Pediátrica Integral "Amigos Unidos"
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'} max-w-xl mx-auto mt-1`}>
                  Toca cualquier nodo de las 4 ramas para inspeccionar su justificación médica, su matemática algorítmica y su flujo de datos.
                </p>
              </div>

              {/* 4 Quadrants of the Mind Map */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Branch 1: Las 7 Dimensiones del Registro */}
                <div className={`p-4 rounded-3xl border ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-amber-50/50 border-amber-200'} space-y-2.5`}>
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200/60 dark:border-slate-800">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-400 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-amber-600" />
                      Rama 1: Registro Clínico
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200">
                      7 Dimensiones
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 text-xs">
                    {[
                      { id: 'age', label: '1. Identificador & Maduración (0-120m)', icon: Baby },
                      { id: 'biometry', label: '2. Biometría & Termometría (mg/kg)', icon: Sliders },
                      { id: 'tep', label: '3. Triángulo TEP (Apariencia, Resp, Circ)', icon: Stethoscope },
                      { id: 'action_rule', label: '4. Regla Semafórica (Verde/Amarillo/Rojo)', icon: AlertTriangle },
                      { id: 'symptoms', label: '5. Sintomatología & Fenotipos AIEPI', icon: Activity },
                      { id: 'immunology', label: '6. Historial Inmunológico & Alergias', icon: ShieldCheck },
                      { id: 'safety_limits', label: '7. Guardrail Farmacológico Anti-Reye', icon: Lock }
                    ].map((node) => (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setSelectedNode(node.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          selectedNode === node.id
                            ? isDark
                              ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow-xs'
                              : 'bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-xs'
                            : isDark
                            ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                            : 'bg-white hover:bg-amber-50/80 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <node.icon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span className="text-[11px] truncate">{node.label}</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Branch 2: Componentes que Entran (Inputs) */}
                <div className={`p-4 rounded-3xl border ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-sky-50/50 border-sky-200'} space-y-2.5`}>
                  <div className="flex items-center justify-between pb-2 border-b border-sky-200/60 dark:border-slate-800">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-sky-900 dark:text-sky-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                      Rama 2: Componentes que Entran
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-900 dark:text-sky-200">
                      Inputs
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 text-xs">
                    {[
                      { id: 'input_audio', label: 'Audio PCM Llanto (44.1 kHz, FFT 2048)', icon: Volume2 },
                      { id: 'input_prompts', label: 'Consultas & Prompts en Lenguaje Natural', icon: FileText },
                      { id: 'input_vision', label: 'Captura Óptica Dérmica (<150 KB)', icon: Eye }
                    ].map((node) => (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setSelectedNode(node.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          selectedNode === node.id
                            ? isDark
                              ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-bold shadow-xs'
                              : 'bg-sky-100 border-sky-400 text-sky-950 font-bold shadow-xs'
                            : isDark
                            ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                            : 'bg-white hover:bg-sky-50/80 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <node.icon className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                          <span className="text-[11px] truncate">{node.label}</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>

                  <div className={`p-3 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-white'} border border-sky-200 dark:border-slate-700 text-[11px] space-y-1`}>
                    <span className="font-bold text-sky-900 dark:text-sky-300 block">Principio de Entrada Cero Riesgo:</span>
                    <p className="text-slate-600 dark:text-slate-300 leading-tight">
                      Todo input se sanitiza en el navegador antes de cualquier procesamiento, eliminando vectores XSS y protegiendo la identidad del paciente.
                    </p>
                  </div>
                </div>

                {/* Branch 3: Núcleo de Razonamiento & Optimización */}
                <div className={`p-4 rounded-3xl border ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-indigo-50/50 border-indigo-200'} space-y-2.5`}>
                  <div className="flex items-center justify-between pb-2 border-b border-indigo-200/60 dark:border-slate-800">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 dark:text-indigo-400 flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-indigo-600" />
                      Rama 3: Razonamiento &amp; Motores
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-200">
                      Costo $0.00
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 text-xs">
                    {[
                      { id: 'core_ga_rag', label: 'Algoritmo Genético GA-RAG (6 Genes)', icon: Sparkles },
                      { id: 'core_dsp', label: 'Motor DSP Acústico de Pitch (F0)', icon: Activity },
                      { id: 'core_gemini', label: 'Orquestador Dual Gemini Flash', icon: Zap }
                    ].map((node) => (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setSelectedNode(node.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          selectedNode === node.id
                            ? isDark
                              ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200 font-bold shadow-xs'
                              : 'bg-indigo-100 border-indigo-400 text-indigo-950 font-bold shadow-xs'
                            : isDark
                            ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                            : 'bg-white hover:bg-indigo-50/80 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <node.icon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span className="text-[11px] truncate">{node.label}</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>

                  <div className={`p-3 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-white'} border border-indigo-200 dark:border-slate-700 text-[11px] space-y-1`}>
                    <span className="font-bold text-indigo-900 dark:text-indigo-300 block">Eficiencia Computacional:</span>
                    <p className="text-slate-600 dark:text-slate-300 leading-tight">
                      Caché semántico LRU en RAM que resuelve consultas frecuentes en 0 ms sin consumir tokens ni generar costos de API.
                    </p>
                  </div>
                </div>

                {/* Branch 4: Componentes que Salen (Outputs) */}
                <div className={`p-4 rounded-3xl border ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-emerald-50/50 border-emerald-200'} space-y-2.5`}>
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60 dark:border-slate-800">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 dark:text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Rama 4: Componentes que Salen
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200">
                      Outputs
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 text-xs">
                    {[
                      { id: 'output_triage', label: 'Triaje Clínico & Semáforo de Riesgo TEP', icon: AlertTriangle },
                      { id: 'output_growth', label: 'Curvas Antropométricas Recharts (OMS)', icon: Baby },
                      { id: 'output_voice', label: 'Síntesis de Voz Humanizada (Web Speech)', icon: Volume2 },
                      { id: 'output_notifications', label: 'Notificaciones Locales & Archivos ICS', icon: Bell }
                    ].map((node) => (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => setSelectedNode(node.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          selectedNode === node.id
                            ? isDark
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold shadow-xs'
                              : 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                            : isDark
                            ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                            : 'bg-white hover:bg-emerald-50/80 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <node.icon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="text-[11px] truncate">{node.label}</span>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>

                  <div className={`p-3 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-white'} border border-emerald-200 dark:border-slate-700 text-[11px] space-y-1`}>
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 block">Deslinde de Responsabilidad (*):</span>
                    <p className="text-slate-600 dark:text-slate-300 leading-tight">
                      Todas las salidas se acompañan de la advertencia médica obligatoria aclarando que el software no sustituye al médico pediatra.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Inspector Didáctico del Nodo Seleccionado */}
            <div className="lg:col-span-4 space-y-4">
              <div className={`p-5 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-amber-200 text-slate-900'} shadow-sm space-y-4 sticky top-20`}>
                <div className="border-b border-slate-200/80 dark:border-slate-800 pb-3">
                  <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/50">
                    {selectedData.branch}
                  </span>
                  <h3 className="font-rounded font-extrabold text-base text-slate-900 dark:text-white mt-2">
                    {selectedData.title}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Insignia: {selectedData.badge}
                  </span>
                </div>

                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                      📖 Fundamento Didáctico:
                    </h5>
                    <p className="text-slate-600 dark:text-slate-300">
                      {selectedData.description}
                    </p>
                  </div>

                  <div className={`p-3 rounded-2xl ${isDark ? 'bg-slate-800/70' : 'bg-amber-50/70'} border border-amber-200 dark:border-slate-700`}>
                    <h5 className="font-bold text-amber-950 dark:text-amber-300 mb-1">
                      🩺 Utilidad Clínica Pediátrica:
                    </h5>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                      {selectedData.clinicalUtility}
                    </p>
                  </div>

                  <div className={`p-3 rounded-2xl ${isDark ? 'bg-slate-800/70' : 'bg-emerald-50/70'} border border-emerald-200 dark:border-slate-700`}>
                    <h5 className="font-bold text-emerald-950 dark:text-emerald-300 mb-1">
                      🛡️ Impacto en la Seguridad del Paciente:
                    </h5>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px]">
                      {selectedData.pediatricImpact}
                    </p>
                  </div>

                  <div className={`p-3 rounded-2xl ${isDark ? 'bg-slate-800/70' : 'bg-sky-50/70'} border border-sky-200 dark:border-slate-700`}>
                    <h5 className="font-bold text-sky-950 dark:text-sky-300 mb-1">
                      🔄 Flujo de Entrada → Proceso → Salida:
                    </h5>
                    <p className="text-slate-700 dark:text-slate-300 text-[11px] font-mono">
                      {selectedData.inOutFlow}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: LAS 7 DIMENSIONES DEL REGISTRO CLÍNICO PEDIÁTRICO                 */}
      {/* ========================================================================= */}
      {activeMindTab === 'seven_dimensions' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} border shadow-xs space-y-4`}>
            <div className="border-b border-amber-100 dark:border-slate-800 pb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Taxonomía Médica Exhaustiva (Sin Código)
              </span>
              <h3 className="font-rounded font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
                Composición y Utilidad de las 7 Dimensiones del Registro Pediátrico
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Cada caso clínico procesado por el sistema consolida estas 7 variables de rigor clínico para erradicar diagnósticos erróneos y sobredosis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  number: '1',
                  title: 'Identificador y Edad Precisa',
                  badge: '0 a 120 Meses',
                  desc: 'Aísla la maduración biológica del niño en meses (0 a 120m), diferenciando inmediatamente al recién nacido (0-28d), lactante menor y mayor, preescolar y escolar/preadolescente.',
                  why: 'Las guías clínicas AAP cambian radicalmente: la barrera hematoencefálica del recién nacido exige protocolos de sepsis ante cualquier febrícula, mientras que en un escolar se maneja en casa.',
                  color: 'amber'
                },
                {
                  number: '2',
                  title: 'Biometría y Termometría Calibrada',
                  badge: 'Dosis Miligramo / Kilo',
                  desc: 'Registra el peso exacto en kilogramos (kg) y la temperatura corporal en escala Celsius (°C).',
                  why: 'Previene la intoxicación medicamentosa. Permite calcular paracetamol a 10-15 mg/kg exactos e ibuprofeno a 5-10 mg/kg sin depender de aproximaciones empíricas.',
                  color: 'emerald'
                },
                {
                  number: '3',
                  title: 'Triángulo de Evaluación Pediátrica (TEP)',
                  badge: 'Apariencia • Resp • Circ',
                  desc: 'Estratifica la gravedad visual en segundos evaluando la interacción del niño, el esfuerzo ventilatorio y la perfusión capilar.',
                  why: 'Identifica estados de shock séptico o insuficiencia respiratoria aguda antes de que el cuerpo descompense y caiga la tensión arterial.',
                  color: 'rose'
                },
                {
                  number: '4',
                  title: 'Sintomatología y Fenotipos Clínicos',
                  badge: 'Tokens Ontológicos AIEPI',
                  desc: 'Clasifica los síntomas referidos por los padres (fiebre sin foco, quejido, rechazo alimentario, vómitos, tos seca) en un vector clínico normalizado.',
                  why: 'Evita ambigüedades del lenguaje común y conecta con los protocolos de diagnóstico diferencial de la OMS.',
                  color: 'blue'
                },
                {
                  number: '5',
                  title: 'Historial Inmunológico & Alergias',
                  badge: 'Alergias & Vacunas',
                  desc: 'Cruza el esquema de vacunación y alergias conocidas a alimentos (APLV, frutos secos, huevo) o antibióticos.',
                  why: 'Garantiza que el optimizador nutricional BLW jamás sugiera alérgenos confirmados y contextualiza fiebres posvacunales benignas.',
                  color: 'purple'
                },
                {
                  number: '6',
                  title: 'Guardrail de Seguridad Farmacológica',
                  badge: 'Límites Infranqueables',
                  desc: 'Reglas duras de dosificación máxima diaria (máximo 60 mg/kg/día de paracetamol) y veto absoluto de fármacos peligrosos en la infancia.',
                  why: 'Bloquea categóricamente el uso de aspirina en menores de 18 años para prevenir el Síndrome de Reye mortal y prohíbe ibuprofeno en lactantes menores de 6 meses.',
                  color: 'indigo'
                },
                {
                  number: '7',
                  title: 'Regla de Acción Determinista Semafórica',
                  badge: 'Verde • Amarillo • Rojo',
                  desc: 'Asigna un semáforo de triaje unívoco e invariable con respaldo de directrices oficiales AAP para orientar a la familia con absoluta certeza.',
                  why: 'Proporciona una ruta clara: Verde (cuidados en casa), Amarillo (consulta en 24h) o Rojo (urgencias hospitalarias inmediatas con deslinde médico).',
                  color: 'teal'
                }
              ].map((dim) => (
                <div
                  key={dim.number}
                  className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50/70 border-slate-200'
                  } space-y-2`}
                >
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-extrabold text-xs flex items-center justify-center">
                      {dim.number}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {dim.badge}
                    </span>
                  </div>

                  <h4 className="font-rounded font-bold text-sm text-slate-900 dark:text-white">
                    {dim.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {dim.desc}
                  </p>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                    <strong className="text-amber-800 dark:text-amber-400 block mb-0.5 font-bold">¿Por qué es crucial?</strong>
                    <span>{dim.why}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 3: ¿QUÉ ENTRA Y QUÉ SALE DE LA APP? (DATAFLOW DIAGRAM)               */}
      {/* ========================================================================= */}
      {activeMindTab === 'inputs_outputs' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} border shadow-xs space-y-6`}>
            <div className="border-b border-amber-100 dark:border-slate-800 pb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                Flujo Didáctico de Datos (Input / Processing / Output)
              </span>
              <h3 className="font-rounded font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
                Mapeo Exhaustivo: ¿Qué Entra y Qué Sale de la Aplicación?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Visualización de cómo la información suministrada por los padres viaja a través de los filtros de seguridad y se convierte en respuestas clínicas deterministas.
              </p>
            </div>

            {/* 3 Columns Flow Diagram */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
              {/* Column 1: ENTRADAS */}
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-sky-100 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 text-sky-950 dark:text-sky-200 font-bold text-xs flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
                    1. COMPONENTES QUE ENTRAN (Inputs)
                  </span>
                  <span className="font-mono text-[10px]">5 Tipos</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'} space-y-1`}>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>Audio PCM del Llanto en Vivo</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Capturado a 44.1 kHz mediante micrófono del navegador con Web Audio API y FFT 2048.
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'} space-y-1`}>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>Mensajes y Consultas en Lenguaje Natural</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Preguntas de los padres sobre síntomas, fiebres, recetas BLW o desarrollo psicomotor.
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'} space-y-1`}>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>Fotografías Dérmicas Pediátricas</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Imágenes tomadas con la cámara o cargadas desde la galería, comprimidas a &lt;150 KB.
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'} space-y-1`}>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>Métricas Antropométricas</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Peso actual (kg), talla (cm), edad (meses/años) y género biológico.
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'} space-y-1`}>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>Credenciales y Sesión de Usuario</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Hash criptográfico PBKDF2 sin servicios de autenticación de pago externos.
                    </p>
                  </div>
                </div>
              </div>

              {/* Column 2: PROCESAMIENTO */}
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 font-bold text-xs flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-amber-600" />
                    2. PROCESAMIENTO &amp; OPTIMIZACIÓN
                  </span>
                  <span className="font-mono text-[10px]">Costo Cero</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-amber-50/70 border-amber-200'} space-y-1`}>
                    <div className="font-bold text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Algoritmo Genético GA-RAG (RAM)</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Evoluciona 30 cromosomas en 15 generaciones (~38 ms) para seleccionar la directriz clínica más idónea.
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-amber-50/70 border-amber-200'} space-y-1`}>
                    <div className="font-bold text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-indigo-600" />
                      <span>Extracción DSP de Frecuencia F0</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Aísla la vibración laríngea en dominio temporal para discriminar dolor agudo (&gt;600 Hz) de cólico o hambre.
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-amber-50/70 border-amber-200'} space-y-1`}>
                    <div className="font-bold text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Guardrails Deterministas AAP</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Fórmulas matemáticas estrictas para dosificación (mg/kg) y detección de banderas rojas antes de invocar a la IA.
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-amber-50/70 border-amber-200'} space-y-1`}>
                    <div className="font-bold text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <span>Orquestador Multimodal Gemini Flash</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Gemini 3.1 Flash Lite (diálogo empático) + Gemini 3.6 Flash (visión) con failover automático y control de tokens.
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-amber-50/70 border-amber-200'} space-y-1`}>
                    <div className="font-bold text-amber-950 dark:text-amber-300 flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-slate-600" />
                      <span>Caché Semántico LRU en RAM</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Resuelve el 71% de las consultas recurrentes en 0 ms sin consumir cuotas de API.
                    </p>
                  </div>
                </div>
              </div>

              {/* Column 3: SALIDAS */}
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 font-bold text-xs flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    3. COMPONENTES QUE SALEN (Outputs)
                  </span>
                  <span className="font-mono text-[10px]">6 Respuestas</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-emerald-50 border-emerald-200'} space-y-1`}>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Triaje Clínico &amp; Semáforo TEP</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Clasificación Verde / Amarillo / Rojo con derivación hospitalaria y deslinde médico (*).
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-emerald-50 border-emerald-200'} space-y-1`}>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Baby className="w-4 h-4 text-emerald-600" />
                      <span>Curvas de Percentiles Recharts</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Percentiles P3 a P97 (OMS) calculados en tiempo real con diagnóstico nutricional (eutrófico/riesgo).
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-emerald-50 border-emerald-200'} space-y-1`}>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span>Diagnóstico Diferencial Multiclase</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Causas ordenadas por porcentaje de probabilidad con signos físicos de confirmación.
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-emerald-50 border-emerald-200'} space-y-1`}>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-indigo-600" />
                      <span>Síntesis de Voz Natural Accesible</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Lectura auditiva fluida para cuentos interactivos y consejos médicos nocturnos.
                    </p>
                  </div>

                  <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-emerald-50 border-emerald-200'} space-y-1`}>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-amber-600" />
                      <span>Recordatorios Locales &amp; Calendario ICS</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Notification API nativa y exportación de citas médicas a Google Calendar, Apple iCal y Outlook.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 4: ARQUITECTURA DEL PROYECTO (HEXAGONAL & CLEAN ARCHITECTURE)         */}
      {/* ========================================================================= */}
      {activeMindTab === 'architecture' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-3xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} border shadow-xs space-y-5`}>
            <div className="border-b border-amber-100 dark:border-slate-800 pb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                Diseño de Ingeniería de Software
              </span>
              <h3 className="font-rounded font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
                Arquitectura de Software en 4 Capas (Clean Architecture)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Separación de responsabilidades: desacoplamiento estricto entre UI en el cliente, controladores REST, lógica bio-inspirada y almacenamiento soberano.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-amber-50/60 border-amber-200'} space-y-1.5`}>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-950 dark:text-amber-300 text-sm">
                    Capa 1: Presentación &amp; Viewports (React 19 SPA)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-[10px] font-bold font-mono">
                    Frontend Client
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Desarrollado en React 19 con TypeScript estricto y Tailwind CSS v4. Centraliza la navegación en un menú drawer unificado de tres rayitas (UnifiedHeader) para eliminar distracciones visuales. Gestiona el estado familiar y la personalización mediante Context API sin bibliotecas externas pesadas.
                </p>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Módulos: FroggiChat • GrowthTracker (Recharts) • PediatricCalendar • CryAnalyzer • DermaTriage • KidsZone
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-sky-50/60 border-sky-200'} space-y-1.5`}>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sky-950 dark:text-sky-300 text-sm">
                    Capa 2: Edge Gateway &amp; Controladores REST (Node.js 20 LTS)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-sky-200 dark:bg-sky-950 text-sky-900 dark:text-sky-300 text-[10px] font-bold font-mono">
                    Backend Express
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Monolito híbrido en Node.js 20 LTS con Express que monta Vite en desarrollo y sirve en producción en el puerto 3000. Aplica compresión gzip/brotli, sanitización de payloads de entrada y expone endpoints REST seguros (/api/pediatric-chat, /api/auth/*, /api/developer/*).
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-indigo-50/60 border-indigo-200'} space-y-1.5`}>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-indigo-950 dark:text-indigo-300 text-sm">
                    Capa 3: Motores Algorítmicos Bio-Inspirados &amp; DSP (In-Memory)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-200 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 text-[10px] font-bold font-mono">
                    RAM Engine
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Algoritmo genético GA-RAG multi-criterio en memoria RAM para seleccionar las directrices clínicas más idóneas según la edad del paciente en ~38 ms, junto con el analizador acústico FFT 2048 y autocorrelación de pitch para llanto infantil.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-emerald-50/60 border-emerald-200'} space-y-1.5`}>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-950 dark:text-emerald-300 text-sm">
                    Capa 4: Seguridad Criptográfica &amp; Almacenamiento Soberano
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 text-[10px] font-bold font-mono">
                    Zero-Cost Storage
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Criptografía con PBKDF2, HMAC-SHA512, salt aleatorio de 16 bytes y comparación en tiempo constante (crypto.timingSafeEqual). Almacenamiento local de confianza cero (Zero Trust Storage) en el cliente con sanitización de contraseñas y persistencia asíncrona no bloqueante.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
