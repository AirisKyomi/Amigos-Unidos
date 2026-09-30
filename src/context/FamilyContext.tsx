import React, { createContext, useContext, useState, useEffect } from 'react';
import { ParentUser, ChildProfile, BaseHistoryRecord, HistoryRecordType, PlatformRole } from '../types';

export interface ExtendedParentUser extends ParentUser {
  password?: string;
  systemRole?: PlatformRole;
}

interface FamilyContextType {
  user: ExtendedParentUser | null;
  activeChild: ChildProfile | null;
  isLoggedIn: boolean;
  isBackofficeAuthorized: boolean;
  isDeveloperAuthorized: boolean;
  login: (email: string, password?: string, name?: string, role?: 'mamá' | 'papá' | 'tutor' | 'familiar') => Promise<{ success: boolean; message?: string; user?: ExtendedParentUser }>;
  loginWithGoogle: (email?: string, name?: string, avatar?: string, preferredRole?: PlatformRole) => Promise<{ success: boolean; message?: string; user?: ExtendedParentUser }>;
  loginDemoRole: (role: PlatformRole) => void;
  register: (name: string, email: string, password?: string, role?: 'mamá' | 'papá' | 'tutor' | 'familiar', initialChild?: Partial<ChildProfile>, systemRole?: PlatformRole) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchSystemRole: (newRole: PlatformRole) => void;
  addChild: (child: Omit<ChildProfile, 'id'>) => void;
  updateChild: (id: string, updates: Partial<ChildProfile>) => void;
  setActiveChildId: (id: string) => void;
  historyRecords: BaseHistoryRecord[];
  addHistoryRecord: (record: Omit<BaseHistoryRecord, 'id' | 'timestamp'>) => void;
  deleteHistoryRecord: (id: string) => void;
  clearHistory: (type?: HistoryRecordType) => void;
}

const ACCOUNTS_STORAGE_KEY = 'amigos_unidos_accounts_v4';
const SESSION_STORAGE_KEY = 'amigos_unidos_session_v4';
const HISTORY_STORAGE_KEY = 'amigos_unidos_history_v4';

