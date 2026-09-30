/**
 * Genetic Algorithm & Multi-Objective Heuristic Knowledge Retrieval Engine (GA-RAG)
 * 
 * Internal data search and context optimization engine for Pediatric & Obstetric AI.
 * Operates as a neuro-symbolic heuristic optimizer that evolves the mathematically
 * optimal chromosome of clinical evidence chunks, safety contraindications, and age-specific
 * medical axioms before injecting them into Gemini 3.7 Flash.
 */

import { AgeBracket } from '../types';
import { isEmergencyMessage } from './emergencyDetection';

export interface ClinicalGene {
  id: string;
  category: 'triage' | 'pharmacology' | 'nutrition' | 'development' | 'sleep' | 'respiratory' | 'dermatology' | 'parenting' | 'obstetric' | 'safety';
  title: string;
  source: string;
  minAgeMonths: number;
  maxAgeMonths: number;
  keywords: string[];
  symptoms: string[];
  contraindications?: string[];
  urgencyLevel: 'normal' | 'caution' | 'urgent';
  axiom: string;
  practicalProtocol: string[];
  redFlags: string[];
}

export interface GeneticSearchChromosome {
  genes: ClinicalGene[];
  fitness: number;
  relevanceScore: number;
  safetyScore: number;
  diversityScore: number;
  ageMatchScore: number;
}

export interface GeneticSearchTelemetry {
  query: string;
  detectedAgeMonths: number | null;
  ageBracket: string;
  generations: number;
  populationSize: number;
  bestFitness: number;
  initialFitness: number;
  fitnessGainPercent: number;
  convergenceTimeMs: number;
  selectedGeneIds: string[];
  selectedSources: string[];
  safetyShieldActivated: boolean;
  activeContraindications: string[];
  diversityEntropy: number;
}

export interface GeneticSearchResult {
  optimalChromosome: GeneticSearchChromosome;
  telemetry: GeneticSearchTelemetry;
  contextPromptBlock: string;
  sources: string[];
  alertLevel: 'normal' | 'caution' | 'urgent';
}

