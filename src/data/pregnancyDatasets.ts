/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PregnancyWeekInfo,
  PregnancyTrimesterGuide,
  PregnancyObstetricRedFlag,
  PregnancyCommonSymptom,
  HospitalBagItem
} from '../types';

// =======================================================
// 1. DATASET SEMANA A SEMANA (SEMANAS 1 A 40) - ACOG & OMS
// =======================================================

export const PREGNANCY_WEEKS_DATASET: PregnancyWeekInfo[] = [
  {
    week: 4,
    trimester: 1,
    babyFruitComparison: {
      fruit: 'Semilla de Amapola',
      emoji: '🌱',
      comparisonText: 'El blastocisto se implanta en el endometrio uterino. Es del tamaño de una semilla minúscula.'
    },
    babyLengthCm: 0.1,
    babyWeightGrams: 0.01,
    fetalDevelopmentHighlights: [
      'Implantación del blastocisto en la pared uterina.',
      'Comienza la formación del saco amniótico y el disco embrionario bilaminar.',
      'Inicio de la producción de hormona Gonadotropina Coriónica Humana (hCG).'
    ],
    maternalBodyChanges: [
      'Posible ligero sangrado de implantación (rosado o marrón claro, muy escaso).',
      'Aumento de la sensibilidad mamaria y fatiga leve.',
      'Positivo en prueba de embarazo casera de orina.'
    ],
    recommendedCareAndNutrition: [
      'Ácido fólico 400 - 800 mcg diarios para prevenir defectos del tubo neural (espina bífida).',
      'Yodo 200 mcg diarios y Vitamina D3 según indicación médica.',
      'Cero alcohol, cero tabaco y supresión de medicamentos no prescritos por obstetricia.'
    ],
    keyMedicalTests: [
      'Prueba de embarazo en orina o sangre (beta-hCG cuantitativa).',
      'Primera cita preconcepcional / prenatal con matrona u obstetra.'
    ],
    warningSignsToCheck: [
      'Dolor pélvico punzante intenso unilateral (descartar embarazo ectópico).',
      'Sangrado rojo rutilante abundante con coágulos.'
    ]
  },
  {
    week: 6,
    trimester: 1,
    babyFruitComparison: {
      fruit: 'Semilla de Lenteja',
      emoji: '🫘',
      comparisonText: 'El corazoncito del embrión ya late a unas 100-160 pulsaciones por minuto.'
    },
    babyLengthCm: 0.5,
    babyWeightGrams: 0.1,
    fetalDevelopmentHighlights: [
      'El tubo neural se cierra a lo largo de la espalda.',
      'El corazón primitivo late regularmente (visible en ecografía transvaginal).',
      'Aparecen los esbozos de brazos, piernas, ojos y oídos.'
    ],
    maternalBodyChanges: [
      'Náuseas matutinas y aversión a ciertos olores por aumento de estrógenos y hCG.',
      'Ganas frecuentes de orinar por mayor irrigación renal y relajación vesical.',
      'Mayor somnolencia y necesidad de siestas cortas.'
    ],
    recommendedCareAndNutrition: [
      'Comidas fraccionadas en 5-6 tomas pequeñas para reducir las náuseas.',
      'Tener galletas integrales o frutos secos junto a la cama antes de levantarse.',
      'Hidratación con sorbos de agua fría o infusiones de jengibre seguras.'
    ],
    keyMedicalTests: [
      'Primera analítica de sangre: grupo y Rh, hemograma, serologías (Toxoplasma, Rubeola, VIH, Hepatitis B, Sífilis).'
    ],
    warningSignsToCheck: [
      'Vómitos continuos que impiden tolerar líquidos por más de 12 horas (hiperémesis gravídica).',
      'Fiebre mayor a 38°C.'
    ]
  },
  {
    week: 8,
    trimester: 1,
    babyFruitComparison: {
      fruit: 'Frambuesa Silvestre',
      emoji: '🫐',
      comparisonText: 'Se diferencian los deditos de manos y pies con palmeado transitorio.'
    },
    babyLengthCm: 1.6,
    babyWeightGrams: 1.0,
    fetalDevelopmentHighlights: [
      'Desarrollo acelerado de los hemisferios cerebrales y médula espinal.',
      'Formación de párpados, punta de la nariz y labio superior.',
      'Primeros movimientos reflejos involuntarios, aún imperceptibles para la madre.'
    ],
    maternalBodyChanges: [
      'El útero alcanza el tamaño de una pelota de tenis.',
      'Cambios en el sentido del gusto (sabor metálico o disgeusia).',
      'Posibles cambios de humor por la fluctuación hormonal intensa.'
    ],
    recommendedCareAndNutrition: [
      'Ingesta de alimentos ricos en vitamina B6 (plátano, avena, pollo) para aliviar náuseas.',
      'Lavar muy bien frutas y verduras crudas para prevenir toxoplasmosis.',
      'Cocinar carnes y huevos completamente (nada crudo ni semicocido).'
    ],
    keyMedicalTests: [
      'Ecografía de viabilidad del primer trimestre (confirmación de saco gestacional y latido cardíaco).'
    ],
    warningSignsToCheck: [
      'Dolor abdominal cólico severo.',
      'Pérdida de tejido o coágulos por vía vaginal.'
    ]
  },
  {
    week: 10,
    trimester: 1,
    babyFruitComparison: {
      fruit: 'Fresita Dulce',
      emoji: '🍓',
      comparisonText: 'Finaliza el periodo embrionario y pasa a llamarse oficialmente feto.'
    },
    babyLengthCm: 3.1,
    babyWeightGrams: 4.0,
    fetalDevelopmentHighlights: [
      'Todos los órganos vitales ya están formados y empiezan a madurar.',
      'Los dedos se separan por apoptosis y desaparece la cola embrionaria.',
      'Se forman los brotes de los dientes de leche dentro de las encías.'
    ],
    maternalBodyChanges: [
      'Aumento del volumen sanguíneo materno (hasta un 40-50% a lo largo del embarazo).',
      'Venas más visibles en pechos y abdomen por mayor circulación.',
      'Gingivitis del embarazo (encías más sensibles al cepillado).'
    ],
    recommendedCareAndNutrition: [
      'Usar cepillo dental de cerdas suaves y enjuague sin alcohol.',
      'Aporte de calcio (1000 mg/día): yogur natural pasteurizado, leche, sésamo, almendras.',
      'Paseos diarios de 30 minutos a paso ligero para activar la circulación venosa.'
    ],
    keyMedicalTests: [
      'Test Prenatal No Invasivo (NIPT / ADN fetal en sangre materna, opcional desde semana 10).'
    ],
    warningSignsToCheck: [
      'Ardor intenso al orinar o sensación de vaciado incompleto (infección urinaria).'
    ]
  },
  {
    week: 12,
    trimester: 1,
    babyFruitComparison: {
      fruit: 'Ciruela Jugosa',
      emoji: '🫐',
      comparisonText: 'El feto ya tiene reflejo de deglución, abre y cierra las manitas.'
    },
    babyLengthCm: 5.4,
    babyWeightGrams: 14.0,
    fetalDevelopmentHighlights: [
      'El feto deglute líquido amniótico y sus riñones producen orina estéril.',
      'Aparecen las uñas de las manos y los reflejos faciales (frunce el ceño).',
      'La placenta asume por completo la producción hormonal nutricional.'
    ],
    maternalBodyChanges: [
      'El útero sube por encima del pubis, disminuyendo la presión directa en la vejiga.',
      'Las náuseas matutinas suelen empezar a remitir gradualmente.',
      'Aparece la línea alba (línea oscura que baja por el centro del abdomen).'
    ],
    recommendedCareAndNutrition: [
      'Proteínas de alto valor biológico (70-80 g/día) para el crecimiento tisular.',
      'Uso de sujetadores sin aros que no compriman los conductos mamarios.',
      'Crema hidratante corporal con centella asiática o aceite de almendras para elasticidad dérmica.'
    ],
    keyMedicalTests: [
      'Ecografía del 1° Trimestre (11+2 a 13+6 semanas): Medición de la Translucencia Nucal (TN) y Cribado Combinado de Aneuploidías (Síndrome de Down, Edwards, Patau).'
    ],
    warningSignsToCheck: [
      'Sangrado vaginal de cualquier cantidad.',
      'Dolor pélvico constante no mitigable con reposo.'
    ]
  },
  {
    week: 14,
    trimester: 2,
    babyFruitComparison: {
      fruit: 'Limón Amarillo',
      emoji: '🍋',
      comparisonText: '¡Bienvenida al 2° Trimestre! El feto hace expresiones y traga líquido.'
    },
    babyLengthCm: 8.7,
    babyWeightGrams: 43.0,
    fetalDevelopmentHighlights: [
      'El cuello se alarga y la cabeza se yergue.',
      'El cuerpo se cubre de lanugo (vello fino que protege la piel en el agua).',
      'El feto responde a estímulos táctiles suaves sobre el abdomen.'
    ],
    maternalBodyChanges: [
      'Mayor vitalidad y energía (la "luna de miel" del embarazo).',
      'La barriguita empieza a ser evidente para los demás.',
      'Mayor apetito y mejor tolerancia a las comidas.'
    ],
    recommendedCareAndNutrition: [
      'Hierro y Vitamina C (cítricos, kiwi, pimientos) para facilitar la absorción del hierro y prevenir anemia.',
      'Iniciar ejercicios para el suelo pélvico (contracciones de Kegel suaves).',
      'Evitar levantar cargas pesadas superiores a 5-8 kg.'
    ],
    keyMedicalTests: [
      'Control de tensión arterial y peso materno mensual con matrona.'
    ],
    warningSignsToCheck: [
      'Tensión arterial sistólica ≥ 140 mmHg o diastólica ≥ 90 mmHg.',
      'Cefalea persistente que no cede con paracetamol.'
    ]
  },
  {
    week: 16,
    trimester: 2,
    babyFruitComparison: {
      fruit: 'Aguacate Cremoso',
      emoji: '🥑',
      comparisonText: 'Los ojos del bebé reaccionan a la luz filtrada a través de la pared abdominal.'
    },
    babyLengthCm: 11.6,
    babyWeightGrams: 100.0,
    fetalDevelopmentHighlights: [
      'El sistema circulatorio bombea unos 24 litros de sangre al día a través del cordón umbilical.',
      'Los ojos se mueven lentamente de lado a lado y las orejas se sitúan en su posición definitiva.',
      'El esqueleto empieza a osificarse a partir del cartílago flexible.'
    ],
    maternalBodyChanges: [
      'Sensación de "mariposas" o "burbujas" en el vientre (primeras sensaciones fetales en mamás multíparas).',
      'Congestión nasal o rinitis del embarazo por aumento del flujo sanguíneo en mucosas.',
      'Posibles episodios de estreñimiento por efecto relajante de la progesterona.'
    ],
    recommendedCareAndNutrition: [
      'Aumentar la fibra dietética (legumbres, chía, pan integral, ciruelas) y beber 2 a 2.5 litros de agua al día.',
      'Dormir preferentemente de lado (decúbito lateral izquierdo) para optimizar el retorno venoso de la vena cava.',
      'Utilizar almohada de embarazo entre las rodillas.'
    ],
    keyMedicalTests: [
      'Revisión odontológica del segundo trimestre.'
    ],
    warningSignsToCheck: [
      'Flujo vaginal con mal olor, picor intenso o coloración verdosa (vaginosis).'
    ]
  },
  {
    week: 18,
    trimester: 2,
    babyFruitComparison: {
      fruit: 'Pimiento Rojo',
      emoji: '🫑',
      comparisonText: 'El feto escucha los latidos del corazón materno, el flujo sanguíneo y las voces familiares.'
    },
    babyLengthCm: 14.2,
    babyWeightGrams: 190.0,
    fetalDevelopmentHighlights: [
      'Se forman las huellas dactilares únicas en las yemas de sus dedos.',
      'La mielina comienza a recubrir los nervios espinales para acelerar las señales cerebrales.',
      'El feto bosteza, tiene hipo y se chupa el dedo pulgar.'
    ],
    maternalBodyChanges: [
      'Mareos leves al ponerse de pie rápidamente (hipotensión supina o postural).',
      'Aumento del tamaño de las aureolas mamarias con corpúsculos de Montgomery más prominentes.',
      'Picor en la piel del abdomen por estiramiento de las fibras dérmicas.'
    ],
    recommendedCareAndNutrition: [
      'Ácidos grasos Omega-3 (DHA 200-300 mg/día) para el desarrollo neurocerebral y visual fetal.',
      'Consumir pescado azul pequeño bajo en mercurio: sardinas, caballa, salmón o suplementos de algas.',
      'Evitar pescados grandes con alto contenido de mercurio: pez espada, atún rojo, tiburón y lucio.'
    ],
    keyMedicalTests: [
      'Preparación para la ecografía morfológica de alta resolución.'
    ],
    warningSignsToCheck: [
      'Dolor lumbar intenso acompañado de fiebre y escalofríos (descartar pielonefritis).'
    ]
  },
  {
    week: 20,
    trimester: 2,
    babyFruitComparison: {
      fruit: 'Plátano Dulce',
      emoji: '🍌',
      comparisonText: '¡Ecuador del embarazo! Mitad de la gestación (20 de 40 semanas).'
    },
    babyLengthCm: 25.6,
    babyWeightGrams: 300.0,
    fetalDevelopmentHighlights: [
      'La piel se cubre de vérnix caseosa (sustancia cremosa blanca que impermeabiliza la piel).',
      'Desarrollo completo de los órganos genitales (claramente identificables en ecografía).',
      'Ciclos activos de vigilia y sueño con movimientos vigorosos de pataditas y giros.'
    ],
    maternalBodyChanges: [
      'El fondo uterino llega exactamente a la altura del ombligo.',
      'La mayoría de las madres primerizas ya sienten con claridad los movimientos de su bebé.',
      'Dolor en el ligamento redondo (pinchazos breves en ingles al cambiar de postura).'
    ],
    recommendedCareAndNutrition: [
      'Mantener buena postura lumbar con pelvis neutra.',
      'Yoga o pilates prenatal guiado por instructores certificados.',
      'Calzado cómodo con 2-3 cm de suela ergonómica (evitar tacones altos y calzado totalmente plano).'
    ],
    keyMedicalTests: [
      'ECOGRAFÍA MORFOLÓGICA DE ALTA RESOLUCIÓN (Semana 18 a 22): Evaluación anatómica exhaustiva órgano por órgano (cerebro, corazón 4 cámaras, riñones, columna, extremidades y cordón de 3 vasos).'
    ],
    warningSignsToCheck: [
      'Pérdida acuosa continua por vagina (rotura prematura de membranas).',
      'Contracciones uterinas dolorosas y rítmicas antes de tiempo.'
    ]
  },
  {
    week: 24,
    trimester: 2,
    babyFruitComparison: {
      fruit: 'Mazorca de Maíz Dulce',
      emoji: '🌽',
      comparisonText: 'Alcanza el límite de viabilidad fetal extrauterina con cuidados intensivos neonatales.'
    },
    babyLengthCm: 30.0,
    babyWeightGrams: 600.0,
    fetalDevelopmentHighlights: [
      'Los pulmones comienzan a producir surfactante pulmonar (sustancia que mantiene abiertos los alvéolos).',
      'El oído interno está completamente formado: reconoce y se calma con la voz materna y paterna.',
      'Las papilas gustativas están desarrolladas: percibe sabores del líquido amniótico según la dieta materna.'
    ],
    maternalBodyChanges: [
      'Aparición de contracciones de Braxton Hicks (endurecimiento del abdomen sin dolor, irregular y breve).',
      'Aumento del flujo vaginal fisiológico (leucorrea blanquecina no irritante).',
      'Sensación de calor o sudoración más fácil por el metabolismo aumentado.'
    ],
    recommendedCareAndNutrition: [
      'Control del consumo de azúcares simples y harinas refinadas para prevenir diabetes gestacional.',
      'Hablarle y cantarle al bebé todos los días; responder a sus pataditas con caricias sobre el vientre.',
      'Mantener hidratación constante con agua fresca.'
    ],
    keyMedicalTests: [
      'Test de O’Sullivan (Cribado de Diabetes Gestacional con sobrecarga oral de 50 g de glucosa entre semanas 24 y 28).'
    ],
    warningSignsToCheck: [
      'Sensación de opresión pélvica intensa con más de 4 contracciones por hora.',
      'Edema súbito en cara, párpados y manos al despertar.'
    ]
  },
  {
    week: 28,
    trimester: 3,
    babyFruitComparison: {
      fruit: 'Berenjena Grande',
      emoji: '🍆',
      comparisonText: '¡Bienvenida al 3° Trimestre! El bebé abre sus ojitos y parpadea con pestañas completas.'
    },
    babyLengthCm: 37.6,
    babyWeightGrams: 1000.0,
    fetalDevelopmentHighlights: [
      'El feto pesa ya aproximadamente 1 kilogramo y abre los ojos con pestañas.',
      'Aumenta el tejido adiposo bajo la piel, alisando las arruguitas.',
      'Capacidad cerebral de generar ondas cerebrales REM (sueño con ensoñación).'
    ],
    maternalBodyChanges: [
      'Mayor dificultad para respirar hondo cuando el útero empuja el diafragma hacia arriba.',
      'Calambres nocturnos en las pantorrillas y piernas cansadas.',
      'Reflujo gastroesofágico (acidez) por desplazamiento del estómago.'
    ],
    recommendedCareAndNutrition: [
      'Cenar ligero al menos 2 horas antes de acostarse y elevar el cabecero de la cama 15 cm.',
      'Magnesio y potasio (plátanos, frutos secos, espinacas) para aliviar calambres en piernas.',
      'Iniciar el conteo diario de movimientos fetales (Kick Counter).'
    ],
    keyMedicalTests: [
      'Inyección de Gammaglobulina Anti-D en la semana 28 si la madre es Rh negativo y el padre Rh positivo.',
      'Segunda analítica de sangre y orina del tercer trimestre.'
    ],
    warningSignsToCheck: [
      'Disminución marcada o cese de movimientos fetales (menos de 10 movimientos en 2 horas tras comer).',
      'Visión borrosa, destellos luminosos (fosfenos) o zumbido de oídos (acúfenos).'
    ]
  },
  {
    week: 32,
    trimester: 3,
    babyFruitComparison: {
      fruit: 'Piña Tropical',
      emoji: '🍍',
      comparisonText: 'La mayoría de los bebés ya se colocan en posición cefálica (cabeza hacia abajo).'
    },
    babyLengthCm: 42.4,
    babyWeightGrams: 1700.0,
    fetalDevelopmentHighlights: [
      'Los huesos están casi completamente endurecidos, excepto los del cráneo (fontanelas flexibles para el parto).',
      'El bebé practica movimientos respiratorios continuos expandiendo el tórax.',
      'Las uñas llegan a la punta de los deditos de las manos.'
    ],
    maternalBodyChanges: [
      'Posible secreción de calostro por los pezones (primer alimento líquido dorado rico en anticuerpos).',
      'Hinchazón moderada de pies y tobillos hacia el final del día.',
      'Dificultad para encontrar postura cómoda para dormir.'
    ],
    recommendedCareAndNutrition: [
      'Poner las piernas en alto durante 20 minutos al llegar a casa y duchas de agua templada en piernas.',
      'Iniciar masaje perineal diario a partir de la semana 34 con aceite de rosa mosqueta o almendras.',
      'Comenzar el curso de preparación al parto y crianza con la matrona.'
    ],
    keyMedicalTests: [
      'Ecografía del 3° Trimestre (Semanas 32 a 36): Evaluación del crecimiento fetal, cantidad de líquido amniótico y posición de la placenta.'
    ],
    warningSignsToCheck: [
      'Dolor punzante constante en la boca del estómago (epigastralgia en barra).',
      'Prurito o picor intenso generalizado en palmas de manos y plantas de pies sin lesiones visibles (descartar colestasis intrahepática del embarazo).'
    ]
  },
  {
    week: 36,
    trimester: 3,
    babyFruitComparison: {
      fruit: 'Papaya Dulce',
      emoji: '🍈',
      comparisonText: 'Gana unos 200 a 250 gramos de peso por semana acumulando grasa térmica.'
    },
    babyLengthCm: 47.4,
    babyWeightGrams: 2600.0,
    fetalDevelopmentHighlights: [
      'El sistema digestivo está completamente preparado para digerir la leche materna.',
      'El meconio (primera deposición oscura del recién nacido) se acumula en sus intestinos.',
      'Pierde casi todo el lanugo y la mayor parte del vérnix caseosa.'
    ],
    maternalBodyChanges: [
      'El bebé "desciende" y encaja su cabecita en la pelvis (alivio respiratorio pero mayor presión vesical).',
      'Pérdida gradual o completa del tapón mucoso (sustancia gelatinosa espesa, a veces teñida de marrón o rosa).',
      'Contracciones de entrenamiento más frecuentes e intensas.'
    ],
    recommendedCareAndNutrition: [
      'Tener lista la maleta del hospital para mamá, bebé y acompañante.',
      'Practicar técnicas de respiración profunda y relajación para las olas de contracción.',
      'Infusiones de hojas de frambuesa (según consejo de la matrona para tono uterino).'
    ],
    keyMedicalTests: [
      'Cultivo vagino-rectal para Estreptococo del Grupo B (EGB) entre las semanas 35 y 37.',
      'Consulta con anestesiología si se contempla opción de analgesia epidural.'
    ],
    warningSignsToCheck: [
      'Salida franca de líquido amniótico claro o con tinte verdoso.',
      'Sangrado vaginal similar a una regla.'
    ]
  },
  {
    week: 38,
    trimester: 3,
    babyFruitComparison: {
      fruit: 'Calabaza Invernal',
      emoji: '🎃',
      comparisonText: '¡A término completo! El bebé está listo para nacer en cualquier momento.'
    },
    babyLengthCm: 49.8,
    babyWeightGrams: 3100.0,
    fetalDevelopmentHighlights: [
      'Maduración pulmonar completa con producción óptima de surfactante.',
      'Fuerte reflejo de succión y prensión palmar listo para el agarre al pecho materno.',
      'El cerebro sigue formando miles de millones de conexiones neuronales cada día.'
    ],
    maternalBodyChanges: [
      'El cuello uterino comienza a madurar, ablandarse y borrarse.',
      'Sensación de peso pélvico y calambres eléctricos breves en el pubis.',
      'Aparición del instinto de "nido" (deseo irrefrenable de limpiar y ordenar el hogar para la llegada).'
    ],
    recommendedCareAndNutrition: [
      'Descansar todo lo posible y no sobrecargarse de tareas domésticas.',
      'Repasar el Plan de Parto con la pareja o acompañante.',
      'Conocer la ruta más rápida al hospital o maternidad elegida.'
    ],
    keyMedicalTests: [
      'Monitores fetales (Registro Cardiotocográfico / RCTG) semanales para monitorizar frecuencia cardíaca fetal y dinámica uterina.'
    ],
    warningSignsToCheck: [
      'Regla 5-1-1 de Contracciones: Contracciones cada 5 minutos, que duran 1 minuto, durante 1 hora continua (o cada 3-4 minutos en mamás con partos previos).',
      'Rotura de bolsa con líquido meconial (color verde o marrón).'
    ]
  },
  {
    week: 40,
    trimester: 3,
    babyFruitComparison: {
      fruit: 'Sandía Grande',
      emoji: '🍉',
      comparisonText: '¡Fecha Probable de Parto (FPP)! Listo para el contacto piel con piel.'
    },
    babyLengthCm: 51.2,
    babyWeightGrams: 3400.0,
    fetalDevelopmentHighlights: [
      'Feto completamente maduro, adaptado para la respiración aeróbica extrauterina.',
      'La placenta comienza a envejecer fisiológicamente pero mantiene soporte vital.',
      'Los anticuerpos maternos IgG transferidos protegerán al bebé los primeros 6 meses de vida.'
    ],
    maternalBodyChanges: [
      'Dilatación y borramiento activo del cuello uterino.',
      'Contracciones de parto rítmicas, progresivas y que no ceden con el reposo.',
      'Sensación de plenitud y expectación.'
    ],
    recommendedCareAndNutrition: [
      'Mantener la calma, respiración suave y postura vertical / movimiento de caderas durante las contracciones.',
      'Hidratación con pequeños sorbos de agua o zumos claros.',
      'Acudir al hospital según los criterios clínicos explicados por tu matrona.'
    ],
    keyMedicalTests: [
      'Monitorización fetal y ecografía del perfil biofísico si el embarazo se prolonga más allá de la semana 40.'
    ],
    warningSignsToCheck: [
      'Fiebre en la madre durante el trabajo de parto.',
      'Sangrado rojo vivo abundante.',
      'Disminución súbita de movimientos fetales.'
    ]
  }
];

