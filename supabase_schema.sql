-- ==============================================================================
-- XIRMO INTERNET — Complete Supabase Database Setup & Admin Creation Script
-- ==============================================================================
-- How to use:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your Project -> Click on "SQL Editor" on the left menu.
-- 3. Click "+ New query", paste this entire script, and click "RUN".
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── 1. CREATE 'packages' TABLE ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL CHECK (provider IN ('safaricom', 'ethiotelecom', 'other')),
  category TEXT NOT NULL CHECK (category IN ('daily', 'weekly', 'monthly', 'custom')),
  name TEXT NOT NULL,
  badge TEXT DEFAULT '',
  subtitle TEXT DEFAULT '',
  data_amount TEXT DEFAULT 'Unlimited',
  data_unit TEXT DEFAULT 'Unlimited',
  duration TEXT NOT NULL,
  price TEXT NOT NULL,
  currency TEXT DEFAULT 'Birr',
  bonus TEXT DEFAULT '',
  description TEXT DEFAULT '',
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ── 2. CREATE 'notifications' TABLE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT DEFAULT 'announcement' CHECK (type IN ('announcement', 'alert', 'promotion', 'maintenance')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ── 3. AUTOMATIC updated_at TRIGGER FUNCTION ─────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_packages_updated_at ON public.packages;
CREATE TRIGGER set_packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_notifications_updated_at ON public.notifications;
CREATE TRIGGER set_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ── 4. ROW LEVEL SECURITY (RLS) POLICIES ─────────────────────────────────────
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public can view active packages" ON public.packages;
DROP POLICY IF EXISTS "Admins full access to packages" ON public.packages;
DROP POLICY IF EXISTS "Public can view active notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins full access to notifications" ON public.notifications;

-- Public can read active packages
CREATE POLICY "Public can view active packages"
  ON public.packages FOR SELECT
  USING (is_active = true);

-- Authenticated admins can perform ALL operations (select, insert, update, delete)
CREATE POLICY "Admins full access to packages"
  ON public.packages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Public can read active notifications
CREATE POLICY "Public can view active notifications"
  ON public.notifications FOR SELECT
  USING (is_active = true);

-- Authenticated admins can perform ALL operations on notifications
CREATE POLICY "Admins full access to notifications"
  ON public.notifications FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── 5. SEED INITIAL INTERNET PACKAGES ────────────────────────────────────────
INSERT INTO public.packages (
  id, provider, category, name, badge, subtitle, data_amount, data_unit,
  duration, price, currency, bonus, description, features, is_active, sort_order
)
VALUES
  (
    'bile',
    'safaricom',
    'monthly',
    'BILE AAN XADIDNAYN',
    'Xirmo Bille ah',
    'Xirmo bille ah oo xawaare sare leh',
    'Unlimited',
    'Unlimited',
    '1 Bil',
    '2,750',
    'Birr',
    '',
    'Xirmo internet oo ku habboon isticmaalka muddada bisha. Hel internet xawaare sare oo aan xad lahayn muddo bil ah.',
    '["Internet Xad la''aan", "Xawaare Sare (4G/5G)", "Xirmo Aamin ah", "Taageero Joogto ah 24/7"]'::jsonb,
    true,
    1
  ),
  (
    'isbuucle',
    'safaricom',
    'weekly',
    'ISBUUCLE AAN XADIDNAYN',
    'Xirmo Toddobaadlaha',
    'Xirmo isbuucle ah',
    'Unlimited',
    'Unlimited',
    '1 Toddobaad',
    '850',
    'Birr',
    '',
    'Xirmo internet oo ku habboon baahiyahaaga toddobaadlaha ah. Xawaare buuxa oo toddobaad oo dhan socda.',
    '["Internet Xad la''aan", "Xawaare Buuxa", "Xirmo Xasilan", "Taageero Joogto ah"]'::jsonb,
    true,
    2
  ),
  (
    'maalinle',
    'safaricom',
    'daily',
    'MAALINLE AAN XADIDNAYN',
    'Xirmo Maalinlaha',
    'Xirmo maalinle ah',
    'Unlimited',
    'Unlimited',
    '1 Maalin',
    '135',
    'Birr',
    '',
    'Xirmo internet oo loogu talagalay isticmaalka maalinlaha ah. Ku habboon kuwa baahi degdeg ah u qaba.',
    '["Internet Xad la''aan", "Xawaare Degdeg ah", "Bilaab Isla Markiiba", "Lacag Jaban"]'::jsonb,
    true,
    3
  ),
  (
    'et-monthly',
    'ethiotelecom',
    'monthly',
    'PREMIUM XADIDNAYN',
    'Xirmo Bille ah',
    'Unlimited Premium: Unlimited Internet',
    'Unlimited',
    'Unlimited',
    '1 Bil',
    '1,850',
    'ETB',
    'Bonus: 300 Birr',
    'Xirmo internet oo Premium ah oo aan xad lahayn. Hel internet xawaare buuxa muddo bil ah.',
    '["Internet Xad la''aan", "Xawaare Premium", "Bonus 300 Birr", "Bilaab Isla Markiiba"]'::jsonb,
    true,
    4
  ),
  (
    'et-weekly',
    'ethiotelecom',
    'weekly',
    'ISBUUCLE XADIDNAYN',
    'Xirmo Toddobaadlaha',
    'Weekly Unlimited Internet',
    'Unlimited',
    'Unlimited',
    '1 Toddobaad',
    '550',
    'ETB',
    'Bonus: 90 Birr',
    'Xirmo internet oo aan xad lahayn toddobaadkiiba. Ku habboon isticmaalka toddobaadlaha ah.',
    '["Internet Xad la''aan", "Xawaare Buuxa", "Bonus 90 Birr", "Taageero Joogto ah"]'::jsonb,
    true,
    5
  ),
  (
    'et-bundle',
    'ethiotelecom',
    'monthly',
    'PREMIUM CODKA + INTERNET',
    'Xirmo Bille ah',
    'Monthly Unlimited Premium Voice + Internet + SMS',
    'Unlimited',
    'Unlimited',
    '1 Bil',
    '2,450',
    'ETB',
    'Bonus: 300 Birr',
    'Xirmo Premium ah oo ku jirta Codka, Internet, iyo SMS oo aan xad lahayn. Hel wax walba hal xirmo.',
    '["Internet Xad la''aan", "Codka Xad la''aan", "SMS Xad la''aan", "Bonus 300 Birr"]'::jsonb,
    true,
    6
  )
ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  data_amount = EXCLUDED.data_amount,
  data_unit = EXCLUDED.data_unit,
  features = EXCLUDED.features,
  updated_at = NOW();

-- ── 6. SEED INITIAL NOTIFICATIONS ────────────────────────────────────────────
INSERT INTO public.notifications (id, title, description, type, is_active)
VALUES
  (
    'notif-1',
    'Ku soo dhawoow Xirmo Internet!',
    'Waxaan kuu heynaa xirmooyinka ugu fiican ee SafariCom iyo EthioTelecom qiimo jaban oo ku qanciya. Dalbo xirmadaada maanta.',
    'announcement',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- ── 7. CREATE AUTHORIZED ADMIN USER IN SUPABASE AUTH ─────────────────────────
-- Creates admin@xirmo.so with password 'AdminPassword123!' and role 'admin'
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Check if user already exists
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@xirmo.so';

  IF v_user_id IS NULL THEN
    -- Generate new UUID for admin
    v_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      'admin@xirmo.so',
      crypt('AdminPassword123!', gen_salt('bf')),
      NOW(),
      '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb,
      '{"role": "admin"}'::jsonb,
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );

    -- Also insert into auth.identities
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    )
    VALUES (
      v_user_id,
      v_user_id,
      format('{"sub":"%s","email":"%s"}', v_user_id::text, 'admin@xirmo.so')::jsonb,
      'email',
      v_user_id::text,
      NOW(),
      NOW(),
      NOW()
    );
  ELSE
    -- If user already exists, ensure role is admin
    UPDATE auth.users
    SET
      raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb,
      raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb,
      updated_at = NOW()
    WHERE id = v_user_id;
  END IF;
END $$;
