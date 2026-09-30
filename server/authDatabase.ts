import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export type PlatformRole = 'user' | 'admin' | 'developer';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: PlatformRole;
  salt: string;
  passwordHash: string;
  avatar?: string;
  isGoogleAuth?: boolean;
  createdAt: string;
  lastLogin: string;
}

const DB_FILE_PATH = path.join(process.cwd(), 'users_db.json');

// Cryptographic hashing using PBKDF2 (SHA-512) with unique salt
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  const hash = hashPassword(password, salt);
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
  } catch {
    return hash === expectedHash;
  }
}

// Initial seed accounts with pre-hashed credentials
function createSeedUser(
  id: string,
  name: string,
  email: string,
  passwordPlain: string,
  role: PlatformRole,
  isGoogleAuth = false
): UserRecord {
  const salt = generateSalt();
  const passwordHash = hashPassword(passwordPlain, salt);
  return {
    id,
    name,
    email: email.toLowerCase().trim(),
    role,
    salt,
    passwordHash,
    avatar: isGoogleAuth
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      : undefined,
    isGoogleAuth,
    createdAt: '2026-08-01T10:00:00.000Z',
    lastLogin: new Date().toISOString()
  };
}

const INITIAL_SEED_USERS: UserRecord[] = [
  // 3 Cuentas de Usuario Ficticias (Familia)
  createSeedUser(
    'usr-valecruz',
    'Valentina Cruz',
    'valecruz20008@gmail.com',
    'usuario123',
    'user',
    true
  ),
  createSeedUser(
    'usr-camila-santos',
    'Camila Santos',
    'camila.santos@gmail.com',
    'usuario123',
    'user',
    true
  ),
  createSeedUser(
    'usr-diego-morales',
    'Diego Morales',
    'diego.morales@gmail.com',
    'usuario123',
    'user',
    false
  ),

  // 2 Cuentas de Admin (Supervisión Clínica)
  createSeedUser(
    'usr-admin-pediatric',
    'Dra. Elena Ramos',
    'admin@amigosunidos.com',
    'admin123',
    'admin',
    false
  ),
  createSeedUser(
    'usr-admin-martinez',
    'Dr. Carlos Martínez',
    'dr.martinez@amigosunidos.com',
    'admin123',
    'admin',
    true
  ),

  // Cuentas de Desarrollador (God Mode)
  createSeedUser(
    'usr-dev-godmode',
    'Ing. Alex Valdés (God Mode)',
    'dev@amigosunidos.ai',
    'dev123',
    'developer',
    false
  ),
  createSeedUser(
    'usr-dev-sofia',
    'Ing. Sofía Chen (Sistemas & Cloud)',
    'sofia.dev@amigosunidos.ai',
    'dev123',
    'developer',
    true
  )
];

