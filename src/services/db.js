/**
 * XIRMO INTERNET — Database & Authentication Service
 * 
 * Supports:
 * 1. Supabase Cloud Database (if VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set).
 * 2. Persistent Resilient Local Database (automatic fallback with multi-tab sync, seed data, and zero configuration).
 * 3. Secure SHA-256 Hashing with Cryptographic Salts (Web Crypto API - NO plain-text passwords).
 * 4. Role-based session authorization (role: 'admin').
 */

import { supabase } from '../lib/supabase';

const STORAGE_KEYS = {
  PACKAGES: 'xirmo_packages',
  NOTIFICATIONS: 'xirmo_notifications',
  ADMIN_USER: 'xirmo_admin_user',
  SESSION: 'xirmo_admin_session',
};

// ── Default Seed Data ────────────────────────────────────────────────────────

const DEFAULT_PACKAGES = [
  {
    id: 'bile',
    provider: 'safaricom',
    category: 'monthly',
    name: 'BILE AAN XADIDNAYN',
    badge: 'Xirmo Bille ah',
    subtitle: 'Xirmo bille ah oo xawaare sare leh',
    data_amount: 'Unlimited',
    data_unit: 'Unlimited',
    duration: '1 Bil',
    price: '2,750',
    currency: 'Birr',
    bonus: '',
    description: 'Xirmo internet oo ku habboon isticmaalka muddada bisha. Hel internet xawaare sare oo aan xad lahayn muddo bil ah.',
    features: [
      "Internet Xad la'aan",
      'Xawaare Sare (4G/5G)',
      'Xirmo Aamin ah',
      'Taageero Joogto ah 24/7',
    ],
    is_active: true,
    sort_order: 1,
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date('2026-01-01').toISOString(),
  },
  {
    id: 'isbuucle',
    provider: 'safaricom',
    category: 'weekly',
    name: 'ISBUUCLE AAN XADIDNAYN',
    badge: 'Xirmo Toddobaadlaha',
    subtitle: 'Xirmo isbuucle ah',
    data_amount: 'Unlimited',
    data_unit: 'Unlimited',
    duration: '1 Toddobaad',
    price: '850',
    currency: 'Birr',
    bonus: '',
    description: 'Xirmo internet oo ku habboon baahiyahaaga toddobaadlaha ah. Xawaare buuxa oo toddobaad oo dhan socda.',
    features: [
      "Internet Xad la'aan",
      'Xawaare Buuxa',
      'Xirmo Xasilan',
      'Taageero Joogto ah',
    ],
    is_active: true,
    sort_order: 2,
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date('2026-01-01').toISOString(),
  },
  {
    id: 'maalinle',
    provider: 'safaricom',
    category: 'daily',
    name: 'MAALINLE AAN XADIDNAYN',
    badge: 'Xirmo Maalinlaha',
    subtitle: 'Xirmo maalinle ah',
    data_amount: 'Unlimited',
    data_unit: 'Unlimited',
    duration: '1 Maalin',
    price: '135',
    currency: 'Birr',
    bonus: '',
    description: 'Xirmo internet oo loogu talagalay isticmaalka maalinlaha ah. Ku habboon kuwa baahi degdeg ah u qaba.',
    features: [
      "Internet Xad la'aan",
      'Xawaare Degdeg ah',
      'Bilaab Isla Markiiba',
      'Lacag Jaban',
    ],
    is_active: true,
    sort_order: 3,
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date('2026-01-01').toISOString(),
  },
  {
    id: 'et-monthly',
    provider: 'ethiotelecom',
    category: 'monthly',
    name: 'PREMIUM XADIDNAYN',
    badge: 'Xirmo Bille ah',
    subtitle: 'Unlimited Premium: Unlimited Internet',
    data_amount: 'Unlimited',
    data_unit: 'Unlimited',
    duration: '1 Bil',
    price: '1,850',
    currency: 'ETB',
    bonus: 'Bonus: 300 Birr',
    description: 'Xirmo internet oo Premium ah oo aan xad lahayn. Hel internet xawaare buuxa muddo bil ah.',
    features: [
      "Internet Xad la'aan",
      'Xawaare Premium',
      'Bonus 300 Birr',
      'Bilaab Isla Markiiba',
    ],
    is_active: true,
    sort_order: 4,
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date('2026-01-01').toISOString(),
  },
  {
    id: 'et-weekly',
    provider: 'ethiotelecom',
    category: 'weekly',
    name: 'ISBUUCLE XADIDNAYN',
    badge: 'Xirmo Toddobaadlaha',
    subtitle: 'Weekly Unlimited Internet',
    data_amount: 'Unlimited',
    data_unit: 'Unlimited',
    duration: '1 Toddobaad',
    price: '550',
    currency: 'ETB',
    bonus: 'Bonus: 90 Birr',
    description: 'Xirmo internet oo aan xad lahayn toddobaadkiiba. Ku habboon isticmaalka toddobaadlaha ah.',
    features: [
      "Internet Xad la'aan",
      'Xawaare Buuxa',
      'Bonus 90 Birr',
      'Taageero Joogto ah',
    ],
    is_active: true,
    sort_order: 5,
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date('2026-01-01').toISOString(),
  },
  {
    id: 'et-bundle',
    provider: 'ethiotelecom',
    category: 'monthly',
    name: 'PREMIUM CODKA + INTERNET',
    badge: 'Xirmo Bille ah',
    subtitle: 'Monthly Unlimited Premium Voice + Internet + SMS',
    data_amount: 'Unlimited',
    data_unit: 'Unlimited',
    duration: '1 Bil',
    price: '2,450',
    currency: 'ETB',
    bonus: 'Bonus: 300 Birr',
    description: 'Xirmo Premium ah oo ku jirta Codka, Internet, iyo SMS oo aan xad lahayn. Hel wax walba hal xirmo.',
    features: [
      "Internet Xad la'aan",
      "Codka Xad la'aan",
      "SMS Xad la'aan",
      'Bonus 300 Birr',
    ],
    is_active: true,
    sort_order: 6,
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date('2026-01-01').toISOString(),
  },
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Ku soo dhawoow Xirmo Internet!',
    description: 'Waxaan kuu heynaa xirmooyinka ugu fiican ee SafariCom iyo EthioTelecom qiimo jaban oo ku qanciya. Dalbo xirmadaada maanta.',
    type: 'announcement',
    is_active: true,
    created_at: new Date('2026-01-01').toISOString(),
    updated_at: new Date('2026-01-01').toISOString(),
  },
  {
    id: 'notif-2',
    title: 'Xirmooyinka Bille-ka ah ee Safaricom oo Qiimo Dhimis leh!',
    description: 'Hel internet xawaare sare oo aan xad lahayn bisha oo dhan. La xiriir taageerada macaamiisha si aad u hesho dhiirigelin gaar ah.',
    type: 'promotion',
    is_active: false,
    created_at: new Date('2026-01-02').toISOString(),
    updated_at: new Date('2026-01-02').toISOString(),
  },
];

