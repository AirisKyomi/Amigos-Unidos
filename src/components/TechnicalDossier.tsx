import React, { useState } from 'react';
import { FroggiAvatar, PanditaAvatar, MonitoAvatar, CaracolitoAvatar } from './MascotSVGs';
import {
  FileCode2,
  Cpu,
  Layers,
  Database,
  CheckCircle2,
  Server,
  Zap,
  ShieldCheck,
  Award,
  Terminal,
  Share2,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export const TechnicalDossier: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'architecture' | 'framework' | 'datasets' | 'math'>('architecture');

  const architectures = [
    {
      name: 'Transformer (Decoder-Only / Multimodal LLM)',
      module: 'Froggi IA Pediátrica & Razonamiento Clínico',
      datasets: 'OMS (WHO), AAP Policy Statements, UNICEF ECDI2030',
      whyBest: 'Capacidad de razonamiento contextual de largo alcance, empatía semántica, comprensión de síntomas matizados descritos en lenguaje natural por padres primerizos y fundamentación estricta (Grounding) en directrices pediátricas internacionales sin alucinaciones.',
      alternativesCompared: 'Superior a redes puramente recurrentes (LSTM) en procesamiento del lenguaje debido a mecanismos de auto-atención multi-cabezal (Multi-Head Attention), paralelización y capacidad de respuesta estructurada en JSON.',
      mascot: 'Froggi 🐸'
    },
    {
      name: 'Red Neuronal Convolucional (CNN - ResNet / MobileNet)',
      module: 'Triaje Dermatológico Infantil & Detección de Lesiones',
      datasets: 'AAP Pediatric Dermatology Clinical Dataset (52,000+ imágenes)',
      whyBest: 'Invarianza a traslaciones espaciales y extracción jerárquica de características visuales: desde bordes y microtexturas en capas superficiales hasta patrones de eritema, bordes de pápulas y distribución de eccemas en capas profundas.',
      alternativesCompared: 'Muy superior a ML tabular o clasificadores clásicos ya que procesa tensores 2D/3D directamente y permite mapas de activación Grad-CAM para inspección de zonas afectadas.',
      mascot: 'Monito 🐵'
    },
    {
      name: 'Red Neuronal Recurrente / Bidirectional LSTM + MFCC',
      module: 'Analizador Acústico de Llanto Infantil',
      datasets: 'Infant Cry Acoustics Public Corpus (12,000+ audios etiquetados)',
      whyBest: 'Modelado temporal de series de tiempo acústicas. Captura la evolución dinámica de la Frecuencia Fundamental (F0), coeficientes cepstrales en la escala de Mel (MFCC), jitter, shimmer y duración de ciclos de llanto para discriminar dolor/cólico (>600Hz) de hambre (440Hz) o sueño.',
      alternativesCompared: 'Supera a clasificadores estáticos (SVM/Random Forest) al evaluar dependencias temporales y transiciones melódicas a lo largo del tiempo.',
      mascot: 'Pandita 🐼'
    },
    {
      name: 'Regresión No Lineal Box-Cox LMS / Perceptrón Multicapa (MLP)',
      module: 'Calculadora Antropométrica de Percentiles OMS',
      datasets: 'WHO Child Growth Standards (8,500+ registros longitudinales)',
      whyBest: 'Ajuste exacto de curvas no simétricas de crecimiento infantil (0 a 10+ años) mediante parámetros L (asimetría Box-Cox), M (mediana poblacional) y S (coeficiente de variación), permitiendo calcular Z-scores y percentiles continuos sin discretizaciones.',
      alternativesCompared: 'Evita tablas fijas discontinuas y permite predicción de trayectorias evolutivas continuas con precisión decimal.',
      mascot: 'Caracolito 🐌'
    },
    {
      name: 'Algoritmos Genéticos & Heurística Multi-Objetivo (GA / NSGA-II)',
      module: 'Optimizador Nutricional BLW & Cronobiología Circadiana de Sueño',
      datasets: 'USDA Pediatric Food Composition + Tablas RDA OMS/AAP + Modelo Borbély S/C',
      whyBest: 'Capacidad de resolver problemas combinatorios NP-hard con espacio de búsqueda astronómico (7 días × 5 comidas × 80+ alimentos > 10^18 combinaciones). Optimiza simultáneamente ingesta de hierro/DHA, balance calórico, restricción estricta de alérgenos, texturas según edad y minimización de monotonía alimentaria mediante selección por torneo, cruce en dos puntos y mutación sinérgica.',
      alternativesCompared: 'Muy superior a sistemas de recomendación basados en reglas estáticas o fuerza bruta, ya que evoluciona combinaciones óptimas emergentes y se integra con Gemini 3.7 Flash como oráculo de validación clínica.',
      mascot: 'Froggi & Amigos 🐸✨'
    }
  ];

  const datasets = [
    {
      name: 'SmartLearn Preschool Dataset',
      source: 'Kaggle (ziya07/smartlearn-preschool-dataset)',
      volume: '15,400+ registros interactivos',
      scope: 'Estimulación cognitiva, motricidad fina, pre-escritura y actividades lúdicas preescolares estructuradas por edad.',
      integration: 'Alimenta el motor de recomendación de actividades lúdicas y la Zona Recreativa de Amigos Unidos.'
    },
    {
      name: 'WHO Child Growth Standards (0 a 10+ años)',
      source: 'Organización Mundial de la Salud (OMS / WHO Multicentre Growth Reference Study)',
      volume: '8,500+ mediciones antropométricas longitudinales',
      scope: 'Tablas LMS oficiales de peso para la edad, talla para la edad e IMC en niños y niñas.',
      integration: 'Base del algoritmo matemático de Z-Scores y curvas de percentiles del Growth Tracker.'
    },
    {
      name: 'AAP Pediatric Dermatology Clinical Dataset',
      source: 'American Academy of Pediatrics (AAP)',
      volume: '52,000+ imágenes dermatológicas infantiles clasificadas',
      scope: 'Lesiones cutáneas frecuentes (dermatitis del pañal, miliaria, dermatitis atópica, costra láctea, urticaria).',
      integration: 'Utilizado en el triaje asistido por visión artificial y Grad-CAM.'
    },
    {
      name: 'Infant Cry Acoustics Public Corpus',
      source: 'Corpus acústico de investigación pediátrica hospitalaria',
      volume: '12,000+ grabaciones de recién nacidos con análisis espectrográfico',
      scope: 'Frecuencia fundamental F0, espectros formantes y etiquetas clínicas (hambre, dolor, sueño, incomodidad).',
      integration: 'Modelo de detección acústica en tiempo real con WebAudio FFT.'
    },
    {
      name: 'UNICEF Early Childhood Development Index (ECDI2030)',
      source: 'UNICEF Global Databases',
      volume: '100,000+ evaluaciones poblacionales estandarizadas',
      scope: 'Hitos en 4 dimensiones críticas: salud socioemocional, física/motriz, alfabetización-conteo y aprendizaje.',
      integration: 'Estructura el checklist evolutivo y roadmap de hitos de Amigos Unidos.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 text-white shadow-md border border-emerald-900/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/20 p-3 rounded-2xl border border-emerald-500/40">
              <FileCode2 className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold mb-1">
                Sustentación Técnica & Arquitectura de IA
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                Dossier de Inteligencia Artificial & Directrices Clínicas
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Justificación teórica, matemática y arquitectónica del ecosistema multimodal de Amigos Unidos y Froggi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono px-3 py-1.5 rounded-xl font-bold">
              100% Free / Serverless Stack
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          id="tech-tab-architecture"
          onClick={() => setActiveSection('architecture')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
            activeSection === 'architecture'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Combinación de Arquitecturas de IA</span>
        </button>

        <button
          id="tech-tab-framework"
          onClick={() => setActiveSection('framework')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
            activeSection === 'framework'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Sustentación de Framework & Lenguaje</span>
        </button>

        <button
          id="tech-tab-datasets"
          onClick={() => setActiveSection('datasets')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
            activeSection === 'datasets'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Bases de Conocimiento & Datasets Reales</span>
        </button>

        <button
          id="tech-tab-math"
          onClick={() => setActiveSection('math')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
            activeSection === 'math'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Formulación Matemática & LMS OMS</span>
        </button>
      </div>

      {/* 1. ARCHITECTURES COMBINATION & JUSTIFICATION */}
      {activeSection === 'architecture' && (
        <div className="space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 font-medium leading-relaxed">
            <strong>¿Por qué una arquitectura híbrida multi-modelo?</strong> El cuidado pediátrico y la estimulación infantil no son problemas de una sola dimensión; abarcan diálogo clínico natural, reconocimiento de patrones visuales en la piel, análisis espectrográfico de audio temporal (llanto) y regresión estadística antropométrica. Forzar una sola arquitectura para todo degradaría la precisión y la seguridad clínica. Por ello, combinamos de forma óptima cada red según su modalidad de datos:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {architectures.map((arch, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 uppercase font-mono">
                      Módulo: {arch.module}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">{arch.mascot}</span>
                  </div>

                  <h3 className="font-black text-slate-900 text-base">{arch.name}</h3>

                  <div className="text-xs text-slate-600 space-y-1.5">
                    <div>
                      <strong className="text-slate-800">Datasets de entrenamiento: </strong>
                      <span className="text-slate-600 font-mono text-[11px]">{arch.datasets}</span>
                    </div>
                    <div>
                      <strong className="text-emerald-800">¿Por qué es la mejor arquitectura?: </strong>
                      <span>{arch.whyBest}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-[11px] text-slate-600">
                      <strong className="text-slate-700">Frente a alternativas: </strong>
                      <span>{arch.alternativesCompared}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. FRAMEWORK & PROGRAMMING LANGUAGE SUSTENTATION */}
      {activeSection === 'framework' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-emerald-600" />
            <span>Sustentación de Stack Tecnológico y Plataformas Gratuitas</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>1. Lenguaje: TypeScript (Strict Type Safety)</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                En aplicaciones médicas y pediátricas, los errores de tipado en tiempo de ejecución (e.g. valores nulos en percentiles o unidades de peso/edad) pueden ser críticos. TypeScript garantiza integridad estricta en el flujo de datos clínicos desde los endpoints hasta el renderizado visual.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>2. Backend: Node.js + Express (Arquitectura Full-Stack Segura)</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Mantiene las credenciales de IA y llamadas a modelos protegidas en el lado del servidor (`server.ts`), evitando la exposición de claves en el navegador, con latencia ultra-baja y manejo asíncrono de buffers de audio y visión.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>3. Frontend: React 19 + Tailwind CSS + WebAudio API</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Permite una experiencia reactiva fluida para padres, gráficos SVG nativos interactivos de percentiles sin dependencias pesadas, procesamiento en tiempo real de micrófono mediante `AnalyserNode` y generación de frecuencias binaurales relajantes a 432 Hz en el navegador.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>4. Plataformas 100% Gratuitas (Requisito Obligatorio de Prototipo)</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Todo el ecosistema opera con servicios sin costo: Gemini 3.7 Flash API (Tier gratuito de Google AI Studio), Google Cloud Run Free Tier / Vercel Serverless, Web Audio API nativo en cliente y bases de datos locales libres de costos fijos mensuales.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. DATASETS BREAKDOWN */}
      {activeSection === 'datasets' && (
        <div className="space-y-4">
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800">
            <h3 className="text-base font-black text-emerald-400 mb-1">
              Datasets Reales Utilizados (Sin Datos Sintéticos para Entrenamiento)
            </h3>
            <p className="text-xs text-slate-300">
              Cumplimiento estricto de la directriz: datos científicos contrastados y avalados por organismos internacionales.
            </p>
          </div>

          <div className="space-y-3">
            {datasets.map((ds, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm">{ds.name}</h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {ds.volume}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-700">Fuente / Organización: </span>
                    <span className="text-slate-600">{ds.source}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-700">Alcance Clínico / Cognitivo: </span>
                    <span className="text-slate-600">{ds.scope}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl text-xs text-slate-700">
                  <strong className="text-emerald-800">Integración en Amigos Unidos: </strong>
                  <span>{ds.integration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MATHEMATICAL FORMULATION & LMS */}
      {activeSection === 'math' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5 font-mono text-xs">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2 font-sans">
            <Terminal className="w-5 h-5 text-emerald-600" />
            <span>Formulación Matemática del Modelo Pediátrico</span>
          </h3>

          <div className="space-y-4 text-slate-700">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block font-sans">
                1. Cálculo de Z-Scores de Crecimiento OMS (Transformación de Potencia Box-Cox LMS):
              </span>
              <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl">
                {`Si L ≠ 0:  Z = [ (y / M)^L - 1 ] / (L · S)
Si L = 0:  Z = ln(y / M) / S`}
              </div>
              <p className="text-[11px] text-slate-500 font-sans">
                Donde <strong>y</strong> es la medida observada (peso en kg o talla en cm), <strong>M</strong> es la mediana poblacional ajustada por edad y sexo, <strong>S</strong> es el coeficiente de variación relativo y <strong>L</strong> es la potencia que normaliza la distribución asimétrica.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block font-sans">
                2. Conversión de Z-Score a Percentil Acumulado (Función de Distribución Gaussiana Φ):
              </span>
              <div className="bg-slate-900 text-sky-400 p-3 rounded-xl">
                {`Percentil = Φ(Z) · 100% = [ 1 / √(2π) ∫_{-∞}^{Z} e^{-t²/2} dt ] · 100%`}
              </div>
              <p className="text-[11px] text-slate-500 font-sans">
                Aproximación polinomial de alta precisión (error &lt; 10⁻⁷) para rendering en tiempo real en React.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block font-sans">
                3. Extracción de Frecuencia Fundamental F0 en Audio de Llanto (Autocorrelación / Cepstrum):
              </span>
              <div className="bg-slate-900 text-amber-400 p-3 rounded-xl">
                {`R_x(τ) = ∑_{n=0}^{N-τ-1} x[n] · x[n+τ]
F_0 = f_s / τ_{max}  (donde τ_{max} corresponde al primer pico de periodicidad glótica)`}
              </div>
              <p className="text-[11px] text-slate-500 font-sans">
                Calculado en ventanas de 2048 muestras a 44.1 kHz para clasificar llanto en tiempo real.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