// =======================================================
// 2. GUÍA INTEGRAL POR TRIMESTRES (OMS, ACOG & UNICEF)
// =======================================================

export const PREGNANCY_TRIMESTER_GUIDES: PregnancyTrimesterGuide[] = [
  {
    trimester: 1,
    title: 'Primer Trimestre: Génesis & Embriogénesis (Semanas 1 a 13)',
    weeksRange: 'Semanas 1 a 13',
    fetalHighlightsSummary: 'Formación de todos los órganos principales, tubo neural, extremidades y latido cardíaco detectable desde la semana 6.',
    essentialNutrients: [
      {
        name: 'Ácido Fólico (Vitamina B9)',
        recommendedDaily: '400 a 800 mcg/día',
        foodSources: ['Espinacas', 'Brócoli', 'Lentejas', 'Garbanzos', 'Naranjas', 'Suplemento prenatal'],
        importance: 'Esencial para el cierre correcto del tubo neural y prevención de anencefalia y espina bífida.'
      },
      {
        name: 'Yodo',
        recommendedDaily: '200 a 250 mcg/día',
        foodSources: ['Sal yodada', 'Pescados blancos cocidos', 'Lácteos pasteurizados'],
        importance: 'Fundamental para la síntesis de hormonas tiroideas y el desarrollo cerebral fetal.'
      },
      {
        name: 'Vitamina B6 (Piridoxina)',
        recommendedDaily: '1.9 mg/día',
        foodSources: ['Plátanos', 'Avena integral', 'Pechuga de pollo', 'Patatas cocidas'],
        importance: 'Ayuda a regular el metabolismo de aminoácidos y mitiga significativamente las náuseas del embarazo.'
      }
    ],
    foodsToAvoidOrLimit: [
      {
        food: 'Carnes crudas o poco hechas (embutidos sin congelar)',
        reason: 'Riesgo de Toxoplasmosis que puede causar malformaciones oculares y cerebrales congénitas.',
        safeAlternative: 'Carne bien cocida a >71°C en el centro o embutido previamente congelado a -20°C por 7 días.'
      },
      {
        food: 'Quesos no pasteurizados (brie, camembert, roquefort de leche cruda)',
        reason: 'Riesgo de Listeria monocytogenes, bacteria resistente al frío que causa abortos e infecciones graves.',
        safeAlternative: 'Cualquier queso elaborado con leche pasteurizada (comprobar etiqueta).'
      },
      {
        food: 'Pescados y mariscos crudos (sushi, ostras, ceviche, carpaccio)',
        reason: 'Riesgo de anisakis, salmonella y bacterias marinas.',
        safeAlternative: 'Pescado cocinado a alta temperatura o sushi vegetal/de pescado cocido.'
      },
      {
        food: 'Huevos crudos o preparaciones con huevo crudo (mayonesa casera, tiramisú)',
        reason: 'Riesgo de intoxicación por Salmonella enterica.',
        safeAlternative: 'Huevos cocidos con yema firme o mayonesa industrial pasteurizada.'
      },
      {
        food: 'Alcohol de cualquier tipo y dosis',
        reason: 'No existe dosis segura. Causa Síndrome Alcohólico Fetal (SAF), retraso cognitivo y malformaciones.',
        safeAlternative: 'Agua mineral con rodajas de fruta fresca, limonadas caseras o zumos naturales.'
      }
    ],
    medicalAppointmentsAndScans: [
      {
        timeframe: 'Semanas 6 a 8',
        name: 'Primera Consulta Prenatal & Ecografía de Viabilidad',
        purpose: 'Confirmar gestación intrauterina, latido cardíaco embrionario y número de embriones.'
      },
      {
        timeframe: 'Semanas 9 a 11',
        name: 'Analítica General del Primer Trimestre',
        purpose: 'Hemograma, grupo sanguíneo y factor Rh, anticuerpos irregulares, serologías y urocultivo.'
      },
      {
        timeframe: 'Semanas 11+2 a 13+6',
        name: 'Ecografía del 1° Trimestre & Cribado de Aneuploidías',
        purpose: 'Medición de Translucencia Nucal (TN), hueso nasal y cálculo de riesgo para trisomías 21, 18 y 13.'
      }
    ],
    maternalWellbeingTips: [
      'Descansa siempre que el cuerpo te lo pida; el gasto energético para crear la placenta es equivalente a correr una maratón.',
      'Fracciona las comidas en porciones pequeñas cada 2-3 horas.',
      'Evita olores fuertes y ventila bien los espacios.',
      'No tomes ningún medicamento sin consultar previamente con tu médico o matrona.'
    ]
  },
  {
    trimester: 2,
    title: 'Segundo Trimestre: Expansión, Vitalidad & Sentir al Bebé (Semanas 14 a 27)',
    weeksRange: 'Semanas 14 a 27',
    fetalHighlightsSummary: 'El feto duplica su tamaño, perfecciona sus sentidos, abre y cierra los ojos, deglute líquido y la madre percibe sus pataditas claras.',
    essentialNutrients: [
      {
        name: 'Hierro',
        recommendedDaily: '27 a 30 mg/día',
        foodSources: ['Carnes magras', 'Lentejas y garbanzos con limón', 'Espinacas', 'Semillas de calabaza'],
        importance: 'Soporta la duplicación de la masa eritrocitaria materna y previene anemia ferropénica y fatiga.'
      },
      {
        name: 'Calcio',
        recommendedDaily: '1000 a 1200 mg/día',
        foodSources: ['Yogur pasteurizado', 'Queso pasteurizado', 'Bebidas vegetales enriquecidas', 'Brócoli', 'Tofu'],
        importance: 'Construcción del esqueleto óseo y dentición fetal sin descalcificar los huesos maternos.'
      },
      {
        name: 'DHA (Omega-3 marino)',
        recommendedDaily: '200 a 300 mg/día',
        foodSources: ['Sardinas', 'Salmón cocido', 'Caballa pequeña', 'Suplementos de microalgas'],
        importance: 'Desarrollo de la retina y de la corteza cerebral fetal.'
      }
    ],
    foodsToAvoidOrLimit: [
      {
        food: 'Pescados con alto contenido de mercurio (Pez espada, emperador, atún rojo, tiburón)',
        reason: 'El metilmercurio atraviesa la placenta y es neurotóxico para el cerebro en desarrollo.',
        safeAlternative: 'Pescados azules de tamaño pequeño a mediano (sardina, boquerón, caballa, salmón).'
      },
      {
        food: 'Cafeína en exceso (>200 mg diarios / más de 1-2 tazas de café)',
        reason: 'Puede asociarse con bajo peso al nacer y vasoconstricción placentaria.',
        safeAlternative: 'Café descafeinado, achicoria, infusiones seguras (roibos, manzanilla suave).'
      }
    ],
    medicalAppointmentsAndScans: [
      {
        timeframe: 'Semanas 18 a 22',
        name: 'ECOGRAFÍA MORFOLÓGICA DE ALTA RESOLUCIÓN',
        purpose: 'Revisión exhaustiva de la anatomía de todos los órganos fetales, placenta, cordón y líquido amniótico.'
      },
      {
        timeframe: 'Semanas 24 a 28',
        name: 'Test de O’Sullivan (Cribado de Diabetes Gestacional)',
        purpose: 'Extracción de sangre 1 hora tras ingesta de 50 g de glucosa oral para detectar resistencia a la insulina.'
      }
    ],
    maternalWellbeingTips: [
      'Dormir de costado izquierdo con una almohada entre las piernas para liberar la vena cava inferior.',
      'Realizar caminatas diarias y natación prenatal para mejorar el retorno venoso y prevenir edemas.',
      'Hidratar la piel del abdomen y los pechos con aceites naturales para favorecer la elasticidad dérmica.'
    ]
  },
  {
    trimester: 3,
    title: 'Tercer Trimestre: Maduración Pulmonar, Nido & Preparación al Parto (Semanas 28 a 40+)',
    weeksRange: 'Semanas 28 a 40+',
    fetalHighlightsSummary: 'Ganancia rápida de peso graso, maduración pulmonar con surfactante, encajamiento en la pelvis y respuesta auditiva activa.',
    essentialNutrients: [
      {
        name: 'Vitamina K',
        recommendedDaily: '90 mcg/día',
        foodSources: ['Verduras de hoja verde oscura', 'Kale', 'Espinacas', 'Aceite de oliva virgen extra'],
        importance: 'Crucial para los factores de coagulación sanguínea y prevención de hemorragias neonatales.'
      },
      {
        name: 'Proteínas de Alta Calidad',
        recommendedDaily: '75 a 85 g/día',
        foodSources: ['Huevos bien cocidos', 'Legumbres', 'Aves', 'Pescados cocidos', 'Frutos secos'],
        importance: 'Suministro continuo de aminoácidos para la fase de máximo crecimiento tisular fetal.'
      },
      {
        name: 'Magnesio',
        recommendedDaily: '350 a 400 mg/día',
        foodSources: ['Almendras', 'Plátano', 'Cacao puro', 'Semillas de lino'],
        importance: 'Regulación del tono muscular, alivio de calambres nocturnos y relajación uterina fisiológica.'
      }
    ],
    foodsToAvoidOrLimit: [
      {
        food: 'Comidas copiosas, grasas o muy condimentadas antes de dormir',
        reason: 'Favorecen el reflujo gastroesofágico severo por la compresión del estómago por el útero.',
        safeAlternative: 'Cenas tempranas y ligeras, elevar el cabecero de la cama 15-20 cm.'
      },
      {
        food: 'Exceso de sodio y sal común de mesa',
        reason: 'Empeora la retención de líquidos y la hinchazón de extremidades inferiores.',
        safeAlternative: 'Sazonar con hierbas aromáticas, orégano, romero, limón y sal con moderación.'
      }
    ],
    medicalAppointmentsAndScans: [
      {
        timeframe: 'Semana 28',
        name: 'Gammaglobulina Anti-D (en madres Rh negativas)',
        purpose: 'Prevenir la isoinmunización Rh materno-fetal.'
      },
      {
        timeframe: 'Semanas 32 a 34',
        name: 'Ecografía del 3° Trimestre',
        purpose: 'Valorar percentil de crecimiento fetal (RCIU vs Macrosomía), líquido amniótico y posición cefálica.'
      },
      {
        timeframe: 'Semanas 35 a 37',
        name: 'Cultivo Vagino-Rectal para Estreptococo Agalactiae (EGB)',
        purpose: 'Detectar colonización bacteriana para administrar profilaxis antibiótica intraparto si es positivo.'
      },
      {
        timeframe: 'Semanas 38 a 41',
        name: 'Monotorización Cardiotocográfica Fetal (Correas)',
        purpose: 'Evaluar bienestar fetal, reactividad cardíaca y frecuencia de contracciones uterinas.'
      }
    ],
    maternalWellbeingTips: [
      'Monitorea a diario los movimientos del bebé; si notas una disminución brusca, estimúlalo con algo dulce y túmbate de lado.',
      'Realiza masaje perineal diario a partir de la semana 34 para elastificar la zona y reducir desgarros.',
      'Conoce la Regla 5-1-1 de contracciones de parto para acudir al hospital en el momento oportuno.'
    ]
  }
];