export const DEMO_PRESET_USERS: ExtendedParentUser[] = [
  // 1. Cuentas de Usuario Ficticias (Familia - 3 cuentas)
  {
    id: 'usr-valecruz',
    name: 'Valentina Cruz',
    email: 'valecruz20008@gmail.com',
    password: 'usuario123',
    role: 'mamá',
    systemRole: 'user',
    isGoogleAuth: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    activeChildId: 'child-1',
    createdAt: '2026-08-16',
    children: [
      {
        id: 'child-1',
        name: 'Mateo',
        birthDate: '2025-08-16',
        ageMonths: 12,
        gender: 'boy',
        birthWeightKg: 3.4,
        currentWeightKg: 9.6,
        currentHeightCm: 75.5,
        feedingType: 'solids',
        allergiesKnown: 'Ninguna conocida',
        medicalConditions: 'Control pediátrico regular, vacunas al día',
        favoriteInterests: 'Le encantan los animales, la música alegre y jugar a las escondidas',
        specialNotes: 'Duerme en su cunita con canciones de cuna'
      },
      {
        id: 'child-2',
        name: 'Sofía',
        birthDate: '2023-02-10',
        ageMonths: 42,
        gender: 'girl',
        birthWeightKg: 3.1,
        currentWeightKg: 15.2,
        currentHeightCm: 99.0,
        feedingType: 'solids',
        allergiesKnown: 'Ninguna',
        medicalConditions: 'Saludable',
        favoriteInterests: 'Dibujar, colorear y escuchar cuentos de aventuras con Froggi',
        specialNotes: 'Asiste a preescolar'
      }
    ]
  },
  {
    id: 'usr-camila-santos',
    name: 'Camila Santos',
    email: 'camila.santos@gmail.com',
    password: 'usuario123',
    role: 'mamá',
    systemRole: 'user',
    isGoogleAuth: true,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    activeChildId: 'child-camila-1',
    createdAt: '2026-08-10',
    children: [
      {
        id: 'child-camila-1',
        name: 'Lucas',
        birthDate: '2026-03-15',
        ageMonths: 6,
        gender: 'boy',
        birthWeightKg: 3.2,
        currentWeightKg: 7.8,
        currentHeightCm: 67.0,
        feedingType: 'mixed',
        allergiesKnown: 'Sin alergias',
        medicalConditions: 'Lactante sano, inicio de alimentación complementaria BLW',
        favoriteInterests: 'Sonajeros, espejos y sonidos de agua',
        specialNotes: 'Siestas de 2 horas'
      }
    ]
  },
  {
    id: 'usr-diego-morales',
    name: 'Diego Morales',
    email: 'diego.morales@gmail.com',
    password: 'usuario123',
    role: 'papá',
    systemRole: 'user',
    isGoogleAuth: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    activeChildId: 'child-diego-1',
    createdAt: '2026-08-15',
    children: [
      {
        id: 'child-diego-1',
        name: 'Sofía',
        birthDate: '2023-09-10',
        ageMonths: 36,
        gender: 'girl',
        birthWeightKg: 3.3,
        currentWeightKg: 14.5,
        currentHeightCm: 96.0,
        feedingType: 'solids',
        allergiesKnown: 'Ninguna',
        medicalConditions: 'Controles al día, excelente desarrollo motor',
        favoriteInterests: 'Construcciones con bloques, carreras y bailar',
        specialNotes: 'Le gusta cepillarse los dientes escuchando la canción de Froggi'
      }
    ]
  },

  // 2. Cuentas de Administrador (Supervisión Clínica - 2 cuentas)
  {
    id: 'usr-admin-demo',
    name: 'Dra. Elena Ramos',
    email: 'admin@amigosunidos.com',
    password: 'admin123',
    role: 'tutor',
    systemRole: 'admin',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    activeChildId: 'child-admin-1',
    createdAt: '2026-08-01',
    children: [
      {
        id: 'child-admin-1',
        name: 'Nicolás',
        birthDate: '2024-05-10',
        ageMonths: 28,
        gender: 'boy',
        birthWeightKg: 3.5,
        currentWeightKg: 13.5,
        currentHeightCm: 91.0,
        feedingType: 'solids',
        allergiesKnown: 'Ninguna',
        medicalConditions: 'Sano',
        favoriteInterests: 'Dinosaurios y canciones rítmicas',
        specialNotes: 'Control trimestral al día'
      }
    ]
  },
  {
    id: 'usr-admin-martinez',
    name: 'Dr. Carlos Martínez',
    email: 'dr.martinez@amigosunidos.com',
    password: 'admin123',
    role: 'tutor',
    systemRole: 'admin',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    activeChildId: 'child-admin-2',
    createdAt: '2026-08-05',
    children: [
      {
        id: 'child-admin-2',
        name: 'Emma',
        birthDate: '2025-01-20',
        ageMonths: 20,
        gender: 'girl',
        birthWeightKg: 3.2,
        currentWeightKg: 11.2,
        currentHeightCm: 84.5,
        feedingType: 'solids',
        allergiesKnown: 'Ninguna',
        medicalConditions: 'Control pediátrico regular',
        favoriteInterests: 'Libros con texturas y música infantil',
        specialNotes: 'Seguimiento clínico estándar'
      }
    ]
  },

  // 3. Cuentas de Desarrollador (God Mode - 2 cuentas)
  {
    id: 'usr-dev-demo',
    name: 'Ing. Alex Valdés (God Mode)',
    email: 'dev@amigosunidos.ai',
    password: 'dev123',
    role: 'tutor',
    systemRole: 'developer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    activeChildId: 'child-dev-1',
    createdAt: '2026-07-15',
    children: [
      {
        id: 'child-dev-1',
        name: 'Camila',
        birthDate: '2025-11-20',
        ageMonths: 9,
        gender: 'girl',
        birthWeightKg: 3.2,
        currentWeightKg: 8.8,
        currentHeightCm: 71.5,
        feedingType: 'mixed',
        allergiesKnown: 'Ninguna',
        medicalConditions: 'Sana',
        favoriteInterests: 'Música clásica para bebés y sonajeros sensoriales',
        specialNotes: 'Estimulación temprana activa'
      }
    ]
  },
  {
    id: 'usr-dev-sofia',
    name: 'Ing. Sofía Chen (Sistemas & Cloud)',
    email: 'sofia.dev@amigosunidos.ai',
    password: 'dev123',
    role: 'tutor',
    systemRole: 'developer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    activeChildId: 'child-dev-2',
    createdAt: '2026-08-05',
    children: [
      {
        id: 'child-dev-2',
        name: 'Leo',
        birthDate: '2024-10-12',
        ageMonths: 23,
        gender: 'boy',
        birthWeightKg: 3.4,
        currentWeightKg: 12.0,
        currentHeightCm: 88.0,
        feedingType: 'solids',
        allergiesKnown: 'Ninguna',
        medicalConditions: 'Sano',
        favoriteInterests: 'Puzzles de madera y animales',
        specialNotes: 'Desarrollo motriz avanzado'
      }
    ]
  }
];

