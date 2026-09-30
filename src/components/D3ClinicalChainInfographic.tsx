import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useTheme } from '../context/ThemeContext';
import {
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Heart,
  ShieldCheck,
  ChevronRight,
  Layers,
  ArrowRight,
  Activity,
  Sliders,
  Baby,
  Stethoscope,
  Lock,
  Pause,
  Download,
  Share2
} from 'lucide-react';

export interface ClinicalDimension {
  id: number;
  numberStr: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  badge: string;
  iconName: string;
  colorHex: string;
  colorHexLight: string;
  colorHexDark: string;
  bgGradient: [string, string];
  summary: string;
  input: string;
  processing: string;
  output: string;
  aapStandard: string;
  clinicalSafety: string;
  simulatedData: string;
}

export const CLINICAL_DIMENSIONS: ClinicalDimension[] = [
  {
    id: 1,
    numberStr: '01',
    title: 'Identificador y Edad Precisa',
    shortTitle: 'Edad & Maduración',
    subtitle: 'Cohorte biológica de 0 a 120 meses',
    badge: '0 a 120 Meses',
    iconName: 'baby',
    colorHex: '#f59e0b', // amber-500
    colorHexLight: '#fef3c7',
    colorHexDark: '#78350f',
    bgGradient: ['#f59e0b', '#d97706'],
    summary: 'Permite aislar la maduración biológica del niño en meses (0 a 120m), diferenciando inmediatamente al neonato del lactante o escolar.',
    input: 'Fecha de nacimiento cronológica o edad informada por la familia en semanas/meses.',
    processing: 'Cálculo de intervalo exacto en días; estratificación en cohorte estricta (Neonato <28d, Lactante 1-12m, Escolar).',
    output: 'Parámetro de maduración biológica inmutable que condiciona todos los rangos fisiológicos.',
    aapStandard: 'Directrices AAP 2024: Fiebre en neonatos (<28d) es emergencia séptica obligatoria por inmadurez inmune.',
    clinicalSafety: 'Previene la subestimación de infecciones ocultas en recién nacidos y adapta los hitos percentiles.',
    simulatedData: '👶 Paciente: Mateo R. | Edad: 4 meses y 12 días (Lactante Menor)'
  },
  {
    id: 2,
    numberStr: '02',
    title: 'Biometría y Temperatura Calibrada',
    shortTitle: 'Biometría & Temp',
    subtitle: 'Dosificación mg/kg y termometría °C',
    badge: 'kg & Grados °C',
    iconName: 'sliders',
    colorHex: '#10b981', // emerald-500
    colorHexLight: '#d1fae5',
    colorHexDark: '#064e3b',
    bgGradient: ['#10b981', '#059669'],
    summary: 'Registra peso en kilogramos para dosificación miligramo/kilo exacta y termometría calibrada en escala Celsius (°C).',
    input: 'Peso en balanza pediátrica (kg con decimales) y temperatura corporal (°C axilar/timpánica).',
    processing: 'Ecuación matemática miligramo/kilo exacta según fármaco (ej. Paracetamol 10-15 mg/kg, Ibuprofeno 5-10 mg/kg) y tope máximo.',
    output: 'Dosis exacta en mg y volumen en ml para la presentación comercial disponible.',
    aapStandard: 'Farmacología AAP: Quedan terminantemente prohibidas las "cucharaditas" o "goteros genéricos".',
    clinicalSafety: 'Erradica intoxicaciones hepáticas accidentales por sobredosis y asegura eficacia terapéutica.',
    simulatedData: '⚖️ Peso: 6.85 kg | 🌡️ Temp axilar: 38.6 °C (Pirexia confirmada)'
  },
  {
    id: 3,
    numberStr: '03',
    title: 'Triángulo TEP (Apariencia, Respiración, Circulación)',
    shortTitle: 'Triángulo TEP',
    subtitle: 'Triaje visual rápido en 30 segundos',
    badge: 'Triaje Rápido 30s',
    iconName: 'stethoscope',
    colorHex: '#f43f5e', // rose-500
    colorHexLight: '#ffe4e6',
    colorHexDark: '#881337',
    bgGradient: ['#f43f5e', '#e11d48'],
    summary: 'Estratifica la gravedad visual en segundos para identificar shock o hipoxia antes de que se alteren los signos vitales.',
    input: 'Observación visual de 3 lados: 1) Apariencia (interacción, mirada), 2) Respiración (tiraje, aleteo), 3) Circulación (palidez, cianosis).',
    processing: 'Matriz algorítmica TEP (OMS/AAP): 3 lados normales = Estable; 1 lado alterado = Dificultad; ≥2 lados = Shock o Fallo inminente.',
    output: 'Estado fisiopatológico instantáneo y priorización asistencial antes de tomar presión arterial.',
    aapStandard: 'PEPP / AAP Guidelines: El TEP previene el paro cardiorrespiratorio detectando la hipoxia tisular precoz.',
    clinicalSafety: 'Identifica al niño que parece tranquilo pero está entrando en agotamiento respiratorio silencioso.',
    simulatedData: '🔺 TEP: Apariencia reactiva (Normal) | Respiración eupneica (Normal) | Circulación normocoloreada (Normal)'
  },
  {
    id: 4,
    numberStr: '04',
    title: 'Regla de Acción Determinista Semafórica',
    shortTitle: 'Semáforo Determinista',
    subtitle: 'Protocolo de acción blindado AAP',
    badge: 'Semáforo AAP',
    iconName: 'alert',
    colorHex: '#eab308', // yellow-500
    colorHexLight: '#fef9c3',
    colorHexDark: '#713f12',
    bgGradient: ['#eab308', '#ca8a04'],
    summary: 'Asigna un semáforo (Verde, Amarillo, Rojo) con respaldo de directrices oficiales AAP para guiar a los padres de forma segura.',
    input: 'Conjunción obligatoria: Edad + TEP + Nivel de Fiebre + Banderas Rojas de alarma.',
    processing: 'Reglas lógicas Deterministas cerradas (if-then): Sin azar ni probabilidades de lenguaje artificial.',
    output: '🟢 Verde (Manejo en casa con confort), 🟡 Amarillo (Cita médica en 24h), 🔴 Rojo (Traslado urgente al hospital).',
    aapStandard: 'Protocolo de Triaje AAP: Decisiones de vida o muerte reguladas por directrices clínicas invariantes.',
    clinicalSafety: 'Despeja toda duda de los padres en momentos de angustia y garantiza atención médica inmediata cuando se requiere.',
    simulatedData: '🟡 Semáforo: AMARILLO (Lactante 4m con fiebre >38.5°C pero TEP normal → Cita médica en 24h, sin urgencia de ambulancia)'
  },
  {
    id: 5,
    numberStr: '05',
    title: 'Sintomatología y Fenotipos Clínicos (AIEPI)',
    shortTitle: 'Ontología AIEPI',
    subtitle: 'Traducción de lenguaje cotidiano a signos estandarizados',
    badge: 'AIEPI / OMS',
    iconName: 'activity',
    colorHex: '#0284c7', // sky-600
    colorHexLight: '#e0f2fe',
    colorHexDark: '#0c4a6e',
    bgGradient: ['#0284c7', '#0369a1'],
    summary: 'Normaliza quejas familiares en lenguaje cotidiano hacia signos clínicos internacionales estandarizados (fiebre sin foco, estridor, quejido, tiraje).',
    input: 'Relato cotidiano de los padres ("le suena el pecho", "duerme de más", "vomitó la leche").',
    processing: 'Normalización ontológica contra AIEPI (Atención Integrada a Enfermedades Prevalentes de la Infancia).',
    output: 'Fenotipo clínico normalizado (Rinofaringitis aguda, Bronquiolitis grado leve, Deshidratación Grado 0).',
    aapStandard: 'Estandarización OMS/OPS: Homogeneiza la terminología médica para interconsulta y continuidad asistencial.',
    clinicalSafety: 'Evita falsas interpretaciones y extrae signos clave que los padres comunican con sus propias palabras.',
    simulatedData: '📋 Fenotipo: Fiebre aguda de 12h de evolución sin foco aparente + apetito conservado'
  },
  {
    id: 6,
    numberStr: '06',
    title: 'Historial Inmunológico & Alergias',
    shortTitle: 'Seguridad Inmunológica',
    subtitle: 'Protección nutricional y contexto posvacunal',
    badge: 'Inmuno & Alergias',
    iconName: 'shield',
    colorHex: '#9333ea', // purple-600
    colorHexLight: '#f3e8ff',
    colorHexDark: '#581c87',
    bgGradient: ['#9333ea', '#7e22ce'],
    summary: 'Vigila vacunas aplicadas y alergias diagnosticadas para proteger el menú BLW y contextualizar fiebres posvacunales.',
    input: 'Cartilla de vacunación al día (hexavalente, neumococo), antecedentes alérgicos (APLV, huevo) y fecha de última dosis.',
    processing: 'Cálculo de ventana posvacunación (24-48h) y filtro de exclusión de alérgenos alimentarios en recomendaciones de alimentación.',
    output: 'Dictamen de fiebre reactiva esperada vs. infecciosa, y lista de alimentos 100% seguros.',
    aapStandard: 'Comité Asesor de Vacunación AAP: Diferenciación de eventos supuestamente atribuibles a la vacunación (ESAVI).',
    clinicalSafety: 'Evita administrar antibióticos innecesarios a una reacción vacunal benigna y protege contra anafilaxia.',
    simulatedData: '💉 Vacunas: Hexavalente 4m aplicada hace 18 horas (Fiebre compatible con reacción posvacunal)'
  },
  {
    id: 7,
    numberStr: '07',
    title: 'Guardrail Farmacológico & Límites Infranqueables',
    shortTitle: 'Guardrail Anti-Reye',
    subtitle: 'Barrera de seguridad estricta para medicamentos',
    badge: 'Escudo Anti-Reye',
    iconName: 'lock',
    colorHex: '#4f46e5', // indigo-600
    colorHexLight: '#e0e7ff',
    colorHexDark: '#312e81',
    bgGradient: ['#4f46e5', '#3730a3'],
    summary: 'Prohíbe categóricamente la aspirina en menores de 18 años (Síndrome de Reye) y el ibuprofeno en menores de 6 meses, aplicando topes diarios estrictos.',
    input: 'Consultas de administración de fármacos o requerimientos de antipiréticos.',
    processing: 'Intercepción estricta: Bloqueo de ácido acetilsalicílico en pediatría y restricción de AINEs en lactantes <6 meses.',
    output: 'Autorización única de Paracetamol calibrado al peso exacto (10-15 mg/kg) con intervalo mínimo de 6 horas.',
    aapStandard: 'Alerta FDA / AAP: Riesgo letal de Síndrome de Reye (esteatosis hepática aguda con edema cerebral) por aspirina en virus.',
    clinicalSafety: 'Blindaje inquebrantable que previene intoxicaciones farmacológicas y complicaciones letales en el hogar.',
    simulatedData: '🛡️ Bloqueo Activo: Ibuprofeno DENEGADO (<6 meses) | Autorizado: Paracetamol 102 mg cada 6h según peso'
  }
];

