import { AgeBracket } from '../types';

export interface PediatricTopic {
  id: string;
  ageBracket: AgeBracket;
  keywords: string[];
  title: string;
  source: string;
  clinicalSummary: string;
  actionSteps: string[];
  alarmSigns: string[];
  recreationalTip: string;
}

export const PEDIATRIC_KNOWLEDGE_BASE: PediatricTopic[] = [
  // ==========================================
  // ETAPA 0-12 MESES (LACTANTES Y NEONATOS)
  // ==========================================
  {
    id: 'fever_0_3m',
    ageBracket: '0-12m',
    keywords: ['fiebre', 'temperatura', 'calentura', 'termometro', '38', '38 grados', '39', 'recien nacido con fiebre', 'paracetamol'],
    title: 'Manejo Clínico de Fiebre Pediátrica y Dosificación Segura',
    source: 'Guía AAP de Fiebre Pediátrica & Protocolo de Sepsis Neonatal OMS',
    clinicalSummary: 'La fiebre (≥38.0°C rectal o axilar) es un mecanismo de defensa del sistema inmune. En menores de 3 meses se considera una urgencia médica obligatoria por riesgo de bacteriemia oculta o infección bacteriana grave.',
    actionSteps: [
      'Menores de 3 meses con ≥38.0°C: Acudir de inmediato a urgencias sin automedicar.',
      'Lactantes >3-6 meses: Ofrecer líquidos frecuentes (leche materna o fórmula), mantener con ropa ligera y vigilar el estado general.',
      'Medicación: Paracetamol pediátrico (10-15 mg/kg por dosis cada 6-8h) o Ibuprofeno (solo >6 meses, 5-10 mg/kg cada 8h) dosificado estrictamente por peso.',
      'NUNCA dar aspirina (riesgo de Síndrome de Reye) ni usar baños con alcohol o agua helada.'
    ],
    alarmSigns: [
      'Fiebre en neonato <3 meses.',
      'Dificultad respiratoria, manchas moradas o rojizas en la piel que no desaparecen al estirar (petequias).',
      'Letargo extremo (no responde o no despierta), fontanela abombada o llanto débil continuo.'
    ],
    recreationalTip: 'Mantén un ambiente tranquilo con luz tenue y coloca los arrullos a 432 Hz de Caracolito para favorecer el descanso reparador.'
  },
  {
    id: 'colic_0_12m',
    ageBracket: '0-12m',
    keywords: ['cólico', 'colico', 'gases', 'llora mucho', 'inconsolable', '5s', 'dolor de panza', 'barriga', 'retuerce', 'panza'],
    title: 'Manejo del Cólico del Lactante y Llanto Inconsolable',
    source: 'Criterios Roma IV & Guía AAP de Crianza Temprana',
    clinicalSummary: 'El cólico del lactante ocurre típicamente entre las 2 y 16 semanas. Se caracteriza por llanto paroxístico sin causa orgánica aparente en lactantes sanos y bien alimentados.',
    actionSteps: [
      'Aplicar la Técnica de las 5S de la AAP (Swaddle: envolver suavemente; Side/Stomach: postura de lado o sobre el antebrazo en brazos de mamá/papá; Shush: sonido blanco o chistido rítmico; Swing: balanceo suave; Suck: succión no nutritiva).',
      'Realizar masajes abdominales en sentido de las agujas del reloj (técnica "I Love You") en momentos de calma.',
      'Asegurar un acople correcto al amamantar o mantener el biberón a 45° para reducir la ingesta de aire (aerofagia).',
      'Mantener el descanso y relevo de los cuidadores para evitar el síndrome del bebé sacudido por agotamiento.'
    ],
    alarmSigns: [
      'Fiebre ≥ 38.0°C rectal en menores de 3 meses.',
      'Vómito bilioso (verde esmeralda) o sangre en las heces.',
      'Rechazo completo del alimento o distensión abdominal dura y dolorosa al mínimo tacto.'
    ],
    recreationalTip: 'Coloca la pista de relajación de Caracolito o el sonido rosa a 432 Hz de la Zona Recreativa a bajo volumen para crear un ambiente en penumbra.'
  },
  {
    id: 'cough_cold_0_12m',
    ageBracket: '0-12m',
    keywords: ['tos', 'mocos', 'resfriado', 'gripe', 'congestion', 'nariz tapada', 'estornudos', 'bronquiolitis', 'suero fisiologico'],
    title: 'Resfriado Común, Manejo de Secreciones y Bronquiolitis',
    source: 'Guía AAP de Manejo de Bronquiolitis & GINA Pediátrico',
    clinicalSummary: 'Los virus respiratorios (como VSR o rinovirus) provocan hipersecreción mucosa y tos. El tratamiento principal es el soporte de la vía aérea e hidratación.',
    actionSteps: [
      'Realizar lavados nasales con suero fisiológico al 0.9% antes de comer y antes de dormir.',
      'Colocar un humidificador de vapor frío en la habitación para ablandar flemas.',
      'Elevar ligeramente la cabecera de la cuna (15-30 grados) con una cuña segura bajo el colchón.',
      'Mantener tomas fraccionadas y frecuentes para asegurar hidratación.',
      'PROHIBIDO jarabes para la tos o descongestionantes en menores de 2-4 años según la FDA y AAP.'
    ],
    alarmSigns: [
      'Tiraje intercostal (las costillas o el pecho se hunden al respirar).',
      'Aleteo nasal (se abren las fosas nasales con fuerza), quejido espiratorio o labios morados.',
      'Respiración rápida (>50 respiraciones/minuto en menores de 1 año).'
    ],
    recreationalTip: 'Durante el vapor tibio en el baño previo al lavado nasal, canta con Froggi una melodía suave para tranquilizar al bebé.'
  },
  {
    id: 'teething_0_12m',
    ageBracket: '0-12m',
    keywords: ['dientes', 'denticion', 'encias', 'babea', 'muerde todo', 'primer diente', 'salivacion', 'baba'],
    title: 'Brote Dental, Molestias de Dentición e Higiene Oral',
    source: 'Academia Americana de Odontopediatría (AAPD) & Nelson Pediatrics',
    clinicalSummary: 'La erupción de los primeros dientes ocurre entre los 4 y 10 meses (generalmente los incisivos centrales inferiores). Provoca salivación abundante, encías inflamadas y necesidad de morder.',
    actionSteps: [
      'Ofrecer mordedores de silicona enfriados en la nevera (nunca congelador).',
      'Masajear las encías suavemente con una gasa estéril humedecida en agua fría o con un dedal de silicona.',
      'Limpiar la saliva del mentón con toques suaves de paño de algodón para evitar dermatitis por babeo.',
      'Iniciar el cepillado dental desde el primer diente con cepillo de cerdas suaves y una pizca (tamaño grano de arroz) de pasta fluorada (1000 ppm).'
    ],
    alarmSigns: [
      'Fiebre alta (>38.5°C) o diarrea severa (la dentición puede provocar febrícula leve ≤37.8°C o heces más blandas, pero no fiebre alta ni diarrea acuosa).'
    ],
    recreationalTip: 'Froggi propone jugar con texturas frías y canciones de ritmos de dientes limpios en la Zona Recreativa.'
  },
  {
    id: 'safe_sleep_0_12m',
    ageBracket: '0-12m',
    keywords: ['dormir', 'sueño', 'cuna', 'muerte súbita', 'smsl', 'boca arriba', 'despertares', 'siesta', 'almohada'],
    title: 'Directriz AAP de Sueño Seguro y Prevención del SMSL',
    source: 'American Academy of Pediatrics (AAP) Policy Statement on Safe Sleep',
    clinicalSummary: 'La AAP recomienda dormir boca arriba (posición supina) en una cuna con colchón firme y plano, compartiendo la habitación de los padres al menos los primeros 6 meses sin practicar colecho en la misma cama.',
    actionSteps: [
      'Colocar siempre al bebé boca arriba para todas las siestas y la noche.',
      'Mantener la cuna despejada: cero almohadas, peluches, protectores acolchados o mantas sueltas.',
      'Vestir al bebé con mameluco/saco de dormir adecuado a la temperatura ambiente (19-22°C) evitando el sobrecalentamiento.',
      'Promover el tiempo boca abajo despierto y supervisado ("Tummy Time") 15-30 minutos al día acumulados para fortalecer cuello y prevenir plagiocefalia.'
    ],
    alarmSigns: [
      'Dificultad para respirar, pausas respiratorias > 15-20 segundos (apneas) o coloración azulada/morada en labios.',
      'Dificultad extrema para despertar al bebé.'
    ],
    recreationalTip: 'Practica Tummy Time sobre la mantita de juego colocando al frente el títere de Froggi o juguetes de alto contraste blanco y negro.'
  },
  {
    id: 'blw_nutrition_0_12m',
    ageBracket: '0-12m',
    keywords: ['alimentación complementaria', 'blw', 'baby led weaning', 'papilla', 'comida', '6 meses', 'alérgenos', 'huevo', 'pescado', 'atragantamiento'],
    title: 'Inicio de Alimentación Complementaria y BLW Seguro (6 a 12 meses)',
    source: 'OMS (WHO) & ESPGHAN Complementary Feeding Guidelines',
    clinicalSummary: 'La OMS y la AAP recomiendan lactancia materna exclusiva hasta los 6 meses (180 días) cumplidos y la introducción gradual de alimentos seguros manteniendo la leche como fuente principal.',
    actionSteps: [
      'Verificar las 4 señales de desarrollo: 1) Mantenerse sentado erguido sin caerse; 2) Pérdida del reflejo de extrusión (no escupir la cuchara); 3) Coordinación ojo-mano-boca; 4) Muestra interés activo por la comida.',
      'Ofrecer alimentos en cortes seguros (forma de bastón o dedo en BLW con textura blanda que se deshaga entre los dedos).',
      'Introducir alimentos ricos en hierro desde el inicio (carnes, legumbres trituradas, yema de huevo cocida).',
      'Introducir los alérgenos comunes (huevo, pescado, frutos secos en crema, gluten) uno por uno durante 3 días consecutivos por la mañana.',
      'PROHIBIDO antes de los 12 meses: Sal, azúcares añadidos, miel (riesgo de botulismo) y frutos secos enteros.'
    ],
    alarmSigns: [
      'Reacción anafiláctica: Hinchazón de labios/ojos, urticaria generalizada, tos persistente o dificultad respiratoria inmediata tras ingerir un alimento.'
    ],
    recreationalTip: 'Permite que el bebé explore texturas con las manos usando un plato de silicona suave mientras cantan la ronda de las frutas con Monito.'
  },
  {
    id: 'gastroenteritis_0_12m',
    ageBracket: '0-12m',
    keywords: ['diarrea', 'vomito', 'gastroenteritis', 'deshidratacion', 'suero oral', 'caca liquida', 'suero', 'panza suelta'],
    title: 'Manejo de Diarrea, Vómitos y Protocolo de Rehidratación Oral (SRO)',
    source: 'Manual AIEPI / OMS & Guías ESPGHAN de Gastroenteritis Aguda',
    clinicalSummary: 'La deshidratación es el principal riesgo de la gastroenteritis en lactantes y niños pequeños. El pilar del tratamiento es la reposición de líquidos con Suero de Rehidratación Oral (SRO de baja osmolaridad de la OMS).',
    actionSteps: [
      'Continuar la lactancia materna a libre demanda o fórmula habitual sin diluir.',
      'Ofrecer SRO a sorbos pequeños o con jeringuilla (5-10 ml cada 5 minutos tras cada deposición líquida o vómito).',
      'No administrar refrescos, jugos comerciales, bebidas isotónicas para deportistas ni té casero.',
      'Ofrecer comida habitual suave (arroz, plátano, manzana cocida, pollo) en cuanto tolere líquidos sin forzar cantidades.'
    ],
    alarmSigns: [
      'Signos de deshidratación: Llanto sin lágrimas, boca muy seca, fontanela deprimida (hundida), ojos hundidos, pañal seco por más de 6-8 horas o letargo.',
      'Presencia de sangre roja visible en las heces o vómitos verdes continuos.'
    ],
    recreationalTip: 'Ofrece el suero como "pociones de energía de Caracolito" en vasitos de colores pequeños.'
  },
  {
    id: 'constipation_0_12m',
    ageBracket: '0-12m',
    keywords: ['estreñimiento', 'no hace caca', 'duro', 'pujido', 'heces duras', 'estreñido', 'dolor al defecar'],
    title: 'Estreñimiento Funcional Pediátrico y Dificultad Defecatoria',
    source: 'Criterios Roma IV Pediátricos & Guías ESPGHAN',
    clinicalSummary: 'En bebés alimentados al pecho exclusivo, es normal pasar varios días sin defecar si las heces son blandas y no hay dolor (falso estreñimiento del lactante). En alimentación complementaria, el estreñimiento se define por heces duras en forma de bolas con dolor.',
    actionSteps: [
      'En lactancia materna exclusiva: No requiere laxantes si el abdomen está blando y el bebé está contento.',
      'En alimentación complementaria: Aumentar la ingesta de agua, frutas ricas en sorbitol (pera, ciruela, kiwi con pulpa) y verduras de hoja verde.',
      'Realizar flexión de piernas ("bicicleta") y masajes circulares en el abdomen.',
      'NUNCA estimular el ano con termómetros, tallos o hisopos (riesgo de lesiones y alteración del reflejo esfinteriano).'
    ],
    alarmSigns: [
      'Fisura anal sangrante, distensión abdominal con vómitos biliosos o falta de emisión de meconio en las primeras 48h de vida.'
    ],
    recreationalTip: 'Haz el juego de las ranitas saltarinas con Froggi para estimular la motilidad intestinal con movimiento de piernas.'
  },
  {
    id: 'motor_milestones_0_12m',
    ageBracket: '0-12m',
    keywords: ['caminar', 'gatear', 'sentarse', 'hitos motores', 'gateo', 'volteo', 'sostener la cabeza', 'desarrollo psicomotor'],
    title: 'Hitos del Desarrollo Motor Grueso y Fino (0 a 12 meses)',
    source: 'CDC Milestone Checklists & UNICEF ECDI2030',
    clinicalSummary: 'El desarrollo sigue un patrón céfalo-caudal y próximo-distal: Sostén cefálico (3-4 meses), volteo (4-6 meses), sedestación estable (6-8 meses), gateo (8-10 meses) y primeros pasos (10-15 meses).',
    actionSteps: [
      'Proporcionar suelo libre sobre una alfombra firme y segura para que el bebé se mueva espontáneamente.',
      'Evitar el uso de andadores (la AAP prohíbe los andadores de ruedas por alto riesgo de traumatismo craneoencefálico y retraso en la marcha natural).',
      'Colocar juguetes a distancias cortas para incentivar el alcance y arrastre.',
      'Permitir que explore descalzo sobre superficies seguras para enriquecer la propiocepción del pie.'
    ],
    alarmSigns: [
      'No sostiene la cabeza a los 4 meses.',
      'No se sienta sin apoyo a los 9 meses.',
      'Asimetría motriz marcada (usa solo un brazo o una pierna y mantiene el otro lado rígido o hipotónico).'
    ],
    recreationalTip: 'Prueba la Pista de Safari de Monito en la alfombra para jugar a alcanzar objetos suaves.'
  },
  {
    id: 'vaccines_0_12m',
    ageBracket: '0-12m',
    keywords: ['vacunas', 'inmunización', '2 meses', '4 meses', '6 meses', 'fiebre postvacunal', 'rotavirus', 'hexavalente'],
    title: 'Calendario de Vacunación Pediátrica en el Primer Año',
    source: 'OMS / Comité Asesor de Vacunas de la AAP',
    clinicalSummary: 'Las vacunas en los meses 2, 4, 6 y 12 protegen contra enfermedades potencialmente mortales como neumococo, rotavirus, polio, difteria, tétanos, tos ferina y haemophilus influenzae.',
    actionSteps: [
      'Cumplir puntualmente con las dosis programadas.',
      'Para fiebre leve o malestar postvacunal, aplicar compresas tibias en la zona y administrar paracetamol pediátrico ÚNICAMENTE bajo dosificación recetada por el pediatra según peso exacto.',
      'Dar pecho o tomas frecuentes de líquidos para mantener una hidratación óptima.',
      'No administrar antipiréticos preventivos antes de la inyección sin indicación médica.'
    ],
    alarmSigns: [
      'Fiebre > 39°C que no cede, llanto inconsolable agudo continuo por más de 3 horas o convulsión febril.'
    ],
    recreationalTip: 'Un baño tibio y arrullo con la canción de cuna de Pandita después de la vacuna calma el estrés sensorial del bebé.'
  },

  // ==========================================
  // ETAPA 1-3 AÑOS (PRIMERA INFANCIA / TODDLERS)
  // ==========================================
  {
    id: 'tantrums_1_3y',
    ageBracket: '1-3y',
    keywords: ['berrinche', 'rabieta', 'pataleta', 'pega', 'muerde', 'grita', 'enojo', 'límites', 'disciplina', 'terribles 2'],
    title: 'Neurobiología de las Rabietas y Contención Socioemocional',
    source: 'UNICEF Early Stimulation & AAP Positive Discipline Guidelines',
    clinicalSummary: 'Las rabietas entre 1 y 3 años son una respuesta neurobiológica normal ante la inmadurez de la corteza prefrontal y la sobrecarga del sistema límbico frente a la frustración.',
    actionSteps: [
      'Acompañar con calma y presencia física segura (bajar a su altura de ojos, evitar gritos o castigos físicos que aumentan el cortisol).',
      'Validar la emoción antes del límite: "Veo que estás muy enojado porque querías seguir jugando, pero es hora del baño".',
      'Ofrecer opciones limitadas para devolver sentido de autonomía ("¿Quieres la toalla azul o la verde?").',
      'Esperar a que baje la curva de desregulación antes de intentar razonar verbalmente.'
    ],
    alarmSigns: [
      'Rabietas que terminan en autolesiones severas (golpearse la cabeza con fuerza destructiva), apnea del llanto prolongada con desmayo frecuente o agresión incontrolada.'
    ],
    recreationalTip: 'Usa la técnica del "Abrazo de Pandita" y la respiración del globito disponible en el módulo de Cuentos de Amigos Unidos.'
  },
  {
    id: 'potty_training_1_3y',
    ageBracket: '1-3y',
    keywords: ['pañal', 'baño', 'orinal', 'pipí', 'caca', 'esfínteres', 'dejar el pañal', 'bacinica'],
    title: 'Control Respetuoso de Esfínteres y Retirada del Pañal',
    source: 'AAP Developmental Readiness in Toilet Training',
    clinicalSummary: 'El control de esfínteres es un proceso madurativo fisiológico y neurológico que generalmente se alcanza entre los 24 y 36 meses, no un entrenamiento acelerado.',
    actionSteps: [
      'Observar señales de madurez: Pañal seco por más de 2 horas seguidas, avisa cuando está mojado/sucio, muestra curiosidad por el inodoro y puede subirse/bajarse los pantalones solo.',
      'Familiarizar al niño con la bacinica sin forzarlo a permanecer sentado.',
      'Celebrar los intentos con refuerzo afectivo positivo y naturalidad.',
      'NUNCA regañar, avergonzar o castigar por los escapes de orina, ya que son parte natural del aprendizaje.'
    ],
    alarmSigns: [
      'Estreñimiento severo con retención voluntaria por dolor, dolor al orinar (disuria) o hematuria (sangre en la orina).'
    ],
    recreationalTip: 'Lee el cuento interactivo de Froggi y el Orinal Mágico para normalizar la rutina con humor y ternura.'
  },
  {
    id: 'language_delay_1_3y',
    ageBracket: '1-3y',
    keywords: ['habla', 'palabras', 'no habla', 'lenguaje', 'señala', 'balbucea', 'vocabulario', 'comunicación', 'retraso del habla'],
    title: 'Desarrollo del Lenguaje y Detección Temprana (1 a 3 años)',
    source: 'UNICEF ECDI2030 & AAP Pediatric Milestones',
    clinicalSummary: 'A los 18 meses se esperan al menos 10-20 palabras con significado y respuesta al nombre; a los 24 meses se esperan más de 50 palabras y combinaciones de 2 palabras ("quiero agua").',
    actionSteps: [
      'Hablar cara a cara con lenguaje claro, modulado y sin infantilizar excesivamente.',
      'Narrar las actividades del día a día ("Ahora mamá está cortando la manzana roja").',
      'Leer cuentos ilustrados diariamente señalando y nombrando objetos.',
      'Evitar el uso de pantallas pasivas antes de los 2 años, ya que disminuyen las oportunidades de interacción lingüística recíproca.'
    ],
    alarmSigns: [
      'No responde a su nombre a los 12 meses.',
      'No señala objetos para pedir o compartir atención a los 14 meses.',
      'Pérdida de cualquier habilidad lingüística o social previamente adquirida (regresión del desarrollo).'
    ],
    recreationalTip: 'Prueba la Pizarra de Trazos y Cuentos de Amigos Unidos para asociar dibujos con onomatopeyas de animales.'
  },
  {
    id: 'autism_screen_1_3y',
    ageBracket: '1-3y',
    keywords: ['autismo', 'tea', 'm-chat', 'mchat', 'no mira a los ojos', 'aleteo', 'camina en puntitas', 'alinea juguetes', 'aislado'],
    title: 'Señales de Alerta Temprana en Neurodesarrollo y M-CHAT',
    source: 'AAP Autism Screening Guidelines & CDC "Learn the Signs. Act Early"',
    clinicalSummary: 'La AAP recomienda el tamizaje formal de Trastornos del Espectro Autista a los 18 y 24 meses mediante instrumentos validados como el M-CHAT-R/F.',
    actionSteps: [
      'Evaluar hitos socio-comunicativos: Sonrisa social recíproca, seguimiento con la mirada, señalar para mostrar algo interesante ("atención conjunta").',
      'Verificar respuesta auditiva descartando hipoacusia mediante prueba audiológica formal.',
      'Consultar al pediatra para una evaluación integral si se identifican factores de riesgo en el tamizaje.'
    ],
    alarmSigns: [
      'Falta de contacto visual recíproco a los 9-12 meses.',
      'No responde a su propio nombre pero escucha otros sonidos como la televisión.',
      'Pérdida súbita de palabras o habilidades sociales a cualquier edad.'
    ],
    recreationalTip: 'Juegos cara a cara con canciones de mímica e imitación gestual de Pandita y Froggi.'
  },

  // ==========================================
  // ETAPA 4-6 AÑOS (ETAPA PREESCOLAR)
  // ==========================================
  {
    id: 'smartlearn_preschool_4_6y',
    ageBracket: '4-6y',
    keywords: ['aprender', 'números', 'letras', 'leer', 'escribir', 'preescolar', 'grafomotricidad', 'colores', 'smartlearn', 'conteo'],
    title: 'Estimulación Cognitiva y Preparación Preescolar (SmartLearn Dataset)',
    source: 'SmartLearn Kaggle Preschool Dataset & Harvard Center on the Developing Child',
    clinicalSummary: 'En la etapa preescolar, el aprendizaje ocurre a través del juego estructurado, la exploración táctil y la resolución de problemas lógicos sencillos.',
    actionSteps: [
      'Fomentar el conteo con objetos concretos (contar botones, frutas o juguetes hasta el 10-20).',
      'Desarrollar la motricidad fina mediante modelado con plastilina, rasgado de papel y trazos en la Pizarra de Dibujo.',
      'Promover la conciencia fonológica jugando a rimas y reconociendo el sonido inicial de los nombres.',
      'Establecer rutinas visuales diarias para fortalecer la memoria de trabajo y la secuenciación temporal.'
    ],
    alarmSigns: [
      'Incapacidad para sostener un crayón con la mano, dificultad severa para saltar en un pie o incapacidad para comprender órdenes de 3 pasos a los 5 años.'
    ],
    recreationalTip: 'Juega al Memorama de 8 cartas de Amigos Unidos para ejercitar la memoria de trabajo y la atención sostenida.'
  },
  {
    id: 'fears_sleep_4_6y',
    ageBracket: '4-6y',
    keywords: ['miedo a la oscuridad', 'pesadillas', 'monstruos', 'pesadilla', 'terror nocturno', 'no quiere dormir solo'],
    title: 'Pesadillas, Terrores Nocturnos e Imaginación Preescolar',
    source: 'AAP Pediatric Sleep Hygiene & Child Psychology Guidelines',
    clinicalSummary: 'A los 4-6 años la imaginación es vívida y el pensamiento mágico puede generar temores reales a la oscuridad, monstruos o sombras.',
    actionSteps: [
      'Validar el miedo sin burlas: "Sé que esa sombra te da miedo, vamos a encender la luz juntos para revisar".',
      'Establecer una rutina predecible de 4 pasos para dormir: Baño tibio -> Pijama -> Cuento relajante -> Luz tenue nocturna (luz ámbar indirecta).',
      'Evitar programas de televisión o pantallas con contenido violento o ruidoso al menos 2 horas antes de dormir.',
      'Dejar un objeto de apego (peluche de Froggi o mantita suave) como ancla de seguridad.'
    ],
    alarmSigns: [
      'Terrores nocturnos recurrentes todas las noches que generen sonambulismo con riesgo de caída o somnolencia diurna extrema.'
    ],
    recreationalTip: 'Escucha la Canción de Cuna de las Estrellas de Caracolito con su melodía relajante a 432 Hz antes de apagar la luz.'
  },
  {
    id: 'nutrition_4_6y',
    ageBracket: '4-6y',
    keywords: ['no come', 'verduras', 'selectivo', 'comida', 'lonchera', 'azúcar', 'golosinas', 'dientes', 'caries', 'picky eater'],
    title: 'Nutrición Infantil y Prevención de Selectividad Alimentaria',
    source: 'OMS (WHO) Healthy Diet Guidelines & AAPD Pediatric Dental Health',
    clinicalSummary: 'La etapa preescolar puede presentar neofobia alimentaria (rechazo a nuevos alimentos). Se requiere exposición repetida (8 a 15 veces) sin obligar ni sobornar.',
    actionSteps: [
      'Aplicar la División de Responsabilidades de Ellyn Satter: Los padres deciden QUÉ, CUÁNDO y DÓNDE se come; el niño decide SI come y CUÁNTO.',
      'Involucrar al niño en la cocina lavando hojas de lechuga o armando brochetas de frutas divertidas.',
      'Ofrecer agua natural como bebida principal; eliminar jugos envasados y bebidas azucaradas.',
      'Cepillar los dientes 2 veces al día con pasta dental fluorada (1000-1450 ppm de flúor en cantidad del tamaño de un guisante) supervisado por un adulto.'
    ],
    alarmSigns: [
      'Pérdida inexplicable de peso, caída de percentiles de crecimiento en el gráfico OMS, o sangrado gingival recurrente.'
    ],
    recreationalTip: 'Genera un cuento con la IA Transformer donde Froggi prepara un arcoíris de verduras con poderes mágicos.'
  },

  // ==========================================
  // ETAPA 7-10+ AÑOS (INFANCIA ESCOLAR)
  // ==========================================
  {
    id: 'screens_digital_7_10y',
    ageBracket: '7-10y+',
    keywords: ['pantallas', 'celular', 'tablet', 'videojuegos', 'redes', 'tiempo de pantalla', 'adicción', 'tecnología'],
    title: 'Salud Digital y Plan Familiar de Uso de Pantallas de la AAP',
    source: 'American Academy of Pediatrics (AAP) Family Media Plan',
    clinicalSummary: 'La AAP recomienda un límite de máximo 1 a 2 horas diarias de contenido recreativo de alta calidad para escolares de 7 a 10 años, priorizando el sueño, actividad física y convivencia cara a cara.',
    actionSteps: [
      'Establecer "Zonas libres de pantallas": Ningún dispositivo en dormitorios durante la noche ni en la mesa durante las comidas familiares.',
      'Apagar todas las pantallas al menos 60 minutos antes de dormir para evitar la supresión de melatonina por luz azul.',
      'Acompañar y supervisar el contenido digital que consumen, dialogando sobre seguridad en línea y privacidad.',
      'Modelar hábitos digitales saludables como adultos en el hogar.'
    ],
    alarmSigns: [
      'Aislamiento social completo, agresividad extrema al retirar el dispositivo o deterioro significativo del rendimiento escolar.'
    ],
    recreationalTip: 'Crea una historia interactiva con Froggi sobre cómo equilibrar el mundo digital y las aventuras al aire libre con amigos.'
  },
  {
    id: 'physical_activity_7_10y',
    ageBracket: '7-10y+',
    keywords: ['ejercicio', 'deporte', 'sedentarismo', 'obesidad', 'actividad física', 'juego al aire libre', '60 minutos'],
    title: 'Directrices OMS de Actividad Física y Prevención del Sedentarismo',
    source: 'OMS (WHO) Guidelines on Physical Activity and Sedentary Behaviour',
    clinicalSummary: 'Los niños de 5 a 17 años deben acumular un mínimo promedio de 60 minutos diarios de actividad física de intensidad moderada a vigorosa, principalmente aeróbica.',
    actionSteps: [
      'Fomentar juegos que involucren correr, saltar la cuerda, andar en bicicleta, patinar o nadar.',
      'Incorporar actividades que fortalezcan músculos y huesos al menos 3 días por semana.',
      'Hacer paseos familiares en parques o senderos los fines de semana.',
      'Reemplazar el tiempo sentado prolongado por pausas activas de estiramiento y movimiento.'
    ],
    alarmSigns: [
      'Dolor torácico, palpitaciones anormales o mareos intensos con desmayo durante el ejercicio físico.'
    ],
    recreationalTip: 'Pon la pista de "Danza de las Gotitas Felices" de Froggi y Monito para un reto de saltos y baile de 10 minutos en la sala.'
  },
  {
    id: 'mental_health_school_7_10y',
    ageBracket: '7-10y+',
    keywords: ['escuela', 'amigos', 'bullying', 'autoestima', 'ansiedad', 'tristeza', 'tareas', 'rendimiento', 'conflictos', 'deberes'],
    title: 'Salud Emocional, Autoestima y Manejo del Acoso Escolar',
    source: 'UNICEF Child Protection & AAP Mental Health in Primary Care',
    clinicalSummary: 'En la edad escolar se consolida la autoimagen y el sentido de competencia. Requieren un espacio seguro en casa donde expresar emociones sin juicio.',
    actionSteps: [
      'Dedicar 15 minutos diarios de escucha activa exclusiva sin teléfonos ni distracciones.',
      'Enseñar asertividad y límites personales ("Tengo derecho a decir NO con firmeza").',
      'Enfocarse en elogiar el esfuerzo, la constancia y la empatía en lugar de solo las calificaciones numéricas.',
      'Mantener comunicación fluida con los maestros y la escuela para detectar cambios de comportamiento a tiempo.'
    ],
    alarmSigns: [
      'Cambios drásticos de humor, negación rotunda a ir a la escuela, dolores psicosomáticos frecuentes (dolor de estómago los lunes por la mañana) o conductas regresivas.'
    ],
    recreationalTip: 'Utiliza el generador de cuentos Transformer de Amigos Unidos para escribir una historia personalizada sobre cómo resolver un dilema de amistad.'
  },
  {
    id: 'puberty_growth_10y_plus',
    ageBracket: '7-10y+',
    keywords: ['pubertad', 'estirón', 'estiron', 'dolor de crecimiento', 'dolor de piernas', 'pantorrillas', '10 años', '11 años', '12 años', 'cambios en el cuerpo', 'tanner'],
    title: 'Pubertad Temprana, Estirón de Crecimiento y Dolores Benignos',
    source: 'Guías de Endocrinología Pediátrica & AAP Adolescent Health',
    clinicalSummary: 'A partir de los 9-11 años en niñas y 10-12 años en niños inician las fases puberales (Escala de Tanner) y el estirón estatural. Los dolores de crecimiento son benignos, nocturnos y bilaterales en miembros inferiores.',
    actionSteps: [
      'Identificar la edad: Para un niño/a de 10 años o más, explicar de forma natural los cambios corporales que experimentará.',
      'Aliviar dolores nocturnos de piernas con masajes con crema humectante, calor local suave y ejercicios de estiramiento muscular.',
      'Asegurar una ingesta diaria de 1,000 a 1,300 mg de calcio (leche, yogur, queso, legumbres) para la rápida mineralización ósea.',
      'Mantener una comunicación de confianza donde puedan preguntar dudas sobre su intimidad e higiene personal sin tabúes.'
    ],
    alarmSigns: [
      'Dolor en una sola pierna acompañado de cojera durante el día, hinchazón articular o enrojecimiento.',
      'Aparición de signos puberales antes de los 8 años en niñas o 9 años en niños (pubertad precoz).'
    ],
    recreationalTip: 'Froggi y Monito proponen rutinas de yoga infantil y estiramientos suaves antes de dormir para relajar músculos y articulaciones.'
  },
  {
    id: 'acne_skincare_10y_plus',
    ageBracket: '7-10y+',
    keywords: ['acné', 'acne', 'espinillas', 'puntos negros', 'granitos en la cara', 'piel grasa', 'limpieza facial', 'higiene preadolescente'],
    title: 'Cuidado Facial, Acné Preadolescente e Higiene en Niños de 10+ Años',
    source: 'AAP Section on Dermatology & Sociedad de Dermatología Pediátrica',
    clinicalSummary: 'El incremento de andrógenos estimula la producción de sebo en la zona T (frente, nariz y mentón), originando los primeros comedones y espinillas en escolares y preadolescentes.',
    actionSteps: [
      'Rutina diaria: Lavar el rostro dos veces al día con limpiador dermatológico syndet (sin jabón alcalino) y agua templada.',
      'Aplicar protector solar facial con toque seco o fórmula acuosa diariamente para prevenir manchas.',
      'PROHIBIDO pellizcar o exprimir espinillas: propaga la bacteria C. acnes y genera cicatrices y marcas oscuras.',
      'Fomentar el cambio regular de la funda de la almohada (1-2 veces por semana) y evitar tocarse la cara con manos sucias.'
    ],
    alarmSigns: [
      'Aparición de nódulos profundos, quistes dolorosos o lesiones muy inflamadas que requieren valoración dermatológica.'
    ],
    recreationalTip: 'Aprende hábitos de autocuidado en la Zona Recreativa con el diario de bienestar y salud de Pandita.'
  },
  {
    id: 'sports_nutrition_10y_plus',
    ageBracket: '7-10y+',
    keywords: ['nutrición deportiva', 'deporte', 'proteínas', 'desayuno escolar', 'bebidas energeticas', 'hidratacion', 'calorias'],
    title: 'Nutrición Infantil para Escolares y Preadolescentes Deportistas (10+ Años)',
    source: 'OMS Directrices Nutricionales & AAP Committee on Nutrition',
    clinicalSummary: 'Los niños de 10 años o más que realizan deporte regular tienen mayores requerimientos de carbohidratos complejos, proteínas de alto valor biológico, hierro y agua pura.',
    actionSteps: [
      'Desayuno potente: Avena con fruta fresca, huevos, pan integral o yogur natural con semillas molidas.',
      'Hidratación: Agua pura antes, durante y después del ejercicio (150-250 ml cada 20 minutos de actividad intensa).',
      'Prohibir estrictamente bebidas energéticas (Monster, Red Bull, etc.) por su alto contenido de cafeína y taurina peligroso para el corazón infantil.',
      'Enfocar la comida como salud, fuerza y bienestar, evitando comentarios restrictivos sobre la figura corporal.'
    ],
    alarmSigns: [
      'Mareos intensos con visión borrosa durante el ejercicio o cambios restrictivos bruscos en la alimentación.'
    ],
    recreationalTip: 'Crea con Froggi un plan de loncheras coloridas y nutritivas para la semana escolar en la cocina de Amigos Unidos.'
  },
  {
    id: 'fever_meds_older_kids',
    ageBracket: '7-10y+',
    keywords: ['paracetamol 10 años', 'ibuprofeno 10 años', 'fiebre en niños grandes', 'dosis por peso 10 años', 'dolor de cabeza escolar'],
    title: 'Dosificación por Peso y Manejo de Fiebre en Niños Escolares y Mayores (10+ Años)',
    source: 'Guía AAP de Manejo de la Fiebre & Formulario Pediátrico Internacional',
    clinicalSummary: 'En niños de 10 años o más (peso promedio 30 a 50+ kg), la dosificación debe calcularse con precisión por kilo de peso real, utilizando presentaciones en comprimidos o jarabes concentrados.',
    actionSteps: [
      'Paracetamol: 10 a 15 mg/kg por dosis cada 6 a 8 horas (ej: un niño de 35 kg toma 350 a 500 mg por toma; dosis máxima 650 mg/toma).',
      'Ibuprofeno: 5 a 10 mg/kg por dosis cada 8 horas siempre con alimentos (ej: un niño de 35 kg toma 200 a 350 mg por toma; dosis máxima 400 mg/toma).',
      'Mantener hidratación continua con agua, caldos o infusiones suaves.',
      'NUNCA administrar ácido acetilsalicílico (Aspirina) por riesgo mortal de Síndrome de Reye.'
    ],
    alarmSigns: [
      'Fiebre superior a 39.5°C que no cede con antitérmicos, rigidez de nuca, manchas violáceas en la piel o dificultad respiratoria.'
    ],
    recreationalTip: 'Descanso en cama con lecturas guiadas de Froggi y música relajante de Caracolito.'
  },
  {
    id: 'first_aid_pediatric',
    ageBracket: '4-6y',
    keywords: ['golpe en la cabeza', 'chichon', 'quemadura', 'corte', 'herida', 'sangrado nasal', 'epistaxis', 'primeros auxilios', 'accidente'],
    title: 'Primeros Auxilios Pediátricos y Manejo de Traumatismos Leves',
    source: 'AAP Pediatric First Aid & Guía de Urgencias Hospitalarias',
    clinicalSummary: 'Los traumatismos y pequeños accidentes en el hogar son frecuentes. La valoración de la consciencia y signos de alarma en las primeras 24-48 horas es fundamental.',
    actionSteps: [
      'Golpe en la cabeza: Aplicar frío local envuelto en un paño durante 10-15 minutos. Observar al niño durante 24 horas.',
      'Quemadura térmica leve: Enfriar de inmediato con agua corriente a temperatura ambiente durante 10-15 minutos (nunca hielo, pasta de dientes ni mantequilla).',
      'Sangrado nasal: Inclinar la cabeza hacia adelante (NUNCA hacia atrás) y presionar las alas nasales firmemente durante 5-10 minutos.'
    ],
    alarmSigns: [
      'Golpe en cabeza con vómitos repetidos (>2 veces), pérdida de consciencia, somnolencia anormal o pupilas de diferente tamaño.',
      'Quemaduras con ampollas extensas o en cara/manos/genitales.'
    ],
    recreationalTip: 'Pandita ofrece un abrazo calmante y una meditación de respiración lenta mientras se aplica el frío local.'
  }
];

export function findPediatricKnowledge(query: string, age: AgeBracket): PediatricTopic | null {
  const normalized = query.toLowerCase();
  
  // Score-based matching to find the absolute best topic
  let bestMatch: PediatricTopic | null = null;
  let bestScore = 0;

  for (const topic of PEDIATRIC_KNOWLEDGE_BASE) {
    let score = 0;
    for (const keyword of topic.keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        score += keyword.length; // More specific keyword matches weigh higher
      }
    }

    if (topic.ageBracket === age) {
      score += 5; // Preference for current age bracket
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = topic;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}