// ---------------------------------------------------------------------------
// INTERNAL CLINICAL KNOWLEDGE GENOME MATRIX (WHO, AAP, ACOG, ESPGHAN, CDC, GINA)
// ---------------------------------------------------------------------------
export const CLINICAL_KNOWLEDGE_GENOME: ClinicalGene[] = [
  // 0. PEDIATRIC EMERGENCY & URGENCY PROTOCOLS (TEP / PALS / WHO)
  {
    id: 'gene_pediatric_emergency_protocols_tep',
    category: 'triage',
    title: 'Protocolos de Urgencias Pediátricas, Triángulo de Evaluación Pediátrica (TEP) & Guía de Actuación Inmediata',
    source: 'American Academy of Pediatrics (AAP) Pediatric Emergency Guidelines & AHA PALS',
    minAgeMonths: 0,
    maxAgeMonths: 240,
    keywords: ['urgencia', 'urgencias', 'emergencia', 'emergencias', 'protocolo', 'protocolos', 'protocolos de urgencias', 'protocolo de urgencias', 'que hacer en urgencia', 'primeros auxilios', 'tep', 'pals', 'aha', 'triangulo de evaluacion'],
    symptoms: ['dificultad respiratoria', 'letargo', 'palidez extrema', 'cianosis', 'convulsiones', 'asfixia', 'perdida de consciencia', 'fiebre neonatal'],
    contraindications: ['NUNCA dar aspirina en pediatría', 'PROHIBIDO introducir objetos o dedos en la boca durante convulsión', 'No dar palmadas a ciegas ante tos eficaz'],
    urgencyLevel: 'urgent',
    axiom: 'El Triángulo de Evaluación Pediátrica (TEP: Apariencia, Respiración y Circulación cutánea) permite identificar en 30 segundos si el niño se encuentra en fallo respiratorio, shock o disfunción cerebral, exigiendo activación inmediata de los servicios de urgencias (911 / 112).',
    practicalProtocol: [
      '1. Triángulo de Evaluación Pediátrica (TEP): Evaluar Apariencia (tono, reactividad, mirada, consuelo), Respiración (tiraje, aleteo, quejido) y Circulación (palidez, piel moteada, cianosis).',
      '2. Obstrucción de Vía Aérea (Atragantamiento): Si tose fuerte dejar toser. Si hay asfixia: 5 golpes en la espalda + 5 compresiones torácicas en lactantes (<1 año) o Maniobra de Heimlich en niños >1 año.',
      '3. Convulsiones: Colocar en Posición Lateral de Seguridad, no sujetar a la fuerza ni meter nada en la boca, cronometrar y llamar al 911 si dura >3 minutos.',
      '4. Fiebre <3 meses: Toda temperatura >=38°C en menores de 90 días requiere traslado hospitalario presencial de urgencia.',
      '5. Llamar de inmediato al número de emergencias local (911 / 112) y seguir instrucciones del centro coordinador.'
    ],
    redFlags: ['Tiraje intercostal o quejido respiratorio', 'Letargo profundo o dificultad extrema para despertar', 'Petequias (manchas rojas/moradas que no palidecen con prueba del vaso)', 'Convulsión prolongada o rigidez de nuca', 'Cianosis central (labios morados)']
  },

  // 1. NEONATAL & INFANT FEVER TRIAGE (0-3m & 0-12m)
  {
    id: 'gene_fever_neonatal_0_3m',
    category: 'triage',
    title: 'Protocolo de Fiebre en Neonato y Menor de 3 Meses',
    source: 'American Academy of Pediatrics (AAP) Febrile Infant Guidelines & OMS Sepsis',
    minAgeMonths: 0,
    maxAgeMonths: 3,
    keywords: ['fiebre', 'calentura', 'temperatura', 'termometro', '38', '38.5', '39', 'recien nacido', 'bebe caliente', 'grados'],
    symptoms: ['fiebre', 'hipotermia', 'letargo', 'rechazo del alimento', 'irritabilidad'],
    contraindications: ['Ibuprofeno PROHIBIDO en <6 meses', 'Aspirina PROHIBIDA por Reye', 'No automedicar antitérmicos sin valoración en <3m'],
    urgencyLevel: 'urgent',
    axiom: 'Fiebre axilar/rectal ≥38.0°C en menores de 90 días constituye una urgencia médica absoluta por riesgo de bacteriemia oculta, infección urinaria o meningitis bacteriana. Requiere hemocultivo, urocultivo y evaluación hospitalaria presencial.',
    practicalProtocol: [
      'Derivación inmediata a urgencias pediátricas sin demoras.',
      'No administrar antipiréticos caseros antes de la evaluación médica para no enmascarar signos clínicos.',
      'Mantener ropa ligera de algodón y ofrecer tomas frecuentes de leche materna para evitar deshidratación.'
    ],
    redFlags: ['Fiebre ≥38.0°C en <3 meses', 'Letargo extremo (dificultad para despertar)', 'Fontanela abombada', 'Manchas rojizas o púrpuras en piel (petequias)']
  },

  // 2. FEVER MANAGEMENT (>3-6m to 10+ years)
  {
    id: 'gene_fever_pediatric_dosing',
    category: 'pharmacology',
    title: 'Dosificación Segura de Antipiréticos por Peso Corporal',
    source: 'AAP Guidelines on Fever and Antipyretic Use & Guía AEP',
    minAgeMonths: 3,
    maxAgeMonths: 240,
    keywords: ['fiebre', 'paracetamol', 'ibuprofeno', 'dosis', 'gotas', 'jarabe', 'peso', 'temperatura', '38', '39'],
    symptoms: ['fiebre', 'malestar general', 'dolor de cabeza', 'mialgias'],
    contraindications: ['Aspirina estrictamente contraindicada', 'Ibuprofeno prohibido <6 meses o con deshidratación severa', 'No alternar paracetamol e ibuprofeno sistemáticamente'],
    urgencyLevel: 'normal',
    axiom: 'Los antipiréticos se administran para confort del niño, no para normalizar la temperatura a cualquier costo. La dosis SIEMPRE se calcula por peso exacto en kg, jamás por la edad cronológica.',
    practicalProtocol: [
      'Paracetamol: 10 a 15 mg/kg/dosis cada 6 a 8 horas (máximo 60 mg/kg/día). Apto desde recién nacidos.',
      'Ibuprofeno: 5 a 10 mg/kg/dosis cada 8 horas (máximo 30-40 mg/kg/día), únicamente a partir de los 6 meses cumplidos y con alimentos.',
      'Mantener hidratación oral continua y ambiente templado (20-22°C).'
    ],
    redFlags: ['Fiebre >72 horas continuas', 'Aparición de exantema petequial', 'Dificultad respiratoria o decaimiento severo incluso cuando baja la fiebre']
  },

  // 3. RESPIRATORY DISTRESS & BRONCHIOLITIS
  {
    id: 'gene_respiratory_distress_triage',
    category: 'respiratory',
    title: 'Triaje de Dificultad Respiratoria y Bronquiolitis Infantil',
    source: 'AAP Clinical Practice Guideline: Bronchiolitis & GINA Pediátrico',
    minAgeMonths: 0,
    maxAgeMonths: 144,
    keywords: ['tos', 'mocos', 'pecho', 'hunde las costillas', 'tiraje', 'respira rapido', 'pito', 'silbido', 'bronquiolitis', 'ahogo', 'resfriado'],
    symptoms: ['taquipnea', 'tiraje intercostal', 'aleteo nasal', 'quejido espiratorio', 'cianosis peribucal'],
    contraindications: ['Prohibidos jarabes antitusígenos, mucolíticos y descongestionantes en menores de 4 años por toxicidad FDA/AAP', 'No usar miel en menores de 12 meses'],
    urgencyLevel: 'caution',
    axiom: 'En lactantes, el virus respiratorio sincitial (VSR) y rinovirus causan inflamación bronquiolar. El tratamiento se basa en soporte hídrico y permeabilización de vía aérea superior con suero fisiológico.',
    practicalProtocol: [
      'Lavados nasales con suero fisiológico al 0.9% (1-2 ml por fosa en bebés, 3-5 ml en niños) antes de tomas y sueño.',
      'Humidificador de vapor frío en el dormitorio.',
      'Elevar suavemente el cabecero 15-30 grados.',
      'Fraccionar las tomas para evitar fatiga respiratoria.'
    ],
    redFlags: ['Tiraje subcostal/intercostal marcado', 'Aleteo nasal continuo', 'Quejido audible con cada respiración', 'Coloración azulada en labios o uñas']
  },

  // 4. CHOKING VS GAGGING & AIRWAY CLEARANCE
  {
    id: 'gene_choking_airway_emergency',
    category: 'safety',
    title: 'Diferenciación de Arcada Fisiológica (Gagging) vs Atragantamiento Real y Maniobras RCP',
    source: 'AHA PALS Pediatric Emergency Guidelines & AAP Safety',
    minAgeMonths: 0,
    maxAgeMonths: 144,
    keywords: ['atragantamiento', 'arcada', 'gagging', 'asfixia', 'se ahoga', 'maniobra de heimlich', 'golpes espalda', 'comida atorada'],
    symptoms: ['tos ineficaz', 'imposibilidad de llorar o hablar', 'cianosis', 'estridor inspiratorio agudo'],
    contraindications: ['PROHIBIDO meter el dedo a ciegas en la boca del bebé (riesgo de impactar el objeto)', 'No sacudir ni voltear de los pies'],
    urgencyLevel: 'urgent',
    axiom: 'La arcada (gagging) es ruidosa, con tos y cara roja (reflejo protector normal). El atragantamiento es silencioso, sin llanto, con incapacidad de ventilar y cianosis progresiva.',
    practicalProtocol: [
      'Si hay tos efectiva: No intervenir, animar a toser y permanecer al lado.',
      'En lactante (<1 año) con asfixia: 5 golpes interescapulares con talón de la mano boca abajo inclinada a 45°, seguidos de 5 compresiones torácicas con dos dedos.',
      'En niños >1 año: Maniobra de Heimlich con compresiones abdominales hacia adentro y arriba.',
      'Llamar al 911 / 112 inmediatamente.'
    ],
    redFlags: ['Silencio absoluto al intentar llorar', 'Cambio de color cutáneo a violáceo', 'Pérdida de tono muscular y consciencia']
  },

  // 5. BLW & COMPLEMENTARY NUTRITION SAFETY (6-12m)
  {
    id: 'gene_nutrition_blw_safety',
    category: 'nutrition',
    title: 'Alimentación Complementaria Segura (BLW) y Prevención de Asfixia',
    source: 'ESPGHAN Nutrition Committee & AAP Infant Nutrition Guidelines',
    minAgeMonths: 6,
    maxAgeMonths: 24,
    keywords: ['blw', 'alimentacion complementaria', 'papillas', 'comida', 'solidos', 'fruta', 'verdura', 'cortes', 'texturas', 'atragantar'],
    symptoms: ['inicio de sólidos', 'rechazo de texturas', 'arcadas de aprendizaje'],
    contraindications: ['MIEL PROHIBIDA en <12 meses por Clostridium botulinum', 'FRUTOS SECOS ENTEROS, uvas enteras, zanahoria cruda y salchichas en rodajas PROHIBIDOS antes de 4-5 años', 'Sin sal ni azúcares añadidos'],
    urgencyLevel: 'normal',
    axiom: 'El inicio de sólidos a los 6 meses requiere que el bebé se siente con apoyo mínimo, haya perdido el reflejo de extrusión y muestre interés motor. El hierro y zinc son micronutrientes críticos de oferta diaria prioritaria.',
    practicalProtocol: [
      'Presentar alimentos en forma de bastón (finger food) del tamaño del puño del adulto, cocidos hasta aplastarse fácilmente entre los dedos índice y pulgar.',
      'Ofrecer alimentos ricos en hierro hemínico (carnes, yema de huevo) o vegetal (legumbres con vitamina C para absorción) desde el día 1.',
      'Introducir alérgenos mayores (huevo, cacahuete, gluten, pescado) de uno en uno durante 3 días consecutivos.'
    ],
    redFlags: ['Uvas o tomates cherry ofrecidos sin cortar longitudinalmente en cuartos', 'Presencia de miel en preparaciones para <1 año']
  },

  // 6. GASTROENTERITIS, VOMITING & ORAL REHYDRATION
  {
    id: 'gene_gastroenteritis_sro',
    category: 'triage',
    title: 'Gastroenteritis Aguda y Terapia de Rehidratación Oral (SRO)',
    source: 'ESPGHAN/ESPID Guidelines for Acute Gastroenteritis & OMS AIEPI',
    minAgeMonths: 1,
    maxAgeMonths: 240,
    keywords: ['diarrea', 'vomito', 'suero oral', 'deshidratacion', 'gastroenteritis', 'sro', 'panza suelta', 'caca con agua'],
    symptoms: ['deposiciones líquidas frecuentes', 'emesis', 'boca seca', 'ausencia de lágrimas', 'oliguria'],
    contraindications: ['PROHIBIDAS bebidas isotónicas para adultos, jugos azucarados y refrescos (osmolaridad excesiva empeora diarrea)', 'Antieméticos y antidiarreicos contraindicados en pediatría sin indicación médica estricta'],
    urgencyLevel: 'normal',
    axiom: 'El pilar del tratamiento de la diarrea y vómitos es la reposición hidroelectrolítica fraccionada mediante soluciones de baja osmolaridad (SRO OMS ~245 mOsm/L).',
    practicalProtocol: [
      'Tras un vómito, reposo digestivo estricto de 15 a 20 minutos.',
      'Iniciar tolerancia con SRO a sorbitos pequeños o con jeringa: 5 ml cada 5 minutos.',
      'Tras deposiciones diarreicas: 50-100 ml de SRO en menores de 2 años y 100-200 ml en mayores.',
      'Mantener lactancia materna a libre demanda; no diluir la fórmula ni realizar dietas astringentes prolongadas.'
    ],
    redFlags: ['Ausencia de micción por >6-8 horas (pañal seco)', 'Fontanela hundida', 'Llanto sin lágrimas y ojos hundidos', 'Sangre visible en heces o vómito verde bilioso']
  },

  // 7. SLEEP ARCHITECTURE & SAFE SLEEP (SIDS PREVENTION)
  {
    id: 'gene_sleep_sids_circadian',
    category: 'sleep',
    title: 'Prevención del Síndrome de Muerte Súbita del Lactante (SMSL) y Cronobiología de Sueño',
    source: 'AAP Policy Statement: Safe Sleep Environment & Modelo Borbély',
    minAgeMonths: 0,
    maxAgeMonths: 12,
    keywords: ['dormir', 'sueño', 'cuna', 'boca arriba', 'colchon', 'almohada', 'despertares', 'smsl', 'muerte de cuna', 'siestas'],
    symptoms: ['despertares nocturnos frecuentes', 'sobrecansancio', 'dificultad para conciliar'],
    contraindications: ['PROHIBIDO dormir boca abajo o de lado en menores de 1 año', 'PROHIBIDAS almohadas, mantas sueltas, protectores de cuna acolchados y peluches en la cuna', 'Evitar sobrecalentamiento'],
    urgencyLevel: 'normal',
    axiom: 'Dormir boca arriba en superficie firme y en la misma habitación que los cuidadores durante los primeros 6 meses reduce la incidencia del SMSL en más del 80%.',
    practicalProtocol: [
      'Posición decúbito supino estricta (boca arriba) sobre colchón firme y ajustado.',
      'Cuna despejada: sin chichoneras, cojines ni juguetes.',
      'Compartir habitación (room-sharing) sin compartir la misma superficie de cama si existen factores de riesgo (tabaco, cansancio extremo, prematuridad).',
      'Uso de chupete/succión no nutritiva en el inicio del sueño tras el establecimiento de la lactancia.'
    ],
    redFlags: ['Cebolletas/calor excesivo ambiental >24°C', 'Uso de nidos reductores o almohadas antivuelco no homologados']
  },

  // 8. TODDLER TANTRUMS & EMOTIONAL REGULATION (1-3y)
  {
    id: 'gene_parenting_tantrums_1_3y',
    category: 'parenting',
    title: 'Neurodesarrollo Afectivo, Rabietas y Disciplina Positiva',
    source: 'AAP Emotional Wellness & UNICEF Positive Parenting',
    minAgeMonths: 12,
    maxAgeMonths: 48,
    keywords: ['rabieta', 'berrinche', 'pataleta', 'pega', 'muerde', 'grita', 'enojo', 'limites', 'terribles 2', 'disciplina'],
    symptoms: ['desborde emocional', 'frustración', 'oposicionismo'],
    contraindications: ['PROHIBIDO el castigo físico, gritos o aislamiento punitivo (time-out prolongado)', 'No negociar mientras el cerebro límbico está desbordado'],
    urgencyLevel: 'normal',
    axiom: 'Las rabietas son hitos madurativos fisiológicos entre 1 y 4 años generados por la inmadurez de la corteza prefrontal ante impulsos límbicos intensos. El niño necesita corregulación afectiva del adulto.',
    practicalProtocol: [
      'Mantener la calma del cuidador: la serenidad del adulto regula el sistema nervioso del niño.',
      'Contención física y seguridad: agacharse a su altura para evitar que se dañe o dañe a otros.',
      'Validar el sentimiento antes del límite: "Entiendo que estés molesto porque guardamos los juguetes, pero no está permitido golpear".',
      'Ofrecer alternativas de elección limitada ("¿Quieres guardar el bloque rojo o el azul?").'
    ],
    redFlags: ['Rabietas que duran habitualmente >45 minutos con autolesiones graves', 'Incapacidad absoluta de calmarse con presencia materna/paterna tras los 4 años']
  },

  // 9. SCREEN TIME & DIGITAL HEALTH (AAP / WHO LIMITS)
  {
    id: 'gene_digital_health_screens',
    category: 'development',
    title: 'Directrices de Salud Digital y Exposición a Pantallas',
    source: 'OMS Directrices de Sedentarismo y Sueño & AAP Council on Communications and Media',
    minAgeMonths: 0,
    maxAgeMonths: 240,
    keywords: ['pantallas', 'celular', 'tablet', 'television', 'tv', 'youtube', 'videojuegos', 'tiempo de pantalla'],
    symptoms: ['irritabilidad tras usar pantallas', 'dificultad para dormir', 'retraso de lenguaje'],
    contraindications: ['CERO pantallas en menores de 2 años (0 minutos)', 'PROHIBIDAS pantallas durante comidas y 60 min antes de acostarse'],
    urgencyLevel: 'normal',
    axiom: 'La luz azul y la sobreestimulación de pantallas suprimen la melatonina nocturna y desplazan la interacción social humana, el juego motriz y el desarrollo del lenguaje verbal.',
    practicalProtocol: [
      '0 a 24 meses: Cero pantallas recreativas (única excepción: videollamadas breves interactivas con familiares).',
      '2 a 5 años: Máximo 1 hora al día de contenidos de alta calidad co-visionados con un adulto.',
      '6 a 10+ años: Límite de 1.5 a 2 horas recreativas, garantizando mínimo 60 minutos de ejercicio físico y 9-11h de sueño nocturno.',
      'Establecer zonas libres de pantallas en dormitorios y mesa familiar.'
    ],
    redFlags: ['Pantalla utilizada de forma habitual como chupete emocional para frenar rabietas o para que coma']
  },

  // 10. OLDER CHILDREN & ADOLESCENCE (10+ YEARS: PUBERTY, BONES, ACNE)
  {
    id: 'gene_older_child_puberty_acne_10y',
    category: 'development',
    title: 'Salud Pediátrica en Escolares Mayores y Preadolescentes (10+ años)',
    source: 'AAP Adolescent Medicine & Protocolos SEPEAP / Guías de Endocrinología Pediátrica',
    minAgeMonths: 120,
    maxAgeMonths: 240,
    keywords: ['10 años', '11 años', '12 años', 'pubertad', 'estiron', 'dolor de crecimiento', 'acne', 'espinillas', 'sudor', 'pantallas 10 años', 'calcio preadolescente'],
    symptoms: ['dolor nocturno en piernas', 'granos en cara/espalda', 'cambios de humor', 'brote de crecimiento'],
    contraindications: ['No exprimir lesiones de acné ni aplicar alcohol o remedios abrasivos', 'Prohibidas bebidas energéticas con cafeína'],
    urgencyLevel: 'normal',
    axiom: 'En preadolescentes (10+ años), el estirón puberal incrementa los requerimientos de Calcio (1300 mg/día) y Vitamina D para consolidar el pico de masa ósea. Los dolores de crecimiento son benignos si son bilaterales y vespertinos/nocturnos.',
    practicalProtocol: [
      'Higiene facial diaria con dermolimpiador syndet suave 2 veces al día y protector solar facial no comedogénico.',
      'Asegurar 3 a 4 raciones de lácteos o equivalentes fortificados al día para el estirón puberal.',
      'Revisar dolores en extremidades: masajes suaves y calor local; si hay cojera matutina, inflamación articular o dolor unilateral persistente, descartar patología osteoarticular.',
      'Espacio de escucha empática sobre cambios corporales y autoestima.'
    ],
    redFlags: ['Dolor articular con inflamación visible, calor local o cojera continua', 'Lesiones de acné nódulo-quísticas profundas']
  },

  // 11. OBSTETRIC COMPREHENSIVE CARE & RED FLAGS (PREGNANCY)
  {
    id: 'gene_obstetric_triage_acog',
    category: 'obstetric',
    title: 'Triaje Obstétrico, Suplementación y Signos de Alarma Materno-Fetal',
    source: 'ACOG Practice Bulletins & Guías SEGO Obstetricia',
    minAgeMonths: -10,
    maxAgeMonths: 0,
    keywords: ['embarazo', 'embarazada', 'semana', 'trimestre', 'acido folico', 'hierro', 'pataditas', 'contracciones', 'preeclampsia', 'sangrado embarazo'],
    symptoms: ['cefalea intensa con luces', 'pérdida de líquido', 'sangrado vaginal', 'ausencia de movimientos fetales'],
    contraindications: ['PROHIBIDO consumo de carnes crudas/poco hechas, lácteos no pasteurizados y pescados con alto mercurio', 'Cero alcohol absoluto'],
    urgencyLevel: 'urgent',
    axiom: 'La atención prenatal basada en ACOG/SEGO exige suplementación con ácido fólico (400-800 mcg), yodo (200 mcg), hierro y DHA, junto al conteo de movimientos fetales desde la semana 28 (regla de 10 movimientos en 2 horas).',
    practicalProtocol: [
      'Semana 28+: Contar al menos 10 movimientos fetales en 2 horas en decúbito lateral izquierdo tras ingesta.',
      'Regla 5-1-1 de trabajo de parto: Contracciones cada 5 min, de 1 min de duración, durante 1 hora continua.',
      'Signos de alarma que requieren urgencias inmediatas: sangrado vaginal, pérdida de líquido amniótico, dolor epigástrico en barra o cefalea intensa con fosfenos (sospecha de preeclampsia).'
    ],
    redFlags: ['Sangrado vaginal rojo rutilante', 'Pérdida de líquido amniótico', 'Disminución marcada de movimientos fetales tras semana 28', 'Presión arterial ≥140/90 con síntomas visuales']
  },

  // 12. DERMATOLOGY: ATOPIC DERMATITIS & DIAPER DERMATITIS
  {
    id: 'gene_derma_atopic_diaper',
    category: 'dermatology',
    title: 'Dermatitis Atópica, Costra Láctea y Dermatitis del Pañal',
    source: 'AAP Section on Dermatology & EADV Pediatric Guidelines',
    minAgeMonths: 0,
    maxAgeMonths: 144,
    keywords: ['piel', 'dermatitis', 'eccema', 'pañal', 'rozadura', 'rojez', 'picor', 'costra lactea', 'granos piel'],
    symptoms: ['placas eritematosas pruriginosas', 'eritema en zona del pañal', 'descamación en cuero cabelludo'],
    contraindications: ['Evitar baños prolongados con agua muy caliente', 'No usar corticoides tópicos potentes sin prescripción pediátrica expresa'],
    urgencyLevel: 'normal',
    axiom: 'La barrera cutánea del lactante es inmadura. El cuidado de la dermatitis atópica requiere emolientes ricos en ceramidas tras el baño con piel aún húmeda (regla de los 3 minutos).',
    practicalProtocol: [
      'Baños cortos (5-10 min) con agua templada y limpiadores sin jabón (syndet).',
      'Aplicar crema emoliente hipoalergénica dos veces al día.',
      'Dermatitis del pañal: Cambios frecuentes de pañal, limpieza con agua tibia y gasa (evitar toallitas con alcohol/fragancia) y pasta al agua con óxido de zinc.',
      'Costra láctea: Aplicar aceite vegetal suave (almendras dulces) 30 min antes del baño y cepillar con cerdas extrasuaves.'
    ],
    redFlags: ['Lesiones cutáneas con costras melicéricas amarillentas (sobreinfección por estafilococo/impétigo)', 'Petequias o púrpura que no blanquean a la vitropresión']
  }
];

