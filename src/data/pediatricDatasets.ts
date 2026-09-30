import {
  CryAcousticProfile,
  DermaCondition,
  DevelopmentalMilestone,
  MilestoneSurveyQuestion,
  CognitiveActivity
} from '../types';

// ==========================================
// 1. INFANT CRY ACOUSTICS CLASSIFICATION CORPUS (Comprehensive Spectrum)
// ==========================================
export const CRY_DATASET_PROFILES: CryAcousticProfile[] = [
  {
    id: 'hunger',
    cause: 'Hambre / Reflejo de Succión (Hunger Cry)',
    label: 'Llanto por Hambre',
    category: 'fisiologico',
    fundamentalFreq: '420 - 460 Hz',
    frequencyVal: 440,
    duration: '1.2 - 2.0 s por ciclo',
    acousticPattern: 'Cadencia rítmica en onda sinusoidal con pausas inspiratorias regulares y tono medio ascendente.',
    confidence: 96.8,
    indicators: [
      'Frecuencia fundamental F0 estable (~440 Hz)',
      'Patrón melódico repetitivo: llanto -> silencio inspiratorio -> llanto',
      'Reflejo de búsqueda activo, apertura de boca o manos a los labios',
      'Intensidad moderada pero persistente (65-72 dB)'
    ],
    pediatricGuidance: [
      'Alimentar a libre demanda sin esperar a que el llanto alcance un tono agudo o desregulado.',
      'Ofrecer lactancia materna o biberón en posición semi-incorporada.',
      'Verificar que la succión sea rítmica y profunda con pausas para tragar.',
      'Si recién terminó la toma, revisar si necesita eructar antes de ofrecer más.'
    ],
    audioWaveform: [0.2, 0.4, 0.7, 0.9, 0.6, 0.3, 0.1, 0.05, 0.3, 0.5, 0.8, 0.95, 0.7, 0.3, 0.1],
    reassuranceTip: 'Froggi nos recuerda: "El hambre es la primera causa de llanto en lactantes. Mantén la calma mientras preparas su alimentación."'
  },
  {
    id: 'colic_pain',
    cause: 'Cólico del Lactante / Dolor Abdominal Agudo',
    label: 'Cólico / Gases / Dolor Abdominal',
    category: 'dolor',
    fundamentalFreq: '580 - 780 Hz',
    frequencyVal: 680,
    duration: '2.5 - 4.5 s sostenido',
    acousticPattern: 'Frecuencia aguda elevada y abrupta, fase espiratoria prolongada con gritos disonantes y tensión laríngea.',
    confidence: 95.4,
    indicators: [
      'Pico de F0 elevado (>600 Hz) con alta variabilidad armónica',
      'Comienzo paroxístico (súbito) habitualmente al final de la tarde o noche',
      'Extremidades inferiores flexionadas sobre el abdomen y abdomen tenso',
      'Intensidad alta (>80 dB) con enrojecimiento facial'
    ],
    pediatricGuidance: [
      'Aplicar la técnica de las 5S: Envolver suavemente (Swaddle), posición de lado o boca abajo en brazos, chistido rítmico (Shush), balanceo suave y succión.',
      'Realizar masajes abdominales suaves en sentido de las agujas del reloj (técnica I Love You).',
      'Movimientos de pedaleo suave con las piernas para favorecer la expulsión de gases.',
      'Consultar al pediatra si hay fiebre acompañante, vómitos verdes o heces con sangre.'
    ],
    audioWaveform: [0.9, 0.95, 0.98, 0.92, 0.88, 0.85, 0.9, 0.95, 0.8, 0.7, 0.85, 0.95, 0.92, 0.88, 0.6],
    reassuranceTip: 'Pandita te acompaña: "El llanto por cólicos es muy angustiante pero transitorio. Túrnense entre adultos para descansar."'
  },
  {
    id: 'sleepiness',
    cause: 'Somnolencia / Fatiga / Ventana de Sueño Excedida',
    label: 'Cansancio y Sueño Acumulado',
    category: 'fisiologico',
    fundamentalFreq: '380 - 415 Hz',
    frequencyVal: 395,
    duration: '0.8 - 1.5 s intermitente',
    acousticPattern: 'Tono nasal suave y descendente, bostezos intercalados, decremento gradual de amplitud sonora.',
    confidence: 93.2,
    indicators: [
      'F0 más grave con fluctuación lenta y quejidos espaciados',
      'Frotado constante de ojos, cejas rojas o tirones de orejas',
      'Mirada perdida o dificultad para fijar la vista',
      'El llanto disminuye momentáneamente al atenuar luces y sonidos'
    ],
    pediatricGuidance: [
      'Llevar al bebé a una habitación en penumbra con temperatura fresca (19-22°C).',
      'Iniciar rutina de calma: arrullo suave, caricias continuas o ruido blanco relajante.',
      'Colocar en la cuna boca arriba sobre colchón firme cuando esté somnoliento pero aún despierto.',
      'Vigilar las ventanas de sueño (45-90 min en recién nacidos, 2-3h en lactantes).'
    ],
    audioWaveform: [0.3, 0.5, 0.4, 0.2, 0.1, 0.05, 0.2, 0.4, 0.3, 0.1, 0.05, 0.1, 0.2, 0.1, 0.0],
    reassuranceTip: 'Caracolito susurra: "Despacito cerramos los ojitos. Con un ambiente tranquilo, el sueño reparador llegará pronto."'
  },
  {
    id: 'discomfort',
    cause: 'Incomodidad Física / Pañal Húmedo / Estrés Térmico',
    label: 'Incomodidad / Pañal / Frío o Calor',
    category: 'incomodidad',
    fundamentalFreq: '440 - 510 Hz',
    frequencyVal: 475,
    duration: '1.0 - 2.0 s modulado',
    acousticPattern: 'Modulación quejumbrosa discontinua, pausas de exploración sensorial y movimientos de reajuste corporal.',
    confidence: 91.0,
    indicators: [
      'Variabilidad tonal moderada sin llegar a grito estridente',
      'Inquietud motriz constante, estiramiento de cuerpo o giros de cabeza',
      'Sudoración en la nuca (calor) o manos/pies azulados y piel fría (frío)',
      'Humedad o suciedad en el pañal o pliegues irritados'
    ],
    pediatricGuidance: [
      'Comprobar la temperatura corporal tocando la nuca o el pechito.',
      'Revisar y cambiar el pañal, aplicando pomada de barrera con óxido de zinc.',
      'Verificar que la ropa no tenga etiquetas ásperas ni costuras apretadas (revisar dedos por síndrome de torniquete por pelo).',
      'Vestir con prendas de algodón holgadas y transpirables.'
    ],
    audioWaveform: [0.4, 0.6, 0.5, 0.3, 0.4, 0.6, 0.7, 0.5, 0.3, 0.4, 0.5, 0.3, 0.2, 0.1, 0.0],
    reassuranceTip: 'Monito dice: "Un cambio de pañal fresquito y ropa cómoda resuelven la mayoría de estas molestias."'
  },
  {
    id: 'attachment',
    cause: 'Necesidad de Contacto Afectivo / Apego Seguro / Angustia de Separación',
    label: 'Necesidad de Brazos y Contacto',
    category: 'emocional',
    fundamentalFreq: '410 - 450 Hz',
    frequencyVal: 430,
    duration: '1.0 - 1.8 s modulado suave',
    acousticPattern: 'Tono modulado con inflexiones afectivas que cesa casi inmediatamente al ser tomado en brazos o escuchar la voz familiar.',
    confidence: 94.5,
    indicators: [
      'El llanto comienza al ser depositado en la cuna o al alejarse el cuidador',
      'Cesa de inmediato con el contacto piel con piel o al hablarle cara a cara',
      'Extensión de brazos y búsqueda visual constante',
      'Común en etapas de angustia de separación (6 a 9 meses)'
    ],
    pediatricGuidance: [
      'Brindar contención afectiva sin temor a "malacostumbrar a los brazos": los brazos brindan corregulación neurológica.',
      'Practicar porteo ergonómico o contacto piel con piel.',
      'Hablarle con voz suave y melodiosa manteniendo contacto visual amoroso.',
      'Validar su necesidad de seguridad para construir un apego seguro duradero.'
    ],
    audioWaveform: [0.3, 0.4, 0.6, 0.5, 0.3, 0.2, 0.4, 0.5, 0.4, 0.2, 0.1, 0.05, 0.0, 0.0, 0.0],
    reassuranceTip: 'Pandita abraza: "Los abrazos son medicina para el corazón de tu bebé. Su necesidad de cercanía es natural y hermosa."'
  },
  {
    id: 'reflux',
    cause: 'Reflujo Gastroesofágico / Acidez / Molestia Digestiva Post-Toma',
    label: 'Reflujo / Acidez Post-Ingesta',
    category: 'dolor',
    fundamentalFreq: '520 - 640 Hz',
    frequencyVal: 570,
    duration: '1.5 - 3.0 s con pausas de quejido',
    acousticPattern: 'Llanto con sonido de garganta rasposa, degluciones frecuentes en seco y arqueamiento hacia atrás de la espalda.',
    confidence: 92.0,
    indicators: [
      'Llanto que inicia entre 15 y 45 minutos después de comer',
      'Arqueamiento de espalda y cuello (Signo de Sandifer)',
      'Regurgitaciones ácidas frecuentes o hipo persistente con llanto',
      'Rechazo temporal del pecho o biberón a mitad de la toma por dolor al tragar'
    ],
    pediatricGuidance: [
      'Mantener al bebé erguido en brazos durante 20 a 30 minutos tras cada alimentación.',
      'Fraccionar las tomas: ofrecer menor volumen con mayor frecuencia.',
      'Asegurar eructos intermedios durante la toma.',
      'Evitar prendas que aprieten el abdomen y consultar al pediatra si no gana peso o tiene vómitos en proyectil.'
    ],
    audioWaveform: [0.5, 0.7, 0.8, 0.75, 0.6, 0.5, 0.7, 0.8, 0.85, 0.7, 0.5, 0.4, 0.3, 0.2, 0.1],
    reassuranceTip: 'Froggi aconseja: "Mantener la postura vertical después de comer ayuda a la digestión por pura gravedad."'
  },
  {
    id: 'overstimulation',
    cause: 'Sobreestimulación Sensorial / Ambiente Ruidoso o Caótico',
    label: 'Sobrecarga Sensorial',
    category: 'emocional',
    fundamentalFreq: '480 - 560 Hz',
    frequencyVal: 510,
    duration: '1.5 - 2.5 s irregular',
    acousticPattern: 'Llanto desorganizado con sobresaltos motores, desvío de la mirada y dificultad para calmarse incluso en brazos.',
    confidence: 90.5,
    indicators: [
      'Ocurre tras visitas familiares numerosas, salidas a centros comerciales o pantallas activas',
      'Gira la cabeza hacia otro lado cuando le hablan (evitación visual)',
      'Movimientos bruscos de brazos y piernas (reflejo de Moro exagerado)',
      'Cierre de puños con tensión'
    ],
    pediatricGuidance: [
      'Llevar al bebé a una habitación silenciosa y con luz tenue.',
      'Reducir el número de personas manipulando al bebé.',
      'Envolver suavemente en una mantita de algodón y mecer con movimientos lentos.',
      'Evitar ruidos fuertes, música estridente y pantallas electrónicas.'
    ],
    audioWaveform: [0.6, 0.7, 0.85, 0.7, 0.8, 0.65, 0.5, 0.7, 0.8, 0.6, 0.4, 0.3, 0.2, 0.1, 0.0],
    reassuranceTip: 'Caracolito recomienda: "Menos es más. Unos minutos de silencio y calma restauran la paz de tu peque."'
  },
  {
    id: 'sudden_pain',
    cause: 'Dolor Súbito / Pinchazo / Traumatismo Leve',
    label: 'Dolor Súbito / Alarma Aguda',
    category: 'dolor',
    fundamentalFreq: '700 - 950 Hz',
    frequencyVal: 820,
    duration: '3.0 - 5.0 s inicial prolongado',
    acousticPattern: 'Inicio explosivo de muy alta intensidad sin previo aviso, fase de apnea inspiratoria inicial seguida de grito continuo.',
    confidence: 97.5,
    indicators: [
      'Aparición inmediata e instantánea',
      'Apnea espiratoria prolongada (el bebé parece quedarse sin aire unos segundos)',
      'Tono muy agudo y estridente (>85 dB)',
      'Tensión muscular generalizada'
    ],
    pediatricGuidance: [
      'Inspeccionar minuciosamente el cuerpo del bebé: dedos de manos y pies por hilos o pelos, picaduras, caídas o golpes.',
      'Tomar en brazos de inmediato transmitiendo calma y seguridad con contacto firme.',
      'Verificar que respire con normalidad tras la apnea inicial.',
      'Si el llanto no cede tras 15-20 minutos o hay inflamación/deformidad, acudir a guardia pediátrica.'
    ],
    audioWaveform: [0.98, 0.99, 0.95, 0.9, 0.85, 0.8, 0.75, 0.85, 0.9, 0.95, 0.8, 0.7, 0.5, 0.3, 0.1],
    reassuranceTip: 'Froggi destaca: "Revisa con calma cada rinconcito de su piel para descartar que algo lo esté pellizcando."'
  }
];