export const D3ClinicalChainInfographic: React.FC<{
  onSelectDimension?: (dimensionId: number) => void;
  selectedId?: number;
}> = ({ onSelectDimension, selectedId = 1 }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.id === 'dark';

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const zoomBehaviorRef = useRef<any>(null);

  const [activeDimId, setActiveDimId] = useState<number>(selectedId);
  const [isPlayingSimulation, setIsPlayingSimulation] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'infographic' | 'compact' | 'linear'>('infographic');

  const simulationTimerRef = useRef<any>(null);

  // Sync external selectedId
  useEffect(() => {
    if (selectedId && selectedId !== activeDimId) {
      setActiveDimId(selectedId);
    }
  }, [selectedId]);

  const handleSelectDimension = (id: number) => {
    setActiveDimId(id);
    if (onSelectDimension) {
      onSelectDimension(id);
    }
  };

  // Run dynamic test simulation packet
  const handleToggleSimulation = () => {
    if (isPlayingSimulation) {
      clearInterval(simulationTimerRef.current);
      setIsPlayingSimulation(false);
    } else {
      setIsPlayingSimulation(true);
      setSimulationStep(1);
      handleSelectDimension(1);

      let step = 1;
      simulationTimerRef.current = setInterval(() => {
        step++;
        if (step > 7) {
          clearInterval(simulationTimerRef.current);
          setIsPlayingSimulation(false);
          setSimulationStep(0);
        } else {
          setSimulationStep(step);
          handleSelectDimension(step);
        }
      }, 2600);
    }
  };

  // Zoom helpers
  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(250).call(zoomBehaviorRef.current.scaleBy, 1.25);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(250).call(zoomBehaviorRef.current.scaleBy, 0.8);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(350).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  // Export full diagram as SVG
  const handleExportSVG = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagrama_7_dimensiones_registro_pediatrico.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    return () => {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    };
  }, []);

  // Main D3 Rendering Effect
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous drawings

    // Dynamic dimensions based on view mode
    const isDetailed = viewMode === 'infographic';
    const width = isDetailed ? 1340 : (viewMode === 'compact' ? 1100 : 1600);
    const height = isDetailed ? 760 : (viewMode === 'compact' ? 560 : 340);

    svg.attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Create defs for gradients, filters, markers
    const defs = svg.append('defs');

    // Drop shadow filter
    const filter = defs.append('filter')
      .attr('id', 'blockShadow')
      .attr('x', '-10%')
      .attr('y', '-10%')
      .attr('width', '125%')
      .attr('height', '125%');

    filter.append('feDropShadow')
      .attr('dx', '0')
      .attr('dy', '4')
      .attr('stdDeviation', '6')
      .attr('flood-color', isDark ? '#000000' : '#0f172a')
      .attr('flood-opacity', isDark ? '0.45' : '0.12');

    // Active Glow filter
    const glowFilter = defs.append('filter')
      .attr('id', 'activeGlow')
      .attr('x', '-25%')
      .attr('y', '-25%')
      .attr('width', '150%')
      .attr('height', '150%');

    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '6')
      .attr('result', 'coloredBlur');

    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Arrow markers for connections
    CLINICAL_DIMENSIONS.forEach(d => {
      const marker = defs.append('marker')
        .attr('id', `arrow-${d.id}`)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', '8')
        .attr('refY', '5')
        .attr('markerWidth', '6')
        .attr('markerHeight', '6')
        .attr('orient', 'auto-start-reverse');

      marker.append('path')
        .attr('d', 'M 0 1.5 L 8 5 L 0 8.5 z')
        .attr('fill', d.colorHex);
    });

    // Linear gradients for each dimension
    CLINICAL_DIMENSIONS.forEach(d => {
      const grad = defs.append('linearGradient')
        .attr('id', `grad-${d.id}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');

      grad.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d.bgGradient[0]);

      grad.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d.bgGradient[1]);
    });

    // Main zoom container
    const g = svg.append('g').attr('class', 'main-container');

    // Setup D3 Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.65, 2.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Compute Node Layout Coordinates
    type NodeCoord = {
      dim: ClinicalDimension;
      x: number;
      y: number;
      width: number;
      height: number;
      connectorIn: { x: number; y: number };
      connectorOut: { x: number; y: number };
    };

    let nodes: NodeCoord[] = [];

    if (isDetailed) {
      // MEGA INFOGRAPHIC MODE: Rich Cards with complete medical information
      const cardW = 295;
      const cardH = 300;

      // Row 1: Dimensions 1, 2, 3, 4
      const startXRow1 = 40;
      const gapXRow1 = (width - 80 - 4 * cardW) / 3;
      const yRow1 = 45;

      for (let i = 0; i < 4; i++) {
        const x = startXRow1 + i * (cardW + gapXRow1);
        nodes.push({
          dim: CLINICAL_DIMENSIONS[i],
          x,
          y: yRow1,
          width: cardW,
          height: cardH,
          connectorIn: { x, y: yRow1 + cardH / 2 },
          connectorOut: { x: x + cardW, y: yRow1 + cardH / 2 }
        });
      }

      // Row 2: Dimensions 5, 6, 7 (U-turn loop below)
      const yRow2 = 415;
      const x4 = nodes[3].x;
      const x3 = nodes[2].x;
      const x2 = nodes[1].x;

      // Block 5 (Dim 5) under block 4
      nodes.push({
        dim: CLINICAL_DIMENSIONS[4],
        x: x4,
        y: yRow2,
        width: cardW,
        height: cardH,
        connectorIn: { x: x4 + cardW / 2, y: yRow2 }, // enters from top
        connectorOut: { x: x4, y: yRow2 + cardH / 2 } // leaves left
      });

      // Block 6 (Dim 6) to left of 5
      nodes.push({
        dim: CLINICAL_DIMENSIONS[5],
        x: x3,
        y: yRow2,
        width: cardW,
        height: cardH,
        connectorIn: { x: x3 + cardW, y: yRow2 + cardH / 2 },
        connectorOut: { x: x3, y: yRow2 + cardH / 2 }
      });

      // Block 7 (Dim 7) to left of 6
      nodes.push({
        dim: CLINICAL_DIMENSIONS[6],
        x: x2,
        y: yRow2,
        width: cardW,
        height: cardH,
        connectorIn: { x: x2 + cardW, y: yRow2 + cardH / 2 },
        connectorOut: { x: x2, y: yRow2 + cardH / 2 }
      });

    } else if (viewMode === 'compact') {
      // 2-row serpentine chain: Row 1 (1..4), Row 2 (5..7)
      const cardW = 230;
      const cardH = 175;

      const startXRow1 = 45;
      const gapXRow1 = (width - 90 - 4 * cardW) / 3;
      const yRow1 = 50;

      for (let i = 0; i < 4; i++) {
        const x = startXRow1 + i * (cardW + gapXRow1);
        nodes.push({
          dim: CLINICAL_DIMENSIONS[i],
          x,
          y: yRow1,
          width: cardW,
          height: cardH,
          connectorIn: { x, y: yRow1 + cardH / 2 },
          connectorOut: { x: x + cardW, y: yRow1 + cardH / 2 }
        });
      }

      const yRow2 = 330;
      const x4 = nodes[3].x;
      const x3 = nodes[2].x;
      const x2 = nodes[1].x;

      nodes.push({
        dim: CLINICAL_DIMENSIONS[4],
        x: x4,
        y: yRow2,
        width: cardW,
        height: cardH,
        connectorIn: { x: x4 + cardW / 2, y: yRow2 },
        connectorOut: { x: x4, y: yRow2 + cardH / 2 }
      });

      nodes.push({
        dim: CLINICAL_DIMENSIONS[5],
        x: x3,
        y: yRow2,
        width: cardW,
        height: cardH,
        connectorIn: { x: x3 + cardW, y: yRow2 + cardH / 2 },
        connectorOut: { x: x3, y: yRow2 + cardH / 2 }
      });

      nodes.push({
        dim: CLINICAL_DIMENSIONS[6],
        x: x2,
        y: yRow2,
        width: cardW,
        height: cardH,
        connectorIn: { x: x2 + cardW, y: yRow2 + cardH / 2 },
        connectorOut: { x: x2, y: yRow2 + cardH / 2 }
      });

    } else {
      // Linear mode
      const cardW = 205;
      const cardH = 175;
      const gapX = 40;
      const startX = 35;
      const y = 80;

      for (let i = 0; i < 7; i++) {
        const x = startX + i * (cardW + gapX);
        nodes.push({
          dim: CLINICAL_DIMENSIONS[i],
          x,
          y,
          width: cardW,
          height: cardH,
          connectorIn: { x, y: y + cardH / 2 },
          connectorOut: { x: x + cardW, y: y + cardH / 2 }
        });
      }
    }

    // Draw Connectors Layer
    const linksGroup = g.append('g').attr('class', 'links-layer');

    for (let i = 0; i < nodes.length - 1; i++) {
      const source = nodes[i];
      const target = nodes[i + 1];
      const isConnectionActive = activeDimId === source.dim.id || activeDimId === target.dim.id;
      const isSimulationPassing = isPlayingSimulation && simulationStep === target.dim.id;

      let pathD = '';
      if ((isDetailed || viewMode === 'compact') && i === 3) {
        // Bridge between node 4 and node 5 (end of row 1 to start of row 2)
        const sx = source.connectorOut.x;
        const sy = source.connectorOut.y;
        const tx = target.connectorIn.x;
        const ty = target.connectorIn.y;
        pathD = `M ${sx} ${sy} C ${sx + 75} ${sy}, ${tx + 75} ${ty - 60}, ${tx} ${ty}`;
      } else if ((isDetailed || viewMode === 'compact') && i >= 4) {
        // Row 2 moving left (5 -> 6, 6 -> 7)
        const sx = source.connectorOut.x;
        const sy = source.connectorOut.y;
        const tx = target.connectorIn.x;
        const ty = target.connectorIn.y;
        const midX = (sx + tx) / 2;
        pathD = `M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ty}, ${tx} ${ty}`;
      } else {
        // Normal horizontal connection
        const sx = source.connectorOut.x;
        const sy = source.connectorOut.y;
        const tx = target.connectorIn.x;
        const ty = target.connectorIn.y;
        const midX = (sx + tx) / 2;
        pathD = `M ${sx} ${sy} C ${midX} ${sy}, ${midX} ${ty}, ${tx} ${ty}`;
      }

      // Outer link stroke
      linksGroup.append('path')
        .attr('d', pathD)
        .attr('fill', 'none')
        .attr('stroke', isConnectionActive ? target.dim.colorHex : (isDark ? '#334155' : '#cbd5e1'))
        .attr('stroke-width', isConnectionActive ? 5 : 2.5)
        .attr('stroke-opacity', isConnectionActive ? 0.95 : 0.6)
        .attr('stroke-dasharray', isConnectionActive ? 'none' : '6,6')
        .attr('class', 'transition-all duration-300');

      // Animated glowing pulse
      if (isConnectionActive || isSimulationPassing) {
        const pulse = linksGroup.append('path')
          .attr('d', pathD)
          .attr('fill', 'none')
          .attr('stroke', target.dim.colorHex)
          .attr('stroke-width', 4)
          .attr('stroke-linecap', 'round')
          .attr('stroke-dasharray', '8,18')
          .attr('marker-end', `url(#arrow-${target.dim.id})`);

        const animateStroke = () => {
          pulse.transition()
            .duration(1200)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', (isDetailed || viewMode === 'compact') && i >= 4 ? 26 : -26)
            .on('end', animateStroke);
        };
        animateStroke();
      }

      // Interconnection Socket Badge (e.g., 1→2)
      const midPoint = ((isDetailed || viewMode === 'compact') && i === 3)
        ? { x: source.connectorOut.x + 45, y: (source.connectorOut.y + target.connectorIn.y) / 2 - 10 }
        : { x: (source.connectorOut.x + target.connectorIn.x) / 2, y: source.connectorOut.y };

      const badgeGroup = linksGroup.append('g')
        .attr('transform', `translate(${midPoint.x}, ${midPoint.y})`)
        .attr('class', 'cursor-pointer');

      badgeGroup.append('circle')
        .attr('r', 12)
        .attr('fill', isConnectionActive ? target.dim.colorHex : (isDark ? '#1e293b' : '#ffffff'))
        .attr('stroke', target.dim.colorHex)
        .attr('stroke-width', 2);

      badgeGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '4')
        .attr('font-size', '9.5px')
        .attr('font-weight', 'bold')
        .attr('fill', isConnectionActive ? '#ffffff' : target.dim.colorHex)
        .text(i + 1);
    }

    // Draw Nodes Layer
    const nodesGroup = g.append('g').attr('class', 'nodes-layer');

    nodes.forEach((node) => {
      const isSelected = activeDimId === node.dim.id;
      const isSimActive = isPlayingSimulation && simulationStep === node.dim.id;

      const nodeGroup = nodesGroup.append('g')
        .attr('class', 'chain-block cursor-pointer')
        .attr('transform', `translate(${node.x}, ${node.y})`)
        .on('click', () => {
          handleSelectDimension(node.dim.id);
        });

      if (isDetailed) {
        // DETAILED MEGA INFOGRAPHIC CARD (Renders everything inside the diagram!)
        // Outer Card rect
        nodeGroup.append('rect')
          .attr('width', node.width)
          .attr('height', node.height)
          .attr('rx', 20)
          .attr('ry', 20)
          .attr('fill', isDark ? (isSelected ? '#090d16' : '#111827') : (isSelected ? '#ffffff' : '#f8fafc'))
          .attr('stroke', isSelected ? node.dim.colorHex : (isDark ? '#374151' : '#e2e8f0'))
          .attr('stroke-width', isSelected ? 3.5 : 1.5)
          .attr('filter', isSelected ? 'url(#activeGlow)' : 'url(#blockShadow)');

        // Header Ribbon
        nodeGroup.append('path')
          .attr('d', `M 0 20 Q 0 0 20 0 L ${node.width - 20} 0 Q ${node.width} 0 ${node.width} 20 L ${node.width} 36 L 0 36 Z`)
          .attr('fill', `url(#grad-${node.dim.id})`);

        // Header text inside ribbon
        nodeGroup.append('text')
          .attr('x', 14)
          .attr('y', 23)
          .attr('font-size', '11px')
          .attr('font-weight', '900')
          .attr('font-family', 'ui-monospace, monospace')
          .attr('fill', '#ffffff')
          .attr('letter-spacing', '0.08em')
          .text(`ESLABÓN ${node.dim.numberStr} • AAP`);

        // Ribbon right tag
        nodeGroup.append('text')
          .attr('x', node.width - 14)
          .attr('y', 23)
          .attr('text-anchor', 'end')
          .attr('font-size', '9.5px')
          .attr('font-weight', '700')
          .attr('fill', '#ffffff')
          .text(node.dim.badge);

        // Title
        nodeGroup.append('text')
          .attr('x', 14)
          .attr('y', 58)
          .attr('font-size', '14px')
          .attr('font-weight', '900')
          .attr('font-family', 'system-ui, sans-serif')
          .attr('fill', isDark ? '#ffffff' : '#0f172a')
          .text(node.dim.title);

        // Clinical summary definition box
        const sumBoxY = 70;
        const sumBoxH = 46;
        nodeGroup.append('rect')
          .attr('x', 12)
          .attr('y', sumBoxY)
          .attr('width', node.width - 24)
          .attr('height', sumBoxH)
          .attr('rx', 10)
          .attr('fill', isDark ? `${node.dim.colorHex}15` : `${node.dim.colorHex}12`)
          .attr('stroke', `${node.dim.colorHex}35`)
          .attr('stroke-width', 1);

        // Summary Text lines
        const words = node.dim.summary.split(' ');
        let line1 = words.slice(0, 7).join(' ');
        let line2 = words.slice(7, 15).join(' ');
        let line3 = words.slice(15, 23).join(' ') + (words.length > 23 ? '...' : '');

        nodeGroup.append('text')
          .attr('x', 18)
          .attr('y', sumBoxY + 14)
          .attr('font-size', '9.5px')
          .attr('font-weight', '600')
          .attr('fill', isDark ? '#f1f5f9' : '#1e293b')
          .text(line1);

        nodeGroup.append('text')
          .attr('x', 18)
          .attr('y', sumBoxY + 28)
          .attr('font-size', '9.5px')
          .attr('font-weight', '600')
          .attr('fill', isDark ? '#f1f5f9' : '#1e293b')
          .text(line2);

        if (line3) {
          nodeGroup.append('text')
            .attr('x', 18)
            .attr('y', sumBoxY + 40)
            .attr('font-size', '9.5px')
            .attr('font-weight', '500')
            .attr('fill', isDark ? '#cbd5e1' : '#475569')
            .text(line3);
        }

        // 3-Part Micro-Pipeline within the card (Entrada -> Lógica -> Salida)
        const pipeY = 126;
        const pipeH = 110;

        nodeGroup.append('rect')
          .attr('x', 12)
          .attr('y', pipeY)
          .attr('width', node.width - 24)
          .attr('height', pipeH)
          .attr('rx', 12)
          .attr('fill', isDark ? '#0b1120' : '#f8fafc')
          .attr('stroke', isDark ? '#1e293b' : '#e2e8f0')
          .attr('stroke-width', 1);

        // 1. INPUT ROW
        nodeGroup.append('text')
          .attr('x', 18)
          .attr('y', pipeY + 16)
          .attr('font-size', '9.5px')
          .attr('font-weight', '900')
          .attr('fill', '#0284c7')
          .text('📥 ENTRADA:');

        nodeGroup.append('text')
          .attr('x', 84)
          .attr('y', pipeY + 16)
          .attr('font-size', '9.5px')
          .attr('font-weight', '600')
          .attr('fill', isDark ? '#cbd5e1' : '#334155')
          .text(node.dim.input.slice(0, 36) + '...');

        // 2. LOGIC / PROCESSING ROW
        nodeGroup.append('text')
          .attr('x', 18)
          .attr('y', pipeY + 44)
          .attr('font-size', '9.5px')
          .attr('font-weight', '900')
          .attr('fill', '#d97706')
          .text('⚙️ LÓGICA:');

        nodeGroup.append('text')
          .attr('x', 76)
          .attr('y', pipeY + 44)
          .attr('font-size', '9.5px')
          .attr('font-weight', '600')
          .attr('fill', isDark ? '#cbd5e1' : '#334155')
          .text(node.dim.processing.slice(0, 37) + '...');

        nodeGroup.append('text')
          .attr('x', 76)
          .attr('y', pipeY + 58)
          .attr('font-size', '9px')
          .attr('font-weight', '500')
          .attr('fill', isDark ? '#94a3b8' : '#64748b')
          .text(node.dim.processing.slice(37, 76) + '...');

        // 3. OUTPUT ROW
        nodeGroup.append('text')
          .attr('x', 18)
          .attr('y', pipeY + 86)
          .attr('font-size', '9.5px')
          .attr('font-weight', '900')
          .attr('fill', '#10b981')
          .text('📤 SALIDA:');

        nodeGroup.append('text')
          .attr('x', 78)
          .attr('y', pipeY + 86)
          .attr('font-size', '9.5px')
          .attr('font-weight', '700')
          .attr('fill', isDark ? '#34d399' : '#059669')
          .text(node.dim.output.slice(0, 37) + '...');

        nodeGroup.append('text')
          .attr('x', 78)
          .attr('y', pipeY + 100)
          .attr('font-size', '9px')
          .attr('font-weight', '500')
          .attr('fill', isDark ? '#94a3b8' : '#64748b')
          .text(node.dim.output.slice(37, 75) + '...');

        // AAP Safety Badge at bottom
        const footerY = 250;
        nodeGroup.append('rect')
          .attr('x', 12)
          .attr('y', footerY)
          .attr('width', node.width - 24)
          .attr('height', 36)
          .attr('rx', 10)
          .attr('fill', isDark ? '#1e293b' : '#f1f5f9')
          .attr('stroke', node.dim.colorHex)
          .attr('stroke-width', 1)
          .attr('stroke-opacity', 0.4);

        nodeGroup.append('text')
          .attr('x', 20)
          .attr('y', footerY + 15)
          .attr('font-size', '9px')
          .attr('font-weight', '800')
          .attr('fill', node.dim.colorHex)
          .text('🛡️ RESPALDO AAP / OMS:');

        nodeGroup.append('text')
          .attr('x', 20)
          .attr('y', footerY + 28)
          .attr('font-size', '8.5px')
          .attr('font-weight', '500')
          .attr('fill', isDark ? '#cbd5e1' : '#475569')
          .text(node.dim.aapStandard.slice(0, 48) + '...');

      } else {
        // COMPACT / LINEAR CARD
        nodeGroup.append('rect')
          .attr('width', node.width)
          .attr('height', node.height)
          .attr('rx', 18)
          .attr('ry', 18)
          .attr('fill', isDark ? (isSelected ? '#0f172a' : '#1e293b') : (isSelected ? '#ffffff' : '#f8fafc'))
          .attr('stroke', isSelected ? node.dim.colorHex : (isDark ? '#334155' : '#e2e8f0'))
          .attr('stroke-width', isSelected ? 3 : 1.5)
          .attr('filter', isSelected ? 'url(#activeGlow)' : 'url(#blockShadow)');

        nodeGroup.append('path')
          .attr('d', `M 0 18 Q 0 0 18 0 L ${node.width - 18} 0 Q ${node.width} 0 ${node.width} 18 L ${node.width} 38 L 0 38 Z`)
          .attr('fill', `url(#grad-${node.dim.id})`);

        nodeGroup.append('text')
          .attr('x', 14)
          .attr('y', 24)
          .attr('font-size', '11px')
          .attr('font-weight', '900')
          .attr('font-family', 'ui-monospace, monospace')
          .attr('fill', '#ffffff')
          .text(`DIMENSIÓN ${node.dim.numberStr}`);

        nodeGroup.append('text')
          .attr('x', node.width - 14)
          .attr('y', 24)
          .attr('text-anchor', 'end')
          .attr('font-size', '9.5px')
          .attr('font-weight', '700')
          .attr('fill', '#ffffff')
          .text(node.dim.badge);

        nodeGroup.append('text')
          .attr('x', 14)
          .attr('y', 60)
          .attr('font-size', '13.5px')
          .attr('font-weight', '800')
          .attr('fill', isDark ? '#ffffff' : '#0f172a')
          .text(node.dim.shortTitle);

        nodeGroup.append('text')
          .attr('x', 14)
          .attr('y', 77)
          .attr('font-size', '10px')
          .attr('font-weight', '500')
          .attr('fill', isDark ? '#94a3b8' : '#64748b')
          .text(node.dim.subtitle.length > 34 ? node.dim.subtitle.slice(0, 32) + '...' : node.dim.subtitle);

        const ioBoxY = 88;
        nodeGroup.append('rect')
          .attr('x', 10)
          .attr('y', ioBoxY)
          .attr('width', node.width - 20)
          .attr('height', 48)
          .attr('rx', 10)
          .attr('fill', isDark ? '#0b1120' : '#f1f5f9')
          .attr('stroke', isDark ? '#1e293b' : '#e2e8f0');

        nodeGroup.append('text')
          .attr('x', 18)
          .attr('y', ioBoxY + 16)
          .attr('font-size', '9px')
          .attr('font-weight', '800')
          .attr('fill', node.dim.colorHex)
          .text('IN :');

        nodeGroup.append('text')
          .attr('x', 42)
          .attr('y', ioBoxY + 16)
          .attr('font-size', '9px')
          .attr('font-weight', '500')
          .attr('fill', isDark ? '#cbd5e1' : '#334155')
          .text(node.dim.input.slice(0, 30) + '...');

        nodeGroup.append('text')
          .attr('x', 18)
          .attr('y', ioBoxY + 36)
          .attr('font-size', '9px')
          .attr('font-weight', '800')
          .attr('fill', '#10b981')
          .text('OUT:');

        nodeGroup.append('text')
          .attr('x', 44)
          .attr('y', ioBoxY + 36)
          .attr('font-size', '9px')
          .attr('font-weight', '500')
          .attr('fill', isDark ? '#cbd5e1' : '#334155')
          .text(node.dim.output.slice(0, 29) + '...');

        const footerY = 154;
        nodeGroup.append('circle')
          .attr('cx', 20)
          .attr('cy', footerY)
          .attr('r', 4.5)
          .attr('fill', isSelected ? node.dim.colorHex : '#94a3b8');

        nodeGroup.append('text')
          .attr('x', 30)
          .attr('y', footerY + 3.5)
          .attr('font-size', '10px')
          .attr('font-weight', '700')
          .attr('fill', isSelected ? node.dim.colorHex : (isDark ? '#94a3b8' : '#64748b'))
          .text(isSelected ? '★ Inspeccionando' : 'Clic para explorar');

        nodeGroup.append('text')
          .attr('x', node.width - 16)
          .attr('y', footerY + 3.5)
          .attr('text-anchor', 'end')
          .attr('font-size', '11px')
          .attr('font-weight', '900')
          .attr('fill', node.dim.colorHex)
          .text('➔');
      }

      // Simulation Active Glowing Halo
      if (isSimActive) {
        const simPulse = nodeGroup.append('rect')
          .attr('x', -8)
          .attr('y', -8)
          .attr('width', node.width + 16)
          .attr('height', node.height + 16)
          .attr('rx', 24)
          .attr('fill', 'none')
          .attr('stroke', node.dim.colorHex)
          .attr('stroke-width', 4)
          .attr('opacity', 0.95);

        simPulse.transition()
          .duration(700)
          .attr('opacity', 0.1)
          .transition()
          .duration(700)
          .attr('opacity', 0.95);
      }
    });

  }, [activeDimId, isDark, viewMode, isPlayingSimulation, simulationStep]);

  // Selected dimension object
  const selectedDimension = CLINICAL_DIMENSIONS.find(d => d.id === activeDimId) || CLINICAL_DIMENSIONS[0];

  return (
    <div className="space-y-6" ref={containerRef}>
      {/* Top Interactive Toolbar */}
      <div className={`p-5 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-4`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3 h-3 text-amber-900" />
                Diagrama Infográfico D3
              </span>
              <span className={`px-2.5 py-0.5 rounded-full ${isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-900'} text-[10px] font-extrabold`}>
                7 Dimensiones Clínicas Integradas en el Diagrama
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Cero Código Requerido
              </span>
            </div>
            <h3 className="font-rounded font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white">
              Diagrama Estructural en Cadena: Composición y Utilidad Médica
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Toda la composición clínica, entradas, procesamiento determinista, semáforos AAP y guardrails farmacológicos presentados directamente dentro de un diagrama interactivo en bloques interconectados.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Play Simulation Button */}
            <button
              type="button"
              onClick={handleToggleSimulation}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                isPlayingSimulation
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
              }`}
            >
              {isPlayingSimulation ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlayingSimulation ? 'Pausar Simulación' : '▶️ Simular Flujo Clínico'}</span>
            </button>

            {/* Layout switch */}
            <div className={`p-1 rounded-xl border flex items-center ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
              <button
                type="button"
                onClick={() => setViewMode('infographic')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'infographic'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Infografía Completa (Todo detallado dentro del diagrama)"
              >
                Infografía Completa
              </button>
              <button
                type="button"
                onClick={() => setViewMode('compact')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'compact'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Vista Compacta en Serpentina"
              >
                Compacto
              </button>
              <button
                type="button"
                onClick={() => setViewMode('linear')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'linear'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Vista Pipeline Lineal Horizontal"
              >
                Lineal
              </button>
            </div>

            {/* Export SVG */}
            <button
              type="button"
              onClick={handleExportSVG}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="Descargar Diagrama Vectorial SVG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Simulation Banner when playing */}
        {isPlayingSimulation && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
              <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                Simulación en Curso (Eslabón {simulationStep} de 7):
              </span>
              <span className="text-xs font-medium text-amber-800 dark:text-amber-300 truncate max-w-lg">
                {CLINICAL_DIMENSIONS.find(d => d.id === simulationStep)?.simulatedData}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-200">
              Transmitiendo Paquete Clínico
            </span>
          </div>
        )}

        {/* The D3 Canvas Frame with Floating Zoom Controls */}
        <div className={`relative rounded-2xl overflow-hidden border ${isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-50/70 border-slate-200'} shadow-inner`}>
          {/* Quick instructions floating in corner */}
          <div className="absolute top-3 left-4 z-10 pointer-events-none flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-mono">
              🖱️ Clic en cualquier bloque | Arrastre y rueda para Zoom
            </span>
          </div>

          {/* Floating Zoom & Reset Buttons */}
          <div className="absolute top-3 right-4 z-10 flex items-center gap-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
              title="Acercar (Zoom In)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
              title="Alejar (Zoom Out)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
              title="Restablecer Vista"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              ref={svgRef}
              className={`w-full h-auto select-none block ${viewMode === 'infographic' ? 'min-h-[520px] max-h-[780px]' : 'min-h-[380px] max-h-[600px]'}`}
            />
          </div>
        </div>

        {/* Quick Steps Navigation Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1">
          {CLINICAL_DIMENSIONS.map((dim) => {
            const isSelected = activeDimId === dim.id;
            return (
              <button
                key={dim.id}
                type="button"
                onClick={() => handleSelectDimension(dim.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? isDark
                      ? 'bg-slate-800 border-amber-400 text-amber-300 ring-2 ring-amber-400/40 shadow-xs'
                      : 'bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-400/40 shadow-xs'
                    : isDark
                    ? 'bg-slate-800/60 hover:bg-slate-800 border-slate-700 text-slate-300'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[9.5px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded-sm text-white"
                    style={{ backgroundColor: dim.colorHex }}
                  >
                    D{dim.numberStr}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {dim.badge.split(' ')[0]}
                  </span>
                </div>
                <div className="font-bold text-[11px] leading-tight mt-1.5 truncate">
                  {dim.shortTitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* INSPECTOR DETALLADO DEL BLOQUE SELECCIONADO EN D3 */}
      <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-amber-200'} shadow-sm space-y-5 animate-fadeIn`}>
        {/* Header of selected block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-100 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md text-white font-extrabold text-lg font-mono"
              style={{ background: `linear-gradient(135deg, ${selectedDimension.bgGradient[0]}, ${selectedDimension.bgGradient[1]})` }}
            >
              {selectedDimension.numberStr}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: selectedDimension.colorHex }}
                >
                  Bloque Eslabón #{selectedDimension.numberStr}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedDimension.badge}
                </span>
              </div>
              <h4 className="font-rounded font-extrabold text-base sm:text-xl text-slate-900 dark:text-white mt-1">
                {selectedDimension.title}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSelectDimension(selectedDimension.id > 1 ? selectedDimension.id - 1 : 7)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
              }`}
            >
              ← Anterior
            </button>
            <button
              type="button"
              onClick={() => handleSelectDimension(selectedDimension.id < 7 ? selectedDimension.id + 1 : 1)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs text-white transition-all cursor-pointer shadow-xs flex items-center gap-1.5`}
              style={{ backgroundColor: selectedDimension.colorHex }}
            >
              <span>Siguiente</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Resumen clínico esencial */}
        <div
          className="p-4 rounded-2xl border space-y-1.5"
          style={{
            backgroundColor: isDark ? `${selectedDimension.colorHex}15` : `${selectedDimension.colorHex}10`,
            borderColor: `${selectedDimension.colorHex}40`
          }}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Utilidad Clínica Determinista en el Dataset:
          </span>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
            {selectedDimension.summary}
          </p>
        </div>

        {/* Flujo de Datos del Bloque: Input -> Procesamiento -> Output */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ENTRADA (INPUT) */}
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-sky-50/70 border-sky-200'} space-y-2`}>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-bold text-[10px] flex items-center justify-center">📥</span>
              <h5 className="font-bold text-xs uppercase tracking-wider text-sky-900 dark:text-sky-300">
                1. Datos de Entrada (Input)
              </h5>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedDimension.input}
            </p>
          </div>

          {/* PROCESAMIENTO DETERMINISTA */}
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-amber-50/70 border-amber-200'} space-y-2`}>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">⚙️</span>
              <h5 className="font-bold text-xs uppercase tracking-wider text-amber-900 dark:text-amber-300">
                2. Lógica Algorítmica Cero Azar
              </h5>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedDimension.processing}
            </p>
          </div>

          {/* SALIDA (OUTPUT) */}
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-emerald-50/70 border-emerald-200'} space-y-2`}>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center">📤</span>
              <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                3. Salida Inmutable (Output)
              </h5>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedDimension.output}
            </p>
          </div>
        </div>

        {/* Respaldo AAP & Impacto en Salud */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-indigo-50/60 border-indigo-200'} space-y-1.5`}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h6 className="font-bold text-xs text-indigo-950 dark:text-indigo-300">
                Respaldo Oficial Guías AAP 2024 / OMS
              </h6>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedDimension.aapStandard}
            </p>
          </div>

          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-rose-50/60 border-rose-200'} space-y-1.5`}>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <h6 className="font-bold text-xs text-rose-950 dark:text-rose-300">
                Impacto en Seguridad y Cuidado del Paciente
              </h6>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedDimension.clinicalSafety}
            </p>
          </div>
        </div>

        {/* Live Case Data Example */}
        <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 text-white'} flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm`}>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Ejemplo en Vivo en Registro Clínico Simulado:
              </span>
              <p className="text-xs font-mono font-semibold text-emerald-300 mt-0.5">
                {selectedDimension.simulatedData}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleSimulation}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Ejecutar Simulación Completa</span>
          </button>
        </div>
      </div>
    </div>
  );
};