class SimpleAuthDatabase {
  private users: Map<string, UserRecord> = new Map();

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const list: UserRecord[] = JSON.parse(raw);
        if (Array.isArray(list) && list.length > 0) {
          list.forEach((u) => this.users.set(u.email.toLowerCase(), u));
          return;
        }
      }
    } catch (err) {
      console.warn('[AuthDB] Could not read users_db.json from disk, using seed:', err);
    }

    // Default to seeds
    INITIAL_SEED_USERS.forEach((u) => this.users.set(u.email.toLowerCase(), u));
    this.saveToDisk();
  }

  private saveToDisk() {
    try {
      const list = Array.from(this.users.values());
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[AuthDB] Could not save users_db.json to disk:', err);
    }
  }

  public findByEmail(email: string): UserRecord | null {
    if (!email) return null;
    return this.users.get(email.toLowerCase().trim()) || null;
  }

  public findById(id: string): UserRecord | null {
    for (const u of this.users.values()) {
      if (u.id === id) return u;
    }
    return null;
  }

  public registerUser(params: {
    name: string;
    email: string;
    passwordPlain: string;
    role?: PlatformRole;
    isGoogleAuth?: boolean;
    avatar?: string;
  }): { success: boolean; user?: Omit<UserRecord, 'passwordHash' | 'salt'>; error?: string } {
    const cleanEmail = params.email.toLowerCase().trim();
    if (!cleanEmail || !params.name.trim()) {
      return { success: false, error: 'Nombre y correo electrónico son requeridos.' };
    }

    if (this.users.has(cleanEmail)) {
      return { success: false, error: 'Ya existe una cuenta registrada con este correo.' };
    }

    const salt = generateSalt();
    const passwordHash = hashPassword(params.passwordPlain || 'temp123456', salt);
    const newUser: UserRecord = {
      id: 'usr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      name: params.name.trim(),
      email: cleanEmail,
      role: params.role || 'user',
      salt,
      passwordHash,
      avatar: params.avatar,
      isGoogleAuth: Boolean(params.isGoogleAuth),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    this.users.set(cleanEmail, newUser);
    this.saveToDisk();

    const { passwordHash: _, salt: __, ...safeUser } = newUser;
    return { success: true, user: safeUser };
  }

  public authenticate(email: string, passwordPlain: string): {
    success: boolean;
    user?: Omit<UserRecord, 'passwordHash' | 'salt'>;
    error?: string;
  } {
    const cleanEmail = email.toLowerCase().trim();
    const user = this.findByEmail(cleanEmail);

    if (!user) {
      return { success: false, error: 'Usuario no encontrado. Verifica tu correo o regístrate.' };
    }

    const isValid = verifyPassword(passwordPlain, user.salt, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Contraseña incorrecta. Intenta nuevamente.' };
    }

    user.lastLogin = new Date().toISOString();
    this.saveToDisk();

    const { passwordHash: _, salt: __, ...safeUser } = user;
    return { success: true, user: safeUser };
  }

  public authenticateGoogle(params: {
    email: string;
    name: string;
    avatar?: string;
    preferredRole?: PlatformRole;
  }): { success: boolean; user: Omit<UserRecord, 'passwordHash' | 'salt'> } {
    const cleanEmail = params.email.toLowerCase().trim();
    let user = this.findByEmail(cleanEmail);

    if (!user) {
      // Auto-provision Google user with 0-cost local storage
      const salt = generateSalt();
      const passwordHash = hashPassword(crypto.randomBytes(24).toString('hex'), salt);
      user = {
        id: 'usr-g-' + Date.now(),
        name: params.name || 'Usuario Google',
        email: cleanEmail,
        role: params.preferredRole || 'user',
        salt,
        passwordHash,
        avatar: params.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        isGoogleAuth: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      this.users.set(cleanEmail, user);
    } else {
      user.lastLogin = new Date().toISOString();
      if (params.avatar) user.avatar = params.avatar;
      if (params.name) user.name = params.name;
    }

    this.saveToDisk();
    const { passwordHash: _, salt: __, ...safeUser } = user;
    return { success: true, user: safeUser };
  }

  public getAllSafeUsers(): Omit<UserRecord, 'passwordHash' | 'salt'>[] {
    return Array.from(this.users.values()).map(({ passwordHash, salt, ...u }) => u);
  }

  public updateRole(email: string, newRole: PlatformRole): boolean {
    const user = this.findByEmail(email);
    if (!user) return false;
    user.role = newRole;
    this.saveToDisk();
    return true;
  }

  public updateUser(email: string, updates: Partial<Pick<UserRecord, 'name' | 'role' | 'avatar'>>): boolean {
    const user = this.findByEmail(email);
    if (!user) return false;
    if (updates.name) user.name = updates.name.trim();
    if (updates.role) user.role = updates.role;
    if (updates.avatar !== undefined) user.avatar = updates.avatar;
    this.saveToDisk();
    return true;
  }

  public resetPassword(email: string, newPasswordPlain: string): boolean {
    const user = this.findByEmail(email);
    if (!user) return false;
    const newSalt = generateSalt();
    user.salt = newSalt;
    user.passwordHash = hashPassword(newPasswordPlain, newSalt);
    this.saveToDisk();
    return true;
  }

  public deleteUser(email: string): boolean {
    const cleanEmail = email.toLowerCase().trim();
    const existed = this.users.delete(cleanEmail);
    if (existed) {
      this.saveToDisk();
    }
    return existed;
  }

  public reseedDefaultUsers(): void {
    INITIAL_SEED_USERS.forEach((u) => {
      this.users.set(u.email.toLowerCase(), { ...u, lastLogin: new Date().toISOString() });
    });
    this.saveToDisk();
  }
}

export const authDatabase = new SimpleAuthDatabase();
