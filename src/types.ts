export type AgeBracket = '0-12m' | '1-3y' | '4-6y' | '7-10y+';

export interface ChildProfile {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  ageMonths: number;
  gender: 'boy' | 'girl';
  birthWeightKg?: number;
  currentWeightKg?: number;
  currentHeightCm?: number;
  feedingType?: 'breastfeeding' | 'formula' | 'mixed' | 'solids';
  allergiesKnown?: string;
  medicalConditions?: string;
  favoriteInterests?: string;
  specialNotes?: string;
}

export type PlatformRole = 'user' | 'admin' | 'developer';

export interface SystemUserAccount {
  id: string;
  name: string;
  email: string;
  role: PlatformRole;
  familyRole?: 'mamá' | 'papá' | 'tutor' | 'familiar' | 'director_clinico' | 'lead_dev';
  avatar?: string;
  isGoogleAuth?: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface ParentUser {
  id: string;
  name: string;
  email: string;
  role: 'mamá' | 'papá' | 'tutor' | 'familiar';
  systemRole?: PlatformRole;
  avatar?: string;
  isGoogleAuth?: boolean;
  phone?: string;
  children: ChildProfile[];
  activeChildId: string;
  createdAt: string;
}

export interface Mascot {
  id: string;
  name: string;
  species: string;
  role: string;
  color: string;
  avatarBg: string;
  description: string;
  specialty: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'froggi' | 'system';
  text: string;
  timestamp: string;
  sources?: string[];
  suggestedActivities?: string[];
  alertLevel?: 'normal' | 'caution' | 'urgent';
  geneticSearchTelemetry?: {
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
  };
}

export interface CryAcousticProfile {
  id: string;
  cause: string;
  label: string;
  category: 'fisiologico' | 'emocional' | 'dolor' | 'incomodidad';
  fundamentalFreq: string; // F0 e.g. "420 - 450 Hz"
  frequencyVal: number;
  duration: string;
  acousticPattern: string;
  confidence: number;
  indicators: string[];
  pediatricGuidance: string[];
  audioWaveform: number[];
  reassuranceTip: string;
}

export interface DermaCondition {
  id: string;
  name: string;
  medicalName: string;
  typicalAge: string;
  severity: 'leve' | 'moderada' | 'urgente';
  category?: 'panal' | 'infecciosa' | 'alergica' | 'neonatal' | 'irritativa';
  bodyLocation?: string;
  confidence: number;
  visualFeatures: string[];
  aapGuideline: string;
  homeCare: string[];
  whenToSeeDoctor: string[];
  sampleImage: string;
}

export interface DermaTriageResult {
  isValidImage?: boolean;
  invalidReason?: string;
  invalidSuggestion?: string;
  conditionName: string;
  medicalName?: string;
  detectedBodyPart: string;
  detectedAgeRange: string;
  symptomsIdentified?: string[];
  differentialDiagnoses?: string[];
  severity: 'leve' | 'moderada' | 'urgente';
  confidence: number;
  analysis: string;
  aapGuideline: string;
  homeCareSteps: string[];
  warningSigns: string[];
  froggiAdvice: string;
}

export interface WHOGrowthRecord {
  ageMonths: number;
  gender: 'boy' | 'girl';
  weightKg: number;
  heightCm: number;
  headCircumferenceCm?: number;
}

export interface WHOGrowthEvaluation {
  weightPercentile: number;
  weightZScore: number;
  heightPercentile: number;
  heightZScore: number;
  bmi: number;
  bmiZScore: number;
  interpretation: string;
  recommendations: string[];
  status: 'normal' | 'vigilancia' | 'alerta';
}

export interface DevelopmentalMilestone {
  id: string;
  ageRange: string;
  domain: 'literacy_numeracy' | 'physical_motor' | 'socioemotional' | 'learning_cognitive';
  domainLabel: string;
  milestone: string;
  sourceDataset: string;
  suggestedActivity: string;
  recreationalType: 'cancion' | 'juego' | 'dibujo' | 'historia';
}

export interface MilestoneSurveyQuestion {
  id: string;
  domain: 'socioemotional' | 'physical_motor' | 'literacy_numeracy' | 'learning_cognitive' | 'autonomy';
  domainLabel: string;
  question: string;
  description: string;
  options: {
    label: string;
    points: number; // 2 = con soltura, 1 = a veces/en proceso, 0 = aún no
    explanation: string;
  }[];
}

export interface MilestoneSurveyReport {
  scorePercentage: number;
  overallStatus: 'Óptimo y Estimulado' | 'En Proceso Evolutivo Normal' | 'Oportunidad de Estimulación Focalizada';
  summary: string;
  childName: string;
  ageText: string;
  strengths: string[];
  stimulationOptions: string[];
  pediatricAdvice: string[];
  funActivities: {
    title: string;
    description: string;
    mascot: string;
  }[];
}

export interface CognitiveActivity {
  id: string;
  title: string;
  targetAge: string;
  domain: string;
  description: string;
  durationMin: number;
  materials: string[];
  cognitiveBenefit: string;
  mascotHost: string;
}

export interface GeneratedStory {
  title: string;
  targetAge: AgeBracket;
  protagonist: string;
  theme: string;
  summary: string;
  chapters: {
    title: string;
    text: string;
    illustrationPrompt?: string;
  }[];
  familyQuestion: string;
  pediatricBenefit: string;
}

export interface GeneratedSong {
  title: string;
  targetAge: AgeBracket;
  style: string;
  tempoBpm: number;
  lyrics: {
    verse1: string;
    chorus: string;
    verse2: string;
    outro: string;
  };
  notes: {
    pitch: string;
    freq: number;
    duration: number; // in seconds
  }[];
  pediatricBenefit: string;
}

export interface MascotLetter {
  id: string;
  senderName: string;
  senderAge: string;
  mascot: string;
  childMessage: string;
  mascotReply: string;
  timestamp: string;
  pedagogicalAdvice: string;
  activityProposal: string;
}

export interface CryDifferentialDiagnosis {
  profile: CryAcousticProfile;
  probabilityPct: number;
  acousticFitScore: number;
  matchedIndicators: string[];
  differentiationKey: string;
}

export interface CryAnalysisFullResult {
  id: string;
  timestamp: string;
  childName: string;
  detectedF0: number;
  detectedDb: number;
  primaryProfile: CryAcousticProfile;
  differentialDiagnoses: CryDifferentialDiagnosis[];
  acousticFeatures: {
    f0Range: string;
    spectralEntropy: string;
    rhythmCadence: string;
    energyDistribution: string;
  };
}

export type HistoryRecordType = 'chat' | 'cry' | 'derma' | 'growth' | 'milestones' | 'pregnancy' | 'genetic' | 'appointment';

export interface BaseHistoryRecord {
  id: string;
  type: HistoryRecordType;
  timestamp: string;
  childId?: string;
  childName: string;
  title: string;
  summary: string;
  details?: any;
}

// ==========================================
// PREGNANCY & MATERNAL HEALTH DATASET TYPES
// ==========================================

export interface PregnancyWeekInfo {
  week: number;
  trimester: 1 | 2 | 3;
  babyFruitComparison: {
    fruit: string;
    emoji: string;
    comparisonText: string;
  };
  babyLengthCm: number;
  babyWeightGrams: number;
  fetalDevelopmentHighlights: string[];
  maternalBodyChanges: string[];
  recommendedCareAndNutrition: string[];
  keyMedicalTests: string[];
  warningSignsToCheck: string[];
}

export interface PregnancyTrimesterGuide {
  trimester: 1 | 2 | 3;
  title: string;
  weeksRange: string;
  fetalHighlightsSummary: string;
  essentialNutrients: {
    name: string;
    recommendedDaily: string;
    foodSources: string[];
    importance: string;
  }[];
  foodsToAvoidOrLimit: {
    food: string;
    reason: string;
    safeAlternative: string;
  }[];
  medicalAppointmentsAndScans: {
    timeframe: string;
    name: string;
    purpose: string;
  }[];
  maternalWellbeingTips: string[];
}

export interface PregnancyObstetricRedFlag {
  id: string;
  symptom: string;
  severity: 'urgente' | 'precaucion';
  medicalReason: string;
  recommendedAction: string;
  sourceGuideline: string;
}

export interface PregnancyCommonSymptom {
  id: string;
  symptomName: string;
  trimesters: (1 | 2 | 3)[];
  description: string;
  safeHomeRelief: string[];
  medicalRedFlags: string[];
}

export interface FetalKickRecord {
  id: string;
  timestamp: string;
  durationMinutes: number;
  kicksCount: number;
  targetKicks: number;
  status: 'completado_optimo' | 'en_curso' | 'alerta_hipoactividad';
  notes?: string;
}

export interface ContractionRecord {
  id: string;
  startTime: string; // ISO string
  durationSeconds: number;
  intervalMinutes: number;
  intensity: 'leve' | 'moderada' | 'fuerte';
}

export interface HospitalBagItem {
  id: string;
  category: 'mama' | 'bebe' | 'documentos' | 'acompanante';
  label: string;
  description: string;
  checked: boolean;
  essential: boolean;
}

export type AppThemeId = 'pastel_yellow' | 'emerald' | 'ocean' | 'rose' | 'lavender' | 'sunset' | 'dark';
export type AppFontSizeId = 'normal' | 'comfortable' | 'large';

export interface ThemeConfig {
  theme: AppThemeId;
  fontSize: AppFontSizeId;
  autoReadVoice: boolean; // Auto-read Froggi responses via Web Speech Synthesis
  speechRate: number; // 0.8 to 1.5
  voicePitch: number; // 0.8 to 1.3
  voiceMascot?: 'froggi' | 'pandita' | 'monito' | 'caracolito';
  preferredVoiceURI?: string;
  singingMelodyEnabled?: boolean; // Suno-style harmonic accompaniment and vocal singing
  soundEffects: boolean;
  highContrast: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}




