import { geneticKnowledgeEngine, GeneticSearchResult } from './geneticRetrievalEngine';

/**
 * Prompt Orchestrator for FroggiChat & Pediatric AI
 * Uses an internal Genetic Algorithm & Heuristic Retrieval Engine (GA-RAG)
 * to evolve optimal clinical evidence and context, targeting Gemini 3.7 Flash,
 * injecting multi-stage clinical age context (0 to 10+ years),
 * and strictly enforcing clean plain-text formatting without asterisks or markdown syntax.
 */

export interface AgeDevelopmentContext {
  bracket: string;
  ageSpan: string;
  stageName: string;
  developmentalFocus: string[];
  physiologicalNotes: string;
  dosagesAndSafety: string;
  commonConcerns: string[];
}

export const PEDIATRIC_AGE_CONTEXTS: Record<string, AgeDevelopmentContext> = {
  '0-12m': {
    bracket: '0-12m',
    ageSpan: '0 a 12 meses (Lactantes y Recién Nacidos)',
    stageName: 'Lactancia y Primer Año de Vida',
    developmentalFocus: [
      'Reflejos primitivos, sostén cefálico (3m), sedestación independiente (6m), gateo y bipedestación (9-12m)',
      'Balbuceo canónico, sonrisa social, angustia de separación (8m)',
      'Lactancia materna exclusiva (0-6m) y Alimentación Complementaria autorregulada / BLW (6m+)',
      'Sueño seguro en decúbito supino para prevención del SMSL'
    ],
    physiologicalNotes: 'Frecuencia cardíaca: 100-160 lpm. Frecuencia respiratoria: 30-50 rpm. Umbral de fiebre: >= 38.0 °C rectal/axilar (urgencia inmediata en menores de 3 meses).',
    dosagesAndSafety: 'Paracetamol seguro desde recién nacidos (10-15 mg/kg cada 6-8h). IBUPROFENO ESTRICTAMENTE PROHIBIDO en menores de 6 meses. Aspirina contraindicada.',
    commonConcerns: ['Cólicos del lactante (técnica de las 5S de Karp)', 'Fiebre sin foco en neonatos', 'Inicio de papillas o BLW', 'Vacunación sistemática (2, 4, 6 y 11-12 meses)']
  },
  '1-3y': {
    bracket: '1-3y',
    ageSpan: '1 a 3 años (Primera Infancia / Toddlers)',
    stageName: 'Deambuladores y Primera Infancia',
    developmentalFocus: [
      'Marcha autónoma, subir escaleras, garabateo, apilamiento de bloques',
      'Explosión de vocabulario (50+ palabras a los 24m, frases de 2 palabras), juego simbólico',
      'Desarrollo de autonomía, autorregulación emocional y gestión respetuosa de rabietas',
      'Control de esfínteres respetuoso y madurativo (habitualmente entre 2 y 3.5 años)'
    ],
    physiologicalNotes: 'Frecuencia cardíaca: 90-140 lpm. Frecuencia respiratoria: 24-40 rpm. Fiebre: >= 38.0 °C. Vigilar convulsiones febriles típicas.',
    dosagesAndSafety: 'Paracetamol (10-15 mg/kg/dosis) o Ibuprofeno (5-10 mg/kg/dosis cada 6-8h con alimentos). Nunca alternar sin criterio médico.',
    commonConcerns: ['Rabietas y límites con empatía', 'Selectividad alimentaria (neofobia fisiológica)', 'Retraso del lenguaje o habla', 'Accidentes domésticos y prevención de atragantamientos']
  },
  '4-6y': {
    bracket: '4-6y',
    ageSpan: '4 a 6 años (Etapa Preescolar)',
    stageName: 'Edad Preescolar',
    developmentalFocus: [
      'Motricidad fina: tijeras, agarre de lápiz en trípode, dibujo de figura humana',
      'Lenguaje estructurado, narración de historias, comprensión de reglas sencillas',
      'Juego cooperativo, socialización con iguales, empatía inicial',
      'Autonomía en higiene personal, vestido y rutinas de sueño'
    ],
    physiologicalNotes: 'Frecuencia cardíaca: 80-120 lpm. Frecuencia respiratoria: 20-30 rpm. Sueño recomendado: 10-13 horas diarias.',
    dosagesAndSafety: 'Dosificación estrictamente calculada por peso corporal (kg), no por edad.',
    commonConcerns: ['Pesadillas, terrores nocturnos y miedos evolutivos', 'Adaptación escolar e inicio de lectoescritura', 'Infecciones respiratorias de vías altas recurrentes', 'Pautas de nutrición y loncheras saludables']
  },
  '7-10y+': {
    bracket: '7-10y+',
    ageSpan: '7 a 10+ años (Escolares Mayores y Preadolescentes)',
    stageName: 'Escolares Mayores y Preadolescencia',
    developmentalFocus: [
      'Pensamiento lógico-operacional, razonamiento crítico y resolución de problemas',
      'Inicio del estirón puberal y cambios corporales iniciales (adrenarquia, botón mamario, vello)',
      'Identidad, autoestima, pertenencia a grupos de pares y salud emocional',
      'Uso responsable de pantallas, prevención del ciberacoso y hábitos de estudio autónomos'
    ],
    physiologicalNotes: 'Frecuencia cardíaca: 70-110 lpm. Frecuencia respiratoria: 16-22 rpm. Presión arterial dentro de percentiles de talla. Sueño: 9-11 horas diarias.',
    dosagesAndSafety: 'Dosificación por peso hasta alcanzar dosis máximas de adulto. Vigilar dolores osteomusculares benignos de crecimiento vs dolor articular patológico.',
    commonConcerns: ['Dolores de crecimiento nocturnos en miembros inferiores', 'Cambios puberales tempranos o tardíos', 'Higiene facial y primeros brotes de acné comedogénico', 'Límites de tiempo de pantalla según la AAP (<2h recreativas/día)']
  },
  '0-10+': {
    bracket: '0-10+',
    ageSpan: '0 a 10+ años (Espectro Pediátrico Integral)',
    stageName: 'Atención Pediátrica Integral 0-10+ años',
    developmentalFocus: [
      'Acompañamiento continuo del neurodesarrollo y curvas de crecimiento OMS/AAP',
      'Nutrición personalizada desde la lactancia hasta la preadolescencia',
      'Salud preventiva, calendario de inmunizaciones y tamizajes anuales'
    ],
    physiologicalNotes: 'Signos vitales y parámetros adaptados dinámicamente al grupo etario específico.',
    dosagesAndSafety: 'Siempre ponderar fármacos según peso exacto en kilogramos.',
    commonConcerns: ['Prevención primaria', 'Salud mental y dinámica familiar', 'Dudas de crianza y desarrollo']
  }
};