// =======================================================
// 3. DATASET DE SIGNOS DE ALARMA OBSTÉTRICA (ACOG & OMS)
// =======================================================

export const OBSTETRIC_RED_FLAGS: PregnancyObstetricRedFlag[] = [
  {
    id: 'vaginal_bleeding_urgent',
    symptom: 'Sangrado Vaginal Rojo Rutilante',
    severity: 'urgente',
    medicalReason: 'Puede indicar desprendimiento prematuro de placenta normoinserta (DPPNI), placenta previa sangrante o amenaza de parto prematuro.',
    recommendedAction: 'Acude INMEDIATAMENTE a la urgencia ginecológica u obstétrica más cercana. No uses tampones ni mantengas relaciones sexuales.',
    sourceGuideline: 'ACOG Practice Bulletin No. 218 & Directrices de Emergencias Obstétricas OMS'
  },
  {
    id: 'amniotic_fluid_leak',
    symptom: 'Pérdida de Líquido Acuoso por Vagina (Rotura de Bolsa)',
    severity: 'urgente',
    medicalReason: 'Rotura prematura de membranas amnióticas (RPM). Si el líquido es claro, verde (meconio) o marrón, requiere evaluación médica.',
    recommendedAction: 'Colócate una compresa de algodón limpia, observa el color y olor del líquido y acude a urgencias. Si es verdoso u oscuro, acude de inmediato.',
    sourceGuideline: 'Protocolo SEGO de Rotura Prematura de Membranas & Guía OMS'
  },
  {
    id: 'preeclampsia_symptoms',
    symptom: 'Cefalea Severa con Fosfenos (Luces), Acúfenos (Pitidos) o Dolor en Barra en el Estómago',
    severity: 'urgente',
    medicalReason: 'Tríada de alarma de Preeclampsia Severa o Síndrome HELLP (hipertensión inducida por el embarazo con afectación multisistémica).',
    recommendedAction: 'Mídete la tensión arterial y acude de inmediato a Urgencias para control tensional, analítica hepática y valoración fetal.',
    sourceGuideline: 'ACOG Committee Opinion No. 702 (Gestational Hypertension and Preeclampsia)'
  },
  {
    id: 'decreased_fetal_movements',
    symptom: 'Disminución Marcada o Cese de Movimientos Fetales (a partir de la semana 28)',
    severity: 'urgente',
    medicalReason: 'Posible signo de compromiso o sufrimiento fetal agudo por insuficiencia placentaria o alteración del cordón.',
    recommendedAction: 'Bebe un vaso de agua fría o zumo natural, túmbate sobre el lado izquierdo en un lugar tranquilo durante 1-2 horas. Si no sientes al menos 10 movimientos, acude a urgencias.',
    sourceGuideline: 'Guía NICE y ACOG de Vigilancia del Bienestar Fetal'
  },
  {
    id: 'fever_persistent',
    symptom: 'Fiebre Materna Mayor a 38.0°C con Escalofríos',
    severity: 'precaucion',
    medicalReason: 'Riesgo de corioamnionitis (infección del líquido amniótico), pielonefritis o infección bacteriana materna.',
    recommendedAction: 'Toma paracetamol (1 g o según pauta médica), mantén abundante hidratación y consulta al obstetra o servicio de urgencias.',
    sourceGuideline: 'Directrices Clínicas de Fiebre en la Gestación OMS'
  },
  {
    id: 'pruritus_hands_feet',
    symptom: 'Picor Intenso en Palmas de Manos y Plantas de Pies sin Ronchas',
    severity: 'precaucion',
    medicalReason: 'Sospecha de Colestasis Intrahepática Gestacional (acumulación de ácidos biliares que pueden afectar al feto).',
    recommendedAction: 'Solicita una analítica de ácidos biliares en sangre y perfil hepático en tu centro de salud o maternidad.',
    sourceGuideline: 'Protocolo de Colestasis Intrahepática Gestacional SEGO / RCOG'
  }
];