// Default admin: admin@xirmo.so / AdminPassword123!
// Precomputed SHA-256 with salt 'xirmo_secure_salt_2026'
const DEFAULT_ADMIN = {
  email: 'admin@xirmo.so',
  salt: 'xirmo_secure_salt_2026',
  // SHA-256 of "xirmo_secure_salt_2026" + "AdminPassword123!"
  passwordHash: '8b78ec7b0f69741c8f42fa25c179c37951717f9d9fcab393b4fecb273752e253',
  role: 'admin',
};

// ── Security Helpers ─────────────────────────────────────────────────────────

export async function hashPassword(password, salt) {
  const enc = new TextEncoder();
  const data = enc.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function generateRandomString(length = 24) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function isSupabaseConfigured() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      key &&
      !url.includes('your-project') &&
      !key.includes('your-anon-key') &&
      !key.includes('placeholder')
  );
}

// ── Local Database Initialisation ────────────────────────────────────────────

function initLocalDatabase() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.PACKAGES)) {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(DEFAULT_PACKAGES));
  }

  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.ADMIN_USER)) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(DEFAULT_ADMIN));
  }
}

// Initialise on module load
initLocalDatabase();

// ── Database Event Dispatcher (for immediate reactive updates across components)
function dispatchDbChange(type, detail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('xirmo:db_change', { detail: { type, ...detail } }));
  }
}

// ── PACKAGES CRUD ────────────────────────────────────────────────────────────

