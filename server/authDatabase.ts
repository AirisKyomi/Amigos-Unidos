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
  private appwriteConfig: { endpoint: string; projectId: string; databaseId: string; tableId: string; apiKey: string } | null = null;

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

  public async initialize(): Promise<void> {
    const apiKey = process.env.APPWRITE_API_KEY?.trim();
    if (!apiKey) {
      console.warn('[AuthDB] APPWRITE_API_KEY is not set; using local JSON storage.');
      return;
    }

    const endpoint = (process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1').replace(/\/$/, '');
    const projectId = process.env.APPWRITE_PROJECT_ID || '6abdb808003866955dee';
    const databaseId = process.env.APPWRITE_DATABASE_ID || '6abdb89a00353e365405';
    const tableId = process.env.APPWRITE_TABLE_ID || '6abdb8ad001eae55986d';
    this.appwriteConfig = { endpoint, projectId, databaseId, tableId, apiKey };

    const rows = await this.listRemoteUsers();
    if (rows.length > 0) {
      this.users.clear();
      for (const row of rows) {
        const user = this.parseRemoteUser(row);
        this.users.set(user.email.toLowerCase(), user);
      }
      console.info(`[AuthDB] Loaded ${rows.length} users from Appwrite.`);
      return;
    }

    for (const user of this.users.values()) {
      await this.persistRemoteUser(user);
    }
    console.info(`[AuthDB] Initialized Appwrite with ${this.users.size} existing local users.`);
  }

  private async appwriteRequest(route: string, init: RequestInit = {}): Promise<any> {
    if (!this.appwriteConfig) throw new Error('Appwrite is not configured.');
    const response = await fetch(`${this.appwriteConfig.endpoint}${route}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': this.appwriteConfig.projectId,
        'X-Appwrite-Key': this.appwriteConfig.apiKey,
        ...(init.headers || {})
      }
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(body.message || `Appwrite request failed (${response.status}).`) as Error & { code?: number };
      error.code = response.status;
      throw error;
    }
    return body;
  }

  private async listRemoteUsers(): Promise<any[]> {
    if (!this.appwriteConfig) return [];
    const { databaseId, tableId } = this.appwriteConfig;
    const rows: any[] = [];
    let offset = 0;
    while (true) {
      const query = encodeURIComponent(JSON.stringify({ method: 'limit', values: [100] }));
      const offsetQuery = encodeURIComponent(JSON.stringify({ method: 'offset', values: [offset] }));
      const result = await this.appwriteRequest(
        `/tablesdb/${databaseId}/tables/${tableId}/rows?queries[]=${query}&queries[]=${offsetQuery}`
      );
      const page = Array.isArray(result.rows) ? result.rows : [];
      rows.push(...page);
      if (page.length < 100) return rows.filter((row) => this.isRemoteUserRow(row));
      offset += page.length;
    }
  }

  private isRemoteUserRow(row: any): boolean {
    try {
      const payload = JSON.parse(row.payload);
      return typeof payload?.email === 'string'
        && typeof payload?.passwordHash === 'string'
        && typeof payload?.salt === 'string';
    } catch {
      return false;
    }
  }

  private parseRemoteUser(row: any): UserRecord {
    const user = JSON.parse(row.payload) as UserRecord;
    if (!user.email || !user.passwordHash || !user.salt) {
      throw new Error(`Invalid user row in Appwrite: ${row.$id}`);
    }
    return { ...user, id: user.id || row.$id, email: user.email.toLowerCase().trim() };
  }

  private async findRemoteUser(email: string): Promise<any | null> {
    if (!this.appwriteConfig) return null;
    const { databaseId, tableId } = this.appwriteConfig;
    const query = encodeURIComponent(JSON.stringify({ method: 'equal', attribute: 'email', values: [email.toLowerCase().trim()] }));
    const result = await this.appwriteRequest(
      `/tablesdb/${databaseId}/tables/${tableId}/rows?queries[]=${query}&queries[]=${encodeURIComponent(JSON.stringify({ method: 'limit', values: [1] }))}`
    );
    return result.rows?.[0] || null;
  }

  private async persistRemoteUser(user: UserRecord): Promise<void> {
    if (!this.appwriteConfig) return;
    const { databaseId, tableId } = this.appwriteConfig;
    const existing = await this.findRemoteUser(user.email);
    const data = { email: user.email.toLowerCase(), payload: JSON.stringify(user) };
    if (existing) {
      await this.appwriteRequest(`/tablesdb/${databaseId}/tables/${tableId}/rows/${encodeURIComponent(existing.$id)}`, {
        method: 'PATCH', body: JSON.stringify({ data })
      });
      return;
    }
    await this.appwriteRequest(`/tablesdb/${databaseId}/tables/${tableId}/rows`, {
      method: 'POST', body: JSON.stringify({ rowId: user.id, data, permissions: [] })
    });
  }

  public async createPublicRecord(type: 'contact' | 'purchase', fields: Record<string, unknown>): Promise<string> {
    if (!this.appwriteConfig) throw new Error('Appwrite no está configurado en el servidor.');
    const { databaseId, tableId } = this.appwriteConfig;
    const id = crypto.randomUUID();
    const data = {
      email: `submission-${id}@records.amigosunidos.invalid`,
      payload: JSON.stringify({ recordType: type, ...fields, submittedAt: new Date().toISOString() }),
    };

    await this.appwriteRequest(`/tablesdb/${databaseId}/tables/${tableId}/rows`, {
      method: 'POST',
      body: JSON.stringify({ rowId: id, data, permissions: [] }),
    });
    return id;
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

  public async registerUser(params: {
    name: string;
    email: string;
    passwordPlain: string;
    role?: PlatformRole;
    isGoogleAuth?: boolean;
    avatar?: string;
  }): Promise<{ success: boolean; user?: Omit<UserRecord, 'passwordHash' | 'salt'>; error?: string }> {
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

    try {
      await this.persistRemoteUser(newUser);
    } catch (error) {
      if ((error as { code?: number }).code === 409) {
        return { success: false, error: 'Ya existe una cuenta registrada con este correo.' };
      }
      throw error;
    }
    this.users.set(cleanEmail, newUser);
    this.saveToDisk();

    const { passwordHash: _, salt: __, ...safeUser } = newUser;
    return { success: true, user: safeUser };
  }

  public async authenticate(email: string, passwordPlain: string): Promise<{
    success: boolean;
    user?: Omit<UserRecord, 'passwordHash' | 'salt'>;
    error?: string;
  }> {
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
    await this.persistRemoteUser(user);
    this.saveToDisk();

    const { passwordHash: _, salt: __, ...safeUser } = user;
    return { success: true, user: safeUser };
  }

  public async authenticateGoogle(params: {
    email: string;
    name: string;
    avatar?: string;
    preferredRole?: PlatformRole;
  }): Promise<{ success: boolean; user: Omit<UserRecord, 'passwordHash' | 'salt'> }> {
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

    await this.persistRemoteUser(user);
    this.saveToDisk();
    const { passwordHash: _, salt: __, ...safeUser } = user;
    return { success: true, user: safeUser };
  }

  public async getAllSafeUsers(): Promise<Omit<UserRecord, 'passwordHash' | 'salt'>[]> {
    return Array.from(this.users.values()).map(({ passwordHash, salt, ...u }) => u);
  }

  public async updateRole(email: string, newRole: PlatformRole): Promise<boolean> {
    const user = this.findByEmail(email);
    if (!user) return false;
    user.role = newRole;
    await this.persistRemoteUser(user);
    this.saveToDisk();
    return true;
  }

  public async updateUser(email: string, updates: Partial<Pick<UserRecord, 'name' | 'role' | 'avatar'>>): Promise<boolean> {
    const user = this.findByEmail(email);
    if (!user) return false;
    if (updates.name) user.name = updates.name.trim();
    if (updates.role) user.role = updates.role;
    if (updates.avatar !== undefined) user.avatar = updates.avatar;
    await this.persistRemoteUser(user);
    this.saveToDisk();
    return true;
  }

  public async resetPassword(email: string, newPasswordPlain: string): Promise<boolean> {
    const user = this.findByEmail(email);
    if (!user) return false;
    const newSalt = generateSalt();
    user.salt = newSalt;
    user.passwordHash = hashPassword(newPasswordPlain, newSalt);
    await this.persistRemoteUser(user);
    this.saveToDisk();
    return true;
  }

  public async deleteUser(email: string): Promise<boolean> {
    const cleanEmail = email.toLowerCase().trim();
    const user = this.users.get(cleanEmail);
    if (!user) return false;
    if (this.appwriteConfig) {
      const row = await this.findRemoteUser(cleanEmail);
      if (row) {
        const { databaseId, tableId } = this.appwriteConfig;
        await this.appwriteRequest(`/tablesdb/${databaseId}/tables/${tableId}/rows/${encodeURIComponent(row.$id)}`, { method: 'DELETE' });
      }
    }
    const existed = this.users.delete(cleanEmail);
    if (existed) {
      this.saveToDisk();
    }
    return existed;
  }

  public async reseedDefaultUsers(): Promise<void> {
    INITIAL_SEED_USERS.forEach((u) => {
      this.users.set(u.email.toLowerCase(), { ...u, lastLogin: new Date().toISOString() });
    });
    for (const user of INITIAL_SEED_USERS) await this.persistRemoteUser(user);
    this.saveToDisk();
  }
}

export const authDatabase = new SimpleAuthDatabase();