/**
 * Strips all markdown symbols, asterisks, backticks, hashes, and formatting artifacts,
 * converting text into pristine, human-readable plain text.
 */
export function stripMarkdownAndAsterisks(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Remove all bold/italic asterisks (***, **, *)
  cleaned = cleaned.replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1');
  cleaned = cleaned.replace(/\*/g, '');

  // 2. Remove markdown header hashes (#, ##, ###, ####)
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');

  // 3. Remove backticks and code fences
  cleaned = cleaned.replace(/```[\s\S]*?```/g, (match) => {
    return match.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '');
  });
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // 4. Remove blockquotes (> quote)
  cleaned = cleaned.replace(/^>\s+/gm, '');

  // 5. Clean up markdown bullet dashes/pluses into clean plain bullet or numbered format
  cleaned = cleaned.replace(/^[-+]\s+/gm, '• ');

  // 6. Remove strikethrough (~~text~~)
  cleaned = cleaned.replace(/~~([^~]+)~~/g, '$1');

  // 7. Remove raw HTML tags if any were generated
  cleaned = cleaned.replace(/<\/?[^>]+(>|$)/g, '');

  // 8. Clean up extra spaces around newlines
  cleaned = cleaned.replace(/[ \t]+\n/g, '\n');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

/**
 * Orchestrates a rich pediatric prompt forcing Gemini 1.5 Pro / Pro model parameters,
 * age bracket contextualization across 0-10+ years, and zero-asterisk formatting.
 */