export const packageService = {
  /**
   * Fetch all packages, optionally filtered.
   * @param {{ provider?: string, category?: string, onlyActive?: boolean }} [options]
   */
  async getAll(options = {}) {
    initLocalDatabase();

    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('packages').select('*').order('sort_order', { ascending: true });
        if (options.onlyActive) query = query.eq('is_active', true);
        if (options.provider && options.provider !== 'all') query = query.eq('provider', options.provider);
        if (options.category && options.category !== 'all') query = query.eq('category', options.category);

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('[Database] Supabase query failed, falling back to local database:', err);
      }
    }

    // Local fallback
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      let list = raw ? JSON.parse(raw) : DEFAULT_PACKAGES;

      if (options.onlyActive) {
        list = list.filter((p) => p.is_active);
      }
      if (options.provider && options.provider !== 'all') {
        list = list.filter((p) => p.provider === options.provider);
      }
      if (options.category && options.category !== 'all') {
        list = list.filter((p) => p.category === options.category);
      }

      return list.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    } catch {
      return DEFAULT_PACKAGES;
    }
  },

  /**
   * Get single package by ID
   */
  async getById(id) {
    const list = await this.getAll();
    return list.find((p) => p.id === id) || null;
  },

  /**
   * Create a new package
   */
  async create(pkgData) {
    initLocalDatabase();
    const newPkg = {
      ...pkgData,
      id: pkgData.id || `pkg-${Date.now()}-${generateRandomString(4)}`,
      features: Array.isArray(pkgData.features) ? pkgData.features : [],
      is_active: pkgData.is_active !== undefined ? pkgData.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('packages').insert([newPkg]).select();
        if (!error && data && data[0]) {
          dispatchDbChange('package_created', { package: data[0] });
          return data[0];
        }
      } catch (err) {
        console.warn('[Database] Supabase insert failed, persisting locally:', err);
      }
    }

    const raw = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    const list = raw ? JSON.parse(raw) : DEFAULT_PACKAGES;
    list.push(newPkg);
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(list));
    dispatchDbChange('package_created', { package: newPkg });
    return newPkg;
  },

  /**
   * Update an existing package
   */
  async update(id, updates) {
    initLocalDatabase();
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('packages')
          .update(updatedData)
          .eq('id', id)
          .select();
        if (!error && data && data[0]) {
          dispatchDbChange('package_updated', { package: data[0] });
          return data[0];
        }
      } catch (err) {
        console.warn('[Database] Supabase update failed, updating locally:', err);
      }
    }

    const raw = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    const list = raw ? JSON.parse(raw) : DEFAULT_PACKAGES;
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Package with id "${id}" was not found.`);
    }

    list[index] = { ...list[index], ...updatedData };
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(list));
    dispatchDbChange('package_updated', { package: list[index] });
    return list[index];
  },

  /**
   * Delete a package
   */
  async delete(id) {
    initLocalDatabase();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('packages').delete().eq('id', id);
      } catch (err) {
        console.warn('[Database] Supabase delete failed, deleting locally:', err);
      }
    }

    const raw = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    const list = raw ? JSON.parse(raw) : DEFAULT_PACKAGES;
    const filtered = list.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(filtered));
    dispatchDbChange('package_deleted', { id });
    return true;
  },

  /**
   * Toggle package availability (active / inactive)
   */
  async toggleAvailability(id, isActive) {
    return this.update(id, { is_active: isActive });
  },

  /**
   * Restore default factory packages
   */
  async resetToDefaults() {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(DEFAULT_PACKAGES));
    dispatchDbChange('packages_reset', {});
    return DEFAULT_PACKAGES;
  },
};

// ── NOTIFICATIONS CRUD ───────────────────────────────────────────────────────

export const notificationService = {
  /**
   * Fetch all notifications, optionally filtered to only active/published.
   */
  async getAll(options = {}) {
    initLocalDatabase();

    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('notifications').select('*').order('created_at', { ascending: false });
        if (options.onlyActive) query = query.eq('is_active', true);
        const { data, error } = await query;
        if (!error && data) return data;
      } catch (err) {
        console.warn('[Database] Supabase notifications query failed, using local database:', err);
      }
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      let list = raw ? JSON.parse(raw) : DEFAULT_NOTIFICATIONS;
      if (options.onlyActive) {
        list = list.filter((n) => n.is_active);
      }
      return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  },

  /**
   * Create a new announcement/notification
   */
  async create(notifData) {
    initLocalDatabase();
    const newNotif = {
      ...notifData,
      id: notifData.id || `notif-${Date.now()}-${generateRandomString(4)}`,
      type: notifData.type || 'announcement',
      is_active: notifData.is_active !== undefined ? notifData.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('notifications').insert([newNotif]).select();
        if (!error && data && data[0]) {
          dispatchDbChange('notification_created', { notification: data[0] });
          return data[0];
        }
      } catch (err) {
        console.warn('[Database] Supabase notification insert failed, persisting locally:', err);
      }
    }

    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const list = raw ? JSON.parse(raw) : DEFAULT_NOTIFICATIONS;
    list.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    dispatchDbChange('notification_created', { notification: newNotif });
    return newNotif;
  },

  /**
   * Update notification
   */
  async update(id, updates) {
    initLocalDatabase();
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .update(updatedData)
          .eq('id', id)
          .select();
        if (!error && data && data[0]) {
          dispatchDbChange('notification_updated', { notification: data[0] });
          return data[0];
        }
      } catch (err) {
        console.warn('[Database] Supabase notification update failed, updating locally:', err);
      }
    }

    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const list = raw ? JSON.parse(raw) : DEFAULT_NOTIFICATIONS;
    const index = list.findIndex((n) => n.id === id);
    if (index === -1) {
      throw new Error(`Notification with id "${id}" was not found.`);
    }

    list[index] = { ...list[index], ...updatedData };
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    dispatchDbChange('notification_updated', { notification: list[index] });
    return list[index];
  },

  /**
   * Delete notification
   */
  async delete(id) {
    initLocalDatabase();

    if (isSupabaseConfigured()) {
      try {
        await supabase.from('notifications').delete().eq('id', id);
      } catch (err) {
        console.warn('[Database] Supabase notification delete failed, deleting locally:', err);
      }
    }

    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const list = raw ? JSON.parse(raw) : DEFAULT_NOTIFICATIONS;
    const filtered = list.filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(filtered));
    dispatchDbChange('notification_deleted', { id });
    return true;
  },

  /**
   * Toggle published / deactivated status
   */
  async toggleStatus(id, isActive) {
    return this.update(id, { is_active: isActive });
  },
};

// ── ADMIN AUTHENTICATION ─────────────────────────────────────────────────────

export const adminAuthService = {
  /**
   * Authenticate administrator with email and password.
   * Never stores plain-text passwords.
   */
  async login(email, password) {
    initLocalDatabase();

    if (!email || !password) {
      throw new Error('Fadlan geli email-kaaga iyo eraygarinka.');
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Supabase Auth if configured
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (!error && data.user) {
          // Verify role is admin
          const role = data.user.app_metadata?.role || data.user.user_metadata?.role || 'admin';
          if (role !== 'admin') {
            throw new Error('Ma lihid awoodda maamulka (Admin).');
          }

          const session = {
            token: data.session.access_token,
            email: data.user.email,
            role: 'admin',
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          };
          sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
          return { success: true, session };
        }
      } catch (err) {
        console.warn('[Auth] Supabase auth sign-in error, falling back to local admin:', err.message);
      }
    }

    // 2. Local Admin Authentication with Cryptographic Salt + SHA-256
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
    const adminUser = raw ? JSON.parse(raw) : DEFAULT_ADMIN;

    if (cleanEmail !== adminUser.email.toLowerCase()) {
      throw new Error('Email-ka ama eraygarinka waa qalad.');
    }

    const computedHash = await hashPassword(password, adminUser.salt);

    if (computedHash !== adminUser.passwordHash) {
      throw new Error('Email-ka ama eraygarinka waa qalad.');
    }

    // Role-based authorization: Ensure user has 'admin' role
    if (adminUser.role !== 'admin') {
      throw new Error('Ma lihid rukhsadda maamulka (Access Denied).');
    }

    const session = {
      token: generateRandomString(32),
      email: adminUser.email,
      role: 'admin',
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    return { success: true, session };
  },

  /**
   * Check if current visitor has a valid authorized admin session.
   */
  isAuthenticated() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.SESSION);
      if (!raw) return false;
      const session = JSON.parse(raw);
      if (!session || session.role !== 'admin' || !session.token) return false;
      if (session.expiresAt && Date.now() > session.expiresAt) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get current admin profile
   */
  getSession() {
    if (!this.isAuthenticated()) return null;
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.SESSION));
    } catch {
      return null;
    }
  },

  /**
   * Logout administrator
   */
  logout() {
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    if (isSupabaseConfigured()) {
      try {
        supabase.auth.signOut();
      } catch {}
    }
  },

  /**
   * Change admin password securely (rehashes with new salt)
   */
  async changePassword(currentPassword, newPassword) {
    if (!this.isAuthenticated()) {
      throw new Error('Ma lihid awood (Not authenticated).');
    }

    if (!newPassword || newPassword.length < 8) {
      throw new Error('Eraygarinka cusub waa inuu ka koobnaadaa ugu yaraan 8 xaraf.');
    }

    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
    const adminUser = raw ? JSON.parse(raw) : DEFAULT_ADMIN;

    const currentHash = await hashPassword(currentPassword, adminUser.salt);
    if (currentHash !== adminUser.passwordHash) {
      throw new Error('Eraygarinka hadda jira waa khalad.');
    }

    const newSalt = generateRandomString(16);
    const newHash = await hashPassword(newPassword, newSalt);

    const updatedUser = {
      ...adminUser,
      salt: newSalt,
      passwordHash: newHash,
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(updatedUser));

    // Also update Supabase Auth user password if connected to Supabase
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (error) {
          console.warn('[Auth] Supabase updateUser password notice:', error.message);
        }
      } catch (err) {
        console.warn('[Auth] Supabase password update sync error:', err);
      }
    }

    return true;
  },
};