const INITIAL_DEMO_HISTORY: BaseHistoryRecord[] = [
  {
    id: 'hist-1',
    type: 'cry',
    timestamp: '2026-08-16 16:30',
    childId: 'child-1',
    childName: 'Mateo',
    title: 'Análisis Bioacústico de Llanto',
    summary: 'Diagnóstico principal: Hambre / Reflejo de succión (88%). Diagnósticos diferenciales: Gases/Cólico (65%), Somnolencia (42%).',
    details: {
      f0: 438,
      db: 74,
      primaryCause: 'Hambre / Reflejo de Succión',
      confidence: 88,
      differentialCount: 3,
    }
  },
  {
    id: 'hist-2',
    type: 'chat',
    timestamp: '2026-08-16 14:15',
    childId: 'child-1',
    childName: 'Mateo',
    title: 'Consulta Froggi: Dosis de Paracetamol y Fiebre',
    summary: 'Orientación según AAP (10-15 mg/kg por toma cada 6-8h) y medidas de confort térmico en casa.',
    details: {
      question: '¿Cuál es la dosis correcta de paracetamol por kilo y cuándo consultar a urgencias?',
      alertLevel: 'normal',
    }
  },
  {
    id: 'hist-3',
    type: 'growth',
    timestamp: '2026-08-15 11:00',
    childId: 'child-1',
    childName: 'Mateo',
    title: 'Evaluación de Percentiles OMS (12 meses)',
    summary: 'Peso: 9.6 kg (P55), Talla: 75.5 cm (P50), IMC: 16.8 (Eutrófico/Normal). Curva de crecimiento armónica.',
    details: {
      weightKg: 9.6,
      heightCm: 75.5,
      weightPercentile: 55,
      heightPercentile: 50,
      bmi: 16.8
    }
  },
  {
    id: 'hist-4',
    type: 'derma',
    timestamp: '2026-08-13 09:45',
    childId: 'child-1',
    childName: 'Mateo',
    title: 'Triaje Dermatológico AAP: Dermatitis del Pañal',
    summary: 'Eritema perianal leve con piel respetada en pliegues. Protocolo: Crema con óxido de zinc y cambios frecuentes.',
    details: {
      condition: 'Dermatitis del Pañal por Contacto',
      severity: 'leve'
    }
  }
];

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Accounts stored in browser
  const [accounts, setAccounts] = useState<ExtendedParentUser[]>(() => {
    try {
      const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading accounts from localStorage:', e);
    }
    return DEMO_PRESET_USERS;
  });

  // Current active session user (starts as null to land on the Landing Home)
  const [user, setUser] = useState<ExtendedParentUser | null>(() => {
    try {
      const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (storedSession) {
        return JSON.parse(storedSession);
      }
    } catch (e) {
      console.warn('Error reading session from localStorage:', e);
    }
    return null;
  });

  const [historyRecords, setHistoryRecords] = useState<BaseHistoryRecord[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading history records from localStorage:', e);
    }
    return INITIAL_DEMO_HISTORY;
  });

  // Helper to sanitize delicate user data before writing to client storage
  const sanitizeForStorage = (usersList: ExtendedParentUser[]): ExtendedParentUser[] => {
    return usersList.map((u) => {
      const sanitized = { ...u };
      // Never store plain text passwords in browser local storage
      delete sanitized.password;
      return sanitized;
    });
  };

  // Non-blocking asynchronous persistence for accounts (protects delicate sources and prevents UI lag)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const safeAccounts = sanitizeForStorage(accounts);
        localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(safeAccounts));
      } catch (e) {
        console.warn('Non-blocking storage error (accounts):', e);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [accounts]);

  // Non-blocking asynchronous persistence for active session
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (user) {
          const safeUser = { ...user };
          delete safeUser.password;
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(safeUser));
        } else {
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      } catch (e) {
        console.warn('Non-blocking storage error (session):', e);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [user]);

  // Non-blocking asynchronous persistence for clinical history records (capped to 100 to prevent memory bloat)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const cappedHistory = historyRecords.slice(0, 100);
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(cappedHistory));
      } catch (e) {
        console.warn('Non-blocking storage error (history):', e);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [historyRecords]);

  const activeChild = user?.children?.find((c) => c.id === user.activeChildId) || user?.children?.[0] || null;

  const isBackofficeAuthorized = Boolean(user && (user.systemRole === 'admin' || user.systemRole === 'developer'));
  const isDeveloperAuthorized = Boolean(user && user.systemRole === 'developer');

  // Authenticate against hashed BBDD on server or local fallback
  const login = async (
    email: string,
    password = '',
    name = 'Padre/Madre de Familia',
    role: 'mamá' | 'papá' | 'tutor' | 'familiar' = 'mamá'
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: 'Por favor ingresa un correo electrónico válido.' };
    }

    try {
      // 1. Call server API with PBKDF2 hash verification
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          // Check if user has child profile in local state
          const localMatch = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
          const fullUser: ExtendedParentUser = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: role || (localMatch?.role || 'mamá'),
            systemRole: data.user.role,
            avatar: data.user.avatar || localMatch?.avatar,
            isGoogleAuth: data.user.isGoogleAuth,
            createdAt: data.user.createdAt,
            activeChildId: localMatch?.activeChildId || 'child-1',
            children: localMatch?.children || [
              {
                id: 'child-1',
                name: 'Mi Peque',
                birthDate: '2025-08-01',
                ageMonths: 12,
                gender: 'boy',
                birthWeightKg: 3.4,
                currentWeightKg: 9.6,
                currentHeightCm: 75.0,
                feedingType: 'solids',
                allergiesKnown: 'Ninguna conocida',
                medicalConditions: 'Controles al día',
                favoriteInterests: 'Música y juegos de estímulo',
                specialNotes: ''
              }
            ]
          };

          setUser(fullUser);
          setAccounts((prev) => {
            const exists = prev.some((a) => a.email.toLowerCase() === cleanEmail);
            return exists ? prev.map((a) => (a.email.toLowerCase() === cleanEmail ? fullUser : a)) : [fullUser, ...prev];
          });
          return { success: true, user: fullUser };
        }
      }
    } catch (apiErr) {
      console.warn('API login error, continuing with client-side fallback:', apiErr);
    }

    // 2. Fallback to client accounts
    const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      setUser(existing);
      return { success: true, user: existing };
    }

    // Auto-create local user
    const newChildId = 'child-' + Date.now();
    const newUser: ExtendedParentUser = {
      id: 'usr-' + Date.now(),
      name: name.trim() || 'Padre de Familia',
      email: cleanEmail,
      password: password || '123456',
      role: role || 'mamá',
      systemRole: cleanEmail.includes('admin') ? 'admin' : cleanEmail.includes('dev') ? 'developer' : 'user',
      children: [
        {
          id: newChildId,
          name: 'Mi Peque',
          birthDate: '2025-08-01',
          ageMonths: 12,
          gender: 'boy',
          birthWeightKg: 3.4,
          currentWeightKg: 9.6,
          currentHeightCm: 75.0,
          feedingType: 'solids',
          allergiesKnown: 'Ninguna',
          medicalConditions: 'Sano',
          favoriteInterests: 'Música y cuentos',
          specialNotes: ''
        }
      ],
      activeChildId: newChildId,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAccounts((prev) => [newUser, ...prev]);
    setUser(newUser);
    return { success: true, user: newUser };
  };

  // Google 1-Click Auth ($0 free implementation)
  const loginWithGoogle = async (
    email = 'valecruz20008@gmail.com',
    name = 'Valentina Cruz',
    avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    preferredRole: PlatformRole = 'user'
  ) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, avatar, preferredRole })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.user) {
          const localMatch = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
          const fullUser: ExtendedParentUser = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: localMatch?.role || 'mamá',
            systemRole: data.user.role || preferredRole,
            avatar: data.user.avatar || avatar,
            isGoogleAuth: true,
            createdAt: data.user.createdAt,
            activeChildId: localMatch?.activeChildId || 'child-1',
            children: localMatch?.children || [
              {
                id: 'child-1',
                name: 'Mateo',
                birthDate: '2025-08-16',
                ageMonths: 12,
                gender: 'boy',
                birthWeightKg: 3.4,
                currentWeightKg: 9.6,
                currentHeightCm: 75.5,
                feedingType: 'solids',
                allergiesKnown: 'Ninguna conocida',
                medicalConditions: 'Control pediátrico regular, vacunas al día',
                favoriteInterests: 'Le encantan los animales, la música alegre y jugar a las escondidas',
                specialNotes: 'Duerme en su cunita con canciones de cuna'
              }
            ]
          };

          setUser(fullUser);
          setAccounts((prev) => {
            const filtered = prev.filter((a) => a.email.toLowerCase() !== email.toLowerCase());
            return [fullUser, ...filtered];
          });
          return { success: true, user: fullUser };
        }
      }
    } catch (e) {
      console.warn('Google server auth fallback:', e);
    }

    // Fallback instant Google login
    const preset = DEMO_PRESET_USERS.find((p) => p.email.toLowerCase() === email.toLowerCase()) || DEMO_PRESET_USERS[0];
    const googleUser = { ...preset, systemRole: preferredRole };
    setUser(googleUser);
    return { success: true, user: googleUser };
  };

  // Instant demo role login for evaluation
  const loginDemoRole = (role: PlatformRole) => {
    let preset: ExtendedParentUser;
    if (role === 'admin') {
      preset = DEMO_PRESET_USERS[3]; // Dra. Elena Ramos (admin)
    } else if (role === 'developer') {
      preset = DEMO_PRESET_USERS[5]; // Ing. Alex Valdés (developer)
    } else {
      preset = DEMO_PRESET_USERS[0]; // Valentina Cruz (user)
    }
    setUser(preset);
  };

  // Register handler
  const register = async (
    name: string,
    email: string,
    password = 'usuario123',
    role: 'mamá' | 'papá' | 'tutor' | 'familiar' = 'mamá',
    initialChild?: Partial<ChildProfile>,
    systemRole: PlatformRole = 'user'
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName || !cleanEmail) {
      return { success: false, message: 'El nombre y correo son obligatorios.' };
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, password, role: systemRole })
      });
      if (res.ok) {
        const data = await res.json();
        if (!data.success) {
          return { success: false, message: data.error || 'Error al registrar usuario.' };
        }
      }
    } catch (e) {
      console.warn('Server registration error, saving locally:', e);
    }

    const newChildId = 'child-' + Date.now();
    const newChild: ChildProfile = {
      id: newChildId,
      name: initialChild?.name?.trim() || 'Mi Peque',
      birthDate: initialChild?.birthDate || '2025-08-01',
      ageMonths: initialChild?.ageMonths ?? 12,
      gender: initialChild?.gender || 'boy',
      birthWeightKg: initialChild?.birthWeightKg ?? 3.3,
      currentWeightKg: initialChild?.currentWeightKg ?? 9.5,
      currentHeightCm: initialChild?.currentHeightCm ?? 75,
      feedingType: initialChild?.feedingType || 'solids',
      allergiesKnown: initialChild?.allergiesKnown?.trim() || 'Ninguna conocida',
      medicalConditions: initialChild?.medicalConditions?.trim() || 'Sano/a, controles al día',
      favoriteInterests: initialChild?.favoriteInterests?.trim() || 'Juegos de estimulación, cuentos y música',
      specialNotes: initialChild?.specialNotes?.trim() || ''
    };

    const newUser: ExtendedParentUser = {
      id: 'usr-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: password || '123456',
      role,
      systemRole,
      children: [newChild],
      activeChildId: newChildId,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAccounts((prev) => {
      const filtered = prev.filter((a) => a.email.toLowerCase() !== cleanEmail);
      return [newUser, ...filtered];
    });

    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const switchSystemRole = (newRole: PlatformRole) => {
    if (!user) return;
    const updated = { ...user, systemRole: newRole };
    setUser(updated);
    setAccounts((prev) => prev.map((a) => (a.id === user.id ? updated : a)));
  };

  const addChild = (childData: Omit<ChildProfile, 'id'>) => {
    if (!user) return;
    const newId = 'child-' + Date.now();
    const newChild: ChildProfile = {
      ...childData,
      id: newId
    };

    const updatedUser: ExtendedParentUser = {
      ...user,
      children: [...user.children, newChild],
      activeChildId: newId
    };

    setUser(updatedUser);
    setAccounts((prev) => prev.map((acc) => (acc.id === user.id ? updatedUser : acc)));
  };

  const updateChild = (id: string, updates: Partial<ChildProfile>) => {
    if (!user) return;
    const updatedChildren = user.children.map((c) => (c.id === id ? { ...c, ...updates } : c));
    const updatedUser: ExtendedParentUser = {
      ...user,
      children: updatedChildren
    };

    setUser(updatedUser);
    setAccounts((prev) => prev.map((acc) => (acc.id === user.id ? updatedUser : acc)));
  };

  const setActiveChildId = (id: string) => {
    if (!user) return;
    const updatedUser: ExtendedParentUser = {
      ...user,
      activeChildId: id
    };
    setUser(updatedUser);
    setAccounts((prev) => prev.map((acc) => (acc.id === user.id ? updatedUser : acc)));
  };

  const addHistoryRecord = (record: Omit<BaseHistoryRecord, 'id' | 'timestamp'>) => {
    const newRecord: BaseHistoryRecord = {
      ...record,
      id: 'hist-' + Date.now(),
      timestamp: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    setHistoryRecords((prev) => [newRecord, ...prev]);
  };

  const deleteHistoryRecord = (id: string) => {
    setHistoryRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const clearHistory = (type?: HistoryRecordType) => {
    if (type) {
      setHistoryRecords((prev) => prev.filter((r) => r.type !== type));
    } else {
      setHistoryRecords([]);
    }
  };

  return (
    <FamilyContext.Provider
      value={{
        user,
        activeChild,
        isLoggedIn: Boolean(user),
        isBackofficeAuthorized,
        isDeveloperAuthorized,
        login,
        loginWithGoogle,
        loginDemoRole,
        register,
        logout,
        switchSystemRole,
        addChild,
        updateChild,
        setActiveChildId,
        historyRecords,
        addHistoryRecord,
        deleteHistoryRecord,
        clearHistory
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    return {
      user: DEMO_PRESET_USERS[0],
      activeChild: DEMO_PRESET_USERS[0].children[0] || null,
      isLoggedIn: true,
      isBackofficeAuthorized: true,
      isDeveloperAuthorized: true,
      login: async () => ({ success: true }),
      loginWithGoogle: async () => ({ success: true }),
      loginDemoRole: () => {},
      register: async () => ({ success: true }),
      logout: () => {},
      switchSystemRole: () => {},
      addChild: () => {},
      updateChild: () => {},
      setActiveChildId: () => {},
      historyRecords: INITIAL_DEMO_HISTORY,
      addHistoryRecord: () => {},
      deleteHistoryRecord: () => {},
      clearHistory: () => {}
    };
  }
  return context;
};