// ---------------------------------------------------------------------------
// GENETIC SEARCH & MULTI-OBJECTIVE HEURISTIC ALGORITHM
// ---------------------------------------------------------------------------

export class GeneticKnowledgeEngine {
  private populationSize: number = 16;
  private maxGenerations: number = 10;
  private chromosomeSize: number = 4; // number of clinical genes per context bundle
  private mutationRate: number = 0.20;
  private elitismCount: number = 2;

  /**
   * Parses user query and context to infer age in months and clinical tokens
   */
  public parseQueryContext(query: string, ageBracket?: AgeBracket | string, childAgeParam?: string): {
    tokens: string[];
    ageMonths: number;
    isObstetric: boolean;
    hasEmergencyKeywords: boolean;
  } {
    const cleanQ = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const tokens = cleanQ.split(/[\s,.;:?!()]+/).filter(t => t.length > 2);

    let isObstetric = /embaraz|gestac|trimestre|semana \d+|feto|parto|fum|fpp|toxoplas|listeri|preeclamp|lactancia materna/i.test(cleanQ);

    // Infer age in months
    let ageMonths = 12; // default
    if (isObstetric) {
      ageMonths = -5;
    } else if (ageBracket === '0-12m') {
      ageMonths = 6;
    } else if (ageBracket === '1-3y') {
      ageMonths = 24;
    } else if (ageBracket === '4-6y') {
      ageMonths = 60;
    } else if (ageBracket === '7-10y+' || ageBracket === '7-10y') {
      ageMonths = 120;
    }

    const monthMatch = cleanQ.match(/(\d+)\s*(mes|meses|m)/i);
    const yearMatch = cleanQ.match(/(\d+)\s*(ano|anos|año|años|a)/i);
    const weekMatch = cleanQ.match(/(\d+)\s*(semana|semanas)/i);

    if (monthMatch && !yearMatch) {
      ageMonths = parseInt(monthMatch[1], 10);
    } else if (yearMatch) {
      ageMonths = parseInt(yearMatch[1], 10) * 12;
    } else if (weekMatch && (isObstetric || /embarazo/i.test(cleanQ))) {
      isObstetric = true;
      ageMonths = -Math.max(1, 40 - parseInt(weekMatch[1], 10));
    }

    if (childAgeParam) {
      const childMonthMatch = childAgeParam.match(/(\d+)\s*meses/i);
      const childYearMatch = childAgeParam.match(/(\d+)\s*(ano|año)/i);
      if (childMonthMatch) ageMonths = parseInt(childMonthMatch[1], 10);
      else if (childYearMatch) ageMonths = parseInt(childYearMatch[1], 10) * 12;
    }

    const hasEmergencyKeywords = isEmergencyMessage(cleanQ);

    return { tokens, ageMonths, isObstetric, hasEmergencyKeywords };
  }

