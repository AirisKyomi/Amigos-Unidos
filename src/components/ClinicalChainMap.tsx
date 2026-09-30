import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Baby,
  Sliders,
  Stethoscope,
  AlertTriangle,
  Activity,
  ShieldCheck,
  Lock,
  ArrowRight,
  Maximize2,
  X,
  Download,
  Sparkles,
  CheckCircle2,
  Share2,
  ZoomIn,
  Layers,
  Brain,
  Workflow,
  HelpCircle,
  Clock,
  Heart
} from 'lucide-react';
import clinicalChainMapImg from '../assets/images/clinical_chain_map.jpg';
import { D3ClinicalChainInfographic } from './D3ClinicalChainInfographic';

interface ChainNode {
  id: number;
  step: string;
  title: string;
  summary: string;
  icon: any;
  colorBorder: string;
  colorBg: string;
  badgeBg: string;
  badgeText: string;
  input: string;
  processing: string;
  output: string;
  utilityAAP: string;
  clinicalImpact: string;
}

export const ClinicalChainMap: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.id === 'dark';

  const [activeStep, setActiveStep] = useState<number>(1); // Default to first dimension: Identificador y Edad Precisa
  const [displayMode, setDisplayMode] = useState<'d3' | 'image' | 'both'>('d3');
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const chainNodes: ChainNode[] = [
    {
      id: 1,
      step: 'Eslabón 1',
      title: 'Identificador y Edad Precisa',
      summary: 'Permite aislar la maduración biológica del niño en meses (0 a 120m), diferenciando inmediatamente al neonato del lactante o escolar.',
      icon: Baby,
      colorBorder: 'border-amber-400 dark:border-amber-500',
      colorBg: isDark ? 'bg-amber-950/40' : 'bg-amber-50',
      badgeBg: 'bg-amber-400 text-amber-950',
      badgeText: '0 a 120 Meses',
      input: 'Fecha de nacimiento cronológica o edad informada por los padres en semanas o meses.',
      processing: 'Cálculo de intervalo en días absolutos, categorización en cohorte clínica (Neonato <28d, Lactante menor 1-6m, Lactante mayor 6-12m, Deambulador 1-3a, Preescolar 3-5a, Escolar 6-10a).',
      output: 'Parámetro de maduración biológica inmutable que condiciona todos los rangos normales y protocolos de emergencia.',
      utilityAAP: 'Directrices AAP 2024: La fisiología neonatal difiere radicalmente de la pediátrica mayor; una fiebre en <28d siempre exige descarte de bacteriemia oculta.',
      clinicalImpact: 'Previene la subestimación de infecciones graves en recién nacidos y la sobredosificación en lactantes pequeños.'
    },
    {
      id: 2,
      step: 'Eslabón 2',
      title: 'Biometría y Temperatura',
      summary: 'Registra peso en kilogramos para dosificación miligramo/kilo exacta y termometría calibrada en escala Celsius (°C).',
      icon: Sliders,
      colorBorder: 'border-emerald-400 dark:border-emerald-500',
      colorBg: isDark ? 'bg-emerald-950/40' : 'bg-emerald-50',
      badgeBg: 'bg-emerald-500 text-white',
      badgeText: 'Peso (kg) & Temp (°C)',
      input: 'Peso en balanza calibrada (kg con 1 o 2 decimales) y temperatura axilar/timpánica/rectal (°C).',
      processing: 'Normalización de valores, cálculo de dosis farmacológica exacta mg/kg según principio activo (p. ej. Paracetamol 10-15 mg/kg, Ibuprofeno 5-10 mg/kg), y control de topes diarios.',
      output: 'Dosis exacta en miligramos (mg) y volumen en mililitros (ml) según la concentración del jarabe pediátrico disponible.',
      utilityAAP: 'Norma de Farmacología Pediátrica: Prohibición de medidas domésticas ambiguas ("goteros genéricos", "cucharaditas"). La dosificación debe ser matemática.',
      clinicalImpact: 'Erradica la hepatotoxicidad accidental por sobredosis de antipiréticos y garantiza eficacia terapéutica.'
    },
    {
      id: 3,
      step: 'Eslabón 3',
      title: 'Triángulo TEP (Apariencia, Respiración, Circulación)',
      summary: 'Estratifica la gravedad visual en segundos para identificar shock o hipoxia antes de que se alteren los signos vitales.',
      icon: Stethoscope,
      colorBorder: 'border-rose-400 dark:border-rose-500',
      colorBg: isDark ? 'bg-rose-950/40' : 'bg-rose-50',
      badgeBg: 'bg-rose-500 text-white',
      badgeText: 'Triaje Rápido 30 Segundos',
      input: 'Evaluación de 3 pilares visuales: 1) Apariencia (tono muscular, interacción, mirada, llanto), 2) Respiración (aleteo nasal, tiraje, quejido), 3) Circulación (palidez, cianosis, cutis marmorata).',
      processing: 'Matriz lógica de triaje TEP (OMS/AAP): Si los 3 lados están normales = Estable; 1 lado alterado = Dificultad Respiratoria o Disfunción de Apariencia; 2 o 3 lados alterados = Fallo Respiratorio Inminente o Shock.',
      output: 'Clasificación fisiopatológica instantánea y priorización asistencial inmediata.',
      utilityAAP: 'Pediatric Education for Prehospital Professionals (PEPP/AAP): El TEP identifica el colapso fisiológico antes de la caída de presión arterial.',
      clinicalImpact: 'Salva vidas al detectar hipoxia tisular oculta cuando el pulso y la tensión aún parecen normales.'
    },
    {
      id: 4,
      step: 'Eslabón 4',
      title: 'Regla de Acción Determinista',
      summary: 'Asigna un semáforo (Verde, Amarillo, Rojo) con respaldo de directrices oficiales AAP para guiar a los padres de forma segura.',
      icon: AlertTriangle,
      colorBorder: 'border-amber-500 dark:border-amber-400',
      colorBg: isDark ? 'bg-amber-950/50' : 'bg-amber-50/80',
      badgeBg: 'bg-amber-500 text-slate-950',
      badgeText: 'Semáforo Determinista AAP',
      input: 'Conjunción de TEP + Edad + Temperatura + Banderas Rojas de anamnesis.',
      processing: 'Evaluación estricta por reglas if-then deterministas blindadas: si Neonato + Temp ≥38.0°C → Rojo; si Petequias sin blanquear → Rojo; si Quejido respiratorio → Rojo. Sin alucinaciones de LLM.',
      output: 'Código de Color Oficial: 🟢 Verde (Cuidados de confort en casa con reevaluación), 🟡 Amarillo (Consulta médica presencial en 24h), 🔴 Rojo (Traslado urgente al hospital más cercano).',
      utilityAAP: 'Manual de Triaje AAP: La toma de decisiones críticas no depende de inferencias probabilísticas sino de directrices clínicas validadas.',
      clinicalImpact: 'Cero ambigüedades en momentos de alta angustia parental; orientación clara, certera y accionable.'
    },
    {
      id: 5,
      step: 'Eslabón 5',
      title: 'Sintomatología y Fenotipos Clínicos (AIEPI)',
      summary: 'Normaliza quejas familiares en lenguaje cotidiano hacia signos clínicos internacionales estandarizados (fiebre sin foco, estridor, quejido, tiraje).',
      icon: Activity,
      colorBorder: 'border-sky-400 dark:border-sky-500',
      colorBg: isDark ? 'bg-sky-950/40' : 'bg-sky-50',
      badgeBg: 'bg-sky-500 text-white',
      badgeText: 'Ontología AIEPI / OMS',
      input: 'Relato parental en lenguaje natural ("le silba el pecho", "está como dormilón", "vomita todo lo que toma").',
      processing: 'Tokenización clínica NLP y mapeo con ontología AIEPI (Atención Integrada a las Enfermedades Prevalentes de la Infancia - OMS/OPS).',
      output: 'Fenotipo clínico normalizado (Bronquiolitis, Deshidratación Grado II, Crup laringotraqueal, Cólico del lactante).',
      utilityAAP: 'Estandarización diagnóstica que permite cruzar el relato casero con protocolos de tratamiento pediátrico universal.',
      clinicalImpact: 'Evita interpretaciones subjetivas y detecta signos sutiles como la respiración rápida según la edad.'
    },
    {
      id: 6,
      step: 'Eslabón 6',
      title: 'Historial Inmunológico & Alergias',
      summary: 'Vigila vacunas aplicadas y alergias alimentarias/medicamentosas diagnosticadas para proteger el menú BLW y contextualizar fiebres posvacunales.',
      icon: ShieldCheck,
      colorBorder: 'border-purple-400 dark:border-purple-500',
      colorBg: isDark ? 'bg-purple-950/40' : 'bg-purple-50',
      badgeBg: 'bg-purple-500 text-white',
      badgeText: 'Seguridad Inmunológica',
      input: 'Cartilla de vacunación digitalizada, registro de alérgenos alimentarios (leche APLV, huevo, maní, mariscos, gluten) y antecedentes farmacológicos.',
      processing: 'Filtro de exclusión cruzada para planes nutricionales y cálculo de ventana de tiempo posvacunación (24-48h tras hexavalente o triple viral).',
      output: 'Lista de alimentos 100% seguros y advertencia diferenciada si la fiebre corresponde a respuesta inmunogénica normal tras vacuna.',
      utilityAAP: 'Recomendaciones del Comité Asesor de Prácticas de Inmunización (ACIP/CDC) y Sección de Alergia e Inmunología de la AAP.',
      clinicalImpact: 'Previene reacciones anafilácticas en el destete guiado por el bebé (BLW) y evita prescripciones innecesarias de antibióticos.'
    },
    {
      id: 7,
      step: 'Eslabón 7',
      title: 'Guardrail Farmacológico & Límites Infranqueables',
      summary: 'Prohíbe categóricamente la aspirina en menores de 18 años (Síndrome de Reye) y el ibuprofeno en menores de 6 meses, aplicando topes diarios estrictos.',
      icon: Lock,
      colorBorder: 'border-indigo-400 dark:border-indigo-500',
      colorBg: isDark ? 'bg-indigo-950/40' : 'bg-indigo-50',
      badgeBg: 'bg-indigo-600 text-white',
      badgeText: 'Escudo Anti-Reye',
      input: 'Consultas sobre medicamentos, dosificaciones repetidas o consultas de automedicación formuladas por los padres.',
      processing: 'Filtro interceptor previo a cualquier generación de IA: Bloqueo inquebrantable si se menciona ácido acetilsalicílico o si se pide ibuprofeno en lactante <6 meses o con deshidratación.',
      output: 'Alerta médica inmediata con explicación pedagógica del riesgo letal (Síndrome de Reye o daño renal) y alternativa segura autorizada.',
      utilityAAP: 'Advertencia de la FDA y AAP: La aspirina en niños durante cuadros virales (gripe, varicela) desencadena esteatosis hepática y encefalopatía aguda mortal.',
      clinicalImpact: 'Protección absoluta del paciente ante errores de automedicación común en el hogar.'
    }
  ];

  const selectedNode = chainNodes.find(n => n.id === activeStep) || chainNodes[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl ${isDark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white'} shadow-md`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-white/20 text-white'} flex items-center justify-center shrink-0 shadow-inner`}>
              <Workflow className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-extrabold text-[10px] uppercase tracking-wider">
                  Infografía &amp; Cadena Estructural
                </span>
                <span className={`px-2.5 py-0.5 rounded-full ${isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/20 text-white'} text-[10px] font-extrabold`}>
                  7 Dimensiones Médicas AAP
                </span>
              </div>
              <h2 className="font-rounded font-extrabold text-xl sm:text-2xl tracking-tight mt-1">
                Estructura del Registro Clínico en Cadena de Mapa
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-amber-100/90'} max-w-3xl leading-relaxed mt-0.5`}>
                Flujo secuencial de datos clínicos sin requerir código de programación: desde la maduración biológica del niño hasta el semáforo determinista de seguridad de la AAP.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Ver Imagen Ampliada</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visualizer Mode Switcher */}
      <div className={`p-2 rounded-2xl border flex flex-wrap items-center justify-between gap-2 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-2xs`}>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setDisplayMode('d3')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              displayMode === 'd3'
                ? isDark
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'bg-amber-400 text-amber-950 font-black shadow-xs'
                : isDark
                ? 'text-slate-300 hover:bg-slate-800'
                : 'text-slate-600 hover:bg-amber-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>⚡ Diagrama Dinámico D3 (Infografía de Bloques)</span>
          </button>

          <button
            type="button"
            onClick={() => setDisplayMode('image')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              displayMode === 'image'
                ? isDark
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'bg-amber-400 text-amber-950 font-black shadow-xs'
                : isDark
                ? 'text-slate-300 hover:bg-slate-800'
                : 'text-slate-600 hover:bg-amber-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>🖼️ Imagen HD (Cadena de Mapa)</span>
          </button>

          <button
            type="button"
            onClick={() => setDisplayMode('both')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              displayMode === 'both'
                ? isDark
                  ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                  : 'bg-amber-400 text-amber-950 font-black shadow-xs'
                : isDark
                ? 'text-slate-300 hover:bg-slate-800'
                : 'text-slate-600 hover:bg-amber-50'
            }`}
          >
            <span>📑 Vista Dual (D3 + Imagen)</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>D3.js Vectorial Activo</span>
        </div>
      </div>

      {/* D3 DYNAMIC INFOGRAPHIC VIEW */}
      {(displayMode === 'd3' || displayMode === 'both') && (
        <D3ClinicalChainInfographic
          selectedId={activeStep}
          onSelectDimension={(id) => setActiveStep(id)}
        />
      )}

      {/* SECTION 1: LA IMAGEN DE SU ESTRUCTURA COMO CADENA DE MAPA */}
      {(displayMode === 'image' || displayMode === 'both') && (
      <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="font-rounded font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                🖼️ Imagen de la Estructura en Cadena de Mapa
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Diagrama de flujo encadenado de alta fidelidad que ilustra la conexión de las 7 dimensiones clínicas del registro pediátrico.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300'
              }`}
            >
              <ZoomIn className="w-3.5 h-3.5" />
              <span>Zoom &amp; Detalle</span>
            </button>
            <a
              href={clinicalChainMapImg}
              download="estructura_cadena_mapa_registro_clinico.jpg"
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar</span>
            </a>
          </div>
        </div>

        {/* Image Frame with interactive hover overlay */}
        <div className="relative rounded-2xl overflow-hidden border border-amber-200/80 dark:border-slate-700 bg-slate-950 group shadow-inner">
          <img
            src={clinicalChainMapImg}
            alt="Composición y Utilidad del Registro Clínico Pediátrico - Estructura como una Cadena de Mapa"
            className="w-full h-auto max-h-[520px] object-contain mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 pointer-events-none">
            <span className="text-white text-xs font-bold drop-shadow-md">
              Haga clic para expandir en pantalla completa e inspeccionar los 7 eslabones clínicos
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md text-white text-[11px] font-mono font-bold pointer-events-auto cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
              Pantalla Completa ⛶
            </span>
          </div>
        </div>

        {/* Legend of the chain */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
          {chainNodes.map((node) => (
            <button
              key={node.id}
              type="button"
              onClick={() => setActiveStep(node.id)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                activeStep === node.id
                  ? isDark
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/50 shadow-xs'
                    : 'bg-amber-100 border-amber-400 text-amber-950 ring-2 ring-amber-400/50 shadow-xs'
                  : isDark
                  ? 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                  : 'bg-slate-50 hover:bg-amber-50/70 border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold uppercase opacity-80">{node.step}</span>
                <node.icon className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="font-bold text-[11px] leading-tight mt-1 truncate">{node.title}</div>
            </button>
          ))}
        </div>
      </div>
      )}

      {/* SECTION 2: EXPLORACIÓN DIDÁCTICA INTERACTIVA DEL ESLABÓN SELECCIONADO */}
      <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-5`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl ${isDark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-900'} flex items-center justify-center shrink-0`}>
              <selectedNode.icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                {selectedNode.step} de la Cadena
              </span>
              <h3 className="font-rounded font-extrabold text-base sm:text-lg text-slate-900 dark:text-white mt-1">
                {selectedNode.title}
              </h3>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-xl text-xs font-bold ${selectedNode.badgeBg}`}>
            {selectedNode.badgeText}
          </span>
        </div>

        {/* Resumen Clínico */}
        <div className={`p-4 rounded-2xl ${selectedNode.colorBg} border ${selectedNode.colorBorder} space-y-1`}>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Definición en el Registro Clínico:
          </span>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
            {selectedNode.summary}
          </p>
        </div>

        {/* Diagrama de Flujo: Qué Entra -> Procesamiento -> Qué Sale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* QUÉ ENTRA */}
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-sky-50/70 border-sky-200'} space-y-2`}>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-bold text-[10px] flex items-center justify-center">📥</span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-sky-900 dark:text-sky-300">
                ¿Qué Entra al Eslabón? (Input)
              </h4>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedNode.input}
            </p>
          </div>

          {/* CÓMO SE PROCESA */}
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-amber-50/70 border-amber-200'} space-y-2`}>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">⚙️</span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300">
                Procesamiento Determinista
              </h4>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedNode.processing}
            </p>
          </div>

          {/* QUÉ SALE */}
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-emerald-50/70 border-emerald-200'} space-y-2`}>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center">📤</span>
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                ¿Qué Sale Hacia la Familia? (Output)
              </h4>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedNode.output}
            </p>
          </div>
        </div>

        {/* Respaldo AAP e Impacto Clínico */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-indigo-50/60 border-indigo-200'} space-y-1.5`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h5 className="font-bold text-xs text-indigo-950 dark:text-indigo-300">
                Utilidad Clínica &amp; Respaldo de Guías Oficiales AAP
              </h5>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedNode.utilityAAP}
            </p>
          </div>

          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-rose-50/60 border-rose-200'} space-y-1.5`}>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <h5 className="font-bold text-xs text-rose-950 dark:text-rose-300">
                Impacto en la Salud y Seguridad del Paciente
              </h5>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedNode.clinicalImpact}
            </p>
          </div>
        </div>

        {/* Controles de navegación de la cadena */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveStep(prev => (prev > 1 ? prev - 1 : 7))}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            ← Eslabón Anterior
          </button>

          <span className="text-xs font-mono font-bold text-slate-500">
            Eslabón {activeStep} de {chainNodes.length}
          </span>

          <button
            type="button"
            onClick={() => setActiveStep(prev => (prev < 7 ? prev + 1 : 1))}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              isDark
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-400'
                : 'bg-amber-400 hover:bg-amber-500 text-amber-950 border-amber-400'
            }`}
          >
            <span>Siguiente Eslabón</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* LIGHTBOX MODAL PARA VER LA IMAGEN EN PANTALLA COMPLETA */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col p-4 md:p-6 animate-fadeIn">
          {/* Lightbox Toolbar */}
          <div className="flex items-center justify-between pb-3 border-b border-white/20 text-white shrink-0">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs uppercase">
                Cadena de Mapa Clínica
              </span>
              <h4 className="font-rounded font-extrabold text-sm sm:text-base text-white">
                Composición y Utilidad del Registro Clínico Pediátrico
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={clinicalChainMapImg}
                download="cadena_mapa_registro_pediatrico.jpg"
                className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Descargar Imagen</span>
              </a>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Container */}
          <div className="flex-1 flex items-center justify-center overflow-auto p-2">
            <img
              src={clinicalChainMapImg}
              alt="Estructura como una Cadena de Mapa - Pantalla Completa"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl transition-all duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>

          {/* Lightbox Footer Controls */}
          <div className="flex items-center justify-center gap-3 pt-3 border-t border-white/20 text-white text-xs shrink-0">
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.max(0.75, prev - 0.25))}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 font-bold"
            >
              Zoom -
            </button>
            <span className="font-mono text-xs">{Math.round(zoomLevel * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.25))}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 font-bold"
            >
              Zoom +
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 font-bold"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
