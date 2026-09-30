/**
 * Detector de Consultas de Emergencia y Urgencia Pediátrica
 * 
 * Regla: Activa la alerta de urgencias si el mensaje del usuario incluye
 * palabras clave de urgencia ("urgente", "dolor", "emergencia" y sus variantes)
 * o describe signos clínicos del panel de triaje de urgencias:
 * - Dificultad respiratoria, tiraje, hundimiento de costillas, aleteo nasal, quejido, estridor, asfixia, no respira, ahogo
 * - Obstrucción de vía aérea / atragantamiento / cuerpo extraño / maniobra de Heimlich / OVACE
 * - Convulsiones / desmayo / pérdida de conocimiento / letargo profundo / no reacciona / no despierta / flácido
 * - Labios azules / morado / cianosis / piel marmórea / palidez extrema
 * - Fiebre en menor de 3 meses / recién nacido con fiebre / temperatura >=38 en menor de 90 días
 * - Petequias / manchitas rojas o moradas que no desaparecen con la prueba del vaso
 * - Intoxicación / envenenamiento
 * - Preguntas explícitas sobre protocolos de urgencias o primeros auxilios
 */

/**
 * Filtro lógico para detectar palabras clave de urgencia:
 * ("urgente", "dolor", "emergencia" y variantes).
 */
export function checkUrgencyKeywords(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  return /\b(urgente|urgentes|urgencia|urgencias|dolor|dolores|doloroso|dolorosa|duele|doliendo|emergencia|emergencias)\b/i.test(
    normalized
  );
}

export function isEmergencyMessage(text: string): boolean {
  if (!text || typeof text !== 'string') return false;

  // Normalizar: minúsculas y sin tildes diacríticas
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 1. Palabras clave de urgencia requeridas: "urgente", "dolor", "emergencia"
  if (checkUrgencyKeywords(normalized)) {
    return true;
  }

  // 2. Signos respiratorios graves (TEP - Respiración)
  if (
    /no respira|dejo de respirar|dificultad para respirar|dificultad respiratoria|falta de aire|asfixia|asfixiando|ahogand|se ahoga|tiraje|hundimiento.*costillas|aleteo.*nasal|quejido.*respiratorio|estridor.*respirar|pecho.*hunde/.test(
      normalized
    )
  ) {
    return true;
  }

  // 3. Obstrucción de Vía Aérea / Atragantamiento (OVACE)
  if (
    /atragant|se atraganto|tragando.*objeto|cuerpo extrano.*garganta|maniobra.*heimlich|ovace|se trago una moneda|se trago una pila|se trago un boton/.test(
      normalized
    )
  ) {
    return true;
  }

  // 4. Signos neurológicos graves (TEP - Apariencia)
  if (
    /convulsi|convulsiona|desmayo|desmayado|inconsciente|perdida.*conocimiento|perdio el conocimiento|no reacciona|no despierta|no responde|letargo profundo|bebe flacido|rigidez.*nuca/.test(
      normalized
    )
  ) {
    return true;
  }

  // 5. Signos circulatorios graves (TEP - Circulación)
  if (
    /labios azules|labios morados|cianosis|bebe morado|piel marmorea|palidez extrema.*frio/.test(
      normalized
    )
  ) {
    return true;
  }

  // 6. Fiebre de alto riesgo en recién nacidos / menores de 3 meses (<90 días)
  const mentionsFever = /fiebre|temperatura|calentura|38|39|40/.test(normalized);
  const mentionsNeonate = /recien nacido|neonato|menor de 3 meses|menor de tres meses|menos de 3 meses|menos de tres meses|menor de 90 dias|bebe de 1 mes|bebe de 2 meses|bebe de \d+ dias/.test(
    normalized
  );
  if (mentionsFever && mentionsNeonate) {
    return true;
  }

  // 7. Petequias (manchas rojas/moradas que no palidecen)
  if (
    /petequia|manchas rojas.*no desaparecen|manchas moradas.*vaso|manchas purpura/.test(
      normalized
    )
  ) {
    return true;
  }

  // 8. Intoxicación o envenenamiento
  if (
    /intoxicac|envenen|se tomo.*quimico|se tomo.*lavandina|se tomo.*cloro|se tomo.*detergente|ingirio veneno/.test(
      normalized
    )
  ) {
    return true;
  }

  // 9. Protocolos de urgencias o primeros auxilios solicitados explícitamente
  if (
    /protocolo.*(urgencia|emergencia)|primeros auxilios|que hacer en caso de (urgencia|emergencia)|pasos.*(urgencia|emergencia)/.test(
      normalized
    )
  ) {
    return true;
  }

  return false;
}