// =======================================================
// 4. DATASET DE MOLESTIAS COMUNES Y ALIVIO SEGURO
// =======================================================

export const COMMON_PREGNANCY_SYMPTOMS: PregnancyCommonSymptom[] = [
  {
    id: 'nausea_morning',
    symptomName: 'Náuseas y Vómitos del Primer Trimestre',
    trimesters: [1],
    description: 'Sensación de malestar gástrico muy común provocada por el pico de hormona beta-hCG y estrógenos.',
    safeHomeRelief: [
      'Comer algo seco (galletas saladas, tostadas o frutos secos) antes de levantarte de la cama.',
      'Fraccionar las comidas en 5 a 6 tomas muy pequeñas al día.',
      'Infusiones de jengibre natural o caramelos de jengibre (según dosis aprobadas por la EFSA).',
      'Tomar los suplementos prenatales con hierro junto a la comida principal o por la noche para evitar irritación gástrica.'
    ],
    medicalRedFlags: [
      'Incapacidad de retener líquidos por más de 12 horas.',
      'Pérdida de peso superior al 5% del peso previo al embarazo.',
      'Orina muy oscura y escasa con mareos constantes (hiperémesis gravídica).'
    ]
  },
  {
    id: 'pyrosis_heartburn',
    symptomName: 'Acidez Gástrica y Reflujo (Pirosis)',
    trimesters: [2, 3],
    description: 'Sensación de ardor retroesternal debida a la relajación del esfínter esofágico por progesterona y la presión del útero.',
    safeHomeRelief: [
      'Evitar acostarse inmediatamente tras comer (esperar al menos 2 horas).',
      'Elevar el cabecero de la cama 15 a 20 cm colocando alzas bajo las patas.',
      'Evitar café, chocolate, cítricos en ayunas, fritos y bebidas gaseosas.',
      'Tomar leche pasteurizada fresca o yogur natural a pequeños sorbos cuando aparezca el ardor.',
      'Consultar con el médico sobre antiácidos seguros compatibles (almagato, sales de magnesio/calcio o inhibidores autorizados).'
    ],
    medicalRedFlags: [
      'Dolor agudo localizado debajo de las costillas derechas que no cede con antiácidos (posible preeclampsia).'
    ]
  },
  {
    id: 'back_pain_sciatica',
    symptomName: 'Lumbalgia y Dolor de Ciática',
    trimesters: [2, 3],
    description: 'Dolor en la zona baja de la espalda o glúteo por el cambio del centro de gravedad y la relajación ligamentosa por la hormona relaxina.',
    safeHomeRelief: [
      'Aplicar calor seco local (manta eléctrica a temperatura suave) durante 15 minutos en la zona lumbar.',
      'Ejercicios suaves de estiramiento del gato-camello en cuadrupedia y estiramiento del músculo piramidal.',
      'Usar cinturón o faja pélvica de sujeción prenatal si se camina durante periodos largos.',
      'Dormir con almohada ergonómica de cuerpo entero o cojín entre las rodillas.'
    ],
    medicalRedFlags: [
      'Pérdida de fuerza o sensibilidad en las piernas.',
      'Fiebre acompañante o dolor irradiado hacia la zona del riñón con molestias urinarias.'
    ]
  },
  {
    id: 'braxton_hicks',
    symptomName: 'Contracciones de Braxton Hicks vs Contracciones de Parto',
    trimesters: [2, 3],
    description: 'Contracciones fisiológicas indoloras de entrenamiento uterino que preparan el miometrio sin dilatar el cuello.',
    safeHomeRelief: [
      'Diferencia clave: Las de Braxton Hicks son irregulares, no aumentan de intensidad, no duelen (solo ponen la barriga dura) y CEDEN al cambiar de postura, descansar o beber un vaso grande de agua.',
      'Si aparecen tras actividad física o vejiga llena, vacía la vejiga, descansa de lado y bebe agua tibia.',
      'Darse una ducha con agua templada relajante.'
    ],
    medicalRedFlags: [
      'Contracciones que se vuelven rítmicas (cada 3-5 minutos), progresivamente más dolorosas y que no ceden tras 1 hora de reposo.',
      'Presencia de sangrado vaginal o pérdida de líquido amniótico.'
    ]
  },
  {
    id: 'leg_edema',
    symptomName: 'Hinchazón de Pies y Tobillos (Edema Fisiológico)',
    trimesters: [3],
    description: 'Retención de líquidos común por aumento de presión venosa en la pelvis hacia el final de la gestación.',
    safeHomeRelief: [
      'Poner las piernas elevadas por encima del nivel de las caderas al sentarse.',
      'Evitar estar de pie o sentada inmóvil por más de 1 hora seguida.',
      'Caminar descalza sobre arena suave o césped, y hacer círculos con los tobillos.',
      'Duchas con chorros de agua fría ascendentes desde los pies hasta las rodillas.'
    ],
    medicalRedFlags: [
      'Hinchazón asimétrica brusca en una sola pierna con dolor en la pantorrilla y calor local (sospecha de trombosis venosa profunda).',
      'Hinchazón repentina de cara, párpados y manos al despertar.'
    ]
  }
];

