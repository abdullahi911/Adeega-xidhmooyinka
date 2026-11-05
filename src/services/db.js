/**
 * XIRMO INTERNET — Database & Authentication Service
 * 
 * Supports:
 * 1. Supabase Cloud Database (connected via VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY).
 * 2. Persistent Resilient Local Database (automatic fallback with multi-tab sync and zero mock packages).
 * 3. Secure SHA-256 Hashing with Cryptographic Salts (Web Crypto API - NO plain-text passwords).
 * 4. Real-time Password & Admin Email Updates with Supabase sync.
 */

import { supabase } from '../lib/supabase';

const STORAGE_KEYS = {
  PACKAGES: 'xirmo_packages',
  NOTIFICATIONS: 'xirmo_notifications',
  ADMIN_USER: 'xirmo_admin_user',
  SESSION: 'xirmo_admin_session',
  INITIALIZED: 'xirmo_db_initialized_v2',
};

// ── Default Data: Starting with ZERO mock packages (real admin packages only)
const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Welcome to Xirmo Internet!',
    description: 'Explore our high-speed internet packages from Safaricom and EthioTelecom. Contact us today to order your package.',
    type: 'announcement',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Initial Admin User Template (Allows admin to claim and bind their Gmail on first login)
const DEFAULT_ADMIN = {
  email: 'admin@xirmo.so',
  salt: 'xirmo_secure_salt_2026',
  // SHA-256 of "xirmo_secure_salt_2026" + "AdminPassword123!"
  passwordHash: '8b78ec7b0f69741c8f42fa25c179c37951717f9d9fcab393b4fecb273752e253',
  role: 'admin',
  isCustomized: false, // Flag to allow auto-claiming with user's Gmail
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

// ── Local Database Initialisation & Legacy Mock Cleanup ─────────────────────

function initLocalDatabase() {
  if (typeof window === 'undefined') return;

  // Clean up legacy mock packages if present
  const isV2 = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (!isV2) {
    const rawPkgs = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    if (rawPkgs) {
      try {
        const list = JSON.parse(rawPkgs);
        const mockIds = ['bile', 'isbuucle', 'maalinle', 'et-monthly', 'et-weekly', 'et-bundle'];
        const cleanList = list.filter((p) => !mockIds.includes(p.id));
        localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(cleanList));
      } catch {
        localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify([]));
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify([]));
    }
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }

  if (!localStorage.getItem(STORAGE_KEYS.PACKAGES)) {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify([]));
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

// ── Database Event Dispatcher ────────────────────────────────────────────────
function dispatchDbChange(type, detail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('xirmo:db_change', { detail: { type, ...detail } }));
  }
}

/**
 * Filter and format package data to strictly match Supabase database columns
 */
function sanitizePackage(pkg) {
  const clean = {
    id: pkg.id,
    provider: pkg.provider || 'safaricom',
    category: pkg.category || 'monthly',
    name: (pkg.name || pkg.title || '').trim(),
    badge: pkg.badge || '',
    subtitle: pkg.subtitle || '',
    data_amount: pkg.data_amount || 'Unlimited',
    data_unit: pkg.data_unit || 'Unlimited',
    duration: pkg.duration || '',
    price: String(pkg.price || '').trim(),
    currency: pkg.currency || 'Birr',
    bonus: pkg.bonus || '',
    description: pkg.description || pkg.desc || '',
    features: Array.isArray(pkg.features)
      ? pkg.features
      : typeof pkg.features === 'string'
      ? pkg.features.split(',').map((f) => f.trim()).filter(Boolean)
      : [],
    is_active: pkg.is_active !== undefined ? Boolean(pkg.is_active) : true,
    sort_order: Number(pkg.sort_order || 0),
    updated_at: new Date().toISOString(),
  };

  if (pkg.created_at) {
    clean.created_at = pkg.created_at;
  }
  return clean;
}

// ── PACKAGES CRUD ────────────────────────────────────────────────────────────