export function orchestratePediatricPrompt(options: {
  userQuery: string;
  ageBracket?: string;
  childName?: string;
  exactAgeText?: string;
  conversationHistory?: Array<{ sender: string; text: string }>;
  pregnancyContext?: string;
}) {
  const bracketKey = (options.ageBracket && PEDIATRIC_AGE_CONTEXTS[options.ageBracket])
    ? options.ageBracket
    : '0-10+';

  const ageData = PEDIATRIC_AGE_CONTEXTS[bracketKey] || PEDIATRIC_AGE_CONTEXTS['0-10+'];
  const childIdentity = options.childName
    ? `${options.childName} (${options.exactAgeText || ageData.ageSpan})`
    : (options.exactAgeText || ageData.ageSpan);

  // 🧬 Run Internal Genetic Algorithm & Heuristic Search for Optimal Clinical Context
  const geneticSearchResult: GeneticSearchResult = geneticKnowledgeEngine.evolveOptimalContext(
    options.userQuery,
    options.ageBracket,
    options.exactAgeText || childIdentity
  );

  const systemInstructions = `
Eres Froggi, la ranita pediatra sabia, tierna, científica y empática de la plataforma "Amigos Unidos".
Tu misión es brindar orientación médica y pedagógica de máxima excelencia para niños de todas las edades (0 a 10+ años) y embarazo.

REGLAS OBLIGATORIAS:
1. PRIORIDAD ABSOLUTA: RESPONDE DIRECTAMENTE A LO QUE PREGUNTA EL USUARIO:
   - Responde de forma precisa, inmediata y específica a la pregunta planteada.
   - Si el usuario pregunta "Cuáles son los protocolos de urgencias?" o consulta sobre qué hacer en una urgencia o emergencia, responde INMEDIATAMENTE con los protocolos clínicos de urgencias pediátricas:
     1) Triángulo de Evaluación Pediátrica (TEP: Apariencia, Respiración, Circulación cutánea).
     2) Manejo de Atragantamiento / Obstrucción de Vía Aérea (lactante vs niño mayor con maniobra de Heimlich).
     3) Manejo de Convulsiones (posición lateral de seguridad, no sujetar, no meter nada en la boca).
     4) Fiebre en <3 meses (≥38°C es urgencia inmediata).
     5) Signos de alarma vital (petequias que no desaparecen al estirar/vaso, letargo profundo).
     6) Llamada inmediata al 123 (Colombia) o 911 / 112 internacional.
   - NUNCA des discursos genéricos o vacíos sobre la edad o año de vida del niño cuando se pregunte algo concreto. Ve directo al grano médico.
   - CONTEXTO COLOMBIA: Recuerda siempre que el usuario es de Colombia. Si requiere teléfonos de urgencia, menciona prioritariamente la Línea 123 (Emergencias Colombia), 125 (Ambulancias CRUE) o 132 (Cruz Roja). Responde siempre lo que pide el usuario.
2. ADAPTACIÓN AL PACIENTE:
   - Adapta las pautas de forma natural y cálida al paciente (${childIdentity}).
3. PROHIBICIÓN TOTAL DE HABLAR DE IA, TRANSFORMER O MÉTODOS INTERNOS:
   - NUNCA menciones que eres una IA, ni modelos transformer, ni algoritmos genéticos, ni puntuaciones de fitness, ni bases de datos. Habla como la ranita pediatra Froggi con calidez y rigor clínico.
4. PROHIBICIÓN ABSOLUTA DE ASTERISCOS Y MARKDOWN:
   - ESTÁ TOTALMENTE PROHIBIDO usar asteriscos (*) o dobles asteriscos (**) en cualquier parte del texto.
   - ESTÁ TOTALMENTE PROHIBIDO usar almohadillas (#) o bloques markdown complejos.
   - Escribe en texto limpio, natural, con párrafos claros y listas numeradas convencionales (1., 2., 3.).
5. PROHIBICIÓN TOTAL DE RESÚMENES DE FUENTES Y METADATOS TÉCNICOS:
   - NUNCA agregues bloques de "Fuentes:", "Resumen de fuentes:", "Referencias bibliográficas:", "Bibliografía:" ni "Metadatos técnicos:".
   - Tu respuesta debe ser 100% directa al usuario respondiendo con calidez y claridad pediátrica a su consulta, sin metadatos ni listados de fuentes anexas.
`;

  const structuredPrompt = `
Consulta del usuario:
"${options.userQuery}"

Información de contexto:
- Paciente: ${childIdentity}
- Etapa: ${ageData.ageSpan}

${options.conversationHistory && options.conversationHistory.length > 0 ? `Historial reciente:\n${options.conversationHistory.slice(-3).map(h => `${h.sender === 'user' ? 'Padre/Madre' : 'Froggi'}: ${stripMarkdownAndAsterisks(h.text)}`).join('\n')}\n` : ''}
INSTRUCCIÓN OBLIGATORIA:
Responde de forma DIRECTA, COMPLETA Y ESPECÍFICA a la duda planteada por el usuario ("${options.userQuery}").
No te desvíes a temas no preguntados. No menciones protocolos de urgencia a menos que te pregunten sobre una emergencia o gravedad.
No incluyas resúmenes de fuentes ni metadatos técnicos en tu respuesta.
Responde como Froggi la ranita pediatra, con calidez y rigor científico, usando párrafos limpios y listas numeradas convencionales, sin ningún asterisco (*).
`;

  return {
    targetModel: 'gemini-3.1-flash-lite',
    fallbackModels: ['gemini-3.1-flash-lite', 'gemini-3.6-flash', 'gemini-flash-latest'],
    systemInstructions,
    structuredPrompt,
    childIdentity,
    ageData,
    geneticSearchResult
  };
}