// ==========================================
// 2. AAP PEDIATRIC DERMATOLOGY CLINICAL CONDITIONS (Expanded Spectrum - 16 Conditions)
// ==========================================
export const DERMA_DATASET_CONDITIONS: DermaCondition[] = [
  {
    id: 'diaper_dermatitis',
    name: 'Dermatitis del Pañal Irritativa',
    medicalName: 'Dermatitis irritativa del área del pañal',
    typicalAge: '1 a 18 meses',
    severity: 'leve',
    category: 'panal',
    bodyLocation: 'Glúteos, muslos y monte de Venus',
    confidence: 96.4,
    visualFeatures: [
      'Eritema brillante y difuso en superficies convexas (glúteos, muslos y pubis)',
      'Respeto característico de los pliegues inguinales profundos (no afectados)',
      'Pápulas rosadas dispersas sin exudado purulento'
    ],
    aapGuideline: 'Regla A.B.C.D.E: Air (Aire libre), Barrier (Barrera de óxido de zinc), Cleansing (Limpieza con agua), Diapering (Cambios frecuentes), Education.',
    homeCare: [
      'Dejar la piel al aire libre el mayor tiempo posible entre cambios de pañal.',
      'Limpiar con agua tibia y discos de algodón; evitar toallitas con alcohol o perfumes.',
      'Aplicar capa generosa de pomada de barrera con Óxido de Zinc en cada cambio.',
      'Cambiar el pañal cada 2-3 horas o de inmediato tras deposiciones.'
    ],
    whenToSeeDoctor: [
      'Aparición de ampollas, pus o heridas abiertas sangrantes.',
      'Empeoramiento tras 3-4 días de cuidados intensivos en casa.',
      'Fiebre acompañante o dolor intenso al orinar.'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'candida_diaper',
    name: 'Dermatitis del Pañal por Cándida (Hongo)',
    medicalName: 'Candidiasis cutánea del área del pañal',
    typicalAge: '1 a 24 meses',
    severity: 'moderada',
    category: 'panal',
    bodyLocation: 'Pliegues inguinales y zona perianal',
    confidence: 94.8,
    visualFeatures: [
      'Eritema rojo encendido intenso que SÍ compromete los pliegues inguinales',
      'Presencia característica de "lesiones satélite" (pápulas y pústulas periféricas alrededor de la placa)',
      'Bordes netos con descamación fina periférica'
    ],
    aapGuideline: 'Tratamiento antimicótico tópico bajo prescripción médica y medidas higiénicas de secado estricto.',
    homeCare: [
      'Mantener el área escrupulosamente seca secando a toquecitos sin frotar.',
      'Aplicar crema antimicótica recetada por el pediatra (ej. nistatina o clotrimazol) 2-3 veces al día.',
      'No usar cremas con corticoides potentes que puedan empeorar la infección fúngica.',
      'Suspender el uso de toallitas húmedas industriales durante el brote activo.'
    ],
    whenToSeeDoctor: [
      'Extensión rápida hacia el abdomen o piernas.',
      'Sospecha de muguet oral simultáneo (placas blancas en la boca del bebé).',
      'Falta de mejoría tras 5 días de tratamiento antimicótico.'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'atopic_dermatitis',
    name: 'Dermatitis Atópica (Eccema Infantil)',
    medicalName: 'Dermatitis atópica / Eccema constitucional',
    typicalAge: '3 meses a 12 años',
    severity: 'moderada',
    category: 'alergica',
    bodyLocation: 'Mejillas, cuero cabelludo y flexuras (codos y rodillas)',
    confidence: 95.1,
    visualFeatures: [
      'Placas eritematosas, secas y descamativas con intenso prurito (picazón)',
      'En lactantes: predominio en mejillas, frente, cuero cabelludo y zonas extensoras',
      'En preescolares y escolares: localización típica en flexuras (huecos poplíteos y pliegues de codos)'
    ],
    aapGuideline: 'Restauración intensiva de la barrera cutánea con emolientes y baños terapéuticos cortos con jabón syndet.',
    homeCare: [
      'Baños cortos (5-10 min) con agua tibia y jabón syndet hipoalergénico.',
      'Aplicar crema emoliente densa rica en ceramidas dentro de los 3 minutos post-baño sobre piel húmeda (Técnica Soak and Seal).',
      'Vestir únicamente prendas de algodón 100%; evitar lana, poliéster y suavizantes de ropa.',
      'Mantener uñas cortadas al ras y limpias para evitar sobreinfecciones por rascado.'
    ],
    whenToSeeDoctor: [
      'Aparición de costras amarillentas color miel (sobreinfección por estafilococo que requiere antibiótico).',
      'El picor impide el descanso nocturno continuo del niño.',
      'Brote extenso que no responde a la hidratación habitual.'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'miliaria_rubra',
    name: 'Miliaria Rubra (Sudamina / Granitos por Calor)',
    medicalName: 'Miliaria rubra por oclusión ductal ecrina',
    typicalAge: '0 meses a 6 años',
    severity: 'leve',
    category: 'irritativa',
    bodyLocation: 'Cuello, nuca, pecho, espalda y pliegues',
    confidence: 97.2,
    visualFeatures: [
      'Múltiples micro-pápulas eritematosas no foliculares de 1 a 2 mm',
      'Distribución en cuello, nuca, pecho, espalda y pliegues de la piel',
      'Piel caliente al tacto pero sin fiebre sistémica ni decaimiento'
    ],
    aapGuideline: 'Termorregulación ambiental y alivio refrescante sin oclusión dérmica.',
    homeCare: [
      'Refrescar la habitación manteniendo temperatura entre 20 y 22°C.',
      'Retirar exceso de abrigo; vestir con ropa ligera y transpirable de algodón.',
      'Baño de agua templada para aliviar la piel sin frotar con esponjas.',
      'NO aplicar pomadas grasas, talcos ni aceites que obstruyan más las glándulas sudoríparas.'
    ],
    whenToSeeDoctor: [
      'Aparición de pústulas purulentas o fiebre.',
      'Persistencia por más de 7 días a pesar de refrescar el ambiente.',
      'Irritabilidad constante que no cede.'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cradle_cap',
    name: 'Costra Láctea (Dermatitis Seborreica)',
    medicalName: 'Dermatitis seborreica infantil del cuero cabelludo',
    typicalAge: '2 semanas a 12 meses',
    severity: 'leve',
    category: 'neonatal',
    bodyLocation: 'Cuero cabelludo, cejas y detrás de las orejas',
    confidence: 97.8,
    visualFeatures: [
      'Escamas gruesas, grasientas, amarillentas o blanquecinas fuertemente adheridas',
      'Asienta en cuero cabelludo, cejas y detrás de las orejas',
      'No produce picor ni molestia al bebé'
    ],
    aapGuideline: 'Condición benigna y autolimitada influenciada por hormonas maternas transitorias.',
    homeCare: [
      'Aplicar aceite vegetal suave (almendras dulces o coco) 15-20 minutos antes del baño para ablandar las escamas.',
      'Lavar con champú pediátrico suave y masajear con cepillo de cerdas ultrasuaves con movimientos circulares.',
      'NUNCA raspar con las uñas ni arrancar las costras en seco.',
      'Mantener la calma: es completamente benigno y no deja cicatrices.'
    ],
    whenToSeeDoctor: [
      'Extensión rápida con enrojecimiento intenso hacia la cara, cuello o axilas.',
      'Presencia de exudado, sangrado o mal olor.',
      'Signos de inflamación marcada en la piel subyacente.'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'urticaria',
    name: 'Urticaria Aguda Infantil',
    medicalName: 'Urticaria aguda por hipersensibilidad',
    typicalAge: '6 meses a 12 años',
    severity: 'moderada',
    category: 'alergica',
    bodyLocation: 'Generalizada en tronco, extremidades o cara',
    confidence: 93.8,
    visualFeatures: [
      'Habones o ronchas eritematosas con centro pálido y bordes sobreelvados',
      'Lesiones evanescentes (cambian de lugar y desaparecen en <24 horas en un sitio mientras brotan en otro)',
      'Intenso prurito (picazón) que genera inquietud'
    ],
    aapGuideline: 'Evaluación de desencadenantes (infección viral previa, alimento o picadura) y antihistamínicos según indicación médica.',
    homeCare: [
      'Aplicar compresas frescas y húmedas sobre las zonas con más picazón.',
      'Evitar baños calientes, calor ambiental o fricción excesiva.',
      'Vestir ropa muy suelta de algodón suave.',
      'Administrar antihistamínico oral únicamente bajo prescripción del pediatra.'
    ],
    whenToSeeDoctor: [
      '🚨 URGENCIA: Hinchazón de labios, lengua, párpados (angioedema) o dificultad para respirar / tragar.',
      'Aparición de vómitos o decaimiento severo simultáneo.',
      'Duración superior a 48 horas sin mejoría.'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'viral_rash',
    name: 'Exantema Viral Benigno (Roséola / Eritema)',
    medicalName: 'Exantema vírico infantil inespecífico / Roséola infantum',
    typicalAge: '6 meses a 6 años',
    severity: 'leve',
    category: 'infecciosa',
    bodyLocation: 'Tronco, abdomen y cuello',
    confidence: 92.5,
    visualFeatures: [
      'Manchitas rosadas tenues de 2-3 mm (máculas y pápulas) distribuidas en tronco y cuello',
      'Blanquean completamente al presionar con un dedo o vaso de vidrio',
      'Típicamente aparece justo cuando la fiebre de 3 días desaparece de golpe'
    ],
    aapGuideline: 'Proceso viral autolimitado; vigilancia del estado general y buena hidratación.',
    homeCare: [
      'Mantener reposo e hidratación abundante con agua o suero oral.',
      'Ofrecer comida blanda y ligera sin forzar.',
      'Baños tibios de confort.',
      'La erupción suele desaparecer espontáneamente en 2 a 4 días sin dejar marcas.'
    ],
    whenToSeeDoctor: [
      '🚨 Manchas violáceas o rojas oscuras que NO blanquean al presionar (petequias/púrpura: acudir a urgencias de inmediato).',
      'Reaparición de fiebre alta o somnolencia marcada.',
      'Dificultad respiratoria o quejido continuo.'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'impetigo',
    name: 'Impétigo Leve Contagioso',
    medicalName: 'Impétigo no ampolloso bacteriano',
    typicalAge: '1 a 10 años',
    severity: 'moderada',
    category: 'infecciosa',
    bodyLocation: 'Alrededor de la nariz, boca y extremidades',
    confidence: 94.0,
    visualFeatures: [
      'Costras características color amarillento-miel (costras melicéricas)',
      'Ubicación típica alrededor de la nariz, boca y extremidades',
      'Base eritematosa húmeda tras el desprendimiento de costras'
    ],
    aapGuideline: 'Higiene antiséptica estricta y pomada antibiótica tópica prescrita por el pediatra.',
    homeCare: [
      'Lavar suavemente con agua y jabón antiséptico para retirar costras sueltas.',
      'Aplicar la pomada antibiótica tópica recetada por el médico (ej. mupirocina).',
      'Usar toallas individuales y lavar la ropa del niño con agua caliente para evitar contagios.',
      'Cortar las uñas al ras para impedir que disemine la bacteria al rascarse.'
    ],
    whenToSeeDoctor: [
      'Aparición de ampollas grandes llenas de líquido (impétigo ampolloso).',
      'Extensión rápida a múltiples partes del cuerpo o fiebre.',
      'Falta de mejoría tras 48 horas de antibiótico tópico.'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hand_foot_mouth',
    name: 'Enfermedad Boca-Mano-Pie (Coxsackievirus)',
    medicalName: 'Exantema vírico vesicular por Coxsackie A16 / Enterovirus',
    typicalAge: '6 meses a 5 años',
    severity: 'moderada',
    category: 'infecciosa',
    bodyLocation: 'Palmas de las manos, plantas de los pies, glúteos y boca',
    confidence: 96.1,
    visualFeatures: [
      'Vesículas ovaladas pequeñas (2-5 mm) con halo eritematoso en palmas y plantas',
      'Aftas dolorosas en mucosa oral, lengua y paladar que dificultan comer',
      'Pápulas rojas no dolorosas en glúteos y muslos'
    ],
    aapGuideline: 'Cuadro viral muy contagioso autolimitado (7-10 días). El objetivo principal es mantener la hidratación y alivio analgésico.',
    homeCare: [
      'Ofrecer alimentos frescos, fríos y blandos (yogur, purés fríos, gelatinas, helados de leche).',
      'Evitar alimentos ácidos, salados, cítricos o calientes que aumenten el ardor bucal.',
      'Hidratación continua a pequeños sorbos frecuentes.',
      'Administrar paracetamol o ibuprofeno según prescripción médica para aliviar el dolor al tragar.',
      'Lavado de manos frecuente tras cada cambio de pañal para evitar contagio.'
    ],
    whenToSeeDoctor: [
      'Signos de deshidratación: no moja pañales en 6-8 horas, llanto sin lágrimas o boca muy seca.',
      'Rechazo total a beber líquidos por más de 12 horas.',
      'Fiebre que dura más de 3 días consecutivos o decaimiento severo.'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'molluscum_contagiosum',
    name: 'Molusco Contagioso',
    medicalName: 'Molusco contagioso por Poxvirus',
    typicalAge: '1 a 10 años',
    severity: 'leve',
    category: 'infecciosa',
    bodyLocation: 'Tronco, axilas, pliegues y extremidades',
    confidence: 95.7,
    visualFeatures: [
      'Pápulas firmes, cupuliformes y perladas de 2 a 5 mm',
      'Depresión central característica (umbilicación central)',
      'Asintomáticas o con picor leve alrededor (eccema del molusco)'
    ],
    aapGuideline: 'Infección viral benigna autolimitada. Se resuelve espontáneamente por inmunidad natural en 6 a 18 meses.',
    homeCare: [
      'No pellizcar, rascar ni reventar las lesiones para no diseminar el virus a otras partes del cuerpo.',
      'Hidratar la piel sana circundante con crema emoliente para evitar el rascado.',
      'Usar toalla de baño personal e intransferible.',
      'Cubrir las lesiones con ropa o vendaje transpirable durante el baño en piscinas públicas.'
    ],
    whenToSeeDoctor: [
      'Enrojecimiento intenso, calor y dolor alrededor de una lesión (posible sobreinfección bacteriana).',
      'Lesiones ubicadas cerca de los ojos o en los párpados.',
      'Extensión muy numerosa que afecte la calidad de vida.'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pityriasis_alba',
    name: 'Pitiriasis Alba (Manchitas Claras en Mejillas)',
    medicalName: 'Pitiriasis alba / Eccemátide acromiante',
    typicalAge: '2 a 12 años',
    severity: 'leve',
    category: 'alergica',
    bodyLocation: 'Mejillas, frente, brazos y hombros',
    confidence: 96.8,
    visualFeatures: [
      'Manchas redondeadas u ovaladas más claras que la piel normal (hipopigmentadas)',
      'Descamación fina pulverulenta superficial al raspar suavemente',
      'Se hacen más evidentes en verano tras la exposición solar'
    ],
    aapGuideline: 'Manifestación menor de atopia y sequedad dérmica. No es un hongo ni falta de vitaminas.',
    homeCare: [
      'Aplicar crema hidratante nutritiva 2 a 3 veces al día en la cara.',
      'Usar protector solar mineral pediátrico FPS 50+ diario para evitar que la piel circundante se broncee y contraste.',
      'Usar jabones sin sulfatos ni perfumes.',
      'Tener paciencia: la pigmentación normal tarda semanas o meses en repigmentarse por completo.'
    ],
    whenToSeeDoctor: [
      'Manchas totalmente blancas como tiza (descartar vitíligo).',
      'Bordes elevados muy rojizos con picor intenso.',
      'Extensión rápida por todo el cuerpo.'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'erythema_toxic_neonatorum',
    name: 'Eritema Tóxico Neonatal',
    medicalName: 'Erythema toxicum neonatorum fisiológico',
    typicalAge: 'Primeras 48h a 2 semanas de vida',
    severity: 'leve',
    category: 'neonatal',
    bodyLocation: 'Tronco, cara, muslos y brazos (respeta palmas y plantas)',
    confidence: 98.2,
    visualFeatures: [
      'Máculas rojas con pápula o pequeña pústula central blanquecina o amarillenta',
      'Aspecto en "picadura de pulga"',
      'El recién nacido está completamente sano, come bien y no tiene fiebre'
    ],
    aapGuideline: 'Fenómeno inflamatorio cutáneo benigno y fisiológico en el 50% de recién nacidos a término. Se resuelve solo en 7-10 días.',
    homeCare: [
      'No requiere ningún tratamiento ni pomada médica.',
      'Mantener la piel limpia con agua tibia durante el baño.',
      'No frotar ni intentar reventar los granitos centrales.',
      'Tranquilidad absoluta: desaparece espontáneamente sin dejar marcas.'
    ],
    whenToSeeDoctor: [
      'Presencia de fiebre (≥ 38.0°C) o rechazo del alimento.',
      'Bebé decaído, quejumbroso o muy irritable.',
      'Ampollas grandes llenas de pus o ampollas en palmas y plantas.'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'insect_bites_strophulus',
    name: 'Prúrigo por Picaduras (Estrófulo Infantil)',
    medicalName: 'Prúrigo estrófulo / Hipersensibilidad a picaduras',
    typicalAge: '1 a 7 años',
    severity: 'leve',
    category: 'alergica',
    bodyLocation: 'Zonas expuestas: piernas, brazos, tobillos y cuello',
    confidence: 94.6,
    visualFeatures: [
      'Pápulas eritematosas duras con una microvesícula o punto central (punto de inoculación)',
      'Lesiones agrupadas en racimo o líneas ("desayuno, almuerzo y cena")',
      'Picazón intensa y persistente durante varios días'
    ],
    aapGuideline: 'Reacción exagerada del sistema inmune infantil a saliva de mosquitos, pulgas o ácaros.',
    homeCare: [
      'Aplicar loción de calamina o gel frío para calmar el picor.',
      'Lavar la zona con agua fresca y jabón neutro.',
      'Cortar uñas para evitar que el rascado cause infecciones bacterianas.',
      'Usar repelentes infantiles seguros (DEET 10-30% o Icaridina según la edad) y mosquiteras en la cuna.'
    ],
    whenToSeeDoctor: [
      'Hinchazón caliente muy extensa alrededor de la picadura (celulitis).',
      'Costras de miel con secreción amarillenta.',
      'Hinchazón facial o dificultad respiratoria (alergia sistémica).'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'keratosis_pilaris',
    name: 'Queratosis Pilar ("Piel de Gallina")',
    medicalName: 'Queratosis pilaris por taponamiento folicular',
    typicalAge: '1 a 12 años',
    severity: 'leve',
    category: 'irritativa',
    bodyLocation: 'Parte posterior de los brazos, muslos y mejillas',
    confidence: 96.5,
    visualFeatures: [
      'Micro-pápulas foliculares rugosas al tacto (textura de papel de lija)',
      'Color rojizo tenue o del mismo tono de la piel',
      'Completamente asintomática, empeora en invierno con el aire seco'
    ],
    aapGuideline: 'Variante genética benigna muy común producida por acumulación de queratina en la salida del folículo piloso.',
    homeCare: [
      'Hidratación diaria con lociones emolientes corporales ricas en urea (5-10%) o ácido láctico suave.',
      'Evitar frotar con esponjas duras o exfoliantes agresivos.',
      'Baños cortos con agua tibia (el agua muy caliente reseca la piel).',
      'No intentar exprimir los pequeños tapones foliculares.'
    ],
    whenToSeeDoctor: [
      'Granitos muy enrojecidos, dolorosos o con pus en el centro (foliculitis).',
      'Picor severo que interfiere con el sueño.',
      'Duda diagnóstica con otros eccemas.'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'perioral_dermatitis_saliva',
    name: 'Dermatitis por Salivación / Dentición',
    medicalName: 'Dermatitis de contacto irritativa perioral por babeo',
    typicalAge: '3 a 18 meses',
    severity: 'leve',
    category: 'irritativa',
    bodyLocation: 'Alrededor de la boca, barbilla, comisuras y cuello',
    confidence: 97.4,
    visualFeatures: [
      'Enrojecimiento y pequeñas pápulas rosadas localizadas estrictamente alrededor de los labios y barbilla',
      'Piel áspera y agrietada en la zona de contacto continuo con la saliva',
      'Coincide con brotes de dentición o uso de chupete/chupón'
    ],
    aapGuideline: 'Irritación mecánica y enzimática provocada por la humedad constante de la saliva.',
    homeCare: [
      'Secar la barbilla frecuentemente a toques suaves con un pañito de muselina de algodón (sin frotar).',
      'Aplicar pomada de barrera protectora (vaselina pura o bálsamo perioral con zinc) antes de dormir y tras las comidas.',
      'Limitar el uso del chupete durante el día si acumula saliva contra la piel.',
      'Usar baberos impermeables con reverso de algodón y cambiarlos tan pronto se humedezcan.'
    ],
    whenToSeeDoctor: [
      'Grietas dolorosas sangrantes en las comisuras bucales (queilitis angular).',
      'Costras amarillas o secreción purulenta.',
      'Extensión hacia el interior de la boca o encías muy inflamadas.'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'varicella',
    name: 'Varicela Infantil',
    medicalName: 'Infección primaria por virus Varicela-Zóster',
    typicalAge: '1 a 10 años',
    severity: 'moderada',
    category: 'infecciosa',
    bodyLocation: 'Cuero cabelludo, cara, tronco y luego extremidades',
    confidence: 95.3,
    visualFeatures: [
      'Erupción en "cielo estrellado" (coexisten máculas, pápulas, vesículas y costras al mismo tiempo)',
      'Vesículas claras con base roja ("gota de rocío sobre pétalo de rosa")',
      'Intenso prurito generalizado con febrícula o fiebre moderada previa'
    ],
    aapGuideline: 'Infección viral clásica prevenible por vacuna. Aislamiento domiciliario estricto hasta que TODAS las lesiones sean costras secas.',
    homeCare: [
      'Baños cortos con agua tibia y avena coloidal para calmar el picor.',
      'Cortar y limpiar uñas al ras para prevenir cicatrices e infecciones secundarias.',
      'Paracetamol para la fiebre (PROHIBIDO Ibuprofeno y Aspirina en varicela por riesgo de complicaciones severas).',
      'Mantener al niño en ambiente fresco y con ropa de algodón muy holgada.'
    ],
    whenToSeeDoctor: [
      '🚨 Lesiones que se tornan muy rojas, calientes, hinchadas o con pus (sobreinfección por estreptococo).',
      'Fiebre que dura más de 4 días o que reaparece tras haber cedido.',
      'Dificultad respiratoria, tos persistente o marcha inestable (ataxia).'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hand_eczema_dishidrosis',
    name: 'Eccema / Dishidrosis en Manos y Dedos',
    medicalName: 'Eccema dishidrótico / Dermatitis eccematosa de manos',
    typicalAge: '4 a 12+ años',
    severity: 'leve',
    category: 'alergica',
    bodyLocation: 'Palmas de las manos, laterales de los dedos y dorso de la mano',
    confidence: 96.2,
    visualFeatures: [
      'Pequeñas microvesículas profundas muy pruriginosas en los laterales de los dedos y palmas',
      'Descamación posterior en láminas o piel áspera tras secarse las vesículas',
      'Frecuente en temporadas de calor, sudoración manual o tras lavado frecuente de manos'
    ],
    aapGuideline: 'Guía AAP de Dermatitis de Contacto y Eccema en Extremidades en la Infancia y Escolaridad.',
    homeCare: [
      'Lavar las manos con agua tibia y jabones sin sulfatos ni perfumes (syndet).',
      'Aplicar cremas emolientes densas ricas en ceramidas tras cada lavado de manos.',
      'Evitar el contacto con pinturas agresivas, pegamentos o detergentes domésticos.',
      'Usar guantes de algodón si realiza actividades que irriten las palmas.'
    ],
    whenToSeeDoctor: [
      'Grietas dolorosas sangrantes en los pliegues de los dedos.',
      'Signos de sobreinfección bacteriana con secreción de pus o costras amarillas.',
      'Picor nocturno incontrolable.'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'verruca_vulgaris_hands',
    name: 'Verrugas Vulgares en Manos y Dedos',
    medicalName: 'Verruga vulgar por Virus del Papiloma Humano (VPH benigno cutáneo)',
    typicalAge: '5 a 12+ años',
    severity: 'leve',
    category: 'infecciosa',
    bodyLocation: 'Dedos de las manos, dorso palmar, nudillos y periungueal',
    confidence: 97.0,
    visualFeatures: [
      'Pápulas queratósicas elevadas con superficie rugosa en coliflor',
      'Presencia de pequeños puntitos negros en el centro (capilares trombosados)',
      'Totalmente benignas y frecuentes en edad escolar por contacto en piscinas o juegos'
    ],
    aapGuideline: 'Infección viral benigna superficial común en edad escolar. Alta tasa de resolución espontánea.',
    homeCare: [
      'Evitar morderse las uñas o pellizcarse las verrugas para no extenderlas a otros dedos o labios.',
      'No compartir cortaúñas ni toallas de mano personales.',
      'Mantener las manos hidratadas para evitar microgrietas en la piel.',
      'Consultar al pediatra o dermatólogo pediátrico si causan dolor o molestia al escribir.'
    ],
    whenToSeeDoctor: [
      'Dolor al sujetar el lápiz o al apoyar la mano.',
      'Rápido aumento de tamaño o sangrado frecuente tras traumatismos.',
      'Afectación periungueal que deforme la uña.'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'juvenile_acne_tzone',
    name: 'Acné Juvenil / Preadolescente',
    medicalName: 'Acné comedoniano e inflamatorio leve preadolescente',
    typicalAge: '8 a 12+ años',
    severity: 'leve',
    category: 'irritativa',
    bodyLocation: 'Frente, nariz, mejillas, barbilla (Zona T) y espalda superior',
    confidence: 95.8,
    visualFeatures: [
      'Comedones abiertos (puntos negros) y cerrados (puntos blancos) en zona centrofacial',
      'Pápulas eritematosas superficiales relacionadas con el estímulo androgénico prepuberal',
      'Piel con mayor brillo y producción de sebo'
    ],
    aapGuideline: 'Protocolo de la Sociedad Americana de Pediatría (AAP) para Manejo del Acné en Niños y Preadolescentes.',
    homeCare: [
      'Lavado facial suave 2 veces al día con limpiador dermatológico acuoso sin frotar con esponjas duras.',
      'Usar protector solar facial con textura gel o toque seco (oil-free).',
      'No exprimir, reventar ni pellizcar las lesiones para evitar cicatrices e inflamación.',
      'Usar cremas hidratantes ligeras libres de aceites minerales ocluyentes (no comedogénicas).'
    ],
    whenToSeeDoctor: [
      'Aparición de quistes profundos o nódulos dolorosos.',
      'Afectación emocional o impacto en la autoestima del preadolescente.',
      'Falta de mejoría tras 2 meses de cuidados de higiene básica.'
    ],
    sampleImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80'
  }
];

// ==========================================
// 3. WHO CHILD GROWTH STANDARDS (0 to 12 Years / 144 Months LMS Parameters)
// ==========================================
export interface WHOLMSData {
  ageMonths: number;
  weightL: number;
  weightM: number;
  weightS: number;
  heightL: number;
  heightM: number;
  heightS: number;
}

// Full 0 to 144 Months (0 to 12 Years) WHO Reference Standards
export const WHO_STANDARDS_BOYS: WHOLMSData[] = [
  { ageMonths: 0, weightL: -0.1600, weightM: 3.346, weightS: 0.1460, heightL: 1, heightM: 49.88, heightS: 0.0379 },
  { ageMonths: 1, weightL: -0.1800, weightM: 4.470, weightS: 0.1330, heightL: 1, heightM: 54.72, heightS: 0.0356 },
  { ageMonths: 2, weightL: -0.1900, weightM: 5.580, weightS: 0.1270, heightL: 1, heightM: 58.42, heightS: 0.0348 },
  { ageMonths: 3, weightL: -0.1983, weightM: 6.401, weightS: 0.1235, heightL: 1, heightM: 61.43, heightS: 0.0345 },
  { ageMonths: 6, weightL: -0.2312, weightM: 7.935, weightS: 0.1162, heightL: 1, heightM: 67.62, heightS: 0.0335 },
  { ageMonths: 9, weightL: -0.2550, weightM: 8.910, weightS: 0.1130, heightL: 1, heightM: 71.95, heightS: 0.0336 },
  { ageMonths: 12, weightL: -0.2789, weightM: 9.676, weightS: 0.1118, heightL: 1, heightM: 75.74, heightS: 0.0338 },
  { ageMonths: 18, weightL: -0.3000, weightM: 10.94, weightS: 0.1120, heightL: 1, heightM: 82.35, heightS: 0.0344 },
  { ageMonths: 24, weightL: -0.3201, weightM: 12.15, weightS: 0.1132, heightL: 1, heightM: 87.12, heightS: 0.0350 },
  { ageMonths: 36, weightL: -0.3400, weightM: 14.33, weightS: 0.1160, heightL: 1, heightM: 96.14, heightS: 0.0362 },
  { ageMonths: 48, weightL: -0.3550, weightM: 16.32, weightS: 0.1200, heightL: 1, heightM: 103.3, heightS: 0.0375 },
  { ageMonths: 60, weightL: -0.3650, weightM: 18.30, weightS: 0.1245, heightL: 1, heightM: 110.0, heightS: 0.0388 },
  { ageMonths: 72, weightL: -0.3750, weightM: 20.50, weightS: 0.1290, heightL: 1, heightM: 116.1, heightS: 0.0398 },
  { ageMonths: 84, weightL: -0.3800, weightM: 22.85, weightS: 0.1340, heightL: 1, heightM: 121.7, heightS: 0.0410 },
  { ageMonths: 96, weightL: -0.3880, weightM: 25.50, weightS: 0.1395, heightL: 1, heightM: 127.3, heightS: 0.0420 },
  { ageMonths: 108, weightL: -0.3940, weightM: 28.50, weightS: 0.1450, heightL: 1, heightM: 132.6, heightS: 0.0428 },
  { ageMonths: 120, weightL: -0.4000, weightM: 31.80, weightS: 0.1520, heightL: 1, heightM: 137.8, heightS: 0.0435 },
  { ageMonths: 132, weightL: -0.4050, weightM: 35.60, weightS: 0.1590, heightL: 1, heightM: 143.5, heightS: 0.0442 },
  { ageMonths: 144, weightL: -0.4100, weightM: 39.80, weightS: 0.1660, heightL: 1, heightM: 149.1, heightS: 0.0450 }
];

export const WHO_STANDARDS_GIRLS: WHOLMSData[] = [
  { ageMonths: 0, weightL: -0.2000, weightM: 3.232, weightS: 0.1410, heightL: 1, heightM: 49.14, heightS: 0.0379 },
  { ageMonths: 1, weightL: -0.2150, weightM: 4.180, weightS: 0.1300, heightL: 1, heightM: 53.68, heightS: 0.0356 },
  { ageMonths: 2, weightL: -0.2250, weightM: 5.130, weightS: 0.1240, heightL: 1, heightM: 57.06, heightS: 0.0348 },
  { ageMonths: 3, weightL: -0.2300, weightM: 5.842, weightS: 0.1200, heightL: 1, heightM: 59.80, heightS: 0.0345 },
  { ageMonths: 6, weightL: -0.2500, weightM: 7.297, weightS: 0.1140, heightL: 1, heightM: 65.73, heightS: 0.0335 },
  { ageMonths: 9, weightL: -0.2650, weightM: 8.240, weightS: 0.1125, heightL: 1, heightM: 70.14, heightS: 0.0336 },
  { ageMonths: 12, weightL: -0.2800, weightM: 8.948, weightS: 0.1120, heightL: 1, heightM: 74.02, heightS: 0.0338 },
  { ageMonths: 18, weightL: -0.2950, weightM: 10.22, weightS: 0.1135, heightL: 1, heightM: 80.70, heightS: 0.0344 },
  { ageMonths: 24, weightL: -0.3100, weightM: 11.48, weightS: 0.1150, heightL: 1, heightM: 85.70, heightS: 0.0350 },
  { ageMonths: 36, weightL: -0.3300, weightM: 13.85, weightS: 0.1190, heightL: 1, heightM: 95.10, heightS: 0.0362 },
  { ageMonths: 48, weightL: -0.3450, weightM: 16.07, weightS: 0.1240, heightL: 1, heightM: 102.7, heightS: 0.0375 },
  { ageMonths: 60, weightL: -0.3550, weightM: 18.20, weightS: 0.1290, heightL: 1, heightM: 109.4, heightS: 0.0388 },
  { ageMonths: 72, weightL: -0.3650, weightM: 20.30, weightS: 0.1340, heightL: 1, heightM: 115.5, heightS: 0.0398 },
  { ageMonths: 84, weightL: -0.3700, weightM: 22.50, weightS: 0.1390, heightL: 1, heightM: 121.1, heightS: 0.0410 },
  { ageMonths: 96, weightL: -0.3780, weightM: 25.20, weightS: 0.1450, heightL: 1, heightM: 126.6, heightS: 0.0420 },
  { ageMonths: 108, weightL: -0.3840, weightM: 28.30, weightS: 0.1520, heightL: 1, heightM: 132.2, heightS: 0.0428 },
  { ageMonths: 120, weightL: -0.3900, weightM: 31.90, weightS: 0.1580, heightL: 1, heightM: 138.6, heightS: 0.0435 },
  { ageMonths: 132, weightL: -0.3950, weightM: 36.20, weightS: 0.1660, heightL: 1, heightM: 144.8, heightS: 0.0442 },
  { ageMonths: 144, weightL: -0.4000, weightM: 41.00, weightS: 0.1740, heightL: 1, heightM: 150.2, heightS: 0.0450 }
];

// Calculation of WHO Z-Score via Box-Cox LMS Formula: Z = ((X/M)^L - 1) / (L * S)
export function calculateWHOZScore(value: number, L: number, M: number, S: number): number {
  if (Math.abs(L) < 0.0001) {
    return Math.log(value / M) / S;
  }
  return (Math.pow(value / M, L) - 1) / (L * S);
}

// Convert Z-score to Cumulative Percentile
export function zScoreToPercentile(z: number): number {
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const p = 0.2316419;
  const c = 0.39894228;

  if (z >= 0) {
    const t = 1.0 / (1.0 + p * z);
    const val = (1.0 - c * Math.exp(-z * z / 2.0) * t *
      (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1));
    return Math.min(99.9, Math.max(0.1, val * 100));
  } else {
    const t = 1.0 / (1.0 - p * z);
    const val = (c * Math.exp(-z * z / 2.0) * t *
      (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1));
    return Math.min(99.9, Math.max(0.1, val * 100));
  }
}

// ==========================================
// 4. DEVELOPMENTAL SURVEY QUESTIONNAIRES BY AGE STAGE
// ==========================================
export const DEVELOPMENTAL_SURVEYS: Record<string, MilestoneSurveyQuestion[]> = {
  '0-12m': [
    {
      id: 'q_0_12_socio',
      domain: 'socioemotional',
      domainLabel: 'Socioemocional & Afecto (Pandita)',
      question: '¿Tu bebé sonríe espontáneamente ante tu rostro y responde con miradas cariñosas y gorgoritos?',
      description: 'Evalúa la conexión afectiva temprana, contacto visual y sonrisa social.',
      options: [
        { label: 'Sí, sonríe y busca mi mirada con frecuencia', points: 2, explanation: 'Apego seguro e interacción social temprana excelente.' },
        { label: 'A veces, cuando está muy descansado', points: 1, explanation: 'En proceso normal de sincronía afectiva.' },
        { label: 'Aún no o le cuesta fijar la mirada', points: 0, explanation: 'Estimular con juegos cara a cara a 25 cm de distancia.' }
      ]
    },
    {
      id: 'q_0_12_motor',
      domain: 'physical_motor',
      domainLabel: 'Motricidad Gruesa & Fina (Monito)',
      question: '¿Sostiene su cabecita firme boca abajo y logra rodar o sentarse con o sin apoyo?',
      description: 'Tono muscular axial, control cervical y transición postural.',
      options: [
        { label: 'Sí, sostiene la cabeza firme y rueda/se sienta', points: 2, explanation: 'Fuerza muscular y equilibrio motor acorde a su etapa.' },
        { label: 'Sostiene la cabeza pero le cuesta rodar o sentarse', points: 1, explanation: 'Fomentar ratitos diarios de juego boca abajo en alfombra.' },
        { label: 'Aún se le cae la cabeza o muestra mucha debilidad', points: 0, explanation: 'Consultar al pediatra para evaluar tono muscular.' }
      ]
    },
    {
      id: 'q_0_12_lang',
      domain: 'literacy_numeracy',
      domainLabel: 'Lenguaje & Balbuceo (Froggi)',
      question: '¿Produce balbuceos con consonantes ("ba-ba", "ma-ma", "da-da") y voltea cuando escucha su nombre?',
      description: 'Desarrollo auditivo receptivo y fonación prelingüística.',
      options: [
        { label: 'Sí, balbucea mucho y voltea a su nombre', points: 2, explanation: 'Excelente maduración auditiva y del aparato fonoarticulatorio.' },
        { label: 'Hace sonidos vocálicos ("aa", "uu") pero pocas sílabas', points: 1, explanation: 'Cantarle canciones rítmicas mirándolo a los labios.' },
        { label: 'Casi no emite sonidos ni voltea a la voz', points: 0, explanation: 'Solicitar tamizaje auditivo formal con el pediatra.' }
      ]
    },
    {
      id: 'q_0_12_cog',
      domain: 'learning_cognitive',
      domainLabel: 'Cognición & Curiosidad (Caracolito)',
      question: '¿Busca con la mirada un objeto que se cae o juega al "dónde está el bebé / taparse la carita"?',
      description: 'Permanencia del objeto y atención compartida.',
      options: [
        { label: 'Sí, busca juguetes ocultos y disfruta el juego', points: 2, explanation: 'Comprensión temprana de la permanencia del objeto.' },
        { label: 'A veces busca el objeto si cayó cerca', points: 1, explanation: 'Jugar a tapar un muñeco con una mantita y destaparlo.' },
        { label: 'Pierde el interés de inmediato', points: 0, explanation: 'Ofrecer objetos coloridos de texturas contrastantes.' }
      ]
    }
  ],
  '1-3y': [
    {
      id: 'q_1_3_socio',
      domain: 'socioemotional',
      domainLabel: 'Autorregulación & Afecto (Pandita)',
      question: '¿Busca consuelo en ti cuando está triste o asustado/a y muestra interés por otros niños?',
      description: 'Regulación emocional guiada y juego en paralelo.',
      options: [
        { label: 'Sí, busca abrazos y disfruta estar cerca de otros niños', points: 2, explanation: 'Regulación socioafectiva saludable.' },
        { label: 'A veces le cuesta calmarse pero acepta acompañamiento', points: 1, explanation: 'Validar emociones con frases cortas y respiración profunda.' },
        { label: 'Tiene desbordes extremos y rechaza todo contacto físico', points: 0, explanation: 'Crear un rincón de calma con cojines y peluches.' }
      ]
    },
    {
      id: 'q_1_3_motor',
      domain: 'physical_motor',
      domainLabel: 'Motricidad & Marcha (Monito)',
      question: '¿Camina con soltura, sube escalones tomado de la mano y puede apilar bloques o garabatear?',
      description: 'Marcha independiente, equilibrio y prensión trípode incipiente.',
      options: [
        { label: 'Sí, camina, corretea y apila 4 o más bloques', points: 2, explanation: 'Coordinación motora gruesa y fina óptima.' },
        { label: 'Camina bien pero se tropieza con facilidad al correr', points: 1, explanation: 'Fomentar circuitos de obstáculos suaves en casa.' },
        { label: 'Aún no camina o muestra rigidez en piernas', points: 0, explanation: 'Valoración motriz con especialista pediátrico.' }
      ]
    },
    {
      id: 'q_1_3_lang',
      domain: 'literacy_numeracy',
      domainLabel: 'Lenguaje & Comunicación (Froggi)',
      question: '¿Usa al menos 10 a 20 palabras claras y empieza a unir dos palabras ("quiero agua", "más pan")?',
      description: 'Construcción sintáctica temprana y señalamiento declarativo.',
      options: [
        { label: 'Sí, dice bastantes palabras y combina frases de 2 términos', points: 2, explanation: 'Desarrollo comunicativo excelente.' },
        { label: 'Dice 5-10 palabras pero se comunica más con gestos', points: 1, explanation: 'Nombrar objetos cotidianos y leer cuentos diarios.' },
        { label: 'Menos de 3 palabras y no señala con el dedo índice', points: 0, explanation: 'Consultar con fonoaudiología pediátrica.' }
      ]
    },
    {
      id: 'q_1_3_autonomy',
      domain: 'autonomy',
      domainLabel: 'Autonomía & Rutinas (Caracolito)',
      question: '¿Intenta comer solo con cuchara, ayuda a quitarse la ropa o avisa cuando el pañal está sucio?',
      description: 'Iniciativa de autoayuda y control de esfínteres incipiente.',
      options: [
        { label: 'Sí, le gusta hacer cosas por sí mismo y avisa', points: 2, explanation: 'Fomento de la autoeficacia y seguridad personal.' },
        { label: 'Come con cuchara pero prefiere que le ayuden', points: 1, explanation: 'Permitir que explore la comida a su propio ritmo.' },
        { label: 'Depende totalmente del adulto para todo', points: 0, explanation: 'Dar pequeñas elecciones diarias (ej: qué zapato poner primero).' }
      ]
    }
  ],
  '4-6y': [
    {
      id: 'q_4_6_cog',
      domain: 'learning_cognitive',
      domainLabel: 'Cognición & Conteo (Froggi)',
      question: '¿Cuenta objetos hasta el 10, reconoce colores básicos y puede seguir instrucciones de 2 a 3 pasos?',
      description: 'Función ejecutiva, memoria de trabajo y conceptos matemáticos tempranos.',
      options: [
        { label: 'Sí, cuenta con precisión y sigue instrucciones complejas', points: 2, explanation: 'Capacidad de razonamiento y atención muy sólida.' },
        { label: 'Cuenta hasta 5 pero a veces se salta números', points: 1, explanation: 'Jugar a contar frutas o juguetes mientras guardan.' },
        { label: 'Se distrae con facilidad y le cuesta retener 2 órdenes', points: 0, explanation: 'Instrucciones cortas apoyadas con gestos visuales.' }
      ]
    },
    {
      id: 'q_4_6_socio',
      domain: 'socioemotional',
      domainLabel: 'Empatía & Juego Simbólico (Pandita)',
      question: '¿Participa en juegos de roles ("jugar a la casita / doctores") y muestra empatía si un amigo llora?',
      description: 'Teoría de la mente, juego cooperativo y empatía pro-social.',
      options: [
        { label: 'Sí, inventa historias ricas e interactúa con empatía', points: 2, explanation: 'Inteligencia emocional y creatividad destacadas.' },
        { label: 'Juega roles sencillos y a veces comparte', points: 1, explanation: 'Representar cuentos de teatro con peluches.' },
        { label: 'Le cuesta integrarse con otros niños en el juego', points: 0, explanation: 'Organizar encuentros de juego con un solo amigo a la vez.' }
      ]
    },
    {
      id: 'q_4_6_motor',
      domain: 'physical_motor',
      domainLabel: 'Motricidad Fina & Grafismo (Monito)',
      question: '¿Toma el lápiz con agarre trípode, dibuja una figura humana con cabeza y cuerpo, y usa tijeras?',
      description: 'Grafomotricidad, disociación de muñeca y esquema corporal.',
      options: [
        { label: 'Sí, dibuja figuras completas y maneja tijeras infantiles', points: 2, explanation: 'Coordinación visomotriz fina muy madura.' },
        { label: 'Dibuja trazos básicos pero con agarre palmar aún', points: 1, explanation: 'Modelar con plastilina y rasgar papeles para fortalecer dedos.' },
        { label: 'Rechaza dibujar o colorear por cansancio en la mano', points: 0, explanation: 'Juegos de pinzas con fideos o botones grandes.' }
      ]
    }
  ],
  '7-10y+': [
    {
      id: 'q_7_10_learning',
      domain: 'learning_cognitive',
      domainLabel: 'Pensamiento Crítico & Lectura (Froggi)',
      question: '¿Lee textos breves con comprensión, resuelve problemas escolares con autonomía y expresa sus opiniones?',
      description: 'Comprensión lectora, lógica matemática y pensamiento analítico.',
      options: [
        { label: 'Sí, comprende lo que lee y argumenta con claridad', points: 2, explanation: 'Madurez cognitiva y académica óptima.' },
        { label: 'Lee bien pero necesita apoyo para estructurar deberes', points: 1, explanation: 'Establecer rutinas fijas de estudio con descansos activos.' },
        { label: 'Gran frustración con la lectura o cálculos básicos', points: 0, explanation: 'Apoyo psicopedagógico para descartar dificultades específicas.' }
      ]
    },
    {
      id: 'q_7_10_socio',
      domain: 'socioemotional',
      domainLabel: 'Autoestima & Resiliencia (Pandita)',
      question: '¿Reconoce sus fortalezas, tolera la frustración ante pérdidas en juegos y mantiene amistades estables?',
      description: 'Identidad propia, asertividad y autorregulación emocional.',
      options: [
        { label: 'Sí, tiene buena autoestima y maneja bien los desacuerdos', points: 2, explanation: 'Salud mental y resiliencia excelentes.' },
        { label: 'A veces se enoja mucho al perder pero luego recapacita', points: 1, explanation: 'Dialogar sobre el valor de aprender de los errores.' },
        { label: 'Muestra inseguridad marcada o aislamiento escolar', points: 0, explanation: 'Reforzar logros cotidianos y comunicación sin juicios.' }
      ]
    },
    {
      id: 'q_7_10_physical',
      domain: 'physical_motor',
      domainLabel: 'Actividad Física & Salud Digital (Monito)',
      question: '¿Realiza al menos 60 minutos diarios de juego activo/deporte y respeta límites de pantallas digitales?',
      description: 'Hábitos de vida saludable y uso equilibrado de tecnología.',
      options: [
        { label: 'Sí, es muy activo/a y no abusa de las pantallas', points: 2, explanation: 'Estilo de vida saludable que protege el neurodesarrollo.' },
        { label: 'Hace deporte pero a veces pide más tiempo de pantallas', points: 1, explanation: 'Crear un plan familiar de uso de medios sin pantallas en cenas.' },
        { label: 'Sedentarismo marcado y conflicto continuo por pantallas', points: 0, explanation: 'Sustituir tiempo digital por deportes al aire libre en familia.' }
      ]
    }
  ]
};

// ==========================================
// 5. UNICEF EARLY MILESTONES DATASET
// ==========================================
export const UNICEF_MILESTONES: DevelopmentalMilestone[] = [
  {
    id: 'm1',
    ageRange: '0-12m',
    domain: 'socioemotional',
    domainLabel: 'Desarrollo Socioemocional',
    milestone: 'Sonrisa social en respuesta a caras y voces familiares (2-3 meses); angustia de separación (8-9 meses).',
    sourceDataset: 'Guías Pediátricas de Crianza Respetuosa',
    suggestedActivity: 'Juego de taparse la carita con Pandita ("¿Dónde está el bebé?") y cantos con contacto visual.',
    recreationalType: 'juego'
  },
  {
    id: 'm2',
    ageRange: '0-12m',
    domain: 'physical_motor',
    domainLabel: 'Motricidad y Desarrollo Físico',
    milestone: 'Sostén cefálico firme boca abajo (3 meses), volteo y sedestación independiente (6-8 meses).',
    sourceDataset: 'Guías Pediátricas de Motricidad Infantil',
    suggestedActivity: 'Sesiones de juego libre sobre alfombra con sonajeros colocados a los lados para incentivar el giro.',
    recreationalType: 'juego'
  },
  {
    id: 'm3',
    ageRange: '0-12m',
    domain: 'literacy_numeracy',
    domainLabel: 'Lenguaje y Comunicación',
    milestone: 'Balbuceo imitativo con consonantes ("ma-ma", "da-da"), respuesta a su nombre y primeras palabras.',
    sourceDataset: 'Guías Pediátricas del Lenguaje',
    suggestedActivity: 'Conversaciones cara a cara imitando sus sonidos y leyendo cuentos de telas suaves con Froggi.',
    recreationalType: 'cancion'
  },
  {
    id: 'm4',
    ageRange: '1-3y',
    domain: 'socioemotional',
    domainLabel: 'Desarrollo Socioemocional',
    milestone: 'Desarrollo de la autonomía, imitación de conductas de adultos y primeros juegos en paralelo con otros niños.',
    sourceDataset: 'Guías Pediátricas de Inteligencia Emocional',
    suggestedActivity: 'Validar sus emociones en momentos de frustración con la técnica del "abrazo esponjoso" de Pandita.',
    recreationalType: 'historia'
  },
  {
    id: 'm5',
    ageRange: '1-3y',
    domain: 'physical_motor',
    domainLabel: 'Motricidad y Desarrollo Físico',
    milestone: 'Marcha independiente, correr, trepar y lanzar una pelota con los brazos en alto.',
    sourceDataset: 'Guías Pediátricas de Psicomotricidad',
    suggestedActivity: 'Circuito de saltos de ranita con Froggi y obstáculos con almohadones seguros.',
    recreationalType: 'juego'
  },
  {
    id: 'm6',
    ageRange: '1-3y',
    domain: 'literacy_numeracy',
    domainLabel: 'Lenguaje y Comunicación',
    milestone: 'Vocabulario de 50+ palabras, frases de 2 palabras y comprensión de órdenes sencillas de 2 pasos.',
    sourceDataset: 'Guías Pediátricas de Comunicación',
    suggestedActivity: 'Ronda de canciones con rimas infantiles y señalamiento de animales en el bosque de Amigos Unidos.',
    recreationalType: 'cancion'
  },
  {
    id: 'm7',
    ageRange: '4-6y',
    domain: 'learning_cognitive',
    domainLabel: 'Aprendizaje y Cognición',
    milestone: 'Clasificación por color, forma y tamaño; conteo secuencial hasta el 10 y juego simbólico complejo.',
    sourceDataset: 'Guías de Estimulación Cognitiva Preescolar',
    suggestedActivity: 'Juegos de clasificación de hojas y piedras del jardín con Caracolito contando juntos.',
    recreationalType: 'juego'
  },
  {
    id: 'm8',
    ageRange: '4-6y',
    domain: 'physical_motor',
    domainLabel: 'Motricidad Fina y Grafismo',
    milestone: 'Agarre trípode del lápiz, recorte con tijeras infantiles y dibujo de la figura humana con 6 partes.',
    sourceDataset: 'Guías de Grafomotricidad y Dibujo Infantil',
    suggestedActivity: 'Dibujar a los 4 Amigos Unidos en la Pizarra Mágica y estampar frases positivas.',
    recreationalType: 'dibujo'
  },
  {
    id: 'm9',
    ageRange: '7-10y+',
    domain: 'learning_cognitive',
    domainLabel: 'Pensamiento Lógico y Lectura',
    milestone: 'Lectura fluida con comprensión de ideas principales, pensamiento lógico-matemático y autonomía escolar.',
    sourceDataset: 'Guías de Neurodesarrollo Escolar',
    suggestedActivity: 'Creación de cuentos interactivos de misterio y capítulos colaborativos en la Zona Recreativa.',
    recreationalType: 'historia'
  }
];

// ==========================================
// 6. COGNITIVE ACTIVITIES CATALOG
// ==========================================
export const COGNITIVE_ACTIVITIES: CognitiveActivity[] = [
  {
    id: 'act1',
    title: 'La Sinfonía de las Emociones con Pandita',
    targetAge: '1-3 años',
    domain: 'socioemocional',
    description: 'Juego de imitación con expresiones faciales frente al espejo: alegría, sorpresa, calma y enfado con acompañamiento cariñoso.',
    durationMin: 12,
    materials: ['Espejo irrompible', 'Cojín de abrazos'],
    cognitiveBenefit: 'Fortalece la corteza prefrontal, el reconocimiento emocional y la empatía recíproca.',
    mascotHost: 'Pandita'
  },
  {
    id: 'act2',
    title: 'El Circuito de los Saltos Ágiles de Monito',
    targetAge: '2-5 años',
    domain: 'psicomotricidad',
    description: 'Caminar sobre una línea trazada con cinta en el suelo, saltar dentro de aros imaginarios y mantener el equilibrio en un pie durante 5 segundos.',
    durationMin: 15,
    materials: ['Cinta de papel', 'Música rítmica'],
    cognitiveBenefit: 'Mejora la coordinación bimanual, el equilibrio vestibular y la orientación espacial.',
    mascotHost: 'Monito'
  },
  {
    id: 'act3',
    title: 'La Rima Secreta de Froggi',
    targetAge: '3-6 años',
    domain: 'lenguaje_conciencia_fonologica',
    description: 'Froggi dice una palabra (ej. "rana") y el niño debe encontrar una palabra que rime (ej. "campana", "ventana").',
    durationMin: 10,
    materials: ['Tarjetas con dibujos o palabras cotidianas'],
    cognitiveBenefit: 'Desarrolla la conciencia fonológica y la memoria auditiva, pilar de la lectoescritura.',
    mascotHost: 'Froggi'
  },
  {
    id: 'act4',
    title: 'La Respiración de la Concha con Caracolito',
    targetAge: 'Todas las edades',
    domain: 'mindfulness_relajacion',
    description: 'Inhalar despacio por la nariz inflando la pancita como un globo mientras contamos 1, 2, 3, y soltar el aire lentamente como si sopláramos una vela suavemente.',
    durationMin: 8,
    materials: ['Luz tenue', 'Música de 432 Hz de Amigos Unidos'],
    cognitiveBenefit: 'Activa el sistema nervioso parasimpático, reduce el cortisol y facilita el sueño reparador.',
    mascotHost: 'Caracolito'
  }
];