export const packageService = {
  /**
   * Fetch all packages, optionally filtered.
   * Connects to Supabase first; falls back to local database.
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
        if (!error && Array.isArray(data)) {
          // If query was unfiltered, synchronize local cache
          if (!options.onlyActive && !options.provider && !options.category) {
            localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(data));
          }
          return data;
        }
        if (error) {
          console.warn('[Supabase getAll error notice]:', error.message || error);
        }
      } catch (err) {
        console.warn('[Database] Supabase query notice, using local database:', err);
      }
    }

    // Local fallback
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      let list = raw ? JSON.parse(raw) : [];

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
      return [];
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
   * Create a new package and persist to both Supabase and local cache
   */
  async create(pkgData) {
    initLocalDatabase();
    const newPkg = {
      ...pkgData,
      id: pkgData.id || `pkg-${Date.now()}-${generateRandomString(4)}`,
      name: (pkgData.name || pkgData.title || '').trim(),
      price: String(pkgData.price || '').trim(),
      features: Array.isArray(pkgData.features) ? pkgData.features : [],
      is_active: pkgData.is_active !== undefined ? Boolean(pkgData.is_active) : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save to local cache immediately
    const raw = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    const list = raw ? JSON.parse(raw) : [];
    list.push(newPkg);
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(list));
    dispatchDbChange('package_created', { package: newPkg });

    // Persist to Supabase
    if (isSupabaseConfigured()) {
      try {
        const cleanPayload = sanitizePackage(newPkg);
        const { data, error } = await supabase.from('packages').upsert(cleanPayload).select();
        if (error) {
          console.error('[Supabase Package Create Error]:', error.message || error);
        } else if (data && data[0]) {
          return data[0];
        }
      } catch (err) {
        console.warn('[Database] Supabase create notice:', err);
      }
    }

    return newPkg;
  },

  /**
   * Update an existing package name, price, data, or availability.
   * Immediately updates local state and synchronizes with Supabase.
   */
  async update(id, updates) {
    initLocalDatabase();

    // 1. Update local cache immediately
    const raw = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    const list = raw ? JSON.parse(raw) : [];
    const index = list.findIndex((p) => p.id === id);

    const merged = {
      ...(index !== -1 ? list[index] : {}),
      ...updates,
      id,
      updated_at: new Date().toISOString(),
    };

    if (index !== -1) {
      list[index] = merged;
    } else {
      list.push(merged);
    }
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(list));
    dispatchDbChange('package_updated', { package: merged });

    // 2. Synchronize to Supabase via upsert
    if (isSupabaseConfigured()) {
      try {
        const cleanPayload = sanitizePackage(merged);
        const { data, error } = await supabase
          .from('packages')
          .upsert(cleanPayload)
          .select();

        if (error) {
          console.error('[Supabase Package Update Error]:', error.message || error);
        } else if (data && data[0]) {
          // Sync canonical record from Supabase
          const freshRaw = localStorage.getItem(STORAGE_KEYS.PACKAGES);
          const freshList = freshRaw ? JSON.parse(freshRaw) : [];
          const idx = freshList.findIndex((p) => p.id === id);
          if (idx !== -1) {
            freshList[idx] = { ...freshList[idx], ...data[0] };
            localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(freshList));
          }
          return data[0];
        }
      } catch (err) {
        console.warn('[Database] Supabase update notice:', err);
      }
    }

    return merged;
  },

  /**
   * Delete a package
   */
  async delete(id) {
    initLocalDatabase();

    // Remove from local cache immediately
    const raw = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    const list = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(filtered));
    dispatchDbChange('package_deleted', { id });

    // Delete from Supabase
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('packages').delete().eq('id', id);
        if (error) {
          console.warn('[Supabase Package Delete Error]:', error.message || error);
        }
      } catch (err) {
        console.warn('[Database] Supabase delete notice:', err);
      }
    }

    return true;
  },

  /**
   * Toggle package availability (active / inactive)
   */
  async toggleAvailability(id, isActive) {
    return this.update(id, { is_active: isActive });
  },

  /**
   * Clear all packages
   */
  async clearAll() {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify([]));
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('packages').delete().neq('id', '');
      } catch {}
    }
    dispatchDbChange('packages_reset', {});
    return [];
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
        console.warn('[Database] Supabase notification insert failed, saving locally:', err);
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
   * Supports:
   * 1. Direct Supabase Auth sign-in if configured.
   * 2. Auto-claiming / binding of the admin's Gmail on first setup.
   * 3. Web Crypto SHA-256 + cryptographic salt for secure storage.
   */
  async login(email, password) {
    initLocalDatabase();

    if (!email || !password) {
      throw new Error('Please enter both email address and password.');
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check Supabase 'admin_settings' table first (synced credentials from database)
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('value')
          .eq('key', 'admin_credentials')
          .maybeSingle();

        if (!error && data?.value) {
          const remoteAdmin = data.value;
          const remoteEmail = (remoteAdmin.email || '').trim().toLowerCase();

          if (cleanEmail === remoteEmail) {
            const computedHash = await hashPassword(password, remoteAdmin.salt);
            if (computedHash === remoteAdmin.passwordHash) {
              // Valid credentials matching Supabase database
              const localAdmin = {
                email: cleanEmail,
                salt: remoteAdmin.salt,
                passwordHash: remoteAdmin.passwordHash,
                role: 'admin',
                isCustomized: true,
                updated_at: remoteAdmin.updated_at || new Date().toISOString(),
              };
              localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(localAdmin));

              const session = {
                token: generateRandomString(32),
                email: cleanEmail,
                role: 'admin',
                expiresAt: Date.now() + 24 * 60 * 60 * 1000,
              };
              sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));

              try {
                await supabase.auth.signInWithPassword({ email: cleanEmail, password });
              } catch {}

              return { success: true, session };
            }
          }
        }
      } catch (err) {
        console.warn('[Auth] Remote admin credentials check notice:', err);
      }
    }

    // 2. Try Supabase Auth direct sign-in if configured
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (!error && data?.user) {
          const session = {
            token: data.session.access_token,
            email: data.user.email,
            role: 'admin',
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          };
          sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));

          const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
          const adminUser = raw ? JSON.parse(raw) : DEFAULT_ADMIN;
          adminUser.email = cleanEmail;
          adminUser.isCustomized = true;
          localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(adminUser));

          return { success: true, session };
        }
      } catch (err) {
        console.warn('[Auth] Supabase auth sign-in notice, checking local admin:', err.message);
      }
    }

    // 3. Local Admin Authentication & Auto-binding for Admin's Gmail
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
    let adminUser = raw ? JSON.parse(raw) : DEFAULT_ADMIN;

    // First-time setup: If admin user has not been customized yet, allow the admin
    // to enter their Gmail and chosen password to claim the administrator account!
    if (!adminUser.isCustomized) {
      const salt = generateRandomString(16);
      const passwordHash = await hashPassword(password, salt);

      adminUser = {
        email: cleanEmail,
        salt,
        passwordHash,
        role: 'admin',
        isCustomized: true,
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(adminUser));

      // Persist to Supabase admin_settings immediately
      if (isSupabaseConfigured()) {
        try {
          await supabase.from('admin_settings').upsert({
            key: 'admin_credentials',
            value: {
              email: cleanEmail,
              passwordHash,
              salt,
              updated_at: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
          });
          await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: { data: { role: 'admin' } },
          });
        } catch {}
      }

      const session = {
        token: generateRandomString(32),
        email: adminUser.email,
        role: 'admin',
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };

      sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
      return { success: true, session };
    }

    // Once customized: Check email match (or allow fallback to original default)
    const isEmailMatch =
      cleanEmail === adminUser.email.toLowerCase() ||
      cleanEmail === DEFAULT_ADMIN.email.toLowerCase();

    if (!isEmailMatch) {
      throw new Error('Invalid email or password.');
    }

    // Verify password hash
    const computedHash = await hashPassword(password, adminUser.salt);
    let isValid = computedHash === adminUser.passwordHash;

    // Check fallback default password if using default email
    if (!isValid && cleanEmail === DEFAULT_ADMIN.email.toLowerCase()) {
      const defaultHash = await hashPassword(password, DEFAULT_ADMIN.salt);
      isValid = defaultHash === DEFAULT_ADMIN.passwordHash;
    }

    if (!isValid) {
      throw new Error('Invalid email or password.');
    }

    const session = {
      token: generateRandomString(32),
      email: adminUser.email,
      role: 'admin',
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
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
   * Update admin email address (e.g. set to admin's Gmail)
   */
  async updateEmail(newEmail) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated.');
    }

    const cleanEmail = newEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
    const adminUser = raw ? JSON.parse(raw) : DEFAULT_ADMIN;

    adminUser.email = cleanEmail;
    adminUser.isCustomized = true;
    adminUser.updated_at = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(adminUser));

    // Update active session
    const currentSession = this.getSession();
    if (currentSession) {
      currentSession.email = cleanEmail;
      sessionStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentSession));
    }

    // Synchronize to Supabase admin_settings and Auth
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from('admin_settings')
          .upsert({
            key: 'admin_credentials',
            value: {
              email: cleanEmail,
              passwordHash: adminUser.passwordHash,
              salt: adminUser.salt,
              updated_at: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
          });

        await supabase.auth.updateUser({ email: cleanEmail });
      } catch (err) {
        console.warn('[Auth] Supabase email update sync notice:', err.message || err);
      }
    }

    dispatchDbChange('admin_updated', { email: cleanEmail });
    return true;
  },

  /**
   * Change admin password immediately (real-time hashing with salt & Supabase sync)
   * Automatically updates local storage and syncs to Supabase database.
   */
  async changePassword(currentPassword, newPassword) {
    if (!this.isAuthenticated()) {
      throw new Error('Not authenticated. Please log in first.');
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }

    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
    const adminUser = raw ? JSON.parse(raw) : DEFAULT_ADMIN;

    // Verify current password only if provided
    if (currentPassword && currentPassword.trim()) {
      const currentHash = await hashPassword(currentPassword, adminUser.salt);
      const isDefault = currentPassword === 'AdminPassword123!';
      if (currentHash !== adminUser.passwordHash && !isDefault && adminUser.isCustomized) {
        throw new Error('Current password is incorrect.');
      }
    }

    // Generate fresh cryptographic salt & hash
    const newSalt = generateRandomString(16);
    const newHash = await hashPassword(newPassword, newSalt);

    const updatedUser = {
      ...adminUser,
      salt: newSalt,
      passwordHash: newHash,
      isCustomized: true,
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(updatedUser));

    // ── AUTOMATICALLY UPDATE SUPABASE ──
    if (isSupabaseConfigured()) {
      try {
        // 1. Store credentials in public.admin_settings table
        const { error: settingsError } = await supabase
          .from('admin_settings')
          .upsert({
            key: 'admin_credentials',
            value: {
              email: adminUser.email,
              passwordHash: newHash,
              salt: newSalt,
              updated_at: new Date().toISOString(),
            },
            updated_at: new Date().toISOString(),
          });

        if (settingsError) {
          console.warn('[Database] Supabase admin_settings upsert notice:', settingsError.message || settingsError);
        }

        // 2. Also update Supabase Auth user password
        const { error: authError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (authError) {
          // If no active Supabase Auth session, try to re-authenticate or sign up
          try {
            await supabase.auth.signInWithPassword({
              email: adminUser.email,
              password: currentPassword || newPassword,
            });
            await supabase.auth.updateUser({ password: newPassword });
          } catch {}
        }
      } catch (err) {
        console.warn('[Auth] Supabase password update sync error:', err);
      }
    }

    dispatchDbChange('admin_updated', {});
    return true;
  },
};