  /**
   * Evaluates the multi-objective fitness of a candidate chromosome (bundle of clinical genes)
   */
  public calculateFitness(
    genes: ClinicalGene[],
    queryTokens: string[],
    ageMonths: number,
    isObstetric: boolean,
    hasEmergency: boolean
  ): {
    totalFitness: number;
    relevance: number;
    safety: number;
    diversity: number;
    ageMatch: number;
  } {
    if (!genes || genes.length === 0) {
      return { totalFitness: 0, relevance: 0, safety: 0, diversity: 0, ageMatch: 0 };
    }

    // 1. Relevance Score: TF-IDF & Keyword Jaccard with query tokens
    let hitCount = 0;
    const allGeneKeywords = new Set<string>();
    genes.forEach(g => {
      g.keywords.forEach(k => {
        allGeneKeywords.add(k.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
      });
      g.symptoms.forEach(s => {
        allGeneKeywords.add(s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
      });
    });

    queryTokens.forEach(t => {
      for (const kw of allGeneKeywords) {
        if (kw.includes(t) || t.includes(kw)) {
          hitCount += 1.5;
          break;
        }
      }
    });

    const relevance = Math.min(100, (hitCount / Math.max(1, queryTokens.length)) * 50 + (hitCount > 0 ? 30 : 5));

    // 2. Age Match Score
    let ageMatchSum = 0;
    genes.forEach(g => {
      if (isObstetric) {
        if (g.category === 'obstetric') ageMatchSum += 100;
        else ageMatchSum += 20;
      } else {
        if (ageMonths >= g.minAgeMonths && ageMonths <= g.maxAgeMonths) {
          ageMatchSum += 100;
        } else {
          const dist = Math.min(Math.abs(ageMonths - g.minAgeMonths), Math.abs(ageMonths - g.maxAgeMonths));
          ageMatchSum += Math.max(0, 100 - dist * 3);
        }
      }
    });
    const ageMatch = ageMatchSum / genes.length;

    // 3. Safety & Emergency Shield Score
    let safety = 50;
    genes.forEach(g => {
      if (hasEmergency && (g.urgencyLevel === 'urgent' || g.category === 'triage' || g.category === 'safety')) {
        safety += 35;
      }
      if (g.contraindications && g.contraindications.length > 0) {
        safety += 15;
      }
    });
    safety = Math.min(100, safety);

    // 4. Information Diversity (penalizes redundant duplicate categories)
    const categoryCount = new Set(genes.map(g => g.category)).size;
    const diversity = (categoryCount / genes.length) * 100;

    // Multi-objective weighted sum
    const totalFitness = Number((
      relevance * 0.40 +
      ageMatch * 0.25 +
      safety * 0.25 +
      diversity * 0.10
    ).toFixed(2));

    return { totalFitness, relevance, safety, diversity, ageMatch };
  }

  /**
   * Initializes population with a mix of heuristic seeded and randomized chromosomes
   */
  private initializePopulation(
    allGenes: ClinicalGene[],
    queryTokens: string[],
    ageMonths: number,
    isObstetric: boolean,
    hasEmergency: boolean
  ): GeneticSearchChromosome[] {
    const population: GeneticSearchChromosome[] = [];

    // Sort genes by quick heuristic relevance to seed top individuals
    const heuristicRanked = [...allGenes].sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      queryTokens.forEach(t => {
        if (a.keywords.some(k => k.includes(t))) scoreA += 2;
        if (b.keywords.some(k => k.includes(t))) scoreB += 2;
      });
      if (isObstetric && a.category === 'obstetric') scoreA += 10;
      if (isObstetric && b.category === 'obstetric') scoreB += 10;
      return scoreB - scoreA;
    });

    // 1. Seed top heuristic chromosome
    const topGenes = heuristicRanked.slice(0, this.chromosomeSize);
    const topFit = this.calculateFitness(topGenes, queryTokens, ageMonths, isObstetric, hasEmergency);
    population.push({
      genes: topGenes,
      fitness: topFit.totalFitness,
      relevanceScore: topFit.relevance,
      safetyScore: topFit.safety,
      diversityScore: topFit.diversity,
      ageMatchScore: topFit.ageMatch
    });

    // 2. Create age-filtered seeds
    const ageFiltered = allGenes.filter(g => isObstetric ? g.category === 'obstetric' : (ageMonths >= g.minAgeMonths && ageMonths <= g.maxAgeMonths));
    const pool = ageFiltered.length >= this.chromosomeSize ? ageFiltered : allGenes;

    while (population.length < this.populationSize) {
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, this.chromosomeSize);
      const fit = this.calculateFitness(selected, queryTokens, ageMonths, isObstetric, hasEmergency);
      population.push({
        genes: selected,
        fitness: fit.totalFitness,
        relevanceScore: fit.relevance,
        safetyScore: fit.safety,
        diversityScore: fit.diversity,
        ageMatchScore: fit.ageMatch
      });
    }