// =======================================================
// 5. DATASET DE CHECKLIST DE LA MALETA PARA EL HOSPITAL
// =======================================================

export const INITIAL_HOSPITAL_BAG_CHECKLIST: HospitalBagItem[] = [
  // Documentos
  {
    id: 'doc_id',
    category: 'documentos',
    label: 'DNI / NIE / Pasaporte y Tarjeta Sanitaria',
    description: 'Documentación legal y tarjeta del seguro médico o de la seguridad social.',
    checked: false,
    essential: true
  },
  {
    id: 'doc_record',
    category: 'documentos',
    label: 'Cartilla de Embarazo y Últimas Analíticas',
    description: 'Historial obstétrico, ecografías morfológicas, cultivo EGB y analítica del 3° trimestre.',
    checked: false,
    essential: true
  },
  {
    id: 'doc_birth_plan',
    category: 'documentos',
    label: 'Plan de Parto Firmado (2 copias)',
    description: 'Preferencias sobre analgesia, movimiento, corte tardío del cordón y contacto piel con piel.',
    checked: false,
    essential: false
  },

  // Mamá
  {
    id: 'mom_gowns',
    category: 'mama',
    label: '2 o 3 Camisones con Abertura Frontal para Lactancia',
    description: 'De algodón 100% transpirable y cómodos para el contacto piel con piel.',
    checked: false,
    essential: true
  },
  {
    id: 'mom_underwear',
    category: 'mama',
    label: 'Braguitas Desechables o de Malla de Algodón (5-6 unidades)',
    description: 'De talle alto que no rocen la zona púbica ni una posible incisión de cesárea.',
    checked: false,
    essential: true
  },
  {
    id: 'mom_pads',
    category: 'mama',
    label: 'Compresas Tocoginecológicas de Algodón 100% Puro',
    description: 'Sin plástico ni perfumes para absorber los loquios postparto con suavidad.',
    checked: false,
    essential: true
  },
  {
    id: 'mom_slippers',
    category: 'mama',
    label: 'Zapatillas de Estar por Casa y Chanclas para la Ducha',
    description: 'Calzado antideslizante y cómodo para la habitación y el baño.',
    checked: false,
    essential: true
  },
  {
    id: 'mom_toiletries',
    category: 'mama',
    label: 'Neceser de Aseo Personal (Cepillo, Jabón Syndet, Bálsamo Labial)',
    description: 'Los labios suelen resecarse mucho durante la respiración del parto.',
    checked: false,
    essential: true
  },
  {
    id: 'mom_going_home',
    category: 'mama',
    label: 'Ropa Cómoda y Holgada para la Salida del Hospital',
    description: 'Prendas suaves tipo chándal o vestido premamá holgado.',
    checked: false,
    essential: true
  },

  // Bebé
  {
    id: 'baby_first_outfit',
    category: 'bebe',
    label: 'Primera Puesta (Body de Algodón + Pijamita Abierto Delante)',
    description: 'Talla 0 o 1 mes (50-56 cm), lavado previamente con detergente hipoalergénico.',
    checked: false,
    essential: true
  },
  {
    id: 'baby_bodysuits',
    category: 'bebe',
    label: '4 o 5 Bodies Cruzados de Algodón 100% (Sin pasar por la cabeza)',
    description: 'Los bodies cruzados delanteros facilitan muchísimo el cambio sin incomodar al bebé.',
    checked: false,
    essential: true
  },
  {
    id: 'baby_hats_socks',
    category: 'bebe',
    label: '2 Gorritos de Algodón y 3 Pares de Calcetines / Patucos',
    description: 'Los recién nacidos pierden calor rápidamente por la cabecita las primeras horas.',
    checked: false,
    essential: true
  },
  {
    id: 'baby_muslins',
    category: 'bebe',
    label: '3 o 4 Gasas / Muselinas de Algodón Suave',
    description: 'Para proteger el regazo de posibles regurgitaciones de calostro o leche.',
    checked: false,
    essential: true
  },
  {
    id: 'baby_car_seat',
    category: 'bebe',
    label: 'Silla de Coche Grupo 0+ / Huevito Homologado (I-Size)',
    description: 'Obligatoria e imprescindible instalada correctamente para el viaje de regreso a casa.',
    checked: false,
    essential: true
  },

  // Acompañante
  {
    id: 'partner_clothes',
    category: 'acompanante',
    label: 'Ropa Cómoda de Cambio y Neceser de Aseo',
    description: 'Prendas frescas para acompañar en la sala de dilatación y parto.',
    checked: false,
    essential: false
  },
  {
    id: 'partner_chargers',
    category: 'acompanante',
    label: 'Cargadores de Móvil con Cable Largo / Batería Portátil',
    description: 'Para avisar a la familia y guardar las primeras fotos del nacimiento.',
    checked: false,
    essential: true
  },
  {
    id: 'partner_snacks',
    category: 'acompanante',
    label: 'Snacks Saludables y Monedas / Agua para la Espera',
    description: 'Frutos secos, barritas de avena y agua para mantener la energía durante el parto.',
    checked: false,
    essential: false
  }
];