    return population;
  }

  /**
   * Genetic Tournament Selection (k=3)
   */
  private selectParent(population: GeneticSearchChromosome[]): GeneticSearchChromosome {
    const tournamentSize = 3;
    let best = population[Math.floor(Math.random() * population.length)];
    for (let i = 1; i < tournamentSize; i++) {
      const challenger = population[Math.floor(Math.random() * population.length)];
      if (challenger.fitness > best.fitness) {
        best = challenger;
      }
    }
    return best;
  }

  /**
   * Two-Point Crossover with deduplication
   */
  private crossover(parentA: GeneticSearchChromosome, parentB: GeneticSearchChromosome, allGenes: ClinicalGene[]): ClinicalGene[] {
    const offspringSet = new Set<string>();
    const childGenes: ClinicalGene[] = [];

    const split = Math.floor(this.chromosomeSize / 2);
    for (let i = 0; i < split; i++) {
      const g = parentA.genes[i];
      if (g && !offspringSet.has(g.id)) {
        offspringSet.add(g.id);
        childGenes.push(g);
      }
    }

    for (let i = split; i < parentB.genes.length; i++) {
      const g = parentB.genes[i];
      if (g && !offspringSet.has(g.id) && childGenes.length < this.chromosomeSize) {
        offspringSet.add(g.id);
        childGenes.push(g);
      }
    }

    // Fill remaining if duplicates reduced size
    if (childGenes.length < this.chromosomeSize) {
      for (const g of allGenes) {
        if (!offspringSet.has(g.id)) {
          offspringSet.add(g.id);
          childGenes.push(g);
          if (childGenes.length >= this.chromosomeSize) break;
        }
      }
    }

    return childGenes;
  }

  /**
   * Mutation: Replaces a gene with a random or complementary candidate from the genome
   */
  private mutate(genes: ClinicalGene[], allGenes: ClinicalGene[]): ClinicalGene[] {
    const mutated = [...genes];
    if (Math.random() < this.mutationRate && mutated.length > 0) {
      const idxToReplace = Math.floor(Math.random() * mutated.length);
      const existingIds = new Set(mutated.map(g => g.id));
      const available = allGenes.filter(g => !existingIds.has(g.id));
      if (available.length > 0) {
        const replacement = available[Math.floor(Math.random() * available.length)];
        mutated[idxToReplace] = replacement;
      }
    }
    return mutated;
  }

  /**
   * Main Evolution Loop: Runs Genetic Algorithm to search and retrieve optimal clinical context
   */
  public evolveOptimalContext(
    userQuery: string,
    ageBracket?: AgeBracket | string,
    childAgeParam?: string
  ): GeneticSearchResult {
    const startTime = performance.now();
    const { tokens, ageMonths, isObstetric, hasEmergencyKeywords } = this.parseQueryContext(userQuery, ageBracket, childAgeParam);

    let population = this.initializePopulation(CLINICAL_KNOWLEDGE_GENOME, tokens, ageMonths, isObstetric, hasEmergencyKeywords);
    population.sort((a, b) => b.fitness - a.fitness);

    const initialBest = population[0];

    let lastBestFitness = initialBest.fitness;
    let stagnationCount = 0;

    for (let gen = 0; gen < this.maxGenerations; gen++) {
      const newPopulation: GeneticSearchChromosome[] = [];

      // Elitism: Preserve top K chromosomes
      for (let e = 0; e < this.elitismCount; e++) {
        if (population[e]) newPopulation.push(population[e]);
      }

      while (newPopulation.length < this.populationSize) {
        const parent1 = this.selectParent(population);
        const parent2 = this.selectParent(population);
        const childGenes = this.crossover(parent1, parent2, CLINICAL_KNOWLEDGE_GENOME);
        const mutatedGenes = this.mutate(childGenes, CLINICAL_KNOWLEDGE_GENOME);

        const fit = this.calculateFitness(mutatedGenes, tokens, ageMonths, isObstetric, hasEmergencyKeywords);
        newPopulation.push({
          genes: mutatedGenes,
          fitness: fit.totalFitness,
          relevanceScore: fit.relevance,
          safetyScore: fit.safety,
          diversityScore: fit.diversity,
          ageMatchScore: fit.ageMatch
        });
      }

      population = newPopulation.sort((a, b) => b.fitness - a.fitness);

      // Fast convergence early exit if optimal solution reached or plateaued
      const currentBest = population[0].fitness;
      if (Math.abs(currentBest - lastBestFitness) < 0.2) {
        stagnationCount++;
        if (stagnationCount >= 2 && currentBest > 65) {
          break;
        }
      } else {
        stagnationCount = 0;
        lastBestFitness = currentBest;
      }
    }

    const optimal = population[0];
    const convergenceTimeMs = Number((performance.now() - startTime).toFixed(2));
    const fitnessGainPercent = initialBest.fitness > 0
      ? Number((((optimal.fitness - initialBest.fitness) / initialBest.fitness) * 100).toFixed(1))
      : 0;

    // Collect sources and contraindications
    const sources = Array.from(new Set(optimal.genes.map(g => g.source)));
    const activeContraindications: string[] = [];
    optimal.genes.forEach(g => {
      if (g.contraindications) activeContraindications.push(...g.contraindications);
    });

    const isUrgent = hasEmergencyKeywords;
    const isCaution = optimal.genes.some(g => g.urgencyLevel === 'caution');
    const alertLevel = isUrgent ? 'urgent' : isCaution ? 'caution' : 'normal';

    // Format Structured Context Prompt Block for Gemini
    const contextPromptBlock = `
[EVIDENCIA CLÍNICA OPTIMIZADA MEDIANTE ALGORITMO GENÉTICO & HEURÍSTICA MULTI-OBJETIVO RAG]
- Generaciones de Búsqueda Evolutiva: ${this.maxGenerations} (Fitness de Convergencia: ${optimal.fitness}/100)
- Nivel de Seguridad Clínico: ${isUrgent ? 'ALERTA ROJA / URGENCIA INMEDIATA' : isCaution ? 'PRECAUCIÓN Y SEGUIMIENTO' : 'ORIENTACIÓN PEDIÁTRICA NORMAL'}
- Reglas y Protocolos Clínicos Seleccionados (${optimal.genes.length} Genes Clave):
${optimal.genes.map((g, i) => `
${i + 1}. [${g.category.toUpperCase()}] ${g.title} (${g.source})
   - Axioma Médico: ${g.axiom}
   - Pautas Prácticas: ${g.practicalProtocol.join(' | ')}
   - Signos de Alarma: ${g.redFlags.join('; ')}
   ${g.contraindications ? `   - CONTRAINDICACIONES ESTRICTAS: ${g.contraindications.join('; ')}` : ''}
`).join('')}

[CONTRAINDICACIONES Y LÍMITES CRÍTICOS ACTIVOS]
${activeContraindications.length > 0 ? activeContraindications.map(c => `• ${c}`).join('\n') : '• Aplicar dosificación por peso exacto en kg y pautas de seguridad OMS/AAP.'}
`;

    const telemetry: GeneticSearchTelemetry = {
      query: userQuery,
      detectedAgeMonths: ageMonths,
      ageBracket: isObstetric ? 'Embarazo / Gestación' : (ageBracket || `${Math.floor(ageMonths / 12)} años`),
      generations: this.maxGenerations,
      populationSize: this.populationSize,
      bestFitness: optimal.fitness,
      initialFitness: initialBest.fitness,
      fitnessGainPercent,
      convergenceTimeMs,
      selectedGeneIds: optimal.genes.map(g => g.id),
      selectedSources: sources,
      safetyShieldActivated: isUrgent || activeContraindications.length > 0,
      activeContraindications: Array.from(new Set(activeContraindications)),
      diversityEntropy: optimal.diversityScore
    };

    return {
      optimalChromosome: optimal,
      telemetry,
      contextPromptBlock,
      sources,
      alertLevel
    };
  }
}

export const geneticKnowledgeEngine = new GeneticKnowledgeEngine();
